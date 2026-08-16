#!/usr/bin/env node
/**
 * Portão (b): o livro-razão está completo e a aritmética bate certo.
 *
 * Corre ANTES do astro build. Se falhar, não se constrói nada.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { validateLedger, allClaims, camposPorVerificar, POR_VERIFICAR } from '../src/lib/ledger.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

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
    ` ${stats.total} afirmações válidas · ${stats.derivadas} derivadas · ${stats.verificadas} com aritmética reavaliada no build`,
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

const amarra = confereAmarra();
console.log('');
console.log(
  cinza(
    `  amarra das decisões · ${amarra.conferidas} entrada(s) a partir da §1.38 · ` +
      `${Object.keys(TEXTOS).length} texto(s) governado(s)`,
  ),
);
if (amarra.erros.length) {
  console.log('');
  console.error(vermelho(`  A AMARRA DAS DECISÕES NÃO FECHA — ${amarra.erros.length} erro(s):`));
  console.error('');
  for (const e of amarra.erros) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  console.error('  Uma mudança de rumo não sai em silêncio (direção, 2026-08-15).');
  console.error('');
  process.exit(1);
}
console.log('  ' + verde('✓') + ' cada texto no ar tem uma decisão registada que o governa.');
