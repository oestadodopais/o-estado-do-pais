/**
 * ---------------------------------------------------------------------------
 * A PÁGINA «PRIVACIDADE» · o texto (bloco H3, 05.10.2026)
 * ---------------------------------------------------------------------------
 * Uma página simples, em `/privacidade` e `/en/privacy`, com o que a lei pede a quem
 * guarda os dados de quem escreve na caixa das sugestões, e mais nada. A caixa diz
 * numa linha o que guarda e para quê, e leva a porta para aqui (a forma dos sítios
 * oficiais que a pesquisa de 05.10.2026 leu: uma ou duas frases junto do campo e a
 * política inteira numa ligação, o §1 e a decisão 3 do §5 do brief H3).
 *
 * O TEXTO PORTUGUÊS É O DO BRIEF, À LETRA: o §5, decisão 2, de
 * `design/observatorio/BRIEF-H3-a-passagem-de-higiene-de-05-10.md`, aprovado pelo
 * diretor a 05.10.2026. O guião das medições do bloco
 * (`design/especime-v3/medicoes/h3-2026-10-05/medir-h3.mjs`) compara-o com o brief,
 * byte a byte.
 *
 * A EDIÇÃO INGLESA É FIEL, FRASE A FRASE, como o brief manda. Onde a frase portuguesa
 * diz o mesmo que a nota que o diretor aprovou a 03.10.2026 (§1.154), a inglesa é a que
 * ele aprovou com ela; onde a frase mudou, a inglesa diz o mesmo que a portuguesa nova,
 * e nada mais. A única coisa que a inglesa diz a mais é a que já dizia a nota aprovada:
 * que a Comissão Nacional de Proteção de Dados é a autoridade portuguesa de proteção de
 * dados, porque um leitor inglês não lho sabe pelo nome.
 *
 * A FRASE DOS COOKIES (`FRASE_DOS_COOKIES`) só está no texto porque o construtor a mediu
 * verdadeira nas páginas construídas (o relatório do bloco H3), e o portão de HTML
 * confere-a em cada construção (`scripts/privacidade-do-portao.mjs`): enquanto a frase
 * estiver aqui, um cookie posto pelo sítio ou um guião de seguimento numa página fecha a
 * construção. Se um dia deixar de ser verdade, tira-se a frase, por decisão escrita.
 *
 * NENHUM NÚMERO SE ESCREVE COM ALGARISMOS NESTE TEXTO. As regras que ele diz por
 * extenso (uma hora, noventa dias, um ano) são as das migrações da base
 * (`supabase/migrations/`), e o portão de HTML confere as palavras contra elas: se a
 * base mudar e o texto não, a construção fecha (`conferirRegrasDaBase()`, em
 * `scripts/sugestoes-do-portao.mjs`).
 */

/** A última frase, que o portão de HTML prende à ausência de cookies e de guiões de seguimento. */
export const FRASE_DOS_COOKIES = {
  pt: 'Este sítio não usa cookies nem segue quem o lê.',
  en: 'This site does not use cookies or track who reads it.',
};

export const PRIVACIDADE = {
  /** O texto da página, inteiro, num bloco só, como o brief o escreve. */
  texto: {
    pt:
      'O que fica guardado quando envia uma sugestão: o que escrever, a língua e a página de onde veio. ' +
      'O endereço IP não se guarda; dele fica, durante uma hora, uma marca que não o deixa recuperar, só ' +
      'para travar envios em massa. Os dados ficam em servidores na União Europeia, nos serviços que alojam ' +
      'o sítio e a caixa, que os tratam por conta do projeto. Guardam-se porque os enviou. Uma sugestão ' +
      'decidida apaga-se ao fim de noventa dias; uma por decidir, ao fim de um ano. Por estes dados responde ' +
      'O Estado do País, pelo endereço correcoes@oestadodopais.pt: escreva para saber o que enviou, ' +
      'corrigi-lo ou pedir que se apague; pode também queixar-se à Comissão Nacional de Proteção de Dados ' +
      '(cnpd.pt). ' +
      FRASE_DOS_COOKIES.pt,
    en:
      'What is kept when you send a suggestion: what you write, the language and the page you came from. ' +
      'The IP address is not kept; what remains of it, for one hour, is a mark from which it cannot be ' +
      'recovered, only to stop mass sending. The data is held on servers in the European Union, in the ' +
      "services that host the site and the box, which process it on the project's behalf. It is kept " +
      'because you sent it. A decided suggestion is deleted after ninety days; an undecided one after a ' +
      'year. O Estado do País is responsible for this data, at correcoes@oestadodopais.pt: write to know ' +
      'what you sent, to correct it or to ask for it to be deleted; you may also complain to the ' +
      'Portuguese data protection authority, the Comissão Nacional de Proteção de Dados (cnpd.pt). ' +
      FRASE_DOS_COOKIES.en,
  },
  /** A descrição do `<head>`: a primeira frase do texto, que diz o que a página é. */
  descricao: {
    pt: 'O que fica guardado quando envia uma sugestão: o que escrever, a língua e a página de onde veio.',
    en: 'What is kept when you send a suggestion: what you write, the language and the page you came from.',
  },
};
