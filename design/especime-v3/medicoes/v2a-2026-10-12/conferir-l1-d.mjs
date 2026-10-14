/** V2-a-d: destinos contra a fotografia anterior e vista com alterações fechadas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {continuacaoDoNomeV2a,contaV2a} from '../../../../src/lib/v2a-palavras.mjs';
const pasta='design/especime-v3/medicoes/v2a-2026-10-12';
const nome=process.argv.includes('--final')?'l1-destinos-d.json':'l1-destinos-d-preparacao.json';
const antes=JSON.parse(fs.readFileSync(`${pasta}/l1-destinos-c.json`)),agora=JSON.parse(fs.readFileSync(`${pasta}/${nome}`));
function destinos(x){assert.deepEqual(x.repetidos_por_pagina,antes.repetidos_por_pagina,'V2AD L1: destinos ou multiplicidades diferentes da passagem anterior');}
destinos(agora);
const copia=structuredClone(agora),u=Object.keys(copia.repetidos_por_pagina)[0];copia.repetidos_por_pagina[u][Object.keys(copia.repetidos_por_pagina[u])[0]]++;
assert.throws(()=>destinos(copia),/V2AD L1:/);
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const base='972c1f07';
const vista=git('show',`${base}:src/views/LinhaView.astro`);
const esperada=vista.replace("import DataDaLinha from '../components/DataDaLinha.astro';","import DataDaLinha from '../components/DataDaLinha.astro';\nimport {continuacaoDoNomeV2a, contaV2a, resolverPeriodosV2a} from '../lib/v2a-palavras.mjs';")
.replace('</span>{lugarRecibo && (','</span><Frase partes={resolverPeriodosV2a(continuacaoDoNomeV2a(id,lang))} lang={lang} />{lugarRecibo && (')
.replace('    {fontesDaDefinicao.length > 0','    {contaV2a(id,lang).length > 0 && <div class="linha-o-que-e" data-v2a-conta><p class="linha-o-que-e-frase"><Frase partes={resolverPeriodosV2a(contaV2a(id,lang))} lang={lang} selos={false} /></p></div>}\n    {fontesDaDefinicao.length > 0');
const conferirVista=s=>assert.equal(s.trim(),esperada,'V2AD vista: alteração fora dos períodos e das contas declaradas');
conferirVista(fs.readFileSync('src/views/LinhaView.astro','utf8'));
assert.throws(()=>conferirVista(esperada.replace('s.prov.serie','s.prov.documento')),/V2AD vista:/);
const antigas=git('ls-tree','-r','98487940','ledger/claims').split('\n');
const atuais=new Set(git('ls-tree','-r','HEAD','ledger/claims').split('\n'));
for(const row of antigas){assert(atuais.has(row));const id=row.split('\t')[1].split('/').at(-1).replace('.yml','');for(const lang of ['pt','en']){assert.deepEqual(continuacaoDoNomeV2a(id,lang),[]);assert.deepEqual(contaV2a(id,lang),[]);}}
const plantas=['V2AD L1: destinos ou multiplicidades diferentes da passagem anterior','V2AD vista: alteração fora dos períodos e das contas declaradas'];
for(const mensagem of plantas)console.log('PLANTA '+mensagem);
const resultado={cabeca:git('rev-parse','HEAD'),construcao:JSON.parse(fs.readFileSync('dist/version.json')).commit,paginas:agora.paginas,linhas_anteriores:antigas.length,plantas,destinos_iguais:true,vista_conferida:true};
if(process.argv.includes('--write'))fs.writeFileSync(`${pasta}/l1-v2a-d${process.argv.includes('--final')?'':'-preparacao'}.json`,JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify(resultado));
