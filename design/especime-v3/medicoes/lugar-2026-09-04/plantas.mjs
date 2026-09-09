#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * AS PLANTAS DA L9, POR FORMA E NÃO POR MARCADOR (F1.10, segunda passagem,
 * 09.09.2026)
 * ---------------------------------------------------------------------------
 *
 * A leitura a frio de 09.09.2026 escreveu, no Major 12, a crítica que este
 * ficheiro existe para responder: «as plantas relatadas alteram os mesmos
 * marcadores e por isso não provam a deteção de conteúdo equivalente com outra
 * marcação». Uma planta que apaga a marca que a régua procura prova que a régua
 * sabe ler a sua própria marca, e mais nada.
 *
 * ESTE GUIÃO PLANTA A FORMA. Cada estrago abaixo põe no `dist/` conteúdo que o
 * §0 do brief proíbe, escrito de maneira DIFERENTE daquela que a régua conhecia:
 * uma lista dos 308 dentro de um `<details open>`, uma régua da convergência sem
 * o seu `data-instrumento`, um selo sem a etiqueta declarada, um título de
 * estudo a voltar à capa, uma definição sem o excerto que a prova, e a palavra
 * proibida no `<head>`.
 *
 * COMO CORRE. Para cada planta: guarda o ficheiro, aplica o estrago, corre
 * `scripts/check-lugar.mjs`, lê a medida que ela deve morder, repõe o ficheiro e
 * confere byte a byte que o repôs. Imprime a tabela e sai com 1 se alguma não
 * morder ou algum ficheiro não voltar ao que era.
 *
 *   node design/especime-v3/medicoes/lugar-2026-09-04/plantas.mjs
 *
 * NÃO CORRE NO `verify`: mexe no `dist/` e demora o tempo de uma varredura por
 * planta. Corre-se à mão, e o resultado escreve-se no relatório do bloco.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const DIST = path.join(RAIZ, 'dist');
const REGUA = path.join(RAIZ, 'scripts', 'check-lugar.mjs');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

/** A medição de uma corrida da régua, lida da saída dela. */
function mede() {
  let saida = '';
  try {
    saida = execFileSync('node', [REGUA], { cwd: RAIZ, encoding: 'utf8' });
  } catch (e) {
    saida = String(e.stdout ?? '');
  }
  const numero = (rotulo) => {
    const linha = saida.split('\n').find((l) => l.includes(rotulo));
    if (!linha) return null;
    const m = linha.match(/\s(\d+)\s+\(teto/);
    return m ? Number(m[1]) : null;
  };
  return {
    l1: numero('L1 · páginas com dois destinos iguais'),
    l2a: numero('L2 · segundas listas dos concelhos'),
    l2b: numero('L2 · réguas da convergência'),
    l3: numero('L3 · palavras fora do vocabulário'),
    l6: numero('L6 · selos que não dizem o publicador'),
    d84: numero('8.4 · definições de painel fora da declaração'),
    d86: numero('§7.4 e 8.6 · estudos fora da forma única'),
  };
}

/**
 * As plantas. Cada uma diz o ficheiro, a medida que tem de subir, e a
 * transformação do texto. `troca` devolve `null` quando o alvo não está lá, e
 * isso é uma falha da planta e não da régua: uma planta que não morde por não
 * ter encontrado o sítio não prova nada, e o guião di-lo.
 */
const PLANTAS = [
  {
    nome: 'a lista dos 308 dentro de um <details ABERTO> (a isenção só vale fechada)',
    medida: 'l2a',
    ficheiro: 'regioes/alentejo/index.html',
    troca: (s, tudo) => {
      const lista = tudo('municipios/index.html').match(/<ul class="concelhos-lista">[\s\S]*?<\/ul>/);
      if (!lista) return null;
      const i = s.indexOf('</main>');
      if (i < 0) return null;
      return `${s.slice(0, i)}<details open><summary>x</summary>${lista[0]}</details>${s.slice(i)}`;
    },
  },
  {
    nome: 'a régua da convergência copiada SEM o seu data-instrumento (só a forma)',
    medida: 'l2b',
    ficheiro: 'regioes/alentejo/index.html',
    troca: (s, tudo) => {
      const fonte = tudo('regioes/index.html');
      const a = fonte.indexOf('<div class="instr instr-conv"');
      if (a < 0) return null;
      const b = fonte.indexOf('</section>', a);
      const bloco = fonte
        .slice(a, b)
        .replace(' data-instrumento="convergencia"', '')
        .replace('instr instr-conv', 'bloco-qualquer');
      const i = s.indexOf('</main>');
      if (i < 0) return null;
      return `${s.slice(0, i)}${bloco}${s.slice(i)}`;
    },
  },
  {
    nome: 'um selo SEM data-selo-etiqueta (a régua percorria só os que a tinham)',
    medida: 'l6',
    ficheiro: 'municipios/evora/index.html',
    troca: (s) => {
      const m = s.match(/ data-selo-etiqueta="[^"]*"/);
      if (!m) return null;
      return s.replace(m[0], '');
    },
  },
  {
    nome: 'o título de um estudo a voltar à capa (o gesto natural a parar outra vez)',
    medida: 'd86',
    ficheiro: 'estudos/index.html',
    troca: (s) => {
      const m = s.match(
        /<h2 class="arquivo-titulo"><a class="arquivo-porta" href="([^"]+)\/texto"/,
      );
      if (!m) return null;
      return s.replace(m[0], m[0].replace(`${m[1]}/texto`, m[1]));
    },
  },
  {
    nome: 'o excerto tirado de uma origem de definição (a citação sem a prova)',
    medida: 'd84',
    ficheiro: 'uniao-europeia/index.html',
    troca: (s) => {
      const m = s.match(/<blockquote class="def-excerto-texto"[^>]*>[\s\S]*?<\/blockquote>/);
      if (!m) return null;
      return s.replace(m[0], '');
    },
  },
  {
    nome: 'a palavra proibida na descrição pública do <head> (a L3 começava no <body>)',
    medida: 'l3',
    ficheiro: 'index.html',
    troca: (s) => {
      const m = s.match(/<meta name="description" content="([^"]*)"/);
      if (!m) return null;
      return s.replace(m[0], `<meta name="description" content="Os indicadores do país."`);
    },
  },
  {
    nome: 'a porta da conferência de volta ao endereço da própria linha (o padrão maior da L1)',
    medida: 'l1',
    ficheiro: 'livro-razao/divida-publica-2025/index.html',
    troca: (s) => {
      const m = s.match(/<p class="linha-pedido">[\s\S]*?<a class="ligacao-externa" href="([^"]+)"/);
      if (!m) return null;
      const i = s.indexOf('<dl class="linha-verificacoes">');
      if (i < 0) return null;
      const j = i + '<dl class="linha-verificacoes">'.length;
      return `${s.slice(0, j)}<dd><a class="ligacao-externa" href="${m[1]}">x</a></dd>${s.slice(j)}`;
    },
  },
];

const tudo = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');

console.log('a medir o estado limpo…');
const limpo = mede();
console.log(`  ${JSON.stringify(limpo)}`);

const linhas = [];
let mas = 0;
for (const planta of PLANTAS) {
  const alvo = path.join(DIST, planta.ficheiro);
  const antes = fs.readFileSync(alvo, 'utf8');
  const estragado = planta.troca(antes, tudo);
  if (estragado === null || estragado === antes) {
    linhas.push({ ...planta, estado: 'A PLANTA NÃO ENCONTROU O SÍTIO', de: null, para: null });
    mas++;
    continue;
  }
  fs.writeFileSync(alvo, estragado);
  const com = mede();
  fs.writeFileSync(alvo, antes);
  const reposto = fs.readFileSync(alvo, 'utf8') === antes;
  const de = limpo[planta.medida];
  const para = com[planta.medida];
  const mordeu = para !== null && de !== null && para > de;
  if (!mordeu || !reposto) mas++;
  linhas.push({
    ...planta,
    estado: mordeu ? (reposto ? 'mordeu' : 'MORDEU MAS NÃO REPÔS') : 'NÃO MORDEU',
    de,
    para,
  });
}

console.log('');
console.log('  as plantas da L9, por forma:');
for (const l of linhas) {
  console.log(
    `    ${l.estado.padEnd(26)} ${l.medida.padEnd(4)} ${String(l.de)} → ${String(l.para)}  ${l.nome}`,
  );
}
console.log('');
console.log(
  mas === 0
    ? `  ${linhas.length} de ${linhas.length} morderam, e todas repuseram byte a byte.`
    : `  ${mas} de ${linhas.length} falharam.`,
);
process.exit(mas === 0 ? 0 : 1);
