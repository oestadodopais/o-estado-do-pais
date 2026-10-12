/** Cópia documental já alojada: prova local explícita, sem simular um acesso HTTP. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const caminho=new URL('../../src/data/pensao-rp4n.json',import.meta.url);
export function conferirDataLocal(origem) {
 const p=origem?.alojada?.prova_data;
 if(!p || p.data!==origem.lido || !/^\d{4}-\d{2}-\d{2}$/.test(origem.lido))return 'a data local não tem prova de leitura ou alojamento';
 if(p.tipo==='hosted-copy') {
  const r=p.registo;
  if(!r || !/^[0-9a-f]{40}$/.test(r.commit??'') || !/^[0-9a-f]{64}$/.test(r.manifesto_sha256??'') || r.manifesto!=='content/11 Seguranca Social/source/MANIFEST.sha256' || !r.ficheiro)return 'a data de alojamento não aponta para o manifesto do commit';
 } else if(p.tipo!=='source-read' || typeof p.registo!=='string' || !p.registo.endsWith('.json'))return 'a data local não distingue alojamento de leitura';
 return null;
}
export function conferirOrigemLocal(chave,origem) {
 const bytes=fs.readFileSync(caminho),fontes=JSON.parse(bytes);
 if(!Object.hasOwn(fontes,chave))return null;
 const r=JSON.parse(fs.readFileSync(new URL('../../ledger/cruzamentos/pensao-rp4n.json',import.meta.url))).files['pensao-rp4n.json'];
 const h=createHash('sha256').update(bytes).digest('hex');
 if(r.exported_sha256!==h||r.origin_sha256!==h||r.origin_path!=='content/13 Dominios/pensao-rp4n.json')return 'a cópia documental local difere da travessia';
 if(JSON.stringify(origem)!==JSON.stringify(fontes[chave])||origem?.alojada?.modo!=='copia-local'||!origem?.alojada?.pagina||!origem?.excerto)return 'o excerto local difere da leitura da página alojada';
 const data=conferirDataLocal(origem);if(data)return data;
 return null;
}
export const chavesLocais=()=>Object.keys(JSON.parse(fs.readFileSync(caminho)));
