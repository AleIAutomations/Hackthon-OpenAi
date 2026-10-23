import unittest

import numpy as np
import pandas as pd

from risco import features


def proposta(**extra):
    base = {
        "SK_ID_CURR": [1, 2],
        "TARGET": [0, 1],
        "CODE_GENDER": ["F", "M"],
        "NAME_CONTRACT_TYPE": ["Cash loans", "Revolving loans"],
        "AMT_INCOME_TOTAL": [100_000.0, 0.0],
        "AMT_CREDIT": [200_000.0, 50_000.0],
        "AMT_ANNUITY": [10_000.0, 2_500.0],
        "AMT_GOODS_PRICE": [180_000.0, 50_000.0],
        "DAYS_BIRTH": [-12_000, -9_000],
        "DAYS_EMPLOYED": [-2_000, features.DIAS_EMPREGO_AUSENTE],
        "EXT_SOURCE_1": [0.5, np.nan],
        "EXT_SOURCE_2": [0.6, 0.2],
        "EXT_SOURCE_3": [0.7, 0.4],
    }
    base.update(extra)
    return pd.DataFrame(base)


class FeaturesTest(unittest.TestCase):
    def test_remove_genero_e_trata_anomalias(self):
        X, y, prazo, ids = features.montar_base(proposta())
        self.assertNotIn("CODE_GENDER", X.columns)
        self.assertNotIn("TARGET", X.columns)
        self.assertEqual(list(y), [0, 1])
        self.assertTrue(np.isnan(X.loc[1, "DAYS_EMPLOYED"]))
        self.assertEqual(X.loc[1, "DAYS_EMPLOYED_AUSENTE"], 1)
        self.assertTrue(np.isnan(X.loc[1, "CREDITO_RENDA"]))
        self.assertEqual(list(prazo), [20.0, 20.0])
        self.assertEqual(str(X["NAME_CONTRACT_TYPE"].dtype), "category")

    def test_agregados_bureau_e_anteriores(self):
        bureau = pd.DataFrame({
            "SK_ID_CURR": [1, 1, 2],
            "SK_ID_BUREAU": [10, 11, 12],
            "CREDIT_ACTIVE": ["Active", "Closed", "Active"],
            "CREDIT_DAY_OVERDUE": [0, 5, 0],
            "DAYS_CREDIT": [-100, -500, -50],
            "AMT_CREDIT_SUM_DEBT": [1_000.0, 0.0, 500.0],
            "AMT_CREDIT_SUM": [2_000.0, 1_000.0, 500.0],
            "AMT_CREDIT_SUM_OVERDUE": [0.0, 100.0, 0.0],
            "CNT_CREDIT_PROLONG": [0, 1, 0],
        })
        prev = pd.DataFrame({
            "SK_ID_CURR": [1, 2, 2],
            "SK_ID_PREV": [100, 101, 102],
            "NAME_CONTRACT_STATUS": ["Approved", "Refused", "Approved"],
            "AMT_APPLICATION": [1_000.0, 2_000.0, 1_000.0],
            "AMT_CREDIT": [1_000.0, 0.0, 1_000.0],
            "CNT_PAYMENT": [12.0, np.nan, 24.0],
            "DAYS_DECISION": [-30, -60, -10],
        })
        X, *_ = features.montar_base(proposta(), bureau, prev)
        self.assertEqual(list(X["BUREAU_QTD"]), [2, 1])
        self.assertEqual(list(X["BUREAU_EM_ATRASO"]), [1, 0])
        self.assertAlmostEqual(X.loc[0, "BUREAU_DIVIDA_CREDITO"], 1_000 / 3_000)
        self.assertEqual(list(X["ANT_RECUSADAS"]), [0.0, 0.5])


if __name__ == "__main__":
    unittest.main()
