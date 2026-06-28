import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

// ── TOAST ──
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return <div className={`toast ${type}`}><i className={`ti ${type === 'success' ? 'ti-check' : 'ti-x'}`}></i>{msg}</div>
}

// ── BADGE ──
function EspecieBadge({ especie }) {
  return <span className={`badge ${especie === 'cao' ? 'badge-dog' : 'badge-cat'}`}>{especie === 'cao' ? '🐕 Cão' : '🐈 Gato'}</span>
}

// ══════════════════════════════════
// BANCO — Lista
// ══════════════════════════════════
function BancoLista({ dietas, onEditar, onExcluir, onNova }) {
  if (!dietas.length) return (
    <div>
      <div className="empty"><i className="ti ti-database"></i><p>Nenhuma dieta cadastrada.</p></div>
      <button className="btn btn-primary" onClick={onNova}><i className="ti ti-plus"></i> Cadastrar primeira dieta</button>
    </div>
  )
  return (
    <div>
      {dietas.map(d => (
        <div key={d.id} className="diet-item">
          <div>
            <div className="diet-item-name">{d.nome}</div>
            <div className="diet-item-meta">
              <EspecieBadge especie={d.especie} />
              <span className="badge badge-phase">{d.fase}</span>
              <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-2)' }}>{d.ingredientes.length} ingredientes</span>
            </div>
          </div>
          <div className="diet-item-actions">
            <button className="btn btn-sm" onClick={() => onEditar(d)}><i className="ti ti-edit"></i> Editar</button>
            <button className="btn btn-sm btn-danger" onClick={() => onExcluir(d.id)}><i className="ti ti-trash"></i></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ══════════════════════════════════
// BANCO — Formulário
// ══════════════════════════════════
const FASES = ['Manutenção', 'Filhote', 'Gestação / Lactação', 'Idoso', 'Perda de peso', 'Renal', 'Outro']
const emptyIngr = () => ({ _key: Math.random(), n: '', sc: '', u: 'g' })
const emptyForm = () => ({
  nome: '', especie: 'cao', fase: 'Manutenção', obs: '',
  garantias: { pb: '', ee: '', fb: '', mm: '', ca_min: '', ca_max: '', p: '', um: '', em: '' },
  ingredientes: [emptyIngr(), emptyIngr(), emptyIngr()]
})

function BancoForm({ inicial, onSalvar, onCancelar, loading }) {
  const [form, setForm] = useState(inicial || emptyForm())

  useEffect(() => { setForm(inicial || emptyForm()) }, [inicial])

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setGar = (k, v) => setForm(f => ({ ...f, garantias: { ...f.garantias, [k]: v } }))
  const setIngr = (idx, k, v) => setForm(f => {
    const arr = [...f.ingredientes]; arr[idx] = { ...arr[idx], [k]: v }; return { ...f, ingredientes: arr }
  })
  const addIngr = () => setForm(f => ({ ...f, ingredientes: [...f.ingredientes, emptyIngr()] }))
  const removeIngr = idx => setForm(f => ({ ...f, ingredientes: f.ingredientes.filter((_, i) => i !== idx) }))

  const handleSalvar = () => {
    if (!form.nome.trim()) { alert('Informe o nome da dieta.'); return }
    const ingrs = form.ingredientes.filter(i => i.n.trim() && i.sc !== '')
    if (!ingrs.length) { alert('Adicione pelo menos um ingrediente com valor SC.'); return }
    const gars = {}
    Object.entries(form.garantias).forEach(([k, v]) => { if (v !== '') gars[k] = parseFloat(v) })
    onSalvar({ ...form, ingredientes: ingrs.map(({ _key, ...rest }) => ({ ...rest, sc: parseFloat(rest.sc) })), garantias: gars })
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">Identificação</div>
        <div className="form-grid form-grid-2" style={{ marginBottom: 14 }}>
          <div className="field"><label>Nome da dieta</label><input value={form.nome} onChange={e => setField('nome', e.target.value)} placeholder="Ex: Frango Grain Free — Manutenção" /></div>
          <div className="field"><label>Espécie</label>
            <select value={form.especie} onChange={e => setField('especie', e.target.value)}>
              <option value="cao">Cão</option><option value="gato">Gato</option>
            </select>
          </div>
        </div>
        <div className="form-grid form-grid-2">
          <div className="field"><label>Fase / Objetivo</label>
            <select value={form.fase} onChange={e => setField('fase', e.target.value)}>
              {FASES.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="field"><label>Observações / indicações</label><input value={form.obs} onChange={e => setField('obs', e.target.value)} placeholder="Indicações, restrições..." /></div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="dot dot-green" style={{ width: 9, height: 9 }}></span>
            Ingredientes — valores SC (fixos, do Supercrac)
          </div>
          <button className="btn btn-sm" onClick={addIngr}><i className="ti ti-plus"></i> Adicionar</button>
        </div>
        <div className="ingr-header">
          <span>Ingrediente</span><span>Valor SC</span><span>Unidade</span><span></span>
        </div>
        {form.ingredientes.map((ingr, idx) => (
          <div key={ingr._key ?? idx} className="ingr-row-form">
            <input placeholder="Nome do ingrediente" value={ingr.n} onChange={e => setIngr(idx, 'n', e.target.value)} />
            <input type="number" placeholder="0.0" value={ingr.sc} onChange={e => setIngr(idx, 'sc', e.target.value)} min="0" step="0.01" />
            <input placeholder="g" value={ingr.u} onChange={e => setIngr(idx, 'u', e.target.value)} />
            <button className="btn btn-sm btn-danger btn-icon" onClick={() => removeIngr(idx)} aria-label="Remover"><i className="ti ti-x"></i></button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span className="dot dot-green" style={{ width: 9, height: 9 }}></span>
          Níveis de garantia — valores base (Supercrac)
        </div>
        <div className="garantias-grid">
          {[
            ['pb', 'Proteína Bruta mín (g/kg)', '123.87'],
            ['ee', 'Extrato Etéreo mín (g/kg)', '29.99'],
            ['fb', 'Fibra Bruta máx (g/kg)', '10.7'],
            ['mm', 'Matéria Mineral máx (g/kg)', '9.19'],
            ['ca_min', 'Cálcio mín (mg/kg)', '2058'],
            ['ca_max', 'Cálcio máx (mg/kg)', '2516'],
            ['p', 'Fósforo mín (mg/kg)', '1587'],
            ['um', 'Umidade máx (g/kg)', '692'],
            ['em', 'Energia Metabolizável (kcal/kg)', '1465'],
          ].map(([k, label, ph]) => (
            <div key={k} className="field">
              <label>{label}</label>
              <input type="number" placeholder={ph} value={form.garantias[k]} onChange={e => setGar(k, e.target.value)} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 12 }}>
          <i className="ti ti-info-circle" style={{ fontSize: 12, verticalAlign: -1, marginRight: 3 }}></i>
          Mínimos × 0,9 · Máximos × 1,1 · EM e Umidade como referência fixa.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, paddingBottom: 30 }}>
        <button className="btn btn-primary" onClick={handleSalvar} disabled={loading}>
          {loading ? <><span className="spinner"></span> Salvando...</> : <><i className="ti ti-check"></i> Salvar dieta</>}
        </button>
        <button className="btn" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════
// CONSULTA
// ══════════════════════════════════
function Consulta({ dietas, onGerarCardapio }) {
  const [tutor, setTutor] = useState('')
  const [pet, setPet] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0])
  const [espFiltro, setEspFiltro] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [peso, setPeso] = useState('')
  const [fator, setFator] = useState('')
  const [refeicoes, setRefeicoes] = useState('2')

  const filtradas = espFiltro ? dietas.filter(d => d.especie === espFiltro) : dietas
  const dietaSel = dietas.find(d => d.id === selectedId)
  const em = dietaSel?.garantias?.em || 0

  const calcular = () => {
    const p = parseFloat(peso), f = parseFloat(fator), r = parseInt(refeicoes)
    if (!p || !f || !em || p <= 0 || f <= 0) return null
    const nem = Math.pow(p, 0.75) * f
    const consumoKg = nem / em
    const consumoG = consumoKg * 1000
    const porRefei = consumoG / r
    return { nem, consumoKg, consumoG, porRefei }
  }

  const calc = calcular()

  return (
    <div>
      <div className="card">
        <div className="card-title">Identificação</div>
        <div className="form-grid form-grid-3">
          <div className="field"><label>Nome do tutor</label><input value={tutor} onChange={e => setTutor(e.target.value)} placeholder="Ex: Maria Silva" /></div>
          <div className="field"><label>Nome do pet</label><input value={pet} onChange={e => setPet(e.target.value)} placeholder="Ex: Bob" /></div>
          <div className="field"><label>Data</label><input type="date" value={data} onChange={e => setData(e.target.value)} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Selecionar dieta</div>
        <div className="form-grid form-grid-2" style={{ marginBottom: 14 }}>
          <div className="field"><label>Filtrar por espécie</label>
            <select value={espFiltro} onChange={e => { setEspFiltro(e.target.value); setSelectedId(null) }}>
              <option value="">Todas</option><option value="cao">Cão</option><option value="gato">Gato</option>
            </select>
          </div>
        </div>
        {filtradas.length === 0
          ? <div className="empty"><i className="ti ti-salad"></i><p>Nenhuma dieta encontrada.</p></div>
          : filtradas.map(d => (
            <div key={d.id} className={`diet-select-item ${selectedId === d.id ? 'selected' : ''}`} onClick={() => setSelectedId(d.id)}>
              <div className="radio-dot"></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{d.nome}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                  <EspecieBadge especie={d.especie} />
                  <span className="badge badge-phase">{d.fase}</span>
                  <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-2)' }}>{d.ingredientes.length} ingredientes</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span className="dot dot-purple" style={{ width: 9, height: 9 }}></span>
          Variáveis da consulta
        </div>
        <div className="legend" style={{ marginBottom: 16 }}>
          <div className="legend-item"><span className="dot dot-purple"></span> Estes valores são ajustáveis pelo formulador a cada consulta</div>
        </div>
        <div className="form-grid form-grid-3">
          <div className="field field-var">
            <label>Peso do animal (kg)</label>
            <input type="number" value={peso} onChange={e => setPeso(e.target.value)} step="0.1" min="0.1" placeholder="Ex: 3.4" />
          </div>
          <div className="field field-var">
            <label>Fator nutricional</label>
            <input type="number" value={fator} onChange={e => setFator(e.target.value)} step="1" min="1" placeholder="Ex: 130" />
          </div>
          <div className="field" style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '10px 12px', border: '1px solid var(--border)' }}>
            <label style={{ color: 'var(--text-3)' }}>Energia Metab. da dieta (kcal/kg)</label>
            <div style={{ fontSize: 15, fontWeight: 600, color: em ? 'var(--text)' : 'var(--text-2)', marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
              {em ? `${em} kcal/kg` : '— selecione a dieta'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>valor fixo do cadastro</div>
          </div>
        </div>
        <div className="form-grid form-grid-2" style={{ marginTop: 14 }}>
          <div className="field"><label>Refeições por dia</label>
            <select value={refeicoes} onChange={e => setRefeicoes(e.target.value)}>
              <option value="1">1 refeição / dia</option>
              <option value="2">2 refeições / dia</option>
              <option value="3">3 refeições / dia</option>
              <option value="4">4 refeições / dia</option>
            </select>
          </div>
        </div>
      </div>

      {calc && dietaSel && (
        <div>
          <div className="card">
            <div className="card-title">Cálculo nutricional</div>
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-label">NEM</div>
                <div className="stat-value">{calc.nem.toFixed(1)}</div>
                <div className="stat-unit">kcal / dia</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>Peso^0,75 × Fator</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Consumo diário</div>
                <div className="stat-value">{calc.consumoG.toFixed(1)}</div>
                <div className="stat-unit">g / dia</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>NEM ÷ EM × 1000</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Por refeição</div>
                <div className="stat-value">{calc.porRefei.toFixed(1)}</div>
                <div className="stat-unit">g / refeição</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>Consumo ÷ refeições</div>
              </div>
            </div>
            <div className="alert alert-info">
              <i className="ti ti-check"></i>
              <span>{dietaSel.nome} · Consumo: {calc.consumoG.toFixed(1)} g/dia · {refeicoes}x de {calc.porRefei.toFixed(1)} g</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 30 }} className="no-print">
            <button className="btn btn-primary" onClick={() => onGerarCardapio({ dieta: dietaSel, peso: parseFloat(peso), fator: parseFloat(fator), refeicoes: parseInt(refeicoes), calc, tutor, pet, data })}>
              <i className="ti ti-file-text"></i> Gerar cardápio
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════
// CARDÁPIO
// ══════════════════════════════════
function Cardapio({ dados, onNova }) {
  if (!dados) return <div className="empty"><i className="ti ti-file-text"></i><p>Nenhum cardápio gerado ainda.</p></div>

  const { dieta: d, peso, fator, refeicoes, calc, tutor, pet, data: dataRaw } = dados
  const { nem, consumoKg, consumoG, porRefei } = calc
  const em = d.garantias.em
  const dataFmt = dataRaw ? new Date(dataRaw + 'T12:00').toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')

  const garantRows = [
    d.garantias.pb     && ['Proteína Bruta',        'mín', (d.garantias.pb*0.9).toFixed(2),    'g/kg'],
    d.garantias.ee     && ['Extrato Etéreo',         'mín', (d.garantias.ee*0.9).toFixed(2),    'g/kg'],
    d.garantias.fb     && ['Fibra Bruta',            'máx', (d.garantias.fb*1.1).toFixed(2),    'g/kg'],
    d.garantias.mm     && ['Matéria Mineral',        'máx', (d.garantias.mm*1.1).toFixed(2),    'g/kg'],
    d.garantias.ca_min && ['Cálcio',                 'mín', (d.garantias.ca_min*0.9).toFixed(0),'mg/kg'],
    d.garantias.ca_max && ['Cálcio',                 'máx', (d.garantias.ca_max*1.1).toFixed(0),'mg/kg'],
    d.garantias.p      && ['Fósforo',                'mín', (d.garantias.p*0.9).toFixed(0),     'mg/kg'],
    d.garantias.um     && ['Umidade',                'máx', (d.garantias.um*1.1).toFixed(0),    'g/kg'],
    d.garantias.em     && ['Energia Metabolizável',  'ref', d.garantias.em.toFixed(0),           'kcal/kg'],
  ].filter(Boolean)

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => window.print()}><i className="ti ti-printer"></i> Imprimir / Salvar PDF</button>
        <button className="btn" onClick={onNova}><i className="ti ti-plus"></i> Nova consulta</button>
      </div>
      <div className="cp-wrap">
        <div className="cp-card">
          <div className="cp-header">
            <div>
              <div className="cp-brand">🐾 NutriPet</div>
              <div className="cp-brand-sub">Cardápio Nutricional Personalizado</div>
            </div>
            <div>
              <div className="cp-pet-name">{pet || 'Pet'}</div>
              <div className="cp-pet-sub">Tutor: {tutor || 'Tutor'}</div>
              <div className="cp-pet-sub">{dataFmt}</div>
            </div>
          </div>

          <div className="cp-diet-title">{d.nome}</div>
          <div className="cp-diet-meta">{d.especie === 'cao' ? 'Cão' : 'Gato'} · {d.fase} · Peso: {peso} kg</div>

          <div className="cp-calcs">
            <div className="cp-calc">
              <div className="cp-calc-label">NEM</div>
              <div className="cp-calc-val">{nem.toFixed(1)}</div>
              <div className="cp-calc-unit">kcal/dia · fator {fator}</div>
            </div>
            <div className="cp-calc">
              <div className="cp-calc-label">EM da dieta</div>
              <div className="cp-calc-val">{em}</div>
              <div className="cp-calc-unit">kcal/kg</div>
            </div>
            <div className="cp-calc">
              <div className="cp-calc-label">Consumo total</div>
              <div className="cp-calc-val">{consumoG.toFixed(1)}</div>
              <div className="cp-calc-unit">g/dia · {refeicoes}x de {porRefei.toFixed(1)} g</div>
            </div>
          </div>

          <div className="cp-section-title">Ingredientes</div>
          <table className="cp-ingr-table">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th style={{ textAlign: 'right' }}>Total / dia</th>
                <th style={{ textAlign: 'right' }}>Por refeição</th>
              </tr>
            </thead>
            <tbody>
              {d.ingredientes.map((ingr, i) => {
                const gTotal = consumoKg * ingr.sc / 100 * 1000
                const gRefei = gTotal / refeicoes
                return (
                  <tr key={i}>
                    <td>{ingr.n}</td>
                    <td>{gTotal.toFixed(1)} {ingr.u}</td>
                    <td className="bold-val">{gRefei.toFixed(1)} {ingr.u}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="cp-total-row">
                <td>Total</td>
                <td>{consumoG.toFixed(1)} g</td>
                <td>{porRefei.toFixed(1)} g</td>
              </tr>
            </tfoot>
          </table>

          {garantRows.length > 0 && (
            <>
              <div className="cp-section-title" style={{ marginTop: 4 }}>Níveis de garantia</div>
              <table className="cp-garantias-table">
                <thead>
                  <tr><th>Nutriente</th><th>Limite</th><th style={{ textAlign: 'right' }}>Valor</th><th style={{ textAlign: 'right' }}>Un.</th></tr>
                </thead>
                <tbody>
                  {garantRows.map(([nutriente, limite, valor, un], i) => (
                    <tr key={i}><td>{nutriente}</td><td>{limite}</td><td>{valor}</td><td>{un}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {d.obs && <div className="cp-obs"><strong>Observações:</strong> {d.obs}</div>}

          <div className="cp-obs">
            <strong>Modo de preparo:</strong> Pese cada ingrediente separadamente. Cozinhe as proteínas e vegetais. Após esfriar, acrescente o suplemento e o óleo. Misture bem e sirva em temperatura ambiente. Ofereça água fresca à vontade.
          </div>

          <div className="cp-footer">
            Formulado e balanceado no Supercrac · NutriPet · {dataFmt}<br />
            NEM = {peso}^0,75 × {fator} = {nem.toFixed(1)} kcal · Consumo = {nem.toFixed(1)} ÷ {em} = {consumoG.toFixed(1)} g/dia
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════
export default function Home() {
  const [pagina, setPagina] = useState('banco')
  const [bancoTab, setBancoTab] = useState('lista')
  const [dietas, setDietas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editando, setEditando] = useState(null)
  const [cardapioData, setCardapioData] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const fetchDietas = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dietas')
      const data = await res.json()
      setDietas(data)
    } catch {
      showToast('Erro ao carregar dietas.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDietas() }, [fetchDietas])

  const salvarDieta = async (form) => {
    setSaving(true)
    try {
      const method = editando ? 'PUT' : 'POST'
      const url = editando ? `/api/dietas/${editando.id}` : '/api/dietas'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      await fetchDietas()
      setBancoTab('lista')
      setEditando(null)
      showToast(editando ? 'Dieta atualizada!' : 'Dieta cadastrada!')
    } catch {
      showToast('Erro ao salvar. Tente novamente.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const excluirDieta = async (id) => {
    if (!confirm('Excluir esta dieta?')) return
    try {
      await fetch(`/api/dietas/${id}`, { method: 'DELETE' })
      setDietas(prev => prev.filter(d => d.id !== id))
      showToast('Dieta excluída.')
    } catch {
      showToast('Erro ao excluir.', 'error')
    }
  }

  const editarDieta = (d) => {
    const form = {
      nome: d.nome, especie: d.especie, fase: d.fase, obs: d.obs || '',
      garantias: { pb: d.garantias.pb || '', ee: d.garantias.ee || '', fb: d.garantias.fb || '', mm: d.garantias.mm || '', ca_min: d.garantias.ca_min || '', ca_max: d.garantias.ca_max || '', p: d.garantias.p || '', um: d.garantias.um || '', em: d.garantias.em || '' },
      ingredientes: d.ingredientes.map(i => ({ ...i, _key: Math.random() }))
    }
    setEditando({ ...d, ...form })
    setBancoTab('nova')
    setPagina('banco')
  }

  const navItems = [
    { id: 'banco', icon: 'ti-database', label: 'Banco de dietas' },
    { id: 'consulta', icon: 'ti-calculator', label: 'Nova consulta' },
    { id: 'cardapio', icon: 'ti-file-text', label: 'Cardápio gerado' },
  ]

  const topbarMap = {
    banco:    ['Banco de dietas',   'Gerencie as receitas formuladas no Supercrac'],
    consulta: ['Nova consulta',     'Preencha os dados e gere o cardápio'],
    cardapio: ['Cardápio gerado',   'Pronto para imprimir ou salvar como PDF'],
  }

  return (
    <>
      <Head>
        <title>NutriPet — Plataforma de Dietas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </Head>

      <div className="app">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="logo">
            <div className="logo-mark">
              <div className="paw"><i className="ti ti-paw"></i></div>
              NutriPet
            </div>
            <div className="logo-sub">Plataforma de dietas</div>
          </div>
          <div className="nav">
            <div className="nav-group-label">Menu</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${pagina === item.id ? 'active' : ''}`} onClick={() => { setPagina(item.id); if (item.id === 'banco') setBancoTab('lista') }}>
                <i className={`ti ${item.icon}`}></i> {item.label}
              </button>
            ))}
          </div>
          <div className="sidebar-footer"><span>{dietas.length}</span> dietas cadastradas</div>
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h1>{topbarMap[pagina][0]}</h1>
              <p>{topbarMap[pagina][1]}</p>
            </div>
          </div>

          <div className="content">

            {/* BANCO */}
            {pagina === 'banco' && (
              <div>
                <div className="seg">
                  <button className={`seg-btn ${bancoTab === 'lista' ? 'active' : ''}`} onClick={() => { setBancoTab('lista'); setEditando(null) }}>
                    <i className="ti ti-list" style={{ fontSize: 13, marginRight: 4 }}></i> Dietas cadastradas
                  </button>
                  <button className={`seg-btn ${bancoTab === 'nova' ? 'active' : ''}`} onClick={() => { setBancoTab('nova'); setEditando(null) }}>
                    <i className="ti ti-plus" style={{ fontSize: 13, marginRight: 4 }}></i> Cadastrar nova dieta
                  </button>
                </div>

                {bancoTab === 'lista' && (
                  loading
                    ? <div className="loading"><div className="spinner"></div> Carregando dietas...</div>
                    : <BancoLista dietas={dietas} onEditar={editarDieta} onExcluir={excluirDieta} onNova={() => setBancoTab('nova')} />
                )}

                {bancoTab === 'nova' && (
                  <BancoForm
                    inicial={editando}
                    onSalvar={salvarDieta}
                    onCancelar={() => { setBancoTab('lista'); setEditando(null) }}
                    loading={saving}
                  />
                )}
              </div>
            )}

            {/* CONSULTA */}
            {pagina === 'consulta' && (
              loading
                ? <div className="loading"><div className="spinner"></div> Carregando dietas...</div>
                : <Consulta
                    dietas={dietas}
                    onGerarCardapio={(dados) => { setCardapioData(dados); setPagina('cardapio') }}
                  />
            )}

            {/* CARDÁPIO */}
            {pagina === 'cardapio' && (
              <Cardapio dados={cardapioData} onNova={() => setPagina('consulta')} />
            )}

          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
