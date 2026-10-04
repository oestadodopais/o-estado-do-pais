/**
 * ===========================================================================
 * O ÍNDICE · o resolvedor (bloco R3, 04.10.2026, `design/observatorio/BRIEF-R3-o-indice-do-sitio.md`)
 * ===========================================================================
 *
 * O diretor pediu, na madrugada de 04.10.2026, «uma espécie de índice do conteúdo, com a
 * possibilidade de clicar onde quer que fosse nesse índice e ir diretamente para o sítio onde a
 * informação está». Esta função devolve tudo o que a página «Índice» / «Index» rende, e não
 * escreve uma linha à mão:
 *
 *   · as rotas vêm da tabela (`src/lib/routes.mjs`), pela mesma `routePath()` do menu;
 *   · os nomes das portas são os que cada página já tem: o do menu, o do rodapé, o do caminho do
 *     cabeçalho (`ETIQUETA_NAV`, `ROTULOS_B1`, `SUGESTOES.titulo`, o `<h1>` do marcador), o das
 *     declarações dos temas (`ENTRADAS`) e o dos dados (o nome de cada lugar, de cada área, de cada
 *     estudo e de cada medida);
 *   · as listas vêm dos mesmos módulos que dão os caminhos às páginas: `MUNICIPIOS_COM_PAGINA`
 *     para os concelhos, `slugsDasUnidades()` para os distritos e as ilhas, `slugsDasRegioes()`
 *     para as regiões, `areasComPagina()` para as áreas, `allSeries()` para as séries,
 *     `todosOsEstudos()` para os estudos (a mesma lista, pela mesma ordem, da página dos estudos),
 *     e `mudancasDoIndice()` para «O que mudou». Uma página que nasça numa destas listas entra no
 *     índice sozinha, e uma que saia sai dele.
 *
 * COMO CADA ROTA ENTRA. `COMO_ENTRA` declara todas as chaves da tabela das rotas, cada uma com a
 * maneira de entrar e a razão; uma chave nova sem declaração fecha a construção aqui, e não fica
 * fora do índice em silêncio. A célula `check:indice-do-sitio` (`tests/indice/indice.mjs`) confere
 * o resultado por conta própria, sobre o que foi construído: o mapa do sítio, as páginas de cada
 * família e a lista dos estudos.
 *
 * A ORDEM DAS SECÇÕES é a do §2 do brief: o país, os lugares, a União, os estudos, os números e as
 * fontes, o projeto (o Sobre, o Método, a agenda e as sugestões) e «O que mudou».
 */
import { ROUTES, routePath } from './routes.mjs';
import { t } from '../i18n/strings.mjs';
import { ROTULOS_B1 } from '../data/rotulos-b1.mjs';
import { SUGESTOES } from '../data/sugestoes.mjs';
import { ENTRADAS } from '../data/primeira-pagina.mjs';
import { ENTRADA_DA_ROTA } from './caminho.mjs';
import { linhaDoIndice } from './assuntos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../data/municipios.mjs';
import { lugarDoConcelho } from '../data/carta-dos-lugares.mjs';
import { slugsDasUnidades, unidadeDoMapa } from './mapa.mjs';
import { slugsDasRegioes, regiaoDoSlug } from './regioes.mjs';
import { areasComPagina } from './areas.mjs';
import { allSeries } from './series.mjs';
import { getClaim } from './ledger.mjs';
import { nomeDoCartao } from './nomes.mjs';
import { todosOsEstudos } from './estudos-b1.mjs';
import { mudancasDoIndice } from './mudancas.mjs';

/**
 * COMO CADA CHAVE DA TABELA DAS ROTAS ENTRA NO ÍNDICE, com a razão.
 *
 *   · `porta`      uma página fixa, com a sua porta;
 *   · `lista`      uma família de páginas por dado, cada uma com a sua porta, lida do módulo que
 *                  dá os caminhos às páginas;
 *   · `pela-lista` uma família de páginas por dado que entra pela página que a lista (o índice das
 *                  linhas, o índice dos concelhos do livro, a página do estudo): nomeia-se aqui a
 *                  chave dessa página, e a célula confere que ela está no índice;
 *   · `fora`       não entra, com a razão.
 *
 * @type {Record<ChaveDeRota, { como: 'porta'|'lista'|'pela-lista'|'fora', pela?: ChaveDeRota, razao: string }>}
 */
export const COMO_ENTRA = {
  home: { como: 'porta', razao: 'A primeira página, com o nome que o menu lhe dá.' },
  temas: { como: 'porta', razao: 'O índice dos temas, com os sete por baixo.' },
  entradaDinheiro: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas (`ENTRADAS`).' },
  entradaSalarios: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas.' },
  entradaPobreza: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas.' },
  entradaTrabalho: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas.' },
  entradaCasa: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas.' },
  entradaEscolaESaude: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas.' },
  entradaEstado: { como: 'lista', razao: 'Uma página de tema, das declarações dos temas.' },
  areas: { como: 'porta', razao: 'O índice das áreas de governo, com as áreas por baixo.' },
  area: { como: 'lista', razao: 'As áreas com página, de `areasComPagina()`.' },
  lugares: { como: 'porta', razao: 'A página dos lugares.' },
  regioes: { como: 'porta', razao: 'O índice das regiões, a casa da régua da convergência, com as regiões por baixo.' },
  regiao: { como: 'lista', razao: 'As regiões com página, de `slugsDasRegioes()`.' },
  distrito: { como: 'lista', razao: 'Os distritos e as ilhas, de `slugsDasUnidades()`.' },
  municipio: { como: 'lista', razao: 'Os concelhos com página, de `MUNICIPIOS_COM_PAGINA`, dobrados por distrito (o §5, decisão 2, do brief).' },
  uniaoEuropeia: { como: 'porta', razao: 'A página dos países da União.' },
  estudos: { como: 'porta', razao: 'A lista dos estudos, com os estudos por baixo.' },
  estudo: { como: 'lista', razao: 'Os estudos sem sucessor, por data, de `todosOsEstudos()`: os que têm sucessor ficam fora, como na lista dos estudos, e o leitor chega-lhes pela nota do sucessor (§1.145; o §5, decisão 3, do brief).' },
  livro: { como: 'porta', razao: 'O índice das linhas («Números e fontes»), com o dos concelhos e as séries por baixo.' },
  livroConcelhos: { como: 'porta', razao: 'O índice dos concelhos do livro-razão.' },
  serie: { como: 'lista', razao: 'As séries, de `allSeries()`.' },
  correcoes: { como: 'porta', razao: 'O registo das correções e de tudo o que mudou («O que foi corrigido, e o que mudou»).' },
  marcador: { como: 'porta', razao: 'A página que diz o que quer dizer o marcador da incerteza.' },
  sobre: { como: 'porta', razao: 'O Sobre.' },
  metodo: { como: 'porta', razao: 'O Método.' },
  agenda: { como: 'porta', razao: 'A agenda.' },
  sugestoes: { como: 'porta', razao: 'O formulário das sugestões.' },
  linha: { como: 'pela-lista', pela: 'livro', razao: 'As páginas de linha são uma por número; entram pelo índice das linhas, que as lista todas.' },
  livroConcelho: { como: 'pela-lista', pela: 'livroConcelhos', razao: 'As páginas do livro-razão de cada concelho entram pelo índice dos concelhos do livro-razão.' },
  documento: { como: 'pela-lista', pela: 'estudo', razao: 'O documento original de um estudo abre-se da página do estudo, e fica fora do mapa do sítio por escrito (`astro.config.mjs`).' },
  sugestoesObrigado: { como: 'fora', razao: 'Uma página do resultado de um envio: fora dos índices e do mapa do sítio, com `noindex` (§1.154).' },
  sugestoesVazia: { como: 'fora', razao: 'Uma página do resultado de um envio (§1.154).' },
  sugestoesLimite: { como: 'fora', razao: 'Uma página do resultado de um envio (§1.154).' },
  sugestoesNaoChegou: { como: 'fora', razao: 'Uma página do resultado de um envio (§1.154).' },
  indice: { como: 'fora', razao: 'A própria página; a porta dela está no rodapé de todas as outras.' },
  municipios: { como: 'fora', razao: 'Não se constrói: é um redirecionamento 301 para «Lugares» (`vercel.json`).' },
  distritos: { como: 'fora', razao: 'Não se constrói: é um redirecionamento 301 para «Lugares».' },
  dominios: { como: 'fora', razao: 'Não se constrói: é um redirecionamento 301 para «Temas».' },
  dominio: { como: 'fora', razao: 'Não se constrói: as páginas dos domínios redirecionam para «Temas».' },
  texto: { como: 'fora', razao: 'Não se constrói: as rotas antigas dos textos redirecionam para a página do estudo.' },
};

/* UMA CHAVE NOVA SEM DECLARAÇÃO FECHA A CONSTRUÇÃO, e uma declaração de uma chave que já não existe
   também: as duas listas têm de ser a mesma, e é aqui, na primeira leitura do módulo, que isso se
   diz. */
{
  const naTabela = Object.keys(ROUTES);
  const declaradas = Object.keys(COMO_ENTRA);
  const semDeclaracao = naTabela.filter((k) => !declaradas.includes(k));
  const aMais = declaradas.filter((k) => !naTabela.includes(k));
  if (semDeclaracao.length || aMais.length) {
    throw new Error(
      `índice: a tabela das rotas e COMO_ENTRA divergem (sem declaração: ${semDeclaracao.join(', ') || 'nenhuma'}; ` +
        `declaradas sem rota: ${aMais.join(', ') || 'nenhuma'}). Diga em src/lib/indice.mjs como a rota entra no índice, com a razão.`,
    );
  }
}

/**
 * @typedef {{ tipo: 'pagina'|'lugar', chave: ChaveDeRota, href: string, rotulo: string, filhos?: Porta[], colunas?: 'estreitas'|'largas' }} PortaSimples
 * @typedef {{ tipo: 'entrada', chave: ChaveDeRota, href: string, rotulo: string, linha: string }} PortaDeTema
 * @typedef {{ tipo: 'estudo', chave: 'estudo', href: string, ficha: ReturnType<typeof todosOsEstudos>[number] }} PortaDeEstudo
 * @typedef {{ tipo: 'serie', chave: 'serie', href: string, linha: Linha, sufixo: string, nome: string }} PortaDeSerie
 * @typedef {PortaSimples|PortaDeTema|PortaDeEstudo|PortaDeSerie} Porta
 */

/** A colação da língua da página, para as listas por nome. */
const COLACAO = { pt: new Intl.Collator('pt'), en: new Intl.Collator('en') };

/**
 * Uma página fixa, com o nome que a página já tem. As portas que ela lista por baixo dela podem ir em colunas de
 * nomes (`colunas`), quando são nomes curtos: as regiões em colunas estreitas, as áreas de governo em largas.
 * @param {ChaveDeRota} chave
 * @param {Lingua} lang
 * @param {string} rotulo
 * @param {Porta[]} [filhos]
 * @param {'estreitas'|'largas'} [colunas]
 * @returns {PortaSimples}
 */
function pagina(chave, lang, rotulo, filhos, colunas) {
  if (COMO_ENTRA[chave].como !== 'porta') throw new Error(`índice: «${chave}» não é uma porta fixa em COMO_ENTRA.`);
  return { tipo: 'pagina', chave, href: routePath(chave, lang), rotulo, ...(filhos ? { filhos } : {}), ...(colunas ? { colunas } : {}) };
}

/**
 * Os sete temas, pela ordem das declarações, cada um com a linha curta que os dois índices já
 * mostram ao lado do nome. As declarações dos temas não têm pergunta: a linha diz de que é cada
 * página, e é a mesma da primeira página e da página dos temas.
 * @param {Lingua} lang
 * @returns {PortaDeTema[]}
 */
function temas(lang) {
  const chaveDoId = Object.fromEntries(Object.entries(ENTRADA_DA_ROTA).map(([chave, id]) => [id, chave]));
  return ENTRADAS.filter((e) => e.id in chaveDoId).map((e) => {
    const chave = /** @type {ChaveDeRota} */ (chaveDoId[e.id]);
    const href = routePath(chave, lang);
    if (e.rota[lang] !== href) throw new Error(`índice: o tema «${e.id}» declara ${e.rota[lang]} e a tabela das rotas dá ${href}.`);
    return { tipo: 'entrada', chave, href, rotulo: e.nome[lang], linha: linhaDoIndice(e, lang) };
  });
}

/**
 * Os concelhos com página, dobrados pelo distrito ou pela ilha que a Carta lhes dá; os distritos
 * pela ordem da colação portuguesa, e os concelhos de cada um também.
 * @param {Lingua} lang
 */
function concelhosPorDistrito(lang) {
  /** @type {Map<string, { slug: string, nome: string, portas: PortaSimples[] }>} */
  const grupos = new Map();
  for (const m of MUNICIPIOS_COM_PAGINA) {
    const lugar = lugarDoConcelho(m.slug);
    if (!lugar) throw new Error(`índice: o concelho «${m.slug}» tem página e a Carta não lhe dá distrito.`);
    const { slug, nome } = lugar.distrito;
    if (!grupos.has(slug)) grupos.set(slug, { slug, nome, portas: [] });
    grupos.get(slug)?.portas.push({
      tipo: 'lugar', chave: 'municipio', href: routePath('municipio', lang, { slug: m.slug }), rotulo: m.nome[lang] ?? m.nome.pt,
    });
  }
  const pt = COLACAO.pt;
  return [...grupos.values()]
    .sort((a, b) => pt.compare(a.nome, b.nome))
    .map((g) => ({ ...g, portas: g.portas.sort((a, b) => pt.compare(a.rotulo, b.rotulo)) }));
}

/**
 * Cada série, com o nome do seu recibo: o nome da medida da linha portuguesa, pela escada do
 * cartão, e a cadeia que o recibo põe a seguir a ele. Só a série de países tem essas palavras
 * declaradas; uma série com outro eixo fecha a construção até alguém dizer como se chama.
 * @param {Lingua} lang
 * @returns {PortaDeSerie[]}
 */
function series(lang) {
  const s = t(lang);
  return allSeries()
    .map((serie) => {
      if (serie.eixo !== 'pais') {
        throw new Error(`índice: a série «${serie.id}» tem o eixo «${String(serie.eixo)}», e o índice só sabe o nome das séries de países.`);
      }
      const linha = getClaim(String(serie.linha_de_portugal));
      const nome = nomeDoCartao(linha, lang);
      if (!nome) throw new Error(`índice: a série «${serie.id}» não tem nome de cartão.`);
      return {
        tipo: /** @type {const} */ ('serie'), chave: /** @type {const} */ ('serie'),
        href: routePath('serie', lang, { slug: String(serie.id) }), linha, sufixo: s.livro.serie.nosPaises, nome: nome.texto,
      };
    })
    .sort((a, b) => COLACAO[lang].compare(a.nome, b.nome));
}

/**
 * TUDO O QUE O ÍNDICE RENDE, numa edição.
 * @param {Lingua} lang
 */
export function indiceDoSitio(lang) {
  const s = t(lang);
  const r = ROTULOS_B1[lang];
  const lugares = ENTRADAS.find((e) => e.id === 'lugares');
  if (!lugares) throw new Error('índice: as declarações dos temas não têm a porta «Lugares».');
  const nomeDaSeccao = (/** @type {number} */ i) => {
    const seccao = lugares.seccoes[i];
    if (!seccao) throw new Error(`índice: a porta «Lugares» não declara a secção ${i}.`);
    return seccao.nome[lang];
  };

  const regioes = slugsDasRegioes()
    .map((slug) => {
      const regiao = regiaoDoSlug(slug);
      if (!regiao) throw new Error(`índice: a região «${slug}» tem página e não tem dados.`);
      return regiao;
    })
    .sort((a, b) => COLACAO.pt.compare(a.nome.pt, b.nome.pt))
    .map((regiao) => /** @type {PortaSimples} */ ({
      tipo: 'lugar', chave: 'regiao', href: routePath('regiao', lang, { slug: regiao.slug }), rotulo: regiao.nome[lang] ?? regiao.nome.pt,
    }));

  const distritos = slugsDasUnidades()
    .map((slug) => {
      const unidade = unidadeDoMapa(slug);
      if (!unidade) throw new Error(`índice: o distrito «${slug}» tem página e não tem unidade no mapa.`);
      return /** @type {PortaSimples} */ ({ tipo: 'lugar', chave: 'distrito', href: routePath('distrito', lang, { slug }), rotulo: unidade.nome });
    })
    .sort((a, b) => COLACAO.pt.compare(a.rotulo, b.rotulo));

  const areas = areasComPagina().map((a) => /** @type {PortaSimples} */ ({
    tipo: 'pagina', chave: 'area', href: routePath('area', lang, { slug: a.slug }), rotulo: a.nome[lang] ?? a.nome.pt,
  }));

  const estudos = todosOsEstudos(lang).map((ficha) => /** @type {PortaDeEstudo} */ ({
    tipo: 'estudo', chave: 'estudo', href: ficha.rota, ficha,
  }));

  return {
    pais: {
      titulo: s.indice.seccoes.pais,
      portas: [pagina('home', lang, r.pais), pagina('temas', lang, s.nav.temas, temas(lang)), pagina('areas', lang, s.nav.areas, areas, 'largas')],
    },
    lugares: {
      titulo: s.indice.seccoes.lugares,
      portas: [pagina('lugares', lang, s.nav.lugares), pagina('regioes', lang, s.nav.regioes, regioes, 'estreitas')],
      distritos: { titulo: nomeDaSeccao(2), portas: distritos },
      concelhos: { titulo: nomeDaSeccao(0), grupos: concelhosPorDistrito(lang) },
    },
    uniao: { titulo: s.indice.seccoes.uniao, portas: [pagina('uniaoEuropeia', lang, s.nav.uniaoEuropeia)] },
    estudos: { titulo: s.indice.seccoes.estudos, portas: [pagina('estudos', lang, s.nav.estudos, estudos)] },
    numeros: {
      titulo: s.indice.seccoes.numeros,
      portas: [
        pagina('livro', lang, s.nav.livro, [pagina('livroConcelhos', lang, s.nav.municipios), ...series(lang)]),
        pagina('correcoes', lang, s.nav.correcoes),
        /* A PÁGINA DO MARCADOR chama-se pelo seu `<h1>`, como no caminho do cabeçalho. A cadeia do
           marcador não entra na porta: escrita sem a sua marca, é o que a I6 do `check:indice`
           recusa (um marcador, uma forma, uma porta), e com a marca seria uma segunda porta para a
           mesma página no mesmo ecrã. */
        pagina('marcador', lang, s.marcador.h1),
      ],
    },
    projeto: {
      titulo: s.indice.seccoes.projeto,
      portas: [pagina('sobre', lang, s.nav.sobre), pagina('metodo', lang, s.nav.metodo), pagina('agenda', lang, s.nav.agenda), pagina('sugestoes', lang, SUGESTOES.titulo[lang])],
    },
    mudou: { titulo: r.mudou, mudancas: mudancasDoIndice(lang) },
  };
}
