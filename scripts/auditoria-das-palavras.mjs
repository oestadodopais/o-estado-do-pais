/** OG1-B: folhas bilingues dos itens, com apoios literais das linhas citadas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ITENS} from '../src/data/discussao.mjs';
import {loadClaims} from '../src/lib/ledger.mjs';
import {folhasDaExplicacao, conferirAuditoriaDasExplicacoes} from '../tests/explicacoes/explicacao.mjs';

const ficheiro='tests/discussao/palavras.json';
const linhas=loadClaims();
const anterior=JSON.parse(fs.readFileSync(ficheiro,'utf8'));
const sobreNovo='Redação do mandato OG1-B, com os apoios das linhas que o parágrafo cita.';
const ler=(obj,caminho)=>caminho.replace(/\[(\d+)\]/g,'.$1').split('.').reduce((x,k)=>x?.[k],obj);
function apoiosDoCaminho(item,caminho,antes){
  const base=/^(titulo|abertura\[\d+\]|seccoes\[\d+\]\.conteudo\[\d+\]\.paragrafo|seccoes\[\d+\]|naoDiz\[\d+\])/.exec(caminho)?.[0];
  assert(base,`Caminho sem parágrafo: ${caminho}`);
  const ids=new Set(item.recibos?.[base]??[]);
  const andar=x=>{
    if(Array.isArray(x))x.forEach(andar);
    else if(x&&typeof x==='object')for(const[k,v]of Object.entries(x)){
      if(['claim','literal','fragmento','periodo','data','selo'].includes(k)&&typeof v==='string')ids.add(v);
      else andar(v);
    }
  };
  andar(ler(item,base));
  // Uma folha intacta conserva também a prova contextual, por exemplo todos os anos de uma série.
  for(const p of antes?.partes??[]) for(const a of p.apoios??[]) if(a.linha) ids.add(a.linha);
  // Os títulos das secções apoiam-se nos parágrafos da própria secção.
  for(const id of ids) for(const origem of linhas.get(id)?.derived_from??[]) ids.add(origem);
  const apoios = [...ids].filter(id=>{
    const row=linhas.get(id);
    assert(row?.excerpt || row?.derived_from?.length,`Excerto ou derivação ausente: ${id}`);
    return Boolean(row.excerpt);
  }).map(id=>{
    const literal=linhas.get(id)?.excerpt;
    assert(typeof literal==='string'&&literal.length,`Excerto ausente: ${id}`);
    return {linha:id,campo:'excerpt',literal};
  });
  // A contagem já auditada conserva a prova numérica que as plantas adulteram.
  for(const p of antes?.partes??[]) for(const a of p.apoios??[]) if(a.forma==='contagem-medicos-2024') apoios.push(a);
  return apoios;
}
const auditoria={explicacoes:ITENS.map(item=>{
  const antiga=anterior.explicacoes.find(e=>e.slug===item.slug);
  return {slug:item.slug,origens:antiga?.origens??[],folhas:folhasDaExplicacao(item).map(f=>{
    const antes=antiga?.folhas.find(a=>a.caminho===f.caminho&&a.pt===f.pt&&a.en===f.en);
    const sobre=antes?.partes.map(p=>p.sobre).filter(Boolean).join(' ')||sobreNovo;
    return {caminho:f.caminho,pt:f.pt,en:f.en,ramo:f.ramo,partes:[{pt:f.pt,en:f.en,classe:'leitura',sobre,apoios:apoiosDoCaminho(item,f.caminho,antes)}]};
  })};
})};
const conferir=a=>conferirAuditoriaDasExplicacoes({explicacoes:ITENS,auditoria:a,linhas});
const resultado=conferir(auditoria);
if(resultado.erros.length){console.error(resultado.erros.slice(0,12).join('\n'));process.exit(1);}
if(process.argv.includes('--prova')){
  const copia=structuredClone(auditoria);
  copia.explicacoes[0].folhas[0].partes[0].apoios[0].literal='Literal de ensaio que não existe no excerto da linha.';
  assert(conferir(copia).erros.some(e=>e.includes('não está no campo')),'A planta do apoio falso não mordeu');
  console.log('PASS: apoio falso recusado; auditoria original aceite.');
}else{
  fs.writeFileSync(ficheiro,JSON.stringify(auditoria,null,2)+'\n');
  console.log(`PASS: ${auditoria.explicacoes.reduce((n,e)=>n+e.folhas.length,0)} folhas escritas e conferidas.`);
}
