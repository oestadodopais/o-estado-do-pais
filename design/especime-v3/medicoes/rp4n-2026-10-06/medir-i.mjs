import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {loadClaims,provenienciaIncompleta} from '../../../../src/lib/ledger.mjs';
import {ficheirosDeTexto,conferirPublicacaoRetirada} from '../../../../scripts/linhas-retiradas.mjs';
const base='design/especime-v3/medicoes/rp4n-2026-10-06/i';fs.mkdirSync(base,{recursive:true});
const todas=loadClaims({includeWithdrawn:true}),publicadas=loadClaims();
// O primeiro retrato foi medido antes das alterações, pela mesma leitura em linha de comando.
// Esta opção permite repetir o retrato numa construção anterior, sem sobrescrever o registo existente.
if(process.argv.includes('--antes')) {
 const destino=base+'/antes.json';
 if(fs.existsSync(destino))throw Error('O retrato anterior já existe. Não se sobrescreve.');
 const paginas=fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html') && /\[a verificar\]|\[to verify\]/.test(fs.readFileSync('dist/'+f,'utf8'))).map(f=>'/'+f).sort();
 fs.writeFileSync(destino,JSON.stringify({cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),versao:JSON.parse(fs.readFileSync('dist/version.json')),paginas_com_marcas:paginas,linhas_incompletas:[...publicadas.values()].filter(provenienciaIncompleta).map(c=>c.id)},null,2)+'\n');
 process.exit(0);
}

const texto=ficheirosDeTexto('dist');const referencias=conferirPublicacaoRetirada('dist',todas);
const retiradas=[...todas.values()].filter(l=>l.source==='[a verificar]').map(l=>({id:l.id,publication:l.publication}));
const auditoria=JSON.parse(fs.readFileSync('tests/cartao/leituras-provadas.json'));
const anuais=auditoria.familias.filter(e=>JSON.stringify(e).includes('rp4n-ac-ss-orcamento')).flatMap(e=>e.chaves);
const mensais=auditoria.familias.filter(e=>JSON.stringify(e).includes('"rp4n-ac-ss"')).flatMap(e=>e.chaves);
const r={cabeca:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),versao:JSON.parse(fs.readFileSync('dist/version.json')),linhas_livro:todas.size,linhas_publicadas:publicadas.size,linhas_sem_publicador:retiradas,anuais,mensais,ficheiros_texto:texto.length,por_extensao:{},referencias};
for(const f of texto)r.por_extensao[path.extname(f)]=(r.por_extensao[path.extname(f)]??0)+1;
r.linhas_incompletas=[...publicadas.values()].filter(provenienciaIncompleta).map(c=>c.id);
r.paginas_com_marcas=[];
for(const f of texto.filter(f=>f.endsWith('.html'))) {const s=fs.readFileSync(f,'utf8');if(/\[a verificar\]|\[to verify\]/.test(s))r.paginas_com_marcas.push(f.replace(/^dist/,''));}
r.frases={};r.recibos={};r.estudo={};
for(const [nome,id] of Object.entries({agua:'agua-nao-faturada-portugal-2024',pensao:'penalizacao-antecipacao-um-ano-neutra',legal:'penalizacao-legal-um-ano-antecipacao-2026',ministerios:'oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao'}))for(const lang of ['pt','en']) {
 const f=`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`;
 if(!fs.existsSync(f))throw Error(`Falta o recibo de ${id}`);
 const root=parse(fs.readFileSync(f,'utf8')),p=root.querySelector('[data-o-que-e-parte="o-que-e"]');
 const norm=s=>s.replace(/\s+/g,' ').trim();
 r.frases[nome+'-'+lang]=norm(p.textContent);
 r.recibos[nome+'-'+lang]={id,bloco_verificacoes:norm(root.querySelector('#verificacoes')?.closest('section')?.textContent??''),nome_na_fonte:norm(root.querySelector('.linha-nome-da-fonte .campo-valor')?.textContent??''),datas:root.querySelectorAll('[data-def-lido]').map(x=>norm(x.textContent)),datas_ausentes:root.querySelectorAll('[data-def-sem-data]').map(x=>norm(x.textContent)),localizadores:root.querySelectorAll('[data-linha-campo="name_source"],[data-linha-campo="name_source_en"],[data-linha-campo="document.locator"],[data-linha-campo="document.locator_en"]').map(x=>norm(x.textContent)),datas_rotuladas:root.querySelectorAll('.def-excerto-lido').map(x=>norm(x.textContent)),verificacoes:norm(root.querySelector('.linha-verificacoes')?.textContent??'')};
}
for(const lang of ['pt','en']){
 const area=parse(fs.readFileSync(`dist/${lang==='en'?'en/':''}areas/economia-e-coesao-territorial/index.html`,'utf8'));
 const estudo=parse(fs.readFileSync(`dist/${lang==='pt'?'estudos':'en/studies'}/which-door-is-yours/index.html`,'utf8'));
 r.estudo[lang]={portas:area.querySelectorAll('a').filter(a=>a.getAttribute('href')?.includes('/which-door-is-yours')).map(a=>({texto:a.textContent,href:a.getAttribute('href')})),ausencia:estudo.querySelector('[data-ausencia-atual]')?.textContent.trim()};
}
fs.writeFileSync(base+'/medidas.json',JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify(r));
if(referencias.length||retiradas.some(l=>l.publication!=='withdrawn'))process.exitCode=1;
