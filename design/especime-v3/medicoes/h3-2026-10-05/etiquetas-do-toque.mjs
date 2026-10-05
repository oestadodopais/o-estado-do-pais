/** H3: as etiquetas do toque da página da União, uma a uma, contra a largura da janela e a caixa do desenho, nas cinco
 * larguras da casa e nas duas edições.
 *
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/h3-2026-10-05/etiquetas-do-toque.mjs <rótulo>
 *   (sobre `dist/`, que tem de ser a construção da cabeça atual; o guião confere o `version.json`; o rótulo dá o nome
 *   ao ficheiro que escreve, `etiquetas-do-toque-<rótulo>.json`)
 *
 * PORQUE EXISTE. O H3 pôs em cada etiqueta os nomes de todos os países com o mesmo valor, e uma etiqueta de grupo é mais
 * comprida do que a de um país. Até à emenda do H3, as etiquetas não dobravam (`white-space: nowrap`) e ancoravam-se pela
 * posição da marca (pelo meio, ou pela ponta mais perto abaixo de 15 % e acima de 85 %), e não pelo comprimento: a
 * 390 px, uma etiqueta comprida passava a margem da janela, e o começo ou o fim ficavam cortados. Este guião mede quantas
 * etiquetas passam a margem da janela quando se mostram, quantas passam a caixa do desenho, quantas acrescentam rolagem
 * à página, quantas não cobrem a sua marca na horizontal, e quantas linhas ocupa cada uma. Mostra cada etiqueta
 * tirando-lhe o `hidden`, como o guião do toque faz, mede a caixa que o navegador desenhou, e volta a escondê-la.
 *
 * O CONHECIDO-POSITIVO CORRE PRIMEIRO, em cada página: uma etiqueta com tantos «x» a mais como metade dos píxeis da
 * janela, posta à força numa linha só e no meio do desenho como estava antes da emenda, tem de ser vista a passar a margem pelo mesmo detetor; se
 * não for, o guião sai com 2 e não diz «nenhuma».
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const rotulo = process.argv[2];
if (!rotulo || !/^[a-z0-9-]+$/.test(rotulo)) throw new Error('uso: etiquetas-do-toque.mjs <rótulo>');
const pasta = 'design/especime-v3/medicoes/h3-2026-10-05';
const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' });
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const paginas = { pt: '/uniao-europeia/', en: '/en/european-union/' };
const larguras = [390, 768, 1024, 1280, 1600];
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    const url = new URL(pedido.url, 'http://localhost');
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch {
    resposta.writeHead(404).end();
  }
});
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const saida = { guiao: `${pasta}/etiquetas-do-toque.mjs`, rotulo, cabeca, arvore_limpa: estado === '', construcao: versao.commit, larguras, medidas: [] };
let positivoVisto = true;
try {
  for (const largura of larguras) {
    for (const lang of ['pt', 'en']) {
      const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : rota.abort()));
      const page = await c.newPage();
      await page.goto(origem + paginas[lang], { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => {
        const janela = document.documentElement.clientWidth;
        const decimo = (n) => Math.round(n * 10) / 10;
        const mede = (e) => {
          e.hidden = false;
          const caixa = e.getBoundingClientRect();
          const desenho = e.closest('[data-toques]').getBoundingClientRect();
          const id = e.getAttribute('data-toque-de');
          const marca = [...e.closest('[data-toques]').querySelectorAll('[data-faixa-marca]')].find((m) => m.getAttribute('data-faixa-marca') === id);
          const m = marca?.getBoundingClientRect();
          const centroDaMarca = m ? m.left + m.width / 2 : null;
          const linha = parseFloat(getComputedStyle(e).lineHeight) || 16;
          const rolagem = document.documentElement.scrollWidth;
          e.hidden = true;
          return {
            de: id,
            ancora: e.getAttribute('data-ancora'),
            paises: e.querySelectorAll('[data-pais]').length,
            texto: e.textContent.replace(/\s+/g, ' ').trim(),
            largura: decimo(caixa.width),
            largura_do_desenho: decimo(desenho.width),
            linhas: Math.round(caixa.height / linha),
            fora_da_janela: decimo(Math.max(0, -caixa.left, caixa.right - janela)),
            fora_do_desenho: decimo(Math.max(0, desenho.left - caixa.left, caixa.right - desenho.right)),
            nao_cobre_a_marca: centroDaMarca === null ? null : centroDaMarca < caixa.left - 0.5 || centroDaMarca > caixa.right + 0.5,
            rolagem_a_mais: Math.max(0, rolagem - janela),
          };
        };
        /* o conhecido-positivo: uma cópia da primeira etiqueta, posta no mesmo desenho, com tantos «x» a mais como metade
           dos píxeis da janela (mais larga do que a janela), numa linha só e no meio, medida e tirada; a etiqueta verdadeira
           não se toca */
        const original = document.querySelector('[data-paises] [data-toque-de]');
        const prova = original.cloneNode(true);
        prova.removeAttribute('data-toque-de');
        prova.insertAdjacentText('beforeend', ' ' + 'x'.repeat(Math.ceil(janela / 2)));
        prova.style.whiteSpace = 'nowrap';
        prova.style.maxWidth = 'none';
        prova.style.left = '50%';
        prova.style.transform = 'translateX(-50%)';
        original.parentNode.appendChild(prova);
        prova.hidden = false;
        const caixaDaProva = prova.getBoundingClientRect();
        const positivo = { fora_da_janela: decimo(Math.max(0, -caixaDaProva.left, caixaDaProva.right - janela)) };
        prova.remove();
        const todas = [...document.querySelectorAll('[data-paises] [data-toque-de]')].map(mede);
        return { janela, positivo, todas };
      });
      if (!(r.positivo.fora_da_janela > 0)) positivoVisto = false;
      const fora = r.todas.filter((x) => x.fora_da_janela > 0);
      saida.medidas.push({
        largura,
        lang,
        janela: r.janela,
        conhecido_positivo_visto: r.positivo.fora_da_janela > 0,
        etiquetas: r.todas.length,
        etiquetas_de_grupo: r.todas.filter((x) => x.paises > 1).length,
        fora_da_janela: fora.length,
        fora_da_janela_de_grupo: fora.filter((x) => x.paises > 1).length,
        maior_saida_da_janela_px: fora.length ? Math.max(...fora.map((x) => x.fora_da_janela)) : 0,
        fora_do_desenho: r.todas.filter((x) => x.fora_do_desenho > 0).length,
        com_rolagem_a_mais: r.todas.filter((x) => x.rolagem_a_mais > 0).length,
        que_nao_cobrem_a_marca: r.todas.filter((x) => x.nao_cobre_a_marca === true).length,
        sem_marca: r.todas.filter((x) => x.nao_cobre_a_marca === null).length,
        com_mais_de_uma_linha: r.todas.filter((x) => x.linhas > 1).length,
        maior_etiqueta_px: Math.max(...r.todas.map((x) => x.largura)),
        desenho_mais_estreito_px: Math.min(...r.todas.map((x) => x.largura_do_desenho)),
        as_que_passam_a_janela: fora,
        as_de_mais_de_uma_linha: r.todas.filter((x) => x.linhas > 1),
        as_que_nao_cobrem_a_marca: r.todas.filter((x) => x.nao_cobre_a_marca !== false),
      });
      const u = saida.medidas.at(-1);
      await c.close();
      console.log(`H3 etiquetas (${rotulo}) a ${largura} px, ${lang}: ${u.etiquetas} etiqueta(s), ${u.fora_da_janela} a passar a janela (${u.fora_da_janela_de_grupo} de grupo), ${u.fora_do_desenho} a passar o desenho, ${u.com_rolagem_a_mais} com rolagem, ${u.que_nao_cobrem_a_marca} sem cobrir a marca, ${u.com_mais_de_uma_linha} em mais de uma linha; desenho de ${u.desenho_mais_estreito_px} px, a maior etiqueta ${u.maior_etiqueta_px} px; conhecido-positivo ${u.conhecido_positivo_visto ? 'visto' : 'NÃO visto'}.`);
    }
  }
} finally {
  await navegador.close();
  servidor.close();
}
await fs.writeFile(path.join(pasta, `etiquetas-do-toque-${rotulo}.json`), JSON.stringify(saida, null, 2) + '\n');
process.exit(positivoVisto ? 0 : 2);
