/** REL1: uma frequência no rótulo tem de ser sustentada pelos dias observados. */
const PALAVRA_DE_FREQUENCIA = /(?<![\p{L}\p{N}_])(?:diári[oa]s?|semana(?:l|is)|mensa(?:l|is)|anua(?:l|is)|daily|weekly|monthly|yearly|annual)(?![\p{L}\p{N}_])/iu;
const MILISSEGUNDOS_POR_DIA = 86400000;

function instanteDoDia(dia) {
  if (typeof dia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dia)) return NaN;
  const instante = Date.parse(`${dia}T00:00:00Z`);
  return Number.isFinite(instante) && new Date(instante).toISOString().slice(0, 10) === dia ? instante : NaN;
}

export function conferirFrequencias({rotulos, frequencias, linhas, construidoEm}) {
  const erros = [];
  const diaDaConstrucao = typeof construidoEm === 'string' ? construidoEm.slice(0, 10) : '';
  const construcao = instanteDoDia(diaDaConstrucao);
  if (!Number.isFinite(construcao)) erros.push('REL1: construido_em ausente ou inválido em dist/version.json.');
  for (const [lingua, autores] of Object.entries(rotulos)) {
    for (const [autor, rotulo] of Object.entries(autores)) {
      if (PALAVRA_DE_FREQUENCIA.test(rotulo) && !Object.hasOwn(frequencias, autor))
        erros.push(`REL1: ${autor} (${lingua}), rótulo «${rotulo}» nomeia uma frequência sem período declarado.`);
    }
  }
  for (const [autor, periodo] of Object.entries(frequencias)) {
    const rotulo = Object.entries(rotulos).map(([lingua, autores]) => `${lingua}: «${autores[autor] ?? '[ausente]'}»`).join('; ');
    if (!Number.isInteger(periodo) || periodo <= 0) {
      erros.push(`REL1: ${autor}, período inválido; ${rotulo}.`);
      continue;
    }
    const dias = [...new Set(linhas.flatMap(linha => (linha.verifications ?? [])
      .filter(entrada => entrada.by === autor).map(entrada => entrada.date)))].sort();
    if (!dias.length || dias.some(dia => !Number.isFinite(instanteDoDia(dia)))) {
      erros.push(`REL1: ${autor}, dias observados ausentes ou inválidos; ${rotulo}.`);
      continue;
    }
    const intervalos = dias.slice(1).map((dia, i) => [dias[i], dia]);
    if (Number.isFinite(construcao)) intervalos.push([dias.at(-1), diaDaConstrucao]);
    for (const [de, ate] of intervalos) {
      const intervalo = (instanteDoDia(ate) - instanteDoDia(de)) / MILISSEGUNDOS_POR_DIA;
      if (intervalo > 2 * periodo || intervalo < 0)
        erros.push(`REL1: ${autor}, ${de} a ${ate}: ${intervalo} dias, limite ${2 * periodo}; ${rotulo}.`);
    }
  }
  return erros;
}
