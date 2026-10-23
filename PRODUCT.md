# Simulador de Decisões
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Apresentadores e banca do hackathon. Prioridade confirmada por Carlos: demonstração clara da carteira de crédito e comparação de cenários.

## Product Purpose
Simular o resultado mensal de uma carteira fictícia de empréstimo pessoal e evidenciar o impacto de desconto e inadimplência.

## Operating Context
Demonstração em português brasileiro, três cenários lado a lado e exportação CSV/JSON.

## Capabilities and Constraints
React 19, Vite e CSS puro. Preservar o motor determinístico existente e os dados fictícios. Funcionar offline e sem serviços externos. Fórmulas provisórias identificadas. Sem IA na interface. O pipeline offline de ML em ml/ e as curvas versionadas foram adicionados ao repositório; este dashboard usa o mix tabelado original da demonstração. Taxas decimais no motor; valores em reais.

## Evidence on Hand
README.md, AGENTS.md, src/lib/credito.js e testes. Carteira demonstrativa: 3.000 contratos, receita por contrato de R$ 200, resultado atual de R$ 90.000. Nenhuma alegação comercial real.

## Product Principles
- Comparar cenários contra a referência atual.
- Tornar ajustes e consequências legíveis para a banca.
- Exibir dados fictícios e premissas com clareza.
- Preservar as fórmulas centralizadas e o uso offline.
