/** OG1-B: a glosa inglesa só repete números completos da citação, na mesma ordem e fonte. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {OG1} from '../../src/data/discussao-og1.mjs';
import {resolverExplicacao,textoDosPedacosDaExplicacao} from '../../src/lib/explicacoes.mjs';
const candidato=t=>({slug:'ensaio-glosa',titulo:{pt:['Ensaio'],en:['Test']},abertura:[{pt:[t],en:[t]}],naoDiz:[],seccoes:[]});
const resolver=(t,lang)=>resolverExplicacao(candidato(t),lang).abertura[0].pedacos;
const provas=[];
const glosas=OG1.seccoes.flatMap(s=>s.conteudo.flatMap(b=>b.paragrafo.en)).filter(t=>t?.glosa);
assert(glosas.length,'Faltam controlos positivos de glosas');
for(const token of glosas){
  assert.equal(textoDosPedacosDaExplicacao(resolver(token,'pt'),'pt'),token.texto);
  assert.equal(textoDosPedacosDaExplicacao(resolver(token,'en'),'en'),token.texto+token.glosa.map(t=>typeof t==='string'?t:t.texto).join(''));
  for(const[nome,mudar]of[
    ['valor trocado',g=>g.find(t=>t?.fragmento).texto='999999'],
    ['fonte trocada',g=>g.find(t=>t?.fragmento).fragmento='og1-votacao-generalidade'],
    ['campo trocado',g=>g.find(t=>t?.fragmento).campo='document.title'],
    ['número retirado',g=>g.splice(g.findIndex(t=>t?.fragmento),1)],
    ['número em texto fixo',g=>g.splice(g.findIndex(t=>t?.fragmento),1,'999999')],
    ['número duplicado',g=>g.push(structuredClone(g.find(t=>t?.fragmento)))],
  ]){
    const falso=structuredClone(token);mudar(falso.glosa);
    for(const lang of ['pt','en'])assert.throws(()=>resolver(falso,lang),/glosa altera/);
    provas.push({nome,linha:token.fragmento,mordeu:true});
  }
  if(token.glosa.filter(t=>t?.fragmento).length>1){
    const falso=structuredClone(token),indices=falso.glosa.map((t,i)=>t?.fragmento?i:-1).filter(i=>i>=0);
    [falso.glosa[indices[0]],falso.glosa[indices[1]]]=[falso.glosa[indices[1]],falso.glosa[indices[0]]];
    assert.throws(()=>resolver(falso,'en'),/glosa altera/);provas.push({nome:'ordem dos números trocada',linha:token.fragmento,mordeu:true});
  }
}
for(const[id,texto]of[['og1-governo-observador-saldo','30'],['og1-cfp-saldo-2027','0'],['og1-cfp-saldo-2027','1']]){
  assert.throws(()=>resolver({fragmento:id,campo:'excerpt',texto},'pt'),/corta um número/);
  provas.push({nome:'fragmento corta número: '+texto,linha:id,mordeu:true});
}
// Um ponto final não é uma casa decimal; uma ocorrência posterior pode ser o número completo.
for(const[id,texto]of[['og1-cfp-plausivel','resultaria um excedente próximo do valor da POE/2027'],['og1-utao-p107','2']])
  assert.equal(textoDosPedacosDaExplicacao(resolver({fragmento:id,campo:'excerpt',texto},'pt'),'pt'),texto);
const saida=process.argv.indexOf('--json');
if(saida>=0)fs.writeFileSync(process.argv[saida+1],JSON.stringify({controlos:glosas.length,plantas:provas},null,2)+'\n');
console.log(`PASS: ${glosas.length} glosas intactas nas duas edições; ${provas.length} plantas recusadas.`);
