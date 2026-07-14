import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Verifies the Supabase access token sent by the frontend and checks it
// against ALLOWED_EMAILS. Sends the 401/403 response itself and returns
// null when the request should stop; otherwise returns the authenticated user.
export async function requireUser(req, res) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'Não autenticado.' })
    return null
  }

  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data?.user) {
    res.status(401).json({ error: 'Sessão inválida ou expirada.' })
    return null
  }

  const email = (data.user.email || '').toLowerCase()
  if (ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(email)) {
    res.status(403).json({ error: 'Acesso não autorizado para este e-mail.' })
    return null
  }

  return data.user
}
