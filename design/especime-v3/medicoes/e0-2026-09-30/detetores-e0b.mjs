/** E0b: os detetores usados pelas medidas e pelos seus conhecidos-positivos. */
import fs from 'node:fs';
import { contagensDoRegisto } from '../../../../src/lib/ledger.mjs';
export const recontarCorrecoes = livros => contagensDoRegisto(livros).correcoes_publicadas;
export function conferirPrefixosDaHistoria(antes, depois) {
  return Object.entries(antes).flatMap(([id, entradas]) =>
    JSON.stringify(depois[id]?.slice(0, entradas.length)) === JSON.stringify(entradas) ? []
      : [`história anterior: ${id} perdeu ou alterou uma entrada selada.`]);
}
export const decimalDoExcerto = (texto) => /2025:\s*(\d+\.\d+)\b/.exec(texto ?? '')?.[1] ?? null;
export const anatomiaDoDiff = (texto) => texto.split('\n').filter(p => /^(src\/components|src\/views|src\/styles)\//.test(p));
export function lerCodigoDaCorrida(ficheiro, inicio, fim) {
  if (!fs.existsSync(ficheiro)) return { medido: false, codigo: null, motivo: 'ficheiro ausente' };
  const escrito = fs.statSync(ficheiro).mtimeMs;
  const texto = fs.readFileSync(ficheiro, 'utf8').trim();
  const codigo = Number(texto);
  const medido = /^(0|[1-9]\d*)$/.test(texto) && codigo <= 255 && escrito >= inicio && escrito <= fim;
  return { medido, codigo: medido ? codigo : null, motivo: medido ? 'escrito nesta corrida' : 'fora da corrida' };
}
