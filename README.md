# #15 Simulador de Decisões

**Objetivo:** Simular como mudanças comerciais afetam o resultado mensal de um negócio, comparando 3 cenários. Produto único, um mês, fórmulas determinísticas.

## Tech Stack
- **Vite + React 19** (dev server, HMR, build estático)
- **CSS puro** (sem Tailwind/bootstrap — bundle leve)
- **Zod** (schemas para entradas e resultados do motor)
- **uvu** (testes de fórmulas, validação e cenários da demo)

## Dashboard implementado

O front-end demonstrativo abre com a carteira fictícia preenchida e três cenários lado a lado. Premissas e ajustes de desconto/inadimplência atualizam os resultados e o gráfico na mesma tela. Inclui edição do mix A/B/C, tabela comparativa, memória de cálculo, validação e exportações CSV/JSON.

O visual claro e azul foi aprovado em composição com Impeccable. A fonte Inter está incluída localmente sob licença OFL; a interface funciona sem serviços externos em runtime. As fórmulas de `credito.js` e `calc.js` foram preservadas. O pipeline e as curvas de risco existentes continuam no repositório; este dashboard mantém o mix tabelado da demonstração.

Consulte [o funcionamento do front-end](docs/FRONTEND.md), [o sistema visual](DESIGN.md) e [a captura desktop](.impeccable/review/desktop.png). O projeto SaaS em `design/` continua sendo a especificação-alvo; esta entrega não implementa todas as suas funcionalidades.

### Comandos

```bash
npm ci
npm run dev      # http://localhost:3001
npm run build    # gera /dist
```

## Spec
### Entradas
- **Nome do produto** (string)
- **Preço unitário** (R$)
- **Quantidade vendida** (unidades/mês)
- **Custo fixo total** (R$/mês)
- **Custo variável/unitário** (R$)

### Cálculos
```
custo_total   = fixo + (variavel * quantidade)
receita       = preco * quantidade
lucro         = receita - custo_total
margem        = (lucro / receita) * 100
```

### 3 Cenários
1. **Cenário Atual** (base)
2. **Com Desconto** (preço unitário reduzido)
3. **Custo Alto** (custo variável aumentado)

### Exportações
- **JSON:** `{ base, ajustes, resultados }` → download automático
- **CSV:** colunas `cenario,preco,quantidade,custo_total,receita,lucro,margem_pct`

## Demo Flow (≤ 3 cliques)
1. Abrir o dashboard → conferir ou editar a carteira já preenchida
2. Ajustar sliders → ver 3 cards e gráfico atualizarem em tempo real
3. `Exportar CSV` → salvar → abrir no Excel/Sheets

## Testes
```bash
npm test
```

## Estrutura
```
src/
├── main.jsx          # App root do dashboard
├── lib/calc.js       # fórmulas + validação input
├── lib/credito.js    # cenários e premissas da carteira de crédito
├── lib/engine.js     # motor determinístico (fórmulas provisórias)
├── lib/schemas.js    # schemas de entrada e saída com Zod
├── lib/schema.js     # validação produto
├── views/
│   ├── FormularioBase.jsx
│   ├── Comparador.jsx
│   ├── Dashboard.jsx       # tela principal, ajustes e exportação
│   ├── CarteiraForm.jsx   # premissas e mix de risco
│   └── GraficoCenarios.jsx # gráfico e tabela comparativa
└── styles.css        # dashboard responsivo
```

## Pendências (hackathon)
- [ ] Pitch deck: 3 cliques → 3 cenários → insight de margem
- [ ] GitHub repo + Actions deploy

## Especificação do frontend

O frontend definitivo (SaaS) está especificado em [`design/`](design/README.md): telas, componentes, design system, rotas, contrato com o motor e critérios de aceite F01–F14.

## Metodologia do time

Como o squad multi-agente se organiza (worktrees, board, red team, cronograma 24h): [METODOLOGIA.md](METODOLOGIA.md)

## Nicho: fintech de crédito

| Desafio | Na carteira |
|---|---|
| Preço | receita mensal por contrato (juros + tarifa) |
| Quantidade | contratos ativos no mês |
| Custo variável | funding + perda esperada (mix A/B/C tabelado) + cobrança |
| Custos fixos | time + tecnologia + compliance |

Dados fictícios (já no formulário): contrato R$ 5.000, receita R$ 200, 3.000 contratos, variável R$ 120 (60 + 50 + 10), fixos R$ 150.000.

| Cenário | Resultado |
|---|---|
| Atual | R$ 90.000 |
| Desconto de 0,5 p.p. (receita R$ 175) | R$ 15.000 (−83%) |
| Inadimplência +50% (perda R$ 75) | R$ 15.000 (−83%) |

> "Dar 0,5 p.p. de desconto custa o mesmo que ver a inadimplência subir 50%."

Cálculo em `src/lib/credito.js`, testes em `test/credito.test.js`. Explicação por LLM ainda não foi implementada.

## Modelo de risco (ML)

O pipeline em [`ml/`](ml/README.md) treina um modelo de probabilidade de inadimplência (PD) com o dataset público Home Credit Default Risk e publica uma **curva de risco versionada** em `src/data/curvas-risco/`. O app só lê essa curva (validada por `src/lib/curvaRisco.js`) e passa o custo de risco ao motor; nenhum modelo roda no navegador.
