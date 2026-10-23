import React from "react";
import { createRoot } from "react-dom/client";
import { FormularioBase } from "./views/FormularioBase.jsx";
import { Comparador } from "./views/Comparador.jsx";
import { CurvaRisco } from "./views/CurvaRisco.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const ROTA_CURVA = "#/premissas?aba=curva-risco";

function useHash() {
  const [hash, setHash] = React.useState(window.location.hash);
  React.useEffect(() => {
    const atualizar = () => setHash(window.location.hash);
    window.addEventListener("hashchange", atualizar);
    return () => window.removeEventListener("hashchange", atualizar);
  }, []);
  return hash;
}

function App() {
  const [base, setBase] = React.useState(null);
  const hash = useHash();
  const naCurva = hash.startsWith("#/premissas");
  return (
    <div className="container">
      <header>
        <h1>#15 Simulador de Decisões</h1>
        <small>Fintech de crédito · uma carteira · um mês · 3 cenários</small>
        <nav className="abas">
          <a href="#/" aria-current={naCurva ? undefined : "page"}>Simulador</a>
          <a href={ROTA_CURVA} aria-current={naCurva ? "page" : undefined}>Curva de risco (ML)</a>
        </nav>
      </header>
      {naCurva ? <CurvaRisco /> : !base ? (
        <FormularioBase onSubmit={setBase} />
      ) : (
        <Comparador base={base} onReset={() => setBase(null)} />
      )}
    </div>
  );
}
