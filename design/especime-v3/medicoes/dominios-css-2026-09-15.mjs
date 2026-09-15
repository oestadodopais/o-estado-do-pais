#!/usr/bin/env node
/**
 * A RÉGUA DA FATIA DE 15.09.2026 · o índice dos domínios e a linha da busca.
 *
 * ---------------------------------------------------------------------------
 * O QUE MEDE, E PORQUÊ CADA COISA
 * ---------------------------------------------------------------------------
 * O diretor leu duas coisas na primeira página, no telemóvel, na cabeça
 * 44f0d838: «2. Trabalhoas medidas estão em Economia e finanças públicas», e um
 * campo de busca do tamanho de quatro caracteres ao lado de um botão grande.
 *
 *   · O ÍNDICE DOS DOMÍNIOS, em `/`, `/en/`, `/dominios` e `/en/domains`: o
 *     `display` e o `gap` do item, o marcador do `<ol>`, o corpo e o tipo do
 *     estado, e a FOLGA entre a caixa do nome e a caixa do estado, que é o
 *     número que diz se as duas palavras se tocam. Mais a altura da página e o
 *     topo da secção, para provar que o primeiro ecrã a 390 não muda.
 *   · A LINHA DA BUSCA, nas seis rotas que a rendem: a largura do campo, a da
 *     linha e a do botão, e o `scrollWidth` do documento contra a largura da
 *     janela, que é o transbordo horizontal.
 *
 * AS DUAS EDIÇÕES, E NÃO SÓ A PORTUGUESA (achado 5 da leitura a frio do Codex à
 * fatia, 15.09.2026). A primeira redação desta régua listava só rotas
 * portuguesas para a busca, e o brief pedia o resultado nas duas: uma medição
 * que não corre na edição inglesa não prova nada sobre a edição inglesa, e o
 * rótulo do botão e o do campo não medem o mesmo nas duas línguas.
 *
 * As larguras da busca são 320, 390, 768, 1 280 e 1 600: 320 porque é onde o
 * campo empurrava a página em 09.09 e é a razão de o `size` ter descido a 4, e
 * 1 600 porque é onde se vê se o teto da linha (`max-width: 36rem`, decidido
 * pelo lugar de direção a 15.09 depois da primeira medição) prende. A régua
 * guarda o `rem` da casa medido em píxeis e o `max-width` calculado, para que
 * 36rem não seja um número dito.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTA RÉGUA RECUSA MEDIR (achado 8 da mesma leitura)
 * ---------------------------------------------------------------------------
 * A primeira redação pedia a página e media o que encontrasse. Um `dist/` sem
 * uma das rotas devolvia 404, cada selector devolvia `null`, e a régua imprimia
 * os `null` ao lado dos números: «linha=null campo=null». Um `null` impresso
 * numa coluna de medidas lê-se como um resultado, e não é um; é a régua a não
 * ter medido nada e a não o dizer.
 *
 * Passam a existir duas paragens, e as duas matam a corrida com o que falta
 * dito por extenso. `abre()` exige que a resposta da rota seja 200. `exige()`
 * exige que cada coisa que a régua diz que mediu exista. O que é legitimamente
 * ausente numa rota declara-se ao lado dela (`temLinha: false` para a variante
 * sem formulário, que não tem linha nem botão), e é a declaração que o diz, não
 * o silêncio.
 *
 * ---------------------------------------------------------------------------
 * COMO SE CORRE
 * ---------------------------------------------------------------------------
 *     OEDP_DIST=/caminho/dist node design/especime-v3/medicoes/dominios-css-2026-09-15.mjs \
 *       --json saida.json --capturas <directório> --momento antes|depois
 *
 * Abre um navegador, e por isso NÃO está no `verify` nem na CI: corre-se à mão,
 * como as outras medições de 390 px destes blocos. Sai com 1 se alguma paragem
 * morder.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.resolve(process.env.OEDP_DIST ?? 'dist');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.csv': 'text/csv; charset=utf-8',
};

const arg = (nome) => {
  const i = process.argv.indexOf(nome);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
};
const CAPTURAS = arg('--capturas');
const MOMENTO = arg('--momento') ?? 'agora';

const servidor = http.createServer((req, res) => {
  const so = req.url.split('?')[0];
  let rel;
  try {
    rel = decodeURIComponent(so);
  } catch {
    rel = so;
  }
  let f = path.resolve(DIST, '.' + rel);
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

/** O que faltou. Uma linha aqui e a corrida sai com 1. */
const mortes = [];

/** Pede a rota e exige 200. Devolve `false` quando não há nada para medir. */
async function abre(pagina, rota) {
  const r = await pagina.goto(`${base}${rota}`, { waitUntil: 'networkidle' });
  const estado = r === null ? 'sem resposta' : r.status();
  if (estado !== 200) {
    mortes.push(`${rota} respondeu ${estado} e não 200: não há nada para medir nesta rota.`);
    return false;
  }
  return true;
}

/** Exige que cada coisa medida exista. Um `null` é uma falha dita. */
function exige(valores, onde) {
  for (const [nome, v] of Object.entries(valores)) {
    if (v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v))) {
      mortes.push(`${onde}: «${nome}» não existe na página, e a régua diz que o mede.`);
    }
  }
}

const navegador = await chromium.launch({ headless: true });
const saida = { dominios: {}, busca: {} };

/* ===================================================== o índice dos domínios */

const ROTAS_DOM = ['/', '/en/', '/dominios/', '/en/domains/'];
const LARGURAS_DOM = [390, 1280];
for (const rota of ROTAS_DOM) {
  saida.dominios[rota] = {};
  for (const largura of LARGURAS_DOM) {
    const p = await navegador.newPage({ viewport: { width: largura, height: 664 } });
    if (!(await abre(p, rota))) {
      await p.close();
      continue;
    }
    const m = await p.evaluate(() => {
      const css = (el, ...props) => {
        if (!el) return null;
        const c = getComputedStyle(el);
        const o = {};
        for (const pr of props) o[pr] = c[pr];
        return o;
      };
      const lista = document.querySelector('ol.dominios-lista');
      const item = document.querySelector('li.dominios-item');
      const nome = item ? item.querySelector('.dominios-nome') : null;
      const estado = item ? item.querySelector('.dominios-estado') : null;
      const seccao = document.querySelector('.dominios-secao');
      let folga = null;
      if (nome && estado) {
        const a = nome.getBoundingClientRect();
        const b = estado.getBoundingClientRect();
        folga = Math.round((b.left - a.right) * 10) / 10;
      }
      return {
        folhas: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) =>
          l.getAttribute('href'),
        ),
        altura_pagina: document.documentElement.scrollHeight,
        /* A secção só existe na primeira página: em `/dominios` a lista é a
           página. Declarado abaixo, e não deixado a `null` em silêncio. */
        seccao_topo: seccao
          ? Math.round((seccao.getBoundingClientRect().top + window.scrollY) * 10) / 10
          : null,
        lista: css(lista, 'listStyleType'),
        item: css(item, 'display', 'columnGap', 'rowGap', 'minHeight'),
        nome: css(nome, 'fontFamily', 'fontSize'),
        estado: css(estado, 'fontFamily', 'fontSize', 'color'),
        item_texto: item ? item.textContent.replace(/\s+/g, ' ').trim() : null,
        item_texto_cru: item ? item.textContent : null,
        ultimo_item_texto: (() => {
          const todos = document.querySelectorAll('li.dominios-item');
          const u = todos[todos.length - 1];
          return u ? u.textContent.replace(/\s+/g, ' ').trim() : null;
        })(),
        n_itens: document.querySelectorAll('li.dominios-item').length,
        folga_nome_estado: folga,
      };
    });
    const onde = `${rota} @${largura}`;
    exige(
      {
        lista: m.lista,
        item: m.item,
        nome: m.nome,
        estado: m.estado,
        folga_nome_estado: m.folga_nome_estado,
        item_texto: m.item_texto,
        ultimo_item_texto: m.ultimo_item_texto,
      },
      onde,
    );
    if (m.n_itens === 0) mortes.push(`${onde}: a lista dos domínios não tem uma linha sequer.`);
    /* A secção `.dominios-secao` existe na primeira página e em mais lado
       nenhum: é lá que ela embrulha a lista, e é lá que o primeiro ecrã se
       mede. Exigida onde tem de existir, e não exigida onde não existe. */
    if ((rota === '/' || rota === '/en/') && m.seccao_topo === null) {
      mortes.push(`${onde}: a secção dos domínios não existe na primeira página.`);
    }
    saida.dominios[rota][largura] = m;
    if (CAPTURAS && rota === '/') {
      fs.mkdirSync(CAPTURAS, { recursive: true });
      const el = await p.$('.dominios-secao');
      if (el) await el.screenshot({ path: path.join(CAPTURAS, `dominios-${largura}-${MOMENTO}.png`) });
    }
    await p.close();
  }
}

/* ============================================================= a busca */

/* AS ROTAS QUE RENDEM A CAIXA, nas duas edições. A caixa é uma só (F1.10,
   §2.6), e uma correção na folha dela chega a todas. `temLinha: false` é a
   variante sem formulário, que é um rótulo e um campo e mais nada: não tem
   `.busca-linha` nem `.busca-submeter`, e por isso não leva teto. */
const ROTAS_BUSCA = [
  { rota: '/', temLinha: true },
  { rota: '/en/', temLinha: true },
  { rota: '/municipios/', temLinha: true },
  { rota: '/en/municipalities/', temLinha: true },
  { rota: '/livro-razao/', temLinha: true },
  { rota: '/livro-razao/concelhos/', temLinha: false },
];
const LARGURAS_BUSCA = [320, 390, 768, 1280, 1600];
for (const { rota, temLinha } of ROTAS_BUSCA) {
  saida.busca[rota] = {};
  for (const largura of LARGURAS_BUSCA) {
    const p = await navegador.newPage({ viewport: { width: largura, height: 664 } });
    if (!(await abre(p, rota))) {
      await p.close();
      continue;
    }
    const m = await p.evaluate(() => {
      const larg = (el) => (el ? Math.round(el.getBoundingClientRect().width * 10) / 10 : null);
      const linha = document.querySelector('.busca-linha');
      const campo = document.querySelector('.busca-campo');
      const botao = document.querySelector('.busca-submeter');
      return {
        rem_px: parseFloat(getComputedStyle(document.documentElement).fontSize),
        linha_max_width: linha ? getComputedStyle(linha).maxWidth : null,
        linha: larg(linha),
        campo: larg(campo),
        botao: larg(botao),
        campo_size: campo ? campo.getAttribute('size') : null,
        campo_width_css: campo ? getComputedStyle(campo).width : null,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    const onde = `${rota} @${largura}`;
    exige({ campo: m.campo, campo_size: m.campo_size, rem_px: m.rem_px }, onde);
    if (temLinha) exige({ linha: m.linha, botao: m.botao, teto: m.linha_max_width }, onde);
    else if (m.linha !== null) mortes.push(`${onde}: declarada sem linha e tem uma.`);
    saida.busca[rota][largura] = m;
    if (CAPTURAS && [390, 1280].includes(largura)) {
      fs.mkdirSync(CAPTURAS, { recursive: true });
      const el = await p.$('.busca');
      const nome = 'busca' + (rota === '/' ? '-inicio' : rota.replace(/\/$/, '').replace(/\//g, '-'));
      if (el) await el.screenshot({ path: path.join(CAPTURAS, `${nome}-${largura}-${MOMENTO}.png`) });
    }
    await p.close();
  }
}

await navegador.close();
servidor.close();

const saidaJson = arg('--json');
if (saidaJson) {
  fs.writeFileSync(saidaJson, JSON.stringify(saida, null, 2));
  console.log(`escrito: ${saidaJson}`);
}

if (mortes.length) {
  console.error(`\n  A RÉGUA NÃO MEDIU · ${mortes.length} coisa(s) em falta\n`);
  for (const m of mortes) console.error(`    · ${m}`);
  console.error('');
  process.exit(1);
}

console.log('\n== o índice dos domínios ==');
for (const rota of ROTAS_DOM) {
  for (const largura of LARGURAS_DOM) {
    const m = saida.dominios[rota][largura];
    console.log(
      `${rota} @${largura}  itens=${m.n_itens}  altura=${m.altura_pagina}  ` +
        `topo=${m.seccao_topo ?? 'não tem secção'}  gap=${m.item.columnGap}/${m.item.rowGap}  ` +
        `display=${m.item.display}  marcador=${m.lista.listStyleType}  ` +
        `estado=${m.estado.fontSize} ${m.estado.fontFamily.split(',')[0]}  ` +
        `folga=${m.folga_nome_estado}`,
    );
    if (largura === 390) {
      console.log(`         1.ª: «${m.item_texto.slice(0, 64)}»`);
      console.log(`         2.ª: «${m.ultimo_item_texto.slice(0, 64)}»`);
    }
  }
}
console.log('\n== a linha da busca ==');
for (const { rota, temLinha } of ROTAS_BUSCA) {
  for (const largura of LARGURAS_BUSCA) {
    const m = saida.busca[rota][largura];
    console.log(
      `${rota} @${largura}  linha=${temLinha ? m.linha : 'não tem'}  campo=${m.campo}  ` +
        `botao=${temLinha ? m.botao : 'não tem'}  size=${m.campo_size}  ` +
        `teto=${temLinha ? m.linha_max_width : 'não leva'}  rem=${m.rem_px}px  ` +
        `transbordo=${m.transbordo}`,
    );
  }
}
console.log('\nfolhas ligadas:');
for (const rota of ROTAS_DOM) console.log(`  ${rota} -> ${saida.dominios[rota][390].folhas.join(' ')}`);
console.log('');
