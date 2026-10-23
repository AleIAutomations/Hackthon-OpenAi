# Execução do plano técnico

## Fase atual: 0 — Fundação

- [x] Regras compartilhadas para agentes em `AGENTS.md`.
- [x] CI básica para instalação, testes existentes e build em `.github/workflows/ci.yml`.
- [x] Schema Zod para entrada e saída do motor em `src/lib/schemas.js`.
- [x] Motor determinístico provisório e fixtures dos quatro cenários em `src/lib/engine.js`.
- [x] Gabaritos automatizados em `test/engine.test.js`.
- [x] Registrar Zod 4.1.11 no manifesto e lockfile; preparar o schema compartilhado.
- [ ] Executar `npm test` e `npm run build` e confirmar o portão verde.
- [ ] Confirmar fórmulas oficiais da organização antes de substituir as provisórias.

O repositório recebido é um MVP React + Vite. O schema, motor, gabaritos, manifesto e lockfile estão preparados. A Fase 0 só deve ser marcada como concluída depois que os testes e o build passarem.

## Portões seguintes

1. **Fase 1 — MVP sem IA (F01–F07):** entradas do funil e custos, comparação, variações, memória de cálculo, ponto de equilíbrio, waterfall e cenário de alta do CDI. Não iniciar antes do gabarito verde.
2. **Fase 2 — IA (F08–F09):** extração estruturada com confirmação, pareceres com validação de números e fallback. Não iniciar antes da demo sem IA estar funcionando.
3. **Fase 3 — Diferenciais (F10–F14):** premissas editáveis, custos por proposta, alertas, curva de risco versionada e compartilhamento.
4. **Fase 4 — Demo e pitch:** checklist de segurança, roteiro, ensaio e congelamento de código.

## Dependências externas ainda abertas

- Fórmulas oficiais e autorização das premissas adicionais pelo hackathon.
- Validação com Pablo das premissas de custo de risco, LGD e elasticidade.
- Regras de uso do Home Credit e eventual dataset alternativo.
- Escolha de login público/obrigatório, modelo OpenAI e duração do evento.

Os dados da demo são fictícios. Nenhuma dessas pendências deve ser substituída por alegações de mercado sem fonte ou confirmação do time.
