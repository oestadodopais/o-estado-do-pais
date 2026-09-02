#!/usr/bin/env node
/**
 * Portão (b): o livro-razão está completo e a aritmética bate certo.
 *
 * Corre ANTES do astro build. Se falhar, não se constrói nada.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  validateLedger,
  allClaims,
  camposPorVerificar,
  evaluateCheck,
  parsePtDecimal,
  POR_VERIFICAR,
} from '../src/lib/ledger.mjs';
import { REGRAS, ABERTURA, LEITURA_BREVE, FECHO } from '../src/data/metodo.mjs';
import { SOBRE } from '../src/data/sobre.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const AQUI_ = path.dirname(fileURLToPath(import.meta.url));
const RAIZ_ = path.resolve(AQUI_, '..');

/* ===========================================================================
 * A PROVA DA ARITMÉTICA, ANTES DE QUALQUER VERDE (bloco F0.5, 02.09.2026)
 * ===========================================================================
 *
 * Regra 14 da casa: um zero só conta depois de a régua ter visto um vermelho.
 * O que esta régua diz, na linha «N com aritmética reavaliada no build», é que
 * cada expressão `check` foi reavaliada e deu o valor publicado. A auditoria de
 * 02.09.2026 mostrou que isso não queria dizer o que parecia: a conta corria em
 * `float64` e a aceitação tinha uma tolerância de `1e-9`, enquanto o motor
 * corria em decimais exatos sem tolerância nenhuma, e as duas casas davam
 * respostas diferentes ao mesmo `.5`.
 *
 * São duas provas, e correm as duas antes de a régua ler o livro-razão a sério:
 *
 *   1. A ESPECIFICAÇÃO PARTILHADA. `ledger/derivacoes-paridade.json` é o mesmo
 *      ficheiro, byte a byte, que o motor tem em `core/derivacoes-paridade.json`
 *      (o `check:cruzamento` prende-lhe os bytes) e que o
 *      `python3 -m core.derivations_test` avalia do outro lado. Cada caso tem a
 *      resposta que as regras da casa lhe dão, e cada recusa tem de atirar.
 *   2. OS ESTRAGOS PLANTADOS, DE PONTA A PONTA. Um livro-razão de mentira numa
 *      pasta temporária, pela porta `OEDP_LEDGER_DIR` que a casa já usa no
 *      `check:lingua`, corrido noutro processo: os quatro empates a meio, uma
 *      divisão cujo resultado em `float64` não é o resultado exato, e as duas
 *      derivações que o `float64` aceitava e a aritmética exata recusa. Não é o
 *      avaliador que se prova aqui, é a ACEITAÇÃO: o caminho inteiro, desde o
 *      ficheiro da linha até à lista de erros.
 *
 * A planta é sempre numa CÓPIA, nunca no que a construção publica.
 */

const provaDaAritmetica = [];
let casosDaAritmetica = 0;

{
  /* 1 · a especificação partilhada com o motor */
  const especFich = path.join(RAIZ_, 'ledger', 'derivacoes-paridade.json');
  if (!fs.existsSync(especFich)) {
    provaDaAritmetica.push(
      `não há ledger/derivacoes-paridade.json. É a especificação da aritmética, atravessa do ` +
        `motor e é avaliada pelos dois portões.\n        ` +
        `python3 -m publisher.cruzar_paridade --escrever --sitio <este sítio>`,
    );
  } else {
    const espec = JSON.parse(fs.readFileSync(especFich, 'utf8'));
    const semLinhas = new Map();
    for (const caso of espec.casos) {
      casosDaAritmetica++;
      let obtido;
      try {
        obtido = evaluateCheck(caso.expr, { claims: semLinhas, env: {} });
      } catch (err) {
        provaDaAritmetica.push(
          `paridade/${caso.id}: «${caso.expr}» devia dar ${caso.espera} e foi recusada — ` +
            `${err.message}`,
        );
        continue;
      }
      const esperado = parsePtDecimal(caso.espera);
      if (esperado === null) {
        provaDaAritmetica.push(`paridade/${caso.id}: "${caso.espera}" não é um número simples.`);
      } else if (!obtido.igual(esperado)) {
        provaDaAritmetica.push(
          `paridade/${caso.id}: «${caso.expr}» dá ${obtido.canonica()} e a especificação diz ` +
            `${caso.espera}.\n        ${caso.porque}`,
        );
      }
    }
    for (const recusa of espec.recusas) {
      casosDaAritmetica++;
      let obtido = null;
      try {
        obtido = evaluateCheck(recusa.expr, { claims: semLinhas, env: {} });
      } catch {
        continue;
      }
      provaDaAritmetica.push(
        `paridade/${recusa.id}: «${recusa.expr}» devia ser recusada e deu ` +
          `${obtido.canonica()}.\n        ${recusa.porque}`,
      );
    }
  }
}

{
  /* 2 · os estragos plantados, de ponta a ponta */
  const linhasDeApoio = {
    'meio-zero': '0,5',
    'meio-um': '1,5',
    'meio-dois': '2,5',
    'meio-menos': '-0,5',
    'vinte-e-tres': '23',
    'oitenta': '80',
    'um': '1',
    'tres': '3',
    'mil-e-cinco-milesimos': '1,005',
  };
  /* [id, valor publicado, expressão, tem de ficar vermelho?, o que a planta prova] */
  const plantas = [
    ['t-meio-zero-verde', '1', 'round ( meio-zero , 0 )', false,
      'round(0,5) é 1: meio para longe do zero. O motor dava 0 até 02.09.2026.'],
    ['t-meio-zero-vermelho', '0', 'round ( meio-zero , 0 )', true,
      'o valor que o meio-para-o-par dava tem de ser recusado.'],
    ['t-meio-um-verde', '2', 'round ( meio-um , 0 )', false,
      'round(1,5) é 2: o único dos quatro empates em que as duas regras concordam.'],
    ['t-meio-dois-verde', '3', 'round ( meio-dois , 0 )', false,
      'round(2,5) é 3. O motor dava 2, porque 2 é par.'],
    ['t-meio-dois-vermelho', '2', 'round ( meio-dois , 0 )', true,
      'o 2 do meio-para-o-par tem de ser recusado.'],
    ['t-meio-menos-verde', '-1', 'round ( meio-menos , 0 )', false,
      'round(-0,5) é -1: para longe do zero, simétrico.'],
    ['t-meio-menos-vermelho', '0', 'round ( meio-menos , 0 )', true,
      'o 0 que o Math.round() dá a -0,5 tem de ser recusado.'],
    ['t-divisao-verde', '28,8', 'round ( vinte-e-tres / oitenta * 100 , 1 )', false,
      '23 / 80 × 100 são 28,75 exatos, e 28,75 arredonda a 28,8.'],
    ['t-divisao-vermelho', '28,7', 'round ( vinte-e-tres / oitenta * 100 , 1 )', true,
      'em float64 a mesma divisão dá 28,749999999999996 e o arredondamento dava 28,7.'],
    ['t-float-aceitava-um', '1', 'um / tres * tres', true,
      'em float64 1/3×3 é exatamente 1 e a linha passava; com 28 algarismos são 0,999…9.'],
    ['t-float-aceitava-dois', '1', 'round ( mil-e-cinco-milesimos , 2 )', true,
      'em float64 1,005 × 100 são 100.49999999999999 e o arredondamento dava 1,00.'],
    ['t-exato-aceita', '1,01', 'round ( mil-e-cinco-milesimos , 2 )', false,
      'e o mesmo caso do outro lado: 1,01 é a resposta exata, e a tolerância de 1e-9 recusava-a.'],
  ];

  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-prova-aritmetica-'));
  try {
    for (const [id, valor] of Object.entries(linhasDeApoio)) {
      fs.writeFileSync(path.join(pasta, `${id}.yml`), `id: "${id}"\nvalue: "${valor}"\n`, 'utf8');
    }
    for (const [id, valor, expr] of plantas) {
      fs.writeFileSync(
        path.join(pasta, `${id}.yml`),
        `id: "${id}"\nvalue: "${valor}"\ncheck: "${expr}"\n`,
        'utf8',
      );
    }
    /* NOUTRO PROCESSO, e não neste: o livro-razão resolve-se uma vez por
       processo e fica em cache, e uma régua que trocasse o livro debaixo de si
       própria a meio da corrida não estaria a conferir o livro verdadeiro. */
    const modulo = JSON.stringify(pathToFileURL(path.join(RAIZ_, 'src', 'lib', 'ledger.mjs')).href);
    const guiao =
      `import(${modulo}).then((L) => { const r = L.validateLedger(); ` +
      'process.stdout.write(JSON.stringify(r.errors)); });';
    let errosPlantados;
    try {
      errosPlantados = JSON.parse(
        execFileSync(process.execPath, ['-e', guiao], {
          env: { ...process.env, OEDP_LEDGER_DIR: pasta },
          encoding: 'utf8',
        }),
      );
    } catch (err) {
      provaDaAritmetica.push(
        `o livro-razão de mentira não chegou a ser lido: ${err.message}\n` +
          `        Sem isto, os doze estragos plantados não foram vistos, e a linha verde de ` +
          `baixo não valeria nada.`,
      );
      errosPlantados = null;
    }
    const arithm = (id) =>
      errosPlantados.some((e) => e.includes(`[${id}.yml]`) && e.includes('a aritmética não bate certo'));
    for (const [id, valor, expr, temDeSerVermelho, porque] of errosPlantados ? plantas : []) {
      casosDaAritmetica++;
      const foiVermelho = arithm(id);
      if (foiVermelho === temDeSerVermelho) continue;
      provaDaAritmetica.push(
        temDeSerVermelho
          ? `planta/${id}: «${expr}» publicada como ${valor} foi ACEITE e tinha de ser recusada.\n` +
              `        ${porque}`
          : `planta/${id}: «${expr}» publicada como ${valor} foi RECUSADA e tinha de passar.\n` +
              `        ${porque}`,
      );
    }
  } finally {
    fs.rmSync(pasta, { recursive: true, force: true });
  }
}

console.log('');
console.log(
  cinza(
    `  aritmética · ${casosDaAritmetica} conferência(s): a especificação partilhada com o motor ` +
      `e os estragos plantados num livro-razão de mentira`,
  ),
);
if (provaDaAritmetica.length) {
  console.log('');
  console.error(
    vermelho(`  A ARITMÉTICA DAS DUAS CASAS NÃO É A MESMA · ${provaDaAritmetica.length} erro(s):`),
  );
  console.error('');
  for (const e of provaDaAritmetica) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  console.error(
    '  As regras estão em src/lib/decimal.mjs e em core/derivations.py, e a especificação',
  );
  console.error('  em ledger/derivacoes-paridade.json. Mudar uma sem a outra é o defeito.');
  console.error('');
  process.exit(1);
}
console.log(
  '  ' +
    verde('✓') +
    ' os quatro empates a meio, a divisão exata e as duas derivações que o float64 aceitava.',
);

let resultado;
try {
  resultado = validateLedger();
} catch (err) {
  console.error(vermelho('\n  LIVRO-RAZÃO — ERRO AO CARREGAR\n'));
  console.error('  ' + err.message + '\n');
  process.exit(1);
}

const { errors, warnings, stats } = resultado;

console.log('');
console.log(cinza('  livro-razão · ' + stats.total + ' afirmações'));

if (warnings.length) {
  console.log('');
  console.log(amarelo(`  ${warnings.length} aviso(s):`));
  for (const w of warnings) console.log('    ' + amarelo('·') + ' ' + w);
}

if (errors.length) {
  console.log('');
  console.error(vermelho(`  O LIVRO-RAZÃO NÃO PASSA — ${errors.length} erro(s):`));
  console.error('');
  for (const e of errors) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  console.error('  Nada é construído enquanto isto não estiver resolvido.');
  console.error(
    `  Um campo que não se conhece escreve-se "${POR_VERIFICAR}". Nunca se inventa um valor plausível.`,
  );
  console.error('');
  process.exit(1);
}

/* Dívida de proveniência: não bloqueia, mas fica à vista. A lista de campos vem
   de camposPorVerificar() — a mesma função que decide o estado do selo e se a
   página da linha entra no índice dos motores de busca. Este script tinha uma
   cópia da regra, e as duas discordavam numa linha. */
const porVerificar = [];
for (const c of allClaims()) {
  const campos = camposPorVerificar(c);
  if (campos.length) porVerificar.push({ id: c.id, campos });
}

console.log('');
console.log(
  '  ' +
    verde('✓') +
    ` ${stats.total} afirmações válidas · ${stats.derivadas} derivadas · ${stats.verificadas} com aritmética reavaliada no build` +
    ` · ${stats.comRotulo} com o rótulo da fonte`,
);

if (porVerificar.length) {
  console.log('');
  console.log(amarelo(`  Dívida de proveniência: ${porVerificar.length} afirmação(ões) com campos "${POR_VERIFICAR}"`));
  for (const p of porVerificar) {
    console.log(cinza(`    ${p.id} → ${p.campos.join(', ')}`));
  }
  console.log(
    cinza(
      '    Isto não impede o build. Impede que se diga que o livro-razão está fechado.',
    ),
  );
}
console.log('');

/* ===========================================================================
 * A AMARRA DAS DECISÕES — uma mudança de rumo não sai em silêncio
 * ===========================================================================
 *
 * Regra da direção, 2026-08-15 («Product Before Gates», regra de fecho 3): uma
 * mudança de rumo não pode sair em silêncio. Traduzida em mecanismo:
 *
 *   · toda a entrada do `DECISIONS.md` a partir da §1.38 declara, na primeira
 *     linha por baixo do título, o que a decisão governa:
 *     `**Afecta:** sobre · metodo · agenda · nenhum`;
 *   · para cada texto nomeado que não seja `agenda`, a entrada carrega
 *     `**Texto:** sobre <sha256, 12 primeiros hex> · metodo <…>`, tal como os
 *     ficheiros estavam quando a entrada foi escrita, e ou o texto mudou no
 *     bloco, ou a entrada diz `**Sem alteração:** <motivo>`;
 *   · uma entrada que nomeie `agenda` carrega `**Agenda:** <id do item>
 *     <data do histórico>`, nomeando a entrada do registo que regista a mudança.
 *
 * E depois: a ÚLTIMA entrada que nomeia cada texto tem de trazer o resumo do
 * ficheiro tal como ele está hoje. Se não trouxer, ou o texto mudou depois da
 * última decisão que o governa, ou a decisão foi registada contra outro texto.
 *
 * E o sentido inverso, desde 16.08.2026: uma entrada que nomeia um texto,
 * carimba o mesmo resumo da entrada anterior e não diz `Sem alteração` é uma
 * decisão que declara governar uma coisa que não mexeu, sem dizer porquê.
 *
 * O LIMITE DESTA AMARRA, e é honesto dizê-lo aqui e não só no registo: isto
 * corre sobre o ficheiro que está em disco, e o que proíbe é a mudança
 * SILENCIOSA: o texto mexer sem que nenhuma decisão o nomeie. Não proíbe uma
 * reescrita deliberada da própria entrada por quem tem direito de escrita no
 * repositório: essa reescreve o carimbo e o resumo volta a bater certo. A
 * segunda linha para esse caso é o git, e a auditoria mensal que o lê de fora
 * desta construção (`sweeps/decisoes.py` no motor). Ver DECISIONS §1.41.
 *
 * AS ENTRADAS ANTERIORES À §1.38 NÃO SÃO CONFERIDAS: são anteriores à regra, e
 * carimbá-las agora seria escrever que declararam uma coisa que ninguém lhes
 * pediu. A regra começa onde começou.
 *
 * O resumo é sobre os bytes do ficheiro, com as mudanças de linha
 * normalizadas e mais nada.
 */

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..');

/** Os textos que a regra governa, e o ficheiro de cada um. */
const TEXTOS = {
  sobre: path.join(RAIZ, 'src', 'data', 'sobre.mjs'),
  metodo: path.join(RAIZ, 'src', 'data', 'metodo.mjs'),
};
const NOMES_ACEITES = new Set([...Object.keys(TEXTOS), 'agenda', 'nenhum']);

/**
 * A entrada a partir da qual a regra existe.
 *
 * E é só a §1: é ali que vivem as decisões. A §2 é como o portão funciona, a
 * §3 é o que esta construção verificou e a §4 é o registo dos defeitos e dos
 * adiamentos. Nenhuma dessas é uma decisão a governar um texto, e pedir-lhes
 * um carimbo seria pedir-lhes que declarassem uma coisa que não são.
 */
const PRIMEIRA_AMARRADA = [1, 38];

export function resumoDoTexto(ficheiro) {
  const bytes = fs.readFileSync(ficheiro, 'utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(bytes, 'utf8').digest('hex').slice(0, 12);
}

function comparaSeccao(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** As entradas do `DECISIONS.md`, com o que cada uma declara. */
function entradasDasDecisoes(texto) {
  const linhas = texto.split('\n');
  const entradas = [];
  let atual = null;
  for (const linha of linhas) {
    const cabeca = linha.match(/^### (\d+)\.(\d+)\s+(.*)$/);
    if (cabeca) {
      atual = {
        numero: `${cabeca[1]}.${cabeca[2]}`,
        seccao: [Number(cabeca[1]), Number(cabeca[2])],
        titulo: cabeca[3].trim(),
        afecta: null,
        textos: null,
        semAlteracao: null,
        agenda: null,
      };
      entradas.push(atual);
      continue;
    }
    if (!atual) continue;
    const afecta = linha.match(/^\*\*Afecta:\*\*\s*(.+?)\s*$/);
    if (afecta && atual.afecta === null) {
      atual.afecta = afecta[1].split('·').map((x) => x.trim()).filter(Boolean);
      continue;
    }
    const textos = linha.match(/^\*\*Texto:\*\*\s*(.+?)\s*$/);
    if (textos && atual.textos === null) {
      atual.textos = {};
      for (const par of textos[1].split('·')) {
        const m = par.trim().match(/^([a-z]+)\s+([0-9a-f]{12})$/);
        if (m) atual.textos[m[1]] = m[2];
        else atual.textos[`?${par.trim()}`] = null;
      }
      continue;
    }
    const sem = linha.match(/^\*\*Sem alteração:\*\*\s*(.*?)\s*$/);
    if (sem && atual.semAlteracao === null) {
      atual.semAlteracao = sem[1];
      continue;
    }
    const ag = linha.match(/^\*\*Agenda:\*\*\s*(.+?)\s*$/);
    if (ag && atual.agenda === null) {
      atual.agenda = ag[1]
        .split('·')
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => {
          const m = x.match(/^(\S+)\s+(\d{4}-\d{2}-\d{2})$/);
          return m ? { item: m[1], data: m[2] } : { cru: x };
        });
      continue;
    }
  }
  return entradas;
}

function confereAmarra() {
  const erros = [];
  const ficheiro = path.join(RAIZ, 'DECISIONS.md');
  if (!fs.existsSync(ficheiro)) return { erros: ['não há DECISIONS.md'], conferidas: 0 };

  const entradas = entradasDasDecisoes(fs.readFileSync(ficheiro, 'utf8')).filter(
    (e) => e.seccao[0] === PRIMEIRA_AMARRADA[0] && comparaSeccao(e.seccao, PRIMEIRA_AMARRADA) >= 0,
  );

  /* O histórico da agenda, para conferir a entrada que uma decisão cita. */
  let historico = new Map();
  const fAgenda = path.join(RAIZ, 'src', 'data', 'agenda.json');
  if (fs.existsSync(fAgenda)) {
    try {
      const cru = JSON.parse(fs.readFileSync(fAgenda, 'utf8'));
      historico = new Map(
        (cru.itens ?? []).map((i) => [i.id, new Set((i.historico ?? []).map((h) => h.data))]),
      );
    } catch {
      /* um registo partido é problema do check:cruzamento, não deste */
    }
  }

  const ultimaQueNomeia = {};

  for (const e of entradas) {
    const onde = `§${e.numero}`;
    if (e.afecta === null) {
      erros.push(
        `${onde} não declara **Afecta:**. Toda a entrada a partir da §1.38 diz o que governa ` +
          `(sobre · metodo · agenda · nenhum). Uma mudança de rumo não sai em silêncio.`,
      );
      continue;
    }
    for (const nome of e.afecta) {
      if (!NOMES_ACEITES.has(nome)) {
        erros.push(`${onde}: **Afecta:** nomeia "${nome}", que não é um dos quatro.`);
      }
    }
    if (e.afecta.includes('nenhum') && e.afecta.length > 1) {
      erros.push(`${onde}: **Afecta: nenhum** com outros nomes ao lado. Ou governa, ou não governa.`);
    }

    const nomeados = e.afecta.filter((n) => n in TEXTOS);
    if (nomeados.length && !e.textos) {
      erros.push(
        `${onde} nomeia ${nomeados.join(' · ')} e não traz **Texto:** com o resumo de cada um ` +
          `tal como o ficheiro estava quando a entrada foi escrita.`,
      );
    }
    if (e.textos) {
      for (const nome of Object.keys(e.textos)) {
        if (!(nome in TEXTOS)) {
          erros.push(`${onde}: **Texto:** traz "${nome.replace(/^\?/, '')}", que não é um texto governado.`);
        } else if (!nomeados.includes(nome)) {
          erros.push(`${onde}: **Texto:** carimba "${nome}" e o **Afecta:** não o nomeia.`);
        }
      }
      for (const nome of nomeados) {
        if (!(nome in e.textos)) erros.push(`${onde}: **Texto:** não traz o resumo de "${nome}".`);
      }
    }

    /**
     * O outro sentido da mesma regra, e faltava.
     *
     * A entrada dizia `Afecta: metodo`, carimbava o MESMO resumo da entrada
     * anterior, e não dizia `Sem alteração`. Lida à letra, é uma decisão que
     * declara governar um texto que não mexeu, sem dizer porquê: ou o texto
     * mudou e o carimbo está errado, ou não mudou e falta a frase que o
     * explica. As duas leituras são defeitos, e nenhuma era apanhada
     * (revisão cruzada, #3).
     */
    for (const nome of nomeados) {
      const anterior = ultimaQueNomeia[nome];
      if (!anterior || e.semAlteracao !== null) continue;
      if (!e.textos?.[nome] || !anterior.textos?.[nome]) continue;
      if (e.textos[nome] === anterior.textos[nome]) {
        erros.push(
          `${onde}: **Afecta:** nomeia "${nome}" e o resumo é o mesmo de §${anterior.numero} ` +
            `(${e.textos[nome]}), sem **Sem alteração:**.\n` +
            `        A decisão diz que afecta o texto e o texto não mudou; ou muda, ou diz porquê.`,
        );
      }
    }

    /* Sem alteração: o resumo tem de ser o mesmo da entrada anterior que
       nomeou aquele texto. Um «não mudou» com resumo novo é uma alteração. */
    if (e.semAlteracao !== null) {
      if (!e.semAlteracao.trim()) {
        erros.push(`${onde}: **Sem alteração:** sem motivo escrito. O motivo é a metade que conta.`);
      }
      for (const nome of nomeados) {
        const anterior = ultimaQueNomeia[nome];
        if (anterior && e.textos?.[nome] && anterior.textos?.[nome] &&
            e.textos[nome] !== anterior.textos[nome]) {
          erros.push(
            `${onde} diz **Sem alteração** de "${nome}" e o resumo mudou desde §${anterior.numero} ` +
              `(${anterior.textos[nome]} → ${e.textos[nome]}). Ou o texto mudou, ou o carimbo está errado.`,
          );
        }
      }
    }

    if (e.afecta.includes('agenda')) {
      if (!e.agenda?.length) {
        erros.push(
          `${onde} nomeia a agenda e não traz **Agenda:** <id do item> <data do histórico>. ` +
            `Uma mudança de rumo na agenda tem uma entrada no histórico que a regista, ou não aconteceu.`,
        );
      } else {
        for (const cit of e.agenda) {
          if (cit.cru) {
            erros.push(`${onde}: **Agenda:** "${cit.cru}" não tem a forma "<id> AAAA-MM-DD".`);
            continue;
          }
          const datas = historico.get(cit.item);
          if (!datas) {
            erros.push(`${onde}: **Agenda:** cita o item "${cit.item}", que não está em src/data/agenda.json.`);
          } else if (!datas.has(cit.data)) {
            erros.push(
              `${onde}: **Agenda:** cita "${cit.item} ${cit.data}" e o histórico desse item não tem ` +
                `essa data (tem ${[...datas].join(', ')}).`,
            );
          }
        }
      }
    }

    for (const nome of nomeados) ultimaQueNomeia[nome] = e;
  }

  /* A conferência que fecha o círculo: o texto de hoje contra a última decisão
     que o governa. */
  for (const [nome, ficheiroDoTexto] of Object.entries(TEXTOS)) {
    const agora = resumoDoTexto(ficheiroDoTexto);
    const ultima = ultimaQueNomeia[nome];
    if (!ultima) {
      erros.push(
        `nenhuma entrada a partir da §1.38 nomeia "${nome}". O texto está no ar e não há decisão ` +
          `registada que o governe.`,
      );
      continue;
    }
    if (ultima.textos?.[nome] !== agora) {
      erros.push(
        `"${nome}": o texto mudou depois da última decisão que o governa, ou a decisão foi ` +
          `registada contra outro texto.\n` +
          `        §${ultima.numero} carimba ${ultima.textos?.[nome] ?? '(nada)'}\n` +
          `        ${path.relative(RAIZ, ficheiroDoTexto)} está hoje em ${agora}\n` +
          `        Escreva a entrada que regista a mudança, com o resumo de hoje.`,
      );
    }
  }

  return { erros, conferidas: entradas.length };
}

/* ===========================================================================
 * A MESMA AMARRA, DO LADO DA CONSTITUIÇÃO — uma citação não envelhece calada
 * ===========================================================================
 *
 * Bloco T, T4, e o buraco que a fecha está registado na §4.1: a §5 da
 * `IDENTIDADE.md` citou durante dois blocos uma frase do Método que o bloco V
 * tinha apagado, e **nenhuma conferência lê a constituição**. A citação foi
 * corrigida na §1.46; o buraco não. Toda a citação da constituição pode voltar
 * a envelhecer no dia seguinte a um bloco tocar num texto governado.
 *
 * Não se abre um portão novo para isto (moratória de 2026-08-15): a amarra
 * acima já lê ficheiros governados e já corre dentro do `ledger:check`. Ganha
 * esta segunda metade, com a mesma disciplina.
 *
 * A CONVENÇÃO, escrita na `IDENTIDADE.md` §8 e usada por ela: uma frase de um
 * texto governado citada na constituição vai entre «…» e traz o nome do
 * ficheiro logo a seguir, entre parênteses e em código: (`metodo`), (`sobre`).
 * São os mesmos nomes curtos do `**Afecta:**`, e não um segundo vocabulário.
 *
 * O QUE ISTO CONFERE, e são três coisas:
 *
 *   1. uma citação marcada tem de existir, palavra por palavra, no texto que
 *      nomeia (comparada com os espaços normalizados, porque o markdown parte
 *      as linhas onde calha e o ficheiro governado não);
 *   2. uma citação **não** marcada que exista num texto governado é recusada:
 *      cite-se com a marca. É isto que apanha a omissão no dia em que ela é
 *      escrita, que é o único dia em que a citação ainda está certa;
 *   3. uma marca que não vem a seguir a uma citação não nomeia nada.
 *
 * O LIMITE, e é honesto dizê-lo: uma frase que nasça já diferente do texto
 * governado, e sem marca, não é apanhada por nada. A marca é o que a prende, e
 * a marca é de quem escreve. O que isto fecha é o envelhecimento — a citação
 * que estava certa e deixou de estar —, que é a classe de defeito que
 * aconteceu.
 */

/** O ficheiro que a regra governa deste lado. */
const CONSTITUICAO = path.join(RAIZ, 'IDENTIDADE.md');

/** Quantos caracteres fazem de uma citação uma frase, e não um termo entre aspas. */
const CITACAO_MINIMA = 40;

/** Espaços normalizados dos dois lados: o markdown parte linhas, o texto governado não. */
function achata(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

/**
 * Todas as cadeias de um texto governado, achatadas.
 *
 * Lidas do MÓDULO e não do ficheiro: é o módulo que a página rende, e é ele o
 * texto. Uma citação bate quando é um pedaço de uma destas cadeias — uma regra
 * inteira, ou a frase de dentro dela que a constituição escolheu citar.
 *
 * O `FECHO` entra aqui pela I56, e é a MESMA conferência a alcançar mais texto e
 * não um portão novo (moratória de 2026-08-15). A entrada de fecho do Método —
 * «A cor» e «A letra», as duas frases que a direção aprovou a 20.08.2026 — é
 * texto governado exactamente como as dez regras, e enquanto esta função não a
 * lia a amarra recusava uma citação dela por ela existir: dizia «essa frase não
 * existe em src/data/metodo.mjs» com a frase a estar lá, e `grep -c` a dar 1. O
 * objeto entra inteiro e nas duas línguas, pelo mesmo `anda()` que já percorre
 * os outros três: quem acrescentar uma entrada ao fecho não tem de tocar aqui.
 */
function cadeiasDoTexto(nome) {
  const out = [];
  const anda = (v) => {
    if (typeof v === 'string') out.push(achata(v));
    else if (Array.isArray(v)) v.forEach(anda);
    else if (v && typeof v === 'object') Object.values(v).forEach(anda);
  };
  if (nome === 'metodo') anda([REGRAS, ABERTURA, LEITURA_BREVE, FECHO]);
  else if (nome === 'sobre') anda(SOBRE);
  return out;
}

function confereCitacoes() {
  const erros = [];
  if (!fs.existsSync(CONSTITUICAO)) {
    return { erros: ['não há IDENTIDADE.md'], marcadas: 0, citacoes: 0 };
  }
  const texto = fs.readFileSync(CONSTITUICAO, 'utf8');

  /* Por parágrafo, e achatado: uma citação da constituição atravessa linhas. */
  const paragrafos = texto.split(/\n\s*\n/);
  const CITACAO = /«([^»]*)»(\*{0,2}\s*\(`?([a-z]+)`?\))?/g;

  const cadeias = {};
  for (const nome of Object.keys(TEXTOS)) cadeias[nome] = cadeiasDoTexto(nome);

  let marcadas = 0;
  let citacoes = 0;

  for (const p of paragrafos) {
    const linha = achata(p);
    let m;
    CITACAO.lastIndex = 0;
    while ((m = CITACAO.exec(linha))) {
      const frase = achata(m[1]);
      const nome = m[3] ?? null;
      citacoes++;

      if (nome) {
        marcadas++;
        if (!(nome in TEXTOS)) {
          erros.push(
            `IDENTIDADE.md: a citação «${frase.slice(0, 60)}…» está marcada "(${nome})", que não é ` +
              `um texto governado. Os nomes são: ${Object.keys(TEXTOS).join(', ')}.`,
          );
          continue;
        }
        if (!cadeias[nome].some((c) => c.includes(frase))) {
          erros.push(
            `IDENTIDADE.md cita, como sendo do "${nome}":\n` +
              `        «${frase}»\n` +
              `        e essa frase não existe em ${path.relative(RAIZ, TEXTOS[nome])}.\n` +
              `        Ou o texto governado mudou e a citação ficou para trás, ou a citação nunca ` +
              `foi essa. A constituição cita palavra por palavra, ou não cita.`,
          );
        }
        continue;
      }

      /* Sem marca: só é defeito se a frase estiver mesmo num texto governado. */
      if (frase.length < CITACAO_MINIMA) continue;
      for (const [n, lista] of Object.entries(cadeias)) {
        if (lista.some((c) => c.includes(frase))) {
          erros.push(
            `IDENTIDADE.md cita «${frase.slice(0, 70)}…», que é uma frase de "${n}", e não a marca ` +
              `como tal.\n` +
              `        Escreva (\`${n}\`) a seguir ao fecho das aspas (IDENTIDADE.md §8). Sem a ` +
              `marca, a citação não é conferida, e envelhece no dia em que o texto mudar.`,
          );
          break;
        }
      }
    }
  }

  /* Uma marca que não vem a seguir a uma citação não nomeia nada. */
  const MARCA_SOLTA = /(^|[^»*\s])\s*\(`(metodo|sobre)`\)/g;
  let s;
  MARCA_SOLTA.lastIndex = 0;
  const inteiro = achata(texto);
  while ((s = MARCA_SOLTA.exec(inteiro))) {
    erros.push(
      `IDENTIDADE.md: a marca (\`${s[2]}\`) não vem a seguir a uma citação entre «…». ` +
        `A marca diz de que texto governado é a frase citada antes dela; sozinha não nomeia nada.`,
    );
  }

  return { erros, marcadas, citacoes };
}

const amarra = confereAmarra();
const citacoes = confereCitacoes();
console.log('');
console.log(
  cinza(
    `  amarra das decisões · ${amarra.conferidas} entrada(s) a partir da §1.38 · ` +
      `${Object.keys(TEXTOS).length} texto(s) governado(s) · ` +
      `${citacoes.marcadas} citação(ões) da constituição conferida(s), de ${citacoes.citacoes} entre «…»`,
  ),
);
const errosDaAmarra = [...amarra.erros, ...citacoes.erros];
if (errosDaAmarra.length) {
  console.log('');
  console.error(vermelho(`  A AMARRA DAS DECISÕES NÃO FECHA · ${errosDaAmarra.length} erro(s):`));
  console.error('');
  for (const e of errosDaAmarra) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  console.error('  Uma mudança de rumo não sai em silêncio (direção, 2026-08-15).');
  console.error('');
  process.exit(1);
}
console.log(
  '  ' +
    verde('✓') +
    ' cada texto no ar tem uma decisão registada que o governa, e cada frase que a constituição lhe cita está lá.',
);

/* ===========================================================================
 * OS BYTES DE CONTROLO DOS FICHEIROS QUE ESTA RÉGUA LÊ (I37)
 * ===========================================================================
 *
 * A I37 esteve aberta oito dias por uma razão pequena e cara: `src/lib/ledger.mjs`
 * levava um byte NUL escrito como carácter dentro de uma cadeia
 * (`[…].join(<o byte>)`), e um ficheiro com um byte NUL é, para o `grep`, um
 * ficheiro binário. `grep -n "eDerivada" src/lib/ledger.mjs` não imprimia nada e
 * `grep -an` imprimia duas linhas: quem procurasse uma coisa naquele ficheiro
 * levava um zero por resposta, e um zero que vem de um ficheiro ilegível tem a
 * mesma cara de um zero que vem de uma ausência.
 *
 * O byte saiu a 29.08.2026. Isto é o que impede que volte, e não só ali: os
 * ficheiros que esta régua já lê são os que ela sabe nomear, e um byte de
 * controlo em qualquer deles fecha a construção com o deslocamento onde ele
 * está.
 *
 * O QUE CONTA COMO BYTE DE CONTROLO: tudo abaixo de 0x20 que não seja
 * tabulação, mudança de linha ou retorno, mais o 0x7F. O NUL não é o único byte
 * que faz isto, e uma régua escrita só contra ele fechava a porta que se abriu
 * e deixava as outras abertas.
 *
 * QUEM ESCREVE UM NUL DE PROPÓSITO escreve a sua sequência de escape, que é a
 * mesma cadeia para o motor de JavaScript e um ficheiro de texto para todas as
 * ferramentas que o leem. Foi essa a correção, e o resto do ficheiro ficou
 * igual byte a byte.
 */

/** Os ficheiros desta régua que não podem levar bytes de controlo. */
const SEM_BYTES_DE_CONTROLO = {
  'src/lib/ledger.mjs': path.join(RAIZ, 'src', 'lib', 'ledger.mjs'),
  ...Object.fromEntries(
    Object.values(TEXTOS).map((f) => [path.relative(RAIZ, f).split(path.sep).join('/'), f]),
  ),
};

/**
 * Os deslocamentos dos bytes de controlo de um bloco de bytes.
 *
 * Uma função sobre BYTES, e não sobre uma cadeia: a leitura em UTF-8 devolve o
 * caractere de substituição onde os bytes não formam um caractere, e a régua
 * deixava de ver o que lá está.
 */
function bytesDeControlo(bytes) {
  const achados = [];
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if ((b < 0x20 && b !== 0x09 && b !== 0x0a && b !== 0x0d) || b === 0x7f) {
      achados.push({ deslocamento: i, byte: b });
    }
  }
  return achados;
}

/** A linha de um deslocamento, contada como o `grep -n` a conta. */
function linhaDoDeslocamento(bytes, deslocamento) {
  let n = 1;
  for (let i = 0; i < deslocamento; i++) if (bytes[i] === 0x0a) n++;
  return n;
}

/* A PLANTA, ANTES DE QUALQUER ZERO. O detetor vê um vermelho de cada uma das
   duas espécies — o NUL que a I37 nomeia, escrito como a linha o tinha, e um
   byte de controlo que não é o NUL — e um verde num bloco com tabulação,
   mudança de linha e retorno, que são os três que passam. Sem isto, «nenhum
   byte de controlo» é uma frase que um detetor partido diz com a mesma
   facilidade que um detetor inteiro.

   As plantas compõem-se por código do byte e não se escrevem à mão: escrever
   um byte de controlo dentro deste ficheiro era plantar nele o defeito que ele
   recusa, e a régua fechava-se a si própria na primeira corrida. */
const errosDosBytes = [];
{
  const NUL = String.fromCharCode(0x00);
  const CAMPAINHA = String.fromCharCode(0x07);
  const plantas = [
    {
      nome: 'o NUL da I37, escrito como carácter dentro de uma cadeia',
      bytes: Buffer.from("const chave = [v.date, v.path].join('" + NUL + "');\n", 'utf8'),
      espera: 1,
    },
    {
      nome: 'um byte de controlo que não é o NUL',
      bytes: Buffer.from('uma linha' + CAMPAINHA + 'com campainha\n', 'utf8'),
      espera: 1,
    },
    {
      nome: 'texto com tabulação, mudança de linha e retorno',
      bytes: Buffer.from('uma\tlinha\r\noutra linha\n', 'utf8'),
      espera: 0,
    },
  ];
  for (const p of plantas) {
    const achado = bytesDeControlo(p.bytes);
    if (achado.length !== p.espera) {
      errosDosBytes.push(
        `a prova do detetor de bytes de controlo falhou no caso "${p.nome}": ` +
          `esperavam-se ${p.espera} e encontraram-se ${achado.length}.\n` +
          `        O detetor mudou de maneira que a contagem de baixo deixou de valer.`,
      );
    }
  }
}

let ficheirosLimpos = 0;
for (const [rel, ficheiro] of Object.entries(SEM_BYTES_DE_CONTROLO)) {
  let bytes;
  try {
    bytes = fs.readFileSync(ficheiro);
  } catch (err) {
    errosDosBytes.push(`${rel}: não consegui ler o ficheiro (${err.message}).`);
    continue;
  }
  const achados = bytesDeControlo(bytes);
  if (!achados.length) {
    ficheirosLimpos++;
    continue;
  }
  for (const a of achados.slice(0, 5)) {
    errosDosBytes.push(
      `${rel}: byte de controlo 0x${a.byte.toString(16).padStart(2, '0')} no deslocamento ` +
        `${a.deslocamento}, linha ${linhaDoDeslocamento(bytes, a.deslocamento)}.\n` +
        `        Um ficheiro com um byte de controlo é um ficheiro binário para o \`grep\`, e ` +
        `quem o procurar leva um zero por resposta, com a cara de uma ausência (I37).\n` +
        `        Um NUL de propósito escreve-se pela sua sequência de escape.`,
    );
  }
}

console.log('');
console.log(
  cinza(
    `  bytes de controlo · ${ficheirosLimpos} de ${Object.keys(SEM_BYTES_DE_CONTROLO).length} ` +
      `ficheiro(s) sem nenhum · 3 planta(s) vista(s)`,
  ),
);
if (errosDosBytes.length) {
  console.log('');
  console.error(
    vermelho(`  UM FICHEIRO DESTA RÉGUA NÃO É TEXTO · ${errosDosBytes.length} erro(s):`),
  );
  console.error('');
  for (const e of errosDosBytes) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  process.exit(1);
}
console.log(
  '  ' + verde('✓') + ' os ficheiros desta régua leem-se como texto, do primeiro byte ao último.',
);
console.log('');
