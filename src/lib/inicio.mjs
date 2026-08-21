/**
 * A CANALIZAÇÃO DA PRIMEIRA PÁGINA v3.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE, E PORQUE NÃO ESTÁ EM `src/data/`
 * ---------------------------------------------------------------------------
 * A primeira página da v3 tem âmbito e densidade codificados no endereço
 * (Emenda 7, plano §13), e três componentes mais a vista precisam das MESMAS
 * listas fechadas para os resolver: os seis âmbitos de região, os 308 âmbitos de
 * concelho, e o nome de cada um no endereço. Isto não são dados novos — é a
 * leitura dos dados que já existem (`caop-centroids.mjs`, `regioes.mjs`,
 * `municipios.mjs`) na forma de que o endereço precisa. Por isso vive em
 * `src/lib/` e não em `src/data/`: não acrescenta um facto ao sítio.
 *
 * NENHUMA FUNÇÃO DAQUI PRODUZ TEXTO VISÍVEL COM ALGARISMOS. O que sai daqui são
 * nomes que já estavam escritos na Carta Administrativa, chaves de endereço e
 * geometria de desenho.
 */

import { MUNICIPIOS, DISTRITOS } from '../data/caop-centroids.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../data/municipios.mjs';
import { REGIOES } from '../data/regioes.mjs';

/**
 * O nome de um concelho, sem acentos e em caixa baixa.
 *
 * Serve duas coisas, e nenhuma delas é texto à vista: o pedaço do endereço
 * (`?ambito=municipio:vila-real`) e a comparação da pesquisa, que tem de
 * encontrar «Évora» a quem escreve «evora». A regra é a mesma dos dois lados,
 * escrita uma vez: decompor os acentos, deitar fora as marcas, e deixar passar
 * letras e algarismos.
 *
 * O ponto e a apóstrofe caem, e o espaço vira hífen: «Vila Real de Santo
 * António» dá «vila-real-de-santo-antonio», e «Freixo de Espada à Cinta» dá
 * «freixo-de-espada-a-cinta».
 */
export function semAcentos(nome) {
  return String(nome)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function slugDeConcelho(nome) {
  return semAcentos(nome)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * DOIS CONCELHOS CHAMAM-SE LAGOA, e um endereço não pode abrir os dois.
 *
 * A Carta Administrativa tem «Lagoa» no distrito de Faro e «Lagoa» na Ilha de
 * São Miguel. Medido sobre a lista: é a única colisão de nome nos 308. Um slug
 * repetido punha dois concelhos na mesma chave de endereço, e o segundo deixava
 * de ter maneira de ser escolhido — em silêncio, que é o pior modo de falhar.
 *
 * A regra: onde o NOME é único, o slug é o nome; onde não é, o slug leva também
 * o distrito ou a ilha que a própria Carta lhe dá («lagoa-faro»,
 * «lagoa-ilha-de-sao-miguel»). Só os nomes repetidos pagam o preço, e a
 * desambiguação sai do registo, não de uma escolha nossa.
 */
function slugsDaCarta() {
  const vezes = new Map();
  for (const m of MUNICIPIOS) {
    const s = slugDeConcelho(m[0]);
    vezes.set(s, (vezes.get(s) ?? 0) + 1);
  }
  return MUNICIPIOS.map((m) => {
    const simples = slugDeConcelho(m[0]);
    if (vezes.get(simples) === 1) return simples;
    return `${simples}-${slugDeConcelho(DISTRITOS[m[1]])}`;
  });
}

/**
 * Os 308 concelhos, com tudo o que a primeira página precisa de saber deles.
 *
 * A ordem é a da Carta Administrativa, e não se reordena: é a ordem em que o
 * mapa os desenha e em que o índice dos concelhos os lista.
 *
 * `alvo` é o meio-caminho até ao vizinho mais próximo, em unidades do campo do
 * mapa. É com ele que se desenha a área de toque de cada ponto: uma área maior
 * do que isto encosta na do vizinho, e duas áreas sobrepostas não são um alvo
 * maior — são uma porta que abre o concelho do lado (é a medição da etapa 1d,
 * ISSUES I13, aplicada a um mapa em vez de a uma fila de selos).
 */
/**
 * A CARTA ESCREVE DUAS COISAS NO MESMO CAMPO, E A ETIQUETA TEM DE AS DISTINGUIR.
 *
 * ISSUES I18, fechado na subetapa 2g. O campo que a CAOP dá a cada concelho é
 * um distrito («Beja», «Viana do Castelo») ou uma ilha («Ilha do Faial», «Ilha
 * de São Miguel»), e as duas coisas não se leem da mesma maneira: «distrito de
 * Beja» é o que se diz, e «distrito de Ilha do Faial» não é português nenhum.
 *
 * A regra é a da prancha, e é uma só para os 308: prefixo «distrito de» quando
 * o campo é um distrito, nome de ilha nu quando começa por «Ilha». Fica
 * decidida AQUI, na construção, e não no cliente: o que o script faz com ela é
 * trocar `hidden` a um prefixo que já está escrito na página, nas duas edições.
 *
 * A comparação é sobre a primeira palavra do campo, e não sobre uma lista de
 * nomes: a lista de ilhas de `caop-centroids.mjs` é derivada do mesmo campo, e
 * conferir uma lista contra a outra seria conferir a Carta contra ela própria.
 */
export const eIlha = (distrito) => /^Ilha\b/.test(String(distrito));

export function concelhos() {
  const paginaPorIndice = new Map(MUNICIPIOS_COM_PAGINA.map((m) => [m.caopIndex, m]));
  const slugs = slugsDaCarta();
  const base = MUNICIPIOS.map((m, i) => ({
    i,
    nome: m[0],
    distrito: DISTRITOS[m[1]],
    ilha: eIlha(DISTRITOS[m[1]]),
    x: m[2],
    y: m[3],
    slug: slugs[i],
    normal: semAcentos(m[0]),
    pagina: paginaPorIndice.get(i) ?? null,
  }));
  for (const c of base) {
    let d2 = Infinity;
    for (const o of base) {
      if (o === c) continue;
      const dx = o.x - c.x;
      const dy = o.y - c.y;
      const d = dx * dx + dy * dy;
      if (d < d2) d2 = d;
    }
    c.alvo = Number.isFinite(d2) ? Math.sqrt(d2) / 2 : 0;
  }
  return base;
}

/**
 * ===========================================================================
 * A LEDE DO PAINEL, CONSTRUÍDA E NÃO ESCRITA (etapa 2m, brief §2)
 * ===========================================================================
 *
 * A manchete do País recontava-se sozinha desde a 2l: as duas contagens são
 * chaves da prova e o portão reconta-as. A LEDE não. Estava escrita à mão —
 * «Fora do limiar: dívida pública, posição de investimento internacional, custo
 * unitário do trabalho e preços da habitação, em 2025.» — e ficava falsa no dia
 * em que uma quinta medida atravessasse o seu limiar, sem que nada no sítio o
 * dissesse. A manchete passaria a dizer 5 e a lede continuaria a nomear quatro.
 *
 * Passa a ser construída, na CONSTRUÇÃO e nunca no cliente, de três coisas que
 * já existem e são conferidas:
 *
 *   · os NOMES das peças do Procedimento cujo estado é «fora», pela ordem do
 *     painel, tal como `figuras.mjs` os declara nas duas línguas;
 *   · as PALAVRAS DE GRAMÁTICA da edição («, », « e » / « and », «, em » /
 *     «, in », o ponto final), de `strings.mjs`;
 *   · o ANO, que é o `reference_date` das linhas e sai marcado como qualquer
 *     data de referência da casa.
 *
 * NENHUM ALGARISMO É ESCRITO POR ESTA FUNÇÃO. O único que a frase leva é o ano,
 * e esse não é composto: é o campo da linha, tal como ele está.
 *
 * O ANO SÓ ENTRA SE FOR UM SÓ. As peças trazem cada uma o seu período, e quatro
 * medidas de anos diferentes não têm um ano comum: nesse dia a frase acaba na
 * lista, sem «, em …», porque cada peça já diz o seu. Uma frase que escolhesse
 * um dos anos para representar os quatro estaria a afirmar mais do que sabe.
 *
 * O PORTÃO CONTA OS ITENS DA LISTA e compara-os com `painel_fora_do_limiar`,
 * pela marca `data-prova-lista`. É a mesma disciplina do `data-prova`: duas
 * contas da mesma coisa, feitas de sítios diferentes, que têm de bater certo.
 */

/**
 * O nome de uma medida no meio de uma frase.
 *
 * A ÚNICA TRANSFORMAÇÃO QUE A CONSTRUÇÃO FAZ A UM NOME DECLARADO, e vai dita
 * inteira: a primeira letra desce de caixa. `figuras.mjs` escreve «Dívida
 * pública» porque é assim que o nome encabeça a peça; a lede escreve-o a seguir
 * a dois pontos, no meio de uma frase, e é assim que a Emenda 16 a redige nas
 * duas edições («dívida pública…», «government debt…»). Sem esta linha a frase
 * construída deixaria de ser a frase escrita, que é o teste de aceitação desta
 * mudança: hoje, as duas têm de ser a mesma cadeia, carácter a carácter.
 *
 * O MODO DE FALHAR ESTÁ NOMEADO: um nome que comece por nome próprio («Eurostat
 * …») desceria de caixa e ficaria errado. Nenhum dos treze do Procedimento é
 * assim, e não há regra que o adivinhe — está em ISSUES para que a próxima
 * medida a entrar seja lida antes de entrar, e não depois.
 */
export function nomeEmFrase(nome) {
  const n = String(nome);
  return n.charAt(0).toLowerCase() + n.slice(1);
}

/**
 * @param {Array} medidas  as peças do painel, já com `estado` e `linha`
 * @param {object} gramatica  `s.inicio.cabeca.ledePais` da edição
 * @param {'pt'|'en'} lang
 * @returns {{ itens: string[], nomes: string[], ano: string|null, cauda: any[] } | null}
 */
export function ledeDoPainel(medidas, gramatica, lang) {
  const fora = medidas.filter((m) => m.estado === 'fora');
  if (fora.length === 0) return null;

  const nomes = fora.map((m) => nomeEmFrase(m.nome[lang] ?? m.nome.pt));

  /* Os itens já com os separadores pelo meio, para que o gabarito os renda como
     uma lista de pedaços adjacentes e não tenha de decidir nada: um espaço a
     mais entre dois pedaços seria um espaço a mais na frase. */
  const itens = [];
  nomes.forEach((nome, i) => {
    if (i > 0) itens.push(i === nomes.length - 1 ? gramatica.ultimo : gramatica.separador);
    itens.push(nome);
  });

  const anos = new Set(fora.map((m) => m.linha?.reference_date).filter(Boolean));
  const ano = anos.size === 1 ? [...anos][0] : null;

  return {
    itens,
    nomes,
    ano,
    cauda: ano ? [gramatica.ano, { ref: ano }, gramatica.fecha] : [gramatica.fecha],
  };
}

/**
 * ---------------------------------------------------------------------------
 * O ESQUEMA FECHADO DO ENDEREÇO (plano §13)
 * ---------------------------------------------------------------------------
 *
 *   ?ambito=pais                    (por defeito, e por isso omitido)
 *   ?ambito=regiao:<slug>           slug de `regioes.mjs`, MENOS a referência
 *   ?ambito=municipio:<slug>        slug da Carta Administrativa
 *   ?densidade=relance              (por defeito, e por isso omitido)
 *   ?densidade=leitura
 *
 * As chaves e os valores são os mesmos nas duas edições: o que se traduz é o
 * rótulo, nunca a chave. Qualquer outro valor resolve para o defeito, sem texto
 * de erro, e o endereço é reescrito para a forma normalizada.
 *
 * PORTUGAL NÃO É UMA REGIÃO, e por isso `regiao:portugal` não é um âmbito: cai
 * no defeito como qualquer outro valor desconhecido. O plano §13 fecha a lista
 * em cinco, e `regioes.mjs` declara qual das seis leituras da régua é a marca de
 * referência (`referencia: true`). A lista sai daquele campo, e não de uma
 * segunda lista escrita aqui, que divergiria à primeira alteração.
 */
export const AMBITO_POR_DEFEITO = 'pais';
export const DENSIDADE_POR_DEFEITO = 'relance';
export const DENSIDADES = ['relance', 'leitura'];

/** As cinco regiões do esquema do endereço. A sexta leitura da régua é Portugal,
    que é a referência contra a qual elas se leem, e não um âmbito. */
export const REGIOES_DE_AMBITO = REGIOES.filter((r) => !r.referencia);

export const chaveDaRegiao = (slug) => `regiao:${slug}`;
export const chaveDoConcelho = (slug) => `municipio:${slug}`;

/** A lista fechada dos âmbitos, na ordem em que a página os desenha. */
export function ambitos() {
  return [
    AMBITO_POR_DEFEITO,
    ...REGIOES_DE_AMBITO.map((r) => chaveDaRegiao(r.slug)),
    ...concelhos().map((c) => chaveDoConcelho(c.slug)),
  ];
}
