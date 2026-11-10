import {dataDaCasa} from '../../src/lib/datas.mjs';
/** A história lê-se no recibo, mesmo quando ainda não há registo público. */
export function conferirProvenienciaNoRecibo(root,linha,lang) {
 const erros=[];
 for(const [n,e] of (linha.corrections??[]).entries()) {
  if(e.kind!=='proveniencia')continue;
  for(const campo of ['old_value','new_value','date','reason','kind']) {
   const no=root.querySelectorAll(`.historico [data-correcao-claim="${linha.id}"][data-correcao-campo="${campo}"]`).find(no=>no.getAttribute('data-correcao-n')===String(n)||(no.getAttribute('data-correcao-grupo')??'').split(' ').includes(String(n)));
   const esperado=campo==='date'?dataDaCasa(e.date):campo==='kind'?(lang==='pt'?'revisão de proveniência':'provenance revision'):campo==='reason'?(lang==='en'?e.reason_en:e.reason):e.field==='access_date'?dataDaCasa(e[campo]):e[campo];
   if(!no||no.textContent!==esperado)erros.push(`REC1 proveniência: ${linha.id}/${n}/${campo} ausente ou diferente no recibo (${lang})`);
  }
 }
 return erros;
}
