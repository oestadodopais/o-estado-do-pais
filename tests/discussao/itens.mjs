/** V2-b: leitor independente dos itens e das portas, com estragos em memória. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'node-html-parser';
import {ITENS, DISCUSSAO, PCP} from '../../src/data/discussao.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {conferirAuditoriaDasExplicacoes, explicacaoPelaCelula, linhasDaExplicacao, textoSemSelos} from '../explicacoes/explicacao.mjs';
// Lista independente do mandato: o título e estas seis partes, sem rótulos livres.
const PARTES=[['como-foi-dito','Como foi dito','As it was said'],['fontes','O que as fontes dizem','What the sources say'],['comparacao','A comparação','The comparison'],['conclusao','A conclusão','The conclusion'],['recomendacao','A recomendação','The recommendation'],['opiniao','A opinião do lugar de direção',"The editorial seat's opinion"]];
const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
const destino=(slug,lang)=>(lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/')+'#'+slug;
const recibo=(id,lang)=>(lang==='pt'?'/livro-razao/':'/en/ledger/')+id;
const valores=x=>Number(String(x).replace(/[\s ]/g,'').replace('−','-').replace(',','.'));
const ADJETIVOS=['mentiroso','mentirosa','irresponsável','corrupto','corrupta','incompetente','desonesto','desonesta','dishonest','corrupt','incompetent','irresponsible'];
export function conferirDeclaracoes(itens=ITENS, linhas=loadClaims()) {
 const erros=[];
 if(itens.map(e=>e.slug).join('|')!=='saude-no-orcamento|parcerias-rodoviarias')erros.push('V2B itens: faltam os dois itens mandatados');
 const audit=JSON.parse(fs.readFileSync(path.join(raiz,'tests/discussao/palavras.json'),'utf8'));
 if(audit.explicacoes.some(e=>e.folhas.some(f=>f.partes.some(p=>p.apoios?.some(a=>a.campo==='note')))))erros.push('V2B apoio: note nunca apoia um item');
 erros.push(...conferirAuditoriaDasExplicacoes({explicacoes:itens,auditoria:audit,linhas}).erros);
 for(const e of itens){
  if(e.seccoes.map(s=>s.id).join('|')!==PARTES.map(s=>s[0]).join('|')||!e.titulo.pt?.length||!e.titulo.en?.length)erros.push('V2B partes: faltam partes obrigatórias');
  const q=e.seccoes.find(s=>s.id==='como-foi-dito');
  for(const lang of ['pt','en']){
   const tokens=q?.conteudo.flatMap(b=>b.paragrafo[lang])??[];
   for(const id of e.afirmacoes){
    if(tokens.filter(p=>p?.literal===id&&p.campo==='excerpt').length!==1)erros.push('V2B citação: falta o token da afirmação');
    if(tokens.filter(p=>p?.literal===id&&p.campo==='attributed_to').length!==1)erros.push('V2B atribuição: falta o token da afirmação');
    if(linhas.get(id)?.afirmacao!==true)erros.push('V2B citação: linha sem marca de afirmação');
   }
   e.seccoes.forEach((s,i)=>{if(s.titulo[lang]!==PARTES[i]?.[lang==='pt'?1:2])erros.push('V2B rótulo: rótulo alterado');});
  }
 }
 const excertoPCP=linhas.get(PCP).excerpt;
 if(/(?:19|20)\d{2}|brut[oa]|líquid[oa]/iu.test(excertoPCP))erros.push('V2B conclusão: o excerto já indica ano ou natureza do encargo');
 const n=valores(linhas.get(PCP).value);
 const quadros=['rodoviario-encargos-brutos','rodoviario-receitas','rodoviario-encargos-liquidos','total-encargos-liquidos'].map(k=>valores(linhas.get(`oe-2027-ppp-${k}-2027`).value));
 if(!Number.isFinite(n)||quadros.some(v=>!Number.isFinite(v)||v===n))erros.push('V2B comparação: um dos quatro valores coincide com a afirmação');
 const a=valores(linhas.get('oe-2027-saude-despesa-efetiva-consolidada-variacao').value),b=valores(linhas.get('oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao').value);
 if(!Number.isFinite(a*b)||a*b>=0)erros.push('V2B conclusão: a Saúde não tem variações de sinal contrário');
 return erros;
}
export function conferirPagina(root,lang,linhas=loadClaims()) {
 const erros=[];const main=root.querySelector('main');
 if(normal(main?.querySelector('h1')?.text)!==DISCUSSAO.titulo[lang])erros.push('V2B título: página ausente ou trocada');
 const artigos=main?.querySelectorAll('[data-discussao]')??[];
 if(artigos.map(a=>a.getAttribute('data-discussao')).join('|')!==ITENS.map(e=>e.slug).join('|'))erros.push('V2B ordem: itens ausentes, repetidos ou fora de ordem');
 for(const e of ITENS){
  const a=artigos.find(a=>a.getAttribute('data-discussao')===e.slug);if(!a){erros.push('V2B partes: item ausente');continue;}
  const esperado=explicacaoPelaCelula(e,lang,linhas);
  if(normal(a.querySelector('[data-discussao-titulo]')?.text)!==esperado.titulo)erros.push('V2B título: o item não tem o título declarado');
  const seccoes=a.querySelectorAll('[data-discussao-parte]');
  if(seccoes.map(s=>s.getAttribute('data-discussao-parte')).join('|')!==PARTES.map(p=>p[0]).join('|'))erros.push('V2B partes: faltam partes obrigatórias');
  for(const [id,pt,en] of PARTES){const sec=seccoes.find(s=>s.getAttribute('data-discussao-parte')===id);if(normal(sec?.querySelector('h3')?.text)!==(lang==='pt'?pt:en))erros.push(id==='opiniao'?'V2B opinião: opinião sem rótulo':'V2B rótulo: parte sem rótulo');}
  const ps=a.querySelectorAll('[data-discussao-paragrafo]');
  if(ps.length!==esperado.paragrafos.length)erros.push('V2B texto: parágrafo em falta ou a mais');
  for(const [i,p] of esperado.paragrafos.entries())if(ps[i]?.getAttribute('data-discussao-paragrafo')!==p.caminho||textoSemSelos(ps[i]??parse('<p></p>'))!==p.texto)erros.push('V2B texto: palavras diferentes do mandato ou campo alterado');
  for(const id of e.afirmacoes){
   for(const campo of ['excerpt','attributed_to']){
    const nodes=a.querySelectorAll(`[data-linha-claim="${id}"][data-linha-campo="${campo}"]`);
    if(nodes.length!==1){erros.push('V2B citação: citação ou atribuição sem token');continue;}
    const row=linhas.get(id), texto=campo==='excerpt'?row.excerpt:row.attributed_to.join(' / ');
    if(nodes[0].text!==texto)erros.push('V2B literal: citação ou atribuição alterada contra a linha');
    if(nodes[0].getAttribute('lang')!=='pt-PT')erros.push('V2B língua: citação sem marca de português');
    const link=nodes[0].closest('a');
    if(link?.getAttribute('href')!==(campo==='excerpt'?row.source_url:recibo(id,lang)))erros.push('V2B fonte: porta da citação ou do recibo errada');
   }
   for(const nome of linhas.get(id).attributed_to){
    const texto=normal(a.text).toLowerCase(), n=nome.toLowerCase();
    if(ADJETIVOS.some(adj=>texto.includes(adj+' '+n)||texto.includes(n+' '+adj)))erros.push('V2B pessoas: adjetivo colado a uma atribuição');
   }
  }
  const ids=[...linhasDaExplicacao(e,linhas)];
  for(const id of ids)if(!a.querySelectorAll('a').some(n=>n.getAttribute('href')===recibo(id,lang)))erros.push('V2B recibo: linha sem porta para o recibo');
  for(const n of a.querySelectorAll('[data-claim]')){
   const id=n.getAttribute('data-claim');
   if(!n.parentNode?.querySelectorAll('a').some(x=>x.getAttribute('href')===recibo(id,lang)))erros.push('V2B toque: número sem selo adjacente');
  }
 }
 return erros;
}
export function conferirInicio(root,lang){
 const erros=[];const bloco=root.querySelector('[data-discussao-inicio]');
 if(!bloco)return ['V2B início: bloco ausente'];
 const links=bloco.querySelectorAll('[data-discussao-porta]');
 if(links.length!==ITENS.length)erros.push('V2B início: títulos em falta ou a mais');
 for(const [i,e] of ITENS.entries())if(links[i]?.getAttribute('href')!==destino(e.slug,lang)||normal(links[i]?.text)!==normal(e.titulo[lang].join('')))erros.push('V2B início: destino ou título errado');
 const content=root.querySelector('main')?.innerHTML??'';
 if(!(content.indexOf('data-o-que-se-passa')<content.indexOf('data-discussao-inicio')&&content.indexOf('data-discussao-inicio')<content.indexOf('data-entradas')))erros.push('V2B início: bloco fora do lugar');
 return erros;
}
export function conferirIntegracao(root,lang,pagina,linhas=loadClaims()){
 const erros=[];const main=root.querySelector('main');if(!main)return erros;
 const ids=new Set(main.querySelectorAll('[data-claim],[data-linha-claim],[data-de-linha],[data-explicacao-nome]').filter(n=>!n.closest('[data-discussao-integracao]')).map(n=>n.getAttribute('data-claim')??n.getAttribute('data-linha-claim')??n.getAttribute('data-de-linha')??n.getAttribute('data-explicacao-nome')));
 const tematica=pagina===`explicacoes/dinheiro-do-estado-2026/index.html`||pagina===`en/explainers/dinheiro-do-estado-2026/index.html`;
 const esperados=ITENS.filter(e=>[...linhasDaExplicacao(e,linhas)].some(id=>ids.has(id))||(tematica&&e.slug==='saude-no-orcamento'));
 const portas=main.querySelectorAll('[data-discussao-integracao]');
 for(const a of main.querySelectorAll('a'))if(ITENS.some(e=>a.getAttribute('href')===destino(e.slug,lang))&&!a.closest('[data-discussao-integracao],[data-discussao-inicio]'))erros.push('V2B integração: porta sem condição declarada');
 if(portas.length!==esperados.length)erros.push(`V2B integração: presença ou ausência errada em ${pagina}`);
 for(const e of esperados){
  const p=portas.find(p=>p.getAttribute('data-discussao-integracao')===e.slug),a=p?.querySelector('a');
  if(a?.getAttribute('href')!==destino(e.slug,lang)||normal(a?.text)!==normal(DISCUSSAO.porta[lang]+' '+e.titulo[lang].join('')))erros.push(`V2B integração: destino ou título errado em ${pagina}`);
  if(tematica&&(p?.getAttribute('data-discussao-condicao')!=='tematica'||p?.closest('[data-explicacao-secao]')?.getAttribute('data-explicacao-secao')!=='por-funcao'))erros.push('V2B integração: porta temática fora da secção');
  if(/^(?:en\/ledger|livro-razao)\/[^/]+\/index.html$/.test(pagina)&&!p?.closest('#prova'))erros.push('V2B integração: porta fora da secção da prova');
  if(/^(?:en\/ledger|livro-razao)\/index.html$/.test(pagina)&&!p?.closest('[data-livro-lista]'))erros.push('V2B integração: porta fora da lista das linhas');
  if(!tematica&&p?.getAttribute('data-discussao-condicao')!=='linhas')erros.push('V2B integração: exceção temática não autorizada');
 }
 return erros;
}
export function plantas(html,lang){
 const out=[];const run=(nome,mut,re)=>{for(const e of ITENS){const root=parse(html);mut(root.querySelector(`[data-discussao="${e.slug}"]`));const erros=conferirPagina(root,lang);out.push({nome,item:e.slug,lang,mordeu:erros.some(x=>re.test(x)),queixa:erros.find(x=>re.test(x))??null});}};
 run('citação sem token',r=>r.querySelector('[data-linha-campo="excerpt"]').removeAttribute('data-linha-campo'),/citação/);
 run('citação alterada',r=>r.querySelector('[data-linha-campo="excerpt"]').set_content('Uma citação adulterada.'),/literal/);
 run('adjetivo junto do nome',r=>{const n=r.querySelector('[data-linha-campo="attributed_to"]');n.set_content('irresponsável '+n.innerHTML);},/pessoas/);
 run('opinião sem rótulo',r=>r.querySelector('[data-discussao-parte="opiniao"] h3').remove(),/opinião/);
 run('item sem uma parte',r=>r.querySelector('[data-discussao-parte="recomendacao"]').remove(),/partes/);
 return out;
}
export function conferirTudo(dist=path.join(raiz,'dist')){
 const erros=conferirDeclaracoes(),provas=[],integracoes=[];
 for(const lang of ['pt','en']){
  const file=path.join(dist,lang==='pt'?'o-que-se-discute/index.html':'en/under-discussion/index.html');
  if(!fs.existsSync(file)){erros.push('V2B página: página ausente');continue;}
  const html=fs.readFileSync(file,'utf8');erros.push(...conferirPagina(parse(html),lang));provas.push(...plantas(html,lang));
  const home=parse(fs.readFileSync(path.join(dist,lang==='pt'?'index.html':'en/index.html'),'utf8'));erros.push(...conferirInicio(home,lang));
  const broken=parse(home.toString());broken.querySelector('[data-discussao-porta]')?.setAttribute('href','#errado');provas.push({nome:'porta inicial errada',lang,mordeu:conferirInicio(broken,lang).some(x=>x.includes('destino'))});
 }
 const idsDosItens=[...new Set(ITENS.flatMap(e=>[...linhasDaExplicacao(e,loadClaims())]))];
 const walk=p=>{for(const f of fs.readdirSync(p,{withFileTypes:true})){const n=path.join(p,f.name);if(f.isDirectory())walk(n);else if(f.name==='index.html'){
  const rel=path.relative(dist,n);if(rel==='o-que-se-discute/index.html'||rel==='en/under-discussion/index.html'||rel.includes('/documento/')||rel.includes('/document/'))continue;
  const html=fs.readFileSync(n,'utf8');
  if(!html.includes('data-discussao-integracao')&&!ITENS.some(e=>html.includes('#'+e.slug))&&!idsDosItens.some(id=>html.includes(id))&&!rel.includes('dinheiro-do-estado-2026'))continue;
  const root=parse(html),lang=rel.startsWith('en/')?'en':'pt';
  erros.push(...conferirIntegracao(root,lang,rel));
  for(const p of root.querySelectorAll('[data-discussao-integracao]'))integracoes.push({pagina:rel,item:p.getAttribute('data-discussao-integracao'),condicao:p.getAttribute('data-discussao-condicao')});
 }};};walk(dist);
 const demo=ITENS[0], id=demo.afirmacoes[0];
 const intacta=`<main><section><span data-claim="${id}"></span><p data-discussao-integracao="${demo.slug}" data-discussao-condicao="linhas"><a href="${destino(demo.slug,'pt')}">${DISCUSSAO.porta.pt} ${demo.titulo.pt.join('')}</a></p></section></main>`;
 if(conferirIntegracao(parse(intacta),'pt','exemplo').length)erros.push('V2B integração: conhecido positivo recusado');
 for(const [nome,html] of [['porta por coincidência ausente',intacta.replace(/<p .*<\/p>/,'')],['porta sem coincidência',intacta.replace(/<span .*?<\/span>/,'')],['destino de outro item',intacta.replace(destino(demo.slug,'pt'),'#outra')]])provas.push({nome,mordeu:conferirIntegracao(parse(html),'pt','exemplo').length>0});
 const semToken=structuredClone(ITENS);semToken[0].seccoes[0].conteudo[0].paragrafo.pt[1]='Citação sem linha';
 provas.push({nome:'declaração sem token',mordeu:conferirDeclaracoes(semToken).some(x=>x.includes('V2B citação'))});
 for(const p of provas)if(!p.mordeu)erros.push('V2B planta não mordeu: '+p.nome);
 return {erros,plantas:provas,integracoes};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const r=process.argv.includes('--dados')?{erros:conferirDeclaracoes()}:conferirTudo(process.env.OEDP_DIST??path.join(raiz,'dist'));
 const out=process.argv.indexOf('--json');if(out>=0)fs.writeFileSync(process.argv[out+1],JSON.stringify(r,null,2)+'\n');
 console.log(`V2B · ${r.erros.length} erro(s), ${r.plantas?.filter(p=>p.mordeu).length??0} de ${r.plantas?.length??0} plantas, ${r.integracoes?.length??0} portas de integração.`);
 for(const erro of r.erros)console.error(erro);
 process.exitCode=r.erros.length?1:0;
}
