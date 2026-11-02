import {partesDaCorrecao} from '../../src/lib/texto-correcao.mjs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function fraseHtml(c,lang){return partesDaCorrecao(c,lang).map(p=>typeof p==='string'?esc(p):p.data?`<span data-nonledger="data-da-linha" data-de-linha="${p.data.id}" data-de-campo="${p.data.campo}">${p.data.valor}</span><a class="src-chip" href="${lang==='pt'?'/livro-razao/':'/en/ledger/'}${p.data.id}">fonte</a>`:`<span lang="pt-PT">${esc(p.termo)}</span>`).join('');}
