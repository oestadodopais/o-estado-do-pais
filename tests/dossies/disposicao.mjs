/** DO2-E: geometria da frase e alvo da ligação, sobre a cópia no navegador.
 * Corre pelo escrivão nas capturas com conferirDossies, em cada edição e largura.
 * A planta repõe o bloco que deixava a vírgula sozinha no início da linha.
 */
export async function conferirDisposicaoDossies(pagina) {
  const entradas = pagina.locator('.dossies-lista > [data-dossie-lista]');
  const quantidade = await entradas.count();
  if (!quantidade) throw Error('DO2-E: superfície dos dossiês ausente');
  const resultados = [];
  for (let i = 0; i < quantidade; i++) {
    const entrada = entradas.nth(i);
    await entrada.scrollIntoViewIfNeeded();
    const medir = () => entrada.evaluate(el => {
      const titulo = el.querySelector('h2,h3'), a = titulo?.querySelector('a');
      if (!a) return { erros: ['DO2-E: ligação do título ausente'] };
      const caracteres = [];
      const walker = document.createTreeWalker(titulo, NodeFilter.SHOW_TEXT);
      for (let no; (no = walker.nextNode());) {
        for (let j = 0; j < no.textContent.length; j++) {
          if (/\s/.test(no.textContent[j])) continue;
          const range = document.createRange();
          range.setStart(no, j); range.setEnd(no, j + 1);
          const r = range.getBoundingClientRect();
          caracteres.push({ letra: no.textContent[j], naLigacao: a.contains(no), x: r.x, y: r.y, altura: r.height });
        }
      }
      const k = caracteres.findIndex(c => !c.naLigacao && c.letra === ',');
      const virgula = caracteres[k], anterior = caracteres[k - 1];
      const erros = [];
      if (!virgula || !anterior) erros.push('DO2-E: vírgula da entrada ausente');
      else if (Math.abs(virgula.y - anterior.y) > 1 || virgula.x <= anterior.x) erros.push('DO2-E: vírgula abre uma linha');
      const fonte = getComputedStyle(titulo);
      for (const no of titulo.querySelectorAll('a,span,time')) {
        // O algarismo conserva a tipografia própria do token da prova.
        if (no.matches('[data-prova]')) continue;
        const estilo = getComputedStyle(no);
        if (['fontSize', 'fontFamily', 'fontWeight'].some(p => estilo[p] !== fonte[p])) erros.push('DO2-E: tipografia da entrada desigual');
      }
      const caixas = [...a.getClientRects()].map(r => ({ x: r.x, y: r.y, largura: r.width, altura: r.height }));
      const toca = (x, y) => {
        const alvo = document.elementFromPoint(x, y);
        return alvo === a || a.contains(alvo);
      };
      for (const r of caixas) {
        const x = r.x + r.largura / 2, y = r.y + r.altura / 2;
        if (r.altura < 44 || !toca(x, y - 21.5) || !toca(x, y + 21.5)) erros.push('DO2-E: ligação sem alvo de 44 px');
      }
      return { slug: el.dataset.dossieLista, erros, virgula, anterior, caixas };
    });
    const limpa = await medir();
    if (limpa.erros.length) throw Error(limpa.erros.join('; '));
    const ligacao = entrada.locator('h2 > a,h3 > a');
    const estilo = await ligacao.getAttribute('style');
    try {
      await ligacao.evaluate(a => a.style.setProperty('display', 'block', 'important'));
      const estragada = await medir();
      if (!estragada.erros.includes('DO2-E: vírgula abre uma linha')) throw Error('DO2-E: a planta da vírgula não mordeu');
    } finally {
      await ligacao.evaluate((a, original) => original === null ? a.removeAttribute('style') : a.setAttribute('style', original), estilo);
    }
    const reposta = await medir();
    if (reposta.erros.length) throw Error('DO2-E: a entrada reposta não passou');
    resultados.push({ ...limpa, planta: 'DO2-E: vírgula abre uma linha', reposta: true });
  }
  await pagina.evaluate(() => scrollTo(0, 0));
  return resultados;
}
