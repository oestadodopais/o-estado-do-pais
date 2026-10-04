"""Medições OE1-e, com uma planta específica por medida, só em cópias.

Recebe a worktree do motor. --html exige dist da cabeça atual. Reutiliza os
leitores Git, YAML e HTML do OE1-d; as regras desta passagem são independentes
do gerador das ressalvas. Escreve apenas medidas-oe1e.json, sem caminhos locais.
"""
from __future__ import annotations

import argparse
import copy
import importlib.util
import io
import json
import re
import subprocess
import sys
import tarfile
from collections import Counter
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location("medir_oe1d", HERE / "medir-oe1d.py")
D = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(D)
SITE = D.SITE
require, Falha, git, head, sha = D.require, D.Falha, D.git, D.head, D.sha
Document, normalized, one, field = D.Document, D.normalized, D.one, D.field
OLD_SITE, OLD_ENGINE, OBSERVATIONS = "6f6c7a67", "1f7520e4", "9bfbb777"
ALLOWED = {"ressalva", "ressalva_en", "derivation", "derivation_en"}
FAMILIES = {"ministerios": 16, "programas": 40, "funcoes": 20, "eurostat": 30, "totais": 44, "derivadas": 36}
WITHOUT = {
    "oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social",
    "execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social",
    "execucao-2026-08-fluxos-entre-programas", "execucao-2026-08-diferencas-consolidacao-programas",
}
MAP_TOTALS = {
    "oe-2026-despesa-bruta-administracao-central", "oe-2026-receita-bruta-administracao-central",
    "oe-2026-despesa-consolidada-administracao-central", "oe-2026-receita-consolidada-administracao-central",
    "oe-2026-despesa-total", "oe-2026-despesa-consolidada-seguranca-social", "oe-2026-receita-consolidada-seguranca-social",
}
EGE = "oe-2026-despesa-ministerio-encargos-gerais-do-estado"
PROGRAM = "oe-2026-despesa-programa-001"
EGE_SHARE = "oe-2026-cem-euros-ministerio-encargos-gerais-do-estado"
EGE_PHRASES = {
    "ressalva": "Não é um ministério. Nesta edição do orçamento, a rubrica dos Encargos Gerais do Estado tem o mesmo valor do programa 001, Órgãos de Soberania.",
    "ressalva_en": "This is not a ministry. In this budget edition, General State Charges has the same value as programme 001, Sovereign Bodies.",
}


class Measures:
    """A planta só passa se falhar com a queixa exata declarada pela medida."""
    def __init__(self):
        self.items = {}

    def prove(self, key, value, validator, mutate, complaint, plant, result=True):
        validator(value)
        altered = copy.deepcopy(value)
        replacement = mutate(altered)
        if isinstance(value, (str, bytes)):
            altered = replacement
        try:
            validator(altered)
        except Falha as error:
            require(str(error) == complaint, key + ": a planta deu outra queixa: " + str(error))
        else:
            raise Falha(key + ": a planta não mordeu")
        self.items[key] = dict(valor=result, passou=True, conhecido_positivo=True,
                               planta=plant, queixa_da_planta=complaint)

    def count(self, key, values, expected):
        complaint = key + ": contagem divergente"
        self.prove(key, list(values), lambda v: require(len(v) == expected, complaint),
                   lambda v: v.pop(), complaint, "Retirar uma entrada da cópia é recusado.", expected)


def prior_rows(ids):
    paths = ["ledger/claims/" + sid + ".yml" for sid in ids]
    with tarfile.open(fileobj=io.BytesIO(git(SITE, "archive", "--format=tar", OLD_SITE, "--", *paths))) as archive:
        return {sid: yaml.safe_load(archive.extractfile(p).read()) for sid, p in zip(ids, paths)}


def check_pairs(rows):
    for sid, row in rows.items():
        require(("ressalva" in row) == ("ressalva_en" in row), sid + ": ressalva sem par")
        if "ressalva" in row:
            require(all(isinstance(row[k], str) and row[k].strip() for k in ("ressalva", "ressalva_en")),
                    sid + ": ressalva vazia")
    require({sid for sid, row in rows.items() if "ressalva" not in row} == WITHOUT,
            "Ressalvas: as linhas sem aviso não são as quatro declaradas")


def inventory_measures(measures):
    rel = "design/especime-v3/INVENTARIO-FRASES.md"
    source = (SITE / rel).read_text()
    def section(text):
        match = re.search(r"^## C1f .+?(?=^## |\Z)", text, re.M | re.S)
        require(match is not None, "Inventário: secção C1f ausente")
        return match[0]
    current = section(source)
    old = section(git(SITE, "show", "b37cb066:" + rel).decode())
    complaint = "Inventário: a secção C1f difere da versão anterior ao OE1-d"
    measures.prove("c1f_reposto_integralmente", current, lambda v: require(v == old, complaint),
                   lambda v: v.replace("| Classe | Frase | Bloco | Estado | Razão |", "| classe | texto | bloco | estado | razão |", 1),
                   complaint, "Trocar só o cabeçalho da cópia da secção C1f é recusado.", sha(current.encode()))
    for block, filename, total in [("R2", "inventario-frases-r2.mjs", 33), ("R2-b", "inventario-frases-r2b.mjs", 6)]:
        path = SITE / "design/especime-v3/medicoes/r2-2026-10-03" / filename
        # Só as declarações são avaliadas. A parte que lê ou escreve o
        # inventário está depois de SECCAO e nunca entra neste programa.
        declarations = path.read_text().split("const SECCAO =", 1)[0]
        declarations = declarations.replace("import fs from 'node:fs';", "")
        result = subprocess.run(["node", "--input-type=module", "-e", declarations + "\nconsole.log(JSON.stringify(RETIRAR.map(([texto])=>texto)));"],
                                cwd=SITE, text=True, capture_output=True)
        require(result.returncode == 0, block + ": declarações não lidas")
        removed = json.loads(result.stdout)
        require(len(removed) == total, block + ": outra contagem declarada")
        def validate(candidate, removed=removed, block=block):
            for phrase in removed:
                found = [line.split(" | ") for line in candidate.splitlines()
                         if line.startswith(("| conteudo | ", "| navegacao | ")) and line.split(" | ")[1] == phrase]
                require(len(found) == 1, block + ": frase retirada ausente ou repetida")
                require(found[0][3] == "retirada", block + ": uma frase que devia estar retirada está viva")
        def damage(candidate, target=removed[0]):
            lines = candidate.splitlines(keepends=True)
            hits = [i for i, line in enumerate(lines) if "| " + target + " |" in line and " | retirada |" in line]
            require(len(hits) == 1, "Inventário: a planta não encontrou a frase retirada")
            lines[hits[0]] = lines[hits[0]].replace(" | retirada |", " | viva |", 1)
            return "".join(lines)
        measures.prove("retiradas_" + block.lower().replace("-", ""), source, validate, damage,
                       block + ": uma frase que devia estar retirada está viva",
                       "Voltar a pôr viva uma frase retirada só na cópia do inventário é recusado.", total)
    return ("O guião R2 --confere também exige a secção que escreveu antes do R2-b; "
            "essa secção foi alterada pelo R2-b. Esta medição confere as trinta e três "
            "retiradas declaradas do R2 e as seis do R2-b contra o inventário atual.")


def data_measures(measures, motor, rows, raw, bodies, old, names, family):
    ids = sorted(rows)
    def fixed(candidate):
        require(set(candidate) == set(old), "Linhas: cobertura diferente da base")
        for sid, row in candidate.items():
            require({k: v for k, v in row.items() if k not in ALLOWED} == {k: v for k, v in old[sid].items() if k not in ALLOWED},
                    sid + ": alteração fora dos quatro campos autorizados")
    measures.prove("so_ressalvas_e_contas_podem_mudar", rows, fixed, lambda v: v[ids[0]].update(value="[planta]"),
                   ids[0] + ": alteração fora dos quatro campos autorizados", "Trocar um valor na cópia é recusado.", 186)
    executed = [sid for sid in ids if rows[sid]["reference_date"] in {"2026-07", "2026-08"}]
    measures.count("linhas_de_execucao", executed, 62)
    def units(candidate):
        for sid, row in candidate.items():
            require(row["unit"] == old[sid]["unit"], sid + ": unidade diferente do OE1-d")
            if sid in executed:
                require("acumulad" in row["unit"], sid + ": execução sem acumulado")
    measures.prove("unidades_identicas_ao_oe1d", rows, units, lambda v: v[executed[0]].update(unit="milhões de euros"),
                   executed[0] + ": unidade diferente do OE1-d", "Retirar o acumulado da cópia é recusado.", 186)
    from publisher.oe1_nomes import render_names
    module = (SITE / "src/data/medidas-oe1.mjs").read_bytes()
    previous = git(SITE, "show", OLD_SITE + ":src/data/medidas-oe1.mjs")
    engine_previous = git(motor, "show", OLD_ENGINE + ":publisher/oe1_nomes.mjs")
    complaint = "Nomes: módulo diferente da base ou do gerador"
    measures.prove("nomes_identicos_ao_oe1d", module,
                   lambda v: require(v == previous == engine_previous == render_names(names).encode(), complaint),
                   lambda v: v + b" ", complaint, "Acrescentar um byte à cópia do módulo é recusado.", sha(module))
    complaint = "Famílias: cobertura divergente"
    measures.prove("familias", family, lambda v: require(dict(Counter(v.values())) == FAMILIES, complaint),
                   lambda v: v.pop(ids[0]), complaint, "Retirar uma linha da classificação em memória é recusado.", FAMILIES)
    measures.prove("ressalvas_pareadas_so_onde_preciso", rows, check_pairs, lambda v: v[EGE].pop("ressalva_en"),
                   EGE + ": ressalva sem par", "Retirar uma língua da cópia é recusado.", dict(com_ressalva=182, sem_ressalva=4))
    measures.count("linhas_com_ressalva", [sid for sid, r in rows.items() if "ressalva" in r], 182)
    def exact_scope(candidate, expected, pt, en, complaint):
        for sid, row in candidate.items():
            require((pt in row.get("ressalva", "")) == (sid in expected)
                    and (en in row.get("ressalva_en", "")) == (sid in expected), complaint)
    xls = {sid for sid, r in raw.items() if r.get("evidence", {}).get("file", "").endswith(".xls")}
    union = {sid for sid in ids if sid.startswith("despesa-por-funcao-") and sid.endswith("-ue")}
    comparison = {sid for sid in ids if "-funcao-" in sid}
    for key, expected, count, pt, en, target in [
        ("escala_so_nas_transcritas_xls", xls, 41, "não imprime a unidade", "does not print the unit", "oe-2026-cem-euros-funcao-01"),
        ("agregado_so_na_uniao", union, 10, "agregado da União Europeia", "European Union aggregate", "despesa-por-funcao-2024-gf01-pt"),
        ("comparacao_so_nas_funcoes", comparison, 70, "não são diretamente comparáveis", "not directly comparable", "oe-2026-despesa-ministerio-saude"),
    ]:
        require(len(expected) == count, key + ": família com outra contagem")
        complaint = key + ": aviso fora do alcance ou ausente"
        measures.prove(key, rows,
                       lambda v, expected=expected, pt=pt, en=en, c=complaint: exact_scope(v, expected, pt, en, c),
                       lambda v, target=target, pt=pt: v[target].update(ressalva=v[target].get("ressalva", "") + " " + pt),
                       complaint, "Acrescentar o aviso a uma linha fora do alcance na cópia é recusado.", count)
    financial = {sid for sid in ids if sid in MAP_TOTALS or sid.startswith(("oe-2026-despesa-ministerio-", "oe-2026-despesa-programa-", "oe-2026-cem-euros-ministerio-"))}
    require(len(financial) == 59, "Operações financeiras: família com outra contagem")
    def money(candidate):
        for sid in financial:
            require("operações financeiras" in candidate[sid].get("ressalva", "") and "financial transactions" in candidate[sid].get("ressalva_en", ""),
                    "Operações financeiras: aviso ausente numa das cinquenta e nove linhas")
    measures.prove("aviso_financeiro_nas_familias_dos_mapas", rows, money,
                   lambda v: v["oe-2026-despesa-ministerio-saude"].update(ressalva="Sem aviso."),
                   "Operações financeiras: aviso ausente numa das cinquenta e nove linhas",
                   "Retirar o aviso da rubrica Saúde, lida do PDF, é recusado.", 59)
    def equality(candidate):
        require(D.number(candidate[EGE]["value"]) == D.number(candidate[PROGRAM]["value"]) == Decimal("7733610763"), "EGE: a igualdade dos valores não fecha")
        require(candidate[PROGRAM]["name"] == "ÓRGÃOS DE SOBERANIA", "EGE: programa da igualdade divergente")
        for sid in (EGE, EGE_SHARE):
            for key, phrase in EGE_PHRASES.items():
                require(phrase in candidate[sid].get(key, ""), "EGE: ressalva da igualdade ausente")
            for key in ("derivation", "derivation_en"):
                require("7733610763 - 7733610763 = 0" in candidate[sid].get(key, ""), "EGE: conta da igualdade ausente")
        require(all("como a dívida e as transferências" not in r.get("ressalva", "") and "such as debt and transfers" not in r.get("ressalva_en", "") for r in candidate.values()),
                "EGE: conteúdo não demonstrado na ressalva")
    measures.prove("ege_igualdade_e_limite_do_aviso", rows, equality, lambda v: v[PROGRAM].update(value="7 733 610 764"),
                   "EGE: a igualdade dos valores não fecha", "Trocar o valor do programa na cópia desfaz a igualdade.", "7733610763 - 7733610763 = 0")
    def gap(candidate):
        a, b, c = (D.number(candidate[sid]["value"]) for sid in D.GAP_IDS)
        require(a - b - c == Decimal("802.9"), "Não fecho: diferença divergente")
        for sid in D.GAP_IDS:
            row = candidate[sid]
            require("802,9" in row.get("ressalva", "") and "802.9" in row.get("ressalva_en", "")
                    and "296420,8 - 191368,9 - 104249 = 802,9" in row.get("derivation", "")
                    and "296420.8 - 191368.9 - 104249 = 802.9" in row.get("derivation_en", ""), "Não fecho: ressalva ou conta ausente")
    measures.prove("nao_fecho_refeito_em_decimal", rows, gap, lambda v: v[D.GAP_IDS[0]].update(value="296421,8"),
                   "Não fecho: diferença divergente", "Alterar o primeiro indicador da cópia muda a diferença.", "802,9")
    transcribed = set(D.GAP_IDS) | {EGE}
    def calculations(candidate):
        actual = {sid for sid, row in candidate.items() if not row.get("derived_from") and row.get("derivation")}
        require(actual == transcribed, "Contas: as transcritas com conta não são as quatro autorizadas")
        for sid in transcribed:
            row = candidate[sid]
            require(row.get("ressalva") and row.get("ressalva_en") and row.get("derivation_en")
                    and row.get("check") is None and row.get("derived_from") == [], "Contas: valor publicado convertido em derivado ou conta sem ressalva")
    measures.prove("quatro_contas_so_da_ressalva", rows, calculations, lambda v: v[EGE].pop("ressalva"),
                   "Contas: valor publicado convertido em derivado ou conta sem ressalva", "Retirar a ressalva de uma transcrita com conta é recusado.", 4)
    crossing = json.loads((SITE / "ledger/cruzamentos/oe1.json").read_text())["rows"]
    def hashes(candidate):
        require(set(candidate) == set(crossing), "Travessia: cobertura divergente")
        for sid in ids:
            require(sha(candidate[sid]) == crossing[sid]["exported_row_sha256"], "Travessia: resumo YAML divergente")
    measures.prove("resumos_das_linhas_conferidos", bodies, hashes, lambda v: v.update({ids[0]: v[ids[0]] + b" "}),
                   "Travessia: resumo YAML divergente", "Acrescentar um byte ao YAML da cópia é recusado.", 186)
    record = json.loads((SITE / "ledger/cruzamentos/oe1-nomes.json").read_text())["files"]["medidas-oe1.mjs"]
    def name_hash(candidate):
        require(sha(candidate) == record["exported_sha256"] == record["origin_sha256"]
                and candidate == (motor / record["origin_path"]).read_bytes(), "Travessia: resumo dos nomes divergente")
    measures.prove("resumo_dos_nomes_conferido", module, name_hash, lambda v: v + b" ", "Travessia: resumo dos nomes divergente",
                   "Acrescentar um byte ao módulo da cópia é recusado.", sha(module))


def period(value, lang):
    if re.fullmatch(r"\d{4}", value):
        return value
    match = re.fullmatch(r"(\d{4})-(0[1-9]|1[0-2])", value)
    require(match is not None, "HTML: período OE1 fora das formas medidas")
    months = {"pt": ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
              "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
    return months[lang][int(match[2]) - 1] + (" de " if lang == "pt" else " ") + match[1]


def html_measures(measures, rows, names, current_head):
    version = json.loads((SITE / "dist/version.json").read_text())
    complaint = "HTML: a construção não é da cabeça atual"
    measures.prove("html_cabeca", version, lambda v: require(v.get("commit") == current_head, complaint),
                   lambda v: v.update(commit="0" * 40), complaint, "Trocar a cabeça da cópia da construção é recusado.", version["commit"])
    script = "import {unidadeDaLinha} from './src/i18n/unidades.mjs';let b='';for await(const c of process.stdin)b+=c;console.log(JSON.stringify(Object.fromEntries(JSON.parse(b).map(u=>[u,{pt:unidadeDaLinha(u,'pt'),en:unidadeDaLinha(u,'en')}]))));"
    result = subprocess.run(["node", "--input-type=module", "-e", script], cwd=SITE,
                            input=json.dumps(sorted({r["unit"] for r in rows.values()})), text=True, capture_output=True)
    require(result.returncode == 0, "HTML: o dicionário de unidades não foi lido")
    units = json.loads(result.stdout)
    receipts, entries, calculations = [], [], []
    for lang, prefix in (("pt", "livro-razao"), ("en", "en/ledger")):
        index = Document((SITE / "dist" / prefix / "index.html").read_text()).root
        for sid, row in rows.items():
            receipt = Document((SITE / "dist" / prefix / sid / "index.html").read_text()).root
            top = one(receipt, lambda n: "linha-cabeca" in (n.attrs.get("class") or "").split(), sid + ": cabeça HTML ausente")
            D.check_visible(top)
            receipts.append(dict(id=sid, lang=lang, root=top))
            item = one(index, lambda n: n.attrs.get("data-linha-id") == sid, sid + ": entrada do índice ausente ou repetida")
            entries.append(dict(id=sid, lang=lang, root=item))
            if row.get("derivation"):
                title = one(receipt, lambda n: n.attrs.get("id") == "aritmetica", sid + ": título da conta ausente")
                calculation = field(receipt, sid, "derivation")
                calculations.append(dict(id=sid, lang=lang, title=title.text(), text=normalized(calculation.text())))
    measures.count("html_recibos_nas_duas_linguas", receipts, 372)
    measures.count("html_entradas_nos_dois_indices", entries, 372)
    def fields(records):
        for record in records:
            sid, lang, root = record["id"], record["lang"], record["root"]
            row = rows[sid]
            name = one(root, lambda n: n.attrs.get("data-de-linha") == sid and n.attrs.get("data-nome") == "projeto",
                       sid + ": nome do projeto ausente ou repetido")
            require(normalized(name.text()) == names[sid][lang], sid + ": nome impresso divergente")
            unit = field(root, sid, "unit")
            require(normalized(unit.text()) == units[row["unit"]][lang]["texto"] and unit.attrs.get("lang") == units[row["unit"]][lang]["lingua"],
                    sid + ": unidade impressa divergente")
            caveats = root.find(lambda n: n.attrs.get("data-linha-claim") == sid and n.attrs.get("data-linha-campo") == "ressalva")
            expected = row.get("ressalva_en" if lang == "en" else "ressalva")
            require(len(caveats) == (1 if expected else 0), sid + ": presença da ressalva impressa divergente")
            if expected:
                require(normalized(caveats[0].text()) == expected, sid + ": ressalva impressa divergente")
    for key, records in (("recibos", receipts), ("indices", entries)):
        sid = records[0]["id"]
        def damage(values):
            target = field(values[0]["root"], values[0]["id"], "ressalva")
            target.children = ["Ressalva de outra linha."]
        measures.prove("html_campos_" + key, records, fields, damage, sid + ": ressalva impressa divergente",
                       "Trocar a ressalva numa cópia do HTML construído é recusado.", 372)
    def periods(records):
        for record in records:
            sid, lang, root = record["id"], record["lang"], record["root"]
            dates = root.find(lambda n: n.attrs.get("data-de-campo") == "reference_date")
            require(len(dates) == 1, sid + ": período do índice ausente ou repetido")
            date = dates[0]
            require(date.attrs.get("data-de-linha") == sid and date.attrs.get("data-nonledger") == "data-da-linha"
                    and normalized(date.text()) == period(rows[sid]["reference_date"], lang), sid + ": período do índice divergente")
    def change_period(records):
        date = one(records[0]["root"], lambda n: n.attrs.get("data-de-campo") == "reference_date", "Planta sem período")
        date.children = ["2099"]
    measures.prove("html_periodos_dos_indices", entries, periods, change_period, entries[0]["id"] + ": período do índice divergente",
                   "Trocar o período na cópia da entrada é recusado.", 372)
    def arithmetic(records):
        require(len(records) == 80, "HTML: faltam contas nos recibos")
        for record in records:
            sid, lang = record["id"], record["lang"]
            derived = bool(rows[sid]["derived_from"])
            title = {"pt": "Aritmética", "en": "Arithmetic"} if derived else {"pt": "A conta da ressalva", "en": "The caveat calculation"}
            require(record["title"] == title[lang], sid + ": rótulo da conta divergente")
            require(record["text"] == rows[sid]["derivation_en" if lang == "en" else "derivation"], sid + ": conta impressa divergente")
    selected = next(i for i, r in enumerate(calculations) if r["id"] == EGE)
    measures.prove("html_contas_com_rotulo_proprio", calculations, arithmetic,
                   lambda values: values[selected].update(title="Aritmética"), EGE + ": rótulo da conta divergente",
                   "Chamar aritmética do valor à conta da ressalva da cópia é recusado.", dict(transcritas=8, derivadas=72))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("motor", type=Path)
    parser.add_argument("--html", action="store_true")
    args = parser.parse_args()
    motor = args.motor.resolve()
    sys.path.insert(0, str(motor))
    from publisher.oe1_nomes import build_names, _one
    measures = Measures()
    heads = dict(motor=head(motor), sitio=head(SITE), main=head(SITE, "main"), master=head(motor, "master"))
    bases = dict(oe1d_sitio=head(SITE, OLD_SITE), oe1d_motor=head(motor, OLD_ENGINE), observacoes_motor=head(motor, OBSERVATIONS),
                 rebase_main=git(SITE, "merge-base", "HEAD", "main").decode().strip(),
                 rebase_master=git(motor, "merge-base", "HEAD", "master").decode().strip())
    for ref in ("main", "master"):
        complaint = "Base " + ref + ": a referência principal ainda não foi integrada"
        measures.prove("base_" + ref + "_integrada", {"base": bases["rebase_" + ref], "referencia": heads[ref]},
                       lambda v, c=complaint: require(v["base"] == v["referencia"], c), lambda v: v.update(base="0" * 40),
                       complaint, "Trocar a base integrada na cópia é recusado.", bases["rebase_" + ref])
    for key, rel in (("observacoes_motor_intactas", "content/20 Orcamento do Estado/ledger.json"), ("manifesto_motor_intacto", "publisher/manifest.oe1.json")):
        body, old = (motor / rel).read_bytes(), git(motor, "show", OBSERVATIONS + ":" + rel)
        complaint = "Motor: bytes diferentes das observações seladas"
        measures.prove(key, body, lambda v, old=old: require(v == old, complaint), lambda v: v + b" ",
                       complaint, "Acrescentar um byte à cópia é recusado.", sha(body))
    raw = {r["id"]: r for r in json.loads((motor / "content/20 Orcamento do Estado/ledger.json").read_text())["claims"]}
    ids = sorted(raw)
    measures.count("linhas_do_motor", ids, 186)
    bodies = {sid: (SITE / "ledger/claims" / (sid + ".yml")).read_bytes() for sid in ids}
    rows = {sid: yaml.safe_load(body) for sid, body in bodies.items()}
    measures.count("linhas_exportadas", rows, 186)
    names = build_names()
    family = {sid: _one(row, raw)[0] for sid, row in raw.items()}
    data_measures(measures, motor, rows, raw, bodies, prior_rows(ids), names, family)
    inventory_note = inventory_measures(measures)
    if args.html:
        html_measures(measures, rows, names, heads["sitio"])
    families = {name: dict(linhas=count, com_ressalva=sum(1 for sid in ids if family[sid] == name and "ressalva" in rows[sid]),
                           sem_ressalva=sorted(sid for sid in ids if family[sid] == name and "ressalva" not in rows[sid])) for name, count in FAMILIES.items()}
    output = dict(bloco="OE1-e", passou=True, medido_em=datetime.now(timezone.utc).isoformat(), cabecas=heads, bases=bases,
                  guiao_sha256=sha(Path(__file__).read_bytes()), infraestrutura_oe1d_sha256=sha((HERE / "medir-oe1d.py").read_bytes()),
                  politica="Medição da cabeça do código, antes do último commit só com provas; as plantas alteram cópias em memória.",
                  html_conferido=args.html, medidas=measures.items, familias=families, inventario_nota=inventory_note,
                  ege={sid: {key: rows[sid][key] for key in ("ressalva", "ressalva_en")} for sid in (EGE, EGE_SHARE)},
                  resumos={sid: sha(body) for sid, body in sorted(bodies.items())})
    (HERE / "medidas-oe1e.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(dict(passou=True, medidas=len(measures.items), conhecido_positivo=all(m["conhecido_positivo"] for m in measures.items.values()),
                         html_conferido=args.html, cabecas=heads, familias=families), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        message = str(error).replace(str(SITE), "<sitio>").replace(str(Path(sys.argv[1]).resolve()), "<motor>").replace(str(Path.home()), "<pasta-local>")
        failure = dict(bloco="OE1-e", passou=False, medido_em=datetime.now(timezone.utc).isoformat(), erro=message)
        (HERE / "medidas-oe1e.json").write_text(json.dumps(failure, ensure_ascii=False, indent=2) + "\n")
        print(json.dumps(failure, ensure_ascii=False))
        raise SystemExit(1)
