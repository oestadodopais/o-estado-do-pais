/** Leitor dos cartões construídos nas páginas de assunto, para as células existentes. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { ENTRADAS } from '../../src/data/primeira-pagina.mjs';
export function documentoDosAssuntos(dist, lang) {
  return parse('<main>' + ENTRADAS.filter((e) => !e.existente).map((e) => {
    const root = parse(fs.readFileSync(path.join(dist, e.rota[lang], 'index.html'), 'utf8'));
    return `<div data-pagina-assunto="${e.rota[lang]}">${root.querySelector('main').innerHTML}</div>`;
  }).join('') + '</main>');
}
