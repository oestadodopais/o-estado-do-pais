import { eventoDeEstudosRetirados } from '../../src/lib/agenda-retirada.mjs';
/** VOZ-1 B: dados conservados, futuro exato, ausência distinta e portas verificadas. */
import {emEnsaio} from '../../site.config.mjs';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {parse} from 'node-html-parser';
import {WORKS} from '../../src/data/studies.mjs';
import {contextoDaRevisao} from '../../src/lib/contexto-da-revisao.mjs';
import {conferirRevisoesNoRegisto} from '../../scripts/revisoes-no-registo.mjs';
import {spawnSync} from 'node:child_process';
import {matchPath,routePath} from '../../src/lib/routes.mjs';
import {conferirTitulosCopiados,tituloCopiadoDaPagina} from '../../scripts/titulos-copiados.mjs';
import {calendarioFuturo} from '../../src/lib/agenda.mjs';
const agenda=JSON.parse(fs.readFileSync('src/data/agenda.json'));
const calendario=JSON.parse(fs.readFileSync('src/data/calendario.json'));
const dia=process.env.OEDP_DIA_DA_CONSTRUCAO??JSON.parse(fs.readFileSync('dist/version.json')).construido_em.slice(0,10);
const normal=s=>s.replace(/\s+/gu,' ').trim();
const leitores={pt:[],en:[]},datadas={pt:[],en:[]};
const fora=new Set(['linha','livro','livroConcelho','livroConcelhos','serie','metodo','sobre','privacidade','agenda','correcoes','documento','texto','home','temas','indice','estudos','discussao','leituraDaSemana','areas']);
function anda(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const f=path.join(dir,e.name);if(e.isDirectory()){anda(f);continue;}if(e.name!=='index.html')continue;
 const rota='/'+path.relative('dist',f).replace(/index\.html$/,'').replace(/\/$/,'');const hit=matchPath(rota);if(!hit||fora.has(hit.key))continue;
 const doc=parse(fs.readFileSync(f,'utf8')),main=doc.querySelector('main'),titulo=tituloCopiadoDaPagina(doc,rota);if(!titulo)continue;
 const refs=(main?.querySelectorAll('a.src-chip[href]')??[]).map(a=>matchPath((a.getAttribute('href')??'').split('#')[0])).filter(x=>x?.key==='linha').map(x=>x.params.slug);
 if(hit.key==='estudo'&&WORKS.find(w=>w.slug===hit.params.slug)?.estado==='retirado'){datadas[hit.lang].push({rota,titulo,refs});continue;}
 leitores[hit.lang].push({rota,titulo,refs});
}}
anda('dist');
export function conferir(root,lang,registo=calendario,hoje=dia){
 const erros=[];
 const grafia=rota=>root.querySelectorAll('#nav-principal a[href]').find(a=>a.getAttribute('href').replace(/\/$/,'')===rota)?.getAttribute('href')??rota;
 if(root.querySelector('[data-agenda-item], [data-agenda-seccao], .quadro-estados'))erros.push('trabalho interno visível');
 if(root.querySelector('[data-calendario-dia]')?.getAttribute('data-calendario-dia')!==hoje)erros.push('dia da construção diferente');
 const esperados=registo.eventos.filter(e=>!eventoDeEstudosRetirados(e,agenda,WORKS) && (!(e.data??e.janela?.fim)||(e.data??e.janela.fim)>=hoje));
 const artigos=root.querySelectorAll('[data-calendario-evento]');
 if(artigos.length!==esperados.length)erros.push('conjunto futuro diferente');
 for(const e of registo.eventos){
  const item=root.querySelector(`[data-calendario-evento="${e.id}"]`);
  if(!esperados.includes(e)){if(item)erros.push('acontecimento passado visível');continue;}
  if(!item){erros.push('acontecimento futuro ausente');continue;}
  const campos=['titulo','fonte',...(e.data?['data']:e.janela?['janela.inicio','janela.fim']:['marcador'])];
  for(const campo of campos)if(!item.querySelector(`[data-agenda="evento:${e.id}.${campo}"]`))erros.push('campo público ausente');
  for(const el of item.querySelectorAll('[data-agenda]'))if(!campos.includes(el.getAttribute('data-agenda').slice(e.id.length+8)))erros.push('campo interno visível');
  if(!e.data&&!e.janela){
   const esperado={pt:{nao_publica:'sem data anunciada',nao_lida:'data por confirmar na fonte'},en:{nao_publica:'no announced date',nao_lida:'date to be confirmed at the source'}}[lang][e.motivo_sem_data];
   if(!esperado || item.querySelector(`[data-agenda="evento:${e.id}.marcador"]`)?.textContent!==esperado)erros.push('motivo de ausência diferente');
  }
  const portas=item.querySelectorAll('[data-calendario-pagina]');
  if(portas.some(a=>{const hit=matchPath(a.getAttribute('href'));return hit?.key==='estudo'&&WORKS.find(w=>w.slug===hit.params.slug)?.estado==='retirado';}))erros.push('edição datada no calendário');
  const atualizam=leitores[lang].filter(p=>p.refs.some(id=>(e.afecta_linhas??[]).includes(id))).map(p=>({...p,rota:grafia(p.rota)})).sort((a,b)=>a.titulo.localeCompare(b.titulo,lang));
  if(portas.some(a=>a.hasAttribute('style')))erros.push('estilo em atributo');
  if(portas.some(a=>['home','temas','indice','estudos','discussao','leituraDaSemana','areas'].includes(matchPath(a.getAttribute('href'))?.key)))erros.push('página de entrada no calendário');
  if(portas.map(a=>a.getAttribute('href')).join('|')!==atualizam.map(p=>p.rota).join('|'))erros.push('ordem das páginas diferente');
  if(portas.length!==atualizam.length)erros.push('páginas afetadas diferentes');
  for(const p of atualizam){const a=portas.find(a=>a.getAttribute('href')===p.rota);if(!a||normal(a.textContent)!==p.titulo||a.getAttribute('data-calendario-pagina')!==p.rota)erros.push('página afetada sem título e porta certos');}
 }
 return erros;
}
let plantas=0;const morde=(nome,cond)=>{assert(cond,nome);plantas++;};
for(const lang of ['pt','en']){
 const texto=fs.readFileSync(`dist/${lang==='pt'?'agenda':'en/agenda'}/index.html`,'utf8');const root=parse(texto);assert.deepEqual(conferir(root,lang),[]);
 assert.deepEqual(conferirTitulosCopiados(root,{key:'agenda',lang}).erros,[]);
 morde('título copiado fora da rota',conferirTitulosCopiados(root,{key:'explicacao',lang}).erros.length>0);
 const falso=parse(texto);falso.querySelector('[data-calendario-pagina]').set_content('Título inventado');morde('título falso não é transcrição',conferirTitulosCopiados(falso,{key:'agenda',lang}).erros.length>0);
 for(const [nome,muda,queixa] of [
  ['grafia trocada',r=>{const a=r.querySelector('[data-calendario-pagina]'),href=a.getAttribute('href');a.setAttribute('href',href.endsWith('/')?href.slice(0,-1):href+'/');},'página afetada sem título e porta certos'],
  ['estilo em atributo',r=>r.querySelector('[data-calendario-pagina]').setAttribute('style','min-height:44px'),'estilo em atributo'],
  ['trabalho interno',r=>r.querySelector('main').insertAdjacentHTML('beforeend','<article data-agenda-item="planta">Trabalho interno</article>'),'trabalho interno visível'],
  ['fonte retirada',r=>r.querySelector('.agenda-evento-fonte').remove(),'campo público ausente'],
  ['ausência trocada',r=>r.querySelector('[data-agenda-sem-data="nao_lida"] [data-agenda]').set_content(lang==='pt'?'sem data anunciada':'no announced date'),'motivo de ausência diferente'],
  ['título trocado',r=>r.querySelector('[data-calendario-pagina]').set_content('Título trocado'),'página afetada sem título e porta certos'],
  ['porta trocada',r=>r.querySelector('[data-calendario-pagina]').setAttribute('href','/livro-razao/taxa-de-desemprego-2025'),'página afetada sem título e porta certos'],
  ['página retirada',r=>r.querySelector('[data-calendario-pagina]').remove(),'páginas afetadas diferentes'],
 ]){const r=parse(texto);muda(r);morde(nome,conferir(r,lang).includes(queixa));}
 for(const key of ['home','temas','indice','estudos','discussao','leituraDaSemana','areas']){
  const r=parse(texto);const a=r.querySelector('[data-calendario-pagina]');a.setAttribute('href',routePath(key,lang));
  morde(`entrada ${key} reposta`,conferir(r,lang).includes('página de entrada no calendário'));
 }
 assert(datadas[lang].length>0,'edições datadas disponíveis para a planta');
 for(const p of datadas[lang]){const r=parse(texto),a=r.querySelector('[data-calendario-pagina]');a.setAttribute('href',p.rota);a.setAttribute('data-calendario-pagina',p.rota);a.set_content(p.titulo);morde(`edição datada ${p.rota}`,conferir(r,lang).includes('edição datada no calendário'));}
 const passado=structuredClone(calendario);const atual=root.querySelector('[data-calendario-evento]').getAttribute('data-calendario-evento');passado.eventos.find(e=>e.id===atual).data='1900-01-01';morde('passado visível',conferir(root,lang,passado).includes('acontecimento passado visível'));
 const correcoes=parse(fs.readFileSync(`dist/${lang==='pt'?'correcoes':'en/corrections'}/index.html`,'utf8'));
 if(emEnsaio()) { assert.equal(correcoes.querySelectorAll('[data-correcao-titulo], [data-correcao-entrada]').length,0); } else {
 const titulos=correcoes.querySelectorAll('[data-correcao-titulo]');assert(titulos.length>0);
 assert.deepEqual(conferirTitulosCopiados(correcoes,{key:'correcoes',lang}).erros,[]);
 for(const el of titulos){const id=el.getAttribute('data-correcao-titulo');assert(el.closest('li').querySelector('a.src-chip'));assert.notEqual(el.textContent,id);}
 const copiados=conferirTitulosCopiados(correcoes,{key:'correcoes',lang}).elementos;
 assert(copiados.every(el=>el.hasAttribute('data-correcao-nome')));
 morde('composição fora da isenção do título',titulos.every(el=>!copiados.includes(el)));
 const duplicada=parse(correcoes.toString()),nomes=duplicada.querySelectorAll('[data-correcao-titulo]');
 nomes[1].set_content(nomes[0].innerHTML);
 morde('duas linhas iguais no registo',conferirTitulosCopiados(duplicada,{key:'correcoes',lang}).erros.some(e=>e.includes('linha repetida')));
 for(const [nome,muda] of [
  ['período retirado',r=>{r.querySelector('[data-correcao-periodo]').remove();}],
  ['União em falta',r=>{const el=r.querySelector('[data-correcao-uniao]');assert(el);el.remove();}],
  ['União repetida',r=>{const el=r.querySelectorAll('[data-correcao-titulo]').find(e=>contextoDaRevisao(e.getAttribute('data-correcao-titulo')).uniao);assert(el);el.insertAdjacentHTML('beforeend',lang==='pt'?' na União Europeia':' in the European Union');}],
  ['título diferente do recibo',r=>r.querySelector('[data-correcao-nome]').set_content('Outro nome')],
  ['período repetido',r=>{const el=r.querySelector('[data-correcao-titulo="evora-prr-vencido-aprovado-2026"]');assert(el);el.insertAdjacentHTML('beforeend',', 19.08.2026');}],
  ['porta trocada',r=>r.querySelector('.registo-proveniencia-linhas a.src-chip').setAttribute('href','/')],
 ]){const r=parse(correcoes.toString());muda(r);const erros=conferirRevisoesNoRegisto(r,lang).erros;morde(nome,erros.some(e=>e.includes(nome.startsWith('União')?nome:nome==='título diferente do recibo'?'título diferente do recibo':nome==='porta trocada'?'porta do recibo diferente':'contexto ou período diferente')));if(['título diferente do recibo','período repetido','União em falta','União repetida'].includes(nome))console.log(`VOZ-1 G: ${lang}, ${nome}: recusado`);}

 }
}
const c={eventos:[{id:'antes',data:'2026-11-03'},{id:'hoje',data:'2026-11-04'},{id:'depois',data:'2026-11-05'},{id:'janela',janela:{inicio:'2026-11-01',fim:'2026-11-04'}},{id:'sem',motivo_sem_data:'nao_lida'}]};
assert.deepEqual(calendarioFuturo(c,'2026-11-04').eventos.map(e=>e.id),['hoje','depois','janela','sem']);
assert.throws(()=>calendarioFuturo({eventos:[{id:'sem-motivo'}]},'2026-11-04'),/motivo/);plantas++;
console.log(`VOZ-1 B: calendário nas duas edições; ${plantas} plantas recusadas; dia atual e intervalo aberto incluídos; nomes, contextos e períodos das revisões conferidos.`);

// As réguas leem cópias em memória, só no processo filho; dist/ conserva os seus bytes.
for(const [regua,seletor,queixa] of [
 ['lugar','[data-calendario-pagina]','porta repetida com duas grafias entre o menu e o corpo'],
 ['pais','#nav-principal a[href]','N1: menu de oito errado em'],
]){
 const copias=[];
 for(const rel of ['agenda/index.html','en/agenda/index.html']){
  const root=parse(fs.readFileSync(path.join('dist',rel),'utf8'));
  const menu=new Set(root.querySelectorAll('#nav-principal a[href]').map(a=>a.getAttribute('href')));
  const porta=root.querySelectorAll('[data-calendario-pagina]').find(a=>menu.has(a.getAttribute('href')));
  assert(porta,`porta do calendário também no menu: ${rel}`);
  const href=porta.getAttribute('href');
  const alvo=root.querySelectorAll(seletor).find(a=>a.getAttribute('href')===href);
  alvo.setAttribute('href',href.endsWith('/')?href.slice(0,-1):href+'/');
  copias.push([path.resolve('dist',rel),root.toString()]);
 }
 for(const alterada of [false,true]){
  const codigo=`import fs from 'node:fs';import path from 'node:path';
const copias=new Map(${JSON.stringify(copias)});const ler=fs.readFileSync;
// As leituras por URL e os ficheiros fora da planta seguem para a função original.
fs.readFileSync=function(f,...args){const copia=typeof f==='string'?copias.get(path.resolve(f)):undefined;return copia!==undefined&&${alterada}?copia:ler.call(this,f,...args);};
await import('./scripts/check-${regua}.mjs');`;
  const r=spawnSync(process.execPath,['--input-type=module','-e',codigo],{encoding:'utf8',maxBuffer:16*1024*1024});
  assert.equal(r.status,alterada?1:0,`${regua}: código inesperado; ${r.stderr}`);
  if(alterada){
   for(const rel of ['agenda/index.html','en/agenda/index.html']){
    const rota=regua==='lugar'?'/'+rel.replace('/index.html',''):rel;
    const mensagem=(r.stdout+r.stderr).split('\n').find(l=>l.includes(queixa)&&l.includes(regua==='lugar'?`L1 · ${rota}:`:`em ${rota}.`));
    morde(`${regua}: ${rel}; ${r.stderr}`,mensagem);
    console.log(mensagem.trim());
   }
  }
  console.log(`VOZ-1 D ${regua}: ${alterada?'planta recusada nas duas edições':'controlo intacto'}; código ${r.status}.`);
 }
}
