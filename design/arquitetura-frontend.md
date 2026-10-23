# Arquitetura do frontend

## Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Build / dev server | **Vite 6** (já no repo, porta 3001) | Já configurado; build estático |
| UI | **React 19** (já no repo) | Já configurado |
| Validação | **Zod 4** via `src/lib/schemas.js` (já no repo) | Fonte única dos contratos de entrada e saída |
| Estilo | **CSS puro com variáveis** (tokens em [design-system.md](design-system.md)) | Bundle leve, sem dependência nova |
| Roteamento | Hash router (`#/...`) | Funciona como arquivo estático e offline, sem configuração de servidor |
| Gráficos | SVG próprio (waterfall, medidor) | Evita dependência pesada; só dois tipos de gráfico |
| Ícones | SVG inline (set próprio ou pacote de ícones copiado para o repo) | Offline; sem CDN |
| Fonte | Inter + JetBrains Mono, **self-hosted** em `public/fonts` | Offline; sem Google Fonts |

> [!NOTE]
> Toda dependência nova (ex.: `react-router`, `lz-string`) precisa de justificativa na PR e de lockfile atualizado (`AGENTS.md`, regra 8). As escolhas acima foram pensadas para não exigir nenhuma dependência nova; quem implementar pode propor alternativas.

## Estrutura de pastas proposta

```
src/
├── main.jsx                  # monta <App/>
├── app/
│   ├── App.jsx               # AppShell + roteador
│   ├── router.js             # hash router mínimo (parse de rota + query)
│   └── routes.jsx            # tabela rota → tela
├── lib/                      # (existente) motor e schemas, intocáveis pela UI
│   ├── engine.js             # simulate(), simulateDemoScenarios()
│   └── schemas.js            # ScenarioInputSchema, ScenarioResultSchema
├── state/
│   ├── store.js              # useReducer + Context: cenários, premissas, preferências
│   ├── persistencia.js       # leitura/escrita localStorage com validação
│   └── seed.js               # cenários de demonstração (de simulateDemoScenarios)
├── format/
│   ├── numero.js             # BRL, %, p.p., decimal ↔ %
│   └── erros.js              # mapeia issues Zod → mensagens pt-BR
├── features/
│   ├── alertas/regras.js     # F12 (puro, testável)
│   ├── insight/template.js   # frase determinística de F02/F09-fallback
│   ├── compartilhar/link.js  # F14 encode/decode do payload
│   └── ia/                   # F08/F09 (fase 2), isolado e opcional
├── components/               # ver design/componentes/
└── pages/                    # ver design/telas/
    ├── VisaoGeral.jsx
    ├── Cenarios.jsx
    ├── EditorCenario.jsx
    ├── DetalheCenario.jsx
    ├── Comparador.jsx
    ├── AssistenteIA.jsx
    ├── Premissas.jsx
    └── Compartilhado.jsx
```

Os arquivos atuais em `src/views/`, `src/lib/calc.js`, `src/lib/credito.js` e `src/lib/schema.js` pertencem ao protótipo de MVP. A remoção deles deve acontecer numa PR própria, depois de o novo frontend cobrir o fluxo da demo.

## Rotas

| Hash | Página | Parâmetros |
|---|---|---|
| `#/` | Visão geral | — |
| `#/cenarios` | Lista de cenários | `?q=` busca, `?tag=` filtro |
| `#/cenarios/novo` | Editor (novo) | `?de=<id>` cria variação a partir de outro cenário |
| `#/cenarios/:id` | Detalhe | `?aba=resumo\|memoria\|equilibrio` |
| `#/cenarios/:id/editar` | Editor (edição) | — |
| `#/comparar` | Comparador | `?ids=a,b,c&ref=a&modo=tabela\|waterfall` |
| `#/assistente` | Assistente IA | — |
| `#/premissas` | Premissas | `?aba=gerais\|curva-risco` |
| `#/compartilhado/:payload` | Visualização compartilhada | — |
| qualquer outra | 404 com link para `#/` | — |

## Contrato com o motor

```js
import { simulate } from "../lib/engine.js";
// input: ScenarioInput (validado) → output: ScenarioResult (validado)
const result = simulate(input);
```

- `simulate` é **síncrono e puro**. Chame dentro de `useMemo` com dependência nas entradas. Não precisa de web worker.
- `simulate` lança `ZodError` quando a entrada é inválida. Na UI, valide antes com `ScenarioInputSchema.safeParse` e só chame `simulate` quando `success === true`.
- **Proibido** derivar indicadores no frontend. Se uma tela precisar de um número que o motor não devolve, abra uma PR no motor (`src/lib/engine.js`) com teste de gabarito.
- Deltas entre cenários (valor B − valor A, %) contam como **comparação de saídas**, não como fórmula de negócio, e ficam centralizados em `format/` ou num helper `comparar(resultA, resultB)` testado.

### Dicionário de campos

Entrada (`ScenarioInputSchema`). As taxas são decimais no motor e aparecem em % na UI.

| Chave | Rótulo na UI | Seção | Unidade na UI | Limites (schema) |
|---|---|---|---|---|
| `label` | Nome do cenário | Topo | texto | 1–60 caracteres |
| `proposals` | Propostas recebidas no mês | Funil | inteiro | 1 – 10.000.000 |
| `approvalRate` | Taxa de aprovação | Funil | % | 0–100% |
| `conversionRate` | Taxa de conversão (aprovadas → contratadas) | Funil | % | 0–100% |
| `avgTicket` | Ticket médio | Preço | R$ | ≥ R$ 100 |
| `monthlyRate` | Taxa de juros | Preço | % a.m. | 0–20% |
| `feePerContract` | Tarifa por contrato | Preço | R$ | ≥ 0 (padrão 0) |
| `fundingCdiMonthly` | CDI | Funding e risco | % a.m. | 0–10% |
| `fundingSpreadMonthly` | Spread de funding | Funding e risco | % a.m. | 0–10% |
| `riskCostMonthly` | Custo de risco | Funding e risco | % a.m. sobre o volume | 0–20% |
| `riskCostSource` | Origem do custo de risco | Funding e risco | `Manual` / `Modelo ML confirmado` | enum |
| `opCostPerContract` | Custo operacional por contrato | Custos | R$ | ≥ 0 |
| `costPerProposal` | Custo por proposta (F11) | Custos | R$ | ≥ 0 (padrão 0) |
| `fixedCosts` | Custos fixos do mês | Custos | R$ | ≥ 0 |
| `sideEffects.enabled` | Considerar efeitos colaterais | Avançado | toggle | padrão desligado |
| `sideEffects.conversionPpPerRatePp` | Elasticidade: p.p. de conversão por p.p. de taxa | Avançado | número | 0–50 |
| `sideEffects.incrementalRiskMultiplier` | Multiplicador de risco dos clientes incrementais | Avançado | × | 1–5 |

> [!WARNING]
> Hoje, `sideEffects` existe no schema, mas **não é usado** por `simulate()`. Deixe a seção "Avançado" oculta atrás de uma feature flag até o motor passar a considerá-la. No gabarito, o cenário "Desconto + efeito" altera `conversionRate` diretamente.

Saída (`ScenarioResultSchema`):

| Chave | Rótulo na UI | Formato |
|---|---|---|
| `contracts` | Contratos | inteiro |
| `volume` | Volume concedido | BRL |
| `revenue` | Receita | BRL |
| `fundingCost` | Custo de funding | BRL |
| `financialMargin` | Margem financeira | BRL |
| `riskCost` | Custo de risco | BRL |
| `opCost` | Custo operacional | BRL |
| `proposalCost` | Custo de propostas | BRL |
| `riskAdjustedResult` | **Resultado ajustado ao risco** (KPI principal) | BRL |
| `riskAdjustedReturnOnVolume` | Retorno sobre volume | % (ou "—" se `null`) |
| `breakEvenConversion` | Conversão de equilíbrio | % (ou "Sem equilíbrio" se `null`) |
| `trace[]` | Memória de cálculo | `{ indicator, formula, value }` |

## Estado e persistência

- **Store global** com `useReducer` + Context, sem biblioteca externa.
  ```ts
  type Cenario = {
    id: string;                 // gerado na criação (crypto.randomUUID), fora do motor
    input: ScenarioInput;       // única coisa persistida para cálculo
    baseScenarioId?: string;    // F03
    curvaRiscoVersao?: string;  // F13
    tags: string[];
    demo: boolean;              // true para cenários fictícios de seed
    criadoEm: string;           // ISO
    atualizadoEm: string;       // ISO
  };
  type Estado = {
    cenarios: Cenario[];
    premissas: Premissas;       // F10
    curvasRisco: CurvaRisco[];  // F13
    preferencias: { tema: "escuro" | "claro"; referenciaPadrao?: string };
  };
  ```
- **Resultados não são persistidos.** São sempre recalculados com `simulate(input)` para não ficarem fora de sincronia com o motor.
- **localStorage**, chave `simulador:v1`. Na leitura, cada cenário passa por `ScenarioInputSchema.safeParse`. Cenários inválidos vão para uma lista de "cenários que não puderam ser carregados", com opção de exportar ou descartar, e nunca quebram o app.
- Primeira visita (sem estado salvo): carregar a seed com os quatro cenários de demonstração, marcados com `demo: true`.
- Ação `Restaurar dados de demonstração` em Configurações.

## Erros e mensagens

- `format/erros.js` traduz `ZodIssue` em texto pt-BR por campo. Exemplo: `too_small` em `avgTicket` vira "O ticket médio deve ser de pelo menos R$ 100,00."
- Erros inesperados de renderização são capturados por um Error Boundary por página, que mostra o estado de erro (ver [estados](componentes/estados.md)) sem derrubar o shell.
- Não registrar entradas da pessoa usuária no console em produção.

## Testes esperados

- `uvu` (já configurado): testes para `format/`, `features/alertas/regras.js`, `features/insight/template.js`, `features/compartilhar/link.js` (ida e volta) e `state/persistencia.js` (dados corrompidos).
- Teste de fumaça da demo: a seed carregada produz resultado de R$ 90.000,00 no cenário "Atual".
- `npm test` e `npm run build` verdes na CI (`.github/workflows/ci.yml`).
