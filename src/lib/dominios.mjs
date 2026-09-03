/**
 * ===========================================================================
 * A LEITURA DAS MEDIDAS DE UM DOMÍNIO, E A GEOMETRIA DAS FORMAS ADMITIDAS
 * ===========================================================================
 *
 * É o lado do sítio da regra que `src/data/dominios.mjs` declara, e vive em
 * `src/lib/` pela razão de `regioes.mjs` e de `areas.mjs`: não acrescenta um
 * facto ao sítio, lê os que já existem na forma de que a página precisa.
 *
 * ---------------------------------------------------------------------------
 * NENHUMA FUNÇÃO DAQUI ESCREVE UM NÚMERO
 * ---------------------------------------------------------------------------
 * O que sai daqui são ids de linhas, campos de linhas tal como estão, e
 * GEOMETRIA de desenho (coordenadas, comprimentos de barra, classes de cor). A
 * geometria é derivada dos valores das linhas e do campo do desenho, e nenhum
 * número dela chega à página como texto: os números que se leem num desenho são
 * `<Claim/>` ou marcas de escala declaradas, e `scripts/check-formas.mjs`
 * recusa qualquer outro.
 *
 * ---------------------------------------------------------------------------
 * AS QUATRO FORMAS, E PORQUE HOJE SÓ DUAS DESENHAM
 * ---------------------------------------------------------------------------
 * O `BRIEF-forma-dos-dominios.md` §3 admite quatro formas e mais nenhuma. As
 * quatro estão aqui como quatro funções, e cada uma devolve `null` quando as
 * linhas de que precisa não existem. A recusa é mecânica, e não uma omissão de
 * quem escreveu a página:
 *
 *   1. `serieDoPais()`   pede dois ou mais períodos da mesma medida no
 *      livro-razão. Medido a 03.09.2026 sobre as 2 916 linhas: cada uma das dez
 *      medidas deste domínio tem UM período e mais nenhum. Devolve `null`.
 *   2. `entre27()`       pede as 27 linhas do conjunto que a fonte publica.
 *      Medido: o livro-razão não tem nenhuma linha de um Estado-membro que não
 *      seja Portugal. Devolve `null`.
 *   3. `barraConcelhoPais()` pede a linha do concelho e a do país, na mesma
 *      unidade. Existe para T3.
 *   4. `mapaPorConcelho()` pede as 308 linhas. Existe para T3 e para o índice
 *      de dívida de E5.
 *
 * As duas primeiras não são código morto: são o portão que impede que a segunda
 * e a terceira vagas desenhem uma série sobre um valor só. O dia em que o motor
 * atravessar o segundo período, a função devolve a série e a página desenha-a
 * sem que uma linha mude aqui.
 *
 * ---------------------------------------------------------------------------
 * O MAPA DOS 308 COMPÕE-SE DOS ARTEFACTOS PUBLICADOS, E O ERRO ESTÁ MEDIDO
 * ---------------------------------------------------------------------------
 * O motor publica a geometria em duas peças: `mapa/pais.json`, com as 29
 * unidades da Carta no campo nacional, cada uma com a sua `caixa` nesse campo; e
 * `mapa/distritos/<slug>.json`, com os concelhos de cada unidade na GRELHA LOCAL
 * dessa unidade. Não há, em nenhum dos dois, um caminho de concelho no campo
 * nacional, e o manifesto não publica a transformação entre as duas grelhas.
 *
 * ELA NÃO SE INVENTA: DEDUZ-SE DOS DOIS FICHEIROS E MEDE-SE. A grelha local de
 * uma unidade é exactamente a caixa dessa unidade no campo nacional, reescalada:
 * a união das caixas dos seus concelhos preenche o campo local sem margem, e a
 * transformação é `translate(caixa) scale(caixa/união)`. A prova é de área, e
 * não de caixa (uma prova de caixa seria circular, porque é a caixa que define a
 * transformação): a soma das áreas dos concelhos transformados de cada unidade
 * contra a área do caminho dessa unidade em `mapa/pais.json`. Medido a
 * 03.09.2026 nas 29 unidades: **erro máximo de 0,35 % nas 18 do continente** e
 * até 6,3 % nas ilhas mais pequenas, onde o caminho da unidade tem 292 unidades
 * de área e o erro é de arredondamento a inteiros do próprio artefacto. Os
 * números estão no relatório do bloco, com o comando.
 *
 * A TRANSFORMAÇÃO VAI NUM `transform` DO GRUPO, e os caminhos entram tal e qual.
 * Nenhuma coordenada é reescrita: o que o sítio desenha é, carácter a carácter,
 * o caminho que o motor publicou.
 */

import { getClaim, hasClaim, loadClaims, parsePtNumber, eValorTextual } from './ledger.mjs';
import { paisDoMapa, distritoDoMapa } from './mapa.mjs';
import { medidasDoDominio } from '../data/dominios.mjs';
import { entradasGeradas } from '../data/concelhos.mjs';
import { dataDaCasa } from './datas.mjs';

/**
 * ---------------------------------------------------------------------------
 * AS TRÊS DATAS DE UMA MEDIDA (carta §1, regra 3; brief F1.2 §2, item 5)
 * ---------------------------------------------------------------------------
 * «Três datas por medida, sempre: o período de referência, a data em que a
 * fonte o publicou, e a data em que a casa conferiu a fonte.» A do meio, no
 * livro-razão de hoje, é `access_date` na esmagadora maioria das linhas
 * (`published_at` existe em poucas), e é a que a página do livro-razão já rende
 * com o rótulo «lido». A terceira é a data da última entrada de `verifications`.
 *
 * O QUE ESTA FUNÇÃO DEVOLVE são os CAMPOS, e não texto composto: o id da linha,
 * o nome do campo dentro dela e o valor tal como o ficheiro o guarda. Quem rende
 * escreve-o na forma da casa por `dataDaCasa()`, e
 * `scripts/check-formas.mjs` recompõe a mesma cadeia do livro-razão e compara-a
 * carácter a carácter com o que a página imprimiu. Duas contas do mesmo campo,
 * feitas de sítios diferentes.
 *
 * UM PERÍODO NÃO É UMA DATA COMPLETA, e não se converte: «2024» e «2025-12» são
 * o período que a fonte mede, e `dataDaCasa()` deixa-os passar como estão,
 * porque uma função que lhes inventasse um dia inventava um facto.
 *
 * @param {string} id
 * @returns {{ campo: string, valor: string }[]}
 */
export function tresDatasDaLinha(id) {
  const linha = getClaim(id);
  /** @type {{ campo: string, valor: string }[]} */
  const datas = [];
  if (typeof linha.reference_date === 'string' && linha.reference_date !== '') {
    datas.push({ campo: 'reference_date', valor: linha.reference_date });
  }
  if (typeof linha.published_at === 'string' && linha.published_at !== '') {
    datas.push({ campo: 'published_at', valor: linha.published_at });
  } else if (typeof linha.access_date === 'string' && linha.access_date !== '') {
    datas.push({ campo: 'access_date', valor: linha.access_date });
  }
  const ultima = ultimaConferencia(linha);
  if (ultima) datas.push(ultima);
  return datas;
}

/**
 * A última conferência de uma linha: a entrada mais recente de `verifications`.
 *
 * O ÍNDICE VAI NO NOME DO CAMPO, e não é decoração: é a forma
 * `verifications.<n>.date` que a página da linha já usa e que o portão de HTML
 * sabe conferir. A escolha é pela DATA e não pela ordem do ficheiro, porque a
 * ordem de um ficheiro não é uma promessa.
 *
 * @param {Linha} linha
 * @returns {{ campo: string, valor: string }|null}
 */
function ultimaConferencia(linha) {
  const lista = Array.isArray(linha.verifications) ? linha.verifications : [];
  let melhor = null;
  let n = -1;
  for (const [i, v] of lista.entries()) {
    if (typeof v !== 'object' || v === null) continue;
    const data = /** @type {{ date?: unknown }} */ (v).date;
    if (typeof data !== 'string' || data === '') continue;
    if (melhor === null || data > melhor) {
      melhor = data;
      n = i;
    }
  }
  return melhor === null ? null : { campo: `verifications.${n}.date`, valor: melhor };
}

/**
 * A mesma data, na forma da casa. É a única transformação, e não inventa nada.
 *
 * @param {string} valor
 */
export const dataDaMedida = (valor) => dataDaCasa(valor);

/**
 * ---------------------------------------------------------------------------
 * AS 308 LINHAS DE UMA MEDIDA DE CONCELHO, POR SLUG
 * ---------------------------------------------------------------------------
 * A lista dos 308, com o id da linha de cada medida em cada concelho, é a de
 * `src/data/concelhos.mjs`: é a porta que o bloco dos 308 abriu, e uma segunda
 * leitura dos mesmos ficheiros seria uma segunda lista para divergir. O ganho
 * médio é a oitava medida daquela lista desde este bloco, e é lá que está
 * escrita a regra que o liga a cada concelho (o código do INE).
 *
 * O ÍNDICE DE DÍVIDA VEM DA DISTÂNCIA, e não do relance, porque é ali que a
 * entrada gerada o declara com o seu teto legal.
 *
 * @param {'ganho'|'indice'} chave
 * @returns {Map<string, string>}
 */
export function linhasPorConcelho(chave) {
  /** @type {Map<string, string>} */
  const porSlug = new Map();
  for (const c of entradasGeradas()) {
    const id =
      chave === 'indice'
        ? c.distancia?.indice
        : c.relance.find((m) => m.chave === 'ganho')?.claim;
    if (typeof id === 'string' && hasClaim(id)) porSlug.set(c.slug, id);
  }
  return porSlug;
}

/**
 * ---------------------------------------------------------------------------
 * FORMA 1 · A SÉRIE PEQUENA DO PASSADO DO PAÍS
 * ---------------------------------------------------------------------------
 * Pede dois ou mais períodos da MESMA medida. A mesma medida reconhece-se pelo
 * conjunto de dados que a fonte publica, que é o `document.edition` da linha
 * (`tipsgo10`, `lfsi_emp_a`, `indicador 0012656`): duas linhas do mesmo conjunto
 * e da mesma unidade, com períodos diferentes, são a mesma série.
 *
 * Devolve `null` com um período só, e é isso que devolve hoje para as dez
 * medidas deste domínio. Uma linha a ligar um ponto a si próprio não é uma
 * série: é um ponto com uma promessa por baixo.
 *
 * @param {string} id
 * @returns {{ id: string, valor: number, ref: string }[]|null}
 */
export function serieDoPais(id) {
  const base = getClaim(id);
  const documento = /** @type {{ edition?: unknown }|null} */ (
    typeof base.document === 'object' ? base.document : null
  );
  const edicao = documento?.edition;
  if (typeof edicao !== 'string' || edicao === '') return null;

  const pontos = [];
  for (const [outroId, linha] of loadClaims()) {
    const doc = /** @type {{ edition?: unknown }|null} */ (
      typeof linha.document === 'object' ? linha.document : null
    );
    if (doc?.edition !== edicao) continue;
    if (linha.unit !== base.unit) continue;
    const valor = parsePtNumber(linha.value);
    const ref = linha.reference_date;
    if (valor === null || typeof ref !== 'string' || ref === '') continue;
    pontos.push({ id: outroId, valor, ref });
  }
  pontos.sort((a, b) => (a.ref < b.ref ? -1 : a.ref > b.ref ? 1 : 0));
  return pontos.length >= 2 ? pontos : null;
}

/**
 * ---------------------------------------------------------------------------
 * FORMA 2 · A FAIXA «ONDE PORTUGAL ESTÁ ENTRE 27»
 * ---------------------------------------------------------------------------
 * «Só para medidas cuja fonte publica o conjunto inteiro, e só se as 27 linhas
 * existirem no livro-razão, senão não se desenha.» A condição é literal: 27
 * linhas do mesmo conjunto e da mesma unidade, uma por Estado-membro. Uma faixa
 * com menos não é uma posição entre 27, é uma posição entre as que temos.
 *
 * Devolve `null` hoje para as dez medidas: medido a 03.09.2026, o livro-razão
 * não tem uma única linha de um Estado-membro que não seja Portugal.
 *
 * @param {string} id
 * @returns {{ id: string, valor: number }[]|null}
 */
export function entre27(id) {
  const serie = serieDoPais(id);
  /* A mesma leitura da forma 1 sobre o mesmo conjunto: o que distingue as duas é
     o eixo. Aqui o conjunto teria de trazer 27 lugares para o MESMO período, e
     não 27 períodos do mesmo lugar. Sem uma dimensão de país no livro-razão, a
     pergunta não se pode sequer pôr, e a resposta honesta é a ausência. */
  if (serie === null) return null;
  const doMesmoPeriodo = serie.filter((p) => p.ref === getClaim(id).reference_date);
  return doMesmoPeriodo.length === 27 ? doMesmoPeriodo : null;
}

/**
 * ---------------------------------------------------------------------------
 * FORMA 3 · A BARRA DO CONCELHO CONTRA O PAÍS
 * ---------------------------------------------------------------------------
 * «Duas barras (o concelho, o país) com os valores escritos.» A geometria sai
 * dos dois valores e do campo do desenho, e mais nada: o comprimento de cada
 * barra é a fracção do maior dos dois.
 *
 * SÓ COM OS DOIS NÚMEROS. Onde um deles é uma marca da fonte, não há duas
 * barras para comparar, e a função devolve `null`, pela mesma regra 2 de
 * 28.08.2026 que a distância do concelho já aplica.
 *
 * O CAMPO É O MESMO DA DISTÂNCIA DO CONCELHO (720 unidades de largura), para que
 * as duas barras desta página tenham a mesma espessura de traço que as da página
 * do concelho.
 *
 * @param {string} idConcelho
 * @param {string} idPais
 */
export function barraConcelhoPais(idConcelho, idPais) {
  const c = getClaim(idConcelho);
  const p = getClaim(idPais);
  if (eValorTextual(c.value) || eValorTextual(p.value)) return null;
  const vc = parsePtNumber(c.value);
  const vp = parsePtNumber(p.value);
  if (vc === null || vp === null) return null;
  const maior = Math.max(vc, vp);
  if (maior <= 0) return null;
  const G = { W: 720, L: 10, R: 620, y: 14, h: 20, espaco: 34 };
  return {
    campo: G,
    concelho: { id: idConcelho, y: G.y, largura: (vc / maior) * (G.R - G.L) },
    pais: { id: idPais, y: G.y + G.espaco, largura: (vp / maior) * (G.R - G.L) },
    altura: G.y + G.espaco + G.h + 8,
  };
}

/**
 * ---------------------------------------------------------------------------
 * FORMA 4 · O MAPA POR CONCELHO
 * ---------------------------------------------------------------------------
 * Os 308 concelhos pintados por classes da medida, os que não têm valor
 * publicado em «sem valor» (uma trama, e não uma cor da escala), e os cortes das
 * classes escritos como números.
 *
 * OS CORTES SÃO DECLARADOS E NÃO CALCULADOS. Um corte calculado dos próprios
 * valores (um quintil, uma média) seria um número que a casa produziu e que não
 * resolve em nenhuma linha; um corte redondo na unidade da medida é a RÉGUA, que
 * é o que a escala de um instrumento é, e entra pelo motivo declarado
 * `escala-de-instrumento` que a casa já usa nos eixos.
 *
 * A IGUALDADE FICA DO LADO DE BAIXO QUANDO O CORTE É UM LIMIAR, e é a mesma
 * regra que `estadoDaMedida()` escreve para as peças: «um limiar do quadro é
 * "não passar de", e quem está exactamente nele não passou». Numa escala de
 * classes, onde o corte é uma régua e não uma lei, o valor igual ao corte entra
 * na classe de cima, que é a convenção de qualquer escala. Medido a 03.09.2026:
 * nenhum dos 308 concelhos tem o índice exactamente em 150, e por isso as duas
 * regras dão hoje o mesmo desenho; o campo existe para que a regra seja a da
 * casa e não um acaso do dia.
 *
 * @param {Map<string, string>} linhas  o id da linha de cada concelho
 * @param {number[]} cortes  os limites das classes, em unidades da medida
 * @param {{ igualdadeDentro?: boolean }} [regra]
 */
export function mapaPorConcelho(linhas, cortes, regra = {}) {
  const passa = regra.igualdadeDentro
    ? /** @param {number} n @param {number} corte */ (n, corte) => n > corte
    : /** @param {number} n @param {number} corte */ (n, corte) => n >= corte;
  const pais = paisDoMapa();
  const unidades = [];
  let comValor = 0;
  let semValor = 0;
  for (const u of pais.unidades) {
    const distrito = distritoDoMapa(u.slug);
    /* A transformação da grelha local desta unidade para o campo nacional: a
       caixa da unidade no campo nacional sobre a união das caixas dos seus
       concelhos na grelha local. Ver a nota do cabeçalho, e o erro medido. */
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const c of distrito.concelhos) {
      const [x, y, w, h] = c.caixa;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x + w);
      y1 = Math.max(y1, y + h);
    }
    const [bx, by, bw, bh] = u.caixa;
    const sx = bw / (x1 - x0);
    const sy = bh / (y1 - y0);
    const concelhos = distrito.concelhos.map((c) => {
      const id = linhas.get(c.slug) ?? null;
      const valor = id === null ? null : getClaim(id).value;
      const n = valor === null || eValorTextual(valor) ? null : parsePtNumber(valor);
      if (n === null) semValor++;
      else comValor++;
      let classe = null;
      if (n !== null) {
        classe = 0;
        while (classe < cortes.length && passa(n, cortes[classe])) classe++;
      }
      return { slug: c.slug, nome: c.nome, d: c.d, id, classe };
    });
    unidades.push({
      slug: u.slug,
      nome: u.nome,
      /* `translate` antes de `scale`, e a origem da grelha local subtraída: é a
         ordem em que um `transform` de SVG se lê, da direita para a esquerda. */
      transform: `translate(${bx} ${by}) scale(${sx} ${sy}) translate(${-x0} ${-y0})`,
      concelhos,
    });
  }
  return { campo: pais.campo, molduras: pais.molduras, unidades, comValor, semValor };
}

/**
 * ---------------------------------------------------------------------------
 * A FORMA QUE CADA MEDIDA GANHA, DECIDIDA DAS LINHAS E NÃO DE UMA LISTA
 * ---------------------------------------------------------------------------
 * A entrada da medida em `src/data/dominios.mjs` diz que forma ela PODE ter; é
 * aqui que se pergunta se as linhas existem. Uma medida que declare o mapa e não
 * tenha as 308 linhas não desenha nada, e é a mesma disciplina da régua da
 * região: «a régua nunca se completa com um número escrito à mão».
 *
 * @param {import('../data/dominios.mjs').MedidaDoDominio} medida
 */
export function formaDaMedida(medida) {
  if (medida.forma !== 'mapa') return null;
  const chave = medida.porConcelho;
  if (chave !== 'ganho' && chave !== 'indice') return null;
  const linhas = linhasPorConcelho(chave);
  return linhas.size === 308 ? { forma: /** @type {const} */ ('mapa'), chave, linhas } : null;
}

/**
 * As medidas de um domínio, cada uma com a sua linha, as suas três datas e a
 * forma que ganhou.
 *
 * @param {string} slug
 */
export function medidasComLeitura(slug) {
  return medidasDoDominio(slug).map((medida) => ({
    medida,
    linha: medida.claim === null ? null : getClaim(medida.claim),
    datas: medida.claim === null ? [] : tresDatasDaLinha(medida.claim),
    outras: (medida.claims ?? []).map((o) => ({
      ...o,
      linha: getClaim(o.id),
      datas: tresDatasDaLinha(o.id),
    })),
    desenho: formaDaMedida(medida),
  }));
}
