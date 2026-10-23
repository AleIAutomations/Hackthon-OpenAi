# Design system

Visual de SaaS B2B: escuro por padrão, superfícies em camadas, um único acento de marca e cores semânticas reservadas para significado financeiro.

## Tokens de cor

Defina como variáveis CSS em `:root` (escuro) e `[data-tema="claro"]`.

| Token | Escuro | Claro | Uso |
|---|---|---|---|
| `--bg` | `#0A0A0F` | `#F7F8FA` | Fundo da aplicação |
| `--surface-1` | `#111117` | `#FFFFFF` | Cards, sidebar |
| `--surface-2` | `#181820` | `#F1F3F6` | Hover, cabeçalho de tabela, inputs |
| `--surface-3` | `#22222C` | `#E6E9EE` | Popovers, menus |
| `--border` | `#26262F` | `#E2E5EA` | Divisórias e bordas de card |
| `--border-strong` | `#34343F` | `#CBD0D8` | Bordas de input |
| `--text` | `#E8E8ED` | `#0F1117` | Texto principal |
| `--text-muted` | `#9A9AA5` | `#5B6170` | Rótulos, legendas |
| `--text-subtle` | `#6B6B76` | `#8A90A0` | Placeholders, metadados |
| `--brand` | `#00C8A6` | `#00A58A` | Ação primária, foco, links, item ativo |
| `--brand-hover` | `#00B096` | `#008F78` | Hover da ação primária |
| `--brand-soft` | `rgba(0,200,166,.12)` | `rgba(0,165,138,.10)` | Fundo de item ativo, badges |
| `--positive` | `#3FB950` | `#1A7F37` | Melhora de resultado, lucro |
| `--negative` | `#F85149` | `#CF222E` | Piora de resultado, prejuízo, erro |
| `--warning` | `#D29922` | `#9A6700` | Alertas de atenção |
| `--info` | `#58A6FF` | `#0969DA` | Alertas informativos, selo de IA |

Cores dos cenários (borda de coluna, legenda de gráfico), em ordem de criação: `#00C8A6`, `#FF9E6D`, `#A78BFA`, `#58A6FF`. O cenário de referência usa sempre a primeira.

> [!IMPORTANT]
> Verde e vermelho indicam **efeito no resultado**, não o sinal do número. Um aumento de custo aparece em vermelho mesmo sendo positivo. Toda informação de cor tem um reforço textual ou de ícone (▲ ▼, "+", "−").

## Tipografia

| Token | Valor | Uso |
|---|---|---|
| `--font-sans` | `Inter, system-ui, sans-serif` | Interface |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` | Fórmulas e payloads |
| `--text-xs` | 12px / 16px | Metadados, badges |
| `--text-sm` | 13px / 20px | Tabelas, rótulos, sidebar |
| `--text-md` | 14px / 22px | Texto padrão |
| `--text-lg` | 16px / 24px | Títulos de card |
| `--text-xl` | 20px / 28px | Título de página |
| `--text-kpi` | 28px / 34px, peso 600 | Valor de KPI |

- Números usam `font-variant-numeric: tabular-nums` em tabelas, KPIs e gráficos.
- Pesos: 400 (texto), 500 (rótulos, botões), 600 (títulos, KPIs).

## Espaçamento, raio e elevação

- Escala de espaçamento (4px): `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 24px`, `--space-6: 32px`, `--space-8: 48px`.
- Raio: `--radius-sm: 6px` (inputs, badges), `--radius-md: 10px` (cards), `--radius-lg: 14px` (modais).
- Elevação: `--shadow-1: 0 1px 2px rgba(0,0,0,.3)` (cards em hover) e `--shadow-2: 0 8px 24px rgba(0,0,0,.4)` (popovers, modais). No modo escuro, a hierarquia vem principalmente das superfícies, não das sombras.
- Movimento: `--ease: cubic-bezier(.2,.8,.2,1)` e duração de 150 ms (hover) a 200 ms (painéis). Respeitar `prefers-reduced-motion`.

## Layout

- **App shell:** sidebar de 240px (recolhível para 64px) + topbar de 56px + conteúdo com `max-width: 1280px` e padding de 32px.
- Grid de 12 colunas, com gutter de 24px.
- Breakpoints: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`.
  - Abaixo de `lg`, a sidebar vira drawer.
  - Abaixo de `md`, o comparador troca colunas por abas de cenário e as tabelas ganham rolagem horizontal com a primeira coluna fixa.

## Formatação de números

Toda formatação passa por `src/format/numero.js`, com `Intl.NumberFormat("pt-BR")`.

| Tipo | Exemplo | Regra |
|---|---|---|
| Moeda | `R$ 90.000,00` | 2 casas em tabelas; KPIs podem usar a forma compacta `R$ 90 mil` com tooltip do valor completo |
| Taxa | `4,00% a.m.` | 2 casas; sufixo `a.m.` em taxas mensais |
| Percentual de variação | `−83,3%` | 1 casa; sinal explícito (`+`/`−`, com o caractere de menos U+2212) |
| Pontos percentuais | `−0,5 p.p.` | 1 casa |
| Inteiros | `3.000` | separador de milhar |
| Nulo | `—` | com tooltip explicando o motivo |

## Ícones

Traço de 1,5px, 16px (inline) e 20px (navegação). Ícones mínimos: início, lista, mais, editar, duplicar, comparar, função (memória de cálculo), alvo (equilíbrio), gráfico em cascata, faísca (IA), engrenagem, compartilhar, download, alerta, informação, check, x.

## Acessibilidade

- Contraste mínimo de 4,5:1 para texto e de 3:1 para elementos gráficos e bordas de foco.
- Foco visível: `outline: 2px solid var(--brand); outline-offset: 2px`, nunca removido.
- Todos os campos têm `<label>` associado. Os erros usam `aria-describedby` e `aria-invalid`.
- Gráficos SVG têm `role="img"`, `aria-label` com resumo textual e uma tabela equivalente acessível (oculta visualmente ou em aba).
- Navegação completa por teclado. Ordem de tabulação: sidebar, topbar, conteúdo.
- `lang="pt-BR"` no documento.
