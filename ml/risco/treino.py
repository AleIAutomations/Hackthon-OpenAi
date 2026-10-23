"""Treina o modelo de PD e publica a curva de risco versionada.

Uso (a partir de ml/):
    python -m risco.treino --versao v1 --data-criacao 2026-10-23
"""
import argparse
import json
import sys
from pathlib import Path

import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from . import curva, features, metricas

SEMENTE = 42
RAIZ = Path(__file__).resolve().parents[2]

LGBM_PARAMS = dict(
    objective="binary",
    learning_rate=0.03,
    num_leaves=31,
    min_child_samples=100,
    subsample=0.8,
    subsample_freq=1,
    colsample_bytree=0.6,
    reg_lambda=5.0,
    n_estimators=3000,
    random_state=SEMENTE,
    n_jobs=-1,
    verbose=-1,
)


def carregar(dados: Path, amostra=None):
    app = pd.read_csv(dados / "application_train.csv")
    if amostra:
        app = app.sample(n=min(amostra, len(app)), random_state=SEMENTE)
    bureau = prev = None
    if (dados / "bureau.csv").exists():
        bureau = pd.read_csv(dados / "bureau.csv")
    if (dados / "previous_application.csv").exists():
        prev = pd.read_csv(dados / "previous_application.csv")
    return app, bureau, prev


def dividir(X, y, prazo):
    """70% treino, 15% validação (early stopping e cortes das faixas), 15% teste (métricas e PD por faixa)."""
    X_tr, X_tmp, y_tr, y_tmp, p_tr, p_tmp = train_test_split(
        X, y, prazo, test_size=0.30, stratify=y, random_state=SEMENTE)
    X_va, X_te, y_va, y_te, p_va, p_te = train_test_split(
        X_tmp, y_tmp, p_tmp, test_size=0.50, stratify=y_tmp, random_state=SEMENTE)
    return (X_tr, y_tr, p_tr), (X_va, y_va, p_va), (X_te, y_te, p_te)


def treinar_baseline(X_tr, y_tr):
    numericas = X_tr.select_dtypes(include="number").columns.tolist()
    categoricas = X_tr.select_dtypes(include="category").columns.tolist()
    prep = ColumnTransformer([
        ("num", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), numericas),
        ("cat", make_pipeline(SimpleImputer(strategy="most_frequent"),
                              OneHotEncoder(handle_unknown="ignore", min_frequency=0.01)), categoricas),
    ])
    modelo = make_pipeline(prep, LogisticRegression(max_iter=2000, C=0.1))
    X_cat = X_tr.copy()
    for c in categoricas:
        X_cat[c] = X_cat[c].astype(object)
    modelo.fit(X_cat, y_tr)
    return modelo, categoricas


def prever_baseline(modelo, categoricas, X):
    X = X.copy()
    for c in categoricas:
        X[c] = X[c].astype(object)
    return modelo.predict_proba(X)[:, 1]


def treinar_lgbm(X_tr, y_tr, X_va, y_va):
    modelo = lgb.LGBMClassifier(**LGBM_PARAMS)
    modelo.fit(
        X_tr, y_tr,
        eval_set=[(X_va, y_va)],
        eval_metric="auc",
        callbacks=[lgb.early_stopping(100, verbose=False)],
    )
    return modelo


def importancias(modelo, colunas, n=15):
    ganho = modelo.booster_.feature_importance(importance_type="gain")
    total = ganho.sum()
    ordem = np.argsort(ganho)[::-1][:n]
    return [{"feature": colunas[i], "gainShare": round(float(ganho[i] / total), 4)} for i in ordem]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dados", default="data/raw")
    parser.add_argument("--versao", required=True)
    parser.add_argument("--data-criacao", required=True, help="AAAA-MM-DD (explícita para manter o artefato reprodutível)")
    parser.add_argument("--lgd", type=float, default=0.45)
    parser.add_argument("--amostra", type=int, default=None, help="número de propostas (para testes rápidos)")
    parser.add_argument("--saida-curva", default=None)
    parser.add_argument("--saida-relatorio", default=None)
    args = parser.parse_args(argv)

    app, bureau, prev = carregar(Path(args.dados), args.amostra)
    X, y, prazo, _ = features.montar_base(app, bureau, prev)
    (X_tr, y_tr, _), (X_va, y_va, _), (X_te, y_te, p_te) = dividir(X, y, prazo)

    base, cats = treinar_baseline(X_tr, y_tr)
    metr_base = metricas.avaliar(y_te, prever_baseline(base, cats, X_te))

    modelo = treinar_lgbm(X_tr, y_tr, X_va, y_va)
    s_va = modelo.predict_proba(X_va)[:, 1]
    s_te = modelo.predict_proba(X_te)[:, 1]
    metr = metricas.avaliar(y_te, s_te)

    cortes = curva.cortes_por_quantil(s_va)
    faixas = curva.construir_faixas(s_te, y_te, p_te, cortes, args.lgd)

    curva_json = {
        "version": args.versao,
        "createdAt": args.data_criacao,
        "status": "pending_confirmation",
        "confirmation": None,
        "dataset": {
            "name": "Home Credit Default Risk (Kaggle)",
            "url": "https://www.kaggle.com/competitions/home-credit-default-risk",
            "rows": int(len(y)),
            "defaultRate": round(float(y.mean()), 6),
            "target": "TARGET = 1: cliente com dificuldade de pagamento (atraso acima de X dias em pelo menos uma das Y primeiras parcelas)",
            "disclaimer": "Dados públicos de terceiros; não representam a carteira real da empresa.",
        },
        "model": {
            "type": "LightGBM",
            "features": int(X.shape[1]),
            "excludedFeatures": features.EXCLUIDOS,
            "seed": SEMENTE,
            "bestIteration": int(modelo.best_iteration_ or LGBM_PARAMS["n_estimators"]),
            "test": metr,
            "baselineLogistic": metr_base,
        },
        "assumptions": {
            "lgd": args.lgd,
            "lgdSource": "Provisória: 45% é a LGD da abordagem IRB básica de Basileia para exposições sem garantia; validar com o time.",
            "formula": "riskCostMonthly = PD × LGD / prazo médio (meses)",
            "provisional": True,
        },
        "bands": faixas,
        "portfolio": curva.resumo_carteira(faixas),
    }

    relatorio = {
        "version": args.versao,
        "split": {"train": int(len(y_tr)), "validation": int(len(y_va)), "test": int(len(y_te))},
        "test": metr,
        "baselineLogistic": metr_base,
        "calibration": metricas.calibracao(y_te, s_te),
        "topFeatures": importancias(modelo, list(X.columns)),
    }

    saida_curva = Path(args.saida_curva or RAIZ / "src" / "data" / "curvas-risco" / f"{args.versao}.json")
    saida_rel = Path(args.saida_relatorio or RAIZ / "ml" / "relatorios" / f"{args.versao}.json")
    for caminho, conteudo in ((saida_curva, curva_json), (saida_rel, relatorio)):
        caminho.parent.mkdir(parents=True, exist_ok=True)
        caminho.write_text(json.dumps(conteudo, ensure_ascii=False, indent=2) + "\n")
        print(f"gravado: {caminho}")
    print(json.dumps({"test": metr, "baselineLogistic": metr_base, "portfolio": curva_json["portfolio"]}, indent=2))


if __name__ == "__main__":
    sys.exit(main())
