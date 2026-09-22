/**
 * «O QUE MUDOU» NO SEU LUGAR (B1c, 22.09.2026).
 *
 * O diretor leu a primeira página a 22.09.2026 e tropeçou numa lista de trinta
 * mudanças, dezasseis delas correções de linhas de Évora e do Alentejo, numa
 * página que é a do país. O âmbito de cada página passa a estar escrito aqui, e
 * só aqui: o país, um lugar, o registo. As três listas saem da mesma leitura do
 * livro-razão, do arquivo e das mudanças declaradas; o que muda entre elas é a
 * peneira, e o teto.
 *
 * O QUE NÃO SE PERDE. Nenhuma linha se inventa nem se apaga: o que sai da
 * primeira página fica no registo, que é `/correcoes` e `/en/corrections`. O
 * teto é do que se mostra, nunca do que existe.
 *
 * O LUGAR DE CADA LINHA LÊ-SE DE DECLARAÇÕES, e de mais nada. Por esta ordem,
 * e com as discordâncias a fechar a construção em vez de escolherem sozinhas:
 * a tabela dos lugares declarados, a região que nomeia a linha, o estudo que
 * declara o seu objeto, o concelho que a rende no relance, e a tabela das
 * medidas do país com as linhas que a leitura cita. Uma linha de mudança sem
 * lugar fecha a construção.
 */
import { DOMINIO_DAS_MEDIDAS } from '../data/dominios.mjs';
import { REGIOES } from '../data/regioes.mjs';
import { MUNICIPIOS_COM_PAGINA, municipioPorSlug } from '../data/municipios.mjs';
import { WORKS } from '../data/studies.mjs';
import { MUDANCAS_DO_PROJETO } from '../data/mudancas-do-projeto.mjs';
import { LUGAR_DECLARADO_DAS_LINHAS } from '../data/lugar-das-linhas.mjs';
import { ROTULOS_B1 } from '../data/rotulos-b1.mjs';
import { entradasDoRegisto, getClaim, motivoDaEntrada } from './ledger.mjs';
import { nomeDoCartao, nomeDaLinhaDerivada } from './nomes.mjs';
import { estudosRecentes, LINHAS_DA_LEITURA_DO_PAIS } from './pais.mjs';
import { routePath } from './routes.mjs';

/**
 * O TETO DO QUE UMA PÁGINA MOSTRA, E A RAZÃO DO NÚMERO.
 *
 * Oito é o que cabe num ecrã de telefone sem a secção passar a ser a página. A
 * porta «Todas as mudanças» fica por baixo da lista em todas as páginas que a
 * têm, e leva ao registo inteiro.
 */
const TETO_DAS_MUDANCAS = 8;

/** As classes de entrada do livro-razão que são mudanças do que foi publicado. */
const NATUREZAS_DE_MUDANCA = ['correcao', 'atualizacao'];

/* ------------------------------------------------------------------ o lugar */

/** As linhas que cada região nomeia, pelos quatro campos da sua declaração. */
const CAMPOS_DA_REGIAO = ['valor', 'valorHistorico', 'distancia', 'distanciaHistorica'];

/** @type {Map<string, string>} */
const REGIAO_DA_LINHA = new Map();
for (const r of REGIOES) {
  for (const campo of CAMPOS_DA_REGIAO) {
    const id = /** @type {Record<string, unknown>} */ (r)[campo];
    if (typeof id !== 'string') continue;
    const ja = REGIAO_DA_LINHA.get(id);
    if (ja && ja !== r.slug) {
      throw new Error(`mudancas: a linha "${id}" é nomeada por duas regiões, "${ja}" e "${r.slug}".`);
    }
    REGIAO_DA_LINHA.set(id, r.slug);
  }
}

/** As linhas que cada concelho rende no seu relance. Uma linha rendida por mais
 * do que um concelho não é de um lugar: fica sem concelho, e outra declaração
 * decide. */
/** @type {Map<string, string|null>} */
const CONCELHO_DA_LINHA = new Map();
for (const m of MUNICIPIOS_COM_PAGINA) {
  for (const peca of m.relance ?? []) {
    if (!peca.claim) continue;
    const ja = CONCELHO_DA_LINHA.get(peca.claim);
    if (ja === undefined) CONCELHO_DA_LINHA.set(peca.claim, m.slug);
    else if (ja !== m.slug) CONCELHO_DA_LINHA.set(peca.claim, null);
  }
}

/** As linhas do país: as medidas da tabela da carta e as que a leitura cita. */
const LINHAS_DO_PAIS = new Set([...Object.keys(DOMINIO_DAS_MEDIDAS), ...LINHAS_DA_LEITURA_DO_PAIS]);

/** O objeto declarado de cada trabalho do arquivo, pelo seu id de estudo. */
/** @type {Map<string, string>} */
const OBJETO_DO_ESTUDO = new Map();
for (const w of WORKS) if (typeof w.subject === 'string') OBJETO_DO_ESTUDO.set(w.id, w.subject);

/** A chave de Portugal, que é a página do país. */
const PORTUGAL = 'portugal';

/**
 * O lugar de uma chave, com o nome da edição e a porta para a sua página.
 *
 * @param {string} chave `'portugal'`, o slug de uma região ou o de um concelho
 * @param {'pt'|'en'} lang
 * @returns {{ chave: string, nome: string, rota: string }}
 */
function lugarPorChave(chave, lang) {
  if (chave === PORTUGAL) {
    return { chave, nome: ROTULOS_B1[lang].pais, rota: routePath('home', lang) };
  }
  const regiao = REGIOES.find((r) => r.slug === chave);
  if (regiao) {
    return { chave, nome: regiao.nome[lang] ?? regiao.nome.pt, rota: routePath('regiao', lang, { slug: chave }) };
  }
  const concelho = municipioPorSlug(chave);
  if (concelho) {
    return { chave, nome: concelho.nome[lang] ?? concelho.nome.pt, rota: routePath('municipio', lang, { slug: chave }) };
  }
  throw new Error(`mudancas: o lugar "${chave}" não é Portugal, nem uma região, nem um concelho com página.`);
}

/**
 * A que lugar pertence uma linha do livro-razão.
 *
 * Todas as declarações que a alcançam são lidas, e não só a primeira: duas que
 * discordem fecham a construção, porque uma linha filha do lugar errado manda o
 * leitor a uma página que não fala dela.
 *
 * @param {string} id
 * @returns {string|null} a chave do lugar, ou `null` quando nenhuma declaração o diz
 */
function chaveDoLugarDaLinha(id) {
  const declarado = LUGAR_DECLARADO_DAS_LINHAS[id];
  if (declarado) return declarado;
  const linha = getClaim(id);
  const doEstudo = typeof linha.study === 'string' ? OBJETO_DO_ESTUDO.get(linha.study) : undefined;
  const candidatos = [
    REGIAO_DA_LINHA.get(id),
    doEstudo,
    CONCELHO_DA_LINHA.get(id) ?? undefined,
    LINHAS_DO_PAIS.has(id) ? PORTUGAL : undefined,
  ].filter((x) => typeof x === 'string');
  const distintos = [...new Set(candidatos)];
  if (distintos.length > 1) {
    throw new Error(
      `mudancas: a linha "${id}" é declarada de mais do que um lugar (${distintos.join(', ')}). ` +
        `Escreva o lugar certo em src/data/lugar-das-linhas.mjs, com a razão.`,
    );
  }
  return distintos[0] ?? null;
}

/**
 * O lugar de uma linha, já com o nome e a porta.
 *
 * @param {string} id
 * @param {'pt'|'en'} lang
 */
function lugarDaLinha(id, lang) {
  const chave = chaveDoLugarDaLinha(id);
  return chave === null ? null : lugarPorChave(chave, lang);
}

/* --------------------------------------------------------- o registo inteiro */

/**
 * @typedef {object} MudancaDoRegisto
 * @property {'projeto'|'publicacao'|'correcao'} tipo
 * @property {string} data
 * @property {{ chave: string, nome: string, rota: string }} lugar
 * @property {string} chaveDaMudanca a identidade da linha, que o portão reconstrói
 */

/** As mudanças declaradas do projeto. Pertencem ao país: são do sítio inteiro.
 * @param {'pt'|'en'} lang */
function mudancasDeclaradas(lang) {
  return MUDANCAS_DO_PROJETO.map((e) => ({
    ...e,
    tipo: /** @type {const} */ ('projeto'),
    lugar: lugarPorChave(PORTUGAL, lang),
    chaveDaMudanca: `projeto|${e.id}`,
  }));
}

/** Os estudos publicados. O lugar é o objeto declarado do trabalho; um estudo
 * sem objeto é sobre o país.
 * @param {'pt'|'en'} lang */
function publicacoes(lang) {
  return estudosRecentes(lang).map((e) => {
    if (!e.data) throw new Error(`Publicação sem data: ${e.work.slug}.`);
    return {
      tipo: /** @type {const} */ ('publicacao'),
      data: e.data,
      estudo: e,
      lugar: lugarPorChave(
        typeof e.work.subject === 'string' ? e.work.subject : PORTUGAL,
        lang,
      ),
      chaveDaMudanca: `publicacao|${e.work.slug}`,
    };
  });
}

/**
 * As correções e as atualizações das linhas, uma por entrada do livro-razão.
 *
 * UMA ENTRADA, UMA LINHA (§1.117, a segunda passagem de correção): o dia em que
 * a mesma linha foi corrigida duas vezes rende as duas, porque o livro guarda as
 * duas e a C1 conta-as uma a uma.
 *
 * @param {'pt'|'en'} lang
 */
function correcoesDasLinhas(lang) {
  return entradasDoRegisto()
    .filter((e) => NATUREZAS_DE_MUDANCA.includes(e.kind))
    .map((e) => {
      if (!e.date) throw new Error(`Correção sem data: ${e.claimId}, entrada ${e.n}.`);
      const linha = getClaim(e.claimId);
      const lugar = lugarDaLinha(e.claimId, lang);
      if (!lugar) {
        throw new Error(
          `mudancas: a linha "${e.claimId}" mudou e nenhuma declaração diz de que lugar é. ` +
            `Escreva-o em src/data/lugar-das-linhas.mjs, com a razão.`,
        );
      }
      return {
        tipo: /** @type {const} */ ('correcao'),
        kind: e.kind,
        data: e.date,
        n: e.n,
        claim: e.claimId,
        /* O nome da medida pela escada do cartão, com o nome declarado da linha
           derivada à frente: é ele que diz «Estudos publicados sobre Évora» onde
           o título do documento diria «Arquivo de estudos». */
        nome: nomeDaLinhaDerivada(linha, lang) ?? nomeDoCartao(linha, lang),
        antes: e.old_value,
        depois: e.new_value,
        unidade: typeof linha.unit === 'string' ? linha.unit : null,
        motivo: motivoDaEntrada(e, lang),
        lugar,
        chaveDaMudanca: `correcao|${e.claimId}|${e.n}`,
      };
    });
}

/** A ordem do registo e de todas as listas: da mais recente para a mais antiga,
 * e dentro do mesmo dia uma ordem estável que não depende da leitura dos
 * ficheiros. */
/** @type {Record<string, number>} */
const ORDEM_DAS_CLASSES = { projeto: 0, publicacao: 1, correcao: 2 };
/** @param {MudancaDoRegisto} a @param {MudancaDoRegisto} b */
function porData(a, b) {
  return (
    b.data.localeCompare(a.data) ||
    ORDEM_DAS_CLASSES[a.tipo] - ORDEM_DAS_CLASSES[b.tipo] ||
    a.chaveDaMudanca.localeCompare(b.chaveDaMudanca)
  );
}

/**
 * O REGISTO: todas as mudanças, de todas as classes e de todos os lugares.
 *
 * @param {'pt'|'en'} lang
 */
export function mudancasDoRegisto(lang) {
  return [...mudancasDeclaradas(lang), ...publicacoes(lang), ...correcoesDasLinhas(lang)].sort(porData);
}

/* ----------------------------------------------------------------- os âmbitos */

/**
 * O ÂMBITO DA PÁGINA DO PAÍS: as correções das linhas do país e as mudanças
 * declaradas do projeto.
 *
 * AS PUBLICAÇÕES SAÍRAM DAQUI a 22.09.2026, pela leitura do lugar de direção
 * sobre a primeira passagem deste bloco. Entravam «de qualquer lugar», e o
 * resultado medido era sete das oito linhas a dizer «Estudo publicado · …»,
 * três delas os mesmos três estudos que a secção «Estudos recentes», logo
 * acima, já mostra — que é, reduzida, a repetição que o diretor apontou na
 * lista de trinta. A notícia de um estudo é essa secção; a lista de todos é a
 * página dos estudos; e o registo continua a guardar cada publicação com a sua
 * data. O que fica aqui é o que mudou NO PAÍS: hoje uma linha, a mudança
 * declarada de 21.09. Uma linha honesta vale mais do que sete repetidas.
 *
 * @param {MudancaDoRegisto} m
 */
function noAmbitoDoPais(m) {
  return m.tipo === 'projeto' || (m.tipo === 'correcao' && m.lugar.chave === PORTUGAL);
}

/**
 * O ÂMBITO DE UMA PÁGINA DE LUGAR: as mudanças das suas próprias linhas.
 *
 * OS ESTUDOS SOBRE O LUGAR NÃO ENTRAM AQUI, e a razão é a que `lugar.mjs` já
 * escrevia: a data de publicação de cada estudo lê-se na linha dele, na secção
 * «Estudos sobre este lugar», logo acima nesta mesma página; repeti-la em «O que
 * mudou» era dizer duas vezes a mesma coisa. Na página do país não há essa
 * secção com todas as datas, e por isso lá as publicações entram.
 *
 * @param {MudancaDoRegisto} m
 * @param {string} chave
 */
function noAmbitoDoLugar(m, chave) {
  return m.tipo === 'correcao' && m.lugar.chave === chave;
}

/**
 * As mudanças da página do país, já com o teto.
 *
 * @param {'pt'|'en'} lang
 */
export function mudancasDoPais(lang) {
  return mudancasDoRegisto(lang).filter(noAmbitoDoPais).slice(0, TETO_DAS_MUDANCAS);
}

/**
 * As mudanças da página de um lugar, já com o teto.
 *
 * @param {string} chave o slug do concelho ou da região
 * @param {'pt'|'en'} lang
 */
export function mudancasDoLugar(chave, lang) {
  return mudancasDoRegisto(lang)
    .filter((m) => noAmbitoDoLugar(m, chave))
    .slice(0, TETO_DAS_MUDANCAS);
}
