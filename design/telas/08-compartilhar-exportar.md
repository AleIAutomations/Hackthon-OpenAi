# Tela: Compartilhar e exportar

Implementa **F14** e as exportações. Não é uma página de navegação: são um modal de compartilhamento, um menu de exportação e a rota pública `#/compartilhado/:payload`.

## Modal "Compartilhar"

```
┌ Compartilhar comparação ─────────────────────────────── ✕ ┐
│ Quem abrir o link verá uma cópia somente leitura,          │
│ recalculada no navegador. Nada é enviado a servidores.     │
│                                                            │
│ [ https://.../#/compartilhado/eJx9kM1qwzAQ...    ] [Copiar]│
│                                                            │
│ ⓘ O link contém as entradas dos cenários. Não inclua       │
│   dados reais de clientes.                                 │
└────────────────────────────────────────────────────────────┘
```

- Payload: `{ v: 1, tipo: "cenario" | "comparacao", cenarios: [{ input }], ref }`, serializado em JSON, comprimido e codificado em base64url. Comprimir exige uma dependência como `lz-string`, que precisa ser justificada; sem compressão, use base64url direto.
- Com mais de ~2.000 caracteres, mostrar o aviso "Link muito longo para alguns apps; prefira exportar JSON".
- `Copiar` muda para `Copiado ✓` por 2 s.

## Rota `#/compartilhado/:payload`

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 👁 Visualização compartilhada · somente leitura      [Salvar no meu workspace]│
└───────────────────────────────────────────────────────────────────────────────┘
(conteúdo igual ao Detalhe ou ao Comparador, sem ações de edição)
```

- Decodifica, valida cada `input` com o schema e recalcula com `simulate()`.
- Payload inválido: [estado de erro](../componentes/estados.md) "Link inválido ou corrompido" com `Ir para o início`.
- `Salvar no meu workspace` copia os cenários para o estado local com novos `id`s e abre o resultado.

## Exportações

| Formato | Conteúdo | Nome do arquivo |
|---|---|---|
| **CSV** | Uma linha por cenário. Colunas: `cenario`, chaves de entrada, chaves de resultado, `delta_resultado`, `delta_resultado_pct` (vs. referência). Separador `;` e decimal `,` para abrir direto no Excel pt-BR; UTF-8 com BOM | `simulador-comparacao-AAAA-MM-DD.csv` |
| **JSON** | `{ versao: 1, geradoEm, formulas: "provisorias", dadosFicticios: bool, cenarios: [{ nome, input, result }] }`. Pode ser importado em Cenários (somente o `input` é lido) | `simulador-AAAA-MM-DD.json` |
| **PDF** | `window.print()` com folha de estilo `@media print`: fundo claro, sem sidebar, cabeçalho com nome e data, KPIs, tabela, waterfall e os selos `Dados fictícios` / `Fórmulas provisórias` | definido pelo navegador |

- O download usa `Blob` + `URL.createObjectURL`, sem rede.
- Toda exportação inclui os selos aplicáveis (dados fictícios, fórmulas provisórias, versão da curva de risco).
