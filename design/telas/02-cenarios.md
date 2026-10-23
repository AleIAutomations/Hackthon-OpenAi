# Tela: Cenários (`#/cenarios`)

Biblioteca de todos os cenários do workspace.

## Wireframe

```
Cenários                                                    [⬆ Importar JSON] [+ Novo cenário]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Buscar cenários...        Tags: [Todas ▾]   Ordenar: [Editado recentemente ▾]           │
├───┬──────────────────────┬────────────────┬──────────────┬────────────┬─────────┬──────┤
│ ☐ │ Nome                 │ Resultado      │ Δ vs. Atual  │ Alertas    │ Editado │      │
├───┼──────────────────────┼────────────────┼──────────────┼────────────┼─────────┼──────┤
│ ☐ │ Atual  ★ referência  │ R$ 90.000,00   │ —            │            │ 2 min   │  ⋯   │
│ ☐ │ Desconto   DEMO      │ R$ 15.000,00   │ ▼ −83,3%     │ ⚠ 1        │ 2 min   │  ⋯   │
│ ☐ │ Desconto + efeito    │ R$ xx.xxx,xx   │ ▼ −xx,x%     │            │ 2 min   │  ⋯   │
│ ☐ │ CDI sobe para 1,4%   │ R$ xx.xxx,xx   │ ▼ −xx,x%     │            │ 2 min   │  ⋯   │
└───┴──────────────────────┴────────────────┴──────────────┴────────────┴─────────┴──────┘
                                     ┌───────────────────────────────────────────────┐
  (barra flutuante com seleção ativa) │ 3 selecionados   [⇄ Comparar] [⬇ Exportar] [🗑] │
                                     └───────────────────────────────────────────────┘
```

## Comportamento

- Tabela com [linha clicável](../componentes/tabela-comparacao.md): clicar na linha abre `#/cenarios/:id`.
- Selecionar de 2 a 4 linhas habilita `Comparar`, que abre `#/comparar?ids=...`. Com mais de 4, o botão fica desabilitado e o tooltip explica: "Compare até 4 cenários por vez".
- Coluna **Δ vs. Atual**: comparada com o cenário de referência das preferências.
- Busca por nome e tag, refletida em `?q=` na URL.
- **Importar JSON:** aceita o arquivo gerado por `Exportar JSON`. Cada cenário passa pelo schema, e um modal de resumo mostra quantos foram importados e quais foram rejeitados (com motivo).
- O menu `⋯` tem: Abrir, Editar, Duplicar como variação, Definir como referência, Copiar link, Exportar, Excluir (com confirmação e `Desfazer` em toast por 5 s).

## Estados

- Vazio: igual ao da [Visão geral](01-visao-geral.md).
- Busca sem resultado: "Nenhum cenário encontrado para "<termo>"" e `Limpar busca`.
- Cenários que não puderam ser carregados (localStorage inválido): banner de atenção no topo com `Ver detalhes`.
