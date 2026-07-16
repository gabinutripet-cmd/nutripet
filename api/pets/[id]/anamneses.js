import { createClient } from '@supabase/supabase-js'
import { requireUser } from '../../../lib/auth.js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// /api/pets/:id/anamneses (lista/cria) e
// /api/pets/:id/anamneses?anamneseId=xxx (edita/exclui) via query string.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireUser(req, res))) return

  const { id, anamneseId } = req.query

  if (!anamneseId) {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('anamneses')
        .select('*')
        .eq('pet_id', id)
        .order('created_at', { ascending: false })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('anamneses')
        .insert([{ ...req.body, pet_id: id }])
        .select()
        .single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    }

    return res.status(405).end()
  }

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('anamneses')
      .update(req.body)
      .eq('id', anamneseId)
      .eq('pet_id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('anamneses').delete().eq('id', anamneseId).eq('pet_id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
