/** N1: os blocos pertencem apenas à primeira página, nas duas edições. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { BLOCOS_DA_PRIMEIRA_PAGINA, ENTRADAS } from '../../src/data/primeira-pagina.mjs';
import { PORTAS_DOS_BLOCOS } from '../../src/lib/assuntos.mjs';
import { SITE_URL } from '../../site.config.mjs';
import { blocoResolvido, textoDosPedacos } from '../../src/lib/primeira-pagina.mjs';
import { REDIRECIONAMENTOS_N1 } from './entradas.mjs';

export function paginasHtml(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const f = path.join(dir, e.name);
    return e.isDirectory() ? paginasHtml(f, base) : e.name.endsWith('.html') ? [path.relative(base, f)] : [];
  });
}
const normal = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
/* A mesma normalização serve o filtro e o corpo. A pastilha é prova, não frase.
   Percorrer os nós evita remover texto por uma expressão que ignore a estrutura. */
const textoSemSelos = (no) => {
  const texto = (n) => {
    if (!n) return '';
    if (n.nodeType === 3) return n.textContent;
    if (n.classList?.contains('src-chip') || ['SCRIPT', 'STYLE'].includes(n.tagName)) return '';
    return (n.childNodes ?? []).map(texto).join('');
  };
  return normal(texto(no));
};
const primeiraDoTexto = (s) => normal(s).split(/(?<=[.!?])\s+/)[0];
const primeiraFrase = (id, lang) => primeiraDoTexto(textoDosPedacos(blocoResolvido(id, lang).frase, lang));

export function conferirBlocosUnicos(dist, trocar = new Map(), { paginas = paginasHtml(dist) } = {}) {
  const erros = [];
  const contas = { paginas: 0, blocos_na_primeira: 0, blocos_fora: 0, titulos_fora: 0, frases_fora: 0, portas_dos_blocos: 0, ligacoes_antigas: 0, cartoes_fora_dos_assuntos: 0 };
  const frases_conferidas = [];
  const nacionais = new Set(ENTRADAS.flatMap((e) => e.seccoes.flatMap((s) => s.cartoes)));
  const frasesDaEdicao = Object.fromEntries(['pt', 'en'].map((lang) => [lang, BLOCOS_DA_PRIMEIRA_PAGINA.map((b) => primeiraFrase(b.id, lang)).filter(Boolean)]));
  for (const rel of paginas) {
    contas.paginas++;
    const texto = trocar.get(rel) ?? fs.readFileSync(path.join(dist, rel), 'utf8');
    const lang = rel.startsWith('en/') ? 'en' : 'pt';
    const titulos = BLOCOS_DA_PRIMEIRA_PAGINA.map((b) => b.titulo[lang]);
    const frases = frasesDaEdicao[lang];
    const root = parse(texto);
    const textoCru = textoSemSelos(root);
    const destinosAntigos = REDIRECIONAMENTOS_N1.map(([origem]) => origem);
    if (!texto.includes('data-bloco') && !texto.includes('data-cartao-medida') && !texto.includes('data-cartao-camaras') && !titulos.some((t) => texto.includes(t)) && !frases.some((f) => textoCru.includes(f)) && !destinosAntigos.some((t) => texto.includes(t))) continue;
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      let url;
      try { url = new URL(href, SITE_URL); } catch { continue; }
      if (url.origin !== new URL(SITE_URL).origin) continue;
      const alvo = url.pathname.replace(/\/+$/, '');
      if (destinosAntigos.includes(alvo)) { contas.ligacoes_antigas++; erros.push(`N1R ${rel}: ligação interna para ${alvo}.`); }
    }
    const assunto = ENTRADAS.some((e) => `${e.rota[lang].replace(/^\//, '')}index.html` === rel);
    for (const cartao of root.querySelectorAll('main article[data-cartao-medida]')) {
      /* As áreas de governo mantêm os seus cartões pelo §3.4 do brief N1. */
      if (nacionais.has(cartao.getAttribute('data-cartao-medida')) && !assunto && !/^(en\/)?areas\//.test(rel)) {
        contas.cartoes_fora_dos_assuntos++;
        erros.push(`N1C ${rel}: cartão nacional inteiro fora da sua página de assunto.`);
      }
    }
    if (root.querySelector('[data-cartao-camaras]') && !['lugares/index.html', 'en/places/index.html'].includes(rel)) erros.push(`N1L ${rel}: cartão das câmaras fora dos lugares.`);
    const primeira = ['index.html', 'en/index.html'].includes(rel);
    const blocos = root.querySelectorAll('[data-bloco]');
    if (primeira) {
      contas.blocos_na_primeira += blocos.length;
      const ids = blocos.map((b) => b.getAttribute('data-bloco'));
      const esperados = BLOCOS_DA_PRIMEIRA_PAGINA.filter((b) => blocoResolvido(b.id, lang).mostra).map((b) => b.id);
      if (JSON.stringify(ids) !== JSON.stringify(esperados)) erros.push(`N1B ${rel}: faltam blocos com condições válidas ou a ordem mudou.`);
      if (new Set(ids).size !== ids.length) erros.push(`N1B ${rel}: um bloco repete-se na primeira página.`);
      for (const bloco of blocos) {
        const id = bloco.getAttribute('data-bloco');
        const declarada = primeiraFrase(id, lang);
        const rendida = primeiraDoTexto(textoSemSelos(bloco.querySelector('[data-bloco-frase]')));
        const igual = declarada === rendida;
        frases_conferidas.push({ id, lang, primeiraFrase: declarada, frase_rendida: rendida, igual });
        if (!igual) erros.push(`N1B ${rel}: primeiraFrase difere da frase rendida de ${id}.`);
        const porta = PORTAS_DOS_BLOCOS[bloco.getAttribute('data-bloco')];
        const entrada = ENTRADAS.find((e) => e.id === porta?.entrada);
        const a = bloco.querySelector('[data-porta-assunto]');
        if (!entrada || a?.getAttribute('href') !== entrada.rota[lang] || a?.textContent.trim() !== `${porta[lang]} →` || a?.parentNode !== bloco.lastElementChild?.lastElementChild) erros.push(`N1B ${rel}: falta a porta final do bloco ${bloco.getAttribute('data-bloco')}.`);
        else contas.portas_dos_blocos++;
      }
    } else {
      contas.blocos_fora += blocos.length;
      if (blocos.length) erros.push(`N1B ${rel}: ${blocos.length} bloco(s) fora da primeira página.`);
      const repetidos = root.querySelectorAll('h1,h2,h3,h4').filter((h) => titulos.includes(h.textContent.trim()));
      contas.titulos_fora += repetidos.length;
      if (repetidos.length) erros.push(`N1B ${rel}: título de bloco fora da primeira página.`);
      const textoDoCorpo = textoSemSelos(root.querySelector('main'));
      const copiadas = frases.filter((f) => textoDoCorpo.includes(f));
      contas.frases_fora += copiadas.length;
      if (copiadas.length) erros.push(`N1B ${rel}: primeira frase de bloco fora da primeira página.`);
    }
  }
  if (!contas.paginas || !fs.existsSync(path.join(dist, 'index.html')) || !fs.existsSync(path.join(dist, 'en/index.html'))) erros.push('N1B: não foram vistas as duas primeiras páginas.');
  return { erros, contas, frases_conferidas };
}
export function plantasDosBlocosUnicos(dist) {
  const home = parse(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'));
  const bloco = home.querySelector('[data-bloco]') ?? parse(`<section data-bloco="${BLOCOS_DA_PRIMEIRA_PAGINA[0].id}"><h2 data-bloco-titulo>${BLOCOS_DA_PRIMEIRA_PAGINA[0].titulo.pt}</h2></section>`).firstChild;
  assert.ok(bloco, 'O conhecido-positivo tem de conter um bloco.');
  const rel = 'emprego/index.html';
  const original = fs.readFileSync(path.join(dist, rel), 'utf8');
  const plantas = [
    ['bloco copiado para outra página de assunto', bloco.outerHTML, /N1B emprego\/index.html: .*bloco\(s\) fora/],
    ['título copiado sem as marcas do bloco', `<h2>${bloco.querySelector('[data-bloco-titulo]').textContent}</h2>`, /N1B emprego\/index.html: título de bloco fora/],
  ].map(([nome, copia, mordida]) => {
    const r = conferirBlocosUnicos(dist, new Map([[rel, original.replace('</main>', `${copia}</main>`)]]), { paginas: [rel] });
    const queixa = r.erros.find((e) => mordida.test(e));
    return { nome, mordeu: Boolean(queixa), queixa: queixa ?? null };
  });
  for (const lang of ['pt', 'en']) {
    const destino = lang === 'pt' ? 'temas/index.html' : 'en/european-union/index.html';
    const homeDaEdicao = parse(fs.readFileSync(path.join(dist, lang === 'pt' ? 'index.html' : 'en/index.html'), 'utf8'));
    const rendida = homeDaEdicao.querySelector(`[data-bloco="${BLOCOS_DA_PRIMEIRA_PAGINA[0].id}"] [data-bloco-frase]`);
    /* A primeira frase de Preços termina num nó de texto, depois do valor com selo.
       Copia-se o HTML rendido até ao primeiro ponto final seguido de espaço. */
    const copiaRendida = `<p>${rendida.innerHTML.split(/(?<=[.!?])\s+/)[0]}</p>`;
    const copiaDaFrase = parse(copiaRendida);
    assert.ok(copiaDaFrase.querySelector('[data-claim]') && copiaDaFrase.querySelector('.src-chip'), 'A cópia tem de levar valor e selo.');
    const frase = primeiraFrase(BLOCOS_DA_PRIMEIRA_PAGINA[0].id, lang);
    assert.equal(textoSemSelos(copiaDaFrase), frase, 'primeiraFrase tem de ser igual à frase rendida.');
    const titulo = BLOCOS_DA_PRIMEIRA_PAGINA[0].titulo[lang];
    for (const [nome, copia, mordida] of [
      ['primeira frase rendida com selo', copiaRendida, 'primeira frase de bloco fora'],
      ['título sem marcas', `<h2>${titulo}</h2>`, 'título de bloco fora'],
      ['ligação antiga relativa', '<a href="/o-meu-dinheiro/">Porta antiga</a>', 'N1R'],
      ['ligação antiga absoluta', `<a href="${new URL('/o-meu-dinheiro/', SITE_URL).href}">Porta antiga</a>`, 'N1R'],
    ]) {
      /* Só a cópia tem conteúdo: a planta da frase tem de atravessar o filtro de texto cru. */
      const r = conferirBlocosUnicos(dist, new Map([[destino, `<html><main>${copia}</main></html>`]]), { paginas: [destino] });
      const queixa = r.erros.find((e) => e.includes(destino) && e.includes(mordida));
      plantas.push({ nome: `${nome} (${lang})`, mordeu: Boolean(queixa), queixa: queixa ?? null, ...(nome.startsWith('primeira frase') ? { primeiraFrase: frase, frase_rendida: textoSemSelos(copiaDaFrase), iguais: textoSemSelos(copiaDaFrase) === frase, com_selo: true } : {}) });
    }
  }
  return plantas;

}
