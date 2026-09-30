#!/usr/bin/env python3
"""O §0 do brief N1 (uma porta por assunto), medido sobre a cabeça presa do sítio (1d9e5b2e).
Não lê a rede: lê os módulos de dados do sítio na cabeça, pelo Node, e conta o que o brief afirma.
Escreve design/observatorio/medidas/BRIEF-N1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o
comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, subprocess, sys, tempfile

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "1d9e5b2e"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def no_node(guiao):
    """Corre um guião ES na árvore da cabeça presa (src/ e ledger/), exportada para uma pasta temporária."""
    with tempfile.TemporaryDirectory() as tmp:
        arq = subprocess.run(["git", "-C", str(SITIO), "archive", CAB, "src", "ledger"], capture_output=True)
        if arq.returncode != 0:
            return None
        subprocess.run(["tar", "-x", "-C", tmp], input=arq.stdout, check=True)
        # Os módulos importam pacotes (js-yaml); a árvore exportada usa os do sítio, por ligação.
        os.symlink(SITIO / "node_modules", pathlib.Path(tmp) / "node_modules")
        r = subprocess.run(["node", "--input-type=module", "-e", guiao], cwd=tmp, capture_output=True, text=True)
        if r.returncode != 0:
            # Um detetor calado diz porquê: a razão vai para o erro, e as medidas ficam «NÃO LIDO».
            print("o node não leu os módulos: " + r.stderr.strip()[-400:], file=sys.stderr)
            return None
        return json.loads(r.stdout)


dados = no_node("""
import { ENTRADAS, BLOCOS_DA_PRIMEIRA_PAGINA } from './src/data/primeira-pagina.mjs';
import { temasDoPais } from './src/lib/pais.mjs';
import { DOMINIOS } from './src/data/dominios.mjs';
import { AREAS } from './src/data/areas.mjs';
const entradas = ENTRADAS.map(e => ({ id: e.id, rota: e.rota.pt, nome: e.nome.pt, blocos: e.blocos, cartoes: (e.seccoes || []).flatMap(s => s.cartoes) }));
const nasEntradas = entradas.flatMap(e => e.cartoes);
const temas = temasDoPais('pt').map(t => ({ slug: t.slug, cartoes: t.medidas.map(m => m.id || m.chave || m) }));
const nosTemas = temas.flatMap(t => t.cartoes);
const estados = {}; for (const d of DOMINIOS) estados[d.estado] = (estados[d.estado] || 0) + 1;
console.log(JSON.stringify({ entradas, blocos: BLOCOS_DA_PRIMEIRA_PAGINA.map(b => b.id), nasEntradas, nosTemas, temas: temas.length, dominios: DOMINIOS.length, estados, areas: AREAS.length }));
""")

if dados is None:
    for nome in ("entradas", "cartoes_nas_entradas", "cartoes_repetidos_nos_temas", "blocos_copiados", "dominios", "areas"):
        medicao(nome, NAO, "git archive + node sobre src/", "os módulos de dados carregam", False)
else:
    entradas = dados["entradas"]
    com_pagina = [e for e in entradas if e["cartoes"]]
    medicao("entradas_com_pagina", len(com_pagina), "ENTRADAS de src/data/primeira-pagina.mjs, as que têm cartões",
            "«O meu dinheiro» é uma delas", any(e["nome"] == "O meu dinheiro" for e in com_pagina))
    nas_entradas = dados["nasEntradas"]
    medicao("cartoes_nas_entradas", len(nas_entradas), "a soma dos cartões das secções das entradas",
            "a dívida pública está numa entrada", "divida-publica-2025" in nas_entradas)
    medicao("cartoes_distintos_nas_entradas", len(set(nas_entradas)), "os mesmos, sem repetições",
            "a dívida pública conta uma vez", nas_entradas.count("divida-publica-2025") == 1)
    nos_temas = dados["nosTemas"]
    medicao("cartoes_nos_temas", len(nos_temas), "temasDoPais('pt') de src/lib/pais.mjs, os cartões dos nove temas (sem o cartão das câmaras)",
            "a dívida pública está nos temas", "divida-publica-2025" in nos_temas)
    repetidos = sorted(set(nas_entradas) & set(nos_temas))
    medicao("cartoes_nas_entradas_e_nos_temas", len(repetidos), "a interseção das duas listas",
            "a dívida pública está nas duas", "divida-publica-2025" in repetidos)
    medicao("cartoes_so_numa_das_duas", len(set(nas_entradas) ^ set(nos_temas)), "a diferença simétrica das duas listas",
            "a lista dos temas foi lida", len(nos_temas) > 0)
    blocos = dados["blocos"]
    copiados = [b for e in entradas for b in e["blocos"]]
    medicao("blocos_da_primeira_pagina", len(blocos), "BLOCOS_DA_PRIMEIRA_PAGINA", "o bloco «precos» existe", "precos" in blocos)
    medicao("blocos_copiados_nas_entradas", len(copiados), "a soma dos `blocos` das ENTRADAS (cada um é um bloco da primeira página repetido por inteiro na entrada)",
            "«O meu dinheiro» copia o bloco «precos»", any(e["nome"] == "O meu dinheiro" and "precos" in e["blocos"] for e in entradas))
    medicao("entradas_que_copiam_blocos", len([e for e in entradas if e["blocos"]]), "as ENTRADAS com `blocos` não vazio",
            "«A escola e a saúde» não copia nenhum", any(e["id"] == "escola-e-saude" and not e["blocos"] for e in entradas))
    medicao("temas", dados["temas"], "temasDoPais('pt'), o número de temas", "há mais de um tema", dados["temas"] > 1)
    medicao("dominios", dados["dominios"], "DOMINIOS de src/data/dominios.mjs", "há mais de um domínio", dados["dominios"] > 1)
    medicao("dominios_no_ar", dados["estados"].get("no-ar", 0), "os DOMINIOS com estado «no-ar»", "os estados foram lidos", bool(dados["estados"]))
    medicao("dominios_sem_pagina", dados["estados"].get("sem", 0), "os DOMINIOS com estado «sem»", "os estados foram lidos", bool(dados["estados"]))
    medicao("areas", dados["areas"], "AREAS de src/data/areas.mjs", "há mais de uma área", dados["areas"] > 1)

# As duas linhas do desemprego de Portugal, com o valor sem a casa decimal que a fonte escreve.
import yaml
def linha(id_):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:ledger/claims/{id_}.yml"], capture_output=True, text=True)
    return yaml.safe_load(r.stdout) if r.returncode == 0 else None
sem_decimal = []
for id_ in ("taxa-de-desemprego-mip-2025", "taxa-de-desemprego-2025"):
    l = linha(id_)
    if l and str(l.get("value")) == "6" and str(l.get("excerpt", "")).rstrip().endswith("6.0"):
        sem_decimal.append(id_)
ue = linha("taxa-de-desemprego-2025-ue")
medicao("linhas_do_desemprego_com_6_onde_a_fonte_escreve_6_0", len(sem_decimal) if sem_decimal is not None else NAO,
        f"git show {CAB}:ledger/claims/<id>.yml · value «6» e excerpt a acabar em «6.0»",
        "a linha da União escreve «6,0»", bool(ue) and str(ue.get("value")) == "6,0")

saida = {"brief": "design/observatorio/BRIEF-N1-uma-porta-por-assunto.md", "guiao": "design/observatorio/medidas/BRIEF-N1.py",
         "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-N1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
