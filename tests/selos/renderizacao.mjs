import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {selosDepoisDaMedida,irmaoDepoisDaMedida,partesComMedida,partesComRecibos} from '../../src/lib/posicao-do-selo.mjs';
import {medirPagina} from '../../scripts/check-selos.mjs';
import {manifestoDosRegistos,registoDaEdicao} from '../../src/lib/registos.mjs';
import {pecasDoCorpo} from '../../src/lib/registo-html.mjs';
import {linhaDoSitioDoEstudo} from '../../src/lib/cruzamento.mjs';
const chip=id=>`<a class="src-chip" href="/livro-razao/${id}">fonte</a>`;
const html=ps=>ps.map(p=>p.html??chip(p.selo)).join('');
for(const depois of [' milhões de euros.', '</strong> milhões.', ' para a escola.', '  milhões.']) {
 const antes=[{html:'<p><strong><span data-registo="figura">79</span>'},{selo:'linha'},{html:depois+'</p>'}];
 const novas=selosDepoisDaMedida(antes);
 assert.equal(novas.filter(p=>'html'in p).map(p=>p.html).join(''),antes.filter(p=>'html'in p).map(p=>p.html).join(''));
 const root=parse(html(novas)),fig=root.querySelector('[data-registo]');
 const selo=irmaoDepoisDaMedida(fig).irmao;
 assert.equal(selo?.getAttribute('href'),'/livro-razao/linha');
 selo.setAttribute('href','/livro-razao/outra');
 assert.notEqual(irmaoDepoisDaMedida(fig).irmao?.getAttribute('href'),'/livro-razao/linha','fonte errada aceite');
}
assert.equal(irmaoDepoisDaMedida(parse(`<p><span>79</span> palavras ${chip('linha')}</p>`).querySelector('span')).irmao,null);
const p=[{claim:'linha'},' milhões de euros de despesa'];
assert.deepEqual(partesComMedida(p),[{claim:'linha',cauda:' milhões de euros'},' de despesa']);assert.equal(p[1],' milhões de euros de despesa');
assert.deepEqual(partesComMedida([{claim:'linha',sufixo:' %'},' do PIB em Portugal']),[{claim:'linha',sufixo:' %',cauda:' do PIB'},' em Portugal']);
assert.throws(()=>partesComRecibos(['Texto'],['origem-nova'],'pt'),/sem passagem/);
let edicoes=0;
for(const [chave,entrada] of Object.entries(manifestoDosRegistos().registos)){
 const [slug,lang]=chave.split('/');
 const ps=pecasDoCorpo({registo:registoDaEdicao(slug,lang),chave,linhaDoSitio:linhaDoSitioDoEstudo(entrada.rh_study,entrada.rh_origens??{}),rotuloDaPorta:lang==='pt'?'Fonte':'Source'});
 const erros=medirPagina(html(ps)).erros;
 assert.equal(erros.length,0,chave+': '+JSON.stringify(erros.slice(0,2)));edicoes++;
}
console.log(`SEL1: ${edicoes} edições sem medidas partidas; texto, fontes e posições conferidos.`);
