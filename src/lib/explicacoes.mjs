/**
 * ===========================================================================
 * AS EXPLICAÇÕES · o resolvedor (bloco EX1, 05.10.2026)
 * ===========================================================================
 *
 * O QUE FAZ, e é uma coisa só: para uma explicação declarada em `src/data/explicacoes/` e uma edição,
 * lê a declaração contra os valores selados do livro-razão e devolve o que a página rende: o título, os
 * parágrafos (cada um uma lista plana de pedaços), as figuras, as linhas citadas e os sinais (as frases
 * guardadas por condições que deixaram de ser verdadeiras). Não usa Astro: a vista rende o que isto
 * devolve, o guião dos sinais lê o mesmo, e a célula da explicação (`tests/explicacoes/explicacao.mjs`)
 * reconta o texto, os ramos e as condições por uma conta sua, sem chamar esta função.
 *
 * A GRAMÁTICA É A DAS FRASES DA PRIMEIRA PÁGINA (`src/lib/primeira-pagina.mjs`), com quatro pedaços:
 *   · `{ nome: id, inicial? }` · o nome declarado da função (ou do ministério) de uma linha: o pedaço do
 *     nome do projeto da linha (`NOMES_OE1`, gerado pelo motor em `publisher/oe1_nomes.py`) depois do
 *     prefixo da família («… que vai para », «… going to »). É o que o texto do brief chama
 *     «[nome: id]»; um nome sem o prefixo é um defeito da declaração e fecha a construção;
 *   · `{ sinal: id, positivo, negativo, zero? }` · a palavra que o sinal do valor da linha decide; um
 *     valor de sinal sem ramo declarado fecha a construção;
 *   · `{ se: [condições], partes }` · palavras que só se rendem enquanto as condições forem verdadeiras;
 *     uma condição falsa tira as palavras e deixa um sinal, e nunca fecha a construção (o §5.2 do brief
 *     PP1: uma atualização dos dados não faz falhar a construção);
 *   · a condição `{ primeiros: [a, b, …], de: [ids] }` · as linhas nomeadas são as maiores do grupo, por
 *     esta ordem e sem empates; com `{ periodo: id, mes }` (a da primeira página) e `{ sem_linhas: padrão }`
 *     (nenhum identificador do livro casa com o padrão);
 *   · `{ maiores: [ids], familia, n, frase, antes, abre, sufixo, fecha, entre, ultimo }` (desde o EX1-b, 06.10.2026,
 *     a decisão do lugar de direção sobre a I213) · as `n` linhas de maior valor da lista, por ordem decrescente,
 *     cada uma com o nome declarado e o valor ao lado (o sufixo só no primeiro), entre a `frase` que as apresenta e
 *     as ligações declaradas. Um identificador fora da família (`familia`, a expressão que as linhas têm de casar),
 *     uma linha repetida, um `n` fora da lista ou uma palavra com algarismos são defeitos da declaração e fecham a
 *     construção; uma linha da família que a lista não tem (o motor publicou outra), uma linha da lista que saiu do
 *     livro, um valor que não se lê ou um empate na fronteira dos `n` tiram as palavras todas e deixam um sinal,
 *     como uma condição falsa.
 *
 * O NOME DECLARADO tem duas formas no nome do projeto (`FORMAS_DO_NOME`): o que vem depois do prefixo da família
 * («… que vai para », as funções e os ministérios), e, desde o EX1-b, o que fica entre o começo e o fim do nome de um
 * programa da execução («Despesa executada do programa … (», «Executed expenditure of the … programme (»).
 *
 * AS PORTAS DO FIM (`portas`, desde o EX1-b): `{ rota: 'livro' }`, os números e as fontes, e
 * `{ rota, entrada }`, a página de um assunto, com o nome que `ENTRADAS` lhe dá.
 *
 * OS NÚMEROS COMPARAM-SE COMO NÚMEROS, por `parsePtNumber()`, que lê «211 891 565 579» e «−58,3».
 */

import { EXPLICACOES } from '../data/explicacoes/index.mjs';
import { NOMES_OE1 } from '../data/medidas-oe1.mjs';
import { hasClaim, getClaim, parsePtNumber, allClaims } from './ledger.mjs';
import { dataDaCasa } from './datas.mjs';
import { modeloDasBarrasDoLivro } from './formas/barras-do-livro.mjs';
import { routePath } from './routes.mjs';
import { t } from '../i18n/strings.mjs';
import { ENTRADAS } from '../data/primeira-pagina.mjs';

/** Os pedaços calculados que a gramática das explicações conhece, e mais nenhum. */
export const CHAVES_DA_EXPLICACAO = /** @type {const} */ (['claim', 'periodo', 'nome', 'sinal', 'se', 'maiores']);
/** O prefixo que separa, no nome do projeto de uma linha, a família do nome da função ou do ministério. */
export const PREFIXO_DO_NOME = /** @type {const} */ ({ pt: ' que vai para ', en: ' going to ' });
/**
 * AS FORMAS DO NOME DECLARADO no nome do projeto de uma linha, pela ordem em que se tentam: o que vem depois do prefixo
 * (as funções e os ministérios), e o que fica entre o começo e o fim (os programas da execução, desde o EX1-b).
 * @type {readonly ({ familia: string, pt: { depois: string }, en: { depois: string } } | { familia: string, pt: { comeca: string, acaba: string }, en: { comeca: string, acaba: string } })[]}
 */
export const FORMAS_DO_NOME = [
  { familia: 'as funções e os ministérios', pt: { depois: PREFIXO_DO_NOME.pt }, en: { depois: PREFIXO_DO_NOME.en } },
  { familia: 'os programas da execução', pt: { comeca: 'Despesa executada do programa ', acaba: ' (' }, en: { comeca: 'Executed expenditure of the ', acaba: ' programme (' } },
];
/** As palavras declaradas de um token `maiores`, e mais nenhuma. */
export const PALAVRAS_DOS_MAIORES = /** @type {const} */ (['frase', 'antes', 'abre', 'sufixo', 'fecha', 'entre', 'ultimo']);
/** O artigo à cabeça do nome de um ministério, que o rótulo de uma barra não leva. */
const ARTIGO_DO_ROTULO = { pt: /^(?:o|a|os|as) /, en: /^the / };
/** As formas das figuras de uma explicação: só a das barras das linhas do livro. */
export const FORMAS_DAS_FIGURAS = /** @type {const} */ (['barras-do-livro']);

/**
 * @typedef {string
 *   | { claim: string, sufixo?: string }
 *   | { data: { id: string, campo: 'reference_date', valor: string } }
 *   | { nome: { id: string, texto: string } }
 * } PedacoDaExplicacao
 * @typedef {{ caminho: string, pedacos: PedacoDaExplicacao[] }} ParagrafoResolvido
 * @typedef {{ tipo: 'paragrafo', caminho: string, pedacos: PedacoDaExplicacao[] } | { tipo: 'figura', caminho: string, modelo: ReturnType<typeof modeloDasBarrasDoLivro> }} BlocoDaSeccao
 * @typedef {{ caminho: string, condicoes: { ok: boolean, texto: string }[] }} SinalDaExplicacao
 */

/** @param {string} onde @param {string} razao */
function defeito(onde, razao) {
  return new Error(`explicação · ${onde}: ${razao} Um defeito da declaração fecha a construção; uma condição falsa tira as palavras que guarda e deixa um sinal.`);
}

/** A explicação de um slug, ou um erro. @param {string} slug */
export function explicacaoDeclarada(slug) {
  const e = EXPLICACOES.find((x) => x.slug === slug);
  if (!e) throw new Error(`explicação: não há explicação declarada com o slug «${slug}».`);
  return e;
}

/** Os slugs das explicações, pela ordem da lista (a escrita mais recente primeiro). */
export function slugsDasExplicacoes() {
  return EXPLICACOES.map((e) => e.slug);
}

/** A explicação mais recente, pela data de escrita. */
export function explicacaoMaisRecente() {
  return EXPLICACOES[0] ?? null;
}

/**
 * O NOME DECLARADO DA FUNÇÃO, DO MINISTÉRIO OU DO PROGRAMA DE UMA LINHA, pela primeira forma de `FORMAS_DO_NOME` que o
 * nome do projeto tenha.
 * @param {string} id @param {'pt'|'en'} lang
 */
export function nomeDaLinhaNaExplicacao(id, lang) {
  const nome = /** @type {Record<string, { pt: string, en: string }>} */ (NOMES_OE1)[id]?.[lang];
  if (typeof nome !== 'string') throw defeito(id, `a linha não tem nome do projeto em «${lang}» (src/data/medidas-oe1.mjs).`);
  /** @type {string|null} */
  let resto = null;
  for (const forma of FORMAS_DO_NOME) {
    const f = /** @type {any} */ (forma[lang]);
    if (typeof f.depois === 'string') {
      const i = nome.indexOf(f.depois);
      if (i >= 0) { resto = nome.slice(i + f.depois.length); break; }
    } else if (nome.startsWith(f.comeca)) {
      const k = nome.indexOf(f.acaba, f.comeca.length);
      if (k > f.comeca.length) { resto = nome.slice(f.comeca.length, k); break; }
    }
  }
  if (resto === null) throw defeito(id, `o nome do projeto «${nome}» não tem nenhuma das formas do nome declarado (FORMAS_DO_NOME).`);
  if (!resto || /\d/.test(resto)) throw defeito(id, `o nome tirado do nome do projeto («${resto}») está vazio ou traz um algarismo.`);
  return resto;
}

/** O rótulo de uma barra: o nome declarado sem o artigo. @param {string} id @param {'pt'|'en'} lang */
export function rotuloDaLinhaNaExplicacao(id, lang) {
  return nomeDaLinhaNaExplicacao(id, lang).replace(ARTIGO_DO_ROTULO[lang], '');
}

/** O valor de uma linha como número, ou `null` quando a linha não existe ou o valor não se lê. @param {string} id */
function numero(id) {
  if (!hasClaim(id)) return null;
  return parsePtNumber(getClaim(id).value);
}

/**
 * AS CONDIÇÕES, avaliadas com os valores selados. Cada uma devolve se é verdadeira e a frase do porquê.
 * @param {any} c
 * @returns {{ ok: boolean, texto: string }}
 */
export function avaliarCondicaoDaExplicacao(c) {
  if (Array.isArray(c?.primeiros) && Array.isArray(c?.de)) {
    if (!c.primeiros.length || c.primeiros.some((/** @type {string} */ id) => !c.de.includes(id))) {
      throw defeito('uma condição', `«primeiros» tem de nomear linhas do grupo (${JSON.stringify(c.primeiros)}).`);
    }
    const valores = new Map(c.de.map((/** @type {string} */ id) => [id, numero(id)]));
    const ausentes = c.de.filter((/** @type {string} */ id) => valores.get(id) === null);
    const texto = `${c.primeiros.join(' > ')} > as outras ${c.de.length - c.primeiros.length} do grupo`;
    if (ausentes.length) return { ok: false, texto: `${texto}: sem valor legível em ${ausentes.join(', ')}` };
    const nums = c.primeiros.map((/** @type {string} */ id) => /** @type {number} */ (valores.get(id)));
    for (let i = 1; i < nums.length; i++) if (!(nums[i - 1] > nums[i])) return { ok: false, texto };
    const outros = c.de.filter((/** @type {string} */ id) => !c.primeiros.includes(id)).map((/** @type {string} */ id) => /** @type {number} */ (valores.get(id)));
    const ultimo = nums[nums.length - 1];
    return { ok: outros.every((/** @type {number} */ v) => ultimo > v), texto };
  }
  if (typeof c?.periodo === 'string' && typeof c?.mes === 'number') {
    const r = hasClaim(c.periodo) ? String(getClaim(c.periodo).reference_date ?? '') : '';
    const m = /^\d{4}-(\d{2})$/.exec(r);
    return { ok: Boolean(m) && Number(m?.[1]) === c.mes, texto: `o mês de ${c.periodo} (${r || 'sem linha'}) é ${c.mes}` };
  }
  if (typeof c?.sem_linhas === 'string') {
    const padrao = new RegExp(c.sem_linhas);
    const casam = [...allClaims()].filter((l) => padrao.test(String(l.id)));
    return { ok: casam.length === 0, texto: `nenhuma linha casa com /${c.sem_linhas}/ (${casam.length} casam)` };
  }
  throw defeito('uma condição', `forma desconhecida: ${JSON.stringify(c)}.`);
}

/**
 * O TOKEN `maiores` (EX1-b): confere a declaração, lê os valores e devolve os pedaços das `n` maiores linhas, por ordem
 * decrescente, ou `null` com um sinal quando os dados não deixam decidir (uma linha da família fora da lista, uma linha
 * da lista fora do livro, um valor que não se lê, um empate na fronteira).
 * @param {Record<string, any>} o @param {string} aqui @param {{ linhas: Set<string>, sinais: SinalDaExplicacao[] }} ctx
 * @returns {unknown[]|null}
 */
export function pedacosDosMaiores(o, aqui, ctx) {
  const ids = o.maiores;
  if (!Array.isArray(ids) || !ids.length || ids.some((x) => typeof x !== 'string')) throw defeito(aqui, '«maiores» pede uma lista de linhas.');
  if (new Set(ids).size !== ids.length) throw defeito(aqui, 'a lista de «maiores» repete uma linha.');
  if (typeof o.familia !== 'string' || !o.familia) throw defeito(aqui, '«maiores» pede a família (`familia`), a expressão que as linhas da lista têm de casar.');
  const familia = new RegExp(o.familia);
  const fora = ids.filter((/** @type {string} */ id) => !familia.test(id));
  if (fora.length) throw defeito(aqui, `a lista de «maiores» tem linhas fora da família /${o.familia}/: ${fora.join(', ')}.`);
  if (!Number.isInteger(o.n) || o.n < 1 || o.n > ids.length) throw defeito(aqui, `«n» tem de ser um inteiro entre 1 e ${ids.length}.`);
  for (const k of PALAVRAS_DOS_MAIORES) if (typeof o[k] !== 'string' || /\d/.test(o[k])) throw defeito(aqui, `a palavra «${k}» de «maiores» falta ou traz um algarismo.`);
  const doLivro = [...allClaims()].map((l) => String(l.id)).filter((id) => familia.test(id));
  const novas = doLivro.filter((id) => !ids.includes(id));
  const saidas = ids.filter((/** @type {string} */ id) => !hasClaim(id));
  const valores = ids.filter((/** @type {string} */ id) => hasClaim(id)).map((/** @type {string} */ id) => ({ id, v: numero(id) }));
  const ilegiveis = valores.filter((x) => x.v === null).map((x) => x.id);
  const ordem = /** @type {{ id: string, v: number }[]} */ (valores.filter((x) => x.v !== null)).sort((a, b) => b.v - a.v || a.id.localeCompare(b.id));
  const empate = ordem.length > o.n && ordem[o.n - 1].v === ordem[o.n].v;
  const problemas = [
    novas.length ? `linhas da família /${o.familia}/ que a lista não tem: ${novas.join(', ')}` : null,
    saidas.length ? `linhas da lista que o livro não tem: ${saidas.join(', ')}` : null,
    ilegiveis.length ? `sem valor legível em ${ilegiveis.join(', ')}` : null,
    empate ? `empate na fronteira das ${o.n} maiores: ${ordem[o.n - 1].id} e ${ordem[o.n].id}` : null,
    ordem.length < o.n ? `só ${ordem.length} linhas com valor legível, e pedem-se ${o.n}` : null,
  ].filter((x) => x !== null);
  if (problemas.length) {
    ctx.sinais.push({ caminho: aqui, condicoes: problemas.map((texto) => ({ ok: false, texto: String(texto) })) });
    return null;
  }
  /** @type {unknown[]} */
  const pecas = [o.frase];
  ordem.slice(0, o.n).forEach((x, k) => {
    if (k > 0) pecas.push(k === o.n - 1 ? o.ultimo : o.entre);
    pecas.push(o.antes, { nome: x.id }, o.abre, k === 0 && o.sufixo ? { claim: x.id, sufixo: o.sufixo } : { claim: x.id }, o.fecha);
  });
  return pecas;
}

/**
 * OS PEDAÇOS DE UMA PARTE DECLARADA, resolvidos numa edição.
 * @param {unknown} partes @param {'pt'|'en'} lang @param {string} onde
 * @param {{ linhas: Set<string>, sinais: SinalDaExplicacao[] }} ctx
 * @returns {PedacoDaExplicacao[]}
 */
function resolver(partes, lang, onde, ctx) {
  const lista = typeof partes === 'string' ? [partes] : partes;
  if (!Array.isArray(lista)) throw defeito(onde, 'a parte não é uma cadeia nem uma lista.');
  /** @type {PedacoDaExplicacao[]} */
  const out = [];
  lista.forEach((p, i) => {
    const aqui = `${onde}[${i}]`;
    if (typeof p === 'string') {
      if (/\d/.test(p)) throw defeito(aqui, `a palavra fixa «${p}» traz um algarismo; os algarismos entram por { claim } ou { periodo }.`);
      out.push(p);
      return;
    }
    const o = /** @type {Record<string, any>} */ (p ?? {});
    const chave = CHAVES_DA_EXPLICACAO.find((k) => k in o);
    if (!chave) throw defeito(aqui, `um pedaço de tipo desconhecido (${Object.keys(o).join(', ')}).`);
    if (chave === 'claim') {
      if (!hasClaim(o.claim)) throw defeito(aqui, `a linha «${o.claim}» não está no livro-razão.`);
      if ('sufixo' in o && /\d/.test(String(o.sufixo))) throw defeito(aqui, 'o sufixo traz um algarismo.');
      ctx.linhas.add(o.claim);
      out.push(o.sufixo ? { claim: o.claim, sufixo: String(o.sufixo) } : { claim: o.claim });
      return;
    }
    if (chave === 'periodo') {
      if (!hasClaim(o.periodo)) throw defeito(aqui, `a linha «${o.periodo}» não está no livro-razão.`);
      const valor = getClaim(o.periodo).reference_date;
      if (typeof valor !== 'string' || !valor) throw defeito(aqui, `a linha «${o.periodo}» não tem período de referência.`);
      ctx.linhas.add(o.periodo);
      out.push({ data: { id: o.periodo, campo: 'reference_date', valor } });
      return;
    }
    if (chave === 'nome') {
      if (!hasClaim(o.nome)) throw defeito(aqui, `a linha «${o.nome}» não está no livro-razão.`);
      let texto = nomeDaLinhaNaExplicacao(o.nome, lang);
      if (o.inicial === true) texto = texto.charAt(0).toLocaleUpperCase(lang === 'pt' ? 'pt-PT' : 'en') + texto.slice(1);
      ctx.linhas.add(o.nome);
      out.push({ nome: { id: o.nome, texto } });
      return;
    }
    if (chave === 'sinal') {
      const v = numero(o.sinal);
      if (v === null) throw defeito(aqui, `o valor de «${o.sinal}» não se lê como número.`);
      const ramo = v > 0 ? 'positivo' : v < 0 ? 'negativo' : 'zero';
      if (!(ramo in o)) throw defeito(aqui, `o valor de «${o.sinal}» pede o ramo «${ramo}», e a declaração não o tem.`);
      for (const r of ['positivo', 'negativo']) if (!(r in o)) throw defeito(aqui, `falta o ramo «${r}».`);
      ctx.linhas.add(o.sinal);
      out.push(...resolver(o[ramo], lang, `${aqui}.${ramo}`, ctx));
      return;
    }
    if (chave === 'maiores') {
      const pecas = pedacosDosMaiores(o, aqui, ctx);
      if (pecas) out.push(...resolver(pecas, lang, `${aqui}.maiores`, ctx));
      return;
    }
    /* chave === 'se' */
    if (!Array.isArray(o.se) || !o.se.length) throw defeito(aqui, '«se» pede uma lista de condições.');
    const condicoes = o.se.map((/** @type {any} */ c) => avaliarCondicaoDaExplicacao(c));
    if (condicoes.every((c) => c.ok)) out.push(...resolver(o.partes, lang, `${aqui}.se`, ctx));
    else ctx.sinais.push({ caminho: aqui, condicoes });
  });
  /* Os pedaços de texto seguidos juntam-se num só. */
  /** @type {PedacoDaExplicacao[]} */
  const juntos = [];
  for (const p of out) {
    const ultimo = juntos[juntos.length - 1];
    if (typeof p === 'string' && typeof ultimo === 'string') juntos[juntos.length - 1] = ultimo + p;
    else if (p !== '') juntos.push(p);
  }
  return juntos;
}

/**
 * AS PORTAS DO FIM DE UMA EXPLICAÇÃO, numa edição: o destino e o nome de cada uma (EX1-b). Sem `portas` declaradas, a
 * porta dos números e das fontes, que todas levam.
 * @param {any} e @param {'pt'|'en'} lang
 * @returns {{ rota: string, href: string, texto: string, entrada?: string }[]}
 */
export function portasDaExplicacao(e, lang) {
  const s = t(lang);
  const declaradas = Array.isArray(e.portas) ? e.portas : [{ rota: 'livro' }];
  if (!declaradas.some((/** @type {any} */ p) => p?.rota === 'livro' && !p.entrada)) throw defeito('portas', 'uma explicação leva sempre a porta dos números e das fontes (`{ rota: \'livro\' }`).');
  return declaradas.map((/** @type {any} */ p, /** @type {number} */ i) => {
    if (p?.rota === 'livro' && !p.entrada) return { rota: 'livro', href: routePath('livro', lang), texto: s.nav.livro };
    if (typeof p?.rota === 'string' && typeof p?.entrada === 'string') {
      const entrada = /** @type {any[]} */ (ENTRADAS).find((x) => x.id === p.entrada);
      if (!entrada || typeof entrada.nome?.[lang] !== 'string') throw defeito(`portas[${i}]`, `o assunto «${p.entrada}» não está em ENTRADAS (src/data/primeira-pagina.mjs).`);
      return { rota: p.rota, entrada: p.entrada, href: routePath(p.rota, lang), texto: entrada.nome[lang] };
    }
    throw defeito(`portas[${i}]`, `uma porta de forma desconhecida: ${JSON.stringify(p)}.`);
  });
}

/**
 * UMA EXPLICAÇÃO, numa edição.
 * @param {string} slug @param {'pt'|'en'} lang
 */
export function explicacaoResolvida(slug, lang) {
  const e = /** @type {any} */ (explicacaoDeclarada(slug));
  /** @type {{ linhas: Set<string>, sinais: SinalDaExplicacao[] }} */
  const ctx = { linhas: new Set(), sinais: [] };
  const titulo = resolver(e.titulo[lang], lang, 'titulo', ctx);
  const paragrafo = (/** @type {any} */ p, /** @type {string} */ caminho) => {
    if (p.se) throw defeito(caminho, 'um parágrafo inteiro não leva «se»: a condição vai nas palavras que guarda.');
    return { caminho, pedacos: resolver(p[lang], lang, caminho, ctx) };
  };
  const abertura = e.abertura.map((/** @type {any} */ p, /** @type {number} */ i) => paragrafo(p, `abertura[${i}]`)).filter((/** @type {ParagrafoResolvido} */ p) => p.pedacos.length);
  const seccoes = e.seccoes.map((/** @type {any} */ s, /** @type {number} */ i) => {
    if (typeof s.titulo?.[lang] !== 'string' || /\d/.test(s.titulo[lang])) throw defeito(`seccoes[${i}]`, 'o título da secção falta ou traz um algarismo.');
    /** @type {BlocoDaSeccao[]} */
    const blocos = s.conteudo.map((/** @type {any} */ b, /** @type {number} */ j) => {
      const caminho = `seccoes[${i}].conteudo[${j}]`;
      if (b.figura) {
        if (!FORMAS_DAS_FIGURAS.includes(b.figura.forma)) throw defeito(caminho, `a forma «${b.figura.forma}» não é das figuras das explicações.`);
        if (typeof b.figura.titulo?.[lang] !== 'string' || /\d/.test(b.figura.titulo[lang])) throw defeito(caminho, 'o título da figura falta ou traz um algarismo.');
        for (const id of b.figura.linhas) ctx.linhas.add(id);
        return { tipo: 'figura', caminho, modelo: modeloDasBarrasDoLivro(b.figura, lang) };
      }
      return { tipo: 'paragrafo', ...paragrafo(b.paragrafo, `${caminho}.paragrafo`) };
    }).filter((/** @type {BlocoDaSeccao} */ b) => b.tipo === 'figura' || b.pedacos.length);
    return { id: String(s.id), titulo: s.titulo[lang], blocos };
  });
  const naoDiz = e.naoDiz.map((/** @type {any} */ p, /** @type {number} */ i) => paragrafo(p, `naoDiz[${i}]`)).filter((/** @type {ParagrafoResolvido} */ p) => p.pedacos.length);
  return {
    slug: e.slug, escrita: e.escrita, lang,
    titulo, tituloTexto: textoDosPedacosDaExplicacao(titulo, lang),
    abertura, seccoes, naoDiz, portas: portasDaExplicacao(e, lang),
    linhas: [...ctx.linhas], sinais: ctx.sinais,
  };
}

/**
 * O TEXTO DE UMA LISTA DE PEDAÇOS, como a página o rende: o valor de uma linha como o `<Claim>` o escreve
 * (o valor e o sufixo), as datas na forma da casa e os nomes. É o que vai para o `<title>`, e o que a
 * célula compara com o seu próprio texto.
 * @param {PedacoDaExplicacao[]} pedacos @param {'pt'|'en'} lang
 */
export function textoDosPedacosDaExplicacao(pedacos, lang) {
  return pedacos.map((p) => {
    if (typeof p === 'string') return p;
    if ('claim' in p) return `${getClaim(p.claim).value}${p.sufixo ?? ''}`;
    if ('data' in p) return dataDaCasa(p.data.valor, lang);
    return p.nome.texto;
  }).join('');
}

/**
 * OS SINAIS DAS EXPLICAÇÕES PARA O LUGAR DE DIREÇÃO: cada frase guardada que saiu, e porquê, na edição
 * portuguesa (as condições não dependem da língua).
 */
export function sinaisDasExplicacoes() {
  return EXPLICACOES.map((e) => ({ explicacao: e.slug, sinais: explicacaoResolvida(e.slug, 'pt').sinais }));
}
