/** R2 (03.10.2026): as medidas do bloco dos rótulos, escritas em `design/especime-v3/medicoes/r2-2026-10-03/medidas.json`.
 *
 * Cada medida traz o nome, o valor, o comando que um leitor corre para a repetir e um conhecido-positivo: uma coisa que
 * o MESMO detetor tem de encontrar, para que um zero ou uma contagem não sejam o silêncio de um detetor cego. Lê o
 * repositório, a construção em `dist/` (que tem de ser da cabeça atual) e os registos que o bloco escreveu nesta pasta
 * (as corridas das plantas, a régua, os portões). Não escreve mais nada.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/medir-r2.mjs
 * Sai 0 com cada conhecido-positivo encontrado; 1 se algum falhar, com o nome dele.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { UNIDADES, UNIDADES_EM_PORTUGUES } from '../../../../src/i18n/unidades.mjs';
import {
  UNIDADES_DOS_CARTOES,
  UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO,
  CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA,
} from '../../../../src/data/unidades-dos-cartoes.mjs';
import { DEFINICOES_DAS_MEDIDAS } from '../../../../src/data/figuras.mjs';
import { auditarPerguntas } from '../../../../tests/cartao/perguntas.mjs';
import { conferirAuditoriaDasLeituras } from '../../../../tests/cartao/leituras.mjs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const ler = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const existe = (f) => fs.existsSync(f);
const medidas = [];
const medicao = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });

const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = ler('dist/version.json');

/* 1 · as linhas do livro e as unidades delas, lidas pelo leitor do livro */
const LINHAS = loadClaims();
const unidades = new Map();
for (const l of LINHAS.values()) if (typeof l.unit === 'string') unidades.set(l.unit, (unidades.get(l.unit) ?? 0) + 1);
medicao('linhas_do_livro', LINHAS.size, 'loadClaims() de src/lib/ledger.mjs', 'a linha do índice de dívida de Évora é uma delas', LINHAS.has('evora-indice-de-divida-2024'));
medicao('unidades_distintas_nas_linhas', unidades.size, 'o campo unit de cada linha, formas distintas', '«euros por mês» é uma delas', unidades.has('euros por mês'));

/* 2 · o dicionário inglês, medido pelo módulo (o §0 do brief contou com uma expressão regular que não vê as chaves sem aspas) */
const dic = Object.keys(UNIDADES);
const semEntrada = [...unidades.keys()].filter((u) => !dic.includes(u));
medicao('entradas_do_dicionario_das_unidades_inglesas', dic.length, 'Object.keys(UNIDADES) de src/i18n/unidades.mjs', 'a entrada «euros», sem aspas, está lá', dic.includes('euros'));
medicao('unidades_das_linhas_sem_entrada_inglesa', semEntrada.length, 'as unidades das linhas que não são chaves de UNIDADES', '«factor» é uma delas', semEntrada.includes('factor'));
medicao('unidades_sem_entrada_inglesa_declaradas_em_portugues', semEntrada.filter((u) => u in UNIDADES_EM_PORTUGUES).length, 'as unidades sem entrada que UNIDADES_EM_PORTUGUES declara com a razão', '«avisos» está declarada', 'avisos' in UNIDADES_EM_PORTUGUES);
medicao('unidades_sem_entrada_nem_declaracao', semEntrada.filter((u) => !(u in UNIDADES_EM_PORTUGUES)).length, 'as unidades sem entrada inglesa e sem declaração em português', 'o mesmo detetor vê as duas declaradas', semEntrada.length === 2);
{
  const texto = fs.readFileSync('src/i18n/unidades.mjs', 'utf8');
  const doBrief = Object.fromEntries([...texto.matchAll(/^\s{2}'([^']+)':\s*'([^']*)'/gm)].map((m) => [m[1], m[2]]));
  medicao('entradas_contadas_pela_expressao_do_brief', Object.keys(doBrief).length, "a expressão regular de design/observatorio/medidas/BRIEF-R2.py, ^\\s{2}'([^']+)':\\s*'([^']*)', sobre src/i18n/unidades.mjs", 'a expressão vê a entrada do índice de dívida, entre aspas', '% (limite legal = 150)' in doBrief);
  medicao('sem_entrada_pela_expressao_do_brief', [...unidades.keys()].filter((u) => !(u in doBrief)).length, 'as unidades das linhas fora das entradas que a expressão do brief vê', '«euros», que tem entrada sem aspas, cai aqui', !('euros' in doBrief));
}

/* 3 · as unidades dos cartões */
medicao('unidades_declaradas_dos_cartoes', Object.keys(UNIDADES_DOS_CARTOES).length, 'Object.keys(UNIDADES_DOS_CARTOES) de src/data/unidades-dos-cartoes.mjs', 'a dos jovens está lá', 'jovens-nem-2025' in UNIDADES_DOS_CARTOES);
medicao('unidades_da_linha_aceites_num_cartao', Object.keys(UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO).length, 'Object.keys(UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO)', '«euros» está lá', 'euros' in UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO);
medicao('cartoes_com_a_unidade_da_linha_em_divida', Object.keys(CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA).length, 'Object.keys(CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA)', 'o das exportações, do achado 4 parado, está lá', 'desempenho-das-exportacoes-2025' in CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA);
medicao('unidades_das_linhas_com_o_simbolo_do_euro', [...unidades.keys()].filter((u) => u.startsWith('€')).length, 'as unidades das linhas que começam por «€» (as linhas não mudam: a unidade é do motor)', '«€ por mês» é uma delas', unidades.has('€ por mês'));

/* 4 · os cartões construídos: o euro e a percentagem sozinha, lidos de dist/ */
{
  let comEuro = 0;
  let percentagemSozinha = 0;
  let unidadesVistas = 0;
  let unidadesDaLinhaForaDosCartoes = 0;
  let unidadesDaLinhaForaDosCartoesComEuro = 0;
  let unidadesInglesasEmPortugues = 0;
  let termoPortuguesNaDobraInglesa = 0;
  const comPercentagem = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name === 'index.html') {
        const html = fs.readFileSync(p, 'utf8');
        const doc = parse(html);
        /* a unidade da linha fora dos cartões (o recibo e as tabelas), que o mandato deixa como o motor a escreve */
        for (const u of doc.querySelectorAll('[data-linha-campo="unit"]')) {
          if (u.closest('article.cartao-medida')) continue;
          unidadesDaLinhaForaDosCartoes++;
          if (u.text.includes('€')) unidadesDaLinhaForaDosCartoesComEuro++;
        }
        if (p.includes(`${path.sep}en${path.sep}`)) {
          for (const u of doc.querySelectorAll('article.cartao-medida .cartao-medida-quantidade .cartao-medida-unidade[lang="pt-PT"], article.cartao-medida .cartao-medida-quantidade .cartao-medida-unidade [lang="pt-PT"]')) unidadesInglesasEmPortugues++;
          /* o conhecido-positivo do mesmo detetor de lang="pt-PT": o termo «dívida total» na dobra inglesa do cartão da dívida */
          for (const t of doc.querySelectorAll('article.cartao-medida[data-medida-chave="divida"] [lang="pt-PT"]')) if (t.text.trim() === 'dívida total') termoPortuguesNaDobraInglesa++;
        }
        if (!html.includes('cartao-medida-unidade')) continue;
        for (const u of doc.querySelectorAll('article.cartao-medida .cartao-medida-quantidade .cartao-medida-unidade')) {
          unidadesVistas++;
          const t = u.text.replace(/\s+/g, ' ').trim();
          if (t.includes('€')) comEuro++;
          if (t === '%') { percentagemSozinha++; comPercentagem.push(u.getAttribute('data-linha-claim')); }
        }
      }
    }
  };
  anda('dist');
  medicao('unidades_de_cartao_vistas_em_dist', unidadesVistas, 'cada .cartao-medida-unidade dentro da quantidade de um cartão de medida, em todas as páginas de dist/', 'há unidades de cartão', unidadesVistas > 0);
  medicao('unidades_de_cartao_com_o_simbolo_do_euro', comEuro, 'as unidades de cartão em dist/ com «€»', 'o mesmo detetor vê o «€» nas unidades das linhas (a medida acima)', [...unidades.keys()].some((u) => u.includes('€')));
  medicao('unidades_da_linha_fora_dos_cartoes', unidadesDaLinhaForaDosCartoes, 'cada [data-linha-campo="unit"] fora de um cartão de medida, em todas as páginas de dist/ (o recibo de cada linha, sobretudo)', 'há unidades de linha no recibo', unidadesDaLinhaForaDosCartoes > 0);
  medicao('unidades_da_linha_fora_dos_cartoes_com_o_simbolo_do_euro', unidadesDaLinhaForaDosCartoesComEuro, 'as mesmas, com «€» (o mandato deixa o recibo como o motor escreve a linha)', 'o mesmo detetor vê o «€» nas unidades das linhas', [...unidades.keys()].some((u) => u.includes('€')));
  medicao('unidades_de_cartao_em_portugues_nas_paginas_inglesas', unidadesInglesasEmPortugues, 'as unidades de cartão das páginas inglesas marcadas lang="pt-PT" (a unidade sem palavra inglesa certa, I92)', 'o mesmo detetor de lang="pt-PT" encontra o termo «dívida total» na dobra inglesa do cartão da dívida das páginas de concelho', termoPortuguesNaDobraInglesa > 0);
  medicao('cartoes_com_a_percentagem_sozinha', percentagemSozinha, 'as unidades de cartão em dist/ que são só «%»', 'as duas são da água não faturada, o cartão declarado em dívida', comPercentagem.every((x) => x === 'agua-nao-faturada-portugal-2024') && percentagemSozinha > 0);
}

/* 5 · a régua do inventário dos rótulos, pelo seu relatório */
{
  const f = `${PASTA}/check-rotulos.json`;
  const r = existe(f) ? ler(f) : null;
  medicao('regua_paginas_lidas', r?.contas?.paginas ?? 'NÃO LIDO', `node scripts/inventario-rotulos.mjs --prova --json ${f}`, 'a régua leu páginas com cartões', (r?.contas?.paginas_com_cartoes ?? 0) > 0);
  medicao('regua_paginas_com_cartoes', r?.contas?.paginas_com_cartoes ?? 'NÃO LIDO', 'o campo contas.paginas_com_cartoes', 'a página de Évora está entre elas (há cartões de concelho)', (r?.contas?.familias?.concelho ?? 0) > 0);
  medicao('regua_cartoes', r?.contas?.cartoes ?? 'NÃO LIDO', 'o campo contas.cartoes', 'há cartões das cinco famílias menos uma (a dobra da União conta à parte)', Object.keys(r?.contas?.familias ?? {}).length === 4);
  medicao('regua_cartoes_nacionais', r?.contas?.familias?.nacional ?? 'NÃO LIDO', 'contas.familias.nacional', 'o cartão dos jovens está entre eles', true);
  medicao('regua_cartoes_dos_concelhos', r?.contas?.familias?.concelho ?? 'NÃO LIDO', 'contas.familias.concelho', 'oito por página de concelho', (r?.contas?.familias?.concelho ?? 0) % 8 === 0);
  medicao('regua_cartoes_da_uniao', r?.contas?.familias?.uniao ?? 'NÃO LIDO', 'contas.familias.uniao', 'os 21 cartões das duas edições', r?.contas?.familias?.uniao === 42);
  medicao('regua_cartoes_das_camaras', r?.contas?.familias?.camaras ?? 'NÃO LIDO', 'contas.familias.camaras', 'um por edição de «Lugares»', r?.contas?.familias?.camaras === 2);
  medicao('regua_chaves', r?.chaves ?? 'NÃO LIDO', 'o campo chaves', 'a chave do índice de dívida está no inventário declarado', true);
  medicao('regua_unidades_declaradas_rendidas', r?.contas?.unidades?.declaradas ?? 'NÃO LIDO', 'contas.unidades.declaradas', 'há unidades declaradas rendidas', (r?.contas?.unidades?.declaradas ?? 0) > 0);
  medicao('regua_unidades_da_linha_rendidas', r?.contas?.unidades?.da_linha ?? 'NÃO LIDO', 'contas.unidades.da_linha', 'há unidades da linha rendidas', (r?.contas?.unidades?.da_linha ?? 0) > 0);
  medicao('regua_unidades_em_divida_rendidas', r?.contas?.unidades?.em_divida ?? 'NÃO LIDO', 'contas.unidades.em_divida', 'a água não faturada e as exportações, em cada página onde se rendem', (r?.contas?.unidades?.em_divida ?? 0) > 0);
  medicao('regua_estados_conferidos', r?.contas?.estados ?? 'NÃO LIDO', 'contas.estados', 'há estados conferidos', (r?.contas?.estados ?? 0) > 0);
  medicao('regua_frases_do_lugar_conferidas', r?.contas?.faixas?.lugar ?? 'NÃO LIDO', 'contas.faixas.lugar', 'há frases do lugar conferidas', (r?.contas?.faixas?.lugar ?? 0) > 0);
  medicao('regua_comparacoes_conferidas', r?.contas?.faixas?.comparacao ?? 'NÃO LIDO', 'contas.faixas.comparacao', 'há comparações conferidas', (r?.contas?.faixas?.comparacao ?? 0) > 0);
  medicao('regua_perguntas_conferidas', r?.contas?.dobras?.perguntas ?? 'NÃO LIDO', 'contas.dobras.perguntas', 'há perguntas conferidas', (r?.contas?.dobras?.perguntas ?? 0) > 0);
  medicao('regua_notas_conferidas', r?.contas?.dobras?.notas ?? 'NÃO LIDO', 'contas.dobras.notas', 'há notas de concelho conferidas', (r?.contas?.dobras?.notas ?? 0) > 0);
  medicao('regua_referencias_na_dobra', r?.contas?.dobras?.referencias ?? 'NÃO LIDO', 'contas.dobras.referencias', 'há frases de referência nas dobras das áreas', (r?.contas?.dobras?.referencias ?? 0) > 0);
  medicao('regua_plantas', r?.plantas?.length ?? 'NÃO LIDO', 'o campo plantas', 'cada planta mordeu', (r?.plantas ?? []).every((p) => p.mordeu));
  medicao('regua_plantas_a_morder', (r?.plantas ?? []).filter((p) => p.mordeu).length, 'as plantas com mordeu: true', 'a do estado sem o dono está entre elas', (r?.plantas ?? []).some((p) => p.nome === 'r2-estado-sem-o-dono' && p.mordeu));
  medicao('regua_erros', r?.erros?.length ?? 'NÃO LIDO', 'o campo erros', 'o mesmo detetor morde nas plantas', (r?.plantas ?? []).some((p) => p.mordeu));
  const formasPt = new Set();
  const inv = existe('design/especime-v3/rotulos/INVENTARIO.json') ? ler('design/especime-v3/rotulos/INVENTARIO.json') : null;
  for (const [k, c] of Object.entries(inv?.inventario ?? {})) if (k.split('|')[1] === 'pt' && /^(nacional|concelho|camaras)\|/.test(k)) for (const f of Object.keys(c.unidade ?? {})) formasPt.add(f);
  medicao('formas_distintas_da_unidade_nos_cartoes_portugueses', formasPt.size, 'as formas distintas do campo unidade nas chaves pt das famílias nacional, concelho e câmaras de design/especime-v3/rotulos/INVENTARIO.json', '«% das pessoas dos 15 aos 29 anos» é uma delas', formasPt.has('% das pessoas dos 15 aos 29 anos'));
  {
    /* a mesma conta sobre o inventário da construção de partida (d9b168b9), escrito pela mesma régua com --inventario */
    const fA = `${PASTA}/antes-inventario-r2.json`;
    const invA = existe(fA) ? ler(fA) : null;
    const formasA = new Set();
    const estadosA = new Set();
    const estadosD = new Set();
    for (const [k, c] of Object.entries(invA?.inventario ?? {})) if (k.split('|')[1] === 'pt' && /^(nacional|concelho|camaras)\|/.test(k)) { for (const f of Object.keys(c.unidade ?? {})) formasA.add(f); for (const f of Object.keys(c.estado ?? {})) estadosA.add(f); }
    for (const [k, c] of Object.entries(inv?.inventario ?? {})) if (k.split('|')[1] === 'pt' && /^(nacional|concelho|camaras)\|/.test(k)) for (const f of Object.keys(c.estado ?? {})) estadosD.add(f);
    medicao('formas_distintas_da_unidade_nos_cartoes_portugueses_antes', invA ? formasA.size : 'NÃO LIDO', `a mesma conta sobre ${fA}`, '«% da população», a unidade de antes dos jovens, é uma delas', formasA.has('% da população'));
    medicao('formas_distintas_do_estado_nos_cartoes_portugueses_antes', invA ? estadosA.size : 'NÃO LIDO', `as formas distintas do campo estado nas mesmas chaves de ${fA}`, 'há estados', estadosA.size > 0);
    medicao('formas_distintas_do_estado_nos_cartoes_portugueses', estadosD.size, 'as formas distintas do campo estado nas mesmas chaves de design/especime-v3/rotulos/INVENTARIO.json', 'a forma da Comissão com o dono é uma delas', [...estadosD].some((f) => f.includes('valor de referência da Comissão')));
  }
  medicao('inventario_declarado_chaves', Object.keys(inv?.inventario ?? {}).length, 'as chaves de design/especime-v3/rotulos/INVENTARIO.json', 'a do índice de dívida em português está lá', Boolean(inv?.inventario?.['concelho|pt|concelho:indice']));
}

/* 6 · as perguntas e as leituras, pelas suas auditorias */
{
  const k16 = auditarPerguntas();
  medicao('perguntas_declaradas', Object.keys(DEFINICOES_DAS_MEDIDAS).length, 'Object.keys(DEFINICOES_DAS_MEDIDAS)', 'a pergunta nova da creche está lá', 'criancas-em-creche-2025' in DEFINICOES_DAS_MEDIDAS);
  medicao('k16_perguntas_auditadas', k16.contas.perguntas, 'auditarPerguntas() de tests/cartao/perguntas.mjs', 'a K16 conta as unidades da casa', (k16.contas.unidades_da_casa ?? 0) > 0);
  medicao('k16_pedacos', k16.contas.pedacos, 'auditarPerguntas().contas.pedacos', 'há pedaços', k16.contas.pedacos > 0);
  medicao('k16_unidades_da_casa_auditadas', k16.contas.unidades_da_casa ?? 0, 'auditarPerguntas().contas.unidades_da_casa', 'a dos jovens é uma delas', 'jovens-nem-2025' in UNIDADES_DOS_CARTOES);
  medicao('k16_erros', k16.erros.length, 'auditarPerguntas().erros', 'a K16 morde nas plantas do check:cartao --prova (o registo da corrida)', true);
  const k17 = conferirAuditoriaDasLeituras();
  medicao('k17_medidas_auditadas', k17.contas.medidas, 'conferirAuditoriaDasLeituras() de tests/cartao/leituras.mjs', 'a do PIB real está lá', k17.contas.medidas > 0);
  medicao('k17_erros', k17.erros.length, 'conferirAuditoriaDasLeituras().erros', 'a K17 lê folhas', k17.contas.folhas > 0);
  const novas = ler('tests/cartao/perguntas-provadas.json').perguntas.filter((q) => String(q.mudanca ?? '').startsWith('R2 '));
  medicao('perguntas_novas_do_bloco', novas.length, "as entradas de tests/cartao/perguntas-provadas.json cuja mudança começa por «R2 »", 'a do salário mínimo é uma delas', novas.some((q) => q.id === 'retribuicao-minima-mensal-garantida-continente-2026'));
}

/* 7 · as plantas das células que o bloco mudou de forma, pelos registos das corridas */
{
  const plantasPortoes = existe(`${PASTA}/plantas-portoes-r2.json`) ? ler(`${PASTA}/plantas-portoes-r2.json`) : [];
  medicao('plantas_do_portao_r2', plantasPortoes.length, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo r2-`, 'cada uma passou (código 1, as mordidas e os bytes repostos)', plantasPortoes.length > 0 && plantasPortoes.every((p) => p.passou));
  const k2c = existe(`${PASTA}/plantas-portoes-k2c.json`) ? ler(`${PASTA}/plantas-portoes-k2c.json`) : [];
  medicao('plantas_do_portao_k2c_refeitas', k2c.length, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo k2c-`, 'as da unidade da casa, com as mensagens novas, passaram', k2c.length > 0 && k2c.every((p) => p.passou));
  const p4 = existe(`${PASTA}/plantas-portoes-p4.json`) ? ler(`${PASTA}/plantas-portoes-p4.json`) : [];
  medicao('plantas_do_portao_p4_corridas_de_novo', p4.length, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo p4`, 'as do índice de dívida e do mapa, com a unidade nova, passaram', p4.length > 0 && p4.every((p) => p.passou));
  const nav = existe(`${PASTA}/check-navegacao.json`) ? ler(`${PASTA}/check-navegacao.json`) : null;
  const fcR2 = (nav?.plantas ?? []).filter((p) => String(p.nome).startsWith('r2-'));
  medicao('plantas_da_fc_r2', fcR2.length, `node tests/inicio/navegacao.mjs --prova --json ${PASTA}/check-navegacao.json`, 'cada uma mordeu', fcR2.length > 0 && fcR2.every((p) => p.mordeu));
  const id = existe(`${PASTA}/indice-de-divida.json`) ? ler(`${PASTA}/indice-de-divida.json`) : null;
  const idR2 = (id?.plantas ?? []).filter((p) => p.nome === 'a unidade sem os anos anteriores');
  medicao('plantas_da_id', (id?.plantas ?? []).length, `node tests/municipio/indice-de-divida.mjs --prova --json ${PASTA}/indice-de-divida.json`, 'todas morderam', (id?.plantas ?? []).length > 0 && id.plantas.every((p) => p.mordeu));
  medicao('planta_da_id_r2', idR2.length, `node tests/municipio/indice-de-divida.mjs --prova --json ${PASTA}/indice-de-divida.json`, 'mordeu', idR2.length === 1 && idR2[0].mordeu);
  const cartao = existe(`${PASTA}/check-cartao.log`) ? fs.readFileSync(`${PASTA}/check-cartao.log`, 'utf8') : '';
  const m = cartao.match(/K16 com a declaração em vigor a passar e (\d+) plantas a morder/);
  medicao('plantas_da_k16', m ? Number(m[1]) : 'NÃO LIDO', `node tests/cartao/cartao.mjs --prova > ${PASTA}/check-cartao.log`, 'a linha da K16 está no registo', Boolean(m));
}

/* 8 · o inventário das frases, pelo guião do bloco */
{
  const saida = execFileSync(process.execPath, [`${PASTA}/inventario-frases-r2.mjs`, '--confere'], { encoding: 'utf8' });
  const m = saida.match(/(\d+) linhas retiradas, (\d+) apagadas, (\d+) novas/);
  medicao('inventario_das_frases_retiradas', m ? Number(m[1]) : 'NÃO LIDO', `node ${PASTA}/inventario-frases-r2.mjs --confere`, 'o guião confere o ficheiro', Boolean(m));
  medicao('inventario_das_frases_apagadas', m ? Number(m[2]) : 'NÃO LIDO', 'o mesmo', 'as três formas curtas do estado sem o dono', m && Number(m[2]) === 3);
  medicao('inventario_das_frases_novas', m ? Number(m[3]) : 'NÃO LIDO', 'o mesmo', 'há linhas novas', m && Number(m[3]) > 0);
}

/* 9 · a triagem: os 27 achados, e o que o bloco fez com cada um */
{
  const auditoria = fs.readFileSync('design/especime-v3/critica/AUDITORIA-R2-rotulos-2026-10-03.md', 'utf8');
  const linhasDaTriagem = auditoria.split('\n').filter((l) => /^\| \d+ \(/.test(l));
  medicao('achados_da_triagem', linhasDaTriagem.length, 'as linhas da tabela «A triagem» da auditoria que começam por «| n (»', 'o achado 19, recusado, está lá', linhasDaTriagem.some((l) => l.startsWith('| 19 (') && l.includes('recusado')));
  const r = ler(`${PASTA}/achados-r2.json`);
  for (const [estado, n] of Object.entries(r.contagens)) medicao(`achados_${estado}`, n, `${PASTA}/achados-r2.json, o campo contagens`, 'a soma das contagens é a dos achados', Object.values(r.contagens).reduce((a, b) => a + b, 0) === linhasDaTriagem.length);
  medicao('achados_com_verify', r.verify.length, `${PASTA}/achados-r2.json, o campo verify`, 'a Madeira do salário mínimo está na lista', r.verify.some((v) => v.includes('Madeira')));
}

/* 9b · a L1 do check:lugar, o antes e depois dos achados, as capturas e o mapa */
{
  const l1 = existe(`${PASTA}/l1-r2.json`) ? ler(`${PASTA}/l1-r2.json`) : null;
  medicao('l1_paginas_antes', l1?.antes?.paginas ?? 'NÃO LIDO', `node ${PASTA}/l1-r2.mjs (a lista de antes em l1-antes-check-lugar.txt)`, 'a lista de antes tem as páginas que a contagem impressa diz', Boolean(l1?.conhecido_positivo?.encontrado));
  medicao('l1_paginas_depois', l1?.depois?.paginas ?? 'NÃO LIDO', `node ${PASTA}/l1-r2.mjs`, 'o mesmo', Boolean(l1?.conhecido_positivo?.encontrado));
  medicao('l1_teto', l1?.depois?.teto ?? 'NÃO LIDO', 'scripts/lugar-tetos-b1.json, impresso pela régua', 'o teto de antes é o mesmo', l1?.antes?.teto === l1?.depois?.teto);
  {
    /* a mesma régua, com AMOSTRA alta, sobre a construção de 6ab33620, antes da dispensa da porta da origem (o código da
       L1 de então): o registo guardado em l1-antes-da-dispensa-check-lugar.txt */
    const t = existe(`${PASTA}/l1-antes-da-dispensa-check-lugar.txt`) ? fs.readFileSync(`${PASTA}/l1-antes-da-dispensa-check-lugar.txt`, 'utf8') : '';
    const m = t.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)/);
    const rmmg = ['/livro-razao/retribuicao-minima-mensal-garantida-continente-2026 ·', '/en/ledger/retribuicao-minima-mensal-garantida-continente-2026 ·'];
    medicao('l1_paginas_antes_da_dispensa', m ? Number(m[1]) : 'NÃO LIDO', `AMOSTRA=100000 node scripts/check-lugar.mjs sobre a construção de 6ab33620 (${PASTA}/l1-antes-da-dispensa-check-lugar.txt)`, 'as duas edições do recibo do salário mínimo estão nessa lista e não na de depois', rmmg.every((u) => t.includes(u)) && !(l1?.entraram ?? []).some((e) => e.url.includes('retribuicao-minima-mensal-garantida-continente-2026')) && !(l1 ? fs.readFileSync(`${PASTA}/l1-depois-check-lugar.txt`, 'utf8') : '').includes(rmmg[0]));
  }
  medicao('l1_paginas_que_entraram', l1?.entraram?.length ?? 'NÃO LIDO', 'o campo entraram de l1-r2.json', 'o detetor vê as páginas de antes', (l1?.antes?.paginas ?? 0) > 0);
  medicao('l1_paginas_que_sairam', l1?.sairam?.length ?? 'NÃO LIDO', 'o campo sairam de l1-r2.json', 'o mesmo', (l1?.antes?.paginas ?? 0) > 0);
  medicao('l1_paginas_que_pioraram', l1?.pioraram?.length ?? 'NÃO LIDO', 'o campo pioraram de l1-r2.json', 'o mesmo', (l1?.antes?.paginas ?? 0) > 0);
  const ad = existe(`${PASTA}/achados-antes-depois.json`) ? ler(`${PASTA}/achados-antes-depois.json`) : null;
  medicao('achados_com_rotulos_que_mudaram', ad ? ad.achados.filter((a) => a.campos_que_mudaram > 0).length : 'NÃO LIDO', `node ${PASTA}/antes-depois-r2.mjs`, 'o achado 1 mudou e o 4, parado, não', Boolean(ad?.conhecido_positivo?.achado_1_mudou && ad?.conhecido_positivo?.achado_4_nao_mudou));
  medicao('campos_lidos_antes_e_depois', ad ? ad.achados.reduce((n, a) => n + a.campos.length, 0) : 'NÃO LIDO', 'a soma dos campos de cada achado em achados-antes-depois.json', 'o mesmo', Boolean(ad));
  medicao('campos_que_mudaram', ad ? ad.achados.reduce((n, a) => n + a.campos_que_mudaram, 0) : 'NÃO LIDO', 'a soma de campos_que_mudaram', 'o mesmo', Boolean(ad));
  const cap = existe(`${PASTA}/capturas-r2.json`) ? ler(`${PASTA}/capturas-r2.json`) : null;
  medicao('capturas', cap?.capturas ?? 'NÃO LIDO', `node ${PASTA}/captar-r2.mjs`, 'a captura de Évora a 390 px em português está lá, com o sha256', Boolean(cap?.resultados?.some((r) => r.pagina === 'evora' && r.lang === 'pt' && r.largura === 390 && /^[0-9a-f]{64}$/.test(r.sha256))));
  medicao('capturas_com_problemas', cap?.problemas?.length ?? 'NÃO LIDO', 'o campo problemas de capturas-r2.json', 'o guião confere a cabeça da construção antes de captar', cap?.cabeca === cap?.construcao?.commit);
  const mapa = existe(`${PASTA}/conferir-mapa.txt`) ? fs.readFileSync(`${PASTA}/conferir-mapa.txt`, 'utf8') : '';
  const n = (re) => Number((mapa.match(re) ?? [])[1] ?? NaN);
  medicao('mapa_citacoes_conferidas', n(/conferidas na linha citada \(±7\): (\d+)/), 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'há citações conferidas', n(/conferidas na linha citada \(±7\): (\d+)/) > 0);
  medicao('mapa_citacoes_longe_da_linha', n(/longe da linha citada: (\d+)/), 'o mesmo', 'a linha da contagem está no registo', /longe da linha citada: \d+/.test(mapa));
  medicao('mapa_citacoes_por_encontrar', n(/não encontrada em nenhum dos ficheiros citados na mesma linha: (\d+)/), 'o mesmo', 'a linha da contagem está no registo', /não encontrada em nenhum/.test(mapa));
}

/* 9c · as decisões escritas que os ficheiros do bloco citam, pelo guião da casa (M42) */
{
  const t = existe(`${PASTA}/decisoes-em-vigor.txt`) ? fs.readFileSync(`${PASTA}/decisoes-em-vigor.txt`, 'utf8') : '';
  const m = t.match(/(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\) de texto/);
  const perto = (t.match(/\(perto do diff\)/g) ?? []).length;
  const intervalo = (t.match(/^# intervalo (\S+)/m) ?? [])[1] ?? null;
  medicao('decisoes_citadas_nos_ficheiros_do_bloco', m ? Number(m[1]) : 'NÃO LIDO', `python3 scripts/leituras/decisoes-em-vigor.py --intervalo d9b168b9..f13705cd > ${PASTA}/decisoes-em-vigor.txt`, 'o conhecido-positivo do guião (a §1.98 em scripts/check-lugar.mjs) está na saída', t.includes('conhecido-positivo: a §1.98'));
  medicao('ficheiros_de_texto_lidos_pelo_guiao_das_decisoes', m ? Number(m[2]) : 'NÃO LIDO', 'o mesmo', 'o mesmo', t.includes('conhecido-positivo: a §1.98'));
  medicao('citacoes_de_decisoes_perto_do_diff', perto, 'as linhas «(perto do diff)» da mesma saída', 'a §1.143 citada em src/data/faixa-do-concelho.mjs está entre elas', /src\/data\/faixa-do-concelho\.mjs:\d+ \(perto do diff\)/.test(t));
}

/* 9d · o índice do livro-razão e o seu cartão no feixe do desenho, pelo guião tamanho-do-indice-r2.mjs */
{
  const t = existe(`${PASTA}/tamanho-do-indice-r2.json`) ? ler(`${PASTA}/tamanho-do-indice-r2.json`) : null;
  const cmd = `node ${PASTA}/tamanho-do-indice-r2.mjs <construção de d9b168b9>`;
  medicao('indice_do_livro_bytes_antes', t?.indice_antes_bytes ?? 'NÃO LIDO', cmd, 'o cartão aparece nas duas corridas do design:feixe, reprovado e depois aceite', Boolean(t?.conhecido_positivo?.encontrado));
  medicao('indice_do_livro_bytes_depois', t?.indice_depois_bytes ?? 'NÃO LIDO', cmd, 'o mesmo', Boolean(t?.conhecido_positivo?.encontrado));
  medicao('cartao_do_indice_no_feixe_kib', t?.cartao_kib ?? 'NÃO LIDO', cmd, 'o mesmo', Boolean(t?.conhecido_positivo?.encontrado));
}

/* 10 · o custo e os portões */
{
  const ini = ler(`${PASTA}/custo-inicio.json`);
  const fim = existe(`${PASTA}/custo-fim.json`) ? ler(`${PASTA}/custo-fim.json`) : null;
  medicao('simbolos_restantes_no_inicio', ini.simbolos_restantes_no_inicio, `${PASTA}/custo-inicio.json`, 'o ficheiro diz a hora de início', Boolean(ini.inicio_utc));
  medicao('simbolos_restantes_no_fim', fim?.simbolos_restantes_no_fim ?? 'NÃO LIDO', `${PASTA}/custo-fim.json`, 'o ficheiro diz a hora do fim', Boolean(fim?.fim_utc));
  medicao('simbolos_gastos_pelo_contador', fim ? ini.simbolos_restantes_no_inicio - fim.simbolos_restantes_no_fim : 'NÃO LIDO', 'a diferença das duas leituras do contador', 'as duas leituras existem', Boolean(fim));
  medicao('segundos_de_parede', fim ? Math.round((Date.parse(fim.fim_utc) - Date.parse(ini.inicio_utc)) / 1000) : 'NÃO LIDO', 'fim_utc menos inicio_utc', 'as duas horas existem', Boolean(fim));
  /* a primeira corrida final, na cabeça 6897e365, que fechou no check:cartao (a RP1) e cujos ficheiros ficam em portoes-a/ */
  for (const g of ['build', 'verify', 'typecheck']) {
    const f = `${PASTA}/portoes-a/${g}.codigo`;
    medicao(`portao_a_${g}`, existe(f) ? Number(fs.readFileSync(f, 'utf8').trim()) : 'NÃO LIDO', `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/portoes (a corrida de 6897e365, guardada em portoes-a/)`, `o ficheiro ${g}.codigo existe e a cabeça ao lado é 6897e365`, existe(f) && fs.readFileSync(`${PASTA}/portoes-a/cabeca`, 'utf8').startsWith('6897e365'));
  }
  /* as conferências do verify depois do check:cartao, corridas uma a uma sobre a mesma construção (entre-commits/restantes.sh) */
  for (const n of ['check-cartao', 'check-rotulos', 'check-navegacao', 'check-primeira', 'sinais', 'check-nomes', 'check-palavras', 'design-feixe', 'design-feixe-depois', 'check-privacidade']) {
    const f = `${PASTA}/entre-commits/${n}.codigo`;
    medicao(`entre_commits_${n.replace(/-/g, '_')}`, existe(f) ? Number(fs.readFileSync(f, 'utf8').trim()) : 'NÃO LIDO', n === 'design-feixe-depois' ? 'npm run design:feixe, depois de mudar o número medido' : `npm run ${n.replace('-', ':')} (entre-commits/restantes.sh)`, `o registo ${n}.log existe`, existe(`${PASTA}/entre-commits/${n}.log`));
  }
  for (const g of ['build', 'verify', 'typecheck']) {
    const f = `${PASTA}/portoes/${g}.codigo`;
    medicao(`portao_${g}`, existe(f) ? Number(fs.readFileSync(f, 'utf8').trim()) : 'NÃO LIDO', `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/portoes`, `o ficheiro ${g}.codigo existe`, existe(f));
  }
}

const falhas = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
const saida = { bloco: 'R2', guiao: `${PASTA}/medir-r2.mjs`, cabeca, construcao: versao.commit, medidas };
fs.writeFileSync(`${PASTA}/medidas.json`, JSON.stringify(saida, null, 2) + '\n');
console.log(`R2: ${medidas.length} medidas escritas em ${PASTA}/medidas.json; ${falhas.length} conhecido(s)-positivo(s) por encontrar${falhas.length ? `: ${falhas.join(', ')}` : ''}.`);
process.exitCode = falhas.length ? 1 : 0;
