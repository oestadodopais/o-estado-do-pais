/** B1: lista fechada em toda a superfície própria do estudo e da lista.
 * O corpo e as marcas dispensadas são conferidos pelos portões de conteúdo.
 * Nenhuma dispensa é feita pelo contentor data-registo-edicao: o índice e
 * qualquer frase acrescentada ao lado do corpo continuam a ser lidos.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse, NodeType } from 'node-html-parser';
import { WORKS, SUBJECTS } from '../src/data/studies.mjs';
import { DOMINIOS } from '../src/data/dominios.mjs';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
import { leituraDe } from '../src/data/leituras.mjs';
import { primeirasFrases } from '../src/lib/estudos-b1.mjs';
import { t } from '../src/i18n/strings.mjs';
const S = { pt: t('pt'), en: t('en') };
import { VERBATIM } from '../src/data/verbatim.mjs';
import { getClaim } from '../src/lib/ledger.mjs';
const normal = s => s.replace(/\s+/g, ' ').trim();
export function verificaB1(raiz) {
  const erros = [];
  const temas = new Set(DOMINIOS.map(d => d.slug));
  for (const w of WORKS) {
    if (!w.tema || !temas.has(w.tema)) erros.push(`B1 tema: ${w.slug} sem tema válido (${w.tema}).`);
    if (w.subject && !SUBJECTS[w.subject]) erros.push(`B1 lugar: ${w.slug} sem lugar declarado.`);
  }
  // A abertura vem dos bytes alojados, além da igualdade rendido/verbatim.
  for (const lang of ['pt', 'en']) {
    const ficheiro = path.join(raiz, 'studies-src/onde-esta-a-agua', `${lang}.html`);
    const fonte = parse(fs.readFileSync(ficheiro, 'utf8')).querySelector('p.standfirst');
    const frase = normal(fonte?.textContent ?? '').match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
    const chave = `estudo-agua-abertura-${lang}`;
    if (frase !== VERBATIM[chave].text || WORKS.find(w => w.slug === 'onde-esta-a-agua').description[lang] !== frase)
      erros.push(`B1 abertura: ${chave} não coincide com a primeira frase da fonte.`);
  }
  let paginas = 0;
  for (const lang of ['pt', 'en']) {
    const base = lang === 'pt' ? 'estudos' : 'en/studies';
    const rotas = [base, ...WORKS.map(w => `${base}/${w.slug}`)];
    for (const rota of rotas) {
      const ficheiro = path.join(raiz, 'dist', rota, 'index.html');
      if (!fs.existsSync(ficheiro)) { erros.push(`B1 superfície: falta ${rota}.`); continue; }
      paginas++;
      const main = parse(fs.readFileSync(ficheiro, 'utf8')).querySelector('main');
      if (!main) { erros.push(`B1 superfície: ${rota} sem main.`); continue; }
      for (const item of main.querySelectorAll('.estudo-item[data-estudo-edicao]')) {
        const edicao = item.getAttribute('data-estudo-edicao').split('/').at(-1);
        const marcas = item.querySelectorAll('.estudo-lingua');
        const esperadas = edicao !== lang ? 1 : 0;
        if (marcas.length !== esperadas || (esperadas && normal(marcas[0]?.textContent ?? '') !== ROTULOS_B1[lang].outraLingua))
          erros.push(`B1 língua: ${rota}: ${item.getAttribute('data-estudo-edicao')} deve ter ${esperadas} marca(s) da língua da edição.`);
      }
      const w = WORKS.find(w => rota === `${base}/${w.slug}`);
      const dados = w ? [w] : WORKS.filter(w => !w.subject);
      const permitidos = new Set([
        ...Object.values(ROTULOS_B1[lang]),
        ...Object.values(SUBJECTS).map(s => s[lang]),
        ...DOMINIOS.map(d => d.nome[lang]),
        ...dados.flatMap(w => [w.description[lang], ...w.editions.map(e => e.title),
          ...primeirasFrases(leituraDe(w.id)?.frase[lang] ?? []).filter(p => typeof p === 'string')]),
        S[lang].estudos.textoSubir, `${S[lang].estudos.textoSubir} ↑`, `${ROTULOS_B1[lang].fontes} →`, '→', '↑', '·',
        /* A porta para o registo inteiro, por baixo de «O que mudou» (B1c). */
        `${ROTULOS_B1[lang].todasAsMudancas} →`,
        `· ${S[lang].marcador.definicao}`,
      ].map(normal));
      const tecnicos = new Set(['textoLinhaK', 'textoValorK', 'textoImpressoK', 'textoOrigemK', 'textoLinhaDoLivro', 'textoRegistoK'].map(k => S[lang].estudos[k]));
      const verificados = '[data-rotulo-ia="topo"], [data-registo-unidade], [data-registo-indice], [data-registo-posicao], [data-registo-linha], [data-claim], .src-chip, [data-prova], [data-verbatim]';
      const dispensados = new Set(main.querySelectorAll(verificados));
      for (const el of main.querySelectorAll('[data-nonledger]')) {
        const motivo = el.getAttribute('data-nonledger');
        if (motivo === 'data-do-repositorio' && el.closest('[data-estudo-edicao]')) dispensados.add(el);
        if (motivo === 'identificador-tecnico' && el.closest('.texto-dobra')) dispensados.add(el);
      }
      for (const el of main.querySelectorAll('.claim-sufixo')) {
        const id = el.parentNode.querySelector('[data-claim]')?.getAttribute('data-claim');
        if (id && normal(el.textContent) === getClaim(id).unit) dispensados.add(el);
        else erros.push(`B1 unidade: ${rota}: unidade sem correspondência na linha ${id}.`);
      }
      const anda = (no, tecnico = false) => {
        if (dispensados.has(no)) return;
        if (no.nodeType === NodeType.TEXT_NODE) {
          const t = normal(no.textContent);
          if (t && !permitidos.has(t) && !(tecnico && (tecnicos.has(t) || tecnicos.has(t.replace(/ →$/, '')))))
            erros.push(`B1 lista fechada: ${rota}: «${t.slice(0, 180)}».`);
          return;
        }
        if (['script', 'style'].includes(no.rawTagName)) return;
        tecnico ||= no.classList?.contains('texto-dobra') ?? false;
        for (const filho of no.childNodes ?? []) anda(filho, tecnico);
      };
      anda(main);
    }
  }
  return { erros, paginas, temas: new Set(WORKS.filter(w => temas.has(w.tema)).map(w => w.tema)).size };
}
