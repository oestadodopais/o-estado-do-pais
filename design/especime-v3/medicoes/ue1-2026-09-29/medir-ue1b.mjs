/** UE1b: as medidas da passagem de correção, cada uma com o comando e um conhecido-positivo, em medidas-ue1b.json.
 *
 * Não lê a rede. Lê os registos dos portões em `portoes/ue1b/`, o `dist/` construído da cabeça do código
 * da passagem, os manifestos das plantas (`plantas-ue1b.json`), das capturas (`capturas-ue1b.json`), das
 * faixas medidas em todas as larguras (`faixas-ue1b.json`), dos acertos (`acertos-ue1-resultado.json`) e das
 * conferências entre os commits (`entre-commits-ue1b.json`), a
 * saída do `conferir-mapa.py`, e o `git` deste repositório para o que não podia mudar. Com o caminho da
 * worktree do motor como argumento, lê também a cabeça dele (e não o escreve).
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/medir-ue1b.mjs [<worktree do motor>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const aqui = (f) => path.join(RAIZ, PASTA, f);
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
const BASE = '0f75298f';
const CABECA = fs.readFileSync(aqui('portoes/ue1b/build.cabeca'), 'utf8').trim();
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const texto = (e) => (e ? e.text.replace(/\s+/g, ' ').trim() : '');
const pagina = (rel) => parse(fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8'));

/* ------------------------------------------------------------ os portões */
const log = (g) => fs.readFileSync(aqui(`portoes/ue1b/${g}.log`), 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = Number(fs.readFileSync(aqui(`portoes/ue1b/${g}.codigo`), 'utf8').trim());
  const cab = fs.readFileSync(aqui(`portoes/ue1b/${g}.cabeca`), 'utf8').trim();
  const ini = Date.parse(fs.readFileSync(aqui(`portoes/ue1b/${g}.inicio`), 'utf8').trim());
  const fim = Date.parse(fs.readFileSync(aqui(`portoes/ue1b/${g}.fim`), 'utf8').trim());
  medida(`codigo_do_${g}`, codigo, `cat ${PASTA}/portoes/ue1b/${g}.codigo`, `o registo da corrida é desta cabeça (${cab.slice(0, 8)})`, cab === CABECA);
  medida(`segundos_do_${g}`, Math.round((fim - ini) / 1000), `${PASTA}/portoes/ue1b/${g}.fim menos ${g}.inicio`, 'as duas horas leram-se', Number.isFinite(fim - ini));
}
const f19 = /faixa da União \(F19\): (\d+) faixa\(s\), (\d+) nos temas, (\d+) marcas refeitas do valor, (\d+) frases recompostas \((\d+) com empate\), (\d+) plantas a morder, (\d+) ressalva\(s\) nas pontas \((\d+) nos temas\), (\d+) ordinais e (\d+) marca\(s\) por edição com palavras \(F19g, F19h\), (\d+) plantas das palavras a morder/.exec(log('build'));
const g19 = (i) => (f19 ? Number(f19[i]) : null);
medida('f19_faixas', g19(1), 'a linha da F19 do check:formas no build.log', 'a linha existe', f19);
medida('f19_plantas', g19(6), 'o mesmo, as plantas das páginas dos temas', 'a linha existe', f19);
medida('f19_ressalvas_nas_pontas', g19(7), 'o mesmo', 'a linha existe', f19);
medida('f19_ressalvas_nos_temas', g19(8), 'o mesmo', 'a linha existe', f19);
medida('f19_ordinais', g19(9), 'o mesmo, F19g', 'a linha existe', f19);
medida('f19_marcas_por_edicao_com_palavras', g19(10), 'o mesmo, F19h', 'a linha existe', f19);
medida('f19_plantas_das_palavras', g19(11), 'o mesmo', 'a linha existe', f19);
const ue1b = /UE1b: (\d+) porta\(s\) dos recibos das linhas para as séries, (\d+) legenda\(s\) das marcas com (\d+) marca\(s\)/.exec(log('build'));
medida('portao_html_portas', ue1b ? Number(ue1b[1]) : null, 'a parte «UE1b:» da linha do gate:html no build.log', 'a linha existe', ue1b);
medida('portao_html_legendas', ue1b ? Number(ue1b[2]) : null, 'o mesmo', 'a linha existe', ue1b);
medida('portao_html_marcas_nas_legendas', ue1b ? Number(ue1b[3]) : null, 'o mesmo', 'a linha existe', ue1b);
const voz = /(\d+) linhas do inventário com bloco \((\d+) vivas, todas rendidas/.exec(log('build'));
medida('inventario_vivas_rendidas', voz ? Number(voz[2]) : null, 'a linha do check:voz no build.log', 'a linha existe', voz);
const k18 = /faixas refeitas dos pontos \(K18\)\s+(\d+) · (\d+) planta\(s\) a morder/.exec(log('verify'));
const k18b = /ressalvas nas pontas e ordinais \(K18, UE1b\)\s+(\d+) · (\d+) · (\d+) planta\(s\) das palavras a morder/.exec(log('verify'));
medida('k18_faixas', k18 ? Number(k18[1]) : null, 'a linha da K18 do check:cartao no verify.log', 'a linha existe', k18);
medida('k18_plantas', k18 ? Number(k18[2]) : null, 'o mesmo', 'a linha existe', k18);
medida('k18_ressalvas', k18b ? Number(k18b[1]) : null, 'a linha das ressalvas e dos ordinais da K18 no verify.log', 'a linha existe', k18b);
medida('k18_ordinais', k18b ? Number(k18b[2]) : null, 'o mesmo', 'a linha existe', k18b);
medida('k18_plantas_das_palavras', k18b ? Number(k18b[3]) : null, 'o mesmo', 'a linha existe', k18b);

/* ------------------------------------------------------------ o dist/ da cabeça */
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist/version.json'), 'utf8'));
medida('dist_da_cabeca', versao.commit === CABECA, 'dist/version.json contra portoes/ue1b/build.cabeca', 'o carimbo tem um commit', /^[0-9a-f]{40}$/.test(versao.commit));
const themes = pagina('en/themes/index.html');
const temas = pagina('temas/index.html');
const ordinais = themes.querySelectorAll('[data-faixa-frase]').map((f) => {
  const l = f.querySelector('[data-ponto-lugar]');
  const depois = f.innerHTML.split(/data-ponto-lugar="[^"]+">\d+<\/span>/)[1] ?? '';
  return `${texto(l)}${(/^([a-z]+)/.exec(depois) ?? [])[1] ?? ''}`;
});
medida('ordinais_ingleses_rendidos', ordinais, 'o lugar e o sufixo de cada frase da faixa na página inglesa dos temas', 'o dos preços da habitação é «2nd»', themes.querySelector('[data-faixa-frase="precos-da-habitacao-2025-paises"]') && ordinais.includes('2nd'));
medida('ordinais_ingleses_rendidos_conta', ordinais.length, 'o mesmo, quantos', 'o detetor lê a exceção dos 11 a 13 («12th»)', ordinais.includes('12th'));
medida('sufixos_ingleses_rendidos', [...new Set(ordinais.map((o) => o.replace(/^\d+/, '')))].sort(), 'o mesmo, os sufixos distintos', 'o «nd» está entre eles', ordinais.some((o) => o.endsWith('nd')));
medida('ordinal_portugues_da_pobreza', /(\d+)\.º lugar/.exec(texto(temas.querySelector('[data-faixa-frase="risco-de-pobreza-ou-exclusao-2025-paises"]')))?.[0] ?? null, 'a frase da pobreza na página portuguesa dos temas', 'a frase existe', temas.querySelector('[data-faixa-frase="risco-de-pobreza-ou-exclusao-2025-paises"]'));
const ressalvas = (r) => r.querySelectorAll('[data-faixa-ressalva]').map((e) => `${e.getAttribute('data-faixa-ressalva').split('#')[1]} ${texto(e)}`);
medida('ressalvas_nos_temas_pt', ressalvas(temas), 'as ressalvas das pontas na página portuguesa dos temas', 'a da Hungria diz «(dado provisório)»', ressalvas(temas).includes('HU (dado provisório)'));
medida('ressalvas_nos_temas_en', ressalvas(themes), 'o mesmo na página inglesa', 'a da Espanha diz «(definition differs)»', ressalvas(themes).includes('ES (definition differs)'));
const PAGINAS = ['temas', 'o-meu-dinheiro', 'o-meu-trabalho', 'a-minha-casa', 'o-estado-e-a-economia', 'a-escola-e-a-saude', 'en/themes', 'en/my-money', 'en/my-work', 'en/my-home', 'en/state-and-economy', 'en/school-and-health'];
let letrasCruas = 0;
let letrasNoControlo = 0;
for (const p of PAGINAS) letrasCruas += pagina(`${p}/index.html`).querySelectorAll('[data-faixa-ue] [data-ponto-bandeira]').length;
letrasNoControlo = pagina('livro-razao/series/precos-da-habitacao-2025-paises/index.html').querySelectorAll('[data-ponto-bandeira]').length;
medida('letras_cruas_nas_faixas', letrasCruas, 'as marcas data-ponto-bandeira dentro das faixas das doze páginas que as levam', 'o mesmo detetor vê as letras da tabela do recibo dos preços da habitação', letrasNoControlo > 0);
const recibos = ['livro-razao/series', 'en/ledger/series'].flatMap((d) => fs.readdirSync(path.join(RAIZ, 'dist', d)).map((x) => `${d}/${x}/index.html`));
const comLegenda = recibos.filter((r) => pagina(r).querySelector('[data-serie-marcas]'));
const entradas = comLegenda.reduce((n, r) => n + pagina(r).querySelectorAll('[data-serie-marcas] [data-serie-marca]').length, 0);
medida('recibos_de_serie_com_legenda', comLegenda.length, 'os recibos de série com [data-serie-marcas] no dist/', 'o dos preços da habitação tem', comLegenda.includes('livro-razao/series/precos-da-habitacao-2025-paises/index.html'));
medida('recibos_de_serie_sem_legenda', recibos.length - comLegenda.length, 'o mesmo, os que não têm (as séries sem marcas)', 'o da dívida não tem', !comLegenda.includes('livro-razao/series/divida-publica-2025-paises/index.html'));
medida('entradas_nas_legendas', entradas, 'as entradas [data-serie-marca] das legendas', 'a legenda dos preços da habitação tem «ep»', pagina('livro-razao/series/precos-da-habitacao-2025-paises/index.html').querySelector('[data-serie-marca="precos-da-habitacao-2025-paises#ep"]'));
const linhas = ['livro-razao', 'en/ledger'].flatMap((d) => fs.readdirSync(path.join(RAIZ, 'dist', d)).filter((x) => !['series'].includes(x) && fs.existsSync(path.join(RAIZ, 'dist', d, x, 'index.html'))).map((x) => `${d}/${x}/index.html`));
let portas = 0;
for (const r of linhas) {
  const html = fs.readFileSync(path.join(RAIZ, 'dist', r), 'utf8');
  if (html.includes('data-porta-da-serie')) portas += (html.match(/data-porta-da-serie="/g) ?? []).length;
}
medida('portas_nos_recibos_das_linhas', portas, 'as marcas data-porta-da-serie nos recibos das linhas das duas edições', 'o recibo português dos preços da habitação tem uma', fs.readFileSync(path.join(RAIZ, 'dist/livro-razao/precos-da-habitacao-2025/index.html'), 'utf8').includes('data-porta-da-serie="precos-da-habitacao-2025-paises"'));
medida('paginas_do_livro_lidas', linhas.length, 'as pastas com index.html em dist/livro-razao e dist/en/ledger, sem as das séries (os recibos das linhas e as outras páginas do livro)', 'o recibo da dívida está entre elas', linhas.includes('livro-razao/divida-publica-2025/index.html'));

/* ------------------------------------------------------------ plantas, capturas, faixas, acertos, mapa */
const plantas = JSON.parse(fs.readFileSync(aqui('plantas-ue1b.json'), 'utf8'));
medida('plantas', plantas.plantas, `${PASTA}/plantas-ue1b.json`, 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_que_morderam', plantas.mordidas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_repostas_pelo_sha256', plantas.repostas_com_o_mesmo_sha256, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
for (const [g, n] of Object.entries(plantas.plantas_por_grupo)) medida(`plantas_do_grupo_${g}`, n, 'o mesmo, por grupo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas', plantas.corridas_limpas, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas_a_zero', plantas.corridas_limpas_a_zero, 'o mesmo', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
const capturas = JSON.parse(fs.readFileSync(aqui('capturas-ue1b.json'), 'utf8'));
const dasCapturas = capturas.cabeca_esperada === CABECA && capturas.plantas_vistas === capturas.plantas.length && capturas.plantas.length > 0;
medida('capturas', capturas.capturas, `${PASTA}/capturas-ue1b.json`, 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
for (const [t, n] of Object.entries(capturas.capturas_por_tipo)) medida(`capturas_de_${t.replace(/-/g, '_')}`, n, 'o mesmo, por tipo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_com_problema', capturas.problemas.length, 'o mesmo', 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasCapturas);
medida('capturas_plantas_vistas', capturas.plantas_vistas, 'o mesmo', 'o manifesto tem plantas', capturas.plantas.length > 0);
medida('capturas_pedidos_para_fora', capturas.pedidos_recusados_para_fora, 'o mesmo', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
const serieNa = (largura) => capturas.resultados.filter((r) => r.tipo === 'recibo-de-serie' && r.largura === largura);
medida('legendas_ao_lado_da_tabela_a_partir_de_768', capturas.resultados.filter((r) => r.tipo === 'recibo-de-serie' && r.largura >= 768 && r.medidas.ao_lado).length, 'as capturas dos recibos de série a 768 px ou mais com a legenda ao lado da tabela', 'a 1280 px a do recibo português dos preços da habitação está ao lado', serieNa(1280).some((r) => r.lang === 'pt' && r.serie === 'precos-da-habitacao-2025-paises' && r.medidas.ao_lado));
medida('legendas_por_baixo_da_tabela_a_390', serieNa(390).filter((r) => r.medidas.por_baixo).length, 'o mesmo a 390 px, por baixo', 'a 390 px a legenda não está ao lado', serieNa(390).every((r) => !r.medidas.ao_lado));
const faixas = JSON.parse(fs.readFileSync(aqui('faixas-ue1b.json'), 'utf8'));
const dasFaixas = faixas.cabeca_esperada === CABECA && faixas.plantas_vistas === faixas.plantas.length && faixas.plantas.length > 0;
medida('faixas_medidas_nas_larguras', faixas.medicoes_de_faixa, `node ${PASTA}/faixas-ue1.mjs faixas-ue1b.json`, 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasFaixas);
medida('faixas_com_problema', faixas.problemas.length, 'o mesmo', 'o manifesto é desta cabeça e o detetor viu as suas plantas', dasFaixas);
medida('faixas_plantas_vistas', faixas.plantas_vistas, 'o mesmo', 'o manifesto tem plantas', faixas.plantas.length > 0);
medida('faixas_pedidos_para_fora', faixas.pedidos_recusados_para_fora, 'o mesmo', 'o manifesto é desta cabeça', faixas.cabeca_esperada === CABECA);
const acertos = JSON.parse(fs.readFileSync(aqui('acertos-ue1-resultado.json'), 'utf8'));
medida('acertos_declarados', acertos.acertos, `python3 ${PASTA}/acertos-ue1.py`, 'as frases do brief encontraram-se', acertos.resultado.length > 0);
medida('formas_da_frase_iguais', acertos.iguais, 'o mesmo', 'a forma inglesa sem empate traz o {ordinal}', acertos.resultado.some((r) => r.lingua === 'en' && r.declarado.includes('{n}{ordinal}')));
const mapa = execFileSync('python3', ['scripts/leituras/conferir-mapa.py', 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'], { cwd: RAIZ, encoding: 'utf8' });
const nMapa = (re) => Number((re.exec(mapa) ?? [])[1] ?? NaN);
const conferidas = nMapa(/citações conferidas na linha citada \(±7\): (\d+)/);
medida('mapa_citacoes_no_sitio', conferidas, 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'a linha das citações conferidas existe', Number.isFinite(conferidas));
medida('mapa_citacoes_longe', nMapa(/citação está no ficheiro, mas longe da linha citada: (\d+)/), 'o mesmo', 'a linha existe', /longe da linha citada: \d+/.test(mapa));
medida('mapa_citacoes_por_encontrar', nMapa(/citação não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'o mesmo', 'a linha existe', /não encontrada em nenhum dos ficheiros citados na mesma linha: \d+/.test(mapa));

/* ------------------------------------------------------------ o que não podia mudar */
const mudadas = (caminhos) => git('diff', '--name-only', BASE, CABECA, '--', ...caminhos).split('\n').filter(Boolean);
const controlo = mudadas(['src/views/SerieView.astro']).length === 1;
medida('linhas_do_livro_mudadas', mudadas(['ledger/claims']).length, `git diff --name-only ${BASE} <cabeça> -- ledger/claims`, 'o mesmo comando vê o recibo da série mudado', controlo);
medida('series_do_livro_mudadas', mudadas(['ledger/series', 'ledger/cruzamentos', 'src/data/paises-da-uniao.json']).length, 'o mesmo, sobre as séries, os registos de travessia e a tabela dos nomes', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('brief_mudado', mudadas(['design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md']).length, 'o mesmo, sobre o brief (e a tabela do seu §1)', 'o brief existe na base', git('ls-tree', '--name-only', BASE, 'design/observatorio/BRIEF-UE1-onde-portugal-fica-entre-os-27.md') !== '');
medida('ficheiros_da_primeira_pagina_mudados', mudadas(['src/views/HomeView.astro', 'src/data/primeira-pagina.mjs', 'src/lib/primeira-pagina.mjs', 'src/components/inicio']).length, 'o mesmo, sobre a primeira página', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('ficheiros_das_leituras_mudados', mudadas(['src/data/leituras-das-medidas.mjs', 'src/data/leituras-rp1.mjs', 'src/lib/leitura-da-medida.mjs', 'design/observatorio/leituras']).length, 'o mesmo, sobre as leituras', 'o mesmo comando vê o recibo da série mudado', controlo);
medida('guiao_da_aterragem_mudado', mudadas(['scripts/aterrar.sh']).length, 'o mesmo, sobre scripts/aterrar.sh', 'o mesmo comando vê o recibo da série mudado', controlo);
const commits = git('rev-list', '--count', `${BASE}..${CABECA}`);
medida('commits_de_codigo_da_passagem', Number(commits), `git rev-list --count ${BASE}..<cabeça>`, 'a base é antepassada da cabeça', git('merge-base', '--is-ancestor', BASE, CABECA) === '');

/* ------------------------------------------------------------ o motor, sem o escrever */
if (process.argv[2]) {
  const motor = (...a) => execFileSync('git', a, { cwd: process.argv[2], encoding: 'utf8' }).trim();
  const cab = motor('rev-parse', 'HEAD');
  medida('motor_cabeca', cab.slice(0, 7), 'git rev-parse HEAD, na worktree do motor', 'é um commit', /^[0-9a-f]{40}$/.test(cab));
  medida('motor_commits_da_passagem', Number(motor('rev-list', '--count', 'e394307..HEAD')), 'git rev-list --count e394307..HEAD, na worktree do motor', 'a cabeça do UE1 é antepassada da cabeça', motor('merge-base', '--is-ancestor', 'e394307', 'HEAD') === '');
}

/* ------------------------------------------------------------ entre os commits */
const entre = JSON.parse(fs.readFileSync(aqui('entre-commits-ue1b.json'), 'utf8'));
medida('conferencias_entre_commits', entre.corridas, `${PASTA}/entre-commits-ue1b.json`, entre.conhecido_positivo.o_que, entre.conhecido_positivo.encontrado);
medida('conferencias_entre_commits_a_zero', entre.corridas_a_zero, 'o mesmo', entre.conhecido_positivo.o_que, entre.conhecido_positivo.encontrado);

/* ------------------------------------------------------------ o custo */
const custo = JSON.parse(fs.readFileSync(aqui('custo-ue1b.json'), 'utf8'));
for (const [k, v] of Object.entries(custo.medidas)) medida(`custo_${k}`, v.valor, v.comando, v.o_que, v.encontrado);

const saida = { bloco: 'UE1b', cabeca_do_codigo: CABECA, base: BASE, guiao: `${PASTA}/medir-ue1b.mjs`, medidas };
fs.writeFileSync(aqui('medidas-ue1b.json'), JSON.stringify(saida, null, 2) + '\n');
const sem = medidas.filter((x) => !x.conhecido_positivo.encontrado);
console.log(`UE1b medidas: ${medidas.length} medida(s), ${sem.length} sem o conhecido-positivo encontrado`);
for (const x of sem) console.log(`  x ${x.nome}`);
process.exit(sem.length ? 1 : 0);
