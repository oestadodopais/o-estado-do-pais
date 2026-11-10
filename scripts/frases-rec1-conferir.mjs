import fs from 'node:fs';
import {emEnsaio} from '../site.config.mjs';
const modos = JSON.parse(fs.readFileSync(new URL('./voz-rec1-modos.json', import.meta.url), 'utf8'));
const fechadas = new Set(JSON.parse(fs.readFileSync(new URL('./voz-rec1.json', import.meta.url), 'utf8')));
/** A autorização vem da lista fechada, nunca do ficheiro que fornece a página. */
export function conferirFrasesRec1(ensaio, strings, metodo) {
  const erros = [];
  for (const lang of ['pt', 'en']) {
    const r = strings[lang].correcoes;
    for (const frase of [r.politicaV, r.h1, r.enderecoB.slice(2), ...metodo.mudanca[lang]]) {
      if (modos[frase] !== (emEnsaio() ? 'ensaio' : 'lancado')) erros.push(`REC1 frase do modo errado (${lang}): ${frase}`);
    }
    for (const frase of [...Object.values(ensaio[lang]), r.politicaV, r.h1, r.enderecoB.slice(2), ...metodo.mudanca[lang]]) {
      if (!fechadas.has(frase)) erros.push(`REC1 frase fora da lista fechada (${lang}): ${frase}`);
    }
  }
  return erros;
}
