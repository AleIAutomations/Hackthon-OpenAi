import { test } from "uvu";
import * as assert from "uvu/assert";
import { ScenarioInputSchema } from "../src/lib/schemas.js";
import { simulateDemoScenarios } from "../src/lib/engine.js";

const results = simulateDemoScenarios();

test("gabarito: cenário Atual", () => {
  assert.is(results.baseline.contracts, 3000);
  assert.is(results.baseline.financialMargin, 420000);
  assert.is(results.baseline.riskAdjustedResult, 90000);
});

test("gabarito: desconto de 0,5 p.p.", () => {
  assert.is(results.discount.revenue, 525000);
  assert.is(results.discount.riskAdjustedResult, 15000);
  assert.equal(results.discount.breakEvenConversion, 0.727273);
});

test("gabarito: desconto com efeito de conversão", () => {
  assert.is(results.discountWithEffect.contracts, 3480);
  assert.is(results.discountWithEffect.financialMargin, 400200);
  assert.is(results.discountWithEffect.riskAdjustedResult, 41400);
});

test("gabarito: CDI sobe para 1,4% a.m.", () => {
  assert.is(results.cdiUp.financialMargin, 390000);
  assert.is(results.cdiUp.riskAdjustedResult, 60000);
});

test("schema aplica padrões e rejeita campos extras", () => {
  const parsed = ScenarioInputSchema.parse({
    label: "Teste", proposals: 1, approvalRate: 0.5, conversionRate: 0.5,
    avgTicket: 100, monthlyRate: 0.04, fundingCdiMonthly: 0.01,
    fundingSpreadMonthly: 0, riskCostMonthly: 0, riskCostSource: "manual",
    opCostPerContract: 0, fixedCosts: 0,
  });
  assert.is(parsed.feePerContract, 0);
  assert.is(parsed.costPerProposal, 0);
  assert.is(parsed.sideEffects.enabled, false);
  assert.throws(() => ScenarioInputSchema.parse({ ...parsed, unexpected: true }));
});

test.run();
