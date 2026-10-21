/** V2-d: leitor independente dos itens, das contas e das portas, com estragos em memória. */
import fs from 'node:fs';
import { routePath } from '../../src/lib/routes.mjs';
import { ESTUDO_EO1, PORTAS_EO1 } from '../../src/data/portas-eo1.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'node-html-parser';
import {ITENS, DISCUSSAO, PCP} from '../../src/data/discussao.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {plantasDaContagem} from './contagem-medicos.mjs';
import {conferirDerivacoes, plantasDasDerivacoes} from './derivacoes.mjs';
import {conferirPortasDoMetodo} from './metodo.mjs';
import {conferirMarcasDoTitulo,plantasDosTitulos,tituloDeEnsaio} from './titulos.mjs';
import {seloDoTituloDaDiscussao} from '../../scripts/porta-do-titulo-discussao.mjs';
import {conferirRecibosCorrigidos} from './recibos.mjs';
import {conferirApoiosDaComparacao,plantasDosApoios} from './apoios.mjs';
import {conferirEfeitos,plantasDosEfeitos,conferirRecibosDosEfeitos,linhasImpressasOuDerivadas} from './efeitos.mjs';
import {conferirAuditoriaDasExplicacoes, explicacaoPelaCelula, textoSemSelos} from '../explicacoes/explicacao.mjs';
// Lista independente do mandato: o título e estas seis partes, sem rótulos livres.
const PARTES=[['como-foi-dito','Como foi dito','As it was said'],['fontes','O que as fontes dizem','What the sources say'],['comparacao','A comparação','The comparison'],['conclusao','A conclusão','The conclusion'],['recomendacao','A recomendação','The recommendation'],['opiniao','A opinião do lugar de direção',"The editorial seat's opinion"]];
const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const normal=x=>String(x??'').replace(/\s+/g,' ').trim();
const destino=(slug,lang)=>(lang==='pt'?'/o-que-se-discute/':'/en/under-discussion/')+'#'+slug;
const recibo=(id,lang)=>(lang==='pt'?'/livro-razao/':'/en/ledger/')+id;
const valores=x=>Number(String(x).replace(/[\s ]/g,'').replace('−','-').replace(',','.'));
const ADJETIVOS=['mentiroso','mentirosa','irresponsável','corrupto','corrupta','incompetente','desonesto','desonesta','dishonest','corrupt','incompetent','irresponsible'];
/** Segue a ordem lida, incluindo o texto depois do fecho do invólucro do valor. */
export function unidadesDepoisDoSelo(root){
 const desvios=[];
 for(const p of root.querySelectorAll('[data-discussao-paragrafo]')){
  const segmentos=[];
  const anda=n=>{
   if(n.classList?.contains('src-chip')){segmentos.push({selo:n});return;}
   if(n.nodeType===3){segmentos.push({texto:n.text});return;}
   for(const filho of n.childNodes??[])anda(filho);
  };
  anda(p);
  for(const [i,s] of segmentos.entries()){
   if(!s.selo)continue;
   let depois='';
   for(const seguinte of segmentos.slice(i+1)){if(seguinte.selo)break;depois+=seguinte.texto??'';if(depois.length>160)break;}
   if(/^\s*(?:(?:mil\s+)?milh(?:ão|ões)(?=\s|[,.;:]|$)|pontos\s+percentuais(?=\s|[,.;:]|$)|p\.p\.|percentage\s+points(?=\s|[,.;:]|$)|billions?(?=\s|[,.;:]|$)|millions?(?=\s|[,.;:]|$)|euros?(?=\s|[,.;:]|$)|[%€])/iu.test(depois)){
    desvios.push({paragrafo:p.getAttribute('data-discussao-paragrafo'),recibo:s.selo.getAttribute('href'),depois:normal(depois)});
   }
  }
 }
 return desvios;
}
export function conferirSelosInline(root,lang,linhas=loadClaims()){
 const erros=[];
 for(const item of ITENS)for(const [si,sec] of item.seccoes.entries())for(const [bi,bloco] of sec.conteudo.entries()){
  const tokens=bloco.paragrafo?.[lang]??[];
  for(const [i,token] of tokens.entries()){
   if(!token?.selo)continue;
   if(token.texto){
    const par=root.querySelector(`[data-discussao="${item.slug}"] [data-discussao-paragrafo="seccoes[${si}].conteudo[${bi}].paragrafo"]`);
    const a=par?.querySelector(`[data-discussao-recibo="${token.selo}"]`);
    if(a?.getAttribute('href')!==recibo(token.selo,lang)||a?.text!==token.texto)erros.push(`V2E porta textual: ${lang} ${token.selo}`);
    continue;
   }
   const id=token.selo,c=linhas.get(id),caminho=`seccoes[${si}].conteudo[${bi}].paragrafo`;
   const par=root.querySelector(`[data-discussao="${item.slug}"] [data-discussao-paragrafo="${caminho}"]`);
   const selos=par?.querySelectorAll(`[data-discussao-selo="${id}"]`)??[],selo=selos[0];
   const etiqueta=lang==='pt'?'fonte':'source',alinea=/^([a-z])\)/.exec(c?.excerpt??'')?.[1];
   const esperado=`${etiqueta} · ${c?.document?.title}${alinea?`, ${lang==='pt'?'alínea':'clause'} ${alinea})`:''}`;
   const ancora=selo?.matches('a')?selo:selo?.querySelector('a.src-chip');
   const anterior=selo?.previousSibling?.text??'';
   const texto=typeof tokens[i-1]==='string'?tokens[i-1]:'';
   if(selos.length!==1||ancora?.getAttribute('href')!==recibo(id,lang)||ancora?.getAttribute('aria-label')!==esperado||!texto||!normal(anterior).endsWith(normal(texto)))erros.push(`V2E selo inline: ${lang} ${id}`);
  }
 }
 return erros;
}
const UNIDADES_DO_MANDATO=['milhões de euros','mil milhões de euros','milhões','euros','%','pontos percentuais','p.p.','million euros','billion euros','million','percentage points'];
export function conferirUnidadesNosDados(itens=ITENS){
 const erros=[];
 for(const item of itens)for(const sec of item.seccoes)for(const b of sec.conteudo)for(const lang of ['pt','en']){
  const tokens=b.paragrafo?.[lang]??[];
  for(const [i,t] of tokens.entries())if(t?.claim&&!t.sufixo&&typeof tokens[i+1]==='string'){
   const seguinte=tokens[i+1].trimStart();
   if(UNIDADES_DO_MANDATO.some(u=>seguinte===u||seguinte.startsWith(u+' ')||seguinte.startsWith(u+',')||seguinte.startsWith(u+';')||seguinte.startsWith(u+'.')))
    erros.push(`V2E unidade fora do token: ${lang} ${t.claim}`);
  }
 }
 return erros;
}
export function plantasDasUnidades(){
 return UNIDADES_DO_MANDATO.map(unidade=>{
  const copia=structuredClone(ITENS),tokens=copia[0].seccoes.flatMap(s=>s.conteudo).map(b=>b.paragrafo.pt).find(ts=>ts.some(t=>t?.claim&&t.sufixo));
  const i=tokens.findIndex(t=>t?.claim&&t.sufixo);if(i<0)throw new Error('Planta sem token real');
  tokens[i].sufixo=' '+unidade;
  const antes=conferirUnidadesNosDados(copia);
  delete tokens[i].sufixo;tokens.splice(i+1,0,' '+unidade+'; ');
  const erros=conferirUnidadesNosDados(copia);
  return {nome:'sufixo retirado numa cópia dos itens: '+unidade,claim:tokens[i].claim,mordeu:antes.length===0&&erros.some(e=>e.includes('V2E unidade fora do token')),queixa:erros[0]??null};
 });
}
export function conferirDeclaracoes(itens=ITENS, linhas=loadClaims()) {
 const erros=[...conferirUnidadesNosDados(itens),...conferirDerivacoes(linhas),...conferirEfeitos(linhas,itens)];
 if(itens.map(e=>e.slug).join('|')!=='saude-no-orcamento|parcerias-rodoviarias')erros.push('V2B itens: faltam os dois itens mandatados');
 const audit=JSON.parse(fs.readFileSync(path.join(raiz,'tests/discussao/palavras.json'),'utf8'));
 if(audit.explicacoes.some(e=>e.folhas.some(f=>f.partes.some(p=>p.apoios?.some(a=>a.campo==='note')))))erros.push('V2B apoio: note nunca apoia um item');
 erros.push(...conferirAuditoriaDasExplicacoes({explicacoes:itens,auditoria:audit,linhas}).erros);
 erros.push(...conferirApoiosDaComparacao(audit));
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
export function conferirPagina(root,lang,linhas=loadClaims(),dist=process.env.OEDP_DIST??path.join(raiz,'dist')) {
 const erros=[];const main=root.querySelector('main');
 erros.push(...conferirSelosInline(root,lang,linhas));
 for(const d of unidadesDepoisDoSelo(root))erros.push(`V2E unidade depois do selo: ${lang} ${d.paragrafo} ${d.recibo}`);
 if(normal(main?.querySelector('h1')?.text)!==DISCUSSAO.titulo[lang])erros.push('V2B título: página ausente ou trocada');
 const artigos=main?.querySelectorAll('[data-discussao]')??[];
 const menu=main?.querySelectorAll('[data-discussao-porta]')??[];
 if(menu.length!==ITENS.length)erros.push('V2D menu: número de títulos diferente');
 for(const [i,e] of ITENS.entries()){const m=menu[i];erros.push(...conferirMarcasDoTitulo(m,e,lang,linhas));if(m?.getAttribute('href')!==destino(e.slug,lang)||normal(m?.text)!==explicacaoPelaCelula(e,lang,linhas).titulo)erros.push('V2D menu: título ou destino diferente');}
 if(artigos.map(a=>a.getAttribute('data-discussao')).join('|')!==ITENS.map(e=>e.slug).join('|'))erros.push('V2B ordem: itens ausentes, repetidos ou fora de ordem');
 for(const e of ITENS){
  const a=artigos.find(a=>a.getAttribute('data-discussao')===e.slug);if(!a){erros.push('V2B partes: item ausente');continue;}
  const esperado=explicacaoPelaCelula(e,lang,linhas);
  const titulo=a.querySelector('[data-discussao-titulo]');
  erros.push(...conferirMarcasDoTitulo(titulo,e,lang,linhas));
  if(textoSemSelos(titulo??parse('<h2></h2>'))!==esperado.titulo)erros.push('V2B título: o item não tem o título declarado');
  const seccoes=a.querySelectorAll('[data-discussao-parte]');
  if(e.slug==='saude-no-orcamento'){
   const href=lang==='pt'?'/explicacoes/dinheiro-do-estado-2026/':'/en/explainers/dinheiro-do-estado-2026/';
   const texto=lang==='pt'?'O que é a despesa efetiva consolidada →':'What consolidated effective expenditure is →';
   const portas=a.querySelectorAll('[data-discussao-explicacao]'),porta=portas[0];
   if(portas.length!==1||porta?.getAttribute('href')!==href||normal(porta?.text)!==texto||!porta?.hasAttribute('data-voz')||!porta?.closest('.regra-portas.discussao-porta')||porta?.closest('[data-discussao-parte]')?.getAttribute('data-discussao-parte')!=='fontes'||!fs.existsSync(path.join(dist,href,'index.html')))erros.push('V2B explicação: porta ausente, texto ou destino errado');
  }
  if(seccoes.map(s=>s.getAttribute('data-discussao-parte')).join('|')!==PARTES.map(p=>p[0]).join('|'))erros.push('V2B partes: faltam partes obrigatórias');
  for(const [id,pt,en] of PARTES){const sec=seccoes.find(s=>s.getAttribute('data-discussao-parte')===id);if(normal(sec?.querySelector('h3')?.text)!==(lang==='pt'?pt:en))erros.push(id==='opiniao'?'V2B opinião: opinião sem rótulo':'V2B rótulo: parte sem rótulo');}
  const ps=a.querySelectorAll('[data-discussao-paragrafo]');
  if(ps.length!==esperado.paragrafos.length)erros.push('V2B texto: parágrafo em falta ou a mais');
  for(const [i,p] of esperado.paragrafos.entries())if(ps[i]?.getAttribute('data-discussao-paragrafo')!==p.caminho||textoSemSelos(ps[i]??parse('<p></p>'))!==p.texto)erros.push('V2B texto: palavras diferentes do mandato ou campo alterado');
  for(const [caminho,ids] of Object.entries(e.recibos ?? {})){
   const par=ps.find(p=>p.getAttribute('data-discussao-paragrafo')===caminho);
   for(const id of ids)if(!par?.querySelectorAll('a.src-chip').some(s=>s.getAttribute('href')===recibo(id,lang)))erros.push('V2D apoio textual: recibo ausente junto da explicação '+id);
  }
  for(const literal of a.querySelectorAll('a[data-discussao-literal="excerpt"]')){
   const id=literal.querySelector('[data-linha-claim]')?.getAttribute('data-linha-claim');
   const irmaos=literal.parentNode.childNodes,i=irmaos.indexOf(literal);
   const fecho=irmaos[i+1],selo=irmaos[i+2];
   if(fecho?.text!=='»'||!selo?.classList?.contains('src-chip')||selo?.getAttribute('href')!==recibo(id,lang))erros.push('V2D citação: selo tem de seguir a aspa de fecho');
  }
  for(const id of e.afirmacoes){
   for(const campo of ['excerpt','attributed_to']){
    const nodes=a.querySelectorAll(`[data-linha-claim="${id}"][data-linha-campo="${campo}"]`);
    const primeiras=a.querySelector('[data-discussao-parte="como-foi-dito"]')?.querySelectorAll(`[data-linha-claim="${id}"][data-linha-campo="${campo}"]`)??[];
    const ocorrencias=e.seccoes.flatMap(s=>s.conteudo.flatMap(b=>b.paragrafo[lang])).filter(t=>t?.literal===id&&t.campo===campo).length;
    if(primeiras.length!==1||nodes.length!==ocorrencias){erros.push('V2B citação: citação ou atribuição sem token');continue;}
    const row=linhas.get(id), texto=campo==='excerpt'?row.excerpt:row.attributed_to.join(' · ');
    for(const node of nodes){
    if(node.text!==texto)erros.push('V2B literal: citação ou atribuição alterada contra a linha');
    if(node.getAttribute('lang')!=='pt-PT')erros.push('V2B língua: citação sem marca de português');
    const link=node.closest('a');
    if(link?.getAttribute('href')!==(campo==='excerpt'?row.source_url:recibo(id,lang)))erros.push('V2B fonte: porta da citação ou do recibo errada');
    }
   }
   for(const nome of linhas.get(id).attributed_to){
    const texto=normal(a.text).toLowerCase(), n=nome.toLowerCase();
    if(ADJETIVOS.some(adj=>texto.includes(adj+' '+n)||texto.includes(n+' '+adj)))erros.push('V2B pessoas: adjetivo colado a uma atribuição');
   }
  }
  const citadas=new Set();
  const recolhe=x=>{if(Array.isArray(x))x.forEach(recolhe);else if(x&&typeof x==='object')for(const [k,v] of Object.entries(x)){if(['claim','literal','periodo','nome','selo'].includes(k)&&typeof v==='string')citadas.add(v);else recolhe(v);}};
  recolhe(e);
  for(const id of citadas){
   if(!a.querySelectorAll('a').some(n=>n.getAttribute('href')===recibo(id,lang)))erros.push(`V2B recibo: ${id} sem porta direta para o recibo`);
   const componentes=linhas.get(id)?.derived_from??[];
   if(componentes.length){
    const ficheiro=path.join(dist,recibo(id,lang),'index.html');
    const corpo=fs.existsSync(ficheiro)?parse(fs.readFileSync(ficheiro,'utf8')):null;
    for(const componente of componentes)if(!corpo?.querySelectorAll('a').some(n=>n.getAttribute('href')?.replace(/\/$/,'')===recibo(componente,lang)))erros.push(`V2D recibo: ${id} sem porta para a componente ${componente}`);
   }
  }
  for(const n of a.querySelectorAll('[data-claim]')){
   const id=n.getAttribute('data-claim');
   if(!n.parentNode?.querySelectorAll('a').some(x=>x.getAttribute('href')===recibo(id,lang))&&!seloDoTituloDaDiscussao(n,id,lang,linhas))erros.push('V2B toque: número sem selo adjacente');
  }
 }
 return erros;
}
export function conferirInicio(root,lang){
 const erros=[];const bloco=root.querySelector('[data-discussao-inicio]');
 if(!bloco)return ['V2B início: bloco ausente'];
 const links=bloco.querySelectorAll('[data-discussao-porta]');
 if(links.length!==ITENS.length)erros.push('V2B início: títulos em falta ou a mais');
 for(const [i,e] of ITENS.entries()){erros.push(...conferirMarcasDoTitulo(links[i],e,lang,loadClaims()));if(links[i]?.getAttribute('href')!==destino(e.slug,lang)||normal(links[i]?.text)!==explicacaoPelaCelula(e,lang,loadClaims()).titulo)erros.push('V2B início: destino ou título errado');}
 const content=root.querySelector('main')?.innerHTML??'';
 const marcas=['data-discussao-inicio','data-o-que-se-passa','data-entradas'].map(m=>content.indexOf(m));
 if(marcas.some(n=>n<0)||!(marcas[0]<marcas[1]&&marcas[1]<marcas[2]))erros.push('V2C início: marca ausente ou bloco fora do lugar');
 if(root.querySelectorAll('[data-discussao-inicio]').length!==1||root.querySelector('main > section')!==bloco)erros.push('V2C início: bloco não é a primeira secção única');
 if(bloco.querySelector('h2 a')?.getAttribute('href')!==routePath('discussao',lang))erros.push('V2C início: destino do título errado');
 return erros;
}
export function conferirIntegracao(root,lang,pagina,linhas=loadClaims(),{dist=process.env.OEDP_DIST??path.join(raiz,'dist'),recibos=new Map()}={}){
 const erros=[];const main=root.querySelector('main');if(!main)return erros;
 const nos=main.querySelectorAll('[data-claim],[data-linha-claim],[data-de-linha],[data-explicacao-nome]').filter(n=>!n.closest('[data-discussao-integracao],[data-discussao-inicio],[data-discussao-porta],[data-discussao-titulo]'));
 const idDoNo=n=>n.getAttribute('data-claim')??n.getAttribute('data-linha-claim')??n.getAttribute('data-de-linha')??n.getAttribute('data-explicacao-nome');
 const area=/^(?:en\/)?areas\/[^/]+\/index.html$/.test(pagina),registo=/^(?:correcoes|en\/corrections)\/index.html$/.test(pagina),ids=new Set(),vistos=new Map();
 for(const n of nos){
  const id=idDoNo(n),cartao=area?n.closest('article[data-cartao-medida][data-area-peca="medida"],div[data-linha-sem-nome][data-area-peca="medida"]'):registo?n.closest('[data-mudou-registo] li[data-mudanca="correcao"][data-correcao-entrada]'):null;
  const dono=cartao?.getAttribute('data-cartao-medida')??cartao?.getAttribute('data-linha-sem-nome')??cartao?.getAttribute('data-correcao-entrada');
  const remissao=n.closest('[data-regua][data-selo-em]');
  if(!cartao||(dono!==id&&remissao?.getAttribute('data-selo-em')!==dono)){ids.add(id);continue;}
  const relevantes=ITENS.filter(e=>linhasImpressasOuDerivadas(e,linhas).has(id));
  if(!relevantes.length)continue;
  const chave=lang+':'+dono;
  if(!vistos.has(cartao))vistos.set(cartao,new Set());
  if(vistos.get(cartao).has(id))continue;vistos.get(cartao).add(id);
  if(!cartao.querySelectorAll('a.src-chip[data-nonledger="proveniencia"]').some(a=>a.getAttribute('href')===recibo(dono,lang))){erros.push(`V2D percurso: cartão ${id} sem selo para o recibo`);continue;}
  if(!recibos.has(chave)){const f=path.join(dist,recibo(dono,lang),'index.html');recibos.set(chave,fs.existsSync(f)?parse(fs.readFileSync(f,'utf8')):null);}
  const documento=recibos.get(chave);
  if(!documento){erros.push(`V2D percurso: recibo de ${id} ausente`);continue;}
  if(dono!==id&&!documento.querySelector(`[data-claim="${id}"],[data-linha-claim="${id}"]`)){erros.push(`V2D percurso: recibo de ${dono} sem a linha comparada ${id}`);continue;}
  for(const e of relevantes){
   const porta=documento.querySelector(`#prova [data-discussao-integracao="${e.slug}"]`),a=porta?.querySelector('a');
   if(porta?.getAttribute('data-discussao-condicao')!=='linhas'||a?.getAttribute('href')!==destino(e.slug,lang)||normal(a?.text)!==normal(DISCUSSAO.porta[lang]+' '+explicacaoPelaCelula(e,lang,linhas).titulo)||conferirMarcasDoTitulo(a,e,lang,linhas).length)erros.push(`V2D percurso: recibo de ${id} sem porta completa para ${e.slug}`);
  }
 }
 const tematica=pagina===`explicacoes/dinheiro-do-estado-2026/index.html`||pagina===`en/explainers/dinheiro-do-estado-2026/index.html`;
 const estudoEo1=pagina===`${lang==='pt'?'estudos':'en/studies'}/${ESTUDO_EO1}/index.html`;
 const esperados=ITENS.filter(e=>[...linhasImpressasOuDerivadas(e,linhas)].some(id=>ids.has(id))||(tematica&&e.slug==='saude-no-orcamento')||(estudoEo1&&PORTAS_EO1[e.slug]));
 const portas=main.querySelectorAll('[data-discussao-integracao]');
 for(const a of main.querySelectorAll('a'))if(ITENS.some(e=>a.getAttribute('href')===destino(e.slug,lang))&&!a.closest('[data-discussao-integracao],[data-discussao-inicio]'))erros.push('V2B integração: porta sem condição declarada');
 if(portas.length!==esperados.length)erros.push(`V2B integração: presença ou ausência errada em ${pagina}`);
 for(const e of esperados){
  const p=portas.find(p=>p.getAttribute('data-discussao-integracao')===e.slug),a=p?.querySelector('a');
  if(estudoEo1){
   if(p?.getAttribute('data-discussao-condicao')!=='estudo-eo1'||a?.getAttribute('href')!==destino(e.slug,lang)||normal(a?.text)!==PORTAS_EO1[e.slug]?.[lang])
    erros.push(`EO1 integração: porta temática diferente do documento em ${pagina}`);
   continue;
  }
  erros.push(...conferirMarcasDoTitulo(a,e,lang,linhas));
  if(a?.getAttribute('href')!==destino(e.slug,lang)||normal(a?.text)!==normal(DISCUSSAO.porta[lang]+' '+explicacaoPelaCelula(e,lang,linhas).titulo))erros.push(`V2B integração: destino ou título errado em ${pagina}`);
  if(tematica&&(p?.getAttribute('data-discussao-condicao')!=='tematica'||p?.closest('[data-explicacao-secao]')?.getAttribute('data-explicacao-secao')!=='por-funcao'))erros.push('V2B integração: porta temática fora da secção');
  if(/^(?:en\/ledger|livro-razao)\/[^/]+\/index.html$/.test(pagina)&&!p?.closest('#prova'))erros.push('V2B integração: porta fora da secção da prova');
  if(/^(?:en\/ledger|livro-razao)\/index.html$/.test(pagina)&&!p?.closest('[data-livro-lista]'))erros.push('V2B integração: porta fora da lista das linhas');
  if(!tematica&&p?.getAttribute('data-discussao-condicao')!=='linhas')erros.push('V2B integração: exceção temática não autorizada');
 }
 return erros;
}
export function plantas(html,lang){
 const out=[];const run=(nome,mut,re)=>{for(const e of ITENS){const root=parse(html);mut(root.querySelector(`[data-discussao="${e.slug}"]`));const erros=conferirPagina(root,lang);out.push({nome,item:e.slug,lang,mordeu:erros.some(x=>re.test(x)),queixa:erros.find(x=>re.test(x))??null});}};
 out.push(...plantasDasUnidades().map(p=>({...p,lang})));
 const inlineIntacto=conferirSelosInline(parse(html),lang).length===0;
 const trimestreErrado=parse(html),trimestre=trimestreErrado.querySelector('#parcerias-rodoviarias [data-discussao-periodo="ppp-oe2027-riscos-pedidos-rodoviarios"] [data-de-campo="period"]');
 const periodoEsperado=lang==='pt'?'1.º trimestre de 2026':'1st quarter of 2026';
 const trimestreIntacto=trimestre?.text===periodoEsperado&&!conferirPagina(parse(html),lang).some(e=>e.startsWith('V2B texto:'));
 trimestre?.set_content('31.03.2026');
 out.push({nome:'trimestre substituído pelo último dia',lang,mordeu:trimestreIntacto&&conferirPagina(trimestreErrado,lang).some(e=>e.startsWith('V2B texto:'))});
 for(const [nome,muda] of [
  ['selo da alínea afastado das palavras',r=>{const selo=r.querySelector('[data-discussao-selo="pe-despacho-alargamentos"]');selo?.insertAdjacentHTML('beforebegin',' palavras alheias ');}],
  ['selo da alínea sem nome acessível',r=>{const selo=r.querySelector('[data-discussao-selo="pe-despacho-alargamentos"]');(selo?.matches('a')?selo:selo?.querySelector('a.src-chip'))?.removeAttribute('aria-label');}],
  ['selo do exemplo PRR ausente',r=>r.querySelector('[data-discussao-selo="prr-complemento-p4-1-40-estado"]')?.remove()],
 ]){
  const r=parse(html);muda(r);
  out.push({nome,lang,mordeu:inlineIntacto&&conferirSelosInline(r,lang).some(e=>e.startsWith('V2E selo inline:'))});
 }
 for(const [nome,muda] of [
  ['texto da porta do recibo alterado',a=>a.set_content('outra porta')],
  ['destino da porta do recibo alterado',a=>a.setAttribute('href','/livro-razao/pe-dl87a-descontos')],
 ]){
  const r=parse(html),a=r.querySelector('[data-discussao-recibo="pe-scut-trocos"]');muda(a);
  out.push({nome,lang,mordeu:inlineIntacto&&conferirSelosInline(r,lang).some(e=>e.startsWith('V2E porta textual:'))});
 }
 run('citação sem token',r=>r.querySelector('[data-linha-campo="excerpt"]').removeAttribute('data-linha-campo'),/citação/);
 run('citação alterada',r=>r.querySelector('[data-linha-campo="excerpt"]').set_content('Uma citação adulterada.'),/literal/);
 const semAcss=parse(html);semAcss.querySelector('#saude-no-orcamento [data-discussao-parte="comparacao"] a[href*="oe-2027-saude-contrato-programa-acss"]')?.remove();
 const errosAcss=conferirPagina(semAcss,lang);
 out.push({nome:'recibo do contrato-programa ausente',item:'saude-no-orcamento',lang,mordeu:errosAcss.some(x=>x.includes('V2D apoio textual')),queixa:errosAcss.find(x=>x.includes('V2D apoio textual'))??null});
 run('selo dentro das aspas',r=>{const a=r.querySelector('a[data-discussao-literal="excerpt"]'),nos=a.parentNode.childNodes,i=nos.indexOf(a),fecho=nos[i+1],selo=nos[i+2],html=selo.toString();selo.remove();fecho.remove();a.insertAdjacentHTML('afterend',html+'»');},/V2D citação/);
 run('adjetivo junto do nome',r=>{const n=r.querySelector('[data-linha-campo="attributed_to"]');n.set_content('irresponsável '+n.innerHTML);},/pessoas/);
 run('opinião sem rótulo',r=>r.querySelector('[data-discussao-parte="opiniao"] h3').remove(),/opinião/);
 run('item sem uma parte',r=>r.querySelector('[data-discussao-parte="recomendacao"]').remove(),/partes/);
 const semPorta=parse(html);semPorta.querySelector('[data-discussao-explicacao]')?.remove();
 const erros=conferirPagina(semPorta,lang);
 out.push({nome:'porta da explicação ausente',item:'saude-no-orcamento',lang,mordeu:erros.some(x=>x.includes('V2B explicação')),queixa:erros.find(x=>x.includes('V2B explicação'))??null});
 return out;
}
export function conferirTudo(dist=path.join(raiz,'dist')){
 const metodo=conferirPortasDoMetodo(dist);
 const recibosCorrigidos=conferirRecibosCorrigidos(dist,loadClaims());
 const efeitos=conferirRecibosDosEfeitos(dist,ITENS,loadClaims());
 const apoios=plantasDosApoios(JSON.parse(fs.readFileSync(path.join(raiz,'tests/discussao/palavras.json'),'utf8')));
 const erros=[...conferirDeclaracoes(),...metodo.erros,...recibosCorrigidos.erros],provas=[...plantasDasDerivacoes(loadClaims()),...plantasDosTitulos(loadClaims()),...metodo.plantas,...recibosCorrigidos.plantas],integracoes=[];
 provas.push(...apoios,...plantasDaContagem());
 erros.push(...efeitos.erros);provas.push(...efeitos.plantas,...plantasDosEfeitos(loadClaims(),ITENS));
 for(const lang of ['pt','en']){
  const file=path.join(dist,lang==='pt'?'o-que-se-discute/index.html':'en/under-discussion/index.html');
  if(!fs.existsSync(file)){erros.push('V2B página: página ausente');continue;}
  const html=fs.readFileSync(file,'utf8');erros.push(...conferirPagina(parse(html),lang,loadClaims(),dist));provas.push(...plantas(html,lang));
  const home=parse(fs.readFileSync(path.join(dist,lang==='pt'?'index.html':'en/index.html'),'utf8'));erros.push(...conferirInicio(home,lang));
  for(const [nome,estraga] of [
   ['bloco depois do painel',r=>{const b=r.querySelector('[data-discussao-inicio]');const html=b.toString();b.remove();r.querySelector('[data-o-que-se-passa]').insertAdjacentHTML('afterend',html);}],
   ...['data-discussao-inicio','data-o-que-se-passa','data-entradas'].map(m=>['marca ausente: '+m,r=>r.querySelector('['+m+']').removeAttribute(m)]),
   ['bloco duplicado',r=>r.querySelector('main').insertAdjacentHTML('beforeend',r.querySelector('[data-discussao-inicio]').toString())],
   ['destino do título errado',r=>r.querySelector('[data-discussao-inicio] h2 a').setAttribute('href','#errado')]
  ]){const r=parse(home.toString());estraga(r);provas.push({nome,lang,mordeu:conferirInicio(r,lang).length>0});}
  const broken=parse(home.toString());broken.querySelector('[data-discussao-porta]')?.setAttribute('href','#errado');provas.push({nome:'porta inicial errada',lang,mordeu:conferirInicio(broken,lang).some(x=>x.includes('destino'))});
 }
 const idsDosItens=[...new Set(ITENS.flatMap(e=>[...linhasImpressasOuDerivadas(e,loadClaims())]))];
 const walk=p=>{for(const f of fs.readdirSync(p,{withFileTypes:true})){const n=path.join(p,f.name);if(f.isDirectory())walk(n);else if(f.name==='index.html'){
  const rel=path.relative(dist,n);if(rel==='o-que-se-discute/index.html'||rel==='en/under-discussion/index.html'||rel.includes('/documento/')||rel.includes('/document/'))continue;
  const html=fs.readFileSync(n,'utf8');
  if(!html.includes('data-discussao-integracao')&&!ITENS.some(e=>html.includes('#'+e.slug))&&!idsDosItens.some(id=>html.includes(id))&&!rel.includes('dinheiro-do-estado-2026'))continue;
  const root=parse(html),lang=rel.startsWith('en/')?'en':'pt';
  erros.push(...conferirIntegracao(root,lang,rel,loadClaims(),{dist}));
  for(const p of root.querySelectorAll('[data-discussao-integracao]'))integracoes.push({pagina:rel,item:p.getAttribute('data-discussao-integracao'),condicao:p.getAttribute('data-discussao-condicao')});
 }};};walk(dist);
 const demo=ITENS[0], id=demo.afirmacoes[0];
 const intacta=`<main><section><span data-claim="${id}"></span><p data-discussao-integracao="${demo.slug}" data-discussao-condicao="linhas"><a href="${destino(demo.slug,'pt')}">${DISCUSSAO.porta.pt} ${tituloDeEnsaio(demo,'pt',loadClaims())}</a></p></section></main>`;
 if(conferirIntegracao(parse(intacta),'pt','exemplo').length)erros.push('V2B integração: conhecido positivo recusado');
 for(const [nome,html] of [['porta por coincidência ausente',intacta.replace(/<p .*<\/p>/,'')],['porta sem coincidência',intacta.replace(/<span .*?<\/span>/,'')],['destino de outro item',intacta.replace(destino(demo.slug,'pt'),'#outra')]])provas.push({nome,mordeu:conferirIntegracao(parse(html),'pt','exemplo').length>0});
 for(const lang of ['pt','en']){
  const pagina=`${lang==='pt'?'estudos':'en/studies'}/${ESTUDO_EO1}/index.html`;
  const html='<main>'+Object.entries(PORTAS_EO1).map(([id,n])=>`<p data-discussao-integracao="${id}" data-discussao-condicao="estudo-eo1"><a href="${destino(id,lang)}">${n[lang]}</a></p>`).join('')+'</main>';
  if(conferirIntegracao(parse(html),lang,pagina).length)erros.push('EO1 integração: controlo íntegro recusado');
  for(const [nome,mut] of [
   ['nome trocado',r=>r.querySelector('a').set_content('Outro item')],
   ['destino trocado',r=>r.querySelector('a').setAttribute('href','#outro')],
   ['porta ausente',r=>r.querySelector('p').remove()],
   ['condição ausente',r=>r.querySelector('p').removeAttribute('data-discussao-condicao')],
  ]){const r=parse(html);mut(r);provas.push({nome:'EO1 '+nome,lang,mordeu:conferirIntegracao(r,lang,pagina).length>0});}
  provas.push({nome:'EO1 condição fora do estudo',lang,mordeu:conferirIntegracao(parse(html),lang,'exemplo').length>0});
 }
 // Nas áreas, cada cartão chega ao item pelo seu recibo, sem uma porta repetida para a página inteira.
 for(const lang of ['pt','en'])for(const forma of ['cartao','linha','regua','registo']){
  const dono=forma==='regua'?'oe-2027-saude-pessoal-2027':id;
  const href=recibo(dono,lang),rota=forma==='registo'?(lang==='pt'?'correcoes':'en/corrections')+'/index.html':(lang==='pt'?'':'en/')+'areas/ensaio/index.html';
  const tag=forma==='registo'?'li':forma==='linha'?'div':'article',marca=forma==='registo'?'data-correcao-entrada':forma==='linha'?'data-linha-sem-nome':'data-cartao-medida';
  const numero=forma==='regua'?`<span data-regua="anterior" data-selo-em="${dono}"><span data-claim="${id}"></span></span>`:`<span data-claim="${id}"></span>`;
  const area=`<main>${forma==='registo'?'<ol data-mudou-registo>':''}<${tag} ${marca}="${dono}" ${forma==='registo'?'data-mudanca="correcao"':'data-area-peca="medida"'}>${numero}<a class="src-chip" data-nonledger="proveniencia" href="${href}">fonte</a></${tag}>${forma==='registo'?'</ol>':''}</main>`;
  const corpo=`<main><span data-claim="${id}"></span><section id="prova"><p data-discussao-integracao="${demo.slug}" data-discussao-condicao="linhas"><a href="${destino(demo.slug,lang)}">${DISCUSSAO.porta[lang]} ${tituloDeEnsaio(demo,lang,loadClaims())}</a></p></section></main>`;
  const mede=(a,c)=>conferirIntegracao(parse(a),lang,rota,loadClaims(),{dist,recibos:new Map([[lang+':'+dono,c?parse(c):null]])});
  if(forma==='regua')provas.push({nome:'régua sem a linha no recibo',lang,mordeu:mede(area,corpo.replace(/<span data-claim=.*?<\/span>/,'')).some(e=>e.includes('sem a linha comparada'))});
  if(mede(area,corpo).length)erros.push('V2D percurso: cartão com caminho completo recusado');
  for(const [nome,a,c] of [['cartão sem selo para o recibo',area.replace(/<a class="src-chip".*?<\/a>/,''),corpo],['recibo sem porta para o item',area,'<main><section id="prova"></section></main>'],['recibo ausente no percurso',area,null]])provas.push({nome:forma+': '+nome,lang,mordeu:mede(a,c).some(e=>e.startsWith('V2D percurso:'))});
 }
 const semToken=structuredClone(ITENS);semToken[0].seccoes[0].conteudo[0].paragrafo.pt[1]='Citação sem linha';
 provas.push({nome:'declaração sem token',mordeu:conferirDeclaracoes(semToken).some(x=>x.includes('V2B citação'))});
 for(const p of provas)if(!p.mordeu)erros.push('V2B planta não mordeu: '+p.nome);
 return {erros,plantas:provas,integracoes};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const r=process.argv.includes('--dados')?{erros:conferirDeclaracoes()}:conferirTudo(process.env.OEDP_DIST??path.join(raiz,'dist'));
 if(!process.argv.includes('--dados')){
  const {plantasDosSelosConstruidos}=await import('./planta-selos.mjs');
  const selos=await plantasDosSelosConstruidos(undefined,unidadesDepoisDoSelo);r.plantas.push(...selos.plantas);
 }
 const out=process.argv.indexOf('--json');if(out>=0)fs.writeFileSync(process.argv[out+1],JSON.stringify(r,null,2)+'\n');
 console.log(`V2B · ${r.erros.length} erro(s), ${r.plantas?.filter(p=>p.mordeu).length??0} de ${r.plantas?.length??0} plantas, ${r.integracoes?.length??0} portas de integração.`);
 for(const erro of r.erros)console.error(erro);
 process.exitCode=r.erros.length?1:0;
}
