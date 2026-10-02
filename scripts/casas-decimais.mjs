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
 * O QUE CONFERE, em duas metades, as duas sobre linhas sem derivação (uma linha derivada é uma conta da casa, e a sua
 * precisão é a da derivação, que o `check` reavalia):
 *
 *   D1 · O MESMO NÚMERO COM MENOS CASAS. Em qualquer forma de excerto, os literais numéricos que ele traz (a forma
 *        inglesa, «8.0», e a portuguesa, «1 422,4» ou «65.565.049,87») comparam-se com o valor da linha como números
 *        exatos, sem passar por vírgula flutuante. Se há literais iguais ao valor e TODOS escrevem mais casas do que
 *        o valor, a linha cortou casas à fonte. Um excerto onde o número não se encontra (as tabelas de algarismos
 *        separados por espaços, onde os milhares se colam aos vizinhos) não se lê, e a contagem di-lo;
 *   D2 · O LITERAL DO FIM DE UM EXCERTO COMPOSTO. Os excertos que o motor compõe das etiquetas da resposta da fonte
 *        acabam no valor («… — Portugal — 2025: 8.0», com a marca da fonte opcional, «2.4 p»). Aí o literal do fim é
 *        o valor da linha: tem de ser o mesmo número com as mesmas casas, ou um arredondamento ou uma troca fecham.
 *
 * AS PLANTAS CORREM SEMPRE, antes de a célula dizer zero, sobre cópias em memória: a linha dos jovens com o valor
 * antigo (D1 e D2), uma linha composta arredondada (D2), a retribuição mínima sem os cêntimos que o diploma escreve
 * (D1), e os dois controlos que não podem morder (a mesma linha derivada com menos casas, e uma linha certa).
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

/** Os literais numéricos de um excerto, nas duas formas. @param {string} excerto */
export function literaisDoExcerto(excerto) {
  const out = [];
  for (const m of excerto.matchAll(/(?<![\d.,])(-?\d+)\.(\d+)(?![\d.,]*\d)/g)) out.push({ n: normal(m[1], m[2]), casas: m[2].length, literal: m[0] });
  for (const m of excerto.matchAll(/(?<![\d,])(-?\d{1,3}(?:[ .\u00a0\u202f]\d{3})*|-?\d+),(\d+)(?![\d,]*\d)/g)) {
    out.push({ n: normal(m[1].replace(/[ .\u00a0\u202f]/g, ''), m[2]), casas: m[2].length, literal: m[0] });
  }
  for (const m of excerto.matchAll(/(?<![\d.,])(-?\d+)(?![\d.,]*\d)/g)) out.push({ n: normal(m[1], ''), casas: 0, literal: m[0] });
  return out;
}

/** O literal do fim de um excerto composto, ou `null`. @param {string} excerto */
export function literalDoFim(excerto) {
  const m = /:\s*(-?\d+)(?:\.(\d+))?(?:\s+[a-z]{1,3})?\s*$/.exec(excerto);
  return m ? { n: normal(m[1], m[2] ?? ''), casas: (m[2] ?? '').length, literal: m[0].replace(/^:\s*/, '').trim() } : null;
}

/**
 * A célula sobre uma coleção de linhas (o livro-razão, ou uma cópia para as plantas).
 * @param {Iterable<Record<string, any>>} linhas
 */
export function conferirCasasDecimais(linhas) {
  /** @type {string[]} */
  const erros = [];
  const contas = { linhas: 0, com_derivacao: 0, sem_excerto: 0, nao_numericas: 0, lidas_d1: 0, sem_par_d1: 0, compostas_d2: 0 };
  for (const l of linhas) {
    contas.linhas++;
    if (l.derivation) { contas.com_derivacao++; continue; }
    const excerto = String(l.excerpt ?? '');
    if (!excerto.trim() || excerto.includes('[a verificar]')) { contas.sem_excerto++; continue; }
    const v = numeroDoValor(l.value);
    if (!v) { contas.nao_numericas++; continue; }
    const iguais = literaisDoExcerto(excerto).filter((x) => x.n === v.n);
    if (iguais.length) {
      contas.lidas_d1++;
      if (iguais.every((x) => x.casas > v.casas)) {
        erros.push(`D1 · ${l.id}: o valor «${l.value}» escreve ${v.casas} casa(s) decimal(is) e o excerto escreve o mesmo número com ${Math.min(...iguais.map((x) => x.casas))} («${iguais[0].literal}»). A precisão é a da fonte (§1.127, decisão 3): corrige-se pelo mecanismo, com uma entrada «correcao» selada e o contador recontado.`);
      }
    } else contas.sem_par_d1++;
    const fim = literalDoFim(excerto);
    if (fim) {
      contas.compostas_d2++;
      if (fim.n === v.n && fim.casas !== v.casas) {
        erros.push(`D2 · ${l.id}: o excerto composto acaba em «${fim.literal}» e o valor escreve «${l.value}», com ${fim.casas > v.casas ? 'menos' : 'mais'} casas decimais do que a fonte.`);
      } else if (fim.n !== v.n) {
        erros.push(`D2 · ${l.id}: o excerto composto acaba em «${fim.literal}» e o valor da linha é «${l.value}»: o literal do fim de um excerto composto é o valor, com as mesmas casas.`);
      }
    }
  }
  return { erros, contas };
}

/**
 * As plantas, sobre cópias em memória das linhas reais: cada uma diz se tem de morder e com que célula.
 * @param {Map<string, Record<string, any>>} linhas
 */
export function plantasDasCasasDecimais(linhas) {
  const copia = (id, mudar) => {
    const l = linhas.get(id);
    if (!l) return null;
    return mudar(JSON.parse(JSON.stringify(l)));
  };
  const plantas = [
    { nome: 'a linha dos jovens com o valor antigo, «8» contra «8.0»', linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '8' })), morde: /^D1 · jovens-nem-2025/ },
    { nome: 'a mesma linha, pelo literal do fim', linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '8' })), morde: /^D2 · jovens-nem-2025/ },
    { nome: 'uma linha composta arredondada, «2» contra «2.1 p»', linha: copia('credito-malparado-2025', (l) => ({ ...l, value: '2' })), morde: /^D2 · credito-malparado-2025/ },
    { nome: 'a retribuição mínima sem os cêntimos do diploma, «920» contra «€ 920,00»', linha: copia('retribuicao-minima-mensal-garantida-continente-2026', (l) => ({ ...l, value: '920' })), morde: /^D1 · retribuicao-minima-mensal-garantida-continente-2026/ },
    { nome: 'o controlo: a linha dos jovens derivada, com o valor antigo', linha: copia('jovens-nem-2025', (l) => ({ ...l, value: '8', derivation: 'uma conta declarada, para a planta' })), morde: null },
    { nome: 'o controlo: a linha dos jovens como está', linha: copia('jovens-nem-2025', (l) => l), morde: null },
  ];
  return plantas.map((p) => {
    if (!p.linha) return { nome: p.nome, mordeu: false, esperado: p.morde ? 'morder' : 'calar', queixa: 'a linha da planta não existe no livro-razão' };
    const r = conferirCasasDecimais([p.linha]);
    const queixa = p.morde ? r.erros.find((e) => p.morde.test(e)) ?? null : r.erros[0] ?? null;
    return { nome: p.nome, esperado: p.morde ? 'morder' : 'calar', mordeu: Boolean(queixa), certo: p.morde ? Boolean(queixa) : !queixa, queixa };
  });
}
