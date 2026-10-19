#!/usr/bin/env node
/**
 * AS MEDIDAS DO BLOCO ME1, por guião (a regra 13 e a 14 do CLAUDE.md): cada uma com o nome, o valor, o comando
 * que a repete e um conhecido-positivo onde há detetor. Escreve `medidas.json` ao lado.
 *
 *   · as palavras do corpo do Método antes e depois, nas duas edições: o texto de `<main>`, que deixa de fora o
 *     cabeçalho, o menu e o rodapé, lido elemento a elemento (o texto de cada elemento separado do vizinho, para
 *     que dois blocos seguidos não se colem numa palavra), sem guiões nem folhas de estilo; uma palavra é uma
 *     sequência sem espaços com pelo menos uma letra ou um algarismo. É a definição que mais se aproxima da
 *     contagem do lugar de direção no ar (2 474 e 2 476): dá 2 477 nas duas edições de antes. O antes lê as
 *     páginas guardadas em `antes/`, da construção da cabeça de partida; o depois lê o `dist/` da cabeça medida;
 *   · os nomes de modelos e de fornecedores no texto visível do Método, pela expressão da régua do portão;
 *   · a porta do rótulo numa página qualquer, as secções do Método e a posição da da política;
 *   · as âncoras antigas do Método que ficam e as que saem;
 *   · os tokens da prova no texto corrido, e a única ligação para fora da página;
 *   · o resumo de `src/data/metodo.mjs` e a entrada do `DECISIONS.md` que o carimba;
 *   · as linhas do livro-razão com a PORDATA por fonte, e se o Método é uma rota medida pela régua da voz,
 *     que são os dois factos de que dependem as duas questões do relatório sobre frases do mandato;
 *   · e, lidos dos ficheiros que as outras provas do bloco escreveram, as contagens que o relatório cita: o
 *     inventário do Método, as plantas de cada régua, as frases conferidas, as capturas, os códigos dos três
 *     portões e os das duas conferências com o motor ao lado. Por isso este guião corre em último lugar.
 *
 * uso: node medir-me1.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { NOMES_DE_MODELOS, PLANTAS_DO_METODO, LEITURA_DOS_NOMES } from '../../../../scripts/lugares-ia-do-portao.mjs';
import { VERIFICACAO } from '../../../../src/data/verificacao.mjs';
import { loadClaims, provenienciaIncompleta, camposPorVerificar } from '../../../../src/lib/ledger.mjs';
import { FRASE, POLITICA } from '../../../../src/data/politica-ia.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const DIST = path.resolve(process.argv[2] ?? path.join(RAIZ, 'dist'));
const VERSAO = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const VERSAO_ANTES = JSON.parse(fs.readFileSync(path.join(AQUI, 'antes/version.json'), 'utf8'));
const GUIAO = 'node design/especime-v3/medicoes/me1-2026-10-15/medir-me1.mjs';
const medidas = {};
const medida = (nome, valor, comando, conhecido_positivo = null) => {
  medidas[nome] = { valor, comando, ...(conhecido_positivo ? { conhecido_positivo } : {}) };
};
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const antes = (f) => zlib.gunzipSync(fs.readFileSync(path.join(AQUI, 'antes', f))).toString('utf8');
const depois = (f) => fs.readFileSync(path.join(DIST, f), 'utf8');

/* ------------------------------------------------------------------ as palavras do corpo */
function textoDoCorpo(html) {
  const anda = (n) => {
    if (n.nodeType === 3) return n.text;
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript') return ' ';
    return ' ' + (n.childNodes ?? []).map(anda).join(' ') + ' ';
  };
  return anda(parse(html).querySelector('main')).replace(/\u00a0/g, ' ');
}
const palavras = (t) => t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
{
  const positivo = palavras('Um dois, três · quatro → 5');
  const valor = {};
  for (const [lingua, fa, fd] of [['pt', 'metodo.html.gz', 'metodo/index.html'], ['en', 'en-method.html.gz', 'en/method/index.html']]) {
    const a = palavras(textoDoCorpo(antes(fa)));
    const d = palavras(textoDoCorpo(depois(fd)));
    valor[lingua] = { antes: a, depois: d, depois_sobre_antes: Math.round((d / a) * 1000) / 1000, menos_de_metade: d * 2 < a };
  }
  medida('palavras_do_corpo_do_metodo', { ...valor, antes_cabeca: VERSAO_ANTES.commit, depois_cabeca: VERSAO.commit,
    definicao: 'o texto de <main> (sem o cabeçalho, o menu e o rodapé), lido elemento a elemento, sem guiões nem folhas de estilo; uma palavra é uma sequência sem espaços com uma letra ou um algarismo' },
  `${GUIAO} (o antes lê antes/metodo.html.gz e antes/en-method.html.gz, guardados da construção de ${VERSAO_ANTES.commit.slice(0, 8)})`,
  { o_que: 'a frase «Um dois, três · quatro → 5» tem cinco palavras pela mesma conta (o ponto médio e a seta não contam)', encontrado: positivo === 5 });
}

/* As palavras de cada parte do corpo do Método construído: a cabeça (o rótulo, o título e a abertura), o sumário
   e cada secção, pela mesma conta, para se ver onde estão. */
{
  const partes = (html) => {
    const r = parse(html);
    const main = r.querySelector('main');
    const conta = (el) => palavras(textoDoCorpo(`<main>${el.toString()}</main>`));
    const out = { rotulo: conta(main.querySelector('[data-rotulo-ia]')), titulo_e_abertura: conta(main.querySelector('h1').parentNode), sumario: conta(main.querySelector('nav.metodo-sumario')) };
    for (const s of main.querySelectorAll('section.metodo-secao')) out[s.getAttribute('id')] = conta(s);
    return out;
  };
  const pt = partes(depois('metodo/index.html'));
  const en = partes(depois('en/method/index.html'));
  const soma = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  medida('palavras_por_parte_do_metodo', { pt, en, soma_pt: soma(pt), soma_en: soma(en) },
    `${GUIAO} (a mesma conta, parte a parte de <main>)`,
    { o_que: 'a soma das partes é a contagem do corpo inteiro, nas duas edições', encontrado: soma(pt) === medidas.palavras_do_corpo_do_metodo.valor.pt.depois && soma(en) === medidas.palavras_do_corpo_do_metodo.valor.en.depois });
}

/* ------------------------------------------------------------------ os nomes de modelos */
/* Com o texto de `noscript`, como a régua do portão desde a leitura a frio do Codex (15.10.2026, o achado 9). */
function textoVisivel(html) {
  const r = parse(html, LEITURA_DOS_NOMES);
  const corpo = r.querySelector('body');
  for (const x of corpo.querySelectorAll('script, style, template')) x.remove();
  return corpo.textContent;
}
const nomesEm = (html) => [...new Set((textoVisivel(html).match(new RegExp(NOMES_DE_MODELOS.source, 'gi')) ?? []).map((x) => x.toLowerCase()))].sort();
{
  const positivoPt = nomesEm(antes('metodo.html.gz'));
  const positivoEn = nomesEm(antes('en-method.html.gz'));
  medida('nomes_de_modelos_no_metodo', { pt: nomesEm(depois('metodo/index.html')), en: nomesEm(depois('en/method/index.html')) },
    `${GUIAO} (a expressão NOMES_DE_MODELOS de scripts/lugares-ia-do-portao.mjs sobre o texto visível)`,
    { o_que: 'o Método de antes do bloco diz claude, anthropic, codex e openai pela mesma conta', antes_pt: positivoPt, antes_en: positivoEn,
      encontrado: JSON.stringify(positivoPt) === '["anthropic","claude","codex","openai"]' && JSON.stringify(positivoEn) === '["anthropic","claude","codex","openai"]' });
  const outras = {};
  for (const f of ['index.html', 'sobre/index.html', 'precos/index.html', 'en/index.html', 'en/about/index.html', 'livro-razao/divida-publica-2025/index.html']) outras[f] = nomesEm(depois(f));
  medida('nomes_de_modelos_noutras_paginas', outras, `${GUIAO} (as mesmas seis páginas que o §0 do mandato mediu no ar)`,
    { o_que: 'o mesmo detetor acha os nomes no Método de antes (a medida acima)', encontrado: positivoPt.length === 4 });
}

/* ------------------------------------------------------------------ a porta do rótulo */
const portasDoRotulo = (html) => [...new Set(parse(html).querySelectorAll('[data-rotulo-ia="topo"] a[href]').map((a) => a.getAttribute('href')))];
{
  const pagAntes = portasDoRotulo(antes('metodo.html.gz'));
  medida('porta_do_rotulo', {
    'precos/index.html': portasDoRotulo(depois('precos/index.html')), 'en/prices/index.html': portasDoRotulo(depois('en/prices/index.html')),
    'metodo/index.html': portasDoRotulo(depois('metodo/index.html')), 'sobre/index.html': portasDoRotulo(depois('sobre/index.html')),
  }, `${GUIAO} (os href dentro de [data-rotulo-ia="topo"])`,
  { o_que: 'no Método de antes do bloco o rótulo abre /metodo#politica-de-ia', antes: pagAntes, encontrado: JSON.stringify(pagAntes) === '["/metodo#politica-de-ia"]' });
  const portaDoSobre = (html) => parse(html).querySelectorAll('p.sobre-porta a[href]').map((a) => ({ href: a.getAttribute('href'), texto: a.textContent.trim() }));
  const sobreAntes = portaDoSobre(antes('sobre.html.gz'));
  medida('porta_do_sobre', { pt: portaDoSobre(depois('sobre/index.html')), en: portaDoSobre(depois('en/about/index.html')) },
    `${GUIAO} (a ligação de p.sobre-porta)`,
    { o_que: 'no Sobre de antes a porta abria /metodo#politica-de-ia', antes: sobreAntes, encontrado: sobreAntes[0]?.href === '/metodo#politica-de-ia' });
}

/* ------------------------------------------------------------------ as secções e as âncoras */
const seccoes = (html) => parse(html).querySelectorAll('main section.metodo-secao').map((s) => ({ id: s.getAttribute('id'), titulo: s.querySelector('h2')?.textContent.trim() }));
const ids = (html) => new Set(parse(html).querySelectorAll('[id]').map((e) => e.getAttribute('id')));
{
  const pt = seccoes(depois('metodo/index.html'));
  const en = seccoes(depois('en/method/index.html'));
  const posicao = pt.findIndex((s) => s.id === 'politica-de-ia') + 1;
  const antesPt = seccoes(antes('metodo.html.gz'));
  medida('seccoes_do_metodo', { pt, en, posicao_da_seccao_da_politica: { pt: posicao, en: en.findIndex((s) => s.id === 'politica-de-ia') + 1, de: pt.length } },
    `${GUIAO} (as section.metodo-secao de <main>, com o id e o <h2>)`,
    { o_que: 'no Método de antes, a secção da política não era a primeira das secções com metodo-secao (antes: quantas eram; posicao_antes: a dela)', antes: antesPt.length,
      posicao_antes: antesPt.findIndex((s) => s.id === 'politica-de-ia') + 1, encontrado: antesPt.findIndex((s) => s.id === 'politica-de-ia') > 0 });
  const ANTIGAS = ['sumario', 'fontes', 'motor', 'livro-razao', 'construcao', 'selo', 'releitura', 'correcoes', 'agenda', 'intervencao-humana', 'o-que-nao-faz', 'politica-de-ia', 'a-forma', 'a-cor', 'a-escala', 'a-letra', 'a-seguir'];
  const idsAntes = ids(antes('metodo.html.gz'));
  const idsDepois = ids(depois('metodo/index.html'));
  const idsDepoisEn = ids(depois('en/method/index.html'));
  medida('ancoras_antigas_do_metodo', { ficam: ANTIGAS.filter((x) => idsDepois.has(x) && idsDepoisEn.has(x)), saem: ANTIGAS.filter((x) => !idsDepois.has(x) || !idsDepoisEn.has(x)), nova: ['por-confirmar'].filter((x) => idsDepois.has(x) && idsDepoisEn.has(x)) },
    `${GUIAO} (os id das duas edições)`,
    { o_que: 'as dezassete âncoras existiam todas no Método de antes', encontrado: ANTIGAS.every((x) => idsAntes.has(x)) });
}

/* ------------------------------------------------------------------ os tokens e a ligação para fora */
{
  const tokens = (html) => parse(html).querySelectorAll('main p.metodo-p [data-prova]').map((e) => ({ chave: e.getAttribute('data-prova'), valor: e.textContent, porta: e.getAttribute('href') }));
  const externas = (html) => parse(html).querySelectorAll('main a[href]').map((a) => a.getAttribute('href')).filter((h) => /^https?:/.test(h));
  const positivo = externas('<html><body><main><p><a href="https://exemplo.invalid/x">x</a> <a href="/y">y</a></p></main></body></html>');
  const tpt = tokens(depois('metodo/index.html')), ten = tokens(depois('en/method/index.html'));
  medida('tokens_da_prova_no_texto_corrido', { pt: tpt, en: ten, contagem: { pt: tpt.length, en: ten.length } },
    `${GUIAO} (os [data-prova] dentro de p.metodo-p, com o texto e a porta)`);
  medida('ligacoes_para_fora_do_metodo', { pt: externas(depois('metodo/index.html')), en: externas(depois('en/method/index.html')), antes_pt: externas(antes('metodo.html.gz')) },
    `${GUIAO} (os href com esquema http ou https dentro de <main>)`,
    { o_que: 'uma página de ensaio com uma ligação https e uma interna dá uma ligação para fora', encontrado: positivo.length === 1 });
}

/* ------------------------------------------------------------------ os resumos dos textos governados */
/* Desde a decisão do ME1-21, a linha **Texto:** da §1.196 carimba dois textos («metodo <r> · politica <r>»), e lê-se
   par a par, como o check-ledger a lê, em vez de se pedir que acabe no resumo do Método. */
const resumoDe = (txt) => crypto.createHash('sha256').update(txt.replace(/\r\n/g, '\n'), 'utf8').digest('hex').slice(0, 12);
const carimbosDa = (decisoes, numero) => {
  const i = decisoes.indexOf(`### ${numero} `);
  if (i < 0) return {};
  const fim = decisoes.indexOf('\n### ', i + 1);
  const linha = decisoes.slice(i, fim < 0 ? undefined : fim).match(/^\*\*Texto:\*\*\s*(.+?)\s*$/m)?.[1] ?? '';
  return Object.fromEntries(linha.split('·').map((x) => x.trim().match(/^([a-z]+)\s+([0-9a-f]{12})$/)).filter(Boolean).map((m) => [m[1], m[2]]));
};
const DECISOES = fs.readFileSync(path.join(RAIZ, 'DECISIONS.md'), 'utf8');
const CARIMBOS_1_196 = carimbosDa(DECISOES, '1.196');
{
  const resumo = resumoDe(fs.readFileSync(path.join(RAIZ, 'src/data/metodo.mjs'), 'utf8'));
  const carimbo = CARIMBOS_1_196.metodo ?? null;
  medida('resumo_de_metodo_mjs', { resumo, carimbo_da_entrada_1_196: carimbo, iguais: resumo === carimbo },
    "node -e \"const c=require('crypto'),f=require('fs');console.log(c.createHash('sha256').update(f.readFileSync('src/data/metodo.mjs','utf8').replace(/\\r\\n/g,'\\n'),'utf8').digest('hex').slice(0,12))\" (a conta de resumoDoTexto em scripts/check-ledger.mjs); e shasum -a 256 src/data/metodo.mjs",
    (() => {
      const velho = execFileSync('git', ['show', `${VERSAO_ANTES.commit}:src/data/metodo.mjs`], { cwd: RAIZ, encoding: 'utf8' }).replace(/\r\n/g, '\n');
      const r = crypto.createHash('sha256').update(velho, 'utf8').digest('hex').slice(0, 12);
      return { o_que: 'a mesma conta sobre o metodo.mjs da cabeça de partida dá d69dd4ebec1d, o carimbo da §1.184, e o mesmo leitor da linha **Texto:** lê esse carimbo na §1.184', antes: r,
        carimbo_lido_na_1_184: carimbosDa(DECISOES, '1.184').metodo ?? null,
        encontrado: r === 'd69dd4ebec1d' && carimbosDa(DECISOES, '1.184').metodo === 'd69dd4ebec1d' };
    })());
}
{
  const resumo = resumoDe(fs.readFileSync(path.join(RAIZ, 'src/data/politica-ia.mjs'), 'utf8'));
  const carimbo = CARIMBOS_1_196.politica ?? null;
  const velho = resumoDe(execFileSync('git', ['show', `${VERSAO_ANTES.commit}:src/data/politica-ia.mjs`], { cwd: RAIZ, encoding: 'utf8' }));
  const amarra = fs.existsSync(path.join(AQUI, 'plantas/plantas-da-amarra.json')) ? JSON.parse(fs.readFileSync(path.join(AQUI, 'plantas/plantas-da-amarra.json'), 'utf8')) : [];
  const planta = amarra.find((x) => x.nome === 'me1-resumo-da-politica-desatualizado');
  medida('resumo_de_politica_ia_mjs', { resumo, carimbo_da_entrada_1_196: carimbo, iguais: resumo === carimbo, textos_carimbados_na_1_196: Object.keys(CARIMBOS_1_196) },
    "a mesma conta de resumoDoTexto() sobre src/data/politica-ia.mjs (node -e, com o caminho trocado); e shasum -a 256 src/data/politica-ia.mjs",
    { o_que: 'a mesma conta sobre o politica-ia.mjs da cabeça de partida dá outro resumo, e a planta que o põe na §1.196 é recusada pela amarra com esse resumo na queixa',
      antes: velho, diferente_do_de_hoje: velho !== resumo, planta_mordeu: Boolean(planta?.passou), queixa: planta?.queixa ?? null,
      encontrado: velho !== resumo && Boolean(planta?.passou) && String(planta?.queixa ?? '').includes(velho) });
}

/* ------------------------------------------------------------------ os dois factos das questões */
{
  const linhas = fs.readdirSync(path.join(RAIZ, 'ledger/claims')).filter((f) => f.endsWith('.yml'));
  const fonte = (f) => fs.readFileSync(path.join(RAIZ, 'ledger/claims', f), 'utf8').match(/^source:\s*"?([^"\n]+)"?/m)?.[1] ?? null;
  const pordata = linhas.filter((f) => fonte(f) === 'PORDATA');
  const ine = linhas.filter((f) => fonte(f) === 'INE');
  medida('linhas_com_a_pordata_por_fonte', { linhas: pordata.length, ficheiros: pordata },
    "o campo source de ledger/claims/*.yml igual a «PORDATA» (o mesmo leitor do §0 do mandato)",
    { o_que: 'o mesmo leitor acha as linhas com o INE por fonte', linhas_ine: ine.length, encontrado: ine.length > 0 });
  /* A decisão do ME1-1 na passagem de correção: a linha da PORDATA não se toca e fica contada entre as que estão por
     confirmar. Mede-se com o predicado da contagem «divida» de src/lib/prova.mjs, que o §3.3 P3 rende. */
  const claims = loadClaims();
  const porConfirmar = [...claims.values()].filter((c) => provenienciaIncompleta(c)).map((c) => c.id).sort();
  const completa = claims.get('divida-publica-2025');
  /* E nenhum ficheiro do livro-razão mudou no ramo, da partida à cabeça em que isto corre. */
  const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
  const cabecaAgora = git('rev-parse', 'HEAD');
  const tocados = git('diff', '--name-only', '4b50b92e', cabecaAgora, '--', 'ledger/').split('\n').filter(Boolean);
  const ultimoAntes = git('log', '-n', '1', '--format=%H', '4b50b92e', '--', 'ledger/');
  const tocadosNoUltimo = git('diff', '--name-only', `${ultimoAntes}~1`, ultimoAntes, '--', 'ledger/').split('\n').filter(Boolean);
  medida('ledger_tocado_no_ramo', { ficheiros: tocados.length, lista: tocados, de: '4b50b92e', ate: cabecaAgora },
    'git diff --name-only 4b50b92e HEAD -- ledger/',
    { o_que: 'o mesmo comando sobre o último commit que tocou ledger/ antes da partida lista os ficheiros dele', commit: ultimoAntes,
      ficheiros: tocadosNoUltimo.length, encontrado: tocadosNoUltimo.length > 0 });
  /* Depois da leitura a frio (o achado 5 e o ponto 8 da §1.196): de cada uma, a fonte declarada, o estudo e os campos
     por confirmar; e, à parte, as linhas do livro-razão com a fonte «[a verificar]», com o estado de publicação e se o
     leitor do livro-razão as carrega (as retiradas não se carregam, não se contam nem se publicam). */
  const detalhe = porConfirmar.map((id) => { const c = claims.get(id); return { id, fonte: c.source, estudo: c.study, campos_por_confirmar: camposPorVerificar(c) }; });
  const ficheirosDoLivro = fs.readdirSync(path.join(RAIZ, 'ledger/claims')).filter((f) => f.endsWith('.yml')).sort();
  const comFontePorVerificar = ficheirosDoLivro.map((f) => ({ f, t: fs.readFileSync(path.join(RAIZ, 'ledger/claims', f), 'utf8') }))
    .filter(({ t }) => /^source:\s*"\[a verificar\]"\s*$/m.test(t))
    .map(({ f, t }) => {
      const id = f.replace(/\.yml$/, '');
      return { id, estudo: t.match(/^study:\s*"?([^"\n]+)"?/m)?.[1] ?? null, publicacao: t.match(/^publication:\s*"?([^"\n]+)"?/m)?.[1] ?? null, carregada: claims.has(id) };
    });
  medida('linhas_com_a_fonte_por_verificar', { linhas: comFontePorVerificar.length, lista: comFontePorVerificar,
    carregadas: comFontePorVerificar.filter((x) => x.carregada).length },
    "os ficheiros de ledger/claims/*.yml com «source: \"[a verificar]\"», com o campo publication e se loadClaims() de src/lib/ledger.mjs os carrega",
    { o_que: 'o mesmo leitor acha a linha da PORDATA pela fonte dela, e loadClaims() carrega-a', pordata_carregada: claims.has('saldo-natural-portugal-2025'),
      encontrado: claims.has('saldo-natural-portugal-2025') && /^source:\s*"PORDATA"\s*$/m.test(fs.readFileSync(path.join(RAIZ, 'ledger/claims/saldo-natural-portugal-2025.yml'), 'utf8')) });
  medida('linhas_por_confirmar', { linhas: porConfirmar.length, ids: porConfirmar, a_da_pordata_entre_elas: porConfirmar.includes('saldo-natural-portugal-2025'), detalhe },
    'provenienciaIncompleta() de src/lib/ledger.mjs sobre as linhas de loadClaims(), o mesmo predicado da contagem «divida» de src/lib/prova.mjs',
    { o_que: 'o mesmo predicado dá falso numa linha de origem completa (divida-publica-2025) e verdadeiro na mesma linha com o excerto trocado por «[a verificar]»',
      completa_da_falso: provenienciaIncompleta(completa) === false,
      plantada_da_verdadeiro: provenienciaIncompleta({ ...completa, excerpt: '[a verificar]' }) === true,
      encontrado: provenienciaIncompleta(completa) === false && provenienciaIncompleta({ ...completa, excerpt: '[a verificar]' }) === true });
  const src = fs.readFileSync(path.join(RAIZ, 'scripts/medir-defeitos.mjs'), 'utf8');
  const conjunto = (nome) => {
    const i = src.indexOf(`const ${nome} = new Set([`);
    const corpo = src.slice(i, src.indexOf(']);', i)).replace(/\/\*[\s\S]*?\*\//g, '');
    return [...corpo.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]);
  };
  const inventariadas = conjunto('ROTAS_DO_INVENTARIO');
  const isentas = conjunto('ROTAS_QUE_PROVAM_A_RENDICAO');
  medida('o_metodo_na_regua_da_voz', { metodo_inventariado: inventariadas.includes('metodo'), sobre_inventariado: inventariadas.includes('sobre'), linha_inventariada: inventariadas.includes('linha'), isentas },
    'os conjuntos ROTAS_DO_INVENTARIO e ROTAS_QUE_PROVAM_A_RENDICAO de scripts/medir-defeitos.mjs, lidos do código (a célula 3 do check:voz, «um bloco de rota inventariada fora do INVENTARIO-FRASES.md», só corre nas inventariadas)',
    { o_que: 'o mesmo leitor acha «correcoes» entre as rotas inventariadas', encontrado: inventariadas.includes('correcoes') });
}

/* ------------------------------------------------------------------ os textos das duas páginas e a amarra */
/* O §3.4 P2 diz que o texto do Método e o do Sobre só mudam com uma decisão registada que carimbe a versão nova.
   Mede-se o que a amarra de scripts/check-ledger.mjs carimba (o objeto TEXTOS, lido do código), os módulos que cada
   página importa de src/data, src/i18n e src/lib, e, para cada texto da primeira secção do Método e cada recusa, o
   que o prende: a amarra, o oráculo, a cópia do lado do portão, uma linha viva do inventário. Na passagem de
   correção mediu o estado de antes da decisão do ME1-21 (a política fora da amarra, quatro recusas sem portão, em
   passagem-de-correcao/medidas.json); daqui em diante mede o de depois. */
{
  const ledger = fs.readFileSync(path.join(RAIZ, 'scripts/check-ledger.mjs'), 'utf8');
  const corpo = ledger.match(/const TEXTOS = \{([\s\S]*?)\};/)[1];
  const amarrados = [...corpo.matchAll(/(\w+):\s*path\.join\(RAIZ,\s*([^)]*)\)/g)]
    .map((m) => ({ nome: m[1], ficheiro: [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]).join('/') }));
  const ficheirosAmarrados = new Set(amarrados.map((a) => a.ficheiro));
  const modulos = (vista) => [...fs.readFileSync(path.join(RAIZ, 'src/views', vista), 'utf8')
    .matchAll(/^import\s+(?:\{([^}]*)\}|\*\s+as\s+(\w+))\s+from\s+'\.\.\/((?:data|i18n|lib)\/[\w-]+\.mjs)';/gm)]
    .map((m) => ({ ficheiro: `src/${m[3]}`, nomes: m[1] ? m[1].split(',').map((x) => x.trim()).filter(Boolean) : [`* as ${m[2]}`],
      na_amarra: ficheirosAmarrados.has(`src/${m[3]}`) }));
  const vistas = { metodo: modulos('MetodoView.astro'), sobre: modulos('SobreView.astro') };
  const fora = Object.fromEntries(Object.entries(vistas).map(([k, v]) => [k, v.filter((m) => !m.na_amarra).map((m) => m.ficheiro)]));
  const inventario = fs.readFileSync(path.join(RAIZ, 'design/especime-v3/INVENTARIO-FRASES.md'), 'utf8')
    .split('\n').filter((l) => /\|\s*viva\s*\|/.test(l));
  const oraculo = fs.readFileSync(path.join(RAIZ, 'scripts/textos-aprovados.json'), 'utf8');
  const copia = fs.readFileSync(path.join(RAIZ, 'scripts/lugares-ia-do-portao.mjs'), 'utf8');
  const politicaNaAmarra = ficheirosAmarrados.has('src/data/politica-ia.mjs');
  const presa = (texto) => ({
    na_amarra: politicaNaAmarra,
    no_oraculo: oraculo.includes(JSON.stringify(texto).slice(1, -1)),
    na_copia_do_portao: copia.includes(texto),
    numa_linha_viva_do_inventario: inventario.some((l) => l.includes(texto)),
  });
  const primeiraSeccao = {
    titulo: presa(POLITICA.titulo.pt), frase: presa(FRASE.pt), papeis: presa(POLITICA.papeis.pt),
    familias: presa(POLITICA.familias.pt.antes.trim()), publicacao: presa(POLITICA.publicacao.pt),
  };
  const recusas = POLITICA.recusas.itens.map((r) => ({ pt: presa(r.pt), en: presa(r.en) }));
  const semPortao = (x) => !x.na_amarra && !x.no_oraculo && !x.na_copia_do_portao && !x.numa_linha_viva_do_inventario;
  medida('textos_das_paginas_fora_da_amarra', {
    amarra: amarrados, vistas, fora_da_amarra: fora,
    textos_da_primeira_seccao_do_metodo_pt: primeiraSeccao, recusas_do_metodo: recusas,
    recusas: POLITICA.recusas.itens.length,
    recusas_sem_portao_que_as_prenda: recusas.filter((r) => semPortao(r.pt) || semPortao(r.en)).length,
    recusas_fora_do_inventario: recusas.filter((r) => !r.pt.numa_linha_viva_do_inventario || !r.en.numa_linha_viva_do_inventario).length },
    'o objeto TEXTOS de scripts/check-ledger.mjs; os import de ../data/, ../i18n/ e ../lib/ de src/views/MetodoView.astro e SobreView.astro; e cada texto da primeira secção (pt) e cada recusa (pt e en) procurado em scripts/textos-aprovados.json, scripts/lugares-ia-do-portao.mjs e nas linhas vivas de design/especime-v3/INVENTARIO-FRASES.md',
    { o_que: 'o mesmo leitor acha na amarra os três textos governados, cada um importado por uma das páginas, e acha fora dela src/i18n/strings.mjs, que as duas importam',
      metodo_na_amarra: vistas.metodo.some((m) => m.ficheiro === 'src/data/metodo.mjs' && m.na_amarra),
      politica_na_amarra: vistas.metodo.some((m) => m.ficheiro === 'src/data/politica-ia.mjs' && m.na_amarra),
      sobre_na_amarra: vistas.sobre.some((m) => m.ficheiro === 'src/data/sobre.mjs' && m.na_amarra),
      strings_fora: fora.metodo.includes('src/i18n/strings.mjs') && fora.sobre.includes('src/i18n/strings.mjs'),
      encontrado: vistas.metodo.some((m) => m.ficheiro === 'src/data/metodo.mjs' && m.na_amarra)
        && vistas.metodo.some((m) => m.ficheiro === 'src/data/politica-ia.mjs' && m.na_amarra)
        && vistas.sobre.some((m) => m.ficheiro === 'src/data/sobre.mjs' && m.na_amarra)
        && fora.metodo.includes('src/i18n/strings.mjs') && fora.sobre.includes('src/i18n/strings.mjs') });
}

/* ------------------------------------------------------------------ as reconferências do painel europeu */
/* O Método diz que o painel europeu é reconferido contra a fonte todas as semanas. A leitura a frio do Codex
   (15.10.2026, o achado 6) pediu as datas, e o lugar de direção decidiu (§7, ponto 13) que se medem nos registos,
   por guião: as entradas de reconferência do livro-razão escritas pelo painel semanal, e as datas que a corrida do
   painel escreveu em src/data/verificacao.mjs, uma por commit, na história do git. */
{
  const dias = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
  const intervalos = (ds) => ds.slice(1).map((d, i) => dias(ds[i], d));
  const porData = {};
  for (const c of loadClaims().values()) {
    for (const v of (Array.isArray(c.verifications) ? c.verifications : [])) {
      if (v.by !== 'painel-semanal') continue;
      const d = String(v.date).slice(0, 10);
      (porData[d] ??= { entradas: 0, linhas: new Set() }).entradas++;
      porData[d].linhas.add(c.id);
    }
  }
  const datasDoLivro = Object.keys(porData).sort();
  const livro = Object.fromEntries(datasDoLivro.map((d) => [d, { entradas: porData[d].entradas, linhas: porData[d].linhas.size }]));
  const historia = execFileSync('git', ['log', '--format=@@ %H %ad', '--date=short', '-p', '--', 'src/data/verificacao.mjs'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const corridas = [];
  let commit = null;
  for (const l of historia.split('\n')) {
    const c = l.match(/^@@ ([0-9a-f]{40}) (\d{4}-\d{2}-\d{2})$/);
    if (c) { commit = { commit: c[1].slice(0, 8), data_do_commit: c[2] }; continue; }
    const v = l.match(/^\+\s*verificadoEm: '(\d{4}-\d{2}-\d{2})',?$/);
    if (v && commit) corridas.push({ ...commit, verificado_em: v[1] });
  }
  const datasDaHistoria = [...new Set(corridas.map((x) => x.verificado_em))].sort();
  const desde = datasDoLivro[0] ?? null;
  const daHistoriaDesde = desde ? datasDaHistoria.filter((d) => d >= desde) : [];
  medida('reconferencias_do_painel_europeu', {
    no_livro_razao: { datas: datasDoLivro, intervalos_em_dias: intervalos(datasDoLivro), por_data: livro },
    na_historia_de_verificacao_mjs: { datas: datasDaHistoria, intervalos_em_dias: intervalos(datasDaHistoria), corridas },
    desde_a_primeira_do_livro: { datas: daHistoriaDesde, iguais_as_do_livro: JSON.stringify(daHistoriaDesde) === JSON.stringify(datasDoLivro) },
    verificado_em_hoje: VERIFICACAO.verificadoEm,
  }, "as entradas de verifications com by igual a «painel-semanal» nas linhas de loadClaims() (src/lib/ledger.mjs), e git log -p -- src/data/verificacao.mjs (as linhas «verificadoEm» acrescentadas em cada commit)",
  { o_que: 'os dois leitores acham a data de hoje de src/data/verificacao.mjs como a última, e o recibo de exemplo (divida-publica-2025) tem as suas entradas do painel semanal',
    ultima_do_livro: datasDoLivro.at(-1) ?? null, ultima_da_historia: datasDaHistoria.at(-1) ?? null,
    entradas_do_recibo_de_exemplo: (loadClaims().get('divida-publica-2025')?.verifications ?? []).filter((v) => v.by === 'painel-semanal').length,
    encontrado: datasDoLivro.at(-1) === VERIFICACAO.verificadoEm && datasDaHistoria.at(-1) === VERIFICACAO.verificadoEm
      && (loadClaims().get('divida-publica-2025')?.verifications ?? []).some((v) => v.by === 'painel-semanal') });
}

/* ------------------------------------------------------------------ o inventário do Método */
{
  const inv = fs.readFileSync(path.join(RAIZ, 'design/especime-v3/INVENTARIO-FRASES.md'), 'utf8').split('\n');
  const linha = (l) => l.startsWith('|') ? l.slice(1, -1).split('|').map((x) => x.trim()) : null;
  const celulas = inv.map(linha).filter((c) => c && c.length === 5);
  const me1 = celulas.filter((c) => c[2] === 'me1');
  /* As classes contam-se nas linhas vivas: desde a leitura curta, a secção ME1 tem também linhas retiradas (a redação
     intermédia da escala), que se contam à parte. */
  const porClasse = {};
  for (const c of me1.filter((x) => x[3] === 'viva')) porClasse[c[0]] = (porClasse[c[0]] ?? 0) + 1;
  const retiradas = celulas.filter((c) => c[3] === 'retirada' && c[4].startsWith('ME1 (15.10.2026)'));
  const titulosQueSairam = inv.filter((l) => l === '| conteudo | O livro-razão | até 2026-08-26 | viva | — |' || l === '| conteudo | The ledger | até 2026-08-26 | viva | — |').length;
  medida('inventario_do_metodo', { linhas_novas_vivas: me1.filter((c) => c[3] === 'viva').length, por_classe: porClasse,
    retiradas_pelo_me1: retiradas.length, retiradas_por_bloco: retiradas.reduce((o, c) => ({ ...o, [c[2]]: (o[c[2]] ?? 0) + 1 }), {}),
    retiradas_na_seccao_me1: me1.filter((c) => c[3] === 'retirada').length,
    titulos_que_sairam_do_ficheiro_ainda_presentes: titulosQueSairam },
  "as linhas de cinco colunas de design/especime-v3/INVENTARIO-FRASES.md com o bloco me1, e as retiradas cuja razão começa por «ME1 (15.10.2026)»",
  { o_que: 'o mesmo leitor conta as linhas do bloco h4, que existiam antes do ME1', linhas_h4: celulas.filter((c) => c[2] === 'h4').length, encontrado: celulas.filter((c) => c[2] === 'h4').length > 0 });
}

/* ------------------------------------------------------------------ as provas das outras réguas */
const leJson = (f) => (fs.existsSync(path.join(AQUI, f)) ? JSON.parse(fs.readFileSync(path.join(AQUI, f), 'utf8')) : null);
{
  const me1 = leJson('plantas/plantas-portoes-me1.json') ?? [];
  const lista = leJson('plantas/plantas-portoes-lista.json') ?? [];
  const amarra = leJson('plantas/plantas-da-amarra.json') ?? [];
  const frases = leJson('frases/conferencia-das-frases.json');
  medida('plantas_do_bloco', {
    em_memoria_no_portao_de_html: PLANTAS_DO_METODO.length,
    me1_sobre_o_dist: { corridas: me1.length, morderam: me1.filter((p) => p.passou).length, nomes: me1.map((p) => p.nome) },
    antigas_que_o_bloco_tocou: { corridas: lista.length, morderam: lista.filter((p) => p.passou).length, nomes: lista.map((p) => p.nome) },
    da_amarra: { corridas: amarra.length, morderam: amarra.filter((p) => p.passou).length, nomes: amarra.map((p) => p.nome) },
    das_frases: frases ? { corridas: frases.totais.plantas, morderam: frases.totais.plantas_que_morderam } : null,
  }, 'os registos que as plantas escreveram: plantas/plantas-portoes-me1.json, plantas/plantas-portoes-lista.json, plantas/plantas-da-amarra.json, frases/conferencia-das-frases.json, e PLANTAS_DO_METODO de scripts/lugares-ia-do-portao.mjs');
  if (frases) medida('frases_do_mandato_no_metodo', { paragrafos: frases.totais.paragrafos, por_edicao: Object.fromEntries(Object.entries(frases.edicoes).map(([l, e]) => [l, e.paragrafos])), diferencas: frases.totais.diferencas },
    'node design/especime-v3/medicoes/me1-2026-10-15/conferir-frases.mjs dist <frases-do-mandato.json> design/especime-v3/medicoes/me1-2026-10-15/frases',
    { o_que: 'uma palavra trocada em cada secção é recusada nessa secção', encontrado: frases.totais.plantas === frases.totais.plantas_que_morderam && frases.totais.plantas > 0 });
}
{
  const pasta = path.join(RAIZ, 'design/especime-v3/capturas/me1-2026-10-15');
  const recibos = fs.existsSync(pasta) ? fs.readdirSync(pasta).filter((d) => fs.existsSync(path.join(pasta, d, 'capturas.json'))) : [];
  const valor = {};
  for (const d of recibos) {
    const r = JSON.parse(fs.readFileSync(path.join(pasta, d, 'capturas.json'), 'utf8'));
    valor[d] = { capturas: r.resultados.length, recortes: r.resultados.reduce((n, x) => n + x.recortes.length, 0), falhas: r.falhas.length, ok: r.ok, cabeca: r.cabeca,
      sem_transbordo: r.resultados.filter((x) => x.documento <= x.janela).length };
  }
  medida('capturas', valor, 'os capturas.json de design/especime-v3/capturas/me1-2026-10-15/*/, escritos por scripts/leituras/captar.mjs');
}
{
  const codigo = (f) => (fs.existsSync(path.join(AQUI, f)) ? Number(fs.readFileSync(path.join(AQUI, f), 'utf8').trim()) : null);
  const cabeca = (f) => (fs.existsSync(path.join(AQUI, f)) ? fs.readFileSync(path.join(AQUI, f), 'utf8').trim() : null);
  medida('portoes', { build: codigo('portoes/build.codigo'), verify: codigo('portoes/verify.codigo'), typecheck: codigo('portoes/typecheck.codigo'),
    cabeca: cabeca('portoes/cabeca'), cabeca_fim: cabeca('portoes/cabeca.fim'),
    me1_23: { build: codigo('portoes-me1-23/build.codigo'), verify: codigo('portoes-me1-23/verify.codigo'), typecheck: codigo('portoes-me1-23/typecheck.codigo'), cabeca: cabeca('portoes-me1-23/cabeca') },
    passagem_depois_da_leitura: { build: codigo('passagem-depois-da-leitura/portoes/build.codigo'), verify: codigo('passagem-depois-da-leitura/portoes/verify.codigo'), typecheck: codigo('passagem-depois-da-leitura/portoes/typecheck.codigo'), cabeca: cabeca('passagem-depois-da-leitura/portoes/cabeca') },
    passagem_do_me1_21: { build: codigo('passagem-do-me1-21/portoes/build.codigo'), verify: codigo('passagem-do-me1-21/portoes/verify.codigo'), typecheck: codigo('passagem-do-me1-21/portoes/typecheck.codigo'), cabeca: cabeca('passagem-do-me1-21/portoes/cabeca') },
    passagem_de_correcao: { build: codigo('passagem-de-correcao/portoes/build.codigo'), verify: codigo('passagem-de-correcao/portoes/verify.codigo'), typecheck: codigo('passagem-de-correcao/portoes/typecheck.codigo'), cabeca: cabeca('passagem-de-correcao/portoes/cabeca') },
    primeira_passagem: { build: codigo('primeira-passagem/portoes/build.codigo'), verify: codigo('primeira-passagem/portoes/verify.codigo'), typecheck: codigo('primeira-passagem/portoes/typecheck.codigo'), cabeca: cabeca('primeira-passagem/portoes/cabeca') },
    partida: { build: codigo('partida/portoes/build.codigo'), verify: codigo('partida/portoes/verify.codigo'), typecheck: codigo('partida/portoes/typecheck.codigo'), cabeca: cabeca('partida/portoes/cabeca') },
    motor: { check_series: codigo('motor/check-series.codigo'), check_cruzamento_com_origem: codigo('motor/check-cruzamento.codigo'), cabeca: cabeca('motor/cabeca') } },
  'os ficheiros .codigo que scripts/leituras/portoes.sh escreveu em portoes/, portoes-me1-23/, passagem-depois-da-leitura/portoes/, passagem-do-me1-21/portoes/, passagem-de-correcao/portoes/, primeira-passagem/portoes/ e partida/portoes/, e os de motor/, escritos depois de cada processo acabar');
}
{
  /* Na passagem do ME1-21 não correram outra vez as conferências com o motor, a régua das frases, os resumos do
     marcador nem as capturas: correram em 93a884f6, e o livro-razão e as páginas construídas não mudaram. */
  /* Só na passagem do ME1-21, que tem a comparação do dist/ ao lado (hoje em passagem-do-me1-21/); as passagens
     que tiram as capturas e correm as conferências outra vez não precisam dela. */
  const d = leJson('dist-comparado.json');
  if (d) medida('dist_desde_a_cabeca_da_correcao', { antes: d.antes, agora: d.agora, iguais: d.iguais, diferentes: d.diferentes,
    paginas_html_diferentes: d.paginas_html_diferentes, so_antes: d.so_antes, so_agora: d.so_agora }, d.comando, d.conhecido_positivo);
  if (d) {
  const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const mudados = git('diff', '--name-only', '93a884f6', VERSAO.commit, '--', 'src/', 'ledger/');
  const naCorrecao = git('diff', '--name-only', '99b572ec', '93a884f6', '--', 'src/', 'ledger/');
  medida('fontes_das_paginas_desde_a_cabeca_da_correcao', { de: '93a884f6', ate: VERSAO.commit, ficheiros: mudados.length, lista: mudados },
    'git diff --name-only 93a884f6 <cabeça do dist> -- src/ ledger/',
    { o_que: 'o mesmo comando entre a cabeça da primeira passagem e a da correção lista os ficheiros de src/ que a passagem de correção mudou', ficheiros: naCorrecao.length, lista: naCorrecao, encontrado: naCorrecao.length > 0 });
  }
}

const saida = { medido_em: new Date().toISOString(), cabeca_do_dist: VERSAO.commit, construido_em: VERSAO.construido_em, medidas };
fs.writeFileSync(path.join(AQUI, 'medidas.json'), JSON.stringify(saida, null, 1) + '\n');
for (const [k, v] of Object.entries(medidas)) console.log(`${k}: ${JSON.stringify(v.valor).slice(0, 220)}`);
const semPositivo = Object.entries(medidas).filter(([, v]) => v.conhecido_positivo && v.conhecido_positivo.encontrado === false);
if (semPositivo.length) { console.log('CONHECIDOS-POSITIVOS QUE FALHARAM:', semPositivo.map(([k]) => k).join(', ')); process.exitCode = 1; }
