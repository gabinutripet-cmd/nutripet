import { createClient } from '@supabase/supabase-js'
import { requireUser } from '../../lib/auth.js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireUser(req, res))) return

  const { id } = req.query

  // Pet + histórico de consultas (com a dieta de cada uma embutida).
  // Usado pela aba "Histórico de dietas" no perfil do paciente.
  if (req.method === 'GET') {
    const { data: pet, error: petError } = await supabase
      .from('tutores_pets').select('*').eq('id', id).single()
    if (petError) return res.status(500).json({ error: petError.message })

    const { data: consultas, error: cError } = await supabase
      .from('consultas').select('*').eq('pet_id', id).order('data_consulta', { ascending: false })
    if (cError) return res.status(500).json({ error: cError.message })

    const dietaIds = [...new Set((consultas || []).map(c => c.dieta_id).filter(Boolean))]
    let dietas = []
    if (dietaIds.length) {
      const { data: d } = await supabase.from('dietas').select('*').in('id', dietaIds)
      dietas = d || []
    }
    const consultasCompletas = (consultas || []).map(c => ({
      ...c,
      dieta: dietas.find(d => d.id === c.dieta_id) || null,
    }))

    return res.status(200).json({ pet, consultas: consultasCompletas })
  }

  if (req.method === 'PUT') {
    const { data, error } = await supabase
      .from('tutores_pets').update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('tutores_pets').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
