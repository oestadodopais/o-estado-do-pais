/** B1, peça 3: cinco portas de leitura. As páginas antigas conservam porta
 * no rodapé até ao B2. A lista de manutenção é também a do Sobre.
 *
 * P4 (02.10.2026, item 0 do brief P4): seis portas, com a página da União entre
 * «Estudos» e «Sobre». O leitor de 02.10.2026 não a encontrou: as únicas portas
 * eram o último bloco da primeira página e uma linha nos temas. No menu o
 * rótulo é curto, «Europa» / «Europe», e a razão é medida: o brief manda «União
 * Europeia» se as seis couberem numa linha a 390 px, e não cabem nem com a letra
 * do menu a 12 px (373 px de portas numa coluna de 354); com «Europa» cabem, com
 * a letra do menu a 13 px (o relatório do bloco P4 tem a medida). O rodapé, que é
 * o índice do sítio, continua a dizer o nome inteiro da página.
 *
 * R3 (04.10.2026, o brief R3, §3, ponto 2): o rodapé ganha a sétima porta, a da
 * página «Índice» / «Index», que lista tudo o que o sítio tem. Fica no fim da
 * fila, antes da troca de língua; o menu do cabeçalho não muda (as seis portas são
 * o máximo a 390 px, §1.153). As sete portas e a ordem conferem-se no portão de
 * HTML, em todas as páginas que têm rodapé (`scripts/indice-do-portao.mjs`). */
export const ROTAS_NAV = ['home', 'lugares', 'temas', 'estudos', 'uniaoEuropeia', 'sobre'];
export const ROTAS_RODAPE = ['home', 'livro', 'metodo', 'correcoes', 'agenda', 'uniaoEuropeia', 'indice'];
export const ROTAS_SOBRE = ['metodo', 'correcoes', 'agenda', 'livro'];
export const ETIQUETA_NAV = {
  home: 'inicio', lugares: 'lugares', temas: 'temas', municipios: 'municipios',
  regioes: 'regioes', distritos: 'distritos', areas: 'areas', dominios: 'dominios',
  uniaoEuropeia: 'uniaoEuropeia', estudos: 'estudos', livro: 'livro',
  agenda: 'agenda', metodo: 'metodo', correcoes: 'correcoes', sobre: 'sobre',
  indice: 'indice',
};
/** As etiquetas do menu do cabeçalho: as do rodapé, menos a da União, que no menu é a curta. */
export const ETIQUETA_NO_MENU = { ...ETIQUETA_NAV, uniaoEuropeia: 'uniaoEuropeiaNoMenu' };
