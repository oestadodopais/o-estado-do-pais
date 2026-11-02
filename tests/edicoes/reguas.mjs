import fs from 'node:fs';
import {parse} from 'node-html-parser';
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
const faltaFrase = (inventario, frase) => !inventario.linhas.some(l=>l.bloco==='ed1' && l.estado==='viva' && l.texto.replaceAll('&#39;',"'")===frase);
for(const e of CORRECOES_TEXTO)for(const lang of ['pt','en']) {
 const frase=e.frase[lang],rota=lang==='pt'?'/correcoes':'/en/corrections';
 assert.deepEqual(analisa(frase,rota,leMarcadores(process.cwd()),'correcoes'),[]);
 assert.deepEqual(PALAVRAS_PROIBIDAS.filter(m=>m.marca.test(frase)).map(m=>m.chave),[]);
 assert(analisa(frase+' O projeto verifica tudo.',rota,leMarcadores(process.cwd()),'correcoes').length);plantas++;
 assert(!faltaFrase(inventario,frase),`inventário: ${lang}/${e.slug}`);
 const copia=structuredClone(inventario);copia.linhas=copia.linhas.filter(l=>l.texto.replaceAll('&#39;',"'")!==frase);
 assert(faltaFrase(copia,frase));plantas++;
 const semEstado=structuredClone(inventario);semEstado.linhas.find(l=>l.texto.replaceAll('&#39;',"'")===frase&&l.bloco==='ed1').estado=null;
 assert(faltaFrase(semEstado,frase));plantas++;
}
// A unidade do inventário é também o parágrafo que o leitor recebe, não só a frase isolada.
const normal=s=>normalizaFraseDoInventario(s.replace(/\s+/g,' ').trim());
const declarada=t=>inventario.linhas.some(l=>l.bloco==='ed1'&&l.estado==='viva'&&normal(l.texto)===normal(t));
for(const rota of ['correcoes','en/corrections']) {
 const root=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/${rota}/index.html`,'utf8'));
 for(const el of root.querySelectorAll('[data-texto-campo="frase"]')) {
  const paragrafo=el.closest('p');assert(declarada(paragrafo.rawText),'ED1: bloco rendido sem declaração inteira');
  const copia=parse(paragrafo.outerHTML);copia.querySelector('[data-texto-campo="frase"]').set_content('Uma frase diferente.');
  assert(!declarada(copia.rawText),'ED1: bloco alterado passou pelo inventário');plantas++;
 }
}
console.log(`ED1 réguas: ${plantas} plantas da contagem, voz e inventário.`);
