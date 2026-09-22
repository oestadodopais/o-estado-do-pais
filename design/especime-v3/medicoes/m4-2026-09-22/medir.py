#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""As medidas do bloco M4 sobre o estudo 11, remedidas a cada corrida.

    python3 "content/11 Seguranca Social/Technical Source/medir.py"

Escreve `medidas.json` ao lado, com cada número que o `RELATORIO-portao-2026-09-22.md`
cita. O relatório não transcreve nada: cita este ficheiro, e este ficheiro é o que
sai de correr o motor sobre o estudo hoje.

Três medidas são de uma CÓPIA DE ENSAIO e estão marcadas como tal (`contrafactual`,
`planta_valor`). A cópia vive num diretório temporário, nunca entra no índice, e o
que lhe foi feito está escrito em `contrafactual.o_que_foi_mexido`: é a única forma
de medir o que o estudo mediria se o livro-razão fosse reparado, porque hoje o
`core.gate.measure` levanta `RuntimeError` antes de contar seja o que for.
"""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ESTUDO = AQUI.parent
RAIZ = ESTUDO.parent.parent
sys.path.insert(0, str(RAIZ))

from core import gate  # noqa: E402
from core.attributions import Lexicon  # noqa: E402
from core.provenance import SourceType  # noqa: E402
from core.reconcile import (  # noqa: E402
    REQUIRED_CLAIM_FIELDS, LedgerError, claim_value_canonical, indexed_forms, printed_label)

LIVRO = ESTUDO / "ledger.json"
HTML = ESTUDO / "Penalizações por Reforma Antecipada em Portugal (pt-PT).html"
RELATORIO = ESTUDO / "RELATORIO-seguranca-social.md"
EDICOES = {"html": HTML, "relatorio-md": RELATORIO}

# As nove linhas cujo `value` é texto, nomeadas no brief do M4. A lista não é a
# medida: o `defeitos_por_linha` volta a encontrá-las pelo código do motor, e o
# `familias.valor_de_texto.ids` tem de bater certo com esta.
NOVE = ("relatorio-titulo", "governo-posicao", "defice-transicao-nao-quantificado",
        "ch6-taxa-contributiva-nao-fixada", "fs-penalizacao-seletiva", "fs-dupla-contagem",
        "fs-heterogeneidade-longevidade", "ch12-sem-base-administrativa", "governo-xxiv-xxv")


def dobrar(s: str) -> str:
    """Acentos fora e espaços colapsados, para comparar o livro com a fonte.

    O livro do 11 está escrito sem acentos e a fonte tem-nos, por isso a
    comparação faz-se com os dois lados dobrados da mesma maneira.
    """
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", s)


def citacoes(excerto: str) -> list[str]:
    """As frases que uma linha põe entre plicas no seu `excerpt`.

    É o que a linha diz ter lido na fonte, tal e qual, e é isso que se vai
    procurar lá. Um pedaço escolhido à mão passaria ainda que a linha citasse
    outra coisa.
    """
    return [c.strip() for c in re.findall(r"'([^']{20,})'", excerto)]


def arvore_com_as_fontes() -> Path:
    """A árvore onde as cópias das fontes vivem.

    O PDF do relatório e a sua extração em texto estão excluídos do repositório
    (`.gitignore`, as linhas que o `git check-ignore` nomeia), por isso uma
    worktree não os tem e a árvore principal tem. Perguntado ao git, nunca
    escrito à mão: um caminho de uma máquina dentro de um ficheiro do
    repositório é uma coisa que deixa de ser verdade noutra.
    """
    r = subprocess.run(["git", "worktree", "list", "--porcelain"],
                       cwd=RAIZ, capture_output=True, text=True)
    for linha in r.stdout.splitlines():
        if linha.startswith("worktree "):
            return Path(linha.split(" ", 1)[1])
    return RAIZ


def correr(modulo: str, *args: str) -> dict:
    r = subprocess.run([sys.executable, "-m", modulo, *args], cwd=RAIZ,
                       capture_output=True, text=True)
    linhas = [l for l in r.stdout.splitlines() if l.strip()]
    return {"saida": r.returncode, "ultima_linha": (linhas or [""])[-1][:300]}


def defeitos_do_livro(livro: Path) -> dict:
    dados = json.loads(livro.read_text(encoding="utf-8"))
    linhas = dados["claims"]
    por_linha: dict[str, list[str]] = {}
    for i, c in enumerate(linhas):
        rid, probs = c.get("id", f"#{i}"), []
        faltam = [f for f in REQUIRED_CLAIM_FIELDS if not c.get(f)]
        if faltam:
            probs.append("campos_em_falta:" + ",".join(faltam))
        try:
            SourceType(c.get("source_type"))
        except ValueError:
            probs.append(f"source_type_invalido:{c.get('source_type')}")
        try:
            printed_label(c)
        except LedgerError:
            probs.append("name_ou_name_source")
        try:
            for forma in indexed_forms(c):
                claim_value_canonical(str(forma))
        except LedgerError as exc:
            probs.append("valor_de_texto" if "contains no number" in str(exc) else "value_not_numeric")
        if probs:
            por_linha[rid] = probs

    st = {}
    for c in linhas:
        st[c.get("source_type")] = st.get(c.get("source_type"), 0) + 1
    invalidos = {k: v for k, v in st.items() if k not in {t.value for t in SourceType}}

    try:
        Lexicon.build(dados.get("entity_aliases", {}), set())
        entidades = {"aceite": True, "recusa": None}
    except LedgerError as exc:
        entidades = {"aceite": False, "recusa": str(exc)}

    # As três recusas do `indexed_forms`, linha a linha, para as nove.
    tres_recusas = {}
    for c in linhas:
        if c["id"] not in NOVE:
            continue
        valor, excerto = str(c["value"]), str(c.get("excerpt") or "")
        tem_numero = True
        try:
            claim_value_canonical(valor)
        except LedgerError:
            tem_numero = False
        tres_recusas[c["id"]] = {
            "valor": valor,
            "carrega_numero": tem_numero,
            "tem_alternates": bool(c.get("alternates")),
            "valor_no_proprio_excerpt": valor in excerto,
            "pode_declarar_value_not_numeric":
                (not tem_numero) and (not c.get("alternates")) and (valor in excerto),
        }

    return {
        "linhas": len(linhas),
        "linhas_recusadas": len(por_linha),
        "defeitos_por_linha": por_linha,
        "familias": {
            "valor_de_texto": {
                "n": sum(1 for p in por_linha.values() if "valor_de_texto" in p),
                "ids": sorted(r for r, p in por_linha.items() if "valor_de_texto" in p),
            },
            "source_type_invalido": {
                "n": sum(1 for p in por_linha.values()
                         if any(x.startswith("source_type_invalido") for x in p)),
                "por_valor": invalidos,
                "validos": [t.value for t in SourceType],
            },
            "entity_aliases": entidades,
        },
        "tres_recusas_das_nove": tres_recusas,
        "com_derivation": sum(1 for c in linhas if c.get("derivation")),
        "com_attributed_to": sum(1 for c in linhas if c.get("attributed_to")),
        "ignore": len(dados.get("ignore", [])),
        "assertions": len(dados.get("assertions", [])),
        "adjacency_ignores": len(dados.get("adjacency_ignores", [])),
        "tem_preregistration": (ESTUDO / "preregistration.json").exists(),
    }


def copia_de_ensaio(destino: Path) -> dict:
    """O livro com as três famílias contornadas, numa cópia que não embarca."""
    dados = json.loads(LIVRO.read_text(encoding="utf-8"))
    mexido = {"value_not_numeric_posto": [], "excerpt_acrescentado": [],
              "source_type_para_other": [], "entity_aliases_para_lista": 0}
    validos = {t.value for t in SourceType}
    for c in dados["claims"]:
        if c["id"] in NOVE:
            c["value_not_numeric"] = True
            mexido["value_not_numeric_posto"].append(c["id"])
            if str(c["value"]) not in str(c.get("excerpt") or ""):
                c["excerpt"] = f"{c['excerpt']} [ENSAIO: {c['value']}]"
                mexido["excerpt_acrescentado"].append(c["id"])
        if c.get("source_type") not in validos:
            c["source_type"] = "other"
            mexido["source_type_para_other"].append(c["id"])
    aliases = dados.get("entity_aliases", {})
    dados["entity_aliases"] = {k: ([v] if isinstance(v, str) else list(v))
                               for k, v in aliases.items()}
    mexido["entity_aliases_para_lista"] = len(aliases)
    destino.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    return mexido


# O CONFERIDOR, e a razão por que também lê números por extenso: a primeira
# passagem deste bloco conferiu só os algarismos, e deixou passar «quatrocentos e
# dezassete», «cento e quatro», «oito linhas» e «onze figuras», que eram
# exatamente os números que não tinham casa (22.09.2026, achado 7 da leitura a
# frio). Um conferidor que só vê uma das duas formas de escrever um número
# certifica metade e diz o nome todo.
_UNIDADES = {"zero": 0, "um": 1, "uma": 1, "dois": 2, "duas": 2, "tres": 3,
             "quatro": 4, "cinco": 5, "seis": 6, "sete": 7, "oito": 8, "nove": 9,
             "dez": 10, "onze": 11, "doze": 12, "treze": 13, "catorze": 14,
             "quatorze": 14, "quinze": 15, "dezasseis": 16, "dezassete": 17,
             "dezoito": 18, "dezanove": 19}
_DEZENAS = {"vinte": 20, "trinta": 30, "quarenta": 40, "cinquenta": 50, "sessenta": 60,
            "setenta": 70, "oitenta": 80, "noventa": 90}
_CENTENAS = {"cem": 100, "cento": 100, "duzentos": 200, "duzentas": 200,
             "trezentos": 300, "trezentas": 300, "quatrocentos": 400, "quatrocentas": 400,
             "quinhentos": 500, "quinhentas": 500, "seiscentos": 600, "seiscentas": 600,
             "setecentos": 700, "setecentas": 700, "oitocentos": 800, "oitocentas": 800,
             "novecentos": 900, "novecentas": 900}
_PALAVRAS = {**_UNIDADES, **_DEZENAS, **_CENTENAS}
_EXTENSO = re.compile(
    r"\b(?:" + "|".join(sorted(_PALAVRAS, key=len, reverse=True)) + r")"
    r"(?:\s+e\s+(?:" + "|".join(sorted(_PALAVRAS, key=len, reverse=True)) + r"))*\b")

# Os números que não são uma medida e por isso não têm linha: as datas do
# calendário, as referências do registo de decisões, e o nome de um modelo. Cada
# um com a sua razão escrita, que é o que os separa de um número esquecido.
_RAZOES = {
    "21.09": "a data do bloco M2", "24.08": "a data em que o livro do 11 foi escrito",
    "22.09": "a data deste bloco", "2026": "o ano", "2027": "o ano do estudo 15",
    "1.121": "a referência da decisão no DECISIONS.md do sítio",
    "5.6": "o nome do modelo que fez a leitura a frio, gpt-5.6-sol",
}


def por_extenso(texto: str) -> set[int]:
    achados = set()
    for m in _EXTENSO.finditer(dobrar(texto).lower()):
        partes = [p for p in re.split(r"\s+e\s+", m.group()) if p in _PALAVRAS]
        if partes:
            achados.add(sum(_PALAVRAS[p] for p in partes))
    return achados


def conferir(medidas: Path, relatorio: Path) -> list[str]:
    """Os números do relatório que não resolvem no `medidas.json`.

    Os algarismos são lidos com o leitor da casa (`core.reconcile`), que é o que
    sabe que «1 123» e «1123» são o mesmo número; um leitor próprio escrito aqui
    diria que faltava o «123».
    """
    from core.reconcile import _NUM_RE, canonical
    plano = medidas.read_text(encoding="utf-8")
    texto = relatorio.read_text(encoding="utf-8")
    no_plano = {canonical(m.group()) for m in _NUM_RE.finditer(plano)}
    sem_casa = []
    for m in _NUM_RE.finditer(texto):
        escrito = m.group()
        if escrito in _RAZOES or canonical(escrito) in no_plano:
            continue
        janela = re.sub(r"\s+", " ", texto[max(0, m.start() - 40): m.end() + 40])
        sem_casa.append(f"em algarismos: {escrito}  …{janela}…")
    for v in sorted(por_extenso(texto)):
        if canonical(str(v)) not in no_plano:
            sem_casa.append(f"por extenso: {v}")
    return sorted(set(sem_casa))


def main() -> int:
    saida: dict = {
        "_": "Medidas do bloco M4 sobre o estudo 11, 22.09.2026. Geradas por medir.py; "
             "o relatorio ao lado nao transcreve nenhum numero que nao esteja aqui.",
        "bloco": "M4",
        "data": "2026-09-22",
        "ramo": subprocess.run(["git", "branch", "--show-current"], cwd=RAIZ,
                               capture_output=True, text=True).stdout.strip(),
        # A base do ramo é o antepassado comum, e não o `master` de agora: o
        # `master` andou dois commits durante este bloco e escrever a sua ponta
        # dizia que o ramo assentava onde não assenta.
        "base_do_ramo": subprocess.run(
            ["git", "rev-parse", "--short",
             subprocess.run(["git", "merge-base", "HEAD", "master"], cwd=RAIZ,
                            capture_output=True, text=True).stdout.strip()],
            cwd=RAIZ, capture_output=True, text=True).stdout.strip(),
        "master_agora": subprocess.run(["git", "rev-parse", "--short", "master"],
                                       cwd=RAIZ, capture_output=True,
                                       text=True).stdout.strip(),
        "livro": str(LIVRO.relative_to(RAIZ)),
        "edicoes": {k: str(v.relative_to(RAIZ)) for k, v in EDICOES.items()},
    }
    saida["estado_do_livro"] = defeitos_do_livro(LIVRO)

    hoje: dict = {}
    for nome, doc in EDICOES.items():
        hoje[nome] = {m.split(".")[-1]: correr(m, str(doc.relative_to(RAIZ)),
                                               str(LIVRO.relative_to(RAIZ)))
                      for m in ("core.reconcile", "core.attributions",
                                "core.assertions", "core.prose")}
    hoje["par_md_html"] = correr("core.editions", str(RELATORIO.relative_to(RAIZ)),
                                 str(HTML.relative_to(RAIZ)), str(LIVRO.relative_to(RAIZ)))
    hoje["derivations"] = correr("core.derivations", str(LIVRO.relative_to(RAIZ)))
    saida["medidas_de_hoje"] = hoje

    tmp = Path(tempfile.mkdtemp())
    ensaio = tmp / "ledger-de-ensaio.json"
    contraf: dict = {
        "_": "MEDIDO NUMA COPIA DE ENSAIO QUE NAO EMBARCA. Nao e a linha de base do "
             "estudo: e o que o motor contaria se as tres familias de defeitos "
             "estruturais fossem resolvidas sem mexer no texto de nenhum valor. "
             "As linhas value_not_numeric nao indexam forma nenhuma (indexed_forms "
             "devolve []), por isso estas contagens nao dependem do texto das nove.",
        "o_que_foi_mexido": copia_de_ensaio(ensaio),
    }
    for nome, doc in EDICOES.items():
        contraf[nome] = {
            "medida": gate.measure(str(doc.relative_to(RAIZ)), str(ensaio)),
            "reconcile": correr("core.reconcile", str(doc.relative_to(RAIZ)), str(ensaio)),
            "attributions": correr("core.attributions", str(doc.relative_to(RAIZ)), str(ensaio)),
        }
    contraf["par_md_html"] = correr("core.editions", str(RELATORIO.relative_to(RAIZ)),
                                    str(HTML.relative_to(RAIZ)), str(ensaio))
    saida["contrafactual"] = contraf

    # A PLANTA NO VALOR, na mesma cópia de ensaio: um algarismo trocado numa
    # ocorrência única de uma figura com linha, e os bytes repostos a seguir.
    copia = tmp / "edicao.html"
    original = HTML.read_bytes()
    copia.write_bytes(original)
    base = gate.measure(str(copia), str(ensaio))
    texto = original.decode("utf-8")
    assert texto.count("6,00") == 1, "a planta deixou de ser uma ocorrencia unica"
    permitidos, ignorados = __import__("core.reconcile", fromlist=["load_ledger"]).load_ledger(ensaio)
    canonico_da_planta = {"canonico": "6.8", "e_valor_de_alguma_linha": "6.8" in permitidos,
                          "esta_na_lista_ignore": "6.8" in ignorados}
    copia.write_text(texto.replace("6,00", "6,80"), encoding="utf-8")
    com = gate.measure(str(copia), str(ensaio))
    travada = gate.ratchet(com, base)
    copia.write_bytes(original)
    reposta = gate.measure(str(copia), str(ensaio))
    saida["planta_valor"] = {
        "_": "MEDIDA NA MESMA COPIA DE ENSAIO. A linha fig81-penalizacao-legal imprime "
             "6,00 uma unica vez na edicao HTML; 6,80 nao e valor de nenhuma linha nem "
             "simbolo ignorado.",
        "linha": "fig81-penalizacao-legal", "de": "6,00", "para": "6,80",
        "confirmado_antes_de_plantar": canonico_da_planta,
        "sha256_antes": hashlib.sha256(original).hexdigest(),
        "sha256_com_a_planta": hashlib.sha256(
            texto.replace("6,00", "6,80").encode("utf-8")).hexdigest(),
        "sha256_reposta": hashlib.sha256(copia.read_bytes()).hexdigest(),
        "base": base, "com_a_planta": com, "ratchet": travada,
        "veredito_com_a_planta": "FAIL (ratchet)" if travada else "ok",
        "reposta": reposta, "ratchet_reposta": gate.ratchet(reposta, base),
        "veredito_reposta": "FAIL (ratchet)" if gate.ratchet(reposta, base) else "ok",
    }

    # As fontes do estudo, que o brief do M4 supôs estarem só no Drive do diretor.
    # Não estão: vivem na árvore principal, excluídas do repositório pelo
    # `.gitignore`. Medido aqui para o relatório não o afirmar de memória.
    principal = arvore_com_as_fontes()
    manifesto = {}
    for linha in (ESTUDO / "source" / "MANIFEST.sha256").read_text(encoding="utf-8").splitlines():
        if linha.strip():
            resumo, nome = linha.split(None, 1)
            manifesto[nome.strip()] = resumo
    fontes = {}
    for nome in ("Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf", "relatorio-full.txt"):
        alvo = principal / "content" / "11 Seguranca Social" / "source" / nome
        if alvo.exists():
            lido = hashlib.sha256(alvo.read_bytes()).hexdigest()
            fontes[nome] = {"na_arvore_principal": True, "sha256": lido,
                            "bate_com_o_manifesto": manifesto.get(nome) == lido}
        else:
            fontes[nome] = {"na_arvore_principal": False}
    excluido = subprocess.run(
        ["git", "check-ignore", "-v",
         "content/11 Seguranca Social/source/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf",
         "content/11 Seguranca Social/source/relatorio-full.txt"],
        cwd=principal, capture_output=True, text=True)
    saida["fontes_do_estudo"] = {
        "_": "Lidas da árvore principal, que é onde as cópias vivem; a worktree não as tem.",
        "ficheiros": fontes,
        "linhas_do_gitignore": [int(l.split(":")[1]) for l in
                                excluido.stdout.splitlines() if ":" in l],
        "pdf_vistos_pelo_mesmo_find_conhecido_positivo": len(
            list((principal / "content").rglob("*.pdf"))
            + list((principal / "publisher").rglob("*.pdf"))
            + list((principal / "indicators").rglob("*.pdf"))),
    }

    # AS DUAS LINHAS QUE PODEM DECLARAR O CAMPO, conferidas contra o relatório de
    # origem, e as duas que parecem poder e não podem. Tudo lido do livro e da
    # fonte: a frase confere-se INTEIRA, tal como a linha a gravou, e não por um
    # pedaço escolhido à mão que passaria mesmo que a linha citasse outra coisa
    # (22.09.2026, achado 10 da leitura a frio).
    texto_da_fonte = (principal / "content" / "11 Seguranca Social" / "source"
                      / "relatorio-full.txt")
    if texto_da_fonte.exists():
        dobrado = dobrar(texto_da_fonte.read_text(encoding="utf-8", errors="replace"))
        por_id = {c["id"]: c for c in json.loads(LIVRO.read_text(encoding="utf-8"))["claims"]}
        podem = [rid for rid, t in saida["estado_do_livro"]["tres_recusas_das_nove"].items()
                 if t["pode_declarar_value_not_numeric"]]
        frases = {}
        for rid in podem:
            citadas = citacoes(str(por_id[rid].get("excerpt") or ""))
            frases[rid] = {
                "valor": str(por_id[rid]["value"]),
                "frases_que_a_linha_cita": citadas,
                "todas_na_fonte": all(dobrar(f) in dobrado for f in citadas),
                "a_que_traz_o_valor": [f for f in citadas
                                       if str(por_id[rid]["value"]) in f],
            }
        # As que parecem poder: a palavra existe na fonte e NÃO está no excerpt da
        # própria linha. As duas coisas calculadas, nenhuma escrita.
        parecem = {}
        for rid, palavra in (("fs-dupla-contagem", "dupla contagem"),
                             ("ch12-sem-base-administrativa", "inexistente")):
            linha = por_id[rid]
            janelas = [re.sub(r"\s+", " ", dobrado[max(0, m.start() - 170): m.end() + 170])
                       for m in re.finditer(re.escape(palavra), dobrado)]
            # O que a linha diz que a palavra é sobre: a base administrativa. Se
            # nenhuma janela da fonte falar de base, a palavra da fonte não é a
            # da linha, e isso decide-se contando e não opinando.
            sobre_base = [j for j in janelas
                          if re.search(r"base (administrativa|quantitativa)", j)]
            parecem[palavra] = {
                "linha": rid,
                "ocorrencias_na_fonte": len(janelas),
                "no_excerpt_da_propria_linha": str(linha["value"]) in str(linha.get("excerpt") or ""),
                "ocorrencias_junto_a_base_administrativa": len(sobre_base),
                "janelas": janelas,
            }
        saida["verificacao_na_fonte"] = {
            "ficheiro": "content/11 Seguranca Social/source/relatorio-full.txt",
            "_": "Uma frase é citada inteira, como a linha a gravou, e procurada na "
                 "fonte com acentos dobrados dos dois lados.",
            "frases_das_que_podem_declarar": frases,
            "as_que_parecem_poder": parecem,
        }

    # A carga bruta que NÃO é um livro, para o discriminador do portão novo.
    carga = RAIZ / "content" / "06 Évora Economy" / "Technical Source" / "raw" / "web_investment_claims.json"
    dados_da_carga = json.loads(carga.read_text(encoding="utf-8"))
    saida["carga_bruta_do_06"] = {
        "caminho": str(carga.relative_to(RAIZ)),
        "linhas_chamadas_claims": len(dados_da_carga["claims"]),
        "linhas_com_id_e_value": sum(1 for l in dados_da_carga["claims"]
                                     if isinstance(l, dict) and "id" in l and "value" in l),
        "e_livro_para_o_portao": gate.e_livro(dados_da_carga),
        "campos_da_primeira_linha": sorted(dados_da_carga["claims"][0].keys()),
    }

    # A adjacência que o `core.prose` aponta na edição HTML, citada tal e qual.
    texto_html = HTML.read_text(encoding="utf-8")
    trecho = "0,50% para 25 a 34, 0,65% para 35 a 39"
    saida["adjacencia_citada"] = {"trecho": trecho, "esta_na_edicao": trecho in texto_html}

    # OS TOTAIS QUE O RELATÓRIO ESCREVE POR EXTENSO, com as parcelas ao lado
    # (22.09.2026, achado 7 da leitura a frio: «quatrocentos e dezassete» e
    # «cento e quatro» não tinham casa em lado nenhum). Um total é uma soma, e
    # uma soma escreve-se com as parcelas ou não se escreve.
    html_c = saida["contrafactual"]["html"]["medida"]
    md_c = saida["contrafactual"]["relatorio-md"]["medida"]
    saida["totais"] = {
        "_": "Somas das duas edições, medidas na cópia de ensaio do contrafactual.",
        "orfaos_das_duas_edicoes": {
            "parcelas": {"html": html_c["orphans"], "relatorio-md": md_c["orphans"]},
            "total": html_c["orphans"] + md_c["orphans"]},
        "atribuicoes_erradas_das_duas_edicoes": {
            "parcelas": {"html": html_c["misattributions"],
                         "relatorio-md": md_c["misattributions"]},
            "total": html_c["misattributions"] + md_c["misattributions"]},
        "numeros_impressos_pelas_duas_edicoes": {
            "parcelas": {"html": html_c["numbers"], "relatorio-md": md_c["numbers"]},
            "total": html_c["numbers"] + md_c["numbers"]},
    }

    # A PLANTA DE PONTA A PONTA, lida do ficheiro que a corrida deixou. O
    # relatório citava uma saída que não estava em ficheiro nenhum (achado 8):
    # uma saída que só existe numa mensagem é uma saída que ninguém pode reler.
    corrida = AQUI / "planta-livro-nao-declarado.txt"
    if corrida.exists():
        texto_corrida = corrida.read_text(encoding="utf-8")
        linha_livros = next((l for l in texto_corrida.splitlines()
                             if "livros declarados" in l), "")
        linha_veredito = next((l for l in texto_corrida.splitlines()
                               if l.startswith("GATE: ")), "")
        linha_saida = next((l for l in texto_corrida.splitlines()
                            if l.startswith("SAIDA DO PORTAO:")), "")
        nomeiam = [l for l in texto_corrida.splitlines() if "sem entregável" in l]
        saida["planta_livro_nao_declarado"] = {
            "ficheiro": corrida.name,
            "plantado": "content/15 Orcamento do Estado 2027/ledger.json",
            "linha_dos_livros": linha_livros.strip(),
            "livros_com_a_planta": int(re.search(r"\((\d+) livro", linha_livros).group(1)),
            "json_lidos_com_a_planta": int(re.search(r"em (\d+) JSON", linha_livros).group(1)),
            "excecoes_escritas": int(re.search(r"(\d+) exceção", linha_livros).group(1)),
            "ilegiveis": int(re.search(r"(\d+) ilegível", linha_livros).group(1)),
            "linha_do_veredito": linha_veredito.strip(),
            "problemas": int(re.search(r"— (\d+) problem", linha_veredito).group(1)),
            "saida_do_portao": int(linha_saida.split(":")[1]),
            "linhas_que_nomeiam_a_planta": len(nomeiam),
            "outras_conferencias_vermelhas": len(
                [l for l in texto_corrida.splitlines()
                 if re.match(r"GATE  .*FAIL", l) and "livros declarados" not in l]),
        }

    # A SUÍTE DO PORTÃO, contada pela própria saída da suíte e não à mão. A
    # separação entre planta e controlo lê-se do nome de cada conferência: uma
    # planta é um defeito que TEM de fechar o portão, e chama-se «caught» ou
    # «refused»; um controlo é uma coisa que tem de passar.
    suite = subprocess.run([sys.executable, "-m", "core.gate_test"], cwd=RAIZ,
                           capture_output=True, text=True)
    linha_pass = next((l for l in suite.stdout.splitlines()
                       if l.startswith("GATE_TEST: PASS")), "")
    inventario = re.search(r"PASS — (\d+) checks \((.+)\)\s*$", linha_pass)
    nomes = [n.strip() for n in inventario.group(2).split(", ")] if inventario else []
    antigas = ["clean measure", "orphan ratchet", "equal/improved pass",
               "misattribution ratchet", "structural raise", "update refuses a rise",
               "update records one when asked"]
    novas = [n for n in nomes if n not in antigas]
    saida["suite_do_portao"] = {
        "saida": suite.returncode,
        "linha_pass": linha_pass.strip(),
        "conferencias": int(inventario.group(1)) if inventario else None,
        "inventario": nomes,
        "novas_deste_bloco": novas,
        "n_novas": len(novas),
        "plantas": [n for n in novas if n.endswith("caught") or n.endswith("refused")],
        "controlos": [n for n in novas
                      if not (n.endswith("caught") or n.endswith("refused"))],
    }
    saida["suite_do_portao"]["n_plantas"] = len(saida["suite_do_portao"]["plantas"])
    saida["suite_do_portao"]["n_controlos"] = len(saida["suite_do_portao"]["controlos"])

    # A EXCEÇÃO DA TRAVESSIA, com as linhas contadas do ficheiro e a razão citada
    # da nota do próprio ficheiro, com a frase inteira (achado 7).
    travessia = RAIZ / "content" / "03 Regional Economy" / "Travessia das Regioes" / "ledger.json"
    if travessia.exists():
        dados_t = json.loads(travessia.read_text(encoding="utf-8"))
        nota = " ".join(dados_t.get("_", [])) if isinstance(dados_t.get("_"), list) else str(dados_t.get("_", ""))
        i = nota.find("PORQUE NÃO ESTÃO")
        saida["excecao_travessia"] = {
            "caminho": str(travessia.relative_to(RAIZ)),
            "linhas": len(dados_t["claims"]),
            "citado": nota[i:].strip() if i >= 0 else nota.strip(),
            "_": "A razão é a nota do próprio ficheiro, citada e não reescrita.",
        }

    # AS LINHAS COM RESSALVA DE VERIFICAÇÃO, procuradas no livro e não lembradas.
    # Não são falha estrutural e não entram nas 28: são dívida de conteúdo.
    ressalvas = {}
    for c in json.loads(LIVRO.read_text(encoding="utf-8"))["claims"]:
        inteira = json.dumps(c, ensure_ascii=False)
        achadas = [a for a in ("por confirmar", "[verify]", "por fechar")
                   if a.lower() in inteira.lower()]
        if achadas:
            ressalvas[c["id"]] = {"ressalvas": achadas, "nota": str(c.get("note") or "")[:400]}
    saida["linhas_com_ressalva_de_verificacao"] = {
        "n": len(ressalvas), "linhas": ressalvas,
        "_": "Dívida de conteúdo para o M4b; fora da contagem das 28 recusas estruturais.",
    }

    cfg = gate.load_config()
    varredura = gate.varrer_conteudo()
    raiz_real, conteudo_real = gate.ROOT, gate.CONTENT
    try:
        gate.ROOT, gate.CONTENT = principal, principal / "content"
        varredura_principal = gate.varrer_conteudo()
    finally:
        gate.ROOT, gate.CONTENT = raiz_real, conteudo_real
    saida["varredura_de_content"] = {
        "_": "A mesma varredura nas duas árvores. A principal traz também os "
             "ficheiros excluídos do repositório, que a worktree não tem.",
        "worktree": {"json_lidos": varredura["json_lidos"],
                     "livros": len(varredura["livros"]),
                     "ilegiveis": varredura["ilegiveis"]},
        "arvore_principal": {"json_lidos": varredura_principal["json_lidos"],
                             "livros": len(varredura_principal["livros"]),
                             "ilegiveis": varredura_principal["ilegiveis"]},
    }
    orfaos, defeitos = gate.livros_sem_entregavel(cfg, varredura)
    saida["portao_dos_livros_declarados"] = {
        "livros_sob_content": gate.livros_no_conteudo(),
        "n_livros": len(gate.livros_no_conteudo()),
        "n_entregaveis": len(cfg.get("deliverables", [])),
        "n_livros_declarados": len({d["ledger"] for d in cfg.get("deliverables", [])}),
        "excecoes": [e["ledger"] for e in cfg.get("ledgers_without_deliverable", [])],
        "orfaos": orfaos, "defeitos_da_lista": defeitos,
        "veredito": "ok" if not orfaos and not defeitos else "FAIL",
        "divida_de_registo_previo": {
            "estudos_sem_registo": sorted({
                Path(d["ledger"]).parent.name for d in cfg.get("deliverables", [])
                if not (RAIZ / Path(d["ledger"]).parent / "preregistration.json").exists()}),
            "_": "Fica em oito porque o 11 não foi declarado; um registo escrito "
                 "depois da recolha não certifica nada e não se escreve.",
        },
    }
    saida["portao_dos_livros_declarados"]["divida_de_registo_previo"]["n"] = len(
        saida["portao_dos_livros_declarados"]["divida_de_registo_previo"]["estudos_sem_registo"])

    # Os precedentes de `value_not_numeric` na casa, para o §7 do relatório.
    precedentes = {}
    for livro in map(Path, gate.livros_no_conteudo()):
        dados = json.loads((RAIZ / livro).read_text(encoding="utf-8"))
        vnn = [c for c in dados["claims"] if c.get("value_not_numeric")]
        if vnn:
            precedentes[str(livro)] = {
                "n": len(vnn),
                "valores": sorted({str(c["value"]) for c in vnn}),
                "todos_com_o_valor_no_proprio_excerpt": all(
                    str(c["value"]) in str(c.get("excerpt") or "") for c in vnn),
            }
    saida["precedentes_de_value_not_numeric"] = {
        "livros": precedentes,
        "total_de_linhas": sum(p["n"] for p in precedentes.values()),
    }

    destino = AQUI / "medidas.json"
    destino.write_text(json.dumps(saida, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"MEDIDAS: escritas em {destino.relative_to(RAIZ)}")
    sem_casa = conferir(destino, AQUI / "RELATORIO-portao-2026-09-22.md")
    if sem_casa:
        print(f"CONFERENCIA: FAIL — {len(sem_casa)} numero(s) do relatorio sem casa "
              f"no medidas.json:")
        for n in sem_casa:
            print("  x", n)
        return 1
    print("CONFERENCIA: ok — cada numero do relatorio, em algarismos ou por extenso, "
          "resolve no medidas.json ou numa razao escrita")
    print(f"  livro: {saida['estado_do_livro']['linhas']} linhas, "
          f"{saida['estado_do_livro']['linhas_recusadas']} recusadas pela validacao do motor")
    print(f"  livros sob content/: {saida['portao_dos_livros_declarados']['n_livros']}, "
          f"orfaos: {saida['portao_dos_livros_declarados']['orfaos']}")
    print(f"  planta no valor: {saida['planta_valor']['veredito_com_a_planta']} -> "
          f"{saida['planta_valor']['veredito_reposta']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
