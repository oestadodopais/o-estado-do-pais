import {corpoDocumentalJulgado} from './corpo-documental-julgado.mjs';
/** C1: o corpo alojado conserva o caminho e o resumo da linha de origem. */
/** @param {any} registo @param {any} figura */
export function corpoDocumentalConferido(registo,figura){
 const corpo=figura.source_body;
 const documento=(registo.proof_rows?.[figura.row]??registo.documentary_rows?.[figura.row])?.document;
 return corpoDocumentalJulgado(registo,figura) || typeof corpo==='string'&&corpo.startsWith('content/')&&!corpo.split('/').includes('..')&&documento?.file===corpo&&documento?.source_sha256===figura.source_sha256;
}
