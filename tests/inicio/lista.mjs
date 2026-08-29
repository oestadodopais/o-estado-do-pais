#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DOS NOMES AO LADO DO MAPA · o bloco de 29.08.2026
 * =============================================================================
 *
 * Uma célula por coisa que o brief manda medir, em Chromium sem cabeça sobre
 * `dist/`. NÃO é um portão: não entra no `npm run build` e não constrói nada.
 * Imprime uma linha por célula e sai com 0 quando todas passam e com 1 quando
 * alguma falha, como `tests/inicio/mapa-distritos.mjs`. O código de saída é o
 * que faz um estrago plantado ser visível (regra 14 da casa).
 *
 *   node tests/inicio/lista.mjs
 *   node tests/inicio/lista.mjs --json <ficheiro>
 *   node tests/inicio/lista.mjs --vermelhos
 *
 * O servidor toma uma porta livre (`listen(0)`), como as outras réguas da casa.
 *
 * ---------------------------------------------------------------------------
 * O QUE CADA CÉLULA MEDE, E PORQUE É ASSIM QUE SE MEDE
 * ---------------------------------------------------------------------------
 * L1 · UMA LISTA SÓ NO DOCUMENTO. O brief escreve-o por extenso: a colocação na
 * coluna esquerda é da folha, e não uma segunda rendição. Conta-se o número de
 * ligações de nome e o número de slugs distintos: se forem 29 e 29, não há
 * segunda lista nem nome repetido; se forem 58 e 29, há duas listas.
 *
 * L2 · A COLOCAÇÃO. A lista tem de ficar na banda da coluna esquerda (a mesma
 * abcissa e a mesma largura da cabeça), começar por baixo da manchete e acabar
 * antes do fim da coluna do instrumento mais uma folga: é isso, e não uma
 * ordem no documento, que a põe AO LADO do mapa e não por baixo dele.
 *
 * L3 · A PÁGINA DEIXA DE CRESCER. A altura da grelha da cabeça contra a altura
 * da sua coluna mais alta sem a lista: antes deste bloco a lista estava dentro
 * da coluna do instrumento e a grelha media 1 552 px a 1280, com 820 px de
 * papel vazio à esquerda. A célula não guarda o número de antes (ele
 * envelheceria): guarda a relação que o torna impossível.
 *
 * L4 · NENHUMA UNIDADE SEM ALVO TOCÁVEL, que é o que a Emenda 20c protege. Em
 * cada largura medida, cada nome tem de estar VISÍVEL, e não apenas presente no
 * documento: a régua do mapa (`mapa-distritos.mjs`, células M1b e M2b) pergunta
 * ao DOM, e um grupo escondido pela folha passaria por ela. Esta pergunta é ao
 * estilo computado e à caixa.
 *
 * L5 · O ALVO DE CADA NOME. Altura ≥ 44 px, e dois nomes seguidos que partilham
 * a coluna não se sobrepõem: um alvo de 44 px feito de `padding` que se
 * sobrepusesse ao de cima seria 44 px no papel e menos no dedo.
 *
 * L6 · O PAR DE ESTADO, NOS DOIS SENTIDOS E PELAS DUAS PORTAS. O rato num nome
 * engrossa o contorno da área daquela unidade e de mais nenhuma; o rato numa
 * área engrossa o sublinhado do nome daquela unidade e de mais nenhum; e o
 * mesmo com o foco do teclado.
 *
 * L7 · A MARCA NÃO É SÓ COR. Dos dois lados, o que muda entre o repouso e a
 * marca tem de incluir uma grandeza que não é cor (a largura do traço de um
 * lado, a espessura do sublinhado do outro). A régua do contraste da casa mede
 * os pares de cor da folha e não este estado; o que aqui se mede é o que ela não
 * pode medir, que é se a marca sobrevive a quem não distingue as duas cores.
 *
 * L8 · O NOME DE CADA PAINEL TRAZ A CONTAGEM DA PROVA. O algarismo tem de estar
 * dentro de um `data-prova`, e o `data-prova` tem de ser a chave certa: um
 * número escrito à mão na cadeia não tem marca nenhuma, e o portão de HTML não
 * o reconta. Mede-se nas duas edições.
 *
 * L9 · A DECLARAÇÃO DA CONSTRUÇÃO CONTRA A MEDIÇÃO DO NAVEGADOR.
 * `data-alvo-abaixo-de` diz, por grupo, a largura de mapa abaixo da qual aquela
 * parcela deixa de ter todas as unidades como alvo, calculada em
 * `parcelasDoMapa()`. A célula mede a tela e as caixas das áreas no navegador e
 * confere a fronteira nos dois sentidos: abaixo dela há pelo menos uma unidade
 * por baixo dos 44 px, e a partir dela não há nenhuma.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const VERMELHOS = argv.includes('--vermelhos');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

/* O estrago plantado não toca em disco: é uma transformação do HTML no caminho
   entre o ficheiro e o navegador, como na régua do mapa. Assim a régua mede
   exactamente o que mediria de verdade, e o `dist/` fica como estava. */
let ESTRAGO = null;

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  const tipo = MIME[path.extname(ficheiro)] ?? 'application/octet-stream';
  if (ESTRAGO && path.extname(ficheiro) === '.html') {
    const html = ESTRAGO(fs.readFileSync(ficheiro, 'utf8'), semQuery);
    res.writeHead(200, { 'content-type': tipo });
    return void res.end(html);
  }
  res.writeHead(200, { 'content-type': tipo });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

let celulas = [];
let medidas = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

const nav = await chromium.launch({ headless: true });
async function pagina(rota, largura) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 900 } });
  const p = await ctx.newPage();
  p.__ctx = ctx;
  await p.goto(base + rota, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

const ALVO = 44;
/* AS SETE LARGURAS DO BRIEF. Quatro de telemóvel (as mesmas da régua do mapa),
   a tablete, e as duas do computador em que a coluna esquerda existe. */
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1280];
const EDICOES = [
  { rota: '/', chave: 'pt' },
  { rota: '/en', chave: 'en' },
];

/** Tudo o que uma página diz sobre a lista, a uma largura. */
const LEITURA = () => {
  const visivel = (el) => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  };
  const cx = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      x: +b.x.toFixed(1),
      y: +(b.y + window.scrollY).toFixed(1),
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
      fundo: +(b.y + b.height + window.scrollY).toFixed(1),
    };
  };
  const lista = document.querySelector('[data-mapa-ilhas]');
  const grupos = [...document.querySelectorAll('[data-parcela-lista]')].map((g) => ({
    parcela: g.getAttribute('data-parcela-lista'),
    abaixoDe: Number(g.getAttribute('data-alvo-abaixo-de')),
    visivel: visivel(g),
    caixa: cx(g),
  }));
  const nomes = [...document.querySelectorAll('[data-lista-porta]')].map((a) => ({
    slug: a.getAttribute('data-lista-porta'),
    parcela: a.closest('[data-parcela-lista]')?.getAttribute('data-parcela-lista') ?? null,
    visivel: visivel(a),
    caixa: cx(a),
    destino: a.getAttribute('href'),
  }));
  const areas = [...document.querySelectorAll('[data-areas] .uni')].map((el) => {
    const b = el.getBoundingClientRect();
    return {
      slug: el.getAttribute('data-unidade'),
      parcela: el.getAttribute('data-parcela'),
      lado: +Math.max(b.width, b.height).toFixed(2),
    };
  });
  const painel = [...document.querySelectorAll('.painel-nome, .social-titulo')].map((h) => {
    const marcado = h.querySelector('[data-prova]');
    return {
      classe: h.className,
      texto: h.textContent.replace(/\s+/g, ' ').trim(),
      chave: marcado?.getAttribute('data-prova') ?? null,
      algarismo: marcado?.textContent.trim() ?? null,
      /* Os algarismos que ficam FORA de um `data-prova`: um número escrito à
         mão na cadeia aparece aqui, e nenhum portão o reconta. */
      soltos: [...h.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join(' ')
        .match(/\d+/g),
    };
  });
  return {
    janela: window.innerWidth,
    pagina: +document.documentElement.scrollHeight.toFixed(1),
    cabeca: cx(document.querySelector('.cabeca-col')),
    instrumento: cx(document.querySelector('.cabeca-inst')),
    grelha: cx(document.querySelector('.cabeca-grelha')),
    tela: cx(document.querySelector('.mapa-tela')),
    lista: cx(lista),
    listaVisivel: visivel(lista),
    grupos,
    nomes,
    areas,
    painel,
  };
};

/** O estado de um par, lido dos dois lados ao mesmo tempo. */
const PAR = (slug) => {
  const uni = document.querySelector(`.uni[data-unidade="${slug}"]`);
  const nome = document.querySelector(`[data-lista-porta="${slug}"]`);
  const cu = uni ? getComputedStyle(uni) : null;
  const cn = nome ? getComputedStyle(nome) : null;
  /* Os outros 28, para saber se a marca ficou só na unidade apontada. */
  const outrasAreas = [...document.querySelectorAll('[data-areas] .uni')]
    .filter((el) => el.getAttribute('data-unidade') !== slug)
    .map((el) => getComputedStyle(el).strokeWidth);
  const outrosNomes = [...document.querySelectorAll('[data-lista-porta]')]
    .filter((el) => el.getAttribute('data-lista-porta') !== slug)
    .map((el) => getComputedStyle(el).textDecorationThickness);
  return {
    traco: cu?.strokeWidth ?? null,
    corDoTraco: cu?.stroke ?? null,
    sublinhado: cn?.textDecorationThickness ?? null,
    corDoSublinhado: cn?.textDecorationColor ?? null,
    corDoNome: cn?.color ?? null,
    outrosTracos: [...new Set(outrasAreas)],
    outrosSublinhados: [...new Set(outrosNomes)],
  };
};

async function correTudo() {
  /* ------------------------------------------------------- as sete larguras */
  const lido = {};
  for (const e of EDICOES) {
    for (const w of LARGURAS) {
      const p = await pagina(e.rota, w);
      lido[`${e.chave}_${w}`] = await p.evaluate(LEITURA);
      await p.__ctx.close();
    }
  }
  medidas.larguras = lido;

  /* --------------------------------------------------------------------- L1 */
  for (const e of EDICOES) {
    const r = lido[`${e.chave}_1280`];
    const slugs = r.nomes.map((n) => n.slug);
    const distintos = new Set(slugs);
    const destinos = new Set(r.nomes.map((n) => n.destino));
    conta(
      `L1·${e.chave} · uma lista só: ${r.areas.length} áreas e um nome por unidade, sem repetição`,
      slugs.length === 29 && distintos.size === 29 && destinos.size === 29 && r.areas.length === 29,
      `${slugs.length} nome(s), ${distintos.size} slug(s) distinto(s), ${destinos.size} destino(s) distinto(s), ${r.areas.length} área(s)`,
    );
  }

  /* --------------------------------------------------------------------- L2 */
  for (const w of [1024, 1280]) {
    const r = lido[`pt_${w}`];
    const naBanda =
      Math.abs(r.lista.x - r.cabeca.x) < 1 && Math.abs(r.lista.w - r.cabeca.w) < 1;
    const porBaixoDaManchete = r.lista.y >= r.cabeca.fundo;
    const aoLadoDoMapa = r.lista.y < r.instrumento.fundo;
    conta(
      `L2·${w} · a lista está na coluna esquerda, por baixo da manchete e ao lado do mapa`,
      naBanda && porBaixoDaManchete && aoLadoDoMapa,
      `lista x ${r.lista.x} w ${r.lista.w} (cabeça x ${r.cabeca.x} w ${r.cabeca.w}) · topo ${r.lista.y} contra o fim da manchete ${r.cabeca.fundo} e o fim do mapa ${r.instrumento.fundo}`,
    );
  }

  /* --------------------------------------------------------------------- L3 */
  {
    const r = lido.pt_1280;
    const colunaDoInstrumento = r.instrumento.fundo - r.grelha.y;
    const folga = r.grelha.h - colunaDoInstrumento;
    conta(
      'L3·1280 · a página deixa de crescer: a grelha não passa muito da coluna do mapa',
      folga <= 60,
      `grelha ${r.grelha.h} px · coluna do instrumento ${colunaDoInstrumento.toFixed(1)} px · folga ${folga.toFixed(1)} px (limite 60) · página ${r.pagina} px`,
    );
  }

  /* --------------------------------------------------------------------- L4 */
  for (const e of EDICOES) {
    for (const w of LARGURAS) {
      const r = lido[`${e.chave}_${w}`];
      const escondidos = r.grupos.filter((g) => !g.visivel);
      const nomesEscondidos = r.nomes.filter((n) => !n.visivel);
      /* A razão, medida: a unidade mais pequena de cada parcela no mapa, contra
         os 44 px. É o que diz porque é que aquele grupo tem de estar à vista. */
      const porParcela = r.grupos.map((g) => {
        const dela = r.areas.filter((a) => a.parcela === g.parcela);
        const menor = dela.length ? Math.min(...dela.map((a) => a.lado)) : null;
        return `${g.parcela} ${g.visivel ? 'à vista' : 'ESCONDIDO'} (menor unidade ${menor?.toFixed(1)} px)`;
      });
      conta(
        `L4·${e.chave}·${w} · nenhuma unidade sem alvo tocável: todos os grupos e nomes à vista`,
        escondidos.length === 0 && nomesEscondidos.length === 0 && r.nomes.length === 29,
        `${porParcela.join(' · ')}${nomesEscondidos.length ? ` · ${nomesEscondidos.length} nome(s) escondido(s)` : ''}`,
      );
    }
  }

  /* --------------------------------------------------------------------- L5 */
  for (const e of EDICOES) {
    for (const w of LARGURAS) {
      const r = lido[`${e.chave}_${w}`];
      const vistos = r.nomes.filter((n) => n.visivel);
      const curtos = vistos.filter((n) => n.caixa.h < ALVO);
      /* Dois nomes seguidos na mesma coluna não se sobrepõem: ordenam-se por
         topo e compara-se cada um com o anterior que partilha a abcissa. */
      const porColuna = new Map();
      for (const n of vistos) {
        const c = Math.round(n.caixa.x);
        if (!porColuna.has(c)) porColuna.set(c, []);
        porColuna.get(c).push(n);
      }
      let sobrepostos = 0;
      for (const fila of porColuna.values()) {
        fila.sort((a, b) => a.caixa.y - b.caixa.y);
        for (let i = 1; i < fila.length; i++) {
          if (fila[i].caixa.y < fila[i - 1].caixa.fundo - 0.5) sobrepostos++;
        }
      }
      conta(
        `L5·${e.chave}·${w} · cada nome à vista é um alvo de ${ALVO} px, e nenhum se sobrepõe`,
        vistos.length > 0 && curtos.length === 0 && sobrepostos === 0,
        curtos.length === 0 && sobrepostos === 0
          ? `${vistos.length} nome(s), o mais baixo ${Math.min(...vistos.map((n) => n.caixa.h)).toFixed(1)} px, ${porColuna.size} coluna(s), 0 sobreposições`
          : `${curtos.length} abaixo de ${ALVO} px (o mais baixo ${Math.min(...vistos.map((n) => n.caixa.h)).toFixed(1)}) · ${sobrepostos} sobreposição(ões)`,
      );
    }
  }

  /* --------------------------------------------------------------------- L9 */
  for (const w of LARGURAS) {
    const r = lido[`pt_${w}`];
    const erros = [];
    for (const g of r.grupos) {
      const dela = r.areas.filter((a) => a.parcela === g.parcela);
      const abaixo = dela.filter((a) => a.lado < ALVO);
      const declaraQuePrecisa = r.tela.w < g.abaixoDe - 0.5;
      if (declaraQuePrecisa !== abaixo.length > 0) {
        erros.push(
          `${g.parcela}: declara ${g.abaixoDe} px e a tela mede ${r.tela.w} px, ` +
            `mas ${abaixo.length} unidade(s) estão abaixo de ${ALVO}`,
        );
      }
    }
    conta(
      `L9·${w} · o «data-alvo-abaixo-de» de cada grupo bate com o que o navegador mede`,
      erros.length === 0,
      erros.length === 0
        ? `tela ${r.tela.w} px · ${r.grupos
            .map((g) => {
              const dela = r.areas.filter((a) => a.parcela === g.parcela);
              return `${g.parcela} abaixo de ${g.abaixoDe} px, ${dela.filter((a) => a.lado < ALVO).length}/${dela.length} sob ${ALVO}`;
            })
            .join(' · ')}`
        : erros.join(' · '),
    );
  }

  /* ----------------------------------------------------------------- L6 e L7 */
  {
    const alvo = 'lisboa';
    const outro = 'faro';
    const p = await pagina('/', 1280);
    const repouso = await p.evaluate(PAR, alvo);

    /* O RATO PÕE-SE COM UMA ESPERA CURTA E UM APANHA-ERROS, e não porque a
       espera do Playwright seja de mais: um estrago plantado pode esconder o
       nome, e então o rato nunca lá chega. Sem isto a régua morria a meio da
       planta em vez de a dar como apanhada, que é o contrário do que ela é
       para fazer. */
    const passaORato = async (seletor, forca) => {
      try {
        const el = await p.$(seletor);
        if (!el) return false;
        await el.hover({ timeout: 2000, force: !!forca });
        return true;
      } catch {
        return false;
      }
    };

    const chegouAoNome = await passaORato(`[data-lista-porta="${alvo}"]`, false);
    const comRatoNoNome = await p.evaluate(PAR, alvo);
    await p.mouse.move(0, 0);

    const chegouAArea = await passaORato(`a[data-uni-porta="${alvo}"] .uni`, true);
    const comRatoNaArea = await p.evaluate(PAR, alvo);
    const outroComRatoNaArea = await p.evaluate(PAR, outro);
    await p.mouse.move(0, 0);

    /* O TECLADO CHEGA PELO FOCO, e o foco põe-se com o teclado: um `focus()` de
       guião não acende `:focus-visible` em todos os motores, e o que a régua tem
       de medir é o que o leitor que carrega em Tab vê. Foca-se o nome anterior e
       dá-se um Tab. */
    await p.evaluate((slug) => {
      const nomes = [...document.querySelectorAll('[data-lista-porta]')];
      const i = nomes.findIndex((a) => a.getAttribute('data-lista-porta') === slug);
      nomes[i - 1]?.focus();
    }, alvo);
    await p.keyboard.press('Tab');
    const focado = await p.evaluate(
      (slug) => document.activeElement?.getAttribute('data-lista-porta') === slug,
      alvo,
    );
    const comFocoNoNome = await p.evaluate(PAR, alvo);
    await p.__ctx.close();

    medidas.par = { repouso, comRatoNoNome, comRatoNaArea, comFocoNoNome, outroComRatoNaArea };

    const numero = (s) => Number.parseFloat(String(s));
    const mapaRespondeAoNome =
      chegouAoNome && numero(comRatoNoNome.traco) > numero(repouso.traco);
    const soAquela = comRatoNoNome.outrosTracos.every((t) => numero(t) === numero(repouso.traco));
    const listaRespondeAoMapa =
      chegouAArea && numero(comRatoNaArea.sublinhado) > numero(repouso.sublinhado);
    const soAquele = numero(outroComRatoNaArea.sublinhado) === numero(repouso.sublinhado);
    const tecladoResponde = focado && numero(comFocoNoNome.traco) > numero(repouso.traco);

    conta(
      'L6a · o rato num nome contorna a área daquela unidade, e só dela',
      mapaRespondeAoNome && soAquela,
      `o rato chegou ao nome: ${chegouAoNome} · traço ${repouso.traco} → ${comRatoNoNome.traco} em ${alvo} · as outras 28 ficam em ${comRatoNoNome.outrosTracos.join(', ')}`,
    );
    conta(
      'L6b · o rato numa área marca o nome daquela unidade, e só dele',
      listaRespondeAoMapa && soAquele,
      `o rato chegou à área: ${chegouAArea} · sublinhado ${repouso.sublinhado} → ${comRatoNaArea.sublinhado} em ${alvo} · ${outro} fica em ${outroComRatoNaArea.sublinhado}`,
    );
    conta(
      'L6c · pelo teclado, o mesmo par: o foco num nome contorna a área',
      tecladoResponde,
      `Tab pousa em ${alvo}: ${focado} · traço ${repouso.traco} → ${comFocoNoNome.traco}`,
    );
    conta(
      'L7 · a marca não é só cor: os dois lados mudam uma grandeza que não é cor',
      chegouAoNome &&
        chegouAArea &&
        numero(comRatoNoNome.traco) !== numero(repouso.traco) &&
        numero(comRatoNaArea.sublinhado) !== numero(repouso.sublinhado),
      `contorno ${repouso.traco} → ${comRatoNoNome.traco} · sublinhado ${repouso.sublinhado} → ${comRatoNaArea.sublinhado} · tinta ${repouso.corDoTraco} nos dois estados`,
    );
  }

  /* --------------------------------------------------------------------- L8 */
  for (const e of EDICOES) {
    const r = lido[`${e.chave}_1280`];
    medidas[`painel_${e.chave}`] = r.painel;
    const chaves = r.painel.map((h) => h.chave);
    const esperadas = ['painel_com_limiar', 'painel_social_total'];
    const semMarca = r.painel.filter((h) => !h.chave);
    const comNumeroSolto = r.painel.filter((h) => h.soltos && h.soltos.length);
    conta(
      `L8·${e.chave} · o nome de cada painel traz a contagem da prova, e nenhum algarismo à mão`,
      r.painel.length === 2 &&
        esperadas.every((k) => chaves.includes(k)) &&
        semMarca.length === 0 &&
        comNumeroSolto.length === 0,
      r.painel
        .map((h) => `«${h.texto}» → ${h.chave ?? 'SEM data-prova'} = ${h.algarismo}${h.soltos ? ` (algarismo à mão: ${h.soltos.join(', ')})` : ''}`)
        .join(' · '),
    );
  }
}

/* ===========================================================================
 * OS ESTRAGOS PLANTADOS
 * ===========================================================================
 * Cada um é um defeito que o brief nomeia, posto no HTML no caminho para o
 * navegador. A régua só serve depois de os ver a todos vermelhos.
 */
const soNaPrimeira = (rota) => rota === '/' || rota === '/index.html' || rota === '/en' || rota === '/en/index.html';
const comFolha = (css) => (html, rota) =>
  soNaPrimeira(rota) ? html.replace('</head>', `<style>${css}</style></head>`) : html;

const PLANTAS = [
  {
    nome: 'uma ligação duplicada: o mesmo nome duas vezes na lista',
    celulas: ['L1'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      const m = html.match(/<li><a href="[^"]*\/(?:distritos|districts)\/aveiro"[^>]*>[^<]*<\/a><\/li>/);
      return m ? html.replace(m[0], m[0] + m[0]) : html;
    },
  },
  {
    nome: 'a lista de volta para baixo do mapa, a 1280',
    celulas: ['L2', 'L3'],
    estrago: comFolha(
      '@media (min-width:1024px){.mapa-ilhas{grid-column:2 !important;grid-row:3 !important}.cabeca-inst{grid-row:1 !important}}',
    ),
  },
  {
    nome: 'um grupo escondido numa largura em que uma unidade fica abaixo dos 44 px',
    celulas: ['L4'],
    estrago: comFolha('[data-parcela-lista="continente"]{display:none}'),
  },
  {
    nome: 'um alvo com 40 px',
    celulas: ['L5'],
    estrago: comFolha(
      '.mapa-ilhas-lista a{padding-block:10px !important;line-height:20px !important;min-height:0 !important}',
    ),
  },
  {
    nome: 'o rato num nome sem resposta do mapa (a folha do par retirada)',
    celulas: ['L6', 'L7'],
    estrago: (html, rota) =>
      soNaPrimeira(rota) ? html.replace(/<style>\.cabeca-grelha:has[\s\S]*?<\/style>/, '') : html,
  },
  {
    nome: 'a marca só por cor',
    celulas: ['L6', 'L7'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      const sem = html.replace(/<style>\.cabeca-grelha:has[\s\S]*?<\/style>/, '');
      return sem.replace(
        '</head>',
        '<style>.cabeca-grelha:has([data-lista-porta="lisboa"]:hover) .uni[data-unidade="lisboa"]{stroke:#c00}' +
          '.cabeca-grelha:has([data-uni-porta="lisboa"]:hover) [data-lista-porta="lisboa"]{color:#c00}' +
          '.mapa-ilhas-lista a:hover{text-decoration-thickness:auto !important}</style></head>',
      );
    },
  },
  {
    nome: 'o nome de um painel com uma contagem escrita à mão',
    celulas: ['L8'],
    estrago: (html, rota) => {
      if (!soNaPrimeira(rota)) return html;
      return html.replace(
        /<a class="prova-valor" href="[^"]*" data-prova="painel_com_limiar"[^>]*>\d+<\/a>/,
        '14',
      );
    },
  },
  {
    nome: 'o «data-alvo-abaixo-de» de um grupo com o número trocado',
    celulas: ['L9'],
    estrago: (html, rota) =>
      soNaPrimeira(rota)
        ? html.replace(
            /(data-parcela-lista="continente" data-alvo-abaixo-de=")\d+(")/,
            '$1120$2',
          )
        : html,
  },
];

if (VERMELHOS) {
  console.log('');
  let falhou = false;
  for (const planta of PLANTAS) {
    celulas = [];
    medidas = {};
    ESTRAGO = planta.estrago ?? null;
    await correTudo();
    const tocadas = celulas.filter((c) => planta.celulas.some((n) => c.nome.startsWith(n)));
    const vermelhas = tocadas.filter((c) => !c.passa);
    const apanhou = vermelhas.length > 0;
    if (!apanhou) falhou = true;
    console.log(`  ${apanhou ? verde('vermelho ✓') : vermelho('NÃO APANHOU ✗')}  ${planta.nome}`);
    for (const c of vermelhas.slice(0, 3)) console.log(cinza(`              ${c.nome} · ${c.prova}`));
  }
  ESTRAGO = null;
  console.log('');
  await nav.close();
  servidor.close();
  process.exit(falhou ? 1 : 0);
}

await correTudo();
await nav.close();
servidor.close();

console.log('');
for (const c of celulas) {
  console.log(`  ${c.passa ? verde('✓') : vermelho('✗')} ${c.nome}`);
  console.log(cinza(`      ${c.prova}`));
}
const falhadas = celulas.filter((c) => !c.passa);
console.log('');
console.log(
  falhadas.length === 0
    ? verde(`  ${celulas.length} células, todas verdes.\n`)
    : vermelho(`  ${falhadas.length} de ${celulas.length} células vermelhas.\n`),
);

if (FICHEIRO_JSON) {
  fs.writeFileSync(
    path.resolve(RAIZ, String(FICHEIRO_JSON)),
    JSON.stringify({ celulas, medidas }, null, 2),
  );
}
process.exit(falhadas.length === 0 ? 0 : 1);
