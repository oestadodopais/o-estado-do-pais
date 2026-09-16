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
      `${vistas} de ${linhas.length} plantas vistas · ${repouso.paginas} página(s) da superfície em repouso, ` +
        `0 achados · ${repouso.excecoes} página(s) isentas por rota declarada`,
    ),
);
