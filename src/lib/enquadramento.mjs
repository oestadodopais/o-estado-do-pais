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
 * hora de leitura, e a marca de correspondência. **Só entra no recibo um nome que
 * o motor marque `mesma_medida: true`, numa medida marcada `exata` NAQUELA
 * FONTE** (a regra de 21.09.2026 com a forma de 22.09.2026, em `nomeOficial()`
 * mais abaixo): `proxima` é a medida VIZINHA (a PORDATA publica o saldo da
 * balança corrente e a medida do painel é a média móvel de três anos, que não é
 * a mesma coisa), `[verify]` é um campo por confirmar, e um nome sem a marca é um
 * nome que ninguém conferiu. Nenhum deles chega ao leitor, porque um nome quase
 * certo posto onde o leitor espera o nome da coisa é pior do que nenhum.
 *
 * NENHUM ALGARISMO NOVO NESTE FICHEIRO. Ele devolve identificadores de linhas e
 * texto de outro ficheiro; quem desenha é o cartão, e quem imprime um valor é o
 * `<Claim/>`, que o portão confere contra a linha.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hasClaim, getClaim, loadClaims, documentoDaLinha, textoOuNulo } from './ledger.mjs';
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
 * **Só o que o motor marca `exata` NAQUELA FONTE**, e a razão está no cabeçalho:
 * `proxima` é a medida vizinha e `[verify]` é um campo por confirmar, e nem um
 * nem outro chegam ao leitor. A ordem é a da norma §1.5: o do INE primeiro,
 * quando ele o carrega, e o da PORDATA a seguir. Cada um leva a origem dele, que
 * é o endereço e a hora a que o motor o leu.
 *
 * UM NOME COM AVISO NÃO CHEGA AO LEITOR (correção de 21.09.2026). A marca
 * `correspondencia` do ficheiro foi julgada para o nome da PORDATA. Os nomes do
 * INE que o motor leu na lista de resultados da busca do portal trazem, cada um,
 * um campo `aviso` a dizer que a marca da busca prova o tema e não prova que seja
 * a mesma medida, e que essa conferência ficou por fazer. Esta função lia `exata`
 * para os dois nomes e punha o do INE primeiro, e por isso três nomes de OUTROS
 * indicadores estiveram no ar como nome oficial: a formação bruta de capital
 * fixo em percentagem do PIB com o nome de um indicador mensal da construção
 * (também como título de um cartão), a taxa de emprego com o de uma série mensal
 * de outro grupo etário, e o risco de pobreza ou exclusão com o da definição
 * antiga. Um estado de verificação escrito em prosa não é lido por ninguém, e por
 * isso a regra passou a ser estrutural: **só chega ao leitor um nome que o motor
 * marque `mesma_medida: true`**, que quer dizer conferido no conceito, na unidade,
 * na população e na periodicidade por quem não escolheu o nome. A leitura a frio
 * do Codex desta correção (21.09.2026, 5 plantas em 5) mostrou porque é que o
 * aviso sozinho não chegava: os dois nomes do INE sem aviso, os da taxa de
 * desemprego, dizem «Trimestral» e as linhas são anuais, e os 17 nomes da PORDATA
 * foram julgados por quem os escolheu e por mais ninguém. A 21.09.2026 nenhum
 * nome do ficheiro traz a marca, e nenhum se rende; voltam um a um quando o motor
 * os confirmar (`design/observatorio/BRIEF-M3-os-nomes-oficiais-conferidos-no-motor.md`).
 * A régua `scripts/check-nomes-oficiais.mjs` confere-o nas páginas construídas
 * por conta própria, com plantas.
 *
 * A MARCA É POR FONTE, E A CONFIRMAÇÃO SÃO DUAS LEITURAS (22.09.2026, o bloco
 * M3 do motor). O ficheiro de 15.09 tinha uma só `correspondencia` por medida,
 * uma cadeia de texto que fora julgada para o nome da PORDATA e que esta função
 * lia para os dois nomes: era essa a porta por onde os nomes do INE de outros
 * indicadores passaram. O ficheiro de 22.09 traz `correspondencia: {ine, pordata}`
 * e cada nome com o seu `estado` («lido», «sem_indicador», «sem_pagina»,
 * «sem_resposta»), a sua `proposta`, a sua `prova` e a sua `conferencia`, e o
 * campo `aviso` deixou de existir (o exportador do motor fecha se ele voltar).
 * Um nome da fonte X só se rende quando as cinco coisas se verificam NAQUELA
 * FONTE: `correspondencia[X] === 'exata'`, `estado === 'lido'`,
 * `mesma_medida === true`, nenhum campo `aviso`, e o endereço e a hora de
 * leitura presentes. O `mesma_medida` não é de quem escolheu o nome: é a
 * derivação de uma conferência cega, feita por um agente que não escolheu
 * nenhum, e uma `proposta` de quem escolheu não é um veredicto.
 *
 * A FORMA ANTIGA NÃO SE LÊ, e não se lê em silêncio por descuido: um ficheiro
 * cuja `correspondencia` seja uma cadeia de texto por medida rende ZERO nomes
 * aqui, e `check:nomes` fecha a construção a dizer que o ficheiro está na forma
 * antiga. Aceitá-la «por compatibilidade» seria voltar a pôr um nome do INE no
 * ar com a marca julgada para o da PORDATA, que é exatamente o defeito de
 * 21.09.2026.
 *
 * @param {string} id
 * @returns {{ ine: { nome: string, endereco: string, lido: string }|null, pordata: { nome: string, endereco: string, lido: string }|null }|null}
 */
export function nomeOficial(id) {
  const n = nomes()?.get(id);
  if (!n) return null;
  const c = n.correspondencia;
  /* A FORMA ANTIGA (uma cadeia de texto por medida) NÃO RENDE NADA. Quem o diz
     em voz alta é o `check:nomes`, que sabe olhar para o ficheiro inteiro. */
  if (c === null || typeof c !== 'object' || Array.isArray(c)) return null;
  /** @param {any} o @param {unknown} marca a correspondência DAQUELA fonte */
  const util = (o, marca) => {
    if (marca !== 'exata') return null;
    if (!o || typeof o !== 'object') return null;
    /* O ESTADO É DA LEITURA: «sem_indicador», «sem_pagina» e «sem_resposta» são
       ausências, e um nome só existe onde o motor diz que o leu. */
    if (o.estado !== 'lido') return null;
    if (o.mesma_medida !== true) return null;
    /* A PRESENÇA do campo chega: um aviso vazio, ou de outro tipo, continua a ser o
       motor a dizer que há um aviso (releitura a frio de 21.09.2026, achado 8). */
    if (Object.prototype.hasOwnProperty.call(o, 'aviso')) return null;
    const nome = o.nome;
    if (typeof nome !== 'string' || nome.trim() === '' || nome === MARCADOR) return null;
    const endereco = typeof o.endereco === 'string' ? o.endereco : '';
    const lido = typeof o.lido_em === 'string' ? o.lido_em.slice(0, 10) : '';
    if (endereco === '' || lido === '') return null;
    return { nome, endereco, lido };
  };
  const ine = util(n.nome_ine, c.ine);
  const pordata = util(n.nome_pordata, c.pordata);
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
  return { anterior: anterior && mesmaSerie(id, anterior.id) ? anterior : null, ue };
}

/**
 * ===========================================================================
 * A PROVA DE QUE AS DUAS LINHAS SÃO A MESMA SÉRIE (achado 11, 15.09.2026)
 * ===========================================================================
 * A leitura a frio: «Nothing verifies that a selected "previous period" row is
 * the previous observation of the same series and unit. The selector takes the
 * greatest earlier year whose identifier has the same textual root; it never
 * compares dataset, source URL dimensions, unit or series identity.»
 *
 * Tinha razão, e o custo estava à vista quando se foi ver: `evora-camara-
 * mandatos-ps-2025` levava como período anterior `evora-camara-mandatos-ps-2009`,
 * dezasseis anos antes, porque nenhuma linha com aquela raiz existe entre as
 * duas. Um cartão que escreve «2009: 5» ao lado do valor de 2025 não está a dar
 * uma régua: está a saltar quatro eleições sem o dizer.
 *
 * A REGRA, TAL COMO O LUGAR DE DIREÇÃO A ESCREVEU: a linha do período anterior
 * só se rende quando declara o MESMO `document.edition` e a MESMA `unit` da
 * linha principal. As duas são campos que a linha já traz e que o portão já
 * confere carácter a carácter; não se inventa um campo novo nem se pede nada ao
 * motor.
 *
 * E AS DUAS TÊM DE EXISTIR. Uma edição a `null` dos dois lados não prova que as
 * duas linhas são a mesma série: prova que nenhuma das duas diz de que documento
 * é. O lado seguro de falhar é não desenhar a régua, porque uma régua errada é
 * pior do que régua nenhuma, e a ausência não se escreve por palavras (§0.2 do
 * brief do P2).
 *
 * O QUE ISTO CUSTA, MEDIDO E NÃO ESTIMADO: das 45 réguas com período anterior de
 * cada edição, 30 ficam e 15 deixam de render. Onze delas são séries verdadeiras
 * cujo `document.edition` é o rótulo do ano ou do mês da publicação («2024» e
 * «2021», «dezembro 2024» e «dezembro 2013»), e por construção nunca baterão: o
 * que lhes falta é um identificador de SÉRIE, que é campo do motor e não do
 * sítio. Três são linhas derivadas, sem documento nenhum. E uma é o defeito que
 * a leitura apanhou. A lista inteira está no relatório do bloco P2.
 *
 * @param {string} id o identificador da linha principal
 * @param {string} anterior o identificador da linha do período anterior
 * @returns {boolean}
 */
export function mesmaSerie(id, anterior) {
  const a = getClaim(id);
  const b = getClaim(anterior);
  if (!a || !b) return false;
  /* `documentoDaLinha()` é o estreitamento conferido do bloco `document`: os
     valores dele continuam `unknown` até quem os lê os conferir, que é o que as
     duas linhas a seguir fazem. */
  const ea = textoOuNulo(documentoDaLinha(a)?.edition);
  const eb = textoOuNulo(documentoDaLinha(b)?.edition);
  if (ea === null || eb === null || ea !== eb) return false;
  const ua = textoOuNulo(a.unit);
  const ub = textoOuNulo(b.unit);
  return ua !== null && ub !== null && ua === ub;
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
