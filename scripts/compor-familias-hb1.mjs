/** Acrescenta só as famílias HB1, preservando as declarações das outras corridas. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ORIGENS_DAS_DEFINICOES} from '../src/data/figuras.mjs';
import {loadClaims} from '../src/lib/ledger.mjs';
import {FAMILIAS_DAS_LINHAS} from '../src/data/o-que-e-das-familias.mjs';
import {FAMILIAS_HB1} from '../design/especime-v3/medicoes/hb1-2026-10-21/familias.mjs';
const claims=loadClaims({includeWithdrawn:true});
const file='src/data/o-que-e-das-familias.mjs';
const anterior=fs.readFileSync(file,'utf8');
const marcador='\n// HB1: declarações acrescentadas pelo compositor próprio.';
const inicio=anterior.indexOf(marcador), fim=anterior.indexOf('\n});',inicio)+5;
assert(inicio>=0 && fim>inicio, 'bloco HB1 ausente ou sem fecho');
const original=anterior.slice(0,inicio), posterior=anterior.slice(fim);
// HB1-e: a declaração inclui famílias importadas (OG1), por isso é JavaScript, não JSON.
// O prefixo mantém-se byte a byte; só as chaves HB1 são compostas abaixo.
const declared={...FAMILIAS_DAS_LINHAS};
const audFile='tests/cartao/leituras-provadas.json',aud=JSON.parse(fs.readFileSync(audFile,'utf8'));
const keys=new Set(FAMILIAS_HB1.flatMap(e=>e.chaves));
const family=id=>keys.has(id)?id:id.replace(/-\d{4}(-\d{2})?(?=(-ue)?$)/,'');
for(const e of FAMILIAS_HB1) {
  const rows=[...claims.values()].filter(c=>e.chaves.includes(family(c.id)));
  assert(rows.length,`família sem linhas: ${e.chaves}`);
  for(const part of e.partes) {
    assert(!/\d/.test(part.pt+part.en),'frase com algarismos');
    for(const a of part.apoios) for(const c of rows) {
      if(a.origem) { assert(ORIGENS_DAS_DEFINICOES[a.origem]?.[a.campo]?.includes(a.literal),'origem sem literal'); continue; }
      const value=a.campo.split('.').reduce((o,k)=>o?.[k],c);
      assert(a.literal.trim().length>=4 && typeof value==='string' && value.includes(a.literal),`${c.id}: apoio ausente ${a.campo} ${a.literal}`);
    }
  }
  const frase={pt:[e.partes.map(p=>p.pt).join('')],en:[e.partes.map(p=>p.en).join('')]};
  for(const k of e.chaves) declared[k]={nome:e.nome,frase,...(e.complemento?{complemento:e.complemento}:{}),...(e.origens.length?{origens:e.origens}:{})};
}
const newMap=JSON.stringify(Object.fromEntries([...keys].sort().map(k=>[k,declared[k]])),null,2);
fs.writeFileSync(file,original+'\n// HB1: declarações acrescentadas pelo compositor próprio.\nObject.assign(FAMILIAS_DAS_LINHAS, '+newMap+');\n'+posterior);
const novasAuditorias=[];
for(const e of FAMILIAS_HB1) novasAuditorias.push({chaves:e.chaves,nome:e.nome,origens:e.origens,...(e.complemento?{complemento:e.complemento}:{}),folhas:[{pt:e.partes.map(p=>p.pt).join(''),en:e.partes.map(p=>p.en).join(''),partes:e.partes}]});
// Uma auditoria HB1 antiga sai por inteiro, mesmo que o conjunto de chaves tenha mudado.
function renovarAuditorias(anteriores, novas) {
  const porEscrever=new Set(novas), resultado=[];
  for(const antiga of anteriores) {
    if(!antiga.chaves?.some(k=>keys.has(k))) { resultado.push(antiga); continue; }
    for(const nova of porEscrever) if(nova.chaves.some(k=>antiga.chaves.includes(k))) {
      resultado.push(nova); porEscrever.delete(nova);
    }
  }
  return [...resultado,...porEscrever];
}
if(process.argv.includes('--prova')) {
  const [primeira, segunda]=novasAuditorias;
  const antiga={chaves:[...primeira.chaves,...segunda.chaves],marca:'antiga'};
  const outra={chaves:['familia-alheia-hb1'],marca:'conservar'};
  const resultado=renovarAuditorias([antiga,outra],[primeira,segunda]);
  assert.deepEqual(resultado,[primeira,segunda,outra]);
  assert(!resultado.some(e=>e.marca==='antiga'),'auditoria com as chaves antigas sobreviveu');
  console.log('Planta: família com chaves alteradas, entrada antiga removida e família alheia conservada.');
}
aud.familias=renovarAuditorias(aud.familias,novasAuditorias);
if(!aud.leituras.some(l=>l.o_que.startsWith('Construção HB1:'))) aud.leituras.push({quem:'Codex gpt-6-astra',quando:'2026-10-20',o_que:'Construção HB1: frases conferidas nas linhas e documentos selados. A leitura a frio pertence à entrega seguinte.'});
fs.writeFileSync(audFile,JSON.stringify(aud,null,2)+'\n');
assert(fs.readFileSync(file,'utf8').endsWith(posterior), 'blocos posteriores ao HB1 alterados');
console.log(`HB1: ${keys.size} famílias compostas e conferidas; blocos posteriores conservados.`);
