/** P4 (02.10.2026): as medidas do bloco, lidas dos ficheiros que o bloco escreveu e da árvore, e escritas em
 * `medidas.json` ao lado deste guião. Nenhum número se escreve à mão: cada medida diz o valor, o comando ou o ficheiro
 * de onde vem, e um conhecido-positivo (uma leitura que tem de dar «encontrado» para que um valor vazio ou zero valha
 * alguma coisa). O que não se conseguir ler fica «NÃO LIDO».
 *
 * O antes de cada item é o do §0 do brief, medido pelo lugar de direção na cabeça 642e9d56
 * (`design/observatorio/medidas/BRIEF-P4.json`), ou, onde o bloco mediu o antes, o ficheiro do antes.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/p4-2026-10-02/medir-p4.mjs
 * Sai 0 com o ficheiro escrito; 1 se alguma medida ficou «NÃO LIDO» ou com o conhecido-positivo por encontrar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PASTA = 'design/especime-v3/medicoes/p4-2026-10-02';
const BASE = 'afc4fb20';
const NAO = 'NÃO LIDO';
const medidas = [];
const ler = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
const lerJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const semCor = (t) => (t ?? '').replace(/\x1b\[[0-9;]*m/g, '');
const git = (...a) => { const r = spawnSync('git', a, { encoding: 'utf8' }); return { codigo: r.status, saida: r.stdout ?? '' }; };
const naBase = (f) => { const r = git('show', `${BASE}:${f}`); return r.codigo === 0 ? r.saida : null; };
const codigo = (f) => { const t = ler(f); return t === null ? NAO : Number(t.trim()); };
const medida = (nome, valor, comando, o_que, encontrado, extra = {}) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: !!encontrado }, ...extra });
const brief = lerJson('design/observatorio/medidas/BRIEF-P4.json');
const antesDoBrief = (nome) => brief?.medidas?.find((m) => m.nome === nome)?.valor ?? NAO;

/* 00 · o tema */
const FOLHAS = ['src/styles/tokens.css', 'src/styles/site.css', 'src/styles/dominio.css'];
const folhasAgora = FOLHAS.filter((f) => (ler(f) ?? '').includes('prefers-color-scheme: dark'));
const folhasBase = FOLHAS.filter((f) => (naBase(f) ?? '').includes('prefers-color-scheme: dark'));
medida('folhas_que_seguem_a_preferencia_do_aparelho', folhasAgora.length,
  'as três folhas de src/styles com «prefers-color-scheme: dark», na árvore', `as mesmas folhas na base ${BASE} têm-no (${folhasBase.length})`, folhasBase.length > 0,
  { antes: antesDoBrief('folhas_que_seguem_a_preferencia_do_aparelho') });
const usos = (rev) => {
  const r = git('grep', '-l', 'ControloDeTema', rev, '--', 'src/layouts', 'src/components', 'src/views');
  return r.saida.split('\n').filter(Boolean).map((l) => l.replace(`${rev}:`, '')).filter((f) => !f.endsWith('ControloDeTema.astro'));
};
const usosAgora = usos('HEAD');
medida('lugares_onde_o_comando_do_tema_e_rendido', usosAgora.length,
  'git grep -l ControloDeTema HEAD -- src/layouts src/components src/views, sem o próprio componente', 'o componente existe na árvore', fs.existsSync('src/components/ControloDeTema.astro'),
  { antes: antesDoBrief('lugares_onde_o_comando_do_tema_e_rendido'), onde: usosAgora });
const cap = lerJson(`${PASTA}/capturas-p4.json`);
const paginas = cap?.resultados?.filter((r) => r.tipo === 'pagina') ?? [];
const claras = paginas.filter((r) => /claro/.test(r.tema));
const escuras = paginas.filter((r) => /escuro \(/.test(r.tema));
const clarasCertas = claras.filter((r) => r.medidas.tema === null && r.medidas.papel === 'rgb(246, 247, 244)' && r.medidas.comando_do_tema_a_vista);
const escurasCertas = escuras.filter((r) => r.medidas.tema === 'dark' && r.medidas.papel === 'rgb(21, 23, 26)');
medida('paginas_claras_num_aparelho_escuro_sem_escolha', cap ? `${clarasCertas.length} de ${claras.length}` : NAO,
  `${PASTA}/capturas-p4.json (node ${PASTA}/captar-p4.mjs): sem data-theme, papel rgb(246, 247, 244) e o comando à vista`,
  'as capturas escuras, com a escolha guardada, leem data-theme=dark e o papel rgb(21, 23, 26): a medida distingue os dois', escurasCertas.length === escuras.length && escuras.length === 3,
  { escuras: `${escurasCertas.length} de ${escuras.length}` });
const tm = semCor(ler(`${PASTA}/conferencias-tema/check-primeira.log`));
const tmLinha = tm.match(/tema e menu · TM1 (\d+) corrida\(s\), TM2 (\d+), TM3 (\d+), TM4 (\d+) · (\d+) planta\(s\), (\d+) a morder/);
medida('tema_e_menu', tmLinha ? { TM1: +tmLinha[1], TM2: +tmLinha[2], TM3: +tmLinha[3], TM4: +tmLinha[4], codigo: codigo(`${PASTA}/conferencias-tema/check-primeira.codigo`) } : NAO,
  'npm run check:primeira (tests/inicio/tema-e-menu.mjs --prova), registo em conferencias-tema/check-primeira.log',
  `as plantas mordem (${tmLinha?.[6]} de ${tmLinha?.[5]})`, tmLinha && tmLinha[5] === tmLinha[6] && +tmLinha[5] > 0);
const fila = ler(`${PASTA}/fila-da-marca.log`) ?? '';
const filaAntes = ler(`${PASTA}/fila-da-marca-antes.log`) ?? '';
const a390 = fila.split('\n').filter((l) => / 390:/.test(l));
medida('comando_do_tema_na_linha_da_marca_a_390', a390.length ? `${a390.filter((l) => /na linha da marca/.test(l)).length} de ${a390.length}` : NAO,
  `node ${PASTA}/fila-da-marca.mjs (fila-da-marca.log): a primeira página e «Lugares», nas duas edições`,
  'na primeira página a 320 px o comando desce, e a medida di-lo', /^\/ 320: .*desce/m.test(fila),
  { antes: `${filaAntes.split('\n').filter((l) => / 390:/.test(l) && /na linha da marca/.test(l)).length} de ${filaAntes.split('\n').filter((l) => / 390:/.test(l)).length} (fila-da-marca-antes.log)`,
    alvos: (fila.match(/botões ([^)]*)/) ?? [])[1] ?? NAO });
const nome = ler(`${PASTA}/nome-do-botao.log`) ?? '';
const nomes = [...nome.matchAll(/button "([^"]*)"(?! \[pressed\])/g)].map((m) => m[1]);
medida('nome_do_botao_escuro_na_arvore_de_acessibilidade', nomes[0] ?? NAO,
  `node ${PASTA}/nome-do-botao.mjs (nome-do-botao.log), o ariaSnapshot do Chromium`,
  `com o «·» de antes do P4 posto na medição, o nome lê-se «${nomes[1]}»`, nomes[1] === '· escuro', { antes: nomes[1] ?? NAO });
const cA = lerJson(`${PASTA}/contraste-antes.json`);
const cD = lerJson(`${PASTA}/contraste-depois.json`);
const pares = (c) => Object.entries(c?.estados ?? {}).flatMap(([e, l]) => l.map((p) => `${e}|${p.par}|${p.onde}|${JSON.stringify(p.valores)}`));
const pA = pares(cA), pD = pares(cD);
medida('pares_de_contraste_que_mudaram', cA && cD ? pD.filter((x, i) => x !== pA[i]).length + Math.abs(pA.length - pD.length) : NAO,
  `node scripts/medir-contraste.mjs, antes e depois (contraste-antes.json, contraste-depois.json)`, `os dois ficheiros têm pares (${pA.length} e ${pD.length})`, pA.length > 0 && pD.length > 0);

/* 0 · o menu */
const navAgora = ler('src/lib/navegacao.mjs') ?? '';
const rotas = (t) => { const m = t.match(/export const ROTAS_NAV = \[([^\]]*)\]/); return m ? [...m[1].matchAll(/'([A-Za-z-]+)'/g)].map((x) => x[1]) : []; };
const rAgora = rotas(navAgora), rBase = rotas(naBase('src/lib/navegacao.mjs') ?? '');
medida('entradas_do_menu', rAgora.length, 'src/lib/navegacao.mjs · ROTAS_NAV', `na base ${BASE} são ${rBase.length} e nenhuma é a da União`, rBase.length === 5 && !rBase.includes('uniaoEuropeia'),
  { antes: antesDoBrief('entradas_do_menu'), ordem: rAgora });
const comMenuCerto = paginas.filter((r) => r.medidas.portas.length === 6 && r.medidas.linhas_do_menu === 1 && !r.medidas.menu_transborda);
const cabecalhos = cap?.resultados?.filter((r) => r.tipo === 'cabecalho') ?? [];
medida('paginas_com_as_seis_portas_numa_linha', cap ? `${comMenuCerto.length} de ${paginas.length}` : NAO,
  `${PASTA}/capturas-p4.json: as três páginas, as cinco larguras, as duas edições, e as três escuras`,
  'com o nome inteiro da União, a 390 px, o menu dobra em duas linhas nas duas edições, e a medida di-lo',
  cabecalhos.filter((r) => r.variante === 'nome-inteiro' && r.medidas.linhas_do_menu === 2).length === 2);
const menu = ler(`${PASTA}/menu-a-390.log`) ?? '';
const formas = [...menu.matchAll(/^(pt|en) · ([^:]+): ([\d.]+) px de portas numa coluna de (\d+) · (\d) linha/gm)].map((m) => ({ lang: m[1], forma: m[2], portas: +m[3], coluna: +m[4], linhas: +m[5] }));
medida('menu_a_390_nas_quatro_formas', formas.length ? formas : NAO, `node ${PASTA}/menu-a-390.mjs (menu-a-390.log)`,
  'a forma com o nome inteiro mede duas linhas: a medida vê o menu a dobrar', formas.some((f) => /nome inteiro/.test(f.forma) && f.linhas === 2));

/* 1 · as réguas à mão */
const REGUAS = ['correcoes-a', 'lista', 'mapa-distritos', 'mapa-unidades', 'matriz'];
const resumo = (r) => { const l = semCor(ler(`${PASTA}/reguas-depois/${r}.log`)).split('\n').filter((x) => x.trim()).pop(); return l ? l.trim() : NAO; };
const reguas = Object.fromEntries(REGUAS.map((r) => [r, { codigo: codigo(`${PASTA}/reguas-depois/${r}.codigo`), segundos: codigo(`${PASTA}/reguas-depois/${r}.segundos`), resumo: resumo(r), antes: codigo(`${PASTA}/reguas-antes/${r}.codigo`) }]));
const plantas = Object.fromEntries(['lista', 'mapa-distritos', 'mapa-unidades'].map((r) => {
  const t = semCor(ler(`${PASTA}/reguas-depois/${r}-vermelhos.log`));
  return [r, { codigo: codigo(`${PASTA}/reguas-depois/${r}-vermelhos.codigo`), mordem: (t.match(/vermelho ✓/g) ?? []).length, nao: (t.match(/NÃO APANHOU/g) ?? []).length }];
}));
medida('reguas_a_mao', reguas, `sh ${PASTA}/reguas-a-mao.sh ${PASTA}/reguas-depois, com a tranca (com-tranca.sh), sobre a construção da cabeça ccdd9fa2`,
  'as plantas das três réguas que as têm mordem todas (--vermelhos), e antes do bloco as cinco saíam com 1',
  Object.values(plantas).every((p) => p.codigo === 0 && p.mordem > 0 && p.nao === 0) && REGUAS.every((r) => reguas[r].antes === 1), { plantas });
/* A matriz escreve cada célula duas vezes, uma ao correr e outra na tabela do fim; conta-se a tabela do fim. */
const vermelhas = (r) => {
  const todo = semCor(ler(`${PASTA}/reguas-depois/${r}.log`));
  const i = todo.indexOf('matriz de aceitação ·');
  return (i >= 0 ? todo.slice(i) : todo).split('\n').filter((l) => /^\s+falha\s/.test(l)).map((l) => l.replace(/^\s+falha\s+/, '').trim());
};
medida('celulas_vermelhas_das_reguas', { 'correcoes-a': vermelhas('correcoes-a'), matriz: vermelhas('matriz') },
  'as linhas «falha» dos registos de reguas-depois', 'as células vermelhas contam-se pela mesma linha que o resumo da régua diz',
  vermelhas('correcoes-a').length === 10 && vermelhas('matriz').length === 3);
const t320 = ler(`${PASTA}/transbordo-320.log`) ?? '';
const tr = [...t320.matchAll(/^(\S+) transbordo (\d+) elementos para lá da janela (\d+)/gm)].map((m) => ({ rota: m[1], transbordo: +m[2], elementos: +m[3] }));
medida('transbordo_da_primeira_pagina_a_320', tr.length ? tr : NAO, `node ${PASTA}/transbordo-320.mjs (transbordo-320.log)`,
  'a medida lista os elementos que passam a margem, e nenhum é do cabeçalho', /claim-com-chip/.test(t320) && !/no cabeçalho/.test(t320));

/* 2 · as casas decimais */
const lc = semCor(ler(`${PASTA}/conferencias-fim/ledger-check.log`));
const cd = lc.match(/(\d+) linha\(s\) lida\(s\): (\d+) pelo literal do valor no fim do excerto e (\d+) pela forma que o INE publica \((\d+) com o sinal da fonte declarado\); (\d+) por ler.*· (\d+) planta\(s\), (\d+) certa\(s\)/);
medida('linhas_que_a_regra_das_casas_decimais_le', cd ? { lidas: +cd[1], pelo_literal: +cd[2], pela_forma_do_ine: +cd[3], com_sinal_declarado: +cd[4] } : NAO,
  'npm run ledger:check (scripts/casas-decimais.mjs pela scripts/check-ledger.mjs), registo em conferencias-fim/ledger-check.log',
  `as plantas da regra estão certas (${cd?.[7]} de ${cd?.[6]})`, cd && cd[6] === cd[7] && +cd[6] > 0, { antes: antesDoBrief('linhas_que_a_regra_das_casas_decimais_le') });
medida('linhas_que_a_regra_das_casas_decimais_deixa_por_ler', cd ? +cd[5] : NAO, 'a mesma linha do registo', 'a soma das lidas e das por ler passa de duas mil', cd && +cd[1] + +cd[5] > 2000,
  { antes: antesDoBrief('linhas_que_a_regra_das_casas_decimais_deixa_por_ler') });

/* 3 · os dois termos */
const { DEFINICOES_DAS_MEDIDAS, textoDaDefinicao } = await import(path.resolve('src/data/figuras.mjs'));
const TERMO = /pontos percentuais|percentage points|regimes de ocupação|tenure status/g;
const foraDeParenteses = (t) => [...t.matchAll(TERMO)].filter((m) => { const antes = t.slice(0, m.index); return antes.lastIndexOf('(') <= antes.lastIndexOf(')'); }).length;
let porExplicar = 0, comTermo = 0;
for (const d of Object.values(DEFINICOES_DAS_MEDIDAS)) for (const lang of ['pt', 'en']) {
  if (!d?.[lang]) continue;
  const t = textoDaDefinicao(d[lang]);
  if (t.match(TERMO)) comTermo++;
  porExplicar += foraDeParenteses(t);
}
const fraseDaBase = (naBase('src/data/figuras.mjs') ?? '').split('\n').find((l) => l.includes('Qual é a diferença, em pontos percentuais')) ?? '';
medida('perguntas_com_os_dois_termos_fora_dos_parenteses', porExplicar,
  'src/data/figuras.mjs: DEFINICOES_DAS_MEDIDAS pela textoDaDefinicao, as duas edições; um termo conta quando não está dentro de um parêntese',
  `a pergunta da base («Qual é a diferença, em pontos percentuais, …») conta ${foraDeParenteses(fraseDaBase)}`, foraDeParenteses(fraseDaBase) === 1,
  { perguntas_com_os_termos: comTermo, antes_ocorrencias_no_ficheiro: antesDoBrief('ocorrencias_dos_dois_termos_nas_definicoes') });
const aud = ler(`${PASTA}/conferencias-fim/auditoria-confere.log`) ?? '';
medida('auditoria_das_duas_perguntas', { codigo_da_auditoria: codigo(`${PASTA}/conferencias-fim/auditoria-confere.codigo`), check_cartao: codigo(`${PASTA}/conferencias-fim/check-cartao.codigo`), linha: aud.trim() },
  `node ${PASTA}/auditoria-das-perguntas-p4.mjs --confere, e npm run check:cartao (a K16)`, 'as plantas das perguntas antigas mordem na K6 (plantas-portoes-p4.json)',
  (lerJson(`${PASTA}/plantas-portoes/plantas-portoes-p4.json`) ?? []).filter((p) => /pergunta-antiga/.test(p.nome) && p.codigo === 1 && p.passou).length === 2);

/* 4 · a nota do sucessor */
const dt = semCor(ler(`${PASTA}/conferencias-fim/check-datas.log`));
const notas = dt.match(/(\d+) nota\(s\) do sucessor com a frase da reconciliação/);
const plantasP4 = lerJson(`${PASTA}/plantas-portoes/plantas-portoes-p4.json`) ?? [];
medida('notas_do_sucessor_com_a_reconciliacao', notas ? +notas[1] : NAO, 'npm run check:datas, registo em conferencias-fim/check-datas.log',
  'as duas plantas da nota (sem a frase, e a inglesa com a frase portuguesa) mordem', plantasP4.filter((p) => /^p4-datas-/.test(p.nome) && p.codigo === 1 && p.passou).length === 2,
  { antes_palavras_no_rotulo: antesDoBrief('palavras_da_nota_do_sucessor_que_dizem_a_reconciliacao'), palavras_no_rotulo_agora: ((ler('src/data/rotulos-b1.mjs') ?? '').match(/reconcil/g) ?? []).length });
medida('plantas_dos_portoes_do_bloco', plantasP4.length ? `${plantasP4.filter((p) => p.codigo === 1 && p.passou).length} de ${plantasP4.length}` : NAO,
  `${PASTA}/plantas-portoes/plantas-portoes-p4.json (tests/pais/portoes.mjs --prefixo p4-)`, 'cada planta restaura os bytes que mudou (sha256 antes igual ao reposto)',
  plantasP4.length > 0 && plantasP4.every((p) => p.ficheiros.every((f) => f.antes === f.reposto)));

/* 5 · CHAVES-EN.md: cada cadeia da secção P4 é igual à de src/i18n/strings.mjs, nas duas edições */
const { t } = await import(path.resolve('src/i18n/strings.mjs'));
const chaves = ler('design/especime-v3/CHAVES-EN.md') ?? '';
const secaoP4 = chaves.slice(chaves.indexOf('### P4 · os pequenos do sítio depois do UE2'));
const cadeias = [];
for (const lang of ['pt', 'en']) {
  const s = t(lang);
  cadeias.push([`nav.uniaoEuropeiaNoMenu (${lang})`, s.nav?.uniaoEuropeiaNoMenu]);
  cadeias.push([`tema.rotulo · tema.claro · tema.escuro (${lang})`, [s.tema?.rotulo, s.tema?.claro, s.tema?.escuro].join(' · ')]);
  cadeias.push([`municipio.metaDescricaoA + … + municipio.metaDescricaoB (${lang})`, `${s.municipio?.metaDescricaoA}…${s.municipio?.metaDescricaoB}`]);
  cadeias.push([`uniaoEuropeia.metaDescription (${lang})`, s.uniaoEuropeia?.metaDescription]);
}
const iguais = cadeias.filter(([, v]) => typeof v === 'string' && secaoP4.includes(v));
const descricaoDeHoje = t('pt').uniaoEuropeia?.metaDescription;
medida('cadeias_da_seccao_p4_de_chaves_en_iguais_as_de_hoje', secaoP4.length > 40 ? `${iguais.length} de ${cadeias.length}` : NAO,
  'design/especime-v3/CHAVES-EN.md, secção P4, contra t(lang) de src/i18n/strings.mjs: cada cadeia tem de aparecer na secção tal como a página a escreve',
  `a descrição de hoje da página da União não está no ficheiro da base ${BASE}`,
  typeof descricaoDeHoje === 'string' && !(naBase('design/especime-v3/CHAVES-EN.md') ?? descricaoDeHoje).includes(descricaoDeHoje),
  { diferentes: cadeias.filter(([, v]) => !(typeof v === 'string' && secaoP4.includes(v))).map(([k]) => k) });

/* 6 · as decisões em vigor com binários */
const dUe2 = ler(`${PASTA}/decisoes-em-vigor-intervalo-ue2.txt`) ?? '';
const dP4 = ler(`${PASTA}/decisoes-em-vigor-depois.txt`) ?? '';
const bin = (t) => +((t.match(/(\d+) ficheiro\(s\) binário\(s\) saltado\(s\)/) ?? [])[1] ?? NaN);
medida('codigo_do_decisoes_em_vigor_num_intervalo_com_png', codigo(`${PASTA}/decisoes-em-vigor-intervalo-ue2.codigo`),
  'python3 scripts/leituras/decisoes-em-vigor.py --intervalo 74ce7657..642e9d56 (o UE2)', 'o guião antigo, no mesmo intervalo, saiu com 1 e «0x89» (decisoes-em-vigor-intervalo-ue2-antes.txt)',
  /0x89/.test(ler(`${PASTA}/decisoes-em-vigor-intervalo-ue2-antes.txt`) ?? '') && codigo(`${PASTA}/decisoes-em-vigor-intervalo-ue2-antes.codigo`) === 1,
  { antes: antesDoBrief('codigo_do_decisoes_em_vigor_num_intervalo_com_png'), binarios_saltados_no_ue2: bin(dUe2), binarios_saltados_no_p4: bin(dP4), codigo_no_p4: codigo(`${PASTA}/decisoes-em-vigor-depois.codigo`) });

/* as capturas, o custo e os portões */
medida('capturas', cap ? { capturas: cap.capturas, problemas: cap.problemas.length, construcao: cap.construcao.commit } : NAO, `node ${PASTA}/captar-p4.mjs (capturas-p4.json, com o sha256 de cada imagem)`,
  'cada imagem tem o seu sha256 no manifesto', cap && cap.resultados.every((r) => /^[0-9a-f]{64}$/.test(r.sha256)));
const ci = lerJson(`${PASTA}/custo-inicio.json`), cf = lerJson(`${PASTA}/custo-fim.json`);
medida('custo', ci && cf ? { simbolos: ci.simbolos_restantes_no_inicio - cf.simbolos_restantes_no_fim, segundos: Math.round((Date.parse(cf.fim_utc) - Date.parse(ci.inicio_utc)) / 1000) } : NAO,
  'custo-inicio.json e custo-fim.json: as duas leituras do contador «total_tokens left» e as duas horas do relógio', 'as duas leituras existem e a do fim é menor', ci && cf && cf.simbolos_restantes_no_fim < ci.simbolos_restantes_no_inicio);
const P = `${PASTA}/portoes`;
const portoes = fs.existsSync(`${P}/cabeca`) ? { cabeca: (ler(`${P}/cabeca`) ?? '').trim(), build: codigo(`${P}/build.codigo`), verify: codigo(`${P}/verify.codigo`), typecheck: codigo(`${P}/typecheck.codigo`) } : 'por correr: os portões correm depois do último commit do bloco, e os códigos entram no commit seguinte';
medida('portoes', portoes, `sh scripts/leituras/portoes.sh <worktree> ${P}`, 'o guião escreve a cabeça ao lado dos códigos', typeof portoes === 'string' || /^[0-9a-f]{40}$/.test(portoes.cabeca));

const falhas = medidas.filter((m) => m.valor === NAO || !m.conhecido_positivo.encontrado);
const saida = { bloco: 'P4', construtor: 'Claude Opus 5.5', base: BASE, cabeca: git('rev-parse', 'HEAD').saida.trim(), guiao: `${PASTA}/medir-p4.mjs`, escrito_em: new Date().toISOString(), medidas };
fs.writeFileSync(`${PASTA}/medidas.json`, JSON.stringify(saida, null, 2) + '\n');
console.log(`P4: ${medidas.length} medidas escritas em ${PASTA}/medidas.json; ${falhas.length} por ler ou com o conhecido-positivo por encontrar.`);
for (const f of falhas) console.log(`  ${f.nome}: ${f.valor === NAO ? NAO : 'conhecido-positivo por encontrar'} (${f.conhecido_positivo.o_que})`);
process.exitCode = falhas.length ? 1 : 0;
