import { TITULOS_DA_LEITURA } from '../data/rotulos-b1.mjs';
/** A abertura é o primeiro título de secção, em qualquer estudo. */
/** @param {{blocks: {i: number, kind: string, level?: number|string, text: string}[]}|null} registo @param {'pt'|'en'} lang */
export function aberturaDoEstudo(registo, lang) {
  const titulos = TITULOS_DA_LEITURA[lang];
  const primeiro = registo?.blocks.find(b => b.i > 0 && b.kind === 'heading' && Number(b.level) === 2);
  return { titulos, primeiro, temAbertura: primeiro?.text === titulos[0] };
}
