/** K2: as medidas do bloco, escritas em `medidas.json` ao lado deste guião. Cada medição traz o nome, o valor, o comando
 * que a repete e um conhecido-positivo: uma coisa que o MESMO detetor tem de encontrar (na construção de base do bloco,
 * guardada fora do repositório, na cabeça de partida, ou numa planta em memória). Lê também os ficheiros que os outros
 * guiões do bloco escreveram (as capturas, o inventário, as folhas mudadas, a origem nova, as plantas, os portões, o
 * custo), para que cada número do relatório tenha o seu ficheiro.
 * Uso, da raiz da worktree, depois de construir a cabeça final:
 *   node design/especime-v3/medicoes/k2-2026-10-02/medir-k2.mjs <cabeça de partida> <pasta da construção de base>
 * A pasta da construção de base fica fora do repositório e o ficheiro não a nomeia: guarda a cabeça que o seu
 * `version.json` diz. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';

const [BASE, DIST_BASE] = process.argv.slice(2);
if (!BASE || !DIST_BASE) throw new Error('Uso: medir-k2.mjs <cabeça de partida> <pasta da construção de base>');
const D = 'design/especime-v3/medicoes/k2-2026-10-02';
const DIST = 'dist';
const lerJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const mostrar = (f) => execFileSync('git', ['show', `${BASE}:${f}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = lerJson(path.join(DIST, 'version.json'));
const versaoBase = lerJson(path.join(DIST_BASE, 'version.json'));
const medidas = [];
const medicao = (nome, valor, comando, oQue, encontrado, extra = {}) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) }, ...extra });
const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

/* 1 · OS CARTÕES DOS QUADROS COM VARIAÇÃO SOB UM NOME DE NÍVEL, pelo detetor do §0 do brief (o mesmo do guião
   `design/observatorio/medidas/BRIEF-K2.py`), na árvore e na cabeça de partida. */
function variacaoSobNivel(fig) {
  const blocos = fig.split(/\n\s*\{\s*\n\s*claim: '/).slice(1);
  const out = [];
  for (const b of blocos) {
    const id = b.split("'")[0];
    const nome = /nome: \{ pt: '([^']*)'/.exec(b);
    const med = /pt: \['([^']*)'/.exec(b);
    if (nome && med && /^(Variação|Mudança)/.test(med[1]) && !/variação|em três anos|mudança/i.test(nome[1])) out.push(id);
  }
  return out;
}
const agora1 = variacaoSobNivel(fs.readFileSync('src/data/figuras.mjs', 'utf8'));
const antes1 = variacaoSobNivel(mostrar('src/data/figuras.mjs'));
medicao('cartoes_dos_quadros_com_variacao_sob_nome_de_nivel', agora1.length, 'o detetor do §0 do brief sobre src/data/figuras.mjs da árvore (as entradas cuja medida começa por «Variação» e cujo nome não diz a variação)',
  `o mesmo detetor na cabeça de partida acha ${antes1.length}, com a taxa de atividade`, antes1.includes('taxa-de-actividade-2025'), { antes: antes1.length, lista_antes: antes1, lista_agora: agora1 });

/* 2 · O MESMO PELO TESTE DE ACEITAÇÃO, EM TODOS OS CARTÕES NACIONAIS: os cartões das páginas de assunto cujo valor é uma
   variação (a unidade da linha diz «variação», ou a linha é uma variação de um índice de preços) e cujo nome não o diz. */
const { ENTRADAS } = await import(pathToFileURL(path.resolve('src/data/primeira-pagina.mjs')).href);
const rotasDosAssuntos = ENTRADAS.filter((e) => e.seccoes?.length).map((e) => e.rota.pt.replace(/^\//, ''));
function variacaoNosAssuntos(dist) {
  const out = new Set();
  for (const r of rotasDosAssuntos) {
    const f = path.join(dist, r, 'index.html');
    if (!fs.existsSync(f)) continue;
    for (const c of parse(fs.readFileSync(f, 'utf8')).querySelectorAll('article[data-cartao-medida]')) {
      const id = c.getAttribute('data-cartao-medida');
      const nome = normal(c.querySelector('.cartao-medida-nome')?.textContent);
      const unidade = normal(c.querySelector('[data-linha-campo="unit"]')?.textContent);
      const variacao = /variaç/i.test(unidade) || /variacao/.test(id);
      const diz = /variaç|inflaç|crescimento/i.test(nome);
      if (variacao && !diz) out.add(id);
    }
  }
  return [...out].sort();
}
const agora2 = variacaoNosAssuntos(DIST);
const antes2 = variacaoNosAssuntos(DIST_BASE);
medicao('cartoes_nacionais_com_variacao_sob_nome_de_nivel', agora2.length, 'as páginas de assunto construídas: os cartões cuja unidade diz «variação» ou cuja linha é uma variação de preços, e cujo nome não diz a variação, a inflação nem o crescimento',
  `o mesmo detetor na construção de base acha ${antes2.length}, com a taxa de atividade`, antes2.includes('taxa-de-actividade-2025'), { antes: antes2.length, lista_antes: antes2, lista_agora: agora2 });

/* 3 · A UNIDADE DA DIFERENÇA DE EMPREGO, que fica como a fonte a escreve. */
const disp = load(fs.readFileSync('ledger/claims/disparidade-de-emprego-entre-sexos-2025.yml', 'utf8'));
medicao('unidade_da_disparidade_de_emprego', disp.unit, 'ledger/claims/disparidade-de-emprego-entre-sexos-2025.yml · unit', 'a linha é do Eurostat', disp.source === 'Eurostat');

/* 4 · A FRASE DA DIFERENÇA ENTRE DUAS TAXAS EM PONTOS PERCENTUAIS, no cartão (na dobra) e no recibo, nas duas edições. */
const sitiosDaFrase = [
  ['emprego/index.html', '[data-cartao-medida="disparidade-de-emprego-entre-sexos-2025"] details.cartao-medida-dobra', 'em pontos percentuais'],
  ['en/employment/index.html', '[data-cartao-medida="disparidade-de-emprego-entre-sexos-2025"] details.cartao-medida-dobra', 'in percentage points'],
  ['livro-razao/disparidade-de-emprego-entre-sexos-2025/index.html', '[data-definicao="disparidade-de-emprego-entre-sexos-2025"]', 'em pontos percentuais'],
  ['en/ledger/disparidade-de-emprego-entre-sexos-2025/index.html', '[data-definicao="disparidade-de-emprego-entre-sexos-2025"]', 'in percentage points'],
];
const comFrase = sitiosDaFrase.filter(([f, sel, frase]) => normal(parse(fs.readFileSync(path.join(DIST, f), 'utf8')).querySelector(sel)?.textContent).includes(frase));
const positivoFrase = normal(parse(fs.readFileSync(path.join(DIST, 'emprego/index.html'), 'utf8')).querySelector('[data-cartao-medida="taxa-de-actividade-2025"]')?.textContent).includes('pontos percentuais');
medicao('frase_da_diferenca_em_pontos_percentuais_no_cartao_e_no_recibo', comFrase.length, 'o cartão da diferença de emprego (a dobra) e o recibo da linha (o bloco da pergunta), nas duas edições, contam se dizem «em pontos percentuais» ou «in percentage points»',
  'o mesmo detetor acha «pontos percentuais» no cartão da taxa de atividade', positivoFrase, { de: sitiosDaFrase.length, sitios: comFrase.map(([f]) => f) });

/* 5 · AS CASAS DECIMAIS DO EXCERTO, pela célula do ledger:check, e as suas plantas em memória. */
const { loadClaims } = await import(pathToFileURL(path.resolve('src/lib/ledger.mjs')).href);
const { conferirCasasDecimais, plantasDasCasasDecimais } = await import(pathToFileURL(path.resolve('scripts/casas-decimais.mjs')).href);
const linhas = loadClaims();
const casas = conferirCasasDecimais(linhas.values());
const plantasCasas = plantasDasCasasDecimais(linhas);
medicao('linhas_sem_derivacao_com_menos_casas_do_que_o_excerto', casas.erros.length, 'node scripts/check-ledger.mjs (a célula das casas decimais, scripts/casas-decimais.mjs)',
  'a planta da linha dos jovens com o valor antigo («8» contra «8.0») morde', plantasCasas[0]?.mordeu, { contas: casas.contas, plantas: plantasCasas.length, plantas_certas: plantasCasas.filter((p) => p.certo).length });
const plantasDoPortao = lerJson(`${D}/plantas-casas-decimais.json`).plantas;
medicao('plantas_do_portao_das_casas_decimais_que_morderam', plantasDoPortao.filter((p) => p.mordeu && p.linha_real_intacta).length, `node ${D}/plantas-casas-decimais.mjs (o ledger:check sobre uma cópia estragada do livro)`,
  'a planta do crédito malparado arredondado morde', plantasDoPortao.some((p) => p.linha === 'credito-malparado-2025' && p.mordeu), { de: plantasDoPortao.length });

/* 6 · AS DUAS CORREÇÕES E A RECONTAGEM, pelo mecanismo. */
const historias = lerJson('ledger/historias-valores.json');
const doisValores = ['jovens-nem-2025', 'fluxo-de-credito-as-empresas-2025'].map((id) => { const l = linhas.get(id); return { id, valor: l.value, entrada: l.corrections.at(-1), seladas: historias[id]?.length ?? 0 }; });
const contador = linhas.get('correcoes-publicadas');
const contadas = [...linhas.values()].reduce((n, l) => n + (l.corrections ?? []).filter((e) => e.kind === 'correcao').length, 0);
medicao('linhas_corrigidas_pelo_mecanismo', doisValores.filter((x) => x.entrada?.kind === 'correcao' && x.entrada?.date === '2026-10-02' && x.seladas >= 1).length, 'ledger/claims/<id>.yml (a última entrada de corrections) e ledger/historias-valores.json',
  'o mesmo leitor acha a correção do E0 na taxa de desemprego (6 para 6,0)', linhas.get('taxa-de-desemprego-2025').corrections.some((e) => e.kind === 'correcao' && e.new_value === '6,0'), { linhas: doisValores });
medicao('correcoes_publicadas', contador.value, 'ledger/claims/correcoes-publicadas.yml · value, e a contagem direta das entradas «correcao» do livro',
  `a contagem direta das entradas «correcao» do livro dá ${contadas}`, String(contadas) === contador.value, { recontagem: contador.corrections.at(-1), entradas_seladas: historias['correcoes-publicadas']?.length ?? 0, contadas });

/* 7 · OS TERMOS DAS LEITURAS DOS ESTUDOS SEM EXPLICAÇÃO, nos campos que se rendem (a frase, o nome das medidas, a nota),
   na árvore e na cabeça de partida (importada de uma pasta temporária, como em acertos-k2.mjs). */
const TERMOS = [
  { termo: /designaç(ões|ão)|designations?/i, explica: /um pelouro é uma área|a portfolio is an area/i },
  { termo: /localizações de projeto vencidas|overdue project locations/i, explica: /data prevista de conclusão já passou|planned completion date has passed/i },
  { termo: /atuarialmente|actuarially/i, explica: /o corte que pagaria exatamente|the cut that would exactly pay/i },
];
const textoDe = (x) => (Array.isArray(x) ? x.map(textoDe).join('') : typeof x === 'string' ? x : '');
function termosSemExplicacao(LEITURAS) {
  let ocorrencias = 0, sem = 0;
  const lista = [];
  for (const [id, l] of Object.entries(LEITURAS)) for (const lang of ['pt', 'en']) {
    const frase = textoDe(l.frase?.[lang]);
    const nota = textoDe(l.medidasNota?.[lang]);
    const nomes = (l.medidas ?? []).map((m) => textoDe(m.nome?.[lang]));
    for (const t of TERMOS) {
      if (t.termo.test(frase)) { ocorrencias++; if (!t.explica.test(frase)) { sem++; lista.push(`${id} · ${lang} · frase`); } }
      for (const n of nomes) if (t.termo.test(n)) { ocorrencias++; if (!t.explica.test(nota)) { sem++; lista.push(`${id} · ${lang} · nome de medida`); } }
    }
  }
  return { ocorrencias, sem, lista };
}
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'k2-medir-'));
let termosAntes;
try {
  const dados = path.join(pasta, 'src', 'data');
  fs.mkdirSync(dados, { recursive: true });
  for (const f of fs.readdirSync('src/data')) if (/\.(mjs|json)$/.test(f)) { try { fs.writeFileSync(path.join(dados, f), mostrar(`src/data/${f}`)); } catch { fs.copyFileSync(path.join('src/data', f), path.join(dados, f)); } }
  fs.cpSync('src/lib', path.join(pasta, 'src', 'lib'), { recursive: true });
  fs.cpSync('src/i18n', path.join(pasta, 'src', 'i18n'), { recursive: true });
  for (const d of fs.readdirSync('src/data', { withFileTypes: true })) if (d.isDirectory()) fs.cpSync(path.join('src/data', d.name), path.join(dados, d.name), { recursive: true });
  fs.symlinkSync(path.resolve('ledger'), path.join(pasta, 'ledger'));
  fs.symlinkSync(path.resolve('node_modules'), path.join(pasta, 'node_modules'));
  const cwd = process.cwd();
  process.chdir(pasta);
  termosAntes = termosSemExplicacao((await import(pathToFileURL(path.join(dados, 'leituras.mjs')).href)).LEITURAS);
  process.chdir(cwd);
} finally {
  fs.rmSync(pasta, { recursive: true, force: true });
}
const termosAgora = termosSemExplicacao((await import(pathToFileURL(path.resolve('src/data/leituras.mjs')).href)).LEITURAS);
medicao('termos_dos_estudos_sem_explicacao', termosAgora.sem, 'src/data/leituras.mjs: cada designação de pelouro, localização de projeto vencida e valor atuarialmente neutro numa frase ou num nome de medida, e se a frase (ou a nota das medidas, para um nome) diz o que o termo é',
  `o mesmo detetor na cabeça de partida acha ${termosAntes.sem} sem explicação em ${termosAntes.ocorrencias}`, termosAntes.sem > 0, { ocorrencias: termosAgora.ocorrencias, antes: termosAntes.sem, ocorrencias_antes: termosAntes.ocorrencias, lista_antes: termosAntes.lista });
const brutoAgora = ['designações', 'localizações de projeto vencidas', 'atuarialmente'].reduce((n, t) => n + fs.readFileSync('src/data/leituras.mjs', 'utf8').split(t).length - 1, 0);
medicao('ocorrencias_brutas_dos_tres_termos', brutoAgora, 'o detetor do §0 do brief sobre src/data/leituras.mjs da árvore (as três cadeias contadas no ficheiro inteiro, com a origem registada e os comentários)',
  'o mesmo detetor na cabeça de partida dá 11, o número do §0', ['designações', 'localizações de projeto vencidas', 'atuarialmente'].reduce((n, t) => n + mostrar('src/data/leituras.mjs').split(t).length - 1, 0) === 11);

/* 8 · O FORMATO DOS NÚMEROS, pela célula nova, na construção do bloco e na de base. */
const { conferirFormatoDosNumeros, plantasDoFormato } = await import(pathToFileURL(path.resolve('tests/inicio/formato-dos-numeros.mjs')).href);
const formato = conferirFormatoDosNumeros(DIST);
const formatoBase = conferirFormatoDosNumeros(DIST_BASE);
const plantasFormato = plantasDoFormato(DIST);
medicao('desvios_do_formato_dos_numeros', formato.desvios.length, 'node tests/inicio/formato-dos-numeros.mjs --prova (o check:formato)',
  `a mesma célula na construção de base acha ${formatoBase.desvios.length} desvios`, formatoBase.desvios.length > 0,
  { contas: formato.contas, contas_base: formatoBase.contas, plantas: plantasFormato.length, plantas_mordidas: plantasFormato.filter((p) => p.mordeu).length });

/* 9 · A ORDEM DO CARTÃO (K19), em todas as páginas com cartões, na construção do bloco e na de base. */
const { conferirOrdemDaPagina, plantasDaOrdem } = await import(pathToFileURL(path.resolve('tests/cartao/ordem.mjs')).href);
function ordem(dist) {
  const c = { paginas: 0, cartoes: 0, com_dobra: 0, faixa_da_uniao: 0, erros: 0 };
  const anda = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) anda(f); else if (e.name.endsWith('.html')) {
    const html = fs.readFileSync(f, 'utf8');
    if (!html.includes('cartao-medida') && !html.includes('data-faixa')) continue;
    const lang = /<html[^>]*lang="en/.test(html) ? 'en' : 'pt';
    const r = conferirOrdemDaPagina(parse(html), lang, f);
    c.paginas++; c.cartoes += r.contas.cartoes; c.com_dobra += r.contas.com_dobra; c.faixa_da_uniao += r.contas.faixa_da_uniao; c.erros += r.erros.length;
  } } };
  anda(dist);
  return c;
}
const ordemAgora = ordem(DIST);
const ordemBase = ordem(DIST_BASE);
const plantasOrdem = plantasDaOrdem((rel) => fs.readFileSync(path.join(DIST, rel), 'utf8'));
medicao('cartoes_fora_da_ordem', ordemAgora.erros, 'node tests/cartao/cartao.mjs --prova (a K19 do check:cartao, tests/cartao/ordem.mjs)',
  `a mesma célula na construção de base acha ${ordemBase.erros} queixas`, ordemBase.erros > 0, { contas: ordemAgora, contas_base: ordemBase, plantas: plantasOrdem.length, plantas_mordidas: plantasOrdem.filter((p) => p.mordeu).length });

/* 10 · AS CAPTURAS, e a ordem dos cartões a 390 px, lidas dos manifestos do captor. */
const depois = lerJson(`${D}/capturas-depois.json`);
const antes = lerJson(`${D}/capturas-antes.json`);
const a390 = (m) => m.resultados.filter((r) => r.largura === 390).flatMap((r) => r.medidas.cartoes.map((c) => ({ ...c, pagina: r.pagina, lang: r.lang })));
const ordemCerta = (c) => (c.ecra[0] === 'nome' || c.ecra[0] === undefined) && !c.definicao_fora_da_dobra && (!c.ecra.includes('dobra') || c.ecra.at(-1) === 'dobra' || c.ecra.at(-1) === 'selo');
const cartoes390 = a390(depois);
const cartoes390Antes = a390(antes);
medicao('capturas_depois', depois.capturas, `node ${D}/captar-k2.mjs depois`, 'o manifesto da construção de base tem as capturas de antes', antes.capturas > 0, { problemas: depois.problemas.length, larguras: depois.larguras, antes: antes.capturas });
medicao('cartoes_a_390_com_a_ordem_do_brief', cartoes390.filter(ordemCerta).length, `${D}/capturas-depois.json: os cartões a 390 px cuja ordem no ecrã abre pelo nome e acaba na dobra, sem definição fora dela`,
  `o mesmo detetor nas capturas de antes acha ${cartoes390Antes.filter((c) => c.definicao_fora_da_dobra || !ordemCerta(c)).length} cartões fora da ordem`, cartoes390Antes.some((c) => !ordemCerta(c)), { de: cartoes390.length, antes_fora: cartoes390Antes.filter((c) => !ordemCerta(c)).length, antes_de: cartoes390Antes.length });

/* 10b · OS VALORES DA FAIXA DA UNIÃO À MESMA ALTURA (§1.108), em cada captura da página da União depois do bloco. */
const daUniao = depois.resultados.filter((r) => r.pagina === 'uniao');
medicao('capturas_da_uniao_com_os_valores_a_uma_so_altura', daUniao.filter((r) => r.medidas.alturas_do_valor_na_faixa?.length === 1).length, `${D}/capturas-depois.json: as alturas distintas do valor de cada cartão da faixa, relativas ao topo do cartão`,
  'o mesmo detetor sobre o topo dos nomes acha mais do que uma altura numa das capturas', daUniao.some((r) => (r.medidas.alturas_do_topo_do_nome_na_faixa?.length ?? 0) > 1), { de: daUniao.length });

/* 10c · O ALVO DA DOBRA E A ÁREA DO SELO DE CIMA, pelo guião do bloco. */
if (fs.existsSync(`${D}/alvos-da-dobra.json`)) {
  const ad = lerJson(`${D}/alvos-da-dobra.json`);
  medicao('linhas_da_dobra_com_um_ponto_de_outro_elemento', ad.linhas_com_falha, `node ${D}/alvos-da-dobra.mjs <saída.json>`,
    `a mesma medida com a margem antiga da dobra acha ${ad.conhecido_positivo.linhas_com_falha} linhas com falha, todas num selo`, ad.conhecido_positivo.linhas_com_falha > 0 && ad.conhecido_positivo.todas_num_selo, { de: ad.linhas_medidas, construcao: ad.construcao.commit });
}

/* 11 · O INVENTÁRIO, AS FOLHAS MUDADAS, A ORIGEM NOVA, AS DECISÕES, O CUSTO E OS PORTÕES, dos ficheiros dos guiões. */
const inv = lerJson(`${D}/inventario-k2.json`);
medicao('linhas_do_inventario_retiradas', inv.retiradas.length, `python3 ${D}/inventario-k2.py`, 'uma das retiradas é a leitura inteira da taxa de emprego', inv.retiradas.some((r) => r.texto.startsWith('É a parte das pessoas dos aos anos que tem emprego.')), { novas: inv.novas.length });
const ac = lerJson(`${D}/acertos-k2.json`);
medicao('folhas_mudadas_nas_leituras_e_perguntas', ac.mudancas, `node ${D}/acertos-k2.mjs ${BASE} <saída>`, 'o mesmo comparador acha a folha mudada da diferença de emprego', ac.lista.some((m) => m.id === 'disparidade-de-emprego-entre-sexos-2025'), { fora_da_lista: ac.fora_da_lista });
const org = lerJson(`${D}/origens-k2.json`);
medicao('origem_nova_conferida_contra_os_bytes', org.resultados.filter((r) => !r.conhecido_positivo && r.pdf_confere && r.extracao_confere && r.excerto_no_texto && r.hora_confere).length, `python3 ${D}/origens-k2.py <saída>`,
  'o conhecido-positivo, a origem que o L1 recortou do mesmo PDF, confere', org.resultados.some((r) => r.conhecido_positivo && r.pdf_confere && r.excerto_no_texto));
if (fs.existsSync(`${D}/decisoes-em-vigor-intervalo.txt`)) {
  const dec = fs.readFileSync(`${D}/decisoes-em-vigor-intervalo.txt`, 'utf8').split('\n').filter((l) => l.startsWith('§'));
  medicao('decisoes_citadas_nos_ficheiros_tocados', dec.length, `python3 scripts/leituras/decisoes-em-vigor.py --intervalo ${BASE}..<cabeça>`, 'a §1.127 (a ordem da habitação e a T10) está na lista', dec.some((l) => l.startsWith('§1.127 ')));
}
const ci = lerJson(`${D}/custo-inicio.json`);
if (fs.existsSync(`${D}/custo-fim.json`)) {
  const cf = lerJson(`${D}/custo-fim.json`);
  medicao('simbolos_gastos_ate_ao_relatorio', ci.simbolos_restantes_no_inicio - cf.simbolos_restantes_no_fim, `${D}/custo-inicio.json e ${D}/custo-fim.json (a diferença das duas leituras do contador)`, 'o contador do início é o da primeira mensagem', ci.simbolos_restantes_no_inicio > cf.simbolos_restantes_no_fim,
    { segundos: Math.round((Date.parse(cf.fim_utc) - Date.parse(ci.inicio_utc)) / 1000) });
}
if (fs.existsSync(`${D}/portoes/build.codigo`)) {
  const p = (g) => ({ codigo: Number(fs.readFileSync(`${D}/portoes/${g}.codigo`, 'utf8').trim()), segundos: Math.round((Date.parse(fs.readFileSync(`${D}/portoes/${g}.fim`, 'utf8').trim()) - Date.parse(fs.readFileSync(`${D}/portoes/${g}.inicio`, 'utf8').trim())) / 1000) });
  const g = { build: p('build'), verify: p('verify'), typecheck: p('typecheck'), cabeca: fs.readFileSync(`${D}/portoes/cabeca`, 'utf8').trim() };
  medicao('portoes_a_zero', ['build', 'verify', 'typecheck'].filter((k) => g[k].codigo === 0).length, `sh scripts/leituras/portoes.sh <worktree> ${D}/portoes`, 'os três códigos leem-se de ficheiros acabados de escrever', true, { portoes: g });
}

const saida = { bloco: 'K2', cabeca, construcao: { commit: versao.commit, construido_em: versao.construido_em }, base: { cabeca: BASE, construcao: versaoBase.commit }, medidas };
fs.writeFileSync(`${D}/medidas.json`, JSON.stringify(saida, null, 2) + '\n');
for (const m of medidas) console.log(`${m.conhecido_positivo.encontrado ? '·' : '✗'} ${m.nome}: ${JSON.stringify(m.valor)}`);
process.exitCode = medidas.every((m) => m.conhecido_positivo.encontrado) ? 0 : 1;
