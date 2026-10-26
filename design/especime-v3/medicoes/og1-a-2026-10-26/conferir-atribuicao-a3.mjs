/** OG1-A3: ensaio isolado da atribuição conjunta da sexta frase do mandato.
 * Não escreve linhas nem altera o item publicado ou as réguas.
 * As linhas do motor são fornecidas em memória, sem simular uma travessia.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {ITENS, PARTES} from '../../../../src/data/discussao.mjs';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {conferirDeclaracoes} from '../../../../tests/discussao/itens.mjs';

assert(process.env.RESEARCHHUB_DIR, 'Definir RESEARCHHUB_DIR para o ensaio.');
const livro = JSON.parse(fs.readFileSync(path.join(process.env.RESEARCHHUB_DIR,
  'content/30 Orcamento 2027 Generalidade/ledger.json'), 'utf8'));
const ids = ['og1-governo-rtp-previsoes', 'og1-governo-rtp-combustiveis',
  'og1-governo-rtp-habitacao', 'og1-governo-eco-juros', 'og1-governo-observador-saldo'];
const linhas = loadClaims();
for (const id of ids) {
  const linha = livro.claims.find(r => r.id === id);
  assert(linha?.afirmacao === true);
  assert.deepEqual(linha.attributed_to, ['Joaquim Miranda Sarmento']);
  linhas.set(id, linha);
}
const literal = (id, campo) => ({literal:id, campo});
const excerto = id => literal(id, 'excerpt');
const autor = literal(ids[0], 'attributed_to');
const data = {periodo:ids[0]};
const pt = ['O ministro das Finanças, ', autor, ', na audição da comissão de Orçamento a ', data,
  ', segundo a RTP, o ECO e o Observador: sobre as previsões das entidades nacionais e internacionais, «',
  excerto(ids[0]), '»; sobre os ', {claim:'pm-q3-2-r8-c0', sufixo:' milhões de euros'},
  ' do combate à fraude nos combustíveis, «', excerto(ids[1]), '»; sobre a habitação, «',
  excerto(ids[2]), '»; sobre os juros da dívida, «', excerto(ids[3]),
  '»; e, na escolha entre o IRS Jovem e o prémio salarial, «', excerto(ids[4]), '».'];
const en = ['The Finance Minister, ', autor, ', at the Budget committee hearing on ', data,
  ', as reported by RTP, ECO and Observador: on the forecasts of national and international bodies, «',
  excerto(ids[0]), '»; on the ', {claim:'pm-q3-2-r8-c0', sufixo:' million euros'},
  ' from the fight against fuel fraud, «', excerto(ids[1]), '»; on housing, «', excerto(ids[2]),
  '»; on the interest on the debt, «', excerto(ids[3]),
  '»; and, on the choice between the youth income tax and the wage premium, «', excerto(ids[4]), '».'];
const candidato = {slug:'orcamento-2027-generalidade', escrita:'2026-10-26',
  titulo:{pt:['Ensaio da atribuição conjunta'],en:['Joint attribution test']},
  afirmacoes:ids, abertura:[], naoDiz:[], linhas:[], recibos:{},
  seccoes:PARTES.map(([id,pt,en],i) => ({id,titulo:{pt,en},conteudo:i===0?[{paragrafo:{pt:[],en:[]}}]:[]}))};
candidato.seccoes[0].conteudo[0].paragrafo = {pt,en};
const base = conferirDeclaracoes(ITENS);
assert.deepEqual(base, [], 'Os dois itens existentes têm de passar antes do ensaio.');
const erros = conferirDeclaracoes([...ITENS,candidato], linhas);
const atribuicoes = erros.filter(e => e.startsWith('V2B atribuição:'));
const controlo = structuredClone(candidato);
for (const lang of ['pt','en']) for (const id of ids.slice(1))
  controlo.seccoes[0].conteudo[0].paragrafo[lang].push(literal(id,'attributed_to'));
const errosControlo = conferirDeclaracoes([...ITENS,controlo], linhas);
const atribuicoesControlo = errosControlo.filter(e => e.startsWith('V2B atribuição:'));
assert.equal(atribuicoes.length, 8);
assert.equal(atribuicoesControlo.length, 0);
const resultado = {ambito:'Só a atribuição da sexta frase, com linhas do motor em memória; não é a conferência de um item completo.',
  regua:'tests/discussao/itens.mjs',
  regua_sha256:createHash('sha256').update(fs.readFileSync('tests/discussao/itens.mjs')).digest('hex'),
  base_erros:base, afirmacoes:ids, atribuicao_comum:'Joaquim Miranda Sarmento',
  candidato, erros, erros_atribuicao:atribuicoes,
  controlo:'Acrescentar em memória os quatro tokens de atribuição em falta por língua elimina apenas as queixas de atribuição. Repetiria o nome e não é a frase autorizada.',
  erros_atribuicao_controlo:atribuicoesControlo,
  codigo:1};
fs.writeFileSync(new URL('./atribuicao-a3.json',import.meta.url), JSON.stringify(resultado,null,2)+'\n');
console.log(`OG1-A3: base ${base.length} erros; atribuição conjunta ${atribuicoes.length} recusas; controlo ${atribuicoesControlo.length} recusas de atribuição.`);
console.log('V2B atribuição: falta o token da afirmação');
process.exitCode = 1;
