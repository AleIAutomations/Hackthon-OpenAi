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
  - Origem da versão: `Manual` ou `Modelo ML confirmado`. Esta última só fica disponível quando existir pipeline de ML, que ainda não foi implementado; até lá, a opção aparece desabilitada com o tooltip "Disponível quando o modelo de risco for integrado".
  - O formato da curva (valor único ou por faixa/safra) depende da validação das premissas de risco com o time. Comece com valor único (`riskCostMonthly`) e deixe a tabela pronta para receber mais colunas.
- O nome do responsável é texto livre enquanto não houver autenticação.
