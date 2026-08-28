// medicoes/lib/analiseRotas.mjs
//
// Uma só passagem por todos os ficheiros *.html construídos em `dist/`, para
// as medições 2, 4, 5 e 8 (que precisam todas de olhar para a cabeça, ou para
// o corpo, de cada rota das duas edições). Lê cada ficheiro uma vez, guarda só
// o que interessa (a cabeça como texto, mais um punhado de valores extraídos
// por expressão regular) e larga o resto, para não segurar 180 MB em memória.

import fs from 'node:fs';
import path from 'node:path';

function listarHtml(dir, raiz, saida) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      listarHtml(abs, raiz, saida);
    } else if (entrada.isFile() && entrada.name.endsWith('.html')) {
      saida.push(abs);
    }
  }
}

export function listarRotasHtml(distRoot) {
  const todas = [];
  listarHtml(distRoot, distRoot, todas);
  return todas.map((abs) => {
    const rel = path.relative(distRoot, abs);
    const edicao = rel === 'en' || rel.startsWith('en' + path.sep) ? 'en' : 'pt';
    return { caminhoAbsoluto: abs, rota: rel, edicao };
  });
}

function extrairCabeca(html) {
  const m = /<head[^>]*>([\s\S]*?)<\/head>/.exec(html);
  return m ? m[1] : '';
}

/**
 * A análise de UM documento (texto completo de um .html), reutilizável tanto
 * pela passagem real sobre `dist/` como por um caso vermelho plantado (uma
 * cópia em memória de uma página real, com uma ligação a menos).
 */
export function analisarUmDocumento(html) {
  const cabeca = extrairCabeca(html);

  const linksIcon = [...cabeca.matchAll(/<link\b([^>]*\brel="icon"[^>]*)>/g)].map((m) => m[0]);
  const linksAppleTouch = [...cabeca.matchAll(/<link\b([^>]*\brel="apple-touch-icon"[^>]*)>/g)].map((m) => m[0]);
  const linksManifest = [...cabeca.matchAll(/<link\b([^>]*\brel="manifest"[^>]*)>/g)].map((m) => m[0]);
  const metasThemeColor = [...cabeca.matchAll(/<meta\b([^>]*\bname="theme-color"[^>]*)>/g)].map((m) => m[0]);
  const metasAppleTitle = [...cabeca.matchAll(/<meta\b([^>]*\bname="apple-mobile-web-app-title"[^>]*)>/g)].map(
    (m) => m[0],
  );
  const hrefManifest = linksManifest.length ? /href="([^"]+)"/.exec(linksManifest[0])?.[1] ?? null : null;
  const hrefAppleTouch = linksAppleTouch.length ? /href="([^"]+)"/.exec(linksAppleTouch[0])?.[1] ?? null : null;
  const conteudoThemeColor = metasThemeColor.length ? /content="([^"]*)"/.exec(metasThemeColor[0])?.[1] ?? null : null;
  const conteudoAppleTitle = metasAppleTitle.length ? /content="([^"]*)"/.exec(metasAppleTitle[0])?.[1] ?? null : null;

  return {
    // M2 / M4: presença e contagem de ligações
    contagemLinksIcon: linksIcon.length,
    linksIcon,
    contagemLinksAppleTouch: linksAppleTouch.length,
    hrefAppleTouch,
    // M4 / M5: manifesto
    contagemLinksManifest: linksManifest.length,
    hrefManifest,
    // M5: theme-color, apple-mobile-web-app-title, apple-mobile-web-app-capable
    contagemMetaThemeColor: metasThemeColor.length,
    conteudoThemeColor,
    contagemMetaAppleTitle: metasAppleTitle.length,
    conteudoAppleTitle,
    temAppleMobileCapable: /apple-mobile-web-app-capable/.test(cabeca),
    // M8: nada de mais, em qualquer parte do documento (não só na cabeça)
    temServiceWorkerNoTexto: /serviceWorker/.test(html),
    temBeforeInstallPromptNoTexto: /beforeinstallprompt/i.test(html),
  };
}

/**
 * Uma passagem: devolve, por rota, tudo o que M2/M4/M5/M8 precisam.
 */
export function analisarRotas(distRoot) {
  const rotas = listarRotasHtml(distRoot);
  const resultado = [];
  for (const r of rotas) {
    const html = fs.readFileSync(r.caminhoAbsoluto, 'utf8');
    resultado.push({ edicao: r.edicao, rota: r.rota, ...analisarUmDocumento(html) });
  }
  return resultado;
}
