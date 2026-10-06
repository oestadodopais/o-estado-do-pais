/** EX2: pacote temporário para a leitura a frio, com estragos apenas nas cópias e manifesto separado. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {conferirAuditoriaDasFamilias} from '../../../../tests/cartao/familias.mjs';
const pasta=path.dirname(new URL(import.meta.url).pathname);
const destino=process.argv[2];
if(!destino||fs.existsSync(destino))throw Error('indicar uma pasta temporária nova para o pacote');
const entrega=JSON.parse(fs.readFileSync(path.join(pasta,'entrega.json'),'utf8'));
const cabeca=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const mudanca=entrega.paginas.find(p=>p.rota==='leituraDaSemana'&&p.lang==='pt').mudancas[0];
const recibo=`livro-razao/${mudanca.linha}/index.html`;
const paginas=[...entrega.paginas.map(p=>p.ficheiro.replace(/^dist\//,'')),recibo];
execFileSync('sh',['scripts/leituras/pacote.sh',process.cwd(),entrega.base,cabeca,destino,'design/observatorio/BRIEF-EX2-a-leitura-da-semana-com-o-que-cada-numero-e.md',path.join(pasta,'LEIA-ME.md'),...paginas],{env:process.env,stdio:'pipe'});
fs.cpSync(pasta,path.join(destino,'design/especime-v3/medicoes/ex2-2026-10-06'),{recursive:true});
fs.cpSync('design/especime-v3/capturas/ex2-2026-10-06',path.join(destino,'design/especime-v3/capturas/ex2-2026-10-06'),{recursive:true});
for(const dir of ['_astro','tipos'])if(fs.existsSync(path.join('dist',dir)))fs.cpSync(path.join('dist',dir),path.join(destino,'built',dir),{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const plantas=[];
function planta(f,nome,altera){
 const p=path.join(destino,'built',f),antes=fs.readFileSync(p,'utf8'),r=parse(antes);altera(r);const depois=r.toString();if(antes===depois)throw Error('a planta não mudou a cópia');fs.writeFileSync(p,depois);plantas.push({nome,ficheiro:`built/${f}`,sha256_antes:sha(antes),sha256_depois:sha(depois)});
}
planta('explicacoes/leitura-da-semana/index.html','palavra estranha acrescentada à definição',r=>{const p=r.querySelector('main [data-o-que-e]');p.set_content('Ontem, '+p.innerHTML);});
planta('en/explainers/weekly-reading/index.html','unidade deslocada para depois do valor',r=>{const e=r.querySelector('[data-semana-mudanca]'),u=e.querySelector('[data-linha-campo="unit"]'),v=e.querySelector('[data-correcao-campo="new_value"]');u.remove();v.insertAdjacentHTML('afterend',u.outerHTML);});
planta('indice/index.html','definição de uma mudança retirada',r=>r.querySelector('main [data-o-que-e]').remove());
const porConfirmar=[...conferirAuditoriaDasFamilias().porConfirmar][0];
const marcada=parse(fs.readFileSync(path.join('dist','en/ledger',porConfirmar,'index.html'),'utf8')).querySelector('[data-o-que-e-parte="o-que-e"]');
marcada.querySelectorAll('[data-por-confirmar-na-fonte]').forEach(e=>e.remove());
planta('en/index/index.html','definição por confirmar de outra linha publicada como confirmada',r=>r.querySelector('main [data-o-que-e]').set_content(marcada.innerHTML));
planta(recibo,'definição do recibo retirada',r=>r.querySelector('[data-o-que-e-parte="o-que-e"]').remove());
const construidos=paginas.map(f=>({ficheiro:`built/${f}`,sha256_original:sha(fs.readFileSync(path.join('dist',f))),sha256_copia:sha(fs.readFileSync(path.join(destino,'built',f)))}));
const manifesto={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/preparar-pacote.mjs <pasta-temporaria-nova>',cabeca_pacote:cabeca,cabeca_codigo:entrega.cabeca_codigo,paginas:construidos,plantas,leitura:'pendente',destino:'pasta temporária fora do repositório'};
fs.writeFileSync(path.join(pasta,'pacote.json'),JSON.stringify(manifesto,null,2)+'\n');
console.log(JSON.stringify({paginas:construidos.length,plantas:plantas.length,cabeca_pacote:cabeca}));
