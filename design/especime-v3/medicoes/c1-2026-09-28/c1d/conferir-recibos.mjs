/** C1d: confere os recibos e as marcas nas páginas realmente construídas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import {loadClaims} from '../../../../../src/lib/ledger.mjs';
import {conferirVerificacaoLegivel,conferirHistoricoLegivel} from '../../../../../scripts/verificacao-legivel.mjs';
const pasta = 'design/especime-v3/medicoes/c1-2026-09-28/c1d';
const casos=[], erros=[];
const normal=e=>e?.text.replace(/\s+/g,' ').trim();
const livro=loadClaims();
const bandeiras=JSON.parse(fs.readFileSync(`${pasta}/bandeiras-provadas.json`)).linhas;
const prr=[...livro.values()].filter(l=>l.id.startsWith('evora-prr-') && l.corrections.some(c=>c.field==='source_url')).map(l=>l.id);
const ids=[...new Set([...bandeiras.map(l=>l.id),...prr,'pib-real-per-capita-2025-ue','indice-de-divida-limite-legal','ipc-variacao-homologa'])];
function testar(nome, fn) {
  try {casos.push({nome,passou:true,...fn()});}
  catch(e) {erros.push(`${nome}: ${e.message}`);casos.push({nome,passou:false});}
}
for (const lang of ['pt','en']) {
  const base=lang==='pt'?'livro-razao':'en/ledger';
  for (const id of ids) testar(`${id}-${lang}`,()=>{
    const doc=parse(fs.readFileSync(`dist/${base}/${id}/index.html`,'utf8'));
    const linha=livro.get(id), texto=normal(doc.querySelector('[aria-labelledby="verificacoes"]'));
    assert.deepEqual(conferirVerificacaoLegivel(doc,linha,lang),[]);
    assert.deepEqual(conferirHistoricoLegivel(doc,linha),[]);
    const nota=lang==='en'?linha.source_flag_note_en:linha.source_flag_note;
    if(['e','p'].includes(linha.source_flag)) assert(normal(doc.querySelector('h1')).includes(`(${nota})`));
    if(id==='divida-das-familias-2025-ue') {
      assert.equal(normal(doc.querySelector('[data-valor-anterior-confirmado]')),'49,3');
      assert.equal(normal(doc.querySelector('[data-linha-campo$=".found"]')),'49,2');
      assert(texto.includes('21.09.2026')&&texto.includes('28.09.2026'));
      assert.equal(normal(doc.querySelector('#alteracao-1 [data-correcao-campo="field"]')),lang==='en'?'reading date':'dia da leitura');
    }
    if(id.startsWith('pib-real-')) {
      const tentativa=doc.querySelector('[data-resultado="inacessivel"]');
      assert.equal(normal(tentativa.previousElementSibling),lang==='en'?'Re-read attempted on':'Releitura tentada a');
      assert(normal(tentativa).includes(lang==='en'?'with no answer to that request':'sem resposta a esse pedido'));
    }
    if(id==='indice-de-divida-limite-legal') {
      assert.equal(doc.querySelectorAll('.historico-entrada').length,0);
      assert(texto.includes('01.09.2026'));
    }
    if(lang==='en') for(const el of doc.querySelectorAll('.historico-entrada [data-correcao-campo="old_value"], .historico-entrada [data-correcao-campo="new_value"]')) {
      if(/Anuário|Municípios|Direção-Geral/.test(el.text)) assert.equal(el.getAttribute('lang'),'pt-PT');
    }
    return {texto,grupos:doc.querySelectorAll('.historico-entrada').length,entradas:linha.corrections.length};
  });
  for(const pagina of [lang==='pt'?'temas/index.html':'en/themes/index.html',lang==='pt'?'index.html':'en/index.html']) testar(`marca-estimada-${pagina}`,()=>{
    const doc=parse(fs.readFileSync(`dist/${pagina}`,'utf8'));
    const card=doc.querySelector('article[data-cartao-medida="despesa-em-id-2024"]');
    const palavra=lang==='en'?'estimated value':'valor estimado';
    assert(normal(card).includes(palavra));
    const observacoes=card.querySelectorAll('[data-claim="despesa-em-id-2024-ue"]');
    assert.equal(observacoes.length,1);
    assert(normal(card.querySelector('[data-regua="ue"]')).includes(palavra));
    for(const el of observacoes) assert(el.parentNode.text.includes(` (${palavra})`));
    return {observacoes:observacoes.length,texto:normal(card)};
  });
  testar(`objetivo-institucional-${lang}`,()=>{
    const doc=parse(fs.readFileSync(`dist/${lang==='pt'?'temas':'en/themes'}/index.html`,'utf8'));
    const card=doc.querySelector('article[data-cartao-medida="ihpc-variacao-homologa"]');
    assert.equal(card.querySelectorAll('[data-nonledger="objetivo-institucional"]').length,1);
    assert.equal(card.querySelectorAll('[data-nonledger="limiar-do-quadro"]').length,0);
    assert(!/\b(dentro|fora|within|outside)\b/i.test(normal(card)));
    return {texto:normal(card)};
  });
}
const r={cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,casos,contagem:casos.length,erros};
fs.writeFileSync(`${pasta}/recibos-finais.json`,JSON.stringify(r,null,2)+'\n');
console.log(`${casos.length} casos; ${erros.length} falhas.`);
if(erros.length) {console.log(erros.join('\n'));process.exitCode=1;}
