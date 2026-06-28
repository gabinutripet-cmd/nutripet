import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query

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
    const { error } = await supabase
      .from('dietas')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
