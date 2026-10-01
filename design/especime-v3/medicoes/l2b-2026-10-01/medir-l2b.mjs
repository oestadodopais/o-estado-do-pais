/** L2b: as medidas do relatório, lidas e não escritas. Corre da raiz da worktree, depois da construção da cabeça e das
 * corridas que os ficheiros desta pasta guardam, e escreve `medidas.json` ao lado (ou o caminho em OEDP_MEDIDAS_JSON).
 * Cada medida traz o nome, o valor, o comando que a repete e um conhecido-positivo: uma coisa que o MESMO detetor tem de
 * encontrar, para que um zero ou uma igualdade não sejam um detetor calado.
 *
 * O lugar de cada concelho reconta-se aqui por conta própria, sem importar o resolvedor da faixa, o leitor dos portões
 * nem a célula: as linhas leem-se do YAML, o ganho liga-se pelo código do INE do localizador, e a ordem lê-se da tabela
 * declarada, que é uma declaração e não uma conta.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../../../../src/data/faixa-do-concelho.mjs';

const PASTA = 'design/especime-v3/medicoes/l2b-2026-10-01';
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const ler = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
const codigo = (f) => {
  const t = ler(f);
  return t === null ? 'NÃO LIDO' : Number(t.trim());
};
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(ler('dist/version.json') ?? '{}');

/* ------------------------------------------------------------- as linhas, lidas aqui */
const linhas = new Map();
for (const f of fs.readdirSync('ledger/claims').filter((x) => x.endsWith('.yml'))) {
  const l = load(fs.readFileSync(path.join('ledger/claims', f), 'utf8'));
  linhas.set(l.id, l);
}
const numero = (v) => {
  const s = String(v ?? '').trim().replace(/(?<=\d)[\s   ](?=\d)/g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};
const concelhos = JSON.parse(ler('src/data/concelhos.gerado.json'));
const porDico = new Map();
for (const [id, l] of linhas) {
  const m = /^INE, indicador 0012656, .+ \(código \w*?(\d{4})\), dados de \d{4}$/.exec(String(l.document?.locator ?? ''));
  if (m) porDico.set(m[1], id);
}
const idDe = (chave, c) => (chave === 'ganho' ? porDico.get(String(c.dico)) : c.linhas?.[chave]);
const contas = {};
for (const chave of Object.keys(FAIXA_DAS_MEDIDAS_DO_CONCELHO)) {
  const todos = concelhos.map((c) => ({ slug: c.slug, id: idDe(chave, c) })).filter((c) => c.id && linhas.has(c.id)).map((c) => ({ ...c, n: numero(linhas.get(c.id).value) }));
  const com = todos.filter((c) => c.n !== null);
  const ordem = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave].ordem;
  const lugar = new Map(com.map((c) => [c.slug, 1 + com.filter((x) => (ordem === 'do-mais-baixo' ? x.n < c.n : x.n > c.n)).length]));
  contas[chave] = { todos: todos.length, com: com.length, sem: todos.length - com.length, lugar, ordem };
}

/* ------------------------------------------------------------- o dist/: as faixas e os lugares rendidos */
let paginas = 0;
let faixas = 0;
let lugaresRendidos = 0;
let lugaresDiferentes = 0;
let semLugar = 0;
const exemplos = [];
for (const lang of ['pt', 'en']) {
  for (const c of concelhos) {
    const f = lang === 'pt' ? `dist/municipios/${c.slug}/index.html` : `dist/en/municipalities/${c.slug}/index.html`;
    const html = ler(f);
    if (html === null) continue;
    paginas++;
    const root = parse(html);
    for (const faixa of root.querySelectorAll('[data-faixa-concelho]')) {
      faixas++;
      const chave = faixa.getAttribute('data-faixa-concelho');
      const m = faixa.querySelector('[data-concelho-lugar]');
      if (!m) { semLugar++; continue; }
      lugaresRendidos++;
      const recontado = contas[chave]?.lugar.get(c.slug);
      if (Number(m.text) !== recontado) { lugaresDiferentes++; if (exemplos.length < 5) exemplos.push(`${f}#${chave}: ${m.text} contra ${recontado}`); }
    }
  }
}
medida('paginas_de_concelho_lidas', paginas, 'node design/especime-v3/medicoes/l2b-2026-10-01/medir-l2b.mjs · as páginas dos 308 nas duas edições em dist/', 'a página de Évora existe', fs.existsSync('dist/municipios/evora/index.html'));
medida('faixas_do_concelho_rendidas', faixas, 'idem · os [data-faixa-concelho] das páginas de concelho', 'a página de Évora tem a faixa do ganho', /data-faixa-concelho="ganho"/.test(ler('dist/municipios/evora/index.html') ?? ''));
medida('lugares_rendidos', lugaresRendidos, 'idem · os [data-concelho-lugar] dentro das faixas', 'o lugar de Évora no ganho está rendido', /data-concelho-lugar="ganho#evora"/.test(ler('dist/municipios/evora/index.html') ?? ''));
medida('lugares_diferentes_da_recontagem_independente', lugaresDiferentes, 'idem · cada lugar rendido contra a recontagem deste guião, das linhas em YAML e da tabela das ordens', 'a recontagem dá a Évora um lugar no ganho', contas.ganho?.lugar.has('evora'));
medida('faixas_sem_lugar_por_falta_de_valor', semLugar, 'idem · as faixas sem [data-concelho-lugar]', 'Penedono não tem valor no índice de dívida', contas.indice?.lugar.has('penedono') === false && contas.indice?.todos === 308);
medida('lugar_de_evora_no_ganho', contas.ganho?.lugar.get('evora') ?? 'NÃO LIDO', 'idem · 1 mais o número de concelhos com ganho maior do que o de Évora', 'a recontagem tem 308 concelhos com valor no ganho', contas.ganho?.com === 308);
medida('lugar_de_penedono_no_ganho', contas.ganho?.lugar.get('penedono') ?? 'NÃO LIDO', 'idem · 1 mais o número de concelhos com ganho maior do que o de Penedono', 'Penedono tem linha do ganho', contas.ganho?.lugar.has('penedono'));
for (const [chave, c] of Object.entries(contas)) {
  medida(`concelhos_com_valor_${chave}`, c.com, `idem · as linhas de «${chave}» que são um número da casa`, `a medida «${chave}» tem 308 linhas`, c.todos === 308);
}

/* ------------------------------------------------------------- a tabela das ordens e das comparações */
const tabela = Object.entries(FAIXA_DAS_MEDIDAS_DO_CONCELHO);
medida('medidas_na_tabela_das_ordens', tabela.length, 'src/data/faixa-do-concelho.mjs · as entradas de FAIXA_DAS_MEDIDAS_DO_CONCELHO', 'o ganho está na tabela', Object.hasOwn(FAIXA_DAS_MEDIDAS_DO_CONCELHO, 'ganho'));
medida('medidas_contadas_do_mais_baixo', tabela.filter(([, d]) => d.ordem === 'do-mais-baixo').length, 'idem · as entradas com ordem «do-mais-baixo»', 'o índice de dívida conta-se do mais baixo', FAIXA_DAS_MEDIDAS_DO_CONCELHO.indice?.ordem === 'do-mais-baixo');
medida('medidas_com_linha_nacional', tabela.filter(([, d]) => d.comparacao && 'linha' in d.comparacao).length, 'idem · as entradas com comparacao.linha', 'a do ganho é ganho-medio-mensal-2024', FAIXA_DAS_MEDIDAS_DO_CONCELHO.ganho?.comparacao?.linha === 'ganho-medio-mensal-2024');
medida('medidas_sem_comparacao', tabela.filter(([, d]) => !d.comparacao).length, 'idem · as entradas com comparacao null', 'a população não se compara', FAIXA_DAS_MEDIDAS_DO_CONCELHO.populacao?.comparacao === null);

/* ------------------------------------------------------------- a linha nacional do ganho, conferida aqui */
{
  const n = linhas.get('ganho-medio-mensal-2024');
  const e = linhas.get('evora-ganho-medio-mensal-2024');
  const mesmo = n && e && n.unit === e.unit && n.reference_date === e.reference_date && n.document?.edition === e.document?.edition;
  medida('linha_nacional_do_ganho_mesma_unidade_periodo_e_indicador', mesmo ? 1 : 0, 'ledger/claims/ganho-medio-mensal-2024.yml contra evora-ganho-medio-mensal-2024.yml · unit, reference_date e document.edition', 'o localizador da linha nacional nomeia Portugal', /Portugal \(código PT\)/.test(String(n?.document?.locator ?? '')));
}

/* ------------------------------------------------------------- as leituras de Évora e de Penedono */
for (const slug of ['evora', 'penedono']) {
  for (const lang of ['pt', 'en']) {
    const f = lang === 'pt' ? `dist/municipios/${slug}/index.html` : `dist/en/municipalities/${slug}/index.html`;
    const root = parse(ler(f) ?? '<p></p>');
    const leitura = root.querySelector('.lugar-leitura');
    const palavra = lang === 'pt' ? 'abaixo de Portugal' : 'below Portugal';
    const tem = Boolean(leitura?.text.includes(palavra) && leitura.querySelector(`[data-claim="${slug}-ganho-medio-mensal-2024"]`) && leitura.querySelector('[data-claim="ganho-medio-mensal-2024"]'));
    medida(`leitura_de_${slug}_${lang}_diz_abaixo_de_portugal_com_as_duas_linhas`, tem ? 1 : 0, `${f} · .lugar-leitura: «${palavra}» e as duas linhas do ganho`, 'a leitura existe na página', Boolean(leitura));
  }
}

/* ------------------------------------------------------------- o recibo com Portugal no enquadramento */
{
  let recibos = 0;
  for (const lang of ['pt', 'en']) for (const c of concelhos) {
    const id = porDico.get(String(c.dico));
    const f = lang === 'pt' ? `dist/livro-razao/${id}/index.html` : `dist/en/ledger/${id}/index.html`;
    if (/data-enquadramento-portugal="ganho-medio-mensal-2024"/.test(ler(f) ?? '')) recibos++;
  }
  medida('recibos_do_ganho_com_portugal_no_enquadramento', recibos, 'os recibos das linhas do ganho dos 308, nas duas edições · [data-enquadramento-portugal]', 'o recibo de Évora lista Portugal', /data-enquadramento-portugal="ganho-medio-mensal-2024"/.test(ler('dist/livro-razao/evora-ganho-medio-mensal-2024/index.html') ?? ''));
}

/* ------------------------------------------------------------- o peso das páginas */
for (const [nome, f] of [['evora', 'municipios/evora/index.html'], ['abrantes', 'municipios/abrantes/index.html'], ['penedono', 'municipios/penedono/index.html']]) {
  const depois = fs.existsSync(path.join('dist', f)) ? fs.statSync(path.join('dist', f)).size : 'NÃO LIDO';
  medida(`bytes_da_pagina_${nome}_depois`, depois, `stat -f %z dist/${f}`, 'a página existe', depois !== 'NÃO LIDO');
}
{
  const antes = JSON.parse(ler(`${PASTA}/bytes-antes.json`) ?? '{}');
  for (const [nome, v] of Object.entries(antes.paginas ?? {})) medida(`bytes_da_pagina_${nome}_antes`, v, antes.comando ?? 'NÃO LIDO', 'o ficheiro das medidas de antes existe', true);
  const inteira = antes.construcao_inteira ?? {};
  medida('bytes_da_construcao_antes', inteira.bytes ?? 'NÃO LIDO', inteira.comando ?? 'NÃO LIDO', 'a construção de base tinha páginas', (inteira.paginas_html ?? 0) > 0);
  let total = 0;
  let html = 0;
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else { total += fs.statSync(f).size; if (e.name.endsWith('.html')) html++; }
    }
  };
  anda('dist');
  medida('bytes_da_construcao_depois', total, 'a soma dos tamanhos de todos os ficheiros de dist/ (fs.readdirSync recursivo)', 'a construção tem páginas', html > 0);
  medida('paginas_html_da_construcao_depois', html, 'idem · os ficheiros .html', 'idem', html > 0);
}

/* ------------------------------------------------------------- as corridas, lidas dos seus ficheiros */
{
  const nav = JSON.parse(ler(`${PASTA}/navegacao.json`) ?? '{}');
  const plantas = (nav.plantas ?? []).filter((p) => String(p.nome).startsWith('l2b-'));
  medida('erros_do_check_navegacao', (nav.erros ?? ['NÃO LIDO']).length, `node tests/inicio/navegacao.mjs --prova --json ${PASTA}/navegacao.json`, 'a célula das faixas contou páginas', (nav.faixas_dos_concelhos?.paginas ?? 0) > 0);
  medida('codigo_do_check_navegacao', codigo(`${PASTA}/navegacao.codigo`), 'idem · o código, escrito depois de o processo acabar', 'o ficheiro do código existe', ler(`${PASTA}/navegacao.codigo`) !== null);
  medida('faixas_conferidas_pela_celula', nav.faixas_dos_concelhos?.faixas ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.faixas', 'a célula conferiu recibos', (nav.faixas_dos_concelhos?.recibos ?? 0) > 0);
  medida('marcas_conferidas_pela_celula', nav.faixas_dos_concelhos?.marcas ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.marcas', 'idem', (nav.faixas_dos_concelhos?.marcas ?? 0) > 0);
  medida('comparacoes_com_linha_nacional', nav.faixas_dos_concelhos?.comparacoes?.linha ?? 'NÃO LIDO', 'idem · comparacoes.linha', 'idem', (nav.faixas_dos_concelhos?.comparacoes?.linha ?? 0) > 0);
  medida('comparacoes_com_a_base_do_indice', nav.faixas_dos_concelhos?.comparacoes?.base ?? 'NÃO LIDO', 'idem · comparacoes.base', 'idem', (nav.faixas_dos_concelhos?.comparacoes?.base ?? 0) > 0);
  medida('faixas_sem_comparacao', nav.faixas_dos_concelhos?.comparacoes?.nenhuma ?? 'NÃO LIDO', 'idem · comparacoes.nenhuma', 'idem', (nav.faixas_dos_concelhos?.comparacoes?.nenhuma ?? 0) > 0);
  medida('recibos_conferidos_pela_celula', nav.faixas_dos_concelhos?.recibos ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.recibos', 'idem', (nav.faixas_dos_concelhos?.recibos ?? 0) > 0);
  medida('plantas_da_celula_l2b', plantas.length, 'idem · as plantas com o nome a começar por l2b-', 'a planta do lugar errado está lá', plantas.some((p) => p.nome === 'l2b-faixa-um-lugar-errado'));
  medida('plantas_da_celula_l2b_que_morderam', plantas.filter((p) => p.mordeu).length, 'idem · mordeu', 'a planta da marca a menos mordeu', plantas.some((p) => p.nome === 'l2b-faixa-uma-marca-a-menos' && p.mordeu));
  medida('plantas_do_check_navegacao', (nav.plantas ?? []).length, 'idem · todas as plantas da corrida', 'há plantas de outros blocos', (nav.plantas ?? []).some((p) => !String(p.nome).startsWith('l2b-')));
  medida('plantas_do_check_navegacao_que_morderam', (nav.plantas ?? []).filter((p) => p.mordeu).length, 'idem · mordeu', 'idem', (nav.plantas ?? []).length > 0);
}
{
  const p = JSON.parse(ler(`${PASTA}/plantas-portoes-l2b.json`) ?? '[]');
  medida('plantas_do_portao_de_html_l2b', p.length, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo l2b-`, 'a planta do lugar errado está lá', p.some((x) => x.nome === 'l2b-portao-um-lugar-errado'));
  medida('plantas_do_portao_de_html_l2b_que_morderam_com_os_bytes_repostos', p.filter((x) => x.passou && x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto)).length, 'idem · passou, código 1 e sha256 antes igual ao reposto', 'idem', p.length > 0);
}

/* ------------------------------------------------------------- as seis réguas à mão, antes e depois */
const semCor = (t) => String(t ?? '').replace(/\x1b\[[0-9;]*m/g, '');
for (const fase of ['antes', 'depois']) {
  for (const r of ['correcoes-a', 'lista', 'mapa-distritos', 'mapa-unidades', 'matriz', 'correcoes-c']) {
    const f = `${PASTA}/reguas-${fase}/${r}.codigo`;
    const pasta = r === 'correcoes-c' ? 'municipio' : 'inicio';
    medida(`regua_${r}_codigo_${fase}`, codigo(f), `node tests/${pasta}/${r}.mjs --json ${PASTA}/reguas-${fase}/${r}.json (código escrito depois de o processo acabar)`, 'o ficheiro do código existe', ler(f) !== null);
    /* ONDE REBENTA, lido do registo: a primeira linha do próprio guião na pilha do erro. */
    const log = semCor(ler(`${PASTA}/reguas-${fase}/${r}.log`));
    const m = new RegExp(`tests/${pasta}/${r}\\.mjs:(\\d+)`).exec(log);
    medida(`regua_${r}_linha_onde_rebenta_${fase}`, m ? Number(m[1]) : 'não rebenta', `o registo ${PASTA}/reguas-${fase}/${r}.log · a primeira linha de tests/${pasta}/${r}.mjs na pilha do erro`, 'o registo existe', log.length > 0);
    if (r === 'matriz' || r === 'correcoes-c') {
      medida(`regua_${r}_celulas_verdes_${fase}`, (log.match(/^\s+passa\s/gm) ?? []).length, `idem · as linhas «passa»`, 'idem', log.length > 0);
      medida(`regua_${r}_celulas_vermelhas_${fase}`, (log.match(/^\s+falha\s/gm) ?? []).length, `idem · as linhas «falha»`, 'idem', log.length > 0);
    }
  }
}

/* ------------------------------------------------------------- as capturas */
for (const fase of ['antes', 'depois']) {
  const m = JSON.parse(ler(`${PASTA}/capturas-${fase}.json`) ?? '{}');
  medida(`capturas_${fase}`, m.capturas ?? 'NÃO LIDO', `node ${PASTA}/captar-l2b.mjs ${fase}${fase === 'antes' ? ' <construção de base> <cabeça de base>' : ''}`, 'há uma captura de Évora a 390 px em português', (m.resultados ?? []).some((r) => r.pagina === 'evora' && r.lang === 'pt' && r.largura === 390));
  medida(`problemas_nas_capturas_${fase}`, (m.problemas ?? ['NÃO LIDO']).length, 'idem · problemas (transbordo, HTTP, faixas a sair do cartão)', 'o manifesto tem resultados', (m.resultados ?? []).length > 0);
}

/* ------------------------------------------------------------- os portões, lidos dos ficheiros das corridas */
const segundosEntre = (a, b) => {
  const i = ler(a);
  const f = ler(b);
  return i && f ? Math.round((Date.parse(f.trim()) - Date.parse(i.trim())) / 1000) : 'NÃO LIDO';
};
for (const [corrida, pasta] of [['', 'portoes'], ['_intermedio', 'portoes-intermedio']]) {
  for (const g of ['build', 'verify', 'typecheck']) {
    medida(`portao${corrida}_${g}_codigo`, codigo(`${PASTA}/${pasta}/${g}.codigo`), `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/${pasta}`, 'o ficheiro da cabeça da corrida existe', ler(`${PASTA}/${pasta}/cabeca`) !== null);
    medida(`portao${corrida}_${g}_segundos`, segundosEntre(`${PASTA}/${pasta}/${g}.inicio`, `${PASTA}/${pasta}/${g}.fim`), `idem · ${g}.fim menos ${g}.inicio`, 'idem', ler(`${PASTA}/${pasta}/cabeca`) !== null);
  }
}
{
  /* A H2 da corrida intermédia: quantos alvos em caixa falharam, lidos da linha da célula. */
  const v = semCor(ler(`${PASTA}/portoes-intermedio/verify.log`));
  const m = /✗ H2 .*?destes, (\d+) são caixas e falham/.exec(v);
  medida('h2_caixas_que_falharam_na_corrida_intermedia', m ? Number(m[1]) : 'NÃO LIDO', `${PASTA}/portoes-intermedio/verify.log · a linha «✗ H2» da check:alvos`, 'a linha da H2 está no registo', /H2 {2}fichas de concelho/.test(v));
  const t = [...v.matchAll(/«(?:fonte|source) · INE» · ([\d.]+)×([\d.]+) de toque \(caixa/g)].map((x) => Number(x[2]));
  medida('h2_menor_altura_de_toque_na_corrida_intermedia', t.length ? Math.min(...t) : 'NÃO LIDO', 'idem · a menor altura de toque dos selos «fonte · INE» que falharam', 'idem', t.length > 0);
}
{
  /* A sonda do toque das marcas dos cartões de Évora, com a regra do desenho e sem ela. */
  for (const qual of ['com-a-regra', 'sem-a-regra']) {
    const j = JSON.parse(ler(`${PASTA}/sonda-toque-${qual}.json`) ?? '{}');
    const todas = Object.values(j.larguras ?? {}).flat();
    medida(`sonda_marcas_${qual.replaceAll('-', '_')}`, todas.length, `node ${PASTA}/sonda-toque.mjs${qual === 'sem-a-regra' ? ' --sem-a-regra' : ''} ${PASTA}/sonda-toque-${qual}.json`, 'há marcas a 390 e a 768 px', Object.keys(j.larguras ?? {}).length === 2);
    medida(`sonda_marcas_que_respondem_${qual.replaceAll('-', '_')}`, todas.filter((x) => x.baixo21 === 'a.src-chip' && x.cima16 === 'a.src-chip').length, 'idem · as que devolvem a marca a 21 px por baixo e a 16 por cima do centro', 'idem', todas.length > 0);
  }
}
{
  const inv = ler('design/especime-v3/INVENTARIO-FRASES.md') ?? '';
  medida('cadeias_novas_no_inventario_da_voz', (inv.match(/^\| \w+ \| .* \| l2b \| viva \|/gm) ?? []).length, 'design/especime-v3/INVENTARIO-FRASES.md · as linhas com o bloco «l2b» e o estado «viva»', 'o inventário tem a secção do L2b', inv.includes('## L2b · o concelho entre os 308'));
  const d = ler(`${PASTA}/decisoes-em-vigor-antes.txt`) ?? '';
  const m = /(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\)/.exec(d);
  medida('decisoes_citadas_nos_ficheiros_a_tocar', m ? Number(m[1]) : 'NÃO LIDO', `python3 scripts/leituras/decisoes-em-vigor.py <os ficheiros> > ${PASTA}/decisoes-em-vigor-antes.txt`, 'a §1.140 está na lista', d.includes('§1.140'));
  medida('ficheiros_lidos_pelas_decisoes_em_vigor', m ? Number(m[2]) : 'NÃO LIDO', 'idem', 'idem', d.includes('§1.140'));
}

/* ------------------------------------------------------------- a prova do cartão, o mapa e Penedono */
{
  const c = semCor(ler(`${PASTA}/check-cartao-prova.log`));
  const m = /prova: (\d+) estragos plantados, (\d+) vistos/.exec(c);
  medida('check_cartao_estragos_plantados', m ? Number(m[1]) : 'NÃO LIDO', `node tests/cartao/cartao.mjs --prova > ${PASTA}/check-cartao-prova.log`, 'a K1 contou cartões de concelho com a faixa', /cartões de concelho com a faixa do concelho \(K1\)\s+\d+/.test(c));
  medida('check_cartao_estragos_vistos', m ? Number(m[2]) : 'NÃO LIDO', 'idem', 'idem', /faixa do concelho/.test(c));
  medida('check_cartao_codigo', codigo(`${PASTA}/check-cartao-prova.codigo`), 'idem · o código, escrito depois de o processo acabar', 'o ficheiro do código existe', ler(`${PASTA}/check-cartao-prova.codigo`) !== null);
  const k1 = /cartões de concelho com a faixa do concelho \(K1\)\s+(\d+)/.exec(c);
  medida('check_cartao_cartoes_de_concelho_com_a_faixa', k1 ? Number(k1[1]) : 'NÃO LIDO', 'idem · a linha da K1', 'idem', Boolean(k1));
  const mapa = ler(`${PASTA}/conferir-mapa.txt`) ?? '';
  const n = (re) => { const x = re.exec(mapa); return x ? Number(x[1]) : 'NÃO LIDO'; };
  medida('mapa_citacoes_na_linha', n(/citações conferidas na linha citada \(±7\): (\d+)/), `python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md > ${PASTA}/conferir-mapa.txt`, 'o guião conferiu citações do L2b', /FaixaDoConcelho|faixa-do-concelho/.test(ler('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md') ?? ''));
  medida('mapa_citacoes_longe_da_linha', n(/longe da linha citada: (\d+)/), 'idem', 'idem', true);
  medida('mapa_citacoes_nao_encontradas', n(/não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'idem', 'idem', true);
  const pop = linhas.get('penedono-populacao-2025');
  medida('populacao_de_penedono', numero(pop?.value) ?? 'NÃO LIDO', 'ledger/claims/penedono-populacao-2025.yml · value', 'a linha existe', Boolean(pop));
}

/* ------------------------------------------------------------- o custo */
{
  const i = JSON.parse(ler(`${PASTA}/custo-inicio.json`) ?? '{}');
  const f = JSON.parse(ler(`${PASTA}/custo-fim.json`) ?? '{}');
  const gasto = typeof i.simbolos_restantes_no_inicio === 'number' && typeof f.simbolos_restantes_no_fim === 'number' ? i.simbolos_restantes_no_inicio - f.simbolos_restantes_no_fim : 'NÃO LIDO';
  const segundos = i.inicio_utc && f.fim_utc ? Math.round((Date.parse(f.fim_utc) - Date.parse(i.inicio_utc)) / 1000) : 'NÃO LIDO';
  medida('simbolos_gastos', gasto, `${PASTA}/custo-inicio.json menos ${PASTA}/custo-fim.json (as duas leituras do contador)`, 'as duas leituras existem', typeof gasto === 'number');
  medida('segundos_de_parede', segundos, 'idem · fim_utc menos inicio_utc', 'idem', typeof segundos === 'number');
}

/* ------------------------------------------------------------- o §0 do brief, reproduzido */
{
  const b = JSON.parse(ler(`${PASTA}/brief-reproduzido.json`) ?? '{}');
  for (const m of b.medidas ?? []) medida(`brief_${m.nome}`, m.valor, 'OEDP_MEDIDAS_JSON=<ficheiro> python3 design/observatorio/medidas/BRIEF-L2b.py', m.conhecido_positivo.o_que, m.conhecido_positivo.encontrado);
}

const saida = { bloco: 'L2b', cabeca, construcao: versao.commit ?? null, guiao: `${PASTA}/medir-l2b.mjs`, exemplos_de_lugares_diferentes: exemplos, medidas };
const alvo = process.env.OEDP_MEDIDAS_JSON ?? `${PASTA}/medidas.json`;
fs.writeFileSync(alvo, JSON.stringify(saida, null, 2) + '\n');
const calados = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
console.log(`L2b: ${medidas.length} medidas, ${calados.length} conhecidos-positivos por achar${calados.length ? `: ${calados.join(', ')}` : ''}.`);
process.exitCode = calados.length ? 1 : 0;
