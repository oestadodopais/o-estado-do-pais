/** A reconferência pertence à leitura em vigor no seu dia, não à mais recente. */
/**
 * @param {{corrections?: unknown, access_date?: unknown, source_url?: unknown}} linha
 * @param {'access_date' | 'source_url'} campo
 * @param {string} onde
 * @param {string[]} erros
 */
export function historiaDaProveniencia(linha, campo, onde, erros) {
  const entradas = (Array.isArray(linha.corrections) ? linha.corrections : [])
    .filter((c) => c && c.kind === 'proveniencia' && c.field === campo)
    .slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const forma = campo === 'access_date' ? /^\d{4}-\d{2}-\d{2}$/ : /^https?:\/\//;
  let anterior = entradas.length ? entradas[0].old_value : linha[campo];
  for (const c of entradas) {
    const rot = `${onde} história de "${campo}" a ${c.date}`;
    if (typeof c.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(c.date) ||
        ![c.old_value, c.new_value].every((v) => typeof v === 'string' && forma.test(v))) {
      erros.push(`${rot}: data ou valores inválidos; a história não prova o campo em vigor.`);
    }
    if (c.old_value !== anterior) {
      erros.push(`${rot}: cadeia contraditória; "old_value" é ${c.old_value}, mas antes vigorava ${anterior}.`);
    }
    if (campo === 'access_date' && (c.old_value > c.date || c.new_value > c.date)) {
      erros.push(`${rot}: o acesso não pode ser posterior à mudança que o declara.`);
    }
    anterior = c.new_value;
  }
  if (entradas.length && anterior !== linha[campo]) {
    erros.push(`${onde} história de "${campo}": o último "new_value" é ${anterior}, mas a linha declara ${linha[campo]}.`);
  }
  return {
    /** @param {string} dia */
    em(dia) {
      let valor = entradas.length ? entradas[0].old_value : linha[campo];
      for (const c of entradas) if (String(c.date) <= dia) valor = c.new_value;
      return String(valor ?? '');
    },
    /** O levantamento do C1c encontrou pedidos diferentes sem história tipada.
     * A nova regra do endereço prende apenas as releituras anteriores a uma
     * mudança declarada, como manda a decisão de 28.09.2026.
     * @param {string} dia */
    temMudancaPosterior(dia) { return entradas.some((c) => String(c.date) > dia); },
  };
}
