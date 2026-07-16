import { createClient } from '@supabase/supabase-js'
import { requireUser } from '../lib/auth.js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// /api/consultas (cria) e /api/consultas?id=xxx (exclui) via query string.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireUser(req, res))) return

  const { id } = req.query

  if (!id && req.method === 'POST') {
    const { data, error } = await supabase
      .from('consultas').insert([req.body]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (id && req.method === 'DELETE') {
    const { error } = await supabase.from('consultas').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
