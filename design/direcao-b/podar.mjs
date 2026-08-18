/* Direção B · poda do CSS
   Cada protótipo leva só as regras cujas classes existem no seu corpo. O
   sistema inteiro vive em `sistema.css`, que é o ficheiro que se lê; o que vai
   embebido em cada ficheiro é o subconjunto que essa página usa. Sem isto o
   quadro, que carrega os seis protótipos, levaria oito cópias do sistema todo.

   O analisador é simples de propósito: este CSS não tem aninhamento a não ser
   `@media`, e todos os seletores são de classe, de elemento ou de atributo. */

function classesDaPagina(html) {
  const classes = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) classes.add(c);
  }
  const atributos = new Set();
  for (const m of html.matchAll(/\s([a-zA-Z-]+)=/g)) atributos.add(m[1]);
  for (const m of html.matchAll(/\s(data-[a-z-]+)[\s>]/g)) atributos.add(m[1]);
  return { classes, atributos };
}

function seletorUsado(sel, { classes, atributos }) {
  const semPseudo = sel.replace(/::?[a-z-]+(\([^)]*\))?/g, ' ');
  for (const m of semPseudo.matchAll(/\.([A-Za-z0-9_-]+)/g)) {
    if (!classes.has(m[1])) return false;
  }
  for (const m of semPseudo.matchAll(/\[([A-Za-z-]+)/g)) {
    if (!atributos.has(m[1])) return false;
  }
  return true;
}

function fatiar(css) {
  /* devolve [{prelude, corpo, arroba}] ao nível de topo */
  const partes = [];
  let i = 0;
  while (i < css.length) {
    const abre = css.indexOf('{', i);
    if (abre === -1) break;
    const prelude = css.slice(i, abre).trim();
    let nivel = 1;
    let j = abre + 1;
    while (j < css.length && nivel > 0) {
      if (css[j] === '{') nivel++;
      else if (css[j] === '}') nivel--;
      j++;
    }
    partes.push({ prelude, corpo: css.slice(abre + 1, j - 1), arroba: prelude.startsWith('@') });
    i = j;
  }
  return partes;
}

export function podar(css, html) {
  const uso = classesDaPagina(html);
  const saida = [];
  for (const parte of fatiar(css)) {
    if (parte.arroba) {
      const dentro = podar(parte.corpo, html);
      if (dentro.trim()) saida.push(`${parte.prelude}{${dentro}}`);
      continue;
    }
    const seletores = parte.prelude.split(',').map((s) => s.trim()).filter(Boolean);
    const ficam = seletores.filter((s) => seletorUsado(s, uso));
    if (ficam.length) saida.push(`${ficam.join(',')}{${parte.corpo}}`);
  }
  return saida.join('');
}
