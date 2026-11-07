import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {manifestoEd2} from '../../scripts/edicoes-linha-conferir.mjs';
import {repertorioDaVozDasEdicoes,classeDaVozDaEdicao,conferirVozDaLinha,retiradaForaDaFrase} from '../../scripts/voz-edicoes.mjs';
const pedida=process.argv.includes('--planta-outra-palavra');let controlos=0,plantas=0;
for(const lang of ['pt','en']){
 const manifesto=structuredClone(manifestoEd2),slug='evora-2027-capital-europeia-da-cultura',e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang);
 e.edicoes.push({...e.edicoes.at(-1),data:'2026-11-07'});
 const pt=lang==='pt',labels=pt?['(primeira)','(atualização)','(correção)','(correção, atual)']:['(first)','(update)','(correction)','(correction, current)'];
 const base=`${pt?'/estudos':'/en/studies'}/${slug}/${pt?'documento':'document'}`;
 const html=`<p data-estudo-edicao="${slug}/${lang}"><span data-edicoes-linha><span data-voz>${pt?'Edições:':'Editions:'}</span> ${e.edicoes.map((v,i)=>`<span data-edicoes-item><a href="${base}${i===3?'':'/'+v.data}"><time data-edicao-lista-data datetime="${v.data}">${v.data.split('-').reverse().join('.')}</time></a> <span data-voz>${labels[i]}</span></span>`).join(' · ')}</span></p>`;
 const root=parse(html).firstChild,prova=repertorioDaVozDasEdicoes(manifesto);
 assert.deepEqual(conferirVozDaLinha(root,manifesto,slug,lang),[]);controlos++;
 const forma=`${pt?'Edições:':'Editions:'} ${labels.join(' · ')} · ${pt?'publicado a · atualizado a · corrigido a':'published on · updated on · corrected on'}`;
 assert.equal(classeDaVozDaEdicao(forma,prova),'conteudo');controlos++;
 assert.equal(retiradaForaDaFrase(forma,pt?'Edições':'Editions',prova.faixas.get(pt?'Edições':'Editions')),false);controlos++;
 assert.equal(classeDaVozDaEdicao(forma.replace(labels[2],labels[1]),prova),null);plantas++;
 const errada=forma.replace(labels[2],'(outra palavra)');assert.equal(classeDaVozDaEdicao(errada,prova),null);plantas++;
 root.querySelectorAll('[data-edicoes-item]')[2].querySelector('[data-voz]').set_content('(outra palavra)');
 assert(conferirVozDaLinha(root,manifesto,slug,lang).length);plantas++;
 if(pedida)console.error(`ED2 B voz ${lang}: outra palavra recusada na linha de quatro edições`);
}
console.log(`ED2 B voz: ${controlos} controlos; ${plantas} plantas recusadas.`);
if(pedida)process.exitCode=1;
