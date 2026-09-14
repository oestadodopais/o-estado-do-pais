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
import { nomeDaMedida } from './nomes.mjs';

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
  marcador: 'home',
  agenda: 'home',
  uniaoEuropeia: 'home',
  estudos: 'home',
  estudo: 'estudos',
  municipios: 'home',
  municipio: 'municipios',
  distritos: 'home',
  distrito: 'distritos',
  regioes: 'home',
  regiao: 'regioes',
  areas: 'home',
  area: 'areas',
  dominios: 'home',
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
    municipios: s.nav.municipios,
    distritos: s.nav.distritos,
    regioes: s.nav.regioes,
    areas: s.nav.areas,
    dominios: s.nav.dominios,
    uniaoEuropeia: s.nav.uniaoEuropeia,
    estudos: s.nav.estudos,
    livro: s.nav.livro,
    agenda: s.nav.agenda,
    metodo: s.nav.metodo,
    correcoes: s.nav.correcoes,
    sobre: s.nav.sobre,
    livroConcelhos: s.nav.municipios,
    marcador: s.marcador.h1,
  };
  return porChave[chave] ?? null;
}

/**
 * A folha do caminho: o nome desta página, com a origem dele.
 *
 * @typedef {{ tipo: 'chave'|'lugar'|'nome'|'estudo', texto: string, fonte?: string }} FolhaDeTexto
 * @typedef {{ tipo: 'medida', linha: Linha }} FolhaDeMedida
 * @typedef {FolhaDeTexto|FolhaDeMedida} Folha
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
    case 'linha': {
      const c = slug ? getClaim(slug) : null;
      if (!c) return null;
      /* A ESCADA DECIDE, E O SILÊNCIO É UMA RESPOSTA. Onde nenhum dos quatro
         degraus dá texto, o caminho acaba no índice: promover o identificador da
         linha a nome dela seria escrever no cabeçalho o nome da máquina, que é
         exactamente o que o F1.4 tirou da página. */
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
