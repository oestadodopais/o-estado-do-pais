// medicoes/lib/tokens.mjs
//
// Lê `src/styles/tokens.css` e devolve os valores dos tokens de cor do papel
// claro e do papel escuro, para as medições que têm de os conferir (M1, M5,
// M6). Extração por expressão regular do bloco `:root { ... }` nu (o claro) e
// do bloco `:root[data-theme='dark'] { ... }` (o escuro); não importa nada de
// `src/` como módulo, só lê o texto do ficheiro CSS.

import fs from 'node:fs';

export function lerTokens(caminhoTokensCss) {
  const css = fs.readFileSync(caminhoTokensCss, 'utf8');

  const blocoNu = /(?:^|\n):root\s*\{([^}]*)\}/.exec(css);
  const blocoEscuro = /:root\[data-theme=['"]dark['"]\]\s*\{([^}]*)\}/.exec(css);
  if (!blocoNu) throw new Error('tokens.css: não encontrei o bloco :root nu (claro)');
  if (!blocoEscuro) throw new Error("tokens.css: não encontrei o bloco :root[data-theme='dark']");

  const extrai = (bloco, nomeToken) => {
    const m = new RegExp(`--${nomeToken}:\\s*(#[0-9a-fA-F]{6})`).exec(bloco);
    if (!m) throw new Error(`tokens.css: não encontrei --${nomeToken} no bloco`);
    return m[1].toLowerCase();
  };

  return {
    claro: { paper: extrai(blocoNu[1], 'paper'), ink: extrai(blocoNu[1], 'ink') },
    escuro: { paper: extrai(blocoEscuro[1], 'paper'), ink: extrai(blocoEscuro[1], 'ink') },
  };
}
