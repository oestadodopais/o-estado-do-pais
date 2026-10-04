"""Ensaia o recorte do feixe em memória e escreve os cartões numa pasta temporária."""
from pathlib import Path
import hashlib, json, os, re, subprocess, tempfile
from publisher.oe1_run import clean

here = Path("design/especime-v3/medicoes/oe1-2026-10-04")
target = Path("scripts/design-bundle.mjs")
original = subprocess.check_output(["git", "show", "ff8692ba096b493174e44eaf3d3695c4f56ded6f:scripts/design-bundle.mjs"], text=True)
actual = target.read_text()
# Aplica o diff apenas a uma cópia temporária do ficheiro, nunca à árvore.
with tempfile.TemporaryDirectory(prefix="oe1-feixe-") as temp:
    root = Path(temp)
    (root / "scripts").mkdir()
    copy = root / "scripts/design-bundle.mjs"
    copy.write_text(original)
    r = subprocess.run(["git", "apply", "--no-index"], cwd=root, input=(here / "feixe-recorte.patch").read_text(), text=True, capture_output=True)
    assert r.returncode == 0, clean(r.stderr)
    candidate = copy.read_text()
    before = hashlib.sha256(Path("dist/livro-razao/index.html").read_bytes()).hexdigest()
    def execute(code, folder, label):
        program = code.replace("from '../", "from './")
        program = program.replace("const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');", "const RAIZ = process.cwd();")
        program = program.replace("const SAIDA = path.join(RAIZ, 'design-system');", "const SAIDA = process.env.OE1_PROPOSTA_SAIDA;")
        result = subprocess.run(["node", "--input-type=module", "-", "--prova"], input=program, env={**os.environ, "OE1_PROPOSTA_SAIDA": str(folder)}, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        (here / (label + ".log")).write_text(clean(result.stdout))
        (here / (label + ".codigo")).write_text(str(result.returncode) + "\n")
        return result.returncode
    output = root / "cartoes"
    assert execute(candidate, output, "proposta-feixe") == 0
    specimen = output / "13-pagina-livro-razao.html"
    bytes_card = specimen.stat().st_size
    js = "import fs from 'node:fs';import {parse} from 'node-html-parser';const ids=f=>parse(fs.readFileSync(f,'utf8')).querySelectorAll('.livro-item').map(x=>x.getAttribute('data-linha-id'));const a=ids('dist/livro-razao/index.html'),b=ids(process.argv[1]);console.log(JSON.stringify({origem:a.length,recorte:b.length,primeiras_preservadas:JSON.stringify(a.slice(0,8))===JSON.stringify(b)}));"
    content = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", js, str(specimen)], text=True))
    assert content["recorte"] == 8 and content["primeiras_preservadas"]
    broken = candidate.replace("limiteDeLinhas: 8,", "limiteDeLinhas: null,")
    assert broken != candidate
    assert execute(broken, root / "planta", "planta-feixe-inteiro") == 1
    plant_log = (here / "planta-feixe-inteiro.log").read_text()
    assert re.search(r"13-pagina-livro-razao\.html[^\n]+✗[^\n]+tecto", plant_log)
    ordinary = (here / "proposta-feixe.log").read_text()
    plants = [{"nome": name, "mordeu": "mordeu · feixe · " + name in ordinary} for name in ["tamanho", "dependência SVG", "imagem externa"]]
    assert all(p["mordeu"] for p in plants)
    plants.append({"nome": "Retirar o recorte excede o teto do cartão 13", "mordeu": True})
    assert hashlib.sha256(Path("dist/livro-razao/index.html").read_bytes()).hexdigest() == before
    assert target.read_text() == actual
    data = dict(estado="proposta aplicada" if actual == candidate else "proposta não aplicada", bytes_cartao=bytes_card, conteudo=content,
                pagina_conservada=True, guiao_conservado=True, guarda_sha256=hashlib.sha256(original.encode()).hexdigest(), candidato_sha256=hashlib.sha256(candidate.encode()).hexdigest(),
                codigo=0, planta_sem_recorte=1, plantas=plants, plantas_do_feixe=["tamanho", "dependência SVG", "imagem externa"], teto_conservado=True)
    (here / "proposta-feixe.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(data, ensure_ascii=False))
