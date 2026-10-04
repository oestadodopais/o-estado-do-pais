"""Medições OE1-d, com plantas em memória e sem escrever caminhos da máquina.

Recebe a worktree do motor como primeiro argumento. Com --html exige a
construção da cabeça atual; corre antes do último commit, reservado às provas.
Escreve apenas medidas-oe1d.json. Não altera fontes, linhas ou HTML.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import io
import json
import re
import subprocess
import sys
import tarfile
from datetime import datetime, timezone
from decimal import Decimal
from html.parser import HTMLParser
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
SITE = HERE.parents[3]
OLD_SITE = "bde06bf0"
OLD_ENGINE = "9bfbb777"
FIXED = ("id", "value", "excerpt", "name", "name_source", "source_url",
         "reference_date", "derived_from", "check")
GEO = {"pt": "PT", "es": "ES", "ue": "EU27_2020"}
GAP_IDS = tuple("oe-2026-" + part + "-administracao-central" for part in
                ("despesa-orcamental", "ativos-e-passivos-da-despesa", "despesa-efetiva"))


class Falha(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise Falha(message)


def git(root, *args):
    result = subprocess.run(["git", *args], cwd=root, capture_output=True)
    require(result.returncode == 0, "Comando Git de leitura recusado: " + args[0])
    return result.stdout


def head(root, ref="HEAD"):
    return git(root, "rev-parse", ref).decode().strip()


def sha(body):
    return hashlib.sha256(body).hexdigest()


def number(text):
    return Decimal(re.sub(r"\s", "", str(text)).replace(",", "."))


def old_rows(ids):
    paths = ["ledger/claims/" + sid + ".yml" for sid in ids]
    archive = git(SITE, "archive", "--format=tar", OLD_SITE, "--", *paths)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        return {sid: yaml.safe_load(tar.extractfile(path).read()) for sid, path in zip(ids, paths)}


class Measures:
    def __init__(self):
        self.items = {}

    def prove(self, key, value, validator, mutate, plant, result=True):
        validator(value)
        altered = copy.deepcopy(value)
        replacement = mutate(altered)
        if isinstance(value, (str, bytes)):
            altered = replacement
        try:
            validator(altered)
        except Falha as error:
            complaint = str(error)
        else:
            raise Falha(key + ": a planta não mordeu")
        self.items[key] = dict(valor=result, passou=True, conhecido_positivo=True,
                               planta=plant, queixa_da_planta=complaint)

    def count(self, key, values, expected):
        self.prove(key, list(values), lambda rows: require(len(rows) == expected, key + ": contagem divergente"),
                   lambda rows: rows.pop(), "Retirar uma entrada diminui a contagem em um.", expected)


class Element:
    def __init__(self, tag, attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def text(self):
        return "".join(c.text() if isinstance(c, Element) else c for c in self.children)

    def find(self, predicate):
        result = [self] if predicate(self) else []
        for child in self.children:
            if isinstance(child, Element):
                result.extend(child.find(predicate))
        return result


class Document(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.root = Element("document")
        self.stack = [self.root]
        self.feed(text)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.stack.pop()

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def normalized(text):
    return " ".join(text.split())


def one(root, predicate, message):
    matches = root.find(predicate)
    require(len(matches) == 1, message)
    return matches[0]


def field(root, sid, name):
    return one(root, lambda n: n.attrs.get("data-linha-claim") == sid and n.attrs.get("data-linha-campo") == name,
               sid + ": campo HTML ausente ou repetido: " + name)


def check_visible(root):
    require(not root.find(lambda n: "hidden" in n.attrs or n.attrs.get("aria-hidden") == "true"
                          or re.search(r"(?:display\s*:\s*none|visibility\s*:\s*hidden)", n.attrs.get("style") or "")),
            "HTML: conteúdo da cabeça escondido")


def check_fields(root, row, lang, names, units):
    sid = row["id"]
    name = one(root, lambda n: n.attrs.get("data-de-linha") == sid and n.attrs.get("data-nome") == "projeto",
               sid + ": nome do projeto ausente ou repetido")
    require(normalized(name.text()) == names[sid][lang], sid + ": nome impresso divergente")
    caveat = field(root, sid, "ressalva")
    require(normalized(caveat.text()) == row["ressalva_en" if lang == "en" else "ressalva"],
            sid + ": ressalva impressa divergente")
    unit = field(root, sid, "unit")
    require(normalized(unit.text()) == units[row["unit"]][lang]["texto"], sid + ": unidade impressa divergente")
    declared_lang = units[row["unit"]][lang]["lingua"]
    require(unit.attrs.get("lang") == declared_lang, sid + ": língua da unidade divergente")


def html_measures(measures, rows, names, current_head):
    version = json.loads((SITE / "dist/version.json").read_text())
    measures.prove("html_cabeca", version,
                   lambda v: require(v.get("commit") == current_head, "HTML: a construção não é da cabeça atual"),
                   lambda v: v.update(commit="0" * 40), "Trocar a cabeça da construção é recusado.", version["commit"])
    def editions(candidate):
        # A mesma régua da construção, com a planta apenas no módulo em memória.
        script = "import {LINGUA_DAS_EDICOES as edicoes} from './src/i18n/lingua-dos-titulos.mjs';"
        if candidate["entrada_orfa"]:
            script += "edicoes['gov_10a_exp'] = null;"
        script += "await import('./scripts/check-lingua.mjs');"
        result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=SITE,
                                text=True, capture_output=True)
        if candidate["entrada_orfa"]:
            assert result.returncode == 1 and "a declaração de língua nomeia a edição «gov_10a_exp»" in result.stdout + result.stderr, \
                "Edições: a planta não produziu a queixa específica da régua"
        require(result.returncode == 0, "Edições: a régua recusa a declaração que nenhuma linha usa")
    measures.prove("edicoes_sem_declaracao_orfa", {"entrada_orfa": False}, editions,
                   lambda candidate: candidate.update(entrada_orfa=True),
                   "Reintroduzir gov_10a_exp no módulo em memória faz o portão da língua recusar a edição órfã.")
    script = "import {unidadeDaLinha} from './src/i18n/unidades.mjs'; let b=''; for await(const c of process.stdin)b+=c; console.log(JSON.stringify(Object.fromEntries(JSON.parse(b).map(u=>[u,{pt:unidadeDaLinha(u,'pt'),en:unidadeDaLinha(u,'en')}]))));"
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=SITE,
                            input=json.dumps(sorted({r["unit"] for r in rows.values()})), text=True, capture_output=True)
    require(result.returncode == 0, "HTML: dicionário de unidades não foi lido")
    units = json.loads(result.stdout)
    receipts, indices, examples = [], [], []
    for lang, prefix, title in [("pt", "livro-razao", "O dinheiro do Estado por ministério e por função"),
                                 ("en", "en/ledger", "The State's money by ministry and by function")]:
        index = Document((SITE / "dist" / prefix / "index.html").read_text()).root
        for sid, row in rows.items():
            receipt = Document((SITE / "dist" / prefix / sid / "index.html").read_text()).root
            top = one(receipt, lambda n: "linha-cabeca" in (n.attrs.get("class") or "").split(), sid + ": cabeça HTML ausente")
            check_visible(top)
            check_fields(top, row, lang, names, units)
            study = one(receipt, lambda n: n.tag == "dd" and n.attrs.get("data-nonledger") == "titulo-de-estudo",
                        sid + ": título interno ausente")
            require(normalized(study.text()) == title, sid + ": título interno não corresponde à edição")
            receipts.append(dict(id=sid, lingua=lang))
            item = one(index, lambda n: n.attrs.get("data-linha-id") == sid, sid + ": entrada do índice ausente ou repetida")
            check_fields(item, row, lang, names, units)
            require(bool(item.find(lambda n: n.tag == "details") and item.find(lambda n: n.tag == "summary")),
                    sid + ": ressalva do índice sem marca publicada")
            indices.append(dict(id=sid, lingua=lang))
            if not examples:
                examples.append((top, row, lang))
    measures.count("html_recibos_nas_duas_linguas", receipts, 372)
    measures.count("html_entradas_nos_dois_indices", indices, 372)
    top, row, lang = examples[0]
    validator = lambda root: check_fields(root, row, lang, names, units)
    for name, selector in [("nome", lambda n: n.attrs.get("data-de-linha") == row["id"] and "data-nome" in n.attrs),
                           ("ressalva", lambda n: n.attrs.get("data-linha-claim") == row["id"] and n.attrs.get("data-linha-campo") == "ressalva"),
                           ("unidade", lambda n: n.attrs.get("data-linha-claim") == row["id"] and n.attrs.get("data-linha-campo") == "unit")]:
        def damage(root, predicate=selector, kind=name):
            target = one(root, predicate, "Planta HTML sem alvo")
            if kind == "unidade":
                target.children = ["Unidade inventada."]
            else:
                parents = root.find(lambda n: target in n.children)
                require(len(parents) == 1, "Planta HTML sem elemento pai")
                parents[0].children.remove(target)
        measures.prove("html_planta_" + name, top, validator, damage,
                       ("Trocar a unidade" if name == "unidade" else "Retirar " + name)
                       + " na cabeça da cópia do recibo é recusado.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("motor", type=Path)
    parser.add_argument("--html", action="store_true")
    args = parser.parse_args()
    motor = args.motor.resolve()
    sys.path.insert(0, str(motor))
    from publisher.oe1_nomes import build_names, render_names
    measures = Measures()
    heads = dict(motor=head(motor), sitio=head(SITE), main=head(SITE, "main"), master=head(motor, "master"))
    bases = dict(observacoes_motor=head(motor, OLD_ENGINE), linhas_sitio=head(SITE, OLD_SITE),
                 rebase_main=git(SITE, "merge-base", "HEAD", "main").decode().strip(),
                 rebase_master=git(motor, "merge-base", "HEAD", "master").decode().strip())
    for ref in ("main", "master"):
        measures.prove("base_" + ref + "_integrada", {"base": bases["rebase_" + ref], "referencia": heads[ref]},
                       lambda candidate: require(candidate["base"] == candidate["referencia"], "A referência principal ainda não foi integrada"),
                       lambda candidate: candidate.update(base="0" * 40),
                       "Trocar a base integrada na cópia é recusado.", bases["rebase_" + ref])
    engine_paths = ("content/20 Orcamento do Estado/ledger.json", "publisher/manifest.oe1.json")
    for key, rel in zip(("livro_motor_intacto", "manifesto_motor_intacto"), engine_paths):
        body, old = (motor / rel).read_bytes(), git(motor, "show", OLD_ENGINE + ":" + rel)
        measures.prove(key, body, lambda value, expected=old: require(value == expected, "Bytes do motor diferentes da base selada"),
                       lambda value: value + b" ", "Acrescentar um byte à cópia é recusado.", sha(body))
    ledger = json.loads((motor / engine_paths[0]).read_bytes())
    raw = {r["id"]: r for r in ledger["claims"]}
    ids = sorted(raw)
    measures.count("linhas_do_motor", ids, 186)
    old = old_rows(ids)
    bodies = {sid: (SITE / "ledger/claims" / (sid + ".yml")).read_bytes() for sid in ids}
    rows = {sid: yaml.safe_load(body) for sid, body in bodies.items()}
    measures.count("linhas_exportadas", rows, 186)

    def fixed(candidate):
        require(set(candidate) == set(old), "Cobertura das linhas diferente da base")
        for sid, row in candidate.items():
            for field_name in FIXED:
                require(row.get(field_name) == old[sid].get(field_name), sid + ": campo alterado: " + field_name)
    measures.prove("valores_excertos_rotulos_e_coordenadas", rows, fixed,
                   lambda values: values[ids[0]].update(value="[planta]"), "Trocar um valor na cópia é recusado.", len(rows))

    def documents(candidate):
        for sid, row in candidate.items():
            expected = copy.deepcopy(old[sid].get("document"))
            if sid.startswith("despesa-por-funcao-"):
                expected["edition"] = "gov_10a_exp; geo=" + GEO[sid.rsplit("-", 1)[1]]
            require(row.get("document") == expected, sid + ": documento ou edição fora da mudança autorizada")
    measures.prove("documentos_e_edicoes", rows, documents,
                   lambda values: values[ids[0]]["document"].update(locator="Localizador inventado"),
                   "Inventar o localizador do documento na cópia é recusado.", len(rows))

    names = build_names()
    module = (SITE / "src/data/medidas-oe1.mjs").read_text()
    measures.prove("nomes_modulo_igual_ao_gerador", module,
                   lambda value: require(value == render_names(names), "Módulo de nomes diferente do gerador"),
                   lambda value: value.replace(next(iter(names.values()))["pt"], "Nome inventado", 1),
                   "Trocar um nome na cópia do módulo é recusado.", sha(module.encode()))
    measures.count("nomes_nas_duas_linguas", names, 186)
    def check_names(candidate):
        require(set(candidate) == set(rows), "Nomes sem cobertura das linhas")
        for sid, pair in candidate.items():
            require(set(pair) == {"pt", "en"} and all(isinstance(t, str) and t.strip() and not re.search(r"\d", t) for t in pair.values()),
                    sid + ": nome vazio, sem língua ou com algarismo")
    measures.prove("nomes_sem_algarismos", names, check_names,
                   lambda value: value[ids[0]].update(pt=value[ids[0]]["pt"] + " 2026"),
                   "Acrescentar um período ao nome na cópia é recusado.", 372)

    def caveats(candidate):
        require(set(candidate) == set(raw), "Ressalvas sem cobertura")
        for sid, row in candidate.items():
            require(all(isinstance(row.get(k), str) and row[k].strip() for k in ("ressalva", "ressalva_en")),
                    sid + ": ressalva sem as duas línguas")
    measures.prove("ressalvas_nas_duas_linguas", rows, caveats,
                   lambda value: value[ids[0]].pop("ressalva_en"), "Retirar uma língua da ressalva na cópia é recusado.", 186)
    xls_ids = [sid for sid, row in raw.items() if row.get("evidence", {}).get("file", "").endswith(".xls")]
    measures.count("linhas_xls", xls_ids, 41)
    def scale(candidate):
        for sid in xls_ids:
            row = candidate[sid]
            require("não imprime a unidade" in row["ressalva"] and "seis correspondências exatas" in row["ressalva"]
                    and "does not print the unit" in row["ressalva_en"] and "six exact matches" in row["ressalva_en"],
                    sid + ": inferência da unidade não publicada nas duas línguas")
    measures.prove("inferencias_xls_publicadas", rows, scale,
                   lambda value: value[xls_ids[0]].update(ressalva="Sem aviso de escala."),
                   "Retirar o aviso da unidade da cópia é recusado.", len(xls_ids))

    def gap(candidate):
        a, b, c = (number(candidate[sid]["value"]) for sid in GAP_IDS)
        require(a - b - c == Decimal("802.9"), "A diferença real dos três indicadores não é a declarada")
        for sid in GAP_IDS:
            row = candidate[sid]
            require("802,9" in row["ressalva"] and "802.9" in row["ressalva_en"], sid + ": não fecho ausente")
            require("296420,8 - 191368,9 - 104249 = 802,9" in str(row.get("derivation"))
                    and "296420.8 - 191368.9 - 104249 = 802.9" in str(row.get("derivation_en")),
                    sid + ": derivação da diferença ausente")
            require(row["derived_from"] == [], sid + ": um valor publicado foi convertido em derivado")
    measures.prove("nao_fecho_conferido_em_decimal", rows, gap,
                   lambda value: value[GAP_IDS[0]].update(value="296421,8"),
                   "Somar um ao primeiro indicador na cópia altera a diferença e é recusado.", "802,9")
    measures.count("linhas_com_nao_fecho", GAP_IDS, 3)

    def units(candidate):
        for sid, row in candidate.items():
            expected = old[sid]["unit"]
            if row["reference_date"] in {"2026-07", "2026-08"}:
                month = {"2026-07": "julho", "2026-08": "agosto"}[row["reference_date"]]
                expected += (", acumulados de janeiro a " if expected == "milhões de euros" else ", sobre valores acumulados de janeiro a ") + month
            require(row["unit"] == expected, sid + ": unidade ou acumulado divergente")
    executed = [sid for sid in ids if rows[sid]["reference_date"] in {"2026-07", "2026-08"}]
    measures.prove("unidades_acumuladas", rows, units,
                   lambda value: value[executed[0]].update(unit=old[executed[0]]["unit"]),
                   "Retirar o acumulado da unidade na cópia é recusado.", len(executed))
    measures.count("linhas_de_execucao", executed, len(executed))

    crossing = json.loads((SITE / "ledger/cruzamentos/oe1.json").read_text())["rows"]
    def hashes(candidate):
        for sid in ids:
            require(sha(candidate[sid]) == crossing[sid]["exported_row_sha256"], sid + ": bytes diferentes da travessia")
    measures.prove("resumos_das_linhas_conferidos", bodies, hashes,
                   lambda value: value.update({ids[0]: value[ids[0]] + b" "}),
                   "Acrescentar um byte a um YAML na cópia é recusado.", len(bodies))
    name_record = json.loads((SITE / "ledger/cruzamentos/oe1-nomes.json").read_text())["files"]["medidas-oe1.mjs"]
    def name_hash(value):
        require(sha(value) == name_record["exported_sha256"] == name_record["origin_sha256"], "Resumo dos nomes diferente do registo")
        require(value == (motor / name_record["origin_path"]).read_bytes(), "Nomes diferentes do módulo do motor")
    measures.prove("resumo_dos_nomes_conferido", module.encode(), name_hash,
                   lambda value: value + b" ", "Acrescentar um byte ao módulo na cópia é recusado.", sha(module.encode()))
    if args.html:
        html_measures(measures, rows, names, heads["sitio"])
    output = dict(bloco="OE1-d", passou=True, medido_em=datetime.now(timezone.utc).isoformat(), cabecas=heads, bases=bases,
                  guiao_sha256=sha(Path(__file__).read_bytes()),
                  politica="Medição na cabeça do código, antes do último commit reservado às provas.",
                  html_conferido=args.html, medidas=measures.items,
                  resumos={sid: sha(body) for sid, body in sorted(bodies.items())})
    (HERE / "medidas-oe1d.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(dict(passou=True, medidas=len(measures.items), conhecido_positivo=all(m["conhecido_positivo"] for m in measures.items.values()),
                          html_conferido=args.html, cabecas=heads), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        message = str(error).replace(str(SITE), "<sitio>").replace(str(Path(sys.argv[1]).resolve()), "<motor>").replace(str(Path.home()), "<pasta-local>")
        failure = dict(bloco="OE1-d", passou=False, medido_em=datetime.now(timezone.utc).isoformat(), erro=message)
        (HERE / "medidas-oe1d.json").write_text(json.dumps(failure, ensure_ascii=False, indent=2) + "\n")
        print(json.dumps(failure, ensure_ascii=False))
        raise SystemExit(1)
