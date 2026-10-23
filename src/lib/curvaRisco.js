import { z } from "zod";

const rate = z.number().finite().min(0).max(1);

const FaixaSchema = z.object({
  band: z.string().min(1),
  scoreMin: rate,
  scoreMax: rate,
  share: rate,
  observations: z.number().int().min(1),
  pd: rate,
  avgTermMonths: z.number().finite().positive(),
  riskCostMonthly: rate.max(0.2),
}).strict();

const ConfirmacaoSchema = z.object({
  by: z.string().trim().min(1),
  at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().min(1),
}).strict();

const MetricasSchema = z.object({
  auc: rate,
  gini: z.number().finite().min(-1).max(1),
  ks: rate,
  brier: rate,
}).strict();

// Curva de risco versionada gerada pelo pipeline em ml/ (F13). Taxas como decimais.
export const CurvaRiscoSchema = z.object({
  version: z.string().regex(/^v\d+$/),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending_confirmation", "confirmed"]),
  confirmation: ConfirmacaoSchema.nullable(),
  dataset: z.object({
    name: z.string(),
    url: z.string().url(),
    rows: z.number().int().positive(),
    defaultRate: rate,
    target: z.string(),
    disclaimer: z.string(),
  }).strict(),
  model: z.object({
    type: z.string(),
    features: z.number().int().positive(),
    excludedFeatures: z.array(z.string()),
    seed: z.number().int(),
    bestIteration: z.number().int().positive(),
    test: MetricasSchema,
    baselineLogistic: MetricasSchema,
  }).strict(),
  assumptions: z.object({
    lgd: rate,
    lgdSource: z.string(),
    formula: z.string(),
    provisional: z.boolean(),
  }).strict(),
  bands: z.array(FaixaSchema).min(2),
  portfolio: z.object({ pd: rate, riskCostMonthly: rate.max(0.2) }).strict(),
}).strict().superRefine((curva, ctx) => {
  const soma = curva.bands.reduce((s, f) => s + f.share, 0);
  if (Math.abs(soma - 1) > 0.01) {
    ctx.addIssue({ code: "custom", path: ["bands"], message: `participação das faixas deve somar 100% (soma ${(soma * 100).toFixed(2)}%)` });
  }
  if ((curva.status === "confirmed") !== (curva.confirmation !== null)) {
    ctx.addIssue({ code: "custom", path: ["confirmation"], message: "curva confirmada exige quem, quando e por quê; curva pendente não pode ter confirmação" });
  }
});

const round6 = (v) => Math.round((v + Number.EPSILON) * 1e6) / 1e6;

// Custo de risco mensal da carteira para um mix de faixas ({ A: 0.4, B: 0.4, ... }).
// Sem mix, devolve o custo da carteira observada na base de teste (portfolio).
export function custoRiscoDaCurva(curvaInput, mix) {
  const curva = CurvaRiscoSchema.parse(curvaInput);
  if (mix === undefined) return curva.portfolio.riskCostMonthly;
  const pesos = mix;
  const conhecidas = new Set(curva.bands.map((f) => f.band));
  for (const faixa of Object.keys(pesos)) {
    if (!conhecidas.has(faixa)) throw new Error(`faixa desconhecida na curva ${curva.version}: ${faixa}`);
  }
  let soma = 0;
  let total = 0;
  for (const f of curva.bands) {
    const peso = Number(pesos[f.band] ?? 0);
    if (!Number.isFinite(peso) || peso < 0) throw new Error(`peso inválido para a faixa ${f.band}`);
    soma += peso;
    total += peso * f.riskCostMonthly;
  }
  if (Math.abs(soma - 1) > 1e-6) throw new Error(`mix da carteira deve somar 100% (soma ${round6(soma * 100)}%)`);
  return round6(total);
}

// Só uma curva confirmada por uma pessoa pode alimentar o motor (riskCostSource = "ml_confirmed").
export function curvaPodeAlimentarMotor(curvaInput) {
  return CurvaRiscoSchema.parse(curvaInput).status === "confirmed";
}
