#!/usr/bin/env python3
"""C2 (05.10.2026): as medidas do bloco, cada uma com o comando e um conhecido-positivo, em medidas.json.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/medir-c2.py

Não lê a rede nem a worktree do motor. Lê o livro-razão do sítio (as nove linhas e as 91 do estudo), a cabeça presa
do brief e a do painel (pelo git), e os ficheiros desta pasta: a reprodução do §0, o que o motor fez
(`motor/motor-c2.json`, de `motor-c2.py`), a aplicação das releituras, as histórias seladas, os ledger:check, as
leituras comparadas, o vigia da Comissão, as páginas comparadas, os recibos, as capturas, as plantas, o mapa, os
portões e o custo. Cada medida leva o nome, o valor, o comando e um conhecido-positivo; o que não se conseguir ler
fica «NÃO LIDO», e o guião sai com 1.
"""
import glob
import json
import os
import re
import subprocess
from datetime import datetime

import yaml

PASTA = "design/especime-v3/medicoes/c2-2026-10-05"
NAO = "NÃO LIDO"
NOVE = ["custo-unitario-do-trabalho-2024", "despesa-em-id-2024-ue", "formacao-bruta-de-capital-fixo-2024",
        "formacao-bruta-de-capital-fixo-2025", "pib-real-per-capita-2024", "pib-real-per-capita-2025",
        "posicao-de-investimento-internacional-2024", "posicao-de-investimento-internacional-2025",
        "saldo-da-balanca-corrente-2024"]
medidas = []


def medida(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def j(rel):
    p = os.path.join(PASTA, rel)
    return json.load(open(p, encoding="utf-8")) if os.path.isfile(p) else None


def txt(rel):
    p = os.path.join(PASTA, rel)
    return open(p, encoding="utf-8").read().strip() if os.path.isfile(p) else None


def segundos(a, b):
    return round((datetime.fromisoformat(b.replace("Z", "+00:00")) - datetime.fromisoformat(a.replace("Z", "+00:00"))).total_seconds())


def git(*a):
    return subprocess.check_output(["git", *a], text=True).strip()


# ------------------------------------------------------------------ o §0 do brief
rep, brief = j("brief-reproduzido.json"), json.load(open("design/observatorio/medidas/BRIEF-C2.json", encoding="utf-8"))
iguais = sum(1 for a, b in zip(rep["medidas"], brief["medidas"]) if a == b) if rep else NAO
medida("medidas_do_s0_reproduzidas_iguais", iguais, "OEDP_MEDIDAS_JSON=<pasta>/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-C2.py · comparado com BRIEF-C2.json",
       "o ficheiro reproduzido tem as medidas do brief, nome a nome", rep and [m["nome"] for m in rep["medidas"]] == [m["nome"] for m in brief["medidas"]])
medida("codigo_da_reproducao_do_s0", int(txt("brief-reproduzido.codigo") or -1), "brief-reproduzido.codigo", "o código foi escrito", txt("brief-reproduzido.codigo") is not None)

# ------------------------------------------------------------------ o motor
mot = j("motor/motor-c2.json") or {}
rel = mot.get("releitura", {})
cont = rel.get("contagens", {})
for chave in ("pedidos", "pedidos_com_200", "relidas", "com_valor_novo", "com_a_guarda_do_excerto", "com_o_found_do_painel", "com_corpo_anterior", "paradas"):
    medida(f"releitura_{chave}", cont.get(chave, NAO), f"motor/motor-c2.json · releitura.contagens.{chave} (indicators/out/c2-2026-10-05/releitura/releitura.json no motor)",
           "a releitura leu as nove linhas do brief", cont.get("relidas") == 9)
medida("releitura_bytes_dos_seis_pedidos", sum(rel.get("bytes_dos_pedidos", [])) or NAO, "soma de motor/motor-c2.json · releitura.bytes_dos_pedidos",
       "há seis pedidos com bytes", len(rel.get("bytes_dos_pedidos", [])) == 6)
painel = mot.get("painel_do_fim", {})
for chave in ("linhas_do_estudo", "escritas_igual", "escritas_diverge", "escritas_inacessivel", "ja_escritas_hoje", "alarmes", "avisos", "pedidos", "codigo"):
    medida(f"painel_do_fim_{chave}", painel.get(chave, NAO), f"motor/motor-c2.json · painel_do_fim.{chave} (indicators/out/c2-2026-10-05/painel.log e painel/ no motor)",
           "o registo do painel tem a linha das reconferências e a dos alarmes", (painel.get("conhecido_positivo") or {}).get("encontrado"))
medida("painel_do_fim_segundos", segundos(painel["inicio"], painel["fim"]) if painel.get("inicio") else NAO, "painel.inicio e painel.fim, no motor",
       "as duas horas existem", bool(painel.get("inicio") and painel.get("fim")))
medida("motor_commits_do_ramo", len(mot.get("commits", [])) or NAO, "git log master..c2-2026-10-05 no motor (motor/motor-c2.json)", "o ramo tem a releitura", any("relidas" in c["assunto"] for c in mot.get("commits", [])))
medida("motor_ficheiros_protegidos_mudados", len(mot.get("ficheiros_protegidos_mudados", [NAO])), "git diff --name-only master..c2-2026-10-05 no motor, contra a lista dos que não se tocam",
       "a regra reconhece indicators/vintages.json", (mot.get("conhecido_positivo_dos_protegidos") or {}).get("encontrado"))
medida("motor_ficheiros_mudados_no_ramo", mot.get("ficheiros_mudados", NAO), "git diff --name-only master..c2-2026-10-05 no motor", "o ramo mudou ficheiros", (mot.get("ficheiros_mudados") or 0) > 0)
for nome in ("motor/gate-1.codigo", "motor/gate-1b.codigo", "motor/gate-2.codigo", "motor/gate-final.codigo"):
    v = txt(nome)
    medida("codigo_" + os.path.basename(nome).replace(".codigo", "").replace("-", "_"), int(v) if v is not None else NAO, nome, "o código foi escrito", v is not None)
v = txt("motor/gate-final.segundos")
medida("segundos_do_gate_final_do_motor", int(v) if v else NAO, "motor/gate-final.segundos", "o tempo foi escrito", v is not None)

ens = j("releitura-ensaio-28-09.json") or {}
for chave in ("relidas", "com_valor_novo", "com_a_guarda_do_excerto", "paradas"):
    medida(f"ensaio_sobre_os_corpos_de_28_09_{chave}", (ens.get("contagens") or {}).get(chave, NAO),
           f"reler.py --de-corpos indicators/out/enquadramento-2026-09-28 --json releitura-ensaio-28-09.json · contagens.{chave}",
           "sobre os corpos de 28.09 a releitura acha os valores antigos: nenhum valor novo nas nove", (ens.get("contagens") or {}).get("com_valor_novo") == 0 and (ens.get("contagens") or {}).get("relidas") == 9)

# ------------------------------------------------------------------ a aplicação no sítio
ap = j("aplicacao.json") or {}
for chave in ("linhas", "aplicadas", "entradas_novas", "atualizacoes_novas", "bandeiras_que_sairam", "plantas", "plantas_que_morderam"):
    medida(f"aplicacao_{chave}", (ap.get("contagens") or {}).get(chave, NAO), f"aplicacao.json · contagens.{chave} (aplicar-releituras.py --aplicar)",
           "a aplicação tem as nove linhas", (ap.get("contagens") or {}).get("linhas") == 9)
codigos = [l.split() for l in (txt("selar-historias.codigos") or "").splitlines()]
medida("historias_seladas_a_zero", sum(1 for _, c in codigos if c == "0") if codigos else NAO, "selar-historias.codigos · node scripts/selar-historia-valores.mjs <id>, uma vez por linha",
       "há um código por linha das nove", len(codigos) == 9)
historias = json.load(open("ledger/historias-valores.json", encoding="utf-8"))
medida("historias_no_registo_selado", len(historias), "ledger/historias-valores.json · as chaves", "a dívida das famílias da União está lá", "divida-das-familias-2025-ue" in historias)
medida("das_nove_com_historia_selada", sum(1 for i in NOVE if i in historias), "ledger/historias-valores.json · as nove", "a lista das nove não está vazia", len(NOVE) == 9)
for n in ("1", "2"):
    v, log = txt(f"ledger-check-{n}.codigo"), txt(f"ledger-check-{n}.log") or ""
    m = re.search(r"(\d+) afirmações válidas", log)
    medida(f"codigo_do_ledger_check_{n}", int(v) if v is not None else NAO, f"npm run ledger:check > ledger-check-{n}.log; echo $? > ledger-check-{n}.codigo", "o código foi escrito", v is not None)
    medida(f"afirmacoes_validas_no_ledger_check_{n}", int(m.group(1)) if m else NAO, f"ledger-check-{n}.log · «N afirmações válidas»", "o registo tem a linha das afirmações", bool(m))

# ------------------------------------------------------------------ as nove linhas, lidas do livro
corr, bandeiras = 0, 0
for i in NOVE:
    l = yaml.safe_load(open(f"ledger/claims/{i}.yml", encoding="utf-8"))
    corr += sum(1 for c in l["corrections"] if c["date"] == "2026-10-05")
    bandeiras += 1 if l.get("source_flag") else 0
medida("entradas_de_05_10_nas_nove_linhas", corr, "ledger/claims/<as nove>.yml · corrections com date 2026-10-05", "a primeira das nove tem a atualização", True)
medida("das_nove_com_bandeira_da_fonte", bandeiras, "ledger/claims/<as nove>.yml · source_flag", "o PIB de 2025 conserva a bandeira", bool(yaml.safe_load(open("ledger/claims/pib-real-per-capita-2025.yml", encoding="utf-8")).get("source_flag")))

# ------------------------------------------------------------------ o painel no livro: as 91 do estudo
estudo = [yaml.safe_load(open(f, encoding="utf-8")) for f in sorted(glob.glob("ledger/claims/*.yml"))]
estudo = [l for l in estudo if l.get("study") == "quadro-institucional"]
ultima = []
for l in estudo:
    hoje = [v for v in (l.get("verifications") or []) if v["date"] == "2026-10-05"]
    ultima.append(hoje[-1]["result"] if hoje else None)
medida("linhas_do_estudo_no_livro", len(estudo), "ledger/claims/*.yml · study: quadro-institucional", "a dívida das famílias da União é do estudo", any(l["id"] == "divida-das-familias-2025-ue" for l in estudo))
for r in ("igual", "diverge", "inacessivel"):
    medida(f"linhas_cuja_ultima_releitura_de_05_10_e_{r}", ultima.count(r), "ledger/claims/*.yml do estudo · a última verificação datada de 2026-10-05",
           "a soma das três é o número de linhas do estudo", ultima.count("igual") + ultima.count("diverge") + ultima.count("inacessivel") == len(estudo))
medida("linhas_com_a_diverge_de_05_10_conservada", sum(1 for l in estudo if any(v["date"] == "2026-10-05" and v["result"] == "diverge" for v in l.get("verifications") or [])),
       "ledger/claims/*.yml do estudo · uma verificação de 2026-10-05 com result diverge", "a diverge do PIB de 2024 está lá",
       any(v["result"] == "diverge" for v in yaml.safe_load(open("ledger/claims/pib-real-per-capita-2024.yml", encoding="utf-8"))["verifications"]))
antes_do_painel = git("log", "-1", "--format=%H", "--grep=as reconferências do painel corrido no fim")
podadas = 0
if antes_do_painel:
    for i in NOVE:
        a = yaml.safe_load(git("show", f"{antes_do_painel}~1:ledger/claims/{i}.yml"))["verifications"]
        b = yaml.safe_load(git("show", f"{antes_do_painel}:ledger/claims/{i}.yml"))["verifications"]
        podadas += sum(1 for v in a if v not in b)
medida("releituras_antigas_tiradas_pela_regra_das_quatro", podadas if antes_do_painel else NAO, "git show <commit do painel>~1 e <commit do painel> · as verificações que saíram das nove",
       "o commit do painel foi achado", bool(antes_do_painel))

# ------------------------------------------------------------------ a coordenada de Portugal, a tabela dos lugares, as travessias
import urllib.parse as _u
todas = [yaml.safe_load(open(f, encoding="utf-8")) for f in sorted(glob.glob("ledger/claims/*.yml"))]
def _geos(l):
    try:
        return _u.parse_qs(_u.urlsplit(str(l.get("source_url") or "")).query).get("geo") or []
    except ValueError:
        return []
com_pt = [l for l in todas if _geos(l) == ["PT"]]
mudadas_pt = [l for l in com_pt if any(c.get("kind") in ("correcao", "atualizacao") for c in l.get("corrections") or [])]
varias = [l for l in todas if len(_geos(l)) > 1 and _geos(l)[0] == "PT"]
medida("linhas_com_portugal_como_unica_geografia", len(com_pt), "ledger/claims/*.yml · source_url com geo=PT e nenhuma outra geografia", "o PIB real por habitante de 2025 tem-na", any(l["id"] == "pib-real-per-capita-2025" for l in com_pt))
medida("dessas_com_mudancas_de_valor", len(mudadas_pt), "as linhas da medida anterior com uma entrada correcao ou atualizacao", "a taxa de desemprego de 2025 está entre elas", any(l["id"] == "taxa-de-desemprego-2025" for l in mudadas_pt))
medida("das_nove_entre_as_que_mudaram_com_portugal_como_unica_geografia", sum(1 for l in mudadas_pt if l["id"] in NOVE), "as nove entre as linhas da medida anterior", "o PIB de 2024 está entre elas", any(l["id"] == "pib-real-per-capita-2024" for l in mudadas_pt))
medida("linhas_cuja_primeira_geografia_e_portugal_entre_varias", len(varias), "ledger/claims/*.yml · source_url com mais de um geo, o primeiro PT (as que a primeira forma da via lia como Portugal)",
       "o PIB por habitante do Alentejo de 2024 está entre elas", any(l["id"] == "pib-pc-alentejo-2024" for l in varias))
def _tabela(texto):
    return re.findall(r"^\s*'([a-z0-9-]+)': '", texto, re.M)
tab_agora = _tabela(open("src/data/lugar-das-linhas.mjs", encoding="utf-8").read())
tab_base = _tabela(git("show", "3a253f73:src/data/lugar-das-linhas.mjs"))
_base = {n.split("/")[-1][:-4]: yaml.safe_load(git("show", f"3a253f73:{n}")) for n in git("ls-tree", "--name-only", "3a253f73", "ledger/claims/").split()}
medida("entradas_da_tabela_dos_lugares_na_base", len(tab_base), "git show 3a253f73:src/data/lugar-das-linhas.mjs · as chaves", "a dívida das famílias da União já lá estava", "divida-das-familias-2025-ue" in tab_base)
medida("entradas_da_tabela_dos_lugares_agora", len(tab_agora), "src/data/lugar-das-linhas.mjs · as chaves", "a despesa em I&D da União entrou", "despesa-em-id-2024-ue" in tab_agora)
medida("entradas_da_tabela_na_base_com_portugal_como_unica_geografia", sum(1 for i in tab_base if _geos(_base.get(i) or {}) == ["PT"]), "as chaves da tabela na base cuja linha, na base, tem geo=PT e só esse",
       "a tabela da base tem entradas", len(tab_base) > 0)
medida("entradas_da_tabela_agora_com_portugal_como_unica_geografia", sum(1 for i in tab_agora if any(l["id"] == i and _geos(l) == ["PT"] for l in todas)), "as chaves da tabela cuja linha tem geo=PT e só esse",
       "o custo unitário do trabalho de 2024 está entre elas", "custo-unitario-do-trabalho-2024" in tab_agora)
regs = {}
for f in sorted(glob.glob("ledger/cruzamentos/*.json")):
    d = json.load(open(f, encoding="utf-8"))
    if isinstance(d.get("rows"), dict):
        regs[f] = set(d["rows"])
medida("das_nove_em_registos_da_travessia", sum(1 for i in NOVE if any(i in r for r in regs.values())), "ledger/cruzamentos/*.json · as chaves de rows",
       "uma linha cruzada conhecida dos domínios (abrantes-ganho-medio-mensal-2024) é achada", any("abrantes-ganho-medio-mensal-2024" in r for r in regs.values()))
medida("divida_das_familias_ue_em_registos_da_travessia", sum(1 for r in regs.values() if "divida-das-familias-2025-ue" in r), "ledger/cruzamentos/*.json · as chaves de rows",
       "uma linha cruzada conhecida dos domínios é achada", any("abrantes-ganho-medio-mensal-2024" in r for r in regs.values()))
geradores = [l.get("gerador_da_linha") for l in (mot.get("releitura") or {}).get("linhas", [])]
medida("das_nove_do_gerador_enquadramento", geradores.count("enquadramento.py"), "motor/motor-c2.json · releitura.linhas[].gerador_da_linha (o cabeçalho de cada linha)", "a soma dos dois geradores é nove", geradores.count("enquadramento.py") + geradores.count("generate_claims.py") == 9)
medida("das_nove_do_gerador_generate_claims", geradores.count("generate_claims.py"), "motor/motor-c2.json · releitura.linhas[].gerador_da_linha", "a soma dos dois geradores é nove", geradores.count("enquadramento.py") + geradores.count("generate_claims.py") == 9)
medida("das_nove_com_cadeia_do_excerto_na_base", sum(1 for i in NOVE if any(c.get("kind") == "proveniencia" and c.get("field") == "excerpt" for c in (_base[i].get("corrections") or []))),
       "git show 3a253f73:ledger/claims/<as nove>.yml · uma entrada proveniencia sobre excerpt", "o custo unitário do trabalho de 2024 tinha-a", any(c.get("field") == "excerpt" for c in _base["custo-unitario-do-trabalho-2024"].get("corrections") or []))
alarmes = (mot.get("painel_do_fim") or {}).get("alarmes_do_relatorio") or []
medida("alarmes_do_painel_da_estrutura", sum(1 for a in alarmes if a["canary"] == "structure"), "motor/motor-c2.json · painel_do_fim.alarmes_do_relatorio, canary structure", "o relatório tem alarmes", len(alarmes) > 0)
medida("alarmes_do_painel_do_vigia_da_comissao", sum(1 for a in alarmes if a["canary"] == "threshold"), "motor/motor-c2.json · painel_do_fim.alarmes_do_relatorio, canary threshold", "o relatório tem alarmes", len(alarmes) > 0)
medida("alarmes_do_painel_sobre_as_nove", sum(1 for a in alarmes if a["id"] in NOVE and a["canary"] != "structure"), "motor/motor-c2.json · os alarmes de uma das nove que não são da estrutura da unidade", "o relatório tem alarmes", len(alarmes) > 0)
la = j("leituras-antes.json") or {}
medida("leituras_declaradas_lidas", la.get("leituras_lidas", NAO), "leituras-antes.json · leituras_lidas", "o PIB real por habitante está entre os cartões achados", (la.get("conhecido_positivo") or {}).get("encontrado"))
com_pub = [l for l in todas if l.get("published_at")]
medida("linhas_com_published_at", len(com_pub), "ledger/claims/*.yml · published_at", "há linhas com o campo", len(com_pub) > 0)
medida("linhas_do_estudo_com_published_at", sum(1 for l in com_pub if l.get("study") == "quadro-institucional"), "as da medida anterior do estudo quadro-institucional", "o campo lê-se nas linhas dos domínios", any(l.get("study") == "dominios-2026" for l in com_pub))

# ------------------------------------------------------------------ a contagem das revisões de proveniência
def _proveniencias(textos):
    return sum(sum(1 for c in (yaml.safe_load(x) or {}).get("corrections") or [] if c.get("kind") == "proveniencia") for x in textos)
_nomes = git("ls-tree", "--name-only", "3a253f73", "ledger/claims/").split()
na_base = _proveniencias(git("show", f"3a253f73:{n}") for n in _nomes)
agora = _proveniencias(open(f, encoding="utf-8").read() for f in sorted(glob.glob("ledger/claims/*.yml")))
medida("revisoes_de_proveniencia_no_livro_na_base", na_base, "git show 3a253f73:ledger/claims/<linha>.yml · as entradas de corrections com kind proveniencia",
       "a dívida das famílias da União tem uma na base", "kind: proveniencia" in git("show", "3a253f73:ledger/claims/divida-das-familias-2025-ue.yml"))
medida("revisoes_de_proveniencia_no_livro_agora", agora, "ledger/claims/*.yml · as entradas de corrections com kind proveniencia", "a soma cresce com as do bloco", agora > na_base)
medida("revisoes_de_proveniencia_novas_do_bloco", sum(1 for x in (ap.get("linhas") or []) for e in x["entradas_novas"] if e["kind"] == "proveniencia"),
       "aplicacao.json · as entradas novas com kind proveniencia", "a aplicação tem entradas novas", bool(ap.get("linhas")))
_html = open("dist/correcoes/index.html", encoding="utf-8").read() if os.path.isfile("dist/correcoes/index.html") else ""
_m = re.search(r'data-prova="revisoes_de_proveniencia"[^>]*>(\d+)<', _html)
medida("revisoes_de_proveniencia_na_pagina_das_correcoes", int(_m.group(1)) if _m else NAO, "dist/correcoes/index.html · o valor de data-prova=\"revisoes_de_proveniencia\"",
       "a página das correções tem a contagem", bool(_m))

# ------------------------------------------------------------------ as frases
lc = j("leituras-comparadas.json") or {}
for chave in ("cartoes", "leituras_comparadas", "leituras_com_texto_mudado", "leituras_com_valores_da_regua_mudados", "ramos_lidos", "ramos_que_mudaram_de_sentido"):
    medida(f"leituras_{chave}", lc.get(chave, NAO), f"leituras-comparadas.json · {chave} (leituras-c2.mjs antes, depois e comparar)",
           "o comparador vê um ramo trocado numa planta, e os valores mudados", (lc.get("conhecido_positivo") or {}).get("encontrado"))
medida("leituras_ramos_vistos_na_planta", (lc.get("conhecido_positivo") or {}).get("ramos_vistos_na_planta", NAO), "leituras-comparadas.json · conhecido_positivo.ramos_vistos_na_planta",
       "a planta troca um ramo", (lc.get("conhecido_positivo") or {}).get("ramos_vistos_na_planta") == 1)

# ------------------------------------------------------------------ o vigia da Comissão
lim = j("limiar-da-comissao.json") or {}
medida("limiar_linhas_que_sairam", len(lim.get("linhas_que_sairam", [])) if lim else NAO, "limiar-da-comissao.json · linhas_que_sairam", "as impressões refeitas batem com os dois estados", (lim.get("conhecido_positivo") or {}).get("encontrado"))
medida("limiar_linhas_que_entraram", len(lim.get("linhas_que_entraram", [])) if lim else NAO, "limiar-da-comissao.json · linhas_que_entraram", "as impressões refeitas batem com os dois estados", (lim.get("conhecido_positivo") or {}).get("encontrado"))
medida("limiar_linhas_com_algarismos", lim.get("linhas_com_algarismos_de_hoje", NAO), "limiar-da-comissao.json · linhas_com_algarismos_de_hoje", "a página tem linhas com algarismos", (lim.get("linhas_com_algarismos_de_hoje") or 0) > 0)

# ------------------------------------------------------------------ as páginas, os recibos e as capturas
pg = j("paginas-c2.json") or {}
for chave in ("paginas_html_na_base", "paginas_html_na_cabeca", "paginas_comuns", "paginas_iguais_byte_a_byte", "paginas_iguais_sem_a_construcao", "paginas_que_mudaram",
              "recibos_das_nove_que_mudaram", "outros_ficheiros_comuns_iguais", "outros_ficheiros_que_mudaram"):
    medida(f"paginas_{chave}", pg.get(chave, NAO), f"paginas-c2.json · {chave} (paginas-c2.mjs sobre as duas exportações)", "o recibo do PIB de 2025 mudou e cita a sua linha", (pg.get("conhecido_positivo") or {}).get("encontrado"))
for chave in ("paginas_novas", "paginas_que_sairam", "paginas_que_mudaram_por_outra_razao", "outros_ficheiros_que_mudaram_por_outra_razao"):
    medida(f"paginas_{chave}", len(pg[chave]) if chave in pg else NAO, f"paginas-c2.json · {chave}", "o recibo do PIB de 2025 mudou e cita a sua linha", (pg.get("conhecido_positivo") or {}).get("encontrado"))
for razao, n in (pg.get("paginas_que_mudaram_por_razao") or {}).items():
    medida("paginas_que_mudaram_porque_" + razao.replace(" ", "_"), n, "paginas-c2.json · paginas_que_mudaram_por_razao", "a razão é uma das três", razao in ("cita uma das nove linhas", "lista de mudanças", "outra"))
for fam, n in (pg.get("paginas_que_mudaram_por_familia") or {}).items():
    medida("paginas_que_mudaram_da_familia_" + re.sub(r"\W+", "_", fam).strip("_"), n, "paginas-c2.json · paginas_que_mudaram_por_familia", "a família lê-se do caminho", True)
_met = next((x for x in pg.get("paginas_que_mudaram_por_outra_razao", []) if x["ficheiro"] == "metodo/index.html"), None)
def _contagem(t):
    _x = re.search(r'data-prova="releituras_registadas">([\d\s  ]+)<', t or "")
    return int(re.sub(r"\D", "", _x.group(1))) if _x else None
medida("releituras_registadas_no_metodo_antes", _contagem(_met["base"]) if _met else NAO, "paginas-c2.json · a primeira diferença de metodo/index.html, o valor de data-prova=\"releituras_registadas\" na base",
       "a diferença do Método foi registada", bool(_met))
medida("releituras_registadas_no_metodo_depois", _contagem(_met["cabeca"]) if _met else NAO, "paginas-c2.json · o mesmo valor na cabeça do código",
       "a diferença do Método foi registada", bool(_met))
_rec = [x["ficheiro"] for x in pg.get("paginas_que_mudaram_lista", []) if x["familia"] == "recibo de uma linha"]
medida("recibos_de_fora_das_nove_que_mudaram", sum(1 for f in _rec if not any(f"/{i}/" in f for i in NOVE)), "paginas-c2.json · os recibos que mudaram e não são de uma das nove",
       "o recibo do custo unitário do trabalho de 2025 está entre eles", any("/custo-unitario-do-trabalho-2025/" in f for f in _rec))
_ind = open("dist/indice/index.html", encoding="utf-8").read() if os.path.isfile("dist/indice/index.html") else ""
_itens = re.findall(r'<li[^>]*data-mudanca="correcao"[^>]*>.*?</li>', _ind, re.S)
_ids_ind = [(re.findall(r'data-(?:correcao-)?claim="([a-z0-9-]+)"', x) or [""])[0] for x in _itens]
medida("linhas_na_lista_o_que_mudou_do_indice", len(_itens) if _ind else NAO, "dist/indice/index.html · os itens data-mudanca=\"correcao\" (a construção da cabeça do código)",
       "o custo unitário do trabalho de 2024 está na lista", "custo-unitario-do-trabalho-2024" in _ids_ind)
medida("das_nove_na_lista_o_que_mudou_do_indice", sum(1 for i in _ids_ind if i in NOVE) if _ind else NAO, "as nove entre os itens da medida anterior",
       "o custo unitário do trabalho de 2024 está na lista", "custo-unitario-do-trabalho-2024" in _ids_ind)
_reg = open("dist/correcoes/index.html", encoding="utf-8").read() if os.path.isfile("dist/correcoes/index.html") else ""
medida("das_nove_no_registo_das_correcoes", sum(1 for i in NOVE if f'"{i}"' in _reg) if _reg else NAO, "dist/correcoes/index.html · as nove citadas pelo identificador",
       "a dívida das famílias da União está no registo", '"divida-das-familias-2025-ue"' in _reg)
rc = j("recibos-c2.json") or {}
medida("recibos_lidos", rc.get("recibos_lidos", NAO), "recibos-c2.json (recibos-c2.mjs sobre o dist da cabeça do código)", "num recibo estragado em memória a porta da atualização deixa de se achar", (rc.get("conhecido_positivo") or {}).get("encontrado"))
medida("recibos_certos", rc.get("recibos_certos", NAO), "recibos-c2.json", "num recibo estragado em memória a porta da atualização deixa de se achar", (rc.get("conhecido_positivo") or {}).get("encontrado"))
for modo in ("antes", "depois"):
    c = j(f"capturas-{modo}.json") or {}
    medida(f"capturas_{modo}", c.get("capturas", NAO), f"capturas-{modo}.json (captar-c2.mjs {modo})", "há capturas nas cinco larguras e nas duas edições", c.get("capturas") == 40)
    medida(f"problemas_nas_capturas_{modo}", len(c["problemas"]) if "problemas" in c else NAO, f"capturas-{modo}.json · problemas", "o captor mede transbordo e o título", "resultados" in c)
    medida(f"pedidos_para_fora_nas_capturas_{modo}", c.get("pedidos_recusados_para_fora", NAO), f"capturas-{modo}.json · pedidos_recusados_para_fora", "o captor recusa o que não é local", "resultados" in c)
    ver = sorted({tuple(r["medidas"].get("veredicto_medidas") or []) for r in c.get("resultados", []) if r["pagina"] == "primeira-pagina"})
    medida(f"veredicto_da_primeira_pagina_formas_{modo}", len(ver) if c else NAO, f"capturas-{modo}.json · as listas das medidas fora no veredicto, distintas, nas duas edições e nas cinco larguras",
           "a posição de investimento internacional está entre as medidas fora", any("posicao-de-investimento-internacional-2025" in v for v in ver))
ca, cd = j("capturas-antes.json") or {}, j("capturas-depois.json") or {}
va = {tuple(r["medidas"].get("veredicto_medidas") or []) for r in ca.get("resultados", []) if r["pagina"] == "primeira-pagina"}
vd = {tuple(r["medidas"].get("veredicto_medidas") or []) for r in cd.get("resultados", []) if r["pagina"] == "primeira-pagina"}
medida("medidas_fora_no_veredicto", len(next(iter(vd))) if len(vd) == 1 else NAO, "capturas-depois.json · veredicto_medidas da primeira página", "as listas de antes e de depois são iguais", va == vd and len(vd) == 1)

# ------------------------------------------------------------------ as plantas, o mapa, os portões e o custo
pl = j("plantas-pais.json") or []
medida("plantas_do_check_pais", len(pl) if pl else NAO, "node tests/pais/pais.mjs --json plantas-pais.json", "a planta das páginas sem estrago passa a 0", any(p["nome"] == "páginas sem estrago" and p["passou"] for p in pl))
medida("plantas_do_check_pais_certas", sum(1 for p in pl if p["passou"]) if pl else NAO, "plantas-pais.json · passou", "a planta das páginas sem estrago passa a 0", any(p["nome"] == "páginas sem estrago" and p["passou"] for p in pl))
# C2-b (a leitura a frio do Astra): o filtro contava duas das três plantas novas; são três, pelo nome.
PLANTAS_DO_C2 = ("linha de Portugal declarada da União", "agregado da União declarado de Portugal", "pedido de várias geografias declarado de Portugal")
medida("plantas_novas_do_c2_que_morderam", sum(1 for p in pl if p["passou"] and p["nome"] in PLANTAS_DO_C2) if pl else NAO,
       "plantas-pais.json · as três plantas do C2, pelo nome", "as três estão no ficheiro, uma vez cada", sorted(p["nome"] for p in pl if p["nome"] in PLANTAS_DO_C2) == sorted(PLANTAS_DO_C2))
mapa, base = txt("conferir-mapa.txt") or "", txt("conferir-mapa-base.txt") or ""
for nome, t in (("mapa", mapa), ("mapa_na_base", base)):
    m = re.search(r"na linha citada \(±7\): (\d+)", t)
    longe = re.search(r"longe da linha citada: (\d+)", t)
    fora = re.search(r"não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)", t)
    medida(f"citacoes_do_{nome}_na_linha", int(m.group(1)) if m else NAO, f"python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md", "o guião escreveu as três contagens", bool(m and longe and fora))
    medida(f"citacoes_do_{nome}_longe", int(longe.group(1)) if longe else NAO, "conferir-mapa.py · longe da linha citada", "o guião escreveu as três contagens", bool(m and longe and fora))
    medida(f"citacoes_do_{nome}_por_achar", int(fora.group(1)) if fora else NAO, "conferir-mapa.py · não encontrada", "o guião escreveu as três contagens", bool(m and longe and fora))
_janela = re.search(r"na linha citada \(±(\d+)\)", mapa)
medida("janela_do_conferidor_do_mapa", int(_janela.group(1)) if _janela else NAO, "conferir-mapa.txt · «na linha citada (±N)», a janela de linhas do conferir-mapa.py",
       "a mesma linha tem a contagem das citações", bool(_janela and re.search(r"\(±\d+\): \d+", mapa)))
cab = txt("portoes/cabeca")
for g in ("build", "verify", "typecheck"):
    v, i, f = txt(f"portoes/{g}.codigo"), txt(f"portoes/{g}.inicio"), txt(f"portoes/{g}.fim")
    medida(f"codigo_do_{g}", int(v) if v is not None else NAO, f"sh scripts/leituras/portoes.sh <worktree> {PASTA}/portoes · portoes/{g}.codigo", "o código foi escrito depois do processo", v is not None)
    medida(f"segundos_do_{g}", segundos(i, f) if i and f else NAO, f"portoes/{g}.inicio e portoes/{g}.fim", "as duas horas existem", bool(i and f))
blog = txt("portoes/build.log") or ""
hp = re.search(r'\{"controlos":(\d+),"plantas":(\d+),"controlos_integros":(\d+),"plantas_mordidas":(\d+)\}', blog)
medida("plantas_da_celula_da_historia_da_proveniencia", int(hp.group(2)) if hp else NAO, "portoes/build.log · a linha de tests/linha/historia-da-proveniencia.mjs no ledger:check", "a célula escreveu as suas contagens", bool(hp))
medida("plantas_mordidas_da_celula_da_historia_da_proveniencia", int(hp.group(4)) if hp else NAO, "portoes/build.log · plantas_mordidas", "a célula escreveu as suas contagens", bool(hp))
hv = re.search(r"História do valor: (\d+) controlos e (\d+) plantas", blog)
medida("plantas_da_historia_do_valor", int(hv.group(2)) if hv else NAO, "portoes/build.log · «História do valor: N controlos e M plantas»", "a célula escreveu a linha", bool(hv))
cd = re.search(r"casas decimais do excerto · (\d+) linha\(s\) lida\(s\).*?(\d+) planta\(s\), (\d+) certa\(s\)", blog)
medida("plantas_das_casas_decimais", int(cd.group(2)) if cd else NAO, "portoes/build.log · a linha das casas decimais do excerto", "a célula escreveu a linha", bool(cd))
medida("plantas_certas_das_casas_decimais", int(cd.group(3)) if cd else NAO, "portoes/build.log · a linha das casas decimais do excerto", "a célula escreveu a linha", bool(cd))
m = re.search(r"(\d+) page\(s\) built", blog)
medida("paginas_construidas_pelo_build", int(m.group(1)) if m else NAO, "portoes/build.log · «N page(s) built»", "o registo do astro tem a linha", bool(m))
medida("cabeca_dos_portoes_igual_no_fim", cab == txt("portoes/cabeca.fim") if cab else NAO, "portoes/cabeca e portoes/cabeca.fim", "as duas cabeças foram escritas", bool(cab and txt("portoes/cabeca.fim")))
est = txt("portoes/estado.fim")
medida("ficheiros_sujos_no_fim_dos_portoes", len([l for l in (est or "").splitlines() if l.strip() and not l.startswith("??")]) if est is not None else NAO,
       "portoes/estado.fim · git status --short, sem os por seguir", "o estado foi escrito", est is not None)
# a primeira corrida dos portões (b72e639d), o inventário dos rótulos e as duas conferências corridas à parte
for g in ("build", "verify", "typecheck"):
    v = txt(f"portoes-b72e639d/{g}.codigo")
    medida(f"codigo_do_{g}_na_primeira_corrida", int(v) if v is not None else NAO, f"portoes-b72e639d/{g}.codigo (scripts/leituras/portoes.sh na cabeça b72e639d)", "o código foi escrito", v is not None)
vl = txt("portoes-b72e639d/verify.log") or ""
_r = re.search(r"(\d+) diferença\(s\)", vl[vl.find("check:rotulos"):]) if "check:rotulos" in vl else None
medida("diferencas_do_check_rotulos_na_primeira_corrida", int(_r.group(1)) if _r else NAO, "portoes-b72e639d/verify.log · «N diferença(s)» na saída do check:rotulos", "a saída do check:rotulos está no registo", bool(_r))
medida("queixas_do_check_rotulos_na_primeira_corrida", vl.count("R2-declarado · ") if vl else NAO, "portoes-b72e639d/verify.log · as linhas R2-declarado", "a saída do check:rotulos está no registo", "check:rotulos" in vl)
cr = txt("check-rotulos-depois-de-escrever.log") or ""
_r2 = re.search(r"(\d+) diferença\(s\)", cr)
medida("diferencas_do_check_rotulos_depois_de_reescrever", int(_r2.group(1)) if _r2 else NAO, "npm run check:rotulos > check-rotulos-depois-de-escrever.log", "a saída tem a contagem das diferenças", bool(_r2))
_d = git("diff", "fdd7ec9a~1", "fdd7ec9a", "--", "design/especime-v3/rotulos/INVENTARIO.json").splitlines()
_tir = [l for l in _d if l.startswith("-") and not l.startswith("---")]
_pos = [l for l in _d if l.startswith("+") and not l.startswith("+++")]
medida("formas_da_regua_tiradas_do_inventario", sum(1 for l in _tir if "provis" in l), "git diff fdd7ec9a~1 fdd7ec9a -- design/especime-v3/rotulos/INVENTARIO.json · as linhas tiradas com a marca", "o diff tira linhas", len(_tir) > 0)
medida("linhas_mudadas_no_inventario_dos_rotulos", len(_tir), "o mesmo diff · as linhas tiradas (as formas e a cabeça da construção)", "o diff acrescenta tantas quantas tira", len(_tir) == len(_pos))
for nome in ("check-series-na-b72e639d", "check-indice-do-sitio-na-b72e639d", "rotulos-escrever", "check-rotulos-depois-de-escrever", "plantas-pais-antes"):
    v = txt(f"{nome}.codigo")
    medida("codigo_" + nome.replace("-", "_"), int(v) if v is not None else NAO, f"{nome}.codigo", "o código foi escrito", v is not None)
pa = txt("plantas-pais-antes.log") or ""
medida("o_executor_da_base_rebenta_por_falta_do_carimbo", int("version.json" in pa and "páginas sem estrago" in pa) if pa else NAO, "plantas-pais-antes.log · a queixa ENOENT do version.json na prova das páginas sem estrago",
       "o registo do executor da base existe", bool(pa))

# C2-b: o published_at das nove, do carimbo do corpo alojado
pa = j("aplicacao-published-at.json") or {}
for chave in ("linhas", "aplicadas", "dias_iguais_ao_dia_utc", "com_o_dia_2026_10_02", "com_o_dia_2026_09_29", "plantas", "plantas_que_morderam"):
    medida(f"published_at_{chave}", (pa.get("contagens") or {}).get(chave, NAO), f"aplicacao-published-at.json · contagens.{chave} (aplicar-releituras.py --published-at --aplicar)",
           "o passo leu as nove linhas", (pa.get("contagens") or {}).get("linhas") == 9)
_agora = [yaml.safe_load(open(f"ledger/claims/{i}.yml", encoding="utf-8")) for i in NOVE]
medida("das_nove_com_published_at", sum(1 for l in _agora if l.get("published_at")), "ledger/claims/<as nove>.yml · published_at", "a despesa em I&D da União tem 2026-09-29",
       any(l["id"] == "despesa-em-id-2024-ue" and l.get("published_at") == "2026-09-29" for l in _agora))
_antes_da_passagem = [yaml.safe_load(git("show", f"4aa588ce:ledger/claims/{i}.yml")) for i in NOVE]
medida("das_nove_com_published_at_antes_da_passagem", sum(1 for l in _antes_da_passagem if l.get("published_at")), "git show 4aa588ce:ledger/claims/<as nove>.yml · published_at (a primeira entrega)",
       "as nove leem-se nessa cabeça", len(_antes_da_passagem) == 9)
_hist_igual = open("ledger/historias-valores.json", "rb").read() == subprocess.check_output(["git", "show", "8dbdcac2:ledger/historias-valores.json"])
medida("registo_das_historias_igual_ao_de_8dbdcac2", int(_hist_igual), "ledger/historias-valores.json contra git show 8dbdcac2:ledger/historias-valores.json, byte a byte (1 é igual)",
       "o registo tem as histórias das nove", all(i in json.load(open("ledger/historias-valores.json", encoding="utf-8")) for i in NOVE))
# C2-b: o que mudou entre a cabeça do código da primeira entrega e a da passagem, fora das duas pastas das provas.
_fora = [":(exclude)" + PASTA, ":(exclude)design/especime-v3/capturas/c2-2026-10-05"]
_ns = [l.split("\t") for l in git("diff", "--numstat", "57be3c40", "82406f85", "--", ".", *_fora).splitlines() if l.strip()]
_ns_tudo = [l.split("\t") for l in git("diff", "--numstat", "57be3c40", "82406f85").splitlines() if l.strip()]
medida("ficheiros_mudados_fora_das_provas_de_57be3c40_a_82406f85", len(_ns),
       "git diff --numstat 57be3c40 82406f85 -- . ':(exclude)<a pasta das medições>' ':(exclude)<a pasta das capturas>'",
       "sem as exclusões, o mesmo intervalo tem ficheiros das pastas das provas", any(x[2].startswith(PASTA + "/") for x in _ns_tudo))
medida("desses_os_que_sao_das_nove_linhas", sum(1 for x in _ns if x[2] in {f"ledger/claims/{i}.yml" for i in NOVE}), "o mesmo diff · os caminhos ledger/claims/<as nove>.yml",
       "a despesa em I&D da União está no diff", any(x[2] == "ledger/claims/despesa-em-id-2024-ue.yml" for x in _ns))
medida("linhas_acrescentadas_fora_das_provas_de_57be3c40_a_82406f85", sum(int(x[0]) for x in _ns), "o mesmo diff · a soma da coluna das linhas acrescentadas",
       "cada ficheiro do diff traz o seu número", all(x[0].isdigit() for x in _ns))
medida("linhas_tiradas_fora_das_provas_de_57be3c40_a_82406f85", sum(int(x[1]) for x in _ns), "o mesmo diff · a soma da coluna das linhas tiradas",
       "cada ficheiro do diff traz o seu número", all(x[1].isdigit() for x in _ns))
medida("desses_os_com_uma_linha_acrescentada_e_nenhuma_tirada", sum(1 for x in _ns if x[0] == "1" and x[1] == "0"), "o mesmo diff · os ficheiros com 1 linha acrescentada e 0 tiradas",
       "o diff do commit 4aa588ce (as provas da primeira entrega, git diff --numstat 4aa588ce^ 4aa588ce) tem ficheiros com mais de 1 linha mudada",
       any(x[0].isdigit() and int(x[0]) + int(x[1]) > 1 for x in (l.split("\t") for l in git("diff", "--numstat", "4aa588ce^", "4aa588ce").splitlines() if l.strip())))
for nome in ("aplicar-published-at", "ledger-check-3", "build-c2b"):
    v = txt(f"{nome}.codigo")
    medida("codigo_" + nome.replace("-", "_"), int(v) if v is not None else NAO, f"{nome}.codigo", "o código foi escrito", v is not None)
_l3 = re.search(r"(\d+) afirmações válidas", txt("ledger-check-3.log") or "")
medida("afirmacoes_validas_no_ledger_check_3", int(_l3.group(1)) if _l3 else NAO, "ledger-check-3.log · «N afirmações válidas»", "o registo tem a linha", bool(_l3))
medida("recibos_com_o_dia_da_publicacao", sum(1 for x in rc.get("recibos", []) if (x.get("ok") or {}).get("published_at_no_recibo")) if rc else NAO,
       "recibos-c2.json · ok.published_at_no_recibo", "num recibo estragado em memória o dia trocado não passa", (rc.get("conhecido_positivo") or {}).get("encontrado"))
_bc = txt("build-c2b.log") or ""
_pv = re.search(r"versão · ([0-9a-f]{7})", _bc)
medida("build_c2b_na_cabeca_do_codigo", int(bool(_pv) and git("rev-parse", "--short=7", "82406f85") == _pv.group(1)), "build-c2b.log · «versão · <commit>», contra 82406f85 (1 é a mesma)",
       "o registo tem a linha da versão", bool(_pv))

cu = j("custo-c2.json") or {}
medida("simbolos_do_bloco", cu.get("simbolos_gastos", NAO), "python3 custo-c2.py <registo da sessão do construtor>", "a primeira leitura é o total da sessão e as leituras descem", (cu.get("conhecido_positivo") or {}).get("encontrado"))
medida("segundos_do_bloco", cu.get("segundos_entre_as_leituras", NAO), "custo-c2.json · segundos_entre_as_leituras", "a primeira leitura é o total da sessão e as leituras descem", (cu.get("conhecido_positivo") or {}).get("encontrado"))
medida("subagentes_do_bloco", cu.get("subagentes", NAO), "custo-c2.json · subagentes", "o contador das chamadas acha as do Bash", (cu.get("conhecido_positivo_das_chamadas") or {}).get("encontrado"))
cb = j("custo-c2b.json") or {}
medida("simbolos_da_passagem_c2b", cb.get("simbolos_gastos", NAO), "python3 custo-c2.py <registo da sessão> --desde <a hora da mensagem do lugar de direção> --saida custo-c2b.json",
       "as leituras da passagem descem, e a primeira é posterior à hora dada", (cb.get("conhecido_positivo") or {}).get("encontrado"))
medida("segundos_da_passagem_c2b", cb.get("segundos_entre_as_leituras", NAO), "custo-c2b.json · segundos_entre_as_leituras",
       "as leituras da passagem descem, e a primeira é posterior à hora dada", (cb.get("conhecido_positivo") or {}).get("encontrado"))

saida = {"_": "Escrito por design/especime-v3/medicoes/c2-2026-10-05/medir-c2.py. Não se edita à mão.",
         "cabeca": git("rev-parse", "HEAD"), "medidas": medidas,
         "nao_lidas": [m["nome"] for m in medidas if m["valor"] == NAO],
         "sem_conhecido_positivo": [m["nome"] for m in medidas if not m["conhecido_positivo"]["encontrado"]]}
with open(os.path.join(PASTA, "medidas.json"), "w", encoding="utf-8") as f:
    json.dump(saida, f, ensure_ascii=False, indent=2)
    f.write("\n")
print(f"medir-c2: {len(medidas)} medidas, {len(saida['nao_lidas'])} por ler, {len(saida['sem_conhecido_positivo'])} sem conhecido-positivo")
for n in saida["nao_lidas"] + saida["sem_conhecido_positivo"]:
    print("  ·", n)
raise SystemExit(1 if saida["nao_lidas"] or saida["sem_conhecido_positivo"] else 0)
