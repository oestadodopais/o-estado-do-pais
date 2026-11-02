import {rotaAtual,rotaPrimeira} from './edicoes-conferir.mjs';
const normal=s=>s.replace(/\s+/g,' ').trim(),forma=d=>d.split('-').reverse().join('.');
export function conferirFaixaDaVersao(root,manifesto,slug,lang,data=null){
 const e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang),vs=e?.edicoes??[],i=data?vs.findIndex(v=>v.data===data):vs.length-1;
 const faixas=root.querySelectorAll('[data-documento-edicao]'),erros=[];
 if(vs.length<2){if(faixas.length)erros.push('ED1 faixa: documento sem história imprime faixa de versões');return erros;}
 if(i<0||faixas.length!==1)return ['ED1 faixa: falta a edição declarada'];
 const el=faixas[0],v=vs[i],p=vs[0],a=vs.at(-1),pt=lang==='pt',atual=i===vs.length-1;
 const esperado=i===0?(pt?`Primeira edição, publicada a ${forma(v.data)}. A edição atual é de ${forma(a.data)}.`:`First edition, published on ${forma(v.data)}. The current edition is from ${forma(a.data)}.`):atual?(pt?`Edição atual, de ${forma(v.data)}. A primeira edição é de ${forma(p.data)}.`:`Current edition, from ${forma(v.data)}. The first edition is from ${forma(p.data)}.`):(pt?`Edição de ${forma(v.data)}. A edição atual é de ${forma(a.data)}.`:`Edition of ${forma(v.data)}. The current edition is from ${forma(a.data)}.`);
 if(el.getAttribute('data-documento-edicao')!==`${slug}/${lang}/${v.data}`||el.getAttribute('lang')!==(pt?'pt-PT':'en-GB')||normal(el.querySelector('[data-edicao-frase]')?.textContent??'')!==esperado)erros.push('ED1 faixa: frase, língua ou edição incorreta');
 const datas=el.querySelectorAll('time[data-edicao-data]'),esperadas=[v.data,atual?p.data:a.data];
 if(datas.length!==2||datas.some((d,j)=>d.getAttribute('datetime')!==esperadas[j]||d.textContent!==forma(esperadas[j])))erros.push('ED1 faixa: datas incorretas');
 const portas=el.querySelectorAll('a[href]'),destino=atual?rotaPrimeira(e):rotaAtual(slug,lang),rotulo=atual?(pt?'Primeira edição, tal como foi publicada':'First edition, as published'):(pt?'Edição atual':'Current edition');
 if(portas.length!==1||portas[0].getAttribute('href')!==destino||portas[0].textContent!==rotulo)erros.push('ED1 faixa: porta incorreta');
 const marca=root.querySelector('[data-oedp-faixa]');if(marca&&el.range[0]>marca.range[0])erros.push('ED1 faixa: não está no topo');
 return erros;
}
