# Validação das premissas da curva de risco (F13)

A curva `v1` (`src/data/curvas-risco/v1.json`) foi gerada pelo pipeline em [`ml/`](../ml/README.md). Ela só pode alimentar o motor depois que alguém do time confirmar as premissas abaixo, na tela **Curva de risco (ML)** (`#/premissas/curva-risco`). Até lá, a curva fica `pending_confirmation`.

## Resultado em uma linha

O modelo separa bem os riscos: a PD (probabilidade de inadimplência) vai de 1,40% na faixa A a 22,16% na faixa E. Com as premissas provisórias, o custo de risco da carteira dá **0,174% a.m.**, contra o **1,00% a.m.** usado nos cenários de demonstração. Essa diferença vem quase toda das premissas abaixo, não do modelo.

## O que precisa ser validado

| # | Premissa | Valor provisório | Pergunta para o time | Efeito no custo |
|---|---|---|---|---|
| 1 | **LGD** (perda dado o default) | 45% (IRB básico de Basileia, sem garantia) | Qual é a LGD observada na carteira de empréstimo pessoal, já descontada a recuperação da cobrança? | Linear: LGD de 30% → 0,116% a.m.; 60% → 0,232% a.m.; 100% → 0,387% a.m. |
| 2 | **Definição de inadimplência** | `TARGET = 1` da Home Credit: atraso relevante em alguma das primeiras parcelas | A definição da empresa é outra, por exemplo 90 dias de atraso, ou atraso em qualquer momento do contrato? | Se a definição da empresa for mais ampla que a da Home Credit, a PD está subestimada. |
| 3 | **Distribuição da perda no tempo** | `riskCostMonthly = PD × LGD / prazo médio`, com a perda espalhada igualmente pelo prazo (~21 meses) | O custo de risco do simulador deve ser a perda mensalizada do contrato, a perda esperada em 12 meses, ou a provisão do mês (PDD)? | Usar a perda total no mês da concessão multiplicaria o custo por ~21 (≈ 3,6% a.m.). |
| 4 | **Representatividade dos dados** | Home Credit (crédito ao consumo fora do Brasil, 8,07% de inadimplência) | Qual é a taxa de inadimplência observada na nossa carteira? Se for diferente, calibramos o nível da PD por faixa e mantemos a ordenação do modelo. | Proporcional à razão entre a inadimplência real e 8,07%. |
| 5 | **Mix de faixas da carteira** | Quintis da base de teste (~20% em cada faixa) | Qual é a distribuição real da carteira entre A e E? A tela aceita outro mix e recalcula o custo com `custoRiscoDaCurva`. | Exemplo: 40% A, 40% B, 20% C → 0,055% a.m. |
| 6 | **Variáveis usadas (LGPD/discriminação)** | `CODE_GENDER` excluída; idade (`DAYS_BIRTH`) e região continuam no modelo | Jurídico e compliance aceitam idade e região como variáveis de risco? | Pode exigir retreino sem essas variáveis. |
| 7 | **Quem confirma** | Texto livre na tela (ainda não há login) | Quem tem alçada para confirmar uma curva de risco? | Nenhum. |

## Referência rápida: impacto no cenário "Atual" de demonstração

Volume concedido de R$ 15.000.000 por mês (3.000 contratos × R$ 5.000):

| Custo de risco | Custo no mês |
|---|---|
| 1,00% a.m. (manual, demonstração) | R$ 150.000 |
| 0,174% a.m. (curva v1, LGD 45%) | R$ 26.145 |

## Como confirmar

1. Responda aos itens 1 a 7. Se algum valor mudar (LGD, definição de inadimplência ou calibração), gere uma nova versão com `python -m risco.treino --versao v2 --lgd <valor>` em vez de confirmar a `v1`.
2. Abra `#/premissas/curva-risco` e revise as faixas e as métricas.
3. Preencha **Responsável** e **Motivo**, marque a revisão das premissas e clique em **Confirmar curva**. A confirmação fica salva no workspace (localStorage) e pode ser revogada na mesma tela.
