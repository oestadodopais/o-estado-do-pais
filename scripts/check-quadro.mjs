/** PAI2: a segunda leitura do quadro e de cada aviso no HTML. */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';
import {load} from 'js-yaml';
import {ENTRADAS} from '../src/data/primeira-pagina.mjs';
import {reguaDoCartao} from '../src/lib/enquadramento.mjs';
import {QUADRO} from '../src/data/quadro-do-pais.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {unidadeDaLinha} from '../src/i18n/unidades.mjs';
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
const numero=s=>Number(normal(s).replace(/\s/g,'').replace('−','-').replace(',','.'));
let livro, pontos;
export function linhasDosPontos() {
 if(pontos)return pontos;
 pontos=new Map();
 for(const f of fs.readdirSync('ledger/series').filter(f=>f.endsWith('.yml'))){
  const s=load(fs.readFileSync(path.join('ledger/series',f),'utf8'));
  if(s.eixo!=='pais')continue;
  if(s.linha_de_portugal)pontos.set(`${s.id}#PT`,s.linha_de_portugal);
  if(s.linha_da_uniao)pontos.set(`${s.id}#EU27_2020`,s.linha_da_uniao);
 }
 return pontos;
}
export function livroDoQuadro() {
  return livro??=new Map(fs.readdirSync('ledger/claims').filter(f=>f.endsWith('.yml')).map(f=>{
    const c=load(fs.readFileSync(path.join('ledger/claims',f),'utf8'));return [c.id,c];
  }));
}
/** Não chama o resolvedor da vista, nem lê a contagem da semana. */
export function revisoesPorAplicar(linhas=livroDoQuadro()) {
  const resultado=new Map();
  for(const [id,c] of linhas){
    let ultima=null, indice=-1;
    for(const [n,v] of (c.verifications??[]).entries()) if(!ultima || v.date>=ultima.date){ultima=v;indice=n;}
    if(ultima?.result!=='diverge')continue;
    const aplicada=(c.corrections??[]).filter(k=>['atualizacao','correcao'].includes(k.kind)&&!('field' in k)).some(k=>k.date>ultima.date);
    if(!aplicada)resultado.set(id,{...ultima,n:indice});
  }
  return resultado;
}
const textoAviso=(v,lang)=>{
  const encontrado=String(v.found).replace(/[\s\u202f]/g,'').replace(/[.,](?=\d+$)/,lang==='en'?'.':',');
  const data=v.date.slice(0,10).split('-').reverse().join('.');
  return lang==='pt'?`A fonte reviu este número para ${encontrado} na releitura de ${data}; o valor acima é o publicado até a revisão se aplicar.`:`The source revised this figure to ${encontrado} in the re-reading of ${data}; the value above is the one published until the revision is applied.`;
};
const caminho=(id,lang)=>`${lang==='en'?'/en/ledger/':'/livro-razao/'}${id}`;
/** Cada forma tem uma caixa própria; um aviso no rodapé não cobre o cartão. */
export function caixaDaMedida(el) {
  return el.closest('[data-faixa-paises], .serie-pontos, [data-quadro-medida], [data-cartao-medida], [data-bloco], [data-estudo], .livro-item, .cartao, [data-semana-revisao]')
    ?? (el.closest('.linha-valor')?.parentNode)
    ?? el.closest('dd, p, li, td, figure') ?? el.parentNode;
}
export function conferirAvisos(root,lang,{exigir=true,pendentes=revisoesPorAplicar()}={}) {
  const erros=[],nos=new Set(),portas=new Set();
  for(const aviso of root.querySelectorAll('[data-aviso-revisao]')){
    const id=aviso.getAttribute('data-aviso-revisao'),v=pendentes.get(id),a=aviso.querySelector('a');
    const texto=normal(aviso.textContent);
    const found=aviso.querySelector(`[data-linha-claim="${id}"][data-linha-campo="verifications.${v?.n}.found"]`);
    const data=aviso.querySelector(`[data-de-linha="${id}"][data-de-campo="verifications.${v?.n}.date"]`);
    if(!v || texto!==normal(textoAviso(v,lang)) || aviso.getAttribute('data-revisao-indice')!==String(v?.n) || !found || !data || a?.getAttribute('href')!==caminho(id,lang))erros.push(`Q4 ${id}: aviso sem divergência ou frase, origem, data ou recibo diferente.`);
    else {nos.add(aviso);portas.add(a);}
  }
  if(exigir)for(const el of root.querySelectorAll('[data-claim], [data-ponto], [data-faixa-marca]')){
    const id=el.getAttribute('data-claim')??linhasDosPontos().get(el.getAttribute('data-ponto')??el.getAttribute('data-faixa-marca'));if(!pendentes.has(id))continue;
    const caixa=caixaDaMedida(el);
    if(!caixa?.querySelectorAll(`[data-aviso-revisao="${id}"]`).some(a=>nos.has(a)))erros.push(`Q3 ${id}: divergência por aplicar sem aviso na forma ${caixa?.tagName}.`);
  }
  return {erros,nos,portas};
}
const textoSemAviso=no=>{
  if(!no)return '';
  const c=parse(no.outerHTML);c.querySelectorAll('[data-aviso-revisao],.src-chip,.quadro-rotulo').forEach(n=>n.remove());return normal(c.textContent);
};
export function conferirQuadro(root,lang,{dist=process.env.OEDP_DIST??'dist',cartoes}={}) {
  const erros=[],portas=new Set();
  const parte=root.querySelector('[data-quadro-pais]'),q=QUADRO[lang];
  if(!parte)return {erros:['Q1: falta o quadro.'],portas};
  if(normal(parte.querySelector('h2')?.textContent)!==q.titulo)erros.push('Q1: título do quadro diferente.');
  const entradas=ENTRADAS.filter(e=>e.seccoes.some(s=>s.cartoes.length));
  const ids=entradas.flatMap(e=>e.seccoes.flatMap(s=>s.cartoes));
  const linhas=parte.querySelectorAll('[data-quadro-medida]');
  if(JSON.stringify(linhas.map(n=>n.getAttribute('data-quadro-medida')))!==JSON.stringify(ids))erros.push('Q1: medidas em falta, repetidas ou fora de ordem.');
  if(parte.querySelector('[data-cartao-medida], [data-cartao-leitura], [data-faixa-ue], [data-cartao-serie]'))erros.push('Q1: o quadro contém um cartão inteiro ou uma forma excluída.');
  if(JSON.stringify(parte.querySelectorAll('[data-quadro-porta]').map(n=>n.getAttribute('data-quadro-porta')))!==JSON.stringify(entradas.map(e=>e.id)))erros.push('Q1: portas fora de ordem.');
  for(const e of entradas){
    const sec=parte.querySelector(`[data-quadro-porta="${e.id}"]`);
    if(!sec){erros.push(`Q1 ${e.id}: secção em falta.`);continue;}
    if(normal(sec.querySelector('h3')?.textContent)!==e.nome[lang])erros.push(`Q1 ${e.id}: título diferente.`);
    if(JSON.stringify(sec.querySelectorAll('thead th').map(n=>normal(n.textContent)))!==JSON.stringify(q.colunas))erros.push(`Q1 ${e.id}: colunas diferentes.`);
    const pagina=cartoes?.get(e.id)??parse(fs.readFileSync(path.join(dist,e.rota[lang],'index.html'),'utf8'));
    for(const id of e.seccoes.flatMap(s=>s.cartoes)){
      const row=sec.querySelector(`[data-quadro-medida="${id}"]`),cartao=pagina.querySelector(`[data-cartao-medida="${id}"]`);
      if(!row||!cartao){erros.push(`Q1 ${id}: linha ou cartão em falta.`);continue;}
      const cols=row.querySelectorAll('[data-quadro-coluna]');
      if(JSON.stringify(cols.map(n=>n.getAttribute('data-quadro-coluna')))!==JSON.stringify(['nome','portugal','anterior','ue','referencia']))erros.push(`Q2 ${id}: estrutura das células diferente.`);
      if(JSON.stringify(row.querySelectorAll('.quadro-rotulo').map(n=>normal(n.textContent)))!==JSON.stringify(q.colunas))erros.push(`Q2 ${id}: rótulos móveis diferentes.`);
      const link=row.querySelector('[data-quadro-destino]');
      if(textoSemAviso(row.querySelector('[data-quadro-coluna="nome"]'))!==textoSemAviso(link))erros.push(`Q2 ${id}: texto extra no nome.`);
      if(link?.getAttribute('href')!==`${e.rota[lang]}#m-${id}`||textoSemAviso(link)!==textoSemAviso(cartao.querySelector('.cartao-medida-nome')))erros.push(`Q2 ${id}: nome ou destino diferente do cartão.`);
      else portas.add(link);
      const relacoes=reguaDoCartao(id);
      for(const [col,esperado] of [['portugal',id],['anterior',relacoes.anterior?.id],['ue',relacoes.ue?.id]]){
        if(col!=='portugal' && cartao.querySelector(`[data-regua="${col}"] [data-claim]`)?.getAttribute('data-claim')!==esperado)erros.push(`Q2 ${id} ${col}: cartão diferente da relação no livro.`);
        const cell=row.querySelector(`[data-quadro-coluna="${col}"]`),valores=cell?.querySelectorAll('[data-claim]')??[];
        if(valores.length!==(esperado?1:0)||esperado&&valores[0]?.getAttribute('data-claim')!==esperado)erros.push(`Q2 ${id} ${col}: valor ou relação diferente do cartão.`);
        const falta=cell?.querySelector('[data-quadro-sem-anterior]');
        if(col==='anterior' && ((!esperado)!==!!falta || falta&&normal(falta.textContent)!==q.semAnterior))erros.push(`Q5 ${id}: sem anterior indevido ou ausência não declarada.`);
        if(!esperado){
          if(textoSemAviso(cell)!==(col==='anterior'?q.semAnterior:''))erros.push(`Q2 ${id} ${col}: texto extra na ausência.`);
          continue;
        }
        const resto=parse(cell.outerHTML);
        resto.querySelectorAll('[data-claim], [data-unidade-da-casa], [data-linha-campo="unit"], [data-de-campo="reference_date"], .src-chip, .quadro-rotulo, [data-aviso-revisao], .claim-provisorio').forEach(n=>n.remove());
        if(normal(resto.textContent)!=='·')erros.push(`Q2 ${id} ${col}: texto extra na célula.`);
        const nota=cell.querySelector('.claim-provisorio');
        const original=col==='portugal'?cartao.querySelector('.cartao-medida-valor .claim-provisorio'):cartao.querySelector(`[data-regua="${col}"] .claim-provisorio`);
        if(normal(nota?.textContent)!==normal(original?.textContent))erros.push(`Q2 ${id} ${col}: nota da fonte diferente.`);
        const c=livroDoQuadro().get(esperado),v=valores[0];
        if(!c||!v||numero(v.textContent)!==numero(c.value))erros.push(`Q2 ${id} ${col}: valor difere do livro.`);
        const periodo=cell.querySelector(`[data-de-linha="${esperado}"][data-de-campo="reference_date"]`);
        if(!periodo||normal(periodo.textContent)!==normal(dataDaCasa(c.reference_date,lang)))erros.push(`Q2 ${id} ${col}: período difere do livro.`);
        const unidade=cell.querySelector('[data-unidade-da-casa], [data-linha-campo="unit"]');
        const u=col==='portugal'?cartao.querySelector('.cartao-medida-quantidade [data-unidade-da-casa], .cartao-medida-quantidade [data-linha-campo="unit"]')?.textContent:unidadeDaLinha(c.unit,lang,c.value).texto;
        if(normal(unidade?.textContent)!==normal(u))erros.push(`Q2 ${id} ${col}: unidade diferente.`);
        const selo=cell.querySelector('.src-chip');
        if(selo?.getAttribute('href')!==caminho(esperado,lang)||cell.querySelectorAll('.src-chip').length!==1)erros.push(`Q2 ${id} ${col}: selo diferente.`);
        if(selo&&periodo&&cell.outerHTML.indexOf(selo.outerHTML)<cell.outerHTML.indexOf(periodo.outerHTML))erros.push(`Q2 ${id} ${col}: selo interrompe a medida.`);
      }
      if(textoSemAviso(row.querySelector('[data-quadro-coluna="referencia"]'))!==textoSemAviso(cartao.querySelector('[data-regua="referencia"]')))erros.push(`Q2 ${id}: referência diferente do cartão.`);
    }
  }
  const sobra=parse(parte.outerHTML);
  sobra.querySelectorAll('h2, h3, thead, [data-quadro-medida]').forEach(n=>n.remove());
  if(normal(sobra.textContent))erros.push('Q2: texto extra fora das linhas.');
  return {erros,portas:erros.length?new Set():portas};
}
export function* paginas(dir,prefix=''){
 for(const e of fs.readdirSync(path.join(dir,prefix),{withFileTypes:true})){const p=path.join(prefix,e.name);if(e.isDirectory())yield*paginas(dir,p);else if(e.name.endsWith('.html'))yield p;}
}
export function conferirDist(dist='dist'){
 const erros=[],pendentes=revisoesPorAplicar();let avisos=0,formas=0;
 const pontosPendentes=[...linhasDosPontos()].filter(([,id])=>pendentes.has(id)).map(([chave])=>chave);
 for(const rel of paginas(dist)){
  const html=fs.readFileSync(path.join(dist,rel),'utf8');
  if(!html.includes('data-aviso-revisao')&&!html.includes('data-quadro-pais')&&![...pendentes.keys()].some(id=>html.includes(`data-claim="${id}"`))&&!pontosPendentes.some(p=>html.includes(p)))continue;
  const root=parse(html),lang=rel.startsWith('en/')?'en':'pt';
  if(['temas/index.html','en/themes/index.html'].includes(rel))erros.push(...conferirQuadro(root,lang,{dist}).erros.map(e=>`${rel}: ${e}`));
  const r=conferirAvisos(root,lang,{pendentes});erros.push(...r.erros.map(e=>`${rel}: ${e}`));avisos+=r.nos.size;formas++;
 }
 for(const rel of ['temas/index.html','en/themes/index.html'])if(!fs.readFileSync(path.join(dist,rel),'utf8').includes('data-quadro-pais'))erros.push(`Q1 ${rel}: quadro em falta.`);
 return {erros,avisos,paginas:formas,pendentes:[...pendentes.keys()]};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const r=conferirDist(process.env.OEDP_DIST??'dist');for(const e of r.erros)console.error(e);console.log(JSON.stringify({...r,erros:r.erros.length}));process.exitCode=r.erros.length?1:0;
}

/** As réguas da voz e da L1 só retiram nós depois de conferir a forma inteira. */
export function superficieDoQuadro(root,lang,opcoes={}) {
 const avisos=conferirAvisos(root,lang,{exigir:false}),nos=new Set(avisos.nos),portas=new Set(avisos.portas),erros=[...avisos.erros];
 if(root.querySelector('[data-quadro-pais]')){
  const q=conferirQuadro(root,lang,opcoes);erros.push(...q.erros);
  if(!q.erros.length){const quadro=root.querySelector('[data-quadro-pais]');nos.add(quadro);for(const a of q.portas)portas.add(a);for(const a of quadro.querySelectorAll('.src-chip'))portas.add(a);}
 }
 return {erros,nos:erros.length?new Set():nos,portas:erros.length?new Set():portas};
}
export function campoDoAviso(el,lang) {
 const aviso=el.closest('[data-aviso-revisao]');
 if(!aviso || aviso.getAttribute('data-aviso-revisao')!==el.getAttribute('data-linha-claim'))return false;
 return conferirAvisos(parse(aviso.outerHTML),lang,{exigir:false}).erros.length===0;
}
