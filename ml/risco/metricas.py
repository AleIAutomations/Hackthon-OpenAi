"""Métricas de discriminação e calibração para modelos de PD."""
import numpy as np
from sklearn.metrics import brier_score_loss, roc_auc_score, roc_curve


def ks(alvo, scores):
    fpr, tpr, _ = roc_curve(alvo, scores)
    return float(np.max(tpr - fpr))


def calibracao(alvo, scores, n=10):
    alvo = np.asarray(alvo, dtype=float)
    scores = np.asarray(scores, dtype=float)
    ordem = np.argsort(scores)
    tabela = []
    for parte in np.array_split(ordem, n):
        tabela.append({
            "pdPrevista": round(float(scores[parte].mean()), 6),
            "pdObservada": round(float(alvo[parte].mean()), 6),
            "observacoes": int(len(parte)),
        })
    return tabela


def avaliar(alvo, scores):
    auc = roc_auc_score(alvo, scores)
    return {
        "auc": round(float(auc), 4),
        "gini": round(float(2 * auc - 1), 4),
        "ks": round(ks(alvo, scores), 4),
        "brier": round(float(brier_score_loss(alvo, scores)), 6),
    }
