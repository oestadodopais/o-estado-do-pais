/**
 * ---------------------------------------------------------------------------
 * O NOME OFICIAL QUE UMA PÁGINA MOSTRA É UM NOME CONFIRMADO DAQUELA LINHA
 * ---------------------------------------------------------------------------
 * O QUE ISTO FECHA, MEDIDO E NÃO SUPOSTO. A 21.09.2026 o lugar de direção
 * encontrou três nomes do INE no ar que eram de OUTROS indicadores: a formação
 * bruta de capital fixo em percentagem do PIB com o nome de um indicador mensal
 * da construção (no recibo e como título de um cartão de área), a taxa de
 * emprego com o de uma série mensal de outro grupo etário, e o risco de pobreza
 * ou exclusão com o da definição antiga. O motor (`indicators/enquadramento.py`)
 * tinha lido esses nomes na lista de resultados da busca do portal do INE e
 * escrito em cada um o campo `aviso`: a marca da busca prova o tema, não prova
 * que seja a mesma medida, e essa conferência ficou por fazer. A marca
 * `correspondencia: "exata"` do ficheiro foi julgada para o nome da PORDATA. O
 * sítio lia `exata` para os dois e punha o do INE primeiro.
 *
 * PORQUE É QUE NENHUM PORTÃO O VIU. O motivo `nome-oficial-da-medida` de
 * `ledger/allowlist.yml` era uma DISPENSA: o portão do HTML conferia que o
 * motivo estava declarado e mais nada, e a célula 9 do `check:voz` conferia que
 * o título de um cartão era, carácter a carácter, um nome do ficheiro. As duas
 * provam a transcrição. Nenhuma perguntava se aquele nome do ficheiro estava
 * confirmado, e o estado de verificação vivia em prosa, num campo que nenhum
 * código lia.
 *
 * O QUE ESTA RÉGUA CONFERE, com leitor próprio (não chama
 * `src/lib/enquadramento.mjs`, pela regra de que uma conferência que usasse o
 * código das páginas confirmava-se a si própria):
 *
 *   N1 · cada `[data-nonledger="nome-oficial-da-medida"]` de um RECIBO
 *        (`/livro-razao/<id>`, `/en/ledger/<id>`) rende, carácter a carácter, o
 *        nome e o endereço de um nome CONFIRMADO daquela linha;
 *   N2 · cada título de cartão com `data-nome="oficial"` rende um nome confirmado
 *        da linha que o `data-de-linha` diz;
 *   N3 · o conhecido-positivo: a régua encontrou pelo menos um recibo e um cartão
 *        com nome oficial (um seletor que deixasse de ver as páginas daria verde
 *        por não ver nada);
 *   N4 · as plantas (`--prova`, que é como o `build` e o `verify` a chamam): um
 *        nome com aviso num recibo, o mesmo num cartão, um nome confirmado de
 *        OUTRA linha, e um objeto com `mesma_medida: false` têm de ser recusados,
 *        e a página certa tem de passar.
 *
 * UM NOME CONFIRMADO é o de um indicador com `correspondencia: "exata"`, num
 * objeto (`nome_ine` ou `nome_pordata`) com nome, endereço e hora de leitura, sem
 * campo `aviso` e sem `mesma_medida: false`. O que falta para um nome do INE
 * voltar a entrar é o motor confirmá-lo como a mesma medida (conceito, unidade,
 * população e periodicidade, lidos nos metadados do INE por quem não escolheu o
 * nome) e exportá-lo sem aviso.
 *
 * Uso:  node scripts/check-nomes-oficiais.mjs [--prova]
 *       OEDP_DIST=<dir> mede outra construção.
 * Sai com 1 em qualquer falha. Precisa de `dist/` construído.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OEDP_DIST ? path.resolve(process.env.OEDP_DIST) : path.join(RAIZ, 'dist');
const FICHEIRO = path.join(RAIZ, 'src', 'data', 'enquadramento', 'nomes.json');
const MOTIVO = 'nome-oficial-da-medida';
const FONTES = [
  ['nome_ine', 'INE'],
  ['nome_pordata', 'PORDATA'],
];

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/**
 * Lê o ficheiro do motor e separa os nomes confirmados dos recusados, com a
 * razão de cada recusa. Um campo sem nome nenhum (ausente ou `[verify]`) não é
 * uma recusa: é uma ausência, e a página não tem o que render.
 *
 * @param {any} j
 */
function lerNomes(j) {
  /** @type {Map<string, { nome: string, endereco: string, fonte: string }[]>} */
  const confirmados = new Map();
  /** @type {{ id: string, fonte: string, nome: string, porque: string }[]} */
  const recusados = [];
  for (const i of j?.indicadores ?? []) {
    const id = i?.id_da_linha;
    if (typeof id !== 'string' || id === '') continue;
    for (const [campo, fonte] of FONTES) {
      const o = i?.[campo];
      if (!o || typeof o !== 'object') continue;
      const nome = o.nome;
      if (typeof nome !== 'string' || nome.trim() === '' || nome === '[verify]') continue;
      let porque = null;
      if (i.correspondencia !== 'exata') porque = `a correspondência da medida é «${i.correspondencia ?? 'sem marca'}» e não «exata»`;
      else if (typeof o.aviso === 'string' && o.aviso.trim() !== '')
        porque = 'o motor escreveu um aviso: a conferência de ser a mesma medida ficou por fazer';
      else if (o.mesma_medida === false) porque = 'o motor marcou «mesma_medida: false»';
      else if (typeof o.endereco !== 'string' || o.endereco === '' || typeof o.lido_em !== 'string' || o.lido_em === '')
        porque = 'falta o endereço ou a hora de leitura';
      if (porque) recusados.push({ id, fonte, nome, porque });
      else {
        if (!confirmados.has(id)) confirmados.set(id, []);
        confirmados.get(id).push({ nome, endereco: o.endereco, fonte });
      }
    }
  }
  return { confirmados, recusados };
}

/** O identificador da linha de um recibo, pelo caminho da página, ou `null`. */
function linhaDoCaminho(relativo) {
  const m = /^(?:livro-razao|en\/ledger)\/([^/]+)\/index\.html$/.exec(relativo.split(path.sep).join('/'));
  if (!m || m[1] === 'concelhos' || m[1] === 'municipalities') return null;
  return m[1];
}

/**
 * Confere uma página. Devolve os erros e quantos elementos de cada forma viu.
 *
 * @param {string} html
 * @param {string} relativo  o caminho da página dentro de `dist/`
 * @param {ReturnType<typeof lerNomes>} nomes
 */
function conferirPagina(html, relativo, nomes) {
  const erros = [];
  let recibos = 0;
  let cartoes = 0;
  const root = parse(html);
  const porque = (texto) => {
    const r = nomes.recusados.find((x) => x.nome === texto);
    return r ? `é o nome do ${r.fonte} para «${r.id}», recusado porque ${r.porque}` : 'não é um nome do ficheiro do motor';
  };
  for (const el of root.querySelectorAll(`[data-nonledger="${MOTIVO}"]`)) {
    if (el.getAttribute('data-nome') === 'oficial') {
      cartoes += 1;
      const id = el.getAttribute('data-de-linha') ?? '';
      const texto = el.text.trim();
      const lista = nomes.confirmados.get(id) ?? [];
      if (!lista.some((x) => x.nome === texto))
        erros.push(`N2 ${relativo}: o cartão de «${id}» encabeça-se com «${texto.slice(0, 90)}», que ${
          lista.length ? 'não é um nome confirmado daquela linha: ' : 'não tem nome confirmado nenhum para aquela linha: '
        }${porque(texto)}`);
      continue;
    }
    const a = el.querySelector('a');
    const id = linhaDoCaminho(relativo);
    recibos += 1;
    if (!a) {
      erros.push(`N1 ${relativo}: um nome oficial sem ligação para a página onde foi lido`);
      continue;
    }
    if (id === null) {
      erros.push(`N1 ${relativo}: um nome oficial em forma de recibo fora de uma página de linha; a régua não sabe de que linha é`);
      continue;
    }
    const texto = a.text.trim();
    const href = a.getAttribute('href') ?? '';
    const lista = nomes.confirmados.get(id) ?? [];
    if (!lista.some((x) => x.nome === texto && x.endereco === href))
      erros.push(`N1 ${relativo}: o recibo de «${id}» mostra «${texto.slice(0, 90)}» (${href.slice(0, 70)}), que ${
        lista.some((x) => x.nome === texto) ? 'tem o endereço trocado' : porque(texto)
      }`);
  }
  return { erros, recibos, cartoes };
}

/** Todas as páginas de `dist/`, em caminhos relativos. */
function* paginas(dir, base = dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* paginas(p, base);
    else if (e.name.endsWith('.html')) yield path.relative(base, p);
  }
}

/* ------------------------------------------------------------------ entrada */

if (!fs.existsSync(FICHEIRO)) {
  console.error(vermelho(`\n  NOMES OFICIAIS: não existe ${path.relative(RAIZ, FICHEIRO)}.\n`));
  process.exit(1);
}
if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  NOMES OFICIAIS: não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const NOMES = lerNomes(JSON.parse(fs.readFileSync(FICHEIRO, 'utf8')));
const falhas = [];
let lidas = 0;
let comNome = 0;
let recibos = 0;
let cartoes = 0;
for (const rel of paginas(DIST)) {
  lidas += 1;
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  if (!html.includes(MOTIVO)) continue;
  comNome += 1;
  const r = conferirPagina(html, rel, NOMES);
  recibos += r.recibos;
  cartoes += r.cartoes;
  falhas.push(...r.erros);
}
if (recibos === 0) falhas.push('N3: nenhum nome oficial encontrado em recibo nenhum; o seletor deixou de ver as páginas, e um verde assim não prova nada');
if (cartoes === 0) falhas.push('N3: nenhum título de cartão com `data-nome="oficial"` encontrado; o seletor deixou de ver as páginas, e um verde assim não prova nada');

/* ------------------------------------------------------------------ plantas */

if (process.argv.includes('--prova')) {
  const comAviso = NOMES.recusados.find((x) => x.porque.includes('aviso'));
  const [idCerto, listaCerta] = [...NOMES.confirmados.entries()][0] ?? [null, []];
  const [idOutro, listaOutra] = [...NOMES.confirmados.entries()].find(([id]) => id !== idCerto) ?? [null, []];
  if (!comAviso || !idCerto || !idOutro) {
    falhas.push('N4: as plantas precisam de um nome com aviso e de dois nomes confirmados de linhas diferentes no ficheiro do motor, e não os encontraram');
  } else {
    const recibo = (nome, href) =>
      `<html><body><dl><dt>Nome</dt><dd><span data-nonledger="${MOTIVO}"><a class="ligacao-externa" href="${href}" lang="pt-PT">${nome}</a> · Lido na fonte a 15.09.2026</span></dd></dl></body></html>`;
    const cartao = (id, nome) =>
      `<html><body><article class="cartao-medida"><span class="cartao-medida-nome" data-nome="oficial" data-de-linha="${id}" data-nonledger="${MOTIVO}">${nome}</span></article></body></html>`;
    const espera = (rotulo, r, deveFalhar, padrao) => {
      const falhou = r.erros.length > 0;
      if (falhou !== deveFalhar || (deveFalhar && !r.erros.some((e) => padrao.test(e))))
        falhas.push(`N4 planta «${rotulo}»: ${deveFalhar ? 'devia ser recusada com a razão esperada e não foi' : 'devia passar e foi recusada'} (${r.erros[0] ?? 'sem erro'})`);
    };
    const certo = listaCerta[0];
    espera('um nome com aviso num recibo', conferirPagina(recibo(comAviso.nome, 'https://www.ine.pt/x'), `livro-razao/${comAviso.id}/index.html`, NOMES), true, /N1 .*aviso/);
    espera('um nome com aviso num cartão', conferirPagina(cartao(comAviso.id, comAviso.nome), 'areas/planta/index.html', NOMES), true, /N2 .*aviso/);
    espera('um nome confirmado de outra linha', conferirPagina(recibo(listaOutra[0].nome, listaOutra[0].endereco), `livro-razao/${idCerto}/index.html`, NOMES), true, /N1 /);
    espera('o endereço trocado', conferirPagina(recibo(certo.nome, 'https://exemplo.invalido/'), `livro-razao/${idCerto}/index.html`, NOMES), true, /endereço trocado/);
    espera('a página certa', conferirPagina(recibo(certo.nome, certo.endereco), `livro-razao/${idCerto}/index.html`, NOMES), false, /./);
    espera('o cartão certo', conferirPagina(cartao(idCerto, certo.nome), 'areas/planta/index.html', NOMES), false, /./);
    const falso = lerNomes({ indicadores: [{ id_da_linha: 'planta', correspondencia: 'exata', nome_ine: { nome: 'Planta', endereco: 'https://x', lido_em: '2026-09-21', mesma_medida: false } }] });
    if (falso.confirmados.size !== 0 || falso.recusados.length !== 1)
      falhas.push('N4 planta «mesma_medida: false»: o objeto devia ser recusado e não foi');
  }
}

/* ---------------------------------------------------------------- relatório */

const porFonte = (f) => [...NOMES.confirmados.values()].flat().filter((x) => x.fonte === f).length;
console.log(
  cinza(
    `\n  nomes oficiais · ${lidas} página(s) lidas, ${comNome} com nome oficial · ${recibos} em recibo, ${cartoes} em título de cartão · ` +
      `confirmados no ficheiro do motor: ${porFonte('INE')} do INE, ${porFonte('PORDATA')} da PORDATA · ` +
      `recusados: ${NOMES.recusados.length} (${NOMES.recusados.filter((x) => x.porque.includes('aviso')).length} com aviso de conferência por fazer)`,
  ),
);
if (falhas.length) {
  console.error(vermelho(`\n  NOMES OFICIAIS — ${falhas.length} falha(s):\n`));
  for (const f of falhas.slice(0, 40)) console.error(`    ${f}`);
  process.exit(1);
}
console.log(
  `  ${verde('✓')} cada nome oficial rendido é um nome confirmado da sua linha${process.argv.includes('--prova') ? ', e as sete plantas foram recusadas ou aceites como deviam' : ''}.`,
);
