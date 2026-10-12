/** Cópia documental já alojada: prova local explícita, sem simular um acesso HTTP. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const caminho=new URL('../../src/data/pensao-rp4n.json',import.meta.url);
export function conferirOrigemLocal(chave,origem) {
 const bytes=fs.readFileSync(caminho),fontes=JSON.parse(bytes);
 if(!Object.hasOwn(fontes,chave))return null;
 const r=JSON.parse(fs.readFileSync(new URL('../../ledger/cruzamentos/pensao-rp4n.json',import.meta.url))).files['pensao-rp4n.json'];
 const h=createHash('sha256').update(bytes).digest('hex');
 if(r.exported_sha256!==h||r.origin_sha256!==h||r.origin_path!=='content/13 Dominios/pensao-rp4n.json')return 'a cópia documental local difere da travessia';
 if(JSON.stringify(origem)!==JSON.stringify(fontes[chave])||origem?.alojada?.modo!=='copia-local'||!origem?.alojada?.pagina||!origem?.excerto)return 'o excerto local difere da leitura da página alojada';
 return null;
}
export const chavesLocais=()=>Object.keys(JSON.parse(fs.readFileSync(caminho)));
