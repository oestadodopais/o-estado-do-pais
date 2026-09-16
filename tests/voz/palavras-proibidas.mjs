#!/usr/bin/env node
/**
 * =============================================================================
 * A PLANTA DO PORTÃO DAS PALAVRAS · bloco P3, 16.09.2026
 * =============================================================================
 *
 * NÃO É UM PORTÃO: é o CONHECIDO-POSITIVO do portão que entra, a célula 11 do
 * `npm run check:voz`. A regra 14 da casa diz porque é preciso: «um detetor que
 * lê sete mil páginas e conta zero tem duas explicações e só uma é boa».
 *
 * O QUE ELA FAZ, palavra a palavra da lista da norma §1.3: planta a palavra numa
 * CÓPIA de `dist/`, corre a mesma função que o portão corre, e exige que ela a
 * veja naquela página. Depois repõe a cópia e exige que a mesma função não veja
 * nada. Uma palavra da lista que passe despercebida é uma linha do portão que
 * não mede nada.
 *
 * A CÓPIA FAZ-SE COM LIGAÇÕES DURAS (`cp -al`), como a régua da página do
 * domínio: plantar é apagar a ligação e escrever um ficheiro novo no lugar dela,
 * e a árvore construída não é tocada.
 *
 * A PLANTA É A FRASE INTEIRA E NÃO SÓ A PALAVRA, e é de propósito: o que o
 * portão tem de apanhar é a palavra escrita por este projeto numa frase sua, no
 * meio de tudo o resto, e não uma cadeia solta num ficheiro vazio.
 *
 * ---------------------------------------------------------------------------
 * A SEGUNDA METADE: UMA PLANTA POR BURACO DA SUPERFÍCIE (16.09.2026)
 * ---------------------------------------------------------------------------
 * As catorze plantas de cima entram sempre no mesmo sítio, um parágrafo logo a
 * seguir ao `<body>`, e por isso provam uma coisa só: que a LISTA morde. O
 * achado 10 da leitura a frio do Codex mostrou o resto: a superfície tinha
 * quatro buracos, e catorze plantas no mesmo sítio não distinguem nenhum deles.
 *
 * Estas quatro plantam cada uma no SEU buraco, e cada uma tem de ser vista:
 *
 *   1. um atributo à vista (`title`), que o portão não lia por devolver só
 *      `body.textContent`;
 *   2. o corpo de uma dobra ABERTA (`<details open>`), que o portão tirava com
 *      o de todas as outras;
 *   3. a faixa deste projeto por cima do documento fixado de um estudo, numa
 *      rota que o portão saltava inteira;
 *   4. a prosa deste projeto à volta da transcrição de um estudo, na outra rota
 *      que o portão saltava inteira.
 *
 * AS DUAS ÚLTIMAS PLANTAM TAMBÉM DO OUTRO LADO DA FRONTEIRA, dentro do documento
 * fixado e dentro da transcrição, e exigem que o portão **não** as veja. Uma
 * exceção que deixasse de isentar o que diz isentar era tão má como a que
 * isentava a página inteira, e só as duas plantas juntas dizem onde é a linha.
 *
 * Uso:  node tests/voz/palavras-proibidas.mjs
 *       node tests/voz/palavras-proibidas.mjs --prova
 *       node tests/voz/palavras-proibidas.mjs --json <ficheiro>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { palavrasProibidasEm, PALAVRAS_PROIBIDAS, superficieDe } from '../../scripts/voz-palavras.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = process.env.OEDP_DIST ? path.resolve(RAIZ, process.env.OEDP_DIST) : path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  A PLANTA DAS PALAVRAS · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/* A PÁGINA ONDE SE PLANTA: a primeira página da edição portuguesa, que é a que
   toda a gente lê primeiro e a que não está em exceção nenhuma. */
const PAGINA = 'index.html';

/* A FRASE DE CADA PLANTA, uma por palavra da lista, escrita como este projeto a
   escreveria se a palavra tivesse voltado. O texto entra num parágrafo depois da
   abertura do corpo: fica na superfície, fora de qualquer dobra e fora de
   qualquer campo transcrito, que é onde o portão mede. */
const FRASES = {
  'a casa': 'As regras da casa estão no Método.',
  'the house': 'These are the house rules.',
  'política da casa': 'A política da casa está no Método.',
  'página inteira': 'Ver a página inteira dos domínios.',
  'passe o rato': 'Passe o rato por um distrito.',
  'toque em': 'Toque num cartão para ler a medida.',
  limiar: 'O valor está acima do limiar publicado.',
  'responsável editorial': 'O responsável editorial responde pelo que se publica.',
  'e mais N': 'Economia e finanças públicas, e mais cinco.',
  'incluído em': 'Trabalho, incluído em Economia e finanças públicas.',
  'sem guião': 'Sem guião, a lista mostra tudo.',
  'conferido a': 'Conferido a 14.09.2026.',
  'lido na fonte a': 'Lido na fonte a 14.09.2026.',
  'os dois estados do selo': 'Os dois estados do selo dizem o que falta.',
};

const copia = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-palavras-'));
const raizDaCopia = path.join(copia, 'dist');
execFileSync('cp', ['-al', DIST, raizDaCopia]);

const alvo = path.join(raizDaCopia, PAGINA);
const original = fs.readFileSync(alvo, 'utf8');

/** Escreve a página com a frase plantada logo a seguir à abertura do corpo. */
function planta(frase) {
  const i = original.indexOf('<body');
  const j = original.indexOf('>', i);
  const novo = `${original.slice(0, j + 1)}<p class="planta">${frase}</p>${original.slice(j + 1)}`;
  fs.rmSync(alvo);
  fs.writeFileSync(alvo, novo, 'utf8');
}

function repoe() {
  fs.rmSync(alvo);
  fs.writeFileSync(alvo, original, 'utf8');
}

/* OS QUATRO BURACOS DA SUPERFÍCIE, um por planta. O alvo de cada um procura-se
   em `dist/` e não se escreve à mão: um estudo que saia do arquivo faz a régua
   falhar com a razão à vista, que é o que tem de acontecer. */
/** @param {string} html @param {string} pedaco */
function depoisDoCorpo(html, pedaco) {
  const i = html.indexOf('<body');
  const j = html.indexOf('>', i);
  return `${html.slice(0, j + 1)}${pedaco}${html.slice(j + 1)}`;
}

/** @param {string} html @param {string} atributo @param {string} pedaco */
function dentroDaMarca(html, atributo, pedaco) {
  const i = html.indexOf(atributo);
  if (i < 0) return null;
  const j = html.indexOf('>', i);
  if (j < 0) return null;
  return `${html.slice(0, j + 1)}${pedaco}${html.slice(j + 1)}`;
}

/** @param {RegExp} marca @returns {string|null} */
function primeiraPagina(marca) {
  /** @param {string} dir @returns {string|null} */
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        const achado = anda(p);
        if (achado) return achado;
      } else if (e.name.endsWith('.html')) {
        const rel = path.relative(DIST, p).split(path.sep).join('/');
        if (marca.test(rel)) return rel;
      }
    }
    return null;
  };
  return anda(DIST);
}

const BURACOS = [
  {
    nome: 'um atributo à vista (`title`)',
    chave: 'limiar',
    pagina: () => PAGINA,
    morde: (html) =>
      depoisDoCorpo(html, '<span class="planta" title="O valor está acima do limiar publicado."></span>'),
    naoMorde: null,
  },
  {
    nome: 'o corpo de uma dobra aberta (`<details open>`)',
    chave: 'passe o rato',
    pagina: () => PAGINA,
    morde: (html) =>
      depoisDoCorpo(
        html,
        '<details class="planta" open><summary>A planta</summary><p>Passe o rato por um distrito.</p></details>',
      ),
    naoMorde: null,
  },
  {
    nome: 'a faixa deste projeto por cima do documento fixado de um estudo',
    chave: 'a casa',
    pagina: () => primeiraPagina(/^estudos\/[^/]+\/documento\/index\.html$/),
    morde: (html) => dentroDaMarca(html, 'data-oedp-faixa', '<p class="planta">As regras da casa estão no Método.</p>'),
    naoMorde: (html) => depoisDoCorpo(html, '<p class="planta">As regras da casa estão no Método.</p>'),
  },
  {
    nome: 'a prosa deste projeto à volta da transcrição de um estudo',
    chave: 'responsável editorial',
    pagina: () => primeiraPagina(/^estudos\/[^/]+\/texto\/index\.html$/),
    morde: (html) =>
      depoisDoCorpo(html, '<p class="planta">O responsável editorial responde pelo que se publica.</p>'),
    naoMorde: (html) =>
      dentroDaMarca(html, 'data-registo-edicao', '<p class="planta">O responsável editorial responde pelo que se publica.</p>'),
  },
];

const linhas = [];
let vistas = 0;

/* O REPOUSO PRIMEIRO: a cópia intacta tem de dar zero. Se der mais do que zero,
   não há planta que prove nada, porque o portão já estava vermelho. */
repoe();
const repouso = palavrasProibidasEm(raizDaCopia);
if (repouso.achados.length > 0) {
  console.error(
    vermelho(
      `\n  A PLANTA DAS PALAVRAS · a cópia intacta já tem ${repouso.achados.length} achado(s). ` +
        `Corrija-os antes: com o portão vermelho em repouso, nenhuma planta prova nada.\n`,
    ),
  );
  for (const a of repouso.achados.slice(0, 10)) {
    console.error(`    · «${a.chave}» em ${a.caminho}: «…${a.trecho}…»`);
  }
  console.error('');
  fs.rmSync(copia, { recursive: true, force: true });
  process.exit(1);
}

for (const p of PALAVRAS_PROIBIDAS) {
  const frase = FRASES[p.chave];
  if (!frase) {
    linhas.push({ chave: p.chave, estado: 'sem frase', visto: false });
    continue;
  }
  /* A FRASE TEM DE MORDER A MARCA, e isto prova-o antes de tocar em `dist/`:
     uma frase de planta que não case com a expressão media o portão errado. */
  if (!p.marca.test(superficieDe(`<body><p>${frase}</p></body>`))) {
    linhas.push({ chave: p.chave, estado: 'a frase da planta não morde a marca', visto: false });
    continue;
  }
  planta(frase);
  const { achados } = palavrasProibidasEm(raizDaCopia);
  const visto = achados.some((a) => a.chave === p.chave && a.caminho === PAGINA);
  repoe();
  if (visto) vistas++;
  linhas.push({ chave: p.chave, estado: visto ? 'vista' : 'PASSOU DESPERCEBIDA', visto });
}

/* ------------------------------------------------- os quatro buracos */
for (const b of BURACOS) {
  const rel = b.pagina();
  if (!rel) {
    linhas.push({ chave: `buraco · ${b.nome}`, estado: 'não há página em dist/ para plantar', visto: false });
    continue;
  }
  const ficheiro = path.join(raizDaCopia, rel);
  const antes = fs.readFileSync(ficheiro, 'utf8');
  /** @param {string} novo */
  const escreve = (novo) => {
    fs.rmSync(ficheiro);
    fs.writeFileSync(ficheiro, novo, 'utf8');
  };
  const comPlanta = b.morde(antes);
  if (!comPlanta) {
    linhas.push({ chave: `buraco · ${b.nome}`, estado: `não achou onde plantar em ${rel}`, visto: false });
    continue;
  }
  escreve(comPlanta);
  const vista = palavrasProibidasEm(raizDaCopia).achados.some((a) => a.chave === b.chave && a.caminho === rel);
  escreve(antes);
  /* E do outro lado da fronteira, onde a exceção diz que não se mede. */
  let fronteira = true;
  let porqueFronteira = '';
  if (b.naoMorde) {
    const doOutroLado = b.naoMorde(antes);
    if (!doOutroLado) {
      fronteira = false;
      porqueFronteira = 'não achou onde plantar do outro lado da fronteira';
    } else {
      escreve(doOutroLado);
      const viu = palavrasProibidasEm(raizDaCopia).achados.some((a) => a.chave === b.chave && a.caminho === rel);
      escreve(antes);
      if (viu) {
        fronteira = false;
        porqueFronteira = 'o portão viu a planta DENTRO do que a exceção isenta: a exceção deixou de isentar';
      }
    }
  }
  const visto = vista && fronteira;
  if (visto) vistas++;
  linhas.push({
    chave: `buraco · ${b.nome}`,
    estado: visto
      ? `vista em ${rel}`
      : vista
        ? porqueFronteira
        : `PASSOU DESPERCEBIDA em ${rel}`,
    visto,
  });
}

fs.rmSync(copia, { recursive: true, force: true });

const falhas = linhas.filter((l) => !l.visto);
const json = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
if (json) {
  fs.writeFileSync(json, JSON.stringify({ plantas: linhas, vistas, total: linhas.length }, null, 1));
}

if (falhas.length > 0) {
  console.error(vermelho(`\n  A PLANTA DAS PALAVRAS · ${falhas.length} de ${linhas.length} não foram vistas:\n`));
  for (const f of falhas) console.error(`    · «${f.chave}»: ${f.estado}`);
  console.error('');
  process.exit(1);
}

console.log(
  verde('  palavras ✓ ') +
    cinza(
      `${vistas} de ${linhas.length} plantas vistas (${PALAVRAS_PROIBIDAS.length} palavras, ` +
        `${BURACOS.length} buracos da superfície) · ${repouso.paginas} página(s) medidas em repouso, ` +
        `0 achados · ${repouso.excecoes} página(s) com a superfície estreitada por rota declarada`,
    ),
);
