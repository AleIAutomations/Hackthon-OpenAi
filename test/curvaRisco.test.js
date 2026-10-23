import { test } from "uvu";
import * as assert from "uvu/assert";
import { readFileSync, readdirSync } from "node:fs";
import { CurvaRiscoSchema, custoRiscoDaCurva, curvaPodeAlimentarMotor } from "../src/lib/curvaRisco.js";
import { simulate } from "../src/lib/engine.js";

const ler = (caminho) => JSON.parse(readFileSync(new URL(caminho, import.meta.url), "utf8"));
const fixture = ler("./fixtures/curva-risco-sintetica.json");
const DIR_CURVAS = new URL("../src/data/curvas-risco/", import.meta.url);

test("curvas publicadas em src/data/curvas-risco passam no schema", () => {
  const arquivos = readdirSync(DIR_CURVAS).filter((a) => a.endsWith(".json"));
  for (const arquivo of arquivos) {
    const curva = JSON.parse(readFileSync(new URL(arquivo, DIR_CURVAS), "utf8"));
    const r = CurvaRiscoSchema.safeParse(curva);
    assert.ok(r.success, `${arquivo}: ${r.error?.message}`);
    assert.is(`${curva.version}.json`, arquivo);
    const pds = curva.bands.map((f) => f.pd);
    assert.equal(pds, [...pds].sort((a, b) => a - b), `${arquivo}: PD deve crescer de A para E`);
  }
});

test("sem mix, custo de risco é o da carteira da curva", () => {
  assert.is(custoRiscoDaCurva(fixture), fixture.portfolio.riskCostMonthly);
});

test("mix concentrado numa faixa devolve o custo dessa faixa", () => {
  const e = fixture.bands.at(-1);
  assert.is(custoRiscoDaCurva(fixture, { [e.band]: 1 }), e.riskCostMonthly);
});

test("mix inválido gera erro legível", () => {
  assert.throws(() => custoRiscoDaCurva(fixture, { A: 0.5 }), /somar 100%/);
  assert.throws(() => custoRiscoDaCurva(fixture, { Z: 1 }), /faixa desconhecida/);
});

test("curva pendente não alimenta o motor; confirmada sim", () => {
  assert.is(curvaPodeAlimentarMotor(fixture), false);
  const confirmada = { ...fixture, status: "confirmed", confirmation: { by: "Analista", at: "2026-10-23", reason: "validação" } };
  assert.is(curvaPodeAlimentarMotor(confirmada), true);
  assert.not.ok(CurvaRiscoSchema.safeParse({ ...fixture, status: "confirmed" }).success);
});

test("custo da curva entra no motor como riskCostMonthly", () => {
  const r = simulate({
    label: "Curva", proposals: 20_000, approvalRate: 0.3, conversionRate: 0.5, avgTicket: 5_000,
    monthlyRate: 0.04, fundingCdiMonthly: 0.01, fundingSpreadMonthly: 0.002,
    riskCostMonthly: custoRiscoDaCurva(fixture), riskCostSource: "ml_confirmed",
    opCostPerContract: 10, fixedCosts: 150_000,
  });
  assert.is(r.riskCost, Math.round(3000 * 5000 * custoRiscoDaCurva(fixture) * 100) / 100);
});

test.run();
