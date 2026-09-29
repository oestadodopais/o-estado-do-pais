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


def caminhos_pessoais(conteudo):
    texto = conteudo.decode("utf-8", "replace")
    # O exemplo com reticências do mandato não identifica uma pasta. Só esta
    # marca completa é excluída; uma continuação com um caminho continua a contar.
    texto = re.sub("<pasta-pessoal>" + r"/\.{3}(?![./\w-])", "", texto)
    return bool(re.search(r"/(?:Users|home)/[^/\s]+/|" + "~" + r"/[^\s]+|<pasta-pessoal>" + r"/[^\s]+", texto)
                or str(Path.home()) in texto or Path.home().name in texto)


def conferir_pacote(pasta):
    ficheiros = [p for p in pasta.rglob("*") if p.is_file()]
    if not ficheiros:
        raise SystemExit("O pacote não tem ficheiros")
    maus = [str(p.relative_to(pasta)) for p in ficheiros if caminhos_pessoais(p.read_bytes())]
    if maus:
        raise SystemExit("Caminhos pessoais em: " + ", ".join(maus))
    return len(ficheiros)


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
        "conferencia_posterior_aos_portoes": "A fazer pelo lugar de direção na aterragem, entre a cabeça dos portões e a final.",
        "commits_motor": git(a.motor, "log", "--reverse", "--format=%H %s", f"{BASE_MOTOR}..HEAD").splitlines(),
        "commits_sitio_anteriores_ao_relatorio": git(sitio, "log", "--reverse", "--format=%H %s", f"{BASE_SITIO}..HEAD").splitlines(),
        "commits_dos_relatorios": {
            "f22b": "77d9e4076eb8098a45e6ca0cd3c27964d54a9301",
            "f22c": "cb1600b6e147f2bdc05f73396404f344b3495c2b",
            "f22d": "o último commit desta passagem, que contém a revisão de LEIA-ME.md e medidas.json, as provas F2.2d e RESPOSTA-construtor-f22d.md; o SHA é dado fora do ramo"},
        "alteracoes_protegidas": proibidos,
        "brief_reproduzido": ler(a.provas / "brief.json"),
        "plantas": ler(a.provas / "plantas-detalhe.json"),
        "conferencias_do_fluxo": int(fluxo.group(1)),
        "limites_da_publicacao_segundos": limites,
        "execucoes": execucoes,
        "caches_locais_repostas": ler(a.provas / "caches.json"),
        "custo_observado": ler(a.provas / "custo.json"),
        "custo_da_retoma": ler(a.provas / "custo-retoma.json"),
        "declaracoes": {"origem": "declaração do construtor, não medição", "efeitos_externos_da_construcao": {"push": 0, "despachos": 0, "interruptores_alterados": 0, "agentes_reais_alterados": 0}, "conferencia_externa": "O lugar de direção mede os interruptores e os despachos na aterragem."},
        "por_fazer": ["publicação dos ramos", "ensaios despachados no GitHub", "chaves e interruptores pelo diretor", "duas corridas reais verdes de cada rotina antes da reforma dos agentes"]}
    f22c = saida / "provas/f22c"
    if (f22c / "core-final.codigo").exists():
        execucoes_c = {}
        for pasta in (f22c, saida / "portoes/f22c"):
            for ficheiro in sorted(pasta.glob("*.codigo")):
                base = ficheiro.with_suffix("")
                registo = ler(base.with_suffix(".json"))
                codigo = int(ficheiro.read_text())
                if codigo != registo["codigo"]:
                    raise SystemExit("Código incoerente: " + ficheiro.name)
                registo["codigo_lido_de"] = str(ficheiro.relative_to(saida))
                registo["sha256_saida"] = hashlib.sha256(base.with_suffix(".log").read_bytes()).hexdigest()
                if base.with_suffix(".cabeca").exists():
                    if base.with_suffix(".cabeca").read_text().strip() != registo["cabeca"]:
                        raise SystemExit("Cabeça incoerente: " + ficheiro.name)
                execucoes_c[base.name] = registo
        # O portão F2.2c é histórico depois da F2.2d, mas continua na ascendência.
        git(a.motor, "merge-base", "--is-ancestor", execucoes_c["core-final"]["cabeca"], "HEAD")
        cabecas_c = {execucoes_c[n]["cabeca"] for n in ("build", "verify", "typecheck")}
        if len(cabecas_c) != 1:
            raise SystemExit("Os portões F2.2c não têm a mesma cabeça")
        dados["f22c"] = {"execucoes": execucoes_c,
            "plantas_rotinas": ler(f22c / "plantas-detalhe.json"),
            "plantas_adicionais": ler(f22c / "plantas-f22c-detalhe.json"),
            "custo": ler(f22c / "custo.json"),
            "cabeca_dos_portoes_do_sitio": cabecas_c.pop(),
            "conferencia_da_aterragem": "Cabeça final contra cabeça dos portões: a cargo do lugar de direção."}
    f22d = saida / "provas/f22d"
    if f22d.exists():
        execucoes_d = {}
        for pasta in (f22d, saida / "portoes/f22d"):
            for ficheiro in sorted(pasta.glob("*.codigo")):
                base = ficheiro.with_suffix("")
                registo = ler(base.with_suffix(".json"))
                codigo = int(ficheiro.read_text())
                if codigo != registo["codigo"]:
                    raise SystemExit("Código incoerente: " + ficheiro.name)
                if base.with_suffix(".cabeca").read_text().strip() != registo["cabeca"]:
                    raise SystemExit("Cabeça incoerente: " + ficheiro.name)
                estado = registo["codigo_executado"]
                if base.with_suffix(".arvore").read_text().strip() != estado["arvore"]:
                    raise SystemExit("Árvore incoerente: " + ficheiro.name)
                registo["codigo_lido_de"] = str(ficheiro.relative_to(saida))
                registo["sha256_saida"] = hashlib.sha256(base.with_suffix(".log").read_bytes()).hexdigest()
                execucoes_d[base.name] = registo
        dados["f22d"] = {"execucoes": execucoes_d,
            "custo": ler(f22d / "custo.json"),
            "custo_do_bloco": ler(f22d / "custo-bloco.json"),
            "prompt_reposto": ler(f22d / "prompt-reposto.json"),
            "excecao_do_detetor": "Só o exemplo com reticências do mandato é excluído; não identifica uma pasta.",
            "conferencia_da_aterragem": "Cabeça final contra cabeça dos portões: a cargo do lugar de direção."}
        for nome in ("plantas-detalhe", "plantas-f22c-detalhe", "clone-detalhe"):
            if (f22d / (nome + ".json")).exists():
                dados["f22d"][nome] = ler(f22d / (nome + ".json"))
        if "core-final" in execucoes_d:
            final = execucoes_d["core-final"]
            if final["cabeca"] != git(a.motor, "rev-parse", "HEAD"):
                raise SystemExit("O portão F2.2d não correu na cabeça final do motor")
            if final["codigo_executado"]["arvore"] != git(a.motor, "rev-parse", "HEAD^{tree}"):
                raise SystemExit("A árvore do portão final do motor não é a do commit")
        if all(n in execucoes_d for n in ("build", "verify", "typecheck")):
            cabecas_d = {execucoes_d[n]["cabeca"] for n in ("build", "verify", "typecheck")}
            if len(cabecas_d) != 1:
                raise SystemExit("Os portões F2.2d não têm a mesma cabeça")
            dados["f22d"]["cabeca_dos_portoes_do_sitio"] = cabecas_d.pop()
    texto = json.dumps(dados, ensure_ascii=False, indent=2) + "\n"
    # O conhecido-positivo exerce o mesmo detetor que percorre o pacote inteiro.
    positivo = "/" + "Users/" + "pessoa/" + "projeto/prova.log"
    if not caminhos_pessoais(positivo.encode()):
        raise SystemExit("O detetor não viu o caminho pessoal plantado")
    if caminhos_pessoais(texto.encode()):
        raise SystemExit("As medidas contêm uma identificação local")
    (saida / "medidas.json").write_text(texto, encoding="utf-8")
    vistos = conferir_pacote(saida)
    dados["varrimento_do_pacote"] = {"ficheiros_lidos": vistos, "caminhos_pessoais": 0, "conhecido_positivo": True}
    (saida / "medidas.json").write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("F2.2b: provas históricas e passagens agregadas; códigos, árvores e varrimento do pacote conferidos")


if __name__ == "__main__":
    main()
