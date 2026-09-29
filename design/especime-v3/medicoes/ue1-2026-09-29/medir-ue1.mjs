/** UE1: as medidas do bloco, cada uma com o comando e um conhecido-positivo, em medidas.json.
 *
 * Não lê a rede nem o motor. Lê o livro-razão do sítio (as séries, as linhas, a tabela dos nomes, o
 * registo da travessia), a testemunha do lugar de direção (`design/observatorio/medidas/
 * BRIEF-UE1-eurostat-2026-09-29.json`), o `dist/` construído da cabeça do código, os registos dos
 * portões em `portoes/`, os manifestos das plantas, das capturas, das faixas medidas em todas as
 * larguras (`faixas-ue1.json`, escrito por `faixas-ue1.mjs`), dos acertos e do programa do typecheck
 * (`tipos-ue1.json`, escrito por `tipos-ue1.mjs`), e o `git` deste
 * repositório para o que não podia mudar. As corridas do motor que o relatório cita estão guardadas
 * em `motor/`, na mesma pasta, e leem-se de lá.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/medir-ue1.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const aqui = (f) => path.join(RAIZ, PASTA, f);
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
const BASE = '8e66b601';
const CABECA = fs.readFileSync(aqui('portoes/build.cabeca'), 'utf8').trim();
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const numero = (v) => Number(String(v).replace(/−/g, '-').replace(/(?<=\d)[   ](?=\d)/g, '').replace(',', '.'));

/* ------------------------------------------------------------ as séries */
const dirSeries = path.join(RAIZ, 'ledger', 'series');
const series = fs.readdirSync(dirSeries).filter((f) => f.endsWith('.yml')).sort().map((f) => load(fs.readFileSync(path.join(dirSeries, f), 'utf8')));
const pontos = series.flatMap((s) => s.pontos);
medida('series_no_livro', series.length, 'ls ledger/series/*.yml', 'a série da dívida pública está entre elas', series.some((s) => s.id === 'divida-publica-2025-paises'));
medida('pontos_por_serie', [...new Set(series.map((s) => s.pontos.length))].join(','), 'o comprimento de «pontos» em cada série', 'a série da dívida tem o ponto da União', series.find((s) => s.id === 'divida-publica-2025-paises')?.pontos.some((p) => p.geo === 'EU27_2020'));
medida('pontos_no_livro', pontos.length, 'a soma dos pontos das séries', 'o ponto de Portugal da dívida é 89,7', series.find((s) => s.id === 'divida-publica-2025-paises')?.pontos.find((p) => p.geo === 'PT')?.valor === '89,7');
medida('pontos_com_marca_da_fonte', pontos.filter((p) => p.bandeira).length, 'os pontos com «bandeira» não nula', 'a Hungria nos preços da habitação leva «p»', series.find((s) => s.id === 'precos-da-habitacao-2025-paises')?.pontos.find((p) => p.geo === 'HU')?.bandeira === 'p');
medida('series_com_marcas', series.filter((s) => Object.keys(s.bandeiras ?? {}).length).length, 'as séries com «bandeiras» não vazio', 'a série do desemprego de longa duração tem «u»', 'u' in (series.find((s) => s.id === 'desemprego-de-longa-duracao-2025-paises')?.bandeiras ?? {}));

/* A testemunha do lugar de direção: cada ponto, como número, e cada marca. */
const testemunha = JSON.parse(fs.readFileSync(path.join(RAIZ, 'design/observatorio/medidas/BRIEF-UE1-eurostat-2026-09-29.json'), 'utf8'));
let iguais = 0, diferentes = 0, marcasIguais = 0;
const lugares = {};
for (const s of series) {
  const t = testemunha.medidas[`${s.linha_de_portugal}-ue`];
  for (const p of s.pontos) {
    const w = t?.pontos?.[p.geo];
    if (w && numero(p.valor) === Number(w.valor)) iguais++; else diferentes++;
    if (w && (p.bandeira ?? null) === (w.marca ?? null)) marcasIguais++;
  }
  const paises = s.pontos.filter((p) => p.geo !== 'EU27_2020');
  const pt = numero(paises.find((p) => p.geo === 'PT').valor);
  lugares[s.id] = { lugar: 1 + paises.filter((p) => numero(p.valor) > pt).length, testemunha: t?.pt_lugar_a_descer ?? null, a_par: paises.filter((p) => p.geo !== 'PT' && numero(p.valor) === pt).map((p) => p.geo) };
}
medida('pontos_iguais_a_testemunha', iguais, 'cada ponto contra o ponto da testemunha, como número', 'a União da dívida é 81,7 nas duas', numero(series.find((s) => s.id === 'divida-publica-2025-paises').pontos.at(-1).valor) === testemunha.medidas['divida-publica-2025-ue'].ue);
medida('pontos_diferentes_da_testemunha', diferentes, 'o mesmo, os que não batem', 'a comparação vê uma diferença plantada (81,8 contra 81,7)', numero('81,8') !== testemunha.medidas['divida-publica-2025-ue'].ue);
medida('marcas_iguais_a_testemunha', marcasIguais, 'cada marca contra a da testemunha', 'a Hungria leva «p» nas duas', testemunha.medidas['precos-da-habitacao-2025-ue'].pontos.HU.marca === 'p');
const ordemDaTabela = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/paises-da-uniao.json'), 'utf8')).paises.map((p) => p.geo);
medida('ordem_dos_paises_igual_a_testemunha', ordemDaTabela.join(',') === testemunha.paises.join(','), 'a ordem da tabela dos nomes contra a lista da testemunha', 'a Bélgica é a primeira nas duas', ordemDaTabela[0] === 'BE' && testemunha.paises[0] === 'BE');
const lugaresIguais = Object.values(lugares).filter((l) => l.lugar === l.testemunha).length;
medida('lugares_iguais_ao_brief', lugaresIguais, 'o lugar de Portugal (1 mais os países com valor maior) contra o do §1 do brief', 'a dívida dá 6 nas duas', lugares['divida-publica-2025-paises'].lugar === 6);
medida('lugar_da_pobreza_pela_regra', lugares['risco-de-pobreza-ou-exclusao-2025-paises'].lugar, '1 mais o número de países com valor maior que o de Portugal (18,6)', 'a regra dá 6 na dívida', lugares['divida-publica-2025-paises'].lugar === 6);
medida('lugar_da_pobreza_no_brief', lugares['risco-de-pobreza-ou-exclusao-2025-paises'].testemunha, 'pt_lugar_a_descer da testemunha e a tabela do §1 do brief', 'a testemunha tem o campo', lugares['risco-de-pobreza-ou-exclusao-2025-paises'].testemunha !== null);
medida('paises_a_par_de_portugal_na_pobreza', lugares['risco-de-pobreza-ou-exclusao-2025-paises'].a_par.join(','), 'os países com o valor de Portugal na pobreza ou exclusão', 'a Áustria tem 18,6', series.find((s) => s.id === 'risco-de-pobreza-ou-exclusao-2025-paises').pontos.find((p) => p.geo === 'AT').valor === '18,6');
medida('paises_maiores_que_portugal_na_pobreza', lugares['risco-de-pobreza-ou-exclusao-2025-paises'].lugar - 1, 'os países com valor maior que 18,6', 'a Bulgária (29,0) é um deles', numero('29,0') > 18.6);
const pobreza = series.find((s) => s.id === 'risco-de-pobreza-ou-exclusao-2025-paises');
const valorDe = (s, geo) => s.pontos.find((p) => p.geo === geo).valor;
medida('valor_de_portugal_na_pobreza', valorDe(pobreza, 'PT'), 'o ponto PT da série da pobreza ou exclusão', 'a Áustria tem o mesmo valor', valorDe(pobreza, 'AT') === valorDe(pobreza, 'PT'));
medida('paises_a_par_de_portugal_na_pobreza_conta', lugares[pobreza.id].a_par.length, 'o mesmo, quantos países têm o valor de Portugal', 'a Suécia é um deles', lugares[pobreza.id].a_par.includes('SE'));
/* As pontas com marca da fonte: o país mais baixo e o mais alto de cada série, quando o ponto leva marca. */
const pontas = [];
for (const s of series) {
  const paises = s.pontos.filter((p) => p.geo !== 'EU27_2020');
  const valores = paises.map((p) => numero(p.valor));
  for (const [papel, alvo] of [['baixo', Math.min(...valores)], ['alto', Math.max(...valores)]]) {
    for (const p of paises.filter((q) => numero(q.valor) === alvo)) if (p.bandeira) pontas.push(`${s.id} · ${papel} · ${p.geo} · ${p.valor} · ${p.bandeira}`);
  }
}
medida('pontas_com_marca_da_fonte', pontas, 'o país mais baixo e o mais alto de cada série, com a marca do ponto, quando a leva', 'a Hungria, a mais alta dos preços da habitação, com «p»', pontas.includes('precos-da-habitacao-2025-paises · alto · HU · 18,3 · p'));
medida('pontas_com_marca_da_fonte_conta', pontas.length, 'o mesmo, quantas', 'o valor mais baixo dos preços da habitação, com o sinal de menos tipográfico, lê-se como número', numero(valorDe(series.find((s) => s.id === 'precos-da-habitacao-2025-paises'), 'FI')) < 0);

/* A tabela dos nomes e o registo da travessia. */
const tabela = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/paises-da-uniao.json'), 'utf8'));
medida('paises_na_tabela_dos_nomes', tabela.paises.length, 'src/data/paises-da-uniao.json, paises', 'a Grécia é «Grécia» e «Greece» com o código EL', tabela.paises.some((p) => p.geo === 'EL' && p.pt === 'Grécia' && p.en === 'Greece'));
medida('dia_da_leitura_da_tabela', [...new Set(tabela.paises.map((p) => p.lido_em.slice(0, 10)))].join(','), 'o dia de lido_em dos 27', 'a Grécia foi lida nesse dia', tabela.paises.find((p) => p.geo === 'EL').lido_em.startsWith('2026-09-29'));
const registo = JSON.parse(fs.readFileSync(path.join(RAIZ, 'ledger/cruzamentos/series.json'), 'utf8'));
medida('series_no_registo_da_travessia', Object.keys(registo.series).length, 'ledger/cruzamentos/series.json, series', 'a da dívida está no registo', 'divida-publica-2025-paises' in registo.series);
medida('ficheiros_no_registo_da_travessia', Object.keys(registo.files).length, 'ledger/cruzamentos/series.json, files', 'a tabela dos nomes está no registo', 'paises-da-uniao.json' in registo.files);

/* ------------------------------------------------------------ o que não podia mudar */
const mudadas = (caminhos) => git('diff', '--name-only', BASE, CABECA, '--', ...caminhos).split('\n').filter(Boolean);
medida('linhas_do_livro_mudadas', mudadas(['ledger/claims']).length, `git diff --name-only ${BASE} <cabeça> -- ledger/claims`, 'o mesmo comando vê as séries novas em ledger/series', mudadas(['ledger/series']).length > 0);
medida('ficheiros_da_primeira_pagina_mudados', mudadas(['src/views/HomeView.astro', 'src/data/primeira-pagina.mjs', 'src/lib/primeira-pagina.mjs', 'src/components/inicio']).length, 'o mesmo, sobre a vista, as declarações, o resolvedor e os componentes da primeira página', 'o mesmo comando vê o cartão mudado', mudadas(['src/components/CartaoDaMedida.astro']).length === 1);
medida('ficheiros_das_leituras_mudados', mudadas(['src/data/leituras-das-medidas.mjs', 'src/data/leituras-rp1.mjs', 'src/lib/leitura-da-medida.mjs', 'design/observatorio/leituras']).length, 'o mesmo, sobre as leituras das medidas e do RP1', 'o mesmo comando vê o cartão mudado', mudadas(['src/components/CartaoDaMedida.astro']).length === 1);
medida('guiao_da_aterragem_mudado', mudadas(['scripts/aterrar.sh']).length, 'o mesmo, sobre scripts/aterrar.sh', 'o guião existe na base', git('ls-tree', '--name-only', BASE, 'scripts/aterrar.sh') === 'scripts/aterrar.sh');
const anteriores = git('ls-tree', '--name-only', BASE, 'ledger/cruzamentos/').split('\n').filter(Boolean);
medida('cruzamentos_anteriores', anteriores.length, `git ls-tree --name-only ${BASE} ledger/cruzamentos/`, 'o registo de Évora está entre eles', anteriores.includes('ledger/cruzamentos/evora.json'));
medida('cruzamentos_anteriores_mudados', mudadas(anteriores).length, 'o mesmo diff, sobre os registos de travessia que já existiam na base', 'o mesmo comando vê o registo novo', mudadas(['ledger/cruzamentos/series.json']).length === 1);

/* ------------------------------------------------------------ o dist/ da cabeça */
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist/version.json'), 'utf8'));
medida('dist_da_cabeca', versao.commit === CABECA, 'dist/version.json contra portoes/build.cabeca', 'o carimbo tem um commit', /^[0-9a-f]{40}$/.test(versao.commit));
const conta = (rel, re) => (fs.readFileSync(path.join(RAIZ, 'dist', rel), 'utf8').match(re) ?? []).length;
const FAIXA = /data-faixa-ue="/g;
const paginasDasFaixas = { 'temas/index.html': 0, 'en/themes/index.html': 0, 'o-meu-dinheiro/index.html': 0, 'o-meu-trabalho/index.html': 0, 'a-minha-casa/index.html': 0, 'o-estado-e-a-economia/index.html': 0, 'a-escola-e-a-saude/index.html': 0, 'en/my-money/index.html': 0, 'en/my-work/index.html': 0, 'en/my-home/index.html': 0, 'en/state-and-economy/index.html': 0, 'en/school-and-health/index.html': 0, 'index.html': 0, 'en/index.html': 0 };
for (const k of Object.keys(paginasDasFaixas)) paginasDasFaixas[k] = conta(k, FAIXA);
medida('faixas_nos_temas', paginasDasFaixas['temas/index.html'] + paginasDasFaixas['en/themes/index.html'], 'as marcas data-faixa-ue nas duas páginas dos temas', 'a faixa da dívida está na página portuguesa', fs.readFileSync(path.join(RAIZ, 'dist/temas/index.html'), 'utf8').includes('data-faixa-ue="divida-publica-2025-paises"'));
const nasEntradas = Object.entries(paginasDasFaixas).filter(([k]) => !/temas|themes|^index|^en\/index/.test(k)).reduce((n, [, v]) => n + v, 0);
medida('faixas_nas_entradas', nasEntradas, 'as marcas data-faixa-ue nas dez páginas das entradas', 'a página «O meu dinheiro» tem a da pobreza', fs.readFileSync(path.join(RAIZ, 'dist/o-meu-dinheiro/index.html'), 'utf8').includes('data-faixa-ue="risco-de-pobreza-ou-exclusao-2025-paises"'));
medida('faixas_na_primeira_pagina', paginasDasFaixas['index.html'] + paginasDasFaixas['en/index.html'], 'as marcas data-faixa-ue na primeira página, nas duas edições', 'o mesmo detetor vê as dos temas', paginasDasFaixas['temas/index.html'] > 0);
const recibos = ['livro-razao/series', 'en/ledger/series'].flatMap((d) => fs.readdirSync(path.join(RAIZ, 'dist', d)).filter((x) => fs.existsSync(path.join(RAIZ, 'dist', d, x, 'index.html'))));
medida('recibos_de_serie_construidos', recibos.length, 'as pastas com index.html em dist/livro-razao/series e dist/en/ledger/series', 'o recibo da dívida está nas duas edições', recibos.filter((x) => x === 'divida-publica-2025-paises').length === 2);
const pontosNoRecibo = conta('livro-razao/series/divida-publica-2025-paises/index.html', /data-ponto="/g);
medida('pontos_num_recibo', pontosNoRecibo, 'as marcas data-ponto no recibo português da dívida', 'o valor da Bélgica está lá', fs.readFileSync(path.join(RAIZ, 'dist/livro-razao/series/divida-publica-2025-paises/index.html'), 'utf8').includes('data-ponto="divida-publica-2025-paises#BE">107,9<'));

/* ------------------------------------------------------------ os portões */
const log = (g) => fs.readFileSync(aqui(`portoes/${g}.log`), 'utf8');
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = Number(fs.readFileSync(aqui(`portoes/${g}.codigo`), 'utf8').trim());
  const cab = fs.readFileSync(aqui(`portoes/${g}.cabeca`), 'utf8').trim();
  const ini = Date.parse(fs.readFileSync(aqui(`portoes/${g}.inicio`), 'utf8').trim());
  const fim = Date.parse(fs.readFileSync(aqui(`portoes/${g}.fim`), 'utf8').trim());
  medida(`codigo_do_${g}`, codigo, `cat ${PASTA}/portoes/${g}.codigo`, `o registo da corrida é desta cabeça (${cab.slice(0, 8)})`, cab === CABECA);
  medida(`segundos_do_${g}`, Math.round((fim - ini) / 1000), `${PASTA}/portoes/${g}.fim menos ${g}.inicio`, 'as duas horas leram-se', Number.isFinite(fim - ini));
}
const linhaDoPortao = log('build').split('\n').find((l) => l.includes('séries:')) ?? '';
const m = /séries: (\d+) página\(s\), (\d+) ponto\(s\), (\d+) nome\(s\) de país, (\d+) campo\(s\), (\d+) recontagem/.exec(linhaDoPortao);
medida('portao_html_paginas_de_serie', m ? Number(m[1]) : null, 'a linha «séries:» do gate:html no build.log', 'a linha existe', Boolean(m));
medida('portao_html_pontos', m ? Number(m[2]) : null, 'o mesmo', 'a linha existe', Boolean(m));
medida('portao_html_nomes_de_pais', m ? Number(m[3]) : null, 'o mesmo', 'a linha existe', Boolean(m));
medida('portao_html_campos_de_serie', m ? Number(m[4]) : null, 'o mesmo', 'a linha existe', Boolean(m));
medida('portao_html_recontagens', m ? Number(m[5]) : null, 'o mesmo', 'a linha existe', Boolean(m));
const f19 = /faixa da União \(F19\): (\d+) faixa\(s\), (\d+) nos temas, (\d+) marcas refeitas do valor, (\d+) frases recompostas \((\d+) com empate\), (\d+) plantas a morder · (\d+) data\(s\) de série/.exec(log('build'));
medida('f19_faixas', f19 ? Number(f19[1]) : null, 'a linha da F19 do check:formas no build.log', 'a linha existe', Boolean(f19));
medida('f19_marcas', f19 ? Number(f19[3]) : null, 'o mesmo', 'a linha existe', Boolean(f19));
medida('f19_frases', f19 ? Number(f19[4]) : null, 'o mesmo', 'a linha existe', Boolean(f19));
medida('f19_frases_com_empate', f19 ? Number(f19[5]) : null, 'o mesmo', 'a linha existe', Boolean(f19));
medida('f19_plantas', f19 ? Number(f19[6]) : null, 'o mesmo', 'a linha existe', Boolean(f19));
medida('f19_datas_de_serie', f19 ? Number(f19[7]) : null, 'o mesmo', 'a linha existe', Boolean(f19));
const led = /séries · (\d+) série\(s\) de (\d+) ponto\(s\), (\d+) com marca da fonte · (\d+) planta\(s\)/.exec(log('build'));
medida('ledger_check_series', led ? Number(led[1]) : null, 'a linha «séries ·» do ledger:check no build.log', 'a linha existe', Boolean(led));
medida('ledger_check_plantas', led ? Number(led[4]) : null, 'o mesmo', 'a linha existe', Boolean(led));
const k18 = /faixas refeitas dos pontos \(K18\)\s+(\d+) · (\d+) planta\(s\) a morder/.exec(log('verify'));
medida('k18_faixas', k18 ? Number(k18[1]) : null, 'a linha da K18 do check:cartao no verify.log', 'a linha existe', Boolean(k18));
medida('k18_plantas', k18 ? Number(k18[2]) : null, 'o mesmo', 'a linha existe', Boolean(k18));
const cruz = /séries · (\d+) linha\(s\) de série em (\d+) registo\(s\) · (\d+) planta\(s\)/.exec(log('build'));
medida('check_cruzamento_series', cruz ? Number(cruz[1]) : null, 'a linha «séries ·» do check:cruzamento no build.log', 'a linha existe', Boolean(cruz));
medida('check_cruzamento_plantas', cruz ? Number(cruz[3]) : null, 'o mesmo', 'a linha existe', Boolean(cruz));
const voz = /(\d+) linhas do inventário com bloco \((\d+) vivas, todas rendidas/.exec(log('build'));
medida('inventario_vivas_rendidas', voz ? Number(voz[2]) : null, 'a linha do check:voz no build.log', 'a linha existe', Boolean(voz));
const inventario = fs.readFileSync(path.join(RAIZ, 'design/especime-v3/INVENTARIO-FRASES.md'), 'utf8').split('\n').filter((l) => /^\| [a-z]+ \| .* \| ue1 \| /.test(l));
medida('linhas_do_inventario_do_bloco', inventario.length, 'as linhas do inventário com o bloco «ue1»', 'a linha «média da União» é uma delas', inventario.some((l) => l.includes('| média da União | ue1 |')));

/* ------------------------------------------------------------ plantas, capturas, acertos, motor */
const plantas = JSON.parse(fs.readFileSync(aqui('plantas-ue1.json'), 'utf8'));
medida('plantas_do_bloco', plantas.plantas, `${PASTA}/plantas-ue1.json`, 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_que_morderam', plantas.mordidas, 'o mesmo, as que deram código diferente de zero com a queixa esperada e repostas', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('plantas_repostas_pelo_sha256', plantas.repostas_com_o_mesmo_sha256, 'o mesmo, as que voltaram ao sha256 de antes', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
medida('corridas_limpas_a_zero', plantas.corridas_limpas_a_zero, 'o mesmo, os portões corridos limpos depois das plantas', 'o manifesto é desta cabeça', plantas.cabeca === CABECA);
const capturas = JSON.parse(fs.readFileSync(aqui('capturas-ue1.json'), 'utf8'));
medida('capturas', capturas.capturas, `${PASTA}/capturas-ue1.json`, 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_com_problema', capturas.problemas.length, 'o mesmo, a lista dos problemas medidos', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('pedidos_para_fora_nas_capturas', capturas.pedidos_recusados_para_fora, 'o mesmo, os pedidos recusados', 'o manifesto é desta cabeça', capturas.cabeca_esperada === CABECA);
medida('capturas_de_cartoes', capturas.resultados.filter((r) => r.tipo === 'cartao').length, 'o mesmo, as de tipo «cartao»', 'o cartão da pobreza (o do empate) está entre elas', capturas.resultados.some((r) => r.tipo === 'cartao' && r.linha === 'risco-de-pobreza-ou-exclusao-2025'));
medida('capturas_de_recibos', capturas.resultados.filter((r) => r.tipo === 'recibo').length, 'o mesmo, as de tipo «recibo»', 'o recibo dos preços da habitação está entre elas', capturas.resultados.some((r) => r.tipo === 'recibo' && r.serie === 'precos-da-habitacao-2025-paises'));
medida('larguras_das_capturas', capturas.larguras, 'o mesmo, as larguras', 'a de 390 está lá', capturas.larguras.includes(390));
medida('larguras_das_capturas_conta', capturas.larguras.length, 'o mesmo, quantas', 'a de 1600 está lá', capturas.larguras.includes(1600));
const faixas = JSON.parse(fs.readFileSync(aqui('faixas-ue1.json'), 'utf8'));
const faixasDaCabeca = faixas.cabeca_esperada === CABECA && faixas.plantas_vistas === faixas.plantas.length && faixas.plantas.length > 0;
const oQueDasFaixas = 'o manifesto é desta cabeça e o detetor viu as suas plantas (um rótulo sobre outro, uma ponta fora do cartão, a página a transbordar), nas duas edições';
medida('faixas_medidas_nas_larguras', faixas.medicoes_de_faixa, `node ${PASTA}/faixas-ue1.mjs, cada faixa de cada página nas cinco larguras`, oQueDasFaixas, faixasDaCabeca);
medida('faixas_paginas_com_faixa', faixas.paginas.pt.length + faixas.paginas.en.length, 'o mesmo, as páginas medidas por largura', oQueDasFaixas, faixasDaCabeca);
medida('faixas_series_por_edicao', Math.min(faixas.series_com_faixa_por_edicao.pt, faixas.series_com_faixa_por_edicao.en), 'o mesmo, as séries com faixa em cada edição', oQueDasFaixas, faixasDaCabeca);
medida('faixas_com_problema', faixas.problemas.length, 'o mesmo, a lista dos problemas medidos', oQueDasFaixas, faixasDaCabeca);
medida('faixas_plantas_vistas', faixas.plantas_vistas, 'o mesmo, as plantas do detetor que ele viu', 'o manifesto tem plantas', faixas.plantas.length > 0);
medida('faixas_pedidos_para_fora', faixas.pedidos_recusados_para_fora, 'o mesmo, os pedidos recusados', oQueDasFaixas, faixasDaCabeca);
const acertos = JSON.parse(fs.readFileSync(aqui('acertos-ue1-resultado.json'), 'utf8'));
medida('acertos_declarados', acertos.acertos, `python3 ${PASTA}/acertos-ue1.py`, 'as frases do brief encontraram-se', acertos.resultado.length > 0);
medida('formas_da_frase_iguais', acertos.iguais, 'o mesmo, as formas iguais', 'as frases do brief encontraram-se', acertos.resultado.length > 0);
const declarados = JSON.parse(fs.readFileSync(aqui('acertos-ue1.json'), 'utf8')).acertos;
medida('grupos_de_acertos', new Set(declarados.map((a) => a.id)).size, `${PASTA}/acertos-ue1.json, os id distintos`, 'o F1 está entre eles', declarados.some((a) => a.id === 'F1'));
medida('ramos_da_frase', new Set(acertos.resultado.map((r) => r.ramo)).size, `${PASTA}/acertos-ue1-resultado.json, os ramos distintos`, 'o ramo de vários países está lá', acertos.resultado.some((r) => r.ramo === 'varios'));
medida('linguas_da_frase', new Set(acertos.resultado.map((r) => r.lingua)).size, 'o mesmo, as línguas distintas', 'o inglês está lá', acertos.resultado.some((r) => r.lingua === 'en'));
const motor = JSON.parse(fs.readFileSync(aqui('motor/motor-ue1.json'), 'utf8'));
for (const [k, v] of Object.entries(motor.medidas)) medida(`motor_${k}`, v.valor, v.comando, v.o_que, v.encontrado);
const pedidos = JSON.parse(fs.readFileSync(aqui('motor/pedidos-ue1.json'), 'utf8'));
for (const [k, v] of Object.entries(pedidos.medidas)) medida(`pedidos_${k}`, v.valor, v.comando, v.o_que, v.encontrado);
const tipos = JSON.parse(fs.readFileSync(aqui('tipos-ue1.json'), 'utf8'));
const plantaDoTipo = (n) => tipos.plantas.find((p) => p.nome === n);
const emSeries = plantaDoTipo('um-tipo-desconhecido-em-series');
medida('tipos_ficheiros_do_sitio_no_programa', tipos.ficheiros_do_sitio_no_programa, `node ${PASTA}/tipos-ue1.mjs (tsc -p tsconfig.check.json --listFilesOnly)`, `${tipos.conhecido_positivo_da_lista.o_que}, e a corrida é desta cabeça`, tipos.conhecido_positivo_da_lista.encontrado && tipos.cabeca === CABECA);
medida('tipos_series_no_programa', tipos.no_programa['src/lib/series.mjs'], 'o mesmo, src/lib/series.mjs', 'a mesma lista tem src/tipos.d.ts', tipos.no_programa['src/tipos.d.ts']);
medida('tipos_faixa_dos_testes_no_programa', tipos.no_programa['tests/cartao/faixa.mjs'], 'o mesmo, tests/cartao/faixa.mjs', 'a mesma lista tem src/lib/series.mjs', tipos.no_programa['src/lib/series.mjs']);
medida('tipos_series_do_portao_no_programa', tipos.no_programa['scripts/series-do-portao.mjs'], 'o mesmo, scripts/series-do-portao.mjs', 'a mesma lista tem src/lib/faixa-da-uniao.mjs', tipos.no_programa['src/lib/faixa-da-uniao.mjs']);
medida('tipos_corrida_limpa_codigo', tipos.corrida_limpa.codigo, 'npm run typecheck, corrido pelo guião antes das plantas', 'a corrida é desta cabeça', tipos.cabeca === CABECA);
medida('tipos_planta_em_series_codigo', emSeries.codigo, 'npm run typecheck com um nome de tipo que não existe na linha de «@returns {x is Serie}» de src/lib/series.mjs', 'a queixa TS2304 aponta essa linha', emSeries.ts2304_na_linha);
medida('tipos_planta_em_series_linha', emSeries.linha, 'o mesmo, a linha', 'a queixa TS2304 aponta essa linha', emSeries.ts2304_na_linha);
medida('tipos_plantas_fora_do_programa_a_zero', tipos.plantas.filter((p) => p.espera === 'não morde' && p.codigo === 0 && p.como_esperado).length, 'a mesma anotação acrescentada no fim de tests/cartao/faixa.mjs e de scripts/series-do-portao.mjs', 'a mesma anotação fecha o typecheck em src/lib/series.mjs', emSeries.codigo !== 0);
medida('tipos_plantas_repostas', tipos.plantas_repostas_pelo_sha256, 'o sha256 de cada ficheiro antes e depois da planta', 'as plantas estão no manifesto', tipos.plantas.length > 0);
medida('tipos_checkjs_do_tsconfig_json', tipos.configuracao.tsconfig_json_checkJs, 'tsconfig.json, compilerOptions.checkJs', 'o do tsconfig.check.json lê-se true pelo mesmo leitor', tipos.configuracao.tsconfig_check_json_checkJs === true);
const custo = JSON.parse(fs.readFileSync(aqui('custo-ue1.json'), 'utf8'));
for (const [k, v] of Object.entries(custo.medidas)) medida(`custo_${k}`, v.valor, v.comando, v.o_que, v.encontrado);

const saida = { bloco: 'UE1', cabeca_do_codigo: CABECA, base: BASE, guiao: `${PASTA}/medir-ue1.mjs`, medidas };
fs.writeFileSync(aqui('medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const sem = medidas.filter((x) => !x.conhecido_positivo.encontrado);
console.log(`UE1 medidas: ${medidas.length} medida(s), ${sem.length} sem o conhecido-positivo encontrado`);
for (const x of sem) console.log(`  x ${x.nome}`);
process.exit(sem.length ? 1 : 0);
