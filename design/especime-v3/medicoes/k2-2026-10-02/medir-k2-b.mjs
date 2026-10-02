/** K2-b: as medidas da passagem, escritas em `medidas-k2-b.json` ao lado deste guião. Cada medição traz o nome, o valor,
 * o comando que a repete e um conhecido-positivo: o mesmo detetor sobre a construção da cabeça do relatório do K2
 * (`a6b4de99`, guardada fora do repositório, e o ficheiro não a nomeia: guarda a cabeça que o seu `version.json` diz),
 * onde o defeito ainda estava, ou sobre a versão anterior de um ficheiro, lida por `git show`.
 * Uso, da raiz da worktree, depois de construir a cabeça da passagem:
 *   node design/especime-v3/medicoes/k2-2026-10-02/medir-k2-b.mjs <pasta da construção do K2> */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';

const [DIST_K2] = process.argv.slice(2);
if (!DIST_K2) throw new Error('Uso: medir-k2-b.mjs <pasta da construção do K2>');
const D = 'design/especime-v3/medicoes/k2-2026-10-02';
const DIST = 'dist';
const lerJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const versao = lerJson(path.join(DIST, 'version.json'));
const versaoK2 = lerJson(path.join(DIST_K2, 'version.json'));
const medidas = [];
const medicao = (nome, valor, comando, oQue, encontrado, extra = {}) =>
  medidas.push({ nome, valor, comando, conhecido_positivo: { o_que: oQue, encontrado: Boolean(encontrado) }, ...extra });
const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const paginas = (dist) => {
  const out = [];
  const anda = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) anda(f); else if (e.name.endsWith('.html')) out.push(path.relative(dist, f)); } };
  anda(dist);
  return out.filter((rel) => !/(^|\/)estudos\/[^/]+\/documento\/|(^|\/)en\/studies\/[^/]+\/document\//.test(rel)).sort();
};

/* 1 · A CÉLULA DO FORMATO (F4 e F5) na construção da passagem e na do K2. */
const { conferirFormatoDosNumeros, plantasDoFormato } = await import(pathToFileURL(path.resolve('tests/inicio/formato-dos-numeros.mjs')).href);
const agora = conferirFormatoDosNumeros(DIST);
const k2 = conferirFormatoDosNumeros(DIST_K2);
const plantas = plantasDoFormato(DIST);
const por = (r, regra) => r.desvios.filter((d) => d.regra === regra).length;
medicao('valores_com_o_percento_colado', por(agora, 'F4'), 'node tests/inicio/formato-dos-numeros.mjs --prova (a F4)',
  `a mesma célula na construção do K2 acha ${por(k2, 'F4')}`, por(k2, 'F4') > 0, { antes: por(k2, 'F4'), simbolo: agora.contas.simbolo, simbolo_antes: k2.contas.simbolo });
medicao('valores_com_o_euro_ao_lado', por(agora, 'F5'), 'node tests/inicio/formato-dos-numeros.mjs --prova (a F5)',
  `a mesma célula na construção do K2 acha ${por(k2, 'F5')}`, por(k2, 'F5') > 0, { antes: por(k2, 'F5'), paginas_antes: [...new Set(k2.desvios.filter((d) => d.regra === 'F5').map((d) => d.rel))] });
medicao('plantas_do_formato_que_morderam', plantas.filter((p) => p.mordeu).length, 'node tests/inicio/formato-dos-numeros.mjs --prova (as plantas em memória)',
  'as plantas da F5 são das que mordem', plantas.filter((p) => p.nome.startsWith('F5') && p.mordeu).length === 2, { de: plantas.length, plantas: plantas.map((p) => ({ nome: p.nome, mordeu: p.mordeu })) });

/* 2 · O «%» COLADO NOS TÍTULOS, NAS DESCRIÇÕES E NOS OUTROS ATRIBUTOS, e no texto visível fora das fontes. */
function colados(dist) {
  const c = { titulos: 0, atributos: 0, texto_fora_das_fontes: 0, texto_nas_fontes: 0 };
  for (const rel of paginas(dist)) {
    const html = fs.readFileSync(path.join(dist, rel), 'utf8');
    const t = /<title>([^<]*)<\/title>/.exec(html);
    if (t && /\d%/.test(t[1])) c.titulos++;
    for (const m of html.matchAll(/\b(content|aria-label|title|alt)="([^"]*)"/g)) if (/\d%(?![0-9A-F]{2})/.test(m[2])) c.atributos++;
    const raiz = parse(html);
    for (const s of raiz.querySelectorAll('script, style, title')) s.remove();
    const pilha = [raiz];
    while (pilha.length) {
      const n = pilha.pop();
      if (n.nodeType === 3) {
        const re = /\d%(?![0-9A-F]{2})/g;
        for (const m of n.rawText.matchAll(re)) {
          void m;
          let p = n.parentNode, fonte = false;
          while (p && p.tagName) {
            const a = p.attributes ?? {};
            if (Object.keys(a).some((k) => k.startsWith('data-registo')) || a['data-linha-campo'] === 'excerpt' || (a.class ?? '').includes('excerto') || p.tagName === 'Q') { fonte = true; break; }
            p = p.parentNode;
          }
          fonte ? c.texto_nas_fontes++ : c.texto_fora_das_fontes++;
        }
      } else if (n.childNodes) for (const ch of n.childNodes) pilha.push(ch);
    }
  }
  return c;
}
const coladosAgora = colados(DIST);
const coladosK2 = colados(DIST_K2);
medicao('titulos_com_o_percento_colado', coladosAgora.titulos, 'cada <title> das páginas construídas, à procura de um algarismo colado a «%»',
  `o mesmo detetor na construção do K2 acha ${coladosK2.titulos}`, coladosK2.titulos > 0, { antes: coladosK2.titulos });
medicao('atributos_com_o_percento_colado', coladosAgora.atributos, 'os atributos content, aria-label, title e alt das páginas construídas, à procura de um algarismo colado a «%» (um endereço codificado, «%2C», não conta)',
  `o mesmo detetor na construção do K2 acha ${coladosK2.atributos}`, coladosK2.atributos > 0, { antes: coladosK2.atributos });
medicao('texto_visivel_com_o_percento_colado_fora_das_fontes', coladosAgora.texto_fora_das_fontes, 'o texto visível das páginas construídas, fora dos excertos, das citações (<q>), das transcrições dos estudos (data-registo) e dos endereços codificados',
  `o mesmo detetor conta ${coladosAgora.texto_nas_fontes} dentro das fontes, que ficam como a fonte as escreve`, coladosAgora.texto_nas_fontes > 0, { nas_fontes: coladosAgora.texto_nas_fontes, antes: coladosK2.texto_fora_das_fontes, nas_fontes_antes: coladosK2.texto_nas_fontes });

/* 3 · O DINHEIRO COM A PALAVRA nas unidades rendidas: os campos de unidade e os títulos com o símbolo. */
function simbolos(dist) {
  const c = { campos_de_unidade: 0, titulos: 0 };
  for (const rel of paginas(dist)) {
    const html = fs.readFileSync(path.join(dist, rel), 'utf8');
    c.campos_de_unidade += (html.match(/data-linha-campo="unit">€/g) ?? []).length;
    const t = /<title>([^<]*)<\/title>/.exec(html);
    if (t && /€/.test(t[1])) c.titulos++;
  }
  return c;
}
const eurosAgora = simbolos(DIST);
const eurosK2 = simbolos(DIST_K2);
medicao('campos_de_unidade_com_o_simbolo_do_euro', eurosAgora.campos_de_unidade, 'os campos data-linha-campo="unit" das páginas construídas que começam por «€»',
  `o mesmo detetor na construção do K2 acha ${eurosK2.campos_de_unidade}`, eurosK2.campos_de_unidade > 0, { antes: eurosK2.campos_de_unidade, titulos: eurosAgora.titulos, titulos_antes: eurosK2.titulos });
const linhasComSimbolo = fs.readdirSync('ledger/claims').filter((f) => f.endsWith('.yml')).map((f) => load(fs.readFileSync(`ledger/claims/${f}`, 'utf8'))).filter((l) => /^€/.test(String(l.unit ?? '')));
medicao('linhas_do_livro_com_o_simbolo_na_unidade', linhasComSimbolo.length, 'ledger/claims/*.yml: as linhas cuja unidade começa por «€» (ficam como o motor as escreveu; a palavra é da formatação)',
  'uma delas é a da remuneração média', linhasComSimbolo.some((l) => l.id === 'remuneracao-bruta-mensal-media'), { linhas: linhasComSimbolo.map((l) => `${l.id} · ${l.unit}`) });

/* 4 · OS NOMES QUE DIZEM A VARIAÇÃO, pelo detetor do K2 (medir-k2.mjs, medida 2), nas páginas de assunto. */
const { ENTRADAS } = await import(pathToFileURL(path.resolve('src/data/primeira-pagina.mjs')).href);
const rotas = ENTRADAS.filter((e) => e.seccoes?.length).map((e) => e.rota.pt.replace(/^\//, ''));
function variacao(dist) {
  const out = new Map();
  for (const r of rotas) {
    const f = path.join(dist, r, 'index.html');
    if (!fs.existsSync(f)) continue;
    for (const c of parse(fs.readFileSync(f, 'utf8')).querySelectorAll('article[data-cartao-medida]')) {
      const id = c.getAttribute('data-cartao-medida');
      const nome = normal(c.querySelector('.cartao-medida-nome')?.textContent);
      const unidade = normal(c.querySelector('[data-linha-campo="unit"]')?.textContent);
      if ((/variaç/i.test(unidade) || /variacao/.test(id)) && !/variaç|inflaç|crescimento/i.test(nome)) out.set(id, nome);
      else if (/variaç/i.test(unidade) || /variacao/.test(id)) out.set(`ok:${id}`, nome);
    }
  }
  return out;
}
const vAgora = variacao(DIST);
const vK2 = variacao(DIST_K2);
const sob = (m) => [...m.keys()].filter((k) => !k.startsWith('ok:'));
medicao('cartoes_nacionais_com_variacao_sob_nome_de_nivel', sob(vAgora).length, 'as páginas de assunto construídas: os cartões cuja unidade diz «variação» ou cuja linha é uma variação de preços, e cujo nome não diz a variação, a inflação nem o crescimento',
  `o mesmo detetor na construção do K2 acha ${sob(vK2).length}`, sob(vK2).length > 0, { antes: sob(vK2), nomes_agora: Object.fromEntries([...vAgora.entries()].filter(([k]) => ['ok:desempenho-das-exportacoes-2025', 'ok:ipc-alimentacao-variacao-homologa', 'ok:ipc-energia-em-casa-variacao-homologa', 'ok:ipc-combustiveis-variacao-homologa', 'ok:ipc-rendas-variacao-homologa', 'ok:ipc-sem-habitacao-variacao-media-12-meses'].includes(k)).map(([k, v]) => [k.slice(3), v])) });
const NOMES = {
  pt: ['Quota nas exportações, variação em três anos', 'Preços dos alimentos e das bebidas não alcoólicas, variação num ano', 'Preços da energia em casa, variação num ano', 'Preços dos combustíveis, variação num ano', 'Preços das rendas, variação num ano', 'Preços sem a habitação, variação média em doze meses'],
  en: ['Share of exports, three-year change', 'Prices of food and non-alcoholic beverages, change over a year', 'Home energy prices, change over a year', 'Fuel prices, change over a year', 'Rent prices, change over a year', 'Prices excluding housing, twelve-month average change'],
};
const ondeRende = (dist, nome) => paginas(dist).filter((rel) => fs.readFileSync(path.join(dist, rel), 'utf8').includes(nome)).length;
const rendidos = Object.fromEntries(['pt', 'en'].flatMap((lang) => NOMES[lang].map((n) => [n, ondeRende(DIST, n)])));
medicao('nomes_novos_rendidos_em_paginas', Object.values(rendidos).filter((n) => n > 0).length, 'os doze nomes novos (seis por edição), contados nas páginas construídas onde aparecem',
  'o mesmo detetor acha o nome antigo «Preços dos combustíveis» na construção do K2', ondeRende(DIST_K2, 'Preços dos combustíveis') > 0, { de: 12, paginas_por_nome: rendidos });

/* 5 · A LINHA DO K2 NO REGISTO DAS REVISÕES DO INVENTÁRIO. */
const linhaK2 = (texto) => texto.split('\n').find((l) => l.startsWith('| k2 |')) ?? '';
const revisoes = fs.readFileSync('design/especime-v3/critica/REVISOES-DO-INVENTARIO.md', 'utf8');
const revisoesK2 = execFileSync('git', ['show', 'cc7734fe:design/especime-v3/critica/REVISOES-DO-INVENTARIO.md'], { encoding: 'utf8' });
medicao('linha_k2_do_inventario_aprovada', linhaK2(revisoes).includes('aprovada como está'), 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md · a linha «k2»',
  'o mesmo leitor acha «por ler» na linha do K2 na cabeça cc7734fe', linhaK2(revisoesK2).includes('por ler'));

/* 6 · AS CAPTURAS, AS DECISÕES, O CUSTO E OS PORTÕES, dos ficheiros. */
const cap = lerJson(`${D}/capturas-k2-b.json`);
medicao('capturas_k2_b', cap.capturas, `node ${D}/captar-k2.mjs k2-b`, 'o manifesto das capturas de depois do K2 tem 40', lerJson(`${D}/capturas-depois.json`).capturas === 40,
  { problemas: cap.problemas.length, larguras: cap.larguras, cabeca: cap.cabeca, pedidos_recusados_para_fora: cap.pedidos_recusados_para_fora });
if (fs.existsSync(`${D}/decisoes-em-vigor-k2-b.txt`)) {
  const dec = fs.readFileSync(`${D}/decisoes-em-vigor-k2-b.txt`, 'utf8').split('\n').filter((l) => l.startsWith('§'));
  medicao('decisoes_citadas_nos_ficheiros_tocados_pela_k2_b', dec.length, 'python3 scripts/leituras/decisoes-em-vigor.py --intervalo cc7734fe..<cabeça>', 'a §1.127 está na lista', dec.some((l) => l.startsWith('§1.127 ')));
}
const ci = lerJson(`${D}/custo-inicio-k2-b.json`);
if (fs.existsSync(`${D}/custo-fim-k2-b.json`)) {
  const cf = lerJson(`${D}/custo-fim-k2-b.json`);
  medicao('simbolos_gastos_na_k2_b_ate_ao_relatorio', ci.simbolos_restantes_no_inicio - cf.simbolos_restantes_no_fim, `${D}/custo-inicio-k2-b.json e ${D}/custo-fim-k2-b.json (a diferença das duas leituras do contador)`,
    'o contador do fim é menor do que o do início', ci.simbolos_restantes_no_inicio > cf.simbolos_restantes_no_fim, { segundos: Math.round((Date.parse(cf.fim_utc) - Date.parse(ci.inicio_utc)) / 1000) });
}
const P = `${D}/portoes/k2-b`;
if (fs.existsSync(`${P}/build.codigo`)) {
  const codigoDe = (f) => Number(fs.readFileSync(f, 'utf8').trim());
  const p = (g) => ({ codigo: codigoDe(`${P}/${g}.codigo`), segundos: Math.round((Date.parse(fs.readFileSync(`${P}/${g}.fim`, 'utf8').trim()) - Date.parse(fs.readFileSync(`${P}/${g}.inicio`, 'utf8').trim())) / 1000) });
  const g = { build: p('build'), verify: p('verify'), typecheck: p('typecheck'), cabeca: fs.readFileSync(`${P}/cabeca`, 'utf8').trim(), cabeca_no_fim: fs.readFileSync(`${P}/cabeca.fim`, 'utf8').trim() };
  medicao('portoes_a_zero_na_k2_b', ['build', 'verify', 'typecheck'].filter((k) => g[k].codigo === 0).length, `sh scripts/leituras/portoes.sh <worktree> ${P}`,
    'o mesmo leitor de códigos lê o 1 de alvos-intermedio.codigo, a corrida intermédia do check:alvos do K2 que falhou', codigoDe(`${D}/alvos-intermedio.codigo`) === 1 && g.cabeca === g.cabeca_no_fim, { portoes: g });
}

const saida = { passagem: 'K2-b', cabeca, construcao: { commit: versao.commit, construido_em: versao.construido_em }, construcao_do_k2: { commit: versaoK2.commit }, medidas };
fs.writeFileSync(`${D}/medidas-k2-b.json`, JSON.stringify(saida, null, 2) + '\n');
for (const m of medidas) console.log(`${m.conhecido_positivo.encontrado ? '·' : '✗'} ${m.nome}: ${JSON.stringify(m.valor)}`);
process.exitCode = medidas.every((m) => m.conhecido_positivo.encontrado) ? 0 : 1;
