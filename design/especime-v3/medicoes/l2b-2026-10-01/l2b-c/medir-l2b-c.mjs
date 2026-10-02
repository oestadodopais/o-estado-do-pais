/** L2b-c: as medidas da passagem, lidas e não escritas. Corre da raiz da worktree, depois da construção da cabeça da
 * passagem e das corridas que os ficheiros desta pasta guardam, e escreve `medidas.json` ao lado (ou o caminho em
 * OEDP_MEDIDAS_JSON). As medidas do L2b e da L2b-b ficam onde estavam. Cada medida traz o nome, o valor, o comando
 * que a repete e um conhecido-positivo.
 *
 * O lugar do índice de dívida e do prazo reconta-se aqui por uma terceira declaração da direção, escrita neste guião
 * (do mais baixo nas duas), sem importar a tabela da vista nem a autoridade do portão: as três têm de dar o mesmo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { conferirTabelaDaVista, DIRECOES_DO_PORTAO, CONTAGENS_DO_PORTAO } from '../../../../../scripts/concelhos-do-portao.mjs';
import { MEDIDAS_DO_CONCELHO } from '../../../../../src/data/concelhos.mjs';
import { t } from '../../../../../src/i18n/strings.mjs';

const PASTA = 'design/especime-v3/medicoes/l2b-2026-10-01/l2b-c';
const PAI = 'design/especime-v3/medicoes/l2b-2026-10-01';
const medidas = [];
const medida = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });
const ler = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
const codigo = (f) => {
  const x = ler(f);
  return x === null ? 'NÃO LIDO' : Number(x.trim());
};
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = JSON.parse(ler('dist/version.json') ?? '{}');
medida('l2b_c_construcao', versao.commit ?? 'NÃO LIDO', 'dist/version.json · commit', 'a construção diz a sua cabeça', Boolean(versao.commit));

/* ------------------------------------------------------------- (a) a autoridade do portão para a direção */
medida('l2b_c_discordancias_entre_a_tabela_da_vista_e_o_portao', conferirTabelaDaVista().length, 'conferirTabelaDaVista() de scripts/concelhos-do-portao.mjs, sobre a tabela da vista em vigor', 'a autoridade do portão conta o índice do mais baixo', DIRECOES_DO_PORTAO.indice?.ordem === 'do-mais-baixo');
medida('l2b_c_medidas_com_direcao_no_portao', Object.keys(DIRECOES_DO_PORTAO).length, 'idem · DIRECOES_DO_PORTAO', 'o ganho está lá', 'ganho' in DIRECOES_DO_PORTAO);
medida('l2b_c_contagens_no_portao', Object.keys(CONTAGENS_DO_PORTAO).length, 'idem · CONTAGENS_DO_PORTAO', 'a população está lá', 'populacao' in CONTAGENS_DO_PORTAO);
{
  /* A terceira declaração, deste guião: o índice e o prazo do mais baixo. */
  const TERCEIRA = { indice: 'do-mais-baixo', pmp: 'do-mais-baixo' };
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
  let rendidos = 0;
  let diferentes = 0;
  for (const [chave, ordem] of Object.entries(TERCEIRA)) {
    const com = concelhos.map((c) => ({ slug: c.slug, n: numero(linhas.get(c.linhas?.[chave])?.value) })).filter((c) => c.n !== null);
    const lugar = new Map(com.map((c) => [c.slug, 1 + com.filter((x) => (ordem === 'do-mais-baixo' ? x.n < c.n : x.n > c.n)).length]));
    for (const lang of ['pt', 'en']) {
      for (const c of concelhos) {
        const html = ler(lang === 'pt' ? `dist/municipios/${c.slug}/index.html` : `dist/en/municipalities/${c.slug}/index.html`);
        const m = html ? new RegExp(`data-concelho-lugar="${chave}#${c.slug}">(\\d+)<`).exec(html) : null;
        if (!m) continue;
        rendidos++;
        if (Number(m[1]) !== lugar.get(c.slug)) diferentes++;
      }
    }
  }
  medida('l2b_c_lugares_do_indice_e_do_prazo_rendidos', rendidos, `node ${PASTA}/medir-l2b-c.mjs · os data-concelho-lugar do índice e do prazo nas páginas de concelho`, 'o lugar de Évora no índice está rendido', /data-concelho-lugar="indice#evora"/.test(ler('dist/municipios/evora/index.html') ?? ''));
  medida('l2b_c_lugares_diferentes_da_terceira_direcao', diferentes, 'idem · cada lugar contra a recontagem com a direção escrita neste guião', 'idem', rendidos > 0);
}
{
  const r = JSON.parse(ler(`${PASTA}/planta-direcao-trocada.json`) ?? '{}');
  medida('l2b_c_planta_de_fora_a_fora_codigo_do_portao', r.codigo ?? 'NÃO LIDO', `node ${PASTA}/planta-direcao-trocada.mjs (com a tranca da máquina)`, 'a planta tem as duas mordidas registadas', (r.mordidas ?? []).length === 2);
  medida('l2b_c_planta_de_fora_a_fora_mordidas_vistas', (r.mordidas ?? []).filter((m) => m.viu).length, 'idem · mordidas vistas', 'idem', (r.mordidas ?? []).length === 2);
  medida('l2b_c_planta_de_fora_a_fora_lugares_do_indice_recusados', r.lugares_do_indice_recusados ?? 'NÃO LIDO', 'idem · as recusas de data-concelho-lugar do índice', 'idem', typeof r.lugares_do_indice_recusados === 'number');
  medida('l2b_c_planta_de_fora_a_fora_ficheiro_reposto', r.antes && r.antes === r.reposto ? 'sim' : 'não', 'idem · o sha256 da tabela da vista antes e depois', 'os dois resumos existem', Boolean(r.antes && r.reposto));
}

/* ------------------------------------------------------------- a célula */
{
  const nav = JSON.parse(ler(`${PASTA}/navegacao.json`) ?? '{}');
  const fc8 = (nav.plantas ?? []).find((p) => p.nome === 'l2b-c-direcao-trocada-na-tabela-da-vista');
  medida('l2b_c_codigo_do_check_navegacao', codigo(`${PASTA}/navegacao.codigo`), `node tests/inicio/navegacao.mjs --prova --json ${PASTA}/navegacao.json`, 'a célula contou faixas', (nav.faixas_dos_concelhos?.faixas ?? 0) > 0);
  medida('l2b_c_erros_do_check_navegacao', (nav.erros ?? ['NÃO LIDO']).length, 'idem · erros', 'idem', (nav.faixas_dos_concelhos?.faixas ?? 0) > 0);
  medida('l2b_c_planta_fc8_mordeu', fc8?.mordeu ? 'sim' : 'não', 'idem · a planta l2b-c-direcao-trocada-na-tabela-da-vista', 'a planta está na corrida', Boolean(fc8));
  medida('l2b_c_plantas_do_check_navegacao', (nav.plantas ?? []).length, 'idem · todas as plantas da corrida', 'idem', (nav.plantas ?? []).length > 0);
  medida('l2b_c_plantas_do_check_navegacao_que_morderam', (nav.plantas ?? []).filter((p) => p.mordeu).length, 'idem · mordeu', 'idem', (nav.plantas ?? []).length > 0);
}

/* ------------------------------------------------------------- (b) a C4 e a nota sem guião */
{
  const j = JSON.parse(ler(`${PASTA}/correcoes-c.json`) ?? '{}');
  const reguas = j.reguas ?? [];
  const planta = reguas.find((r) => r.nome.startsWith('C4 · a planta'));
  medida('l2b_c_regua_correcoes_c_codigo', codigo(`${PASTA}/correcoes-c.codigo`), `node tests/municipio/correcoes-c.mjs --json ${PASTA}/correcoes-c.json`, 'a régua tem a planta da lista mãe escondida', Boolean(planta));
  medida('l2b_c_regua_correcoes_c_reguas', reguas.length, 'idem · réguas', 'idem', reguas.length > 0);
  medida('l2b_c_regua_correcoes_c_reguas_que_passam', reguas.filter((r) => r.passa).length, 'idem · passa', 'idem', reguas.length > 0);
  medida('l2b_c_planta_da_lista_mae_escondida_resultados_a_vista', j.medidas?.c4_planta_lista_mae_escondida?.evora ?? 'NÃO LIDO', 'idem · os resultados de «evora» à vista com o guião plantado', 'a planta correu', Boolean(planta));
  const nota = { pt: t('pt').ambito.pesquisaSemGuiao, en: t('en').ambito.pesquisaSemGuiao };
  /* O CONTEÚDO DE UM `<noscript>` É TEXTO CRU PARA O LEITOR, por omissão: `node-html-parser` guarda-o sem o
     partir em elementos, e um `querySelector` lá dentro não acha nada. Lê-se com o `<noscript>` fora dos blocos
     de texto, e o conhecido-positivo é a mesma leitura sobre uma página escrita aqui, com a nota à vista. */
  const daNota = (html, texto) => {
    const p = parse(html, { blockTextElements: { script: true, style: true } }).querySelector('noscript [data-busca-sem-guiao]');
    return Boolean(p && p.text.trim() === texto && !(p.getAttribute('class') ?? '').split(/\s+/).includes('vh'));
  };
  const positivo = daNota(`<form><noscript><p class="busca-sem-guiao" data-busca-sem-guiao>${nota.pt}</p></noscript></form>`, nota.pt);
  let aVista = 0;
  for (const [lang, f] of [['pt', 'dist/lugares/index.html'], ['en', 'dist/en/places/index.html']]) {
    if (daNota(ler(f) ?? '<p></p>', nota[lang])) aVista++;
  }
  medida('l2b_c_notas_sem_guiao_a_vista_em_lugares', aVista, 'dist/lugares e dist/en/places · noscript [data-busca-sem-guiao], o texto da cadeia e sem a classe vh, com o noscript lido como elementos', 'o mesmo detetor vê a nota numa página escrita no guião', positivo);
  medida('l2b_c_notas_sem_guiao_no_livro_razao_dos_concelhos', (ler('dist/livro-razao/concelhos/index.html') ?? '').split('data-busca-sem-guiao').length - 1, 'dist/livro-razao/concelhos · data-busca-sem-guiao (a pesquisa sem formulário não leva a nota)', 'a página existe', fs.existsSync('dist/livro-razao/concelhos/index.html'));
  const v = JSON.parse(ler(`${PASTA}/planta-voz-nota.json`) ?? '{}');
  medida('l2b_c_planta_da_voz_codigo', v.codigo ?? 'NÃO LIDO', `${PASTA}/planta-voz-nota.json · node scripts/check-voz.mjs com a linha da nota tirada do inventário`, 'a mordida diz bloco por classificar', (v.mordida ?? []).some((m) => m.includes('bloco por classificar')));
  medida('l2b_c_planta_da_voz_inventario_reposto', v.antes && v.antes === v.reposto ? 'sim' : 'não', 'idem · o sha256 do inventário antes e depois', 'idem', Boolean(v.antes));
}

/* ------------------------------------------------------------- (c) as frases dos cartões */
{
  const frase = (chave, lang) => MEDIDAS_DO_CONCELHO.find((m) => m.chave === chave).nota[lang].join('');
  const conta = { poderDeCompra: 0, ganho: 0, antigas: 0 };
  const antigas = ['Poder de compra per capita, publicado pelo INE para todos os concelhos.', 'Purchasing power per capita, published for every municipality.', 'trabalhadores por conta de outrem a tempo completo com remuneração completa.', 'full-time employees on full pay.'];
  const concelhos = JSON.parse(ler('src/data/concelhos.gerado.json'));
  for (const lang of ['pt', 'en']) {
    for (const c of concelhos) {
      const html = ler(lang === 'pt' ? `dist/municipios/${c.slug}/index.html` : `dist/en/municipalities/${c.slug}/index.html`);
      if (!html) continue;
      const root = parse(html);
      for (const chave of ['poderDeCompra', 'ganho']) {
        if (root.querySelector(`[data-medida-chave="${chave}"] .cartao-medida-frase`)?.text.trim() === frase(chave, lang)) conta[chave]++;
      }
      for (const a of antigas) if (html.includes(a)) conta.antigas++;
    }
  }
  medida('l2b_c_cartoes_do_poder_de_compra_com_a_frase_nova', conta.poderDeCompra, 'as páginas de concelho · .cartao-medida-frase do poder de compra igual à nota declarada', 'a nota nova diz cem', /cem/.test(frase('poderDeCompra', 'pt')));
  medida('l2b_c_cartoes_do_ganho_com_a_frase_nova', conta.ganho, 'idem, no ganho médio', 'a nota nova diz antes de descontos', /antes de descontos/.test(frase('ganho', 'pt')));
  medida('l2b_c_frases_antigas_nas_paginas_de_concelho', conta.antigas, 'idem · as quatro frases antigas, procuradas no HTML', 'o detetor vê a frase nova', conta.poderDeCompra > 0);
}

/* ------------------------------------------------------------- (d) o relatório */
{
  /* Só o que o ponto (d) corrigiu: as secções do L2b (o relatório até à secção da L2b-b) e a resposta curta do
     L2b. A secção da L2b-c cita a expressão errada para dizer o que mudou, e não conta. */
  const leia = ler(`${PAI}/LEIA-ME.md`) ?? '';
  const doL2b = leia.slice(0, leia.indexOf('## L2b-b ·') >= 0 ? leia.indexOf('## L2b-b ·') : undefined);
  const r = `${doL2b}\n${ler(`${PAI}/RESPOSTA-construtor-l2b.md`) ?? ''}`;
  medida('l2b_c_mencoes_de_quatro_cartoes_sem_valor', (r.match(/quatro cartões sem valor/g) ?? []).length, `${PAI}/LEIA-ME.md até à secção da L2b-b, e RESPOSTA-construtor-l2b.md · «quatro cartões sem valor»`, 'as secções do L2b dizem três', /três cartões sem valor/.test(r));
}

/* ------------------------------------------------------------- as capturas e o mapa */
{
  const m = JSON.parse(ler(`${PASTA}/capturas.json`) ?? '{}');
  const r = m.resultados ?? [];
  medida('l2b_c_capturas', m.capturas ?? 'NÃO LIDO', 'node design/especime-v3/medicoes/l2b-2026-10-01/captar-l2b.mjs l2b-c', 'há uma captura de Penedono a 390 px em português', r.some((x) => x.pagina === 'penedono' && x.lang === 'pt' && x.largura === 390));
  medida('l2b_c_problemas_nas_capturas', (m.problemas ?? ['NÃO LIDO']).length, 'idem · problemas', 'o manifesto tem resultados', r.length > 0);
  for (const pagina of ['evora', 'penedono']) {
    const x = r.find((y) => y.pagina === pagina && y.lang === 'pt' && y.largura === 390);
    medida(`l2b_c_altura_${pagina}_pt_390`, x?.medidas?.altura ?? 'NÃO LIDO', 'idem · a altura da página a 390 px, em português', 'a captura existe', Boolean(x));
  }
  const mapa = ler(`${PASTA}/conferir-mapa.txt`) ?? '';
  const n = (re) => { const x = re.exec(mapa); return x ? Number(x[1]) : 'NÃO LIDO'; };
  medida('l2b_c_mapa_citacoes_na_linha', n(/citações conferidas na linha citada \(±7\): (\d+)/), `python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md > ${PASTA}/conferir-mapa.txt`, 'o mapa diz a autoridade do portão', /DIRECOES_DO_PORTAO/.test(ler('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md') ?? ''));
  medida('l2b_c_mapa_citacoes_longe_ou_perdidas', [n(/longe da linha citada: (\d+)/), n(/não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/)].reduce((a, b) => (typeof a === 'number' && typeof b === 'number' ? a + b : 'NÃO LIDO')), 'idem · longe mais perdidas', 'idem', mapa.length > 0);
}

/* ------------------------------------------------------------- os portões */
const segundosEntre = (a, b) => {
  const i = ler(a);
  const f = ler(b);
  return i && f ? Math.round((Date.parse(f.trim()) - Date.parse(i.trim())) / 1000) : 'NÃO LIDO';
};
const PORTOES = `${PAI}/portoes/l2b-c`;
for (const g of ['build', 'verify', 'typecheck']) {
  medida(`l2b_c_portao_${g}_codigo`, codigo(`${PORTOES}/${g}.codigo`), `sh scripts/leituras/portoes.sh <worktree> <pasta>, copiado para ${PORTOES}`, 'o ficheiro da cabeça da corrida existe', ler(`${PORTOES}/cabeca`) !== null);
  medida(`l2b_c_portao_${g}_segundos`, segundosEntre(`${PORTOES}/${g}.inicio`, `${PORTOES}/${g}.fim`), `idem · ${g}.fim menos ${g}.inicio`, 'idem', ler(`${PORTOES}/cabeca`) !== null);
}

/* ------------------------------------------------------------- o custo */
{
  const i = JSON.parse(ler(`${PASTA}/custo-inicio.json`) ?? '{}');
  const f = JSON.parse(ler(`${PASTA}/custo-fim.json`) ?? '{}');
  const gasto = f.contador_parado
    ? 'NÃO MEDIDO: o contador que a ferramenta mostra ao agente não andou durante a passagem'
    : typeof i.simbolos_restantes_no_inicio === 'number' && typeof f.simbolos_restantes_no_fim === 'number' ? i.simbolos_restantes_no_inicio - f.simbolos_restantes_no_fim : 'NÃO LIDO';
  const segundos = i.inicio_utc && f.fim_utc ? Math.round((Date.parse(f.fim_utc) - Date.parse(i.inicio_utc)) / 1000) : 'NÃO LIDO';
  medida('l2b_c_simbolos_gastos', gasto, `${PASTA}/custo-inicio.json menos ${PASTA}/custo-fim.json (as duas leituras do contador)`, 'as duas leituras existem', typeof i.simbolos_restantes_no_inicio === 'number' && typeof f.simbolos_restantes_no_fim === 'number');
  medida('l2b_c_segundos_de_parede', segundos, 'idem · fim_utc menos inicio_utc', 'idem', typeof segundos === 'number');
}

const saida = { passagem: 'L2b-c', cabeca, construcao: versao.commit ?? null, guiao: `${PASTA}/medir-l2b-c.mjs`, medidas };
fs.writeFileSync(process.env.OEDP_MEDIDAS_JSON ?? `${PASTA}/medidas.json`, JSON.stringify(saida, null, 2) + '\n');
const calados = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
console.log(`L2b-c: ${medidas.length} medidas, ${calados.length} conhecidos-positivos por achar${calados.length ? `: ${calados.join(', ')}` : ''}.`);
process.exitCode = calados.length ? 1 : 0;
