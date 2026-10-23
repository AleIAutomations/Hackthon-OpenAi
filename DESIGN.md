---
name: Simulador de Decisões
description: Dashboard financeiro claro para comparar cenários de uma carteira.
colors:
  blue: "#2563eb"
  blue-dark: "#1d4ed8"
  ink: "#172338"
  muted: "#64748b"
  border: "#dfe6ef"
  ground: "#f3f6fb"
  panel: "#fff"
  danger: "#b42f40"
  positive: "#217349"
  active-nav: "#e9f0ff"
  badge: "#e2edff"
  button-border: "#9db9fa"
  button-hover: "#edf3ff"
  input-border: "#d4deeb"
  divider: "#edf0f5"
  chart-cost: "#8290a5"
  chart-result: "#9fc3fc"
  chart-negative: "#c43b47"
typography:
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "36px"
    fontWeight: 730
    lineHeight: 1.22
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "17px"
    fontWeight: 690
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  result:
    fontFamily: "Inter, sans-serif"
    fontSize: "39px"
    fontWeight: 710
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  field: "5px"
  button: "6px"
  navigation: "7px"
  disclosure: "8px"
  panel: "10px"
spacing:
  icon-gap: "8px"
  compact-gap: "12px"
  control-gap: "13px"
  medium-gap: "16px"
  panel-gap: "18px"
  panel-padding: "20px"
  wide-padding: "22px"
  page-padding: "30px"
components:
  button-primary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blue-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
    textColor: "{colors.blue-dark}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.blue-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
  button-text:
    textColor: "#586d8b"
    padding: "3px 0"
  input:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.field}"
    height: "39px"
  navigation-active:
    backgroundColor: "{colors.active-nav}"
    textColor: "{colors.blue-dark}"
    rounded: "{rounded.navigation}"
    padding: "12px 15px"
  badge:
    backgroundColor: "{colors.badge}"
    textColor: "{colors.blue-dark}"
    rounded: "{rounded.field}"
    padding: "4px 9px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
---

# Design System: Simulador de Decisões

## Overview

**Creative North Star: "Dashboard financeiro convencional azul-claro"**

A direção aprovada usa fundo azul acinzentado claro, superfícies brancas e azul vivo. A linguagem é regular e sóbria: contornos finos, cantos moderados e números tabulares sustentam a leitura dos dados.

A fonte Inter local mantém a identidade e o funcionamento offline. A interface usa formas CSS e ícones SVG de traço; o gráfico também é SVG, construído com os dados em tempo de execução.

**Key Characteristics:**
- Superfícies brancas delimitadas sobre fundo claro.
- Hierarquia numérica com valores grandes e alinhamento tabular.
- Azul para referência, navegação e controles.
- Profundidade discreta e estados de foco visíveis.

## Colors

Paleta fria e luminosa, com cores semânticas reservadas ao resultado e à validação.

### Primary
- **Azul vivo** (`blue`): referência atual, controles deslizantes e receita no gráfico.
- **Azul profundo** (`blue-dark`): textos de exportação, navegação selecionada e selo informativo.
- **Azul de seleção** (`active-nav`) e **azul de selo** (`badge`): fundos suaves de estados e informação.

### Neutral
- **Tinta** (`ink`) e **texto secundário** (`muted`): hierarquia de leitura.
- **Fundo claro** (`ground`) e **painel branco** (`panel`): separação de áreas.
- **Contorno** (`border`), **contorno de campo** (`input-border`) e **divisória** (`divider`): organização interna.
- **Custo** (`chart-cost`) e **resultado** (`chart-result`): séries distintas do gráfico, identificadas também por legenda e rótulos.

Vermelho (`danger`, `chart-negative`) identifica prejuízo; verde (`positive`) identifica variação positiva. As exportações usam `button-border` e `button-hover`.

**The Referência Azul Rule.** A referência atual usa azul no valor e uma faixa superior; resultados negativos conservam o significado vermelho mesmo no cartão atual.

## Typography

**Display Font:** Inter, fallback sans-serif.
**Body Font:** Inter, fallback sans-serif.

Inter variável é carregada de `/fonts/inter-latin-variable.ttf`, com pesos disponíveis de 100 a 900 e `font-display: swap`. A licença local é OFL. Títulos usam espaçamento levemente fechado; montantes, saídas e tabelas usam números tabulares.

### Hierarchy
- **Headline:** título de página; o token desktop reduz para 29px até 1250px e 25px até 700px.
- **Title:** títulos de seção; comparação usa 19px, gráfico 16px e ajustes 15px no desktop.
- **Result:** montante principal; reduz para 31px até 1250px e 27px até 1000px; no mobile usa 34px.
- **Body:** texto geral e contexto de página.
- **Label:** campos, indicadores e informação auxiliar; há textos secundários locais de 10–11px.
- **Button:** ações contornadas; reduz para 11px até 1250px.

**The Números Tabulares Rule.** Valores comparáveis usam `font-variant-numeric: tabular-nums`, incluindo campos, cartões, barras e tabela.

## Layout

Desktop usa barra lateral fixa de 230px e conteúdo com largura máxima de 1560px. A página tem respiro lateral de 30px; os três cartões usam colunas iguais e intervalo de 18px. O formulário distribui seis campos e o resumo de mix em uma linha. A região analítica combina gráfico e ajustes na proporção 2,35:1.

Até 1250px a barra lateral passa a 200px, o formulário usa quatro colunas e os intervalos dos cartões passam a 14px. Até 1000px a barra tem 180px e a região analítica vira uma coluna; os ajustes usam duas colunas. Até 700px a navegação ocupa o cabeçalho, a página usa 18px laterais, os campos ficam em duas colunas e cartões e ajustes empilham. Os botões de exportação dividem a largura disponível.

O gráfico preserva largura mínima de 520px e rolagem horizontal, com instrução visível no mobile. A tabela também permite rolagem. Acima de 1500px há ajustes de respiro e da proporção analítica. Os valores finais da cascata CSS prevalecem sobre declarações anteriores.

## Elevation & Depth

Painéis, navegação e botões são planos: contornos e fundos suaves fazem a separação. A única sombra recorrente é a pequena sombra do polegar do slider WebKit (`0 1px 4px #1b3b6d26`). O foco usa contorno azul externo, não elevação.

**The Contorno Leve Rule.** Painéis usam borda fina e fundo branco; a sombra do slider é específica do controle, sem se estender aos cartões.

## Shapes

Cantos são suaves e utilitários: painéis usam `panel`, botões `button`, campos e selo `field`, navegação `navigation` e memória de cálculo `disclosure`. Legendas e marcadores usam círculos pequenos. Ícones usam SVG sem preenchimento, traço de 1,7 e extremidades arredondadas.

## Components

### Buttons

CSV e JSON são ações contornadas com fundo branco, texto azul profundo e a mesma geometria. O CSV conserva a classe primária, mas sua aparência final também é contornada. O hover suaviza o fundo; CSV intensifica a borda azul. Botões de texto servem para tabela e restauração. Desabilitados têm opacidade de 0,45. Transições de cor e borda duram 0,16s com `ease-out`.

### Chips

O selo de dados fictícios é informativo, com fundo azul suave, texto azul profundo e cantos de campo. Não possui estado selecionável.

### Cards / Containers

Painéis brancos têm contorno fino e raio de painel. O cartão atual recebe uma faixa azul superior de 4px. Os detalhes de receita, custos e margem têm divisórias horizontais e valores alinhados à direita; o rodapé de variação recebe fundo quase branco e uma divisória superior.

### Inputs / Fields

Campos numéricos usam envoltório branco contornado e prefixo monetário quando necessário. O contorno muda para azul no foco; navegação por teclado acrescenta contorno externo de 2px no envoltório. A altura base é 39px e chega a pelo menos 42px no mobile. A edição do nome do produto usa sublinhado. Erros aparecem em bloco vermelho suave com mensagem e lista.

### Navigation

Itens com ícones SVG têm fundo suave e texto azul no estado atual; no hover, recebem fundo de página. A barra lateral vira navegação horizontal compacta até 700px. O foco visível geral tem 3px, deslocado 3px.

### Comparação gráfica e ajustes

Colunas agrupadas usam as três cores de série e rótulos numéricos; valores negativos usam vermelho. Barras focadas recebem traço escuro, e hover/foco reduzem o brilho. A tabela pode ser expandida pelo botão correspondente. Os sliders mostram valor atual e limites, trilho azul/preenchimento neutro e polegar circular. A animação de altura e posição das barras dura 0,22s. A preferência de movimento reduzido desliga transições e animações.

## Do's and Don'ts

### Do:
- **Do** manter a paleta clara, as superfícies brancas e os contornos finos da direção aprovada.
- **Do** usar Inter local e números tabulares nos valores comparáveis.
- **Do** manter legendas, rótulos e tabela junto da comparação gráfica.
- **Do** preservar estados de foco e o comportamento de movimento reduzido.

### Don't:
- **Don't** substituir o gráfico de dados por imagem raster.
- **Don't** aplicar a sombra do slider como elevação de painéis.
- **Don't** tratar o nome de classe primária como evidência de botão preenchido; a aparência entregue é contornada.
