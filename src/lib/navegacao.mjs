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
 * HTML, em todas as páginas que têm rodapé (`scripts/indice-do-portao.mjs`).
 *
 * H3 (05.10.2026, o §3, ponto 3, do brief H3): o brief mandou medir outra vez «União Europeia» no menu, a 390 px e nas
 * duas edições, e pô-lo se as seis portas coubessem numa linha. Medido e capturado no navegador, com o nome inteiro posto
 * no lugar do rótulo curto só nessa medição: não cabe em nenhuma das duas (o relatório do bloco H3 tem as larguras), e
 * o rótulo curto fica. A porta «Privacidade» do mesmo bloco vive fora desta lista, ao lado da das sugestões.
 *
 * EX1 (05.10.2026, o ponto 3 do mandato): a sétima porta, «Explicações» / «Explainers», foi medida a 390 px nas duas
 * edições como o H3 mediu a da União, posta só no navegador ao lado de «Estudos» com o mesmo elemento e a mesma folha:
 * não cabe em nenhuma (a fila dobra para duas linhas; as larguras e as capturas estão em
 * `design/especime-v3/medicoes/ex1-2026-10-05/menu-a-390.json`), e o menu fica com as seis. As explicações entram pelo
 * bloco «Para perceber» da primeira página, pela secção delas no índice e pela migalha das páginas delas.
 *
 * EX1-b (06.10.2026, a decisão do lugar de direção sobre a I211): o rodapé ganha a oitava porta, «Explicações» /
 * «Explainers», a seguir a «Agenda» e antes de «Portugal na União Europeia». As oito portas e a ordem conferem-se no
 * portão de HTML (`scripts/indice-do-portao.mjs`), com as plantas de um rodapé sem a porta nova e de uma porta a mais.
 *
 * H4 (06.10.2026, H4-1): sete portas e o nome inteiro da União, com a letra e o espaço da regra base. A 390 px,
 * «União Europeia» / «European Union» cabem em duas linhas nas duas edições: 666,3125 px / 659,75 px de largura
 * natural numa coluna de 354 px, com 16 px entre portas, sem transbordo. A 360 px a dobra natural dá três linhas,
 * sem transbordo. As caixas, as capturas e os seus SHA-256 estão em
 * `design/especime-v3/medicoes/h4-2026-10-06/menu-a-390.json`, antes e depois da mudança. */
export const ROTAS_NAV = ['home', 'lugares', 'temas', 'estudos', 'explicacoes', 'uniaoEuropeia', 'sobre'];
export const ROTAS_RODAPE = ['home', 'livro', 'metodo', 'correcoes', 'agenda', 'explicacoes', 'uniaoEuropeia', 'indice'];
export const ROTAS_SOBRE = ['metodo', 'correcoes', 'agenda', 'livro'];
export const ETIQUETA_NAV = {
  home: 'inicio', lugares: 'lugares', temas: 'temas', municipios: 'municipios',
  regioes: 'regioes', distritos: 'distritos', areas: 'areas', dominios: 'dominios',
  uniaoEuropeia: 'uniaoEuropeia', estudos: 'estudos', livro: 'livro',
  agenda: 'agenda', metodo: 'metodo', correcoes: 'correcoes', sobre: 'sobre',
  indice: 'indice', explicacoes: 'explicacoes',
};
/** As etiquetas do menu do cabeçalho: as do rodapé, com «União Europeia» / «European Union» na porta da União. */
export const ETIQUETA_NO_MENU = { ...ETIQUETA_NAV, uniaoEuropeia: 'uniaoEuropeiaNoMenu' };
