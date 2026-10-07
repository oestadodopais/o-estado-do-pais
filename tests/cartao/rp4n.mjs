/** RP4-n: os selos, as ausências e a recusa da marca, com a mensagem de cada planta. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {ORIGENS_DAS_DEFINICOES} from '../../src/data/figuras.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {auditarPerguntas} from './perguntas.mjs';
import {conferirAuditoriaDasFamilias, conferirAuditoriaDasSeries} from './familias.mjs';
import {conferirSemMarcadores} from '../../scripts/sem-marcadores.mjs';

const auditoria = JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json', 'utf8'));
const plantas = [];
function morde(nome, erros, mensagem) {
  const achado = erros.find(e => e.includes(mensagem));
  assert(achado, `${nome}: não falhou por «${mensagem}»: ${erros.slice(0,2).join('; ')}`);
  plantas.push({nome,mensagem:achado});
  console.log(`PLANTA ${nome}: ${achado}`);
}
assert.deepEqual(auditarPerguntas().erros, []);
assert.deepEqual(conferirAuditoriaDasFamilias().erros, []);
assert.deepEqual(conferirAuditoriaDasSeries().erros, []);

for (const [nome, altera, mensagem] of [
  ['selo com outro cliente', o => {o.selo.cliente = 'cliente inventado';}, 'não identifica um cliente da lista fechada'],
  ['agente do utilizador como cliente', o => {o.selo.cliente = 'OEstadoDoPais/corredor';}, 'não identifica um cliente da lista fechada'],
  ['tipo do selo apagado', o => {delete o.selo.tipo;}, 'não tem o selo completo'],
  ['selo inteiro apagado', o => {delete o.selo;}, 'não tem o selo completo'],
]) {
  const origens = structuredClone(ORIGENS_DAS_DEFINICOES);
  altera(origens['rp4n-orcamento']);
  morde(nome, auditarPerguntas({origens}).erros, mensagem);
}

{
  const a = structuredClone(auditoria);
  a.familias.find(e => e.chaves?.includes('oe-2026-despesa-funcao-01')).folhas[0].partes[0].apoios.push({declaracao:'nome',lingua:'pt',literal:'orçamentada'});
  morde('nome do projeto de volta numa família', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
{
  const a = structuredClone(auditoria);
  a.series.find(e => e.serie === 'serie-ihpc-rendas-variacao-homologa').folhas[0].partes[0].apoios.push({declaracao:'nome',lingua:'pt',literal:'rendas'});
  morde('nome do projeto de volta numa série', conferirAuditoriaDasSeries({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
{
  const linhas = structuredClone(loadClaims());
  linhas.get('avisos-pt2030-abertos').excerpt = 'Um excerto existente.';
  morde('ausência declarada quando há excerto', conferirAuditoriaDasFamilias({linhas}).erros, 'a ausência não corresponde à falta do excerto');
}
{
  const linhas = structuredClone(loadClaims());
  linhas.get('evora-prr-aprovado-2026').document.computed_over.files[0].sha256 = '';
  morde('seleção calculada sem resumo do ficheiro', conferirAuditoriaDasFamilias({linhas}).erros, 'a seleção calculada não tem ficheiros selados');
}
for (const aninhada of [false,true]) {
  const a = structuredClone(auditoria);
  const p = a.familias.find(e => e.chaves?.includes('oe-2026-despesa-funcao-01')).folhas[0].partes[0];
  const nome = {declaracao:'nome',lingua:'pt',literal:'orçamentada'};
  p.apoios[0] = {ou:[p.apoios[0], aninhada ? {ou:[nome]} : nome]};
  morde(`nome numa alternativa ${aninhada ? 'aninhada' : 'simples'}`, conferirAuditoriaDasFamilias({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
{
  const a = structuredClone(auditoria);
  const p = a.series.find(e => e.serie === 'serie-ihpc-rendas-variacao-homologa').folhas[0].partes.find(p => p.apoios?.some(a => a.origem));
  p.apoios.find(a => a.origem).declaracao = 'nome';
  morde('nome misturado com uma origem válida', conferirAuditoriaDasSeries({auditoria:a}).erros, 'o nome do projeto não pode apoiar uma frase');
}
for (const lang of ['pt','en']) {
  const caminho = `dist/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/posicao-de-investimento-internacional-2025/index.html`;
  const html = fs.readFileSync(caminho, 'utf8');
  assert.equal(conferirSemMarcadores(parse(html)), null);
  for (const [nome, marca] of [['texto simples','<p>[a verificar]</p>'],['marca em inglês','<p>[to verify]</p>'],['texto partido','<p>[a <b>verificar</b>]</p>'],['marca sem texto','<span class="marcador"></span>']]) {
    const copia = parse(html);
    copia.querySelector('main').insertAdjacentHTML('beforeend', marca);
    morde(`${nome} numa página construída (${lang})`, [conferirSemMarcadores(copia)].filter(Boolean), 'RP4N: uma página de leitor contém uma marca de informação por confirmar');
  }
}
for (const lang of ['pt','en']) {
  const pasta = `dist/${lang === 'pt' ? 'estudos' : 'en/studies'}`;
  const caminhos = fs.readdirSync(pasta).sort().map(s => `${pasta}/${s}/${lang === 'pt' ? 'documento' : 'document'}/index.html`);
  const caminho = caminhos.find(p => fs.existsSync(p) && conferirSemMarcadores(parse(fs.readFileSync(p,'utf8'))) === null);
  assert(caminho, 'a planta precisa de um documento construído sem marcas');
  const copia = parse(fs.readFileSync(caminho,'utf8'));
  copia.querySelector('body').insertAdjacentHTML('beforeend','<p>[a verificar]</p>');
  morde(`marca num documento citado (${lang})`, [conferirSemMarcadores(copia)].filter(Boolean), 'RP4N: uma página de leitor contém uma marca de informação por confirmar');
}
if (process.argv.includes('--registo')) fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/plantas-sitio.json', JSON.stringify({plantas},null,2)+'\n');
console.log(`RP4N: PASS, ${plantas.length} plantas com a mensagem afirmada`);

// RP4-n-d: não basta um campo plausível nem um resumo com 64 caracteres.
for (const [nome, altera, mensagem] of [
  ['PRR coluna inventada', l => {l.document.computed_over.column = 'valor_inventado';}, 'não está no cabeçalho selado'],
  ['PRR outro Excel plausível', l => {l.document.computed_over.files[0].sha256 = 'a'.repeat(64);}, 'iguais aos Excel lidos'],
  ['PRR instantâneo alterado', l => {l.document.computed_over.files[0].snapshot_date = '2026-08-20';}, 'iguais aos Excel lidos'],
  ['PRR seleção alargada', l => {l.document.computed_over.filter = 'todos';}, 'seleção da casa difere'],
  ['PRR soma alterada', l => {l.value = '1';}, 'difere da soma conferida'],
]) {
  const linhas = structuredClone(loadClaims()); altera(linhas.get('evora-prr-aprovado-2026'));
  morde(nome, conferirAuditoriaDasFamilias({linhas}).erros, mensagem);
}
{
  const a = structuredClone(auditoria);
  const e = a.familias.find(e => e.chaves?.includes('evora-prr-aprovado'));
  e.folhas[0].partes[0].apoios.push({linha:'propria', campo:'document.computed_over.filter', literal:'Évora'});
  morde('PRR filtro promovido a fonte', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'campo «document.computed_over.filter», que não pode apoiar');
  e.folhas[0].partes[0].apoios.pop();
  e.folhas[0].partes[0].apoios.push({ficheiro:'entidades', campo:'cabecalho', literal:'coluna_inventada'});
  morde('PRR cabeçalho inventado', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'literal não foi lido');
}
console.log(`RP4N-d: PASS, ${plantas.length} plantas acumuladas com a mensagem afirmada`);

// A ausência não pode inflacionar a contagem de definições seladas (achado 18).
for (const chave of ['avisos-pt2030-abertos','avisos-pt2030-pessoas-singulares','ciclo-substituicao-condutas']) {
  assert(conferirAuditoriaDasFamilias().contas.lista_da_casa.includes(chave), `${chave}: ausência contada como fonte`);
}
// O recorte mensal não apoia uma linha anual (achado 17).
{
  const a = structuredClone(auditoria);
  for (const e of a.familias) for (const f of e.folhas ?? []) for (const p of f.partes ?? []) for (const ap of p.apoios ?? []) {
    if (ap.origem === 'rp4n-ac-ss-orcamento') ap.origem = 'rp4n-ac-ss';
  }
  morde('recorte mensal numa linha anual', conferirAuditoriaDasFamilias({auditoria:a}).erros, 'recorte de janeiro a agosto não apoia uma linha anual');
}
// A explicação de cada termo conserva a frase definidora da fonte (15 e 16).
for (const chave of ['rp4n-diferencas-consolidacao','rp4n-saldos-gerencia']) {
  const origens = structuredClone(ORIGENS_DAS_DEFINICOES); delete origens[chave];
  morde(`definição retirada: ${chave}`, conferirAuditoriaDasFamilias({origens}).erros, `apoia-se em «${chave}»`);
}
{
  const a = structuredClone(auditoria);
  const vab = a.familias.filter(e => e.chaves?.some(k => ['evora-vab-empresarial','portugal-concentracao-vab4','evora-concentracao-vab4'].includes(k)));
  assert.equal(vab.filter(e => JSON.stringify(e).includes('output valued at basic prices less intermediate consumption')).length, 2);
}
assert.deepEqual(conferirAuditoriaDasFamilias().erros, []);
console.log(`RP4N-d documental: PASS, ${plantas.length} plantas e controlos de classificação e de definição`);

// Achado 14: a explicação não selada não pode regressar através da exportação.
for (const l of loadClaims().values()) {
  assert(!String(l.ressalva ?? '').includes('A despesa bruta inclui operações financeiras'), `${l.id}: regressou a nota não selada`);
  assert(!String(l.ressalva_en ?? '').includes('Gross expenditure includes financial transactions'), `${l.id}: regressou a nota não selada inglesa`);
}
console.log('RP4N-d nota: PASS, ausência da explicação não selada em todas as linhas');
{
  const linhas = structuredClone(loadClaims());
  const l = linhas.get('penalizacao-antecipacao-um-ano-neutra');
  l.excerpt = l.excerpt.replace('Decrementos por reforma antecipada: caso geral', 'legenda retirada');
  morde('legenda da pensão retirada', conferirAuditoriaDasFamilias({linhas}).erros, 'não está no campo «excerpt»');
}
console.log(`RP4N-d final: PASS, ${plantas.length} plantas com mensagem afirmada`);
