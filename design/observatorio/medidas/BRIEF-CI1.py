#!/usr/bin/env python3
"""O §0 do brief CI1 (a corrida «portão» em metade do tempo), medido sobre a cabeça presa do sítio (a677770f).
Não lê o motor nem a API do GitHub: o portão dos briefs corre sem eles; os tempos estão no §1 do brief,
lidos pelo lugar de direção. Escreve design/observatorio/medidas/BRIEF-CI1.json (ou o caminho em
OEDP_MEDIDAS_JSON). Cada medição leva o comando e um conhecido-positivo; o que não conseguir ler fica
«NÃO LIDO»."""
import json, re, subprocess, pathlib, os
SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "a677770f"
NAO = "NÃO LIDO"
medidas = []
def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando, "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})
def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None

pk = mostrar("package.json")
scripts = json.loads(pk)["scripts"] if pk else {}
cadeia = lambda nome: [x.strip() for x in scripts.get(nome, "").split("&&") if x.strip()]
b, v = cadeia("build"), cadeia("verify")
medicao("passos_do_build", len(b) if b else NAO, f"git show {CAB}:package.json · scripts.build partido em &&",
        "a cadeia do build tem a construção do Astro", "astro build" in b)
medicao("passos_do_verify", len(v) if v else NAO, "o mesmo ficheiro · scripts.verify partido em &&",
        "a cadeia do verify tem a conferência das palavras", "npm run check:palavras" in v)
rep = [x for x in v if x in b]
medicao("passos_repetidos", len(rep) if (b and v) else NAO, "os passos do verify que são exatamente um passo do build",
        "a conferência do HTML é um deles", "npm run gate:html" in rep)
W = ".github/workflows/portao.yml"
w = mostrar(W) or ""
bloco = w.split("\njobs:\n", 1)[1] if "\njobs:\n" in w else ""
trab = re.findall(r"^  ([A-Za-z0-9_-]+):\s*$", bloco, re.M)
medicao("trabalhos_da_corrida", len(trab) if bloco else NAO, f"git show {CAB}:{W} · as chaves de dois espaços debaixo de jobs:",
        "o trabalho chama-se portao, o nome que a proteção de main exige", "portao" in trab)

saida = {"brief": "design/observatorio/BRIEF-CI1-o-portao-em-metade-do-tempo.md", "guiao": "design/observatorio/medidas/BRIEF-CI1.py", "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-CI1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
