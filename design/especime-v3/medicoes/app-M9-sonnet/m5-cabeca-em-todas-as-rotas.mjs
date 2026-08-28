// medicoes/m5-cabeca-em-todas-as-rotas.mjs — medição 5.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { analisarRotas, analisarUmDocumento } from './lib/analiseRotas.mjs';
import { lerTokens } from './lib/tokens.mjs';
import { servirEstatico } from './lib/servidor.mjs';

const ROTAS_DINAMICAS = ['/', '/municipios/evora', '/estudos', '/en'];

function conferirRotaEstatica(r, tokensClaro, shortName) {
  const problemas = [];
  const hrefEsperado = r.edicao === 'pt' ? '/manifest.webmanifest' : '/en/manifest.webmanifest';
  if (r.contagemLinksManifest !== 1) problemas.push(`${r.contagemLinksManifest} ligações rel="manifest" (esperava 1)`);
  else if (r.hrefManifest !== hrefEsperado) problemas.push(`rel="manifest" aponta a ${r.hrefManifest}, esperava ${hrefEsperado}`);

  if (r.contagemMetaThemeColor !== 1) problemas.push(`${r.contagemMetaThemeColor} etiquetas meta theme-color (esperava 1)`);
  else if (r.conteudoThemeColor !== tokensClaro.paper) problemas.push(`theme-color é ${r.conteudoThemeColor}, esperava o papel claro ${tokensClaro.paper}`);

  if (r.contagemMetaAppleTitle !== 1) problemas.push(`${r.contagemMetaAppleTitle} etiquetas apple-mobile-web-app-title (esperava 1)`);
  else if (r.conteudoAppleTitle !== shortName) problemas.push(`apple-mobile-web-app-title é ${JSON.stringify(r.conteudoAppleTitle)}, esperava ${JSON.stringify(shortName)}`);

  if (r.temAppleMobileCapable) problemas.push('tem apple-mobile-web-app-capable, e não devia ter nenhuma');

  return problemas;
}

async function medirTrocaDeTema(navegador, base, rota, { bloquearScript = false } = {}) {
  // Um contexto NOVO por rota, de propósito: `localStorage` é por origem e
  // persiste entre navegações do mesmo contexto, e todas as rotas vivem na
  // mesma origem (o servidor estático local). Um contexto partilhado faria a
  // escolha de tema de uma rota vazar para a leitura "antes" da rota
  // seguinte, e o leitor de primeira visita não tem esse resíduo.
  const context = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  if (bloquearScript) {
    await page.route('**/js/tema.js', (route) => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  }
  await page.goto(base + rota, { waitUntil: 'load' });
  const antes = await page.locator('meta[name="theme-color"]').getAttribute('content');
  const botao = page.locator('.masthead-furniture [data-tema-controlo] button[data-tema="dark"]');
  await botao.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  let cliqueFalhou = false;
  try {
    await botao.click({ timeout: 3000 });
  } catch {
    cliqueFalhou = true;
  }
  await page.waitForTimeout(80);
  const depois = await page.locator('meta[name="theme-color"]').getAttribute('content');
  const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await context.close();
  return { rota, antes, depois, dataTheme, cliqueFalhou };
}

export async function medir({ distRoot, tokensCssPath }) {
  const tokens = lerTokens(tokensCssPath);
  const shortName = JSON.parse(fs.readFileSync(path.join(distRoot, 'manifest.webmanifest'), 'utf8')).short_name;

  // ---- parte estática, todas as rotas -----------------------------------
  const rotas = analisarRotas(distRoot);
  const rotasComCabecaPWA = rotas.filter(
    (r) => r.contagemLinksIcon > 0 || r.contagemLinksManifest > 0 || r.contagemLinksAppleTouch > 0,
  );
  const rotasSemCabecaPWA = rotas.filter(
    (r) => r.contagemLinksIcon === 0 && r.contagemLinksManifest === 0 && r.contagemLinksAppleTouch === 0,
  );
  const comProblemas = [];
  for (const r of rotasComCabecaPWA) {
    const problemas = conferirRotaEstatica(r, tokens.claro, shortName);
    if (problemas.length) comProblemas.push({ rota: `${r.edicao}:${r.rota}`, problemas });
  }

  // ---- parte dinâmica: a troca de tema, com Playwright -------------------
  const { base, fechar } = await servirEstatico(distRoot);
  const navegador = await chromium.launch();

  const trocas = [];
  for (const rota of ROTAS_DINAMICAS) {
    trocas.push(await medirTrocaDeTema(navegador, base, rota));
  }

  // ---- caso vermelho plantado: tema.js bloqueado -------------------------
  const trocaBloqueada = await medirTrocaDeTema(navegador, base, '/', { bloquearScript: true });

  await navegador.close();
  await fechar();

  // ---- caso vermelho plantado: a ligação rel="manifest" removida --------
  // (o BRIEF nomeia este caso ao lado da contagem por rota: «uma página com a
  // ligação removida»). Cópia em memória de uma página real, sem tocar em
  // `dist/`, reanalisada pelo MESMO analisador que lê as rotas verdadeiras.
  const paginaReal = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');
  const paginaSemManifesto = paginaReal.replace(/<link\s+rel="manifest"[^>]*>/, '');
  const analiseSemManifesto = analisarUmDocumento(paginaSemManifesto);
  const problemasSemManifesto = conferirRotaEstatica({ edicao: 'pt', ...analiseSemManifesto }, tokens.claro, shortName);

  const trocasConformes = trocas.every((t) => t.antes === tokens.claro.paper && t.depois === tokens.escuro.paper && t.dataTheme === 'dark');

  return {
    medicao: 5,
    tokens,
    shortName,
    estatico: {
      totalRotas: rotas.length,
      totalComCabecaPWA: rotasComCabecaPWA.length,
      totalSemCabecaPWA: rotasSemCabecaPWA.length,
      rotasSemCabecaPWA: rotasSemCabecaPWA.map((r) => `${r.edicao}:${r.rota}`),
      rotasComProblemas: comProblemas,
      conforme: comProblemas.length === 0,
    },
    dinamico: {
      trocas,
      trocasConformes,
    },
    casoConhecido: {
      descricao:
        'a mesma medição da troca de tema em /, mas com /js/tema.js substituído por um ficheiro vazio antes da navegação (simula o script falhar a carregar): o botão fica sem o script que lhe tira "hidden" e sem o listener do clique.',
      resultado: trocaBloqueada,
      viuVermelho: trocaBloqueada.depois === tokens.claro.paper && trocaBloqueada.dataTheme !== 'dark',
    },
    casoConhecidoLigacaoRemovida: {
      descricao:
        'cópia em memória de dist/index.html com a ligação rel="manifest" removida por regex, reanalisada pelo mesmo conferidor estático das rotas reais.',
      problemas: problemasSemManifesto,
      viuVermelho: problemasSemManifesto.length > 0,
    },
  };
}
