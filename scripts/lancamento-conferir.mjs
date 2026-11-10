import { emEnsaio } from '../site.config.mjs';
import { ENSAIO } from '../src/data/ensaio.mjs';
/** Conferência do HTML publicado, antes das saídas antecipadas dos documentos. */
export function conferirLancamentoHtml(root, rota) {
  const erros = [], ensaio = emEnsaio();
  const robos = root.querySelectorAll('meta[name="robots"]');
  const documento = Boolean(root.querySelector('[data-oedp-faixa]'));
  if ((ensaio || documento) && (robos.length !== 1 || robos[0].getAttribute('content') !== 'noindex, follow' || !robos[0].closest('head')))
    erros.push('REC1 robots: exige uma só meta noindex, follow no head');
  const marcas = root.querySelectorAll('[data-edicao-ensaio]');
  const lang = rota?.lang ?? (root.querySelector('html')?.getAttribute('lang')?.startsWith('en') ? 'en' : 'pt');
  if (ensaio) {
    if (marcas.length !== 1 || marcas[0].childNodes.filter(n => n.nodeType === 3).map(n => n.textContent).join('') !== ENSAIO[lang].marca + ' ' || marcas[0].querySelectorAll('.vh').length !== 1 || marcas[0].querySelector('.vh')?.textContent !== ENSAIO[lang].acessivel || marcas[0].getAttribute('title') !== ENSAIO[lang].acessivel || marcas[0].hasAttribute('aria-label') || !marcas[0].classList.contains('rotulo-ia-linha') || !marcas[0].closest(documento ? '[data-oedp-faixa]' : 'header'))
      erros.push('REC1 marca: edição de ensaio ausente ou diferente');
  } else if (marcas.length) erros.push('REC1 marca: ensaio depois do lançamento');
  if (rota?.key === 'correcoes' && ensaio) {
    if (root.querySelector('[data-mudanca], [data-correcao-entrada], [data-texto-estudo], .registo-conta')) erros.push('REC1 registo: entrada ou contagem durante o ensaio');
    if (root.querySelector('[data-registo-vazio]')?.textContent !== ENSAIO[lang].registo) erros.push('REC1 registo: falta a frase de ensaio');
  }
  return erros;
}
export function conferirRobotsTxt(texto) {
  const esperado = 'Allow: /';
  const regras = texto.split(/\r?\n/).filter(l => /^(?:Disallow|Allow):/.test(l));
  return regras.length === 1 && regras[0] === esperado ? [] : ['REC1 robots.txt: regra diferente do lançamento'];
}
