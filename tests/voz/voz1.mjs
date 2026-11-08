/** VOZ-1: plantas da negação editorial, da lede e das proteções da ausência. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {medirPagina,conferirProtecoes,conferirMapa,CLASSE} from '../../scripts/voz-autorreferencia.mjs';
import {apresentarAusencias,retirarAusencias} from '../../src/lib/ausencias-voz1.mjs';
const ledes=JSON.parse(fs.readFileSync('scripts/voz-ledes.json','utf8'));
let plantas=0;
const morde=(nome,cond)=>{assert(cond,nome);plantas++;};
for(const [lang,rota] of [['pt','/explicacoes/dinheiro-do-estado-2026'],['en','/en/explainers/dinheiro-do-estado-2026']]){
 const html=fs.readFileSync(`dist${rota}/index.html`,'utf8');
 const f=lang==='pt'?'Esta página mostra as duas medidas, cada uma com a sua definição, e não as soma nem corrige nenhuma.':'This page shows both measures, each with its definition, and neither adds them up nor corrects either.';
 morde(`frase de 2026 reposta (${lang})`,medirPagina(html.replace('</main>',`<p>${f}</p></main>`),rota,ledes).frases.includes(f));
 const lede=lang==='pt'?'Corrigir em silêncio é a forma mais barata de mentir.':'Correcting in silence is the cheapest way to lie.';
 morde(`lede reposta (${lang})`,medirPagina(html.replace('</h1>',`</h1><p>${lede}</p>`),rota,ledes).ledesNovas.includes(lede));
 morde(`marcador reposto (${lang})`,medirPagina(html.replace('</main>',`<p>${lang==='pt'?'[a verificar]':'[to verify]'}</p></main>`),rota,ledes).marca);
 for (const marca of ['a verificar', 'verificar', 'to verify', 'verify']) {
  const raw=`<p>Nome: [${marca}].</p>`,apresentado=apresentarAusencias(raw,lang);
  assert.equal(retirarAusencias(apresentado),raw);
  morde(`marca histórica apresentada (${lang}, ${marca})`, !medirPagina(apresentado, '/estudos/onde-esta-a-agua/documento/2026-08-12').marca);
  morde(`palavra histórica alterada (${lang}, ${marca})`,retirarAusencias(apresentado.replace('Nome','Intruso'))!==raw);
 }
 const reservado='<script>const estado="[verify]";</script><style>/* [verificar] */</style>';
 assert.equal(apresentarAusencias(reservado,lang),reservado);
 const incompleta=new Map([['planta',{source:'[a verificar]'}]]);
 const root=parse('<html><head><meta name="robots" content="noindex, follow"></head><body><a class="src-chip is-unverified" href="/livro-razao/planta">fonte</a></body></html>');
 assert.deepEqual(conferirProtecoes(root,'/livro-razao/planta',incompleta),[]);
 root.querySelector('a').classList.remove('is-unverified');
 morde(`tracejado retirado (${lang})`,conferirProtecoes(root,'/livro-razao/planta',incompleta).some(e=>e.includes('tracejado')));
 root.querySelector('meta').remove();
 morde(`noindex retirado (${lang})`,conferirProtecoes(root,'/livro-razao/planta',incompleta).some(e=>e.includes('indexável')));
}
// COR-AGUA: a isenção da voz dos estudos não isenta as marcas de confirmação.
for (const rota of ['/estudos/onde-esta-a-agua', '/estudos/onde-esta-a-agua/documento', '/en/studies/onde-esta-a-agua', '/en/studies/onde-esta-a-agua/document']) {
 for (const marca of ['[verify]', '[a verificar]', '[verificar]', '[to verify]']) {
  morde(`marca num estudo (${rota}, ${marca})`, medirPagina(`<main><p>Nome: ${marca}.</p></main>`, rota).marca);
 }
 assert.equal(medirPagina('<main><p>Nome por confirmar na fonte.</p><script>const estado="[verify]";</script><style>/* [verificar] */</style></main>', rota).marca, false);
}
for(const sujeito of ['O sítio','A página','A peça','A explicação','O estudo','O projeto','Aqui'])morde(sujeito,CLASSE.test(`${sujeito} não diz o que aconteceu.`));
for(const f of ['Esta explicação lê o mapa.','Esta página é uma explicação.','O projeto não compara os números.','The project is not a source.'])morde(f,CLASSE.test(f));
const definicao=parse('<main><p>um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado</p></main>');
morde('definição reposta sem classe',conferirProtecoes(definicao,'/').some(e=>e.includes('definição')));
morde('recibo incompleto reposto no sitemap',conferirMapa('<urlset><url><loc>https://example.test/livro-razao/planta</loc></url></urlset>',new Map([['planta',{source:'[a verificar]'}]])).length===1);
morde('isentar uma explicação como se fosse documento de estudo',medirPagina('<main><div class="texto-artigo estudo-leitura"><p>Esta explicação não diz o que aconteceu.</p></div></main>','/explicacoes/dinheiro-do-estado-2026').frases.length===1);
assert.equal(medirPagina('<main><p data-registo-unidade="orcamento/pt#1">Este estudo não confirmou a taxa.</p></main>','/dossies/orcamento-2027').frases.length,0,'VOZ-2: documento transcrito no dossiê');
morde('unidade documental falsa numa explicação',medirPagina('<main><p data-registo-unidade="orcamento/pt#1">Esta explicação não diz o que aconteceu.</p></main>','/explicacoes/dinheiro-do-estado-2026').frases.length===1);
for(const f of ['Não se conclui isso nesta leitura, aqui.', 'Nenhum destes resultados é uma inferência.', 'Esta explicação, depois das contas, não prova isso.', 'This document gives no judgement here.']) morde(f,medirPagina(`<main><p>${f}</p></main>`,'/explicacoes/dinheiro-do-estado-2026').frases.includes(f));
morde('citação não é isenção da régua larga',medirPagina('<main><p data-verbatim="planta">Esta explicação não mostra o resultado.</p></main>','/explicacoes/dinheiro-do-estado-2026').frases.length===1);
const autorizada=JSON.parse(fs.readFileSync('scripts/voz-excecoes.json','utf8'))[0];
assert.equal(medirPagina(`<main><p>${autorizada.frase}</p></main>`,autorizada.rota).frases.length,0);
morde('exceção fora da rota',medirPagina(`<main><p>${autorizada.frase}</p></main>`,'/explicacoes/dinheiro-do-estado-2026').frases.length===1);
morde('exceção alterada',medirPagina(`<main><p>${autorizada.frase} Este projeto não explica.</p></main>`,autorizada.rota).frases.length===1);
for(const fonte of ['O INE não publica uma data.','O mapa não inclui a Segurança Social.'])assert(!CLASSE.test(fonte));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'voz1-mandato-'));
try{const f=path.join(dir,'mandato.md');fs.writeFileSync(f,'Frase do leitor: «Esta explicação não diz o que aconteceu.»\n');const r=spawnSync('python3',['scripts/leituras/voz-do-mandato.py','.',f],{encoding:'utf8'});assert.equal(r.status,1,r.stderr);morde('pré-mandato',r.stdout.includes('esta explicação não'));}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log(`VOZ-1: ${plantas} plantas recusadas; factos das fontes e reversibilidade conferidos.`);
