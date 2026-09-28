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
import { conferirBlocosDaPagina, idsDosBlocos } from '../tests/inicio/blocos.mjs';
import { ENTRADAS } from '../src/data/primeira-pagina.mjs';
import { t } from '../src/i18n/strings.mjs';
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
    /* A LEITURA APROVADA SAIU COM O BLOCO PP1 (28.09.2026): a primeira página deixou de ter a frase
       do lugar de direção com nove valores presos, e os blocos de «O que se passa» dizem o que ela dizia,
       com condições. O que a comparação da frase inteira protegia passa aos blocos, que só saem desta
       lista depois de a célula da primeira página os conferir, logo abaixo. */
    const s = t(lang);
    for (const rota of lang === 'pt' ? ['', 'temas'] : ['en','en/themes']) {
      const main = parse(fs.readFileSync(path.join(raiz,'dist',rota,'index.html'),'utf8')).querySelector('main');
      const primeira = rota === '' || rota === 'en';
      /* O cartão das câmaras vive na página dos temas; a primeira página deixou de render os cartões. */
      if (!primeira) erros.push(...verificaCartaoDasCamaras(main.parentNode, lang));
      /* OS BLOCOS SÓ SAEM DA LISTA CONFERIDOS NA MESMA CORRIDA (bloco PP1): a célula da primeira página
         reconta o texto, os ramos e as linhas de cada bloco; se ela recusar, os blocos ficam na lista
         fechada e a prosa deles é medida como qualquer outra. */
      const blocosConferidos = primeira && conferirBlocosDaPagina(main.parentNode, lang, rota || '/', { ids: idsDosBlocos(), primeira: true }).erros.length === 0;
      if (primeira) {
        const indice = parse(fs.readFileSync(path.join(raiz, 'dist', lang === 'pt' ? 'temas' : 'en/themes', 'index.html'), 'utf8'));
        erros.push(...verificaVeredictoDoPais(main.parentNode, indice, lang));
      }
      /* O rótulo de IA do topo (bloco R1, 23.09.2026) é texto aprovado, que o
         `gate:html` compara carácter a carácter com o oráculo; não é prosa da
         lista fechada destas páginas. */
      const dispensados = new Set(main.querySelectorAll('[data-rotulo-ia="topo"], [data-cartao-medida], [data-nome], [data-mapa-raiz], [data-mapa-legenda], [data-mudanca-campo], [data-publicacao-estudo], [data-correcao-entrada], [data-nonledger="data-do-repositorio"], [data-pesquisa-lista], [data-nonledger="data-da-linha"]'));
      if (blocosConferidos) for (const b of main.querySelectorAll('[data-bloco]')) dispensados.add(b);
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
        /* A mobília da primeira página nova (bloco PP1): as cadeias declaradas em `strings.mjs`, as seis
           entradas das declarações do lugar de direção, a pesquisa dos lugares, e as três portas. */
        s.primeira.oQueSePassa, s.primeira.numerosMaisRecentes, s.primeira.porOndeComecar, s.primeira.veredicto,
        `${s.primeira.todosOsTemas} →`, `${s.nav.livro} →`, `${ROTULOS_B1[lang].mudou} →`, `${s.nav.uniaoEuropeia} →`,
        ROTULOS_B1[lang].lugares, s.ambito.municipio, s.ambito.pesquisaSubmeter, s.ambito.pesquisaSemResultado,
        ...ENTRADAS.flatMap(e => [e.nome[lang], e.linha[lang]]),
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
