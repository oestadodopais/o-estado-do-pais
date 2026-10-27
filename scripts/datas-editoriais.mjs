/** FP1-d: a isenção editorial depende do elemento, da página e da origem. */
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
export function dataEditorialPermitida(el, rota, claim) {
  if(el.tagName?.toLowerCase()!=='time' || !/^\d{4}-\d{2}-\d{2}$/.test(el.getAttribute('datetime')??''))return false;
  const origem=el.getAttribute('data-data-origem');
  if(rota==='home') {
    if(el.closest('[data-atualizacao]')?.closest('[data-novidades]'))return ['verificacao.verificadoEm','version.construido_em'].includes(origem);
    return Boolean(el.closest('[data-novidades] [data-novidade]')) && ['publicacao.declarada','publicacao.gerada','mudancas.ultima'].includes(origem);
  }
  if(rota!=='linha'||!el.closest('[data-recibo-datas]'))return false;
  if(origem==='calendario.proxima-segunda')return !claim?.derived_from?.length && Boolean(claim?.verifications?.some(v=>v.by==='painel-semanal'));
  if(['reference_date','period','published_at','access_date'].includes(origem))return claim?.[origem]!=null;
  const m=/^verifications\.(\d+)\.date$/.exec(origem??'');
  return Boolean(m&&claim?.verifications?.[Number(m[1])]?.date);
}
export function plantasDatasEditoriais() {
 const fora=parse('<main><span data-nonledger="data-editorial">987654</span></main>').querySelector('[data-nonledger]');
 assert.equal(dataEditorialPermitida(fora,'home'),false);
 const dentro=parse('<section data-novidades><li data-novidade><time datetime="2000-01-01" data-data-origem="publicacao.gerada">01.01.2000</time></li></section>').querySelector('time');
 assert.equal(dataEditorialPermitida(dentro,'home'),true);
 dentro.setAttribute('data-data-origem','origem-inventada');assert.equal(dataEditorialPermitida(dentro,'home'),false);
 console.log('FP1-d: número com isenção editorial fora dos contextos e origem inventada recusados; controlo no contexto aceite.');
}
