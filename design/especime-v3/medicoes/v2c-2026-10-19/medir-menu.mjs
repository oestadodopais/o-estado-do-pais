/** V2-c: método da H4, aplicado à forma servida pelo captor do escrivão. */
export function medirMenu() {
        const n = document.querySelector('#nav-principal');
        const rect = (a) => { const b = a.getBoundingClientRect(); return { x: b.x, y: b.y, largura: b.width, altura: b.height, direita: b.right, fundo: b.bottom }; };
        const portas = [...n.querySelectorAll('a')];
        const caixas = portas.map((a) => ({ texto: a.textContent.trim(), href: a.getAttribute('href'), ...rect(a) }));
        const gap = parseFloat(getComputedStyle(n).columnGap);
        const linhas = [...new Set(caixas.map((b) => b.y))].map((y) => caixas.filter((b) => b.y === y));
        const folgas = linhas.flatMap((l) => l.slice(1).map((b, i) => b.x - l[i].direita));
        const larguraNatural = caixas.reduce((s, b) => s + b.largura, 0) + gap * (caixas.length - 1);
        return { coluna: n.clientWidth, natural: larguraNatural, linhas: linhas.length, portas: caixas.length,
          caixas, ultima: caixas.at(-1), gap, folgas, letra: getComputedStyle(portas[0]).fontSize, espaco_das_letras: getComputedStyle(portas[0]).letterSpacing,
          sem_transbordo: n.scrollWidth <= n.clientWidth && caixas.every((b) => b.x >= n.getBoundingClientRect().left - .5 && b.direita <= n.getBoundingClientRect().right + .5),
          cabe_em_duas: linhas.length <= 2 && n.scrollWidth <= n.clientWidth && caixas.every((b) => b.x >= n.getBoundingClientRect().left - .5 && b.direita <= n.getBoundingClientRect().right + .5) };
}
