#!/usr/bin/env python3
"""Achado 6: o crescimento da despesa líquida de 2024 provado na nota 9, e o gráfico recusado.

    python3 design/especime-v3/medicoes/b2-2026-09-23/correcao-2/conferir-fonte-cfp.py

Começado pelo construtor do Codex na segunda passagem de correção da peça 1 do
B2 e acabado pelo construtor Claude Opus 5.5 (23.09.2026). Lê a worktree do motor
(`B2_MOTOR`, por omissão a do bloco) e a do sítio, e escreve `fonte-cfp.json` ao
lado, com caminhos relativos a cada raiz.

O que prova, por esta ordem, e cada passo sai vermelho em vez de seguir:
  1. o PDF alojado é o que o motor registou (o sha256 do FETCH.json);
  2. a extração de texto alojada é, byte a byte, a que o `pdftotext -layout`
     refaz hoje a partir desse PDF, e por isso as linhas citadas são do PDF;
  3. a nota 9 da p. 9 escreve a frase que liga o valor à medida, ao ano e ao
     CFP, e distingue-o do valor subjacente à trajetória acordada;
  4. o leitor do estudo 13 lê essa frase e mais nada (o controlo);
  5. duas plantas mordem com a mesma razão: a nota tirada com o gráfico
     intacto, e a leitura antiga repetida tal como era, pelo índice do gráfico;
  6. os bytes alojados ficam iguais e o controlo repete-se verde;
  7. no motor só a linha de 2024 mudou, e nenhum valor; o localizador público é
     «p. 9, nota 9»; e a linha do sítio é a que o motor exportou.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[4]
MOTOR = Path(os.environ.get(
    "B2_MOTOR", Path.home() / "Instruments/ResearchHub/.worktrees/b2-peca1-2026-09-23"))
BASE = "5269763acf380792e3e7ae660dcf5b947fe4d049"  # a cabeça do motor antes desta passagem
FONTE = Path("content/13 Dominios/source")
PDF = FONTE / "cfp/parecer-2026-02-rap26.pdf"
TEXTO = FONTE / "text/parecer-2026-02-rap26.txt"
LINHA = "crescimento-da-despesa-liquida-2024"
FRASE = ("Para 2024, o CFP apura um crescimento da despesa líquida de 11,9%, "
         "valor que compara com 11,8% subjacente à trajetória acordada.")
MORDIDA = "um índice em rótulos de gráfico não é prova"


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def git(*args, raiz=MOTOR):
    return subprocess.check_output(["git", "-C", str(raiz), *args], text=True).strip()


env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
LEITOR = ("from pathlib import Path; import json,sys; "
          "from publisher.dominios_readers import cfp_crescimento_2024; "
          "print(json.dumps(cfp_crescimento_2024(Path(sys.argv[1])),ensure_ascii=False))")
LEITURA_ANTIGA = (
    "from pathlib import Path; import sys; "
    "from publisher.dominios_readers import pdf_sentence; "
    "g = Path(sys.argv[1]).read_text(encoding='utf-8').split('\\f')[9].splitlines(); "
    "pdf_sentence(Path(sys.argv[1]), 'e4-despesa-liquida', 'crescimento da despesa liquida em 2024', "
    "page=10, first=1, last=27, "
    "opens_with='Gráfico 2 – Crescimento e desvio da despesa líquida em 2025', "
    "closes_with='Desvio CFP POEN-MP (Recomendado)', value=g[10].strip())")


def corre(nome, codigo_py, caminho):
    """Corre um leitor do motor num processo próprio e guarda a saída e o código."""
    cod = AQUI / f"fonte-cfp-{nome}.codigo"
    cod.unlink(missing_ok=True)
    r = subprocess.run([sys.executable, "-c", codigo_py, str(caminho)], cwd=MOTOR,
                       env=env, text=True, capture_output=True)
    (AQUI / f"fonte-cfp-{nome}.log").write_text(r.stdout + r.stderr)
    cod.write_text(f"{r.returncode}\n")
    return int(cod.read_text()), r.stdout, r.stderr


# 1. o PDF é o registado
registo = json.loads((MOTOR / FONTE / "FETCH.json").read_text())["files"]["cfp/parecer-2026-02-rap26.pdf"]
assert sha(MOTOR / PDF) == registo["sha256"], "o PDF alojado não é o registado"
original = (MOTOR / TEXTO).read_bytes()

# 2. a extração refeita é a alojada
with tempfile.TemporaryDirectory() as pasta:
    refeita = Path(pasta) / "refeita.txt"
    subprocess.run(["pdftotext", "-layout", str(MOTOR / PDF), str(refeita)], check=True)
    extracao_identica = refeita.read_bytes() == original
assert extracao_identica, "a extração refeita difere da alojada"

# 3. a nota 9 da p. 9
paginas = original.decode("utf-8").split("\f")
nota = paginas[8].splitlines()
assert nota[44].startswith("9 A taxa de crescimento para 2024 não constitui uma recomendação"), nota[44]
janela = re.sub(r"\s+", " ", " ".join(nota[47:50])).strip()
assert FRASE in janela, janela
rodape = paginas[8].rstrip().splitlines()[-1]
assert rodape.split()[-1] == "9", rodape  # o número impresso da página

# 4. o controlo
controlo, saida, _ = corre("controlo", LEITOR, MOTOR / TEXTO)
assert controlo == 0
lida, sobre = json.loads(saida)
assert lida["value"] == "11,9" and lida["excerpt"] == FRASE, lida

# 5. as duas plantas
with tempfile.TemporaryDirectory() as pasta:
    estragadas = [p for p in paginas]
    grafico = estragadas[9]
    linhas_da_nota = estragadas[8].splitlines()
    linhas_da_nota[47:50] = ["2024 CFP", "11,9 11,8", "crescimento da despesa líquida"]
    estragadas[8] = "\n".join(linhas_da_nota)
    assert estragadas[9] == grafico
    estrago = Path(pasta) / "nota-tirada-grafico-intacto.txt"
    estrago.write_text("\f".join(estragadas), encoding="utf-8")
    planta_nota, _, erro_nota = corre("planta-grafico", LEITOR, estrago)
planta_antiga, _, erro_antiga = corre("planta-leitura-antiga", LEITURA_ANTIGA, MOTOR / TEXTO)
assert planta_nota == 1 and MORDIDA in erro_nota, erro_nota[-400:]
assert planta_antiga == 1 and MORDIDA in erro_antiga, erro_antiga[-400:]

# 6. a reposição
assert (MOTOR / TEXTO).read_bytes() == original
reposto, saida_reposta, _ = corre("reposto", LEITOR, MOTOR / TEXTO)
assert reposto == 0 and json.loads(saida_reposta) == [lida, sobre]

# 7. o motor e o sítio
antes = {r["id"]: r for r in json.loads(git("show", f"{BASE}:content/13 Dominios/ledger.json"))["claims"]}
agora = {r["id"]: r for r in json.loads((MOTOR / "content/13 Dominios/ledger.json").read_text())["claims"]}
assert antes.keys() == agora.keys()
alteradas = [k for k in antes if antes[k] != agora[k]]
valores = [k for k in antes if antes[k]["value"] != agora[k]["value"]]
assert alteradas == [LINHA] and not valores, (alteradas, valores)
manifesto = next(r for r in json.loads((MOTOR / "publisher/manifest.dominios.json").read_text())["rows"]
                 if r["site_id"] == LINHA)
assert manifesto["document"]["locator"] == "p. 9, nota 9" and manifesto["document"]["page"] == 9, manifesto["document"]
yml = (SITIO / "ledger/claims" / f"{LINHA}.yml").read_text(encoding="utf-8")
campo = lambda nome: json.loads(re.search(rf'^\s*{nome}: (".*")$', yml, re.M).group(1))
linha_do_sitio = {"value": campo("value"), "locator": campo("locator"), "excerpt": campo("excerpt"),
                  "source_url": campo("source_url"), "reference_date": campo("reference_date")}
assert linha_do_sitio["value"] == "11,9" and linha_do_sitio["locator"] == "p. 9, nota 9"
assert linha_do_sitio["excerpt"] == FRASE and linha_do_sitio["source_url"].endswith("#page=9")
commits = git("log", "--reverse", "--format=%h %s", f"{BASE}..HEAD").splitlines()

relatorio = {
    "achado": 6,
    "resultado": "valor conservado, provado por uma frase do documento alojado do CFP",
    "motor": {"base": BASE, "cabeca": git("rev-parse", "HEAD"), "commits": commits},
    "valor": lida["value"], "periodo": sobre["period"],
    "fonte": {
        "url": registo["url"], "lido_em": registo["fetched_at"], "pdf_sha256": registo["sha256"],
        "pdf": PDF.as_posix(), "texto": TEXTO.as_posix(), "texto_sha256": hashlib.sha256(original).hexdigest(),
        "extracao_refeita_identica": extracao_identica, "extrator": "pdftotext -layout",
        "pagina_impressa": 9, "nota": 9, "linha_inicial": 48, "linha_final": 50,
        "excerto": lida["excerpt"], "localizador_publico": manifesto["document"]["locator"],
    },
    "controlo_codigo": controlo,
    "plantas": [
        {"nome": "a nota 9 tirada, o gráfico intacto", "comando": "cfp_crescimento_2024 sobre uma cópia estragada",
         "codigo": planta_nota, "mordida": MORDIDA, "passou": True},
        {"nome": "a leitura antiga pelo índice do gráfico, sobre o ficheiro alojado",
         "comando": "pdf_sentence(page=10, first=1, last=27, value=linha 10 da corrida de rótulos)",
         "codigo": planta_antiga, "mordida": MORDIDA, "passou": True},
    ],
    "reposto_codigo": reposto,
    "bytes_alojados": {"antes": hashlib.sha256(original).hexdigest(), "reposto": sha(MOTOR / TEXTO)},
    "linhas_do_motor": {"total": len(agora), "alteradas": alteradas, "valores_alterados": len(valores)},
    "linha_do_sitio": linha_do_sitio,
}
(AQUI / "fonte-cfp.json").write_text(json.dumps(relatorio, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"resultado": relatorio["resultado"], "controlo": controlo,
                  "plantas": [planta_nota, planta_antiga], "reposto": reposto,
                  "alteradas": alteradas}, ensure_ascii=False))
