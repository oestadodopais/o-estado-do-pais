import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
const dist=process.env.OEDP_DIST??'dist';
const pagina=rota=>parse(fs.readFileSync(`${dist}/${rota}/index.html`,'utf8'));
const texto=el=>el.textContent.replace(/\s+/g,' ').trim();
const livro=loadClaims({includeWithdrawn:true});
const frases={
  pt:{pelouros:'A repartição dos pelouros deste mandato está por confirmar na fonte.',auditorias:'Oito estudos saíram do arquivo a 13.11.2026 para serem reescritos: as auditorias acharam neles erros, números sem a cópia da fonte ou dados que a fonte já reviu.'},
  en:{pelouros:'This term’s split of portfolios is yet to be confirmed at the source.',auditorias:'Eight studies left the archive on 13.11.2026 to be rewritten: the audits found errors in them, figures without a stored copy of the source, or data the source has since revised.'},
};
for(const lang of ['pt','en']) {
  const evora=pagina(lang==='pt'?'municipios/evora':'en/municipalities/evora');
  assert.equal(texto(evora.querySelector('main')).split(frases[lang].pelouros).length-1,2);
  console.log(`1 ${lang}: ${frases[lang].pelouros}`);
  for(const id of ['estudos-publicados','edicoes-publicadas']) assert.equal(livro.get(id).corrections.at(-1)[lang==='pt'?'reason':'reason_en'],frases[lang].auditorias);
  const recibo=pagina(`${lang==='pt'?'livro-razao':'en/ledger'}/estudos-publicados`);
  assert(texto(recibo).includes(frases[lang].auditorias));
  console.log(`2 ${lang}: ${frases[lang].auditorias}`);
  for(const [nome,p] of [['índice',pagina(lang==='pt'?'estudos':'en/studies')],['Évora',evora]]) {
    const aviso=p.querySelector('[data-contagem-retirada]');assert(aviso);
    console.log(`4 ${nome} ${lang}: ${texto(aviso)}`);
  }
}
