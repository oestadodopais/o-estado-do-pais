"""Mede o F2.2b sobre os dois ramos e os ficheiros de prova, sem rede."""
import argparse
import ast
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

BASE_MOTOR = "1af04566898ddfc2c5244c55c7f229b1c287fee2"
BASE_SITIO = "24e7c8752f5bf80b263f13530f618278ba474992"


def git(raiz, *args):
    return subprocess.check_output(["git", "-C", str(raiz), *args], text=True).strip()


def ler(p):
    return json.loads(p.read_text(encoding="utf-8"))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--motor", required=True, type=Path)
    p.add_argument("--provas", required=True, type=Path)
    p.add_argument("--portoes", type=Path)
    a = p.parse_args()
    saida = Path(__file__).resolve().parent
    sitio = saida.parents[3]
    portoes = a.portoes or saida / "portoes"
    execucoes = {}
    fontes = [(nome, a.provas / nome, "provas") for nome in (
        "core-inicial", "precommit-isolamento", "commit-motor-1", "commit-motor-2", "core-final", "plantas", "fluxo")]
    fontes += [("site-" + nome, portoes / nome, "portoes") for nome in ("build", "verify", "typecheck")]
    cabecas_sitio = set()
    for nome, base, pasta in fontes:
        r = ler(base.with_suffix(".json"))
        codigo = int(base.with_suffix(".codigo").read_text())
        if codigo != r["codigo"]:
            raise SystemExit(f"O código não corresponde ao registo de {nome}")
        r["codigo_lido_de"] = f"{pasta}/{base.name}.codigo"
        if pasta == "portoes":
            cabeca = base.with_suffix(".cabeca").read_text().strip()
            if cabeca != r["cabeca"]:
                raise SystemExit(f"A cabeça não corresponde ao registo de {nome}")
            cabecas_sitio.add(cabeca)
            r["cabeca_lida_de"] = f"portoes/{base.name}.cabeca"
        r["sha256_saida"] = hashlib.sha256(base.with_suffix(".log").read_bytes()).hexdigest()
        execucoes[nome] = r
    if len(cabecas_sitio) != 1:
        raise SystemExit("Os três portões não correram na mesma cabeça do sítio")
    cabeca_sitio = cabecas_sitio.pop()
    pacote = str(saida.relative_to(sitio)) + "/"
    posteriores = git(sitio, "diff", "--name-only", cabeca_sitio, "HEAD").splitlines()
    if any(not nome.startswith(pacote) for nome in posteriores):
        raise SystemExit("Há mudanças fora do pacote de prova depois da cabeça conferida")
    alterados = git(a.motor, "diff", "--name-only", BASE_MOTOR, "HEAD").splitlines()
    proibidos = [x for x in alterados if (
        x.startswith("indicators/") and x.count("/") == 1 and x.endswith(".json"))
        or x.startswith(".maintenance-locks/")
        or (x.startswith("sweeps/") and x not in ("sweeps/decisoes.py", "sweeps/monthly.sh"))
        or x == "publisher/recortes/manifest.regioes.json"]
    if proibidos:
        raise SystemExit("O ramo alterou um caminho protegido")
    modulo = ast.parse(git(a.motor, "show", "HEAD:indicators/publicar_rotina.py"))
    limites = {alvo.id: ast.literal_eval(no.value) for no in modulo.body
               if isinstance(no, ast.Assign) for alvo in no.targets
               if isinstance(alvo, ast.Name) and alvo.id in ("INTERVALO", "TETO")}
    if set(limites) != {"INTERVALO", "TETO"}:
        raise SystemExit("Não foi possível medir os limites da publicação")
    fluxo = re.search(r"FLUXOS: PASS\D+(\d+) conferência", (a.provas / "fluxo.log").read_text())
    if not fluxo or execucoes["fluxo"]["codigo"] != 0:
        raise SystemExit("A contagem do fluxo não tem uma prova verde")
    dados = {"bloco": "F2.2b", "medido_em": datetime.now(timezone.utc).isoformat(),
        "bases": {"motor": BASE_MOTOR, "sitio": BASE_SITIO},
        "cabecas_lidas": {"motor": git(a.motor, "rev-parse", "HEAD"), "sitio": git(sitio, "rev-parse", "HEAD")},
        "cabeca_dos_tres_portoes_do_sitio": cabeca_sitio,
        "mudancas_posteriores_aos_portoes": posteriores,
        "commits_motor": git(a.motor, "log", "--reverse", "--format=%H %s", f"{BASE_MOTOR}..HEAD").splitlines(),
        "commits_sitio_anteriores_ao_relatorio": git(sitio, "log", "--reverse", "--format=%H %s", f"{BASE_SITIO}..HEAD").splitlines(),
        "commit_do_relatorio": "o commit que contém LEIA-ME.md, RESPOSTA-construtor-f22b.md e este medidas.json",
        "alteracoes_protegidas": proibidos,
        "brief_reproduzido": ler(a.provas / "brief.json"),
        "plantas": ler(a.provas / "plantas-detalhe.json"),
        "conferencias_do_fluxo": int(fluxo.group(1)),
        "limites_da_publicacao_segundos": limites,
        "execucoes": execucoes,
        "caches_locais_repostas": ler(a.provas / "caches.json"),
        "custo_observado": ler(a.provas / "custo.json"),
        "custo_da_retoma": ler(a.provas / "custo-retoma.json"),
        "efeitos_externos_da_construcao": {"push": 0, "despachos": 0, "interruptores_alterados": 0, "agentes_reais_alterados": 0},
        "por_fazer": ["publicação dos ramos", "ensaios despachados no GitHub", "chaves e interruptores pelo diretor", "duas corridas reais verdes de cada rotina antes da reforma dos agentes"]}
    texto = json.dumps(dados, ensure_ascii=False, indent=2) + "\n"
    if str(Path.home()) in texto or Path.home().name in texto:
        raise SystemExit("A prova contém uma identificação local")
    (saida / "medidas.json").write_text(texto, encoding="utf-8")
    print(f"F2.2b: {dados['plantas']['provas']} plantas, {len(execucoes)} execuções com código lido de ficheiro")


if __name__ == "__main__":
    main()
