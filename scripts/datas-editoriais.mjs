/** FP1-d: a isenção editorial depende do elemento, da página e da origem. */
import {eDerivada} from '../src/lib/ledger.mjs';
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
  if(origem==='calendario.proxima-segunda')return !eDerivada(claim) && Boolean(claim?.verifications?.some(v=>v.by==='painel-semanal'));
  if(['reference_date','period','published_at','access_date'].includes(origem))return claim?.[origem]!=null;
  const m=/^verifications\.(\d+)\.date$/.exec(origem??'');
  return Boolean(m&&claim?.verifications?.[Number(m[1])]?.date);
}
export function conferirDataEditorial(el, rota, claim, err) {
 if (!dataEditorialPermitida(el,rota,claim)) err('FP1-e: data-editorial fora dos contextos e origens permitidos.');
}
export function plantasDatasEditoriais() {
 const html='<time datetime="2000-01-01" data-nonledger="data-editorial" data-data-origem="publicacao.gerada">01.01.2000</time>';
 const fora=parse('<main>'+html+'</main>').querySelector('time');
 const erros=[];conferirDataEditorial(fora,'home',null,e=>erros.push(e));
 assert.equal(erros.length,1);assert.match(erros[0],/fora dos contextos/);
 const dentro=parse('<section data-novidades><li data-novidade>'+html+'</li></section>').querySelector('time');
 const controlo=[];conferirDataEditorial(dentro,'home',null,e=>controlo.push(e));assert.deepEqual(controlo,[]);
 dentro.setAttribute('data-data-origem','origem-inventada');conferirDataEditorial(dentro,'home',null,e=>controlo.push(e));assert.equal(controlo.length,1);
 console.log('FP1-e: time com origem válida fora do contexto recusado pelo caminho do portão; controlo dentro aceite; origem inventada recusada.');
}
