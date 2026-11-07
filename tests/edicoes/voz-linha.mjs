import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {manifestoEd2} from '../../scripts/edicoes-linha-conferir.mjs';
import {repertorioDaVozDasEdicoes,classeDaVozDaEdicao,conferirVozDaLinha,retiradaForaDaFrase} from '../../scripts/voz-edicoes.mjs';
const pedida=process.argv.includes('--planta-outra-palavra');let controlos=0,plantas=0;
for(const lang of ['pt','en']){
 const manifesto=structuredClone(manifestoEd2),slug='evora-2027-capital-europeia-da-cultura',e=manifesto.edicoes.find(e=>e.slug===slug&&e.lang===lang);
 // Planta de quatro versões, independente das atualizações posteriores.
 e.edicoes=e.edicoes.slice(0,3);
 e.edicoes.push({...e.edicoes.at(-1),data:'2026-11-07'});
 const pt=lang==='pt',labels=pt?['publicado a','atualizado a','corrigido a','corrigido a']:['published on','updated on','corrected on','corrected on'];
 const base=`${pt?'/estudos':'/en/studies'}/${slug}/${pt?'documento':'document'}`;
 const html=`<p data-estudo-edicao="${slug}/${lang}"><span data-edicoes-linha>${e.edicoes.map((v,i)=>`<span data-edicoes-item><span data-voz>${labels[i]}</span> <a href="${base}${i===3?'':'/'+v.data}" hreflang="${pt?'pt-PT':'en'}"><time data-edicao-lista-data datetime="${v.data}" data-nonledger="${i===0?'data-do-repositorio':'data-editorial'}"${i?' data-data-origem="edicoes.data"':''}${i===1?' data-estudo-atualizacao':''}${i===3?' data-estudo-correcao':''}>${v.data.split('-').reverse().join('.')}</time></a>${i===3?` <span data-voz>${pt?'(atual)':'(current)'}</span>`:''}</span>`).join('<span aria-hidden="true"> · </span>')}</span></p>`;
 const root=parse(html).firstChild,prova=repertorioDaVozDasEdicoes(manifesto);
 assert.deepEqual(conferirVozDaLinha(root,manifesto,slug,lang),[]);controlos++;
 const forma=`${labels.join(' · ')} ${pt?'(atual)':'(current)'}`;
 assert.equal(classeDaVozDaEdicao(forma,prova),'conteudo');controlos++;
 assert.equal(retiradaForaDaFrase(forma,pt?'publicado a ·':'published on ·',prova.faixas.get(pt?'publicado a ·':'published on ·')),false);controlos++;
 assert.equal(classeDaVozDaEdicao(forma.replace(`${labels[2]} ·`,`${labels[1]} ·`),prova),null);plantas++;
 const errada=forma.replace(labels[2],'outra palavra');assert.equal(classeDaVozDaEdicao(errada,prova),null);plantas++;
 root.querySelectorAll('[data-edicoes-item]')[2].querySelector('[data-voz]').set_content('outra palavra');
 assert(conferirVozDaLinha(root,manifesto,slug,lang).length);plantas++;
 if(pedida)console.error(`ED3 voz ${lang}: outra palavra recusada na linha de quatro edições`);
}
console.log(`ED3 voz: ${controlos} controlos; ${plantas} plantas recusadas.`);
if(pedida)process.exitCode=1;
