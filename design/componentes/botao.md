# Componente: Botão

## Variações

| Variação | Aparência | Quando usar |
|---|---|---|
| `primario` | Fundo `--brand`, texto escuro `#04120F` | Uma ação principal por tela (`Salvar e simular`, `+ Novo cenário`) |
| `secundario` | Fundo `--surface-2`, borda `--border-strong` | Ações de apoio (`Comparar`, `Exportar`) |
| `fantasma` | Sem fundo; hover `--surface-2` | Ações em toolbar, menus, `Cancelar` |
| `perigo` | Texto `--negative`; fundo `--negative` só na confirmação | `Excluir` |
| `icone` | Quadrado 32px, só ícone | Toolbar; exige `aria-label` e tooltip |

Tamanhos: `sm` 28px, `md` 36px (padrão), `lg` 44px (CTA de estado vazio).

## Estados

- **Hover:** escurece ou clareia o fundo (`--brand-hover` no primário).
- **Foco:** outline de 2px `--brand`, com offset de 2px.
- **Desabilitado:** opacidade 0,5, `cursor: not-allowed` e tooltip explicando o motivo quando não for óbvio.
- **Carregando:** spinner de 14px no lugar do ícone, com o texto mantido para preservar a largura e `aria-busy="true"`.

## Regras

- O rótulo é um verbo no infinitivo ou imperativo curto: `Simular`, `Exportar CSV`.
- Ícone à esquerda do texto; `▾` à direita para menus.
- Ações destrutivas sempre pedem confirmação ou oferecem `Desfazer`.
