import { ScenarioInputSchema, ScenarioResultSchema } from "./schemas.js";

const roundBRL = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

// Motor puro: as fórmulas provisórias vivem neste módulo; nenhuma I/O ou serviço externo.
export function simulate(input) {
  const scenario = ScenarioInputSchema.parse(input);
  const contracts = roundBRL(scenario.proposals * scenario.approvalRate * scenario.conversionRate);
  const volume = roundBRL(contracts * scenario.avgTicket);
  const revenue = roundBRL(contracts * (scenario.avgTicket * scenario.monthlyRate + scenario.feePerContract));
  const fundingCost = roundBRL(contracts * scenario.avgTicket * (scenario.fundingCdiMonthly + scenario.fundingSpreadMonthly));
  const financialMargin = roundBRL(revenue - fundingCost);
  const riskCost = roundBRL(contracts * scenario.avgTicket * scenario.riskCostMonthly);
  const opCost = roundBRL(contracts * scenario.opCostPerContract);
  const proposalCost = roundBRL(scenario.proposals * scenario.costPerProposal);
  const riskAdjustedResult = roundBRL(financialMargin - riskCost - opCost - proposalCost - scenario.fixedCosts);
  const contributionPerContract = scenario.avgTicket * (scenario.monthlyRate - scenario.fundingCdiMonthly - scenario.fundingSpreadMonthly - scenario.riskCostMonthly) + scenario.feePerContract - scenario.opCostPerContract;
  const breakEvenDenominator = scenario.proposals * scenario.approvalRate * contributionPerContract;
  const breakEvenConversion = breakEvenDenominator > 0
    ? (riskAdjustedResult + scenario.fixedCosts + proposalCost) / breakEvenDenominator
    : null;
  const result = {
    contracts,
    volume,
    revenue,
    fundingCost,
    financialMargin,
    riskCost,
    opCost,
    proposalCost,
    riskAdjustedResult,
    riskAdjustedReturnOnVolume: volume > 0 ? roundBRL(riskAdjustedResult / volume) : null,
    breakEvenConversion: breakEvenConversion === null ? null : roundBRL(breakEvenConversion * 1e6) / 1e6,
    trace: [
      { indicator: "Contratos", formula: "P × a × c", value: contracts },
      { indicator: "Volume concedido", formula: "N × T", value: volume },
      { indicator: "Receita", formula: "N × (T × i + f)", value: revenue },
      { indicator: "Funding", formula: "N × T × (CDI + spread)", value: fundingCost },
      { indicator: "Margem financeira", formula: "Receita − funding", value: financialMargin },
      { indicator: "Custo de risco", formula: "N × T × r", value: riskCost },
      { indicator: "Custo operacional", formula: "N × o", value: opCost },
      { indicator: "Custo de propostas", formula: "P × k", value: proposalCost },
      { indicator: "Resultado ajustado ao risco", formula: "Margem − risco − operação − propostas − CF", value: riskAdjustedResult },
    ],
  };
  return ScenarioResultSchema.parse(result);
}

export function simulateDemoScenarios() {
  const baseline = {
    label: "Atual",
    proposals: 20_000,
    approvalRate: 0.3,
    conversionRate: 0.5,
    avgTicket: 5_000,
    monthlyRate: 0.04,
    feePerContract: 0,
    fundingCdiMonthly: 0.01,
    fundingSpreadMonthly: 0.002,
    riskCostMonthly: 0.01,
    riskCostSource: "manual",
    opCostPerContract: 10,
    costPerProposal: 0,
    fixedCosts: 150_000,
  };
  return {
    baseline: simulate(baseline),
    discount: simulate({ ...baseline, label: "Desconto", monthlyRate: 0.035 }),
    discountWithEffect: simulate({ ...baseline, label: "Desconto + efeito", monthlyRate: 0.035, conversionRate: 0.58 }),
    cdiUp: simulate({ ...baseline, label: "CDI sobe", fundingCdiMonthly: 0.014 }),
  };
}
