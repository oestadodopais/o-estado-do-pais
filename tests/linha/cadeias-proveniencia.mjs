/** C1e: cada campo tem uma cadeia; cada condição dos instantâneos tem uma planta. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadClaims, validateLedger } from '../../src/lib/ledger.mjs';
import { CAMPOS_DE_PROVENIENCIA } from '../../src/data/correcoes.mjs';
import { historiaDaProveniencia } from '../../src/lib/historia-da-proveniencia.mjs';
const controlos = [], plantas = [];
const conferir = (linha, campo) => { const erros = []; historiaDaProveniencia(linha, campo, '[ensaio]', erros); return erros; };
function planta(nome, linha, campo, esperado) {
  const erros = conferir(linha, campo);
  assert.ok(erros.some(e => e.includes(esperado)), nome);
  plantas.push({nome, mordeu:true, falha:erros.find(e => e.includes(esperado))});
}
for (const campo of CAMPOS_DE_PROVENIENCIA) {
  const valores = campo === 'access_date' ? ['2026-08-01','2026-08-02','2026-08-03'] : campo === 'source_url' ? ['https://fonte.invalid/a','https://fonte.invalid/b','https://fonte.invalid/c'] : ['Antes','Depois','Atual'];
  const c = {access_date:'2026-08-01',document:{},corrections:valores.slice(1).map((v,i)=>({kind:'proveniencia',field:campo,date:`2026-08-0${i+2}`,old_value:valores[i],new_value:v}))};
  if(campo.startsWith('document.')) c.document[campo.split('.')[1]]=valores[2]; else c[campo]=valores[2];
  assert.deepEqual(conferir(c,campo),[]);controlos.push({nome:`cadeia de ${campo}`,passou:true});
  const final=structuredClone(c);final.corrections[1].new_value=valores[1];planta(`${campo}: último valor diferente da linha`,final,campo,'último "new_value"');
  const quebrada=structuredClone(c);quebrada.corrections[1].old_value=valores[0];planta(`${campo}: continuidade quebrada`,quebrada,campo,'cadeia contraditória');
  const antiga=structuredClone(c);antiga.corrections[0].date='2026-07-31';planta(`${campo}: antes do primeiro acesso`,antiga,campo,campo==='access_date'?'posterior à mudança':'anterior ao acesso em vigor');
}
// O molde é real; apenas o acesso do ensaio é anterior, para isolar a exceção.
const prr=structuredClone(loadClaims().get('evora-prr-aprovado-2026'));prr.access_date='2026-08-01';
assert.deepEqual(conferir(prr,'source_url'),[]);controlos.push({nome:'instantâneo com as cinco condições',passou:true});
const entrada=c=>c.corrections.find(e=>e.field==='source_url'&&e.old_value.includes('/20260817-'));
const casos=[
 ['documento sem classe ficheiro',c=>{c.document.kind='pagina';}],
 ['documento sem lista de ficheiros',c=>{c.document.computed_over.files=[];}],
 ['endereço novo diferente do vigente',c=>{const e=entrada(c);e.new_value='https://dados.gov.pt/datasets/outro';e.old_value=e.old_value.replace(/\/s\/resources\/[^/]+\//,'/s/resources/outro/');e.reason=e.reason_en=e.old_value;}],
 ['recurso de outro conjunto',c=>{const e=entrada(c);e.old_value=e.old_value.replace('/s/resources/dataset-','/s/resources/outro-');e.reason=e.reason_en=e.old_value;}],
 ['recurso posterior à entrada',c=>{const e=entrada(c);e.old_value=e.old_value.replaceAll('20260817','20260819');e.reason=e.reason_en=e.old_value;}],
 ['ficheiro sem a data do recurso',c=>{const e=entrada(c);e.old_value=e.old_value.slice(0,e.old_value.lastIndexOf('/')+1)+'listagem.xlsx';e.reason=e.reason_en=e.old_value;}],
 ['razão portuguesa sem endereço',c=>{entrada(c).reason='O mesmo conjunto.';}],
 ['razão inglesa sem endereço',c=>{entrada(c).reason_en='The same dataset.';}],
];
for(const [nome,mudar] of casos){const c=structuredClone(prr);mudar(c);planta(nome,c,'source_url','cadeia contraditória');}

// OE1-b: os dois formatos da bandeira passam pelo validador chamado pelo portão.
// Altera apenas cópias na memória. Cada recusa tem de ser a da bandeira desta linha.
const bandeiras = [];
const linhas = loadClaims();
const novo = 'despesa-por-funcao-2024-gf01-pt';
const antigo = 'credito-malparado-2024';
assert.deepEqual(validateLedger().errors, []);
function plantaBandeira(nome, id, mudar) {
  const original = linhas.get(id);
  const c = structuredClone(original);
  mudar(c); linhas.set(id, c);
  try {
    const erros = validateLedger().errors;
    const falha = erros.find(e => e.startsWith(`[${id}.yml] declara a bandeira`));
    assert.ok(falha, nome + ': o portão não recusou a associação errada da bandeira');
    bandeiras.push({nome, mordeu: true, falha});
  } finally { linhas.set(id, original); }
}
function jsonDaLinha(c, mudar) { const j=JSON.parse(c.excerpt); mudar(j); c.excerpt=JSON.stringify(j); }
for(const [nome, mudar] of [
  ['JSON-stat: bandeira junto de outro valor', c=>jsonDaLinha(c,j=>{j.value['0']=999;})],
  ['JSON-stat: bandeira no índice de outra célula', c=>jsonDaLinha(c,j=>{j.status={'1':'p'};})],
  ['JSON-stat: outro país no corpo', c=>jsonDaLinha(c,j=>{j.dimension.geo.category.index={ES:0};})],
  ['JSON-stat: outro país no pedido', c=>{c.source_url=c.source_url.replace('geo=PT','geo=ES');}],
  ['JSON-stat: outro período', c=>{c.reference_date='2025';}],
  ['JSON-stat: valor ausente', c=>jsonDaLinha(c,j=>{j.value={};})],
  ['JSON-stat: duas células', c=>jsonDaLinha(c,j=>{j.value['1']=999;})],
  ['JSON-stat: bandeira retirada', c=>jsonDaLinha(c,j=>{delete j.status;})],
  ['JSON-stat: significado da bandeira alterado', c=>jsonDaLinha(c,j=>{j.extension.status.label.p='estimated';})],
  ['JSON-stat: diferença além da precisão float64', c=>{c.excerpt=c.excerpt.replace(/("value"\s*:\s*\{\s*"0"\s*:\s*)(-?\d+(?:\.\d+)?)/,(_,p,v)=>p+v+(v.includes('.')?'0000000000000001':'.0000000000000001'));}],
  ['JSON-stat: dimensão repetida', c=>jsonDaLinha(c,j=>{j.id[0]=j.id[1];})],
]) plantaBandeira(nome, novo, mudar);
for(const [nome, mudar] of [
  ['Antigo: bandeira retirada', c=>{c.excerpt=c.excerpt.replace(/ p$/,'');}],
  ['Antigo: bandeira junto de outro valor', c=>{c.excerpt=c.excerpt.replace(/: [\d.]+ p$/,': 999 p');}],
  ['Antigo: outro país no excerto', c=>{c.excerpt=c.excerpt.replace('Portugal','Spain');}],
  ['Antigo: outro país no pedido', c=>{c.source_url=c.source_url.replace('geo=PT','geo=ES');}],
  ['Antigo: bandeira fora do fim', c=>{c.excerpt=c.excerpt.replace(/ p$/,'')+' p texto';}],
]) plantaBandeira(nome, antigo, mudar);
assert.deepEqual(validateLedger().errors, []);
controlos.push({nome:'Bandeiras: JSON-stat e formatos anteriores, antes e depois das plantas',passou:true});
const livro=validateLedger();
const r={controlos,plantas,bandeiras,contagens:{controlos:controlos.length,plantas:plantas.length,bandeiras:bandeiras.length},erros_do_livro:livro.errors,avisos_do_livro:livro.warnings};
const j=process.argv.indexOf('--json');if(j>=0)fs.writeFileSync(process.argv[j+1],JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify(r,null,2));
process.exitCode=livro.errors.length?1:0;
