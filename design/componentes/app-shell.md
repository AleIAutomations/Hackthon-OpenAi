# Componente: App shell

Estrutura fixa de todas as páginas: sidebar, topbar e área de conteúdo. É o que dá cara de SaaS ao produto.

## Anatomia

```
┌──────────────┬──────────────────────────────────────────────────────────┐
│ ◆ Simulador  │ Cenários / Atual          ⌘K Buscar…     ◐  ?  (AL) ▾   │ ← topbar 56px
│   de Decisões├──────────────────────────────────────────────────────────┤
│              │                                                          │
│ ⌂ Visão geral│                 conteúdo (max 1280px)                    │
│ ☰ Cenários  4│                                                          │
│ ⇄ Comparar   │                                                          │
│ ✦ Assistente │                                                          │
│   IA   BETA  │                                                          │
│ ⚙ Premissas  │                                                          │
│              │                                                          │
│ ──────────── │                                                          │
│ Carteira demo│                                                          │
│ Dados fictíc.│                                                          │
│ « Recolher   │                                                          │
└──────────────┴──────────────────────────────────────────────────────────┘
  sidebar 240px (64px recolhida)
```

## Sidebar

- Logo e nome do produto no topo. O nome é provisório; use o token de texto `Simulador de Decisões`.
- Itens de navegação com ícone e rótulo. O item ativo usa fundo `--brand-soft`, texto `--text` e barra de 2px `--brand` à esquerda.
- Contador discreto em "Cenários" (total).
- Badges: `BETA` (Assistente IA na fase 2) e `Em breve` (item desabilitado na fase 1).
- Rodapé: bloco do workspace ("Carteira demo" + selo `Dados fictícios`) e o botão `Recolher`. Sem autenticação, o workspace é único e local.
- Abaixo de `lg`: vira drawer, aberto pelo botão ☰ na topbar.

## Topbar

- **Breadcrumb** à esquerda (`Cenários / Atual`).
- **Paleta de comandos** (`Ctrl/⌘ + K`): busca cenários e ações ("Novo cenário", "Comparar…", "Ir para premissas", "Alternar tema").
- **Alternar tema** (◐): escuro ou claro, salvo nas preferências.
- **Ajuda** (?): popover com atalhos de teclado e link para esta documentação.
- **Avatar / menu:** sem login, mostra só "Workspace local" com `Configurações`, `Restaurar dados de demonstração` e `Exportar tudo (JSON)`. Se houver login no futuro, vira o menu de conta.

## Atalhos globais

| Atalho | Ação |
|---|---|
| `Ctrl/⌘ + K` | Paleta de comandos |
| `N` | Novo cenário |
| `G` depois `V` / `C` / `P` | Ir para Visão geral / Cenários / Premissas |
| `Ctrl/⌘ + Enter` | Salvar (no editor) |
| `?` | Mostrar atalhos |

Os atalhos de uma tecla ficam desativados enquanto o foco estiver em um campo de texto.

## Toasts

Ficam no canto inferior direito, empilham até 3 e somem após 4 s (5 s se tiverem `Desfazer`). Usam `role="status"`.
