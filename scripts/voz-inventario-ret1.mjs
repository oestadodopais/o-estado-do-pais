/** RET1: condições de presença de catorze entradas históricas, sem editar o inventário. */
import lista from './voz-inventario-ret1.json' with {type:'json'};
import {WORKS} from '../src/data/studies.mjs';
import {estudosAvulsosDaEntrada} from '../src/lib/primeira-pagina.mjs';
import {entradasDasNovidades} from '../src/lib/novidades.mjs';
export function entradaRetiradaRet1(linha, contexto = {}) {
  const declarada = lista.find(l => ['n','classe','bloco','texto'].every(k => l[k] === linha[k]));
  if (!declarada || linha.estado !== 'viva') return false;
  const {tipo, estudos, entrada} = declarada.condicao;
  const trabalhos = contexto.trabalhos ?? WORKS;
  if (tipo === 'estudos') return estudos.length > 0 && estudos.every(slug => trabalhos.find(w => w.slug === slug)?.estado === 'retirado');
  if (tipo === 'entrada') return ['pt','en'].every(lang => (contexto.avulsos ?? estudosAvulsosDaEntrada)(entrada,lang).length === 0);
  if (tipo === 'novidades') return ['pt','en'].every(lang => !(contexto.novidades ?? entradasDasNovidades)(lang).some(p => p.tipo === 'estudo-atualizado'));
  return false;
}
