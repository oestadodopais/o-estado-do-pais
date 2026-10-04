#!/usr/bin/env python3
"""O §0 do brief H2 (a passagem de higiene de 04.10.2026), medido sobre a cabeça presa do sítio (905105b7).
Lê só o repositório, pela cabeça presa (`git show`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-H2.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "905105b7"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


home = mostrar("src/views/HomeView.astro") or ""
m = re.search(r"estudosRecentes\(lang\)\.slice\(0, (\d+)\)", home)
medicao("estudos_recentes_na_primeira_pagina", int(m.group(1)) if m else NAO,
        f"git show {CAB}:src/views/HomeView.astro · o corte de estudosRecentes(lang).slice(0, N)",
        "a chamada a estudosRecentes existe", "estudosRecentes(" in home)

studies = mostrar("src/data/studies.mjs") or ""
blocos = re.split(r"\n  \{\n    id: '", studies)[1:]
sem_sucessor = [b for b in blocos if "sucedidoPor:" not in b.split("\n  },")[0]]
datados_01_10 = [b for b in sem_sucessor if "date: '2026-10-01'" in b.split("\n  },")[0]]
medicao("estudos_sem_sucessor", len(sem_sucessor) if studies else NAO,
        f"git show {CAB}:src/data/studies.mjs · as entradas de WORKS sem o campo sucedidoPor",
        "o estudo de Évora 2027 é um deles", any(b.startswith("evora-2027-capital-europeia-da-cultura") for b in sem_sucessor))
medicao("estudos_sem_sucessor_datados_a_01_10_2026", len(datados_01_10) if studies else NAO,
        f"git show {CAB}:src/data/studies.mjs · dessas entradas, as que têm uma edição com date: '2026-10-01'",
        "o estudo de Évora 2027 é um deles", any(b.startswith("evora-2027-capital-europeia-da-cultura") for b in datados_01_10))
medicao("estudos_com_campo_em_curso", len(re.findall(r"\n    emCurso:", studies)) if studies else NAO,
        f"git show {CAB}:src/data/studies.mjs · as entradas com o campo emCurso (que o H2 cria)",
        "o campo pergunta existe, para o padrão funcionar", bool(re.search(r"\n    pergunta:", studies)))

area = mostrar("src/views/AreaView.astro") or ""
medicao("chamadas_a_routePath_texto_na_pagina_da_area", len(re.findall(r"routePath\(\s*'texto'", area)) if area else NAO,
        f"git show {CAB}:src/views/AreaView.astro · as chamadas routePath('texto', …)",
        "a vista chama routePath", "routePath(" in area)

estudos_view = mostrar("src/views/EstudosView.astro") or ""
medicao("portas_que_embrulham_o_titulo_na_lista_dos_estudos", len(re.findall(r'<a class="arquivo-porta" href=\{e\.rota\}><TituloDeTrabalho', estudos_view)) if estudos_view else NAO,
        f"git show {CAB}:src/views/EstudosView.astro · as portas <a class=\"arquivo-porta\"> que embrulham o TituloDeTrabalho",
        "a vista importa o TituloDeTrabalho", "TituloDeTrabalho" in estudos_view)

gate = mostrar("scripts/gate-html.mjs") or ""
fn = re.search(r"function existeConstruido\(caminho\) \{.*?\n\}", gate, re.S)
medicao("existeConstruido_aceita_o_ficheiro_html_irmao", (1 if "limpo + '.html'" in fn.group(0) else 0) if fn else NAO,
        f"git show {CAB}:scripts/gate-html.mjs · a função existeConstruido() aceita CONSTRUIDOS.has(limpo + '.html')",
        "a função existe", bool(fn))

lugar = mostrar("scripts/check-lugar.mjs") or ""
medicao("isencoes_json_indicador_na_check_lugar", len(re.findall(r"padrao: /www\\\.ine\\\.pt\\/ine\\/json_indicador\\//", lugar)) if lugar else NAO,
        f"git show {CAB}:scripts/check-lugar.mjs · as isenções com o padrão json_indicador",
        "a palavra «indicador» está nas contas da régua", "'indicador'" in lugar)

vdb = mostrar("scripts/verify-depois-do-build.mjs") or ""
medicao("plantas_da_copia_com_a_mesma_hora_no_verify_depois_do_build", len(re.findall(r"mesma hora de escrita fecha a célula D", vdb)) if vdb else NAO,
        f"git show {CAB}:scripts/verify-depois-do-build.mjs · a planta «uma cópia com os mesmos bytes e a mesma hora de escrita fecha a célula D»",
        "a célula D existe", "célula D" in vdb)

pacote = mostrar("scripts/leituras/pacote.sh") or ""
medicao("variaveis_PACOTE_RETIRA_e_PACOTE_MOTOR_no_pacote_sh", len(re.findall(r"PACOTE_RETIRA|PACOTE_MOTOR", pacote)) if pacote else NAO,
        f"git show {CAB}:scripts/leituras/pacote.sh · as ocorrências de PACOTE_RETIRA e PACOTE_MOTOR",
        "a variável PACOTE_EXTRA, que já existe, está no guião", "PACOTE_EXTRA" in pacote)

issues = mostrar("design/especime-v3/ISSUES.md") or ""
medicao("questoes_I190_a_I194_abertas", sum(1 for n in range(190, 195) if re.search(rf"^\| I{n} \|.*\*\*aberta\*\*", issues, re.M)) if issues else NAO,
        f"git show {CAB}:design/especime-v3/ISSUES.md · as linhas I190 a I194 com o estado **aberta**",
        "a I190 está na lista", "| I190 |" in issues)

saida = {"brief": "design/observatorio/BRIEF-H2-a-passagem-de-higiene-de-04-10.md", "guiao": "design/observatorio/medidas/BRIEF-H2.py",
         "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-H2.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
