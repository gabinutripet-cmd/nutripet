import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      const body = Buffer.concat(chunks)
      const contentType = req.headers['content-type'] || ''
      const boundary = contentType.split('boundary=')[1]
      if (!boundary) return reject(new Error('No boundary'))

      const parts = {}
      const boundaryBuf = Buffer.from('--' + boundary)
      let start = body.indexOf(boundaryBuf) + boundaryBuf.length + 2
      
      while (start < body.length) {
        const end = body.indexOf(boundaryBuf, start)
        if (end === -1) break
        const part = body.slice(start, end - 2)
        const headerEnd = part.indexOf('\r\n\r\n')
        if (headerEnd === -1) { start = end + boundaryBuf.length + 2; continue }
        
        const headerStr = part.slice(0, headerEnd).toString()
        const content = part.slice(headerEnd + 4)
        
        const nameMatch = headerStr.match(/name="([^"]+)"/)
        const filenameMatch = headerStr.match(/filename="([^"]+)"/)
        const ctMatch = headerStr.match(/Content-Type:\s*([^\r\n]+)/)
        
        if (nameMatch) {
          const name = nameMatch[1]
          if (filenameMatch) {
            parts[name] = { buffer: content, filename: filenameMatch[1], contentType: ctMatch?.[1] || 'application/octet-stream' }
          } else {
            parts[name] = content.toString()
          }
        }
        start = end + boundaryBuf.length + 2
      }
      resolve(parts)
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const parts = await parseMultipart(req)
    const { file, fileName } = parts

    if (!file || !file.buffer) return res.status(400).json({ error: 'Arquivo não encontrado' })

    const ext = (fileName || file.filename || 'jpg').split('.').pop().toLowerCase()
    const path = `${parts.petId || Date.now()}.${ext}`
    const mimeType = file.contentType || 'image/jpeg'

    // Delete old file if exists (ignore errors)
    await supabase.storage.from('pet-photos').remove([path]).catch(() => {})

    // Upload
    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(path, file.buffer, { contentType: mimeType, upsert: true })

    if (uploadError) return res.status(500).json({ error: uploadError.message })

    const { data: { publicUrl } } = supabase.storage.from('pet-photos').getPublicUrl(path)

    return res.status(200).json({ url: publicUrl })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
