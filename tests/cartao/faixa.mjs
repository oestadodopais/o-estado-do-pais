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
 *          empate), cada um com o seu valor; quando um ponto leva marca da
 *          fonte, a ponta di-la pelas palavras declaradas dessa marca, entre
 *          parênteses a seguir ao valor desse país, e nunca pela letra crua (a
 *          passagem UE1b); num empate, todos os países da ponta, e não só o
 *          primeiro (a passagem UE1c, o achado 5 da leitura a frio); o texto da
 *          ponta é, carácter a carácter, cada país com o seu valor e a sua
 *          ressalva, com as palavras da lista entre eles;
 *   F19e · a frase é, carácter a carácter, a recomposição das palavras declaradas
 *          com os pontos, os nomes da tabela, a contagem, o lugar e o período, no
 *          ramo que os valores mandam (com ou sem empate); e as marcas dela dizem
 *          os pontos e os países certos, pela ordem;
 *   F19f · a porta abre o recibo da série, na edição da página.
 *
 * E, uma vez por corrida e sem página (`conferirPalavrasDaFaixa`, UE1b):
 *
 *   F19g · o ordinal inglês (o acerto F4): para cada lugar de 1 a 27, o número
 *          com o sufixo que a regra dos portões escolhe entre as palavras
 *          declaradas é o da tabela escrita à mão (`ORDINAIS_INGLESES`);
 *   F19h · as ressalvas: cada marca que um ponto de uma série leva tem palavras
 *          declaradas nas duas edições, e nenhuma é a própria letra.
 *
 * O que ela NÃO confere, porque outro portão já o faz: que o texto de cada
 * `data-ponto` é o valor do ponto e que o nome de cada `data-pais` é o da tabela
 * (o portão de HTML), e que a data do período é a da série (a F1).
 */
import { parse } from 'node-html-parser';

import {
  contaDaFaixa,
  posicaoNaFaixa,
  serieDaLinhaDoPortao,
  sufixoOrdinalDoPortao,
  ORDINAIS_INGLESES,
  AGREGADO,
} from '../../scripts/series-do-portao.mjs';
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
        if ('ordinal' in p) return sufixoOrdinalDoPortao(c.lugar, palavras.ordinal);
        if ('aPar' in p) return c.aPar.length ? compoe(c.aPar.length === 1 ? palavras.aPar.um : palavras.aPar.varios) : '';
        throw new Error('um pedaço da frase que a célula não conhece');
      })
      .join('');
  return { texto: norm(compoe(palavras.frase)), conta: c };
}

/**
 * F19d · UMA PONTA DA FAIXA, conferida país a país (a passagem UE1c).
 *
 * `geos` são os países do extremo, pela ordem da série (um só sem empate). Cada
 * um tem de estar nomeado, com o seu valor, e com a sua ressalva quando o seu
 * ponto leva marca da fonte, e sem ressalva quando não leva; nenhuma letra crua,
 * nenhuma ressalva de outro ponto; e o texto da ponta é a recomposição, com as
 * palavras da lista declaradas entre os países.
 *
 * @param {import('node-html-parser').HTMLElement} ponta
 * @param {{ papel: string, geos: string[], serie: any, lang: 'pt'|'en', paises: Map<string, any> }} ctx
 * @returns {{ erros: string[], ressalvas: number }}
 */
export function conferirPonta(ponta, { papel, geos, serie, lang, paises }) {
  const erros = [];
  let ressalvas = 0;
  const palavras = PALAVRAS_DA_FAIXA[lang];
  const nomeDe = (geo) => {
    const p = paises.get(geo);
    return p ? (lang === 'en' ? p.en : p.pt) : `(${geo} sem nome na tabela)`;
  };
  const extremo = papel === 'baixo' ? 'mais baixo' : 'mais alto';
  const nomeados = ponta.querySelectorAll('[data-pais]').map((e) => e.getAttribute('data-pais'));
  if (nomeados.join(',') !== geos.join(',')) erros.push(`a ponta «${papel}» nomeia ${nomeados.join(', ') || 'ninguém'} e o ${extremo} é ${geos.join(', ')}`);
  const valores = ponta.querySelectorAll('[data-ponto]').map((e) => e.getAttribute('data-ponto'));
  const valoresEsperados = geos.map((g) => `${serie.id}#${g}`);
  if (valores.join(',') !== valoresEsperados.join(',')) {
    erros.push(`a ponta «${papel}» escreve os valores de ${valores.join(', ') || 'nenhum ponto'}, e são os de ${valoresEsperados.join(', ')}`);
  }
  if (ponta.querySelector('[data-ponto-bandeira]')) erros.push(`a ponta «${papel}» mostra a letra crua da marca da fonte; a faixa di-la por palavras`);
  const todas = ponta.querySelectorAll('[data-faixa-ressalva]');
  const partes = [];
  geos.forEach((geo, i) => {
    const ponto = serie.pontos.find((p) => p.geo === geo);
    const marca = ponto?.bandeira ? String(ponto.bandeira) : null;
    const dita = marca ? palavras.ressalvas?.[marca] ?? null : null;
    const desta = todas.filter((r) => r.getAttribute('data-faixa-ressalva') === `${serie.id}#${geo}`);
    if (!marca) {
      if (desta.length) erros.push(`a ponta «${papel}» mostra uma ressalva para ${geo}, cujo ponto não leva marca da fonte`);
    } else if (desta.length !== 1) {
      erros.push(`a ponta «${papel}» tem ${desta.length} ressalva(s) para ${geo}, e o ponto de ${geo} leva a marca «${marca}»`);
    } else if (desta[0].getAttribute('data-bandeira') !== marca) {
      erros.push(`a ressalva de ${geo} na ponta «${papel}» diz ser da marca «${desta[0].getAttribute('data-bandeira')}», e o ponto leva «${marca}»`);
    } else if (!dita) {
      erros.push(`a marca «${marca}» do ponto de ${geo} não tem palavras declaradas (${lang})`);
    } else if (norm(desta[0].text) !== `(${dita})`) {
      erros.push(`a ressalva de ${geo} na ponta «${papel}» diz «${norm(desta[0].text)}» e as palavras declaradas da marca «${marca}» são «(${dita})»`);
    } else {
      ressalvas++;
    }
    const valor = String(ponto?.valor ?? '').replace(/(?<=\d)[ \u2009\u202f](?=\d)/g, ' ');
    const entre = i === 0 ? '' : i === geos.length - 1 ? palavras.lista.ultimo : palavras.lista.entre;
    partes.push(`${entre}${nomeDe(geo)} ${valor}${dita ? ` (${dita})` : ''}`);
  });
  const alheias = todas.filter((r) => !geos.some((g) => r.getAttribute('data-faixa-ressalva') === `${serie.id}#${g}`));
  if (alheias.length) erros.push(`a ponta «${papel}» tem ressalvas de pontos que não são dela: ${alheias.map((r) => r.getAttribute('data-faixa-ressalva')).join(', ')}`);
  const textoEsperado = norm(partes.join(''));
  if (norm(ponta.text) !== textoEsperado) erros.push(`a ponta «${papel}» diz «${norm(ponta.text)}» e a recomposição dá «${textoEsperado}»`);
  return { erros, ressalvas };
}

/**
 * AS PLANTAS DOS EMPATES (a passagem UE1c, o achado 5). Nenhuma das dez séries
 * tem hoje um extremo empatado, e por isso as plantas fazem um em memória: numa
 * cópia de uma série, um segundo país passa a ter o valor do mais alto, e as
 * marcas da fonte ficam só num dos dois. A ponta escreve-se aqui, em memória,
 * de duas maneiras: a certa, que a F19d tem de deixar passar (o controlo), e a
 * estragada, que tem de morder com a queixa do país certo. Uma planta só passa
 * se as duas coisas acontecerem.
 *
 * @param {Map<string, any>} series
 * @param {Map<string, any>} paises
 * @param {'pt'|'en'} lang
 */
export function plantasDosEmpates(series, paises, lang) {
  const resultados = [];
  const palavras = PALAVRAS_DA_FAIXA[lang];
  const base = [...series.values()].find((s) => {
    try {
      return contaDaFaixa(s).alto.length === 1;
    } catch {
      return false;
    }
  });
  if (!base) return [{ nome: 'os empates', passou: false, porque: 'não há série onde fazer um empate' }];
  /** A série com o mais alto empatado com o país seguinte, e as marcas dadas. */
  const comEmpate = (marcas) => {
    const s = JSON.parse(JSON.stringify(base));
    const c = contaDaFaixa(s);
    const topo = c.alto[0];
    const outro = s.pontos.find((p) => p.geo !== topo && p.geo !== 'PT' && p.geo !== AGREGADO);
    outro.valor = s.pontos.find((p) => p.geo === topo).valor;
    const geos = contaDaFaixa(s).alto;
    geos.forEach((g, i) => { s.pontos.find((p) => p.geo === g).bandeira = marcas[i] ?? null; });
    return { s, geos };
  };
  const nome = (g) => {
    const p = paises.get(g);
    return lang === 'en' ? p.en : p.pt;
  };
  /** A ponta como o componente a escreve: cada país com o seu valor e a sua ressalva. */
  const certa = (s, geos, { ressalvaEm = null } = {}) =>
    geos
      .map((g, i) => {
        const ponto = s.pontos.find((p) => p.geo === g);
        const marca = ponto.bandeira;
        const com = ressalvaEm ? ressalvaEm.includes(g) : Boolean(marca);
        const m = marca ?? 'p';
        const entre = i === 0 ? '' : i === geos.length - 1 ? palavras.lista.ultimo : palavras.lista.entre;
        const r = com ? `<span class="faixa-ue-ressalva" data-faixa-ressalva="${s.id}#${g}" data-bandeira="${m}"> (${palavras.ressalvas[m]})</span>` : '';
        return `${entre}<span class="nome-do-pais" data-pais="${g}">${nome(g)}</span> <span class="ponto-da-serie faixa-ue-valor" data-ponto="${s.id}#${g}">${ponto.valor}</span>${r}`;
      })
      .join('');
  /** A ponta como o componente do UE1b a escrevia: os nomes, e o valor e a ressalva do primeiro. */
  const antiga = (s, geos) => {
    const primeiro = s.pontos.find((p) => p.geo === geos[0]);
    const r = primeiro.bandeira ? `<span class="faixa-ue-ressalva" data-faixa-ressalva="${s.id}#${geos[0]}" data-bandeira="${primeiro.bandeira}"> (${palavras.ressalvas[primeiro.bandeira]})</span>` : '';
    return `${geos.map((g) => `<span class="nome-do-pais" data-pais="${g}">${nome(g)}</span>`).join(', ')} <span class="ponto-da-serie faixa-ue-valor" data-ponto="${s.id}#${geos[0]}">${primeiro.valor}</span>${r}`;
  };
  const ponta = (html) => parse(`<span class="faixa-ue-ponta faixa-ue-ponta-alto" data-faixa-ponta="alto">${html}</span>`).querySelector('[data-faixa-ponta]');
  const planta = (nome, s, geos, estragada, morde) => {
    const controlo = conferirPonta(ponta(certa(s, geos)), { papel: 'alto', geos, serie: s, lang, paises });
    const r = conferirPonta(ponta(estragada), { papel: 'alto', geos, serie: s, lang, paises });
    const mordeu = r.erros.some(morde);
    resultados.push({
      nome, passou: controlo.erros.length === 0 && mordeu,
      porque: controlo.erros.length ? `o controlo não passou: ${controlo.erros[0]}` : (r.erros[0] ?? 'nenhum erro'),
    });
  };
  {
    const { s, geos } = comEmpate([null, 'p']);
    planta('a marca só no segundo país empatado, e a ponta sem ela', s, geos, antiga(s, geos), (e) => e.includes(`0 ressalva(s) para ${geos[1]}`));
  }
  {
    const { s, geos } = comEmpate(['p', null]);
    planta('a marca só no primeiro país empatado, e a ponta a pô-la nos dois', s, geos, certa(s, geos, { ressalvaEm: geos }), (e) => e.includes(`uma ressalva para ${geos[1]}, cujo ponto não leva marca`));
  }
  {
    const { s, geos } = comEmpate([null, null]);
    planta('um empate com o valor só do primeiro país', s, geos, antiga(s, geos), (e) => e.includes('escreve os valores de'));
  }
  return resultados;
}

/**
 * @param {import('node-html-parser').HTMLElement} root
 * @param {'pt'|'en'} lang
 * @param {string} rota
 * @param {{ series: Map<string, any>, paises: Map<string, any> }} ctx
 */
export function conferirFaixas(root, lang, rota, { series, paises }) {
  const erros = [];
  const contas = { faixas: 0, marcas: 0, frases: 0, empates: 0, ressalvas: 0 };
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
    /* F19d · as pontas: todos os países de cada ponta, cada um com o seu valor e
       a sua ressalva (UE1c), pela função que as plantas dos empates também chamam. */
    for (const papel of ['baixo', 'alto']) {
      const ponta = faixa.querySelector(`[data-faixa-ponta="${papel}"]`);
      if (!ponta) {
        erro('F19d', id, `falta a ponta «${papel}»`);
        continue;
      }
      const r = conferirPonta(ponta, { papel, geos: c[papel], serie, lang, paises });
      for (const m of r.erros) erro('F19d', id, m);
      contas.ressalvas += r.ressalvas;
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
 * F19g · F19h · AS PALAVRAS DA FAIXA, conferidas uma vez por corrida e sem
 * página (a passagem UE1b, 29.09.2026).
 *
 * @param {Map<string, any>} series as séries, pelo leitor dos portões
 * @param {typeof PALAVRAS_DA_FAIXA} [palavras] as palavras declaradas (as plantas passam uma cópia estragada)
 * @param {typeof sufixoOrdinalDoPortao} [regra] a regra do ordinal (uma planta passa uma regra estragada)
 */
export function conferirPalavrasDaFaixa(series, palavras = PALAVRAS_DA_FAIXA, regra = sufixoOrdinalDoPortao) {
  const erros = [];
  const contas = { ordinais: 0, marcas: 0 };
  ORDINAIS_INGLESES.forEach((esperado, i) => {
    const n = i + 1;
    let dito;
    try {
      dito = `${n}${regra(n, palavras.en?.ordinal)}`;
    } catch (e) {
      dito = `(${e.message})`;
    }
    contas.ordinais++;
    if (dito !== esperado) erros.push(`F19g · o lugar ${n} diz-se «${dito}» na edição inglesa e o ordinal é «${esperado}»`);
  });
  const marcas = new Set();
  for (const serie of series.values()) for (const p of serie.pontos ?? []) if (p.bandeira) marcas.add(String(p.bandeira));
  for (const marca of [...marcas].sort()) {
    for (const lang of ['pt', 'en']) {
      contas.marcas++;
      const dito = palavras[lang]?.ressalvas?.[marca];
      if (!dito || !String(dito).trim()) erros.push(`F19h · a marca «${marca}», que um ponto de uma série leva, não tem palavras declaradas na edição «${lang}»`);
      else if (String(dito).trim() === marca) erros.push(`F19h · as palavras declaradas da marca «${marca}» na edição «${lang}» são a própria letra`);
    }
  }
  return { erros, contas };
}

/**
 * AS PLANTAS DAS PALAVRAS (F19g, F19h): uma de cada sufixo do ordinal, a regra
 * sem a exceção dos 11 a 13, e três das ressalvas. Cada uma tem de morder com a
 * sua célula, e as palavras intactas têm de passar.
 *
 * @param {Map<string, any>} series
 */
export function plantasDasPalavrasDaFaixa(series) {
  const resultados = [];
  const copia = () => JSON.parse(JSON.stringify(PALAVRAS_DA_FAIXA));
  const planta = (nome, celula, palavras, regra = sufixoOrdinalDoPortao, seriesDaPlanta = series) => {
    const { erros } = conferirPalavrasDaFaixa(seriesDaPlanta, palavras, regra);
    resultados.push({ nome, passou: erros.some((e) => e.startsWith(`${celula} ·`)), porque: erros[0] ?? 'nenhum erro' });
  };
  for (const [sufixo, outro] of [['st', 'th'], ['nd', 'th'], ['rd', 'th'], ['th', 'st']]) {
    const p = copia();
    p.en.ordinal[sufixo] = outro;
    planta(`o sufixo «${sufixo}» declarado como «${outro}»`, 'F19g', p);
  }
  planta('a regra do ordinal sem a exceção dos 11 a 13', 'F19g', copia(), (n, s) =>
    n % 10 === 1 ? s.st : n % 10 === 2 ? s.nd : n % 10 === 3 ? s.rd : s.th,
  );
  const semD = copia();
  delete semD.en.ressalvas.d;
  planta('a marca «d» sem palavras na edição inglesa', 'F19h', semD);
  const letra = copia();
  letra.pt.ressalvas.p = 'p';
  planta('as palavras de «p» trocadas pela própria letra', 'F19h', letra);
  const seriesComZ = new Map([...series].map(([k, v]) => [k, JSON.parse(JSON.stringify(v))]));
  const primeira = [...seriesComZ.values()][0];
  if (primeira?.pontos?.length) {
    primeira.pontos[0].bandeira = 'z';
    planta('um ponto com uma marca que não está declarada', 'F19h', copia(), sufixoOrdinalDoPortao, seriesComZ);
  } else {
    resultados.push({ nome: 'um ponto com uma marca que não está declarada', passou: false, porque: 'não há série onde plantar' });
  }
  return resultados;
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
  /* UE1b: o ordinal inglês e as ressalvas das pontas. As do ordinal só existem
     na edição inglesa, e procuram os lugares que as dez séries rendem hoje
     (o 2.º dos preços da habitação e o 12.º da taxa de emprego). */
  if (lang === 'en') {
    const trocaSufixo = (r, lugar, de, para) => {
      const f = [...r.querySelectorAll('[data-faixa-frase]')].find((x) => x.querySelector('[data-ponto-lugar]')?.text.trim() === String(lugar));
      if (!f) return false;
      const antes = f.innerHTML;
      f.set_content(antes.replace(new RegExp(`(data-ponto-lugar="[^"]+">${lugar}</span>)${de}`), `$1${para}`));
      return f.innerHTML !== antes;
    };
    planta('o sufixo de «2nd» trocado por «th»', 'F19e', (r) => trocaSufixo(r, 2, 'nd', 'th'));
    planta('o «12th» pela regra sem a exceção dos 11 a 13 («12nd»)', 'F19e', (r) => trocaSufixo(r, 12, 'th', 'nd'));
  }
  planta('a ressalva de uma ponta trocada pela letra crua', 'F19d', (r) => {
    const x = r.querySelector('[data-faixa-ressalva]');
    if (!x) return false;
    x.replaceWith(`<span class="faixa-ue-bandeira" data-ponto-bandeira="${x.getAttribute('data-faixa-ressalva')}">${x.getAttribute('data-bandeira')}</span>`);
    return true;
  });
  planta('a ressalva de uma ponta com as palavras de outra marca', 'F19d', (r) => {
    const x = r.querySelector('[data-faixa-ressalva]');
    if (!x) return false;
    const marca = x.getAttribute('data-bandeira');
    const outra = Object.keys(PALAVRAS_DA_FAIXA[lang].ressalvas).find((k) => k !== marca);
    x.set_content(` (${PALAVRAS_DA_FAIXA[lang].ressalvas[outra]})`);
    return true;
  });
  planta('a ressalva tirada de uma ponta com marca', 'F19d', (r) => {
    const x = r.querySelector('[data-faixa-ressalva]');
    if (!x) return false;
    x.remove();
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
