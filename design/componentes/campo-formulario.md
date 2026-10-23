# Componente: Campo de formulário

Segue o padrão da Parte 7.3 de `METODOLOGIA.md`, adaptado a campos numéricos financeiros.

## Anatomia

```
Taxa de juros  ⓘ                       ← label (sempre visível) + tooltip de ajuda
┌──────────────────────────────┬───────┐
│ 4,00                          │% a.m. │ ← input + sufixo de unidade
└──────────────────────────────┴───────┘
Juros cobrados ao mês sobre o ticket.   ← texto de ajuda (opcional)
✕ A taxa deve ficar entre 0% e 20% a.m. ← erro (substitui a ajuda)
```

## Tipos

| Tipo | Exibição | Valor enviado ao motor | Detalhes |
|---|---|---|---|
| `moeda` | `R$` como prefixo; `5.000,00` | `5000` | Aceita colar "R$ 5.000,00" |
| `taxa` | Sufixo `%` ou `% a.m.`; `4,00` | `0.04` | Conversão em `format/numero.js`, nunca no componente |
| `inteiro` | `20.000` | `20000` | Sem casas decimais |
| `texto` | — | string | Contador `12/60` para `label` |
| `segmentado` | Botões lado a lado | enum | Ex.: origem do custo de risco |

- Use `inputmode="decimal"` (ou `numeric`) em vez de `type="number"`, para aceitar vírgula como separador decimal.
- Setas ↑/↓ ajustam o valor por um passo (taxa: 0,1 p.p.; moeda: 1% do valor arredondado), e `Shift` multiplica o passo por 10.

## Estados

- **Vazio:** placeholder com exemplo ("ex.: 4,00"), nunca sem indicação.
- **Preenchendo:** sem erro enquanto a pessoa digita; valida no blur ou no submit.
- **Erro:** borda `--negative`, ícone ✕ e mensagem pt-BR de `format/erros.js` abaixo do campo; `aria-invalid="true"` + `aria-describedby`.
- **Alterado vs. origem** (variação F03): barra de 2px `--brand` à esquerda, tooltip "Original: …" e botão `↺`.
- **Somente leitura:** fundo `--surface-1`, sem borda forte e com cadeado quando vier de uma premissa ou curva.
- **Desabilitado:** opacidade 0,5.

## Acessibilidade

- `<label for>` sempre; placeholder não substitui label.
- A unidade (sufixo) está ligada ao input por `aria-describedby`.
- O resumo de erros no topo do formulário usa `role="alert"` e links para cada campo.
