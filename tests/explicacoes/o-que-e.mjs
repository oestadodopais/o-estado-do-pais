/** EX2: a frase de cada mudança é a do recibo; o estado vem da auditoria, nunca da marca da página. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { conferirAuditoriaDasFamilias } from '../cartao/familias.mjs';
import { nomeNaLista } from '../../src/lib/primeira-pagina.mjs';
import { t } from '../../src/i18n/strings.mjs';

const normal = s => String(s ?? '').replace(/\s+/g, ' ').trim();
const numero = s => Number(normal(s).replaceAll(' ', '').replace('−','-').replace(',','.'));
export const MARCAS_O_QUE_E = '[data-o-que-e], [data-o-que-e-por-confirmar]';
let auditoria;
function estado() { return auditoria ??= conferirAuditoriaDasFamilias(); }

/** A célula deriva os grupos das linhas, sem ler uma declaração de grupo da página. */
function gruposDasEntradas(entradas, lang) {
  const grupos=[];
  for (const e of entradas) {
    const id=e.getAttribute('data-correcao-entrada'), nome=nomeNaLista(id,lang);
    const chave=JSON.stringify(nome);
    if(grupos.at(-1)?.chave===chave) grupos.at(-1).entradas.push(e);
    else grupos.push({chave,entradas:[e]});
  }
  return grupos;
}

/** A identidade e a quantidade são também lidas pelo portão de HTML. */
export function contarFrasesDasMudancas(root, rota, lang = root.querySelector('html')?.getAttribute('lang')?.startsWith('en') ? 'en' : 'pt') {
  if (!['leituraDaSemana','indice'].includes(rota)) return {erros:[], entradas:[], grupos:[], frases:0, ausencias:0};
  const candidatas = root.querySelectorAll(rota === 'leituraDaSemana'
    ? 'main [data-semana-mudancas] > [data-semana-mudanca]'
    : 'main [data-mudou-ambito="indice"] > [data-correcao-entrada]');
  const entradas = candidatas.filter(e => rota === 'leituraDaSemana' || numero(e.querySelector('[data-correcao-campo="old_value"]')?.textContent) !== numero(e.querySelector('[data-correcao-campo="new_value"]')?.textContent));
  const erros = [], vistos = new Set(), grupos=gruposDasEntradas(entradas,lang);
  let frases=0, ausencias=0;
  for (const grupo of grupos) {
    const ultima=grupo.entradas.at(-1), id=ultima.getAttribute('data-correcao-entrada');
    const marcas=grupo.entradas.flatMap(e=>e.querySelectorAll(MARCAS_O_QUE_E));
    if (marcas.length!==1) erros.push(`EX2 · ${id}: o grupo tem ${marcas.length} frases ou ausências; exige uma por grupo, sob a última mudança`);
    for (const m of marcas) {
      vistos.add(m);
      const chave=m.hasAttribute('data-o-que-e')?'data-o-que-e':'data-o-que-e-por-confirmar';
      if (m.hasAttribute('data-o-que-e') && m.hasAttribute('data-o-que-e-por-confirmar')) erros.push(`EX2 · ${id}: a frase e a ausência estão marcadas ao mesmo tempo`);
      if (m.getAttribute(chave)!==id || m.rawTagName!=='p' || !normal(m.textContent)) erros.push(`EX2 · ${id}: a frase ou ausência não é um parágrafo da própria linha`);
      if(m.parentNode!==ultima) erros.push(`EX2 · ${id}: a definição não está sob a última mudança do grupo`);
      if (chave==='data-o-que-e') frases++; else ausencias++;
    }
  }
  for (const m of root.querySelectorAll(MARCAS_O_QUE_E)) if (!vistos.has(m)) erros.push('EX2 · uma frase ou ausência está fora de uma mudança de valor');
  return {erros,entradas,grupos,frases,ausencias};
}

/** Uma marca só sai do inventário onde a W4 confere a frase inteira. */
export function marcaOQueEComparada(el, rota) {
  if (!['indice','leituraDaSemana'].includes(rota) || !el.matches(MARCAS_O_QUE_E+', [data-o-que-e-sinal]') || el.rawTagName!=='p') return false;
  const e=el.closest('[data-correcao-entrada]');
  return el.parentNode===e && Boolean(e?.parentNode?.matches(rota==='indice'?'main [data-mudou-ambito="indice"]':'main [data-semana-mudancas]'));
}

/** Um valor da definição só reutiliza o selo visível do resumo da própria mudança. */
export function seloDaDefinicaoNaMudanca(el, id, rota, alvo) {
  const p=el.closest('p[data-o-que-e]');
  if (!p || !marcaOQueEComparada(p,rota) || p.getAttribute('data-o-que-e')!==id || p.hasAttribute('data-o-que-e-por-confirmar')) return false;
  const entrada=p.closest('[data-correcao-entrada]');
  if (entrada.getAttribute('data-correcao-entrada')!==id) return false;
  const resumo=entrada.querySelector(rota==='leituraDaSemana'?'p[data-semana-resumo]':'p.lugar-mudou-o-que');
  return Boolean(resumo?.querySelectorAll('a.src-chip').some(a=>a.getAttribute('href')===alvo));
}

export function errosDoSeloDaDefinicao(el,id,rota,alvo) {
  return seloDaDefinicaoNaMudanca(el,id,rota,alvo)?[]:[`o valor da afirmação "${id}" aparece sem selo para a sua própria linha na definição da mudança.`];
}

export function plantasDoSeloDaDefinicao() {
  const plantas=[];
  for(const rota of ['leituraDaSemana','indice']) {
    const alvo='/livro-razao/linha-da-planta';
    const html=`<main><ol ${rota==='indice'?'data-mudou-ambito="indice"':'data-semana-mudancas'}><li data-correcao-entrada="linha-da-planta"><p data-semana-resumo class="lugar-mudou-o-que"><a class="src-chip" href="${alvo}">Fonte</a></p><p data-o-que-e="linha-da-planta"><span data-claim="linha-da-planta">1</span></p></li></ol></main>`;
    const confere=r=>errosDoSeloDaDefinicao(r.querySelector('[data-claim]'),'linha-da-planta',rota,alvo);
    for(const [nome,estraga] of [
      ['selo retirado',r=>r.querySelector('a').remove()],
      ['selo de outra linha',r=>r.querySelector('a').setAttribute('href','/livro-razao/outra-linha')],
      ['selo de outra edição',r=>r.querySelector('a').setAttribute('href','/en/ledger/linha-da-planta')],
      ['definição de outra linha',r=>r.querySelector('[data-o-que-e]').setAttribute('data-o-que-e','outra-linha')],
      ['entrada de outra linha',r=>r.querySelector('li').setAttribute('data-correcao-entrada','outra-linha')],
      ['selo fora do resumo',r=>{const a=r.querySelector('a');r.querySelector('li').insertAdjacentHTML('beforeend',a.outerHTML);a.remove();}],
      ['frase fora da lista',r=>r.querySelector('ol').removeAttribute(rota==='indice'?'data-mudou-ambito':'data-semana-mudancas')],
    ]) {
      const r=parse(html),controlo=confere(r);estraga(r);
      const mensagem='o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha';
      plantas.push({nome:`${nome}, ${rota}`,mordeu:!controlo.length&&confere(r).some(q=>q.includes(mensagem)),mensagem,queixa:confere(r).join(' | ')});
    }
  }
  return plantas;
}

/** O texto e as identidades dos pedaços copiados, sem introduzir selos. */
function assinatura(el) {
  return el.querySelectorAll('[data-claim], [data-nonledger], [data-linha-campo], [lang]').map(x =>
    [Object.fromEntries(Object.entries(x.attributes).filter(([k]) => k.startsWith('data-') || k==='lang').sort()), normal(x.textContent)]);
}

export function conferirOQueENasMudancas(root, lang, rota, dist, prova = estado()) {
  const conta=contarFrasesDasMudancas(root,rota);
  const erros=[...conta.erros,...prova.erros];
  const sinaisVistos=new Set();
  for(const grupo of conta.grupos) {
    const e=grupo.entradas.at(-1), sinaisEsperados=[];
    const frase=e.querySelector('[data-o-que-e]'), ausencia=e.querySelector('[data-o-que-e-por-confirmar]');
    for(const entrada of grupo.entradas) {
      const id=entrada.getAttribute('data-correcao-entrada');
      if (prova.porConfirmar.has(id)) {
        if(frase || !ausencia || normal(ausencia.textContent)!==t(lang).semana.oQueEPorConfirmar) erros.push(`W4 · ${id}: a frase está por confirmar na fonte; exige a ausência e recusa a frase`);
      } else {
        if(ausencia || !frase) {erros.push(`W4 · ${id}: a frase confirmada tem de aparecer, sem ausência`);continue;}
        const ficheiro=path.join(dist,lang==='en'?'en/ledger':'livro-razao',id,'index.html');
        if(!fs.existsSync(ficheiro)){erros.push(`W4 · ${id}: falta o recibo da mesma edição`);continue;}
        const recibo=parse(fs.readFileSync(ficheiro,'utf8'));
        const original=recibo.querySelector(`[data-o-que-e="${id}"] [data-o-que-e-parte="o-que-e"]`);
        if(!original || original.querySelector('[data-por-confirmar-na-fonte]') || normal(frase.textContent)!==normal(original.textContent)) erros.push(`W4 · ${id}: a frase mostrada não é a do recibo da mesma linha e edição`);
        else if(JSON.stringify(assinatura(frase))!==JSON.stringify(assinatura(original))) erros.push(`W4 · ${id}: os pedaços marcados da frase não são os do recibo`);
        const sinal=recibo.querySelector(`[data-o-que-e="${id}"] [data-o-que-e-parte="sinal"]`);
        if(sinal && !sinaisEsperados.some(x=>normal(x.el.textContent)===normal(sinal.textContent))) sinaisEsperados.push({id,el:sinal});
      }
    }
    const sinais=grupo.entradas.flatMap(x=>x.querySelectorAll('[data-o-que-e-sinal]'));
    if(sinais.length!==sinaisEsperados.length) erros.push('W4 · o grupo não tem os sinais dos recibos, uma vez cada');
    for(const [i,sinal] of sinais.entries()) {
      sinaisVistos.add(sinal);
      const esperado=sinaisEsperados[i];
      if(!esperado || sinal.getAttribute('data-o-que-e-sinal')!==esperado.id || normal(sinal.textContent)!==normal(esperado.el.textContent) || JSON.stringify(assinatura(sinal))!==JSON.stringify(assinatura(esperado.el))) erros.push('W4 · o sinal mostrado não é o do recibo da mesma linha e edição');
      if(sinal.parentNode!==e || !frase || e.childNodes.indexOf(sinal)<e.childNodes.indexOf(frase)) erros.push('W4 · o sinal não está a seguir à definição do grupo');
    }
    if(e.querySelectorAll('[data-o-que-e] a, [data-o-que-e-por-confirmar] a, [data-o-que-e-sinal] a').length) erros.push('W4 · a frase, o sinal ou a ausência não pode acrescentar uma porta');
  }
  for(const sinal of root.querySelectorAll('[data-o-que-e-sinal]')) if(!sinaisVistos.has(sinal)) erros.push('W4 · um sinal está fora de um grupo de mudanças');
  return erros;
}

/** Plantas em memória: os recibos reais fornecem tanto a frase confirmada como a marcada. */
export function plantasDoOQueE(dist) {
  const prova=estado(), plantas=[];
  for(const [lang,f,rota] of [['pt','explicacoes/leitura-da-semana/index.html','leituraDaSemana'],['en','en/explainers/weekly-reading/index.html','leituraDaSemana'],['pt','indice/index.html','indice'],['en','en/index/index.html','indice']]) {
    const html=fs.readFileSync(path.join(dist,f),'utf8');
    const controlo=conferirOQueENasMudancas(parse(html),lang,rota,dist,prova);
    const raiz=parse(html), original=raiz.querySelector('main [data-o-que-e]');
    const regista=(nome,base,estraga,mensagem) => {
      const r=parse(base), limpo=conferirOQueENasMudancas(r,lang,rota,dist,prova);
      estraga(r);
      const q=conferirOQueENasMudancas(r,lang,rota,dist,prova);
      plantas.push({nome:`${nome}, ${rota}, ${lang}`,mensagem,queixa:q.join(' | '),mordeu:!controlo.length&&!limpo.length&&q.some(x=>x.includes(mensagem))});
    };
    if(original) {
      regista('uma palavra trocada na frase',html,r=>{const p=r.querySelector('main [data-o-que-e]');p.set_content('Ontem, '+p.innerHTML);},'a frase mostrada não é a do recibo');
      regista('uma frase retirada',html,r=>r.querySelector('main [data-o-que-e]').remove(),'exige uma');
      regista('a frase de outra linha',html,r=>r.querySelector('main [data-o-que-e]').setAttribute('data-o-que-e','outra-linha'),'não é um parágrafo da própria linha');
      regista('uma ausência numa frase confirmada',html,r=>{const p=r.querySelector('main [data-o-que-e]'),id=p.getAttribute('data-o-que-e');p.removeAttribute('data-o-que-e');p.setAttribute('data-o-que-e-por-confirmar',id);p.set_content(t(lang).semana.oQueEPorConfirmar);},'a frase confirmada tem de aparecer');
    }
    const grupos=contarFrasesDasMudancas(raiz,rota,lang).grupos;
    const repetido=grupos.find(g=>g.entradas.length>1);
    if(repetido) {
      const primeiro=repetido.entradas[0].getAttribute('data-correcao-entrada'), ultimo=repetido.entradas.at(-1).getAttribute('data-correcao-entrada');
      regista('a definição repetida no grupo',html,r=>{const frase=r.querySelector(`[data-correcao-entrada="${ultimo}"] [data-o-que-e]`);r.querySelector(`[data-correcao-entrada="${primeiro}"]`).insertAdjacentHTML('beforeend',frase.outerHTML);},'exige uma por grupo');
      regista('a definição em falta no grupo',html,r=>r.querySelector(`[data-correcao-entrada="${ultimo}"] [data-o-que-e]`).remove(),'exige uma por grupo');
    }
    if(raiz.querySelector('[data-o-que-e-sinal]')) {
      regista('uma palavra trocada no sinal',html,r=>r.querySelector('[data-o-que-e-sinal]').set_content('Ontem.'),'o sinal mostrado não é o do recibo');
      regista('o sinal em falta no grupo',html,r=>r.querySelector('[data-o-que-e-sinal]').remove(),'o grupo não tem os sinais dos recibos');
    }
    const id=[...prova.porConfirmar][0];
    if(!id) throw Error('W4 · a planta exige uma linha realmente marcada pela auditoria');
    const recibo=parse(fs.readFileSync(path.join(dist,lang==='en'?'en/ledger':'livro-razao',id,'index.html'),'utf8'));
    const frase=recibo.querySelector('[data-o-que-e-parte="o-que-e"]');
    frase.querySelectorAll('[data-por-confirmar-na-fonte]').forEach(x=>x.remove());
    const item=`<li data-correcao-entrada="${id}" data-semana-mudanca="${id}"><span data-correcao-campo="old_value">1</span><span data-correcao-campo="new_value">2</span><p data-o-que-e-por-confirmar="${id}">${t(lang).semana.oQueEPorConfirmar}</p></li>`;
    const base=`<main><ol ${rota==='indice'?'data-mudou-ambito="indice"':'data-semana-mudancas'}>${item}</ol></main>`;
    regista('uma frase por confirmar publicada',base,r=>{const p=r.querySelector('p');p.removeAttribute('data-o-que-e-por-confirmar');p.setAttribute('data-o-que-e',id);p.set_content(frase.innerHTML);},'a frase está por confirmar na fonte; exige a ausência e recusa a frase');
    regista('a ausência por confirmar retirada',base,r=>r.querySelector('p').remove(),'exige uma');
    regista('a ausência por confirmar com palavras trocadas',base,r=>r.querySelector('p').set_content('Já foi confirmada.'),'a frase está por confirmar na fonte; exige a ausência e recusa a frase');
    regista('uma frase fora da lista',html,r=>r.querySelector('main').insertAdjacentHTML('beforeend',`<p data-o-que-e="${id}">Palavras sem conferência.</p>`),'uma frase ou ausência está fora de uma mudança de valor');
  }
  return plantas;
}
