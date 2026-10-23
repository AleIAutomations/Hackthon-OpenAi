"""Engenharia de atributos para o modelo de PD (Home Credit)."""
import numpy as np
import pandas as pd

ALVO = "TARGET"
ID = "SK_ID_CURR"
# Atributos sensíveis fora do modelo (LGPD / não discriminação).
EXCLUIDOS = ["CODE_GENDER"]
DIAS_EMPREGO_AUSENTE = 365243


def _razao(numerador, denominador):
    denominador = denominador.replace(0, np.nan)
    return numerador / denominador


def atributos_proposta(app: pd.DataFrame) -> pd.DataFrame:
    df = app.drop(columns=[c for c in EXCLUIDOS if c in app.columns]).copy()
    if "DAYS_EMPLOYED" in df:
        df["DAYS_EMPLOYED_AUSENTE"] = (df["DAYS_EMPLOYED"] == DIAS_EMPREGO_AUSENTE).astype("int8")
        df["DAYS_EMPLOYED"] = df["DAYS_EMPLOYED"].replace(DIAS_EMPREGO_AUSENTE, np.nan)
    df["CREDITO_RENDA"] = _razao(df["AMT_CREDIT"], df["AMT_INCOME_TOTAL"])
    df["PARCELA_RENDA"] = _razao(df["AMT_ANNUITY"], df["AMT_INCOME_TOTAL"])
    df["PRAZO_MESES"] = _razao(df["AMT_CREDIT"], df["AMT_ANNUITY"])
    df["BEM_CREDITO"] = _razao(df["AMT_GOODS_PRICE"], df["AMT_CREDIT"])
    df["EMPREGO_IDADE"] = _razao(df["DAYS_EMPLOYED"], df["DAYS_BIRTH"])
    ext = [c for c in ("EXT_SOURCE_1", "EXT_SOURCE_2", "EXT_SOURCE_3") if c in df]
    if ext:
        df["EXT_SOURCE_MEDIA"] = df[ext].mean(axis=1)
        df["EXT_SOURCE_MIN"] = df[ext].min(axis=1)
        df["EXT_SOURCE_PROD"] = df[ext].prod(axis=1, min_count=len(ext))
    return df


def agregados_bureau(bureau: pd.DataFrame) -> pd.DataFrame:
    b = bureau.copy()
    b["ATIVO"] = (b["CREDIT_ACTIVE"] == "Active").astype("int8")
    b["EM_ATRASO"] = (b["CREDIT_DAY_OVERDUE"] > 0).astype("int8")
    agg = b.groupby(ID).agg(
        BUREAU_QTD=("SK_ID_BUREAU", "count"),
        BUREAU_ATIVOS=("ATIVO", "sum"),
        BUREAU_EM_ATRASO=("EM_ATRASO", "sum"),
        BUREAU_DIAS_CREDITO_MEDIA=("DAYS_CREDIT", "mean"),
        BUREAU_DIAS_CREDITO_MAX=("DAYS_CREDIT", "max"),
        BUREAU_DIVIDA_SOMA=("AMT_CREDIT_SUM_DEBT", "sum"),
        BUREAU_CREDITO_SOMA=("AMT_CREDIT_SUM", "sum"),
        BUREAU_ATRASO_VALOR_SOMA=("AMT_CREDIT_SUM_OVERDUE", "sum"),
        BUREAU_PRORROGACOES=("CNT_CREDIT_PROLONG", "sum"),
    )
    agg["BUREAU_DIVIDA_CREDITO"] = _razao(agg["BUREAU_DIVIDA_SOMA"], agg["BUREAU_CREDITO_SOMA"])
    return agg


def agregados_propostas_anteriores(prev: pd.DataFrame) -> pd.DataFrame:
    p = prev.copy()
    p["APROVADA"] = (p["NAME_CONTRACT_STATUS"] == "Approved").astype("int8")
    p["RECUSADA"] = (p["NAME_CONTRACT_STATUS"] == "Refused").astype("int8")
    p["PEDIDO_CONCEDIDO"] = _razao(p["AMT_APPLICATION"], p["AMT_CREDIT"])
    agg = p.groupby(ID).agg(
        ANT_QTD=("SK_ID_PREV", "count"),
        ANT_APROVADAS=("APROVADA", "mean"),
        ANT_RECUSADAS=("RECUSADA", "mean"),
        ANT_CREDITO_MEDIA=("AMT_CREDIT", "mean"),
        ANT_PRAZO_MEDIA=("CNT_PAYMENT", "mean"),
        ANT_DIAS_DECISAO_MAX=("DAYS_DECISION", "max"),
        ANT_PEDIDO_CONCEDIDO_MEDIA=("PEDIDO_CONCEDIDO", "mean"),
    )
    return agg


def montar_base(app, bureau=None, prev=None):
    """Retorna (X, y, prazo_meses, ids) prontos para treino."""
    df = atributos_proposta(app)
    if bureau is not None:
        df = df.merge(agregados_bureau(bureau), left_on=ID, right_index=True, how="left")
    if prev is not None:
        df = df.merge(agregados_propostas_anteriores(prev), left_on=ID, right_index=True, how="left")
    y = df.pop(ALVO).astype("int8")
    ids = df.pop(ID)
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].astype("category")
    df = df.replace([np.inf, -np.inf], np.nan)
    return df, y, df["PRAZO_MESES"], ids
