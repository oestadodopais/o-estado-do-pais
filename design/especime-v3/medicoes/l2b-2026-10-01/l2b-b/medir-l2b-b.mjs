/** L2b-b: as medidas da passagem, lidas e não escritas. Corre da raiz da worktree, depois da construção da cabeça da
 * passagem e das corridas que os ficheiros desta pasta guardam, e escreve `medidas.json` ao lado (ou o caminho em
 * OEDP_MEDIDAS_JSON). As medidas do L2b ficam em `../medidas.json`, como estavam na cabeça do relatório do L2b: esta
 * passagem não as reescreve. Cada medida traz o nome, o valor, o comando que a repete e um conhecido-positivo.
 *
 * O lugar de cada concelho reconta-se aqui por conta própria, sem importar o resolvedor da faixa, o leitor dos portões
 * nem a célula: as linhas leem-se do YAML, o ganho liga-se pelo código do INE do localizador, e a ordem e a faixa leem-se
 * da tabela declarada, que é uma declaração e não uma conta.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../../../../../src/data/faixa-do-concelho.mjs';

const PASTA = 'design/especime-v3/medicoes/l2b-2026-10-01/l2b-b';
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const ler = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
const codigo = (f) => {
  const t = ler(f);
  return t === null ? 'NÃO LIDO' : Number(t.trim());
};
const semCor = (t) => String(t ?? '').replace(/\x1b\[[0-9;]*m/g, '');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(ler('dist/version.json') ?? '{}');

/* ------------------------------------------------------------- a tabela */
const tabela = Object.entries(FAIXA_DAS_MEDIDAS_DO_CONCELHO);
const comFaixa = tabela.filter(([, d]) => d.faixa).map(([k]) => k);
const semFaixa = tabela.filter(([, d]) => !d.faixa).map(([k]) => k);
medida('l2b_b_medidas_com_faixa', comFaixa.length, 'src/data/faixa-do-concelho.mjs · as entradas com faixa: true', 'o ganho médio tem faixa', comFaixa.includes('ganho'));
medida('l2b_b_medidas_sem_faixa', semFaixa.length, 'idem · as entradas com faixa: false', 'a população não tem faixa', semFaixa.includes('populacao'));
medida('l2b_b_medidas_sem_faixa_com_a_razao_escrita', tabela.filter(([, d]) => !d.faixa && /contagem/.test(d.porqueAFaixa ?? '')).length, 'idem · as entradas sem faixa cuja razão diz «contagem»', 'a razão da dívida diz contagem', /contagem/.test(FAIXA_DAS_MEDIDAS_DO_CONCELHO.divida?.porqueAFaixa ?? ''));

/* ------------------------------------------------------------- as linhas, lidas aqui, e a recontagem */
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
const lugares = {};
for (const chave of comFaixa) {
  const com = concelhos.map((c) => ({ slug: c.slug, id: idDe(chave, c) })).filter((c) => c.id && linhas.has(c.id)).map((c) => ({ ...c, n: numero(linhas.get(c.id).value) })).filter((c) => c.n !== null);
  const ordem = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave].ordem;
  lugares[chave] = new Map(com.map((c) => [c.slug, 1 + com.filter((x) => (ordem === 'do-mais-baixo' ? x.n < c.n : x.n > c.n)).length]));
}

/* ------------------------------------------------------------- o dist/ */
let paginas = 0;
let faixas = 0;
let faixasEmContagens = 0;
let cartoesDeContagem = 0;
let lugaresRendidos = 0;
let lugaresDiferentes = 0;
const porMedida = Object.fromEntries(comFaixa.map((k) => [k, 0]));
for (const lang of ['pt', 'en']) {
  for (const c of concelhos) {
    const f = lang === 'pt' ? `dist/municipios/${c.slug}/index.html` : `dist/en/municipalities/${c.slug}/index.html`;
    const html = ler(f);
    if (html === null) continue;
    paginas++;
    const root = parse(html);
    for (const chave of semFaixa) {
      const cartao = root.querySelector(`[data-cartao-medida][data-medida-chave="${chave}"]`);
      if (cartao) {
        cartoesDeContagem++;
        faixasEmContagens += cartao.querySelectorAll('[data-faixa-concelho]').length;
      }
    }
    for (const faixa of root.querySelectorAll('[data-faixa-concelho]')) {
      faixas++;
      const chave = faixa.getAttribute('data-faixa-concelho');
      if (chave in porMedida) porMedida[chave]++;
      const m = faixa.querySelector('[data-concelho-lugar]');
      if (!m) continue;
      lugaresRendidos++;
      if (Number(m.text) !== lugares[chave]?.get(c.slug)) lugaresDiferentes++;
    }
  }
}
const evora = ler('dist/municipios/evora/index.html') ?? '';
medida('l2b_b_construcao', versao.commit ?? 'NÃO LIDO', 'dist/version.json · commit', 'a construção é desta cabeça ou de uma cabeça só com ficheiros desta pasta por cima', Boolean(versao.commit));
medida('l2b_b_paginas_de_concelho_lidas', paginas, `node ${PASTA}/medir-l2b-b.mjs · as páginas dos 308 nas duas edições em dist/`, 'a página de Évora existe', evora.length > 0);
medida('l2b_b_faixas_rendidas', faixas, 'idem · os [data-faixa-concelho] das páginas de concelho', 'Évora tem a faixa do ganho', /data-faixa-concelho="ganho"/.test(evora));
for (const [k, n] of Object.entries(porMedida)) medida(`l2b_b_faixas_${k}`, n, `idem · os [data-faixa-concelho="${k}"]`, `a medida «${k}» tem faixa na tabela`, comFaixa.includes(k));
medida('l2b_b_cartoes_de_contagem', cartoesDeContagem, 'idem · os cartões das quatro medidas sem faixa', 'Évora tem o cartão da população', /data-medida-chave="populacao"/.test(evora));
medida('l2b_b_faixas_em_cartoes_de_contagem', faixasEmContagens, 'idem · os [data-faixa-concelho] dentro dos cartões das contagens', 'o detetor vê a faixa do ganho no cartão do ganho', /data-medida-chave="ganho"[\s\S]*?data-faixa-concelho="ganho"/.test(evora));
medida('l2b_b_lugares_rendidos', lugaresRendidos, 'idem · os [data-concelho-lugar] dentro das faixas', 'o lugar de Évora no ganho está rendido', /data-concelho-lugar="ganho#evora"/.test(evora));
medida('l2b_b_lugares_diferentes_da_recontagem_independente', lugaresDiferentes, 'idem · cada lugar rendido contra a recontagem deste guião', 'a recontagem dá a Évora um lugar no ganho', lugares.ganho?.has('evora'));

/* ------------------------------------------------------------- o peso, antes e depois da passagem */
{
  const antes = JSON.parse(ler(`${PASTA}/bytes-antes.json`) ?? '{}');
  for (const [nome, v] of Object.entries(antes.paginas ?? {})) {
    medida(`l2b_b_bytes_${nome}_antes`, v, `${PASTA}/bytes-antes.json · ${antes.comando ?? ''}`, 'o ficheiro de antes diz a construção que mediu', Boolean(antes.construcao));
    const f = `dist/municipios/${nome}/index.html`;
    medida(`l2b_b_bytes_${nome}_depois`, fs.existsSync(f) ? fs.statSync(f).size : 'NÃO LIDO', `stat -f %z ${f}`, 'a página existe', fs.existsSync(f));
  }
  medida('l2b_b_bytes_da_construcao_antes', antes.construcao_inteira?.bytes ?? 'NÃO LIDO', `${PASTA}/bytes-antes.json · a soma de todos os ficheiros de dist/`, 'idem', Boolean(antes.construcao));
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
  medida('l2b_b_bytes_da_construcao_depois', total, 'a soma dos tamanhos de todos os ficheiros de dist/ (fs.readdirSync recursivo)', 'a construção tem páginas', html > 0);
  medida('l2b_b_paginas_html_depois', html, 'idem · os ficheiros .html', 'idem', html > 0);
}

/* ------------------------------------------------------------- a célula, a prova do cartão e as plantas do portão */
{
  const nav = JSON.parse(ler(`${PASTA}/navegacao.json`) ?? '{}');
  const f = nav.faixas_dos_concelhos ?? {};
  const l2b = (nav.plantas ?? []).filter((p) => String(p.nome).startsWith('l2b'));
  medida('l2b_b_codigo_do_check_navegacao', codigo(`${PASTA}/navegacao.codigo`), `node tests/inicio/navegacao.mjs --prova --json ${PASTA}/navegacao.json`, 'a célula contou páginas', (f.paginas ?? 0) > 0);
  medida('l2b_b_erros_do_check_navegacao', (nav.erros ?? ['NÃO LIDO']).length, 'idem · erros', 'idem', (f.paginas ?? 0) > 0);
  medida('l2b_b_faixas_conferidas_pela_celula', f.faixas ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.faixas', 'idem', (f.faixas ?? 0) > 0);
  medida('l2b_b_cartoes_de_contagem_sem_faixa_conferidos', f.cartoes_de_contagem_sem_faixa ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.cartoes_de_contagem_sem_faixa', 'idem', (f.cartoes_de_contagem_sem_faixa ?? 0) > 0);
  medida('l2b_b_marcas_conferidas_pela_celula', f.marcas ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.marcas', 'idem', (f.marcas ?? 0) > 0);
  medida('l2b_b_lugares_conferidos_pela_celula', f.lugares ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.lugares', 'idem', (f.lugares ?? 0) > 0);
  medida('l2b_b_faixas_sem_valor', f.sem_valor ?? 'NÃO LIDO', 'idem · faixas_dos_concelhos.sem_valor', 'idem', (f.paginas ?? 0) > 0);
  medida('l2b_b_comparacoes_sem_portugal', f.comparacoes?.nenhuma ?? 'NÃO LIDO', 'idem · comparacoes.nenhuma', 'idem', (f.comparacoes?.linha ?? 0) > 0);
  medida('l2b_b_plantas_da_celula', l2b.length, 'idem · as plantas com o nome a começar por l2b', 'a planta da faixa numa contagem está lá', l2b.some((p) => p.nome === 'l2b-b-faixa-numa-contagem'));
  medida('l2b_b_plantas_da_celula_que_morderam', l2b.filter((p) => p.mordeu).length, 'idem · mordeu', 'a planta da faixa tirada de um cartão mordeu', l2b.some((p) => p.nome === 'l2b-faixa-tirada-de-um-cartao' && p.mordeu));
  medida('l2b_b_plantas_do_check_navegacao', (nav.plantas ?? []).length, 'idem · todas as plantas da corrida', 'há plantas de outros blocos', (nav.plantas ?? []).some((p) => !String(p.nome).startsWith('l2b')));
  medida('l2b_b_plantas_do_check_navegacao_que_morderam', (nav.plantas ?? []).filter((p) => p.mordeu).length, 'idem · mordeu', 'idem', (nav.plantas ?? []).length > 0);
}
{
  const c = semCor(ler(`${PASTA}/check-cartao-prova.log`));
  const m = /prova: (\d+) estragos plantados, (\d+) vistos/.exec(c);
  const k1 = /cartões de concelho com a faixa do concelho \(K1\)\s+(\d+)/.exec(c);
  medida('l2b_b_check_cartao_codigo', codigo(`${PASTA}/check-cartao-prova.codigo`), `node tests/cartao/cartao.mjs --prova > ${PASTA}/check-cartao-prova.log`, 'a K1 contou cartões de concelho com a faixa', Boolean(k1));
  medida('l2b_b_check_cartao_estragos_plantados', m ? Number(m[1]) : 'NÃO LIDO', 'idem', 'idem', Boolean(m));
  medida('l2b_b_check_cartao_estragos_vistos', m ? Number(m[2]) : 'NÃO LIDO', 'idem', 'idem', Boolean(m));
  medida('l2b_b_check_cartao_cartoes_de_concelho_com_a_faixa', k1 ? Number(k1[1]) : 'NÃO LIDO', 'idem · a linha da K1', 'idem', Boolean(k1));
}
{
  const p = JSON.parse(ler(`${PASTA}/plantas-portoes-l2b.json`) ?? '[]');
  medida('l2b_b_plantas_do_portao', p.length, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo l2b-`, 'a planta do lugar numa contagem está lá', p.some((x) => x.nome === 'l2b-b-portao-lugar-numa-contagem'));
  medida('l2b_b_plantas_do_portao_que_morderam_com_os_bytes_repostos', p.filter((x) => x.passou && x.codigo === 1 && x.ficheiros.every((f) => f.antes === f.reposto)).length, 'idem · passou, código 1 e sha256 antes igual ao reposto', 'idem', p.length > 0);
}

/* ------------------------------------------------------------- as capturas */
{
  const m = JSON.parse(ler(`${PASTA}/capturas.json`) ?? '{}');
  const r = m.resultados ?? [];
  medida('l2b_b_capturas', m.capturas ?? 'NÃO LIDO', 'node design/especime-v3/medicoes/l2b-2026-10-01/captar-l2b.mjs l2b-b', 'há uma captura de Penedono a 390 px em português', r.some((x) => x.pagina === 'penedono' && x.lang === 'pt' && x.largura === 390));
  medida('l2b_b_problemas_nas_capturas', (m.problemas ?? ['NÃO LIDO']).length, 'idem · problemas (transbordo, HTTP, faixas a sair do cartão)', 'o manifesto tem resultados', r.length > 0);
  medida('l2b_b_faixas_em_contagens_nas_capturas', r.reduce((n, x) => n + (x.medidas?.faixas_em_contagens ?? 0), 0), 'idem · faixas_em_contagens, somadas nas 20 capturas', 'as capturas contam faixas', r.some((x) => (x.medidas?.faixas ?? 0) > 0));
  for (const pagina of ['evora', 'penedono']) {
    const x = r.find((y) => y.pagina === pagina && y.lang === 'pt' && y.largura === 390);
    medida(`l2b_b_altura_${pagina}_pt_390`, x?.medidas?.altura ?? 'NÃO LIDO', 'idem · a altura da página a 390 px, em português', 'a captura existe', Boolean(x));
  }
}

/* ------------------------------------------------------------- o mapa e as decisões */
{
  const mapa = ler(`${PASTA}/conferir-mapa.txt`) ?? '';
  const n = (re) => { const x = re.exec(mapa); return x ? Number(x[1]) : 'NÃO LIDO'; };
  medida('l2b_b_mapa_citacoes_na_linha', n(/citações conferidas na linha citada \(±7\): (\d+)/), `python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md > ${PASTA}/conferir-mapa.txt`, 'o mapa cita o ficheiro com o nome novo', /tests\/inicio\/lugares-no-navegador\.mjs:7/.test(ler('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md') ?? ''));
  medida('l2b_b_mapa_citacoes_longe_da_linha', n(/longe da linha citada: (\d+)/), 'idem', 'idem', mapa.length > 0);
  medida('l2b_b_mapa_citacoes_nao_encontradas', n(/não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'idem', 'idem', mapa.length > 0);
  const d = ler(`${PASTA}/decisoes-em-vigor-antes.txt`) ?? '';
  const x = /(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\)/.exec(d);
  medida('l2b_b_decisoes_citadas_nos_ficheiros_a_tocar', x ? Number(x[1]) : 'NÃO LIDO', `python3 scripts/leituras/decisoes-em-vigor.py <os ficheiros> > ${PASTA}/decisoes-em-vigor-antes.txt`, 'a §1.130 está na lista', d.includes('§1.130'));
  medida('l2b_b_ficheiros_lidos_pelas_decisoes_em_vigor', x ? Number(x[2]) : 'NÃO LIDO', 'idem', 'idem', d.includes('§1.130'));
}

/* ------------------------------------------------------------- os portões, lidos dos ficheiros */
const segundosEntre = (a, b) => {
  const i = ler(a);
  const f = ler(b);
  return i && f ? Math.round((Date.parse(f.trim()) - Date.parse(i.trim())) / 1000) : 'NÃO LIDO';
};
const PORTOES = 'design/especime-v3/medicoes/l2b-2026-10-01/portoes/l2b-b';
for (const g of ['build', 'verify', 'typecheck']) {
  medida(`l2b_b_portao_${g}_codigo`, codigo(`${PORTOES}/${g}.codigo`), `sh scripts/leituras/portoes.sh <worktree> <pasta>, copiado para ${PORTOES}`, 'o ficheiro da cabeça da corrida existe', ler(`${PORTOES}/cabeca`) !== null);
  medida(`l2b_b_portao_${g}_segundos`, segundosEntre(`${PORTOES}/${g}.inicio`, `${PORTOES}/${g}.fim`), `idem · ${g}.fim menos ${g}.inicio`, 'idem', ler(`${PORTOES}/cabeca`) !== null);
}

/* ------------------------------------------------------------- o custo */
{
  const i = JSON.parse(ler(`${PASTA}/custo-inicio.json`) ?? '{}');
  const f = JSON.parse(ler(`${PASTA}/custo-fim.json`) ?? '{}');
  /* UM CONTADOR PARADO NÃO MEDE NADA: se as duas leituras são iguais e o ficheiro do fim diz que o contador não
     andou, o valor é a razão e não um zero. */
  const gasto = f.contador_parado
    ? 'NÃO MEDIDO: o contador que a ferramenta mostra ao agente não andou durante a passagem'
    : typeof i.simbolos_restantes_no_inicio === 'number' && typeof f.simbolos_restantes_no_fim === 'number' ? i.simbolos_restantes_no_inicio - f.simbolos_restantes_no_fim : 'NÃO LIDO';
  const segundos = i.inicio_utc && f.fim_utc ? Math.round((Date.parse(f.fim_utc) - Date.parse(i.inicio_utc)) / 1000) : 'NÃO LIDO';
  medida('l2b_b_simbolos_gastos', gasto, `${PASTA}/custo-inicio.json menos ${PASTA}/custo-fim.json (as duas leituras do contador)`, 'as duas leituras existem', typeof i.simbolos_restantes_no_inicio === 'number' && typeof f.simbolos_restantes_no_fim === 'number');
  medida('l2b_b_segundos_de_parede', segundos, 'idem · fim_utc menos inicio_utc', 'idem', typeof segundos === 'number');
}

const saida = { passagem: 'L2b-b', cabeca, construcao: versao.commit ?? null, guiao: `${PASTA}/medir-l2b-b.mjs`, medidas };
fs.writeFileSync(process.env.OEDP_MEDIDAS_JSON ?? `${PASTA}/medidas.json`, JSON.stringify(saida, null, 2) + '\n');
const calados = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
console.log(`L2b-b: ${medidas.length} medidas, ${calados.length} conhecidos-positivos por achar${calados.length ? `: ${calados.join(', ')}` : ''}.`);
process.exitCode = calados.length ? 1 : 0;
