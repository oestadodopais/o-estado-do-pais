import fs from 'node:fs';
import { emEnsaio } from '../site.config.mjs';
import { mudancasDoRegisto } from '../src/lib/mudancas.mjs';
const modos = JSON.parse(fs.readFileSync(new URL('./voz-rec1-modos.json', import.meta.url), 'utf8'));
const entradasAtuais = mudancasDoRegisto('pt').length;
export function fraseRec1DeveRender(texto, ensaio = emEnsaio(), entradas = entradasAtuais) {
  switch (modos[texto]) {
    case 'sempre': return true;
    case 'ensaio': return ensaio;
    case 'lancado': return !ensaio;
    case 'registo': return !ensaio && entradas > 0;
    case 'vazio': return !ensaio && entradas === 0;
    default: throw new Error('REC1: frase sem condição no inventário.');
  }
}

/** As mesmas duas perguntas que a medição faz ao inventário, com texto exato. */
export function conferirPresencaRec1(linhas, rendidas, normal = s=>s, ensaio = emEnsaio(), entradas = entradasAtuais) {
  const textos = new Set([...rendidas].map(normal));
  const condicionais = linhas.filter(l=>l.estado === 'condicional-rec1');
  return {
    faltam: condicionais.filter(l=>fraseRec1DeveRender(l.texto, ensaio, entradas) && !textos.has(normal(l.texto))),
    sobram: condicionais.filter(l=>!fraseRec1DeveRender(l.texto, ensaio, entradas) && textos.has(normal(l.texto))),
  };
}
