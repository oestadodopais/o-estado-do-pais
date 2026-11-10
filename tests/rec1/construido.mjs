import {conferirFrasesRec1} from '../../scripts/frases-rec1-conferir.mjs';
import {ENSAIO} from '../../src/data/ensaio.mjs';
import {STRINGS} from '../../src/i18n/strings.mjs';
import {METODO} from '../../src/data/metodo.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {emEnsaio,desdeOLancamento} from '../../site.config.mjs';
import {mudancasDoRegisto,todasAsMudancas} from '../../src/lib/mudancas.mjs';
import {prova} from '../../src/lib/prova.mjs';
import {loadClaims,entradasDoRegisto} from '../../src/lib/ledger.mjs';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {conferirLancamentoHtml,conferirRobotsTxt} from '../../scripts/lancamento-conferir.mjs';
import {conferirPublicacaoRetirada} from '../../scripts/linhas-retiradas.mjs';
assert.deepEqual(conferirFrasesRec1(ENSAIO,STRINGS,METODO),[]);
// A cópia com lançamento antigo prova as réguas do mostrado. A cobertura de
// frases com afirmação corre apenas no ensaio real: as frases históricas que
// a cópia volta a mostrar já saíram da lista por registar.
const dist=process.env.OEDP_DIST??'dist';
let paginas=0;
for(const f of fs.readdirSync(dist,{recursive:true}).filter(f=>f.endsWith('.html'))){
 const root=parse(fs.readFileSync(`${dist}/${f}`,'utf8'));
 assert.deepEqual(conferirLancamentoHtml(root),[],f);paginas++;
 if(emEnsaio() && root.querySelector('[data-oedp-faixa]')) {
  const css=root.querySelectorAll('style').map(s=>s.textContent).join('');
  assert(/\[data-oedp-faixa\] \[data-edicao-ensaio\]\{[^}]*var\(--oedp-muted\)/.test(css),'REC1 faixa: estilo da etiqueta de IA');
  assert(/\[data-oedp-faixa\] \.vh\{[^}]*clip:/.test(css),'REC1 faixa: explicação só para leitores de ecrã');
 }
}
console.log(`REC1 HTML: ${paginas} páginas, marcas e metas conferidas.`);
const livro=loadClaims({includeWithdrawn:true});
assert.deepEqual(conferirPublicacaoRetirada(dist,livro),[]);
for(const id of ['correcoes-publicadas','edicoes-publicadas']){assert.equal(livro.get(id).publication,'withdrawn');assert(!loadClaims().has(id));}
const legendas = {
 indexaveis: ['páginas de linha sem noindex','row pages without noindex'],
 correcoes: ['correções mostradas no registo, de linhas e de texto de estudos','corrections shown in the register, to rows and to study text'],
 atualizacoes: ['entradas de natureza atualização mostradas no registo','entries of kind update shown in the register'],
 revisoes_de_proveniencia: ['entradas de natureza revisão de proveniência mostradas no registo','entries of kind provenance revision shown in the register'],
};
// Expectativas da amostra construída com lançamento em 01.08.2026.
const listasEsperadas={
 indice:[['afirmacao-pcp-paula-investimento-saude-2026-10-12','2026-11-02'],['afirmacao-pcp-paula-ppp-2026-10-12','2026-11-02'],['afirmacao-pcp-ppp-2026-10-15','2026-11-02'],['custo-unitario-do-trabalho-2025-ue','2026-10-26'],['divida-das-empresas-2024','2026-10-26'],['divida-das-empresas-2025','2026-10-26'],['divida-das-empresas-2025-ue','2026-10-26'],['divida-das-familias-2024','2026-10-26']],
 evora:[['estudos-evora-publicados','2026-10-01'],['estudos-evora-publicados','2026-09-16'],['evora-prr-aprovado-2026','2026-08-20'],['evora-prr-execucao-2026','2026-08-20'],['evora-prr-pago-2026','2026-08-20'],['evora-prr-vencido-aprovado-2026','2026-08-20'],['evora-prr-vencido-quota-2026','2026-08-20'],['evora-prr-aprovado-2026','2026-08-18']],
};
for(const lang of ['pt','en']){
 const inicio=parse(fs.readFileSync(`${dist}/${lang==='pt'?'':'en/'}index.html`,'utf8'));
 // Amostra declarada das cinco atualizações da página inicial.
 const novidades=['estudo:evora-2027-capital-europeia-da-cultura','estudo:evora-2027-prometido-painel-dinheiro','estudo:evora-contas-da-camara-2010-2025','estudo:evora-economia-e-dinheiro-publico-de-fora-da-camara','estudo:evora-economia-investidores-portas-abertas-2026'];
 assert.equal(inicio.querySelectorAll('[data-novidades]').length,Number(novidades.length>0));
 assert.deepEqual(inicio.querySelectorAll('[data-novidade]').map(e=>e.getAttribute('data-novidade')),novidades);
 assert.equal(inicio.querySelectorAll('[data-novidades] [data-atualizacao]').length,1);
 for(const [k,v] of Object.entries(legendas)) assert.equal(prova(lang)[k].origem,v[lang==='pt'?0:1],`legenda ${k}/${lang}`);
 const root=parse(fs.readFileSync(`${dist}/${lang==='pt'?'correcoes':'en/corrections'}/index.html`,'utf8'));
 const entradas=root.querySelectorAll('[data-mudanca]');
 assert.deepEqual(conferirLancamentoHtml(root,{key:'correcoes',lang}),[]);
 assert.equal(entradas.length,mudancasDoRegisto(lang).length);
 assert.equal(entradas.length,todasAsMudancas(lang).filter(e=>desdeOLancamento(e.data)).length);
 for(const e of entradas)assert(desdeOLancamento(e.querySelector('time').getAttribute('datetime')));
 assert.equal(prova(lang).correcoes.valor,entradasDoRegisto('correcao').filter(e=>desdeOLancamento(e.date)).length+CORRECOES_TEXTO.filter(e=>e.kind==='texto'&&desdeOLancamento(e.data)).length);
 if(emEnsaio()){assert.equal(entradas.length,0);assert(!root.querySelector('.registo-conta'));assert.equal(prova(lang).indexaveis.valor,0);}
 for(const rota of [lang==='pt'?'indice':'en/index',lang==='pt'?'municipios/evora':'en/municipalities/evora']) {
  const pagina=parse(fs.readFileSync(`${dist}/${rota}/index.html`,'utf8'));
  const lista=pagina.querySelectorAll('[data-mudou-ambito] [data-mudanca]');
  const esperada=emEnsaio()?[]:listasEsperadas[rota.endsWith('evora')?'evora':'indice'];
  assert.deepEqual(lista.map(n=>[n.getAttribute('data-correcao-entrada'),n.querySelector('time')?.getAttribute('datetime')]),esperada,rota);
  console.log(`REC1 lista construída ${rota}: ${lista.length} entradas, expectativa escrita conferida.`);
  for(const item of lista)assert(desdeOLancamento(item.querySelector('time')?.getAttribute('datetime')),rota);
 }
 console.log(`REC1 ${lang}: ${entradas.length} entradas construídas, prova e retirada conferidas.`);
}
assert.deepEqual(conferirRobotsTxt(fs.readFileSync(`${dist}/robots.txt`,'utf8')),[]);
