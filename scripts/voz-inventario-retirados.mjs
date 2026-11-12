/** REC2: as declarações históricas ficam, mas só descrições de retirados dispensam presença. */
import {entradaRetiradaRet1} from './voz-inventario-ret1.mjs';
import {WORKS} from '../src/data/studies.mjs';
import {DOSSIES} from '../src/data/dossies.mjs';
import {FP1} from '../src/data/rotulos-fp1.mjs';
import {routePath} from '../src/lib/routes.mjs';
export function donosRetiradosDaDescricao(linha, trabalhos = WORKS) {
  if (linha.estado !== 'viva' || linha.classe !== 'conteudo') return [];
  const donos = trabalhos.filter(w => Object.values(w.description ?? {}).includes(linha.texto));
  return donos.length && donos.every(w => w.estado === 'retirado') ? donos.map(w => w.slug) : [];
}
export function separarDescricoesRetiradas(ausentes, inventario, trabalhos = WORKS) {
  const saltadas = [], restantes = [];
  for (const l of ausentes) {
    const original = inventario.find(i => i.n === l.n && i.texto === l.texto && i.classe === l.classe && i.bloco === l.bloco);
    const donos = original ? donosRetiradosDaDescricao(original, trabalhos) : [];
    if (donos.length || (original && entradaRetiradaRet1(original, {trabalhos}))) saltadas.push({...l, estudos:donos}); else restantes.push(l);
  }
  const esperadas = inventario.filter(l => (donosRetiradosDaDescricao(l, trabalhos).length || entradaRetiradaRet1(l, {trabalhos})) && ausentes.some(a => a.n === l.n && a.texto === l.texto && a.classe === l.classe && a.bloco === l.bloco));
  if (JSON.stringify(saltadas.map(l => l.n).sort()) !== JSON.stringify(esperadas.map(l => l.n).sort())) throw new Error('REC2: conta das descrições retiradas difere do inventário');
  return {saltadas, restantes};
}
/** A dispensa só cobre o rótulo literal, no item e na porta do dossiê declarado. */
export function rotuloDoDossieNaNovidade(el, lang, rotaKey) {
  if (rotaKey !== 'home' || el.rawTagName !== 'span' || !el.classList.contains('pp-novidade-tipo')) return false;
  if (el.textContent !== FP1[lang]?.dossie || !el.closest('[data-novidades]')) return false;
  const item = el.parentNode, id = item?.getAttribute('data-novidade');
  if (item?.rawTagName !== 'li' || !id?.startsWith('dossie:')) return false;
  const slug = id.slice('dossie:'.length), porta = item.querySelector('[data-novidade-dossie]');
  return DOSSIES.some(d => d.slug === slug) && item.querySelectorAll('.pp-novidade-tipo').length === 1 &&
    porta?.getAttribute('data-novidade-dossie') === slug && porta.getAttribute('href') === routePath('dossie', lang, {slug});
}
