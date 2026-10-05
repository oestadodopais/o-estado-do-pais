/** H3: as medidas do bloco, escritas em `medidas.json` nesta pasta. Cada medida leva o nome, o valor, o comando que a
 * repete e um conhecido-positivo: uma coisa que o MESMO detetor tem de encontrar, para que um zero ou uma contagem não
 * seja o silêncio de um detetor cego. Lê o repositório, o brief, a construção em `dist/` (que tem de ser da cabeça do
 * código, e o guião confere-o pelo `version.json`), e os ficheiros de prova desta pasta: a reprodução do §0, as capturas
 * de antes e de depois, a medida estática dos cookies de antes e de depois, as plantas sobre a construção, os portões e o
 * custo. O que não conseguir ler fica «NÃO LIDO», com o conhecido-positivo a falso, e o guião sai com 1.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/h3-2026-10-05/medir-h3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

const RAIZ = process.cwd();
const PASTA = 'design/especime-v3/medicoes/h3-2026-10-05';
const DIST = path.join(RAIZ, 'dist');
const BRIEF = 'design/observatorio/BRIEF-H3-a-passagem-de-higiene-de-05-10.md';
/* A BASE DO RAMO É O COMMIT DO BRIEF, procurado pelo assunto na história da cabeça, e não um resumo escrito. */
const BASE = execFileSync('git', ['log', '-1', '--format=%h', '--grep=^H3: o brief da passagem de higiene', 'HEAD'], { encoding: 'utf8' }).trim();
const NAO = 'NÃO LIDO';
const medidas = [];
const medicao = (nome, valor, comando, oQue, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) } });
const lerJson = (f) => { try { return JSON.parse(fs.readFileSync(path.join(PASTA, f), 'utf8')); } catch { return null; } };
const lerTexto = (f) => { try { return fs.readFileSync(path.join(PASTA, f), 'utf8'); } catch { return null; } };
const importa = async (f) => import(pathToFileURL(path.join(RAIZ, f)).href);
const palavras = (t) => (t ? t.split(/\s+/).filter(Boolean).length : 0);
/** Um número lido de um registo, ou «NÃO LIDO» quando o registo não o tem (um zero lido continua a ser zero). */
const ouNao = (n) => (Number.isFinite(n) ? n : NAO);

/* --- a cabeça e a construção ------------------------------------------------ */
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const portoes = { cabeca: lerTexto('portoes/cabeca')?.trim() ?? null };
medicao('base_do_ramo_encontrada', Boolean(BASE), "git log -1 --format=%h --grep='^H3: o brief da passagem de higiene' HEAD", 'o commit do brief está na história da cabeça', Boolean(BASE));
medicao('construcao_da_cabeca_dos_portoes', versao.commit === portoes.cabeca, 'dist/version.json contra portoes/cabeca', 'o version.json tem um commit escrito', typeof versao.commit === 'string' && versao.commit.length === 40);

/* --- o §0 do brief, reproduzido ---------------------------------------------- */
const reproduzido = lerJson('brief-h3-reproduzido.json');
const diffDoBrief = lerTexto('brief-h3-reproduzido.diff.codigo')?.trim();
medicao('brief_h3_reproduzido_sem_diferencas', diffDoBrief === '0', 'OEDP_MEDIDAS_JSON=<pasta>/brief-h3-reproduzido.json python3 design/observatorio/medidas/BRIEF-H3.py; diff com design/observatorio/medidas/BRIEF-H3.json', 'a reprodução tem as seis medidas do §0', reproduzido?.medidas?.length === 6);
const doBrief = new Map((reproduzido?.medidas ?? []).map((m) => [m.nome, m.valor]));
medicao('palavras_da_nota_pt_antes', doBrief.get('palavras_da_nota_da_caixa_das_sugestoes_em_portugues') ?? NAO, 'a medida do §0 do brief, reproduzida', 'a reprodução tem a medida', doBrief.has('palavras_da_nota_da_caixa_das_sugestoes_em_portugues'));

/* --- os textos do §5 do brief, à letra ------------------------------------------ */
const brief = fs.readFileSync(path.join(RAIZ, BRIEF), 'utf8');
const s5 = brief.slice(brief.indexOf('## 5 ·'), brief.indexOf('## 6 ·'));
const decisao1 = s5.slice(s5.indexOf('1. **A nota da caixa'), s5.indexOf('2. **A página'));
const decisao2 = s5.slice(s5.indexOf('2. **A página'), s5.indexOf('3. **A forma'));
const aspas = (t) => [...t.matchAll(/«([^»]+)»/g)].map((m) => m[1]);
const [notaPtBrief, portaPtBrief, notaEnBrief, portaEnBrief] = aspas(decisao1.slice(decisao1.indexOf('(aprovada')));
const privacidadePtBrief = (decisao2.match(/à letra: «([\s\S]+?)» A última frase/) ?? [])[1] ?? null;
const { SUGESTOES } = await importa('src/data/sugestoes.mjs');
const { PRIVACIDADE, FRASE_DOS_COOKIES } = await importa('src/data/privacidade.mjs');
medicao('nota_pt_igual_ao_brief', SUGESTOES.nota.pt === notaPtBrief, `src/data/sugestoes.mjs SUGESTOES.nota.pt contra o §5, decisão 1, de ${BRIEF}`, 'o §5 do brief traz a frase «Só guardamos…»', Boolean(notaPtBrief?.startsWith('Só guardamos')));
medicao('nota_en_igual_ao_brief', SUGESTOES.nota.en === notaEnBrief, 'SUGESTOES.nota.en contra o §5, decisão 1, do brief', 'o §5 do brief traz a frase «We only keep…»', Boolean(notaEnBrief?.startsWith('We only keep')));
medicao('porta_da_nota_igual_ao_brief', SUGESTOES.portaDaNota.pt === portaPtBrief && SUGESTOES.portaDaNota.en === portaEnBrief, 'SUGESTOES.portaDaNota contra o §5, decisão 1, do brief', 'o §5 do brief traz «Como tratamos os seus dados» e «How we handle your data»', portaPtBrief === 'Como tratamos os seus dados' && portaEnBrief === 'How we handle your data');
medicao('privacidade_pt_igual_ao_brief', PRIVACIDADE.texto.pt === privacidadePtBrief, 'src/data/privacidade.mjs PRIVACIDADE.texto.pt contra o §5, decisão 2, do brief, byte a byte', 'o texto do brief fala da CNPD e dos cookies', Boolean(privacidadePtBrief?.includes('cnpd.pt') && privacidadePtBrief?.includes('cookies')));
medicao('frase_dos_cookies_no_texto', PRIVACIDADE.texto.pt.endsWith(FRASE_DOS_COOKIES.pt) && PRIVACIDADE.texto.en.endsWith(FRASE_DOS_COOKIES.en), 'PRIVACIDADE.texto.<pt|en> acaba em FRASE_DOS_COOKIES.<pt|en>', 'a frase portuguesa dos cookies é a última do brief', Boolean(privacidadePtBrief?.endsWith(FRASE_DOS_COOKIES.pt)));
medicao('descricao_da_privacidade_e_a_primeira_frase', PRIVACIDADE.texto.pt.startsWith(PRIVACIDADE.descricao.pt) && PRIVACIDADE.texto.en.startsWith(PRIVACIDADE.descricao.en), 'PRIVACIDADE.descricao é o começo de PRIVACIDADE.texto, nas duas edições', 'a descrição portuguesa acaba no primeiro ponto final do texto', PRIVACIDADE.descricao.pt === PRIVACIDADE.texto.pt.slice(0, PRIVACIDADE.texto.pt.indexOf('.') + 1));
const notaAVista = `${SUGESTOES.nota.pt} ${SUGESTOES.portaDaNota.pt}`;
medicao('palavras_da_nota_pt_depois', palavras(SUGESTOES.nota.pt), 'as palavras de SUGESTOES.nota.pt, pela regra do guião do §0 (split nos espaços)', 'a mesma regra conta 144 na nota de antes', doBrief.get('palavras_da_nota_da_caixa_das_sugestoes_em_portugues') === 144);
medicao('palavras_da_nota_pt_a_vista_com_a_porta', palavras(notaAVista), 'as palavras da nota e da porta, pela mesma regra', 'a porta tem cinco palavras', palavras(SUGESTOES.portaDaNota.pt) === 5);
medicao('palavras_do_texto_da_privacidade_pt', palavras(PRIVACIDADE.texto.pt), 'as palavras de PRIVACIDADE.texto.pt, pela mesma regra', 'o texto tem a frase dos cookies', PRIVACIDADE.texto.pt.includes(FRASE_DOS_COOKIES.pt));
medicao('algarismos_nos_textos_novos', [SUGESTOES.nota.pt, SUGESTOES.nota.en, PRIVACIDADE.texto.pt, PRIVACIDADE.texto.en].join(' ').match(/\d/g)?.length ?? 0, 'os algarismos dos textos novos (a nota e a página, nas duas edições)', 'o mesmo detetor vê os algarismos de «cinco» escrito «5»', '5 sugestões'.match(/\d/g)?.length === 1);

/* --- as rotas e as páginas --------------------------------------------------------- */
const rotasFonte = fs.readFileSync(path.join(RAIZ, 'src/lib/routes.mjs'), 'utf8');
medicao('rotas_de_privacidade_no_sitio', (rotasFonte.match(/^\s+privacidade: \{/gm) ?? []).length, 'src/lib/routes.mjs · as chaves de rota «privacidade» (a regra do guião do §0)', 'a rota das sugestões existe', /^\s+sugestoes: \{/m.test(rotasFonte));
const { routePath } = await importa('src/lib/routes.mjs');
const paginaPt = path.join(DIST, 'privacidade', 'index.html');
const paginaEn = path.join(DIST, 'en', 'privacy', 'index.html');
medicao('paginas_da_privacidade_construidas', [paginaPt, paginaEn].filter((f) => fs.existsSync(f)).length, 'ls dist/privacidade/index.html dist/en/privacy/index.html', 'a página das sugestões está construída', fs.existsSync(path.join(DIST, 'sugestoes', 'index.html')));
const xml = fs.readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => fs.readFileSync(path.join(DIST, f), 'utf8')).join('\n');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
medicao('privacidade_no_mapa_do_sitio', ['pt', 'en'].filter((l) => locs.includes(routePath('privacidade', l))).length, 'os <loc> de dist/sitemap-*.xml', 'a página das sugestões está no mapa', locs.includes(routePath('sugestoes', 'pt')));
const indice = { pt: fs.readFileSync(path.join(DIST, 'indice', 'index.html'), 'utf8'), en: fs.readFileSync(path.join(DIST, 'en', 'index', 'index.html'), 'utf8') };
medicao('privacidade_no_indice', ['pt', 'en'].filter((l) => parse(indice[l]).querySelectorAll(`main a[href="${routePath('privacidade', l)}"]`).length === 1).length, 'as ligações do <main> de dist/indice/index.html e dist/en/index/index.html para a página da sua edição', 'o índice português liga às sugestões', parse(indice.pt).querySelectorAll(`main a[href="${routePath('sugestoes', 'pt')}"]`).length === 1);
/* A porta do rodapé, contada em cada página de dist/ por uma leitura deste guião. */
let paginas = 0, comRodape = 0, comPorta = 0, comPortaDaOutra = 0;
const anda = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { anda(f); continue; }
    if (!e.name.endsWith('.html')) continue;
    paginas++;
    const cru = fs.readFileSync(f, 'utf8');
    if (!cru.includes('data-porta-correccoes')) continue;
    comRodape++;
    const lang = /<html[^>]*lang="en"/.test(cru) ? 'en' : 'pt';
    const m = /<span data-porta-privacidade><a href="([^"]+)">/.exec(cru);
    if (m && m[1] === routePath('privacidade', lang)) comPorta++;
    else if (m) comPortaDaOutra++;
  }
};
anda(DIST);
medicao('paginas_html_construidas', paginas, 'os ficheiros .html de dist/', 'a página dos temas é um deles', fs.existsSync(path.join(DIST, 'temas', 'index.html')));
medicao('paginas_com_a_porta_das_correcoes', comRodape, 'os ficheiros .html de dist/ com data-porta-correccoes', 'a página dos temas tem-na', fs.readFileSync(path.join(DIST, 'temas', 'index.html'), 'utf8').includes('data-porta-correccoes'));
medicao('paginas_com_a_porta_da_privacidade_da_sua_edicao', comPorta, 'as páginas com a porta das correções cuja porta da privacidade leva à página da sua edição', 'a página inglesa dos temas leva a /en/privacy', fs.readFileSync(path.join(DIST, 'en', 'themes', 'index.html'), 'utf8').includes('<span data-porta-privacidade><a href="/en/privacy">'));
medicao('paginas_com_a_porta_da_privacidade_da_outra_edicao', comPortaDaOutra, 'as páginas com a porta da privacidade para a página da outra edição', 'o mesmo detetor lê a porta de uma página', comPorta > 0);
const formulario = { pt: parse(fs.readFileSync(path.join(DIST, 'sugestoes', 'index.html'), 'utf8')), en: parse(fs.readFileSync(path.join(DIST, 'en', 'suggestions', 'index.html'), 'utf8')) };
const caixasDeMarcar = (r) => r.querySelectorAll('form input[type="checkbox"]').length;
medicao('caixas_de_marcar_no_formulario', caixasDeMarcar(formulario.pt) + caixasDeMarcar(formulario.en), 'os input[type=checkbox] do formulário de dist/sugestoes e dist/en/suggestions', 'o mesmo contador vê uma caixa num formulário escrito para isso', caixasDeMarcar(parse('<form><input type="checkbox" name="x"></form>')) === 1);
const portaDaNota = (r) => r.querySelectorAll('[data-sugestoes-nota] a[href]').map((a) => a.getAttribute('href'));
medicao('portas_da_nota_para_a_privacidade', ['pt', 'en'].filter((l) => JSON.stringify(portaDaNota(formulario[l])) === JSON.stringify([routePath('privacidade', l)])).length, 'as ligações de [data-sugestoes-nota] nos dois formulários, uma só e para a página da edição', 'a nota portuguesa tem uma ligação', portaDaNota(formulario.pt).length === 1);
medicao('enderecos_de_correio_na_nota', ['pt', 'en'].reduce((n, l) => n + formulario[l].querySelectorAll('[data-sugestoes-nota] a[href^="mailto:"]').length, 0), 'as ligações mailto: dentro da nota dos dois formulários', 'a página da privacidade tem uma ligação mailto:', parse(fs.readFileSync(paginaPt, 'utf8')).querySelectorAll('[data-privacidade-texto] a[href^="mailto:"]').length === 1);

/* --- o menu a 390 px, pelas capturas ------------------------------------------------- */
const depois = lerJson('capturas-h3-depois.json');
const antes = lerJson('capturas-h3-antes.json');
const menu = (manifesto, forma, lang) => manifesto?.capturas?.find((c) => c.tipo === 'menu a 390 px' && c.forma === forma && c.lang === lang)?.medidas ?? null;
for (const lang of ['pt', 'en']) {
  const inteiro = menu(depois, 'nome-inteiro', lang);
  const publicado = menu(depois, 'publicado', lang);
  medicao(`menu_390_${lang}_nome_inteiro_largura_natural`, inteiro?.natural ?? NAO, 'captar-h3.mjs depois: a largura natural da fila das seis portas com o nome inteiro, no navegador', 'a forma publicada cabe numa linha, pela mesma conta', publicado?.linhas === 1);
  medicao(`menu_390_${lang}_coluna`, inteiro?.coluna ?? NAO, 'captar-h3.mjs depois: a largura da coluna do menu a 390 px', 'a coluna é maior do que zero', (inteiro?.coluna ?? 0) > 0);
  medicao(`menu_390_${lang}_nome_inteiro_falta`, inteiro?.falta ?? NAO, 'a largura natural menos a coluna, com o nome inteiro', 'com o rótulo curto não falta nada', publicado?.falta === 0);
  medicao(`menu_390_${lang}_nome_inteiro_linhas`, inteiro?.linhas ?? NAO, 'as linhas que a fila ocupa com o nome inteiro', 'com o rótulo curto ocupa uma', publicado?.linhas === 1);
  medicao(`menu_390_${lang}_publicado_largura_natural`, publicado?.natural ?? NAO, 'captar-h3.mjs depois: a largura natural da fila publicada', 'o rótulo publicado é o curto', publicado?.rotulo_da_uniao === (lang === 'pt' ? 'Europa' : 'Europe'));
}
const { STRINGS } = await importa('src/i18n/strings.mjs');
medicao('rotulo_da_uniao_no_menu', [STRINGS.pt.nav.uniaoEuropeiaNoMenu, STRINGS.en.nav.uniaoEuropeiaNoMenu], 'src/i18n/strings.mjs nav.uniaoEuropeiaNoMenu nas duas edições', 'o nome inteiro da página continua no rodapé', STRINGS.pt.nav.uniaoEuropeia === 'Portugal na União Europeia');

/* --- as faixas dos 27, pelas capturas ------------------------------------------------- */
const faixasDaUniao = (manifesto, lang, largura) => manifesto?.capturas?.find((c) => c.familia === 'uniao' && c.lang === lang && c.largura === largura)?.medidas?.faixas ?? null;
for (const [rotulo, manifesto] of [['antes', antes], ['depois', depois]]) {
  for (const largura of [390, 1280]) {
    const f = faixasDaUniao(manifesto, 'pt', largura);
    const fEn = faixasDaUniao(manifesto, 'en', largura);
    medicao(`faixas_da_pagina_da_uniao_${rotulo}_${largura}`, f?.length ?? NAO, `captar-h3.mjs ${rotulo}: as faixas da secção dos países, a ${largura} px, edição portuguesa`, 'cada faixa tem 27 marcas de país', Boolean(f?.length) && f.every((x) => x.marcas_de_pais === 27));
    medicao(`paises_escondidos_por_outro_${rotulo}_${largura}`, f ? f.reduce((n, x) => n + x.paises_escondidos_por_outro, 0) + fEn.reduce((n, x) => n + x.paises_escondidos_por_outro, 0) : NAO, `captar-h3.mjs ${rotulo}: as marcas de país com o centro no mesmo ponto de outra, a ${largura} px, nas duas edições`, 'o mesmo detetor conta posições distintas abaixo de 27 em pelo menos uma faixa antes', (faixasDaUniao(antes, 'pt', largura) ?? []).some((x) => x.posicoes_distintas_dos_paises < 27));
  }
  const f = faixasDaUniao(manifesto, 'pt', 1280) ?? [];
  medicao(`posicoes_distintas_minimas_numa_faixa_${rotulo}`, f.length ? Math.min(...f.map((x) => x.posicoes_distintas_dos_paises)) : NAO, `captar-h3.mjs ${rotulo}: o menor número de posições distintas das 27 marcas de país numa faixa, a 1 280 px`, 'a faixa do desemprego de longa duração está entre as medidas', f.some((x) => x.serie === 'desemprego-de-longa-duracao-2025-paises'));
}
const cartoes = (manifesto, lang, largura) => manifesto?.capturas?.find((c) => c.tipo === 'faixas dos cartões' && c.lang === lang && c.largura === largura)?.faixas ?? null;
for (const [rotulo, manifesto] of [['antes', antes], ['depois', depois]]) {
  const c = [...(cartoes(manifesto, 'pt', 390) ?? []), ...(cartoes(manifesto, 'en', 390) ?? [])];
  medicao(`faixas_dos_cartoes_${rotulo}`, c.length || NAO, `captar-h3.mjs ${rotulo}: as faixas da União nos cartões das sete páginas de assunto, nas duas edições`, 'cada faixa tem 27 marcas de país', c.length > 0 && c.every((x) => x.marcas_de_pais === 27));
  medicao(`paises_escondidos_nas_faixas_dos_cartoes_${rotulo}`, c.length ? c.reduce((n, x) => n + x.paises_escondidos_por_outro, 0) : NAO, `captar-h3.mjs ${rotulo}: as marcas de país com o centro no mesmo ponto de outra, nas faixas dos cartões, a 390 px`, 'antes havia marcas escondidas', (cartoes(antes, 'pt', 390) ?? []).some((x) => x.paises_escondidos_por_outro > 0));
  medicao(`marcas_com_title_nas_faixas_dos_cartoes_${rotulo}`, c.length ? c.reduce((n, x) => n + x.marcas_com_title, 0) : NAO, `captar-h3.mjs ${rotulo}: as marcas com title nas faixas dos cartões, nas duas edições`, 'as faixas dos cartões foram lidas', c.length > 0);
}
const etiqueta = depois?.capturas?.filter((c) => c.tipo === 'etiqueta de um grupo ao passar o rato' && c.largura === 1280) ?? [];
medicao('etiqueta_do_grupo_ao_passar_o_rato', !etiqueta.length ? NAO : etiqueta.map((e) => e.etiquetas_visiveis?.[0]?.texto ?? NAO), 'captar-h3.mjs depois: o rato pousado no ponto da França na faixa do desemprego de longa duração, a 1 280 px; a etiqueta à vista', 'a etiqueta à vista diz quatro países e um valor, nas duas edições', etiqueta.length === 2 && etiqueta.every((e) => e.etiquetas_visiveis?.length === 1 && e.etiquetas_visiveis[0].paises.length === 4 && e.etiquetas_visiveis[0].valores === 1));
/* A ETIQUETA DO GRUPO A 390 PX, aberta pelo rato nas capturas de depois: a caixa contra a janela. */
const etiqueta390 = depois?.capturas?.filter((c) => c.tipo === 'etiqueta de um grupo ao passar o rato' && c.largura === 390) ?? [];
medicao('etiqueta_do_grupo_a_390_fora_da_janela_px', etiqueta390.length === 2 ? etiqueta390.reduce((n, e) => n + (e.etiquetas_visiveis?.[0]?.fora_da_janela ?? NaN), 0) : NAO, 'captar-h3.mjs depois: a etiqueta do grupo do desemprego de longa duração aberta pelo rato a 390 px, os píxeis que passam a margem da janela, nas duas edições somadas', 'a etiqueta à vista diz quatro países e um valor, nas duas edições', etiqueta390.length === 2 && etiqueta390.every((e) => e.etiquetas_visiveis?.length === 1 && e.etiquetas_visiveis[0].paises.length === 4 && e.etiquetas_visiveis[0].valores === 1));
/* AS ETIQUETAS DO TOQUE UMA A UMA, antes e depois da emenda que as mantém dentro do desenho (etiquetas-do-toque.mjs). */
{
  const antesE = lerJson('etiquetas-do-toque-antes-da-emenda.json');
  const depoisE = lerJson('etiquetas-do-toque-depois-da-emenda.json');
  const kp = (s) => Boolean(s?.medidas?.length === 10 && s.medidas.every((m) => m.conhecido_positivo_visto) && s.arvore_limpa && s.cabeca === s.construcao);
  const soma = (s, campo, filtro = () => true) => (s ? s.medidas.filter(filtro).reduce((n, m) => n + m[campo], 0) : NAO);
  const a390 = (m) => m.largura === 390;
  const acima = (m) => m.largura > 390;
  medicao('etiquetas_do_toque_por_edicao', depoisE ? depoisE.medidas.find((m) => m.largura === 390 && m.lang === 'pt').etiquetas : NAO, 'etiquetas-do-toque.mjs depois-da-emenda: as etiquetas do toque da página da União, edição portuguesa', 'o mesmo número na edição inglesa e em todas as larguras', Boolean(depoisE && new Set(depoisE.medidas.map((m) => m.etiquetas)).size === 1));
  medicao('etiquetas_fora_da_janela_a_390_antes', soma(antesE, 'fora_da_janela', a390), 'etiquetas-do-toque.mjs antes-da-emenda: as etiquetas que passam a margem da janela quando se mostram, a 390 px, nas duas edições somadas', 'o conhecido-positivo (uma etiqueta mais larga do que a janela) foi visto nas cinco larguras e nas duas edições', kp(antesE));
  medicao('etiquetas_de_grupo_fora_da_janela_a_390_antes', soma(antesE, 'fora_da_janela_de_grupo', a390), 'etiquetas-do-toque.mjs antes-da-emenda: as etiquetas de grupo entre elas', 'o mesmo conhecido-positivo', kp(antesE));
  medicao('etiquetas_de_um_pais_fora_da_janela_a_390_antes', antesE ? soma(antesE, 'fora_da_janela', a390) - soma(antesE, 'fora_da_janela_de_grupo', a390) : NAO, 'etiquetas-do-toque.mjs antes-da-emenda: as de um país só entre as que passavam a margem a 390 px', 'o mesmo conhecido-positivo', kp(antesE));
  medicao('maior_saida_da_janela_a_390_antes_px', antesE ? Math.max(...antesE.medidas.filter(a390).map((m) => m.maior_saida_da_janela_px)) : NAO, 'etiquetas-do-toque.mjs antes-da-emenda: os píxeis da etiqueta que mais passa a margem da janela, a 390 px', 'o mesmo conhecido-positivo', kp(antesE));
  medicao('etiquetas_com_rolagem_a_390_antes', soma(antesE, 'com_rolagem_a_mais', a390), 'etiquetas-do-toque.mjs antes-da-emenda: as etiquetas que, mostradas, põem a página a rolar para o lado, a 390 px, nas duas edições somadas', 'o mesmo conhecido-positivo', kp(antesE));
  medicao('etiquetas_fora_da_janela_acima_de_390_antes', soma(antesE, 'fora_da_janela', acima), 'etiquetas-do-toque.mjs antes-da-emenda: o mesmo, a 768, 1 024, 1 280 e 1 600 px', 'o mesmo conhecido-positivo', kp(antesE));
  medicao('etiquetas_fora_da_janela_depois', soma(depoisE, 'fora_da_janela'), 'etiquetas-do-toque.mjs depois-da-emenda: as etiquetas que passam a margem da janela, nas cinco larguras e nas duas edições somadas', 'o conhecido-positivo foi visto nas cinco larguras e nas duas edições', kp(depoisE));
  medicao('etiquetas_fora_do_desenho_depois', soma(depoisE, 'fora_do_desenho'), 'etiquetas-do-toque.mjs depois-da-emenda: as etiquetas que passam a caixa do desenho, nas cinco larguras e nas duas edições somadas', 'antes da emenda o mesmo detetor via etiquetas a passar a caixa do desenho', (antesE ? soma(antesE, 'fora_do_desenho') : 0) > 0);
  medicao('etiquetas_com_rolagem_depois', soma(depoisE, 'com_rolagem_a_mais'), 'etiquetas-do-toque.mjs depois-da-emenda: as etiquetas que, mostradas, põem a página a rolar para o lado', 'antes da emenda o mesmo detetor via rolagem a 390 px', (antesE ? soma(antesE, 'com_rolagem_a_mais', a390) : 0) > 0);
  medicao('etiquetas_que_nao_cobrem_a_marca_depois', soma(depoisE, 'que_nao_cobrem_a_marca'), 'etiquetas-do-toque.mjs depois-da-emenda: as etiquetas cuja caixa não cobre o centro da sua marca na horizontal', 'cada etiqueta achou a sua marca', Boolean(depoisE) && soma(depoisE, 'sem_marca') === 0);
  medicao('etiquetas_em_mais_de_uma_linha_a_390_depois', soma(depoisE, 'com_mais_de_uma_linha', a390), 'etiquetas-do-toque.mjs depois-da-emenda: as etiquetas que dobram, a 390 px, nas duas edições somadas', 'as que dobram são todas de grupo e mais largas do que o desenho numa linha só (a medida de antes)', Boolean(depoisE) && depoisE.medidas.filter(a390).every((m) => m.as_de_mais_de_uma_linha.every((x) => x.paises > 1)));
  medicao('etiquetas_em_mais_de_uma_linha_acima_de_390_depois', soma(depoisE, 'com_mais_de_uma_linha', acima), 'etiquetas-do-toque.mjs depois-da-emenda: o mesmo, a 768, 1 024, 1 280 e 1 600 px', 'o mesmo detetor conta as que dobram a 390 px', Boolean(depoisE));
  medicao('largura_do_desenho_a_390_antes_px', antesE ? Math.min(...antesE.medidas.filter(a390).map((m) => m.desenho_mais_estreito_px)) : NAO, 'etiquetas-do-toque.mjs antes-da-emenda: a largura do desenho mais estreito a 390 px', 'a medida leu desenhos', Boolean(antesE?.medidas?.length));
  medicao('largura_do_desenho_a_390_depois_px', depoisE ? Math.min(...depoisE.medidas.filter(a390).map((m) => m.desenho_mais_estreito_px)) : NAO, 'etiquetas-do-toque.mjs depois-da-emenda: a mesma largura depois da emenda (a contenção do contentor não mexe na largura do desenho)', 'a medida leu desenhos', Boolean(depoisE?.medidas?.length));
  medicao('maior_etiqueta_a_390_antes_px', antesE ? Math.max(...antesE.medidas.filter(a390).map((m) => m.maior_etiqueta_px)) : NAO, 'etiquetas-do-toque.mjs antes-da-emenda: a etiqueta mais larga, numa linha só, a 390 px', 'o mesmo conhecido-positivo', kp(antesE));
}
/* A regra das alturas, pelo resolvedor e pela cópia dos portões, sobre as dez séries. */
const { faixaDaMedida } = await importa('src/lib/faixa-da-uniao.mjs');
const { lerSeriesDoPortao, alturaNaFaixaDoPortao } = await importa('scripts/series-do-portao.mjs');
const series = [...lerSeriesDoPortao().values()].filter((s) => s.eixo === 'pais');
let afastadas = 0, discordancias = 0, grupos = 0, maior = 0;
for (const s of series) {
  const f = faixaDaMedida(String(s.linha_de_portugal), 'pt');
  for (const m of f.marcas) {
    const g = alturaNaFaixaDoPortao(s, m.geo);
    if (g.altura !== m.altura || g.noGrupo !== m.noGrupo) discordancias++;
    if (m.noGrupo > 1) afastadas++;
    maior = Math.max(maior, m.noGrupo);
  }
  grupos += new Set(f.marcas.filter((m) => m.noGrupo > 1).map((m) => m.esquerda)).size;
}
medicao('marcas_afastadas_na_vertical_por_edicao', afastadas, 'faixaDaMedida() das dez séries: as marcas de país com outro país do mesmo valor', 'a cópia dos portões conta o mesmo grupo de quatro na faixa do desemprego de longa duração', alturaNaFaixaDoPortao(series.find((s) => s.id === 'desemprego-de-longa-duracao-2025-paises'), 'FR').noGrupo === 4);
medicao('grupos_de_paises_no_mesmo_valor', grupos, 'faixaDaMedida() das dez séries: as posições com dois ou mais países', 'o maior grupo é o do §0 do brief', maior === doBrief.get('maximo_de_paises_no_mesmo_valor_numa_faixa'));
medicao('maior_grupo_de_paises_no_mesmo_valor', maior, 'faixaDaMedida() das dez séries: o maior grupo', 'o §0 do brief mede o mesmo', doBrief.has('maximo_de_paises_no_mesmo_valor_numa_faixa'));
medicao('alturas_do_resolvedor_contra_as_dos_portoes', discordancias, 'faixaDaMedida() contra alturaNaFaixaDoPortao(), marca a marca, nas dez séries', 'as duas contas foram corridas sobre as 280 marcas', series.length === 10);
/* «PELA ORDEM DA TABELA»: a ordem dos países em cada série é a da tabela dos países (o campo `ordem`, protocolar). */
const tabela = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/paises-da-uniao.json'), 'utf8')).paises;
const pelaTabela = [...tabela].sort((a, b) => String(a.ordem).localeCompare(String(b.ordem))).map((p) => p.geo).join(',');
const naOrdem = (s) => s.pontos.filter((p) => p.geo !== 'EU27_2020').map((p) => p.geo).join(',') === pelaTabela;
/* OS GRUPOS COM MARCAS DA FONTE DIFERENTES: países com o mesmo valor em que um ponto leva uma marca e outro não, ou
   outra; é por eles que a ressalva vai a seguir ao nome de cada país, e não depois do valor. */
const { numeroDoPortao } = await importa('scripts/series-do-portao.mjs');
let mistos = 0;
for (const s of series) {
  const porValor = new Map();
  for (const p of s.pontos.filter((x) => x.geo !== 'EU27_2020')) {
    const k = numeroDoPortao(p.valor);
    porValor.set(k, [...(porValor.get(k) ?? []), p.bandeira ?? '']);
  }
  for (const marcas of porValor.values()) if (marcas.length > 1 && new Set(marcas).size > 1) mistos++;
}
medicao('grupos_com_marcas_da_fonte_diferentes', mistos, 'ledger/series/*-paises.yml: os grupos de países com o mesmo valor cujos pontos não levam todos a mesma marca da fonte', 'a faixa do desemprego de longa duração tem a França com marca e a Estónia sem ela, no mesmo valor', (() => { const s = series.find((x) => x.id === 'desemprego-de-longa-duracao-2025-paises'); const fr = s.pontos.find((p) => p.geo === 'FR'); const ee = s.pontos.find((p) => p.geo === 'EE'); return fr.valor === ee.valor && fr.bandeira && !ee.bandeira; })());
medicao('series_com_os_paises_pela_ordem_da_tabela', series.filter(naOrdem).length, 'a ordem dos países em ledger/series/*-paises.yml contra a de src/data/paises-da-uniao.json pelo campo ordem', 'uma série com a ordem invertida não passa', !naOrdem({ pontos: [...series[0].pontos].reverse() }));

/* «AO RECEBER O FOCO»: o que um teclado alcança dentro dos desenhos das faixas, que vão `aria-hidden` desde o UE1. */
const focaveis = (raiz) => raiz.querySelectorAll('[data-faixa-desenho]').reduce((n, d) => n + d.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])').length, 0);
const desenhosEscondidos = (raiz) => raiz.querySelectorAll('[data-faixa-desenho]').filter((d) => d.getAttribute('aria-hidden') === 'true').length;
const daUniao = { pt: parse(fs.readFileSync(path.join(DIST, 'uniao-europeia', 'index.html'), 'utf8')), en: parse(fs.readFileSync(path.join(DIST, 'en', 'european-union', 'index.html'), 'utf8')) };
const doEmprego = parse(fs.readFileSync(path.join(DIST, 'emprego', 'index.html'), 'utf8'));
medicao('elementos_focaveis_nos_desenhos_das_faixas', focaveis(daUniao.pt) + focaveis(daUniao.en) + focaveis(doEmprego), 'os elementos que o teclado alcança dentro de [data-faixa-desenho], nas duas páginas da União e na do emprego', 'o mesmo contador vê um span com tabindex="0" num desenho escrito para isso', focaveis(parse('<div data-faixa-desenho="x"><span tabindex="0"></span></div>')) === 1);
medicao('desenhos_das_faixas_aria_hidden_na_pagina_da_uniao', desenhosEscondidos(daUniao.pt) + desenhosEscondidos(daUniao.en), 'os [data-faixa-desenho] com aria-hidden="true" nas duas páginas da União', 'são as vinte faixas das duas edições', daUniao.pt.querySelectorAll('[data-faixa-desenho]').length === 10);

/* --- os cookies e o seguimento --------------------------------------------------------- */
for (const rotulo of ['antes', 'depois']) {
  const c = lerJson(`cookies-e-seguimento-${rotulo}.json`);
  medicao(`achados_contra_a_frase_dos_cookies_${rotulo}`, c?.achados ?? NAO, `node ${PASTA}/cookies-e-seguimento.mjs ${rotulo}: as páginas, os guiões servidos, a configuração da Vercel e as funções`, 'as plantas da célula dos cookies, cada uma vista', c?.conhecido_positivo?.encontrado === true);
  medicao(`paginas_lidas_pela_celula_dos_cookies_${rotulo}`, c?.paginas_lidas ?? NAO, `node ${PASTA}/cookies-e-seguimento.mjs ${rotulo}`, 'a medida é de uma construção com páginas', (c?.paginas_lidas ?? 0) > 0);
}
/* O QUE O SÍTIO GUARDA NO APARELHO, que não é um cookie: os guiões servidos que usam `localStorage`, e a chave. */
const guioesServidos = fs.readdirSync(path.join(DIST, 'js')).filter((f) => f.endsWith('.js'));
const comArmazenamento = guioesServidos.filter((f) => /localStorage|sessionStorage|indexedDB/.test(fs.readFileSync(path.join(DIST, 'js', f), 'utf8')));
const temaJs = fs.readFileSync(path.join(DIST, 'js', 'tema.js'), 'utf8');
medicao('guioes_que_guardam_no_aparelho', comArmazenamento, 'os guiões de dist/js que usam localStorage, sessionStorage ou indexedDB', 'o guião do tema guarda a escolha na chave «tema»', temaJs.includes("var CHAVE = 'tema'") && temaJs.includes('localStorage.setItem'));
/* Sem o manifesto de depois, as medidas do navegador ficam «NÃO LIDO», e não zero: um zero de um ficheiro que não existe não é um zero. */
const dinamicas = depois?.capturas?.filter((c) => c.tipo === 'pagina') ?? [];
const positivoDosCookies = depois?.capturas?.find((c) => c.tipo === 'conhecido-positivo dos cookies');
medicao('paginas_abertas_no_navegador_depois', depois ? dinamicas.length : NAO, 'captar-h3.mjs depois: as páginas inteiras abertas no navegador', 'o captor abriu páginas das quatro famílias', new Set(dinamicas.map((c) => c.familia)).size === 4);
medicao('cookies_guardados_nas_paginas_abertas', !depois ? NAO : dinamicas.reduce((n, c) => n + (c.medidas?.cookies_do_contexto?.length ?? 0) + (c.medidas?.cookie_do_documento ? 1 : 0), 0), 'captar-h3.mjs depois: os cookies do contexto do navegador e document.cookie, página a página', 'um cookie posto pelo servidor e um posto por guião numa página do mesmo servidor foram vistos', positivoDosCookies?.visto === true);
medicao('pedidos_para_fora_nas_paginas_abertas', !depois ? NAO : dinamicas.reduce((n, c) => n + (c.medidas?.pedidos_para_fora?.length ?? 0), 0), 'captar-h3.mjs depois: os pedidos a outra origem, página a página, recusados e contados', 'o pedido para fora da página do conhecido-positivo foi visto', (positivoDosCookies?.pedidos_para_fora ?? 0) >= 1);

/* --- as plantas sobre a construção ---------------------------------------------------- */
{
  const p = lerJson('plantas-portoes-h3.json') ?? [];
  medicao('plantas_h3_sobre_a_construcao', p.length || NAO, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo h3-`, 'cada planta deu o código 1, com as mordidas e os bytes repostos', p.length > 0 && p.every((x) => x.passou && x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto)));
  medicao('plantas_h3_corridas_na_cabeca_dos_portoes', p.length > 0 && p.every((x) => x.cabeca === portoes.cabeca && x.estado === ''), 'a cabeça e o estado da árvore de cada registo de plantas-portoes-h3.json contra portoes/cabeca', 'os registos trazem a cabeça', p.every((x) => typeof x.cabeca === 'string' && x.cabeca.length === 40));
  /* As três plantas do S1 adaptadas à forma nova, numa corrida só. */
  const l = lerJson('plantas-portoes-lista.json') ?? [];
  const adaptadas = ['s1-nota-mudada', 's1-voz-nota-mudada-com-language', 's1c-voz-nota-com-outra-palavra'];
  medicao('plantas_do_s1_adaptadas_sobre_a_construcao', l.filter((x) => adaptadas.includes(x.nome)).length || NAO, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --lista ${adaptadas.join(',')}`, 'cada uma deu o código 1, com as mordidas e os bytes repostos', l.length === adaptadas.length && l.every((x) => x.passou && x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto)));
}

/* --- as plantas em memória do portão, corridas outra vez aqui, com os nomes ------------------------ */
const { plantasDaCaixa } = await importa('scripts/sugestoes-do-portao.mjs');
const { plantasDaPrivacidade } = await importa('scripts/privacidade-do-portao.mjs');
const pastaDaBase = path.join(RAIZ, 'supabase', 'migrations');
const migracoes = fs.readdirSync(pastaDaBase).filter((f) => f.endsWith('.sql')).sort().map((nome) => ({ nome, sql: fs.readFileSync(path.join(pastaDaBase, nome), 'utf8') }));
const pc = plantasDaCaixa(migracoes);
const pp = plantasDaPrivacidade();
fs.writeFileSync(path.join(PASTA, 'plantas-em-memoria.json'), JSON.stringify({ guiao: `${PASTA}/medir-h3.mjs`, caixa: pc, privacidade: pp }, null, 2) + '\n');
medicao('plantas_da_caixa_corridas_aqui', pc.length, 'plantasDaCaixa() de scripts/sugestoes-do-portao.mjs sobre as migrações de supabase/migrations (plantas-em-memoria.json)', 'todas mordem, e a do formulário sem a porta é uma delas', pc.every((x) => x.mordeu) && pc.some((x) => x.nome === 'formulario-nota-sem-a-porta'));
medicao('plantas_da_caixa_novas_do_h3', pc.filter((x) => /privacidade|formulario/.test(x.nome)).length, 'as plantas da caixa com «privacidade» ou «formulario» no nome (as do H3)', 'todas mordem', pc.filter((x) => /privacidade|formulario/.test(x.nome)).every((x) => x.mordeu));
medicao('plantas_da_privacidade_corridas_aqui', pp.length, 'plantasDaPrivacidade() de scripts/privacidade-do-portao.mjs (plantas-em-memoria.json)', 'todas mordem, e a de um guião de seguimento é uma delas', pp.every((x) => x.mordeu) && pp.some((x) => x.nome === 'h3-cookies-guiao-de-fora'));
medicao('plantas_da_celula_dos_cookies', pp.filter((x) => x.nome.startsWith('h3-cookies-')).length, 'as plantas h3-cookies-* de plantasDaPrivacidade()', 'todas mordem', pp.filter((x) => x.nome.startsWith('h3-cookies-')).every((x) => x.mordeu));

/* --- os portões ------------------------------------------------------------------------- */
for (const g of ['build', 'verify', 'typecheck']) {
  const c = lerTexto(`portoes/${g}.codigo`)?.trim();
  medicao(`portao_${g}`, c === undefined ? NAO : Number(c), `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/portoes (o código lido de portoes/${g}.codigo)`, 'a corrida escreveu a cabeça em que correu', Boolean(portoes.cabeca));
}
/* A CORRIDA DE ENSAIO, na cabeça 628ef792 (o código sem o mapa do repositório), e as plantas ensaiadas sobre ela. */
const cabecaDoEnsaio = lerTexto('portoes-628ef792/cabeca')?.trim();
for (const g of ['build', 'verify', 'typecheck']) {
  const c = lerTexto(`portoes-628ef792/${g}.codigo`)?.trim();
  medicao(`portao_ensaio_${g}`, c === undefined ? NAO : Number(c), `portoes-628ef792/${g}.codigo (a corrida de ensaio pela mesma tranca)`, 'a corrida de ensaio escreveu a cabeça em que correu, e é 628ef792', cabecaDoEnsaio?.startsWith('628ef792'));
}
/* O MAPA DO REPOSITÓRIO NÃO É LIDO POR NENHUM PORTÃO: os ficheiros de scripts/, tests/, src/, api/ e o package.json que o
   nomeiam, e as cadeias do package.json que chamam algum deles. */
const quemNomeiaOMapa = execFileSync('git', ['grep', '-l', 'MAPA-DO-REPOSITORIO', 'HEAD', '--', 'scripts', 'tests', 'src', 'api', 'package.json'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean).map((l) => l.replace(/^HEAD:/, ''));
const cadeias = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts;
medicao('ficheiros_dos_portoes_que_nomeiam_o_mapa', quemNomeiaOMapa, 'git grep -l MAPA-DO-REPOSITORIO HEAD -- scripts tests src api package.json', 'o conferidor do mapa nomeia-o, e o mesmo detetor acha-o', quemNomeiaOMapa.includes('scripts/leituras/conferir-mapa.py'));
medicao('cadeias_que_chamam_quem_nomeia_o_mapa', Object.values(cadeias).filter((c) => quemNomeiaOMapa.some((f) => c.includes(path.basename(f)))).length, 'as cadeias de scripts do package.json que chamam um desses ficheiros', 'a mesma conta acha a cadeia que chama o check-briefs.py', Object.values(cadeias).some((c) => c.includes('check-briefs.py')));
/* A PRIMEIRA CORRIDA OFICIAL, antes da emenda das etiquetas, e as provas finais sobre ela, guardadas em pastas com o nome
   da sua cabeça (portoes-<cabeça>/ e provas-<cabeça>/). */
const primeiras = fs.readdirSync(PASTA).filter((d) => /^portoes-[0-9a-f]{8}$/.test(d) && d !== 'portoes-628ef792');
const pastaPrimeira = primeiras.length === 1 ? primeiras[0] : null;
const cabecaDaPrimeira = pastaPrimeira ? lerTexto(`${pastaPrimeira}/cabeca`)?.trim() : undefined;
medicao('cabeca_da_primeira_corrida', cabecaDaPrimeira ? cabecaDaPrimeira.slice(0, 8) : NAO, `${pastaPrimeira ?? 'portoes-<cabeça>'}/cabeca`, 'a pasta tem o nome da cabeça que a corrida escreveu, e a cabeça do fim é a mesma', Boolean(cabecaDaPrimeira && pastaPrimeira === `portoes-${cabecaDaPrimeira.slice(0, 8)}` && lerTexto(`${pastaPrimeira}/cabeca.fim`)?.trim() === cabecaDaPrimeira));
for (const g of ['build', 'verify', 'typecheck']) {
  const c = pastaPrimeira ? lerTexto(`${pastaPrimeira}/${g}.codigo`)?.trim() : undefined;
  medicao(`portao_primeira_${g}`, c === undefined ? NAO : Number(c), `${pastaPrimeira}/${g}.codigo (a primeira corrida oficial, antes da emenda das etiquetas)`, 'a corrida escreveu a cabeça em que correu', Boolean(cabecaDaPrimeira));
}
const pastaProvas = cabecaDaPrimeira ? `provas-${cabecaDaPrimeira.slice(0, 8)}` : null;
const p1 = pastaProvas ? lerJson(`${pastaProvas}/plantas-portoes-h3.json`) ?? [] : [];
const l1 = pastaProvas ? lerJson(`${pastaProvas}/plantas-portoes-lista.json`) ?? [] : [];
medicao('plantas_h3_na_primeira_corrida', p1.length || NAO, `${pastaProvas}/plantas-portoes-h3.json (as plantas do prefixo h3- sobre a construção da primeira corrida oficial)`, 'todas com o código 1 e os bytes repostos, na cabeça dessa corrida', p1.length > 0 && p1.every((x) => x.passou && x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto) && x.cabeca === cabecaDaPrimeira));
medicao('plantas_do_s1_na_primeira_corrida', l1.length || NAO, `${pastaProvas}/plantas-portoes-lista.json`, 'todas com o código 1 e os bytes repostos, na cabeça dessa corrida', l1.length > 0 && l1.every((x) => x.passou && x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto) && x.cabeca === cabecaDaPrimeira));
/* As duas medidas das etiquetas, cada uma na sua cabeça: a de antes na da primeira corrida, a de depois na destes portões. */
medicao('etiquetas_antes_na_cabeca_da_primeira_corrida', lerJson('etiquetas-do-toque-antes-da-emenda.json')?.cabeca === cabecaDaPrimeira, 'a cabeça de etiquetas-do-toque-antes-da-emenda.json contra a da primeira corrida oficial', 'as duas cabeças existem', Boolean(cabecaDaPrimeira && lerJson('etiquetas-do-toque-antes-da-emenda.json')?.cabeca));
medicao('etiquetas_depois_na_cabeca_dos_portoes', lerJson('etiquetas-do-toque-depois-da-emenda.json')?.cabeca === portoes.cabeca, 'a cabeça de etiquetas-do-toque-depois-da-emenda.json contra portoes/cabeca', 'as duas cabeças existem', Boolean(portoes.cabeca && lerJson('etiquetas-do-toque-depois-da-emenda.json')?.cabeca));
const ensaio = lerJson('ensaio-628ef792/plantas-portoes-h3.json') ?? [];
medicao('plantas_h3_no_ensaio', ensaio.length || NAO, `OEDP_MEDICOES=${PASTA}/ensaio-628ef792 node tests/pais/portoes.mjs --prefixo h3- (sobre a construção do ensaio)`, 'todas com o código 1 e os bytes repostos', ensaio.length > 0 && ensaio.every((x) => x.passou && x.ficheiros.every((f) => f.antes === f.reposto)));
const buildLog = lerTexto('portoes/build.log') ?? '';
const linhaH3 = buildLog.split('\n').find((l) => l.includes('H3 · a porta da privacidade')) ?? '';
const numero = (re) => Number((linhaH3.match(re) ?? [])[1] ?? NaN);
medicao('portas_da_privacidade_conferidas_pelo_portao', ouNao(numero(/a porta da privacidade em (\d+) de/)), 'a linha «H3 ·» do gate:html em portoes/build.log', 'a mesma linha diz as páginas da privacidade conferidas', numero(/(\d+) página\(s\) da privacidade conferida/) === 2);
medicao('plantas_da_privacidade_em_memoria', ouNao(numero(/(\d+) planta\(s\) em memória; a frase/)), 'a linha «H3 ·» do gate:html', 'a frase dos cookies está no texto e foi conferida', /a frase dos cookies no texto, conferida/.test(linhaH3));
medicao('etiquetas_das_faixas_conferidas_pelo_portao', ouNao(numero(/(\d+) etiqueta\(s\) das marcas da faixa da União conferidas/)), 'a linha «H3 ·» do gate:html', 'a linha existe', linhaH3.length > 0);

const linhaS1 = buildLog.split('\n').find((l) => l.includes(' · S1: ')) ?? '';
medicao('plantas_da_caixa_em_memoria', ouNao(Number((linhaS1.match(/(\d+) planta\(s\) em memória, \d+ migração/) ?? [])[1] ?? NaN)), 'a parte «S1:» da linha final do gate:html em portoes/build.log', 'a mesma linha diz as migrações da base lidas', /migração\(ões\) da base lidas por ordem/.test(linhaS1));
const linhaFormas = buildLog.split('\n').find((l) => l.includes('faixa da União (F19)')) ?? '';
const daFormas = (re) => Number((linhaFormas.match(re) ?? [])[1] ?? NaN);
medicao('marcas_afastadas_nas_faixas_dos_cartoes_pelo_check_formas', ouNao(daFormas(/\((\d+) afastadas na vertical por terem o valor de outras/)), 'a linha final do check:formas em portoes/build.log (F19)', 'a mesma linha conta as etiquetas no title conferidas', Number.isFinite(daFormas(/(\d+) etiquetas no title conferidas/)));
medicao('etiquetas_no_title_conferidas_pelo_check_formas', ouNao(daFormas(/(\d+) etiquetas no title conferidas/)), 'a linha final do check:formas (F19i)', 'a linha final do check:formas existe', linhaFormas.length > 0);
medicao('plantas_das_faixas_dos_cartoes_a_morder', ouNao(daFormas(/(\d+) plantas a morder, \d+ ressalva/)), 'a linha final do check:formas (as plantas da F19)', 'a linha conta as plantas da F20 também', Number.isFinite(daFormas(/ressalva\(s\) da Comissão, (\d+) plantas a morder/)));
medicao('plantas_da_seccao_dos_paises_a_morder', ouNao(daFormas(/ressalva\(s\) da Comissão, (\d+) plantas a morder/)), 'a linha final do check:formas (as plantas da F20)', 'a linha conta as marcas afastadas na secção dos países', Number.isFinite(daFormas(/\((\d+) afastadas na vertical\), /)));
medicao('marcas_afastadas_na_seccao_dos_paises_pelo_check_formas', ouNao(daFormas(/\((\d+) afastadas na vertical\), /)), 'a linha final do check:formas (F20c)', 'a mesma linha conta as faixas da secção', Number.isFinite(daFormas(/secção\(ões\), (\d+) faixa\(s\)/)));
/* A célula da função das sugestões (`tests/sugestoes/funcao.mjs`) não lê a nota: o brief manda as células da caixa
   acompanharem, e as da nota são as do portão de HTML. */
const funcao = fs.readFileSync(path.join(RAIZ, 'tests/sugestoes/funcao.mjs'), 'utf8');
medicao('ocorrencias_da_nota_na_celula_da_funcao', (funcao.match(/\bnota\b|SUGESTOES\.nota/g) ?? []).length, 'grep -c «nota» em tests/sugestoes/funcao.mjs', 'o mesmo detetor acha LIMITES_DAS_SUGESTOES no ficheiro', funcao.includes('LIMITES_DAS_SUGESTOES'));

/* --- o verify:deploy antes de aterrar ---------------------------------------------------------- */
const deploy = (lerTexto('verify-deploy-antes-de-aterrar.log') ?? '').replace(/\u001b\[[0-9;]*m/g, '');
/* Cada problema aparece duas vezes no registo, na linha da conferência e na lista do fim; conta-se pela lista do fim,
   depois da linha que diz quantos são, e confere-se que o número dela é o da lista. */
const resumoDoDeploy = deploy.split('\n');
const inicioDaLista = resumoDoDeploy.findIndex((l) => /NÃO CONFERE . \d+ problema/.test(l));
const ditos = Number((resumoDoDeploy[inicioDaLista]?.match(/(\d+) problema/) ?? [])[1] ?? NaN);
const problemas = inicioDaLista < 0 ? [] : resumoDoDeploy.slice(inicioDaLista + 1).filter((l) => /^\s+✗ /.test(l));
medicao('verify_deploy_antes_de_aterrar_problemas', ouNao(ditos), 'node scripts/verify-deploy.mjs antes de aterrar (verify-deploy-antes-de-aterrar.log, o código em .codigo e a hora em .hora): o número da linha «NÃO CONFERE»', 'a lista do fim tem esse número de linhas, e todas são das duas páginas «Privacidade»', problemas.length === ditos && problemas.every((l) => /\/privacidade|\/en\/privacy/.test(l)));
medicao('respostas_do_ar_sem_set_cookie', deploy.split('\n').filter((l) => /✓ .* sem Set-Cookie/.test(l)).length, 'as conferências «sem Set-Cookie» que passaram no mesmo registo (a primeira página e as duas da privacidade)', 'a mesma leitura vê as que falharam no registo', problemas.length > 0);

/* --- as decisões em vigor e o mapa do repositório ------------------------------------------- */
const decisoes = lerTexto('decisoes-em-vigor-antes.txt') ?? '';
medicao('decisoes_citadas_nos_ficheiros_tocados', ouNao(Number((decisoes.match(/(\d+) decisão\(ões\) citada\(s\)/) ?? [])[1] ?? NaN)), 'python3 scripts/leituras/decisoes-em-vigor.py <os ficheiros que o bloco toca> (decisoes-em-vigor-antes.txt)', 'o conhecido-positivo do guião, a §1.98 lida em scripts/check-lugar.mjs', /conhecido-positivo: a §1\.98 lida/.test(decisoes));
const acerto = lerJson('mapa-acertado.json');
const longeNaBase = (lerTexto('conferir-mapa-base.txt') ?? '').split('\n').filter((l) => /^\s+mapa l\.\d+ «/.test(l)).length;
const longeDepois = (lerTexto('conferir-mapa-depois-do-acerto.txt') ?? '').split('\n').filter((l) => /^\s+mapa l\.\d+ «/.test(l)).length;
const longeDepoisDaEmenda = (lerTexto('conferir-mapa-depois-da-emenda.txt') ?? '').split('\n').filter((l) => /^\s+mapa l\.\d+ «/.test(l)).length;
medicao('citacoes_do_mapa_que_andaram', acerto?.citacoes_que_andaram ?? NAO, `python3 ${PASTA}/acertar-mapa.py (mapa-acertado.json): as citações longe da linha na cabeça do código e não na do brief`, 'as trocas pelo guião e as feitas à mão somam todas as que andaram', (acerto?.trocas?.length ?? 0) + (acerto?.acertadas_a_mao?.length ?? 0) === acerto?.citacoes_que_andaram);
medicao('citacoes_do_mapa_longe_na_base', longeNaBase || NAO, 'python3 scripts/leituras/conferir-mapa.py sobre uma extração do commit do brief (conferir-mapa-base.txt)', 'depois do acerto e depois da emenda das etiquetas, o mapa tem as mesmas', longeDepois === longeNaBase && longeDepoisDaEmenda === longeNaBase && lerTexto('conferir-mapa-depois-da-emenda.codigo')?.trim() === '0');

/* --- o custo ------------------------------------------------------------------------------ */
const ci = lerJson('custo-inicio.json');
const cf = lerJson('custo-fim.json');
medicao('simbolos_pelo_contador', ci && cf ? ci.simbolos_restantes_no_inicio - cf.simbolos_restantes_no_fim : NAO, 'custo-inicio.json menos custo-fim.json (o contador «total_tokens left» que a ferramenta mostra)', 'as duas leituras têm hora', Boolean(ci?.inicio_utc && cf?.fim_utc));
medicao('simbolos_restantes_no_fim', cf?.simbolos_restantes_no_fim ?? NAO, 'custo-fim.json', 'a leitura tem hora', Boolean(cf?.fim_utc));
medicao('segundos_de_parede', ci && cf ? Math.round((Date.parse(cf.fim_utc) - Date.parse(ci.inicio_utc)) / 1000) : NAO, 'a hora de custo-fim.json menos a de custo-inicio.json', 'as duas horas são ISO', Boolean(ci?.inicio_utc?.endsWith('Z') && cf?.fim_utc?.endsWith('Z')));

const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' });
const saida = { bloco: 'H3', guiao: `${PASTA}/medir-h3.mjs`, cabeca_medida: cabeca, arvore_limpa: estado === '', base_do_ramo: BASE, construcao: versao.commit, quantas_medidas: medidas.length, medidas };
fs.writeFileSync(path.join(PASTA, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const falhas = medidas.filter((m) => m.valor === NAO || !m.conhecido_positivo.encontrado);
console.log(`H3 medidas: ${medidas.length}, ${falhas.length} sem valor ou sem o conhecido-positivo.`);
for (const f of falhas) console.log(`  · ${f.nome}: ${JSON.stringify(f.valor)} (${f.conhecido_positivo.o_que})`);
process.exit(falhas.length ? 1 : 0);
