# Tela: Premissas (`#/premissas`)

Implementa **F10** (premissas editáveis) e **F13** (curva de risco versionada).

## Wireframe

```
Premissas                                                        [Fórmulas provisórias]
[ Gerais ]  [ Curva de risco ]

Gerais
┌──────────────────────────────┬──────────────┬───────────┬─────────────────────┬──────────┐
│ Premissa                     │ Valor        │ Unidade   │ Fonte               │ Editado  │
├──────────────────────────────┼──────────────┼───────────┼─────────────────────┼──────────┤
│ CDI mensal                   │ [ 1,00 ]     │ % a.m.    │ [ Fictício (demo) ] │ hoje     │
│ Spread de funding            │ [ 0,20 ]     │ % a.m.    │ [ ...             ] │ hoje     │
│ Custo operacional/contrato   │ [ 10,00 ]    │ R$        │                     │          │
│ Custo por proposta           │ [ 0,00 ]     │ R$        │                     │          │
│ Custos fixos mensais         │ [150.000,00] │ R$        │                     │          │
│ ⓘ Simplificação: custo de risco como % a.m. constante sobre o volume concedido       │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                                     [Descartar] [Salvar]

Curva de risco
Versão ativa: v2 · aprovada por <nome> em <data> · origem: Manual
┌────────┬─────────────────────┬──────────────┬───────────────────────────┬──────────────┐
│ Versão │ Custo de risco a.m. │ Origem       │ Motivo                    │ Criada       │
├────────┼─────────────────────┼──────────────┼───────────────────────────┼──────────────┤
│ v2 ●   │ 1,00%               │ Manual       │ Ajuste pós-safra          │ hoje         │
│ v1     │ 1,20%               │ Manual       │ Versão inicial            │ ontem        │
└────────┴─────────────────────┴──────────────┴───────────────────────────┴──────────────┘
                                                  [+ Nova versão]  [Definir como ativa]
```

## Comportamento

- **Gerais (F10):** valores validados pelos mesmos limites do schema. `Salvar` grava e mostra o toast "Premissas atualizadas. Novos cenários usarão estes valores."
- Cenários existentes não mudam. No detalhe e no editor de cenários criados com premissas antigas, aparece o banner informativo "As premissas mudaram desde a criação deste cenário" com `Aplicar premissas atuais` (abre o editor com os campos alterados destacados).
- Premissas simplificadoras aparecem como [alerta informativo](../componentes/alertas.md) fixo na tabela.
- **Curva de risco (F13):**
  - Uma versão é imutável depois de criada. `+ Nova versão` copia a ativa para edição, com o motivo obrigatório.
  - Origem da versão: `Manual` ou `Modelo ML confirmado`. As versões de ML vêm de `src/data/curvas-risco/vN.json`, geradas pelo pipeline em [`ml/`](../../ml/README.md) e validadas por `CurvaRiscoSchema` (`src/lib/curvaRisco.js`).
  - Uma curva de ML chega com `status: "pending_confirmation"`. A aba mostra as faixas A–E (participação, PD, prazo médio e custo de risco a.m.), as métricas do modelo (AUC, Gini, KS) e os selos `Dados de terceiros (Home Credit)` e `Premissa provisória: LGD`. O botão `Confirmar curva` pede nome e motivo; só depois disso `curvaPodeAlimentarMotor()` devolve `true` e a versão pode ficar ativa com `riskCostSource = "ml_confirmed"`. A confirmação fica no workspace (localStorage); o JSON versionado no repositório não muda.
  - O valor que vai para o motor é `custoRiscoDaCurva(curva, mix)`: sem mix, usa a carteira observada; com mix (`{ A: 0.4, B: 0.4, C: 0.2 }`), pondera o custo por faixa. A tela não calcula nada sozinha.
- O nome do responsável é texto livre enquanto não houver autenticação.
