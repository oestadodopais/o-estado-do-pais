/**
 * L2a · O MAPA PRIMEIRO (01.10.2026; `DECISIONS.md` §1.149), sobre o HTML construído, nas duas edições.
 *
 * As células que exigiam a pesquisa e o mapa na primeira página mudam de forma com a página: o que elas
 * protegiam (uma pesquisa e um mapa que funcionam, e uma coisa num lugar só) passa a ser medido onde a
 * coisa vive agora, em «Lugares», e a primeira página passa a dever a porta com o sinal.
 *
 *   L2A1 · em «Lugares», a ordem do documento é a pesquisa, o mapa e só depois as duas listas: é a ordem do
 *          telemóvel, e a folha põe o mapa à direita a partir de 1 024 px sem a mudar;
 *   L2A2 · cada lista numa gaveta fechada (um `<details>` sem `open`), com o nome da secção (um título) e a
 *          contagem no `<summary>`; a contagem é uma chave da prova e é o número de nomes da lista; os nomes
 *          são os da carta, pela mesma ordem, cada um com a porta da sua página;
 *   L2A3 · a primeira página não tem o mapa inteiro, a pesquisa dos lugares nem a fila dos 308;
 *   L2A4 · a porta «Lugares» do índice dos assuntos (na primeira página e na dos temas) leva um sinal e só ela:
 *          um `<svg>` com papel de imagem e o texto alternativo da edição, sem ligações, sem texto, sem números
 *          nem marcas de origem, com o desenho; e a menção da fonte no mesmo item, fora da ligação.
 *
 * Cada planta muda uma condição numa cópia em memória e exige a queixa daquela célula.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { regioesDaCarta, distritosDaCarta } from '../../src/data/carta-dos-lugares.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { t } from '../../src/i18n/strings.mjs';

const ficheiro = (/** @type {string} */ dist, /** @type {string} */ rota) => path.join(dist, rota.replace(/^\//, ''), 'index.html');
const normal = (/** @type {unknown} */ s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const semBarra = (/** @type {unknown} */ s) => String(s ?? '').replace(/\/+$/, '') || '/';
const LINGUAS = /** @type {const} */ (['pt', 'en']);

/** @param {string} dist */
export function conferirMapaPrimeiro(dist, { ler = (/** @type {string} */ rota) => parse(fs.readFileSync(ficheiro(dist, rota), 'utf8')) } = {}) {
  /** @type {string[]} */
  const erros = [];
  const contas = { ordens: 0, gavetas: 0, nomes_nas_listas: 0, primeiras_sem_mapa: 0, sinais: 0 };
  const carta = { regioes: regioesDaCarta(), distritos: distritosDaCarta() };
  for (const lang of LINGUAS) {
    /* ---------------------------------------------------------------- L2A1 */
    const lugares = ler(routePath('lugares', lang));
    const grelha = lugares.querySelector('.lugares-grelha');
    const pecas = (grelha?.childNodes ?? [])
      .filter((n) => n.nodeType === 1)
      .map((/** @type {any} */ n) =>
        n.hasAttribute?.('data-pesquisa-bloco') ? 'pesquisa'
          : n.hasAttribute?.('data-lugares-mapa') ? 'mapa'
            : n.getAttribute?.('data-dobra-lugares') ?? '?');
    const esperada = ['pesquisa', 'mapa', 'regioes', 'distritos'];
    if (JSON.stringify(pecas) !== JSON.stringify(esperada)) {
      erros.push(`L2A1 ${lang}: a grelha de «Lugares» tem as peças por esta ordem: ${pecas.join(', ') || 'nenhuma'}; devia ser ${esperada.join(', ')}.`);
    } else contas.ordens++;
    if (!lugares.querySelector('[data-lugares-mapa] [data-mapa-raiz] [data-mapa-areas]')) erros.push(`L2A1 ${lang}: o mapa inteiro não está no contentor do mapa de «Lugares».`);

    /* ---------------------------------------------------------------- L2A2 */
    for (const [chave, lista, rotaDe, nomeDe, prova] of /** @type {const} */ ([
      ['regioes', carta.regioes, (/** @type {any} */ x) => routePath('regiao', lang, { slug: x.slug }), (/** @type {any} */ x) => x.nome[lang] ?? x.nome.pt, 'regioes_total'],
      ['distritos', carta.distritos, (/** @type {any} */ x) => routePath('distrito', lang, { slug: x.slug }), (/** @type {any} */ x) => x.nome, 'mapa_unidades'],
    ])) {
      const seccao = lugares.querySelector(`[data-dobra-lugares="${chave}"]`);
      const gavetas = seccao?.querySelectorAll('details') ?? [];
      const gaveta = gavetas[0];
      if (gavetas.length !== 1) { erros.push(`L2A2 ${lang} ${chave}: a secção não tem uma gaveta (um <details>) e só uma.`); continue; }
      if (gaveta.hasAttribute('open')) erros.push(`L2A2 ${lang} ${chave}: a gaveta chega aberta; devia chegar fechada.`);
      const sumario = gaveta.querySelector('summary');
      const titulo = sumario?.querySelector('[data-lugares-seccao]');
      const numero = sumario?.querySelector(`[data-conta-da-lista="${chave}"] [data-prova="${prova}"]`);
      const itens = gaveta.querySelectorAll(`ul[data-lista-lugares="${chave}"] > li`);
      const fora = lugares.querySelectorAll(`ul[data-lista-lugares="${chave}"]`).filter((u) => !gaveta.querySelectorAll('ul').includes(u));
      if (!titulo || !/^h[1-6]$/i.test(titulo.rawTagName ?? '')) erros.push(`L2A2 ${lang} ${chave}: o <summary> não tem o título da secção.`);
      if (!numero) erros.push(`L2A2 ${lang} ${chave}: o <summary> não tem a contagem da prova «${prova}».`);
      else if (normal(numero.textContent) !== String(itens.length)) erros.push(`L2A2 ${lang} ${chave}: o <summary> diz ${normal(numero.textContent)} e a lista tem ${itens.length} nomes.`);
      if (fora.length) erros.push(`L2A2 ${lang} ${chave}: a lista está fora da gaveta.`);
      if (itens.length !== lista.length) erros.push(`L2A2 ${lang} ${chave}: a lista tem ${itens.length} nomes e a carta dá ${lista.length}.`);
      lista.forEach((x, i) => {
        const a = itens[i]?.querySelector('a');
        if (semBarra(a?.getAttribute('href')) !== semBarra(rotaDe(x)) || normal(a?.textContent) !== normal(nomeDe(x))) {
          erros.push(`L2A2 ${lang} ${chave}: o nome ${i + 1} da lista não é «${nomeDe(x)}» com a porta ${rotaDe(x)}.`);
        }
      });
      contas.gavetas++;
      contas.nomes_nas_listas += itens.length;
    }

    /* ---------------------------------------------------------------- L2A3 */
    const primeira = ler(routePath('home', lang));
    const copias = ['[data-mapa-raiz]', '[data-mapa-areas]', '[data-pesquisa-bloco]', '[data-porta-concelho]', '[data-pesquisa-lista]', '.pp-lugares']
      .filter((sel) => primeira.querySelector(sel));
    if (copias.length) erros.push(`L2A3 ${lang}: a primeira página voltou a ter ${copias.join(', ')}; o mapa e a pesquisa vivem em «Lugares» e só lá.`);
    else contas.primeiras_sem_mapa++;

    /* ---------------------------------------------------------------- L2A4 */
    for (const [onde, root] of /** @type {const} */ ([['primeira', primeira], ['temas', ler(routePath('temas', lang))]])) {
      const sinais = root.querySelectorAll('[data-indice-assuntos] [data-sinal-dos-lugares]');
      const porta = root.querySelector('[data-indice-assuntos] > li[data-entrada="lugares"] > a.pp-entrada');
      const doLugar = porta?.querySelectorAll('svg[data-sinal-dos-lugares]') ?? [];
      if (sinais.length !== 1 || doLugar.length !== 1) { erros.push(`L2A4 ${lang} ${onde}: o índice tem ${sinais.length} sinal(is) e a porta «Lugares» ${doLugar.length}; devia ser um, nela.`); continue; }
      const sinal = doLugar[0];
      const rotulo = t(lang).primeira.sinalDosLugares;
      if (sinal.getAttribute('role') !== 'img' || normal(sinal.getAttribute('aria-label')) !== normal(rotulo)) erros.push(`L2A4 ${lang} ${onde}: o sinal não é uma imagem com o texto alternativo «${rotulo}».`);
      if (sinal.querySelector('a, text, tspan, title, desc, [data-claim], [data-prova], [data-nonledger]') || /\d/.test(sinal.textContent)) erros.push(`L2A4 ${lang} ${onde}: o sinal leva ligações, texto ou números, e é um contorno sem dados.`);
      if (!sinal.querySelectorAll('path').some((p) => normal(p.getAttribute('d')).length > 0)) erros.push(`L2A4 ${lang} ${onde}: o sinal não tem desenho.`);
      const item = porta.parentNode;
      const mencao = item.querySelector('[data-fonte-do-sinal] [data-fonte-da-carta]');
      if (!mencao || porta.querySelector('[data-fonte-da-carta]')) erros.push(`L2A4 ${lang} ${onde}: a menção da fonte do sinal não está no item da porta, fora da ligação.`);
      contas.sinais++;
    }
  }
  return { erros, contas };
}

/** As plantas: uma condição de cada vez, numa cópia em memória. @param {string} dist */
export function plantasDoMapaPrimeiro(dist) {
  const le = (/** @type {string} */ rota) => parse(fs.readFileSync(ficheiro(dist, rota), 'utf8'));
  /** @param {string} nome @param {string} rota @param {(r: any) => void} estraga @param {RegExp} mordida */
  const planta = (nome, rota, estraga, mordida) => {
    const r = conferirMapaPrimeiro(dist, { ler: (x) => { const root = le(x); if (x === rota) estraga(root); return root; } });
    const queixa = r.erros.find((e) => mordida.test(e));
    return { nome, mordeu: Boolean(queixa), queixa: queixa ?? null };
  };
  const lugares = routePath('lugares', 'pt');
  const places = routePath('lugares', 'en');
  return [
    planta('o mapa depois das listas em «Lugares»', lugares, (r) => { const g = r.querySelector('.lugares-grelha'); const m = r.querySelector('[data-lugares-mapa]'); const html = m.outerHTML; m.remove(); g.insertAdjacentHTML('beforeend', html); }, /^L2A1 pt: a grelha/),
    planta('a gaveta das regiões aberta', places, (r) => r.querySelector('[data-dobra-lugares="regioes"] details').setAttribute('open', ''), /^L2A2 en regioes: a gaveta chega aberta/),
    planta('um distrito a menos na lista', lugares, (r) => r.querySelector('ul[data-lista-lugares="distritos"] > li').remove(), /^L2A2 pt distritos: o <summary> diz \d+ e a lista tem \d+/),
    planta('a contagem das regiões trocada', lugares, (r) => r.querySelector('[data-conta-da-lista="regioes"] [data-prova]').set_content('8'), /^L2A2 pt regioes: o <summary> diz 8/),
    planta('a lista dos distritos fora da gaveta', places, (r) => { const u = r.querySelector('ul[data-lista-lugares="distritos"]'); const html = u.outerHTML; u.remove(); r.querySelector('[data-dobra-lugares="distritos"]').insertAdjacentHTML('beforeend', html); }, /^L2A2 en distritos: a lista está fora da gaveta/),
    planta('a porta de um distrito trocada', lugares, (r) => r.querySelector('ul[data-lista-lugares="distritos"] > li a').setAttribute('href', '/distritos/evora'), /^L2A2 pt distritos: o nome 1 da lista/),
    planta('o título da secção fora do <summary>', places, (r) => { const h = r.querySelector('[data-dobra-lugares="regioes"] summary [data-lugares-seccao]'); const html = h.outerHTML; h.remove(); r.querySelector('[data-dobra-lugares="regioes"]').insertAdjacentHTML('afterbegin', html); }, /^L2A2 en regioes: o <summary> não tem o título/),
    planta('a pesquisa de volta à primeira página', '/', (r) => r.querySelector('main').insertAdjacentHTML('beforeend', '<section data-pesquisa-bloco><form data-porta-concelho action="/lugares/"></form></section>'), /^L2A3 pt: a primeira página voltou a ter/),
    planta('o mapa de volta à primeira página', routePath('home', 'en'), (r) => r.querySelector('main').insertAdjacentHTML('beforeend', '<figure data-mapa-raiz><svg data-mapa-areas></svg></figure>'), /^L2A3 en: a primeira página voltou a ter/),
    planta('a porta «Lugares» sem o sinal', routePath('temas', 'en'), (r) => r.querySelector('[data-sinal-dos-lugares]').remove(), /^L2A4 en temas: o índice tem 0 sinal/),
    planta('um número dentro do sinal', '/', (r) => r.querySelector('[data-sinal-dos-lugares]').insertAdjacentHTML('beforeend', '<text x="1" y="9">308</text>'), /^L2A4 pt primeira: o sinal leva ligações, texto ou números/),
    planta('o sinal sem texto alternativo', routePath('temas', 'pt'), (r) => r.querySelector('[data-sinal-dos-lugares]').removeAttribute('aria-label'), /^L2A4 pt temas: o sinal não é uma imagem/),
    planta('a menção da fonte do sinal retirada', routePath('home', 'en'), (r) => r.querySelector('[data-fonte-do-sinal]').remove(), /^L2A4 en primeira: a menção da fonte/),
    planta('o sinal noutra porta', '/', (r) => { const s = r.querySelector('[data-sinal-dos-lugares]'); r.querySelector('li[data-entrada="precos"] a').insertAdjacentHTML('afterbegin', s.outerHTML); }, /^L2A4 pt primeira: o índice tem 2 sinal/),
  ];
}
