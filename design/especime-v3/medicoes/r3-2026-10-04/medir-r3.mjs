/** R3: as medidas do bloco, escritas em `medidas.json` nesta pasta. Cada medida leva o nome, o valor, o comando que a
 * repete e um conhecido-positivo: uma coisa que o MESMO detetor tem de encontrar, para que um zero ou uma contagem
 * não seja o silêncio de um detetor cego. Lê o repositório, a construção em `dist/` (que tem de ser da cabeça atual, e o
 * guião confere-o pelo `version.json`) e os ficheiros de prova desta pasta (as plantas, as capturas, a célula do índice,
 * os portões, o mapa do repositório, a sondagem da Vercel e o custo). O que não conseguir ler fica «NÃO LIDO», com o
 * conhecido-positivo a falso, e o guião sai com 1.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r3-2026-10-04/medir-r3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/r3-2026-10-04';
const DIST = path.join(RAIZ, 'dist');
/* A BASE DO RAMO É O COMMIT DO BRIEF, procurado pelo assunto na história da cabeça, e não um resumo escrito: o rebase
   da passagem R3-b deu-lhe outro resumo (era `358e3649` no ramo `r3-2026-10-04`). */
const BASE = execFileSync('git', ['log', '-1', '--format=%h', '--grep=^R3: o brief «o índice do sítio»', 'HEAD'], { encoding: 'utf8' }).trim();
if (!BASE) throw new Error('A base do ramo (o commit do brief do R3) não está na história da cabeça.');
const NAO = 'NÃO LIDO';
/** O teto das listas «O que mudou», escrito aqui como na A2 do `check:pais`. */
const TETO_DO_QUE_MUDOU = 8;
const medidas = [];
const medicao = (nome, valor, comando, oQue, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) } });
const lerJson = (f) => { try { return JSON.parse(fs.readFileSync(path.join(PASTA, f), 'utf8')); } catch { return null; } };
const lerTexto = (f) => { try { return fs.readFileSync(path.join(PASTA, f), 'utf8'); } catch { return null; } };
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));

/* --- a tabela das rotas e o rodapé ---------------------------------------- */
const { ROUTES, routePath } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/routes.mjs')).href);
const { ROTAS_RODAPE } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/navegacao.mjs')).href);
const { COMO_ENTRA } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/indice.mjs')).href);
const chaves = Object.keys(ROUTES);
medicao('rotas_declaradas', chaves.length, 'node: Object.keys(ROUTES) de src/lib/routes.mjs', 'a chave indice é uma delas', chaves.includes('indice'));
medicao('rotas_declaradas_em_como_entra', Object.keys(COMO_ENTRA).length, 'node: Object.keys(COMO_ENTRA) de src/lib/indice.mjs', 'a chave indice está declarada como «fora» (a própria página)', COMO_ENTRA.indice?.como === 'fora');
const porComo = {};
for (const v of Object.values(COMO_ENTRA)) porComo[v.como] = (porComo[v.como] ?? 0) + 1;
for (const como of ['porta', 'lista', 'pela-lista', 'fora']) {
  medicao(`rotas_que_entram_como_${como.replace('-', '_')}`, porComo[como] ?? 0, 'node: COMO_ENTRA de src/lib/indice.mjs, contadas pela maneira de entrar', 'a soma das quatro maneiras é o número de chaves', Object.values(porComo).reduce((a, b) => a + b, 0) === chaves.length);
}
medicao('portas_do_rodape', ROTAS_RODAPE.length, 'node: ROTAS_RODAPE de src/lib/navegacao.mjs', 'a porta do índice é uma delas, e é a última', ROTAS_RODAPE.at(-1) === 'indice');

/* --- as cadeias novas, contra a cabeça do brief ------------------------------ */
const achata = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? achata(v, `${pre}${k}.`) : [`${pre}${k}`]));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'r3-medir-'));
fs.writeFileSync(path.join(tmp, 'strings-base.mjs'), execFileSync('git', ['show', `${BASE}:src/i18n/strings.mjs`], { encoding: 'utf8' }));
const base = (await import(pathToFileURL(path.join(tmp, 'strings-base.mjs')).href)).STRINGS;
const agora = (await import(pathToFileURL(path.join(RAIZ, 'src/i18n/strings.mjs')).href)).STRINGS;
fs.rmSync(tmp, { recursive: true, force: true });
const novas = achata(agora.pt).filter((k) => !achata(base.pt).includes(k));
medicao('chaves_novas_em_strings', novas.length, `node: as chaves de STRINGS.pt na cabeça contra as de ${BASE}`, 'nav.indice é uma delas', novas.includes('nav.indice'));
medicao('chaves_novas_iguais_nas_duas_edicoes', novas.every((k) => achata(agora.en).includes(k)), 'node: cada chave nova de STRINGS.pt existe em STRINGS.en', 'a chave nova indice.seccoes.projeto existe na edição inglesa', achata(agora.en).includes('indice.seccoes.projeto'));

/* --- nenhum valor de linha (o §4 do brief): o bloco não toca no livro-razão ------------------- */
const doLivro = execFileSync('git', ['diff', '--name-only', `${BASE}..HEAD`, '--', 'ledger/'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const ultimoNoLivro = execFileSync('git', ['log', '-1', '--format=%h', '--', 'ledger/claims'], { encoding: 'utf8' }).trim();
const doUltimo = ultimoNoLivro ? execFileSync('git', ['diff', '--name-only', `${ultimoNoLivro}~1`, ultimoNoLivro, '--', 'ledger/'], { encoding: 'utf8' }).split('\n').filter(Boolean) : [];
medicao('ficheiros_do_livro_razao_mudados_no_bloco', doLivro.length, `git diff --name-only ${BASE}..HEAD -- ledger/`, `o mesmo comando sobre o último commit que tocou em ledger/claims (${ultimoNoLivro}) lista ficheiros`, doUltimo.length > 0);

/* --- as declarações: as perguntas dos temas e dos estudos --------------------- */
const { ENTRADAS } = await import(pathToFileURL(path.join(RAIZ, 'src/data/primeira-pagina.mjs')).href);
const { WORKS } = await import(pathToFileURL(path.join(RAIZ, 'src/data/studies.mjs')).href);
const { indexavel } = await import(pathToFileURL(path.join(RAIZ, 'src/data/leituras.mjs')).href);
const temasComPagina = ENTRADAS.filter((e) => e.id !== 'lugares');
const semSucessor = WORKS.filter((w) => !w.sucedidoPor);
medicao('temas_com_pagina', temasComPagina.length, 'node: ENTRADAS de src/data/primeira-pagina.mjs sem a porta «Lugares»', 'o tema «Preços» é um deles', temasComPagina.some((e) => e.id === 'precos'));
medicao('temas_com_pergunta_declarada', temasComPagina.filter((e) => 'pergunta' in e).length, 'node: as entradas de ENTRADAS com o campo «pergunta»', 'o mesmo detetor encontra o campo «pergunta» nos estudos de Évora de WORKS', WORKS.some((w) => 'pergunta' in w));
medicao('estudos_sem_sucessor', semSucessor.length, 'node: WORKS sem sucedidoPor', 'o Évora 2027 é um deles', semSucessor.some((w) => w.slug === 'evora-2027-capital-europeia-da-cultura'));
medicao('estudos_sem_sucessor_com_pergunta', semSucessor.filter((w) => 'pergunta' in w).length, 'node: WORKS sem sucedidoPor e com o campo «pergunta»', 'o estudo das contas da Câmara de Évora tem-na', semSucessor.some((w) => w.slug === 'evora-contas-da-camara-2010-2025' && 'pergunta' in w));
medicao('estudos_indexaveis', WORKS.filter(indexavel).length, 'node: WORKS com indexavel() de src/data/leituras.mjs (com leitura escrita e sem sucessor)', 'o Évora 2027 é indexável', indexavel(WORKS.find((w) => w.slug === 'evora-2027-capital-europeia-da-cultura')));

/* --- a construção ---------------------------------------------------------- */
medicao('construcao_da_cabeca', versao.commit === cabeca, 'dist/version.json contra git rev-parse HEAD', 'o version.json tem um commit escrito', typeof versao.commit === 'string' && versao.commit.length === 40);
const indicePt = path.join(DIST, 'indice', 'index.html');
const indiceEn = path.join(DIST, 'en', 'index', 'index.html');
const homeEn = path.join(DIST, 'en', 'index.html');
const ambas = fs.existsSync(indicePt) && fs.existsSync(indiceEn);
medicao('paginas_do_indice_construidas', [indicePt, indiceEn].filter((f) => fs.existsSync(f)).length, 'ls dist/indice/index.html dist/en/index/index.html', 'a primeira página inglesa continua em dist/en/index.html, e é outra página', ambas && fs.existsSync(homeEn) && parse(fs.readFileSync(homeEn, 'utf8')).querySelector('main h1')?.text.trim() !== parse(fs.readFileSync(indiceEn, 'utf8')).querySelector('main h1')?.text.trim());
const xml = fs.readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => fs.readFileSync(path.join(DIST, f), 'utf8')).join('\n');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
medicao('enderecos_no_mapa_do_sitio', locs.length, 'os <loc> de dist/sitemap-*.xml', 'as duas páginas do índice estão lá', locs.includes(routePath('indice', 'pt')) && locs.includes(routePath('indice', 'en')));
/* AS SETE PORTAS DO RODAPÉ, CONTADAS EM CADA PÁGINA DE dist/ POR UMA LEITURA DESTE GUIÃO (e não pela do portão). */
let comRodape = 0, comSete = 0, comIndice = 0, paginas = 0;
const anda = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { anda(f); continue; }
    if (!e.name.endsWith('.html')) continue;
    paginas++;
    const cru = fs.readFileSync(f, 'utf8');
    const m = /<nav class="rodape-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(cru);
    if (!m) continue;
    comRodape++;
    const portas = [...m[1].matchAll(/<a\b([^>]*)>/g)].filter((a) => !/\bhreflang=/.test(a[1]));
    if (portas.length === 7) comSete++;
    const lang = /<html[^>]*lang="en"/.test(cru) ? 'en' : 'pt';
    if (portas.some((a) => a[1].includes(`href="${routePath('indice', lang)}"`))) comIndice++;
  }
};
anda(DIST);
const temas = fs.readFileSync(path.join(DIST, 'temas', 'index.html'), 'utf8');
medicao('paginas_html_construidas', paginas, 'os ficheiros .html de dist/', 'a página dos temas é um deles', fs.existsSync(path.join(DIST, 'temas', 'index.html')));
medicao('paginas_com_rodape', comRodape, 'os ficheiros .html de dist/ com <nav class="rodape-nav">', 'a página dos temas tem rodapé', /<nav class="rodape-nav"/.test(temas));
medicao('paginas_com_as_sete_portas_do_rodape', comSete, 'as páginas com rodapé cuja navegação tem sete ligações sem hreflang', 'a página dos temas tem a porta do índice no rodapé', temas.includes('href="/indice"'));
medicao('paginas_com_a_porta_do_indice_no_rodape', comIndice, 'as páginas com rodapé cuja navegação liga ao índice da sua edição', 'a página inglesa dos temas liga a /en/index', fs.readFileSync(path.join(DIST, 'en', 'themes', 'index.html'), 'utf8').includes('href="/en/index"'));

/* --- a célula do índice, pela sua própria saída -------------------------------- */
const celula = lerJson('celula-indice.json');
for (const lang of ['pt', 'en']) {
  const c = celula?.contas?.[lang];
  medicao(`portas_do_indice_${lang}`, c?.portas ?? NAO, `node tests/indice/indice.mjs --prova --json ${PASTA}/celula-indice.json`, 'cada porta tem um destino distinto (as portas e os destinos são o mesmo número)', c && c.portas === c.destinos);
  medicao(`enderecos_do_mapa_conferidos_${lang}`, c?.enderecosDoMapa ?? NAO, 'a mesma corrida da célula (I2)', 'a célula viu os endereços do mapa desta edição', c && c.enderecosDoMapa > 0);
  medicao(`rotas_de_leitor_no_indice_${lang}`, c?.rotasDeLeitor ?? NAO, 'a mesma corrida da célula (I3)', 'a célula viu rotas de leitor construídas', c && c.rotasDeLeitor > 0);
  medicao(`concelhos_no_indice_${lang}`, c?.concelhos?.portas ?? NAO, 'a mesma corrida da célula (I4)', 'as portas dos concelhos são as páginas de concelho construídas', c && c.concelhos.portas === c.concelhos.construidos);
  medicao(`gavetas_dos_concelhos_${lang}`, c?.concelhos?.gavetas ?? NAO, 'a mesma corrida da célula (I4)', 'há gavetas', c && c.concelhos.gavetas > 0);
  medicao(`estudos_no_indice_${lang}`, c?.estudos ?? NAO, 'a mesma corrida da célula (I5)', 'os estudos do índice são os estudos sem sucessor', c && c.estudos === semSucessor.length);
  medicao(`linhas_de_o_que_mudou_${lang}`, c?.mudou ?? NAO, 'a mesma corrida da célula (I6)', 'há linhas', c && c.mudou > 0);
}
medicao('erros_da_celula_do_indice', celula ? celula.erros.length : NAO, 'a mesma corrida da célula', 'as plantas da mesma corrida deram as queixas delas (a célula vê erros quando os há)', celula && celula.plantas.length > 0 && celula.plantas.every((p) => p.mordeu && p.queixas.length > 0));
medicao('plantas_da_celula_do_indice', celula ? celula.plantas.length : NAO, 'a mesma corrida da célula, com --prova', 'a planta «uma rota tirada do índice» mordeu', celula?.plantas.some((p) => p.nome === 'r3-celula-rota-tirada' && p.mordeu));
medicao('plantas_da_celula_que_morderam', celula ? celula.plantas.filter((p) => p.mordeu).length : NAO, 'a mesma corrida da célula, com --prova', 'a planta «uma porta pelo ficheiro .html irmão» mordeu', celula?.plantas.some((p) => p.nome === 'r3-celula-porta-pelo-ficheiro-irmao' && p.mordeu));
/* Os estudos do índice que levam noindex, contados nas páginas construídas. */
const docPt = parse(fs.readFileSync(indicePt, 'utf8'));
/* AS PORTAS DE CADA FAMÍLIA NO ÍNDICE PORTUGUÊS, lidas da página construída pela tabela das rotas. */
const { matchPath } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/routes.mjs')).href);
const familias = {};
for (const a of docPt.querySelectorAll('main a[href]')) {
  if (a.closest('[data-mudou-ambito]') || a.closest('[data-rotulo-ia="topo"]')) continue;
  const r = matchPath(a.getAttribute('href'));
  if (r) familias[r.key] = (familias[r.key] ?? 0) + 1;
}
for (const [chave, nome, positivo] of [
  ['regiao', 'regioes_no_indice', 'a região do Alentejo'], ['distrito', 'distritos_e_ilhas_no_indice', 'o distrito de Évora'],
  ['area', 'areas_de_governo_no_indice', 'a área da Justiça'], ['serie', 'series_no_indice', 'a série da taxa de desemprego'],
]) {
  const alvo = { regiao: '/regioes/alentejo', distrito: '/distritos/evora', area: '/areas/justica', serie: '/livro-razao/series/taxa-de-desemprego-mip-2025-paises' }[chave];
  medicao(nome, familias[chave] ?? 0, `as portas de dist/indice/index.html cuja rota é «${chave}», fora de «O que mudou»`, `${positivo} (${alvo}) é uma delas`, docPt.querySelectorAll('main a[href]').some((a) => a.getAttribute('href') === alvo));
}
const projeto = docPt.querySelectorAll('main [data-indice-seccao="projeto"] a[href]').map((a) => a.getAttribute('href'));
medicao('portas_do_projeto_no_indice', projeto.length, 'as portas da secção «O projeto» de dist/indice/index.html', 'o Método é uma delas', projeto.includes('/metodo'));
const temasNoIndice = docPt.querySelectorAll('main a.indice-porta-tema').length;
medicao('temas_no_indice', temasNoIndice, 'as portas de tema (a.indice-porta-tema) de dist/indice/index.html', 'a porta da habitação é uma delas', docPt.querySelectorAll('main a.indice-porta-tema').some((a) => a.getAttribute('href') === '/habitacao/'));
const portasDeEstudo = docPt.querySelectorAll('main [data-estudo-edicao] a[href]').map((a) => a.getAttribute('href')).filter((h) => /^\/estudos\/[^/]+$/.test(h));
const comNoindex = portasDeEstudo.filter((h) => /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(fs.readFileSync(path.join(DIST, h.slice(1), 'index.html'), 'utf8')));
medicao('estudos_do_indice_com_noindex', comNoindex.length, 'as portas de estudo do índice português cuja página construída leva a marca robots com noindex', 'o estudo «Onde está a água?» é um deles', comNoindex.includes('/estudos/onde-esta-a-agua'));
medicao('estudos_do_indice_no_mapa', portasDeEstudo.filter((h) => locs.includes(h)).length, 'as portas de estudo do índice português que estão em dist/sitemap-*.xml', 'o Évora 2027 está no mapa', locs.includes('/estudos/evora-2027-capital-europeia-da-cultura'));

/* --- «O que mudou» no índice (a passagem final, pelas capturas): o lugar de cada linha escrito, nenhuma linha que se leia
   igual a outra, e nenhuma linha reunida noutra. Lido das páginas construídas por este guião. */
const { MEDIDA_REUNIDA } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/pais.mjs')).href);
const reunidas = Object.keys(MEDIDA_REUNIDA);
const DA_LISTA = 'main [data-mudou-ambito="indice"]';
const lidoPeloLeitor = (li) => {
  const c = parse(li.toString());
  for (const el of c.querySelectorAll('.vh, [hidden], [aria-hidden="true"]')) el.remove();
  const pedacos = [];
  const anda = (n) => { if (n.nodeType === 3) pedacos.push(n.rawText); else for (const f of n.childNodes ?? []) anda(f); };
  anda(c);
  return pedacos.join(' ').replace(/\s+/g, ' ').trim();
};
const iguaisEm = (lis) => { const l = lis.map(lidoPeloLeitor); return l.filter((x, i) => l.indexOf(x) !== i).length; };
const comLugarEm = (doc) => doc.querySelectorAll(`${DA_LISTA} li`).filter((li) => (li.querySelector('.indice-mudou-lugar')?.textContent ?? '').trim().length > 0).length;
for (const lang of ['pt', 'en']) {
  const ficheiro = lang === 'pt' ? 'dist/indice/index.html' : 'dist/en/index/index.html';
  const doc = lang === 'pt' ? docPt : parse(fs.readFileSync(indiceEn, 'utf8'));
  const lis = doc.querySelectorAll(`${DA_LISTA} li`);
  const comLugar = comLugarEm(doc);
  const semOPrimeiro = parse(doc.toString());
  semOPrimeiro.querySelector(`${DA_LISTA} .indice-mudou-lugar`)?.remove();
  medicao(`linhas_de_o_que_mudou_com_o_lugar_escrito_${lang}`, comLugar, `as linhas de «O que mudou» de ${ficheiro} com o nome do lugar (.indice-mudou-lugar) escrito`, 'numa cópia sem o lugar da primeira linha, o mesmo detetor conta menos uma', lis.length > 0 && comLugarEm(semOPrimeiro) === comLugar - 1);
  const iguais = iguaisEm(lis);
  medicao(`linhas_de_o_que_mudou_que_se_leem_iguais_${lang}`, iguais, `as mesmas linhas de ${ficheiro}, pelo texto à vista de cada uma (sem o que só um leitor de ecrã ouve)`, 'com a primeira linha repetida, o mesmo detetor conta mais uma', lis.length > 0 && iguaisEm([...lis, lis[0]]) === iguais + 1);
  const registo = parse(fs.readFileSync(path.join(DIST, routePath('correcoes', lang).replace(/^\//, ''), 'index.html'), 'utf8'));
  const reunidaNoRegisto = registo.querySelectorAll('[data-mudou-registo] li[data-mudanca="correcao"]').filter((li) => reunidas.includes(li.getAttribute('data-correcao-entrada') ?? '')).length;
  medicao(`linhas_reunidas_em_o_que_mudou_${lang}`, lis.filter((li) => reunidas.includes(li.getAttribute('data-correcao-entrada') ?? '')).length, `as linhas de «O que mudou» de ${ficheiro} cuja linha está reunida noutra (MEDIDA_REUNIDA, src/lib/pais.mjs)`, 'o mesmo detetor encontra a linha reunida no registo construído da mesma edição', reunidaNoRegisto > 0);
}

/* --- os portões: as plantas, o portão de HTML e os três códigos -------------- */
const plantas = lerJson('plantas-portoes-r3.json');
medicao('plantas_dos_portoes_r3', plantas ? plantas.length : NAO, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo r3-`, 'a planta do rodapé sem a porta do índice está lá e passou', plantas?.some((p) => p.nome === 'r3-rodape-sem-a-porta-do-indice' && p.passou));
medicao('plantas_dos_portoes_r3_que_passaram', plantas ? plantas.filter((p) => p.passou && p.codigo === 1 && p.ficheiros.every((f) => f.antes === f.reposto)).length : NAO, 'o mesmo registo: código 1, as mordidas todas e os bytes repostos', 'a planta da L2a dos concelhos abertos passou', plantas?.some((p) => p.nome === 'r3-lugar-concelhos-abertos' && p.passou));
const gate = lerTexto('portoes/build.log');
const mGate = gate && /R3 · as sete portas do rodapé conferidas em (\d+) página\(s\), com (\d+) planta\(s\) em memória/.exec(gate);
medicao('paginas_com_as_sete_portas_conferidas_no_portao', mGate ? Number(mGate[1]) : NAO, `o registo do build em ${PASTA}/portoes/build.log, a linha «R3 ·» do portão de HTML`, 'a linha do portão está no registo', Boolean(mGate));
medicao('plantas_em_memoria_do_rodape_no_portao', mGate ? Number(mGate[2]) : NAO, 'a mesma linha do portão', 'a mesma linha do portão', Boolean(mGate));
const lugar = lerTexto('portoes/verify.log');
const mL1 = lugar && /L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\) ok/.exec(lugar);
medicao('l1_do_check_lugar', mL1 ? Number(mL1[1]) : NAO, `o registo do verify em ${PASTA}/portoes/verify.log, a linha da L1 do check:lugar`, 'o teto da mesma linha', Boolean(mL1));
medicao('teto_da_l1_do_check_lugar', mL1 ? Number(mL1[2]) : NAO, 'a mesma linha da L1', 'a mesma linha da L1', Boolean(mL1));
for (const g of ['build', 'verify', 'typecheck']) {
  const codigo = lerTexto(`portoes/${g}.codigo`);
  medicao(`codigo_do_${g}`, codigo === null ? NAO : Number(codigo.trim()), `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/portoes, o ficheiro ${g}.codigo`, 'a cabeça dos portões está escrita ao lado', (lerTexto('portoes/cabeca') ?? '').trim().length === 40);
}
medicao('cabeca_dos_portoes', (lerTexto('portoes/cabeca') ?? NAO).trim(), `o ficheiro ${PASTA}/portoes/cabeca`, 'a cabeça no fim da corrida é a mesma do princípio', (lerTexto('portoes/cabeca') ?? 'a').trim() === (lerTexto('portoes/cabeca.fim') ?? 'b').trim());

/* --- as capturas --------------------------------------------------------- */
const capturas = lerJson('capturas-r3.json');
const paginasCap = capturas?.resultados.filter((r) => r.tipo === 'pagina') ?? [];
medicao('capturas', capturas ? capturas.capturas : NAO, `node ${PASTA}/captar-r3.mjs`, 'há uma captura da página inglesa a 390 px', paginasCap.some((r) => r.lang === 'en' && r.largura === 390));
medicao('problemas_das_capturas', capturas ? capturas.problemas.length : NAO, 'o mesmo manifesto', 'o captor mediu a largura do documento em cada página', paginasCap.every((r) => typeof r.medidas.documento === 'number'));
medicao('transbordo_maximo_px', paginasCap.length ? Math.max(...paginasCap.map((r) => r.medidas.documento - r.largura)) : NAO, 'o mesmo manifesto: a largura do documento menos a da janela, a maior das dez páginas', 'as dez páginas inteiras foram medidas', paginasCap.length === 10);
medicao('larguras_das_capturas', capturas ? capturas.larguras.length : NAO, 'o mesmo manifesto', 'a de 1 600 px é uma delas', capturas?.larguras.includes(1600));
medicao('portas_das_listas_abaixo_de_44_px', paginasCap.length ? paginasCap.reduce((s, r) => s + r.medidas.portas_das_listas_abaixo_de_44, 0) : NAO, 'o mesmo manifesto: as portas das listas à vista (fora das gavetas fechadas) com menos de 44 px de altura, somadas nas dez páginas', 'o captor mediu a porta das listas mais baixa em cada página', paginasCap.every((r) => typeof r.medidas.porta_das_listas_mais_baixa_px === 'number'));
medicao('porta_das_listas_mais_baixa_px', paginasCap.length ? Math.min(...paginasCap.map((r) => r.medidas.porta_das_listas_mais_baixa_px)) : NAO, 'o mesmo manifesto: a porta das listas mais baixa das dez páginas', 'as dez páginas inteiras foram medidas', paginasCap.length === 10);
const outrasAbaixo = {};
for (const r of paginasCap) for (const [k, v] of Object.entries(r.medidas.outras_ligacoes_abaixo_de_44_por_classe ?? {})) outrasAbaixo[k] = Math.max(outrasAbaixo[k] ?? 0, v);
medicao('outras_ligacoes_abaixo_de_44_px_por_pagina', paginasCap.length ? Object.values(outrasAbaixo).reduce((a, b) => a + b, 0) : NAO, 'o mesmo manifesto: as outras ligações do corpo com a caixa abaixo de 44 px, o máximo por página somado por classe (as marcas da fonte de «O que mudou», a porta do rótulo de IA e o marcador de um título por confirmar), que a régua dos alvos mede pelo toque', 'são todas de uma classe conhecida', Object.keys(outrasAbaixo).every((k) => ['marca da fonte', 'rótulo de IA', 'marcador'].includes(k)));
medicao('marcas_da_fonte_abaixo_de_44_px_por_pagina', outrasAbaixo['marca da fonte'] ?? 0, 'o mesmo manifesto, a classe «marca da fonte»', 'são as das linhas de «O que mudou»', (outrasAbaixo['marca da fonte'] ?? 0) <= TETO_DO_QUE_MUDOU);
medicao('portas_com_itens_em_fila', paginasCap.length ? paginasCap.reduce((s, r) => s + r.medidas.portas_com_itens_em_fila, 0) : NAO, 'o mesmo manifesto: as portas das listas que são caixas flexíveis com mais de um item em fila, somadas nas dez páginas', 'a porta plantada em cada página foi vista pelo mesmo detetor', paginasCap.length === 10 && paginasCap.every((r) => r.medidas.conhecido_positivo_dos_itens_em_fila === true));
const comDefeito = lerJson('capturas-r3-com-o-defeito.json');
const paginasComDefeito = comDefeito?.resultados.filter((r) => r.tipo === 'pagina') ?? [];
medicao('portas_com_itens_em_fila_com_o_defeito', paginasComDefeito.length ? Math.max(...paginasComDefeito.map((r) => r.medidas.portas_com_itens_em_fila)) : NAO, `node ${PASTA}/captar-r3.mjs sobre a construção da cabeça ${comDefeito?.cabeca?.slice(0, 8) ?? '?'}, antes da correção das portas das séries (capturas-r3-com-o-defeito.json): as portas com itens em fila por página, o máximo`, 'são as portas das séries (o mesmo número de séries que o índice lista)', paginasComDefeito.length > 0 && paginasComDefeito.every((r) => r.medidas.portas_com_itens_em_fila === (familias.serie ?? -1)));
const codigoComDefeito = lerTexto('captar-r3-com-o-defeito.codigo');
medicao('codigo_do_captor_com_o_defeito', codigoComDefeito === null ? NAO : Number(codigoComDefeito.trim()), 'o código dessa corrida do captor', 'a corrida queixou-se das portas com as partes do nome lado a lado', comDefeito?.problemas?.some((p) => /partes do nome lado a lado/.test(p)));
const gavetaCap = capturas?.resultados.filter((r) => r.tipo === 'gaveta') ?? [];
medicao('porta_mais_baixa_na_gaveta_aberta_px', gavetaCap.length ? Math.min(...gavetaCap.map((r) => r.porta_mais_baixa_px)) : NAO, 'o mesmo manifesto: a porta de concelho mais baixa da gaveta de Évora aberta, nas quatro capturas de perto', 'a gaveta abriu nas quatro', gavetaCap.length === 4 && gavetaCap.every((r) => r.aberta));
medicao('gavetas_abertas_a_chegar', paginasCap.length ? paginasCap.reduce((s, r) => s + (r.medidas.gavetas - r.medidas.gavetas_fechadas), 0) : NAO, 'o mesmo manifesto', 'a gaveta de Évora abriu com um toque', capturas?.resultados.some((r) => r.tipo === 'gaveta' && r.aberta));

/* --- a régua dos alvos, lida no registo do verify dos portões --------------------------------- */
const registoDoVerify = (lerTexto('portoes/verify.log') ?? '').replace(/\x1b\[[0-9;]*m/g, '');
const mAlvos = /a régua dos alvos · (\d+) rotas × (\d+) larguras/.exec(registoDoVerify);
const fonteDosAlvos = fs.readFileSync(path.join(RAIZ, 'tests/acessibilidade/alvos.mjs'), 'utf8');
const blocoDasFamilias = fonteDosAlvos.slice(fonteDosAlvos.indexOf('const FAMILIAS = ['), fonteDosAlvos.indexOf('];', fonteDosAlvos.indexOf('const FAMILIAS = [')));
const familiasDosAlvos = (blocoDasFamilias.match(/^\s*\['[a-zA-Z]+',/gm) ?? []).length;
medicao('rotas_medidas_pela_regua_dos_alvos', mAlvos ? Number(mAlvos[1]) : NAO, `o registo do verify em ${PASTA}/portoes/verify.log, a primeira linha da régua dos alvos`, `a lista FAMILIAS de tests/acessibilidade/alvos.mjs tem a família do índice e dá ${2 * familiasDosAlvos} rotas nas duas edições`, mAlvos && /\['indice', null\]/.test(blocoDasFamilias) && Number(mAlvos[1]) === 2 * familiasDosAlvos);
medicao('larguras_da_regua_dos_alvos', mAlvos ? Number(mAlvos[2]) : NAO, 'a mesma linha', 'a mesma linha', Boolean(mAlvos));
const mH1 = /✓ H1 +(\d+) nó\(s\) em violação \((\d+) graves\)/.exec(registoDoVerify);
medicao('violacoes_do_axe_na_regua_dos_alvos', mH1 ? Number(mH1[1]) : NAO, 'a linha da H1 da régua dos alvos, no mesmo registo', 'a H1 passou (a marca ✓ na linha)', Boolean(mH1));
const mH2 = /✓ H2 .*? destes, (\d+) são caixas e falham/.exec(registoDoVerify);
medicao('caixas_sem_o_alvo_na_regua_dos_alvos', mH2 ? Number(mH2[1]) : NAO, 'a linha da H2 da régua dos alvos, no mesmo registo', 'a H2 passou (a marca ✓ na linha)', Boolean(mH2));

/* --- o mapa do repositório ---------------------------------------------- */
const mapa = lerTexto('conferir-mapa.txt');
const mOk = mapa && /citações conferidas na linha citada \(±7\): (\d+)/.exec(mapa);
const mLonge = mapa && /citação está no ficheiro, mas longe da linha citada: (\d+)/.exec(mapa);
const mNao = mapa && /citação não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/.exec(mapa);
medicao('mapa_citacoes_na_linha', mOk ? Number(mOk[1]) : NAO, 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'a régua leu o mapa e conferiu citações na linha', Boolean(mOk) && Number(mOk[1]) > 0);
medicao('mapa_citacoes_longe_da_linha', mLonge ? Number(mLonge[1]) : NAO, 'a mesma corrida', 'a mesma corrida', Boolean(mLonge));
medicao('mapa_citacoes_nao_encontradas', mNao ? Number(mNao[1]) : NAO, 'a mesma corrida', 'a mesma corrida', Boolean(mNao));
const mapaBase = lerTexto('conferir-mapa-base.txt');
const bOk = mapaBase && /citações conferidas na linha citada \(±7\): (\d+)/.exec(mapaBase);
const bLonge = mapaBase && /citação está no ficheiro, mas longe da linha citada: (\d+)/.exec(mapaBase);
medicao('mapa_base_citacoes_na_linha', bOk ? Number(bOk[1]) : NAO, `a mesma régua sobre uma extração de ${BASE} (git archive, sem checkout)`, 'a mesma corrida', Boolean(bOk));
medicao('mapa_base_citacoes_longe_da_linha', bLonge ? Number(bLonge[1]) : NAO, 'a mesma corrida', 'a mesma corrida', Boolean(bLonge));
const andaram = lerJson('mapa-citacoes-que-andaram.json');
medicao('mapa_citacoes_que_andaram_com_o_bloco', andaram?.novas_longe_em_ficheiros_tocados_pelo_bloco ?? NAO, `python3 ${PASTA}/comparar-mapa.py (mapa-citacoes-que-andaram.json): as citações longe da linha que não estavam longe na base e citam um ficheiro mudado em ${BASE}..HEAD`, 'a corrida da base tem citações longe da linha, e o mesmo leitor encontra-as', andaram?.conhecido_positivo?.encontrado);

/* --- a sondagem da Vercel ------------------------------------------------- */
const sondagem = lerJson('sondagem-vercel.json');
const p = (c) => sondagem?.pedidos.find((x) => x.endereco.endsWith(c));
medicao('vercel_en_index_sem_a_pasta', p('/en/index')?.codigo_http ?? NAO, 'curl, um GET por endereço, a 2026-10-04T03:45:24Z (sondagem-vercel.json)', 'o mesmo pedido a /en/index.html deu 200 com a primeira página inglesa', p('/en/index.html')?.codigo_http === 200 && sondagem?.conhecido_positivo?.encontrado);
medicao('vercel_en_index_html', p('/en/index.html')?.codigo_http ?? NAO, 'a mesma sondagem', 'a canónica da resposta é /en', p('/en/index.html')?.canonica?.endsWith('/en'));
medicao('vercel_sobre', p('/sobre')?.codigo_http ?? NAO, 'a mesma sondagem', 'o pedido a /sobre/index deu 404', p('/sobre/index')?.codigo_http === 404);

/* --- o verify:deploy antes de aterrar, e as ligações pela regra da Vercel -------------------- */
const vdCodigo = lerTexto('verify-deploy-antes-de-aterrar.codigo');
const vdLog = (lerTexto('verify-deploy-antes-de-aterrar.log') ?? '').replace(/\x1b\[[0-9;]*m/g, '');
const queixasDoIndice = (vdLog.match(/✗ \/(?:indice|en\/index) (?:estado|título):/g) ?? []).length;
medicao('codigo_do_verify_deploy_antes', vdCodigo === null ? NAO : Number(vdCodigo.trim()), `node scripts/verify-deploy.mjs > ${PASTA}/verify-deploy-antes-de-aterrar.log, antes de aterrar`, 'as quatro queixas da conferência (g) estão no registo, e são as únicas da secção NÃO CONFERE', queixasDoIndice === 4 && /NÃO CONFERE — 4 problema\(s\)/.test(vdLog));
const ligacoes = lerJson('ligacoes-pela-regra-da-vercel.json');
medicao('ligacoes_paginas_lidas', ligacoes?.paginas_lidas ?? NAO, `node ${PASTA}/ligacoes-pela-regra-da-vercel.mjs`, 'a ligação plantada para /404 caiu na conta das que só a regra do portão aceita', ligacoes?.conhecido_positivo?.encontrado);
medicao('ligacoes_lidas', ligacoes?.ligacoes_lidas ?? NAO, 'a mesma corrida', 'a mesma corrida', ligacoes?.conhecido_positivo?.encontrado);
medicao('ligacoes_so_pelo_portao', ligacoes?.destinos_que_so_a_regra_do_portao_aceita ?? NAO, 'a mesma corrida', 'a mesma corrida', ligacoes?.conhecido_positivo?.encontrado);
medicao('ligacoes_que_nenhuma_regra_aceita', ligacoes?.destinos_que_nenhuma_regra_aceita ?? NAO, 'a mesma corrida', 'um dos exemplos é um endereço antigo /texto numa página de área', ligacoes?.exemplos_nenhuma?.some((e) => /\/texto$/.test(e.destino) && e.em.some((p) => p.startsWith('/areas/'))));

/* --- as decisões em vigor e o custo -------------------------------------- */
const decAntes = lerTexto('decisoes-em-vigor-antes.txt');
const decDepois = lerTexto('decisoes-em-vigor-depois.txt');
const conta = (t) => { const m = t && /(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\)/.exec(t); return m ? [Number(m[1]), Number(m[2])] : null; };
medicao('decisoes_em_vigor_antes', conta(decAntes)?.[0] ?? NAO, `python3 scripts/leituras/decisoes-em-vigor.py <os ficheiros a tocar> > ${PASTA}/decisoes-em-vigor-antes.txt`, 'a §1.98 está na lista', decAntes?.includes('§1.98'));
medicao('ficheiros_lidos_antes', conta(decAntes)?.[1] ?? NAO, 'a mesma corrida', 'a mesma corrida', Boolean(conta(decAntes)));
medicao('decisoes_em_vigor_depois', conta(decDepois)?.[0] ?? NAO, `python3 scripts/leituras/decisoes-em-vigor.py --intervalo ${BASE}..HEAD > ${PASTA}/decisoes-em-vigor-depois.txt`, 'a §1.154 está na lista', decDepois?.includes('§1.154'));
const custoInicio = lerJson('custo-inicio.json');
const custoFim = lerJson('custo-fim.json');
medicao('simbolos_restantes_no_inicio', custoInicio?.simbolos_restantes_no_inicio ?? NAO, `${PASTA}/custo-inicio.json, escrito à mão pelo construtor`, 'a hora do início está escrita', Boolean(custoInicio?.inicio_utc));
medicao('simbolos_restantes_no_fim', custoFim?.simbolos_restantes_no_fim ?? NAO, `${PASTA}/custo-fim.json, escrito à mão pelo construtor`, 'a hora do fim está escrita', Boolean(custoFim?.fim_utc));
const gastos = custoInicio && custoFim ? custoInicio.simbolos_restantes_no_inicio - custoFim.simbolos_restantes_no_fim : NAO;
medicao('simbolos_gastos_pelo_contador', gastos, 'a diferença entre os dois contadores', 'os dois contadores foram lidos', typeof gastos === 'number');
const segundos = custoInicio && custoFim ? Math.round((Date.parse(custoFim.fim_utc) - Date.parse(custoInicio.inicio_utc)) / 1000) : NAO;
medicao('segundos_de_parede', segundos, 'a diferença entre as duas horas dos ficheiros do custo', 'as duas horas leem-se como datas', typeof segundos === 'number' && segundos > 0);
const anterior = custoFim?.leitura_anterior;
const daPassagem = anterior && custoFim ? anterior.simbolos_restantes - custoFim.simbolos_restantes_no_fim : NAO;
medicao('simbolos_da_passagem_final', daPassagem, `a leitura anterior guardada em ${PASTA}/custo-fim.json menos a última`, 'a leitura anterior está escrita, com a hora', typeof anterior?.simbolos_restantes === 'number' && Boolean(anterior?.hora_utc));
const segundosDaPassagem = anterior && custoFim ? Math.round((Date.parse(custoFim.fim_utc) - Date.parse(anterior.hora_utc)) / 1000) : NAO;
medicao('segundos_da_passagem_final', segundosDaPassagem, 'a diferença entre a hora da leitura anterior e a do fim, no mesmo ficheiro', 'as duas horas leem-se como datas', typeof segundosDaPassagem === 'number' && segundosDaPassagem > 0);

const saida = { bloco: 'R3', brief: 'design/observatorio/BRIEF-R3-o-indice-do-sitio.md', guiao: `${PASTA}/medir-r3.mjs`, cabeca, construcao: versao.commit, total_de_medidas: medidas.length, medidas };
fs.writeFileSync(path.join(PASTA, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const semValor = (v) => v === NAO || v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v));
const falhas = medidas.filter((m) => semValor(m.valor) || !m.conhecido_positivo.encontrado);
for (const f of falhas) console.error(`  ✗ ${f.nome}: ${JSON.stringify(f.valor)} · conhecido-positivo ${f.conhecido_positivo.encontrado ? 'encontrado' : 'NÃO encontrado'} (${f.conhecido_positivo.o_que})`);
console.log(`R3: ${medidas.length} medidas escritas em ${PASTA}/medidas.json, ${falhas.length} sem valor ou sem conhecido-positivo.`);
process.exitCode = falhas.length ? 1 : 0;
