/** Plantas da ligação: dados sintéticos, conferir e pré-mandato verdadeiros. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {conferir, conferirLista, lerDocumentos, numeros, recusas, procurarFrase} from '../../scripts/leituras/conferir-frases.mjs';

const rota = l => l === 'pt' ? '/estudos/planta/documento' : '/en/studies/planta/document';
const entrada = (lingua = 'pt', extra = {}) => ({id:lingua, estudo:'planta', lingua,
  paginas:[rota(lingua)], classe:'REESCREVE', frase:lingua === 'pt' ? 'A fonte publicou o relatório.' : 'The source published the report.',
  nova:lingua === 'pt' ? 'O relatório identifica a fonte.' : 'The report identifies the source.', ...extra});
const doc = (lingua, blocos) => ({estudo:'planta', tipo:'documento', lingua, rota:rota(lingua), blocos});
let provas = 0;
function medir(lista, docs, regra, aplicada = false) {
  const bilingues = new Set(docs.some(d => d.lingua === 'pt') && docs.some(d => d.lingua === 'en') ? ['planta'] : []);
  const r = conferir(lista, docs, bilingues, {aplicada});
  assert.deepEqual(Object.entries(r).filter(([,v]) => v.length).map(([k]) => k), regra ? [regra] : []);
  assert.equal(recusas(r), regra ? 1 : 0);
  provas++;
}

const pt = entrada(), en = entrada('en');
medir([pt], [doc('pt', [pt.frase])], null);
medir([{...en, nova:'This study does not read it.'}], [doc('en', [en.frase])], 'voz');
const np = entrada('pt', {frase:'O valor publicado é 12.', nova:'O valor publicado é 12.'});
const ne = entrada('en', {frase:'The published value is 12.', nova:'The published value is 13.'});
medir([np, ne], [doc('pt', [np.frase]), doc('en', [ne.frase])], 'numeros');
medir([{...en, nova:'Only one source published the report.'}], [doc('en', [en.frase])], 'quantificadores');
medir([pt], [doc('pt', [pt.frase]), doc('en', [en.frase])], 'semPar');
medir([{...pt, classe:'FICA', nova:''}], [doc('pt', [pt.frase, 'Este estudo não lê a fonte.'])], 'semEntrada');
medir([pt], [doc('pt', ['O relatório está publicado.'])], 'presenca');

// A repetição aplicada verifica a nova e a ausência da retirada.
medir([pt], [doc('pt', [pt.nova])], null, true);
medir([pt], [doc('pt', [pt.frase])], 'presenca', true);
const sai = {...pt, classe:'SAI', nova:''};
medir([sai], [doc('pt', ['O relatório está publicado.'])], null, true);
medir([sai], [doc('pt', [pt.frase])], 'presenca', true);
medir([{...sai, paginas:[rota('pt'), '/estudos/planta']}], [doc('pt', ['O relatório está publicado.'])], 'presenca', true);
medir([{...pt, classe:'FICA', nova:''}], [doc('pt', [pt.frase])], null, true);
assert.throws(() => conferir([{...pt, classe:'FICA', frase:'A'}], [doc('pt', ['A fonte publicou o relatório.'])], new Set())); provas++;
// Onze carateres recusam-se; doze passam a validação e a presença.
assert.throws(() => conferir([{...pt, classe:'FICA', nova:'', frase:'nesta págin'}], [doc('pt', ['nesta págin'])], new Set()), /entrada da lista inválida/); provas++;
medir([{...pt, classe:'FICA', nova:'', frase:'nesta página'}], [doc('pt', ['nesta página'])], null);
const captada = 'Nada nesta página é aconselhamento.';
medir([{...pt, classe:'FICA', nova:'', frase:'nesta página'}], [doc('pt', [captada])], 'semEntrada');
medir([{...pt, classe:'FICA', nova:'', frase:captada}], [doc('pt', [captada])], null);
medir([{...pt, frase:'nesta página'}], [doc('pt', [captada])], null);
medir([{...pt, classe:'SAI', nova:'', frase:'nesta página'}], [doc('pt', [captada])], null);
// Uma FICA com duas frases também não cobre cada uma por subcadeia.
medir([{...pt, classe:'FICA', nova:'', frase:captada + ' A fonte está identificada.'}],
  [doc('pt', [captada + ' A fonte está identificada.'])], 'semEntrada');
// A lista não cobre uma frase captada apenas por a incluir numa frase inventada.
const inventada = entrada('pt', {classe:'FICA', nova:'', frase:'Antes. Este estudo não lê a fonte. Depois.'});
const descoberta = conferir([inventada], [doc('pt', ['Este estudo não lê a fonte.'])], new Set());
assert.equal(descoberta.presenca.length, 1); assert.equal(descoberta.semEntrada.length, 1); provas++;
assert.deepEqual(numeros('1 234,5'), numeros('1,234.5')); provas++;
assert.notDeepEqual(numeros('1,2'), numeros('12')); provas++;
const mp = {...np, classe:'SAI', nova:'', frase:'O valor é 1 234,5 euros.'};
const me = {...ne, classe:'SAI', nova:'', frase:'The value is 1,234.5 euros.'};
medir([mp, me], [doc('pt', [mp.frase]), doc('en', [me.frase])], null);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hig6-ligacao-'));
try {
  const dist = path.join(tmp, 'dist'), pagina = path.join(dist, rota('pt'), 'index.html');
  fs.mkdirSync(path.dirname(pagina), {recursive:true});
  fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify({commit:execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim()}));
  fs.writeFileSync(pagina, '<main><p>O valor é 12<span class="src-chip">fonte · Publicação</span> euros.</p></main>');
  const comSelo = entrada('pt', {classe:'FICA', nova:'', frase:'O valor é 12fonte · Publicação euros.'});
  const semSelo = {...comSelo, frase:'O valor é 12 euros.'};
  const {documentos, bilingues} = lerDocumentos([comSelo], dist);
  assert.equal(recusas(conferir([comSelo], documentos, bilingues)), 0); provas++;
  assert.equal(recusas(conferir([semSelo], documentos, bilingues)), 0); provas++;
  // A etiqueta no meio participa da procura e projeta a mesma ocorrência
  // para a voz e para os índices dos pares, nas duas línguas.
  const paginaEn = path.join(dist, rota('en'), 'index.html');
  fs.mkdirSync(path.dirname(paginaEn), {recursive:true});
  fs.writeFileSync(pagina, '<main><p>Nada nesta<span class="src-chip"><span>fonte · Publicação</span></span> página é aconselhamento.</p></main>');
  fs.writeFileSync(paginaEn, '<main><p>' + en.frase + '</p></main>');
  const reescrita = {...pt, frase:'Nada nestafonte · Publicação página é aconselhamento.'};
  const carregar = lista => { const d = lerDocumentos(lista, dist); return conferir(lista, d.documentos, d.bilingues); };
  const faltaPar = carregar([reescrita]);
  assert.deepEqual(Object.entries(faltaPar).filter(([, v]) => v.length).map(([k]) => k), ['semPar']);
  assert.deepEqual(faltaPar.semPar.map(f => f.id), ['pt']); provas++;
  assert.equal(recusas(carregar([reescrita, en])), 0); provas++;
  const ficaComSelo = {...reescrita, classe:'FICA', nova:''};
  assert.equal(recusas(carregar([ficaComSelo])), 0); provas++;
  const semEtiqueta = {...reescrita, frase:captada};
  assert.equal(recusas(carregar([semEtiqueta, en])), 0); provas++;
  fs.writeFileSync(pagina, '<main><p>  Nada \u200b nesta<span class="src-chip">fonte · Publicação</span>\n página é aconselhamento.  </p></main>');
  assert.equal(recusas(carregar([reescrita, en])), 0); provas++;
  const carregados = lerDocumentos([reescrita], dist);
  const bloco = carregados.documentos.find(d => d.lingua === 'pt').procuraBlocos[0];
  assert.deepEqual(procurarFrase(reescrita.frase, bloco), [{inicio:0, fim:reescrita.frase.length, forma:'textoComSelos', texto:captada}]); provas++;
  const novaComSelo = {...reescrita, nova:reescrita.frase};
  const aplicada = conferir([novaComSelo], carregados.documentos, carregados.bilingues, {aplicada:true});
  assert.equal(aplicada.presenca.length, 0); assert.equal(aplicada.semPar.length, 1); assert.equal(aplicada.semEntrada.length, 0); provas++;
  fs.rmSync(paginaEn);
  fs.writeFileSync(pagina, '<main><p>O valor é 12<span class="src-chip">fonte · Publicação</span> euros.</p></main>');
  const outraRota = '/estudos/outra/documento';
  const outraPagina = path.join(dist, outraRota, 'index.html'); fs.mkdirSync(path.dirname(outraPagina), {recursive:true});
  fs.writeFileSync(outraPagina, '<main><p>' + pt.frase + '</p><p>Este estudo não lê a fonte.</p></main>');
  const noutra = {...pt, paginas:[outraRota]};
  const outras = lerDocumentos([noutra], dist);
  assert.equal(recusas(conferir([noutra], outras.documentos, outras.bilingues)), 0); provas++;
  assert(outras.documentos.find(d => d.rota === outraRota).soPresenca); provas++;
  // Sem substitutos de executáveis ou funções: só os dados são uma planta.
  const lista = path.join(tmp, 'lista.json'), mandato = path.join(tmp, 'mandato.md');
  fs.writeFileSync(mandato, 'Acrescenta: nada\nFrases: lista.json\n');
  fs.writeFileSync(pagina, '<main><p>' + pt.frase + '</p></main>');
  const env = {...process.env}; delete env.OEDP_ACRESCENTA;
  const correr = () => spawnSync('python3', ['scripts/leituras/pre-mandato.py', '.', mandato, '--dist', dist], {env, encoding:'utf8'});
  fs.writeFileSync(lista, JSON.stringify([pt]));
  assert.equal(correr().status, 0); provas++;
  fs.writeFileSync(lista, JSON.stringify([{...pt, nova:'Este estudo não lê a fonte.'}]));
  const rejeitada = conferirLista(lista, dist);
  assert.deepEqual(Object.entries(rejeitada).filter(([,v]) => v.length).map(([k]) => k), ['voz']);
  const r = correr();
  assert.equal(r.status, 9, r.stdout + r.stderr); assert.match(r.stdout, /camada 0: voz 1;/); provas++;
} finally { fs.rmSync(tmp, {recursive:true, force:true}); }
console.log(`camada 0: ${provas} plantas e controlos da ligação, incluindo o pré-mandato ponta a ponta`);
