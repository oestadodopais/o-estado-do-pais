/**
 * F19 · K18 · A FAIXA DA UNIÃO, REFEITA DOS PONTOS (bloco UE1, 29.09.2026).
 *
 * Uma função só, chamada por dois portões: a F19 do `check:formas`, que corre na
 * cadeia da construção (a única que a Vercel corre), e a K18 do `check:cartao`,
 * na do `verify`. Recompõe o que a faixa mostra a partir da série e das palavras
 * declaradas, com as contas dos portões (`scripts/series-do-portao.mjs`), e não
 * pergunta nada ao resolvedor (`src/lib/faixa-da-uniao.mjs`):
 *
 *   F19a · a faixa está em cada cartão nacional (o que leva a leitura) cuja linha
 *          tem série de países, uma vez, e em nenhum outro cartão;
 *   F19b · o desenho tem uma marca por país da série e uma da União, e mais
 *          nenhuma; a de Portugal e a da União têm a forma delas;
 *   F19c · a posição de cada marca é a que o valor dá, com quatro casas, e os
 *          rótulos de Portugal e da União estão na posição das suas marcas;
 *   F19d · as pontas nomeiam o país mais baixo e o mais alto (todos, num
 *          empate), com o valor e a marca da fonte quando o ponto a tem;
 *   F19e · a frase é, carácter a carácter, a recomposição das palavras declaradas
 *          com os pontos, os nomes da tabela, a contagem, o lugar e o período, no
 *          ramo que os valores mandam (com ou sem empate); e as marcas dela dizem
 *          os pontos e os países certos, pela ordem;
 *   F19f · a porta abre o recibo da série, na edição da página.
 *
 * O que ela NÃO confere, porque outro portão já o faz: que o texto de cada
 * `data-ponto` é o valor do ponto e que o nome de cada `data-pais` é o da tabela
 * (o portão de HTML), e que a data do período é a da série (a F1).
 */
import { parse } from 'node-html-parser';

import { contaDaFaixa, posicaoNaFaixa, serieDaLinhaDoPortao, AGREGADO } from '../../scripts/series-do-portao.mjs';
import { PALAVRAS_DA_FAIXA } from '../../src/data/faixa-da-uniao.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';
import { routePath } from '../../src/lib/routes.mjs';

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const esquerdaDe = (el) => {
  const m = /(?:^|;)\s*left\s*:\s*(-?[\d.]+)%/.exec(el?.getAttribute('style') ?? '');
  return m ? Number(m[1]) : null;
};

/** A frase que a faixa de uma série tem de dizer, recomposta aqui. */
export function fraseEsperada(serie, lang, paises) {
  const c = contaDaFaixa(serie);
  const palavras = PALAVRAS_DA_FAIXA[lang];
  const nome = (geo) => {
    const p = paises.get(geo);
    if (!p) throw new Error(`a tabela dos nomes não tem ${geo}`);
    return lang === 'en' ? p.en : p.pt;
  };
  const valor = (geo) => String(serie.pontos.find((p) => p.geo === geo)?.valor ?? '').replace(/(?<=\d)[   ](?=\d)/g, ' ');
  const lista = (geos) => geos.map((g, i) => (i === 0 ? '' : i === geos.length - 1 ? palavras.lista.ultimo : palavras.lista.entre) + nome(g)).join('');
  const papeis = { baixo: c.baixo, alto: c.alto, aPar: c.aPar };
  const valores = { baixo: c.baixo[0], alto: c.alto[0], uniao: AGREGADO, portugal: 'PT' };
  const compoe = (partes) =>
    partes
      .map((p) => {
        if (typeof p === 'string') return p;
        if ('conta' in p) return String(c.conta);
        if ('periodo' in p) return dataDaCasa(c.periodo, lang);
        if ('valor' in p) return valor(valores[p.valor]);
        if ('paises' in p) return lista(papeis[p.paises]);
        if ('pais' in p) return nome(p.pais);
        if ('lugar' in p) return String(c.lugar);
        if ('aPar' in p) return c.aPar.length ? compoe(c.aPar.length === 1 ? palavras.aPar.um : palavras.aPar.varios) : '';
        throw new Error('um pedaço da frase que a célula não conhece');
      })
      .join('');
  return { texto: norm(compoe(palavras.frase)), conta: c };
}

/**
 * @param {import('node-html-parser').HTMLElement} root
 * @param {'pt'|'en'} lang
 * @param {string} rota
 * @param {{ series: Map<string, any>, paises: Map<string, any> }} ctx
 */
export function conferirFaixas(root, lang, rota, { series, paises }) {
  const erros = [];
  const contas = { faixas: 0, marcas: 0, frases: 0, empates: 0 };
  const erro = (celula, id, msg) => erros.push(`${celula} · ${rota} · ${id}: ${msg}`);

  for (const faixa of root.querySelectorAll('[data-faixa-ue]')) {
    if (!faixa.closest('[data-cartao-medida]')) erro('F19a', faixa.getAttribute('data-faixa-ue'), 'uma faixa da União fora de um cartão');
  }
  for (const cartao of root.querySelectorAll('[data-cartao-medida]')) {
    const id = cartao.getAttribute('data-cartao-medida') ?? '';
    const faixas = cartao.querySelectorAll('[data-faixa-ue]');
    const serie = serieDaLinhaDoPortao(series, id);
    const nacional = Boolean(cartao.querySelector('[data-cartao-leitura]'));
    /* F19a */
    if (!serie || !nacional) {
      if (faixas.length) erro('F19a', id, `o cartão tem ${faixas.length} faixa(s) da União e ${serie ? 'não é um cartão nacional' : 'a linha não tem série de países'}`);
      continue;
    }
    if (faixas.length !== 1) {
      erro('F19a', id, `a linha tem a série «${serie.id}» e o cartão tem ${faixas.length} faixa(s) da União; tem de ter uma`);
      continue;
    }
    const faixa = faixas[0];
    contas.faixas++;
    if (faixa.getAttribute('data-faixa-ue') !== serie.id) erro('F19a', id, `a faixa diz ser da série «${faixa.getAttribute('data-faixa-ue')}» e a linha é gémea de «${serie.id}»`);
    let c;
    try {
      c = contaDaFaixa(serie);
    } catch (e) {
      erro('F19b', id, `a série não se reconta: ${e.message}`);
      continue;
    }
    /* F19b, F19c · o desenho */
    const marcas = new Map();
    for (const m of faixa.querySelectorAll('[data-faixa-marca]')) {
      const [sid, geo] = String(m.getAttribute('data-faixa-marca')).split('#');
      if (sid !== serie.id) erro('F19b', id, `uma marca do desenho é da série «${sid}»`);
      if (marcas.has(geo)) erro('F19b', id, `a marca de ${geo} está duas vezes no desenho`);
      marcas.set(geo, m);
    }
    const esperadas = [...c.paises.map((p) => p.geo), AGREGADO];
    const faltam = esperadas.filter((g) => !marcas.has(g));
    const sobram = [...marcas.keys()].filter((g) => !esperadas.includes(g));
    if (faltam.length) erro('F19b', id, `falta no desenho a marca de ${faltam.join(', ')}`);
    if (sobram.length) erro('F19b', id, `o desenho tem marcas que não são de países da série: ${sobram.join(', ')}`);
    contas.marcas += marcas.size;
    for (const [geo, m] of marcas) {
      const classe = m.getAttribute('class') ?? '';
      const forma = geo === AGREGADO ? 'faixa-ue-uniao' : geo === 'PT' ? 'faixa-ue-portugal' : 'faixa-ue-pais';
      if (!classe.split(/\s+/).includes(forma)) erro('F19b', id, `a marca de ${geo} não tem a forma dela («${forma}»)`);
      const v = geo === AGREGADO ? c.uniao : c.paises.find((p) => p.geo === geo)?.n;
      if (v === undefined) continue;
      const esperado = posicaoNaFaixa(v, c.min, c.max);
      if (esquerdaDe(m) !== esperado) erro('F19c', id, `a marca de ${geo} está em ${esquerdaDe(m)} % e o valor dá ${esperado} %`);
    }
    for (const [papel, v, geo] of [['portugal', c.portugal, 'PT'], ['uniao', c.uniao, null]]) {
      const r = faixa.querySelector(`[data-faixa-rotulo="${papel}"]`);
      const esperado = posicaoNaFaixa(v, c.min, c.max);
      if (!r || esquerdaDe(r) !== esperado) erro('F19c', id, `o rótulo de «${papel}» não está na posição da sua marca (${esperado} %)`);
      if (geo && r && r.querySelector('[data-pais]')?.getAttribute('data-pais') !== geo) erro('F19c', id, `o rótulo de «${papel}» não nomeia ${geo}`);
    }
    /* F19d · as pontas */
    for (const papel of ['baixo', 'alto']) {
      const ponta = faixa.querySelector(`[data-faixa-ponta="${papel}"]`);
      const geos = c[papel];
      if (!ponta) {
        erro('F19d', id, `falta a ponta «${papel}»`);
        continue;
      }
      const nomeados = ponta.querySelectorAll('[data-pais]').map((e) => e.getAttribute('data-pais'));
      if (nomeados.join(',') !== geos.join(',')) erro('F19d', id, `a ponta «${papel}» nomeia ${nomeados.join(', ') || 'ninguém'} e o ${papel === 'baixo' ? 'mais baixo' : 'mais alto'} é ${geos.join(', ')}`);
      const valores = ponta.querySelectorAll('[data-ponto]').map((e) => e.getAttribute('data-ponto'));
      if (valores.join(',') !== `${serie.id}#${geos[0]}`) erro('F19d', id, `a ponta «${papel}» escreve o valor de ${valores.join(', ') || 'nenhum ponto'}`);
      const ponto = serie.pontos.find((p) => p.geo === geos[0]);
      const bandeira = ponta.querySelector('[data-ponto-bandeira]');
      if (Boolean(ponto?.bandeira) !== Boolean(bandeira)) erro('F19d', id, `a ponta «${papel}» ${ponto?.bandeira ? 'não mostra a marca da fonte que o ponto leva' : 'mostra uma marca que o ponto não leva'}`);
    }
    /* F19e · a frase */
    const frase = faixa.querySelector('[data-faixa-frase]');
    if (!frase) {
      erro('F19e', id, 'a faixa não tem a frase do lugar de Portugal');
    } else {
      contas.frases++;
      if (c.aPar.length) contas.empates++;
      let esperada;
      try {
        esperada = fraseEsperada(serie, lang, paises).texto;
      } catch (e) {
        erro('F19e', id, `a frase não se recompõe: ${e.message}`);
      }
      const rendida = norm(frase.text);
      if (esperada !== undefined && rendida !== esperada) {
        erro('F19e', id, `a frase diz «${rendida}» e a recomposição dá «${esperada}»`);
      }
      const pontos = frase.querySelectorAll('[data-ponto]').map((e) => e.getAttribute('data-ponto'));
      const pontosEsperados = [c.baixo[0], c.alto[0], AGREGADO, 'PT'].map((g) => `${serie.id}#${g}`);
      if (pontos.join(',') !== pontosEsperados.join(',')) erro('F19e', id, `as marcas dos valores da frase são ${pontos.join(', ')}; esperava-se ${pontosEsperados.join(', ')}`);
      const nomes = frase.querySelectorAll('[data-pais]').map((e) => e.getAttribute('data-pais'));
      const nomesEsperados = [...c.baixo, ...c.alto, 'PT', ...c.aPar];
      if (nomes.join(',') !== nomesEsperados.join(',')) erro('F19e', id, `os países da frase são ${nomes.join(', ')}; esperava-se ${nomesEsperados.join(', ')}`);
      for (const atributo of ['data-ponto-conta', 'data-ponto-lugar']) {
        const marcasDe = frase.querySelectorAll(`[${atributo}]`);
        if (marcasDe.length !== 1 || marcasDe[0].getAttribute(atributo) !== serie.id) erro('F19e', id, `a frase não tem uma e uma só marca «${atributo}» da série`);
      }
      const periodo = frase.querySelectorAll('[data-linha-de-serie]');
      if (periodo.length !== 1 || periodo[0].getAttribute('data-linha-de-serie') !== serie.id || periodo[0].getAttribute('data-de-campo') !== 'periodo') {
        erro('F19e', id, 'o período da frase não é o campo «periodo» da série');
      }
    }
    /* F19f · a porta */
    const porta = faixa.querySelector('.faixa-ue-porta a[href]');
    const destino = routePath('serie', lang, { slug: serie.id });
    if (!porta || porta.getAttribute('href') !== destino) erro('F19f', id, `a porta da faixa abre «${porta?.getAttribute('href') ?? 'nada'}» e o recibo da série é «${destino}»`);
  }
  return { erros, contas };
}

/**
 * AS PLANTAS DA CÉLULA, corridas sobre uma cópia da página em memória, a cada
 * corrida: cada uma tem de morder com a sua célula, e a página intacta tem de
 * passar. Uma planta que não pode falhar não conta; por isso cada uma escolhe o
 * nó que estraga e diz se o encontrou.
 *
 * @param {string} html a página construída, inteira
 */
export function plantasDaFaixa(html, lang, rota, ctx) {
  const resultados = [];
  const planta = (nome, celula, estraga) => {
    const copia = parse(html);
    const achou = estraga(copia);
    if (!achou) return void resultados.push({ nome, passou: false, porque: 'a planta não achou o nó que estraga' });
    const { erros } = conferirFaixas(copia, lang, rota, ctx);
    resultados.push({ nome, passou: erros.some((e) => e.startsWith(`${celula} ·`)), porque: erros[0] ?? 'nenhum erro' });
  };
  planta('uma posição trocada', 'F19c', (r) => {
    const m = r.querySelectorAll('[data-faixa-marca]');
    if (m.length < 2) return false;
    const a = m[0].getAttribute('style');
    m[0].setAttribute('style', m[1].getAttribute('style'));
    m[1].setAttribute('style', a);
    return a !== m[0].getAttribute('style');
  });
  planta('um país em falta no desenho', 'F19b', (r) => {
    const m = r.querySelector('[data-faixa-marca]:not(.faixa-ue-portugal):not(.faixa-ue-uniao)');
    if (!m) return false;
    m.remove();
    return true;
  });
  planta('a ponta mais alta a nomear outro país', 'F19d', (r) => {
    const n = r.querySelector('[data-faixa-ponta="alto"] [data-pais]');
    if (!n) return false;
    n.setAttribute('data-pais', n.getAttribute('data-pais') === 'MT' ? 'CY' : 'MT');
    return true;
  });
  planta('o empate tirado da frase', 'F19e', (r) => {
    const f = [...r.querySelectorAll('[data-faixa-frase]')].find((x) => x.querySelectorAll('[data-pais]').length > 3);
    if (!f) return false;
    f.set_content(f.innerHTML.replace(/, (a par de|level with) [\s\S]*\)\./, '.'));
    return true;
  });
  planta('um empate que os valores não têm', 'F19e', (r) => {
    const f = [...r.querySelectorAll('[data-faixa-frase]')].find((x) => x.querySelectorAll('[data-pais]').length === 3);
    if (!f) return false;
    f.set_content(f.innerHTML.replace(/\.\s*$/, lang === 'en' ? ', level with another country with the same value.' : ', a par de outro país com o mesmo valor.'));
    return true;
  });
  planta('a porta para outra série', 'F19f', (r) => {
    const a = r.querySelector('.faixa-ue-porta a[href]');
    if (!a) return false;
    const href = a.getAttribute('href');
    const outra = href.endsWith('/divida-publica-2025-paises') ? 'taxa-de-emprego-2025-paises' : 'divida-publica-2025-paises';
    a.setAttribute('href', href.replace(/[^/]+$/, outra));
    return true;
  });
  return resultados;
}
