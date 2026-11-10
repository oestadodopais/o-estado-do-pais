import {mudancasNoManifesto,conferirLinhaDasEdicoes,manifestoEd2} from './edicoes-linha-conferir.mjs';
import {versoesDaEdicao} from '../src/lib/edicoes.mjs';
import {dataPublicacao as publicacaoEd1} from '../src/lib/publicacao.mjs';
import { dataDoDossiePermitida } from './dossies-html.mjs';
/** FP1-d: a isenção editorial depende do elemento, da página e da origem. */
import {ITENS} from '../src/data/discussao.mjs';
import {WORKS} from '../src/data/studies.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {eDerivada} from '../src/lib/ledger.mjs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
export function dataEditorialPermitida(el, rota, claim, lang='pt', manifesto=null) {
  if(el.tagName?.toLowerCase()!=='time' || !/^\d{4}-\d{2}-\d{2}$/.test(el.getAttribute('datetime')??''))return false;
  const origem=el.getAttribute('data-data-origem');
  if(dataDoDossiePermitida(el,rota,lang))return true;
  if(origem==='edicoes.data' && el.hasAttribute('data-edicao-lista-data')) {
    const bloco=el.closest('[data-estudo-edicao], [data-documento-edicao]');
    const [slug,lingua,data]=(bloco?.getAttribute('data-estudo-edicao')??bloco?.getAttribute('data-documento-edicao')??'').split('/');
    const edicoes=WORKS.find(w=>w.slug===slug)?.editions;
    const linguaValida=lingua===lang || (rota==='estudo'&&edicoes?.length===1&&edicoes[0].lang===lingua);
    return Boolean(bloco&&el.closest('[data-edicoes-linha]')&&linguaValida&&((rota==='estudo'&&!data)||(rota==='documento'&&data))&&!conferirLinhaDasEdicoes(bloco,manifesto??manifestoEd2,slug,lingua,data??null,lang).length);
  }
  if(rota==='estudo' && origem==='edicoes.data' && (el.hasAttribute('data-estudo-atualizacao')||el.hasAttribute('data-estudo-correcao'))) {
    const [slug,lingua]=(el.closest('[data-estudo-edicao]')?.getAttribute('data-estudo-edicao')??'').split('/');
    const natureza=el.hasAttribute('data-estudo-atualizacao')?'atualizacao':'correcao';
    const m=mudancasNoManifesto(slug,lingua,manifesto??manifestoEd2).find(m=>m.natureza===natureza);
    const w=WORKS.find(w=>w.slug===slug),principal=w?.editions.find(e=>e.lang===lang)??w?.editions[0];
    return Boolean(m&&lingua===principal?.lang&&el.getAttribute('datetime')===m.data&&el.text.trim()===dataDaCasa(m.data));
  }
  if(rota==='correcoes' && origem==='edicoes.data') {
    const entrada=el.closest('[data-texto-estudo]'),porta=el.parentNode;
    const slug=entrada?.getAttribute('data-texto-estudo'),data=entrada?.getAttribute('data-texto-data');
    const vs=slug?versoesDaEdicao(slug,lang):[],i=vs.findIndex(v=>v.data===data);
    const lado=porta?.getAttribute('data-texto-porta');
    if(i<1||!['primeira','atual'].includes(lado)||porta.rawTagName!=='a')return false;
    const v=vs[lado==='primeira'?i-1:i];
    return Boolean(v.indice>0&&!v.atual&&porta.getAttribute('href')===v.rota&&porta.querySelectorAll('time').length===1&&el.getAttribute('data-nonledger')==='data-editorial'&&el.getAttribute('datetime')===v.data&&el.text.trim()===dataDaCasa(v.data));
  }
  if(rota==='home') {
    const resumo=el.closest('p[data-discussao-resumo]');
    if(resumo?.closest('[data-discussao-inicio]')) {
      const porta=resumo.parentNode?.querySelector('a[data-discussao-porta]');
      const item=ITENS.find(e=>e.slug===porta?.getAttribute('data-discussao-porta'));
      // OG1-B-c: a data da frase mostrada é a da escrita; a caixa de novidades conserva a publicação.
      return Boolean(item && origem==='escrita.declarada' && el.parentNode===resumo && el.getAttribute('datetime')===item.escrita && el.text.trim()===dataDaCasa(item.escrita));
    }
    if(el.closest('p[data-atualizacao]')?.closest('main'))return ['verificacao.verificadoEm','version.construido_em'].includes(origem);
    const novidade=el.closest('[data-novidades] [data-novidade]');
    if(novidade && origem==='edicoes.data') {
      const id=novidade.getAttribute('data-novidade');
      const work=WORKS.find(w=>id===`estudo:${w.slug}`);
      const edicao=work?.editions.find(e=>e.lang===lang)??work?.editions.slice().sort((a,b)=>(publicacaoEd1(work,b)??'').localeCompare(publicacaoEd1(work,a)??''))[0];
      const versoes=work&&edicao?(manifesto?.edicoes.find(e=>e.slug===work.slug&&e.lang===edicao.lang)?.edicoes??versoesDaEdicao(work.slug,edicao.lang)):[];
      const atual=versoes.slice(1).findLast(e=>e.natureza==='atualizacao');
      return Boolean(atual?.natureza==='atualizacao' && el.getAttribute('datetime')===atual.data && el.text.trim()===dataDaCasa(atual.data));
    }
    return Boolean(novidade) && ['publicacao.declarada','publicacao.gerada'].includes(origem);
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
 let plantasPortas=0;
 for(const lang of ['pt','en']) {
  const slug='evora-2027-capital-europeia-da-cultura',vs=versoesDaEdicao(slug,lang),v=vs[1];
  const html=`<li data-texto-estudo="${slug}" data-texto-data="${vs[2].data}"><a data-texto-porta="primeira" href="${v.rota}"><time datetime="${v.data}" data-nonledger="data-editorial" data-data-origem="edicoes.data">${dataDaCasa(v.data)}</time></a></li>`;
  const controlo=parse(html).querySelector('time');
  assert.equal(dataEditorialPermitida(controlo,'correcoes',null,lang),true);
  for(const mudar of [
   t=>{t.setAttribute('datetime',vs[0].data);t.set_content(dataDaCasa(vs[0].data));},
   t=>t.parentNode.setAttribute('href',vs[0].rota),
   t=>t.setAttribute('data-data-origem','origem-inventada'),
   t=>t.closest('li').setAttribute('data-texto-estudo','estudo-inexistente'),
   t=>t.parentNode.setAttribute('data-texto-porta','atual'),
   t=>t.parentNode.insertAdjacentHTML('beforeend',t.outerHTML),
  ]) {const t=parse(html).querySelector('time');mudar(t);const erros=[];conferirDataEditorial(t,'correcoes',null,e=>erros.push(e),lang);assert.equal(erros.length,1);plantasPortas++;}
  assert.equal(dataEditorialPermitida(parse(controlo.outerHTML).querySelector('time'),'correcoes',null,lang),false);plantasPortas++;
 }
 console.log(`EV3-p: datas das portas conferidas nas duas línguas; ${plantasPortas} adulterações recusadas.`);

 const work=WORKS.find(w=>w.slug==='evora-2027-capital-europeia-da-cultura');
 for(const lang of ['pt','en']) {
  const edicao=work.editions.find(e=>e.lang===lang);
  const dataCorrigida=mudancasNoManifesto(work.slug,lang).find(m=>m.natureza==='correcao').data;
  const html=`<p data-estudo-edicao="${work.slug}/${lang}"><time data-estudo-correcao datetime="${dataCorrigida}" data-nonledger="data-editorial" data-data-origem="edicoes.data">${dataDaCasa(dataCorrigida)}</time></p>`;
  const el=parse(html).querySelector('time');
  assert.equal(dataEditorialPermitida(el,'estudo',null,lang),true);
  assert.equal(dataEditorialPermitida(el,'home',null,lang),false);
  el.setAttribute('datetime',edicao.date);assert.equal(dataEditorialPermitida(el,'estudo',null,lang),false);
  el.setAttribute('datetime',dataCorrigida);el.setAttribute('data-data-origem','origem-inventada');assert.equal(dataEditorialPermitida(el,'estudo',null,lang),false);
  const fora=parse(el.outerHTML).querySelector('time');fora.setAttribute('data-data-origem','edicoes.data');assert.equal(dataEditorialPermitida(fora,'estudo',null,lang),false);
 }
 console.log('EV2: correção histórica conferida; página, data, origem e edição ausente recusadas nas duas línguas.');
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
