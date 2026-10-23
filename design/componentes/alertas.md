# Componente: Alertas, banners e selos

## Banner

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠  Conversão atual abaixo do equilíbrio.                  [Ver]  [✕]   │
└────────────────────────────────────────────────────────────────────────┘
```

| Severidade | Cor | Ícone | Exemplo |
|---|---|---|---|
| `critico` | `--negative` | ⛔ | Cenário com prejuízo; sem ponto de equilíbrio |
| `atencao` | `--warning` | ⚠ | Queda > 50% vs. referência; conversão abaixo do equilíbrio |
| `info` | `--info` | ⓘ | Custo de risco manual; premissas mudaram; dados fictícios |
| `sucesso` | `--positive` | ✓ | Importação concluída |

- Fundo na cor da severidade com 10% de opacidade, borda esquerda de 3px na cor cheia e texto `--text`.
- `critico` e `atencao` usam `role="alert"`; os demais usam `role="status"`.
- Banners `info` podem ser dispensados e ficam dispensados por cenário no estado local.

## Regras de alerta (F12)

As regras ficam definidas em [funcionalidades.md › F12](../funcionalidades.md#f12-alertas) e implementadas em `src/features/alertas/regras.js`, que recebe `(input, result, resultReferencia?)` e devolve `{ id, severidade, mensagem, indicador? }[]`. Só compara valores; não calcula indicadores.

## Selos (badges)

Pílulas de 20px de altura, `--text-xs`, peso 500 e `--radius-sm`.

| Selo | Cor | Onde aparece |
|---|---|---|
| `Dados fictícios` | `--warning` (suave) | Cabeçalhos de página e workspace com dados de demo; exportações |
| `Fórmulas provisórias` | `--info` (suave) | Memória de cálculo, detalhe, exportações |
| `DEMO` | neutro | Linha de cenário de seed |
| `BETA` / `Em breve` | `--brand` (suave) / neutro | Sidebar |
| `✦ Gerado por IA · números conferidos` | `--info` | Parecer (F09) |
| `★ referência` | `--brand` | Cenário de referência |
