# Componente: Memória de cálculo

Implementa **F04**. Mostra como cada número foi obtido, usando `result.trace`.

## Anatomia

```
Memória de cálculo                                        [Fórmulas provisórias]  [⧉ Copiar]
┌───────────────────────────────┬──────────────────────────────────────────┬────────────────┐
│ Indicador                     │ Fórmula                                  │ Valor          │
├───────────────────────────────┼──────────────────────────────────────────┼────────────────┤
│ Contratos                     │ P × a × c                                │ 3.000          │
│ Volume concedido              │ N × T                                    │ R$ 15.000.000  │
│ Receita                       │ N × (T × i + f)                          │ R$ 600.000,00  │
│ ...                           │ ...                                      │ ...            │
│ Resultado ajustado ao risco   │ Margem − risco − operação − propostas − CF│ R$ 90.000,00  │
└───────────────────────────────┴──────────────────────────────────────────┴────────────────┘
Legenda
P propostas = 20.000 · a aprovação = 30,0% · c conversão = 50,0% · N contratos = 3.000 ·
T ticket = R$ 5.000,00 · i taxa = 4,00% a.m. · f tarifa = R$ 0,00 · CDI = 1,00% a.m. ·
spread = 0,20% a.m. · r custo de risco = 1,00% a.m. · o custo op. = R$ 10,00 ·
k custo/proposta = R$ 0,00 · CF custos fixos = R$ 150.000,00
```

## Regras

- A tabela é renderizada **somente** a partir de `trace`, mantendo a ordem do motor. Nada de fórmulas escritas no frontend.
- A fórmula usa `--font-mono`. Os símbolos podem ganhar destaque e, no hover, mostrar o valor de entrada.
- A legenda de símbolos é um mapa estático símbolo → campo de entrada (só rótulos), preenchido com os valores do `input`.
- A linha do indicador principal fica em negrito, com fundo `--brand-soft`.
- Quando outra tela pede para destacar um indicador, a página rola até a linha, que pisca em `--brand-soft` por 1,2 s.
- `Copiar` copia a tabela em texto tabulado (cola certo no Excel).
- O selo `Fórmulas provisórias` fica sempre visível enquanto as fórmulas oficiais não forem validadas.
