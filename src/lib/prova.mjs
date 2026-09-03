/**
 * A prova viva: os números que o sítio diz sobre si próprio.
 *
 * ---------------------------------------------------------------------------
 * PORQUE EXISTE
 * ---------------------------------------------------------------------------
 * O estado é renderizado, nunca escrito. Uma frase como «132 linhas, 12 por
 * confirmar» escrita à mão fica errada na construção seguinte e ninguém dá por
 * isso. Tudo o que o Método diz sobre o estado do sítio sai daqui, calculado na
 * construção a partir dos dados do próprio sítio: o livro-razão, o arquivo, o
 * registo da travessia, o ficheiro da verificação, a lista dos concelhos.
 *
 * ---------------------------------------------------------------------------
 * O QUE ISTO NÃO É
 * ---------------------------------------------------------------------------
 * Não é o livro-razão. Uma medição de Portugal entra por `<Claim id="…"/>`, tem
 * linha própria e selo. Um número **deste sítio sobre si próprio** não tem
 * linha nem selo: tem a marca `data-prova="<chave>"` e uma porta, que é a
 * página onde o leitor vê o que ele conta. Ver `IDENTIDADE.md` §10.
 *
 * A marca **não é uma dispensa**. `scripts/gate-html.mjs` recalcula cada chave
 * por conta própria, do seu próprio ponto de observação (as páginas
 * construídas, o mapa do sítio, os ficheiros de dados), e fecha a construção
 * quando o que a página rende discorda. Onde o portão não tem outro caminho
 * senão o mesmo módulo que este ficheiro usa, isso está dito lá, chave a chave.
 *
 * ---------------------------------------------------------------------------
 * A FORMA
 * ---------------------------------------------------------------------------
 *   prova(lang) -> { <chave>: { valor, origem, porta, … } }
 *
 *   valor  número, data ISO, cadeia, ou `null` quando a coisa contada ainda não
 *          existe. `null` não se rende como zero: rende-se como estado vazio,
 *          por palavras.
 *   origem a frase curta que diz COMO o número é obtido, na língua da edição.
 *   porta  a rota onde se vê o que ele conta. Todo o número marcado
 *          `data-prova` vai dentro de uma ligação para aqui (ou, dentro de um
 *          desenho, na legenda de portas do instrumento).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadClaims,
  provenienciaIncompleta,
  entradasDoRegisto,
  POR_VERIFICAR,
  TIPOS_DE_DOCUMENTO,
  documentoDaLinha,
  listaDaLinha,
} from './ledger.mjs';
import { ROUTES, routePath } from './routes.mjs';
import { estadoDaMedida } from './estado.mjs';
import { todosOsRegistos, registoDaEdicao } from './registos.mjs';
import { unidadesDoBloco, MOTIVOS_SEM_RESUMO } from './registo-html.mjs';
import { FIGURAS_PDM, FIGURAS_SOCIAL } from '../data/figuras.mjs';
import { WORKS, EDITIONS } from '../data/studies.mjs';
import { temLeitura } from '../data/leituras.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../data/municipios.mjs';
import { contagensDosConcelhos } from './livro-concelhos.mjs';
import { MUNICIPIOS } from '../data/caop-centroids.mjs';
import { unidadesDoMapa, distritoDoMapa } from './mapa.mjs';
import { contagensDasRegioes } from './regioes.mjs';
import { areasComPecas } from './areas.mjs';
import { AREAS } from '../data/areas.mjs';
import { VERIFICACAO } from '../data/verificacao.mjs';
import { CONFERENCIA, FONTES_SEM_RESPOSTA } from '../data/fontes.mjs';
import { ENDERECO_CORRECOES } from '../data/metodo.mjs';

/**
 * A raiz do repositório.
 *
 * NÃO pode ser um caminho relativo a este ficheiro: na construção, este módulo
 * é empacotado para dentro de `dist/`, e o caminho relativo passaria a apontar
 * para lá — que foi exactamente o que aconteceu na primeira corrida deste
 * ficheiro (o registo da travessia deu zero na página e setenta no portão, e o
 * portão fechou a construção, que é o que ele existe para fazer). Mesma
 * disciplina de `encontraLivroRazao()` em `ledger.mjs`: procura-se a subir, do
 * directório de trabalho primeiro e do próprio ficheiro depois.
 */
function encontraRaiz() {
  /** @param {string} inicio */
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      if (fs.existsSync(path.join(dir, 'ledger', 'claims'))) return dir;
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
    return null;
  };
  return (
    subir(process.cwd()) ??
    subir(path.dirname(fileURLToPath(import.meta.url))) ??
    process.cwd()
  );
}

const RAIZ = encontraRaiz();

/** O endereço do ficheiro que o portão escreve no fim de um varrimento limpo. */
export const CAMINHO_DA_PROVA = '/prova.json';

/** O ficheiro da agenda, escrito pelo exportador do motor quando existe. */
export const FICHEIRO_DA_AGENDA = path.join(RAIZ, 'src', 'data', 'agenda.json');

/**
 * Há quantos dias o painel foi reconferido contra a fonte, e se isso já passou
 * do prazo que o próprio ficheiro da verificação declara.
 *
 * Uma conta só, partilhada pelo cabeçalho de todas as páginas e pela primeira
 * página. Duas cópias divergiam à primeira alteração, e uma delas dizia ao
 * leitor que o painel estava fresco enquanto a outra dizia que estava vencido.
 */
export function estadoDaVerificacao(hoje = new Date()) {
  const dias = Math.floor(
    (Date.parse(`${hoje.toISOString().slice(0, 10)}T00:00:00Z`) -
      Date.parse(`${VERIFICACAO.verificadoEm}T00:00:00Z`)) /
      86400000,
  );
  return {
    verificadoEm: VERIFICACAO.verificadoEm,
    dias,
    vencida: dias > VERIFICACAO.validadeDias,
  };
}

/**
 * Quando é que o corredor diário perguntou às fontes, e há quantos dias.
 *
 * A IRMÃ DE `estadoDaVerificacao()`, E MEDE OUTRA COISA. Aquela é o painel
 * europeu: 32 linhas, uma vez por semana, com as canárias a reler o VALOR.
 * Esta é o corredor: todos os endereços do livro-razão, todos os dias, a
 * perguntar se o FICHEIRO mudou. As duas datas andam a ritmos diferentes e é
 * por isso que são duas leituras e não uma; juntá-las numa só faria a mais
 * lenta parecer tão fresca como a rápida.
 *
 * O PRAZO É DOIS DIAS e não os quarenta e cinco do painel, porque o que se está
 * a medir é uma corrida DIÁRIA: uma que não corre ontem nem hoje é uma corrida
 * parada, e o leitor tem de ver isso na página no segundo dia e não no
 * quadragésimo sexto. É o mesmo número que o `--check-heartbeat` do corredor
 * usa, e vive nos dois sítios pela mesma razão que os rótulos do portão vivem
 * em duas cópias: se a página lesse o do motor, confirmava o motor.
 *
 * E A COMPARAÇÃO É `>=`, NÃO `>`. Com `>`, um prazo de dois dias só ficava
 * vencido ao TERCEIRO, que é a mesma conta trocada que a leitura a frio de
 * 01.09 achou no homem morto do motor e no vigia. Se o prazo é dois dias, ao
 * segundo dia está vencido.
 *
 * O QUE ISTO NÃO PODE FAZER, e diz-se: a página é construída, não é lida em
 * tempo real. Se o corredor parar E não houver lançamento nenhum, a data no
 * cabeçalho fica onde ficou e este estado nunca chega a mudar no que o leitor
 * vê. Quem vê a paragem é o vigia do motor, que abre uma *issue*; o §3.5 ponto
 * 6 do desenho já tinha posto a alternativa (o carimbo servido num ficheiro
 * pequeno e lido pela página) como decisão para essa altura.
 *
 * `conferidoEm` traz a hora com o fuso (o motor escreve tudo em UTC, §7 do
 * desenho). A data que se publica é a da hora de Lisboa, que é onde o leitor
 * está; o que aqui se calcula é a distância em dias, e essa faz-se sobre o dia
 * UTC dos dois lados para não mudar de resposta às onze da noite.
 */
export const PRAZO_DAS_FONTES_DIAS = 2;

export function estadoDasFontes(hoje = new Date()) {
  const conferidoEm = CONFERENCIA?.conferidoEm ?? null;
  if (!conferidoEm) {
    /* Sem corrida nenhuma não há data, e não se inventa uma: a mobília não
       desenha a leitura. O mesmo que a linha da agenda faz quando o registo
       ainda não atravessou. */
    return { conferidoEm: null, dia: null, hora: null, dias: null, vencida: false };
  }
  const dia = String(conferidoEm).slice(0, 10);
  const hora = String(conferidoEm).slice(11, 16);
  const dias = Math.floor(
    (Date.parse(`${hoje.toISOString().slice(0, 10)}T00:00:00Z`) -
      Date.parse(`${dia}T00:00:00Z`)) /
      86400000,
  );
  return { conferidoEm, dia, hora, dias, vencida: dias >= PRAZO_DAS_FONTES_DIAS };
}

/**
 * O estado de UM endereço: desde quando é que ele não responde, ou `null`.
 *
 * `null` quer dizer «respondeu da última vez que se perguntou», e é o caso da
 * esmagadora maioria. Um endereço que não está no ficheiro nunca foi conferido
 * OU respondeu: os dois dão `null`, e a diferença entre eles diz-se pela data da
 * conferência, que a página já mostra. O `#page=N` tira-se antes de procurar,
 * porque o fragmento não vai no pedido e o índice do arquivo é por endereço
 * pedido — três linhas que citam três páginas do mesmo relatório partilham o
 * estado do ficheiro, que é o que elas de facto partilham.
 *
 * @param {unknown} sourceUrl
 */
export function estadoDaFonte(sourceUrl) {
  if (typeof sourceUrl !== 'string' || !sourceUrl.startsWith('http')) return null;
  const pedido = sourceUrl.split('#')[0];
  return /** @type {TabelaAberta<typeof FONTES_SEM_RESPOSTA>} */ (FONTES_SEM_RESPOSTA)?.[pedido] ?? null;
}

/**
 * A agenda, se o motor já a atravessou.
 *
 * O ficheiro é escrito pelo exportador do ResearchHub e não existe hoje. Um
 * ficheiro em falta não é um erro nem um zero: é um estado vazio, e as chaves
 * `agenda_*` ficam a `null` para que a página o diga por palavras. Ver §1.39 e
 * `PLANO-fases.md`, bloco V, item 5.
 */
export function agenda() {
  try {
    if (!fs.existsSync(FICHEIRO_DA_AGENDA)) return null;
    const cru = JSON.parse(fs.readFileSync(FICHEIRO_DA_AGENDA, 'utf8'));
    /** @type {ItemDaAgenda[] | null} */
    const itens = Array.isArray(cru?.itens) ? cru.itens : Array.isArray(cru) ? cru : null;
    if (!itens) return null;
    /** @param {string} estado */
    const porEstado = (estado) => itens.filter((i) => i?.estado === estado).length;
    return {
      total: itens.length,
      em_curso: porEstado('em_curso'),
      a_seguir: porEstado('a_seguir'),
      concluido: porEstado('concluido'),
      retirado: porEstado('retirado'),
    };
  } catch {
    /* Um ficheiro partido não se adivinha: vale o mesmo que não existir, e a
       página diz o estado vazio em vez de inventar contagens. */
    return null;
  }
}

/**
 * As linhas que atravessaram do motor, contadas no registo da travessia.
 *
 * Devolve também o mapa `"<rh_study> <rh_id>" → <id da linha do sítio>`, que é a
 * mesma leitura ao contrário: é por ele que uma figura de um registo de conteúdo
 * sabe se tem linha neste livro-razão. Uma leitura só para as duas perguntas,
 * porque são o mesmo ficheiro e a segunda passagem só podia divergir da
 * primeira.
 */
function linhasCruzadas() {
  const dir = path.join(RAIZ, 'ledger', 'cruzamentos');
  let total = 0;
  let ficheiros = 0;
  /** @type {Map<string, string>} */
  const doMotor = new Map();
  if (!fs.existsSync(dir)) return { total, ficheiros, doMotor };
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const manifesto = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const [siteId, bruto] of Object.entries(manifesto?.rows ?? {})) {
      const linha = /** @type {{ rh_study?: unknown, rh_id?: unknown } | null} */ (bruto);
      if (linha?.rh_study && linha?.rh_id) doMotor.set(`${linha.rh_study} ${linha.rh_id}`, siteId);
    }
    total += Object.keys(manifesto?.rows ?? {}).length;
    ficheiros++;
  }
  return { total, ficheiros, doMotor };
}

/** Um resumo de origem: 64 hexadecimais minúsculos, e mais nada. */
const RESUMO_DE_ORIGEM = /^[0-9a-f]{64}$/;

/**
 * ---------------------------------------------------------------------------
 * OS REGISTOS DE CONTEÚDO, CONTADOS UMA VEZ POR CONSTRUÇÃO
 * ---------------------------------------------------------------------------
 *
 * As oito chaves `registos_*` são **totais do sítio**, e não contagens por
 * edição: a faixa de cada página de leitura já conta a sua edição, com a sua
 * marca `data-registo-conta` e a recontagem do portão contra o registo em disco
 * (`DECISIONS.md` §1.64, P2). Aqui conta-se o sítio inteiro.
 *
 * A leitura é a de `src/lib/registos.mjs` e a estrutura de um bloco é a de
 * `src/lib/registo-html.mjs`: as duas são o lado das páginas, e uma terceira
 * cópia da mesma travessia só podia sair de passo com o que a página rende. O
 * PORTÃO é que não passa por aqui, e reconta as oito por conta própria: seis
 * sobre o `dist/` construído e duas numa segunda leitura destes mesmos
 * ficheiros, e isso está declarado chave a chave em `scripts/gate-html.mjs`.
 * (Eram quatro e quatro até 24.08.2026: com a porta a ir a seguir a uma ligação
 * do documento, `registos_resolvidos` e `registos_por_resolver` passaram a
 * poder contar-se no `dist/`.)
 *
 * Memoizado porque `prova()` é chamada uma vez por página construída: sem isto,
 * os oito registos (1,4 MB) eram lidos e analisados trezentas e quarenta vezes.
 */
/** @type {ContagensDosRegistos | null} */
let CONTAS_DOS_REGISTOS = null;
/** @param {Map<string, string>} doMotor */
function contagensDosRegistos(doMotor) {
  if (CONTAS_DOS_REGISTOS) return CONTAS_DOS_REGISTOS;
  /** @type {ContagensDosRegistos} */
  const c = {
    edicoes: 0,
    blocos: 0,
    algarismos: 0,
    resolvidos: 0,
    por_resolver: 0,
    com_linha_do_sitio: 0,
    com_resumo_de_origem: 0,
    sem_resumo_de_origem: 0,
    motivos: {},
  };
  for (const motivo of MOTIVOS_SEM_RESUMO) c.motivos[motivo] = 0;
  for (const { slug, lang, entrada } of todosOsRegistos()) {
    const registo = registoDaEdicao(slug, lang);
    if (!registo) continue;
    c.edicoes++;
    c.blocos += registo.blocks.length;
    for (const bloco of registo.blocks) {
      for (const { unidade } of unidadesDoBloco(bloco)) {
        for (const figura of unidade.figures ?? []) {
          c.algarismos++;
          if (figura.row) {
            c.resolvidos++;
            const rh = /** @type {{ rh_study?: unknown }} */ (entrada).rh_study;
            if (doMotor.has(`${rh} ${figura.row}`)) c.com_linha_do_sitio++;
          } else {
            c.por_resolver++;
          }
          if (RESUMO_DE_ORIGEM.test(String(figura.source_sha256 ?? ''))) {
            c.com_resumo_de_origem++;
          } else if (MOTIVOS_SEM_RESUMO.has(/** @type {string} */ (figura.source_digest_kind))) {
            c.sem_resumo_de_origem++;
            c.motivos[/** @type {string} */ (figura.source_digest_kind)]++;
          }
          /* Uma figura sem resumo E sem motivo da lista fechada não entra em
             nenhuma das duas contagens, e é de propósito: a soma das duas
             deixa de dar o total, que é o sinal. Quem a nomeia, com a edição e
             a coordenada, é o `scripts/check-cadeia.mjs`, no passo 1. */
        }
      }
    }
  }
  CONTAS_DOS_REGISTOS = c;
  return c;
}

/**
 * Uma âncora dentro de uma rota, sem barra a dobrar: a raiz é `/` e o resto
 * não tem barra final.
 */
/**
 * @param {string} rota
 * @param {string} id
 */
function ancora(rota, id) {
  return `${rota}#${id}`;
}

/**
 * A ÂNCORA DA SECÇÃO DE UM ESTADO, na própria página da agenda.
 *
 * É a mesma cadeia que `AgendaView.astro` põe no `id` de cada secção. Vive
 * aqui porque é daqui que a porta sai: a chave da prova é que decide para onde
 * a sua contagem abre, e o gabarito obedece.
 */
/** @param {string} estado */
export const ancoraDoEstadoDaAgenda = (estado) => `estado-${estado}`;

/**
 * A porta da agenda.
 *
 * A rota `agenda` ainda não existe: é o agente que atravessa o calendário do
 * motor que a acrescenta, neste mesmo ramo. Enquanto não existir, a porta é o
 * Método, que é onde a regra 8 está escrita. No dia em que a rota entrar na
 * tabela, esta função devolve-a sem que seja preciso tocar aqui.
 *
 * DESDE A V2, UMA CONTAGEM POR ESTADO ABRE A SUA SECÇÃO (IDENTIDADE.md §10, «a
 * porta pode ser uma âncora na própria página»). O quadro de estados da agenda
 * conta quatro coisas que se veem ali mesmo, mais abaixo na mesma página: a
 * porta de «3 em curso» é a secção «Em curso», e não a página inteira, onde já
 * se está. Da mobília do cabeçalho, noutra página, a mesma porta continua a
 * levar ao mesmo sítio, um pouco mais abaixo.
 *
 * `agenda_total` fica sem âncora: conta a agenda inteira, e o que ela conta vê-se
 * na página inteira.
 */
/**
 * @param {Lingua} lang
 * @param {string | null} [estado]
 */
function portaDaAgenda(lang, estado = null) {
  if (!ROUTES.agenda) return routePath('metodo', lang);
  const rota = routePath('agenda', lang);
  return estado ? ancora(rota, ancoraDoEstadoDaAgenda(estado)) : rota;
}

/**
 * O QUE UMA DESTAS FRASES É, DESDE 27.08.2026: O NOME DO QUE SE CONTA.
 *
 * Cada uma destas frases sai num atributo `title` ao lado do número, e um
 * `title` é texto do leitor como qualquer outro. Cinco delas diziam a
 * maquinaria em vez da coisa: «atravessados do motor», «um por número
 * publicado», «cujo valor é calculado a partir de outras linhas», «do
 * observatório construída», «contadas por língua». A Emenda 15 não conhece a
 * diferença entre uma frase no corpo e uma frase num atributo. Passam a
 * nomear: «itens da agenda», «linhas do livro-razão», «linhas calculadas»,
 * «concelhos com página», «edições no arquivo». As que já nomeavam ficam como
 * estavam, e as que só se rendem no Método ficam também, porque o Método é onde
 * o método vive.
 */
/** @type {Record<string, ParDeLinguas>} */
const FRASES = {
  fontes: {
    pt: 'organismos distintos no campo da fonte das linhas do livro-razão',
    en: 'distinct bodies in the source field of the ledger rows',
  },
  tipos_de_documento: {
    pt: 'linhas cujo documento declara o seu tipo, dos cinco que o formato conhece',
    en: 'rows whose document declares its kind, of the five the format knows',
  },
  linhas_cruzadas: {
    pt: 'linhas com entrada no registo da travessia do motor',
    en: 'rows with an entry in the engine crossing record',
  },
  linhas_anteriores_ao_tubo: {
    pt: 'linhas escritas antes de existir registo de travessia, e por isso sem um',
    en: 'rows written before any crossing record existed, and so without one',
  },
  leituras: {
    pt: 'trabalhos do arquivo com leitura do observatório escrita',
    en: 'archive works with an observatory reading written',
  },
  afirmacoes: {
    pt: 'linhas do livro-razão',
    en: 'ledger rows',
  },
  indexaveis: {
    pt: 'linhas sem nenhum campo de proveniência por confirmar',
    en: 'rows with no provenance field left to confirm',
  },
  divida: {
    pt: 'linhas com pelo menos um campo marcado [a verificar]',
    en: 'rows with at least one field marked [a verificar]',
  },
  derivadas: {
    pt: 'linhas calculadas',
    en: 'calculated rows',
  },
  aritmetica_reavaliada: {
    pt: 'linhas com a conta escrita como expressão, refeita a cada construção',
    en: 'rows with the arithmetic written as an expression, redone at each build',
  },
  releituras_registadas: {
    pt: 'entradas de reconferência escritas nas linhas do livro-razão',
    en: 're-check entries written into the ledger rows',
  },
  linhas_reconferidas: {
    pt: 'linhas com pelo menos uma reconferência escrita',
    en: 'rows with at least one re-check written',
  },
  releituras_divergentes: {
    pt: 'reconferências em que a fonte disse outra coisa',
    en: 're-checks where the source said something else',
  },
  painel_reconferido_em: {
    pt: 'data escrita pelo motor na última reconferência do painel',
    en: 'date written by the engine at the last panel re-check',
  },
  correcoes: {
    pt: 'entradas de natureza correção no livro-razão',
    en: 'entries of kind correction in the ledger',
  },
  atualizacoes: {
    pt: 'entradas de natureza atualização no livro-razão',
    en: 'entries of kind update in the ledger',
  },
  revisoes_de_proveniencia: {
    pt: 'entradas de natureza revisão de proveniência no livro-razão',
    en: 'entries of kind provenance revision in the ledger',
  },
  valores_creditados: {
    pt: 'linhas que creditam o valor a quem consta do documento',
    en: 'rows that credit the value to whoever the document names',
  },
  painel_total: {
    pt: 'medidas no painel europeu da primeira página',
    en: 'measures on the European panel of the front page',
  },
  painel_com_limiar: {
    pt: 'medidas do painel cujo quadro publica um limiar',
    en: 'panel measures whose scoreboard publishes a threshold',
  },
  painel_fora_do_limiar: {
    pt: 'medidas do painel cujo valor está fora do limiar publicado',
    en: 'panel measures whose value is outside the published threshold',
  },
  painel_dentro_do_limiar: {
    pt: 'medidas do painel cujo valor está dentro do limiar publicado',
    en: 'panel measures whose value is inside the published threshold',
  },
  painel_social_total: {
    pt: 'medidas do Painel Social Europeu que o livro-razão guarda',
    en: 'European Social Scoreboard measures the ledger holds',
  },
  /* A DICA NOMEIA O QUE SE CONTA E NÃO A COBERTURA (X1 da leitura do Codex,
     27.08.2026). Dizia «concelhos com página», e a frase visível ao lado já diz
     a cobertura por extenso: «308 de 308 concelhos · tem página». A palavra a
     mais fazia duas coisas: repetia a etiqueta que está à vista, e ressuscitava
     dentro de uma cadeia mais longa a frase «Com página» que a página dos 308
     retirou. Com 308 de 308 o qualificativo não diz nada que a frase não diga. */
  municipios_com_pagina: {
    pt: 'concelhos',
    en: 'concelhos',
  },
  concelhos_linhas: {
    pt: 'linhas do livro-razão do estudo dos concelhos',
    en: 'ledger rows of the municipalities study',
  },
  concelhos_no_livro: {
    pt: 'concelhos com pelo menos uma linha desse estudo',
    en: 'municipalities with at least one row of that study',
  },
  concelhos_linhas_completas: {
    pt: 'linhas desse estudo sem nenhum campo de proveniência por confirmar',
    en: 'rows of that study with no provenance field left to confirm',
  },
  municipios_total: {
    pt: 'concelhos no ficheiro de coordenadas da Carta Administrativa',
    en: 'concelhos in the coordinates file of the official administrative map',
  },
  estudos: {
    pt: 'trabalhos no arquivo',
    en: 'works in the archive',
  },
  edicoes: {
    pt: 'edições no arquivo',
    en: 'editions in the archive',
  },
  agenda: {
    pt: 'itens da agenda',
    en: 'agenda items',
  },
  endereco_correcoes: {
    pt: 'o endereço para onde se escreve, numa origem só',
    en: 'the address to write to, from a single source',
  },
  registos_edicoes: {
    pt: 'edições com registo de conteúdo atravessado do motor',
    en: 'editions with a content record crossed from the engine',
  },
  registos_blocos: {
    pt: 'blocos de texto nos registos de conteúdo, um por elemento do documento',
    en: 'text blocks in the content records, one per document element',
  },
  registos_algarismos: {
    pt: 'figuras assinaladas nos registos de conteúdo, uma por algarismo transcrito',
    en: 'figures marked in the content records, one per transcribed number',
  },
  registos_resolvidos: {
    pt: 'figuras com linha do motor que as resolve',
    en: 'figures with an engine row that resolves them',
  },
  registos_por_resolver: {
    pt: 'figuras sem linha do motor nenhuma',
    en: 'figures with no engine row at all',
  },
  registos_com_linha_do_sitio: {
    pt: 'figuras que também têm linha no livro-razão deste sítio',
    en: 'figures that also have a row in this site ledger',
  },
  registos_com_resumo_de_origem: {
    pt: 'figuras cuja linha traz o resumo de 64 hexadecimais do documento de origem',
    en: 'figures whose row carries the 64 hex digest of the source document',
  },
  registos_sem_resumo_de_origem: {
    pt: 'figuras cuja linha traz, em vez do resumo, um motivo da lista fechada do motor',
    en: 'figures whose row carries, instead of the digest, a reason from the engine closed list',
  },
  mapa_unidades: {
    pt: 'unidades da Carta Administrativa: os distritos e as ilhas',
    en: 'units of the official administrative map: the districts and the islands',
  },
  /* AS DUAS CONTAGENS DAS REGIÕES (Emenda 21, 27.08.2026). Hoje são iguais, e é
     por isso que são duas: no dia em que o motor declarar uma região antes de a
     linha atravessar, a diferença entre elas é a resposta certa e vê-se.

     AS DUAS FRASES NOMEIAM O QUE SE CONTA, e não a cobertura da casa (leitura
     cruzada do Codex, 28.08.2026): uma dica que diz «com linhas publicadas no
     livro-razão» é a casa a falar do seu próprio estado de publicação, que é o
     que a Emenda 15 manda sair de uma página do leitor. Uma conta as regiões da
     classificação, a outra as que a régua desenha. */
  regioes_total: {
    pt: 'regiões NUTS II de Portugal',
    en: 'NUTS II regions of Portugal',
  },
  regioes_com_linha: {
    pt: 'regiões desenhadas na régua da convergência',
    en: 'regions drawn on the convergence rule',
  },
};

/* ---------------------------------------------------------------------------
 * AS 29 CHAVES DA CONTAGEM DE CADA UNIDADE (Emenda 20, 27.08.2026)
 * ---------------------------------------------------------------------------
 * Cada página de distrito diz quantos concelhos tem, e essa contagem é um número
 * do sítio sobre si próprio: entra por `data-prova` e o portão reconta-a por
 * conta própria. As 29 frases de origem escrevem-se num laço e não à mão, pela
 * razão de sempre: 29 linhas copiadas divergem à primeira, e a única coisa que
 * muda de uma para a outra é o nome da unidade, que vem do artefacto.
 *
 * A CHAVE LEVA O SLUG e não um número de ordem, para que a mensagem do portão
 * nomeie a página em que o desacordo está.
 */
/** @param {string} slug */
export const CHAVE_DOS_CONCELHOS = (slug) => `mapa_concelhos_${slug}`;

for (const u of unidadesDoMapa()) {
  FRASES[CHAVE_DOS_CONCELHOS(u.slug)] = {
    pt: `concelhos da Carta Administrativa em ${u.nome}`,
    en: `municipalities of the official administrative map in ${u.nome}`,
  };
}

/* ---------------------------------------------------------------------------
 * A CONTAGEM DAS PEÇAS DE CADA ÁREA DE GOVERNO (decisão 6 de 25.08.2026)
 * ---------------------------------------------------------------------------
 * O índice das áreas diz quantas peças cada uma tem, e essa contagem é um número
 * do sítio sobre si próprio: entra por `data-prova` e o portão reconta-a nas
 * páginas construídas, contando as peças que cada página rendeu. As frases
 * escrevem-se num laço, pela razão das 29 do mapa.
 *
 * A CHAVE LEVA O SLUG COM SUBLINHADOS. O `data-prova` de uma chave e o nome
 * dela têm de ser a mesma cadeia, e os slugs das áreas levam hífenes; escrever
 * `areas_pecas_economia-e-coesao-territorial` misturava dois separadores na
 * mesma chave. O que a mensagem do portão precisa é de nomear a página em que o
 * desacordo está, e o sublinhado nomeia-a na mesma.
 */
/** @param {string} slug */
export const CHAVE_DAS_PECAS = (slug) => `areas_pecas_${slug.replace(/-/g, '_')}`;

/* A FRASE É A MESMA PARA TODAS AS ÁREAS, e é uma escolha e não uma preguiça. A
   dica de uma chave da prova é prosa da casa e entra no inventário; uma frase
   composta com o nome de cada área punha lá dezasseis linhas que são a lista dos
   ministérios escrita outra vez, e não diziam mais do que esta: o número conta as
   peças da página que a linha abre, e o nome da área está na própria linha. */
for (const a of AREAS) {
  FRASES[CHAVE_DAS_PECAS(a.slug)] = {
    pt: 'peças na página desta área de governo',
    en: 'pieces on this area of government’s page',
  };
}

/**
 * Todos os números que o sítio diz sobre si próprio, na língua de uma edição.
 * @param {'pt'|'en'} [lang]
 */
export function prova(lang = 'pt') {
  const claims = loadClaims();
  const linhas = [...claims.values()];
  const livro = routePath('livro', lang);
  /** @param {string} chave */
  const f = (chave) => FRASES[chave][lang] ?? FRASES[chave].pt;

  const divida = linhas.filter((c) => provenienciaIncompleta(c)).length;
  /* Todas as entradas de reconferência, de todas as linhas, numa lista só. */
  const entradasDeReleitura = linhas.flatMap((c) =>
    Array.isArray(c.verifications) ? c.verifications : [],
  );
  const cruzadas = linhasCruzadas();
  const registos = contagensDosRegistos(cruzadas.doMotor);
  const verificacao = estadoDaVerificacao();
  const dosConcelhos = contagensDosConcelhos();
  const ag = agenda();

  /** @type {Record<string, number>} */
  const porTipo = {};
  for (const tipo of TIPOS_DE_DOCUMENTO) porTipo[tipo] = 0;
  let semTipo = 0;
  for (const c of linhas) {
    const tipo = documentoDaLinha(c)?.kind;
    if (typeof tipo === 'string' && tipo in porTipo) porTipo[tipo]++;
    else semTipo++;
  }

  /** @type {(chave: string, valor: string | number | null, porta: string, extra?: Partial<ChaveDaProva>) => ChaveDaProva} */
  const k = (chave, valor, porta, extra = {}) => ({
    valor,
    origem: f(chave),
    porta,
    ...extra,
  });

  return {
    /* ---- o livro-razão ---- */
    afirmacoes: k('afirmacoes', claims.size, livro),
    indexaveis: k('indexaveis', claims.size - divida, livro),
    divida: k('divida', divida, livro),
    derivadas: k('derivadas', linhas.filter((c) => listaDaLinha(c.derived_from).length > 0).length, livro),
    aritmetica_reavaliada: k(
      'aritmetica_reavaliada',
      linhas.filter((c) => typeof c.check === 'string' && c.check.trim() !== '').length,
      livro,
    ),
    valores_creditados: k(
      'valores_creditados',
      linhas.filter((c) => listaDaLinha(c.attributed_to).length > 0).length,
      livro,
    ),
    /* Organismos citados, e o marcador não é um organismo.
       O `source` de uma linha cuja fonte ainda não foi confirmada é o próprio
       marcador, e contá-lo aqui punha «[a verificar]» a fazer de instituição:
       a regra 1 rendia catorze organismos citados quando os nomeados são
       treze. Apanhado pela segunda leitura cruzada de 20.08.2026 (achado 4,
       `DECISIONS.md` §1.48). A mesma exclusão está na cópia própria do portão,
       em `scripts/gate-html.mjs`, porque é ele que reconta a chave. */
    fontes: k(
      'fontes',
      new Set(linhas.map((c) => c.source).filter((f) => f && f !== POR_VERIFICAR)).size,
      livro,
    ),
    tipos_de_documento: k('tipos_de_documento', claims.size - semTipo, livro, {
      detalhe: { ...porTipo, sem_tipo: semTipo },
    }),

    /* ---- a travessia do motor ---- */
    linhas_cruzadas: k('linhas_cruzadas', cruzadas.total, livro, {
      manifestos: cruzadas.ficheiros,
    }),
    /* O resto das linhas publicadas. Vieram da mesma investigação, e foram
       escritas antes de haver registo de travessia: o tubo é de 2026-08-15. A
       regra 2 do Método diz «cada número sai do motor», e sem esta chave a sua
       prova mostrava só as que têm registo, deixando o leitor a somar de
       cabeça e a concluir mal. Ver DECISIONS §1.41. */
    linhas_anteriores_ao_tubo: k(
      'linhas_anteriores_ao_tubo',
      claims.size - cruzadas.total,
      livro,
    ),

    /* ---- o arquivo ---- */
    estudos: k('estudos', WORKS.length, routePath('estudos', lang)),
    edicoes: k('edicoes', EDITIONS.length, routePath('estudos', lang)),
    leituras: k('leituras', WORKS.filter((w) => temLeitura(w.id)).length, routePath('estudos', lang)),

    /* ---- o painel da primeira página (v3, etapa 2a) ----
       A manchete da primeira página diz «<n> limiares europeus ultrapassados»,
       e esse <n> tem de ser um número do próprio sítio, com porta e recontado
       pelo portão — e não uma palavra escrita à mão que fica errada no dia em
       que o painel muda. São três chaves e não uma, porque a frase precisa das
       três parcelas para não mentir por omissão: quantas medidas há, quantas
       têm limiar publicado, e quantas estão fora dele.

       O estado sai de `estadoDaMedida()`, que compara o valor publicado com o
       limiar publicado do lado que a linha declara. Nenhum algarismo é gerado
       aqui: contam-se medidas, não distâncias.

       A porta é a âncora do painel na própria página (IDENTIDADE §10, v2): o
       que estas três contam vê-se ali mesmo, mais abaixo. */
    painel_total: k('painel_total', FIGURAS_PDM.length, ancora(routePath('home', lang), 'painel')),
    painel_com_limiar: k(
      'painel_com_limiar',
      FIGURAS_PDM.filter((f) => f.limiar).length,
      ancora(routePath('home', lang), 'painel'),
    ),
    painel_fora_do_limiar: k(
      'painel_fora_do_limiar',
      FIGURAS_PDM.filter((f) => estadoDaMedida(claims.get(f.claim), f.limiar) === 'fora').length,
      ancora(routePath('home', lang), 'painel'),
    ),
    /* A OUTRA METADE DA MANCHETE (Emenda 16). «Portugal ultrapassa 4 limiares
       … e cumpre 9»: as duas contagens são chaves da prova, e nenhuma das duas
       é a diferença da outra escrita à mão. Uma medida cujo estado não se pode
       calcular não entra em nenhuma das duas, e a soma das duas pode ser menor
       do que `painel_total` — o que é a resposta certa, e é a razão de haver
       três chaves e não duas. */
    painel_dentro_do_limiar: k(
      'painel_dentro_do_limiar',
      FIGURAS_PDM.filter((f) => estadoDaMedida(claims.get(f.claim), f.limiar) === 'dentro').length,
      ancora(routePath('home', lang), 'painel'),
    ),
    /* O Painel Social Europeu tem lista própria, e a sua porta é a lista. Sem
       limiares publicados não há estado a contar: conta-se quantas medidas
       dele o livro-razão guarda, e mais nada. */
    painel_social_total: k(
      'painel_social_total',
      FIGURAS_SOCIAL.length,
      ancora(routePath('home', lang), 'painel-social'),
    ),

    /* ---- a cobertura ---- */
    municipios_com_pagina: k(
      'municipios_com_pagina',
      MUNICIPIOS_COM_PAGINA.length,
      routePath('municipios', lang),
    ),
    municipios_total: k('municipios_total', MUNICIPIOS.length, routePath('municipios', lang)),

    /* ---- as 29 unidades da Carta, e os concelhos de cada uma (Emenda 20) ----
       A contagem do índice, e uma por página de distrito. As 30 saem do
       artefacto que o motor atravessou, e o portão reconta-as da lista da Carta
       que o sítio já tem (`caop-centroids.mjs`): dois pontos de observação, e
       um desacordo entre eles fecha a construção.

       A PORTA DE CADA UMA É A LISTA QUE ELA CONTA, na própria página. É o que a
       IDENTIDADE §10 permite e o que a agenda já faz: quando o que o número
       conta se vê ali mesmo, o destino é a secção que o mostra. */
    mapa_unidades: k('mapa_unidades', unidadesDoMapa().length, `${routePath('distritos', lang)}#unidades`),

    /* ---- as regiões (Emenda 21, 27.08.2026) ----
       `declaradas` conta as entradas da lista de dados que não são a referência;
       `comLinha` conta as que têm as duas afirmações publicadas. O portão reconta
       a segunda pelas PÁGINAS construídas, que é o outro ponto de observação:
       uma região sem linhas que ganhasse página, ou uma região com linhas que a
       perdesse, dá dois números diferentes e a construção fecha.

       A PORTA DAS DUAS É A RÉGUA, na própria página do índice: o que elas contam
       vê-se ali mesmo, linha a linha, e é o que a IDENTIDADE §10 permite. */
    regioes_total: k('regioes_total', contagensDasRegioes().declaradas, `${routePath('regioes', lang)}#regua`),
    regioes_com_linha: k(
      'regioes_com_linha',
      contagensDasRegioes().comLinha,
      `${routePath('regioes', lang)}#regua`,
    ),
    ...Object.fromEntries(
      unidadesDoMapa().map((u) => [
        CHAVE_DOS_CONCELHOS(u.slug),
        k(
          CHAVE_DOS_CONCELHOS(u.slug),
          distritoDoMapa(u.slug).concelhos.length,
          `${routePath('distrito', lang, { slug: u.slug })}#concelhos`,
        ),
      ]),
    ),

    /* ---- as áreas de governo (decisão 6 de 25.08.2026) ----
       Uma chave por área DECLARADA, e não por área com página: uma área que
       perdesse a última peça deixaria de ter chave, e o índice deixaria de a
       render sem que nada dissesse porquê. A chave existe sempre e vale zero;
       quem decide se a área se rende é `areasComPagina()`, que é outra pergunta.

       A PORTA É A PÁGINA DA ÁREA, que é onde as peças estão. É a mesma linha em
       que o número se rende, e por isso o leitor carrega no número e chega ao
       que ele conta. */
    ...Object.fromEntries(
      areasComPecas().map((a) => [
        CHAVE_DAS_PECAS(a.slug),
        k(CHAVE_DAS_PECAS(a.slug), a.total, routePath('area', lang, { slug: a.slug })),
      ]),
    ),

    /* ---- o livro-razão do conjunto dos concelhos (decisão D6, 26.08.2026) ----
       As três contagens que a página do conjunto escreve. Nenhuma é um número
       da casa escrito à mão: as três saem das linhas que o livro-razão tem, e o
       portão reconta-as por conta própria. Enquanto o exportador do motor não
       correr, as três são zero — e zero é a resposta certa, não um estado por
       desenhar: a página rende-se vazia e a contagem di-lo. */
    concelhos_linhas: k('concelhos_linhas', dosConcelhos.linhas, routePath('livroConcelhos', lang)),
    concelhos_no_livro: k(
      'concelhos_no_livro',
      dosConcelhos.concelhos,
      routePath('livroConcelhos', lang),
    ),
    concelhos_linhas_completas: k(
      'concelhos_linhas_completas',
      dosConcelhos.completas,
      routePath('livroConcelhos', lang),
    ),

    /* ---- a releitura ----
       O campo `verifications[]` entrou a 18.08.2026 (DECISIONS §1.47). Estas
       três chaves contam-no: quantas entradas há, em quantas linhas, e quantas
       encontraram outro valor. A porta é o livro-razão, que é onde o leitor vê
       o que elas contam. */
    releituras_registadas: k('releituras_registadas', entradasDeReleitura.length, livro),
    linhas_reconferidas: k(
      'linhas_reconferidas',
      linhas.filter((c) => listaDaLinha(c.verifications).length > 0).length,
      livro,
    ),
    releituras_divergentes: k(
      'releituras_divergentes',
      entradasDeReleitura.filter((v) => v.result === 'diverge').length,
      livro,
    ),
    painel_reconferido_em: k(
      'painel_reconferido_em',
      verificacao.verificadoEm,
      /* A PORTA PASSA DE `#numeros` A `#painel` (Emenda 15, 21.08.2026). A
         primeira página tinha, por baixo do painel, uma linha que repetia a
         data que a mobília já diz em todas as páginas; a emenda tirou-a, e com
         ela a âncora. O que esta data cobre é o painel, e é para o painel que
         ela abre. */
      ancora(routePath('home', lang), 'painel'),
      { vencida: verificacao.vencida, dias: verificacao.dias },
    ),

    /* ---- o registo ---- */
    correcoes: k('correcoes', entradasDoRegisto('correcao').length, routePath('correcoes', lang)),
    atualizacoes: k(
      'atualizacoes',
      entradasDoRegisto('atualizacao').length,
      routePath('correcoes', lang),
    ),
    /* A porta é a secção do registo e não a página inteira: a contagem passou a
       ser dita na própria página das correções, e uma porta que aponta para a
       página onde já se está não abre nada. Da regra 7 do Método continua a
       levar o leitor ao mesmo sítio, um pouco mais abaixo. */
    revisoes_de_proveniencia: k(
      'revisoes_de_proveniencia',
      entradasDoRegisto('proveniencia').length,
      ancora(routePath('correcoes', lang), 'registo'),
    ),
    endereco_correcoes: k('endereco_correcoes', ENDERECO_CORRECOES, routePath('correcoes', lang)),

    /* ---- os registos de conteúdo do motor (parte 3, P3) ----
       Oito totais do sítio sobre a matéria-prima das páginas de leitura. A
       porta é o arquivo, que é de onde cada leitura se abre: não há hoje
       nenhuma página que os renda, e por isso nenhuma frase do Método os cita.
       Acrescentar um rótulo à prova de uma regra é uma edição de `metodo.mjs`,
       que é texto governado, e essa é decisão do diretor. Ver §1.64, P3.

       As duas últimas não somam necessariamente `registos_algarismos`: uma
       figura sem resumo e sem motivo da lista fechada não entra em nenhuma, e
       é o `check:cadeia` que a nomeia. */
    registos_edicoes: k('registos_edicoes', registos.edicoes, routePath('estudos', lang)),
    registos_blocos: k('registos_blocos', registos.blocos, routePath('estudos', lang)),
    registos_algarismos: k('registos_algarismos', registos.algarismos, routePath('estudos', lang)),
    registos_resolvidos: k('registos_resolvidos', registos.resolvidos, routePath('estudos', lang)),
    registos_por_resolver: k(
      'registos_por_resolver',
      registos.por_resolver,
      routePath('estudos', lang),
    ),
    registos_com_linha_do_sitio: k(
      'registos_com_linha_do_sitio',
      registos.com_linha_do_sitio,
      routePath('estudos', lang),
    ),
    registos_com_resumo_de_origem: k(
      'registos_com_resumo_de_origem',
      registos.com_resumo_de_origem,
      routePath('estudos', lang),
    ),
    registos_sem_resumo_de_origem: k(
      'registos_sem_resumo_de_origem',
      registos.sem_resumo_de_origem,
      routePath('estudos', lang),
      /* Os motivos, um a um: sem o detalhe, «2 091 sem resumo» lê-se como uma
         falha de proveniência, e o que ela é são cinco razões declaradas pelo
         motor, cada uma com o seu nome. */
      { detalhe: { ...registos.motivos } },
    ),

    /* ---- a agenda: existe quando o ficheiro existe, e não antes ---- */
    agenda_total: k('agenda', ag ? ag.total : null, portaDaAgenda(lang)),
    agenda_em_curso: k('agenda', ag ? ag.em_curso : null, portaDaAgenda(lang, 'em_curso')),
    agenda_a_seguir: k('agenda', ag ? ag.a_seguir : null, portaDaAgenda(lang, 'a_seguir')),
    agenda_concluido: k('agenda', ag ? ag.concluido : null, portaDaAgenda(lang, 'concluido')),
    agenda_retirado: k('agenda', ag ? ag.retirado : null, portaDaAgenda(lang, 'retirado')),
  };
}

/** As chaves conhecidas. O portão recusa qualquer marca fora desta lista. */
export function chavesDaProva() {
  return Object.keys(prova('pt'));
}
