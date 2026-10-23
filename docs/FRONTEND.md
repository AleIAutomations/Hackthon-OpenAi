# Front-end do simulador

Dashboard aprovado por Carlos: superfícies claras, azul, navegação lateral, premissas horizontais, três cenários, gráfico e ajustes. Em celulares a navegação fica no topo e as regiões empilham.

## Executar

`npm ci`, `npm run dev` (porta 3001), `npm run build`.

## Fluxo

O exemplo fictício abre preenchido: resultado atual R$ 90.000; desconto de 0,5 p.p. e inadimplência +50% resultam em R$ 15.000 cada. Edite premissas e sliders para recalcular. O botão de mix expande as três faixas. Valores vazios, não finitos, contratos fracionários ou mix diferente de 100% suspendem a comparação e as exportações. Resultados negativos e receita zero são tratados explicitamente.

O gráfico oferece tabela acessível e a memória de cálculo explica as premissas. A fonte Inter e a licença OFL estão em public/fonts; não há chamadas externas em runtime. A página depende de um servidor estático para abrir, mas a simulação funciona sem serviços externos. Recarregar restaura o exemplo; os dados não são persistidos.

## Exportar

CSV com BOM UTF-8, ponto e vírgula e vírgula decimal para Excel em PT-BR. JSON preserva base, ajustes e resultados numéricos. Ambos usam os mesmos resultados exibidos.

## Verificação

Compilação de produção aprovada. Quatorze testes aprovados em calc.test.js, credito.test.js e schema.test.js. A suíte completa tem três falhas anteriores à alteração em engine.test.js: breakEvenConversion do desconto, financialMargin do CDI e default de sideEffects.enabled. Esse motor alternativo não é usado pelo dashboard e não foi modificado; não tratar a suíte completa como verde.

Navegador: exemplo, sliders, mix inválido, campo vazio, resultado negativo, atual zero, receita zero, tabela, foco de navegação e download/inspeção de CSV e JSON. Sem erros no console. Capturas em .impeccable/review; desktop 1440, celular 390 e viewport do usuário 1280.
