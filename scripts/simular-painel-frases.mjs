/** Planta reproduzível: projeta o dist e simula outra semana, sem alterar páginas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {lerPaginas,inventario} from './frases-com-afirmacao.mjs';
import {MODELOS,modeloDaFrase,contarModelos,linhaDoCatalogo} from './frases-modelos.mjs';
import {lerRegisto,conferirRegisto,conferirCobertura} from './check-frases-afirmacao.mjs';
import {loadClaims,allClaims} from '../src/lib/ledger.mjs';
import {leituraDaSemana,nomeNaSemana} from '../src/lib/leitura-da-semana.mjs';
import {nomeNaLista} from '../src/lib/primeira-pagina.mjs';
import {unidadeDaLinha} from '../src/i18n/unidades.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {STRINGS} from '../src/i18n/strings.mjs';
const paginas=lerPaginas(process.argv[2]??'dist'), antes=contarModelos(paginas), revistas=new Set(leituraDaSemana().revisoes.map(r=>r.linha));
const l=allClaims().find(l=>linhaDoCatalogo(l)&&!revistas.has(l.id)&&/^\d+(?:[.,]\d+)?$/.test(String(l.value))&&l.reference_date&&['pt','en'].every(lang=>nomeNaSemana(l.id,lang)?.texto));
assert(l,'indicador relido e não revisto para a planta');
let revisoesImpressas=0;
for(const p of paginas.filter(p=>p.tipo==='leituraDaSemana'))for(const b of p.blocos)if(b.texto.includes(STRINGS[p.lingua].semana.publicado)&&b.texto.includes(STRINGS[p.lingua].semana.fonteAgora)){
  assert.equal(b.frases.length,1,'revisão impressa partida');assert.equal(modeloDaFrase(b.frases[0],p.lingua,p.tipo),'revisao-'+p.lingua,'catálogo restrito perdeu revisão impressa');revisoesImpressas++;
}
const exemplos={};let mudadas=0;
for(const p of paginas)for(const b of p.blocos)for(let i=0;i<b.frases.length;i++) {
 const id=modeloDaFrase(b.frases[i],p.lingua,p.tipo);
 if(id){
  const m=MODELOS.find(m=>m.id===id),s=STRINGS[p.lingua];
  const campos={indicador:nomeNaSemana(l.id,p.lingua).texto+(nomeNaLista(l.id,p.lingua).qualificador==='ue'?s.semana.virgula+s.cartao.uniaoEuropeia:''),unidade:unidadeDaLinha(l.unit,p.lingua).texto,periodo:dataDaCasa(l.reference_date,p.lingua),valor:p.lingua==='pt'?'23,4':'23.4',data:'16.11.2026'};
  const frase=m.modelo.replace(/\{(\w+)\}/g,(_,c)=>campos[c]);
  assert.equal(modeloDaFrase(frase,p.lingua,p.tipo),id);
  assert.equal(modeloDaFrase(frase+' Segundo o ministro, melhorou.',p.lingua,p.tipo),null);
  assert.equal(modeloDaFrase(frase.replace(campos.indicador,'Segundo o ministro, melhorou'),p.lingua,p.tipo),m.id.startsWith('painel')?id:null);
  b.frases[i]=frase;exemplos[id]=frase;mudadas++;
 } else if(['leituraDaSemana','metodo'].includes(p.tipo))b.frases[i]=b.frases[i].replace(/09\.11\.2026/g,'16.11.2026');
}
const r=conferirRegisto(lerRegisto(),paginas,loadClaims()), pendentes=JSON.parse(fs.readFileSync('ledger/frases/por-registar.json','utf8'));
const erros=[...r.erros,...conferirCobertura(inventario(paginas),r.textos,pendentes)];assert.deepEqual(erros,[]);
const resultado={simulacao:true,revisoes_impressas:revisoesImpressas,releituras_do_indicador:l.verifications.length,indicador_nao_revisto:l.id,antes,depois:contarModelos(paginas),linhas_mudadas:mudadas,exemplos,recusas:erros.length};
fs.writeFileSync(process.argv[3]??'/tmp/cam2f-simulacao.json',JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({indicador_nao_revisto:l.id,linhas_mudadas:mudadas,recusas:erros.length}));
