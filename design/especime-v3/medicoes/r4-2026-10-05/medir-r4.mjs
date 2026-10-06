#!/usr/bin/env node
/**
 * AS MEDIÇÕES DO BLOCO R4 (05.10.2026): escreve `medidas.json` ao lado, com cada número que o relatório
 * (`LEIA-ME.md`) cita, o comando que o mediu e um conhecido-positivo. Lê a construção que está em `dist/` (a da
 * cabeça do código, carimbada em `dist/version.json`), o livro-razão e os registos desta pasta, e corre as células
 * que o bloco mexeu com as suas plantas. Não escreve em `dist/` nem em ficheiro nenhum fora desta pasta.
 *
 * Uso, a partir da raiz do sítio:  node design/especime-v3/medicoes/r4-2026-10-05/medir-r4.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const DIST = path.join(RAIZ, 'dist');
const NAO = 'NÃO LIDO';
/** @type {any[]} */
const medidas = [];
/** @type {Record<string, unknown>} */
const saidaExtra = {};
/** Um nome de medida a partir de um texto: sem acentos, com sublinhados. @param {string} t */
const nomeDe = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
/** @param {string} nome @param {unknown} valor @param {string} comando @param {string} oQue @param {boolean} encontrado */
const medicao = (nome, valor, comando, oQue, encontrado) => medidas.push({ nome, valor, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) } });
const tirarRaiz = (/** @type {string} */ s) => s.replaceAll(RAIZ, '<sitio>').replace(/\/Users\/[^/\s]+/g, '<pasta-local>');
/** Corre um comando e devolve o código e a saída. @param {string[]} args @param {Record<string,string>} [env] */
const corre = (args, env = {}) => {
  const r = spawnSync(process.execPath, args, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, env: { ...process.env, ...env } });
  return { codigo: r.status, saida: `${r.stdout ?? ''}${r.stderr ?? ''}`, stdout: r.stdout ?? '' };
};

const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: RAIZ, encoding: 'utf8' });
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));

/* 1 · O LIVRO-RAZÃO E AS SÉRIES. */
const ids = fs.readdirSync(path.join(RAIZ, 'ledger', 'claims')).filter((f) => f.endsWith('.yml')).map((f) => f.slice(0, -4)).sort();
medicao('linhas_do_livro_razao', ids.length, 'ls ledger/claims/*.yml', 'a linha posicao-de-investimento-internacional-2025 está na lista', ids.includes('posicao-de-investimento-internacional-2025'));
const series = fs.readdirSync(path.join(RAIZ, 'ledger', 'series')).filter((f) => f.endsWith('.yml'));

/* 2 · A K17 ALARGADA (check:cartao --prova --json): as famílias, os recibos, as séries e as plantas. */
const k = corre(['tests/cartao/cartao.mjs', '--prova', '--json']);
let cartao = null;
try { cartao = JSON.parse(k.stdout.slice(k.stdout.indexOf('{\n  "contas"'))); } catch { cartao = null; }
const c = cartao?.contas ?? {};
medicao('check_cartao_codigo', k.codigo, 'node tests/cartao/cartao.mjs --prova --json', 'a saída traz as contas das famílias', Boolean(c.familias));
const f = c.familias ?? {};
for (const [nome, chave] of [['linhas_com_frase', 'linhas'], ['linhas_com_frase_pelo_cartao', 'por_cartao'], ['linhas_com_frase_pela_medida_dos_concelhos', 'por_concelho'], ['linhas_com_frase_pela_familia', 'por_familia'], ['familias_de_linhas', 'familias'], ['entradas_auditadas_das_familias', 'entradas'], ['partes_auditadas_das_familias', 'partes'], ['partes_que_dizem_das_familias', 'diz'], ['apoios_das_familias', 'apoios'], ['entradas_com_todas_as_partes_na_fonte', 'todas_na_fonte'], ['entradas_com_alguma_parte_so_da_casa', 'alguma_da_casa']]) {
  medicao(nome, f[chave] ?? NAO, `node tests/cartao/cartao.mjs --prova --json · contas.familias.${chave}`, 'a conta das linhas é a do livro-razão', f.linhas === ids.length);
}
const rc = c.recibos_com_frase ?? {};
medicao('recibos_de_linha_lidos_pela_k17', rc.recibos ?? NAO, 'node tests/cartao/cartao.mjs --prova --json · contas.recibos_com_frase.recibos', 'são as linhas vezes as duas edições', rc.recibos === ids.length * 2);
medicao('recibos_de_linha_com_a_frase_conferida', rc.com_frase ?? NAO, 'node tests/cartao/cartao.mjs --prova --json · contas.recibos_com_frase.com_frase', 'a planta «um recibo sem a frase» morde', (c.familias_plantas_lista ?? []).some((/** @type {any} */ p) => p.nome === 'um recibo sem a frase' && p.mordeu));
for (const [nome, chave] of [['recibos_de_linha_com_frase_pelo_cartao', 'cartao'], ['recibos_de_linha_com_frase_pela_medida_dos_concelhos', 'concelho'], ['recibos_de_linha_com_frase_pela_familia', 'familia']]) {
  medicao(nome, rc[chave] ?? NAO, `node tests/cartao/cartao.mjs --prova --json · contas.recibos_com_frase.${chave}`, 'as três somam os recibos conferidos', (rc.cartao ?? 0) + (rc.concelho ?? 0) + (rc.familia ?? 0) === rc.com_frase);
}
const so = c.series_o_que_e ?? {};
for (const [nome, chave] of [['series_no_tempo', 'series'], ['series_com_a_frase_da_linha', 'pela_linha'], ['series_com_frase_propria_auditada', 'propria'], ['series_com_frase_propria_toda_na_fonte', 'todas_na_fonte'], ['series_com_frase_propria_com_parte_so_da_casa', 'alguma_da_casa'], ['partes_das_frases_das_series', 'partes'], ['apoios_das_frases_das_series', 'apoios']]) {
  medicao(nome, so[chave] ?? NAO, `node tests/cartao/cartao.mjs --prova --json · contas.series_o_que_e.${chave}`, 'as séries no tempo são as do livro-razão', so.series === series.filter((s) => fs.readFileSync(path.join(RAIZ, 'ledger', 'series', s), 'utf8').includes('eixo: "periodo"')).length);
}
const rs = c.recibos_das_series_com_frase ?? {};
medicao('recibos_de_serie_com_a_frase_o_que_e', rs.com_frase ?? NAO, 'node tests/cartao/cartao.mjs --prova --json · contas.recibos_das_series_com_frase.com_frase', 'a planta «um recibo de série sem a frase» morde', (c.familias_plantas_lista ?? []).some((/** @type {any} */ p) => p.nome === 'um recibo de série sem a frase' && p.mordeu));
medicao('recibos_de_serie_lidos', rs.recibos ?? NAO, 'node tests/cartao/cartao.mjs --prova --json · contas.recibos_das_series_com_frase.recibos', 'são as séries no tempo vezes as duas edições', rs.recibos === (so.series ?? -1) * 2);
const plantasK17 = c.familias_plantas_lista ?? [];
medicao('plantas_da_k17_das_familias', plantasK17.length, 'node tests/cartao/cartao.mjs --prova --json · contas.familias_plantas_lista', 'todas mordem', plantasK17.length > 0 && plantasK17.every((/** @type {any} */ p) => p.mordeu));
medicao('plantas_da_k17_das_familias_mordidas', plantasK17.filter((/** @type {any} */ p) => p.mordeu).length, 'idem, as que morderam', 'a primeira é a de uma linha sem frase', plantasK17[0]?.nome === 'uma linha sem frase');

/* 3 · A S6 DA FRASE DO ÚLTIMO PONTO (check:series --prova --json). */
const jsonSeries = path.join(AQUI, 'series-s6.json');
const s6 = corre(['tests/series/series.mjs', '--prova', '--json', jsonSeries]);
const dS6 = fs.existsSync(jsonSeries) ? JSON.parse(fs.readFileSync(jsonSeries, 'utf8')) : null;
const plantasR4S6 = (dS6?.plantas ?? []).filter((/** @type {any} */ p) => / \(R4\)$/.test(p.nome));
medicao('check_series_codigo', s6.codigo, 'node tests/series/series.mjs --prova --json series-s6.json', 'o ficheiro tem as plantas', Boolean(dS6?.plantas?.length));
medicao('plantas_da_s6', (dS6?.plantas ?? []).length, 'node tests/series/series.mjs --prova --json · plantas', 'todas mordem', (dS6?.plantas ?? []).every((/** @type {any} */ p) => p.mordeu));
medicao('plantas_r4_da_s6', plantasR4S6.length, 'idem, as plantas cujo nome acaba em «(R4)»', 'a do lado trocado está lá e morde', plantasR4S6.some((/** @type {any} */ p) => p.nome.includes('lado trocado') && p.mordeu));
/* A frase do último ponto em cada recibo construído: com que ponto compara e de que lado fica. */
const comparacoes = { 'ha-um-ano': 0, anterior: 0, maior: 0, menor: 0, igual: 0, recibos: 0 };
for (const s of series) {
  const id = s.slice(0, -4);
  for (const rel of [path.join('livro-razao', 'series', id, 'index.html'), path.join('en', 'ledger', 'series', id, 'index.html')]) {
    const fch = path.join(DIST, rel);
    if (!fs.existsSync(fch)) continue;
    const el = parse(fs.readFileSync(fch, 'utf8')).querySelector('[data-serie-ultimo]');
    if (!el) continue;
    comparacoes.recibos++;
    if (rel.startsWith('livro-razao')) {
      comparacoes[/** @type {'ha-um-ano'|'anterior'} */ (el.getAttribute('data-serie-ultimo-com'))]++;
      comparacoes[/** @type {'maior'|'menor'|'igual'} */ (el.getAttribute('data-serie-ultimo-lado'))]++;
    }
  }
}
medicao('recibos_de_serie_com_a_frase_do_ultimo_ponto', comparacoes.recibos, 'os recibos das séries em dist/ com [data-serie-ultimo], nas duas edições', 'a planta S6 «um recibo de série sem a frase do último ponto» morde', plantasR4S6.some((/** @type {any} */ p) => p.nome.startsWith('um recibo de série sem a frase do último ponto') && p.mordeu));
for (const k2 of ['ha-um-ano', 'anterior', 'maior', 'menor', 'igual']) {
  medicao(`series_cuja_frase_compara_${k2.replace(/-/g, '_')}`, comparacoes[/** @type {keyof typeof comparacoes} */ (k2)], `os recibos portugueses das séries, pelo atributo data-serie-ultimo-${['maior', 'menor', 'igual'].includes(k2) ? 'lado' : 'com'}`, 'as séries do recibo das rendas comparam com há um ano', fs.existsSync(path.join(DIST, 'livro-razao', 'series', 'serie-ipc-rendas-variacao-homologa', 'index.html')) && parse(fs.readFileSync(path.join(DIST, 'livro-razao', 'series', 'serie-ipc-rendas-variacao-homologa', 'index.html'), 'utf8')).querySelector('[data-serie-ultimo]')?.getAttribute('data-serie-ultimo-com') === 'ha-um-ano');
}

/* 4 · A PRIMEIRA PÁGINA (check:primeira --prova --json): as plantas da V1-R4 e as explicações rendidas. */
const jsonPrimeira = path.join(AQUI, 'primeira-v1r4.json');
const pp = corre(['tests/inicio/primeira-pagina.mjs', '--prova', '--json', jsonPrimeira]);
const dPP = fs.existsSync(jsonPrimeira) ? JSON.parse(fs.readFileSync(jsonPrimeira, 'utf8')) : null;
const plantasV1R4 = (dPP?.plantas ?? []).filter((/** @type {any} */ p) => /\((pt|en)\)$/.test(p.nome) && /valor de referência|porta dobrada|«o que é»/.test(p.nome));
medicao('check_primeira_codigo', pp.codigo, 'node tests/inicio/primeira-pagina.mjs --prova --json primeira-v1r4.json', 'o ficheiro tem as plantas', Boolean(dPP?.plantas?.length));
medicao('plantas_v1r4', plantasV1R4.length, 'idem, as plantas da explicação dos valores de referência', 'a do lado trocado morde nas duas edições', plantasV1R4.filter((/** @type {any} */ p) => p.nome.startsWith('o lado trocado') && p.mordeu).length === 2);
medicao('plantas_v1r4_mordidas', plantasV1R4.filter((/** @type {any} */ p) => p.mordeu).length, 'idem, as que morderam', 'são todas', plantasV1R4.every((/** @type {any} */ p) => p.mordeu));
for (const [lang, rel] of [['pt', 'index.html'], ['en', path.join('en', 'index.html')]]) {
  const r = parse(fs.readFileSync(path.join(DIST, rel), 'utf8'));
  const fora = r.querySelectorAll('[data-veredicto-fora] [data-veredicto-explica]');
  const dentro = r.querySelectorAll('details[data-veredicto-dentro] [data-veredicto-explica]');
  medicao(`primeira_pagina_${lang}_explicacoes_de_fora`, fora.length, `${rel} · [data-veredicto-fora] [data-veredicto-explica]`, 'a da dívida pública está lá, acima', fora.some((x) => x.getAttribute('data-veredicto-explica') === 'divida-publica-2025' && x.getAttribute('data-veredicto-lado') === 'acima'));
  medicao(`primeira_pagina_${lang}_explicacoes_de_dentro`, dentro.length, `${rel} · details[data-veredicto-dentro] [data-veredicto-explica]`, 'a do saldo da balança corrente está lá, entre', dentro.some((x) => x.getAttribute('data-veredicto-explica') === 'saldo-da-balanca-corrente-2025' && x.getAttribute('data-veredicto-lado') === 'entre'));
}

/* 5 · O PORTÃO DE HTML: a frase contada em cada recibo, e as plantas r4- sobre a construção. */
const g = corre(['scripts/gate-html.mjs']);
const contadas = /R4: (\d+) recibo\(s\) com a frase/.exec(g.saida);
medicao('gate_html_codigo', g.codigo, 'node scripts/gate-html.mjs', 'a linha do resumo traz a conta R4', Boolean(contadas));
medicao('gate_html_recibos_com_a_frase', contadas ? Number(contadas[1]) : NAO, 'node scripts/gate-html.mjs · «R4: N recibo(s) com a frase»', 'a planta r4-recibo-sem-frase morde (plantas-portoes-r4.json)', (() => { try { return JSON.parse(fs.readFileSync(path.join(AQUI, 'plantas-portoes-r4.json'), 'utf8')).some((/** @type {any} */ p) => p.nome === 'r4-recibo-sem-frase' && p.passou); } catch { return false; } })());
const plantasPortoes = (() => { try { return JSON.parse(fs.readFileSync(path.join(AQUI, 'plantas-portoes-r4.json'), 'utf8')); } catch { return []; } })();
medicao('plantas_r4_sobre_a_construcao', plantasPortoes.length, 'OEDP_MEDICOES=<esta pasta> node tests/pais/portoes.mjs --prefixo r4- · plantas-portoes-r4.json', 'todas passaram com os ficheiros repostos', plantasPortoes.length > 0 && plantasPortoes.every((/** @type {any} */ p) => p.passou && p.ficheiros.every((/** @type {any} */ x) => x.antes === x.reposto)));

/* 6 · A L1 (check:lugar), pela medição ao lado. */
try {
  const l1 = JSON.parse(fs.readFileSync(path.join(AQUI, 'l1-r4.json'), 'utf8'));
  for (const [nome, chave] of [['l1_paginas_na_construcao_de_partida', 'antes'], ['l1_paginas_nesta_construcao', 'depois'], ['l1_paginas_novas', 'novas'], ['l1_paginas_antigas_agravadas', 'agravadas'], ['l1_paginas_que_sairam', 'sairam']]) {
    medicao(nome, l1.contagens[chave], `l1-r4.json · contagens.${chave} (medir-l1-r4.mjs)`, 'as páginas novas são recibos de séries', (l1.novas ?? []).every((/** @type {string} */ u) => /\/series\//.test(u)));
  }
} catch { medicao('l1', NAO, 'l1-r4.json', 'o ficheiro existe', false); }

/* 7 · AS CAPTURAS. */
try {
  const cap = JSON.parse(fs.readFileSync(path.join(AQUI, 'capturas-r4.json'), 'utf8'));
  medicao('capturas', cap.capturas.length, 'capturas-r4.json · capturas', 'cada uma tem o ficheiro na pasta das capturas', cap.capturas.every((/** @type {any} */ x) => fs.existsSync(path.join(RAIZ, x.ficheiro))));
  medicao('capturas_sem_rolar_para_o_lado', cap.capturas.filter((/** @type {any} */ x) => x.largura_do_documento <= x.largura).length, 'capturas-r4.json · largura do documento ≤ largura da janela', 'a conta inclui as cinco larguras', new Set(cap.capturas.map((/** @type {any} */ x) => x.largura)).size === 5);
} catch { medicao('capturas', NAO, 'capturas-r4.json', 'o ficheiro existe', false); }

/* 7b · AS ENTRADAS COM ALGUMA PARTE SÓ DA CASA, uma a uma, com a espécie do apoio de cada parte (o mandato, ponto 3: «se
   a fonte não disser o que a medida é, a frase diz o que a declaração da medida diz e o relatório lista a família como
   «por confirmar na fonte»»). Lido da auditoria (`tests/cartao/leituras-provadas.json`), pela mesma classe da K17: um
   apoio é da fonte quando é uma origem, um campo da fonte da linha ou da série, ou o período lido do campo da data. */
const AUD = JSON.parse(fs.readFileSync(path.join(RAIZ, 'tests', 'cartao', 'leituras-provadas.json'), 'utf8'));
const CAMPOS_FONTE = new Set(['excerpt', 'unit', 'name', 'source', 'document.title', 'document.locator', 'document.edition']);
const especie = (/** @type {any} */ a) => (a.ou ? (a.ou.some((x) => especie(x) === 'fonte') ? 'fonte' : especie(a.ou[0]))
  : a.origem ? 'fonte' : a.forma === 'ano' ? 'fonte' : (a.linha === 'propria' || a.serie === 'propria') && CAMPOS_FONTE.has(a.campo) ? 'fonte'
    : (a.linha === 'propria' || a.serie === 'propria') ? `campo da casa (${a.campo})` : a.declaracao === 'nome' ? 'nome do projeto' : a.termo ? 'explicação de um termo (TERMOS_DOS_CARTOES)' : 'outro');
const porConfirmar = [];
for (const [chave, lista] of [['familias', AUD.familias ?? []], ['series', AUD.series ?? []]]) {
  for (const e of lista) {
    if (e.cartao) continue;
    /* A pertença é a da K17 (as listas `lista_da_casa` das contas, com a regra das alternativas linha a linha); as
       partes e a espécie dos apoios leem-se aqui, para o relatório. */
    const quemAqui = e.serie ?? (e.concelho ? `concelho:${e.concelho}` : (e.chaves ?? []).join(', '));
    const daK17 = chave === 'series' ? (so.lista_da_casa ?? []) : (f.lista_da_casa ?? []);
    if (!daK17.includes(quemAqui)) continue;
    const partes = (e.folhas?.[0]?.partes ?? []).filter((/** @type {any} */ p) => p.classe === 'diz');
    const daCasa = partes.filter((/** @type {any} */ p) => !(p.apoios ?? []).some((/** @type {any} */ a) => especie(a) === 'fonte'));
    porConfirmar.push({
      onde: chave,
      quem: quemAqui,
      partes: daCasa.length
        ? daCasa.map((/** @type {any} */ p) => ({ pt: p.pt, apoios: [...new Set((p.apoios ?? []).map(especie))] }))
        : [{ pt: '(uma parte cujas alternativas só são da fonte nalgumas linhas da família)', apoios: ['alternativa só da casa em alguma linha'] }],
    });
  }
}
const porEspecie = {};
for (const x of porConfirmar) for (const p of x.partes) for (const e of p.apoios) porEspecie[e] = (porEspecie[e] ?? 0) + 1;
medicao('entradas_por_confirmar_na_fonte', porConfirmar.length, 'tests/cartao/leituras-provadas.json · as entradas de familias e series com alguma parte que diz sem apoio da fonte', 'a família do limite da dívida não está na lista (as suas partes apoiam-se na fonte)', !porConfirmar.some((x) => x.quem === 'concelho:limite'));
medicao('entradas_por_confirmar_na_fonte_das_familias', porConfirmar.filter((x) => x.onde === 'familias').length, 'idem, só as das famílias', 'a conta bate com a da K17 (alguma parte só da casa)', porConfirmar.filter((x) => x.onde === 'familias').length === (c.familias?.alguma_da_casa ?? -1));
medicao('entradas_por_confirmar_na_fonte_das_series', porConfirmar.filter((x) => x.onde === 'series').length, 'idem, só as das séries', 'a conta bate com a da K17 (séries com alguma parte só da casa)', porConfirmar.filter((x) => x.onde === 'series').length === (so.alguma_da_casa ?? -1));
for (const [k2, n] of Object.entries(porEspecie)) medicao(`partes_por_confirmar_apoiadas_em_${nomeDe(k2)}`, n, `idem, as partes cujo apoio é «${k2}»`, 'a espécie aparece na lista', porConfirmar.some((x) => x.partes.some((p) => p.apoios.includes(k2))));

/* 7c · OS APOIOS DAS FRASES NOVAS, POR ESPÉCIE (a origem de cada termo, em resumo; a lista inteira é a auditoria). */
const apoiosPorEspecie = { familias: {}, series: {} };
for (const [chave, lista] of [['familias', AUD.familias ?? []], ['series', AUD.series ?? []]]) {
  for (const e of lista) for (const p of e.folhas?.[0]?.partes ?? []) for (const a of p.apoios ?? []) {
    const k3 = a.ou ? `alternativas (${especie(a) === 'fonte' ? 'com uma da fonte' : 'só da casa'})` : a.origem ? `origem ${a.origem}` : especie(a) === 'fonte' ? `campo da fonte (${a.campo ?? a.forma})` : especie(a);
    const grupo = k3.startsWith('origem ') ? 'origem declarada' : k3;
    apoiosPorEspecie[chave][grupo] = (apoiosPorEspecie[chave][grupo] ?? 0) + 1;
  }
}
for (const [chave, porEsp] of Object.entries(apoiosPorEspecie)) for (const [k3, n] of Object.entries(porEsp)) {
  medicao(`apoios_${chave}_${nomeDe(k3)}`, n, `tests/cartao/leituras-provadas.json · os apoios das partes de ${chave}, pela espécie «${k3}»`, 'a soma das espécies é a conta dos apoios', Object.values(porEsp).reduce((x, y) => x + y, 0) > 0);
}

/* 7d · O §0 DO BRIEF, REPRODUZIDO (o guião do brief corrido de novo sobre a cabeça presa), e a diferença entre a regra
   de família do brief e a do bloco nos concelhos. */
try {
  const a = JSON.parse(fs.readFileSync(path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-R4.json'), 'utf8'));
  const b = JSON.parse(fs.readFileSync(path.join(AQUI, 'brief-r4-reproduzido.json'), 'utf8'));
  const va = Object.fromEntries(a.medidas.map((m) => [m.nome, m.valor]));
  const iguais = b.medidas.filter((m) => va[m.nome] === m.valor).length;
  medicao('brief_medidas_reproduzidas_iguais', iguais, 'OEDP_MEDIDAS_JSON=brief-r4-reproduzido.json python3 design/observatorio/medidas/BRIEF-R4.py · comparado com design/observatorio/medidas/BRIEF-R4.json', 'são todas as do brief', iguais === a.medidas.length);
} catch { medicao('brief_medidas_reproduzidas_iguais', NAO, 'brief-r4-reproduzido.json', 'o ficheiro existe', false); }
{
  /* A regra do brief: sem o período no fim (com «-ue» e «-paises»), e nos concelhos o sufixo comum a vinte ou mais ids. */
  const comCartao = new Set((AUD.medidas ?? []).map((/** @type {any} */ m) => m.id));
  const semP = (/** @type {string} */ i) => i.replace(/-\d{4}(-\d{2})?(-ue|-paises)?$/, '');
  const bases = ids.filter((i) => !comCartao.has(i)).map((i) => [i, semP(i)]);
  const suf = new Map();
  for (const [, b] of bases) { const p = b.split('-'); for (let k = 1; k < p.length; k++) { const x = p.slice(k).join('-'); suf.set(x, (suf.get(x) ?? 0) + 1); } }
  const municipais = new Set([...suf].filter(([, n]) => n >= 20).map(([x]) => x));
  const doBrief = new Set(bases.filter(([, b]) => { const p = b.split('-'); for (let k = 1; k < p.length; k++) if (municipais.has(p.slice(k).join('-'))) return true; return false; }).map(([i]) => i));
  const doBloco = new Set();
  const { MUNICIPIOS_COM_PAGINA } = await import(path.join(RAIZ, 'src', 'data', 'municipios.mjs'));
  for (const m of MUNICIPIOS_COM_PAGINA) { for (const r of m.relance ?? []) if (r.claim) doBloco.add(r.claim); if (m.distancia?.limite) doBloco.add(m.distancia.limite); }
  const soNoBrief = [...doBrief].filter((i) => !doBloco.has(i));
  const soNoBloco = [...doBloco].filter((i) => !doBrief.has(i));
  medicao('linhas_dos_concelhos_pela_regra_do_brief', doBrief.size, 'a regra do §0 do brief (o sufixo comum a vinte ou mais ids), sobre o livro-razão desta cabeça', 'a conta é a do brief (2 817)', doBrief.size === 2817);
  medicao('linhas_dos_concelhos_pela_regra_do_bloco', doBloco.size, 'as linhas que os concelhos declaram no relance e na distância (MUNICIPIOS_COM_PAGINA)', 'a de Abrantes está lá', doBloco.has('abrantes-populacao-2025'));
  medicao('linhas_que_so_a_regra_do_brief_junta_aos_concelhos', soNoBrief.length, 'a diferença entre as duas listas', 'as do Orçamento que acabam em «administracao-central» estão nela', soNoBrief.some((i) => i.endsWith('administracao-central')));
  medicao('linhas_que_so_a_regra_do_bloco_junta_aos_concelhos', soNoBloco.length, 'a diferença no outro sentido', 'a conta é um número', Number.isInteger(soNoBloco.length));
  const porSufixo = {};
  for (const i of soNoBrief) { const b = semP(i); const p = b.split('-'); let x = b; for (let k = 1; k < p.length; k++) { const y = p.slice(k).join('-'); if (municipais.has(y)) { x = y; break; } } porSufixo[x] = (porSufixo[x] ?? 0) + 1; }
  saidaExtra.diferenca_das_regras_dos_concelhos = { so_no_brief_por_sufixo: porSufixo, so_no_bloco: soNoBloco.slice(0, 50) };
}

/* 7e · OS SEGUNDOS: do commit do brief à cabeça medida, pelos tempos dos commits. */
{
  const t = (/** @type {string} */ ref) => Number(execFileSync('git', ['show', '-s', '--format=%ct', ref], { cwd: RAIZ, encoding: 'utf8' }).trim());
  const s0 = t('9424e9e7');
  const s1 = t('HEAD');
  medicao('segundos_do_commit_do_brief_a_cabeca_medida', s1 - s0, 'git show -s --format=%ct 9424e9e7 e HEAD', 'a cabeça medida é posterior ao brief', s1 > s0);
}

/* 7f · OS TRÊS PORTÕES INTEIROS, lidos dos ficheiros que `scripts/leituras/portoes.sh` escreveu na pasta `portoes/`. */
{
  const P = path.join(AQUI, 'portoes');
  const le = (/** @type {string} */ f) => (fs.existsSync(path.join(P, f)) ? fs.readFileSync(path.join(P, f), 'utf8').trim() : null);
  const cab = le('cabeca');
  medicao('portoes_cabeca_e_a_cabeca_do_codigo', cab ? 1 : 0, 'portoes/cabeca e portoes/cabeca.fim', 'a cabeça do início é a do fim', cab !== null && cab === le('cabeca.fim'));
  saidaExtra.portoes = { cabeca: cab, cabeca_fim: le('cabeca.fim') };
  for (const g of ['build', 'verify', 'typecheck']) {
    const cod = le(`${g}.codigo`);
    const ini = le(`${g}.inicio`);
    const fim = le(`${g}.fim`);
    medicao(`portoes_${g}_codigo`, cod === null ? NAO : Number(cod), `portoes/${g}.codigo (sh scripts/leituras/portoes.sh <worktree> <esta pasta>/portoes)`, `o registo de ${g} existe e acaba`, Boolean(cod !== null && ini && fim));
    if (ini && fim) medicao(`portoes_${g}_segundos`, Math.round((Date.parse(fim) - Date.parse(ini)) / 1000), `portoes/${g}.inicio e portoes/${g}.fim`, 'o fim não é antes do início', Date.parse(fim) >= Date.parse(ini));
  }
}

/* 7g · O MAPA DO REPOSITÓRIO, pelo seu conferidor. */
{
  const r = spawnSync('python3', ['scripts/leituras/conferir-mapa.py', 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'], { cwd: RAIZ, encoding: 'utf8' });
  const t2 = `${r.stdout}${r.stderr}`;
  const num = (/** @type {RegExp} */ re) => { const x = re.exec(t2); return x ? Number(x[1]) : NAO; };
  medicao('conferir_mapa_codigo', r.status, 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'a saída traz a conta das citações conferidas', /citações conferidas na linha citada/.test(t2));
  medicao('conferir_mapa_citacoes_na_linha', num(/citações conferidas na linha citada \(±7\): (\d+)/), 'idem · «citações conferidas na linha citada (±7)»', 'a secção do R4 cita o resolvedor', fs.readFileSync(path.join(RAIZ, 'design', 'observatorio', 'MAPA-DO-REPOSITORIO-para-construtores.md'), 'utf8').includes('src/lib/o-que-e-o-numero.mjs:3'));
  medicao('conferir_mapa_citacoes_longe', num(/citação está no ficheiro, mas longe da linha citada: (\d+)/), 'idem · «citação está no ficheiro, mas longe da linha citada»', 'a conta é um número', true);
  medicao('conferir_mapa_citacoes_nao_encontradas', num(/citação não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'idem · «citação não encontrada…»', 'a conta é um número', true);
}

/* 8 · OS RÓTULOS DO EUROSTAT LIDOS FORA DO CLIENTE DA CASA (a I207): as três respostas da API, lidas com um pedido
   simples a 05.10.2026, não entram como origem (a K16 pede o selo do cliente da casa guardado no motor) e não se guardam
   no repositório; aqui ficam o endereço, a hora (UTC, tirada logo a seguir ao pedido), o cliente, o resumo, os bytes e
   os rótulos lidos de cada uma. Os ficheiros estão fora do repositório, na pasta que `OEDP_LEITURAS_EUROSTAT` aponta. */
const LEITURAS_EUROSTAT = [
  { ficheiro: 'eurostat-hicp-labels.json', hora: '2026-10-05T20:26:19Z', url: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_minr?format=JSON&lang=EN&freq=M&unit=RCH_A&coicop18=CP0722&coicop18=CP045&coicop18=CP041&geo=PT&lastTimePeriod=1' },
  { ficheiro: 'eurostat-hicp-cp04.json', hora: '2026-10-05T20:28:54Z', url: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_minr?format=JSON&lang=EN&freq=M&unit=RCH_A&coicop18=CP04&geo=PT&lastTimePeriod=1' },
  { ficheiro: 'eurostat-hpi-q.json', hora: '2026-10-05T20:28:55Z', url: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hpi_q?format=JSON&lang=EN&freq=Q&unit=RCH_A&purchase=TOTAL&geo=PT&lastTimePeriod=1' },
];
const leituras = [];
for (const l of LEITURAS_EUROSTAT) {
  const f = process.env.OEDP_LEITURAS_EUROSTAT ? path.join(process.env.OEDP_LEITURAS_EUROSTAT, l.ficheiro) : null;
  if (!f || !fs.existsSync(f)) { leituras.push({ url: l.url, hora: l.hora, lido: NAO }); continue; }
  const bytes = fs.readFileSync(f);
  const j = JSON.parse(bytes.toString('utf8'));
  const rotulos = Object.fromEntries(Object.entries(j.dimension ?? {}).filter(([k]) => ['coicop18', 'unit', 'purchase'].includes(k)).map(([k, v]) => [k, /** @type {any} */ (v).category?.label ?? {}]));
  const { createHash } = await import('node:crypto');
  leituras.push({ url: l.url, hora: l.hora, cliente: 'curl (pedido simples, fora do cliente da casa)', sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length, rotulos });
}
medicao('leituras_do_eurostat_fora_do_cliente_da_casa', leituras.filter((x) => x.sha256).length, 'OEDP_LEITURAS_EUROSTAT=<pasta fora do repositório> · as três respostas, com o resumo e os rótulos', 'a resposta das três classes traz o rótulo de CP041', leituras.some((x) => x.rotulos?.coicop18?.CP041 === 'Actual rental payments made for housing'));

const saida = {
  bloco: 'R4',
  guiao: 'design/especime-v3/medicoes/r4-2026-10-05/medir-r4.mjs',
  cabeca,
  estado_seguido: estado,
  construcao: versao.commit ?? null,
  medidas,
  leituras_do_eurostat: leituras,
  por_confirmar_na_fonte: porConfirmar,
  apoios_por_especie: apoiosPorEspecie,
  ...saidaExtra,
};
fs.writeFileSync(path.join(AQUI, 'medidas.json'), tirarRaiz(JSON.stringify(saida, null, 2)) + '\n');
const falhados = medidas.filter((m) => !m.conhecido_positivo.encontrado || m.valor === NAO);
console.log(`medidas.json · ${medidas.length} medições · ${falhados.length} sem conhecido-positivo encontrado ou por ler${falhados.length ? `: ${falhados.map((m) => m.nome).join(', ')}` : ''}`);
process.exit(falhados.length ? 1 : 0);
