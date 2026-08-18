/**
 * A prova viva: os números que o sítio diz sobre si próprio.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE
 * ---------------------------------------------------------------------------
 * O estado é renderizado, nunca escrito. Uma frase como «132 linhas, 12 por
 * confirmar» escrita à mão fica errada na construção seguinte e ninguém dá por
 * isso. Tudo o que o Método diz sobre o estado do sítio sai daqui, calculado na
 * construção a partir dos dados do próprio sítio: o livro-razão, o arquivo, o
 * registo da travessia, o ficheiro da verificação, a lista dos concelhos.
 *
 * ---------------------------------------------------------------------------
 * O QUE ISTO NÃO É
 * ---------------------------------------------------------------------------
 * Não é o livro-razão. Uma medição de Portugal entra por `<Claim id="…"/>`, tem
 * linha própria e selo. Um número **deste sítio sobre si próprio** não tem
 * linha nem selo: tem a marca `data-prova="<chave>"` e uma porta, que é a
 * página onde o leitor vê o que ele conta. Ver `IDENTIDADE.md` §10.
 *
 * A marca **não é uma dispensa**. `scripts/gate-html.mjs` recalcula cada chave
 * por conta própria, do seu próprio ponto de observação (as páginas
 * construídas, o mapa do sítio, os ficheiros de dados), e fecha a construção
 * quando o que a página rende discorda. Onde o portão não tem outro caminho
 * senão o mesmo módulo que este ficheiro usa, isso está dito lá, chave a chave.
 *
 * ---------------------------------------------------------------------------
 * A FORMA
 * ---------------------------------------------------------------------------
 *   prova(lang) -> { <chave>: { valor, origem, porta, … } }
 *
 *   valor  número, data ISO, cadeia, ou `null` quando a coisa contada ainda não
 *          existe. `null` não se rende como zero: rende-se como estado vazio,
 *          por palavras.
 *   origem a frase curta que diz COMO o número é obtido, na língua da edição.
 *   porta  a rota onde se vê o que ele conta. Todo o número marcado
 *          `data-prova` vai dentro de uma ligação para aqui (ou, dentro de um
 *          desenho, na legenda de portas do instrumento).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadClaims,
  provenienciaIncompleta,
  entradasDoRegisto,
  TIPOS_DE_DOCUMENTO,
} from './ledger.mjs';
import { ROUTES, routePath } from './routes.mjs';
import { WORKS, EDITIONS } from '../data/studies.mjs';
import { temLeitura } from '../data/leituras.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../data/municipios.mjs';
import { MUNICIPIOS } from '../data/caop-centroids.mjs';
import { VERIFICACAO } from '../data/verificacao.mjs';
import { ENDERECO_CORRECOES } from '../data/metodo.mjs';

/**
 * A raiz do repositório.
 *
 * NÃO pode ser um caminho relativo a este ficheiro: na construção, este módulo
 * é empacotado para dentro de `dist/`, e o caminho relativo passaria a apontar
 * para lá — que foi exactamente o que aconteceu na primeira corrida deste
 * ficheiro (o registo da travessia deu zero na página e setenta no portão, e o
 * portão fechou a construção, que é o que ele existe para fazer). Mesma
 * disciplina de `encontraLivroRazao()` em `ledger.mjs`: procura-se a subir, do
 * directório de trabalho primeiro e do próprio ficheiro depois.
 */
function encontraRaiz() {
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, 'ledger', 'claims'))) return dir;
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
    return null;
  };
  return (
    subir(process.cwd()) ??
    subir(path.dirname(fileURLToPath(import.meta.url))) ??
    process.cwd()
  );
}

const RAIZ = encontraRaiz();

/** O endereço do ficheiro que o portão escreve no fim de um varrimento limpo. */
export const CAMINHO_DA_PROVA = '/prova.json';

/** O ficheiro da agenda, escrito pelo exportador do motor quando existe. */
export const FICHEIRO_DA_AGENDA = path.join(RAIZ, 'src', 'data', 'agenda.json');

/**
 * Há quantos dias o painel foi reconferido contra a fonte, e se isso já passou
 * do prazo que o próprio ficheiro da verificação declara.
 *
 * Uma conta só, partilhada pelo cabeçalho de todas as páginas e pela primeira
 * página. Duas cópias divergiam à primeira alteração, e uma delas dizia ao
 * leitor que o painel estava fresco enquanto a outra dizia que estava vencido.
 */
export function estadoDaVerificacao(hoje = new Date()) {
  const dias = Math.floor(
    (Date.parse(`${hoje.toISOString().slice(0, 10)}T00:00:00Z`) -
      Date.parse(`${VERIFICACAO.verificadoEm}T00:00:00Z`)) /
      86400000,
  );
  return {
    verificadoEm: VERIFICACAO.verificadoEm,
    dias,
    vencida: dias > VERIFICACAO.validadeDias,
  };
}

/**
 * A agenda, se o motor já a atravessou.
 *
 * O ficheiro é escrito pelo exportador do ResearchHub e não existe hoje. Um
 * ficheiro em falta não é um erro nem um zero: é um estado vazio, e as chaves
 * `agenda_*` ficam a `null` para que a página o diga por palavras. Ver §1.39 e
 * `PLANO-fases.md`, bloco V, item 5.
 */
export function agenda() {
  try {
    if (!fs.existsSync(FICHEIRO_DA_AGENDA)) return null;
    const cru = JSON.parse(fs.readFileSync(FICHEIRO_DA_AGENDA, 'utf8'));
    const itens = Array.isArray(cru?.itens) ? cru.itens : Array.isArray(cru) ? cru : null;
    if (!itens) return null;
    const porEstado = (estado) => itens.filter((i) => i?.estado === estado).length;
    return {
      total: itens.length,
      em_curso: porEstado('em_curso'),
      a_seguir: porEstado('a_seguir'),
      concluido: porEstado('concluido'),
      retirado: porEstado('retirado'),
    };
  } catch {
    /* Um ficheiro partido não se adivinha: vale o mesmo que não existir, e a
       página diz o estado vazio em vez de inventar contagens. */
    return null;
  }
}

/** As linhas que atravessaram do motor, contadas no registo da travessia. */
function linhasCruzadas() {
  const dir = path.join(RAIZ, 'ledger', 'cruzamentos');
  let total = 0;
  let ficheiros = 0;
  if (!fs.existsSync(dir)) return { total, ficheiros };
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const manifesto = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    total += Object.keys(manifesto?.rows ?? {}).length;
    ficheiros++;
  }
  return { total, ficheiros };
}

/**
 * Uma âncora dentro de uma rota, sem barra a dobrar: a raiz é `/` e o resto
 * não tem barra final.
 */
function ancora(rota, id) {
  return `${rota}#${id}`;
}

/**
 * A ÂNCORA DA SECÇÃO DE UM ESTADO, na própria página da agenda.
 *
 * É a mesma cadeia que `AgendaView.astro` põe no `id` de cada secção. Vive
 * aqui porque é daqui que a porta sai: a chave da prova é que decide para onde
 * a sua contagem abre, e o gabarito obedece.
 */
export const ancoraDoEstadoDaAgenda = (estado) => `estado-${estado}`;

/**
 * A porta da agenda.
 *
 * A rota `agenda` ainda não existe: é o agente que atravessa o calendário do
 * motor que a acrescenta, neste mesmo ramo. Enquanto não existir, a porta é o
 * Método, que é onde a regra 8 está escrita. No dia em que a rota entrar na
 * tabela, esta função devolve-a sem que seja preciso tocar aqui.
 *
 * DESDE A V2, UMA CONTAGEM POR ESTADO ABRE A SUA SECÇÃO (IDENTIDADE.md §10, «a
 * porta pode ser uma âncora na própria página»). O quadro de estados da agenda
 * conta quatro coisas que se veem ali mesmo, mais abaixo na mesma página: a
 * porta de «3 em curso» é a secção «Em curso», e não a página inteira, onde já
 * se está. Da mobília do cabeçalho, noutra página, a mesma porta continua a
 * levar ao mesmo sítio, um pouco mais abaixo.
 *
 * `agenda_total` fica sem âncora: conta a agenda inteira, e o que ela conta vê-se
 * na página inteira.
 */
function portaDaAgenda(lang, estado = null) {
  if (!ROUTES.agenda) return routePath('metodo', lang);
  const rota = routePath('agenda', lang);
  return estado ? ancora(rota, ancoraDoEstadoDaAgenda(estado)) : rota;
}

const FRASES = {
  fontes: {
    pt: 'organismos distintos no campo da fonte das linhas do livro-razão',
    en: 'distinct bodies in the source field of the ledger rows',
  },
  tipos_de_documento: {
    pt: 'linhas cujo documento declara o seu tipo, dos cinco que o formato conhece',
    en: 'rows whose document declares its kind, of the five the format knows',
  },
  linhas_cruzadas: {
    pt: 'linhas com entrada no registo da travessia do motor',
    en: 'rows with an entry in the engine crossing record',
  },
  linhas_anteriores_ao_tubo: {
    pt: 'linhas escritas antes de existir registo de travessia, e por isso sem um',
    en: 'rows written before any crossing record existed, and so without one',
  },
  leituras: {
    pt: 'trabalhos do arquivo com leitura do observatório escrita',
    en: 'archive works with an observatory reading written',
  },
  afirmacoes: {
    pt: 'ficheiros do livro-razão, um por número publicado',
    en: 'ledger files, one per published figure',
  },
  indexaveis: {
    pt: 'linhas sem nenhum campo de proveniência por confirmar',
    en: 'rows with no provenance field left to confirm',
  },
  divida: {
    pt: 'linhas com pelo menos um campo marcado [a verificar]',
    en: 'rows with at least one field marked [a verificar]',
  },
  derivadas: {
    pt: 'linhas cujo valor é calculado a partir de outras linhas',
    en: 'rows whose value is calculated from other rows',
  },
  aritmetica_reavaliada: {
    pt: 'linhas com a conta escrita como expressão, refeita a cada construção',
    en: 'rows with the arithmetic written as an expression, redone at each build',
  },
  releituras_registadas: {
    pt: 'entradas de reconferência escritas nas linhas do livro-razão',
    en: 're-check entries written into the ledger rows',
  },
  linhas_reconferidas: {
    pt: 'linhas com pelo menos uma reconferência escrita',
    en: 'rows with at least one re-check written',
  },
  releituras_divergentes: {
    pt: 'reconferências em que a fonte disse outra coisa',
    en: 're-checks where the source said something else',
  },
  painel_reconferido_em: {
    pt: 'data escrita pelo motor na última reconferência do painel',
    en: 'date written by the engine at the last panel re-check',
  },
  correcoes: {
    pt: 'entradas de natureza correção no livro-razão',
    en: 'entries of kind correction in the ledger',
  },
  atualizacoes: {
    pt: 'entradas de natureza atualização no livro-razão',
    en: 'entries of kind update in the ledger',
  },
  revisoes_de_proveniencia: {
    pt: 'entradas de natureza revisão de proveniência no livro-razão',
    en: 'entries of kind provenance revision in the ledger',
  },
  valores_creditados: {
    pt: 'linhas que creditam o valor a quem consta do documento',
    en: 'rows that credit the value to whoever the document names',
  },
  municipios_com_pagina: {
    pt: 'concelhos com página do observatório construída',
    en: 'concelhos with an observatory page built',
  },
  municipios_total: {
    pt: 'concelhos no ficheiro de coordenadas da Carta Administrativa',
    en: 'concelhos in the coordinates file of the official administrative map',
  },
  estudos: {
    pt: 'trabalhos no arquivo',
    en: 'works in the archive',
  },
  edicoes: {
    pt: 'edições no arquivo, contadas por língua',
    en: 'editions in the archive, counted by language',
  },
  agenda: {
    pt: 'itens da agenda atravessados do motor',
    en: 'agenda items crossed from the engine',
  },
  endereco_correcoes: {
    pt: 'o endereço para onde se escreve, numa origem só',
    en: 'the address to write to, from a single source',
  },
};

/**
 * Todos os números que o sítio diz sobre si próprio, na língua de uma edição.
 * @param {'pt'|'en'} [lang]
 */
export function prova(lang = 'pt') {
  const claims = loadClaims();
  const linhas = [...claims.values()];
  const livro = routePath('livro', lang);
  const f = (chave) => FRASES[chave][lang] ?? FRASES[chave].pt;

  const divida = linhas.filter((c) => provenienciaIncompleta(c)).length;
  /* Todas as entradas de reconferência, de todas as linhas, numa lista só. */
  const entradasDeReleitura = linhas.flatMap((c) =>
    Array.isArray(c.verifications) ? c.verifications : [],
  );
  const cruzadas = linhasCruzadas();
  const verificacao = estadoDaVerificacao();
  const ag = agenda();

  const porTipo = {};
  for (const tipo of TIPOS_DE_DOCUMENTO) porTipo[tipo] = 0;
  let semTipo = 0;
  for (const c of linhas) {
    const tipo = c.document?.kind;
    if (tipo && tipo in porTipo) porTipo[tipo]++;
    else semTipo++;
  }

  /** @type {(chave: string, valor: any, porta: string, extra?: object) => object} */
  const k = (chave, valor, porta, extra = {}) => ({
    valor,
    origem: f(chave),
    porta,
    ...extra,
  });

  return {
    /* ---- o livro-razão ---- */
    afirmacoes: k('afirmacoes', claims.size, livro),
    indexaveis: k('indexaveis', claims.size - divida, livro),
    divida: k('divida', divida, livro),
    derivadas: k('derivadas', linhas.filter((c) => (c.derived_from ?? []).length > 0).length, livro),
    aritmetica_reavaliada: k(
      'aritmetica_reavaliada',
      linhas.filter((c) => typeof c.check === 'string' && c.check.trim() !== '').length,
      livro,
    ),
    valores_creditados: k(
      'valores_creditados',
      linhas.filter((c) => (c.attributed_to ?? []).length > 0).length,
      livro,
    ),
    fontes: k('fontes', new Set(linhas.map((c) => c.source).filter(Boolean)).size, livro),
    tipos_de_documento: k('tipos_de_documento', claims.size - semTipo, livro, {
      detalhe: { ...porTipo, sem_tipo: semTipo },
    }),

    /* ---- a travessia do motor ---- */
    linhas_cruzadas: k('linhas_cruzadas', cruzadas.total, livro, {
      manifestos: cruzadas.ficheiros,
    }),
    /* O resto das linhas publicadas. Vieram da mesma investigação, e foram
       escritas antes de haver registo de travessia: o tubo é de 2026-08-15. A
       regra 2 do Método diz «cada número sai do motor», e sem esta chave a sua
       prova mostrava só as que têm registo, deixando o leitor a somar de
       cabeça e a concluir mal. Ver DECISIONS §1.41. */
    linhas_anteriores_ao_tubo: k(
      'linhas_anteriores_ao_tubo',
      claims.size - cruzadas.total,
      livro,
    ),

    /* ---- o arquivo ---- */
    estudos: k('estudos', WORKS.length, routePath('estudos', lang)),
    edicoes: k('edicoes', EDITIONS.length, routePath('estudos', lang)),
    leituras: k('leituras', WORKS.filter((w) => temLeitura(w.id)).length, routePath('estudos', lang)),

    /* ---- a cobertura ---- */
    municipios_com_pagina: k(
      'municipios_com_pagina',
      MUNICIPIOS_COM_PAGINA.length,
      routePath('municipios', lang),
    ),
    municipios_total: k('municipios_total', MUNICIPIOS.length, routePath('municipios', lang)),

    /* ---- a releitura ----
       O campo `verifications[]` entrou a 18.08.2026 (DECISIONS §1.47). Estas
       três chaves contam-no: quantas entradas há, em quantas linhas, e quantas
       encontraram outro valor. A porta é o livro-razão, que é onde o leitor vê
       o que elas contam. */
    releituras_registadas: k('releituras_registadas', entradasDeReleitura.length, livro),
    linhas_reconferidas: k(
      'linhas_reconferidas',
      linhas.filter((c) => (c.verifications ?? []).length > 0).length,
      livro,
    ),
    releituras_divergentes: k(
      'releituras_divergentes',
      entradasDeReleitura.filter((v) => v.result === 'diverge').length,
      livro,
    ),
    painel_reconferido_em: k(
      'painel_reconferido_em',
      verificacao.verificadoEm,
      ancora(routePath('home', lang), 'numeros'),
      { vencida: verificacao.vencida, dias: verificacao.dias },
    ),

    /* ---- o registo ---- */
    correcoes: k('correcoes', entradasDoRegisto('correcao').length, routePath('correcoes', lang)),
    atualizacoes: k(
      'atualizacoes',
      entradasDoRegisto('atualizacao').length,
      routePath('correcoes', lang),
    ),
    /* A porta é a secção do registo e não a página inteira: a contagem passou a
       ser dita na própria página das correções, e uma porta que aponta para a
       página onde já se está não abre nada. Da regra 7 do Método continua a
       levar o leitor ao mesmo sítio, um pouco mais abaixo. */
    revisoes_de_proveniencia: k(
      'revisoes_de_proveniencia',
      entradasDoRegisto('proveniencia').length,
      ancora(routePath('correcoes', lang), 'registo'),
    ),
    endereco_correcoes: k('endereco_correcoes', ENDERECO_CORRECOES, routePath('correcoes', lang)),

    /* ---- a agenda: existe quando o ficheiro existe, e não antes ---- */
    agenda_total: k('agenda', ag ? ag.total : null, portaDaAgenda(lang)),
    agenda_em_curso: k('agenda', ag ? ag.em_curso : null, portaDaAgenda(lang, 'em_curso')),
    agenda_a_seguir: k('agenda', ag ? ag.a_seguir : null, portaDaAgenda(lang, 'a_seguir')),
    agenda_concluido: k('agenda', ag ? ag.concluido : null, portaDaAgenda(lang, 'concluido')),
    agenda_retirado: k('agenda', ag ? ag.retirado : null, portaDaAgenda(lang, 'retirado')),
  };
}

/** As chaves conhecidas. O portão recusa qualquer marca fora desta lista. */
export function chavesDaProva() {
  return Object.keys(prova('pt'));
}
