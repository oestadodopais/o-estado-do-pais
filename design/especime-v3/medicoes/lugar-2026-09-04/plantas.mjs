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
import { parse } from 'node-html-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const DIST = path.join(RAIZ, 'dist');
const REGUA = path.join(RAIZ, 'scripts', 'check-lugar.mjs');

/**
 * ---------------------------------------------------------------------------
 * A PÁGINA DA PLANTA DA L1 ESCOLHE-SE, E NÃO SE ESCREVE À MÃO (14.09.2026)
 * ---------------------------------------------------------------------------
 * A primeira corrida destas plantas (14.09.2026) deu «NÃO MORDEU» na planta da
 * L1, com 2 170 → 2 170, e a culpa era da planta e não da régua: a L1 conta
 * PÁGINAS com dois destinos iguais, a planta estragava
 * `livro-razao/divida-publica-2025`, e essa página já era uma das 1 422 da
 * família `linha` que contam. Um segundo destino repetido numa página que já
 * conta não muda a contagem, e a planta não prova nada.
 *
 * A planta passa a escolher uma página de linha que a régua NÃO conte: a
 * primeira, por ordem alfabética, sem nenhum destino repetido fora do cabeçalho
 * e do rodapé, e com os dois sítios de que a troca precisa. A conta é a mesma da
 * régua, escrita aqui outra vez de propósito: se ela mudar de definição, esta
 * escolha deixa de encontrar página nenhuma e o guião di-lo.
 *
 * @returns {string|null} o caminho relativo em `dist/`, ou `null`
 */
function paginaDeLinhaSemRepetidos() {
  const raizDoLivro = path.join(DIST, 'livro-razao');
  if (!fs.existsSync(raizDoLivro)) return null;
  for (const nome of fs.readdirSync(raizDoLivro).sort()) {
    const rel = path.join('livro-razao', nome, 'index.html');
    const ficheiro = path.join(DIST, rel);
    if (!fs.existsSync(ficheiro)) continue;
    const cru = fs.readFileSync(ficheiro, 'utf8');
    if (!/<p class="linha-pedido">[\s\S]*?<a class="ligacao-externa" href="[^"]+"/.test(cru)) continue;
    if (!cru.includes('<dl class="linha-verificacoes">')) continue;
    const raiz = parse(cru);
    const corpo = raiz.querySelector('body');
    if (!corpo) continue;
    const mobilia = new Set();
    for (const marco of [raiz.querySelector('header'), raiz.querySelector('footer')]) {
      if (!marco) continue;
      mobilia.add(marco);
      for (const d of marco.querySelectorAll('*')) mobilia.add(d);
    }
    const destinos = new Map();
    for (const a of corpo.querySelectorAll('a[href]')) {
      if (mobilia.has(a)) continue;
      const href = (a.getAttribute('href') ?? '').split('#')[0];
      if (!href || href.startsWith('mailto:')) continue;
      destinos.set(href, (destinos.get(href) ?? 0) + 1);
    }
    if ([...destinos.values()].some((n) => n > 1)) continue;
    return rel;
  }
  return null;
}
const PAGINA_DA_L1 = paginaDeLinhaSemRepetidos();

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
      /* AS PORTAS DOS 308, E NÃO AS DA PRIMEIRA UNIDADE (14.09.2026). A troca
         copiava `<ul class="concelhos-lista">…</ul>` com um regex não-guloso, e
         o índice tem VINTE E NOVE listas com esse nome, uma por unidade da
         Carta: o que ela plantava eram 19 portas, e o teto da régua são 30. A
         planta dizia «NÃO MORDEU» e a régua estava certa. Agora planta-se a
         lista inteira: todas as portas de concelho do índice, que são 308. */
      const portas = [
        ...new Set(tudo('municipios/index.html').match(/href="\/municipios\/[a-z0-9-]+"/g) ?? []),
      ];
      if (portas.length <= 30) return null;
      const i = s.indexOf('</main>');
      if (i < 0) return null;
      const itens = portas.map((h) => `<li><a ${h}>x</a></li>`).join('');
      return `${s.slice(0, i)}<details open><summary>x</summary><ul>${itens}</ul></details>${s.slice(i)}`;
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
  /* ------------------------------------------------------------------------
     AS QUATRO GUARDAS NOVAS DA CÉLULA 8.4 (14.09.2026)
     ------------------------------------------------------------------------
     A leitura do Codex de 14.09.2026, achado 8: a régua contava as origens
     DECLARADAS e procurava cada uma, e por isso não via as que a página
     rendesse a mais nem uma declaração sem origem nenhuma; e comparava a data de
     leitura como uma subcadeia do bloco inteiro, o que a satisfazia com a data
     escrita em qualquer sítio. E o achado 28: nada media o marcador dentro de
     uma definição. Cada guarda nova entra aqui com o seu positivo conhecido,
     plantado na forma e não na marca. */
  {
    nome: 'um bloco de origem tirado da página (a régua contava as declaradas e não as rendidas)',
    medida: 'd84',
    ficheiro: 'uniao-europeia/index.html',
    troca: (s) => {
      /* A PRIMEIRA ORIGEM DE UMA DEFINIÇÃO COM DUAS, e não uma qualquer: tirar
         a única origem de uma definição faz a régua morder pela guarda velha
         («a origem não se rende na página»), e isso é a guarda antiga a provar-se
         outra vez. A da posição de investimento internacional tem duas desde
         hoje, e tirar uma delas deixa a definição com origem e com a conta
         errada, que é exactamente o que só a guarda nova apanha. */
      const i = s.indexOf('<div class="def-origem" data-def-origem="pdm-posicao-de-investimento">');
      if (i < 0) return null;
      const j = s.indexOf('</details></div>', i);
      if (j < 0) return null;
      return s.slice(0, i) + s.slice(j + '</details></div>'.length);
    },
  },
  {
    nome: 'um bloco de origem A MAIS na página (a régua ignorava os que sobravam)',
    medida: 'd84',
    ficheiro: 'uniao-europeia/index.html',
    troca: (s) => {
      const i = s.indexOf('<div class="def-origem" data-def-origem="pdm-divida-publica">');
      if (i < 0) return null;
      const j = s.indexOf('</details></div>', i);
      if (j < 0) return null;
      const bloco = s.slice(i, j + '</details></div>'.length);
      /* A cópia leva outra chave, para que a régua a veja como uma origem que a
         declaração não pediu, e não como a mesma outra vez. */
      const copia = bloco.replace(
        'data-def-origem="pdm-divida-publica"',
        'data-def-origem="uma-origem-que-ninguem-declarou"',
      );
      return s.slice(0, j + '</details></div>'.length) + copia + s.slice(j + '</details></div>'.length);
    },
  },
  {
    nome: 'a data de leitura fora do campo dela, com o texto na mesma (a régua procurava-a no bloco todo)',
    medida: 'd84',
    ficheiro: 'uniao-europeia/index.html',
    troca: (s) => {
      /* A DATA FICA À VISTA, NO MESMO BLOCO, e é só o campo que desaparece: uma
         régua que a procure como subcadeia continua a encontrá-la, e uma que a
         compare no campo dela não a encontra. É a diferença entre as duas que
         esta planta mede. */
      const m = s.match(/ data-def-lido="([^"]+)"/);
      if (!m) return null;
      return s.replace(m[0], ' data-um-atributo-qualquer="' + m[1] + '"');
    },
  },
  {
    nome: 'o marcador tirado de dentro de uma definição (o texto declarado di-lo e a página não)',
    medida: 'd84',
    ficheiro: 'uniao-europeia/index.html',
    troca: (s) => {
      const alvo = '<a class="marcador" href="/a-verificar" lang="pt-PT">[a verificar]</a>';
      if (!s.includes(alvo)) return null;
      return s.replace(alvo, '');
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
    ficheiro: PAGINA_DA_L1 ?? 'livro-razao/divida-publica-2025/index.html',
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
