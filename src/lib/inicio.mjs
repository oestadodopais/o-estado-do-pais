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
 * ---------------------------------------------------------------------------
 * O ESQUEMA FECHADO DO ENDEREÇO (plano §13)
 * ---------------------------------------------------------------------------
 *
 *   ?ambito=pais                    (por defeito, e por isso omitido)
 *   ?ambito=regiao:<slug>           slug de `regioes.mjs`
 *   ?ambito=municipio:<slug>        slug da Carta Administrativa
 *   ?densidade=relance              (por defeito, e por isso omitido)
 *   ?densidade=leitura
 *
 * As chaves e os valores são os mesmos nas duas edições: o que se traduz é o
 * rótulo, nunca a chave. Qualquer outro valor resolve para o defeito, sem texto
 * de erro, e o endereço é reescrito para a forma normalizada.
 */
export const AMBITO_POR_DEFEITO = 'pais';
export const DENSIDADE_POR_DEFEITO = 'relance';
export const DENSIDADES = ['relance', 'leitura'];

export const chaveDaRegiao = (slug) => `regiao:${slug}`;
export const chaveDoConcelho = (slug) => `municipio:${slug}`;

/** A lista fechada dos âmbitos, na ordem em que a página os desenha. */
export function ambitos() {
  return [
    AMBITO_POR_DEFEITO,
    ...REGIOES.map((r) => chaveDaRegiao(r.slug)),
    ...concelhos().map((c) => chaveDoConcelho(c.slug)),
  ];
}
