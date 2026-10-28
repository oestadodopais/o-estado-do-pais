/** Texto do HTML comparado com a transcrição do mandato e os campos do livro. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {periodoAqui} from '../../../../tests/explicacoes/explicacao.mjs';
const pasta=new URL('./',import.meta.url),linhas=loadClaims();
const mandato=JSON.parse(fs.readFileSync(new URL('mandato-frases.json',pasta)));
const normal=s=>s.replace(/\s+/g,' ').trim();
const limpo=node=>{
  assert(node,'Elemento construído ausente');const copy=parse(node.outerHTML);
  copy.querySelectorAll('.src-chip,.claim-provisorio-chip').forEach(n=>n.remove());
  return normal(copy.text);
};
function esperado(texto,lang){return normal(texto.replace(/⟦(claim|periodo|literal|fragmento|data) ([\w-]+)([^⟧]*)⟧/g,(_,tipo,id,rest)=>{
  const row=linhas.get(id);assert(row,'Linha ausente: '+id);
  const sufixo=/, sufixo "([^"]*)"$/.exec(rest)?.[1]??'';
  if(tipo==='claim')return row.value+sufixo;
  if(tipo==='periodo')return periodoAqui(row.reference_date,lang);
  if(tipo==='data')return periodoAqui(row[rest.trim()],lang);
  if(tipo==='literal')return Array.isArray(row[rest.trim()])?row[rest.trim()].join(' · '):row[rest.trim()];
  const trecho=rest.replace(/^: /,'').replace(/, sufixo ".*"$/,'');
  assert(row.excerpt.includes(trecho),'Trecho ausente: '+id);return trecho+sufixo;
}));}
const slugs={og:'orcamento-2027-generalidade',saude:'saude-no-orcamento',ppp:'parcerias-rodoviarias'};
const seccoes={comparacao:2,conclusao:3,recomendacao:4,opiniao:5};
const frases=[];
for(const lang of ['pt','en']){
  const rota=lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/';
  const root=parse(fs.readFileSync('dist'+rota+'index.html','utf8'));
  for(const[chave,textos]of Object.entries(mandato)){
    const [item,parte,indice]=chave.split('.'),slug=slugs[item];
    const caminho=parte==='titulo'?'titulo':parte==='abertura'?`abertura[${indice}]`:parte==='dito'||parte==='fontes'?`seccoes[${parte==='dito'?0:1}].conteudo[${indice}].paragrafo`:`seccoes[${seccoes[parte]}].conteudo[0].paragrafo`;
    const artigo=root.querySelector(`[data-discussao="${slug}"]`);
    const el=artigo?.querySelector(caminho==='titulo'?'[data-discussao-titulo]':`[data-discussao-paragrafo="${caminho}"]`);
    const texto=limpo(el);assert.equal(texto,esperado(textos[lang],lang),lang+' '+chave);
    frases.push({rota,lang,slug,caminho,texto,igual_ao_mandato:true});
  }
  const inicio=lang==='pt'?'/':'/en/';
  const home=parse(fs.readFileSync('dist'+inicio+'index.html','utf8'));
  for(const[item,slug]of Object.entries(slugs)){
    const li=home.querySelector(`[data-discussao-inicio] [data-discussao-porta="${slug}"]`)?.parentNode;
    const texto=limpo(li?.querySelector('[data-discussao-conclusao]'));
    assert.equal(texto,esperado(mandato[item+'.abertura.0'][lang],lang));
    frases.push({rota:inicio,lang,slug,caminho:'primeira-frase-da-abertura',publicado:li.querySelector('time')?.getAttribute('datetime'),texto,igual_ao_mandato:true});
  }
}
const cabeca=JSON.parse(fs.readFileSync('dist/version.json')).commit;
fs.writeFileSync(new URL('frases-construidas.json',pasta),JSON.stringify({cabeca,frases},null,2)+'\n');
console.log(`PASS: ${frases.length} títulos e parágrafos do HTML iguais ao mandato nas duas edições.`);
