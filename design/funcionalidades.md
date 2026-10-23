# Funcionalidades

Fonte: fases e portões de [`docs/EXECUCAO.md`](../docs/EXECUCAO.md).

> [!NOTE]
> A numeração F01–F14 abaixo **segue a ordem em que as funcionalidades aparecem** em `docs/EXECUCAO.md`. Confira com o PDF de documentação técnica do time antes de usar os IDs em títulos de PR. F15–F18 não estão descritas no repositório e ficaram fora desta especificação.

Regra de entrega (`AGENTS.md`): uma funcionalidade por branch e por PR, com o ID no título (ex.: `F02: Comparador de cenários`).

## Visão geral

| ID | Funcionalidade | Fase | Telas |
|---|---|---|---|
| F01 | Entradas do funil e custos | 1 · MVP sem IA | Editor de cenário |
| F02 | Comparação de cenários | 1 | Comparador |
| F03 | Variações de cenário | 1 | Editor, Detalhe, Comparador |
| F04 | Memória de cálculo | 1 | Detalhe, Comparador |
| F05 | Ponto de equilíbrio | 1 | Detalhe |
| F06 | Waterfall do resultado | 1 | Detalhe, Comparador |
| F07 | Cenário de alta do CDI | 1 | Comparador, Editor |
| F08 | Extração estruturada com confirmação (IA) | 2 · IA | Assistente IA → Editor |
| F09 | Pareceres com validação de números e fallback (IA) | 2 | Detalhe, Comparador |
| F10 | Premissas editáveis | 3 · Diferenciais | Premissas, Editor |
| F11 | Custos por proposta | 3 | Editor, Detalhe |
| F12 | Alertas | 3 | Detalhe, Comparador |
| F13 | Curva de risco versionada | 3 | Premissas, Editor |
| F14 | Compartilhamento | 3 | Compartilhar e exportar |

Portões: a fase 1 só começa depois do gabarito do motor (`npm test`) estar verde, e a fase 2 só depois da demo sem IA estar funcionando.

---

## Fase 1 · MVP sem IA

### F01: Entradas do funil e custos
O usuário descreve a carteira de um mês em um formulário organizado em quatro seções: **Funil**, **Preço**, **Funding e risco** e **Custos**. Cada campo corresponde a uma chave de `ScenarioInputSchema` (dicionário completo em [arquitetura-frontend.md](arquitetura-frontend.md#dicionário-de-campos)).

**Critérios de aceite**
- [ ] Os campos de taxa aparecem em **%** e são enviados ao motor como **decimal** (4% → `0.04`). A conversão fica num único utilitário de formatação.
- [ ] Os campos monetários usam máscara BRL (`R$ 5.000,00`) e são enviados como `number` em reais.
- [ ] Os erros vêm do schema Zod e aparecem **abaixo do campo**, em pt-BR, depois do blur.
- [ ] O botão `Salvar e simular` fica desabilitado enquanto houver erro, e o resumo de erros no topo do formulário leva até cada campo com problema.
- [ ] Um painel lateral de pré-visualização mostra o resultado ajustado ao risco atualizado em tempo real.
- [ ] Nenhuma fórmula no componente: a pré-visualização chama `simulate()`.

### F02: Comparação de cenários
Comparar de 2 a 4 cenários lado a lado contra um **cenário de referência** (por padrão, "Atual").

**Critérios de aceite**
- [ ] A tabela de comparação lista cada indicador de `ScenarioResult` em linhas e cada cenário em colunas.
- [ ] Cada célula de variação mostra o valor, o delta absoluto (R$) e o delta % contra a referência, com cor semântica (verde quando melhora o resultado, vermelho quando piora). Em linhas de custo, um aumento é ruim.
- [ ] É possível trocar o cenário de referência pelo cabeçalho da coluna.
- [ ] Uma frase de insight no topo é gerada a partir de um template determinístico com os números do motor (ex.: "Desconto de 0,5 p.p. reduz o resultado em 83%").
- [ ] A seleção de cenários fica na URL (`#/comparar?ids=a,b,c&ref=a`).

### F03: Variações de cenário
Criar uma variação a partir de um cenário existente alterando poucas entradas.

**Critérios de aceite**
- [ ] A ação `Duplicar como variação` no detalhe e na lista abre o editor com os valores do cenário de origem e o nome "<origem> · variação".
- [ ] O editor destaca os campos que diferem do cenário de origem (marcador lateral e valor original em tooltip).
- [ ] A variação guarda `baseScenarioId` (metadado do frontend, fora do input do motor).
- [ ] Os quatro cenários de demonstração vêm pré-carregados: **Atual**, **Desconto**, **Desconto + efeito** e **CDI sobe**, com os valores de `simulateDemoScenarios()`.

### F04: Memória de cálculo
Mostrar, para cada indicador, a fórmula simbólica e o valor, usando `result.trace`.

**Critérios de aceite**
- [ ] Usar o componente [Memória de cálculo](componentes/memoria-calculo.md), alimentado só por `trace` (indicador, fórmula, valor).
- [ ] Uma legenda dos símbolos (P, a, c, N, T, i, f, CDI, spread, r, o, k, CF) mostra o valor de entrada de cada um.
- [ ] Clicar num KPI rola a página até a linha correspondente e a destaca.
- [ ] O selo `Fórmulas provisórias` fica visível.

### F05: Ponto de equilíbrio
Mostrar a **conversão de equilíbrio** (`breakEvenConversion`) contra a conversão atual.

**Critérios de aceite**
- [ ] O card de KPI mostra a conversão de equilíbrio em % e a distância em p.p. para a conversão atual.
- [ ] Um medidor horizontal de 0 a 100% marca a conversão atual e a de equilíbrio.
- [ ] Quando `breakEvenConversion` for `null` (contribuição por contrato ≤ 0), mostrar "Sem ponto de equilíbrio: cada contrato dá prejuízo" e disparar o alerta correspondente (F12).

### F06: Waterfall do resultado
Gráfico em cascata da **Receita** até o **Resultado ajustado ao risco**.

**Critérios de aceite**
- [ ] Barras: Receita → −Funding → **Margem financeira** (subtotal) → −Custo de risco → −Custo operacional → −Custo de propostas → −Custos fixos → **Resultado** (total). Todos os valores saem do resultado do motor; os custos fixos são a entrada `fixedCosts`.
- [ ] Barras com valor zero ficam ocultas (ex.: custo de propostas = 0).
- [ ] O tooltip mostra o valor e o percentual sobre a receita.
- [ ] No comparador, existe um modo "waterfall de diferença" entre referência e variação, com uma barra por indicador que mudou.

### F07: Cenário de alta do CDI
Preset rápido para estressar o funding.

**Critérios de aceite**
- [ ] O botão `+ Choque de CDI` no comparador cria uma variação da referência com `fundingCdiMonthly` alterado. Valor padrão: 1,4% a.m., como no gabarito; o valor é editável.
- [ ] A variação gerada se chama "CDI sobe para X% a.m." e é salva como cenário normal.

---

## Fase 2 · IA

> [!IMPORTANT]
> A IA nunca produz números exibidos. Toda a fase 2 tem que degradar para um estado funcional sem IA (ver [Assistente IA](telas/06-assistente-ia.md)).

### F08: Extração estruturada com confirmação
O usuário descreve um cenário em texto livre ("e se dermos 0,5 p.p. de desconto e a conversão subir para 58%?"). A IA devolve um **rascunho** de `ScenarioInput`, que só é aplicado depois de confirmado.

**Critérios de aceite**
- [ ] O rascunho é validado por `ScenarioInputSchema` antes de aparecer.
- [ ] A tela de confirmação mostra um diff campo a campo (de → para), e cada campo vem com um checkbox para aceitar ou rejeitar.
- [ ] Nada é salvo nem simulado sem clique explícito em `Confirmar e abrir no editor`.
- [ ] Campos que a IA não conseguiu inferir aparecem como "não alterado".

### F09: Pareceres com validação de números e fallback
Texto curto explicando o resultado de um cenário ou de uma comparação.

**Critérios de aceite**
- [ ] Antes de exibir o parecer, o frontend extrai todos os números do texto e confere cada um contra o resultado do motor (com tolerância de arredondamento). Se algum não bater, o parecer é descartado.
- [ ] No fallback, ou quando a IA está indisponível, o insight determinístico (template de F02) aparece com o rótulo "Resumo automático".
- [ ] O texto é renderizado como texto puro ou Markdown sanitizado, nunca com `dangerouslySetInnerHTML`.
- [ ] O selo `Gerado por IA · números conferidos com o motor` aparece no parecer.

---

## Fase 3 · Diferenciais

### F10: Premissas editáveis
Valores padrão (CDI vigente, spread, custo operacional por contrato, custos fixos, tabela de risco) editáveis numa tela própria e aplicados a novos cenários.

**Critérios de aceite**
- [ ] A tela [Premissas](telas/07-premissas.md) lista cada premissa com valor, unidade, fonte (texto livre) e data da última edição.
- [ ] Novos cenários herdam as premissas. Cenários existentes **não mudam** sozinhos, mas aparece o aviso "Premissas mudaram desde a criação deste cenário" com o botão `Aplicar premissas atuais`.
- [ ] Premissas simplificadoras ficam rotuladas como tal.

### F11: Custos por proposta
Expor `costPerProposal` (custo de análise/bureau por proposta recebida, aprovada ou não).

**Critérios de aceite**
- [ ] O campo fica na seção Custos do editor, com texto de ajuda.
- [ ] O custo de propostas aparece no waterfall e na memória de cálculo quando for > 0.

### F12: Alertas
Avisos determinísticos baseados no resultado do motor.

**Critérios de aceite**
- [ ] Regras mínimas (cada uma com severidade e texto):
  - `riskAdjustedResult < 0` → **crítico**: "Cenário com prejuízo no mês."
  - `breakEvenConversion === null` → **crítico**: "Contribuição por contrato negativa: não há conversão que equilibre."
  - `breakEvenConversion > conversionRate` → **atenção**: "Conversão atual abaixo do equilíbrio."
  - Queda de resultado vs. referência > 50% → **atenção**.
  - `riskCostSource === "manual"` → **informativo**: "Custo de risco informado manualmente."
- [ ] As regras ficam num módulo isolado (`src/features/alertas/regras.js`), testável e sem cálculo de indicadores: só comparam valores que o motor já devolveu.
- [ ] Os alertas aparecem no detalhe, no comparador (ícone por coluna) e na lista de cenários (contador).

### F13: Curva de risco versionada
Tabela de custo de risco mensal por faixa, com histórico de versões.

**Critérios de aceite**
- [ ] A tela de premissas tem uma aba "Curva de risco" com a versão ativa, a lista de versões (v1, v2…) e quem/quando/por quê de cada uma.
- [ ] No editor, o campo `riskCostMonthly` pode vir de "Manual" ou de "Curva vX". Se vier de uma curva aprovada como modelo de ML, `riskCostSource = "ml_confirmed"`; caso contrário, `"manual"`.
- [ ] Cada cenário registra a versão da curva usada, que aparece no detalhe e nas exportações.

### F14: Compartilhamento
Compartilhar um cenário ou uma comparação sem backend.

**Critérios de aceite**
- [ ] `Copiar link` gera `#/compartilhado/<payload>`, em que o payload é o JSON de entrada comprimido e codificado em base64url. Só entradas vão no link, nunca resultados: quem abre recalcula com o motor.
- [ ] Ao abrir um link, o payload é validado pelo schema. Se for inválido, aparece "Link inválido ou corrompido".
- [ ] A visualização compartilhada é somente leitura, com o botão `Salvar no meu workspace`.
- [ ] Exportar CSV, JSON e PDF (impressão do navegador) fica descrito em [Compartilhar e exportar](telas/08-compartilhar-exportar.md).
