/** OG1-A6: a data já publicada no sítio, sem acrescentar uma linha à seleção. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {resolverExplicacao} from '../../../../src/lib/explicacoes.mjs';
import {OG1} from '../../../../src/data/discussao-og1.mjs';
assert(process.env.RESEARCHHUB_DIR,'Definir RESEARCHHUB_DIR.');
const read=p=>JSON.parse(fs.readFileSync(path.join(process.env.RESEARCHHUB_DIR,p),'utf8'));
const rows=loadClaims(),published=rows.get('divida-publica-2024');
const arquivo='indicators/out/series-paises/2026-10-26/002-divida-publica-2025-paises.json';
const raw=fs.readFileSync(path.join(process.env.RESEARCHHUB_DIR,arquivo));
const series=JSON.parse(raw);
const indices=series.id.map(d=>series.dimension[d].category.index);
const coordinates=Object.fromEntries(series.id.map(d=>[d,d==='geo'?'PT':d==='time'?'2025':Object.keys(series.dimension[d].category.index)[0]]));
let index=0;for(let i=0;i<series.id.length;i++)index=index*series.size[i]+indices[i][coordinates[series.id[i]]];
const value=series.value[index];
assert.equal(value,89.2);
assert.equal(series.updated.slice(0,10),published.published_at);
assert.equal(published.published_at,'2026-10-21');
const book=read('content/30 Orcamento 2027 Generalidade/ledger.json');
const eurostat=book.claims.find(r=>r.id==='og1-eurostat-portugal-2025');
assert.equal(eurostat.published_at,published.published_at);
const selection=read('publisher/manifest.og1a.json').rows.map(r=>r.site_id);
assert.equal(selection.length,33);assert(!selection.includes(eurostat.id));
for(const lang of ['pt','en']){
 const resolved=resolverExplicacao(OG1,lang);
 assert(resolved.seccoes[1].blocos[0].pedacos.some(p=>p.data?.id===published.id&&p.data.campo==='published_at'&&p.data.valor===published.published_at));
}
const proof={codigo:0,selecao:selection,linhaDaData:published.id,campo:'published_at',data:published.published_at,
 linhaDaDataSha256:createHash('sha256').update(fs.readFileSync('ledger/claims/'+published.id+'.yml')).digest('hex'),
 respostaEurostat:{ficheiro:arquivo,sha256:createHash('sha256').update(raw).digest('hex'),updated:series.updated,coordenadas:coordinates,valor:value},
 confirmacaoNaPesquisa:{id:eurostat.id,data:eurostat.published_at,document:eurostat.document},
 limite:'A data vem do campo published_at de uma linha de dívida já existente. A resposta alojada da série de dívida e o comunicado do Eurostat confirmam essa data e os 89,2% de Portugal em 2025. O período 2024 dessa linha não é usado como ano dos dados de 2025.',
 diagnosticoInicial:'A seleção de 33 linhas não continha a data. A pesquisa posterior encontrou a data já publicada no sítio; a pergunta sobre retirar a data ou alargar a seleção foi retirada. Nenhuma dessas alterações foi feita.'};
fs.writeFileSync(new URL('./data-a6.json',import.meta.url),JSON.stringify(proof,null,2)+'\n');
console.log('PASS: data de publicação existente, resposta Eurostat e comunicado concordam; seleção mantém 33 linhas.');
