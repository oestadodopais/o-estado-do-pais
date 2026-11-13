import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {loadClaims, validateLedger} from '../../src/lib/ledger.mjs';
import {retiradaDaContagem} from '../../src/lib/retirada-da-contagem.mjs';
import {dataDaCasa} from '../../src/lib/datas.mjs';
import {routePath} from '../../src/lib/routes.mjs';
const livro=loadClaims(), todas=loadClaims({includeWithdrawn:true});
for (const id of ['estudos-publicados','estudos-evora-publicados']) {
  const linha=livro.get(id), retirada=retiradaDaContagem(linha);
  assert(retirada);
  const outra=structuredClone(linha);
  delete outra.corrections.at(-1).event;
  assert.equal(retiradaDaContagem(outra),null,'a diminuição sem evento não basta');
  outra.corrections.at(-1).event='retirada-de-estudos';
  outra.corrections.push({date:'2026-11-14',kind:'atualizacao',old_value:linha.value,new_value:linha.value});
  assert.equal(retiradaDaContagem(outra),null,'uma entrada posterior esconde a retirada');
  for (const lang of ['pt','en']) {
    const rota=routePath(id==='estudos-publicados'?'estudos':'municipio',lang,{slug:'evora'});
    const root=parse(fs.readFileSync(`${process.env.OEDP_DIST??'dist'}${rota}/index.html`,'utf8'));
    const confere = r => {
      const caixa=r.querySelector(`[data-contagem-estudos="${id}"]`), aviso=caixa?.querySelector('[data-contagem-retirada]');
      return caixa?.querySelector(`[data-claim="${id}"]`)?.textContent === linha.value &&
        aviso?.querySelector('a')?.getAttribute('href')===routePath('linha',lang,{slug:id}) &&
        aviso.textContent.replace(/\s+/g,' ').trim() === `${dataDaCasa(retirada.entrada.date,lang)}: ${retirada.entrada[lang==='pt'?'reason':'reason_en']}`;
    };
    assert(confere(root),`${rota}: contagem, data, motivo ou recibo divergente`);
    for (const mudar of [
      r=>r.querySelector('[data-contagem-retirada]').remove(),
      r=>r.querySelector('[data-contagem-retirada] a').setAttribute('href','/'),
      r=>r.querySelector('[data-contagem-retirada] a').set_content('Motivo adulterado'),
    ]) {const copia=parse(root.toString());mudar(copia);assert(!confere(copia));}
  }
  for (const event of ['desconhecido',null]) {
    const alterada=structuredClone(linha);alterada.corrections.at(-1).event=event;
    try {livro.set(id,alterada);todas.set(id,alterada);assert(validateLedger().errors.some(e=>e.includes(`[${id}.yml]`)&&e.includes('event')));}
    finally {livro.set(id,linha);todas.set(id,linha);}
  }
}
console.log('RET1 contagens: data, motivo e recibo conferidos em quatro páginas; ausência, porta, frase, evento e entrada posterior exercitados.');
