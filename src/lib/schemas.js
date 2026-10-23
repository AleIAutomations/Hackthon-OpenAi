import { z } from "zod";

const rate = z.number().finite().min(0).max(1);
const money = z.number().finite().min(0).max(1e10);

// Source of truth para o formulário e o motor (taxas como decimais; dinheiro em BRL).
export const ScenarioInputSchema = z.object({
  label: z.string().trim().min(1).max(60),
  proposals: z.number().int().min(1).max(10_000_000),
  approvalRate: rate,
  conversionRate: rate,
  avgTicket: money.min(100),
  monthlyRate: rate.max(0.2),
  feePerContract: money.default(0),
  fundingCdiMonthly: rate.max(0.1),
  fundingSpreadMonthly: rate.max(0.1),
  riskCostMonthly: rate.max(0.2),
  riskCostSource: z.enum(["manual", "ml_confirmed"]),
  opCostPerContract: money,
  costPerProposal: money.default(0),
  fixedCosts: money,
  sideEffects: z.object({
    enabled: z.boolean().default(false),
    conversionPpPerRatePp: z.number().finite().min(0).max(50).default(0),
    incrementalRiskMultiplier: z.number().finite().min(1).max(5).default(1),
  }).strict().default({}),
}).strict();

export const ScenarioResultSchema = z.object({
  contracts: z.number().finite(),
  volume: z.number().finite(),
  revenue: z.number().finite(),
  fundingCost: z.number().finite(),
  financialMargin: z.number().finite(),
  riskCost: z.number().finite(),
  opCost: z.number().finite(),
  proposalCost: z.number().finite(),
  riskAdjustedResult: z.number().finite(),
  riskAdjustedReturnOnVolume: z.number().finite().nullable(),
  breakEvenConversion: z.number().finite().nullable(),
  trace: z.array(z.object({ indicator: z.string(), formula: z.string(), value: z.number().finite() }).strict()),
}).strict();

