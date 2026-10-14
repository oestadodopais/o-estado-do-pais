/** Palavras simples em ordem, uma vez cada, nas famílias da Saúde. */
export function conferirPalavrasSaude(root,id,lang) {
 if(!id.startsWith('oe-2027-saude-')&&!id.startsWith('afirmacao-leitao-')&&!id.startsWith('afirmacao-rtp-'))return [];
 const t=(root.querySelector('.linha-o-que-e-frase')?.textContent??'').replace(/\s+/g,' ');
 const partes=lang==='pt'?['«Consolidada» é a despesa do programa depois de retirados os pagamentos entre as suas próprias entidades, para o mesmo euro não contar duas vezes.','«Efetiva» é a despesa que sai de facto, sem operações financeiras; a despesa total inclui essas operações.']:['“Consolidated” means programme expenditure after removing payments between its own entities, so the same euro is not counted twice.','“Effective” means money actually spent, excluding financial transactions; total expenditure includes those transactions.'];
 if(partes.some(p=>t.split(p).length!==2)||t.indexOf(partes[0])>t.indexOf(partes[1])||!root.querySelector('[data-def-origem="v2a-saude-consolidada"]')||!root.querySelector('[data-def-origem="v2a-total-efetiva"]'))return ['V2AH Saúde: faltam palavras simples, ordem ou apoio da consolidação e da despesa efetiva'];
 return [];
}
