#!/usr/bin/env python3
"""O §0 do brief S1 (a caixa das sugestões), medido sobre a cabeça presa do sítio (62ed13c6) e sobre o registo da base
que o brief traz (supabase/migrations/2026-10-02-caixa-das-sugestoes.sql, lido da árvore de trabalho porque entra no
mesmo commit do brief). Não lê a rede nem a base. Escreve design/observatorio/medidas/BRIEF-S1.json (ou o caminho em
OEDP_MEDIDAS_JSON). Cada medição leva o comando e um conhecido-positivo; o que não conseguir ler fica «NÃO LIDO»."""
import json, os, pathlib, re, subprocess

SITIO = pathlib.Path(__file__).resolve().parents[3]
CAB = "62ed13c6"
NAO = "NÃO LIDO"
medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({"nome": nome, "valor": valor, "comando": comando,
                    "conhecido_positivo": {"o_que": o_que, "encontrado": bool(encontrado)}})


def mostrar(caminho):
    r = subprocess.run(["git", "-C", str(SITIO), "show", f"{CAB}:{caminho}"], capture_output=True)
    return r.stdout.decode("utf-8") if r.returncode == 0 else None


def listar(pasta):
    r = subprocess.run(["git", "-C", str(SITIO), "ls-tree", "-r", "--name-only", f"{CAB}:{pasta}"], capture_output=True, text=True)
    return [f"{pasta}/{f}" for f in r.stdout.split()] if r.returncode == 0 else []


# 1. A pasta das funções da Vercel não existe na cabeça; o mesmo listador vê public/js.
api = listar("api")
js = listar("public/js")
medicao("ficheiros_na_pasta_das_funcoes", len(api) if js else NAO, f"git ls-tree -r --name-only {CAB}:api · conta os ficheiros",
        "o mesmo listador conta os guiões de public/js", len(js) > 0)

# 2. As portas do rodapé para escrever ao projeto: os atributos data-porta- em SiteFooter.astro.
rodape = mostrar("src/components/SiteFooter.astro") or ""
portas = re.findall(r"data-porta-[a-z-]+", rodape)
medicao("portas_do_rodape_para_escrever_ao_projeto", len(portas) if rodape else NAO,
        f"git show {CAB}:src/components/SiteFooter.astro · os atributos data-porta-", "a das correções é uma delas", "data-porta-correccoes" in portas)

# 3. Os ficheiros de código que leem a porta das correções (os que vão ter de conhecer a porta nova).
codigo = [f for pasta in ("tests", "scripts", "src") for f in listar(pasta) if f.endswith((".mjs", ".astro", ".py"))]
leem = [f for f in codigo if "data-porta-correccoes" in (mostrar(f) or "")]
medicao("ficheiros_de_codigo_que_leem_a_porta_das_correcoes", len(leem) if codigo else NAO,
        f"git grep -l data-porta-correccoes {CAB} -- tests scripts src · só .mjs, .astro e .py", "o portão de HTML é um deles", "scripts/gate-html.mjs" in leem)

# 4. Os formulários nas páginas e vistas (o leitor já escreve em dois sítios: a busca de concelho e o livro).
vistas = [f for f in listar("src/pages") + listar("src/views") if f.endswith(".astro")]
com_form = [f for f in vistas if "<form" in (mostrar(f) or "")]
medicao("vistas_com_formulario", len(com_form) if vistas else NAO, f"git grep -l '<form' {CAB} -- src/pages src/views",
        "a dos lugares é uma delas", "src/views/LugaresView.astro" in com_form)

# 5. As menções a sugestões no código-fonte do sítio: nenhuma; o mesmo detetor acha «correc».
fontes = [f for f in listar("src")]
sugest = [f for f in fontes if re.search(r"sugest", mostrar(f) or "", flags=re.I)]
correc = [f for f in fontes if re.search(r"correc", mostrar(f) or "", flags=re.I)]
medicao("ficheiros_fonte_que_falam_de_sugestoes", len(sugest) if fontes else NAO, f"git grep -il sugest {CAB} -- src",
        "o mesmo detetor acha «correc» no rodapé", "src/components/SiteFooter.astro" in correc)

# 6. As rotas declaradas e as de sugestões (nenhuma).
rotas_src = mostrar("src/lib/routes.mjs") or ""
bloco = rotas_src[rotas_src.index("export const ROUTES = {"):]
bloco = bloco[:bloco.index("\n};")]
chaves = re.findall(r"^\s{2}([a-zA-Z]+): \{", bloco, flags=re.M)
medicao("rotas_declaradas", len(chaves) if rotas_src else NAO, f"git show {CAB}:src/lib/routes.mjs · as chaves de ROUTES",
        "a das correções é uma delas", "correcoes" in chaves)
medicao("rotas_de_sugestoes_declaradas", sum(1 for c in chaves if "sugest" in c.lower()) if rotas_src else NAO,
        "as chaves de ROUTES com «sugest»", "a mesma leitura vê a chave uniaoEuropeia", "uniaoEuropeia" in chaves)

# 7. O registo da base que o brief traz: as tabelas, a função, os limites e a retenção, lidos do SQL.
sql_caminho = SITIO / "supabase" / "migrations" / "2026-10-02-caixa-das-sugestoes.sql"
sql = sql_caminho.read_text(encoding="utf-8") if sql_caminho.exists() else ""
tabelas = re.findall(r"^create table public\.([a-z_]+)", sql, flags=re.M)
funcoes = re.findall(r"^create or replace function public\.([a-z_]+)", sql, flags=re.M)
medicao("tabelas_no_registo_da_base", len(tabelas) if sql else NAO, "as linhas «create table public.» em supabase/migrations/2026-10-02-caixa-das-sugestoes.sql",
        "a das sugestões é uma delas", "sugestoes" in tabelas)
medicao("funcoes_no_registo_da_base", len(funcoes) if sql else NAO, "as linhas «create or replace function public.» no mesmo ficheiro",
        "a enviar_sugestao é uma delas", "enviar_sugestao" in funcoes)
m = re.search(r"if v_n > (\d+) then", sql)
medicao("envios_por_marca_e_por_hora", int(m.group(1)) if m else NAO, "o «if v_n > N then» da função, no mesmo ficheiro",
        "a janela da marca é de 1 hora", "interval '1 hour'" in sql)
m = re.search(r"if v_dia >= (\d+) then", sql)
medicao("envios_por_dia_na_caixa_inteira", int(m.group(1)) if m else NAO, "o «if v_dia >= N then» da função",
        "a janela do dia é de 24 horas", "interval '24 hours'" in sql)
m = re.search(r"decidido_em < now\(\) - interval '(\d+) days'", sql)
medicao("dias_de_retencao_depois_da_decisao", int(m.group(1)) if m else NAO, "o «interval 'N days'» da tarefa de retenção",
        "a tarefa chama-se sugestoes-retencao", "'sugestoes-retencao'" in sql)
grants = re.findall(r"^grant execute on function public\.enviar_sugestao\([^)]*\) to ([a-z]+);", sql, flags=re.M)
medicao("papeis_que_podem_chamar_a_funcao", len(grants) if sql else NAO, "as linhas «grant execute on function public.enviar_sugestao» no mesmo ficheiro",
        "o papel é o anon, o da chave pública", grants == ["anon"])

saida = {"brief": "design/observatorio/BRIEF-S1-a-caixa-das-sugestoes.md", "guiao": "design/observatorio/medidas/BRIEF-S1.py",
         "cabeca_lida": CAB, "medidas": medidas}
alvo = os.environ.get("OEDP_MEDIDAS_JSON") or os.path.join(SITIO, "design", "observatorio", "medidas", "BRIEF-S1.json")
with open(alvo, "w", encoding="utf-8") as fh:
    json.dump(saida, fh, ensure_ascii=False, indent=2); fh.write("\n")
print(json.dumps(saida, ensure_ascii=False, indent=2))
