# Componente: Tabela (lista e comparação)

Usada em Cenários (lista), Comparador (indicadores × cenários) e Premissas.

## Estilo

- Cabeçalho `--surface-2`, texto `--text-muted`, `--text-sm`, peso 500 e caixa normal (sem caixa alta).
- Linhas com 44px de altura (lista) ou 40px (comparação), divisória de 1px `--border` e hover `--surface-2`.
- Números alinhados à direita com `tabular-nums`; texto alinhado à esquerda.
- Primeira coluna fixa e cabeçalho fixo (`position: sticky`) na rolagem.

## Célula de comparação

```
R$ 15.000,00
▼ −75.000,00 · −83,3%
```

- Linha 1: valor do cenário. Linha 2: delta absoluto e percentual contra a referência (`--text-xs`).
- Cor e ícone conforme o **efeito no resultado**: em indicadores de receita e resultado, alta = verde ▲; em indicadores de custo, alta = vermelho ▲.
- Sem diferença: `—` em `--text-subtle`, com o valor completo no tooltip.
- A coluna de referência tem fundo `--brand-soft` sutil e ★ no cabeçalho.

## Lista de cenários

- Checkbox de seleção na primeira coluna; com seleção ativa, aparece uma barra de ações flutuante.
- Linha inteira clicável (`role="link"`), com o menu `⋯` isolado do clique da linha.
- Ordenação clicando no cabeçalho (`aria-sort`).

## Acessibilidade

`<table>` semântica, com `<th scope="col">` e `<th scope="row">` na primeira coluna. Os deltas têm texto acessível completo ("redução de 83,3% em relação a Atual").
