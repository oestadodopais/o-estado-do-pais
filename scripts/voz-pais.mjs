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
import { POR_VERIFICAR } from '../src/data/marcador.mjs';
import { verificaVeredictoDoPais } from './pais-veredicto.mjs';
import { verificaCartaoDasCamaras } from './pais-camaras.mjs';
const normal = s => s.replace(/\s+/g,' ').trim();
const texto = el => {
  const copia = parse(el.outerHTML);
  copia.querySelectorAll('.src-chip, .claim-provisorio').forEach(n=>n.remove());
  return normal(copia.textContent);
};
/* A SINOPSE DE UM ESTUDO, CONFERIDA INTEIRA, NUM SÍTIO SÓ (bloco R1, 23.09.2026).
   A primeira página já a conferia assim; a lista dos estudos passou a ter os
   estudos de um lugar, cujas leituras trazem sufixos da leitura («€») e
   referências («2021–2025»), e confere-os pela mesma conta (`voz-b1.mjs`). */
export const textoSemSelos = texto;
/** @param {any} w @param {'pt'|'en'} lang */
export function sinopseEsperada(w, lang) {
  const partes = primeirasFrases(leituraDe(w.id)?.frase[lang] ?? [w.description[lang]]);
  return normal(partes.map(p=>typeof p==='string' ? p : p.claim ? getClaim(p.claim).value+(p.sufixo ?? (getClaim(p.claim).unit === '%' ? '%' : '')) : p.ref ?? '').join(''));
}
export function verificaVozPais(raiz) {
  const erros = [];
  for (const lang of ['pt','en']) {
    const v = id => getClaim(id).value;
    /* A frase da dívida com as duas leituras oficiais (bloco R1, 23.09.2026): a
       data da notificação do INE é o `published_at` da linha, na forma da casa,
       e o ano entre parênteses é o `reference_date` da linha de 2024. */
    const ine = getClaim('divida-publica-2025-notificacao-ine-2026-09');
    const quando = String(ine.published_at).split('-').reverse().join('.');
    const ano = getClaim('divida-publica-2024-notificacao-ine-2026-09').reference_date;
    const esperada = lang === 'pt'
      ? `A dívida pública desceu de ${v('divida-publica-2024')} % para ${v('divida-publica-2025')} % do PIB num ano, pela notificação de abril publicada pelo Eurostat, e a segunda notificação do INE, de ${quando} e ainda provisória, revê-a para ${v('divida-publica-2025-notificacao-ine-2026-09')} % (${v('divida-publica-2024-notificacao-ine-2026-09')} % em ${ano}); continua acima da média da União Europeia, que é de ${v('divida-publica-2025-ue')} %. O desemprego está nos ${v('taxa-de-desemprego-2025')} %, a par da média europeia, e os preços das casas subiram ${v('precos-da-habitacao-2025')} % num ano, contra ${v('precos-da-habitacao-2025-ue')} % na União.`
      : `Public debt fell from ${v('divida-publica-2024')}% to ${v('divida-publica-2025')}% of GDP in a year, by the April notification published by Eurostat, and the INE’s second notification of ${quando}, still provisional, revises it to ${v('divida-publica-2025-notificacao-ine-2026-09')}% (${v('divida-publica-2024-notificacao-ine-2026-09')}% in ${ano}); it remains above the European Union average of ${v('divida-publica-2025-ue')}%. Unemployment stands at ${v('taxa-de-desemprego-2025')}%, level with the European average, and house prices rose ${v('precos-da-habitacao-2025')}% in a year, against ${v('precos-da-habitacao-2025-ue')}% in the Union.`;
    for (const rota of lang === 'pt' ? ['', 'temas'] : ['en','en/themes']) {
      const main = parse(fs.readFileSync(path.join(raiz,'dist',rota,'index.html'),'utf8')).querySelector('main');
      const leitura = main.querySelector('[data-leitura-pais]');
      erros.push(...verificaCartaoDasCamaras(main.parentNode, lang));
      if (rota === '' || rota === 'en') {
        if (!leitura || texto(leitura) !== esperada) erros.push(`B1 leitura aprovada: ${rota || '/'} difere do texto da direção.`);
        const indice = parse(fs.readFileSync(path.join(raiz, 'dist', lang === 'pt' ? 'temas' : 'en/themes', 'index.html'), 'utf8'));
        erros.push(...verificaVeredictoDoPais(main.parentNode, indice, lang));
      }
      /* O rótulo de IA do topo (bloco R1, 23.09.2026) é texto aprovado, que o
         `gate:html` compara carácter a carácter com o oráculo; não é prosa da
         lista fechada destas páginas. */
      const dispensados = new Set(main.querySelectorAll('[data-rotulo-ia="topo"], [data-cartao-medida], [data-nome], [data-mapa-raiz], [data-mapa-legenda], [data-mudanca-campo], [data-publicacao-estudo], [data-correcao-entrada], [data-nonledger="data-do-repositorio"]'));
      if (leitura) dispensados.add(leitura);
      for (const c of main.querySelectorAll('[data-cartao-camaras]')) dispensados.add(c);
      /* A marca só sai da lista depois de a V1 conferir a frase inteira. */
      if (rota === '' || rota === 'en') for (const v of main.querySelectorAll('[data-veredicto-pais]')) dispensados.add(v);
      for (const resumo of main.querySelectorAll('.estudo-resumo')) {
        const w = WORKS.find(w=>w.slug===resumo.closest('[data-estudo]')?.getAttribute('data-estudo'));
        const esperado = w && sinopseEsperada(w, lang);
        if (!esperado || texto(resumo) !== esperado) erros.push(`B1 sinopse: ${w?.slug} difere das duas primeiras frases.`);
        dispensados.add(resumo);
      }
      const permitidos = new Set([
        /* Só os rótulos destas páginas. O olho dos lugares continua declarado,
           mas não pode voltar à página do país. */
        ...['pais', 'temas', 'estudosRecentes', 'mudou', 'publicado', 'estudoPublicado',
          'outraLingua', 'todasAsMedidasA', 'todasAsMedidasB', 'todasAsMudancas'].map(k=>ROTULOS_B1[lang][k]),
        /* A porta para o registo inteiro (B1c, 22.09.2026): o rótulo e a seta
           saem no mesmo nó de texto, e é assim que a lista fechada o vê. */
        `${ROTULOS_B1[lang].todasAsMudancas} →`,
        ...Object.values(SUBJECTS).map(s=>s[lang]),
        ...DOMINIOS.map(d=>d.nome[lang]), ...WORKS.flatMap(w=>w.editions.map(e=>e.title)),
        /* O marcador único do sítio, pela mesma razão do `voz-b1.mjs`: é uma
           cadeia declarada e não prosa da casa. */
        POR_VERIFICAR,
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
