/** ED1-F: só as formas integrais da faixa admitem o fragmento retirado. */
import {fraseRetiradaNoTexto} from './titulos-publicados.mjs';
import {elementosDaLinha,manifestoEd2,mudancasNoManifesto,publicacaoNoPortao,conferirLinhaDasEdicoes} from './edicoes-linha-conferir.mjs';
/** O repertório sai das versões declaradas, sem importar a composição da vista.
 * Uma palavra nova, outra ordem ou outra quantidade não se acrescenta por expressão regular. */
export function repertorioDaVozDasEdicoes(manifesto=manifestoEd2){
 const frases=new Set(),porLingua={pt:new Set(),en:new Set()};
 for(const e of manifesto.edicoes)for(const lang of ['pt','en']){
  const pt=lang==='pt',vs=e.edicoes,mudancas=mudancasNoManifesto(e.slug,e.lang,manifesto);
  if(vs.length>1){
   for(const data of [null,...vs.map(v=>v.data)]){
    const itens=elementosDaLinha(manifesto,e.slug,e.lang,data,lang);
    const forma=itens.map(i=>i.rotulo+i.estado).join(' · ');
    porLingua[lang].add(forma);frases.add(forma);
    frases.add(itens.map(i=>`${i.rotulo} ${i.data.split('-').reverse().join('.')}${i.estado}`).join(' · '));
    for(const i of itens){frases.add(i.rotulo);if(i.estado)frases.add(i.estado.trim());frases.add(i.data.split('-').reverse().join('.'));}
   }
  }else{
   let forma='';
   if(publicacaoNoPortao(e.slug,e.lang))forma+=` · ${pt?'publicado a':'published on'}`;
   for(const m of mudancas)forma+=` · ${m.natureza==='atualizacao'?(pt?'atualizado a':'updated on'):(pt?'corrigido a':'corrected on')}`;
   if(mudancas.length){forma=forma.trim();porLingua[lang].add(forma);frases.add(forma);}
  }
 }
 return {frases,faixas:new Map([
  ['publicado a ·',porLingua.pt],['published on ·',porLingua.en],
  ['Edições',new Set()],['Editions',new Set()],
 ])};
}
const repertorio=repertorioDaVozDasEdicoes();
export const FAIXAS_DE_EDICAO=repertorio.faixas;
export function classeDaVozDaEdicao(texto,prova=repertorio){return prova.frases.has(texto)?'conteudo':null;}
export function conferirVozDaLinha(root,manifesto,slug,lang,data=null,linguaPagina=lang){return conferirLinhaDasEdicoes(root,manifesto,slug,lang,data,linguaPagina);}
/** @param {string} texto @param {string} frase @param {Set<string>} admitidas */
export function retiradaForaDaFrase(texto,frase,admitidas=new Set()) {
 return fraseRetiradaNoTexto(texto,frase)&&!admitidas.has(texto);
}
/** A obra citada fica fora da voz; o aviso editorial e as suas portas entram.
 * Não se removem datas nem palavras do aviso, que o portão documental confere.
 * @param {any} root */
export function frasesDaFaixaDocumental(root,manifesto=manifestoEd2) {
 const frases=[];
 for(const faixa of root.querySelectorAll('[data-documento-edicao]')) {
  const [slug,lang,data]=faixa.getAttribute('data-documento-edicao').split('/');
  const erros=conferirVozDaLinha(faixa,manifesto,slug,lang,data);
  if(erros.length)throw Error(erros.join('; '));
  for(const el of faixa.querySelectorAll('p,h1,h2,h3,li,a,[data-voz],[data-edicoes-linha]')) {
   if(el.querySelector('p,h1,h2,h3,li'))continue;
   const frase=el.textContent.replace(/\s+/g,' ').trim();
   if(frase)frases.push(frase);
  }
 }
 return [...new Set(frases)];
}

/** A extração comum da voz conserva os nós de selos e as marcas de língua.
 * @param {any} no */
export function textoDaVoz(no) {
  const partes = /** @type {string[]} */ ([]);
  const anda = (/** @type {any} */ n) => {
    if (!n) return;
    if (n.nodeType === 3) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}

// EVA-T: só a leitura prescrita completa admite o antigo rótulo dentro da prosa.
export const RETIRADAS_EVA = new Map([['Debt limit', new Set(["The Câmara de Évora keeps within the legal debt limit and pays those who sell to it late: days , on average, to pay a supplier in , and euros in overdue payments at the end of that year."])]]);
