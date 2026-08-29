#!/usr/bin/env node
/**
 * M11 · orquestrador. Ver nucleo.mjs para as funções partilhadas e a nota
 * metodológica sobre isMobile/DPR. Ver BRIEF-M11.md para a ordem de trabalho.
 *
 *   node medir.mjs [positivos] [depois] [antes]   (omitido = tudo)
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  AQUI, PORTA, BASE, ANTES_URL, ROTA_PREFIXO, LARGURAS, LARGURAS_TELEMOVEL, dprDe,
  resultados, log, registaPositivo, grava, contraste, QUADRADO_INSCRITO,
  colhe, medeQuadradoInscrito, carregaPontos, pontoDaUnidade, novaPagina, vaiA, arrancaServidor,
  pontoDeEcra, medePar,
} from './nucleo.mjs';
import { chromium } from '/Users/nunosantos/Instruments/OEstadoDoPais/node_modules/playwright/index.mjs';

const SECOES = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const correTudo = SECOES.length === 0;
const corre = (nome) => correTudo || SECOES.includes(nome);

const UNIDADES_TESTE = ['lisboa', 'ilha-da-madeira', 'ilha-de-sao-miguel'];

/* ===========================================================================
 * RECEITAS DE MEDIÇÃO PARTILHADAS ENTRE OS POSITIVOS E AS MEDIÇÕES REAIS
 * ======================================================================== */


/** M9 · o nome e a contagem dos dois painéis. */
async function medePaineis(page) {
  return page.evaluate(() => {
    const normEsp = (s) => (s ? s.replace(/\s+/g, ' ').trim() : s);
    const procTitulo = document.querySelector('.painel-nome');
    const socialTitulo = document.querySelector('.social-titulo');
    const procNumEl = procTitulo ? procTitulo.querySelector('[data-prova="painel_com_limiar"]') : null;
    const socialNumEl = socialTitulo ? socialTitulo.querySelector('[data-prova="painel_social_total"]') : null;
    const contagemPecas = document.querySelectorAll('[data-painel] article.peca').length;
    const contagemSocial = document.querySelectorAll('.social-lista .social-linha').length;
    return {
      procedimento: procTitulo
        ? {
            textoNormalizado: normEsp(procTitulo.textContent),
            numeroNoTitulo: procNumEl ? Number(procNumEl.textContent.trim()) : null,
            contagemReal: contagemPecas,
            bate: procNumEl ? Number(procNumEl.textContent.trim()) === contagemPecas : null,
          }
        : null,
      social: socialTitulo
        ? {
            textoNormalizado: normEsp(socialTitulo.textContent),
            numeroNoTitulo: socialNumEl ? Number(socialNumEl.textContent.trim()) : null,
            contagemReal: contagemSocial,
            bate: socialNumEl ? Number(socialNumEl.textContent.trim()) === contagemSocial : null,
            temProva: !!socialNumEl,
          }
        : null,
    };
  });
}

/** M11 · procura marcas do bloco numa página de documento. */
async function medeDocumentoContaminacao(page) {
  return page.evaluate(() => {
    const marcadores = {
      temListaPorta: !!document.querySelector('[data-lista-porta]'),
      temPainelNome: !!document.querySelector('.painel-nome'),
      temAlvoAbaixoDe: !!document.querySelector('[data-alvo-abaixo-de]'),
      temSocialTituloComProva: !!document.querySelector('.social-titulo [data-prova="painel_social_total"]'),
      temFolhaDoPar: [...document.querySelectorAll('style')].some(
        (s) => s.textContent.includes('focus-visible') && s.textContent.includes('data-lista-porta'),
      ),
    };
    return { marcadores, contaminado: Object.values(marcadores).some(Boolean) };
  });
}

/** M8 · lê um token de cor pela propriedade computada de uma sonda, não pelo texto do custom property. */
async function medeContraste(page) {
  const leProbe = (nomes) =>
    Object.fromEntries(
      nomes.map((nome) => {
        const el = document.createElement('div');
        el.style.cssText = `color: var(${nome}); position:absolute; visibility:hidden;`;
        document.body.appendChild(el);
        const cor = getComputedStyle(el).color;
        el.remove();
        return [nome, cor];
      }),
    );
  const NOMES = ['--ink', '--paper', '--rule-strong'];
  const claro = await page.evaluate(leProbe, NOMES);
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const escuro = await page.evaluate(leProbe, NOMES);
  await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
  return { claro, escuro };
}

function rgbParaHex(rgb) {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb || '');
  if (!m) return null;
  const h = (n) => Number(n).toString(16).padStart(2, '0');
  return `#${h(m[1])}${h(m[2])}${h(m[3])}`;
}

function contagemBytesHtml(texto) {
  const total = Buffer.byteLength(texto, 'utf8');
  const m = /<style[^>]*>.*?<\/style>/s.exec(texto);
  const bytesEstilo = m ? Buffer.byteLength(m[0], 'utf8') : null;
  const temFolhaDoPar = m ? m[0].includes('focus-visible') && m[0].includes('data-lista-porta') : false;
  return { total, bytesEstilo: temFolhaDoPar ? bytesEstilo : (m ? 0 : null), estiloEncontrado: !!m };
}

/* ===========================================================================
 * SECÇÃO A · OS POSITIVOS CONHECIDOS
 * ======================================================================== */
async function correPositivos(browser) {
  log('\n=== POSITIVOS CONHECIDOS (antes de medir mais nada) ===\n');

  // KP1 · alvo abaixo de 44px
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/__estragos__/alvo-baixo/`);
    const dados = await colhe(page, { largura: 1280, medirQuadrado: false, prefixoRota: ROTA_PREFIXO.pt });
    const lisboa = dados.nomes.find((n) => n.slug === 'lisboa');
    const passou = !!lisboa && lisboa.altura < 44 && dados.alvoMinimo < 44;
    registaPositivo(
      'KP1_alvo_abaixo_44',
      passou,
      'lisboa com altura < 44px, e mínimo da largura < 44px',
      { alturaLisboa: lisboa?.altura, minimoDaLargura: dados.alvoMinimo },
      'alvo abaixo de 44 px (exemplo do brief) — Lisboa forçada a 20px de caixa',
    );
    await ctx.close();
  }

  // KP2 · ligação duplicada
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/__estragos__/ligacao-duplicada/`);
    const dados = await colhe(page, { largura: 1280, medirQuadrado: false, prefixoRota: ROTA_PREFIXO.pt });
    const dup = dados.familias.lista.duplicados;
    const passou = dados.familias.lista.total === 30 && dados.familias.lista.distintos === 29
      && dup.length === 1 && dup[0].slug === 'lisboa' && dup[0].vezes === 2;
    registaPositivo(
      'KP2_ligacao_duplicada',
      passou,
      '30 ligações na lista, 29 distintas, "lisboa" 2 vezes',
      dados.familias.lista,
      'ligação duplicada (exemplo do brief) — <li> de Lisboa repetido',
    );
    await ctx.close();
  }

  // KP3 · o par de estado não muda (folha do par apagada)
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/__estragos__/par-quebrado/`);
    const r = await medePar(page, 'lisboa');
    const passou = r.hoverNome.areasQueMudaram.length === 0 && r.focoNome.areasQueMudaram.length === 0
      && r.hoverArea.nomesQueMudaram.length === 0 && r.focoArea.nomesQueMudaram.length === 0
      && r.hoverNome.areasCorQueMudaram.length === 0 && r.focoNome.areasCorQueMudaram.length === 0;
    registaPositivo(
      'KP3_par_nao_muda',
      passou,
      'nenhuma área muda com o nome, nenhum nome muda com a área (folha do par vazia)',
      { hoverNome: r.hoverNome.areasQueMudaram, focoNome: r.focoNome.areasQueMudaram, hoverArea: r.hoverArea.nomesQueMudaram, focoArea: r.focoArea.nomesQueMudaram },
      'propriedade que não muda no hover (exemplo do brief) — <style> do par esvaziado',
    );
    await ctx.close();
  }

  // KP4 · contagem errada no nome do painel
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/__estragos__/contagem-errada/`);
    const r = await medePaineis(page);
    const passou = r.procedimento.numeroNoTitulo === 14 && r.procedimento.contagemReal === 13 && r.procedimento.bate === false
      && r.social.numeroNoTitulo === 9 && r.social.contagemReal === 8 && r.social.bate === false;
    registaPositivo(
      'KP4_contagem_errada',
      passou,
      'painel diz 14 (13 peças reais), social diz 9 (8 linhas reais), ambos "bate:false"',
      r,
      'contagem errada (exemplo do brief) — números do título trocados à mão',
    );
    await ctx.close();
  }

  // KP5 · grupo escondido numa largura onde não devia
  {
    const { ctx, page } = await novaPagina(browser, 390);
    await vaiA(page, `${BASE}/__estragos__/grupo-escondido/`);
    const dados = await colhe(page, { largura: 390, medirQuadrado: false, prefixoRota: ROTA_PREFIXO.pt });
    const continente = dados.grupos.find((g) => g.parcela === 'continente');
    const outros = dados.grupos.filter((g) => g.parcela !== 'continente');
    const passou = continente && continente.visivel === false && outros.every((g) => g.visivel === true);
    registaPositivo(
      'KP5_grupo_escondido',
      passou,
      'continente visivel:false, madeira e açores visivel:true',
      dados.grupos,
      'grupo escondido numa largura onde faz falta — extensão minha ao exemplo do brief',
    );
    await ctx.close();
  }

  // KP6 · documento contaminado
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/__estragos__/documento-contaminado/`);
    const r = await medeDocumentoContaminacao(page);
    const passou = r.contaminado === true && r.marcadores.temListaPorta && r.marcadores.temPainelNome;
    registaPositivo(
      'KP6_documento_contaminado',
      passou,
      'contaminado:true, com data-lista-porta e .painel-nome injectados',
      r,
      'contaminação do documento — extensão minha ao exemplo do brief (medição 11)',
    );
    await ctx.close();
  }

  // KP7 · o quadrado inscrito, contra geometria com resposta certa à mão
  {
    const { ctx, page } = await novaPagina(browser, 800);
    await vaiA(page, `${BASE}/__estragos__/geometria-sintetica/`);
    carregaPontos();
    const r = await medeQuadradoInscritoBruto(page, { grande: [300, 300], pequeno: [710, 710] });
    const passou = r.grande.dentro === true && r.grande.inscrito >= 44 && r.pequeno.dentro === true && r.pequeno.inscrito < 44;
    registaPositivo(
      'KP7_quadrado_inscrito',
      passou,
      'quadrado "grande" (400×400 unid., escala 0,5) >= 44px e "chega"; "pequeno" (20×20 unid.) < 44px e "não chega"',
      r,
      'o algoritmo do quadrado inscrito (I82), a mesma função usada na medição 6, sobre uma forma com resposta calculável à mão',
    );
    await ctx.close();
  }

  // KP8 · a fórmula de contraste, contra valores de manual
  {
    const pretoBranco = contraste('#000000', '#ffffff');
    const cinza = contraste('#767676', '#ffffff');
    const passou = Math.abs(pretoBranco - 21) < 0.01 && Math.abs(cinza - 4.54) < 0.02;
    registaPositivo(
      'KP8_formula_contraste',
      passou,
      'preto/branco = 21.00:1 (exacto); #767676/branco ≈ 4.54:1 (o limiar AA de texto normal, valor de referência da WCAG)',
      { pretoBranco: Number(pretoBranco.toFixed(4)), cinza: Number(cinza.toFixed(4)) },
      'fórmula da WCAG — não é um defeito de página, é a validação do cálculo que a medição 8 usa',
    );
  }

  // KP9 · o contador de bytes, contra um acréscimo conhecido
  {
    const original = fs.readFileSync(path.join(AQUI, 'm11-dist', 'index.html'), 'utf8');
    const estragado = fs.readFileSync(path.join(AQUI, 'estragos', 'bytes-conhecidos', 'index.html'), 'utf8');
    const a = contagemBytesHtml(original).total;
    const b = contagemBytesHtml(estragado).total;
    const passou = b - a === 500;
    registaPositivo(
      'KP9_contagem_bytes',
      passou,
      'diferença de exatamente 500 bytes',
      { original: a, estragado: b, diferenca: b - a },
      'contador de bytes — não é um defeito de página, é a validação do contador que a medição 10 usa',
    );
  }

  grava();
}

/** Versão do QUADRADO_INSCRITO chamada com pontos passados directamente (para KP7,
 *  cuja marcação não é a real e por isso não passa por medeQuadradoInscrito()). */
async function medeQuadradoInscritoBruto(page, pontos) {
  return page.evaluate(QUADRADO_INSCRITO, { pontos, PASSO: 2 });
}

/* ===========================================================================
 * SECÇÃO B · AS MEDIÇÕES SOBRE m11-dist (DEPOIS)
 * ======================================================================== */
async function medeDepois(browser) {
  log('\n=== DEPOIS (m11-dist) ===\n');
  resultados.medicoes.depois = { pt: {}, en: {} };

  for (const edicao of ['pt', 'en']) {
    const url = edicao === 'pt' ? `${BASE}/` : `${BASE}/en/`;
    log(`-- depois · ${edicao} --`);
    for (const largura of LARGURAS) {
      const { ctx, page } = await novaPagina(browser, largura);
      await vaiA(page, url);
      const dados = await colhe(page, {
        largura,
        medirQuadrado: LARGURAS_TELEMOVEL.includes(largura),
        prefixoRota: ROTA_PREFIXO[edicao],
      });
      resultados.medicoes.depois[edicao][largura] = dados;
      log(`   largura ${largura}: altura=${dados.altura} alvoMin=${dados.alvoMinimo} lista.total=${dados.familias.lista.total} mapa.total=${dados.familias.mapa.total}`);
      await ctx.close();
    }

    // painéis + bytes, uma vez por edição
    const { ctx, page } = await novaPagina(browser, 1280);
    const resp = await vaiA(page, url);
    resultados.medicoes.depois[edicao].paineis = await medePaineis(page);
    const corpo = (await resp.body()).toString('utf8');
    resultados.medicoes.depois[edicao].bytes = contagemBytesHtml(corpo);
    await ctx.close();
    log(`   paineis: ${JSON.stringify(resultados.medicoes.depois[edicao].paineis.procedimento?.textoNormalizado)}`);
    log(`   bytes: ${JSON.stringify(resultados.medicoes.depois[edicao].bytes)}`);
  }

  // M7 · o par de estado, só em pt, a 1280
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/`);
    const pares = {};
    for (const slug of UNIDADES_TESTE) {
      pares[slug] = await medePar(page, slug);
      log(`   par ${slug}: hoverNome muda ${JSON.stringify(pares[slug].hoverNome.areasQueMudaram)}, hoverArea muda ${JSON.stringify(pares[slug].hoverArea?.nomesQueMudaram)}`);
    }
    resultados.medicoes.depois.parDeEstado = pares;
    await ctx.close();
  }

  // M8 · contraste
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/`);
    const tokens = await medeContraste(page);
    const hexClaro = { ink: rgbParaHex(tokens.claro['--ink']), paper: rgbParaHex(tokens.claro['--paper']), ruleStrong: rgbParaHex(tokens.claro['--rule-strong']) };
    const hexEscuro = { ink: rgbParaHex(tokens.escuro['--ink']), paper: rgbParaHex(tokens.escuro['--paper']), ruleStrong: rgbParaHex(tokens.escuro['--rule-strong']) };
    resultados.medicoes.depois.contraste = {
      claro: { ...hexClaro, inkPaper: contraste(hexClaro.ink, hexClaro.paper), ruleStrongPaper: contraste(hexClaro.ruleStrong, hexClaro.paper) },
      escuro: { ...hexEscuro, inkPaper: contraste(hexEscuro.ink, hexEscuro.paper), ruleStrongPaper: contraste(hexEscuro.ruleStrong, hexEscuro.paper) },
    };
    log(`   contraste claro: ink/paper=${resultados.medicoes.depois.contraste.claro.inkPaper.toFixed(2)} rule-strong/paper=${resultados.medicoes.depois.contraste.claro.ruleStrongPaper.toFixed(2)}`);
    log(`   contraste escuro: ink/paper=${resultados.medicoes.depois.contraste.escuro.inkPaper.toFixed(2)} rule-strong/paper=${resultados.medicoes.depois.contraste.escuro.ruleStrongPaper.toFixed(2)}`);
    await ctx.close();
  }

  // M11 · o documento, sem nada disto
  {
    const { ctx, page } = await novaPagina(browser, 1280);
    await vaiA(page, `${BASE}/estudos/agua-nao-faturada/documento/`);
    resultados.medicoes.depois.documento = {
      rota: '/estudos/agua-nao-faturada/documento/',
      ...(await medeDocumentoContaminacao(page)),
    };
    log(`   documento contaminado? ${resultados.medicoes.depois.documento.contaminado}`);
    await ctx.close();
  }

  grava();
}

/* ===========================================================================
 * SECÇÃO C · AS MEDIÇÕES SOBRE O SÍTIO NO AR (ANTES) — com taxa
 * ======================================================================== */
let ultimoPedido = 0;
async function aguardaTaxa() {
  const agora = Date.now();
  const espera = ultimoPedido + 1100 - agora;
  if (espera > 0) {
    log(`   (a aguardar ${espera}ms, para nunca mais de um pedido por segundo ao sítio no ar)`);
    await new Promise((r) => setTimeout(r, espera));
  }
  ultimoPedido = Date.now();
}

async function medeAntes(browser) {
  log('\n=== ANTES (sítio no ar) — um pedido por página, nunca mais de 1/s ===\n');
  resultados.medicoes.antes = { pt: {}, en: {} };
  resultados.medicoes.antes_pedidos = [];

  for (const edicao of ['pt', 'en']) {
    const url = ANTES_URL[edicao];

    // grupo telemóvel: 320,360,390,430 — uma só navegação, resto por setViewportSize
    {
      const grupo = [320, 360, 390, 430];
      await aguardaTaxa();
      const ctx = await browser.newContext({ viewport: { width: grupo[0], height: 2200 }, deviceScaleFactor: 3 });
      const page = await ctx.newPage();
      log(`-- antes · ${edicao} · pedido 1/2 (grupo telemóvel, dpr 3) -> ${url}`);
      let resp;
      try {
        resp = await vaiA(page, url);
      } catch (erro) {
        log(`   FALHOU a navegação: ${erro.message}`);
        resultados.medicoes.antes_pedidos.push({ edicao, url, grupo: 'telemovel', ok: false, erro: String(erro.message) });
        await ctx.close();
        continue;
      }
      resultados.medicoes.antes_pedidos.push({ edicao, url, grupo: 'telemovel', ok: true, status: resp.status() });
      const corpo = (await resp.body()).toString('utf8');
      resultados.medicoes.antes[edicao].bytes = contagemBytesHtml(corpo);
      resultados.medicoes.antes[edicao].paineis = await medePaineis(page);

      for (const largura of grupo) {
        if (largura !== grupo[0]) {
          await page.setViewportSize({ width: largura, height: 2200 });
          await page.waitForTimeout(120);
        }
        const dados = await colhe(page, { largura, medirQuadrado: true, prefixoRota: ROTA_PREFIXO[edicao] });
        resultados.medicoes.antes[edicao][largura] = dados;
        log(`   largura ${largura}: altura=${dados.altura} alvoMin=${dados.alvoMinimo} lista.total=${dados.familias.lista.total} mapa.total=${dados.familias.mapa.total} grelha=${dados.grelha ? dados.grelha.alturaGrelha : 'n/a'}`);
      }
      await ctx.close();
    }

    // grupo ecrã: 768,1024,1280 — segunda e última navegação a esta edição
    {
      const grupo = [768, 1024, 1280];
      await aguardaTaxa();
      const ctx = await browser.newContext({ viewport: { width: grupo[0], height: 2200 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      log(`-- antes · ${edicao} · pedido 2/2 (grupo ecrã, dpr 2) -> ${url}`);
      let resp;
      try {
        resp = await vaiA(page, url);
      } catch (erro) {
        log(`   FALHOU a navegação: ${erro.message}`);
        resultados.medicoes.antes_pedidos.push({ edicao, url, grupo: 'ecra', ok: false, erro: String(erro.message) });
        await ctx.close();
        continue;
      }
      resultados.medicoes.antes_pedidos.push({ edicao, url, grupo: 'ecra', ok: true, status: resp.status() });

      for (const largura of grupo) {
        if (largura !== grupo[0]) {
          await page.setViewportSize({ width: largura, height: 2200 });
          await page.waitForTimeout(120);
        }
        const dados = await colhe(page, { largura, medirQuadrado: false, prefixoRota: ROTA_PREFIXO[edicao] });
        resultados.medicoes.antes[edicao][largura] = dados;
        log(`   largura ${largura}: altura=${dados.altura} alvoMin=${dados.alvoMinimo} lista.total=${dados.familias.lista.total} mapa.total=${dados.familias.mapa.total} grelha=${dados.grelha ? dados.grelha.alturaGrelha : 'n/a'}`);
      }
      await ctx.close();
    }
  }

  grava();
}

/* ===========================================================================
 * MAIN
 * ======================================================================== */
(async () => {
  await arrancaServidor(PORTA);
  log(`servidor local em ${BASE}`);

  const browser = await chromium.launch();
  try {
    if (corre('positivos')) await correPositivos(browser);
    if (corre('depois')) await medeDepois(browser);
    if (corre('antes')) await medeAntes(browser);
  } finally {
    await browser.close();
  }

  grava();
  log('\nresultados.json escrito.');
  process.exit(0);
})();
