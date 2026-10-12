/** RP1c: conserva as entregas anteriores e mede a passagem de correção. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { DOMINIOS_RP1 } from '../../../../src/data/medidas-rp1.mjs';
import { textoDaLeitura, leituraDaMedida } from '../../../../src/lib/leitura-da-medida.mjs';
import { auditarPerguntas } from '../../../../tests/cartao/perguntas.mjs';
import { conferirAuditoriaDasLeituras, conferirLeiturasRendidas } from '../../../../tests/cartao/leituras.mjs';
const aqui=path.dirname(fileURLToPath(import.meta.url)), raiz=path.resolve(aqui,'../../../..');
const motor=process.env.RP1_MOTOR??path.join(os.homedir(),'Instruments/ResearchHub/.worktrees/rp1-2026-09-26');
const base='42b3cadf';
const git=(...args)=>execFileSync('git',args,{cwd:raiz,encoding:'utf8'}).trim();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const prova=(ok,m)=>{if(!ok)throw Error(m);};
const ficheiros=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?ficheiros(path.join(p,e.name)):[path.join(p,e.name)]);
// O detetor lê também binários. O caminho pessoal de ensaio só existe fora do repositório.
const prefixoPessoal=path.join(path.parse(os.homedir()).root,'Users')+path.sep;
const utilizador=path.basename(os.homedir()).toLowerCase();
const deteta=p=>{const s=fs.readFileSync(p).toString('utf8').toLowerCase();return s.includes(prefixoPessoal.toLowerCase())||s.includes(utilizador);};
function caminhos(){
 const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'rp1c-caminhos-'));
 let conhecido=false;
 try {const p=path.join(scratch,'ensaio.txt');fs.writeFileSync(p,path.join(os.homedir(),'Instruments/OEstadoDoPais'));conhecido=deteta(p);}
 finally {fs.rmSync(scratch,{recursive:true,force:true});}
 prova(conhecido,'O detetor de caminhos não viu o conhecido-positivo');
 const critica=path.join(raiz,'design/especime-v3/critica');
 const lista=[...ficheiros(aqui),...fs.readdirSync(critica).filter(p=>p.startsWith('LEITURA-rp1-')).map(p=>path.join(critica,p))];
 const achados=lista.filter(deteta).map(p=>path.relative(raiz,p));
 prova(!achados.length,'Caminho pessoal no bloco: '+achados.join(', '));
 return {ficheiros_lidos:lista.length,ficheiros_com_caminho_ou_utilizador:achados.length,conhecido_positivo:{fora_do_repositorio:true,encontrado:conhecido},achados};
}
if(process.argv.includes('--caminhos')){console.log(JSON.stringify(caminhos()));process.exit(0);}
const critica=fs.readFileSync(path.join(raiz,'design/especime-v3/critica/LEITURA-rp1-2026-09-26.md'),'utf8').split('## «What is fine»')[0];
const achados=[...critica.matchAll(/^(\d+)\. /gm)].map(m=>Number(m[1]));
prova(achados.length===23&&achados.every((n,i)=>n===i+1),'A lista dos achados mudou');
const plantasPacote=json(path.join(raiz,'design/especime-v3/critica/LEITURA-rp1-2026-09-26.plantas.json'));
prova(new Set(plantasPacote.plantas.map(p=>p.id)).size===5,'O registo das cinco plantas mudou');
const historico=json(path.join(aqui,'medidas.json'));
// O expurgo muda os bytes dos registos antigos, conservando os códigos e as cabeças.
for(const [peca,pasta] of [[historico,'portoes'],[historico.rp1b,'portoes/rp1b']]){
 for(const nome of ['build','verify','typecheck'])peca.portoes[nome].log_sha256=sha(fs.readFileSync(path.join(aqui,pasta,nome+'.log')));
}
const linhas=loadClaims(), anteriores=git('ls-tree','-r','--name-only',base,'ledger/claims').split('\n').filter(Boolean);
const alteradas=[];
for(const p of anteriores){
 const antes=load(execFileSync('git',['show',base+':'+p],{cwd:raiz,encoding:'utf8'})), agora=load(fs.readFileSync(path.join(raiz,p),'utf8'));
 prova(antes.value===agora.value,'Valor alterado: '+p);
 const campos=[...new Set([...Object.keys(antes),...Object.keys(agora)])].filter(k=>JSON.stringify(antes[k])!==JSON.stringify(agora[k]));
 prova(campos.every(k=>k==='note'||(k==='excerpt'&&agora.id==='remuneracao-bruta-mensal-media')),'Campo fora do mandato: '+p);
 if(campos.length)alteradas.push({id:agora.id,campos});
}
prova(linhas.size===anteriores.length,'O RP1c não acrescenta linhas');
for(const p of ['src/lib/pais.mjs','src/lib/inicio.mjs','src/data/politica-ia.mjs','scripts/textos-aprovados.json'])prova(!git('diff',base,'--',p),'Ficheiro protegido alterado: '+p);
const pedidos=fs.readFileSync(path.join(motor,'indicators/out/rp1-2026-09-26/pedidos.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
for(const p of pedidos)for(const pasta of ['indicators/out/rp1-2026-09-26','content/13 Dominios/source/rp1'])prova(sha(fs.readFileSync(path.join(motor,pasta,p.file)))===p.sha256,'Corpo divergente: '+p.file);
const meta=json(path.join(motor,'indicators/out/rp1-2026-09-26/001-ine-0014663-meta.json'))[0];
const classes=meta.Dimensoes.Categoria_Dim.flatMap(g=>Object.values(g).flat()).filter(c=>c.dim_num==='3').map(c=>c.categ_cod);
const codigos=['045','0722','041'], proibidas=cs=>codigos.filter(c=>cs.includes(c));
prova(!proibidas(classes).length,'Classe inesperada na dimensão 3 do 0014663');
const plantasClasses=codigos.map(c=>({codigo:c,encontrado:proibidas([c]).includes(c)}));
prova(plantasClasses.every(c=>c.encontrado),'O guarda das classes não vê o código publicado');
const ensaio=Object.fromEntries(Object.keys(DOMINIOS_RP1).map(id=>[id,Object.fromEntries(['pt','en'].map(lang=>[lang,textoDaLeitura(leituraDaMedida(id,lang).pedacos,lang)]))]));
fs.writeFileSync(path.join(aqui,'leituras-seladas.json'),JSON.stringify(ensaio,null,2)+'\n');
for(const id of ['ipc-variacao-media-12-meses','ipc-sem-habitacao-variacao-media-12-meses'])prova(ensaio[id].pt.includes('subiram')&&ensaio[id].en.includes('rose'),'Achado 5 regressou');
prova(!ensaio['linha-de-risco-de-pobreza-2025'].en.includes('to live on'),'Achado 7 regressou');
const cap=json(path.join(aqui,'capturas-rp1c-depois.json'));
for(const c of [...cap.resultados,...cap.recortes])prova(sha(fs.readFileSync(path.join(aqui,'capturas',c.ficheiro)))===c.sha256,'Captura alterada: '+c.ficheiro);
prova(cap.aceitacao.passou&&cap.resultados.length===20&&cap.recortes.length===50,'Capturas incompletas ou com defeito');
const indice=json(path.join(aqui,'paginas-depois/INDICE.json'));
for(const [p,c]of Object.entries(indice.copias))prova(sha(fs.readFileSync(path.join(aqui,'paginas-depois',p)))===c.sha256,'Cópia congelada alterada: '+p);
const inspecao=json(path.join(aqui,'inspecao-visual-rp1c.json'));
for(const c of inspecao.imagens)prova(sha(fs.readFileSync(path.join(aqui,'capturas',c.ficheiro)))===c.sha256,'Imagem inspecionada alterada');
const portoes={};
for(const nome of ['build','verify','typecheck']){
 const p=path.join(aqui,'portoes/rp1c',nome), ler=e=>fs.readFileSync(p+'.'+e,'utf8').trim();
 portoes[nome]={codigo:Number(ler('codigo')),cabeca:ler('cabeca'),inicio:ler('inicio'),fim:ler('fim'),log_sha256:sha(fs.readFileSync(p+'.log'))};
}
const cabeca=portoes.build.cabeca;
prova(Object.values(portoes).every(p=>p.codigo===0&&p.cabeca===cabeca),'Portões vermelhos ou de cabeças diferentes');
prova(cap.dist_construido_de===cabeca&&indice.dist_construido_de===cabeca,'Provas de outra cabeça');
const logBuild=fs.readFileSync(path.join(aqui,'portoes/rp1c/build.log'),'utf8');
prova(logBuild.includes('F1 · plantas «em 2.º trimestre» e «in 2nd quarter» recusadas'),'Plantas F1 ausentes');
const k16=auditarPerguntas(),k17=conferirAuditoriaDasLeituras(),rendidas=conferirLeiturasRendidas(path.join(raiz,'dist'));
prova(!k16.erros.length&&!k17.erros.length&&!rendidas.erros.length,[...k16.erros,...k17.erros,...rendidas.erros].join('\n'));
const plantas=json(path.join(aqui,'plantas-rp1.json')),m8=json(path.join(aqui,'m8-rp1c.json')),plantasM8=json(path.join(aqui,'plantas-m8-rp1c.json'));
prova(plantas.plantas.every(p=>p.mordeu)&&plantas.publicacoes_no_periodo.every(p=>p.aceite),'Planta sem resultado esperado');
prova(m8.celulas.every(c=>c.passa)&&plantasM8.plantas.every(p=>p.mordeu),'M8 vermelha');
const origens=json(path.join(aqui,'origens-provadas.json')),acertos=json(path.join(aqui,'acertos-provados.json'));
prova(origens.every(o=>o.literal&&o.pedido&&o.alojamento)&&acertos.diferencas_fora_dos_acertos===0,'Origens ou leituras divergentes');
const catraca=json(path.join(aqui,'l1-rp1.json'));
prova(!catraca.contagens.paginas_antigas_agravadas&&!catraca.contagens.outras_entradas,'Catraca agravada');
const fim=Object.values(portoes).map(p=>p.fim).sort().at(-1),inicio=pedidos[31].timestamp_utc;
const motorCodigo=Number(fs.readFileSync(path.join(aqui,'motor-rp1c.codigo'),'utf8'));
prova(motorCodigo===0,'O commit do motor não passou pelo portão');
const m={base:git('rev-parse',base),cabeca_do_codigo:cabeca,cabeca_motor:execFileSync('git',['rev-parse','HEAD'],{cwd:motor,encoding:'utf8'}).trim(),
 commits_sitio:git('log','--reverse','--format=%H %s','334cc740..'+cabeca).split('\n'),
 commits_motor:execFileSync('git',['log','--reverse','--format=%H %s','1d10b3f..HEAD'],{cwd:motor,encoding:'utf8'}).trim().split('\n'),
 entrega:{referencia:'HEAD',titulo:'RP1c: entregar as provas da passagem de correção',pai:cabeca},
 achados,plantas_do_pacote:5,
 linhas_conferidas:anteriores.length,linhas_novas:0,valores_alterados:0,alteradas,
 pedidos:pedidos.slice(31),corpos_conferidos:pedidos.length,pedidos_novos:pedidos.length-31,
 classes_0014663:{dimensao:3,publicadas:classes,codigos_procurados:codigos,encontradas:proibidas(classes).length,conhecidos_positivos:plantasClasses},
 origens,acertos,frases_resolvidas:Object.keys(ensaio).length*2,
 k16:{...k16.contas,erros:k16.erros.length},k17:{...k17.contas,erros:k17.erros.length},leituras_rendidas:{...rendidas.contas,erros:rendidas.erros.length},
 plantas,planta_origens:json(path.join(aqui,'planta-origens-rp1c.json')),plantas_f1:{portugues:true,ingles:true},m8,plantas_m8:plantasM8,
 catraca_l1:catraca,portoes,motor_portao:{codigo:motorCodigo,log_sha256:sha(fs.readFileSync(path.join(aqui,'motor-rp1c.log')))},
 capturas:{cabeca:cap.dist_construido_de,paginas:cap.resultados.length,recortes:cap.recortes.length,larguras:cap.larguras,falhas:cap.aceitacao.falhas.length,inspecionadas:inspecao.imagens.length},
 congeladas:{cabeca:indice.dist_construido_de,ficheiros:Object.keys(indice.copias).length},
 custo:{inicio,fim,segundos_da_janela:Math.round((Date.parse(fim)-Date.parse(inicio))/1000),sessao:json(path.join(aqui,'custo-rp1c.json')),euros:null},
 caminhos:caminhos(),sanitizacao:json(path.join(aqui,'sanitizacao-rp1c.json')),
};
fs.writeFileSync(path.join(aqui,'medidas.json'),JSON.stringify({...historico,rp1c:m},null,2)+'\n');
console.log(JSON.stringify({valores_alterados:m.valores_alterados,caminhos:m.caminhos,portoes}));
