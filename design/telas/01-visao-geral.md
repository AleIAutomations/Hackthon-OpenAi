# Tela: Visão geral (`#/`)

Página inicial do workspace. Em até 5 segundos, ela deve responder: *como está a carteira e qual decisão pesa mais?*

## Wireframe

```
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ ◆ Simulador│  Visão geral                        [Dados fictícios] [+ Novo cenário]│
│            ├──────────────────────────────────────────────────────────────────┤
│ ⌂ Visão    │  ┌ Resultado ajustado ┐ ┌ Margem financeira ┐ ┌ Contratos ┐ ┌ Conversão de ┐│
│   geral    │  │ R$ 90.000,00       │ │ R$ 420.000,00     │ │ 3.000     │ │ equilíbrio   ││
│ ☰ Cenários │  │ cenário "Atual"    │ │                   │ │           │ │ xx,x%        ││
│ ⇄ Comparar │  └────────────────────┘ └───────────────────┘ └───────────┘ └──────────────┘│
│ ✦ Assist.  │                                                                  │
│   IA  BETA │  Sensibilidade do resultado                      [Abrir comparador →]│
│ ⚙ Premissas│  ┌──────────────────────────────────────────────────────────────┐│
│            │  │ Desconto de 0,5 p.p.      ███████████████████  −83,3%  ▼     ││
│            │  │ CDI sobe para 1,4% a.m.   ██████████            −xx,x% ▼     ││
│            │  │ Desconto + efeito         ███████████           −xx,x% ▼     ││
│            │  └──────────────────────────────────────────────────────────────┘│
│            │                                                                  │
│            │  Cenários recentes                              [Ver todos →]    │
│ ────────── │  ┌──────────────────────────────────────────────────────────────┐│
│ Workspace  │  │ Atual            R$ 90.000,00   ·  editado há 2 min    ⋯    ││
│ Carteira   │  │ Desconto         R$ 15.000,00   ⚠ 1 alerta             ⋯    ││
│ demo   ▾   │  └──────────────────────────────────────────────────────────────┘│
└────────────┴──────────────────────────────────────────────────────────────────┘
```

Os números mostrados são os do gabarito de `simulateDemoScenarios()`. `xx` indica valores que dependem do motor e não devem ser fixados no código.

## Conteúdo

1. **Cabeçalho da página:** título, selo `Dados fictícios` (quando houver cenário `demo`) e botão primário `+ Novo cenário`.
2. **Faixa de KPIs** (4 [cards de KPI](../componentes/card-kpi.md)) do cenário de referência: resultado ajustado ao risco, margem financeira, contratos e conversão de equilíbrio. Clicar abre o detalhe do cenário.
3. **Sensibilidade:** barras horizontais ordenadas pelo maior impacto absoluto no resultado, com uma linha por variação contra a referência. Os deltas vêm da comparação de saídas do motor. Clicar abre o comparador com o par selecionado.
4. **Cenários recentes:** os 5 últimos editados, com resultado, contagem de alertas e menu `⋯` (Abrir, Editar, Duplicar como variação, Comparar, Excluir).

## Estados

- **Primeira visita:** seed de demonstração carregada e um banner informativo dispensável: "Este workspace tem dados fictícios para você explorar. [Começar do zero]".
- **Workspace vazio** (usuário apagou tudo): [estado vazio](../componentes/estados.md) com ilustração, "Crie seu primeiro cenário" e os botões `+ Novo cenário` e `Restaurar dados de demonstração`.
- **Sem variações:** a seção de sensibilidade troca o gráfico por "Crie uma variação para ver o impacto de cada decisão" e o botão `Duplicar "Atual" como variação`.
