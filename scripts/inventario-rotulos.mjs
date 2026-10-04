#!/usr/bin/env node
/**
 * =============================================================================
 * O INVENTÁRIO DOS RÓTULOS, COMO RÉGUA (bloco R2, 03.10.2026, item 1 do mandato; o §3, ponto 1, do brief R2)
 * =============================================================================
 *
 * PORQUE EXISTE. O diretor leu na página de Évora, a 02.10.2026, a unidade «% (limite legal = 150)», que se lia
 * «105,5 % de 150»; a unidade era a etiqueta que o motor escreveu na linha, e nenhuma régua lia os rótulos que o leitor
 * vê. O brief R2 contou-os pela primeira vez (o inventário do §0, `design/observatorio/medidas/inventario-rotulos.py`),
 * a auditoria dos rótulos leu-os com três perguntas, e esta régua fica a guardá-los: cada rótulo de cada cartão de
 * medida tem de ser o que a sua declaração diz, e um rótulo sem declaração fecha a construção. É assim que uma etiqueta
 * nova do motor chega a quem lê antes de chegar a um cartão (o brief, §5, decisão 2).
 *
 * AS FAMÍLIAS, cada cartão chaveado pela sua linha ou pela sua medida, e nunca agrupado num balde sem chave (o achado 8
 * da auditoria):
 *   nacional   `article.cartao-medida[data-cartao-medida]` sem `data-medida-chave` (o cartão das páginas de assunto e
 *              das áreas), chave = a linha;
 *   concelho   o cartão de uma medida de concelho, chave = `concelho:<medida>` (as 616 páginas);
 *   camaras    o cartão das câmaras em «Lugares»;
 *   uniao      o cartão da faixa da página da União (`li.cartao[data-cartao]`), chave = a linha;
 *   dobra      a definição dobrada de cada medida na página da União (`details.dobra[data-leitura]`), chave = a linha.
 *
 * OS CAMPOS E A DECLARAÇÃO DE CADA UM (leitores próprios: lê as declarações e o livro-razão, e não as funções das vistas):
 *   nome       o nome do projeto declarado (`FIGURAS`, `MEDIDAS_DO_DOMINIO_1`, `NOMES_DO_PROJETO`), ou, sem ele, o nome
 *              oficial confirmado (marca `data-nome="oficial"`, que o `check:nomes` confere contra o ficheiro do motor);
 *              um cartão que se nomeie pelo rótulo ou pelo título da fonte é um rótulo sem declaração. Concelho: o nome
 *              da medida (`MEDIDAS_DO_CONCELHO`); câmaras: a cadeia da casa; União: o nome da figura;
 *   unidade    a unidade declarada do cartão (`UNIDADES_DOS_CARTOES`; a da medida de concelho), com a marca
 *              `data-unidade-da-casa`; ou a unidade da linha, como o motor a escreve (com o euro por extenso) na edição
 *              portuguesa e pela entrada do dicionário na inglesa, só se essa unidade está na lista fechada das que um
 *              cartão imprime (`UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO`) ou o cartão está declarado em dívida; União: a
 *              linha `medida` da figura;
 *   estado     o veredicto contra o valor de referência, pela forma do seu dono (`estado.doDono`, com a direção e o
 *              símbolo; a K15 escolhe o lado pelas contas, esta régua confere que a forma é uma das declaradas para o
 *              dono da medida); o rótulo da União na régua; no índice de dívida, a linha do teto;
 *   faixa      a frase do lugar e a da comparação da faixa do concelho, pelas palavras declaradas e pelas da medida (a
 *              FC recompõe-nas com os valores; esta régua confere a forma). A frase da faixa da União é recomposta
 *              inteira pela F19 e pela K18, e aqui só se inventaria;
 *   dobra      a pergunta declarada (`DEFINICOES_DAS_MEDIDAS`), a frase do que é a referência quando a página a pede, a
 *              nota da medida de concelho (a primeira frase), a base do índice no cartão das câmaras, e a definição na
 *              dobra da página da União.
 *   periodo    só se inventaria: o período é o da linha, e a F1 do `check:formas` recompõe-no.
 *
 * O INVENTÁRIO DECLARADO, `design/especime-v3/rotulos/INVENTARIO.json`: as formas distintas de cada campo, por chave e
 * por edição, com quantas vezes cada uma se rende (os algarismos do período, do estado e da faixa apagados). Escreve-o
 * `--escrever`, que um bloco corre quando muda rótulos, para o diff mostrar ao leitor de outra família cada rótulo que
 * mudou. Sem `--escrever` a régua não escreve na árvore: confere, e compara TODOS os campos de cada chave com o
 * inventário declarado, com as contagens (passagem R2-b, 04.10.2026, achados 4 e 5 da leitura a frio do Sol): uma forma
 * que se renda mais ou menos vezes do que o declarado, uma forma ou uma chave nova, e uma chave declarada que não se
 * rende fecham a construção. É assim que um concelho a menos aparece, embora os 308 partilhem a chave da medida.
 *
 * O QUE FALTA TAMBÉM MORDE (R2-b, achado 5): um cartão nacional cuja medida tem valor de referência declarado diz o
 * estado; um cartão de concelho com valor de uma medida com teto diz a linha do estado, uma vez; um cartão de uma
 * medida com faixa declarada tem uma frase do lugar e uma da comparação, e um de uma medida sem faixa não tem nenhuma.
 *
 * AS PLANTAS (`--prova`): cópias em memória de páginas construídas, uma por campo e por regra, e cada uma tem de morder
 * com a queixa esperada; as páginas intactas têm de passar (o controlo). E as plantas da construção inteira
 * (`plantasDaConstrucao`): uma página trocada no inventário desta construção, comparado com o declarado (um concelho
 * sem o cartão, uma linha do estado e uma frase da faixa a menos, uma chave declarada que deixa de se render).
 *
 *   node scripts/inventario-rotulos.mjs [--prova] [--json <ficheiro>]     (OEDP_DIST mede outra construção)
 *   node scripts/inventario-rotulos.mjs --escrever                         (escreve o inventário declarado)
 *   node scripts/inventario-rotulos.mjs --inventario <ficheiro>            (só o inventário de uma construção, sem o comparar)
 *
 * Sai 0 com tudo conforme e, com `--prova`, as plantas a morder; 1 se não.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { loadClaims } from '../src/lib/ledger.mjs';
import { FIGURAS, DEFINICOES_DAS_MEDIDAS, ORIGENS_DAS_DEFINICOES, textoDaDefinicao } from '../src/data/figuras.mjs';
import { MEDIDAS_DO_DOMINIO_1, DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO, ressalvaDosDiplomasRegionais } from '../src/data/dominios.mjs';
import { NOMES_DO_PROJETO } from '../src/data/nomes-das-medidas.mjs';
import { MEDIDAS_DO_CONCELHO } from '../src/data/concelhos.mjs';
import { UNIDADES, UNIDADES_EM_PORTUGUES } from '../src/i18n/unidades.mjs';
import {
  UNIDADES_DOS_CARTOES,
  UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO,
  CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA,
  NOMES_COM_A_VARIACAO_NA_UNIDADE,
} from '../src/data/unidades-dos-cartoes.mjs';
import { TERMOS_DOS_CARTOES } from '../src/data/termos-dos-cartoes.mjs';
import { REFERENCIAS_DAS_MEDIDAS } from '../src/data/referencias-das-medidas.mjs';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../src/data/faixa-do-concelho.mjs';
import { t } from '../src/i18n/strings.mjs';
import { getSerie } from '../src/lib/series.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const INVENTARIO_DECLARADO = path.join(RAIZ, 'design', 'especime-v3', 'rotulos', 'INVENTARIO.json');
const LINHAS = loadClaims();

/* --------------------------------------------------------------------------- os leitores próprios */

/** Os espaços da casa (o rígido, o fino) contam como um espaço. @param {unknown} s */
const norm = (s) => String(s ?? '').replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
/** O texto que se vê de um elemento: sem o que só um leitor de ecrã ouve, nem a glosa e a definição do marcador. */
function visivel(el) {
  if (!el) return '';
  const copia = parse(el.outerHTML);
  for (const e of copia.querySelectorAll('.vh, [aria-hidden="true"], .marcador-gloss, .marcador-definicao')) e.remove();
  return norm(copia.text);
}
/** Os algarismos de uma forma, apagados: o inventário guarda a forma e não o valor. @param {string} s */
const semAlgarismos = (s) => s.replace(/\d+(?:[ ,.]\d+)*/g, '#');
/** O dinheiro com a palavra, pela regra da casa e não pela função da vista. @param {string} u */
const comAPalavra = (u) => u.replace(/^€(?=\s|$)/u, 'euros');
/** Uma lista de pedaços declarados, como texto. @param {unknown} partes */
const textoDosPedacos = (partes) =>
  Array.isArray(partes)
    ? partes.map((p) => (typeof p === 'string' ? p : p?.termo ?? p?.nl ?? p?.ref ?? '')).join('')
    : '';
/** A primeira frase de uma nota declarada (a regra do cartão do lugar, escrita aqui de novo). @param {unknown} partes */
function primeiraFrase(partes) {
  const texto = textoDosPedacos(partes);
  const fim = texto.match(/[.!?](?=\s|$)/);
  return norm(fim ? texto.slice(0, (fim.index ?? 0) + 1) : texto);
}

/** O nome de nível de um cartão cuja unidade declarada diz a variação (R2-b), lido da tabela. @param {string} id @param {'pt'|'en'} lang */
function nomeDeNivel(id, lang) {
  const n = /** @type {Record<string, any>} */ (NOMES_COM_A_VARIACAO_NA_UNIDADE)[id];
  return n && Object.prototype.hasOwnProperty.call(UNIDADES_DOS_CARTOES, id) ? n[lang] ?? n.pt : null;
}
/** O nome do projeto declarado de uma linha, pela ordem das declarações. @param {string} id @param {'pt'|'en'} lang */
function nomeDeclarado(id, lang) {
  const nivel = nomeDeNivel(id, lang);
  if (nivel) return { texto: nivel, fonte: 'cartao' };
  const f = FIGURAS.find((x) => x.claim === id);
  if (f?.nome) return { texto: f.nome[lang] ?? f.nome.pt, fonte: 'figuras' };
  const m = MEDIDAS_DO_DOMINIO_1.find((x) => x.claim === id);
  if (m?.nome) return { texto: m.nome[lang] ?? m.nome.pt, fonte: 'medidas' };
  const p = /** @type {Record<string, any>} */ (NOMES_DO_PROJETO)[id];
  if (p) return { texto: p[lang] ?? p.pt, fonte: 'projeto' };
  return null;
}

/** A unidade que um cartão deve imprimir, e de onde. @param {string} id @param {'pt'|'en'} lang */
function unidadeEsperada(id, lang) {
  const casa = /** @type {Record<string, any>} */ (UNIDADES_DOS_CARTOES)[id];
  if (casa) return { texto: norm(textoDosPedacos(casa[lang])), casa: true, aceite: true, de: 'declarada' };
  const linha = LINHAS.get(id);
  const u = String(linha?.unit ?? '');
  const traduzida = lang === 'en' && Object.prototype.hasOwnProperty.call(UNIDADES, u) ? /** @type {Record<string, string>} */ (UNIDADES)[u] : u;
  const emDivida = Object.prototype.hasOwnProperty.call(CARTOES_COM_A_UNIDADE_DA_LINHA_EM_DIVIDA, id);
  const aceite = Object.prototype.hasOwnProperty.call(UNIDADES_DA_LINHA_ACEITES_NUM_CARTAO, u) || emDivida;
  const portugues = lang === 'en' && Object.prototype.hasOwnProperty.call(UNIDADES_EM_PORTUGUES, u);
  return { texto: norm(comAPalavra(traduzida)), casa: false, aceite, emDivida, portugues, linha: u, de: emDivida ? 'em dívida' : 'da linha' };
}

/** As formas declaradas do veredicto de um dono, com o lugar do valor de referência como «#». */
function formasDoVeredicto(id, lang) {
  const r = REFERENCIAS_DAS_MEDIDAS.get(id);
  if (!r?.limiar) return null;
  const s = t(lang).estado;
  const dono = s.doDono?.[r.limiarFixadoPor];
  if (!dono) return new Set();
  const banda = Boolean(r.limiar.inferior && r.limiar.superior);
  const simbolo = String(r.limiar.simbolo ?? '%').trim() || '%';
  const sinal = (v) => (v?.sinal === '+' ? '' : v?.sinal ?? '');
  const formas = new Set();
  if (banda) {
    for (const e of ['dentro', 'fora']) {
      const palavra = dono[`${e}Banda`];
      if (!palavra) continue;
      formas.add(`${palavra} (${s.direcao.entre} ${sinal(r.limiar.inferior)}# ${s.direcao.e} ${sinal(r.limiar.superior)}# ${simbolo})`);
      for (const d of ['acima', 'abaixo']) {
        const ponta = d === 'abaixo' ? r.limiar.inferior : r.limiar.superior;
        formas.add(`${palavra} (${s.direcao[d]} ${sinal(ponta)}# ${simbolo})`);
      }
    }
  } else {
    for (const e of ['dentro', 'fora']) {
      const palavra = dono[e];
      if (!palavra) continue;
      for (const d of ['acima', 'abaixo', 'noLimiar']) formas.add(`${palavra} (${s.direcao[d]} ${sinal(r.limiar)}# ${simbolo})`);
    }
  }
  return formas;
}

/** As formas declaradas das frases da faixa de uma medida de concelho, com o nome como «L» e os números como «#». */
function formasDaFaixa(chave, lang) {
  const F = t(lang).municipio.faixaDoConcelho;
  const d = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave];
  const naFrase = d?.naFrase?.[lang];
  const lugar = new Set();
  const comparacao = new Set();
  if (!d?.faixa || !naFrase) return { lugar, comparacao };
  const ordinais = [...new Set(Object.values(F.ordinal))];
  const empates = ['', F.aParUm, `${F.aParVariosA}#${F.aParVariosB}`];
  for (const o of ordinais) {
    for (const e of empates) lugar.add(norm(`L (#)${F.lugarA}#${o}${F.lugarB}#${F.lugarC}${naFrase}${F.lugarD}${F.ordem[d.ordem]}${e}${F.fim}`));
  }
  lugar.add(norm(`L${F.semValorA}#${F.semValorB}${naFrase}${F.semValorC}`));
  const c = d.comparacao;
  if (c && 'linha' in c) {
    const u = String(LINHAS.get(c.linha)?.unit ?? '');
    const unidade = comAPalavra(lang === 'en' && Object.prototype.hasOwnProperty.call(UNIDADES, u) ? /** @type {Record<string, string>} */ (UNIDADES)[u] : u);
    for (const lado of ['acima', 'abaixo', 'igual']) comparacao.add(norm(`${F.comparacaoA}${F[lado]}${F.comparacaoLinhaA}${d.ondePortugal?.[lang] ?? ''}${F.comparacaoLinhaB}# ${unidade}${F.comparacaoLinhaC}`));
  } else if (c && 'base' in c) {
    for (const lado of ['mediaAcima', 'mediaAbaixo', 'mediaIgual']) comparacao.add(norm(`${F.comparacaoA}${F[lado]}${F.comparacaoBaseA}#${F.comparacaoBaseB}`));
  }
  comparacao.add(norm(F.semComparacao));
  return { lugar, comparacao };
}

/* --------------------------------------------------------------------------- a conferência de uma página */

/**
 * Confere os cartões de uma página e junta as formas ao inventário.
 *
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ rota: string, lang: 'pt'|'en', inventario: Map<string, any>, contas: Record<string, any> }} ctx
 * @returns {string[]}
 */
export function conferirPagina(root, { rota, lang, inventario, contas }) {
  /** @type {string[]} */
  const erros = [];
  const erro = (campo, chave, msg) => erros.push(`R2-${campo} · ${rota} · ${chave}: ${msg}`);
  const junta = (familia, chave, campo, forma) => {
    if (!forma) return;
    const k = `${familia}|${lang}|${chave}`;
    if (!inventario.has(k)) inventario.set(k, { familia, lang, chave, campos: {} });
    const c = inventario.get(k).campos;
    c[campo] ??= {};
    c[campo][forma] = (c[campo][forma] ?? 0) + 1;
  };
  const s = t(lang);
  /** Os termos já explicados nesta página, pela ordem dos cartões (R2-b). */
  const termosVistos = new Set();

  for (const cartao of root.querySelectorAll('article.cartao-medida')) {
    contas.cartoes++;
    const id = cartao.getAttribute('data-cartao-medida');
    const chaveDoConcelho = cartao.getAttribute('data-medida-chave');
    const camaras = cartao.hasAttribute('data-cartao-camaras');
    const familia = camaras ? 'camaras' : chaveDoConcelho ? 'concelho' : id ? 'nacional' : null;
    if (!familia) {
      erro('chave', '?', 'um cartão de medida sem a marca da sua linha nem da sua medida: o inventário não o chaveia, e um rótulo sem chave não tem declaração');
      continue;
    }
    contas.familias[familia] = (contas.familias[familia] ?? 0) + 1;
    const chave = familia === 'nacional' ? /** @type {string} */ (id) : familia === 'concelho' ? `concelho:${chaveDoConcelho}` : 'camaras';
    const nomeEl = cartao.querySelector('.cartao-medida-nome');
    const unidadeEl = cartao.querySelector('.cartao-medida-quantidade .cartao-medida-unidade');
    const periodoEl = cartao.querySelector('.cartao-medida-periodo');
    const nomeVisto = visivel(nomeEl);
    const unidadeVista = visivel(unidadeEl);
    junta(familia, chave, 'nome', nomeVisto);
    junta(familia, chave, 'unidade', unidadeVista);
    junta(familia, chave, 'periodo', semAlgarismos(visivel(periodoEl)));

    if (familia === 'nacional') {
      /* O NOME */
      const declarado = nomeDeclarado(/** @type {string} */ (id), lang);
      const marca = nomeEl?.getAttribute('data-nome') ?? null;
      if (declarado) {
        if (!nomeEl || marca !== declarado.fonte || nomeVisto !== norm(declarado.texto)) {
          erro('nome', chave, `o nome diz «${nomeVisto}» (${marca ?? nomeEl?.getAttribute('data-linha-campo') ?? 'sem marca'}) e a declaração (${declarado.fonte}) diz «${norm(declarado.texto)}»`);
        }
        contas.nomes[declarado.fonte] = (contas.nomes[declarado.fonte] ?? 0) + 1;
      } else if (marca === 'oficial') {
        contas.nomes.oficial = (contas.nomes.oficial ?? 0) + 1;
      } else {
        erro('nome', chave, `o cartão nomeia-se «${nomeVisto}» pelo ${nomeEl?.getAttribute('data-linha-campo') ?? 'nada'} da fonte, e a linha não tem nome declarado (FIGURAS, MEDIDAS_DO_DOMINIO_1, NOMES_DO_PROJETO): um rótulo sem declaração`);
      }
      /* A UNIDADE */
      const u = unidadeEsperada(/** @type {string} */ (id), lang);
      const daCasa = unidadeEl?.getAttribute('data-unidade-da-casa') ?? null;
      if (!unidadeEl) erro('unidade', chave, 'o cartão não imprime unidade');
      else if (u.casa) {
        if (daCasa !== id || unidadeVista !== u.texto) erro('unidade', chave, `a unidade diz «${unidadeVista}»${daCasa ? '' : ' (sem a marca da unidade da casa)'} e a declaração diz «${u.texto}»`);
        contas.unidades.declaradas++;
      } else {
        if (daCasa || unidadeEl.getAttribute('data-linha-claim') !== id || unidadeVista !== u.texto) {
          erro('unidade', chave, `a unidade diz «${unidadeVista}» e a da linha é «${u.texto}»`);
        }
        if (!u.aceite) erro('unidade', chave, `imprime a unidade da linha «${u.linha}», que não está na lista das que um cartão imprime como estão, e o cartão não tem unidade declarada: um rótulo sem declaração`);
        if (u.portugues && unidadeEl.getAttribute('lang') !== 'pt-PT') erro('unidade', chave, `a unidade «${u.linha}» fica em português na edição inglesa e não diz a língua`);
        if (u.emDivida) contas.unidades.em_divida++;
        else contas.unidades.da_linha++;
      }
      /* O ESTADO */
      const veredicto = cartao.querySelector('[data-veredicto-referencia]');
      const formas = formasDoVeredicto(/** @type {string} */ (id), lang);
      if (veredicto) {
        const forma = semAlgarismos(visivel(veredicto));
        junta(familia, chave, 'estado', forma);
        if (!formas || !formas.has(forma)) erro('estado', chave, `o estado diz «${forma}», que não é uma forma declarada para o dono da referência da medida`);
        else contas.estados++;
      } else if (formas) {
        /* R2-b (04.10.2026, achado 5 da leitura a frio): a régua só conferia o estado que existia; um cartão cuja medida
           tem valor de referência declarado e que não diz o estado é um rótulo em falta. */
        erro('estado', chave, 'a medida tem valor de referência declarado e o cartão não diz o estado');
      }
      for (const item of cartao.querySelectorAll('[data-regua="ue"] .cartao-medida-regua-k [data-voz]')) {
        if (visivel(item) !== norm(s.cartao.uniaoEuropeia)) erro('estado', chave, `o rótulo da União na régua diz «${visivel(item)}»`);
      }
      for (const r of cartao.querySelectorAll('.cartao-medida-regua')) junta(familia, chave, 'regua', semAlgarismos(visivel(r)));
      for (const f of cartao.querySelectorAll('.faixa-ue-frase')) junta(familia, chave, 'faixa-ue', semAlgarismos(visivel(f)));
      /* A DOBRA */
      const def = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS)[/** @type {string} */ (id)];
      const perguntas = cartao.querySelectorAll('[data-cartao-definicao]');
      if (def) {
        const esperada = norm(textoDaDefinicao(def[lang] ?? def.pt));
        if (perguntas.length !== 1 || perguntas[0].getAttribute('data-cartao-definicao') !== id || visivel(perguntas[0]) !== esperada) {
          erro('dobra', chave, `a pergunta do cartão ${perguntas.length ? `diz «${visivel(perguntas[0]).slice(0, 70)}»` : 'falta'} e a declaração diz «${esperada.slice(0, 70)}»`);
        } else contas.dobras.perguntas++;
        junta(familia, chave, 'dobra', perguntas.length ? visivel(perguntas[0]) : '');
      } else if (perguntas.length) {
        erro('dobra', chave, 'o cartão tem uma pergunta e a linha não tem definição declarada');
      }
      for (const p of cartao.querySelectorAll('[data-referencia-na-dobra]')) {
        const dono = REFERENCIAS_DAS_MEDIDAS.get(/** @type {string} */ (id))?.limiarFixadoPor;
        const esperada = norm(dono ? s.estado[dono]?.frase : '');
        if (!esperada || visivel(p) !== esperada) erro('dobra', chave, `a frase da referência diz «${visivel(p).slice(0, 70)}» e a declaração do dono diz «${esperada.slice(0, 70)}»`);
        else contas.dobras.referencias++;
        junta(familia, chave, 'dobra-referencia', visivel(p));
      }
      /* O TERMO EXPLICADO (passagem R2-b, 04.10.2026): o primeiro cartão de cada termo declarado em `TERMOS_DOS_CARTOES`,
         pela ordem da página, explica-o na dobra, com o texto declarado; os outros cartões do termo não o repetem. */
      const termos = Object.entries(TERMOS_DOS_CARTOES).filter(([, x]) => x.cartoes.includes(/** @type {string} */ (id))).map(([k]) => k);
      const termo = termos.length === 1 ? termos[0] : null;
      if (termos.length > 1) erro('dobra', chave, `o cartão está em ${termos.length} termos declarados, e explica no máximo um`);
      const explicacoes = cartao.querySelectorAll('[data-termo-na-dobra]');
      const esperado = termo && !termosVistos.has(termo) ? termo : null;
      if (esperado) {
        termosVistos.add(esperado);
        const texto = norm(textoDosPedacos(/** @type {Record<string, any>} */ (TERMOS_DOS_CARTOES)[esperado][lang]));
        if (explicacoes.length !== 1 || explicacoes[0].getAttribute('data-termo-na-dobra') !== esperado || visivel(explicacoes[0]) !== texto) {
          erro('dobra', chave, `o primeiro cartão do termo «${esperado}» na página ${explicacoes.length ? `explica «${visivel(explicacoes[0]).slice(0, 70)}»` : 'não o explica'} e a declaração diz «${texto.slice(0, 70)}»`);
        } else contas.dobras.termos++;
      } else if (explicacoes.length) {
        erro('dobra', chave, `o cartão explica o termo «${explicacoes[0].getAttribute('data-termo-na-dobra')}» e não é o primeiro cartão desse termo na página, ou o termo não é dele`);
      }
      for (const p of explicacoes) junta(familia, chave, 'dobra-termo', visivel(p));
    } else if (familia === 'concelho') {
      const medida = MEDIDAS_DO_CONCELHO.find((m) => m.chave === chaveDoConcelho);
      if (!medida) {
        erro('chave', chave, 'a medida do cartão não está em MEDIDAS_DO_CONCELHO');
        continue;
      }
      if (nomeVisto !== norm(medida.nome[lang])) erro('nome', chave, `o nome diz «${nomeVisto}» e a medida declara «${norm(medida.nome[lang])}»`);
      const semValor = Boolean(cartao.querySelector('.cartao-medida-marca'));
      if (!semValor) {
        const daCasa = unidadeEl?.getAttribute('data-unidade-da-casa') ?? null;
        if (medida.unidadeDaCasa) {
          if (!unidadeEl || daCasa !== id || unidadeEl.getAttribute('data-unidade-da-medida') !== chaveDoConcelho || unidadeVista !== norm(medida.unidadeDaCasa[lang])) {
            erro('unidade', chave, `a unidade diz «${unidadeVista}» e a medida declara «${norm(medida.unidadeDaCasa[lang])}»`);
          } else contas.unidades.declaradas++;
        } else {
          const u = unidadeEsperada(/** @type {string} */ (id), lang);
          if (!unidadeEl || daCasa || unidadeVista !== u.texto) erro('unidade', chave, `a unidade diz «${unidadeVista}» e a da linha é «${u.texto}»`);
          if (!u.aceite) erro('unidade', chave, `imprime a unidade da linha «${u.linha}», que não está na lista das que um cartão imprime como estão`);
          contas.unidades.da_linha++;
        }
      }
      const linhasDoEstado = cartao.querySelectorAll('[data-regua="limite"] [data-voz]');
      for (const v of linhasDoEstado) {
        const forma = visivel(v);
        junta(familia, chave, 'estado', forma);
        if (forma !== norm(s.estado.lei.dentroQueE) && forma !== norm(s.estado.lei.foraQueE)) erro('estado', chave, `a linha do estado diz «${forma}», que não é uma forma declarada do limite legal`);
        else contas.estados++;
      }
      /* R2-b (04.10.2026, achado 5): uma medida com teto declarado diz o estado em cada cartão com valor, uma vez. */
      if (medida.tecto && !semValor && linhasDoEstado.length !== 1) erro('estado', chave, `a medida tem teto declarado e o cartão com valor tem ${linhasDoEstado.length} linha(s) do estado, e não uma`);
      const { lugar, comparacao } = formasDaFaixa(/** @type {string} */ (chaveDoConcelho), lang);
      /* R2-b (04.10.2026, achado 5): uma medida com faixa declarada tem, em cada cartão, uma frase do lugar e uma da
         comparação; uma medida sem faixa não tem nenhuma. A régua conferia só as frases que existiam. */
      const comFaixa = Boolean(FAIXA_DAS_MEDIDAS_DO_CONCELHO[/** @type {string} */ (chaveDoConcelho)]?.faixa);
      const nLugar = cartao.querySelectorAll('[data-faixa-concelho-frase]').length;
      const nComparacao = cartao.querySelectorAll('[data-faixa-comparacao]').length;
      if (comFaixa && (nLugar !== 1 || nComparacao !== 1)) erro('faixa', chave, `a medida tem faixa declarada e o cartão tem ${nLugar} frase(s) do lugar e ${nComparacao} da comparação, e não uma de cada`);
      if (!comFaixa && (nLugar || nComparacao)) erro('faixa', chave, `a medida não tem faixa declarada e o cartão tem ${nLugar + nComparacao} frase(s) da faixa`);
      else if (comFaixa) contas.faixas.presentes++;
      for (const f of cartao.querySelectorAll('[data-faixa-concelho-frase]')) {
        const copia = parse(f.outerHTML);
        for (const l of copia.querySelectorAll('[data-lugar]')) l.set_content('L');
        const forma = semAlgarismos(norm(copia.text));
        junta(familia, chave, 'faixa', forma);
        if (!lugar.has(forma)) erro('faixa', chave, `a frase do lugar diz «${forma}», que não é uma forma declarada para a medida`);
        else contas.faixas.lugar++;
      }
      for (const f of cartao.querySelectorAll('[data-faixa-comparacao]')) {
        const forma = semAlgarismos(visivel(f));
        junta(familia, chave, 'comparacao', forma);
        if (!comparacao.has(forma)) erro('faixa', chave, `a comparação diz «${forma}», que não é uma forma declarada para a medida`);
        else contas.faixas.comparacao++;
      }
      const frase = cartao.querySelector('.cartao-medida-dobra .cartao-medida-frase');
      const esperada = primeiraFrase(medida.nota?.[lang]);
      if (esperada && (!frase || visivel(frase) !== esperada)) erro('dobra', chave, `a dobra diz «${visivel(frase).slice(0, 70)}» e a nota da medida diz «${esperada.slice(0, 70)}»`);
      else if (frase) contas.dobras.notas++;
      junta(familia, chave, 'dobra', visivel(frase));
    } else {
      const C = s.camaras;
      if (nomeVisto !== norm(C.nome)) erro('nome', chave, `o nome diz «${nomeVisto}» e a cadeia da casa diz «${norm(C.nome)}»`);
      if (unidadeVista !== norm(C.unidade)) erro('unidade', chave, `a unidade diz «${unidadeVista}» e a cadeia da casa diz «${norm(C.unidade)}»`);
      const base = cartao.querySelector('[data-camaras-base]');
      const esperada = norm(textoDosPedacos(MEDIDAS_DO_CONCELHO.find((m) => m.chave === 'indice')?.nota?.[lang]));
      if (!base || visivel(base) !== esperada) erro('dobra', chave, 'a base do índice na dobra não é a nota declarada da medida');
      for (const r of cartao.querySelectorAll('.cartao-medida-regua')) junta(familia, chave, 'regua', semAlgarismos(visivel(r)));
      junta(familia, chave, 'dobra', visivel(base));
    }
  }

  /* A FAIXA DA PÁGINA DA UNIÃO: o cartão de cada medida e a sua dobra. */
  for (const li of root.querySelectorAll('li.cartao[data-cartao]')) {
    contas.cartoes++;
    contas.familias.uniao = (contas.familias.uniao ?? 0) + 1;
    const id = /** @type {string} */ (li.getAttribute('data-cartao'));
    const f = FIGURAS.find((x) => x.claim === id);
    const nome = visivel(li.querySelector('.cartao-nome'));
    const unidade = visivel(li.querySelector('.cartao-unidade'));
    junta('uniao', id, 'nome', nome);
    junta('uniao', id, 'unidade', semAlgarismos(unidade));
    if (!f) {
      erro('chave', id, 'um cartão da faixa da União sem figura declarada');
      continue;
    }
    const nomeDaFigura = norm(nomeDeNivel(id, lang) ?? f.nome[lang] ?? f.nome.pt);
    if (nome !== nomeDaFigura) erro('nome', id, `o nome do cartão da União diz «${nome}» e a declaração diz «${nomeDaFigura}»`);
    const medida = norm(textoDosPedacos(f.medida?.[lang]));
    if (unidade !== medida) erro('unidade', id, `a linha da unidade do cartão da União diz «${unidade}» e a figura declara «${medida}»`);
    const veredicto = li.querySelector('[data-veredicto-referencia]');
    if (veredicto) {
      const forma = semAlgarismos(visivel(veredicto));
      junta('uniao', id, 'estado', forma);
      const formas = formasDoVeredicto(id, lang);
      if (!formas || !formas.has(forma)) erro('estado', id, `o estado do cartão da União diz «${forma}», que não é uma forma declarada para o dono`);
      else contas.estados++;
    }
  }
  /* A FAIXA DOS 27 DA PÁGINA DA UNIÃO (passagem R2-b, 04.10.2026): a unidade diz-se pela declaração, como no cartão, e o
     nome segue-a (o de nível quando a unidade declarada diz a variação); o que a medida conta é a definição declarada. A
     chave é a linha portuguesa da série. */
  for (const a of root.querySelectorAll('article.paises-medida[data-faixa-paises]')) {
    const serie = /** @type {string} */ (a.getAttribute('data-faixa-paises'));
    const id = serie.replace(/-paises$/, '');
    contas.faixas_dos_paises = (contas.faixas_dos_paises ?? 0) + 1;
    const nomeEl = a.querySelector('.paises-nome-texto');
    const nome = visivel(nomeEl);
    const unidadeEl = a.querySelector('.paises-unidade [data-unidade-da-casa], .paises-unidade [data-serie-campo="unit"]');
    const unidade = visivel(unidadeEl);
    const oQueConta = visivel(a.querySelector('.paises-o-que-conta'));
    junta('paises', id, 'nome', nome);
    junta('paises', id, 'unidade', unidade);
    junta('paises', id, 'dobra', oQueConta);
    const casa = /** @type {Record<string, any>} */ (UNIDADES_DOS_CARTOES)[id];
    if (casa) {
      const esperada = norm(textoDosPedacos(casa[lang]));
      if (!unidadeEl || unidadeEl.getAttribute('data-unidade-da-casa') !== id || unidadeEl.getAttribute('data-unidade-na-faixa') !== serie || unidade !== esperada) {
        erro('unidade', `paises:${id}`, `a unidade da faixa dos 27 diz «${unidade}» e a declaração do cartão diz «${esperada}»`);
      } else contas.unidades.na_faixa_dos_paises = (contas.unidades.na_faixa_dos_paises ?? 0) + 1;
    } else {
      const u = String(getSerie(serie)?.unit ?? '');
      const esperada = norm(comAPalavra(lang === 'en' && Object.prototype.hasOwnProperty.call(UNIDADES, u) ? /** @type {Record<string, string>} */ (UNIDADES)[u] : u));
      if (!unidadeEl || unidadeEl.getAttribute('data-serie-campo') !== 'unit' || unidade !== esperada) {
        erro('unidade', `paises:${id}`, `a unidade da faixa dos 27 diz «${unidade}» e a da série é «${esperada}»`);
      }
    }
    const nomeEsperado = norm((casa ? nomeDeNivel(id, lang) : null) ?? nomeDeclarado(id, lang)?.texto ?? '');
    if (!nomeEsperado || nome !== nomeEsperado) erro('nome', `paises:${id}`, `o nome da faixa dos 27 diz «${nome}» e a declaração diz «${nomeEsperado}»`);
    const declarada = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS)[id];
    const definicao = declarada ? norm(textoDaDefinicao((declarada.serie ?? declarada)[lang] ?? [])) : '';
    if (!definicao || oQueConta !== definicao) erro('dobra', `paises:${id}`, `o que a faixa dos 27 diz que a medida conta («${oQueConta.slice(0, 70)}») não é a definição declarada`);
    else contas.dobras.paises++;
  }
  for (const d of root.querySelectorAll('details.dobra[data-leitura]')) {
    const id = /** @type {string} */ (d.getAttribute('data-leitura'));
    const f = FIGURAS.find((x) => x.claim === id);
    const nome = visivel(d.querySelector('.dobra-nome'));
    const def = visivel(d.querySelector('.dobra-definicao'));
    junta('dobra', id, 'nome', nome);
    junta('dobra', id, 'dobra', def);
    if (f && nome !== norm(f.nome[lang] ?? f.nome.pt)) erro('nome', id, `o nome da dobra da União diz «${nome}» e a figura declara «${norm(f.nome[lang] ?? f.nome.pt)}»`);
    const declarada = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS)[id];
    const esperada = declarada ? norm(textoDaDefinicao(declarada[lang] ?? declarada.pt)) : '';
    if (def !== esperada) erro('dobra', id, `a definição da dobra da União diz «${def.slice(0, 70)}» e a declaração diz «${esperada.slice(0, 70)}»`);
    else contas.dobras.uniao++;
  }
  /* A RESSALVA DE ALCANCE DO RECIBO DO SALÁRIO MÍNIMO (passagem R2-b, 04.10.2026): o que ela diz dos diplomas regionais
     é a composição da lista declarada, e não um texto escrito à mão. */
  const L = DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO.linha;
  if (rota === `/livro-razao/${L}` || rota === `/en/ledger/${L}`) {
    const alcance = root.querySelector('p.linha-alcance');
    const esperada = norm((ressalvaDosDiplomasRegionais()[lang] ?? []).map((p) => (typeof p === 'string' ? p : `[${p.marcador}]`)).join(''));
    const vista = visivel(alcance);
    junta('recibo', L, 'ressalva', vista);
    if (!alcance || vista !== esperada) erro('ressalva', L, `a ressalva do recibo diz «${vista.slice(0, 90)}» e a lista dos diplomas regionais compõe «${esperada.slice(0, 90)}»`);
    else contas.ressalvas = (contas.ressalvas ?? 0) + 1;
  }
  return erros;
}

/**
 * A LISTA DOS DIPLOMAS REGIONAIS CONTRA AS ORIGENS DA PERGUNTA (passagem R2-b, 04.10.2026). Uma região que a lista dá
 * como lida tem uma origem que existe, que é origem da pergunta da linha e que nomeia a região como o diploma a escreve;
 * uma região que a lista dá como por ler não pode ter, entre as origens da pergunta, um diploma que a nomeie. É a
 * contradição de antes (a ressalva a dizer «não foi lido» por cima do diploma dos Açores, lido a 24.09.2026), dita onde
 * se apanha.
 *
 * @param {typeof DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO} [lista]
 * @returns {string[]}
 */
export function conferirDiplomasRegionais(lista = DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO) {
  /** @type {string[]} */
  const erros = [];
  const origens = /** @type {Record<string, any>} */ (DEFINICOES_DAS_MEDIDAS)[lista.linha]?.origens ?? [];
  const O = /** @type {Record<string, any>} */ (ORIGENS_DAS_DEFINICOES);
  const nomeia = (/** @type {string} */ o, /** @type {string} */ regiao) => String(O[o]?.excerto ?? '').includes(regiao) || String(O[o]?.documento ?? '').includes(regiao);
  for (const r of lista.regioes) {
    if (r.origem) {
      if (!O[r.origem] || !origens.includes(r.origem)) erros.push(`R2-ressalva · ${lista.linha}: a lista dá a «${r.chave}» a origem «${r.origem}», que não é uma origem declarada da pergunta da linha`);
      else if (!nomeia(r.origem, r.nomeNaFonte)) erros.push(`R2-ressalva · ${lista.linha}: a origem «${r.origem}» de «${r.chave}» não nomeia «${r.nomeNaFonte}»`);
    } else {
      const achada = origens.find((o) => nomeia(o, r.nomeNaFonte));
      if (achada) erros.push(`R2-ressalva · ${lista.linha}: a lista diz que o diploma de «${r.chave}» não é fonte de nenhuma linha, e a origem «${achada}» da pergunta nomeia «${r.nomeNaFonte}»`);
    }
  }
  return erros;
}

/* --------------------------------------------------------------------------- a construção inteira */

function paginas(dist) {
  /** @type {string[]} */
  const out = [];
  (function anda(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name === 'index.html') out.push(p);
    }
  })(dist);
  return out.sort();
}
const rotaDe = (dist, p) => '/' + path.relative(dist, path.dirname(p)).split(path.sep).join('/');
const linguaDe = (rota) => (rota === '/en' || rota.startsWith('/en/') ? 'en' : 'pt');
const contasNovas = () => ({
  paginas: 0, paginas_com_cartoes: 0, cartoes: 0, familias: {}, nomes: {}, estados: 0,
  unidades: { declaradas: 0, da_linha: 0, em_divida: 0 }, faixas: { lugar: 0, comparacao: 0, presentes: 0 },
  dobras: { perguntas: 0, notas: 0, referencias: 0, termos: 0, uniao: 0, paises: 0 },
});

/** @param {string} dist */
export function conferirConstrucao(dist) {
  if (!fs.existsSync(dist)) return { erros: [`não existe ${dist}: corra a construção primeiro`], contas: contasNovas(), inventario: new Map() };
  const inventario = new Map();
  const contas = contasNovas();
  /** @type {string[]} */
  const erros = [];
  for (const p of paginas(dist)) {
    contas.paginas++;
    const html = fs.readFileSync(p, 'utf8');
    const comCartoes = html.includes('cartao-medida') || html.includes('class="cartao"') || html.includes('data-leitura=');
    if (!comCartoes && !html.includes('linha-alcance')) continue;
    if (comCartoes) contas.paginas_com_cartoes++;
    const rota = rotaDe(dist, p);
    erros.push(...conferirPagina(parse(html), { rota, lang: linguaDe(rota), inventario, contas }));
  }
  if (contas.cartoes === 0) erros.push('R2 · a régua não viu cartão nenhum: o leitor está cego');
  /* R2-b: a lista dos diplomas regionais contra as origens da pergunta, e a ressalva vista nas duas edições do recibo. */
  erros.push(...conferirDiplomasRegionais());
  if ((contas.ressalvas ?? 0) !== 2) erros.push(`R2-ressalva · a ressalva do recibo do salário mínimo foi conferida em ${contas.ressalvas ?? 0} página(s), e o recibo tem duas edições`);
  return { erros, contas, inventario };
}

/** O inventário como objeto ordenado, para escrever e comparar. @param {Map<string, any>} inventario */
export function inventarioOrdenado(inventario) {
  const chaves = [...inventario.keys()].sort();
  /** @type {Record<string, any>} */
  const out = {};
  for (const k of chaves) {
    const e = inventario.get(k);
    out[k] = Object.fromEntries(Object.keys(e.campos).sort().map((c) => [c, Object.fromEntries(Object.entries(e.campos[c]).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))]));
  }
  return out;
}

/**
 * A CONSTRUÇÃO CONTRA O INVENTÁRIO DECLARADO, COM AS CONTAGENS (passagem R2-b, 04.10.2026, achados 4 e 5 da leitura a
 * frio do Sol). Até aqui só o nome, a unidade e a dobra se comparavam, e só pela presença da forma: um concelho a menos
 * não aparecia (os cartões dos 308 partilham a chave da medida, e cada forma conta 308 vezes), uma linha do estado ou
 * uma frase da faixa em falta não aparecia, e uma chave declarada que deixava de se render era um aviso. Agora cada
 * campo de cada chave conta: a forma tem de se render exatamente as vezes que o inventário declarado diz, em cada
 * edição, e uma chave ou uma forma a mais ou a menos fecha a construção. Um rótulo que mude por uma razão boa (um
 * concelho novo com valor, um empate novo numa faixa) entra pela declaração: corre-se `--escrever` e o diff mostra a
 * contagem que mudou a quem lê.
 *
 * @param {Record<string, any>} construido @param {Record<string, any>} declarado
 */
export function diferencasDoDeclarado(construido, declarado) {
  /** @type {string[]} */
  const diferencas = [];
  const comparadas = { chaves: 0, campos: 0, formas: 0, ocorrencias: 0 };
  const chaves = [...new Set([...Object.keys(construido), ...Object.keys(declarado)])].sort();
  for (const k of chaves) {
    const c = construido[k];
    const d = declarado[k];
    if (!d) {
      diferencas.push(`a chave «${k}» rende-se e não está no inventário declarado`);
      continue;
    }
    if (!c) {
      diferencas.push(`a chave «${k}» do inventário declarado não se rende nesta construção`);
      continue;
    }
    comparadas.chaves++;
    for (const campo of [...new Set([...Object.keys(c), ...Object.keys(d)])].sort()) {
      comparadas.campos++;
      const fc = c[campo] ?? {};
      const fd = d[campo] ?? {};
      for (const forma of [...new Set([...Object.keys(fc), ...Object.keys(fd)])].sort()) {
        comparadas.formas++;
        const n = fc[forma] ?? 0;
        const m = fd[forma] ?? 0;
        comparadas.ocorrencias += n;
        if (n !== m) diferencas.push(`«${k}» · ${campo}: «${forma}» rende-se ${n} vez(es) e o inventário declarado diz ${m}`);
      }
    }
  }
  return { diferencas, comparadas };
}

/**
 * O inventário de uma construção com uma página trocada por outra, sem reler as outras páginas: o que a página intacta
 * juntava sai, o que a página estragada junta entra. É como as plantas da construção inteira simulam um concelho a menos
 * ou uma chave que deixa de se render (passagem R2-b).
 *
 * @param {Record<string, any>} construido @param {Map<string, any>} intacta @param {Map<string, any>} estragada
 */
export function inventarioComAPaginaTrocada(construido, intacta, estragada) {
  /** @type {Record<string, any>} */
  const out = JSON.parse(JSON.stringify(construido));
  for (const [inv, sinal] of [[intacta, -1], [estragada, 1]]) {
    for (const [k, e] of /** @type {Map<string, any>} */ (inv)) {
      out[k] ??= {};
      for (const [campo, formas] of Object.entries(e.campos)) {
        out[k][campo] ??= {};
        for (const [forma, n] of Object.entries(/** @type {Record<string, number>} */ (formas))) {
          const v = (out[k][campo][forma] ?? 0) + sinal * n;
          if (v === 0) delete out[k][campo][forma];
          else out[k][campo][forma] = v;
        }
        if (Object.keys(out[k][campo]).length === 0) delete out[k][campo];
      }
      if (Object.keys(out[k]).length === 0) delete out[k];
    }
  }
  return out;
}

/* --------------------------------------------------------------------------- as plantas */

/**
 * Cada planta estraga uma cópia em memória de uma página construída e tem de morder com a queixa esperada.
 *
 * @param {string} dist
 */
export function plantas(dist) {
  const ler = (rel) => {
    const p = path.join(dist, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  };
  /** @type {{ nome: string, campo: string, mordeu: boolean, queixa?: string }[]} */
  const resultados = [];
  /** @type {string[]} */
  const controlo = [];
  const corre = (rel, root) => {
    const rota = '/' + path.dirname(rel).split(path.sep).join('/').replace(/^\.$/, '');
    return conferirPagina(root, { rota, lang: linguaDe(rota), inventario: new Map(), contas: contasNovas() });
  };
  const planta = (nome, campo, rel, trocar, mordida) => {
    const html = ler(rel);
    if (html === null) {
      resultados.push({ nome, campo, mordeu: false, queixa: `não existe ${rel}` });
      return;
    }
    const intacta = corre(rel, parse(html));
    if (intacta.length) controlo.push(...intacta.map((e) => `${nome}: a página intacta não passa (${e})`));
    const root = parse(html);
    const mudou = trocar(root);
    if (!mudou) {
      resultados.push({ nome, campo, mordeu: false, queixa: 'a planta não encontrou o que estragar' });
      return;
    }
    const erros = corre(rel, root);
    const mordeu = erros.some((e) => mordida.test(e));
    resultados.push({ nome, campo, mordeu, ...(mordeu ? {} : { queixa: erros.slice(0, 3).join(' | ') || 'nenhuma queixa' }) });
  };

  planta('r2-nome-trocado-num-cartao-nacional', 'nome', 'emprego/index.html', (r) => {
    const n = r.querySelector('[data-cartao-medida="jovens-nem-2025"] .cartao-medida-nome');
    if (!n) return false;
    n.set_content('Jovens');
    return true;
  }, /^R2-nome · \/emprego · jovens-nem-2025: o nome diz «Jovens»/);
  planta('r2-nome-pelo-titulo-da-fonte', 'nome', 'areas/trabalho-solidariedade-e-seguranca-social/index.html', (r) => {
    const c = r.querySelector('[data-cartao-medida="ganho-medio-mensal-2024"]');
    if (!c) return false;
    c.setAttribute('data-cartao-medida', 'retribuicao-minima-mensal-doze-meses-2027-planta');
    return true;
  }, /^R2-nome · .*retribuicao-minima-mensal-doze-meses-2027-planta: o cartão nomeia-se/);
  planta('r2-unidade-da-casa-trocada', 'unidade', 'emprego/index.html', (r) => {
    const u = r.querySelector('[data-cartao-medida="jovens-nem-2025"] [data-unidade-da-casa]');
    if (!u) return false;
    u.set_content('% da população');
    return true;
  }, /^R2-unidade · \/emprego · jovens-nem-2025: a unidade diz «% da população» e a declaração diz «% das pessoas dos 15 aos 29 anos»/);
  planta('r2-unidade-da-linha-em-vez-da-declarada', 'unidade', 'en/employment/index.html', (r) => {
    const u = r.querySelector('[data-cartao-medida="taxa-de-emprego-2025"] [data-unidade-da-casa]');
    if (!u) return false;
    u.removeAttribute('data-unidade-da-casa');
    u.setAttribute('data-linha-campo', 'unit');
    u.setAttribute('data-linha-claim', 'taxa-de-emprego-2025');
    u.set_content('% of the population');
    return true;
  }, /^R2-unidade · \/en\/employment · taxa-de-emprego-2025: a unidade diz «% of the population» \(sem a marca da unidade da casa\)/);
  planta('r2-unidade-da-linha-nao-aceite', 'unidade', 'areas/ambiente-e-energia/index.html', (r) => {
    const c = r.querySelector('[data-cartao-medida="agua-nao-faturada-portugal-2024"]');
    if (!c) return false;
    c.setAttribute('data-cartao-medida', 'criancas-em-creche-2024');
    c.querySelector('[data-linha-campo="unit"]')?.setAttribute('data-linha-claim', 'criancas-em-creche-2024');
    return true;
  }, /^R2-unidade · .*criancas-em-creche-2024: imprime a unidade da linha «%», que não está na lista/);
  planta('r2-estado-sem-o-dono', 'estado', 'estado-e-economia/index.html', (r) => {
    const v = r.querySelector('[data-cartao-medida="divida-publica-2025"] [data-veredicto-referencia] [data-voz]');
    if (!v) return false;
    v.set_content('fora do valor de referência');
    return true;
  }, /^R2-estado · \/estado-e-economia · divida-publica-2025: o estado diz «fora do valor de referência \(acima de # %\)»/);
  planta('r2-estado-do-dono-errado', 'estado', 'en/state-and-economy/index.html', (r) => {
    const v = r.querySelector('[data-cartao-medida="saldo-das-administracoes-publicas-2025"] [data-veredicto-referencia] [data-voz]');
    if (!v) return false;
    v.set_content('within the Commission’s reference value');
    return true;
  }, /^R2-estado · \/en\/state-and-economy · saldo-das-administracoes-publicas-2025: o estado diz «within the Commission’s reference value/);
  planta('r2-faixa-sem-a-medida', 'faixa', 'municipios/evora/index.html', (r) => {
    const f = r.querySelector('[data-faixa-concelho="indice"] [data-faixa-concelho-frase]');
    if (!f || !f.innerHTML.includes(' no índice de dívida')) return false;
    f.set_content(f.innerHTML.replace(' no índice de dívida', ''));
    return true;
  }, /^R2-faixa · \/municipios\/evora · concelho:indice: a frase do lugar diz «L \(#\) está em #\.º lugar entre os # concelhos com valor, do mais baixo/);
  planta('r2-comparacao-de-antes', 'faixa', 'en/municipalities/evora/index.html', (r) => {
    const f = r.querySelector('[data-faixa-concelho="poderDeCompra"] [data-faixa-comparacao]');
    if (!f) return false;
    f.set_content('It is above Portugal, which is the base of the index.');
    return true;
  }, /^R2-faixa · \/en\/municipalities\/evora · concelho:poderDeCompra: a comparação diz «It is above Portugal, which is the base of the index\.»/);
  planta('r2-pergunta-trocada', 'dobra', 'areas/trabalho-solidariedade-e-seguranca-social/index.html', (r) => {
    const p = r.querySelector('[data-cartao-medida="criancas-em-creche-2025"] [data-cartao-definicao]');
    if (!p) return false;
    p.set_content('Que parte das crianças está em creche?');
    return true;
  }, /^R2-dobra · .*criancas-em-creche-2025: a pergunta do cartão diz «Que parte das crianças está em creche\?»/);
  planta('r2-pergunta-tirada', 'dobra', 'areas/saude/index.html', (r) => {
    const p = r.querySelector('[data-cartao-medida="necessidades-medicas-nao-satisfeitas-2025"] [data-cartao-definicao]');
    if (!p) return false;
    p.remove();
    return true;
  }, /^R2-dobra · \/areas\/saude · necessidades-medicas-nao-satisfeitas-2025: a pergunta do cartão falta/);
  planta('r2-nota-do-concelho-de-antes', 'dobra', 'municipios/evora/index.html', (r) => {
    const p = r.querySelector('[data-medida-chave="populacao"] .cartao-medida-dobra .cartao-medida-frase');
    if (!p) return false;
    p.set_content('Estimativa anual do INE para o concelho.');
    return true;
  }, /^R2-dobra · \/municipios\/evora · concelho:populacao: a dobra diz «Estimativa anual do INE para o concelho\.»/);
  planta('r2-referencia-na-dobra-de-outro-dono', 'dobra', 'areas/financas/index.html', (r) => {
    const p = r.querySelector('[data-referencia-na-dobra="saldo-das-administracoes-publicas-2025"]');
    if (!p) return false;
    p.set_content(t('pt').estado.comissao.frase);
    return true;
  }, /^R2-dobra · \/areas\/financas · saldo-das-administracoes-publicas-2025: a frase da referência diz/);
  planta('r2-unidade-do-cartao-da-uniao-de-antes', 'unidade', 'uniao-europeia/index.html', (r) => {
    const u = r.querySelector('[data-cartao="jovens-nem-2025"] .cartao-unidade');
    if (!u) return false;
    u.set_content('Percentagem da população · 2025');
    return true;
  }, /^R2-unidade · \/uniao-europeia · jovens-nem-2025: a linha da unidade do cartão da União diz «Percentagem da população · 2025»/);
  planta('r2-cartao-sem-chave', 'chave', 'precos/index.html', (r) => {
    const c = r.querySelector('[data-cartao-medida="ipc-variacao-homologa"]');
    if (!c) return false;
    c.removeAttribute('data-cartao-medida');
    return true;
  }, /^R2-chave · \/precos · \?: um cartão de medida sem a marca da sua linha/);
  /* R2-b (04.10.2026, achado 5 da leitura a frio): o que falta também morde, e não só o que está errado. */
  planta('r2b-estado-que-falta-num-cartao-nacional', 'estado', 'estado-e-economia/index.html', (r) => {
    const v = r.querySelector('[data-cartao-medida="divida-publica-2025"] [data-veredicto-referencia]');
    if (!v) return false;
    v.remove();
    return true;
  }, /^R2-estado · \/estado-e-economia · divida-publica-2025: a medida tem valor de referência declarado e o cartão não diz o estado/);
  planta('r2b-estado-do-limite-que-falta', 'estado', 'municipios/evora/index.html', (r) => {
    const v = r.querySelector('article.cartao-medida[data-medida-chave="indice"] [data-regua="limite"]');
    if (!v) return false;
    v.remove();
    return true;
  }, /^R2-estado · \/municipios\/evora · concelho:indice: a medida tem teto declarado e o cartão com valor tem 0 linha\(s\) do estado/);
  planta('r2b-frase-do-lugar-que-falta', 'faixa', 'en/municipalities/evora/index.html', (r) => {
    const f = r.querySelector('article.cartao-medida[data-medida-chave="ganho"] [data-faixa-concelho-frase]');
    if (!f) return false;
    f.remove();
    return true;
  }, /^R2-faixa · \/en\/municipalities\/evora · concelho:ganho: a medida tem faixa declarada e o cartão tem 0 frase\(s\) do lugar e 1 da comparação/);
  /* R2-b (04.10.2026): a unidade da faixa dos 27 pela declaração, o termo explicado na primeira vez e o nome de nível. */
  planta('r2b-unidade-da-faixa-dos-paises-pela-serie', 'unidade', 'uniao-europeia/index.html', (r) => {
    const u = r.querySelector('article.paises-medida[data-faixa-paises="taxa-de-emprego-2025-paises"] [data-unidade-da-casa]');
    if (!u) return false;
    u.replaceWith('<span data-serie="taxa-de-emprego-2025-paises" data-serie-campo="unit" class="campo-da-serie">% da população</span>');
    return true;
  }, /^R2-unidade · \/uniao-europeia · paises:taxa-de-emprego-2025: a unidade da faixa dos 27 diz «% da população» e a declaração do cartão diz «% das pessoas dos 20 aos 64 anos»/);
  planta('r2b-termo-trocado', 'dobra', 'areas/economia-e-coesao-territorial/index.html', (r) => {
    const p = r.querySelector('[data-termo-na-dobra="vab"]');
    if (!p) return false;
    p.set_content('O VAB é a riqueza das empresas.');
    return true;
  }, /^R2-dobra · .*: o primeiro cartão do termo «vab» na página explica «O VAB é a riqueza das empresas\.»/);
  planta('r2b-termo-repetido', 'dobra', 'en/areas/economia-e-coesao-territorial/index.html', (r) => {
    const p = r.querySelector('[data-termo-na-dobra="vab"]');
    const cartoes = r.querySelectorAll('article.cartao-medida').filter((c) => ['evora-vab-empresarial-2024', 'evora-concentracao-vab4-2024', 'portugal-concentracao-vab4-2024'].includes(c.getAttribute('data-cartao-medida') ?? ''));
    const segundo = cartoes.find((c) => !c.querySelector('[data-termo-na-dobra]'));
    if (!p || !segundo) return false;
    segundo.insertAdjacentHTML('beforeend', p.outerHTML);
    return true;
  }, /^R2-dobra · \/en\/areas\/economia-e-coesao-territorial · .*: o cartão explica o termo «vab» e não é o primeiro cartão desse termo na página/);
  planta('r2b-ressalva-escrita-a-mao', 'ressalva', 'livro-razao/retribuicao-minima-mensal-garantida-continente-2026/index.html', (r) => {
    const p = r.querySelector('p.linha-alcance');
    if (!p) return false;
    p.set_content('Este valor é o do território continental. Os Açores e a Madeira fixam o seu por diploma regional próprio, que não foi lido: [a verificar].');
    return true;
  }, /^R2-ressalva · \/livro-razao\/retribuicao-minima-mensal-garantida-continente-2026 · retribuicao-minima-mensal-garantida-continente-2026: a ressalva do recibo diz «Este valor é o do território continental\. Os Açores e a Madeira fixam/);
  {
    /* A lista a dar o diploma dos Açores por ler, com ele entre as origens da pergunta: a contradição de antes. */
    const lista = { ...DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO, regioes: DIPLOMAS_REGIONAIS_DO_SALARIO_MINIMO.regioes.map((r) => (r.chave === 'acores' ? { ...r, origem: null } : r)) };
    const erros = conferirDiplomasRegionais(lista);
    const mordeu = erros.some((e) => /a lista diz que o diploma de «acores» não é fonte de nenhuma linha, e a origem «dre-dlr-37-2023-a» da pergunta nomeia «Região Autónoma dos Açores»/.test(e));
    resultados.push({ nome: 'r2b-diploma-dos-acores-dado-como-por-ler', campo: 'ressalva', mordeu, ...(mordeu ? {} : { queixa: erros.join(' | ') || 'nenhuma queixa' }) });
    if (conferirDiplomasRegionais().length) controlo.push('r2b-diploma-dos-acores-dado-como-por-ler: a lista intacta não passa');
  }
  planta('r2b-nome-de-nivel-trocado', 'nome', 'precos/index.html', (r) => {
    const n = r.querySelector('[data-cartao-medida="ipc-combustiveis-variacao-homologa"] .cartao-medida-nome');
    if (!n) return false;
    n.set_content('Preços dos combustíveis, variação num ano');
    return true;
  }, /^R2-nome · \/precos · ipc-combustiveis-variacao-homologa: o nome diz «Preços dos combustíveis, variação num ano» \(cartao\) e a declaração \(cartao\) diz «Preços dos combustíveis»/);
  return { resultados, controlo };
}

/**
 * AS PLANTAS DA CONSTRUÇÃO INTEIRA (passagem R2-b, 04.10.2026, achados 4 e 5 da leitura a frio). Cada uma troca uma
 * página no inventário da construção (`inventarioComAPaginaTrocada`) e compara o resultado com o inventário declarado:
 * a diferença esperada tem de aparecer. É a prova de que a contagem morde onde a conferência de uma página sozinha não
 * vê nada: um concelho sem o cartão, uma linha do estado e uma frase da faixa a menos, e uma chave declarada que deixa
 * de se render.
 *
 * @param {string} dist @param {Record<string, any>} construido @param {Record<string, any>} declarado
 */
export function plantasDaConstrucao(dist, construido, declarado) {
  /** @type {{ nome: string, campo: string, mordeu: boolean, queixa?: string }[]} */
  const resultados = [];
  const inventarioDaPagina = (rel, root) => {
    const rota = '/' + path.dirname(rel).split(path.sep).join('/').replace(/^\.$/, '');
    const inventario = new Map();
    conferirPagina(root, { rota, lang: linguaDe(rota), inventario, contas: contasNovas() });
    return inventario;
  };
  const planta = (nome, campo, rel, trocar, mordida) => {
    const p = path.join(dist, rel);
    if (!fs.existsSync(p)) {
      resultados.push({ nome, campo, mordeu: false, queixa: `não existe ${rel}` });
      return;
    }
    const html = fs.readFileSync(p, 'utf8');
    const root = parse(html);
    if (!trocar(root)) {
      resultados.push({ nome, campo, mordeu: false, queixa: 'a planta não encontrou o que estragar' });
      return;
    }
    const trocado = inventarioOrdenado(new Map(Object.entries(inventarioComAPaginaTrocada(construido, inventarioDaPagina(rel, parse(html)), inventarioDaPagina(rel, root))).map(([k, campos]) => [k, { campos }])));
    const { diferencas } = diferencasDoDeclarado(trocado, declarado);
    const mordeu = diferencas.some((e) => mordida.test(e));
    resultados.push({ nome, campo, mordeu, ...(mordeu ? {} : { queixa: diferencas.slice(0, 3).join(' | ') || 'nenhuma diferença' }) });
  };
  planta('r2b-concelho-sem-o-cartao', 'contagem', 'municipios/evora/index.html', (r) => {
    const c = r.querySelector('article.cartao-medida[data-medida-chave="indice"]');
    if (!c) return false;
    c.remove();
    return true;
  }, /^«concelho\|pt\|concelho:indice» · nome: «Índice de dívida» rende-se 307 vez\(es\) e o inventário declarado diz 308$/);
  planta('r2b-estado-a-menos-na-contagem', 'estado', 'en/state-and-economy/index.html', (r) => {
    const v = r.querySelector('[data-cartao-medida="divida-publica-2025"] [data-veredicto-referencia]');
    if (!v) return false;
    v.remove();
    return true;
  }, /^«nacional\|en\|divida-publica-2025» · estado: «outside the Commission’s reference value \(above # %\)» rende-se 1 vez\(es\) e o inventário declarado diz 2$/);
  planta('r2b-frase-do-lugar-a-menos-na-contagem', 'faixa', 'municipios/evora/index.html', (r) => {
    const f = r.querySelector('article.cartao-medida[data-medida-chave="indice"] [data-faixa-concelho-frase]');
    if (!f) return false;
    f.remove();
    return true;
  }, /^«concelho\|pt\|concelho:indice» · faixa: «L \(#\) está em #\.º lugar entre os # concelhos com valor no índice de dívida, do mais baixo para o mais alto\.» rende-se \d+ vez\(es\) e o inventário declarado diz \d+$/);
  planta('r2b-chave-declarada-que-nao-se-rende', 'chave', 'areas/administracao-interna/index.html', (r) => {
    const c = r.querySelector('article.cartao-medida[data-cartao-medida="evora-camara-lugares"]');
    if (!c) return false;
    c.remove();
    return true;
  }, /^a chave «nacional\|pt\|evora-camara-lugares» do inventário declarado não se rende nesta construção$/);
  return resultados;
}

/* --------------------------------------------------------------------------- a corrida */

const eDireto = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (eDireto) {
  const dist = path.resolve(process.env.OEDP_DIST ?? path.join(RAIZ, 'dist'));
  const escrever = process.argv.includes('--escrever');
  const prova = process.argv.includes('--prova');
  const { erros, contas, inventario } = conferirConstrucao(dist);
  const construido = inventarioOrdenado(inventario);
  /* --inventario <ficheiro>: escreve só o inventário de uma construção (OEDP_DIST pode ser outra, por exemplo a de uma
     cabeça antiga), sem o comparar com a declaração de hoje nem falhar por isso; é como um bloco mede a forma de antes. */
  const iInventario = process.argv.indexOf('--inventario');
  if (iInventario >= 0) {
    const destino = process.argv[iInventario + 1];
    fs.writeFileSync(destino, JSON.stringify({ o_que: 'O inventário dos rótulos de uma construção, escrito por --inventario, sem comparação com a declaração em vigor.', construcao: (() => { try { return JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).commit ?? null; } catch { return null; } })(), contas, rotulos_fora_da_declaracao_de_hoje: erros.length, inventario: construido }, null, 1) + '\n');
    console.log(`R2 · o inventário da construção escrito em ${path.relative(process.cwd(), destino)}: ${Object.keys(construido).length} chaves, ${contas.cartoes} cartões; ${erros.length} rótulo(s) diferentes da declaração de hoje.`);
    process.exit(0);
  }
  let comparacaoComODeclarado = null;
  if (escrever) {
    if (erros.length) {
      for (const e of erros) console.error(e);
      console.error(`R2 · ${erros.length} rótulo(s) fora da declaração: o inventário não se escreve com rótulos por declarar.`);
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(INVENTARIO_DECLARADO), { recursive: true });
    const escrito = {
      o_que: 'O inventário declarado dos rótulos dos cartões de medida (bloco R2, 03.10.2026): por família, edição e chave, as formas distintas de cada campo e quantas vezes cada uma se rende, com os algarismos do período, do estado e da faixa apagados. Escrito por `node scripts/inventario-rotulos.mjs --escrever` sobre uma construção; a régua do `verify` compara o nome, a unidade e a dobra de cada construção com estas formas.',
      cabeca: (() => {
        try {
          return JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).commit ?? null;
        } catch {
          return null;
        }
      })(),
      contas,
      inventario: construido,
    };
    fs.writeFileSync(INVENTARIO_DECLARADO, JSON.stringify(escrito, null, 1) + '\n');
    console.log(`R2 · o inventário declarado escrito: ${Object.keys(construido).length} chaves, ${contas.cartoes} cartões, ${contas.paginas} páginas.`);
    process.exit(0);
  }
  /** @type {Record<string, any>} */
  let declarado = {};
  if (!fs.existsSync(INVENTARIO_DECLARADO)) {
    erros.push(`R2 · não existe o inventário declarado (${path.relative(RAIZ, INVENTARIO_DECLARADO)}): escreve-se com --escrever`);
  } else {
    declarado = JSON.parse(fs.readFileSync(INVENTARIO_DECLARADO, 'utf8')).inventario ?? {};
    comparacaoComODeclarado = diferencasDoDeclarado(construido, declarado);
    for (const n of comparacaoComODeclarado.diferencas) erros.push(`R2-declarado · ${n}: um rótulo ou uma contagem que muda entra pela declaração (corre-se --escrever depois de o ler)`);
  }
  const prov = prova ? plantas(dist) : { resultados: [], controlo: [] };
  /* R2-b: as plantas da construção inteira, sobre o inventário desta construção e o declarado. */
  if (prova) prov.resultados.push(...plantasDaConstrucao(dist, construido, declarado));
  for (const c of prov.controlo) erros.push(`R2 · o controlo das plantas não passou: ${c}`);
  for (const p of prov.resultados) if (!p.mordeu) erros.push(`R2 · a planta não mordeu: ${p.nome} (${p.queixa})`);
  const formas = {};
  for (const e of Object.values(construido)) {
    for (const [c, f] of Object.entries(e)) formas[c] = (formas[c] ?? 0) + Object.keys(f).length;
  }
  const relatorio = {
    erros,
    contas,
    chaves: Object.keys(construido).length,
    formas_por_campo: formas,
    em_dia_com_o_declarado: comparacaoComODeclarado ? comparacaoComODeclarado.diferencas.length === 0 : null,
    diferencas_do_declarado: comparacaoComODeclarado ? comparacaoComODeclarado.diferencas.length : null,
    comparado_com_o_declarado: comparacaoComODeclarado ? comparacaoComODeclarado.comparadas : null,
    plantas: prov.resultados,
  };
  const j = process.argv.indexOf('--json');
  if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(relatorio, null, 2) + '\n');
  for (const e of erros.slice(0, 60)) console.error(e);
  if (erros.length > 60) console.error(`… e mais ${erros.length - 60}`);
  console.log(
    `R2 · rótulos: ${contas.paginas} página(s) lidas, ${contas.paginas_com_cartoes} com cartões, ${contas.cartoes} cartão(ões) ` +
      `(${Object.entries(contas.familias).map(([k, v]) => `${k} ${v}`).join(', ')}), ${relatorio.chaves} chave(s); ` +
      `unidades declaradas ${contas.unidades.declaradas}, da linha ${contas.unidades.da_linha}, em dívida ${contas.unidades.em_divida}; ` +
      `estados ${contas.estados}; frases da faixa ${contas.faixas.lugar}+${contas.faixas.comparacao} (${contas.faixas.presentes} cartões com a faixa inteira); ` +
      (comparacaoComODeclarado
        ? `contra o declarado: ${comparacaoComODeclarado.comparadas.chaves} chave(s), ${comparacaoComODeclarado.comparadas.campos} campo(s), ${comparacaoComODeclarado.comparadas.formas} forma(s) com a contagem, ${comparacaoComODeclarado.comparadas.ocorrencias} ocorrência(s), ${comparacaoComODeclarado.diferencas.length} diferença(s); `
        : '') +
      `dobras ${contas.dobras.perguntas} perguntas, ${contas.dobras.notas} notas, ${contas.dobras.referencias} referências, ${contas.dobras.uniao} na União; ` +
      `${prova ? `${prov.resultados.filter((p) => p.mordeu).length} de ${prov.resultados.length} plantas a morder; ` : ''}` +
      `${erros.length} erro(s).`,
  );
  process.exitCode = erros.length ? 1 : 0;
}
