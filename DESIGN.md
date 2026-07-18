# DESIGN.md — NutriPet by Gabi Mascellani

Plataforma de nutrição pet profissional.
Verde vibrante como cor primária de ação, roxo/lilás como acento secundário e de destaque.
Alegre, confiante, profissional — como a identidade do Instagram @gabi_nutripet.

---

## 1. Identidade

**Nome do produto:** NutriPet  
**Tagline:** Plataforma de dietas  
**Proprietária:** Gabi Mascellani · nutri.pet  
**Tom:** Profissional mas acolhedor. Direto. Nunca frio ou clínico demais.  
**Público:** Nutricionista pet (a Gabi) — uso interno de consultório.

---

## 2. Paleta de cores

### Primária — Verde (ação, CTA, sucesso, marca)

| Token         | Hex       | Uso                                      |
|---------------|-----------|------------------------------------------|
| `--green`     | `#2EBD6B` | Botões primários, links, ícone ativo     |
| `--green-mid` | `#1F9B54` | Hover de botões primários                |
| `--green-dark`| `#146638` | Texto sobre fundos verdes claros         |
| `--green-light`| `#E6F9EF` | Fundos de badges, alertas info, cards    |
| `--green-border`| `#A8EACA` | Bordas em contextos verdes              |

### Secundária — Roxo/Lilás (destaque, variáveis, badges especiais)

| Token           | Hex       | Uso                                        |
|-----------------|-----------|--------------------------------------------|
| `--purple`      | `#9B59D4` | Campos variáveis, badges especiais, acentos |
| `--purple-mid`  | `#7B3FB8` | Hover de elementos roxos                   |
| `--purple-dark` | `#512980` | Texto sobre fundos roxos claros            |
| `--purple-light`| `#F3EAFD` | Fundos de campos variáveis                 |
| `--purple-border`| `#D4AAEF` | Bordas de campos variáveis                |

### Neutros

| Token        | Hex       | Uso                              |
|--------------|-----------|----------------------------------|
| `--bg`       | `#F4F3EE` | Fundo de superfícies "afundadas" dentro de um card (stat box, badges neutras, hover, cabeçalho de tabela) — não é mais o fundo da página |
| `--surface`  | `#FFFFFF` | Fundo da página, cards, sidebar, topbar, login |
| `--border`   | `rgba(0,0,0,0.08)` | Bordas padrão              |
| `--border-md`| `rgba(0,0,0,0.14)` | Bordas com mais ênfase     |
| `--text`     | `#1A1A18` | Texto principal                  |
| `--text-2`   | `#5C5C56` | Texto secundário                 |
| `--text-3`   | `#A8A8A2` | Labels, placeholders, hints      |

### Semânticas

| Token         | Hex       | Uso                    |
|---------------|-----------|------------------------|
| `--amber`     | `#D48910` | Avisos, atenção         |
| `--amber-light`| `#FEF3DA` | Fundo de avisos        |
| `--red`       | `#C0392B` | Erros, exclusão         |
| `--red-light` | `#FDECEA` | Fundo de erros         |
| `--blue`      | `#2471A3` | Info, links externos    |
| `--blue-light`| `#EAF4FB` | Fundo de info          |

---

## 3. Tipografia

**Fonte principal:** `DM Sans` (Google Fonts) — sans-serif humanista, amigável e legível.  
**Fonte monospace:** `DM Mono` — para números, cálculos, valores nutricionais.

### Escala

| Uso                     | Tamanho | Peso | Família    |
|-------------------------|---------|------|------------|
| Título de página (h1)   | 16px    | 600  | DM Sans    |
| Subtítulo de card       | 14px    | 500  | DM Sans    |
| Label uppercase         | 10–11px | 600  | DM Sans    |
| Corpo / input           | 13px    | 400  | DM Sans    |
| Valor numérico grande   | 22px    | 600  | DM Mono    |
| Valor numérico inline   | 13px    | 400  | DM Mono    |
| Caption / hint          | 10–11px | 400  | DM Sans    |

### Regras tipográficas

- Labels de campo: UPPERCASE, `letter-spacing: 0.04em`, `font-weight: 600`, `color: var(--text-2)`
- Títulos de seção (card-title): UPPERCASE, `letter-spacing: 0.07em`, `font-weight: 600`, `color: var(--text-3)`
- Valores calculados (NEM, consumo, IMCC): sempre DM Mono
- Sentence case em textos corridos. Nunca ALL CAPS em parágrafos.

---

## 4. Espaçamento e layout

**Sistema:** 4px base  
**Página:** sidebar fixa 224px + main fluid  
**Padding de conteúdo:** `24px 28px`  
**Gap entre cards:** `14px`  
**Gap interno de card:** `14px`  
**Border radius padrão:** `10px` (`--radius`)  
**Border radius cards:** `14px` (`--radius-lg`)

### Grid de formulários

| Classe         | Colunas              | Uso                          |
|----------------|----------------------|------------------------------|
| `form-grid-2`  | `1fr 1fr`            | Campos lado a lado padrão    |
| `form-grid-3`  | `1fr 1fr 1fr`        | Três campos por linha        |
| `form-grid-4`  | `1fr 1fr 1fr 1fr`    | Quatro campos (compacto)     |
| `garantias-grid`| `repeat(3, 1fr)`    | Níveis de garantia           |

---

## 5. Componentes

### Botões

| Variante      | Background        | Texto    | Borda           | Hover                   |
|---------------|-------------------|----------|-----------------|-------------------------|
| Primary       | `--green`         | `#fff`   | `--green`       | `--green-mid`           |
| Default       | `--surface`       | `--text` | `--border-md`   | `--bg`                  |
| Danger        | `--red-light`     | `--red`  | transparent     | `#F7C1C1`              |
| Purple (salvar+ir) | `--purple`   | `#fff`   | `--purple`      | `--purple-mid`          |

- Padding: `8px 16px` (default), `5px 11px` (sm)
- Border radius: `var(--radius)` (10px)
- Font: 13px, weight 500
- Ícone: `font-size: 15px`, gap `6px`
- Active: `transform: scale(0.98)`

### Cards

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--radius-lg); /* 14px */
padding: 20px;
margin-bottom: 14px;
box-shadow: var(--shadow);
```

Mesma regra vale para `.diet-item`, `.diet-select-item`, `.pet-item` e
`.perfil-header` — qualquer superfície branca "flutuando" sobre a página
(também branca) leva `box-shadow: var(--shadow)` para se separar visualmente,
já que a página deixou de ter cor de fundo própria.

Card title (label de seção interna):
```css
font-size: 11px;
font-weight: 600;
color: var(--text-3);
text-transform: uppercase;
letter-spacing: 0.07em;
margin-bottom: 14px;
```

### Campos de formulário

**Campo padrão (fixo):**
```css
border: 1px solid var(--border-md);
border-radius: var(--radius);
padding: 9px 12px;
font-size: 13px;
background: var(--surface);
color: var(--text);
/* focus: border-color: var(--green); box-shadow: 0 0 0 3px rgba(46,189,107,.12) */
```

**Campo variável (roxo — ajustável por consulta):**
```css
border: 1px solid var(--purple-border);
background: var(--purple-light);
color: var(--purple-dark);
font-weight: 500;
/* focus: border-color: var(--purple); box-shadow: 0 0 0 3px rgba(155,89,212,.13) */
```
Label do campo variável: `color: var(--purple)`

### Badges

| Tipo       | Background        | Texto          |
|------------|-------------------|----------------|
| Cão        | `--blue-light`    | `--blue`       |
| Gato       | `--amber-light`   | `--amber`      |
| Fase       | `--green-light`   | `--green-dark` |
| Proteína   | `#F3EAFd`         | `#7B3FB8`      |
| Neutro     | `--bg`            | `--text-2`     |

Padding: `3px 8px`, border-radius: `20px`, font-size: `10px`, font-weight: `600`

### Filtros / Tags clicáveis

```css
border: 1.5px solid var(--border-md);
border-radius: 20px;
padding: 5px 11px;
font-size: 11px;
font-weight: 500;
background: var(--surface);
color: var(--text-2);
```

Ativo:
```css
border-color: var(--green);
background: var(--green-light);
color: var(--green-dark);
font-weight: 600;
```

### Stat boxes (cálculos)

```css
background: var(--bg);
border-radius: var(--radius);
padding: 12px 14px;
```
- Label: 10px, 600, uppercase, `--text-3`
- Valor: 22px, 600, DM Mono
- Unidade: 11px, `--text-3`

### Alertas / info strips

```css
/* Info verde */
background: var(--green-light);
color: var(--green-dark);
padding: 12px 14px;
border-radius: var(--radius);
font-size: 13px;

/* Info azul (água/própolis) */
background: var(--blue-light);
color: var(--blue);
```

### Tabs de seção (abas do perfil)

```css
.perfil-tab {
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.perfil-tab.active {
  color: var(--green);
  border-bottom-color: var(--green);
}
```

### Modal

```css
.modal-overlay {
  background: rgba(0,0,0,0.45);
  /* animation: fadeIn 0.15s ease */
}
.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 28px;
  width: 560px;
  max-width: 95vw;
}
```

### Toast

```css
position: fixed;
bottom: 24px;
right: 24px;
border-radius: var(--radius);
font-size: 13px;
padding: 12px 18px;
/* success: background: var(--green-dark) */
/* error: background: var(--red) */
```

### Tabela de medidas corporais

```css
th { font-size: 10px; font-weight: 600; text-transform: uppercase;
     background: var(--bg); color: var(--text-3); padding: 7px 10px; }
td { font-family: 'DM Mono'; font-size: 12px; color: var(--text-2);
     padding: 8px 10px; text-align: center; }
```

### Badges de condição corporal

| Condição       | CSS class       | Background | Texto     |
|----------------|-----------------|------------|-----------|
| Abaixo do peso | `cond-abaixo`   | `#DBEAFE`  | `#1E40AF` |
| Peso ideal     | `cond-ideal`    | `#D1FAE5`  | `#065F46` |
| Acima do peso  | `cond-acima`    | `#FEF3C7`  | `#92400E` |
| Obeso          | `cond-obeso`    | `#FEE2E2`  | `#991B1B` |

---

## 6. Iconografia

**Biblioteca:** [Uicons](https://www.uicons.com) (Flaticon), estilo **Regular Rounded** — `fi fi-rr-{name}`, via CDN (`@flaticon/flaticon-uicons`)
**Tamanho padrão:** 16px em botões, 15px em inputs
**Licença:** versão gratuita — exige atribuição visível. O NutriPet cumpre isso
com um link "Uicons by Flaticon" no rodapé da sidebar (`.sidebar-footer` em
`index.html`). Não incluir esse crédito no cardápio impresso (`exportar.html`)
— é um documento entregue ao tutor do pet, não uma superfície do produto.
**Ícones-chave do NutriPet:**

| Contexto              | Ícone                    |
|-----------------------|--------------------------|
| Logo / marca          | `fi-rr-paw`               |
| Banco de dietas       | `fi-rr-database`          |
| Pacientes             | `fi-rr-paw`               |
| Iniciar consulta      | `fi-rr-clipboard-check`   |
| Plano nutricional     | `fi-rr-calculator`        |
| Cardápio gerado       | `fi-rr-document`          |
| Editar                | `fi-rr-edit`               |
| Excluir               | `fi-rr-trash`              |
| Salvar / confirmar    | `fi-rr-check`              |
| Adicionar             | `fi-rr-plus`               |
| Remover linha         | `fi-rr-cross`              |
| Imprimir              | `fi-rr-print`              |
| Medidas corporais     | `fi-rr-ruler-horizontal`   |
| Histórico             | `fi-rr-clock`              |
| Info                  | `fi-rr-info`                |
| Filtro desativado     | `fi-rr-filter-slash`       |
| Spinner de loading    | CSS animation              |

Nem todo ícone do Tabler tem equivalente 1:1 no Uicons — quando não existe
nome exato, usa-se o mais próximo semanticamente disponível no conjunto real
(confirmado contra o CSS publicado, não por suposição). Ex.: "histórico" não
tem ícone próprio no Uicons Regular Rounded, então usamos `fi-rr-clock`;
"somatório" usa `fi-rr-sigma`; "sair/logout" usa `fi-rr-sign-out-alt`.

---

## 7. Sidebar

```
Largura: 224px (fixa)
Background: var(--surface)
Border-right: 1px solid var(--border)

Logo mark:
  - Paw icon: 28×28px, border-radius 8px, background var(--green), ícone branco
  - Nome: 15px, weight 600, color var(--green)
  - Subtítulo: 11px, color var(--text-3), padding-left 37px

Nav item padrão:
  - 13px, color var(--text-2)
  - padding: 9px 20px
  - border-left: 2px solid transparent

Nav item ativo:
  - color: var(--green)
  - background: var(--green-light)
  - border-left: 2px solid var(--green)
  - font-weight: 500
```

---

## 8. Cardápio impresso

O cardápio é o documento entregue ao tutor — deve parecer profissional.

- Container: `max-width: 580px`, centralizado
- Card com `padding: 28px`
- Header: logo NutriPet (verde) à esquerda, nome do pet à direita
- Tabela de ingredientes: `DM Mono` para valores, `DM Sans` para nomes
- Box de observações: `background: var(--green-light)`, `color: var(--green-dark)`
- Box de água/própolis: `background: var(--blue-light)`, `color: var(--blue)`
- Footer: 10px, `var(--text-3)`, centralizado, fórmula do NEM
- Print CSS: ocultar sidebar, topbar e botões `no-print`

---

## 9. Tom de voz (UX writing)

- Sentence case em tudo. Nunca Title Case desnecessário.
- Botões: verbo primeiro. "Salvar dieta", "Gerar cardápio", "Iniciar consulta".
- Labels em UPPERCASE são para identificar seções, não para gritar.
- Toasts de sucesso: afirmação direta. "Dieta salva!" — sem "com sucesso".
- Toasts de erro: o que falhou. "Erro ao salvar. Tente novamente."
- Empty states: convite à ação, não desculpa. "Nenhuma dieta cadastrada." + botão.
- Placeholders: exemplo real. "Ex: Frango Grain Free — Manutenção"

---

## 10. Regras de design

1. **Verde para ações, roxo para variáveis.** O verde guia o fluxo principal. O roxo sinaliza o que é ajustável por consulta.
2. **Fundo branco.** A página (`body`, sidebar, topbar, cards) usa `--surface` (`#FFFFFF`). `--bg` (`#F4F3EE`) fica reservado para superfícies "afundadas" dentro de um card — stat box, badge neutra, hover, cabeçalho de tabela.
3. **DM Mono para números.** Todo valor calculado, nutricional ou de medida usa monospace.
4. **Sombra leve para separar do fundo branco.** Como a página não tem mais contraste de cor, todo card/superfície flutuante (`.card`, `.diet-item`, `.pet-item`, `.perfil-header`, `.topbar`) leva `box-shadow: var(--shadow)` — a mesma sombra leve em todo lugar, nunca uma sombra decorativa/inventada por componente.
5. **Badges colorirem por significado.** Espécie, fase, proteína e condição corporal têm cores fixas e semânticas.
6. **Loading states sempre.** Spinner verde enquanto carrega — nunca tela em branco.
7. **Responsividade de formulário.** `form-grid-2` em desktop; campos individuais em mobile.
8. **Print-first para o cardápio.** O cardápio precisa ser impresso ou salvo como PDF — teste o layout impresso.

---

## 11. Componentes web (Shoelace)

O NutriPet usa a biblioteca [Shoelace](https://shoelace.style) (v2.20.1, via
CDN jsdelivr, autoloader) para componentes que se beneficiam de comportamento
nativo robusto (foco preso, teclado, acessibilidade) que seria caro
reimplementar à mão — sem exigir build step, bundler ou reescrita do app
(o NutriPet continua vanilla JS/HTML).

### Onde é usado hoje

- **Toast** (`toast(msg, type)` em `index.html`): usa `<sl-alert>` + `.toast()`
  no lugar de uma div manual. Mesma assinatura de função, mesmo posicionamento
  (bottom-right), mesmas cores (verde/vermelho).
- **Modais**: `#modal-medidas` e `#modal-foto` usam `<sl-dialog>` no lugar de
  `.modal-overlay`/`.modal`. Ganho: fechar com ESC, foco preso dentro do
  modal, fechar ao clicar fora — tudo nativo do componente.

### Fora de escopo (por enquanto)

Botões, cards, badges, abas (`.perfil-tab`), campos de formulário e tabelas
continuam com a implementação atual (classes CSS próprias, seção 5). Migrar
esses componentes para Shoelace é trabalho futuro, opcional e incremental —
não fazer de uma vez só num app sem testes automatizados.

### Como o tema é aplicado

Shoelace usa uma escala de cor de 50 a 950 por tom semântico
(`--sl-color-primary-*`, `--sl-color-success-*`, `--sl-color-danger-*`,
`--sl-color-neutral-*`). O NutriPet só define ~5 tons por família de cor
(seção 2), então o bridge de tema (no `<style>` de `index.html`, logo após o
bloco `:root`) reaproveita os tokens existentes (`--green`, `--green-mid`,
`--red` etc.) nos degraus que os componentes usados de fato tocam (fundo
claro, borda, cor sólida, hover) e deixa os degraus não usados caírem no
valor padrão do Shoelace. Tipografia (`--sl-font-sans`) e raio de borda
(`--sl-border-radius-medium/large`) também são mapeados para `DM Sans` e
`--radius`/`--radius-lg`.

**Ao adicionar um novo componente Shoelace no futuro** (dropdown, tooltip,
tabs, etc.), siga o mesmo padrão: não recrie cores manualmente por
componente — confira se o bridge de tema já cobre o componente (geralmente
cobre, se ele usa `primary`/`neutral`/`success`/`danger`); se precisar de um
ajuste visual fino que as variáveis não cobrem, use `::part()` no CSS global
existente (veja `sl-dialog.np-dialog::part(panel)` como exemplo), nunca
estilos inline por instância.
