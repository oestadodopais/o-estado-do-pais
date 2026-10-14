/** Os apoios V2-a vêm do mesmo pacote de provas seladas das células. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const path='ledger/provas/v2a/provas.json';
const chaves=new Set(Object.keys(JSON.parse(fs.readFileSync(path)).apoios??{}));
export const eOrigemV2A=chave=>chaves.has(chave);
export function conferirOrigemV2A(chave,origem) {
 const bytes=fs.readFileSync(path),r=JSON.parse(fs.readFileSync('ledger/cruzamentos/v2a-provas.json')).files['provas.json'];
 const hash=createHash('sha256').update(bytes).digest('hex');
 if(r.exported_sha256!==hash||r.origin_sha256!==hash||r.origin_path!=='publisher/recortes/v2a/provas.json')return 'V2AE origem: pacote diferente do cruzamento';
 if(chave==='v2a-prr-saude'&&origem?.excertoAberto!==true)return 'V2AF origem: passagem da Saúde fechada';
 if(origem?.tipo!=='passagem')return 'V2AF origem: apoio sem tipo de passagem';
 const a=JSON.parse(bytes).apoios[chave],s=origem?.selo;
 if(['documento_en','publicador_en','quadro'].some(k=>origem?.[k]!==a?.[k]))return 'V2AG origem: campo do apoio diferente da prova';
 if(!a||!s||s.tipo!=='v2a')return 'V2AE origem: selo documental ausente';
 if(s.sha256!==a.sha256||s.motor!==a.motor_path||s.hora!==a.acedido_em||s.cliente!==a.cliente||s.campo!=='página física '+a.pagina_pdf)return 'V2AE origem: selo diferente do recibo exportado';
 if(origem.excerto!==a.excerto||origem.extracao?.pagina!==a.pagina_pdf||origem.lido!==a.acedido_em.slice(0,10)||origem.url!==a.pedido+'#page='+a.pagina_pdf||origem.publicador!=='Ministério das Finanças'||origem.documento!==`Orçamento do Estado para 2027, p. ${a.pagina_pdf} do PDF (${a.pagina_impressa} impressa)`)return 'V2AE origem: excerto ou localizador diferente da prova';
 return null;
}
