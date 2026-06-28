import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
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

    if (!nome || !especie || !fase) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, especie, fase' })
    }

    const { data, error } = await supabase
      .from('dietas')
      .insert([{ nome, especie, fase, obs, garantias, ingredientes }])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
