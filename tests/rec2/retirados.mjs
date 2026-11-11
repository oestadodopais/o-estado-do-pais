import assert from 'node:assert/strict';
import { WORKS, PUBLISHED_WORKS, PUBLISHED_EDITIONS, edicaoPublicada } from '../../src/data/studies.mjs';
import { conferirPaginasDosEstudos, redirecionamentosDosRetirados, conferirRedirecionamentos, destinoDoRetirado, conferirLigacoesRetiradas } from '../../scripts/estudos-retirados-conferir.mjs';
const retirados = WORKS.filter(w => w.estado === 'retirado');
assert.equal(retirados.length, 6);
assert(retirados.every(w => w.sucedidoPor?.length));
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
