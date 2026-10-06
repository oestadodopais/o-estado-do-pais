#!/usr/bin/env python3
"""O §0 do brief EX2 (a leitura da semana com a frase «o que é» de cada número que mudou), medido sobre a cabeça presa do
sítio (CAB). Lê só o repositório, pela cabeça presa (`git show`, `git ls-tree`, `git cat-file --batch`), nunca a árvore
de trabalho (§1.153). Escreve design/observatorio/medidas/BRIEF-EX2.json (ou o caminho em OEDP_MEDIDAS_JSON). Cada
medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(os.environ.get("OEDP_SITIO") or pathlib.Path(__file__).resolve().parents[3])
CAB = os.environ.get("OEDP_CABECA") or "4b29f707"
NAO = "NÃO LIDO"
SEMANA = ("2026-09-30", "2026-10-06")  # a janela de sete dias que acaba no dia em que o brief foi escrito
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def git(*args, entrada=None, bytes_=False):
    r = subprocess.run(["git", "-C", str(SITIO), *args], capture_output=True, input=entrada)
    if r.returncode != 0:
        return None
    return r.stdout if bytes_ else r.stdout.decode("utf-8")


# AS LINHAS DO LIVRO, TODAS DE UMA VEZ, pelo cat-file em lote (3 195 git show seriam minutos).
lista = git("ls-tree", "--name-only", f"{CAB}:ledger/claims") or ""
ficheiros = [f for f in lista.split() if f.endswith(".yml")]
pedidos = "".join(f"{CAB}:ledger/claims/{f}\n" for f in ficheiros).encode("utf-8")
lote = git("cat-file", "--batch", entrada=pedidos, bytes_=True) or b""
linhas = []
pos = 0
# O LOTE LÊ-SE EM BYTES: o tamanho de cada corpo é em bytes, e um índice numa cadeia decodificada desvia-se no primeiro acento.
for f in ficheiros:
    cab_fim = lote.find(b"\n", pos)
    if cab_fim < 0:
        break
    cab = lote[pos:cab_fim].split()
    if len(cab) < 3 or cab[1] != b"blob":
        break
    n = int(cab[2]); corpo = lote[cab_fim + 1: cab_fim + 1 + n].decode("utf-8"); pos = cab_fim + 1 + n + 1
    m_id = re.search(r'^id: "([^"]+)"', corpo, re.M); m_unit = re.search(r'^unit: "([^"]*)"', corpo, re.M); m_study = re.search(r'^study: "([^"]*)"', corpo, re.M)
    # AS ENTRADAS DO REGISTO DAS CORREÇÕES: «- date: '...'» no início da linha e «  kind: ...» logo a seguir (a forma do motor).
    entradas = re.findall(r"^- date: '(\d{4}-\d{2}-\d{2})'\n  kind: ([a-z]+)", corpo, re.M)
    linhas.append({"id": m_id.group(1) if m_id else f[:-4], "unit": m_unit.group(1) if m_unit else "", "study": m_study.group(1) if m_study else "", "entradas": entradas})
lidas = len(linhas) == len(ficheiros) and len(ficheiros) > 0
exemplo = next((l for l in linhas if l["id"] == "custo-unitario-do-trabalho-2024"), None)
medicao("linhas_do_livro", len(linhas) if lidas else NAO, f"git ls-tree {CAB}:ledger/claims · os .yml, lidos por git cat-file --batch", "a linha custo-unitario-do-trabalho-2024 lê-se com a sua unidade", bool(exemplo) and exemplo["unit"] == "variação em três anos, %")

pais = git("show", f"{CAB}:src/lib/pais.mjs") or ""
reunida = re.search(r"export const MEDIDA_REUNIDA = \{([^}]*)\}", pais)
reunidas = set(re.findall(r"'([^']+)':", reunida.group(1))) if reunida else set()
ambito = [l for l in linhas if l["study"] != "o-estado-do-pais" and l["id"] not in reunidas] if lidas else []
medicao("linhas_no_ambito_da_leitura_da_semana", len(ambito) if lidas and reunida else NAO, f"git cat-file --batch {CAB}:ledger/claims/*.yml · as linhas cujo study não é o-estado-do-pais e que não estão em MEDIDA_REUNIDA (git show {CAB}:src/lib/pais.mjs)", "a linha custo-unitario-do-trabalho-2024 está no âmbito", any(l["id"] == "custo-unitario-do-trabalho-2024" for l in ambito))
unidades = sorted({l["unit"] for l in ambito if l["unit"]})
medicao("unidades_distintas_no_ambito", len(unidades) if ambito else NAO, "as unidades distintas (o campo unit) das linhas no âmbito", "«% do PIB» é uma delas", "% do PIB" in unidades)
por_palavra = [u for u in unidades if re.match(r"^[A-Za-zÀ-ÿ]", u)]
medicao("unidades_que_comecam_por_palavra", len(por_palavra) if ambito else NAO, "as unidades distintas no âmbito cujo primeiro carácter é uma letra (e não um símbolo nem um algarismo)", "«variação em três anos, %» é uma delas", "variação em três anos, %" in por_palavra)
mudadas = [l for l in ambito if any(SEMANA[0] <= d <= SEMANA[1] and k in ("correcao", "atualizacao") for d, k in l["entradas"])]
medicao("linhas_com_entradas_de_valor_na_semana_ate_06_10", len(mudadas) if ambito else NAO, f"as linhas no âmbito com uma entrada de corrections de kind correcao ou atualizacao datada de {SEMANA[0]} a {SEMANA[1]}", "a linha custo-unitario-do-trabalho-2024 é uma delas", any(l["id"] == "custo-unitario-do-trabalho-2024" for l in mudadas))

try:
    provadas = json.loads(git("show", f"{CAB}:tests/cartao/leituras-provadas.json") or "null")
except json.JSONDecodeError:
    provadas = None
fam = (provadas or {}).get("familias") if isinstance(provadas, dict) else None
medicao("familias_com_frase_provada", len(fam) if isinstance(fam, (dict, list)) else NAO, f"git show {CAB}:tests/cartao/leituras-provadas.json · as chaves de «familias»", "a auditoria tem a secção «explicacoes»", isinstance(provadas, dict) and "explicacoes" in provadas)

oque = git("show", f"{CAB}:src/lib/o-que-e-o-numero.mjs") or ""
medicao("funcao_da_frase_o_que_e_no_recibo", 1 if "export function oQueEDaLinha(id, lang)" in oque else NAO, f"git show {CAB}:src/lib/o-que-e-o-numero.mjs · a função oQueEDaLinha, contada uma vez", "a função devolve porConfirmar", "porConfirmar" in oque)
semana_view = git("show", f"{CAB}:src/views/LeituraDaSemanaView.astro") or ""
medicao("vezes_que_a_unidade_entra_na_frase_da_semana", len(re.findall(r'campo="unit"', semana_view)) if semana_view else NAO, f"git show {CAB}:src/views/LeituraDaSemanaView.astro · os CampoDaLinha com campo=\"unit\"", "a frase escreve o valor de antes e o de agora", 'data-correcao-campo="old_value"' in semana_view and 'data-correcao-campo="new_value"' in semana_view)
fc = git("show", f"{CAB}:tests/explicacoes/frases-compostas.mjs") or ""
decl = re.search(r"const ROTAS = .*?const LARGURAS", fc, re.S)
chamadas = re.findall(r"routePath\('([a-zA-Z]+)', lang\)", decl.group(0)) if decl else []
# EX2-1 (06.10.2026, o construtor do EX2): a primeira forma contava só as rotas fixas (8) e esquecia a página de cada
# explicação, que a declaração acrescenta por EXPLICACOES.map; a célula lê as fixas mais uma por explicação, nas duas edições.
expl = git("show", f"{CAB}:src/data/explicacoes/index.mjs") or ""
n_expl = len(re.findall(r"^\s+slug: '", expl, re.M))
por_explicacao = bool(decl) and "EXPLICACOES.map" in decl.group(0)
medicao("explicacoes_publicadas", n_expl if expl else NAO, f"git show {CAB}:src/data/explicacoes/index.mjs · as chaves «slug» das explicações", "a explicação do dinheiro do Estado está declarada", "dinheiro-do-estado-2026" in expl)
medicao("paginas_lidas_pela_celula_das_frases_compostas", 2 * (len(chamadas) + n_expl) if decl and expl and por_explicacao else NAO, f"git show {CAB}:tests/explicacoes/frases-compostas.mjs · as chamadas routePath fixas na declaração de ROTAS mais uma por explicação (EXPLICACOES.map), vezes as duas edições", "a célula lê a rota das explicações e a página de cada explicação", "explicacoes" in chamadas and por_explicacao)

saida = pathlib.Path(os.environ.get("OEDP_MEDIDAS_JSON") or (SITIO / "design/observatorio/medidas/BRIEF-EX2.json"))
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(json.dumps({"brief": "design/observatorio/BRIEF-EX2-a-leitura-da-semana-com-o-que-cada-numero-e.md", "guiao": "design/observatorio/medidas/BRIEF-EX2.py", "cabeca_lida": CAB, "medidas": medidas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for m in medidas:
    print(f"{m['nome']}: {m['valor']} · conhecido-positivo {'ok' if m['conhecido_positivo']['encontrado'] else 'FALHOU'}")
if ambito:
    print("unidades que começam por palavra:", por_palavra)
