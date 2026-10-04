/** H2: a linha do lugar, tema, data e estado recomposta pelas declarações.
 * A voz só a classifica como composição conferida se TODAS as palavras e a
 * estrutura forem estas. O estado depende da ficha: não é uma linha «viva»
 * obrigatória quando já não há estudos em curso. Não importa o resolvedor. */
import fs from 'node:fs';
import { WORKS, SUBJECTS } from '../src/data/studies.mjs';
import { DOMINIOS } from '../src/data/dominios.mjs';
import { ROTULOS_B1 } from '../src/data/rotulos-b1.mjs';
const datas = JSON.parse(fs.readFileSync(new URL('../src/data/datas-de-publicacao.json', import.meta.url), 'utf8')).edicoes;
const norm = s => (s ?? '').replace(/\s+/g, ' ').trim();
export function metaDoEstudoConferida(el, lang, works = WORKS) {
  const artigo = el?.closest('#trabalhos [data-estudo]');
  const w = works.find(w => w.slug === artigo?.getAttribute('data-estudo'));
  if (!w || !['pt', 'en'].includes(lang)) return false;
  const e = w.editions.find(e => e.lang === lang) ?? w.editions[0];
  const data = datas.find(d => d.slug === w.slug && d.lang === e.lang)?.data;
  const tema = DOMINIOS.find(d => d.slug === w.tema)?.nome[lang];
  if (!data || !tema) return false;
  const spans = el.children;
  const esperado = [w.subject ? SUBJECTS[w.subject]?.[lang] : 'Portugal', tema,
    `${ROTULOS_B1[lang].publicado} ${data.split('-').reverse().join('.')}`,
    ...(w.emCurso ? [`${lang === 'pt' ? 'em curso até' : 'ongoing until'} ${w.emCurso.ate?.slice(0, 4)}`] : [])];
  const time = spans[2]?.querySelectorAll('time') ?? [];
  return spans.length === esperado.length && spans.every((s, i) => s.rawTagName === 'span' && norm(s.textContent) === esperado[i])
    && norm(el.textContent) === norm(spans.map(s => s.textContent).join(''))
    && time.length === 1 && time[0].getAttribute('datetime') === data
    && el.querySelectorAll('[data-estudo-em-curso]').length === (w.emCurso ? 1 : 0)
    && (!w.emCurso || spans[3].hasAttribute('data-estudo-em-curso'));
}
