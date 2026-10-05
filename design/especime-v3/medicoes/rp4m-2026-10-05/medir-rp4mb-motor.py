#!/usr/bin/env python3
"""RP4-m-b: os dois cenários dos achados 4 e 5 da leitura a frio, corridos contra o corredor das séries do motor.

Uso (na raiz do sítio):
    RESEARCHHUB_DIR=<worktree do motor> python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir-rp4mb-motor.py <etiqueta>

Escreve `rp4mb-motor-<etiqueta>.json` nesta pasta, com a cabeça do motor e o estado da árvore dele no momento da
medição. Corre-se com a etiqueta `antes` na cabeça que a leitura leu (7461321) e com `depois` na cabeça final da
passagem; os dois ficheiros dizem o que o mesmo cenário dá em cada uma. Não escreve no motor: as séries publicadas,
as revisões, as cópias da fonte e as pastas dos pedidos vivem numa pasta temporária, e os pedidos são servidos pelo
pedidor de mentira da suíte do corredor (`publisher/dominios_series_corredor_test.py`), que devolve os corpos que o
estudo já aloja, ou uma cópia mexida deles, com o registo que o pedidor da casa escreve.

O CENÁRIO DO ACHADO 4, uma segunda revisão do mesmo ponto: a primeira corrida (05.10.2026) acha um ponto passado
mudado pela fonte, num corpo do INE (a pensão média de 2020) e num do Eurostat (as rendas, trinta meses antes do
fim), e o estado publicado passa a ser o que a escrita deixaria: as séries com o valor novo e a revisão, e a revisão
no ficheiro das revisões. A segunda corrida (06.10.2026) recebe o mesmo ponto mudado outra vez. Mede-se o que a
segunda corrida faz: a exceção que levanta, ou as revisões que acha.

O CENÁRIO DO ACHADO 5, um pedido que não se lê: a metainformação do INE da pensão média responde 404 numa corrida de
ensaio, e mede-se a linha do veredicto e o código que o `main()` do corredor dá, e as recusas do relatório. E a mesma
falha com `--write` numa fonte de escrita: mede-se se a corrida escreveu.

Nenhum caminho da máquina no registo.
"""
import contextlib
import io
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ETIQUETA = sys.argv[1] if len(sys.argv) > 1 else "medida"
MOTOR = Path(os.environ["RESEARCHHUB_DIR"]).resolve()
sys.path.insert(0, str(MOTOR))
os.chdir(MOTOR)

from publisher import dominios_series as DS                                # noqa: E402
from publisher import dominios_series_corredor as COR                     # noqa: E402
from publisher import dominios_series_corredor_test as T                  # noqa: E402

D1, D2 = "2026-10-05", "2026-10-06"
SID_I, PER_I = "serie-pensao-media-anual", "2020"
SID_E = "serie-ihpc-rendas-variacao-homologa"


def git(*args):
    r = subprocess.run(["git", "-C", str(MOTOR), *args], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None


publicadas = {s["id"]: s for s in json.loads(DS.SERIES_PERIODO.read_text(encoding="utf-8"))["series"]}
corpos = T.corpos_alojados()
alvo_i = next(p for p in publicadas[SID_I]["pontos"] if p["periodo"] == PER_I)
ind = json.loads(alvo_i["excerto"])["ind_string"]
alvo_e = publicadas[SID_E]["pontos"][-30]
frag = alvo_e["excerto"].split(" · ")[1]
n_e, valor_e = frag.split(":", 1)


def mexer(passo: int):
    """O ponto da pensão com o último algarismo mais `passo`, e o mês das rendas com um algarismo a mais."""
    def mexe(url: str, corpo: bytes) -> bytes:
        texto = corpo.decode("utf-8")
        velho = f'"ind_string" : "{ind}"'
        if "pindica.jsp" in url and "varcd=0014532" in url and velho in texto and f'"{PER_I}"' in texto:
            novo = f'"ind_string" : "{ind[:-1]}{(int(ind[-1]) + passo) % 10}"'
            j = texto.index(velho, texto.index(f'"{PER_I}"'))
            return (texto[:j] + novo + texto[j + len(velho):]).encode("utf-8")
        if "coicop18=CP041" in url and "geo=PT" in url:
            novo = f"{n_e}:{valor_e}{passo}" if "." in valor_e else f"{n_e}:{valor_e}.{passo}"
            return corpo.replace(frag.encode(), novo.encode(), 1)
        return corpo
    return mexe


def correr_main(argv, **kw):
    """O `main()` do corredor, com a corrida servida pelo pedidor de mentira: a linha do veredicto e o código."""
    original = COR.correr
    COR.correr = lambda pasta, write=False, tudo=False: original(pasta, write=write, tudo=tudo, **kw)
    saida = io.StringIO()
    try:
        with contextlib.redirect_stdout(saida):
            codigo = COR.main(argv)
    finally:
        COR.correr = original
    linhas = saida.getvalue().splitlines()
    return codigo, next((l for l in reversed(linhas) if l.startswith("CORREDOR_DAS_SERIES:")), None), \
        [l.strip() for l in linhas if l.strip().startswith("RECUSA")]


resultado = {"o_que": "RP4-m-b: os cenários dos achados 4 e 5 contra o corredor das séries (medir-rp4mb-motor.py)",
             "etiqueta": ETIQUETA, "motor_cabeca": git("rev-parse", "HEAD"),
             "motor_estado_dos_seguidos": git("status", "--porcelain", "--untracked-files=no")}

with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    # O ESTADO PUBLICADO DEPOIS DA PRIMEIRA REVISÃO, como a escrita do corredor o deixaria.
    rel1 = COR.correr(tmp / "c1", tudo=True, pedir=T.pedidor_de_mentira(corpos, mexer(1)), data=D1,
                      revisoes=tmp / "rev-vazio.json")
    raiz1 = COR.copia_da_fonte(tmp / "c1", tmp / "copia-1", D1)
    novas1 = {s["id"]: s for s in DS.construir(raiz1, revisoes={})["series"]}
    comp1 = COR.comparar(publicadas, novas1, D1)
    r1 = {sid: comp1[sid]["revisoes"] for sid in (SID_I, SID_E)}
    estado1 = DS.construir(raiz1, revisoes=r1)
    sp1, rv1 = tmp / "series-periodo-1.json", tmp / "revisoes-1.json"
    sp1.write_text(DS.render(estado1), encoding="utf-8")
    COR.escrever_revisoes(r1, rv1)
    resultado["achado_4"] = {
        "primeira_corrida": {"revisoes": rel1["revisoes"], "revistos": {s: rel1["series"][s]["periodos_revistos"] for s in (SID_I, SID_E)}},
        "primeira_revisao": {s: [(r["old_value"], r["new_value"], r["date"]) for r in r1[s]] for s in r1},
    }
    # A SEGUNDA CORRIDA, com o mesmo ponto mudado outra vez.
    try:
        rel2 = COR.correr(tmp / "c2", tudo=True, pedir=T.pedidor_de_mentira(corpos, mexer(2)), data=D2,
                          series_periodo=sp1, revisoes=rv1)
        raiz2 = COR.copia_da_fonte(tmp / "c2", tmp / "copia-2", D2)
        novas2 = {s["id"]: s for s in DS.construir(raiz2, revisoes={})["series"]}
        comp2 = COR.comparar({s["id"]: s for s in estado1["series"]}, novas2, D2)
        resultado["achado_4"]["segunda_corrida"] = {
            "excecao": None, "recusas": rel2["recusas"], "revisoes": rel2["revisoes"],
            "revistos": {s: rel2["series"][s]["periodos_revistos"] for s in (SID_I, SID_E)},
            "segunda_revisao": {s: [(r["old_value"], r["new_value"], r["date"]) for r in comp2[s]["revisoes"]] for s in (SID_I, SID_E)},
            "revisoes_no_ficheiro_depois_do_ensaio": json.loads(rv1.read_text(encoding="utf-8"))["revisoes"] == {s: r1[s] for s in r1},
        }
    except Exception as e:                                                       # noqa: BLE001 · a exceção é a medida
        resultado["achado_4"]["segunda_corrida"] = {"excecao": type(e).__name__, "mensagem": str(e)[:400]}

    # O ACHADO 5: a metainformação do INE da pensão média não se lê, numa corrida de ensaio e numa escrita.
    meta = COR.P.INE_META.format(codigo="0014532")
    sem_meta = {u: c for u, c in corpos.items() if u != meta}
    codigo, linha, recusas = correr_main(["--pasta", str(tmp / "c5")], pedir=T.pedidor_de_mentira(sem_meta), data=D1,
                                         revisoes=tmp / "rev-5.json")
    rel5 = json.loads((tmp / "c5" / "corredor.json").read_text(encoding="utf-8"))
    pedidos_da_pensao = [p for p in rel5["pedidos"] if p["serie"] == SID_I]
    fonte = T.fonte_de_escrita(tmp)
    sp5 = tmp / "series-periodo-5.json"
    sp5.write_bytes(DS.SERIES_PERIODO.read_bytes())
    try:
        COR.correr(tmp / "c5w", write=True, pedir=T.pedidor_de_mentira(sem_meta), data=D1, fonte=fonte,
                   series_periodo=sp5, revisoes=tmp / "rev-5w.json")
        escrita = {"excecao": None}
    except Exception as e:                                                       # noqa: BLE001 · a exceção é a medida
        escrita = {"excecao": type(e).__name__, "mensagem": str(e)[:400]}
    escrita["alojou_a_pasta_do_dia"] = (fonte / DS.PASTA_DO_CORREDOR / D1).is_dir()
    escrita["series_periodo_igual"] = sp5.read_bytes() == DS.SERIES_PERIODO.read_bytes()
    escrita["escreveu_as_revisoes"] = (tmp / "rev-5w.json").exists()
    resultado["achado_5"] = {
        "ensaio": {"codigo_do_main": codigo, "linha": linha, "linhas_recusa": recusas, "recusas": rel5["recusas"],
                   "pontos_novos": rel5["pontos_novos"], "revisoes": rel5["revisoes"], "pedidos_da_pensao": pedidos_da_pensao,
                   "pasta_da_pensao": rel5["series"][SID_I]["pasta"],
                   "escreveu_as_revisoes": (tmp / "rev-5.json").exists()},
        "escrita": escrita,
    }

texto = json.dumps(resultado, ensure_ascii=False, indent=2) + "\n"
for de, para in ((str(MOTOR), "<worktree do motor>"), (str(Path.home()), "<casa>")):
    texto = texto.replace(de, para)
(AQUI / f"rp4mb-motor-{ETIQUETA}.json").write_text(texto, encoding="utf-8")
print(json.dumps({"cabeca": (resultado["motor_cabeca"] or "")[:8], "achado_4": resultado["achado_4"].get("segunda_corrida", {}).get("excecao")
                  or resultado["achado_4"]["segunda_corrida"].get("revisoes"),
                  "achado_5": resultado["achado_5"]["ensaio"]["linha"]}, ensure_ascii=False))
