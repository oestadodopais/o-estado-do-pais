#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BRIEF-parte3-M1 -- a medicao cega das paginas de leitura (04 pt, 04 en, 08 pt)

Escrito de raiz pelo medidor (Claude Sonnet). Nao importa nada de
OEstadoDoPais/src, OEstadoDoPais/scripts nem do node_modules do sitio.
Usa apenas a biblioteca padrao de Python: html.parser para tokenizar,
json/re/difflib/collections para o resto. A arvore construida a partir do
tokenizador, e toda a logica de leitura e comparacao, sao codigo proprio.

Corre: python3 parte3-M1-sonnet.py [--dist PATH] [--json OUT.json]

Imprime um resumo humano em stdout e, com --json, escreve o resultado
completo em JSON (usado para compor o relatorio Markdown ao lado).
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
    "96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/dist-p2"
)
REGISTOS = REPO / "registos"
LEDGER_PATH = REPO / "ledger" / "cruzamentos" / "evora.json"
MANIFEST_PATH = REGISTOS / "manifest.json"


def editions_for(dist):
    return [
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
            "key": "evora-quinze-anos-cinco-mandatos/pt",
            "slug": "evora-quinze-anos-cinco-mandatos",
            "lang": "pt",
            "record": REGISTOS / "evora-quinze-anos-cinco-mandatos" / "pt.record.json",
            "page": dist / "estudos" / "evora-quinze-anos-cinco-mandatos" / "texto" / "index.html",
            "documento": None,
            "chip_prefix": "/livro-razao/",
            "run_m9": False,
        },
    ]


# ---------------------------------------------------------------------------
# 1. Um leitor de HTML proprio: html.parser (biblioteca padrao) so como
#    tokenizador; a arvore, o percurso e a leitura de texto sao codigo meu.
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
        # tag auto-fechada: nunca empilhada, nada para desempilhar

    def handle_endtag(self, tag):
        for idx in range(len(self.stack) - 1, 0, -1):
            if self.stack[idx].tag == tag:
                del self.stack[idx:]
                return
        # tag de fecho sem par: ignora (tolerante; nao esperado nestas paginas)

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
# 2. Percurso da arvore e a leitura do olho (regra da SS2 do brief)
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


# ---------------------------------------------------------------------------
# 3. O leitor do registo (JSON) -- indexado pela mesma gramatica de
#    coordenadas que a pagina usa: <b>, <b>.<i>, <b>.<r>.<c>, e com o
#    indice da figura acrescentado.
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
# 4. O indexador da pagina construida
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


def classify_figure_dom(fig_el, article):
    href = fig_el.attrs.get("href")
    is_porta_link = (fig_el.tag == "a" and href is not None and href.startswith("#linha-"))
    porta_row = href[len("#linha-"):] if is_porta_link else None

    in_doc_link = False
    p = fig_el.parent
    while p is not None and p is not article.parent:
        if p is article:
            break
        if p.tag == "a" and not has_class(p, "src-chip"):
            in_doc_link = True
            break
        p = p.parent

    parent = fig_el.parent
    siblings = parent.children
    idx = siblings.index(fig_el)
    next_chip = None
    for sib in siblings[idx + 1:]:
        if isinstance(sib, str):
            if sib.strip() == "":
                continue
            else:
                break
        else:
            if has_class(sib, "src-chip"):
                next_chip = sib
            break

    return {
        "is_porta_link": is_porta_link, "porta_row": porta_row,
        "in_doc_link": in_doc_link, "next_chip": next_chip,
    }


# ---------------------------------------------------------------------------
# 5. Auxiliares gerais
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
# 6. As doze medicoes
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
    n_ok = 0
    for coord, fig_el in page_idx["figures"].items():
        rec_fig = record_data["figures"].get(coord)
        if rec_fig is None:
            discord.append({"coord": coord, "expected": "(nao existe no registo)",
                             "read": trunc(read_text(fig_el)), "reason": "figura na pagina nao resolve no registo"})
            continue
        read = read_text(fig_el)
        if read == rec_fig["printed"]:
            n_ok += 1
        else:
            discord.append({"coord": coord, "expected": trunc(rec_fig["printed"]), "read": trunc(read),
                             "reason": "printed != leitura da pagina"})

    # a conferencia interna do registo: text[start:end] == printed
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
    counts_ok = (n_page_figs == n_manifest_refs == n_record_figs)

    return {
        "expected": f"pagina={n_manifest_refs} manifesto={n_manifest_refs} registo={n_record_figs}",
        "read": f"pagina={n_page_figs} manifesto={n_manifest_refs} registo={n_record_figs}",
        "counts": counts, "counts_ok": counts_ok,
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


def measure_6_selos_portas(record_data, page_idx, manifest_entry, crossing_idx, chip_prefix):
    rh_study = manifest_entry["rh_study"]
    b1 = []  # com linha, selo certo
    b2 = []  # com linha, selo errado/em falta
    b3 = []  # sem linha, porta ou entrada ok
    b4 = []  # sem linha, com selo (deve ser zero)
    b5 = []  # anomalia: nao cabe nas quatro categorias
    article = page_idx["article"]

    for coord, fig_el in page_idx["figures"].items():
        rec_fig = record_data["figures"].get(coord)
        if rec_fig is None:
            continue  # ja reportado na medicao 3
        row = rec_fig["row"]
        has_site_line = (rh_study, row) in crossing_idx
        cls = classify_figure_dom(fig_el, article)
        if has_site_line:
            expected_site_id = crossing_idx[(rh_study, row)]
            chip = cls["next_chip"]
            ok = False
            got_href = None
            if chip is not None:
                got_href = chip.attrs.get("href", "")
                if got_href == chip_prefix + expected_site_id:
                    ok = True
            if ok:
                b1.append({"coord": coord, "row": row, "site_id": expected_site_id})
            else:
                b2.append({"coord": coord, "expected": chip_prefix + expected_site_id,
                           "read": got_href or "(sem selo colado a seguir)"})
        else:
            classified = False
            if cls["is_porta_link"]:
                if cls["porta_row"] == row and row in page_idx["linha_ids"]:
                    b3.append({"coord": coord, "row": row, "via": "porta"})
                    classified = True
            elif cls["in_doc_link"]:
                if row in page_idx["linha_ids"]:
                    b3.append({"coord": coord, "row": row, "via": "entrada (dentro de ligacao)"})
                    classified = True
            if not classified:
                b5.append({"coord": coord, "expected": f"porta ou entrada para #linha-{row}",
                           "read": f"porta_row={cls['porta_row']!r} in_doc_link={cls['in_doc_link']} "
                                   f"linha_id_existe={row in page_idx['linha_ids']}"})
            if cls["next_chip"] is not None:
                b4.append({"coord": coord, "expected": "(sem selo)",
                           "read": cls["next_chip"].attrs.get("href", "?")})

    unresolved_portas = [(row, el) for row, el in page_idx["href_linha_targets"]
                          if row not in page_idx["linha_ids"]]

    discord = b2 + b4 + b5
    return {
        "com_linha_selo_certo": len(b1), "com_linha_selo_errado_ou_falta": len(b2),
        "sem_linha_com_porta": len(b3), "sem_linha_com_selo": len(b4),
        "anomalias": len(b5), "portas_por_resolver": len(unresolved_portas),
        "detail": {"b1": b1, "b2": b2, "b3": b3, "b4": b4, "b5": b5,
                   "unresolved_portas": unresolved_portas},
        "n_discord": len(discord) + len(unresolved_portas),
        "discord": discord + [{"coord": f"#linha-{row}", "expected": "id existente na pagina",
                                "read": "(id nao encontrado)"} for row, _ in unresolved_portas],
    }


def measure_7_headers(record_data, page_idx):
    discord = []
    n_expected = 0
    n_ok = 0
    for coord, unit in record_data["units"].items():
        if unit["header"] is None:
            continue  # nao e uma celula de tabela
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
# 7. Execucao por edicao
# ---------------------------------------------------------------------------

def run_edition(ed, manifest, crossing_idx):
    record = json.loads(ed["record"].read_text(encoding="utf-8"))
    page_html = ed["page"].read_text(encoding="utf-8")
    art_pos = page_html.index("<article")
    page_root = parse_html(page_html[art_pos:])
    page_idx = index_page(page_root)
    record_data = walk_record(record)
    manifest_entry = manifest["registos"][ed["key"]]

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
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", type=Path, default=DEFAULT_DIST,
                     help="raiz das paginas construidas (por omissao, a copia congelada usada em 24.08.2026)")
    ap.add_argument("--json", type=Path, default=None, help="onde escrever o resultado completo em JSON")
    args = ap.parse_args()

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
    crossing_idx = {}
    collisions = []
    for site_id, row in ledger["rows"].items():
        key = (row["rh_study"], row["rh_id"])
        if key in crossing_idx and crossing_idx[key] != site_id:
            collisions.append((key, crossing_idx[key], site_id))
        crossing_idx[key] = site_id

    all_results = {"_crossing_collisions": collisions}
    for ed in editions_for(args.dist):
        print(f"\n=== {ed['key']} ===", file=sys.stderr)
        res = run_edition(ed, manifest, crossing_idx)
        all_results[ed["key"]] = res
        for m in [f"m{i}" for i in range(1, 13)]:
            r = res[m]
            if r is None:
                print(f"  {m}: N/A", file=sys.stderr)
                continue
            print(f"  {m}: expected={r.get('expected')!r} read={r.get('read')!r} "
                  f"n_discord={r.get('n_discord')}", file=sys.stderr)

    if args.json:
        args.json.write_text(json.dumps(all_results, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
        print(f"\nJSON escrito em {args.json}", file=sys.stderr)

    print(json.dumps({"summary": "ver stderr para o resumo; usa --json para o detalhe completo"}))


if __name__ == "__main__":
    main()
