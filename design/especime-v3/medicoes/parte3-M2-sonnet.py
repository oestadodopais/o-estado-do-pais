#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BRIEF-parte3-M2 -- a medicao cega das oito paginas de leitura

Escrito de raiz pelo medidor (Claude Sonnet), a partir do programa da M1
(parte3-M1-sonnet.py, tambem meu). Nao importa nada de OEstadoDoPais/src,
OEstadoDoPais/scripts nem do node_modules do sitio. Usa apenas a biblioteca
padrao de Python: html.parser como tokenizador; json/re/difflib/collections
para o resto. A arvore, o percurso e toda a logica de comparacao sao codigo
proprio.

Face ao programa da M1, este:
  * cobre as oito edicoes com registo (nao so as tres do exemplar M1);
  * reescreve a medicao 6 para a regra que mudou (BRIEF-parte3-M2.md SS1b):
    uma figura sem linha do sitio, dentro de uma ligacao do documento, so
    conta como "com porta" se houver uma ancora <a class="texto-figura-
    porta-apos"> a seguir a ligacao (uma por figura sem linha que a ligacao
    contem, pela ordem das figuras); a forma antiga (so a entrada em "As
    linhas deste documento") conta agora como SEM porta;
  * acrescenta as medicoes 13 (dist/prova.json), 14 (dist/cadeia.json) e 15
    (as ligacoes do documento).

Corre: python3 parte3-M2-sonnet.py [--dist PATH] [--json OUT.json]

Imprime um resumo humano em stderr e, com --json, escreve o resultado
completo em JSON (usado para compor o relatorio Markdown ao lado).

Antes de medir a corrida real, `--selftest` corre um conjunto de provas de
mutacao sobre HTML/JSON sinteticos, focadas no codigo novo ou reescrito
desta corrida (a medicao 6 nova, as medicoes 13/14/15). Corre sempre por
omissao antes da medicao real; usa --no-selftest para saltar.
"""

import argparse
import collections
import difflib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

# ---------------------------------------------------------------------------
# 0. Caminhos
# ---------------------------------------------------------------------------

REPO = Path("/Users/nunosantos/Instruments/OEstadoDoPais")
DEFAULT_DIST = Path(
    "/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/"
    "96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/dist-p4"
)
REGISTOS = REPO / "registos"
LEDGER_PATH = REPO / "ledger" / "cruzamentos" / "evora.json"
MANIFEST_PATH = REGISTOS / "manifest.json"


def editions_for(dist):
    """As oito edicoes com registo (BRIEF-parte3-M2.md SS1). `run_m9` fica
    True apenas para as duas do 04 -- e a mesma restricao que a M1 usou
    ("medicao de controlo, so no 04"); o brief da M2 nao a revoga, so
    alarga as doze medicoes as oito edicoes."""
    return [
        {
            "key": "avaliacao-economica-regional-de-portugal-2026/pt",
            "slug": "avaliacao-economica-regional-de-portugal-2026",
            "lang": "pt",
            "record": REGISTOS / "avaliacao-economica-regional-de-portugal-2026" / "pt.record.json",
            "page": dist / "estudos" / "avaliacao-economica-regional-de-portugal-2026" / "texto" / "index.html",
            "documento": None,
            "chip_prefix": "/livro-razao/",
            "run_m9": False,
        },
        {
            "key": "evora-prometido-pago-auditado-2026/pt",
            "slug": "evora-prometido-pago-auditado-2026",
            "lang": "pt",
            "record": REGISTOS / "evora-prometido-pago-auditado-2026" / "pt.record.json",
            "page": dist / "estudos" / "evora-prometido-pago-auditado-2026" / "texto" / "index.html",
            "documento": dist / "estudos" / "evora-prometido-pago-auditado-2026" / "documento" / "index.html",
            "chip_prefix": "/livro-razao/",
            "run_m9": True,
        },
        {
            "key": "evora-prometido-pago-auditado-2026/en",
            "slug": "evora-prometido-pago-auditado-2026",
            "lang": "en",
            "record": REGISTOS / "evora-prometido-pago-auditado-2026" / "en.record.json",
            "page": dist / "en" / "studies" / "evora-prometido-pago-auditado-2026" / "text" / "index.html",
            "documento": dist / "en" / "studies" / "evora-prometido-pago-auditado-2026" / "document" / "index.html",
            "chip_prefix": "/en/ledger/",
            "run_m9": True,
        },
        {
            "key": "evora-economia-investidores-portas-abertas-2026/pt",
            "slug": "evora-economia-investidores-portas-abertas-2026",
            "lang": "pt",
            "record": REGISTOS / "evora-economia-investidores-portas-abertas-2026" / "pt.record.json",
            "page": dist / "estudos" / "evora-economia-investidores-portas-abertas-2026" / "texto" / "index.html",
            "documento": None,
            "chip_prefix": "/livro-razao/",
            "run_m9": False,
        },
        {
            "key": "evora-orcamentado-pago-devido-2025/pt",
            "slug": "evora-orcamentado-pago-devido-2025",
            "lang": "pt",
            "record": REGISTOS / "evora-orcamentado-pago-devido-2025" / "pt.record.json",
            "page": dist / "estudos" / "evora-orcamentado-pago-devido-2025" / "texto" / "index.html",
            "documento": None,
            "chip_prefix": "/livro-razao/",
            "run_m9": False,
        },
        {
            "key": "evora-orcamentado-pago-devido-2025/en",
            "slug": "evora-orcamentado-pago-devido-2025",
            "lang": "en",
            "record": REGISTOS / "evora-orcamentado-pago-devido-2025" / "en.record.json",
            "page": dist / "en" / "studies" / "evora-orcamentado-pago-devido-2025" / "text" / "index.html",
            "documento": None,
            "chip_prefix": "/en/ledger/",
            "run_m9": False,
        },
        {
            "key": "evora-quinze-anos-cinco-mandatos/pt",
            "slug": "evora-quinze-anos-cinco-mandatos",
            "lang": "pt",
            "record": REGISTOS / "evora-quinze-anos-cinco-mandatos" / "pt.record.json",
            "page": dist / "estudos" / "evora-quinze-anos-cinco-mandatos" / "texto" / "index.html",
            "documento": None,
            "chip_prefix": "/livro-razao/",
            "run_m9": False,
        },
        {
            "key": "evora-os-pelouros-quem-os-teve-o-que-fizeram/pt",
            "slug": "evora-os-pelouros-quem-os-teve-o-que-fizeram",
            "lang": "pt",
            "record": REGISTOS / "evora-os-pelouros-quem-os-teve-o-que-fizeram" / "pt.record.json",
            "page": dist / "estudos" / "evora-os-pelouros-quem-os-teve-o-que-fizeram" / "texto" / "index.html",
            "documento": None,
            "chip_prefix": "/livro-razao/",
            "run_m9": False,
        },
    ]


# ---------------------------------------------------------------------------
# 1. Um leitor de HTML proprio: html.parser (biblioteca padrao) so como
#    tokenizador; a arvore, o percurso e a leitura de texto sao codigo meu.
#    (Herdado da M1, inalterado -- ja provado la por 21 mutacoes; ver SS "o
#    que herdo sem re-provar" no relatorio.)
# ---------------------------------------------------------------------------

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


class El:
    __slots__ = ("tag", "attrs", "children", "parent")

    def __init__(self, tag, attrs, parent):
        self.tag = tag
        self.attrs = attrs
        self.children = []
        self.parent = parent

    def __repr__(self):
        return f"<{self.tag} {self.attrs}>"


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = El("#root", {}, None)
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = El(tag, dict(attrs), self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        node = El(tag, dict(attrs), self.stack[-1])
        self.stack[-1].children.append(node)

    def handle_endtag(self, tag):
        for idx in range(len(self.stack) - 1, 0, -1):
            if self.stack[idx].tag == tag:
                del self.stack[idx:]
                return

    def handle_data(self, data):
        if data:
            self.stack[-1].children.append(data)

    def handle_comment(self, data):
        pass


def parse_html(text):
    tb = TreeBuilder()
    tb.feed(text)
    tb.close()
    return tb.root


# ---------------------------------------------------------------------------
# 2. Percurso da arvore e a leitura do olho (regra da SS2 do brief M1)
# ---------------------------------------------------------------------------

def descendants(el):
    for c in el.children:
        if isinstance(c, El):
            yield c
            yield from descendants(c)


def has_class(el, cls):
    c = el.attrs.get("class") or ""
    return cls in c.split()


WS_RE = re.compile(r"\s+")


def read_text(el):
    """SS2: os nos de texto dentro da unidade juntam-se sem nada pelo meio;
    uma corrida de espaco em branco vale um espaco; sem espaco a cabeca nem
    a cauda; o texto do selo (.src-chip) nao conta."""
    if has_class(el, "src-chip"):
        return ""
    parts = []

    def walk(node):
        for c in node.children:
            if isinstance(c, str):
                parts.append(c)
            else:
                if c.tag in ("script", "style"):
                    continue
                if has_class(c, "src-chip"):
                    continue
                walk(c)

    walk(el)
    return WS_RE.sub(" ", "".join(parts)).strip()


def direct_text_is_empty(el):
    for c in el.children:
        if isinstance(c, str) and c.strip():
            return False
    return True


def is_within(el, boundary):
    """el esta dentro (ou e) de um ancestral com a classe 'src-chip', parando em boundary."""
    p = el
    while p is not None and p is not boundary.parent:
        if has_class(p, "src-chip"):
            return True
        if p is boundary:
            break
        p = p.parent
    return False


def next_element_sibling_run(el, wanted_classes):
    """A corrida maxima de irmaos de `el`, dentro do mesmo pai, que sao
    elementos com uma das classes em `wanted_classes`, tolerando texto em
    branco pelo meio e parando no primeiro texto nao-branco ou elemento que
    nao bate. Devolve uma lista de (classe_batida, El)."""
    parent = el.parent
    siblings = parent.children
    idx = siblings.index(el)
    out = []
    for sib in siblings[idx + 1:]:
        if isinstance(sib, str):
            if sib.strip() == "":
                continue
            else:
                break
        else:
            matched = None
            for cls in wanted_classes:
                if has_class(sib, cls):
                    matched = cls
                    break
            if matched is not None:
                out.append((matched, sib))
                continue
            break
    return out


# ---------------------------------------------------------------------------
# 3. O leitor do registo (JSON) -- indexado pela mesma gramatica de
#    coordenadas que a pagina usa: <b>, <b>.<i>, <b>.<r>.<c>, com o indice
#    da figura acrescentado. (Herdado da M1, inalterado.)
# ---------------------------------------------------------------------------

def coord_sort_key(c):
    try:
        return tuple(int(x) for x in c.split("."))
    except ValueError:
        return (10 ** 9, c)


def walk_record(record):
    blocks = []
    units = {}
    figures = {}
    emphasis_links = []
    rows_all = collections.defaultdict(list)
    anomalies = []

    KNOWN_KINDS = {"heading", "paragraph", "list", "table", "rule", "note"}

    for b_obj in record["blocks"]:
        b = b_obj["i"]
        kind = b_obj["kind"]
        if kind not in KNOWN_KINDS:
            anomalies.append(f"bloco {b}: genero desconhecido {kind!r}")
        blocks.append({
            "b": b, "kind": kind,
            "level": b_obj.get("level"),
            "ordered": b_obj.get("ordered"),
        })

        def register_unit(coord, text, figs, emph, links, header=None):
            units[coord] = {"text": text, "header": header}
            for fi, fig in enumerate(figs):
                fcoord = f"{coord}.{fi}"
                fig2 = dict(fig)
                fig2["container_text"] = text
                fig2["unit_coord"] = coord
                fig2["fig_index_in_unit"] = fi
                figures[fcoord] = fig2
                rows_all[fig["row"]].append(fig2)
            for e in emph:
                emphasis_links.append({
                    "unit_coord": coord, "kind": "emphasis",
                    "sub_kind": e["kind"], "start": e["start"], "end": e["end"],
                    "container_text": text,
                })
            for l in links:
                emphasis_links.append({
                    "unit_coord": coord, "kind": "link",
                    "href": l["href"], "start": l["start"], "end": l["end"],
                    "container_text": text,
                })

        if kind in ("heading", "paragraph"):
            register_unit(str(b), b_obj["text"], b_obj.get("figures", []),
                          b_obj.get("emphasis", []), b_obj.get("links", []))
        elif kind == "list":
            for i, item in enumerate(b_obj.get("items", [])):
                coord = f"{b}.{i}"
                register_unit(coord, item["text"], item.get("figures", []),
                              item.get("emphasis", []), item.get("links", []))
        elif kind == "table":
            for r, row in enumerate(b_obj.get("rows", [])):
                for c, cell in enumerate(row):
                    coord = f"{b}.{r}.{c}"
                    register_unit(coord, cell["text"], cell.get("figures", []),
                                  cell.get("emphasis", []), cell.get("links", []),
                                  header=bool(cell.get("header", False)))
        elif kind == "rule":
            pass
        elif kind == "note":
            register_unit(str(b), b_obj.get("text", ""), b_obj.get("figures", []), [], [])
        else:
            pass

    return {
        "blocks": blocks, "units": units, "figures": figures,
        "emphasis_links": emphasis_links, "rows": rows_all, "anomalies": anomalies,
    }


# ---------------------------------------------------------------------------
# 4. O indexador da pagina construida (herdado da M1, inalterado)
# ---------------------------------------------------------------------------

def index_page(root):
    article = None
    for el in descendants(root):
        if el.tag == "article":
            article = el
            break
    if article is None:
        raise RuntimeError("nao encontrei <article> na pagina")

    page_blocks = {}
    page_units = {}
    page_figures = {}
    linha_ids = set()
    linha_fields = {}
    conta = {}
    href_linha_targets = []

    for el in descendants(root):
        if "data-registo-bloco" in el.attrs:
            try:
                page_blocks[int(el.attrs["data-registo-bloco"])] = el
            except ValueError:
                pass
        if "data-registo-unidade" in el.attrs:
            val = el.attrs["data-registo-unidade"]
            if "#" in val:
                coord = val.split("#", 1)[1]
                page_units[coord] = el
        if "data-registo" in el.attrs:
            val = el.attrs["data-registo"]
            if "#" in val:
                coord = val.split("#", 1)[1]
                page_figures[coord] = el
        _id = el.attrs.get("id", "")
        if _id.startswith("linha-"):
            linha_ids.add(_id[len("linha-"):])
        if "data-registo-linha" in el.attrs:
            val = el.attrs["data-registo-linha"]
            if "@" in val:
                rest = val.split("@", 1)[1]
                if "." in rest:
                    row, field = rest.rsplit(".", 1)
                    linha_fields[(row, field)] = el
        if "data-registo-conta" in el.attrs:
            val = el.attrs["data-registo-conta"]
            if "=" in val:
                field = val.split("=", 1)[1]
                conta[field] = el
        if el.tag == "a" and el.attrs.get("href", "").startswith("#linha-"):
            row = el.attrs["href"][len("#linha-"):]
            href_linha_targets.append((row, el))

    return {
        "article": article, "blocks": page_blocks, "units": page_units,
        "figures": page_figures, "linha_ids": linha_ids,
        "linha_fields": linha_fields, "conta": conta,
        "href_linha_targets": href_linha_targets,
    }


# ---------------------------------------------------------------------------
# 5. A classificacao de uma figura no DOM -- REESCRITA para a regra da M2
#    SS1b. Muda de figura-a-figura para figura-agrupada-pela-ligacao-que-a-
#    contem, porque a nova forma valida (a ancora "-porta-apos") vive depois
#    da ligacao inteira, e nao junto de cada figura.
# ---------------------------------------------------------------------------

def find_ancestor_link(fig_el, article):
    """A ligacao do documento mais proxima que contem fig_el (parando em
    article), ou None. Nunca inclui a propria fig_el nem um .src-chip."""
    p = fig_el.parent
    while p is not None and p is not article.parent:
        if p is article:
            return None
        if p.tag == "a" and not has_class(p, "src-chip"):
            return p
        p = p.parent
    return None


def classify_figure_dom(fig_el, article):
    href = fig_el.attrs.get("href")
    is_porta_link = (fig_el.tag == "a" and href is not None and href.startswith("#linha-"))
    porta_row = href[len("#linha-"):] if is_porta_link else None
    # uma figura que e a sua propria ancora nao pode tambem estar aninhada
    # dentro de outra ligacao (HTML nao aninha <a>); so procuro a ligacao
    # envolvente quando a figura NAO e ela propria a ancora.
    link_el = None if is_porta_link else find_ancestor_link(fig_el, article)
    return {
        "is_porta_link": is_porta_link,
        "porta_row": porta_row,
        "link_el": link_el,
    }


def standalone_next_chip(fig_el):
    """Para uma figura FORA de uma ligacao do documento: o selo, se algum,
    colado a seguir a propria figura, dentro do mesmo pai."""
    run = next_element_sibling_run(fig_el, ["src-chip"])
    return run[0][1] if run else None


def measure_6_selos_portas(record_data, page_idx, manifest_entry, crossing_idx, chip_prefix):
    """Reescrita para BRIEF-parte3-M2.md SS1b. Quatro contagens pedidas pelo
    brief M1 (com_linha_selo_certo, com_linha_selo_errado_ou_falta,
    sem_linha_com_porta, sem_linha_com_selo) mais duas categorias que separo
    para clareza: sem_linha_forma_antiga_sem_porta (a discordancia nova desta
    medicao -- so a entrada, sem ancora propria) e anomalias (nao cabe em
    nenhuma das anteriores)."""
    rh_study = manifest_entry["rh_study"]
    article = page_idx["article"]

    figs_by_link = {}
    standalone = []

    for coord, fig_el in page_idx["figures"].items():
        rec_fig = record_data["figures"].get(coord)
        if rec_fig is None:
            continue  # ja reportado nas medicoes 3/4
        row = rec_fig["row"]
        has_site = (rh_study, row) in crossing_idx
        cls = classify_figure_dom(fig_el, article)
        if cls["link_el"] is not None:
            key = id(cls["link_el"])
            bucket = figs_by_link.setdefault(key, {"el": cls["link_el"], "items": []})
            bucket["items"].append((coord, fig_el, row, has_site))
        else:
            standalone.append((coord, fig_el, row, has_site, cls))

    b1, b2, b3, b4, b_old, b5 = [], [], [], [], [], []
    b3_detail = {"porta_propria": 0, "porta_apos_ligacao": 0}

    # -- figuras fora de qualquer ligacao do documento --
    for coord, fig_el, row, has_site, cls in standalone:
        if has_site:
            expected_site_id = crossing_idx[(rh_study, row)]
            chip = standalone_next_chip(fig_el)
            got_href = chip.attrs.get("href", "") if chip is not None else None
            if got_href == chip_prefix + expected_site_id:
                b1.append({"coord": coord, "row": row, "site_id": expected_site_id})
            else:
                b2.append({"coord": coord, "expected": chip_prefix + expected_site_id,
                           "read": got_href or "(sem selo colado a seguir)"})
        else:
            if cls["is_porta_link"] and cls["porta_row"] == row and row in page_idx["linha_ids"]:
                b3.append({"coord": coord, "row": row, "via": "porta (a propria figura e a ancora)"})
                b3_detail["porta_propria"] += 1
            else:
                chip = standalone_next_chip(fig_el)
                if chip is not None:
                    b4.append({"coord": coord, "expected": "(sem selo)",
                               "read": chip.attrs.get("href", "?")})
                else:
                    b5.append({
                        "coord": coord,
                        "expected": f"a propria figura como <a href=#linha-{row}>",
                        "read": f"tag={fig_el.tag} href={fig_el.attrs.get('href')!r} "
                                f"(figura autonoma, fora de ligacao, que nao e a sua propria porta)",
                    })

    # -- figuras dentro de uma ligacao do documento, agrupadas pela ligacao --
    for _, bucket in figs_by_link.items():
        link_el = bucket["el"]
        items = bucket["items"]  # ordem de documento (o percurso ja o garante)
        expected_seq = []
        for coord, fig_el, row, has_site in items:
            if has_site:
                expected_seq.append(("chip", crossing_idx[(rh_study, row)], coord, row))
            else:
                expected_seq.append(("porta_apos", row, coord, row))

        actual_seq = next_element_sibling_run(link_el, ["src-chip", "texto-figura-porta-apos"])

        for i, (kind, target, coord, row) in enumerate(expected_seq):
            got = actual_seq[i] if i < len(actual_seq) else None
            if kind == "chip":
                expected_href = chip_prefix + target
                if got is not None and got[0] == "src-chip" and got[1].attrs.get("href", "") == expected_href:
                    b1.append({"coord": coord, "row": row, "site_id": target})
                else:
                    if got is None:
                        read = "(sem selo depois da ligacao)"
                    elif got[0] == "src-chip":
                        read = got[1].attrs.get("href", "?")
                    else:
                        read = f"encontrei {got[0]!r} em vez de um selo, na mesma posicao"
                    b2.append({"coord": coord, "expected": expected_href, "read": read})
            else:  # porta_apos esperado
                expected_href = f"#linha-{row}"
                bare_entry_exists = row in page_idx["linha_ids"]
                ok = (got is not None and got[0] == "texto-figura-porta-apos"
                      and got[1].attrs.get("href", "") == expected_href
                      and read_text(got[1]) == "" and bare_entry_exists)
                if ok:
                    b3.append({"coord": coord, "row": row, "via": "porta-apos (ancora vazia depois da ligacao)"})
                    b3_detail["porta_apos_ligacao"] += 1
                elif got is None:
                    # a forma antiga (M1): so a entrada em "As linhas deste
                    # documento", sem ancora "-porta-apos" nenhuma a seguir a
                    # ligacao. A M2 SS1b torna isto SEM porta.
                    if bare_entry_exists:
                        b_old.append({
                            "coord": coord, "row": row,
                            "expected": f'<a class="texto-figura-porta-apos" href="{expected_href}"> depois da ligacao',
                            "read": '(nao existe; so a entrada em "As linhas deste documento" -- forma antiga, agora sem porta)',
                        })
                    else:
                        b5.append({"coord": coord,
                                   "expected": f"porta-apos depois da ligacao para {expected_href}",
                                   "read": "(nao encontrada, e a propria entrada linha-<row> tambem nao existe)"})
                elif got[0] == "src-chip":
                    b4.append({"coord": coord, "expected": "(sem selo; esta figura nao tem linha do sitio)",
                               "read": got[1].attrs.get("href", "?")})
                else:
                    # e um texto-figura-porta-apos, mas com href errado, ou
                    # com texto (deveria ser "sem texto"), ou a propria
                    # entrada linha-<row> nao existe -- anomalia distinta da
                    # "forma antiga" (ha uma ancora, so que nao serve).
                    problems = []
                    if got[1].attrs.get("href", "") != expected_href:
                        problems.append(f"href={got[1].attrs.get('href')!r} != {expected_href!r}")
                    if read_text(got[1]) != "":
                        problems.append(f"tem texto {read_text(got[1])!r} (devia ser vazia)")
                    if not bare_entry_exists:
                        problems.append(f"a entrada linha-{row} nao existe na pagina")
                    b5.append({"coord": coord, "expected": expected_href,
                               "read": "texto-figura-porta-apos presente mas: " + "; ".join(problems)})

        if len(actual_seq) > len(expected_seq):
            for kind, el in actual_seq[len(expected_seq):]:
                b5.append({
                    "coord": "(depois de uma ligacao, a mais)",
                    "expected": "(nada mais esperado depois desta ligacao)",
                    "read": f"{kind} href={el.attrs.get('href')!r}",
                })

    unresolved_portas = [(row, el) for row, el in page_idx["href_linha_targets"]
                          if row not in page_idx["linha_ids"]]

    discord = b2 + b4 + b_old + b5
    return {
        "com_linha_selo_certo": len(b1),
        "com_linha_selo_errado_ou_falta": len(b2),
        "sem_linha_com_porta": len(b3),
        "sem_linha_com_selo": len(b4),
        "sem_linha_forma_antiga_sem_porta": len(b_old),
        "anomalias": len(b5),
        "portas_por_resolver": len(unresolved_portas),
        "b3_detail": b3_detail,
        "detail": {"b1": b1, "b2": b2, "b3": b3, "b4": b4, "b_old": b_old, "b5": b5,
                   "unresolved_portas": [(row, "id nao encontrado") for row, _ in unresolved_portas]},
        "n_discord": len(discord) + len(unresolved_portas),
        "discord": discord + [{"coord": f"#linha-{row}", "expected": "id existente na pagina",
                                "read": "(id nao encontrado)"} for row, _ in unresolved_portas],
    }


# ---------------------------------------------------------------------------
# 6. Auxiliares gerais (herdados da M1, inalterados)
# ---------------------------------------------------------------------------

def trunc(s, n=120):
    if s is None:
        return "∅"
    s = str(s)
    return s if len(s) <= n else s[:n] + "…"


def diff_coord_maps(record_keys, page_keys):
    r, p = set(record_keys), set(page_keys)
    matched = sorted(r & p, key=coord_sort_key)
    missing = sorted(r - p, key=coord_sort_key)
    extra = sorted(p - r, key=coord_sort_key)
    return matched, missing, extra


# ---------------------------------------------------------------------------
# 7. As doze medicoes da M1 (1-5, 7-12 inalteradas; a 6 esta na seccao 5
#    acima; a 9 fica condicionada a run_m9, tal como na M1)
# ---------------------------------------------------------------------------

def block_signature_record(b):
    if b["kind"] == "heading":
        return ("heading", b["level"], None)
    if b["kind"] == "list":
        return ("list", None, bool(b["ordered"]))
    return (b["kind"], None, None)


HEADING_RE = re.compile(r"^h([1-6])$")


def block_signature_page(tag):
    m = HEADING_RE.match(tag)
    if m:
        return ("heading", int(m.group(1)), None)
    if tag == "p":
        return ("paragraph", None, None)
    if tag == "ul":
        return ("list", None, False)
    if tag == "ol":
        return ("list", None, True)
    if tag == "table":
        return ("table", None, None)
    if tag == "hr":
        return ("rule", None, None)
    return (f"desconhecido:{tag}", None, None)


def sig_str(sig):
    kind, level, ordered = sig
    if kind == "heading":
        return f"heading nivel {level}"
    if kind == "list":
        return f"list ordered={ordered}"
    return kind


def measure_1_blocks(record_data, page_idx):
    n_expected = len(record_data["blocks"])
    n_read = len(page_idx["blocks"])
    discord = []
    for b_obj in record_data["blocks"]:
        b = b_obj["b"]
        exp_sig = block_signature_record(b_obj)
        if b not in page_idx["blocks"]:
            discord.append({"coord": f"bloco {b}", "expected": sig_str(exp_sig),
                             "read": "(bloco ausente na pagina)"})
            continue
        el = page_idx["blocks"][b]
        read_sig = block_signature_page(el.tag)
        if read_sig != exp_sig:
            discord.append({"coord": f"bloco {b}", "expected": sig_str(exp_sig),
                             "read": sig_str(read_sig) + f" (tag <{el.tag}>)"})
    expected_ids = {b_obj["b"] for b_obj in record_data["blocks"]}
    extra_ids = set(page_idx["blocks"].keys()) - expected_ids
    for b in sorted(extra_ids):
        discord.append({"coord": f"bloco {b}", "expected": "(nao existe no registo)",
                         "read": sig_str(block_signature_page(page_idx["blocks"][b].tag))})
    return {"expected": n_expected, "read": n_read, "n_discord": len(discord), "discord": discord}


def measure_2_units(record_data, page_idx):
    matched, missing, extra = diff_coord_maps(record_data["units"].keys(), page_idx["units"].keys())
    discord = []
    n_equal = 0
    for coord in matched:
        exp_text = record_data["units"][coord]["text"]
        read = read_text(page_idx["units"][coord])
        if read == exp_text:
            n_equal += 1
        else:
            discord.append({"coord": coord, "expected": trunc(exp_text), "read": trunc(read)})
    for coord in missing:
        discord.append({"coord": coord, "expected": trunc(record_data["units"][coord]["text"]),
                         "read": "(unidade ausente na pagina)"})
    for coord in extra:
        discord.append({"coord": coord, "expected": "(nao existe no registo)",
                         "read": trunc(read_text(page_idx["units"][coord]))})
    return {"expected": len(record_data["units"]), "read": len(page_idx["units"]),
            "n_equal": n_equal, "n_discord": len(discord), "discord": discord}


def measure_3_figures(record_data, page_idx, manifest_entry):
    n_record_figs = len(record_data["figures"])
    n_page_figs = len(page_idx["figures"])
    n_manifest_refs = manifest_entry["referencias"]

    discord = []
    for coord, fig_el in page_idx["figures"].items():
        rec_fig = record_data["figures"].get(coord)
        if rec_fig is None:
            discord.append({"coord": coord, "expected": "(nao existe no registo)",
                             "read": trunc(read_text(fig_el)), "reason": "figura na pagina nao resolve no registo"})
            continue
        read = read_text(fig_el)
        if read != rec_fig["printed"]:
            discord.append({"coord": coord, "expected": trunc(rec_fig["printed"]), "read": trunc(read),
                             "reason": "printed != leitura da pagina"})

    internal_bad = []
    for coord, fig in record_data["figures"].items():
        ct = fig["container_text"]
        try:
            slice_ = ct[fig["start"]:fig["end"]]
        except Exception:
            slice_ = None
        if slice_ != fig["printed"]:
            internal_bad.append({"coord": coord, "expected": trunc(fig["printed"]),
                                  "read": trunc(slice_), "reason": "registo: text[start:end] != printed"})

    counts = {"pagina": n_page_figs, "manifesto_referencias": n_manifest_refs, "registo": n_record_figs}
    return {
        "expected": f"pagina={n_manifest_refs} manifesto={n_manifest_refs} registo={n_record_figs}",
        "read": f"pagina={n_page_figs} manifesto={n_manifest_refs} registo={n_record_figs}",
        "counts": counts, "counts_ok": (n_page_figs == n_manifest_refs == n_record_figs),
        "n_discord": len(discord) + len(internal_bad),
        "discord": discord, "internal_bad": internal_bad,
    }


def measure_4_no_missing_figures(record_data, page_idx):
    matched, missing, extra = diff_coord_maps(record_data["figures"].keys(), page_idx["figures"].keys())
    discord = []
    for coord in missing:
        fig = record_data["figures"][coord]
        discord.append({"coord": coord, "expected": trunc(fig["printed"]), "read": "(figura ausente na pagina)"})
    return {"expected": len(record_data["figures"]), "read": len(matched),
            "n_discord": len(discord), "discord": discord}


def measure_5_emphasis_links(record_data, page_idx):
    KIND_TAGS = {"strong": {"strong", "b"}, "em": {"em", "i"}, "code": {"code"}}
    discord = []
    n_total = len(record_data["emphasis_links"])
    n_found = 0
    for entry in record_data["emphasis_links"]:
        coord = entry["unit_coord"]
        expected_sub = entry["container_text"][entry["start"]:entry["end"]]
        unit_el = page_idx["units"].get(coord)
        if unit_el is None:
            discord.append({"coord": f"{coord} {entry['kind']}[{entry['start']}:{entry['end']}]",
                             "expected": trunc(expected_sub), "read": "(unidade ausente na pagina)"})
            continue
        found = False
        href_mismatch = None
        if entry["kind"] == "emphasis":
            tags = KIND_TAGS[entry["sub_kind"]]
            for cand in descendants(unit_el):
                if cand.tag in tags and not is_within(cand, unit_el):
                    if read_text(cand) == expected_sub:
                        found = True
                        break
        else:
            for cand in descendants(unit_el):
                if cand.tag == "a" and "href" in cand.attrs and not is_within(cand, unit_el):
                    if read_text(cand) == expected_sub:
                        if cand.attrs.get("href") == entry["href"]:
                            found = True
                            break
                        else:
                            href_mismatch = cand.attrs.get("href")
        if found:
            n_found += 1
        else:
            reason = "elemento nao encontrado"
            if href_mismatch is not None:
                reason = f"texto encontrado mas href={href_mismatch!r} != {entry['href']!r}"
            discord.append({"coord": f"{coord} {entry['kind']}[{entry['start']}:{entry['end']}]",
                             "expected": trunc(expected_sub), "read": reason})
    return {"expected": n_total, "read": n_found, "n_discord": len(discord), "discord": discord}


def measure_7_headers(record_data, page_idx):
    discord = []
    n_expected = 0
    n_ok = 0
    for coord, unit in record_data["units"].items():
        if unit["header"] is None:
            continue
        n_expected += 1
        el = page_idx["units"].get(coord)
        if el is None:
            discord.append({"coord": coord, "expected": "th" if unit["header"] else "td",
                             "read": "(celula ausente na pagina)"})
            continue
        want_tag = "th" if unit["header"] else "td"
        if el.tag == want_tag:
            n_ok += 1
        else:
            discord.append({"coord": coord, "expected": want_tag, "read": f"<{el.tag}>"})
    return {"expected": n_expected, "read": n_ok, "n_discord": len(discord), "discord": discord}


SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def measure_8_linhas(record_data, page_idx):
    expected_rows = {}
    for row, figs in record_data["rows"].items():
        values = [f["value"] for f in figs]
        seen_printed = []
        for f in figs:
            if f["printed"] not in seen_printed:
                seen_printed.append(f["printed"])
        origem = None
        for f in figs:
            src = f.get("source_sha256")
            this_origem = src if (src and SHA256_RE.match(src)) else f.get("source_digest_kind")
            if origem is None:
                origem = this_origem
        expected_rows[row] = {
            "valor": values[0] if values else None,
            "impresso": " · ".join(seen_printed),
            "origem": origem,
            "value_consistent": len(set(values)) <= 1,
            "distinct_values": sorted(set(values)),
        }

    all_row_ids_page = set(r for (r, field) in page_idx["linha_fields"].keys())
    read_rows = {}
    for row in all_row_ids_page:
        read_rows[row] = {
            "valor": read_text(page_idx["linha_fields"][(row, "valor")]) if (row, "valor") in page_idx["linha_fields"] else None,
            "impresso": read_text(page_idx["linha_fields"][(row, "impresso")]) if (row, "impresso") in page_idx["linha_fields"] else None,
            "origem": read_text(page_idx["linha_fields"][(row, "origem")]) if (row, "origem") in page_idx["linha_fields"] else None,
        }

    matched, missing, extra = diff_coord_maps(expected_rows.keys(), read_rows.keys())
    discord = []
    n_ok = 0
    value_inconsistent_rows = [r for r, v in expected_rows.items() if not v["value_consistent"]]
    for row in matched:
        exp = expected_rows[row]
        got = read_rows[row]
        bad = []
        if got["valor"] != exp["valor"]:
            bad.append(f"valor: esperado {trunc(exp['valor'])!r} lido {trunc(got['valor'])!r}")
        if got["impresso"] != exp["impresso"]:
            bad.append(f"impresso: esperado {trunc(exp['impresso'])!r} lido {trunc(got['impresso'])!r}")
        if got["origem"] != exp["origem"]:
            bad.append(f"origem: esperado {trunc(exp['origem'])!r} lido {trunc(got['origem'])!r}")
        if bad:
            discord.append({"coord": f"linha-{row}", "expected": "; ".join(bad).split(": ")[0],
                             "read": "; ".join(bad)})
        else:
            n_ok += 1
    for row in missing:
        discord.append({"coord": f"linha-{row}", "expected": "entrada presente",
                         "read": "(entrada ausente na pagina)"})
    for row in extra:
        discord.append({"coord": f"linha-{row}", "expected": "(nao e uma linha citada no registo)",
                         "read": "entrada presente na pagina"})

    return {"expected": len(expected_rows), "read": len(read_rows), "n_ok": n_ok,
            "n_discord": len(discord), "discord": discord,
            "value_inconsistent_rows": value_inconsistent_rows}


def measure_9_documento(page_idx, documento_root):
    seq_texto = [(n.tag, read_text(n)) for n in descendants(page_idx["article"]) if n.tag in ("p", "h2")]
    seq_doc = [(n.tag, read_text(n)) for n in descendants(documento_root) if n.tag in ("p", "h2")]

    sm = difflib.SequenceMatcher(None, seq_texto, seq_doc, autojunk=False)
    ops = sm.get_opcodes()
    equal_count = sum((i2 - i1) for (tag, i1, i2, j1, j2) in ops if tag == "equal")
    diffs = []
    for tag, i1, i2, j1, j2 in ops:
        if tag == "equal":
            continue
        diffs.append({
            "op": tag,
            "texto_idx": [i1, i2], "texto_items": [{"tag": t, "text": trunc(x)} for t, x in seq_texto[i1:i2]],
            "doc_idx": [j1, j2], "doc_items": [{"tag": t, "text": trunc(x)} for t, x in seq_doc[j1:j2]],
        })
    return {"expected": len(seq_texto), "read": equal_count, "n_discord": len(diffs),
            "n_texto_blocks": len(seq_texto), "n_doc_blocks": len(seq_doc), "diffs": diffs}


def measure_10_aparelho(record_data, page_idx, manifest_entry, crossing_idx):
    rh_study = manifest_entry["rh_study"]
    n_blocks = len(record_data["blocks"])
    n_figs = len(record_data["figures"])
    n_with_site = sum(1 for fig in record_data["figures"].values()
                       if (rh_study, fig["row"]) in crossing_idx)
    expected = {"blocos": n_blocks, "algarismos": n_figs, "com_linha_do_sitio": n_with_site}
    read = {}
    for field in ("blocos", "algarismos", "com_linha_do_sitio"):
        el = page_idx["conta"].get(field)
        txt = read_text(el) if el is not None else None
        try:
            read[field] = int(txt)
        except (TypeError, ValueError):
            read[field] = txt
    discord = []
    for field in ("blocos", "algarismos", "com_linha_do_sitio"):
        if expected[field] != read[field]:
            discord.append({"coord": field, "expected": expected[field], "read": read[field]})
    return {"expected": expected, "read": read, "n_discord": len(discord), "discord": discord}


DIGIT_RE = re.compile(r"[0-9]")


def measure_11_stray_digits(page_idx):
    article = page_idx["article"]
    findings = []

    def walk(node, under_unit, nearest_block):
        nb = nearest_block
        if "data-registo-bloco" in node.attrs:
            nb = node.attrs["data-registo-bloco"]
        uu = under_unit or ("data-registo-unidade" in node.attrs)
        for c in node.children:
            if isinstance(c, str):
                if not uu and DIGIT_RE.search(c):
                    findings.append({"coord": f"bloco {nb}" if nb is not None else "(fora de qualquer bloco)",
                                      "expected": "dentro de [data-registo-unidade]",
                                      "read": trunc(c.strip())})
            else:
                if c.tag in ("script", "style"):
                    continue
                walk(c, uu, nb)

    walk(article, False, None)
    return {"expected": 0, "read": len(findings), "n_discord": len(findings), "discord": findings}


ALLOWED_TAGS = {
    "h1", "h2", "h3", "h4", "p", "ul", "ol", "li", "table", "tr", "td", "th",
    "strong", "b", "em", "i", "code", "a", "span",
}


def measure_12_foreign_elements(page_idx):
    article = page_idx["article"]
    findings = []
    for el in descendants(article):
        if has_class(el, "src-chip"):
            continue
        if el.tag == "div":
            if direct_text_is_empty(el):
                continue
        elif el.tag in ALLOWED_TAGS:
            continue
        txt = read_text(el)
        if txt:
            findings.append({"coord": f"<{el.tag} class={el.attrs.get('class')!r}>",
                              "expected": "(nao deveria ter texto proprio)", "read": trunc(txt)})
    return {"expected": 0, "read": len(findings), "n_discord": len(findings), "discord": findings}


# ---------------------------------------------------------------------------
# 8. Medicao 15 (nova): as ligacoes do documento
# ---------------------------------------------------------------------------

def find_matching_anchor(unit_el, expected_text, expected_href):
    """Procura, dentro de unit_el (fora de qualquer .src-chip), um <a href>
    cujo texto (regra SS2) seja expected_text. Devolve (found, candidate_hrefs)."""
    got_hrefs = []
    for cand in descendants(unit_el):
        if cand.tag == "a" and "href" in cand.attrs and not is_within(cand, unit_el):
            if read_text(cand) == expected_text:
                got_hrefs.append(cand.attrs.get("href"))
                if cand.attrs.get("href") == expected_href:
                    return True, got_hrefs
    return False, got_hrefs


def measure_15_links(record_data, page_idx, key):
    entries = [e for e in record_data["emphasis_links"] if e["kind"] == "link"]
    discord = []
    n_found = 0
    url_label_checks = []
    for entry in entries:
        coord = entry["unit_coord"]
        href = entry["href"]
        expected_label = entry["container_text"][entry["start"]:entry["end"]]
        unit_el = page_idx["units"].get(coord)
        if unit_el is None:
            discord.append({"coord": f"{coord} link[{entry['start']}:{entry['end']}]",
                             "expected": trunc(f"{href} :: {expected_label}"),
                             "read": "(unidade ausente na pagina)"})
            found = False
        else:
            found, got_hrefs = find_matching_anchor(unit_el, expected_label, href)
            if found:
                n_found += 1
            else:
                reason = (f"texto encontrado mas href != esperado (candidatos: {got_hrefs})" if got_hrefs
                          else "nenhum <a> com esse texto (pela regra SS2) na unidade")
                discord.append({"coord": f"{coord} link[{entry['start']}:{entry['end']}]",
                                 "expected": trunc(f"{href} :: {expected_label}", 160),
                                 "read": reason})
        if expected_label == href:
            url_label_checks.append({
                "coord": coord, "href": href, "label_len": len(expected_label), "found": found,
                "inteira_no_texto_rendido": found,  # 'found' so e True se o texto lido bateu char a char
            })
    return {
        "expected": len(entries), "read": n_found, "n_discord": len(discord), "discord": discord,
        "url_label_checks": url_label_checks,
    }


# ---------------------------------------------------------------------------
# 9. Execucao por edicao (medicoes 1-12)
# ---------------------------------------------------------------------------

def load_page(path):
    page_html = path.read_text(encoding="utf-8")
    art_pos = page_html.index("<article")
    page_root = parse_html(page_html[art_pos:])
    return index_page(page_root)


def run_edition(ed, manifest, crossing_idx):
    record = json.loads(ed["record"].read_text(encoding="utf-8"))
    page_idx = load_page(ed["page"])
    record_data = walk_record(record)
    manifest_entry = manifest["registos"][ed["key"]]
    rh_study = manifest_entry["rh_study"]

    slug_lang_page = page_idx["article"].attrs.get("data-registo-edicao")
    slug_lang_expected = ed["key"]

    out = {}
    out["_slug_lang_check"] = {"expected": slug_lang_expected, "read": slug_lang_page,
                                "ok": slug_lang_page == slug_lang_expected}
    out["_record_anomalies"] = record_data["anomalies"]
    out["m1"] = measure_1_blocks(record_data, page_idx)
    out["m2"] = measure_2_units(record_data, page_idx)
    out["m3"] = measure_3_figures(record_data, page_idx, manifest_entry)
    out["m4"] = measure_4_no_missing_figures(record_data, page_idx)
    out["m5"] = measure_5_emphasis_links(record_data, page_idx)
    out["m6"] = measure_6_selos_portas(record_data, page_idx, manifest_entry, crossing_idx, ed["chip_prefix"])
    out["m7"] = measure_7_headers(record_data, page_idx)
    out["m8"] = measure_8_linhas(record_data, page_idx)
    if ed["run_m9"]:
        doc_html = ed["documento"].read_text(encoding="utf-8")
        doc_root = parse_html(doc_html)
        out["m9"] = measure_9_documento(page_idx, doc_root)
    else:
        out["m9"] = None
    out["m10"] = measure_10_aparelho(record_data, page_idx, manifest_entry, crossing_idx)
    out["m11"] = measure_11_stray_digits(page_idx)
    out["m12"] = measure_12_foreign_elements(page_idx)
    out["m15"] = measure_15_links(record_data, page_idx, ed["key"])

    # agregados reutilizados pelas medicoes 13/14 (globais / por edicao)
    n_blocks = len(record_data["blocks"])
    n_figs = len(record_data["figures"])
    n_com_linha_certo = out["m6"]["com_linha_selo_certo"]
    n_com_linha_por_dados = sum(1 for fig in record_data["figures"].values()
                                 if (rh_study, fig["row"]) in crossing_idx)
    n_com_resumo = sum(1 for fig in record_data["figures"].values()
                        if fig.get("source_sha256") and SHA256_RE.match(fig["source_sha256"]))
    n_sem_resumo = n_figs - n_com_resumo
    n_row_vazia = sum(1 for fig in record_data["figures"].values() if not fig.get("row"))
    n_resolvido = 0
    for fig in record_data["figures"].values():
        row = fig.get("row")
        if not row:
            continue
        if row in page_idx["linha_ids"]:
            n_resolvido += 1
    n_por_resolver = n_figs - n_resolvido

    out["_aggregates"] = {
        "blocos": n_blocks,
        "algarismos": n_figs,
        "completas": n_com_linha_certo,
        "completas_por_dados": n_com_linha_por_dados,
        "do_motor": n_figs - n_com_linha_certo,
        "por_resolver": n_por_resolver,
        "row_vazia": n_row_vazia,
        "com_resumo_de_origem": n_com_resumo,
        "com_motivo": n_sem_resumo,
        "rh_study": rh_study,
        "pagina_existe": ed["page"].exists(),
    }
    return out


# ---------------------------------------------------------------------------
# 10. Medicoes 13 e 14 (globais / por edicao, sobre prova.json e cadeia.json)
# ---------------------------------------------------------------------------

PROVA_KEYS_13 = [
    "registos_edicoes", "registos_blocos", "registos_algarismos",
    "registos_resolvidos", "registos_por_resolver", "registos_com_linha_do_sitio",
    "registos_com_resumo_de_origem", "registos_sem_resumo_de_origem",
]

CADEIA_KEYS_14 = [
    "blocos", "algarismos", "completas", "do_motor",
    "por_resolver", "com_resumo_de_origem", "com_motivo",
]


def measure_13_prova(all_results, prova):
    my_totals = {
        "registos_edicoes": sum(1 for r in all_results.values() if r["_aggregates"]["pagina_existe"]),
        "registos_blocos": sum(r["_aggregates"]["blocos"] for r in all_results.values()),
        "registos_algarismos": sum(r["_aggregates"]["algarismos"] for r in all_results.values()),
        "registos_resolvidos": sum(r["_aggregates"]["algarismos"] - r["_aggregates"]["por_resolver"]
                                    for r in all_results.values()),
        "registos_por_resolver": sum(r["_aggregates"]["por_resolver"] for r in all_results.values()),
        "registos_com_linha_do_sitio": sum(r["_aggregates"]["completas"] for r in all_results.values()),
        "registos_com_resumo_de_origem": sum(r["_aggregates"]["com_resumo_de_origem"] for r in all_results.values()),
        "registos_sem_resumo_de_origem": sum(r["_aggregates"]["com_motivo"] for r in all_results.values()),
    }
    prova_vals = {k: prova["prova"][k]["valor"] for k in PROVA_KEYS_13}
    discord = []
    for k in PROVA_KEYS_13:
        if prova_vals[k] != my_totals[k]:
            discord.append({"coord": k, "expected": prova_vals[k], "read": my_totals[k]})
    return {"expected": prova_vals, "read": my_totals, "n_discord": len(discord), "discord": discord}


def measure_14_cadeia(all_results, cadeia):
    discord = []
    per_edition = {}
    for key, r in all_results.items():
        agg = r["_aggregates"]
        mine = {k: agg[k] for k in CADEIA_KEYS_14}
        cadeia_entry = cadeia["por_edicao"].get(key)
        if cadeia_entry is None:
            discord.append({"coord": f"{key} (por_edicao)", "expected": "entrada presente em cadeia.json",
                             "read": "(entrada ausente)"})
            per_edition[key] = {"expected": None, "read": mine, "ok": False}
            continue
        theirs = {k: cadeia_entry[k] for k in CADEIA_KEYS_14}
        ok = theirs == mine
        if not ok:
            for k in CADEIA_KEYS_14:
                if theirs[k] != mine[k]:
                    discord.append({"coord": f"{key}.{k}", "expected": theirs[k], "read": mine[k]})
        per_edition[key] = {"expected": theirs, "read": mine, "ok": ok}

    # os totais de cadeia.json tem de bater com prova.json (conferencia extra,
    # nao pedida em separado, mas os dois ficheiros dizem cobrir a mesma coisa)
    totals_cross = cadeia["totais"]
    return {"expected": "por_edicao de cadeia.json", "read": "os meus agregados por edicao",
            "n_discord": len(discord), "discord": discord, "per_edition": per_edition,
            "cadeia_totais": totals_cross}


# ---------------------------------------------------------------------------
# 11. Execucao principal
# ---------------------------------------------------------------------------

def build_crossing_idx(ledger):
    crossing_idx = {}
    collisions = []
    for site_id, row in ledger["rows"].items():
        key = (row["rh_study"], row["rh_id"])
        if key in crossing_idx and crossing_idx[key] != site_id:
            collisions.append((key, crossing_idx[key], site_id))
        crossing_idx[key] = site_id
    return crossing_idx, collisions


def run_all(dist):
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
    crossing_idx, collisions = build_crossing_idx(ledger)
    prova = json.loads((dist / "prova.json").read_text(encoding="utf-8"))
    cadeia = json.loads((dist / "cadeia.json").read_text(encoding="utf-8"))

    all_results = {"_crossing_collisions": collisions}
    editions = editions_for(dist)
    for ed in editions:
        print(f"\n=== {ed['key']} ===", file=sys.stderr)
        res = run_edition(ed, manifest, crossing_idx)
        all_results[ed["key"]] = res
        for m in [f"m{i}" for i in range(1, 13)] + ["m15"]:
            r = res.get(m)
            if r is None:
                print(f"  {m}: N/A", file=sys.stderr)
                continue
            print(f"  {m}: expected={r.get('expected')!r} read={r.get('read')!r} "
                  f"n_discord={r.get('n_discord')}", file=sys.stderr)

    edition_only = {k: v for k, v in all_results.items() if not k.startswith("_")}
    all_results["m13"] = measure_13_prova(edition_only, prova)
    all_results["m14"] = measure_14_cadeia(edition_only, cadeia)
    print(f"\n=== m13 (prova.json) ===  n_discord={all_results['m13']['n_discord']}", file=sys.stderr)
    print(f"=== m14 (cadeia.json) ===  n_discord={all_results['m14']['n_discord']}", file=sys.stderr)
    return all_results


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", type=Path, default=DEFAULT_DIST,
                     help="raiz das paginas construidas (por omissao, a copia congelada usada em 24.08.2026, commit 180148c)")
    ap.add_argument("--json", type=Path, default=None, help="onde escrever o resultado completo em JSON")
    ap.add_argument("--no-selftest", action="store_true", help="salta as provas de mutacao")
    args = ap.parse_args()

    if not args.no_selftest:
        ok = run_selftests()
        if not ok:
            print("\nAS PROVAS DE MUTACAO FALHARAM -- nao corro a medicao real.", file=sys.stderr)
            sys.exit(1)

    all_results = run_all(args.dist)

    if args.json:
        args.json.write_text(json.dumps(all_results, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
        print(f"\nJSON escrito em {args.json}", file=sys.stderr)

    print(json.dumps({"summary": "ver stderr para o resumo; usa --json para o detalhe completo"}))


# ---------------------------------------------------------------------------
# 12. Provas de mutacao -- focadas no codigo novo/reescrito desta corrida
#     (a medicao 6 nova, e as medicoes 13/14/15). O resto (arvore, read_text,
#     is_within, medicoes 1-5/7-12) e o codigo da M1, ja sujeito la a 21
#     provas; nao repito essas aqui, mas volto a exercitar read_text/
#     descendants de raspao porque toda a medicao 6 nova depende delas.
# ---------------------------------------------------------------------------

def _mk_article(inner_html, edicao="teste/pt"):
    html = f'<article data-registo-edicao="{edicao}">{inner_html}</article>' \
           f'<section id="linhas-do-documento">' \
           f'<div data-registo-linha="teste/pt@rowA.valor" id="linha-rowA">1</div>' \
           f'<div data-registo-linha="teste/pt@rowB.valor" id="linha-rowB">2</div>' \
           f'</section>'
    root = parse_html(html)
    return index_page(root)


class SelfTest:
    def __init__(self):
        self.results = []

    def check(self, name, cond, detail=""):
        self.results.append((name, bool(cond), detail))

    def all_ok(self):
        return all(ok for _, ok, _ in self.results)

    def report(self):
        for name, ok, detail in self.results:
            mark = "OK" if ok else "FALHOU"
            print(f"  [{mark}] {name}" + (f" -- {detail}" if detail and not ok else ""), file=sys.stderr)


def run_selftests():
    t = SelfTest()
    print("\n=== provas de mutacao (codigo novo/reescrito da M2) ===", file=sys.stderr)

    # -- fixture 1: figura autonoma sem linha, corretamente auto-ancorada --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">valor '
        '<a class="texto-figura texto-figura-porta" data-registo="teste/pt#1.0" href="#linha-rowA">42</a>'
        '</p>'
    )
    fig_el = page["figures"]["1.0"]
    cls = classify_figure_dom(fig_el, page["article"])
    t.check("classify: figura autonoma com porta propria -> is_porta_link=True",
            cls["is_porta_link"] is True and cls["link_el"] is None)

    # -- fixture 2: figura autonoma com linha do sitio, selo certo --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">valor '
        '<span class="texto-figura" data-registo="teste/pt#1.0">42</span>'
        '<a class="src-chip" href="/livro-razao/site-x">fonte</a>'
        '</p>'
    )
    record_data = {
        "figures": {"1.0": {"row": "rowA", "printed": "42"}},
    }
    manifest_entry = {"rh_study": "99 Teste"}
    crossing_idx = {("99 Teste", "rowA"): "site-x"}
    m6 = measure_6_selos_portas(record_data, page, manifest_entry, crossing_idx, "/livro-razao/")
    t.check("m6: figura autonoma com selo certo -> com_linha_selo_certo=1",
            m6["com_linha_selo_certo"] == 1 and m6["n_discord"] == 0,
            json.dumps(m6["discord"]))

    # -- fixture 3: mesmo caso, mas o selo aponta para o site errado --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">valor '
        '<span class="texto-figura" data-registo="teste/pt#1.0">42</span>'
        '<a class="src-chip" href="/livro-razao/site-ERRADO">fonte</a>'
        '</p>'
    )
    m6 = measure_6_selos_portas(record_data, page, manifest_entry, crossing_idx, "/livro-razao/")
    t.check("m6: selo errado -> com_linha_selo_errado_ou_falta=1, selo_certo=0",
            m6["com_linha_selo_certo"] == 0 and m6["com_linha_selo_errado_ou_falta"] == 1,
            json.dumps(m6["discord"]))

    # -- fixture 4 (a regra nova, SS1b): figura SEM linha, dentro de uma
    #    ligacao, com a ancora texto-figura-porta-apos correta a seguir --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">veja '
        '<a class="texto-ligacao" href="https://ex.pt/doc">relatorio '
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>'
        '</a><a class="texto-figura-porta-apos" href="#linha-rowB"></a>'
        ' no original</p>'
    )
    record_data = {"figures": {"1.0": {"row": "rowB", "printed": "7"}}}
    crossing_idx2 = {}  # rowB nao tem linha do sitio
    m6 = measure_6_selos_portas(record_data, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6 SS1b: porta-apos correta depois da ligacao -> sem_linha_com_porta=1, 0 discordancias",
            m6["sem_linha_com_porta"] == 1 and m6["n_discord"] == 0 and m6["b3_detail"]["porta_apos_ligacao"] == 1,
            json.dumps(m6["discord"]))

    # -- fixture 5 (o cerne da regra nova): a FORMA ANTIGA -- so a entrada em
    #    "linhas do documento", sem nenhuma ancora porta-apos a seguir a
    #    ligacao. Sob a M1 isto contava como "com porta" (via entrada); sob a
    #    M2 SS1b tem de contar como SEM porta / discordancia.
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">veja '
        '<a class="texto-ligacao" href="https://ex.pt/doc">relatorio '
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>'
        '</a> no original</p>'
    )
    m6 = measure_6_selos_portas(record_data, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6 SS1b: forma antiga (so a entrada, sem porta-apos) -> sem_linha_forma_antiga_sem_porta=1, discordancia",
            m6["sem_linha_forma_antiga_sem_porta"] == 1 and m6["sem_linha_com_porta"] == 0 and m6["n_discord"] == 1,
            json.dumps(m6["discord"]))

    # -- fixture 6: duas figuras sem linha na mesma ligacao, ordem importa --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">'
        '<a class="texto-ligacao" href="https://ex.pt/doc">'
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>/'
        '<span class="texto-figura" data-registo="teste/pt#1.1">2018</span>'
        '</a>'
        '<a class="texto-figura-porta-apos" href="#linha-rowA"></a>'
        '<a class="texto-figura-porta-apos" href="#linha-rowB"></a>'
        '</p>'
    )
    record_data3 = {"figures": {
        "1.0": {"row": "rowA", "printed": "7"},
        "1.1": {"row": "rowB", "printed": "2018"},
    }}
    m6 = measure_6_selos_portas(record_data3, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6 SS1b: duas portas-apos em ordem certa -> 2 sem_linha_com_porta, 0 discordancias",
            m6["sem_linha_com_porta"] == 2 and m6["n_discord"] == 0, json.dumps(m6["discord"]))

    # -- fixture 7: as mesmas duas, mas as ancoras vem na ORDEM TROCADA --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">'
        '<a class="texto-ligacao" href="https://ex.pt/doc">'
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>/'
        '<span class="texto-figura" data-registo="teste/pt#1.1">2018</span>'
        '</a>'
        '<a class="texto-figura-porta-apos" href="#linha-rowB"></a>'
        '<a class="texto-figura-porta-apos" href="#linha-rowA"></a>'
        '</p>'
    )
    m6 = measure_6_selos_portas(record_data3, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6 SS1b: ordem das portas-apos trocada -> apanhado (0 ou 1 certas, nunca as 2), n_discord>0",
            m6["sem_linha_com_porta"] < 2 and m6["n_discord"] > 0, json.dumps(m6["discord"]))

    # -- fixture 8: a ancora porta-apos existe mas TEM TEXTO (viola "sem texto") --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">'
        '<a class="texto-ligacao" href="https://ex.pt/doc">'
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>'
        '</a><a class="texto-figura-porta-apos" href="#linha-rowA">*</a>'
        '</p>'
    )
    record_data4 = {"figures": {"1.0": {"row": "rowA", "printed": "7"}}}
    m6 = measure_6_selos_portas(record_data4, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6 SS1b: porta-apos com texto (deveria ser vazia) -> discordancia, nao conta como porta valida",
            m6["sem_linha_com_porta"] == 0 and m6["n_discord"] >= 1, json.dumps(m6["discord"]))

    # -- fixture 9: figura sem linha, sem ligacao, sem porta nenhuma (bare span) --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">'
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>'
        '</p>'
    )
    m6 = measure_6_selos_portas(record_data4, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6: figura autonoma sem porta nenhuma -> anomalia, discordancia",
            m6["anomalias"] == 1 and m6["n_discord"] == 1, json.dumps(m6["discord"]))

    # -- fixture 10: figura sem linha do sitio mas com um selo indevido colado --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">'
        '<span class="texto-figura" data-registo="teste/pt#1.0">7</span>'
        '<a class="src-chip" href="/livro-razao/site-x">fonte</a>'
        '</p>'
    )
    m6 = measure_6_selos_portas(record_data4, page, manifest_entry, crossing_idx2, "/livro-razao/")
    t.check("m6: figura sem linha com selo indevido -> sem_linha_com_selo=1 (tem de ser apanhado)",
            m6["sem_linha_com_selo"] == 1 and m6["n_discord"] == 1, json.dumps(m6["discord"]))

    # -- medicao 13: soma simples, e deteta um valor de prova.json alterado --
    fake_results = {
        "ed1": {"_aggregates": {"blocos": 10, "algarismos": 5, "completas": 2,
                                 "completas_por_dados": 2, "do_motor": 3, "por_resolver": 0,
                                 "row_vazia": 0, "com_resumo_de_origem": 1, "com_motivo": 4,
                                 "rh_study": "X", "pagina_existe": True}},
        "ed2": {"_aggregates": {"blocos": 20, "algarismos": 7, "completas": 3,
                                 "completas_por_dados": 3, "do_motor": 4, "por_resolver": 0,
                                 "row_vazia": 0, "com_resumo_de_origem": 2, "com_motivo": 5,
                                 "rh_study": "Y", "pagina_existe": True}},
    }
    prova_ok = {"prova": {
        "registos_edicoes": {"valor": 2}, "registos_blocos": {"valor": 30},
        "registos_algarismos": {"valor": 12}, "registos_resolvidos": {"valor": 12},
        "registos_por_resolver": {"valor": 0}, "registos_com_linha_do_sitio": {"valor": 5},
        "registos_com_resumo_de_origem": {"valor": 3}, "registos_sem_resumo_de_origem": {"valor": 9},
    }}
    m13 = measure_13_prova(fake_results, prova_ok)
    t.check("m13: soma sintetica bate com prova.json sintetico -> 0 discordancias",
            m13["n_discord"] == 0, json.dumps(m13["discord"]))

    prova_bad = json.loads(json.dumps(prova_ok))
    prova_bad["prova"]["registos_blocos"]["valor"] = 999
    m13_bad = measure_13_prova(fake_results, prova_bad)
    t.check("m13: um valor de prova.json alterado (999) -> apanhado como discordancia",
            m13_bad["n_discord"] == 1 and m13_bad["discord"][0]["coord"] == "registos_blocos",
            json.dumps(m13_bad["discord"]))

    # -- medicao 14: por_edicao bate, e deteta um campo alterado numa edicao --
    cadeia_ok = {"totais": {}, "por_edicao": {
        "ed1": {"etiqueta": "x", "blocos": 10, "algarismos": 5, "completas": 2,
                "do_motor": 3, "por_resolver": 0, "com_resumo_de_origem": 1, "com_motivo": 4},
        "ed2": {"etiqueta": "y", "blocos": 20, "algarismos": 7, "completas": 3,
                "do_motor": 4, "por_resolver": 0, "com_resumo_de_origem": 2, "com_motivo": 5},
    }}
    m14 = measure_14_cadeia(fake_results, cadeia_ok)
    t.check("m14: por_edicao sintetico bate -> 0 discordancias", m14["n_discord"] == 0, json.dumps(m14["discord"]))

    cadeia_bad = json.loads(json.dumps(cadeia_ok))
    cadeia_bad["por_edicao"]["ed2"]["completas"] = 999
    m14_bad = measure_14_cadeia(fake_results, cadeia_bad)
    t.check("m14: um campo alterado numa edicao (completas=999) -> apanhado",
            m14_bad["n_discord"] == 1 and m14_bad["discord"][0]["coord"] == "ed2.completas",
            json.dumps(m14_bad["discord"]))

    # -- medicao 15: ligacao encontrada, e uma ligacao com href errado apanhada --
    page = _mk_article(
        '<p data-registo-unidade="teste/pt#1">veja '
        '<a class="texto-ligacao" href="https://ex.pt/relatorio">o relatorio</a> aqui</p>'
    )
    record_data5 = {
        "units": {"1": {"text": "veja o relatorio aqui"}},
        "emphasis_links": [
            {"unit_coord": "1", "kind": "link", "href": "https://ex.pt/relatorio",
             "start": 5, "end": 16, "container_text": "veja o relatorio aqui"},
        ],
    }
    m15 = measure_15_links(record_data5, page, "teste/pt")
    t.check("m15: ligacao com href e etiqueta certos -> encontrada, 0 discordancias",
            m15["read"] == 1 and m15["n_discord"] == 0, json.dumps(m15["discord"]))

    record_data5b = json.loads(json.dumps(record_data5))
    record_data5b["emphasis_links"][0]["href"] = "https://ex.pt/ERRADO"
    m15b = measure_15_links(record_data5b, page, "teste/pt")
    t.check("m15: href do registo alterado -> discordancia (nao apanha por acidente)",
            m15b["read"] == 0 and m15b["n_discord"] == 1, json.dumps(m15b["discord"]))

    # -- m15, o caso do 03 pt: etiqueta == href, um URL comprido, intacto --
    long_url = "https://ec.europa.eu/eurostat/api/x?format=JSON&geo=PT" * 3
    page_url = _mk_article(
        f'<p data-registo-unidade="teste/pt#1">{long_url}</p>'
    )
    record_data6 = {
        "units": {"1": {"text": long_url}},
        "emphasis_links": [
            {"unit_coord": "1", "kind": "link", "href": "SEM_ANCORA_NENHUMA",
             "start": 0, "end": len(long_url), "container_text": long_url},
        ],
    }
    # aqui a pagina nao tem <a> nenhum a envolver o URL -- deve falhar a
    # encontrar, e reportar como discordancia (prova que o teste nao "deixa
    # passar" so por o texto existir sem <a>)
    m15c = measure_15_links(record_data6, page_url, "teste/pt")
    t.check("m15: URL inteiro no texto mas SEM <a> nenhum -> nao encontrado (nao inventa a ligacao)",
            m15c["read"] == 0 and m15c["n_discord"] == 1, json.dumps(m15c["discord"]))

    t.report()
    n_ok = sum(1 for _, ok, _ in t.results if ok)
    print(f"  {n_ok}/{len(t.results)} provas de mutacao passaram", file=sys.stderr)
    return t.all_ok()


if __name__ == "__main__":
    main()
