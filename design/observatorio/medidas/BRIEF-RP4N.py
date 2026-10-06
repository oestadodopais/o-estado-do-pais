#!/usr/bin/env python3
"""O §0 do brief RP4-n (selar na fonte o que as frases «o que é» ainda dizem pelo nome do projeto, e o resto do RP4-n), medido
sobre a cabeça presa do sítio (CAB). Lê só o repositório, pela cabeça presa (`git show`), nunca a árvore de trabalho
(§1.153). Escreve design/observatorio/medidas/BRIEF-RP4N.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o
comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "4b29f707"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def lista_exportada(texto, nome):
    i = texto.find("export const " + nome)
    if i < 0:
        return None
    j = texto.find("];", i)
    return re.findall(r'"([^"]+)"', texto[i:j]) + re.findall(r"'([^']+)'", texto[i:j])


familias = git("show", f"{CAB}:src/data/o-que-e-das-familias.mjs") or ""
linhas = lista_exportada(familias, "LINHAS_POR_CONFIRMAR_NA_FONTE")
medicao("linhas_com_a_frase_por_confirmar", len(linhas) if linhas is not None else NAO, f"git show {CAB}:src/data/o-que-e-das-familias.mjs · as entradas de LINHAS_POR_CONFIRMAR_NA_FONTE", "a linha da água não faturada está na lista", bool(linhas) and "agua-nao-faturada-portugal-2024" in linhas)
madeira = [l for l in (linhas or []) if "-desemprego-registado-" in l]
medicao("linhas_marcadas_do_desemprego_registado_da_madeira", len(madeira) if linhas is not None else NAO, "as linhas marcadas cujo id contém «-desemprego-registado-» (os concelhos da Madeira, pelo Instituto de Emprego da Madeira)", "a linha da Calheta é uma delas", "calheta-desemprego-registado-2025-12" in madeira)
oe = [l for l in (linhas or []) if l.startswith("oe-2026-")]
medicao("linhas_marcadas_do_orcamento_de_2026", len(oe) if linhas is not None else NAO, "as linhas marcadas cujo id começa por «oe-2026-»", "a linha dos cem euros da saúde é uma delas", "oe-2026-cem-euros-ministerio-saude" in oe)
execucao = [l for l in (linhas or []) if l.startswith("execucao-2026-")]
medicao("linhas_marcadas_da_execucao_de_2026", len(execucao) if linhas is not None else NAO, "as linhas marcadas cujo id começa por «execucao-2026-»", "a despesa efetiva de agosto é uma delas", "execucao-2026-08-despesa-efetiva-administracao-central" in execucao)
evora = [l for l in (linhas or []) if l.startswith("evora-")]
medicao("linhas_marcadas_de_evora", len(evora) if linhas is not None else NAO, "as linhas marcadas cujo id começa por «evora-»", "a linha das verbas do PRR pagas é uma delas", any(l.startswith("evora-prr-pago") for l in evora))
outras = [l for l in (linhas or []) if l not in madeira and l not in oe and l not in execucao and l not in evora]
medicao("linhas_marcadas_restantes", len(outras) if linhas is not None else NAO, "as linhas marcadas que não são de nenhum dos quatro grupos", "a linha da água não faturada é uma delas", "agua-nao-faturada-portugal-2024" in outras)
familias_outras = sorted({re.sub(r"-\d{4}(-\d{2})?(-\d{2})?$", "", l) for l in outras})
series_t = git("show", f"{CAB}:src/data/o-que-e-das-series.mjs") or ""
series = lista_exportada(series_t, "SERIES_POR_CONFIRMAR_NA_FONTE")
medicao("series_com_a_frase_por_confirmar", len(series) if series is not None else NAO, f"git show {CAB}:src/data/o-que-e-das-series.mjs · as entradas de SERIES_POR_CONFIRMAR_NA_FONTE", "a série das rendas está na lista", bool(series) and "serie-ihpc-rendas-variacao-homologa" in series)
do_eurostat = [s for s in (series or []) if s.startswith("serie-ihpc-") or s == "serie-precos-da-habitacao-variacao-homologa"]
medicao("series_marcadas_do_eurostat", len(do_eurostat) if series else NAO, "as séries marcadas cujo id começa por serie-ihpc- ou é a dos preços da habitação (as do Eurostat sem linha presa)", "a série dos combustíveis da União é uma delas", "serie-ihpc-combustiveis-variacao-homologa-ue" in do_eurostat)

try:
    provadas = json.loads(git("show", f"{CAB}:tests/cartao/leituras-provadas.json") or "null")
except json.JSONDecodeError:
    provadas = None


def apoios_pelo_nome(itens):
    n = 0
    for e in itens:
        for folha in e.get("folhas", []):
            for parte in folha.get("partes", []):
                if any("declaracao" in a for a in parte.get("apoios", [])):
                    n += 1
    return n


fam = (provadas or {}).get("familias") if isinstance(provadas, dict) else None
ser = (provadas or {}).get("series") if isinstance(provadas, dict) else None
ser_itens = ser if isinstance(ser, list) else (list(ser.values()) if isinstance(ser, dict) else None)
medicao("partes_apoiadas_no_nome_do_projeto_nas_familias", apoios_pelo_nome(fam) if isinstance(fam, list) else NAO, f"git show {CAB}:tests/cartao/leituras-provadas.json · as partes das famílias com um apoio «declaracao» (o nome que o projeto deu à linha)", "a auditoria tem 181 famílias", isinstance(fam, list) and len(fam) == 181)
medicao("partes_apoiadas_no_nome_do_projeto_nas_series", apoios_pelo_nome(ser_itens) if ser_itens is not None else NAO, f"git show {CAB}:tests/cartao/leituras-provadas.json · as partes das séries com um apoio «declaracao»", "a série das rendas tem auditoria", ser_itens is not None and any("serie-ihpc-rendas-variacao-homologa" in json.dumps(e) for e in ser_itens))

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-RP4N.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-RP4N-selar-na-fonte-o-que-as-frases-ainda-dizem-pelo-nome.md", "guiao": "design/observatorio/medidas/BRIEF-RP4N.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
print("as restantes, por família:", familias_outras)
