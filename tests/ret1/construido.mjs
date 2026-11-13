import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {WORKS,PUBLISHED_WORKS} from '../../src/data/studies.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {t} from '../../src/i18n/strings.mjs';
import {enderecoDeEstudoRetirado} from '../../src/lib/estudo-da-linha.mjs';
import {conferirLigacoesRetiradas} from '../../scripts/estudos-retirados-conferir.mjs';
import {SITE_URL} from '../../site.config.mjs';
const dist=process.env.OEDP_DIST??'dist';
const retirados=new Set(WORKS.filter(w=>w.estado==='retirado').map(w=>w.id));
const linhas=[...loadClaims().values()].filter(c=>retirados.has(c.study));
assert(linhas.length>0);
let recibos=0;
for(const lang of ['pt','en']) for(const c of linhas){
 const rota=`${lang==='pt'?'livro-razao':'en/ledger'}/${c.id}/index.html`;
 const root=parse(fs.readFileSync(`${dist}/${rota}`,'utf8'));
 assert(!root.querySelectorAll('dt').some(el=>el.textContent.trim()===t(lang).prov.estudo),`${rota}: estudo retirado ainda visível`);
 assert(root.querySelector('.linha-valor [data-claim]'),`${rota}: valor ausente`);
 recibos++;
}
assert.equal(PUBLISHED_WORKS.length,5);
for(const w of PUBLISHED_WORKS)for(const base of ['estudos','en/studies'])assert(fs.existsSync(`${dist}/${base}/${w.slug}/index.html`));
console.log(`RET1: ${recibos} recibos preservam o valor e omitem o campo do estudo retirado; os cinco estudos vivos têm páginas nas duas línguas.`);

const fontesRetiradas = [...loadClaims().values()].filter(c => enderecoDeEstudoRetirado(c.source_url));
assert(fontesRetiradas.length > 0);
let fontesConferidas = 0;
for (const lang of ['pt', 'en']) for (const c of fontesRetiradas) {
 const rota = `/${lang === 'pt' ? 'livro-razao' : 'en/ledger'}/${c.id}/`;
 const html = fs.readFileSync(`${dist}${rota}index.html`, 'utf8');
 const root = parse(html);
 assert(!root.textContent.includes(c.source_url), `${rota}: endereço retirado ainda impresso`);
 assert(!root.querySelectorAll('[href]').some(a => a.getAttribute('href') === c.source_url));
 assert(!root.querySelector('[data-linha-campo="source_url"]'), `${rota}: campo do endereço retirado ainda impresso`);
 for (const campo of ['document.title', 'document.edition', 'excerpt']) {
  const valor = campo === 'excerpt' ? c.excerpt : c.document[campo.split('.')[1]];
  assert.equal(root.querySelector(`[data-linha-campo="${campo}"]`)?.textContent, valor, `${rota}: ${campo} foi alterado`);
 }
 assert.deepEqual(conferirLigacoesRetiradas(WORKS, rota, html), []);
 for (const reposicao of [`<p>${c.source_url}</p>`, `<a href="${c.source_url}">Fonte</a>`])
  assert(conferirLigacoesRetiradas(WORKS, rota, html.replace('</main>', reposicao+'</main>')).length, 'Repor o endereço no recibo tem de recusar.');
 const vivo = new URL(`/estudos/${PUBLISHED_WORKS[0].slug}/documento/`, SITE_URL).href;
 assert.deepEqual(conferirLigacoesRetiradas(WORKS, rota, html.replace('</main>', `<a href="${vivo}">${vivo}</a></main>`)), [], 'Um endereço de estudo publicado pode continuar impresso e ligado no recibo.');
 fontesConferidas++;
}
console.log(`RET1-C: ${fontesConferidas} recibos sem o endereço retirado, com título, edição e excerto intactos; repor texto ou ligação recusa; endereço publicado passa.`);
