import { createClient } from '@supabase/supabase-js'
import { requireUser } from '../../../lib/auth.js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const GEMINI_MODEL = 'gemini-2.0-flash'

// Converte o histórico de mensagens (formato genérico: role user/assistant,
// content string ou array de blocos {type:'text'|'image', ...}) pro formato
// que a API do Gemini espera (role user/model, parts com text/inline_data).
function paraGeminiContents(mensagens) {
  return mensagens.map(m => {
    const role = m.role === 'assistant' ? 'model' : 'user'
    if (typeof m.content === 'string') return { role, parts: [{ text: m.content }] }
    const parts = m.content.map(bloco => {
      if (bloco.type === 'text') return { text: bloco.text }
      if (bloco.type === 'image') return { inline_data: { mime_type: bloco.source.media_type, data: bloco.source.data } }
      return null
    }).filter(Boolean)
    return { role, parts }
  })
}

// /api/pets/:id/diario — lista (GET) e publica (POST) entradas do diário de
// acompanhamento do pet.
// /api/pets/:id/diario?action=rascunho (POST) — gera ou ajusta um rascunho de
// resumo via IA (Google Gemini, camada gratuita) a partir do texto/fotos que o
// usuário mandar. As imagens só são usadas nessa chamada (nunca salvas em
// disco/storage); o que fica gravado no diário é só o texto final publicado.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!(await requireUser(req, res))) return

  const { id, action } = req.query

  if (req.method === 'POST' && action === 'rascunho') {
    const { messages } = req.body
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'Envie ao menos uma mensagem.' })
    }
    const { data: pet } = await supabase.from('tutores_pets').select('nome_pet, especie').eq('id', id).single()
    const systemPrompt = `Você ajuda uma nutricionista pet a escrever entradas do "diário de acompanhamento" do paciente ${pet?.nome_pet || 'o pet'} (${pet?.especie === 'gato' ? 'gato' : 'cão'}). A profissional vai te mandar anotações soltas — texto e/ou fotos — sobre como o pet está indo na dieta e na rotina. Escreva um resumo claro e objetivo em português, em 1 a 3 parágrafos curtos, em terceira pessoa, pronto para entrar no diário do paciente. Não invente informações que não foram fornecidas. Se pedirem um ajuste, reescreva o resumo inteiro já corrigido — responda só com o texto final do resumo, sem comentários sobre o que mudou.`

    try {
      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada.' })

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: paraGeminiContents(messages),
          }),
        }
      )
      const data = await geminiRes.json()
      if (!geminiRes.ok) {
        return res.status(502).json({ error: 'Erro ao gerar resumo com IA: ' + (data?.error?.message || geminiRes.statusText) })
      }
      const candidato = data.candidates?.[0]
      const texto = candidato?.content?.parts?.map(p => p.text || '').join('') || ''
      if (!texto) {
        return res.status(502).json({ error: `A IA não retornou um resumo (${candidato?.finishReason || 'sem resposta'}).` })
      }
      return res.status(200).json({ resumo: texto.trim() })
    } catch (e) {
      return res.status(502).json({ error: 'Erro ao gerar resumo com IA: ' + e.message })
    }
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('diario_pets')
      .select('*')
      .eq('pet_id', id)
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const resumo = (req.body?.resumo || '').trim()
    if (!resumo) return res.status(400).json({ error: 'Resumo vazio.' })
    const { data, error } = await supabase
      .from('diario_pets')
      .insert([{ pet_id: id, resumo }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).end()
}
