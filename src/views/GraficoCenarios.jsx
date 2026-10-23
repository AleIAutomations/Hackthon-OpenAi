import React from "react";
import { moeda } from "../lib/format.js";
import { Icon } from "./Icon.jsx";

const series = [{ key: "receita", label: "Receita", color: "#2563eb" }, { key: "custo_total", label: "Custos", color: "#8290a5" }, { key: "lucro", label: "Resultado", color: "#9fc3fc" }];
const abreviado = value => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(Math.abs(value) >= 1000 ? value / 1000 : value) + (Math.abs(value) >= 1000 ? " mil" : "");
export function GraficoCenarios({ resultados }) {
  const vals = resultados.flatMap(r => series.map(s => r[s.key]));
  const max = Math.max(1, ...vals);
  const upper = Math.ceil(max / (10 ** Math.floor(Math.log10(max)))) * (10 ** Math.floor(Math.log10(max)));
  const lower = Math.min(0, ...vals);
  const range = upper - lower;
  const y = value => 228 - ((value - lower) / range) * 198;
  const zero = y(0);
  const [tableOpen, setTableOpen] = React.useState(false);
  return <section className="panel chart-panel" aria-labelledby="chart-title">
    <div className="panel-heading"><h2 id="chart-title">Receita, custos e resultado</h2>
      <button type="button" className="text-button table-button" onClick={() => setTableOpen(v => !v)} aria-expanded={tableOpen} aria-controls="result-table"><Icon name="table" size={16} /><span>{tableOpen ? "Ocultar tabela" : "Ver tabela"}</span></button>
    </div>
    <div className="chart-scroll" tabIndex={0} aria-label="Gráfico comparativo; role horizontalmente em telas pequenas">
      <svg className="scenario-chart" viewBox="0 0 750 280" role="img" aria-labelledby="graph-title graph-description">
        <title id="graph-title">Comparação mensal dos três cenários</title>
        <desc id="graph-description">{resultados.map(r => r.label + ": receita " + moeda(r.receita) + ", custos " + moeda(r.custo_total) + ", resultado " + moeda(r.lucro)).join(". ")}</desc>
        {Array.from({ length: 5 }, (_, i) => {
          const value = lower + range * i / 4;
          return <g key={i} aria-hidden="true"><line x1="60" x2="735" y1={y(value)} y2={y(value)} stroke="#e8edf4" /><text x="48" y={y(value) + 4} textAnchor="end" className="axis-text">{Math.abs(value) >= 1000 ? new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value / 1000) + " mil" : Math.round(value)}</text></g>;
        })}
        {lower < 0 && <line x1="60" x2="735" y1={zero} y2={zero} stroke="#66758d" />}
        {resultados.map((r, group) => <g key={r.key}>
          {series.map((s, i) => {
            const x = 90 + group * 222 + i * 48;
            const value = r[s.key];
            const barY = Math.min(y(value), zero);
            const height = Math.abs(y(value) - zero);
            return <g className="chart-bar" key={s.key} tabIndex={0} role="img" aria-label={r.label + ", " + s.label + ": " + moeda(value)}>
              <title>{r.label} · {s.label}: {moeda(value)}</title>
              <rect x={x} y={barY} width="38" height={Math.max(value === 0 ? 0 : 1, height)} rx="3" fill={value < 0 ? "#c43b47" : s.color} />
              <text x={x + 19} y={value < 0 ? barY + height + 16 : barY - 9} textAnchor="middle" className="bar-label" aria-hidden="true">{abreviado(value)}</text>
            </g>;
          })}
          <text x={155 + group * 222} y="266" textAnchor="middle" className="category-text" aria-hidden="true">{["Atual", "Desconto", "Inadimplência"][group]}</text>
        </g>)}
      </svg>
    </div>
    <p className="chart-scroll-hint"><Icon name="chevron" size={14} />Deslize o gráfico para ver os três cenários.</p>
    <div className="chart-legend">{series.map(s => <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}</div>
    {tableOpen && <div className="table-scroll" id="result-table"><table><caption>Comparação mensal · valores em reais</caption><thead><tr><th scope="col">Indicador</th>{resultados.map(r => <th scope="col" key={r.key}>{r.label}</th>)}</tr></thead>
      <tbody>{series.map(s => <tr key={s.key}><th scope="row">{s.label}</th>{resultados.map(r => <td key={r.key}>{moeda(r[s.key])}</td>)}</tr>)}</tbody></table></div>}
  </section>;
}

