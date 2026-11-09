/** Pino das marcas: alteração, data e razão têm de viajar no mesmo commit. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const MARCAS='scripts/frases-marcas.json', PINO='scripts/frases-marcas-pino.json';
const BASE='f1b98c701';
const sha=t=>createHash('sha256').update(t).digest('hex');
export function validarPino(marcas, pino, anteriores = null) {
  const erros=[];
  let p;try {p=JSON.parse(pino);}catch {return ['marcas: pino ilegível'];}
  if (p.sha256!==sha(marcas) || !/^\d{4}-\d{2}-\d{2}$/.test(p.data??'') || typeof p.razao!=='string' || p.razao.trim().length<20) erros.push('marcas: pino, data ou razão inválidos');
  if (anteriores && anteriores.marcas!==marcas) {
    let a;try {a=JSON.parse(anteriores.pino);}catch {a={};}
    if (anteriores.pino===pino || a.razao===p.razao) erros.push('marcas: mudança sem pino e razão novos no mesmo commit');
  }
  return erros;
}
export function conferirPino({indice=false,repo='.',gitRun,ficheiros={marcas:MARCAS,pino:PINO,base:BASE}}={}) {
  const git=gitRun??((...a)=>execFileSync('git',['-C',repo,...a],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trimEnd());
  const ler=(rev,f)=>git('ls-tree','--name-only',rev,'--',f)?git('show',rev+':'+f)+'\n':null;
  const estado=rev=>({marcas:ler(rev,ficheiros.marcas),pino:ler(rev,ficheiros.pino)});
  const erros=[];
  for(const rev of git('rev-list','--full-history',ficheiros.base+'..HEAD','--',ficheiros.marcas,ficheiros.pino).split('\n').filter(Boolean)) {
    const atual=estado(rev);
    if (!atual.marcas || !atual.pino) {erros.push('marcas: listas ou pino apagados');continue;}
    for(const pai of git('rev-list','--parents','-n','1',rev).split(' ').slice(1)) {
      const anterior=estado(pai);
      erros.push(...validarPino(atual.marcas,atual.pino,anterior.marcas?anterior:null).map(e=>rev+': '+e));
    }
  }
  const atual=indice?{marcas:git('show',':'+ficheiros.marcas)+'\n',pino:git('show',':'+ficheiros.pino)+'\n'}:{marcas:fs.readFileSync(ficheiros.marcas,'utf8'),pino:fs.readFileSync(ficheiros.pino,'utf8')};
  const anterior=estado('HEAD');
  return [...erros,...validarPino(atual.marcas,atual.pino,anterior.marcas?anterior:null)];
}
