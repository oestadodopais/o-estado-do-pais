/** REL1: uma frequência no rótulo tem de ser sustentada pelos dias observados. */
const PALAVRAS_POR_PERIODO = [
  [1, 'diari[oa]s?|diariamente|todos os dias|cada dia|dail(?:y|ies)|every day|each day'],
  [7, 'semana(?:l|is)|semanalmente|todas as semanas|weekl(?:y|ies)|every week'],
  [14, 'quinzena(?:l|is)|fortnightl(?:y|ies)|bi-?weekl(?:y|ies)'],
  [30, 'mensa(?:l|is)|monthl(?:y|ies)'],
  [91, 'trimestra(?:l|is)|quarterl(?:y|ies)'],
  [182, 'semestra(?:l|is)'],
  [365, 'anua(?:l|is)|yearl(?:y|ies)|annuals?|annually'],
];
const FREQUENCIAS = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${PALAVRAS_POR_PERIODO
  .map(([periodo, palavras]) => `(?<p${periodo}>${palavras})`).join('|')})(?![\\p{L}\\p{N}_])`, 'gu');

function periodosDoRotulo(rotulo) {
  const normalizado = rotulo.normalize('NFC').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  // Uma expressão inteira consome bi-weekly antes de poder ler weekly outra vez.
  return [...new Set([...normalizado.matchAll(FREQUENCIAS)].map(m =>
    Number(Object.keys(m.groups).find(chave => m.groups[chave]).slice(1))))];
}
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
      const periodos = periodosDoRotulo(rotulo);
      if (periodos.length && !Object.hasOwn(frequencias, autor))
        erros.push(`REL1: ${autor} (${lingua}), rótulo «${rotulo}» nomeia uma frequência sem período declarado.`);
      else for (const periodo of periodos) {
        if (periodo !== frequencias[autor])
          erros.push(`REL1: ${autor} (${lingua}), rótulo «${rotulo}» diz período ${periodo}, mas o declarado é ${frequencias[autor]}.`);
      }
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
    // Só o extremo mais recente do par decide se a falha ainda está na janela.
    // O intervalo até à construção fica sempre sujeito ao mesmo limite.
    const inicioDaJanela = construcao - 4 * periodo * MILISSEGUNDOS_POR_DIA;
    const intervalos = dias.slice(1).flatMap((dia, i) =>
      instanteDoDia(dia) >= inicioDaJanela ? [[dias[i], dia]] : []);
    if (Number.isFinite(construcao)) intervalos.push([dias.at(-1), diaDaConstrucao]);
    for (const [de, ate] of intervalos) {
      const intervalo = (instanteDoDia(ate) - instanteDoDia(de)) / MILISSEGUNDOS_POR_DIA;
      if (intervalo > 2 * periodo || intervalo < 0)
        erros.push(`REL1: ${autor}, ${de} a ${ate}: ${intervalo} dias, limite ${2 * periodo}; ${rotulo}.`);
    }
  }
  return erros;
}
