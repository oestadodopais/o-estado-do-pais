#!/usr/bin/env node
/**
 * PP1 · AS MEDIDAS DO RELATÓRIO (28.09.2026), escritas por guião: nenhum número do relatório sem
 * ficheiro. Cada medida traz o nome, o valor, o comando que a mede e um conhecido-positivo (o mesmo
 * detetor corrido sobre uma entrada cuja resposta se sabe), para que um zero não seja cegueira.
 *
 * Lê a construção da cabeça (`dist/`), a primeira página congelada da cabeça de partida
 * (`paginas-antes/`), os manifestos das capturas e os registos das plantas e das medições desta pasta,
 * o inventário das frases e o diff do ramo. Escreve `medidas.json` nesta pasta.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/medidas.mjs [cabeça de partida]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { ENTRADAS, CARTOES_FORA_DAS_ENTRADAS } from '../../../../src/data/primeira-pagina.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const DIST = path.join(RAIZ, 'dist');
const PASTA = 'design/especime-v3/medicoes/pp1-2026-09-28';
const PARTIDA = process.argv[2] ?? '1cbdb8c4';
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).trim();
const ler = (/** @type {string} */ f) => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const json = (/** @type {string} */ f) => JSON.parse(ler(f));
const doc = (/** @type {string} */ f) => parse(ler(f));
const normal = (/** @type {unknown} */ s) => String(s ?? '').replace(/\s+/g, ' ').trim();
/** @type {any[]} */
const medidas = [];
/** @param {string} nome @param {unknown} valor @param {string} comando @param {string} o_que @param {boolean} encontrado */
const medida = (nome, valor, comando, o_que, encontrado) => medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });

/* 1 · A PRIMEIRA PÁGINA, ANTES E DEPOIS. O antes é a página congelada da cabeça de partida; o depois é a
   página congelada pelo captor depois (`paginas-depois/`, com o sha256 de cada uma no manifesto das
   capturas). Os mesmos detetores nas duas. */
const congelada = (/** @type {string} */ rota) => `${PASTA}/paginas-depois/${rota.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '_')}${rota === '/' ? '' : '_'}index.html`;
const antesPt = doc(`${PASTA}/paginas-antes/index.html`);
const depoisPt = doc(congelada('/'));
const depoisEn = doc(congelada('/en/'));
const cartoes = (/** @type {any} */ r) => r.querySelectorAll('main [data-cartao-medida], main [data-cartao-camaras]').length;
const brief = json('design/observatorio/medidas/BRIEF-PP1.json').medidas;
const doBrief = (/** @type {string} */ n) => brief.find((/** @type {any} */ m) => m.nome === n)?.valor;
medida('cartoes_na_primeira_pagina_antes', cartoes(antesPt), `${PASTA}/paginas-antes/index.html · main [data-cartao-medida], main [data-cartao-camaras]`,
  'o mesmo detetor conta na página de antes os cartões que o §0 do brief contou (cartoes_na_primeira_pagina)', cartoes(antesPt) === doBrief('cartoes_na_primeira_pagina'));
medida('cartoes_na_primeira_pagina_depois', cartoes(depoisPt), `${PASTA}/paginas-depois/index.html · o mesmo seletor`, 'o mesmo detetor conta os cartões da página de antes', cartoes(antesPt) > 0);
const temas = (/** @type {any} */ r) => r.querySelectorAll('main [data-tema]').length;
medida('temas_na_primeira_pagina_antes', temas(antesPt), `${PASTA}/paginas-antes/index.html · main [data-tema]`, 'o §0 do brief contou os mesmos temas (temas_na_primeira_pagina)', temas(antesPt) === doBrief('temas_na_primeira_pagina'));
medida('temas_na_primeira_pagina_depois', temas(depoisPt), `${PASTA}/paginas-depois/index.html · main [data-tema]`, 'o mesmo detetor vê os temas da página de antes', temas(antesPt) > 0);
const leitura = (/** @type {any} */ r) => r.querySelectorAll('main [data-leitura-pais]').length;
medida('leitura_do_pais_na_primeira_pagina_antes', leitura(antesPt), `${PASTA}/paginas-antes/index.html · main [data-leitura-pais]`, 'a página de antes tem a leitura', leitura(antesPt) === 1);
medida('leitura_do_pais_na_primeira_pagina_depois', leitura(depoisPt), `${PASTA}/paginas-depois/index.html · main [data-leitura-pais]`, 'o mesmo detetor vê a leitura na página de antes', leitura(antesPt) === 1);
const mudancas = (/** @type {any} */ r) => r.querySelectorAll('main [data-mudou-ambito] li').length;
medida('mudancas_na_primeira_pagina_antes', mudancas(antesPt), `${PASTA}/paginas-antes/index.html · main [data-mudou-ambito] li`, 'o §0 do brief contou as mesmas mudanças (mudancas_na_primeira_pagina)', mudancas(antesPt) === doBrief('mudancas_na_primeira_pagina'));
medida('mudancas_na_primeira_pagina_depois', mudancas(depoisPt), `${PASTA}/paginas-depois/index.html · o mesmo seletor`, 'o mesmo detetor vê as mudanças da página de antes', mudancas(antesPt) > 0);
const valoresPresos = git('ls-tree', '--name-only', 'HEAD', '--', 'src/components/inicio/LeituraDoPais.astro');
medida('componente_da_leitura_do_pais_na_cabeca', valoresPresos === '' ? 0 : 1, 'git ls-tree --name-only HEAD -- src/components/inicio/LeituraDoPais.astro',
  'o mesmo comando encontra o componente na cabeça de partida', git('ls-tree', '--name-only', PARTIDA, '--', 'src/components/inicio/LeituraDoPais.astro') !== '');
/* A lista das linhas da leitura sai com ela, salvo se outra página a usar (o §2, ponto 3, do brief): quem
   a importa, pela árvore da cabeça. */
const usamALista = git('grep', '-l', 'LINHAS_DA_LEITURA_DO_PAIS', 'HEAD', '--', 'src').split('\n').filter(Boolean).map((l) => l.replace(/^HEAD:/, ''));
medida('ficheiros_que_usam_as_linhas_da_leitura_do_pais', usamALista, 'git grep -l LINHAS_DA_LEITURA_DO_PAIS HEAD -- src',
  'o mesmo comando encontra a lista no componente da leitura na cabeça de partida', git('grep', '-l', 'LINHAS_DA_LEITURA_DO_PAIS', PARTIDA, '--', 'src/components/inicio/LeituraDoPais.astro') !== '');
const blocos = (/** @type {any} */ r) => r.querySelectorAll('main [data-o-que-se-passa] [data-bloco]').length;
const sintetico = parse('<main><section data-o-que-se-passa><section data-bloco="a"></section><section data-bloco="b"></section></section></main>');
medida('blocos_na_primeira_pagina_pt', blocos(depoisPt), `${PASTA}/paginas-depois/index.html · main [data-o-que-se-passa] [data-bloco]`, 'o mesmo detetor conta dois blocos numa página de prova com dois', blocos(sintetico) === 2);
medida('blocos_na_primeira_pagina_en', blocos(depoisEn), `${PASTA}/paginas-depois/en_index.html · o mesmo seletor`, 'o mesmo detetor conta dois blocos numa página de prova com dois', blocos(sintetico) === 2);
const entradas = (/** @type {any} */ r) => r.querySelectorAll('main [data-entradas] li[data-entrada]').length;
medida('entradas_na_primeira_pagina_pt', entradas(depoisPt), `${PASTA}/paginas-depois/index.html · main [data-entradas] li[data-entrada]`, 'as declarações têm as mesmas entradas', entradas(depoisPt) === ENTRADAS.length);
medida('entradas_na_primeira_pagina_en', entradas(depoisEn), `${PASTA}/paginas-depois/en_index.html · o mesmo seletor`, 'as declarações têm as mesmas entradas', entradas(depoisEn) === ENTRADAS.length);
/* As palavras antes do primeiro título, pela regra do §0 (o texto que abre a página antes do primeiro
   h2), sem o rótulo de inteligência artificial, que é a divulgação que a lei põe no topo de cada página. */
function antesDoPrimeiroTitulo(/** @type {any} */ r) {
  const main = r.querySelector('main');
  const partes = [];
  let parou = false;
  const anda = (/** @type {any} */ n) => {
    if (parou) return;
    if (n.nodeType === 1 && /^h2$/i.test(n.rawTagName ?? '')) { parou = true; return; }
    if (n.nodeType === 1 && (n.getAttribute?.('data-rotulo-ia') || /^(script|style)$/i.test(n.rawTagName ?? ''))) return;
    if (n.nodeType === 3) { partes.push(n.text); return; }
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(main);
  return normal(partes.join(' ')).split(' ').filter((w) => /\w/.test(w)).length;
}
medida('palavras_antes_do_primeiro_titulo_depois', antesDoPrimeiroTitulo(depoisPt), `${PASTA}/paginas-depois/index.html · o texto de main antes do primeiro h2, sem o rótulo de IA`,
  'o mesmo detetor conta as palavras antes do primeiro título na página de antes', antesDoPrimeiroTitulo(antesPt) > 0);
medida('palavras_antes_do_primeiro_titulo_antes', antesDoPrimeiroTitulo(antesPt), `${PASTA}/paginas-antes/index.html · o mesmo detetor`,
  'a página de antes abre com a leitura do país antes do primeiro título', antesDoPrimeiroTitulo(antesPt) > 0);

/* 2 · AS CINCO PÁGINAS DAS ENTRADAS, E OS CARTÕES DELAS CONTRA A PÁGINA DOS TEMAS. */
const novas = ENTRADAS.filter((e) => !('existente' in e && e.existente));
const paginasDasEntradas = novas.flatMap((e) => [e.rota.pt, e.rota.en]).filter((r) => fs.existsSync(path.join(DIST, r.replace(/^\//, ''), 'index.html')));
medida('paginas_das_entradas_construidas', paginasDasEntradas.length, 'dist/<rota de cada entrada>/index.html, nas duas edições', 'as declarações têm cinco entradas novas, nas duas edições', novas.length * 2 === paginasDasEntradas.length);
const cartoesDe = (/** @type {string} */ rota) => doc(rota === '/temas/' ? 'dist/temas/index.html' : congelada(rota)).querySelectorAll('main article.cartao-medida[data-cartao-medida], main article[data-cartao-camaras]').map((a) => a.getAttribute('data-cartao-medida') ?? 'camaras');
const dosTemas = cartoesDe('/temas/');
const nasEntradas = novas.flatMap((e) => cartoesDe(e.rota.pt));
medida('cartoes_da_pagina_dos_temas', dosTemas.length, 'dist/temas/index.html · main article.cartao-medida[data-cartao-medida], main article[data-cartao-camaras]', 'a taxa de emprego é um deles', dosTemas.includes('taxa-de-emprego-2025'));
medida('cartoes_nas_paginas_das_entradas', nasEntradas.length, 'o mesmo seletor nas cinco páginas das entradas congeladas em paginas-depois/, edição portuguesa', 'a pensão média está numa delas', nasEntradas.includes('pensao-media-anual-2025'));
medida('cartoes_repetidos_nas_entradas', nasEntradas.length - new Set(nasEntradas).size, 'as mesmas contas · as ocorrências a mais', 'o mesmo contador vê uma repetição numa lista com um nome duas vezes', ['a', 'b', 'a'].length - new Set(['a', 'b', 'a']).size === 1);
const foraDasEntradas = dosTemas.filter((c) => !nasEntradas.includes(c));
medida('cartoes_dos_temas_fora_das_entradas', foraDasEntradas.length, 'os cartões da página dos temas que nenhuma entrada rende', 'o fora declarado é o índice da dívida', foraDasEntradas.every((c) => c in CARTOES_FORA_DAS_ENTRADAS || c === 'camaras'));
for (const e of novas) {
  const n = doc(congelada(e.rota.pt)).querySelectorAll('#estudos-da-entrada [data-estudo]').length;
  medida(`estudos_da_entrada_${e.id}`, n, `${congelada(e.rota.pt)} · #estudos-da-entrada [data-estudo]`, 'a lista dos estudos recentes da primeira página tem estudos pelo mesmo seletor', depoisPt.querySelectorAll('#trabalhos [data-estudo]').length > 0);
}

/* 3 · O TESTE DE ACEITAÇÃO E AS ALTURAS, DOS MANIFESTOS DAS CAPTURAS. */
const capAntes = json(`${PASTA}/capturas-antes.json`);
const capDepois = json(`${PASTA}/capturas-depois.json`);
const res = (/** @type {any} */ c, /** @type {string} */ fam, /** @type {string} */ l, /** @type {number} */ w, t = 'light') => c.resultados.find((/** @type {any} */ r) => r.familia === fam && r.lingua === l && r.largura === w && r.tema === t);
for (const l of ['pt', 'en']) {
  medida(`altura_da_primeira_pagina_390_${l}_antes`, res(capAntes, 'pais', l, 390)?.altura, `${PASTA}/capturas-antes.json · resultados[pais, ${l}, 390, claro].altura`, 'o manifesto de antes tem a captura', Boolean(res(capAntes, 'pais', l, 390)));
  medida(`altura_da_primeira_pagina_390_${l}_depois`, res(capDepois, 'pais', l, 390)?.altura, `${PASTA}/capturas-depois.json · o mesmo campo`, 'o manifesto de depois tem a captura', Boolean(res(capDepois, 'pais', l, 390)));
  const a = res(capDepois, 'pais', l, 390)?.aceitacao ?? {};
  for (const k of ['fundo_do_titulo_px', 'fundo_da_data_px', 'fundo_da_fonte_do_primeiro_bloco_px', 'fundo_da_fonte_do_segundo_bloco_px', 'limite_px']) {
    medida(`aceitacao_390_${l}_${k}`, a[k], `${PASTA}/capturas-depois.json · resultados[pais, ${l}, 390, claro].aceitacao.${k}`, 'o mesmo manifesto diz o segundo bloco inteiro nos dois ecrãs', a.segundo_bloco_inteiro === true);
  }
}
medida('capturas_depois', capDepois.resultados.length, `${PASTA}/capturas-depois.json · resultados`, 'o manifesto diz a aceitação passada', capDepois.aceitacao?.passou === true);
medida('capturas_depois_com_deslocamento', capDepois.resultados.filter((/** @type {any} */ r) => r.deslocamento > 0).length, `${PASTA}/capturas-depois.json · resultados com deslocamento > 0`, 'o manifesto de antes mediu o deslocamento de cada captura', capAntes.resultados.every((/** @type {any} */ r) => typeof r.deslocamento === 'number'));

/* 4 · O INVENTÁRIO DAS FRASES. */
const inventario = ler('design/especime-v3/INVENTARIO-FRASES.md').split('\n').map((l) => l.split(' | ')).filter((c) => c.length === 5 && c[2] === 'pp1');
medida('inventario_linhas_pp1_vivas', inventario.filter((c) => c[3] === 'viva').length, 'design/especime-v3/INVENTARIO-FRASES.md · as linhas com o bloco pp1 e o estado viva', 'a linha «O que se passa» é uma delas', inventario.some((c) => c[1] === 'O que se passa'));
medida('inventario_linhas_pp1_retiradas', inventario.filter((c) => c[3] === 'retirada').length, 'o mesmo ficheiro · as linhas com o bloco pp1 e o estado retirada', 'a descrição antiga da primeira página é uma delas', inventario.some((c) => c[3] === 'retirada' && c[1].startsWith('A leitura do país e os números oficiais por tema')));

/* As linhas que saíram do ficheiro: as que a cabeça de partida tinha, pelo texto, e esta árvore não tem. */
const linhasDoInventario = (/** @type {string} */ t) => new Set(t.split('\n').map((l) => l.split(' | ')).filter((c) => c.length === 5 && c[0].startsWith('| ')).map((c) => c[1]));
const antesDoInventario = linhasDoInventario(git('show', `${PARTIDA}:design/especime-v3/INVENTARIO-FRASES.md`));
const agoraDoInventario = linhasDoInventario(ler('design/especime-v3/INVENTARIO-FRASES.md'));
const sairam = [...antesDoInventario].filter((t) => !agoraDoInventario.has(t));
medida('inventario_linhas_que_sairam_do_ficheiro', sairam.length, `git show ${PARTIDA}:design/especime-v3/INVENTARIO-FRASES.md contra a árvore · os textos das linhas que já não estão`,
  'a linha da frase do veredicto estava na cabeça de partida', [...antesDoInventario].some((t) => t.startsWith('Em , Portugal ficou fora de')));
medida('inventario_linhas_que_sairam_do_ficheiro_textos', sairam, 'os mesmos textos', 'a lista é a do contador acima', true);

/* 5 · AS PLANTAS E AS MEDIÇÕES DESTA PASTA. */
const plantas = (/** @type {string} */ f, /** @type {(j: any) => any[]} */ lista) => { const j = json(`${PASTA}/${f}`); return lista(j); };
for (const [nome, f, lista, passou] of /** @type {[string, string, (j: any) => any[], (x: any) => boolean][]} */ ([
  ['plantas_da_primeira_pagina', 'plantas-primeira-pagina.json', (j) => j.plantas, (x) => x.mordeu],
  ['plantas_da_geometria', 'plantas-geometria.json', (j) => j.plantas, (x) => x.mordeu],
  ['plantas_dos_sinais', 'plantas-sinais.json', (j) => j.plantas, (x) => x.passou],
  ['plantas_da_porta', 'plantas-porta.json', (j) => j.filter((/** @type {any} */ x) => /^planta-|^reposicao-/.test(x.id)), (x) => x.passou],
  ['plantas_do_pais', 'plantas-pais.json', (j) => j, (x) => x.passou],
  ['plantas_do_veredicto', 'plantas-veredicto.json', (j) => j, (x) => x.passou],
  ['plantas_das_camaras', 'plantas-camaras.json', (j) => j, (x) => x.passou],
  ['plantas_da_l1_b2', 'plantas-l1-b2.json', (j) => j, (x) => x.passou],
  ['plantas_dos_portoes', 'plantas-portoes-lista.json', (j) => j, (x) => x.passou],
])) {
  const l = plantas(f, lista);
  medida(`${nome}_corridas`, l.length, `${PASTA}/${f}`, 'o registo tem pelo menos uma planta', l.length > 0);
  medida(`${nome}_mordidas`, l.filter(passou).length, `${PASTA}/${f} · as que morderam como esperado`, 'o mesmo contador vê uma que não mordeu numa lista de prova', [{ mordeu: false, passou: false }].filter(passou).length === 0);
}
/* As plantas da régua dos alvos correm por estrago (`--so`), cada uma uma passagem inteira; o registo
   que a régua escreve traz o caminho da construção, que é da máquina, e por isso fica fora da árvore e
   este guião lê-o de lá (`OEDP_ALVOS_JSON`, os ficheiros separados por vírgulas) e guarda só o que cada
   planta fez. */
const alvos = (process.env.OEDP_ALVOS_JSON ?? '').split(',').filter(Boolean).flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')).plantas ?? []);
medida('plantas_dos_alvos_corridas', alvos.length, 'node tests/acessibilidade/alvos.mjs --vermelhos --so <estrago> --json <ficheiro fora da árvore>, para «b1» e «bloco-sem-classe»', 'o registo tem as duas plantas do bloco', alvos.some((/** @type {any} */ x) => String(x.nome).startsWith('bloco-sem-classe')) && alvos.some((/** @type {any} */ x) => String(x.nome).startsWith('b1')));
medida('plantas_dos_alvos_mordidas', alvos.filter((/** @type {any} */ x) => x.bom).length, 'os mesmos registos · bom (o HTML mudou e caíram as células nomeadas)', 'o mesmo contador vê uma que não caiu numa lista de prova', [{ bom: false }].filter((x) => x.bom).length === 0);
for (const x of alvos) medida(`planta_dos_alvos_${String(x.nome).split(' ')[0]}`, x.caiu, 'os mesmos registos · as células que caíram', `a planta nomeia ${x.celulas.join(', ')}`, x.nomeadas?.length === x.celulas.length);
const porta = json(`${PASTA}/plantas-porta.json`);
medida('celulas_da_porta', porta.length, `${PASTA}/plantas-porta.json`, 'a célula P1 da edição portuguesa está lá', porta.some((/** @type {any} */ x) => x.id === 'P1.pt'));
medida('celulas_da_porta_verdes', porta.filter((/** @type {any} */ x) => x.passou).length, `${PASTA}/plantas-porta.json · passou`, 'o mesmo contador conta as falhadas numa lista de prova', [{ passou: false }].filter((x) => x.passou).length === 0);
const l1 = json(`${PASTA}/l1-pp1.json`);
for (const [k, v] of Object.entries(l1.contagens)) medida(`l1_${k}`, v, `${PASTA}/l1-pp1.json · contagens.${k}`, 'a composição leu as duas cabeças', Boolean(l1.cabeca_antes && l1.cabeca_depois));
const revisto = json(`${PASTA}/valor-revisto.json`);
medida('valor_revisto_partida_codigo', revisto.partida.codigo, `${PASTA}/valor-revisto.json · partida.codigo (revisão A)`, 'na cabeça de partida a construção parou com a frase da leitura', revisto.partida.mordeu === true);
medida('valor_revisto_bloco_A_codigo', revisto.bloco_A.codigo, `${PASTA}/valor-revisto.json · bloco_A.codigo`, 'na cabeça do bloco a revisão A chega ao cartão da entrada da casa', revisto.bloco_A.valor_da_planta_no_cartao_da_entrada_da_casa === true);
medida('valor_revisto_bloco_A_blocos_mostrados', revisto.bloco_A.sinais.blocos_mostrados, `${PASTA}/valor-revisto.json · bloco_A.sinais.blocos_mostrados`, 'o registo dos sinais foi escrito', Array.isArray(revisto.bloco_A.sinais.saidas));
medida('valor_revisto_bloco_B_codigo', revisto.bloco_B.codigo, `${PASTA}/valor-revisto.json · bloco_B.codigo, e o passo em bloco_B.passo`, 'na revisão B a peça saiu e o sinal nomeia-a', revisto.bloco_B.a_peca_saiu_com_o_sinal === true);
medida('valor_revisto_bloco_B_saidas', revisto.bloco_B.sinais.saidas?.length, `${PASTA}/valor-revisto.json · bloco_B.sinais.saidas`, 'a saída é a peça dos preços das casas', revisto.bloco_B.sinais.saidas?.some((/** @type {any} */ x) => x.peca === 'precos-das-casas'));

/* 6 · O QUE NENHUM FICHEIRO DO RAMO PODE TER: um caminho da máquina ou o nome do utilizador dela, e um
   travessão em prosa nova. O detetor corre primeiro sobre uma linha de prova que tem cada coisa. */
/* Os ficheiros do ramo: os que o diff da cabeça nomeia, mais os que estão na árvore e ainda não entraram
   num commit (este guião corre antes do commit que traz o relatório, e o relatório também se lê). */
const porCommitar = git('status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean).map((l) => l.slice(3).trim()).filter((f) => !f.startsWith('dist/'));
const ficheiros = [...new Set([...git('diff', '--name-only', `${PARTIDA}..HEAD`).split('\n').filter(Boolean), ...porCommitar])].filter((f) => fs.existsSync(path.join(RAIZ, f)) && fs.statSync(path.join(RAIZ, f)).isFile());
const utilizador = os.userInfo().username;
const MAQUINA = [new RegExp(`/(?:Users|home)/${utilizador.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`), new RegExp(`\\b${utilizador.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`), /\/private\/(?:tmp|var)\//, /\/var\/folders\//];
const temMaquina = (/** @type {string} */ t) => MAQUINA.some((re) => re.test(t));
const comMaquina = ficheiros.filter((f) => !/\.png$/.test(f) && temMaquina(fs.readFileSync(path.join(RAIZ, f), 'utf8')));
medida('ficheiros_do_ramo_lidos', ficheiros.length, `git diff --name-only ${PARTIDA}..HEAD, e git status --porcelain --untracked-files=all`, 'os ficheiros lidos incluem o relatório do bloco', ficheiros.some((f) => f.endsWith(`${PASTA}/LEIA-ME.md`)));
medida('ficheiros_do_ramo_com_caminho_da_maquina_lista', comMaquina, 'os mesmos · os nomes dos que têm', 'a lista é a do detetor abaixo', true);
medida('ficheiros_do_ramo_com_caminho_da_maquina', comMaquina.length, 'os mesmos ficheiros (sem as imagens) · o diretório do utilizador, o nome do utilizador e as pastas temporárias do sistema',
  'o detetor apanha uma linha de prova com o diretório do utilizador', temMaquina(`/${'Users'}/${utilizador}/exemplo`));
const acrescentadas = git('diff', '-U0', `${PARTIDA}..HEAD`, '--', '*.md', '*.mjs', '*.astro', '*.css', '*.py').split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++'));
const TRAVESSAO = /[—–]/;
medida('linhas_acrescentadas_com_travessao', acrescentadas.filter((l) => TRAVESSAO.test(l)).length, `git diff -U0 ${PARTIDA}..HEAD nos ficheiros de prosa e de código · as linhas acrescentadas com um travessão`,
  'o detetor apanha uma linha de prova com um travessão', TRAVESSAO.test('uma frase — com travessão'));
medida('linhas_acrescentadas', acrescentadas.length, 'o mesmo diff · as linhas acrescentadas', 'o diff leu linhas', acrescentadas.length > 0);
/* Cada linha com travessão, pela sua classe: um literal de um excerto do livro-razão, copiado como a fonte
   o escreve (a regra da casa), ou o detetor de travessões e as plantas que o provam. Outra classe seria
   prosa nova com travessão, e tem de ser zero. */
const comTravessao = acrescentadas.filter((l) => TRAVESSAO.test(l));
const classe = (/** @type {string} */ l) => (/L\('[a-z0-9-]+', 'excerpt', '[^']*[\u2014\u2013][^']*'\)/.test(l) ? 'literal_do_excerpt' : /TRAVESSAO|travessão|\[\u2014\u2013\]/.test(l) ? 'detetor_ou_planta' : 'prosa');
const porClasse = { literal_do_excerpt: 0, detetor_ou_planta: 0, prosa: 0 };
for (const l of comTravessao) porClasse[/** @type {'literal_do_excerpt'|'detetor_ou_planta'|'prosa'} */ (classe(l))]++;
medida('linhas_acrescentadas_com_travessao_por_classe', porClasse, 'as mesmas linhas · pela classe: um literal L(linha, \'excerpt\', …) da auditoria, o detetor e as suas plantas, ou prosa',
  'o classificador diz prosa a uma frase com travessão', classe('+ uma frase \u2014 de prosa') === 'prosa');

const saida = { o_que_e: 'As medidas do relatório do bloco PP1, escritas por este guião.', comando: `node ${PASTA}/medidas.mjs ${PARTIDA}`, cabeca: git('rev-parse', 'HEAD'), dist_construido_de: JSON.parse(ler('dist/version.json')).commit, medidas };
fs.writeFileSync(path.join(AQUI, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const semPositivo = medidas.filter((m) => !m.conhecido_positivo.encontrado);
console.log(`medidas · ${medidas.length} medidas escritas; ${semPositivo.length} sem o conhecido-positivo encontrado${semPositivo.length ? `: ${semPositivo.map((m) => m.nome).join(', ')}` : ''}.`);
if (semPositivo.length) process.exitCode = 1;
