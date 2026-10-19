/** V2-c: posição no HTML, ordem das secções e portas de um toque. */
import fs from 'node:fs';
import { parse } from 'node-html-parser';
const [saida] = process.argv.slice(2);
const edicoes = ['pt','en'].map(lang => {
  const html = fs.readFileSync(`dist/${lang === 'pt' ? '' : 'en/'}index.html`, 'utf8');
  const root = parse(html), bloco = root.querySelector('[data-discussao-inicio]');
  const pagina = lang === 'pt' ? '/o-que-se-discute' : '/en/under-discussion';
  const alvo = parse(fs.readFileSync(`dist${pagina}/index.html`, 'utf8'));
  const itens = bloco.querySelectorAll('[data-discussao-porta]').map(a => {
    const href = a.getAttribute('href'), [rota, id] = href.split('#');
    return {titulo:a.text.trim(), href, um_toque:rota.replace(/\/$/,'') === pagina && !!alvo.querySelector(`[id="${id}"]`)};
  });
  const marcas = Object.fromEntries(['data-o-que-se-passa','data-discussao-inicio','data-entradas'].map(m => [m,html.indexOf(m)]));
  return {lang,caracter:html.lastIndexOf('<section',marcas['data-discussao-inicio']),marca:marcas['data-discussao-inicio'],total:html.length,
    seccoes:root.querySelectorAll('main > section').map(s => s.querySelector('h2')?.text.trim() ?? null),marcas,
    ordem_anterior:Object.values(marcas).every(n=>n>=0) && marcas['data-o-que-se-passa'] < marcas['data-discussao-inicio'] && marcas['data-discussao-inicio'] < marcas['data-entradas'],
    ordem_nova:Object.values(marcas).every(n=>n>=0) && marcas['data-discussao-inicio'] < marcas['data-o-que-se-passa'] && marcas['data-o-que-se-passa'] < marcas['data-entradas'],
    itens,h2_um_toque:bloco.querySelector('h2 a')?.getAttribute('href').replace(/\/$/,'') === pagina,
    menu_um_toque:root.querySelectorAll('#nav-principal a').some(a=>a.getAttribute('href').replace(/\/$/,'')===pagina)};
});
fs.writeFileSync(saida,JSON.stringify({cabeca:JSON.parse(fs.readFileSync('dist/version.json')).commit,edicoes},null,2)+'\n');
console.log(JSON.stringify(edicoes.map(({lang,caracter,total,ordem_anterior,ordem_nova})=>({lang,caracter,total,ordem_anterior,ordem_nova}))));
