/** Medições do RP1, lidas dos artefactos e das saídas dos comandos. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { DOMINIOS_RP1 } from '../../../../src/data/medidas-rp1.mjs';
import { LEITURAS_RP1 as previstas } from '../../../observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs';
import { textoDaLeitura, leituraDaMedida } from '../../../../src/lib/leitura-da-medida.mjs';
import { auditarPerguntas } from '../../../../tests/cartao/perguntas.mjs';
import { conferirAuditoriaDasLeituras, conferirLeiturasRendidas } from '../../../../tests/cartao/leituras.mjs';
const aqui=path.dirname(fileURLToPath(import.meta.url));
const raiz=path.resolve(aqui,'../../../..');
const motor=process.env.RP1_MOTOR ?? path.join(process.env.HOME,'Instruments/ResearchHub/.worktrees/rp1-2026-09-26');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(...args)=>execFileSync('git',args,{cwd:raiz,encoding:'utf8'}).trim();
const base='38d3627894416097de26c52346c595c45a7b2884';
const linhas=loadClaims();
const pedidos=fs.readFileSync(path.join(motor,'indicators/out/rp1-2026-09-26/pedidos.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
for(const p of pedidos){
 const original=fs.readFileSync(path.join(motor,'indicators/out/rp1-2026-09-26',p.file));
 const alojado=fs.readFileSync(path.join(motor,'content/13 Dominios/source/rp1',p.file));
 if(sha(original)!==p.sha256||sha(alojado)!==p.sha256)throw Error('Corpo divergente: '+p.file);
 if(!p.url||!p.timestamp_utc||!p.cliente)throw Error('Pedido incompleto: '+p.file);
}
const meta=json(path.join(motor,'indicators/out/rp1-2026-09-26/001-ine-0014663-meta.json'))[0];
const classes=meta.Dimensoes.Categoria_Dim.flatMap(d=>Object.values(d).flat()).filter(d=>d.dim_num==='3').map(d=>d.categ_cod);
for(const c of ['04.5','07.2.2','04.1'])if(classes.includes(c))throw Error('A paragem já não corresponde à resposta: '+c);
const erro=pedidos.find(p=>p.nome==='eurostat-prc_hicp_minr.json');
const erroIHPC=json(path.join(motor,'indicators/out/rp1-2026-09-26',erro.file));
if(!erroIHPC.error.some(e=>e.label.includes('Dimension "COICOP" is not defined')))throw Error('Paragem do IHPC sem prova');
const paragens={
 'ipc-energia-em-casa-variacao-homologa':{motivo:'A metainformação não publica a classe 04.5.',pedido:pedidos[0]},
 'ipc-combustiveis-variacao-homologa':{motivo:'A metainformação não publica a classe 07.2.2.',pedido:pedidos[0]},
 'ipc-rendas-variacao-homologa':{motivo:'A metainformação não publica a classe 04.1.',pedido:pedidos[0]},
 'ihpc-variacao-homologa':{motivo:erroIHPC.error[0].label,pedido:erro},
 'remuneracao-bruta-mensal-media-variacao-real':{motivo:'Indicador da variação real não localizado nas pesquisas do catálogo; não calculado a partir do IPC.',pedido:pedidos.find(p=>p.nome==='catalogo-pesquisa-variacao-real.json')},
};
const ensaio=Object.fromEntries(Object.keys(DOMINIOS_RP1).map(id=>[id,{pt:textoDaLeitura(leituraDaMedida(id,'pt').pedacos,'pt'),en:textoDaLeitura(leituraDaMedida(id,'en').pedacos,'en')} ]));
fs.writeFileSync(path.join(aqui,'leituras-seladas.json'),JSON.stringify(ensaio,null,2)+'\n');
const medidas=Object.keys(previstas).map(id=>({id,estado:linhas.has(id)?'selada':'parada',...(linhas.has(id)?{valor:linhas.get(id).value,unidade:linhas.get(id).unit,periodo:linhas.get(id).reference_date,tema:DOMINIOS_RP1[id]}:paragens[id])}));
if(medidas.some(m=>m.estado==='parada'&&!m.motivo))throw Error('Paragem sem motivo');
const antigos=git('ls-tree','-r','--name-only',base,'ledger/claims').split('\n').filter(Boolean);
const alteradas=antigos.filter(p=>!fs.existsSync(path.join(raiz,p))||!execFileSync('git',['show',base+':'+p],{cwd:raiz}).equals(fs.readFileSync(path.join(raiz,p))));
if(alteradas.length)throw Error('Linhas anteriores alteradas: '+alteradas.join(', '));
const capturas={};const paginas={};
for(const estado of ['antes','depois']){
 const registo=json(path.join(aqui,`capturas-${estado}.json`));
 for(const c of [...registo.resultados,...registo.recortes]){
  if(sha(fs.readFileSync(path.join(aqui,'capturas',c.ficheiro)))!==c.sha256)throw Error('Captura alterada: '+c.ficheiro);
 }
 capturas[estado]={cabeca:registo.dist_construido_de,paginas:registo.resultados.length,recortes:registo.recortes.length,larguras:registo.larguras,falhas:registo.aceitacao.falhas.length};
 const indice=json(path.join(aqui,`paginas-${estado}/INDICE.json`));
 const copias=Object.entries(indice.copias);
 for(const [p,c]of copias)if(sha(fs.readFileSync(path.join(aqui,`paginas-${estado}`,p)))!==c.sha256)throw Error('Página congelada alterada: '+p);
 paginas[estado]={cabeca:indice.dist_construido_de,html:copias.filter(([p])=>p.endsWith('.html')).length,css:copias.filter(([p])=>p.endsWith('.css')).length};
 for(const [familia,p]of [['pais','index.html'],['temas','temas_index.html']]){
  const root=parse(fs.readFileSync(path.join(aqui,`paginas-${estado}`,p),'utf8'));
  paginas[estado][familia+'_cartoes']=root.querySelectorAll('[data-cartao-medida]').length;
 }
}
const portoes={};
for(const nome of ['build','verify','typecheck']){
 const p=path.join(aqui,'portoes',nome+'.codigo');const codigo=fs.readFileSync(p,'utf8').trim();
 if(!/^\d+$/.test(codigo))throw Error('Código inválido: '+nome);
 portoes[nome]={codigo:Number(codigo),cabeca:fs.readFileSync(path.join(aqui,'portoes',nome+'.cabeca'),'utf8').trim(),fim:fs.statSync(p).mtime.toISOString()};
}
const acertos=json(path.join(aqui,'acertos-provados.json'));
const k16=auditarPerguntas(),k17=conferirAuditoriaDasLeituras(),rendidas=conferirLeiturasRendidas(path.join(raiz,'dist'));
const fim=Object.values(portoes).map(p=>p.fim).sort().at(-1);
const resultado={
 base,cabeca_do_codigo:portoes.build.cabeca,cabeca_motor:execFileSync('git',['rev-parse','HEAD'],{cwd:motor,encoding:'utf8'}).trim(),
 previstas:medidas.length,seladas:medidas.filter(m=>m.estado==='selada').length,paradas:medidas.filter(m=>m.estado==='parada').length,
 linhas_novas:linhas.size-antigos.length,linhas_antigas:antigos.length,linhas_antigas_alteradas:alteradas.length,
 pedidos:pedidos.length,pedidos_lidos:pedidos.filter(p=>p.estado==='lido').length,pedidos_recusados:pedidos.filter(p=>p.estado==='recusado').length,
 corpos_com_sha256_conferido:pedidos.length,bytes_dos_corpos:pedidos.reduce((n,p)=>n+p.bytes,0),classes_publicadas:classes,
 medidas,capturas,paginas,portoes,acertos,origens:json(path.join(aqui,'origens-provadas.json')).length,
 plantas:json(path.join(aqui,'plantas-rp1.json')),k16:{...k16.contas,erros:k16.erros.length},k17:{...k17.contas,erros:k17.erros.length},leituras_rendidas:{...rendidas.contas,erros:rendidas.erros.length},
 frases_novas_resolvidas:Object.values(ensaio).flatMap(x=>Object.values(x)).length,
 custo:{inicio_da_janela:pedidos[0].timestamp_utc,fim_da_janela:fim,segundos_da_janela:Math.round((Date.parse(fim)-Date.parse(pedidos[0].timestamp_utc))/1000),tokens:null,euros:null,limite:'Tempo entre o primeiro pedido registado e o último portão. Tokens e preço desta execução não expostos.'},
};
if(k16.erros.length||k17.erros.length||rendidas.erros.length)throw Error([...k16.erros,...k17.erros,...rendidas.erros].join('\n'));
fs.writeFileSync(path.join(aqui,'medidas.json'),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({seladas:resultado.seladas,paradas:resultado.paradas,linhas_novas:resultado.linhas_novas,portoes}));
