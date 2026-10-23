---
version: 1
slug: "src-main-jsx"
primary_target: "src/main.jsx"
related_targets: ["src/styles.css","src/views/Dashboard.jsx"]
---

# Simulador de carteira

Modo: Operate. Banca do hackathon compara três cenários e explora premissas com dados fictícios.

## Direction contract

THESIS: Dashboard financeiro convencional escolhido explicitamente por Carlos; comparação simultânea e legível.

OWN-WORLD: Fundo azul acinzentado claro, branco, azul vivo; grade regular, divisórias finas, raios moderados; fonte sans e números tabulares.

STORY: Ler premissas, comparar resultados, ajustar desconto e inadimplência e exportar.

FIRST VIEWPORT: Sidebar branca de 230px; header com título e exportações; formulário horizontal; três cartões; gráfico de colunas agrupadas à esquerda e dois sliders à direita. A ação primária é exportar CSV. Em mobile a sidebar vira cabeçalho e navegação curta; regiões empilham.

FORM: Canon escolhido na semente b745933d; imagem .impeccable/mocks/decision/canon.png aprovada pelo usuário em 23/10/2026. Preservar a composição escolhida, sem reabrir identidade. Gráfico é desenhado de dados em runtime. Nenhum raster na UI de produção.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
