import React from "react";
import { cenariosCredito, variacao } from "../lib/credito.js";
import { validarCarteira } from "../lib/schema.js";
import { moeda, numero, percentual } from "../lib/format.js";
import { CarteiraForm } from "./CarteiraForm.jsx";
import { GraficoCenarios } from "./GraficoCenarios.jsx";
import { Icon } from "./Icon.jsx";

const demo = { nome: "Empréstimo pessoal", contrato: 5000, receita: 200, contratos: 3000, funding: 60, cobranca: 10, fixo: 150000, mix: { A: 40, B: 40, C: 20 } };
const initialAdjustments = { descontoPP: 0.5, choqueInad: 50 };

function saveFile(content, type, name) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url; link.download = name;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Ajuste({ label, id, value, max, step, suffix, onChange, minLabel, maxLabel }) {
  return <div className="adjustment"><div className="adjustment-label"><label htmlFor={id}>{label}</label><output htmlFor={id}>{numero(value)}{suffix}</output></div>
    <input type="range" id={id} min="0" max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} aria-valuetext={numero(value) + suffix} style={{ "--range-fill": Math.min(100, value / Math.max(max, 0.001) * 100) + "%" }} />
    <div className="range-bounds"><span>{minLabel}</span><span>{maxLabel}</span></div>
  </div>;
}
export function Dashboard() {
  const [base, setBase] = React.useState(demo);
  const [ajustes, setAjustes] = React.useState(initialAdjustments);
  const [showMix, setShowMix] = React.useState(false);
  const [active, setActive] = React.useState("simulador");
  const [notice, setNotice] = React.useState("");
  const onChange = e => {
    const { name, value } = e.target;
    const parsed = name === "nome" || value === "" ? value : Number(value);
    setBase(current => name.startsWith("mix.") ? { ...current, mix: { ...current.mix, [name.slice(4)]: parsed } } : { ...current, [name]: parsed });
  };
  const validation = validarCarteira(base);
  let cs = null;
  let scenarioError = "";
  if (validation.ok) {
    try {
      cs = cenariosCredito(base, ajustes);
      if (![cs.atual, cs.desconto, cs.inadimplencia].every(r => [r.receita, r.custo_total, r.lucro, r.margem].every(Number.isFinite))) throw new Error("Valores muito altos para simular. Reduza os valores das premissas.");
    }
    catch (error) { scenarioError = error.message; cs = null; }
  }
  const resultados = cs ? [
    { key: "base", label: "Cenário atual", short: "Atual", preco: base.receita, variavel: cs.variavel, ...cs.atual },
    { key: "desconto", label: "Desconto de " + numero(ajustes.descontoPP) + " p.p.", short: "Desconto", preco: cs.receitaDesconto, variavel: cs.variavel, ...cs.desconto },
    { key: "custo", label: "Inadimplência +" + numero(ajustes.choqueInad) + "%", short: "Inadimplência", preco: base.receita, variavel: cs.variavelAlta, ...cs.inadimplencia }
  ].map(r => ({ ...r, delta: variacao(r.lucro, cs.atual.lucro) })) : [];
  const maxDiscount = validation.ok ? Math.max(0, Math.floor(base.receita / base.contrato * 10000) / 100) : 4;
  const exportFile = format => {
    if (!cs) return;
    if (format === "json") saveFile(JSON.stringify({ base, ajustes, resultados }, null, 2), "application/json;charset=utf-8", "simulacao-de-cenarios.json");
    else {
      const header = "cenario;receita_por_contrato;contratos;custo_variavel_por_contrato;custo_total;receita;resultado;margem_pct;variacao_pct";
      const cell = v => typeof v === "number" ? String(v).replace(".", ",") : '"' + String(v ?? "").replaceAll('"', '""') + '"';
      const rows = resultados.map(r => [r.label, r.preco, base.contratos, r.variavel, r.custo_total, r.receita, r.lucro, r.receita === 0 ? null : r.margem, r.delta].map(cell).join(";"));
      saveFile("\uFEFF" + [header, ...rows].join("\r\n"), "text/csv;charset=utf-8", "comparacao-de-cenarios.csv");
    }
    setNotice("Arquivo " + format.toUpperCase() + " preparado para download.");
  };
  const navigate = id => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    if (id === "premissas") document.getElementById("nome")?.focus({ preventScroll: true });
  };
  const reset = () => { setBase({ ...demo, mix: { ...demo.mix } }); setAjustes({ ...initialAdjustments }); setNotice("Exemplo restaurado."); };
  return <div className="app-shell">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <aside className="sidebar" aria-label="Navegação principal">
      <a href="#simulador" className="brand" onClick={e => { e.preventDefault(); navigate("simulador"); }}>
        <span className="brand-mark" aria-hidden="true"><i /><i /></span><span>Simulador<br />de Decisões</span>
      </a>
      <nav>{[["simulador", "chart", "Simulador"], ["premissas", "settings", "Premissas"]].map(([id, icon, label]) => <a key={id} href={"#" + id} className={active === id ? "nav-item active" : "nav-item"} aria-current={active === id ? "location" : undefined} onClick={e => { e.preventDefault(); navigate(id); }}><Icon name={icon} />{label}</a>)}</nav>
      <div className="sidebar-footer"><span className="offline-dot" /><span>Funciona offline</span><small>Uma carteira. Um mês.<br />Decisões mais claras.</small></div>
    </aside>
    <main id="conteudo" className="main-content">
      <div id="simulador" className="dashboard">
        <header className="page-header"><div><div className="title-line"><h1>Simulador de Decisões</h1><span className="demo-badge">Dados fictícios</span></div><p>Carteira de crédito <span aria-hidden="true">·</span> {base.nome || "Seu produto"}</p></div>
          <div className="export-actions"><button className="button button-primary" disabled={!cs} onClick={() => exportFile("csv")}><Icon name="download" size={18} />Exportar CSV</button><button className="button button-secondary" disabled={!cs} onClick={() => exportFile("json")}><Icon name="download" size={18} />Exportar JSON</button></div>
        </header>
        <CarteiraForm base={base} onChange={onChange} erros={validation.erros} showMix={showMix} onToggleMix={() => setShowMix(v => !v)} />
        <section className="comparison-section" aria-labelledby="comparison-title">
          <div className="section-heading"><div><h2 id="comparison-title">Comparação de cenários</h2><p>Resultado mensal da mesma carteira, sob diferentes decisões.</p></div><span className="period-label">Período mensal</span></div>
          {!cs ? <div className="panel invalid-results" role="status"><Icon name="info" size={28} /><h3>Vamos conferir os dados?</h3><p>{scenarioError || "Corrija as premissas acima para visualizar e exportar a comparação."}</p>{scenarioError && <button className="button button-secondary" onClick={() => setAjustes(initialAdjustments)}>Restaurar ajustes</button>}</div> :
            <div className="scenario-grid">{resultados.map((r, index) => <article key={r.key} className={"panel scenario " + (index === 0 ? "scenario-current" : "")}>
              <h3>{r.label}</h3><div className={"scenario-value " + (r.lucro < 0 ? "negative" : index === 0 ? "blue" : "")}>{moeda(r.lucro)}</div><p className="result-label">{r.lucro < 0 ? "Prejuízo no mês" : "Resultado do mês"}</p>
              <dl><div><dt>Receita</dt><dd>{moeda(r.receita)}</dd></div><div><dt>Custos</dt><dd>{moeda(r.custo_total)}</dd></div><div><dt>Margem</dt><dd>{percentual(r.receita === 0 ? null : r.margem)}</dd></div></dl>
              <div className={"scenario-delta " + (index === 0 ? "reference" : r.delta < 0 ? "negative" : r.delta > 0 ? "positive" : "")}>{index === 0 ? <><span className="reference-dot" />Referência da comparação</> : r.delta == null ? "Variação indisponível: resultado atual zero" : (r.delta > 0 ? "+" : "") + r.delta + "% no resultado vs. atual"}</div>
            </article>)}</div>}
        </section>
        <div className="analysis-grid">
          {cs ? <GraficoCenarios resultados={resultados} /> : <section className="panel chart-placeholder"><Icon name="chart" size={32} /><p>O gráfico aparecerá com premissas válidas.</p></section>}
          <section className="panel adjustments-panel" aria-labelledby="adjust-title"><h2 id="adjust-title">Ajustar cenários</h2><p className="adjust-subtitle">Explore o impacto de cada mudança.</p>
            <Ajuste label="Desconto na taxa" id="descontoPP" value={ajustes.descontoPP} max={Math.max(maxDiscount, ajustes.descontoPP)} step="0.05" suffix=" p.p." minLabel="0 p.p." maxLabel={numero(Math.max(maxDiscount, ajustes.descontoPP)) + " p.p."} onChange={value => setAjustes(a => ({ ...a, descontoPP: value }))} />
            <Ajuste label="Aumento da inadimplência" id="choqueInad" value={ajustes.choqueInad} max={100} step="1" suffix="%" minLabel="0%" maxLabel="100%" onChange={value => setAjustes(a => ({ ...a, choqueInad: value }))} />
            <p className="adjust-help"><Icon name="info" size={16} />O volume de contratos permanece igual nos três cenários.</p>
            <button className="text-button reset-button" onClick={reset}><Icon name="reset" size={16} />Restaurar exemplo</button>
          </section>
        </div>
        {cs && <details className="calculation-details"><summary><span><Icon name="info" size={17} />Memória de cálculo e premissas</span><Icon name="chevron" size={16} /></summary>
          <div className="calculation-body"><p>Modelo mensal simplificado. As fórmulas são provisórias e os dados são fictícios. Não é uma previsão de demanda ou inadimplência.</p>
            <dl><div><dt>Perda esperada por contrato</dt><dd>{numero(base.mix.A)}% × R$ 20 + {numero(base.mix.B)}% × R$ 50 + {numero(base.mix.C)}% × R$ 110 = <strong>{moeda(cs.perda)}</strong></dd></div>
              <div><dt>Custo variável por contrato</dt><dd>{moeda(base.funding)} de funding + {moeda(cs.perda)} de perda + {moeda(base.cobranca)} de cobrança = <strong>{moeda(cs.variavel)}</strong></dd></div>
              <div><dt>Resultado atual</dt><dd>{moeda(base.receita)} × {numero(base.contratos)} − ({moeda(base.fixo)} + {moeda(cs.variavel)} × {numero(base.contratos)}) = <strong>{moeda(cs.atual.lucro)}</strong></dd></div>
              <div><dt>Receita com desconto / contrato</dt><dd>{moeda(base.receita)} − ({moeda(base.contrato)} × {numero(ajustes.descontoPP)} / 100) = <strong>{moeda(cs.receitaDesconto)}</strong></dd></div>
              <div><dt>Perda com inadimplência maior</dt><dd>{moeda(cs.perda)} × (1 + {numero(ajustes.choqueInad)} / 100) = <strong>{moeda(cs.perdaAlta)}</strong></dd></div></dl>
            <p>Margem = resultado ÷ receita × 100. Quando a receita é zero, a margem é exibida como “—”. A variação usa o valor absoluto do resultado atual como referência; se ele for zero, a variação é indisponível.</p>
          </div>
        </details>}
        <footer className="page-footer"><span>Simulação com dados fictícios <span aria-hidden="true">·</span> Fórmulas provisórias</span><span>Sem previsão. Você define as premissas.</span></footer>
        <p className="sr-only" role="status" aria-live="polite">{notice}</p>
      </div>
    </main>
  </div>;
}

