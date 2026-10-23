# AGENTS.md — Simulador de Decisões (Fintech de Crédito)

## Contexto do repositório

Aplicação de demonstração em React + Vite para comparar resultados de uma carteira fictícia de empréstimo pessoal em um período mensal. A implementação atual é um MVP offline-first; não possui API, autenticação, banco de dados, IA ou pipeline de ML. A documentação-alvo está no PDF de documentação técnica fornecido pelo time.

## Regras obrigatórias

1. O motor determinístico é a única fonte de números exibidos. IA, se adicionada no futuro, interpreta entradas e explica resultados; nunca calcula.
2. Mantenha o motor puro: sem I/O, `fetch`, `Date.now()` ou `Math.random()` nos cálculos.
3. Centralize fórmulas em `src/lib/credito.js` até uma migração aprovada para `packages/engine`; não duplique fórmulas na interface.
4. Taxas são decimais (0.04 = 4% a.m.) e valores monetários são reais. Identifique explicitamente qualquer premissa simplificadora.
5. Valide todos os dados externos em `src/lib/schema.js`; erros devem ser legíveis em pt-BR.
6. Dados de demonstração são fictícios e devem ser identificados como tais.
7. Não adicione segredos ao código ou ao repositório. Nenhum valor sensível pode ser exposto via `VITE_*`.
8. Toda nova dependência precisa ter justificativa e lockfile atualizado.
9. Não use `dangerouslySetInnerHTML` nem SQL concatenado.
10. Preserve o funcionamento da demonstração sem serviços externos.

## Comandos disponíveis

- `npm ci`
- `npm run dev` (porta 3001)
- `npm test`
- `npm run build`

## Definição de pronto

- Alteração cobre o critério de aceite correspondente à funcionalidade.
- Testes e build passam quando o ambiente permite executá-los.
- Sem segredos, sem exposição de dados em logs e com documentação atualizada quando contratos ou premissas mudarem.

## Fluxo de colaboração

Uma funcionalidade por branch e PR; o ID F01–F18 deve aparecer no título quando o repositório remoto estiver configurado. Não trabalhar simultaneamente no mesmo pacote. Toda PR requer CI verde e revisão humana. Agentes usam apenas dados e credenciais de desenvolvimento.

## Observações de escopo

O checkout fornecido não contém metadados Git. Não simule branches, PRs ou regras de proteção localmente. As fórmulas oficiais da organização ainda não foram fornecidas; as fórmulas provisórias devem permanecer identificadas como provisórias até validação.
