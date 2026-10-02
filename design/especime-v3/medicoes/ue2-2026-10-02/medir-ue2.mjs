/** UE2: as medidas do bloco «a página dos países», para `medidas.json` nesta pasta. Cada medida diz o nome, o valor,
 * o comando que a repete e um conhecido-positivo, que é uma coisa que o MESMO detetor tem de encontrar. Lê o
 * repositório, a construção da cabeça atual (`dist/`), a construção da cabeça de base (a pasta dada, fora do
 * repositório; guarda-se só o commit do `version.json` dela), e os ficheiros que os outros guiões desta pasta escrevem
 * (`capturas-antes.json`, `capturas-depois.json`, `toque.json`, `plantas-portoes-ue2.json`, `portoes/`).
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/ue2-2026-10-02/medir-ue2.mjs <pasta da construção de base>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';

import { FIGURAS, DEFINICOES_DAS_MEDIDAS, textoDaDefinicao, conferirOrigensDeclaradas } from '../../../../src/data/figuras.mjs';
import { faixasDaPaginaDaUniao } from '../../../../src/lib/faixa-da-uniao.mjs';
import { lerSeriesDoPortao, lerPaisesDoPortao } from '../../../../scripts/series-do-portao.mjs';
import { conferirSeccaoDosPaises, plantasDaSeccao, plantaDaTabela, ordemEsperada } from '../../../../tests/uniao/paises.mjs';
import { auditarPerguntas, lerAuditoriaDasPerguntas } from '../../../../tests/cartao/perguntas.mjs';

const PASTA = 'design/especime-v3/medicoes/ue2-2026-10-02';
const BASE = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!BASE) throw new Error('Uso: medir-ue2.mjs <pasta da construção de base>');
const FINAL = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = (d) => JSON.parse(fs.readFileSync(path.join(d, 'version.json'), 'utf8'));
const vBase = versao(BASE);
const vFinal = versao(FINAL);
const ler = (d, f) => fs.readFileSync(path.join(d, f), 'utf8');
const lerJson = (f) => (fs.existsSync(path.join(PASTA, f)) ? JSON.parse(fs.readFileSync(path.join(PASTA, f), 'utf8')) : null);
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const PAGINA = { pt: 'uniao-europeia/index.html', en: 'en/european-union/index.html' };
const LANGS = ['pt', 'en'];

/* O §0 DO BRIEF, lido do ficheiro que o seu guião escreve (`design/observatorio/medidas/BRIEF-UE2.json`), e não
   escrito aqui: os dois números de antes que este guião compara (os países nomeados numa faixa e a altura a 390 px). */
const brief = JSON.parse(fs.readFileSync('design/observatorio/medidas/BRIEF-UE2.json', 'utf8'));
const doBrief = (nome) => brief.medidas.find((m) => m.nome === nome)?.valor ?? null;

const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });

/* ------------------------------------------------------------------ o §0 do brief, reproduzido */
{
  const tmp = path.join(os.tmpdir(), `brief-ue2-${process.pid}.json`);
  execFileSync('python3', ['design/observatorio/medidas/BRIEF-UE2.py'], { env: { ...process.env, OEDP_MEDIDAS_JSON: tmp }, stdio: 'ignore' });
  const hoje = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  fs.rmSync(tmp);
  const valores = Object.fromEntries(hoje.medidas.map((m) => [m.nome, m.valor]));
  medida('secao_0_do_brief_reproduzida', valores, 'python3 design/observatorio/medidas/BRIEF-UE2.py, com OEDP_MEDIDAS_JSON num ficheiro temporário, comparado com BRIEF-UE2.json',
    'os valores de hoje são os do ficheiro do brief, e cada conhecido-positivo do guião foi encontrado',
    JSON.stringify(hoje.medidas) === JSON.stringify(brief.medidas) && hoje.medidas.every((m) => m.conhecido_positivo.encontrado));
  /* O MESMO DETETOR DO §0 SOBRE O FICHEIRO DE HOJE: conta as ocorrências em todo o `figuras.mjs` (comentários e
     excertos incluídos), e por isso sobe com as formas, que escrevem o termo entre parênteses; e não conta
     «consolidada». A medida que diz se um termo ficou sem explicação é a das definições rendidas, abaixo. */
  const fig = fs.readFileSync('src/data/figuras.mjs', 'utf8');
  const raizes = ['nominal unit labour cost', 'deflat', 'economias avançadas', 'advanced economies', 'consolidado', 'consolidated'];
  const n = raizes.reduce((t, r) => t + (fig.match(new RegExp(r, 'gi')) ?? []).length, 0);
  medida('termos_do_brief_no_ficheiro_das_figuras_hoje', n, 'o detetor do §0 (as seis raízes do guião do brief) sobre src/data/figuras.mjs da cabeça',
    'o detetor acha «deflat» no ficheiro', /deflat/i.test(fig));
}

/* ------------------------------------------------------------------ o repositório */
const series = lerSeriesDoPortao();
const paises = lerPaisesDoPortao();
const ficheirosDeSerie = fs.readdirSync('ledger/series').filter((f) => f.endsWith('.yml'));
medida('series_de_paises_no_livro', ficheirosDeSerie.length, 'ls ledger/series/*.yml', 'a da dívida pública é uma delas', ficheirosDeSerie.includes('divida-publica-2025-paises.yml'));
const quadros = FIGURAS.map((f) => f.claim);
const linhasDasSeries = [...series.values()].map((s) => String(s.linha_de_portugal));
medida('series_de_medidas_dos_quadros', linhasDasSeries.filter((l) => quadros.includes(l)).length,
  'as séries cuja linha portuguesa é um dos cartões de FIGURAS (src/data/figuras.mjs)', 'a dívida pública é um cartão dos quadros com série', quadros.includes('divida-publica-2025') && linhasDasSeries.includes('divida-publica-2025'));
medida('series_de_fora_dos_quadros', linhasDasSeries.filter((l) => !quadros.includes(l)).sort(),
  'as séries cuja linha portuguesa não é um cartão de FIGURAS', 'a sobrecarga dos inquilinos a preço de mercado tem série e não é cartão dos quadros', linhasDasSeries.includes('sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025') && !quadros.includes('sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025'));
medida('cartoes_dos_dois_quadros', quadros.length, 'FIGURAS.length em src/data/figuras.mjs', 'a dívida pública é um deles', quadros.includes('divida-publica-2025'));
const ordemDoModelo = faixasDaPaginaDaUniao().map((x) => x.serie);
const ordemDaCelula = ordemEsperada(series).ordem;
medida('ordem_das_faixas', ordemDoModelo, 'faixasDaPaginaDaUniao() (src/lib/faixa-da-uniao.mjs), igual à ordemEsperada() da F20',
  'a primeira faixa é a da dívida pública, e a regra da célula dá a mesma ordem', ordemDoModelo[0] === 'divida-publica-2025-paises' && ordemDoModelo.join() === ordemDaCelula.join());
const comForma = Object.entries(DEFINICOES_DAS_MEDIDAS).filter(([, d]) => /** @type {any} */ (d).uniao).map(([id]) => id);
medida('definicoes_com_a_forma_da_pagina_da_uniao', comForma, 'as entradas de DEFINICOES_DAS_MEDIDAS com «uniao»', 'a do custo unitário do trabalho tem a forma', comForma.includes('custo-unitario-do-trabalho-2025'));

/* A K16 com as formas, e as quatro plantas das formas, em memória (as mesmas do check:cartao --prova). */
const k16 = auditarPerguntas();
{
  const base = lerAuditoriaDasPerguntas();
  const defs = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS);
  const com = (f) => { const c = structuredClone(base); f(c); return c; };
  const daForma = (a, id) => a.perguntas.find((q) => q.id === id && q.forma === 'uniao');
  const plantas = [
    ['a forma sem auditoria', 'custo-unitario-do-trabalho-2025#uniao', 'não tem auditoria', { auditoria: com((a) => { a.perguntas = a.perguntas.filter((q) => !(q.id === 'custo-unitario-do-trabalho-2025' && q.forma === 'uniao')); }) }],
    ['um pedaço da forma sem apoio', 'divida-das-empresas-2025#uniao', 'não tem apoio nenhum', { auditoria: com((a) => { daForma(a, 'divida-das-empresas-2025').pedacos[2].apoios = []; }) }],
    ['a forma mudada sem nova leitura', 'taxa-de-cambio-efectiva-real-2025#uniao', 'os pedaços juntos', { definicoes: { ...defs, 'taxa-de-cambio-efectiva-real-2025': { ...defs['taxa-de-cambio-efectiva-real-2025'], uniao: { ...defs['taxa-de-cambio-efectiva-real-2025'].uniao, pt: ['Quanto mudou em três anos a taxa de câmbio efetiva real?'] } } } }],
    ['a auditoria de uma forma que não existe', 'divida-publica-2025#uniao', 'que não a declara', { auditoria: com((a) => { a.perguntas.push({ ...structuredClone(a.perguntas.find((q) => q.id === 'divida-publica-2025')), forma: 'uniao' }); }) }],
  ];
  const mordidas = plantas.filter(([, alvo, m, entrada]) => auditarPerguntas(entrada).erros.some((e) => e.startsWith(`K16 · ${alvo}:`) && e.includes(m)));
  medida('k16_com_as_formas', { perguntas: k16.contas.perguntas, pedacos: k16.contas.pedacos, apoios: k16.contas.apoios, erros: k16.erros.length, plantas_das_formas: plantas.length, plantas_das_formas_a_morder: mordidas.length },
    'auditarPerguntas() de tests/cartao/perguntas.mjs, e as quatro plantas das formas em memória',
    'a auditoria em vigor passa e as plantas mordem', k16.erros.length === 0 && mordidas.length === plantas.length);
}

/* A GUARDA DAS ORIGENS DA FORMA (`conferirOrigensDeclaradas`, em src/data/figuras.mjs): uma forma que perca uma
   origem da pergunta do cartão, e uma forma que cite uma origem que não existe, fecham a construção. */
{
  const d = structuredClone(/** @type {any} */ (DEFINICOES_DAS_MEDIDAS)['divida-das-empresas-2025']);
  const semUma = { ...d, uniao: { ...d.uniao, origens: d.uniao.origens.filter((o) => o !== 'eurostat-tipspd30') } };
  const inventada = { ...d, uniao: { ...d.uniao, origens: [...d.uniao.origens, 'origem-que-nao-existe'] } };
  const morde = (entrada, texto) => { try { conferirOrigensDeclaradas('planta', { x: entrada }); return false; } catch (e) { return String(e.message).includes(texto); } };
  const plantas = [morde(semUma, 'não cita eurostat-tipspd30'), morde(inventada, 'origem-que-nao-existe')];
  let limpa = true;
  try { conferirOrigensDeclaradas('controlo', { x: d }); } catch { limpa = false; }
  medida('guarda_das_origens_da_forma', { plantas: plantas.length, a_morder: plantas.filter(Boolean).length, controlo_passa: limpa },
    'conferirOrigensDeclaradas() de src/data/figuras.mjs sobre cópias da definição da dívida das empresas',
    'a definição em vigor passa e as duas plantas mordem', limpa && plantas.every(Boolean));
}

/* ------------------------------------------------------------------ as duas construções */
const raiz = (d, lang) => parse(ler(d, PAGINA[lang]));
const porEdicao = (f) => Object.fromEntries(LANGS.map((l) => [l, f(l)]));
const rBase = porEdicao((l) => raiz(BASE, l));
const rFinal = porEdicao((l) => raiz(FINAL, l));
/* O QUE A CONSTRUÇÃO LÊ É O DA CABEÇA: os commits depois dela (o relatório, as medidas, as plantas de `tests/`, os
   códigos dos portões) não mudam nada do que o `dist/` medido é. `tests/` fica de fora porque nenhum ficheiro dele
   entra na construção: são as células e as plantas que a leem. */
const CODIGO = ['src', 'scripts', 'public', 'ledger', 'registos', 'studies-src', 'mapa', 'package.json', 'astro.config.mjs', 'site.config.mjs', 'vercel.json'];
const mudadoDesde = execFileSync('git', ['diff', '--name-only', vFinal.commit, 'HEAD', '--', ...CODIGO], { encoding: 'utf8' }).split('\n').filter(Boolean);
medida('construcoes_medidas', { base: vBase.commit, final: vFinal.commit, cabeca_ao_medir: cabeca, codigo_mudado_desde_a_construcao: mudadoDesde },
  `o version.json de cada construção, e git diff --name-only <final> HEAD -- ${CODIGO.join(' ')}`,
  'a construção final é antepassada da cabeça, e o que a construção lê não mudou desde ela',
  execFileSync('git', ['merge-base', '--is-ancestor', vFinal.commit, 'HEAD']).length === 0 && mudadoDesde.length === 0);

medida('faixas_dos_paises_por_edicao', { antes: porEdicao((l) => rBase[l].querySelectorAll('[data-faixa-paises]').length), depois: porEdicao((l) => rFinal[l].querySelectorAll('[data-faixa-paises]').length) },
  'os [data-faixa-paises] da página da União, nas duas construções', 'o mesmo leitor vê os 21 cartões da fila nas duas construções',
  LANGS.every((l) => rBase[l].querySelectorAll('[data-faixa] li.cartao').length === 21 && rFinal[l].querySelectorAll('[data-faixa] li.cartao').length === 21));

const listas = porEdicao((l) => rFinal[l].querySelectorAll('details[data-lista-paises]'));
medida('listas_dos_27_por_edicao', { listas: porEdicao((l) => listas[l].length), itens_por_lista: [...new Set(LANGS.flatMap((l) => listas[l].map((d) => d.querySelectorAll('li[data-lista-ponto]').length)))], fechadas: porEdicao((l) => listas[l].filter((d) => !d.hasAttribute('open')).length) },
  'os details[data-lista-paises] da página da União construída, e os seus itens', 'Portugal tem um item em cada lista',
  LANGS.every((l) => listas[l].every((d) => d.querySelectorAll('li[data-lista-ponto$="#PT"]').length === 1)));

medida('paises_nomeados_em_cada_faixa', { antes_na_faixa_do_cartao: doBrief('paises_nomeados_em_cada_faixa_hoje'), depois_na_lista: [...new Set(LANGS.flatMap((l) => listas[l].map((d) => new Set(d.querySelectorAll('[data-pais]').map((e) => e.getAttribute('data-pais'))).size)))] },
  'os países distintos com nome (data-pais) em cada lista dobrada; antes, o §0 do brief (o mais baixo e o mais alto)', 'Portugal está nomeado em cada lista',
  LANGS.every((l) => listas[l].every((d) => d.querySelector('[data-pais="PT"]'))));

const etiquetas = porEdicao((l) => rFinal[l].querySelectorAll('[data-toque-de]'));
medida('etiquetas_do_toque_por_edicao', { etiquetas: porEdicao((l) => etiquetas[l].length), escondidas: porEdicao((l) => etiquetas[l].filter((e) => e.hasAttribute('hidden')).length), de_empates: porEdicao((l) => etiquetas[l].filter((e) => e.querySelectorAll('[data-ponto]').length > 1).length) },
  'os [data-toque-de] da página da União construída, os que têm hidden e os que dizem mais de um ponto', 'cada etiqueta traz o valor de um ponto da série',
  LANGS.every((l) => etiquetas[l].every((e) => e.querySelector('[data-ponto]'))));

medida('ressalva_da_comissao_na_seccao', porEdicao((l) => rFinal[l].querySelectorAll('[data-faixa-paises] [data-ressalva-da-uniao]').map((e) => e.getAttribute('data-ressalva-da-uniao'))),
  'os [data-ressalva-da-uniao] dentro das faixas dos países', 'a ressalva está na faixa da sobrecarga do custo da habitação',
  LANGS.every((l) => rFinal[l].querySelector('[data-faixa-paises="sobrecarga-do-custo-da-habitacao-2025-paises"] [data-ressalva-da-uniao]')));

/* OS QUATRO TERMOS NAS DEFINIÇÕES DOBRADAS (o §0 do brief e o item 3): as ocorrências no texto das 21 definições da
   página, e quantas estão fora de parênteses, que é onde um termo fica sem a explicação ao lado. As raízes do §0, com
   a do «consolidado» alargada às duas formas do português («consolidad»), porque «dívida consolidada» também é o
   termo; e a forma portuguesa do primeiro termo («índice nominal do custo unitário do trabalho»). */
const TERMOS = [/nominal unit labour cost|índice nominal do custo unitário do trabalho/gi, /deflat/gi, /economias avançadas|advanced economies/gi, /consolidad|consolidated/gi];
const foraDeParenteses = (texto, i) => {
  let fundo = 0;
  for (let k = 0; k < i; k++) { if (texto[k] === '(') fundo++; else if (texto[k] === ')') fundo = Math.max(0, fundo - 1); }
  return fundo === 0;
};
const contarTermos = (r) => {
  let total = 0;
  let fora = 0;
  for (const d of r.querySelectorAll('.dobra-definicao')) {
    const t = norm(d.text);
    for (const re of TERMOS) for (const m of t.matchAll(re)) { total++; if (foraDeParenteses(t, m.index)) fora++; }
  }
  return { definicoes: r.querySelectorAll('.dobra-definicao').length, ocorrencias: total, fora_de_parenteses: fora };
};
const termosAntes = porEdicao((l) => contarTermos(rBase[l]));
const termosDepois = porEdicao((l) => contarTermos(rFinal[l]));
medida('termos_tecnicos_nas_definicoes_da_pagina', { antes: termosAntes, depois: termosDepois },
  'as ocorrências das quatro raízes no texto das .dobra-definicao da página da União, e as que estão fora de parênteses',
  'o detetor acha «deflat» nas definições da construção de base', LANGS.every((l) => rBase[l].querySelectorAll('.dobra-definicao').some((d) => /deflat/i.test(d.text))));

/* A forma rendida: as sete definições da página são a forma da União, e não a pergunta do cartão. */
const formasRendidas = porEdicao((l) => comForma.filter((id) => {
  const dobra = rFinal[l].querySelector(`[data-leitura="${id}"] .dobra-definicao`);
  return dobra && norm(dobra.text) === norm(textoDaDefinicao(/** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[id].uniao[l]));
}).length);
medida('definicoes_na_forma_da_uniao_rendidas', formasRendidas, 'a .dobra-definicao de cada medida com a forma, comparada com textoDaDefinicao(uniao)',
  'na construção de base a mesma dobra rende a pergunta do cartão, e o detetor vê a diferença',
  LANGS.every((l) => comForma.every((id) => norm(rBase[l].querySelector(`[data-leitura="${id}"] .dobra-definicao`)?.text) === norm(textoDaDefinicao(/** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[id][l])))));

/* O §4 DO BRIEF: nenhuma mudança nas páginas de assunto. O `<main>` de cada uma das sete, nas duas edições, igual
   byte a byte nas duas construções; o conhecido-positivo é a página da União, onde o mesmo detetor vê a diferença. */
const ASSUNTOS = ['precos', 'salarios-pensoes-e-apoios', 'pobreza-e-desigualdade', 'emprego', 'habitacao', 'educacao-e-saude', 'estado-e-economia'];
const ASSUNTOS_EN = ['prices', 'pay-pensions-and-benefits', 'poverty-and-inequality', 'employment', 'housing', 'education-and-health', 'state-and-economy'];
const mainDe = (d, f) => parse(ler(d, f)).querySelector('main')?.innerHTML ?? null;
const paginasDeAssunto = [...ASSUNTOS.map((a) => `${a}/index.html`), ...ASSUNTOS_EN.map((a) => `en/${a}/index.html`)];
const diferentes = paginasDeAssunto.filter((f) => mainDe(BASE, f) !== mainDe(FINAL, f));
medida('paginas_de_assunto_com_o_main_mudado', { paginas: paginasDeAssunto.length, mudadas: diferentes },
  'o innerHTML do <main> das sete páginas de assunto nas duas edições, comparado entre as duas construções',
  'o mesmo detetor vê a página da União mudada', mainDe(BASE, PAGINA.pt) !== mainDe(FINAL, PAGINA.pt));

/* AS PERGUNTAS DAS SETE MEDIDAS COM A FORMA, NAS PÁGINAS DE ASSUNTO DA CONSTRUÇÃO DE BASE: onde a dobra do cartão
   nacional as rende (`data-cartao-definicao`). É o que a forma da página da União evita mudar (o §4 do brief). */
{
  const onde = Object.fromEntries(comForma.map((id) => [id, paginasDeAssunto.filter((f) => ler(BASE, f).includes(`data-cartao-definicao="${id}"`))]));
  const pt = [...new Set(Object.values(onde).flat().filter((f) => !f.startsWith('en/')))];
  const en = [...new Set(Object.values(onde).flat().filter((f) => f.startsWith('en/')))];
  medida('perguntas_das_formas_nas_paginas_de_assunto', { onde, paginas_pt: pt.length, paginas_en: en.length },
    'as páginas de assunto da construção de base onde aparece data-cartao-definicao="<medida>", para cada uma das medidas com a forma',
    'a pergunta do custo unitário do trabalho rende-se na página do emprego', (onde['custo-unitario-do-trabalho-2025'] ?? []).includes('emprego/index.html'));
}

/* A F20 sobre a construção final, e as suas plantas. */
{
  const ctx = { series, paises };
  let erros = 0;
  let plantas = 0;
  let mordidas = 0;
  const contas = {};
  for (const l of LANGS) {
    const html = ler(FINAL, PAGINA[l]);
    const r = conferirSeccaoDosPaises(parse(html), l, `/${PAGINA[l]}`, ctx);
    erros += r.erros.length;
    contas[l] = r.contas;
    for (const p of plantasDaSeccao(html, l, `/${PAGINA[l]}`, ctx)) { plantas++; if (p.passou) mordidas++; }
  }
  const tabela = plantaDaTabela();
  plantas++;
  if (tabela.passou) mordidas++;
  medida('f20_sobre_a_construcao_final', { erros, plantas, plantas_a_morder: mordidas, contas },
    'conferirSeccaoDosPaises() e plantasDaSeccao() de tests/uniao/paises.mjs sobre as duas edições, e plantaDaTabela()',
    'as plantas mordem, e a página intacta passa', erros === 0 && plantas === mordidas && plantas > 0);
}

/* ------------------------------------------------------------------ as capturas, o toque e as plantas do portão */
const capAntes = lerJson('capturas-antes.json');
const capDepois = lerJson('capturas-depois.json');
const alturaA390 = (m) => (m ? porEdicao((l) => m.resultados.find((x) => x.tipo === 'pagina' && x.lang === l && x.largura === 390)?.medidas.altura ?? null) : null);
medida('altura_da_pagina_a_390', { antes: alturaA390(capAntes), depois: alturaA390(capDepois), antes_no_brief: doBrief('altura_da_pagina_da_uniao_a_390_depois_do_k2') },
  'a altura do documento a 390 px, medida pelo captor (capturas-antes.json e capturas-depois.json)', 'a captura de base a 390 px mede o que o §0 do brief mediu na do K2',
  alturaA390(capAntes)?.pt === doBrief('altura_da_pagina_da_uniao_a_390_depois_do_k2'));
const filaA390 = (m) => (m ? porEdicao((l) => m.resultados.find((x) => x.tipo === 'pagina' && x.lang === l && x.largura === 390)?.medidas.fila ?? null) : null);
medida('fila_dos_cartoes_a_390', { antes: filaA390(capAntes), depois: filaA390(capDepois) },
  'a forma da fila dos 21 cartões a 390 px, medida pelo captor', 'o captor vê os 21 cartões nas duas construções',
  [filaA390(capAntes), filaA390(capDepois)].every((f) => f && LANGS.every((l) => f[l]?.cartoes === 21)));
medida('capturas', { antes: capAntes?.capturas ?? null, depois: capDepois?.capturas ?? null, problemas: (capAntes?.problemas.length ?? 0) + (capDepois?.problemas.length ?? 0), pedidos_para_fora: (capAntes?.pedidos_recusados_para_fora ?? 0) + (capDepois?.pedidos_recusados_para_fora ?? 0), transbordo: [capAntes, capDepois].flatMap((m) => m?.resultados ?? []).filter((x) => x.tipo === 'pagina' && x.medidas.documento > x.largura + 1).length },
  'os manifestos das capturas', 'há uma captura da página da União a 390 px depois do bloco',
  capDepois?.resultados.some((x) => x.tipo === 'pagina' && x.largura === 390));
const toque = lerJson('toque.json');
medida('prova_do_toque', toque ? porEdicao((l) => ({
  toques_ao_dedo: toque.edicoes[l].dedo.length,
  certos: toque.edicoes[l].dedo.filter((x) => x.certo).length,
  etiquetas_a_vista_depois_de_um_toque_fora: toque.edicoes[l].toque_fora.etiquetas_a_vista,
  rato: toque.edicoes[l].rato.visivel_ao_pousar && toque.edicoes[l].rato.visiveis_ao_sair === 0,
  sem_guiao: toque.edicoes[l].sem_guiao,
})) : null,
  'toque-ue2.mjs, no Chromium sem cabeça, sobre a construção final', 'antes de cada toque a etiqueta da marca estava escondida, e o detetor viu-a aparecer',
  toque && LANGS.every((l) => toque.edicoes[l].dedo.every((x) => x.escondida_antes) && toque.edicoes[l].dedo.some((x) => x.certo)));
const plantasPortao = lerJson('plantas-portoes-ue2.json');
medida('plantas_do_portao_de_html', plantasPortao ? { plantas: plantasPortao.length, a_morder: plantasPortao.filter((p) => p.passou).length, codigos: [...new Set(plantasPortao.map((p) => p.codigo))], bytes_repostos: plantasPortao.every((p) => p.ficheiros.every((f) => f.antes === f.reposto)) } : null,
  'node tests/pais/portoes.mjs --prefixo ue2- (OEDP_MEDICOES nesta pasta), plantas-portoes-ue2.json', 'cada planta saiu com o código 1 e as mordidas previstas',
  plantasPortao?.every((p) => p.codigo === 1));

/* Os portões da corrida final, quando já correram (portoes/). */
const P = path.join(PASTA, 'portoes');
if (fs.existsSync(path.join(P, 'cabeca'))) {
  const cod = (g) => Number(fs.readFileSync(path.join(P, `${g}.codigo`), 'utf8').trim());
  const seg = (g) => Math.round((Date.parse(fs.readFileSync(path.join(P, `${g}.fim`), 'utf8').trim()) - Date.parse(fs.readFileSync(path.join(P, `${g}.inicio`), 'utf8').trim())) / 1000);
  const c = fs.readFileSync(path.join(P, 'cabeca'), 'utf8').trim();
  medida('portoes_a_zero', { cabeca: c.slice(0, 8), build: cod('build'), verify: cod('verify'), typecheck: cod('typecheck'), segundos: { build: seg('build'), verify: seg('verify'), typecheck: seg('typecheck') }, cabeca_igual_no_fim: c === fs.readFileSync(path.join(P, 'cabeca.fim'), 'utf8').trim() },
    'sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ue2-2026-10-02/portoes; cada código lido de portoes/<portão>.codigo',
    'o registo do build diz a F20 da secção dos países', fs.readFileSync(path.join(P, 'build.log'), 'utf8').includes('secção dos países (F20)'));
}

/* A F19, a F20, a K16, a K18 e a K19 na corrida final, lidas dos registos dela (portoes/build.log e verify.log). */
if (fs.existsSync(path.join(P, 'verify.log'))) {
  const semCor = (t) => t.replace(/\x1b\[[0-9;]*m/g, '');
  const build = semCor(fs.readFileSync(path.join(P, 'build.log'), 'utf8'));
  const verify = semCor(fs.readFileSync(path.join(P, 'verify.log'), 'utf8'));
  const n = (re, t) => { const m = re.exec(t); return m ? m.slice(1).map(Number) : null; };
  const f19 = n(/faixa da União \(F19\): (\d+) faixa\(s\), (\d+) nos assuntos, (\d+) marcas refeitas do valor, (\d+) frases recompostas \((\d+) com empate\), (\d+) plantas a morder/, build);
  const f20 = n(/secção dos países \(F20\): (\d+) secção\(ões\), (\d+) faixa\(s\), (\d+) marcas refeitas do valor, (\d+) etiquetas do toque, (\d+) listas com (\d+) itens, (\d+) ressalva\(s\) da Comissão, (\d+) plantas a morder/, build);
  const k19 = n(/a ordem do cartão \(K19\): cartões, com dobra, da faixa\s+(\d+) · (\d+) · (\d+) · (\d+) de (\d+) plantas a morder/, verify.replace(/(\d) (\d{3})/g, '$1$2'));
  const k18 = n(/faixas refeitas dos pontos \(K18\)\s+(\d+) · (\d+) planta/, verify);
  const k16 = n(/perguntas com cada pedaço apoiado \(K16\)\s+(\d+) \((\d+) pedaços, (\d+) apoios/, verify);
  medida('celulas_na_corrida_final', {
    f19: f19 && { faixas: f19[0], nos_assuntos: f19[1], marcas: f19[2], frases: f19[3], com_empate: f19[4], plantas_a_morder: f19[5] },
    f20: f20 && { seccoes: f20[0], faixas: f20[1], marcas: f20[2], etiquetas: f20[3], listas: f20[4], itens: f20[5], ressalvas: f20[6], plantas_a_morder: f20[7] },
    k19: k19 && { cartoes: k19[0], com_dobra: k19[1], da_faixa_da_uniao: k19[2], plantas_a_morder: k19[3], plantas: k19[4] },
    k18: k18 && { faixas: k18[0], plantas_a_morder: k18[1] },
    k16: k16 && { perguntas: k16[0], pedacos: k16[1], apoios: k16[2] },
  }, 'as linhas do check:formas em portoes/build.log e as do check:cartao em portoes/verify.log, sem as cores',
  'as cinco linhas foram lidas, e a K19 conta os 21 cartões da faixa da União em cada edição', Boolean(f19 && f20 && k19 && k18 && k16 && k19[2] === 42));
}

/* As decisões citadas nos ficheiros que o bloco tocou, da última linha do guião das decisões em vigor. */
{
  const txt = fs.existsSync(path.join(PASTA, 'decisoes-em-vigor-depois.txt')) ? fs.readFileSync(path.join(PASTA, 'decisoes-em-vigor-depois.txt'), 'utf8') : '';
  const m = /(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\)/.exec(txt);
  medida('decisoes_citadas_nos_ficheiros_tocados', m ? { decisoes: Number(m[1]), ficheiros: Number(m[2]) } : null,
    'xargs python3 scripts/leituras/decisoes-em-vigor.py < ficheiros-tocados.txt > decisoes-em-vigor-depois.txt',
    'a §1.140 está entre as citadas', txt.includes('§1.140 ·'));
}

/* O custo, das duas leituras do contador, quando a segunda já está escrita. */
const ci = lerJson('custo-inicio.json');
const cf = lerJson('custo-fim.json');
if (ci && cf) {
  medida('simbolos_gastos_ate_ao_relatorio', ci.simbolos_restantes_no_inicio - cf.simbolos_restantes_no_fim, 'custo-inicio.json menos custo-fim.json (o contador «total_tokens left»)', 'o contador desceu', cf.simbolos_restantes_no_fim < ci.simbolos_restantes_no_inicio);
  medida('segundos_ate_ao_relatorio', Math.round((Date.parse(cf.fim_utc) - Date.parse(ci.inicio_utc)) / 1000), 'fim_utc de custo-fim.json menos inicio_utc de custo-inicio.json', 'a hora do fim é depois da do início', Date.parse(cf.fim_utc) > Date.parse(ci.inicio_utc));
}

const saida = { bloco: 'UE2', guiao: `${PASTA}/medir-ue2.mjs`, cabeca_ao_medir: cabeca, medido_em: new Date().toISOString(), medidas };
fs.writeFileSync(path.join(PASTA, 'medidas.json'), JSON.stringify(saida, null, 2) + '\n');
const semPositivo = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
console.log(`UE2: ${medidas.length} medidas escritas em medidas.json; ${semPositivo.length ? `SEM o conhecido-positivo: ${semPositivo.join(', ')}` : 'todas com o conhecido-positivo encontrado'}.`);
process.exitCode = semPositivo.length ? 1 : 0;
