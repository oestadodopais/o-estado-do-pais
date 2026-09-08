/* ---------------------------------------------------------------------------
 * O MENU EM DOIS PESOS (bloco F1.10, item 8.9, 08.09.2026)
 * ---------------------------------------------------------------------------
 * É o tropeço R3 da ronda de leitores de 07.09: «in the headers … they all have
 * the same weight visually, kind of looking the same content, which makes it
 * hard to navigate». A fila tinha treze posições, todas com o mesmo peso, e um
 * leitor à procura do seu concelho lia treze nomes antes de encontrar um.
 *
 * A DECISÃO SÃO TRÊS GRUPOS, e não uma fila mais curta: nada sai do menu.
 *
 *   · O LEITOR · Concelhos, Estudos, Números e fontes. São os três destinos que
 *     a medida L1 do brief nomeia («o meu concelho e os seus números; o que é
 *     uma medida e de onde vem; que estudos existem»), e são os únicos que ficam
 *     à vista no telemóvel sem abrir o menu.
 *   · O PAÍS · as outras maneiras de o cortar: Regiões, Distritos, Domínios,
 *     Áreas de governo, e a página dos dois quadros da União.
 *   · A CASA · Sobre, Método, Correções, e a Agenda, que é o calendário do que a
 *     casa vai medir e não uma maneira de cortar o país. O brief não a nomeia
 *     nos dois grupos que escreve, e fica aqui pela razão que o rodapé já dá às
 *     três: é da casa, e não do território.
 *
 * «INÍCIO» FICA À CABEÇA DO PRIMEIRO GRUPO, e não é um quarto destino de
 * leitor: é a volta ao princípio, e o brief não a tira. Fora da primeira página
 * a marca também leva lá, e ter as duas não é uma bifurcação — o cabeçalho e o
 * rodapé estão de fora da medida L1 por serem mobília.
 *
 * O RODAPÉ LEVA A MESMA LISTA PELA MESMA ORDEM (§7.5 do brief), e a lista é
 * ESTA, exportada daqui: duas listas escritas em dois ficheiros divergiam à
 * primeira página nova, e foi o que aconteceu com «Distritos», que estava no
 * menu e não estava no rodapé.
 */
const OITAVO_ITEM = 'correcoes';
export const GRUPOS_NAV = [
  /* «INÍCIO» É UM GRUPO SEU, E NÃO UM QUARTO DESTINO DE LEITOR. O item 8.9 nomeia
     TRÊS destinos em primeiro plano, e a volta ao princípio não é um deles: é a
     mobília. Fica à cabeça da fila, como sempre esteve, e abaixo de 640 px sai da
     barra para dentro do menu, porque ali cada posição custa uma linha de 44 px e
     a marca do cabeçalho já leva ao princípio em todas as páginas menos naquela
     em que se está. */
  { chave: 'inicio', rotas: ['home'] },
  { chave: 'leitor', rotas: ['municipios', 'estudos', 'livro'] },
  { chave: 'pais', rotas: ['regioes', 'distritos', 'dominios', 'areas', 'uniaoEuropeia'] },
  { chave: 'casa', rotas: ['sobre', 'metodo', ...(OITAVO_ITEM ? [OITAVO_ITEM] : []), 'agenda'] },
];
export const ETIQUETA_NAV = {
  home: 'inicio',
  municipios: 'municipios',
  regioes: 'regioes',
  distritos: 'distritos',
  areas: 'areas',
  dominios: 'dominios',
  uniaoEuropeia: 'uniaoEuropeia',
  estudos: 'estudos',
  livro: 'livro',
  agenda: 'agenda',
  metodo: 'metodo',
  correcoes: 'correcoes',
  sobre: 'sobre',
};
/* A fila inteira, pela ordem dos grupos: é o que o rodapé rende e é a ordem em
   que a página se ouve. */
export const ROTAS_NAV = GRUPOS_NAV.flatMap((g) => g.rotas);
