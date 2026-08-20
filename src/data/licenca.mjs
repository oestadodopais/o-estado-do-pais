/**
 * A licença do conjunto de dados do livro-razão.
 *
 * ---------------------------------------------------------------------------
 * UM SÓ CAMPO, E É DA DIREÇÃO
 * ---------------------------------------------------------------------------
 * O `BRIEF-bloco-T.md` §2.6 fixa-o: os ficheiros do conjunto constroem-se
 * sempre, e **nada se publica sob licença nenhuma até a direção decidir qual
 * é**. Enquanto esta constante for `null`:
 *
 *   · nenhuma página liga `/livro-razao.csv`, `/livro-razao.json` ou
 *     `/livro-razao/<id>.json`;
 *   · a página do livro-razão diz o **estado** («conjunto de dados preparado;
 *     a licença aguarda decisão da direção»), que é um estado desenhado
 *     (IDENTIDADE.md §7) e não o marcador (§6): não falta aqui uma prova, falta
 *     uma decisão, e as duas não se dizem com a mesma língua.
 *
 * **A direção decidiu a 20.08.2026** (`DECISIONS.md` §1.48), e mudou-se este
 * campo e mais nenhum: as ligações aparecem nas duas edições, cada linha ganha
 * a porta para o seu JSON, a licença fica escrita ao pé dos ficheiros que ela
 * cobre, e a linha de estado sai. O parágrafo acima fica escrito porque é o
 * estado a que esta constante volta se a decisão for revogada, e porque é a
 * razão de o caminho ter sido construído antes de ser preciso.
 *
 * A forma, que é a decidida:
 *
 *   export const LICENCA = {
 *     nome: 'CC BY 4.0',                                    // como a licença se chama
 *     url: 'https://creativecommons.org/licenses/by/4.0/',  // onde ela está escrita
 *     atribuicao: 'O Estado do País, oestadodopaís.pt',     // a forma da atribuição que ela obriga
 *   };
 *
 * CC BY 4.0 era a recomendação do `BRIEF`, por ser a das fontes que já se citam
 * e a que permite a reutilização com atribuição. A decisão é da direção, e é
 * esta. **O que a licença cobre diz-se ao pé dela, na página**: a estrutura, os
 * valores da casa, as derivações e as descrições. Os excertos transcritos das
 * fontes continuam sob os termos de quem os publicou, e essa frase vive nas
 * cadeias (`src/i18n/strings.mjs`, `conjuntoAmbito`) e não aqui.
 *
 * ---------------------------------------------------------------------------
 * OS FICHEIROS EXISTEM MESMO SEM LICENÇA, E ISSO DIZ-SE EM VOZ ALTA
 * ---------------------------------------------------------------------------
 * `dist/livro-razao.csv`, `dist/livro-razao.json` e os 132 ficheiros de linha
 * são gerados em todas as construções, com ou sem licença. Não é uma publicação
 * disfarçada, e também não é o contrário: um ficheiro servido num caminho que
 * qualquer pessoa pode adivinhar está acessível, e chamar-lhe «não publicado»
 * seria escolher a palavra que nos convém. O que a ausência de licença faz é o
 * que ela pode fazer: nenhuma página o oferece, nenhum leitor é convidado a
 * reutilizá-lo, e o conjunto não declara termos que ninguém decidiu.
 *
 * A razão de os gerar na mesma é que um caminho que só nasce no dia da decisão
 * é um caminho que nunca foi construído nem conferido: a construção seria
 * diferente da que foi lida, e o dia da decisão passaria a ser um dia de
 * estreia. Ver `DECISIONS.md` §1.47, T4.
 */

/**
 * @typedef {{ nome: string, url: string, atribuicao: string }} Licenca
 */

/** @type {Licenca | null} */
export const LICENCA = {
  nome: 'CC BY 4.0',
  url: 'https://creativecommons.org/licenses/by/4.0/',
  atribuicao: 'O Estado do País, oestadodopaís.pt',
};

/** Onde o conjunto é servido. Uma origem só, partilhada pelas páginas e pelo portão. */
export const CONJUNTO = {
  csv: '/livro-razao.csv',
  json: '/livro-razao.json',
  /** @param {string} id */
  linha: (id) => `/livro-razao/${id}.json`,
};
