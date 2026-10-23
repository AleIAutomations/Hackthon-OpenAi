import unittest

import numpy as np

from risco import curva


class CurvaTest(unittest.TestCase):
    def setUp(self):
        rng = np.random.default_rng(0)
        self.scores = rng.uniform(0, 1, 10_000)
        self.alvo = (rng.uniform(0, 1, 10_000) < self.scores * 0.2).astype(int)
        self.prazo = np.full(10_000, 20.0)

    def test_cortes_dividem_em_quintis(self):
        cortes = curva.cortes_por_quantil(self.scores)
        self.assertEqual(len(cortes), 4)
        idx = curva.atribuir_faixas(self.scores, cortes)
        partes = np.bincount(idx) / len(idx)
        np.testing.assert_allclose(partes, 0.2, atol=0.01)

    def test_pd_cresce_por_faixa_e_custo_segue_formula(self):
        cortes = curva.cortes_por_quantil(self.scores)
        faixas = curva.construir_faixas(self.scores, self.alvo, self.prazo, cortes, lgd=0.45)
        self.assertEqual([f["band"] for f in faixas], ["A", "B", "C", "D", "E"])
        pds = [f["pd"] for f in faixas]
        self.assertEqual(pds, sorted(pds))
        for f in faixas:
            self.assertAlmostEqual(f["riskCostMonthly"], round(f["pd"] * 0.45 / 20.0, 6), places=6)

    def test_resumo_carteira_ponderado(self):
        faixas = [
            {"share": 0.5, "pd": 0.02, "riskCostMonthly": 0.001},
            {"share": 0.5, "pd": 0.10, "riskCostMonthly": 0.003},
        ]
        self.assertEqual(curva.resumo_carteira(faixas), {"pd": 0.06, "riskCostMonthly": 0.002})

    def test_lgd_invalida(self):
        with self.assertRaises(ValueError):
            curva.construir_faixas(self.scores, self.alvo, self.prazo, [0.5], lgd=0)


if __name__ == "__main__":
    unittest.main()
