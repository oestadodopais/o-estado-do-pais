/* ER1-d: contagens, rotas e igualdade com o Método, lidas do livro e do HTML. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { loadClaims, eDerivada, camposPorVerificar, provenienciaIncompleta } from '../../../../src/lib/ledger.mjs';
import { prova } from '../../../../src/lib/prova.mjs';
import { REGRAS } from '../../../../src/data/metodo.mjs';
import { FIGURAS_PDM } from '../../../../src/data/figuras.mjs';
import { BLOCOS_DA_PRIMEIRA_PAGINA } from '../../../../src/data/primeira-pagina.mjs';
import { lugarDaIncorporacao } from '../../../../src/lib/lugar-da-incorporacao.mjs';
import { routePath, matchPath } from '../../../../src/lib/routes.mjs';
import { lerPaginaComCodigo, conferirCodigo } from '../../../../scripts/incorporar-do-portao.mjs';
const pasta = 'design/especime-v3/medicoes/er1-2026-10-06';
const linhas = [...loadClaims().values()];
const recusada = provenienciaIncompleta;
const saida = process.argv[process.argv.indexOf('--json') + 1];
assert(process.argv.includes('--json') && saida, 'Indique --json para preservar as medições anteriores.');
const exemplo = REGRAS.find(r=>r.id==='livro-razao').ligacoes.find(l=>l.rota==='linha').params.slug;
const c = linhas.find(c=>c.id===exemplo);
assert(c && !provenienciaIncompleta(c));
assert.equal(lugarDaIncorporacao(c,'pt').nome,'Portugal');
assert(FIGURAS_PDM.find(f=>f.claim===c.id)?.limiar);
assert(JSON.stringify(BLOCOS_DA_PRIMEIRA_PAGINA).includes('"'+c.id+'"'));
const sem = linhas.find(recusada);
const excerto = linhas.find(c=>camposPorVerificar(c).length===1 && camposPorVerificar(c)[0]==='excerpt');
assert(excerto, 'Falta uma linha com a marca só no excerto.');
const calculada = linhas.find(c=>eDerivada(c) && !c.access_date && !recusada(c));
const r = {
  comando: `node ${pasta}/medir-c.mjs --json ${saida}`,
  cabecaCodigo: execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  livro: 'ledger/claims/*.yml, pelo loadClaims() que src/lib/prova.mjs também lê',
  exemplo: {id:exemplo,referencia:FIGURAS_PDM.find(f=>f.claim===c.id).limiar,razao:'Dívida pública: medida nacional no bloco do Estado da primeira página, com proveniência completa, referência declarada e leitura corrente sobre o que as administrações públicas devem.'},
  metodo: {porConfirmar:prova().divida.valor,comProvenienciaCompleta:prova().indexaveis.valor},
  marcasProveniencia:linhas.filter(recusada).map(c=>({id:c.id,ficheiro:c.__file,campos:camposPorVerificar(c)})),
  // HIG, ER1-12: a diferença foi retirada. `recusada` é o próprio predicado
  // `provenienciaIncompleta`, pelo que A && !A seria sempre falso. A prova
  // efetiva continua abaixo: compara o livro com o código e o Método no HTML.
  edicoes:{},
};
assert.equal(r.metodo.porConfirmar,linhas.filter(provenienciaIncompleta).length);
const carimbo=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
assert.equal(carimbo.commit,r.cabecaCodigo);
for(const lang of ['pt','en']) {
  const n={comCodigo:0,semCodigo:0,calculadosSemDataComCodigo:0,rotas:{comCodigo:routePath('linha',lang,{slug:c.id}),semCodigo:routePath('linha',lang,{slug:sem.id}),recusadoExcerto:routePath('linha',lang,{slug:excerto.id}),calculado:routePath('linha',lang,{slug:calculada.id})}};
  for(const linha of linhas){
    const rota=routePath('linha',lang,{slug:linha.id});
    const root=lerPaginaComCodigo(fs.readFileSync(`dist${rota}/index.html`,'utf8'));
    assert.deepEqual(conferirCodigo(root,matchPath(rota)),[]);
    const campo=root.querySelector('[data-incorporar-codigo]');
    assert.equal(Boolean(campo),!recusada(linha));
    n[campo?'comCodigo':'semCodigo']++;
    if(campo&&eDerivada(linha)&&!linha.access_date)n.calculadosSemDataComCodigo++;
  }
  assert.equal(n.semCodigo,r.marcasProveniencia.length);
  assert.equal(n.semCodigo,r.metodo.porConfirmar, 'ER1-d: recibos sem código e Método têm de coincidir.');
  const metodo=lerPaginaComCodigo(fs.readFileSync(`dist${routePath('metodo',lang)}/index.html`,'utf8'));
  assert(metodo.querySelectorAll('[data-prova="divida"]').some(x=>Number(x.textContent.trim())===r.metodo.porConfirmar));
  r.edicoes[lang]=n;
}
r.igualdadePedida=Object.values(r.edicoes).every(n=>n.semCodigo===r.metodo.porConfirmar);
r.recusadoExcerto={id:excerto.id,ficheiro:excerto.__file,campos:camposPorVerificar(excerto)};
r.sha256Livro=Object.fromEntries(linhas.map(c=>[c.__file,createHash('sha256').update(fs.readFileSync('ledger/claims/'+c.__file)).digest('hex')]));
fs.writeFileSync(saida,JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({...r,sha256Livro:'no ficheiro'},null,2));
