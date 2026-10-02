/**
 * ===========================================================================
 * AS CASAS DECIMAIS DO EXCERTO · uma linha sem derivação não escreve menos casas decimais do que a fonte (bloco K2,
 * 02.10.2026, item 6 do brief `design/observatorio/BRIEF-K2-o-cartao-para-o-telemovel.md`)
 * ===========================================================================
 *
 * PORQUE EXISTE. As linhas do desemprego de Portugal escreviam «6» onde o excerto da fonte escreve «6.0» (corrigidas
 * pelo E0, §1.144 e §1.147), e a mesma classe vivia em mais duas: os jovens que não trabalham nem estudam («8» contra
 * «8.0») e o fluxo de crédito às empresas («3» contra «3.0»), corrigidas pelo K2 pelo mesmo mecanismo. A §1.127
 * (decisão 3) diz que a precisão é a da fonte e não se toca; nenhuma célula o conferia, e a primeira página chegou a
 * mostrar «6 %» ao lado de «6,0 %». Esta célula fecha a construção quando volta a acontecer.
 *
 * O QUE CONFERE, sobre as linhas sem derivação (uma linha derivada é uma conta da casa, e a sua precisão é a da
 * derivação, que o `check` reavalia): o valor da linha compara-se com O LITERAL DO EXCERTO QUE É O PRÓPRIO NÚMERO, e só
 * com ele. É o que vem depois dos dois pontos no fim do excerto, e mais nada: a forma em que o motor compõe os excertos
 * das etiquetas da resposta da fonte («… — Portugal — 2025: 8.0», com a marca da fonte opcional, «2.1 p»). Tem de ser o
 * mesmo número com as mesmas casas: menos casas, mais casas ou outro número fecham a construção. Lê a forma inglesa,
 * com os milhares agrupados por vírgulas («1,422.40»), e a simples («8.0»).
 *
 * O CAMPO «valor» DAS RESPOSTAS DO INE NÃO É ESSE LITERAL, e fica de fora de propósito: o INE escreve o número duas
 * vezes, «"ind_string" : "86,60"» (a forma que publica, com as suas casas) e «"valor" : "86.6"» (o número da máquina,
 * sem os zeros do fim), e ler o último como o número da fonte daria 66 linhas certas por erradas (medido sobre o
 * livro-razão a 02.10.2026, na passagem K2-c).
 *
 * ATÉ À PASSAGEM K2-c (02.10.2026) havia também uma comparação com qualquer literal do excerto igual ao valor, e a
 * leitura a frio do Codex mostrou que ela aceitava uma precisão perdida quando um inteiro alheio coincidia com o valor
 * («Artigo 8 … 8.0» contra «8»), e que não lia os números agrupados à inglesa. Por decisão do lugar de direção, a
 * célula compara só com o literal que é o próprio número, como a medida do §0 do brief fez; um excerto que não acaba
 * nesse literal (uma tabela de algarismos, o texto de um diploma) não se lê, e a contagem di-lo.
 *
 * AS PLANTAS CORREM SEMPRE, antes de a célula dizer zero, sobre cópias em memória: a linha dos jovens com o valor
 * antigo, uma linha composta arredondada, um inteiro alheio igual ao valor no mesmo excerto, um número agrupado à
 * inglesa com menos casas (que a forma anterior não lia), e três controlos que não podem morder (a mesma linha
 * derivada, a linha certa, e o número agrupado à inglesa com as mesmas casas).
 */

/** Normaliza um número exato: sem zeros à esquerda na parte inteira, sem zeros à direita nas casas. */
function normal(inteiro, casas) {
  const i = inteiro.replace(/^(-?)0+(?=\d)/, '$1');
  const c = casas.replace(/0+$/, '');
  const s = i + (c ? '.' + c : '');
  return s === '-0' ? '0' : s;
}

/** O valor de uma linha como número exato e as suas casas, ou `null` se não é um número da casa. @param {unknown} valor */
export function numeroDoValor(valor) {
  const s = String(valor ?? '').replace(/[\u00a0\u202f\u2009 ]/g, '').replace('\u2212', '-');
  const m = /^(-?\d+)(?:,(\d+))?$/.exec(s);
  return m ? { n: normal(m[1], m[2] ?? ''), casas: (m[2] ?? '').length } : null;
}

/**
 * O literal do excerto que é o próprio número, ou `null`: o que vem depois dos dois pontos no fim do excerto, com a
 * marca da fonte opcional. Os milhares agrupados à inglesa leem-se sem as vírgulas.
 * @param {string} excerto
 */
export function literalDoValor(excerto) {
  const m = /:\s*(-?\d{1,3}(?:,\d{3})+|-?\d+)(?:\.(\d+))?(?:\s+[a-z]{1,3})?\s*$/.exec(excerto);
  if (!m) return null;
  const literal = m[0].replace(/^:\s*/, '').trim();
  return { n: normal(m[1].replace(/,/g, ''), m[2] ?? ''), casas: (m[2] ?? '').length, literal };
}

/**
 * A célula sobre uma coleção de linhas (o livro-razão, ou uma cópia para as plantas).
 * @param {Iterable<Record<string, any>>} linhas
 */
export function conferirCasasDecimais(linhas) {
  /** @type {string[]} */
  const erros = [];
  const contas = { linhas: 0, com_derivacao: 0, sem_excerto: 0, nao_numericas: 0, com_literal_do_valor: 0, sem_literal_do_valor: 0 };
  for (const l of linhas) {
    contas.linhas++;
    if (l.derivation) { contas.com_derivacao++; continue; }
    const excerto = String(l.excerpt ?? '');
    if (!excerto.trim() || excerto.includes('[a verificar]')) { contas.sem_excerto++; continue; }
    const v = numeroDoValor(l.value);
    if (!v) { contas.nao_numericas++; continue; }
    const fim = literalDoValor(excerto);
    if (!fim) { contas.sem_literal_do_valor++; continue; }
    contas.com_literal_do_valor++;
    if (fim.n === v.n && fim.casas > v.casas) {
      erros.push(`D · ${l.id}: o excerto escreve o valor como «${fim.literal}», com ${fim.casas} casa(s) decimal(is), e a linha escreve «${l.value}», com ${v.casas}. A precisão é a da fonte (§1.127, decisão 3): corrige-se pelo mecanismo, com uma entrada «correcao» selada e o contador recontado.`);
    } else if (fim.n === v.n && fim.casas < v.casas) {
      erros.push(`D · ${l.id}: o excerto escreve o valor como «${fim.literal}» e a linha escreve «${l.value}», com mais casas decimais do que a fonte.`);
    } else if (fim.n !== v.n) {
      erros.push(`D · ${l.id}: o excerto acaba em «${fim.literal}» e o valor da linha é «${l.value}»: o literal que é o próprio número tem de ser o valor, com as mesmas casas.`);
    }
  }
  return { erros, contas };
}

/**
 * As linhas das plantas, cópias em memória das linhas reais: cada uma diz se tem de morder.
 * @param {Map<string, Record<string, any>>} linhas
 */
export function linhasDasPlantas(linhas) {
  const copia = (id, mudar) => {
    const l = linhas.get(id);
    if (!l) return null;
    return mudar(JSON.parse(JSON.stringify(l)));
  };
  return [
    { nome: 'a linha dos jovens com o valor antigo, «8» contra «8.0»', linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '8' })), morde: true },
    { nome: 'uma linha composta arredondada, «2» contra «2.1 p»', linha: copia('credito-malparado-2025', (l) => ({ ...l, value: '2' })), morde: true },
    { nome: 'um inteiro alheio igual ao valor no mesmo excerto, «8» contra «… — Artigo 8 — … — 2025: 8.0»',
      linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '8', excerpt: String(l.excerpt).replace(' — Portugal — ', ' — Artigo 8 — Portugal — ') })), morde: true },
    { nome: 'um número agrupado à inglesa com menos casas, «1422,4» contra «1,422.40»',
      linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '1422,4', excerpt: String(l.excerpt).replace(/: 8\.0$/, ': 1,422.40') })), morde: true },
    { nome: 'o controlo: a linha dos jovens derivada, com o valor antigo', linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '8', derivation: 'uma conta declarada, para a planta' })), morde: false },
    { nome: 'o controlo: a linha dos jovens como está', linha: copia('jovens-nem-2025', (l) => l), morde: false },
    { nome: 'o controlo: o número agrupado à inglesa com as mesmas casas, «1422,40» contra «1,422.40»',
      linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '1422,40', excerpt: String(l.excerpt).replace(/: 8\.0$/, ': 1,422.40') })), morde: false },
  ];
}

/**
 * As plantas, sobre as linhas acima: cada uma tem de morder ou de calar, como diz.
 * @param {Map<string, Record<string, any>>} linhas
 * @param {(linhas: Iterable<Record<string, any>>) => { erros: string[] }} [conferir] a célula a provar (por omissão,
 *   esta; o relatório da passagem K2-c corre as mesmas linhas na versão anterior, para mostrar o que ela não via)
 */
export function plantasDasCasasDecimais(linhas, conferir = conferirCasasDecimais) {
  return linhasDasPlantas(linhas).map((p) => {
    if (!p.linha) return { nome: p.nome, mordeu: false, esperado: p.morde ? 'morder' : 'calar', certo: false, queixa: 'a linha da planta não existe no livro-razão' };
    const r = conferir([p.linha]);
    const queixa = r.erros.find((e) => e.includes(` · ${p.linha.id}:`)) ?? null;
    return { nome: p.nome, esperado: p.morde ? 'morder' : 'calar', mordeu: Boolean(queixa), certo: p.morde ? Boolean(queixa) : !queixa, queixa };
  });
}
