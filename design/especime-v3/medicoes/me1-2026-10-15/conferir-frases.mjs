#!/usr/bin/env node
/**
 * A RÉGUA DAS FRASES DO BLOCO ME1: cada frase do mandato, palavra por palavra, nas duas edições do Método construído.
 *
 * Lê `frases-do-mandato.json` (escrito por `frases-do-mandato.py` a partir do mandato, sem datilografar) e as duas
 * páginas do Método em `dist/`, e confere, secção a secção:
 *   · a abertura, o sumário (as nove secções pela ordem do §2), a descrição da página e os títulos;
 *   · cada parágrafo, no seu molde: o texto de fora das marcas carácter a carácter, cada número da prova no lugar do
 *     seu token e com a chave do token, o endereço no lugar de {email}, o marcador no lugar de {marcador} e a porta do
 *     documento público da política no lugar de [palavras]{politica};
 *   · a frase da política (o primeiro parágrafo da primeira secção) contra o oráculo do portão;
 *   · as cinco recusas e a forma (a cor, a escala e a letra) contra as páginas de antes do bloco, guardadas em
 *     `antes/`, porque o mandato as quer «como estão hoje»; desde a leitura a frio do Codex (15.10.2026, o achado
 *     11) a frase da escala é a do §3.9 do mandato, e a forma de antes compara-se com essa frase no lugar da antiga;
 *   · as portas de cada secção, pelo texto e pela ordem.
 * OS PARÁGRAFOS SÃO TODOS OS `<p>` VISÍVEIS DE CADA SECÇÃO, e não só os da classe `metodo-p` (a leitura a frio do
 * Codex, 15.10.2026, o achado 8: um `<p>` sem a classe, acrescentado a uma secção, passava sem que a régua o
 * visse). Fica de fora só a linha das portas (`p.regra-portas`), que se confere à parte, e o que está num molde ou
 * escondido; o texto de `noscript` lê-se como HTML e conta. Um parágrafo a mais é uma diferença no número de
 * parágrafos da secção, e há uma planta para isso.
 * E A LINHA DAS PORTAS CONFERE-SE PELO TEXTO INTEIRO (a leitura curta da passagem de correção, 15.10.2026, o achado
 * 4): cada `<p class="regra-portas">` visível de uma secção, e não só as suas ligações, contra as portas do mandato,
 * para que prosa a mais com essa classe não passe; e a página lê-se com `noscript` como HTML, como o parágrafo acima
 * promete (a leitura com `noscript: false` deitava fora o seu conteúdo). Há uma planta para cada uma.
 * Escreve `frases-construidas.json` (o que as páginas dizem, parágrafo a parágrafo, com a secção, para o lugar de
 * direção ler antes de lançar a leitura a frio) e `conferencia-das-frases.json`. Depois planta, em memória, um
 * estrago por secção (uma palavra trocada no primeiro parágrafo, num item das recusas ou na forma) e exige que a
 * régua o recuse nessa secção. Sai com 1 se alguma frase diferir ou alguma planta não morder.
 *
 * uso: node conferir-frases.mjs <dist> <frases-do-mandato.json> <pasta de saída>
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const [distDado, frasesDado, saidaDada] = process.argv.slice(2);
if (!distDado || !frasesDado || !saidaDada) throw new Error('uso: conferir-frases.mjs <dist> <frases-do-mandato.json> <pasta de saída>');
const DIST = path.resolve(distDado);
const MANDATO = JSON.parse(fs.readFileSync(frasesDado, 'utf8'));
const ORACULO = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/textos-aprovados.json'), 'utf8'));
const VERSAO = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const ROTAS = { pt: 'metodo/index.html', en: 'en/method/index.html' };
const ANTES = { pt: 'antes/metodo.html.gz', en: 'antes/en-method.html.gz' };
const DOCUMENTO = 'https://github.com/oestadodopais/o-estado-do-pais/blob/main/design/observatorio/POLITICA-DA-AUTONOMIA.md';
const IDS = ['politica-de-ia', 'fontes', 'livro-razao', 'releitura', 'por-confirmar', 'correcoes', 'agenda', 'o-que-nao-faz'];

const desfaz = (s) => String(s)
  .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const achata = (s) => String(s).replace(/\s+/g, ' ').trim();
const textoDe = (el) => achata(desfaz(el.text ?? ''));

/** O molde de um parágrafo construído: o texto de fora das marcas, e cada marca pelo seu token. */
function molde(el, valores) {
  const partes = [];
  const anda = (n) => {
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(desfaz(n.rawText));
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    const prova = n.getAttribute?.('data-prova');
    if (prova) { valores.push({ token: prova, valor: textoDe(n), porta: n.getAttribute('href') ?? null }); return void partes.push(`{${prova}}`); }
    if (n.classList?.contains('ligacao-email')) { valores.push({ token: 'email', valor: textoDe(n), porta: n.getAttribute('href') }); return void partes.push('{email}'); }
    if (n.classList?.contains('marcador')) { valores.push({ token: 'marcador', valor: textoDe(n), porta: n.getAttribute('href') }); return void partes.push('{marcador}'); }
    if (n.classList?.contains('marcador-definicao')) { valores.push({ token: 'definicao-do-marcador', valor: textoDe(n) }); return; }
    if (tag === 'a' && /^https?:/.test(n.getAttribute('href') ?? '')) {
      valores.push({ token: 'politica', valor: textoDe(n), porta: n.getAttribute('href') });
      return void partes.push(`[${textoDe(n)}]{politica}`);
    }
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(el);
  return achata(partes.join(''));
}

/** Um `<p>` que o leitor vê: nem num molde nem escondido. */
const visivel = (el) => {
  for (let n = el; n && n.rawTagName; n = n.parentNode) {
    if (String(n.rawTagName).toLowerCase() === 'template' || n.getAttribute?.('hidden') !== undefined) return false;
  }
  return true;
};

/** Lê uma página do Método e devolve o que ela diz, secção a secção. */
function lePagina(html) {
  /* `noscript` fica fora de `blockTextElements`, e por isso o seu conteúdo lê-se como HTML. */
  const r = parse(html, { blockTextElements: { script: true, style: true } });
  const main = r.querySelector('main');
  const out = { titulo: textoDe(r.querySelector('h1')), abertura: textoDe(r.querySelector('h1').parentNode.querySelector('p.lede')),
    descricao: achata(desfaz(r.querySelector('meta[name="description"]')?.getAttribute('content') ?? '')),
    sumario: main.querySelectorAll('nav.metodo-sumario li a').map((a) => ({ texto: textoDe(a), destino: a.getAttribute('href') })),
    seccoes: [] };
  for (const s of main.querySelectorAll('section.metodo-secao')) {
    const corpo = s.querySelector('.metodo-corpo');
    const seccao = { id: s.getAttribute('id'), titulo: textoDe(s.querySelector('h2')), paragrafos: [], lista: [], portas: [], texto: textoDe(s) };
    /* A forma (`a-forma`) confere-se pelo texto da secção inteira, contra a página de antes; as outras pelos
       parágrafos, que são todos os `<p>` visíveis menos a linha das portas. */
    const paragrafos = s.getAttribute('id') === 'a-forma' ? []
      : s.querySelectorAll('p').filter((n) => !n.classList.contains('regra-portas') && visivel(n));
    for (const p of paragrafos) {
      const valores = [];
      seccao.paragrafos.push({ id: p.getAttribute('id') ?? null, texto: textoDe(p), molde: molde(p, valores), valores,
        marca: p.getAttribute('data-frase-da-politica') ? 'frase-da-politica' : p.getAttribute('data-papeis') ? 'papeis' : p.getAttribute('data-familias') ? 'familias' : null });
    }
    for (const li of corpo?.querySelectorAll('ul.politica-recusas > li') ?? []) seccao.lista.push(textoDe(li));
    seccao.linhaDasPortas = s.getAttribute('id') === 'a-forma' ? []
      : s.querySelectorAll('p.regra-portas').filter((n) => visivel(n)).map(textoDe);
    for (const a of corpo?.querySelectorAll(':scope > p.regra-portas > a') ?? []) seccao.portas.push({ texto: textoDe(a), destino: a.getAttribute('href') });
    out.seccoes.push(seccao);
  }
  return out;
}

/** O que o mandato manda, por edição: a mesma forma que `lePagina`, com os moldes no lugar dos textos. */
function esperado(lang) {
  const m = MANDATO;
  const seccoes = m.seccoes.map((s, i) => ({
    id: IDS[i], titulo: s.titulo[lang],
    paragrafos: [
      ...(s.n === 1 ? [{ n: 1, id: null, molde: ORACULO.frase[lang], marca: 'frase-da-politica' }] : []),
      ...s.paragrafos.map((p) => ({ n: p.n, id: p.id, molde: achata(p[lang]) })),
    ],
    portas: s.portas.map((p) => `${p[lang]} →`),
  }));
  return { abertura: m.abertura[lang], descricao: m.meta_description[lang], seccoes };
}

function confere(lang, pagina, antes) {
  const e = esperado(lang);
  const diferencas = [];
  const dif = (seccao, o_que, mandato, construido) => { if (mandato !== construido) diferencas.push({ seccao, o_que, mandato, construido }); };
  dif('cabeça', 'abertura', e.abertura, pagina.abertura);
  dif('cabeça', 'descrição da página', e.descricao, pagina.descricao);
  const titulos = [...e.seccoes.map((s) => s.titulo), antes.seccoes.find((s) => s.id === 'a-forma')?.titulo];
  dif('sumário', 'as nove entradas', JSON.stringify(titulos), JSON.stringify(pagina.sumario.map((x) => x.texto)));
  dif('sumário', 'os nove destinos', JSON.stringify([...IDS, 'a-forma'].map((x) => `#${x}`)), JSON.stringify(pagina.sumario.map((x) => x.destino)));
  dif('página', 'a ordem das secções', JSON.stringify([...IDS, 'a-forma']), JSON.stringify(pagina.seccoes.map((s) => s.id)));
  for (const s of e.seccoes) {
    const c = pagina.seccoes.find((x) => x.id === s.id);
    if (!c) { diferencas.push({ seccao: s.id, o_que: 'a secção', mandato: s.titulo, construido: null }); continue; }
    dif(s.id, 'título', s.titulo, c.titulo);
    dif(s.id, 'número de parágrafos', String(s.paragrafos.length), String(c.paragrafos.length));
    s.paragrafos.forEach((p, i) => {
      const cp = c.paragrafos[i];
      dif(s.id, `P${p.n}`, p.molde, cp?.molde ?? null);
      if ((p.id ?? null) !== (cp?.id ?? null)) diferencas.push({ seccao: s.id, o_que: `P${p.n} · id`, mandato: p.id ?? null, construido: cp?.id ?? null });
      for (const v of cp?.valores ?? []) if (v.token === 'politica' && v.porta !== DOCUMENTO)
        diferencas.push({ seccao: s.id, o_que: `P${p.n} · a porta da política`, mandato: DOCUMENTO, construido: v.porta });
    });
    dif(s.id, 'portas', JSON.stringify(s.portas), JSON.stringify(c.portas.map((x) => x.texto)));
    /* A linha das portas inteira: as portas do mandato, juntas como a página as rende, e nada mais. */
    dif(s.id, 'o texto da linha das portas', JSON.stringify(s.portas.length ? [s.portas.join('')] : []), JSON.stringify(c.linhaDasPortas));
  }
  /* «como estão hoje»: as recusas e a forma contra as páginas de antes do bloco. */
  const recusasAntes = antes.recusas;
  const recusasDepois = pagina.seccoes.find((s) => s.id === 'o-que-nao-faz')?.lista ?? [];
  dif('o-que-nao-faz', 'as cinco recusas', JSON.stringify(recusasAntes), JSON.stringify(recusasDepois));
  const formaAntes = antes.seccoes.find((s) => s.id === 'a-forma');
  const formaDepois = pagina.seccoes.find((s) => s.id === 'a-forma');
  /* A forma «como está hoje», salvo a frase da escala, que o §3.9 do mandato muda (o achado 11). */
  const escalaAntes = antes.escala;
  if (!escalaAntes || formaAntes?.texto.split(escalaAntes).length !== 2) throw new Error(`${lang}: a frase antiga da escala não está uma vez na forma de antes`);
  if (!MANDATO.fecho_escala?.[lang]) throw new Error(`${lang}: as frases do mandato não trazem a frase nova da escala`);
  dif('a-forma', 'o texto da forma', formaAntes.texto.replace(escalaAntes, achata(MANDATO.fecho_escala[lang])), formaDepois?.texto ?? null);
  return diferencas;
}

/** A página de antes do bloco: as recusas e a forma, que o mandato quer como estão. */
function leAntes(lang) {
  const html = zlib.gunzipSync(fs.readFileSync(path.join(AQUI, ANTES[lang]))).toString('utf8');
  const r = parse(html);
  return { recusas: r.querySelectorAll('ul.politica-recusas > li').map(textoDe),
    escala: textoDe(r.querySelector('section#a-forma #a-escala .regra-v') ?? { text: '' }) || null,
    seccoes: r.querySelectorAll('section.metodo-secao').map((s) => ({ id: s.getAttribute('id'), titulo: textoDe(s.querySelector('h2')), texto: textoDe(s) })) };
}

const resultado = { cabeca: VERSAO.commit, construido_em: VERSAO.construido_em, edicoes: {}, plantas: [] };
const construidas = { cabeca: VERSAO.commit, construido_em: VERSAO.construido_em, mandato: MANDATO.mandato, edicoes: {} };
let falhou = false;
for (const lang of ['pt', 'en']) {
  const html = fs.readFileSync(path.join(DIST, ROTAS[lang]), 'utf8');
  const pagina = lePagina(html);
  const antes = leAntes(lang);
  const diferencas = confere(lang, pagina, antes);
  if (diferencas.length) falhou = true;
  const contados = pagina.seccoes.reduce((n, s) => n + s.paragrafos.length, 0);
  resultado.edicoes[lang] = { pagina: `dist/${ROTAS[lang]}`, paragrafos: contados, diferencas };
  construidas.edicoes[lang] = {
    titulo: pagina.titulo, abertura: pagina.abertura, descricao: pagina.descricao, sumario: pagina.sumario,
    seccoes: pagina.seccoes.map((s) => ({ id: s.id, titulo: s.titulo,
      paragrafos: s.paragrafos.map((p, i) => ({ n: i + 1, id: p.id, marca: p.marca, texto: p.texto, valores: p.valores })),
      lista: s.lista, portas: s.portas })),
  };
  /* As plantas: uma palavra trocada por secção, no primeiro parágrafo, num item das recusas e na forma. */
  const alvos = [
    ...IDS.map((id) => ({ id, onde: 'o primeiro parágrafo' })),
    { id: 'o-que-nao-faz', onde: 'uma recusa', lista: true },
    { id: 'a-forma', onde: 'a forma', forma: true },
    { id: 'fontes', onde: 'um parágrafo a mais, sem a classe', extra: true },
    { id: 'fontes', onde: 'prosa a mais com a classe da linha das portas', extra: true,
      html: '<p class="regra-portas">Um parágrafo a mais para os leitores.</p>', o_que: 'o texto da linha das portas' },
    { id: 'fontes', onde: 'um parágrafo a mais dentro de noscript', extra: true,
      html: '<noscript><p>Um parágrafo a mais para quem lê sem JavaScript.</p></noscript>' },
  ];
  for (const a of alvos) {
    const r = parse(html);
    const s = r.querySelector(`section#${a.id}`);
    if (a.extra) {
      /* O achado 8 da leitura a frio: um `<p>` sem a classe, a seguir ao primeiro parágrafo da secção. */
      s.querySelector('.metodo-corpo > p.metodo-p').insertAdjacentHTML('afterend', a.html ?? '<p>Um parágrafo a mais para os leitores.</p>');
      const plantada = confere(lang, lePagina(r.toString()), antes);
      const mordeu = plantada.some((d) => d.seccao === a.id && d.o_que === (a.o_que ?? 'número de parágrafos'));
      if (!mordeu) falhou = true;
      resultado.plantas.push({ lingua: lang, seccao: a.id, onde: a.onde, palavra: null, trocada: null, mordeu, diferencas: plantada.length });
      continue;
    }
    const el = a.lista ? s.querySelector('ul.politica-recusas > li') : a.forma ? s.querySelector('.regra-v p') : s.querySelector('.metodo-corpo > p.metodo-p');
    const no = el.childNodes.find((n) => n.nodeType === NodeType.TEXT_NODE && /[\p{L}]{4,}/u.test(n.rawText));
    const palavra = no.rawText.match(/[\p{L}]{4,}/u)[0];
    const trocada = palavra.slice(0, -1) + (palavra.endsWith('x') ? 'y' : 'x');
    no.rawText = no.rawText.replace(palavra, trocada);
    const plantada = confere(lang, lePagina(r.toString()), antes);
    const mordeu = plantada.some((d) => d.seccao === a.id);
    if (!mordeu) falhou = true;
    resultado.plantas.push({ lingua: lang, seccao: a.id, onde: a.onde, palavra, trocada, mordeu, diferencas: plantada.length });
  }
}
resultado.totais = {
  paragrafos: Object.values(resultado.edicoes).reduce((n, e) => n + e.paragrafos, 0),
  diferencas: Object.values(resultado.edicoes).reduce((n, e) => n + e.diferencas.length, 0),
  plantas: resultado.plantas.length,
  plantas_que_morderam: resultado.plantas.filter((p) => p.mordeu).length,
};
fs.mkdirSync(saidaDada, { recursive: true });
fs.writeFileSync(path.join(saidaDada, 'frases-construidas.json'), JSON.stringify(construidas, null, 1) + '\n');
fs.writeFileSync(path.join(saidaDada, 'conferencia-das-frases.json'), JSON.stringify(resultado, null, 1) + '\n');
for (const lang of ['pt', 'en']) {
  const e = resultado.edicoes[lang];
  console.log(`${lang}: ${e.paragrafos} parágrafos lidos, ${e.diferencas.length} diferença(s)`);
  for (const d of e.diferencas) console.log(`   ${d.seccao} · ${d.o_que}\n      mandato:    ${String(d.mandato).slice(0, 300)}\n      construído: ${String(d.construido).slice(0, 300)}`);
}
const mordidas = resultado.plantas.filter((p) => p.mordeu).length;
console.log(`plantas: ${mordidas} de ${resultado.plantas.length} morderam`);
process.exitCode = falhou ? 1 : 0;
