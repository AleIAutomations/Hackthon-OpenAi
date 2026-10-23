import { z } from "zod";
import { ConfirmacaoSchema, confirmarCurva } from "./curvaRisco.js";

// Confirmações de curvas de ML ficam no workspace (localStorage); o JSON versionado não muda.
export const CHAVE_CONFIRMACOES = "simulador.curvasRisco.confirmacoes";

const ConfirmacoesSchema = z.record(z.string().regex(/^v\d+$/), ConfirmacaoSchema);

export function lerConfirmacoes(storage) {
  try {
    const bruto = storage.getItem(CHAVE_CONFIRMACOES);
    if (!bruto) return {};
    const r = ConfirmacoesSchema.safeParse(JSON.parse(bruto));
    return r.success ? r.data : {};
  } catch {
    return {};
  }
}

export function salvarConfirmacao(storage, versao, confirmacao) {
  const conf = ConfirmacaoSchema.parse(confirmacao);
  const atuais = lerConfirmacoes(storage);
  storage.setItem(CHAVE_CONFIRMACOES, JSON.stringify({ ...atuais, [versao]: conf }));
  return conf;
}

export function removerConfirmacao(storage, versao) {
  const { [versao]: _removida, ...resto } = lerConfirmacoes(storage);
  storage.setItem(CHAVE_CONFIRMACOES, JSON.stringify(resto));
}

// Aplica as confirmações do workspace às curvas pendentes, da mais nova para a mais antiga.
export function curvasDoWorkspace(curvas, confirmacoes) {
  const numero = (c) => Number(c.version.slice(1));
  return [...curvas]
    .sort((a, b) => numero(b) - numero(a))
    .map((c) => (c.status === "pending_confirmation" && confirmacoes[c.version]
      ? confirmarCurva(c, confirmacoes[c.version])
      : c));
}
