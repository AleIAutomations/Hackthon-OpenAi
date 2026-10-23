# Tela: Assistente IA (`#/assistente`): fase 2

Implementa **F08** (extração estruturada com confirmação). O componente de parecer (**F09**) aparece no detalhe e no comparador.

> [!IMPORTANT]
> Esta tela só existe a partir da fase 2. Até lá, o item da sidebar aparece com o badge `Em breve`, desabilitado. A IA **nunca calcula** nem salva nada sem confirmação.

## Wireframe

```
Assistente IA   BETA                                                   ✦ Modelo: (a definir)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Descreva a mudança que você quer simular                                                 │
│ ┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ E se a gente der 0,5 p.p. de desconto na taxa e a conversão subir para 58%?          │ │
│ └──────────────────────────────────────────────────────────────────────────────────────┘ │
│ Partir de: [ Atual ▾ ]                                              [ Gerar rascunho ✦ ] │
│ Sugestões:  "CDI sobe 0,4 p.p."  "Inadimplência +50%"  "Dobrar custo por proposta"       │
└────────────────────────────────────────────────────────────────────────────────────────┘

Rascunho para revisão                                      ⓘ Nada foi salvo ainda
┌───┬──────────────────────┬────────────────┬────────────────┐
│ ☑ │ Campo                │ Atual          │ Rascunho       │
├───┼──────────────────────┼────────────────┼────────────────┤
│ ☑ │ Taxa de juros        │ 4,00% a.m.     │ 3,50% a.m.     │
│ ☑ │ Taxa de conversão    │ 50,0%          │ 58,0%          │
│ ☐ │ Nome do cenário      │ —              │ Desconto + efeito │
└───┴──────────────────────┴────────────────┴────────────────┘
Interpretação: "Desconto de 0,5 p.p. ⇒ taxa 4,00% → 3,50% a.m."
                                   [Descartar]  [Confirmar e abrir no editor →]
```

## Comportamento (F08)

1. A pessoa escreve o texto e escolhe o cenário de partida.
2. O frontend envia o texto e o input do cenário de partida para o serviço de IA. O modelo e o endpoint ainda não foram definidos (veja as dependências em `docs/EXECUCAO.md`). Nenhuma chave fica no frontend.
3. A resposta é um objeto parcial de `ScenarioInput`. O frontend junta esse objeto ao cenário de partida e valida o resultado com `ScenarioInputSchema.safeParse`.
4. A tabela de diff mostra só os campos alterados, cada um com checkbox (todos marcados por padrão).
5. `Confirmar e abrir no editor` abre `#/cenarios/novo?de=<partida>` com os campos aceitos já preenchidos e marcados como alterados. **Salvar continua sendo uma ação no editor.**

## Estados e fallback

| Situação | Comportamento |
|---|---|
| Fase 1 / IA desligada por configuração | Item da sidebar com `Em breve`; rota mostra estado vazio explicativo |
| Carregando | Skeleton na tabela de rascunho + botão "Gerar rascunho" com spinner; cancelável |
| Serviço indisponível / timeout (10 s) | Banner de atenção "Assistente indisponível no momento. Você pode criar a variação manualmente." + `Abrir editor` |
| Rascunho inválido no schema | "Não consegui interpretar com segurança. Tente reformular ou use o editor." Erros do schema listados em pt-BR |
| Nenhum campo alterado | "Não identifiquei mudanças no texto." |

## Parecer (F09), usado em outras telas

- Card com o selo `✦ Gerado por IA · números conferidos com o motor`.
- Antes de exibir, o frontend extrai os números do texto (moeda, %, p.p.) e confere cada um com o resultado do motor. Se algum não bater, o texto é descartado em silêncio e aparece o "Resumo automático" determinístico.
- O texto é renderizado como texto puro. Para Markdown, só uma whitelist mínima (negrito e listas) e sanitizado, nunca com `dangerouslySetInnerHTML`.
- `Regenerar` fica disponível; feedback de 👍/👎 é opcional e fica só local.
