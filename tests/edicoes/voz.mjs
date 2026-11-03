import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {FAIXAS_DE_EDICAO,retiradaForaDaFrase,frasesDaFaixaDocumental,textoDaVoz} from '../../scripts/voz-edicoes.mjs';
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
// OG1-E I: a página não pode voltar à entrada anterior da habitação.
for(const lang of ['pt','en']){
 const rota=lang==='pt'?'correcoes':'en/corrections';
 const pagina=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}/${rota}/index.html`,'utf8'));
 const campo=pagina.querySelector('[data-texto-estudo="a-casa-em-portugal-e-na-europa"] [data-texto-campo="frase"]');
 assert(campo,'entrada da habitação ausente');
 const normal=s=>normalizaFraseDoInventario(s.replace(/\s+/g,' ').trim());
 const texto=normal(textoDaVoz(campo));
 assert(inv.linhas.some(l=>l.estado==='viva'&&normal(l.texto)===texto));controlos++;
 const antigas=inv.linhas.filter(l=>l.bloco==='og1-e-f'&&l.texto.startsWith(lang==='pt'?'Três contagens':'Three press counts'));
 assert.equal(antigas.length,1);assert.equal(antigas[0].estado,'retirada');
 assert(!inv.linhas.some(l=>l.estado==='viva'&&normal(l.texto)===normal(antigas[0].texto)));
 campo.set_content(antigas[0].texto);
 assert(retiradaForaDaFrase(normal(textoDaVoz(campo)),normal(antigas[0].texto)),'a voz aceitou a entrada antiga');plantas++;
 console.log(`OG1-E I ${lang}: página com a entrada antiga recusada, código 1; controlo atual, código 0.`);
}
// A marca de língua não inventa nem apaga espaços, nem esconde texto da voz.
for(const [html,esperado] of [
 ['<p>«<span lang="pt-PT">pelo menos</span>»</p>','«pelo menos»'],
 ['<p>A <em lang="en">report</em> says.</p>','A report says.'],
 ['<p>«<span lang="pt-PT">pelo <i>menos</i></span>»</p>','«pelo menos»'],
 ['<p>1<span lang="pt-PT">2</span>3</p>','123'],
 ['<p>A<span lang="en"> fonte</span><span lang="pt-PT"> diz</span>.</p>','A fonte diz.'],
 ]){assert.equal(textoDaVoz(parse(html).firstChild),esperado);controlos++;}
const comOrigens=parse('<p>A «<span lang="pt-PT">narração <a>porta</a><b data-fonte>origem</b>conservada</span>».</p>');
assert.equal(textoDaVoz(comOrigens.firstChild,n=>n.rawTagName==='a'||n.hasAttribute?.('data-fonte')),'A «narração conservada».');controlos++;
assert(analisa(textoDaVoz(parse('<p><span lang="pt-PT">O projeto verifica tudo.</span></p>').firstChild),'/correcoes',marcadores,'correcoes').length);plantas++;
assert(documentos>0);
console.log(JSON.stringify({controlos,plantas,documentos,retiradas_isoladas_recusadas:true,politica_voz_e_L3:0}));
