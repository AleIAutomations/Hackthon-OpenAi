# Tela: Comparador (`#/comparar?ids=a,b,c&ref=a`)

Tela central do produto. Implementa **F02**, **F03**, **F06** (modo diferença), **F07** e **F12**.

## Wireframe

```
Comparar cenários                         [Dados fictícios]  [+ Adicionar cenário ▾] [+ Choque de CDI] [⬇ Exportar ▾] [🔗]
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 💡 Desconto de 0,5 p.p. reduz o resultado em 83,3% (R$ −75.000,00); CDI a 1,4% a.m. reduz    │
│    em xx,x%.                                                          Resumo automático      │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
Visualização: ( Tabela ) ( Waterfall de diferença )

┌──────────────────────────┬───────────────────┬────────────────────────┬────────────────────────┐
│ Indicador                │ ★ Atual (ref.) ▾  │ Desconto            ▾  │ CDI sobe para 1,4%  ▾  │
├──────────────────────────┼───────────────────┼────────────────────────┼────────────────────────┤
│ Resultado ajustado       │ R$ 90.000,00      │ R$ 15.000,00           │ R$ xx.xxx,xx           │
│                          │                   │ ▼ −75.000,00 · −83,3%  │ ▼ ... · −xx,x%         │
│ Receita                  │ R$ 600.000,00     │ R$ 525.000,00  ▼ −12,5%│ R$ 600.000,00  —       │
│ Custo de funding         │ R$ 180.000,00     │ —                      │ R$ xxx.xxx,xx  ▲ (ruim)│
│ Margem financeira        │ R$ 420.000,00     │ ...                    │ ...                    │
│ Custo de risco           │ R$ 150.000,00     │ —                      │ —                      │
│ Custo operacional        │ R$ 30.000,00      │ —                      │ —                      │
│ Custo de propostas       │ R$ 0,00           │ —                      │ —                      │
│ Contratos                │ 3.000             │ —                      │ —                      │
│ Retorno s/ volume        │ 0,60%             │ ...                    │ ...                    │
│ Conversão de equilíbrio  │ xx,x%             │ ...                    │ ...                    │
├──────────────────────────┼───────────────────┼────────────────────────┼────────────────────────┤
│ Entradas alteradas       │                   │ Taxa 4,00% → 3,50% a.m.│ CDI 1,00% → 1,40% a.m. │
│ Alertas                  │                   │ ⚠ 1                    │                        │
└──────────────────────────┴───────────────────┴────────────────────────┴────────────────────────┘
```

`—` indica que o valor não mudou em relação à referência. O valor absoluto aparece no hover.

## Comportamento

- **Seleção de cenários:** pela URL ou por `+ Adicionar cenário`, de 2 a 4 colunas. O menu `▾` de cada coluna tem: Definir como referência, Abrir detalhe, Editar, Duplicar como variação, Remover da comparação.
- **Tabela:** componente [Tabela de comparação](../componentes/tabela-comparacao.md). A primeira coluna e o cabeçalho ficam fixos durante a rolagem.
- **Linha "Entradas alteradas":** lista os campos de `input` que diferem da referência, no formato "de → para". É o que explica *por que* os números mudaram.
- **Insight (F02):** frase gerada por `features/insight/template.js` a partir dos resultados do motor. Templates mínimos:
  - Uma variação: "<nome> {aumenta|reduz} o resultado em X% (R$ Y)."
  - Duas variações com impacto parecido (diferença < 5 p.p.): "... e tem impacto equivalente a <outra>."
  - Na fase 2, o parecer da IA (F09) substitui o template quando passar na validação de números. O template continua como fallback.
- **Waterfall de diferença (F06):** uma barra por indicador que mudou, da referência até a variação selecionada (abas por variação).
- **Choque de CDI (F07):** popover com um campo "Novo CDI (% a.m.)", padrão 1,40%. Cria a variação, salva e adiciona a coluna.
- **Edição rápida (F03):** clicar duas vezes numa célula da linha "Entradas alteradas" abre um popover para alterar aquele input e recalcular. Salvar atualiza o cenário, com confirmação.
- **Exportar:** CSV ou JSON da comparação, ou PDF (ver [Compartilhar e exportar](08-compartilhar-exportar.md)).
- `🔗` copia o link da comparação (F14).

## Responsivo

Abaixo de `md`, as colunas viram abas ("Atual | Desconto | CDI"), e cada aba mostra o valor e o delta contra a referência.

## Estados

- Menos de 2 cenários: [estado vazio](../componentes/estados.md) "Escolha ao menos 2 cenários para comparar" com seletor inline.
- `ids` com cenário inexistente: a coluna é removida e um toast avisa "1 cenário da comparação não existe mais".
