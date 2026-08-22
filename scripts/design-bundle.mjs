#!/usr/bin/env node
/**
 * O feixe de cartões do sistema de desenho, para o Claude Design.
 *
 * PORQUÊ. O painel do Claude Design lê cartões, ficheiros HTML que se bastam a
 * si próprios, e arruma-os pela linha de marca da primeira linha. Este ficheiro
 * fabrica esses cartões a partir do que já está construído, e de mais nada. O
 * feixe que ele escrevia até 22.08.2026 era o retrato da identidade v2
 * (Iowan/Avenir/SF Mono, `--yellow`, `--oxblood`, três densidades, a camada
 * Fundo) e parava porque a primeira página da v3 já não tem `details.deep`.
 * Esta versão retrata a identidade que está no ar: a v3 de `IDENTIDADE.md`
 * §1, §2 e §5, com as Emendas de 20 e 21.08.2026 (`design/especime-v3/direcao.md`).
 *
 * O QUE FAZ. Lê `dist/` (as páginas construídas e os cartões de partilha), as
 * seis folhas de `src/styles/`, `IDENTIDADE.md` e `direcao.md` (as regras),
 * `design/especime-v3/TIPOS.md` (os resumos dos tipos), `src/i18n/strings.mjs`
 * (o vocabulário fechado, nas duas edições) e `public/tipos/` (os ficheiros de
 * letra). Escreve `design-system/`: os cartões, os oito WOFF2 com as suas
 * licenças, e um README. Cada cartão abre com
 * `<!-- @dsCard group="…" viewport="…" -->` na primeira linha.
 *
 * O QUE NÃO FAZ. Não desenha nada de novo. Um cartão que invente uma cor, uma
 * disposição ou uma regra deixa de ser uma importação e passa a ser uma
 * proposta, e discutir-se-ia a proposta em vez do que existe. Onde um cartão
 * precisa de andaime (a grelha das amostras de cor) o andaime usa só fichas do
 * sítio: nenhum literal de cor entra aqui, pela mesma razão por que não entra em
 * `site.css` (`IDENTIDADE.md` §2). Os números que as folhas fixam não são
 * escritos: são lidos delas, e se lá mudarem de forma esta corrida pára em vez
 * de os inventar. O mesmo vale para as frases: toda a citação de
 * `IDENTIDADE.md` ou de `direcao.md` é procurada no ficheiro por uma âncora, e
 * a corrida pára com o nome do trecho que não encontrou. Uma citação não pode
 * envelhecer calada.
 *
 * OS TIPOS VIAJAM AO LADO, E NÃO DENTRO (decisão do lugar de direção, 22.08.2026,
 * depois de uma sonda lida no painel: `design/especime-v3/capturas/pos-fusao/`).
 * Os oito WOFF2 são copiados byte a byte de `public/tipos/` para
 * `design-system/tipos/<família>/`, com o `OFL.txt` de cada família ao lado, e
 * os resumos SHA-256 são conferidos contra `design/especime-v3/TIPOS.md` nesta
 * corrida. A folha embutida em cada cartão troca `url('/tipos/…')` por
 * `url('tipos/…')`, que é o caminho relativo ao ficheiro do cartão. Os tipos
 * ficam FORA do tecto de tamanho: escrevem-se uma vez e nenhum cartão os carrega
 * dentro de si.
 *
 * SELF-CONTAINED, E É CONFERIDO. Nenhum `<script>`, nem sequer as ilhas de
 * dados: um cartão é um retrato, não uma página viva. Nenhum pedido para fora:
 * as imagens que existem (os cartões de partilha) vão embutidas como `data:`, e
 * a folha só pode pedir os tipos que esta corrida escreveu. A folha vai inteira
 * dentro de um `<style>` no `<head>`, na ordem em que `Base.astro` a importa
 * (fichas, depois folha do sítio), mais a folha de família que a vista daquela
 * página importa. As ligações internas passam a absolutas no domínio legível,
 * para que abram o sítio no ar em vez de morrerem dentro do painel. A
 * conferência corre no fim, imprime a tabela e sai a 1 se algum cartão falhar.
 *
 * A PASTA É GERADA. `design-system/` está no `.gitignore`. O que se guarda é
 * este ficheiro; a pasta refaz-se com uma corrida. Esta corrida está FORA do
 * `npm run build` e não é um portão de construção.
 *
 * Uso:  npm run build                    (as páginas têm de estar construídas)
 *       node scripts/design-bundle.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { SITE_HOST_DISPLAY, SITE_NAME } from '../site.config.mjs';
import { t } from '../src/i18n/strings.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const SAIDA = path.join(RAIZ, 'design-system');
const TIPOS_ORIGEM = path.join(RAIZ, 'public', 'tipos');

/**
 * O TECTO DE TAMANHO DE UM CARTÃO, medido outra vez para a v3.
 *
 * Eram 250 KiB na v2. Hoje `dist/index.html` pesa 240,9 KiB só de HTML, antes de
 * uma única regra de estilo, e as três folhas que ela usa pesam 159,8 KiB:
 * nenhum tecto abaixo de «página mais folha» pode ser cumprido por um retrato da
 * primeira página, e um tecto que o cartão mais importante não pode cumprir não
 * é um tecto, é uma regra que se contorna. Fica em 512 KiB, meio megabyte, que
 * deixa o maior cartão real (a primeira página, 400,9 KiB na corrida de
 * 22.08.2026) com 111 KiB de folga. A corrida imprime o tamanho de cada cartão,
 * que é o número que interessa. Os ficheiros de letra não contam para aqui:
 * ficam ao lado dos cartões, escritos uma vez.
 */
const LIMITE_BYTES = 512 * 1024;

/**
 * O domínio na forma legível, não em punycode.
 *
 * `canonicalUrl()` devolve `xn--oestadodopas-2fb.pt`, que é o que uma etiqueta
 * canónica deve dizer. Um cartão é outra coisa: é para uma pessoa clicar, e o
 * que ela deve ver é o domínio como se escreve. A origem continua a ser a
 * mesma e única: `site.config.mjs`.
 */
const BASE = `https://${SITE_HOST_DISPLAY}`;

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const negrito = (s) => `\x1b[1m${s}\x1b[0m`;

function morre(mensagem) {
  console.error(`\n  ${vermelho('✗')} ${mensagem}\n`);
  process.exit(1);
}

/* ============================================================ o que se lê */

if (!fs.existsSync(DIST)) morre('não há `dist/`. Correr `npm run build` primeiro.');

const FOLHAS = ['tokens', 'site', 'inicio', 'leitura', 'linha', 'municipio'];
const css = {};
for (const nome of FOLHAS) {
  const f = path.join(RAIZ, 'src', 'styles', `${nome}.css`);
  if (!fs.existsSync(f)) morre(`falta \`src/styles/${nome}.css\`. A casa das folhas mudou de forma.`);
  css[nome] = fs.readFileSync(f, 'utf8');
}

const identidade = fs.readFileSync(path.join(RAIZ, 'IDENTIDADE.md'), 'utf8');
const direcao = fs.readFileSync(path.join(RAIZ, 'design/especime-v3/direcao.md'), 'utf8');
const tiposMd = fs.readFileSync(path.join(RAIZ, 'design/especime-v3/TIPOS.md'), 'utf8');

const PT = t('pt');
const EN = t('en');

for (const nome of FOLHAS) {
  if (/<\/style/i.test(css[nome])) {
    morre(`\`src/styles/${nome}.css\` contém \`</style\`, e por isso não pode ser embutida tal e qual.`);
  }
}

/**
 * Para LER uma folha, os comentários saem primeiro.
 *
 * Um comentário que escreva «2,09:1» ao lado de uma ficha seria lido por um
 * leitor ingénuo como se fosse o valor dela. O que vai EMBUTIDO nos cartões é a
 * folha inteira, com comentários e tudo: quem desenha tem direito a ler as
 * razões, e nesta casa as razões estão nos comentários.
 */
const semComentarios = (texto) => texto.replace(/\/\*[\s\S]*?\*\//g, '');
const fichasLimpas = semComentarios(css.tokens);

const versao = (() => {
  const f = path.join(DIST, 'version.json');
  if (!fs.existsSync(f)) return { commit: null };
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    return { commit: null };
  }
})();
const commitCurto = versao.commit ? String(versao.commit).slice(0, 7) : 'sem commit';

/* ======================================================== ferramentas de HTML */

function leDist(rota) {
  const f = path.join(DIST, rota);
  if (!fs.existsSync(f)) morre(`falta \`dist/${rota}\`. Correr \`npm run build\`.`);
  return fs.readFileSync(f, 'utf8');
}

function arvore(rota) {
  return parse(leDist(rota), { comment: true });
}

function escapa(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * As ligações internas passam a absolutas, para abrirem o sítio no ar.
 *
 * Uma âncora da própria página (`#conteudo`) fica como está: dentro do cartão
 * a página é a mesma, e mandá-la para fora quebrava-a. Um endereço que já é
 * absoluto fica como está: são as fontes, e o Método diz que sair do domínio é
 * uma mudança de contexto, não um erro. Uma ligação relativa que não comece por
 * barra não deveria existir (o portão de HTML conta zero), e se aparecer esta
 * corrida pára: resolvê-la a adivinhar seria pior do que falhar.
 */
function absolutizaLigacoes(no, ondeVem) {
  let internas = 0;
  let externas = 0;
  for (const el of no.querySelectorAll('[href]')) {
    const h = el.getAttribute('href');
    if (!h) continue;
    if (h.startsWith('#')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(h)) {
      if (/^https?:/i.test(h)) externas += 1;
      continue;
    }
    if (h.startsWith('/')) {
      el.setAttribute('href', BASE + h);
      internas += 1;
      continue;
    }
    morre(`ligação relativa inesperada em ${ondeVem}: "${h}". O portão de HTML conta zero destas.`);
  }
  return { internas, externas };
}

/** Um cartão não tem vida própria: nem código, nem ilhas de dados. */
function tiraCodigo(no) {
  let n = 0;
  for (const s of no.querySelectorAll('script')) {
    s.remove();
    n += 1;
  }
  return n;
}

function marca(grupo, viewport) {
  return `<!-- @dsCard group="${grupo}" viewport="${viewport}" -->`;
}

/* ================================================== os tipos, ao lado dos cartões */

/**
 * Os resumos de `TIPOS.md`, lidos das duas tabelas do ficheiro.
 *
 * Cada linha de tabela que nomeie um ficheiro de `public/tipos/` é emparelhada
 * com o ÚLTIMO resumo de 64 hexadecimais dessa linha: na tabela dos WOFF2 esse é
 * o do ficheiro entregue (o primeiro é o do TTF de montante), e na tabela das
 * licenças é o único. Se o formato mudar, esta corrida não encontra o ficheiro e
 * pára, em vez de aceitar um resumo que ninguém conferiu.
 */
function resumosDeclarados() {
  const mapa = new Map();
  for (const linha of tiposMd.split('\n')) {
    if (!linha.startsWith('|')) continue;
    const caminho = linha.match(/`(public\/tipos\/[^`]+)`/);
    if (!caminho) continue;
    const digestos = [...linha.matchAll(/`([0-9a-f]{64})`/g)].map((m) => m[1]);
    if (!digestos.length) continue;
    mapa.set(caminho[1], digestos[digestos.length - 1]);
  }
  if (!mapa.size) morre('não li um único resumo de tipo em `design/especime-v3/TIPOS.md`.');
  return mapa;
}

function ficheirosDeTipo() {
  const saida = [];
  for (const familia of fs.readdirSync(TIPOS_ORIGEM).sort()) {
    const dir = path.join(TIPOS_ORIGEM, familia);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const nome of fs.readdirSync(dir).sort()) {
      saida.push({ familia, nome, relativo: `tipos/${familia}/${nome}`, origem: path.join(dir, nome) });
    }
  }
  if (!saida.length) morre('`public/tipos/` está vazia.');
  return saida;
}

const TIPOS = ficheirosDeTipo();
const RESUMOS = resumosDeclarados();

/**
 * O caminho de um tipo dentro da folha passa a relativo.
 *
 * `tokens.css` escreve `url('/tipos/…')`, que num cartão aberto do disco aponta
 * para a raiz do sistema de ficheiros e não pede nada. A troca é uma só, sem
 * excepções: qualquer `/tipos/` dentro de um `url()` passa a `tipos/`, que é o
 * caminho a partir da pasta do cartão. A conferência do fim resolve cada um
 * deles contra os ficheiros que esta corrida escreveu.
 */
function tiposRelativos(folha) {
  let trocas = 0;
  const saida = folha.replace(/url\((\s*['"]?)\/tipos\//g, (_, abre) => {
    trocas += 1;
    return `url(${abre}tipos/`;
  });
  return { folha: saida, trocas };
}

/* ===================================================== os números que se leem */

/**
 * O que uma folha fixa não se escreve aqui: lê-se dela.
 *
 * Uma medida copiada para um cartão fica errada na primeira vez que a folha
 * mudar, e ninguém dá por isso (é o mesmo motivo de `IDENTIDADE.md` §10 para as
 * contagens do próprio sítio). Se a declaração mudar de forma, esta corrida pára
 * com o nome do que não encontrou.
 */
function daFolha(nome, re, oQue) {
  const m = semComentarios(css[nome]).match(re);
  if (!m) morre(`não encontrei em \`src/styles/${nome}.css\`: ${oQue}. A folha mudou de forma; o cartão que a cita tem de ser revisto.`);
  return m[1].trim();
}

const LARGURA_INVOLUCRO = daFolha('site', /\.wrap\s*\{[^}]*?max-width:\s*([^;]+);/, 'a largura do invólucro (`.wrap { max-width }`)');
const SELO_MOVEL_LARGURA = daFolha('inicio', /\.movel-selo\s*\{[^}]*?width:\s*([^;]+);/, 'a largura do selo do mapa no telemóvel (`.movel-selo { width }`)');
const SELO_MOVEL_ALTURA = daFolha('inicio', /\.movel-selo\s*\{[^}]*?height:\s*([^;]+);/, 'a altura do selo do mapa no telemóvel (`.movel-selo { height }`)');

/** A consulta de meios que mostra o selo do mapa: a última aberta antes dele. */
const SELO_MOVEL_MEDIA = (() => {
  const folha = semComentarios(css.inicio);
  const ate = folha.indexOf('.movel-selo');
  if (ate < 0) morre('não encontrei `.movel-selo` em `src/styles/inicio.css`.');
  const consultas = [...folha.slice(0, ate).matchAll(/@media[^{]+/g)].map((m) => m[0].trim());
  if (!consultas.length) morre('`.movel-selo` deixou de estar dentro de uma consulta de meios em `src/styles/inicio.css`.');
  return consultas[consultas.length - 1];
})();

/**
 * A paleta lê-se de `tokens.css`, nos dois temas, com o comentário de cada ficha.
 *
 * `:root` nu é a paleta clara completa, para todos; `:root[data-theme='dark']` é
 * a escolha do leitor, e o único caminho para o papel escuro (Emenda 12). O
 * comentário ao lado de cada ficha é o que traz as medições de contraste, e é
 * ele que o cartão imprime: nenhum destes números é datilografado aqui.
 */
function paleta() {
  const bloco = (re, oQue) => {
    const m = css.tokens.match(re);
    if (!m) morre(`não encontrei o bloco ${oQue} em \`src/styles/tokens.css\`.`);
    return m[1];
  };
  const pares = (texto) => {
    const mapa = new Map();
    for (const [, nome, valor, nota] of texto.matchAll(
      /--([a-z0-9-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/)?/g
    )) {
      mapa.set(nome, { valor: valor.trim(), nota: (nota ?? '').trim() });
    }
    return mapa;
  };
  const claro = pares(bloco(/\n:root \{([\s\S]*?)\n\}/, '`:root`'));
  const escuro = pares(bloco(/:root\[data-theme='dark'\] \{([\s\S]*?)\n\}/, "`:root[data-theme='dark']`"));
  const cores = [];
  const outras = [];
  for (const [nome, ficha] of claro) {
    const par = {
      nome,
      claro: ficha.valor,
      notaClara: ficha.nota,
      escuro: escuro.get(nome)?.valor ?? ficha.valor,
      notaEscura: escuro.get(nome)?.nota ?? '',
      sóEmClaro: !escuro.has(nome),
    };
    (ficha.valor.startsWith('#') ? cores : outras).push(par);
  }
  if (cores.length === 0) morre('não li uma única cor de `tokens.css`.');
  for (const nome of ['paper', 'ink', 'amber', 'ochre', 'cobalt', 'cobalt-palavra']) {
    if (!cores.some((c) => c.nome === nome)) morre(`\`--${nome}\` deixou de existir em \`tokens.css\`; o cartão da cor descreve uma paleta que já não é esta.`);
  }
  return { cores, outras, escuro };
}

const PALETA = paleta();
const ficha = (nome) => PALETA.outras.find((o) => o.nome === nome)?.claro ?? '';

/** A razão de contraste de uma ficha, lida do comentário dela e não escrita. */
function razao(nome, tema) {
  const c = PALETA.cores.find((x) => x.nome === nome);
  if (!c) morre(`\`--${nome}\` não está em \`tokens.css\`.`);
  const nota = tema === 'escuro' ? c.notaEscura : c.notaClara;
  const m = nota.match(/(\d+,\d+):1/);
  if (!m) morre(`o comentário de \`--${nome}\` em \`tokens.css\` (${tema}) deixou de trazer uma razão de contraste. O cartão da cor lê-a de lá, e não a inventa.`);
  return `${m[1]}:1`;
}

/** Uma razão escrita na prosa de um comentário de `tokens.css`, pela sua frase. */
function razaoNoComentario(ancora, oQue) {
  const re = new RegExp(`(\\d+,\\d+):1\\s*${ancora}`);
  const m = css.tokens.match(re);
  if (!m) morre(`não encontrei em \`src/styles/tokens.css\` a medição de ${oQue} («… ${ancora}»).`);
  return `${m[1]}:1`;
}

/** As fichas que saíram, e que não podem voltar sem uma decisão (§1.50). */
const SAIRAM = ['yellow', 'oxblood', 'paper-2', 'paper-3', 'shadow', 'dotcol', 'onyellow'];
for (const nome of SAIRAM) {
  if (new RegExp(`--${nome}\\s*:`).test(fichasLimpas)) {
    morre(`\`--${nome}\` voltou a \`tokens.css\`. O cartão da cor diz que saiu (\`DECISIONS.md\` §1.50); ou a ficha sai, ou o cartão mente.`);
  }
}

/* ============================================== as citações, procuradas e não copiadas */

/**
 * Uma citação é procurada no ficheiro que a governa, por uma âncora.
 *
 * A âncora é a chave de busca, não o texto: o que vai para o cartão é o que
 * estiver hoje no ficheiro. Se a frase mudar, a busca falha e a corrida pára com
 * o nome do trecho. É a mesma disciplina da amarra das decisões: uma citação não
 * envelhece calada.
 */
function trecho(fonte, ancora, oQue) {
  const linhas = fonte.replace(/\r\n/g, '\n').split('\n');
  const i = linhas.findIndex((l) => l.includes(ancora));
  if (i < 0) morre(`não encontrei em ${oQue} o trecho que contém «${ancora}». O texto mudou; o cartão que o cita tem de ser revisto.`);
  const abre = (l) => /^\s*(?:[-*]\s|\d+\.\s|#{1,6}\s|>\s?|\|)/.test(l);
  const citacao = (l) => /^\s*>/.test(l);
  let a = i;
  while (a > 0 && !abre(linhas[a]) && linhas[a - 1].trim() !== '') a -= 1;
  /* Uma citação de bloco tem o seu sinal em todas as linhas, e é uma só coisa:
     parar na segunda daria meia frase. */
  while (citacao(linhas[a]) && a > 0 && citacao(linhas[a - 1])) a -= 1;
  let b = i;
  while (
    b + 1 < linhas.length &&
    linhas[b + 1].trim() !== '' &&
    (!abre(linhas[b + 1]) || (citacao(linhas[a]) && citacao(linhas[b + 1])))
  ) {
    b += 1;
  }
  return linhas
    .slice(a, b + 1)
    .map((l) => l.trim().replace(/^>\s?/, ''))
    .join(' ')
    .replace(/^(?:[-*]\s+|\d+\.\s+)/, '')
    .trim();
}

const REGRA = (ancora) => trecho(identidade, ancora, '`IDENTIDADE.md`');
const EMENDA = (ancora) => trecho(direcao, ancora, '`design/especime-v3/direcao.md`');

/* ============================================== peças tiradas das páginas */

/**
 * Uma peça de um cartão é markup real, tirado de uma página construída.
 *
 * Redesenhar o selo à mão para o mostrar seria mostrar outra coisa: o cartão
 * passaria a ser a minha ideia do selo e não o selo. Tudo o que estes cartões
 * exibem sai de `dist/`.
 */
function peca(rota, seletor, { indice = 0, filtro = null, raiz = null } = {}) {
  const root = raiz ?? arvore(rota);
  const todos = root.querySelectorAll(seletor);
  const escolhidos = filtro ? todos.filter(filtro) : todos;
  const el = escolhidos[indice];
  if (!el) morre(`não encontrei "${seletor}" (índice ${indice}) em \`dist/${rota}\`.`);
  tiraCodigo(el);
  absolutizaLigacoes(el, `dist/${rota} → ${seletor}`);
  return el.outerHTML;
}

/* ================================== que folhas de família é que uma página usa */

/**
 * A resposta não se declara: mede-se na página construída.
 *
 * Cada folha de família tem classes que só ela define; a primeira delas, por
 * ordem alfabética, é a impressão digital da folha. Uma página construída traz a
 * sua folha em ligações para `dist/_astro/` e em blocos embutidos, e é aí que se
 * procura a impressão. Assim ninguém tem de escrever, por página, que folhas ela
 * importa, e uma vista que mude de folha muda também o cartão dela sem que este
 * ficheiro saiba.
 */
const FAMILIAS = FOLHAS.filter((n) => n !== 'tokens' && n !== 'site');

function impressoesDigitais() {
  const classesDe = (nome) => {
    const s = new Set();
    for (const m of semComentarios(css[nome]).matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) s.add(m[1]);
    return s;
  };
  const todas = Object.fromEntries(FOLHAS.filter((n) => n !== 'tokens').map((n) => [n, classesDe(n)]));
  const mapa = {};
  for (const nome of FAMILIAS) {
    const outras = new Set();
    for (const o of Object.keys(todas)) if (o !== nome) for (const c of todas[o]) outras.add(c);
    const só = [...todas[nome]].filter((c) => !outras.has(c)).sort();
    if (!só.length) morre(`\`src/styles/${nome}.css\` deixou de ter uma classe só sua; não há como medir que páginas a usam.`);
    mapa[nome] = só[0];
  }
  return mapa;
}

/**
 * A ordem das folhas de família é a ordem em que as vistas as importam.
 *
 * `Base.astro` importa as fichas e depois a folha do sítio; uma vista importa a
 * sua a seguir. A única página que importa duas é a do concelho, e a ordem
 * relativa das duas sai daqui inteira, sem ninguém a escrever.
 */
function ordemDasFamilias() {
  const dir = path.join(RAIZ, 'src', 'views');
  const ordem = [];
  for (const nome of fs.readdirSync(dir).sort()) {
    if (!nome.endsWith('.astro')) continue;
    const texto = fs.readFileSync(path.join(dir, nome), 'utf8');
    for (const m of texto.matchAll(/import\s+'\.\.\/styles\/([a-z]+)\.css'/g)) {
      if (FAMILIAS.includes(m[1]) && !ordem.includes(m[1])) ordem.push(m[1]);
    }
  }
  for (const f of FAMILIAS) if (!ordem.includes(f)) ordem.push(f);
  return ordem;
}

const IMPRESSOES = impressoesDigitais();
const ORDEM_FAMILIAS = ordemDasFamilias();

function folhaDaPagina(rota, root) {
  let bruta = '';
  const cabeca = root.querySelector('head');
  if (!cabeca) morre(`\`dist/${rota}\` não tem <head>.`);
  for (const no of cabeca.childNodes) {
    if (!no.rawTagName) continue;
    if (no.rawTagName === 'link' && (no.getAttribute('rel') ?? '') === 'stylesheet') {
      const href = no.getAttribute('href') ?? '';
      const f = path.join(DIST, href.replace(/^\//, ''));
      if (!fs.existsSync(f)) morre(`\`dist/${rota}\` liga a folha \`${href}\`, que não existe em \`dist/\`.`);
      bruta += fs.readFileSync(f, 'utf8');
    }
    if (no.rawTagName === 'style') bruta += no.innerHTML ?? '';
  }
  if (!bruta) morre(`\`dist/${rota}\` não traz folha nenhuma no <head>; não há como saber que folhas de família ela usa.`);
  const familias = ORDEM_FAMILIAS.filter((nome) =>
    new RegExp(`\\.${IMPRESSOES[nome]}(?![\\w-])`).test(bruta)
  );
  return familias;
}

/* ====================================================== o andaime dos cartões */

/**
 * O andaime: só mobília, e só com fichas do sítio.
 *
 * Nenhum literal de cor, nenhuma família de letra nova, nenhum acento novo
 * (`IDENTIDADE.md` §2). Onde uma classe do sítio serve, é a do sítio que se usa:
 * `.eyebrow`, `.lede`, `.sec-sub`. O que fica aqui é o que não existe lá, porque
 * o sítio não tem cartões. As caixas de amostra separam-se por fios e molduras
 * cinzentas, e não por um segundo papel: `--paper-2` e `--paper-3` saíram da
 * casa com a Emenda 1, e não voltam por um andaime.
 */
const ANDAIME = `
/* ===== andaime do cartão. Só fichas do sítio; nenhum literal de cor. ===== */
/* Só o topo e o fundo: a goteira lateral é a do invólucro, e a forma
   abreviada apagava-a (visto num retrato do cartão, não no código). */
.ds { padding-top: 34px; padding-bottom: 46px; display: grid; gap: 30px; }
.ds-cabeca { display: grid; gap: 10px; border-bottom: 1.5px solid var(--ink); padding-bottom: 16px; }
.ds-cabeca h1 { font-size: 27px; letter-spacing: -0.018em; }
.ds-bloco { display: grid; gap: 14px; border-top: 1px solid var(--rule); padding-top: 18px; }
.ds-bloco h2 { font-size: 18px; }
.ds-nota { font-size: 13.5px; line-height: 1.55; color: var(--muted); max-width: 66ch; }
.ds-regra { font-size: 15px; line-height: 1.6; max-width: 66ch; }
.ds-regra em { color: var(--muted); font-style: normal; }
.ds-mono { font-family: var(--f-instr); font-size: 11.5px; color: var(--muted); letter-spacing: 0.04em; }
.ds-rodape { border-top: 1px solid var(--rule); padding-top: 12px; font-family: var(--f-instr); font-size: 10px; letter-spacing: 0.06em; color: var(--muted); }
.ds-mostra { border: 1px solid var(--rule); padding: 20px; display: grid; gap: 12px; }
.ds-mostra-larga { overflow-x: auto; }
.ds-legenda { font-family: var(--f-instr); font-size: 10.5px; letter-spacing: 0.06em; color: var(--muted); }

/* paleta */
.ds-paleta { display: grid; grid-template-columns: repeat(auto-fill, minmax(196px, 1fr)); gap: 18px; }
.ds-cor { display: grid; gap: 7px; }
.ds-amostra { height: 66px; border: 1px solid var(--rule-strong); }
.ds-cor-nome { font-family: var(--f-instr); font-size: 11.5px; font-weight: 600; color: var(--ink); letter-spacing: 0.04em; }
.ds-cor-valor { font-family: var(--f-instr); font-size: 10.5px; color: var(--muted); letter-spacing: 0.04em; }
.ds-cor-nota { font-size: 11.5px; line-height: 1.45; color: var(--muted); }

/* o par de estados, lado a lado */
.ds-par { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 18px; }
.ds-par > div { display: grid; gap: 8px; align-content: start; border-left: 1px solid var(--rule); padding-left: 14px; }

/* letra */
.ds-tabela { width: 100%; border-collapse: collapse; font-size: 14.5px; }
.ds-tabela th, .ds-tabela td { text-align: left; vertical-align: top; padding: 9px 14px 9px 0; border-bottom: 1px solid var(--rule); }
.ds-tabela th { font-family: var(--f-instr); font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.ds-pilha { font-family: var(--f-instr); font-size: 11px; color: var(--muted); line-height: 1.7; word-break: break-word; }
.ds-codigo { font-family: var(--f-instr); font-size: 11px; line-height: 1.55; color: var(--ink); white-space: pre-wrap; margin: 0; overflow-x: auto; }

/* os cartões de partilha */
.ds-folha { display: grid; gap: 10px; }
.ds-folha img { max-width: 100%; height: auto; display: block; border: 1px solid var(--rule); }

/* o documento das regras */
.ds-doc { max-width: 74ch; display: grid; gap: 16px; }
.ds-doc h1 { font-size: 25px; }
.ds-doc h2 { font-size: 18px; padding-top: 14px; border-top: 1px solid var(--rule); }
.ds-doc p, .ds-doc li { font-size: 15px; line-height: 1.62; }
.ds-doc ul, .ds-doc ol { margin: 0; padding-left: 22px; display: grid; gap: 8px; }
.ds-doc blockquote { margin: 0; padding: 12px 0 12px 16px; border-left: 2px solid var(--rule-strong); color: var(--ink); }
.ds-doc code { font-family: var(--f-instr); font-size: 12.5px; padding: 1px 4px; border: 1px solid var(--rule); }
.ds-doc hr { border: 0; border-top: 1px solid var(--rule); margin: 6px 0; }
.ds-doc table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ds-doc th, .ds-doc td { text-align: left; vertical-align: top; padding: 8px 12px 8px 0; border-bottom: 1px solid var(--rule); }
.ds-doc th { font-family: var(--f-instr); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.ds-doc em { color: var(--muted); }
`;

/**
 * A folha de um cartão composto: as fichas, a folha do sítio, e as folhas de
 * família que as peças daquele cartão precisam para se desenharem.
 */
function folhaDe(familias) {
  for (const f of familias) if (!FAMILIAS.includes(f)) morre(`folha de família desconhecida: \`${f}\`.`);
  const emOrdem = ORDEM_FAMILIAS.filter((f) => familias.includes(f));
  const bruta = ['tokens', 'site', ...emOrdem].map((n) => css[n]).join('\n');
  const { folha, trocas } = tiposRelativos(bruta);
  if (!trocas) morre('a folha embutida não trouxe um único `url(/tipos/…)`; os `@font-face` saíram de `tokens.css` e os cartões ficariam sem letra.');
  return folha;
}

function cartao({ grupo, viewport, titulo, corpo, familias = [], cabecaExtra = '' }) {
  return `${marca(grupo, viewport)}
<!-- Gerado por scripts/design-bundle.mjs a partir de dist/ e de src/styles/, no commit ${commitCurto}. Não editar à mão.
     Folhas embutidas: tokens, site${familias.length ? ', ' + folhaDeOrdem(familias).join(', ') : ''}. Tipos ao lado, em tipos/. -->${cabecaExtra}
<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapa(titulo)}</title>
<style>
${folhaDe(familias)}
${ANDAIME}
</style>
</head>
<body>
<div class="wrap ds">
${corpo}
<p class="ds-rodape">${escapa(SITE_NAME)} · cartão gerado de dist/ e src/styles/ no commit ${commitCurto} · desenhado para ${viewport}px</p>
</div>
</body>
</html>
`;
}

const folhaDeOrdem = (familias) => ORDEM_FAMILIAS.filter((f) => familias.includes(f));

/**
 * Um cartão de página é a página construída, com quatro coisas feitas: o código
 * fora, a mobília de indexação do `<head>` fora, a folha embutida no lugar das
 * ligações, e as ligações internas absolutas. A mobília de indexação (canónico,
 * hreflang, Open Graph, as pré-cargas dos tipos) sai porque não pinta um pixel e
 * cada uma trazia um endereço que a conferência de auto-suficiência teria de
 * dispensar caso a caso.
 *
 * As folhas embutidas são as da origem, com os seus comentários, e não os
 * pacotes minificados de `dist/_astro/`: quem desenha lê as razões. Quais são
 * elas é que se mede na página construída (`folhaDaPagina`).
 */
function cartaoDePagina({ rota, grupo, viewport, titulo, tema = null, nota = '' }) {
  const root = arvore(rota);
  /* O título da página vai para dentro de um comentário: um `--` ali fecharia
     o comentário antes de tempo e o resto do cartão viraria texto. */
  const tituloDaPagina = (root.querySelector('title')?.text?.trim() ?? '')
    .replace(/-{2,}/g, '-')
    .replace(/[<>]/g, '');
  const familias = folhaDaPagina(rota, root);
  const codigo = tiraCodigo(root);
  const cabeca = root.querySelector('head');
  cabeca.set_content(
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${escapa(titulo)}</title>` +
      `\n<style>\n${folhaDe(familias)}\n</style>\n`
  );
  if (tema) {
    const html = root.querySelector('html');
    if (!html) morre(`\`dist/${rota}\` não tem <html>.`);
    html.setAttribute('data-theme', tema);
  }
  const ligacoes = absolutizaLigacoes(root, `dist/${rota}`);
  return {
    html: `${marca(grupo, viewport)}
<!-- Gerado por scripts/design-bundle.mjs a partir de dist/${rota}, no commit ${commitCurto}. Não editar à mão.
     Título da página no ar: ${tituloDaPagina}
     Retirados: ${codigo} bloco(s) de código e a mobília de indexação do <head> (canónico, hreflang, Open Graph, pré-cargas).
     Folhas embutidas, na ordem de Base.astro: tokens, site${familias.length ? ', ' + familias.join(', ') : ''}. Tipos ao lado, em tipos/.
     ${ligacoes.internas} ligações internas passadas ao domínio ${SITE_HOST_DISPLAY}.${nota ? '\n     ' + nota : ''} -->
${root.toString()}
`,
    codigo,
    ligacoes,
    familias,
  };
}

/* ============================================ IDENTIDADE.md para HTML simples */

/**
 * O bocado de markdown que `IDENTIDADE.md` usa, e nem uma linha mais.
 *
 * Títulos, fios, tabelas, citações, listas, parágrafos, `código`, **forte** e
 * *itálico*. Os trechos de código são postos de lado antes de se tratar do
 * forte e do itálico, senão um asterisco dentro de `PLANO-*` emparelhava com
 * outro de outra linha. No fim confere-se que não sobrou sintaxe por converter.
 */
function emLinha(texto) {
  const codigos = [];
  let s = escapa(texto).replace(/`([^`]+)`/g, (_, c) => {
    codigos.push(c);
    return `\u0000${codigos.length - 1}\u0000`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => `<code>${codigos[Number(n)]}</code>`);
  return s;
}

function markdownSimples(fonte) {
  const linhas = fonte.replace(/\r\n/g, '\n').split('\n');
  const fora = [];
  let i = 0;

  const eBloco = (l) =>
    l.trim() === '' ||
    /^#{1,6}\s/.test(l) ||
    /^---+\s*$/.test(l) ||
    /^\|/.test(l) ||
    /^>\s?/.test(l) ||
    /^[-*]\s/.test(l) ||
    /^\d+\.\s/.test(l);

  while (i < linhas.length) {
    const l = linhas[i];

    if (l.trim() === '') {
      i += 1;
      continue;
    }

    if (/^---+\s*$/.test(l)) {
      fora.push('<hr>');
      i += 1;
      continue;
    }

    const titulo = l.match(/^(#{1,6})\s+(.*)$/);
    if (titulo) {
      const n = Math.min(titulo[1].length, 3);
      fora.push(`<h${n}>${emLinha(titulo[2].trim())}</h${n}>`);
      i += 1;
      continue;
    }

    if (/^\|/.test(l)) {
      const bloco = [];
      while (i < linhas.length && /^\|/.test(linhas[i])) bloco.push(linhas[i++]);
      const celulas = (linha) =>
        linha
          .replace(/^\|/, '')
          .replace(/\|\s*$/, '')
          .split('|')
          .map((c) => c.trim());
      const separador = (linha) => /^[\s|:-]+$/.test(linha);
      const cabecalho = separador(bloco[1] ?? '') ? celulas(bloco[0]) : null;
      const corpo = bloco.slice(cabecalho ? 2 : 0).filter((x) => !separador(x));
      const th = cabecalho
        ? `<thead><tr>${cabecalho.map((c) => `<th>${emLinha(c)}</th>`).join('')}</tr></thead>`
        : '';
      const tr = corpo
        .map((linha) => `<tr>${celulas(linha).map((c) => `<td>${emLinha(c)}</td>`).join('')}</tr>`)
        .join('');
      fora.push(`<table>${th}<tbody>${tr}</tbody></table>`);
      continue;
    }

    if (/^>\s?/.test(l)) {
      const bloco = [];
      while (i < linhas.length && /^>\s?/.test(linhas[i])) bloco.push(linhas[i++].replace(/^>\s?/, ''));
      fora.push(`<blockquote><p>${emLinha(bloco.join(' ').trim())}</p></blockquote>`);
      continue;
    }

    const lista = /^[-*]\s/.test(l) ? 'ul' : /^\d+\.\s/.test(l) ? 'ol' : null;
    if (lista) {
      const itens = [];
      while (i < linhas.length) {
        const linha = linhas[i];
        const abre = lista === 'ul' ? /^[-*]\s+(.*)$/ : /^\d+\.\s+(.*)$/;
        const m = linha.match(abre);
        if (m) {
          itens.push(m[1].trim());
          i += 1;
          continue;
        }
        /* Continuação: uma linha indentada que pertence ao item anterior. */
        if (itens.length && /^\s+\S/.test(linha)) {
          itens[itens.length - 1] += ' ' + linha.trim();
          i += 1;
          continue;
        }
        break;
      }
      fora.push(`<${lista}>${itens.map((x) => `<li>${emLinha(x)}</li>`).join('')}</${lista}>`);
      continue;
    }

    const paragrafo = [];
    while (i < linhas.length && !eBloco(linhas[i])) paragrafo.push(linhas[i++].trim());
    fora.push(`<p>${emLinha(paragrafo.join(' '))}</p>`);
  }

  const html = fora.join('\n');
  /* Sintaxe que tenha escapado à conversão apareceria ao leitor como ruído.
     O que está dentro de <code> é texto citado, não sintaxe: desde o bloco T a
     constituição escreve `**Afecta:**` entre crases, e essa sequência não é um
     forte por converter. Por isso o código sai antes de se procurar. */
  const semEtiquetas = html.replace(/<code>[\s\S]*?<\/code>/g, '').replace(/<[^>]+>/g, '');
  for (const [re, oQue] of [
    [/\*\*/, 'forte por converter (`**`)'],
    [/^\s*\|/m, 'linha de tabela por converter (`|`)'],
    [/^\s*#{1,6}\s/m, 'título por converter (`#`)'],
    [/`/, 'código por converter (crase)'],
  ]) {
    if (re.test(semEtiquetas)) morre(`a conversão de IDENTIDADE.md deixou ${oQue}.`);
  }
  return html;
}

/* ==================================================== os cartões, um a um */

const cartoes = [];
const regista = (ficheiro, grupo, largura, html, nota) => cartoes.push({ ficheiro, grupo, largura, html, nota });

const citar = (texto) => `<p class="ds-regra">«${emLinha(texto)}»</p>`;

/* ---------------------------------------------------------------- 01. Cor */
{
  const amostras = PALETA.cores
    .map(
      (c) => `      <div class="ds-cor">
        <div class="ds-amostra" style="background: var(--${c.nome})"></div>
        <span class="ds-cor-nome">--${c.nome}</span>
        <span class="ds-cor-valor">claro ${escapa(c.claro)}<br>escuro ${escapa(c.escuro)}${c.sóEmClaro ? ' (a mesma ficha)' : ''}</span>
        ${c.notaClara ? `<span class="ds-cor-nota">claro: ${emLinha(c.notaClara)}</span>` : ''}
        ${c.notaEscura ? `<span class="ds-cor-nota">escuro: ${emLinha(c.notaEscura)}</span>` : ''}
      </div>`
    )
    .join('\n');

  const comentarioDoContorno = (() => {
    const m = css.tokens.match(/\/\*\s*(O CONTORNO DE UM MARCADOR DE ESTADO[\s\S]*?)\*\//);
    if (!m) morre('não encontrei em `tokens.css` o comentário do contorno do marcador (`--onamber`).');
    return m[1].split('\n').map((l) => l.replace(/^\s*/, '')).join(' ').replace(/\s+/g, ' ').trim();
  })();

  const foraDoLimiar = peca('index.html', '.peca[data-estado="fora"] .peca-topo');
  const dentroDoLimiar = peca('index.html', '.peca[data-estado="dentro"][data-limiar="sim"] .peca-topo');
  const semLimiar = peca('index.html', '.peca[data-estado="sem"] .peca-topo');
  const aCor = peca('metodo/index.html', '#a-cor');

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Fundamentos</span>
    <h1>Cor</h1>
    <p class="sec-sub">A paleta inteira de <code class="ds-mono">src/styles/tokens.css</code>, nos dois temas, e o par de estados que é a única cor do sítio.</p>
  </header>

  <section class="ds-bloco">
    <h2>A regra, antes da paleta</h2>
    ${citar(REGRA('**A cor aparece só onde a fonte publica um limiar formal**'))}
    <p class="ds-nota">Emenda 1, de 20.08.2026, tal como <code class="ds-mono">direcao.md</code> a escreve: «${emLinha(EMENDA('**Cor (§3 emendado):**'))}»</p>
  </section>

  <section class="ds-bloco">
    <h2>A paleta</h2>
    <p class="ds-nota">Cada amostra é pintada com a própria ficha, não com o valor copiado: o cartão é a paleta, não um retrato dela. O valor e o comentário por baixo são o que <code class="ds-mono">tokens.css</code> diz em cada tema, palavra por palavra. As razões de contraste vêm desses comentários e não estão escritas em lado nenhum deste gerador.</p>
    <div class="ds-paleta">
${amostras}
    </div>
  </section>

  <section class="ds-bloco">
    <h2>O par de estados</h2>
    <div class="ds-par">
      <div>
        <div class="ds-mostra">${foraDoLimiar}</div>
        <p class="ds-legenda">--amber · --onamber · --ochre</p>
        <p class="ds-nota">Marcador <code class="ds-mono">--amber</code> com contorno de tinta (${escapa(razao('amber', 'claro'))} sozinho sobre papel claro, e é essa medição que obriga ao contorno); palavra em <code class="ds-mono">--ochre</code>, ${escapa(razao('ochre', 'claro'))}. Em escuro o âmbar lê-se sozinho, ${escapa(razao('amber', 'escuro'))}, e a palavra do estado passa a ser o próprio âmbar.</p>
      </div>
      <div>
        <div class="ds-mostra">${dentroDoLimiar}</div>
        <p class="ds-legenda">--cobalt · --cobalt-palavra</p>
        <p class="ds-nota">Marcador e palavra em <code class="ds-mono">--cobalt</code>, ${escapa(razao('cobalt', 'claro'))} em claro. Em escuro o marcador mede ${escapa(razao('cobalt', 'escuro'))} sozinho e é o contorno que o segura; a palavra clareia para <code class="ds-mono">--cobalt-palavra</code>, ${escapa(razao('cobalt-palavra', 'escuro'))}.</p>
      </div>
      <div>
        <div class="ds-mostra">${semLimiar}</div>
        <p class="ds-legenda">sem ficha de cor: só --ink</p>
        <p class="ds-nota">Nenhuma cor: o quadrado é só contorno e o estado diz-se por palavras.</p>
      </div>
    </div>
    <p class="ds-nota">As três peças são <code class="ds-mono">.peca-topo</code> tirados de <code class="ds-mono">dist/index.html</code>, do painel da primeira página.</p>
    ${citar(REGRA('- **Fora do limiar**'))}
    ${citar(REGRA('- **Dentro do limiar**'))}
    ${citar(REGRA('- **Sem limiar** e **por confirmar**'))}
    ${citar(REGRA('- **Tudo o resto**'))}
    ${citar(REGRA('**O estado nunca é dito só pela cor.**'))}
  </section>

  <section class="ds-bloco">
    <h2>O contorno não é desenho, é uma medição</h2>
    <p class="ds-nota">De <code class="ds-mono">tokens.css</code>, o comentário da ficha <code class="ds-mono">--onamber</code>: «${emLinha(comentarioDoContorno)}»</p>
    <p class="ds-nota">Em claro é a tinta que segura o âmbar (${escapa(razaoNoComentario('contra o âmbar', 'a tinta sobre o âmbar'))}); em escuro é a tinta clara que segura o cobalto (${escapa(razaoNoComentario('contra ele', 'a tinta sobre o cobalto'))}). Em cada tema, cada marcador é segurado por si ou pelo contorno, e nunca por nenhum dos dois.</p>
  </section>

  <section class="ds-bloco">
    <h2>A regra para um caso novo</h2>
    ${citar(REGRA('**A regra para um caso novo: não há acento novo.**'))}
  </section>

  <section class="ds-bloco">
    <h2>O que saiu, e não foi por gosto</h2>
    ${citar(REGRA('**Duas cores retiraram-se, e não foi por gosto**'))}
    <p class="ds-nota">Esta corrida confere que nenhuma delas voltou: <code class="ds-mono">${SAIRAM.map((n) => '--' + n).join('</code> · <code class="ds-mono">')}</code> não estão declaradas em <code class="ds-mono">tokens.css</code>, e se alguma voltar a corrida pára em vez de imprimir este parágrafo.</p>
  </section>

  <section class="ds-bloco">
    <h2>O tema</h2>
    <p class="ds-nota">Emenda 12, de 21.08.2026: «${emLinha(EMENDA('**Tema (§3 «Modo escuro» concretizado'))}»</p>
    ${citar(REGRA('**A paleta escura é regra provisória, e não proposta.**'))}
    <p class="ds-nota">O controlo «claro · escuro» está no cabeçalho de todas as páginas e chega ao cartão com o atributo <code class="ds-mono">hidden</code> que a página lhe dá: é o código adiado do sítio que o mostra, e um cartão não tem código. O papel escuro vê-se no cartão <code class="ds-mono">11-pagina-primeira-escuro.html</code>.</p>
  </section>

  <section class="ds-bloco">
    <h2>O que o Método diz ao leitor</h2>
    <div class="ds-mostra">${aCor}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/metodo/index.html</code>, a entrada de fecho <code class="ds-mono">#a-cor</code>. É texto governado: a amarra das decisões prende-o a <code class="ds-mono">src/data/metodo.mjs</code>, carácter a carácter.</p>
  </section>

  <section class="ds-bloco">
    <h2>As fichas que não são cor</h2>
    <p class="ds-pilha">${PALETA.outras.map((o) => `--${escapa(o.nome)}: ${escapa(o.claro)}`).join('<br>')}</p>
    <p class="ds-nota">As três famílias de letra estão no cartão «Tipo».</p>
  </section>`;

  regista(
    '01-cor.html',
    'Fundamentos',
    720,
    cartao({ grupo: 'Fundamentos', viewport: 720, titulo: 'Cor', corpo, familias: ['inicio'] }),
    `${PALETA.cores.length} fichas de cor, nos dois temas`
  );
}

/* --------------------------------------------------------------- 02. Tipo */
{
  const wordmark = peca('index.html', '.wordmark');
  const prosa = peca('sobre/index.html', 'p.sobre-texto');
  const valorComSelo = peca('index.html', '.banda-legenda-item');
  const antetitulo = peca('index.html', 'span.eyebrow');
  const navegacao = peca('index.html', 'nav.nav-principal');
  const aLetra = peca('metodo/index.html', '#a-letra');

  const fontFaces = (() => {
    const blocos = [...css.tokens.matchAll(/@font-face\s*\{[\s\S]*?\}/g)].map((m) => m[0]);
    if (!blocos.length) morre('não encontrei um único `@font-face` em `tokens.css`.');
    return blocos.join('\n\n');
  })();

  const tabelaTipos = TIPOS.map(
    (f) => `        <tr><td><code class="ds-mono">${escapa(f.relativo)}</code></td><td class="ds-mono">${(fs.statSync(f.origem).size / 1024).toFixed(1)} KiB</td><td class="ds-mono">${escapa((RESUMOS.get(`public/tipos/${f.familia}/${f.nome}`) ?? '').slice(0, 16))}…</td></tr>`
  ).join('\n');

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Fundamentos</span>
    <h1>Tipo</h1>
    <p class="sec-sub">Três tipos, três funções, sem sobreposição. É a primeira regra da identidade, e é a que distingue uma medição de uma data.</p>
  </header>

  <section class="ds-bloco">
    <h2>As três famílias</h2>
    <table class="ds-tabela">
      <thead><tr><th>Tipo</th><th>Função</th><th>Onde aparece</th></tr></thead>
      <tbody>
${['| **Spectral** |', '| **Bitter** |', '| **Spectral SC** |']
  .map((ancora) => {
    const celulas = REGRA(ancora)
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => emLinha(c.trim()));
    return `        <tr>${celulas.map((c) => `<td>${c}</td>`).join('')}</tr>`;
  })
  .join('\n')}
      </tbody>
    </table>
    <p class="ds-nota">A tabela é a de <code class="ds-mono">IDENTIDADE.md</code> §1, lida do ficheiro. Emenda 5, de 20.08.2026: «${emLinha(EMENDA('**Tipos (§2 emendado'))}»</p>
    <p class="ds-pilha">--f-prosa: ${escapa(ficha('f-prosa'))}<br>--f-instr: ${escapa(ficha('f-instr'))}<br>--f-versal: ${escapa(ficha('f-versal'))}</p>
    <p class="ds-nota">As pilhas são o recuo declarado na folha, para o intervalo em que o ficheiro ainda não chegou. Não são o tipo: o tipo está alojado aqui.</p>
  </section>

  <section class="ds-bloco">
    <h2>A marca, em Spectral</h2>
    <div class="ds-mostra">${wordmark}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/index.html</code>.</p>
  </section>

  <section class="ds-bloco">
    <h2>Prosa, em Spectral</h2>
    <div class="ds-mostra">${prosa}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/sobre/index.html</code>: é o texto decidido do Sobre, e a prosa mais longa que o sítio tem sobre si próprio.</p>
  </section>

  <section class="ds-bloco">
    <h2>Um valor medido, em Bitter</h2>
    <div class="ds-mostra">${valorComSelo}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/index.html</code>, a legenda da régua da convergência. O número vai a Bitter porque tem linha no livro-razão; o selo ao lado é a porta para ela, e a palavra «provisório» é a bandeira da fonte, dita por extenso.</p>
    ${citar(REGRA('**Algarismos tabulares versais nos instrumentos.**'))}
  </section>

  <section class="ds-bloco">
    <h2>Versaletes editoriais, em Spectral SC</h2>
    <div class="ds-mostra">${antetitulo}</div>
    <div class="ds-mostra ds-mostra-larga">${navegacao}</div>
    <p class="ds-nota">Em cima o antetítulo de um instrumento, em baixo a navegação do cabeçalho, os dois de <code class="ds-mono">dist/index.html</code>.</p>
    ${citar(REGRA('**Bitter em caixa alta só dentro dos instrumentos.**'))}
  </section>

  <section class="ds-bloco">
    <h2>Um número no meio de uma frase</h2>
    ${citar(REGRA('Bitter é a marca de **um valor que tem linha no livro-razão**'))}
    <p class="ds-nota">${emLinha(REGRA('Por isso «Portugal está **18** pontos abaixo da média da UE-27.'))}</p>
  </section>

  <section class="ds-bloco">
    <h2>Alojados aqui, sem anfitriões de terceiros</h2>
    <div class="ds-mostra">${aLetra}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/metodo/index.html</code>, a entrada de fecho <code class="ds-mono">#a-letra</code>: é a frase governada que o Método diz ao leitor, e a amarra das decisões prende-a a <code class="ds-mono">src/data/metodo.mjs</code>.</p>
    ${citar(REGRA('**Só tipos alojados aqui.**'))}
    <table class="ds-tabela">
      <thead><tr><th>Ficheiro, ao lado deste cartão</th><th>Bytes</th><th>SHA-256 (TIPOS.md)</th></tr></thead>
      <tbody>
${tabelaTipos}
      </tbody>
    </table>
    <p class="ds-nota">Os ficheiros são cópias byte a byte de <code class="ds-mono">public/tipos/</code>, escritas por esta corrida ao lado dos cartões, e cada resumo foi conferido contra <code class="ds-mono">design/especime-v3/TIPOS.md</code>. Licença: SIL Open Font License 1.1, com o <code class="ds-mono">OFL.txt</code> de cada família ao lado dos seus ficheiros.</p>
  </section>

  <section class="ds-bloco">
    <h2>O bloco <code class="ds-mono">@font-face</code>, tal como é servido</h2>
    <pre class="ds-codigo">${escapa(fontFaces)}</pre>
    <p class="ds-nota">De <code class="ds-mono">src/styles/tokens.css</code>. Dentro deste cartão os endereços são relativos (<code class="ds-mono">tipos/…</code> em vez de <code class="ds-mono">/tipos/…</code>), que é a única diferença entre a folha do sítio e a folha embutida aqui.</p>
  </section>`;

  regista(
    '02-tipo.html',
    'Fundamentos',
    720,
    cartao({ grupo: 'Fundamentos', viewport: 720, titulo: 'Tipo', corpo, familias: ['inicio'] }),
    `3 famílias, ${TIPOS.filter((f) => f.nome.endsWith('.woff2')).length} ficheiros`
  );
}

/* ------------------------------------------------- 03. Selo e marcador */
{
  const legenda = peca('livro-razao/index.html', 'ul.aparelho-selos');
  /* O selo a tracejado lê-se da primeira página onde ele existir, e a nota do
     cartão diz de onde veio. A ordem é a das páginas mais prováveis. */
  const candidatas = ['index.html', 'livro-razao/index.html', 'correcoes/index.html', 'municipios/evora/index.html'];
  const ondeIncompleto = candidatas.find((rota) =>
    arvore(rota)
      .querySelectorAll('.claim-com-chip')
      .some((el) => el.querySelector('.src-chip.is-unverified') !== null)
  );
  if (!ondeIncompleto) morre('não encontrei nenhum selo a tracejado nas páginas candidatas.');
  const seloIncompleto = peca(ondeIncompleto, '.claim-com-chip', {
    filtro: (el) => el.querySelector('.src-chip.is-unverified') !== null,
  });

  const foraTopo = peca('index.html', '.peca[data-estado="fora"] .peca-topo');
  const dentroTopo = peca('index.html', '.peca[data-estado="dentro"][data-limiar="sim"] .peca-topo');
  const semTopo = peca('index.html', '.peca[data-estado="sem"] .peca-topo');
  const provisorio = peca('index.html', '.claim-com-provisorio');
  const marcador = peca('a-verificar/index.html', 'span.marcador');
  const correcao = peca('correcoes/index.html', '.log-linha');

  /* O texto oculto do selo mostra-se como texto, porque é isso que ele é para
     quem ouve a página. O `.vh` é lido do próprio selo que está ao lado. */
  const ocultoDoSelo = (() => {
    const root = arvore('index.html');
    const chip = root.querySelectorAll('a.src-chip').find((c) => c.querySelector('.vh'));
    if (!chip) morre('nenhum selo de `dist/index.html` traz texto oculto (`.vh`).');
    const visivel = chip.querySelector('.src-chip-texto')?.text?.trim() ?? '';
    const oculto = chip.querySelector('.vh')?.text ?? '';
    return { visivel, oculto };
  })();

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Componentes</span>
    <h1>Selo e marcador</h1>
    <p class="sec-sub">Um glifo, um significado. Todo o markup deste cartão foi tirado das páginas construídas; nada aqui foi redesenhado para a ocasião.</p>
  </header>

  <section class="ds-bloco">
    <h2>A regra dos glifos</h2>
    <p class="ds-nota">Emenda 10, de 20.08.2026: «${emLinha(EMENDA('**Um glifo, um significado'))}»</p>
  </section>

  <section class="ds-bloco">
    <h2>O selo, e os seus dois estados</h2>
    <div class="ds-mostra">${legenda}</div>
    <p class="ds-nota"><code class="ds-mono">dist/livro-razao/index.html</code> · a amostra dos dois estados, na coluna do aparelho do índice. Ali o selo é só o quadrado, e as palavras são as da casa: «${escapa(PT.livro.seloCheio)}» e «${escapa(PT.livro.seloTracejado)}» (EN: «${escapa(EN.livro.seloCheio)}», «${escapa(EN.livro.seloTracejado)}»).</p>
    <div class="ds-mostra">${seloIncompleto}</div>
    <p class="ds-nota"><code class="ds-mono">dist/${ondeIncompleto}</code> · o estado a tracejado em uso, com o marcador dentro do selo a dizer o que falta.</p>
    ${citar(REGRA('**O selo é sempre uma ligação**'))}
    ${citar(REGRA('**O selo escreve «fonte».**'))}
  </section>

  <section class="ds-bloco">
    <h2>O texto oculto do selo</h2>
    <p class="ds-mono">visível: ${escapa(ocultoDoSelo.visivel)}</p>
    <p class="ds-mono">oculto (<code class="ds-mono">.vh</code>): ${escapa(ocultoDoSelo.oculto)}</p>
    <p class="ds-nota">Emenda 15, de 21.08.2026, encurtou-o: «O texto oculto do selo, para leitores de ecrã, encurta para “fonte · &lt;estudo&gt;”.» O que se vê na página é a palavra; o que se ouve é a palavra mais o nome do estudo. Aqui está impresso como texto porque é assim que ele existe para quem não vê a página.</p>
  </section>

  <section class="ds-bloco">
    <h2>O marcador de estado, ao pé de um valor</h2>
    <div class="ds-par">
      <div><div class="ds-mostra">${foraTopo}</div><p class="ds-legenda">âmbar com contorno de tinta</p></div>
      <div><div class="ds-mostra">${dentroTopo}</div><p class="ds-legenda">cobalto</p></div>
      <div><div class="ds-mostra">${semTopo}</div><p class="ds-legenda">só contorno, sem cor</p></div>
    </div>
    <p class="ds-nota">De <code class="ds-mono">dist/index.html</code>. O quadrado e a palavra andam sempre juntos; as peças inteiras estão no cartão «O par de estados».</p>
  </section>

  <section class="ds-bloco">
    <h2>A palavra «provisório»</h2>
    <div class="ds-mostra">${provisorio}</div>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code> · onde a fonte marca a linha como provisória (<code class="ds-mono">source_flag: p</code>), a palavra fica ao lado do valor e o selo continua a ser a porta. É a decisão (d) da direção, de 20.08.2026.</p>
  </section>

  <section class="ds-bloco">
    <h2>O marcador de incerteza, e é um só</h2>
    <div class="ds-mostra"><p style="margin:0">${marcador}</p></div>
    ${citar(REGRA('Um marcador: **`[a verificar]`**'))}
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/a-verificar/index.html</code>, que é a página que o explica. A palavra do estado é outra coisa: «${escapa(PT.estado.porConfirmar)}» / «${escapa(EN.estado.porConfirmar)}».</p>
  </section>

  <section class="ds-bloco">
    <h2>A correção tem forma, não tem cor</h2>
    <div class="ds-mostra">${correcao}</div>
    <p class="ds-nota"><code class="ds-mono">dist/correcoes/index.html</code> · o valor antigo riscado a cinzento, o novo a tinta ao lado, a data, e uma porta só.</p>
    ${citar(REGRA('**No registo de correções a porta é o selo da LINHA'))}
  </section>`;

  regista(
    '03-selo-e-marcador.html',
    'Componentes',
    720,
    cartao({ grupo: 'Componentes', viewport: 720, titulo: 'Selo e marcador', corpo, familias: ['inicio', 'leitura', 'linha'] }),
    '8 peças, todas de dist/'
  );
}

/* ------------------------------------------------------------- 04. A régua */
{
  const casa = arvore('index.html');
  const escolhe = (filtro, oQue) => {
    const p = casa.querySelectorAll('.peca').filter(filtro)[0];
    if (!p) morre(`não encontrei em \`dist/index.html\` ${oQue}.`);
    const nome = p.querySelector('.peca-nome')?.text?.trim() ?? '';
    const limiar = p.querySelector('.peca-limiar');
    const regua = p.querySelector('.regua');
    if (!regua) morre(`a peça «${nome}» de \`dist/index.html\` deixou de trazer régua.`);
    tiraCodigo(regua);
    absolutizaLigacoes(regua, `dist/index.html → .peca[${nome}] .regua`);
    return { nome, limiar: limiar ? limiar.outerHTML : '', regua: regua.outerHTML, estado: p.getAttribute('data-estado') };
  };

  const fora = escolhe((p) => p.getAttribute('data-estado') === 'fora' && p.querySelector('.regua'), 'uma peça fora do limiar com régua');
  const dentro = escolhe(
    (p) => p.getAttribute('data-estado') === 'dentro' && p.getAttribute('data-limiar') === 'sim' && p.querySelector('.regua') && p.querySelector('.regua').querySelectorAll('line.regua-ref').length === 1,
    'uma peça dentro do limiar com régua de uma referência só'
  );
  const banda = escolhe(
    (p) => p.querySelector('.regua') && p.querySelector('.regua').querySelectorAll('line.regua-ref').length === 2,
    'uma peça com banda de dois lados (duas referências na mesma régua)'
  );

  const bandaRegiao = peca('index.html', '.banda');

  const evoraRaiz = arvore('municipios/evora/index.html');
  const evoraPeca = evoraRaiz.querySelectorAll('.peca').filter((p) => p.querySelector('.regua'))[0];
  if (!evoraPeca) morre('não encontrei em `dist/municipios/evora/index.html` nenhuma peça com régua.');
  const evoraNome = evoraPeca.querySelector('.peca-nome')?.text?.trim() ?? '';
  tiraCodigo(evoraPeca);
  absolutizaLigacoes(evoraPeca, 'dist/municipios/evora/index.html → .peca com régua');

  const umaRegua = (p, legenda) => `    <div class="ds-mostra">
      <p class="ds-legenda">${escapa(p.nome)} · ${escapa(legenda)}</p>
      ${p.limiar}
      ${p.regua}
    </div>`;

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Disposições</span>
    <h1>A régua</h1>
    <p class="sec-sub">Uma gramática, e uma só. Substitui o cartão «Disposições A · B · C», que descrevia disposições da v2 que já não existem.</p>
  </header>

  <section class="ds-bloco">
    <h2>A gramática</h2>
    <p class="ds-nota">Emenda 4, de 20.08.2026: «${emLinha(EMENDA('**Régua (§3/§4 emendado):**'))}»</p>
    <p class="ds-nota">Os números destas réguas são os das próprias páginas, intactos. O invólucro do sítio tem <code class="ds-mono">${escapa(LARGURA_INVOLUCRO)}</code>, lido de <code class="ds-mono">src/styles/site.css</code>.</p>
  </section>

  <section class="ds-bloco">
    <h2>Fora do limiar</h2>
${umaRegua(fora, 'a barra é a distância à referência; o marcador e a palavra levam a cor')}
  </section>

  <section class="ds-bloco">
    <h2>Dentro do limiar</h2>
${umaRegua(dentro, 'uma referência só')}
  </section>

  <section class="ds-bloco">
    <h2>Uma banda de dois lados</h2>
${umaRegua(banda, 'duas referências na mesma escala; dentro é estar entre elas')}
    <p class="ds-nota">Duas das treze linhas do Procedimento não têm um lado, têm dois, e a régua desenha os dois traços de referência. A conta está escrita uma vez, em <code class="ds-mono">src/lib/estado.mjs</code>.</p>
  </section>

  <section class="ds-bloco">
    <h2>A banda das regiões</h2>
    <div class="ds-mostra ds-mostra-larga">${bandaRegiao}</div>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code> · a mesma gramática numa escala partilhada: a referência é a média da UE-27, a barra é a distância a ela, e não há cor nenhuma, porque uma média não é um limiar publicado (Emenda 1). As barras das regiões que não estão escolhidas vêm com <code class="ds-mono">hidden</code>: é o código adiado do sítio que as troca, e um cartão não tem código.</p>
  </section>

  <section class="ds-bloco">
    <h2>O tecto legal, na página do concelho</h2>
    <div class="ds-mostra">${evoraPeca.outerHTML}</div>
    <p class="ds-nota"><code class="ds-mono">dist/municipios/evora/index.html</code> · a peça «${escapa(evoraNome)}». A referência é um limiar formal (o limite legal do índice de dívida), e por isso esta colore; a base 100 de um índice cuja unidade é uma média não coloriria.</p>
  </section>`;

  regista(
    '04-regua.html',
    'Disposições',
    1240,
    cartao({ grupo: 'Disposições', viewport: 1240, titulo: 'A régua', corpo, familias: ['inicio', 'municipio'] }),
    '3 réguas, a banda e o tecto de Évora'
  );
}

/* ------------------------------------------------------- 05. O mapa em pontos */
{
  const mapa = peca('index.html', 'figure#mapa');
  const localizador = peca('municipios/evora/index.html', 'figure#mapa');
  const seloMovel = peca('index.html', '.movel-selo');
  const linha = peca('index.html', '.mapa-linha');

  const casaMapa = arvore('index.html');
  const circulos = casaMapa.querySelectorAll('#mapa circle.mun');
  const pontos = circulos.length;
  if (!pontos) morre('não encontrei um único ponto (`circle.mun`) no mapa de `dist/index.html`.');

  /* OS PONTOS SÃO IGUAIS, e isso mede-se em vez de se afirmar: uma classe a
     mais ou um raio diferente num deles seria um município destacado por
     estatuto, que é o que a Emenda 3 proíbe. */
  const feitios = new Set(circulos.map((c) => `${c.getAttribute('class')}|${c.getAttribute('r')}|${c.getAttribute('fill') ?? ''}`));
  if (feitios.size !== 1) {
    morre(`os ${pontos} pontos do mapa de \`dist/index.html\` não são todos iguais: ${feitios.size} feitios diferentes. O cartão do mapa diz que são iguais, e ou são, ou o cartão mente.`);
  }
  const aneis = arvore('municipios/evora/index.html').querySelectorAll('#mapa .mun-escolhido').length;
  if (aneis !== 1) morre(`o localizador de \`dist/municipios/evora/index.html\` tem ${aneis} anéis, e devia ter um.`);

  /* A LEGENDA DE NEUTRALIDADE JÁ NÃO RENDE, e a corrida confere-o antes de o
     cartão o dizer. A frase é lida da própria Emenda 3, e não escrita aqui. */
  const emendaDoMapa = EMENDA('**Mapa (§4 emendado;');
  const legendaRevogada = emendaDoMapa.match(/legenda «([^»]+)»/)?.[1];
  if (!legendaRevogada) morre('não encontrei dentro da Emenda 3 a legenda de neutralidade que a Emenda 15 revoga; o cartão do mapa afirma que ela não rende, e essa afirmação tem de ser conferida.');
  for (const rota of ['index.html', 'municipios/index.html', 'en/index.html']) {
    if (leDist(rota).includes(legendaRevogada)) {
      morre(`a legenda de neutralidade da Emenda 3 voltou a render em \`dist/${rota}\`. A Emenda 15 revoga-a; ou sai da página, ou sai do cartão.`);
    }
  }

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Disposições</span>
    <h1>O mapa em pontos</h1>
    <p class="sec-sub">Substitui o cartão «Camadas»: as três densidades acabaram com a Emenda 2, e o que o mapa é hoje passou a ser uma regra por si.</p>
  </header>

  <section class="ds-bloco">
    <h2>A regra</h2>
    <p class="ds-nota">Emenda 10, de 20.08.2026: «${emLinha(EMENDA('**Um glifo, um significado'))}»</p>
    <p class="ds-nota">Emenda 17, de 21.08.2026: «${emLinha(EMENDA('**O mapa na primeira página'))}»</p>
  </section>

  <section class="ds-bloco">
    <h2>O mapa inteiro, na primeira página</h2>
    <div class="ds-mostra ds-mostra-larga">${mapa}</div>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code> · ${pontos} pontos, todos com a mesma classe e o mesmo raio (conferido nesta corrida), nenhum preenchido, nenhum anel. Não há preenchimento de cobertura e não há capital: nem a do país, nem as de distrito. A cobertura diz-se por palavras, ao lado do mapa e na lista.</p>
    <div class="ds-mostra">${linha}</div>
    <p class="ds-nota">A única linha por baixo do mapa, e é a da Emenda 17.</p>
  </section>

  <section class="ds-bloco">
    <h2>A neutralidade dos pontos, e a legenda que já não se escreve</h2>
    <p class="ds-nota">Emenda 3, de 20.08.2026: «${emLinha(EMENDA('**Mapa (§4 emendado;'))}»</p>
    <p class="ds-nota">A legenda que essa emenda mandava pôr ao lado do mapa («${escapa(legendaRevogada)}») <strong>já não rende na página</strong>: a Emenda 15, de 21.08.2026, revoga-a por escrito. Esta corrida procura-a em <code class="ds-mono">dist/index.html</code>, em <code class="ds-mono">dist/municipios/index.html</code> e em <code class="ds-mono">dist/en/index.html</code>, e pára se a encontrar. A regra continua a valer; o que saiu foi a página dizê-la de si própria.</p>
    <p class="ds-nota">Emenda 15: «${emLinha(EMENDA('**A página do leitor não se explica'))}»</p>
  </section>

  <section class="ds-bloco">
    <h2>Um lugar escolhido é um anel</h2>
    <div class="ds-mostra ds-mostra-larga">${localizador}</div>
    <p class="ds-nota"><code class="ds-mono">dist/municipios/evora/index.html</code> · o mesmo componente em postura de localizador, com ${aneis} anel em ${pontos}. Na primeira página nenhum ponto vem escolhido; aqui o anel é posto na construção, porque a página é de um concelho.</p>
  </section>

  <section class="ds-bloco">
    <h2>O selo do mapa no telemóvel</h2>
    <div class="ds-mostra">${seloMovel}</div>
    <p class="ds-nota">É o mesmo HTML da primeira página: <code class="ds-mono">.movel-selo</code> está sempre lá, e é a folha que o põe a ${escapa(SELO_MOVEL_LARGURA)} por ${escapa(SELO_MOVEL_ALTURA)}, dentro de <code class="ds-mono">${escapa(SELO_MOVEL_MEDIA)}</code>, por cima do rectângulo inteiro do mapa. Acima dessa largura ele não se vê, e o que tem dentro é texto para leitores de ecrã. As medidas e a consulta são lidas de <code class="ds-mono">src/styles/inicio.css</code>.</p>
  </section>`;

  regista(
    '05-mapa.html',
    'Disposições',
    1240,
    cartao({ grupo: 'Disposições', viewport: 1240, titulo: 'O mapa em pontos', corpo, familias: ['inicio', 'municipio'] }),
    `${pontos} pontos, dois mapas de dist/`
  );
}

/* --------------------------------------------------- 06. O par de estados */
{
  const cabeca = peca('index.html', '.cabeca-bloco[data-cabeca="pais"]');
  const foraPeca = peca('index.html', '.peca[data-estado="fora"]');
  const dentroPeca = peca('index.html', '.peca[data-estado="dentro"][data-limiar="sim"]');
  const semPeca = peca('index.html', '.peca[data-estado="sem"]');
  const social = peca('index.html', '.social-linha');
  const socialTitulo = peca('index.html', '.social-titulo');

  const casa = arvore('index.html');
  const conta = (estado) => casa.querySelectorAll(`.peca[data-estado="${estado}"][data-limiar="sim"]`).length;
  const foraN = conta('fora');
  const dentroN = conta('dentro');
  if (!foraN || !dentroN) morre('o painel da primeira página deixou de trazer peças com limiar nos dois estados.');

  const vocabulario = [
    ['estado', 'foraDoLimiar'],
    ['estado', 'dentroDoLimiar'],
    ['estado', 'semLimiar'],
    ['estado', 'porConfirmar'],
    ['cobertura', 'temPagina'],
    ['cobertura', 'semPaginaAinda'],
    ['cobertura', 'semLinhaAinda'],
  ]
    .map(([grupo, chave]) => {
      const pt = PT[grupo]?.[chave];
      const en = EN[grupo]?.[chave];
      if (!pt || !en) morre(`a chave \`${grupo}.${chave}\` deixou de existir em \`src/i18n/strings.mjs\`; o vocabulário fechado mudou.`);
      return `        <tr><td class="ds-mono">${escapa(grupo)}.${escapa(chave)}</td><td>${escapa(pt)}</td><td>${escapa(en)}</td></tr>`;
    })
    .join('\n');

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Componentes</span>
    <h1>O par de estados</h1>
    <p class="sec-sub">Quatro palavras, duas cores, e nenhuma quinta. O vocabulário é fechado e é o mesmo nas duas edições.</p>
  </header>

  <section class="ds-bloco">
    <h2>A manchete e a lede</h2>
    <div class="ds-mostra">${cabeca}</div>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code>, o bloco do âmbito País. As duas contagens são chaves da prova (<code class="ds-mono">painel_fora_do_limiar</code> e <code class="ds-mono">painel_dentro_do_limiar</code>), calculadas na construção e reconferidas pelo portão; a lede nomeia as medidas que estão fora. Hoje o painel rende ${foraN} fora e ${dentroN} dentro, contados nesta corrida sobre a página construída.</p>
    <p class="ds-nota">Emenda 16, de 21.08.2026: «${emLinha(EMENDA('**O painel da primeira página é o painel inteiro'))}»</p>
  </section>

  <section class="ds-bloco">
    <h2>Uma peça, em cada estado</h2>
    <div class="ds-mostra">${foraPeca}</div>
    <p class="ds-legenda">.peca[data-estado="fora"]</p>
    <div class="ds-mostra">${dentroPeca}</div>
    <p class="ds-legenda">.peca[data-estado="dentro"][data-limiar="sim"]</p>
    <div class="ds-mostra">${semPeca}</div>
    <p class="ds-legenda">.peca[data-estado="sem"]</p>
    <p class="ds-nota">As três de <code class="ds-mono">dist/index.html</code>, tal como rendem. A peça sem limiar não tem cor nenhuma, e a régua dela, quando existe, é a tinta contra uma referência publicada que não é um limiar.</p>
  </section>

  <section class="ds-bloco">
    <h2>O Painel Social Europeu, que não tem limiares</h2>
    <div class="ds-mostra">${socialTitulo}${social}</div>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code> · a lista compacta que a Emenda 16 manda pôr por baixo do painel: nome, valor, unidade, fonte, selo. <strong>Sem quadrado de estado e sem cor</strong>, porque não há limiar publicado contra o qual dizer um estado. É o mesmo silêncio que o quadrado «sem limiar» diz com palavras nas peças acima.</p>
  </section>

  <section class="ds-bloco">
    <h2>O vocabulário, nas duas edições</h2>
    <table class="ds-tabela">
      <thead><tr><th>Chave</th><th>PT</th><th>EN</th></tr></thead>
      <tbody>
${vocabulario}
      </tbody>
    </table>
    <p class="ds-nota">Lido de <code class="ds-mono">src/i18n/strings.mjs</code>, que é onde as duas edições vivem com paridade de chaves imposta pela construção. Nenhuma destas cadeias está escrita neste gerador.</p>
  </section>`;

  regista(
    '06-estados.html',
    'Componentes',
    720,
    cartao({ grupo: 'Componentes', viewport: 720, titulo: 'O par de estados', corpo, familias: ['inicio'] }),
    `${foraN} fora · ${dentroN} dentro, contados em dist/`
  );
}

/* ------------------------------------------------ 07. Os cartões de partilha */
{
  const dirCartoes = path.join(DIST, 'cartoes');
  if (!fs.existsSync(dirCartoes)) morre('não há `dist/cartoes/`. Correr `npm run build`.');

  const registoDe = (nome) => {
    const f = path.join(dirCartoes, `${nome}.json`);
    if (!fs.existsSync(f)) morre(`falta \`dist/cartoes/${nome}.json\`.`);
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  };
  const embutir = (nome) => {
    const f = path.join(dirCartoes, `${nome}.png`);
    if (!fs.existsSync(f)) morre(`falta \`dist/cartoes/${nome}.png\`.`);
    const bytes = fs.readFileSync(f);
    const resumo = 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
    const registo = registoDe(nome);
    if (registo.resumo !== resumo) {
      morre(`o resumo de \`dist/cartoes/${nome}.png\` não bate certo com o registo ao lado dele. O cartão de partilha e o seu registo divergiram.`);
    }
    return { bytes, registo, dataUri: `data:image/png;base64,${bytes.toString('base64')}` };
  };

  const escolhidos = [
    { nome: 'inicio.pt.1200x630', legenda: 'a primeira página, edição portuguesa' },
    { nome: 'en.en.1200x630', legenda: 'a primeira página, edição inglesa' },
    { nome: 'livro-razao-divida-publica-2025.pt.1200x630', legenda: 'uma linha do livro-razão, edição portuguesa' },
  ].map((x) => ({ ...x, ...embutir(x.nome) }));

  const folhas = escolhidos
    .map(
      (c) => `    <figure class="ds-folha">
      <img src="${c.dataUri}" width="${c.registo.dimensoes.largura}" height="${c.registo.dimensoes.altura}" alt="">
      <figcaption class="ds-legenda">${escapa(c.legenda)} · ${escapa(c.registo.rota)} · ${c.registo.dimensoes.largura}×${c.registo.dimensoes.altura} · ${(c.bytes.length / 1024).toFixed(1)} KiB</figcaption>
    </figure>`
    )
    .join('\n');

  const oDoMeio = escolhidos[2];
  const registoImpresso = `rota: ${oDoMeio.registo.rota}
edição: ${oDoMeio.registo.edicao}
tipo: ${oDoMeio.registo.tipo}
linha: ${oDoMeio.registo.linha}
ficheiro: ${oDoMeio.registo.ficheiro}
resumo: ${oDoMeio.registo.resumo}
bytes: ${oDoMeio.registo.bytes}
cópia:
${oDoMeio.registo.copia.map((l) => `  · ${l}`).join('\n')}
valores:
${oDoMeio.registo.valores.map((v) => `  · «${v.texto}» ← ${v.origem}${v.linha ? ' ' + v.linha : ''}${v.chave ? ' ' + v.chave : ''}${v.campo ? '.' + v.campo : ''}`).join('\n')}`;

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Componentes</span>
    <h1>Os cartões de partilha</h1>
    <p class="sec-sub">A única superfície da casa que viaja sem a página. Quem a vê não tem o livro-razão ao lado, e por isso o contrato é mais apertado aqui do que em qualquer outro lado.</p>
  </header>

  <section class="ds-bloco">
    <h2>Três, de <code class="ds-mono">dist/cartoes/</code></h2>
${folhas}
    <p class="ds-nota">Os PNG vão embutidos como <code class="ds-mono">data:</code>, byte a byte como estão em <code class="ds-mono">dist/</code>, e o resumo de cada um foi recalculado nesta corrida e comparado com o registo que está ao lado dele. Um cartão que divergisse do seu registo faria esta corrida parar.</p>
  </section>

  <section class="ds-bloco">
    <h2>O que o cartão não leva</h2>
    <p class="ds-nota">Emenda 11, de 20.08.2026: «${emLinha(EMENDA('**O sítio não se explica na mobília'))}» A linha de método saiu do cabeçalho e do pé do cartão com ela.</p>
    <p class="ds-nota">O que fica no pé é o quadrado do selo, sozinho, à esquerda, e o aparelho à direita; a fila de estados fica no corpo, com a palavra escrita ao lado do quadrado. Nenhum ponto de mapa (Emenda 10), nenhuma cor fora do par de estados, e nenhum valor que a própria página não leve.</p>
  </section>

  <section class="ds-bloco">
    <h2>O registo de um deles, por inteiro</h2>
    <pre class="ds-codigo">${escapa(registoImpresso)}</pre>
    <p class="ds-nota">De <code class="ds-mono">dist/cartoes/${escapa(oDoMeio.nome)}.json</code>. Cada valor desenhado no PNG diz de que linha e de que campo veio; o portão de HTML relê o registo e recalcula os valores.</p>
  </section>`;

  regista(
    '07-cartoes.html',
    'Componentes',
    1240,
    cartao({ grupo: 'Componentes', viewport: 1240, titulo: 'Os cartões de partilha', corpo, familias: [] }),
    `3 cartões de dist/cartoes/, ${(escolhidos.reduce((s, c) => s + c.bytes.length, 0) / 1024).toFixed(0)} KiB de PNG`
  );
}

/* ------------------------------------------------------------ 10 a 21. Páginas */
const PAGINAS = [
  { ficheiro: '10-pagina-primeira.html', rota: 'index.html', titulo: 'Página: primeira' },
  {
    ficheiro: '11-pagina-primeira-escuro.html',
    rota: 'index.html',
    titulo: 'Página: primeira, papel escuro',
    tema: 'dark',
    nota:
      'O sítio serve CLARO a toda a gente, independentemente da preferência do sistema (Emenda 12). ' +
      'Este cartão põe `data-theme="dark"` no <html> para que a paleta escura, que é a escolha do leitor no controlo do cabeçalho, se veja na ferramenta de desenho.',
  },
  { ficheiro: '12-pagina-linha-livro-razao.html', rota: 'livro-razao/divida-publica-2025/index.html', titulo: 'Página: linha do livro-razão' },
  { ficheiro: '13-pagina-livro-razao.html', rota: 'livro-razao/index.html', titulo: 'Página: índice do livro-razão' },
  { ficheiro: '14-pagina-municipio.html', rota: 'municipios/evora/index.html', titulo: 'Página: município' },
  { ficheiro: '15-pagina-municipios.html', rota: 'municipios/index.html', titulo: 'Página: municípios' },
  { ficheiro: '16-pagina-metodo.html', rota: 'metodo/index.html', titulo: 'Página: método' },
  { ficheiro: '17-pagina-agenda.html', rota: 'agenda/index.html', titulo: 'Página: agenda' },
  { ficheiro: '18-pagina-estudos.html', rota: 'estudos/index.html', titulo: 'Página: estudos' },
  { ficheiro: '19-pagina-sobre.html', rota: 'sobre/index.html', titulo: 'Página: sobre' },
  { ficheiro: '20-pagina-correcoes.html', rota: 'correcoes/index.html', titulo: 'Página: correções' },
  { ficheiro: '21-pagina-404.html', rota: '404.html', titulo: 'Página: 404' },
];

for (const p of PAGINAS) {
  const feito = cartaoDePagina({
    rota: p.rota,
    grupo: 'Páginas',
    viewport: 1240,
    titulo: p.titulo,
    tema: p.tema ?? null,
    nota: p.nota ?? '',
  });
  regista(
    p.ficheiro,
    'Páginas',
    1240,
    feito.html,
    `dist/${p.rota}${p.tema ? ' · data-theme=' + p.tema : ''}${feito.familias.length ? ' · +' + feito.familias.join('+') : ''}`
  );
}

/* ------------------------------------------------------------ 30. Regras */
{
  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Fundamentos</span>
    <h1>Regras</h1>
    <p class="sec-sub"><code class="ds-mono">IDENTIDADE.md</code> inteiro, tal como está no repositório. É a regra: onde o estudo de identidade e este ficheiro discordarem, ganha este ficheiro.</p>
  </header>

  <section class="ds-bloco">
    <div class="ds-doc">
${markdownSimples(identidade)}
    </div>
  </section>`;

  regista(
    '30-regras.html',
    'Fundamentos',
    720,
    cartao({ grupo: 'Fundamentos', viewport: 720, titulo: 'Regras', corpo, familias: [] }),
    'IDENTIDADE.md inteiro'
  );
}

/* ================================================================ escrever */

fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(SAIDA, { recursive: true });

for (const c of cartoes) fs.writeFileSync(path.join(SAIDA, c.ficheiro), c.html, 'utf8');

/**
 * Os tipos, copiados byte a byte e conferidos contra `TIPOS.md`.
 *
 * A conferência é o ponto: um ficheiro que não estivesse na tabela, ou cujo
 * resumo não batesse certo, entraria no feixe sem ninguém saber que bytes são.
 */
const escritos = new Set();
let bytesDosTipos = 0;
for (const f of TIPOS) {
  const bytes = fs.readFileSync(f.origem);
  const resumo = crypto.createHash('sha256').update(bytes).digest('hex');
  const chave = `public/tipos/${f.familia}/${f.nome}`;
  const declarado = RESUMOS.get(chave);
  if (!declarado) morre(`\`${chave}\` não tem resumo declarado em \`design/especime-v3/TIPOS.md\`. Um ficheiro de letra sem registo não entra no feixe.`);
  if (declarado !== resumo) {
    morre(`\`${chave}\` não bate certo com \`TIPOS.md\`: o ficheiro dá ${resumo.slice(0, 16)}… e a tabela declara ${declarado.slice(0, 16)}….`);
  }
  const destino = path.join(SAIDA, f.relativo);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, bytes);
  escritos.add(f.relativo);
  bytesDosTipos += bytes.length;
}

const README = `# design-system · o feixe de cartões para o Claude Design

**Esta pasta é gerada. Não editar à mão.** O que se editar aqui desaparece na
corrida seguinte, e a única coisa que se guarda em git é o gerador.

Gerada por \`scripts/design-bundle.mjs\` a partir de:

- \`dist/\`: as páginas construídas e os cartões de partilha, no commit \`${commitCurto}\`;
- \`src/styles/\`: as fichas (\`tokens.css\`) e as folhas do sítio;
- \`IDENTIDADE.md\` e \`design/especime-v3/direcao.md\`: a regra e as Emendas;
- \`design/especime-v3/TIPOS.md\`: os resumos dos ficheiros de letra;
- \`src/i18n/strings.mjs\`: o vocabulário fechado, nas duas edições;
- \`public/tipos/\`: os oito WOFF2 e as três licenças.

## Refazer

\`\`\`sh
npm run build                  # as páginas têm de estar construídas
node scripts/design-bundle.mjs
\`\`\`

A corrida apaga a pasta e escreve-a de novo, confere cada cartão e sai a 1 se
algum falhar. Está fora do \`npm run build\` e não é um portão de construção.

## O que é um cartão

Um ficheiro HTML que se basta a si próprio. A primeira linha é a marca por onde
o painel o arruma:

\`\`\`html
<!-- @dsCard group="Fundamentos" viewport="720" -->
\`\`\`

Nenhum cartão tem \`<script>\`, nem sequer as ilhas de dados das páginas: um
cartão é um retrato, não uma página viva. Nenhum faz um pedido para fora: as
únicas imagens são os cartões de partilha, embutidos como \`data:\`, e a única
coisa que a folha pode pedir são os tipos que estão nesta pasta. A folha de
estilo vai inteira dentro de um \`<style>\` no \`<head>\`, na ordem em que
\`Base.astro\` a importa (\`tokens.css\`, depois \`site.css\`), mais a folha de
família que a vista daquela página importa. As ligações internas foram passadas
a absolutas em \`${BASE}\`, para abrirem o sítio no ar; as ligações para as
fontes ficaram como estão, porque é isso que elas são.

Nos cartões de página saiu também a mobília de indexação do \`<head>\` (canónico,
hreflang, Open Graph, as pré-cargas dos tipos): não pinta um pixel, e cada uma
trazia um endereço.

## Os tipos

\`\`\`
tipos/spectral/       a prosa e a marca
tipos/spectral-sc/    os versaletes editoriais
tipos/bitter/         o aparelho
\`\`\`

Os ${TIPOS.filter((f) => f.nome.endsWith('.woff2')).length} WOFF2 são cópias byte a byte de \`public/tipos/\`, com o
\`OFL.txt\` de cada família ao lado (SIL Open Font License 1.1). Os resumos
SHA-256 foram conferidos contra \`design/especime-v3/TIPOS.md\` nesta corrida.
Cada cartão pede-os por caminho relativo (\`url('tipos/…')\`), e é por isso que
os cartões e a pasta \`tipos/\` viajam juntos: um cartão sozinho fica com as
pilhas de recuo declaradas em \`tokens.css\`.

## Os cartões

| Ficheiro | Grupo | Largura | Origem |
|---|---|---|---|
${cartoes.map((c) => `| \`${c.ficheiro}\` | ${c.grupo} | ${c.largura}px | ${c.nota} |`).join('\n')}

A largura é a que o painel deve dar ao cartão. Os cartões pequenos pedem 720px;
os de página pedem 1240px, que é o que o invólucro de \`${LARGURA_INVOLUCRO}\`
precisa para caber inteiro. A régua, o mapa e os cartões de partilha pedem 1240px
pela mesma razão: desenham geometria de página, e a 720px estariam a mostrar a
versão estreita.

Os números 08, 09 e 22 a 29 estão livres de propósito.

## O que não está aqui

Nada de novo. O feixe é a identidade de hoje, e mais nada: nenhuma cor, nenhuma
disposição e nenhuma regra foi inventada para o preencher. Onde um cartão
precisou de andaime, o andaime usa só fichas de \`tokens.css\`. Toda a frase
citada foi procurada em \`IDENTIDADE.md\` ou em \`direcao.md\` no momento da
corrida: se lá mudar, a corrida pára em vez de citar o que já não está escrito.
`;

fs.writeFileSync(path.join(SAIDA, 'README.md'), README, 'utf8');

/* ============================================================= conferência */

/**
 * A conferência, cartão a cartão.
 *
 * Seis coisas: a marca na primeira linha; nenhuma etiqueta que busque; toda a
 * imagem embutida em `data:`; nenhum endereço fora de um `href`; a folha
 * embutida sem `@import`, sem `url()` para fora e sem `url()` absoluto, com cada
 * `url(tipos/…)` a resolver num ficheiro que esta corrida escreveu; e tamanho
 * debaixo do tecto.
 */
const RE_MARCA = /^<!-- @dsCard group="[^"]+" viewport="\d+" -->$/;

/**
 * As etiquetas que buscam alguma coisa. Nenhuma tem lugar num cartão, e a
 * lista inclui as que o sítio não usa: o cartão de amanhã pode usar. `img` saiu
 * da lista quando os cartões de partilha entraram, e no lugar dela ficou uma
 * regra mais apertada: uma imagem só pode ser `data:`.
 */
const ETIQUETAS_QUE_BUSCAM = [
  'script',
  'link',
  'picture',
  'source',
  'iframe',
  'object',
  'embed',
  'video',
  'audio',
  'track',
  'base',
  'image',
  'use',
];

function confere(ficheiro, html) {
  const falhas = [];

  const primeira = html.split('\n', 1)[0];
  if (!RE_MARCA.test(primeira)) falhas.push('a primeira linha não é a marca @dsCard');

  const root = parse(html, { comment: true });

  for (const etiqueta of ETIQUETAS_QUE_BUSCAM) {
    const n = root.querySelectorAll(etiqueta).length;
    if (n) falhas.push(`tem ${n} <${etiqueta}>`);
  }

  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src') ?? '';
    if (!src.startsWith('data:image/')) falhas.push(`<img> com src que não é data: («${src.slice(0, 40)}»)`);
  }

  /**
   * Um endereço só pode estar num `href`.
   *
   * A distinção que importa não é onde as letras `https` aparecem: é se o
   * navegador vai buscar alguma coisa. Um `src`, um `url()` ou um `@import`
   * fazem o cartão depender de uma rede que o painel pode não ter. Um `href` é
   * uma ligação, e só é seguida se alguém clicar. E um endereço escrito no
   * texto da página, como o pedido que devolveu um valor ou a citação de uma
   * fonte, não é nem uma coisa nem outra: é a prova, transcrita, e sai
   * exactamente como saiu no sítio.
   */
  let externas = 0;
  const anda = (no) => {
    if (no.rawTagName) {
      for (const [nome, valor] of Object.entries(no.attributes ?? {})) {
        const v = String(valor ?? '');
        if (nome.toLowerCase() === 'href') {
          if (/^https?:\/\//i.test(v) && !v.startsWith(BASE)) externas += 1;
          continue;
        }
        if (no.rawTagName.toLowerCase() === 'img' && nome.toLowerCase() === 'src' && v.startsWith('data:image/')) continue;
        if (/https?:\/\/|(^|[\s(])\/\//i.test(v)) {
          falhas.push(`endereço no atributo ${nome} de <${no.rawTagName}>`);
        }
      }
    }
    for (const f of no.childNodes ?? []) anda(f);
  };
  anda(root);

  const noTexto = [...String(root.structuredText ?? root.text ?? '').matchAll(/https?:\/\//gi)].length;

  let tipos = 0;
  for (const estilo of root.querySelectorAll('style')) {
    const folha = estilo.innerHTML ?? '';
    if (/@import/i.test(folha)) falhas.push('a folha embutida tem @import');
    for (const [, alvo] of folha.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
      if (alvo.startsWith('data:')) continue;
      if (/^(https?:)?\/\//i.test(alvo)) {
        falhas.push(`a folha embutida pede «${alvo.slice(0, 48)}» para fora`);
        continue;
      }
      if (alvo.startsWith('/')) {
        falhas.push(`a folha embutida tem um caminho absoluto: «${alvo}»`);
        continue;
      }
      const emDisco = path.join(SAIDA, decodeURIComponent(alvo));
      if (!fs.existsSync(emDisco)) {
        falhas.push(`a folha embutida pede «${alvo}», que esta corrida não escreveu`);
        continue;
      }
      tipos += 1;
    }
  }

  const bytes = Buffer.byteLength(html, 'utf8');
  if (bytes >= LIMITE_BYTES) falhas.push(`${(bytes / 1024).toFixed(1)} KiB acima do tecto de ${LIMITE_BYTES / 1024} KiB`);

  return { ficheiro, bytes, falhas, externas, noTexto, tipos };
}

const resultados = cartoes.map((c) => ({ ...confere(c.ficheiro, c.html), grupo: c.grupo }));

const larguraFicheiro = Math.max(8, ...resultados.map((r) => r.ficheiro.length));
const larguraGrupo = Math.max(5, ...resultados.map((r) => r.grupo.length));

console.log();
console.log(negrito('  O feixe de cartões do sistema de desenho'));
console.log(
  cinza(
    `  design-system/ · de dist/ no commit ${commitCurto} · ${cartoes.length} cartões, ${TIPOS.length} ficheiros de letra e um README`
  )
);
console.log();
console.log(
  cinza(`  ${'ficheiro'.padEnd(larguraFicheiro)}  ${'grupo'.padEnd(larguraGrupo)}  ${'bytes'.padStart(7)}  ok`)
);
for (const r of resultados) {
  const ok = r.falhas.length === 0;
  console.log(
    `  ${r.ficheiro.padEnd(larguraFicheiro)}  ${r.grupo.padEnd(larguraGrupo)}  ${String(r.bytes).padStart(7)}  ${
      ok ? verde('✓') : vermelho('✗')
    }${ok ? '' : '  ' + r.falhas.join(' · ')}`
  );
}

const totalBytes = resultados.reduce((s, r) => s + r.bytes, 0);
const falhados = resultados.filter((r) => r.falhas.length);

console.log();
console.log(
  cinza(
    `  ${(totalBytes / 1024).toFixed(1)} KiB de cartões · maior cartão ${(Math.max(...resultados.map((r) => r.bytes)) / 1024).toFixed(1)} KiB · tecto ${LIMITE_BYTES / 1024} KiB`
  )
);
console.log(
  cinza(
    `  ${TIPOS.length} ficheiros de letra ao lado, ${(bytesDosTipos / 1024).toFixed(1)} KiB, resumos conferidos contra TIPOS.md · fora do tecto`
  )
);
const externas = resultados.reduce((s, r) => s + r.externas, 0);
const noTexto = resultados.reduce((s, r) => s + r.noTexto, 0);
const pedidosDeTipo = resultados.reduce((s, r) => s + r.tipos, 0);
console.log(
  cinza(
    `  ligações internas absolutas em ${BASE} · ${externas} ligações para fontes, intactas · ${noTexto} endereços escritos no texto das páginas (transcrições, não pedidos)`
  )
);
/* A frase só se diz quando é verdade de todos: um resumo que se imprime na
   mesma quando alguma coisa falhou é a razão por que ninguém repara. */
if (!falhados.length) {
  console.log(
    cinza(
      `  nenhum <script>, nenhum <link>, nenhuma imagem que não seja data:, nenhum endereço fora de um href · ${pedidosDeTipo} pedidos de tipo, todos resolvidos em ficheiros desta corrida`
    )
  );
}

if (falhados.length) {
  console.log();
  console.log(`  ${vermelho('✗')} ${falhados.length} cartão(ões) reprovado(s).`);
  console.log();
  process.exit(1);
}

console.log();
console.log(`  ${verde('✓')} ${cartoes.length} cartões, ${TIPOS.length} ficheiros de letra e um README em design-system/.`);
console.log();
