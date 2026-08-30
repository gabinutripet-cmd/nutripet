import { createClient } from '@supabase/supabase-js'
import { requireUser } from '../lib/auth.js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// Dados da tela Financeiro (balanço mensal do consultório).
//   GET    /api/financeiro         → { consultas:[{id,pet_id,data,valor|null}], lancamentos:[<rows>] }
//   POST   /api/financeiro         → cria lançamento avulso  { pet_id?, descricao?, valor, data }
//   PUT    /api/financeiro?id=xxx  → edita lançamento avulso
//   DELETE /api/financeiro?id=xxx  → remove lançamento avulso
//
// "consultas" aqui são anamneses com valor preenchido (o valor cobrado na
// consulta, com data_consulta como data de entrada). "lancamentos" são valores
// avulsos (retornos, pacotes) que não passam por uma anamnese nova.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireUser(req, res))) return

  const { id } = req.query

  if (req.method === 'GET') {
    const [anamnesesRes, lancamentosRes] = await Promise.all([
      // Todas as anamneses (com ou sem valor): a tela usa as sem valor para
      // avisar "consulta sem valor lançado".
      supabase
        .from('anamneses')
        .select('id, pet_id, data_consulta, valor'),
      supabase
        .from('lancamentos_financeiros')
        .select('*')
        .order('data', { ascending: false }),
    ])
    if (anamnesesRes.error) return res.status(500).json({ error: anamnesesRes.error.message })
    if (lancamentosRes.error) return res.status(500).json({ error: lancamentosRes.error.message })

    const consultas = (anamnesesRes.data || [])
      .filter(a => a.data_consulta)
      .map(a => ({
        id: a.id,
        pet_id: a.pet_id,
        data: a.data_consulta,
        valor: a.valor == null ? null : Number(a.valor),
      }))
    return res.status(200).json({ consultas, lancamentos: lancamentosRes.data || [] })
  }

  if (req.method === 'POST') {
    const { pet_id, descricao, valor, data } = req.body || {}
    const valorNum = Number(valor)
    if (!valorNum || valorNum <= 0 || !data) {
      return res.status(400).json({ error: 'Informe um valor e uma data.' })
    }
    const { data: row, error } = await supabase
      .from('lancamentos_financeiros')
      .insert([{
        pet_id: pet_id || null,
        descricao: (descricao || '').trim() || null,
        valor: valorNum,
        data,
      }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(row)
  }

  if (req.method === 'PUT' && id) {
    const { pet_id, descricao, valor, data } = req.body || {}
    const valorNum = Number(valor)
    if (!valorNum || valorNum <= 0 || !data) {
      return res.status(400).json({ error: 'Informe um valor e uma data.' })
    }
    const { data: row, error } = await supabase
      .from('lancamentos_financeiros')
      .update({
        pet_id: pet_id || null,
        descricao: (descricao || '').trim() || null,
        valor: valorNum,
        data,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(row)
  }

  if (req.method === 'DELETE' && id) {
    const { error } = await supabase.from('lancamentos_financeiros').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.status(405).end()
}
