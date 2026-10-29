import { dataDoDossiePermitida } from './dossies-html.mjs';
/** FP1-d: a isenção editorial depende do elemento, da página e da origem. */
import {ITENS} from '../src/data/discussao.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {eDerivada} from '../src/lib/ledger.mjs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
export function dataEditorialPermitida(el, rota, claim, lang='pt') {
  if(el.tagName?.toLowerCase()!=='time' || !/^\d{4}-\d{2}-\d{2}$/.test(el.getAttribute('datetime')??''))return false;
  const origem=el.getAttribute('data-data-origem');
  if(dataDoDossiePermitida(el,rota,lang))return true;
  if(rota==='home') {
    const resumo=el.closest('p[data-discussao-resumo]');
    if(resumo?.closest('[data-discussao-inicio]')) {
      const porta=resumo.parentNode?.querySelector('a[data-discussao-porta]');
      const item=ITENS.find(e=>e.slug===porta?.getAttribute('data-discussao-porta'));
      // OG1-B-c: a data da frase mostrada é a da escrita; a caixa de novidades conserva a publicação.
      return Boolean(item && origem==='escrita.declarada' && el.parentNode===resumo && el.getAttribute('datetime')===item.escrita && el.text.trim()===dataDaCasa(item.escrita));
    }
    if(el.closest('[data-atualizacao]')?.closest('[data-novidades]'))return ['verificacao.verificadoEm','version.construido_em'].includes(origem);
    return Boolean(el.closest('[data-novidades] [data-novidade]')) && ['publicacao.declarada','publicacao.gerada','mudancas.ultima'].includes(origem);
  }
  if(rota!=='linha'||!el.closest('[data-recibo-datas]'))return false;
  if(origem==='calendario.proxima-segunda')return !eDerivada(claim) && Boolean(claim?.verifications?.some(v=>v.by==='painel-semanal'));
  if(['reference_date','period','published_at','access_date'].includes(origem))return claim?.[origem]!=null;
  const m=/^verifications\.(\d+)\.date$/.exec(origem??'');
  return Boolean(m&&claim?.verifications?.[Number(m[1])]?.date);
}
export function conferirDataEditorial(el, rota, claim, err, lang='pt') {
 if (!dataEditorialPermitida(el,rota,claim,lang)) err('FP1-e: data-editorial fora dos contextos e origens permitidos.');
}
export function plantasDatasEditoriais() {
 const html='<time datetime="2000-01-01" data-nonledger="data-editorial" data-data-origem="publicacao.gerada">01.01.2000</time>';
 const fora=parse('<main>'+html+'</main>').querySelector('time');
 const erros=[];conferirDataEditorial(fora,'home',null,e=>erros.push(e));
 assert.equal(erros.length,1);assert.match(erros[0],/fora dos contextos/);
 const dentro=parse('<section data-novidades><li data-novidade>'+html+'</li></section>').querySelector('time');
 const controlo=[];conferirDataEditorial(dentro,'home',null,e=>controlo.push(e));assert.deepEqual(controlo,[]);
 dentro.setAttribute('data-data-origem','origem-inventada');conferirDataEditorial(dentro,'home',null,e=>controlo.push(e));assert.equal(controlo.length,1);
 const item=ITENS[0];
 const resumo=parse(`<section data-discussao-inicio><li><a data-discussao-porta="${item.slug}"></a><p data-discussao-resumo><time datetime="${item.escrita}" data-nonledger="data-editorial" data-data-origem="escrita.declarada">${dataDaCasa(item.escrita)}</time></p></li></section>`).querySelector('time');
 assert.equal(dataEditorialPermitida(resumo,'home',null),true);
 const publicada=parse(resumo.outerHTML).querySelector('time');publicada.setAttribute('datetime',item.publicado);publicada.setAttribute('data-data-origem','publicacao.declarada');publicada.set_content(dataDaCasa(item.publicado));assert.equal(dataEditorialPermitida(publicada,'home',null),false);
 resumo.setAttribute('datetime','9999-12-31');assert.equal(dataEditorialPermitida(resumo,'home',null),false);
 resumo.setAttribute('datetime',item.escrita);resumo.setAttribute('data-data-origem','publicacao.gerada');assert.equal(dataEditorialPermitida(resumo,'home',null),false);
 resumo.setAttribute('data-data-origem','escrita.declarada');assert.equal(dataEditorialPermitida(resumo,'discussao',null),false);
 console.log('FP2: escrita declarada no resumo aceite; data, origem e página trocadas recusadas.');
 console.log('FP1-e: time com origem válida fora do contexto recusado pelo caminho do portão; controlo dentro aceite; origem inventada recusada.');
}
