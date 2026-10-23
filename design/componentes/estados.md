# Componente: Estados vazios, carregamento e erro

Toda tela tem estes estados especificados. Nunca mostrar uma área em branco.

## Vazio

```
            ┌───────────┐
            │  ▢ ▢ ▢    │   ← ilustração simples em traço (SVG, 96px)
            └───────────┘
       Crie seu primeiro cenário
  Descreva o funil e os custos da carteira
  para ver o resultado do mês.
  [+ Novo cenário]   Restaurar dados de demonstração
```

- Título (`--text-lg`), uma frase de contexto e no máximo dois CTAs (primário e link).

| Onde | Título | CTA |
|---|---|---|
| Workspace vazio | Crie seu primeiro cenário | `+ Novo cenário` / Restaurar demo |
| Busca sem resultado | Nenhum cenário encontrado para "…" | `Limpar busca` |
| Comparador com < 2 | Escolha ao menos 2 cenários para comparar | seletor inline |
| Sensibilidade sem variações | Crie uma variação para ver o impacto | `Duplicar como variação` |
| Assistente (fase 1) | O assistente chega na próxima fase | `Abrir editor` |

## Carregamento

- O motor é síncrono, então as telas de cálculo **não** precisam de spinner. Usar skeletons só ao hidratar o estado do localStorage no primeiro render e nas chamadas de IA (fase 2).
- Os skeletons repetem a forma final (cards, linhas de tabela), com pulso suave e sem shimmer chamativo. Respeitar `prefers-reduced-motion`.

## Erro

| Situação | Título | Ação |
|---|---|---|
| Rota inexistente | Página não encontrada | `Ir para o início` |
| Cenário inexistente | Cenário não encontrado | `Voltar para cenários` |
| Link compartilhado inválido | Link inválido ou corrompido | `Ir para o início` |
| Erro inesperado (Error Boundary) | Algo deu errado nesta tela | `Recarregar` · `Exportar meus dados (JSON)` |
| Dados locais corrompidos | Alguns cenários não puderam ser carregados | `Ver detalhes` · `Descartar` |

- As mensagens não expõem stack traces nem detalhes técnicos. O detalhe técnico vai para um `<details>` recolhido, útil para reportar o problema.
