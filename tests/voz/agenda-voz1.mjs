/** VOZ-1: campos públicos completos e campos internos ausentes, nas duas edições. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const agenda=JSON.parse(fs.readFileSync('src/data/agenda.json'));
const calendario=JSON.parse(fs.readFileSync('src/data/calendario.json'));
export function conferir(root,lang){
 const erros=[];
 for(const item of agenda.itens){
  const artigo=root.querySelector(`[data-agenda-item="${item.id}"]`);
  if(!artigo){erros.push(`item ausente: ${item.id}`);continue;}
  const esperados=['titulo','estado','ultima_alteracao',...(item.pergunta?['pergunta']:[])];
  for(const campo of esperados)if(!artigo.querySelector(`[data-agenda="${item.id}.${campo}"]`))erros.push(`campo público ausente: ${campo}`);
  for(const el of artigo.querySelectorAll('[data-agenda]'))if(!esperados.includes(el.getAttribute('data-agenda').slice(item.id.length+1)))erros.push('campo interno da agenda');
  if(!item.pergunta && artigo.querySelector('[data-agenda-pergunta-ausente]')?.textContent!==(lang==='pt'?'Pergunta por registar':'Question not recorded'))erros.push('pergunta ausente sem indicação');
  const estado=artigo.querySelector(`[data-agenda="${item.id}.estado"]`)?.textContent.trim();
  if(estado?.split(/\s+/).length!==2)erros.push('estado fora das duas palavras');
 }
 for(const e of calendario.eventos){
  const fonte=root.querySelector(`.agenda-evento [data-agenda="evento:${e.id}.fonte"]`);const item=fonte?.closest('.agenda-evento');
  if(!item){erros.push(`acontecimento ausente: ${e.id}`);continue;}
  const campos=['titulo','fonte',...(e.data?['data']:e.janela?['janela.inicio','janela.fim']:['marcador']),...((e.afecta_linhas??[]).length?['afecta_linhas']:[])];
  for(const campo of campos)if(!item.querySelector(`[data-agenda="evento:${e.id}.${campo}"]`))erros.push(`campo público do calendário ausente: ${campo}`);
  if(!e.data&&!e.janela&&item.querySelector(`[data-agenda="evento:${e.id}.marcador"]`)?.textContent!==(lang==='pt'?'sem data anunciada':'no announced date'))erros.push('ausência de data alterada');
  for(const el of item.querySelectorAll('[data-agenda]'))if(!campos.includes(el.getAttribute('data-agenda').slice(e.id.length+8)))erros.push('campo interno do calendário');
 }
 return erros;
}
for(const lang of ['pt','en']){
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'agenda':'en/agenda'}/index.html`,'utf8'));
 assert.deepEqual(conferir(root,lang),[]);
 const item=root.querySelector('[data-agenda-item]');
 item.querySelector('h3').remove();assert(conferir(root,lang).some(e=>e.includes('titulo')));
 item.insertAdjacentHTML('beforeend',`<p data-agenda="${item.getAttribute('data-agenda-item')}.porque">Nota interna</p>`);assert(conferir(root,lang).includes('campo interno da agenda'));
 const evento=root.querySelector('.agenda-evento');evento.querySelector('.agenda-evento-fonte').remove();assert(conferir(root,lang).some(e=>e.includes('acontecimento ausente')));
 const correcoes=parse(fs.readFileSync(`dist/${lang==='pt'?'correcoes':'en/corrections'}/index.html`,'utf8'));
 assert.equal(correcoes.querySelectorAll('.log-afirmacao code').length,0);
 assert(correcoes.querySelectorAll('.registo-mudanca[data-correcao-entrada]').length>0);
 for(const entrada of correcoes.querySelectorAll('.registo-mudanca[data-correcao-entrada]'))assert(entrada.querySelector('a.src-chip'),'porta da linha retirada');
}
console.log('VOZ-1: agenda e calendário completos nas duas edições; 6 plantas recusadas; identificadores fora do texto das correções.');
