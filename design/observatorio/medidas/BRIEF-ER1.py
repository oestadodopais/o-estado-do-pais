#!/usr/bin/env python3
"""O §0 do brief ER1 (o recibo incorporável), medido sobre a cabeça presa do sítio (CAB). Lê só o repositório, pela
cabeça presa (`git ls-tree`, `git show`, `git grep`), nunca a árvore de trabalho (§1.153). Escreve
design/observatorio/medidas/BRIEF-ER1.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada medição leva o comando e um
conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "6bc9b86b"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


claims = git("ls-tree", "--name-only", f"{CAB}:ledger/claims") or ""
n_claims = len([f for f in claims.split() if f.endswith(".yml")])
medicao("linhas_do_livro", n_claims if claims else NAO, f"git ls-tree {CAB}:ledger/claims · os .yml", "a linha da dívida de dois mil e vinte e cinco está na lista", "divida-publica-2025.yml" in claims.split())
series = git("ls-tree", "--name-only", f"{CAB}:ledger/series") or ""
medicao("series_do_livro", len([f for f in series.split() if f.endswith(".yml")]) if series else NAO, f"git ls-tree {CAB}:ledger/series · os .yml", "a série das rendas está na lista", "serie-ihpc-rendas-variacao-homologa.yml" in series.split())

lic = git("show", f"{CAB}:src/data/licenca.mjs") or ""
m = re.search(r"export const LICENCA = \{\s*nome: '([^']+)'", lic)
medicao("licencas_da_casa_decididas", 1 if m else (0 if lic else NAO), f"git show {CAB}:src/data/licenca.mjs · LICENCA com um nome, contada uma vez", "a licença é a CC BY 4.0 com a atribuição ao projeto", bool(m) and m.group(1) == "CC BY 4.0" and "atribuicao: 'O Estado do País" in lic)
conj = re.search(r"linha: \(id\) => `/livro-razao/\$\{id\}\.json`", lic)
medicao("enderecos_do_json_de_cada_linha", 1 if conj else (0 if lic else NAO), f"git show {CAB}:src/data/licenca.mjs · CONJUNTO.linha, o endereço do JSON de uma linha, contado uma vez", "o conjunto inteiro tem CSV e JSON", "csv: '/livro-razao.csv'" in lic and "json: '/livro-razao.json'" in lic)

view = git("show", f"{CAB}:src/views/LinhaView.astro") or ""
medicao("portas_de_descarga_do_json_da_linha_no_recibo", len(re.findall(r"href=\{CONJUNTO\.linha\(id\)\}", view)) if view else NAO, f"git show {CAB}:src/views/LinhaView.astro · os href com CONJUNTO.linha(id)", "o recibo também oferece o CSV do conjunto", "href={CONJUNTO.csv}" in view)
medicao("blocos_de_incorporacao_no_recibo", len(re.findall(r"incorporar|incorpora", view, re.I)) if view else NAO, f"git show {CAB}:src/views/LinhaView.astro · as ocorrências de «incorporar»", "o recibo tem o bloco do JSON da linha", "CONJUNTO.linha(id)" in view)

vercel = git("show", f"{CAB}:vercel.json") or ""
medicao("cabecalhos_cors_no_vercel_json", len(re.findall(r"Access-Control-Allow-Origin", vercel)) if vercel else NAO, f"git show {CAB}:vercel.json · as ocorrências de Access-Control-Allow-Origin", "o ficheiro tem o cabeçalho X-Frame-Options", "X-Frame-Options" in vercel)
medicao("cabecalhos_x_frame_options_no_vercel_json", len(re.findall(r"X-Frame-Options", vercel)) if vercel else NAO, f"git show {CAB}:vercel.json · as ocorrências de X-Frame-Options", "o valor é SAMEORIGIN", '"X-Frame-Options": "SAMEORIGIN"' in vercel)

gerador = git("grep", "-l", "FICHEIRO GERADO na construção do sítio a partir de ledger/claims", CAB, "--", "scripts", "src") or ""
medicao("guioes_que_geram_o_json_de_cada_linha", len([l for l in gerador.split("\n") if l.strip()]) if gerador is not None else NAO, f"git grep -l «FICHEIRO GERADO na construção do sítio a partir de ledger/claims» {CAB} -- scripts src", "o gerador existe no repositório", bool(gerador.strip()))

publico = git("ls-tree", "--name-only", f"{CAB}:public") or ""
medicao("guioes_de_incorporacao_servidos", len([f for f in publico.split() if f == "incorporar.js"]) if publico else NAO, f"git ls-tree {CAB}:public · o ficheiro incorporar.js", "a pasta public existe e lê-se", bool(publico))

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-ER1.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-ER1-o-recibo-incorporavel.md", "guiao": "design/observatorio/medidas/BRIEF-ER1.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
