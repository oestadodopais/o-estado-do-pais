/** H4: os três papéis da IA, pela redação decidida pelo lugar de direção (§1.173, reescrita na H4-e).
 * Cópia do lado do portão, que a vista não importa. As duas redações
 * mudam no mesmo commit quando a direção decide o texto.
 * O rótulo legal e o seu oráculo continuam nas conferências próprias.
 */
export const LUGARES_IA_DO_PORTAO = {
  pt: {
    intro: 'São três papéis, todos de modelos: a direção, a construção e a leitura.',
    itens: [
      'A direção decide o que se faz, encomenda cada mudança, revê e aprova o que se publica.',
      'A construção constrói as páginas e o motor que lê as fontes; cada número que publica traz a fonte e a data em que foi lido.',
      'A leitura lê o que a construção entregou, sem contexto prévio e com erros plantados que tem de encontrar, antes de se publicar.',
    ],
    fecho: 'A construção e a leitura são sempre de famílias de modelos diferentes: o modelo que construiu nunca é o que lê. Os modelos Claude da Anthropic estão na direção; na construção e na leitura estão os modelos Claude e o Codex da OpenAI. Um modelo novo só ocupa um papel depois de passar os mesmos testes que o titular passou, e a troca fica escrita com a data.',
  },
  en: {
    intro: 'There are three roles, all held by models: direction, building and reading.',
    itens: [
      'Direction decides what is done, commissions each change, reviews and approves what is published.',
      'Building builds the pages and the engine that reads the sources; every number it publishes carries its source and the date it was read.',
      'Reading reads what building delivered, with no prior context and with planted errors it has to find, before it is published.',
    ],
    fecho: 'Building and reading are always done by different families of models: the model that built never reads. The Claude models from Anthropic hold the direction; building and reading are held by the Claude models and by Codex from OpenAI. A new model takes a role only after passing the same tests the incumbent passed, and the change is written down with its date.',
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
  const paragrafos = lista.parentNode.querySelectorAll('p');
  if (paragrafos.length !== 2 || texto(paragrafos[0]) !== esperado.intro) falhas.push('H4 IA: a introdução dos lugares difere da redação decidida.');
  if (texto(paragrafos.at(-1)) !== esperado.fecho) falhas.push('H4 IA: as famílias e os lugares do fecho diferem da redação decidida.');
  return falhas;
}
