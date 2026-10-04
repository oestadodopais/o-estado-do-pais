#!/usr/bin/env python3
"""RP3: o que o relatório cita do motor, lido da worktree do motor e escrito em motor/motor-rp3.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/rp3-2026-10-04/motor-rp3.py <worktree do motor>

O sítio não tem o motor ao lado na máquina do portão, e por isso as medidas do motor
que o relatório cita ficam aqui, num ficheiro, com a cabeça do motor e o sha256 de cada
ficheiro lido. Nenhum caminho da máquina entra no ficheiro: os caminhos são relativos à
raiz do motor. Lê: o ficheiro das séries no tempo (as séries, as linhas presas, paradas e
coerentes, o relatório do construtor), o registo dos pedidos, a escolha da S3, o
FETCH.json e o MANIFEST.sha256 do estudo 13, e os tamanhos dos ficheiros de fonte (para o
teto do corpo). Não escreve nada no motor.
"""
import collections
import hashlib
import json
import pathlib
import subprocess
import sys

if len(sys.argv) != 2:
    sys.exit("uso: motor-rp3.py <worktree do motor>")
MOTOR = pathlib.Path(sys.argv[1]).resolve()
SAIDA = pathlib.Path(__file__).resolve().parent / "motor" / "motor-rp3.json"
lidos = {}


def ler(rel: str) -> bytes:
    b = (MOTOR / rel).read_bytes()
    lidos[rel] = {"bytes": len(b), "sha256": hashlib.sha256(b).hexdigest()}
    return b


cabeca = subprocess.run(["git", "-C", str(MOTOR), "rev-parse", "HEAD"], capture_output=True, text=True, check=True).stdout.strip()
estado = subprocess.run(["git", "-C", str(MOTOR), "status", "--short"], capture_output=True, text=True, check=True).stdout

doc = json.loads(ler("content/13 Dominios/series-periodo.json"))
rel_por_id = {r["serie"]: r for r in doc["relatorio"]}
series = []
for s in doc["series"]:
    r = rel_por_id[s["id"]]
    series.append({
        "id": s["id"], "fonte": s["source"] or "derivada", "edicao": (s["document"] or {}).get("edition"),
        "periodicidade": s["periodicidade"], "unidade": s["unit"], "nome_da_fonte": s["name"],
        "primeiro": s["primeiro_periodo"], "ultimo": s["ultimo_periodo"], "pontos": len(s["pontos"]),
        "ultimo_valor": s["pontos"][-1]["valor"], "ultima_bandeira": s["pontos"][-1]["bandeira"],
        "pontos_com_marca": sum(1 for p in s["pontos"] if p["bandeira"]),
        "marcas": sorted({p["bandeira"] for p in s["pontos"] if p["bandeira"]}),
        "lacunas": [l["periodo"] for l in s["lacunas"]],
        "lacunas_com_razao_da_fonte": sum(1 for l in s["lacunas"] if l.get("razao")),
        "pedidos": len(s["pedidos"]), "bytes_dos_corpos": sum(p["bytes"] for p in s["pedidos"]),
        "maior_corpo": max((p["bytes"] for p in s["pedidos"]), default=0),
        "aceitou_o_pedido_inteiro": r.get("aceitou_o_pedido_inteiro"),
        "periodos_fora_da_cadencia_na_resposta": r.get("fora_da_cadencia"),
        "published_at": s["published_at"], "access_date": s["access_date"],
        "derivada_de": s["derived_from"],
    })

pedidos = [json.loads(l) for l in ler("indicators/out/rp3-2026-10-04/pedidos.jsonl").decode("utf-8").splitlines() if l.strip()]
por_estado = collections.Counter(f"{p['estado']} {p['http']}" for p in pedidos)
por_anfitriao = collections.Counter(p["url"].split("/")[2] for p in pedidos)
recusas_ine = [{"nome": p["nome"], "http": p["http"], "bytes": p["bytes"], "erro": (p["erro"] or "")[:160],
                "file": p["file"]} for p in pedidos
               if p["http"] == 414 or (p["http"] == 200 and p["bytes"] and p["bytes"] < 400 and "ine" in p["nome"])]
ora = []
for p in pedidos:
    if p["http"] == 200 and p["file"] and p["bytes"] < 400:
        corpo = ler(f"indicators/out/rp3-2026-10-04/{p['file']}").decode("utf-8", "replace")
        if "ORA-06502" in corpo:
            ora.append({"nome": p["nome"], "file": p["file"], "bytes": p["bytes"], "sha256": p["sha256"]})
escolha = json.loads(ler("indicators/out/rp3-2026-10-04/escolha-s3.json"))

# A metainformação de cada código do INE das séries, como a resposta a escreve: a periodicidade, o primeiro e o
# último período, as casas decimais e a última atualização.
metainformacao = {}
for ficheiro, codigo in (("001-ine-0014663-meta.json", "0014663"), ("005-ine-0014639-meta.json", "0014639"),
                         ("013-ine-0014751-meta.json", "0014751"), ("014-ine-0014532-meta.json", "0014532"),
                         ("015-ine-0013420-meta.json", "0013420")):
    d = json.loads(ler(f"indicators/out/rp3-2026-10-04/{ficheiro}"))
    m = d[0] if isinstance(d, list) else d
    metainformacao[codigo] = {k: m.get(k) for k in ("Periodic", "PrimeiroPeriodo", "UltimoPeriodo", "PrecisaoDecimal", "DataUltimaAtualizacao")}
fetch = json.loads(ler("content/13 Dominios/source/FETCH.json"))
manifesto = ler("content/13 Dominios/source/MANIFEST.sha256").decode("utf-8").splitlines()
rp3_fetch = {k: v for k, v in fetch["files"].items() if k.startswith("rp3/")}
rp3_manifesto = [l for l in manifesto if l.split("  ", 1)[-1].startswith("rp3/")]

# O teto do corpo: o maior ficheiro de fonte que o motor guarda em git simples.
listados = subprocess.run(["git", "-C", str(MOTOR), "ls-files", "-z", "content"], capture_output=True, check=True).stdout.decode("utf-8").split("\0")
de_fonte = [f for f in listados if f and "/source/" in f]
maior = max(de_fonte, key=lambda f: (MOTOR / f).stat().st_size)

# Os ficheiros de outras corridas que este bloco não toca: nenhum muda no intervalo do ramo.
mudados = subprocess.run(["git", "-C", str(MOTOR), "diff", "--name-only", "d2495a7..HEAD"], capture_output=True, text=True, check=True).stdout.splitlines()
def de_outras_corridas(f: str) -> bool:
    return ((f.startswith("indicators/") and f.count("/") == 1 and f.endswith(".json"))
            or f.startswith(".maintenance-locks/") or f.startswith("sweeps/")
            or f == "publisher/recortes/manifest.regioes.json")

# As linhas acrescentadas e tiradas em cada módulo do motor que o bloco mudou (os leitores de célula não mudam:
# o ficheiro dos leitores só ganha linhas).
numstat = {}
for l in subprocess.run(["git", "-C", str(MOTOR), "diff", "--numstat", "d2495a7..HEAD", "--", "publisher", "core"],
                        capture_output=True, text=True, check=True).stdout.splitlines():
    mais, menos, f = l.split("\t")
    if not f.startswith("publisher/fixtures/"):
        numstat[f] = {"acrescentadas": int(mais), "tiradas": int(menos)}

commits = subprocess.run(["git", "-C", str(MOTOR), "log", "--format=%h", "d2495a7..HEAD"], capture_output=True, text=True, check=True).stdout.split()

saida = {
    "_": "Escrito por design/especime-v3/medicoes/rp3-2026-10-04/motor-rp3.py a partir da worktree do motor. Não se edita à mão.",
    "commits_do_ramo": list(reversed(commits)),
    "modulos_mudados": numstat,
    "intervalo_do_ramo": "d2495a7..HEAD",
    "ficheiros_mudados_no_ramo": len(mudados),
    "ficheiros_de_outras_corridas_mudados": [f for f in mudados if de_outras_corridas(f)],
    "conhecido_positivo_de_outras_corridas": de_outras_corridas("indicators/vintages.json") and not de_outras_corridas("indicators/out/rp3-2026-10-04/escolha-s3.json"),
    "cabeca_do_motor": cabeca,
    "arvore_do_motor_limpa": estado == "",
    "ficheiros_lidos": lidos,
    "series": series,
    "series_no_ficheiro": len(doc["series"]),
    "pontos_no_ficheiro": sum(len(s["pontos"]) for s in doc["series"]),
    "pontos_com_excerto": sum(1 for s in doc["series"] for p in s["pontos"] if p.get("excerto")),
    "linhas_presas": doc["linhas_presas"],
    "linhas_paradas": doc["linhas_paradas"],
    "linhas_coerentes": doc["linhas_coerentes"],
    "pedidos": {"tentativas": len(pedidos), "por_estado": dict(por_estado), "por_anfitriao": dict(por_anfitriao),
                "recusas_ora_06502": ora, "recusa_414": [r for r in recusas_ine if r["http"] == 414],
                "teto_em_cada_pedido": sorted({p["teto_bytes"] for p in pedidos}),
                "user_agent": sorted({p["user_agent"] for p in pedidos}), "cliente": sorted({p["cliente"] for p in pedidos}),
                "primeiro": min(p["timestamp_utc"] for p in pedidos), "ultimo": max(p["timestamp_utc"] for p in pedidos),
                "maior_corpo_lido": max(p["bytes"] for p in pedidos)},
    "alojados": {"no_fetch": len(rp3_fetch), "no_manifesto": len(rp3_manifesto),
                 "bytes": sum(v["bytes"] for v in rp3_fetch.values())},
    "metainformacao_do_ine": metainformacao,
    # A linha do salário mínimo e a S15: o corpo que a linha cita (alojado a 01.09.2026) e o do pedido deste bloco.
    "s15_e_a_linha": {
        "corpo_da_linha": "eurostat/earn_mw_cur.json",
        "sha256_da_linha": fetch["files"]["eurostat/earn_mw_cur.json"]["sha256"],
        "lido_em_da_linha": fetch["files"]["eurostat/earn_mw_cur.json"]["fetched_at"],
        "sha256_da_serie": next(x for x in doc["series"] if x["id"] == "serie-salario-minimo-mensal")["pedidos"][0]["sha256"],
        "mesmos_bytes": fetch["files"]["eurostat/earn_mw_cur.json"]["sha256"]
                        == next(x for x in doc["series"] if x["id"] == "serie-salario-minimo-mensal")["pedidos"][0]["sha256"],
    },
    "escolha_da_s3": {"escolhido": escolha.get("codigo"), "fixas": escolha.get("fixas"),
                      "candidatos": [{"codigo": c["codigo"], "nome": c["nome"], "criterios": c["criterios"],
                                      "primeiro": c["primeiro"], "ultimo": c["ultimo"], "casas_decimais": c["casas_decimais"]}
                                     for c in escolha["candidatos"]]},
    "teto_do_corpo": {"maior_ficheiro_de_fonte_em_git": maior, "bytes": (MOTOR / maior).stat().st_size,
                      "ficheiros_de_fonte_em_git": len(de_fonte), "teto": 8 * 1024 * 1024},
}
SAIDA.parent.mkdir(parents=True, exist_ok=True)
SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"motor-rp3: {len(series)} séries, {saida['pontos_no_ficheiro']} pontos, {len(pedidos)} tentativas, "
      f"{len(rp3_fetch)} alojados; cabeça {cabeca[:7]}")
