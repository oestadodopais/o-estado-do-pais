/**
 * FC · A FAIXA DO CONCELHO, REFEITA DAS 308 LINHAS (bloco L2b, 01.10.2026).
 *
 * A célula do §3, ponto 5, do brief L2b, chamada pelo `check:navegacao`, que corre na cadeia da construção
 * (a única que a Vercel corre) e na do `verify`. Recompõe o que a faixa de cada cartão de concelho mostra a
 * partir das linhas, com as contas dos portões (`scripts/concelhos-do-portao.mjs`), e não pergunta nada ao
 * resolvedor (`src/lib/faixa-do-concelho.mjs`) nem ao componente:
 *
 *   FC0 · as páginas dos 308 concelhos estão construídas nas duas edições, e cada uma tem os cartões das
 *         medidas da tabela das ordens (`src/data/faixa-do-concelho.mjs`);
 *   FC1 · cada cartão de uma medida da tabela tem uma faixa, e uma só, que diz ser da sua medida e cuja
 *         porta é a marca única do cartão (`data-selo-em` igual à linha do cartão), e a linha do cartão é a
 *         que o ficheiro do motor dá àquele concelho;
 *   FC2 · as marcas: o caminho do desenho tem uma marca por concelho com valor, e mais nenhuma, cada uma na
 *         posição que o valor dá, com quatro casas;
 *   FC3 · a marca e o rótulo do concelho estão na posição do valor dele, e não existem quando ele não tem
 *         valor publicado;
 *   FC4 · a frase do lugar é, carácter a carácter, a recomposição das palavras declaradas com o nome, o
 *         valor, o lugar, a contagem, a ordem e os empates recontados; as marcas dela dizem o concelho e a
 *         medida certos;
 *   FC5 · a comparação com Portugal: a linha nacional que os portões acham para a linha do concelho (a
 *         mesma edição do documento, a mesma unidade e o mesmo período), ou a base do índice que a unidade
 *         da linha escreve, ou, sem uma nem outra, a frase que diz que não há comparação; a palavra do lado
 *         recontada dos dois valores, e o traço e o rótulo de Portugal na posição do valor dele;
 *   FC6 · o recibo da linha do concelho lista a linha de Portugal em «O enquadramento», que é a porta que a
 *         marca única do cartão paga (a K10);
 *   FC7 · o ordinal inglês: para os lugares de uma tabela escrita à mão (os que acabam em 1, 2, 3 e as
 *         exceções dos 11 a 13 em cada centena até 308), o sufixo que a regra dos portões escolhe entre as
 *         palavras declaradas é o da tabela.
 *
 * O que ela NÃO confere, porque outro portão já o faz: que o texto de cada `data-claim` é o valor da linha
 * e que o lugar, a contagem e os empates são os recontados (o portão de HTML, pelas mesmas contas), que o
 * nome de Portugal é o da tabela de autoridade (idem), e que a faixa é a sexta coisa só nestes cartões (a
 * K1 do `check:cartao`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

import { faixasDoPortao, linhaDePortugalDoPortao, valorDoPortao, baseDoPortao, contaDaMedidaDoPortao } from '../../scripts/concelhos-do-portao.mjs';
import { posicaoNaFaixa, sufixoOrdinalDoPortao } from '../../scripts/series-do-portao.mjs';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../../src/data/faixa-do-concelho.mjs';
import { t } from '../../src/i18n/strings.mjs';

const ROTA = { pt: (slug) => `municipios/${slug}/index.html`, en: (slug) => `en/municipalities/${slug}/index.html` };
const RECIBO = { pt: (id) => `livro-razao/${id}/index.html`, en: (id) => `en/ledger/${id}/index.html` };
/** Os espaços da casa entre algarismos (o fino, o rígido) contam como um espaço. */
const norm = (s) => String(s ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
const esquerdaDe = (el) => {
  const m = /(?:^|;)\s*left\s*:\s*(-?[\d.]+)%/.exec(el?.getAttribute('style') ?? '');
  return m ? Number(m[1]) : null;
};
/** As posições de um caminho «M<x> 0V10…», pela ordem em que estão escritas. */
const posicoesDoCaminho = (d) => [...String(d ?? '').matchAll(/M(-?[\d.]+) 0V10/g)].map((m) => Number(m[1]));

/**
 * OS ORDINAIS INGLESES DA TABELA, escritos à mão e um a um: os que acabam em 1, 2 e 3 e as exceções dos 11
 * a 13 em cada centena, até 308. Uma tabela calculada pela mesma regra confirmava-se a si própria.
 */
export const ORDINAIS_DA_TABELA = Object.freeze({
  1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 11: '11th', 12: '12th', 13: '13th', 21: '21st', 22: '22nd', 23: '23rd',
  101: '101st', 102: '102nd', 103: '103rd', 111: '111th', 112: '112th', 113: '113th', 121: '121st', 122: '122nd',
  201: '201st', 202: '202nd', 203: '203rd', 211: '211th', 212: '212th', 213: '213th', 301: '301st', 302: '302nd',
  303: '303rd', 308: '308th',
});

/**
 * As frases que a faixa de um cartão tem de dizer, recompostas aqui das palavras declaradas e das contas.
 *
 * @param {{ nome: string, valor: string|null, lugar: number|null, conta: number, aPar: number, ordem: string,
 *   comparacao: { tipo: 'linha', valor: string, lado: string } | { tipo: 'base', lado: string } | null }} c
 * @param {'pt'|'en'} lang
 */
export function frasesEsperadas(c, lang) {
  const F = t(lang).municipio.faixaDoConcelho;
  const aPar = c.aPar === 1 ? F.aParUm : c.aPar > 1 ? `${F.aParVariosA}${c.aPar}${F.aParVariosB}` : '';
  const lugar =
    c.lugar !== null
      ? `${c.nome} (${c.valor})${F.lugarA}${c.lugar}${sufixoOrdinalDoPortao(c.lugar, F.ordinal)}${F.lugarB}${c.conta}${F.lugarC}${F.ordem[c.ordem]}${aPar}${F.fim}`
      : `${c.nome}${F.semValorA}${c.conta}${F.semValorB}`;
  let comparacao = null;
  if (c.comparacao?.tipo === 'linha' && c.lugar !== null) comparacao = `${F.comparacaoA}${F[c.comparacao.lado]}${F.comparacaoLinhaA}${c.comparacao.valor}${F.comparacaoLinhaB}`;
  else if (c.comparacao?.tipo === 'base' && c.lugar !== null) comparacao = `${F.comparacaoA}${F[c.comparacao.lado]}${F.comparacaoBase}`;
  else if (!c.comparacao) comparacao = F.semComparacao;
  return { lugar: norm(lugar), comparacao: comparacao === null ? null : norm(comparacao) };
}

/**
 * A conferência de uma página de concelho.
 *
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ slug: string, nome: string, lang: 'pt'|'en', rota: string, faixas: ReturnType<typeof faixasDoPortao>,
 *   recibo?: (id: string) => import('node-html-parser').HTMLElement | null }} ctx
 */
export function conferirPagina(root, { slug, nome, lang, rota, faixas, recibo }) {
  const erros = [];
  const contas = { faixas: 0, marcas: 0, lugares: 0, comparacoes: { linha: 0, base: 0, nenhuma: 0 }, recibos: 0, semValor: 0 };
  const erro = (celula, chave, msg) => erros.push(`${celula} · ${rota} · ${chave}: ${msg}`);
  for (const faixa of root.querySelectorAll('[data-faixa-concelho]')) {
    if (!faixa.closest('[data-cartao-medida]')) erro('FC1', faixa.getAttribute('data-faixa-concelho'), 'uma faixa do concelho fora de um cartão');
  }
  for (const chave of Object.keys(FAIXA_DAS_MEDIDAS_DO_CONCELHO)) {
    const conta = faixas.contas.get(chave);
    const id = faixas.porMedida.get(chave)?.get(slug) ?? null;
    if (!conta || !id) {
      erro('FC0', chave, `a medida não tem linha para o concelho «${slug}» nas 308 linhas que os portões leem`);
      continue;
    }
    const cartoes = root.querySelectorAll(`[data-cartao-medida][data-medida-chave="${chave}"]`);
    if (cartoes.length !== 1) {
      erro('FC0', chave, `a página tem ${cartoes.length} cartão(ões) da medida; tem de ter um`);
      continue;
    }
    const cartao = cartoes[0];
    /* FC1 */
    if (cartao.getAttribute('data-cartao-medida') !== id) erro('FC1', chave, `o cartão rende «${cartao.getAttribute('data-cartao-medida')}» e a linha do concelho é «${id}»`);
    const tiras = cartao.querySelectorAll('[data-faixa-concelho]');
    if (tiras.length !== 1) {
      erro('FC1', chave, `o cartão tem ${tiras.length} faixa(s) do concelho; tem de ter uma`);
      continue;
    }
    const faixa = tiras[0];
    contas.faixas++;
    if (faixa.getAttribute('data-faixa-concelho') !== chave) erro('FC1', chave, `a faixa diz ser de «${faixa.getAttribute('data-faixa-concelho')}»`);
    if (faixa.getAttribute('data-selo-em') !== id) erro('FC1', chave, `a porta da faixa é «${faixa.getAttribute('data-selo-em') ?? 'nenhuma'}» e a marca do cartão abre «${id}»`);

    /* FC2 · as marcas, refeitas dos valores */
    const caminhos = faixa.querySelectorAll(`path[data-faixa-tiques]`);
    const esperadas = conta.todos.filter((c) => c.n !== null).map((c) => conta.posicao(c.n)).sort((a, b) => a - b);
    if (caminhos.length !== 1 || caminhos[0].getAttribute('data-faixa-tiques') !== chave) {
      erro('FC2', chave, 'a faixa não tem um e um só caminho das marcas da medida');
    } else {
      const vistas = posicoesDoCaminho(caminhos[0].getAttribute('d')).sort((a, b) => a - b);
      contas.marcas += vistas.length;
      if (vistas.length !== esperadas.length) erro('FC2', chave, `o desenho tem ${vistas.length} marca(s) e há ${esperadas.length} concelho(s) com valor`);
      else {
        const i = vistas.findIndex((x, k) => x !== esperadas[k]);
        if (i >= 0) erro('FC2', chave, `a marca ${i + 1} do mais baixo está em ${vistas[i]} % e o valor dá ${esperadas[i]} %`);
      }
    }

    /* FC3 · a marca e o rótulo do concelho */
    const este = conta.todos.find((c) => c.slug === slug);
    const temValor = este?.n !== null && este?.n !== undefined;
    const marca = faixa.querySelectorAll('[data-faixa-concelho-marca]');
    const rotulo = faixa.querySelector('[data-faixa-rotulo="concelho"]');
    if (temValor) {
      const p = conta.posicao(este.n);
      if (marca.length !== 1 || marca[0].getAttribute('data-faixa-concelho-marca') !== `${chave}#${slug}` || esquerdaDe(marca[0]) !== p) {
        erro('FC3', chave, `a marca do concelho não está, uma vez, na posição do valor (${p} %)`);
      }
      if (!rotulo || esquerdaDe(rotulo) !== p || norm(rotulo.querySelector('[data-lugar]')?.text) !== norm(nome)) erro('FC3', chave, `o rótulo do concelho não diz «${nome}» na posição do valor (${p} %)`);
    } else {
      contas.semValor++;
      if (marca.length || rotulo) erro('FC3', chave, 'o concelho não tem valor publicado e a faixa marca-o no desenho');
    }

    /* FC5 · com que se compara (antes da FC4, porque a frase do lugar não depende disto, e a comparação sim) */
    const declarada = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave].comparacao;
    let comparacao = null;
    let nPortugal = null;
    let idNacional = null;
    if (declarada && 'linha' in declarada) {
      idNacional = linhaDePortugalDoPortao(faixas.linhas, id, conta.ids);
      nPortugal = idNacional ? valorDoPortao(faixas.linhas.get(idNacional)) : null;
      if (idNacional && nPortugal !== null) comparacao = { tipo: 'linha', valor: norm(faixas.linhas.get(idNacional).value), lado: null };
    } else if (declarada && 'base' in declarada) {
      nPortugal = baseDoPortao(faixas.linhas.get(id));
      if (nPortugal !== null) comparacao = { tipo: 'base', lado: null };
    }
    if (comparacao && temValor) comparacao.lado = este.n > nPortugal ? 'acima' : este.n < nPortugal ? 'abaixo' : 'igual';

    /* FC4 · a frase do lugar */
    const esperada = frasesEsperadas(
      {
        nome,
        valor: temValor ? norm(faixas.linhas.get(id).value) : null,
        lugar: temValor ? conta.lugar(slug) : null,
        conta: conta.conta,
        aPar: temValor ? conta.aPar(slug) : 0,
        ordem: conta.ordem,
        comparacao,
      },
      lang,
    );
    const frase = faixa.querySelector('[data-faixa-concelho-frase]');
    if (!frase) erro('FC4', chave, 'a faixa não tem a frase do lugar');
    else {
      if (norm(frase.text) !== esperada.lugar) erro('FC4', chave, `a frase diz «${norm(frase.text)}» e a recomposição dá «${esperada.lugar}»`);
      if (temValor) {
        contas.lugares++;
        const ml = frase.querySelectorAll('[data-concelho-lugar]');
        if (ml.length !== 1 || ml[0].getAttribute('data-concelho-lugar') !== `${chave}#${slug}`) erro('FC4', chave, 'a frase não tem uma e uma só marca do lugar deste concelho e desta medida');
        if (frase.querySelector('[data-claim]')?.getAttribute('data-claim') !== id) erro('FC4', chave, `o valor da frase não é a linha do cartão («${id}»)`);
      }
      const mc = frase.querySelectorAll('[data-concelho-conta]');
      if (mc.length !== 1 || mc[0].getAttribute('data-concelho-conta') !== chave) erro('FC4', chave, 'a frase não tem uma e uma só marca da contagem da medida');
    }

    /* FC5 · a comparação rendida */
    const comparada = faixa.querySelectorAll('[data-faixa-comparacao]');
    const tracos = faixa.querySelectorAll('[data-faixa-portugal]');
    const tipo = comparacao ? comparacao.tipo : 'nenhuma';
    if (esperada.comparacao === null) {
      if (comparada.length) erro('FC5', chave, 'o concelho não tem valor e a faixa compara-o com Portugal');
    } else if (comparada.length !== 1 || comparada[0].getAttribute('data-faixa-comparacao') !== tipo) {
      erro('FC5', chave, `a comparação rendida é «${comparada.map((x) => x.getAttribute('data-faixa-comparacao')).join(', ') || 'nenhuma'}» e a que as linhas dão é «${tipo}»`);
    } else {
      contas.comparacoes[tipo]++;
      if (norm(comparada[0].text) !== esperada.comparacao) erro('FC5', chave, `a comparação diz «${norm(comparada[0].text)}» e a recomposição dá «${esperada.comparacao}»`);
      if (tipo === 'linha' && comparada[0].querySelector('[data-claim]')?.getAttribute('data-claim') !== idNacional) {
        erro('FC5', chave, `a comparação cita «${comparada[0].querySelector('[data-claim]')?.getAttribute('data-claim') ?? 'nenhuma linha'}» e a linha de Portugal do mesmo período é «${idNacional}»`);
      }
    }
    if (comparacao) {
      const p = conta.posicao(nPortugal);
      const rp = faixa.querySelector('[data-faixa-rotulo="portugal"]');
      if (tracos.length !== 1 || tracos[0].getAttribute('data-faixa-portugal') !== comparacao.tipo || esquerdaDe(tracos[0]) !== p) erro('FC5', chave, `o traço de Portugal não está, uma vez, na posição do valor dele (${p} %)`);
      if (!rp || esquerdaDe(rp) !== p || rp.querySelector('[data-pais]')?.getAttribute('data-pais') !== 'PT') erro('FC5', chave, `o rótulo de Portugal não está na posição do traço (${p} %)`);
    } else if (tracos.length || faixa.querySelector('[data-faixa-rotulo="portugal"]')) {
      erro('FC5', chave, 'não há com que comparar e o desenho marca Portugal');
    }

    /* FC6 · o recibo lista a linha de Portugal */
    if (comparacao?.tipo === 'linha' && recibo) {
      const r = recibo(id);
      const lista = r?.querySelector(`#enquadramento [data-enquadramento-portugal="${idNacional}"] [data-claim="${idNacional}"]`);
      if (!lista) erro('FC6', chave, `o recibo de «${id}» não lista a linha de Portugal «${idNacional}» em «O enquadramento»`);
      else contas.recibos++;
    }
  }
  return { erros, contas };
}

/** FC7 · o ordinal inglês, uma vez por corrida e sem página. */
export function conferirOrdinais(palavras = t('en').municipio.faixaDoConcelho.ordinal, regra = sufixoOrdinalDoPortao) {
  const erros = [];
  for (const [n, esperado] of Object.entries(ORDINAIS_DA_TABELA)) {
    let dito;
    try {
      dito = `${n}${regra(Number(n), palavras)}`;
    } catch (e) {
      dito = `(${e.message})`;
    }
    if (dito !== esperado) erros.push(`FC7 · o lugar ${n} diz-se «${dito}» na edição inglesa e o ordinal é «${esperado}»`);
  }
  return erros;
}

/**
 * A célula inteira, sobre o `dist/` construído.
 *
 * @param {string} dist
 * @param {{ faixas?: ReturnType<typeof faixasDoPortao>, trocar?: (root: any, lang: string, slug: string) => void,
 *   trocarRecibo?: (root: any, lang: string, id: string) => void, so?: string[] }} [opcoes]
 */
export function conferirFaixasDosConcelhos(dist, opcoes = {}) {
  const faixas = opcoes.faixas ?? faixasDoPortao();
  const erros = [];
  const contas = { paginas: 0, faixas: 0, marcas: 0, lugares: 0, sem_valor: 0, comparacoes: { linha: 0, base: 0, nenhuma: 0 }, recibos: 0, ordinais: Object.keys(ORDINAIS_DA_TABELA).length };
  const slugs = opcoes.so ?? faixas.concelhos.map((c) => c.slug);
  if (!opcoes.so && slugs.length !== 308) erros.push(`FC0 · o ficheiro do motor tem ${slugs.length} concelhos, e são 308`);
  for (const lang of /** @type {const} */ (['pt', 'en'])) {
    for (const slug of slugs) {
      const ficheiro = path.join(dist, ROTA[lang](slug));
      if (!fs.existsSync(ficheiro)) {
        erros.push(`FC0 · /${ROTA[lang](slug)}: a página do concelho não está construída`);
        continue;
      }
      const root = parse(fs.readFileSync(ficheiro, 'utf8'));
      opcoes.trocar?.(root, lang, slug);
      const nome = faixas.concelhos.find((c) => c.slug === slug)?.nome ?? slug;
      const recibo = (id) => {
        const f = path.join(dist, RECIBO[lang](id));
        if (!fs.existsSync(f)) return null;
        const html = fs.readFileSync(f, 'utf8');
        const i = html.indexOf('id="enquadramento"');
        if (i < 0) return parse('<div></div>');
        const inicio = html.lastIndexOf('<section', i);
        const fim = html.indexOf('</section>', i);
        const r = parse(html.slice(inicio, fim + '</section>'.length));
        opcoes.trocarRecibo?.(r, lang, id);
        return r;
      };
      const r = conferirPagina(root, { slug, nome, lang, rota: `/${ROTA[lang](slug).replace(/index\.html$/, '')}`, faixas, recibo });
      erros.push(...r.erros);
      contas.paginas++;
      contas.faixas += r.contas.faixas;
      contas.marcas += r.contas.marcas;
      contas.lugares += r.contas.lugares;
      contas.sem_valor += r.contas.semValor;
      contas.recibos += r.contas.recibos;
      for (const k of Object.keys(contas.comparacoes)) contas.comparacoes[k] += r.contas.comparacoes[k];
    }
  }
  erros.push(...conferirOrdinais());
  if (!opcoes.so && contas.faixas === 0) erros.push('FC0 · nenhuma faixa vista em página nenhuma: a célula não viu nada (regra 14 da casa)');
  return { erros, contas };
}

/**
 * AS PLANTAS DA CÉLULA. Cada uma estraga uma cópia em memória de uma página (ou das linhas, ou das
 * palavras) e exige a mordida da sua célula; a mesma página intacta tem de passar, e uma planta que não
 * achou o nó que estraga não conta como mordida.
 *
 * @param {string} dist
 */
export function plantasDasFaixasDosConcelhos(dist) {
  const faixas = faixasDoPortao();
  const resultados = [];
  /** Um concelho com valor no ganho, que se compara com Portugal, e um sem valor numa medida. */
  const comGanho = 'evora';
  const semValor = faixas.contas.get('pmp')?.todos.find((c) => c.n === null)?.slug ?? null;
  const comEmpate = faixas.contas.get('pmp')?.todos.find((c) => c.n !== null && faixas.contas.get('pmp').aPar(c.slug) > 1)?.slug ?? null;
  const controlo = conferirFaixasDosConcelhos(dist, { faixas, so: [comGanho, semValor, comEmpate].filter(Boolean) });
  const planta = (nome, celula, opcoes, so = [comGanho]) => {
    let achou = false;
    const o = { faixas, so, ...opcoes };
    if (opcoes.trocar) {
      const f = opcoes.trocar;
      o.trocar = (root, lang, slug) => { if (lang === 'pt' && f(root, slug)) achou = true; };
    }
    if (opcoes.trocarRecibo) {
      const f = opcoes.trocarRecibo;
      o.trocarRecibo = (root, lang, id) => { if (lang === 'pt' && f(root, id)) achou = true; };
    }
    if (opcoes.faixas) achou = true;
    const r = conferirFaixasDosConcelhos(dist, o);
    const queixa = r.erros.find((e) => e.startsWith(`${celula} ·`)) ?? null;
    resultados.push({ nome, celula, mordeu: achou && Boolean(queixa) && controlo.erros.length === 0, queixa: achou ? queixa ?? r.erros[0] ?? 'nenhum erro' : 'a planta não achou o nó que estraga' });
  };
  const doGanho = (root) => root.querySelector('[data-faixa-concelho="ganho"]');
  /* As três do brief. */
  planta('l2b-faixa-um-lugar-errado', 'FC4', {
    trocar: (root) => {
      const m = doGanho(root)?.querySelector('[data-concelho-lugar]');
      if (!m) return false;
      m.set_content(String(Number(m.text) + 1));
      return true;
    },
  });
  {
    /* Uma referência de outro período: a linha de Portugal passa a ser de 2023 nas linhas que a célula lê,
       e a página continua a compará-la; a célula tem de dizer que a linha do mesmo período não existe. */
    const linhas = new Map(faixas.linhas);
    const nacional = linhaDePortugalDoPortao(faixas.linhas, faixas.porMedida.get('ganho').get(comGanho), faixas.contas.get('ganho').ids);
    if (nacional) linhas.set(nacional, { ...faixas.linhas.get(nacional), reference_date: String(Number(faixas.linhas.get(nacional).reference_date) - 1) });
    const contas = new Map(faixas.contas);
    contas.set('ganho', contaDaMedidaDoPortao(linhas, faixas.porMedida.get('ganho'), 'ganho'));
    planta('l2b-faixa-uma-referencia-de-outro-periodo', 'FC5', { faixas: { ...faixas, linhas, contas } });
  }
  planta('l2b-faixa-uma-marca-a-menos', 'FC2', {
    trocar: (root) => {
      const p = doGanho(root)?.querySelector('path[data-faixa-tiques]');
      if (!p) return false;
      p.setAttribute('d', String(p.getAttribute('d')).replace(/^M[\d.]+ 0V10/, ''));
      return true;
    },
  });
  /* As outras. */
  planta('l2b-faixa-a-marca-do-concelho-fora-do-sitio', 'FC3', {
    trocar: (root) => {
      const m = doGanho(root)?.querySelector('[data-faixa-concelho-marca]');
      if (!m) return false;
      m.setAttribute('style', `left:${(esquerdaDe(m) + 7) % 100}%`);
      return true;
    },
  });
  planta('l2b-faixa-a-palavra-do-lado-trocada', 'FC5', {
    trocar: (root) => {
      const c = doGanho(root)?.querySelector('[data-faixa-comparacao] [data-voz]');
      if (!c) return false;
      const F = t('pt').municipio.faixaDoConcelho;
      c.set_content(c.text === F.abaixo ? F.acima : F.abaixo);
      return true;
    },
  });
  planta('l2b-faixa-o-traco-de-portugal-fora-do-sitio', 'FC5', {
    trocar: (root) => {
      const m = doGanho(root)?.querySelector('[data-faixa-portugal]');
      if (!m) return false;
      m.setAttribute('style', `left:${(esquerdaDe(m) + 9) % 100}%`);
      return true;
    },
  });
  planta('l2b-faixa-tirada-de-um-cartao', 'FC1', {
    trocar: (root) => {
      const f = doGanho(root);
      if (!f) return false;
      f.remove();
      return true;
    },
  });
  planta('l2b-faixa-a-ordem-trocada', 'FC4', {
    trocar: (root) => {
      const f = doGanho(root)?.querySelector('[data-faixa-concelho-frase]');
      const F = t('pt').municipio.faixaDoConcelho;
      if (!f || !f.innerHTML.includes(F.ordem['do-mais-alto'])) return false;
      f.set_content(f.innerHTML.replace(F.ordem['do-mais-alto'], F.ordem['do-mais-baixo']));
      return true;
    },
  });
  planta('l2b-faixa-a-contagem-trocada', 'FC4', {
    trocar: (root) => {
      const m = doGanho(root)?.querySelector('[data-concelho-conta]');
      if (!m) return false;
      m.set_content(String(Number(m.text) - 1));
      return true;
    },
  });
  planta('l2b-faixa-um-empate-inventado', 'FC4', {
    trocar: (root) => {
      const f = doGanho(root)?.querySelector('[data-faixa-concelho-frase]');
      const F = t('pt').municipio.faixaDoConcelho;
      if (!f) return false;
      f.set_content(f.innerHTML.replace(new RegExp(`${F.fim.replace('.', '\\.')}\\s*$`), `${F.aParUm}${F.fim}`));
      return true;
    },
  });
  planta('l2b-faixa-o-recibo-sem-portugal', 'FC6', {
    trocarRecibo: (root) => {
      const x = root.querySelector('[data-enquadramento-portugal]');
      if (!x) return false;
      x.remove();
      return true;
    },
  });
  if (semValor) {
    planta('l2b-faixa-um-lugar-a-quem-nao-tem-valor', 'FC3', {
      trocar: (root) => {
        const f = root.querySelector('[data-faixa-concelho="pmp"] .fc-eixo');
        if (!f) return false;
        f.insertAdjacentHTML('beforeend', `<span class="fc-marca fc-concelho" data-faixa-concelho-marca="pmp#${semValor}" style="left:50%"></span>`);
        return true;
      },
    }, [semValor]);
  } else resultados.push({ nome: 'l2b-faixa-um-lugar-a-quem-nao-tem-valor', celula: 'FC3', mordeu: false, queixa: 'não há concelho sem valor no prazo médio de pagamento' });
  if (comEmpate) {
    planta('l2b-faixa-o-empate-tirado-da-frase', 'FC4', {
      trocar: (root) => {
        const m = root.querySelector('[data-faixa-concelho="pmp"] [data-concelho-a-par]');
        if (!m) return false;
        m.set_content(String(Number(m.text) + 1));
        return true;
      },
    }, [comEmpate]);
  } else resultados.push({ nome: 'l2b-faixa-o-empate-tirado-da-frase', celula: 'FC4', mordeu: false, queixa: 'não há concelho com mais de um empate no prazo médio de pagamento' });
  /* FC7 · o ordinal inglês sem a exceção dos 11 a 13. */
  {
    const erros = conferirOrdinais(undefined, (n, s) => (n % 10 === 1 ? s.st : n % 10 === 2 ? s.nd : n % 10 === 3 ? s.rd : s.th));
    resultados.push({ nome: 'l2b-faixa-o-ordinal-sem-a-excecao-dos-11-a-13', celula: 'FC7', mordeu: erros.some((e) => e.startsWith('FC7 ·')) && conferirOrdinais().length === 0, queixa: erros[0] ?? 'nenhum erro' });
  }
  return { controlo, resultados };
}
