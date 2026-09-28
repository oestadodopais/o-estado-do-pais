/** C1d: declara os literais novos e confere a quinta redação. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { LEITURAS_RP1 as direcao } from '../../../../observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs';
import { LEITURAS_RP1 } from '../../../../../src/data/leituras-rp1.mjs';
import { LEITURAS_DAS_MEDIDAS } from '../../../../../src/data/leituras-das-medidas.mjs';
import { ORIGENS_C1C } from '../../../../../src/data/origens-c1c.mjs';
import { folhasDaLeitura, conferirAuditoriaDasLeituras } from '../../../../../tests/cartao/leituras.mjs';
import { leituraDaMedida, textoDaLeitura } from '../../../../../src/lib/leitura-da-medida.mjs';
const pasta = new URL('./', import.meta.url);
const ficheiro = new URL('../../../../../tests/cartao/leituras-provadas.json', import.meta.url);
const a = JSON.parse(fs.readFileSync(ficheiro));
const apoio = origem => ({ origem, campo: 'excerto', literal: ORIGENS_C1C[origem].excerto });
const ids = ['ipc-variacao-homologa', 'ihpc-variacao-homologa', 'taxa-de-cambio-efectiva-real-2025'];
for (const id of ids) {
  const m = a.medidas.find(m => m.id === id);
  const folhas = folhasDaLeitura(LEITURAS_DAS_MEDIDAS[id].pt, LEITURAS_DAS_MEDIDAS[id].en);
  for (const f of folhas.filter(f => f.nl === undefined)) {
    if (m.folhas.some(x=>x.pt===f.pt && x.en===f.en) || a.comuns.some(x=>x.pt===f.pt && x.en===f.en)) continue;
    const origens = id.startsWith('taxa-') ? ['c1c-eurostat-sinal-cambio', 'c1c-bce-competitividade']
      : id.startsWith('ihpc') && f.pt.includes('zona do euro') ? ['c1c-bce-estrategia','c1c-bce-ambito'] : ['c1c-bce-estrategia'];
    m.folhas.push({pt:f.pt,en:f.en,partes:[{pt:f.pt,en:f.en,classe:'diz',apoios:origens.map(apoio)}]});
    m.origens=[...new Set([...m.origens,...origens])];
  }
  if (id.startsWith('ihpc')) m.algarismos=[{nl:'2',apoios:[apoio('c1c-bce-estrategia')]}];
}
const camaras = a.medidas.find(m=>m.id==='camaras');
camaras.origens=[...new Set([...camaras.origens,'c1c-dgal-limites'])];
for(const f of camaras.folhas) for(const parte of f.partes) if(parte.apoios?.some(p=>p.linha==='indice-de-divida-limite-legal')) parte.apoios=[apoio('c1c-dgal-limites')];
if (!a.leituras.some(l=>l.o_que.startsWith('C1d:'))) a.leituras.push({quem:'Codex gpt-6-astra',quando:'2026-09-28',o_que:'C1d: objetivo do BCE no IHPC, remissão na inflação, sentido da taxa de câmbio e regra da dívida municipal na DGAL.'});
if (process.argv.includes('--escrever')) fs.writeFileSync(ficheiro,JSON.stringify(a,null,2)+'\n');
const esperado=structuredClone(direcao);
const acertos=JSON.parse(fs.readFileSync(new URL('../acertos-c1.json', import.meta.url)));
for(const c of acertos.acertos){let p=esperado[c.id][c.lang];for(const k of c.caminho.slice(0,-1)) p=p[k];assert.equal(p[c.caminho.at(-1)],c.antes);p[c.caminho.at(-1)]=c.depois;}
for(const lang of ['pt','en']) esperado['ihpc-variacao-homologa'][lang]=esperado['ihpc-variacao-homologa'][lang].map(p=>p?.referencia==='unico'?{nl:'2',motivo:'objetivo-institucional'}:p);
assert.deepEqual(LEITURAS_RP1,esperado);
const k17=conferirAuditoriaDasLeituras();
fs.writeFileSync(new URL('origens.json',pasta),JSON.stringify(ORIGENS_C1C,null,2)+'\n');
fs.writeFileSync(new URL('k17.json',pasta),JSON.stringify(k17,null,2)+'\n');
assert.deepEqual(k17.erros,[]);
const seladas=Object.fromEntries([...new Set([...Object.keys(LEITURAS_RP1),...ids])].map(id=>[id,Object.fromEntries(['pt','en'].map(lang=>[lang,textoDaLeitura(leituraDaMedida(id,lang).pedacos,lang)]))]));
fs.writeFileSync(new URL('leituras-seladas.json',pasta),JSON.stringify(seladas,null,2)+'\n');
fs.writeFileSync(new URL('acertos.json',pasta),JSON.stringify({redacao:'quinta',acertos:acertos.acertos,alternativa_ihpc:'O objetivo institucional tem marca própria, com literal de origem e sem veredicto; a régua só admite limiares com veredicto.',diferencas_fora_dos_acertos:0},null,2)+'\n');
console.log('C1d: quinta redação conferida; K17 sem erros.');
const { getClaim, parsePtNumber } = await import('../../../../../src/lib/ledger.mjs');
const nacionais = getClaim('divida-das-familias-2025');
const uniao = getClaim('divida-das-familias-2025-ue');
const ramo = { portugal: nacionais.value, uniao: uniao.value, ramo: parsePtNumber(nacionais.value) > parsePtNumber(uniao.value) ? 'acima' : 'outro', edicoes: {} };
assert.equal(ramo.ramo, 'acima');
for (const lang of ['pt','en']) {
  ramo.edicoes[lang] = textoDaLeitura(leituraDaMedida('divida-das-familias-2025',lang).pedacos,lang);
  assert(ramo.edicoes[lang].includes(lang==='en' ? 'above' : 'acima'));
}
fs.writeFileSync(new URL('ramo-divida.json',pasta),JSON.stringify(ramo,null,2)+'\n');
