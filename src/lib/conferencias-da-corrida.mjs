/** A lista que conferir-tudo.sh executa: verify e, se declarado e ainda ausente, typecheck. */
import fs from 'node:fs';
/** @param {Record<string, string>} [scripts] */
export function passosDaCorrida(scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts) {
  const passos = scripts.verify.split('&&').map(p => p.trim());
  if ('typecheck' in scripts && !passos.includes('npm run typecheck')) passos.push('npm run typecheck');
  if (passos.some(p => !/^npm run [A-Za-z0-9:._-]+( -- [^&|;<>`$]+)?$/.test(p))) throw new Error('MET1: passo inesperado na lista de conferências.');
  return passos;
}
