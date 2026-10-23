# Modelo de risco (ML)

Pipeline offline que treina um modelo de **probabilidade de inadimplência (PD)** e publica uma **curva de risco versionada** (F13) para o simulador. O app nunca executa o modelo: ele só lê a curva em `src/data/curvas-risco/vN.json`, valida com `CurvaRiscoSchema` e passa o custo de risco ao motor (`riskCostMonthly`).

```
Home Credit (Kaggle) ──► features.py ──► LightGBM (+ regressão logística de referência)
                                              │
                                              ▼
                     faixas A–E por quantil do score (validação)
                     PD observada por faixa (teste)
                     riskCostMonthly = PD × LGD / prazo médio
                                              │
                                              ▼
             src/data/curvas-risco/vN.json  (status: pending_confirmation)
                                              │  pessoa confirma (quem, quando, por quê)
                                              ▼
             custoRiscoDaCurva(curva, mix) ──► simulate({ riskCostMonthly, riskCostSource: "ml_confirmed" })
```

## Dados

- **Fonte:** [Home Credit Default Risk](https://www.kaggle.com/competitions/home-credit-default-risk) (Kaggle). Arquivos usados: `application_train.csv`, `bureau.csv`, `previous_application.csv`.
- **Rótulo:** `TARGET = 1` quando o cliente teve dificuldade de pagamento (atraso acima de X dias em pelo menos uma das Y primeiras parcelas).
- Os dados **não** são versionados (regras da competição). Ficam em `ml/data/raw/`, que está no `.gitignore`. Só a curva agregada e as métricas vão para o repositório.
- São dados públicos de terceiros e **não representam a carteira real**. A curva carrega esse aviso.

## Como rodar

Requer Python 3.10+ e um token da API do Kaggle, com as regras da competição aceitas na conta.

```bash
cd ml
pip install -r requirements.txt
export KAGGLE_API_TOKEN=...          # ou ~/.kaggle/access_token
python -m risco.download             # baixa para data/raw/
python -m risco.treino --versao v1 --data-criacao 2026-10-23
python -m unittest discover -s tests # testes sem dados reais (rodam na CI)
```

`--amostra 20000` treina com uma amostra, para testes rápidos. `--lgd` muda a premissa de LGD (padrão 0,45).

O treino grava:
- `src/data/curvas-risco/<versao>.json`: curva consumida pelo app;
- `ml/relatorios/<versao>.json`: métricas, tabela de calibração e principais atributos.

## Modelo

| Etapa | Escolha |
|---|---|
| Atributos | campos da proposta + razões (crédito/renda, parcela/renda, prazo, bem/crédito) + médias de `EXT_SOURCE_*` + agregados do bureau e das propostas anteriores |
| Excluídos | `CODE_GENDER`, para não discriminar por gênero |
| Divisão | 70% treino, 15% validação (early stopping e cortes das faixas), 15% teste (métricas e PD por faixa), estratificada, semente 42 |
| Modelo | LightGBM com early stopping por AUC; regressão logística como referência |
| Métricas | AUC, Gini, KS, Brier e calibração por decil, todas no teste |
| Faixas | A (menor risco) a E, quintis da PD prevista na validação |

## Resultado da v1

Base de teste com 46.127 propostas, nunca usadas no treino nem na escolha das faixas:

| Modelo | AUC | Gini | KS | Brier |
|---|---|---|---|---|
| LightGBM (v1) | 0,776 | 0,552 | 0,416 | 0,0667 |
| Regressão logística (referência) | 0,755 | 0,510 | 0,382 | 0,0680 |

| Faixa | Participação | PD observada | Prazo médio | Custo de risco a.m. |
|---|---|---|---|---|
| A | 20,5% | 1,40% | 21,2 meses | 0,030% |
| B | 20,0% | 2,83% | 22,4 meses | 0,057% |
| C | 19,7% | 5,17% | 22,3 meses | 0,104% |
| D | 19,6% | 8,84% | 21,8 meses | 0,182% |
| E | 20,2% | 22,16% | 20,0 meses | 0,499% |
| **Carteira** | 100% | 8,07% | | **0,174%** |

A PD prevista acompanha a observada em todos os decis (`ml/relatorios/v1.json`). O treino é determinístico: rodar de novo com a mesma semente gera a mesma curva.

> O custo da carteira (0,17% a.m.) é bem menor que o 1% a.m. usado nos cenários de demonstração, porque a perda esperada (PD × LGD) é distribuída por cerca de 21 meses. Antes de confirmar a curva, o time precisa validar essas premissas.

## Premissas provisórias

Elas aparecem em `assumptions` dentro da curva e precisam ser validadas com o time (veja `docs/EXECUCAO.md`):

1. **LGD = 45%**, a LGD da abordagem IRB básica de Basileia para exposições sem garantia.
2. O `TARGET` da Home Credit é tratado como default ao longo do contrato.
3. A perda é distribuída linearmente pelo prazo médio da faixa (`AMT_CREDIT / AMT_ANNUITY`).

## Governança

- Cada curva é imutável: um novo treino gera `vN+1`.
- Toda curva nasce `pending_confirmation`. Só depois que uma pessoa a confirma, `curvaPodeAlimentarMotor()` devolve `true` e o cenário pode usar `riskCostSource = "ml_confirmed"`.
- A IA (F08/F09) pode explicar a curva, mas nunca gera nem altera os números dela.
