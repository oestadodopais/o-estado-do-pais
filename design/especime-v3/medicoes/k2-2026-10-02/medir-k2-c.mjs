/** K2-c: as medidas da passagem, escritas em `medidas-k2-c.json` ao lado deste guião. Cada medição traz o nome, o valor,
 * o comando que a repete e um conhecido-positivo: o mesmo detetor sobre a construção da cabeça do relatório do K2
 * (`a6b4de99`, guardada fora do repositório; o ficheiro guarda a cabeça que o seu `version.json` diz), onde os achados
 * da leitura a frio ainda estavam, ou a versão anterior de uma célula, lida por `git show` da cabeça de partida da
 * passagem (`d7268167`).
 * Uso, da raiz da worktree, depois de construir a cabeça da passagem:
 *   node design/especime-v3/medicoes/k2-2026-10-02/medir-k2-c.mjs <pasta da construção do K2> */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

const [DIST_K2] = process.argv.slice(2);
if (!DIST_K2) throw new Error('Uso: medir-k2-c.mjs <pasta da construção do K2>');
const D = 'design/especime-v3/medicoes/k2-2026-10-02';
const DIST = 'dist';
const PARTIDA = 'd72681678edf6bf62ab408aef4922420a558f834';
const lerJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = lerJson(path.join(DIST, 'version.json'));
const versaoK2 = lerJson(path.join(DIST_K2, 'version.json'));
const medidas = [];
const medicao = (nome, valor, comando, oQue, encontrado, extra = {}) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) }, ...extra });
const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const pagina = (dist, rel) => parse(fs.readFileSync(path.join(dist, rel), 'utf8'));
/* A versão anterior de um módulo sem importações relativas, escrita numa pasta temporária. */
const anterior = async (ficheiro) => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'k2c-'));
  const destino = path.join(pasta, path.basename(ficheiro));
  fs.writeFileSync(destino, execFileSync('git', ['show', `${PARTIDA}:${ficheiro}`], { encoding: 'utf8' }));
  return import(pathToFileURL(destino).href);
};

/* 1 · A UNIDADE QUE A LINHA DO VALOR DO CARTÃO DA DIFERENÇA DE EMPREGO MOSTRA, nas páginas onde o cartão vive. */
const PAGINAS_DO_CARTAO = ['emprego/index.html', 'en/employment/index.html', 'areas/trabalho-solidariedade-e-seguranca-social/index.html', 'en/areas/trabalho-solidariedade-e-seguranca-social/index.html'];
function unidadesDoCartao(dist) {
  const c = { da_casa: 0, da_fonte: 0, cartoes: 0, textos: [] };
  for (const rel of PAGINAS_DO_CARTAO) {
    const q = pagina(dist, rel).querySelector('[data-cartao-medida="disparidade-de-emprego-entre-sexos-2025"] .cartao-medida-quantidade');
    if (!q) continue;
    c.cartoes++;
    const t = normal(q.textContent);
    c.textos.push(`${rel} · ${t}`);
    if (/pontos percentuais|percentage points/.test(t)) c.da_casa++;
    if (/% da população|% of the population/.test(t)) c.da_fonte++;
  }
  return c;
}
const uAgora = unidadesDoCartao(DIST);
const uK2 = unidadesDoCartao(DIST_K2);
medicao('cartoes_da_diferenca_de_emprego_com_a_unidade_da_casa', uAgora.da_casa, 'a linha do valor do cartão da diferença de emprego entre sexos, nas páginas do emprego e da área do trabalho, nas duas edições',
  `o mesmo detetor acha a etiqueta da fonte em ${uK2.da_fonte} cartões da construção do K2`, uK2.da_fonte > 0, { de: uAgora.cartoes, com_a_etiqueta_da_fonte: uAgora.da_fonte, textos: uAgora.textos, antes: uK2 });
function etiquetaNoRecibo(dist) {
  return ['livro-razao/disparidade-de-emprego-entre-sexos-2025/index.html', 'en/ledger/disparidade-de-emprego-entre-sexos-2025/index.html']
    .filter((rel) => /^% (da população|of the population)$/.test(normal(pagina(dist, rel).querySelector('h1 [data-linha-campo="unit"]')?.textContent))).length;
}
medicao('recibos_com_a_etiqueta_da_fonte', etiquetaNoRecibo(DIST), 'o campo da unidade no cabeçalho do recibo da linha, nas duas edições',
  `o mesmo detetor acha a etiqueta nos ${etiquetaNoRecibo(DIST_K2)} recibos da construção do K2`, etiquetaNoRecibo(DIST_K2) === 2, { de: 2 });

/* 2 · A CLASSE ETÁRIA AO LADO DO TÍTULO DO CONJUNTO, nas páginas da União. */
function classeEtaria(dist) {
  const c = { com_classe: 0, com_titulo_15_24: 0 };
  for (const rel of ['uniao-europeia/index.html', 'en/european-union/index.html']) {
    const o = pagina(dist, rel).querySelector('[data-def-origem="eurostat-tipslm90-sexo"]');
    if (!o) continue;
    if (/aged 15-24/.test(o.textContent)) c.com_titulo_15_24++;
    if (normal(o.querySelector('.def-origem-coordenadas')?.textContent) === 'Age class: From 15 to 29 years') c.com_classe++;
  }
  return c;
}
const cAgora = classeEtaria(DIST);
const cK2 = classeEtaria(DIST_K2);
medicao('paginas_da_uniao_com_a_classe_etaria_ao_lado_do_titulo', cAgora.com_classe, 'a linha da origem eurostat-tipslm90-sexo nas páginas da União, nas duas edições: a coordenada «Age class: From 15 to 29 years» depois do título que diz «aged 15-24»',
  `o mesmo detetor acha o título «aged 15-24» em ${cK2.com_titulo_15_24} páginas da construção do K2, e a classe em ${cK2.com_classe}`, cK2.com_titulo_15_24 === 2, { de: 2, titulo_15_24: cAgora.com_titulo_15_24, antes: cK2 });
const org = lerJson(`${D}/origens-k2-c.json`);
medicao('classe_etaria_conferida_contra_os_bytes', org.certo, `node ${D}/origens-k2-c.mjs <raiz do motor> <saída.json>`,
  'o excerto «Sex: Total» da mesma origem refaz-se da dimensão sex da mesma resposta', org.conhecido_positivo?.confere, { sha256_confere: org.sha256_confere, coordenada_da_resposta: org.coordenada_da_resposta });

/* 3 · OS VALORES DA FAIXA DA UNIÃO SEM UNIDADE: a linha da unidade de cada cartão sem palavra de unidade. */
const UNIDADE = /percent|percentag|pontos|points|rácio|ratio|índice|index/i;
function semUnidade(dist) {
  const lista = [];
  let cartoes = 0;
  for (const rel of ['uniao-europeia/index.html', 'en/european-union/index.html']) {
    for (const c of pagina(dist, rel).querySelectorAll('[data-faixa] li.cartao')) {
      cartoes++;
      const u = normal(c.querySelector('.cartao-unidade')?.textContent);
      if (!UNIDADE.test(u)) lista.push(`${rel} · ${normal(c.querySelector('.cartao-nome')?.textContent)} · ${u}`);
    }
  }
  return { lista, cartoes };
}
const sAgora = semUnidade(DIST);
const sK2 = semUnidade(DIST_K2);
/* Os três valores que a leitura nomeou, como a página da União os rende, e a linha da unidade de cada um. */
const tres = Object.fromEntries(['custo-unitario-do-trabalho-2025', 'precos-da-habitacao-2025', 'taxa-de-cambio-efectiva-real-2025'].map((id) => {
  const c = pagina(DIST, 'uniao-europeia/index.html').querySelector(`[data-faixa] li.cartao [data-claim="${id}"]`)?.closest('li');
  return [id, { valor: normal(c?.querySelector('[data-claim]')?.textContent), unidade: normal(c?.querySelector('.cartao-unidade')?.textContent) }];
}));
medicao('valores_da_faixa_da_uniao_sem_unidade', sAgora.lista.length, 'a linha da unidade de cada cartão da faixa da União, nas duas edições, sem uma palavra de unidade (percentagem, pontos, rácio, índice)',
  `o mesmo detetor acha ${sK2.lista.length} na construção do K2`, sK2.lista.length > 0, { de: sAgora.cartoes, antes: sK2.lista, os_tres: tres });

/* 4 · AS TRÊS PARTES DA DEFINIÇÃO NA EXPLICAÇÃO DA POBREZA OU EXCLUSÃO, na primeira página. */
const PARTES = { 'index.html': ['rendimento abaixo de', 'privação material e social grave', 'intensidade de trabalho muito baixa'], 'en/index.html': ['income below', 'severe material and social deprivation', 'very low work intensity'] };
const comAsTres = (dist) => Object.entries(PARTES).filter(([rel, ps]) => { const t = normal(pagina(dist, rel).textContent); return ps.every((p) => t.includes(p)); }).length;
const comAMediana = (dist) => Object.keys(PARTES).filter((rel) => /rendimento mediano|median income/.test(normal(pagina(dist, rel).textContent))).length;
const ressalva = normal(pagina(DIST, 'index.html').querySelectorAll('p').map((p) => p.textContent).find((t) => t.includes('privação material e social grave')));
medicao('primeiras_paginas_com_as_tres_partes_da_definicao', comAsTres(DIST), 'o texto da primeira página, nas duas edições: as três situações da definição declarada da pobreza ou exclusão social',
  `o mesmo detetor acha ${comAsTres(DIST_K2)} na construção do K2, onde a explicação dizia só o rendimento mediano (em ${comAMediana(DIST_K2)} páginas)`, comAMediana(DIST_K2) === 2 && comAsTres(DIST_K2) === 0,
  { de: 2, explicacao_pt: ressalva, limiar_do_rendimento: (/abaixo de (\d+) %/.exec(ressalva) ?? [])[1] ?? null });

/* 5 · A CÉLULA DO FORMATO: as plantas na célula nova e na anterior. */
const formato = await import(pathToFileURL(path.resolve('tests/inicio/formato-dos-numeros.mjs')).href);
const formatoAntes = await anterior('tests/inicio/formato-dos-numeros.mjs');
const pNovas = formato.plantasDoFormato(DIST);
const pAntes = formato.plantasDoFormato(DIST, formatoAntes.conferirFormatoDaPagina);
const conta = formato.conferirFormatoDosNumeros(DIST);
medicao('plantas_do_formato_que_mordem', pNovas.filter((p) => p.mordeu).length, 'node tests/inicio/formato-dos-numeros.mjs --prova',
  'a célula anterior não morde as duas plantas novas', pAntes.filter((p) => !p.mordeu).length === 2,
  { de: pNovas.length, desvios: conta.desvios.length, nao_numericos: conta.contas.nao_numericos, na_celula_anterior: pAntes.map((p) => ({ nome: p.nome, mordeu: p.mordeu })) });

/* 6 · AS CASAS DECIMAIS: a regra nova, as plantas, e o que a regra anterior fazia às mesmas linhas. */
const { loadClaims } = await import(pathToFileURL(path.resolve('src/lib/ledger.mjs')).href);
const casas = await import(pathToFileURL(path.resolve('scripts/casas-decimais.mjs')).href);
const casasAntes = await anterior('scripts/casas-decimais.mjs');
const linhas = loadClaims();
const agoraCasas = casas.conferirCasasDecimais(linhas.values());
const antesCasas = casasAntes.conferirCasasDecimais(linhas.values());
const plantasCasas = casas.plantasDasCasasDecimais(linhas);
const plantasNaAnterior = casas.linhasDasPlantas(linhas).map((p) => ({ nome: p.nome, morde_na_nova: p.morde, erros_na_anterior: casasAntes.conferirCasasDecimais([p.linha]).erros.length }));
const exemploDaLeitura = { id: 'exemplo-da-leitura-a-frio', value: '8', excerpt: 'Article 8 provides a rate of 8.0 percent.', derivation: null };
medicao('linhas_lidas_pelo_literal_do_valor', agoraCasas.contas.com_literal_do_valor, 'node scripts/check-ledger.mjs (a célula das casas decimais, scripts/casas-decimais.mjs)',
  'as plantas do inteiro alheio e do número agrupado à inglesa mordem', plantasCasas.filter((p) => p.certo).length === plantasCasas.length,
  { contas: agoraCasas.contas, erros: agoraCasas.erros.length, contas_antes: antesCasas.contas, plantas: plantasCasas.map((p) => ({ nome: p.nome, certo: p.certo, mordeu: p.mordeu })), plantas_na_regra_anterior: plantasNaAnterior,
    exemplo_da_leitura_a_frio: { na_regra_anterior: casasAntes.conferirCasasDecimais([exemploDaLeitura]).erros.length, na_nova: casas.conferirCasasDecimais([exemploDaLeitura]).contas } });

/* 6b · AS LINHAS DO INE, que a regra nova não lê: o que daria ler o campo «valor» (o número da máquina, sem os zeros do
   fim) e o que daria ler o campo «ind_string» (a forma que o INE publica). Medido para o relatório dizer porque é que
   o «valor» fica de fora e o que uma regra para o «ind_string» leria; a célula não muda por isto. */
const ine = { com_ind_string: 0, ind_string_igual: 0, ind_string_diferente: [], valor_com_outras_casas: 0 };
for (const l of linhas.values()) {
  if (l.derivation) continue;
  const ex = String(l.excerpt ?? '');
  const v = casas.numeroDoValor(l.value);
  const ind = /"ind_string"\s*:\s*"([^"]*)"/.exec(ex);
  const val = /"valor"\s*:\s*"(-?\d+)(?:\.(\d+))?"\s*\}?\s*$/.exec(ex);
  if (ind) {
    ine.com_ind_string++;
    const s2 = casas.numeroDoValor(ind[1]);
    if (v && s2 && v.n === s2.n && v.casas === s2.casas) ine.ind_string_igual++;
    else ine.ind_string_diferente.push(`${l.id} · ${l.value} · ${ind[1]}`);
  }
  if (val && v) {
    const casasDoValor = (val[2] ?? '').length;
    if (casasDoValor !== v.casas) ine.valor_com_outras_casas++;
  }
}
medicao('linhas_do_ine_com_a_forma_publicada_igual_ao_valor', ine.ind_string_igual, 'ledger/claims/*.yml: as linhas sem derivação cujo excerto traz o campo «ind_string» do INE, comparado com o valor (o mesmo número com as mesmas casas)',
  `o mesmo leitor acha ${ine.valor_com_outras_casas} linhas cujo campo «valor» escreve outras casas que o valor da linha`, ine.valor_com_outras_casas > 0,
  { com_ind_string: ine.com_ind_string, diferentes: ine.ind_string_diferente, valor_com_outras_casas: ine.valor_com_outras_casas });

/* 7 · A K16: a unidade da casa e as coordenadas, e as duas plantas novas. */
const perguntas = await import(pathToFileURL(path.resolve('tests/cartao/perguntas.mjs')).href);
const { DEFINICOES_DAS_MEDIDAS: DEF, ORIGENS_DAS_DEFINICOES: ORI } = await import(pathToFileURL(path.resolve('src/data/figuras.mjs')).href);
const k16 = perguntas.auditarPerguntas();
const plantaUnidade = perguntas.auditarPerguntas({ definicoes: { ...DEF, 'disparidade-de-emprego-entre-sexos-2025': { ...DEF['disparidade-de-emprego-entre-sexos-2025'], unidade: { pt: '% da população', en: 'percentage points' } } } }).erros.some((e) => e.includes('não é um pedaço da pergunta'));
const plantaCoordenadas = perguntas.auditarPerguntas({ origens: { ...ORI, 'eurostat-tipslm90-sexo': { ...ORI['eurostat-tipslm90-sexo'], coordenadas: 'Age class: From 15 to 24 years' } } }).erros.some((e) => e.includes('não são um segmento'));
medicao('k16_erros', k16.erros.length, 'node tests/cartao/cartao.mjs --prova (a K16, tests/cartao/perguntas.mjs)',
  'as duas plantas novas da K16 mordem', plantaUnidade && plantaCoordenadas, { unidades_da_casa: k16.contas.unidades_da_casa, origens_com_coordenadas: k16.contas.origens_com_coordenadas });

/* 8 · AS PLANTAS DO PORTÃO DE HTML, DO SELO DO CARTÃO E DA C1, dos ficheiros das corridas. */
const portao = lerJson(`${D}/plantas-portoes-k2c.json`);
medicao('plantas_do_portao_k2c_que_morderam', portao.filter((p) => p.passou).length, 'OEDP_MEDICOES=<pasta> node tests/pais/portoes.mjs --prefixo k2c-',
  'cada planta repôs os bytes do ficheiro que estragou', portao.every((p) => p.ficheiros.every((f) => f.antes === f.reposto)), { de: portao.length, plantas: portao.map((p) => p.nome) });
const c1 = lerJson(`${D}/c1-k2-c.json`);
const c1Planta = c1.plantas.find((p) => p.nome === 'unidade-da-casa-colada');
medicao('planta_da_c1_com_a_unidade_da_casa', Boolean(c1Planta?.passou), `node tests/confianca/c1.mjs --json ${D}/c1-k2-c.json`,
  'o controlo com o espaço passa sem erros', c1.controlos.some((c) => c.nome === 'unidade-da-casa-com-espaco' && c.passou && c.erros.length === 0));
medicao('codigo_das_plantas_do_selo_do_cartao', Number(fs.readFileSync(`${D}/selo-k2-c.codigo`, 'utf8').trim()), `node tests/cartao/selo.mjs`,
  'o registo diz as duas plantas novas recusadas', /unidade da casa de outra linha, recusada/.test(fs.readFileSync(`${D}/selo-k2-c.log`, 'utf8')));

/* 9 · AS CAPTURAS, AS DECISÕES, O CUSTO E OS PORTÕES. */
const cap = lerJson(`${D}/capturas-k2-c.json`);
medicao('capturas_k2_c', cap.capturas, `node ${D}/captar-k2.mjs k2-c`, 'o manifesto da K2-b tem 16', lerJson(`${D}/capturas-k2-b.json`).capturas === 16,
  { problemas: cap.problemas.length, larguras: cap.larguras, cabeca: cap.cabeca, paginas: [...new Set(cap.resultados.map((r) => r.pagina))] });
const dec = fs.readFileSync(`${D}/decisoes-em-vigor-k2-c.txt`, 'utf8').split('\n').filter((l) => l.startsWith('§'));
medicao('decisoes_citadas_nos_ficheiros_tocados_pela_k2_c', dec.length, 'python3 scripts/leituras/decisoes-em-vigor.py <os ficheiros de texto do intervalo d7268167..cabeça>', 'a §1.127 está na lista', dec.some((l) => l.startsWith('§1.127 ')));
const ci = lerJson(`${D}/custo-inicio-k2-c.json`);
if (fs.existsSync(`${D}/custo-fim-k2-c.json`)) {
  const cf = lerJson(`${D}/custo-fim-k2-c.json`);
  medicao('simbolos_gastos_na_k2_c_ate_ao_relatorio', ci.simbolos_restantes_no_inicio - cf.simbolos_restantes_no_fim, `${D}/custo-inicio-k2-c.json e ${D}/custo-fim-k2-c.json (a diferença das duas leituras do contador)`,
    'o contador do fim é menor do que o do início', ci.simbolos_restantes_no_inicio > cf.simbolos_restantes_no_fim, { segundos: Math.round((Date.parse(cf.fim_utc) - Date.parse(ci.inicio_utc)) / 1000) });
}
const P = `${D}/portoes/k2-c`;
if (fs.existsSync(`${P}/build.codigo`)) {
  const codigoDe = (f) => Number(fs.readFileSync(f, 'utf8').trim());
  const p = (g) => ({ codigo: codigoDe(`${P}/${g}.codigo`), segundos: Math.round((Date.parse(fs.readFileSync(`${P}/${g}.fim`, 'utf8').trim()) - Date.parse(fs.readFileSync(`${P}/${g}.inicio`, 'utf8').trim())) / 1000) });
  const g = { build: p('build'), verify: p('verify'), typecheck: p('typecheck'), cabeca: fs.readFileSync(`${P}/cabeca`, 'utf8').trim(), cabeca_no_fim: fs.readFileSync(`${P}/cabeca.fim`, 'utf8').trim() };
  medicao('portoes_a_zero_na_k2_c', ['build', 'verify', 'typecheck'].filter((k) => g[k].codigo === 0).length, `sh scripts/leituras/portoes.sh <worktree> ${P}`,
    'o mesmo leitor de códigos lê o 1 de alvos-intermedio.codigo, a corrida intermédia do check:alvos do K2 que falhou', codigoDe(`${D}/alvos-intermedio.codigo`) === 1 && g.cabeca === g.cabeca_no_fim, { portoes: g });
}

const saida = { passagem: 'K2-c', cabeca, construcao: { commit: versao.commit, construido_em: versao.construido_em }, construcao_do_k2: { commit: versaoK2.commit }, partida: PARTIDA, medidas };
fs.writeFileSync(`${D}/medidas-k2-c.json`, JSON.stringify(saida, null, 2) + '\n');
for (const m of medidas) console.log(`${m.conhecido_positivo.encontrado ? '·' : '✗'} ${m.nome}: ${JSON.stringify(m.valor)}`);
process.exitCode = medidas.every((m) => m.conhecido_positivo.encontrado) ? 0 : 1;
