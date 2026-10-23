import { test } from "uvu";
import * as assert from "uvu/assert";
import { readFileSync } from "node:fs";
import { confirmarCurva, curvaPodeAlimentarMotor } from "../src/lib/curvaRisco.js";
import { CHAVE_CONFIRMACOES, curvasDoWorkspace, lerConfirmacoes, removerConfirmacao, salvarConfirmacao } from "../src/lib/workspaceCurvas.js";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/curva-risco-sintetica.json", import.meta.url), "utf8"));
const conf = { by: "Pablo", at: "2026-10-23", reason: "Premissas validadas" };

const memoria = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
};

test("confirmarCurva libera a curva para o motor", () => {
  assert.is(curvaPodeAlimentarMotor(fixture), false);
  const confirmada = confirmarCurva(fixture, conf);
  assert.is(confirmada.status, "confirmed");
  assert.equal(confirmada.confirmation, conf);
  assert.is(curvaPodeAlimentarMotor(confirmada), true);
  assert.is(fixture.status, "pending_confirmation");
});

test("confirmarCurva exige nome e motivo e rejeita curva já confirmada", () => {
  assert.throws(() => confirmarCurva(fixture, { ...conf, by: "  " }), /quem confirma/);
  assert.throws(() => confirmarCurva(fixture, { ...conf, reason: "" }), /motivo/);
  assert.throws(() => confirmarCurva(confirmarCurva(fixture, conf), conf), /já está confirmada/);
});

test("confirmações persistem no storage e são aplicadas às curvas", () => {
  const storage = memoria();
  assert.equal(lerConfirmacoes(storage), {});
  salvarConfirmacao(storage, fixture.version, conf);
  const [curva] = curvasDoWorkspace([fixture], lerConfirmacoes(storage));
  assert.is(curvaPodeAlimentarMotor(curva), true);
  removerConfirmacao(storage, fixture.version);
  const [pendente] = curvasDoWorkspace([fixture], lerConfirmacoes(storage));
  assert.is(curvaPodeAlimentarMotor(pendente), false);
});

test("storage corrompido ou inválido é ignorado", () => {
  const storage = memoria();
  storage.setItem(CHAVE_CONFIRMACOES, "{não é json");
  assert.equal(lerConfirmacoes(storage), {});
  storage.setItem(CHAVE_CONFIRMACOES, JSON.stringify({ v1: { by: "" } }));
  assert.equal(lerConfirmacoes(storage), {});
});

test("curvas ficam da versão mais nova para a mais antiga", () => {
  const v2 = { ...fixture, version: "v2" };
  const v10 = { ...fixture, version: "v10" };
  assert.equal(curvasDoWorkspace([fixture, v10, v2], {}).map((c) => c.version), ["v10", "v2", fixture.version]);
});

test.run();
