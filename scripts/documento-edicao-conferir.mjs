import {conferirLinhaDasEdicoes} from './edicoes-linha-conferir.mjs';
export function conferirFaixaDaVersao(root,manifesto,slug,lang,data=null){
 const e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang),vs=e?.edicoes??[],i=data?vs.findIndex(v=>v.data===data):vs.length-1;
 const faixas=root.querySelectorAll('[data-documento-edicao]'),erros=[];
 if(vs.length<2){if(faixas.length)erros.push('ED1 faixa: documento sem história imprime faixa de versões');return erros;}
 if(i<0||faixas.length!==1)return ['ED1 faixa: falta a edição declarada'];
 const el=faixas[0],v=vs[i],pt=lang==='pt';
 if(el.getAttribute('data-documento-edicao')!==`${slug}/${lang}/${v.data}`||el.getAttribute('lang')!==(pt?'pt-PT':'en-GB'))erros.push('ED3 faixa: língua ou edição incorreta');
 if(el.querySelector('[data-edicao-frase]')||el.querySelector('[data-edicao-data]'))erros.push('ED3 faixa: frase antiga reposta');
 erros.push(...conferirLinhaDasEdicoes(el,manifesto,slug,lang,v.data));
 const marca=root.querySelector('[data-oedp-faixa]');if(marca&&el.range[0]>marca.range[0])erros.push('ED1 faixa: não está no topo');
 return erros;
}
