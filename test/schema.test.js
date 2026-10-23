import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { validarCarteira } from '../src/lib/schema.js';

const carteira = { nome: 'Empréstimo pessoal', contrato: 5000, receita: 200, contratos: 3000, funding: 60, cobranca: 10, fixo: 150000, mix: { A: 40, B: 40, C: 20 } };
test('validação impede valores infinitos antes de simular', () => {
  for (const campo of ['contrato', 'receita', 'contratos', 'funding', 'cobranca', 'fixo']) assert.is(validarCarteira({ ...carteira, [campo]: Infinity }).ok, false);
});
test('quantidade de contratos precisa ser inteira', () => {
  assert.is(validarCarteira({ ...carteira, contratos: 1.5 }).ok, false);
  assert.is(validarCarteira(carteira).ok, true);
});
test('mix vazio ou fora de 100% impede a comparação', () => {
  assert.is(validarCarteira({ ...carteira, mix: { A: '', B: 40, C: 20 } }).ok, false);
  assert.is(validarCarteira({ ...carteira, mix: { A: 41, B: 40, C: 20 } }).ok, false);
});
test.run();
