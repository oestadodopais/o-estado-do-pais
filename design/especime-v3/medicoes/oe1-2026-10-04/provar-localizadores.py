"""Ensaiar a proposta em memória, sem aplicar o patch ao verificador do sítio."""
from pathlib import Path
import hashlib, json, subprocess
from publisher.oe1_run import clean

here = Path("design/especime-v3/medicoes/oe1-2026-10-04")
path = Path("tests/livro/indice.mjs")
original = subprocess.check_output(["git", "show", "ff8692ba096b493174e44eaf3d3695c4f56ded6f:tests/livro/indice.mjs"], text=True)
aplicada_no_inicio = path.read_text()
patch = (here / "indice-localizadores.patch").read_text()
lines = [line[1:] for line in patch.splitlines(True) if line.startswith("+") and not line.startswith("+++")]
addition = "".join(lines)
needle = "const LOCALIZADORES_CONHECIDOS = [\n"
candidate = original.replace(needle, needle + addition)
assert candidate != original
# As importações e a raiz mudam só no programa passado ao stdin, porque não há
# um ficheiro de teste aplicado em tests/livro/.
program = candidate.replace("from '../../src/", "from './src/")
program = program.replace("const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');", "const RAIZ = process.cwd();")
r = subprocess.run(["node", "--input-type=module", "-", "--navegador"], input=program, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
(here / "proposta-indice.log").write_text(clean(r.stdout))
(here / "proposta-indice.codigo").write_text(str(r.returncode) + "\n")
assert path.read_text() == aplicada_no_inicio, "A guarda aplicada foi alterada durante o ensaio."
assert r.returncode == 0, clean(r.stdout[-4000:])
start = candidate.index("const LOCALIZADORES_CONHECIDOS = [")
end = candidate.index("/**\n * O DEGRAU DE ONDE O NOME VEIO", start)
functions = candidate[start:end]
proof = r"""
import assert from 'node:assert/strict';
import { loadClaims } from './src/lib/ledger.mjs';
const records = [...loadClaims().values()];
const rows = records.filter(r => r.study === 'oe-2026' && r.name);
const groups = LOCALIZADORES_CONHECIDOS.map(l => ({ nome: l.nome, leitor: l.onde, linhas: rows.filter(r => l.forma.test(r.name_source)).map(r => r.id) }));
assert.equal(rows.length, 150);
assert(rows.every(r => localizadorConhecido(r.name_source)));
const changes = [
 ['Outra dimensão JSON-stat', 'dimension.geo.category.label.GF01'],
 ['Função fora da lista', 'dimension.cofog99.category.label.GF11'],
 ['Coluna numérica em vez do rótulo XLS', 'FUNCIONAL!E2'],
 ['Folha XLS desconhecida', 'DESCONHECIDA!C2'],
 ['Campo numérico em vez do rótulo XML', 'Mapa1/Registos/Registo[1]/TotalEmEuros; Programa=P-001'],
 ['Registo XML zero', 'Mapa1/Registos/Registo[0]/DesignacaoPrograma; Programa=P-001'],
 ['Código ministerial zero', 'p. 1, POR MINISTÉRIOS, código 00'],
 ['Total sem página', 'p. , DESPESA TOTAL, última coluna'],
 ['Página impressa trocada', 'p. 49 do ficheiro, página impressa 46, Despesa efetiva, Execução Acumulada 2026'],
 ['Coluna da síntese desconhecida', 'p. 49 do ficheiro, página impressa 45, Despesa efetiva, Outra coluna 2026'],
 ['Programa da síntese zero', 'p. 72 do ficheiro, página impressa 68, programa 000, Execução Acumulada 2026'],
 ['Localizador livre', 'uma cadeia sem localizador'],
];
const plantas = changes.map(([nome, valor]) => ({ nome, mordeu: !localizadorConhecido(valor) }));
assert(plantas.every(p => p.mordeu));
const antigos = LOCALIZADORES_CONHECIDOS.filter(l => !l.onde.startsWith('publisher/')).map(l => {
 const row = records.find(r => l.forma.test(r.name_source ?? ''));
 assert(row && localizadorConhecido(row.name_source));
 return { formato: l.nome, id: row.id, aceito: true };
});
assert.equal(antigos.length, 4);
console.log(JSON.stringify({ linhas: rows.length, grupos: groups.filter(g => g.linhas.length), plantas, formatos_anteriores: antigos }, null, 2));
"""
r = subprocess.run(["node", "--input-type=module", "-"], input=functions + proof, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
assert r.returncode == 0, clean(r.stdout)
data = json.loads(r.stdout)
data.update(estado="proposta aplicada" if path.read_text() == candidate else "proposta não aplicada", codigo_indice=0, guarda_conservada=path.read_text() == aplicada_no_inicio, guarda_sha256=hashlib.sha256(original.encode()).hexdigest(), candidato_sha256=hashlib.sha256(candidate.encode()).hexdigest())
(here / "proposta-localizadores.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"linhas": data["linhas"], "plantas": len(data["plantas"]), "formatos_anteriores": len(data["formatos_anteriores"]), "codigo_indice": 0, "guarda_conservada": data["guarda_conservada"]}))
