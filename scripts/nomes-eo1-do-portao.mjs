import { NOMES_EO1 } from '../src/data/nomes-eo1.mjs';

/** O nome é o da edição e os seus algarismos têm de existir na linha de origem. */
export function conferirNomeEo1(id, lang, texto, rows) {
  const esperado = NOMES_EO1[id]?.[lang], row = rows?.[id];
  if (!esperado || !row || texto !== esperado) return 'nome diferente da linha e da edição';
  const campos = [row.measure, row.measure_en, row.value, row.period, row.excerpt,
    row.document?.title, row.document?.locator].filter(v => v != null).join(' ');
  const numeros = s => String(s).match(/\d+(?:[.,]\d+)?/g) ?? [];
  const apoios = new Set(numeros(campos).map(n => n.replace(',', '.')));
  if (numeros(texto).some(n => !apoios.has(n.replace(',', '.'))))
    return 'algarismo do nome sem apoio na linha';
  return null;
}
