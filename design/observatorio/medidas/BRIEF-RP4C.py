#!/usr/bin/env python3
"""O §0 do brief RP4-c (as ajudas de leitura do gráfico das séries), medido sobre a cabeça presa do sítio (3a253f73).
Lê só o repositório, pela cabeça presa (`git show`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-RP4C.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "5b004ada"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


mod = mostrar("src/lib/formas/serie-do-pais.mjs") or ""
m = re.search(r">= (\d+) && campo\.direita - posicao >= (\d+)", mod)
medicao("pixeis_minimos_de_uma_marca_intermedia_do_tempo_as_pontas", int(m.group(1)) if m and m.group(1) == m.group(2) else NAO,
        f"git show {CAB}:src/lib/formas/serie-do-pais.mjs · a regra «posicao - campo.esquerda >= N && campo.direita - posicao >= N» das marcas intermédias do tempo",
        "o módulo constrói marcasX a partir dos anos", "marcasX = anos.map" in mod)
medicao("marcas_do_eixo_vertical_com_o_simbolo_da_unidade", len(re.findall(r"texto: `?\$\{[^}]*\}\s*%|'%'|\" %\"|' %'", mod)) if mod else NAO,
        f"git show {CAB}:src/lib/formas/serie-do-pais.mjs · as marcas do eixo vertical escritas com o símbolo «%»",
        "as marcas do eixo vertical existem (marcasY)", "marcasY" in mod)
medicao("linhas_de_referencia_no_modulo_da_forma", len(re.findall(r"referencia", mod)) if mod else NAO,
        f"git show {CAB}:src/lib/formas/serie-do-pais.mjs · as ocorrências de «referencia»",
        "o bloco das barras da primeira página desenha uma referência (a dívida a 60 %)", "referencia" in (mostrar("src/lib/primeira-pagina.mjs") or ""))
css = mostrar("src/styles/serie-do-pais.css") or ""
medicao("regras_de_passagem_ou_foco_na_folha_do_desenho", len(re.findall(r":hover|:focus", css)) if css else NAO,
        f"git show {CAB}:src/styles/serie-do-pais.css · as regras com :hover ou :focus",
        "a folha existe e estiliza a linha", "serie-do-pais-linha" in css)
comp = mostrar("src/components/formas/SerieDoPais.astro") or ""
medicao("etiquetas_de_valor_por_ponto_no_componente", len(re.findall(r"data-ponto=", comp)) if comp else NAO,
        f"git show {CAB}:src/components/formas/SerieDoPais.astro · os elementos com data-ponto (o valor de um ponto, como nos recibos)",
        "o componente desenha as polylines", "<polyline" in comp)
r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "--name-only", CAB, "ledger/claims/"], capture_output=True)
claims = r.stdout.decode().split() if r.returncode == 0 else []
derivadas = 0
for c in claims:
    t = mostrar(c) or ""
    if re.search(r"^derivation:\s*(?!null)\S", t, re.M): derivadas += 1
medicao("linhas_do_livro_com_derivation_nao_nula", derivadas if claims else NAO,
        f"git ls-tree {CAB} ledger/claims/ e git show de cada linha · as linhas cujo campo derivation não é null",
        "os cem euros da função 01 do OE1 são uma linha derivada", any(c.endswith("oe-2026-cem-euros-funcao-01.yml") for c in claims) and bool(re.search(r"^derivation:\s*(?!null)\S", mostrar("ledger/claims/oe-2026-cem-euros-funcao-01.yml") or "", re.M)))
ipc = mostrar("ledger/series/serie-ipc-variacao-homologa.yml") or ""
medicao("pontos_da_serie_da_inflacao", len(re.findall(r"^  - periodo:", ipc.split("\npontos:\n", 1)[1], re.M)) if "\npontos:\n" in ipc else NAO,
        f"git show {CAB}:ledger/series/serie-ipc-variacao-homologa.yml · as linhas «  - periodo:» da lista pontos:",
        "a série começa em 1992-01", re.search(r'^primeiro_periodo: "1992-01"', ipc, re.M) is not None)
leituras = (mostrar("src/data/leituras-rp1.mjs") or "") + (mostrar("src/data/leituras-das-medidas.mjs") or "")
medicao("mencoes_ao_banco_central_europeu_nas_leituras", leituras.count("Banco Central Europeu") if leituras else NAO,
        f"git show {CAB}:src/data/leituras-rp1.mjs e leituras-das-medidas.mjs · as ocorrências de «Banco Central Europeu»",
        "a leitura da comparação europeia diz que o Banco Central Europeu procura uma inflação", "procura uma inflação de" in leituras)
saida = {"brief": "design/observatorio/BRIEF-RP4C-as-ajudas-de-leitura-do-grafico.md", "guiao": "design/observatorio/medidas/BRIEF-RP4C.py",
         "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-RP4C.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
