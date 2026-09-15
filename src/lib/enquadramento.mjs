/**
 * ---------------------------------------------------------------------------
 * O ENQUADRAMENTO DE UM NÚMERO · a régua que o cartão desenha (bloco P2, item 1d)
 * ---------------------------------------------------------------------------
 *
 * O diretor, a 15.09.2026, diante de um cartão que dizia «17,6»: «17,6 % de
 * quê, e é muito ou pouco». Um número sem régua não é informação, e a norma
 * escreve-o no §2.4: «O número traz sempre a régua. O valor nacional ao lado do
 * local, o período anterior, a posição, a média da União quando é o quadro da
 * fonte.»
 *
 * ---------------------------------------------------------------------------
 * A RÉGUA NÃO SE COMPÕE: LÊ-SE
 * ---------------------------------------------------------------------------
 * Nenhum valor desta régua é escrito pela casa. Cada um é uma linha do
 * livro-razão que a metade do motor deste bloco está a selar, com a proveniência
 * inteira, e este módulo faz uma coisa só: **diz que linhas seriam, e devolve as
 * que existem**. Onde a linha não existe, não há régua, e a ausência não se
 * escreve por palavras no cartão (o §0.2 do brief: «a ausência de régua não se
 * escreve por palavras no cartão»).
 *
 * É por isso que a porta é `hasClaim()` e não `getClaim()`: `getClaim()` fecha a
 * construção quando a linha falta, que é a regra certa para um número que a
 * página promete, e a regra errada para uma comparação que a fonte pode nunca
 * vir a publicar.
 *
 * ---------------------------------------------------------------------------
 * DE ONDE SAI O IDENTIFICADOR DE CADA COMPARAÇÃO
 * ---------------------------------------------------------------------------
 * As duas comparações têm nomes de linha diferentes e vêm por vias diferentes, e
 * as duas vias são leituras do livro-razão e não palpites:
 *
 *   · **o agregado da União** é `<slug>-<período>-ue`, que é o nome que o motor
 *     dá à linha que sela (`enquadramento-2026-09-15`). É uma REGRA DE NOME: ou a
 *     linha com aquele nome está no livro-razão, e então é o agregado daquela
 *     medida naquele período por construção do motor, ou não está, e não há
 *     comparação. Cinco medidas não a têm, e a razão é da fonte e não da casa: o
 *     conjunto do Eurostat não traz valor no agregado naquele período;
 *   · **o período anterior** PROCURA-SE NO LIVRO-RAZÃO, e não se calcula. A
 *     primeira redação deste ficheiro escrevia `<slug>-<ano - 1>`, e estava
 *     errada: `competencias-digitais-2025` é uma série BIENAL e o período
 *     anterior dela é `competencias-digitais-2023`. O que esta função faz é
 *     olhar para as linhas cujo id é `<slug>-<n>` com n MENOR do que o período
 *     da medida, e ficar com a maior. O motor sela uma só por medida, e por isso
 *     a maior é a do período anterior; e o rótulo que o cartão escreve não é esse
 *     n, é o `reference_date` que a PRÓPRIA LINHA publica. A régua diz o período
 *     da linha, nunca «o ano passado».
 *
 * NENHUMA DAS DUAS ADIVINHA UM PERÍODO. Um identificador que não acabe em quatro
 * algarismos (`-2026-08`, `-2025-12`) não tem período para comparar por esta via,
 * e fica sem régua.
 *
 * ---------------------------------------------------------------------------
 * O QUE OS DOIS FICHEIROS DO MOTOR TRAZEM
 * ---------------------------------------------------------------------------
 * **`referencias.json`**: por indicador, o valor de referência que a página do
 * painel da Comissão publica, com o sentido, a frase verbatim de onde ele foi
 * lido e o endereço. Treze indicadores têm-no e dezanove não. Este ficheiro NÃO
 * é a origem do algarismo que o cartão desenha: esse continua a ser a declaração
 * de `src/data/figuras.mjs`, que tem o motivo `limiar-do-quadro` do registo e a
 * forma estruturada que `comparacaoComOLimiar()` lê. O que ele dá é a SEGUNDA
 * TESTEMUNHA: dois registos independentes do mesmo facto, comparados por máquina
 * na célula K9 da régua do bloco. Um facto com duas origens que não batem certo é
 * um facto por confirmar, e é isso que a célula diz.
 *
 * **`nomes.json`**: por indicador, o nome na PORDATA e no INE, com o endereço e a
 * hora de leitura, e a marca de correspondência. **Só o que está marcado `exata`
 * entra no recibo**: `proxima` é a medida VIZINHA (a PORDATA publica o saldo da
 * balança corrente e a medida do painel é a média móvel de três anos, que não é a
 * mesma coisa) e `[verify]` é um campo por confirmar. Nem um nem outro chegam ao
 * leitor, porque um nome quase certo posto onde o leitor espera o nome da coisa
 * é pior do que nenhum.
 *
 * NENHUM ALGARISMO NOVO NESTE FICHEIRO. Ele devolve identificadores de linhas e
 * texto de outro ficheiro; quem desenha é o cartão, e quem imprime um valor é o
 * `<Claim/>`, que o portão confere contra a linha.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hasClaim, getClaim, loadClaims } from './ledger.mjs';
/* O marcador da casa, do módulo que o declara e não de `ledger.mjs`, que o
   reexporta: um campo que o traga é um campo por confirmar, e não um nome. */
import { POR_VERIFICAR as MARCADOR } from '../data/marcador.mjs';

/**
 * A PASTA DOS FICHEIROS DO MOTOR, PROCURADA E NÃO COMPOSTA.
 *
 * `path.resolve(import.meta.url, '..', 'data', 'enquadramento')` funciona quando
 * este módulo corre de `src/lib/` e falha em silêncio quando ele corre
 * empacotado, porque o `import.meta.url` de um módulo empacotado não é o do
 * ficheiro. **Falhou assim**: a construção de 15.09 deu o recibo sem nome oficial
 * nenhum, e quem o apanhou foi o portão de HTML, com a queixa certa («o motivo
 * "nome-oficial-da-medida" está declarado e não dispensa nada»). É a mesma
 * armadilha que `encontraLivroRazao()` resolve em `ledger.mjs`, e a saída é a
 * mesma: subir, a partir do diretório de trabalho e a partir do ficheiro, até
 * encontrar a pasta.
 *
 * DEVOLVE A PASTA OU `null`, e a diferença importa: o livro-razão fecha a
 * construção quando não se encontra, porque sem ele não há página nenhuma; estes
 * dois ficheiros podem não existir ainda, e a ausência deles é uma resposta
 * legítima. O que NÃO é legítimo é não os encontrar por causa do caminho, e é por
 * isso que a procura é a mesma.
 */
function encontraAPasta() {
  /** @type {string[]} */
  const candidatos = [];
  /** @param {string} inicio */
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, 'src', 'data', 'enquadramento'));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };
  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));
  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  return null;
}
const PASTA = encontraAPasta();

/**
 * Lê um ficheiro do motor, ou devolve `null` quando ele ainda não chegou.
 *
 * NÃO SE CALA COM UM ERRO DE LEITURA: um ficheiro que exista e não seja JSON
 * válido fecha a construção, porque isso é um ficheiro partido e não um ficheiro
 * ausente. O que é tolerado é a ausência, e só ela.
 *
 * @param {string} nome
 * @returns {Record<string, unknown>|null}
 */
function ficheiroDoMotor(nome) {
  if (PASTA === null) return null;
  const f = path.join(PASTA, nome);
  if (!fs.existsSync(f)) return null;
  const cru = fs.readFileSync(f, 'utf8');
  try {
    return JSON.parse(cru);
  } catch (e) {
    throw new Error(
      `enquadramento: «${path.relative(process.cwd(), f)}» existe e não é JSON válido ` +
        `(${e instanceof Error ? e.message : String(e)}). Um ficheiro do motor partido ` +
        `fecha a construção; um ficheiro que ainda não chegou não.`,
    );
  }
}

/** @type {Map<string, any>|null|undefined} */
let _referencias;
/** @type {Map<string, any>|null|undefined} */
let _nomes;

/**
 * Os indicadores de um ficheiro do motor, por identificador de linha, ou `null`
 * quando o ficheiro ainda não chegou.
 *
 * @param {string} nome
 * @returns {Map<string, any>|null}
 */
function porLinha(nome) {
  const j = ficheiroDoMotor(nome);
  if (j === null) return null;
  const lista = /** @type {any[]} */ (j.indicadores);
  if (!Array.isArray(lista)) {
    throw new Error(
      `enquadramento: «${nome}» existe e não tem a lista «indicadores». Um ficheiro do ` +
        `motor com outra forma fecha a construção, em vez de se render pela metade.`,
    );
  }
  const m = new Map();
  for (const i of lista) {
    if (typeof i?.id_da_linha === 'string') m.set(i.id_da_linha, i);
  }
  return m;
}

/** As referências exportadas pelo motor, lidas uma vez. */
function referencias() {
  if (_referencias === undefined) _referencias = porLinha('referencias.json');
  return _referencias;
}

/** Os nomes oficiais exportados pelo motor, lidos uma vez. */
function nomes() {
  if (_nomes === undefined) _nomes = porLinha('nomes.json');
  return _nomes;
}

/**
 * O par (raiz, período) de um identificador, quando ele acaba num ano.
 *
 * `precos-da-habitacao-2025` → `{ raiz: 'precos-da-habitacao', ano: 2025 }`.
 * `licencas-de-construcao-2026-08` → `null`, porque o período é um mês e descer
 * um mês é conhecimento da série.
 *
 * @param {string} id
 * @returns {{ raiz: string, ano: number }|null}
 */
export function anoDoIdentificador(id) {
  const m = /^(.*)-(\d{4})$/.exec(String(id));
  if (!m) return null;
  const ano = Number(m[2]);
  /* Um ano de quatro algarismos e nada mais: `-0000` não é um período e
     `-1999` de uma série que comece em 2000 não tem linha, que é o caso que o
     `hasClaim()` resolve a seguir. */
  if (!Number.isInteger(ano)) return null;
  return { raiz: m[1], ano };
}

/**
 * Os identificadores que o enquadramento de uma medida procuraria.
 *
 * Devolve-os EXISTAM OU NÃO, porque é esta a lista que o relatório do bloco
 * escreve quando diz «o que ficou à espera das linhas do motor, com as chaves
 * que faltam». Quem decide o que se rende é `reguaDaMedida()`.
 *
 * @param {string} id
 * @returns {{ anterior: string|null, ue: string|null }}
 */
export function chavesDoEnquadramento(id) {
  const p = anoDoIdentificador(id);
  if (!p) return { anterior: null, ue: null };
  return { anterior: periodoAnteriorNoLivro(p.raiz, p.ano), ue: `${id}-ue` };
}

/**
 * A linha do período anterior da mesma série, procurada no livro-razão.
 *
 * Não se calcula: procura-se. Entre as linhas cujo id é `<raiz>-<n>` com n menor
 * do que o período desta, fica a MAIOR. Uma série anual dá o ano anterior; uma
 * série bienal dá o período de há dois anos (`competencias-digitais-2025` dá
 * `competencias-digitais-2023`), e nenhuma das duas precisa de a casa saber a
 * periodicidade da série.
 *
 * O CASAMENTO É EXATO E NÃO POR PREFIXO: `^<raiz>-(\d{4})$`. Sem isso, a raiz
 * `taxa-de-desemprego` apanhava `taxa-de-desemprego-mip-2024`, que é outra
 * medida.
 *
 * @param {string} raiz
 * @param {number} ano
 * @returns {string|null}
 */
function periodoAnteriorNoLivro(raiz, ano) {
  let melhor = null;
  let melhorAno = -Infinity;
  for (const outro of loadClaims().keys()) {
    if (!outro.startsWith(`${raiz}-`)) continue;
    const p = anoDoIdentificador(outro);
    if (!p || p.raiz !== raiz) continue;
    if (p.ano >= ano || p.ano <= melhorAno) continue;
    melhor = outro;
    melhorAno = p.ano;
  }
  return melhor;
}

/**
 * O valor de referência que a página do painel da Comissão publica, como o motor
 * o leu, ou `null`.
 *
 * NÃO É O QUE O CARTÃO DESENHA: o algarismo do cartão continua a sair da
 * declaração de `src/data/figuras.mjs`, com o motivo do registo. Isto é a segunda
 * testemunha, e existe para ser comparada com ela (a célula K9 da régua do
 * bloco).
 *
 * @param {string} id
 * @returns {{ limiar: string, sentido: string, frase: string, endereco: string }|null}
 */
export function valorDeReferenciaDoMotor(id) {
  const r = referencias()?.get(id);
  if (!r || typeof r.limiar !== 'string' || r.limiar === '') return null;
  return {
    limiar: r.limiar,
    sentido: typeof r.sentido === 'string' ? r.sentido : '',
    frase: typeof r.frase_da_fonte === 'string' ? r.frase_da_fonte : '',
    endereco: typeof r.endereco_do_limiar === 'string' ? r.endereco_do_limiar : '',
  };
}

/**
 * O nome oficial de uma medida, para o recibo, ou `null`.
 *
 * **Só o que o motor marca `exata`**, e a razão está no cabeçalho: `proxima` é a
 * medida vizinha e `[verify]` é um campo por confirmar, e nem um nem outro chegam
 * ao leitor. A ordem é a da norma §1.5: o do INE primeiro, quando ele o carrega,
 * e o da PORDATA a seguir. Cada um leva a origem dele, que é o endereço e a hora
 * a que o motor o leu.
 *
 * @param {string} id
 * @returns {{ ine: { nome: string, endereco: string, lido: string }|null, pordata: { nome: string, endereco: string, lido: string }|null }|null}
 */
export function nomeOficial(id) {
  const n = nomes()?.get(id);
  if (!n || n.correspondencia !== 'exata') return null;
  /** @param {any} o */
  const util = (o) => {
    if (!o || typeof o !== 'object') return null;
    const nome = o.nome;
    if (typeof nome !== 'string' || nome.trim() === '' || nome === MARCADOR) return null;
    const endereco = typeof o.endereco === 'string' ? o.endereco : '';
    const lido = typeof o.lido_em === 'string' ? o.lido_em.slice(0, 10) : '';
    if (endereco === '' || lido === '') return null;
    return { nome, endereco, lido };
  };
  const ine = util(n.nome_ine);
  const pordata = util(n.nome_pordata);
  if (!ine && !pordata) return null;
  return { ine, pordata };
}

/**
 * A régua de uma medida: só as linhas que existem.
 *
 * @param {string} id  o identificador da linha da medida
 * @returns {{ anterior: { id: string, periodo: string|null }|null, ue: { id: string }|null }}
 */
export function reguaDaMedida(id) {
  const chaves = chavesDoEnquadramento(id);
  const anterior =
    chaves.anterior && hasClaim(chaves.anterior)
      ? {
          id: chaves.anterior,
          /* O RÓTULO DO PERÍODO ANTERIOR É O PERÍODO DA LINHA DELE, e não um
             algarismo composto aqui: a linha diz de que período é, e é isso que
             o cartão escreve. Sem `reference_date`, a régua não lhe põe rótulo,
             porque escrever «2024» por cima de uma linha que não diz ser de 2024
             seria a casa a datar um número. */
          periodo: valorDoPeriodo(chaves.anterior),
        }
      : null;
  const ue = chaves.ue && hasClaim(chaves.ue) ? { id: chaves.ue } : null;
  return { anterior, ue };
}

/**
 * O período de uma linha, como ela o publica, ou `null`.
 *
 * @param {string} id
 * @returns {string|null}
 */
function valorDoPeriodo(id) {
  const c = getClaim(id);
  const r = c.reference_date;
  return typeof r === 'string' && r !== '' ? r : null;
}

/**
 * Verdadeiro quando a régua de uma medida tem alguma coisa para dizer.
 *
 * @param {{ anterior: unknown, ue: unknown }} regua
 */
export function temRegua(regua) {
  return Boolean(regua.anterior || regua.ue);
}

/**
 * Diz se os ficheiros do motor já chegaram. O relatório do bloco lê-o, e a régua
 * do bloco usa-o para escolher entre as duas medidas de aceitação.
 *
 * @returns {{ referencias: boolean, nomes: boolean }}
 */
export function ficheirosDoMotor() {
  return { referencias: referencias() !== null, nomes: nomes() !== null };
}

/**
 * ===========================================================================
 * AS LINHAS QUE SÃO A RÉGUA DE OUTRA, E NÃO UMA MEDIDA (bloco P2, 15.09.2026)
 * ===========================================================================
 * As cinquenta e nove linhas que o motor selou a 15.09 existem para uma coisa:
 * serem a régua de uma medida. `precos-da-habitacao-2024` é a MESMA MEDIDA que
 * `precos-da-habitacao-2025`, um período antes; `precos-da-habitacao-2025-ue` é a
 * mesma medida, noutra geografia. Nenhuma das duas é uma medida a mais da área da
 * habitação.
 *
 * SEM ISTO, A PÁGINA DE UMA ÁREA LISTAVA-AS COMO CARTÕES PRÓPRIOS, e foi o que
 * aconteceu na primeira construção com elas: a página da habitação passou de três
 * cartões para seis, e o valor de `precos-da-habitacao-2024` ficou duas vezes na
 * mesma página, uma no cartão dele e outra dentro da régua do cartão de 2025. É
 * exactamente o que a régua A3 proíbe, e o que o F1.14 §1.2 já tinha escrito: «o
 * enquadramento do cartão é uma leitura da mesma linha e não uma segunda cópia».
 *
 * A LISTA NÃO É ESCRITA À MÃO: sai de `referencias.json`, que é quem sabe que
 * indicadores o motor enquadrou, e das mesmas duas regras de nome que a régua usa.
 * Uma linha que o motor deixe de enquadrar sai desta lista sozinha, e volta a ser
 * uma medida como as outras.
 *
 * E NÃO APANHA AS LINHAS ANTIGAS. `evora-divida-total-2024` é o período anterior
 * de `evora-divida-total-2025` e continua a ser uma medida da sua área, porque a
 * medida dela não está em `referencias.json`: o que esta lista tira é o que o
 * motor pôs lá para ser régua, e mais nada.
 *
 * @returns {Set<string>}
 */
export function linhasDeEnquadramento() {
  if (_deEnquadramento === undefined) {
    const r = referencias();
    if (r === null) {
      _deEnquadramento = new Set();
    } else {
      const s = new Set();
      for (const id of r.keys()) {
        const c = chavesDoEnquadramento(id);
        if (c.anterior) s.add(c.anterior);
        if (c.ue) s.add(c.ue);
      }
      _deEnquadramento = s;
    }
  }
  return _deEnquadramento;
}

/** @type {Set<string>|undefined} */
let _deEnquadramento;

/**
 * Verdadeiro quando esta linha existe para ser a régua de outra.
 *
 * @param {string} id
 */
export function eLinhaDeEnquadramento(id) {
  return linhasDeEnquadramento().has(id);
}
