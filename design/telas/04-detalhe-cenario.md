# Tela: Detalhe do cenário (`#/cenarios/:id`)

Implementa **F04** (memória de cálculo), **F05** (ponto de equilíbrio), **F06** (waterfall), **F12** (alertas) e, na fase 2, **F09** (parecer).

## Wireframe

```
Cenários / Atual                              [Dados fictícios] [Fórmulas provisórias]
Atual                                [⇄ Comparar com…] [⧉ Duplicar como variação] [✎ Editar] [⋯]
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ ⚠ Conversão atual abaixo do equilíbrio.  (exemplo de alerta F12)               [Ver] │
└───────────────────────────────────────────────────────────────────────────────────────┘
┌ Resultado ajustado ┐ ┌ Margem financeira ┐ ┌ Retorno s/ volume ┐ ┌ Conversão de equilíbrio ┐
│ R$ 90.000,00       │ │ R$ 420.000,00     │ │ 0,60%             │ │ xx,x%  (atual 50,0%)    │
└────────────────────┘ └───────────────────┘ └───────────────────┘ └─────────────────────────┘

[ Resumo ]  [ Memória de cálculo ]  [ Ponto de equilíbrio ]

Resumo
┌ Do faturamento ao resultado (waterfall) ───────────────────────────────────────────────┐
│  ██████ Receita 600 mil                                                                │
│        ▓▓▓ −Funding 180 mil                                                            │
│  ████ Margem 420 mil                                                                   │
│            ▓▓▓ −Risco 150 mil                                                          │
│                ▓ −Operação 30 mil                                                      │
│                  ▓▓▓ −Fixos 150 mil                                                    │
│                       █ Resultado 90 mil                                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
┌ Entradas ──────────────────────────────┐ ┌ Parecer (fase 2) ─────────────────────────┐
│ Propostas 20.000 · Aprovação 30% ...    │ │ ✦ Gerado por IA · números conferidos     │
│ (lista compacta, somente leitura)       │ │ "O resultado de R$ 90.000,00 ..."        │
└────────────────────────────────────────┘ └───────────────────────────────────────────┘
```

## Abas

1. **Resumo:** [waterfall](../componentes/grafico-waterfall.md) (F06), as entradas em lista compacta agrupada pelas mesmas seções do editor, e o card de parecer (F09) ou "Resumo automático" (fallback determinístico).
2. **Memória de cálculo:** componente [Memória de cálculo](../componentes/memoria-calculo.md) com `result.trace` e a legenda de símbolos (F04).
3. **Ponto de equilíbrio (F05):**
   - Card grande com a conversão de equilíbrio em % e a distância para a atual em p.p.
   - Medidor horizontal de 0 a 100%, com marcadores "Atual" e "Equilíbrio" e a zona de prejuízo hachurada.
   - Texto explicativo: "Com as demais entradas mantidas, a conversão precisa ser de pelo menos X% para ..." (o texto exato depende da definição oficial do indicador, que ainda é provisória).
   - Se `null`: estado de alerta crítico (ver F12).

A aba ativa fica em `?aba=`.

## Ações do cabeçalho

- `Comparar com…`: popover com a lista de cenários; ao escolher, abre `#/comparar?ids=<este>,<escolhido>&ref=<este>`.
- `Duplicar como variação`: abre `#/cenarios/novo?de=<id>`.
- `Editar`: abre `#/cenarios/:id/editar`.
- `⋯`: Definir como referência, Copiar link (F14), Exportar CSV/JSON/PDF, Excluir.

## Estados

- Alertas F12: até 3 [banners](../componentes/alertas.md) empilhados no topo, ordenados por severidade. Com mais de 3, aparece "+N alertas".
- Cenário não encontrado: igual ao do editor.
