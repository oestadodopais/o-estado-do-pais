/** R2-b (04.10.2026): as medidas da passagem de correção dos rótulos, escritas em
 * `design/especime-v3/medicoes/r2-2026-10-03/medidas.json`. As medidas do R2, como o R2 as entregou (escritas por
 * `medir-r2.mjs` na cabeça f61e014a e guardadas no commit 6a711d3e), ficam em `medidas-r2.json`, sem mudar.
 *
 * Cada medida traz o nome, o valor, o comando que um leitor corre para a repetir e um conhecido-positivo: uma coisa que
 * o MESMO detetor tem de encontrar, para que um zero ou uma contagem não sejam o silêncio de um detetor cego. Lê o
 * repositório, a construção em `dist/` (que tem de ser da cabeça atual) e os registos que a passagem escreveu nesta
 * pasta (as corridas das plantas, a régua, as conferências, as três construções). Não escreve mais nada.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/r2-2026-10-03/medir-r2b.mjs
 * Sai 0 com cada conhecido-positivo encontrado; 1 se algum falhar, com o nome dele.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  UNIDADES_DOS_CARTOES,
  CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA,
  NOMES_COM_A_VARIACAO_NA_UNIDADE,
} from '../../../../src/data/unidades-dos-cartoes.mjs';
import { TERMOS_DOS_CARTOES } from '../../../../src/data/termos-dos-cartoes.mjs';
import { DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO } from '../../../../src/data/dominios.mjs';
import { auditarPerguntas } from '../../../../tests/cartao/perguntas.mjs';

const PASTA = 'design/especime-v3/medicoes/r2-2026-10-03';
const ler = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const existe = (f) => fs.existsSync(f);
const texto = (f) => (existe(f) ? fs.readFileSync(f, 'utf8').replace(/\x1b\[[0-9;]*m/g, '') : '');
const codigo = (n) => (existe(`${PASTA}/${n}.codigo`) ? Number(fs.readFileSync(`${PASTA}/${n}.codigo`, 'utf8').trim()) : 'NÃO LIDO');
const medidas = [];
const medicao = (nome, valor, comando, o_que, encontrado) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que, encontrado: Boolean(encontrado) } });

const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = ler('dist/version.json');

/* 1 · a régua do inventário dos rótulos, pelo seu relatório desta passagem */
{
  const f = `${PASTA}/check-rotulos-r2b.json`;
  const r = existe(f) ? ler(f) : null;
  const cmd = `node scripts/inventario-rotulos.mjs --prova --json ${f}`;
  const c = r?.comparado_com_o_declarado ?? {};
  medicao('r2b_regua_paginas_lidas', r?.contas?.paginas ?? 'NÃO LIDO', cmd, 'a régua leu páginas com cartões', (r?.contas?.paginas_com_cartoes ?? 0) > 0);
  medicao('r2b_regua_cartoes', r?.contas?.cartoes ?? 'NÃO LIDO', `${cmd} (contas.cartoes)`, 'há cartões de concelho', (r?.contas?.familias?.concelho ?? 0) > 0);
  medicao('r2b_regua_chaves', r?.chaves ?? 'NÃO LIDO', `${cmd} (chaves)`, 'a régua comparou chaves com o declarado', (c.chaves ?? 0) > 0);
  medicao('r2b_regua_chaves_comparadas', c.chaves ?? 'NÃO LIDO', `${cmd} (comparado_com_o_declarado.chaves)`, 'a planta da chave declarada que não se rende mordeu', (r?.plantas ?? []).some((p) => p.nome === 'r2b-chave-declarada-que-nao-se-rende' && p.mordeu));
  medicao('r2b_regua_campos_comparados', c.campos ?? 'NÃO LIDO', `${cmd} (comparado_com_o_declarado.campos)`, 'o mesmo', (r?.plantas ?? []).some((p) => p.nome === 'r2b-concelho-sem-o-cartao' && p.mordeu));
  medicao('r2b_regua_formas_comparadas_com_a_contagem', c.formas ?? 'NÃO LIDO', `${cmd} (comparado_com_o_declarado.formas)`, 'a planta do concelho sem o cartão mordeu pela contagem', (r?.plantas ?? []).some((p) => p.nome === 'r2b-concelho-sem-o-cartao' && p.mordeu));
  medicao('r2b_regua_ocorrencias_comparadas', c.ocorrencias ?? 'NÃO LIDO', `${cmd} (comparado_com_o_declarado.ocorrencias)`, 'o mesmo', (c.ocorrencias ?? 0) > 0);
  medicao('r2b_regua_diferencas_do_declarado', r?.diferencas_do_declarado ?? 'NÃO LIDO', `${cmd} (diferencas_do_declarado)`, 'o mesmo detetor morde nas plantas da construção', (r?.plantas ?? []).filter((p) => p.nome.startsWith('r2b-') && p.mordeu).length > 0);
  medicao('r2b_regua_plantas', r?.plantas?.length ?? 'NÃO LIDO', `${cmd} (plantas)`, 'cada planta mordeu', (r?.plantas ?? []).every((p) => p.mordeu));
  medicao('r2b_regua_plantas_a_morder', (r?.plantas ?? []).filter((p) => p.mordeu).length, `${cmd} (plantas com mordeu)`, 'a do estado que falta num cartão nacional está entre elas', (r?.plantas ?? []).some((p) => p.nome === 'r2b-estado-que-falta-num-cartao-nacional' && p.mordeu));
  medicao('r2b_regua_plantas_novas', (r?.plantas ?? []).filter((p) => p.nome.startsWith('r2b-')).length, `${cmd} (plantas r2b-)`, 'a da ressalva escrita à mão está entre elas', (r?.plantas ?? []).some((p) => p.nome === 'r2b-ressalva-escrita-a-mao' && p.mordeu));
  medicao('r2b_regua_cartoes_com_a_faixa_inteira', r?.contas?.faixas?.presentes ?? 'NÃO LIDO', `${cmd} (contas.faixas.presentes)`, 'a planta da frase do lugar que falta mordeu', (r?.plantas ?? []).some((p) => p.nome === 'r2b-frase-do-lugar-que-falta' && p.mordeu));
  medicao('r2b_regua_termos_explicados', r?.contas?.dobras?.termos ?? 'NÃO LIDO', `${cmd} (contas.dobras.termos)`, 'a planta do termo repetido mordeu', (r?.plantas ?? []).some((p) => p.nome === 'r2b-termo-repetido' && p.mordeu));
  medicao('r2b_regua_faixas_dos_27', r?.contas?.faixas_dos_paises ?? 'NÃO LIDO', `${cmd} (contas.faixas_dos_paises)`, 'a planta da unidade da série na faixa mordeu', (r?.plantas ?? []).some((p) => p.nome === 'r2b-unidade-da-faixa-dos-paises-pela-serie' && p.mordeu));
  medicao('r2b_regua_unidades_declaradas_nas_faixas_dos_27', r?.contas?.unidades?.na_faixa_dos_paises ?? 'NÃO LIDO', `${cmd} (contas.unidades.na_faixa_dos_paises)`, 'o mesmo', (r?.contas?.unidades?.na_faixa_dos_paises ?? 0) > 0);
  medicao('r2b_regua_ressalvas_conferidas', r?.contas?.ressalvas ?? 'NÃO LIDO', `${cmd} (contas.ressalvas)`, 'a planta do diploma dos Açores dado como por ler mordeu', (r?.plantas ?? []).some((p) => p.nome === 'r2b-diploma-dos-acores-dado-como-por-ler' && p.mordeu));
  medicao('r2b_regua_erros', r?.erros?.length ?? 'NÃO LIDO', `${cmd} (erros)`, 'o mesmo detetor morde nas plantas', (r?.plantas ?? []).some((p) => p.mordeu));
}

/* 2 · as declarações */
{
  medicao('r2b_unidades_declaradas_dos_cartoes', Object.keys(UNIDADES_DOS_CARTOES).length, 'Object.keys(UNIDADES_DOS_CARTOES)', 'a da quota das exportações está lá', 'desempenho-das-exportacoes-2025' in UNIDADES_DOS_CARTOES);
  medicao('r2b_cartoes_com_a_unidade_da_linha_em_divida', Object.keys(CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA).length, 'Object.keys(CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA)', 'a água não faturada está lá', 'agua-nao-faturada-portugal-2024' in CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA);
  medicao('r2b_nomes_de_nivel', Object.keys(NOMES_COM_A_VARIACAO_NA_UNIDADE).length, 'Object.keys(NOMES_COM_A_VARIACAO_NA_UNIDADE)', 'o dos combustíveis está lá', 'ipc-combustiveis-variacao-homologa' in NOMES_COM_A_VARIACAO_NA_UNIDADE);
  medicao('r2b_termos_explicados_declarados', Object.keys(TERMOS_DOS_CARTOES).length, 'Object.keys(TERMOS_DOS_CARTOES)', 'o valor acrescentado bruto está lá', 'vab' in TERMOS_DOS_CARTOES);
  medicao('r2b_cartoes_dos_termos', Object.values(TERMOS_DOS_CARTOES).reduce((n, t) => n + t.cartoes.length, 0), 'a soma dos cartões de cada termo', 'os onze do PIB por habitante estão lá', TERMOS_DOS_CARTOES['paridade-do-poder-de-compra']?.cartoes.length === 11);
  medicao('r2b_regioes_na_lista_dos_diplomas', DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO.regioes.length, 'DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO.regioes', 'os Açores têm a origem declarada', DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO.regioes.some((r) => r.chave === 'acores' && r.origem === 'dre-dlr-37-2023-a'));
}

/* 3 · a K16, pelo seu leitor, e as suas plantas pelo registo do check:cartao */
{
  const k16 = auditarPerguntas();
  medicao('r2b_k16_perguntas', k16.contas.perguntas, 'auditarPerguntas() de tests/cartao/perguntas.mjs', 'a K16 conta as unidades da casa', (k16.contas.unidades_da_casa ?? 0) > 0);
  medicao('r2b_k16_unidades_da_casa', k16.contas.unidades_da_casa ?? 0, 'auditarPerguntas().contas.unidades_da_casa', 'a da quota das exportações é uma delas', 'desempenho-das-exportacoes-2025' in UNIDADES_DOS_CARTOES);
  medicao('r2b_k16_numeros_das_unidades_presos', k16.contas.numeros_das_unidades ?? 0, 'auditarPerguntas().contas.numeros_das_unidades', 'os 15 e 29 dos jovens contam (há números presos)', (k16.contas.numeros_das_unidades ?? 0) > 0);
  medicao('r2b_k16_erros', k16.erros.length, 'auditarPerguntas().erros', 'a planta das idades 21 a 65 mordeu no registo do check:cartao', /K16 com a declaração em vigor a passar e \d+ plantas a morder/.test(texto(`${PASTA}/check-cartao-r2b.log`)));
  const m = texto(`${PASTA}/check-cartao-r2b.log`).match(/K16 com a declaração em vigor a passar e (\d+) plantas a morder/);
  medicao('r2b_k16_plantas', m ? Number(m[1]) : 'NÃO LIDO', `npm run check:cartao > ${PASTA}/check-cartao-r2b.log`, 'a linha da K16 está no registo', Boolean(m));
  medicao('r2b_check_cartao', codigo('check-cartao-r2b'), 'npm run check:cartao (o check:cartao inteiro, com a RP1 e a C1)', 'o registo existe', existe(`${PASTA}/check-cartao-r2b.log`));
}

/* 4 · o portão de HTML: o autoteste da unidade, pelo registo da corrida do portão desta passagem */
{
  const t = texto(`${PASTA}/gate-html-r2b.log`);
  const m = t.match(/«dos 21 aos 65 anos» recusada \((\d+) falta\(s\)\)/);
  medicao('r2b_portao_autoteste_faltas_de_21_a_65', m ? Number(m[1]) : 'NÃO LIDO', `node scripts/gate-html.mjs > ${PASTA}/gate-html-r2b.log`, 'a linha do autoteste está no registo, com a origem de outra linha recusada', t.includes('a origem de outra linha recusada'));
  medicao('r2b_portao_html', codigo('gate-html-r2b'), 'node scripts/gate-html.mjs', 'o registo diz que não há algarismos sem proveniência', t.includes('nenhum algarismo sem proveniência'));
}

/* 5 · as plantas dos portões, pelos registos das corridas */
{
  /* As plantas l1- e rp1 não entram: estragam cartões da página dos temas, que é um índice sem cartões desde o bloco N1
     (30.09.2026), e rebentam antes de correr o portão; é uma dívida anterior ao R2, dita no relatório. */
  for (const p of ['r2b', 'r2', 'k2c', 'p4', 'ue2', 'l2b', 'lugar']) {
    const f = `${PASTA}/plantas-portoes-${p}.json`;
    const r = existe(f) ? ler(f) : [];
    medicao(`r2b_plantas_portoes_${p}`, r.length, `OEDP_MEDICOES=${PASTA} node tests/pais/portoes.mjs --prefixo ${p}`, 'cada uma passou (código 1, as mordidas e os bytes repostos)', r.length > 0 && r.every((x) => x.passou));
  }
}

/* 6 · a F20 do check:formas (a faixa dos 27), o check:lingua, o check:voz e o check:lugar */
{
  const formas = texto(`${PASTA}/check-formas-r2b.log`);
  const m = formas.match(/secção dos países \(F20\):[^\n]*?(\d+) plantas a morder/);
  medicao('r2b_check_formas', codigo('check-formas-r2b'), 'npm run check:formas', 'o registo diz a F20', /F20|países/.test(formas));
  medicao('r2b_f20_plantas', m ? Number(m[1]) : 'NÃO LIDO', `npm run check:formas > ${PASTA}/check-formas-r2b.log`, 'a linha das plantas da secção dos países está no registo', Boolean(m));
  medicao('r2b_check_lingua', codigo('check-lingua-r2b'), 'npm run check:lingua', 'o registo diz as unidades em português', texto(`${PASTA}/check-lingua-r2b.log`).includes('em português com razão escrita'));
  medicao('r2b_check_voz', codigo('check-voz-r2b'), 'npm run check:voz', 'o registo lista o bloco r2b entre as revisões', texto(`${PASTA}/check-voz-r2b.log`).includes('r2b'));
  const lugar = texto(`${PASTA}/check-lugar-r2b.log`);
  medicao('r2b_check_lugar', codigo('check-lugar-r2b'), 'npm run check:lugar', 'o registo diz a 8.4', lugar.includes('8.4 · definições de painel fora da declaração'));
}

/* 7 · as portas das origens e a L1, na entrega do R2 e depois da passagem */
{
  const e = existe(`${PASTA}/portas-entrega-r2b.json`) ? ler(`${PASTA}/portas-entrega-r2b.json`) : null;
  const d = existe(`${PASTA}/portas-depois-r2b.json`) ? ler(`${PASTA}/portas-depois-r2b.json`) : null;
  const cmd = `node ${PASTA}/portas-das-origens-r2b.mjs <saída> (OEDP_DIST para a construção da entrega)`;
  medicao('r2b_portas_origens', d?.origens ?? 'NÃO LIDO', cmd, 'a disparidade tem duas origens no mesmo endereço, nas duas construções', Boolean(e?.conhecido_positivo?.encontrado && d?.conhecido_positivo?.encontrado));
  medicao('r2b_portas_na_entrega', e?.portas ?? 'NÃO LIDO', cmd, 'o mesmo', Boolean(e?.conhecido_positivo?.encontrado));
  medicao('r2b_portas_depois', d?.portas ?? 'NÃO LIDO', cmd, 'o mesmo', Boolean(d?.conhecido_positivo?.encontrado));
  medicao('r2b_definicoes_com_porta_repetida_na_entrega', e?.involucros_com_porta_repetida ?? 'NÃO LIDO', cmd, 'o mesmo', Boolean(e?.conhecido_positivo?.encontrado));
  medicao('r2b_definicoes_com_porta_repetida_depois', d?.involucros_com_porta_repetida ?? 'NÃO LIDO', cmd, 'o mesmo detetor viu as repetidas na entrega', (e?.involucros_com_porta_repetida ?? 0) > 0);
  const l1 = existe(`${PASTA}/l1-r2b.json`) ? ler(`${PASTA}/l1-r2b.json`) : null;
  const c1 = `node ${PASTA}/l1-r2b.mjs`;
  medicao('r2b_l1_paginas_na_entrega', l1?.antes?.paginas ?? 'NÃO LIDO', c1, 'a lista da entrega tem as páginas que a contagem impressa diz', Boolean(l1?.conhecido_positivo?.encontrado));
  medicao('r2b_l1_paginas_depois', l1?.depois?.paginas ?? 'NÃO LIDO', c1, 'o mesmo', Boolean(l1?.conhecido_positivo?.encontrado));
  medicao('r2b_l1_teto', l1?.depois?.teto ?? 'NÃO LIDO', c1, 'o teto da entrega é o mesmo', l1?.antes?.teto === l1?.depois?.teto);
  medicao('r2b_l1_entraram', l1?.entraram?.length ?? 'NÃO LIDO', c1, 'o detetor vê as páginas da entrega', (l1?.antes?.paginas ?? 0) > 0);
  medicao('r2b_l1_sairam', l1?.sairam?.length ?? 'NÃO LIDO', c1, 'o mesmo', (l1?.antes?.paginas ?? 0) > 0);
  medicao('r2b_l1_pioraram', l1?.pioraram?.length ?? 'NÃO LIDO', c1, 'o mesmo', (l1?.antes?.paginas ?? 0) > 0);
  medicao('r2b_l1_melhoraram', l1?.melhoraram?.length ?? 'NÃO LIDO', c1, 'o recibo da disparidade salarial está entre as que melhoraram', (l1?.melhoraram ?? []).some((x) => x.url === '/livro-razao/disparidade-salarial-entre-sexos-2024'));
}

/* 8 · os achados, os pedidos ao motor e o antes e depois */
{
  const a = ler(`${PASTA}/achados-r2b.json`);
  for (const [estado, n] of Object.entries(a.contagens)) medicao(`r2b_achados_${estado}`, n, `${PASTA}/achados-r2b.json, o campo contagens`, 'a soma das contagens é a dos 27 achados', Object.values(a.contagens).reduce((x, y) => x + y, 0) === 27);
  const p = ler(`${PASTA}/pedidos-ao-motor-r2b.json`);
  medicao('r2b_pedidos_ao_motor', p.pedidos.length, `${PASTA}/pedidos-ao-motor-r2b.json`, 'o da Madeira é o primeiro', p.pedidos[0]?.linha === 'retribuicao-minima-mensal-garantida-continente-2026');
  const ad = existe(`${PASTA}/achados-antes-depois-r2b.json`) ? ler(`${PASTA}/achados-antes-depois-r2b.json`) : null;
  medicao('r2b_achados_com_rotulos_mudados_na_passagem', ad ? ad.achados.filter((x) => typeof x.achado === 'number' && x.campos_que_mudaram_na_r2b > 0).length : 'NÃO LIDO', `node ${PASTA}/antes-depois-r2b.mjs`, 'o achado 4 mudou na passagem e o 19 não mudou', Boolean(ad?.conhecido_positivo?.achado_4_mudou_na_r2b && ad?.conhecido_positivo?.achado_19_nao_mudou));
  medicao('r2b_campos_mudados_na_passagem', ad ? ad.achados.reduce((n, x) => n + x.campos_que_mudaram_na_r2b, 0) : 'NÃO LIDO', 'a soma de campos_que_mudaram_na_r2b', 'o mesmo', Boolean(ad));
  medicao('r2b_campos_lidos', ad ? ad.achados.reduce((n, x) => n + x.campos.length, 0) : 'NÃO LIDO', 'a soma dos campos de cada linha da tabela', 'o mesmo', Boolean(ad));
  medicao('r2b_campos_mudados_desde_o_inicio_do_bloco', ad ? ad.achados.reduce((n, x) => n + x.campos_que_mudaram, 0) : 'NÃO LIDO', 'a soma de campos_que_mudaram (antes contra depois)', 'o mesmo', Boolean(ad));
}

/* 9 · os registos: o inventário das frases, a auditoria da pergunta, as capturas, o mapa e as decisões em vigor */
{
  const inv = texto(`${PASTA}/inventario-frases-r2b-confere.log`).match(/(\d+) linhas retiradas, (\d+) apagada, (\d+) novas/);
  medicao('r2b_frases_retiradas', inv ? Number(inv[1]) : 'NÃO LIDO', `node ${PASTA}/inventario-frases-r2b.mjs --confere`, 'o guião confere o ficheiro', Boolean(inv));
  medicao('r2b_frases_apagadas', inv ? Number(inv[2]) : 'NÃO LIDO', 'o mesmo', 'a palavra «Fundo»', inv && Number(inv[2]) === 1);
  medicao('r2b_frases_novas', inv ? Number(inv[3]) : 'NÃO LIDO', 'o mesmo', 'há linhas novas', inv && Number(inv[3]) > 0);
  const aud = texto(`${PASTA}/auditoria-das-perguntas-r2b-confere.log`).match(/(\d+) perguntas auditadas, (\d+) pedaços, (\d+) apoios/);
  medicao('r2b_pergunta_auditada_pedacos', aud ? Number(aud[2]) : 'NÃO LIDO', `node ${PASTA}/auditoria-das-perguntas-r2b.mjs --confere`, 'o guião confere a entrada', Boolean(aud));
  medicao('r2b_pergunta_auditada_apoios', aud ? Number(aud[3]) : 'NÃO LIDO', 'o mesmo', 'o mesmo', Boolean(aud));
  const cap = existe(`${PASTA}/capturas-r2b.json`) ? ler(`${PASTA}/capturas-r2b.json`) : null;
  medicao('r2b_capturas', cap?.capturas ?? 'NÃO LIDO', `node ${PASTA}/captar-r2b.mjs`, 'a do recibo do salário mínimo a 390 px em português está lá, com o sha256', Boolean(cap?.resultados?.some((r) => r.pagina === 'recibo-salario' && r.lang === 'pt' && r.largura === 390 && /^[0-9a-f]{64}$/.test(r.sha256))));
  medicao('r2b_capturas_com_problemas', cap?.problemas?.length ?? 'NÃO LIDO', 'o campo problemas de capturas-r2b.json', 'o guião confere a cabeça da construção antes de captar', cap?.cabeca === cap?.construcao?.commit);
  const mapa = texto(`${PASTA}/conferir-mapa.txt`);
  const n = (re) => Number((mapa.match(re) ?? [])[1] ?? NaN);
  medicao('r2b_mapa_citacoes_conferidas', n(/conferidas na linha citada \(±7\): (\d+)/), 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md', 'há citações conferidas', n(/conferidas na linha citada \(±7\): (\d+)/) > 0);
  medicao('r2b_mapa_citacoes_longe_da_linha', n(/longe da linha citada: (\d+)/), 'o mesmo', 'a linha da contagem está no registo', /longe da linha citada: \d+/.test(mapa));
  const dec = texto(`${PASTA}/decisoes-em-vigor-r2b.txt`);
  const md = dec.match(/(\d+) decisão\(ões\) citada\(s\) em (\d+) ficheiro\(s\) de texto/);
  medicao('r2b_decisoes_citadas', md ? Number(md[1]) : 'NÃO LIDO', `python3 scripts/leituras/decisoes-em-vigor.py --intervalo 6a711d3e..<cabeça do código> > ${PASTA}/decisoes-em-vigor-r2b.txt`, 'o conhecido-positivo do guião está na saída', dec.includes('conhecido-positivo: a §1.98'));
  medicao('r2b_decisoes_ficheiros_lidos', md ? Number(md[2]) : 'NÃO LIDO', 'o mesmo', 'o mesmo', dec.includes('conhecido-positivo: a §1.98'));
}

/* 10 · o custo e os portões da passagem */
{
  const ini = ler(`${PASTA}/custo-inicio-r2-b.json`);
  const fim = existe(`${PASTA}/custo-fim-r2-b.json`) ? ler(`${PASTA}/custo-fim-r2-b.json`) : null;
  medicao('r2b_simbolos_restantes_no_inicio', ini.simbolos_restantes_no_inicio, `${PASTA}/custo-inicio-r2-b.json`, 'o ficheiro diz a hora de início', Boolean(ini.inicio_utc));
  medicao('r2b_simbolos_restantes_no_fim', fim?.simbolos_restantes_no_fim ?? 'NÃO LIDO', `${PASTA}/custo-fim-r2-b.json`, 'o ficheiro diz a hora do fim', Boolean(fim?.fim_utc));
  medicao('r2b_simbolos_gastos', fim ? ini.simbolos_restantes_no_inicio - fim.simbolos_restantes_no_fim : 'NÃO LIDO', 'a diferença das duas leituras do contador', 'as duas leituras existem', Boolean(fim));
  medicao('r2b_segundos_de_parede', fim ? Math.round((Date.parse(fim.fim_utc) - Date.parse(ini.inicio_utc)) / 1000) : 'NÃO LIDO', 'fim_utc menos inicio_utc', 'as duas horas existem', Boolean(fim));
  for (const g of ['build', 'verify', 'typecheck']) {
    const f = `${PASTA}/portoes-b/${g}.codigo`;
    medicao(`r2b_portao_${g}`, existe(f) ? Number(fs.readFileSync(f, 'utf8').trim()) : 'NÃO LIDO', `sh scripts/leituras/portoes.sh <worktree> ${PASTA}/portoes-b`, `o ficheiro ${g}.codigo existe`, existe(f));
  }
}

const falhas = medidas.filter((m) => !m.conhecido_positivo.encontrado).map((m) => m.nome);
const saida = {
  bloco: 'R2-b',
  guiao: `${PASTA}/medir-r2b.mjs`,
  as_medidas_do_r2: `${PASTA}/medidas-r2.json (escritas por medir-r2.mjs na cabeça f61e014a, guardadas no commit 6a711d3e)`,
  cabeca,
  construcao: versao.commit,
  medidas,
};
fs.writeFileSync(`${PASTA}/medidas.json`, JSON.stringify(saida, null, 2) + '\n');
console.log(`R2-b: ${medidas.length} medidas escritas em ${PASTA}/medidas.json; ${falhas.length} conhecido(s)-positivo(s) por encontrar${falhas.length ? `: ${falhas.join(', ')}` : ''}.`);
process.exitCode = falhas.length ? 1 : 0;
