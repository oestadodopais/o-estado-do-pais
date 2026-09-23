/**
 * =============================================================================
 * K16 · CADA PEDAÇO DE CADA PERGUNTA TEM ORIGEM · B2, peça 1, segunda passagem
 * de correção (23.09.2026)
 * =============================================================================
 *
 * PORQUE EXISTE. A leitura a frio da peça 1 do B2 (achado 8) viu a pergunta do
 * desemprego de longa duração dizer «a população ativa» como denominador, e a
 * única origem declarada da definição dizia outra coisa. A K6 compara o texto
 * rendido com a declaração, carácter a carácter, e por isso nenhum portão via a
 * falta: a declaração estava certa consigo mesma e errada contra a fonte. A
 * decisão do lugar de direção: cada pedaço de cada pergunta apoia-se numa
 * origem selada ou num campo selado da linha (o `document.title` e a `unit`
 * contam), e onde faltar pede-se a metainformação pelo cliente da casa e
 * sela-se a origem no motor.
 *
 * O QUE CONFERE, sobre a auditoria escrita em `perguntas-provadas.json`:
 *   1. cada pergunta declarada em `DEFINICOES_DAS_MEDIDAS` tem uma auditoria, e
 *      nenhuma auditoria fala de uma pergunta que não existe;
 *   2. as origens que a auditoria lê são, pela mesma ordem, as que a pergunta
 *      declara, e a pergunta que ela transcreve é a declarada, nas duas edições;
 *   3. os pedaços juntos são, carácter a carácter, a pergunta de cada edição;
 *   4. cada pedaço tem pelo menos um apoio, e cada apoio cita um literal que
 *      está MESMO no campo que diz: num campo de uma origem que a pergunta
 *      declara (`excerto`, `excertoEn`, `documento`), ou num campo selado da
 *      linha da própria medida (`excerpt`, `unit`, `document.title`);
 *   5. cada origem que a pergunta declara apoia pelo menos um pedaço: uma origem
 *      declarada que não apoia nada é uma citação de enfeite;
 *   6. cada origem cujo endereço é uma resposta da API de disseminação do
 *      Eurostat traz o selo do seu pedido no motor: o endereço (o `url` da
 *      origem), a hora, o cliente e o sha256, mais o ficheiro no motor e o campo.
 *
 * O QUE NÃO CONFERE, e di-lo: não infere que o literal quer dizer o que o pedaço
 * diz. Essa escolha é uma leitura, feita por quem assina a auditoria, e é essa
 * leitura que a leitura a frio relê. A célula garante que a leitura não pode
 * ficar para trás sem que a construção feche: uma pergunta que mude, uma origem
 * cujo excerto mude, ou um pedaço novo sem apoio fecham a construção até alguém
 * voltar a ler. Não relê os bytes do motor (este repositório não os tem, e é
 * público): o guião das medições do bloco confere o sha256 e o campo de cada
 * selo contra o ficheiro do motor.
 *
 * Leitor próprio: lê a declaração e o livro-razão, e não a vista que os rende.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFINICOES_DAS_MEDIDAS,
  ORIGENS_DAS_DEFINICOES,
  textoDaDefinicao,
} from '../../src/data/figuras.mjs';
import { loadClaims } from '../../src/lib/ledger.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const AUDITORIA_DAS_PERGUNTAS = path.join(AQUI, 'perguntas-provadas.json');

/** Os campos de uma origem que podem apoiar um pedaço. */
const CAMPOS_DA_ORIGEM = new Set(['excerto', 'excertoEn', 'documento']);
/** Os campos selados da linha que podem apoiar um pedaço. */
const CAMPOS_DA_LINHA = new Set(['excerpt', 'unit', 'document.title']);
/* UM LITERAL DE MENOS DE QUATRO CARACTERES NÃO PRENDE NADA: «de» ou «%» estão
   em quase todos os excertos, e um apoio assim passava sempre. */
const LITERAL_MINIMO = 4;
/* AS RESPOSTAS DA API DO EUROSTAT SÃO PEDIDAS PELO CLIENTE DA CASA, e o pedido
   fica registado no motor; é por isso que uma origem destas traz o selo. As
   páginas do glossário e da Comissão foram lidas antes desta regra e declaram o
   endereço, a data e o excerto, como sempre. */
const API_DO_EUROSTAT = /^https:\/\/ec\.europa\.eu\/eurostat\/api\/dissemination\//;

/** @param {string} [ficheiro] */
export function lerAuditoriaDasPerguntas(ficheiro = AUDITORIA_DAS_PERGUNTAS) {
  return JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
}

/** @param {any} linha @param {string} campo */
const campoDaLinha = (linha, campo) =>
  campo === 'document.title' ? linha?.document?.title : linha?.[campo];

/** @param {string} s */
const curto = (s) => (s.length > 60 ? `${s.slice(0, 57)}…` : s);

/**
 * @param {{ auditoria?: any, definicoes?: Record<string, any>, origens?: Record<string, any>, linhas?: Map<string, any> }} [entrada]
 * @returns {{ erros: string[], contas: { perguntas: number, pedacos: number, apoios: number, apoios_em_origens: number, apoios_em_linhas: number, origens_usadas: number, origens_seladas: number } }}
 */
export function auditarPerguntas({
  auditoria = lerAuditoriaDasPerguntas(),
  definicoes = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS),
  origens = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES),
  linhas = loadClaims(),
} = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = {
    perguntas: 0, pedacos: 0, apoios: 0, apoios_em_origens: 0, apoios_em_linhas: 0,
    origens_usadas: 0, origens_seladas: 0,
  };
  /** @param {string} id @param {string} m */
  const falha = (id, m) => erros.push(`K16 · ${id}: ${m}`);

  const lista = auditoria?.perguntas;
  if (!Array.isArray(lista) || lista.length === 0) {
    erros.push('K16 · a auditoria das perguntas não tem pergunta nenhuma: a célula não mediu nada');
    return { erros, contas };
  }

  /** @type {Map<string, any>} */
  const auditadas = new Map();
  for (const q of lista) {
    if (auditadas.has(q?.id)) falha(q?.id, 'aparece duas vezes na auditoria');
    auditadas.set(q?.id, q);
  }
  for (const id of Object.keys(definicoes)) {
    if (!auditadas.has(id)) falha(id, 'a pergunta declarada não tem auditoria pedaço a pedaço');
  }

  /** @type {Set<string>} */
  const usadasEmTudo = new Set();
  for (const [id, q] of auditadas) {
    const d = definicoes[id];
    if (!d) {
      falha(id, 'a auditoria fala de uma pergunta que não está declarada');
      continue;
    }
    contas.perguntas++;
    const declaradas = [...(d.origens ?? [])];
    if (JSON.stringify(q.origens ?? []) !== JSON.stringify(declaradas)) {
      falha(id, `a auditoria lê as origens ${JSON.stringify(q.origens ?? [])} e a pergunta declara ${JSON.stringify(declaradas)}`);
    }
    for (const lang of /** @type {const} */ (['pt', 'en'])) {
      const declarada = textoDaDefinicao(d[lang] ?? []);
      if (q.pergunta?.[lang] !== declarada) {
        falha(id, `${lang}: a pergunta que a auditoria transcreve difere da declarada («${curto(declarada)}»)`);
      }
      const junta = (q.pedacos ?? []).map((/** @type {any} */ p) => p?.[lang] ?? '').join('');
      if (junta !== declarada) {
        falha(id, `${lang}: os pedaços juntos dão «${curto(junta)}» e a pergunta declarada é «${curto(declarada)}»`);
      }
    }

    /** @type {Set<string>} */
    const usadas = new Set();
    for (const [i, p] of (q.pedacos ?? []).entries()) {
      contas.pedacos++;
      const qual = `o pedaço ${i + 1} («${curto(p?.pt ?? '')}»)`;
      if (!Array.isArray(p?.apoios) || p.apoios.length === 0) {
        falha(id, `${qual} não tem apoio nenhum`);
        continue;
      }
      for (const a of p.apoios) {
        contas.apoios++;
        const literal = a?.literal;
        if (typeof literal !== 'string' || literal.trim().length < LITERAL_MINIMO) {
          falha(id, `${qual} cita um literal com menos de ${LITERAL_MINIMO} caracteres, que não prende nada`);
          continue;
        }
        if (a.origem) {
          if (!declaradas.includes(a.origem)) {
            falha(id, `${qual} apoia-se em «${a.origem}», que a pergunta não declara como origem`);
            continue;
          }
          const o = origens[a.origem];
          if (!CAMPOS_DA_ORIGEM.has(a.campo) || typeof o?.[a.campo] !== 'string') {
            falha(id, `${qual} cita o campo «${a.campo}» da origem «${a.origem}», que não existe ou não pode apoiar`);
            continue;
          }
          if (!o[a.campo].includes(literal)) {
            falha(id, `${qual} cita «${curto(literal)}», que não está no campo «${a.campo}» da origem «${a.origem}»`);
            continue;
          }
          usadas.add(a.origem);
          contas.apoios_em_origens++;
        } else if (a.linha) {
          if (a.linha !== id) {
            falha(id, `${qual} cita a linha «${a.linha}», e só a linha da própria medida conta`);
            continue;
          }
          const linha = linhas.get(a.linha);
          if (!linha) {
            falha(id, `${qual} cita a linha «${a.linha}», que não está no livro-razão`);
            continue;
          }
          const valor = CAMPOS_DA_LINHA.has(a.campo) ? campoDaLinha(linha, a.campo) : undefined;
          if (typeof valor !== 'string') {
            falha(id, `${qual} cita o campo «${a.campo}» da linha, que não existe ou não pode apoiar`);
            continue;
          }
          if (!valor.includes(literal)) {
            falha(id, `${qual} cita «${curto(literal)}», que não está no campo «${a.campo}» da linha`);
            continue;
          }
          contas.apoios_em_linhas++;
        } else {
          falha(id, `${qual} tem um apoio sem origem nem linha`);
        }
      }
    }
    for (const o of declaradas) {
      if (!usadas.has(o)) falha(id, `a origem declarada «${o}» não apoia pedaço nenhum da pergunta`);
      usadasEmTudo.add(o);
    }
  }
  contas.origens_usadas = usadasEmTudo.size;

  /* O SELO DE CADA RESPOSTA DA API. */
  for (const [chave, o] of Object.entries(origens)) {
    const daApi = API_DO_EUROSTAT.test(o?.url ?? '');
    if (!daApi && !o?.selo) continue;
    const s = o?.selo;
    if (!s) {
      erros.push(`K16 · origem «${chave}»: é uma resposta da API do Eurostat e não traz o selo do pedido (endereço, hora, cliente e sha256)`);
      continue;
    }
    contas.origens_seladas++;
    const faltas = [];
    if (!/^https:\/\/\S+$/.test(o.url ?? '')) faltas.push('o endereço');
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s.hora ?? '')) faltas.push('a hora (UTC, ao segundo)');
    if (typeof s.cliente !== 'string' || !s.cliente.startsWith('core.http.HttpClient')) faltas.push('o cliente da casa');
    if (!/^[0-9a-f]{64}$/.test(s.sha256 ?? '')) faltas.push('o sha256');
    if (typeof s.motor !== 'string' || !s.motor.startsWith('indicators/out/')) faltas.push('o ficheiro no motor');
    if (typeof s.campo !== 'string' || !s.campo) faltas.push('o campo lido');
    if (faltas.length) {
      erros.push(`K16 · origem «${chave}»: o selo não diz ${faltas.join(', ')}`);
    } else if (s.hora.slice(0, 10) !== o.lido) {
      erros.push(`K16 · origem «${chave}»: a data de leitura (${o.lido}) não é o dia do pedido selado (${s.hora.slice(0, 10)})`);
    }
  }
  return { erros, contas };
}
