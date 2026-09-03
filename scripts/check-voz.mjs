#!/usr/bin/env node
/**
 * O PORTÃO DA VOZ · «o sítio a explicar-se» deixa de depender de um leitor.
 *
 * A Emenda 15 manda a autorreferência a zero fora do Método, do Sobre e do
 * recibo; a Emenda 18 acrescenta que «nada existe para mostrar diligência».
 * Até 26.08.2026 as duas regras eram medidas por uma régua que não fecha nada
 * (`scripts/medir-defeitos.mjs`) e conferidas por uma célula de matriz que corre
 * fora da construção (`tests/inicio/matriz.mjs`). Uma frase de autorreferência
 * DECLARADA numa página de concelho passava pelas duas peneiras: foi assim que
 * «É a lei que o define, não este sítio.» viveu em 616 páginas.
 *
 * Este passo entra na cadeia do `build` e do `verify`, e fecha a construção em
 * dez casos:
 *
 *   1. **o tripwire** · uma frase da casa com um marcador de
 *      `design/especime-v3/VOZ-MARCADORES.md` que não está declarada como
 *      autorreferência nem consta das exceções daquele ficheiro;
 *   2. **a contagem** · autorreferência acima de zero em qualquer rota medida;
 *   3. **o por classificar** · um bloco de texto de uma rota inventariada que
 *      não está no `INVENTARIO-FRASES.md`;
 *   4. **o ficheiro dos marcadores** · um marcador ou uma exceção sem razão
 *      escrita, ou um modo ou tipo que não existe;
 *   5. **o rasto da revisão** · um bloco declarado no inventário sem entrada em
 *      `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, ou uma entrada
 *      que nomeia um ficheiro que não existe;
 *   6. **o gatilho da regra** · uma emenda da voz em `direcao.md` com número
 *      acima do `lida-contra` da cabeça do inventário. A regra mudou e o
 *      inventário não foi relido contra ela: foi o que aconteceu com a Emenda 18
 *      de 25.08.2026, e é o que este passo impede que volte a acontecer em
 *      silêncio;
 *   7. **o estado de cada declaração** (I74, 27.08.2026) · uma linha sem estado,
 *      uma linha `retirada` sem razão escrita, uma linha `viva` que não se rende
 *      em rota nenhuma, ou uma linha `retirada` que voltou a render-se. É a rede
 *      que faltava nos dois sentidos: o inventário tinha 58 linhas declaradas
 *      que já não se rendiam em página nenhuma, e uma frase corrigida podia
 *      voltar em silêncio por continuar declarada;
 *   8. **o positivo conhecido das classes de rótulo** (29.08.2026) · uma classe
 *      de `CLASSES_DE_ROTULO` que não se renda em página nenhuma de `dist/`. A
 *      régua da voz passou a medir os rótulos que vivem num `<span>` por essa
 *      lista, e uma classe renomeada deixava-a cega com a contagem de «nada por
 *      classificar» a dizer zero;
 *   9. **o nome declarado** (29.08.2026) · um `data-nome` cuja fonte não é um dos
 *      ficheiros de dados declarados, ou cujo texto não é um nome desse ficheiro.
 *      A marca tira do inventário o nome de uma coisa que vem de um ficheiro de
 *      dados, e uma marca que dispensa um texto da declaração tem de trazer a sua
 *      própria verificação;
 *  10. **o arame da classe por provar, na primeira página** (F0.9, 03.09.2026) ·
 *      uma palavra de tendência, de comparação contra um valor que a página não
 *      tem, de valor de outro período ou de atribuição sem excerto, rendida em
 *      `/` ou em `/en/`. **É um tapa-buraco declarado**, e o `check:prosa` do
 *      F3.1 substitui-o: a saída certa é a frase tipada com os ids das linhas que
 *      a provam, e não uma lista de palavras proibidas. A secção sai inteira com
 *      a lista no dia em que o F3.1 entrar.
 *
 * A varredura não é feita aqui: é a da régua, corrida com `--json`, que é a
 * mesma que a matriz já usa. Duas implementações da mesma definição diriam a
 * mesma coisa por construção, e a régua é onde a definição está escrita.
 *
 * Uso:  node scripts/check-voz.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse, NodeType } from 'node-html-parser';

import { leInventario, FICHEIRO_DO_INVENTARIO } from './voz.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DA VOZ · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const saida = execFileSync(process.execPath, [path.join(RAIZ, 'scripts', 'medir-defeitos.mjs'), '--json'], {
  encoding: 'utf8',
  maxBuffer: 128 * 1024 * 1024,
});
const medicao = JSON.parse(saida);
const voz = medicao.voz;
const casa = medicao.frases_da_casa;
const rotas = Object.entries(casa.por_rota);

const erros = [];

/* 4 · o ficheiro dos marcadores */
for (const e of voz.erros) erros.push(`${voz.ficheiro}: ${e}`);

/* 8 · O POSITIVO CONHECIDO DAS CLASSES DE RÓTULO (29.08.2026).
 *
 * A régua da voz passou a medir os rótulos que vivem num `<span>`, e reconhece-os
 * por uma lista de classes declarada em `medir-defeitos.mjs`. Uma lista de
 * classes é uma dependência de uma folha de estilos, e uma folha de estilos muda:
 * o dia em que `.eyebrow` for renomeada, a régua fica cega para dezasseis vistas
 * e a contagem de «nada por classificar» continua a dizer zero, que é
 * exactamente o defeito que ela veio fechar.
 *
 * Por isso a régua conta, em cada construção, quantas vezes cada classe
 * declarada se rende em `dist/`, e um zero fecha a construção. É a regra 14 da
 * casa a correr a cada construção em vez de uma vez: um detector vê um positivo
 * conhecido antes de a sua contagem de zero valer alguma coisa. Uma classe que
 * saia do sítio de propósito sai também da lista, com a razão escrita ao lado
 * dela, e isso é uma linha de código e não um silêncio. */
for (const [classe, n] of Object.entries(voz.rotulos_em_span ?? {})) {
  if (n > 0) continue;
  erros.push(
    `a classe de rótulo «${classe}» não se rende em página nenhuma de dist/. ` +
      `A régua da voz mede os rótulos em «span» por esta lista, e uma classe a zero ` +
      `deixa-a cega em silêncio: ou a classe mudou de nome e a lista de ` +
      `CLASSES_DE_ROTULO tem de a acompanhar, ou o sítio deixou de a usar e ela sai ` +
      `da lista com a razão escrita.`,
  );
}
if (!voz.rotulos_em_span) {
  erros.push(
    `a régua não devolveu a contagem das classes de rótulo, e é o positivo conhecido ` +
      `de que a medida dos rótulos em «span» depende.`,
  );
}

/* 9 · O NOME DECLARADO É CONFERIDO CONTRA O FICHEIRO DE ONDE DIZ VIR (29.08.2026).
 *
 * `data-nome` tira do inventário o nome de uma coisa que vem de um ficheiro de
 * dados (hoje o nome de uma área de governo, dezoito linhas de tabela que eram a
 * lista dos ministérios escrita outra vez). Uma marca que dispensa um texto da
 * declaração tem de trazer a sua própria verificação, ou troca uma lista por um
 * buraco: `data-lugar`, que é a marca irmã, exclui e não confere, e por isso um
 * nome trocado sai do inventário sem que ninguém o veja.
 *
 * Fecham a construção duas coisas: um `data-nome` cuja fonte não é um dos
 * ficheiros de dados declarados, e um `data-nome` cujo texto não é, carácter a
 * carácter, um nome daquele ficheiro. */
{
  const nd = voz.nomes_declarados ?? null;
  if (!nd) {
    erros.push(
      `a régua não devolveu a conferência de «data-nome», e é ela que sustenta a marca: ` +
        `sem ela, a marca tira texto do inventário sem provar que o texto é o do ficheiro.`,
    );
  } else {
    for (const x of nd.fora_da_fonte) {
      erros.push(
        `${x.caminho}: «data-nome="${x.fonte}"» sobre «${x.texto.slice(0, 80)}» · ${x.porque}. ` +
          `Só o nome de uma entrada de um ficheiro de dados com fonte declarada pode levar esta marca.`,
      );
    }
  }
}

/* 1 · o tripwire */
for (const a of voz.achados) {
  erros.push(
    `frase com marcador da voz e sem declaração de autorreferência\n` +
      `      marcador(es): ${a.marcadores.join(' · ')}\n` +
      `      rota: ${a.rota}${a.rotas > 1 ? ` (e mais ${a.rotas - 1})` : ''}\n` +
      `      classe declarada: ${a.classe ?? '(por classificar)'}\n` +
      `      «${a.texto}»`,
  );
}

/* 2 · a contagem.
 *
 * A QUARTA CLASSE NÃO ENFRAQUECE ESTA REGRA (segunda passagem, 01.09.2026). O
 * inventário ganhou `divulgacao` para o rótulo de IA e para a ficha do artigo
 * 15.º, que estão na página porque a lei os põe lá; `autorreferencia` continua a
 * ir a ZERO em todas as rotas medidas, e é esta linha que o impõe. A diferença
 * entre as duas classes é a que a Emenda 15 escreve: a autorreferência existe
 * para mostrar diligência, e a divulgação existe porque alguém tem de saber quem
 * responde. Uma frase de divulgação que explique porque se deve confiar na casa
 * é autorreferência com outro nome, e não passa por aqui só por mudar de
 * coluna. */
for (const [rota, r] of rotas) {
  if (r.por_classe.autorreferencia > 0) {
    erros.push(
      `autorreferência ${r.por_classe.autorreferencia} na rota ${rota} (a Emenda 15 exige zero em todas as rotas medidas)`,
    );
  }
}

/* 3 · o por classificar */
for (const [rota, r] of rotas) {
  for (const t of r.nao_classificados) {
    erros.push(`bloco por classificar em ${rota}: «${t}»`);
  }
}

if (!casa.inventario_existe) erros.push(`não existe ${casa.inventario}`);

/* 7 · o estado de cada declaração (I74).
 *
 * Os dois sentidos, e nenhum deles é o mesmo defeito visto duas vezes. Uma linha
 * `viva` que não se rende é uma lista a mentir sobre o sítio: ou a frase mudou e
 * a linha ficou para trás, ou a rota saiu. Uma linha `retirada` que se rende é
 * uma frase que a casa tirou e que voltou, e voltar em silêncio era exactamente
 * o que a I74 escreveu que podia acontecer.
 *
 * O QUE SE MEDE É A UNIÃO DAS DUAS VARREDURAS, e é a régua que a calcula: a da
 * medida 8 e a da medida 9. Para uma proibição, a peneira mais larga é a certa.
 */
{
  const d = casa.declaracoes ?? null;
  if (!d) {
    erros.push(
      `a régua não devolveu o estado das declarações do inventário, e é o que a I74 fecha.`,
    );
  } else {
    for (const l of d.sem_estado) {
      erros.push(
        `${casa.inventario}:${l.n}: a linha não diz o seu estado` +
          `${l.estado ? ` («${l.estado}» não é «viva» nem «retirada»)` : ''}. ` +
          `Uma linha declara-se «viva» (rende-se algures) ou «retirada» (foi tirada de propósito e não pode voltar).
` +
          `      «${l.texto.slice(0, 110)}»`,
      );
    }
    for (const l of d.retiradas_sem_razao) {
      erros.push(
        `${casa.inventario}:${l.n}: linha «retirada» sem razão escrita. Uma proibição sem motivo ` +
          `é uma linha que ninguém sabe levantar.
      «${l.texto.slice(0, 110)}»`,
      );
    }
    for (const l of d.vivas_que_nao_rendem) {
      erros.push(
        `${casa.inventario}:${l.n}: linha «viva» que não se rende em rota nenhuma. ` +
          `Ou a frase mudou e a linha ficou para trás, ou a rota saiu: nos dois casos ` +
          `a linha sai do ficheiro, ou passa a «retirada» com a razão escrita.
` +
          `      «${l.texto.slice(0, 110)}»`,
      );
    }
    for (const l of d.retiradas_que_rendem) {
      erros.push(
        `${casa.inventario}:${l.n}: FRASE RETIRADA QUE VOLTOU A RENDER-SE.
` +
          `      razão da retirada: ${l.razao}
` +
          `      «${l.texto.slice(0, 110)}»`,
      );
    }
  }
}

/* 5 · o rasto da revisão (G2).
 *
 * Cada linha do inventário declara o bloco que a acrescentou ou a reclassificou,
 * e cada bloco tem de ter uma entrada no registo das revisões, com a leitura
 * cruzada do seu diff. Uma entrada pode dizer `por ler` enquanto o bloco está em
 * construção (a leitura faz-se antes da fusão, não antes do commit), e essa
 * entrada sai na saída para que ninguém a esqueça. O que fecha a construção é um
 * bloco SEM entrada, ou uma entrada que nomeia um ficheiro que não existe. */
const REVISOES = path.join('design', 'especime-v3', 'critica', 'REVISOES-DO-INVENTARIO.md');
/* A CONSTITUIÇÃO LÊ-SE DE ONDE ESTA VARIÁVEL DISSER, E A RAZÃO É A REGRA 14. Uma
   régua só conta depois de apanhar um estrago plantado, e o estrago desta é uma
   emenda da voz que ainda não existe. Plantá-la no ficheiro da direção seria
   escrever na constituição, que só muda pela mão do diretor: planta-se numa
   CÓPIA, e o portão lê-a por aqui. É a mesma forma de `OEDP_REGISTOS_DIR` no
   portão de HTML, e pela mesma razão. */
const CAMINHO_DA_DIRECAO =
  process.env.OEDP_DIRECAO ?? path.join(RAIZ, 'design', 'especime-v3', 'direcao.md');
/* A cadeia que marca uma emenda da voz. As Emendas 15 e 18 já a levam, e é dela
   que o inventário depende: quando aparecer a 20 com esta cadeia, este passo
   fecha a construção até alguém reler o inventário. */
const CADEIA_DA_VOZ = '§5 «Voz» emendado';
const inventario = leInventario(RAIZ);
const blocosPorLer = [];
{
  const blocos = new Set();
  let semBloco = 0;
  for (const l of inventario.linhas) {
    if (l.bloco) blocos.add(l.bloco);
    else semBloco++;
  }
  if (semBloco) {
    erros.push(
      `${FICHEIRO_DO_INVENTARIO}: ${semBloco} linha(s) sem a coluna «bloco». ` +
        `Cada linha diz que bloco a acrescentou ou a reclassificou.`,
    );
  }
  const caminhoDoRegisto = path.join(RAIZ, REVISOES);
  if (!fs.existsSync(caminhoDoRegisto)) {
    erros.push(`não existe ${REVISOES}, e o inventário declara ${blocos.size} bloco(s).`);
  } else {
    const cru = fs.readFileSync(caminhoDoRegisto, 'utf8');
    const entradas = new Map();
    for (const linha of cru.split('\n')) {
      const t = linha.trim();
      if (!t.startsWith('|') || !t.endsWith('|')) continue;
      const c = t.slice(1, -1).split('|').map((x) => x.trim());
      if (c.length < 4 || c[0] === 'bloco' || /^-+$/.test(c[0])) continue;
      entradas.set(c[0], c[2]);
    }
    for (const b of [...blocos].sort()) {
      if (!entradas.has(b)) {
        erros.push(
          `o bloco «${b}» tem linhas no inventário e não tem entrada em ${REVISOES}. ` +
            `Uma linha nova do inventário pede a leitura cruzada do seu diff.`,
        );
        continue;
      }
      const leitura = entradas.get(b);
      const ficheiros = [...leitura.matchAll(/`([^`]+\.md)`/g)].map((m) => m[1]);
      if (!ficheiros.length) {
        blocosPorLer.push(`${b} · ${leitura}`);
        continue;
      }
      for (const f of ficheiros) {
        if (!fs.existsSync(path.join(RAIZ, f))) {
          erros.push(`a entrada do bloco «${b}» em ${REVISOES} nomeia ${f}, que não existe.`);
        }
      }
    }
  }
}

/* 6 · o gatilho da regra (G3). */
let lidaContra = null;
let emendaMaisAlta = null;
{
  const lida = (inventario.cabeca['lida-contra'] ?? '').match(/(\d+)/);
  if (!lida) {
    erros.push(
      `${FICHEIRO_DO_INVENTARIO}: a cabeça não diz «lida-contra: Emenda N». ` +
        `Sem ela não há maneira de saber se a regra da voz mudou por baixo do inventário.`,
    );
  } else {
    lidaContra = Number(lida[1]);
  }
  if (!fs.existsSync(CAMINHO_DA_DIRECAO)) {
    erros.push(`não existe ${path.relative(RAIZ, CAMINHO_DA_DIRECAO)}, e é onde vivem as emendas da voz.`);
  } else {
    const cru = fs.readFileSync(CAMINHO_DA_DIRECAO, 'utf8');
    for (const linha of cru.split('\n')) {
      if (!linha.includes(CADEIA_DA_VOZ)) continue;
      const n = linha.match(/^(\d+)\.\s/);
      if (!n) continue;
      const numero = Number(n[1]);
      if (emendaMaisAlta === null || numero > emendaMaisAlta) emendaMaisAlta = numero;
    }
    if (emendaMaisAlta === null) {
      erros.push(
        `nenhuma emenda de ${path.relative(RAIZ, CAMINHO_DA_DIRECAO)} leva a cadeia «${CADEIA_DA_VOZ}». ` +
          `Ou a cadeia mudou, ou o ficheiro não é o que se pensa: nos dois casos o gatilho da regra ` +
          `deixou de poder disparar, e isso é pior do que uma emenda por ler.`,
      );
    } else if (lidaContra !== null && emendaMaisAlta > lidaContra) {
      erros.push(
        `o inventário foi lido contra a Emenda ${lidaContra} e a Emenda ${emendaMaisAlta} mudou a ` +
          `regra da voz: relê e atualiza.\n` +
          `      A releitura é um trabalho de outra família sobre o inventário inteiro, e o campo ` +
          `«lida-contra» só sobe com uma entrada nova em ${REVISOES}.`,
      );
    }
  }
}

/* 10 · O ARAME DA CLASSE POR PROVAR, NA PRIMEIRA PÁGINA (F0.9, 03.09.2026).
 *
 * **É UM TAPA-BURACO, E O F3.1 SUBSTITUI-O.** O que o plano da fiabilidade manda
 * construir é um componente por tipo de frase (estado, comparação, tendência,
 * quantificador) que receba ids de linhas, calcule na construção e renda as
 * palavras de um vocabulário fechado, mais a régua do mundo fechado que fecha a
 * construção sobre qualquer bloco de texto que não seja mobília, frase tipada ou
 * transcrição. Enquanto esse portão não existir, a classe que o F0.9 acabou de
 * tirar da primeira página pode voltar em silêncio, e este arame existe para que
 * não volte: uma frase nova que use uma destas palavras em `/` ou em `/en/`
 * fecha a construção até alguém a tipar. Quando o `check:prosa` do F3.1 entrar,
 * esta secção sai inteira, e sai com a sua lista.
 *
 * POR QUE É QUE NÃO SÃO MARCADORES DO `VOZ-MARCADORES.md`. Um marcador daquele
 * ficheiro pergunta «isto é a casa a falar de si?», e a saída dele é uma
 * declaração de autorreferência; estas palavras não são autorreferência, são
 * afirmações por provar, e declará-las na coluna errada faria a lista mentir
 * sobre o que classifica. E um marcador morde em TODAS as rotas inventariadas,
 * enquanto esta classe só está fechada na primeira página: «adverte» é palavra
 * legítima no corpo de um estudo transcrito, e «era» de um documento citado não
 * é uma afirmação da casa. A dispensa teria de ser escrita rota a rota, e uma
 * proibição com trinta exceções é uma proibição que ninguém lê.
 *
 * A LEITURA É DIRETA DO HTML CONSTRUÍDO, E NÃO PELA RÉGUA. É de propósito, e a
 * razão foi medida no próprio F0.9: das sete frases da §1.44, a régua da voz só
 * via UMA. As três do Painel Social vivem num `<span class="social-frase">`, e
 * `BLOCOS` só conhece `span.eyebrow`; duas das do Procedimento vivem num `<p>`
 * que embrulha uma marca de origem declarada, e `blocosDe()` salta o bloco
 * inteiro por causa dela. Um arame que passasse pela régua herdava os dois
 * buracos e media zero com a página cheia.
 *
 * O SEU PRÓPRIO POSITIVO CONHECIDO (regra 14). Um detetor que lê dois ficheiros
 * e conta zero tem duas explicações, e só uma é boa: ou a classe não está lá, ou
 * a leitura partiu-se. Por isso cada edição declara uma sentinela, uma cadeia
 * que a primeira página tem de ter, e a ausência dela fecha a construção antes
 * de o zero das palavras valer alguma coisa. */
const ARAME_DA_CLASSE = [
  /* tendência · o sítio publica um valor por indicador e nenhuma série; um
     sentido sem os dois valores é uma afirmação que a página não sustenta. As
     flexões entram porque a classe é a mesma palavra noutro tempo, e uma lista
     que só apanha o gerúndio deixa passar o pretérito (leitura a frio, Major 1). */
  { pt: 'a descer', en: 'falling', porque: 'tendência sem série' },
  { pt: 'desceu', en: 'fell', porque: 'tendência sem série, no pretérito' },
  { pt: 'a subir', en: 'rising', porque: 'tendência sem série' },
  { pt: 'subiu', en: 'rose', porque: 'tendência sem série, no pretérito' },
  { pt: 'caiu', en: 'dropped', porque: 'tendência sem série, no pretérito' },
  { pt: 'cresceu', en: 'grew', porque: 'tendência sem série, no pretérito' },
  { pt: 'duplicou', en: 'doubled', porque: 'comparação entre dois períodos, e a página tem um' },
  { pt: 'dobrou', en: 'halved', porque: 'comparação entre dois períodos, dita por outra palavra' },
  /* comparação · contra um valor que não está na página. */
  { pt: 'média da União', en: 'Union average', porque: 'a média da União não é linha do livro-razão' },
  { pt: 'média europeia', en: 'European average', porque: 'a média europeia não é linha do livro-razão' },
  { pt: 'média da UE', en: 'EU average', porque: 'a média da União dita pela sigla' },
  { pt: 'mais se destaca', en: 'stands out most', porque: 'superlativo sobre medidas que a página não mostra' },
  /* valor de outro período · que a página não publica. */
  { pt: 'no início do século', en: 'turn of the century', porque: 'valor de outro período, sem linha' },
  /* atribuição · sem o excerto de quem a fez. */
  { pt: 'adverte', en: 'warns', porque: 'atribuição sem excerto' },
];
/* A sentinela de cada edição: o nome de uma medida do painel, que a primeira
   página tem de render enquanto tiver painel. Se um dia deixar de o render, o
   que se muda é esta linha, com a razão ao lado, e não o silêncio. */
const ROTAS_DA_CLASSE = [
  {
    rota: '/',
    ficheiro: path.join('dist', 'index.html'),
    lingua: 'pt',
    /* A SENTINELA É PROSA DA CASA, E TEM DE O SER (segunda passagem, 03.09.2026).
       Era «Dívida pública», e o nome de uma medida vive dentro de
       `data-medida-nome`: a leitura passou a tirar as origens, e a sentinela
       desapareceu com elas, o que fechou a construção. Bem fechada, aliás: era o
       positivo conhecido a dizer que já não sabia o que estava a medir. A
       sentinela passa a ser a frase de identidade da Emenda 18a, que é prosa da
       casa, está fixada por decisão do diretor e rende-se na primeira página e
       em mais lado nenhum. */
    sentinela: 'Um observatório de Portugal.',
  },
  {
    rota: '/en/',
    ficheiro: path.join('dist', 'en', 'index.html'),
    lingua: 'en',
    sentinela: 'An observatory of Portugal.',
  },
];

/* AS MARCAS QUE ISENTAM (segunda passagem, leitura a frio do Codex, Major 1).
 * Uma palavra da lista DENTRO de uma origem declarada ou de um excerto
 * transcrito não é a casa a afirmar: é o valor de uma linha, o nome de uma
 * medida, ou as palavras de uma fonte copiadas como ela as escreveu. O arame
 * lia `body.text` e não sabia a diferença, e por isso um excerto legítimo com a
 * palavra «adverte» lá dentro fechava a construção. A lista é a mesma de
 * `medir-defeitos.mjs`, e é de propósito: duas definições da mesma coisa
 * divergem no dia em que uma delas mudar. */
const ORIGEM_DA_CLASSE =
  '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],' +
  '[data-agenda],[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta],' +
  '[data-medida-nome],[data-medida-unidade]';

/** O texto que o leitor lê, sem o que veio de uma origem declarada. */
function textoSemOrigens(html) {
  const root = parse(html);
  const corpo = root.querySelector('body');
  if (!corpo) return '';
  const marcados = new Set();
  for (const el of root.querySelectorAll(ORIGEM_DA_CLASSE)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if (marcados.has(n)) return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(corpo);
  return partes.join(' ').replace(/\s+/g, ' ').trim();
}

/** As palavras da classe que mordem num texto já limpo de origens. */
function mordidas(texto, lingua) {
  const t = texto.toLowerCase();
  return ARAME_DA_CLASSE.filter((p) => t.includes((lingua === 'pt' ? p.pt : p.en).toLowerCase()));
}

/* ---------------------------------------------------------------------------
 * O AUTOTESTE DO ARAME, CORRIDO A CADA CONSTRUÇÃO (Major 2 da leitura a frio)
 * ---------------------------------------------------------------------------
 * A sentinela prova que os ficheiros foram lidos; NÃO prova que o arame deteta
 * alguma coisa, nem que a isenção de origem funciona. Um detetor que nunca viu
 * um positivo é uma contagem de zero sem valor, e é a regra 14 da casa.
 *
 * Duas páginas de rascunho, construídas aqui e não lidas de lado nenhum:
 *   · FORA · cada termo proibido uma vez, em prosa solta. Espera-se que TODOS
 *     mordam. Um que não morda diz que a entrada da lista está partida.
 *   · DENTRO · cada termo proibido uma vez, dentro de uma marca de origem.
 *     Espera-se que NENHUM morda. Um que morda diz que a isenção não funciona.
 *
 * Falha em qualquer dos sentidos fecha a construção antes de o arame olhar para
 * a primeira página, porque um arame partido é pior do que nenhum: mede zero e
 * parece verde. */
{
  for (const lingua of ['pt', 'en']) {
    const termos = ARAME_DA_CLASSE.map((p) => (lingua === 'pt' ? p.pt : p.en));
    const fora = `<html><body><p>${termos.map((t) => `o valor ${t} nesta frase.`).join(' ')}</p></body></html>`;
    const dentro = `<html><body><p>${termos
      .map((t) => `<span data-claim="x">o valor ${t} nesta frase.</span>`)
      .join(' ')}</p></body></html>`;
    const viuFora = mordidas(textoSemOrigens(fora), lingua).length;
    if (viuFora !== termos.length) {
      const cegas = termos.filter((t) => !textoSemOrigens(fora).toLowerCase().includes(t.toLowerCase()));
      erros.push(
        `o autoteste do arame da classe falhou em «${lingua}»: dos ${termos.length} termos postos em prosa ` +
          `solta, só ${viuFora} morderam. O arame não deteta o que diz detetar` +
          `${cegas.length ? `, e o texto de rascunho nem sequer contém: ${cegas.join(' · ')}` : ''}.`,
      );
    }
    const viuDentro = mordidas(textoSemOrigens(dentro), lingua);
    if (viuDentro.length) {
      erros.push(
        `o autoteste do arame da classe falhou em «${lingua}»: ${viuDentro.length} termo(s) morderam DENTRO ` +
          `de uma origem declarada (${viuDentro.map((p) => (lingua === 'pt' ? p.pt : p.en)).join(' · ')}). ` +
          `Um valor de uma linha ou um excerto transcrito não é a casa a afirmar, e a isenção de origem ` +
          `deixou de funcionar.`,
      );
    }
  }
}

for (const r of ROTAS_DA_CLASSE) {
  const caminho = path.join(RAIZ, r.ficheiro);
  if (!fs.existsSync(caminho)) {
    erros.push(
      `não existe ${r.ficheiro}, e é a rota ${r.rota} onde o arame da classe por provar (F0.9) morde. ` +
        `Sem o ficheiro o arame conta zero por cegueira e não por limpeza.`,
    );
    continue;
  }
  const cru = fs.readFileSync(caminho, 'utf8');
  const texto = textoSemOrigens(cru);
  if (!texto.includes(r.sentinela)) {
    erros.push(
      `o positivo conhecido do arame da classe falhou em ${r.rota}: o texto de ${r.ficheiro} não contém ` +
        `«${r.sentinela}». Ou a leitura do corpo partiu-se, ou a primeira página deixou de render o painel: ` +
        `nos dois casos a contagem de zero palavras da classe não prova nada.`,
    );
    continue;
  }
  for (const p of mordidas(texto, r.lingua)) {
    const cadeia = r.lingua === 'pt' ? p.pt : p.en;
    erros.push(
      `FRASE DA CLASSE POR PROVAR EM ${r.rota} · «${cadeia}» (${p.porque}).\n` +
        `      O F0.9 tirou esta classe da primeira página a 03.09.2026: uma tendência, uma comparação\n` +
        `      contra um valor que a página não tem, um valor de outro período ou uma atribuição sem\n` +
        `      excerto. Ou a frase ganha a linha que a prova e é tipada pelo F3.1, ou não volta.`,
    );
  }
}

console.log('');
if (erros.length) {
  console.error(vermelho(`  PORTÃO DA VOZ · ${erros.length} problema(s)\n`));
  for (const e of erros.slice(0, 40)) console.error(vermelho('    · ') + e);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}`));
  console.error('');
  process.exit(1);
}

console.log(
  verde('  voz ✓ ') +
    `${voz.marcadores} marcadores · ${voz.excecoes} exceções (${voz.excecoes_de_registo} de registo) · ` +
    `${voz.frases_varridas} frases distintas, ${voz.ocorrencias_varridas} ocorrências em ${rotas.length} rotas · ` +
    `autorreferência 0 · nada por classificar · ` +
    `divulgação ${rotas.reduce((n, [, r]) => n + (r.por_classe.divulgacao ?? 0), 0)} ocorrência(s) ` +
    `nas rotas medidas · ${inventario.linhas.length} linhas do inventário com bloco ` +
    `(${casa.declaracoes?.vivas ?? '?'} vivas, todas rendidas; ${casa.declaracoes?.retiradas ?? '?'} retiradas, nenhuma rendida) · ` +
    `lida contra a Emenda ${lidaContra} (a mais alta da voz é a ${emendaMaisAlta}) · ` +
    `rótulos em span: ${Object.entries(voz.rotulos_em_span ?? {})
      .map(([c, n]) => `.${c} ${n}`)
      .join(', ')} · ` +
    `nomes declarados: ${Object.entries(voz.nomes_declarados?.por_fonte ?? {})
      .map(([f, n]) => `${f} ${n}`)
      .join(', ')}`,
);
if (blocosPorLer.length) {
  console.log(cinza(`        ${blocosPorLer.length} bloco(s) do inventário por ler, e o registo di-lo:`));
  for (const b of blocosPorLer) console.log(cinza(`        · ${b}`));
}
if (voz.excecoes_por_usar.length) {
  console.log(cinza(`        ${voz.excecoes_por_usar.length} exceção(ões) por exercer, e o ficheiro di-lo:`));
  for (const e of voz.excecoes_por_usar) console.log(cinza(`        · «${e.slice(0, 90)}»`));
}
console.log('');
