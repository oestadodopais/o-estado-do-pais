#!/usr/bin/env node
/**
 * =============================================================================
 * «SEM RESPOSTA DESDE dd.mm.aaaa» · a régua do estado da fonte no recibo
 * =============================================================================
 *
 *   node tests/linha/sem-resposta.mjs            mede o `dist/` que já existe
 *   node tests/linha/sem-resposta.mjs --plantar <anfitrião>   escreve o estrago
 *   node tests/linha/sem-resposta.mjs --repor    devolve o ficheiro ao que era
 *
 * SAI COM 1 QUANDO ALGUMA FALHA. É uma régua e não um portão: corre fora do
 * `npm run build`, a seguir a ele, porque o que ela mede são as páginas
 * construídas e não o código que as constrói.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE, e porque é que são duas leituras e não uma
 * ---------------------------------------------------------------------------
 *
 * O corredor diário escreve dois blocos em `src/data/fontes.mjs`:
 *
 *   `FONTES_SEM_RESPOSTA`      por ENDEREÇO. Uma linha cujo endereço não foi
 *                              pedido na última corrida não tem lá entrada.
 *   `ANFITRIOES_SEM_RESPOSTA`  por ANFITRIÃO, e só quando TODOS os endereços
 *                              que o arquivo conhece daquele publicador estão
 *                              calados. É o estado que o disjuntor por
 *                              anfitrião do corredor mede quando uma casa
 *                              inteira deixa de atender.
 *
 * A página do recibo lê os dois, pela ordem do mais preciso primeiro, e
 * escreve a data pela regra da casa (dd.mm.aaaa, `src/lib/datas.mjs`). Esta
 * régua reconstrói a mesma decisão a partir do livro-razão e do ficheiro
 * gerado, e compara-a com o que as páginas dizem. Duas coisas, e as duas
 * contam:
 *
 *   1. TODA a linha que deve mostrar o estado mostra-o, nos DOIS sítios: na
 *      cabeça, ao pé do selo (`.linha-selo-estado`), e no bloco das
 *      verificações (`.linha-sem-resposta`). O primeiro é o que impede o selo
 *      de fingir frescura ao lado do número; o segundo é o recibo.
 *   2. NENHUMA linha cuja fonte responde o mostra. Um estado desenhado onde
 *      não há estado é pior do que nenhum, e é a metade que uma régua
 *      distraída não mede: bastava rendê-lo sempre para a primeira passar.
 *
 * ---------------------------------------------------------------------------
 * A PLANTA (regra 14). Uma régua só vale depois de um conhecido-positivo a ter
 * feito falhar. `--plantar <anfitrião>` acrescenta esse anfitrião ao
 * `ANFITRIOES_SEM_RESPOSTA` do ficheiro gerado; constrói-se o sítio outra vez e
 * corre-se esta régua: as linhas daquele anfitrião passam a dever o estado, e
 * uma versão da página que não leia o bloco por anfitrião fica vermelha em
 * todas elas. `--repor` devolve o ficheiro ao que o corredor escreveu.
 *
 * O ficheiro é GERADO, e por isso a planta escreve-se nele e tira-se dele: não
 * há aqui uma segunda cópia do estado a que alguém se pudesse habituar.
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { allClaims } from '../../src/lib/ledger.mjs';
import { dataDaCasa } from '../../src/lib/datas.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONTES = path.join(RAIZ, 'src', 'data', 'fontes.mjs');
const GUARDADO = path.join(RAIZ, 'src', 'data', '.fontes.mjs.antes-da-planta');
const DIST = path.join(RAIZ, 'dist');

const args = process.argv.slice(2);

/* ------------------------------------------------------------------ a planta */

function plantar(anfitriao) {
  if (!anfitriao) {
    console.error('  --plantar precisa do nome de um anfitrião.');
    return 2;
  }
  if (fs.existsSync(GUARDADO)) {
    console.error(`  ${GUARDADO} já existe: há uma planta por repor. Correr --repor.`);
    return 2;
  }
  const texto = fs.readFileSync(FONTES, 'utf8');
  fs.writeFileSync(GUARDADO, texto);
  const entrada =
    `  '${anfitriao}': {\n` +
    `    'desde': '2026-09-03',\n` +
    `    'enderecos': 5,\n` +
    `    'maquina': 'PLANTA'\n` +
    `  },\n`;
  const marca = 'export const ANFITRIOES_SEM_RESPOSTA = {\n';
  if (!texto.includes(marca)) {
    console.error('  o ficheiro gerado não tem `ANFITRIOES_SEM_RESPOSTA = {`.');
    return 2;
  }
  fs.writeFileSync(FONTES, texto.replace(marca, marca + entrada));
  console.log(`  PLANTADO  ${anfitriao} em ANFITRIOES_SEM_RESPOSTA de ${FONTES}`);
  console.log('  Construir outra vez (npm run build) e correr esta régua.');
  return 0;
}

function repor() {
  if (!fs.existsSync(GUARDADO)) {
    console.error('  não há planta guardada para repor.');
    return 2;
  }
  fs.writeFileSync(FONTES, fs.readFileSync(GUARDADO, 'utf8'));
  fs.unlinkSync(GUARDADO);
  console.log('  REPOSTO  o ficheiro gerado voltou ao que o corredor escreveu.');
  return 0;
}

if (args[0] === '--plantar') process.exit(plantar(args[1]));
if (args[0] === '--repor') process.exit(repor());

/* ------------------------------------------------------------------ a medida */

const { FONTES_SEM_RESPOSTA, ANFITRIOES_SEM_RESPOSTA } = await import(
  `${new URL('../../src/data/fontes.mjs', import.meta.url).href}?t=${Date.now()}`
);

/** O pedaço de HTML de um elemento com esta classe, do `>` ao `</p>` ou `</dd>`.
 *  Sem analisador de HTML de propósito: o que se procura é uma cadeia curta
 *  dentro de um elemento conhecido, e uma dependência nova para isso seria mais
 *  do que o que ela compra. */
function recorte(html, marca) {
  const i = html.indexOf(`class="${marca}"`);
  if (i < 0) return null;
  const abre = html.indexOf('>', i);
  if (abre < 0) return null;
  const fecha = Math.min(
    ...['</p>', '</dd>'].map((f) => {
      const j = html.indexOf(f, abre);
      return j < 0 ? Number.POSITIVE_INFINITY : j;
    }),
  );
  return Number.isFinite(fecha) ? html.slice(abre + 1, fecha) : html.slice(abre + 1, abre + 400);
}

/** O estado que a página DEVE desenhar para uma linha, ou null. A mesma decisão
 *  que `LinhaView.astro` toma, reconstruída aqui e não importada de lá: uma
 *  régua que importasse a função da página confirmava-a em vez de a conferir. */
function estadoEsperado(claim) {
  const u = claim?.source_url;
  if (typeof u !== 'string' || !u.startsWith('http')) return null;
  const pedido = u.split('#')[0];
  const doEndereco = FONTES_SEM_RESPOSTA?.[pedido];
  if (doEndereco) return doEndereco.desde;
  let anfitriao;
  try {
    anfitriao = new URL(pedido).host;
  } catch {
    return null;
  }
  return ANFITRIOES_SEM_RESPOSTA?.[anfitriao]?.desde ?? null;
}

const claims = allClaims();
if (claims.length === 0) {
  console.error('  o livro-razão veio vazio: a régua não mede nada e não passa.');
  process.exit(1);
}

const falhas = [];
let comEstado = 0;
let semEstado = 0;
let paginasLidas = 0;
let semPagina = 0;

for (const claim of claims) {
  const pagina = path.join(DIST, 'livro-razao', claim.id, 'index.html');
  if (!fs.existsSync(pagina)) {
    /* Uma linha sem página construída não é uma falha desta régua: há linhas
       que o sítio não publica. Conta-se, para que um `dist/` vazio não passe
       por um sítio inteiro sem estado nenhum. */
    semPagina += 1;
    continue;
  }
  paginasLidas += 1;
  const html = fs.readFileSync(pagina, 'utf8');
  const esperado = estadoEsperado(claim);
  const naCabeca = html.includes('class="linha-selo-estado"');
  const noRecibo = html.includes('class="linha-sem-resposta"');
  if (esperado === null) {
    semEstado += 1;
    if (naCabeca || noRecibo) {
      falhas.push(
        `${claim.id}: a fonte responde e a página desenha o estado ` +
          `(cabeça: ${naCabeca}, recibo: ${noRecibo}).`,
      );
    }
    continue;
  }
  comEstado += 1;
  const escrita = dataDaCasa(esperado);
  if (!naCabeca) falhas.push(`${claim.id}: falta o estado na cabeça, ao pé do selo.`);
  if (!noRecibo) falhas.push(`${claim.id}: falta o estado no bloco das verificações.`);
  /* A DATA MEDE-SE DENTRO DOS DOIS ELEMENTOS DO ESTADO, e não na página inteira.
     A primeira redacção desta régua procurava a forma ISO em todo o HTML e ficou
     vermelha nas quatro linhas da DGCP por uma razão que não é um defeito: o
     recibo rende `verifications.N.date` como CAMPO DO LIVRO-RAZÃO, em ISO e
     dentro de um `data-linha-campo`, porque é isso que o portão de HTML compara
     carácter a carácter com o livro. Uma régua que confundisse o dado com a
     superfície mandava mudar a coisa certa. */
  for (const [onde, marca] of [
    ['a cabeça', 'linha-selo-estado'],
    ['o recibo', 'linha-sem-resposta'],
  ]) {
    const bloco = recorte(html, marca);
    if (bloco === null) continue; /* a falta já foi dita acima */
    if (!bloco.includes(escrita)) {
      falhas.push(
        `${claim.id}: ${onde} não escreve «${escrita}». O ficheiro gerado diz ` +
          `«${esperado}» e a regra da casa escreve-a «${escrita}». Rendido: ${bloco}`,
      );
    }
    if (bloco.includes(esperado)) {
      falhas.push(
        `${claim.id}: ${onde} sai em ISO («${esperado}») e a regra da casa é dd.mm.aaaa.`,
      );
    }
  }
}

console.log(
  `  ${paginasLidas} página(s) de linha lidas em ${DIST} (${semPagina} linha(s) sem página).`,
);
console.log(
  `  ${comEstado} linha(s) devem mostrar «sem resposta desde» · ${semEstado} não devem.`,
);
console.log(
  `  endereços calados: ${Object.keys(FONTES_SEM_RESPOSTA ?? {}).length} · ` +
    `anfitriões calados: ${Object.keys(ANFITRIOES_SEM_RESPOSTA ?? {}).length}`,
);

if (falhas.length > 0) {
  console.error(`\nSEM-RESPOSTA: FAIL — ${falhas.length} problema(s) de ${paginasLidas} páginas`);
  for (const f of falhas.slice(0, 20)) console.error(' -', f);
  if (falhas.length > 20) console.error(` … e mais ${falhas.length - 20}`);
  process.exit(1);
}
console.log(`\nSEM-RESPOSTA: PASS — ${paginasLidas * 2} conferências (o estado e a sua ausência, em cada página)`);
