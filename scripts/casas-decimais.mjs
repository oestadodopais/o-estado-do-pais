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
 * derivada, a linha certa, e o número agrupado à inglesa com as mesmas casas). Desde o bloco P4, as da forma que o
 * INE publica, abaixo.
 *
 * AS LINHAS DO INE LEEM-SE PELA FORMA QUE O INE PUBLICA (bloco P4, 02.10.2026, item 2 do brief
 * `design/observatorio/BRIEF-P4-os-pequenos-do-sitio.md`; a decisão 2 do §5 desse brief: «a regra das casas decimais
 * lê a forma publicada da fonte quando a fonte a publica; o literal do excerto é o caminho geral»; a proposta do
 * construtor da passagem K2-c, §1.151, decisão 5). Até ao P4 a célula deixava por ler 2 535 linhas, entre elas as
 * 1 250 do INE, porque o excerto delas não acaba no literal do número: acaba no campo «valor», que é o número da
 * máquina. O excerto do INE traz também «"ind_string" : "1 422,4"», que é a forma que o INE publica, com as suas
 * casas e os milhares separados por espaço; e uma linha cuja fonte é uma resposta do INE (o endereço em `www.ine.pt`)
 * lê-se por esse campo: o valor da linha tem de ser esse número, com as mesmas casas. Medido a 02.10.2026 sobre o
 * livro-razão: o «ind_string» é o valor em 1 249 das 1 250 linhas, e a que difere é a da remuneração média, pela
 * marca de provisório.
 *
 * A REGRA DA MARCA DE PROVISÓRIO. Quando o excerto declara um sinal convencional («"sinal_conv" : "&"», com
 * «"sinal_conv_desc" : "Dado provisório"»), o INE escreve-o na forma publicada, depois do número e de um espaço
 * («1 835 &»). Esse sinal, e só um sinal que o próprio excerto declara, sai do fim da forma antes de comparar: é a
 * marca da fonte e não o número (o recibo da linha mostra-a pela nota da fonte). Uma forma com um sinal que o excerto
 * não declara, ou um excerto com mais de um «ind_string», não se lê como número e fecha a construção: a célula não
 * adivinha qual é o número.
 *
 * UM REGISTO DA RESPOSTA DO INE SEM A FORMA PUBLICADA É UM ERRO (passagem P4-c, 02.10.2026; achado 4 da leitura a frio
 * do P4, `design/especime-v3/critica/LEITURA-P4-2026-10-02.md`). O leitor tirou o «ind_string» do excerto de uma linha
 * do INE com uma casa a menos («86,6» contra «86,60»), e a linha passou de errada a «por ler», sem erro nenhum: a
 * cobertura podia descer sem ninguém ver. Um excerto que cita o registo da resposta do INE (os campos «"geocod" :» e
 * «"valor" :», a forma em que o motor os copia) traz sempre o «ind_string» ao lado (medido a 02.10.2026: as 1 250 linhas
 * com a forma publicada têm os dois campos, e nenhum registo sem ela); um registo sem ela é um excerto partido, e fecha
 * a construção, contado («linhas do INE sem a forma publicada»). As linhas do INE cujo excerto não é o registo da
 * resposta (11 a 02.10.2026: oito da mesma API com o excerto escrito em prosa, «valor 111.47», e três das páginas do
 * portal, com o texto do comunicado) não trazem forma nenhuma para ler: seguem o caminho geral, e a célula conta-as e
 * diz-lhes os nomes, em vez de as deixar cair caladas em «por ler».
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

/** O anfitrião das respostas do INE, a fonte cuja forma publicada esta célula sabe ler. */
const ANFITRIAO_DO_INE = 'www.ine.pt';

/**
 * A forma que o INE publica para o número de uma linha, ou `null` se a linha não é uma resposta do INE com o campo
 * «ind_string»: `{ n, casas, literal, sinal }`, com o sinal convencional que o excerto declara e a forma trazia, ou
 * `{ erro }` quando a forma não se lê como número (um sinal que o excerto não declara, mais de uma forma).
 * @param {Record<string, any>} linha
 */
export function formaPublicadaDoINE(linha) {
  const excerto = String(linha.excerpt ?? '');
  const formas = [...excerto.matchAll(/"ind_string"\s*:\s*"([^"]*)"/g)].map((m) => m[1]);
  if (!formas.length) return null;
  let anfitriao = '';
  try { anfitriao = new URL(String(linha.source_url ?? '')).host; } catch { anfitriao = ''; }
  if (anfitriao !== ANFITRIAO_DO_INE) return null;
  if (formas.length !== 1) return { erro: `o excerto traz ${formas.length} formas publicadas («ind_string»), e a célula não adivinha qual é a do valor.` };
  const sinais = [...excerto.matchAll(/"sinal_conv"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  let forma = formas[0].trim();
  let sinal = null;
  for (const s of sinais) {
    if (forma.endsWith(` ${s}`)) { sinal = s; forma = forma.slice(0, -(s.length + 1)).trim(); break; }
  }
  const n = numeroDoValor(forma);
  if (!n) {
    return { erro: `a forma que o INE publica, «${formas[0]}», não se lê como número${sinais.length ? `, e o sinal que o excerto declara é «${sinais.join('», «')}»` : ', e o excerto não declara sinal convencional nenhum'}.` };
  }
  return { ...n, literal: formas[0], sinal };
}

/** Se a fonte da linha é o INE (`www.ine.pt`). @param {Record<string, any>} linha */
function eDoINE(linha) {
  try { return new URL(String(linha.source_url ?? '')).host === ANFITRIAO_DO_INE; } catch { return false; }
}

/** Se o excerto cita o registo da resposta do INE, pelos campos «"geocod" :» e «"valor" :». @param {string} excerto */
export function citaORegistoDoINE(excerto) {
  return /"geocod"\s*:/.test(excerto) && /"valor"\s*:/.test(excerto);
}

/** A comparação do valor de uma linha com o número que a fonte escreve, e a queixa, ou `null` se batem. */
function queixaDasCasas(l, v, fonte, onde) {
  if (fonte.n === v.n && fonte.casas > v.casas) {
    return `D · ${l.id}: ${onde} escreve o valor como «${fonte.literal}», com ${fonte.casas} casa(s) decimal(is), e a linha escreve «${l.value}», com ${v.casas}. A precisão é a da fonte (§1.127, decisão 3): corrige-se pelo mecanismo, com uma entrada «correcao» selada e o contador recontado.`;
  }
  if (fonte.n === v.n && fonte.casas < v.casas) {
    return `D · ${l.id}: ${onde} escreve o valor como «${fonte.literal}» e a linha escreve «${l.value}», com mais casas decimais do que a fonte.`;
  }
  if (fonte.n !== v.n) {
    return `D · ${l.id}: ${onde} escreve «${fonte.literal}» e o valor da linha é «${l.value}»: o número que a fonte escreve tem de ser o valor, com as mesmas casas.`;
  }
  return null;
}

/**
 * A célula sobre uma coleção de linhas (o livro-razão, ou uma cópia para as plantas). Desde o bloco P4 as contas dizem
 * quantas linhas se leem (pelo literal do fim do excerto ou pela forma que o INE publica) e quantas ficam por ler.
 * @param {Iterable<Record<string, any>>} linhas
 */
export function conferirCasasDecimais(linhas) {
  /** @type {string[]} */
  const erros = [];
  const contas = {
    linhas: 0, com_derivacao: 0, sem_excerto: 0, nao_numericas: 0,
    com_literal_do_valor: 0, pela_forma_publicada_do_ine: 0, com_sinal_da_fonte: 0,
    ine_sem_a_forma_publicada: 0, ine_sem_o_registo_da_resposta: 0,
    sem_literal_do_valor: 0, lidas: 0, por_ler: 0,
  };
  /** As linhas do INE cujo excerto não é o registo da resposta: seguem o caminho geral, e ditas pelo nome. */
  const ineSemORegisto = [];
  for (const l of linhas) {
    contas.linhas++;
    if (l.derivation) { contas.com_derivacao++; continue; }
    const excerto = String(l.excerpt ?? '');
    if (!excerto.trim() || excerto.includes('[a verificar]')) { contas.sem_excerto++; continue; }
    const v = numeroDoValor(l.value);
    if (!v) { contas.nao_numericas++; continue; }
    const ine = formaPublicadaDoINE(l);
    if (ine) {
      contas.pela_forma_publicada_do_ine++;
      if (ine.erro) { erros.push(`D · ${l.id}: ${ine.erro}`); continue; }
      if (ine.sinal) contas.com_sinal_da_fonte++;
      const q = queixaDasCasas(l, v, ine, 'a forma que o INE publica («ind_string»)');
      if (q) erros.push(q);
      continue;
    }
    if (eDoINE(l)) {
      if (citaORegistoDoINE(excerto)) {
        contas.ine_sem_a_forma_publicada++;
        erros.push(`D · ${l.id}: o excerto cita o registo da resposta do INE («geocod», «valor») sem a forma que o INE publica («ind_string»), e sem ela a célula não lê as casas decimais do valor. Um registo da resposta traz sempre a forma publicada: o excerto corrige-se no motor.`);
        continue;
      }
      contas.ine_sem_o_registo_da_resposta++;
      ineSemORegisto.push(l.id);
    }
    const fim = literalDoValor(excerto);
    if (!fim) { contas.sem_literal_do_valor++; continue; }
    contas.com_literal_do_valor++;
    const q = queixaDasCasas(l, v, fim, 'o excerto');
    if (q) erros.push(q);
  }
  contas.lidas = contas.com_literal_do_valor + contas.pela_forma_publicada_do_ine;
  contas.por_ler = contas.sem_literal_do_valor;
  return { erros, contas, ineSemORegisto };
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
    /* AS PLANTAS DA FORMA QUE O INE PUBLICA (bloco P4, 02.10.2026). */
    { nome: 'uma linha do INE com menos casas do que a forma publicada, «86,6» contra «86,60» (o «valor» da máquina diz «86.6»)',
      linha: copia('alcacer-do-sal-poder-de-compra-2023', (l) => ({ ...l, value: '86,6' })), morde: true },
    { nome: 'uma linha do INE arredondada às unidades, «1 422» contra «1 422,4»',
      linha: copia('abrantes-ganho-medio-mensal-2024', (l) => ({ ...l, value: '1 422' })), morde: true },
    { nome: 'uma linha do INE com mais casas do que a forma publicada, «1 422,40» contra «1 422,4»',
      linha: copia('abrantes-ganho-medio-mensal-2024', (l) => ({ ...l, value: '1 422,40' })), morde: true },
    { nome: 'uma linha do INE com o número de outro concelho, «1 383,6» contra «1 422,4»',
      linha: copia('abrantes-ganho-medio-mensal-2024', (l) => ({ ...l, value: '1 383,6' })), morde: true },
    { nome: 'a linha provisória do INE com um sinal que o excerto não declara, «1 835 x» com o sinal «&»',
      linha: copia('remuneracao-bruta-mensal-media', (l) => ({ ...l, excerpt: String(l.excerpt).replace('"ind_string" : "1 835 &"', '"ind_string" : "1 835 x"') })), morde: true },
    /* A PROVISÓRIA ARREDONDADA DE VERDADE (passagem P4-c, achado 9 da leitura a frio): a planta escrevia «1 84», que a
       leitura do valor lê como 184, e provava a recusa de outro número. Um arredondamento de 1 835 às dezenas é 1 840. */
    { nome: 'a linha provisória do INE arredondada às dezenas, «1 840» contra «1 835 &»',
      linha: copia('remuneracao-bruta-mensal-media', (l) => ({ ...l, value: '1 840' })), morde: true },
    /* O REGISTO SEM A FORMA PUBLICADA (passagem P4-c, achado 4): o caso do leitor, a casa a menos com o campo tirado, e o
       mesmo registo com o valor certo, que tem de morder na mesma, porque sem a forma a célula não lê as casas. */
    { nome: 'uma linha do INE com o «ind_string» tirado do excerto e uma casa a menos, «86,6» (o caso do leitor)',
      linha: copia('alcacer-do-sal-poder-de-compra-2023', (l) => ({ ...l, value: '86,6', excerpt: String(l.excerpt).replace(/"ind_string"\s*:\s*"[^"]*",\s*/, '') })), morde: true },
    { nome: 'uma linha do INE com o «ind_string» tirado do excerto e o valor certo, «86,60»',
      linha: copia('alcacer-do-sal-poder-de-compra-2023', (l) => ({ ...l, excerpt: String(l.excerpt).replace(/"ind_string"\s*:\s*"[^"]*",\s*/, '') })), morde: true },
    { nome: 'o controlo: uma linha do INE com o excerto em prosa, que não é o registo da resposta, como está («valor 111.47»)',
      linha: copia('evora-poder-de-compra-2023', (l) => l), morde: false },
    { nome: 'o controlo: a linha provisória do INE como está, «1 835» contra «1 835 &» com o sinal declarado',
      linha: copia('remuneracao-bruta-mensal-media', (l) => l), morde: false },
    { nome: 'o controlo: uma linha do INE como está, «1 422,4»',
      linha: copia('abrantes-ganho-medio-mensal-2024', (l) => l), morde: false },
    { nome: 'o controlo: a linha do INE com o zero do fim, como está, «86,60»',
      linha: copia('alcacer-do-sal-poder-de-compra-2023', (l) => l), morde: false },
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
