#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DA PÁGINA DO DOMÍNIO · bloco F1.2, 03.09.2026
 * =============================================================================
 *
 * NÃO É UM PORTÃO: não entra no `npm run build` e não constrói nada. O que ela
 * faz é o CONHECIDO-POSITIVO do portão que entra, o `npm run check:formas`, e
 * a regra 14 da casa diz porque é preciso: «um detetor que lê dois ficheiros e
 * conta zero tem duas explicações e só uma é boa».
 *
 * A régua planta seis estragos, um de cada vez, numa CÓPIA de `dist/`, corre o
 * portão contra ela, e exige que ele saia VERMELHO com a mensagem da célula que
 * a planta nomeia. Depois repõe a cópia e exige que ele saia VERDE. Uma planta
 * que passe despercebida é uma célula do portão que não mede nada.
 *
 * A CÓPIA FAZ-SE COM LIGAÇÕES DURAS (`cp -al`), e não é uma poupança de tempo: é
 * o que garante que a árvore construída não é tocada. Plantar um estrago é
 * apagar a ligação e escrever um ficheiro novo no lugar dela; o ficheiro
 * original fica onde estava, com o mesmo conteúdo, e nenhuma corrida desta régua
 * pode deixar `dist/` estragado.
 *
 * ---------------------------------------------------------------------------
 * AS NOVE PLANTAS, E A CÉLULA QUE CADA UMA TEM DE FAZER CAIR
 * ---------------------------------------------------------------------------
 *   P1 · um número escrito à mão dentro do `<svg>` de uma forma        → F2
 *   P2 · uma leitura breve sem as três datas                           → F5
 *   P3 · a frase da fronteira impressa duas vezes                      → F4
 *   P4 · uma linha dos 308 fora do alcance (a medida sai de um concelho) → F7
 *   P5 · o cartão de ausência com um valor do livro-razão              → F8
 *
 * E uma sexta, que não é do brief e que a casa exige de qualquer detetor:
 *   P6 · a data de uma medida trocada por outra data                   → F1
 *
 * E três da segunda passagem (03.09.2026), uma por conferência nova:
 *   P7 · um número da legenda com um motivo emprestado doutro sítio    → F9
 *   P8 · uma data ISO à vista no texto da página                       → F10
 *   P9 · a classe do mapa e o valor da linha a discordarem             → F11
 *
 * Uso:  node tests/dominio/pagina.mjs
 *       node tests/dominio/pagina.mjs --json <ficheiro>
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');
const PORTAO = path.join(RAIZ, 'scripts', 'check-formas.mjs');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  A RÉGUA DO DOMÍNIO · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/** A página do primeiro domínio, na edição portuguesa. */
const PAGINA_DO_DOMINIO = 'dominios/economia-e-financas-publicas/index.html';
/** Uma página de concelho qualquer, para a planta dos 308. */
const PAGINA_DE_CONCELHO = 'municipios/evora/index.html';

/* --------------------------------------------------------------------------
 * A CÓPIA, E A REPOSIÇÃO
 * -------------------------------------------------------------------------- */

const copia = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-formas-'));
const raizDaCopia = path.join(copia, 'dist');
execFileSync('cp', ['-al', DIST, raizDaCopia]);

/** @type {Map<string, string>} */
const originais = new Map();

/**
 * Planta um estrago: apaga a ligação dura e escreve um ficheiro novo no lugar.
 *
 * @param {string} rel  o caminho dentro de dist/
 * @param {(cru: string) => string} transforma
 */
function planta(rel, transforma) {
  const alvo = path.join(raizDaCopia, rel);
  if (!fs.existsSync(alvo)) {
    throw new Error(`a régua nomeia "${rel}", que não foi construído.`);
  }
  const cru = fs.readFileSync(alvo, 'utf8');
  if (!originais.has(rel)) originais.set(rel, cru);
  const novo = transforma(originais.get(rel) ?? cru);
  if (novo === cru) {
    throw new Error(
      `a planta em "${rel}" não mudou um único carácter. Uma planta que não estraga nada não ` +
        `prova nada: o alvo mudou de forma e a régua tem de a acompanhar.`,
    );
  }
  fs.rmSync(alvo);
  fs.writeFileSync(alvo, novo, 'utf8');
}

/** Repõe todos os ficheiros que alguma planta tocou. */
function repoe() {
  for (const [rel, cru] of originais) {
    const alvo = path.join(raizDaCopia, rel);
    fs.rmSync(alvo, { force: true });
    fs.writeFileSync(alvo, cru, 'utf8');
  }
}

/** Corre o portão contra a cópia e devolve o estado de saída e a saída. */
function correPortao() {
  const r = spawnSync(process.execPath, [PORTAO], {
    cwd: RAIZ,
    encoding: 'utf8',
    env: { ...process.env, OEDP_DIST: raizDaCopia },
    maxBuffer: 64 * 1024 * 1024,
  });
  return { codigo: r.status, saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/* --------------------------------------------------------------------------
 * As plantas
 * -------------------------------------------------------------------------- */

const PLANTAS = [
  {
    nome: 'P1',
    celula: 'F2',
    o_que: 'um número escrito à mão dentro do <svg> de uma forma',
    marca: 'não resolve numa linha nem numa marca de escala declarada',
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(
          /(<svg[^>]*class="forma-svg"[^>]*>)/,
          '$1<text class="tk" x="10" y="10">1 234,5</text>',
        ),
      ),
  },
  {
    nome: 'P2',
    celula: 'F5',
    o_que: 'uma leitura breve sem as três datas',
    marca: 'e a carta pede três',
    /* UMA SÓ DAS TRÊS, E DA PRIMEIRA MEDIDA: assim a leitura breve fica com duas
       datas e não com nenhuma, que é o estrago mais difícil de ver. `replace`
       sem a bandeira global toca a primeira ocorrência e mais nenhuma. */
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(/<span class="data-da-linha"[^>]*>[^<]*<\/span>/, ''),
      ),
  },
  {
    nome: 'P3',
    celula: 'F4',
    o_que: 'a frase da fronteira impressa duas vezes',
    marca: 'a frase da fronteira aparece 2 vez(es)',
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(/(<p class="dominio-fronteira"[^>]*>[\s\S]*?<\/p>)/, '$1$1'),
      ),
  },
  {
    nome: 'P4',
    celula: 'F7',
    o_que: 'uma das 308 linhas do ganho médio fora do alcance de uma página de concelho',
    marca: 'A medida é dos 308',
    plantar: () =>
      planta(PAGINA_DE_CONCELHO, (cru) => cru.replaceAll('Ganho médio mensal', 'Medida retirada')),
  },
  {
    nome: 'P5',
    celula: 'F8',
    o_que: 'o cartão de ausência com um valor do livro-razão',
    marca: 'deixa de ser uma ausência',
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(
          /(<article class="dominio-medida dominio-ausente"[^>]*>)/,
          '$1<span data-claim="ganho-medio-mensal-2024">1 576,0</span>',
        ),
      ),
  },
  {
    nome: 'P6',
    celula: 'F1',
    o_que: 'a data de uma medida trocada por outra data',
    marca: 'não é a da linha',
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(
          /(<span class="data-da-linha" data-nonledger="data-da-linha"[^>]*>)([^<]*)(<\/span>)/,
          '$101.01.2000$3',
        ),
      ),
  },
  /* -------------------------------------------------------------------------
   * TRÊS PLANTAS NOVAS, DAS TRÊS CONFERÊNCIAS DA SEGUNDA PASSAGEM
   * -------------------------------------------------------------------------
   * A leitura a frio do Codex (Blocking 5, Major 6) mediu que o pacote que lhe
   * foi dado não provava o vermelho de P1 nem a validação do motivo: as três
   * plantas abaixo exercitam especificamente as três conferências novas
   * (F9, F10, F11), a régua 14 da casa aplicada às conferências que esta
   * segunda passagem acrescentou. */
  {
    nome: 'P7',
    celula: 'F9',
    o_que: 'um número da legenda do mapa com um motivo emprestado de outro sítio da página',
    marca: 'não é um dos motivos',
    /* Troca UM corte da escala do mapa do ganho médio (`escala-de-instrumento`,
       o único motivo admissível para uma marca de régua) por `numeracao», que é
       um motivo válido no resto do sítio (a Emenda de «Instrumento n.º 1») e não
       aqui: é exactamente o disfarce que a leitura a frio descreveu para F2 e F8
       e que esta planta prova para a lista fechada geral. */
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(
          '<span data-nonledger="escala-de-instrumento">1200</span>',
          '<span data-nonledger="numeracao">1200</span>',
        ),
      ),
  },
  {
    nome: 'P8',
    celula: 'F10',
    o_que: 'uma data ISO à vista no texto da página',
    marca: 'uma data em ISO',
    /* Acrescenta uma data ISO ao fim da frase da fronteira, sem tocar em nenhum
       elemento marcado `data-da-linha`: um estrago isolado, que só a F10 (e
       nenhuma outra conferência) tem de apanhar. SEM PONTO A SEGUIR, DE
       PROPÓSITO: `texto()` concatena o texto de blocos vizinhos sem separador
       nenhum, e a data ISO fica colada ao "L" de "Leitura breve" (a secção
       seguinte). A primeira redação desta planta media isto sem o saber, com
       um ponto a seguir à data, e não apanhava nada: o `\b` da direita nunca
       via fronteira nenhuma entre "01" e "L", e a régua de `check-formas.mjs`
       ficou mais estrita por causa disto (`(?!\d)` em vez de `\b` a fechar). */
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(/(<p class="dominio-fronteira"[^>]*>)([\s\S]*?)(<\/p>)/, '$1$2 2026-09-01$3'),
      ),
  },
  {
    nome: 'P9',
    celula: 'F11',
    o_que: 'a classe do mapa e o valor da linha a discordarem (um concelho sem valor pintado com cor da escala)',
    marca: 'em vez de "sem-valor"',
    /* Penedono não tem valor numérico no índice de dívida (a Direção-Geral
       imprime «N.d.» nas duas colunas de que ele se calcula), e por isso o mapa
       pinta-o "sem-valor". A planta troca-lhe a classe por uma cor da escala,
       como se a linha tivesse um número. */
    plantar: () =>
      planta(PAGINA_DO_DOMINIO, (cru) =>
        cru.replace(
          'data-concelho="penedono" class="forma-mapa-c sem-valor"',
          'data-concelho="penedono" class="forma-mapa-c cl-limiar-0"',
        ),
      ),
  },
];

/* --------------------------------------------------------------------------
 * A corrida
 * -------------------------------------------------------------------------- */

/** @type {{ planta: string, celula: string, o_que: string, viu: boolean, nota: string }[]} */
const resultados = [];
let falhas = 0;

console.log(cinza(`  a cópia de dist/ está em ${raizDaCopia}`));

/* O VERDE VEM PRIMEIRO, e é o conhecido-negativo desta régua: se o portão já
   estivesse vermelho na cópia intacta, cada planta «vermelha» a seguir não
   provava nada. */
const antes = correPortao();
if (antes.codigo !== 0) {
  console.error(vermelho('\n  A RÉGUA DO DOMÍNIO · o portão já está vermelho na cópia intacta.'));
  console.error(antes.saida);
  process.exit(1);
}
console.log(verde('  a cópia intacta passa o portão') + cinza(' · saída 0'));

for (const p of PLANTAS) {
  repoe();
  try {
    p.plantar();
  } catch (erro) {
    resultados.push({
      planta: p.nome,
      celula: p.celula,
      o_que: p.o_que,
      viu: false,
      nota: erro instanceof Error ? erro.message : String(erro),
    });
    falhas++;
    console.log(vermelho(`  ${p.nome} · ${p.celula} · a planta não se pôde plantar`));
    continue;
  }
  const r = correPortao();
  const viu = r.codigo === 1 && r.saida.includes(p.marca);
  resultados.push({
    planta: p.nome,
    celula: p.celula,
    o_que: p.o_que,
    viu,
    nota: viu
      ? `saída ${r.codigo}, com «${p.marca}»`
      : `saída ${r.codigo}, e a mensagem esperada («${p.marca}») não aparece`,
  });
  if (!viu) falhas++;
  console.log(
    `  ${viu ? verde('vermelho ✓') : vermelho('não visto ✗')} ${p.nome} · ${p.celula} · ${p.o_que}` +
      cinza(` · saída ${r.codigo}`),
  );
}

repoe();
const depois = correPortao();
if (depois.codigo !== 0) {
  console.error(vermelho('\n  A RÉGUA DO DOMÍNIO · a reposição não deixou o portão verde.'));
  console.error(depois.saida);
  falhas++;
} else {
  console.log(verde('  reposto, o portão volta a verde') + cinza(' · saída 0'));
}

const json = process.argv.indexOf('--json');
if (json !== -1 && process.argv[json + 1]) {
  fs.writeFileSync(
    process.argv[json + 1],
    JSON.stringify(
      { copia: raizDaCopia, verde_antes: antes.codigo, verde_depois: depois.codigo, plantas: resultados },
      null,
      2,
    ),
  );
}

fs.rmSync(copia, { recursive: true, force: true });

if (falhas > 0) {
  console.error(vermelho(`\n  A RÉGUA DO DOMÍNIO · ${falhas} planta(s) não vista(s).\n`));
  process.exit(1);
}
console.log(
  verde(`\n  a régua do domínio ✓`) + cinza(` ${PLANTAS.length} de ${PLANTAS.length} plantas vistas\n`),
);
