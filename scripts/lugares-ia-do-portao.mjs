/** H4: os três papéis da IA, pela redação decidida pelo lugar de direção (§1.173, reescrita na H4-e).
 * Cópia do lado do portão, que a vista não importa. As duas redações
 * mudam no mesmo commit quando a direção decide o texto.
 * O rótulo legal e o seu oráculo continuam nas conferências próprias.
 */
export const LUGARES_IA_DO_PORTAO = {
  pt: {
    titulo: 'Os três papéis',
    intro: 'São três papéis, todos de modelos: a direção, a construção e a leitura.',
    itens: [
      'A direção decide o que se faz, encomenda cada mudança e revê-a antes de se publicar, e escreve as explicações e os textos sobre este projeto, que a outra família de modelos lê antes de se publicarem; os números novos que as fontes publicam entram pelas verificações automáticas, sem a direção os ler um a um.',
      'A construção faz as páginas e o motor que lê as fontes; cada número que publica traz a sua fonte e a data em que foi lido, ou diz o que ainda está por confirmar.',
      'A leitura confere o que a construção entregou, sem contexto prévio e com erros plantados de propósito, para provar que os encontra, antes de se publicar.',
    ],
    fecho: 'A construção e a leitura são sempre de famílias de modelos diferentes: o modelo que construiu uma mudança nunca é o que a lê. Os modelos Claude da Anthropic estão na direção; na construção e na leitura estão os modelos Claude e o Codex da OpenAI. Um modelo novo só ocupa um papel depois de passar os mesmos testes que o titular passou, e a troca fica escrita com a data.',
  },
  en: {
    titulo: 'The three roles',
    intro: 'There are three roles, all held by models: direction, building and reading.',
    itens: [
      'Direction decides what is done, commissions each change and reviews it before it is published, and writes the explanations and the texts about this project, which the other family of models reads before they are published; new figures from the sources enter through the automated checks, without direction reading them one by one.',
      'Building makes the pages and the engine that reads the sources; every number it publishes carries its source and the date it was read, or says what is still to be confirmed.',
      'Reading checks what building delivered, with no prior context and with errors planted on purpose, to prove it finds them, before it is published.',
    ],
    fecho: 'Building and reading are always done by different families of models: the model that built a change never reads it. The Claude models from Anthropic hold the direction; building and reading are held by the Claude models and by Codex from OpenAI. A new model takes a role only after passing the same tests the incumbent passed, and the replacement is written down with its date.',
  },
};
const texto = (n) => (n?.textContent ?? '').replace(/\s+/g, ' ').trim();
export function conferirLugaresIA(root, lang) {
  const esperado = LUGARES_IA_DO_PORTAO[lang];
  if (!esperado) return ['H4 IA: edição desconhecida.'];
  const listas = root.querySelectorAll('#politica-de-ia .politica-lugares');
  if (listas.length !== 1) return ['H4 IA: falta a lista única dos lugares.'];
  const lista = listas[0];
  const itens = lista.querySelectorAll('li');
  const falhas = [];
  if (itens.length !== esperado.itens.length) falhas.push('H4 IA: a política tem de dizer três lugares.');
  if (JSON.stringify(itens.map(texto)) !== JSON.stringify(esperado.itens)) falhas.push('H4 IA: os lugares não são os da redação decidida.');
  const titulo = lista.parentNode.parentNode?.querySelector('.regra-k');
  if (!titulo || texto(titulo) !== esperado.titulo) falhas.push('H4 IA: o título dos papéis difere da redação decidida.');
  const paragrafos = lista.parentNode.querySelectorAll('p');
  if (paragrafos.length !== 2 || texto(paragrafos[0]) !== esperado.intro) falhas.push('H4 IA: a introdução dos lugares difere da redação decidida.');
  if (texto(paragrafos.at(-1)) !== esperado.fecho) falhas.push('H4 IA: as famílias e os lugares do fecho diferem da redação decidida.');
  return falhas;
}
