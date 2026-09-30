/** N1: os blocos pertencem apenas à primeira página, nas duas edições. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { BLOCOS_DA_PRIMEIRA_PAGINA, ENTRADAS } from '../../src/data/primeira-pagina.mjs';
import { PORTAS_DOS_BLOCOS } from '../../src/lib/assuntos.mjs';
import { blocoResolvido } from '../../src/lib/primeira-pagina.mjs';
import { REDIRECIONAMENTOS_N1 } from './entradas.mjs';

export function paginasHtml(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const f = path.join(dir, e.name);
    return e.isDirectory() ? paginasHtml(f, base) : e.name.endsWith('.html') ? [path.relative(base, f)] : [];
  });
}
export function conferirBlocosUnicos(dist, trocar = new Map()) {
  const erros = [];
  const contas = { paginas: 0, blocos_na_primeira: 0, blocos_fora: 0, titulos_fora: 0, portas_dos_blocos: 0, ligacoes_antigas: 0, cartoes_fora_dos_assuntos: 0 };
  const nacionais = new Set(ENTRADAS.flatMap((e) => e.seccoes.flatMap((s) => s.cartoes)));
  for (const rel of paginasHtml(dist)) {
    contas.paginas++;
    const texto = trocar.get(rel) ?? fs.readFileSync(path.join(dist, rel), 'utf8');
    const lang = rel.startsWith('en/') ? 'en' : 'pt';
    const titulos = BLOCOS_DA_PRIMEIRA_PAGINA.map((b) => b.titulo[lang]);
    const destinosAntigos = REDIRECIONAMENTOS_N1.map(([origem]) => origem);
    if (!texto.includes('data-bloco') && !texto.includes('data-cartao-medida') && !texto.includes('data-cartao-camaras') && !titulos.some((t) => texto.includes(t)) && !destinosAntigos.some((t) => texto.includes(t))) continue;
    const root = parse(texto);
    for (const a of root.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (!href.startsWith('/')) continue;
      const alvo = href.split(/[?#]/)[0].replace(/\/+$/, '');
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
    }
  }
  if (!contas.paginas || !fs.existsSync(path.join(dist, 'index.html')) || !fs.existsSync(path.join(dist, 'en/index.html'))) erros.push('N1B: não foram vistas as duas primeiras páginas.');
  return { erros, contas };
}
export function plantasDosBlocosUnicos(dist) {
  const home = parse(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'));
  const bloco = home.querySelector('[data-bloco]') ?? parse(`<section data-bloco="${BLOCOS_DA_PRIMEIRA_PAGINA[0].id}"><h2 data-bloco-titulo>${BLOCOS_DA_PRIMEIRA_PAGINA[0].titulo.pt}</h2></section>`).firstChild;
  assert.ok(bloco, 'O conhecido-positivo tem de conter um bloco.');
  const rel = 'emprego/index.html';
  const original = fs.readFileSync(path.join(dist, rel), 'utf8');
  return [
    ['bloco copiado para outra página de assunto', bloco.outerHTML, /N1B emprego\/index.html: .*bloco\(s\) fora/],
    ['título copiado sem as marcas do bloco', `<h2>${bloco.querySelector('[data-bloco-titulo]').textContent}</h2>`, /N1B emprego\/index.html: título de bloco fora/],
  ].map(([nome, copia, mordida]) => {
    const r = conferirBlocosUnicos(dist, new Map([[rel, original.replace('</main>', `${copia}</main>`)]]));
    const queixa = r.erros.find((e) => mordida.test(e));
    return { nome, mordeu: Boolean(queixa), queixa: queixa ?? null };
  });
}
