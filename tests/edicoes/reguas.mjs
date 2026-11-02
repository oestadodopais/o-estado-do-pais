import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {textoDaVoz} from '../../scripts/voz-edicoes.mjs';
import {normalizaFraseDoInventario} from '../../scripts/voz.mjs';
import {contagemDasCorrecoesNoPortao} from '../../scripts/edicoes-conferir.mjs';
import assert from 'node:assert/strict';
import {CORRECOES_TEXTO} from '../../src/data/correcoes.mjs';
import {contagensDoRegisto,loadClaims,validateLedger} from '../../src/lib/ledger.mjs';
import {analisa,leMarcadores,leInventario} from '../../scripts/voz.mjs';
import {PALAVRAS_PROIBIDAS} from '../../scripts/voz-palavras.mjs';
let plantas=0;
const linhas=loadClaims(),conta=linhas.get('correcoes-publicadas');
assert.equal(Number(conta.value),contagensDoRegisto().correcoes_publicadas);
const livro = [...linhas.values()].reduce((n,c)=>n+(c.corrections??[]).filter(e=>e.kind==='correcao').length,0);
assert.equal(contagemDasCorrecoesNoPortao(livro,CORRECOES_TEXTO),Number(conta.value));
assert.notEqual(contagemDasCorrecoesNoPortao(livro,CORRECOES_TEXTO.slice(1)),Number(conta.value));plantas++;
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
const declarada=(inv,t)=>inv.linhas.some(l=>l.estado==='viva'&&l.classe==='conteudo'&&normal(l.texto)===normal(t));
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
assert.equal(campos,CORRECOES_TEXTO.length*2,'todas as entradas nas duas línguas');
console.log(`ED1 réguas: ${plantas} plantas da contagem, voz e inventário.`);
