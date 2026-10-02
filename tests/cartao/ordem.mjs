/**
 * =============================================================================
 * K19 · A ORDEM DO CARTÃO, LIDA NO DOCUMENTO · bloco K2 (02.10.2026), item 1 do brief
 * =============================================================================
 *
 * PORQUE EXISTE. O diretor e os amigos (30.09.2026): a leitura é difícil, sobretudo no telemóvel, e um número sem o
 * seu contexto não diz nada; a leitura a frio da navegação viu um cartão abrir com nove linhas de definição antes de
 * qualquer comparação. O teste de aceitação do K2 diz a ordem: em cada cartão de medida das páginas de assunto, da
 * União e dos lugares, o nome, o valor com a unidade, a comparação (a referência e de que lado o valor está) e só
 * depois a definição, dobrada numa linha que se abre sem guião e que diz «o que é este número». Esta célula lê essa
 * ordem no documento construído, onde a folha de estilo não a pode esconder.
 *
 * O QUE CONFERE, em cada `article.cartao-medida` (os cartões nacionais, os dos lugares e o das câmaras):
 *   O1 · a primeira peça é o nome e a segunda é a linha do valor;
 *   O2 · entre a linha do valor e o fim só há peças da comparação (a metade da leitura que compara, a régua, a faixa
 *        da União, a faixa do concelho, a ressalva da comparação com a União), e a dobra, se existe, é a última peça;
 *   O3 · nenhuma definição fora da dobra: a pergunta (`[data-cartao-definicao]`), a frase do que a medida mede
 *        (`.cartao-medida-frase`) e a metade da leitura que diz o que o número é (`[data-leitura-parte="o-que-e"]`)
 *        vivem dentro de `details.cartao-medida-dobra`;
 *   O4 · a dobra está fechada (sem `open`), abre por um `<summary>` que é a sua primeira peça e diz, carácter a
 *        carácter, «O que é este número» da edição (`strings.mjs`, `cartao.oQueE`), e não leva mais nada além da
 *        definição;
 * e em cada cartão da faixa da página da União (`[data-faixa] li.cartao`), que tem outra forma:
 *   O5 · o nome vem antes do valor, o valor antes da unidade, e a unidade antes do estado (a comparação).
 *
 * É MOBÍLIA (M): protege a ordem em que o cartão se lê, e não um número; o número continua guardado pelo portão de
 * HTML, pela K5, pela K17 e pela forma do valor do cartão. As plantas estragam uma cópia em memória de uma página
 * construída, uma por regra, e cada uma tem de morder com a queixa da sua regra.
 */
import { parse } from 'node-html-parser';
import { t } from '../../src/i18n/strings.mjs';

const COMPARACAO = ['cartao-medida-regua', 'cartao-medida-faixa', 'cartao-medida-faixa-concelho', 'cartao-medida-ressalva'];

/** O nome de uma peça de um cartão de medida, pela classe. @param {any} el */
function pecaDoCartao(el) {
  const c = (el.getAttribute?.('class') ?? '').split(/\s+/);
  if (c.includes('cartao-medida-nome')) return 'nome';
  if (c.includes('cartao-medida-valor')) return 'valor';
  if (c.includes('cartao-medida-dobra') && String(el.rawTagName).toLowerCase() === 'details') return 'dobra';
  if (c.includes('cartao-medida-leitura')) return el.getAttribute('data-leitura-parte') === 'comparacao' ? 'comparacao' : 'definicao';
  if (c.includes('cartao-medida-frase')) return 'definicao';
  if (COMPARACAO.some((k) => c.includes(k))) return 'comparacao';
  return `outra (${c.filter(Boolean).join(' ') || String(el.rawTagName).toLowerCase()})`;
}

/** O texto que se vê de um elemento, sem o que só um leitor de ecrã ouve. @param {any} el */
function visivel(el) {
  const copia = parse(el.outerHTML);
  for (const e of copia.querySelectorAll('.vh, [aria-hidden="true"]')) e.remove();
  return copia.text.replace(/\s+/g, ' ').trim();
}

/**
 * A célula numa página construída.
 * @param {import('node-html-parser').HTMLElement} root @param {'pt'|'en'} lang @param {string} rota
 */
export function conferirOrdemDaPagina(root, lang, rota) {
  /** @type {string[]} */
  const erros = [];
  const contas = { cartoes: 0, com_dobra: 0, sem_definicao: 0, faixa_da_uniao: 0 };
  const rotulo = t(lang).cartao.oQueE;
  for (const cartao of root.querySelectorAll('article.cartao-medida')) {
    const id = cartao.getAttribute('data-cartao-medida') ?? (cartao.hasAttribute('data-cartao-camaras') ? 'camaras' : '?');
    const falha = (/** @type {string} */ m) => erros.push(`K19 · ${rota} · ${id}: ${m}`);
    contas.cartoes++;
    const pecas = cartao.childNodes.filter((n) => /** @type {any} */ (n).tagName).map((n) => pecaDoCartao(n));
    if (pecas[0] !== 'nome' || pecas[1] !== 'valor') falha(`O1 · o cartão não abre pelo nome e pela linha do valor (${pecas.slice(0, 2).join(', ')})`);
    const dobras = pecas.filter((p) => p === 'dobra').length;
    if (dobras > 1) falha(`O2 · o cartão tem ${dobras} dobras`);
    if (dobras === 1 && pecas.at(-1) !== 'dobra') falha(`O2 · a dobra não é a última peça (${pecas.join(', ')})`);
    for (const p of pecas.slice(2)) {
      if (p !== 'comparacao' && p !== 'dobra') falha(`O2 · depois do valor há uma peça que não é da comparação nem a dobra («${p}»)`);
    }
    for (const d of cartao.querySelectorAll('[data-cartao-definicao], .cartao-medida-frase, [data-leitura-parte="o-que-e"]')) {
      if (!d.closest('details.cartao-medida-dobra')) falha(`O3 · uma definição está fora da dobra («${visivel(d).slice(0, 50)}»)`);
    }
    const dobra = cartao.querySelector('details.cartao-medida-dobra');
    if (!dobra) {
      contas.sem_definicao++;
      continue;
    }
    contas.com_dobra++;
    if (dobra.hasAttribute('open')) falha('O4 · a dobra está aberta, e a definição chega dobrada');
    const filhos = dobra.childNodes.filter((n) => /** @type {any} */ (n).tagName);
    const resumo = filhos[0];
    if (!resumo || String(resumo.rawTagName).toLowerCase() !== 'summary') falha('O4 · a dobra não abre por um <summary> na primeira peça');
    else if (visivel(resumo) !== rotulo) falha(`O4 · a linha da dobra diz «${visivel(resumo)}», e diz «${rotulo}»`);
    const dentro = filhos.slice(1).map((n) => pecaDoCartao(n));
    if (!dentro.length) falha('O4 · a dobra não tem definição nenhuma');
    for (const p of dentro) if (p !== 'definicao') falha(`O4 · a dobra leva uma peça que não é da definição («${p}»)`);
  }
  for (const cartao of root.querySelectorAll('[data-faixa] li.cartao')) {
    const id = cartao.getAttribute('data-cartao') ?? '?';
    contas.faixa_da_uniao++;
    const ordem = [];
    const anda = (/** @type {any} */ n) => {
      for (const f of n.childNodes.filter((x) => /** @type {any} */ (x).tagName)) {
        const c = (f.getAttribute?.('class') ?? '').split(/\s+/);
        if (c.includes('claim-com-chip')) { ordem.push('valor'); continue; }
        if (c.includes('cartao-nome')) ordem.push('nome');
        else if (c.includes('cartao-unidade')) ordem.push('unidade');
        else if (c.includes('cartao-topo')) ordem.push('comparacao');
      }
    };
    anda(cartao);
    const esperada = ['nome', 'valor', 'unidade', 'comparacao'];
    if (JSON.stringify(ordem) !== JSON.stringify(esperada)) {
      erros.push(`K19 · ${rota} · ${id}: O5 · o cartão da faixa da União lê-se ${ordem.join(', ')}, e lê-se ${esperada.join(', ')}`);
    }
  }
  return { erros, contas };
}

/**
 * As plantas, sobre cópias em memória de páginas construídas.
 * @param {(rel: string) => string} ler  devolve o HTML de uma página de `dist/`
 */
export function plantasDaOrdem(ler) {
  const casos = [
    { nome: 'a dobra antes da régua', pagina: 'emprego/index.html', lang: 'pt', mordida: /O2 · a dobra não é a última peça/,
      estraga: (r) => { const c = r.querySelector('[data-cartao-medida="taxa-de-emprego-2025"]'); const d = c.querySelector('details.cartao-medida-dobra'); const h = d.outerHTML; d.remove(); c.querySelector('.cartao-medida-regua').insertAdjacentHTML('beforebegin', h); } },
    { nome: 'a pergunta fora da dobra', pagina: 'emprego/index.html', lang: 'pt', mordida: /O3 · uma definição está fora da dobra/,
      estraga: (r) => { const c = r.querySelector('[data-cartao-medida="taxa-de-emprego-2025"]'); const f = c.querySelector('[data-cartao-definicao]'); const h = f.outerHTML; f.remove(); c.querySelector('.cartao-medida-valor').insertAdjacentHTML('afterend', h); } },
    { nome: 'a dobra aberta', pagina: 'emprego/index.html', lang: 'pt', mordida: /O4 · a dobra está aberta/,
      estraga: (r) => { r.querySelector('[data-cartao-medida="taxa-de-emprego-2025"] details.cartao-medida-dobra').setAttribute('open', ''); } },
    { nome: 'o valor antes do nome', pagina: 'emprego/index.html', lang: 'pt', mordida: /O1 · o cartão não abre pelo nome/,
      estraga: (r) => { const c = r.querySelector('[data-cartao-medida="taxa-de-emprego-2025"]'); const n = c.querySelector('.cartao-medida-nome'); const h = n.outerHTML; n.remove(); c.querySelector('.cartao-medida-valor').insertAdjacentHTML('afterend', h); } },
    { nome: 'a linha da dobra com outras palavras', pagina: 'en/employment/index.html', lang: 'en', mordida: /O4 · a linha da dobra diz/,
      estraga: (r) => { r.querySelector('[data-cartao-medida="taxa-de-emprego-2025"] .cartao-medida-dobra-rotulo').set_content('Definition'); } },
    { nome: 'a frase de um cartão de concelho fora da dobra', pagina: 'municipios/evora/index.html', lang: 'pt', mordida: /O3 · uma definição está fora da dobra/,
      estraga: (r) => { const c = r.querySelector('[data-medida-chave="indice"]'); const f = c.querySelector('.cartao-medida-frase'); const h = f.outerHTML; f.remove(); c.querySelector('.cartao-medida-valor').insertAdjacentHTML('afterend', h); } },
    { nome: 'o estado antes do valor num cartão da faixa da União', pagina: 'uniao-europeia/index.html', lang: 'pt', mordida: /O5 · o cartão da faixa da União lê-se/,
      estraga: (r) => { const c = r.querySelector('[data-faixa] li.cartao'); const topo = c.querySelector('.cartao-topo'); const h = topo.outerHTML; topo.remove(); c.querySelector('.cartao-nome').insertAdjacentHTML('afterend', h); } },
  ];
  return casos.map((p) => {
    const r = parse(ler(p.pagina));
    const limpo = conferirOrdemDaPagina(r, p.lang, `/${p.pagina} (limpa)`).erros.length;
    p.estraga(r);
    const erros = conferirOrdemDaPagina(r, p.lang, `/${p.pagina} (planta)`).erros;
    const queixa = erros.find((e) => p.mordida.test(e)) ?? null;
    return { nome: p.nome, pagina: p.pagina, limpa_sem_erros: limpo === 0, mordeu: Boolean(queixa) && limpo === 0, queixa };
  });
}
