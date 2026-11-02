/** PAI1-B: leitor independente do resolvedor para as revisões ainda por aplicar. */
import {parse} from 'node-html-parser';
import {MEDIDA_REUNIDA} from '../src/lib/pais.mjs';
import {nomeNaLista} from '../src/lib/primeira-pagina.mjs';
import {nomeDaLinhaDerivada,nomeDoCartao} from '../src/lib/nomes.mjs';
import {unidadeDaLinha} from '../src/i18n/unidades.mjs';
import {t} from '../src/i18n/strings.mjs';
const normal = s => String(s ?? '').replace(/\s+/g,' ').trim();
const data = s => String(s).replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3.$2.$1');
const relido = s => {
  const v=String(s??''), n=v.replace(/[\s\u202f]/g,'').replace('−','-');
  if(!/^-?\d+(?:[.,]\d+)?$/.test(n)) return v;
  const [a,b]=n.replace(',','.').split('.');
  return a.replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0').replace('-','−')+(b===undefined?'':','+b);
};
export function revisoesPeloLivro(linhas,inicio,fim) {
  const pendentes=[];
  for(const [id,l] of linhas) {
    if(!l || l.study==='o-estado-do-pais' || Object.hasOwn(MEDIDA_REUNIDA,id)) continue;
    let ultima=null;
    for(let n=0;n<(l.verifications??[]).length;n++) {
      const v=l.verifications[n];
      if(v.date<inicio||v.date>fim) continue;
      if(!ultima||v.date>=ultima.data) ultima={linha:id,n,data:v.date,found:String(v.found??''),result:v.result};
    }
    if(!ultima||ultima.result!=='diverge') continue;
    if((l.corrections??[]).some(c=>['correcao','atualizacao'].includes(c.kind)&&c.date>ultima.data)) continue;
    pendentes.push(ultima);
  }
  return pendentes.sort((a,b)=>b.data.localeCompare(a.data)||a.linha.localeCompare(b.linha));
}
export function conferirRevisoes(root,lang,linhas,inicio,fim) {
  const erros=[], esperadas=revisoesPeloLivro(linhas,inicio,fim), c=t(lang).semana;
  const entradas=root.querySelectorAll('main [data-semana-revisoes] > [data-semana-revisao]');
  if(JSON.stringify(entradas.map(e=>e.getAttribute('data-semana-revisao')))!==JSON.stringify(esperadas.map(r=>r.linha))) erros.push('PAI1-B: as revisões por aplicar não correspondem ao livro');
  if(root.querySelectorAll('[data-semana-revisao]').length!==entradas.length) erros.push('PAI1-B: revisão fora da lista conferida');
  const titulo=root.querySelector('main [data-semana-seccao="revisoes"] > h2');
  if(esperadas.length ? normal(titulo?.textContent)!==c.revisoesK : titulo!==null) erros.push('PAI1-B: título das revisões não corresponde à contagem');
  for(const r of esperadas) {
    const e=entradas.find(e=>e.getAttribute('data-semana-revisao')===r.linha); if(!e) continue;
    const l=linhas.get(r.linha), nome=nomeNaLista(r.linha,lang), base=linhas.get(nome.linha);
    const nomeTexto=(nomeDaLinhaDerivada(base,lang) ?? nomeDoCartao(base,lang))?.texto;
    const u=unidadeDaLinha(l.unit,lang);
    const esperado=`${nomeTexto}${nome.qualificador==='ue'?c.virgula+t(lang).cartao.uniaoEuropeia:''}${c.virgula}${data(String(l.reference_date))}${c.publicado}${l.value} ${u.texto}${c.fonteAgora}${relido(r.found)}${c.naReleitura}${data(r.data)}.`;
    const copia=parse(e.outerHTML); copia.querySelectorAll('.src-chip,.claim-provisorio-chip').forEach(n=>n.remove());
    if(normal(copia.textContent)!==normal(esperado)) erros.push(`PAI1-B: frase da revisão difere do livro (${r.linha})`);
    const campo=e.querySelector('[data-linha-campo="unit"]');
    if(campo?.getAttribute('data-linha-claim')!==r.linha||normal(campo?.textContent)!==normal(u.texto)) erros.push(`PAI1-B: unidade de outra linha (${r.linha})`);
    const found=e.querySelector(`[data-linha-campo="verifications.${r.n}.found"]`);
    if(found?.getAttribute('data-linha-claim')!==r.linha||normal(found?.textContent)!==normal(relido(r.found))) erros.push(`PAI1-B: valor relido de outra entrada (${r.linha})`);
    const dia=e.querySelector(`[data-de-campo="verifications.${r.n}.date"]`);
    if(dia?.getAttribute('data-de-linha')!==r.linha||normal(dia?.textContent)!==data(r.data)) erros.push(`PAI1-B: data da releitura errada (${r.linha})`);
  }
  return erros;
}
