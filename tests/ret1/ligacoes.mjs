import assert from 'node:assert/strict';
import { WORKS } from '../../src/data/studies.mjs';
import { areasComPecas } from '../../src/lib/areas.mjs';
import { todasAsMudancas } from '../../src/lib/mudancas.mjs';
import { conferirLigacoesRetiradas } from '../../scripts/estudos-retirados-conferir.mjs';
const retirados = WORKS.filter(w=>w.estado==='retirado');
for(const a of areasComPecas()) assert(a.pecas.trabalhos.every(p=>!retirados.some(w=>w.slug===p.slug)));
for(const lang of ['pt','en']) {
  const mudancas = todasAsMudancas(lang);
  assert(mudancas.some(m=>m.tipo==='texto'));
  assert(mudancas.filter(m=>m.tipo==='texto').every(m=>!retirados.some(w=>w.slug===m.slug)));
  for(const w of retirados) for(const pagina of ['/', '/estudos/', '/areas/ambiente-e-energia/', '/municipios/evora/', '/regioes/alentejo/', '/novidades/', '/agenda/', '/leituras/', '/correcoes/']) {
    const rota=lang==='pt'?`/estudos/${w.slug}/`:`/en/studies/${w.slug}/`;
    assert(conferirLigacoesRetiradas(WORKS,pagina,`<a href="${rota}">Título</a>`).length);
    assert(conferirLigacoesRetiradas(WORKS,'/sitemap.xml',`<url><loc>https://oestadodopais.pt${rota}</loc></url>`).length);
  }
}
console.log('RET1: áreas e correções de texto sem retirados; ligações plantadas para cada retirado recusadas nas duas línguas e no mapa.');
