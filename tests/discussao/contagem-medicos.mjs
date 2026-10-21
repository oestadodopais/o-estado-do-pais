/** A contagem adulterada nos dados e no próprio apoio tem de ser recusada. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {resolverExplicacao} from '../../src/lib/explicacoes.mjs';
import {ITENS} from '../../src/data/discussao.mjs';
import {conferirAuditoriaDasExplicacoes} from '../explicacoes/explicacao.mjs';
export function auditarContagem(modo='limpa'){
 const explicacoes=structuredClone(ITENS);
 const auditoria=JSON.parse(fs.readFileSync(new URL('./palavras.json',import.meta.url),'utf8'));
 if(modo==='dados'){
  for(const [lang,de,para] of [['pt','vinte e seis','vinte e sete'],['en','twenty-six','twenty-seven']]){
   const p=explicacoes[0].seccoes[1].conteudo[6].paragrafo[lang];
   const i=p.findIndex(t=>typeof t==='string'&&t.includes(de));
   if(i<0)throw new Error('Contagem ausente da cópia dos dados');
   p[i]=p[i].replace(de,para);
  }
 }
 if(modo==='apoio')for(const e of auditoria.explicacoes)for(const f of e.folhas)for(const p of f.partes)for(const a of p.apoios??[])
  if(a.forma==='contagem-medicos-2024')a.com_valor=27;
 return conferirAuditoriaDasExplicacoes({explicacoes,auditoria}).erros;
}
export function plantasDaContagem(){
 if(auditarContagem().length)throw new Error('Controlo limpo da contagem recusado');
 const plantas=['dados','apoio'].map(modo=>{
  const erros=auditarContagem(modo);
  return {nome:'contagem dos médicos adulterada: '+modo,mordeu:erros.length>0,queixa:erros[0]??null};
 });
 for(const lang of ['pt','en']){
  resolverExplicacao(ITENS[0],lang);
  for(const [nome,alterar] of [
   ['ano literal trocado',p=>p.map(t=>typeof t==='string'?t.replace('2024','2025'):t)],
   ['algarismo acrescentado',p=>[...p,' 27']],
   ['período selado retirado',p=>p.filter(t=>t?.periodo!=='eurostat-pt-phys')],
  ]){
   const copia=structuredClone(ITENS[0]);
   copia.seccoes[1].conteudo[6].paragrafo[lang]=alterar(copia.seccoes[1].conteudo[6].paragrafo[lang]);
   let mordeu=false;try{resolverExplicacao(copia,lang);}catch{mordeu=true;}
   plantas.push({nome:nome+' '+lang,mordeu});
  }
 }
 return plantas;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const modo=process.argv[2]??'limpa',erros=auditarContagem(modo);
 if(!['limpa','dados','apoio'].includes(modo))throw new Error('Modo desconhecido');
 console.log(JSON.stringify({modo,erros},null,2));
 process.exitCode=erros.length?1:0;
}
