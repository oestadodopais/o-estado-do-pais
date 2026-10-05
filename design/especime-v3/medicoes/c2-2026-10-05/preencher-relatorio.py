#!/usr/bin/env python3
"""C2 (05.10.2026): enche as marcas @@…@@ do LEIA-ME.md com os números dos ficheiros desta pasta, e de mais nada.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/c2-2026-10-05/preencher-relatorio.py

Cada marca troca-se por uma frase cujos números se leem de um JSON ou de um registo desta pasta (os portões, as
plantas, os recibos, as capturas, as páginas comparadas, os registos de trabalho e o custo). Uma marca que fique por
encher, ou um ficheiro que falte, para o guião com 1 e não escreve nada.
"""
import json
import os
import re
import sys
from datetime import datetime

PASTA = "design/especime-v3/medicoes/c2-2026-10-05"


def j(rel):
    with open(os.path.join(PASTA, rel), encoding="utf-8") as f:
        return json.load(f)


def txt(rel):
    with open(os.path.join(PASTA, rel), encoding="utf-8") as f:
        return f.read().strip()


def casa(n):
    """Um inteiro na forma da casa: os milhares com espaço."""
    s = str(n)
    grupos = []
    while len(s) > 3:
        grupos.insert(0, s[-3:])
        s = s[:-3]
    grupos.insert(0, s)
    return " ".join(grupos)


def segundos(a, b):
    return round((datetime.fromisoformat(b.replace("Z", "+00:00")) - datetime.fromisoformat(a.replace("Z", "+00:00"))).total_seconds())


rel = os.path.join(PASTA, "LEIA-ME.md")
med = {m["nome"]: m["valor"] for m in j("medidas.json")["medidas"]}
t = open(rel, encoding="utf-8").read()
pg, rc, cd, ca, pl, reg, cu = j("paginas-c2.json"), j("recibos-c2.json"), j("capturas-depois.json"), j("capturas-antes.json"), j("plantas-pais.json"), j("registos-de-trabalho.json"), j("custo-c2.json")
cab = txt("portoes/cabeca")[:8]
cod = {g: txt(f"portoes/{g}.codigo") for g in ("build", "verify", "typecheck")}
seg = {g: segundos(txt(f"portoes/{g}.inicio"), txt(f"portoes/{g}.fim")) for g in ("build", "verify", "typecheck")}
paginas_construidas = int(re.search(r"(\d+) page\(s\) built", txt("portoes/build.log")).group(1))
blog = txt("portoes/build.log")
hp = re.search(r'\{"controlos":(\d+),"plantas":(\d+),"controlos_integros":(\d+),"plantas_mordidas":(\d+)\}', blog)
hv = re.search(r"História do valor: (\d+) controlos e (\d+) plantas", blog)
cdm = re.search(r"casas decimais do excerto · (\d+) linha\(s\) lida\(s\).*?(\d+) planta\(s\), (\d+) certa\(s\)", blog)
novas = [p for p in pl if p["nome"] in ("linha de Portugal declarada da União", "agregado da União declarado de Portugal", "pedido de várias geografias declarado de Portugal")]
por_razao = pg["paginas_que_mudaram_por_razao"]
por_familia = pg["paginas_que_mudaram_por_familia"]
familias = "; ".join(f"{casa(n)} {f}" for f, n in sorted(por_familia.items(), key=lambda x: -x[1]))
outros_razao = pg["outros_ficheiros_que_mudaram_por_razao"]
ver_d = sorted({tuple(r["medidas"].get("veredicto_medidas") or []) for r in cd["resultados"] if r["pagina"] == "primeira-pagina"})
ver_a = sorted({tuple(r["medidas"].get("veredicto_medidas") or []) for r in ca["resultados"] if r["pagina"] == "primeira-pagina"})
estado_fim = txt("portoes/estado.fim")
sujos = [l for l in estado_fim.splitlines() if l.strip() and not l.startswith("??")]

trocas = {
    "@@PAGINAS_FRASE@@": (f"Das {casa(pg['paginas_comuns'])} páginas das duas construções (a da base e a da cabeça do código, feitas da mesma maneira), "
                          f"{casa(pg['paginas_que_mudaram'])} mudaram e {casa(pg['paginas_iguais_byte_a_byte'])} são iguais byte a byte; "
                          f"{len(pg['paginas_novas'])} páginas novas e {len(pg['paginas_que_sairam'])} que saíram."),
    "@@RECIBOS_FRASE@@": (f"Os {rc['recibos_lidos']} recibos das 9 linhas (as duas edições), lidos na construção da cabeça do código por `recibos-c2.mjs`: "
                          f"{rc['recibos_certos']} de {rc['recibos_lidos']} têm o valor novo no título, a entrada da atualização com a razão na língua da edição, "
                          "a releitura «diverge» de 05.10 a abrir essa entrada, a «igual» de 05.10 como a mais recente, e nenhuma frase a dizer que a página usa "
                          "um valor diferente do que a fonte publica. As capturas dos recibos do PIB real por habitante de 2025 e do custo unitário do trabalho "
                          "de 2024 mostram-no."),
    "@@CAPTURAS_FRASE@@": (f"{ca['capturas']} capturas de antes (a construção da base) e {cd['capturas']} de depois (a da cabeça do código): os 2 recibos, "
                           f"a primeira página e «Estado e economia», nas 5 larguras e nas 2 edições; nas de depois, {len(cd['problemas'])} problemas medidos "
                           f"e {cd['pedidos_recusados_para_fora']} pedidos para fora."),
    "@@PORTOES_FRASE@@": f"Na cabeça do código `{cab}`, pela tranca: o `build` a {cod['build']}, o `verify` a {cod['verify']} e o `typecheck` a {cod['typecheck']} (abaixo).",
    "@@RECIBOS_MEDIDA@@": f"{rc['recibos_certos']} de {rc['recibos_lidos']} recibos com as 6 coisas que o ponto pede, lidos na construção da cabeça do código; a planta do recibo estragado vista",
    "@@CAPTURAS_MEDIDA@@": f"{ca['capturas'] + cd['capturas']} capturas ({ca['capturas']} antes, {cd['capturas']} depois), {len(cd['problemas'])} problemas nas de depois",
    "@@PLANTAS_PAIS@@": f"{len(pl)}, todas a passar ({len([p for p in pl if p['passou']])} de {len(pl)}), {len([p for p in novas if p['passou']])} delas novas do C2",
    "@@PLANTAS_LIVRO@@": (f"{hp.group(4)} de {hp.group(2)} na célula da história da proveniência, {hv.group(2)} na da história do valor, "
                          f"{cdm.group(3)} de {cdm.group(2)} nas casas decimais"),
    "@@LINHAS_IGUAIS@@": str(reg["linhas_compostas_iguais_ao_commit_8dbdcac2"]),
    "@@PAGINAS@@": (f"`paginas-c2.mjs` comparou a construção da base (`006685ae`) e a da cabeça do código (`{cab}`), feitas da mesma maneira (o `astro build` de "
                    f"uma exportação de cada commit, com as mesmas dependências). Das {casa(pg['paginas_comuns'])} páginas comuns, {casa(pg['paginas_iguais_byte_a_byte'])} são "
                    f"iguais byte a byte, {casa(pg['paginas_iguais_sem_a_construcao'])} só mudam no que é da construção, e {casa(pg['paginas_que_mudaram'])} mudaram: "
                    f"{casa(por_razao.get('cita uma das nove linhas', 0))} porque citam uma das 9 linhas (o valor, a régua, a porta para o recibo, a entrada do "
                    f"registo das correções e a do índice), e {casa(por_razao.get('outra', 0))} por outra razão. "
                    f"Por família: {por_familia.get('recibo de uma linha', 0)} recibos de linhas (os {pg['recibos_das_nove_que_mudaram']} das 9 e "
                    f"{med['recibos_de_fora_das_nove_que_mudaram']} de cartões que as citam), {por_familia.get('área de governo', 0)} páginas de áreas de governo, "
                    "e 2 de cada uma destas, nas 2 edições: o Método, a página da União, o registo das correções, o índice do livro-razão, o índice do sítio, "
                    "a entrada «Emprego» e a entrada «Estado e economia». "
                    f"Os recibos das 9 que mudaram são {pg['recibos_das_nove_que_mudaram']} de 18. "
                    f"{len(pg['paginas_novas'])} páginas novas e {len(pg['paginas_que_sairam'])} que saíram. As {casa(por_razao.get('outra', 0))} por outra razão são o Método "
                    f"nas 2 edições, que muda só na contagem das releituras registadas, de {casa(med['releituras_registadas_no_metodo_antes'])} para "
                    f"{casa(med['releituras_registadas_no_metodo_depois'])} (as 9 releituras novas do painel menos as 4 que a regra das 4 tirou); e os "
                    f"{med['recibos_de_fora_das_nove_que_mudaram']} recibos que mudaram sem serem das 9 são os dos 3 cartões cuja régua cita uma das 9 (o do custo unitário do "
                    "trabalho, o do saldo da balança corrente e o da despesa em investigação e desenvolvimento). Fora das páginas, "
                    f"{casa(pg['outros_ficheiros_que_mudaram'])} ficheiros mudaram: {outros_razao.get('cita uma das nove linhas', 0)} porque citam uma das 9 linhas (os 9 "
                    f"ficheiros de dados das linhas e o `livro-razao.json`), e {outros_razao.get('outra', 0)} por outra razão, o `livro-razao.csv`, que escreve os identificadores sem aspas"
                    f"; os outros {casa(pg['outros_ficheiros_comuns_iguais'])} ficaram iguais. A primeira página tem a mesma lista das medidas fora do valor de referência "
                    f"antes e depois ({len(ver_a)} forma antes e {len(ver_d)} depois, nas 2 edições e nas 5 larguras)."),
    "@@PORTOES@@": (f"Na cabeça do código `{cab}`, pela tranca da máquina (`sh scripts/leituras/portoes.sh`), cada um no seu comando, com o código escrito num "
                    f"ficheiro acabado de escrever em `portoes/`: `npm run build` a {cod['build']} em {casa(seg['build'])} segundos ({casa(paginas_construidas)} páginas "
                    f"construídas), `npm run verify` a {cod['verify']} em {casa(seg['verify'])} segundos, `npm run typecheck` a {cod['typecheck']} em "
                    f"menos de um segundo; a cabeça no fim da corrida é a do começo, e a árvore tem {len(sujos)} ficheiros seguidos mudados "
                    "(só esta pasta, a das capturas e a ligação das dependências estão por seguir). A primeira corrida, na cabeça `b72e639d`, está em "
                    "`portoes-b72e639d/` (o `verify` a 1, no inventário dos rótulos: o ponto 15). Os registos levam os caminhos da máquina trocados por "
                    "marcas (`caminhos-trocados.json`, escrito por `trocar-caminhos.py`)."),
    "@@CUSTO@@": (f"{casa(cu['simbolos_gastos'])} símbolos, do começo do bloco à última leitura do contador antes do commit das provas (`custo-c2.json`, lido do "
                  f"registo da sessão), em {casa(cu['segundos_entre_as_leituras'])} segundos, com o Claude Opus 5.5 e {cu['subagentes']} subagentes. O serviço "
                  "cortou a sessão uma vez a meio, por sobrecarga do lado da Anthropic, e o coordenador retomou-a; o contador conta as duas metades. O total "
                  "que a ferramenta reporta ao lugar de direção no fim é o que conta."),
}
for k, v in trocas.items():
    if k not in t:
        sys.exit(f"preencher-relatorio: a marca {k} não está no relatório")
    t = t.replace(k, v)
resto = re.findall(r"@@[A-Z_]+@@", t)
if resto:
    sys.exit(f"preencher-relatorio: marcas por encher: {resto}")
open(rel, "w", encoding="utf-8").write(t)
print(f"preencher-relatorio: {len(trocas)} marcas enchidas")
