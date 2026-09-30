/** B2: as portas obrigatórias só saem da L1 depois de o bloco ser provado.
 * A devolução contém nós concretos, nunca um bloco nem um seletor a dispensar.
 * Uma porta acrescentada fica no contador; uma porta obrigatória repetida ou
 * alterada torna o bloco inválido e nenhuma porta dele sai da contagem. */
import { verificaVeredictoDoPais } from './pais-veredicto.mjs';
import { verificaCartaoDasCamaras } from './pais-camaras.mjs';

const CHAVES_DO_VEREDICTO = ['painel_fora_do_limiar', 'painel_com_limiar', 'painel_dentro_do_limiar'];

export function portasObrigatoriasB2(raiz, familia, lang, temas = null) {
  const portas = new Set();
  const erros = [];
  if (familia !== 'home' && familia !== 'lugares') return { portas, erros };
  /* O CARTÃO DAS CÂMARAS VIVE NA PÁGINA DOS TEMAS (bloco PP1, 28.09.2026). Os cartões saíram da
     primeira página, e com eles a contagem das câmaras; a V2 continua a conferi-lo onde ele está, e a
     primeira página fica com as portas do veredicto, conferidas pela V1. Um cartão das câmaras que volte
     à primeira página não sai da contagem por aqui: fica no contador, e o `check:pais` fecha a
     construção (T0, nenhum cartão na primeira página). */
  if (familia === 'lugares') erros.push(...verificaCartaoDasCamaras(raiz, lang));
  if (familia === 'home') {
    if (!temas) erros.push(`V1 ${lang}: falta o documento dos temas para conferir as portas.`);
    else erros.push(...verificaVeredictoDoPais(raiz, temas, lang));
  }
  if (erros.length) return { portas, erros };

  if (familia === 'lugares') {
    const camaras = raiz.querySelector('main [data-cartao-camaras]');
    portas.add(camaras.querySelector('.pais-porta-tema a'));
  }
  if (familia === 'home') {
    const veredicto = raiz.querySelector('main [data-veredicto-pais]');
    for (const chave of CHAVES_DO_VEREDICTO)
      portas.add(veredicto.querySelector(`a[data-prova="${chave}"]`));
    for (const a of veredicto.querySelectorAll('a[data-veredicto-medida]')) portas.add(a);
  }
  return { portas, erros };
}
