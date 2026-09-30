/** UE1d: as medidas da passagem da §1.140 e das definições, cada uma com o comando e um conhecido-positivo,
 * em medidas-ue1d.json.
 *
 * Não lê a rede. Lê os registos dos portões em `portoes/ue1d/`, o `dist/` construído da cabeça do código da
 * passagem, as declarações (a fonte única das ressalvas, as definições das medidas, a primeira página), os
 * manifestos das plantas (`plantas-ue1d.json`), das capturas (`capturas-ue1d.json`) e das conferências entre
 * os commits (`entre-commits-ue1d.json`), a saída do `conferir-mapa.py`, e o `git` deste repositório. Com o
 * caminho da worktree do motor como argumento, lê também a cabeça dele (e não o escreve).
 *
 * O que se mede aqui com código próprio, e não pelo portão que o protege: os cartões e os recibos da medida
 * com a União e a ressalva, contados num varrimento do `dist/` inteiro; a definição de cada recibo das séries,
 * refeita a partir da declaração; e a ressalva da primeira página, comparada, carácter a carácter, com o texto
 * que o commit base tinha no bloco `casa`.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/medir-ue1d.mjs [<worktree do motor>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { FIGURAS, DEFINICOES_DAS_MEDIDAS, ORIGENS_DAS_DEFINICOES } from '../../../../src/data/figuras.mjs';
import { RESSALVAS_DA_UNIAO } from '../../../../src/data/ressalvas-da-uniao.mjs';
import { BLOCOS_DA_PRIMEIRA_PAGINA } from '../../../../src/data/primeira-pagina.mjs';
import * as LEITURA from '../../../../src/lib/leitura-da-medida.mjs';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const aqui = (f) => path.join(RAIZ, PASTA, f);
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
const BASE = '42a368a3';
const CABECA = fs.readFileSync(aqui('portoes/ue1d/build.cabeca'), 'utf8').trim();
const ID = 'sobrecarga-do-custo-da-habitacao-2025';
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const texto = (e) => (e ? e.text.replace(/\s+/g, ' ').trim() : '');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const pagina = (rel) => parse(fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8'));

/* ------------------------------------------------------------ os portões */
const log = (g) => fs.readFileSync(aqui(`portoes/ue1d/${g}.log`), 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = Number(fs.readFileSync(aqui(`portoes/ue1d/${g}.codigo`), 'utf8').trim());
  const cab = fs.readFileSync(aqui(`portoes/ue1d/${g}.cabeca`), 'utf8').trim();
  const ini = Date.parse(fs.readFileSync(aqui(`portoes/ue1d/${g}.inicio`), 'utf8').trim());
  const fim = Date.parse(fs.readFileSync(aqui(`portoes/ue1d/${g}.fim`), 'utf8').trim());
  medida(`codigo_do_${g}`, codigo, `cat ${PASTA}/portoes/ue1d/${g}.codigo`, `o registo da corrida é desta cabeça (${cab.slice(0, 8)})`, cab === CABECA);
  medida(`segundos_do_${g}`, Math.round((fim - ini) / 1000), `${PASTA}/portoes/ue1d/${g}.fim menos ${g}.inicio`, 'as duas horas leram-se', Number.isFinite(fim - ini));
}
/* A primeira corrida dos portões, na cabeça de17f63e, antes do quarto commit de código. */
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = Number(fs.readFileSync(aqui(`portoes/ue1d-de17f63e/${g}.codigo`), 'utf8').trim());
  const cab = fs.readFileSync(aqui(`portoes/ue1d-de17f63e/${g}.cabeca`), 'utf8').trim();
  medida(`primeira_corrida_codigo_do_${g}`, codigo, `cat ${PASTA}/portoes/ue1d-de17f63e/${g}.codigo`, `o registo da corrida é da cabeça de17f63e (${cab.slice(0, 8)})`, cab.startsWith('de17f63e'));
}
const guiao = JSON.parse(fs.readFileSync(aqui('portoes/ue1d-de17f63e/guiao-dos-portoes.json'), 'utf8'));
medida('guiao_dos_portoes_linhas_de_codigo_mudadas', guiao.linhas_de_codigo_diferentes, `${PASTA}/portoes/ue1d-de17f63e/guiao-dos-portoes.json, escrito por guiao-dos-portoes-ue1d.mjs`, `as linhas de comentário diferem (${guiao.linhas_de_comentario_diferentes})`, guiao.linhas_de_comentario_diferentes > 0);
medida('guiao_dos_portoes_sha256_do_que_correu', guiao.sha256_do_que_correu, 'o mesmo', 'o sha256 do ramo é outro', guiao.sha256_do_ramo !== guiao.sha256_do_que_correu);
const guiaoAgora = createHash('sha256').update(fs.readFileSync(aqui('portao-ue1d.sh'))).digest('hex');
medida('guiao_dos_portoes_sha256_do_ramo', guiaoAgora, `shasum -a 256 ${PASTA}/portao-ue1d.sh`, 'é o sha256 que o manifesto do guião registou para o ramo', guiaoAgora === guiao.sha256_do_ramo);
const espera = fs.readFileSync(aqui('portoes/ue1d/espera.log'), 'utf8').split('\n').filter(Boolean);
const ensaio = fs.readFileSync(aqui('portoes/ue1d-de17f63e/espera-ensaio.txt'), 'utf8');
const vistosNoEnsaio = Number((/ensaio: (\d+) processo\(s\)/.exec(ensaio) ?? [])[1] ?? NaN);
medida('portoes_que_esperaram_antes_de_correr', espera.length, `as linhas de ${PASTA}/portoes/ue1d/espera.log, uma por portão`, `o detetor da espera, em ensaio, viu ${vistosNoEnsaio} processo(s) de construção de outra árvore a correr (${PASTA}/portoes/ue1d-de17f63e/espera-ensaio.txt)`, vistosNoEnsaio > 0);
const k14 = /a União com a ressalva \(K14\): cartões e recibos\s+(\d+) · (\d+)/.exec(log('verify'));
medida('k14_cartoes_com_a_uniao_e_a_ressalva', k14 ? Number(k14[1]) : null, 'a linha da K14 no verify.log', 'a linha existe', k14);
medida('k14_recibos_com_a_uniao_e_a_ressalva', k14 ? Number(k14[2]) : null, 'o mesmo', 'a linha existe', k14);
const k17 = /leituras dos cartões nacionais \(K17\)\s+(\d+) em (\d+) cartões \([^)]*?(\d+) de (\d+) plantas a morder\)/.exec(log('verify'));
medida('k17_cartoes_com_leitura', k17 ? Number(k17[1]) : null, 'a linha da K17 no verify.log', 'a linha existe', k17);
medida('k17_plantas_a_morder', k17 ? Number(k17[3]) : null, 'o mesmo', 'a linha existe', k17);
medida('k17_plantas', k17 ? Number(k17[4]) : null, 'o mesmo', 'a linha existe', k17);
const prova = /prova: (\d+) estragos plantados, (\d+) vistos/.exec(log('verify'));
medida('prova_do_check_cartao_estragos_plantados', prova ? Number(prova[1]) : null, 'a linha «prova:» do check:cartao no verify.log', 'a linha existe', prova);
medida('prova_do_check_cartao_estragos_vistos', prova ? Number(prova[2]) : null, 'o mesmo', 'a linha existe', prova);
const html = /UE1d: (\d+) definição\(ões\) declarada\(s\) nos recibos das séries/.exec(log('build'));
medida('portao_html_definicoes_declaradas', html ? Number(html[1]) : null, 'a parte «UE1d:» da linha do gate:html no build.log', 'a linha existe', html);

/* ------------------------------------------------------------ o dist/ da cabeça */
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist/version.json'), 'utf8'));
medida('dist_da_cabeca', versao.commit === CABECA, 'dist/version.json contra portoes/ue1d/build.cabeca', 'o carimbo tem um commit', /^[0-9a-f]{40}$/.test(versao.commit));

/* Todas as páginas do dist/ que levam a linha da União desta medida, classificadas pelo que são. */
const todas = [];
const anda = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) anda(p);
    else if (e.name === 'index.html') todas.push(path.relative(path.join(RAIZ, 'dist'), p));
  }
};
anda(path.join(RAIZ, 'dist'));
const comLinhaUe = todas.filter((rel) => fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8').includes(`data-claim="${ID}-ue"`)).sort();
const classe = (rel) => {
  if (rel === 'index.html' || rel === 'en/index.html') return 'primeira página';
  if (rel === 'livro-razao/index.html' || rel === 'en/ledger/index.html') return 'índice do livro-razão';
  if (rel === `livro-razao/${ID}-ue/index.html` || rel === `en/ledger/${ID}-ue/index.html`) return 'recibo da própria linha da União';
  if (rel === `livro-razao/${ID}/index.html` || rel === `en/ledger/${ID}/index.html`) return 'recibo da linha';
  return pagina(rel).querySelector(`[data-cartao-medida="${ID}"] [data-claim="${ID}-ue"]`) ? 'cartão' : 'outra';
};
const porClasse = {};
for (const rel of comLinhaUe) (porClasse[classe(rel)] ??= []).push(rel);
medida('paginas_com_a_linha_da_uniao_da_medida', comLinhaUe.length, `as páginas do dist/ com data-claim="${ID}-ue", num varrimento de todas as ${todas.length}`, 'o mesmo varrimento acha a página portuguesa dos temas', comLinhaUe.includes('temas/index.html'));
medida('paginas_com_a_linha_da_uniao_por_classe', Object.fromEntries(Object.entries(porClasse).map(([k, v]) => [k, v.length])), 'o mesmo, por classe (primeira página, índice, recibo da própria linha da União, recibo da linha, cartão, outra)', 'nenhuma página ficou por classificar', !porClasse.outra);

/* Os cartões da medida, em todo o dist/, com a União e com a ressalva (contados sem a K14). */
const ressalvaDe = (lang) => RESSALVAS_DA_UNIAO[ID][lang];
let cartoesComUniao = 0;
let cartoesComUniaoEComRessalva = 0;
const cartoesSemRessalva = [];
const cartoesComRessalvaSemUniao = [];
let detetorNoutraMedida = 0;
for (const rel of todas) {
  const bruto = fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8');
  if (!bruto.includes('data-cartao-medida=')) continue;
  const lang = rel.startsWith('en/') ? 'en' : 'pt';
  const r = parse(bruto);
  for (const c of r.querySelectorAll(`[data-cartao-medida="${ID}"]`)) {
    const uniao = c.querySelectorAll('[data-regua="ue"]').length + c.querySelectorAll(`[data-claim="${ID}-ue"]`).length + c.querySelectorAll('[data-faixa-ue]').length > 0;
    if (!uniao) {
      if (c.querySelectorAll(`[data-ressalva-da-uniao="${ID}"]`).length) cartoesComRessalvaSemUniao.push(rel);
      continue;
    }
    cartoesComUniao++;
    const rs = c.querySelectorAll(`[data-ressalva-da-uniao="${ID}"]`);
    if (rs.length === 1 && texto(rs[0]) === ressalvaDe(lang)) cartoesComUniaoEComRessalva++;
    else cartoesSemRessalva.push(rel);
  }
  if (rel === 'temas/index.html') {
    const d = r.querySelector('[data-cartao-medida="divida-publica-2025"]');
    detetorNoutraMedida = d ? d.querySelectorAll('[data-regua="ue"]').length + d.querySelectorAll('[data-claim="divida-publica-2025-ue"]').length + d.querySelectorAll('[data-faixa-ue]').length : 0;
  }
}
medida('cartoes_da_medida_com_a_uniao', cartoesComUniao, `os cartões [data-cartao-medida="${ID}"] de todo o dist/ com a régua da União, a linha da União ou a faixa`, 'o mesmo detetor vê a União no cartão da dívida da página dos temas', detetorNoutraMedida > 0);
medida('cartoes_da_medida_com_a_uniao_e_a_ressalva', cartoesComUniaoEComRessalva, 'o mesmo, os que têm uma ressalva e com o texto da fonte única na língua da página', 'há pelo menos um cartão com a União', cartoesComUniao > 0);
medida('cartoes_da_medida_com_a_uniao_sem_a_ressalva', cartoesSemRessalva.length, 'o mesmo, os que não a têm', 'há pelo menos um cartão com a União', cartoesComUniao > 0);
medida('cartoes_da_medida_com_a_ressalva_sem_a_uniao', cartoesComRessalvaSemUniao.length, 'o mesmo varrimento, os cartões da medida com a ressalva e sem a União à vista', 'há pelo menos um cartão da medida com a ressalva', cartoesComUniaoEComRessalva > 0);
const ressalvasForaDaMedida = todas.reduce((n, rel) => {
  const bruto = fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8');
  return n + (bruto.match(/data-ressalva-da-uniao="(?!sobrecarga-do-custo-da-habitacao-2025")[^"]*"/g) ?? []).length;
}, 0);
medida('ressalvas_da_uniao_de_outras_medidas', ressalvasForaDaMedida, 'as marcas data-ressalva-da-uniao de qualquer outra medida, em todo o dist/', 'o mesmo varrimento acha as desta medida na página dos temas', fs.readFileSync(path.join(RAIZ, 'dist/temas/index.html'), 'utf8').includes(`data-ressalva-da-uniao="${ID}"`));

/* Os recibos: o da linha (com a União no enquadramento) e o da série. */
const recibos = [];
for (const [lang, rel] of [['pt', `livro-razao/${ID}/index.html`], ['en', `en/ledger/${ID}/index.html`]]) {
  const r = pagina(rel);
  const uniao = r.querySelectorAll(`#enquadramento [data-claim="${ID}-ue"]`).length > 0;
  const rs = r.querySelectorAll(`[data-ressalva-da-uniao="${ID}"]`);
  recibos.push({ rel, uniao, ressalva: rs.length === 1 && texto(rs[0]) === ressalvaDe(lang) });
}
for (const [lang, rel] of [['pt', `livro-razao/series/${ID}-paises/index.html`], ['en', `en/ledger/series/${ID}-paises/index.html`]]) {
  const r = pagina(rel);
  const rs = r.querySelectorAll(`[data-ressalva-da-uniao="${ID}"]`);
  recibos.push({ rel, uniao: r.querySelectorAll(`[data-ponto="${ID}-paises#EU27_2020"]`).length > 0, ressalva: rs.length === 1 && texto(rs[0]) === ressalvaDe(lang) });
}
medida('recibos_da_medida_com_a_uniao_e_a_ressalva', recibos.filter((x) => x.uniao && x.ressalva).length, 'o recibo da linha (com a linha da União no enquadramento) e o recibo da série, nas duas edições, com a ressalva da fonte única', 'o recibo português da linha tem a linha da União no enquadramento', recibos[0].uniao);
const idsSeries = fs.readdirSync(path.join(RAIZ, 'dist/livro-razao/series')).filter((x) => !x.startsWith('.')).sort();
const seriesComRessalva = idsSeries.flatMap((s) => [`livro-razao/series/${s}/index.html`, `en/ledger/series/${s}/index.html`]).filter((rel) => pagina(rel).querySelector('[data-ressalva-da-uniao]'));
medida('recibos_de_serie_com_ressalva', seriesComRessalva.length, 'os 20 recibos das séries com uma marca data-ressalva-da-uniao', 'o da sobrecarga no total, em português, tem', seriesComRessalva.includes(`livro-razao/series/${ID}-paises/index.html`));
/* A primeira página: o bloco `casa` diz a ressalva da mesma fonte. */
const casa = BLOCOS_DA_PRIMEIRA_PAGINA.find((b) => b.id === 'casa');
medida('primeira_pagina_le_a_fonte_unica', casa?.ressalva === RESSALVAS_DA_UNIAO[ID], 'src/data/primeira-pagina.mjs, o bloco casa, ressalva, contra RESSALVAS_DA_UNIAO (o mesmo objeto)', 'o bloco casa existe e tem ressalva', casa?.ressalva);
const base = git('show', `${BASE}:src/data/primeira-pagina.mjs`);
const iCasa = base.indexOf("id: 'casa'");
const trecho = base.slice(base.indexOf('ressalva: {', iCasa), base.indexOf('ressalva: {', iCasa) + 600);
const pt0 = (/pt: '([^']*)'/.exec(trecho) ?? [])[1];
const en0 = (/en: '([^']*)'/.exec(trecho) ?? [])[1];
medida('ressalva_igual_a_do_commit_base', pt0 === RESSALVAS_DA_UNIAO[ID].pt && en0 === RESSALVAS_DA_UNIAO[ID].en, `git show ${BASE}:src/data/primeira-pagina.mjs, o bloco casa, os dois textos da ressalva, contra a fonte única, carácter a carácter`, 'os dois textos do commit base leram-se', pt0 && en0);
const baseLeituras = git('show', `${BASE}:src/data/leituras-das-medidas.mjs`);
const frasePtAntiga = (/' (Este total mistura[^']*)'/.exec(baseLeituras) ?? [])[1] ?? null;
const fraseEnAntiga = (/' (This total mixes[^']*)'/.exec(baseLeituras) ?? [])[1] ?? null;
medida('ressalva_da_leitura_antiga_pt_igual_a_da_fonte', frasePtAntiga === RESSALVAS_DA_UNIAO[ID].pt, `a frase da ressalva que fechava a leitura portuguesa do cartão em ${BASE} contra o texto português da fonte única`, 'a frase antiga leu-se', frasePtAntiga);
medida('ressalva_da_leitura_antiga_en', fraseEnAntiga, `a frase da ressalva que fechava a leitura inglesa do cartão em ${BASE}`, 'a frase antiga leu-se', fraseEnAntiga);
medida('ressalva_da_leitura_antiga_en_igual_a_da_fonte', fraseEnAntiga === RESSALVAS_DA_UNIAO[ID].en, 'a mesma frase contra o texto inglês da fonte única (o do bloco casa da primeira página)', 'a frase antiga leu-se', fraseEnAntiga);
const naPrimeira = [['pt', 'index.html'], ['en', 'en/index.html']].filter(([lang, rel]) => fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8').includes(ressalvaDe(lang))).length;
medida('primeiras_paginas_com_a_ressalva', naPrimeira, 'dist/index.html e dist/en/index.html com o texto da ressalva na língua da página', 'o texto da ressalva tem mais de 40 letras', ressalvaDe('pt').length > 40);

/* O cartão da página dos temas: a régua, a leitura, e os valores da linha. */
const valorDaLinha = (id) => String(load(fs.readFileSync(path.join(RAIZ, 'ledger/claims', `${id}.yml`), 'utf8')).value);
const vPt = valorDaLinha(ID);
const vUe = valorDaLinha(`${ID}-ue`);
medida('valor_de_portugal_da_sobrecarga_no_total', vPt, `ledger/claims/${ID}.yml, value`, 'a linha leu-se', vPt.length > 0);
medida('valor_da_uniao_da_sobrecarga_no_total', vUe, `ledger/claims/${ID}-ue.yml, value`, 'a linha leu-se', vUe.length > 0);
const COMPARA = {
  pt: /(Está (acima|abaixo|ao nível) da média da União Europeia|É (maior do que na|menor do que na|igual à da) média da União Europeia|A variação é (maior|menor) do que a da (média da )?União Europeia|A variação é igual à da (média da )?União Europeia)/,
  en: /(Above|Below|Level with) the European Union average|It is (wider|narrower) than the European Union average|It is the same as the European Union average|The change is (larger|smaller) than the European Union|The change is the same as the European Union/,
};
const DEZ = ['divida-publica-2025', 'ihpc-variacao-homologa', 'taxa-de-emprego-2025', 'taxa-de-desemprego-mip-2025', 'desemprego-de-longa-duracao-2025', 'risco-de-pobreza-ou-exclusao-2025', 'racio-s80-s20-2025', ID, 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', 'precos-da-habitacao-2025'];
for (const [lang, rel] of [['pt', 'temas/index.html'], ['en', 'en/themes/index.html']]) {
  const r = pagina(rel);
  const c = r.querySelector(`[data-cartao-medida="${ID}"]`);
  const regua = texto(c.querySelector('.cartao-medida-regua'));
  const leitura = texto(c.querySelector('[data-cartao-leitura]'));
  const nomeUe = lang === 'pt' ? 'União Europeia' : 'European Union';
  medida(`regua_do_cartao_com_a_uniao_${lang}`, regua, `o texto da régua do cartão da sobrecarga no total, em ${rel}`, `a régua diz «${nomeUe}» e o valor da linha da União`, regua.includes(nomeUe) && regua.includes(vUe));
  const fecho = lang === 'pt' ? 'Está abaixo da média da União Europeia.' : 'Below the European Union average.';
  medida(`leitura_do_cartao_acaba_na_comparacao_${lang}`, leitura.endsWith(fecho), `a leitura do cartão da sobrecarga no total, em ${rel}, acaba em «${fecho}»`, 'a leitura do cartão da dívida tem uma comparação com a União pelo mesmo detetor', COMPARA[lang].test(texto(r.querySelector('[data-cartao-medida="divida-publica-2025"] [data-cartao-leitura]'))));
  medida(`leitura_do_cartao_sem_a_ressalva_${lang}`, !leitura.includes(ressalvaDe(lang)), `a leitura do cartão da sobrecarga no total, em ${rel}, sem o texto da ressalva (que tem o seu bloco)`, 'o texto da ressalva está no cartão, no seu bloco', texto(c.querySelector(`[data-ressalva-da-uniao="${ID}"]`)) === ressalvaDe(lang));
  const com = DEZ.filter((id) => COMPARA[lang].test(texto(r.querySelector(`[data-cartao-medida="${id}"] [data-cartao-leitura]`))));
  medida(`cartoes_com_a_comparacao_com_a_uniao_${lang}`, com.length, `as leituras dos dez cartões na página dos temas (${lang}) com a frase da comparação com a União`, 'a da dívida tem', com.includes('divida-publica-2025'));
}
const numero = Number(vPt.replace(',', '.'));
const numeroUe = Number(vUe.replace(',', '.'));
medida('portugal_abaixo_da_uniao_pelos_valores_da_linha', numero < numeroUe, `${vPt} contra ${vUe}, as duas linhas do livro-razão`, 'os dois valores são números', Number.isFinite(numero) && Number.isFinite(numeroUe));

/* A declaração: a decisão que calava a média saiu, e a regra do corte também. */
const comSilencio = FIGURAS.filter((f) => Object.prototype.hasOwnProperty.call(f, 'semMediaEuropeia')).length;
const baseFiguras = git('show', `${BASE}:src/data/figuras.mjs`);
medida('figuras_com_a_media_europeia_calada', comSilencio, 'as entradas de FIGURAS com a propriedade semMediaEuropeia', `o commit base tinha a declaração (git show ${BASE}:src/data/figuras.mjs)`, /semMediaEuropeia:\s*\{/.test(baseFiguras));
const baseLeitura = git('show', `${BASE}:src/lib/leitura-da-medida.mjs`);
medida('regra_do_corte_exportada', Object.prototype.hasOwnProperty.call(LEITURA, 'definicaoDaMedida'), 'src/lib/leitura-da-medida.mjs exporta definicaoDaMedida?', `o commit base exportava-a (git show ${BASE}:src/lib/leitura-da-medida.mjs)`, /export function definicaoDaMedida/.test(baseLeitura));
let usos = '';
try { usos = git('grep', '-n', 'definicaoDaMedida(', CABECA, '--', 'src', 'scripts', 'tests'); } catch { usos = ''; }
let usosNaBase = '';
try { usosNaBase = git('grep', '-n', 'definicaoDaMedida(', BASE, '--', 'src', 'scripts', 'tests'); } catch { usosNaBase = ''; }
medida('chamadas_da_regra_do_corte', usos.split('\n').filter(Boolean).length, `git grep -n "definicaoDaMedida(" <cabeça> -- src scripts tests`, `o mesmo comando acha as chamadas no commit base (${usosNaBase.split('\n').filter(Boolean).length})`, usosNaBase.split('\n').filter(Boolean).length > 0);

/* Os comentários que citam a §1.124: os que falam do silêncio da média dizem agora a §1.140. */
const citam = (commit, sec) => { try { return git('grep', '-l', sec, commit, '--', 'src', 'tests', 'scripts').split('\n').filter(Boolean).map((l) => l.replace(`${commit}:`, '')); } catch { return []; } };
const com1124 = citam(CABECA, '1\\.124');
const com1140 = new Set(citam(CABECA, '1\\.140'));
const so1124 = com1124.filter((f) => !com1140.has(f));
const base1124 = citam(BASE, '1\\.124');
medida('ficheiros_que_citam_a_1124', com1124.length, 'git grep -l "1\\.124" <cabeça> -- src tests scripts', `o mesmo comando no commit base acha ${base1124.length} ficheiro(s), entre eles src/data/figuras.mjs`, base1124.includes('src/data/figuras.mjs'));
medida('ficheiros_que_citam_a_1124_e_a_1140', com1124.filter((f) => com1140.has(f)), 'os mesmos, que citam também a §1.140', 'o mesmo', base1124.includes('src/data/figuras.mjs'));
medida('ficheiros_que_citam_so_a_1124_conta', so1124.length, 'os ficheiros que citam a §1.124 e não a §1.140', 'o mesmo', base1124.includes('src/data/figuras.mjs'));
medida('ficheiros_que_citam_so_a_1124', so1124, 'os mesmos, que não citam a §1.140 (e citam a §1.124 por outra decisão dessa entrada)', 'o mesmo', base1124.includes('src/data/figuras.mjs'));

/* As definições dos recibos das séries, refeitas da declaração. */
const declarada = (id, lang) => {
  const partes = DEFINICOES_DAS_MEDIDAS[id]?.[lang];
  if (!Array.isArray(partes)) return null;
  let t = '';
  for (const p of partes) {
    if (typeof p === 'string') t += p;
    else if (p && typeof p === 'object' && 'nl' in p) t += String(p.nl);
    else return null;
  }
  return norm(t);
};
const linhaDaSerie = (s) => String(load(fs.readFileSync(path.join(RAIZ, 'ledger/series', `${s}.yml`), 'utf8')).linha_de_portugal);
const definicoes = [];
for (const s of idsSeries) {
  for (const [lang, rel] of [['pt', `livro-razao/series/${s}/index.html`], ['en', `en/ledger/series/${s}/index.html`]]) {
    const d = pagina(rel).querySelectorAll('[data-serie-o-que-conta]');
    const esperada = declarada(linhaDaSerie(s), lang);
    definicoes.push({ rel, uma: d.length === 1, igual: d.length === 1 && esperada !== null && texto(d[0]) === esperada });
  }
}
const outraDefinicao = declarada('divida-publica-2025', 'pt');
const textoDaPobreza = texto(pagina('livro-razao/series/risco-de-pobreza-ou-exclusao-2025-paises/index.html').querySelector('[data-serie-o-que-conta]'));
medida('recibos_de_serie', definicoes.length, 'os recibos das séries no dist/, nas duas edições', 'o do rácio S80/S20 está entre eles', definicoes.some((x) => x.rel.includes('racio-s80-s20-2025-paises')));
medida('recibos_de_serie_com_a_definicao_declarada', definicoes.filter((x) => x.igual).length, 'os recibos com uma [data-serie-o-que-conta] cujo texto é a definição de DEFINICOES_DAS_MEDIDAS da medida portuguesa da série, refeita aqui (as cadeias e os «nl», com o espaço normalizado)', 'a comparação falha quando devia: a definição da dívida não é o texto do recibo da pobreza', outraDefinicao !== textoDaPobreza && outraDefinicao !== null);
medida('recibo_do_racio_s80_s20_com_a_definicao', definicoes.filter((x) => x.rel.includes('racio-s80-s20-2025-paises') && x.igual).length, 'o mesmo, os dois recibos do rácio S80/S20 (que na UE1c não tinham a frase)', 'a declaração do rácio existe nas duas línguas', declarada('racio-s80-s20-2025', 'pt') && declarada('racio-s80-s20-2025', 'en'));

/* A origem de cada uma das dez definições: declarada, e se o recibo da série a rende. */
const origensDe = (id) => (DEFINICOES_DAS_MEDIDAS[id]?.origens ?? []).map((k) => ORIGENS_DAS_DEFINICOES[k]).filter(Boolean);
const dezLinhas = idsSeries.map(linhaDaSerie);
const comOrigem = dezLinhas.filter((id) => origensDe(id).length > 0 && origensDe(id).every((o) => o.url && o.lido && o.excerto && o.documento));
medida('definicoes_das_dez_com_origem_declarada', comOrigem.length, 'as definições das dez medidas das séries com pelo menos uma origem em ORIGENS_DAS_DEFINICOES, cada uma com o documento, o endereço, a data de leitura e o excerto', 'uma chave inventada não está em ORIGENS_DAS_DEFINICOES', !('uma-origem-inventada' in ORIGENS_DAS_DEFINICOES));
/* A origem rendida é a peça `OrigemDaDefinicao` (a marca `data-def-origem`, com o documento, o excerto e a
   data de leitura). O nome do documento sozinho não serve de detetor: em 6 recibos ele coincide com o título do
   conjunto de dados do Eurostat que a proveniência da série cita. */
const recibosComOrigem = idsSeries.flatMap((sid) => [`livro-razao/series/${sid}/index.html`, `en/ledger/series/${sid}/index.html`].filter((rel) => pagina(rel).querySelectorAll('[data-def-origem]').length > 0));
const foraDosPaineis = 'ihpc-variacao-homologa';
const origemNoReciboDaLinha = pagina(`livro-razao/${foraDosPaineis}/index.html`).querySelectorAll('[data-def-origem]').length > 0;
const foraDosPaineisDasSeries = dezLinhas.filter((id) => !FIGURAS.some((f) => f.claim === id));
medida('medidas_das_series_fora_dos_paineis', foraDosPaineisDasSeries.length, 'as 10 medidas das séries que não estão em FIGURAS (as únicas cujo recibo da linha rende a definição com a origem, pela OrigemDaDefinicao da LinhaView)', 'a dívida pública está em FIGURAS', FIGURAS.some((f) => f.claim === 'divida-publica-2025'));
medida('medidas_das_series_fora_dos_paineis_lista', foraDosPaineisDasSeries, 'o mesmo, os nomes', 'o mesmo', FIGURAS.some((f) => f.claim === 'divida-publica-2025'));
medida('recibos_de_serie_que_rendem_a_origem_da_definicao', recibosComOrigem.length, 'os 20 recibos das séries com a peça da origem da definição (a marca data-def-origem, com o documento, o excerto e a data de leitura)', `o mesmo detetor acha a origem da definição no recibo da linha de uma medida fora dos painéis (${foraDosPaineis}), onde a LinhaView a rende`, origemNoReciboDaLinha);

/* ------------------------------------------------------------ o ponto 3: o texto de uma medida da UE1b */
const b0 = JSON.parse(git('show', `HEAD:${PASTA}/medidas-ue1b.json`));
const b1 = JSON.parse(fs.readFileSync(aqui('medidas-ue1b.json'), 'utf8'));
const diferencas = [];
const compara = (a, b, onde) => {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) { diferencas.push(onde); return; }
  if (a && typeof a === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) compara(a[k], b[k], `${onde}.${k}`);
  } else if (a !== b) diferencas.push(onde);
};
compara(b0, b1, 'medidas-ue1b');
const letras0 = b0.medidas.find((m) => m.nome === 'letras_cruas_nas_faixas');
const letras1 = b1.medidas.find((m) => m.nome === 'letras_cruas_nas_faixas');
medida('medidas_ue1b_campos_mudados', diferencas.length, `os campos de ${PASTA}/medidas-ue1b.json que diferem da versão do último commit`, 'o comando da versão do commit dizia «doze páginas»', /doze páginas/.test(letras0?.comando ?? ''));
medida('medidas_ue1b_comando_novo', letras1?.comando ?? null, 'o mesmo, o comando da medida letras_cruas_nas_faixas', 'o campo mudado é esse comando', diferencas.length === 1 && /letras_cruas|\.medidas\.\d+\.comando$/.test(diferencas[0]));
medida('medidas_ue1b_valor', letras1?.valor ?? null, 'o mesmo, o valor da medida letras_cruas_nas_faixas', `o valor do commit era ${letras0?.valor}`, letras0 && letras1 && letras0.valor === letras1.valor);

/* ------------------------------------------------------------ plantas, capturas, entre commits, mapa */
const plantas = JSON.parse(fs.readFileSync(aqui('plantas-ue1d.json'), 'utf8'));
medida('plantas', plantas.plantas, `${PASTA}/plantas-ue1d.json`, 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_que_morderam', plantas.mordidas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_da_ressalva', plantas.plantas_por_grupo?.ressalva ?? 0, 'o mesmo, o grupo da ressalva', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_da_definicao', plantas.plantas_por_grupo?.definicao ?? 0, 'o mesmo, o grupo da definição', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_dos_tipos', plantas.plantas_por_grupo?.tipos ?? 0, 'o mesmo, o grupo do typecheck', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_repostas_pelo_sha256', plantas.repostas_com_o_mesmo_sha256, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas', plantas.corridas_limpas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas_a_zero', plantas.corridas_limpas_a_zero, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
const primeira = JSON.parse(fs.readFileSync(aqui('plantas-ue1d-primeira.json'), 'utf8'));
medida('plantas_primeira_corrida', primeira.plantas, `${PASTA}/plantas-ue1d-primeira.json (a corrida na cabeça de17f63e)`, 'o manifesto é da cabeça de17f63e', primeira.cabeca.startsWith('de17f63e'));
medida('plantas_primeira_corrida_que_morderam', primeira.mordidas, 'o mesmo', 'o manifesto é da cabeça de17f63e', primeira.cabeca.startsWith('de17f63e'));
const rebentou = primeira.resultados.find((r) => !r.passou);
const saidaRebentou = rebentou ? fs.readFileSync(path.join(RAIZ, rebentou.saida), 'utf8') : '';
medida('plantas_primeira_corrida_a_que_rebentou', rebentou?.nome ?? null, 'o mesmo, a planta que não mordeu com a queixa esperada', 'a saída dela tem o TypeError do construtor da prova', /TypeError: Cannot read properties of undefined \(reading 'pt'\)/.test(saidaRebentou));
const capturas = JSON.parse(fs.readFileSync(aqui('capturas-ue1d.json'), 'utf8'));
const dasCapturas = capturas.cabeca_esperada === CABECA && capturas.plantas_vistas === capturas.plantas.length && capturas.plantas.length > 0;
medida('capturas', capturas.capturas, `${PASTA}/capturas-ue1d.json`, 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
for (const [t, n] of Object.entries(capturas.capturas_por_tipo)) medida(`capturas_${t.replaceAll('-', '_')}`, n, 'o mesmo, por tipo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_com_problema', capturas.problemas.length, 'o mesmo', 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
medida('capturas_plantas', capturas.plantas.length, 'o mesmo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_plantas_vistas', capturas.plantas_vistas, 'o mesmo', 'o manifesto tem plantas', capturas.plantas.length > 0);
medida('capturas_pedidos_para_fora', capturas.pedidos_recusados_para_fora, 'o mesmo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
const entre = JSON.parse(fs.readFileSync(aqui('entre-commits-ue1d.json'), 'utf8'));
medida('conferencias_entre_commits', entre.corridas, `${PASTA}/entre-commits-ue1d.json`, entre.conhecido_positivo.o_que, entre.conhecido_positivo.codigo_inexistente_nulo && entre.conhecido_positivo.mapa_antes_com_perdidas);
medida('conferencias_entre_commits_a_zero', entre.corridas_a_zero, 'o mesmo', entre.conhecido_positivo.o_que, entre.conhecido_positivo.codigo_inexistente_nulo);
medida('plantas_antes_do_quarto_commit_que_morderam', entre.plantas_antes_do_commit_que_morderam, 'o mesmo, as duas plantas da declaração corridas à mão antes do commit 99b9f73a', 'o mesmo', entre.conhecido_positivo.codigo_inexistente_nulo);
medida('mapa_do_quarto_commit_sem_citacoes_perdidas', entre.mapa_do_commit_99b9f73a_sem_citacoes_perdidas, 'o mesmo, o conferir-mapa antes do commit 99b9f73a', 'o registo tinha as contas', (entre.mapa_do_commit_99b9f73a?.contas?.conferidas_na_linha_citada ?? 0) > 0);
medida('conferencias_do_estado_completo', entre.estado_completo.corridas.length, 'o mesmo, as do estado completo antes da partição', 'o mesmo', entre.conhecido_positivo.codigo_inexistente_nulo);
medida('conferencias_do_estado_completo_que_falharam', entre.estado_completo.corridas.filter((c) => c.codigo !== 0).length, 'o mesmo, as que falharam (e o que as resolveu está ao lado)', 'o mesmo', entre.conhecido_positivo.codigo_inexistente_nulo);
medida('mapa_antes_da_emenda_citacoes_perdidas', entre.mapa.antes_da_emenda.contas.nao_encontradas, 'o mesmo, a corrida do conferir-mapa antes da emenda do mapa', 'o registo tinha as contas', entre.mapa.antes_da_emenda.contas.conferidas_na_linha_citada > 0);
medida('mapa_ue1c_citacoes_no_sitio', entre.ue1c_mapa.contas.conferidas_na_linha_citada, 'o mesmo, a corrida do mapa antes do commit do mapa da UE1c, lida agora do registo', 'o registo tinha as contas', entre.ue1c_mapa.contas.conferidas_na_linha_citada > 0);
medida('mapa_ue1c_citacoes_perdidas', entre.ue1c_mapa.contas.nao_encontradas + entre.ue1c_mapa.contas.no_ficheiro_mas_longe + entre.ue1c_mapa.contas.para_la_do_fim, 'o mesmo', 'o registo tinha as contas', entre.ue1c_mapa.contas.conferidas_na_linha_citada > 0);
const mapa = execFileSync('python3', ['scripts/leituras/conferir-mapa.py', 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'], { cwd: RAIZ, encoding: 'utf8' });
const nMapa = (re) => Number((re.exec(mapa) ?? [])[1] ?? NaN);
medida('mapa_citacoes_no_sitio', nMapa(/citações conferidas na linha citada \(±7\): (\d+)/), 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'a linha existe', /citações conferidas na linha citada/.test(mapa));
medida('mapa_citacoes_longe', nMapa(/longe da linha citada: (\d+)/), 'o mesmo', 'a linha existe', /longe da linha citada: \d+/.test(mapa));
medida('mapa_citacoes_por_encontrar', nMapa(/não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'o mesmo', 'a linha existe', /não encontrada em nenhum/.test(mapa));
medida('mapa_linhas_para_la_do_fim', nMapa(/linha citada para lá do fim do ficheiro: (\d+)/), 'o mesmo', 'a linha existe', /para lá do fim do ficheiro: \d+/.test(mapa));

/* ------------------------------------------------------------ o que mudou e o que não podia mudar */
const mudadas = (caminhos) => git('diff', '--name-only', BASE, CABECA, '--', ...caminhos).split('\n').filter(Boolean);
const todasMudadas = mudadas(['.']);
const controlo = todasMudadas.includes('src/views/SerieView.astro');
medida('ficheiros_mudados_pela_passagem', todasMudadas.length, `git diff --name-only ${BASE} <cabeça>`, 'o mesmo comando vê o recibo da série mudado', controlo);
medida('ficheiros_mudados_pela_passagem_lista', todasMudadas, 'o mesmo, os nomes', 'o mesmo', controlo);
medida('linhas_do_livro_mudadas', mudadas(['ledger/claims']).length, `git diff --name-only ${BASE} <cabeça> -- ledger/claims`, 'o mesmo comando vê o recibo da série mudado', controlo);
medida('series_do_livro_mudadas', mudadas(['ledger/series', 'ledger/cruzamentos', 'src/data/paises-da-uniao.json']).length, 'o mesmo, sobre as séries, os registos e a tabela dos nomes', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('definicoes_das_medidas_mudadas', git('diff', BASE, CABECA, '--', 'src/data/figuras.mjs').split('\n').filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l) && /DEFINICOES_DAS_MEDIDAS|ORIGENS_DAS_DEFINICOES/.test(l)).length, `as linhas do diff de src/data/figuras.mjs entre ${BASE} e a cabeça que tocam DEFINICOES_DAS_MEDIDAS ou ORIGENS_DAS_DEFINICOES`, 'o mesmo diff tem linhas (as da semMediaEuropeia)', git('diff', BASE, CABECA, '--', 'src/data/figuras.mjs').includes('semMediaEuropeia'));
medida('brief_mudado', mudadas(['design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md']).length, 'o mesmo, sobre o brief', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('acertos_l1_mudado', mudadas(['design/especime-v3/medicoes/l1-2026-09-24']).length, 'o mesmo, sobre a pasta do acertos-l1.py (fora desta passagem, pelo ponto 4)', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('guiao_da_aterragem_mudado', mudadas(['scripts/aterrar.sh']).length, 'o mesmo, sobre scripts/aterrar.sh', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('commits_de_codigo_da_passagem', Number(git('rev-list', '--count', `${BASE}..${CABECA}`)), `git rev-list --count ${BASE}..<cabeça>`, 'a base é antepassada da cabeça', git('merge-base', '--is-ancestor', BASE, CABECA) === '');
if (process.argv[2]) {
  const motor = (...a) => execFileSync('git', a, { cwd: process.argv[2], encoding: 'utf8' }).trim();
  const cab = motor('rev-parse', 'HEAD');
  medida('motor_cabeca', cab.slice(0, 7), 'git rev-parse HEAD, na worktree do motor', 'é um commit', /^[0-9a-f]{40}$/.test(cab));
  medida('motor_commits_da_passagem', Number(motor('rev-list', '--count', 'e394307..HEAD')), 'git rev-list --count e394307..HEAD, na worktree do motor', 'a cabeça do UE1 é antepassada da cabeça', motor('merge-base', '--is-ancestor', 'e394307', 'HEAD') === '');
}
const custo = JSON.parse(fs.readFileSync(aqui('custo-ue1d.json'), 'utf8'));
for (const [k, v] of Object.entries(custo.medidas)) medida(`custo_${k}`, v.valor, v.comando, v.o_que, v.encontrado);

const saida = { bloco: 'UE1d', cabeca_do_codigo: CABECA, base: BASE, guiao: `${PASTA}/medir-ue1d.mjs`, medidas };
fs.writeFileSync(aqui('medidas-ue1d.json'), JSON.stringify(saida, null, 2) + '\n');
const sem = medidas.filter((x) => !x.conhecido_positivo.encontrado);
console.log(`UE1d medidas: ${medidas.length} medida(s), ${sem.length} sem o conhecido-positivo encontrado`);
for (const x of sem) console.log(`  x ${x.nome}`);
process.exit(sem.length ? 1 : 0);
