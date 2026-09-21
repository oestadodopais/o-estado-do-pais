/** A lista fechada do B1 para o país e os temas. Os blocos de dados são
 * comparados antes de saírem da leitura; uma marca sozinha não basta. */
import fs from 'node:fs';
import path from 'node:path';
import { parse, NodeType } from 'node-html-parser';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
import { WORKS, SUBJECTS } from '../src/data/studies.mjs';
import { DOMINIOS } from '../src/data/dominios.mjs';
import { leituraDe } from '../src/data/leituras.mjs';
import { primeirasFrases } from '../src/lib/estudos-b1.mjs';
import { getClaim } from '../src/lib/ledger.mjs';
const normal = s => s.replace(/\s+/g,' ').trim();
const texto = el => {
  const copia = parse(el.outerHTML);
  copia.querySelectorAll('.src-chip, .claim-provisorio').forEach(n=>n.remove());
  return normal(copia.textContent);
};
export function verificaVozPais(raiz) {
  const erros = [];
  for (const lang of ['pt','en']) {
    const v = id => getClaim(id).value;
    const esperada = lang === 'pt'
      ? `A dívida pública desceu de ${v('divida-publica-2024')} % para ${v('divida-publica-2025')} % do PIB num ano e continua acima da média da União Europeia, que é de ${v('divida-publica-2025-ue')} %. O desemprego está nos ${v('taxa-de-desemprego-2025')} %, a par da média europeia, e os preços das casas subiram ${v('precos-da-habitacao-2025')} % num ano, contra ${v('precos-da-habitacao-2025-ue')} % na União.`
      : `Public debt fell from ${v('divida-publica-2024')}% to ${v('divida-publica-2025')}% of GDP in a year and remains above the European Union average of ${v('divida-publica-2025-ue')}%. Unemployment stands at ${v('taxa-de-desemprego-2025')}%, level with the European average, and house prices rose ${v('precos-da-habitacao-2025')}% in a year, against ${v('precos-da-habitacao-2025-ue')}% in the Union.`;
    for (const rota of lang === 'pt' ? ['', 'temas'] : ['en','en/themes']) {
      const main = parse(fs.readFileSync(path.join(raiz,'dist',rota,'index.html'),'utf8')).querySelector('main');
      const leitura = main.querySelector('[data-leitura-pais]');
      if (rota === '' || rota === 'en') {
        if (!leitura || texto(leitura) !== esperada) erros.push(`B1 leitura aprovada: ${rota || '/'} difere do texto da direção.`);
      }
      const dispensados = new Set(main.querySelectorAll('[data-cartao-medida], [data-nome], [data-mapa-raiz], [data-mapa-legenda], [data-mudanca-campo], [data-publicacao-estudo], [data-correcao-entrada], [data-nonledger="data-do-repositorio"]'));
      if (leitura) dispensados.add(leitura);
      for (const resumo of main.querySelectorAll('.estudo-resumo')) {
        const w = WORKS.find(w=>w.slug===resumo.closest('[data-estudo]')?.getAttribute('data-estudo'));
        const partes = w && primeirasFrases(leituraDe(w.id)?.frase[lang] ?? [w.description[lang]]);
        const esperado = partes?.map(p=>typeof p==='string' ? p : p.claim ? v(p.claim)+(p.sufixo ?? (getClaim(p.claim).unit === '%' ? '%' : '')) : p.ref ?? '').join('');
        if (!esperado || texto(resumo) !== normal(esperado)) erros.push(`B1 sinopse: ${w?.slug} difere das duas primeiras frases.`);
        dispensados.add(resumo);
      }
      const permitidos = new Set([
        ...Object.values(ROTULOS_B1[lang]), ...Object.values(SUBJECTS).map(s=>s[lang]),
        ...DOMINIOS.map(d=>d.nome[lang]), ...WORKS.flatMap(w=>w.editions.map(e=>e.title)),
        '·','→',
      ].map(normal));
      function anda(n) {
        if (dispensados.has(n)) return;
        if (n.nodeType===NodeType.TEXT_NODE) {
          const t=normal(n.textContent);
          if(t && !permitidos.has(t)) erros.push(`B1 lista fechada país: ${rota || '/'}: «${t}».`);
          return;
        }
        if(['script','style'].includes(n.rawTagName))return;
        for(const f of n.childNodes ?? [])anda(f);
      }
      anda(main);
    }
  }
  return erros;
}
