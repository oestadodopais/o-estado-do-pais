/** K20 · RP4: só uma linha presa ganha o gráfico, na ordem e com a porta certa. */
import { parse } from 'node-html-parser';
import { loadClaims } from '../../src/lib/ledger.mjs';
import { routePath } from '../../src/lib/routes.mjs';

export function conferirSeriesDosCartoes(root, lang) {
  const erros = []; const vistos = [];
  const claims = loadClaims();
  for (const cartao of root.querySelectorAll('[data-cartao-medida], [data-linha-sem-nome]')) {
    const id = cartao.getAttribute('data-cartao-medida') ?? cartao.getAttribute('data-linha-sem-nome');
    const serie = claims.get(id)?.serie;
    const portas = cartao.querySelectorAll('[data-cartao-serie]');
    const desenhos = cartao.querySelectorAll('[data-forma="serie-do-pais"]');
    if (!serie) {
      if (portas.length || desenhos.length) erros.push(`K20 · ${id}: cartão sem série a desenhar`);
      continue;
    }
    vistos.push(id);
    const porta = portas[0]; const svg = desenhos[0];
    if (portas.length !== 1 || desenhos.length !== 1 || porta?.getAttribute('data-cartao-serie') !== serie || svg?.getAttribute('data-series') !== serie || !svg?.closest('[data-cartao-serie]')) erros.push(`K20 · ${id}: falta o desenho da série da linha`);
    if (porta?.rawTagName !== 'a' || porta?.getAttribute('href') !== routePath('serie', lang, { slug: serie })) erros.push(`K20 · ${id}: porta para outro recibo ou edição`);
    const filhos = cartao.childNodes.filter((n) => n.rawTagName);
    const valor = filhos.findIndex((n) => n.classList.contains('cartao-medida-valor'));
    if (filhos.indexOf(porta) !== valor + 1) erros.push(`K20 · ${id}: gráfico fora do lugar depois do valor`);
  }
  return { erros, vistos };
}

export function plantasDosCartoesComSerie(html, lang) {
  const limpa = conferirSeriesDosCartoes(parse(html), lang);
  const casos = [
    ['cartão sem série a desenhar', /sem série a desenhar/, (r) => {
      const c = r.querySelectorAll('[data-cartao-medida]').find((c) => !loadClaims().get(c.getAttribute('data-cartao-medida'))?.serie);
      c.insertAdjacentHTML('beforeend', '<a data-cartao-serie="serie-ipc-indice"><svg data-forma="serie-do-pais"></svg></a>');
    }],
    ['gráfico retirado', /falta o desenho/, (r) => r.querySelector('[data-cartao-serie]').remove()],
    ['porta noutra edição', /porta para outro/, (r) => r.querySelector('[data-cartao-serie]').setAttribute('href', '/inexistente')],
    ['gráfico depois da leitura', /fora do lugar/, (r) => { const p = r.querySelector('[data-cartao-serie]'); const c = p.parentNode; const h = p.outerHTML; p.remove(); c.insertAdjacentHTML('beforeend', h); }],
  ];
  return casos.map(([nome, mordida, estraga]) => {
    const r = parse(html); estraga(r);
    const queixa = conferirSeriesDosCartoes(r, lang).erros.find((e) => mordida.test(e));
    return { nome, controlo: limpa.erros.length, mordeu: !limpa.erros.length && Boolean(queixa), queixa: queixa ?? null };
  });
}
