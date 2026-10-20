"""Medida inicial reproduzível. Uso: python3 medir.py <motor>."""
import hashlib
import json
import re
import sys
from collections import Counter, defaultdict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

motor = Path(sys.argv[1])
study = motor / "content/26 Saude e Parcerias Efeitos"
raw = (study / "ledger.json").read_bytes()
rows = json.loads(raw)["claims"]
by = {r["id"]: r for r in rows}


def number(value):
    text = str(value).replace("M€", "").replace("M €", "").replace("%", "").replace(" ", "")
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    elif re.fullmatch(r"\d{1,3}(?:\.\d{3})+", text):
        text = text.replace(".", "")
    return Decimal(text)


expected = {
    "sns-sem-medico-serie-nova-2026-08": "1362294",
    "sns-sem-medico-serie-antiga-2026-06": "1672130",
    "sns-sem-medico-serie-antiga-2025-06": "1669681",
    "sns-consultas-csp-2026-08": "2577538",
    "sns-consultas-csp-2025-08": "2392474",
    "sns-cirurgias-2026-07": "520373",
    "sns-cirurgias-2025-07": "544482",
    "sns-lista-cirurgia-2026-07": "284210",
    "sns-lista-cirurgia-2025-07": "268645",
    "sns-espera-rncci-2026-10-19": "2482",
    "sns-espera-rncci-2025-10-19": "2220",
    "infarmed-ambulatorio-2026-07-p5-acumulado-encargo": "1179.3",
    "infarmed-ambulatorio-2026-07-p5-homologo-encargo": "1089.4",
    "infarmed-hospitalar-2026-07-p5-acumulado-encargo": "1600.9",
    "infarmed-hospitalar-2026-07-p5-homologo-encargo": "1530.2",
    "dgo-atraso-45-p": "689.9",
    "dgo-regularizacao-ae": "1398.6",
    "prr-monitorizacao-20261014-p2-C01-contratado": "2011",
    "prr-monitorizacao-20261014-p2-C01-pago": "947",
    "prr-monitorizacao-20261014-p2-C01-taxa": "47",
    "eurostat-pt-phys": "431.35",
    "eurostat-pt-nrs": "721.28",
}
selected = set(expected)
selected.update(r["id"] for r in rows if r["id"].startswith((
    "pe-brisa-", "pe-despacho-", "pe-scut-", "pe-dl87a-", "pe-tc15-",
    "pe-oe-", "infarmed-ambulatorio-limitacao", "oe2027-indicador-medico",
    "oe2027-compromisso-consultas", "oe2027-compromisso-cirurgias",
    "sns-divida-2026-divida_total_fornecedores_externos-",
    "sns-consultas-hospitalares-", "sns-urgencias-",
)))
milestones = [r for r in rows if r["id"].startswith((
    "prr-marcos-metas-2025-", "prr-complemento-")) and r["id"].endswith("-estado")]
selected.update(r["id"] for r in milestones)
extremes = {}
for kind in ("phys", "nrs"):
    group = [r for r in rows if r["id"].startswith("eurostat-") and r["id"].endswith("-"+kind) and r["value"] is not None]
    lo, hi = min(group, key=lambda r: number(r["value"])), max(group, key=lambda r: number(r["value"]))
    extremes[kind] = {"minimo": lo["id"], "maximo": hi["id"], "paises": len(group)}
    selected.update((lo["id"], hi["id"]))
differences = [{"id": k, "esperado": v, "lido": by.get(k, {}).get("value")}
               for k, v in expected.items() if k not in by or number(by[k]["value"]) != Decimal(v)]
values = {k: number(by[k]["value"]) for k in expected}
derived = []


def derive(id, components, operation, wanted=None):
    operands = [values.get(k, number(by[k]["value"]) if k in by else None) for k in components]
    if operation == "change_pct":
        result = (operands[0] / operands[1] - 1) * 100
    elif operation == "sum":
        result = sum(operands, Decimal(0))
    elif operation == "subtract":
        result = operands[0] - operands[1]
    elif operation == "percent":
        result = operands[0] / operands[1] * 100
    elif operation == "euros_to_millions":
        result = sum(operands, Decimal(0)) / 1000000
    rounded = result.quantize(Decimal(".1"), rounding=ROUND_HALF_UP)
    values[id] = rounded
    derived.append(dict(id=id, componentes=components, operandos=list(map(str, operands)),
                        operacao=operation, resultado_sem_arredondamento=str(result), resultado=str(rounded)))
    if wanted is not None and rounded != Decimal(wanted):
        differences.append(dict(id=id, esperado=wanted, lido=str(rounded)))


for short, period, wanted in (("consultas-csp", "08", "7.7"), ("cirurgias", "07", "-4.4"),
                            ("lista-cirurgia", "07", "5.8"), ("espera-rncci", "10-19", "11.8")):
    derive("der-sns-"+short+"-variacao-pct", [f"sns-{short}-2026-{period}", f"sns-{short}-2025-{period}"], "change_pct", wanted)
for year, key, wanted in ((2026, "acumulado", "2780.2"), (2025, "homologo", "2619.6")):
    derive(f"der-infarmed-total-{year}-jan-jul",
           [f"infarmed-{setting}-2026-07-p5-{key}-encargo" for setting in ("ambulatorio", "hospitalar")], "sum", wanted)
derive("der-infarmed-variacao-pct", ["der-infarmed-total-2026-jan-jul", "der-infarmed-total-2025-jan-jul"], "change_pct", "6.1")
derive("der-prr-saude-por-pagar", ["prr-monitorizacao-20261014-p2-C01-contratado", "prr-monitorizacao-20261014-p2-C01-pago"], "subtract", "1064")
derive("der-prr-saude-por-pagar-pct", ["der-prr-saude-por-pagar", "prr-monitorizacao-20261014-p2-C01-contratado"], "percent", "52.9")
debt = [r["id"] for r in rows if r["id"].startswith("sns-divida-2026-divida_total_fornecedores_externos-")]
derive("der-sns-divida-fornecedores-2026-07", debt, "euros_to_millions", "1517.5")
if len(milestones) != 37:
    differences.append(dict(id="marcos-saude", esperado=37, lido=len(milestones)))
derived.append(dict(id="der-prr-saude-marcos-completos", componentes=[r["id"] for r in milestones],
                    operacao="count_equal", criterio="Completo",
                    resultado=sum(r["value"] == "Completo" for r in milestones),
                    estados=dict(Counter(r["value"] for r in milestones))))
series = []
specs = json.loads((study / "partes/saude.json").read_text())["rows"]
for prefix in ("sns-consultas-hospitalares-", "sns-cirurgias-", "sns-urgencias-"):
    spec = next(s for s in specs if s["id"] == prefix+"2026-07")
    body = (motor / spec["file"]).read_bytes()
    data = json.loads(body, parse_float=Decimal)
    totals = defaultdict(Decimal)
    for record in data:
        for field in spec["fields"]:
            if record[field] is not None:
                totals[record[spec["time_field"]]] += Decimal(str(record[field]))
    window = {k: str(v) for k, v in sorted(totals.items()) if "2025-01" <= k <= "2026-07"}
    series.append(dict(ids=[prefix+"2025-07", prefix+"2026-07"], ficheiro=spec["file"],
                       sha256=hashlib.sha256(body).hexdigest(), campos=spec["fields"],
                       totais_por_mes=window,
                       natureza="Acumulado desde janeiro, inferido da progressão dos registos e do reinício em janeiro; a descrição não o define expressamente.",
                       periodos_corrigidos=["2025-01/2025-07", "2026-01/2026-07"]))
out = dict(livro="content/26 Saude e Parcerias Efeitos/ledger.json",
           sha256=hashlib.sha256(raw).hexdigest(),
           linhas=[{k: by[id].get(k) for k in ("id", "value", "unit", "period", "note", "label", "label_en")}
                   for id in sorted(selected)], extremos=extremes, derivadas=derived,
           natureza_series=series, divergencias=differences)
(Path(__file__).parent / "partida.json").write_text(json.dumps(out, ensure_ascii=False, indent=2)+"\n")
print(json.dumps({"linhas": len(selected), "derivadas": len(derived), "divergencias": differences}, ensure_ascii=False))
sys.exit(bool(differences))
