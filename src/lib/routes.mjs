/**
 * Tabela de rotas — uma só, partilhada por:
 *   - as páginas (navegação, ligação para a outra língua)
 *   - o <head> (canonical + hreflang)
 *   - o sitemap (astro.config.mjs)
 *
 * PT é primário em / ; EN espelha em /en/.
 * Nunca duas edições mantidas à mão: um caminho PT tem sempre um par EN.
 */

/**
 * @typedef {{ lang: Lingua, hreflang: string, path: string }} Alternativa
 * @typedef {{ key: ChaveDeRota, lang: Lingua, params: { slug?: string } }} Rota
 */

export const LANGS = /** @type {const} */ (['pt', 'en']);

/** Valores usados no atributo hreflang. */
export const HREFLANG = { pt: 'pt-PT', en: 'en' };

/** A língua primária: recebe também o x-default. */
export const PRIMARY_LANG = 'pt';

/**
 * Cada chave é uma página lógica. `:slug` é o único parâmetro suportado.
 *
 * `municipio` é a página do observatório sobre um município: as medidas que as
 * fontes centrais publicam para aquele concelho, a leitura breve, e o fundo com
 * o método, as ressalvas e os trabalhos que o tomaram por objecto. O slug é o
 * nome do concelho sem acentos — o mesmo que os estudos já usam. Hoje só existe
 * `evora`; o tipo de página foi desenhado para os 308 e a lista está em
 * src/data/municipios.mjs, não escrita à mão num gabarito.
 *
 * `documento` não é uma página deste sítio: é o estudo original, alojado tal
 * como foi publicado, com uma faixa nossa no topo e mais nada. Vive debaixo do
 * endereço do estudo porque é do estudo que ele é — ver src/lib/documentos.mjs.
 *
 * `linha` é o endereço de uma afirmação do livro-razão, e o slug é o id da
 * própria afirmação — que o validador já obriga a ser minúsculas, algarismos e
 * hífenes. É para aqui que aponta cada selo de proveniência: o Método promete,
 * nas duas línguas, que o selo é a porta para a linha, e sem esta rota a
 * promessa era falsa (auditoria de 13.08.2026, F1).
 */
export const ROUTES = {
  home: { pt: '/', en: '/en' },
  /**
   * A página que diz a ideia e pára. O texto é da direção, está em
   * `src/data/sobre.mjs` e o portão compara-o com o que a página rende.
   * É aqui que vive a autoria, desde que o rodapé passou a ser navegação só:
   * por isso todas as páginas construídas têm de trazer a porta para aqui, e
   * o portão conta-a (DECISIONS §1.39).
   */
  sobre: { pt: '/sobre', en: '/en/about' },
  metodo: { pt: '/metodo', en: '/en/method' },
  /**
   * O registo de correções, que vivia dentro do Método. Uma política tem uma
   * casa só: a política em três naturezas, o registo lido do livro-razão e a
   * caixa para escrever. `/metodo#correcoes` continua a existir e aponta para
   * aqui — as páginas que estiveram no ar ganham reencaminhamento, não
   * apagamento (§1.29).
   */
  correcoes: { pt: '/correcoes', en: '/en/corrections' },
  estudos: { pt: '/estudos', en: '/en/studies' },
  estudo: { pt: '/estudos/:slug', en: '/en/studies/:slug' },
  documento: { pt: '/estudos/:slug/documento', en: '/en/studies/:slug/document' },
  /**
   * `texto` é o documento do estudo composto no gabarito da casa, a partir do
   * registo de conteúdo que o motor escreve e de mais nada. Não é uma leitura
   * da casa sobre o trabalho — isso é a página do estudo: é uma **transcrição
   * de um documento fixado**, e cada algarismo dela entra pela nona origem,
   * `data-registo`, comparada carácter a carácter com o registo.
   *
   * Só existem as páginas que têm registo: o `getStaticPaths` sai de
   * `todosOsRegistos()` e não de `WORKS`, porque uma leitura sem registo não
   * tem o que renderizar. Chama-se `texto`/`text` e não `leitura`/`reading` por
   * decisão do diretor de 24.08.2026 (a sexta das onze): «Leitura» colide com
   * «Leitura breve», que é uma das duas densidades da Emenda 2 e um rótulo
   * visível na página do estudo. Ver DECISIONS §1.64.
   */
  texto: { pt: '/estudos/:slug/texto', en: '/en/studies/:slug/text' },
  /**
   * O índice dos concelhos. Existe porque o tipo de página do município é para
   * os 308 e só um tem página: sem índice, os outros 307 não têm endereço
   * nenhum e `/municipios` devolvia 404 — a porta mais óbvia do sítio, fechada
   * (BRIEF-confianca §4.2 (b)). Ver DECISIONS §1.36, item 9.
   */
  municipios: { pt: '/municipios', en: '/en/municipalities' },
  municipio: { pt: '/municipios/:slug', en: '/en/municipalities/:slug' },
  /**
   * AS 29 UNIDADES DA CARTA, E A PÁGINA DE CADA UMA (Emenda 20, 27.08.2026).
   *
   * O mapa da primeira página deixou de ser 308 pontos e passou a ser as 29
   * unidades da Carta como áreas: os 18 distritos, as duas ilhas da Madeira e as
   * nove dos Açores. Cada área é a porta da sua página, e a página mostra os
   * concelhos daquela unidade como áreas e como lista.
   *
   * `/distritos/<slug>` E NUNCA `/municipios/<slug>`, e a razão é uma colisão
   * medida: `lisboa` é o slug de um distrito e o slug de um concelho, e um
   * endereço não pode abrir os dois. As 29 unidades têm por isso uma família de
   * endereços própria. O slug de cada uma é o `slugDeConcelho()` da casa sobre o
   * nome que a Carta lhe dá, e a lista está escrita no manifesto do motor, que o
   * `check:mapa` reconfere contra a função do sítio.
   *
   * O ÍNDICE EXISTE PELA MESMA RAZÃO QUE O DOS CONCELHOS (§1.36, item 9): sem
   * ele, `/distritos` devolvia 404 por baixo de 29 páginas que existem, e o
   * cabeçalho de grupo de `/municipios` levaria a uma família de páginas sem
   * porta comum. É uma lista, e não leva mapa: o mapa é a primeira página.
   */
  distritos: { pt: '/distritos', en: '/en/districts' },
  distrito: { pt: '/distritos/:slug', en: '/en/districts/:slug' },
  /**
   * AS REGIÕES NUTS II, E A PÁGINA DE CADA UMA (Emenda 21, 27.08.2026).
   *
   * «Cada região NUTS II em vigor tem a sua página, `/regioes/<slug>` na edição
   * portuguesa e `/en/regions/<slug>` na inglesa, e `/regioes` é o índice com a
   * régua da convergência completa.»
   *
   * O `:slug` é o mesmo campo que `?ambito=regiao:<slug>` usava na primeira
   * página até esta emenda: é o `slug` de `src/data/regioes.mjs`, e continua a
   * ser igual nas duas edições, porque o que se traduz é o rótulo e nunca a
   * chave. Um endereço antigo com aquele estado leva a esta rota (Emenda 21b),
   * e por isso o nome no endereço não podia mudar.
   *
   * SÓ EXISTEM AS PÁGINAS DAS REGIÕES COM LINHAS: o `getStaticPaths()` sai de
   * `slugsDasRegioes()`, que lê a lista de dados e o livro-razão. Uma região que
   * o motor declare antes de a linha atravessar não ganha endereço — «a régua
   * nunca se completa com um número escrito à mão» (Emenda 21e), e uma página
   * sem valores seria a mesma promessa por outra forma.
   *
   * PORTUGAL NÃO TEM PÁGINA AQUI. Está na régua porque é a marca contra a qual
   * as regiões se leem, e não é uma região: `referencia: true` em
   * `regioes.mjs`, o mesmo campo desde a etapa 2i. A página do país é `/`.
   */
  regioes: { pt: '/regioes', en: '/en/regions' },
  regiao: { pt: '/regioes/:slug', en: '/en/regions/:slug' },
  /**
   * AS ÁREAS DE GOVERNO, E A PÁGINA DE CADA UMA (decisão 6 da auditoria de
   * 25.08.2026, forma A, mandada pelo diretor a 27.08 e 28.08).
   *
   * Uma área de governo é o conjunto de matérias de um ministério, e o nome é o
   * que o Governo publica: a secção portuguesa do sítio do Governo chama-se
   * «área de governo», e é dela que estas páginas tomam o nome.
   *
   * O `:slug` é o nome da área sem acentos, escrito em `src/data/areas.mjs`, e é
   * igual nas duas edições, porque o que se traduz é o rótulo e nunca a chave.
   * A palavra do endereço é a mesma nas duas edições pela mesma razão por que
   * `agenda` o é: «areas» é palavra das duas línguas, e o brief escreve-a assim.
   *
   * SÓ EXISTEM AS PÁGINAS DAS ÁREAS COM PEÇAS: o `getStaticPaths()` sai de
   * `slugsDasAreas()`, que lê a lista de dados e o livro-razão. Uma área
   * declarada sem uma linha por baixo não ganha endereço, porque uma página que
   * só tivesse o nome de um ministério não é conteúdo.
   */
  areas: { pt: '/areas', en: '/en/areas' },
  area: { pt: '/areas/:slug', en: '/en/areas/:slug' },
  /**
   * OS DOMÍNIOS DA CARTA, E A PÁGINA DE CADA UM (bloco F1.2, 03.09.2026).
   *
   * Um domínio é «uma área da vida do país sobre a qual um leitor tem
   * perguntas» (`design/observatorio/CARTA-DOS-CONTEUDOS.md` §0), e é a unidade
   * da camada 2 da pilha. São dezoito, por vagas, e o índice lista-os todos:
   * quem tem página abre; quem ainda não tem medidas conferidas fica dito e sem
   * porta, «para o leitor saber que a casa sabe»
   * (`BRIEF-forma-dos-dominios.md` §2).
   *
   * O SLUG É UMA SUPOSIÇÃO DO LUGAR DE DIREÇÃO E NÃO UMA DECISÃO DO DIRETOR
   * (brief F1.2 §1, que a deixa nos pendentes). A palavra do CAMINHO traduz-se,
   * ao contrário de `areas` e de `agenda`: «dominios» não é palavra inglesa, e o
   * índice inglês do sítio chama-lhes «domains».
   *
   * O `:slug` É O MESMO NAS DUAS EDIÇÕES, e não o que o brief supôs
   * (`/en/domains/economy-and-public-finances`). A regra desta tabela está
   * escrita nas regiões, nas áreas e nos concelhos — «o que se traduz é o
   * rótulo e nunca a chave» — e a espinha do encaminhamento assenta nela:
   * `matchPath()` tira o slug de um caminho e `alternatesFor()` compõe com ele o
   * caminho da outra edição, para o canonical, para o hreflang e para o sitemap.
   * Um slug por edição obrigava a uma tabela de tradução de slugs dentro do
   * encaminhamento, que é uma mudança na espinha de que dependem as 6 590
   * páginas, e não uma escolha desta página. Fica nos pendentes do diretor com o
   * custo escrito: se ele quiser o slug inglês, é um bloco do encaminhamento.
   *
   * SÓ EXISTE PÁGINA PARA UM DOMÍNIO COM MEDIDAS: o `getStaticPaths()` sai de
   * `slugsDosDominios()`, que lê a lista declarada e o livro-razão. É a mesma
   * regra das áreas e das regiões, e pela mesma razão: uma página que só tivesse
   * o nome de um domínio não é conteúdo, é uma promessa.
   */
  dominios: { pt: '/dominios', en: '/en/domains' },
  dominio: { pt: '/dominios/:slug', en: '/en/domains/:slug' },
  /**
   * A agenda: o que se mede agora, o que se segue, e o calendário das fontes.
   *
   * Os dois registos vêm do motor (`src/data/agenda.json` e
   * `src/data/calendario.json`) e atravessam inteiros. A rota entra aqui e, com
   * ela, a porta das cinco chaves `agenda_*` da prova passa a ser esta página
   * em vez do Método: `portaDaAgenda()` em `src/lib/prova.mjs` procura-a nesta
   * tabela e não precisa de ser tocada. Ver DECISIONS §1.40.
   */
  agenda: { pt: '/agenda', en: '/en/agenda' },
  livro: { pt: '/livro-razao', en: '/en/ledger' },
  /**
   * O LIVRO-RAZÃO DO CONJUNTO DOS CONCELHOS (decisão D6 do diretor, 26.08.2026).
   *
   * O índice do livro-razão rende todas as linhas numa página. Com as linhas dos
   * 308 concelhos, essa página passaria de 136 para cerca de 2 570 entradas, e
   * uma lista de 2 570 entradas não é um índice: é um ficheiro. As linhas do
   * estudo dos concelhos saem para aqui, com a pesquisa por concelho e a lista
   * por concelho; o índice principal fica com as dos outros estudos e leva a
   * porta para esta página. As páginas de linha, o CSV e o JSON continuam a
   * incluir tudo: o que muda é por onde se chega, não o que existe.
   *
   * É uma rota LITERAL, e `matchPath()` resolve as literais antes das que têm
   * parâmetro — sem isso, `/livro-razao/concelhos` casaria com `linha` e o
   * portão pedia-lhe o recibo de uma afirmação chamada «concelhos».
   */
  livroConcelhos: { pt: '/livro-razao/concelhos', en: '/en/ledger/municipalities' },
  /**
   * A PÁGINA DO LIVRO-RAZÃO DE UM CONCELHO (decisão do diretor, 26.08.2026).
   *
   * A página do conjunto era uma só, com as 2 416 linhas do estudo: medida, tinha
   * 227 008 px de altura a 1280, e a decisão D6 tinha tirado essas linhas do
   * índice principal precisamente porque 2 500 linhas numa página não se leem.
   * Passa a haver uma página por concelho, com as linhas desse concelho, e
   * `/livro-razao/concelhos` passa a ser o índice dos 308.
   *
   * O gabarito tem DOIS segmentos depois de `/livro-razao/`, e por isso não
   * colide com `linha`, cujo `:slug` casa com um segmento e mais nada.
   */
  livroConcelho: {
    pt: '/livro-razao/concelhos/:slug',
    en: '/en/ledger/municipalities/:slug',
  },
  linha: { pt: '/livro-razao/:slug', en: '/en/ledger/:slug' },
  /**
   * A página do marcador. IDENTIDADE §6 promete «uma página que o explica» e
   * ela não existia; a explicação vivia numa oração do Método.
   */
  marcador: { pt: '/a-verificar', en: '/en/to-verify' },
};

/**
 * Normaliza um caminho: sem barra final, excepto a raiz.
 * @param {string|undefined|null} path
 * @returns {string}
 */
export function normalizePath(path) {
  if (!path) return '/';
  const p = path.split('?')[0].split('#')[0];
  const stripped = p.replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
}

/**
 * Extrai o caminho normalizado de um URL absoluto (usado pelo sitemap).
 * @param {string} url
 * @returns {string}
 */
export function pathFromUrl(url) {
  try {
    return normalizePath(new URL(url).pathname);
  } catch {
    return normalizePath(url);
  }
}

/**
 * Caminho de uma rota, numa língua. `params.slug` quando a rota o pede.
 * @param {ChaveDeRota} key
 * @param {Lingua} lang
 * @param {{ slug?: string }} [params]
 * @returns {string}
 */
export function routePath(key, lang, params = {}) {
  const entry = ROUTES[key];
  if (!entry) throw new Error(`routes: rota desconhecida "${key}"`);
  const template = entry[lang];
  if (!template) throw new Error(`routes: a rota "${key}" não tem caminho em "${lang}"`);
  if (template.includes(':slug')) {
    if (!params.slug) throw new Error(`routes: a rota "${key}" exige um slug`);
    return template.replace(':slug', params.slug);
  }
  return template;
}

/**
 * O padrão de um gabarito de rota, ancorado.
 *
 * `:slug` casa com um segmento e mais nada (`[^/]+`) — é o que faz
 * `/estudos/x/documento` NÃO casar com `/estudos/:slug`, e casar só com a rota
 * cujo gabarito tem o sufixo certo. Sem isto, uma rota com segmentos depois do
 * parâmetro seria ambígua.
 *
 * @param {string} template
 * @returns {RegExp}
 */
function padraoDe(template) {
  const alvo = normalizePath(template);
  const escapado = alvo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + escapado.replace(':slug', '([^/]+)') + '$');
}

/**
 * Descobre a que rota lógica pertence um caminho.
 * @param {string} path
 * @returns {Rota|null}
 */
export function matchPath(path) {
  const target = normalizePath(path);
  // Primeiro os caminhos literais, depois os que têm parâmetro:
  // /estudos tem de ganhar a /estudos/:slug.
  for (const pass of [0, 1]) {
    /* `ROUTES` é um literal fechado: as suas chaves são exactamente as de
       `ChaveDeRota`, e é isso que este molde diz. */
    for (const [key, byLang] of /** @type {[ChaveDeRota, Record<Lingua, string>][]} */ (
      Object.entries(ROUTES)
    )) {
      for (const lang of LANGS) {
        const template = byLang[lang];
        if (!template) continue;
        const hasParam = template.includes(':slug');
        if ((pass === 0) === hasParam) continue;
        if (!hasParam) {
          if (normalizePath(template) === target) return { key, lang, params: {} };
        } else {
          const m = target.match(padraoDe(template));
          if (m) return { key, lang, params: { slug: m[1] } };
        }
      }
    }
  }
  return null;
}

/**
 * Alternativas de língua de um caminho, prontas para <link rel="alternate">
 * e para o sitemap. Inclui x-default a apontar para a língua primária.
 * Devolve null para caminhos fora da tabela (ex.: /404).
 * @param {string} path
 * @returns {Alternativa[]|null}
 */
export function alternatesFor(path) {
  const hit = matchPath(path);
  if (!hit) return null;
  const list = LANGS.map((lang) => ({
    lang,
    hreflang: HREFLANG[lang],
    path: routePath(hit.key, lang, hit.params),
  }));
  const primary = list.find((l) => l.lang === PRIMARY_LANG);
  if (primary) list.push({ lang: PRIMARY_LANG, hreflang: 'x-default', path: primary.path });
  return list;
}

/**
 * O caminho equivalente na outra língua (para o botão PT/EN).
 * @param {string} path
 * @param {Lingua} currentLang
 * @returns {string}
 */
export function otherLanguagePath(path, currentLang) {
  const hit = matchPath(path);
  if (!hit) return currentLang === 'pt' ? ROUTES.home.en : ROUTES.home.pt;
  /* `LANGS` é uma tupla de duas entradas e `currentLang` é uma delas, por isso
     exactamente uma difere: o `find` acha sempre. É um facto do tipo, e não uma
     promessa sobre dados de fora. */
  const other = /** @type {Lingua} */ (LANGS.find((l) => l !== currentLang));
  return routePath(hit.key, other, hit.params);
}
