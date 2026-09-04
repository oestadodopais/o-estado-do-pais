#!/usr/bin/env node
/**
 * A MATRIZ DE ACEITAÇÃO DA PRIMEIRA PÁGINA (plano §13).
 *
 * NÃO é um portão: não entra no `npm run build` e não falha nada por si. Corre
 * sobre `dist/` num Chromium sem cabeça e imprime UMA LINHA POR CÉLULA, com
 * «passa» ou «falha» e a prova ao lado. O que ele mede é o que a v2 nunca teve
 * de medir, porque a v2 não tinha estado: teclado, foco, anúncio, história,
 * recarga, edição, tema, largura, movimento reduzido, valores inválidos, e a
 * rendição sem JavaScript.
 *
 *   node tests/inicio/matriz.mjs             imprime a matriz
 *   node tests/inicio/matriz.mjs --json <f>  guarda também os despejos de texto
 *   node tests/inicio/matriz.mjs --capturas <dir>   guarda as capturas
 *
 * O servidor é o mesmo padrão de `scripts/medir-tipos.mjs`: um servidor de
 * ficheiros estáticos sobre `dist/`, na porta que o sistema der.
 *
 * ---------------------------------------------------------------------------
 * AS CÉLULAS DO MAPA DE PONTOS, DECIDIDAS UMA A UMA (Emenda 20, 27.08.2026)
 * ---------------------------------------------------------------------------
 * A Emenda 20a tirou os 308 pontos da primeira página e pôs lá as 29 unidades da
 * Carta como áreas; a 20c fez o mapa render-se também no telemóvel; a 20d deixou
 * os pontos exactamente onde estavam, no cartão localizador da página do
 * concelho. Uma dúzia de células desta matriz media o mapa de pontos na primeira
 * página, e a primeira delas morria num `null`.
 *
 * A REGRA QUE AS DECIDIU, E NENHUMA FICOU A PASSAR POR NÃO MEDIR NADA:
 *
 *   · uma célula cujo OBJECTO NÃO MUDOU continua a medir o que media (a postura
 *     nas duas superfícies, o cartão na página do concelho, a cabeça em duas
 *     colunas, a ficha do mapa numa linha);
 *   · uma célula cujo objecto MUDOU DE SUPERFÍCIE muda de porta e mantém a
 *     pergunta: a neutralidade dos 308 pontos e o anel do concelho escolhido
 *     medem-se em `/municipios/evora`, que é onde os pontos vivem; o rótulo do
 *     distrito mede-se na página do concelho, que é onde ele se lê; e a metade
 *     da primeira página passa a medir as 29 áreas, que é o que lá está;
 *   · uma célula cujo objecto DEIXOU DE EXISTIR é retirada com a razão escrita no
 *     lugar dela, e o que ela passa a medir é o FACTO QUE A RETIROU, nunca um sim
 *     vazio: as dicas do mapa, a inalcançabilidade abaixo de 640, a densidade dos
 *     pontos e o anel de leitura. Cada uma nomeia onde é que o que ela media
 *     passou a ser medido.
 *
 * O que o mapa da primeira página faz é medido em
 * `tests/inicio/mapa-distritos.mjs`, com as suas células e os seus estragos
 * plantados; a régua da Emenda 19 (`tests/inicio/mapa-navegacao.mjs`) foi
 * acertada no mesmo dia, com as N1, N2 e N3 a medir o que mediam e a N4
 * declarada retirada.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
/* A MATRIZ LÊ UMA COISA DE FORA DO `dist/`, e é o artefacto do mapa: os limites
   do canto que as ilhas deixam (o lado direito da moldura dos Açores e o fundo
   da caixa do continente) saem de `mapa/pais.json` e não de dois números
   escritos aqui. Uma célula que perguntasse à página se ela concorda com ela
   própria não media nada. */

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

const navegador = await chromium.launch({ headless: true });
const celulas = [];
const despejos = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

/** Uma página nova, com as opções do contexto que a célula pede. */
async function pagina({
  largura = 1280,
  js = true,
  movimento = null,
  /* A preferência do SISTEMA. Desde a Emenda 12 (21.08.2026) ela não decide
     nada: a folha é clara para toda a gente. Continua a poder emular-se, porque
     é isso que uma das células novas tem de provar. */
  sistema = 'light',
  /* A ESCOLHA DO LEITOR, guardada no aparelho: `'dark'`, `'light'` ou nada. */
  escolhaGuardada = null,
} = {}) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    javaScriptEnabled: js,
    reducedMotion: movimento === 'reduce' ? 'reduce' : 'no-preference',
    colorScheme: sistema === 'dark' ? 'dark' : 'light',
  });
  if (escolhaGuardada) {
    await contexto.addInitScript((v) => {
      try {
        localStorage.setItem('tema', v);
      } catch (e) {
        /* um aparelho que recusa o armazenamento fica em claro, e a célula vê-o */
      }
    }, escolhaGuardada);
  }
  const p = await contexto.newPage();
  p.__contexto = contexto;
  return p;
}

const estadoDaPagina = (p) =>
  p.evaluate(() => {
    const raiz = document.querySelector('[data-inicio]');
    const bloco = document.querySelector('[data-cabeca]:not([hidden])');
    /* A ÁREA DE LEITURA ENTROU NO LUGAR DO PAINEL (F1.1b, 04.09.2026). A grelha
       das treze peças e a lista compacta do Painel Social saíram da primeira
       página, e no lugar delas está a área de leitura: dois blocos
       `[data-leituras]` (um por quadro) com um `<details data-leitura>` por
       medida. O que estas leituras medem é o mesmo — quantas dobras há, quantas
       estão abertas, e que bloco está à vista —, medido na coisa que agora lá
       está. Um seletor que continuasse a procurar `.peca` contava zero, e um
       zero que ninguém recusa é uma régua cega. */
    const painel = document.querySelector('[data-leituras]');
    return {
      ambito: raiz?.getAttribute('data-ambito') ?? null,
      densidade: raiz?.getAttribute('data-densidade') ?? null,
      modo: raiz?.getAttribute('data-modo') ?? null,
      bloco: bloco?.getAttribute('data-cabeca') ?? null,
      painel: painel?.getAttribute('data-leituras') ?? null,
      h1: document.querySelector('[data-cabeca]:not([hidden]) h1')?.textContent.trim() ?? null,
      anuncio: document.querySelector('[data-anuncio]')?.textContent.trim() ?? '',
      url: location.pathname + location.search,
      abertas: [...document.querySelectorAll('[data-leituras] [data-leitura]')].filter(
        (d) => d.open,
      ).length,
      pecas: document.querySelectorAll('[data-leituras] [data-leitura]').length,
      /* As do Procedimento à parte: são as treze da Emenda 16, e é essa a
         contagem que a célula a seguir exige. */
      pdm: document.querySelectorAll('[data-leituras="pdm"] [data-leitura]').length,
      /* `data-escolher` saiu desta lista com os botões da pesquisa (Emenda 19a):
         um resultado é hoje uma ligação para a página do concelho, e o foco lê-se
         pelo elemento. */
      focado: document.activeElement
        ? document.activeElement.getAttribute('data-modo') ??
          document.activeElement.getAttribute('data-densidade') ??
          document.activeElement.getAttribute('data-regiao') ??
          document.activeElement.id ??
          document.activeElement.tagName
        : null,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      /* O despejo de texto exclui `script` e `style`, como todas as réguas
         desta casa: a ilha de dados do instrumento é JSON, e não é texto que o
         leitor veja. Sem esta exclusão, o despejo trazia os ids das linhas. */
      texto: [...document.querySelectorAll('body *')]
        .filter(
          (e) =>
            !e.closest('[hidden]') &&
            e.children.length === 0 &&
            !e.matches('script, style, template'),
        )
        .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n'),
    };
  });

/* ------------------------------------------------------- 1. estados, teclado, foco */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const inicial = await estadoDaPagina(p);
  conta('estado inicial · País · Relance', inicial.ambito === 'pais' && inicial.densidade === 'relance', `${inicial.ambito} · ${inicial.densidade} · ${inicial.pecas} peças`);
  /* A MANCHETE DA EMENDA 16: duas contagens, e o nome do Procedimento por
     extenso. A célula lê o texto e as duas chaves da prova que o compõem. */
  const manchete = await p.evaluate(() => {
    const h1 = document.querySelector('[data-cabeca]:not([hidden]) h1');
    return {
      texto: h1.textContent.replace(/\s+/g, ' ').trim(),
      provas: [...h1.querySelectorAll('[data-prova]')].map((e) => e.getAttribute('data-prova')),
    };
  });
  conta(
    '2l · a manchete do País leva as duas contagens da Emenda 16',
    /Procedimento dos Desequil|Macroeconomic Imbalance Procedure/.test(manchete.texto) &&
      manchete.provas.join(',') === 'painel_fora_do_limiar,painel_dentro_do_limiar',
    `${manchete.texto} · ${manchete.provas.join(' + ')}`,
  );
  /* AS TREZE DA EMENDA 16 CONTAM-SE ONDE ELAS AGORA ESTÃO: na primeira metade
     da área de leitura, que é a do Procedimento. A área inteira tem 21, que são
     as 13 do Procedimento mais as 8 do Painel Social, e as duas contagens
     medem-se para que uma medida que troque de metade não passe. */
  conta(
    'a área de leitura do País com 13 leituras do Procedimento e 21 ao todo (Emenda 16)',
    inicial.pdm === 13 && inicial.pecas === 21,
    `${inicial.pdm} do Procedimento · ${inicial.pecas} ao todo`,
  );

  /* Ordem do teclado: da linha de comando até às portas, sem saltos para trás. */
  const ordem = await p.evaluate(() => {
    const alvos = [...document.querySelectorAll('a[href],button,summary,input,[tabindex]')].filter(
      (e) => !e.closest('[hidden]') && e.offsetParent !== null,
    );
    const marco = (sel) => alvos.findIndex((e) => e.matches(sel) || e.closest(sel));
    return {
      /* O PRIMEIRO MARCO MUDOU COM O F1.1 (03.09.2026). Era a linha de comando,
         que saiu da página inteira com o bloco da porta da frente (brief §1,
         item 6); o que ocupa o lugar dela na ordem do teclado é a porta para o
         concelho, que é a primeira paragem do corpo depois da cabeça. A célula
         mede o que sempre mediu: que a ordem do teclado desce a página sem
         saltos para trás. */
      comando: marco('[data-porta-concelho]'),
      painel: marco('[data-leituras]'),
      portas: marco('.portas'),
      total: alvos.length,
    };
  });
  conta(
    'ordem do teclado · porta do concelho → painel → portas',
    ordem.comando >= 0 && ordem.comando < ordem.painel && ordem.painel < ordem.portas,
    `porta do concelho ${ordem.comando} · painel ${ordem.painel} · portas ${ordem.portas} · ${ordem.total} paragens`,
  );

  /* AS MUDANÇAS DE ESTADO PASSAM DE CINCO A TRÊS (correções de UX, bloco A,
     itens A2 e A3, 25.08.2026). Os dois passos que saíram — «âmbito → modo
     região» e «região → Alentejo» — pediam um comando que já não existe.

     O COMANDO «REGIÃO» VOLTOU E OS PASSOS NÃO (Emenda 21b, 27.08.2026): ele é
     uma PORTA para `/regioes` e não um estado desta página, e uma mudança de
     página não é uma mudança de estado. O estado `?ambito=regiao:<slug>` deixou
     de existir, e o que a Emenda 7 promete a um endereço partilhado passa a ser
     o reencaminhamento, medido na célula 2i·1 e em `tests/inicio/regioes.mjs`.
     O foco no comando de «Concelho» passou a ir para o CAMPO da pesquisa (item
     A1), e a célula do foco mede o que ela sempre mediu: que ele não se perde no
     corpo do documento. */
  /* O TERCEIRO PASSO SAIU COM A ESCOLHA (Emenda 19a, 26.08.2026). Era
     `[data-escolher="evora"]`, o botão da pesquisa que escolhia o âmbito de um
     concelho dentro desta página; um resultado é hoje uma ligação para
     `/municipios/evora`, e uma mudança de página não é uma mudança de estado. O
     que ela fazia é medido em `tests/inicio/mapa-navegacao.mjs`. */
  /* ---------------------------------------------------------------------------
     A PÁGINA DEIXOU DE TER COMANDO QUE ESCREVA UM ESTADO (F1.1, 03.09.2026)
     ---------------------------------------------------------------------------
     Os dois passos que restavam eram cliques na fila do âmbito e na da
     densidade. As duas saíram da página com o bloco da porta da frente: eram
     vocabulário da casa («Âmbito», «Densidade»), custavam 116 px do primeiro
     ecrã do telemóvel, e a frase que as substituiria é texto do diretor que ele
     não escreveu (achado C6 e decisão 3.4 da auditoria de 25.08; brief F1.1 §1,
     item 6: «os dois comandos saem e o que fica é o menu e o cabeçalho»).

     OS ESTADOS NÃO SAÍRAM: continuam a resolver-se pelo ENDEREÇO, que é o que a
     Emenda 7 promete a um endereço partilhável, e é isso que estes passos passam
     a medir. O que se perde é a maneira de os escrever de dentro da página, e
     com ela o foco que ia para o comando e a região viva que anunciava a
     mudança: sem mudança de estado dentro da página não há nada para anunciar,
     e uma célula que exigisse um anúncio numa navegação estaria a pedir à página
     que dissesse em voz alta o que o navegador acabou de fazer.

     A CÉLULA DO FOCO E A DO ANÚNCIO SÃO SUBSTITUÍDAS POR UMA: que a página não
     tem comando nenhum de estado. É a prova de que a subtracção aconteceu e não
     ficou meia. */
  const passos = [
    ['/?densidade=leitura', 'densidade → leitura'],
    ['/?ambito=municipio', 'âmbito → modo concelho'],
  ];
  const historia = [];
  for (const [endereco, nome] of passos) {
    await p.goto(base + endereco, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    historia.push(e);
    conta(`mudança · ${nome}`, true, `${e.url} · ${e.bloco}`);
    despejos[`estado:${e.url}`] = e.texto;
  }
  const semComando = await p.evaluate(() => ({
    comandos: document.querySelectorAll('[data-comando]').length,
    modos: document.querySelectorAll('[data-inicio] [data-modo]').length,
    densidades: document.querySelectorAll('[data-inicio] [data-densidade]').length,
  }));
  conta(
    'a página não tem comando de estado nenhum',
    semComando.comandos === 0 && semComando.modos === 0 && semComando.densidades === 0,
    `${semComando.comandos} linha(s) de comando · ${semComando.modos} comando(s) de âmbito · ${semComando.densidades} de densidade`,
  );

  /* O PAINEL DE ÉVORA SAIU DA PRIMEIRA PÁGINA (Emenda 19a). A célula media que o
     âmbito de um concelho abria as suas peças aqui; as peças do concelho vivem em
     `/municipios/evora`, e `tests/municipio/concelhos.mjs` mede-as lá. */

  /* Andar para trás e para a frente na história dos estados que ficaram. */
  let ok = true;
  for (let i = historia.length - 2; i >= 0; i--) {
    await p.goBack();
    const e = await estadoDaPagina(p);
    if (e.url !== historia[i].url || e.bloco !== historia[i].bloco) ok = false;
  }
  conta('para trás, cinco vezes', ok, ok ? 'cada passo repôs o seu estado' : 'um passo não repôs');
  await p.goForward();
  const depoisDaFrente = await estadoDaPagina(p);
  conta('para a frente', depoisDaFrente.url === historia[1].url, depoisDaFrente.url);

  /* Recarga em cada estado. */
  let recargaOk = true;
  const recargas = [];
  for (const e of historia) {
    await p.goto(base + e.url, { waitUntil: 'networkidle' });
    const r = await estadoDaPagina(p);
    recargas.push(`${e.url} → ${r.bloco}`);
    if (r.bloco !== e.bloco || r.densidade !== e.densidade) recargaOk = false;
  }
  conta('recarga em cada estado', recargaOk, recargas.join(' · '));

  /* A peça abre-se sozinha, e o comando global não apaga a escolha das outras. */
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  await p.click('[data-leituras] .dobra:first-child .dobra-abrir');
  const uma = await estadoDaPagina(p);
  conta('uma leitura abre só a sua', uma.abertas === 1, `${uma.abertas} abertas`);
  /* O ENDEREÇO ABRE TODAS, e é o que restou do comando global: `?densidade=
     leitura` continua a ser um estado partilhável e o guião continua a abrir as
     peças quando ele chega. O que saiu foi a fila que o escrevia. */
  await p.goto(`${base}/?densidade=leitura`, { waitUntil: 'networkidle' });
  const todas = await estadoDaPagina(p);
  conta('o endereço da leitura breve abre todas', todas.abertas === todas.pecas && todas.pecas > 0, `${todas.abertas} de ${todas.pecas}`);

  await p.__contexto.close();
}

/* ------------------------------------------------------------ 2. valores inválidos */
{
  const p = await pagina();
  const maus = [
    ['?ambito=lisboa', 'ambito=lisboa'],
    ['?densidade=fundo', 'densidade=fundo'],
    ['?ambito=municipio:evora;alert(1)', 'ambito com injecção'],
    /* A VIZINHANÇA DO VALOR NOVO (etapa 2m). `municipio` passou a ser um valor
       do esquema — a vista de escolha —, e por isso o que interessa medir é que
       o esquema não alargou com ele: nem o plural, nem o prefixo sem slug, nem
       um slug que não existe. */
    ['?ambito=municipios', 'o plural de um valor válido'],
    ['?ambito=municipio:', 'o prefixo sem concelho'],
    [`?ambito=${'a'.repeat(2000)}`, 'ambito de 2 000 caracteres'],
    /* `?ambito=regiao:atlantida` SAIU DESTA LISTA (Emenda 21b, 27.08.2026). Era
       um valor que caía no defeito; passou a ser um endereço antigo, e um
       endereço antigo REENCAMINHA — uma região que não existe leva ao índice das
       regiões, como um concelho sem página leva ao índice dos 308. Uma célula
       que espera `url === '/'` mediria o contrário do que a emenda manda. O
       reencaminhamento é medido na célula 2i·1 e em `tests/inicio/regioes.mjs`. */
  ];
  for (const [q, nome] of maus) {
    await p.goto(`${base}/${q}`, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    /* «Sem texto de erro» mede-se contra o VALOR: a página não pode repetir o
       que veio no endereço. Procurar a palavra «erro» daria falso positivo, que
       a porta de correcções («Encontrou um erro») já garante em todas as
       páginas do sítio. */
    const bruto = decodeURIComponent(q.split('=').slice(1).join('='));
    /* A comparação é sensível à caixa, e é de propósito: o valor do endereço
       vem em caixa baixa («lisboa») e a página escreve os nomes próprios em
       caixa alta («Grande Lisboa», que o instrumento da convergência mostra).
       Comparar sem caixa dava um falso positivo por uma palavra que a página
       tem por outra razão. O que se mede é o ECO do valor tal como veio. */
    const semEco = !e.texto.includes(bruto);
    const passa = e.ambito === 'pais' && e.densidade === 'relance' && e.url === '/' && semEco;
    conta(
      `valor inválido · ${nome}`,
      passa,
      passa
        ? `caiu em ${e.ambito}/${e.densidade}, endereço normalizado para "${e.url}", e o valor não é ecoado na página`
        : `âmbito ${e.ambito} · densidade ${e.densidade} · endereço "${e.url}" · valor ecoado: ${!semEco}`,
    );
  }
  await p.__contexto.close();
}

/* ----------------------------------------------------- 3. edições e troca de idioma */
{
  for (const [rota, edicao] of [['/', 'pt'], ['/en', 'en']]) {
    const p = await pagina();
    /* O ESTADO MEDIDO PASSA A SER A PESQUISA ABERTA E A DENSIDADE (Emenda 21b).
       Era `?ambito=regiao:alentejo&densidade=leitura`, e o âmbito região deixou
       de ser um estado desta página: um endereço com ele reencaminha, e uma
       célula que o lê do endereço mediria uma página que já lá não está. Os dois
       estados que ficam são os dois que o esquema tem, e a pergunta é a mesma —
       o estado sobrevive à troca de edição. */
    await p.goto(`${base}${rota}?ambito=municipio&densidade=leitura`, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    conta(`edição ${edicao} · estado do endereço`, e.ambito === 'municipio' && e.densidade === 'leitura', `${e.ambito} · ${e.densidade}`);
    const href = await p.evaluate(() => document.querySelector('a.lang')?.getAttribute('href') ?? '');
    conta(
      `edição ${edicao} · a ligação de idioma leva o estado`,
      href.includes('ambito=municipio') && href.includes('densidade=leitura'),
      href,
    );
    despejos[`edicao:${edicao}`] = e.texto;
    await p.__contexto.close();
  }
}

/* ---------------------------------------------------- 4. larguras, temas, movimento */
{
  /* 1024 entrou na varredura a 21.08.2026, por instrução da leitura da
     pré-visualização n.º 1 — e foi a largura nova que apanhou um defeito de
     82px (90px na edição inglesa) que nenhuma das outras quatro via. */
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina({ largura });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    conta(`largura ${largura} · sem transbordo horizontal`, e.transbordo <= 0, `scrollWidth − clientWidth = ${e.transbordo}`);
    if (DIR_CAPTURAS) {
      fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
      await p.screenshot({ path: path.join(DIR_CAPTURAS, `inicio-${largura}-pt-claro.png`), fullPage: true });
    }
    await p.__contexto.close();
  }
  /* OS DOIS TEMAS, PELO CAMINHO QUE A EMENDA 12 DEIXOU.
     O escuro deixou de vir da preferência do sistema: vem do controlo do
     cabeçalho, e a escolha fica no aparelho do leitor. A célula escreve a
     escolha em `localStorage` antes de a página correr — que é o estado de quem
     carregou no botão numa visita anterior — e deixa a guarda do `<head>`
     aplicá-la. Pôr o atributo à mão mediria a folha; assim mede-se o caminho. */
  for (const tema of ['claro', 'escuro']) {
    const p = await pagina({ escolhaGuardada: tema === 'escuro' ? 'dark' : 'light' });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const cores = await p.evaluate(() => {
      const c = getComputedStyle(document.body);
      const sq = document.querySelector('.sq-fora');
      return {
        papel: c.backgroundColor,
        tinta: c.color,
        marcador: sq ? getComputedStyle(sq).backgroundColor : null,
        contorno: sq ? getComputedStyle(sq).borderTopColor : null,
      };
    });
    conta(`tema ${tema} · papel e tinta`, cores.papel !== cores.tinta, `papel ${cores.papel} · tinta ${cores.tinta}`);
    conta(`tema ${tema} · o contorno do marcador é a tinta do tema`, cores.contorno === cores.tinta, `contorno ${cores.contorno}`);
    await p.__contexto.close();
  }
  {
    const p = await pagina({ movimento: 'reduce' });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const t = await p.evaluate(() => {
      const peca = document.querySelector('.dobra');
      return peca ? getComputedStyle(peca).transitionDuration : null;
    });
    /* O Chromium sem cabeça, com o movimento reduzido emulado, escreve
       `1e-05s` em vez de `0s`: a duração é a que o motor força, e o que se mede
       é que nenhuma transição sobrevive. */
    const segundos = parseFloat(t);
    conta(
      'movimento reduzido · a leitura não tem transição',
      Number.isFinite(segundos) && segundos <= 0.001,
      `transition-duration ${t}`,
    );
    await p.__contexto.close();
  }
}

/* --------------------------------------------------------- 5. o selo, alvo e aninho */
/* A LEITURA ABRE-SE ANTES DE SE MEDIR (F1.1b, 04.09.2026). O selo de uma medida
   vive hoje no pé da sua leitura breve, que é um `<details>` fechado: o conteúdo
   de uma dobra fechada não tem caixa nenhuma, e medir o alvo ali dava zero. O
   endereço `?densidade=leitura` é o estado partilhável que abre as 21, e é como
   um leitor as abre. É a mesma coisa que a célula sempre mediu — o selo é alvo
   de 44×44, não está dentro de outro alvo, e é o maior alvo da sua leitura —,
   medida onde o leitor a vê. */
{
  const p = await pagina();
  await p.goto(`${base}/?densidade=leitura`, { waitUntil: 'networkidle' });
  const selos = await p.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('.dobra a.src-chip')) {
      const antes = getComputedStyle(a, '::after');
      const r = a.getBoundingClientRect();
      /* A área de toque vem de um `::after` posicionado e centrado no elemento.
         Mede-se a caixa do elemento e a da área, e fica a maior das duas. */
      const larguraArea = Math.max(r.width, parseFloat(antes.width) || 0, parseFloat(antes.minWidth) || 0);
      const alturaArea = Math.max(r.height, parseFloat(antes.height) || 0);
      let aninhado = null;
      for (let no = a.parentElement; no; no = no.parentElement) {
        const t = no.tagName.toLowerCase();
        if (t === 'a' || t === 'button' || t === 'summary') {
          aninhado = t;
          break;
        }
      }
      out.push({ w: +larguraArea.toFixed(1), h: +alturaArea.toFixed(1), aninhado });
    }
    return out;
  });
  const com44 = selos.filter((s) => s.w >= 44 && s.h >= 44).length;
  const aninhados = selos.filter((s) => s.aninhado).length;
  conta(
    'o selo de cada leitura é alvo de 44×44',
    selos.length > 0 && com44 === selos.length,
    `${com44} de ${selos.length} selos de leitura · mínimo ${Math.min(...selos.map((s) => s.w))}×${Math.min(...selos.map((s) => s.h))}`,
  );
  conta('nenhum selo dentro de outro alvo', aninhados === 0, `${aninhados} aninhados em ${selos.length}`);

  /* Duas áreas de toque sobrepostas não são um alvo maior: são uma porta que
     abre a linha do vizinho (medição da etapa 1d, ISSUES I13). */
  const sobrepostos = await p.evaluate(() => {
    const caixa = (e) => {
      const r = e.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const w = Math.max(r.width, e.matches('a.src-chip') ? 160 : 44);
      const h = Math.max(r.height, 44);
      return { x1: cx - w / 2, x2: cx + w / 2, y1: cy - h / 2, y2: cy + h / 2 };
    };
    let pares = 0;
    for (const peca of document.querySelectorAll('[data-leituras] .dobra')) {
      const alvos = [...peca.querySelectorAll('a,button,summary')].map(caixa);
      for (let i = 0; i < alvos.length; i++) {
        for (let j = i + 1; j < alvos.length; j++) {
          const a = alvos[i];
          const b = alvos[j];
          if (a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2) pares++;
        }
      }
    }
    return pares;
  });
  conta('nenhum par de áreas de toque sobrepostas na leitura', sobrepostos === 0, `${sobrepostos} pares`);

  const maiorDaFila = await p.evaluate(() => {
    /* A PRIMEIRA LEITURA COM SELO, e não a primeira de todas: as três medidas que
       vivem num domínio têm por leitura uma porta, sem selo e sem pé, e a
       pergunta desta célula é sobre a leitura que tem um. */
    const peca = [...document.querySelectorAll('.dobra')].find((e) => e.querySelector('a.src-chip'));
    if (!peca) return null;
    const selo = peca.querySelector('a.src-chip');
    /* OS OUTROS ALVOS DO CORPO DA LEITURA, E NÃO O `<summary>` (F1.1b,
       04.09.2026). A peça era um cartão com o selo no pé e a dobra a abrir-se
       dentro dele; a leitura É a dobra, e o seu `<summary>` é a linha inteira do
       nome da medida, que é o alvo primário e mede a largura da coluna. Exigir
       que o selo fosse maior do que ele era exigir que o comando que abre a
       leitura fosse mais pequeno do que o recibo lá dentro, que é o contrário do
       que a casa desenha. O que a regra protege continua protegido: dentro do
       corpo da leitura, o selo é o maior alvo, e é o que a I13 pede.

       A PORTA PARA O DOMÍNIO TAMBÉM SAI (segunda passagem, 04.09.2026), e por
       outra razão: é uma porta que a casa decidiu pôr ali, no fim e sozinha na
       sua linha, e não aparelho da leitura. Mede 105,8 × 32 px e o selo 52,5 ×
       19,2, e nenhum dos dois esconde o outro: a célula acima mede que as duas
       áreas efectivas não se tocam. Uma leitura com porta tem exactamente dois
       alvos no corpo, e os dois são destinos declarados. */
    const outros = [...peca.querySelectorAll('.dobra-corpo a, .dobra-corpo button')].filter(
      (e) => e !== selo && !e.closest('.dobra-porta'),
    );
    /* A área de um alvo, e para o selo é a do `::after` que a folha lhe dá: é
       ele que apanha o toque, e não a caixa da unidade em linha. */
    const area = (e) => {
      const r = e.getBoundingClientRect();
      const depois = e.matches('a.src-chip') ? getComputedStyle(e, '::after') : null;
      const w = Math.max(r.width, depois ? parseFloat(depois.minWidth) || 0 : 0, 44);
      const h = Math.max(r.height, depois ? parseFloat(depois.height) || 0 : 0, 44);
      return w * h;
    };
    const aSelo = selo ? area(selo) : 0;
    return { selo: Math.round(aSelo), maiorOutro: Math.round(Math.max(0, ...outros.map(area))) };
  });
  conta(
    'o selo é o maior alvo do corpo da leitura',
    maiorDaFila && maiorDaFila.selo >= maiorDaFila.maiorOutro,
    `selo ${maiorDaFila?.selo}px² · maior outro ${maiorDaFila?.maiorOutro}px²`,
  );
  await p.__contexto.close();
}

/* ------------------------------------------------------------- 6. sem JavaScript */
{
  for (const q of [
    '/',
    /* Dois endereços ANTIGOS, um de cada emenda que tirou um lugar do esquema
       (19a os concelhos, 21b as regiões). Com script reencaminham para a página
       do lugar, ou para o índice quando ela não existe; sem script não há para
       onde reencaminhar, e a página faz o que faz com qualquer valor que não
       conhece: mostra o país, inteiro e correcto. */
    '/?ambito=regiao:alentejo',
    '/?ambito=municipio:beja',
    /* E o estado que ficou, com o significado que lhe resta: sem script a
       pesquisa não pesquisa, e os comandos são ligações que abrem. */
    '/?ambito=municipio',
    '/?densidade=leitura',
  ]) {
    const p = await pagina({ js: false });
    await p.goto(base + q, { waitUntil: 'load' });
    const e = await p.evaluate(() => ({
      bloco: document.querySelector('[data-cabeca]:not([hidden])')?.getAttribute('data-cabeca') ?? null,
      painel: document.querySelector('[data-leituras]')?.getAttribute('data-leituras') ?? null,
      pecas: document.querySelectorAll('[data-leituras] [data-leitura]').length,
      valores: document.querySelectorAll('[data-leituras] [data-claim]').length,
      selos: document.querySelectorAll('[data-leituras] a.src-chip').length,
      ligacoes: [...document.querySelectorAll('[data-comando] a')].map((a) => a.getAttribute('href')),
      nota: document.querySelector('[data-sem-js]') ? true : false,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    /* O QUE «COMPLETO» QUER DIZER MUDOU COM A FORMA, E NÃO COM A PROMESSA
       (F1.1b, 04.09.2026): sem guião a página continua a ser o País em Relance,
       completa e correcta. O que a célula conta é a área de leitura inteira (21
       leituras, o primeiro bloco é o do Procedimento) e os selos que ela leva:
       21, um por leitura, porque desde a segunda passagem de 04.09.2026 as 21
       têm a mesma leitura breve e as três que vivem num domínio ACRESCENTAM a
       porta em vez de trocarem a leitura por ela. Foram 18 durante a primeira
       passagem, e a leitura a frio do Codex mediu o que isso custava. Os VALORES
       são zero nesta área desde o F1.1: os 21 valores selados aparecem uma vez
       só, no cartão da faixa. */
    const completo = e.bloco === 'pais' && e.painel === 'pdm' && e.pecas === 21 && e.selos === 21;
    conta(
      `sem JavaScript · ${q}`,
      completo && e.ligacoes.every(Boolean) && e.transbordo <= 0,
      q === '/'
        ? `completo e correcto: ${e.pecas} leituras, ${e.valores} valores, ${e.selos} selos`
        : `mostra o defeito (${e.bloco}), com os comandos como ligações que abrem: ${e.ligacoes.join(' · ')}`,
    );
    /* A NOTA «SEM JAVASCRIPT» SAIU (Emenda 15). A célula deixa de exigir que ela
       esteja à vista e passa a exigir o contrário: que não exista, e que o que
       ela descrevia continue verdadeiro — os comandos são ligações que abrem, e
       o painel rende-se inteiro. As duas condições estão na célula acima. */
    conta(`sem JavaScript · nenhuma nota de mecânica · ${q}`, e.nota === false, `nota no documento: ${e.nota !== false}`);
    await p.__contexto.close();
  }
}

/* ------------------------------------------------------- 7. as sete da subetapa 2g
 *
 * Sete correcções da revisão do lugar de direcção, e uma célula por cada uma:
 * o que mudou tem de se poder medir, e não só ver numa captura.
 */

/* (1) O sinal de tempo do painel europeu não se lê fora do âmbito País. */
{
  /* A CÉLULA MUDA DE PERGUNTA COM A EMENDA 15. Media que a linha «Painel
     europeu reconferido a …» só se lia no âmbito País; a emenda tirou-a da
     primeira página inteira, porque a mobília do cabeçalho já a leva em todas as
     páginas. O que a célula mede agora é isso: zero na primeira página, uma no
     cabeçalho, e a porta da chave a resolver para o painel. */
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  /* O sinal de tempo da mobília não é uma chave da prova: é a mesma data,
     marcada `data-nonledger="data-de-atualizacao"`, com a porta do painel. A
     chave `painel_reconferido_em` rende-se no Método, e a sua porta é a mesma. */
  const sinal = await p.evaluate(() => ({
    naPagina: document.querySelectorAll('.verificacao').length,
    naMobilia: document.querySelectorAll('header [data-sinal-de-tempo] .mob-leitura-porta .mob-leitura-v').length,
    porta: document.querySelector('header [data-sinal-de-tempo] .mob-leitura-porta')?.getAttribute('href') ?? null,
    ancora: !!document.querySelector('#painel'),
  }));
  conta(
    '2l · a linha da reconferência saiu da primeira página, e a porta abre o painel',
    sinal.naPagina === 0 && sinal.naMobilia === 1 && /#painel$/.test(sinal.porta ?? '') && sinal.ancora,
    `na página ${sinal.naPagina} · na mobília ${sinal.naMobilia} · porta ${sinal.porta}`,
  );
  await p.__contexto.close();
}

/* (2) A FICHA DO MAPA É UMA LINHA (Emenda 17), e a camada de aparelho saiu
   (Emenda 15). A célula mudou de pergunta com as emendas: media que a citação, o
   CSV e as dicas tinham descido para a camada do aparelho; agora mede que a
   camada não existe, que a citação saiu da primeira página, que a linha é a da
   emenda com o seu selo, e que as dicas passaram a descrição acessível do mapa.
   A PORTA DO CSV fica, e a célula di-lo: `scripts/check-dados.mjs` exige que as
   duas edições da primeira página liguem os dois ficheiros. */
{
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const f = await p.evaluate(() => {
    const ficha = document.querySelector('[data-mapa-ficha]');
    const svg = document.querySelector('[data-mapa]');
    const descrito = svg.getAttribute('aria-describedby');
    const desc = descrito ? document.getElementById(descrito) : null;
    return {
      alturaDaFicha: Math.round(ficha.getBoundingClientRect().height),
      aparelho: document.querySelectorAll('[data-mapa-aparelho]').length,
      citacaoNaPagina: document.querySelectorAll('[data-verbatim="caop-fonte"]').length,
      linha: ficha.querySelector('.mapa-linha-fonte')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      seloNaLinha: !!ficha.querySelector('.mapa-linha-fonte a.src-chip'),
      valorNaLinha: ficha.querySelector('.mapa-linha-fonte [data-claim]')?.getAttribute('data-claim') ?? null,
      csv: !!ficha.querySelector('.ligacao-dados'),
      /* «Visível» aqui é «fora de um recorte `.vh`»: um elemento dentro de um
         `.vh` continua a ter caixa (é assim que ele fica na árvore de
         acessibilidade e fora do ecrã), e medir a caixa dizia o contrário do que
         o leitor vê. */
      dicasVisiveis: [...ficha.querySelectorAll('.mapa-hint')].filter((e) => !e.closest('.vh')).length,
      dicasNaDescricao: desc ? desc.querySelectorAll('.mapa-hint').length : 0,
      descricaoOculta: desc ? getComputedStyle(desc).position === 'absolute' : false,
      /* O que a Emenda 20a deixou no lugar das dicas: nenhuma dica em parte
         nenhuma do documento, nenhuma descrição apontada, e o mapa das áreas. */
      dicasNoDocumento: document.querySelectorAll('.mapa-hint').length,
      descrito,
      areas: document.querySelectorAll('[data-areas] a.uni-porta').length,
      pontos: document.querySelectorAll('[data-pontos] .mun').length,
    };
  });
  conta(
    '2l · Emenda 17 · por baixo do mapa uma só linha, com o selo',
    f.aparelho === 0 &&
      f.citacaoNaPagina === 0 &&
      f.seloNaLinha &&
      f.valorNaLinha === 'municipios-portugal-caop-2025' &&
      /CAOP/.test(f.linha ?? ''),
    `«${f.linha}» · ficha ${f.alturaDaFicha}px · camada de aparelho ${f.aparelho} · citação na página ${f.citacaoNaPagina} · CSV ${f.csv}`,
  );
  /* ----------------------------------------------------------------------
     RETIRADA PELA EMENDA 20a · as duas dicas descreviam o mapa de pontos
     ----------------------------------------------------------------------
     Media que as duas dicas do mapa («passe o cursor sobre um ponto para ler o
     município», «Tab até ao mapa, setas para percorrer os municípios vizinhos»)
     eram descrição acessível e não legenda. As duas descreviam gestos sobre os
     308 pontos, e a primeira página deixou de os ter: desenha as 29 unidades da
     Carta como áreas, cada uma uma ligação com o seu nome no `<title>`. O rodapé
     do mapa saiu inteiro com elas, e com ele o `aria-describedby`.

     A REGRA NÃO SE MOVE, porque o seu objecto não existe em superfície nenhuma:
     o cartão localizador da página do concelho nunca teve dicas nem descrição (é
     uma imagem com o seu nome, e não navegação). Uma descrição que prometesse um
     gesto que a página não faz é o defeito que o achado 13 da quarta leitura do
     Codex fechou, e o que fica é a ausência.

     O QUE ESTA CÉLULA MEDE AGORA é o facto que a retirou, e não um sim vazio:
     que não sobrou uma dica no documento nem uma descrição pendurada, e que o
     mapa que está lá é o das áreas. O que a primeira página promete a quem a
     ouve passou a ser medido em `tests/inicio/mapa-distritos.mjs`, célula M6c (o
     foco pousa numa área e o Enter abre a página dela).
     ---------------------------------------------------------------------- */
  conta(
    '2l · RETIRADA (Emenda 20a) · as dicas descreviam o mapa de pontos, que saiu da primeira página',
    f.dicasVisiveis === 0 &&
      f.dicasNaDescricao === 0 &&
      f.dicasNoDocumento === 0 &&
      f.descrito === null &&
      f.areas === 29 &&
      f.pontos === 0,
    `${f.dicasNoDocumento} dicas no documento · aria-describedby ${f.descrito} · ${f.areas} áreas e ${f.pontos} pontos no mapa da primeira página · a leitura pelo teclado passou a mapa-distritos.mjs M6c`,
  );
  await p.__contexto.close();
}

/* (3) A LEITURA ABERTA DÁ À RÉGUA A LARGURA DA COLUNA (F1.1b, 04.09.2026).
 *
 * A célula media duas coisas: que a peça aberta passava a ocupar DUAS COLUNAS da
 * grelha do painel (`grid-column: span 2`) e que a régua deixava de ser um fio.
 * A grelha saiu da primeira página com o painel, e a área de leitura é uma LISTA:
 * uma leitura aberta ocupa a largura toda por construção, e não há duas colunas
 * para ocupar. A metade que sobrevive é a que importava — a régua de uma leitura
 * aberta tem largura de régua e não de fio, e a página não transborda de lado —,
 * e é essa que fica, com a razão escrita aqui em vez de a célula desaparecer.
 *
 * O NÚMERO DE RÉGUAS É O DAS MEDIDAS COM LIMIAR PUBLICADO, e conta-se aqui em vez
 * de se escrever: são as leituras do Procedimento cujo quadro publica um limiar. */
for (const largura of [768, 1280]) {
  const p = await pagina({ largura });
  await p.goto(base + '/?densidade=leitura', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const reguas = [...document.querySelectorAll('[data-leituras] .regua-svg')].map((e) =>
      Math.round(e.getBoundingClientRect().width),
    );
    /* TODAS AS QUE TÊM LIMIAR, sem excepção. A primeira passagem tirava desta
       conta as leituras que levam porta, porque nessa forma elas não tinham
       régua; desde a segunda passagem de 04.09.2026 têm, como todas as outras, e
       a excepção deixou de ter objecto. Onde há linha de limiar há régua. */
    const comLimiar = document.querySelectorAll('[data-leituras] .dobra[data-limiar="sim"]').length;
    return {
      reguas,
      comLimiar,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  conta(
    `largura ${largura} · a régua de uma leitura aberta tem largura de régua`,
    r.reguas.length > 0 &&
      r.reguas.length === r.comLimiar &&
      r.reguas.every((w) => w > 400) &&
      r.transbordo <= 0,
    `${r.reguas.length} régua(s) em ${r.comLimiar} leitura(s) com limiar · a mais estreita ${Math.min(...r.reguas)}px · transbordo ${r.transbordo}`,
  );
  await p.__contexto.close();
}

/* (4) e (4b) SAÍRAM COM A RÉGUA DA CONVERGÊNCIA (correções de UX, bloco A, item
 * A3, 25.08.2026) E VOLTARAM PARA `/regioes` (Emenda 21, 27.08.2026).
 *
 * Mediam a porta do telemóvel do Instrumento n.º 1 — que ela é de palavras, que
 * abre o instrumento, que os rótulos não se sobrepõem lá dentro e que na
 * secretária a porta não existe. Esta nota dizia, a 25.08, que «quando a página
 * das regiões o render, estas duas células voltam com ela, e voltam para lá — a
 * matriz da primeira página não é o sítio de uma coisa que já não está na
 * primeira página». É o que acontece: as duas voltam em
 * `tests/inicio/regioes.mjs`, nas células M2 e M3, e voltam mudadas, porque o
 * objecto delas mudou — a porta do telemóvel deixou de existir e o que o
 * telemóvel tem é a LISTA com barras, uma linha por região, sem rótulos no eixo
 * (Emenda 21a). O que elas mediam continua medido: que a régua se lê num
 * telemóvel e que nada se sobrepõe lá dentro, a 320, 360, 390 e 430.
 *
 * As chaves da prova continuam reconferidas pelo portão a cada construção, e
 * `tests/inicio/correcoes-a.mjs` mede que a régua continua fora de `/`. */

/* (5) A pesquisa com a caixa vazia: os concelhos que têm página.
 *
 * O SEGUNDO CASO SAIU COM A ESCOLHA (Emenda 19a, 26.08.2026). Era «e o concelho
 * escolhido, se houver um», que a caixa vazia mostrava ao lado dos que têm
 * página; não há concelho escolhido na primeira página, e o que um resultado faz
 * é abrir a página do concelho ou dizer que ela ainda não existe, como em
 * `/municipios`. A célula mede a lista com que a pesquisa se apresenta, e o que
 * um resultado é.
 *
 * A CÉLULA DEIXA DE ASSUMIR A COBERTURA (bloco dos 308, P2). Media «um
 * resultado, Évora» e «Beja não tem página»: as duas eram a cobertura da tarde
 * em que a célula nasceu, e não a regra. A regra é que a caixa vazia mostra
 * concelhos COM página, cada um com a porta da sua, e que um resultado
 * pesquisado é porta quando há página e nome com o estado quando não há. Quem
 * tem página lê-se do `dist/`. */
const COM_PAGINA_NO_DIST = fs.existsSync(path.join(DIST, 'municipios'))
  ? new Set(
      fs
        .readdirSync(path.join(DIST, 'municipios'))
        .filter((d) => fs.existsSync(path.join(DIST, 'municipios', d, 'index.html'))),
    )
  : new Set();
/** Um concelho para escrever na caixa, e se ele tem página ou não. */
const PROCURADO = COM_PAGINA_NO_DIST.has('beja')
  ? { termo: 'beja', nome: 'Beja', temPagina: true }
  : { termo: 'beja', nome: 'Beja', temPagina: false };
/** Há dois estados de cobertura na Carta? É o que decide se a etiqueta se rende. */
const COBERTURA_DISTINGUE = COM_PAGINA_NO_DIST.size > 0 && COM_PAGINA_NO_DIST.size < 308;
for (const largura of [1280, 390]) {
  const p = await pagina({ largura });
  /* A BUSCA ESTÁ À VISTA SEM GESTO NENHUM (F1.1, itens 3 e 12, 03.09.2026): saiu
     da gaveta ao lado do mapa e subiu para debaixo da manchete, como `<form>`
     com destino. Não há comando para tocar, e a célula deixa de o procurar. */
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const vazio = await p.evaluate(() =>
    [...document.querySelectorAll('.pesquisa-item')]
      .filter((e) => e.getClientRects().length)
      .map((e) => {
        const a = e.querySelector('a[href]');
        return {
          nome: e.querySelector('.pesquisa-nome')?.textContent.trim() ?? null,
          href: a ? a.getAttribute('href') : null,
        };
      }),
  );
  /* E o que a caixa escrita devolve: um concelho sem página é um nome com as
     duas palavras do estado, e não uma porta. */
  await p.locator('[data-pesquisa]').fill('beja');
  await p.waitForTimeout(80);
  const escrito = await p.evaluate(() =>
    [...document.querySelectorAll('.pesquisa-item')]
      .filter((e) => e.getClientRects().length)
      .map((e) => ({
        nome: e.querySelector('.pesquisa-nome')?.textContent.trim() ?? null,
        porta: !!e.querySelector('a[href]'),
        estado: e.querySelector('[data-cobertura]')?.textContent.trim() ?? null,
      })),
  );
  /* ---------------------------------------------------------------------------
     A CAIXA VAZIA DEIXOU DE MOSTRAR OITO NOMES (F1.1, 03.09.2026)
     ---------------------------------------------------------------------------
     A regra de 2026-08 era «com a caixa vazia mostram-se os concelhos que têm
     página, hoje um, Évora», e a nota ao lado dela, em `public/js/inicio.js`,
     dizia porquê: «uma pesquisa que abre com oito nomes que ninguém pediu diz
     que aqueles oito são especiais, e não são: são os primeiros da Carta». Com
     os 308 construídos a condição «tem página» deixou de separar seja o que for,
     e a caixa vazia passou a mostrar exactamente esses oito primeiros, que é o
     que a nota proibia; com a busca no primeiro ecrã custava também 168 px a
     quem não pediu nada.

     A REGRA PASSA A SER UMA SÓ: a fila mostra o que casa com o que está escrito,
     e com a caixa vazia não mostra nada. `/municipios` e `/livro-razao/concelhos`
     ficam como estavam, e a razão está no guião: lá a fila abre por baixo de uma
     lista dos 308 que já está na página. */
  conta(
    `largura ${largura} · a pesquisa com a caixa vazia não mostra nada, e um resultado com e sem página`,
    vazio.length === 0 &&
      escrito.length === 1 &&
      escrito[0].nome === PROCURADO.nome &&
      escrito[0].porta === PROCURADO.temPagina &&
      /* A ETIQUETA DE ESTADO SÓ SE RENDE SE A LISTA DISTINGUIR (item E8, P2). */
      Boolean(escrito[0].estado) === COBERTURA_DISTINGUE,
    `caixa vazia: ${vazio.length} resultado(s)${vazio.length ? ` — ${vazio
      .slice(0, 3)
      .map((r) => `${r.nome} → ${r.href}`)
      .join(' · ')}` : ''} · a lista distingue: ${COBERTURA_DISTINGUE} · com «${PROCURADO.termo}» escrito: ${escrito
      .map((r) => `${r.nome} (porta ${r.porta}, «${r.estado}»)`)
      .join(' · ')}`,
  );
  await p.__contexto.close();
}

/* (6) A POSTURA DA PRIMEIRA PÁGINA É UMA SÓ, E O CARTÃO LOCALIZADOR VIVE NA
 * PÁGINA DO CONCELHO (Emenda 19d, 26.08.2026).
 *
 * A célula media o cartão localizador na primeira página, no estado
 * `?ambito=municipio:evora&densidade=leitura`: o mapa pequeno dentro do cartão,
 * com moldura, e um só mapa no documento. Esse estado não existe. O que ela mede
 * agora são as duas metades da emenda: em `/`, e em qualquer estado dela, a
 * figura é `inteiro` e a tela enche a coluna; em `/municipios/evora`, que é onde
 * o cartão vive, a postura é `localizador`, a tela tem 170px e está dentro da
 * moldura. */
{
  const linhas = [];
  let bem = true;
  for (const [rota, nome] of [
    ['/', 'país'],
    ['/?densidade=leitura', 'país · leitura'],
    ['/?ambito=municipio', 'pesquisa aberta'],
    /* O estado «região» saiu da lista com a Emenda 21b: um endereço de região
       reencaminha, e o que esta célula mediria era a página de destino. Os três
       estados que ficam são os três que a primeira página tem. */
  ]) {
    const p = await pagina();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => ({
      postura: document.querySelector('[data-mapa-raiz]').getAttribute('data-postura'),
      largura: Math.round(document.querySelector('.mapa-tela').getBoundingClientRect().width),
      coluna: Math.round(document.querySelector('.cabeca-inst').getBoundingClientRect().width),
      mapas: document.querySelectorAll('[data-mapa]').length,
      fichaVisivel: document.querySelector('[data-mapa-ficha]').getClientRects().length > 0,
      cartaoTexto: document.querySelectorAll('.mapa-cartao-texto').length,
    }));
    const ok =
      r.postura === 'inteiro' &&
      r.largura === r.coluna &&
      r.mapas === 1 &&
      r.fichaVisivel &&
      r.cartaoTexto === 0;
    if (!ok) bem = false;
    linhas.push(
      `${nome}: ${r.postura}, ${r.largura}px numa coluna de ${r.coluna}px, ${r.mapas} mapa, ficha ${r.fichaVisivel}, texto de cartão ${r.cartaoTexto}`,
    );
    await p.__contexto.close();
  }
  const pe = await pagina();
  await pe.goto(base + '/municipios/evora', { waitUntil: 'networkidle' });
  const c = await pe.evaluate(() => {
    const tela = document.querySelector('.mapa-tela');
    const cartao = document.querySelector('[data-mapa-cartao]');
    return {
      postura: document.querySelector('[data-mapa-raiz]').getAttribute('data-postura'),
      dentro: !!tela.closest('[data-mapa-cartao]'),
      largura: Math.round(tela.getBoundingClientRect().width),
      mapas: document.querySelectorAll('[data-mapa]').length,
      moldura: getComputedStyle(cartao).borderTopWidth,
      ficha: document.querySelectorAll('[data-mapa-ficha]').length,
      porta: document.querySelector('[data-trocar]')?.getAttribute('href') ?? null,
    };
  });
  if (
    !(
      c.postura === 'localizador' &&
      c.dentro &&
      c.largura === 170 &&
      c.mapas === 1 &&
      parseFloat(c.moldura) > 0 &&
      c.ficha === 0 &&
      c.porta === '/municipios'
    )
  ) {
    bem = false;
  }
  linhas.push(
    `/municipios/evora: ${c.postura} ${c.largura}px dentro do cartão (moldura ${c.moldura}), ${c.ficha} fichas, «trocar de concelho» → ${c.porta}`,
  );
  await pe.__contexto.close();
  conta(
    '2m · a primeira página é sempre `inteiro`, e o cartão localizador vive na página do concelho',
    bem,
    linhas.join(' · '),
  );
}

/* (7) O rótulo do distrito: uma regra para os 308 (ISSUES I18).
 *
 * A CÉLULA MUDA DE SUPERFÍCIE PELA SEGUNDA VEZ (Emenda 20a, 27.08.2026), E A
 * REGRA É A MESMA. Nasceu no bloco de cabeça de um concelho escolhido na
 * primeira página; a Emenda 19a fechou esse estado e ela passou a ler a leitura
 * em voz alta do mapa de pontos, com `[data-readout-pre]` a acender-se ou a
 * apagar-se conforme o campo da Carta fosse um distrito ou uma ilha. A Emenda
 * 20a tirou os pontos da primeira página, e com eles a leitura em voz alta.
 *
 * O RÓTULO CONTINUA A VER-SE, e vive agora onde o concelho vive: por baixo do
 * nome dele, na sua página (`.municipio-sub`). É a mesma regra medida nos mesmos
 * quatro concelhos, e continua a ser o que o leitor VÊ e não o que uma função
 * compôs: lê-se do documento construído.
 *
 * ÉVORA LÊ-SE PELO PREFIXO e os outros três por igualdade, porque a etiqueta de
 * Évora vem de `municipios.mjs` e traz a sub-região a seguir («distrito de Évora
 * · Alentejo Central»). O que a I18 fixa é o prefixo, e é o prefixo que se mede.
 */
{
  const lidos = {};
  for (const slug of ['evora', 'beja', 'horta', 'lagoa-ilha-de-sao-miguel']) {
    const p = await pagina();
    await p.goto(`${base}/municipios/${slug}`, { waitUntil: 'networkidle' });
    lidos[slug] = await p.evaluate(
      () =>
        document.querySelector('.municipio-sub')?.textContent.replace(/\s+/g, ' ').trim() ?? '',
    );
    await p.__contexto.close();
  }
  conta(
    'o rótulo do distrito segue uma regra só nos 308 (ISSUES I18)',
    lidos.beja === 'distrito de Beja' &&
      lidos.horta === 'Ilha do Faial' &&
      lidos['lagoa-ilha-de-sao-miguel'] === 'Ilha de São Miguel' &&
      lidos.evora.startsWith('distrito de Évora'),
    `Beja «${lidos.beja}» · Horta «${lidos.horta}» · Lagoa «${lidos['lagoa-ilha-de-sao-miguel']}» · Évora «${lidos.evora}»`,
  );
}

/* ===========================================================================
 * SUBETAPA 2h · a proximidade, e duas arestas/* ===========================================================================
 * SUBETAPA 2h · a proximidade, e duas arestas
 * ======================================================================== */

/* (2h·1) SAIU COM O SELO DO MAPA NO TELEMÓVEL (correções de UX, bloco A, item
 * A4, 25.08.2026). Media a lista de proximidade: que ela entrava com um toque a
 * sério e só com um, que a ordenação da página batia certo com a que este
 * ficheiro calcula sobre os centróides, que os botões não traziam algarismos e
 * que uma activação por teclado não era um toque.
 *
 * O gesto vivia no selo do país, que é o rectângulo invisível por cima do mapa a
 * 390. Abaixo de 640 o mapa deixou de se render (decisão do diretor de 25.08,
 * Emenda 18: enquanto os concelhos não tiverem página, o selo sai do telemóvel e
 * a escolha é a pesquisa à vista), e com ele saíram o selo, o gesto e o ramo de
 * `public/js/inicio.js` que os servia. Uma célula que espera um elemento que a
 * página já não desenha não mede a página: mede a espera.
 *
 * O que a substitui, e onde: `tests/inicio/correcoes-a.mjs` mede que abaixo de
 * 640 o mapa não se rende (zero pontos com caixa), que a pesquisa fica à vista
 * logo por baixo da lede, e que o comando «Concelho» a revela dentro do ecrã com
 * o foco no campo. A lista de proximidade volta com o mapa por distritos, que é
 * a forma do telemóvel que a Emenda 3 desenha, e a célula volta com ela.
 *
 * A IMPORTAÇÃO DE `concelhos()` E DO CAMPO DA CAOP SAIU COM A CONTA QUE A USAVA
 * (Emenda 20a): a distância mínima entre dois centróides servia a célula da
 * densidade (f3), que foi retirada com a ISSUES I70, e a da pesquisa aberta
 * (f2), que passou a medir a caixa das 29 áreas. O que a matriz lê de fora do
 * `dist/` passa a ser uma coisa só, `mapa/pais.json`, e é para saber onde acaba
 * a moldura dos Açores. */

/* (2h·2) ISSUES I20 · o rótulo da referência da régua fica dentro da caixa.
 *
 * Seis estados por quatro larguras, dentro da matriz e não num guião de fora: a
 * varredura que apanhou o defeito era de fora, e um defeito que só uma
 * ferramenta de fora vê volta na subetapa seguinte. */
{
  const ESTADOS_DE_TRANSBORDO = [
    ['pais-relance', '/'],
    ['pais-leitura', '/?densidade=leitura'],
    /* `regiao-alentejo-leitura` SAIU (Emenda 21b): não é um estado desta página.
       O transbordo da régua nas quatro larguras mede-se onde ela vive, em
       `tests/inicio/regioes.mjs` (M2 e M3). */
    /* OS TRÊS ESTADOS DE CONCELHO SAÍRAM (Emenda 19a) e o da pesquisa entrou no
       lugar deles: eram `municipio:evora` em relance e em leitura e
       `municipio:beja`, e nenhum é um estado desta página. */
    ['pesquisa-aberta', '/?ambito=municipio'],
    ['pesquisa-aberta-leitura', '/?ambito=municipio&densidade=leitura'],
  ];
  const linhas = [];
  let piores = 0;
  for (const [nome, q] of ESTADOS_DE_TRANSBORDO) {
    for (const largura of [320, 390, 768, 1024, 1280]) {
      const p = await pagina({ largura });
      await p.goto(base + q, { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const d = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        /* E, para lá do transbordo da página, o rótulo tem de caber na caixa da
           própria régua: uma régua dentro de um contentor que rolasse esconderia
           o mesmo defeito em vez de o fechar. */
        let fora = 0;
        for (const e of document.querySelectorAll('.regua-ref-rotulo')) {
          const caixa = e.closest('.regua');
          if (!caixa || !e.getClientRects().length) continue;
          const a = e.getBoundingClientRect();
          const b = caixa.getBoundingClientRect();
          if (a.right > b.right + 0.5 || a.left < b.left - 0.5) fora++;
        }
        return { d, fora };
      });
      if (m.d > 0 || m.fora > 0) piores++;
      linhas.push(`${nome}@${largura}:${m.d}${m.fora ? ` (${m.fora} fora da régua)` : ''}`);
      await p.__contexto.close();
    }
  }
  conta(
    'ISSUES I20 · seis estados × cinco larguras sem transbordo, e o rótulo dentro da régua',
    piores === 0,
    `${linhas.length - piores} de ${linhas.length} a zero · ${linhas.join(' · ')}`,
  );
}

/* (2h·3) SAIU COM A DICA (Emenda 19b, 26.08.2026). A célula media que «Toque num
 * ponto para escolher o concelho.» só se lia onde o mapa escolhia pontos: no
 * computador, no âmbito de um concelho, e em mais lado nenhum (ISSUES I21). A
 * dica descrevia a escolha, a escolha saiu, e a cadeia saiu com ela de
 * `strings.mjs` nas duas edições. As outras duas dicas continuam medidas na
 * célula (2) das sete da 2g, que conta as que estão na descrição acessível do
 * mapa: eram três, são duas.
 */

/* =============================================================================
 * ETAPA 2i · as células da leitura cruzada/* =============================================================================
 * ETAPA 2i · as células da leitura cruzada
 * ========================================================================== */

/* (2i·1) Portugal não é uma região, e um endereço antigo de região leva à página
 * dela (Emenda 21b, 27.08.2026).
 *
 * A célula nasceu a medir a banda (seis pontos, cinco barras, Portugal como
 * referência), passou a medir os blocos e os painéis de região quando a banda
 * saiu de `/` a 25.08, e mede agora o que a Emenda 21b deixou: a primeira página
 * não tem cabeça nem painel de região nenhum, e os três endereços antigos vão aos
 * três destinos certos.
 *
 *   `regiao:alentejo`   → `/regioes/alentejo`, porque a região tem linhas;
 *   `regiao:portugal`   → `/regioes`, porque a referência não é uma região;
 *   `regiao:atlantida`  → `/regioes`, porque não existe.
 *
 * As duas últimas são a queda que a Emenda 19a escreveu para os concelhos sem
 * página, aplicada às regiões. O que continua verdadeiro de 20.08: Portugal não
 * é uma região, e não tem página de região nenhuma. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const c = await p.evaluate(() => {
    const chaves = (sel, attr) =>
      [...document.querySelectorAll(sel)]
        .map((x) => x.getAttribute(attr))
        .filter((k) => k && k.indexOf('regiao:') === 0);
    return {
      cabecas: chaves('[data-cabeca]', 'data-cabeca'),
      paineis: chaves('[data-leituras]', 'data-leituras'),
      banda: document.querySelectorAll('[data-banda-ponto]').length,
      pastilhas: document.querySelectorAll('[data-regiao]').length,
      /* O ÍNDICE DAS REGIÕES MUDOU DE SÍTIO (F1.1, 03.09.2026). Era o `href` do
         comando «Região», que era uma porta e não um estado; a fila do âmbito
         saiu da página com o bloco da porta da frente, e o índice passou a
         estar em dois sítios que continuam a ser um só destino: o menu, que é
         onde o leitor o alcança, e `data-indice-regioes` na raiz do estado, que
         é de onde o guião lê para onde vai um endereço antigo. A célula lê o do
         guião, porque é o que ela sempre leu: o que faz o reencaminhamento. */
      comando:
        document.querySelector('[data-modo="regiao"]')?.getAttribute('href') ??
        document.querySelector('[data-inicio]')?.getAttribute('data-indice-regioes') ??
        null,
      noMenu: [...document.querySelectorAll('.nav-principal a[href]')].some(
        (a) => a.getAttribute('href') === '/regioes',
      ),
    };
  });
  const destinos = [];
  for (const antigo of ['regiao:alentejo', 'regiao:portugal', 'regiao:atlantida']) {
    const q = await pagina();
    await q.goto(`${base}/?ambito=${antigo}`, { waitUntil: 'networkidle' });
    destinos.push(new URL(q.url()).pathname.replace(/\/$/, '') || '/');
    await q.__contexto.close();
  }
  const esperados = ['/regioes/alentejo', '/regioes', '/regioes'];
  conta(
    '2i·1 · a primeira página não tem região, e um endereço antigo leva à página dela',
    c.cabecas.length === 0 &&
      c.paineis.length === 0 &&
      c.banda === 0 &&
      c.pastilhas === 0 &&
      c.comando === '/regioes' &&
      c.noMenu &&
      destinos.join(' ') === esperados.join(' '),
    `${c.cabecas.length} cabeças e ${c.paineis.length} painéis de região · índice das regiões → ${c.comando} (no menu: ${c.noMenu}) · banda e pastilhas fora da página (${c.banda} pontos, ${c.pastilhas} pastilhas) · destinos ${destinos.join(', ')}`,
  );
  await p.__contexto.close();
}

/* (2i·2) A palavra da ressalva segue a edição, e não a língua por defeito de
   `Claim.astro`. Contam-se TODAS, inclusive as dos blocos escondidos: um estado
   que o leitor pode acender é um estado que o portão e a matriz têm de ver.

   A ROTA MEDIDA PASSA A SER A DAS REGIÕES (Emenda 21b, 27.08.2026). As linhas
   que a fonte marca `p` são hoje as seis do PIB per capita, e as seis viviam nos
   painéis de região da primeira página. Os painéis saíram, e com eles saíram
   todas as ressalvas de `/`: a célula media dois objectos vazios e passava a
   dizer que a palavra estava certa nas duas edições sem haver palavra nenhuma. É
   o defeito que a própria célula existe para não ter — e apanhou-se a si mesma,
   vermelha, na construção em que o painel saiu.

   As seis ressalvas estão agora em `/regioes` e em `/en/regions`, uma por linha
   da lista da régua, que é onde o valor vive. A pergunta não muda: a palavra
   segue a EDIÇÃO e não a língua por defeito do componente. */
{
  const p = await pagina();
  const lidas = {};
  for (const [rota, edicao] of [
    ['/regioes/', 'pt'],
    ['/en/regions/', 'en'],
  ]) {
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    lidas[edicao] = await p.evaluate(() => {
      const conta = {};
      for (const el of document.querySelectorAll('.claim-provisorio')) {
        const t = el.textContent.trim();
        conta[t] = (conta[t] ?? 0) + 1;
      }
      return conta;
    });
  }
  const soUma = (o, palavra) => Object.keys(o).length === 1 && o[palavra] > 0;
  conta(
    '2i·2 · a palavra do provisório segue a edição, nas duas',
    soUma(lidas.pt, 'provisório') &&
      soUma(lidas.en, 'provisional') &&
      lidas.pt['provisório'] === lidas.en['provisional'],
    `pt ${JSON.stringify(lidas.pt)} · en ${JSON.stringify(lidas.en)}`,
  );
  await p.__contexto.close();
}

/* (2i·3a, revista pela Emenda 10) OS 308 PONTOS SÃO CÍRCULOS, DO MESMO TAMANHO,
 * E NENHUM VEM CHEIO.
 *
 * Três coisas numa célula, porque são a mesma regra: o glifo do mapa é o ponto
 * redondo (o quadrado ficou a marcar prova e estado), o raio é um só para os
 * 308, e o enchimento saiu — a cobertura diz-se por palavras ao lado do mapa.
 * A célula lê o `fill` CALCULADO e não a classe: uma classe que já não pinta
 * nada não prova nada. */
{
  /* A SUPERFÍCIE PASSOU A SER O CARTÃO LOCALIZADOR (Emenda 20a e 20d,
     27.08.2026). Os 308 pontos saíram da primeira página, que desenha agora as
     29 unidades da Carta como áreas; a Emenda 20d deixa-os exactamente onde
     estavam, no cartão da página do concelho, e é lá que a regra da Emenda 10
     tem objecto. A célula não muda de pergunta: muda de porta. */
  const p = await pagina();
  await p.goto(`${base}/municipios/evora`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const pontos = [...document.querySelectorAll('[data-pontos] .mun')];
    const etiquetas = new Set(pontos.map((x) => x.tagName.toLowerCase()));
    const raios = new Set(pontos.map((x) => x.getAttribute('r')));
    const enchimentos = new Set(pontos.map((x) => getComputedStyle(x).fill));
    const comPagina = pontos.filter((x) => x.getAttribute('data-pagina') === 'sim');
    return {
      n: pontos.length,
      etiquetas: [...etiquetas],
      raios: [...raios],
      enchimentos: [...enchimentos],
      comPagina: comPagina.length,
    };
  });
  conta(
    '2j·a · os 308 pontos são círculos iguais e nenhum vem cheio (Emendas 3 e 10)',
    m.n === 308 &&
      m.etiquetas.length === 1 &&
      m.etiquetas[0] === 'circle' &&
      m.raios.length === 1 &&
      m.enchimentos.length === 1 &&
      m.enchimentos[0] === 'none' &&
      /* QUANTOS têm página é cobertura, e a Emenda 10 não fala de cobertura:
         fala de um só raio e um só enchimento para os 308. A célula media
         `comPagina === 1`, que era a cobertura da tarde em que nasceu, e ficava
         vermelha no dia em que o sítio crescesse — por ter acertado. Mede-se o
         que é regra: pelo menos um ponto declarado com página, e nenhum ponto a
         distinguir-se dos outros pelo raio ou pelo enchimento. */
      m.comPagina >= 1,
    `no cartão localizador de /municipios/evora: ${m.n} <${m.etiquetas.join('/')}> · 1 raio: ${m.raios.join(', ')} · enchimento ${m.enchimentos.join(', ')} · ${m.comPagina} declarado(s) com página`,
  );
  await p.__contexto.close();
}

/* (2i·3b, revista pela Emenda 10) O CONCELHO ESCOLHIDO É UM ANEL, E NUNCA UM
 * ENCHIMENTO — E AGORA NENHUM PONTO É UM ENCHIMENTO.
 *
 * A medida continua a não converter cores: compara o ponto ESCOLHIDO com outro
 * ponto qualquer do mesmo documento e com o de Évora, que é o único que a página
 * declara com página. Os três têm de ter o mesmo enchimento — nenhum — e o mesmo
 * raio; o que distingue o escolhido é a espessura do contorno, que é o anel. */
{
  const leituraDoPonto = (p, slug) =>
    p.evaluate((s) => {
      const escolhido = document.querySelector(`[data-pontos] [data-caop="${s}"]`);
      /* O ponto de comparação é OUTRO PONTO, e prefere-se um sem página quando
         ainda há algum: com os 308 construídos não há, e a célula compararia o
         escolhido com nada. A regra que ela mede não é sobre a cobertura — é
         que o escolhido se distingue dos outros pelo contorno e por mais nada
         (Emenda 10). */
      const outros = [...document.querySelectorAll('[data-pontos] .mun')].filter(
        (x) => x !== escolhido,
      );
      const outroSemPagina =
        outros.find((x) => x.getAttribute('data-pagina') !== 'sim') ?? outros[0];
      const comPagina = document.querySelector('[data-pontos] [data-pagina="sim"]');
      const est = (el) => {
        const cs = getComputedStyle(el);
        return {
          fill: cs.fill,
          stroke: cs.stroke,
          largura: parseFloat(cs.strokeWidth),
          raio: el.getAttribute('r'),
        };
      };
      return {
        temClasse: escolhido.classList.contains('mun-escolhido'),
        escolhido: est(escolhido),
        papel: est(outroSemPagina),
        tinta: est(comPagina),
      };
    }, slug);

  const linhas = [];
  let bem = true;
  /* O CONCELHO ESCOLHIDO PASSOU A VIVER NA PÁGINA DELE (Emenda 19d). A célula
     media o anel nos estados `?ambito=municipio:beja` da primeira página, que
     saíram; mede-o agora onde o servidor rende um concelho escolhido, que é
     `/municipios/evora`, e nas duas larguras. Na primeira página mede o
     contrário, que é a outra metade da emenda: nenhum ponto leva o anel. */
  for (const [rota, largura, slug, nome] of [
    ['/municipios/evora', 1280, 'evora', 'Évora · 1280 · localizador'],
    ['/municipios/evora', 390, 'evora', 'Évora · 390'],
    ['/en/municipalities/evora', 1280, 'evora', 'Évora · 1280 · en'],
  ]) {
    const p = await pagina({ largura });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const r = await leituraDoPonto(p, slug);
    const ok =
      r.temClasse &&
      r.escolhido.fill === 'none' &&
      r.papel.fill === 'none' &&
      r.escolhido.raio === r.papel.raio &&
      r.escolhido.largura > r.papel.largura;
    if (!ok) bem = false;
    linhas.push(
      `${nome}: enchimento ${r.escolhido.fill} (os outros ${r.papel.fill}) · raio ${r.escolhido.raio} = ${r.papel.raio} · anel ${r.escolhido.largura} contra ${r.papel.largura}`,
    );
    await p.__contexto.close();
  }
  /* A OUTRA METADE MUDA DE OBJECTO, E NÃO SE ESVAZIA (Emenda 20a). Media que a
     primeira página não punha o anel em ponto nenhum; sem pontos, contar zero
     anéis passava a ser verdade por não haver o que contar, que é uma célula a
     passar por não medir nada. O que a primeira página tem agora são 29 áreas, e
     a regra é a mesma: nenhuma se distingue das outras. Mede-se o estilo
     calculado das 29 e exige-se um só, mais a ausência dos pontos, que é o facto
     que fez a metade mudar de objecto. */
  const pi = await pagina();
  await pi.goto(`${base}/`, { waitUntil: 'networkidle' });
  const naPrimeira = await pi.evaluate(() => {
    const areas = [...document.querySelectorAll('[data-areas] .uni')];
    const estilos = new Set(
      areas.map((el) => {
        const cs = getComputedStyle(el);
        return [cs.fill, cs.stroke, cs.strokeWidth].join('|');
      }),
    );
    return {
      pontos: document.querySelectorAll('[data-pontos] .mun').length,
      areas: areas.length,
      estilos: [...estilos],
    };
  });
  if (naPrimeira.pontos !== 0 || naPrimeira.areas !== 29 || naPrimeira.estilos.length !== 1) {
    bem = false;
  }
  linhas.push(
    `primeira página: ${naPrimeira.pontos} pontos, ${naPrimeira.areas} áreas com ${naPrimeira.estilos.length} estilo (${naPrimeira.estilos.join(' ; ')})`,
  );
  await pi.__contexto.close();

  conta(
    '2j·a · o ponto escolhido é um anel na página do concelho, e na primeira página as 29 áreas são uma só',
    bem,
    linhas.join(' · '),
  );
}

/* (2i·3c) A frase de neutralidade fica ao pé do mapa em todas as posturas. *//* (2i·3c) A frase de neutralidade fica ao pé do mapa em todas as posturas. */
{
  /* A CÉLULA 2i·3c MUDA DE PERGUNTA COM A EMENDA 15. Media que a frase de
     neutralidade («os pontos são todos iguais e marcam a posição…, não marcam
     cobertura, qualidade nem importância») acompanhava o mapa nas cinco
     posturas. A emenda tirou-a: «uma legenda nomeia o que a coisa é … nunca o
     que não afirmamos». O que a célula mede agora é a ausência, nas mesmas
     cinco posturas, e que a linha da Emenda 17 está lá em vez dela. */
  const linhas = [];
  let bem = true;
  /* AS TRÊS ROTAS DE CONCELHO PASSARAM A SER A PÁGINA DO CONCELHO (Emenda 19).
     Eram estados da primeira página; as posturas continuam a ser as mesmas duas,
     e é onde elas vivem que se medem. */
  for (const [rota, largura, nome] of [
    ['/', 1280, 'País · inteiro'],
    ['/?ambito=municipio', 1280, 'pesquisa aberta · inteiro'],
    ['/municipios/evora', 1280, 'Évora · localizador'],
    ['/municipios/evora', 390, 'Évora · localizador · 390'],
    ['/', 390, 'País · 390'],
  ]) {
    const p = await pagina({ largura });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const figura = document.querySelector('[data-mapa-raiz]');
      return {
        postura: figura.getAttribute('data-postura'),
        neutras: document.querySelectorAll('.mapa-neutro, .mapa-cartao-neutro').length,
        cobertura: document.querySelectorAll('.mapa-titulo, .mapa-cartao-cobertura').length,
      };
    });
    const ok = r.neutras === 0 && r.cobertura === 0;
    if (!ok) bem = false;
    linhas.push(`${nome} (${r.postura}): ${r.neutras} neutras, ${r.cobertura} de cobertura`);
    await p.__contexto.close();
  }
  conta(
    '2l · Emenda 15 · a neutralidade e a cobertura saíram do mapa, em todas as posturas',
    bem,
    linhas.join(' · '),
  );
}

/* (2i·3d) RETIRADA PELA EMENDA 20c · abaixo de 640 o mapa voltou a render-se.
 *
 * A célula media a premissa da Emenda 18: abaixo de 640 o mapa inteiro não se
 * rendia, e por isso nem o dedo nem o teclado chegavam a ele (a tela não tinha
 * caixa, não recebia foco, e as setas não percorriam nada); a 1280 o mesmo mapa
 * lia, e o Enter num ponto com página abria a página dele.
 *
 * A EMENDA 20c INVERTEU A PREMISSA, e escreve porquê: «a razão daquela forma era
 * um mapa em que nada se tocava; neste, cada distrito é alvo». O mapa rende-se
 * nas duas larguras, os pontos saíram da primeira página, e a leitura em voz
 * alta saiu com eles. Não há aqui uma regra para mover: a regra que a célula
 * media era «onde nada se toca, nada é alcançável», e o que a substitui é o
 * contrário, medido em `tests/inicio/mapa-distritos.mjs`, células M1 e M2 (a
 * 1280 e a 390, quantas das 29 chegam aos 44 px e onde estão os nomes das que
 * não chegam).
 *
 * O QUE FICA AQUI É O FACTO QUE A RETIROU: nas larguras de telemóvel a tela tem
 * caixa e as 29 áreas também, e não sobrou um ponto na primeira página.
 *
 * E A TELA MEDE A JANELA ABAIXO DE 640 (I81, 27.08.2026). Media a coluna, que é
 * a janela menos duas goteiras: numa janela de 320 dava 284 px, e Viana do
 * Castelo media 35,3 px onde a Emenda 20c exige 44. A célula mede as três
 * larguras de telemóvel que a casa serve e exige que a tela seja a janela em
 * todas; quantas unidades chegam aos 44 px, e por que medida, é
 * `tests/inicio/mapa-distritos.mjs` M1 e M2, com a área inscrita da I82. */
{
  const sonda = async (largura) => {
    const p = await pagina({ largura });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => ({
      janela: window.innerWidth,
      tela: +document.querySelector('.mapa-tela').getBoundingClientRect().width.toFixed(1),
      areasComCaixa: [...document.querySelectorAll('[data-areas] .uni')].filter(
        (e) => e.getBoundingClientRect().width > 0,
      ).length,
      pontos: document.querySelectorAll('[data-pontos] .mun').length,
      leitura: document.querySelectorAll('[data-readout-nome]').length,
      naLista: document.querySelectorAll('[data-mapa-ilhas] [data-lista-porta]').length,
    }));
    await p.__contexto.close();
    return r;
  };
  const telemoveis = [];
  for (const w of [320, 390, 430]) telemoveis.push(await sonda(w));
  const largo = await sonda(1280);
  const estreito = telemoveis[0];
  const naJanela = telemoveis.filter((t) => Math.abs(t.tela - t.janela) < 0.5);
  conta(
    '2i·3d · RETIRADA (Emenda 20c) · o mapa rende-se nas duas larguras, toma a janela no telemóvel (I81), e não tem pontos',
    naJanela.length === telemoveis.length &&
      telemoveis.every((t) => t.areasComCaixa === 29 && t.pontos === 0 && t.leitura === 0) &&
      largo.tela > estreito.tela &&
      largo.areasComCaixa === 29 &&
      largo.pontos === 0,
    `${telemoveis.map((t) => `${t.janela}: tela ${t.tela}px`).join(' · ')} · ${naJanela.length}/${telemoveis.length} à largura da janela · ${estreito.areasComCaixa} áreas com caixa, ${estreito.pontos} pontos, ${estreito.leitura} leituras, ${estreito.naLista} nomes nas listas · 1280: tela ${largo.tela}px, ${largo.areasComCaixa} áreas · os alvos das 29 passaram a mapa-distritos.mjs M1 e M2, medidos pela área inscrita`,
  );
}

/* (2i·5) O espaço activa o comando que ficou, e não rola a página. */
/* ---------------------------------------------------------------------------
 * A CÉLULA MUDOU DE COMANDO COM O F1.1 (03.09.2026), E NÃO FOI DESLIGADA
 * ---------------------------------------------------------------------------
 * Media que o espaço activava os comandos de âmbito e de densidade, e que cada
 * um deles tinha papel de botão e a tecla que esse papel promete. As duas filas
 * saíram da página com o bloco da porta da frente (brief F1.1 §1, item 6), e com
 * elas o único sítio da primeira página onde uma ligação fazia de interruptor.
 *
 * O QUE FICA, E É O QUE A CÉLULA PASSA A MEDIR: o comando da densidade de cada
 * peça, que é um `<summary>` nativo — a tecla que o abre é do navegador, não do
 * guião —, e o botão da busca, que é um `<button type="submit">` a sério. Os
 * dois são o vocabulário da casa para «isto activa-se», e nenhum dos dois é uma
 * ligação a fingir de botão. A célula continua a exigir que a tecla NÃO ROLE a
 * página, que era a segunda metade da promessa antiga.
 * ------------------------------------------------------------------------- */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  await p.focus('[data-leituras] .dobra:first-child .dobra-abrir');
  const antes = await p.evaluate(() => window.scrollY);
  await p.keyboard.press('Space');
  await p.waitForTimeout(80);
  const a = await estadoDaPagina(p);
  const rolou = (await p.evaluate(() => window.scrollY)) - antes;
  const forma = await p.evaluate(() => {
    const b = document.querySelector('.pesquisa-submeter');
    const s2 = document.querySelector('[data-leituras] .dobra:first-child .dobra-abrir');
    return {
      botao: b ? `${b.tagName.toLowerCase()} type=${b.getAttribute('type')}` : 'sem botão',
      resumo: s2 ? s2.tagName.toLowerCase() : 'sem resumo',
      ligacoesComoBotao: document.querySelectorAll('[data-inicio] a[role="button"]').length,
    };
  });
  conta(
    '2i·5 · o espaço abre a leitura e não rola a página, e o que activa é um comando a sério',
    a.abertas === 1 &&
      rolou === 0 &&
      forma.botao === 'button type=submit' &&
      forma.resumo === 'summary' &&
      forma.ligacoesComoBotao === 0,
    `espaço no resumo da peça → ${a.abertas} aberta(s) (rolagem ${rolou}) · o botão da busca é «${forma.botao}» · o comando da peça é <${forma.resumo}> · ligações com papel de botão: ${forma.ligacoesComoBotao}`,
  );
  await p.__contexto.close();
}

/* (2i·5) Nenhuma régua fica com papel de imagem e sem nome. */
{
  const p = await pagina();
  await p.goto(`${base}/?densidade=leitura`, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const svgs = [...document.querySelectorAll('svg.regua-svg')];
    const semNome = (s) =>
      !s.getAttribute('aria-label') &&
      !s.getAttribute('aria-labelledby') &&
      !s.querySelector('title, desc');
    return {
      n: svgs.length,
      escondidas: svgs.filter((s) => s.getAttribute('aria-hidden') === 'true').length,
      papelSemNome: svgs.filter((s) => s.getAttribute('role') === 'img' && semNome(s)).length,
      focaveisDentro: svgs.filter((s) => s.querySelector('a[href],button,input,[tabindex]')).length,
    };
  });
  conta(
    '2i·5 · nenhuma régua com papel de imagem e sem nome acessível',
    r.n > 0 && r.escondidas === r.n && r.papelSemNome === 0 && r.focaveisDentro === 0,
    `${r.n} réguas · ${r.escondidas} com aria-hidden · ${r.papelSemNome} com role="img" sem nome · ${r.focaveisDentro} com conteúdo focável dentro`,
  );
  await p.__contexto.close();
}

/* =============================================================== ETAPA 2j
 *
 * As células da leitura da pré-visualização n.º 1 pela direção: Emendas 10 a 14
 * e as quatro decisões de forma. Cada uma mede o que a emenda decide, e não o
 * que a folha escreve.
 * ====================================================================== */

/* (2j) EMENDA 12 · CLARO POR DEFEITO PARA TODOS, com o sistema em escuro e sem
 * escolha guardada. É a metade da emenda que a folha sozinha não prova: o bloco
 * da preferência do sistema saiu de `tokens.css`, e o que esta célula mede é que
 * um leitor com o sistema em escuro vê a página clara. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    const p = await pagina({ sistema: 'dark' });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const e = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      guardado: (() => {
        try {
          return localStorage.getItem('tema');
        } catch (x) {
          return 'erro';
        }
      })(),
      controlo: !!document.querySelector('[data-tema-controlo]:not([hidden])'),
      /* O CONTROLO DO TEMA TEM DUAS RENDIÇÕES DESDE 25.08 (bloco A, item A7):
         uma na mobília, para o computador, e outra dentro do menu, para o
         telemóvel; cada largura apaga a do outro lado. O que se lê é o controlo
         que está À VISTA, que é o que o leitor tem à mão. */
      premido: [...document.querySelectorAll('.tema-b')]
        .filter((b) => b.getClientRects().length > 0)
        .map((b) => `${b.getAttribute('data-tema')}:${b.getAttribute('aria-pressed')}`)
        .join(' '),
    }));
    const ok =
      e.atributo === null && e.guardado === null && e.controlo && e.premido === 'light:true dark:false';
    if (!ok) bem = false;
    linhas.push(`${edicao}: data-theme ${e.atributo} · papel ${e.papel} · guardado ${e.guardado} · ${e.premido}`);
    await p.__contexto.close();
  }
  conta(
    '2j · Emenda 12 · claro por defeito, com o sistema em escuro e sem escolha',
    bem,
    linhas.join(' · '),
  );
}

/* (2j) EMENDA 12 · A ESCOLHA FICA NO APARELHO E SOBREVIVE À RECARGA.
 * Carrega no botão a sério — não escreve o atributo —, recarrega, e vai a outra
 * rota do sítio, porque uma preferência de leitura que só valesse numa página
 * não era uma preferência. Nas duas edições. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota, outra] of [
    ['pt', '/', '/metodo'],
    ['en', '/en', '/en/method'],
  ]) {
    const p = await pagina();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    await p.click('.tema-b[data-tema="dark"]:visible');
    const depois = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      guardado: localStorage.getItem('tema'),
      /* O CONTROLO DO TEMA TEM DUAS RENDIÇÕES DESDE 25.08 (bloco A, item A7):
         uma na mobília, para o computador, e outra dentro do menu, para o
         telemóvel; cada largura apaga a do outro lado. O que se lê é o controlo
         que está À VISTA, que é o que o leitor tem à mão. */
      premido: [...document.querySelectorAll('.tema-b')]
        .filter((b) => b.getClientRects().length > 0)
        .map((b) => `${b.getAttribute('data-tema')}:${b.getAttribute('aria-pressed')}`)
        .join(' '),
    }));
    await p.reload({ waitUntil: 'networkidle' });
    const recarga = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      /* O CONTROLO DO TEMA TEM DUAS RENDIÇÕES DESDE 25.08 (bloco A, item A7):
         uma na mobília, para o computador, e outra dentro do menu, para o
         telemóvel; cada largura apaga a do outro lado. O que se lê é o controlo
         que está À VISTA, que é o que o leitor tem à mão. */
      premido: [...document.querySelectorAll('.tema-b')]
        .filter((b) => b.getClientRects().length > 0)
        .map((b) => `${b.getAttribute('data-tema')}:${b.getAttribute('aria-pressed')}`)
        .join(' '),
    }));
    await p.goto(base + outra, { waitUntil: 'networkidle' });
    const noutraRota = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
    }));
    await p.click('.tema-b[data-tema="light"]:visible');
    const volta = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      guardado: localStorage.getItem('tema'),
    }));
    const escuro = depois.papel;
    const ok =
      depois.atributo === 'dark' &&
      depois.guardado === 'dark' &&
      depois.premido === 'light:false dark:true' &&
      recarga.atributo === 'dark' &&
      recarga.papel === escuro &&
      recarga.premido === 'light:false dark:true' &&
      noutraRota.atributo === 'dark' &&
      noutraRota.papel === escuro &&
      volta.atributo === null &&
      volta.guardado === 'light' &&
      volta.papel !== escuro;
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: carregou ${depois.papel} (${depois.guardado}) · recarga ${recarga.papel} · ${outra} ${noutraRota.papel} · voltou a claro ${volta.papel} (${volta.guardado})`,
    );
    await p.__contexto.close();
  }
  conta('2j · Emenda 12 · a escolha do tema persiste, nas duas edições', bem, linhas.join(' · '));
}

/* (2j) EMENDA 12 · SEM JAVASCRIPT o sítio é claro e o controlo não aparece.
 * Um comando que não comanda nada é uma promessa falhada: entra `hidden` do
 * servidor, e é o script que o acende. */
{
  const p = await pagina({ js: false, sistema: 'dark' });
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const g = document.querySelector('[data-tema-controlo]');
    return {
      existe: !!g,
      escondido: g ? g.hasAttribute('hidden') : null,
      caixa: g ? g.getBoundingClientRect().height : null,
      atributo: document.documentElement.getAttribute('data-theme'),
    };
  });
  conta(
    '2j · Emenda 12 · sem JavaScript o controlo do tema não se vê, e a página é clara',
    m.existe && m.escondido === true && m.caixa === 0 && m.atributo === null,
    `existe ${m.existe} · hidden ${m.escondido} · altura ${m.caixa} · data-theme ${m.atributo}`,
  );
  await p.__contexto.close();
}

/* (2j) EMENDA 13 · A FILA DE ESTADOS SAIU DA CABEÇA, em todos os âmbitos, e as
 * contagens ficaram onde a emenda as manda estar: no rótulo e na manchete, por
 * chave da prova. E cada peça continua com o seu marcador e a sua palavra. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const filas = document.querySelectorAll('.fila, [class*="fila-"]');
    const raiz = document.querySelector('[data-inicio]');
    const provas = [...document.querySelectorAll('[data-cabeca] [data-prova]')].map((e) =>
      e.getAttribute('data-prova'),
    );
    /* O MARCADOR E A PALAVRA DE ESTADO VIVEM NO CARTÃO DA FAIXA (F1.1b,
       04.09.2026). A grelha das peças saiu da primeira página; o estado de uma
       medida diz-se onde ele é a única cor do sítio, no cartão. A Emenda 13 é a
       mesma — «a fila de estados sai da cabeça e o estado diz-se ao lado do valor
       a que se refere» —, e o que mudou foi o componente que leva o valor.

       AS DUAS CONTAGENS SAEM DA PÁGINA E NÃO ESTÃO ESCRITAS AQUI: a palavra
       aparece em cada cartão cuja medida tem estado (as 13 do Procedimento; as 8
       do Painel Social não têm limiar nenhum e por isso não têm palavra, Emenda
       1), e o quadrado só nos dois estados pintados (Emenda 13 alargada pelo item
       B8). A célula compara os marcadores com os cartões pintados, contados no
       próprio documento. */
    const faixa = document.querySelector('[data-grelha] [data-faixa]');
    const cartoes = [...faixa.querySelectorAll('.cartao')];
    const marcadores = faixa.querySelectorAll('.cartao-topo .sq').length;
    const pintados = cartoes.filter((c) =>
      ['fora', 'dentro'].includes(c.getAttribute('data-estado') ?? ''),
    ).length;
    const palavras = [...faixa.querySelectorAll('.cartao-topo .cartao-palavra')].filter(
      (e) => e.textContent.trim().length > 0,
    ).length;
    return {
      filas: filas.length,
      provas: [...new Set(provas)],
      marcadores,
      palavras,
      pintados,
      temRaiz: !!raiz,
    };
  });
  conta(
    '2j · Emenda 13 · a fila de estados saiu da cabeça, e as contagens ficaram',
    m.filas === 0 &&
      m.provas.includes('painel_fora_do_limiar') &&
      m.provas.includes('painel_dentro_do_limiar') &&
      m.marcadores === m.pintados &&
      m.marcadores > 0 &&
      m.palavras === 13,
    `${m.filas} filas · chaves da prova na cabeça: ${m.provas.join(', ')} · ${m.marcadores} marcadores em ${m.pintados} cartões pintados e ${m.palavras} palavras de estado na faixa`,
  );
  await p.__contexto.close();
}

/* (2j) AS LEITURAS SEM CAIXAS, SEPARADAS POR FIOS DE 1px.
 * O que se mede não é a aparência: é que nenhuma leitura tem MOLDURA (uma caixa
 * fechada) e que o que separa uma da seguinte é um fio de 1px.
 *
 * A FORMA MUDOU E A REGRA NÃO (F1.1b, 04.09.2026). Eram treze peças numa grelha
 * de intervalo 1px, com uma sombra a desenhar o fio; são hoje 21 leituras numa
 * LISTA, e o fio é o `border-bottom` de cada uma, que é a mesma forma da lista
 * social a que a área de leitura sucedeu. Uma moldura é um fio nos QUATRO lados;
 * um fio numa aresta só é uma separação, e é o que a casa desenha. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const painel = document.querySelector('[data-leituras="pdm"]');
    const pecas = [...painel.querySelectorAll('.dobra')];
    const lados = (e) => {
      const c = getComputedStyle(e);
      return [c.borderTopWidth, c.borderRightWidth, c.borderBottomWidth, c.borderLeftWidth].map((v) =>
        parseFloat(v),
      );
    };
    const molduras = pecas.filter((e) => lados(e).every((v) => v > 0));
    const semFio = pecas.filter((e) => lados(e)[2] !== 1);
    return {
      pecas: pecas.length,
      comMoldura: molduras.length,
      semFio: semFio.length,
      intervaloCol: getComputedStyle(painel).columnGap,
      intervaloLin: getComputedStyle(painel).rowGap,
      sombra: pecas[0] ? getComputedStyle(pecas[0]).boxShadow : null,
    };
  });
  conta(
    '2j · as leituras sem caixas, separadas por fios de 1px',
    m.pecas === 13 && m.comMoldura === 0 && m.semFio === 0,
    `${m.pecas} leituras · ${m.comMoldura} com moldura · ${m.semFio} sem o fio de 1px`,
  );
  await p.__contexto.close();
}

/* (2j) OS ALGARISMOS NÃO PASSAM DE 56px, E NÃO SALTAM.
 * Cinco larguras, e em cada uma o maior corpo de valor da primeira página. O
 * tecto é 56; entre 320 e 1280 a série tem de ser crescente, que é o que prova
 * que a escala é fluida e não três patamares.
 *
 * O VALOR MUDOU DE COMPONENTE (F1.1b, 04.09.2026): a grelha das peças saiu da
 * primeira página e os 21 valores selados vivem uma vez só, no cartão da faixa.
 * A regra da escala é a mesma e a folha declara-a para os dois (`.peca-valor` e
 * `.cartao-valor`); o que se mede é o corpo do valor onde ele está. */
{
  const serie = [];
  let bem = true;
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina({ largura });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const corpos = [...document.querySelectorAll('[data-faixa] .cartao-valor')].map((e) =>
        parseFloat(getComputedStyle(e).fontSize),
      );
      return { maior: Math.max(...corpos), menor: Math.min(...corpos), n: corpos.length };
    });
    if (m.maior > 56.01) bem = false;
    serie.push({ largura, ...m });
    await p.__contexto.close();
  }
  for (let i = 1; i < serie.length; i++) if (serie[i].maior < serie[i - 1].maior) bem = false;
  conta(
    '2j · os algarismos do valor têm tecto de 56px e crescem sem saltos',
    bem,
    serie.map((x) => `${x.largura}: ${x.maior.toFixed(1)}px (menor ${x.menor.toFixed(1)})`).join(' · '),
  );
}

/* (2j) EMENDA 14 · SAIU DA PRIMEIRA PÁGINA COM O PAINEL VAZIO (Emenda 19a,
 * 26.08.2026).
 *
 * A célula media, nas duas edições, que `?ambito=municipio:beja` rendia as
 * medidas do concelho como peças vazias: uma peça por medida, nenhum algarismo, nenhum
 * selo, nenhum marcador, e as duas palavras «sem linha ainda» em cada uma. O
 * estado saiu do esquema e o painel saiu do documento: um concelho vive na sua
 * página, e é lá que a disposição-padrão da Emenda 14 se rende no dia em que
 * houver uma página sem linhas (decisão 5B de 25.08, os 308).
 *
 * A EMENDA 14 CONTINUA MEDIDA ONDE ELA TEM OBJECTO: `Peca.astro` mantém a peça
 * vazia com a sua palavra de estado, `MunicipioView` continua a chamá-la, e
 * `tests/municipio/concelhos.mjs` mede a página do concelho. A célula volta com
 * a primeira página de concelho sem linhas.
 */

/* (2j) SAIU COM O INSTRUMENTO N.º 1 (correções de UX, bloco A, item A3,/* (2j) SAIU COM O INSTRUMENTO N.º 1 (correções de UX, bloco A, item A3,
 * 25.08.2026). Media a altura da régua da convergência e os pares de rótulos
 * cruzados em cinco larguras, com a porta do telemóvel aberta. O instrumento
 * deixou de ser rendido em `/`, e a célula volta com ele, na matriz da página
 * das regiões. O corpo do valor do relance (tecto de 56px) continua medido nas
 * peças do painel, mais abaixo. */

/* =============================================================== ETAPA 2k
 *
 * As duas correções reais da segunda leitura cruzada, triadas pela cadeira:
 * a palavra «provisório» ao pé das cópias desenhadas (achado 13) e o
 * `aria-controls` das duas divulgações por irmão (achado 16).
 * ====================================================================== */

/* (2k) A PALAVRA AO PÉ DA CÓPIA DESENHADA — SAIU COM AS DUAS RÉGUAS (correções
 * de UX, bloco A, itens A2 e A3, 25.08.2026).
 *
 * A célula media, na página, que cada uma das seis linhas com `source_flag: "p"`
 * desenhadas dentro de um `<svg>` levava a palavra «provisório» na entrada de
 * legenda do seu selo, fora do selo e fora de qualquer `[data-claim]`. As cópias
 * desenhadas da primeira página eram as da banda da região e as do Instrumento
 * n.º 1: as duas deixaram de ser rendidas em `/`, e a primeira página não desenha
 * hoje um único valor dentro de um `<svg>` — medido, e é por isso que a célula
 * dava «0 linhas desenhadas, 0 provisórias», que é um zero por ausência de
 * objecto e não um achado.
 *
 * A decisão (d) da direção e o mecanismo de `Claim.astro` ficam inteiros, e a
 * palavra continua a render-se onde há linhas provisórias. A célula volta com a
 * página que voltar a desenhar valores dentro de um desenho.
 */

/* (2k) AS DIVULGAÇÕES POR IRMÃO DIZEM O QUE ABREM.
 *
 * O «Menu» do cabeçalho e a porta do telemóvel do Instrumento n.º 1 revelavam um
 * IRMÃO por `[open] ~`, e a razão está escrita nos dois sítios. O que faltava era
 * o atributo: `aria-controls` com o `id` do irmão, e um `aria-expanded` que
 * acompanha o `open`.
 *
 * A 390 a célula ABRE os dois a sério, com um toque, e vê o atributo virar e
 * voltar. A 1280 o comando do menu desaparece e a navegação está à vista, que é
 * o outro desenho da mesma folha. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    const p = await pagina({ largura: 390 });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const alvos = await p.evaluate(() =>
      [...document.querySelectorAll('details > summary[aria-controls]')].map((sum) => {
        const id = sum.getAttribute('aria-controls');
        return {
          id,
          resolve: !!document.getElementById(id),
          irmao: !!(document.getElementById(id) && document.getElementById(id).parentElement === sum.parentElement.parentElement),
          inicial: sum.getAttribute('aria-expanded'),
        };
      }),
    );
    const passos = [];
    for (const alvo of alvos) {
      const sel = `details > summary[aria-controls="${alvo.id}"]`;
      await p.locator(sel).click();
      await p.waitForFunction(
        (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true',
        sel,
        { timeout: 2000 },
      );
      const aberto = await p.evaluate(
        (s) => ({
          expandido: document.querySelector(s).getAttribute('aria-expanded'),
          open: document.querySelector(s).parentElement.open,
          corpoVisivel: !!document
            .getElementById(document.querySelector(s).getAttribute('aria-controls'))
            .getClientRects().length,
        }),
        sel,
      );
      await p.locator(sel).click();
      await p.waitForFunction(
        (s) => document.querySelector(s).getAttribute('aria-expanded') === 'false',
        sel,
        { timeout: 2000 },
      );
      const ok = alvo.resolve && alvo.inicial === 'false' && aberto.expandido === 'true' && aberto.open && aberto.corpoVisivel;
      if (!ok) bem = false;
      passos.push(`${alvo.id} resolve:${alvo.resolve} irmão:${alvo.irmao} ${alvo.inicial}→${aberto.expandido} corpo:${aberto.corpoVisivel}`);
    }
    /* ERA UMA DIVULGAÇÃO POR IRMÃO E PASSOU A SER OUTRA (bloco A, item A3): o
       «Menu» do cabeçalho fica, e a porta do telemóvel do Instrumento n.º 1 saiu
       com o instrumento. A regra de `public/js/tema.js` é genérica — vale para
       todo o `summary[aria-controls]` — e por isso a célula conta o que a página
       tem, e exige que TODAS resolvam e acompanhem. */
    if (alvos.length !== 1) bem = false;
    await p.__contexto.close();

    const q = await pagina({ largura: 1280 });
    await q.goto(base + rota, { waitUntil: 'networkidle' });
    const largo = await q.evaluate(() => {
      const sum = document.querySelector('.nav-menu > summary');
      const nav = document.getElementById('nav-principal');
      return {
        comando: !!sum.getClientRects().length,
        nav: !!nav.getClientRects().length,
      };
    });
    if (largo.comando || !largo.nav) bem = false;
    await q.__contexto.close();
    linhas.push(`${edicao}: 390 · ${passos.join(' · ')} · 1280 · comando à vista:${largo.comando} navegação à vista:${largo.nav}`);
  }
  conta('2k · as divulgações por irmão: aria-controls resolve e aria-expanded acompanha', bem, linhas.join(' · '));
}

/* --------------------------------------------------------------------- relatório */
/* ============================================================================
 * 2l · A SEGUNDA LEITURA DA PRÉ-VISUALIZAÇÃO N.º 1 (Emendas 15 a 17)
 * ========================================================================= */

/* (a) As duas bandas desenham DUAS referências, e a régua não transborda. */
{
  const p = await pagina();
  await p.goto(base + '/?densidade=leitura', { waitUntil: 'networkidle' });
  const b = await p.evaluate(() => {
    const alvo = ['saldo-da-balanca-corrente-2025', 'taxa-de-cambio-efectiva-real-2025'];
    return alvo.map((id) => {
      /* A LEITURA DAQUELA MEDIDA, e não a peça: a peça saiu da primeira página a
         04.09.2026 e a régua atravessou com o limiar para dentro da dobra da
         leitura. A marca da medida é `data-leitura`, que é o que a área de
         leitura escreve. */
      const peca = document.querySelector(`[data-leitura="${id}"]`);
      const svg = peca.querySelector('.regua-svg');
      const refs = [...svg.querySelectorAll('.regua-ref')];
      const xs = refs.map((r) => Number(r.getAttribute('x1')));
      const linha = peca.querySelector('.dobra-limiar').textContent.replace(/\s+/g, ' ').trim();
      const algarismos = [...peca.querySelectorAll('.dobra-limiar [data-nonledger="limiar-do-quadro"]')].map(
        (e) => e.textContent.trim(),
      );
      return {
        id,
        refs: refs.length,
        distintas: new Set(xs).size,
        dentroDaCaixa: xs.every((x) => x >= 0 && x <= 600),
        linha,
        algarismos,
        estado: peca.getAttribute('data-estado'),
      };
    });
  });
  conta(
    '2l · a banda desenha duas referências, e os dois algarismos vão marcados',
    b.every((r) => r.refs === 2 && r.distintas === 2 && r.dentroDaCaixa && r.algarismos.length === 2 && r.estado === 'dentro'),
    b.map((r) => `${r.id}: ${r.refs} referências em ${r.distintas} posições · «${r.linha}»`).join(' · '),
  );
  await p.__contexto.close();
}

/* (b) O Painel Social Europeu: oito leituras, sem cor, com o selo fora de
   qualquer outro alvo e com área de toque de 44px.
   ---------------------------------------------------------------------------
   A LISTA COMPACTA PASSOU A SER A SEGUNDA METADE DA ÁREA DE LEITURA (F1.1b,
   04.09.2026). O que a Emenda 16 promete é o mesmo — oito medidas, sem cor,
   porque o quadro não publica limiar nenhum, e o selo como porta para a linha —,
   e o que mudou foi a forma: em vez de oito `<li>` à vista, oito `<details>`
   fechados com o nome como `<summary>`. A célula abre-os para medir o selo, pela
   mesma razão que a célula dos selos das leituras do Procedimento os abre: o
   conteúdo de uma dobra fechada não tem caixa nenhuma. */
{
  const p = await pagina();
  await p.goto(base + '/?densidade=leitura', { waitUntil: 'networkidle' });
  const soc = await p.evaluate(() => {
    const lista = [...document.querySelectorAll('[data-leituras="social"] .dobra')];
    /* AS OITO TÊM SELO, E DUAS TÊM TAMBÉM A PORTA (decisão corrigida do lugar de
       direção, 04.09.2026): duas das oito medidas do Painel Social são medidas
       de um domínio com página (a taxa de emprego e a de desemprego), e a
       leitura delas nesta página é a MESMA das outras seis, com o seu selo, mais
       a porta para o domínio no fim.

       A PRIMEIRA REDAÇÃO DESTA CÉLULA EXCLUÍA DA CONTA DOS SELOS as leituras com
       porta, porque a primeira instrução do lugar de direção reduzia-as a uma
       linha. Com a leitura reposta (Blocking 3 da leitura a frio), essa exclusão
       deixava dois dos oito selos POR MEDIR e a célula passava à mesma. A conta
       dos selos passa a correr sobre as oito, e a das portas fica ao lado, com o
       seu próprio número exigido: uma régua não se enfraquece. */
    const portas = lista.filter((l) => l.querySelector('.dobra-porta a[href]')).length;
    const selos = lista
      .map((l) => {
      const a = l.querySelector('a.src-chip');
      if (!a) return null;
      const depois = getComputedStyle(a, '::after');
      const r = a.getBoundingClientRect();
      /* A mesma medição da célula dos selos da peça: a caixa do elemento e a da
         área de toque, e fica a maior das duas. */
      const largura = Math.max(r.width, parseFloat(depois.width) || 0, parseFloat(depois.minWidth) || 0);
      const altura = Math.max(r.height, parseFloat(depois.height) || 0);
      let aninhado = null;
      for (let no = a.parentElement; no; no = no.parentElement) {
        const t = no.tagName.toLowerCase();
        if (t === 'a' || t === 'button' || t === 'summary') { aninhado = t; break; }
      }
      return { largura: +largura.toFixed(1), altura: +altura.toFixed(1), aninhado };
    });
    return {
      n: lista.length,
      portas,
      semSelo: selos.filter((x) => x === null).length,
      aninhados: selos.filter((x) => x && x.aninhado !== null).length,
      pequenos: selos.filter((x) => x && (x.altura < 44 || x.largura < 44)).length,
      marcadores: document.querySelectorAll('[data-leituras="social"] .sq').length,
      palavras: document.querySelectorAll(
        '[data-leituras="social"] .cartao-palavra, [data-leituras="social"] .peca-palavra, [data-leituras="social"] .dobra-limiar',
      ).length,
      valores: document.querySelectorAll('[data-leituras="social"] [data-claim]').length,
      medida: selos[0],
    };
  });
  /* ---------------------------------------------------------------------------
     O VALOR SAIU DESTA LINHA (F1.1, item 2, 03.09.2026), E A CÉLULA SEGUE-O
     ---------------------------------------------------------------------------
     Cada uma das oito medidas do Painel Social aparecia com o seu algarismo no
     cartão da faixa e OUTRA VEZ aqui, com o mesmo selo, a milhares de píxeis de
     distância. O brief manda os 21 valores dos dois quadros uma vez só fora das
     páginas de linha, e a prova é a contagem de `data-claim` no HTML construído
     (medida A3 do bloco, e `tests/inicio/porta.mjs` mede-a).

     O QUE FICA NESTA LINHA é a leitura: o nome, a unidade, a fonte, a definição
     da medida e o RECIBO, que é o selo — a porta para a linha daquela medida, e
     é ele que faz disto uma leitura e não uma legenda. A célula continua a
     exigir tudo o que exigia do selo (existe, tem 44 px, não está aninhado
     noutro alvo) e as duas ausências da Emenda 16 (sem cor, sem palavra de
     estado, porque o quadro não publica limiares). O que muda é a contagem dos
     valores, que passa de oito a zero, e a razão está escrita. */
  conta(
    '2l · Emenda 16 · o Painel Social tem oito leituras, sem cor, sem o valor repetido e com o selo fora de outro alvo',
    soc.n === 8 && soc.portas === 2 && soc.semSelo === 0 && soc.aninhados === 0 && soc.pequenos === 0 &&
      soc.marcadores === 0 && soc.palavras === 0 && soc.valores === 0,
    `${soc.n} leituras, todas com selo (${soc.portas} acrescentam a porta para o domínio) · ${soc.valores} valores (o valor vive no cartão da faixa) · selo ${soc.medida?.largura}×${soc.medida?.altura}px · aninhados ${soc.aninhados} · marcadores ${soc.marcadores}`,
  );
  await p.__contexto.close();
}

/* (b·308) A CÉLULA «CONCELHO SEM ESTUDOS» (plano §3.5 do bloco dos 308).
 *
 * O plano nomeia-a nesta matriz, e é aqui que ela fica: a matriz é a régua que
 * corre em cada bloco e que impede que uma forma decidida volte atrás sem que
 * alguém dê por isso. Mede UMA página de concelho sem entrada escrita à mão, e
 * a regra é a da Emenda 14 e da E1: as sete peças rendem-se sempre, uma peça
 * vazia diz «sem linha ainda» e não traz um algarismo, as secções de um concelho
 * COM trabalho publicado não se rendem, e a coluna do corpo só existe se houver
 * corpo. A varredura dos 307 é da régua dos concelhos; esta célula é a sentinela.
 *
 * Sem um segundo concelho construído a célula não tem objecto, e di-lo. */
{
  const p = await pagina();
  await p.goto(base + '/municipios', { waitUntil: 'networkidle' });
  const outro = await p.evaluate(
    () =>
      [...document.querySelectorAll('.concelho a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h !== '/municipios/evora')[0] ?? null,
  );
  if (!outro) {
    conta(
      'Emenda 14 · um concelho sem estudos rende as sete peças e mais nada',
      false,
      'sem objecto: só há uma página de concelho construída. Corra com o ficheiro dos 308 ' +
        '(src/data/concelhos.gerado.json, ou CONCELHOS_GERADO=<ficheiro>).',
    );
  } else {
    await p.goto(base + outro, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => ({
      pecas: document.querySelectorAll('.peca').length,
      vazias: document.querySelectorAll('.peca-vazia').length,
      vaziasLimpas: [...document.querySelectorAll('.peca-vazia')].every(
        (e) => e.querySelector('[data-cobertura="sem-linha"]') && !/[0-9]/.test(e.textContent ?? ''),
      ),
      doTrabalho:
        document.querySelectorAll('#contas').length +
        document.querySelectorAll('#tempo').length +
        document.querySelectorAll('#metodo').length +
        document.querySelectorAll('#trabalhos').length +
        document.querySelectorAll('.aparelho-estado').length,
      breve: document.querySelectorAll('#breve').length,
      distancia: document.querySelectorAll('.mun-distancia').length,
      corpo: document.querySelectorAll('.municipio-corpo').length,
      cartao: document.querySelectorAll('[data-mapa-cartao]').length,
    }));
    conta(
      'Emenda 14 · um concelho sem estudos rende as sete peças e mais nada',
      m.pecas === 7 &&
        m.vaziasLimpas &&
        m.doTrabalho === 0 &&
        m.breve === m.distancia &&
        m.corpo === (m.breve > 0 ? 1 : 0) &&
        m.cartao === 1,
      `${outro}: ${m.pecas} peças (${m.vazias} vazias, sem algarismo ${m.vaziasLimpas}) · ` +
        `secções de trabalho ${m.doTrabalho} · leitura breve ${m.breve} / distância ${m.distancia} · ` +
        `colunas de corpo ${m.corpo} · cartão ${m.cartao}`,
    );
  }
  await p.__contexto.close();
}

/* (c) Emenda 17: a cabeça em duas colunas a partir de 1024, sem transbordo. */
{
  const linhas = [];
  let bem = true;
  for (const largura of [1024, 1180, 1280]) {
    for (const rota of ['/', '/en/']) {
      const p = await pagina({ largura });
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const grelha = document.querySelector('[data-grelha]');
        const cs = getComputedStyle(grelha);
        const texto = document.querySelector('.cabeca-col').getBoundingClientRect();
        const mapa = document.querySelector('[data-mapa-raiz]').getBoundingClientRect();
        return {
          colunas: cs.gridTemplateColumns,
          duas: cs.gridTemplateColumns.split(' ').length === 2,
          textoEsquerda: Math.round(texto.left),
          mapaEsquerda: Math.round(mapa.left),
          mapaLargura: Math.round(mapa.width),
          transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const ok = m.duas && m.mapaEsquerda > m.textoEsquerda && m.transbordo <= 0;
      if (!ok) bem = false;
      linhas.push(`${largura}${rota === '/' ? ' pt' : ' en'}: ${m.colunas} · mapa a ${m.mapaEsquerda}px (${m.mapaLargura}px) · transbordo ${m.transbordo}`);
      await p.__contexto.close();
    }
  }
  conta('2l · Emenda 17 · o texto à esquerda e o mapa à direita, de 1024 para cima', bem, linhas.join(' · '));
}

/* (d) As duas chaves novas da prova rendem-se e batem certo com o `prova.json`
   que o portão escreveu. A célula não recalcula nada: compara o que a página
   escreve com o que o portão gravou, que são duas contas independentes. */
{
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const provaJson = await p.evaluate(async () => (await fetch('/prova.json')).json());
  const na = await p.evaluate(() =>
    [...document.querySelectorAll('[data-prova]')].map((e) => [
      e.getAttribute('data-prova'),
      e.textContent.trim(),
    ]),
  );
  const mapa = Object.fromEntries(na);
  const chaves = provaJson.prova;
  const valor = (k) => (chaves[k]?.valor ?? chaves[k]);
  conta(
    '2l · as chaves novas da prova: a página e o portão dizem o mesmo',
    String(valor('painel_dentro_do_limiar')) === mapa.painel_dentro_do_limiar &&
      String(valor('painel_fora_do_limiar')) === mapa.painel_fora_do_limiar &&
      String(valor('painel_total')) === '13' &&
      String(valor('painel_social_total')) === '8',
    `fora ${mapa.painel_fora_do_limiar}/${valor('painel_fora_do_limiar')} · dentro ${mapa.painel_dentro_do_limiar}/${valor('painel_dentro_do_limiar')} · total ${valor('painel_total')} · social ${valor('painel_social_total')}`,
  );
  await p.__contexto.close();
}

/* (e) O inventário das frases da casa: autorreferência a zero, nas duas
   edições. A conta é a da régua `medir-defeitos.mjs`, lida do seu JSON: a
   matriz não a refaz, porque duas implementações da mesma definição diriam a
   mesma coisa por construção. O que a matriz garante é que o alvo é conferido a
   cada corrida e não só quando alguém se lembra de correr a régua. */
{
  const { execFileSync } = await import('node:child_process');
  const saida = execFileSync(process.execPath, [path.join(RAIZ, 'scripts', 'medir-defeitos.mjs'), '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const m = JSON.parse(saida).frases_da_casa;
  const rotas = Object.entries(m.por_rota);
  /* A CÉLULA PERGUNTA PELA PRIMEIRA PÁGINA, E A RÉGUA PASSOU A MEDIR MAIS ROTAS.
     A etapa 3 pôs `/livro-razao` e `/municipios` na lista declarada da medida 8,
     e o índice do livro-razão fica com DUAS frases de autorreferência que a
     `DECISIONS.md` §4 item AB manda preservar palavra por palavra até à fase da
     voz (nota da etapa 3, §3.3). A célula exigia zero em todas as rotas medidas,
     e por isso passou a falhar por uma decisão registada e não por um defeito.
     O que ela mede agora é o que o seu nome diz: zero na PRIMEIRA PÁGINA, nas
     duas edições, e nada por classificar em rota nenhuma — que é a condição que
     obriga alguém a decidir. As outras rotas continuam impressas na prova, para
     que o número não desapareça de vista. */
  const daPrimeira = rotas.filter(([rota]) => rota === '/' || rota === '/en');
  /* A CÉLULA APERTA (item E10, P2). Pedia autorreferência 0 na PRIMEIRA PÁGINA e
     «nada por classificar» em rota nenhuma, e a segunda metade era a única que
     olhava para as outras rotas. Uma frase de autorreferência DECLARADA numa
     página de concelho passava por isso mesmo: declarada, e por isso não «por
     classificar»; e fora da primeira página, e por isso não contada. Foi assim
     que «É a lei que o define, não este sítio.» viveu em 616 páginas.
     Autorreferência é zero em TODAS as rotas medidas, que é o que a Emenda 15
     diz. */
  const comAutorreferencia = rotas.filter(([, r]) => r.por_classe.autorreferencia > 0);
  conta(
    '2l · Emenda 15 · zero frases de autorreferência em todas as rotas medidas',
    m.inventario_existe &&
      comAutorreferencia.length === 0 &&
      daPrimeira.length === 2 &&
      daPrimeira.every(([, r]) => r.por_classe.autorreferencia === 0) &&
      rotas.every(([, r]) => r.nao_classificados.length === 0),
    `${rotas.length} rotas medidas · autorreferência > 0 em ${comAutorreferencia.length}` +
      `${comAutorreferencia.length ? `: ${comAutorreferencia.slice(0, 5).map(([r, v]) => `${r}=${v.por_classe.autorreferencia}`).join(', ')}` : ''} · ` +
      `por classificar em ${rotas.filter(([, r]) => r.nao_classificados.length).length} rota(s) · ` +
      daPrimeira
        .map(([rota, r]) => `${rota}: conteúdo ${r.por_classe.conteudo} · navegação ${r.por_classe.navegacao} · autorreferência ${r.por_classe.autorreferencia}`)
        .join(' · '),
  );
}

/* ============================================================================
 * (f) O MAPA QUE ENCHE A COLUNA, E QUE NÃO CRESCE MAIS DO QUE ELA
 * ============================================================================
 * Era «o mapa que enche a coluna e cresce para se escolher nele» (etapa 2m). A
 * segunda metade saiu com a Emenda 19b: o mapa enche a coluna, e mais nada.
 * ========================================================================== */

/* A DISTÂNCIA MÍNIMA ENTRE DOIS CENTRÓIDES SAIU COM A CÉLULA QUE A USAVA
   (Emenda 20a). Era 2,816 unidades de campo, Lajes das Flores e Santa Cruz das
   Flores, calculada aqui a partir dos mesmos dados que a página desenhava, para
   a célula da densidade (f3) e para a da pesquisa aberta (f2). A primeira foi
   retirada com a I70; a segunda passou a medir a caixa das 29 áreas. Uma conta
   que nenhuma célula lê é uma conta a dizer que ainda há uma pergunta. */

/** A caixa do desenho das 29 unidades, em CSS px, arredondada a um décimo.
 *
 * SUBSTITUI O PAR MAIS PRÓXIMO ENTRE PONTOS (Emenda 20a). A função media a
 * distância mínima entre dois dos 308 pontos, e servia para provar que a
 * pesquisa aberta não mexia no desenho; sem pontos ela devolvia `Infinity` e a
 * comparação dava `NaN`, que é uma célula a passar ou a falhar por acidente. O
 * que prova a mesma coisa no desenho novo é a caixa das 29 áreas: se o mapa
 * mudasse de escala ou de sítio, ela mudava. */
const caixaDasAreas = () => {
  const nos = [...document.querySelectorAll('[data-areas] .uni')];
  if (nos.length === 0) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const n of nos) {
    const r = n.getBoundingClientRect();
    x0 = Math.min(x0, r.left);
    y0 = Math.min(y0, r.top);
    x1 = Math.max(x1, r.right);
    y1 = Math.max(y1, r.bottom);
  }
  return { n: nos.length, largura: +(x1 - x0).toFixed(1), altura: +(y1 - y0).toFixed(1) };
};

/* ---------------------------------------------------------------------------
 * O CANTO QUE AS ILHAS DEIXAM, LIDO DO ARTEFACTO E NÃO ESCRITO À MÃO
 * ---------------------------------------------------------------------------
 * A instrução da etapa 2m dizia «à direita da moldura dos Açores, que acaba em
 * x=264, e por baixo do ponto mais a sul à direita dela, Faro em y=686,1», e os
 * dois números eram do campo dos pontos, 600 × 790. Com a Emenda 20a o mapa da
 * primeira página passou a ser o das 29 unidades, e o campo passou a ser o do
 * desenho, que guarda os polígonos. Os dois limites são os mesmos DOIS FACTOS
 * naquele campo, e leem-se dele: o lado direito da moldura dos Açores, e o fundo
 * da caixa das unidades do continente. Nenhum é escrito aqui.
 * --------------------------------------------------------------------------- */
const CANTO_DAS_ILHAS = (() => {
  const pais = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'mapa', 'pais.json'), 'utf8'),
  );
  const acores = pais.molduras.find((m) => m.nome === 'Açores');
  const continente = pais.unidades.filter((u) => u.parcela === 'continente');
  return {
    campo: pais.campo,
    x: acores.caixa[0] + acores.caixa[2],
    y: Math.max(...continente.map((u) => u.caixa[1] + u.caixa[3])),
  };
})();

/* (f1) O mapa enche a coluna, e a legenda está FORA do campo do desenho.
 *
 * A CÉLULA MEDIA UMA REGRA QUE SAIU A 29.08.2026, e estava vermelha desde então:
 * a etapa 2m tinha posto a legenda DENTRO da célula do desenho, no rectângulo
 * vazio que as ilhas deixam no canto (`margin-left: 45%`), e a emenda das 19:50
 * de 29.08 à §1.84 tirou-a da figura para a coluna esquerda, por baixo dos nomes
 * («A regra do canto das ilhas saiu com ela»). O que ela media deixou de ser
 * verdade por decisão, e não por defeito.
 *
 * O QUE ELA MEDE AGORA é a metade que ficou de pé — o mapa enche a coluna, sem
 * transbordo — e a decisão que substituiu a outra: a legenda não se sobrepõe ao
 * desenho. É a mesma pergunta («onde é que a legenda está?») com a resposta de
 * hoje, e continua a ser medida em caixas do navegador. Reescrita no bloco «a
 * cabeça nova como contentor» (01.09.2026), que é o primeiro a passar por aqui
 * desde a emenda. */
{
  const linhas = [];
  let bem = true;
  for (const largura of [1024, 1180, 1280, 1440]) {
    for (const rota of ['/', '/en/']) {
      const p = await pagina({ largura });
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const m = await p.evaluate((campo) => {
        const coluna = document.querySelector('.cabeca-inst').getBoundingClientRect();
        const tela = document.querySelector('.mapa-tela').getBoundingClientRect();
        const legenda = document.querySelector('.mapa-linha-fonte').getBoundingClientRect();
        /* A legenda está fora do desenho quando as duas caixas não se cruzam.
           Mede-se em píxeis do navegador, e não em unidades do campo: a legenda
           deixou de estar dentro do campo, e uma coordenada de campo para uma
           caixa que está noutra coluna é um número sem significado. */
        const cruza =
          legenda.left < tela.right - 0.5 &&
          tela.left < legenda.right - 0.5 &&
          legenda.top < tela.bottom - 0.5 &&
          tela.top < legenda.bottom - 0.5;
        return {
          coluna: +coluna.width.toFixed(1),
          mapa: +tela.width.toFixed(1),
          altura: +tela.height.toFixed(1),
          cruza,
          legX: +legenda.left.toFixed(1),
          legY: +(legenda.top + scrollY).toFixed(1),
          telaX: +tela.left.toFixed(1),
          transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      }, CANTO_DAS_ILHAS.campo);
      const ok = Math.abs(m.mapa - m.coluna) < 1 && !m.cruza && m.transbordo <= 0;
      if (!ok) bem = false;
      linhas.push(
        `${largura}${rota === '/' ? ' pt' : ' en'}: coluna ${m.coluna} · mapa ${m.mapa}×${m.altura} em x=${m.telaX} · legenda em x=${m.legX} y=${m.legY}, cruza o desenho: ${m.cruza} · transbordo ${m.transbordo}`,
      );
      await p.__contexto.close();
    }
  }
  conta('2m · o mapa enche a coluna da cabeça, e a legenda fica fora do desenho', bem, linhas.join(' · '));
}

/* (f2) A PESQUISA ABERTA NÃO MUDA O MAPA (Emenda 19b, 26.08.2026).
 *
 * A célula media a vista de escolha: o mapa à largura do conteúdo, os vizinhos
 * mais separados, os alvos acima de 24px e o «fechar» com 44px de altura. A
 * vista saiu. O que ela mede agora é o contrário, e com os mesmos números: em
 * `?ambito=municipio` o mapa fica na coluna, do tamanho que tem no país, a
 * pesquisa abre ACIMA dele, e a cabeça e o painel continuam a ser os do país. */
{
  const linhas = [];
  let bem = true;
  for (const largura of [1024, 1280, 1440]) {
    for (const rota of ['/', '/en/']) {
      const p = await pagina({ largura });
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const antes = await p.evaluate(caixaDasAreas);
      const noPais = await p.evaluate(
        () => +document.querySelector('.mapa-tela').getBoundingClientRect().width.toFixed(1),
      );
      await p.goto(base + rota + '?ambito=municipio', { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const raiz = document.querySelector('[data-inicio]');
        const tela = document.querySelector('.mapa-tela').getBoundingClientRect();
        const coluna = document.querySelector('.cabeca-inst').getBoundingClientRect();
        return {
          ambito: raiz.getAttribute('data-ambito'),
          url: location.pathname + location.search,
          cabeca: document.querySelector('[data-cabeca]:not([hidden])')?.getAttribute('data-cabeca'),
          painel: document.querySelector('[data-leituras]')?.getAttribute('data-leituras'),
          /* A BUSCA ABRE POR BAIXO DO MAPA, E ABRE MESMO (01.09.2026).
             Era um bloco que a folha mostrava pelo `data-modo` da raiz e que
             ficava ACIMA do mapa; com a afinação 1 do brief da forma dos
             domínios é uma gaveta ao lado dele, na coluna das gavetas, e o
             estado `?ambito=municipio` abre-a. O que se mede passa a ser isso:
             a gaveta está aberta, e o bloco da busca fica abaixo do topo do
             desenho e não por cima dele. */
          gavetaAberta:
            document.querySelector('[data-gaveta="busca"]')?.hasAttribute('open') ?? null,
          /* A BUSCA ESTÁ À VISTA, e é isso que se mede agora: a posição dela
             contra o topo do desenho deixou de dizer alguma coisa quando ela
             subiu para a coluna da manchete — a partir de 1024 a cabeça tem duas
             colunas, e o topo do mapa é o topo da manchete, que está por cima de
             tudo o que a coluna esquerda tem por baixo dela. O que a célula quer
             saber é que a busca não está atrás de nada. */
          pesquisaVisivel: document
            .querySelector('[data-pesquisa-bloco]')
            .checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true }),
          mapa: +tela.width.toFixed(1),
          coluna: +coluna.width.toFixed(1),
          transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const depois = await p.evaluate(caixaDasAreas);
      const ok =
        m.ambito === 'municipio' &&
        /\?ambito=municipio$/.test(m.url) &&
        m.cabeca === 'pais' &&
        /* O CORPO DA PÁGINA É A ÁREA DE LEITURA (F1.1b, 04.09.2026), e o
           primeiro bloco dela é o do Procedimento: era `data-painel="pais"`, da
           grelha das treze peças, que saiu. A célula continua a exigir que o
           corpo esteja lá com o estado aceso, e lê-o na coisa que agora lá
           está. */
        m.painel === 'pdm' &&
        /* A BUSCA SUBIU PARA DEBAIXO DA MANCHETE (F1.1, itens 3 e 12,
           03.09.2026). Era uma gaveta ao lado do mapa, fechada, e a célula
           media que o estado `?ambito=municipio` a abria por baixo do desenho.
           A gaveta deixou de existir: a busca é um `<form>` com destino no
           primeiro ecrã, ACIMA do mapa, e não há estado nenhum que a revele.
           A célula mede a mesma promessa ao contrário — a busca está à vista e
           o mapa fica exactamente onde estava —, que é a metade que interessa:
           o mapa não muda de tamanho nem de coluna com o estado. */
        m.gavetaAberta === null &&
        m.pesquisaVisivel &&
        Math.abs(m.mapa - m.coluna) < 1 &&
        Math.abs(m.mapa - noPais) < 1 &&
        antes !== null &&
        depois !== null &&
        antes.n === 29 &&
        depois.n === 29 &&
        Math.abs(depois.largura - antes.largura) < 0.05 &&
        Math.abs(depois.altura - antes.altura) < 0.05 &&
        m.transbordo <= 0;
      if (!ok) bem = false;
      linhas.push(
        `${largura}${rota === '/' ? ' pt' : ' en'}: ${m.url} · gaveta da busca ${m.gavetaAberta === null ? 'não existe' : m.gavetaAberta}, busca à vista ${m.pesquisaVisivel} · mapa ${m.mapa} na coluna de ${m.coluna} (no país ${noPais}) · caixa das ${antes?.n} áreas ${antes?.largura}×${antes?.altura} → ${depois?.largura}×${depois?.altura} · transbordo ${m.transbordo}`,
      );
      await p.__contexto.close();
    }
  }
  conta(
    '2m · a busca está à vista por cima do mapa, e o mapa fica onde estava',
    bem,
    linhas.join(' · '),
  );
}

/* (f3) RETIRADA PELA EMENDA 20 · a densidade era a pergunta, e a ISSUES I70 é a
 * resposta.
 *
 * A célula media, no desenho construído, a conta que a Emenda 19e escreveu: na
 * coluna do computador, 44 dos 308 pontos têm um vizinho a menos de um diâmetro
 * (7,35 px), e o par mais próximo da Carta mede 2,30 px. Existia «para que o
 * número não desapareça de vista enquanto o mapa por distritos não chega».
 * Chegou: a Emenda 20a fecha a I70, a primeira página desenha as 29 unidades
 * como áreas, e nenhuma delas tem um vizinho por cima. A densidade dos pontos
 * deixou de ser uma pergunta desta página.
 *
 * O QUE A SUBSTITUI é a medida dos alvos das 29, em
 * `tests/inicio/mapa-distritos.mjs`, células M1 e M2: quantas chegam aos 44 px a
 * 1280 e a 390, e onde estão os nomes das que não chegam. O que fica aqui é o
 * facto que retirou a célula: nenhum ponto na primeira página, 29 áreas e 29
 * ligações, uma por unidade. */
{
  const p = await pagina({ largura: 1280 });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => {
    const areas = [...document.querySelectorAll('[data-areas] .uni')];
    const lados = areas.map((el) => {
      const r = el.getBoundingClientRect();
      return Math.max(r.width, r.height);
    });
    return {
      pontos: document.querySelectorAll('[data-pontos] [data-caop]').length,
      areas: areas.length,
      ligacoes: document.querySelectorAll('[data-areas] a.uni-porta').length,
      menor: +Math.min(...lados).toFixed(2),
      maior: +Math.max(...lados).toFixed(2),
      largura: +document.querySelector('.mapa-tela').getBoundingClientRect().width.toFixed(1),
    };
  });
  conta(
    'Emenda 19e · RETIRADA (Emenda 20a, ISSUES I70 fechada) · a densidade dos pontos deixou de ser uma pergunta desta página',
    d.pontos === 0 && d.areas === 29 && d.ligacoes === 29,
    `${d.pontos} pontos e ${d.areas} áreas na coluna de ${d.largura}px, ${d.ligacoes} ligações · o maior lado da CAIXA das áreas vai de ${d.menor}px a ${d.maior}px, e o alvo já não se mede pela caixa: quantas chegam aos 44 px de área inscrita é mapa-distritos.mjs M1 e M2 (I82)`,
  );
  await p.__contexto.close();
}

/* (f4) A SAÍDA DA VISTA SAIU COM A VISTA (Emenda 19b). Eram «fechar» e Escape, e
 * os dois devolviam o mapa à coluna; o mapa nunca sai da coluna. O terceiro
 * caso fica, e é o único Escape que esta página tem: o da caixa de pesquisa,
 * que limpa a caixa e não fecha nada. */
{
  const p = await pagina({ largura: 1280 });
  await p.goto(base + '/?ambito=municipio', { waitUntil: 'networkidle' });
  await p.locator('[data-pesquisa]').fill('beja');
  await p.locator('[data-pesquisa]').press('Escape');
  const e = await p.evaluate(() => ({
    campo: document.querySelector('[data-pesquisa]').value,
    ambito: document.querySelector('[data-inicio]').getAttribute('data-ambito'),
    url: location.pathname + location.search,
    fechar: document.querySelectorAll('[data-fechar-mapa]').length,
  }));
  conta(
    '2m · o Escape da pesquisa limpa a caixa, e não há mais nenhum Escape na página',
    e.campo === '' && e.ambito === 'municipio' && e.url === '/?ambito=municipio' && e.fechar === 0,
    `caixa «${e.campo}» · âmbito ${e.ambito} · endereço «${e.url}» · ${e.fechar} comandos de fechar no documento`,
  );
  await p.__contexto.close();
}

/* (f5) RETIRADA PELA EMENDA 20a · o anel de leitura era do mapa de pontos.
 *
 * A célula media o marcador que `public/js/inicio.js` desenhava por baixo do
 * cursor sobre um dos 308 pontos: que ele era um anel e não um disco (Emenda
 * 10), que vivia dentro do `svg`, e que a leitura em voz alta dizia o nome do
 * concelho. Foi um achado real da etapa 2m, e a regra que ele defendia continua
 * inteira: um lugar lido ou escolhido é um anel, nunca um preenchimento.
 *
 * O ANEL NÃO TEM SUPERFÍCIE ONDE VIVER. O script só o cria onde há pontos, e a
 * primeira página deixou de os ter; o cartão localizador da página do concelho,
 * onde a Emenda 20d deixou os pontos, não carrega este script e nunca teve
 * leitura em voz alta. A regra continua medida onde ela tem objecto: o anel do
 * concelho ESCOLHIDO está na célula «2j·a · o ponto escolhido é um anel na
 * página do concelho», que mede o enchimento, o raio e o contorno em
 * `/municipios/evora`; e a neutralidade das áreas da primeira página está em
 * `tests/inicio/mapa-distritos.mjs`, células M5a a M5c, com o seu estrago
 * plantado.
 *
 * O QUE FICA AQUI É O FACTO QUE A RETIROU: passar o cursor pelo mapa da primeira
 * página não cria anel nenhum, não há caixa de leitura no documento, e as áreas
 * por baixo do cursor continuam sem enchimento. */
{
  const p = await pagina({ largura: 1280 });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const sitio = await p.evaluate(() => {
    const b = document.querySelector('.mapa-svg').getBoundingClientRect();
    return { x: b.left + b.width * 0.74, y: b.top + b.height * 0.64 };
  });
  await p.mouse.move(sitio.x, sitio.y);
  await p.waitForTimeout(80);
  const a = await p.evaluate(() => {
    const areas = [...document.querySelectorAll('[data-areas] .uni')];
    return {
      aneis: document.querySelectorAll('.cursor-ring').length,
      leitura: document.querySelectorAll('[data-readout-nome]').length,
      pontos: document.querySelectorAll('[data-pontos] .mun').length,
      enchimentos: [...new Set(areas.map((el) => getComputedStyle(el).fill))],
    };
  });
  conta(
    '2m · RETIRADA (Emenda 20a) · o anel de leitura era do mapa de pontos, que saiu da primeira página',
    a.aneis === 0 &&
      a.leitura === 0 &&
      a.pontos === 0 &&
      a.enchimentos.length === 1 &&
      a.enchimentos[0] === 'none',
    `${a.aneis} anéis e ${a.leitura} caixas de leitura no documento · ${a.pontos} pontos · o enchimento das 29 áreas é ${a.enchimentos.join(', ')} · o anel do concelho escolhido continua medido em /municipios/evora`,
  );
  await p.__contexto.close();
}

/* (f6) A LEDE DIZ AS MESMAS MEDIDAS QUE O PAINEL MARCA, e pela mesma ordem.
 *
 * Duas leituras da MESMA página, e nenhuma delas é a função que compôs a frase:
 * os nomes das peças cujo `data-estado` é «fora», pela ordem do documento, contra
 * os nomes que a lede nomeia, partidos pelos separadores da edição. O portão já
 * compara a CONTAGEM com a chave da prova; o que esta célula acrescenta é que os
 * nomes são aqueles e não outros quaisquer. */
{
  const linhas = [];
  let bem = true;
  for (const [rota, edicao, ultimo] of [['/', 'pt', ' e '], ['/en/', 'en', ' and ']]) {
    const p = await pagina({ largura: 1280 });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const e = await p.evaluate(() => ({
      /* OS CARTÕES DA FAIXA MARCADOS «fora», pela ordem do documento (F1.1b,
         04.09.2026). Eram as peças do painel; a grelha saiu da primeira página e
         o estado de uma medida diz-se no cartão, que é onde o valor vive. A
         ordem é a mesma, porque a faixa e o painel rendiam a mesma lista. */
      fora: [...document.querySelectorAll('[data-grelha] [data-faixa] .cartao[data-estado="fora"]')].map(
        (a) => a.querySelector('[data-medida-nome]').textContent.trim(),
      ),
      lista: document.querySelector('[data-prova-lista]')?.textContent.trim() ?? null,
      chave: document.querySelector('[data-prova-lista]')?.getAttribute('data-prova-lista') ?? null,
      manchete: document.querySelector('[data-prova="painel_fora_do_limiar"]')?.textContent.trim(),
      lede: document.querySelector('.cabeca-lede')?.textContent.trim() ?? null,
      /* O ano da lede é o único algarismo que a frase escreve, e sai marcado. */
      ano: document.querySelector('.cabeca-lede [data-nonledger="data-de-referencia"]')?.textContent.trim() ?? null,
      /* … e tem de ser o período que os próprios cartões declaram, na fila da
         unidade, que é onde ele passou a viver para todas as 21. */
      periodos: [...document.querySelectorAll('[data-grelha] [data-faixa] .cartao[data-estado="fora"]')].map(
        (a) => a.querySelector('[data-medida-unidade]')?.textContent.trim() ?? '',
      ),
    }));
    const nomes = (e.lista ?? '').split(new RegExp(`,\\s+|${ultimo.replace(/\s/g, '\\s')}`));
    const esperados = e.fora.map((n) => n.charAt(0).toLowerCase() + n.slice(1));
    const ok =
      e.chave === 'painel_fora_do_limiar' &&
      nomes.length === e.fora.length &&
      String(e.fora.length) === e.manchete &&
      nomes.every((n, i) => n === esperados[i]) &&
      !!e.ano &&
      e.periodos.every((u) => u.includes(e.ano));
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: manchete ${e.manchete} · lista de ${nomes.length} — «${nomes.join(' | ')}» · cartões fora: «${esperados.join(' | ')}» · ano ${e.ano}, em todas as unidades dos cartões: ${e.periodos.every((u) => u.includes(e.ano))} · lede «${e.lede}»`,
    );
    await p.__contexto.close();
  }
  conta('2m · a lede nomeia as medidas que o painel marca fora, pela ordem do painel, nas duas edições', bem, linhas.join(' · '));
}

/* ============================================================================
 * PÓS-FUSÃO A2 · O SELO DO INSTRUMENTO N.º 1 (ISSUES I13) — SAIU COM ELE
 * ============================================================================
 * As quatro células mediam os selos do Instrumento n.º 1 nos seus seis estados,
 * a 1280 e a 390: que o alvo tem 44×44, que nenhum selo está dentro de outro
 * alvo, que nenhum par de áreas se sobrepõe, e que a única excepção medida é o
 * selo da frase da leitura breve. O instrumento deixou de ser rendido em `/`
 * (correções de UX, bloco A, item A3, por decisão do diretor de 25.08), e com
 * ele saiu da primeira página tudo o que estas células conduziam: a região do
 * instrumento, o comando «repor» e a frase da leitura breve.
 *
 * O I13 CONTINUA MEDIDO ONDE ELE VIVE: os selos das peças do painel estão na §5
 * desta matriz, e `tests/inicio/correcoes-a.mjs` mede a área efetiva de todos os
 * selos da primeira página nas duas edições, a 390. A excepção do `.brief-text`
 * continua escrita em `site.css`, com a sua medição, à espera da página que
 * voltar a render a frase.
 * ========================================================================= */

/* ============================================================================
 * (z) A LÍNGUA DE UM TÍTULO CITADO, EM TODAS AS PÁGINAS CONSTRUÍDAS
 * ============================================================================
 * O título de um trabalho é uma citação e não se traduz: um trabalho que só tem
 * edição inglesa rende o seu título inglês dentro das páginas portuguesas. Quem
 * ouve a página ouvia «Which Door Is Yours» e «Alentejo & Algarve — Economy,
 * Society, Strategy» com a fonética do português. Desde 27.08.2026 o título sai
 * de `TituloDeTrabalho.astro`, que escreve `lang` quando a língua do título não
 * é a da página, e não escreve nada quando é. Um `lang` que repete o da página
 * é ruído para quem ouve.
 *
 * A célula lê os ficheiros construídos e não o navegador: são milhares de
 * páginas, e o que se julga é markup. Julga as duas metades, o que tem de levar
 * a marca e o que não pode levá-la, e a porta da outra edição no rodapé, que
 * era o outro sítio onde uma palavra inglesa se rendia sem língua.
 * ========================================================================= */
{
  const { WORKS } = await import('../../src/data/studies.mjs');
  /* Cada título, e as línguas em que ele existe no arquivo. */
  const linguasDoTitulo = new Map();
  for (const w of WORKS) {
    for (const e of w.editions) {
      const marca = e.lang === 'pt' ? 'pt-PT' : e.lang;
      if (!linguasDoTitulo.has(e.title)) linguasDoTitulo.set(e.title, new Set());
      linguasDoTitulo.get(e.title).add(marca);
    }
  }
  const decodifica = (t) =>
    t
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  const ficheiros = [];
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) ficheiros.push(f);
    }
  };
  anda(DIST);

  const semMarca = [];
  const comMarcaARepetir = [];
  const rodapeSemLingua = [];
  let titulos = 0;
  let marcados = 0;
  let rodapes = 0;
  const TITULO = /<(\w+)([^>]*\bdata-nonledger="titulo-de-estudo"[^>]*)>([^<]*)</g;
  const RODAPE = /<nav class="rodape-nav"[^>]*>([\s\S]*?)<\/nav>/;
  for (const f of ficheiros) {
    const html = fs.readFileSync(f, 'utf8');
    const rel = '/' + path.relative(DIST, f).replace(/\/?index\.html$/, '');
    const daPagina = /^\/en(\/|$)/.test(rel) ? 'en' : 'pt-PT';
    for (const m of html.matchAll(TITULO)) {
      const atributos = m[2];
      const texto = decodifica(m[3]).trim();
      if (!texto) continue;
      titulos++;
      const marca = /\blang="([^"]+)"/.exec(atributos)?.[1] ?? null;
      if (marca) marcados++;
      const linguas = linguasDoTitulo.get(texto);
      /* Um nome que não é título de edição nenhuma (uma origem interna, como
         «Concelhos: as medidas centrais») existe nas duas edições: não leva
         marca, e não é aqui que se julga. */
      if (!linguas) continue;
      /* A MESMA CADEIA PODE SER O TÍTULO DE DUAS EDIÇÕES. «Água Não Faturada» e
         «Onde está a água?» têm edição inglesa cujo título inglês não é
         conhecido: fica o original. Uma cadeia que também é título português não
         está em inglês, e não leva marca nenhuma. */
      if (linguas.has(daPagina)) {
        if (marca) comMarcaARepetir.push(`${rel} «${texto.slice(0, 40)}» lang=${marca}`);
      } else {
        const esperada = [...linguas][0];
        if (marca !== esperada) semMarca.push(`${rel} «${texto.slice(0, 40)}» lang=${marca ?? '(nenhum)'} esperava ${esperada}`);
      }
    }
    const rodape = RODAPE.exec(html)?.[1];
    if (rodape) {
      const porta = [...rodape.matchAll(/<a\b([^>]*\bhreflang="[^"]+"[^>]*)>/g)];
      for (const p of porta) {
        rodapes++;
        if (!/\blang="[^"]+"/.test(p[1])) rodapeSemLingua.push(rel);
      }
    }
  }
  conta(
    'a língua de um título citado, e a porta da outra edição no rodapé',
    semMarca.length === 0 && comMarcaARepetir.length === 0 && rodapeSemLingua.length === 0,
    `${ficheiros.length} páginas · ${titulos} títulos citados, ${marcados} com lang · ` +
      `${semMarca.length} sem a marca que precisam` +
      `${semMarca.length ? `: ${semMarca.slice(0, 3).join(' | ')}` : ''} · ` +
      `${comMarcaARepetir.length} a repetir a língua da página` +
      `${comMarcaARepetir.length ? `: ${comMarcaARepetir.slice(0, 3).join(' | ')}` : ''} · ` +
      `${rodapes} portas de rodapé, ${rodapeSemLingua.length} sem língua`,
  );
}

await navegador.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ celulas, despejos }, null, 2));
}

console.log('');
console.log(cinza(`  matriz de aceitação · ${celulas.length} células`));
console.log('');
let falhas = 0;
for (const c of celulas) {
  if (!c.passa) falhas++;
  console.log(`  ${c.passa ? verde('passa') : vermelho('falha')}  ${c.nome}`);
  console.log(cinza(`         ${c.prova}`));
}
console.log('');
console.log(
  falhas === 0
    ? verde(`  ${celulas.length} de ${celulas.length} células passam.`)
    : vermelho(`  ${falhas} de ${celulas.length} células falham.`),
);
console.log('');
