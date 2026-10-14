/** V2AH: redação literal decidida no mandato K, independente do compositor. */
import fs from 'node:fs';
import {getClaim} from '../../src/lib/ledger.mjs';
const frases=JSON.parse(fs.readFileSync(new URL('./v2ai-frases.json',import.meta.url),'utf8'));
const origens=JSON.parse(fs.readFileSync(new URL('../../src/data/origens-v2a.json',import.meta.url),'utf8'));
const normal=s=>String(s??'').replace(/\s+/g,' ').trim();
export function conferirPalavrasSaude(root,id,lang) {
 const saude=id.startsWith('oe-2027-saude-')||id.startsWith('afirmacao-leitao-')||id.startsWith('afirmacao-rtp-');
 const road=id.startsWith('oe-2027-ppp-rodoviario-'),total=id==='oe-2027-ppp-total-encargos-liquidos-2027',pcp=id.startsWith('afirmacao-pcp-');
 if(!saude&&!road&&!total&&!pcp)return [];
 const tipo=saude?'saude':road?'road':total?'total':'pcp';
 const campos={excerto:getClaim(id).excerpt,valor:getClaim(id).value,periodo:getClaim('oe-2027-ppp-rodoviario-encargos-brutos-2027').reference_date,quadro:origens[saude?'v2a-saude-consolidada':'v2a-ppp-setores'].quadro,documento:origens['v2a-ppp-setores'].documento,documento_en:origens['v2a-ppp-setores'].documento_en,pagina:origens['v2a-ppp-setores'].pagina_pdf};
 for(const campo of ['encargos-brutos-2027','receitas-2027','encargos-liquidos-2027'])campos[campo]=getClaim('oe-2027-ppp-rodoviario-'+campo).value;
 const esperado=normal(frases[tipo][lang].replace(/\{([^}]+)\}/g,(_,k)=>campos[k]));
 const bloco=root.querySelector(road?'[data-v2a-conta]':'.linha-o-que-e-frase');
 const texto=normal(bloco?.textContent),erros=[];
 const partesSaude=esperado.split(lang==='pt'?' «Efetiva»':' «Effective»');
 const repetida=saude&&(texto.split(partesSaude[0]).length!==2||texto.split(partesSaude[1]).length!==2);
 if(saude?(texto.split(esperado).length!==2||repetida||root.querySelector('[data-def-origem="v2a-total-efetiva"]')||!root.querySelector('[data-def-origem="v2a-saude-consolidada"]')):texto!==esperado)erros.push('V2AH '+(saude?'Saúde':'parcerias')+': frase diferente do mandato K ou apoio indevido');
 if(!saude&&(!bloco?.querySelector('[data-verbatim="origem-v2a-ppp-conta-pagina_pdf"]')||normal(bloco.querySelector('[data-verbatim="origem-v2a-ppp-conta-pagina_pdf"]').textContent)!==origens['v2a-ppp-conta'].pagina_pdf))erros.push('V2AI página: localizador rodoviário sem marca do apoio');
 if(saude&&(!bloco?.querySelector('[data-verbatim="origem-v2a-saude-consolidada-quadro"]')||normal(bloco.querySelector('[data-verbatim="origem-v2a-saude-consolidada-quadro"]').textContent)!==origens['v2a-saude-consolidada'].quadro))erros.push('V2AK quadro: Saúde sem marca do apoio');
 return erros;
}
