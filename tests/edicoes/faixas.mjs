import fs from 'node:fs';import assert from 'node:assert/strict';import {load} from 'js-yaml';import {parse} from 'node-html-parser';
import {edicoesGuardadas,primeiraEdicaoServida,documentoDaHistoriaServido} from '../../src/lib/edicoes.mjs';import {conferirFaixaDaVersao} from '../../scripts/documento-edicao-conferir.mjs';
const manifesto=load(fs.readFileSync('studies-src/manifest.yml','utf8'));let plantas=0;
for(const e of edicoesGuardadas())for(const data of [e.data,null]){
 const html=data?primeiraEdicaoServida(e.slug,e.lang,data):documentoDaHistoriaServido(e.slug,e.lang),root=parse(html),confere=r=>conferirFaixaDaVersao(r,manifesto,e.slug,e.lang,data);
 assert.deepEqual(confere(root),[]);
 for(const muda of [r=>r.querySelector('[data-documento-edicao]').remove(),r=>r.querySelector('[data-edicao-lista-data]').setAttribute('datetime','1900-01-01'),r=>r.querySelector('[data-edicao-porta]').setAttribute('href','/'),r=>r.querySelector('[data-documento-edicao]').insertAdjacentHTML('afterbegin','<p data-edicao-frase>Outra edição.</p>')]){const copia=parse(html);muda(copia);assert(confere(copia).length);plantas++;}
}
console.log(`ED2 faixas: todas as edições guardadas e atuais conferidas; ${plantas} plantas recusadas.`);
