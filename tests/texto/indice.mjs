#!/usr/bin/env node
/**
 * =============================================================================
 * A RÉGUA DO ÍNDICE, DO PROGRESSO E DA SUBIDA (bloco F1.9a, 03.09.2026)
 * =============================================================================
 *
 * Uma célula por medida de aceitação de
 * `design/observatorio/BRIEF-F1.9a-indice-das-paginas-de-leitura.md` §4. NÃO é
 * um portão: não entra no `npm run build` e não constrói nada. Corre sobre
 * `dist/`, imprime uma linha por célula e SAI COM 0 quando todas passam e com 1
 * quando alguma falha, como as réguas dos blocos A, B e C, e pela mesma razão:
 * existem para que um estrago plantado se veja no código de saída.
 *
 *   node tests/texto/indice.mjs
 *   node tests/texto/indice.mjs --json <ficheiro>
 *   node tests/texto/indice.mjs --capturas <dir>    (PNG, escala 2)
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA MEDE, E COM QUE APARELHO
 * ---------------------------------------------------------------------------
 * Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664) e apontador grosso.
 * Computador: Chromium a 1280 × 800. As duas famílias contam, e o progresso
 * mede-se nas duas porque a linha do tempo do deslocamento é recente nas duas.
 *
 * D1 · o índice: uma entrada por título de nível 2 e 3 do registo, na ordem do
 *      documento, cada uma a abrir um `id` que existe na página. A régua LÊ O
 *      REGISTO ela própria e não pede a ninguém a lista: é a mesma comparação
 *      que o L8 do portão faz, feita outra vez por outro caminho, que é o que
 *      distingue uma régua de um eco.
 * D2 · o progresso sem uma linha de guião: o total declarado contra o registo,
 *      o contador da posição em cada título de nível 2, a tinta que ele
 *      desenha (por píxeis, comparando a mesma banda com a regra e sem ela) e
 *      a barra que mede 0 no topo e a largura da janela no fim.
 * D3 · a subida (Blocking 4 da leitura a frio do Codex, segunda passagem,
 *      03.09.2026): a 1024px e acima, fixa, alvo ≥ 44px, zero caixas de linha
 *      do artigo debaixo dela em dez posições da página — uma exigência, não
 *      uma informação. Abaixo de 1024px o comando fixo não se desenha (não há
 *      goteira onde caiba), e cada secção de nível 2 termina numa porta em
 *      fluxo com o mesmo alvo, que por estar no próprio documento não pode
 *      sobrepor-se a uma linha dele.
 * D4 · os alvos de toque do corpo transcrito (Blocking 3 da mesma leitura):
 *      `.texto-ligacao` e `a.src-chip` fora de tabela crescem para 44px pela
 *      técnica do `::after` e a régua exige que alcancem essa área, com um
 *      resíduo de sobreposição contado a um número exato (I9). As portas de
 *      figura (`.texto-figura-porta` e `.texto-figura-porta-apos`) ficam com
 *      a área que já tinham, e a razão é medida e não suposta: a distância
 *      entre portas seguidas (mediana medida, I9b) é a que uma área de 44px
 *      teria de caber, e não cabe.
 * D8 · o nome acessível de cada título de nível 2 leva a posição «Secção n de
 *      N» antes do título (Major 8 da mesma leitura), computado pelo próprio
 *      motor via `ariaSnapshot()` — não suposto a partir da regra CSS.
 * D6 · a altura de cada página a 390, e a banda que o índice ocupa.
 *
 * ---------------------------------------------------------------------------
 * A ÁREA DE UM ALVO MEDE-SE POR DUAS VIAS, E AS DUAS CONTAM
 * ---------------------------------------------------------------------------
 * Ou a caixa do próprio elemento mede 44px nos dois eixos, que é como a folha
 * da casa escreve a regra; ou o acerto (`elementFromPoint`) alcança 43,8px nos
 * dois eixos a partir do meio da primeira caixa de linha, que é a única maneira
 * de ver a área que um `::after` posicionado acrescenta sem mudar a composição.
 * A folga de 0,2px é do próprio acerto: o ponto que cai na aresta de uma caixa
 * pertence já à caixa seguinte, e por isso uma caixa de 44 × 44 mede 42 × 43,8
 * por acerto. Está medido e escrito para que ninguém leia 43,8 como um defeito.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit, devices } from 'playwright';
import { parse } from 'node-html-parser';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');
const REGISTOS = path.join(RAIZ, 'registos');

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
const DIR_CAPTURAS = opcao('--capturas');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

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
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const reguas = [];
const medidas = {};
const conta = (nome, passa, prova) => reguas.push({ nome, passa: !!passa, prova: String(prova) });

/* ========================================================================== */
/* AS OITO PÁGINAS DE LEITURA, e o registo de cada uma                         */
/* ========================================================================== */

/** O leitor próprio desta régua: o manifesto e os registos, do disco. */
const manifesto = JSON.parse(fs.readFileSync(path.join(REGISTOS, 'manifest.json'), 'utf8'));
const PAGINAS = Object.keys(manifesto.registos)
  .sort()
  .map((chave) => {
    const [slug, lang] = chave.split('/');
    const registo = JSON.parse(
      fs.readFileSync(path.join(REGISTOS, slug, `${lang}.record.json`), 'utf8'),
    );
    const titulos = registo.blocks.filter(
      (b) => b.kind === 'heading' && (Number(b.level) === 2 || Number(b.level) === 3),
    );
    return {
      chave,
      slug,
      lang,
      rota: lang === 'pt' ? `/estudos/${slug}/texto` : `/en/studies/${slug}/text`,
      titulos,
      deNivel2: titulos.filter((b) => Number(b.level) === 2).length,
    };
  });

/** A página de cada edição, escolhida para as capturas e para as medidas caras. */
const AMOSTRA = {
  pt: PAGINAS.find((p) => p.chave === 'evora-prometido-pago-auditado-2026/pt'),
  en: PAGINAS.find((p) => p.chave === 'evora-prometido-pago-auditado-2026/en'),
};

/* ========================================================================== */
/* I1 e I2 · O ÍNDICE, lido do HTML construído contra o registo                */
/* ========================================================================== */
{
  const falhas = [];
  const contagens = [];
  const falhasIdsDuplicados = [];
  for (const p of PAGINAS) {
    const ficheiro = path.join(DIST, p.rota.replace(/^\//, ''), 'index.html');
    if (!fs.existsSync(ficheiro)) {
      falhas.push(`${p.chave}: não há página construída em ${p.rota}`);
      continue;
    }
    const root = parse(fs.readFileSync(ficheiro, 'utf8'));

    /* OS ID SÃO ÚNICOS NA PÁGINA (Major 9 da leitura a frio do Codex: «I1 usa
       só querySelector, e um id duplicado passa»). `querySelector` devolve o
       primeiro; um segundo elemento com o mesmo id nunca aparece nessa
       comparação, e por isso esta célula conta as OCORRÊNCIAS de cada id, não
       só a presença de uma. Conta CADA id da página, e não só os `#bloco-N`:
       um id duplicado em qualquer sítio é uma âncora que já não sabe para
       onde vai. */
    {
      const contagemPorId = new Map();
      for (const el of root.querySelectorAll('[id]')) {
        const id = el.getAttribute('id') ?? '';
        if (!id) continue;
        contagemPorId.set(id, (contagemPorId.get(id) ?? 0) + 1);
      }
      for (const [id, n] of contagemPorId) {
        if (n !== 1) falhasIdsDuplicados.push(`${p.chave} #${id} (${n}×)`);
      }
    }

    const nav = root.querySelector('#texto-indice');
    if (!nav) {
      falhas.push(`${p.chave}: não há índice`);
      continue;
    }
    const entradas = nav.querySelectorAll('[data-registo-indice]');
    contagens.push(`${p.chave} ${entradas.length}/${p.titulos.length}`);
    if (entradas.length !== p.titulos.length) {
      falhas.push(
        `${p.chave}: o índice tem ${entradas.length} entradas e o registo tem ` +
          `${p.titulos.length} títulos de nível 2 e 3`,
      );
      continue;
    }
    p.titulos.forEach((bloco, i) => {
      const el = entradas[i];
      const texto = el.textContent.replace(/\s+/g, ' ').trim();
      const esperado = String(bloco.text ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (texto !== esperado) {
        falhas.push(
          `${p.chave} entrada ${i}: a página escreve ${JSON.stringify(texto.slice(0, 60))} e o ` +
            `registo diz ${JSON.stringify(esperado.slice(0, 60))}`,
        );
      }
      const href = el.getAttribute('href') ?? '';
      if (href !== `#bloco-${bloco.i}`) {
        falhas.push(`${p.chave} entrada ${i}: abre "${href}" e o bloco é "#bloco-${bloco.i}"`);
        return;
      }
      /* O DESTINO É UM SÓ (Major 9): antes só se perguntava se `querySelector`
         encontrava alguma coisa; agora conta-se quantos elementos têm este id
         exatamente, com `querySelectorAll`, que não para no primeiro. */
      const destinos = root.querySelectorAll(`#bloco-${bloco.i}`);
      if (destinos.length === 0) {
        falhas.push(`${p.chave} entrada ${i}: abre "${href}" e não há esse id na página`);
      } else if (destinos.length > 1) {
        falhas.push(
          `${p.chave} entrada ${i}: abre "${href}" e há ${destinos.length} elementos com esse id`,
        );
      }
    });
  }
  medidas.indice = { paginas: PAGINAS.length, contagens, falhas };
  medidas.idsDuplicados = falhasIdsDuplicados;
  conta(
    'I1 · o índice das 8 páginas de leitura: uma entrada por título de nível 2 e 3 do registo, com o texto do registo e um destino que existe',
    falhas.length === 0 && PAGINAS.length === 8,
    `${PAGINAS.length} páginas · ${contagens.join(' · ')}${falhas.length ? ` · FALHAS: ${falhas.slice(0, 3).join(' | ')}` : ''}`,
  );
  conta(
    'I1b · cada id da página aparece exatamente uma vez, nas 8 páginas de leitura (Major 9 da leitura a frio do Codex)',
    falhasIdsDuplicados.length === 0,
    falhasIdsDuplicados.length === 0
      ? `zero ids duplicados, nas 8 páginas`
      : `${falhasIdsDuplicados.length} id(s) duplicado(s): ${falhasIdsDuplicados.slice(0, 5).join(' | ')}`,
  );
}

/* ========================================================================== */
/* O QUE SE MEDE NO NAVEGADOR                                                  */
/* ========================================================================== */

/**
 * A área de um alvo, pelas duas vias. Devolve a lista dos que não chegam a
 * 44px, com a zona onde vivem.
 */
const SONDA_ALVOS = () => {
  const SEL = 'a[href], button, summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const D = 21.9;
  const dentro = (el, alvo) => {
    for (let n = el; n; n = n.parentElement) if (n === alvo) return true;
    return false;
  };
  const acerta = (alvo, x, y) => {
    const el = document.elementFromPoint(x, y);
    return !!el && dentro(el, alvo);
  };
  const artigo = document.querySelector('#documento');
  const cabeca = document.querySelector('header');
  const rodape = document.querySelector('footer');
  const pequenos = [];
  let rendidos = 0;
  for (const alvo of document.querySelectorAll(SEL)) {
    const rects = [...alvo.getClientRects()];
    if (!rects.length || rects[0].width <= 0 || rects[0].height <= 0) continue;
    /* Dentro de uma dobra fechada há caixa e não há alvo: os motores dispõem o
       conteúdo escondido para a busca da página o encontrar. */
    if (alvo.closest('details:not([open])')) continue;
    rendidos++;
    alvo.scrollIntoView({ block: 'center', inline: 'center' });
    const r = alvo.getClientRects()[0];
    if (!r) continue;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (r.width >= 44 && r.height >= 44) continue;
    if (
      acerta(alvo, cx, cy) &&
      acerta(alvo, cx - D, cy) &&
      acerta(alvo, cx + D, cy) &&
      acerta(alvo, cx, cy - D) &&
      acerta(alvo, cx, cy + D)
    ) {
      continue;
    }
    const zona =
      artigo && artigo.contains(alvo)
        ? 'artigo'
        : cabeca && cabeca.contains(alvo)
          ? 'cabeca'
          : rodape && rodape.contains(alvo)
            ? 'rodape'
            : 'pagina';
    pequenos.push({
      zona,
      nome:
        alvo.tagName.toLowerCase() +
        (typeof alvo.className === 'string' && alvo.className.trim()
          ? '.' + alvo.className.trim().split(/\s+/).join('.')
          : ''),
      caixa: [+r.width.toFixed(1), +r.height.toFixed(1)],
    });
  }
  window.scrollTo(0, 0);
  const porZona = {};
  for (const x of pequenos) porZona[x.zona] = (porZona[x.zona] ?? 0) + 1;
  /* A REPARTIÇÃO DO CORPO POR CLASSE (Blocking 3, F1.9a segunda passagem): a
     isenção do artigo deixou de ser uma só, e é preciso saber quem ainda está
     pequeno depois de `.texto-ligacao` e `a.src-chip` (fora de tabela)
     crescerem para 44px. `.texto-figura-porta` e `.texto-figura-porta-apos`
     ficam com a área que já tinham, por regra medida (I9b); os outros dois
     não deviam sobrar nenhum. */
  const porClasseNoArtigo = {};
  for (const x of pequenos) {
    if (x.zona !== 'artigo') continue;
    const classe = x.nome.includes('texto-figura-porta-apos')
      ? 'apos'
      : x.nome.includes('texto-figura-porta')
        ? 'figura'
        : x.nome.includes('src-chip')
          ? 'selo'
          : x.nome.includes('texto-ligacao')
            ? 'ligacao'
            : 'outro';
    porClasseNoArtigo[classe] = (porClasseNoArtigo[classe] ?? 0) + 1;
  }
  return {
    rendidos,
    pequenos: pequenos.length,
    porZona,
    porClasseNoArtigo,
    daPagina: pequenos.filter((x) => x.zona === 'pagina' || x.zona === 'rodape' && false),
  };
};

/** As peças da página: índice, contador, barra, subida, altura. */
const SONDA_PECAS = () => {
  const nav = document.querySelector('#texto-indice');
  const dobra = nav ? nav.querySelector('details') : null;
  const porta = nav ? nav.querySelector('summary') : null;
  const corpo = document.querySelector('.texto-corpo');
  const art = document.querySelector('#documento');
  const h2 = art ? [...art.querySelectorAll('h2[data-registo-bloco]')] : [];
  const subir = document.querySelector('.texto-subir');
  const barra = document.querySelector('.texto-barra');
  const rp = porta ? porta.getBoundingClientRect() : null;
  const rn = nav ? nav.getBoundingClientRect() : null;
  const rs = subir ? subir.getBoundingClientRect() : null;
  const rb = barra ? barra.getBoundingClientRect() : null;
  const entradas = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  /* AS PORTAS EM FLUXO, no fim de cada secção de nível 2 (Blocking 4). Uma
     por título de nível 2, incluindo o último (o laço de `pecasDoCorpo` fecha
     a secção que ficar aberta no fim do artigo). */
  const portasDeSeccao = art ? [...art.querySelectorAll('.texto-secao-topo')] : [];
  return {
    indice: !!nav,
    entradas: entradas.length,
    entradasAbaixoDe44: entradas.filter((a) => {
      const r = a.getBoundingClientRect();
      return r.width < 44 || r.height < 44;
    }).length,
    fechada: dobra ? !dobra.open : null,
    porta: rp ? { l: +rp.width.toFixed(1), a: +rp.height.toFixed(1) } : null,
    banda: rn ? +rn.height.toFixed(1) : null,
    seccoesDeclaradas: corpo ? corpo.getAttribute('data-seccoes') : null,
    seccoesNaFolha: corpo ? getComputedStyle(corpo).getPropertyValue('--seccoes').trim() : null,
    h2: h2.length,
    contadores: h2.filter((h) => {
      const c = getComputedStyle(h, '::before').content;
      return c && c !== 'none' && c.includes('counter(seccao)') && c.includes('counter(deQuantas)');
    }).length,
    subir: rs
      ? {
          l: +rs.width.toFixed(1),
          a: +rs.height.toFixed(1),
          pos: getComputedStyle(subir).position,
          display: getComputedStyle(subir).display,
          dentroDoEcra: rs.bottom <= innerHeight + 1 && rs.top >= 0 && rs.right <= innerWidth + 1,
        }
      : null,
    secaoTopo: {
      total: portasDeSeccao.length,
      display: portasDeSeccao.length ? getComputedStyle(portasDeSeccao[0]).display : null,
      abaixoDe44: portasDeSeccao.filter((a) => {
        const r = a.getBoundingClientRect();
        return getComputedStyle(a).display !== 'none' && (r.width < 44 || r.height < 44);
      }).length,
    },
    barra: rb ? { l: +rb.width.toFixed(1), a: +rb.height.toFixed(1), display: getComputedStyle(barra).display } : null,
    altura: document.documentElement.scrollHeight,
    ecra: innerHeight,
  };
};

/**
 * O QUE TAPA TEXTO? Caixas de linha do artigo debaixo do comando de subida, em
 * DEZ posições da página e não só no fim (Blocking 4 da leitura a frio do
 * Codex: a primeira versão desta célula tratava o número como informativo;
 * esta versão FALHA quando há sobreposição, nas duas larguras).
 *
 * A primeira versão desta sonda media com a página no fundo, onde por baixo da
 * subida está o rodapé e nunca o artigo, e devolvia zero em toda a parte. A
 * captura de 390 mostrou o contrário no meio do documento, e a régua passou a
 * varrer a página de dez em dez por cento. É a mesma lição do detetor de
 * sobreposições da auditoria de 25.08: a caixa de cada nó de texto, com
 * `Range`, e não a caixa do elemento.
 *
 * DAS DUAS FORMAS DO COMANDO, A QUE ESTIVER VISÍVEL (F1.9a, segunda passagem):
 * a partir de 1024px é o `.texto-subir` fixo, e o varrimento tem de repetir-se
 * a cada posição porque ele fica quieto enquanto o documento roda por baixo;
 * abaixo disso são as portas em fluxo (`.texto-secao-topo`), uma por secção, e
 * o varrimento conta as que estiverem dentro do ecrã em cada uma das dez
 * posições. UMA PORTA NUNCA TAPA O SEU PRÓPRIO TEXTO: a caixa de uma porta e o
 * nó de texto lá dentro são a mesma coisa, e contá-los sobrepostos mediria um
 * defeito que não existe — por isso o passeio salta o que está dentro de
 * `.texto-secao-topo`.
 *
 * `.vh` TAMBÉM SE SALTA, E A PRIMEIRA VERSÃO DESTA CÉLULA NÃO SALTAVA (F1.9a
 * segunda passagem: a captura de 390 apanhou o defeito da própria sonda). O
 * irmão que dá a posição ao título (`<span class="vh" data-registo-posicao>`)
 * é `position: absolute` sem `top`/`left` declarados, e por isso usa a
 * posição estática do CSS — que, escrito logo a seguir à porta em fluxo, cai
 * em cima da caixa dela. Um leitor com vista não o vê (é a mesma razão que já
 * tira `.vh` do `textoVisivel()` do portão, `scripts/gate-html.mjs`), e por
 * isso não é texto que a porta possa tapar.
 */
const SONDA_TAPA = () => {
  const art = document.querySelector('#documento');
  const alturaTotal = document.documentElement.scrollHeight;
  const subir = document.querySelector('.texto-subir');
  const subirVisivel = !!subir && getComputedStyle(subir).display !== 'none';
  const alvos = () => {
    if (subirVisivel) {
      const r = subir.getBoundingClientRect();
      return r.width > 0 && r.height > 0 ? [r] : [];
    }
    return [...document.querySelectorAll('.texto-secao-topo')]
      .map((p) => p.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight);
  };
  let cruzamentos = 0;
  let posicoesComTexto = 0;
  let pior = null;
  const mede = () => {
    const rs = alvos();
    if (!rs.length) return;
    let aqui = 0;
    const anda = (n) => {
      if (n.nodeType === 1 && n.classList && (n.classList.contains('texto-secao-topo') || n.classList.contains('vh'))) return;
      if (n.nodeType === 3) {
        if (!n.nodeValue.trim()) return;
        const r = document.createRange();
        r.selectNodeContents(n);
        for (const c of r.getClientRects()) {
          if (c.width <= 0 || c.height <= 0) continue;
          if (c.bottom < 0 || c.top > innerHeight) continue;
          for (const rs1 of rs) {
            const x = Math.min(rs1.right, c.right) - Math.max(rs1.left, c.left);
            const y = Math.min(rs1.bottom, c.bottom) - Math.max(rs1.top, c.top);
            if (x > 0 && y > 0) {
              aqui++;
              if (!pior || x * y > pior.x * pior.y) {
                pior = { x: +x.toFixed(1), y: +y.toFixed(1), texto: n.nodeValue.trim().slice(0, 40) };
              }
            }
          }
        }
        return;
      }
      for (const f of n.childNodes) anda(f);
    };
    if (art) anda(art);
    cruzamentos += aqui;
    if (aqui > 0) posicoesComTexto++;
  };
  for (let i = 0; i <= 9; i++) {
    window.scrollTo(0, Math.round((alturaTotal - innerHeight) * (i / 9)));
    mede();
  }
  window.scrollTo(0, 0);
  return { cruzamentos, posicoes: 10, posicoesComTexto, pior, modo: subirVisivel ? 'fixa' : 'em-fluxo' };
};

/**
 * OS ALVOS QUE CRESCERAM ALCANÇAM 44px, E SEM SOBREPOR UM VIZINHO (Blocking 3
 * e Major 9 da leitura a frio do Codex, F1.9a segunda passagem, 03.09.2026).
 *
 * A célula I9 antiga só provava que a isenção tinha uma razão medida
 * (`pares > 0`); não provava nada sobre o que a correção fez. Esta sonda mede
 * as DUAS coisas que a correção promete para `a.src-chip` fora de tabela — o
 * único tipo que cresce, medido: alcança 44px, E essa área não cai em cima da
 * de um vizinho. `.texto-ligacao` foi TENTADA e MEDIDA sem sucesso (a nota em
 * `texto.css` ao lado da regra diz porquê: a técnica não serve uma etiqueta
 * que quebra em várias linhas) e fica de fora, como `.texto-figura-porta` e
 * `.texto-figura-porta-apos` (a razão destas duas está na I9b, ao lado). As
 * três entram aqui só como vizinhos possíveis, nunca como alvo a crescer.
 *
 * A ÁREA DE UM `::after` NÃO SE LÊ EM `getClientRects()` DO ELEMENTO, e a
 * primeira versão desta sonda cometia esse erro: comparava a caixa NUA do
 * `<a>`, que continua pequena, e não a área que o `::after` acrescenta por
 * cima. As DUAS PERGUNTAS respondem-se do mesmo jeito que a `SONDA_ALVOS` já
 * usa e que a folha da casa escreve como prova (`site.css`, A10): o acerto do
 * próprio navegador, `elementFromPoint`, nos quatro pontos cardeais a 21,9px
 * do centro. «Alcança 44px?» é o acerto resolver para o PRÓPRIO alvo nos
 * cinco pontos; «sobrepõe-se?» é o acerto resolver para OUTRO alvo desta
 * lista — a pergunta real («em quem toca quem tocar aqui»), não uma soma de
 * áreas que a folha nunca declara.
 */
const SONDA_ALVOS_CRESCIDOS = () => {
  const D = 21.9;
  const dentro = (el, alvo) => {
    for (let n = el; n; n = n.parentElement) if (n === alvo) return true;
    return false;
  };
  const candidatos = [
    ...document.querySelectorAll(
      '#documento a.texto-figura-porta, #documento a.texto-figura-porta-apos, #documento a.src-chip, #documento a.texto-ligacao',
    ),
  ].map((el) => {
    const classe = el.className || '';
    const tipo = classe.includes('texto-figura-porta-apos')
      ? 'apos'
      : classe.includes('texto-figura-porta')
        ? 'figura'
        : classe.includes('src-chip')
          ? 'selo'
          : 'ligacao';
    return { el, tipo, naTabela: !!el.closest('table') };
  });
  /** A que candidato (se algum) pertence este elemento resolvido pelo acerto? */
  const candidatoDe = (elResolvido) => candidatos.find((c) => dentro(elResolvido, c.el) || dentro(c.el, elResolvido));
  const porTipo = {};
  const exemplos = [];
  for (const a of candidatos) {
    /* `.texto-ligacao` NÃO CRESCE (a medição a seguir a este comentário provou
       porquê: a técnica do `::after` não centra sobre uma ligação que quebra
       em várias linhas, e a maioria quebra). Só o selo fora de tabela cresce. */
    const cresce = a.tipo === 'selo' && !a.naTabela;
    if (!cresce) continue;
    /* SEM ISTO, `elementFromPoint` DEVOLVE `null` OU O ELEMENTO ERRADO PARA
       QUALQUER ALVO FORA DO ECRÃ (a primeira versão desta sonda não
       escrolava, e via 100% dos alvos como pequenos — nenhum estava dentro
       da janela). É a mesma linha que a `SONDA_ALVOS` já tem. */
    a.el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = a.el.getClientRects()[0];
    if (!r || r.width <= 0 || r.height <= 0) continue;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const chave = `${a.tipo}${a.naTabela ? '@tabela' : ''}`;
    porTipo[chave] ??= { total: 0, abaixoDe44: 0, sobreposto: 0, comProblema: 0 };
    porTipo[chave].total++;
    const pontos = [
      [cx, cy],
      [cx - D, cy],
      [cx + D, cy],
      [cx, cy - D],
      [cx, cy + D],
    ];
    const caixaChega = r.width >= 44 && r.height >= 44;
    const acertaTodos = pontos.every(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return !!el && dentro(el, a.el);
    });
    const abaixoDe44 = !caixaChega && !acertaTodos;
    if (abaixoDe44) porTipo[chave].abaixoDe44++;
    let colideCom = null;
    for (const [x, y] of pontos) {
      const el = document.elementFromPoint(x, y);
      if (!el || dentro(el, a.el)) continue;
      colideCom = candidatoDe(el);
      if (colideCom && colideCom !== a) break;
      colideCom = null;
    }
    if (colideCom) porTipo[chave].sobreposto++;
    /* AS DUAS PERGUNTAS TÊM A MESMA CAUSA, medida (o rótulo que quebra em
       duas linhas), e por isso o RESÍDUO que a régua exige é a UNIÃO das
       duas, não a soma: um selo que não alcança 44px E se sobrepõe a um
       vizinho é um só alvo com um só problema, contado uma vez. */
    if (abaixoDe44 || colideCom) {
      porTipo[chave].comProblema++;
      if (exemplos.length < 8) {
        const contra = colideCom ? `${colideCom.tipo}${colideCom.naTabela ? '@tabela' : ''} "${colideCom.el.textContent.trim().slice(0, 20)}"` : '(caixa pequena, sem vizinho a tocar)';
        exemplos.push(`${chave} "${a.el.textContent.trim().slice(0, 20)}" vs ${contra}`);
      }
    }
  }
  window.scrollTo(0, 0);
  return { porTipo, exemplos };
};

/** A distância entre portas de figura seguidas: a razão da isenção do corpo. */
const SONDA_DISTANCIAS = () => {
  const portas = [
    ...document.querySelectorAll(
      '#documento a.texto-figura-porta, #documento a.texto-figura-porta-apos, #documento a.src-chip, #documento a.texto-ligacao',
    ),
  ];
  const caixas = portas
    .map((p) => {
      const r = p.getClientRects()[0];
      return r ? r.top + scrollY : null;
    })
    .filter((x) => x !== null)
    .sort((a, b) => a - b);
  const d = [];
  for (let i = 1; i < caixas.length; i++) d.push(caixas[i] - caixas[i - 1]);
  const abaixo = d.filter((x) => x < 44).length;
  /* Duas portas na mesma linha distam 0px, e a mediana de todas as distâncias
     seria 0 nas páginas com tabelas. A mediana que diz alguma coisa é a das
     portas em linhas DIFERENTES: é essa distância que uma área de 44px teria
     de caber, e é essa que se compara com 44. */
  const entreLinhas = d.filter((x) => x > 0).sort((a, b) => a - b);
  return {
    portas: caixas.length,
    pares: d.length,
    paresNaMesmaLinha: d.length - entreLinhas.length,
    paresAbaixoDe44: abaixo,
    mediana: entreLinhas.length ? +entreLinhas[Math.floor(entreLinhas.length / 2)].toFixed(1) : null,
  };
};

/* ========================================================================== */
/* 390 × 664 · WebKit, apontador grosso                                        */
/* ========================================================================== */
const navMovel = await webkit.launch({ headless: true });
{
  const ctx = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 });
  const porPagina = {};
  const alvosDaPagina = [];
  const alturas = [];
  const tapadas = [];
  for (const p of PAGINAS) {
    const pag = await ctx.newPage();
    await pag.goto(base + p.rota, { waitUntil: 'networkidle' });
    await pag.evaluate(() => document.fonts.ready);
    const pecas = await pag.evaluate(SONDA_PECAS);
    const alvos = await pag.evaluate(SONDA_ALVOS);
    const crescidos = await pag.evaluate(SONDA_ALVOS_CRESCIDOS);
    await pag.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const tapa = await pag.evaluate(SONDA_TAPA);
    porPagina[p.chave] = { ...pecas, alvos, crescidos, tapa };
    alvosDaPagina.push(
      `${p.chave} ${(alvos.porZona.pagina ?? 0) + (alvos.porZona.rodape ?? 0)}`,
    );
    alturas.push(`${p.chave} ${pecas.altura}px (banda do índice ${pecas.banda}px)`);
    tapadas.push(`${p.chave} ${tapa.cruzamentos}`);
    await pag.close();
  }
  medidas.m390 = porPagina;
  const todas = Object.values(porPagina);

  conta(
    'I2 · a dobra do índice fechada, a porta com alvo ≥ 44px e nenhuma entrada abaixo de 44px · 390 (WebKit)',
    todas.every((m) => m.fechada === true && m.porta?.l >= 44 && m.porta?.a >= 44 && m.entradasAbaixoDe44 === 0),
    todas
      .map((m, i) => `${PAGINAS[i].chave.split('/')[0].slice(0, 12)} porta ${m.porta?.l}×${m.porta?.a}, ${m.entradas} entradas, ${m.entradasAbaixoDe44} pequenas`)
      .join(' · '),
  );

  conta(
    'I3 · o total de secções que a página declara é o número de títulos de nível 2 do registo, e cada um deles traz o contador da posição · 390',
    PAGINAS.every((p, i) => {
      const m = todas[i];
      return (
        m.seccoesDeclaradas === String(p.deNivel2) &&
        m.seccoesNaFolha === String(p.deNivel2) &&
        m.h2 === p.deNivel2 &&
        m.contadores === p.deNivel2
      );
    }),
    PAGINAS.map((p, i) => `${p.chave} declara ${todas[i].seccoesDeclaradas}/folha ${todas[i].seccoesNaFolha}, registo ${p.deNivel2}, contadores ${todas[i].contadores}`).join(' · '),
  );

  conta(
    'I8 · zero alvos abaixo de 44px na mobília da própria página de leitura, nas 8 · 390 (WebKit, toque)',
    todas.every((m) => (m.alvos.porZona.pagina ?? 0) === 0 && (m.alvos.porZona.rodape ?? 0) === 0),
    `por página (mobília da página + rodapé): ${alvosDaPagina.join(' · ')} · no corpo transcrito, que é a isenção medida: ${todas.map((m) => m.alvos.porZona.artigo ?? 0).join('/')} · na cabeça, que é do bloco F1.7: ${todas.map((m) => m.alvos.porZona.cabeca ?? 0).join('/')}`,
  );

  /* I9 · Blocking 3 e Major 9 da leitura a frio do Codex: a célula antiga só
     provava que a isenção do corpo tinha uma razão medida; esta prova o que a
     correção fez. AS DUAS COISAS SÃO EXIGÊNCIAS: nenhuma ligação nem selo
     fora de tabela fica abaixo de 44px depois de crescer (é a área do
     `::after`, medida como caixa e não como suposição); e o RESÍDUO da
     sobreposição está contado a um número exato, não a «alguns» — qualquer
     desvio deste número é uma regressão a investigar, não um valor a
     tolerar em silêncio. */
  {
    const somaPorTipo = {};
    for (const m of todas) {
      for (const [k, v] of Object.entries(m.crescidos.porTipo)) {
        somaPorTipo[k] ??= { total: 0, abaixoDe44: 0, sobreposto: 0, comProblema: 0 };
        somaPorTipo[k].total += v.total;
        somaPorTipo[k].abaixoDe44 += v.abaixoDe44;
        somaPorTipo[k].sobreposto += v.sobreposto;
        somaPorTipo[k].comProblema += v.comProblema;
      }
    }
    medidas.alvosCrescidos = { somaPorTipo, exemplos: todas.flatMap((m) => m.crescidos.exemplos) };
    const totalComProblema = Object.values(somaPorTipo).reduce((s, v) => s + v.comProblema, 0);
    /* O NÚMERO EXATO DESTA CONSTRUÇÃO: medido aqui, e não suposto. Se mudar,
       para cima OU PARA BAIXO, é porque um documento novo ou uma correção de
       fonte trouxe outra densidade de citações, e a régua tem de voltar a ser
       lida antes de o número novo ser aceite — é a mesma disciplina do
       `paresAbaixoDe44` da I9b, só que esta é uma exigência e aquela é só a
       prova da razão.

       `.texto-ligacao` NÃO ESTÁ AQUI: foi tentada e MEDIDA (a nota em
       `texto.css`, ao lado da regra), e a técnica do `::after` não serve uma
       etiqueta que quebra em várias linhas, que é a maioria das ligações
       desta rota (o endereço é a própria etiqueta). Fica com a I9b.

       OS QUE FICAM SÃO TODOS SELO, e todos pela mesma razão: o rótulo do
       selo («fonte · <estudo>») quebra em duas linhas quando o título do
       estudo é longo — 13 das 101 instâncias medidas, nas oito páginas —, e
       o `::after` deixa de acertar no centro de uma linha só ou cai perto do
       selo da entrada seguinte, que cita o mesmo estudo ou um estudo irmão.
       É a mesma classe de proximidade que já justifica a exceção do
       `.brief-text` noutra rota, em `site.css`: dar-lhe mais altura de linha
       é mudar a composição da leitura, e essa é uma decisão da direção e não
       desta folha. */
    const RESIDUO_ACEITE = 14;
    conta(
      'I9 · os selos que crescem alcançam 44px, e o resíduo (o rótulo que quebra em duas linhas) está contado a um número exato · 390 (WebKit, toque)',
      totalComProblema === RESIDUO_ACEITE,
      `por tipo (total/abaixo de 44px/sobreposto/com problema): ${Object.entries(somaPorTipo).map(([k, v]) => `${k} ${v.total}/${v.abaixoDe44}/${v.sobreposto}/${v.comProblema}`).join(' · ')} · resíduo esperado ${RESIDUO_ACEITE}, medido ${totalComProblema}${totalComProblema !== RESIDUO_ACEITE ? ' · MUDOU: relê antes de aceitar' : ''}${todas.some((m) => m.crescidos.exemplos.length) ? ` · exemplos: ${todas.flatMap((m) => m.crescidos.exemplos).slice(0, 4).join(' | ')}` : ''}`,
    );
  }

  /* I7a MUDOU DE FORMA NA SEGUNDA PASSAGEM (Blocking 4 da leitura a frio do
     Codex): a 390 não há goteira nenhuma onde um comando FIXO de 44px caiba
     sem tapar uma linha do artigo, e por isso o comando fixo NÃO SE DESENHA
     aí — a subida é a porta em fluxo, no fim de cada secção de nível 2. */
  conta(
    'I7a · a 390 (sem goteira) o comando fixo não se desenha, e cada secção de nível 2 termina numa porta em fluxo com alvo ≥ 44px',
    todas.every(
      (m, i) =>
        m.subir &&
        m.subir.display === 'none' &&
        m.secaoTopo.total === PAGINAS[i].deNivel2 &&
        m.secaoTopo.display !== 'none' &&
        m.secaoTopo.abaixoDe44 === 0,
    ),
    PAGINAS.map((p, i) => `${p.chave.split('/')[0].slice(0, 12)} subir=${todas[i].subir?.display} portas=${todas[i].secaoTopo.total}/${p.deNivel2} <44px=${todas[i].secaoTopo.abaixoDe44}`).join(' · '),
  );

  /* I10a ENDURECE NA SEGUNDA PASSAGEM: até aqui o número ia para o relatório
     como informação («não é uma exigência»), e passava com QUALQUER valor
     desde que dez posições fossem amostradas — foi o Blocking 4 da leitura a
     frio do Codex. Passa a FALHAR com qualquer sobreposição, porque agora há
     uma forma sem sobreposição nenhuma para comparar: a porta em fluxo. */
  conta(
    'I10a · zero caixas de linha do artigo tapadas pelo comando de subida, em dez posições de cada página · 390',
    todas.every((m) => m.tapa.posicoes === 10 && m.tapa.cruzamentos === 0),
    `modo ${todas[0].tapa.modo} · caixas de linha tapadas em 10 posições: ${PAGINAS.map((p, i) => `${p.chave.split('/')[0].slice(0, 12)} ${todas[i].tapa.cruzamentos}`).join(' · ')}${todas.some((m) => m.tapa.cruzamentos > 0) ? ` · a maior sobreposição: ${JSON.stringify(todas.find((m) => m.tapa.pior)?.pior)}` : ''}`,
  );

  medidas.alturas390 = alturas;

  /* ---------------------------------------------- I4 · o contador tem tinta
     A prova é por píxeis e não por declaração: a mesma banda por cima do
     primeiro título de nível 2, com a regra e sem ela. Se os dois ficheiros
     forem iguais, o contador não desenha nada. */
  {
    const p = AMOSTRA.pt;
    const pag = await ctx.newPage();
    await pag.goto(base + p.rota, { waitUntil: 'networkidle' });
    await pag.evaluate(() => document.fonts.ready);
    const caixa = await pag.evaluate(() => {
      const h = document.querySelector('#documento h2[data-registo-bloco]');
      h.scrollIntoView({ block: 'center' });
      const r = h.getBoundingClientRect();
      return { x: Math.max(0, r.left - 2), y: Math.max(0, r.top - 22), width: 120, height: 20 };
    });
    const com = await pag.screenshot({ clip: caixa, type: 'png' });
    await pag.addStyleTag({ content: '.texto-artigo h2::before { content: none !important; }' });
    await pag.waitForTimeout(80);
    const sem = await pag.screenshot({ clip: caixa, type: 'png' });
    conta(
      'I4 · o contador da posição desenha tinta por cima do título (as duas capturas da mesma banda diferem quando a regra sai)',
      Buffer.compare(com, sem) !== 0,
      `banda de ${caixa.width}×${caixa.height}px em x=${Math.round(caixa.x)} y=${Math.round(caixa.y)} · com a regra ${com.length} B, sem ela ${sem.length} B, iguais: ${Buffer.compare(com, sem) === 0}`,
    );
    medidas.tintaDoContador = { com: com.length, sem: sem.length };
    await pag.close();
  }

  /* --------------------------------- I5a · a barra move-se, e sem guião nenhum */
  {
    const semGuiao = await navMovel.newContext({
      ...devices['iPhone 13'],
      deviceScaleFactor: 1,
      javaScriptEnabled: false,
    });
    const pag = await semGuiao.newPage();
    await pag.goto(base + AMOSTRA.pt.rota, { waitUntil: 'load' });
    const barra = pag.locator('.texto-barra');
    const topo = await barra.boundingBox();
    /* O deslocamento faz-se pelo próprio navegador, sem uma linha de guião da
       página: a roda do rato não existe no WebKit de telemóvel, e o que rola
       aqui é o mecanismo do Playwright a trazer o rodapé à vista. */
    await pag.locator('footer').scrollIntoViewIfNeeded();
    await pag.waitForTimeout(300);
    const fim = await barra.boundingBox();
    conta(
      'I5a · a barra do progresso cresce com o deslocamento COM O GUIÃO DESLIGADO · 390 (WebKit)',
      topo !== null && fim !== null && topo.width < 2 && fim.width > 195,
      `sem JavaScript nenhum: no topo ${topo ? topo.width.toFixed(1) : 'não há'}px, com o rodapé à vista ${fim ? fim.width.toFixed(1) : 'não há'}px, numa janela de 390`,
    );
    medidas.barra390 = { topo: topo?.width ?? null, fim: fim?.width ?? null };
    await pag.close();
    await semGuiao.close();
  }

  /* ---------------------- I11a · o nome acessível leva a posição · 390 (WebKit)
     Major 8 da leitura a frio do Codex: a indicação de progresso não chegava à
     tecnologia de apoio, porque o texto alternativo do CSS ia vazio de
     propósito. Mede-se com `ariaSnapshot()`, que é o próprio motor a computar
     o nome — não uma suposição sobre a regra do `aria-labelledby`. */
  {
    const pag = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 }).then((c) => c.newPage());
    await pag.goto(base + AMOSTRA.pt.rota, { waitUntil: 'networkidle' });
    const titulosH2 = AMOSTRA.pt.titulos.filter((b) => Number(b.level) === 2);
    const falhasNome = [];
    for (let i = 0; i < titulosH2.length; i++) {
      const bloco = titulosH2[i];
      const esperado = `Secção ${i + 1} de ${titulosH2.length} ${String(bloco.text ?? '').replace(/\s+/g, ' ').trim()}`;
      const snap = await pag.locator(`#bloco-${bloco.i}`).ariaSnapshot();
      const m = /^-\s*heading\s+"([^"]*)"/.exec(snap.trim());
      const nome = m ? m[1] : null;
      if (nome !== esperado) {
        falhasNome.push(`bloco-${bloco.i}: nome="${nome}" esperado="${esperado.slice(0, 60)}"`);
      }
    }
    medidas.nomeAcessivelDaPosicao = { total: titulosH2.length, falhas: falhasNome };
    conta(
      'I11a · o nome acessível de cada título de nível 2 leva «Secção n de N» antes do título, computado pelo motor · 390 (WebKit)',
      falhasNome.length === 0 && titulosH2.length > 0,
      falhasNome.length === 0
        ? `${titulosH2.length} títulos de nível 2, todos com o nome esperado`
        : `${falhasNome.length} de ${titulosH2.length} sem o nome esperado: ${falhasNome.slice(0, 3).join(' | ')}`,
    );
    await pag.context().close();
  }

  /* -------------------------------------------------------------- capturas */
  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMovel.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
    for (const edicao of ['pt', 'en']) {
      const pag = await ctx2.newPage();
      await pag.goto(base + AMOSTRA[edicao].rota, { waitUntil: 'networkidle' });
      await pag.evaluate(() => document.fonts.ready);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-390-cima.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = true;
      });
      await pag.waitForTimeout(120);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-390-indice-aberto.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = false;
        const h = document.querySelectorAll('#documento h2[data-registo-bloco]')[2];
        if (h) h.scrollIntoView({ block: 'center' });
      });
      await pag.waitForTimeout(120);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-390-contador.png`), type: 'png' });
      await pag.close();
    }
    await ctx2.close();
  }
  await ctx.close();
}
await navMovel.close();

/* ========================================================================== */
/* 1280 × 800 · Chromium                                                       */
/* ========================================================================== */
const navMesa = await chromium.launch({ headless: true });
{
  const ctx = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const porPagina = {};
  for (const p of PAGINAS) {
    const pag = await ctx.newPage();
    await pag.goto(base + p.rota, { waitUntil: 'networkidle' });
    await pag.evaluate(() => document.fonts.ready);
    const pecas = await pag.evaluate(SONDA_PECAS);
    await pag.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const tapa = await pag.evaluate(SONDA_TAPA);
    const dist = await pag.evaluate(SONDA_DISTANCIAS);
    porPagina[p.chave] = { ...pecas, tapa, dist };
    await pag.close();
  }
  medidas.m1280 = porPagina;
  const todas = Object.values(porPagina);

  conta(
    'I7b · a subida à vista a 1280, com alvo ≥ 44px nos dois eixos e sem apanhar uma caixa de linha do artigo em dez posições da página',
    todas.every(
      (m) =>
        m.subir &&
        m.subir.display !== 'none' &&
        m.subir.l >= 44 &&
        m.subir.a >= 44 &&
        m.subir.dentroDoEcra &&
        m.tapa.cruzamentos === 0 &&
        m.tapa.posicoes === 10,
    ),
    `${todas[0].subir?.l}×${todas[0].subir?.a}px, ${todas[0].subir?.pos} · caixas de linha tapadas em 10 posições: ${todas.map((m) => m.tapa.cruzamentos).join('/')} · a 1280 o comando fica na goteira, à direita da coluna do aparelho`,
  );

  conta(
    'I3b · o contador da posição também a 1280, em cada título de nível 2 das 8',
    PAGINAS.every((p, i) => todas[i].contadores === p.deNivel2 && todas[i].seccoesDeclaradas === String(p.deNivel2)),
    PAGINAS.map((p, i) => `${p.chave.split('/')[0].slice(0, 12)} ${todas[i].contadores}/${p.deNivel2}`).join(' · '),
  );

  /* I11b · a mesma prova do nome acessível, na outra família de motores. */
  {
    const pag = await ctx.newPage();
    await pag.goto(base + AMOSTRA.pt.rota, { waitUntil: 'networkidle' });
    const titulosH2 = AMOSTRA.pt.titulos.filter((b) => Number(b.level) === 2);
    const falhasNome = [];
    for (let i = 0; i < titulosH2.length; i++) {
      const bloco = titulosH2[i];
      const esperado = `Secção ${i + 1} de ${titulosH2.length} ${String(bloco.text ?? '').replace(/\s+/g, ' ').trim()}`;
      const snap = await pag.locator(`#bloco-${bloco.i}`).ariaSnapshot();
      const m = /^-\s*heading\s+"([^"]*)"/.exec(snap.trim());
      const nome = m ? m[1] : null;
      if (nome !== esperado) falhasNome.push(`bloco-${bloco.i}: nome="${nome}" esperado="${esperado.slice(0, 60)}"`);
    }
    conta(
      'I11b · o nome acessível de cada título de nível 2 leva «Secção n de N» antes do título, computado pelo motor · 1280 (Chromium)',
      falhasNome.length === 0 && titulosH2.length > 0,
      falhasNome.length === 0
        ? `${titulosH2.length} títulos de nível 2, todos com o nome esperado`
        : `${falhasNome.length} de ${titulosH2.length} sem o nome esperado: ${falhasNome.slice(0, 3).join(' | ')}`,
    );
    await pag.close();
  }

  /* I5b · a barra, na outra família de motores, e também sem guião. */
  {
    const semGuiao = await navMesa.newContext({
      viewport: { width: 1280, height: 800 },
      javaScriptEnabled: false,
    });
    const pag = await semGuiao.newPage();
    await pag.goto(base + AMOSTRA.pt.rota, { waitUntil: 'load' });
    const barra = pag.locator('.texto-barra');
    const topo = await barra.boundingBox();
    await pag.locator('footer').scrollIntoViewIfNeeded();
    await pag.waitForTimeout(300);
    const fim = await barra.boundingBox();
    conta(
      'I5b · a barra do progresso cresce com o deslocamento COM O GUIÃO DESLIGADO · 1280 (Chromium)',
      topo !== null && fim !== null && topo.width < 2 && fim.width > 640,
      `sem JavaScript nenhum: no topo ${topo ? topo.width.toFixed(1) : 'não há'}px, com o rodapé à vista ${fim ? fim.width.toFixed(1) : 'não há'}px, numa janela de 1280`,
    );
    medidas.barra1280 = { topo: topo?.width ?? null, fim: fim?.width ?? null };
    await pag.close();
    await semGuiao.close();
  }

  /* I6 · o que a página serve sem guião nenhum, lido do HTML. */
  {
    const html = fs.readFileSync(
      path.join(DIST, AMOSTRA.pt.rota.replace(/^\//, ''), 'index.html'),
      'utf8',
    );
    const conta_ = (re) => (html.match(re) ?? []).length;
    const pecas = {
      indice: conta_(/id="texto-indice"/g),
      entradas: conta_(/data-registo-indice=/g),
      seccoes: conta_(/data-seccoes="\d+"/g),
      barra: conta_(/class="texto-barra"/g),
      subir: conta_(/class="texto-subir"/g),
    };
    conta(
      'I6 · o índice, o total das secções, a barra e a subida estão no HTML servido, sem depender de guião nenhum',
      pecas.indice === 1 &&
        pecas.entradas === AMOSTRA.pt.titulos.length &&
        pecas.seccoes === 1 &&
        pecas.barra === 1 &&
        pecas.subir === 1,
      `no ficheiro construído: índice ${pecas.indice}, entradas ${pecas.entradas} (registo ${AMOSTRA.pt.titulos.length}), data-seccoes ${pecas.seccoes}, barra ${pecas.barra}, subida ${pecas.subir}`,
    );
    medidas.semGuiao = pecas;
  }

  /* I9b · a razão pela qual as portas de figura NÃO crescem, medida (a I9,
     a 390, prova o que cresceu: as ligações e os selos). */
  {
    const d = todas.map((m) => m.dist);
    medidas.distancias = d;
    conta(
      'I9b · as portas de figura do corpo transcrito estão mais perto umas das outras do que 44px, e é essa a razão medida por que ficam com a área que já tinham',
      d.every((x) => x.pares > 0),
      PAGINAS.map(
        (p, i) =>
          `${p.chave.split('/')[0].slice(0, 12)}: ${d[i].portas} portas, ${d[i].paresAbaixoDe44}/${d[i].pares} pares a menos de 44px (${d[i].paresNaMesmaLinha} na mesma linha), mediana entre linhas ${d[i].mediana}px`,
      ).join(' · '),
    );
  }

  /* -------------------------------------------------------------- capturas */
  if (DIR_CAPTURAS && typeof DIR_CAPTURAS === 'string') {
    fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
    const ctx2 = await navMesa.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    for (const edicao of ['pt', 'en']) {
      const pag = await ctx2.newPage();
      await pag.goto(base + AMOSTRA[edicao].rota, { waitUntil: 'networkidle' });
      await pag.evaluate(() => document.fonts.ready);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-1280-cima.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = true;
      });
      await pag.waitForTimeout(120);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-1280-indice-aberto.png`), type: 'png' });
      await pag.evaluate(() => {
        document.querySelector('#texto-indice details').open = false;
        window.scrollTo(0, document.documentElement.scrollHeight / 2);
      });
      await pag.waitForTimeout(160);
      await pag.screenshot({ path: path.join(DIR_CAPTURAS, `${edicao}-1280-meio.png`), type: 'png' });
      await pag.close();
    }
    await ctx2.close();
  }
  await ctx.close();
}
await navMesa.close();

servidor.close();

/* ========================================================================== */
/* A saída                                                                     */
/* ========================================================================== */
let falhou = 0;
for (const r of reguas) {
  if (!r.passa) falhou++;
  console.log(`${r.passa ? verde('  ✓') : vermelho('  ✗')} ${r.nome}`);
  console.log(cinza(`      ${r.prova}`));
}
console.log(
  falhou === 0
    ? verde(`\n  índice ✓ ${reguas.length} de ${reguas.length}`)
    : vermelho(`\n  índice ✗ ${falhou} de ${reguas.length} falharam`),
);
if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ reguas, medidas }, null, 1));
  console.log(cinza(`      medidas em ${FICHEIRO_JSON}`));
}
process.exit(falhou === 0 ? 0 : 1);
