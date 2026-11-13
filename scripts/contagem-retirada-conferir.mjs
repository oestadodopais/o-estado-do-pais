import {parse} from 'node-html-parser';
import {getClaim} from '../src/lib/ledger.mjs';
import {dataDaCasa} from '../src/lib/datas.mjs';
import {routePath} from '../src/lib/routes.mjs';
import {retiradaDaContagem} from '../src/lib/retirada-da-contagem.mjs';
const normal=s=>s.replace(/\s+/g,' ').trim();
export function conferirContagemEstudos(root,lang,rota) {
  const caixas=root.querySelectorAll('[data-contagem-estudos]'), erros=[], nos=[];
  const id=rota.replace(/^\//,'').replace(/\/$/,'')===(lang==='pt'?'estudos':'en/studies') ? 'estudos-publicados' :
    rota.replace(/^\//,'').replace(/\/$/,'')===(lang==='pt'?'municipios/evora':'en/municipalities/evora') ? 'estudos-evora-publicados' : null;
  if(!id) {if(caixas.length)erros.push('RET1 contagem fora da página declarada');return {erros,nos};}
  if(caixas.length!==1)return {erros:['RET1 contagem ausente ou repetida'],nos};
  const caixa=caixas[0], linha=getClaim(id), retirada=retiradaDaContagem(linha);
  const copia=parse(caixa.outerHTML);
  for(const chip of copia.querySelectorAll('.src-chip'))chip.remove();
  const ps=copia.querySelectorAll('p');
  const esperados=[`${linha.value} ${lang==='pt'?'estudos':'studies'}`];
  if(retirada)esperados.push(`${dataDaCasa(retirada.entrada.date,lang)}: ${retirada.entrada[lang==='pt'?'reason':'reason_en']}`);
  if(caixa.getAttribute('data-contagem-estudos')!==id || ps.length!==esperados.length ||
      ps.some((p,i)=>normal(p.textContent)!==esperados[i]) ||
      normal(copia.textContent)!==normal(ps.map(p=>p.textContent).join('')) ||
      caixa.querySelector('[data-claim]')?.getAttribute('data-claim')!==id ||
      !caixa.querySelectorAll('.src-chip').some(a=>a.getAttribute('href')===routePath('linha',lang,{slug:id})) ||
      (retirada && (caixa.querySelector('[data-contagem-retirada] a')?.getAttribute('href')!==routePath('linha',lang,{slug:id}) ||
        caixa.getAttribute('data-correcao-entrada')!==id))) erros.push('RET1 contagem, motivo, data ou recibo diferente da linha');
  if(!erros.length)nos.push(caixa);
  return {erros,nos};
}
