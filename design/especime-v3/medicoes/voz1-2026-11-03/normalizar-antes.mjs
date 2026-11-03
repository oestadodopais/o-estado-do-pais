/** Reconta os blocos guardados antes das alterações, pelo âmbito final da régua. */
import fs from 'node:fs';
import {frasesDoTexto} from '../../../../scripts/voz-autorreferencia.mjs';
const pasta=new URL('./',import.meta.url);
const bruto=JSON.parse(fs.readFileSync(new URL('antes-bruto.json',pasta)));
const lista=JSON.parse(fs.readFileSync(new URL('../../../../scripts/voz-ledes.json',pasta)));
const paginas={};
for(const [rota,blocos] of Object.entries(bruto.blocos)){
 // Séries são recibos. Os dois títulos são do índice dos documentos isentos até VOZ-2.
 if(rota.includes('/ledger/series/')||rota.includes('/livro-razao/series/'))continue;
 const frases=blocos.filter(f=>f!=='Porque é que um silêncio aqui não é um silêncio').flatMap(frasesDoTexto);
 if(frases.length)paginas[rota]={frases:[...new Set(frases)]};
}
for(const [rota,blocos] of Object.entries(bruto.complemento)){
 paginas[rota]??={frases:[]};paginas[rota].frases=[...new Set([...paginas[rota].frases,...blocos.flatMap(frasesDoTexto)])];
}
const ledes=Object.fromEntries(Object.entries(bruto.ledes).filter(([r])=>r in lista || ['/a-verificar','/en/to-verify'].includes(r)));
const r={paginasMedidas:bruto.paginas,marcador:bruto.marcador,frasesPorPagina:paginas,ledes,totais:{marcador:bruto.marcador.length,frases:Object.values(paginas).reduce((s,p)=>s+p.frases.length,0),ledes:Object.keys(ledes).length}};
fs.writeFileSync(new URL('antes.json',pasta),JSON.stringify(r,null,2)+'\n');console.log(r.totais);
