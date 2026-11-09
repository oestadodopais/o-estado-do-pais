/** Uma entrada editorial só entra pelo ficheiro Frases: de um mandato das medidas. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const sha=t=>createHash('sha256').update(t).digest('hex');
const canon=f=>JSON.stringify(['id','estudo','tipos','pt','en','linhas','razao'].map(k=>f[k]??null));
const PINO_SEMENTE='bab837f4bd4fb2653f1f680bff119ddc1c2aeae2b7bb082ebbb75e6ee6db4fca';
export function conferirSemente(f, sementes=null) {
  let hashes;
  if(sementes)hashes=sementes.map(e=>sha(canon(e)));
  else {
    const bytes=fs.readFileSync(new URL('./frases-semente-pino.json',import.meta.url),'utf8');
    if(sha(bytes)!==PINO_SEMENTE)return ['semente: pino inicial alterado'];
    hashes=JSON.parse(bytes).entradas;
  }
  return hashes.includes(sha(canon(f)))?[]:[`${f.id}: frase nova fora da semente inicial, exige mandato`];
}
export function conferirOrigem(f, pasta='design/especime-v3/medicoes') {
  if(f.origem==='semente') return [];
  if(typeof f.origem!=='string'||!f.origem.startsWith('mandato '))return [`${f.id}: origem ausente ou inválida`];
  const nome=f.origem.slice(8), raiz=path.resolve(pasta), alvo=path.resolve(raiz,nome);
  if(!alvo.startsWith(raiz+path.sep)||!nome.endsWith('.md')||!fs.existsSync(alvo)||!fs.realpathSync(alvo).startsWith(fs.realpathSync(raiz)+path.sep))return [`${f.id}: mandato fora da pasta das medidas ou ausente`];
  const texto=fs.readFileSync(alvo,'utf8');
  // A mesma fronteira de cabeçalho da camada 0: título inicial, antes da secção seguinte.
  const cabecalho=texto.replace(/^# [^\n]*\n/,'').split(/^#{1,6}\s/m)[0];
  if(!/^Acrescenta:\s*(?:frases|linhas e frases)\s*$/m.test(cabecalho))return [`${f.id}: mandato não declara frases`];
  for(const m of cabecalho.matchAll(/^Frases:[ \t]*(.+)$/gm)) {
    const rel=m[1].trim(), lista=path.resolve(path.dirname(alvo),rel);
    if(path.isAbsolute(rel)||!lista.startsWith(raiz+path.sep)||!fs.existsSync(lista)||!fs.realpathSync(lista).startsWith(fs.realpathSync(raiz)+path.sep))continue;
    let entradas;try {entradas=JSON.parse(fs.readFileSync(lista,'utf8'));}catch {continue;}
    const campos=['id','estudo','tipos','pt','en','linhas','razao'];
    if(Array.isArray(entradas)&&entradas.some(e=>campos.every(k=>JSON.stringify(e[k])===JSON.stringify(f[k]))))return [];
  }
  return [`${f.id}: frase, tipos, linhas ou par não constam de Frases: do mandato`];
}
