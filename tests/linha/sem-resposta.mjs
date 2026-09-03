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
 * E AS CINCO LINHAS SEM ENDEREÇO (Major 8). As linhas cuja proveniência está
 * incompleta não se oferecem como registo: levam `noindex` e ficam fora do
 * `dist/sitemap-0.xml`. Isso era afirmado nos relatórios e não era conferido
 * por nada; passa a ser, sobre o `dist/` construído e sobre o mapa que ele
 * traz.
 *
 * A PLANTA (regra 14). Um portão só vale depois de um conhecido-positivo a ter
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

import { allClaims, provenienciaIncompleta } from '../../src/lib/ledger.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * OS RÓTULOS QUE A PÁGINA TEM DE ESCREVER, palavra por palavra, nas duas
 * línguas. São uma SEGUNDA CÓPIA da tabela de `src/i18n/strings.mjs`, e é de
 * propósito: uma régua que lesse a tabela da produção confirmava a tabela e não
 * a página. Uma chave trocada rende a etiqueta errada com a classe certa, e a
 * única coisa que o vê é uma cópia independente do texto.
 */
const ROTULOS = {
  pt: {
    rota: (id) => path.join('livro-razao', id),
    'sem-resposta': 'Sem resposta desde',
    'respondeu-com-erro': 'Respondeu com erro desde',
  },
  en: {
    rota: (id) => path.join('en', 'ledger', id),
    'sem-resposta': 'No answer since',
    'respondeu-com-erro': 'Answering with an error since',
  },
};

/**
 * dd.mm.aaaa, escrito aqui e não importado. Ver o cabeçalho: a régua não pode
 * usar o formatador da produção para conferir a produção.
 */
function esperadaDdMmAaaa(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  return m === null ? String(iso ?? '') : `${m[3]}.${m[2]}.${m[1]}`;
}
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
  /* O RÓTULO DE UMA LINHA DA LISTA VIVE NO `<dt>` E O VALOR NO `<dd>`, e são
     dois elementos. O recorte de um `dd` começa no `<dt>` que o antecede, senão
     mede o valor e diz que falta o rótulo, que foi o que este portão disse na
     primeira corrida sobre um recibo que estava certo. Numa `<p>` não há `dt`
     nenhum e o recorte é o elemento inteiro. */
  const dt = html.lastIndexOf('<dt', i);
  const inicio = dt >= 0 && dt < i && i - dt < 400 ? dt : i;
  const abre = html.indexOf('>', inicio === dt ? html.indexOf('>', dt) : i);
  if (abre < 0) return null;
  const fecha = Math.min(
    ...['</p>', '</dd>'].map((f) => {
      const j = html.indexOf(f, abre);
      return j < 0 ? Number.POSITIVE_INFINITY : j;
    }),
  );
  return Number.isFinite(fecha) ? html.slice(inicio, fecha) : html.slice(inicio, abre + 400);
}

/** O estado que a página DEVE desenhar para uma linha: `{estado, desde}` ou null.
 *  A mesma decisão que `LinhaView.astro` toma, reconstruída aqui e não importada
 *  de lá: uma régua que importasse a função da página confirmava-a em vez de a
 *  conferir. */
function estadoEsperado(claim) {
  const u = claim?.source_url;
  if (typeof u !== 'string' || !u.startsWith('http')) return null;
  const pedido = u.split('#')[0];
  const doEndereco = FONTES_SEM_RESPOSTA?.[pedido];
  if (doEndereco) {
    return { estado: doEndereco.estado ?? 'sem-resposta', desde: doEndereco.desde };
  }
  let anfitriao;
  try {
    anfitriao = new URL(pedido).host;
  } catch {
    return null;
  }
  const doAnfitriao = ANFITRIOES_SEM_RESPOSTA?.[anfitriao];
  return doAnfitriao
    ? { estado: doAnfitriao.estado ?? 'sem-resposta', desde: doAnfitriao.desde }
    : null;
}

const claims = allClaims();
if (claims.length === 0) {
  console.error('  o livro-razão veio vazio: o portão não mede nada e não passa.');
  process.exit(1);
}

const falhas = [];
let comEstado = 0;
let semEstado = 0;
let paginasLidas = 0;

for (const claim of claims) {
  const esperado = estadoEsperado(claim);
  if (esperado === null) semEstado += 1;
  else comEstado += 1;
  for (const [lang, rot] of Object.entries(ROTULOS)) {
    const pagina = path.join(DIST, rot.rota(claim.id), 'index.html');
    if (!fs.existsSync(pagina)) {
      /* UMA PÁGINA EM FALTA É UMA FALHA (Major 7). A primeira redacção contava
         as ausências e seguia em frente, e um `dist/` vazio ou meio construído
         saía com 0: o portão dizia que sim por não ter olhado para nada. Cada
         linha do livro-razão tem página nas duas edições; se não tiver, ou a
         construção não correu ou o sítio deixou de a publicar, e as duas coisas
         param aqui. */
      falhas.push(`${claim.id} (${lang}): não há página construída em ${pagina}.`);
      continue;
    }
    paginasLidas += 1;
    const html = fs.readFileSync(pagina, 'utf8');
    const naCabeca = html.includes('class="linha-selo-estado"');
    const noRecibo = html.includes('class="linha-sem-resposta"');
    if (esperado === null) {
      if (naCabeca || noRecibo) {
        falhas.push(
          `${claim.id} (${lang}): a fonte responde e a página desenha o estado ` +
            `(cabeça: ${naCabeca}, recibo: ${noRecibo}).`,
        );
      }
      continue;
    }
    const rotulo = rot[esperado.estado];
    if (rotulo === undefined) {
      falhas.push(`${claim.id} (${lang}): estado «${esperado.estado}» sem rótulo conhecido.`);
      continue;
    }
    const escrita = esperadaDdMmAaaa(esperado.desde);
    if (!naCabeca) falhas.push(`${claim.id} (${lang}): falta o estado na cabeça, ao pé do selo.`);
    if (!noRecibo) falhas.push(`${claim.id} (${lang}): falta o estado no bloco das verificações.`);
    /* A DATA E O RÓTULO MEDEM-SE DENTRO DOS DOIS ELEMENTOS DO ESTADO, e não na
       página inteira. A primeira redacção procurava a forma ISO em todo o HTML e
       ficou vermelha nas quatro linhas da DGCP por uma razão que não é um
       defeito: o recibo rende `verifications.N.date` como CAMPO DO LIVRO-RAZÃO,
       em ISO e dentro de um `data-linha-campo`, porque é isso que o portão de
       HTML compara carácter a carácter com o livro. Uma régua que confundisse o
       dado com a superfície mandava mudar a coisa certa. */
    for (const [onde, marca] of [
      ['a cabeça', 'linha-selo-estado'],
      ['o recibo', 'linha-sem-resposta'],
    ]) {
      const bloco = recorte(html, marca);
      if (bloco === null) continue; /* a falta já foi dita acima */
      if (!bloco.includes(rotulo)) {
        falhas.push(
          `${claim.id} (${lang}): ${onde} não escreve o rótulo «${rotulo}». ` +
            `O estado é «${esperado.estado}». Rendido: ${bloco}`,
        );
      }
      for (const outro of Object.keys(ROTULOS[lang])) {
        /* E NÃO ESCREVE O OUTRO. Chamar «sem resposta» a um 404 é a metade do
           defeito que uma régua distraída não vê: o rótulo certo está lá, e o
           errado também. */
        if (outro === 'rota' || outro === esperado.estado) continue;
        if (bloco.includes(rot[outro])) {
          falhas.push(
            `${claim.id} (${lang}): ${onde} escreve «${rot[outro]}» e o estado é ` +
              `«${esperado.estado}».`,
          );
        }
      }
      if (!bloco.includes(escrita)) {
        falhas.push(
          `${claim.id} (${lang}): ${onde} não escreve «${escrita}». O ficheiro gerado diz ` +
            `«${esperado.desde}» e a regra da casa escreve-a «${escrita}». Rendido: ${bloco}`,
        );
      }
      if (bloco.includes(esperado.desde)) {
        falhas.push(
          `${claim.id} (${lang}): ${onde} sai em ISO («${esperado.desde}») e a regra da ` +
            `casa é dd.mm.aaaa.`,
        );
      }
    }
  }
}

/* ------------------------------------------- as linhas de proveniência incompleta
 *
 * MAJOR 8. Os dois relatórios afirmavam que as cinco linhas sem endereço levam
 * `noindex` e ficam fora do mapa do sítio, e nada o conferia. Confere-se agora,
 * e sobre o `dist/` construído: a régua da proveniência incompleta é a mesma que
 * o `filter` do `astro.config.mjs` e o `noindex` do `LinhaView` leem, e o que
 * aqui se prova é que as três leituras dizem o mesmo.
 */
const MAPA = path.join(DIST, 'sitemap-0.xml');
if (!fs.existsSync(MAPA)) {
  falhas.push(`não há ${MAPA}: sem o mapa do sítio não se pode conferir quem está fora dele.`);
} else {
  const mapa = fs.readFileSync(MAPA, 'utf8');
  var incompletas = 0;
  for (const claim of claims) {
    const dentro = mapa.includes(`/livro-razao/${claim.id}`);
    const pagina = path.join(DIST, 'livro-razao', claim.id, 'index.html');
    /* A FALTA JÁ FOI DITA ACIMA, e aqui não se lê um ficheiro que não existe: um
       portão que rebenta com uma excepção não diz o que falhou, diz que ele
       próprio falhou. Foi assim que a planta da página em falta ficou muda na
       primeira corrida. */
    if (!fs.existsSync(pagina)) continue;
    const html = fs.readFileSync(pagina, 'utf8');
    const semIndice = html.includes('name="robots"') && html.includes('noindex');
    if (provenienciaIncompleta(claim)) {
      incompletas += 1;
      if (dentro) falhas.push(`${claim.id}: proveniência incompleta e no mapa do sítio.`);
      if (!semIndice) falhas.push(`${claim.id}: proveniência incompleta e sem noindex.`);
    } else {
      if (!dentro) falhas.push(`${claim.id}: proveniência completa e fora do mapa do sítio.`);
      if (semIndice) falhas.push(`${claim.id}: proveniência completa e com noindex.`);
    }
  }
}

console.log(
  `  ${paginasLidas} página(s) de linha lidas em ${DIST}, nas duas edições ` +
    `(${claims.length} linha(s) × ${Object.keys(ROTULOS).length}).`,
);
console.log(
  `  ${comEstado} linha(s) devem mostrar o estado da fonte · ${semEstado} não devem · ` +
    `${incompletas ?? 0} de proveniência incompleta, fora do mapa e com noindex.`,
);
console.log(
  `  endereços em falha: ${Object.keys(FONTES_SEM_RESPOSTA ?? {}).length} · ` +
    `anfitriões em falha: ${Object.keys(ANFITRIOES_SEM_RESPOSTA ?? {}).length}`,
);

if (falhas.length > 0) {
  console.error(`\nFONTES: FAIL — ${falhas.length} problema(s) de ${paginasLidas} páginas`);
  for (const f of falhas.slice(0, 20)) console.error(' -', f);
  if (falhas.length > 20) console.error(` … e mais ${falhas.length - 20}`);
  process.exit(1);
}
console.log(
  `\nFONTES: PASS — ${paginasLidas * 2 + claims.length * 2} conferências ` +
    `(o estado e a sua ausência em cada página das duas edições, e o mapa do sítio)`,
);
