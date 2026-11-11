import { desdeOLancamento } from '../../site.config.mjs';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {textoDaVoz} from '../../scripts/voz-edicoes.mjs';
import {normalizaFraseDoInventario} from '../../scripts/voz.mjs';
import {contagemDasCorrecoesNoPortao} from '../../scripts/edicoes-conferir.mjs';
import assert from 'node:assert/strict';
import {CORRECOES_TEXTO,CORRECOES_TEXTO_ENSAIO} from '../../src/data/correcoes.mjs';
import {contagensDoRegisto,loadClaims,validateLedger,correcoesDaLinha} from '../../src/lib/ledger.mjs';
import {analisa,leMarcadores,leInventario} from '../../scripts/voz.mjs';
import {PALAVRAS_PROIBIDAS} from '../../scripts/voz-palavras.mjs';
let plantas=0;
const linhas=loadClaims({includeWithdrawn:true}),conta=linhas.get('correcoes-publicadas');
assert.equal(Number(conta.value),contagensDoRegisto(linhas).correcoes_publicadas);
const livro = [...linhas.values()].reduce((n,c)=>n+correcoesDaLinha(c).filter(e=>e.kind==='correcao'&&e.date<=conta.reference_date).length,0);
const textosContados=[...CORRECOES_TEXTO,...CORRECOES_TEXTO_ENSAIO].filter(c=>c.data<=conta.reference_date);
assert(textosContados.length>0);
assert.equal(contagemDasCorrecoesNoPortao(livro,textosContados),Number(conta.value));
assert.notEqual(contagemDasCorrecoesNoPortao(livro,textosContados.slice(1)),Number(conta.value));plantas++;
const plantadas=structuredClone(linhas),base=contagensDoRegisto(plantadas);
const depois=new Date(Date.parse(conta.reference_date+'T00:00:00Z')+86400000).toISOString().slice(0,10);
const modelo={date:depois,old_value:'1',new_value:'2',reason:'Planta sintética',reason_en:'Synthetic fixture'};
plantadas.set('planta-posterior',{corrections:[{...modelo,kind:'correcao'},{...modelo,kind:'atualizacao'},{...modelo,kind:'proveniencia',field:'source_url'}]});
assert.deepEqual(contagensDoRegisto(plantadas),{correcoes_publicadas:base.correcoes_publicadas,atualizacoes_publicadas:base.atualizacoes_publicadas+1,revisoes_de_proveniencia:base.revisoes_de_proveniencia+1});plantas+=3;
const anterior=conta.value;conta.value=String(Number(anterior)-1);
try {assert(validateLedger().errors.some(e=>e.includes('correcoes-publicadas')));plantas++;}finally{conta.value=anterior;}
const inventario=leInventario(process.cwd());
for(const e of CORRECOES_TEXTO)for(const lang of ['pt','en']) {
 const frase=e.frase[lang],rota=lang==='pt'?'/correcoes':'/en/corrections';
 assert.deepEqual(analisa(frase,rota,leMarcadores(process.cwd()),'correcoes'),[]);
 assert.deepEqual(PALAVRAS_PROIBIDAS.filter(m=>m.marca.test(frase)).map(m=>m.chave),[]);
 assert(analisa(frase+' O projeto verifica tudo.',rota,leMarcadores(process.cwd()),'correcoes').length);plantas++;
}
// ED1-F: a unidade é o campo marcado que a voz lê, com selos e marcas de língua.
// A classe e o estado são exigidos; o nome do bloco editorial não muda o texto rendido.
const normal=s=>normalizaFraseDoInventario(s.replace(/\s+/g,' ').trim());
const declarada=(inv,t)=>inv.linhas.some(l=>['viva','condicional-rec1'].includes(l.estado)&&l.classe==='conteudo'&&normal(l.texto)===normal(t));
let campos=0;
for(const rota of ['correcoes','en/corrections']) {
 const root=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/${rota}/index.html`,'utf8'));
 for(const el of root.querySelectorAll('[data-texto-campo="frase"]')) {
  assert(el.hasAttribute('data-voz'),'campo fora da varredura da voz');
  const frase=textoDaVoz(el);assert(declarada(inventario,frase),'ED1: unidade rendida sem declaração inteira');campos++;
  const semFrase=structuredClone(inventario);semFrase.linhas=semFrase.linhas.filter(l=>normal(l.texto)!==normal(frase));assert(!declarada(semFrase,frase));plantas++;
  const semEstado=structuredClone(inventario);for(const l of semEstado.linhas)if(normal(l.texto)===normal(frase))l.estado=null;assert(!declarada(semEstado,frase));plantas++;
  const alterada=parse(el.outerHTML);alterada.querySelector('[data-texto-campo="frase"]').set_content('Uma frase diferente.');assert(!declarada(inventario,textoDaVoz(alterada)));plantas++;
 }
}
assert.equal(campos,CORRECOES_TEXTO.filter(c=>desdeOLancamento(c.data)).length*2,'todas as entradas nas duas línguas');
console.log(`ED1 réguas: ${plantas} plantas da contagem, voz e inventário.`);
