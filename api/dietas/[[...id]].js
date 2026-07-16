import { createClient } from '@supabase/supabase-js'
import { requireUser } from '../../lib/auth.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireUser(req, res))) return

  const idParam = req.query.id
  const id = Array.isArray(idParam) ? idParam[0] : idParam

  if (!id) {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('dietas')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const { nome, especie, fase, obs, garantias, ingredientes } = req.body
      if (!nome || !especie || !fase) return res.status(400).json({ error: 'Campos obrigatórios: nome, especie, fase' })
      const { data, error } = await supabase
        .from('dietas')
        .insert([{ nome, especie, fase, obs, garantias, ingredientes }])
        .select()
        .single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    }

    return res.status(405).end()
  }

  if (req.method === 'PUT') {
    const { nome, especie, fase, obs, garantias, ingredientes } = req.body
    const { data, error } = await supabase
      .from('dietas')
      .update({ nome, especie, fase, obs, garantias, ingredientes })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('dietas').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
