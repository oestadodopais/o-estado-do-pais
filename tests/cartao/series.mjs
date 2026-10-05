/** K20 · RP4-b: as séries das linhas mostradas, na ordem e com a porta certa. */
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { reguaDoCartao } from '../../src/lib/enquadramento.mjs';
import { routePath } from '../../src/lib/routes.mjs';
import { t } from '../../src/i18n/strings.mjs';

export function conferirSeriesDosCartoes(root, lang, claims = loadClaims()) {
  const erros = []; const vistos = [];
  for (const cartao of root.querySelectorAll('[data-cartao-medida], [data-linha-sem-nome]')) {
    const id = cartao.getAttribute('data-cartao-medida') ?? cartao.getAttribute('data-linha-sem-nome');
    const comparacao = reguaDoCartao(id).ue?.id;
    const linhas = [id, comparacao].filter(linha => linha && claims.get(linha)?.serie);
    const portas = cartao.querySelectorAll('[data-cartao-serie]');
    const desenhos = cartao.querySelectorAll('[data-forma="serie-do-pais"]');
    if (!linhas.length) {
      if (portas.length || desenhos.length) erros.push(`K20 · ${id}: cartão sem série a desenhar`);
      continue;
    }
    if (portas.length !== linhas.length || desenhos.length !== linhas.length) erros.push(`K20 · ${id}: falta o desenho de cada linha mostrada ou há um desenho a mais`);
    const filhos = cartao.childNodes.filter(n => n.rawTagName);
    const valor = filhos.findIndex(n => n.classList.contains('cartao-medida-valor'));
    for (const [i, linha] of linhas.entries()) {
      const serie = claims.get(linha).serie;
      const porta = portas[i];
      const svg = porta?.querySelector('[data-forma="serie-do-pais"]');
      if (porta?.getAttribute('data-cartao-serie-linha') !== linha || porta?.getAttribute('data-cartao-serie') !== serie || svg?.getAttribute('data-series') !== serie || porta?.querySelectorAll('[data-forma="serie-do-pais"]').length !== 1) {
        erros.push(`K20 · ${id}/${linha}: falta o desenho da série da linha`);
      } else vistos.push(linha);
      if (porta?.rawTagName !== 'a' || porta?.getAttribute('href') !== routePath('serie', lang, { slug: serie })) erros.push(`K20 · ${id}/${linha}: porta para outro recibo ou edição`);
      if (valor < 0 || filhos.indexOf(porta) !== valor + 1 + i) erros.push(`K20 · ${id}/${linha}: gráfico fora do lugar depois do valor`);
      const legendas = porta?.querySelectorAll('[data-cartao-serie-legenda]') ?? [];
      if (linha !== id && (legendas.length !== 1 || legendas[0].textContent.trim() !== t(lang).cartao.uniaoEuropeia || !legendas[0].hasAttribute('data-voz'))) erros.push(`K20 · ${id}/${linha}: falta a legenda da comparação ou não é a da casa`);
      if (linha === id && legendas.length) erros.push(`K20 · ${id}/${linha}: legenda da comparação na série própria`);
    }
  }
  return { erros, vistos };
}

export function plantasDosCartoesComSerie(html, lang) {
  const limpa = conferirSeriesDosCartoes(parse(html), lang);
  const ue = '[data-cartao-medida="ihpc-variacao-homologa"] [data-cartao-serie]';
  const casos = [
    ['cartão sem série própria nem comparação com série a desenhar', /sem série a desenhar/, r => {
      const c = r.querySelectorAll('[data-cartao-medida]').find(c => {
        const id = c.getAttribute('data-cartao-medida');
        return !loadClaims().get(id)?.serie && !loadClaims().get(reguaDoCartao(id).ue?.id)?.serie;
      });
      c.insertAdjacentHTML('beforeend', '<a data-cartao-serie="serie-ipc-indice"><svg data-forma="serie-do-pais"></svg></a>');
    }],
    ['gráfico próprio retirado', /falta o desenho/, r => r.querySelector('[data-cartao-medida="ipc-variacao-homologa"] [data-cartao-serie]').remove()],
    ['gráfico da comparação retirado', /falta o desenho/, r => r.querySelector(ue).remove()],
    ['porta noutra edição', /porta para outro/, r => r.querySelector(ue).setAttribute('href', routePath('serie', lang === 'pt' ? 'en' : 'pt', { slug: 'serie-ihpc-variacao-homologa-ue' }))],
    ['porta da comparação para o recibo de outra série', /porta para outro/, r => r.querySelector(ue).setAttribute('href', routePath('serie', lang, { slug: 'serie-ipc-variacao-homologa' }))],
    ['série da comparação trocada', /falta o desenho/, r => r.querySelector(`${ue} svg`).setAttribute('data-series', 'serie-ipc-variacao-homologa')],
    ['legenda da comparação retirada', /falta a legenda/, r => r.querySelector(`${ue} [data-cartao-serie-legenda]`).remove()],
    ['legenda da comparação trocada', /falta a legenda/, r => r.querySelector(`${ue} [data-cartao-serie-legenda]`).set_content('Portugal')],
    ['gráfico depois da leitura', /fora do lugar/, r => { const p = r.querySelector(ue); const c = p.parentNode; const h = p.outerHTML; p.remove(); c.insertAdjacentHTML('beforeend', h); }],
  ];
  const plantas = casos.map(([nome, mordida, estraga]) => {
    const r = parse(html); estraga(r);
    const queixa = conferirSeriesDosCartoes(r, lang).erros.find(e => mordida.test(e));
    return { nome, controlo: limpa.erros.length, mordeu: !limpa.erros.length && Boolean(queixa), queixa: queixa ?? null };
  });
  // A cópia em memória antecipa um cartão com as duas séries. A K20 tem de
  // exigir ambas, mesmo quando a série própria passar a existir no livro.
  const duas = parse(html);
  const cartao = duas.querySelector('[data-cartao-medida="ihpc-variacao-homologa"]');
  const propria = parse(duas.querySelector('[data-cartao-medida="ipc-variacao-homologa"] [data-cartao-serie]').outerHTML).firstChild;
  propria.setAttribute('data-cartao-serie-linha', 'ihpc-variacao-homologa');
  cartao.querySelector('.cartao-medida-valor').insertAdjacentHTML('afterend', propria.outerHTML);
  const claims = new Map(loadClaims());
  claims.set('ihpc-variacao-homologa', { ...claims.get('ihpc-variacao-homologa'), serie: 'serie-ipc-variacao-homologa' });
  const controlo = conferirSeriesDosCartoes(duas, lang, claims).erros;
  for (const linha of ['ihpc-variacao-homologa', 'ihpc-variacao-homologa-ue']) {
    const r = parse(duas.outerHTML);
    r.querySelector(`[data-cartao-medida="ihpc-variacao-homologa"] [data-cartao-serie-linha="${linha}"]`).remove();
    const queixa = conferirSeriesDosCartoes(r, lang, claims).erros.find(e => /falta o desenho/.test(e));
    plantas.push({ nome: `cartão com duas séries perde ${linha}`, controlo: controlo.length, mordeu: !controlo.length && Boolean(queixa), queixa: queixa ?? null });
  }
  return plantas;
}
