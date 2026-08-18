#!/usr/bin/env node
/**
 * O feixe de cartões do sistema de desenho, para o Claude Design.
 *
 * PORQUÊ. A fase 2 do roteiro (`PLANO-fases.md`) começa por uma prova pequena:
 * levar as fichas e a folha de estilo que existem hoje para o Claude Design e
 * ver o que o painel faz com elas. O painel lê cartões, ficheiros HTML que se
 * bastam a si próprios, e arruma-os pela linha de marca da primeira linha.
 * Este ficheiro fabrica esses cartões a partir do que já está construído, e de
 * mais nada.
 *
 * O QUE FAZ. Lê `dist/` (as páginas construídas), `src/styles/tokens.css` e
 * `src/styles/site.css` (as fichas e a folha) e `IDENTIDADE.md` (a regra), e
 * escreve `design-system/`: treze cartões e um README. Cada cartão abre com
 * `<!-- @dsCard group="…" viewport="…" -->` na primeira linha.
 *
 * O QUE NÃO FAZ. Não desenha nada de novo. Um cartão que invente uma cor, uma
 * disposição ou uma regra deixa de ser uma importação e passa a ser uma
 * proposta, e a fase 2 discutiria a proposta em vez do que existe. Onde um
 * cartão precisa de andaime (a grelha das amostras de cor, o esboço das
 * disposições) o andaime usa só fichas do sítio: nenhum literal de cor entra
 * aqui, pela mesma razão por que não entra em `site.css` (IDENTIDADE §2). Os
 * números das disposições não são escritos: são lidos de `site.css`, e se lá
 * mudarem de forma esta corrida pára em vez de os inventar.
 *
 * SELF-CONTAINED, E É CONFERIDO. Nenhum `<script>`, nem sequer as ilhas de
 * dados: um cartão é um retrato, não uma página viva. Nenhum pedido para fora,
 * o que aqui é fácil de garantir porque o sítio não carrega ficheiro de tipo de
 * letra nenhum (as três famílias são pilhas do sistema) e as páginas
 * escolhidas não têm uma única imagem. A folha vai inteira dentro de um
 * `<style>` no `<head>`, na ordem em que `Base.astro` a importa. As ligações
 * internas passam a absolutas no domínio legível, para que abram o sítio no ar
 * em vez de morrerem dentro do painel. A conferência corre no fim, imprime a
 * tabela e sai a 1 se algum cartão falhar.
 *
 * A PASTA É GERADA. `design-system/` está no `.gitignore`. O que se guarda é
 * este ficheiro; a pasta refaz-se com uma corrida.
 *
 * Uso:  npm run build                    (as páginas têm de estar construídas)
 *       node scripts/design-bundle.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { SITE_HOST_DISPLAY, SITE_NAME } from '../site.config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const SAIDA = path.join(RAIZ, 'design-system');

/** O tecto de tamanho de um cartão. Acima disto o painel deixa de ser útil. */
const LIMITE_BYTES = 250 * 1024;

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

const cssFichas = fs.readFileSync(path.join(RAIZ, 'src/styles/tokens.css'), 'utf8');
const cssFolha = fs.readFileSync(path.join(RAIZ, 'src/styles/site.css'), 'utf8');
const identidade = fs.readFileSync(path.join(RAIZ, 'IDENTIDADE.md'), 'utf8');

/* A ordem importa, e é a de `Base.astro`: primeiro as fichas, depois a folha
   que as usa. */
const CSS_DO_SITIO = `${cssFichas}\n${cssFolha}`;
if (/<\/style/i.test(CSS_DO_SITIO)) {
  morre('a folha de estilo contém `</style`, e por isso não pode ser embutida tal e qual.');
}

/**
 * Para LER a folha, os comentários saem primeiro.
 *
 * O comentário do oxblood diz «Contraste sobre --paper: 9,45:1», e um leitor
 * ingénuo de fichas leria ali uma ficha `--paper` que valeria «9,45:1» e
 * apagaria a verdadeira. O que vai embutido nos cartões é a folha inteira, com
 * comentários e tudo: quem desenha tem direito a ler as razões.
 */
const semComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const fichasLimpas = semComentarios(cssFichas);
const folhaLimpa = semComentarios(cssFolha);

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

/* ===================================================== os números que se leem */

/**
 * As larguras das disposições não se escrevem aqui: leem-se de `site.css`.
 *
 * Uma medida copiada para um cartão fica errada na primeira vez que a folha
 * mudar, e ninguém dá por isso (é o mesmo motivo de IDENTIDADE §10 para as
 * contagens do próprio sítio). Se a declaração mudar de forma, esta corrida
 * pára com o nome do que não encontrou.
 */
function declaracao(re, oQue) {
  const m = folhaLimpa.match(re);
  if (!m) morre(`não encontrei em \`src/styles/site.css\`: ${oQue}. A folha mudou de forma; o cartão das disposições tem de ser revisto.`);
  return m[1].trim();
}

const LARGURA_INVOLUCRO = declaracao(
  /\.wrap\s*\{[^}]*?max-width:\s*([^;]+);/,
  'a largura do invólucro (`.wrap { max-width }`)'
);
const COLUNAS_A = declaracao(
  /\.metodo-secao\s*\{[^}]*?grid-template-columns:\s*([^;]+);/,
  'as colunas da disposição A (`.metodo-secao`)'
);
const COLUNAS_B = declaracao(
  /\.linha,\s*\.municipio\s*\{[^}]*?grid-template-columns:\s*([^;]+);/,
  'as colunas da disposição B (`.linha, .municipio`)'
);

/**
 * A paleta lê-se de `tokens.css`, nos dois temas.
 *
 * `:root` nu é a paleta clara completa; `:root[data-theme='dark']` é a escolha
 * explícita, que repete o escuro do sistema. Basta ler as duas.
 */
function paleta() {
  const bloco = (re, oQue) => {
    const m = fichasLimpas.match(re);
    if (!m) morre(`não encontrei o bloco ${oQue} em \`src/styles/tokens.css\`.`);
    return m[1];
  };
  const pares = (texto) => {
    const mapa = new Map();
    for (const [, nome, valor] of texto.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      mapa.set(nome, valor.trim());
    }
    return mapa;
  };
  const claro = pares(bloco(/:root\s*\{([\s\S]*?)\n\}/, '`:root`'));
  const escuro = pares(bloco(/:root\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/, "`:root[data-theme='dark']`"));
  const cores = [];
  const outras = [];
  for (const [nome, valor] of claro) {
    (valor.startsWith('#') ? cores : outras).push({ nome, claro: valor, escuro: escuro.get(nome) ?? valor });
  }
  if (cores.length === 0) morre('não li uma única cor de `tokens.css`.');
  return { cores, outras };
}

const PALETA = paleta();
const ficha = (nome) => PALETA.outras.find((o) => o.nome === nome)?.claro ?? '';

/* ============================================== peças tiradas das páginas */

/**
 * Uma peça de um cartão é markup real, tirado de uma página construída.
 *
 * Redesenhar o selo à mão para o mostrar seria mostrar outra coisa: o cartão
 * passaria a ser a minha ideia do selo e não o selo. Tudo o que estes cartões
 * exibem sai de `dist/`.
 */
function peca(rota, seletor, { indice = 0, filtro = null } = {}) {
  const root = arvore(rota);
  const todos = root.querySelectorAll(seletor);
  const escolhidos = filtro ? todos.filter(filtro) : todos;
  const el = escolhidos[indice];
  if (!el) morre(`não encontrei "${seletor}" (índice ${indice}) em \`dist/${rota}\`.`);
  absolutizaLigacoes(el, `dist/${rota} → ${seletor}`);
  return el.outerHTML;
}

/* ====================================================== o andaime dos cartões */

/**
 * O andaime: só mobília, e só com fichas do sítio.
 *
 * Nenhum literal de cor, nenhuma família de letra nova, nenhum acento novo
 * (IDENTIDADE §2). Onde uma classe do sítio serve, é a do sítio que se usa:
 * `.eyebrow`, `.lede`, `.sec-sub`, `.linha-nota`. O que fica aqui é o que não
 * existe lá, porque o sítio não tem cartões.
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
.ds-mono { font-family: var(--f-mono); font-size: 11.5px; color: var(--muted); letter-spacing: 0.04em; }
.ds-rodape { border-top: 1px solid var(--rule); padding-top: 12px; font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.06em; color: var(--muted); }
.ds-mostra { background: var(--paper-2); border: 1px solid var(--rule); padding: 20px; display: grid; gap: 12px; }

/* paleta */
.ds-paleta { display: grid; grid-template-columns: repeat(auto-fill, minmax(196px, 1fr)); gap: 18px; }
.ds-cor { display: grid; gap: 7px; }
.ds-amostra { height: 66px; border: 1px solid var(--rule-strong); }
.ds-cor-nome { font-family: var(--f-mono); font-size: 11.5px; font-weight: 600; color: var(--ink); letter-spacing: 0.04em; }
.ds-cor-valor { font-family: var(--f-mono); font-size: 10.5px; color: var(--muted); letter-spacing: 0.04em; }

/* letra */
.ds-tabela { width: 100%; border-collapse: collapse; font-size: 14.5px; }
.ds-tabela th, .ds-tabela td { text-align: left; vertical-align: top; padding: 9px 14px 9px 0; border-bottom: 1px solid var(--rule); }
.ds-tabela th { font-family: var(--f-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.ds-pilha { font-family: var(--f-mono); font-size: 11px; color: var(--muted); line-height: 1.7; word-break: break-word; }

/* esboços das disposições */
.ds-esboco { border: 1px solid var(--rule-strong); background: var(--paper-2); padding: 12px; display: grid; gap: 12px; }
.ds-caixa { background: var(--paper-3); border: 1px dashed var(--rule-strong); padding: 12px; display: grid; gap: 6px; align-content: start; min-height: 128px; }
.ds-caixa-k { font-family: var(--f-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink); }
.ds-caixa-v { font-size: 13px; line-height: 1.5; color: var(--muted); }

/* o documento das regras */
.ds-doc { max-width: 74ch; display: grid; gap: 16px; }
.ds-doc h1 { font-size: 25px; }
.ds-doc h2 { font-size: 18px; padding-top: 14px; border-top: 1px solid var(--rule); }
.ds-doc p, .ds-doc li { font-size: 15px; line-height: 1.62; }
.ds-doc ul, .ds-doc ol { margin: 0; padding-left: 22px; display: grid; gap: 8px; }
.ds-doc blockquote { margin: 0; padding: 12px 0 12px 16px; border-left: 2px solid var(--rule-strong); color: var(--ink); }
.ds-doc code { font-family: var(--f-mono); font-size: 12.5px; background: var(--paper-2); padding: 1px 4px; }
.ds-doc hr { border: 0; border-top: 1px solid var(--rule); margin: 6px 0; }
.ds-doc table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ds-doc th, .ds-doc td { text-align: left; vertical-align: top; padding: 8px 12px 8px 0; border-bottom: 1px solid var(--rule); }
.ds-doc th { font-family: var(--f-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.ds-doc em { color: var(--muted); }
`;

function cartao({ grupo, viewport, titulo, corpo }) {
  return `${marca(grupo, viewport)}
<!-- Gerado por scripts/design-bundle.mjs a partir de dist/ e de src/styles/, no commit ${commitCurto}. Não editar à mão. -->
<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapa(titulo)}</title>
<style>
${CSS_DO_SITIO}
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

/**
 * Um cartão de página é a página construída, com três coisas feitas:
 * o código fora, a folha embutida no lugar da ligação, e as ligações internas
 * absolutas. A mobília de indexação do `<head>` (canónico, hreflang, Open
 * Graph) sai também: não pinta um pixel e cada uma trazia um endereço que a
 * conferência de auto-suficiência teria de dispensar caso a caso.
 */
function cartaoDePagina({ rota, grupo, viewport, titulo }) {
  const root = arvore(rota);
  /* O título da página vai para dentro de um comentário: um `--` ali fecharia
     o comentário antes de tempo e o resto do cartão viraria texto. */
  const tituloDaPagina = (root.querySelector('title')?.text?.trim() ?? '')
    .replace(/-{2,}/g, '-')
    .replace(/[<>]/g, '');
  const codigo = tiraCodigo(root);
  const cabeca = root.querySelector('head');
  if (!cabeca) morre(`\`dist/${rota}\` não tem <head>.`);
  cabeca.set_content(
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${escapa(titulo)}</title>` +
      `\n<style>\n${CSS_DO_SITIO}\n</style>\n`
  );
  const ligacoes = absolutizaLigacoes(root, `dist/${rota}`);
  return {
    html: `${marca(grupo, viewport)}
<!-- Gerado por scripts/design-bundle.mjs a partir de dist/${rota}, no commit ${commitCurto}. Não editar à mão.
     Título da página no ar: ${tituloDaPagina}
     Retirados: ${codigo} bloco(s) de código e a mobília de indexação do <head>. Folha embutida; ${ligacoes.internas} ligações internas passadas ao domínio ${SITE_HOST_DISPLAY}. -->
${root.toString()}
`,
    codigo,
    ligacoes,
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
function markdownSimples(fonte) {
  const linhas = fonte.replace(/\r\n/g, '\n').split('\n');
  const fora = [];
  let i = 0;

  const emLinha = (texto) => {
    const codigos = [];
    let s = escapa(texto).replace(/`([^`]+)`/g, (_, c) => {
      codigos.push(c);
      return `\u0000${codigos.length - 1}\u0000`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => `<code>${codigos[Number(n)]}</code>`);
    return s;
  };

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

/* ---------------------------------------------------------------- 1. Cor */
{
  const amostras = PALETA.cores
    .map(
      (c) => `      <div class="ds-cor">
        <div class="ds-amostra" style="background: var(--${c.nome})"></div>
        <span class="ds-cor-nome">--${c.nome}</span>
        <span class="ds-cor-valor">claro ${escapa(c.claro)}<br>escuro ${escapa(c.escuro)}</span>
      </div>`
    )
    .join('\n');

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Fundamentos</span>
    <h1>Cor</h1>
    <p class="sec-sub">A paleta inteira de <code class="ds-mono">src/styles/tokens.css</code>, nos dois temas, e o que cada acento tem direito a significar.</p>
  </header>

  <section class="ds-bloco">
    <h2>A paleta</h2>
    <p class="ds-nota">Cada amostra é pintada com a própria ficha, não com o valor copiado: o cartão é a paleta, não um retrato dela. O valor escrito por baixo é o que <code class="ds-mono">tokens.css</code> diz em cada tema.</p>
    <div class="ds-paleta">
${amostras}
    </div>
  </section>

  <section class="ds-bloco">
    <h2>O que cada acento significa</h2>
    <p class="ds-regra"><strong>Amarelo <code class="ds-mono">--yellow</code>:</strong> marca de medição. A barra da distância, o município aceso, as barras de composição, a região que está a ser lida. <strong>Nunca como cor de texto. Nunca decoração.</strong></p>
    <p class="ds-regra"><strong>Oxblood <code class="ds-mono">--oxblood</code>:</strong> erro admitido. O registo de correções, e mais nada. Nunca ênfase, nunca alerta, nunca «só desta vez».</p>
    <p class="ds-regra"><strong>Tudo o resto:</strong> <code class="ds-mono">--paper</code>, <code class="ds-mono">--paper-2</code>, <code class="ds-mono">--paper-3</code>, <code class="ds-mono">--ink</code>, <code class="ds-mono">--muted</code>, <code class="ds-mono">--rule</code>, <code class="ds-mono">--rule-strong</code>.</p>
    <p class="ds-nota">IDENTIDADE §2, palavra por palavra.</p>
  </section>

  <section class="ds-bloco">
    <h2>A regra para um caso novo</h2>
    <p class="ds-regra"><strong>Não há acento novo.</strong> Um tipo de página novo não ganha uma cor. Se for preciso distinguir alguma coisa, distingue-se com peso de fio, com fundo (<code class="ds-mono">--paper-2</code> / <code class="ds-mono">--paper-3</code>) ou com a letra monoespaçada. Nunca com matiz. Um segundo acento destrói o significado do primeiro.</p>
  </section>

  <section class="ds-bloco">
    <h2>O que as fichas dizem de si próprias</h2>
    <p class="ds-nota">De <code class="ds-mono">tokens.css</code>: «REGRA DO AMARELO: --yellow é reservado a marcas de medição. Nunca é usado como cor de texto sobre fundo claro.» E, sobre o oxblood: «Reservado ao registo de correções, e a mais nada. O amarelo marca medição; este marca uma confissão. Contraste sobre --paper: 9,45:1.» No tema escuro, «contraste sobre --paper escuro: 7,22:1».</p>
    <p class="ds-nota">Fichas que não são cor: <code class="ds-mono">--measure: ${escapa(ficha('measure'))}</code> · <code class="ds-mono">--gutter: ${escapa(ficha('gutter'))}</code> · <code class="ds-mono">--shadow</code>. As três famílias de letra estão no cartão «Tipo».</p>
  </section>`;

  regista(
    '01-cor.html',
    'Fundamentos',
    720,
    cartao({ grupo: 'Fundamentos', viewport: 720, titulo: 'Cor', corpo }),
    `${PALETA.cores.length} fichas de cor`
  );
}

/* --------------------------------------------------------------- 2. Tipo */
{
  const wordmark = peca('index.html', '.wordmark');
  const prosa = peca('sobre/index.html', 'p.sobre-texto');
  const valorComSelo = peca('index.html', 'p.brief-text[data-brief="pt"]');

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
        <tr><td>Serifada</td><td>A marca</td><td><strong>Só</strong> no <code class="ds-mono">.wordmark</code>. Em mais lado nenhum.</td></tr>
        <tr><td>Monoespaçada</td><td>Valores medidos, rótulos, mobília</td><td>Todo o <code class="ds-mono">&lt;Claim&gt;</code>, eyebrows, metadados, eixos</td></tr>
        <tr><td>Sem serifa</td><td>Prosa</td><td>Lede, corpo, descrições, legendas</td></tr>
      </tbody>
    </table>
    <p class="ds-nota">IDENTIDADE §1. As pilhas, de <code class="ds-mono">tokens.css</code>, são do sistema: o sítio não carrega um único ficheiro de tipo de letra, e por isso um cartão destes não faz pedido nenhum para fora.</p>
    <p class="ds-pilha">--f-serif: ${escapa(ficha('f-serif'))}<br>--f-mono: ${escapa(ficha('f-mono'))}<br>--f-sans: ${escapa(ficha('f-sans'))}</p>
  </section>

  <section class="ds-bloco">
    <h2>A marca, na serifada</h2>
    <div class="ds-mostra">${wordmark}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/index.html</code>. A serifada não aparece em mais lado nenhum do sítio.</p>
  </section>

  <section class="ds-bloco">
    <h2>Um valor medido, na monoespaçada</h2>
    <div class="ds-mostra">${valorComSelo}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/index.html</code>, camada «Leitura breve» do instrumento n.º 1. O número vai a mono porque tem linha no livro-razão; o selo ao lado é a porta para ela.</p>
  </section>

  <section class="ds-bloco">
    <h2>Prosa, na sem serifa</h2>
    <div class="ds-mostra">${prosa}</div>
    <p class="ds-nota">Tirado de <code class="ds-mono">dist/sobre/index.html</code>: é o texto decidido do Sobre, e a prosa mais longa que o sítio tem sobre si próprio.</p>
  </section>

  <section class="ds-bloco">
    <h2>Um número no meio de uma frase</h2>
    <p class="ds-regra">A regra não é «algarismos vão a mono». Um valor do livro-razão vai sempre a mono, através de <code class="ds-mono">&lt;Claim&gt;</code>. Uma data de referência, um número de secção ou um nome próprio com algarismos fica na letra da frase que o rodeia.</p>
    <div class="ds-mostra">
      <p class="lede">Portugal está <span class="mono" style="font-weight:600">18</span> pontos abaixo da média da UE-27. O valor de 2024 é provisório.</p>
    </div>
    <p class="ds-nota">A frase é o exemplo de IDENTIDADE §1, e está certa com duas letras: o 18 é uma medição, o 2024 é uma data. Aqui o 18 leva só a letra, porque o cartão é um espécime de tipo; numa página, um valor do livro-razão chega sempre por <code class="ds-mono">&lt;Claim&gt;</code> e com selo, como se vê acima.</p>
    <p class="ds-nota">«A letra distingue-os, e essa distinção é o produto.»</p>
  </section>`;

  regista(
    '02-tipo.html',
    'Fundamentos',
    720,
    cartao({ grupo: 'Fundamentos', viewport: 720, titulo: 'Tipo', corpo }),
    '3 famílias, 4 espécimes'
  );
}

/* ------------------------------------------------- 3. Selo e marcador */
{
  const naSentenca = peca('index.html', 'p.brief-text[data-brief="pt"]');
  /* O estado a tracejado já não existe na primeira página desde o bloco T
     (18.08.2026): as quatro contagens da CAOP fecharam a sua dívida e o painel
     não publica nenhuma das linhas que ainda a têm. O espécime lê-se da
     primeira página onde ele existir, pela ordem: a primeira página, o índice
     do livro-razão, a página de leitura do estudo do PRR, cuja medida de
     cabeça é uma soma com dívida. A nota do cartão diz de onde veio. */
  const ondeIncompleto = ['index.html', 'livro-razao/index.html',
    'estudos/evora-prometido-pago-auditado-2026/index.html'].find((rota) =>
    arvore(rota).querySelectorAll('.claim-com-chip')
      .some((el) => el.querySelector('.src-chip.is-unverified') !== null));
  if (!ondeIncompleto) morre('não encontrei nenhum selo a tracejado nas páginas candidatas.');
  const seloIncompleto = peca(ondeIncompleto, '.claim-com-chip', {
    filtro: (el) => el.querySelector('.src-chip.is-unverified') !== null,
  });
  const doisEstados = peca('livro-razao/index.html', 'ul.aparelho-selos');
  const marcadorSo = peca('a-verificar/index.html', 'span.marcador');
  const marcadorEmFrase = peca('agenda/index.html', 'span.agenda-sem-data');
  const portas = peca('index.html', '.masthead-furniture');

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Componentes</span>
    <h1>Selo e marcador</h1>
    <p class="sec-sub">Todo o markup deste cartão foi tirado das páginas construídas. Nada aqui foi redesenhado para a ocasião.</p>
  </header>

  <section class="ds-bloco">
    <h2>O selo é sempre uma ligação</h2>
    <div class="ds-mostra">${naSentenca}</div>
    <p class="ds-regra">O Método promete, nas duas línguas: «O selo de proveniência junto a cada número é a porta para essa linha.» Um selo que não liga a lado nenhum não é um selo, é uma legenda, e a promessa fica falsa.</p>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code> · o valor e o seu selo dentro de uma frase corrida. O rótulo do selo é o nome do estudo; «calculado» antecede-o quando o valor é derivado.</p>
  </section>

  <section class="ds-bloco">
    <h2>Dois estados, e os dois têm de existir na página</h2>
    <div class="ds-mostra">
      ${doisEstados}
    </div>
    <p class="ds-nota"><code class="ds-mono">dist/livro-razao/index.html</code> · a amostra dos dois estados, na coluna do aparelho do índice. Ali o selo é só o quadrado.</p>
    <div class="ds-mostra">${seloIncompleto}</div>
    <p class="ds-nota"><code class="ds-mono">dist/${ondeIncompleto}</code> · o estado a tracejado em uso, com o marcador dentro do selo a dizer o que falta. Quadrado cheio quando a proveniência está completa; a tracejado quando falta um campo. «Um estado que nunca foi desenhado ao lado do outro ainda não é uma distinção.»</p>
  </section>

  <section class="ds-bloco">
    <h2>Um marcador, e um só</h2>
    <div class="ds-mostra">
      <p style="margin:0">${marcadorSo}</p>
      <p style="margin:0">${marcadorEmFrase}</p>
    </div>
    <p class="ds-regra">Um marcador: <code class="ds-mono">[a verificar]</code>. Uma classe: <code class="ds-mono">.marcador</code>. Uma página que o explica: <code class="ds-mono">/a-verificar</code> e <code class="ds-mono">/en/to-verify</code>. «Um marcador público que não é explicado em lado nenhum é pior do que não marcar.»</p>
    <p class="ds-nota">Em cima, o espécime da própria página que o explica (<code class="ds-mono">dist/a-verificar/index.html</code>); em baixo, o mesmo marcador dentro de uma frase da agenda (<code class="ds-mono">dist/agenda/index.html</code>), onde diz que a fonte não publica data.</p>
  </section>

  <section class="ds-bloco">
    <h2>Um número do próprio sítio leva porta, não selo</h2>
    <div class="ds-mostra">${portas}</div>
    <p class="ds-regra">Uma contagem do próprio sítio entra por <code class="ds-mono">data-prova</code>, é calculada na construção e nunca escrita à mão. Vai a monoespaçada como qualquer número que não é prosa, mas <strong>sem selo</strong>: pôr um selo ao lado de uma contagem do sítio seria prometer uma linha que não existe. O que leva em vez do selo é a porta, e a porta é a rota onde o leitor vê o que o número conta.</p>
    <p class="ds-nota"><code class="ds-mono">dist/index.html</code> · a mobília do cabeçalho: o sinal de tempo e as duas contagens da agenda, cada uma ligada à página que as conta. IDENTIDADE §10.</p>
  </section>`;

  regista(
    '03-selo-e-marcador.html',
    'Componentes',
    720,
    cartao({ grupo: 'Componentes', viewport: 720, titulo: 'Selo e marcador', corpo }),
    '6 peças, todas de dist/'
  );
}

/* ------------------------------------------------ 4. Disposições A · B · C */
{
  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Disposições</span>
    <h1>Disposições A · B · C</h1>
    <p class="sec-sub">As três disposições, e nenhuma quarta. Um tipo de página novo escolhe uma destas três.</p>
  </header>

  <section class="ds-bloco">
    <p class="ds-regra">O invólucro tem <code class="ds-mono">${escapa(LARGURA_INVOLUCRO)}</code>. A diferença entre o invólucro e a prosa <strong>não é espaço vazio</strong>: é a coluna do aparelho. «Uma página cuja segunda coluna está vazia ou a enche, ou estreita o invólucro.»</p>
    <p class="ds-nota">As larguras dos esboços em baixo são lidas de <code class="ds-mono">src/styles/site.css</code> na altura em que este cartão é gerado, e desenhadas ao tamanho real dentro do invólucro. Não são medidas copiadas.</p>
  </section>

  <section class="ds-bloco">
    <h2>A · Rótulo e corpo</h2>
    <div class="ds-esboco" style="max-width:${escapa(LARGURA_INVOLUCRO)}">
      <div style="display:grid; gap:12px; grid-template-columns:${escapa(COLUNAS_A)}">
        <div class="ds-caixa"><span class="ds-caixa-k">Rótulo</span><span class="ds-caixa-v">O nome da secção</span></div>
        <div class="ds-caixa"><span class="ds-caixa-k">Corpo</span><span class="ds-caixa-v">A prosa, a 68ch</span></div>
      </div>
    </div>
    <p class="ds-mono">.metodo-secao · grid-template-columns: ${escapa(COLUNAS_A)}</p>
    <p class="ds-regra">Coluna de rótulo de 220px, corpo a 68ch. Para texto com secções nomeadas.</p>
    <p class="ds-nota">Em uso: <code class="ds-mono">/metodo</code>, <code class="ds-mono">/a-verificar</code>, <code class="ds-mono">/sobre</code>, <code class="ds-mono">/correcoes</code> e <code class="ds-mono">/agenda</code>. O Sobre é o caso mais magro (o rótulo é o nome da página, o corpo são duas frases e uma porta); a agenda é o caso mais cheio (o rótulo é o estado, o corpo são os itens que estão nele).</p>
  </section>

  <section class="ds-bloco">
    <h2>B · Corpo e aparelho</h2>
    <div class="ds-esboco" style="max-width:${escapa(LARGURA_INVOLUCRO)}">
      <div style="display:grid; gap:12px; grid-template-columns:${escapa(COLUNAS_B)}">
        <div class="ds-caixa"><span class="ds-caixa-k">Corpo</span><span class="ds-caixa-v">O valor, a prova, o histórico</span></div>
        <div class="ds-caixa"><span class="ds-caixa-k">Aparelho</span><span class="ds-caixa-v">Proveniência, ressalvas, contagens, ligações ao livro-razão, o que a página não sabe</span></div>
      </div>
    </div>
    <p class="ds-mono">.linha, .municipio · grid-template-columns: ${escapa(COLUNAS_B)}</p>
    <p class="ds-regra">Corpo a 68ch, coluna de 300px com o aparelho. Para páginas de leitura e páginas de linha do livro-razão.</p>
    <p class="ds-nota">Em uso: <code class="ds-mono">/livro-razao/&lt;id&gt;</code> e <code class="ds-mono">/municipios/&lt;slug&gt;</code>. O sétimo tipo de página escolheu esta das três, partilha as suas regras de grelha, e não trouxe acento novo.</p>
  </section>

  <section class="ds-bloco">
    <h2>C · Instrumento</h2>
    <div class="ds-esboco" style="max-width:${escapa(LARGURA_INVOLUCRO)}">
      <div class="ds-caixa"><span class="ds-caixa-k">Instrumento</span><span class="ds-caixa-v">Largura toda do invólucro</span></div>
    </div>
    <p class="ds-mono">.wrap · max-width: ${escapa(LARGURA_INVOLUCRO)}</p>
    <p class="ds-regra">Largura toda, o instrumento enche-a. Só para instrumentos.</p>
    <p class="ds-nota">Um instrumento dentro de uma página não é uma quarta disposição: a página mantém a sua disposição e o instrumento tem a largura que os instrumentos têm. É o que fazem a primeira página, a página do município e, desde 16.08.2026, o Método.</p>
  </section>

  <section class="ds-bloco">
    <p class="ds-nota">IDENTIDADE §3, com as pequenas telas de parte: abaixo de 780px a disposição A cai para uma coluna, e abaixo de 900px a B faz o mesmo.</p>
  </section>`;

  regista(
    '04-disposicoes.html',
    'Disposições',
    1240,
    cartao({ grupo: 'Disposições', viewport: 1240, titulo: 'Disposições A · B · C', corpo }),
    'larguras lidas de site.css'
  );
}

/* --------------------------------------------------------- 5. Camadas */
{
  const root = arvore('index.html');
  const instrumento = root.querySelector('#convergencia');
  if (!instrumento) morre('não encontrei `#convergencia` em `dist/index.html`.');
  tiraCodigo(instrumento);
  /* A terceira camada é um <details>, e fechado não se vê. Abre-se, porque o
     cartão existe para mostrar as três. O estado é do próprio componente. */
  const fundo = instrumento.querySelector('details.deep');
  if (!fundo) morre('não encontrei a camada Fundo (`details.deep`) no instrumento n.º 1.');
  fundo.setAttribute('open', '');
  absolutizaLigacoes(instrumento, 'dist/index.html → #convergencia');

  const corpo = `  <header class="ds-cabeca">
    <span class="eyebrow">Disposições</span>
    <h1>Camadas</h1>
    <p class="sec-sub">Relance → Leitura breve → Fundo. A profundidade abre-se no sítio, nunca noutra página.</p>
  </header>

  <section class="ds-bloco">
    <table class="ds-tabela">
      <thead><tr><th>Camada</th><th>Num instrumento</th><th>Numa página de leitura</th></tr></thead>
      <tbody>
        <tr><td>Relance</td><td>O número, sozinho</td><td>A medida que faz o estudo valer a pena</td></tr>
        <tr><td>Leitura breve</td><td>Uma frase, e a distância desenhada</td><td>Uma frase do que o estudo concluiu</td></tr>
        <tr><td>Fundo</td><td>Método, ressalvas, proveniência</td><td>Método, ressalvas, proveniência, e o documento</td></tr>
      </tbody>
    </table>
    <p class="ds-regra"><strong>Todo o instrumento leva as três.</strong> O instrumento n.º 2 leva hoje só duas: ou ganha uma leitura breve, ou declara por escrito porque não a tem.</p>
    <p class="ds-nota">IDENTIDADE §4.</p>
  </section>

  <section class="ds-bloco">
    <h2>As três camadas, como rendem</h2>
    <p class="ds-nota">O instrumento n.º 1 da primeira página, tirado de <code class="ds-mono">dist/index.html</code> tal como está construído. Duas diferenças, e são só estas: o código saiu (a régua mostra Portugal, que é o que a página mostra a quem não tem JavaScript, e a própria página o diz por escrito), e a terceira camada está aberta, porque fechada não se via.</p>
  </section>

${instrumento.toString()}`;

  regista(
    '05-camadas.html',
    'Disposições',
    1240,
    cartao({ grupo: 'Disposições', viewport: 1240, titulo: 'Camadas', corpo }),
    'instrumento n.º 1, sem código'
  );
}

/* ------------------------------------------------------------- 6 a 12. Páginas */
const PAGINAS = [
  { ficheiro: '06-pagina-primeira.html', rota: 'index.html', titulo: 'Página: primeira' },
  {
    ficheiro: '07-pagina-linha-livro-razao.html',
    rota: 'livro-razao/precos-da-habitacao-2025/index.html',
    titulo: 'Página: linha do livro-razão',
  },
  { ficheiro: '08-pagina-municipio.html', rota: 'municipios/evora/index.html', titulo: 'Página: município' },
  { ficheiro: '09-pagina-metodo.html', rota: 'metodo/index.html', titulo: 'Página: método' },
  { ficheiro: '10-pagina-agenda.html', rota: 'agenda/index.html', titulo: 'Página: agenda' },
  { ficheiro: '11-pagina-sobre.html', rota: 'sobre/index.html', titulo: 'Página: sobre' },
  { ficheiro: '12-pagina-correcoes.html', rota: 'correcoes/index.html', titulo: 'Página: correções' },
];

for (const p of PAGINAS) {
  const feito = cartaoDePagina({ rota: p.rota, grupo: 'Páginas', viewport: 1240, titulo: p.titulo });
  regista(p.ficheiro, 'Páginas', 1240, feito.html, `dist/${p.rota}`);
}

/* ------------------------------------------------------------ 13. Regras */
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
    '13-regras.html',
    'Fundamentos',
    720,
    cartao({ grupo: 'Fundamentos', viewport: 720, titulo: 'Regras', corpo }),
    'IDENTIDADE.md inteiro'
  );
}

/* ================================================================ escrever */

fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(SAIDA, { recursive: true });

for (const c of cartoes) fs.writeFileSync(path.join(SAIDA, c.ficheiro), c.html, 'utf8');

const README = `# design-system · o feixe de cartões para o Claude Design

**Esta pasta é gerada. Não editar à mão.** O que se editar aqui desaparece na
corrida seguinte, e a única coisa que se guarda em git é o gerador.

Gerada por \`scripts/design-bundle.mjs\` a partir de:

- \`dist/\`: as páginas construídas, no commit \`${commitCurto}\`;
- \`src/styles/tokens.css\` e \`src/styles/site.css\`: as fichas e a folha;
- \`IDENTIDADE.md\`: a regra.

## Refazer

\`\`\`sh
npm run build                  # as páginas têm de estar construídas
node scripts/design-bundle.mjs
\`\`\`

A corrida apaga a pasta e escreve-a de novo, confere cada cartão e sai a 1 se
algum falhar.

## O que é um cartão

Um ficheiro HTML que se basta a si próprio. A primeira linha é a marca por onde
o painel o arruma:

\`\`\`html
<!-- @dsCard group="Fundamentos" viewport="720" -->
\`\`\`

Nenhum cartão tem \`<script>\`, nem sequer as ilhas de dados das páginas: um
cartão é um retrato, não uma página viva. Nenhum faz um pedido para fora. A
folha de estilo vai inteira dentro de um \`<style>\` no \`<head>\`, na ordem em
que \`Base.astro\` a importa. As ligações internas foram passadas a absolutas em
\`${BASE}\`, para abrirem o sítio no ar; as ligações para as fontes ficaram como
estão, porque é isso que elas são.

Nos cartões de página saiu também a mobília de indexação do \`<head>\` (canónico,
hreflang, Open Graph): não pinta um pixel, e cada uma trazia um endereço.

## Os cartões

| Ficheiro | Grupo | Largura | Origem |
|---|---|---|---|
${cartoes.map((c) => `| \`${c.ficheiro}\` | ${c.grupo} | ${c.largura}px | ${c.nota} |`).join('\n')}

A largura é a que o painel deve dar ao cartão. Os cartões pequenos pedem
720px; os de página pedem 1240px, que é o que o invólucro de 1.180px precisa
para caber inteiro. As disposições e as camadas pedem 1240px pela mesma razão:
desenham geometria de página, e a 720px estariam a mostrar a versão estreita.

## O que não está aqui

Nada de novo. O feixe é a identidade de hoje, e mais nada: nenhuma cor, nenhuma
disposição e nenhuma regra foi inventada para o preencher. Onde um cartão
precisou de andaime, o andaime usa só fichas de \`tokens.css\`.
`;

fs.writeFileSync(path.join(SAIDA, 'README.md'), README, 'utf8');

/* ============================================================= conferência */

/**
 * A conferência, cartão a cartão.
 *
 * Quatro coisas: a marca na primeira linha, nenhum código, nenhum pedido para
 * fora, e tamanho debaixo do tecto. O único sítio onde um endereço `http(s)` é
 * admitido é um atributo `href`, que é uma ligação e não um pedido; qualquer
 * outro (um `src`, um `url()`, um `@import`) faz o cartão depender de uma rede
 * que o painel pode não ter.
 */
const RE_MARCA = /^<!-- @dsCard group="[^"]+" viewport="\d+" -->$/;

/**
 * As etiquetas que buscam alguma coisa. Nenhuma tem lugar num cartão, e a
 * lista inclui as que o sítio não usa: o cartão de amanhã pode usar.
 */
const ETIQUETAS_QUE_BUSCAM = [
  'script',
  'link',
  'img',
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
  let noTexto = 0;
  const anda = (no) => {
    if (no.rawTagName) {
      for (const [nome, valor] of Object.entries(no.attributes ?? {})) {
        const v = String(valor ?? '');
        if (nome.toLowerCase() === 'href') {
          if (/^https?:\/\//i.test(v) && !v.startsWith(BASE)) externas += 1;
          continue;
        }
        if (/https?:\/\/|(^|[\s(])\/\//i.test(v)) {
          falhas.push(`endereço no atributo ${nome} de <${no.rawTagName}>`);
        }
      }
    }
    for (const f of no.childNodes ?? []) anda(f);
  };
  anda(root);

  noTexto = [...String(root.structuredText ?? root.text ?? '').matchAll(/https?:\/\//gi)].length;

  for (const estilo of root.querySelectorAll('style')) {
    const css = estilo.innerHTML ?? '';
    if (/@import/i.test(css)) falhas.push('a folha embutida tem @import');
    if (/url\(\s*['"]?(https?:)?\/\//i.test(css)) falhas.push('a folha embutida tem url() para fora');
  }

  const bytes = Buffer.byteLength(html, 'utf8');
  if (bytes >= LIMITE_BYTES) falhas.push(`${(bytes / 1024).toFixed(1)} KiB acima do tecto de ${LIMITE_BYTES / 1024} KiB`);

  return { ficheiro, bytes, falhas, externas, noTexto };
}

const resultados = cartoes.map((c) => ({ ...confere(c.ficheiro, c.html), grupo: c.grupo }));

const larguraFicheiro = Math.max(8, ...resultados.map((r) => r.ficheiro.length));
const larguraGrupo = Math.max(5, ...resultados.map((r) => r.grupo.length));

console.log();
console.log(negrito('  O feixe de cartões do sistema de desenho'));
console.log(cinza(`  design-system/ · de dist/ no commit ${commitCurto} · ${cartoes.length} cartões e um README`));
console.log();
console.log(
  cinza(
    `  ${'ficheiro'.padEnd(larguraFicheiro)}  ${'grupo'.padEnd(larguraGrupo)}  ${'bytes'.padStart(7)}  ok`
  )
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
console.log(cinza(`  ${(totalBytes / 1024).toFixed(1)} KiB no total · maior cartão ${(Math.max(...resultados.map((r) => r.bytes)) / 1024).toFixed(1)} KiB · tecto ${LIMITE_BYTES / 1024} KiB`));
const externas = resultados.reduce((s, r) => s + r.externas, 0);
const noTexto = resultados.reduce((s, r) => s + r.noTexto, 0);
console.log(cinza(`  ligações internas absolutas em ${BASE} · ${externas} ligações para fontes, intactas · ${noTexto} endereços escritos no texto das páginas (transcrições, não pedidos)`));
/* A frase só se diz quando é verdade de todos: um resumo que se imprime na
   mesma quando alguma coisa falhou é a razão por que ninguém repara. */
if (!falhados.length) {
  console.log(cinza('  nenhum <script>, nenhum <img>, nenhum <link>, nenhum endereço fora de um href: nenhum cartão pede nada a ninguém'));
}

if (falhados.length) {
  console.log();
  console.log(`  ${vermelho('✗')} ${falhados.length} cartão(ões) reprovado(s).`);
  console.log();
  process.exit(1);
}

console.log();
console.log(`  ${verde('✓')} ${cartoes.length} cartões e um README em design-system/.`);
console.log();
