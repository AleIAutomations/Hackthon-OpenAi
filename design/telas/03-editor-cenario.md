# Tela: Editor de cenário (`#/cenarios/novo`, `#/cenarios/:id/editar`)

Implementa **F01**, e também F03 (variação), F10 (premissas), F11 (custo por proposta) e F13 (curva de risco).

## Wireframe

```
Cenários / Novo cenário                                       [Cancelar] [Salvar e simular]
┌──────────────────────────────────────────────────────┬─────────────────────────────────┐
│ Nome do cenário                                        │  PRÉ-VISUALIZAÇÃO     ● ao vivo │
│ [ Atual                                    ]           │                                 │
│ Variação de: Atual  ↺  (2 campos alterados)            │  Resultado ajustado ao risco    │
│                                                        │  R$ 90.000,00                   │
│ ① Funil ───────────────────────────────────────        │  ▼ −xx% vs. origem (se variação)│
│ Propostas no mês     Aprovação       Conversão         │                                 │
│ [ 20.000     ]       [ 30,0 % ]      [ 50,0 % ]        │  Contratos           3.000      │
│                                                        │  Volume      R$ 15.000.000,00   │
│ ② Preço ───────────────────────────────────────        │  Receita        R$ 600.000,00   │
│ Ticket médio         Taxa de juros   Tarifa/contrato   │  Margem fin.    R$ 420.000,00   │
│ [ R$ 5.000,00 ]      [ 4,00 % a.m.]  [ R$ 0,00 ]       │  Custo de risco R$ 150.000,00   │
│                                                        │                                 │
│ ③ Funding e risco ─────────────────────────────        │  ⚠ Nenhum alerta                │
│ CDI              Spread           Custo de risco       │                                 │
│ [ 1,00 % a.m.]   [ 0,20 % a.m.]   [ 1,00 % a.m.] ▾     │  [Ver memória de cálculo]       │
│ Origem: (•) Manual  ( ) Curva de risco v2              │                                 │
│                                                        │                                 │
│ ④ Custos ──────────────────────────────────────        │                                 │
│ Op./contrato     Custo/proposta     Custos fixos       │                                 │
│ [ R$ 10,00 ]     [ R$ 0,00 ]        [ R$ 150.000,00 ]  │                                 │
│                                                        │                                 │
│ ▸ Avançado: efeitos colaterais (em breve)              │                                 │
└──────────────────────────────────────────────────────┴─────────────────────────────────┘
```

## Comportamento

- **Seções numeradas** (Funil, Preço, Funding e risco, Custos), cada uma num card, com âncoras e um índice fixo à esquerda em telas `xl`.
- Campos: veja o [dicionário de campos](../arquitetura-frontend.md#dicionário-de-campos) e o componente [Campo de formulário](../componentes/campo-formulario.md).
- **Valores iniciais:**
  - Novo cenário: premissas atuais (F10) para CDI, spread, custo operacional, custos fixos e custo de risco. Funil e preço começam com os valores do cenário de referência.
  - `?de=<id>` (variação, F03): todos os valores da origem; o nome vira "<origem> · variação".
- **Campos alterados vs. origem:** borda esquerda com `--brand`, tooltip "Original: 4,00% a.m." e ação `↺` para reverter o campo. O topo mostra o contador "N campos alterados".
- **Pré-visualização ao vivo** (painel fixo à direita; abaixo de `lg`, vira barra inferior recolhível): chama `simulate()` com debounce de 150 ms enquanto o formulário for válido. Se estiver inválido, mostra "Corrija os campos destacados para ver o resultado" e mantém os últimos números esmaecidos.
- **Origem do custo de risco (F13):** o seletor `Manual` libera o campo para edição. Com `Curva de risco vX`, o valor vem da curva, o campo fica somente leitura e `riskCostSource` é definido conforme a curva.
- **Salvar e simular:** valida tudo com `ScenarioInputSchema.safeParse`. Em caso de erro, rola até o primeiro campo inválido e mostra o resumo no topo. Em caso de sucesso, salva e navega para `#/cenarios/:id` com o toast "Cenário salvo".
- **Saída com alterações não salvas:** modal "Descartar alterações?".
- **Atalhos:** `Ctrl/⌘ + Enter` salva; `Esc` cancela (com confirmação se houver alteração).

## Estados

- Edição de cenário `demo`: banner informativo "Você está editando um cenário de demonstração (dados fictícios)."
- Cenário não encontrado (`:id` inválido): [estado de erro](../componentes/estados.md) "Cenário não encontrado" com `Voltar para cenários`.
