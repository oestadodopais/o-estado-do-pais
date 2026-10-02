/**
 * ---------------------------------------------------------------------------
 * A CAIXA DAS SUGESTÕES · os textos e os limites (bloco S1, 02.10.2026)
 * ---------------------------------------------------------------------------
 * Uma página simples onde o leitor diz o que procurou e não encontrou, que
 * estudo ou que número gostava de ver, ou outra coisa. Nada se publica: o
 * formulário vai à função `api/sugestoes.js`, que entrega a sugestão a uma base
 * fora do repositório (`design/observatorio/CAIXA-DAS-SUGESTOES.md`). Uma
 * sugestão não é uma correção: a correção tem a sua página, o seu endereço e o
 * seu registo público, e a página do formulário di-lo e dá a porta.
 *
 * OS TEXTOS SÃO OS DO BRIEF, À LETRA (`design/observatorio/BRIEF-S1-a-caixa-das-sugestoes.md`,
 * §5.4 e §5.5), nas duas línguas, e o guião das medições do bloco compara cada
 * um com o brief, byte a byte. Ficam inteiros, cada um numa cadeia só: a porta
 * de uma frase (a das correções, o endereço de correio) sai de dentro da cadeia
 * na vista, por `pedacosDaFrase()`, e nunca a corta aqui.
 *
 * A NOTA DO QUE FICA GUARDADO (`nota`) É UM RASCUNHO: rascunho do lugar de
 * direção de 02.10.2026, à espera do diretor. A exposição legal é dele, e o
 * bloco não aterra sem o «sim» dele a este texto (§5.4 do brief).
 *
 * Três textos não estão no §5 do brief, e cada um diz de onde vem:
 *   · `voltar` · as palavras do protótipo da função que o lugar de direção
 *     escreveu e gravou com o brief (`TEXTOS.voltar` do `api/sugestoes.js` do
 *     commit do brief);
 *   · `portaNasCorrecoes` · a frase que o §5.1 manda pôr na página das
 *     correções «para quem chegar à porta errada», escrita pelo construtor no
 *     molde da última frase do parágrafo do formulário, e por ler pelo lugar de
 *     direção;
 *   · `descricao` · as duas primeiras frases do parágrafo, que é o que a página
 *     é.
 *
 * NENHUM NÚMERO SE ESCREVE COM ALGARISMOS NESTES TEXTOS. As regras que a nota e
 * a página do limite dizem (cinco envios por hora, noventa dias, um ano) são as
 * do registo da base (`supabase/migrations/2026-10-02-caixa-das-sugestoes.sql`),
 * e o portão de HTML confere as palavras contra os números desse ficheiro: se a
 * base mudar, a nota que o leitor lê fica errada, e o portão di-lo.
 */

/** O título da página, o rótulo da porta do rodapé e o nome da rota no caminho. */
const titulo = { pt: 'Sugestões', en: 'Suggestions' };

export const SUGESTOES = {
  titulo,

  /** O parágrafo do formulário: para que serve a caixa, e para que não serve. */
  paragrafo: {
    pt:
      'O que procurou aqui e não encontrou? Que estudo gostava de ler? Escreva. As sugestões não se ' +
      'publicam: lê-as a direção do projeto e decide o que entra no plano. Para corrigir um número ou ' +
      'uma frase, a porta é outra: a página das correções.',
    en:
      'What did you look for here and not find? Which study would you like to read? Write it down. ' +
      "Suggestions are not published: the project's direction reads them and decides what enters the " +
      'plan. To correct a number or a sentence, the door is another one: the corrections page.',
  },
  /** O pedaço do parágrafo que é a porta da página das correções. */
  portaDoParagrafo: { pt: 'a página das correções', en: 'the corrections page' },

  /** A descrição do `<head>`: as duas primeiras frases do parágrafo. */
  descricao: {
    pt: 'O que procurou aqui e não encontrou? Que estudo gostava de ler?',
    en: 'What did you look for here and not find? Which study would you like to read?',
  },

  /** Os rótulos das três caixas, do contacto e do campo armadilhado. */
  rotulos: {
    procurou: { pt: 'O que procurou e não encontrou?', en: 'What did you look for and not find?' },
    estudo: {
      pt: 'Que estudo ou que número gostava de ver aqui?',
      en: 'Which study or number would you like to see here?',
    },
    outro: { pt: 'Outra coisa', en: 'Anything else' },
    contacto: { pt: 'Contacto, se quiser resposta (opcional)', en: 'Contact, if you want a reply (optional)' },
    sitio: { pt: 'Deixe em branco', en: 'Leave blank' },
  },

  /** O botão. */
  botao: { pt: 'Enviar a sugestão', en: 'Send the suggestion' },

  /**
   * A nota do que fica guardado. Rascunho do lugar de direção de 02.10.2026, à
   * espera do diretor (ver o cabeçalho deste ficheiro).
   */
  nota: {
    pt:
      'O que fica guardado: o que escrever, a língua, a página de onde veio e, se o deixar, o contacto. ' +
      'O endereço IP não se guarda: fica durante uma hora uma marca cifrada dele, só para travar envios ' +
      'em massa. Os dados ficam em servidores na União Europeia. Uma sugestão decidida apaga-se ao fim ' +
      'de noventa dias; uma por decidir, ao fim de um ano. O contacto serve só para responder. Para ' +
      'saber o que enviou ou pedir que se apague, escreva para correcoes@oestadodopais.pt.',
    en:
      'What is kept: what you write, the language, the page you came from and, if you leave it, the ' +
      'contact. The IP address is not kept: an encrypted mark of it stays for one hour, only to stop ' +
      'mass sending. The data is held on servers in the European Union. A decided suggestion is ' +
      'deleted after ninety days; an undecided one after a year. The contact is used only to reply. ' +
      'To know what you sent or to ask for it to be deleted, write to correcoes@oestadodopais.pt.',
  },

  /** O que o leitor lê depois de enviar: uma frase por resultado. */
  resultados: {
    obrigado: {
      pt:
        'Obrigado. A sugestão chegou. Não se publica e não tem resposta garantida; o que entrar no ' +
        'plano aparece nestas páginas.',
      en:
        'Thank you. The suggestion arrived. It is not published and a reply is not guaranteed; what ' +
        'enters the plan appears on these pages.',
    },
    vazia: {
      pt: 'A sugestão vinha vazia. Escreva pelo menos numa das três caixas.',
      en: 'The suggestion was empty. Write in at least one of the three boxes.',
    },
    limite: {
      pt: 'Chegaram cinco sugestões deste endereço na última hora. Volte mais tarde.',
      en: 'Five suggestions arrived from this address in the last hour. Please come back later.',
    },
    naoChegou: {
      pt: 'A caixa não conseguiu guardar a sugestão. Volte a tentar mais tarde.',
      en: 'The box could not keep the suggestion. Please try again later.',
    },
  },

  /** A porta de volta ao formulário, nas páginas do resultado (as palavras do protótipo). */
  voltar: { pt: 'Voltar ao formulário', en: 'Back to the form' },

  /** A frase da página das correções, para quem chegar à porta errada (§5.1 do brief). */
  portaNasCorrecoes: {
    pt:
      'Para dizer o que procurou e não encontrou, ou que estudo gostava de ler, a porta é outra: a ' +
      'página das sugestões.',
    en:
      'To say what you looked for and did not find, or which study you would like to read, the door ' +
      'is another one: the suggestions page.',
  },
  /** O pedaço dessa frase que é a porta do formulário. */
  portaDaFraseNasCorrecoes: { pt: 'a página das sugestões', en: 'the suggestions page' },
};

/**
 * AS QUATRO PÁGINAS DO RESULTADO, e a chave da rota de cada uma. A função manda o
 * leitor para estas rotas e para mais nenhuma; a vista do resultado escolhe a
 * frase pela mesma tabela, e o portão de HTML pede-lhes o `noindex` por ela.
 * @type {Record<keyof typeof SUGESTOES.resultados, ChaveDeRota>}
 */
export const ROTAS_DO_RESULTADO = {
  obrigado: 'sugestoesObrigado',
  vazia: 'sugestoesVazia',
  limite: 'sugestoesLimite',
  naoChegou: 'sugestoesNaoChegou',
};

/**
 * OS LIMITES DO QUE O FORMULÁRIO ACEITA E DO QUE A FUNÇÃO ENVIA, em caracteres.
 * Um só sítio para os dois: o `maxlength` de cada caixa e o corte da função saem
 * daqui, e o portão de HTML compara-os com os `char_length` do registo da base,
 * para que o leitor nunca escreva mais do que a base guarda.
 */
export const LIMITES_DAS_SUGESTOES = { pagina: 300, texto: 2000, contacto: 200 };

/**
 * Corta uma frase nos três pedaços de uma porta: o que vem antes, a porta, e o
 * que vem depois. A porta tem de estar na frase exatamente uma vez; se não
 * estiver, a construção fecha, porque uma porta que não se acha é uma frase que
 * mudou sem a porta mudar com ela.
 * @param {string} frase
 * @param {string} porta
 * @returns {[string, string, string]}
 */
export function pedacosDaFrase(frase, porta) {
  const i = frase.indexOf(porta);
  if (i < 0 || frase.indexOf(porta, i + porta.length) >= 0) {
    throw new Error(`sugestoes: a porta «${porta}» tem de estar exatamente uma vez em «${frase}»`);
  }
  return [frase.slice(0, i), porta, frase.slice(i + porta.length)];
}
