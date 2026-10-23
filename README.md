#15 Simulador de Decisões

MVP web para simular decisões comerciais em uma fintech de crédito. Compara um cenário atual, descontos e aumento de custos para uma carteira fictícia de empréstimos pessoais.

## Executar localmente

```bash
npm ci
npm run dev
```

O Vite inicia em http://localhost:3001.

## Estrutura

- `src/lib/engine.js`: motor determinístico e fórmulas provisórias.
- `src/lib/schemas.js`: schemas de entrada e saída.
- `src/views/`: interface do simulador e comparador.
- `test/`: testes de cálculo e cenários de demonstração.
- `METODOLOGIA.md`: processo de trabalho para hackathon.
- `docs/EXECUCAO.md`: fases e pendências da arquitetura técnica.

Os dados exibidos na demo são fictícios. As fórmulas atuais são provisórias até a organização fornecer as fórmulas oficiais.
