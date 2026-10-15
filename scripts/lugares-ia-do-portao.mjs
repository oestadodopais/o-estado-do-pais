/** O MÉTODO DO LADO DO PORTÃO: os papéis e as famílias pela redação decidida, e nenhum nome de modelo
 * (H4, 06.10.2026; reescrito no bloco ME1, 15.10.2026).
 *
 * Cópia do lado do portão, que a vista não importa: a página rende `src/data/politica-ia.mjs`, e este
 * ficheiro guarda a mesma redação, copiada do mandato do bloco que a decidiu
 * (`design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md`, §3.1, como ficou depois da leitura das frases
 * construídas pelo lugar de direção). As duas mudam no mesmo commit quando
 * a direção decide o texto. O rótulo legal e o seu oráculo continuam nas conferências próprias
 * (`scripts/textos-aprovados.json`).
 *
 * O QUE MUDOU NO ME1, CONSERVANDO O QUE PROTEGE. Até 15.10.2026 a secção da política tinha um título de
 * lista («Os três papéis»), uma introdução, três `<li>` e uma frase de fecho com as famílias e as empresas
 * dos modelos, e esta cópia conferia essa forma. O mandato reescreveu a secção em parágrafos: os papéis
 * num (`data-papeis`) e a regra das famílias noutro (`data-familias`), com a porta para o documento
 * público da política. O que a célula protege fica: a página diz os papéis e a regra das famílias como a
 * direção os decidiu, carácter a carácter (com os espaços colapsados), nas duas edições.
 *
 * E UMA RÉGUA NOVA, PEQUENA (o mandato do ME1, §5): o texto visível do Método não diz o nome de nenhum
 * modelo, de nenhum fornecedor nem de nenhuma versão («Claude», «Anthropic», «Codex», «OpenAI», «Opus»,
 * «Fable», «gpt-»); os sistemas de cada papel leem-se no documento público da política. As plantas
 * correm em memória cada vez que o portão de HTML carrega este ficheiro, e uma que não morda com a queixa
 * esperada fecha a construção (`PLANTAS_DO_METODO`).
 */
import { parse } from 'node-html-parser';

/** O documento público da política, escrito aqui outra vez de propósito, e não importado da página. */
export const DOCUMENTO_DA_POLITICA_DO_PORTAO =
  'https://github.com/oestadodopais/o-estado-do-pais/blob/main/design/observatorio/POLITICA-DA-AUTONOMIA.md';

export const LUGARES_IA_DO_PORTAO = {
  pt: {
    papeis: "O trabalho divide-se em três papéis, todos de sistemas de inteligência artificial. A direção decide o que se faz, encomenda cada mudança, revê-a antes de se publicar e escreve os textos sobre este projeto, como este. A construção faz as páginas e o programa que lê as fontes; cada número que publica traz a sua fonte e a data em que foi lido, ou diz o que está por confirmar. A leitura é feita por sistemas que não participaram na construção e conferem o trabalho entregue antes de se publicar.",
    familias: "A construção e a leitura são sempre de famílias diferentes de sistemas: o que construiu uma mudança nunca é o que a lê. Um sistema novo só entra num papel depois de passar as mesmas provas que o anterior passou, e cada troca de sistema fica escrita com a data no documento público da política deste projeto.",
    ligacao: "no documento público da política deste projeto",
  },
  en: {
    papeis: "The work is divided into three roles, all held by artificial intelligence systems. Direction decides what is done, commissions each change, reviews it before it is published and writes the texts about this project, such as this one. Building makes the pages and the program that reads the sources; every number it publishes carries its source and the date it was read, or says what is still to be confirmed. Reading is done by systems that took no part in the building and check the delivered work before it is published.",
    familias: "Building and reading are always done by different families of systems: the one that built a change is never the one that reads it. A new system takes a role only after passing the same tests the previous one passed, and every replacement of a system is recorded with its date in this project's public policy document.",
    ligacao: "in this project's public policy document",
  },
};

/** Os nomes que a página do Método não diz, sem distinguir maiúsculas. */
export const NOMES_DE_MODELOS = /\b(?:Claude|Anthropic|Codex|OpenAI|Opus|Fable)\b|gpt-/i;

const texto = (n) => (n?.textContent ?? '').replace(/\s+/g, ' ').trim();

/**
 * O texto que o leitor vê: o corpo, sem guiões, folhas de estilo nem moldes.
 *
 * E COM O DE `noscript`, desde a leitura a frio do Codex (15.10.2026, o achado 9): é o texto que vê quem lê sem
 * JavaScript, e a régua deixava-o de fora com os guiões. O portão de HTML lê as páginas com o conteúdo de
 * `noscript` deitado fora (`blockTextElements`, `noscript: false`), e por isso a régua dos nomes não lê a árvore
 * do portão: lê o HTML da página outra vez, com `LEITURA_DOS_NOMES`, que guarda os guiões e as folhas como texto
 * cru e lê `noscript` como HTML. Se o leitor de HTML guardar o conteúdo de `noscript` como texto cru (a forma por
 * omissão), esse texto lê-se outra vez como HTML antes de se percorrer.
 */
export const LEITURA_DOS_NOMES = { comment: false, blockTextElements: { script: true, style: true } };

function textoVisivel(root) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === 3) return void partes.push(n.text ?? n.rawText ?? '');
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'template') return;
    if (tag === 'noscript') {
      for (const f of parse(n.innerHTML ?? n.rawText ?? '').childNodes ?? []) anda(f);
      return;
    }
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(root.querySelector('body') ?? root);
  return partes.join(' ').replace(/\s+/g, ' ');
}

/**
 * A célula, numa página do Método da edição `lang`. Devolve as falhas; uma página certa devolve nenhuma.
 * `html` é o HTML da página como está no disco: a régua dos nomes lê-o outra vez, com `noscript`; sem ele, lê a
 * árvore que recebe.
 * @param {any} root
 * @param {string} lang
 * @param {string | null} [html]
 */
export function conferirLugaresIA(root, lang, html = null) {
  const esperado = /** @type {Record<string, {papeis: string, familias: string, ligacao: string}>} */ (LUGARES_IA_DO_PORTAO)[lang];
  if (!esperado) return ['ME1 IA: edição desconhecida.'];
  const falhas = [];
  const seccoes = root.querySelectorAll('#politica-de-ia');
  if (seccoes.length !== 1) return ['ME1 IA: falta a secção única de quem escreve estas páginas.'];
  const seccao = seccoes[0];
  const papeis = seccao.querySelectorAll('[data-papeis]');
  if (papeis.length !== 1) falhas.push('ME1 IA: a secção tem de dizer os papéis num parágrafo só.');
  else {
    if (papeis[0].getAttribute('data-papeis') !== lang) falhas.push('ME1 IA: o parágrafo dos papéis não é da edição da página.');
    if (texto(papeis[0]) !== esperado.papeis) falhas.push('ME1 IA: os papéis não são os da redação decidida.');
  }
  const familias = seccao.querySelectorAll('[data-familias]');
  if (familias.length !== 1) falhas.push('ME1 IA: a secção tem de dizer a regra das famílias num parágrafo só.');
  else {
    const f = familias[0];
    if (f.getAttribute('data-familias') !== lang) falhas.push('ME1 IA: o parágrafo das famílias não é da edição da página.');
    if (texto(f) !== esperado.familias) falhas.push('ME1 IA: as famílias diferem da redação decidida.');
    const portas = f.querySelectorAll('a[href]');
    if (portas.length !== 1 || portas[0].getAttribute('href') !== DOCUMENTO_DA_POLITICA_DO_PORTAO || texto(portas[0]) !== esperado.ligacao)
      falhas.push('ME1 IA: a porta para o documento público da política não é a decidida.');
  }
  /* A lista dos lugares saiu com o ME1, e a forma antiga não volta por baixo da nova. */
  if (seccao.querySelectorAll('.politica-lugares').length) falhas.push('ME1 IA: a lista dos lugares saiu com o ME1 e não volta.');
  /* A régua nova: nenhum nome de modelo nem de fornecedor no texto que o leitor vê. */
  const nomes = textoVisivel(html === null ? root : parse(html, LEITURA_DOS_NOMES)).match(new RegExp(NOMES_DE_MODELOS.source, 'gi')) ?? [];
  if (nomes.length)
    falhas.push(
      `ME1 nomes: o Método diz ${nomes.length} nome(s) de modelo ou de fornecedor (${[...new Set(nomes)].join(', ')}); ` +
        'os sistemas de cada papel leem-se no documento público da política.',
    );
  return falhas;
}

/**
 * AS PLANTAS DA CÉLULA, EM MEMÓRIA (bloco ME1, 15.10.2026). Cada uma escreve uma página do Método com a
 * redação decidida e um estrago, e exige a queixa esperada; a página intacta das duas edições tem de
 * passar, e um nome dentro de um guião não é texto que o leitor veja, e por isso não morde. A primeira é a
 * prova de aceitação do mandato: «Opus 5» numa frase. A décima segunda entrou com a leitura a frio do Codex
 * (15.10.2026, o achado 9): «Opus 5» dentro de `noscript`, que quem lê sem JavaScript vê, tem de morder.
 */
export function plantasDoMetodo() {
  /* A página escreve-se em HTML e lê-se como o portão a lê (com `noscript` deitado fora), e a célula recebe
     também o HTML, como no portão: a planta de `noscript` prova o caminho que o portão usa. */
  const LEITURA_DO_PORTAO = { comment: false, blockTextElements: { script: true, style: true, noscript: false } };
  const pagina = (lang, { papeis, familias, ligacao, href, extra = '', depois = '' } = {}) => {
    const e = /** @type {Record<string, {papeis: string, familias: string, ligacao: string}>} */ (LUGARES_IA_DO_PORTAO)[lang];
    const fam = familias ?? e.familias;
    const lig = ligacao ?? e.ligacao;
    const corte = fam.indexOf(lig);
    const comPorta = corte < 0 ? fam : `${fam.slice(0, corte)}<a href="${href ?? DOCUMENTO_DA_POLITICA_DO_PORTAO}">${lig}</a>${fam.slice(corte + lig.length)}`;
    const html =
      `<html><body><main><section id="politica-de-ia"><p data-papeis="${lang}">${papeis ?? e.papeis}</p>` +
      `<p data-familias="${lang}">${comPorta}</p>${extra}</section>${depois}</main></body></html>`;
    return { html, root: parse(html, LEITURA_DO_PORTAO) };
  };
  const casos = [
    ['intacta-pt', 'pt', {}, null],
    ['intacta-en', 'en', {}, null],
    ['opus-5-numa-frase', 'pt', { depois: '<p>A direção é do Opus 5, que decide o que se publica.</p>' }, /^ME1 nomes: .*Opus/],
    ['claude-no-rodape', 'en', { depois: '<footer><p>Written by Claude.</p></footer>' }, /^ME1 nomes: .*Claude/],
    ['gpt-numa-porta', 'pt', { depois: '<p><a href="/x">gpt-6</a></p>' }, /^ME1 nomes: .*gpt-/],
    ['empresa-em-minusculas', 'en', { depois: '<p>Built with openai tools.</p>' }, /^ME1 nomes: .*openai/],
    ['nome-dentro-de-um-guiao', 'pt', { depois: '<script>const m = "Claude";</script>' }, null],
    ['papel-mudado', 'pt', { papeis: LUGARES_IA_DO_PORTAO.pt.papeis.replace('três papéis', 'quatro papéis') }, /^ME1 IA: os papéis não são/],
    ['familias-com-o-nome-de-volta', 'en', { familias: LUGARES_IA_DO_PORTAO.en.familias.replace('different families of systems', 'different families of systems, Claude and Codex') }, /^ME1 IA: as famílias diferem/],
    ['porta-para-outro-documento', 'pt', { href: 'https://github.com/oestadodopais/o-estado-do-pais' }, /^ME1 IA: a porta para o documento/],
    ['lista-antiga-de-volta', 'pt', { extra: '<ul class="politica-lugares"><li>A direção</li></ul>' }, /^ME1 IA: a lista dos lugares/],
    ['opus-5-dentro-de-noscript', 'pt', { depois: '<noscript><p>A direção é do Opus 5, que decide o que se publica.</p></noscript>' }, /^ME1 nomes: .*Opus/],
  ];
  const plantas = [];
  for (const [nome, lang, estrago, esperada] of casos) {
    const { html, root } = pagina(lang, estrago);
    const falhas = conferirLugaresIA(root, lang, html);
    const mordeu = esperada ? falhas.some((f) => esperada.test(f)) : falhas.length === 0;
    if (!mordeu)
      throw new Error(
        `ME1: a planta «${nome}» não deu ${esperada ? `a queixa ${esperada}` : 'nenhuma falha'}; deu ${JSON.stringify(falhas)}.`,
      );
    plantas.push({ nome, lang, esperada: esperada ? String(esperada) : null, falhas });
  }
  return plantas;
}
export const PLANTAS_DO_METODO = plantasDoMetodo();
