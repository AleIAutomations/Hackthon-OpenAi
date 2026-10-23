# Componente: Gráfico waterfall

Implementa **F06**. É desenhado em SVG próprio, sem biblioteca.

## Modo padrão (um cenário)

Sequência de barras (todos os valores vêm do motor; custos fixos vêm de `input.fixedCosts`):

| # | Barra | Tipo | Fonte |
|---|---|---|---|
| 1 | Receita | total (cor `--brand`) | `revenue` |
| 2 | Funding | negativo | `fundingCost` |
| 3 | Margem financeira | subtotal | `financialMargin` |
| 4 | Custo de risco | negativo | `riskCost` |
| 5 | Custo operacional | negativo | `opCost` |
| 6 | Custo de propostas | negativo (oculta se 0) | `proposalCost` |
| 7 | Custos fixos | negativo | `input.fixedCosts` |
| 8 | Resultado ajustado ao risco | total (`--positive` ou `--negative`) | `riskAdjustedResult` |

- As barras negativas usam `--negative` com 70% de opacidade, e as linhas conectoras ficam tracejadas em `--border-strong`.
- O rótulo acima de cada barra mostra o valor compacto (`R$ 150 mil`). O tooltip mostra o valor completo e o % da receita.
- Orientação vertical em `≥ md` e horizontal (barras deitadas) em telas pequenas.

## Modo diferença (comparador)

Da referência até a variação: barra inicial (resultado da referência), uma barra por indicador que mudou (Δ receita, Δ funding, Δ risco…) e barra final (resultado da variação).

## Regras

- O componente **não calcula** subtotais: recebe a lista de barras pronta, montada a partir do `result` por um adaptador simples que só seleciona campos.
- Acessibilidade: `role="img"`, `aria-label` com o resumo ("Receita de R$ 600 mil até resultado de R$ 90 mil") e a mesma informação em tabela, acessível pelo botão `Ver como tabela`.
