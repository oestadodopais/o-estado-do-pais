/** RP1b: conserva a medição histórica e acrescenta provas da segunda entrega. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { DOMINIOS_RP1 } from '../../../../src/data/medidas-rp1.mjs';
import { REGUAS_DECLARADAS, conferirReguaDeclarada } from '../../../../src/lib/enquadramento.mjs';
import { textoDaLeitura, leituraDaMedida } from '../../../../src/lib/leitura-da-medida.mjs';
import { auditarPerguntas } from '../../../../tests/cartao/perguntas.mjs';
import { conferirAuditoriaDasLeituras, conferirLeiturasRendidas } from '../../../../tests/cartao/leituras.mjs';
const aqui=path.dirname(fileURLToPath(import.meta.url)),raiz=path.resolve(aqui,'../../../..');
const motor=process.env.RP1_MOTOR??path.join(process.env.HOME,'Instruments/ResearchHub/.worktrees/rp1-2026-09-26');
const base='5c92e5ea';
const git=(...args)=>execFileSync('git',args,{cwd:raiz,encoding:'utf8'}).trim();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const prova=(condicao,mensagem)=>{if(!condicao)throw Error(mensagem);};
const historico=JSON.parse(git('show',`${base}:design/especime-v3/medicoes/rp1-2026-09-26/medidas.json`));
const linhas=loadClaims();
const ids=['ipc-energia-em-casa-variacao-homologa','ipc-combustiveis-variacao-homologa','ipc-rendas-variacao-homologa','ihpc-variacao-homologa'];
const resumo=id=>{const l=linhas.get(id);prova(l,'Linha ausente: '+id);return {id,valor:l.value,unidade:l.unit,periodo:l.reference_date,publicado:l.published_at,fonte:l.source,excerto:l.excerpt};};
const medidas=ids.map(id=>{const regra=conferirReguaDeclarada(id,REGUAS_DECLARADAS[id]);return {...resumo(id),tema:DOMINIOS_RP1[id],anterior:resumo(regra.anterior),ue:regra.ue?resumo(regra.ue):null};});
const anteriores=git('ls-tree','-r','--name-only',base,'ledger/claims').split('\n').filter(Boolean);
const alteradas=anteriores.filter(p=>!execFileSync('git',['show',base+':'+p],{cwd:raiz}).equals(fs.readFileSync(path.join(raiz,p))));
prova(!alteradas.length,'Linhas anteriores alteradas: '+alteradas.join(', '));
const pedidos=fs.readFileSync(path.join(motor,'indicators/out/rp1-2026-09-26/pedidos.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const novos=pedidos.slice(historico.pedidos);
for(const p of pedidos){
 prova(p.url&&p.timestamp_utc&&p.cliente&&p.sha256,'Pedido incompleto: '+p.file);
 for(const pasta of ['indicators/out/rp1-2026-09-26','content/13 Dominios/source/rp1'])prova(sha(fs.readFileSync(path.join(motor,pasta,p.file)))===p.sha256,'Corpo divergente: '+p.file);
}
const meta=json(path.join(motor,'indicators/out/rp1-2026-09-26/027-ine-0014647-meta.json'))[0];
const categorias=meta.Dimensoes.Categoria_Dim.flatMap(d=>Object.values(d).flat());
const classes=['041','045','0722'].map(codigo=>categorias.find(c=>c.dim_num==='3'&&c.categ_cod===codigo));
prova(meta.IndicadorCod==='0014647'&&meta.Periodic==='Mensal'&&meta.UnidadeMedida==='Percentagem (%)'&&meta.Potencia10==='0'&&classes.every(Boolean),'Metainformação divergente');
const acertos=json(path.join(aqui,'acertos-provados.json'));
const ensaio=Object.fromEntries(Object.keys(DOMINIOS_RP1).map(id=>[id,Object.fromEntries(['pt','en'].map(lang=>[lang,textoDaLeitura(leituraDaMedida(id,lang).pedacos,lang)]))]));
fs.writeFileSync(path.join(aqui,'leituras-seladas.json'),JSON.stringify(ensaio,null,2)+'\n');
const inventario={medidas:[{nome:'inventario_das_medidas',valor:Object.keys(DOMINIOS_RP1).map(id=>{
 const l=resumo(id),r=REGUAS_DECLARADAS[id];
 const anterior=r?.anterior??(id.replace(/-\d{4}$/,'')+'-'+(Number(l.periodo)-1));
 return {...l,anterior:resumo(anterior),ue:r?.ue?resumo(r.ue):null};
})}]};
fs.writeFileSync(path.join(aqui,'inventario-rp1b.json'),JSON.stringify(inventario,null,2)+'\n');
const cap=json(path.join(aqui,'capturas-rp1b-depois.json'));
for(const c of [...cap.resultados,...cap.recortes])prova(sha(fs.readFileSync(path.join(aqui,'capturas',c.ficheiro)))===c.sha256,'Captura alterada: '+c.ficheiro);
prova(cap.aceitacao.passou&&cap.resultados.length===20&&cap.recortes.length===50,'Capturas incompletas ou com falhas');
const indice=json(path.join(aqui,'paginas-depois/INDICE.json'));
for(const [p,c]of Object.entries(indice.copias))prova(sha(fs.readFileSync(path.join(aqui,'paginas-depois',p)))===c.sha256,'Cópia congelada alterada: '+p);
const paginas={};
for(const [familia,p]of [['pais','index.html'],['temas','temas_index.html'],['pais_en','en_index.html'],['temas_en','en_themes_index.html']]){
 const root=parse(fs.readFileSync(path.join(aqui,'paginas-depois',p),'utf8'));
 const cartoes=root.querySelectorAll('article[data-cartao-medida]');
 const rp1=cartoes.filter(c=>Object.hasOwn(DOMINIOS_RP1,c.getAttribute('data-cartao-medida')));
 paginas[familia]={cartoes:cartoes.length,rp1:rp1.length,novos:ids.filter(id=>cartoes.some(c=>c.getAttribute('data-cartao-medida')===id))};
 if(familia.startsWith('temas'))prova(rp1.length===12,'Não estão os doze cartões: '+familia);
 for(const c of rp1)prova(c.querySelectorAll('[data-cartao-leitura]').length===1,'Leitura ausente');
 const salario=root.querySelector('[data-cartao-medida="remuneracao-bruta-mensal-media"]');
 if(salario){const pt=!familia.endsWith('_en');prova(salario.querySelectorAll('.claim-provisorio').every(m=>m.textContent===(pt?' provisório':' provisional')),'I153: bandeira colada');}
}
const portoes={};
for(const nome of ['build','verify','typecheck']){
 const prefixo=path.join(aqui,'portoes/rp1b',nome);
 const codigo=fs.readFileSync(prefixo+'.codigo','utf8').trim();prova(/^\d+$/.test(codigo),'Código inválido');
 portoes[nome]={codigo:Number(codigo),cabeca:fs.readFileSync(prefixo+'.cabeca','utf8').trim(),inicio:fs.readFileSync(prefixo+'.inicio','utf8').trim(),fim:fs.readFileSync(prefixo+'.fim','utf8').trim(),log_sha256:sha(fs.readFileSync(prefixo+'.log'))};
}
const cabeca=portoes.build.cabeca;
prova(Object.values(portoes).every(p=>p.codigo===0&&p.cabeca===cabeca),'Portões vermelhos ou de cabeças diferentes');
prova(cap.dist_construido_de===cabeca&&indice.dist_construido_de===cabeca,'Capturas e portões de cabeças diferentes');
const k16=auditarPerguntas(),k17=conferirAuditoriaDasLeituras(),rendidas=conferirLeiturasRendidas(path.join(raiz,'dist'));
prova(!k16.erros.length&&!k17.erros.length&&!rendidas.erros.length,[...k16.erros,...k17.erros,...rendidas.erros].join('\n'));
const plantas=json(path.join(aqui,'plantas-rp1.json')),plantasPortoes=json(path.join(aqui,'plantas-portoes-rp1b.json'));
prova(plantas.plantas.every(p=>p.mordeu)&&plantasPortoes.every(p=>p.passou),'Planta sem mordida');
const m8=json(path.join(aqui,'m8-rp1b.json')),plantasM8=json(path.join(aqui,'plantas-m8-rp1b.json'));
prova(m8.celulas.length===2&&m8.celulas.every(c=>c.passa)&&plantasM8.plantas.length===2&&plantasM8.plantas.every(p=>p.mordeu),'A M8 ou uma das suas plantas falhou');
const ressalvas=cap.recortes.filter(c=>c.id==='remuneracao-bruta-mensal-media').flatMap(c=>c.ressalvas);
prova(ressalvas.length===20&&ressalvas.every(m=>m.espaco_px===0&&/^ (provisório|provisional)$/.test(m.texto)),'I153: o separador falta ou alargou o espaço visual');
const inspecao=json(path.join(aqui,'inspecao-visual-rp1b.json'));
for(const imagem of inspecao.imagens)prova(sha(fs.readFileSync(path.join(aqui,'capturas',imagem.ficheiro)))===imagem.sha256,'Imagem inspecionada divergente');
const catraca=json(path.join(aqui,'l1-rp1.json'));
const log=fs.readFileSync(path.join(aqui,'portoes/rp1b/verify.log'),'utf8').replace(/\x1b\[[0-9;]*m/g,'');
const l1=log.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)/);
prova(l1&&Number(l1[1])===catraca.contagens.estudos&&Number(l1[2])===catraca.contagens.estudos,'Catraca e medição divergentes');
const fim=Object.values(portoes).map(p=>p.fim).sort().at(-1);
const motorCabeca=execFileSync('git',['rev-parse','HEAD'],{cwd:motor,encoding:'utf8'}).trim();
const custo=json(path.join(aqui,'custo-rp1b.json'));
const tentativa=path.join(aqui,'portoes/rp1b/tentativa-1/build');
const tentativaBuild={codigo:Number(fs.readFileSync(tentativa+'.codigo','utf8')),cabeca:fs.readFileSync(tentativa+'.cabeca','utf8').trim(),log_sha256:sha(fs.readFileSync(tentativa+'.log'))};
const resultado={base:git('rev-parse',base),cabeca_do_codigo:cabeca,cabeca_motor:motorCabeca,
 commits_sitio:git('log','--reverse','--format=%H %s',base+'..'+cabeca).split('\n'),
 commits_motor:execFileSync('git',['log','--reverse','--format=%H %s','6508b05..HEAD'],{cwd:motor,encoding:'utf8'}).trim().split('\n'),
 medidas,seladas:medidas.length,total_do_bloco:Object.keys(DOMINIOS_RP1).length,paradas:0,
 linhas_novas:linhas.size-anteriores.length,linhas_anteriores:anteriores.length,linhas_anteriores_alteradas:alteradas.length,
 pedidos:novos,corpos_conferidos:pedidos.length,pedidos_novos:novos.length,
 metainformacao:{nome:meta.IndicadorNome,frequencia:meta.Periodic,unidade:meta.UnidadeMedida,escala:meta.Potencia10,ultimo:meta.UltimoPeriodo,classes},
 acertos,frases_resolvidas:Object.values(ensaio).flatMap(Object.values).length,origens:json(path.join(aqui,'origens-provadas.json')).length,
 k16:{...k16.contas,erros:k16.erros.length},k17:{...k17.contas,erros:k17.erros.length},leituras_rendidas:{...rendidas.contas,erros:rendidas.erros.length},
 plantas,plantas_portoes:plantasPortoes,m8,plantas_m8:plantasM8,i153:{ressalvas_medidas:ressalvas.length,espaco_visual_max_px:Math.max(...ressalvas.map(m=>m.espaco_px)),imagens_inspecionadas:inspecao.imagens.length},catraca_l1:catraca,portoes,tentativa_build:tentativaBuild,
 capturas:{cabeca:cap.dist_construido_de,paginas:cap.resultados.length,recortes:cap.recortes.length,larguras:cap.larguras,falhas:cap.aceitacao.falhas.length},
 paginas,congeladas:{html:Object.keys(indice.copias).filter(p=>p.endsWith('.html')).length,css:Object.keys(indice.copias).filter(p=>p.endsWith('.css')).length,cabeca:indice.dist_construido_de},
 custo:{inicio:novos[0].timestamp_utc,fim,segundos_da_janela:Math.round((Date.parse(fim)-Date.parse(novos[0].timestamp_utc))/1000),sessao:custo,euros:null},
 motor_portao:{codigo:Number(fs.readFileSync(path.join(aqui,'motor-rp1b.codigo'),'utf8')),log_sha256:sha(fs.readFileSync(path.join(aqui,'motor-rp1b.log')))},
};
prova(resultado.motor_portao.codigo===0,'O core.gate não passou');
fs.writeFileSync(path.join(aqui,'medidas.json'),JSON.stringify({...historico,rp1b:resultado},null,2)+'\n');
console.log(JSON.stringify({seladas:resultado.seladas,total:resultado.total_do_bloco,linhas:resultado.linhas_novas,portoes}));
