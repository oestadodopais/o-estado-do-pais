/** A reconferência pertence à leitura em vigor no seu dia, não à mais recente. */
/** Um instantâneo datado pode voltar a apontar para o mesmo conjunto estável.
 * O registo descreve o ficheiro lido, sem mudar o endereço em vigor.
 * @param {any} c @param {unknown} anterior @param {any} linha */
function eInstantaneoDoMesmoConjunto(c, anterior, linha) {
  if (c.new_value !== anterior || linha.document?.kind !== 'ficheiro' || !linha.document?.computed_over?.files?.length) return false;
  const recurso = /^https:\/\/dados\.gov\.pt\/s\/resources\/([^/]+)\/(\d{8})-[^/]+\/([^/]+)$/.exec(String(c.old_value));
  const conjunto = /^https:\/\/dados\.gov\.pt\/datasets\/([^/?#]+)$/.exec(String(c.new_value));
  if (!recurso || !conjunto || recurso[1] !== conjunto[1]) return false;
  const dia = recurso[2].replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
  return dia <= c.date && recurso[3].includes(recurso[2]) &&
    String(c.reason).includes(c.old_value) && String(c.reason_en).includes(c.old_value);
}

/**
 * @param {{corrections?: unknown, access_date?: unknown, source_url?: unknown, document?: unknown}} linha
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
  const instantaneos = [];
  for (const c of entradas) {
    const rot = `${onde} história de "${campo}" a ${c.date}`;
    if (typeof c.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(c.date) ||
        ![c.old_value, c.new_value].every((v) => typeof v === 'string' && forma.test(v))) {
      erros.push(`${rot}: data ou valores inválidos; a história não prova o campo em vigor.`);
    }
    const instantaneo = campo === 'source_url' && eInstantaneoDoMesmoConjunto(c, anterior, linha);
    if (instantaneo) instantaneos.push(c);
    if (c.old_value !== anterior && !instantaneo) {
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
    instantaneos,
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
    temMudancaPosterior(dia) { return entradas.some((c) => !instantaneos.includes(c) && String(c.date) > dia); },
  };
}
