#!/usr/bin/env node
/**
 * Portão do registo: os números de estado dos documentos que governam, contra
 * o que se mede na fonte.
 *
 * Catorze portões guardavam o sítio e nenhum lia um `.md`. Foi por aí que
 * «Évora tem 53 011 pessoas» entrou no relatório de um construtor, atravessou
 * a medição cega e a leitura a frio, e foi copiado para o ficheiro que cada
 * sessão lê primeiro e com que o diretor decide (AUDITORIA-2026-09-02 §6, «O
 * caso dos 53 011»). Este portão fecha essa porta pelo lado dos números: um
 * facto de estado escrito num documento que governa tem de bater com o que se
 * mede na fonte, e um valor do sítio citado nesses documentos tem de trazer o
 * id da sua linha ao lado.
 *
 * NÃO LÊ PROSA. «hoje só `evora`» e «o arquivo vazio» são afirmações erradas e
 * este portão não as vê: são frases, não algarismos, e são do `check:prosa` da
 * fase 3 (PLANO-fiabilidade §5, F3.1). O que aqui se recusa é sempre um número.
 *
 * ---------------------------------------------------------------------------
 * A SEGUNDA PASSAGEM (02.09.2026), e o que a leitura a frio partiu
 * ---------------------------------------------------------------------------
 * O Codex leu este portão a frio e injetou-lhe frases. Quase toda a gramática
 * de isenção da primeira versão era uma janela: bastava pôr uma data adiante,
 * abrir um parêntesis que não fecha, ou escrever «dizia» quinze símbolos antes,
 * para um número errado passar. As isenções desta versão são ATRACADAS: a data
 * cola-se à afirmação, o parêntesis tem de fechar, e a palavra histórica tem de
 * encostar ao número ou à aspa que o abre. Cada uma tem um positivo conhecido
 * que a viu vermelha antes de a ver verde.
 *
 * ---------------------------------------------------------------------------
 * OS DOCUMENTOS QUE GOVERNAM
 * ---------------------------------------------------------------------------
 * Os cinco que o `CLAUDE.md` do projeto manda ler, e mais nada:
 *
 *   VISAO.md · README.md · design/especime-v3/PENDENTES-DO-DIRETOR.md ·
 *   CLAUDE.md · design/observatorio/PLANO-fiabilidade-2026-09-02.md (§0 e §1)
 *
 * O `DECISIONS.md` está fora de propósito: é o registo, e os seus números são
 * históricos por natureza. Uma decisão de agosto diz o que era verdade em
 * agosto, e reescrevê-la seria falsificar o registo.
 *
 * Do plano leem-se só o §0 e o §1. O corte é o título do §2, e se ele não
 * aparecer o portão PARA: um documento que muda de forma deixaria de ser lido
 * em silêncio, e ler o plano inteiro poria vermelhas as medidas de aceitação
 * dos blocos por construir, que não são estados.
 *
 * ---------------------------------------------------------------------------
 * A GRAMÁTICA: O QUE É UMA AFIRMAÇÃO CORRENTE E O QUE É UMA AFIRMAÇÃO DATADA
 * ---------------------------------------------------------------------------
 * Uma AFIRMAÇÃO é um número junto da palavra de um facto, nas duas ordens:
 * «2 916 linhas» e «as linhas são 2 916». É CORRENTE por omissão, e então tem
 * de ser igual ao valor medido. É DATADA, e sai da conferência, por uma de três
 * formas, e só por essas três:
 *
 *   (i)     o número, a palavra do facto e « a dd.mm.aaaa », ATRACADOS: entre o
 *           número e a data só pode estar a palavra do facto, a marcação do
 *           markdown, e no máximo um qualificador curto sem pontuação de frase
 *           verde:    «2 916 linhas a 02.09.2026»
 *           verde:    «**dezasseis documentos** a 02.09.2026»
 *           VERMELHO: «2 602 linhas, e muita outra coisa pelo meio, a 02.09.2026»
 *
 *   (ii)    o número dentro de um parêntesis EQUILIBRADO do mesmo bloco que
 *           contém o número e uma data inteira
 *           verde:    «(2 602 linhas, a contagem de 30.08.2026)»
 *           VERMELHO: «(2 602 linhas, a contagem de 30.08.2026» sem fechar: um
 *                     parêntesis aberto que não fecha é um erro, e não uma
 *                     isenção que se estende até ao fim do bloco
 *
 *   (iii-a) o número DENTRO da citação que a palavra histórica abre, e a
 *           palavra tem de encostar à aspa
 *           verde:    «corrigido nesse dia: dizia «as 132 linhas»»
 *           VERMELHO: «dizia o que se segue: «132 linhas»»
 *
 *   (iii-b) o número logo a seguir à palavra histórica, sem nada pelo meio
 *           verde:    «eram 2 602 linhas»
 *           VERMELHO: «dizia, e mal, que eram 2 602 linhas» (a palavra que
 *                     encosta é «eram», e essa vale; «dizia» sozinha, a quinze
 *                     símbolos, não vale)
 *
 * As palavras históricas são «dizia», «diziam», «era», «eram», «tinha» e
 * «tinham».
 *
 * A EMENDA QUE IMPEDE O PORTÃO DE SE DESARMAR SOZINHO: uma data que é a de
 * HOJE não isenta. «2 916 linhas a 02.09.2026», lido a 02.09.2026, afirma o
 * valor de hoje e confere-se como corrente; lido a 03.09.2026 já é história e
 * sai. Sem esta emenda bastava carimbar a data do dia em qualquer número errado
 * para o portão o deixar passar. A forma (iii) é absoluta e não leva emenda:
 * «dizia «M»» declara-se, pela própria palavra, como o valor antigo.
 *
 * A FORMA DA CORREÇÃO, que é a da casa: nunca se reescreve um número em
 * silêncio. Escreve-se «N a 02.09.2026; dizia «M»»: o valor novo, a data em que
 * se mediu, e o texto antigo CITADO, não parafraseado.
 *
 * O SUBCONJUNTO, «N X em M»: M confere-se contra o facto, N tem de ser menor ou
 * igual a M, e N confere-se também quando o facto declara um subconjunto
 * medido. «o painel semanal confere 32 linhas em 2 916» é verdadeiro e verde
 * nas três contas: 2 916 é o facto, 32 é o subconjunto medido em
 * `src/data/verificacao.mjs`, e 32 ≤ 2 916. Um subconjunto sem medida não se
 * aceita em silêncio: conta-se, imprime-se, e diz-se que N não foi conferido.
 *
 * A AFIRMAÇÃO DISTRIBUTIVA, «N X cada» e «N X por Y», não é um total: «as rotas
 * PT e EN são duas linhas cada» fala de duas linhas por rota. Conta-se,
 * imprime-se, e não se confere contra o total.
 *
 * O QUE SE LÊ DE CADA VEZ É UM BLOCO, e não uma linha física: um parágrafo com
 * as suas dobras juntas, um item de lista com as suas continuações indentadas,
 * uma linha de tabela (que é um registo e vale sozinha), um título. Nada dentro
 * de um bloco de código cercado, e uma cerca que não fecha é um erro, porque
 * calaria o resto do documento. O erro imprime sempre a linha física.
 *
 * DUAS PRECAUÇÕES DA GRAMÁTICA, ambas medidas neste corpus:
 *
 *   · os números por extenso vão de «um» a «noventa e nove». «um», «uma»,
 *     «dois» e «duas» só contam quando a palavra do facto vem a seguir, porque
 *     as palavras dos factos são plurais: «duas linhas» é um número, «uma linha
 *     por registo» é um artigo diante de um singular que não é palavra de facto.
 *   · «edições» nua quer dizer duas coisas verdadeiras nestes documentos, as 16
 *     do arquivo e as 8 com registo de conteúdo. A palavra do facto é o composto
 *     («edições do arquivo», «edições com registo»), e a nua é declarada
 *     AMBÍGUA: sai da conferência e diz-se no relatório, com a linha. Um portão
 *     que salta uma frase e não o diz é pior do que um portão que não existe.
 *
 * ---------------------------------------------------------------------------
 * O VALOR DO SÍTIO CITADO SEM O ID DA LINHA
 * ---------------------------------------------------------------------------
 * Um número que é um valor publicado pelo sítio não se escreve nestes
 * documentos sem o id da linha que o prova. Duas formas o disparam:
 *
 *   V1  «<Nome> tem <número> <unidade>»  ·  V2  «<número> <unidade>»
 *
 * O id que vale é O MAIS PRÓXIMO DEPOIS DO NÚMERO, NA MESMA FRASE, e o seu
 * valor e a sua unidade têm de ser os do número escrito. Não é «algum id do
 * bloco»: com dois valores e dois ids no mesmo bloco, cada valor emparelha com
 * o seu, e um valor cujo id mais próximo diz outro número é recusado mesmo que
 * outro id do bloco calhe bater certo. Uma frase acaba num ponto seguido de
 * espaço fora de aspas e de parêntesis, ou no fim do bloco.
 *
 * A separação dos milhares normaliza-se antes de comparar: U+202F, U+00A0,
 * U+2009, espaço comum, ponto de milhar ou nada são o mesmo número, e a vírgula
 * decimal fica. A varredura de 02.09 mediu as três camadas da casa a
 * escreverem-no de três maneiras (U+0020 na prosa, U+00A0 no HTML servido,
 * U+202F no CSV e no JSON).
 *
 * ---------------------------------------------------------------------------
 * O CHÃO DE AFIRMAÇÕES POR DOCUMENTO
 * ---------------------------------------------------------------------------
 * Um verde só conta se a régua tiver mesmo lido alguma coisa. Cada documento
 * declara o mínimo de afirmações que hoje produz; uma corrida que avalie menos
 * do que isso falha, ainda que não encontre nenhum erro. Sem este chão, uma
 * gramática partida por um acidente de escrita daria verde por não ver nada.
 *
 * ---------------------------------------------------------------------------
 * O POSITIVO CONHECIDO (regra 14 da casa), E PORQUE PRECISA DE UMA BANDEIRA
 * ---------------------------------------------------------------------------
 * A porta do estrago plantado é a variável `OEDP_REGISTO_DIR`, que aponta para
 * uma CÓPIA dos documentos. Os factos continuam a medir-se na árvore
 * verdadeira; o que se planta é só o que se lê.
 *
 * SÓ QUE UMA VARIÁVEL DE AMBIENTE HERDA-SE. A leitura a frio mostrou que
 * `npm run build` a herdava e o portão conferia uma cópia limpa em vez dos
 * documentos verdadeiros, com um aviso que ninguém lê: uma porta de teste que
 * é um desvio da construção. Por isso a variável SÓ VALE COM `--prova` ao lado,
 * e a construção, que nunca passa a bandeira, PARA se a variável estiver posta.
 *
 * Uso:  node scripts/check-registo.mjs
 *       OEDP_REGISTO_DIR=/tmp/copia node scripts/check-registo.mjs --prova
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadClaims, contagensDoRegisto } from '../src/lib/ledger.mjs';
import { WORKS, EDITIONS } from '../src/data/studies.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { todosOsDocumentos } from '../src/lib/documentos.mjs';
import { VERIFICACAO } from '../src/data/verificacao.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..');

/* ========================================================================== *
 * 0 · A PORTA DA PROVA, QUE NÃO É UM DESVIO DA CONSTRUÇÃO
 * ========================================================================== */

const PROVA = process.argv.includes('--prova');
const COPIA = process.env.OEDP_REGISTO_DIR;

if (COPIA && !PROVA) {
  console.error(vermelho('\n  PORTÃO DO REGISTO — OEDP_REGISTO_DIR posto sem `--prova`.\n'));
  console.error(`  A variável aponta para ${COPIA}, e sem a bandeira este portão não a honra.`);
  console.error('  Uma variável de ambiente herda-se: a construção apanhava-a e conferia uma');
  console.error('  cópia limpa em vez dos documentos da casa, com um aviso que ninguém lê.');
  console.error('  Para plantar um estrago:  node scripts/check-registo.mjs --prova');
  console.error('  Para conferir a casa:     tire a variável do ambiente.\n');
  process.exit(1);
}

/* Os factos medem-se SEMPRE na árvore verdadeira; só a leitura muda de sítio. */
const DOCS = PROVA && COPIA ? COPIA : RAIZ;

const erros = [];

/** Separadores de milhar que a casa usa nas suas três camadas, mais o comum. */
const SEPARADORES = /[    ]/g;

/**
 * «2 916», «2.916», «2916» → "2916"; «4,86» → "4,86". O ponto só se tira quando
 * é mesmo separador de milhares (grupos de três), para uma data nunca virar
 * número.
 */
function normaliza(n) {
  let s = String(n).replace(SEPARADORES, '').trim();
  if (/^\d{1,3}(?:\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  return s;
}

/* ========================================================================== *
 * 1 · OS FACTOS, MEDIDOS NA FONTE
 * ========================================================================== */

const claims = loadClaims();

function contaFicheirosDoLivro() {
  return fs.readdirSync(path.join(RAIZ, 'ledger', 'claims')).filter((f) => f.endsWith('.yml')).length;
}

function passosDaConstrucao() {
  const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8'));
  return (pkg.scripts?.build ?? '').split('&&').map((s) => s.trim()).filter(Boolean).length;
}

function paginasDeLeitura() {
  const m = JSON.parse(fs.readFileSync(path.join(RAIZ, 'registos', 'manifest.json'), 'utf8'));
  return Object.keys(m.registos ?? {}).length;
}

function concelhosGerados() {
  const j = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src', 'data', 'concelhos.gerado.json'), 'utf8'));
  return Array.isArray(j) ? j.length : Object.keys(j).length;
}

function edicoesDoManifesto() {
  /* Uma linha por edição instalada: `  - slug:` abre cada entrada. Conta-se o
     abridor, e não o ficheiro inteiro, para não depender do js-yaml aqui. */
  const cru = fs.readFileSync(path.join(RAIZ, 'studies-src', 'manifest.yml'), 'utf8');
  return cru.split('\n').filter((l) => /^\s*-\s+slug:/.test(l)).length;
}

const contagens = contagensDoRegisto(claims);

/**
 * Um facto: as palavras por que se diz, a fonte que o mede, o comando que o
 * reproduz, a SEGUNDA medição quando existe uma independente, a linha do
 * livro-razão que o publica quando existe, e o subconjunto medido quando o
 * documento tem razão para citar uma parte.
 *
 * NEM TODOS OS FACTOS TÊM SEGUNDA MEDIÇÃO, e isso diz-se em vez de se
 * arredondar para «cada facto mede-se duas vezes», que era falso (leitura a
 * frio, Major 10). Os passos da construção e as páginas de leitura têm uma só
 * fonte, porque uma segunda leitura do mesmo ficheiro não é uma segunda
 * medição: seria a mesma coisa contada outra vez.
 */
const FACTOS = [
  {
    id: 'linhas',
    nome: 'linhas do livro-razão',
    palavras: ['linhas do livro-razão', 'linhas'],
    fonte: 'ledger/claims/*.yml',
    comando: 'ls ledger/claims/*.yml | wc -l',
    valor: contaFicheirosDoLivro(),
    segunda: { nome: 'loadClaims().size', valor: claims.size },
    subconjunto: {
      nome: 'as que o painel semanal reconfere',
      valor: VERIFICACAO.afirmacoes,
      fonte: 'src/data/verificacao.mjs · VERIFICACAO.afirmacoes',
    },
  },
  {
    id: 'concelhos',
    nome: 'concelhos com página',
    palavras: ['páginas de concelho', 'páginas de município', 'concelhos', 'municípios'],
    fonte: 'src/data/municipios.mjs · MUNICIPIOS_COM_PAGINA',
    comando: "node -e \"import('./src/data/municipios.mjs').then(m=>console.log(m.MUNICIPIOS_COM_PAGINA.length))\"",
    valor: MUNICIPIOS_COM_PAGINA.length,
    segunda: { nome: 'src/data/concelhos.gerado.json', valor: concelhosGerados() },
    linha: 'municipios-portugal-caop-2025',
  },
  {
    id: 'estudos',
    nome: 'estudos (trabalhos) no arquivo',
    palavras: ['estudos', 'trabalhos'],
    fonte: 'src/data/studies.mjs · WORKS',
    comando: "node -e \"import('./src/data/studies.mjs').then(m=>console.log(m.WORKS.length))\"",
    valor: WORKS.length,
    linha: 'estudos-publicados',
  },
  {
    id: 'edicoes',
    nome: 'edições do arquivo',
    palavras: ['edições do arquivo', 'edições publicadas'],
    fonte: 'src/data/studies.mjs · EDITIONS',
    comando: "node -e \"import('./src/data/studies.mjs').then(m=>console.log(m.EDITIONS.length))\"",
    valor: EDITIONS.length,
    linha: 'edicoes-publicadas',
  },
  {
    id: 'documentos',
    nome: 'documentos alojados',
    palavras: ['documentos alojados', 'documentos'],
    fonte: 'studies-src/<slug>/<lingua>.html, declarados em studies-src/manifest.yml',
    comando: "grep -c '^  - slug:' studies-src/manifest.yml",
    valor: todosOsDocumentos().length,
    segunda: { nome: 'studies-src/manifest.yml · edicoes', valor: edicoesDoManifesto() },
  },
  {
    id: 'correcoes',
    nome: 'correções publicadas',
    palavras: ['correções publicadas', 'correções'],
    fonte: "ledger/claims/*.yml · corrections[].kind == 'correcao'",
    comando:
      "node -e \"import('./src/lib/ledger.mjs').then(m=>console.log(m.contagensDoRegisto().correcoes_publicadas))\"",
    valor: contagens.correcoes_publicadas,
    linha: 'correcoes-publicadas',
  },
  {
    id: 'passos',
    nome: 'passos da construção',
    palavras: ['passos encadeados', 'passos'],
    fonte: 'package.json · scripts.build',
    comando: "node -e \"console.log(require('./package.json').scripts.build.split('&&').length)\"",
    valor: passosDaConstrucao(),
    /* uma só fonte: contar a mesma cadeia outra vez não é medir duas vezes */
  },
  {
    id: 'paginas_de_leitura',
    nome: 'páginas de leitura (edições com registo de conteúdo)',
    palavras: ['páginas de leitura', 'edições com registo de conteúdo', 'edições com registo'],
    fonte: 'registos/manifest.json',
    comando: "node -e \"console.log(Object.keys(require('./registos/manifest.json').registos).length)\"",
    valor: paginasDeLeitura(),
    /* uma só fonte, pela mesma razão */
  },
];

/* A reconciliação: as duas medições de um facto, e a linha que o publica.
   Um facto que se mede de duas maneiras e dá dois números não é um facto. */
for (const f of FACTOS) {
  if (f.segunda && f.segunda.valor !== f.valor) {
    erros.push(
      `O facto «${f.nome}» mede-se de duas maneiras e dá dois números: ` +
        `${f.fonte} diz ${f.valor} e ${f.segunda.nome} diz ${f.segunda.valor}. ` +
        `Enquanto discordarem, nenhum documento pode citar nenhum dos dois.`,
    );
  }
  if (f.subconjunto && f.subconjunto.valor > f.valor) {
    erros.push(
      `O subconjunto «${f.subconjunto.nome}» de «${f.nome}» vale ${f.subconjunto.valor} e o ` +
        `todo vale ${f.valor}. Uma parte maior do que o todo é um erro de medição, não de escrita.`,
    );
  }
  if (f.linha) {
    const c = claims.get(f.linha);
    if (!c) {
      erros.push(`O facto «${f.nome}» diz publicar-se na linha \`${f.linha}\`, que não existe no livro-razão.`);
    } else if (normaliza(c.value) !== String(f.valor)) {
      erros.push(
        `O facto «${f.nome}» vale ${f.valor} medido em ${f.fonte}, e a linha \`${f.linha}\` ` +
          `que o publica no sítio diz "${c.value}". O sítio e o registo têm de dizer o mesmo número.`,
      );
    }
  }
}

/* ========================================================================== *
 * 2 · A GRAMÁTICA DOS NÚMEROS
 * ========================================================================== */

/** As unidades, e depois as dezenas, para compor «vinte e um» até «noventa e nove». */
const UNIDADES_EXTENSO = {
  um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6,
  sete: 7, oito: 8, nove: 9,
};
const ATE_DEZANOVE = {
  dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14, quinze: 15,
  dezasseis: 16, dezesseis: 16, dezassete: 17, dezessete: 17, dezoito: 18,
  dezanove: 19, dezenove: 19,
};
const DEZENAS = {
  vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70,
  oitenta: 80, noventa: 90,
};

/** Todo o número por extenso de um a noventa e nove, o mais comprido primeiro. */
const POR_EXTENSO = new Map();
for (const [p, v] of Object.entries({ ...UNIDADES_EXTENSO, ...ATE_DEZANOVE, ...DEZENAS })) {
  POR_EXTENSO.set(p, v);
}
for (const [d, dv] of Object.entries(DEZENAS)) {
  for (const [u, uv] of Object.entries(UNIDADES_EXTENSO)) {
    POR_EXTENSO.set(`${d} e ${u}`, dv + uv);
  }
}
const EXTENSO = [...POR_EXTENSO.keys()].sort((a, b) => b.length - a.length).join('|');

/**
 * Um número em algarismos: com os separadores de milhar da casa, com ponto de
 * milhar, ou nenhum; com vírgula decimal. Nunca «02.09.2026»: o ponto de milhar
 * exige grupos de três, e a guarda de trás recusa um número colado a um ponto.
 */
const ALGARISMOS = '\\d{1,3}(?:[\\u202f\\u00a0\\u2009 ]\\d{3})+(?:,\\d+)?|\\d{1,3}(?:\\.\\d{3})+(?:,\\d+)?|\\d+(?:,\\d+)?';
const NUMERO = `(?:${ALGARISMOS}|${EXTENSO})`;
const ANTES = '(?<![\\d.,/§\\-\\u2011])';

function valorDoNumero(cru) {
  const s = String(cru).trim().toLowerCase();
  if (POR_EXTENSO.has(s)) return POR_EXTENSO.get(s);
  const n = Number(normaliza(s).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function escapa(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* As palavras de todos os factos, as mais compridas primeiro: «páginas de
   leitura» tem de ganhar a «páginas», e «edições do arquivo» a «edições». */
const PALAVRAS = FACTOS.flatMap((f) => f.palavras.map((p) => ({ palavra: p, facto: f })))
  .sort((a, b) => b.palavra.length - a.palavra.length);
const ALTERNATIVA_DOS_FACTOS = PALAVRAS.map((p) => escapa(p.palavra)).join('|');
const FIM_DE_PALAVRA = '(?![\\wáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ-])';

/** «2 916 linhas», na ordem direta. */
const RE_AFIRMACAO = new RegExp(
  `${ANTES}(${NUMERO})\\s*\\*{0,2}\\s*\`?(${ALTERNATIVA_DOS_FACTOS})${FIM_DE_PALAVRA}`,
  'giu',
);

/** «as linhas são 2 916», na ordem inversa (leitura a frio, Major 5). */
const RE_AFIRMACAO_INVERSA = new RegExp(
  `\`?(${ALTERNATIVA_DOS_FACTOS})\`?\\**\\s+(?:são|sao|eram|é|e|somam|totalizam|passaram a ser|passam a ser)\\s+\\**(${NUMERO})${FIM_DE_PALAVRA}`,
  'giu',
);

/** A palavra nua que quer dizer duas coisas, e por isso não se confere. */
const RE_AMBIGUA = new RegExp(`${ANTES}(${NUMERO})\\s*\\*{0,2}\\s*(edições|edição)${FIM_DE_PALAVRA}`, 'giu');

const RE_DATA_INTEIRA = /\b\d{2}\.\d{2}\.\d{4}\b/;
const PALAVRA_HISTORICA = '(?:dizia|diziam|era|eram|tinha|tinham)';

const hoje = (() => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
})();

/* ========================================================================== *
 * 3 · AS ISENÇÕES, ATRACADAS
 * ========================================================================== */

/**
 * Os parêntesis equilibrados de um bloco, e os que ficaram por fechar.
 * Devolve os intervalos fechados e a posição de cada abertura órfã.
 */
function parentesis(texto) {
  const pilha = [];
  const fechados = [];
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === '(') pilha.push(i);
    else if (texto[i] === ')' && pilha.length) fechados.push([pilha.pop(), i]);
  }
  return { fechados, orfaos: pilha };
}

/**
 * A isenção de uma afirmação, ou null. `forma` diz por qual das três saiu, para
 * o relatório poder imprimir o motivo de cada salto.
 *
 * A ordem importa: a palavra histórica primeiro, porque é absoluta; depois a
 * data atracada; por fim o parêntesis. E cada uma exige encosto, que é a lição
 * da leitura a frio: uma isenção com janela é uma isenção injetável.
 */
function isencao(texto, inicio, fimDoNumero, fimDaAfirmacao, pars) {
  /* (iii-a) o número DENTRO da citação que a palavra histórica abre. */
  const prefixo = texto.slice(0, inicio);
  const abertas = (prefixo.match(/«/g) ?? []).length - (prefixo.match(/»/g) ?? []).length;
  if (abertas > 0) {
    const aspa = prefixo.lastIndexOf('«');
    /* a palavra tem de ENCOSTAR à aspa: só espaços e dois pontos pelo meio */
    if (new RegExp(`${PALAVRA_HISTORICA}[\\s:,]{0,3}$`, 'i').test(prefixo.slice(0, aspa))) {
      return { forma: 'iii-a', data: null, absoluta: true };
    }
  }

  /* (iii-b) o número logo a seguir à palavra histórica, sem nada pelo meio. */
  if (new RegExp(`${PALAVRA_HISTORICA}\\s+(?:as\\s+|os\\s+|de\\s+)?$`, 'i').test(prefixo)) {
    return { forma: 'iii-b', data: null, absoluta: true };
  }

  /* (i) a data ATRACADA: entre a palavra do facto e « a dd.mm.aaaa » só pode
     estar marcação do markdown e, no máximo, um qualificador curto sem
     pontuação de frase. Um «a dd.mm.aaaa» a quarenta símbolos não isenta. */
  const depois = texto.slice(fimDaAfirmacao, fimDaAfirmacao + 80);
  const atracada = depois.match(
    /^[\s*`]*(?:(?:[\wáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]+\s+){0,2})?a (\d{2}\.\d{2}\.\d{4})\b/u,
  );
  if (atracada) return { forma: 'i', data: atracada[1], absoluta: false };

  /* (ii) o parêntesis EQUILIBRADO que contém o número e uma data inteira. */
  for (const [a, b] of pars.fechados) {
    if (a < inicio && b > fimDoNumero) {
      const dentro = texto.slice(a, b + 1);
      const d = dentro.match(RE_DATA_INTEIRA);
      if (d) return { forma: 'ii', data: d[0], absoluta: false };
    }
  }

  /* Um parêntesis aberto que não fecha e que traz uma data é um ERRO, e não uma
     isenção que se estende até ao fim do bloco (leitura a frio, Blocking 4). */
  for (const a of pars.orfaos) {
    if (a < inicio && RE_DATA_INTEIRA.test(texto.slice(a))) {
      return { forma: 'parentesis-aberto', data: null, absoluta: false, erro: true };
    }
  }
  return null;
}

/** «N X em M»: o denominador escrito, ou null. */
function denominador(texto, fim) {
  const m = texto.slice(fim, fim + 40).match(new RegExp(`^\\s*(?:em|de|das|dos)\\s+(${ALGARISMOS})\\b`, 'u'));
  return m ? m[1] : null;
}

/** «N X cada», «N X por rota»: a afirmação é por unidade, e não um total. */
function distributiva(texto, fim) {
  return /^\s*(?:cada\b|por\s+[\wáéíóúâêôãõç]+)/iu.test(texto.slice(fim, fim + 24));
}

/* ========================================================================== *
 * 4 · OS VALORES DO SÍTIO: A UNIDADE E O ID MAIS PRÓXIMO
 * ========================================================================== */

const PALAVRAS_DE_FACTO = new Set(FACTOS.flatMap((f) => f.palavras));

/* O vocabulário das unidades vem do próprio livro-razão. Saem as que também são
   palavras de facto: essas já têm a regra do facto. */
const UNIDADES = [...new Set([...claims.values()].map((c) => c.unit).filter(Boolean))]
  .filter((u) => !PALAVRAS_DE_FACTO.has(u))
  .sort((a, b) => b.length - a.length);
const ALTERNATIVA_DAS_UNIDADES = UNIDADES.map(escapa).join('|');

const POR_UNIDADE = new Map();
for (const c of claims.values()) {
  if (!POR_UNIDADE.has(c.unit)) POR_UNIDADE.set(c.unit, []);
  POR_UNIDADE.get(c.unit).push(c);
}

const RE_V1 = new RegExp(
  `\\b([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\\wáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]+(?:\\s+d[aeo]s?\\s+[\\wáéíóúâêôãõç]+)?)\\s+tem\\s+(${ALGARISMOS})\\s+(${ALTERNATIVA_DAS_UNIDADES})(?![\\wáéíóúâêôãõç])`,
  'gu',
);
const RE_V2 = new RegExp(
  `${ANTES}(${ALGARISMOS})\\s+(${ALTERNATIVA_DAS_UNIDADES})(?![\\wáéíóúâêôãõç])`,
  'gu',
);

const RE_ID = /`([a-z0-9][a-z0-9-]{4,})`/g;

/**
 * O fim da frase onde um deslocamento cai: um ponto seguido de espaço, fora de
 * aspas e de parêntesis, ou o fim do bloco. Um ponto dentro de «…» não fecha
 * frase nenhuma, que é o caso de «Évora tem 58 567 pessoas.» dito entre aspas.
 */
function fimDaFrase(texto, desde) {
  let aspas = 0;
  let fundo = 0;
  for (let i = 0; i < desde; i++) {
    if (texto[i] === '«') aspas++;
    else if (texto[i] === '»') aspas--;
    else if (texto[i] === '(') fundo++;
    else if (texto[i] === ')') fundo--;
  }
  for (let i = desde; i < texto.length; i++) {
    const c = texto[i];
    if (c === '«') aspas++;
    else if (c === '»') aspas--;
    else if (c === '(') fundo++;
    else if (c === ')') fundo--;
    else if ((c === '.' || c === '!' || c === '?') && aspas <= 0 && fundo <= 0) {
      const seguinte = texto[i + 1];
      if (seguinte === undefined || /\s/.test(seguinte)) return i;
    }
  }
  return texto.length;
}

/** Os ids mais próximos, na forma do `src/lib/ledger.mjs`: valor, depois palavra. */
function idsProximos(numero, unidade, texto) {
  const alvo = normaliza(numero);
  const mesmos = (POR_UNIDADE.get(unidade) ?? [])
    .filter((c) => normaliza(c.value) === alvo)
    .map((c) => c.id);
  if (mesmos.length) return { razao: 'com este valor nesta unidade', ids: mesmos.slice(0, 5) };

  const palavras = [...texto.matchAll(/[A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç]{4,}/g)]
    .map((m) => semAcentos(m[0].toLowerCase()));
  const pontua = (universo) =>
    universo
      .map((c) => ({ id: c.id, n: c.id.split('-').filter((t) => t.length >= 4 && palavras.includes(t)).length }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n);
  for (const [universo, razao] of [
    [POR_UNIDADE.get(unidade) ?? [], `em "${unidade}" que nomeiam o mesmo assunto`],
    [[...claims.values()], 'que nomeiam o mesmo assunto'],
  ]) {
    const pontuados = pontua(universo);
    if (pontuados.length) {
      return { razao, ids: [...new Set(pontuados.map((x) => x.id))].slice(0, 5) };
    }
  }
  return { razao: `com a unidade "${unidade}"`, ids: (POR_UNIDADE.get(unidade) ?? []).map((c) => c.id).slice(0, 5) };
}

function semAcentos(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* ========================================================================== *
 * 5 · A LEITURA DOS DOCUMENTOS
 * ========================================================================== */

/**
 * Um documento a ler, com o corte da secção e o CHÃO de afirmações que hoje
 * produz. O chão está escrito à mão de propósito: é a medida de hoje, e uma
 * corrida que leia menos falha, ainda que não encontre erro nenhum. Uma
 * gramática partida por um acidente de escrita daria verde por não ver nada.
 */
const DOCUMENTOS = [
  /* Os mínimos são a colheita EXACTA de 02.09.2026, e não uma margem: assim
     qualquer afirmação que desapareça obriga a uma decisão escrita, em vez de
     passar despercebida. O `CLAUDE.md` leva zero porque não tem, nem nunca
     teve, uma afirmação de estado: a varredura de 02.09 varreu-o inteiro e
     reteve zero números. */
  { ficheiro: 'VISAO.md', minimo: 4 },
  { ficheiro: 'README.md', minimo: 15 },
  { ficheiro: 'design/especime-v3/PENDENTES-DO-DIRETOR.md', minimo: 3 },
  { ficheiro: 'CLAUDE.md', minimo: 0 },
  {
    ficheiro: 'design/observatorio/PLANO-fiabilidade-2026-09-02.md',
    ate: /^##\s+2\s/u,
    ateObrigatorio: true,
    minimo: 1,
  },
];

/**
 * OS BLOCOS DE UM DOCUMENTO, E PORQUE NÃO SÃO AS LINHAS.
 *
 * A frase «hoje oito | edições, seis portuguesas» parte-se na dobra das 78
 * colunas, e uma régua de linhas não a via. A unidade de leitura é o BLOCO:
 *
 *   · um parágrafo de prosa, com as suas dobras juntas por um espaço;
 *   · UM ITEM DE LISTA COM AS SUAS CONTINUAÇÕES INDENTADAS (a primeira versão
 *     fechava o item na primeira dobra, e bastava dobrar entre o número e a
 *     palavra do facto para o portão deixar de ver: leitura a frio, Major 6);
 *   · uma linha de tabela, um título ou uma citação, que valem sozinhos;
 *   · nada dentro de um bloco de código cercado, e uma cerca por fechar é um
 *     ERRO, porque calaria o resto do documento em silêncio.
 */
function blocosDe(ficheiro, doc) {
  const caminho = path.join(DOCS, ficheiro);
  if (!fs.existsSync(caminho)) {
    console.error(vermelho(`\n  PORTÃO DO REGISTO — falta ${ficheiro} em ${DOCS}.\n`));
    console.error('  Os cinco documentos que governam leem-se todos, ou não se lê nenhum.\n');
    process.exit(1);
  }
  const todas = fs.readFileSync(caminho, 'utf8').split('\n');
  const blocos = [];
  let atual = null;
  let dentroDeCerca = false;
  let cortou = false;
  let emItem = false;

  const fecha = () => {
    if (atual && atual.texto.trim()) blocos.push(atual);
    atual = null;
  };
  const junta = (l, n) => {
    if (!atual) atual = { n, texto: '', mapa: [] };
    const sep = atual.texto ? ' ' : '';
    atual.mapa.push({ off: atual.texto.length + sep.length, n });
    atual.texto += sep + l.trim();
  };

  for (let i = 0; i < todas.length; i++) {
    const l = todas[i];
    if (doc.ate && doc.ate.test(l)) {
      cortou = true;
      break;
    }
    if (/^\s*```/.test(l)) {
      dentroDeCerca = !dentroDeCerca;
      fecha();
      emItem = false;
      continue;
    }
    if (dentroDeCerca) continue;
    if (!l.trim()) {
      fecha();
      emItem = false;
      continue;
    }
    const eItem = /^\s*(?:[-*+]\s|\d+\.\s)/.test(l);
    const eRegisto = /^\s*(?:\||#{1,6}\s|>)/.test(l);
    const eIndentada = /^\s+\S/.test(l);

    if (eRegisto) {
      fecha();
      emItem = false;
      junta(l, i + 1);
      fecha();
      continue;
    }
    if (eItem) {
      fecha();
      emItem = true;
      junta(l, i + 1);
      continue;
    }
    /* Uma continuação indentada pertence ao item que a abriu; uma linha à
       margem, depois de um item, abre parágrafo novo. */
    if (emItem && !eIndentada) {
      fecha();
      emItem = false;
    }
    junta(l, i + 1);
  }
  fecha();

  if (dentroDeCerca) {
    erros.push(
      `${ficheiro}: uma cerca de código (\`\`\`) fica por fechar. Tudo o que vem depois dela ` +
        `deixaria de ser lido, e um portão que se cala por causa de três símbolos não é um portão.`,
    );
  }
  if (doc.ate && doc.ateObrigatorio && !cortou) {
    erros.push(
      `${ficheiro}: o título que corta a leitura (${doc.ate}) não aparece. Deste documento leem-se ` +
        `só as secções antes dele; sem o corte, ou se lia o documento inteiro em silêncio, ou se ` +
        `deixava de o ler. Reponha o título, ou mude o corte neste portão com a razão escrita.`,
    );
  }
  return blocos;
}

/** A linha física onde um deslocamento do bloco cai. */
function linhaDe(bloco, off) {
  let n = bloco.n;
  for (const p of bloco.mapa) {
    if (p.off <= off) n = p.n;
    else break;
  }
  return n;
}

function recorta(texto, inicio, fim) {
  const a = Math.max(0, inicio - 45);
  const b = Math.min(texto.length, fim + 45);
  return (a > 0 ? '…' : '') + texto.slice(a, b).trim() + (b < texto.length ? '…' : '');
}

/* ========================================================================== *
 * 6 · A VARREDURA
 * ========================================================================== */

const relatorio = [];

for (const doc of DOCUMENTOS) {
  const conta = {
    correntes: 0,
    datadas: [],
    ambiguas: [],
    subconjuntos: [],
    distributivas: [],
    valores: 0,
    erros: 0,
  };

  for (const bloco of blocosDe(doc.ficheiro, doc)) {
    const texto = bloco.texto;
    const pars = parentesis(texto);
    const onde = (off) => `${doc.ficheiro}:${linhaDe(bloco, off)}`;

    /* --- 6a · as afirmações de facto, nas duas ordens --------------------- */
    const achados = [];
    for (const m of texto.matchAll(RE_AFIRMACAO)) {
      achados.push({
        numero: m[1],
        palavra: m[2],
        inicio: m.index,
        fimDoNumero: m.index + m[1].length,
        fim: m.index + m[0].length,
      });
    }
    for (const m of texto.matchAll(RE_AFIRMACAO_INVERSA)) {
      const jaVisto = achados.some((a) => m.index < a.fim && m.index + m[0].length > a.inicio);
      if (jaVisto) continue;
      const desloc = m.index + m[0].lastIndexOf(m[2]);
      achados.push({
        numero: m[2],
        palavra: m[1],
        inicio: m.index,
        fimDoNumero: desloc + m[2].length,
        fim: m.index + m[0].length,
      });
    }
    achados.sort((a, b) => a.inicio - b.inicio);

    for (const a of achados) {
      const facto = PALAVRAS.find((p) => p.palavra.toLowerCase() === a.palavra.toLowerCase())?.facto;
      if (!facto) continue;

      if (distributiva(texto, a.fim)) {
        conta.distributivas.push({ onde: onde(a.inicio), texto: recorta(texto, a.inicio, a.fim) });
        continue;
      }

      const isen = isencao(texto, a.inicio, a.fimDoNumero, a.fim, pars);
      if (isen?.erro) {
        conta.erros++;
        erros.push(
          `${onde(a.inicio)}: «${recorta(texto, a.inicio, a.fim)}» está dentro de um parêntesis ` +
            `que ABRE E NÃO FECHA, e que traz uma data.\n` +
            `        Um parêntesis por fechar isentaria daqui até ao fim do bloco tudo o que lá ` +
            `estivesse. Feche o parêntesis, ou date a afirmação com « a dd.mm.aaaa » ao lado dela.`,
        );
        continue;
      }
      if (isen && (isen.absoluta || isen.data !== hoje)) {
        conta.datadas.push({
          onde: onde(a.inicio),
          texto: `${a.numero} ${a.palavra}`,
          forma: isen.forma,
          data: isen.data,
        });
        continue;
      }

      /* --- o subconjunto, «N X em M» ------------------------------------- */
      const den = denominador(texto, a.fim);
      if (den) {
        const n = valorDoNumero(a.numero);
        const m = valorDoNumero(den);
        let mal = false;
        if (m !== facto.valor) {
          mal = true;
          conta.erros++;
          erros.push(
            `${onde(a.inicio)} diz «${recorta(texto, a.inicio, a.fim)}» e o denominador ${den} não é ` +
              `o facto «${facto.nome}», que vale ${facto.valor}, medido em ${facto.fonte}.\n` +
              `        Reproduz-se com: ${facto.comando}`,
          );
        }
        if (n > m) {
          mal = true;
          conta.erros++;
          erros.push(
            `${onde(a.inicio)} diz «${recorta(texto, a.inicio, a.fim)}»: a parte (${n}) é maior do que ` +
              `o todo (${m}). Um subconjunto maior do que o conjunto é sempre um erro.`,
          );
        }
        if (facto.subconjunto) {
          if (n !== facto.subconjunto.valor) {
            mal = true;
            conta.erros++;
            erros.push(
              `${onde(a.inicio)} diz «${recorta(texto, a.inicio, a.fim)}» e o subconjunto ` +
                `«${facto.subconjunto.nome}» vale ${facto.subconjunto.valor}, medido em ` +
                `${facto.subconjunto.fonte}.\n` +
                `        O denominador está certo e o numerador não: a parte que se cita também se mede.`,
            );
          }
        }
        conta.subconjuntos.push({
          onde: onde(a.inicio),
          texto: `${a.numero} ${a.palavra} em ${den}`,
          numeradorConferido: Boolean(facto.subconjunto) && !mal,
          contra: facto.subconjunto ? `${facto.subconjunto.nome} = ${facto.subconjunto.valor}` : null,
        });
        continue;
      }

      /* --- a afirmação corrente ------------------------------------------ */
      conta.correntes++;
      if (valorDoNumero(a.numero) === facto.valor) continue;

      conta.erros++;
      erros.push(
        `${onde(a.inicio)} diz «${recorta(texto, a.inicio, a.fim)}» e o facto «${facto.nome}» vale ` +
          `${facto.valor}, medido em ${facto.fonte}.\n` +
          `        A frase não traz data atracada, e uma frase sem data é o estado de hoje. Ou o ` +
          `número passa a ${facto.valor}, ou a frase data-se: «${facto.valor} a ${hoje}; dizia ` +
          `«${a.numero} ${a.palavra}»».\n` +
          `        Reproduz-se com: ${facto.comando}`,
      );
    }

    /* --- 6b · a palavra ambígua, dita e não conferida --------------------- */
    for (const m of texto.matchAll(RE_AMBIGUA)) {
      const janela = texto.slice(Math.max(0, m.index - 4), m.index + m[0].length + 26);
      if (/edições (?:do arquivo|publicadas|com registo)/i.test(janela)) continue;
      conta.ambiguas.push({ onde: onde(m.index), texto: m[0].trim() });
    }

    /* --- 6c · os valores do sítio, e o id mais próximo -------------------- */
    const valores = [];
    for (const m of texto.matchAll(RE_V1)) {
      const desloc = m.index + m[0].lastIndexOf(m[2] + ' ' + m[3]);
      valores.push({ numero: m[2], unidade: m[3], inicio: m.index, num: desloc, fim: m.index + m[0].length });
    }
    for (const m of texto.matchAll(RE_V2)) {
      if (valores.some((v) => m.index >= v.inicio && m.index < v.fim)) continue;
      valores.push({ numero: m[1], unidade: m[2], inicio: m.index, num: m.index, fim: m.index + m[0].length });
    }

    if (valores.length) {
      const ids = [...texto.matchAll(RE_ID)]
        .map((m) => ({ id: m[1], pos: m.index }))
        .filter((x) => claims.has(x.id));

      for (const v of valores) {
        conta.valores++;
        const limite = fimDaFrase(texto, v.fim);
        /* O ID QUE VALE É O MAIS PRÓXIMO DEPOIS DO NÚMERO, NA MESMA FRASE, e não
           «algum id do bloco» (leitura a frio, Major 7). */
        const candidato = ids.filter((x) => x.pos >= v.num && x.pos <= limite).sort((a, b) => a.pos - b.pos)[0];
        const alvo = normaliza(v.numero);
        if (candidato) {
          const c = claims.get(candidato.id);
          if (normaliza(c.value) === alvo && c.unit === v.unidade) continue;
          conta.erros++;
          const proximos = idsProximos(v.numero, v.unidade, texto);
          erros.push(
            `${onde(v.num)} escreve o valor «${v.numero} ${v.unidade}» e o id mais próximo depois ` +
              `dele, \`${candidato.id}\`, diz "${c.value}" em "${c.unit}".\n` +
              `        «${recorta(texto, v.inicio, v.fim)}»\n` +
              `        O id que prova um valor é o que está ao lado dele, e não outro qualquer do ` +
              `bloco. Ids ${proximos.razao}: ${proximos.ids.map((i) => '`' + i + '`').join(', ') || 'nenhum'}.`,
          );
          continue;
        }
        conta.erros++;
        const proximos = idsProximos(v.numero, v.unidade, texto);
        const outros = ids.length ? ` Há ${ids.length} id(s) no bloco, nenhum depois do número nesta frase.` : '';
        erros.push(
          `${onde(v.num)} escreve o valor «${v.numero} ${v.unidade}» e não traz o id da linha entre ` +
            `plicas depois do número, na mesma frase.${outros}\n` +
            `        «${recorta(texto, v.inicio, v.fim)}»\n` +
            `        Um valor do sítio citado num documento que governa cita a linha que o prova. ` +
            `Ids ${proximos.razao}: ${proximos.ids.map((i) => '`' + i + '`').join(', ') || 'nenhum'}.`,
        );
      }
    }
  }

  /* O CHÃO: um verde só conta se a régua leu mesmo alguma coisa. */
  const avaliadas =
    conta.correntes + conta.datadas.length + conta.subconjuntos.length + conta.valores;
  if (avaliadas < doc.minimo) {
    conta.erros++;
    erros.push(
      `${doc.ficheiro}: a régua avaliou ${avaliadas} afirmação(ões) e o chão deste documento é ` +
        `${doc.minimo}.\n` +
        `        Ou o documento perdeu afirmações que tinha, ou a gramática deixou de as ver. Nos ` +
        `dois casos o verde não valia nada, e por isso é vermelho. Se o documento encolheu de ` +
        `propósito, baixe o chão em DOCUMENTOS com a razão escrita.`,
    );
  }

  relatorio.push({ doc: doc.ficheiro, minimo: doc.minimo, avaliadas, conta });
}

/* ========================================================================== *
 * 7 · O RELATÓRIO
 * ========================================================================== */

console.log('');
console.log(cinza('  registo · os números dos documentos que governam, contra a fonte'));
if (DOCS !== RAIZ) {
  console.log(amarelo(`  PROVA: documentos lidos de ${DOCS} (OEDP_REGISTO_DIR com --prova)`));
}
console.log('');
console.log(cinza('  os factos, medidos:'));
for (const f of FACTOS) {
  const extras = [
    f.segunda ? `2.ª medição: ${f.segunda.nome}` : 'uma só fonte',
    f.linha ? `linha \`${f.linha}\`` : null,
    f.subconjunto ? `subconjunto: ${f.subconjunto.nome} = ${f.subconjunto.valor}` : null,
  ].filter(Boolean);
  console.log(cinza(`    ${String(f.valor).padStart(5)}  ${f.nome.padEnd(52)} ${f.fonte}`));
  console.log(cinza(`           ${extras.join(' · ')}`));
}
console.log('');
console.log(cinza(`  hoje é ${hoje}; uma afirmação datada de hoje confere-se como corrente.`));
console.log('');

let correntes = 0;
let datadas = 0;
let valores = 0;
let subconjuntos = 0;
for (const { doc, minimo, avaliadas, conta } of relatorio) {
  correntes += conta.correntes;
  datadas += conta.datadas.length;
  valores += conta.valores;
  subconjuntos += conta.subconjuntos.length;
  const marca = conta.erros ? vermelho('✗') : verde('✓');
  console.log(
    `  ${marca} ${doc.padEnd(48)} ${String(conta.correntes).padStart(2)} corrente(s) · ` +
      `${String(conta.datadas.length).padStart(2)} datada(s) · ${String(conta.subconjuntos.length).padStart(2)} subconjunto(s) · ` +
      `${String(conta.valores).padStart(2)} valor(es) do sítio · ${avaliadas} avaliada(s), chão ${minimo}`,
  );
  for (const d of conta.datadas) {
    console.log(cinza(`      ${d.onde} «${d.texto}» saltada pela forma (${d.forma})` + (d.data ? ` · ${d.data}` : '')));
  }
  for (const s of conta.subconjuntos) {
    console.log(
      cinza(
        `      ${s.onde} «${s.texto}» subconjunto: denominador conferido; numerador ` +
          (s.numeradorConferido ? `conferido contra ${s.contra}` : 'NÃO conferido (o facto não declara subconjunto medido)'),
      ),
    );
  }
  for (const d of conta.distributivas) {
    console.log(cinza(`      ${d.onde} «${d.texto}» distributiva (é por unidade, não é um total): não conferida`));
  }
  for (const a of conta.ambiguas) {
    console.log(
      cinza(
        `      ${a.onde} «${a.texto}» não conferida: «edições» diz o arquivo (${EDITIONS.length}) e as ` +
          `páginas de leitura (${paginasDeLeitura()}); o facto escreve-se com o composto.`,
      ),
    );
  }
}

console.log('');

if (erros.length) {
  console.error(vermelho(`  O REGISTO NÃO PASSA — ${erros.length} número(s) que não resolvem:`));
  console.error('');
  for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e + '\n');
  console.error('  Um número num documento que governa cita a coisa medida, ou data-se.');
  console.error('  A forma da casa é «N a dd.mm.aaaa; dizia «M»»: nunca se reescreve em silêncio.');
  console.error('');
  process.exit(1);
}

const comSegunda = FACTOS.filter((f) => f.segunda).length;
const comLinha = FACTOS.filter((f) => f.linha).length;
console.log(
  '  ' +
    verde('✓') +
    ` ${FACTOS.length} facto(s) medidos na fonte (${comSegunda} com segunda medição, ${comLinha} ` +
    `reconciliados com a linha que os publica) · ${correntes} afirmação(ões) corrente(s) conferida(s) · ` +
    `${datadas} datada(s) saltada(s) · ${subconjuntos} subconjunto(s) · ${valores} valor(es) do sítio ` +
    `com o id ao lado`,
);
console.log(
  cinza(
    `        ${DOCUMENTOS.length} documento(s) lidos · ${UNIDADES.length} unidade(s) no vocabulário do ` +
      `livro-razão · chão total ${DOCUMENTOS.reduce((s, d) => s + d.minimo, 0)} · prosa não se lê: ` +
      `«hoje só \`evora\`» e «o arquivo vazio» são do check:prosa (F3.1).`,
  ),
);
console.log('');
