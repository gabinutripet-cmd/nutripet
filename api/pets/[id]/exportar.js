import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  if (req.method === 'GET') {
    // Buscar pet
    const { data: pet, error: petError } = await supabase
      .from('tutores_pets').select('*').eq('id', id).single()
    if (petError) return res.status(500).json({ error: petError.message })

    // Buscar consultas
    const { data: consultas, error: cError } = await supabase
      .from('consultas').select('*').eq('pet_id', id).order('data_consulta', { ascending: false })
    if (cError) return res.status(500).json({ error: cError.message })

    // Buscar dietas referenciadas
    const dietaIds = [...new Set(consultas.map(c => c.dieta_id).filter(Boolean))]
    let dietas = []
    if (dietaIds.length) {
      const { data: d } = await supabase.from('dietas').select('*').in('id', dietaIds)
      dietas = d || []
    }

    // Montar consultas com dieta embutida
    const consultasCompletas = consultas.map(c => ({
      ...c,
      dieta: dietas.find(d => d.id === c.dieta_id) || null
    }))

    return res.status(200).json({ pet, consultas: consultasCompletas })
  }

  res.status(405).end()
}
