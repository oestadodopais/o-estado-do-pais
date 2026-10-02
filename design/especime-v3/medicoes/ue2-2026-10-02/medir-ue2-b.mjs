/** UE2-b: as medidas da passagem, para `medidas-ue2-b.json` nesta pasta. Cada medida diz o nome, o valor, o comando
 * que a repete e um conhecido-positivo, uma coisa que o MESMO detetor tem de encontrar. Lê o repositório, a construção
 * da cabeça atual (`dist/`), a construção de base (a pasta dada, fora do repositório: a da cabeça do UE2, de que se
 * guarda só o commit do `version.json`), as declarações da cabeça de base (`git show <commit>:src/data/figuras.mjs`,
 * escrita por um momento ao lado do módulo, para que os imports relativos resolvam, e apagada logo a seguir) e os
 * ficheiros que os outros guiões desta pasta escrevem (`origens-ue2-b.json`, `capturas-ue2-b.json`,
 * `plantas-ue2-b/plantas-portoes-ue2.json`, `portoes/ue2-b/`, `custo-inicio-ue2-b.json`, `custo-fim-ue2-b.json`).
 *
 * Uso, da raiz da worktree:
 *   node design/especime-v3/medicoes/ue2-2026-10-02/medir-ue2-b.mjs <pasta da construção de base>
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';

import { DEFINICOES_DAS_MEDIDAS, textoDaDefinicao } from '../../../../src/data/figuras.mjs';
import { t } from '../../../../src/i18n/strings.mjs';
import { lerSeriesDoPortao, lerPaisesDoPortao } from '../../../../scripts/series-do-portao.mjs';
import { conferirSeccaoDosPaises, plantasDaSeccao, plantaDaTabela, conferirTabelaDaSeccao } from '../../../../tests/uniao/paises.mjs';
import { auditarPerguntas, lerAuditoriaDasPerguntas } from '../../../../tests/cartao/perguntas.mjs';
import { MEDIDAS_FORA_DOS_QUADROS } from '../../../../src/data/faixa-da-uniao.mjs';

const PASTA = 'design/especime-v3/medicoes/ue2-2026-10-02';
const BASE = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!BASE) throw new Error('Uso: medir-ue2-b.mjs <pasta da construção de base>');
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

const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });

/* ------------------------------------------------------------------ as declarações de antes e de agora */
const temporario = 'src/data/.figuras-base-medir-ue2-b.mjs';
fs.writeFileSync(temporario, execFileSync('git', ['show', `${vBase.commit}:src/data/figuras.mjs`], { encoding: 'utf8' }));
let ANTES;
try {
  ANTES = (await import(`../../../../${temporario}`)).DEFINICOES_DAS_MEDIDAS;
} finally {
  fs.rmSync(temporario);
}
{
  const formas = (defs) => Object.entries(defs).filter(([, d]) => d && d.uniao).map(([id]) => id);
  const antes = formas(ANTES);
  const agora = formas(DEFINICOES_DAS_MEDIDAS);
  medida('formas_uniao_declaradas', { antes: antes.length, agora: agora.length, antes_ids: antes },
    `as entradas de DEFINICOES_DAS_MEDIDAS com a chave «uniao», no módulo da cabeça e no de ${vBase.commit.slice(0, 8)} (git show)`,
    'o mesmo detetor acha as formas do UE2 na declaração de base, entre elas a do custo unitário do trabalho', antes.includes('custo-unitario-do-trabalho-2025'));
  const mudadas = Object.keys(DEFINICOES_DAS_MEDIDAS).filter((id) => {
    const a = ANTES[id];
    const d = /** @type {any} */ (DEFINICOES_DAS_MEDIDAS)[id];
    return !a || LANGS.some((l) => textoDaDefinicao(a[l]) !== textoDaDefinicao(d[l]));
  });
  medida('perguntas_mudadas', { quantas: mudadas.length, ids: mudadas },
    'as entradas de DEFINICOES_DAS_MEDIDAS cujo texto (textoDaDefinicao, pt ou en) é diferente do da declaração de base',
    'o detetor acha a dívida pública entre as mudadas e não acha a taxa de emprego, que não mudou',
    mudadas.includes('divida-publica-2025') && !mudadas.includes('taxa-de-emprego-2025'));
}

/* ------------------------------------------------------------------ os termos, na primeira vez, entre parênteses */
const TERMOS = {
  pib: [/\bPIB\b/, /\bGDP\b/],
  ativos_e_passivos: [/ativos financeiros e (?:os )?passivos/, /financial assets and liabilities/],
  balanca_corrente: [/balança corrente/, /current account balance/],
  media_movel: [/média móvel/, /moving average/],
  ocde: [/\bOCDE\b/, /\bOECD\b/],
  populacao_ativa: [/população ativa/, /labour force/],
  pontos_percentuais: [/pontos percentuais/, /percentage points/],
  privacao_material_e_social_grave: [/privação material e social grave/, /severe material and social deprivation|severely materially and socially deprived/],
  intensidade_de_trabalho: [/intensidade de trabalho muito baixa/, /very low work intensity/],
  risco_de_pobreza: [/risco de pobreza/, /at risk of poverty/],
  rendimento_disponivel: [/rendimento disponível/, /disposable income/],
  economias_avancadas: [/economias avançadas/, /advanced economies/],
  consolidado: [/consolidad/, /consolidated/],
  deflatores: [/deflatores/, /deflators/],
  custo_unitario: [/custo unitário do trabalho/, /unit labour cost/],
};
/** As definições que a página da União rende: a de cada cartão (`[data-leitura] .dobra-definicao`) e a de cada faixa. */
const definicoesDaPagina = (html) => {
  const r = parse(html);
  return [
    ...r.querySelectorAll('[data-leitura]').map((d) => ({ onde: `cartao:${d.getAttribute('data-leitura')}`, texto: norm(d.querySelector('.dobra-definicao')?.text) })),
    ...r.querySelectorAll('[data-faixa-o-que-conta]').map((d) => ({ onde: `faixa:${d.getAttribute('data-faixa-o-que-conta')}`, texto: norm(d.text) })),
  ].filter((x) => x.texto);
};
/** Quantas definições têm o termo, e em quantas a primeira vez está dentro de parênteses (a explicação vem antes). */
const contarTermos = (dist) => {
  const out = {};
  for (const [lang, i] of [['pt', 0], ['en', 1]]) {
    const defs = definicoesDaPagina(ler(dist, PAGINA[lang]));
    for (const [termo, res] of Object.entries(TERMOS)) {
      const com = defs.filter((d) => res[i].test(d.texto));
      const fora = com.filter((d) => {
        const k = d.texto.search(res[i]);
        const antes = d.texto.slice(0, k);
        return (antes.match(/\(/g) ?? []).length <= (antes.match(/\)/g) ?? []).length;
      });
      out[termo] ??= {};
      out[termo][lang] = { definicoes_com_o_termo: com.length, fora_de_parenteses_na_primeira_vez: fora.map((d) => d.onde) };
    }
  }
  return out;
};
{
  const agora = contarTermos(FINAL);
  const antes = contarTermos(BASE);
  const foraAgora = Object.values(agora).reduce((n, x) => n + x.pt.fora_de_parenteses_na_primeira_vez.length + x.en.fora_de_parenteses_na_primeira_vez.length, 0);
  medida('termos_na_primeira_vez_entre_parenteses', { fora_agora: foraAgora, agora, antes },
    'cada definição da página da União (a do cartão e a da faixa), nas duas edições: a primeira vez de cada termo, com mais «(» do que «)» antes dela',
    'o mesmo detetor acha, na construção de base, o PIB fora de parênteses na pergunta da dívida pública',
    antes.pib.pt.fora_de_parenteses_na_primeira_vez.includes('cartao:divida-publica-2025'));
  const velho = /líquido de subsídios à habitação|net of housing allowances/;
  const contarVelho = (dist) => LANGS.reduce((n, l) => n + definicoesDaPagina(ler(dist, PAGINA[l])).filter((d) => velho.test(d.texto)).length, 0);
  medida('apoios_a_habitacao_em_palavras_comuns', { definicoes_com_o_termo_antigo_agora: contarVelho(FINAL), antes: contarVelho(BASE) },
    'as definições da página da União com «líquido de subsídios à habitação» ou «net of housing allowances», nas duas edições',
    'o mesmo detetor acha o termo antigo na construção de base', contarVelho(BASE) > 0);
}

/* ------------------------------------------------------------------ as páginas de assunto */
{
  const ASSUNTOS = ['precos', 'salarios-pensoes-e-apoios', 'pobreza-e-desigualdade', 'emprego', 'habitacao', 'educacao-e-saude', 'estado-e-economia'];
  const ASSUNTOS_EN = ['prices', 'pay-pensions-and-benefits', 'poverty-and-inequality', 'employment', 'housing', 'education-and-health', 'state-and-economy'];
  const paginas = [...ASSUNTOS.map((a) => `${a}/index.html`), ...ASSUNTOS_EN.map((a) => `en/${a}/index.html`)];
  /** O `<main>` com o texto de cada pergunta de cartão trocado pelo id da medida: o que sobra é o resto da página. */
  const semAsPerguntas = (r) => {
    for (const d of r.querySelectorAll('[data-cartao-definicao]')) d.set_content(d.getAttribute('data-cartao-definicao') ?? '');
    return r.querySelector('main')?.innerHTML ?? '';
  };
  const mudadas = [];
  for (const p of paginas) {
    const a = parse(ler(BASE, p));
    const b = parse(ler(FINAL, p));
    if ((a.querySelector('main')?.innerHTML ?? '') === (b.querySelector('main')?.innerHTML ?? '')) continue;
    const perguntaDe = (r) => new Map(r.querySelectorAll('[data-cartao-definicao]').map((d) => [d.getAttribute('data-cartao-definicao'), norm(d.text)]));
    const pa = perguntaDe(a);
    const pb = perguntaDe(b);
    const ids = [...new Set([...pa.keys(), ...pb.keys()])].filter((id) => pa.get(id) !== pb.get(id));
    mudadas.push({ pagina: p, perguntas_mudadas: ids, so_as_perguntas: semAsPerguntas(a) === semAsPerguntas(b) });
  }
  const daUniao = LANGS.map((l) => (parse(ler(BASE, PAGINA[l])).querySelector('main')?.innerHTML ?? '') !== (parse(ler(FINAL, PAGINA[l])).querySelector('main')?.innerHTML ?? ''));
  medida('paginas_de_assunto_com_o_main_mudado', { paginas: paginas.length, mudadas: mudadas.length, sem_mudanca: paginas.length - mudadas.length, porque: mudadas },
    'o innerHTML do <main> das sete páginas de assunto nas duas edições, comparado entre as duas construções; numa página mudada, as perguntas dos cartões (data-cartao-definicao) que mudaram de texto, e se o <main> é igual com o texto delas trocado pelo id',
    'o mesmo detetor vê o <main> da página da União mudado nas duas edições', daUniao.every(Boolean));
}

/* ------------------------------------------------------------------ as faixas dos países */
const series = lerSeriesDoPortao();
const paises = lerPaisesDoPortao();
const ctx = { series, paises };
{
  const contas = {};
  const erros = [];
  const textos = {};
  for (const l of LANGS) {
    const r = conferirSeccaoDosPaises(parse(ler(FINAL, PAGINA[l])), l, `/${PAGINA[l]}`, ctx);
    contas[l] = r.contas.definicoes;
    erros.push(...r.erros);
    const raiz = parse(ler(FINAL, PAGINA[l]));
    textos[l] = Object.fromEntries(raiz.querySelectorAll('[data-faixa-o-que-conta]').map((d) => [d.getAttribute('data-faixa-o-que-conta'), norm(d.text)]));
  }
  const tres = {
    inquilinos: LANGS.map((l) => textos[l]['sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises'] ?? null),
    inflacao: LANGS.map((l) => textos[l]['ihpc-variacao-homologa-paises'] ?? null),
    emprego: LANGS.map((l) => textos[l]['taxa-de-emprego-2025-paises'] ?? null),
  };
  const dizem = {
    inquilinos: /inquilinos a preço de mercado/.test(tres.inquilinos[0] ?? '') && /40 %/.test(tres.inquilinos[0] ?? '') && /tenants at market rent/.test(tres.inquilinos[1] ?? '') && /40 %/.test(tres.inquilinos[1] ?? ''),
    inflacao: /face ao mesmo mês do ano anterior/.test(tres.inflacao[0] ?? '') && /same month a year earlier/.test(tres.inflacao[1] ?? ''),
    emprego: /dos 20 aos 64 anos/.test(tres.emprego[0] ?? '') && /aged 20 to 64/.test(tres.emprego[1] ?? ''),
  };
  const naBase = LANGS.map((l) => parse(ler(BASE, PAGINA[l])).querySelectorAll('[data-faixa-o-que-conta]').length);
  const faixasNaBase = LANGS.map((l) => parse(ler(BASE, PAGINA[l])).querySelectorAll('[data-faixa-paises]').length);
  medida('faixas_que_dizem_o_que_a_medida_conta', { por_edicao: contas, erros_da_f20: erros.length, as_tres_do_achado_7: tres, dizem_a_populacao_e_a_base: dizem, na_construcao_de_base: naBase },
    'conferirSeccaoDosPaises() de tests/uniao/paises.mjs sobre as duas edições (a conta F20g «definicoes»), e o texto de [data-faixa-o-que-conta] das três faixas que o achado 7 nomeia',
    'na construção de base o mesmo seletor acha as dez faixas de cada edição e nenhuma definição nelas',
    faixasNaBase.every((n) => n === 10) && naBase.every((n) => n === 0));

  let plantas = 0;
  let mordidas = 0;
  const novas = [];
  for (const l of LANGS) {
    for (const p of plantasDaSeccao(ler(FINAL, PAGINA[l]), l, `/${PAGINA[l]}`, ctx)) {
      plantas++;
      if (p.passou) mordidas++;
      if (/definição|pergunta do cartão/.test(p.nome)) novas.push({ lang: l, nome: p.nome, passou: p.passou });
    }
  }
  const tabela = plantaDaTabela(series);
  const intacta = conferirTabelaDaSeccao();
  medida('plantas_da_f20', { plantas, mordidas, as_da_definicao: novas, planta_da_tabela: tabela, tabela_intacta_erros: intacta.length },
    'plantasDaSeccao() nas duas edições e plantaDaTabela(series) de tests/uniao/paises.mjs, e conferirTabelaDaSeccao() sobre a tabela da vista',
    'a tabela intacta passa, e a mesma célula recusa a tabela da vista com as entradas todas no fim (a planta de antes)',
    intacta.length === 0 && conferirTabelaDaSeccao(Object.fromEntries(Object.entries(MEDIDAS_FORA_DOS_QUADROS).map(([k, r]) => [k, { ...r, depoisDe: null }]))).length > 0);
}

/* ------------------------------------------------------------------ a K16 e o guião da auditoria */
{
  const k16 = auditarPerguntas();
  const confere = spawnSync(process.execPath, [`${PASTA}/auditoria-das-perguntas.mjs`, '--confere'], { encoding: 'utf8' });
  const base = lerAuditoriaDasPerguntas();
  const estragada = structuredClone(base);
  estragada.perguntas.find((q) => q.id === 'divida-publica-2025').pedacos[1].apoios[0].literal = 'GDP measures the value of total output';
  const planta = auditarPerguntas({ auditoria: estragada }).erros.filter((e) => e.startsWith('K16 · divida-publica-2025:'));
  medida('k16', { erros: k16.erros.length, contas: k16.contas, formas_na_auditoria: base.perguntas.filter((q) => q.forma).length, guiao_confere_codigo: confere.status, guiao_confere_saida: norm(confere.stdout) },
    `auditarPerguntas() de tests/cartao/perguntas.mjs, e node ${PASTA}/auditoria-das-perguntas.mjs --confere`,
    'a mesma auditoria recusa um literal que o campo não tem no pedaço do PIB da dívida pública', planta.some((e) => e.includes('que não está no campo')));
}

/* ------------------------------------------------------------------ a descrição da página */
{
  const descricoes = (dist) => Object.fromEntries(LANGS.map((l) => {
    const r = parse(ler(dist, PAGINA[l]));
    return [l, { description: r.querySelector('meta[name="description"]')?.getAttribute('content') ?? null, og: r.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? null }];
  }));
  const agora = descricoes(FINAL);
  const antes = descricoes(BASE);
  const dizOsPaises = (d) => /países/.test(d.pt.description ?? '') && /countries/.test(d.en.description ?? '');
  medida('descricao_da_pagina_da_uniao', {
    agora,
    igual_a_declarada: LANGS.every((l) => agora[l].description === t(l).uniaoEuropeia.metaDescription && agora[l].og === t(l).uniaoEuropeia.metaDescription),
    diz_os_paises: dizOsPaises(agora),
    algarismos: LANGS.some((l) => /\d/.test(agora[l].description ?? '')),
  }, 'meta[name="description"] e meta[property="og:description"] das duas edições da página da União construída, contra strings.mjs',
  'na construção de base o mesmo detetor lê as duas descrições e não acha os países nelas', Boolean(antes.pt.description) && !dizOsPaises(antes));
}

/* ------------------------------------------------------------------ as origens, o inventário e as plantas dos portões */
{
  const o = lerJson('origens-ue2-b.json');
  medida('origens_novas', o && { origens: o.origens.map((x) => x.origem), erros: o.erros.length },
    `python3 ${PASTA}/origens-ue2-b.py <raiz do motor> (origens-ue2-b.json)`,
    'o detetor do guião acha o excerto da origem irmã no mesmo campo de cada ficheiro, e não acha uma cadeia inventada',
    o && o.origens.every((x) => x.conhecido_positivo_encontrado && !x.cadeia_inventada_encontrada));

  const linhas = fs.readFileSync('design/especime-v3/INVENTARIO-FRASES.md', 'utf8').split('\n').filter((l) => l.startsWith('| ')).map((l) => l.slice(1, -1).split('|').map((c) => c.trim()));
  const doBloco = (b, e) => linhas.filter((c) => c[2] === b && c[3] === e).length;
  medida('inventario_da_passagem', { vivas: doBloco('ue2-b', 'viva'), retiradas: doBloco('ue2-b', 'retirada') },
    'as linhas de design/especime-v3/INVENTARIO-FRASES.md com o bloco «ue2-b», por estado',
    'o mesmo detetor conta as oito linhas que o UE2 deixou vivas (as catorze do bloco menos as seis cujo texto a passagem mudou)', doBloco('ue2', 'viva') === 8);

  const p = lerJson('plantas-ue2-b/plantas-portoes-ue2.json');
  medida('plantas_dos_portoes_ue2', p && { plantas: p.length, mordidas: p.filter((x) => x.passou).length, nomes: p.map((x) => x.nome) },
    `OEDP_MEDICOES=${PASTA}/plantas-ue2-b node tests/pais/portoes.mjs --prefixo ue2- (plantas-portoes-ue2.json)`,
    'cada planta saiu com o código 1 e repôs os ficheiros byte a byte', p && p.every((x) => x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto)));
}

/* ------------------------------------------------------------------ as capturas, os portões e o custo */
{
  const c = lerJson('capturas-ue2-b.json');
  const paginas = c ? c.resultados.filter((r) => r.tipo === 'pagina') : [];
  const ue2 = lerJson('capturas-depois.json');
  const alturaUe2 = (lang, largura) => ue2?.resultados.find((r) => r.tipo === 'pagina' && r.lang === lang && r.largura === largura)?.medidas.altura ?? null;
  medida('capturas', c && {
    capturas: c.capturas, problemas: c.problemas.length, cabeca_da_construcao: c.construcao.commit,
    alturas: paginas.map((r) => ({ rota: r.rota, largura: r.largura, altura: r.medidas.altura, faixas: r.medidas.faixas_dos_paises, com_definicao: r.medidas.faixas_com_definicao })),
    altura_da_uniao_a_390_no_ue2: { pt: alturaUe2('pt', 390), en: alturaUe2('en', 390) },
  }, `node ${PASTA}/captar-ue2-b.mjs (capturas-ue2-b.json), e capturas-depois.json do UE2 para as alturas de antes`,
  'o manifesto tem as oito páginas inteiras, e cada página da União diz dez faixas com dez definições',
  c && paginas.length === 8 && paginas.filter((r) => r.rota.includes('uni') || r.rota.includes('union')).every((r) => r.medidas.faixas_dos_paises === 10 && r.medidas.faixas_com_definicao === 10));

  const lerPortoes = (pasta) => {
    const p = path.join(PASTA, pasta);
    if (!fs.existsSync(path.join(p, 'cabeca'))) return null;
    const ler1 = (f) => (fs.existsSync(path.join(p, f)) ? fs.readFileSync(path.join(p, f), 'utf8').trim() : null);
    return { cabeca: ler1('cabeca'), cabeca_fim: ler1('cabeca.fim'), build: Number(ler1('build.codigo')), verify: Number(ler1('verify.codigo')), typecheck: Number(ler1('typecheck.codigo')) };
  };
  const agora = lerPortoes('portoes/ue2-b');
  const doUe2 = lerPortoes('portoes');
  medida('portoes_a_zero', agora, `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/portoes/ue2-b (os ficheiros .codigo, cabeca e cabeca.fim)`,
    'o mesmo leitor lê os códigos da corrida final do UE2 em portoes/, a zero', doUe2 && doUe2.build === 0 && doUe2.verify === 0 && doUe2.typecheck === 0);

  const ini = lerJson('custo-inicio-ue2-b.json');
  const fim = lerJson('custo-fim-ue2-b.json');
  const gastos = ini && fim ? ini.simbolos_restantes_no_inicio - fim.simbolos_restantes_no_fim : null;
  const segundos = ini && fim ? (Date.parse(fim.fim_utc) - Date.parse(ini.inicio_utc)) / 1000 : null;
  medida('custo', { simbolos_gastos_ate_ao_relatorio: gastos, segundos_ate_ao_relatorio: segundos, semana_no_inicio_por_cento: ini?.semana_da_conta_no_inicio?.sete_dias_usados_por_cento ?? null, sessao: fim?.sessao ?? null },
    'custo-inicio-ue2-b.json menos custo-fim-ue2-b.json (as duas leituras do contador, à mão) e as duas horas do relógio',
    'as duas leituras existem e a do fim é menor do que a do início', Boolean(ini && fim && gastos > 0));
}

const saida = {
  bloco: 'UE2-b', cabeca, construcao_final: vFinal.commit, construcao_de_base: vBase.commit,
  guiao: `${PASTA}/medir-ue2-b.mjs`, medidas,
};
fs.writeFileSync(path.join(PASTA, 'medidas-ue2-b.json'), JSON.stringify(saida, null, 2) + '\n');
const falhados = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
console.log(`UE2-b: ${medidas.length} medidas; conhecido-positivo por encontrar em ${falhados.length}${falhados.length ? ` (${falhados.join(', ')})` : ''}.`);
process.exitCode = falhados.length ? 1 : 0;
