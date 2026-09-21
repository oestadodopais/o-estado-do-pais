/**
 * ===========================================================================
 * A REGIÃO E O DISTRITO DE CADA CONCELHO, LIDOS DA CARTA (B1, peça 2)
 * ===========================================================================
 *
 * PORQUE EXISTE. A linha de um lugar («Portugal › Alentejo › Évora › Évora»)
 * precisa de saber, para cada um dos 308 concelhos, em que região ele está e em
 * que distrito ou ilha. Nenhum módulo do repositório o dizia: `municipios.mjs`
 * tinha a região de Évora escrita à mão («Alentejo Central», que é uma NUTS III
 * e não uma das nove regiões do projeto) e os outros 307 não tinham região
 * nenhuma.
 *
 * NÃO É UMA TABELA ESCRITA. Os três extratos da Carta Administrativa Oficial de
 * Portugal de 2025 que este projeto aloja em `public/dados/` trazem, por
 * concelho, o código (`dtmn`), o nome (`municipio`), o distrito ou a ilha
 * (`distrito_ilha`) e a região (`nuts2`). É de lá que estes dois campos saem, e
 * de mais lado nenhum.
 *
 * ---------------------------------------------------------------------------
 * UM DISTRITO NÃO PERTENCE A UMA REGIÃO
 * ---------------------------------------------------------------------------
 * Medido a 21.09.2026 nestes mesmos três ficheiros: seis distritos têm concelhos
 * em duas regiões — Aveiro, Guarda, Leiria, Lisboa, Setúbal e Viseu, 102 dos 308
 * concelhos. A linha de um concelho diz a região DELE e o distrito DELE, cada um
 * lido da Carta para aquele concelho: para Espinho é «Portugal › Norte › Aveiro
 * › Espinho», e as quatro partes são verdadeiras para Espinho. A linha não
 * afirma que o distrito está dentro da região, e não existe aqui uma função de
 * distrito para região: ela seria falsa para 102 concelhos, e é por isso que
 * está escrito que não se escreva.
 *
 * ---------------------------------------------------------------------------
 * O NOME DA REGIÃO NA CARTA E O NOME DELA NESTE PROJETO
 * ---------------------------------------------------------------------------
 * Sete das nove regiões chamam-se o mesmo nos dois sítios. As duas regiões
 * autónomas não: a Carta escreve o nome oficial inteiro («Região Autónoma dos
 * Açores») e `src/data/regioes.mjs` usa a forma curta do uso corrente
 * («Açores»), com a razão escrita lá («o nome oficial encurta-se onde o uso
 * corrente o encurta»). A correspondência dos dois nomes é a tabela abaixo, com
 * duas entradas e mais nenhuma: é a única coisa escrita neste ficheiro, e o
 * portão falha se uma região da Carta não tiver entrada em `regioes.mjs` nem
 * aqui.
 *
 * ---------------------------------------------------------------------------
 * A BASE DO ÍNDICE DO PODER DE COMPRA VEM DA LINHA, E NÃO DAQUI
 * ---------------------------------------------------------------------------
 * A leitura de um lugar compara o poder de compra por pessoa com a média do
 * país. A média é a base do índice, e a base está escrita na própria linha do
 * livro-razão, no campo `unit`: «índice (Portugal = 100)». Lê-se de lá, por
 * `baseDoIndice()`, e o portão falha se alguma das linhas não a declarar. Um
 * 100 escrito aqui seria um número sem linha.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGIOES } from './regioes.mjs';
import { slugDeConcelho, slugsDaCarta } from '../lib/inicio.mjs';
import { MUNICIPIOS, DISTRITOS, eIlha } from './caop-centroids.mjs';

/**
 * Os três extratos, com o nome do ficheiro tal como ele está em `public/dados/`.
 * A lista é fechada: um quarto ficheiro entra aqui com a razão escrita.
 */
export const EXTRATOS_DA_CARTA = [
  'caop-2025-municipios-continente.csv',
  'caop-2025-municipios-acores.csv',
  'caop-2025-municipios-madeira.csv',
];

/** As colunas que este módulo lê, e mais nenhuma. */
const COLUNAS = ['dtmn', 'municipio', 'distrito_ilha', 'nuts2'];

/**
 * O nome de uma região na Carta quando ele não é o nome dela em `regioes.mjs`.
 * Duas entradas, as duas regiões autónomas, com o nome oficial à esquerda.
 */
/** @type {Record<string, string>} */
const NOME_DA_REGIAO_NA_CARTA = {
  'Região Autónoma dos Açores': 'Açores',
  'Região Autónoma da Madeira': 'Madeira',
};

/** A raiz do repositório, procurada a subir. Ver a razão em `concelhos.mjs`. */
function encontraRaiz() {
  /** @param {string} inicio */
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
    subir(process.cwd()) ?? subir(path.dirname(fileURLToPath(import.meta.url))) ?? process.cwd()
  );
}

/**
 * As linhas de dados de um extrato. O ficheiro tem um cabeçalho de comentários
 * (`#`), depois a linha dos nomes das colunas, depois uma linha por concelho.
 *
 * @param {string} cru
 * @param {string} ficheiro
 */
function linhasDoExtrato(cru, ficheiro) {
  const uteis = cru.split('\n').filter((l) => l.trim() !== '' && !l.startsWith('#'));
  const cabecalho = uteis.shift();
  if (cabecalho === undefined) {
    throw new Error(`carta: "${ficheiro}" não tem linha de colunas.`);
  }
  const colunas = cabecalho.split(',');
  for (const c of COLUNAS) {
    if (!colunas.includes(c)) {
      throw new Error(
        `carta: "${ficheiro}" não tem a coluna "${c}". As colunas são «${cabecalho}».`,
      );
    }
  }
  return uteis.map((l) => {
    const campos = l.split(',');
    /** @type {Record<string, string>} */
    const linha = {};
    colunas.forEach((c, i) => {
      linha[c] = (campos[i] ?? '').trim();
    });
    return linha;
  });
}

/** @type {{ dtmn: string, nome: string, slug: string, distrito: string, distritoSlug: string, ilha: boolean, regiaoNaCarta: string }[] | null} */
let _lugares = null;

/**
 * Os 308 concelhos da Carta, cada um com o seu distrito ou ilha e a sua região.
 *
 * O `slug` de cada concelho é o da casa (`slugsDaCarta()`, que desambigua as
 * duas Lagoas); o do distrito ou ilha é `slugDeConcelho()` sobre o nome que a
 * Carta lhe dá, que é a mesma regra com que o motor escreveu os 29 ficheiros do
 * mapa e com que `routePath('distrito', …)` compõe o endereço.
 */
export function lugaresDaCarta() {
  if (_lugares) return _lugares;
  const raiz = encontraRaiz();
  const slugs = slugsDaCarta();
  /** A posição de um concelho na Carta, pela chave nome + distrito. */
  const posicao = new Map(
    MUNICIPIOS.map((m, i) => [`${m[0]}|${DISTRITOS[m[1]]}`, i]),
  );
  const lista = [];
  for (const ficheiro of EXTRATOS_DA_CARTA) {
    const caminho = path.join(raiz, 'public', 'dados', ficheiro);
    if (!fs.existsSync(caminho)) {
      throw new Error(`carta: falta o extrato "${ficheiro}" em public/dados/.`);
    }
    for (const l of linhasDoExtrato(fs.readFileSync(caminho, 'utf8'), ficheiro)) {
      const chave = `${l.municipio}|${l.distrito_ilha}`;
      const i = posicao.get(chave);
      if (i === undefined) {
        throw new Error(
          `carta: "${l.municipio}" (${l.distrito_ilha}), do extrato "${ficheiro}", não está na ` +
            `lista da Carta que o sítio desenha. A ligação entre os dois é o nome e o distrito.`,
        );
      }
      lista.push({
        dtmn: l.dtmn,
        nome: l.municipio,
        slug: slugs[i],
        distrito: l.distrito_ilha,
        distritoSlug: slugDeConcelho(l.distrito_ilha),
        ilha: eIlha(l.distrito_ilha),
        regiaoNaCarta: l.nuts2,
      });
    }
  }
  _lugares = lista;
  return lista;
}

/** @type {Map<string, { slug: string, nome: { pt: string, en: string } }> | null} */
let _regiaoPorNome = null;

/**
 * A entrada de `regioes.mjs` de uma região da Carta, pelo nome.
 *
 * @param {string} nomeNaCarta
 */
export function regiaoDaCarta(nomeNaCarta) {
  if (!_regiaoPorNome) {
    _regiaoPorNome = new Map();
    for (const r of REGIOES) {
      if (r.referencia) continue;
      _regiaoPorNome.set(r.nome.pt, { slug: r.slug, nome: r.nome });
    }
  }
  const nome = NOME_DA_REGIAO_NA_CARTA[nomeNaCarta] ?? nomeNaCarta;
  return _regiaoPorNome.get(nome) ?? null;
}

/** @type {Map<string, { regiao: { slug: string, nome: { pt: string, en: string } }, distrito: { slug: string, nome: string, ilha: boolean } }> | null} */
let _porSlug = null;

/**
 * A região e o distrito de um concelho, pelo slug dele.
 *
 * Devolve `null` para um slug que não seja de um dos 308: quem rende uma página
 * de concelho fecha a construção com o nome dele, que é o que a vista faz.
 *
 * @param {string} slug
 */
export function lugarDoConcelho(slug) {
  if (!_porSlug) {
    _porSlug = new Map();
    for (const l of lugaresDaCarta()) {
      const regiao = regiaoDaCarta(l.regiaoNaCarta);
      if (!regiao) {
        throw new Error(
          `carta: a região "${l.regiaoNaCarta}" do concelho "${l.nome}" não tem entrada em ` +
            `src/data/regioes.mjs nem correspondência de nome em carta-dos-lugares.mjs.`,
        );
      }
      _porSlug.set(l.slug, {
        regiao,
        distrito: { slug: l.distritoSlug, nome: l.distrito, ilha: l.ilha },
      });
    }
  }
  return _porSlug.get(slug) ?? null;
}

/**
 * As nove regiões, pela ordem da colação portuguesa, cada uma com o seu slug.
 * É a lista que a página dos lugares rende.
 */
export function regioesDaCarta() {
  const colacao = new Intl.Collator('pt');
  const vistas = new Map();
  for (const l of lugaresDaCarta()) {
    const r = regiaoDaCarta(l.regiaoNaCarta);
    if (r && !vistas.has(r.slug)) vistas.set(r.slug, r);
  }
  return [...vistas.values()].sort((a, b) => colacao.compare(a.nome.pt, b.nome.pt));
}

/**
 * Os 29 distritos e ilhas, pela ordem da colação portuguesa. O nome é o que a
 * Carta lhes dá, e é o mesmo nas duas edições: é um nome próprio.
 */
export function distritosDaCarta() {
  const colacao = new Intl.Collator('pt');
  const vistos = new Map();
  for (const l of lugaresDaCarta()) {
    if (!vistos.has(l.distritoSlug)) {
      vistos.set(l.distritoSlug, { slug: l.distritoSlug, nome: l.distrito, ilha: l.ilha });
    }
  }
  return [...vistos.values()].sort((a, b) => colacao.compare(a.nome, b.nome));
}

/**
 * A base do índice do poder de compra, lida do campo `unit` da própria linha.
 *
 * O INE publica o índice com a média do país por base, e escreve-o na unidade:
 * «índice (Portugal = 100)». O que esta função devolve é o que lá está, tal
 * qual; devolve `null` quando a unidade não o declara, e quem compara não
 * compara.
 *
 * @param {{ unit?: unknown } | null | undefined} linha
 */
export function baseDoIndice(linha) {
  const unidade = typeof linha?.unit === 'string' ? linha.unit : '';
  const m = /\(\s*Portugal\s*=\s*([0-9]+(?:[.,][0-9]+)?)\s*\)/.exec(unidade);
  return m ? m[1] : null;
}
