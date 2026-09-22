/**
 * ---------------------------------------------------------------------------
 * O NOME OFICIAL QUE UMA PÁGINA MOSTRA É UM NOME CONFIRMADO DAQUELA LINHA
 * ---------------------------------------------------------------------------
 * O QUE ISTO FECHA, MEDIDO E NÃO SUPOSTO. A 21.09.2026 o lugar de direção
 * encontrou no ar nomes do INE que eram de OUTROS indicadores: a formação bruta
 * de capital fixo em percentagem do PIB com o nome de um indicador mensal da
 * construção (no recibo e como título de um cartão de área), a taxa de emprego
 * com o de uma série mensal de outro grupo etário, e o risco de pobreza ou
 * exclusão com o da definição antiga. O motor (`indicators/enquadramento.py`)
 * tinha lido esses nomes na lista de resultados da busca do portal do INE e
 * escrito em cada um o campo `aviso`: a marca da busca prova o tema, não prova
 * que seja a mesma medida, e essa conferência ficou por fazer. A marca
 * `correspondencia: "exata"` do ficheiro foi julgada para o nome da PORDATA. O
 * sítio lia `exata` para os dois e punha o do INE primeiro. Sete nomes com aviso
 * estiveram rendidos em 14 recibos e em 6 títulos de cartão.
 *
 * PORQUE É QUE NENHUM PORTÃO O VIU. O motivo `nome-oficial-da-medida` de
 * `ledger/allowlist.yml` era uma DISPENSA: o portão do HTML conferia que o
 * motivo estava declarado e mais nada, e a célula 9 do `check:voz` conferia que
 * o título de um cartão era, carácter a carácter, um nome do ficheiro. As duas
 * provam a transcrição. Nenhuma perguntava se aquele nome do ficheiro estava
 * confirmado, e o estado de verificação vivia em prosa, num campo que nenhum
 * código lia.
 *
 * A REGRA, DEPOIS DA LEITURA A FRIO (Codex, 21.09.2026, 5 plantas em 5). A
 * primeira forma desta régua recusava só os nomes com `aviso`. A leitura mostrou
 * que não chegava: os dois nomes do INE sem aviso (a taxa de desemprego) dizem
 * «Trimestral» e as linhas são anuais, e os nomes da PORDATA foram julgados por
 * quem os escolheu e por mais ninguém. **Um nome confirmado é o de um objeto que
 * o motor marca `mesma_medida: true`** (conferido no conceito, na unidade, na
 * população e na periodicidade por quem não escolheu o nome), numa medida com
 * `correspondencia: "exata"`, com nome, endereço e hora de leitura, e sem campo
 * `aviso`. Tudo o resto é um nome RECUSADO. A 21.09.2026 nenhum nome do ficheiro
 * traz a marca, e a régua di-lo em voz alta em cada corrida.
 *
 * A MARCA PASSA A SER POR FONTE, E A CONFIRMAÇÃO SÃO DUAS LEITURAS (22.09.2026,
 * o bloco M3 do motor). O ficheiro de 15.09 tinha uma só `correspondencia` por
 * medida, uma cadeia de texto julgada para o nome da PORDATA e lida para os
 * dois: era essa a porta por onde os nomes do INE de outros indicadores
 * passaram. O ficheiro de 22.09 traz `correspondencia: {ine, pordata}`, e cada
 * nome traz o `estado` da leitura («lido», «sem_indicador», «sem_pagina»,
 * «sem_resposta»), a `proposta` de quem o escolheu, a `prova` dos quatro
 * critérios e a `conferencia`; o campo `aviso` deixou de existir, e o exportador
 * do motor fecha se ele voltar. O `mesma_medida` é derivado no motor de duas
 * leituras registadas, a de quem escolheu o nome e a de um conferidor cego que
 * não escolheu nenhum, e nunca se escreve à mão. **Um nome da fonte X é
 * confirmado quando, NAQUELA FONTE, `correspondencia[X]` é «exata», o `estado` é
 * «lido», o `mesma_medida` é `true`, não há campo `aviso`, e o endereço e a hora
 * de leitura existem.** A 22.09.2026 são 18: quatro do INE e catorze da PORDATA.
 *
 * A FORMA ANTIGA DO FICHEIRO É UMA FALHA, E NÃO UM SILÊNCIO (a célula N7). Um
 * ficheiro cuja `correspondencia` seja uma cadeia por medida rende zero nomes
 * nos três leitores do sítio, e um zero calado era a mesma armadilha do §1.115:
 * o estado de verificação a viver num sítio que ninguém lê. Esta régua fecha a
 * construção e diz a forma que encontrou. Lê-la «por compatibilidade» era
 * aceitar outra vez uma marca julgada para uma fonte como se fosse das duas.
 *
 * O QUE ESTA RÉGUA CONFERE, com leitor próprio (não chama
 * `src/lib/enquadramento.mjs`, pela regra de que uma conferência que usasse o
 * código das páginas confirmava-se a si própria):
 *
 *   N1 · cada `[data-nonledger="nome-oficial-da-medida"]` de um RECIBO
 *        (`/livro-razao/<id>`, `/en/ledger/<id>`) rende, carácter a carácter, o
 *        nome e o endereço de um nome confirmado daquela linha. Numa página de
 *        linha a forma é sempre a do recibo, traga o elemento a marca que trouxer;
 *   N2 · cada título de cartão com `data-nome="oficial"` rende um nome confirmado
 *        da linha que o `data-de-linha` diz;
 *   N3 · o conhecido-positivo: se o ficheiro tem nomes confirmados, pelo menos um
 *        tem de ser visto numa página (um seletor que deixasse de ver as páginas
 *        daria verde por não ver nada); se não tem nenhum, nenhuma página pode
 *        render um nome oficial, e são as plantas que provam que o seletor vê;
 *   N5 · fora de um elemento marcado, nenhuma ligação de página nenhuma aponta para
 *        o endereço de um nome do ficheiro, confirmado ou não (a leitura a frio:
 *        tirar a marca a um elemento tornava-o invisível a esta régua). Os
 *        endereços comparam-se normalizados: a ordem dos parâmetros, um fragmento
 *        e uma barra final não fazem de um endereço outro endereço;
 *   N6 · fora de um elemento marcado, nenhum elemento de página nenhuma tem por
 *        texto inteiro um nome do ficheiro, confirmado ou não: um nome oficial só
 *        se rende com a marca, que é o que deixa a N1 e a N2 saberem de que linha
 *        é. O texto compara-se depois de juntar os filhos e de desfazer as
 *        entidades, para que um nome partido por dois elementos ou escrito com
 *        «&#38;» seja o mesmo nome;
 *   N7 · a forma do ficheiro do motor: a `correspondencia` de cada medida é um
 *        objeto com uma marca por fonte. A forma antiga (uma cadeia por medida)
 *        fecha a construção com a razão, em vez de render zero nomes em silêncio;
 *   N4 · as plantas (`--prova`, que é como o `build` e o `verify` a chamam), sobre
 *        um ficheiro de nomes escrito aqui para isso e páginas com a forma real.
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
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** O texto tal como o Astro o escreve no HTML: só para compor as páginas das plantas. */
const comoNoHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Desfaz as entidades que um nome pode trazer, com nome ou com número. */
const semEntidades = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

/** O texto de comparação: entidades desfeitas, espaços juntos, pontas aparadas. */
const textoNormal = (s) => semEntidades(s).replace(/\s+/g, ' ').trim();

/**
 * O endereço de comparação. Dois endereços que só diferem na ordem dos
 * parâmetros, num fragmento ou numa barra final são o mesmo endereço.
 */
function enderecoNormal(u) {
  try {
    const x = new URL(semEntidades(u).trim());
    const ps = [...x.searchParams.entries()].sort(([a, b], [c, d]) => (a === c ? b.localeCompare(d) : a.localeCompare(c)));
    const q = ps.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    return `${x.protocol}//${x.host.toLowerCase()}${x.pathname.replace(/\/+$/, '')}${q ? `?${q}` : ''}`;
  } catch {
    return semEntidades(u).trim();
  }
}

/**
 * As pistas de um endereço que sobrevivem a uma reordenação, para a procura
 * barata: os valores de parâmetro e o último troço do caminho que tragam um
 * algarismo (o código do indicador no INE, o número da página na PORDATA). Um
 * valor sem algarismos (`ine_indicadores`) é comum a milhares de ligações e
 * mandava analisar o sítio inteiro; sem pista nenhuma, serve o caminho.
 */
function pistasDoEndereco(u) {
  const pistas = new Set();
  try {
    const x = new URL(u);
    for (const v of x.searchParams.values()) if (v.length >= 5 && /\d/.test(v)) pistas.add(v);
    const ultimo = x.pathname.split('/').filter(Boolean).pop() ?? '';
    if (ultimo.length >= 5 && /\d/.test(ultimo)) pistas.add(ultimo);
    if (pistas.size === 0) pistas.add(`${x.host}${x.pathname.replace(/\/+$/, '')}`);
  } catch {
    pistas.add(u);
  }
  return pistas;
}

/**
 * Lê o ficheiro do motor e separa os nomes confirmados dos recusados, com a
 * razão de cada recusa. Um campo sem nome nenhum (ausente ou `[verify]`) não é
 * uma recusa: é uma ausência, e a página não tem o que render.
 *
 * A MARCA LÊ-SE POR FONTE (22.09.2026): `correspondencia` é um objeto
 * `{ine, pordata}`, e a marca de uma fonte não decide pela outra. Um ficheiro
 * na forma antiga (uma cadeia por medida) não rende nome nenhum e fica com uma
 * queixa de ficheiro (N7), porque zero nomes em silêncio é o defeito de
 * 21.09.2026 outra vez.
 *
 * @param {any} j
 */
function lerNomes(j) {
  /** @type {Map<string, { nome: string, endereco: string, fonte: string }[]>} */
  const confirmados = new Map();
  /** @type {{ id: string, fonte: string, nome: string, endereco: string, porque: string }[]} */
  const recusados = [];
  /** @type {string[]} as queixas sobre a FORMA do ficheiro, não sobre uma página */
  const queixasDoFicheiro = [];
  /** @type {Map<string, number>} */
  const formasAntigas = new Map();
  for (const i of j?.indicadores ?? []) {
    const id = i?.id_da_linha;
    if (typeof id !== 'string' || id === '') continue;
    const c = i?.correspondencia;
    const porFonte = c !== null && typeof c === 'object' && !Array.isArray(c);
    if (!porFonte && c !== undefined && c !== null) {
      const forma = typeof c === 'string' ? `a cadeia «${String(c).slice(0, 30)}»` : `um valor de tipo ${typeof c}`;
      formasAntigas.set(forma, (formasAntigas.get(forma) ?? 0) + 1);
    }
    for (const [campo, fonte] of FONTES) {
      const o = i?.[campo];
      if (!o || typeof o !== 'object') continue;
      const nome = o.nome;
      if (typeof nome !== 'string' || nome.trim() === '' || nome === '[verify]') continue;
      const endereco = typeof o.endereco === 'string' ? o.endereco : '';
      const marca = porFonte ? c[campo === 'nome_ine' ? 'ine' : 'pordata'] : undefined;
      let porque = null;
      if (!porFonte)
        porque =
          'o ficheiro do motor está na forma antiga, com uma «correspondencia» por medida em vez de uma marca por fonte, e nenhum nome dele se rende';
      else if (Object.prototype.hasOwnProperty.call(o, 'aviso'))
        porque = 'o motor escreveu um aviso: a conferência de ser a mesma medida ficou por fazer';
      else if (o.mesma_medida === false) porque = 'o motor marcou «mesma_medida: false»';
      else if (o.mesma_medida !== true) porque = 'o motor não o marcou «mesma_medida: true», e um nome sem veredicto não é um nome confirmado';
      else if (o.estado !== 'lido') porque = `o estado da leitura é «${o.estado ?? 'ausente'}» e não «lido»`;
      else if (marca !== 'exata') porque = `a correspondência do ${fonte} nesta medida é «${marca ?? 'sem marca'}» e não «exata»`;
      else if (endereco === '' || typeof o.lido_em !== 'string' || o.lido_em === '') porque = 'falta o endereço ou a hora de leitura';
      if (porque) recusados.push({ id, fonte, nome, endereco, porque });
      else {
        if (!confirmados.has(id)) confirmados.set(id, []);
        confirmados.get(id).push({ nome, endereco, fonte });
      }
    }
  }
  for (const [forma, quantas] of formasAntigas)
    queixasDoFicheiro.push(
      `N7: o ficheiro do motor está na forma antiga em ${quantas} medida(s): a «correspondencia» é ${forma} por medida e não um objeto com uma marca por fonte. ` +
        `Nenhum nome dele se rende, e um zero calado era o defeito de 21.09.2026 outra vez (DECISIONS §1.115)`,
    );
  /* TODOS OS NOMES E TODOS OS ENDEREÇOS DO FICHEIRO, confirmados ou não, para as
     duas procuras sem marca (N5 e N6): um nome oficial só se rende com a marca,
     e por isso fora dela nenhum deles pode aparecer. A primeira forma tirava
     desta lista o que estivesse confirmado para QUALQUER linha, e as duas linhas
     da taxa de desemprego partilham nomes e endereços: confirmada uma, a outra
     passava sem marca (leitura a frio de 21.09.2026, achado 7). */
  const todosOsNomes = new Map();
  const todosOsEnderecos = new Map();
  const pistas = new Set();
  const registar = (x, estado) => {
    const n = textoNormal(x.nome);
    if (!todosOsNomes.has(n)) todosOsNomes.set(n, { ...x, estado });
    if (x.endereco) {
      const e = enderecoNormal(x.endereco);
      if (!todosOsEnderecos.has(e)) todosOsEnderecos.set(e, { ...x, estado });
      for (const p of pistasDoEndereco(x.endereco)) pistas.add(p);
    }
  };
  for (const [id, lista] of confirmados) for (const x of lista) registar({ id, ...x, porque: 'está confirmado, mas um nome oficial só se rende com a marca' }, 'confirmado');
  for (const r of recusados) registar(r, 'recusado');
  return { confirmados, recusados, todosOsNomes, todosOsEnderecos, pistas, queixasDoFicheiro };
}

/** O identificador da linha de um recibo, pelo caminho da página, ou `null`. */
function linhaDoCaminho(relativo) {
  const m = /^(?:livro-razao|en\/ledger)\/([^/]+)\/index\.html$/.exec(relativo.split(path.sep).join('/'));
  if (!m || m[1] === 'concelhos' || m[1] === 'municipalities') return null;
  return m[1];
}

/**
 * A página merece ser analisada? A procura barata faz-se sobre o texto SEM
 * etiquetas e com as entidades desfeitas, para que um nome partido por dois
 * elementos ou escrito com uma entidade numérica não esconda a página da
 * conferência a sério (leitura a frio de 21.09.2026, achado 5).
 */
function mereceAnalise(html, nomes) {
  if (html.includes(MOTIVO) || html.includes('data-nome="oficial"')) return true;
  const cru = semEntidades(html);
  for (const p of nomes.pistas) if (cru.includes(p)) return true;
  const texto = textoNormal(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ''));
  for (const n of nomes.todosOsNomes.keys()) if (texto.includes(n)) return true;
  return false;
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
  const idDaPagina = linhaDoCaminho(relativo);
  const porque = (texto) => {
    const r = nomes.recusados.find((x) => x.nome === texto);
    return r ? `é o nome do ${r.fonte} para «${r.id}», recusado porque ${r.porque}` : 'não é um nome do ficheiro do motor';
  };
  const marcados = new Set(root.querySelectorAll(`[data-nonledger="${MOTIVO}"], [data-nome="oficial"]`));
  for (const el of marcados) {
    /* NUMA PÁGINA DE LINHA A FORMA É A DO RECIBO, traga o elemento a marca que
       trouxer: um recibo com `data-nome="oficial"` não passa a cartão. */
    if (idDaPagina === null && el.getAttribute('data-nome') === 'oficial') {
      cartoes += 1;
      const id = el.getAttribute('data-de-linha') ?? '';
      const texto = el.text.trim();
      const lista = nomes.confirmados.get(id) ?? [];
      if (!lista.some((x) => x.nome === texto))
        erros.push(`N2 ${relativo}: o cartão de «${id}» encabeça-se com «${texto.slice(0, 90)}», que ${porque(texto)}`);
      continue;
    }
    recibos += 1;
    if (idDaPagina === null) {
      erros.push(`N1 ${relativo}: um nome oficial em forma de recibo fora de uma página de linha; a régua não sabe de que linha é`);
      continue;
    }
    const a = el.querySelector('a');
    if (!a) {
      erros.push(`N1 ${relativo}: um nome oficial sem ligação para a página onde foi lido`);
      continue;
    }
    const texto = a.text.trim();
    const href = a.getAttribute('href') ?? '';
    const lista = nomes.confirmados.get(idDaPagina) ?? [];
    if (!lista.some((x) => x.nome === texto && x.endereco === href))
      erros.push(`N1 ${relativo}: o recibo de «${idDaPagina}» mostra «${texto.slice(0, 90)}» (${href.slice(0, 70)}), que ${
        lista.some((x) => x.nome === texto) ? 'tem o endereço trocado' : porque(texto)
      }`);
  }
  /* FORA DA MARCA. Um elemento a que tirassem a marca deixava de ser visto pelas
     duas células de cima; estas duas procuram o que não pode estar em página
     nenhuma fora de um elemento marcado, pelo endereço e pelo texto inteiro. */
  const dentroDeMarcado = (el) => {
    for (let n = el; n; n = n.parentNode) if (marcados.has(n)) return true;
    return false;
  };
  for (const a of root.querySelectorAll('a[href]')) {
    if (dentroDeMarcado(a)) continue;
    const r = nomes.todosOsEnderecos.get(enderecoNormal(a.getAttribute('href') ?? ''));
    if (r) erros.push(`N5 ${relativo}: uma ligação sem marca aponta para o endereço do nome do ${r.fonte} para «${r.id}» («${r.nome.slice(0, 70)}»), que ${r.estado === 'recusado' ? `foi recusado porque ${r.porque}` : r.porque}`);
  }
  for (const el of root.querySelectorAll('*')) {
    const etiqueta = (el.rawTagName ?? '').toLowerCase();
    if (etiqueta === 'script' || etiqueta === 'style' || etiqueta === 'html' || etiqueta === 'body' || etiqueta === 'head' || etiqueta === 'title') continue;
    if (dentroDeMarcado(el)) continue;
    const texto = textoNormal(el.text);
    if (texto === '') continue;
    const r = nomes.todosOsNomes.get(texto);
    if (!r) continue;
    /* Só o elemento mais de fora: o filho que tem o mesmo texto inteiro é a mesma ocorrência. */
    const pai = el.parentNode;
    if (pai && pai.rawTagName && textoNormal(pai.text) === texto) continue;
    erros.push(`N6 ${relativo}: um <${etiqueta}> sem marca tem por texto inteiro o nome do ${r.fonte} para «${r.id}» («${r.nome.slice(0, 70)}»), que ${r.estado === 'recusado' ? `foi recusado porque ${r.porque}` : r.porque}`);
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
const nConfirmados = [...NOMES.confirmados.values()].flat().length;
/* A FORMA DO FICHEIRO É A PRIMEIRA FALHA (N7), antes de se olhar para uma
   página: com a forma antiga nenhum leitor rende um nome, e a régua diz porquê
   em vez de dar um verde que não prova nada. */
const falhas = [...NOMES.queixasDoFicheiro];
let lidas = 0;
let analisadas = 0;
let recibos = 0;
let cartoes = 0;
for (const rel of paginas(DIST)) {
  lidas += 1;
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  if (!mereceAnalise(html, NOMES)) continue;
  analisadas += 1;
  const r = conferirPagina(html, rel, NOMES);
  recibos += r.recibos;
  cartoes += r.cartoes;
  falhas.push(...r.erros);
}
if (nConfirmados > 0 && recibos + cartoes === 0)
  falhas.push(`N3: o ficheiro do motor tem ${nConfirmados} nome(s) confirmado(s) e nenhuma página rende nenhum; o seletor deixou de ver as páginas, e um verde assim não prova nada`);
if (nConfirmados === 0 && recibos + cartoes > 0)
  falhas.push(`N3: o ficheiro do motor não tem nome confirmado nenhum e ${recibos + cartoes} elemento(s) rendem um nome oficial`);

/* ------------------------------------------------------------------ plantas */

let plantas = 0;
if (process.argv.includes('--prova')) {
  /* UM FICHEIRO DE NOMES ESCRITO PARA AS PLANTAS, e não o do motor: a 21.09.2026
     o do motor não tem nome confirmado nenhum, e uma planta que dependesse dele
     ficava sem a página certa para provar que a régua também deixa passar. */
  /* NA FORMA DE 22.09.2026: a `correspondencia` é um objeto com uma marca por
     fonte, e cada nome traz o `estado` da leitura. Uma planta que ficasse na
     forma antiga deixava de provar a régua que corre sobre o ficheiro real. */
  const P = lerNomes({
    indicadores: [
      { id_da_linha: 'planta-a', correspondencia: { ine: 'exata', pordata: null }, nome_ine: { estado: 'lido', nome: 'Nome confirmado A & B', endereco: 'https://exemplo.invalido/a?x=1&y=2', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: true } },
      { id_da_linha: 'planta-b', correspondencia: { ine: null, pordata: 'exata' }, nome_pordata: { estado: 'lido', nome: 'Nome confirmado de outra linha', endereco: 'https://exemplo.invalido/b', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: true } },
      { id_da_linha: 'planta-c', correspondencia: { ine: 'exata', pordata: null }, nome_ine: { estado: 'lido', nome: 'Nome com aviso', endereco: 'https://exemplo.invalido/c', lido_em: '2026-09-21T00:00:00+00:00', aviso: 'a conferência fica por fazer' } },
      { id_da_linha: 'planta-d', correspondencia: { ine: 'exata', pordata: null }, nome_ine: { estado: 'lido', nome: 'Nome de outra medida', endereco: 'https://exemplo.invalido/d', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: false } },
      { id_da_linha: 'planta-e', correspondencia: { ine: null, pordata: 'exata' }, nome_pordata: { estado: 'lido', nome: 'Nome sem veredicto', endereco: 'https://exemplo.invalido/e', lido_em: '2026-09-21T00:00:00+00:00' } },
      { id_da_linha: 'planta-f', correspondencia: { ine: null, pordata: 'proxima' }, nome_pordata: { estado: 'lido', nome: 'Nome de medida vizinha', endereco: 'https://exemplo.invalido/f', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: true } },
      { id_da_linha: 'planta-g', correspondencia: { ine: 'exata', pordata: null }, nome_ine: { estado: 'lido', nome: 'Nome com aviso vazio', endereco: 'https://exemplo.invalido/g', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: true, aviso: '' } },
      /* Duas linhas com o mesmo nome e o mesmo endereço, uma confirmada e outra não, como as duas da taxa de desemprego. */
      { id_da_linha: 'planta-h', correspondencia: { ine: null, pordata: 'exata' }, nome_pordata: { estado: 'lido', nome: 'Nome partilhado por duas linhas', endereco: 'https://exemplo.invalido/h?a=11111&b=22222', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: true } },
      { id_da_linha: 'planta-i', correspondencia: { ine: null, pordata: 'exata' }, nome_pordata: { estado: 'lido', nome: 'Nome partilhado por duas linhas', endereco: 'https://exemplo.invalido/h?a=11111&b=22222', lido_em: '2026-09-21T00:00:00+00:00' } },
      /* AS DUAS FORMAS QUE SÓ A MARCA POR FONTE VÊ (22.09.2026). A primeira é a
         que o motor escreve para um nome que a conferência cega ainda não
         decidiu: a marca da fonte é «exata» e o `mesma_medida` é `null`. A
         segunda é um `true` sobre um estado que não é «lido», que é um nome que
         o motor não leu na fonte. */
      { id_da_linha: 'planta-j', correspondencia: { ine: 'exata', pordata: null }, nome_ine: { estado: 'lido', nome: 'Nome exato por decidir', endereco: 'https://exemplo.invalido/j', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: null, proposta: 'mesma' } },
      { id_da_linha: 'planta-k', correspondencia: { ine: null, pordata: 'exata' }, nome_pordata: { estado: 'sem_pagina', nome: 'Nome de um estado que não é lido', endereco: 'https://exemplo.invalido/k', lido_em: '2026-09-21T00:00:00+00:00', mesma_medida: true } },
    ],
  });
  const recibo = (nome, href, extra = '') =>
    `<html><body><dl><dt>Nome</dt><dd><span data-nonledger="${MOTIVO}"${extra}><a class="ligacao-externa" href="${comoNoHtml(href)}" lang="pt-PT">${comoNoHtml(nome)}</a> · Lido na fonte a 21.09.2026</span></dd></dl></body></html>`;
  const cartao = (id, nome) =>
    `<html><body><article class="cartao-medida"><span class="cartao-medida-nome" data-nome="oficial" data-de-linha="${id}" data-nonledger="${MOTIVO}">${comoNoHtml(nome)}</span></article></body></html>`;
  const semMarca = (dentro) => `<html><body><main><p>Texto da página.</p>${dentro}</main></body></html>`;
  const A = P.confirmados.get('planta-a')[0];
  const B = P.confirmados.get('planta-b')[0];
  const casos = [
    ['um nome com aviso num recibo', recibo('Nome com aviso', 'https://exemplo.invalido/c'), 'livro-razao/planta-c/index.html', /N1 .*aviso/],
    ['um nome com aviso num cartão', cartao('planta-c', 'Nome com aviso'), 'areas/planta/index.html', /N2 .*aviso/],
    ['um nome que o motor marcou como outra medida', recibo('Nome de outra medida', 'https://exemplo.invalido/d'), 'livro-razao/planta-d/index.html', /N1 .*mesma_medida: false/],
    ['um nome sem veredicto', recibo('Nome sem veredicto', 'https://exemplo.invalido/e'), 'livro-razao/planta-e/index.html', /N1 .*sem veredicto/],
    ['um nome de uma medida vizinha', recibo('Nome de medida vizinha', 'https://exemplo.invalido/f'), 'livro-razao/planta-f/index.html', /N1 .*proxima/],
    ['um nome confirmado de outra linha', recibo(B.nome, B.endereco), 'livro-razao/planta-a/index.html', /N1 /],
    ['o endereço trocado', recibo(A.nome, 'https://exemplo.invalido/outro'), 'livro-razao/planta-a/index.html', /endereço trocado/],
    ['um recibo com a marca de cartão numa página de linha', recibo('Nome com aviso', 'https://exemplo.invalido/c', ' data-nome="oficial" data-de-linha="planta-a"'), 'livro-razao/planta-c/index.html', /N1 .*aviso/],
    ['uma ligação sem marca para o endereço de um nome recusado', semMarca('<p><a href="https://exemplo.invalido/c">ver no INE</a></p>'), 'areas/planta/index.html', /N5 /],
    ['um título sem marca com o nome recusado por texto inteiro', semMarca('<span class="cartao-medida-nome">Nome com aviso</span>'), 'areas/planta/index.html', /N6 /],
    ['um nome com o campo aviso vazio', recibo('Nome com aviso vazio', 'https://exemplo.invalido/g'), 'livro-razao/planta-g/index.html', /N1 .*aviso/],
    ['um nome confirmado para outra linha, no recibo da linha que não o tem confirmado', recibo('Nome partilhado por duas linhas', 'https://exemplo.invalido/h?a=11111&b=22222'), 'livro-razao/planta-i/index.html', /N1 /],
    ['um nome partido por dois elementos, sem marca', semMarca('<span class="cartao-medida-nome">Nome com <em>aviso</em></span>'), 'areas/planta/index.html', /N6 /],
    ['um nome escrito com uma entidade numérica, sem marca', semMarca('<span>Nome confirmado A &#38; B</span>'), 'areas/planta/index.html', /N6 /],
    ['um nome num elemento fora da lista antiga, sem marca', semMarca('<button type="button">Nome com aviso</button>'), 'areas/planta/index.html', /N6 /],
    ['um nome CONFIRMADO rendido sem marca', semMarca('<span>Nome partilhado por duas linhas</span>'), 'areas/planta/index.html', /N6 .*só se rende com a marca/],
    ['uma ligação sem marca com os parâmetros por outra ordem', semMarca('<p><a href="https://exemplo.invalido/a?y=2&amp;x=1">ver</a></p>'), 'areas/planta/index.html', /N5 /],
    ['uma ligação sem marca com barra final e fragmento', semMarca('<p><a href="https://exemplo.invalido/c/#topo">ver</a></p>'), 'areas/planta/index.html', /N5 /],
    ['a página certa, com «&» no nome e no endereço', recibo(A.nome, A.endereco), 'livro-razao/planta-a/index.html', null],
    ['o cartão certo', cartao('planta-a', A.nome), 'areas/planta/index.html', null],
    ['um nome recusado dentro de uma frase, que não é um nome oficial rendido', semMarca('<p>O INE chama-lhe Nome com aviso, e a página di-lo numa frase.</p>'), 'estudos/planta/index.html', null],
    /* AS TRÊS DE 22.09.2026. As duas primeiras são casos que a marca por medida
       não sabia distinguir: com uma só cadeia «exata» por medida, um nome por
       decidir e um nome de um estado que não é «lido» chegavam à página com a
       marca da OUTRA fonte. A terceira, a forma antiga do ficheiro, está mais
       abaixo, porque é uma queixa do ficheiro e não de uma página. */
    ['a marca «exata» da fonte com o mesma_medida a null, como o motor o escreve', recibo('Nome exato por decidir', 'https://exemplo.invalido/j'), 'livro-razao/planta-j/index.html', /N1 .*mesma_medida: true/],
    ['um nome mesma_medida: true cujo estado não é «lido»', recibo('Nome de um estado que não é lido', 'https://exemplo.invalido/k'), 'livro-razao/planta-k/index.html', /N1 .*sem_pagina/],
  ];
  for (const [rotulo, html, caminho, padrao] of casos) {
    plantas += 1;
    const visto = mereceAnalise(html, P);
    const r = visto ? conferirPagina(html, caminho, P) : { erros: [] };
    const falhou = r.erros.length > 0;
    if (padrao === null ? falhou : !falhou || !r.erros.some((e) => padrao.test(e)))
      falhas.push(`N4 planta «${rotulo}»: ${padrao === null ? 'devia passar e foi recusada' : 'devia ser recusada com a razão esperada e não foi'} (${r.erros[0] ?? (visto ? 'sem erro' : 'a procura barata nem a viu')})`);
  }

  /* A PLANTA DA FORMA ANTIGA (N7, 22.09.2026), que é a única que não se prova só
     por uma página: o ficheiro de 15.09 tinha a `correspondencia` como uma
     cadeia por medida, julgada para a PORDATA e lida para as duas fontes. Ela
     tem de provar as duas coisas ao mesmo tempo, porque uma sem a outra é meia
     régua: que um ficheiro assim rende ZERO nomes confirmados, e que a régua
     DIZ a razão em vez de dar um verde calado. */
  plantas += 1;
  {
    const antigo = lerNomes({
      indicadores: [
        {
          id_da_linha: 'planta-antiga',
          correspondencia: 'exata',
          nome_ine: { nome: 'Nome de um ficheiro na forma antiga', endereco: 'https://exemplo.invalido/antiga', lido_em: '2026-09-15T00:00:00+00:00', mesma_medida: true },
        },
      ],
    });
    const html = recibo('Nome de um ficheiro na forma antiga', 'https://exemplo.invalido/antiga');
    const caminho = 'livro-razao/planta-antiga/index.html';
    const r = mereceAnalise(html, antigo) ? conferirPagina(html, caminho, antigo) : { erros: [] };
    const quantos = [...antigo.confirmados.values()].flat().length;
    const queixou = antigo.queixasDoFicheiro.some((q) => /N7: .*forma antiga/.test(q));
    const recusou = r.erros.some((e) => /N1 .*forma antiga/.test(e));
    if (quantos !== 0 || !queixou || !recusou)
      falhas.push(
        `N4 planta «a forma antiga do ficheiro»: devia render zero nomes (rendeu ${quantos}), ` +
          `queixar-se da forma (${queixou ? 'queixou-se' : 'não se queixou'}) e recusar o recibo (${recusou ? 'recusou' : `não recusou: ${r.erros[0] ?? 'sem erro'}`})`,
      );
  }
}

/* ---------------------------------------------------------------- relatório */

const porFonte = (f) => [...NOMES.confirmados.values()].flat().filter((x) => x.fonte === f).length;
const razoes = new Map();
for (const r of NOMES.recusados) razoes.set(r.porque.split(':')[0].split(',')[0], (razoes.get(r.porque.split(':')[0].split(',')[0]) ?? 0) + 1);
console.log(
  cinza(
    `\n  nomes oficiais · ${lidas} página(s) lidas, ${analisadas} analisadas · ${recibos} nome(s) em recibo, ${cartoes} em título de cartão · ` +
      `confirmados pela marca por fonte: ${porFonte('INE')} do INE, ${porFonte('PORDATA')} da PORDATA · recusados: ${NOMES.recusados.length}`,
  ),
);
if (nConfirmados === 0)
  console.log(amarelo('  nenhum nome do ficheiro do motor está confirmado pela marca da sua fonte: nenhum nome oficial se rende, e voltam um a um quando o motor os confirmar.'));
if (falhas.length) {
  console.error(vermelho(`\n  NOMES OFICIAIS — ${falhas.length} falha(s):\n`));
  for (const f of falhas.slice(0, 40)) console.error(`    ${f}`);
  process.exit(1);
}
console.log(
  `  ${verde('✓')} nenhuma página rende um nome oficial que o motor não confirme como a mesma medida${plantas ? `, e as ${plantas} plantas foram recusadas ou aceites como deviam` : ''}.`,
);
