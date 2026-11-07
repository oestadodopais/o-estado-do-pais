import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { MARCAS_DE_AUSENCIA, eMarcaDeAusencia } from '../src/lib/marcas-de-ausencia.mjs';
import { unidadeDaLinha } from '../src/i18n/unidades.mjs';
import { caminhoDaLinha } from '../src/lib/livro.mjs';

const escapar = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function reguaDasUnidades(linhas) {
  const unidades = new Set();
  for (const c of linhas) {
    if (['texto', 'afirmação', 'data'].includes(c.unit)) continue;
    for (const u of [c.unit, unidadeDaLinha(c.unit, 'pt').texto, unidadeDaLinha(c.unit, 'en').texto]) {
      if (u) unidades.add(u);
    }
  }
  return new RegExp(`(?:${MARCAS_DE_AUSENCIA.map(escapar).join('|')})\\s*(?:${[...unidades].sort((a,b) => b.length-a.length).map(escapar).join('|')})(?![\\p{L}\\p{N}])`, 'u');
}

export function marcaSeguidaDeUnidade(html, regua) {
  // Duas leituras: atributos e texto, incluindo o HTML escapado do textarea.
  const literal = parse(`<textarea>${html.replaceAll('</textarea>', '&lt;/textarea&gt;')}</textarea>`, { blockTextElements: { textarea: true } }).textContent;
  return regua.test(literal) || regua.test(parse(literal).textContent);
}

export function conferirLinhas(linhas) {
  return linhas.filter(c => !['texto', 'afirmação', 'data'].includes(c.unit)
    && !/[0-9]/.test(String(c.value)) && !eMarcaDeAusencia(c.value))
    .map(c => `ND1 marca desconhecida: ${c.id} (${c.value})`);
}

export function conferirRecibo(html, c, lang) {
  if (!eMarcaDeAusencia(c.value)) return [];
  const root = parse(html), erros = [];
  const valor = root.querySelector('.linha-valor');
  if (!valor || valor.querySelector('[data-linha-campo="unit"], .linha-valor-unidade')) erros.push('ND1 unidade no valor do recibo');
  const frase = valor?.querySelector('[data-nd1-ausencia]');
  // A natureza vem da linha do livro, independentemente do renderizador.
  const calculada = Array.isArray(c.derived_from) && c.derived_from.length > 0;
  const esperada = calculada
    ? (lang === 'pt' ? `Não se calcula: a fonte publica «${c.value}» nos valores de que depende.` : `Not calculated: the source publishes «${c.value}» for the values it depends on.`)
    : (lang === 'pt' ? `A fonte publica «${c.value}» em vez de um valor.` : `The source publishes «${c.value}» instead of a value.`);
  if (!frase || frase.textContent !== esperada) erros.push('ND1 frase ausente ou diferente');
  if (lang === 'en' && frase?.querySelector('[lang="pt-PT"]')?.textContent !== c.value) erros.push('ND1 marca sem língua portuguesa');
  return erros;
}

export function medirDist(dist, linhas) {
  const regua = reguaDasUnidades(linhas), paginasComUnidade = [], erros = conferirLinhas(linhas);
  let paginas = 0, paginasComMarca = 0, recibos = 0;
  function visitar(pasta) {
    for (const entrada of fs.readdirSync(pasta, { withFileTypes: true })) {
      const ficheiro = path.join(pasta, entrada.name);
      if (entrada.isDirectory()) visitar(ficheiro);
      else if (entrada.name.endsWith('.html')) {
        paginas++;
        const html = fs.readFileSync(ficheiro, 'utf8');
        if (!MARCAS_DE_AUSENCIA.some(m => html.includes(m))) continue;
        paginasComMarca++;
        if (marcaSeguidaDeUnidade(html, regua)) paginasComUnidade.push(path.relative(dist, ficheiro));
      }
    }
  }
  visitar(dist);
  for (const c of linhas.filter(c => eMarcaDeAusencia(c.value))) for (const lang of ['pt', 'en']) {
    const rota = caminhoDaLinha(c.id, lang);
    const ficheiro = path.join(dist, rota, 'index.html');
    recibos++;
    if (!fs.existsSync(ficheiro)) erros.push(`ND1 recibo em falta: ${rota}`);
    else erros.push(...conferirRecibo(fs.readFileSync(ficheiro, 'utf8'), c, lang).map(e => `${rota}: ${e}`));
  }
  erros.push(...paginasComUnidade.map(p => `ND1 marca seguida de unidade: ${p}`));
  return { paginas, paginasComMarca, recibos, paginasComUnidade, erros };
}
