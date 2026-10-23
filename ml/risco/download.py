"""Baixa os CSVs da competição Home Credit Default Risk (Kaggle).

Requer um token da API do Kaggle em KAGGLE_API_TOKEN ou em ~/.kaggle/access_token
e as regras da competição aceitas na conta. Os dados não são versionados no repositório.
"""
import argparse
import io
import os
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path

COMPETICAO = "home-credit-default-risk"
ARQUIVOS = [
    "application_train.csv",
    "bureau.csv",
    "previous_application.csv",
    "HomeCredit_columns_description.csv",
]
URL = "https://www.kaggle.com/api/v1/competitions/data/download/{competicao}/{arquivo}"


def ler_token():
    token = os.environ.get("KAGGLE_API_TOKEN")
    if token:
        return token.strip()
    caminho = Path.home() / ".kaggle" / "access_token"
    if caminho.exists():
        return caminho.read_text().strip()
    raise SystemExit("Token do Kaggle não encontrado: defina KAGGLE_API_TOKEN ou ~/.kaggle/access_token.")


def baixar(arquivo, destino, token):
    alvo = destino / arquivo
    if alvo.exists():
        print(f"já existe: {alvo}")
        return
    req = urllib.request.Request(
        URL.format(competicao=COMPETICAO, arquivo=arquivo),
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=900) as resp:
            conteudo = resp.read()
    except urllib.error.HTTPError as erro:
        detalhe = erro.read().decode("utf-8", "replace")
        raise SystemExit(f"Falha ao baixar {arquivo} (HTTP {erro.code}): {detalhe}") from erro
    if conteudo[:2] == b"PK":
        with zipfile.ZipFile(io.BytesIO(conteudo)) as z:
            z.extractall(destino)
    else:
        alvo.write_bytes(conteudo)
    print(f"baixado: {alvo}")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--destino", default="data/raw")
    args = parser.parse_args(argv)
    destino = Path(args.destino)
    destino.mkdir(parents=True, exist_ok=True)
    token = ler_token()
    for arquivo in ARQUIVOS:
        baixar(arquivo, destino, token)


if __name__ == "__main__":
    sys.exit(main())
