import fs from 'node:fs';
import path from 'node:path';
/** Nenhuma referência a uma linha retirada pode sobreviver em qualquer ficheiro de texto publicado. */
export function conferirRetiradas(html, linhas) {
 return [...linhas.values()].filter(l => l.publication === 'withdrawn' && html.includes(l.id))
  .map(l => `RP4N-e: uma linha retirada chegou a uma página: ${l.id}`);
}

/** Todos os ficheiros UTF-8 da publicação, incluindo JSON, CSV e mapas XML. */
export function ficheirosDeTexto(pasta) {
 const out=[];
 for(const e of fs.readdirSync(pasta,{withFileTypes:true})) {
  const p=path.join(pasta,e.name);
  if(e.isDirectory())out.push(...ficheirosDeTexto(p));
  else if(e.isFile()) {const b=fs.readFileSync(p);if(!b.includes(0)){try{new TextDecoder('utf-8',{fatal:true}).decode(b);out.push(p);}catch{}}}
 }
 return out.sort();
}
export function conferirPublicacaoRetirada(pasta,linhas) {
 return ficheirosDeTexto(pasta).flatMap(p=>conferirRetiradas(fs.readFileSync(p,'utf8'),linhas).map(mensagem=>({ficheiro:p,mensagem})));
}
