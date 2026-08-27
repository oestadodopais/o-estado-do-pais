#!/usr/bin/env node
/**
 * A RÉGUA DOS CONCELHOS — `/municipios` e `/municipios/evora`, medidas no motor.
 *
 * NÃO É UM PORTÃO: imprime, e sai sempre com 0. Corre fora do `npm run build`,
 * como `tests/inicio/matriz.mjs` e `tests/linha/recibo.mjs`, e pela mesma razão.
 *
 *   node tests/municipio/concelhos.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { MUNICIPIOS_COM_PAGINA } from '../../src/data/municipios.mjs';
import { caminhoDoFicheiroGerado } from '../../src/data/concelhos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.csv': 'text/csv',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.png': 'image/png',
};

const servidor = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, p);
  if (!f.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});

await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;
const nav = await chromium.launch();

let passam = 0;
let total = 0;
function conta(nome, bem, prova) {
  total += 1;
  if (bem) passam += 1;
  console.log(`  ${bem ? verde('passa') : vermelho('falha')}  ${nome}`);
  if (prova) console.log(cinza(`         ${prova}`));
}
/**
 * UMA CÉLULA SEM OBJECTO NÃO PASSA NEM FALHA: SALTA, E DIZ PORQUÊ.
 *
 * A régua do concelho sem estudos precisa de um segundo concelho construído, e
 * o repositório não leva o ficheiro dos 308 enquanto o motor não o escrever.
 * Contá-la como passada era uma célula a dar-se por verde sem ter medido nada;
 * contá-la como falhada era uma régua vermelha por o mundo estar certo. Fica
 * fora da contagem, com a razão impressa e com o comando que lhe dá objecto.
 */
let saltadas = 0;
function salta(nome, porque) {
  saltadas += 1;
  console.log(`  ${cinza('salta')}  ${nome}`);
  console.log(cinza(`         ${porque}`));
}
async function pagina(largura = 1280) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 1000 } });
  const p = await ctx.newPage();
  p.__contexto = ctx;
  return p;
}

const INDICE = '/municipios';
const EVORA = '/municipios/evora';

console.log('');
console.log(cinza('  a régua dos concelhos'));
console.log('');

/* 1 · OS 308, com o vocabulário de cobertura e a porta de Évora. */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const itens = [...document.querySelectorAll('.concelho')];
    const cobertura = [...document.querySelectorAll('.concelhos-lista [data-cobertura]')];
    const porEstado = {};
    for (const e of cobertura) {
      const k = e.getAttribute('data-cobertura');
      (porEstado[k] = porEstado[k] ?? new Set()).add(e.textContent.trim());
    }
    return {
      n: itens.length,
      grupos: document.querySelectorAll('.concelhos-grupo').length,
      comPagina: document.querySelectorAll('.concelho-com-pagina').length,
      portaEvora: [...document.querySelectorAll('.concelho a[href]')].map((a) => a.getAttribute('href')),
      cadeias: Object.fromEntries(Object.entries(porEstado).map(([k, v]) => [k, [...v]])),
      etiquetas: cobertura.length,
    };
  });
  /* A CÉLULA DEIXA DE ASSUMIR «UM EM 308» (bloco dos 308, P2). Media
     `comPagina === 1`, que era a cobertura do dia em que foi escrita e não uma
     invariante: com o ficheiro do motor são 308, e a régua ficava vermelha por
     ter acertado. O que é invariante é isto: são 308 concelhos, cada um numa
     linha, cada porta abre a página do seu concelho, e cada estado de cobertura
     tem uma cadeia só. A contagem imprime-se, para se ler o que ela é.
     A secção «Com página» à parte saiu, e a régua conta os grupos: são os 29
     distritos e ilhas da Carta, e mais nenhum. */
  /* A ETIQUETA DE ESTADO SÓ SE RENDE SE A LISTA DISTINGUIR (item E8, P2). Eram
     308 «tem página» iguais numa lista de 308, e a linha de cobertura em cima já
     diz o estado do todo com as suas duas contagens. A régua exige a etiqueta
     exactamente quando há dois estados: nenhuma com cobertura total, uma por
     linha quando algum concelho não tem página. */
  const distingue = m.comPagina > 0 && m.comPagina < m.n;
  conta(
    '3c · os 308 concelhos, a etiqueta de estado só onde ela distingue, e uma porta por concelho com página',
    m.n === 308 &&
      m.grupos === 29 &&
      m.etiquetas === (distingue ? m.n : 0) &&
      m.portaEvora.length === m.comPagina &&
      m.portaEvora.every((h) => h.startsWith('/municipios/')) &&
      m.portaEvora.includes('/municipios/evora') === m.comPagina > 0 &&
      Object.values(m.cadeias).every((v) => v.length === 1),
    `${m.n} concelhos em ${m.grupos} grupos · ${m.comPagina} com página · ${m.portaEvora.length} porta(s) · ` +
      `a lista distingue: ${distingue}, e rende ${m.etiquetas} etiqueta(s) de estado · ` +
      `cadeias ${JSON.stringify(m.cadeias)}`,
  );
  await p.__contexto.close();
}

/* 2 · A COBERTURA PELAS DUAS CHAVES DA PROVA, e a contagem por parcelas com o
   seu selo. A soma rende UMA vez com selo (ISSUES I38). */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const provas = [...document.querySelectorAll('#conteudo [data-prova]')].map((e) => [
      e.getAttribute('data-prova'),
      e.textContent.trim(),
      e.getAttribute('href'),
    ]);
    const parcelas = [...document.querySelectorAll('.concelhos-parcela')].map((e) => {
      const claim = e.querySelector('[data-claim]');
      return {
        id: claim?.getAttribute('data-claim'),
        valor: claim?.textContent.trim(),
        selo: e.querySelector('.src-chip')?.getAttribute('href'),
      };
    });
    return {
      provas,
      parcelas,
      totalNaPagina: document.querySelectorAll('[data-claim="municipios-portugal-caop-2025"]').length,
    };
  });
  const esperadas = ['municipios_com_pagina', 'municipios_total'];
  conta(
    '3c · a cobertura pelas duas chaves da prova, e as quatro parcelas com o seu selo',
    m.provas.length === 2 &&
      esperadas.every((k) => m.provas.some(([c]) => c === k)) &&
      m.provas.every(([, , href]) => href) &&
      m.parcelas.length === 4 &&
      m.parcelas.every((x) => x.id && x.selo === `/livro-razao/${x.id}`) &&
      m.totalNaPagina === 1,
    `provas ${m.provas.map(([k, v]) => `${k}=${v}`).join(' · ')} · ` +
      `parcelas ${m.parcelas.map((x) => `${x.valor}(${x.id})`).join(' · ')} · ` +
      `a soma rende ${m.totalNaPagina} vez(es)`,
  );
  await p.__contexto.close();
}

/* 3 · A PORTA DO CSV E A FONTE DA CAOP. */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => ({
    csv: [...document.querySelectorAll('a[href]')].some(
      (a) => a.getAttribute('href') === '/dados/municipios-308.csv',
    ),
    verbatim: document.querySelectorAll('[data-verbatim="caop-fonte"]').length,
    mapa: [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h.includes('#mapa')),
  }));
  conta(
    '3c · a porta do CSV, a citação da CAOP e a porta do mapa',
    m.csv && m.verbatim === 1 && m.mapa.length === 1,
    `CSV ${m.csv} · citação da CAOP ${m.verbatim} · porta do mapa ${m.mapa.join(', ') || '(nenhuma)'}`,
  );
  await p.__contexto.close();
}

/* 4 · O TRANSBORDO, cinco larguras, duas edições, as duas páginas. */
{
  const rotas = [INDICE, '/en/municipalities', EVORA, '/en/municipalities/evora'];
  const linhas = [];
  let mau = 0;
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina(largura);
    for (const rota of rotas) {
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const t = await p.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (t !== 0) {
        mau += 1;
        linhas.push(`${rota} @${largura}: ${t}px`);
      }
    }
    await p.__contexto.close();
  }
  conta(
    '3c · transbordo 0 nas duas páginas × 2 edições × 5 larguras',
    mau === 0,
    mau === 0 ? '20 de 20 combinações a zero' : linhas.join(' · '),
  );
}

/* 5 · ÉVORA: as oito medidas pela peça da primeira página, e a única cor é a do
   tecto legal (Emenda 1). */
{
  const p = await pagina();
  await p.goto(base + EVORA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const raiz = getComputedStyle(document.documentElement);
    const rgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
    };
    const cores = {
      amber: rgb(raiz.getPropertyValue('--amber')),
      ochre: rgb(raiz.getPropertyValue('--ochre')),
      cobalt: rgb(raiz.getPropertyValue('--cobalt')),
    };
    const pecas = [...document.querySelectorAll('.peca')];
    const coloridas = [];
    for (const el of document.querySelectorAll('body *')) {
      const c = getComputedStyle(el);
      for (const prop of ['color', 'backgroundColor', 'fill', 'stroke']) {
        if (Object.values(cores).includes(c[prop])) {
          coloridas.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(' ')[0]}:${prop}`);
        }
      }
    }
    return {
      pecas: pecas.length,
      vazias: document.querySelectorAll('.peca-vazia').length,
      reguas: document.querySelectorAll('.peca .regua').length,
      /* Uma peça vazia não tem estado: não há linha para o ter. O conjunto é o
         dos estados das peças que TÊM linha. */
      estados: [...new Set(pecas.map((e) => e.getAttribute('data-estado')).filter(Boolean))].sort(),
      /* A ORDEM DA EMENDA 14, lida da página e não recalculada. As oito medidas
         rendem-se sempre as oito e sempre por esta ordem, cheias ou vazias. */
      ordem: [...document.querySelectorAll('.painel .peca [data-medida-nome]')].map((e) =>
        e.textContent.trim(),
      ),
      semLinha: [...document.querySelectorAll('.peca-vazia [data-cobertura]')].map((e) =>
        e.textContent.trim(),
      ),
      coloridas: [...new Set(coloridas)],
    };
  });
  const ORDEM_DA_EMENDA_14 = [
    'População residente',
    'Poder de compra por habitante',
    'Desemprego registado',
    'Empresas não financeiras',
    'Dívida total do município',
    'Índice de dívida',
    'Execução da receita',
    'Prazo médio de pagamento',
  ];
  conta(
    'P2 · as oito peças pela ordem da Emenda 14, e as duas sem fonte central dizem-no',
    m.ordem.join(' | ') === ORDEM_DA_EMENDA_14.join(' | ') &&
      m.semLinha.length === 2 &&
      new Set(m.semLinha).size === 1 &&
      m.semLinha[0] === 'sem linha ainda',
    `ordem: ${m.ordem.join(' · ')} · peças vazias: ${m.semLinha.length}, cadeia ` +
      `«${[...new Set(m.semLinha)].join('», «')}»`,
  );
  conta(
    '3d · as oito medidas pela peça, e a cor só no tecto legal',
    m.pecas === 8 && m.vazias === 2 && m.reguas === 1 &&
      m.estados.join(',') === 'dentro,sem' &&
      m.coloridas.length > 0 &&
      /* Os únicos objectos com cor de estado são os da peça do índice de dívida:
         o quadrado do marcador, a palavra de estado e a barra da régua. */
      m.coloridas.every(
        (x) => x.startsWith('span.sq') || x.startsWith('span.peca-palavra') || x.startsWith('rect.regua-barra'),
      ),
    `${m.pecas} peças (${m.vazias} vazias) · ${m.reguas} régua · estados ${m.estados.join('/')} · ` +
      `elementos com cor de estado: ${m.coloridas.join(' | ') || '(nenhum)'}`,
  );
  await p.__contexto.close();
}

/* 6 · OS DOIS DESENHOS, NA GRAMÁTICA DA RÉGUA, E NENHUM AMARELO NO GABARITO. */
{
  const p = await pagina();
  await p.goto(base + EVORA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    /* Um `<line>` sem `fill` declarado computa `rgb(0, 0, 0)`, que não é a cor
       que ele desenha: o que se lê num traço é o `stroke`. Por etiqueta, e não
       por adivinha. */
    const cor = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const c = getComputedStyle(el);
      return el.tagName.toLowerCase() === 'line' ? c.stroke : c.fill;
    };
    const largura = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).strokeWidth : null;
    };
    return {
      distanciaBarra: cor('.mun-distancia-barra'),
      distanciaValor: cor('.mun-distancia-valor'),
      distanciaRef: cor('.mun-distancia-ref'),
      refLargura: largura('.mun-distancia-ref'),
      valorLargura: largura('.mun-distancia-valor'),
      serieBarras: document.querySelectorAll('.mun-serie-barra').length,
      serieValores: document.querySelectorAll('.mun-serie-valor').length,
      serieRef: cor('.mun-serie-ref'),
      /* Nenhum atributo de apresentação com cor escrita no gabarito. */
      fillsEscritos: [...document.querySelectorAll('[fill]')].map((e) => e.getAttribute('fill')),
    };
  });
  conta(
    '3d · os dois desenhos na gramática da régua, e nenhuma cor escrita no gabarito',
    m.distanciaBarra && m.distanciaValor && m.distanciaRef &&
      m.refLargura === '2px' && m.valorLargura === '1px' &&
      m.serieBarras === 4 && m.serieValores === 4 && m.serieRef &&
      m.fillsEscritos.every((f) => !/yellow|#/.test(String(f))),
    `distância: barra ${m.distanciaBarra} · valor ${m.distanciaValor} (${m.valorLargura}) · ` +
      `referência ${m.distanciaRef} (${m.refLargura}) · série: ${m.serieBarras} barras, ` +
      `${m.serieValores} valores, referência ${m.serieRef} · fills escritos no gabarito: ` +
      `${[...new Set(m.fillsEscritos)].join(', ') || '(nenhum)'}`,
  );
  await p.__contexto.close();
}

/* 7 · AS DUAS MEDIDAS QUE DESCERAM PARA A CAMADA DAS CONTAS (E5, decisão D2).
   A execução da receita e o prazo médio continuam a ser rendidos, com o seu
   selo, na camada onde esta página publica o que o município diz de si. */
{
  const p = await pagina();
  await p.goto(base + EVORA, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const campos = [...document.querySelectorAll('.mun-campos dt')].map((dt) => ({
      k: dt.textContent.trim(),
      claim: dt.nextElementSibling?.querySelector('[data-claim]')?.getAttribute('data-claim') ?? null,
      selo: dt.nextElementSibling?.querySelector('.src-chip')?.getAttribute('href') ?? null,
    }));
    return {
      execucao: campos.find((c) => c.claim === 'evora-execucao-da-receita-2025') ?? null,
      pmp: campos.find((c) => c.claim === 'evora-prazo-medio-de-pagamento-2025') ?? null,
      /* A coluna da dívida, dita na peça (E5c). */
      coluna: document.body.textContent.includes(
        'Exclui dívidas não orçamentais e exceções legais',
      ),
    };
  });
  conta(
    'P2 · as duas linhas municipais descem para as contas, com o seu selo, e a dívida diz a coluna',
    Boolean(m.execucao && m.pmp) &&
      m.execucao.selo === '/livro-razao/evora-execucao-da-receita-2025' &&
      m.pmp.selo === '/livro-razao/evora-prazo-medio-de-pagamento-2025' &&
      m.coluna,
    `execução: ${m.execucao ? `«${m.execucao.k}» → ${m.execucao.selo}` : '(ausente)'} · ` +
      `PMP: ${m.pmp ? `«${m.pmp.k}» → ${m.pmp.selo}` : '(ausente)'} · coluna dita: ${m.coluna}`,
  );
  await p.__contexto.close();
}

/* 8 · UM CONCELHO SEM ESTUDOS RENDE SÓ O QUE EXISTE (E1).

   A CÉLULA MEDE A REGRA, E NÃO A FORMA DE UM FICHEIRO DE TESTE (P2, os dados).
   Escrita contra o ficheiro de teste, pedia «oito peças, oito vazias, nenhum
   algarismo no painel, nenhuma secção de fundo, nenhuma coluna de corpo»: era a
   página de um concelho SEM LINHA NENHUMA, que é um caso do ficheiro de teste e
   não a regra. Com os dados do motor, um concelho tem entre quatro e sete peças
   cheias, e a leitura breve rende-se onde a dívida e o limite existem, que é o
   que a vista promete.

   O que é regra, e vale nas duas coberturas:
     · as oito peças rendem-se sempre, e cada peça vazia diz «sem linha ainda» e
       não traz um único algarismo;
     · as secções de um concelho COM trabalho publicado não se rendem: as contas
       do município, a linha do tempo, o método, os trabalhos e «o que esta
       página não sabe»;
     · a camada da leitura breve rende-se se e só se a distância desenhada
       existe, que é o que a vista faz quando um concelho não tem frases;
     · a coluna do corpo rende-se se e só se há corpo;
     · o cartão localizador e as três portas rendem-se sempre.

   Mede-se em TODOS os concelhos sem entrada escrita à mão que a construção
   tiver, e não num só: com o ficheiro de teste é um caso, com os dados são 307,
   e é a mesma regra. */
{
  const p = await pagina();
  await p.goto(base + INDICE, { waitUntil: 'networkidle' });
  const outros = await p.evaluate(() =>
    [...document.querySelectorAll('.concelho a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => h !== '/municipios/evora'),
  );
  if (outros.length === 0) {
    salta(
      'P2 · um concelho sem estudos rende só o que existe',
      'sem objecto: só há uma página de concelho construída. ' +
        'node tests/municipio/gerar-teste-308.mjs <ficheiro> && CONCELHOS_GERADO=<ficheiro> npm run build',
    );
  } else {
    const maus = [];
    let vaziasVistas = 0;
    let comDistancia = 0;
    for (const rota of outros) {
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => ({
        pecas: document.querySelectorAll('.peca').length,
        vazias: document.querySelectorAll('.peca-vazia').length,
        semLinha: [...document.querySelectorAll('.peca-vazia')].every(
          (e) =>
            e.querySelector('[data-cobertura="sem-linha"]') &&
            !/[0-9]/.test(e.textContent ?? ''),
        ),
        breve: document.querySelectorAll('#breve').length,
        distancia: document.querySelectorAll('.mun-distancia').length,
        /* As secções de um concelho com trabalho publicado. */
        doTrabalho:
          document.querySelectorAll('#contas').length +
          document.querySelectorAll('#tempo').length +
          document.querySelectorAll('#metodo').length +
          document.querySelectorAll('#trabalhos').length +
          document.querySelectorAll('.aparelho-estado').length,
        corpo: document.querySelectorAll('.municipio-corpo').length,
        cartao: document.querySelectorAll('[data-mapa-cartao]').length,
        portas: [...document.querySelectorAll('.aparelho-saidas a')].map((a) =>
          a.getAttribute('href'),
        ),
      }));
      vaziasVistas += m.vazias;
      comDistancia += m.distancia;
      const bem =
        m.pecas === 8 &&
        m.semLinha &&
        m.doTrabalho === 0 &&
        m.breve === m.distancia &&
        m.corpo === (m.breve > 0 ? 1 : 0) &&
        m.cartao === 1 &&
        m.portas.length === 3 &&
        m.portas[0] === '/municipios' &&
        /* A segunda porta abre a página de livro-razão DESTE concelho, e não o
           índice: a porta de uma página é para a coisa dela. */
        m.portas[1] === `/livro-razao/concelhos/${rota.split('/').pop()}`;
      if (!bem) {
        maus.push(
          `${rota}: ${m.pecas} peças (${m.vazias} vazias, sem-linha limpo ${m.semLinha}) · ` +
            `secções de trabalho ${m.doTrabalho} · breve ${m.breve} / distância ${m.distancia} · ` +
            `corpo ${m.corpo} · cartão ${m.cartao} · portas ${m.portas.join(', ')}`,
        );
      }
    }
    conta(
      'P2 · um concelho sem estudos rende só o que existe',
      maus.length === 0,
      maus.length === 0
        ? `${outros.length} página(s) de concelho sem entrada escrita à mão · 8 peças em todas, ` +
          `${vaziasVistas} peça(s) vazia(s) ao todo, ${comDistancia} com a dívida desenhada · ` +
          `nenhuma secção de trabalho, nenhuma coluna de corpo sem corpo`
        : `${maus.length} de ${outros.length}: ${maus.slice(0, 3).join(' | ')}`,
    );
  }
  await p.__contexto.close();
}

/* 8b · AS ENTRADAS QUE O MÓDULO DÁ E AS PÁGINAS QUE A CONSTRUÇÃO FEZ, CONTADAS
   DOS DOIS LADOS (P2, os dados).

   Esta célula existe por causa de um defeito que ninguém viu durante o P2
   (estrutura), e que só apareceu quando o exportador escreveu o ficheiro a
   sério: `src/data/concelhos.mjs` procurava `concelhos.gerado.json` por um
   caminho relativo ao próprio módulo, e na construção o módulo é EMPACOTADO, por
   isso o caminho passava a apontar para o pacote. O ficheiro existia e o Astro
   não o via: `getStaticPaths` construía uma página de concelho e nada fechava a
   construção do lado do Astro. Quem o apanhou foi o portão, com as duas contas
   das chaves da prova; o que faltava era uma régua que o dissesse pelo nome.

   Duas contas do mesmo número, de sítios diferentes: quantas entradas o módulo
   dá quando corre em Node, e quantas páginas de concelho a construção escreveu.
   Se divergirem, alguma coisa entre o módulo e a construção perdeu entradas pelo
   caminho. E o ficheiro por omissão tem de ser o de `src/data/`: um caminho que
   aponte para outro sítio é o mesmo defeito com outra cara. */
{
  const doModulo = MUNICIPIOS_COM_PAGINA.length;
  const caminho = caminhoDoFicheiroGerado();
  const dentroDeSrcData = /\/src\/data\/concelhos\.gerado\.json$/.test(caminho);
  const noAmbiente = Boolean(process.env.CONCELHOS_GERADO);
  const construidas = fs.existsSync(path.join(DIST, 'municipios'))
    ? fs
        .readdirSync(path.join(DIST, 'municipios'))
        .filter((d) => fs.existsSync(path.join(DIST, 'municipios', d, 'index.html'))).length
    : 0;
  conta(
    'P2 · as entradas do módulo e as páginas construídas são o mesmo número',
    doModulo === construidas && (noAmbiente || dentroDeSrcData),
    `o módulo dá ${doModulo} entrada(s), a construção escreveu ${construidas} página(s) · ` +
      `ficheiro por omissão: ${noAmbiente ? `CONCELHOS_GERADO=${caminho}` : caminho}` +
      `${noAmbiente || dentroDeSrcData ? '' : ' (fora de src/data/)'}`,
  );
}

/* 9 · O LIVRO-RAZÃO DOS CONCELHOS: O ÍNDICE E AS 308 PÁGINAS.

   ERA UMA PÁGINA COM TUDO (P2, os dados; diretor de 26.08.2026). A página do
   conjunto ficou com 2 416 linhas e 227 008 px de altura a 1280, que é o
   problema que a decisão D6 resolveu no índice principal, reaparecido dentro da
   página que existia para o resolver. Passa a haver uma página de livro-razão
   por concelho, e a do conjunto é o índice delas.

   O que a célula mede:
     · o índice tem as três contagens com porta, a pesquisa dos 308, e a lista
       por distrito com os 29 grupos da Carta e uma linha por concelho;
     · uma linha do índice é porta se e só se o concelho tem linhas, e a porta
       abre a página de livro-razão dele, que foi construída;
     · TODA a linha do estudo está numa página de concelho: a soma das linhas
       das 308 páginas é a contagem que o índice publica.

   A terceira faz-se sobre os ficheiros construídos e não no navegador: são 308
   páginas, e abrir 308 no Chromium para contar `<div>` é meia hora para uma
   soma que o disco dá em milissegundos. */
{
  const p = await pagina();
  await p.goto(base + '/livro-razao/concelhos', { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => ({
    provas: [...document.querySelectorAll('#conteudo [data-prova]')].map((e) => [
      e.getAttribute('data-prova'),
      e.textContent.trim(),
      e.getAttribute('href'),
    ]),
    grupos: document.querySelectorAll('.concelhos-grupo').length,
    linhas: document.querySelectorAll('.concelho').length,
    portas: [...document.querySelectorAll('.concelho a[href]')].map((a) => a.getAttribute('href')),
    semLinhas: document.querySelectorAll('.concelho [data-cobertura="sem-linha"]').length,
    resultados: document.querySelectorAll('.pesquisa-item').length,
    /* A REFERÊNCIA DO ESTUDO: a linha que não é de nenhum concelho. O teto legal
       é uma constante da lei, e é contra ela que os índices se calculam; desde
       que o manifesto do motor lhe mudou o `study` para `concelhos-2026`, ela é
       uma linha DESTE estudo que não pertence a concelho nenhum. Tem secção com
       nome no índice, e entra na conta: nenhuma linha do estudo pode ficar fora
       de uma página. */
    referencia: document.querySelectorAll('[data-concelho-referencia] .livro-item').length,
    destinos: [...new Set(
      [...document.querySelectorAll('.pesquisa-item a[href]')].map((a) =>
        a.getAttribute('href').replace(/[^/]+$/, '<slug>'),
      ),
    )],
  }));
  await p.goto(base + '/livro-razao', { waitUntil: 'networkidle' });
  const indice = await p.evaluate(() => {
    const paraCa = [...document.querySelectorAll('a[href="/livro-razao/concelhos"]')];
    return {
      porta: paraCa.filter((a) => !a.classList.contains('prova-valor')).length,
      valor: paraCa.filter((a) => a.classList.contains('prova-valor')).length,
      aninhadas: paraCa.filter((a) => a.closest('a') !== a).length,
      linhasDoIndice: document.querySelectorAll('.livro-item').length,
    };
  });

  /* As páginas de concelho construídas, e as linhas que cada uma lista. */
  const dir = path.join(DIST, 'livro-razao', 'concelhos');
  const construidas = new Map();
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const f = path.join(dir, e.name, 'index.html');
    if (!fs.existsSync(f)) continue;
    const html = fs.readFileSync(f, 'utf8');
    construidas.set(`/livro-razao/concelhos/${e.name}`, (html.match(/class="livro-item"/g) ?? []).length);
  }
  const somaDasLinhas = [...construidas.values()].reduce((a, b) => a + b, 0);
  /* DUAS CHAVES, E ERAM TRÊS (diretor, 27.08.2026; DECISIONS §1.70).
     «2417 com proveniência completa» saiu da linha de contagens: é a
     escrituração da casa, e as linhas por confirmar levam o seu marcador e estão
     listadas em `/a-verificar`. A chave `concelhos_linhas_completas` fica na
     tabela da prova e continua recontada pelo portão, que exige saber contar
     cada chave e não que alguma página a renda. */
  const chaves = ['concelhos_linhas', 'concelhos_no_livro'];
  const dasChaves = m.provas.filter(([k]) => chaves.includes(k));
  const declaradas = Number(dasChaves.find(([k]) => k === 'concelhos_linhas')?.[1]);
  const comLinhas = Number(dasChaves.find(([k]) => k === 'concelhos_no_livro')?.[1]);
  const semPagina = m.portas.filter((h) => !construidas.has(h));
  conta(
    'P2 · o índice dos concelhos no livro-razão, e as 308 páginas por baixo dele',
    dasChaves.length === 2 &&
      dasChaves.every(([, , href]) => href === '/livro-razao/concelhos') &&
      m.linhas === 308 &&
      m.grupos === 29 &&
      m.resultados === 308 &&
      m.destinos.length === 1 &&
      m.destinos[0] === '/livro-razao/concelhos/<slug>' &&
      m.portas.length === comLinhas &&
      m.portas.length + m.semLinhas === 308 &&
      semPagina.length === 0 &&
      somaDasLinhas + m.referencia === declaradas &&
      indice.porta === 1 &&
      indice.valor === 1 &&
      indice.aninhadas === 0,
    `${dasChaves.map(([k, v]) => `${k}=${v}`).join(' · ')} · ${m.linhas} concelhos em ${m.grupos} ` +
      `grupos, ${m.portas.length} com porta e ${m.semLinhas} sem linhas · ` +
      `${construidas.size} página(s) de concelho construída(s) com ${somaDasLinhas} linha(s) ao todo, ` +
      `mais ${m.referencia} de referência no índice (soma ${somaDasLinhas + m.referencia} para ${declaradas} declaradas)` +
      `${semPagina.length ? `, ${semPagina.length} porta(s) sem página: ${semPagina.slice(0, 3).join(', ')}` : ''} · ` +
      `${m.resultados} resultados na pesquisa, destino ${m.destinos.join(' / ')} · ` +
      `no índice do livro-razão: ${indice.porta} porta + ${indice.valor} valor da prova, ` +
      `${indice.aninhadas} aninhada(s), ${indice.linhasDoIndice} linhas listadas`,
  );
  await p.__contexto.close();
}

/* 10 · NENHUMA LIGAÇÃO DENTRO DE UM `role="img"` (item E12, P2).

   `role="img"` diz «isto é uma imagem», e a tecnologia de apoio pode achatar o
   que está dentro: os descendentes deixam de ser alcançáveis um a um. Uma
   ligação lá dentro é uma porta que pode desaparecer para quem não a vê. O mapa
   da primeira página tem 308 ligações por regra (N4) e passa a declarar-se
   `role="group"`, que leva nome acessível e não esconde o que tem dentro; o
   cartão localizador da página do concelho não tem ligação nenhuma e continua a
   ser o que é, uma imagem.

   A régua é sobre o `dist/` INTEIRO e não sobre duas páginas: a marca pode
   aparecer em qualquer gabarito, e é isso que se recusa. Corre sobre os
   ficheiros, sem navegador. */
{
  const maus = [];
  let svgs = 0;
  const varre = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) varre(full);
      else if (e.name.endsWith('.html')) {
        const html = fs.readFileSync(full, 'utf8');
        let i = 0;
        for (;;) {
          const abre = html.indexOf('<svg', i);
          if (abre === -1) break;
          const fimDaEtiqueta = html.indexOf('>', abre);
          const fecha = html.indexOf('</svg>', fimDaEtiqueta);
          if (fimDaEtiqueta === -1 || fecha === -1) break;
          svgs += 1;
          const etiqueta = html.slice(abre, fimDaEtiqueta + 1);
          const dentro = html.slice(fimDaEtiqueta + 1, fecha);
          if (/role="img"/.test(etiqueta) && /<a[\s>]/.test(dentro)) {
            maus.push(`${path.relative(DIST, full)} (${(dentro.match(/<a[\s>]/g) ?? []).length} ligação(ões))`);
          }
          i = fecha + 6;
        }
      }
    }
  };
  varre(DIST);
  conta(
    'P2 · nenhuma ligação dentro de um elemento com role="img", em todo o dist/',
    maus.length === 0,
    `${svgs} SVG percorridos · ${maus.length} com role="img" a conter uma ligação` +
      `${maus.length ? `: ${maus.slice(0, 3).join(', ')}` : ''}`,
  );
}

await nav.close();
servidor.close();

console.log('');
console.log(
  `  ${passam === total ? verde(`${passam} de ${total} células passam.`) : vermelho(`${passam} de ${total} células passam.`)}` +
    (saltadas ? cinza(` ${saltadas} sem objecto.`) : ''),
);
console.log('');
process.exit(0);
