/**
 * Confere o que está NO AR contra o que está no repositório.
 *
 * É a única conferência do projecto que não corre sobre `dist/`. Todas as outras
 * provam coisas sobre a construção; esta pergunta se a construção que está
 * publicada é a que se julga estar. As duas falhas de 2026-08-13 eram as duas
 * desta forma — `main` à frente de `origin/main`, o sítio a servir código velho,
 * e ninguém a saber até alguém ir ver à mão.
 *
 * Três coisas têm de coincidir:
 *
 *   no ar  ==  origin/main      o publicado é o que foi empurrado
 *   main   ==  origin/main      não há trabalho por empurrar
 *
 * Sai com código != 0 em qualquer divergência, para servir de portão de
 * lançamento. Um `version.json` sem commit é FALHA, não é desculpa: o sítio não
 * consegue dizer de onde veio, e isso é exactamente o que esta conferência
 * existe para não deixar passar.
 *
 * A SEGUNDA PERGUNTA COMPARAVA `HEAD` E DIZIA «main» (v2, DECISIONS §1.43). De
 * um ramo de trabalho, `HEAD` nunca é `origin/main`, e a conferência anunciava
 * que «o "main" local está N commits à frente» quando `main` estava exactamente
 * onde devia: a mensagem nomeava um ramo e media outro. Passa a ler o ramo que
 * o `--ref` nomeia, e um `main` local que não exista é falha e não silêncio.
 * `HEAD` continua impresso, porque saber onde se está é útil; o que ele já não
 * faz é decidir.
 *
 * DESDE 22.08.2026 CONFERE TAMBÉM O QUE O SERVIDOR RESPONDE (ISSUES I53,
 * segunda forma). O `vercel.json` passou a ser um só sistema de encaminhamento,
 * `routes`, porque um bloco `routes` presente faz a Vercel ignorar o bloco
 * `headers` (medido na pré-visualização n.º 3 a 22.08). Uma ordem errada dentro
 * de `routes` não parte a construção nem o portão do HTML: parte o que o
 * visitante recebe, e isso só se vê no ar. Por isso as invariantes moram aqui,
 * ao lado da única outra pergunta que fala com o sítio publicado.
 *
 * Uso:  node scripts/verify-deploy.mjs [--host <dominio>] [--ref <git-ref>]
 *                                      [--branch <ramo-local>]
 *
 * `--host` com o alias de uma pré-visualização corre as invariantes de
 * cabeçalho, de erro e de índice contra essa pré-visualização: é assim que se
 * prova que esta conferência sabe falhar. Os três 308 de anfitrião não se movem
 * com `--host`, porque os anfitriões que redireccionam são os que são.
 */
import { execFileSync } from 'node:child_process';
import { SITE_HOST, SITE_HOST_UNACCENTED } from '../site.config.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const arg = (nome, fallback) => {
  const i = argv.indexOf(nome);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const host = arg('--host', SITE_HOST);
const ref = arg('--ref', 'origin/main');
/* O ramo LOCAL que a segunda pergunta compara. Por defeito é o que o `--ref`
   nomeia («origin/main» → «main»): é esse que se empurra, e não onde se está a
   trabalhar. `--branch` existe para se poder provar esta conferência contra um
   ramo descartável, sem escrever um commit no `main`. */
const ramoLocal = arg('--branch', ref.replace(/^[^/]+\//, ''));

const erros = [];

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/* Sem fetch não se está a comparar com o remoto: está-se a comparar com a última
   vez que alguém falou com ele. Falhar aqui é preferível a passar por engano. */
try {
  execFileSync('git', ['fetch', '--quiet', 'origin'], { stdio: 'ignore' });
} catch {
  erros.push(`não foi possível fazer "git fetch origin" — a comparação com ${ref} seria contra uma cópia velha.`);
}

const esperado = git(['rev-parse', ref]);
const cabeca = git(['rev-parse', 'HEAD']);
/* `refs/heads/<ramo>` e não `<ramo>`: um nome solto podia resolver-se contra uma
   etiqueta ou contra o remoto, e a pergunta é sobre o ramo local. */
const local = git(['rev-parse', `refs/heads/${ramoLocal}`]);
if (!esperado) erros.push(`"git rev-parse ${ref}" não devolveu nada.`);
if (!local) {
  erros.push(
    `não existe um ramo local "${ramoLocal}" para comparar com ${ref}.\n` +
      `      A pergunta é se há trabalho por empurrar, e sem o ramo não há resposta: ` +
      `um silêncio aqui é o que deixou o sítio para trás a 2026-08-13.`,
  );
}

/* A CDN serve o ficheiro tal como estava; sem isto podia responder-se a esta
   pergunta com uma resposta anterior à pergunta. */
let publicado = null;
let stamp = null;
const url = `https://${host}/version.json?t=${Date.now()}`;
try {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } });
  if (!res.ok) {
    erros.push(`GET ${url} devolveu HTTP ${res.status}. O sítio no ar não publica version.json.`);
  } else {
    stamp = await res.json();
    publicado = stamp.commit ?? null;
    if (!publicado) {
      erros.push(
        `o sítio no ar publica version.json sem commit: ${stamp.motivo ?? 'sem motivo declarado'}`,
      );
    }
  }
} catch (e) {
  erros.push(`não foi possível ler ${url}: ${e.message}`);
}

console.log();
console.log(cinza(`  o que está no ar · ${host}`));
console.log(cinza(`    no ar        ${publicado ? publicado.slice(0, 7) : '·'}${stamp?.construido_em ? `  (${stamp.construido_em})` : ''}`));
console.log(cinza(`    ${ref.padEnd(12)} ${esperado ? esperado.slice(0, 7) : '·'}`));
console.log(cinza(`    ${ramoLocal.padEnd(12)} ${local ? local.slice(0, 7) : '·'}`));
console.log(cinza(`    HEAD         ${cabeca ? cabeca.slice(0, 7) : '·'}${cabeca && cabeca !== local ? '  (onde se está a trabalhar; não decide nada)' : ''}`));
console.log();

if (publicado && esperado && publicado !== esperado) {
  erros.push(
    `o sítio no ar está em ${publicado.slice(0, 7)} e ${ref} está em ${esperado.slice(0, 7)}.\n` +
      `      O que está publicado NÃO é o que está no repositório.`,
  );
}
if (local && esperado && local !== esperado) {
  const à_frente = git(['rev-list', '--count', `${esperado}..${local}`]);
  erros.push(
    `o "${ramoLocal}" local está ${à_frente ?? '?'} commit(s) à frente de ${ref}: há trabalho por empurrar.\n` +
      `      Foi assim que o sítio ficou para trás duas vezes a 2026-08-13.`,
  );
}

/**
 * AS INVARIANTES DE PRODUÇÃO (ISSUES I53, segunda forma, 22.08.2026).
 *
 * Perguntas ao servidor, cada uma com o observado ao lado do esperado. Não
 * substituem nenhuma das de cima: acrescentam-se, e qualquer falha traz o mesmo
 * código de saída, porque um sítio que serve o que deve a partir do commit
 * errado, ou o commit certo sem os cabeçalhos, está igualmente por lançar.
 *
 * NENHUMA SEGUE UM REDIRECCIONAMENTO (`redirect: 'manual'`). A resposta que se
 * lê é a primeira, que é a que se está a afirmar: um 308 conferido pelo seu
 * destino não prova o 308, prova o destino.
 */
const CABECALHOS_DA_CASA = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'SAMEORIGIN',
  'strict-transport-security': 'max-age=15552000',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

/* O alias da Vercel leva `noindex` para não concorrer com o domínio canónico
   nos motores de busca (README §Deploy, DECISIONS §1.24). Está escrito por
   extenso, e não lido do `vercel.json`, de propósito: uma conferência que lesse
   o ficheiro provaria que ele concorda consigo próprio, e não que o servidor faz
   o que se lhe pediu. O mesmo vale para os cinco cabeçalhos acima. */
const ALIAS_VERCEL = 'o-estado-do-pais.vercel.app';

const mostrar = (v) => (v == null ? '(ausente)' : `«${v}»`);

function conferir(rotulo, observado, esperado) {
  const bate = observado === esperado;
  console.log(
    `    ${bate ? verde('✓') : vermelho('✗')} ${rotulo.padEnd(42)} ` +
      cinza(`observado ${mostrar(observado)} · esperado ${mostrar(esperado)}`),
  );
  if (!bate) {
    erros.push(`${rotulo}: observado ${mostrar(observado)}, esperado ${mostrar(esperado)}.`);
  }
}

async function ler(endereco, { comCorpo = false } = {}) {
  try {
    const res = await fetch(endereco, {
      method: comCorpo ? 'GET' : 'HEAD',
      redirect: 'manual',
      headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
    });
    return {
      estado: res.status,
      cabecalho: (k) => res.headers.get(k),
      corpo: comCorpo ? await res.text() : '',
    };
  } catch (e) {
    /* Uma resposta que não houve não é uma resposta em branco: fica registada
       como erro, e as perguntas desta página falham a seguir por si próprias. */
    erros.push(`não foi possível ler ${endereco}: ${e.message}`);
    return { estado: null, cabecalho: () => null, corpo: '' };
  }
}

/* A língua declarada pela página servida: é o que distingue a página de erro da
   casa da página genérica do alojamento, e uma edição da outra. */
const lingua = (corpo) => corpo.match(/<html[^>]*\slang="([^"]*)"/i)?.[1] ?? null;

console.log(cinza(`  as invariantes de produção · ${host}`));

/* (a) os cinco cabeçalhos da casa, em duas famílias de página. */
for (const caminho of ['/', '/en/ledger']) {
  const r = await ler(`https://${host}${caminho}`);
  conferir(`${caminho} responde`, r.estado, 200);
  for (const [chave, valor] of Object.entries(CABECALHOS_DA_CASA)) {
    conferir(`${caminho} ${chave}`, r.cabecalho(chave), valor);
  }
}

/* (b) o escudo do alias: `noindex` no alias, e nada no domínio canónico. */
const respostaAlias = await ler(`https://${ALIAS_VERCEL}/`);
conferir(`${ALIAS_VERCEL} x-robots-tag`, respostaAlias.cabecalho('x-robots-tag'), 'noindex');
const respostaCanonica = await ler(`https://${host}/`);
conferir(`${host} x-robots-tag`, respostaCanonica.cabecalho('x-robots-tag'), null);

/* (c) os três 308 de anfitrião. Os anfitriões saem do `site.config.mjs` e não do
   `--host`: são estes que redireccionam, e uma pré-visualização não tem nada a
   dizer sobre eles. */
for (const anfitriao of [SITE_HOST_UNACCENTED, `www.${SITE_HOST_UNACCENTED}`, `www.${SITE_HOST}`]) {
  const r = await ler(`https://${anfitriao}/x`);
  conferir(`${anfitriao}/x estado`, r.estado, 308);
  conferir(`${anfitriao}/x location`, r.cabecalho('location'), `https://${SITE_HOST}/x`);
}

/* (d) um endereço inexistente recebe a página de erro da SUA edição. É a
   pergunta que a I53 abriu, e a única que produção reprova enquanto este ramo
   não for fundido. */
const inexistenteEn = await ler(`https://${host}/en/nao-existe`, { comCorpo: true });
conferir('/en/nao-existe estado', inexistenteEn.estado, 404);
conferir('/en/nao-existe lang', lingua(inexistenteEn.corpo), 'en');
const inexistentePt = await ler(`https://${host}/nao-existe`, { comCorpo: true });
conferir('/nao-existe estado', inexistentePt.estado, 404);
conferir('/nao-existe lang', lingua(inexistentePt.corpo), 'pt-PT');

/* (e) as duas páginas de erro existem, cada uma na sua língua. A inglesa é uma
   página como as outras (200, alcançável pela troca de edição da portuguesa); a
   portuguesa é o `404.html` que a Vercel serve quando nada mais bate, e por isso
   responde 404 ao seu próprio endereço: medido na pré-visualização n.º 3 e em
   produção a 22.08. */
const paginaEn = await ler(`https://${host}/en/404`, { comCorpo: true });
conferir('/en/404 estado', paginaEn.estado, 200);
conferir('/en/404 lang', lingua(paginaEn.corpo), 'en');
const paginaPt = await ler(`https://${host}/404`, { comCorpo: true });
conferir('/404 estado', paginaPt.estado, 404);
conferir('/404 lang', lingua(paginaPt.corpo), 'pt-PT');

console.log();

if (erros.length) {
  console.log(vermelho(`  NÃO CONFERE — ${erros.length} problema(s):`));
  for (const e of erros) console.log(vermelho(`    ✗ ${e}`));
  console.log();
  console.log(amarelo('  Nada se lança enquanto o que está no ar não for o que está no repositório.'));
  process.exit(1);
}

console.log(verde('  ✓ o que está no ar é o que está no repositório.'));
