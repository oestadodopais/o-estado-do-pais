import assert from 'node:assert/strict';
import { WORKS, PUBLISHED_WORKS, PUBLISHED_EDITIONS, edicaoPublicada } from '../../src/data/studies.mjs';
import { conferirPaginasDosEstudos, redirecionamentosDosRetirados, conferirRedirecionamentos, destinoDoRetirado, conferirLigacoesRetiradas } from '../../scripts/estudos-retirados-conferir.mjs';
const retirados = WORKS.filter(w => w.estado === 'retirado');
assert.equal(retirados.length, 14);
assert.equal(retirados.filter(w => !w.sucedidoPor?.length).length, 8);
assert(PUBLISHED_WORKS.every(w => w.estado !== 'retirado'));
assert(PUBLISHED_EDITIONS.every(e => !retirados.some(w => w.id === e.workId)));
assert.equal(edicaoPublicada({estado:'retirado'}, {date:'2026-08-20'}), false);
const works = [{slug:'vivo'}, {slug:'antigo', estado:'retirado'}];
const rotas = ['/estudos/vivo', '/en/studies/vivo'];
assert.deepEqual(conferirPaginasDosEstudos(works, rotas), []);
for (const rota of ['/estudos/antigo', '/en/studies/antigo/document/2026-08-20', '/estudos/antigo/texto']) {
  assert(conferirPaginasDosEstudos(works, [...rotas, rota]).some(e => e.includes('retirado construído')));
}
assert(conferirPaginasDosEstudos(works, rotas.slice(1)).some(e => e.includes('sem página')));
console.log('REC2 estado: controlos verdes; página, documento datado e registo retirados recusados; publicado sem página recusado.');
const arquivo = [{slug:'vivo'}, {slug:'antigo', estado:'retirado', sucedidoPor:[{slug:'vivo'}]}];
const partida = {estudos:[{slug:'antigo', rotas:['/estudos/antigo/','/en/studies/antigo/document/'], redirecionamentos_anteriores:['/estudos/antigo/texto/']}]};
const tabela = [...redirecionamentosDosRetirados(arquivo,partida), {handle:'filesystem'}];
const conferir = (t=tabela, r=rotas) => conferirRedirecionamentos(arquivo,partida,t,r);
assert.deepEqual(conferir(),[]);
assert(conferir(tabela.slice(1)).some(e => e.includes('redirecionamento')));
assert(conferir(tabela,rotas.slice(1)).some(e => e.includes('destino inexistente')));
const manual = structuredClone(tabela);manual[0].headers.Location='/en/studies/vivo/';
assert(conferir(manual).some(e => e.includes('redirecionamento')));
assert(conferir(tabela,[...rotas,'/estudos/antigo']).some(e => e.includes('origem construída')));
const multiplo = {slug:'antigo',subject:'evora',estado:'retirado',sucedidoPor:[{slug:'vivo'},{slug:'outro'}]};
assert.equal(destinoDoRetirado(multiplo,'en',[{slug:'vivo'},{slug:'outro'}]),'/en/municipalities/evora/');
console.log('REC2 redirecionamentos: ausência, destino inexistente, destino manual divergente e origem construída recusados; vários sucessores levam ao município.');
assert.deepEqual(conferirLigacoesRetiradas(works,'/', '<a href="/estudos/vivo/">Vivo</a>'), []);
for (const rota of ['/', '/municipios/evora/', '/estudos/', '/novidades/', '/agenda/', '/leituras/']) {
  assert(conferirLigacoesRetiradas(works, rota, '<a href="/estudos/antigo/documento/#fonte">Antigo</a>').length);
}
assert(conferirLigacoesRetiradas(works, '/sitemap.xml', '<url><loc>https://oestadodopais.pt/estudos/antigo/</loc></url>').length);
assert(conferirLigacoesRetiradas(works, '/estudos/vivo/', '<a href="../antigo/">Antigo</a>').length);
assert(conferirLigacoesRetiradas(works, '/', '<p class="estudo-antecessores">Sucede a</p>').length);
console.log('REC2 ligações: páginas, mapa, ligação relativa e nota de sucessão recusados.');

const semSucessor = {slug:'sem-sucessor', estado:'retirado'};
for (const lang of ['pt','en']) {
  const indice = lang === 'pt' ? '/estudos/' : '/en/studies/';
  assert.equal(destinoDoRetirado(semSucessor,lang,[]),indice);
  assert.equal(destinoDoRetirado({...semSucessor,subject:'objeto-sem-pagina'},lang,[]),indice);
  assert.equal(destinoDoRetirado({...semSucessor,subject:'evora'},lang,[]),lang === 'pt' ? '/municipios/evora/' : '/en/municipalities/evora/');
  assert.equal(destinoDoRetirado({...semSucessor,subject:'alentejo'},lang,[]),lang === 'pt' ? '/regioes/alentejo/' : '/en/regions/alentejo/');
  const semVivos = {...semSucessor,sucedidoPor:[{slug:'retirado'}]};
  const mistos = [{slug:'retirado',estado:'retirado'},{slug:'vivo'}];
  assert.equal(destinoDoRetirado(semVivos,lang,mistos),indice);
  assert.equal(destinoDoRetirado({...semVivos,sucedidoPor:[...semVivos.sucedidoPor,{slug:'vivo'}]},lang,mistos),lang === 'pt' ? '/estudos/vivo/' : '/en/studies/vivo/');
  const p = {estudos:[{slug:semVivos.slug,rotas:[`/estudos/${semVivos.slug}`],redirecionamentos_anteriores:[]}]};
  const arquivo = [semVivos,...mistos], tabela = [...redirecionamentosDosRetirados(arquivo,p),{handle:'filesystem'}];
  assert(conferirRedirecionamentos(arquivo,p,tabela,[]).some(e=>e.includes('destino inexistente')));
  tabela[0].headers.Location='/estudos/retirado/';
  assert(conferirRedirecionamentos(arquivo,p,tabela,['/estudos/retirado']).some(e=>e.includes('redirecionamento')));
  tabela[0].headers.Location='/municipios/evora/';
  assert(conferirRedirecionamentos(arquivo,p,tabela,['/municipios/evora']).some(e=>e.includes('redirecionamento')));
}
assert.throws(()=>destinoDoRetirado({...semSucessor,sucedidoPor:[{slug:'desconhecido'}]},'pt',[]),/desconhecido/);
console.log('RET1 destinos: sem sucessor, objeto sem página, sucessores retirados e mistos; destinos inexistentes, retirados ou sem objeto trocados recusados.');
