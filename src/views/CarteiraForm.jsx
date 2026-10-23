import React from "react";
import { PERDA_POR_FAIXA } from "../lib/credito.js";
import { numero } from "../lib/format.js";
import { Icon } from "./Icon.jsx";

const campos = [
  ["contrato", "Valor por contrato", "R$", "0.01"],
  ["contratos", "Contratos ativos", "", "1"],
  ["receita", "Receita / contrato", "R$", "0.01"],
  ["funding", "Funding / contrato", "R$", "0.01"],
  ["cobranca", "Cobrança / contrato", "R$", "0.01"],
  ["fixo", "Custos fixos / mês", "R$", "0.01"],
];
export function CarteiraForm({ base, onChange, erros, showMix, onToggleMix }) {
  return <section id="premissas" className="panel premises" aria-labelledby="premissas-title">
    <div className="panel-heading premises-heading">
      <h2 id="premissas-title">Premissas da carteira</h2>
      <label className="product-name">Produto
        <input id="nome" name="nome" value={base.nome} onChange={onChange} maxLength={80} required />
      </label>
    </div>
    <form onSubmit={e => e.preventDefault()} noValidate>
      <div className="premise-grid">
        {campos.map(([name, label, prefix, step]) => <label key={name} htmlFor={name}>
          <span>{label}</span>
          <span className="input-shell">{prefix && <span className="input-prefix">{prefix}</span>}
            <input id={name} name={name} type="number" inputMode={step === "1" ? "numeric" : "decimal"} step={step} min={["contrato", "receita", "contratos"].includes(name) ? step : "0"} max="1000000000000" value={base[name]} onChange={onChange} required aria-invalid={erros.length ? undefined : false} />
          </span>
        </label>)}
        <div className="mix-summary"><span id="mix-label">Mix de risco</span>
          <button type="button" className="mix-button" aria-labelledby="mix-label mix-value" aria-expanded={showMix} aria-controls="mix-editor" onClick={onToggleMix}>
            <span id="mix-value">A {base.mix.A === "" ? "—" : numero(base.mix.A)}% · B {base.mix.B === "" ? "—" : numero(base.mix.B)}% · C {base.mix.C === "" ? "—" : numero(base.mix.C)}%</span>
            <Icon name="chevron" size={14} />
          </button>
        </div>
      </div>
      {showMix && <fieldset id="mix-editor" className="mix-editor"><legend>Distribuição de risco da carteira</legend>
        <p>Informe a participação de cada faixa. O total precisa ser 100%.</p>
        <div className="mix-fields">{Object.entries(PERDA_POR_FAIXA).map(([faixa, perda]) => <label key={faixa} htmlFor={"mix-" + faixa}>
          <span>Faixa {faixa} <small>Perda: R$ {perda} / contrato</small></span>
          <span className="input-shell"><input id={"mix-" + faixa} name={"mix." + faixa} type="number" inputMode="decimal" min="0" max="100" step="0.1" value={base.mix[faixa]} onChange={onChange} required /><span className="input-suffix">%</span></span>
        </label>)}</div>
      </fieldset>}
      {erros.length > 0 && <div className="form-errors" role="alert"><Icon name="info" /><div><strong>Confira as premissas para continuar</strong><ul>{erros.map(erro => <li key={erro}>{erro}</li>)}</ul></div></div>}
    </form>
  </section>;
}

