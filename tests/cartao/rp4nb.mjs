/** RP4N-1 e RP4N-5: plantas por tipo, com mensagem e contagem afirmadas. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {fileURLToPath} from 'node:url';
import {inventariarMarcadores, resumirMarcadores, TIPOS_ACEITES, TIPOS_RECUSADOS} from '../../scripts/sem-marcadores.mjs';

export function plantasDosMarcadores() {
 const plantas=[];
 const marca='<a class="marcador">[a verificar]</a>';
 const claims=new Map([['planta',{published_at:'[a verificar]',access_date:'[a verificar]',reference_date:'[a verificar]',excerpt:'[a verificar]',source:'[a verificar]',source_url:'[a verificar]',document:{title:'[a verificar]',edition:'[a verificar]',computed_over:{files:[{snapshot_date:'[a verificar]'}]}}}]]);
 const campo=c=>`<span data-linha-claim="planta" data-linha-campo="${c}">${marca}</span>`;
 function prova(nome,html,tipo,aceite=false,rota={key:'linha'}, municipios=[]) {
  const r=inventariarMarcadores(parse(`<html><body><main>${html}</main></body></html>`),{rota,claims,municipios});
  const estado=aceite?'aceites':'recusadas', outro=aceite?'recusadas':'aceites';
  assert.equal(r[estado].length,1,`${nome}: a marca não foi contada uma só vez`);
  assert.equal(r[outro].length,0,`${nome}: a marca foi classificada no lado errado`);
  const mensagem=aceite?`RP4N: marca aceite provisoriamente (${tipo})`:tipo==='fora-dos-tipos'?'RP4N: uma página de leitor contém uma marca de informação por confirmar':`RP4N: marca recusada em ${tipo}`;
  assert.equal(r[estado][0].tipo,tipo,nome);assert.equal(r[estado][0].mensagem,mensagem,nome);
  const resumo=resumirMarcadores([{pagina:'planta/index.html',...r}]);
  assert.deepEqual(resumo[estado][tipo],{ocorrencias:1,paginas:[{pagina:'planta/index.html',ocorrencias:1}]},nome);
  plantas.push({nome,tipo,estado,mensagem,contagem:r[estado].length});
 }
 for(const [tipo,html,rota]of[
  ['o-que-e-linha',`<div data-o-que-e="planta">${marca}</div>`],
  ['o-que-e-familia',`<div data-o-que-e="planta" data-o-que-e-tipo="familia" data-o-que-e-familia="familia">${marca}</div>`],
  ['o-que-e-serie',`<div data-o-que-e-da-serie="planta">${marca}</div>`],
  ['nome-medida',`<span data-nome="figuras">${marca}</span>`],
  ['nome-serie',`<span data-nome="serie">${marca}</span>`],
  ['nome-lugar',`<span data-lugar-da-linha="planta">${marca}</span>`],
  ['titulo-estudo',`<h2 data-nonledger="titulo-de-estudo">${marca}</h2>`],
  ['leitura-cartao',`<p data-cartao-leitura="planta">${marca}</p>`],
  ['primeira-pagina',`<p>${marca}</p>`,{key:'home'}],
  ['explicacao',`<p>${marca}</p>`,{key:'explicacao'}],
  ['fora-dos-tipos',`<p>${marca}</p>`],
 ])for(const lingua of ['pt','en'])prova(`${tipo} (${lingua})`,html.replaceAll('[a verificar]',lingua==='pt'?'[a verificar]':'[to verify]'),tipo,false,rota);
 for(const c of ['published_at','access_date','reference_date','document.computed_over.files.0.snapshot_date'])prova(`data ${c}`,campo(c),'data',true);
 prova('data pelo componente de datas',`<span data-de-linha="planta" data-de-campo="access_date">${marca}</span>`,'data',true);
 prova('excerto ausente',campo('excerpt'),'excerto',true);
 prova('marca partida entre elementos de um excerto',`<span data-linha-claim="planta" data-linha-campo="excerpt"><a class="marcador">[a </a><b>verificar]</b></span>`,'excerto',true);
 prova('declaração proibida numa parte da marca',`<span data-linha-claim="planta" data-linha-campo="excerpt"><a data-por-confirmar-na-fonte="planta">[a </a><b>verificar]</b></span>`,'o-que-e-linha');
 prova('endereço ausente',campo('source_url'),'endereco',true);
 prova('data ausente na agenda',`<span data-agenda-sem-data="nao_publica"><a data-agenda="evento:planta.marcador">[a verificar]</a></span>`,'data',true,{key:'agenda'});
 prova('proteção da pessoa na I77',`<div id="mandato-2009-2013"><span class="mun-mandato-quem">${marca}</span></div>`,'pessoa-I77',true,{key:'municipio',params:{slug:'planta'}},[{slug:'planta',tempo:{mandatos:[{periodo:'2009–2013',quemPorVerificar:true}]}}]);
 for(const key of ['metodo','sobre'])prova(`referência à marca em ${key}`,`<p>${marca}</p>`,`referencia-${key}`,true,{key});
 for(const [nome,html]of[
  ['texto partido','<p>[a <b>verificar</b>]</p>'],['entidades','<p>&#91;a verificar&#93;</p>'],
  ['classe vazia','<span class="marcador"></span>'],['declaração sem texto','<span data-por-confirmar-na-fonte="planta"></span>'],
 ])prova(nome,html,nome==='declaração sem texto'?'o-que-e-linha':'fora-dos-tipos');
 for(const [tipo,envolve,rota]of[
  ['o-que-e-linha',h=>`<div data-o-que-e="planta">${h}</div>`],
  ['leitura-cartao',h=>`<p data-cartao-leitura="planta">${h}</p>`],
  ['titulo-estudo',h=>`<h2 data-nonledger="titulo-de-estudo">${h}</h2>`],
  ['primeira-pagina',h=>h,{key:'home'}],['explicacao',h=>h,{key:'explicacao'}],
 ])prova(`campo permitido dentro de ${tipo}`,envolve(campo('excerpt')),tipo,false,rota);
 prova('campo sem linha no livro',campo('excerpt').replace('planta','inexistente'),'fora-dos-tipos');
 prova('campo não permitido',campo('name'),'nome-medida');
 prova('afirmação acrescentada ao campo de excerto',campo('excerpt').replace('</span>',' Uma afirmação.</span>'),'fora-dos-tipos');
 prova('pessoa fora do mandato protegido',`<span class="mun-mandato-quem">${marca}</span>`,'fora-dos-tipos',false,{key:'municipio',params:{slug:'planta'}});
 for(const key of ['metodo','sobre'])prova(`afirmação em ${key}`,`<p class="metodo-p">Uma afirmação ${marca}</p>`,'fora-dos-tipos',false,{key});
 const selo=`<a class="src-chip is-unverified" data-nonledger="proveniencia" href="/livro-razao/planta"><span>fonte</span><span class="marcador">[a verificar]</span></a>`;
 const novos=[
  ['selo de proveniência incompleta',selo,'selo-proveniencia',{key:'linha'}],
  ['publicador ausente',campo('source'),'publicador',{key:'linha'}],
  ['título de documento ausente',campo('document.title'),'titulo-documento',{key:'linha'}],
  ['edição de documento ausente',campo('document.edition'),'edicao-documento',{key:'linha'}],
  ['referência do livro',`<p class="aparelho-nota">${marca}</p>`,'referencia-no-livro',{key:'livro'}],
  ['página da própria marca',`<p>${marca}</p>`,'pagina-da-marca',{key:'marcador'}],
 ];
 for(const [nome,html,tipo,rota]of novos){
  prova(nome,html,tipo,true,rota);
  prova(`${nome} dentro de uma afirmação`,`<div data-o-que-e="planta">${html}</div>`,'o-que-e-linha',false,rota);
 }
 prova('selo sem recibo no livro',selo.replace('/planta','/inexistente'),'fora-dos-tipos');
 const incompleta=claims.get('planta');claims.set('planta',{});
 prova('selo de proveniência completa',selo,'fora-dos-tipos',false,{key:'linha'},[]);
 claims.set('planta',incompleta);
 prova('nota de alcance no recibo',`<p class="linha-alcance">${marca}</p>`,'fora-dos-tipos',false,{key:'linha',params:{slug:'planta'}});
 prova('nota de alcance fora do recibo',`<p class="linha-alcance">${marca}</p>`,'fora-dos-tipos',false,{key:'area'});
 prova('referência do livro com afirmação',`<p class="aparelho-nota">Uma afirmação ${marca}</p>`,'fora-dos-tipos',false,{key:'livro'});
 prova('referência do livro com glosa',`<p class="aparelho-nota">${marca}<span> (to verify)</span></p>`,'referencia-no-livro',true,{key:'livro'});
 prova('página inglesa da própria marca','<title>[to verify]</title>','pagina-da-marca',true,{key:'marcador',lang:'en'});
 for (const lingua of ['pt','en']) {
  const atributo = `<span class="marca-agua" data-marca="${lingua==='pt'?'[a verificar]':'[to verify]'}"></span>`;
  const rota = {key:'linha',params:{slug:'planta'}};
  prova(`atributo no excerto ausente (${lingua})`, `<section id="prova">${atributo}</section>`, 'excerto', true, rota);
  prova(`atributo no endereço ausente (${lingua})`, `<section aria-labelledby="pedido">${atributo}</section>`, 'endereco', true, rota);
  prova(`atributo numa afirmação (${lingua})`, `<div data-o-que-e="planta"><section id="prova">${atributo}</section></div>`, 'o-que-e-linha', false, rota);
  prova(`atributo fora de campo (${lingua})`, atributo, 'fora-dos-tipos', false, rota);
 }
 const duas=inventariarMarcadores(parse('<p data-marca="[a verificar]">[a verificar]</p>'));
 assert.equal(duas.recusadas.length,2,'texto e atributo são duas ocorrências');
 for(const tipo of [...TIPOS_ACEITES,...TIPOS_RECUSADOS])assert(plantas.some(p=>p.tipo===tipo),`falta planta para ${tipo}`);
 return plantas;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const plantas=plantasDosMarcadores();
 for(const p of plantas)console.log(`PLANTA ${p.nome}: ${p.mensagem}; contagem=${p.contagem}`);
 const fase=process.argv.includes('--registo-c')?'c':process.argv.includes('--registo')?'b':null;
 if(fase)fs.writeFileSync(`design/especime-v3/medicoes/rp4n-2026-10-06/plantas-${fase}.json`,JSON.stringify({comando:`node tests/cartao/rp4nb.mjs --registo${fase==='c'?'-c':''}`,plantas},null,2)+'\n');
 console.log(`RP4N-b: PASS, ${plantas.length} plantas`);
}
