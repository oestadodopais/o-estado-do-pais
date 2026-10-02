#!/usr/bin/env python3
"""O §0 do brief UE2 (a página da União como a página dos países), medido sobre a cabeça presa do sítio (636cb657).
Não lê a rede: lê as séries, as declarações dos cartões, a faixa da União e as capturas do K2 na cabeça. Escreve
design/observatorio/medidas/BRIEF-UE2.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, struct, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "636cb657"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho, binario=False):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    if r.returncode != 0:
        return None
    return r.stdout if binario else r.stdout.decode("utf-8")


def listar(pasta):
    r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "--name-only", f"{CAB}:{pasta}"], capture_output=True, text=True)
    return r.stdout.split() if r.returncode == 0 else []


series = [f for f in listar("ledger/series") if f.endswith(".yml")]
medicao("series_de_paises_no_livro", len(series) if series else NAO, f"git ls-tree {CAB}:ledger/series · os .yml",
        "a da dívida pública é uma delas", "divida-publica-2025-paises.yml" in series)
fig = mostrar("src/data/figuras.mjs") or ""
cartoes = re.findall(r"\n\s*claim: '([a-z0-9-]+)',\s*\n\s*quadro:", fig)
medicao("cartoes_dos_dois_quadros", len(cartoes) if fig else NAO, f"git show {CAB}:src/data/figuras.mjs · as entradas com claim e quadro",
        "a dívida pública é um deles", any(c.startswith("divida-publica") for c in cartoes))
faixa = mostrar("src/components/FaixaDaUniao.astro") or ""
pontas = len(re.findall(r"ponta", faixa))
medicao("paises_nomeados_em_cada_faixa_hoje", 2 if faixa and "ponta" in faixa else NAO,
        f"git show {CAB}:src/components/FaixaDaUniao.astro · o cabeçalho diz que só o país mais baixo e o mais alto levam nome",
        "o cabeçalho fala das pontas", pontas > 0)
termos = ["nominal unit labour cost", "deflat", "economias avançadas", "advanced economies", "consolidado", "consolidated"]
medicao("termos_tecnicos_nas_definicoes_dos_quadros", sum(len(re.findall(t, fig, flags=re.I)) for t in termos) if fig else NAO,
        "as ocorrências em figuras.mjs de «nominal unit labour cost», «deflat», «economias avançadas»/«advanced economies», «consolidado»/«consolidated»",
        "«deflat» aparece", bool(re.search("deflat", fig, flags=re.I)))


def altura_png(b):
    return struct.unpack(">II", b[16:24])[1] if b and b[:8] == b"\x89PNG\r\n\x1a\n" else None


alt = altura_png(mostrar("design/especime-v3/capturas/k2-2026-10-02/depois-uniao-pt-390.png", binario=True))
medicao("altura_da_pagina_da_uniao_a_390_depois_do_k2", alt or NAO, "a altura do PNG design/especime-v3/capturas/k2-2026-10-02/depois-uniao-pt-390.png",
        "a largura é 390", struct.unpack(">II", (mostrar("design/especime-v3/capturas/k2-2026-10-02/depois-uniao-pt-390.png", binario=True) or b"\0" * 24)[16:24])[0] == 390)

saida = {"brief": "design/observatorio/BRIEF-UE2-a-pagina-dos-paises.md", "guiao": "design/observatorio/medidas/BRIEF-UE2.py",
         "cabeca_lida": CAB, "series": series, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-UE2.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
