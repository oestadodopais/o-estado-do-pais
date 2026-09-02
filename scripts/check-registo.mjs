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
 * ---------------------------------------------------------------------------
 * A GRAMÁTICA: O QUE É UMA AFIRMAÇÃO CORRENTE E O QUE É UMA AFIRMAÇÃO DATADA
 * ---------------------------------------------------------------------------
 * Uma AFIRMAÇÃO é um número seguido da palavra de um facto («2 916 linhas»,
 * «308 concelhos», «doze estudos», «quinze passos», «dezasseis documentos»,
 * «três correções»). É CORRENTE por omissão, e então tem de ser igual ao valor
 * medido. É DATADA, e sai da conferência, por uma de três formas, e só por
 * essas três (a forma é que a torna reconhecível; nenhuma se adivinha):
 *
 *   (i)     o número seguido de « a dd.mm.aaaa » no mesmo bloco
 *           verde:  «2 602 linhas a 30.08.2026»
 *           verde:  «/livro-razao.csv, 2 916 linhas a 02.09.2026»
 *   (ii)    o número dentro de um parêntesis que carrega uma data
 *           verde:  «(2 602 linhas a 30.08.2026)» · «(132 linhas, 18.08.2026)»
 *   (iii-a) o número DENTRO da citação que «dizia» abre («eram», «era» e
 *           «tinha» valem o mesmo)
 *           verde:  «2 916 a 02.09.2026; corrigido nesse dia: dizia «132 linhas»»
 *   (iii-b) o número logo a seguir a essa palavra, sem citação pelo meio
 *           verde:  «eram 2 602 linhas»
 *
 * A forma (iii) é exacta e não é uma janela cega à volta da palavra. A primeira
 * versão deste portão media 40 símbolos para trás e saltava «dizia «treze»):
 * todas as dezasseis edições do arquivo», onde a citação já tinha fechado e a
 * frase seguinte era corrente. Uma isenção larga demais é um portão desligado.
 *
 * E é CORRENTE, sem apelo:
 *
 *   vermelho: «2 602 linhas»            (sem data nenhuma)
 *   vermelho: «132 linhas»              (sem data nenhuma)
 *   vermelho: «são oito passos encadeados»
 *   vermelho: «alojados treze documentos»
 *
 * UMA EMENDA À REGRA (i) E (ii), e é a que impede o portão de se desarmar
 * sozinho: uma data que é a de HOJE não isenta. «2 916 linhas a 02.09.2026»,
 * lido a 02.09.2026, afirma o valor de hoje e confere-se como corrente; lido a
 * 03.09.2026 já é história e sai. Sem esta emenda bastava carimbar a data do
 * dia em qualquer número errado para o portão o deixar passar. A regra (iii) é
 * absoluta e não leva emenda: «dizia «M»» declara-se, pela própria palavra,
 * como o valor antigo.
 *
 * A FORMA DA CORREÇÃO, que é a da casa: nunca se reescreve um número em
 * silêncio. Escreve-se «N a 02.09.2026; dizia «M»» — o valor novo, a data em
 * que se mediu, e o que lá estava.
 *
 * DUAS PRECAUÇÕES DA GRAMÁTICA, ambas medidas neste corpus e não supostas:
 *
 *   · «um», «uma», «dois» e «duas» NÃO são números para este portão. Nestes
 *     cinco documentos são sempre artigo («uma linha por registo», «um estudo
 *     migrado») ou as duas edições de língua («nas duas edições»), nunca a
 *     contagem de um facto da casa. Contam-se 21 ocorrências e nenhuma é uma
 *     afirmação de estado. Uma contagem verdadeira de um ou de dois escreve-se
 *     em algarismos.
 *   · «N X em M» é um subconjunto, e o que se confere é M, o denominador.
 *     «o painel semanal confere 32 linhas em 2 916» é verdadeiro e verde: 32 é
 *     a amostra, 2 916 é o facto.
 *
 * O QUE SE LÊ DE CADA VEZ É UM BLOCO, e não uma linha física: um parágrafo com
 * as suas dobras juntas, uma linha de tabela (que é um registo e vale sozinha),
 * um título ou um item de lista. A razão está em `blocosDe()`, e é medida: a
 * frase «hoje oito edições, seis portuguesas» parte-se na dobra das 78 colunas
 * e uma régua de linhas não a via. O erro imprime na mesma a linha física.
 *
 * ---------------------------------------------------------------------------
 * A PALAVRA AMBÍGUA QUE NÃO SE CONFERE, e porquê
 * ---------------------------------------------------------------------------
 * «edições» quer dizer duas coisas diferentes nestes documentos, e as duas
 * estão certas: as 16 edições do arquivo (`src/data/studies.mjs`) e as 8
 * edições com registo de conteúdo, que são as que têm página de leitura
 * (`registos/manifest.json`). Um portão que conferisse a palavra nua punha
 * vermelha uma frase verdadeira. Por isso a palavra do facto é o composto
 * («edições do arquivo», «edições publicadas»; «edições com registo»), e a
 * palavra nua é declarada AMBÍGUA: sai da conferência e diz-se no relatório,
 * com a linha onde apareceu. Um portão que salta uma frase e não o diz é pior
 * do que um portão que não existe.
 *
 * ---------------------------------------------------------------------------
 * O VALOR DO SÍTIO CITADO SEM O ID DA LINHA
 * ---------------------------------------------------------------------------
 * Um número que é um valor publicado pelo sítio não se escreve nestes
 * documentos sem o id da linha que o prova, no mesmo bloco, entre plicas:
 *
 *   vermelho: «A cabeça diz «Évora tem 53 011 pessoas.»»
 *             (id ao lado, e o valor da linha é 58 567)
 *   vermelho: «A cabeça diz «Évora tem 58 567 pessoas.»»
 *             (valor certo, nenhum id no bloco)
 *   verde:    «A cabeça diz «Évora tem 58 567 pessoas.» (a linha
 *             `evora-populacao-2025` diz 58 567 desde 15.08)»
 *
 * Duas formas disparam a regra, e nunca mais nenhuma:
 *
 *   V1  «<Nome> tem <número> <unidade>» — um nome próprio, o verbo, o número e
 *       uma unidade do livro-razão. É a forma da manchete, e é a que falhou.
 *   V2  «<número em algarismos> <unidade>» — a unidade tal como o livro-razão
 *       a escreve. Só algarismos: um valor medido escreve-se em algarismos, e
 *       as unidades por extenso destes documentos («duas edições», «quinze
 *       anos») são prosa. As quatro unidades que também são palavras de facto
 *       («estudos», «edições», «correções», «municípios») ficam com a regra do
 *       facto, que já as confere, e saem daqui.
 *
 * A separação dos milhares normaliza-se antes de comparar: U+202F, U+00A0,
 * U+2009, espaço comum ou nenhum são o mesmo número. A varredura de 02.09
 * mediu as três camadas da casa a escreverem-no de três maneiras (U+0020 na
 * prosa, U+00A0 no HTML servido, U+202F no CSV e no JSON).
 *
 * Sem id no bloco, o erro nomeia os ids mais próximos, como faz o
 * `src/lib/ledger.mjs`: primeiro os que têm aquele valor naquela unidade,
 * depois os que partilham uma palavra com o bloco dentro da mesma unidade, e
 * só por fim os do livro-razão inteiro.
 *
 * ---------------------------------------------------------------------------
 * O POSITIVO CONHECIDO (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Um zero só conta depois de a régua ter visto um vermelho. A porta do estrago
 * plantado é uma variável de ambiente, como o `OEDP_DIRECAO` do portão da voz
 * e o `OEDP_REGISTOS_DIR` do portão dos documentos, e pela mesma razão:
 *
 *   · `OEDP_REGISTO_DIR` — uma CÓPIA dos documentos, com o número trocado.
 *     Os factos continuam a medir-se na árvore verdadeira; o que se planta é
 *     só o que se lê. Planta-se numa cópia, nunca no que a casa publica.
 *
 * Uso:  node scripts/check-registo.mjs
 *       OEDP_REGISTO_DIR=/tmp/copia node scripts/check-registo.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadClaims, contagensDoRegisto } from '../src/lib/ledger.mjs';
import { WORKS, EDITIONS } from '../src/data/studies.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { todosOsDocumentos } from '../src/lib/documentos.mjs';

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..');

/* Os factos medem-se SEMPRE na árvore verdadeira; só a leitura muda de sítio. */
const DOCS = process.env.OEDP_REGISTO_DIR ?? RAIZ;

/** Separadores de milhar que a casa usa nas suas três camadas, mais o comum. */
const SEPARADORES = /[    ]/g;

/** «2 916», «2916», «308» → "2916". Um valor com vírgula decimal fica como está. */
function normaliza(n) {
  return String(n).replace(SEPARADORES, '').trim();
}

const erros = [];
const avisos = [];

/* ========================================================================== *
 * 1 · OS FACTOS, MEDIDOS NA FONTE
 * ========================================================================== */

const claims = loadClaims();

function contaFicheirosDoLivro() {
  return fs.readdirSync(path.join(RAIZ, 'ledger', 'claims')).filter((f) => f.endsWith('.yml')).length;
}

function passosDaConstrucao() {
  const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8'));
  const cadeia = pkg.scripts?.build ?? '';
  return cadeia
    .split('&&')
    .map((s) => s.trim())
    .filter(Boolean).length;
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
 * reproduz, e a linha do livro-razão que o publica quando existe (e então as
 * duas medições têm de bater uma na outra: é a reconciliação, e é o ponto).
 */
const FACTOS = [
  {
    id: 'linhas',
    nome: 'linhas do livro-razão',
    palavras: ['linhas do livro-razão', 'linhas'],
    fonte: 'ledger/claims/*.yml',
    comando: "ls ledger/claims/*.yml | wc -l",
    valor: contaFicheirosDoLivro(),
    segunda: { nome: 'loadClaims().size', valor: claims.size },
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
  },
  {
    id: 'paginas_de_leitura',
    nome: 'páginas de leitura (edições com registo de conteúdo)',
    palavras: ['páginas de leitura', 'edições com registo de conteúdo', 'edições com registo'],
    fonte: 'registos/manifest.json',
    comando:
      "node -e \"console.log(Object.keys(require('./registos/manifest.json').registos).length)\"",
    valor: paginasDeLeitura(),
  },
];

/* A reconciliação das duas medições do mesmo facto, e da linha que o publica.
   Um facto que se mede de duas maneiras e dá dois números não é um facto. */
for (const f of FACTOS) {
  if (f.segunda && f.segunda.valor !== f.valor) {
    erros.push(
      `O facto «${f.nome}» mede-se de duas maneiras e dá dois números: ` +
        `${f.fonte} diz ${f.valor} e ${f.segunda.nome} diz ${f.segunda.valor}. ` +
        `Enquanto discordarem, nenhum documento pode citar nenhum dos dois.`,
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
 * 2 · A GRAMÁTICA
 * ========================================================================== */

/**
 * Os números por extenso. «um», «uma», «dois» e «duas» não entram: ver a
 * precaução da grammar acima. A lista sobe até vinte, que é o que estes
 * documentos usam; acima disso escreve-se em algarismos.
 */
const POR_EXTENSO = {
  três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9,
  dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quinze: 15, dezasseis: 16,
  dezassete: 17, dezoito: 18, dezanove: 19, vinte: 20,
};

/* Um número em algarismos com os separadores da casa, ou um número por extenso.
   Nunca com ponto: assim uma data («02.09.2026») nunca é lida como número. */
const ALGARISMOS = '\\d{1,3}(?:[\\u202f\\u00a0\\u2009 ]\\d{3})+|\\d+';
const EXTENSO = Object.keys(POR_EXTENSO).join('|');
const NUMERO = `(?:${ALGARISMOS}|${EXTENSO})`;

function valorDoNumero(cru) {
  const s = cru.trim().toLowerCase();
  if (s in POR_EXTENSO) return POR_EXTENSO[s];
  const n = Number(normaliza(s));
  return Number.isFinite(n) ? n : null;
}

/* As palavras de todos os factos, as mais compridas primeiro: «páginas de
   leitura» tem de ganhar a «páginas», e «edições do arquivo» a «edições». */
const PALAVRAS = FACTOS.flatMap((f) => f.palavras.map((p) => ({ palavra: p, facto: f })))
  .sort((a, b) => b.palavra.length - a.palavra.length);

const RE_AFIRMACAO = new RegExp(
  `(?<![\\d.,/§-])(${NUMERO})\\s*\\*{0,2}\\s*(?:\`)?(${PALAVRAS.map((p) => escapa(p.palavra)).join('|')})(?![\\wáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ-])`,
  'giu',
);

/* A palavra nua que quer dizer duas coisas, e por isso não se confere. */
const RE_AMBIGUA = new RegExp(`(?<![\\d.,/§-])(${NUMERO})\\s*\\*{0,2}\\s*(edições|edição)(?![\\wáéíóúâêôãõç-])`, 'giu');

const RE_DATA = /\b(\d{2})\.(\d{2})\.(\d{4})\b/;
const RE_DATA_CURTA = /\b\d{2}\.\d{2}\b/;
const RE_HISTORICO = /\b(dizia|diziam|eram|era|tinha|tinham)\b/i;

function escapa(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const hoje = (() => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
})();

/**
 * A data que isenta uma afirmação, ou null. Devolve também de que forma veio,
 * para o relatório dizer porque saltou cada uma.
 */
function dataDaAfirmacao(linha, inicio, fim) {
  /* (iii) o valor antigo, declarado como tal. Não basta a palavra estar por
     perto: a primeira versão deste portão saltava «dizia «treze»): todas as
     dezasseis edições do arquivo», onde a citação já tinha fechado e a frase
     seguinte era corrente. Por isso são duas formas exactas:
       (iii-a) o número DENTRO da citação que «dizia» abre;
       (iii-b) o número logo a seguir à palavra, sem citação pelo meio. */
  const prefixo = linha.slice(0, inicio);
  const abertas = (prefixo.match(/«/g) ?? []).length - (prefixo.match(/»/g) ?? []).length;
  if (abertas > 0) {
    const aspa = prefixo.lastIndexOf('«');
    if (RE_HISTORICO.test(linha.slice(Math.max(0, aspa - 20), aspa))) {
      return { forma: 'iii-a', data: null, absoluta: true };
    }
  }
  const perto = linha.slice(Math.max(0, inicio - 15), inicio);
  if (RE_HISTORICO.test(perto) && !/[«»]/.test(perto)) {
    return { forma: 'iii-b', data: null, absoluta: true };
  }

  /* (i) o número seguido de « a dd.mm.aaaa » na mesma linha, até 60 símbolos */
  const depois = linha.slice(fim, fim + 60);
  const m = depois.match(/\ba (\d{2}\.\d{2}\.\d{4})\b/);
  if (m) return { forma: 'i', data: m[1], absoluta: false };

  /* (ii) dentro de um parêntesis que carrega uma data */
  const abre = linha.lastIndexOf('(', inicio);
  if (abre !== -1) {
    const fecha = linha.indexOf(')', fim);
    const dentro = linha.slice(abre, fecha === -1 ? linha.length : fecha + 1);
    const d = dentro.match(RE_DATA);
    if (d) return { forma: 'ii', data: d[0], absoluta: false };
    if (RE_DATA_CURTA.test(dentro)) return { forma: 'ii', data: null, absoluta: true };
  }
  return null;
}

/** «N X em M»: o que se confere é M, o denominador. */
function denominador(linha, fim) {
  const m = linha.slice(fim, fim + 30).match(new RegExp(`^\\s*(?:em|de|das|dos)\\s+(${ALGARISMOS})\\b`, 'u'));
  return m ? m[1] : null;
}

/* ========================================================================== *
 * 3 · OS VALORES DO SÍTIO: A UNIDADE E O ID DA LINHA
 * ========================================================================== */

const PALAVRAS_DE_FACTO = new Set(FACTOS.flatMap((f) => f.palavras));

/* O vocabulário das unidades vem do próprio livro-razão. Saem as quatro que
   também são palavras de facto: essas já têm a regra do facto. */
const UNIDADES = [...new Set([...claims.values()].map((c) => c.unit).filter(Boolean))]
  .filter((u) => !PALAVRAS_DE_FACTO.has(u))
  .sort((a, b) => b.length - a.length);

const POR_UNIDADE = new Map();
for (const c of claims.values()) {
  if (!POR_UNIDADE.has(c.unit)) POR_UNIDADE.set(c.unit, []);
  POR_UNIDADE.get(c.unit).push(c);
}

const RE_V1 = new RegExp(
  `\\b([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\\wáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]+(?:\\s+d[aeo]s?\\s+[\\wáéíóúâêôãõç]+)?)\\s+tem\\s+(${ALGARISMOS})\\s+(${UNIDADES.map(escapa).join('|')})(?![\\wáéíóúâêôãõç])`,
  'gu',
);
const RE_V2 = new RegExp(
  `(?<![\\d.,/§-])(${ALGARISMOS})\\s+(${UNIDADES.map(escapa).join('|')})(?![\\wáéíóúâêôãõç])`,
  'gu',
);

const RE_ID = /`([a-z0-9][a-z0-9-]{4,})`/g;

/** Os ids mais próximos, na forma do `src/lib/ledger.mjs`: valor, depois palavra. */
function idsProximos(numero, unidade, linha) {
  const alvo = normaliza(numero);
  const mesmos = (POR_UNIDADE.get(unidade) ?? [])
    .filter((c) => normaliza(c.value) === alvo)
    .map((c) => c.id);
  if (mesmos.length) return { razao: 'com este valor nesta unidade', ids: mesmos.slice(0, 5) };

  /* Depois, os que partilham uma palavra com o bloco. A unidade escrita manda:
     um valor em «pessoas» procura-se entre as linhas em «pessoas», e só quando
     nenhuma dessas nomeia o assunto é que se olha para o livro-razão inteiro. */
  const palavras = [...linha.matchAll(/[A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç]{4,}/g)]
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
  const daUnidade = (POR_UNIDADE.get(unidade) ?? []).map((c) => c.id);
  return { razao: `com a unidade "${unidade}"`, ids: daUnidade.slice(0, 5) };
}

function semAcentos(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* ========================================================================== *
 * 4 · A LEITURA DOS DOCUMENTOS
 * ========================================================================== */

/**
 * Um documento a ler. `ate` corta a leitura numa secção: do plano lê-se só o
 * §0 e o §1, que são as garantias e as regras; o resto são tabelas de blocos
 * por construir, onde um número é uma medida de aceitação e não um estado.
 */
const DOCUMENTOS = [
  { ficheiro: 'VISAO.md' },
  { ficheiro: 'README.md' },
  { ficheiro: 'design/especime-v3/PENDENTES-DO-DIRETOR.md' },
  { ficheiro: 'CLAUDE.md' },
  { ficheiro: 'design/observatorio/PLANO-fiabilidade-2026-09-02.md', ate: /^## 2 · / },
];

/**
 * OS BLOCOS DE UM DOCUMENTO, E PORQUE NÃO SÃO AS LINHAS.
 *
 * A primeira versão deste portão lia linha a linha, e não via o README a dizer
 * «hoje oito | edições, seis portuguesas»: a frase parte-se na dobra das 78
 * colunas e as duas metades ficam em linhas diferentes. Uma régua que uma
 * mudança de parágrafo desarma não é uma régua. Por isso a unidade de leitura
 * é o BLOCO, que é a frase inteira tal como se lê:
 *
 *   · um parágrafo de prosa, com as suas dobras juntas por um espaço;
 *   · uma linha de tabela (começa por «|»), que é um registo e vale sozinha;
 *   · um título ou um item de lista, que abrem bloco novo;
 *   · nada dentro de um bloco de código cercado.
 *
 * É também dentro do bloco que se procura o id da linha do livro-razão, e não
 * dentro da linha física: numa tabela as duas coisas são o mesmo, e num
 * parágrafo dobrado o id fica na dobra seguinte. Cada achado guarda na mesma a
 * linha física em que começa, que é o que o erro imprime.
 */
function blocosDe(ficheiro, ate) {
  const caminho = path.join(DOCS, ficheiro);
  if (!fs.existsSync(caminho)) {
    /* Um documento que governa não desaparece: ou está lá, ou o portão pára.
       Apagar o ficheiro não é maneira de passar a régua. */
    console.error(vermelho(`\n  PORTÃO DO REGISTO — falta ${ficheiro} em ${DOCS}.\n`));
    console.error('  Os cinco documentos que governam leem-se todos, ou não se lê nenhum.\n');
    process.exit(1);
  }
  const cru = fs.readFileSync(caminho, 'utf8');
  const todas = cru.split('\n');
  const blocos = [];
  let atual = null;
  let dentroDeCerca = false;

  const fecha = () => {
    if (atual && atual.texto.trim()) blocos.push(atual);
    atual = null;
  };

  for (let i = 0; i < todas.length; i++) {
    const l = todas[i];
    if (ate && ate.test(l)) break;
    if (/^\s*```/.test(l)) {
      dentroDeCerca = !dentroDeCerca;
      fecha();
      continue;
    }
    if (dentroDeCerca) continue;
    if (!l.trim()) {
      fecha();
      continue;
    }
    /* Um registo por si: linha de tabela, título, item de lista, citação. */
    const sozinha = /^\s*(?:\||#{1,6}\s|[-*+]\s|\d+\.\s|>)/.test(l);
    if (sozinha) fecha();
    if (!atual) atual = { n: i + 1, texto: '', mapa: [] };
    const junta = atual.texto ? ' ' : '';
    atual.mapa.push({ off: atual.texto.length + junta.length, n: i + 1 });
    atual.texto += junta + l.trim();
    if (sozinha) fecha();
  }
  fecha();
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

const relatorio = [];

for (const doc of DOCUMENTOS) {
  const conta = { correntes: 0, datadas: [], ambiguas: [], subconjuntos: 0, valores: 0, erros: 0 };

  for (const bloco of blocosDe(doc.ficheiro, doc.ate)) {
    const texto = bloco.texto;
    const onde = (off) => `${doc.ficheiro}:${linhaDe(bloco, off)}`;

    /* --- 4a · as afirmações de facto ------------------------------------- */
    for (const m of texto.matchAll(RE_AFIRMACAO)) {
      const facto = PALAVRAS.find((p) => p.palavra.toLowerCase() === m[2].toLowerCase())?.facto;
      if (!facto) continue;
      const inicio = m.index;
      const fim = m.index + m[0].length;

      const den = denominador(texto, fim);
      const escrito = den ?? m[1];
      if (den) conta.subconjuntos++;

      const datada = dataDaAfirmacao(texto, inicio, fim);
      if (datada && (datada.absoluta || datada.data !== hoje)) {
        conta.datadas.push({ onde: onde(inicio), texto: m[0].trim(), forma: datada.forma, data: datada.data });
        continue;
      }

      conta.correntes++;
      const escritoValor = valorDoNumero(escrito);
      if (escritoValor === facto.valor) continue;

      conta.erros++;
      erros.push(
        `${onde(inicio)} diz «${recorta(texto, inicio, fim)}» e o facto «${facto.nome}» vale ` +
          `${facto.valor}, medido em ${facto.fonte}.\n` +
          `        A frase não traz data, e uma frase sem data é o estado de hoje. Ou o número passa a ` +
          `${facto.valor}, ou a frase datou-se: «${facto.valor} a ${hoje}; dizia «${escrito}»».\n` +
          `        Reproduz-se com: ${facto.comando}`,
      );
    }

    /* --- 4b · a palavra ambígua, dita e não conferida --------------------- */
    for (const m of texto.matchAll(RE_AMBIGUA)) {
      const antes = texto.slice(Math.max(0, m.index - 4), m.index + m[0].length + 26);
      if (/edições (?:do arquivo|publicadas|com registo)/i.test(antes)) continue;
      conta.ambiguas.push({ onde: onde(m.index), texto: m[0].trim() });
    }

    /* --- 4c · os valores do sítio, e o id da linha ------------------------ */
    const encontrados = [];
    for (const m of texto.matchAll(RE_V1)) {
      encontrados.push({ numero: m[2], unidade: m[3], sujeito: m[1], forma: 'V1', inicio: m.index, fim: m.index + m[0].length });
    }
    for (const m of texto.matchAll(RE_V2)) {
      if (encontrados.some((e) => m.index >= e.inicio && m.index < e.fim)) continue;
      encontrados.push({ numero: m[1], unidade: m[2], sujeito: null, forma: 'V2', inicio: m.index, fim: m.index + m[0].length });
    }

    if (encontrados.length) {
      const ids = [...texto.matchAll(RE_ID)].map((m) => m[1]).filter((id) => claims.has(id));
      for (const v of encontrados) {
        conta.valores++;
        const alvo = normaliza(v.numero);
        const certo = ids.find((id) => normaliza(claims.get(id).value) === alvo && claims.get(id).unit === v.unidade);
        if (certo) continue;

        conta.erros++;
        const proximos = idsProximos(v.numero, v.unidade, texto);
        if (!ids.length) {
          erros.push(
            `${onde(v.inicio)} escreve o valor «${v.numero} ${v.unidade}» e o bloco não traz nenhum id ` +
              `do livro-razão entre plicas.\n` +
              `        «${recorta(texto, v.inicio, v.fim)}»\n` +
              `        Um valor do sítio citado num documento que governa cita a linha que o prova. ` +
              `Ids ${proximos.razao}: ${proximos.ids.map((i) => '`' + i + '`').join(', ') || 'nenhum'}.`,
          );
        } else {
          const conflito = ids
            .filter((id) => claims.get(id).unit === v.unidade)
            .map((id) => `\`${id}\` diz "${claims.get(id).value}"`);
          erros.push(
            `${onde(v.inicio)} escreve o valor «${v.numero} ${v.unidade}» e nenhum id do bloco o confirma.\n` +
              `        «${recorta(texto, v.inicio, v.fim)}»\n` +
              `        ${conflito.length ? conflito.join('; ') + '.' : 'Os ids do bloco são de outra unidade.'} ` +
              `Ids ${proximos.razao}: ${proximos.ids.map((i) => '`' + i + '`').join(', ') || 'nenhum'}.`,
          );
        }
      }
    }
  }

  relatorio.push({ doc: doc.ficheiro, conta });
}

function recorta(linha, inicio, fim) {
  const a = Math.max(0, inicio - 45);
  const b = Math.min(linha.length, fim + 45);
  return (a > 0 ? '…' : '') + linha.slice(a, b).trim() + (b < linha.length ? '…' : '');
}

/* ========================================================================== *
 * 5 · O RELATÓRIO
 * ========================================================================== */

console.log('');
console.log(cinza('  registo · os números dos documentos que governam, contra a fonte'));
if (DOCS !== RAIZ) console.log(amarelo(`  documentos lidos de ${DOCS} (OEDP_REGISTO_DIR)`));
console.log('');
console.log(cinza('  os factos, medidos:'));
for (const f of FACTOS) {
  console.log(
    cinza(`    ${String(f.valor).padStart(5)}  ${f.nome.padEnd(52)} ${f.fonte}`) +
      (f.linha ? cinza(` · linha \`${f.linha}\``) : ''),
  );
}
console.log('');
console.log(cinza(`  hoje é ${hoje}; uma afirmação datada de hoje confere-se como corrente.`));
console.log('');

let correntes = 0;
let datadas = 0;
let valores = 0;
for (const { doc, conta } of relatorio) {
  correntes += conta.correntes;
  datadas += conta.datadas.length;
  valores += conta.valores;
  const marca = conta.erros ? vermelho('✗') : verde('✓');
  console.log(
    `  ${marca} ${doc.padEnd(48)} ${String(conta.correntes).padStart(2)} corrente(s) · ` +
      `${String(conta.datadas.length).padStart(2)} datada(s) · ${String(conta.subconjuntos).padStart(2)} subconjunto(s) · ` +
      `${String(conta.valores).padStart(2)} valor(es) do sítio`,
  );
  for (const d of conta.datadas) {
    console.log(
      cinza(`      ${d.onde} «${d.texto}» saltada pela forma (${d.forma})` + (d.data ? ` · ${d.data}` : '')),
    );
  }
  for (const a of conta.ambiguas) {
    console.log(
      cinza(`      ${a.onde} «${a.texto}» não conferida: «edições» diz o arquivo (${EDITIONS.length}) e as ` +
        `páginas de leitura (${paginasDeLeitura()}); o facto escreve-se com o composto.`),
    );
  }
}

console.log('');
if (avisos.length) {
  console.log(amarelo(`  ${avisos.length} aviso(s):`));
  for (const a of avisos) console.log('    ' + amarelo('·') + ' ' + a);
  console.log('');
}

if (erros.length) {
  console.error(vermelho(`  O REGISTO NÃO PASSA — ${erros.length} número(s) que não resolvem:`));
  console.error('');
  for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e + '\n');
  console.error('  Um número num documento que governa cita a coisa medida, ou data-se.');
  console.error('  A forma da casa é «N a dd.mm.aaaa; dizia «M»»: nunca se reescreve em silêncio.');
  console.error('');
  process.exit(1);
}

console.log(
  '  ' +
    verde('✓') +
    ` ${FACTOS.length} facto(s) medidos na fonte · ${correntes} afirmação(ões) corrente(s) conferida(s) · ` +
    `${datadas} datada(s) saltada(s) · ${valores} valor(es) do sítio com o id da linha ao lado`,
);
console.log(
  cinza(
    `        ${DOCUMENTOS.length} documento(s) lidos · ${UNIDADES.length} unidade(s) no vocabulário do livro-razão · ` +
      `prosa não se lê: «hoje só \`evora\`» e «o arquivo vazio» são do check:prosa (F3.1).`,
  ),
);
console.log('');
