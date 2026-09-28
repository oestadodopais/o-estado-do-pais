#!/usr/bin/env node
/**
 * AS MEDIDAS DO BLOCO CI1 (28.09.2026). Lê as provas de `evidencias/` e de
 * `portoes/`, ao lado, e escreve `medidas.json`: cada medição com o `nome` por
 * que o relatório a cita, o `valor`, o `comando` que a repete e o
 * `conhecido_positivo` (`{ o_que, encontrado }`), que é uma coisa que a mesma
 * leitura tem de encontrar para o valor contar.
 *
 * Não mede nada de novo: junta o que os guiões do bloco já escreveram
 * (`cronometro.mjs`, `comparar-dist.mjs`, `comparar-repetidas.mjs`,
 * `inventariar.mjs`, `perfil.mjs`, `tempos-da-corrida.mjs`, e o próprio
 * `scripts/verify-depois-do-build.mjs`), para que cada número do relatório
 * resolva num ficheiro. Uma prova em falta é «NÃO LIDO», e o guião sai com 1.
 *
 * A PREVISÃO PARA O GITHUB NÃO É UMA MEDIÇÃO, e diz-se: fica à parte, em
 * `previsoes`, com a fórmula e as entradas. Medem-na as duas corridas do lugar
 * de direção, com `tempos-da-corrida.mjs`.
 *
 * Uso, da raiz do sítio: node design/especime-v3/medicoes/ci1-2026-09-28/medir-ci1.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const E = path.join(AQUI, 'evidencias');
const NAO = 'NÃO LIDO';
const faltas = [];
/** @param {string} f */
function le(f) {
  try {
    return JSON.parse(fs.readFileSync(path.join(E, f), 'utf8'));
  } catch (e) {
    faltas.push(`${f}: ${e.code ?? 'ilegível'}`);
    return null;
  }
}
const r1 = (x) => (typeof x === 'number' ? Math.round(x * 10) / 10 : NAO);
const medidas = [];
/** @param {string} nome @param {unknown} valor @param {string} comando @param {string} oQue @param {boolean} encontrado */
function medicao(nome, valor, comando, oQue, encontrado) {
  medidas.push({ nome, valor: valor ?? NAO, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) } });
}
const M = 'design/especime-v3/medicoes/ci1-2026-09-28';

/* ------------------------------------------------ o §0 do brief, reproduzido */
const brief = le('brief-ci1-reproduzido.json');
const doBrief = (n) => brief?.medidas.find((m) => m.nome === n);
for (const n of ['passos_do_build', 'passos_do_verify', 'passos_repetidos']) {
  const m = doBrief(n);
  medicao(n, m?.valor, `OEDP_MEDIDAS_JSON=<ficheiro> python3 design/observatorio/medidas/BRIEF-CI1.py (${m?.comando ?? ''})`, m?.conhecido_positivo?.o_que ?? '', m?.conhecido_positivo?.encontrado);
}
const p4 = le('verify-depois-B1-p4.resultado.json');
medicao('passos_corridos_pelo_guiao', p4?.celulas?.U?.corridos_aqui, 'node scripts/verify-depois-do-build.mjs --paralelo 4 --json <f> · celulas.U.corridos_aqui',
  'a célula U leu os 33 passos do verify e 17 corridos pelo build', p4?.celulas?.U?.passos_do_verify === 33 && p4?.celulas?.U?.cobertos_pelo_build === 17);

/* ----------------------------------------- a corrida de referência no GitHub */
const ref = le('referencia-36412381787.json');
const corrida = ref?.corridas?.[0];
const trabalho = corrida?.trabalhos?.[0];
const passoCi = (n) => trabalho?.passos.find((p) => p.nome === n)?.segundos ?? null;
const cpRef = Boolean(ref?.conhecido_positivo?.build_s > 600 && ref?.conhecido_positivo?.astro_s > 400);
const T = `node ${M}/tempos-da-corrida.mjs 36412381787`;
const oQueRef = 'na corrida de referência, o passo do build, o do verify e a construção do Astro lidos no registo';
medicao('ci_antes_corrida_min', corrida?.minutos_da_corrida, `${T} · run_started_at a updated_at`, oQueRef, cpRef);
medicao('ci_antes_trabalho_min', trabalho?.minutos, `${T} · o trabalho portao, started_at a completed_at`, oQueRef, cpRef);
const preparacao = ['Set up job', 'A árvore', 'O Node', 'npm ci', 'O Chromium do Playwright'].map(passoCi);
medicao('ci_antes_preparacao_s', preparacao.every((x) => typeof x === 'number') ? preparacao.reduce((a, b) => a + b, 0) : null,
  `${T} · os passos antes do build (a máquina, a árvore, o Node, o npm ci, o Chromium)`, oQueRef, cpRef);
medicao('ci_antes_build_s', passoCi('npm run build'), `${T} · o passo npm run build`, oQueRef, cpRef);
medicao('ci_antes_verify_s', passoCi('npm run verify'), `${T} · o passo npm run verify`, oQueRef, cpRef);
medicao('ci_antes_astro_s', trabalho?.astro_build_segundos, `${T} · de «generating static routes» a «[build] Complete!»`, oQueRef, cpRef);
/* As conferências do verify, separadas pela marca «verify» no registo. */
const guioes = trabalho?.guioes_do_npm ?? [];
const iv = guioes.findIndex((g) => g.nome === 'verify');
const noVerify = iv >= 0 ? guioes.slice(iv + 1).filter((g) => g.nome !== 'typecheck') : [];
const noBuild = new Set(iv >= 0 ? guioes.slice(0, iv).map((g) => g.nome) : []);
const repetidas = noVerify.filter((g) => noBuild.has(g.nome) && g.nome !== 'mapa:unidades');
const soVerify = noVerify.filter((g) => !repetidas.includes(g));
const soma = (l) => r1(l.reduce((a, g) => a + g.segundos, 0));
medicao('ci_antes_repetidas_no_verify_s', repetidas.length === 17 ? soma(repetidas) : null,
  `${T} · as marcas do npm depois da marca verify, só as 17 que o build já correra com o mesmo comando`, 'as 17 conferências repetidas encontradas no registo', repetidas.length === 17);
medicao('ci_antes_so_do_verify_s', soVerify.length === 16 ? soma(soVerify) : null,
  `${T} · as marcas do npm depois da marca verify, as 16 que o build não corre`, 'as 16 conferências só do verify encontradas no registo', soVerify.length === 16);
const ci = (n) => noVerify.find((g) => g.nome === n)?.segundos ?? null;
for (const [nome, g] of [['ci_antes_alvos_s', 'check:alvos'], ['ci_antes_palavras_s', 'check:palavras'], ['ci_antes_moldura_s', 'check:moldura']]) {
  medicao(nome, ci(g), `${T} · a marca de ${g} até à seguinte, no verify`, `a marca de ${g} no registo`, ci(g) !== null);
}
medicao('ci_antes_tres_lentas_s', [ci('check:alvos'), ci('check:palavras'), ci('check:moldura')].every((x) => x !== null) ? r1(ci('check:alvos') + ci('check:palavras') + ci('check:moldura')) : null,
  `${T} · a soma das três`, 'as três marcas no registo', [ci('check:alvos'), ci('check:palavras'), ci('check:moldura')].every((x) => x !== null));

/* ------------------------------------------- a construção local, antes e depois */
const construcao = (f, rotulo, cab) => {
  const d = le(f);
  const passo = (n) => d?.passos?.find((p) => p.nome === n)?.segundos ?? null;
  const cp = d?.codigo === 0 && d?.paginas_do_astro === 7404 && d?.astro_build !== null;
  const C = `node ${M}/cronometro.mjs <prefixo> -- npm run build (na cabeça ${cab}) · ${f}`;
  const oQue = 'o registo tem as marcas do Astro, as 7 404 páginas e o código 0';
  medicao(`${rotulo}_s`, r1(d?.segundos), C, oQue, cp);
  medicao(`${rotulo}_astro_s`, r1(d?.astro_build?.segundos), `${C} · astro_build`, oQue, cp);
  medicao(`${rotulo}_gate_html_s`, r1(passo('gate:html')), `${C} · o passo gate:html`, oQue, cp);
  medicao(`${rotulo}_check_voz_s`, r1(passo('check:voz')), `${C} · o passo check:voz`, oQue, cp);
  medicao(`${rotulo}_cartoes_s`, r1(passo('cartoes')), `${C} · o passo cartoes`, oQue, cp);
  return d;
};
construcao('build-A1.json', 'build_antes', '1c1952c9');
construcao('build-A2-perfilada.json', 'build_perfilada', '1c1952c9, com --cpu-prof em cada processo Node');
construcao('build-B1.json', 'build_depois', '27b13b92');
medicao('paginas_do_astro', le('build-B1.json')?.paginas_do_astro, `${M}/evidencias/build-B1.json · paginas_do_astro`, 'a linha «[build] N page(s) built» do Astro', le('build-B1.json')?.paginas_do_astro > 0);

/* ------------------------------------------------------------------ o perfil */
const perfil = le('perfil-A2-astro.json');
const pedacoDaParidade = perfil?.por_ficheiro?.find(([k]) => /politica-ia_/.test(k));
const funcoesDaParidade = (perfil?.proprio ?? []).filter(([k]) => /politica-ia_/.test(k)).map(([k]) => k.split(' · ')[0]);
const P = `node ${M}/perfil.mjs <rascunho>/perfil-A2/<o perfil do astro build>.cpuprofile`;
const cpPerfil = funcoesDaParidade.includes('chaves') && funcoesDaParidade.includes('assertKeyParity');
const oQuePerfil = 'as funções chaves e assertKeyParity de src/i18n/strings.mjs aparecem no pedaço onde o Vite o empacotou';
medicao('perfil_astro_s', r1((perfil?.total_ms ?? NaN) / 1000), `${P} · total amostrado`, oQuePerfil, cpPerfil);
medicao('perfil_paridade_s', r1((pedacoDaParidade?.[1] ?? NaN) / 1000), `${P} · tempo próprio no pedaço de strings.mjs`, oQuePerfil, cpPerfil);
medicao('perfil_paridade_pct', r1((100 * (pedacoDaParidade?.[1] ?? NaN)) / (perfil?.total_ms ?? NaN)), `${P} · a razão das duas`, oQuePerfil, cpPerfil);
const porProcesso = le('perfis-por-processo-A2.json');
const gate = porProcesso?.processos?.find((p) => p.processo === 'scripts/gate-html.mjs');
medicao('perfil_gate_html_s', gate?.total_s, `node <rascunho>/perfis-por-processo.mjs <rascunho>/perfil-A2 · scripts/gate-html.mjs`, 'o perfil do gate:html achado entre os 44 da construção perfilada', Boolean(gate));
medicao('perfil_gate_html_paridade_s', gate?.paridade_s, 'o mesmo · o tempo próprio de chaves, assertKeyParity e t', 'o perfil do gate:html achado', Boolean(gate));

/* ------------------------------------------------------- a prova byte a byte */
for (const [f, nome, cabs] of [['comparar-A1-A2.json', 'diferencas_controlo', 'A1 e A2, as duas em 1c1952c9'], ['comparar-A1-B1.json', 'diferencas_depois', 'A1 em 1c1952c9 e B1 em 27b13b92']]) {
  const d = le(f);
  medicao(nome, d?.diferencas, `node ${M}/comparar-dist.mjs <dist ${cabs.split(' e ')[0]}> <dist ${cabs.split(' e ')[1]}> · ${f}`,
    'um byte trocado, um ficheiro a mais e um a menos, vistos numa cópia pequena antes de comparar', d?.conhecido_positivo?.ok);
}
{
  const d = le('comparar-A1-final.json');
  medicao('diferencas_final', d?.diferencas, `node ${M}/comparar-dist.mjs <dist A1 em 1c1952c9> <dist do portão build> · comparar-A1-final.json`,
    'um byte trocado, um ficheiro a mais e um a menos, vistos numa cópia pequena antes de comparar', d?.conhecido_positivo?.ok);
  medicao('dist_ficheiros_final', d?.ficheiros_depois, `${M}/evidencias/comparar-A1-final.json · ficheiros_depois`, 'os ficheiros das duas construções contados um a um', d?.ficheiros_antes === d?.ficheiros_depois);
}
const b1 = le('comparar-A1-B1.json');
medicao('dist_ficheiros', b1?.ficheiros_depois, `${M}/evidencias/comparar-A1-B1.json · ficheiros_depois`, 'os ficheiros das duas construções contados um a um', b1?.ficheiros_antes === b1?.ficheiros_depois);
medicao('carimbo_campos_depois', b1?.carimbo?.length, `${M}/evidencias/comparar-A1-B1.json · carimbo`, 'o commit e o construido_em de version.json e prova.json', (b1?.carimbo ?? []).every((c) => ['commit', 'construido_em'].includes(c.campo)));

/* ------------------------------------------------------------------ o verify */
const inteiro = le('verify-inteiro-B1.json');
medicao('verify_inteiro_depois_s', r1(inteiro?.segundos), `node ${M}/cronometro.mjs <prefixo> -- npm run verify (na cabeça 27b13b92, sobre o dist/ de B1)`, 'o código 0 e 33 marcas do npm além da do verify', inteiro?.codigo === 0 && (inteiro?.passos?.length ?? 0) >= 34);
for (const [f, nome, n] of [['verify-depois-B1-p4.resultado.json', 'verify_depois_do_build_p4_s', 4], ['verify-depois-B1-p10.resultado.json', 'verify_depois_do_build_p10_s', 10]]) {
  const d = le(f);
  medicao(nome, r1(d?.segundos), `node scripts/verify-depois-do-build.mjs --paralelo ${n} --json <f>`, 'as sete plantas morderam e as três células passaram', d?.ok === true && (d?.plantas ?? []).every((p) => p.mordeu));
}
const fin = le('verify-depois-final-p4.resultado.json');
medicao('verify_depois_do_build_final_s', r1(fin?.segundos), 'node scripts/verify-depois-do-build.mjs --paralelo 4 --json <f>, na cabeça dos portões, sobre o dist/ do portão build',
  'as sete plantas morderam, as três células passaram e a cabeça é a dos portões', fin?.ok === true && (fin?.plantas ?? []).every((p) => p.mordeu) && fin?.celulas?.C?.cabeca === fin?.cabeca);
const alvosP4 = p4?.corridos?.find((c) => c.passo === 'npm run check:alvos');
medicao('alvos_no_p4_s', r1(alvosP4?.segundos), 'o mesmo, com --paralelo 4 · a linha de npm run check:alvos', 'o check:alvos correu e saiu com 0', alvosP4?.codigo === 0);
const inv = le('inventario.json');
const conf = inv?.conferencias ?? [];
const alvosSo = conf.find((c) => c.passo === 'npm run check:alvos');
const I = `node ${M}/inventariar.mjs <saida.json>`;
const cpInv = Boolean(inv?.conhecido_positivo?.visto?.servidores?.length >= 1 && inv?.conhecido_positivo?.visto?.chromium >= 1);
const oQueInv = 'a sonda viu o servidor, o Chromium e a pasta temporária do check:cabeca antes de inventariar';
medicao('alvos_sozinho_s', r1(alvosSo?.segundos), `${I} · check:alvos, corrido sozinho`, oQueInv, cpInv);
medicao('so_do_verify_em_serie_s', conf.length === 16 ? r1(conf.reduce((a, c) => a + c.segundos, 0)) : null, `${I} · a soma das 16, cada uma sozinha`, oQueInv, cpInv);
const bB1 = le('build-B1.json');
medicao('build_e_verify_inteiro_depois_s', r1((bB1?.segundos ?? NaN) + (inteiro?.segundos ?? NaN)), 'build_depois_s mais verify_inteiro_depois_s: a corrida como era, com o código de hoje', 'as duas medições lidas', typeof bB1?.segundos === 'number' && typeof inteiro?.segundos === 'number');
medicao('build_e_guiao_depois_s', r1((bB1?.segundos ?? NaN) + (p4?.segundos ?? NaN)), 'build_depois_s mais verify_depois_do_build_p4_s: a corrida como fica', 'as duas medições lidas', typeof bB1?.segundos === 'number' && typeof p4?.segundos === 'number');
const rep = le('repetidas-B1.json');
medicao('repetidas_iguais', rep?.iguais, `node ${M}/comparar-repetidas.mjs <build-B1.log> <verify-inteiro-B1.log>`, 'uma linha trocada numa cópia é vista como diferença', rep?.conhecido_positivo === 'uma linha trocada é vista');
medicao('repetidas_total', rep?.repetidas, 'o mesmo · as conferências do verify que são passos do build', 'uma linha trocada é vista', rep?.conhecido_positivo === 'uma linha trocada é vista');
medicao('repetidas_linhas_diferentes_sem_normalizar', rep?.linhas_diferentes_sem_normalizar, 'o mesmo · sem apagar horas nem durações', 'uma linha trocada é vista', rep?.conhecido_positivo === 'uma linha trocada é vista');
const pc = le('prova-cadeia-verify.json');
medicao('prova_e_cadeia_iguais_depois_do_verify', pc?.iguais, 'shasum -a 256 dist/prova.json dist/cadeia.json, antes e depois do npm run verify inteiro', 'os dois resumos lidos antes e depois', Object.keys(pc?.antes ?? {}).length === 2);

/* ---------------------------------------------------------------- o inventário */
medicao('conferencias_inventariadas', conf.length, I, oQueInv, cpInv);
medicao('conferencias_com_servidor', conf.filter((c) => c.servidores.length > 0).length, `${I} · servidores`, oQueInv, cpInv);
medicao('servidores_com_porta_fixa', conf.flatMap((c) => c.servidores).filter((s) => s.porta !== 0).length, `${I} · as portas pedidas que não são 0`, oQueInv, cpInv);
medicao('conferencias_com_chromium', conf.filter((c) => c.chromium > 0).length, `${I} · processos do Chromium lançados`, oQueInv, cpInv);
medicao('conferencias_que_escrevem_em_dist', conf.filter((c) => c.escritas_em_dist.length > 0 || c.dist_mudou.length > 0).length, `${I} · escritas em dist/ e sha256 de dist/ antes e depois`, oQueInv, cpInv);
medicao('conferencias_que_escrevem_na_arvore', conf.filter((c) => c.escritas_na_raiz.length > 0).length, `${I} · escritas na raiz fora de dist/ (só o design:feixe, em design-system/)`, oQueInv, cpInv);
medicao('conferencias_que_mudam_o_git', conf.filter((c) => c.git_antes_e_nao_depois.length + c.git_depois_e_nao_antes.length > 0).length, `${I} · git status --porcelain --ignored antes e depois`, oQueInv, cpInv);
medicao('memoria_max_mib', Math.max(...conf.map((c) => c.memoria_max_mib ?? 0)), `${I} · /usr/bin/time -l, a maior (check:indice)`, oQueInv, cpInv);

/* ------------------------------------------------------------------ as plantas */
const pv = le('plantas-verify-depois.json');
medicao('plantas_do_guiao_mordidas', pv?.mordidas, 'node scripts/verify-depois-do-build.mjs --prova', 'a cadeia sintética limpa passa', pv?.plantas?.[0]?.mordeu);
medicao('plantas_do_guiao_total', pv?.total, 'o mesmo', 'a cadeia sintética limpa passa', pv?.plantas?.[0]?.mordeu);
medicao('contraprovas_das_celulas', pv?.contraprova?.apanhados, 'numa cópia do guião, a U, a D e a C a dizerem sempre ok, e a prova corrida', 'cada cópia estragada fechou com 1', (pv?.contraprova?.estragos ?? []).every((e) => e.codigo === 1));
const pg = le('plantas-guardas.json');
medicao('guardas_casos_antes', pg?.casos_na_cabeca_de_partida, 'git show 1c1952c9:scripts/provar-guardas.mjs, corrido em scripts/', 'a linha «guardas · N conferência(s)» na saída', typeof pg?.casos_na_cabeca_de_partida === 'number');
medicao('guardas_casos_depois', pg?.casos_depois, 'node scripts/provar-guardas.mjs', 'a linha «guardas · N conferência(s)» na saída', typeof pg?.casos_depois === 'number');
medicao('contraprovas_da_paridade', (pg?.contraprova?.estragos ?? []).filter((e) => e.codigo === 1 && e.casos_que_falharam.length > 0).length,
  'src/i18n/strings.mjs estragado no sítio (sem a conferência; sem congelar), o provar:guardas corrido, e os bytes repostos', 'os bytes repostos têm o sha256 de antes', pg?.contraprova?.reposto_igual);
const real = le('planta-cadeia-real.json');
medicao('planta_cadeia_real_mordeu', real?.mordeu, `sh ${M}/planta-na-cadeia-real.sh <saida.json>`, 'o package.json e o dist/index.html repostos com o sha256 de antes', real?.package_json_reposto && real?.index_reposto);
medicao('planta_cadeia_real_vermelhas', real?.vermelhos?.length, 'o mesmo · as conferências que saíram diferente de 0', 'o check:palavras entre elas', (real?.vermelhos ?? []).includes('npm run check:palavras'));

/* ---------------------------------------------------------------- o anfitrião */
const anf = le('anfitriao-github.json');
for (const k of ['nucleos', 'memoria_gb']) {
  medicao(`anfitriao_${k}`, anf?.publico?.[k], `curl -sSL ${anf?.endereco ?? ''} · a linha dos repositórios públicos (${anf?.hora ?? ''}, sha256 ${anf?.sha256_da_resposta ?? ''})`,
    'a linha dos repositórios privados, lida da mesma página, tem outros números', anf?.privado?.nucleos !== undefined && anf?.privado?.nucleos !== anf?.publico?.nucleos);
}
medicao('plantas_novas_da_paridade', le('plantas-guardas.json')?.plantas_novas?.length, `${M}/evidencias/plantas-guardas.json · plantas_novas`, 'a diferença dos casos antes e depois é a mesma', (le('plantas-guardas.json')?.casos_depois ?? 0) - (le('plantas-guardas.json')?.casos_na_cabeca_de_partida ?? 0) === le('plantas-guardas.json')?.plantas_novas?.length);

/* ---------------------------------------------------------------- o check:alvos */
const al = le('alvos-esperas.json');
for (const k of ['passagens', 'rotas_do_axe', 'networkidle_ms', 'espera_fixa_ms_por_passagem', 'espera_minima_s']) {
  medicao(`alvos_${k}`, al?.[k], `${M}/evidencias/alvos-esperas.json · ${k} (o registo do verify inteiro, tests/acessibilidade/alvos.mjs e os tipos do Playwright ${al?.playwright ?? ''})`,
    'a frase do networkidle achada nos tipos do Playwright instalado', Boolean(al?.networkidle_texto));
}

/* ---------------------------------------------------------------- os portões */
const portoes = {};
for (const g of ['build', 'verify', 'typecheck']) {
  let codigo = null;
  let resumo = null;
  try {
    codigo = Number(fs.readFileSync(path.join(AQUI, 'portoes', `${g}.codigo`), 'utf8').trim());
    resumo = JSON.parse(fs.readFileSync(path.join(AQUI, 'portoes', `${g}.json`), 'utf8'));
  } catch (e) {
    faltas.push(`portoes/${g}: ${e.code ?? 'ilegível'}`);
  }
  portoes[g] = { codigo, resumo };
  medicao(`portao_${g}_codigo`, codigo, `node ${M}/cronometro.mjs ${M}/portoes/${g} -- npm run ${g}`, 'o ficheiro .codigo escrito depois de o processo acabar', codigo !== null);
  medicao(`portao_${g}_s`, r1(resumo?.segundos), `o mesmo · ${M}/portoes/${g}.json`, 'o ficheiro .codigo escrito depois de o processo acabar', codigo !== null);
}
medicao('portao_build_astro_s', r1(portoes.build?.resumo?.astro_build?.segundos), `${M}/portoes/build.json · astro_build`, 'as 7 404 páginas do Astro no registo do portão', portoes.build?.resumo?.paginas_do_astro === 7404);

/* ---------------------------------------------------------------- o custo */
const inicio = le('inicio-do-bloco.json')?.inicio ?? null;
const fim = portoes.typecheck?.resumo?.fim ?? null;
medicao('tempo_de_parede_ate_aos_portoes_min', inicio && fim ? r1((Date.parse(fim) - Date.parse(inicio)) / 60000) : null,
  `${M}/evidencias/inicio-do-bloco.json · inicio, até ao fim do typecheck em ${M}/portoes/typecheck.json`, 'as duas horas lidas', Boolean(inicio && fim));

/* ---------------------------------------------------------------- a previsão */
const v = (n) => medidas.find((m) => m.nome === n)?.valor;
const entradas = ['ci_antes_preparacao_s', 'build_depois_s', 'ci_antes_build_s', 'build_antes_s', 'ci_antes_alvos_s', 'ci_antes_verify_s', 'ci_antes_trabalho_min'];
const ok = entradas.every((n) => typeof v(n) === 'number');
const razao = ok ? v('ci_antes_build_s') / v('build_antes_s') : null;
const previsoes = ok
  ? [{
      nome: 'previsao_ci_depois_min',
      valor: r1((v('ci_antes_preparacao_s') + v('build_depois_s') * razao + v('ci_antes_alvos_s')) / 60),
      formula: '(ci_antes_preparacao_s + build_depois_s × ci_antes_build_s ÷ build_antes_s + ci_antes_alvos_s) ÷ 60',
      o_que_nao_conta: 'a disputa dos 4 núcleos do anfitrião pelas conferências lado a lado nos primeiros minutos, e o que a correção da paridade tira ao check:alvos no anfitrião; medem-na as duas corridas do lugar de direção',
      prova_da_formula: {
        o_que: 'a mesma forma (preparação, build e verify) refaz o trabalho da corrida de referência',
        refeito_min: r1((v('ci_antes_preparacao_s') + v('ci_antes_build_s') + v('ci_antes_verify_s')) / 60),
        medido_min: v('ci_antes_trabalho_min'),
      },
    }, {
      nome: 'metade_da_corrida_de_referencia_min',
      valor: r1(v('ci_antes_trabalho_min') / 2),
      formula: 'ci_antes_trabalho_min ÷ 2',
    }]
  : [];

const saida = { bloco: 'CI1', guiao: `${M}/medir-ci1.mjs`, medidas, previsoes, faltas };
fs.writeFileSync(path.join(AQUI, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const naoLidos = medidas.filter((m) => m.valor === NAO || m.valor === null || Number.isNaN(m.valor));
const semCp = medidas.filter((m) => !m.conhecido_positivo.encontrado);
console.log(`${medidas.length} medições · ${naoLidos.length} não lidas · ${semCp.length} sem o conhecido-positivo · ${previsoes.length} previsões · ${faltas.length} provas em falta`);
for (const m of new Set([...naoLidos, ...semCp])) console.log(`  ${m.nome}: ${JSON.stringify(m.valor)} · conhecido-positivo ${m.conhecido_positivo.encontrado ? 'visto' : 'NÃO VISTO'}`);
for (const f of faltas) console.log(`  em falta: ${f}`);
process.exit(naoLidos.length || semCp.length || faltas.length ? 1 : 0);
