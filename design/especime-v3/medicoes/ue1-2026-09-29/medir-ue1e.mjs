/** UE1e: as medidas da passagem da forma do recibo da série, cada uma com o comando e um conhecido-positivo,
 * em medidas-ue1e.json.
 *
 * Não lê a rede. Lê os registos dos portões em `portoes/ue1e/`, o `dist/` construído da cabeça do código da
 * passagem, a declaração das definições, os manifestos das plantas (`plantas-ue1e.json`), das capturas
 * (`capturas-ue1e.json`) e das conferências entre os commits (`entre-commits-ue1e.json`), a saída do
 * `conferir-mapa.py`, e o `git` deste repositório. Com o caminho da worktree do motor como argumento, lê
 * também a cabeça dele (e não o escreve).
 *
 * O que se mede aqui com código próprio, e não pelo portão que o protege: a definição de cada um dos 20
 * recibos das séries, refeita da declaração com a regra da forma (a do recibo da série onde existe, a do
 * cartão onde não existe); o nome de Portugal em cada uma; e a forma nova contra o texto que o lugar de
 * direção escreveu no pedido da passagem e contra a pergunta do cartão sem o lugar.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/medir-ue1e.mjs [<worktree do motor>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { DEFINICOES_DAS_MEDIDAS } from '../../../../src/data/figuras.mjs';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const aqui = (f) => path.join(RAIZ, PASTA, f);
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
const BASE = 'aba0a48b';
const CABECA = fs.readFileSync(aqui('portoes/ue1e/build.cabeca'), 'utf8').trim();
const ID = 'ihpc-variacao-homologa';
const SERIE = 'ihpc-variacao-homologa-paises';
/* O texto que o lugar de direção escreveu no pedido da passagem UE1e, copiado aqui como ele o escreveu. */
const PEDIDO = {
  pt: 'Quanto mudaram os preços no consumidor face ao mesmo mês do ano anterior, na medida harmonizada que permite comparar os países da União Europeia?',
  en: 'How much have consumer prices changed since the same month a year earlier, on the harmonised measure used to compare European Union countries?',
};
const NOMEIA_PORTUGAL = /\bPortugal\b|\bportugu[eê]s(?:es)?\b|\bportuguesas?\b|\bPortuguese\b/i;
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const texto = (e) => (e ? e.text.replace(/\s+/g, ' ').trim() : '');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const pagina = (rel) => parse(fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8'));
const juntar = (partes) => {
  if (!Array.isArray(partes)) return null;
  let t = '';
  for (const p of partes) {
    if (typeof p === 'string') t += p;
    else if (p && typeof p === 'object' && 'nl' in p) t += String(p.nl);
    else return null;
  }
  return norm(t);
};

/* ------------------------------------------------------------ os portões */
const log = (g) => fs.readFileSync(aqui(`portoes/ue1e/${g}.log`), 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = Number(fs.readFileSync(aqui(`portoes/ue1e/${g}.codigo`), 'utf8').trim());
  const cab = fs.readFileSync(aqui(`portoes/ue1e/${g}.cabeca`), 'utf8').trim();
  const ini = Date.parse(fs.readFileSync(aqui(`portoes/ue1e/${g}.inicio`), 'utf8').trim());
  const fim = Date.parse(fs.readFileSync(aqui(`portoes/ue1e/${g}.fim`), 'utf8').trim());
  medida(`codigo_do_${g}`, codigo, `cat ${PASTA}/portoes/ue1e/${g}.codigo`, `o registo da corrida é desta cabeça (${cab.slice(0, 8)})`, cab === CABECA);
  medida(`segundos_do_${g}`, Math.round((fim - ini) / 1000), `${PASTA}/portoes/ue1e/${g}.fim menos ${g}.inicio`, 'as duas horas leram-se', Number.isFinite(fim - ini));
}
const espera = fs.readFileSync(aqui('portoes/ue1e/espera.log'), 'utf8').split('\n').filter(Boolean);
const ensaio = fs.readFileSync(aqui('portoes/ue1e/espera-ensaio.txt'), 'utf8');
const vistosNoEnsaio = Number((/ensaio: (\d+) processo\(s\)/.exec(ensaio) ?? [])[1] ?? NaN);
medida('portoes_que_esperaram_antes_de_correr', espera.length, `as linhas de ${PASTA}/portoes/ue1e/espera.log, uma por portão`, `o detetor da espera, em ensaio, viu ${vistosNoEnsaio} processo(s) de construção a correr (${PASTA}/portoes/ue1e/espera-ensaio.txt)`, vistosNoEnsaio > 0);
const generosNoEnsaio = (g) => Number((new RegExp(`(\\d+) × ${g}`).exec(ensaio) ?? [])[1] ?? 0);
medida('ensaio_da_espera_processos', vistosNoEnsaio, `${PASTA}/portoes/ue1e/espera-ensaio.txt`, 'a linha do ensaio existe', /ensaio:/.test(ensaio));
medida('ensaio_da_espera_npm_run_verify', generosNoEnsaio('npm run verify'), 'o mesmo, os «npm run verify»', 'a linha do ensaio existe', /ensaio:/.test(ensaio));
medida('ensaio_da_espera_npm_run_build', generosNoEnsaio('npm run build'), 'o mesmo, os «npm run build»', 'a linha do ensaio existe', /ensaio:/.test(ensaio));
/* As decisões escritas que os ficheiros da passagem citam (o decisoes-em-vigor.py do lugar de direção, a M42),
   sobre o intervalo da passagem, com a saída guardada ao lado. */
const decisoes = fs.readFileSync(aqui('decisoes-em-vigor-ue1e.txt'), 'utf8');
const decisoesCodigo = Number((/^# código: (\d+)/m.exec(decisoes) ?? [])[1] ?? NaN);
medida('decisoes_em_vigor_codigo', decisoesCodigo, `a linha «# código:» de ${PASTA}/decisoes-em-vigor-ue1e.txt`, 'a linha existe', Number.isFinite(decisoesCodigo));
const ultima = /(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\)/.exec(decisoes);
const blocos = decisoes.split(/\n(?=§)/).filter((b) => b.startsWith('§'));
const pertoDoDiff = blocos.filter((b) => b.includes('(perto do diff)')).map((b) => b.split(' · ')[0]);
medida('decisoes_citadas_nos_ficheiros_da_passagem', ultima ? Number(ultima[1]) : null, `python3 scripts/leituras/decisoes-em-vigor.py --intervalo ${BASE}..<cabeça>, guardada em ${PASTA}/decisoes-em-vigor-ue1e.txt`, 'a linha final existe (o guião sai com 2 se o seu conhecido-positivo falhar)', ultima);
medida('ficheiros_lidos_pelo_decisoes_em_vigor', ultima ? Number(ultima[2]) : null, 'o mesmo', 'a linha final existe', ultima);
medida('decisoes_perto_do_diff', pertoDoDiff, 'o mesmo, as decisões com uma citação a menos de 40 linhas de um pedaço mudado', 'a lista leu-se', blocos.length > 0);
medida('decisoes_perto_do_diff_conta', pertoDoDiff.length, 'o mesmo, quantas', 'a lista leu-se', blocos.length > 0);
const ue1e = (g) => /UE1e: (\d+) recibo\(s\) das séries sem Portugal na definição, (\d+) com a forma do recibo da série \((\d+) declarada\(s\)\)/.exec(log(g));
for (const g of ['build', 'verify']) {
  const m = ue1e(g);
  medida(`portao_html_recibos_sem_portugal_no_${g}`, m ? Number(m[1]) : null, `a parte «UE1e:» da linha do gate:html no ${g}.log`, 'a linha existe', m);
  medida(`portao_html_recibos_com_a_forma_da_serie_no_${g}`, m ? Number(m[2]) : null, 'o mesmo', 'a linha existe', m);
  medida(`portao_html_formas_declaradas_no_${g}`, m ? Number(m[3]) : null, 'o mesmo', 'a linha existe', m);
}
const ue1d = /UE1d: (\d+) definição\(ões\) declarada\(s\) nos recibos das séries/.exec(log('build'));
medida('portao_html_definicoes_declaradas', ue1d ? Number(ue1d[1]) : null, 'a parte «UE1d:» da linha do gate:html no build.log', 'a linha existe', ue1d);

/* ------------------------------------------------------------ a declaração */
const ids = Object.keys(DEFINICOES_DAS_MEDIDAS);
const nomeiamNoCartao = ids.filter((id) => ['pt', 'en'].some((l) => NOMEIA_PORTUGAL.test(juntar(DEFINICOES_DAS_MEDIDAS[id][l]) ?? '')));
medida('definicoes_declaradas', ids.length, 'as entradas de DEFINICOES_DAS_MEDIDAS', 'a do índice harmonizado está entre elas', ids.includes(ID));
medida('definicoes_que_nomeiam_portugal_no_cartao', nomeiamNoCartao, 'as entradas cuja pergunta do cartão nomeia Portugal ou um gentílico, em alguma das duas edições', 'o detetor vê «em Portugal» numa frase de prova', NOMEIA_PORTUGAL.test('preços no consumidor em Portugal face'));
medida('definicoes_que_nomeiam_portugal_no_cartao_conta', nomeiamNoCartao.length, 'o mesmo, quantas', 'o mesmo', NOMEIA_PORTUGAL.test('preços no consumidor em Portugal face'));
const comForma = ids.filter((id) => DEFINICOES_DAS_MEDIDAS[id].serie);
medida('formas_do_recibo_da_serie_declaradas', comForma, 'as entradas com a forma do recibo da série (serie)', 'o detetor vê o campo numa entrada', comForma.length > 0);
const entrada = DEFINICOES_DAS_MEDIDAS[ID];
for (const lang of ['pt', 'en']) {
  const daSerie = juntar(entrada.serie?.[lang]);
  const doCartao = juntar(entrada[lang]);
  medida(`forma_igual_ao_pedido_${lang}`, daSerie === PEDIDO[lang], `a forma do recibo da série de ${ID} (${lang}) contra o texto do pedido da passagem, carácter a carácter`, 'o texto do pedido é outro que a pergunta do cartão', PEDIDO[lang] !== doCartao);
  medida(`forma_e_o_cartao_sem_o_lugar_${lang}`, daSerie === doCartao.replace(/ (?:em|in) Portugal\b/, ''), `a mesma forma contra a pergunta do cartão sem « em Portugal» ou « in Portugal»`, 'a pergunta do cartão diz o lugar', /(?:em|in) Portugal/.test(doCartao));
  medida(`forma_nomeia_portugal_${lang}`, NOMEIA_PORTUGAL.test(daSerie ?? ''), 'a mesma forma, pelo detetor do nome de Portugal', 'o detetor vê-o na pergunta do cartão', NOMEIA_PORTUGAL.test(doCartao));
}
medida('origens_da_forma', { origens_proprias: Object.prototype.hasOwnProperty.call(entrada.serie ?? {}, 'origens'), origens_da_entrada: entrada.origens }, 'a forma não declara origens próprias: as da entrada servem as duas formas', 'a entrada declara origens', entrada.origens.length > 0);

/* ------------------------------------------------------------ os recibos das séries no dist/ */
const idsSeries = fs.readdirSync(path.join(RAIZ, 'dist/livro-razao/series')).filter((x) => !x.startsWith('.')).sort();
const linhaDaSerie = (s) => String(load(fs.readFileSync(path.join(RAIZ, 'ledger/series', `${s}.yml`), 'utf8')).linha_de_portugal);
const recibos = [];
for (const s of idsSeries) {
  const linha = linhaDaSerie(s);
  const d = DEFINICOES_DAS_MEDIDAS[linha];
  for (const [lang, rel] of [['pt', `livro-razao/series/${s}/index.html`], ['en', `en/ledger/series/${s}/index.html`]]) {
    const r = pagina(rel);
    const el = r.querySelectorAll('[data-serie-o-que-conta]');
    const esperada = juntar((d?.serie ?? d)?.[lang]);
    const dito = el.length === 1 ? texto(el[0]) : null;
    recibos.push({ rel, forma: d?.serie ? 'serie' : 'cartao', igual: dito !== null && dito === esperada, nomeia: NOMEIA_PORTUGAL.test(dito ?? ''), tabelaNomeia: NOMEIA_PORTUGAL.test(texto(r.querySelector('[data-serie-tabela] [data-pais="PT"]'))), tabelaColada: NOMEIA_PORTUGAL.test(texto(r.querySelector('[data-serie-tabela]'))) });
  }
}
medida('recibos_de_serie', recibos.length, 'os recibos das séries no dist/, nas duas edições', 'o do índice harmonizado está entre eles', recibos.some((x) => x.rel.includes(SERIE)));
medida('recibos_com_a_definicao_da_forma_que_devem_usar', recibos.filter((x) => x.igual).length, 'os recibos cuja [data-serie-o-que-conta] é, carácter a carácter, a forma do recibo da série onde a declaração a tem e a do cartão onde não tem, refeita aqui', 'a comparação falha quando devia: a pergunta do cartão do índice harmonizado não é o texto do recibo dele', juntar(entrada.pt) !== texto(pagina(`livro-razao/series/${SERIE}/index.html`).querySelector('[data-serie-o-que-conta]')));
medida('recibos_com_a_forma_da_serie', recibos.filter((x) => x.forma === 'serie' && x.igual).length, 'o mesmo, os que usam a forma do recibo da série', 'a declaração tem a forma', Boolean(entrada.serie));
medida('recibos_cuja_definicao_nomeia_portugal', recibos.filter((x) => x.nomeia).length, 'o mesmo, as definições que nomeiam Portugal ou um gentílico', 'o mesmo detetor vê «Portugal» na célula do nome do país da tabela de cada recibo, fora da definição', recibos.every((x) => x.tabelaNomeia));
/* O LIMITE DO DETETOR, MEDIDO: as fronteiras de palavra. O texto da tabela inteira, como o leitor de HTML o
   junta, cola cada nome ao valor da célula ao lado («55,0Portugal93,6»), e aí o detetor não vê o nome. Numa
   definição, que é prosa, o nome tem espaços à volta. */
const colado = texto(pagina('livro-razao/series/divida-publica-2025-paises/index.html').querySelector('[data-serie-tabela]'));
const iColado = colado.indexOf('Portugal');
medida('exemplo_do_texto_colado', iColado >= 0 ? colado.slice(Math.max(0, iColado - 4), iColado + 12) : null, 'o texto inteiro da tabela do recibo português da dívida, como o leitor de HTML o junta, à volta de «Portugal»', 'o nome está no texto colado', iColado >= 0);
medida('tabelas_em_que_o_detetor_ve_portugal_no_texto_colado', recibos.filter((x) => x.tabelaColada).length, 'o detetor sobre o texto inteiro de cada tabela, com as células coladas pelo leitor de HTML', 'o detetor vê o nome na célula do país de cada tabela', recibos.every((x) => x.tabelaNomeia));
const cartoesDoIhpc = [];
const anda = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) anda(p);
    else if (e.name === 'index.html') {
      const bruto = fs.readFileSync(p, 'utf8');
      if (!bruto.includes(`data-cartao-definicao="${ID}"`)) continue;
      const rel = path.relative(path.join(RAIZ, 'dist'), p);
      const lang = rel.startsWith('en/') ? 'en' : 'pt';
      for (const el of parse(bruto).querySelectorAll(`[data-cartao-definicao="${ID}"]`)) cartoesDoIhpc.push({ rel, igual: texto(el) === juntar(entrada[lang]) });
    }
  }
};
anda(path.join(RAIZ, 'dist'));
medida('cartoes_do_ihpc_com_a_pergunta_do_cartao', cartoesDoIhpc.filter((x) => x.igual).length, `as frases [data-cartao-definicao="${ID}"] de todo o dist/ iguais à pergunta do cartão, que diz o lugar`, 'há cartões do índice harmonizado no dist/', cartoesDoIhpc.length > 0);
medida('cartoes_do_ihpc', cartoesDoIhpc.length, 'o mesmo, todas', 'o mesmo', cartoesDoIhpc.length > 0);

/* ------------------------------------------------------------ plantas, capturas, entre commits, mapa */
const plantas = JSON.parse(fs.readFileSync(aqui('plantas-ue1e.json'), 'utf8'));
medida('plantas', plantas.plantas, `${PASTA}/plantas-ue1e.json`, 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_que_morderam', plantas.mordidas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_do_nome_de_portugal', plantas.plantas_por_grupo?.portugal ?? 0, 'o mesmo, o grupo da regra nova', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_da_forma', plantas.plantas_por_grupo?.forma ?? 0, 'o mesmo, o grupo da forma que cada recibo deve usar', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_repostas_pelo_sha256', plantas.repostas_com_o_mesmo_sha256, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas', plantas.corridas_limpas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas_a_zero', plantas.corridas_limpas_a_zero, 'o mesmo (o controlo)', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
const capturas = JSON.parse(fs.readFileSync(aqui('capturas-ue1e.json'), 'utf8'));
const dasCapturas = capturas.cabeca_esperada === CABECA && capturas.plantas_vistas === capturas.plantas.length && capturas.plantas.length > 0;
medida('capturas', capturas.capturas, `${PASTA}/capturas-ue1e.json`, 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
for (const [t, n] of Object.entries(capturas.capturas_por_tipo)) medida(`capturas_${t}`, n, 'o mesmo, por tipo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_com_problema', capturas.problemas.length, 'o mesmo', 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
medida('capturas_plantas', capturas.plantas.length, 'o mesmo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_plantas_vistas', capturas.plantas_vistas, 'o mesmo', 'o manifesto tem plantas', capturas.plantas.length > 0);
medida('capturas_pedidos_para_fora', capturas.pedidos_recusados_para_fora, 'o mesmo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
const entre = JSON.parse(fs.readFileSync(aqui('entre-commits-ue1e.json'), 'utf8'));
medida('conferencias_entre_commits', entre.corridas, `${PASTA}/entre-commits-ue1e.json`, entre.conhecido_positivo.o_que, entre.conhecido_positivo.codigo_inexistente_nulo && entre.conhecido_positivo.mapa_antes_com_citacoes_longe);
medida('conferencias_entre_commits_a_zero', entre.corridas_a_zero, 'o mesmo', entre.conhecido_positivo.o_que, entre.conhecido_positivo.codigo_inexistente_nulo);
medida('mapa_antes_da_emenda_citacoes_longe', entre.mapa.antes_da_emenda.contas.no_ficheiro_mas_longe, 'o mesmo, o conferir-mapa antes da emenda do mapa', 'o registo tinha as contas', entre.mapa.antes_da_emenda.contas.conferidas_na_linha_citada > 0);
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
for (const [nome, caminhos, o_que] of [
  ['linhas_do_livro_mudadas', ['ledger/claims'], 'ledger/claims'],
  ['series_do_livro_mudadas', ['ledger/series', 'ledger/cruzamentos', 'src/data/paises-da-uniao.json'], 'as séries, os registos e a tabela dos nomes'],
  ['auditoria_das_perguntas_mudada', ['tests/cartao/perguntas-provadas.json'], 'a auditoria das perguntas (K16)'],
  ['leituras_mudadas', ['src/data/leituras-das-medidas.mjs', 'src/data/leituras-rp1.mjs', 'tests/cartao/leituras-provadas.json'], 'as leituras dos cartões e a sua auditoria'],
  ['inventario_das_frases_mudado', ['design/especime-v3/INVENTARIO-FRASES.md'], 'o inventário das frases'],
  ['brief_mudado', ['design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md'], 'o brief'],
  ['acertos_l1_mudado', ['design/especime-v3/medicoes/l1-2026-09-24'], 'a pasta do acertos-l1.py'],
  ['guiao_da_aterragem_mudado', ['scripts/aterrar.sh'], 'scripts/aterrar.sh'],
]) medida(nome, mudadas(caminhos).length, `git diff --name-only ${BASE} <cabeça> -- ${o_que}`, 'o mesmo comando vê o recibo da série mudado', controlo);
medida('commits_de_codigo_da_passagem', Number(git('rev-list', '--count', `${BASE}..${CABECA}`)), `git rev-list --count ${BASE}..<cabeça>`, 'a base é antepassada da cabeça', git('merge-base', '--is-ancestor', BASE, CABECA) === '');
if (process.argv[2]) {
  const motor = (...a) => execFileSync('git', a, { cwd: process.argv[2], encoding: 'utf8' }).trim();
  const cab = motor('rev-parse', 'HEAD');
  medida('motor_cabeca', cab.slice(0, 7), 'git rev-parse HEAD, na worktree do motor', 'é um commit', /^[0-9a-f]{40}$/.test(cab));
  medida('motor_commits_da_passagem', Number(motor('rev-list', '--count', 'e394307..HEAD')), 'git rev-list --count e394307..HEAD, na worktree do motor', 'a cabeça do UE1 é antepassada da cabeça', motor('merge-base', '--is-ancestor', 'e394307', 'HEAD') === '');
}
const custo = JSON.parse(fs.readFileSync(aqui('custo-ue1e.json'), 'utf8'));
for (const [k, v] of Object.entries(custo.medidas)) medida(`custo_${k}`, v.valor, v.comando, v.o_que, v.encontrado);

const saida = { bloco: 'UE1e', cabeca_do_codigo: CABECA, base: BASE, guiao: `${PASTA}/medir-ue1e.mjs`, medidas };
fs.writeFileSync(aqui('medidas-ue1e.json'), JSON.stringify(saida, null, 2) + '\n');
const sem = medidas.filter((x) => !x.conhecido_positivo.encontrado);
console.log(`UE1e medidas: ${medidas.length} medida(s), ${sem.length} sem o conhecido-positivo encontrado`);
for (const x of sem) console.log(`  x ${x.nome}`);
process.exit(sem.length ? 1 : 0);
