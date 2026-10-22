/** HB1-c2: as frases desta metade como as edições as imprimem e as definições declaradas de seis famílias. */
import fs from 'node:fs';
import {FAMILIAS_DAS_LINHAS} from '../../../../../src/data/o-que-e-das-familias.mjs';
const sai={frases:{},definicoes:{}};
const limpa=t=>t.replace(/<[^>]+>/g,'').replace(/\s+/g,' ');
for(const l of ['pt','en']) {
  const h=limpa(fs.readFileSync(`studies-src/a-casa-em-portugal-e-na-europa/${l}.html`,'utf8'));
  const procura={pt:['segundo José Soeiro','Nenhuma destas contagens','avisou que','o relatório não define a palavra','o documento não diz como chegou'],en:['according to José Soeiro','None of these counts','warned that','the report does not define the word','the document does not say how it reached']}[l];
  sai.frases[l]=procura.map(p=>{const i=h.indexOf(p);return {procura:p,encontrada:i>=0,texto:i>=0?h.slice(Math.max(0,i-60),i+260):null};});
}
const ids=['hab-ilc-lvho07c-a-pc-total-pt-2025','hab-prc-hpi-q-q-total-i15-q-pt-2026-q2','hab-tipsho60-a-ptir-i15-pt-2024','hab-yth-demo-030-a-avg-t-pt-2025','hab-ilc-mdho06a-a-pc-total-t-total-pt-2023','der-hab-licencas-por-mil-pt-2025'];
for(const id of ids){const f=FAMILIAS_DAS_LINHAS[id];sai.definicoes[id]=f?{pt:f.frase.pt.join(''),en:f.frase.en.join(''),origens:f.origens??[],complemento:f.complemento??null}:null;}
const semDefinicao=Object.entries(FAMILIAS_DAS_LINHAS).filter(([k,f])=>/^(hab|der-hab)-/.test(k)&&/^(A medida mostra|The measure shows|A conta calcula)/.test(f.frase?.pt?.join('')??'')).map(([k])=>k);
sai.ainda_com_o_rotulo={contagem:semDefinicao.length,linhas:semDefinicao};
fs.writeFileSync(new URL('./frases-hb1c2.json',import.meta.url),JSON.stringify(sai,null,2)+'\n');
console.log(JSON.stringify({frases:Object.fromEntries(Object.entries(sai.frases).map(([l,v])=>[l,v.filter(x=>x.encontrada).length+'/'+v.length])),definicoes:Object.values(sai.definicoes).filter(Boolean).length,ainda_com_o_rotulo:semDefinicao.length}));
