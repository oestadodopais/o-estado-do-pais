/** RP4: a série é uma declaração da gramática, também quando o bloco sai. */
import { unidadeDoCartao } from '../../src/data/unidades-dos-cartoes.mjs';
import { parse } from 'node-html-parser';
import { serieDoBloco, blocoResolvido } from '../../src/lib/primeira-pagina.mjs';
import { routePath } from '../../src/lib/routes.mjs';

export function conferirSerieDoBloco(root, lang) {
  const erros = [];
  const esperado = blocoResolvido('precos', lang);
  const b = root.querySelector('[data-bloco="precos"]');
  const desenhos = b?.querySelectorAll('svg[data-forma="serie-do-pais"]') ?? [];
  if (!esperado.mostra) {
    if (desenhos.length) erros.push('RP4 · bloco oculto a desenhar');
    return erros;
  }
  const s = desenhos[0];
  if (desenhos.length !== 1 || s?.getAttribute('data-series') !== 'serie-ipc-variacao-homologa') erros.push('RP4 · falta a série da inflação no bloco dos preços');
  const porta = s?.closest('a');
  if (porta?.getAttribute('href') !== routePath('serie', lang, { slug: esperado.serie })) erros.push('RP4 · porta do bloco para outro recibo');
  const unidade = porta?.querySelector('[data-bloco-serie-unidade]');
  if (porta?.querySelectorAll('[data-bloco-serie-unidade]').length !== 1 || unidade?.getAttribute('data-bloco-serie-unidade') !== esperado.serie || unidade?.textContent.trim() !== unidadeDoCartao('ipc-variacao-homologa', lang).join('')) erros.push('RP4 · falta a unidade declarada da série no bloco');
  if (s?.getAttribute('data-titulo') !== 'periodo-unidade') erros.push('RP4 · título da série repete o nome visível');
  const barra = b?.querySelector('[data-forma="barras"]');
  if (!barra?.closest('.pp-ilustracao') || porta?.parentNode !== barra?.closest('.pp-ilustracao')) erros.push('RP4 · barras e série fora do mesmo contentor');
  if (!barra || b.innerHTML.indexOf(porta?.outerHTML ?? '') < b.innerHTML.indexOf(barra.outerHTML)) erros.push('RP4 · a série não fica depois das barras');
  return erros;
}

export function plantasDaSerieDoBloco(html, lang) {
  const out = [];
  for (const [nome, serie, mordida] of [
    ['série inexistente', 'serie-inexistente', /não existe/],
    ['série de países', 'desemprego-de-longa-duracao-2025-paises', /não é uma série no tempo/],
  ]) {
    let queixa = null; try { serieDoBloco({ serie }); } catch (e) { queixa = e.message; }
    const controlo = serieDoBloco({ serie: 'serie-ipc-variacao-homologa' }) === 'serie-ipc-variacao-homologa';
    out.push({ nome, controlo, mordeu: controlo && Boolean(queixa && mordida.test(queixa)), queixa });
  }
  const r = parse(html); const limpo = conferirSerieDoBloco(r, lang);
  r.querySelector('[data-bloco="precos"] svg[data-forma="serie-do-pais"]')?.remove();
  const queixa = conferirSerieDoBloco(r, lang).find((e) => /falta a série/.test(e));
  out.push({ nome: 'gráfico retirado do bloco', controlo: limpo.length, mordeu: !limpo.length && Boolean(queixa), queixa: queixa ?? null });
  const fora = parse(html); const p = fora.querySelector('[data-bloco-serie]');
  const bloco = fora.querySelector('[data-bloco="precos"]'); const pedaco = p.outerHTML; p.remove(); bloco.insertAdjacentHTML('beforeend', pedaco);
  const queixaFora = conferirSerieDoBloco(fora, lang).find(e => /mesmo contentor/.test(e));
  out.push({ nome: 'gráfico fora da coluna das barras', controlo: limpo.length, mordeu: !limpo.length && Boolean(queixaFora), queixa: queixaFora ?? null });
  for (const troca of [false, true]) {
    const r = parse(html); const u = r.querySelector('[data-bloco-serie-unidade]');
    if (troca) u.set_content('euros'); else u.remove();
    const queixa = conferirSerieDoBloco(r, lang).find(e => /falta a unidade/.test(e));
    out.push({nome: troca ? 'unidade do desenho trocada' : 'unidade do desenho retirada', controlo:limpo.length, mordeu:!limpo.length && Boolean(queixa), queixa:queixa ?? null});
  }
  return out;
}
