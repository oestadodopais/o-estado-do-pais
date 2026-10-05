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
 * um com o brief, byte a byte; os dois da página do limite são os que o lugar de
 * direção deu na passagem S1-b e a nota é a que o diretor aprovou (abaixo), e o
 * guião compara-os com esses. Ficam inteiros, cada um numa cadeia só: a porta
 * de uma frase (a das correções, o endereço de correio) sai de dentro da cadeia
 * na vista, por `pedacosDaFrase()`, e nunca a corta aqui.
 *
 * A NOTA DO QUE FICA GUARDADO (`nota` e `portaDaNota`), desde a passagem de
 * higiene H3 (05.10.2026): uma linha só, à vista junto do formulário, e a porta
 * para a página «Privacidade», que diz o resto. É o texto aprovado pelo diretor a
 * 05.10.2026, à letra, nas duas línguas (o §5, decisão 1, de
 * `design/observatorio/BRIEF-H3-a-passagem-de-higiene-de-05-10.md`), pela forma
 * dos sítios oficiais que a pesquisa desse dia leu (uma ou duas frases junto do
 * campo e a política inteira numa ligação), e o guião das medições do bloco H3
 * compara-o com o brief. A nota de 03.10.2026 (§1.154), que dizia tudo no
 * formulário, saiu; o que ela dizia está, com o texto novo do diretor, em
 * `src/data/privacidade.mjs`. O campo do contacto continua fora do formulário
 * (passagem S1-c): a caixa não tem resposta, e nenhuma caixa se marca para enviar.
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
 * NENHUM NÚMERO SE ESCREVE COM ALGARISMOS NESTES TEXTOS. As regras que a página do
 * limite diz (cinco envios por hora) e as que a página «Privacidade» diz (uma hora,
 * noventa dias, um ano) são as do registo da base (`supabase/migrations/`), e o
 * portão de HTML confere as palavras contra os números desses ficheiros: se a base
 * mudar, o que o leitor lê fica errado, e o portão di-lo.
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

  /** Os rótulos das três caixas e do campo armadilhado. */
  rotulos: {
    procurou: { pt: 'O que procurou e não encontrou?', en: 'What did you look for and not find?' },
    estudo: {
      pt: 'Que estudo ou que número gostava de ver aqui?',
      en: 'Which study or number would you like to see here?',
    },
    outro: { pt: 'Outra coisa', en: 'Anything else' },
    sitio: { pt: 'Deixe em branco', en: 'Leave blank' },
  },

  /** O botão. */
  botao: { pt: 'Enviar a sugestão', en: 'Send the suggestion' },

  /**
   * A nota do que fica guardado: uma linha, o texto aprovado pelo diretor a
   * 05.10.2026, à letra (ver o cabeçalho deste ficheiro); a vista põe a porta
   * para a página «Privacidade» logo a seguir, com as palavras de `portaDaNota`.
   */
  nota: {
    pt: 'Só guardamos o que escrever e a página de onde veio, para decidir a sugestão.',
    en: 'We only keep what you write and the page you came from, to decide on the suggestion.',
  },
  /** A porta da nota para a página «Privacidade» (o §5, decisão 1, do brief H3). */
  portaDaNota: { pt: 'Como tratamos os seus dados', en: 'How we handle your data' },

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
    /* O TEXTO DA PÁGINA DO LIMITE MUDOU NA PASSAGEM S1-b (03.10.2026), por decisão do
       lugar de direção sobre o achado 6 da leitura a frio
       (`design/especime-v3/critica/LEITURA-S1-2026-10-03.md`): a janela da marca começa
       no primeiro envio e dura uma hora, e por isso a página diz «numa hora» e não «na
       última hora». O texto novo é do lugar de direção (§5.5 do brief). */
    limite: {
      pt: 'Chegaram cinco sugestões deste endereço numa hora. Volte mais tarde.',
      en: 'Five suggestions arrived from this address within one hour. Please come back later.',
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
 * para que o leitor nunca escreva mais do que a base guarda. Desde a passagem
 * S1-c (03.10.2026, §1.154) não há limite do contacto: o campo saiu do
 * formulário, e a função manda a coluna da base, que fica como está, sempre vazia.
 */
export const LIMITES_DAS_SUGESTOES = { pagina: 300, texto: 2000 };

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
