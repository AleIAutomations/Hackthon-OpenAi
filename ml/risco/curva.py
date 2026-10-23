"""Transforma scores de PD em uma curva de risco versionada por faixa.

custo de risco mensal da faixa = PD observada × LGD / prazo médio (meses).
Premissas simplificadoras (provisórias, a validar com o time):
- TARGET da Home Credit ("dificuldade de pagamento") é tratado como evento de default ao longo do contrato.
- A perda é distribuída linearmente pelo prazo médio do contrato da faixa.
- LGD é uma premissa única para toda a carteira.
"""
import numpy as np

FAIXAS = ["A", "B", "C", "D", "E"]


def _arred(valor, casas=6):
    return float(round(float(valor), casas))


def cortes_por_quantil(scores, n_faixas=len(FAIXAS)):
    """Limiares de PD prevista que dividem a população em faixas de mesmo tamanho."""
    quantis = np.linspace(0, 1, n_faixas + 1)[1:-1]
    return [float(v) for v in np.quantile(np.asarray(scores, dtype=float), quantis)]


def atribuir_faixas(scores, cortes):
    """Índice da faixa (0 = menor risco) para cada score."""
    return np.searchsorted(np.asarray(cortes, dtype=float), np.asarray(scores, dtype=float), side="right")


def construir_faixas(scores, alvo, prazo_meses, cortes, lgd):
    if not 0 < lgd <= 1:
        raise ValueError("LGD deve estar entre 0 e 1")
    scores = np.asarray(scores, dtype=float)
    alvo = np.asarray(alvo, dtype=float)
    prazo = np.asarray(prazo_meses, dtype=float)
    idx = atribuir_faixas(scores, cortes)
    limites = [0.0, *cortes, 1.0]
    faixas = []
    for i, nome in enumerate(FAIXAS[: len(cortes) + 1]):
        m = idx == i
        if not m.any():
            raise ValueError(f"faixa {nome} sem observações")
        pd_obs = alvo[m].mean()
        prazo_medio = float(np.nanmean(prazo[m]))
        faixas.append({
            "band": nome,
            "scoreMin": _arred(limites[i]),
            "scoreMax": _arred(limites[i + 1]),
            "share": _arred(m.mean(), 4),
            "observations": int(m.sum()),
            "pd": _arred(pd_obs),
            "avgTermMonths": _arred(prazo_medio, 2),
            "riskCostMonthly": _arred(pd_obs * lgd / prazo_medio),
        })
    return faixas


def resumo_carteira(faixas):
    peso = sum(f["share"] for f in faixas)
    pd_carteira = sum(f["share"] * f["pd"] for f in faixas) / peso
    custo = sum(f["share"] * f["riskCostMonthly"] for f in faixas) / peso
    return {"pd": _arred(pd_carteira), "riskCostMonthly": _arred(custo)}
