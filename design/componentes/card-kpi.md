# Componente: Card de KPI

## Anatomia

```
┌──────────────────────────────────┐
│ Resultado ajustado ao risco  ⓘ   │ ← rótulo (--text-muted, --text-sm)
│ R$ 90.000,00                     │ ← valor (--text-kpi, tabular-nums)
│ ▼ −83,3%  vs. Atual              │ ← delta opcional (cor semântica + ícone)
│ ƒ ver cálculo                    │ ← link para a memória de cálculo
└──────────────────────────────────┘
```

## Propriedades

| Prop | Tipo | Descrição |
|---|---|---|
| `rotulo` | string | Nome do indicador (do dicionário de saída) |
| `valor` | number \| null | Valor vindo do motor |
| `formato` | `"moeda" \| "taxa" \| "inteiro" \| "percentual"` | Aplicado via `format/numero.js` |
| `delta` | `{ abs, pct, direcaoBoa: "alta" \| "baixa" }` | Opcional; calculado pelo helper de comparação |
| `traceIndicador` | string | Liga o card à linha de `trace` (F04) |
| `destaque` | boolean | Card do KPI principal: borda `--brand`, valor maior |

## Estados

- `valor === null`: mostra `—` com tooltip explicando o motivo (ex.: "Sem ponto de equilíbrio").
- Carregando ou recalculando: valor com skeleton apenas no primeiro render. Nos recálculos seguintes, troca o valor sem piscar, com uma transição de opacidade de 150 ms.
- Negativo no resultado: valor em `--negative`.
