import React from "react";
import { CurvaRiscoSchema, confirmarCurva, custoRiscoDaCurva, curvaPodeAlimentarMotor } from "../lib/curvaRisco.js";
import { curvasDoWorkspace, lerConfirmacoes, removerConfirmacao, salvarConfirmacao } from "../lib/workspaceCurvas.js";

const arquivos = import.meta.glob("../data/curvas-risco/*.json", { eager: true, import: "default" });
const CURVAS = Object.values(arquivos).map((c) => CurvaRiscoSchema.parse(c));

const pct = (v, casas = 2) => `${(v * 100).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
const num = (v, casas = 2) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
const hoje = () => new Date().toISOString().slice(0, 10);

export function CurvaRisco() {
  const [confirmacoes, setConfirmacoes] = React.useState(() => lerConfirmacoes(window.localStorage));
  const curvas = React.useMemo(() => curvasDoWorkspace(CURVAS, confirmacoes), [confirmacoes]);
  const [versao, setVersao] = React.useState(curvas[0]?.version);
  const curva = curvas.find((c) => c.version === versao) ?? curvas[0];

  if (!curva) return <p className="card">Nenhuma curva de risco publicada em <code>src/data/curvas-risco/</code>.</p>;

  const confirmar = (dados) => {
    const conf = { ...dados, at: hoje() };
    confirmarCurva(curva, conf);
    salvarConfirmacao(window.localStorage, curva.version, conf);
    setConfirmacoes(lerConfirmacoes(window.localStorage));
  };
  const revogar = () => {
    removerConfirmacao(window.localStorage, curva.version);
    setConfirmacoes(lerConfirmacoes(window.localStorage));
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="linha">
          <h2>Curva de risco {curva.version}</h2>
          {curvas.length > 1 && (
            <select aria-label="Versão da curva" value={curva.version} onChange={(e) => setVersao(e.target.value)} style={{ width: "auto" }}>
              {curvas.map((c) => <option key={c.version} value={c.version}>{c.version}</option>)}
            </select>
          )}
        </div>
        <p className="selos">
          <span className={`selo ${curva.status === "confirmed" ? "ok" : "alerta"}`}>
            {curva.status === "confirmed" ? "Confirmada" : "Pendente de confirmação"}
          </span>
          <span className="selo">Origem: Modelo ML ({curva.model.type})</span>
          <span className="selo">Dados de terceiros ({curva.dataset.name})</span>
          {curva.assumptions.provisional && <span className="selo alerta">Premissa provisória: LGD {pct(curva.assumptions.lgd, 0)}</span>}
        </p>
        <small>Gerada em {curva.createdAt} · {curva.dataset.disclaimer}</small>
      </div>

      <div className="card">
        <h3 className="mb-2">Faixas de risco</h3>
        <table>
          <thead><tr><th>Faixa</th><th>Participação</th><th>PD</th><th>Prazo médio</th><th>Custo de risco a.m.</th></tr></thead>
          <tbody>
            {curva.bands.map((f) => (
              <tr key={f.band}>
                <td>{f.band}</td><td>{pct(f.share, 1)}</td><td>{pct(f.pd)}</td>
                <td>{num(f.avgTermMonths, 1)} meses</td><td>{pct(f.riskCostMonthly, 3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td>Carteira</td><td>100%</td><td>{pct(curva.portfolio.pd)}</td><td></td><td>{pct(curva.portfolio.riskCostMonthly, 3)}</td></tr></tfoot>
        </table>
        <small>Fórmula provisória: {curva.assumptions.formula}. {curva.assumptions.lgdSource}</small>
      </div>

      <div className="card">
        <h3 className="mb-2">Qualidade do modelo (base de teste)</h3>
        <table>
          <thead><tr><th>Modelo</th><th>AUC</th><th>Gini</th><th>KS</th><th>Brier</th></tr></thead>
          <tbody>
            {[[curva.model.type, curva.model.test], ["Regressão logística (referência)", curva.model.baselineLogistic]].map(([nome, m]) => (
              <tr key={nome}><td>{nome}</td><td>{num(m.auc, 3)}</td><td>{num(m.gini, 3)}</td><td>{num(m.ks, 3)}</td><td>{num(m.brier, 4)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustoParaMotor curva={curva} />

      {curva.status === "confirmed"
        ? <Confirmada curva={curva} onRevogar={revogar} />
        : <FormConfirmacao curva={curva} onConfirmar={confirmar} />}
    </div>
  );
}

function CustoParaMotor({ curva }) {
  const faixas = curva.bands.map((f) => f.band);
  const vazio = () => Object.fromEntries(faixas.map((b) => [b, ""]));
  const [mix, setMix] = React.useState(vazio);
  React.useEffect(() => setMix(vazio()), [curva.version]);
  const usaCarteira = faixas.every((b) => mix[b] === "");

  let custo = null, erro = null;
  try {
    if (usaCarteira) {
      custo = custoRiscoDaCurva(curva);
    } else {
      const pesos = Object.fromEntries(faixas.map((b) => {
        const v = mix[b] === "" ? 0 : Number(String(mix[b]).replace(",", "."));
        if (Number.isNaN(v)) throw new Error(`participação inválida na faixa ${b}`);
        return [b, v / 100];
      }));
      custo = custoRiscoDaCurva(curva, pesos);
    }
  } catch (e) {
    erro = e.message;
  }
  const liberada = curvaPodeAlimentarMotor(curva);

  return (
    <div className="card">
      <h3 className="mb-2">Custo de risco para o motor</h3>
      <p className="mb-2"><small>Informe o mix da sua carteira por faixa (soma 100%). Em branco, vale a carteira observada na base de teste.</small></p>
      <div className="grid grid-5">
        {faixas.map((b) => (
          <div key={b}>
            <label htmlFor={`mix-${b}`}>Faixa {b} (%)</label>
            <input id={`mix-${b}`} inputMode="decimal" placeholder={num(curva.bands.find((f) => f.band === b).share * 100, 1)} value={mix[b]} onChange={(e) => setMix({ ...mix, [b]: e.target.value })} />
          </div>
        ))}
      </div>
      {erro
        ? <p className="erro mt-3">{erro}</p>
        : <p className="mt-3"><metric>{pct(custo, 3)} a.m.</metric>{" "}
            {liberada
              ? <span className="selo ok">riskCostSource = ml_confirmed</span>
              : <span className="selo alerta">Bloqueado: confirme a curva para usar no motor</span>}
          </p>}
    </div>
  );
}

function FormConfirmacao({ curva, onConfirmar }) {
  const [by, setBy] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [ciente, setCiente] = React.useState(false);
  const [erro, setErro] = React.useState(null);

  const enviar = (e) => {
    e.preventDefault();
    if (!ciente) return setErro("confirme que revisou as premissas provisórias");
    try {
      onConfirmar({ by, reason });
      setErro(null);
    } catch (err) {
      setErro(err.issues?.[0]?.message ?? err.message);
    }
  };

  return (
    <form className="card" onSubmit={enviar}>
      <h3 className="mb-2">Confirmar curva {curva.version}</h3>
      <p className="mb-2"><small>Ao confirmar, a curva pode alimentar o motor como <code>ml_confirmed</code> neste workspace. O arquivo versionado não muda.</small></p>
      <div className="grid grid-2">
        <div><label htmlFor="conf-by">Responsável</label><input id="conf-by" value={by} onChange={(e) => setBy(e.target.value)} /></div>
        <div><label htmlFor="conf-reason">Motivo</label><input id="conf-reason" value={reason} onChange={(e) => setReason(e.target.value)} /></div>
      </div>
      <label className="check mt-3">
        <input type="checkbox" checked={ciente} onChange={(e) => setCiente(e.target.checked)} />
        Revisei as premissas provisórias (LGD {pct(curva.assumptions.lgd, 0)}, definição de inadimplência e dados de terceiros).
      </label>
      {erro && <p className="erro">{erro}</p>}
      <button type="submit" className="primary mt-3">Confirmar curva</button>
    </form>
  );
}

function Confirmada({ curva, onRevogar }) {
  const { by, at, reason } = curva.confirmation;
  return (
    <div className="card">
      <h3 className="mb-2">Confirmação</h3>
      <p>Confirmada por <strong>{by}</strong> em {at}. Motivo: {reason}</p>
      <button type="button" className="secondary mt-3" onClick={onRevogar}>Revogar confirmação</button>
    </div>
  );
}
