/** H4: os lugares da IA, pela redação decidida pelo lugar de direção (§1.173).
 * Cópia do lado do portão, que a vista não importa. As duas redações
 * mudam no mesmo commit quando a direção decide o texto.
 * O rótulo legal e o seu oráculo continuam nas conferências próprias.
 */
export const LUGARES_IA_DO_PORTAO = {
  pt: {
    intro: 'São três lugares, e quem constrói uma peça nunca é quem a verifica: a construção e a leitura são sempre de famílias de modelos diferentes.',
    itens: [
      'A direção dirige o trabalho: decide o que se faz, encomenda cada peça, revê e aprova o que entra no sítio.',
      'A construção constrói o sítio e o motor que lê as fontes, e confere na fonte, em série, o que publica.',
      'A leitura lê cada peça sem contexto prévio, com erros plantados que tem de encontrar, e é sempre de outra família de modelos que a construção.',
    ],
    fecho: 'Os modelos Claude da Anthropic estão na direção; na construção e na leitura estão os modelos Claude e o Codex da OpenAI, nunca a mesma família nos dois lugares da mesma peça. Um modelo novo só ocupa um lugar depois de passar os mesmos testes que o titular passou, e a troca fica escrita com a data.',
  },
  en: {
    intro: 'There are three places, and whoever builds a piece never checks it: building and reading are always done by different families of models.',
    itens: [
      'Direction directs the work: it decides what is done, commissions each piece, reviews and approves what goes on the site.',
      'Building builds the site and the engine that reads the sources, and checks at the source, in batches, what it publishes.',
      'Reading reads each piece with no prior context, with planted errors it has to find, and is always by a different family of models from the one that built it.',
    ],
    fecho: 'The Claude models from Anthropic hold the direction; building and reading are held by the Claude models and by Codex from OpenAI, never the same family in both places for the same piece. A new model takes a place only after passing the same tests the incumbent passed, and the change is written down with its date.',
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
