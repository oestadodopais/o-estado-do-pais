/**
 * F20 · A SECÇÃO DOS PAÍSES DA PÁGINA DA UNIÃO, REFEITA DOS PONTOS (bloco UE2, 02.10.2026).
 *
 * A página da União abre, depois da manchete, com «Os 27 países»: uma faixa à largura inteira por série de países do
 * livro-razão, empilhadas, cada uma com o desenho dos 27, a frase do lugar de Portugal, as etiquetas do toque e a
 * lista dobrada «Os 27 por ordem». Esta célula reconta tudo o que a secção mostra a partir das séries, pelo leitor
 * próprio dos portões (`scripts/series-do-portao.mjs`), e não pergunta nada ao modelo das páginas
 * (`src/lib/faixa-da-uniao.mjs`). Chama-a a F20 do `check:formas`, que corre na cadeia da construção e na do `verify`.
 *
 *   F20a · a secção está uma vez em cada edição da página da União e em nenhuma outra página, com uma faixa por série
 *          de países, e por esta ordem: a dos dois quadros (como `FIGURAS` os declara), e as medidas com série de fora
 *          deles no lugar que ESTA célula tem escrito (`FORA_DOS_QUADROS_DO_PORTAO`, com a razão), que a tabela da
 *          vista (`MEDIDAS_FORA_DOS_QUADROS`) tem de bater: uma tabela trocada só de um lado fecha a construção;
 *   F20b a F20f · cada faixa, peça a peça, pela MESMA função que reconta a faixa do cartão
 *          (`conferirPecasDaFaixa()`, de `tests/cartao/faixa.mjs`): as marcas e as posições, os rótulos, as pontas,
 *          a frase e a porta do recibo da série;
 *   F20g · o cabeçalho de cada faixa: o nome é o de um cartão da linha portuguesa da série (`data-de-linha`), e a
 *          unidade e o período são os campos da série (o texto deles confere-o o portão de HTML e a F1);
 *   F20h · as etiquetas do toque: uma por marca e mais nenhuma, todas escondidas no documento servido (`hidden`),
 *          cada uma com o grupo dos pontos que têm o valor da sua marca (quase sempre um país só: marcas com o mesmo
 *          valor estão no mesmo sítio, e o toque não as separa), pela ordem da série, cada ponto com o nome do país
 *          da tabela de autoridade (ou as palavras da União), o seu valor e a sua ressalva pelas palavras declaradas,
 *          com as palavras da lista entre eles, e nada mais;
 *   F20i · a lista dobrada: um `<details>` fechado, com o resumo «Os {conta} por ordem…» nas palavras declaradas e a
 *          contagem dos países da série; e os 27 países e a média da União, cada um uma vez, do valor mais alto para
 *          o mais baixo (os iguais pela ordem da série), cada um com o nome da tabela, o valor do ponto e a ressalva
 *          do ponto, Portugal e a União marcados;
 *   F20j · a ressalva da Comissão na faixa das medidas que a pedem (a §1.140: a União aparece, a ressalva aparece),
 *          uma vez, com o texto da fonte única, e em nenhuma outra faixa.
 *
 * O QUE ELA NÃO CONFERE, porque outro portão já o faz: o texto de cada `data-ponto`, de cada `data-pais`, da
 * unidade e da contagem (o portão de HTML), a data do período (a F1), o nome da medida contra o ficheiro que o
 * declara (a célula 9 do `check:voz`). Os nomes e os valores da lista e das etiquetas confere-os OUTRA VEZ aqui, de
 * propósito: as plantas do brief (um nome fora da tabela, um valor diferente do ponto) têm de morder nesta célula.
 */
import { parse } from 'node-html-parser';

import { contaDaFaixa, AGREGADO } from '../../scripts/series-do-portao.mjs';
import { conferirPecasDaFaixa } from '../cartao/faixa.mjs';
import { PALAVRAS_DA_FAIXA, MEDIDAS_FORA_DOS_QUADROS } from '../../src/data/faixa-da-uniao.mjs';
import { RESSALVAS_DA_UNIAO } from '../../src/data/ressalvas-da-uniao.mjs';
import { FIGURAS } from '../../src/data/figuras.mjs';
import { t } from '../../src/i18n/strings.mjs';

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/**
 * AS MEDIDAS COM SÉRIE DE FORA DOS DOIS QUADROS, E O SEU LUGAR, ESCRITAS AQUI DO LADO DOS PORTÕES: a medida dos
 * quadros a seguir à qual a faixa entra, ou `null` para o fim. A razão de cada uma está na tabela da vista, e uma
 * diferença entre as duas tabelas é a F20a a morder.
 */
export const FORA_DOS_QUADROS_DO_PORTAO = Object.freeze([
  ['sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', 'sobrecarga-do-custo-da-habitacao-2025'],
  ['ihpc-variacao-homologa', null],
]);

/**
 * AS MEDIDAS CUJA COMPARAÇÃO COM A UNIÃO PEDE A RESSALVA, escritas aqui e não lidas da declaração (a regra da K14):
 * tirar ou pôr uma é uma decisão escrita, e é por isso que a decisão vai ao lado.
 */
export const RESSALVA_NA_SECCAO = new Map([
  ['sobrecarga-do-custo-da-habitacao-2025', '§1.140: onde a União aparece, a ressalva da Comissão aparece'],
]);

/** A ordem das faixas que a secção tem de ter, pela regra desta célula. @param {Map<string, any>} series */
export function ordemEsperada(series) {
  const quadros = FIGURAS.map((f) => f.claim);
  const doPais = [...series.values()].filter((s) => s.eixo === 'pais');
  const linhaDe = (s) => String(s.linha_de_portugal);
  const ordem = doPais.map(linhaDe).filter((l) => quadros.includes(l)).sort((a, b) => quadros.indexOf(a) - quadros.indexOf(b));
  const noFim = [];
  const seguidas = new Map();
  for (const [linha, depoisDe] of FORA_DOS_QUADROS_DO_PORTAO) {
    if (!doPais.some((s) => linhaDe(s) === linha)) continue;
    if (depoisDe === null) {
      noFim.push(linha);
      continue;
    }
    const i = ordem.indexOf(depoisDe);
    const ja = seguidas.get(depoisDe) ?? 0;
    ordem.splice(i + 1 + ja, 0, linha);
    seguidas.set(depoisDe, ja + 1);
  }
  ordem.push(...noFim);
  const semLugar = doPais.map(linhaDe).filter((l) => !ordem.includes(l));
  return { ordem: ordem.map((l) => doPais.find((s) => linhaDe(s) === l).id), semLugar };
}

/** A tabela da vista contra a desta célula (F20a). @returns {string[]} */
export function conferirTabelaDaSeccao(tabela = MEDIDAS_FORA_DOS_QUADROS) {
  const daVista = Object.entries(tabela).map(([l, r]) => `${l}→${r.depoisDe}`);
  const doPortao = FORA_DOS_QUADROS_DO_PORTAO.map(([l, d]) => `${l}→${d}`);
  return daVista.join(',') === doPortao.join(',')
    ? []
    : [`F20a · a tabela da vista põe as medidas de fora dos quadros em ${daVista.join(', ')}, e a dos portões em ${doPortao.join(', ')}`];
}

/** Os pontos da série pela ordem da lista: do valor mais alto para o mais baixo, os iguais pela ordem da série. */
export function ordemDosPontos(serie) {
  const c = contaDaFaixa(serie);
  const naSerie = [...c.paises.map((p) => ({ geo: p.geo, n: p.n })), { geo: AGREGADO, n: c.uniao }];
  return naSerie.map((p, i) => ({ ...p, i })).sort((a, b) => b.n - a.n || a.i - b.i).map((p) => p.geo);
}

/**
 * OS PONTOS DITOS NUMA ETIQUETA OU NUM ITEM DA LISTA: para cada ponto do grupo, pela ordem dada, o nome (da tabela, ou
 * as palavras da União), o valor do ponto e a ressalva do ponto, com as palavras da lista entre eles, e nada mais. Um
 * item da lista diz um ponto; uma etiqueta do toque diz o grupo dos pontos com o valor da sua marca. Devolve o que está
 * mal, ou `[]`.
 */
function conferirPontosDitos(el, { serie, geos, lang, paises, onde }) {
  const erros = [];
  const palavras = PALAVRAS_DA_FAIXA[lang];
  const partes = [];
  const nomeados = el.querySelectorAll('[data-pais]');
  const paisesDoGrupo = geos.filter((g) => g !== AGREGADO);
  if (nomeados.map((x) => x.getAttribute('data-pais')).join(',') !== paisesDoGrupo.join(',')) {
    erros.push(`${onde}: os nomes são de ${nomeados.map((x) => x.getAttribute('data-pais')).join(', ') || 'ninguém'}, e são de ${paisesDoGrupo.join(', ') || 'ninguém'}`);
  }
  const valores = el.querySelectorAll('[data-ponto]');
  if (valores.map((x) => x.getAttribute('data-ponto')).join(',') !== geos.map((g) => `${serie.id}#${g}`).join(',')) {
    erros.push(`${onde}: os valores são dos pontos ${valores.map((x) => x.getAttribute('data-ponto')).join(', ') || 'nenhum'}, e são de ${geos.join(', ')}`);
  }
  const uniao = el.querySelectorAll('[data-voz]');
  if (uniao.length !== (geos.includes(AGREGADO) ? 1 : 0) || (uniao.length && norm(uniao[0].text) !== palavras.uniao)) {
    erros.push(`${onde}: a média da União ${geos.includes(AGREGADO) ? 'não se diz pelas palavras declaradas' : 'é dita onde não está'} («${palavras.uniao}»)`);
  }
  const ditas = el.querySelectorAll('[data-faixa-ressalva]');
  geos.forEach((geo, i) => {
    const ponto = serie.pontos.find((p) => p.geo === geo);
    if (!ponto) return void erros.push(`${onde}: a série não tem o ponto ${geo}`);
    let nome;
    if (geo === AGREGADO) nome = palavras.uniao;
    else {
      const p = paises.get(geo);
      nome = p ? (lang === 'en' ? p.en : p.pt) : null;
      const n = nomeados.find((x) => x.getAttribute('data-pais') === geo);
      if (n && (!nome || norm(n.text) !== nome)) erros.push(`${onde}: o nome de ${geo} diz «${norm(n.text)}» e a tabela de autoridade diz «${nome}»`);
    }
    const valor = norm(String(ponto.valor));
    const v = valores.find((x) => x.getAttribute('data-ponto') === `${serie.id}#${geo}`);
    if (v && norm(v.text) !== valor) erros.push(`${onde}: o valor de ${geo} diz «${norm(v.text)}» e o ponto diz «${valor}»`);
    const marca = ponto.bandeira ? String(ponto.bandeira) : null;
    const dita = marca ? palavras.ressalvas?.[marca] ?? null : null;
    const desta = ditas.filter((r) => r.getAttribute('data-faixa-ressalva') === `${serie.id}#${geo}`);
    if (!marca && desta.length) erros.push(`${onde}: há uma ressalva para ${geo}, cujo ponto não leva marca da fonte`);
    if (marca) {
      if (desta.length !== 1 || desta[0].getAttribute('data-bandeira') !== marca) erros.push(`${onde}: o ponto de ${geo} leva a marca «${marca}» e a ressalva dela não está dita`);
      else if (norm(desta[0].text) !== `(${dita})`) erros.push(`${onde}: a ressalva de ${geo} diz «${norm(desta[0].text)}» e as palavras da marca «${marca}» são «(${dita})»`);
    }
    const entre = i === 0 ? '' : i === geos.length - 1 ? palavras.lista.ultimo : palavras.lista.entre;
    partes.push(`${entre}${nome ?? ''} ${valor}${dita ? ` (${dita})` : ''}`);
  });
  const alheias = ditas.filter((r) => !geos.some((g) => r.getAttribute('data-faixa-ressalva') === `${serie.id}#${g}`));
  if (alheias.length) erros.push(`${onde}: tem ressalvas de pontos que não são dela: ${alheias.map((r) => r.getAttribute('data-faixa-ressalva')).join(', ')}`);
  const esperado = norm(partes.join(''));
  if (norm(el.text) !== esperado) erros.push(`${onde}: diz «${norm(el.text)}» e a recomposição dá «${esperado}»`);
  return erros;
}

/** Os pontos da série com o valor de um ponto, pela ordem da série (os países e, no fim, a União). */
export function grupoDoValor(serie, geo) {
  const c = contaDaFaixa(serie);
  const naSerie = [...c.paises.map((p) => ({ geo: p.geo, n: p.n })), { geo: AGREGADO, n: c.uniao }];
  const n = naSerie.find((p) => p.geo === geo)?.n;
  return naSerie.filter((p) => p.n === n).map((p) => p.geo);
}

/**
 * @param {import('node-html-parser').HTMLElement} root a página da União
 * @param {'pt'|'en'} lang
 * @param {string} rota
 * @param {{ series: Map<string, any>, paises: Map<string, any> }} ctx
 */
export function conferirSeccaoDosPaises(root, lang, rota, { series, paises }) {
  const erros = [];
  const contas = { seccoes: 0, faixas: 0, marcas: 0, frases: 0, etiquetas: 0, listas: 0, itens: 0, ressalvas_da_uniao: 0, ressalvas_dos_pontos: 0 };
  const erro = (celula, id, msg) => erros.push(`${celula} · ${rota} · ${id}: ${msg}`);
  const s = t(lang);

  /* F20a · a secção e a ordem */
  const seccoes = root.querySelectorAll('[data-paises]');
  if (seccoes.length !== 1) {
    erro('F20a', 'secção', `a página tem ${seccoes.length} secção(ões) dos países, e tem uma`);
    if (!seccoes.length) return { erros, contas };
  }
  contas.seccoes = 1;
  const seccao = seccoes[0];
  for (const e of conferirTabelaDaSeccao()) erros.push(`${e} (${rota})`);
  const { ordem, semLugar } = ordemEsperada(series);
  if (semLugar.length) erro('F20a', 'ordem', `as séries das linhas ${semLugar.join(', ')} não são de medidas dos quadros e a regra desta célula não lhes dá lugar`);
  const faixas = seccao.querySelectorAll('[data-faixa-paises]');
  const vistas = faixas.map((f) => f.getAttribute('data-faixa-paises'));
  if (vistas.join(',') !== ordem.join(',')) erro('F20a', 'ordem', `as faixas são ${vistas.join(', ')}; pela regra, são ${ordem.join(', ')}`);
  if (root.querySelectorAll('[data-faixa-paises]').length !== faixas.length) erro('F20a', 'secção', 'há faixas dos países fora da secção');

  for (const faixa of faixas) {
    const sid = faixa.getAttribute('data-faixa-paises') ?? '';
    const serie = series.get(sid);
    if (!serie) {
      erro('F20a', sid, 'a faixa diz ser de uma série que não existe');
      continue;
    }
    contas.faixas++;
    /* F20b a F20f · as peças, pela função da faixa do cartão */
    const r = conferirPecasDaFaixa(faixa, { serie, lang, paises, id: sid, erro, celula: 'F20' });
    contas.marcas += r.marcas;
    contas.frases += r.frases;
    contas.ressalvas_dos_pontos += r.ressalvas;
    const c = r.conta;
    if (!c) continue;

    /* F20g · o cabeçalho */
    const nome = faixa.querySelector('h3 [data-de-linha]');
    if (!nome || nome.getAttribute('data-de-linha') !== String(serie.linha_de_portugal)) {
      erro('F20g', sid, `o nome da faixa não é o de um cartão da linha «${serie.linha_de_portugal}»`);
    }
    const unidade = faixa.querySelectorAll('.paises-unidade [data-serie-campo="unit"]');
    if (unidade.length !== 1 || unidade[0].getAttribute('data-serie') !== sid) erro('F20g', sid, 'a unidade não é o campo «unit» da série');
    const periodo = faixa.querySelectorAll('.paises-unidade [data-linha-de-serie]');
    if (periodo.length !== 1 || periodo[0].getAttribute('data-linha-de-serie') !== sid || periodo[0].getAttribute('data-de-campo') !== 'periodo') {
      erro('F20g', sid, 'o período do cabeçalho não é o campo «periodo» da série');
    }

    /* F20h · as etiquetas do toque */
    const geos = [...c.paises.map((p) => p.geo), AGREGADO];
    const etiquetas = faixa.querySelectorAll('[data-toque-de]');
    const ditas = etiquetas.map((e) => e.getAttribute('data-toque-de'));
    const esperadas = faixa.querySelectorAll('[data-faixa-marca]').map((m) => m.getAttribute('data-faixa-marca'));
    if (ditas.slice().sort().join(',') !== geos.map((g) => `${sid}#${g}`).sort().join(',') || ditas.join(',') !== esperadas.join(',')) {
      erro('F20h', sid, `as etiquetas do toque são de ${ditas.length} marca(s), e são uma por marca, pela ordem das marcas (${geos.length})`);
    }
    for (const e of etiquetas) {
      contas.etiquetas++;
      const geo = String(e.getAttribute('data-toque-de')).split('#')[1];
      if (!e.hasAttribute('hidden')) erro('F20h', sid, `a etiqueta de ${geo} não está escondida no documento: aparece sem toque`);
      if (!e.closest('[data-toques]')) erro('F20h', sid, `a etiqueta de ${geo} está fora do desenho`);
      for (const m of conferirPontosDitos(e, { serie, geos: grupoDoValor(serie, geo), lang, paises, onde: `a etiqueta de ${geo}` })) erro('F20h', sid, m);
    }

    /* F20i · a lista dobrada */
    const listas = faixa.querySelectorAll('details[data-lista-paises]');
    if (listas.length !== 1 || listas[0].getAttribute('data-lista-paises') !== sid) {
      erro('F20i', sid, `a faixa tem ${listas.length} lista(s) dobrada(s) da série, e tem uma`);
    } else {
      const lista = listas[0];
      contas.listas++;
      if (lista.hasAttribute('open')) erro('F20i', sid, 'a lista está aberta no documento, e abre-se a pedido');
      const resumo = lista.querySelector('summary');
      const dito = `${s.uniaoEuropeia.listaA}${c.conta}${s.uniaoEuropeia.listaFim}`;
      if (!resumo || norm(resumo.text) !== norm(dito)) erro('F20i', sid, `o resumo diz «${norm(resumo?.text)}» e as palavras declaradas dão «${norm(dito)}»`);
      const conta = resumo?.querySelectorAll('[data-ponto-conta]') ?? [];
      if (conta.length !== 1 || conta[0].getAttribute('data-ponto-conta') !== sid) erro('F20i', sid, 'a contagem do resumo não é a contagem da série');
      const itens = lista.querySelectorAll('li[data-lista-ponto]');
      const daLista = itens.map((i) => String(i.getAttribute('data-lista-ponto')).split('#')[1]);
      const pelaOrdem = ordemDosPontos(serie);
      if (daLista.join(',') !== pelaOrdem.join(',')) {
        erro('F20i', sid, `a lista diz ${daLista.length} ponto(s) pela ordem ${daLista.join(' ')}; pelos valores, são ${pelaOrdem.length}: ${pelaOrdem.join(' ')}`);
      }
      for (const item of itens) {
        contas.itens++;
        const geo = String(item.getAttribute('data-lista-ponto')).split('#')[1];
        const classes = (item.getAttribute('class') ?? '').split(/\s+/);
        const papel = geo === AGREGADO ? 'paises-lista-uniao' : geo === 'PT' ? 'paises-lista-portugal' : 'paises-lista-pais';
        if (!classes.includes(papel)) erro('F20i', sid, `o item de ${geo} não tem a marca dele («${papel}»)`);
        for (const m of conferirPontosDitos(item, { serie, geos: [geo], lang, paises, onde: `o item de ${geo} da lista` })) erro('F20i', sid, m);
      }
    }

    /* F20j · a ressalva da Comissão */
    const linha = String(serie.linha_de_portugal);
    const marcas = faixa.querySelectorAll('[data-ressalva-da-uniao]');
    if (RESSALVA_NA_SECCAO.has(linha)) {
      const esperada = /** @type {Record<string, any>} */ (RESSALVAS_DA_UNIAO)[linha]?.[lang] ?? null;
      if (marcas.length !== 1 || marcas[0].getAttribute('data-ressalva-da-uniao') !== linha || norm(marcas[0].text) !== norm(esperada)) {
        erro('F20j', sid, `a faixa mostra a média da União e não tem a ressalva da Comissão com o texto da fonte única (${RESSALVA_NA_SECCAO.get(linha)})`);
      } else {
        contas.ressalvas_da_uniao++;
      }
    } else if (marcas.length) {
      erro('F20j', sid, 'a faixa tem uma ressalva da comparação com a União que a sua medida não pede');
    }
  }
  return { erros, contas };
}

/**
 * AS PLANTAS DA F20, sobre uma cópia da página em memória: as quatro do brief (um país a menos, um nome fora da
 * tabela, uma ordem trocada, um valor diferente do ponto) e as das peças novas. Cada uma tem de morder com a sua
 * célula, e a página intacta tem de passar; uma planta que não acha o nó que estraga conta como falhada.
 *
 * @param {string} html a página da União construída, inteira
 */
export function plantasDaSeccao(html, lang, rota, ctx) {
  const resultados = [];
  const planta = (nome, celula, estraga) => {
    const copia = parse(html);
    const achou = estraga(copia);
    if (!achou) return void resultados.push({ nome, passou: false, porque: 'a planta não achou o nó que estraga' });
    const { erros } = conferirSeccaoDosPaises(copia, lang, rota, ctx);
    resultados.push({ nome, passou: erros.some((e) => e.startsWith(`${celula} ·`)), porque: erros[0] ?? 'nenhum erro' });
  };
  const lista = (r) => r.querySelector('details[data-lista-paises]');
  /* AS QUATRO DO BRIEF */
  planta('um país a menos na lista', 'F20i', (r) => {
    const i = lista(r)?.querySelector('li.paises-lista-pais');
    if (!i) return false;
    i.remove();
    return true;
  });
  planta('um nome fora da tabela na lista', 'F20i', (r) => {
    const n = lista(r)?.querySelector('li.paises-lista-pais [data-pais]');
    if (!n) return false;
    n.set_content('Atlântida');
    return true;
  });
  planta('uma ordem trocada na lista', 'F20i', (r) => {
    const itens = lista(r)?.querySelectorAll('li[data-lista-ponto]') ?? [];
    if (itens.length < 2) return false;
    const a = itens[0].outerHTML;
    itens[0].replaceWith(itens[1].outerHTML);
    itens[1].replaceWith(a);
    return true;
  });
  planta('um valor diferente do ponto na lista', 'F20i', (r) => {
    const v = lista(r)?.querySelector('li.paises-lista-pais [data-ponto]');
    if (!v) return false;
    v.set_content(norm(v.text) === '1,0' ? '2,0' : '1,0');
    return true;
  });
  /* AS DAS PEÇAS NOVAS */
  planta('a lista aberta no documento', 'F20i', (r) => {
    const l = lista(r);
    if (!l) return false;
    l.setAttribute('open', '');
    return true;
  });
  planta('uma etiqueta do toque à vista sem toque', 'F20h', (r) => {
    const e = r.querySelector('[data-toque-de]');
    if (!e) return false;
    e.removeAttribute('hidden');
    return true;
  });
  planta('uma etiqueta do toque com o valor de outro país', 'F20h', (r) => {
    const e = r.querySelectorAll('[data-toque-de]')[1];
    const outro = r.querySelectorAll('[data-toque-de]')[2]?.querySelector('[data-ponto]');
    const v = e?.querySelector('[data-ponto]');
    if (!v || !outro || norm(v.text) === norm(outro.text)) return false;
    v.set_content(outro.text);
    return true;
  });
  planta('a etiqueta de um empate só com um dos países', 'F20h', (r) => {
    const e = r.querySelectorAll('[data-toque-de]').find((x) => x.querySelectorAll('[data-ponto]').length > 1);
    if (!e) return false;
    const pontos = e.querySelectorAll('[data-ponto]');
    const ultimo = pontos[pontos.length - 1].getAttribute('data-ponto');
    const geo = ultimo.split('#')[1];
    e.set_content(e.innerHTML.split(/(?=, |\s(?:e|and)\s)/).slice(0, 1).join(''));
    return !e.querySelector(`[data-ponto="${ultimo}"]`) && Boolean(geo);
  });
  planta('uma etiqueta do toque em falta', 'F20h', (r) => {
    const e = r.querySelector('[data-toque-de]');
    if (!e) return false;
    e.remove();
    return true;
  });
  planta('duas faixas trocadas de ordem', 'F20a', (r) => {
    const f = r.querySelectorAll('[data-faixa-paises]');
    if (f.length < 2) return false;
    const a = f[0].outerHTML;
    f[0].replaceWith(f[1].outerHTML);
    f[1].replaceWith(a);
    return true;
  });
  planta('uma marca fora da posição do valor', 'F20c', (r) => {
    const m = r.querySelector('[data-faixa-paises] [data-faixa-marca].faixa-ue-pais');
    if (!m) return false;
    m.setAttribute('style', 'left:50%');
    return true;
  });
  planta('a ressalva da Comissão tirada da faixa da sobrecarga', 'F20j', (r) => {
    const x = r.querySelector('[data-faixa-paises] [data-ressalva-da-uniao]');
    if (!x) return false;
    x.remove();
    return true;
  });
  planta('a ressalva da Comissão numa faixa que não a pede', 'F20j', (r) => {
    const f = r.querySelector('[data-faixa-paises="divida-publica-2025-paises"]');
    const x = r.querySelector('[data-faixa-paises] [data-ressalva-da-uniao]');
    if (!f || !x) return false;
    f.querySelector('.faixa-ue-frase')?.insertAdjacentHTML('afterend', x.outerHTML);
    return true;
  });
  return resultados;
}

/** A F20a de uma tabela da vista trocada só de um lado, sem página (uma vez por corrida). */
export function plantaDaTabela() {
  const trocada = Object.fromEntries(Object.entries(MEDIDAS_FORA_DOS_QUADROS).map(([l, r]) => [l, { ...r, depoisDe: null }]));
  const erros = conferirTabelaDaSeccao(trocada);
  return { nome: 'a tabela da vista com as medidas de fora dos quadros todas no fim', passou: erros.some((e) => e.startsWith('F20a ·')), porque: erros[0] ?? 'nenhum erro' };
}
