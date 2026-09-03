/**
 * O CARTÃO DE PARTILHA: o modelo, os nomes e as rotas. Não desenha nada.
 *
 * ---------------------------------------------------------------------------
 * PORQUE ESTE FICHEIRO EXISTE E O QUE ELE NÃO PODE SER
 * ---------------------------------------------------------------------------
 * Um cartão de partilha é a única superfície da casa que viaja SEM a página.
 * Quem o vê não tem o livro-razão ao lado, não pode clicar num selo e não vai
 * conferir nada. Por isso a regra da direção (plano §5) é mais apertada aqui do
 * que em qualquer outro lado: o cartão rende-se **das linhas e da prova, pelo
 * mesmo caminho de componente que a página usa**. Nunca um segundo formatador,
 * nunca uma cadeia escrita à mão, nunca um `og:` composto à mão.
 *
 * O que isso quer dizer, na prática, é que este módulo **chama** e não
 * **reimplementa**:
 *
 *   · o valor com a unidade sai de `valorComUnidade()` de `src/lib/livro.mjs`,
 *     que é a mesma função que compõe o `<title>` da página da linha e que o
 *     portão já reproduz;
 *   · o estado sai de `estadoDaMedida()` de `src/lib/estado.mjs`, a mesma
 *     função que a peça da primeira página chama;
 *   · as palavras do estado saem de `s.estado.*`, o vocabulário fechado;
 *   · as contagens da manchete saem de `prova(lang)`, pelas mesmas chaves que a
 *     cabeça da primeira página rende (`painel_fora_do_limiar`,
 *     `painel_dentro_do_limiar`), e o portão reconta-as por conta própria;
 *   · as frases saem de `t(lang)`, as mesmas chaves das páginas. Nenhuma chave
 *     nova nasceu para o cartão: um cartão que precisasse de palavras próprias
 *     estaria a dizer uma coisa que a página não diz.
 *
 * O DESENHO não vive aqui: vive em `scripts/cartoes.mjs`, que pega neste
 * modelo, compõe o SVG e rasteriza. A divisão é deliberada — este ficheiro é
 * importado pelo `Base.astro` (que só precisa do ENDEREÇO do cartão) e pelo
 * portão (que precisa do endereço e da rota), e nenhum dos dois tem nada que
 * ver com tipos, píxeis ou rasterização.
 *
 * ---------------------------------------------------------------------------
 * O QUE O CARTÃO NÃO LEVA, e são proibições da direção, não gostos
 * ---------------------------------------------------------------------------
 *   · nenhuma linha de método (Emenda 11: a linha saiu do cabeçalho e do pé do
 *     cartão de partilha);
 *   · nenhuma frase sobre o sítio (Emenda 15). O que o cartão diz é o que a
 *     página diz: a medida, o valor, a unidade, o período, o estado;
 *   · nenhum ponto de mapa (Emenda 10: o ponto é um lugar, e o cartão não tem
 *     lugares);
 *   · nenhuma cor fora do par de estado (âmbar/ocre e cobalto);
 *   · nenhum valor que a própria página não leve.
 *
 * ---------------------------------------------------------------------------
 * O ÂMBITO DA FASE 1
 * ---------------------------------------------------------------------------
 * Cartão próprio: a primeira página (as duas edições) e as 132 páginas de linha
 * (as duas edições). Todas as outras rotas levam o cartão da primeira página da
 * SUA edição, e o registo de cada cartão diz que é isso que está a acontecer
 * (`cobre`, a lista de rotas que aquele cartão serve).
 *
 * ---------------------------------------------------------------------------
 * A EXCEPÇÃO DOS ESTUDOS DE DADOS, e porque ela é uma medida e não um gosto
 * ---------------------------------------------------------------------------
 * As linhas de um ESTUDO DE DADOS (`ESTUDOS_DE_DADOS`, em `src/data/studies.mjs`)
 * não têm cartão próprio: cada página de linha do estudo nomeia o CARTÃO DO
 * ESTUDO, um por edição, com o título do estudo por texto e sem número nenhum.
 *
 * A razão está medida em DECISIONS §1.68. Com as 2 417 linhas dos concelhos, as
 * páginas de linha pediam 9 668 dos 10 212 cartões da construção, e foi a
 * rasterizá-los que a máquina de construção da Vercel foi morta com o código 137,
 * dezanove minutos dentro do passo. O que a decisão anterior pesou foram os
 * limites de ficheiros da Vercel, que de facto não se aplicam a uma construção
 * disparada pelo Git; o limite que existia era outro, e era a memória.
 *
 * O que se perde e o que não se perde: uma página de linha dos concelhos
 * partilhada mostra o cartão do estudo em vez do seu valor. O valor continua no
 * `<title>`, na descrição e na própria página. O que NÃO se perde é a regra: o
 * cartão que ela nomeia existe, foi desenhado pela casa, e não tem um algarismo
 * que ninguém consiga reconduzir a uma origem — porque não tem algarismo nenhum.
 */

import { SITE_NAME, canonicalUrl } from '../../site.config.mjs';
import { ESTUDOS_DE_DADOS, studyLabel } from '../data/studies.mjs';
import { getClaim, loadClaims } from './ledger.mjs';
import { valorComUnidade } from './livro.mjs';
import { estadoDaMedida } from './estado.mjs';
import { prova } from './prova.mjs';
import { matchPath, routePath, LANGS } from './routes.mjs';
import { t } from '../i18n/strings.mjs';
import { FIGURAS_PDM } from '../data/figuras.mjs';

/**
 * As duas medidas, e porque são duas.
 *
 * 1200×630 é a proporção que o Open Graph pede e que o Facebook, o LinkedIn, o
 * WhatsApp e o Mastodon recortam sem cortar; 1200×600 é a `summary_large_image`
 * do Twitter/X, que é 2:1. São 30px de diferença e não valia a pena um segundo
 * desenho: o que muda é a altura da folha, e o desenho respira menos.
 */
export const DIMENSOES = [
  { largura: 1200, altura: 630, papel: 'og' },
  { largura: 1200, altura: 600, papel: 'twitter' },
];

/** O directório dos cartões dentro de `dist/`. Artefacto de construção, nunca commetido. */
export const PASTA = 'cartoes';

/**
 * O nome de ficheiro de um cartão: `<rota>.<lingua>.<largura>x<altura>.<ext>`.
 *
 * `<rota>` é o caminho sem as barras das pontas, com as restantes trocadas por
 * hífen; a raiz não tem caminho nenhum e chama-se `inicio`. É mecânico de
 * propósito: quem lê `dist/cartoes/` sabe de que página é cada ficheiro sem
 * abrir nada, e o portão reconstrói o nome a partir da rota da página que está
 * a conferir.
 *
 * @param {string} rota
 */
export function slugDaRota(rota) {
  const limpo = String(rota).replace(/^\/+/, '').replace(/\/+$/, '');
  return limpo === '' ? 'inicio' : limpo.replace(/\//g, '-');
}

/** @param {{ rota: string, lang: string, largura: number, altura: number, extensao?: string }} args */
export function nomeDoCartao({ rota, lang, largura, altura, extensao = 'png' }) {
  return `${slugDaRota(rota)}.${lang}.${largura}x${altura}.${extensao}`;
}

/** @param {{ rota: string, lang: string, largura: number, altura: number, extensao?: string }} args */
export function caminhoDoCartao(args) {
  return `/${PASTA}/${nomeDoCartao(args)}`;
}

/**
 * O endereço absoluto, que é o que uma etiqueta `og:image` tem de levar.
 *
 * @param {{ rota: string, lang: string, largura: number, altura: number, extensao?: string }} args
 */
export function urlDoCartao(args) {
  return canonicalUrl(caminhoDoCartao(args));
}

/**
 * O CARTÃO DE UM ESTUDO DE DADOS, ou `null` se o estudo não for um deles.
 *
 * A ROTA DO CARTÃO É A DA PÁGINA DE CONJUNTO DO ESTUDO, que é a superfície que o
 * estudo tem neste sítio. Não se inventa aqui um caminho para dar nome ao
 * ficheiro: um `rota` no registo de um cartão é um endereço que existe, ou não é
 * nada. A página de conjunto continua a levar o cartão da primeira página, como
 * levava — o que muda com esta decisão são as páginas de LINHA do estudo, e mais
 * nada.
 *
 * @param {string | null} study
 * @param {string} lang
 */
function cartaoDoEstudo(study, lang) {
  const conjunto = ESTUDOS_DE_DADOS.get(/** @type {string} */ (study));
  if (!conjunto) return null;
  return { tipo: 'estudo', id: study, rota: routePath(conjunto, lang), lang };
}

/**
 * QUE CARTÃO SERVE ESTA PÁGINA.
 *
 * Devolve sempre um cartão: uma rota sem cartão próprio leva o da primeira
 * página da sua edição. Nunca devolve `null`, porque uma página sem `og:image`
 * é uma página que qualquer sítio de partilha desenha à sua maneira, e o que
 * ele desenha não passou por portão nenhum.
 *
 * Uma página de linha de um ESTUDO DE DADOS leva o cartão do seu estudo. A
 * pergunta faz-se à linha, no campo `study`, e não ao nome da rota: é a linha
 * que declara de que estudo é, e um recorte do id daria a resposta errada em
 * silêncio.
 *
 * @param {string} caminho
 * @param {string} lang
 */
export function cartaoDaPagina(caminho, lang) {
  const rota = matchPath(caminho);
  if (rota?.key === 'linha' && rota.params?.slug) {
    const linha = loadClaims().get(rota.params.slug);
    if (linha) {
      return (
        cartaoDoEstudo(linha.study, rota.lang) ?? {
          tipo: 'linha',
          id: rota.params.slug,
          rota: caminho,
          lang: rota.lang,
        }
      );
    }
  }
  return { tipo: 'inicio', id: null, rota: routePath('home', lang), lang };
}

/**
 * TODOS OS CARTÕES A CONSTRUIR, com a lista das rotas que cada um serve.
 *
 * A lista das rotas servidas não é decorativa: entra no registo de cada cartão,
 * e é assim que o registo diz, sem que ninguém tenha de o adivinhar, que a
 * Agenda e o Método levam o cartão da primeira página.
 *
 * @param {{ caminho: string, lang: string }[]} rotasDoSitio
 */
export function cartoesAConstruir(rotasDoSitio) {
  /** @type {Map<string, { tipo: string, id: string | null, rota: string, lang: string, cobre: string[] }>} */
  const cartoes = new Map();
  /** @param {{ tipo: string, id: string | null, lang: string }} c */
  const chave = (c) => `${c.tipo}:${c.id ?? ''}:${c.lang}`;

  for (const lang of LANGS) {
    const c = { tipo: 'inicio', id: null, rota: routePath('home', lang), lang, cobre: [] };
    cartoes.set(chave(c), c);
  }
  for (const lang of LANGS) {
    for (const [id, linha] of loadClaims()) {
      /* A linha de um estudo de dados não tem cartão próprio: tem o do estudo,
         que se acrescenta abaixo e uma vez só. */
      const doEstudo = cartaoDoEstudo(linha.study, lang);
      const c = doEstudo
        ? { ...doEstudo, cobre: [] }
        : { tipo: 'linha', id, rota: routePath('linha', lang, { slug: id }), lang, cobre: [] };
      if (!cartoes.has(chave(c))) cartoes.set(chave(c), c);
    }
  }
  for (const { caminho, lang } of rotasDoSitio ?? []) {
    const escolha = cartaoDaPagina(caminho, lang);
    const c = cartoes.get(chave(escolha));
    if (c) c.cobre.push(caminho);
  }
  for (const c of cartoes.values()) c.cobre.sort();
  return [...cartoes.values()];
}

/* ======================================================== o modelo do cartão */

/**
 * Um valor do cartão, com a sua origem.
 *
 * `origem: 'linha'` — o campo `campo` da linha `linha` do livro-razão. O portão
 * relê a linha do disco e compara a cadeia.
 * `origem: 'prova'` — a chave `chave` da prova. O portão RECONTA a chave por
 * conta própria (`contasDoPortao()`) e compara a cadeia.
 *
 * `unidade` e `periodo` viajam com o valor porque a direção os pediu no
 * registo: um valor sem unidade e sem período é um número solto, que é
 * exactamente o que um cartão de partilha não pode ser.
 */
/**
 * @param {Linha} claim
 * @param {string} campo
 */
function valorDaLinha(claim, campo) {
  return {
    texto: String(claim[campo]),
    origem: 'linha',
    linha: claim.id,
    campo,
    unidade: claim.unit ?? null,
    periodo: claim.reference_date ?? null,
  };
}

/**
 * @param {Record<string, ChaveDaProva>} p
 * @param {string} chave
 */
function valorDaProva(p, chave) {
  return {
    texto: String(p[chave].valor),
    origem: 'prova',
    chave,
    unidade: null,
    periodo: null,
  };
}

/**
 * O MODELO DA PRIMEIRA PÁGINA.
 *
 * A manchete é a da cabeça, peça por peça: `tituloPaisA` + a contagem de fora +
 * a cauda (singular ou plural, escolhida pela contagem como `Cabeca.astro` a
 * escolhe) + a contagem de dentro + `tituloPaisFim`. Nada é traduzido aqui e
 * nada é composto de novo: são as mesmas cadeias, pela mesma ordem.
 *
 * A fila de quadrados é a das treze medidas do painel, cada uma com o estado que
 * `estadoDaMedida()` lhe dá. A Emenda 13 tirou a fila da CABEÇA da página, e a
 * §5 do plano põe-na no CARTÃO — que é outra superfície e outro problema: no
 * cartão não há peças onde o marcador de cada medida possa viver, e sem a fila o
 * cartão diria a contagem sem mostrar de que tamanho é o painel.
 *
 * @param {Lingua} lang
 */
function modeloDoInicio(lang) {
  const s = t(lang);
  const p = prova(lang);

  const fora = p.painel_fora_do_limiar.valor;
  const cauda = fora === 1 ? s.inicio.cabeca.tituloPaisUm : s.inicio.cabeca.tituloPaisMuitos;

  const estados = FIGURAS_PDM.map((f) => estadoDaMedida(getClaim(f.claim), f.limiar));
  const quadrados = {
    fora: estados.filter((e) => e === 'fora').length,
    dentro: estados.filter((e) => e === 'dentro').length,
    sem: estados.filter((e) => e !== 'fora' && e !== 'dentro').length,
  };

  const valores = [
    valorDaProva(p, 'painel_fora_do_limiar'),
    valorDaProva(p, 'painel_dentro_do_limiar'),
    valorDaProva(p, 'painel_reconferido_em'),
  ];

  const manchete =
    s.inicio.cabeca.tituloPaisA +
    valores[0].texto +
    cauda +
    valores[1].texto +
    s.inicio.cabeca.tituloPaisFim;

  /* As palavras do estado, ao lado da fila. A direção pediu-as por escrito no
     cartão E na fila: «the state is written in words on the card as well as
     shown in the strip». Uma fila sem palavras é cor a fazer o trabalho todo,
     que é o que a §3 da constituição proíbe. */
  const fila = [
    { estado: 'fora', quantos: quadrados.fora, palavra: s.estado.foraDoLimiar },
    { estado: 'dentro', quantos: quadrados.dentro, palavra: s.estado.dentroDoLimiar },
    { estado: 'sem', quantos: quadrados.sem, palavra: s.estado.semLimiar },
  ].filter((g) => g.quantos > 0);

  return {
    tipo: 'inicio',
    lang,
    rota: routePath('home', lang),
    marca: SITE_NAME,
    sobrancelha: s.inicio.cabeca.paisA,
    manchete,
    fila,
    aparelho: null,
    estado: null,
    meta: [`${s.sinal.reconferido} ${valores[2].texto}`],
    valores,
    quadrados,
  };
}

/**
 * O MODELO DE UMA PÁGINA DE LINHA.
 *
 * A manchete é o que a página tem por `<h1>`: o valor e a unidade. Não é uma
 * frase escrita para o cartão — é `valorComUnidade()`, a mesma função que
 * compõe o título da página e que aplica a regra da §11 (o símbolo cola-se ao
 * número, a palavra leva espaço).
 *
 * O ESTADO só existe onde há limiar publicado, e o limiar de uma linha do painel
 * está declarado em `FIGURAS_PDM` — que é onde a peça da primeira página o vai
 * buscar. Uma linha fora do painel não tem limiar publicado e o cartão diz-lhe
 * «sem limiar», que é a palavra do vocabulário fechado para isso. Nunca se
 * infere um limiar.
 *
 * @param {string} id
 * @param {Lingua} lang
 */
function modeloDaLinha(id, lang) {
  const s = t(lang);
  const claim = getClaim(id);
  const figura = FIGURAS_PDM.find((f) => f.claim === id) ?? null;
  const estado = figura ? (estadoDaMedida(claim, figura.limiar) ?? 'sem') : 'sem';

  const valores = [valorDaLinha(claim, 'value')];
  if (claim.unit) valores.push(valorDaLinha(claim, 'unit'));
  valores.push(valorDaLinha(claim, 'id'));
  if (claim.reference_date) valores.push(valorDaLinha(claim, 'reference_date'));
  if (claim.source) valores.push(valorDaLinha(claim, 'source'));
  if (claim.access_date) valores.push(valorDaLinha(claim, 'access_date'));

  const PALAVRA = {
    fora: s.estado.foraDoLimiar,
    dentro: s.estado.dentroDoLimiar,
    sem: s.estado.semLimiar,
  };

  const aparelho = [claim.id, claim.reference_date].filter(Boolean).join(' · ');
  const meta = [];
  if (claim.source) meta.push(`${s.prov.fonte}: ${claim.source}`);
  if (claim.access_date) meta.push(`${s.prov.lido} ${claim.access_date}`);

  return {
    tipo: 'linha',
    lang,
    id,
    rota: routePath('linha', lang, { slug: id }),
    marca: SITE_NAME,
    sobrancelha: s.livro.linha.eyebrow,
    manchete: valorComUnidade(claim),
    fila: null,
    aparelho,
    estado: { estado, palavra: PALAVRA[estado] },
    meta,
    valores,
    quadrados: null,
  };
}

/**
 * O MODELO DO CARTÃO DE UM ESTUDO DE DADOS.
 *
 * É a folha da casa com o título do estudo, e mais nada: a mesma sobrancelha e o
 * mesmo título que a página de conjunto do estudo rende, pelas mesmas duas
 * chamadas (`s.livro.eyebrow` e `studyLabel()`). Nenhuma cadeia nova nasceu para
 * este cartão, como nenhuma nasceu para os outros dois.
 *
 * NÃO LEVA NÚMERO NENHUM, e é uma decisão e não uma falta. Um cartão que
 * viajasse com a contagem das linhas do estudo levaria um número do próprio
 * sítio, que a IDENTIDADE §10 obriga a entrar por `data-prova` com quem o
 * reconte; e um cartão que levasse o valor de UMA das linhas estaria a escolher
 * uma linha entre milhares para representar as outras. Sem valores, a lista
 * `valores` fica vazia e a conferência dos algarismos do portão continua a
 * morder: o que ela exige é que nenhum algarismo da cópia visível fique sem
 * origem, e a maneira mais segura de o cumprir é não ter algarismo nenhum.
 *
 * @param {string} id
 * @param {Lingua} lang
 */
function modeloDoEstudo(id, lang) {
  const s = t(lang);
  const conjunto = ESTUDOS_DE_DADOS.get(id);
  if (!conjunto) throw new Error(`cartões: "${id}" não é um estudo de dados.`);
  return {
    tipo: 'estudo',
    lang,
    id,
    rota: routePath(conjunto, lang),
    marca: SITE_NAME,
    sobrancelha: s.livro.eyebrow,
    manchete: studyLabel(id, lang),
    fila: null,
    aparelho: null,
    estado: null,
    meta: [],
    valores: [],
    quadrados: null,
  };
}

/**
 * O modelo de um cartão, seja de que tipo for.
 *
 * @param {{ tipo: string, id: string, lang: Lingua }} cartao
 */
export function modeloDoCartao({ tipo, id, lang }) {
  if (tipo === 'linha') return modeloDaLinha(id, lang);
  if (tipo === 'estudo') return modeloDoEstudo(id, lang);
  return modeloDoInicio(lang);
}

/**
 * A CÓPIA VISÍVEL, na ordem em que se lê.
 *
 * É esta lista que entra no registo e é sobre ela que o portão impõe a regra
 * mais dura do cartão: **nenhum algarismo na cópia visível que não esteja num
 * dos valores declarados**. Um cartão pode dizer palavras que a página diz;
 * não pode dizer um número que ninguém consegue reconduzir a uma linha ou a
 * uma chave da prova.
 *
 * @param {Record<string, any>} modelo
 * @param {string} hospedeiro
 */
export function copiaVisivel(modelo, hospedeiro) {
  const partes = [modelo.marca, modelo.sobrancelha, modelo.manchete];
  if (modelo.fila) for (const g of modelo.fila) partes.push(g.palavra);
  if (modelo.estado) partes.push(modelo.estado.palavra);
  if (modelo.aparelho) partes.push(modelo.aparelho);
  partes.push([hospedeiro, ...modelo.meta].join(' · '));
  return partes.filter((x) => x !== null && x !== undefined && x !== '');
}
