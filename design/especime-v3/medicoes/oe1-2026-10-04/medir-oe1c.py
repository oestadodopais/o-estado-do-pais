"""Confere as extensões OE1-c e os registos efetivos, sem escrever nas linhas.

Uso: python3 medir-oe1c.py <motor> [--final <resposta>]
Os caminhos recebidos são usados em memória, nunca copiados para os registos.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import subprocess
import sys

HERE = Path(__file__).resolve().parent
SITE = HERE.parents[3]
MOTOR = Path(sys.argv[1]).resolve()
BASE = "0bb9958ae6e6aeb00355bb87a54213d1173d2735"
MOTOR_HEAD = "9bfbb777f7d2f5af8b185475c8dd8027ebd76bad"
spec = importlib.util.spec_from_file_location("medidas_oe1", HERE / "medir.py")
medir = importlib.util.module_from_spec(spec)
spec.loader.exec_module(medir)


def git(root, *args):
    return subprocess.check_output(["git", *args], cwd=root, text=True).strip()


def save(name, data):
    raw = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    assert str(Path.home()) not in raw and Path.home().name not in raw
    (HERE / name).write_text(raw)


def extract(log, key):
    return next(json.loads(line)[key] for line in log.splitlines() if line.startswith('{"' + key + '":'))


def prove():
    assert git(MOTOR, "rev-parse", "HEAD") == MOTOR_HEAD
    assert not git(MOTOR, "status", "--porcelain"), "O motor foi alterado"
    assert not git(SITE, "diff", BASE, "--", "ledger"), "O livro do sítio foi alterado"
    logs = {n: (HERE / ("oe1c-" + n + ".log")).read_text() for n in ["indice", "feixe"]}
    assert all((HERE / ("oe1c-" + n + ".codigo")).read_text().strip() == "0" for n in logs)
    local = extract(logs["indice"], "plantas_localizadores")
    crop = extract(logs["feixe"], "recorte_livro")
    assert len(local["plantas"]) == 12 and all(p["mordeu"] and p["queixa_I1"] and len(p["queixas_I3"]) == 2 for p in local["plantas"])
    assert len(local["formatos_anteriores"]) == 4 and all(p["aceite"] for p in local["formatos_anteriores"])
    before = json.loads((HERE / "proposta-localizadores.json").read_text())
    assert [p["nome"] for p in before["plantas"]] == [p["nome"] for p in local["plantas"]]
    feixe_plants = [{"nome": n, "mordeu": "mordeu · feixe · " + n in logs["feixe"]}
                    for n in ["tamanho", "dependência SVG", "imagem externa", "recorte retirado"]]
    assert all(p["mordeu"] for p in feixe_plants)
    assert crop["entradas_no_recorte"] == 8 and crop["primeiras_preservadas"] and crop["nota_e_porta_preservadas"] and crop["pagina_conservada"]
    assert crop["bytes_cartao"] < crop["teto_bytes"] <= crop["bytes_sem_recorte"] and crop["margem"] == 0.1
    assert hashlib.sha256((SITE / "dist/livro-razao/index.html").read_bytes()).hexdigest() == crop["pagina_sha256"]
    original = git(SITE, "show", BASE + ":tests/livro/indice.mjs")
    patch = (HERE / "indice-localizadores.patch").read_text()
    added = "".join(s[1:] for s in patch.splitlines(True) if s.startswith("+") and not s.startswith("+++"))
    needle = "const LOCALIZADORES_CONHECIDOS = [\n"
    expected = original.replace(needle, needle + added)
    def section(s):
        a = s.index(needle)
        return s[a:s.index("\n];", a) + 3]
    assert section((SITE / "tests/livro/indice.mjs").read_text()) == section(expected), "A lista diverge da proposta autorizada"
    assert (SITE / "package.json").read_text().count('"check:indice": "node tests/livro/indice.mjs --navegador --prova"') == 1
    bundle = (SITE / "scripts/design-bundle.mjs").read_text()
    old_bundle = git(SITE, "show", BASE + ":scripts/design-bundle.mjs")
    for name in ["MAIOR_CARTAO_MEDIDO_KIB", "MARGEM_DO_TECTO", "LIMITE_BYTES"]:
        statement = next(s for s in old_bundle.splitlines() if s.startswith("const " + name + " ="))
        assert statement in bundle, "O teto ou a margem mudaram"
    book = json.loads((MOTOR / "content/20 Orcamento do Estado/ledger.json").read_text())["claims"]
    preserved = []
    for row in book:
        path = "ledger/claims/" + row["id"] + ".yml"
        raw = (SITE / path).read_bytes()
        old = subprocess.check_output(["git", "show", BASE + ":" + path], cwd=SITE)
        assert raw == old
        preserved.append({"id": row["id"], "sha256": hashlib.sha256(raw).hexdigest(), "igual": True})
    assert len(preserved) == 186
    measures = {
        "plantas_localizadores_oe1c": medir.count_measure(local["plantas"], lambda p: p["mordeu"]),
        "formatos_anteriores_oe1c": medir.count_measure(local["formatos_anteriores"], lambda p: p["aceite"]),
        "formatos_novos_oe1c": medir.count_measure([g for g in before["grupos"] if g["leitor"].startswith("publisher/")], lambda g: bool(g["linhas"])),
        "plantas_feixe_oe1c": medir.count_measure(feixe_plants, lambda p: p["mordeu"]),
        "linhas_conservadas_oe1c": medir.count_measure(preserved, lambda p: p["igual"]),
    }
    data = dict(medido_em=datetime.now(timezone.utc).isoformat(), modelo="Codex gpt-6-astra",
                cabecas_na_medicao={"motor": MOTOR_HEAD, "sitio": git(SITE, "rev-parse", "HEAD")},
                implementacao={p: hashlib.sha256((SITE / p).read_bytes()).hexdigest() for p in
                               ["tests/livro/indice.mjs", "scripts/design-bundle.mjs", "package.json"]},
                localizadores=local, feixe={"recorte": crop, "plantas": feixe_plants},
                linhas=preserved, medidas=measures, lista_igual_a_proposta=True, teto_e_margem_iguais=True)
    save("oe1c-provas.json", data)
    print(json.dumps({"medidas": len(measures), "conhecidos_positivos": all(m["conhecido_positivo"] for m in measures.values()),
                      "plantas_localizadores": len(local["plantas"]), "plantas_feixe": len(feixe_plants), "linhas_iguais": len(preserved)}))


def final(target):
    heads = {"motor": git(MOTOR, "rev-parse", "HEAD"), "sitio": git(SITE, "rev-parse", "HEAD")}
    gates = {n: medir.gate(n) for n in ["motor", "ledger", "build", "verify", "typecheck"]}
    assert all(g["codigo"] is not None and g["cabeca"] == heads["motor" if n == "motor" else "sitio"] for n, g in gates.items()), "Registos incompletos ou de outra cabeça"
    assert (HERE / "portoes/cabeca.fim").read_text().strip() == heads["sitio"]
    c = json.loads((HERE / "custo-oe1c.json").read_text())
    good = all(g["codigo"] == 0 for g in gates.values())
    final_proofs = None
    if good:
        log = (HERE / "portoes/verify.log").read_text()
        local = extract(log, "plantas_localizadores")
        crop = extract(log, "recorte_livro")
        assert len(local["plantas"]) == 12 and all(p["mordeu"] for p in local["plantas"])
        assert crop["planta"]["mordeu"] and crop["pagina_conservada"]
        assert all("mordeu · feixe · " + n in log for n in ["tamanho", "dependência SVG", "imagem externa", "recorte retirado"])
        final_proofs = {"localizadores": local, "recorte": crop}
    proof = json.loads((HERE / "oe1c-provas.json").read_text())
    for p, sha in proof["implementacao"].items():
        assert hashlib.sha256((SITE / p).read_bytes()).hexdigest() == sha
    assert not git(MOTOR, "status", "--porcelain") and not git(SITE, "diff", BASE, "--", "ledger")
    commits = git(SITE, "log", "--reverse", "--format=%H %s", BASE + "..HEAD").splitlines()
    data = dict(medido_em=datetime.now(timezone.utc).isoformat(), cabecas=heads, portoes=gates, commits=commits,
                fecho_verificado=good, custo=c, linhas_conservadas=186, provas_na_corrida_final=final_proofs)
    save("oe1c-final.json", data)
    state = "OE1-c fechou a integração: os cinco portões estão a 0." if good else "OE1-c não fechou: há um portão com código diferente de zero."
    text = state + " O OE1 integral continua parcial pelas lacunas de fonte.\n\n"
    text += f"Motor: `{heads['motor']}`.\n\nSítio: `{heads['sitio']}`.\n\n"
    text += "Commits desta passagem:\n\n" + "\n".join("* " + line for line in commits) + "\n\n"
    text += "O motor não recebeu commits; mantém aa537323 e 9bfbb777.\n\n"
    text += "| Portão | Código lido de ficheiro |\n|---|---:|\n" + "\n".join(f"| {n} | {g['codigo']} |" for n, g in gates.items()) + "\n\n"
    text += "Os códigos e cabeças estão em design/especime-v3/medicoes/oe1-2026-10-04/portoes/. A corrida do sítio usou a tranca.\n\n"
    text += "As 186 linhas conservam os seus bytes. Doze plantas dos localizadores e quatro do feixe morderam. Os quatro formatos anteriores, o teto e a margem mantêm-se.\n\n"
    text += "Continuam por selar a receita consolidada AC+SS e o saldo correspondente nos mapas, a despesa bruta da Segurança Social por divergência entre mapas e as necessidades de financiamento mensais por falta de uma linha da fonte com essa grandeza.\n\n"
    text += "Relatório: design/especime-v3/medicoes/oe1-2026-10-04/LEIA-ME.md, secção OE1-c. Tabela integral das linhas: LINHAS.md na mesma pasta.\n\n"
    text += f"Custo OE1-c ao corte {c['medido_em']}: {c['tokens_totais']} símbolos, incluindo {c['tokens_entrada_cache']} de cache; {c['segundos']} segundos. Modelo: Codex gpt-6-astra. Os contadores incluem as revisões automáticas e não são preço monetário.\n\n"
    text += "Relatório e resposta curta comitados. Os registos da execução na cabeça final foram escritos depois do commit e ficam na worktree. Nenhum push.\n"
    if not good:
        text += "\nA corrida parou para relato; nenhum portão foi enfraquecido para ultrapassar o vermelho.\n"
    assert Path.home().name not in text and str(Path.home()) not in text
    (HERE / "OE1-c-resultado.md").write_text(text)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text)
    assert target.read_text() == text
    print(json.dumps({"cabecas": heads, "codigos": {n: g["codigo"] for n, g in gates.items()}, "fecho_verificado": good, "segundos": c["segundos"], "tokens": c["tokens_totais"]}))
    return 0 if good else 1


if __name__ == "__main__":
    if "--final" in sys.argv:
        raise SystemExit(final(Path(sys.argv[sys.argv.index("--final") + 1])))
    prove()
