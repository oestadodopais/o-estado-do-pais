/** A lista fechada do B1 para o país e os temas. Os blocos de dados são
 * comparados antes de saírem da leitura; uma marca sozinha não basta. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
import { WORKS, SUBJECTS } from '../src/data/studies.mjs';
import { DOMINIOS } from '../src/data/dominios.mjs';
import { leituraDe } from '../src/data/leituras.mjs';
import { primeirasFrases } from '../src/lib/estudos-b1.mjs';
import { getClaim } from '../src/lib/ledger.mjs';
import { POR_VERIFICAR } from '../src/data/marcador.mjs';
import { verificaVeredictoDoPais } from './pais-veredicto.mjs';
import { conferirBlocosDaPagina, idsDosBlocos } from '../tests/inicio/blocos.mjs';
import { documentoDosAssuntos } from '../tests/inicio/paginas-dos-assuntos.mjs';
import { linhaDoIndice } from '../src/lib/assuntos.mjs';
import { ENTRADAS } from '../src/data/primeira-pagina.mjs';
import { t } from '../src/i18n/strings.mjs';
import { conferirTituloNumaPorta } from '../tests/explicacoes/explicacao.mjs';
import { conferirPortaDaSemana, diasAceites } from '../tests/explicacoes/semana.mjs';
const normal = s => s.replace(/\s+/g,' ').trim();
/* A MENÇÃO DA FONTE DO SINAL DA PORTA DOS LUGARES (bloco L2a, 01.10.2026), lida
   do manifesto do motor por este leitor e não pelo módulo que a página usa. */
const FONTE_DA_CARTA = (() => {
  const f = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'mapa', 'manifest.json'), 'utf8')).fonte;
  return normal(`${f.atribuicao} · ${f.carta} · ${f.licenca}`);
})();
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
  /* K2 (02.10.2026, item 5 do brief): o «%» que a ficha acrescenta a uma linha em percentagem leva o espaço antes dele,
     como em todos os valores do sítio (`src/lib/estudos-b1.mjs`); esta é a cópia da regra, e compara carácter a carácter. */
  return normal(partes.map(p=>typeof p==='string' ? p : p.claim ? getClaim(p.claim).value+(p.sufixo ?? (getClaim(p.claim).unit === '%' ? ' %' : '')) : p.ref ?? '').join(''));
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
      /* N1: o cartão das câmaras vive nos lugares e é conferido pela V2 e pela K17. */

      /* OS BLOCOS SÓ SAEM DA LISTA CONFERIDOS NA MESMA CORRIDA (bloco PP1): a célula da primeira página
         reconta o texto, os ramos e as linhas de cada bloco; se ela recusar, os blocos ficam na lista
         fechada e a prosa deles é medida como qualquer outra. */
      const blocosConferidos = primeira && conferirBlocosDaPagina(main.parentNode, lang, rota || '/', { ids: idsDosBlocos(), primeira: true }).erros.length === 0;
      if (primeira) {
        const indice = documentoDosAssuntos(path.join(raiz, 'dist'), lang);
        erros.push(...verificaVeredictoDoPais(main.parentNode, indice, lang));
      }
      /* O rótulo de IA do topo (bloco R1, 23.09.2026) é texto aprovado, que o
         `gate:html` compara carácter a carácter com o oráculo; não é prosa da
         lista fechada destas páginas. */
      /* O MAPA, A SUA LEGENDA E A FILA DA PESQUISA SAÍRAM DAQUI (bloco L2a, 01.10.2026; §1.149): vivem
         em «Lugares», e as suas marcas deixaram de ser dispensas nestas páginas. Entra a menção da fonte do
         sinal da porta dos lugares, e só quando o texto é, carácter a carácter, o do manifesto. */
      const dispensados = new Set(main.querySelectorAll('[data-rotulo-ia="topo"], [data-cartao-medida], [data-nome], [data-mudanca-campo], [data-publicacao-estudo], [data-correcao-entrada], [data-nonledger="data-do-repositorio"], [data-nonledger="data-da-linha"]'));
      for (const m of main.querySelectorAll('[data-fonte-do-sinal]')) if (texto(m) === FONTE_DA_CARTA) dispensados.add(m);
      if (blocosConferidos) for (const b of main.querySelectorAll('[data-bloco]')) dispensados.add(b);
      /* «PARA PERCEBER» (bloco EX1, 05.10.2026): o título é a cadeia da casa, na lista abaixo; as duas portas (o título da
         explicação mais recente e a primeira frase da leitura da semana) só saem da lista conferidas pelas células da
         explicação e da semana, na mesma corrida; uma recusa fica escrita, e a prosa delas é medida como qualquer outra. */
      if (primeira) for (const pp of main.querySelectorAll('[data-para-perceber]')) {
        const portas = [...pp.querySelectorAll('[data-explicacao-porta]'), ...pp.querySelectorAll('[data-semana-frase]')];
        const queixas = portas.flatMap((el) => el.hasAttribute('data-explicacao-porta')
          ? conferirTituloNumaPorta(el, lang)
          : conferirPortaDaSemana(el, lang, diasAceites(path.join(raiz, 'dist'))));
        if (queixas.length) erros.push(...queixas.map((q) => `B1 lista fechada país: ${rota || '/'}: «Para perceber» não conferido: ${q}`));
        else for (const el of portas) dispensados.add(el);
      }
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
        /* A mobília da primeira página nova (bloco PP1): as cadeias declaradas em `strings.mjs`, as
           entradas das declarações do lugar de direção, e as três portas. As três cadeias da pesquisa
           dos lugares saíram com ela (L2a): a pesquisa vive em «Lugares», e aqui seria uma segunda cópia. */
        s.primeira.oQueSePassa, s.primeira.numerosMaisRecentes, s.primeira.porOndeComecar, s.primeira.veredicto,
        /* O título do bloco «Para perceber» (bloco EX1, 05.10.2026). */
        s.primeira.paraPerceber,
        ...WORKS.filter(w=>w.emCurso).map(w=>s.primeira.emCurso.replace('{ano}', w.emCurso.ate?.slice(0, 4) ?? '[verify]')),
        `${s.primeira.todosOsTemas} →`, `${s.nav.livro} →`, `${ROTULOS_B1[lang].mudou} →`, `${s.nav.uniaoEuropeia} →`,
        ROTULOS_B1[lang].lugares,
        ...ENTRADAS.flatMap(e => [e.nome[lang], e.linha[lang], linhaDoIndice(e, lang), ...e.seccoes.map(s => s.nome[lang])]),
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
