/** H10: mede cada comando no navegador e exige a recusa do conhecido positivo. */
export async function medeComandos(pagina) {
  const comandos = pagina.locator('[aria-expanded]');
  const provas = [];
  for (let i = 0; i < await comandos.count(); i++) {
    const comando = comandos.nth(i);
    const feitio = await comando.evaluate(el =>
      el.matches('details > summary[aria-controls], button[aria-controls], a[href][aria-controls]') &&
      !!document.getElementById(el.getAttribute('aria-controls')));
    if (!feitio) { provas.push({ i, mudou: false, motivo: 'elemento sem comando ou sem destino' }); continue; }
    const estado = () => comando.evaluate(el => {
      const alvo = document.getElementById(el.getAttribute('aria-controls'));
      const caixa = alvo.getBoundingClientRect();
      const estilo = getComputedStyle(alvo);
      return { atributo: el.getAttribute('aria-expanded'), aberto: el.matches('details > summary')
        ? el.parentElement.open : caixa.width > 0 && caixa.height > 0 && estilo.visibility !== 'hidden' && estilo.display !== 'none' };
    });
    const antes = await estado();
    try {
      await comando.click({ timeout: 2000 });
      await pagina.waitForTimeout(50);
      const depois = await estado();
      await comando.click({ timeout: 2000 });
      await pagina.waitForTimeout(50);
      const reposto = await estado();
      provas.push({ i, antes, depois, reposto, mudou:
        [antes, depois, reposto].every(e => e.atributo === String(e.aberto)) &&
        antes.aberto !== depois.aberto && antes.aberto === reposto.aberto });
    } catch (erro) {
      provas.push({ i, antes, mudou: false, motivo: String(erro) });
    }
  }
  return provas;
}

export const aceitaComandos = provas => provas.length > 0 && provas.every(p => p.mudou);

export function avaliaExpanded(dist, provas, positivo) {
  const medidos = provas.flatMap(p => p.comandos);
  const completo = provas.length === dist.paginasExpanded.length &&
    dist.paginasExpanded.every(p => provas.some(v => v.rota === p.rota && v.comandos.length === p.n));
  const reais = dist.expanded === 0 ? completo && medidos.length === 0
    : completo && medidos.length === dist.expanded && aceitaComandos(medidos);
  return reais && positivo.ocorrencias === 1 && positivo.aceite === false;
}
