#!/usr/bin/env python3
"""Achado 8: as perguntas pedaço a pedaço, as origens seladas relidas no motor, e o que mudou.

    python3 design/especime-v3/medicoes/b2-2026-09-23/medir-perguntas.py

Escrito pelo construtor Claude Opus 5.5 na segunda passagem de correção da peça 1
do B2 (23.09.2026). Escreve `perguntas.json` ao lado. Três partes:

  1. A K16 tal como o portão a corre: `node tests/cartao/cartao.mjs --json`, e as
     contagens e os erros que ele devolve. É a medida do portão, não uma segunda.
  2. Cada origem com selo, relida no motor por este guião, com código próprio e
     sem importar a célula: o sha256 do ficheiro do motor, o registo do pedido ao
     lado dele (o endereço, a hora, o cliente e o sha256), e o campo lido a conter
     o excerto declarado. Dois conhecidos-positivos correm primeiro, sobre a
     primeira origem: um excerto estragado e um sha256 estragado têm de ser
     apanhados pela mesma conferência, ou o guião sai vermelho.
  3. As perguntas que mudaram de texto nesta passagem, lidas das páginas
     construídas e não da declaração: a cópia do depois da primeira passagem de
     correção, como ela está no commit ed44e493, contra o `dist/` desta
     construção, nas duas edições.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
MOTOR = Path(os.environ.get(
    "B2_MOTOR", Path.home() / "Instruments/ResearchHub/.worktrees/b2-peca1-2026-09-23"))
COPIA_ANTERIOR = "ed44e493"
FALHAS = []


def sha(b):
    return hashlib.sha256(b).hexdigest()


def git(*args, raiz=RAIZ):
    return subprocess.check_output(["git", "-C", str(raiz), *args])


# 1. a K16, pelo portão
r = subprocess.run(["node", "tests/cartao/cartao.mjs", "--json"], cwd=RAIZ, capture_output=True, text=True)
saida = json.loads(r.stdout)
k16_erros = [e for e in saida["erros"] if e.startswith("K16")]
contas = saida["contas"]
k16 = {
    "comando": "node tests/cartao/cartao.mjs --json", "codigo": r.returncode,
    "erros_do_portao": len(saida["erros"]), "erros_k16": k16_erros,
    "perguntas": contas.get("perguntas_auditadas"), "pedacos": contas.get("pedacos_auditados"),
    "apoios": contas.get("apoios_das_perguntas"), "origens_seladas": contas.get("origens_seladas"),
}
if r.returncode != 0 or k16_erros:
    FALHAS.append(f"o check:cartao saiu com {r.returncode} e {len(k16_erros)} erro(s) da K16")

# 2. os selos, relidos no motor
origens = json.loads(subprocess.check_output(
    ["node", "-e", "import('./src/data/figuras.mjs').then(m => console.log(JSON.stringify(m.ORIGENS_DAS_DEFINICOES)))"],
    cwd=RAIZ, text=True))
seladas = {k: o for k, o in origens.items() if o.get("selo")}


def campo(dados, caminho):
    v = dados
    for parte in caminho.split("."):
        v = v[parte]
    # Uma dimensão lê-se como o motor a escreve nos excertos: a etiqueta dela e a
    # da sua única categoria, com «: » entre as duas.
    if isinstance(v, dict) and "label" in v and "category" in v:
        categorias = v["category"]["label"]
        if len(categorias) != 1:
            raise ValueError(f"{caminho}: {len(categorias)} categorias, e o excerto só pode ser de uma")
        return f"{v['label']}: {next(iter(categorias.values()))}"
    return v


def confere(chave, o, excerto=None, sha256=None):
    """Devolve a lista das faltas de uma origem selada; vazia quando tudo bate."""
    s = o["selo"]
    excerto = o["excerto"] if excerto is None else excerto
    sha256 = s["sha256"] if sha256 is None else sha256
    faltas = []
    ficheiro = MOTOR / s["motor"]
    if not ficheiro.is_file():
        return [f"{chave}: o ficheiro {s['motor']} não está no motor"]
    b = ficheiro.read_bytes()
    if sha(b) != sha256:
        faltas.append(f"{chave}: o sha256 do ficheiro do motor não é o do selo")
    registos = [json.loads(l) for l in (ficheiro.parent / "pedidos.jsonl").read_text().splitlines() if l.strip()]
    registo = next((x for x in registos if x.get("file") == ficheiro.name), None)
    if not registo:
        faltas.append(f"{chave}: o pedido não está registado em pedidos.jsonl")
    else:
        if registo.get("sha256") != sha256:
            faltas.append(f"{chave}: o sha256 do registo não é o do selo")
        if registo.get("url") != o["url"]:
            faltas.append(f"{chave}: o endereço do registo não é o da origem")
        if registo.get("timestamp_utc") != s["hora"]:
            faltas.append(f"{chave}: a hora do registo não é a do selo")
        if "cliente" in registo:
            if registo["cliente"] != s["cliente"]:
                faltas.append(f"{chave}: o cliente do registo não é o do selo")
        else:
            leia = (ficheiro.parent / "LEIA-ME.md").read_text()
            if s["cliente"] not in leia:
                faltas.append(f"{chave}: o cliente do selo não está no registo nem no LEIA-ME da pasta")
    try:
        valor = campo(json.loads(b), s["campo"])
    except (KeyError, ValueError, TypeError) as e:
        return faltas + [f"{chave}: o campo {s['campo']} não se lê ({e})"]
    if not isinstance(valor, str) or excerto not in valor:
        faltas.append(f"{chave}: o campo {s['campo']} não contém o excerto declarado")
    return faltas


primeira = next(iter(seladas))
conhecidos = {
    "excerto_estragado_apanhado": bool(confere(primeira, seladas[primeira], excerto=seladas[primeira]["excerto"] + " plantado")),
    "sha256_estragado_apanhado": bool(confere(primeira, seladas[primeira], sha256="0" * 64)),
    "origem_limpa_aceite": not confere(primeira, seladas[primeira]),
}
if not all(conhecidos.values()):
    FALHAS.append(f"um conhecido-positivo da releitura dos selos falhou: {conhecidos}")
selos = {}
for chave, o in seladas.items():
    faltas = confere(chave, o)
    FALHAS.extend(faltas)
    selos[chave] = {"url": o["url"], **o["selo"], "excerto": o["excerto"], "confere": not faltas, "faltas": faltas}


# 3. as perguntas que mudaram, lidas das páginas construídas
class Definicoes(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha, self.textos = [], {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("br", "img", "meta", "link", "input", "hr", "wbr", "source"):
            return
        self.pilha.append(a.get("data-cartao-definicao"))
        for i in [x for x in self.pilha if x]:
            self.textos.setdefault(i, "")

    def handle_startendtag(self, tag, attrs):
        pass  # um elemento que se fecha a si próprio não tem texto nem filhos

    def handle_endtag(self, tag):
        if tag in ("br", "img", "meta", "link", "input", "hr", "wbr", "source"):
            return
        if self.pilha:
            self.pilha.pop()

    def handle_data(self, data):
        for i in {x for x in self.pilha if x}:
            self.textos[i] = self.textos.get(i, "") + data


def definicoes(html):
    p = Definicoes()
    p.feed(html)
    return {k: re.sub(r"\s+", " ", v).strip() for k, v in p.textos.items()}


versao = json.loads((RAIZ / "dist/version.json").read_text())
indice_anterior = json.loads(git("show", f"{COPIA_ANTERIOR}:design/especime-v3/medicoes/b2-2026-09-23/paginas-depois-peca1/INDICE.json"))
mudadas = {}
for lingua, copia, rota in (("pt", "temas_index.html", "temas/index.html"), ("en", "en_themes_index.html", "en/themes/index.html")):
    antes = definicoes(git("show", f"{COPIA_ANTERIOR}:design/especime-v3/medicoes/b2-2026-09-23/paginas-depois-peca1/{copia}").decode())
    agora = definicoes((RAIZ / "dist" / rota).read_text())
    if set(antes) != set(agora):
        FALHAS.append(f"{lingua}: o conjunto das perguntas mudou ({sorted(set(antes) ^ set(agora))})")
    mudadas[lingua] = {i: {"antes": antes[i], "agora": agora[i]} for i in sorted(agora) if i in antes and antes[i] != agora[i]}
    mudadas[f"{lingua}_total"] = len(agora)

auditoria = json.loads((RAIZ / "tests/cartao/perguntas-provadas.json").read_text())
declaradas_mudadas = sorted(q["id"] for q in auditoria["perguntas"] if q.get("mudanca"))

M = {
    "comando": "python3 design/especime-v3/medicoes/b2-2026-09-23/medir-perguntas.py",
    "cabeca": git("rev-parse", "HEAD").decode().strip(), "dist_construido_de": versao["commit"],
    "motor_cabeca": git("rev-parse", "HEAD", raiz=MOTOR).decode().strip(),
    "k16": k16,
    "conhecidos_positivos": conhecidos,
    "origens_seladas": len(selos), "origens_seladas_que_conferem": sum(s["confere"] for s in selos.values()),
    "selos": selos,
    "copia_anterior": {"commit": COPIA_ANTERIOR, "dist_construido_de": indice_anterior["dist_construido_de"]},
    "perguntas_com_texto_mudado": sorted(set(mudadas["pt"]) | set(mudadas["en"])),
    "perguntas_com_texto_mudado_n": len(set(mudadas["pt"]) | set(mudadas["en"])),
    "perguntas_rendidas_pt": mudadas["pt_total"], "perguntas_rendidas_en": mudadas["en_total"],
    "mudancas": {"pt": mudadas["pt"], "en": mudadas["en"]},
    "auditoria_com_mudanca_declarada": declaradas_mudadas,
    "auditoria_com_mudanca_declarada_n": len(declaradas_mudadas),
    "falhas": FALHAS, "falhas_total": len(FALHAS),
}
(AQUI / "perguntas.json").write_text(json.dumps(M, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({k: M[k] for k in ("k16", "origens_seladas", "origens_seladas_que_conferem",
                                     "perguntas_com_texto_mudado", "falhas_total")}, ensure_ascii=False))
for f in FALHAS:
    print("FALHA:", f, file=sys.stderr)
sys.exit(1 if FALHAS else 0)
