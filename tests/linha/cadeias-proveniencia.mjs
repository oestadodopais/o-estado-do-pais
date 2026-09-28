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
 ['recurso posterior à entrada',c=>{const e=entrada(c);e.date='2026-08-16';}],
 ['ficheiro sem a data do recurso',c=>{const e=entrada(c);e.old_value=e.old_value.slice(0,e.old_value.lastIndexOf('/')+1)+'listagem.xlsx';e.reason=e.reason_en=e.old_value;}],
 ['razão portuguesa sem endereço',c=>{entrada(c).reason='O mesmo conjunto.';}],
 ['razão inglesa sem endereço',c=>{entrada(c).reason_en='The same dataset.';}],
];
for(const [nome,mudar] of casos){const c=structuredClone(prr);mudar(c);planta(nome,c,'source_url','cadeia contraditória');}
const livro=validateLedger();
const r={controlos,plantas,contagens:{controlos:controlos.length,plantas:plantas.length},erros_do_livro:livro.errors,avisos_do_livro:livro.warnings};
const j=process.argv.indexOf('--json');if(j>=0)fs.writeFileSync(process.argv[j+1],JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify(r,null,2));
process.exitCode=livro.errors.length?1:0;
