/** H4: os lugares da IA, pela redação decidida pelo lugar de direção (§1.173).
 * Cópia do lado do portão, que a vista não importa. As duas redações
 * mudam no mesmo commit quando a direção decide o texto.
 * O rótulo legal e o seu oráculo continuam nas conferências próprias.
 */
export const LUGARES_IA_DO_PORTAO = {
  pt: {
    intro: 'São três lugares, e a verificação é sempre de outra família de modelos:',
    itens: [
      'A direção dirige o trabalho: escreve os briefs, revê e funde.',
      'A construção constrói o sítio e o motor, e verifica lotes na fonte.',
      'A leitura lê sem contexto prévio, com erros plantados que tem de encontrar.',
    ],
    fecho: 'São os modelos Claude da Anthropic na direção e na leitura, e o Codex da OpenAI na construção. Um modelo novo só ocupa um lugar depois de passar os mesmos testes que o titular passou, e a troca fica escrita com a data.',
  },
  en: {
    intro: 'There are three places, and checking is always done by a different family of models:',
    itens: [
      'Direction directs the work: it writes the briefs, reviews and merges.',
      'Building builds the site and the engine, and checks batches at the source.',
      'Reading reads with no prior context, with planted errors it has to find.',
    ],
    fecho: 'They are the Claude models from Anthropic in the direction and the reading, and Codex from OpenAI in the building. A new model takes a place only after passing the same tests the incumbent passed, and the change is written down with its date.',
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
