/**
 * RP4-c: as marcas dos desenhos das séries numa construção, lidas do HTML do `dist/` (os pontos 1 e 2 do mandato). Não
 * escreve no `dist/`. Para cada página com desenhos `serie-do-pais`, e para cada desenho: a série, a largura do desenho,
 * as etiquetas do eixo do tempo e as do eixo dos valores, pela ordem do documento; e no total: as marcas dos valores
 * com o símbolo «%» (depois do espaço inquebrável), as marcas com o símbolo do euro, os desenhos com a legenda da
 * unidade por extenso e o texto de cada uma, e as zonas de leitura. Corre sobre a construção de antes e sobre a de
 * depois, e os dois registos comparam-se no `medir.py`.
 *
 * O conhecido-positivo: a primeira página tem de ter um desenho, e o recibo da inflação também; e a mesma leitura das
 * etiquetas tem de achar «1992» no eixo do tempo do desenho da primeira página.
 *
 * Uso: node design/especime-v3/medicoes/rp4c-2026-10-05/medir-marcas.mjs --dist <pasta do dist> --json <saída> [--rotulo <o que é a construção>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const argumento = (nome) => { const i = process.argv.indexOf(nome); return i > 1 ? process.argv[i + 1] : null; };
const DIST = path.resolve(argumento('--dist') ?? 'dist');
const SAIDA = argumento('--json');
if (!SAIDA) throw Error('falta --json <saída>');
const versao = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
const paginas = [];
const anda = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) anda(f);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(f, 'utf8');
      if (!html.includes('data-forma="serie-do-pais"')) continue;
      const root = parse(html);
      const desenhos = root.querySelectorAll('svg[data-forma="serie-do-pais"]').map((svg) => ({
        series: svg.getAttribute('data-series'),
        modo: svg.getAttribute('data-modo'),
        largura: Number(String(svg.getAttribute('viewBox')).split(' ')[2]),
        tempo: svg.querySelectorAll('[data-eixo="tempo"] text').map((t) => t.textContent),
        valor: svg.querySelectorAll('[data-eixo="valor"] text').map((t) => t.textContent),
        zonas: svg.querySelectorAll('[data-ponto-periodo]').length,
        legenda: svg.parentNode?.querySelector(`[data-serie-unidade-legenda="${svg.getAttribute('data-series')}"]`)?.textContent?.trim() ?? null,
      }));
      paginas.push({ pagina: path.relative(DIST, f).split(path.sep).join('/'), desenhos });
    }
  }
};
anda(DIST);
paginas.sort((a, b) => a.pagina.localeCompare(b.pagina));
const todos = paginas.flatMap((p) => p.desenhos.map((d) => ({ pagina: p.pagina, ...d })));
const marcas = todos.flatMap((d) => d.valor);
const primeira = paginas.find((p) => p.pagina === 'index.html')?.desenhos[0] ?? null;
const cartaoDaInflacao = paginas.find((p) => p.pagina === 'precos/index.html')?.desenhos.find((d) => d.series === 'serie-ipc-variacao-homologa') ?? null;
const reciboDaInflacao = paginas.find((p) => p.pagina === 'livro-razao/series/serie-ipc-variacao-homologa/index.html')?.desenhos[0] ?? null;
const saida = {
  construcao: argumento('--rotulo') ?? 'o dist/ da worktree do bloco',
  dist_commit: versao.commit,
  construido_em: versao.construido_em,
  paginas_com_desenhos: paginas.length,
  desenhos: todos.length,
  marcas_dos_valores: marcas.length,
  marcas_dos_valores_com_percentagem: marcas.filter((m) => /\d %$/.test(m)).length,
  marcas_dos_valores_com_euro: marcas.filter((m) => /€/.test(m)).length,
  marcas_do_zero_sem_simbolo: marcas.filter((m) => m === '0').length,
  desenhos_com_legenda_da_unidade: todos.filter((d) => d.legenda).length,
  desenhos_em_euros_com_legenda: todos.filter((d) => /euro/.test(d.legenda ?? '')).length,
  legendas_distintas: [...new Set(todos.map((d) => d.legenda).filter(Boolean))].sort(),
  zonas_de_leitura: todos.reduce((n, d) => n + d.zonas, 0),
  desenhos_com_zonas: todos.filter((d) => d.zonas).length,
  desenhos_indexados: todos.filter((d) => d.modo === 'indice').length,
  desenhos_indexados_com_zonas: todos.filter((d) => d.modo === 'indice' && d.zonas).length,
  tempo_da_primeira_pagina: primeira?.tempo ?? null,
  valor_da_primeira_pagina: primeira?.valor ?? null,
  tempo_do_cartao_da_inflacao: cartaoDaInflacao?.tempo ?? null,
  tempo_do_recibo_da_inflacao: reciboDaInflacao?.tempo ?? null,
  etiquetas_do_tempo: todos.reduce((n, d) => n + d.tempo.length, 0),
  conhecido_positivo_primeira_pagina_tem_1992: Boolean(primeira?.tempo.includes('1992')),
  conhecido_positivo_recibo_da_inflacao: Boolean(reciboDaInflacao),
  paginas,
};
fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 2) + '\n');
console.log(`${paginas.length} páginas · ${todos.length} desenhos · ${marcas.length} marcas dos valores (${saida.marcas_dos_valores_com_percentagem} com «%», ${saida.marcas_dos_valores_com_euro} com «€») · ${saida.desenhos_com_legenda_da_unidade} legendas · ${saida.zonas_de_leitura} zonas · primeira página: ${(primeira?.tempo ?? []).join(', ')}`);
