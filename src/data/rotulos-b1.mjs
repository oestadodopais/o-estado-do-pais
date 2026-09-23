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
 *   · `todasAsMedidas*` · a porta, no fim dos números por tema, para as linhas
 *     daquele lugar no livro-razão (achado D5 de 21.09.2026). Doze linhas das
 *     contas de Évora deixaram de ter cartão, e a página do livro-razão do
 *     concelho ficou sem porta; esta é a porta para o que a página não mostra, e
 *     não uma segunda porta para o que ela mostra. Parte-se em duas porque o
 *     nome do lugar entra no meio, declarado como lugar.
 *   · `todasAsMudancas` · a porta, por baixo de «O que mudou», para o registo
 *     inteiro (B1c, 22.09.2026). A lista de cada página mostra no máximo oito
 *     mudanças; o que não cabe não desaparece, e esta é a porta para ele.
 */
export const ROTULOS_B1 = {
  pt: { valor: 'Valor', medida: 'Medida', fonte: 'Fonte', verificacao: 'Verificado a', estudos: 'Estudos', fontes: 'Fontes e verificação',
    edicao: 'Edição tal como foi publicada', publicado: 'publicado a', estudoPublicado: 'Estudo publicado',
    pais: 'Portugal', outraLingua: '(em inglês)', indice: 'Nesta página',
    temas: 'Temas', estudosDoLugar: 'Estudos sobre este lugar', estudosRecentes: 'Estudos recentes', mudou: 'O que mudou',
    lugares: 'Lugares', regioes: 'Regiões', distritos: 'Distritos e ilhas',
    todasAsMedidasA: 'Todas as medidas de ', todasAsMedidasB: '',
    todasAsMudancas: 'Todas as mudanças' },
  en: { valor: 'Value', medida: 'Measure', fonte: 'Source', verificacao: 'Verified on', estudos: 'Studies', fontes: 'Sources and verification',
    edicao: 'Edition as published', publicado: 'published on', estudoPublicado: 'Study published',
    pais: 'Portugal', outraLingua: '(in Portuguese)', indice: 'On this page',
    temas: 'Themes', estudosDoLugar: 'Studies about this place', estudosRecentes: 'Recent studies', mudou: 'What changed',
    lugares: 'Places', regioes: 'Regions', distritos: 'Districts and islands',
    todasAsMedidasA: 'All measures for ', todasAsMedidasB: '',
    todasAsMudancas: 'All changes' },
};

/** Os títulos que delimitam a leitura já aprovada, nas duas edições. */
export const TITULOS_DA_LEITURA = {
  pt: ['Em resumo', 'O que este projeto conclui', 'O que podia funcionar melhor'],
  en: ['In brief', 'What this project concludes', 'What could work better'],
};
