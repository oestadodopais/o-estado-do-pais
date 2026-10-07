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

for (const [nome, altera] of [
  ['excerto com uma palavra inventada', o => {o.excerto += ' PALAVRA PLANTADA';}],
  ['selo com outro cliente', o => {o.selo.cliente = 'cliente inventado';}],
  ['selo com outra página', o => {o.extracao.pagina++;}],
  ['tipo do selo apagado', o => {delete o.selo.tipo;}],
  ['selo inteiro apagado', o => {delete o.selo;}],
]) {
  const origens = structuredClone(ORIGENS_DAS_DEFINICOES);
  altera(origens['rp4n-orcamento']);
  morde(nome, auditarPerguntas({origens}).erros, 'o excerto ou o selo difere da origem exportada pelo motor');
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
  const linhas = loadClaims();
  linhas.get('avisos-pt2030-abertos').excerpt = 'Um excerto existente.';
  morde('ausência declarada quando há excerto', conferirAuditoriaDasFamilias({linhas}).erros, 'a ausência não corresponde à falta do excerto');
}
{
  const linhas = loadClaims();
  linhas.get('evora-prr-aprovado-2026').document.computed_over.files[0].sha256 = '';
  morde('seleção calculada sem resumo do ficheiro', conferirAuditoriaDasFamilias({linhas}).erros, 'a seleção calculada de «evora-prr-aprovado-2026» não tem ficheiros selados');
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
