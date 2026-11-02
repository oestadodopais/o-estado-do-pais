/** SEL1-J: leitores HB1 chamados pelos portões completos e pelas plantas. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projecaoLinha} from '../src/lib/projecao-linha.mjs';

export function conferirProjecaoHb1Html(raiz) {
  const mapa=new Map(), ficheiro=path.join(raiz,'ledger/provas/hb1/series.json');
  if(!fs.existsSync(ficheiro))return mapa;
  const prova=JSON.parse(fs.readFileSync(ficheiro,'utf8'));
  if(prova.rh_study!=='28 Habitacao Estudo')throw Error('HB1: origem de série inesperada');
  for(const [id,item] of Object.entries(prova.rows)) {
    if(!/^[a-z0-9-]+$/.test(id)||item.file!==`ledger/claims/${id}.yml`)throw Error('HB1: caminho de série inválido');
    const bytes=fs.readFileSync(path.join(raiz,item.file));
    if(createHash('sha256').update(projecaoLinha(bytes)).digest('hex')!==item.sha256)throw Error('HB1: resumo da série divergente: '+id);
    mapa.set(`${prova.rh_study} ${id}`,id);
  }
  return mapa;
}
export function conferirProjecaoHb1Cadeia(raiz) {
  const mapa=new Map(), ficheiro=path.join(raiz,'ledger/provas/hb1/series.json');
  if(!fs.existsSync(ficheiro))return mapa;
  const prova=JSON.parse(fs.readFileSync(ficheiro,'utf8'));
  if(prova.rh_study!=='28 Habitacao Estudo')throw Error('HB1: estudo da cópia divergente');
  for(const [id,r] of Object.entries(prova.rows)) {
    if(!/^[a-z0-9-]+$/.test(id)||r.file!==`ledger/claims/${id}.yml`)throw Error('HB1: caminho inválido');
    const digest=createHash('sha256').update(projecaoLinha(fs.readFileSync(path.join(raiz,'ledger/claims',id+'.yml')))).digest('hex');
    if(digest!==r.sha256)throw Error('HB1: a linha mudou sem recompor o documento: '+id);
    mapa.set(`${prova.rh_study} ${id}`,id);
  }
  return mapa;
}
