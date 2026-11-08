import {partesComMedida} from '../../src/lib/posicao-do-selo.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {partesDaCorrecao} from '../../src/lib/texto-correcao.mjs';
const claims=loadClaims();
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function fraseHtml(c,lang){return partesComMedida(partesDaCorrecao(c,lang)).map(p=>typeof p==='string'?esc(p):p.claim?`<span data-claim="${p.claim}">${esc(String(claims.get(p.claim).value))}</span>${esc(p.sufixo??'')}${esc(p.cauda??'')}<a class="src-chip" href="${lang==='pt'?'/livro-razao/':'/en/ledger/'}${p.claim}">fonte</a>`:p.data?`<span data-nonledger="data-da-linha" data-de-linha="${p.data.id}" data-de-campo="${p.data.campo}">${p.data.valor}</span><a class="src-chip" href="${lang==='pt'?'/livro-razao/':'/en/ledger/'}${p.data.id}">fonte</a>`:`<span lang="pt-PT">${esc(p.termo)}</span>`).join('');}
