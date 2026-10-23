# Princípios do produto

## Proposta de valor

> **Veja quanto cada decisão comercial custa no resultado da sua carteira antes de tomá-la.**

Exemplo com os dados fictícios da demonstração: *dar 0,5 p.p. de desconto na taxa derruba o resultado do mês de R$ 90.000 para R$ 15.000 (−83%)*. O produto existe para que esse tipo de conclusão apareça em segundos, com o cálculo à vista.

## Personas

| Persona | Objetivo | O que precisa ver primeiro |
|---|---|---|
| **Gerente de produto de crédito** | Decidir preço e campanhas | Resultado por cenário e variação vs. atual |
| **Analista de risco** | Medir o efeito de inadimplência e de mudanças na política | Custo de risco, sensibilidade, origem do custo de risco (manual ou ML) |
| **Diretoria / CFO** | Aprovar ou vetar uma mudança | Um número, uma frase de insight e o waterfall |
| **Jurado do hackathon** | Entender o produto em 3 minutos | Demonstração com dados fictícios pré-carregados, em até 3 cliques |

## Regras inegociáveis (vêm de `AGENTS.md`)

1. **O motor é a única fonte de números.** Todo valor exibido vem de `simulate()` (`src/lib/engine.js`). Componentes não fazem contas de negócio. Formatar (moeda, %, arredondamento visual) é permitido; somar, multiplicar ou derivar indicadores não é.
2. **IA interpreta e explica, nunca calcula.** Na fase 2, a IA preenche rascunhos de entrada (sempre confirmados pela pessoa usuária) e escreve pareceres. Todo número citado num parecer precisa bater com o resultado do motor; se não bater, o parecer é descartado e entra o texto de fallback.
3. **Dados fictícios são sempre identificados.** Qualquer tela com dados de demonstração exibe o selo `Dados fictícios` (ver [alertas](componentes/alertas.md)).
4. **Fórmulas provisórias são identificadas.** Enquanto as fórmulas oficiais não forem validadas, a memória de cálculo e as exportações exibem o selo `Fórmulas provisórias`.
5. **Funciona sem serviços externos.** Sem chamadas de rede no caminho principal. Fontes e ícones vão embutidos no build. Recursos de IA degradam com elegância quando estão indisponíveis.
6. **Sem segredos no frontend.** Nenhuma chave em variáveis `VITE_*`. Sem `dangerouslySetInnerHTML`, inclusive para renderizar texto de IA.
7. **Validação na borda.** Toda entrada (formulário, importação de JSON, link compartilhado, localStorage) passa pelos schemas de `src/lib/schemas.js` antes de chegar ao motor. Os erros aparecem em pt-BR legível.

## Tom e voz

- **Direto e numérico.** "Resultado cai 83%" é melhor que "Houve uma redução significativa".
- **Termos do mercado de crédito brasileiro:** taxa a.m., p.p., CDI, spread, funding, inadimplência, ticket médio.
- **Sem jargão de TI:** escreva "Não foi possível ler o arquivo", nunca "JSON parse error".
- **Verbos de ação nos botões:** `Simular`, `Comparar`, `Exportar CSV`, `Salvar cenário`.
- **Erros dizem como resolver:** "A taxa de aprovação deve ficar entre 0% e 100%."

## Princípios de UX

1. **Tempo até o primeiro insight ≤ 3 cliques.** Na primeira visita, o workspace já vem com o cenário "Atual" e três variações de demonstração.
2. **Recalcular em tempo real.** Editar uma entrada atualiza os resultados na hora (debounce de 150 ms), sem botão "calcular" nas telas de análise.
3. **Mostrar o porquê.** Todo KPI tem um atalho para a linha correspondente da memória de cálculo.
4. **Comparação é o centro.** Variações sempre aparecem com delta absoluto e percentual contra o cenário de referência.
5. **Densidade com respiro.** Tabelas densas, com tipografia tabular e espaçamento consistente (ver [design system](design-system.md)).
6. **Teclado em primeiro lugar.** Tudo é navegável por teclado, e há atalhos globais (ver [app shell](componentes/app-shell.md)).
