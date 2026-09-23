/** Predicados da captura B2, exercidos pelo captor e pelas plantas. */
import { falhasDaCabeca } from '../../../../tests/inicio/cabeca.mjs';

export function falhasDaCaptura(r, estado = 'depois') {
  const { ficheiro, lingua, largura } = r;
  const falhas = [];
    if (r.deslocamento > 0) falhas.push(`${ficheiro}: transbordo de ${r.deslocamento} px`);
    if (r.errosDoNavegador?.length) falhas.push(`${ficheiro}: erros no navegador: ${r.errosDoNavegador.join('; ')}`);
    if (estado === 'depois') {
      falhas.push(...falhasDaCabeca(r));
      for (const c of r.cartoes) {
        if (!c.contagem && c.unidade && (!c.valorAntesDaUnidade || !c.unidadeAntesDoSelo)) falhas.push(`${ficheiro}: ${c.id}, ordem do valor/unidade/fonte`);
        if (largura === 390 && c.valorEUnidadeMesmaLinha === false) falhas.push(`${ficheiro}: ${c.id}, unidade separada do valor`);
        if (c.pergunta && !c.pergunta.endsWith('?')) falhas.push(`${ficheiro}: ${c.id}, definição sem pergunta`);
        if (c.pergunta && c.regua && (!c.reguaAntesDaPergunta || !(c.reguaPx > c.perguntaPx))) falhas.push(`${ficheiro}: ${c.id}, ordem/tamanhos da régua e da pergunta`);
        for (const ref of c.referencias) {
          const palavra = lingua === 'pt' ? (ref.estado === 'fora' ? /\bfora d[oa]s? valor(?:es)? de referência/ : /\bdentro d[oa]s? valor(?:es)? de referência/) : (ref.estado === 'fora' ? /\boutside (?:the )?reference values?/i : /\bwithin (?:the )?reference values?/i);
          if (['fora', 'dentro'].includes(ref.estado) && !palavra.test(ref.texto)) falhas.push(`${ficheiro}: ${c.id}, cor sem veredicto`);
        }
      }
      for (const c of r.faixa) {
        const palavra = lingua === 'pt' ? (c.estado === 'fora' ? /\bfora d[oa]s? valor(?:es)? de referência/ : /\bdentro d[oa]s? valor(?:es)? de referência/) : (c.estado === 'fora' ? /\boutside (?:the )?reference values?/i : /\bwithin (?:the )?reference values?/i);
        if (['fora', 'dentro'].includes(c.estado) && !palavra.test(c.texto ?? '')) falhas.push(`${ficheiro}: faixa ${c.id}, cor sem veredicto`);
      }
    }
  return falhas;
}
