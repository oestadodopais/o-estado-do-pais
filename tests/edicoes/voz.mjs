import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {FAIXAS_DE_EDICAO,retiradaForaDaFrase,frasesDaFaixaDocumental} from '../../scripts/voz-edicoes.mjs';
import {leInventario,normalizaFraseDoInventario,analisa,leMarcadores} from '../../scripts/voz.mjs';
import {PALAVRAS_PROIBIDAS} from '../../scripts/voz-palavras.mjs';
import {manifestoDasEdicoes,versoesDaEdicao,faixaDaVersao} from '../../src/lib/edicoes.mjs';
import {t} from '../../src/i18n/strings.mjs';
const inv=leInventario(process.cwd()),marcadores=leMarcadores(process.cwd());
const declarada=texto=>inv.linhas.some(l=>l.estado==='viva'&&normalizaFraseDoInventario(l.texto)===normalizaFraseDoInventario(texto));
let controlos=0,plantas=0,documentos=0;
for(const [fragmento,inteiras] of FAIXAS_DE_EDICAO){
 assert(inv.linhas.some(l=>l.texto===fragmento&&l.estado==='retirada'));
 for(const inteira of inteiras){assert(!retiradaForaDaFrase(inteira,fragmento,inteiras));assert(declarada(inteira));controlos++;}
 for(const texto of [fragmento,`· ${fragmento}`,`${[...inteiras].at(-1)} texto acrescentado`]){assert(retiradaForaDaFrase(texto,fragmento,inteiras));plantas++;}
}
for(const lang of ['pt','en']){
 const politica=t(lang).correcoes.politicaV;
 assert(declarada(politica));assert.deepEqual(analisa(politica,lang==='pt'?'/correcoes':'/en/corrections',marcadores,'correcoes'),[]);
 assert.deepEqual(PALAVRAS_PROIBIDAS.filter(m=>m.marca.test(politica)),[]);
 for(const l of inv.linhas.filter(l=>l.estado==='retirada'))assert(!retiradaForaDaFrase(politica,l.texto),`política: ${l.texto}`);
 controlos++;
}
for(const e of manifestoDasEdicoes().edicoes)for(const v of versoesDaEdicao(e.slug,e.lang)){
 const faixa=faixaDaVersao(e.slug,e.lang,v.data);if(!faixa)continue;
 const root=parse(`<body><main><p>Texto da obra que não pertence ao inventário.</p></main>${faixa}</body>`);
 const frases=frasesDaFaixaDocumental(root);assert.equal(frases.length,2);assert(frases.every(declarada));documentos++;controlos++;
 const alterada=parse(root.outerHTML);alterada.querySelector('[data-edicao-frase]').set_content('publicado a ·');
 const resultado=frasesDaFaixaDocumental(alterada);assert(resultado.includes('publicado a ·'));assert(retiradaForaDaFrase(resultado[0],'publicado a ·',FAIXAS_DE_EDICAO.get('publicado a ·')));plantas++;
 const extra=parse(root.outerHTML);extra.querySelector('[data-documento-edicao]').insertAdjacentHTML('beforeend','<p>Uma frase nova sem declaração.</p>');assert(frasesDaFaixaDocumental(extra).some(f=>!declarada(f)));plantas++;
}
assert(documentos>0);
console.log(JSON.stringify({controlos,plantas,documentos,retiradas_isoladas_recusadas:true,politica_voz_e_L3:0}));
