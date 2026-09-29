/** UE1c: as medidas da passagem de correção, cada uma com o comando e um conhecido-positivo, em medidas-ue1c.json.
 *
 * Não lê a rede. Lê os registos dos portões em `portoes/ue1c/`, o `dist/` construído da cabeça do código
 * da passagem, as declarações (a da média europeia calada, em `src/data/figuras.mjs`), os manifestos das
 * plantas (`plantas-ue1c.json`), das capturas (`capturas-ue1c.json`) e das conferências entre os commits
 * (`entre-commits-ue1c.json`), a saída do `conferir-mapa.py`, e o `git` deste repositório. Com o caminho da
 * worktree do motor como argumento, lê também a cabeça dele (e não o escreve).
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/medir-ue1c.mjs [<worktree do motor>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { FIGURAS } from '../../../../src/data/figuras.mjs';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const aqui = (f) => path.join(RAIZ, PASTA, f);
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
const BASE = '96a6035e';
const CABECA = fs.readFileSync(aqui('portoes/ue1c/build.cabeca'), 'utf8').trim();
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const texto = (e) => (e ? e.text.replace(/\s+/g, ' ').trim() : '');
const pagina = (rel) => parse(fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8'));

/* ------------------------------------------------------------ os portões */
const log = (g) => fs.readFileSync(aqui(`portoes/ue1c/${g}.log`), 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = Number(fs.readFileSync(aqui(`portoes/ue1c/${g}.codigo`), 'utf8').trim());
  const cab = fs.readFileSync(aqui(`portoes/ue1c/${g}.cabeca`), 'utf8').trim();
  const ini = Date.parse(fs.readFileSync(aqui(`portoes/ue1c/${g}.inicio`), 'utf8').trim());
  const fim = Date.parse(fs.readFileSync(aqui(`portoes/ue1c/${g}.fim`), 'utf8').trim());
  medida(`codigo_do_${g}`, codigo, `cat ${PASTA}/portoes/ue1c/${g}.codigo`, `o registo da corrida é desta cabeça (${cab.slice(0, 8)})`, cab === CABECA);
  medida(`segundos_do_${g}`, Math.round((fim - ini) / 1000), `${PASTA}/portoes/ue1c/${g}.fim menos ${g}.inicio`, 'as duas horas leram-se', Number.isFinite(fim - ini));
}
const f19 = /(\d+) plantas das palavras a morder, (\d+) plantas dos empates a morder/.exec(log('build'));
medida('f19_plantas_dos_empates', f19 ? Number(f19[2]) : null, 'a linha da F19 do check:formas no build.log', 'a linha existe', f19);
const k18 = /empates num extremo, em memória \(K18, UE1c\)\s+(\d+) planta\(s\) a morder/.exec(log('verify'));
medida('k18_plantas_dos_empates', k18 ? Number(k18[1]) : null, 'a linha dos empates da K18 no verify.log', 'a linha existe', k18);
const html = /UE1c: (\d+) frase\(s\) do que a medida conta nos recibos das séries, (\d+) recibo\(s\) sem ela/.exec(log('build'));
medida('portao_html_frases_do_que_conta', html ? Number(html[1]) : null, 'a parte «UE1c:» da linha do gate:html no build.log', 'a linha existe', html);
medida('portao_html_recibos_sem_frase', html ? Number(html[2]) : null, 'o mesmo', 'a linha existe', html);
const k17 = /leituras dos cartões nacionais \(K17\)\s+(\d+) em (\d+) cartões/.exec(log('verify'));
medida('k17_cartoes_com_leitura', k17 ? Number(k17[1]) : null, 'a linha da K17 no verify.log', 'a linha existe', k17);

/* ------------------------------------------------------------ o dist/ da cabeça */
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist/version.json'), 'utf8'));
medida('dist_da_cabeca', versao.commit === CABECA, 'dist/version.json contra portoes/ue1c/build.cabeca', 'o carimbo tem um commit', /^[0-9a-f]{40}$/.test(versao.commit));
const ids = fs.readdirSync(path.join(RAIZ, 'dist/livro-razao/series')).filter((x) => !x.startsWith('.')).sort();
const comFrase = ids.filter((id) => pagina(`livro-razao/series/${id}/index.html`).querySelector('[data-serie-o-que-conta]'));
const semFrase = ids.filter((id) => !comFrase.includes(id));
const comFraseEn = ids.filter((id) => pagina(`en/ledger/series/${id}/index.html`).querySelector('[data-serie-o-que-conta]'));
medida('series_com_a_frase_do_que_conta', comFrase, 'os recibos portugueses das séries com [data-serie-o-que-conta]', 'o da pobreza tem', comFrase.includes('risco-de-pobreza-ou-exclusao-2025-paises'));
medida('series_com_a_frase_do_que_conta_conta', comFrase.length, 'o mesmo, quantas', 'o dos inquilinos tem', comFrase.includes('sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises'));
medida('series_sem_a_frase_do_que_conta', semFrase, 'o mesmo, as que não a têm', 'o do rácio S80/S20 não a tem', semFrase.includes('racio-s80-s20-2025-paises'));
medida('series_sem_a_frase_do_que_conta_conta', semFrase.length, 'o mesmo, quantas', 'o detetor vê a frase do da dívida', comFrase.includes('divida-publica-2025-paises'));
medida('as_duas_edicoes_com_as_mesmas_series', comFrase.join(',') === comFraseEn.join(','), 'os recibos ingleses com a frase contra os portugueses', 'a edição inglesa da pobreza tem', comFraseEn.includes('risco-de-pobreza-ou-exclusao-2025-paises'));
const DEZ = ['divida-publica-2025', 'ihpc-variacao-homologa', 'taxa-de-emprego-2025', 'taxa-de-desemprego-mip-2025', 'desemprego-de-longa-duracao-2025', 'risco-de-pobreza-ou-exclusao-2025', 'racio-s80-s20-2025', 'sobrecarga-do-custo-da-habitacao-2025', 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025', 'precos-da-habitacao-2025'];
const COMPARA = {
  pt: /(Está (acima|abaixo|ao nível) da média da União Europeia|É (maior do que na|menor do que na|igual à da) média da União Europeia|A variação é (maior|menor) do que a da (média da )?União Europeia|A variação é igual à da (média da )?União Europeia)/,
  en: /(Above|Below|Level with) the European Union average|It is (wider|narrower) than the European Union average|It is the same as the European Union average|The change is (larger|smaller) than the European Union|The change is the same as the European Union/,
};
for (const [lang, rel] of [['pt', 'temas/index.html'], ['en', 'en/themes/index.html']]) {
  const r = pagina(rel);
  const leituras = DEZ.map((id) => [id, texto(r.querySelector(`[data-cartao-medida="${id}"] [data-cartao-leitura]`))]);
  const com = leituras.filter(([, t]) => COMPARA[lang].test(t)).map(([id]) => id);
  medida(`cartoes_com_a_comparacao_com_a_uniao_${lang}`, com.length, `as leituras dos dez cartões na página dos temas (${lang}) com a frase da comparação com a União`, 'a da dívida tem', com.includes('divida-publica-2025'));
  medida(`cartoes_sem_a_comparacao_com_a_uniao_${lang}`, DEZ.filter((id) => !com.includes(id)), 'o mesmo, os que não a têm', 'a leitura do cartão da sobrecarga no total leu-se', leituras.find(([id]) => id === 'sobrecarga-do-custo-da-habitacao-2025')[1].length > 0);
}
const calada = FIGURAS.find((f) => f.claim === 'sobrecarga-do-custo-da-habitacao-2025')?.semMediaEuropeia ?? null;
medida('decisao_que_cala_a_media_europeia', calada?.decisao ?? null, 'src/data/figuras.mjs, a entrada da sobrecarga do custo da habitação, semMediaEuropeia.decisao', 'a razão fala do B2', /B2/.test(calada?.razao ?? ''));
const cartaoCalado = pagina('temas/index.html').querySelector('[data-cartao-medida="sobrecarga-do-custo-da-habitacao-2025"]');
medida('pontos_da_uniao_da_faixa_no_cartao_calado', cartaoCalado.querySelectorAll('[data-ponto="sobrecarga-do-custo-da-habitacao-2025-paises#EU27_2020"]').length + cartaoCalado.querySelectorAll('[data-faixa-marca="sobrecarga-do-custo-da-habitacao-2025-paises#EU27_2020"]').length, 'no cartão da sobrecarga no total, na página portuguesa dos temas, o valor e a marca da União da faixa', 'o cartão tem a faixa', cartaoCalado.querySelector('[data-faixa-ue]'));
medida('marcas_que_a_k14_conta_no_cartao_calado', cartaoCalado.querySelectorAll('[data-regua="ue"]').length + cartaoCalado.querySelectorAll('[data-claim="sobrecarga-do-custo-da-habitacao-2025-ue"]').length, 'o mesmo cartão, as marcas que a K14 conta ([data-regua="ue"] e [data-claim="…-ue"])', 'o mesmo detetor vê a da régua num cartão sem silêncio (a dívida)', pagina('temas/index.html').querySelector('[data-cartao-medida="divida-publica-2025"] [data-regua="ue"], [data-cartao-medida="divida-publica-2025"] [data-claim="divida-publica-2025-ue"]'));
/* Os valores que o relatório cita, lidos das linhas do livro-razão. */
const valorDaLinha = (id) => String(load(fs.readFileSync(path.join(RAIZ, 'ledger/claims', `${id}.yml`), 'utf8')).value);
const sobrecargaPt = valorDaLinha('sobrecarga-do-custo-da-habitacao-2025');
const sobrecargaUe = valorDaLinha('sobrecarga-do-custo-da-habitacao-2025-ue');
medida('valor_de_portugal_da_sobrecarga_no_total', sobrecargaPt, 'ledger/claims/sobrecarga-do-custo-da-habitacao-2025.yml, value', 'o cartão da página dos temas mostra-o', texto(cartaoCalado).includes(sobrecargaPt));
medida('valor_da_uniao_da_sobrecarga_no_total', sobrecargaUe, 'ledger/claims/sobrecarga-do-custo-da-habitacao-2025-ue.yml, value', 'a frase da faixa do cartão calado diz «a média da União é» e este valor', texto(cartaoCalado.querySelector('[data-faixa-frase]')).includes(`a média da União é ${sobrecargaUe}`));
const racio = valorDaLinha('racio-s80-s20-2025');
medida('valor_de_portugal_do_racio_s80_s20', racio, 'ledger/claims/racio-s80-s20-2025.yml, value', 'a leitura do cartão do rácio, na página dos temas, traz o valor', texto(pagina('temas/index.html').querySelector('[data-cartao-medida="racio-s80-s20-2025"] [data-cartao-leitura]')).includes(`${racio} vezes`));
const PAGINAS = ['temas', 'o-meu-dinheiro', 'o-meu-trabalho', 'a-minha-casa', 'o-estado-e-a-economia', 'a-escola-e-a-saude', 'en/themes', 'en/my-money', 'en/my-work', 'en/my-home', 'en/state-and-economy', 'en/school-and-health'];
const comFaixa = PAGINAS.filter((p) => pagina(`${p}/index.html`).querySelector('[data-faixa-ue]'));
medida('paginas_lidas_pelo_guiao_das_faixas', PAGINAS.length, 'as páginas que faixas-ue1.mjs lê', 'a dos temas está entre elas', PAGINAS.includes('temas'));
medida('paginas_com_faixa', comFaixa.length, 'as dessas páginas com [data-faixa-ue] no dist/', 'a dos temas tem', comFaixa.includes('temas'));
medida('paginas_sem_faixa', PAGINAS.filter((p) => !comFaixa.includes(p)), 'o mesmo, as que não têm', 'a da escola e da saúde leu-se', fs.existsSync(path.join(RAIZ, 'dist/a-escola-e-a-saude/index.html')));
medida('paginas_sem_faixa_conta', PAGINAS.length - comFaixa.length, 'o mesmo, quantas', 'o detetor vê a faixa na página inglesa dos temas', comFaixa.includes('en/themes'));

/* ------------------------------------------------------------ plantas, capturas, entre commits, mapa */
const plantas = JSON.parse(fs.readFileSync(aqui('plantas-ue1c.json'), 'utf8'));
medida('plantas', plantas.plantas, `${PASTA}/plantas-ue1c.json`, 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_que_morderam', plantas.mordidas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_repostas_pelo_sha256', plantas.repostas_com_o_mesmo_sha256, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas', plantas.corridas_limpas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas_a_zero', plantas.corridas_limpas_a_zero, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
const capturas = JSON.parse(fs.readFileSync(aqui('capturas-ue1c.json'), 'utf8'));
const dasCapturas = capturas.cabeca_esperada === CABECA && capturas.plantas_vistas === capturas.plantas.length && capturas.plantas.length > 0;
medida('capturas', capturas.capturas, `${PASTA}/capturas-ue1c.json`, 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
medida('capturas_recibos_com_frase', capturas.recibos_com_frase, 'o mesmo, os recibos com a frase nas duas edições', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_com_problema', capturas.problemas.length, 'o mesmo', 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
medida('capturas_plantas_vistas', capturas.plantas_vistas, 'o mesmo', 'o manifesto tem plantas', capturas.plantas.length > 0);
medida('capturas_pedidos_para_fora', capturas.pedidos_recusados_para_fora, 'o mesmo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
const entre = JSON.parse(fs.readFileSync(aqui('entre-commits-ue1c.json'), 'utf8'));
medida('conferencias_entre_commits', entre.corridas, `${PASTA}/entre-commits-ue1c.json`, entre.conhecido_positivo.o_que, entre.conhecido_positivo.encontrado);
medida('conferencias_entre_commits_a_zero', entre.corridas_a_zero, 'o mesmo', entre.conhecido_positivo.o_que, entre.conhecido_positivo.encontrado);
const mapa = execFileSync('python3', ['scripts/leituras/conferir-mapa.py', 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'], { cwd: RAIZ, encoding: 'utf8' });
const nMapa = (re) => Number((re.exec(mapa) ?? [])[1] ?? NaN);
medida('mapa_citacoes_no_sitio', nMapa(/citações conferidas na linha citada \(±7\): (\d+)/), 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'a linha existe', /citações conferidas na linha citada/.test(mapa));
medida('mapa_citacoes_longe', nMapa(/longe da linha citada: (\d+)/), 'o mesmo', 'a linha existe', /longe da linha citada: \d+/.test(mapa));
medida('mapa_citacoes_por_encontrar', nMapa(/não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'o mesmo', 'a linha existe', /não encontrada em nenhum/.test(mapa));

/* ------------------------------------------------------------ o que não podia mudar, nos commits da passagem */
const mudadas = (caminhos) => git('diff', '--name-only', BASE, CABECA, '--', ...caminhos).split('\n').filter(Boolean);
const controlo = mudadas(['src/views/SerieView.astro']).length === 1;
medida('linhas_do_livro_mudadas', mudadas(['ledger/claims']).length, `git diff --name-only ${BASE} <cabeça> -- ledger/claims`, 'o mesmo comando vê o recibo da série mudado', controlo);
medida('series_do_livro_mudadas', mudadas(['ledger/series', 'ledger/cruzamentos', 'src/data/paises-da-uniao.json']).length, 'o mesmo, sobre as séries, os registos e a tabela dos nomes', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('leituras_mudadas', mudadas(['src/data/leituras-das-medidas.mjs', 'src/data/leituras-rp1.mjs', 'tests/cartao/leituras-provadas.json']).length, 'o mesmo, sobre as leituras dos cartões e a sua auditoria', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('brief_mudado', mudadas(['design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md']).length, 'o mesmo, sobre o brief', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('guiao_da_aterragem_mudado', mudadas(['scripts/aterrar.sh']).length, 'o mesmo, sobre scripts/aterrar.sh', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('commits_de_codigo_da_passagem', Number(git('rev-list', '--count', `${BASE}..${CABECA}`)), `git rev-list --count ${BASE}..<cabeça>`, 'a base é antepassada da cabeça', git('merge-base', '--is-ancestor', BASE, CABECA) === '');
if (process.argv[2]) {
  const motor = (...a) => execFileSync('git', a, { cwd: process.argv[2], encoding: 'utf8' }).trim();
  const cab = motor('rev-parse', 'HEAD');
  medida('motor_cabeca', cab.slice(0, 7), 'git rev-parse HEAD, na worktree do motor', 'é um commit', /^[0-9a-f]{40}$/.test(cab));
  medida('motor_commits_da_passagem', Number(motor('rev-list', '--count', 'e394307..HEAD')), 'git rev-list --count e394307..HEAD, na worktree do motor', 'a cabeça do UE1 é antepassada da cabeça', motor('merge-base', '--is-ancestor', 'e394307', 'HEAD') === '');
}
const custo = JSON.parse(fs.readFileSync(aqui('custo-ue1c.json'), 'utf8'));
for (const [k, v] of Object.entries(custo.medidas)) medida(`custo_${k}`, v.valor, v.comando, v.o_que, v.encontrado);

const saida = { bloco: 'UE1c', cabeca_do_codigo: CABECA, base: BASE, guiao: `${PASTA}/medir-ue1c.mjs`, medidas };
fs.writeFileSync(aqui('medidas-ue1c.json'), JSON.stringify(saida, null, 2) + '\n');
const sem = medidas.filter((x) => !x.conhecido_positivo.encontrado);
console.log(`UE1c medidas: ${medidas.length} medida(s), ${sem.length} sem o conhecido-positivo encontrado`);
for (const x of sem) console.log(`  x ${x.nome}`);
process.exit(sem.length ? 1 : 0);
