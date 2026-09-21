/**
 * ===========================================================================
 * O QUE UMA PÁGINA DE LUGAR MOSTRA, COMPOSTO E NÃO ESCRITO (B1, peça 2)
 * ===========================================================================
 *
 * A vista rende; este módulo compõe. São cinco coisas, pela ordem da maqueta:
 * a linha do lugar, a leitura, os números por tema, os estudos sobre o lugar, e
 * o que mudou. Nenhuma delas se escreve na vista, e nenhuma delas traz um número
 * que não venha de uma linha do livro-razão.
 */

import { REGIOES } from '../data/regioes.mjs';
import { DOMINIOS } from '../data/dominios.mjs';
import { WORKS } from '../data/studies.mjs';
import { temaDaMedida } from '../data/temas-das-medidas.mjs';
import { lugarDoConcelho, baseDoIndice } from '../data/carta-dos-lugares.mjs';
import { fichaDoEstudo } from './estudos-b1.mjs';
import {
  getClaim,
  parsePtNumber,
  eValorTextual,
  entradasDoRegisto,
  motivoDaEntrada,
} from './ledger.mjs';
import { routePath } from './routes.mjs';

/**
 * ---------------------------------------------------------------------------
 * 1 · A LINHA DO LUGAR
 * ---------------------------------------------------------------------------
 * «Portugal › região › distrito › concelho», cada parte com a sua página. A
 * região e o distrito são os DESTE concelho, lidos da Carta; a linha não afirma
 * que o distrito está dentro da região, e não pode, porque seis distritos têm
 * concelhos em duas regiões (ver `src/data/carta-dos-lugares.mjs`).
 *
 * @param {string} slug  o concelho desta página
 * @param {string} nome  o nome dele, na língua da página
 * @param {'pt'|'en'} lang
 */
export function linhaDoLugar(slug, nome, lang) {
  const lugar = lugarDoConcelho(slug);
  if (!lugar) {
    throw new Error(
      `lugar: o concelho "${slug}" não está nos três extratos da Carta que o projeto aloja. ` +
        `A linha do lugar diz a região e o distrito dele, e sem Carta não há nem uma nem outro.`,
    );
  }
  const pais = REGIOES.find((r) => r.referencia);
  return [
    { nome: pais?.nome[lang] ?? pais?.nome.pt ?? 'Portugal', destino: routePath('home', lang) },
    {
      nome: lugar.regiao.nome[lang] ?? lugar.regiao.nome.pt,
      destino: routePath('regiao', lang, { slug: lugar.regiao.slug }),
    },
    {
      nome: lugar.distrito.nome,
      destino: routePath('distrito', lang, { slug: lugar.distrito.slug }),
    },
    { nome, destino: routePath('municipio', lang, { slug }), aqui: true },
  ];
}

/**
 * ---------------------------------------------------------------------------
 * 2 · A LEITURA DE UM LUGAR
 * ---------------------------------------------------------------------------
 * Para Évora, a leitura é a do lugar de direção (emenda de 21.09.2026 ao brief
 * B1, §6.2), com os dois valores da série do índice de dívida selados.
 *
 * Para os outros 307, compõe-se das DUAS comparações que o livro-razão permite
 * para todos: a dívida da câmara contra o limite legal, e o poder de compra por
 * pessoa contra a média do país. As palavras do primeiro são as que o projeto já
 * usa («dentro do limite legal», «fora do limite legal»); as do segundo dizem de
 * que lado da base do índice o valor está, e a base lê-se da unidade da própria
 * linha.
 *
 * UMA COMPARAÇÃO SEM VALOR CAI DA FRASE. O índice de dívida de Penedono é a
 * marca que a Direção-Geral imprime, e não um número: onde não há número não há
 * comparação, e a metade da frase que a citava não se escreve. Se caírem as
 * duas, o lugar não tem leitura, e a leitura não se rende.
 *
 * NENHUM NÚMERO NOVO. Não há aqui diferenças calculadas («8,5 % abaixo»): o que
 * a frase leva são os valores das linhas, selados, e as palavras entre eles.
 *
 * @param {{ slug: string, nome: Record<string,string>, distancia?: Record<string, string|null> }} m
 * @param {{ chave: string, claim: string|null, vazia: boolean, linha: any }[]} pecas
 * @param {'pt'|'en'} lang
 * @param {any} s  a tabela de cadeias da edição
 */
export function leituraDoLugar(m, pecas, lang, s) {
  const nome = m.nome[lang] ?? m.nome.pt;

  /* ÉVORA TEM A SUA, e é a única escrita: os dois valores são linhas, os dois
     anos são datas de referência, e o resto são as palavras da emenda. */
  if (m.slug === 'evora') {
    const L = s.municipio.leituraDeEvora;
    return {
      partes: [
        L.a,
        { claim: 'evora-indice-de-divida-2014', sufixo: '%' },
        L.b,
        { ref: '2014' },
        L.c,
        { claim: 'evora-indice-de-divida-2024', sufixo: '%' },
        L.d,
        { ref: '2024' },
        L.e,
      ],
      citadas: ['evora-indice-de-divida-2014', 'evora-indice-de-divida-2024'],
    };
  }

  const L = s.municipio.leituraDoLugar;
  const peca = (chave) => pecas.find((p) => p.chave === chave && !p.vazia) ?? null;

  /* (a) a dívida da câmara contra o limite legal. */
  const indice = peca('indice');
  const tecto = m.distancia?.tecto ? getClaim(m.distancia.tecto) : null;
  const temIndice =
    indice !== null &&
    tecto !== null &&
    !eValorTextual(indice.linha.value) &&
    parsePtNumber(indice.linha.value) !== null &&
    parsePtNumber(tecto.value) !== null;
  const dentro = temIndice
    ? parsePtNumber(indice.linha.value) <= parsePtNumber(tecto.value)
    : null;

  /* (b) o poder de compra por pessoa contra a média do país, que é a base do
     índice e está escrita na unidade da própria linha. */
  const poder = peca('poderDeCompra');
  const base = poder ? baseDoIndice(poder.linha) : null;
  const valorDoPoder = poder ? parsePtNumber(poder.linha.value) : null;
  const valorDaBase = base ? parsePtNumber(base) : null;
  const temPoder =
    valorDoPoder !== null && valorDaBase !== null && valorDoPoder !== valorDaBase;
  const acima = temPoder ? valorDoPoder > valorDaBase : null;

  if (!temIndice && !temPoder) return null;

  const citadas = [];
  /** @type {any[]} */
  const partes = [];
  if (temIndice) {
    citadas.push(indice.claim);
    partes.push(
      L.dividaA,
      { lugar: nome },
      L.dividaB,
      { voz: dentro ? s.estado.lei.dentro : s.estado.lei.fora },
      L.dividaC,
      { claim: indice.claim, sufixo: '%' },
      L.dividaD,
    );
  }
  if (temPoder) {
    citadas.push(poder.claim);
    if (temIndice) partes.push(L.juncao);
    else partes.push(L.poderSoA, { lugar: nome }, L.poderSoB);
    partes.push({ voz: acima ? L.acima : L.abaixo }, L.poderC, { claim: poder.claim }, L.poderD);
  }
  partes.push(L.fim);
  return { partes, citadas };
}

/**
 * ---------------------------------------------------------------------------
 * 3 · OS NÚMEROS POR TEMA
 * ---------------------------------------------------------------------------
 * Os temas pela ordem da carta dos conteúdos (o número do domínio), e dentro de
 * cada um as medidas pela ordem da Emenda 14, que `pecasDoConcelho()` fixa.
 *
 * UM NÚMERO QUE ESTÁ NA LEITURA NÃO ABRE A PRIMEIRA FILA DO SEU TEMA (§5.5 do
 * brief). As medidas que a leitura cita descem para o fim do seu tema, com a
 * ordem relativa conservada: o leitor que acabou de ler o número não o volta a
 * encontrar como primeira coisa da fila.
 *
 * UM TEMA SEM MEDIDA PARA ESTE LUGAR NÃO SE RENDE (§1.3 da estrutura).
 *
 * @param {{ chave: string, claim: string|null, vazia: boolean }[]} pecas
 * @param {string[]} citadas  os ids que a leitura já disse
 * @param {'pt'|'en'} lang
 */
export function temasDoLugar(pecas, citadas, lang) {
  const cheias = pecas.filter((p) => !p.vazia);
  const naLeitura = new Set(citadas);
  /** @type {Map<string, any[]>} */
  const porTema = new Map();
  for (const p of cheias) {
    const tema = temaDaMedida(p.chave);
    if (!tema) {
      throw new Error(
        `lugar: a medida "${p.chave}" rende-se numa página de concelho e não tem tema em ` +
          `src/data/temas-das-medidas.mjs. Cada número de um lugar vive debaixo de um dos dezoito temas.`,
      );
    }
    if (!porTema.has(tema)) porTema.set(tema, []);
    porTema.get(tema).push(p);
  }
  const saida = [];
  for (const d of DOMINIOS) {
    const medidas = porTema.get(d.slug);
    if (!medidas) continue;
    const abrem = medidas.filter((p) => !naLeitura.has(p.claim));
    const descem = medidas.filter((p) => naLeitura.has(p.claim));
    saida.push({ slug: d.slug, nome: d.nome[lang] ?? d.nome.pt, medidas: [...abrem, ...descem] });
  }
  return saida;
}

/**
 * ---------------------------------------------------------------------------
 * 4 · OS ESTUDOS SOBRE O LUGAR
 * ---------------------------------------------------------------------------
 * Compostos de `WORKS` pelo lugar que cada estudo declara (`subject`), do mais
 * recente ao mais antigo pela data de publicação da edição. A lista escrita à
 * mão em `src/data/municipios.mjs` sai: um estudo novo sobre um lugar aparecia
 * na página dele quando alguém se lembrasse de o acrescentar, e foi assim que a
 * página de Évora ficou sem o estudo mais recente.
 *
 * @param {string} slug
 * @param {'pt'|'en'} lang
 */
export function estudosDoLugar(slug, lang) {
  return WORKS.filter((w) => w.subject === slug)
    .map((w) => fichaDoEstudo(w, lang))
    .sort(
      (a, b) =>
        (b.data ?? '').localeCompare(a.data ?? '') ||
        WORKS.indexOf(a.work) - WORKS.indexOf(b.work),
    );
}

/**
 * ---------------------------------------------------------------------------
 * 5 · O QUE MUDOU
 * ---------------------------------------------------------------------------
 * As linhas datadas que o projeto já regista para este lugar: as entradas do
 * registo de correções e de atualizações das linhas do livro-razão que são deste
 * lugar, do mais recente ao mais antigo, cada uma com a sua data e o motivo que
 * a própria entrada escreve, na língua da edição.
 *
 * O QUE NÃO ENTRA, E PORQUÊ. As datas de publicação dos estudos já se leem na
 * linha de cada estudo, na secção acima: repeti-las aqui era dizer duas vezes a
 * mesma coisa na mesma página. As revisões de proveniência também não entram, e
 * é a mesma decisão que o registo de correções toma («uma mudança de endereço
 * não é uma alteração do que foi publicado»).
 *
 * O QUE É «DESTE LUGAR»: uma linha que esta página rende, ou uma linha cujo
 * estudo declara este lugar. As duas saem de declarações, e nenhuma de uma lista
 * escrita à parte.
 *
 * SEM ENTRADAS, A SECÇÃO NÃO SE RENDE. Um título por cima de nada é uma célula
 * vazia, e nada mudou é uma resposta certa.
 *
 * @param {string} slug
 * @param {{ claim: string|null, vazia: boolean }[]} pecas
 * @param {'pt'|'en'} lang
 */
export function mudancasDoLugar(slug, pecas, lang) {
  const daPagina = new Set(pecas.filter((p) => !p.vazia).map((p) => p.claim));
  const estudos = new Set(WORKS.filter((w) => w.subject === slug).map((w) => w.id));
  const daqui = (id) => {
    if (daPagina.has(id)) return true;
    const linha = getClaim(id);
    return typeof linha.study === 'string' && estudos.has(linha.study);
  };
  const entradas = [];
  for (const kind of ['correcao', 'atualizacao']) {
    for (const e of entradasDoRegisto(kind)) {
      if (!daqui(e.claimId)) continue;
      entradas.push({ data: e.date, n: e.n, motivo: motivoDaEntrada(e, lang), claim: e.claimId });
    }
  }
  return entradas.sort((a, b) => b.data.localeCompare(a.data));
}
