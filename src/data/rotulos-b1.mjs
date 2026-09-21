/** Lista fechada da superfície B1, estudos e lista, decisão de 17.09.2026.
 * A mobília global e os campos de conferência dentro da dobra mantêm as suas listas.
 */
/* OS SEIS RÓTULOS DA PEÇA 2 (B1, 21.09.2026). As secções da página de um lugar
 * e as duas listas da página dos lugares. São nomes de secção, que é a classe
 * que o §5.1 da estrutura deixa numa página de leitor, e nenhum deles explica
 * nada: dizem o que está debaixo deles.
 *   · `temas` · os números deste lugar, arrumados pelos temas da carta;
 *   · `estudosDoLugar` · os estudos sobre ele, e não «trabalhos»;
 *   · `mudou` · o que mudou, que é a palavra do vocabulário (§6);
 *   · `lugares`, `regioes`, `distritos` · a página dos lugares e as suas duas
 *     listas. «Distritos e ilhas» porque as 29 unidades da Carta são dezoito
 *     distritos e onze ilhas, e chamar ilha a um distrito seria falso.
 */
export const ROTULOS_B1 = {
  pt: { valor: 'Valor', medida: 'Medida', fonte: 'Fonte', verificacao: 'Verificado a', estudos: 'Estudos', porLugar: 'Por lugar', fontes: 'Fontes e verificação',
    edicao: 'Edição tal como foi publicada', publicado: 'publicado a',
    pais: 'Portugal', outraLingua: '(em inglês)', indice: 'Nesta página',
    temas: 'Temas', estudosDoLugar: 'Estudos sobre este lugar', mudou: 'O que mudou',
    lugares: 'Lugares', regioes: 'Regiões', distritos: 'Distritos e ilhas' },
  en: { valor: 'Value', medida: 'Measure', fonte: 'Source', verificacao: 'Verified on', estudos: 'Studies', porLugar: 'By place', fontes: 'Sources and verification',
    edicao: 'Edition as published', publicado: 'published on',
    pais: 'Portugal', outraLingua: '(in Portuguese)', indice: 'On this page',
    temas: 'Themes', estudosDoLugar: 'Studies about this place', mudou: 'What changed',
    lugares: 'Places', regioes: 'Regions', distritos: 'Districts and islands' },
};

/** Os títulos que delimitam a leitura já aprovada, nas duas edições. */
export const TITULOS_DA_LEITURA = {
  pt: ['Em resumo', 'O que este projeto conclui', 'O que podia funcionar melhor'],
  en: ['In brief', 'What this project concludes', 'What could work better'],
};
