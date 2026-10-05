/**
 * ---------------------------------------------------------------------------
 * O CAMINHO DE CADA PÁGINA · «Início › Concelhos › Évora» (F1.10, §2.5)
 * ---------------------------------------------------------------------------
 * O brief escreve-o em duas linhas: «cada página abaixo da primeira mostra o seu
 * caminho, como texto com ligações, sem guião». Este ficheiro é a tabela dos
 * pais e o resolvedor do nome da folha; quem desenha é `Caminho.astro`.
 *
 * O QUE ISTO FECHA. A medida L5 do brief («o caminho no cabeçalho em 100 % das
 * páginas abaixo da primeira, com ligações que existem») media 7 213 páginas sem
 * caminho, que eram todas as que o sítio tem: um leitor que chega de uma busca à
 * página de uma linha do livro-razão não tinha, em lado nenhum da página, a
 * frase que diz de que família ela é.
 *
 * ---------------------------------------------------------------------------
 * AS DUAS FAMÍLIAS QUE NÃO LEVAM CAMINHO, E É O §3 DO BRIEF
 * ---------------------------------------------------------------------------
 * `documento` (o estudo alojado tal como foi publicado) e `texto` (a transcrição
 * de um documento fixado) ficam de fora: «nada nos documentos alojados nem nas
 * páginas de leitura». As duas estão nomeadas aqui e não são um silêncio: a
 * régua da L5 tem a mesma lista, escrita com a mesma razão.
 *
 * ---------------------------------------------------------------------------
 * O NOME DA FOLHA NÃO SE INVENTA, E POR ISSO ELE VEM COM A SUA MARCA
 * ---------------------------------------------------------------------------
 * O último degrau é o nome desta página, e um nome que a casa não escreveu não
 * pode render-se como se ela o tivesse escrito. Cada espécie de folha diz de
 * onde vem, e é `Caminho.astro` que escolhe a marca:
 *
 *   · `lugar` — o nome de um concelho, de uma unidade da Carta ou de uma região.
 *     É a transcrição de um registo, e leva `data-lugar`, como as outras
 *     superfícies onde ele aparece;
 *   · `nome` — o nome de uma área de governo ou de um domínio. Vem de um ficheiro
 *     de dados com fonte declarada e leva `data-nome`, que `medir-defeitos.mjs`
 *     confere carácter a carácter contra esse ficheiro;
 *   · `estudo` — o título de um trabalho. Cita-se, e a marca da língua é a de
 *     `TituloDeTrabalho`, que é o que a L6 do `check:lingua` exige na edição
 *     inglesa;
 *   · `medida` — o nome de uma linha do livro-razão, pela escada de `nomes.mjs`,
 *     e **nada se rende onde a escada não dá texto**: é a regra que
 *     `NomeDaMedida.astro` já escreve, e o caminho de uma linha derivada acaba em
 *     «Números e fontes», que é a verdade sobre o sítio onde ela está;
 *   · `chave` — o nome de uma página fixa, que é a etiqueta com que o menu já lhe
 *     chama. Um nome por coisa em todo o sítio (§0 do brief): o caminho não
 *     inventa um segundo nome para uma página que já tem um.
 *
 * NENHUMA CADEIA NOVA. Todas as palavras deste caminho já se rendem noutro sítio
 * da mesma página ou do menu, e por isso o inventário da voz não ganha uma linha
 * com este bloco. O que ganha uma cadeia é o nome da região de navegação
 * (`nav.rotuloCaminho`), que só se ouve.
 */

import { routePath } from './routes.mjs';
import { t } from '../i18n/strings.mjs';
import { municipioPorSlug } from '../data/municipios.mjs';
import { unidadeDoMapa } from './mapa.mjs';
import { regiaoDoSlug } from './regioes.mjs';
import { areaDoSlug } from './areas.mjs';
import { dominioDoSlug } from '../data/dominios.mjs';
import { studyTitle } from '../data/studies.mjs';
import { getClaim } from './ledger.mjs';
import { getSerie, hasSerie } from './series.mjs';
import { NOMES_DAS_SERIES } from '../data/series-no-tempo.mjs';
import { nomeDaMedida } from './nomes.mjs';
import { ENTRADAS } from '../data/primeira-pagina.mjs';
import { SUGESTOES } from '../data/sugestoes.mjs';
import { explicacaoResolvida } from './explicacoes.mjs';

/** A chave de rota de cada entrada, e o identificador dela nas declarações (bloco PP1). */
export const ENTRADA_DA_ROTA = {
  entradaDinheiro: 'precos', entradaSalarios: 'salarios-pensoes-e-apoios',
  entradaPobreza: 'pobreza-e-desigualdade', entradaTrabalho: 'emprego',
  entradaCasa: 'habitacao', entradaEscolaESaude: 'educacao-e-saude', entradaEstado: 'estado-e-economia',
};

/**
 * AS DUAS FAMÍLIAS DE TRANSCRIÇÃO (§3 do brief). A mesma lista está em
 * `scripts/check-lugar.mjs`, e as duas dizem a mesma coisa pela mesma razão: a
 * casa não põe mobília sua dentro de um documento que aloja nem dentro de uma
 * transcrição que compara carácter a carácter.
 */
/** @type {Set<ChaveDeRota>} */
export const ROTAS_SEM_CAMINHO = new Set(['home', 'documento', 'texto']);

/**
 * O PAI DE CADA ROTA.
 *
 * É uma tabela e não uma leitura do endereço, e a razão está medida: o endereço
 * de uma página de linha é `/livro-razao/<id>` e o de uma página de um concelho
 * do livro-razão é `/livro-razao/concelhos/<slug>`, e as duas hierarquias não são
 * as que os segmentos desenham (uma linha de um concelho não está DENTRO da
 * página desse concelho). A hierarquia é do sítio, não do caminho.
 *
 * @type {Partial<Record<ChaveDeRota, ChaveDeRota>>}
 */
export const PAI_DA_ROTA = {
  sobre: 'home',
  metodo: 'home',
  correcoes: 'home',
  /* A CAIXA DAS SUGESTÕES (bloco S1, 02.10.2026) é uma página fixa como as
     correções, e as quatro páginas do resultado são filhas dela: a última
     migalha delas é a porta de volta ao formulário. */
  sugestoes: 'home',
  sugestoesObrigado: 'sugestoes',
  sugestoesVazia: 'sugestoes',
  sugestoesLimite: 'sugestoes',
  sugestoesNaoChegou: 'sugestoes',
  /* A PÁGINA «PRIVACIDADE» (bloco H3, 05.10.2026) é uma página fixa como as sugestões: «Início › Privacidade». */
  privacidade: 'home',
  /* AS EXPLICAÇÕES (bloco EX1, 05.10.2026): a lista é uma página fixa, «Início › Explicações», e a leitura da semana
     e cada explicação são filhas dela, como um estudo é filho da lista dos estudos. */
  explicacoes: 'home',
  leituraDaSemana: 'explicacoes',
  explicacao: 'explicacoes',
  marcador: 'home',
  agenda: 'home',
  uniaoEuropeia: 'home',
  /* O ÍNDICE (bloco R3, 04.10.2026) é uma página fixa como a agenda: o caminho dele é
     «Início › Índice». */
  indice: 'home',
  /* N1: as sete páginas de assunto pertencem ao índice dos temas. */
  entradaDinheiro: 'temas',
  entradaSalarios: 'temas',
  entradaPobreza: 'temas',
  entradaTrabalho: 'temas',
  entradaCasa: 'temas',
  entradaEscolaESaude: 'temas',
  entradaEstado: 'temas',
  estudos: 'home',
  estudo: 'estudos',
  /* B1, peça 2: a escada do território passa pela página dos lugares, que é a
     que ficou no lugar dos dois índices antigos. As chaves antigas ficam na
     tabela porque a rota continua a existir como redirecionamento. */
  lugares: 'home',
  municipios: 'home',
  /* A PÁGINA DE UM LUGAR NÃO TEM PAI NESTA TABELA, e por isso não rende o
     caminho do cabeçalho (achado D1 da leitura do lugar de direção,
     21.09.2026). O cabeçalho dizia «Início › Lugares › Évora» e, três linhas
     abaixo, a página dizia «Portugal › Alentejo › Évora › Évora»: duas linhas de
     caminho empilhadas, duas portas para a mesma coisa. Numa página de lugar o
     caminho É a linha do lugar, que diz mais (a região e o distrito deste
     concelho) e que a célula 8.17 do `check:lugar` já confere parte a parte. É o
     mesmo mecanismo com que a primeira página e as duas famílias de transcrição
     ficam sem caminho: a ausência de pai, e não uma condição escrita na vista. */
  distritos: 'home',
  distrito: 'lugares',
  regioes: 'home',
  regiao: 'regioes',
  areas: 'home',
  area: 'areas',
  dominios: 'home',
  temas: 'home',
  dominio: 'dominios',
  livro: 'home',
  /* O ÍNDICE DOS 308 DO LIVRO-RAZÃO É FILHO DO ÍNDICE, e a página de um concelho
     dele é filha desse índice: é a escada por onde se chega lá, e é a que a
     porta «voltar ao índice» daquelas páginas já desenha. */
  livroConcelhos: 'livro',
  livroConcelho: 'livroConcelhos',
  /* A PÁGINA DE UMA LINHA É FILHA DO ÍNDICE, e não da página do concelho a que a
     linha pertence: uma linha tem um lugar de apresentação inteira (§1 do brief)
     e é a sua página; o índice é a porta comum de todas elas, incluindo as 2 416
     dos concelhos, cujo endereço é o mesmo `/livro-razao/<id>`. */
  linha: 'livro',
  /* A PÁGINA DE UMA SÉRIE (bloco UE1, 29.09.2026) É FILHA DO ÍNDICE, como a de
     uma linha: é o livro-razão a guardar os pontos de uma medida, e a folha do
     caminho é o nome dessa medida, pela mesma escada. */
  serie: 'livro',
};

/**
 * A etiqueta com que o menu chama a cada página fixa. É a mesma tabela de
 * `src/lib/navegacao.mjs`, e não uma segunda: duas listas de nomes divergiriam à
 * primeira mudança de palavra, e a §0 do brief pede um nome por coisa.
 *
 * As duas rotas que não estão no menu resolvem-se pelo nome que a própria página
 * já lhes dá: o índice dos 308 do livro-razão chama-se «Concelhos» no seu
 * `<title>`, e é a cadeia do menu; a página do marcador chama-se pelo seu `<h1>`.
 *
 * @param {ChaveDeRota} chave
 * @param {Lingua} lang
 * @returns {string|null}
 */
function etiquetaDaRota(chave, lang) {
  const s = t(lang);
  /** @type {Record<string, string>} */
  const porChave = {
    home: s.nav.inicio,
    lugares: s.nav.lugares,
    municipios: s.nav.municipios,
    distritos: s.nav.distritos,
    regioes: s.nav.regioes,
    areas: s.nav.areas,
    dominios: s.nav.dominios,
    temas: s.nav.temas,
    uniaoEuropeia: s.nav.uniaoEuropeia,
    estudos: s.nav.estudos,
    livro: s.nav.livro,
    agenda: s.nav.agenda,
    metodo: s.nav.metodo,
    correcoes: s.nav.correcoes,
    sobre: s.nav.sobre,
    /* O índice chama-se como a porta do rodapé que o abre, e como o seu `<h1>` (bloco R3). */
    indice: s.nav.indice,
    livroConcelhos: s.nav.municipios,
    marcador: s.marcador.h1,
    /* A página das sugestões chama-se pelo seu `<h1>`, que é também o rótulo da
       porta do rodapé (bloco S1). As páginas do resultado não têm nome próprio no
       caminho: acabam na migalha do formulário. */
    sugestoes: SUGESTOES.titulo[lang],
    /* A página «Privacidade» chama-se como a porta do rodapé que a abre, e como o seu `<h1>` (bloco H3). */
    privacidade: s.nav.privacidade,
    /* A lista das explicações e a leitura da semana chamam-se pelo seu `<h1>` (bloco EX1). */
    explicacoes: s.nav.explicacoes,
    leituraDaSemana: s.semana.titulo,
  };
  /* O nome de uma entrada é o da declaração do lugar de direção, que é o `<h1>` da página. */
  const entrada = ENTRADAS.find((e) => e.id === ENTRADA_DA_ROTA[/** @type {keyof typeof ENTRADA_DA_ROTA} */ (chave)]);
  if (entrada) return entrada.nome[lang];
  return porChave[chave] ?? null;
}

/**
 * A folha do caminho: o nome desta página, com a origem dele.
 *
 * @typedef {{ tipo: 'chave'|'lugar'|'nome'|'estudo', texto: string, fonte?: string, daSerie?: string }} FolhaDeTexto
 * @typedef {{ tipo: 'medida', linha: Linha }} FolhaDeMedida
 * @typedef {{ tipo: 'explicacao', slug: string, titulo: import('./explicacoes.mjs').PedacoDaExplicacao[] }} FolhaDeExplicacao
 * @typedef {FolhaDeTexto|FolhaDeMedida|FolhaDeExplicacao} Folha
 */

/**
 * O nome da folha de uma rota, ou `null` quando ela não se rende.
 *
 * @param {ChaveDeRota} chave
 * @param {{ slug?: string }} params
 * @param {Lingua} lang
 * @returns {Folha|null}
 */
export function folhaDoCaminho(chave, params, lang) {
  const slug = params.slug;
  switch (chave) {
    case 'municipio':
    case 'livroConcelho': {
      const m = slug ? municipioPorSlug(slug) : null;
      if (!m) return null;
      return { tipo: 'lugar', texto: m.nome[lang] ?? m.nome.pt };
    }
    case 'distrito': {
      const u = slug ? unidadeDoMapa(slug) : null;
      if (!u) return null;
      return { tipo: 'lugar', texto: u.nome };
    }
    case 'regiao': {
      const r = slug ? regiaoDoSlug(slug) : null;
      if (!r) return null;
      return { tipo: 'lugar', texto: r.nome[lang] ?? r.nome.pt };
    }
    case 'area': {
      const a = slug ? areaDoSlug(slug) : null;
      if (!a) return null;
      return { tipo: 'nome', fonte: 'areas', texto: a.nome[lang] ?? a.nome.pt };
    }
    case 'dominio': {
      const d = slug ? dominioDoSlug(slug) : null;
      if (!d) return null;
      return { tipo: 'nome', fonte: 'dominios', texto: d.nome[lang] ?? d.nome.pt };
    }
    case 'estudo': {
      if (!slug) return null;
      return { tipo: 'estudo', texto: studyTitle(slug, lang).titulo };
    }
    case 'explicacao': {
      /* O TÍTULO DE UMA EXPLICAÇÃO (bloco EX1, 05.10.2026) é a pergunta do leitor, com o ano pelo período de uma
         linha: a folha leva os pedaços resolvidos, e o caminho rende-os com as mesmas marcas da página. */
      if (!slug) return null;
      return { tipo: 'explicacao', slug, titulo: explicacaoResolvida(slug, lang).titulo };
    }
    case 'linha': {
      const c = slug ? getClaim(slug) : null;
      if (!c) return null;
      /* A ESCADA DECIDE, E O SILÊNCIO É UMA RESPOSTA. Onde nenhum dos quatro
         degraus dá texto, o caminho acaba no índice: promover o identificador da
         linha a nome dela seria escrever no cabeçalho o nome da máquina, que é
         exactamente o que o F1.4 tirou da página. */
      return nomeDaMedida(c, lang) === null ? null : { tipo: 'medida', linha: c };
    }
    case 'serie': {
      /* A folha de uma série é o nome da medida de que ela é o corte entre
         países: a linha portuguesa que a série nomeia, pela mesma escada. */
      const serie = slug && hasSerie(slug) ? getSerie(slug) : null;
      if (!serie) return null;
      /* UMA SÉRIE NO TEMPO (bloco RP3, 04.10.2026): o nome do projeto que
         `src/data/series-no-tempo.mjs` declara, o do cartão da medida (pela mesma
         escada) ou o nome próprio da série, com a marca do ficheiro. */
      if (serie.eixo === 'periodo') {
        const declarado = NOMES_DAS_SERIES[serie.id];
        if (!declarado) return null;
        if ('linha' in declarado) {
          const doCartao = getClaim(declarado.linha);
          return nomeDaMedida(doCartao, lang) === null ? null : { tipo: 'medida', linha: doCartao };
        }
        /* A marca diz de que série é o nome (`data-da-serie`), e a régua das frases
           confere-o contra o nome DESSA série, como o do título do recibo: dois nomes
           declarados trocados entre si não passam. */
        return { tipo: 'nome', texto: declarado.nome[lang], fonte: 'serie', daSerie: serie.id };
      }
      const c = getClaim(String(serie.linha_de_portugal));
      if (!c) return null;
      return nomeDaMedida(c, lang) === null ? null : { tipo: 'medida', linha: c };
    }
    default:
      return null;
  }
}

/**
 * Os degraus do caminho de uma página, do princípio para a folha.
 *
 * Os degraus são portas, todos menos o último; o último é esta página e não se
 * liga a si própria (é o §7.10 do brief, «"9 regiões" deixa de ser ligação para
 * si próprio», aplicado à mobília).
 *
 * Devolve `null` onde não há caminho: a primeira página, as duas famílias de
 * transcrição, e uma rota que a tabela não conhece (a página de erro).
 *
 * @param {ChaveDeRota} chave
 * @param {{ slug?: string }} params
 * @param {Lingua} lang
 * @returns {{ degraus: { href: string, rotulo: string }[], folha: Folha|null }|null}
 */
export function caminhoDaPagina(chave, params, lang) {
  if (ROTAS_SEM_CAMINHO.has(chave)) return null;
  if (!(chave in PAI_DA_ROTA)) return null;

  /** @type {{ href: string, rotulo: string }[]} */
  const degraus = [];
  /** @type {ChaveDeRota|undefined} */
  let pai = PAI_DA_ROTA[chave];
  /* A escada sobe até `home`, e a tabela é um ficheiro fechado: um ciclo seria um
     erro de escrita, e o limite existe para que ele fechasse a construção em vez
     de a pendurar. */
  for (let passo = 0; pai && passo < 8; passo += 1) {
    const rotulo = etiquetaDaRota(pai, lang);
    if (rotulo === null) throw new Error(`caminho: a rota "${pai}" não tem etiqueta`);
    degraus.unshift({ href: routePath(pai, lang), rotulo });
    pai = PAI_DA_ROTA[pai];
  }

  /* A FOLHA DE UMA PÁGINA FIXA É A ETIQUETA DELA. As páginas com `:slug` pedem-na
     aos ficheiros de dados; as outras já têm nome, e é o do menu. */
  const folha = folhaDoCaminho(chave, params, lang);
  if (folha) return { degraus, folha };
  const proprio = etiquetaDaRota(chave, lang);
  return { degraus, folha: proprio === null ? null : { tipo: 'chave', texto: proprio } };
}
