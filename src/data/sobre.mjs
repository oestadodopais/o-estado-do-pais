/**
 * O texto do Sobre.
 *
 * PT: **texto decidido pela direção**, escrito por ela em conversa a
 * 2026-08-15 e registado em `VOZ-final.md`. Está aqui carácter a carácter, e
 * é daqui que a página o lê. Não reescrever, não apertar, não acrescentar:
 * o portão de HTML compara o que a página rende com esta cadeia e fecha a
 * construção à primeira diferença (origem `data-sobre`, DECISIONS §2.2).
 *
 * EN: tradução da casa do mesmo texto, sem acrescentos e sem omissões. Não é
 * transcrição de nada, é prosa da casa: por isso não vai marcada como citação
 * e é conferida da mesma maneira, contra este ficheiro.
 *
 * A 16.08.2026 uma revisão de outra família de modelos leu «standing in
 * relation to the world outside» e disse o que ela acrescenta: «standing» traz
 * um sentido de posição avaliada, de classificação, que «posição» não pede. A
 * tradução passou a «position in relation to the outside». É a mesma frase da
 * direção; o que mudou foi a palavra inglesa que a dizia a mais.
 *
 * NENHUM ALGARISMO, aqui nem na página. O Sobre diz a ideia e pára; o que
 * muda com o tempo é estado, e o estado rende-se no Método, que o prova.
 *
 * ---------------------------------------------------------------------------
 * A SEGUNDA FRASE DECIDIDA: A REGRA DOS NOMES (diretor, 15.09.2026)
 * ---------------------------------------------------------------------------
 * A emenda de 15.09.2026 à `design/observatorio/POLITICA-DA-AUTONOMIA.md` trocou
 * a revisão caso a caso de qualquer peça que nomeie uma pessoa por três
 * proteções, e a primeira das três é esta: **a norma declarada**. As palavras do
 * diretor: «the idea is to make people accountable, in the good way and in the
 * bad way». O que a política diz por extenso, o Sobre diz numa frase, e em mais
 * lado nenhum (norma §1.4: o sítio explica-se uma vez).
 *
 * O QUE ELA DECLARA, e não é mais do que isto: quem exerce um cargo público é
 * nomeado nos seus atos públicos, a partir dos documentos oficiais, no bem e no
 * mal; ninguém é nomeado por rumor. A segunda proteção, o direito de resposta,
 * vive na página das correções, que é onde a resposta se pede. A terceira é o
 * canal das correções, que já existia.
 *
 * LEVA A MESMA DISCIPLINA DO TEXTO DE CIMA: é um campo deste ficheiro, marcado
 * na página com `data-sobre-nomes`, e o `gate:html` compara-o carácter a
 * carácter. Uma frase de política que a página pudesse reescrever não era uma
 * norma declarada, era uma legenda.
 */

export const SOBRE = {
  pt: {
    texto:
      'O Estado do País mede a sociedade portuguesa, no seu contexto interno e na sua posição em relação ao exterior, e mantém dessa medição um registo contínuo, claro e permanente. É produzido maioritariamente por inteligência artificial, com o mínimo de intervenção humana, numa tentativa de explorar as possibilidades tecnológicas do presente e de levar ao limite a independência e o rigor.',
    nomes:
      'Quem exerce um cargo público é nomeado nos seus atos públicos, a partir dos documentos oficiais, no que fez bem e no que fez mal; ninguém é nomeado por rumor.',
  },
  en: {
    texto:
      'O Estado do País measures Portuguese society, in its internal context and in its position in relation to the outside, and keeps of that measurement a continuous, clear and permanent record. It is produced mostly by artificial intelligence, with the minimum of human intervention, in an attempt to explore the technological possibilities of the present and to push independence and rigour to their limit.',
    nomes:
      'Public office holders are named in their public acts, from the official documents, for what they did well and what they did badly; nobody is named on hearsay.',
  },
};

/** O texto decidido, na língua de uma edição. */
export function textoDoSobre(lang) {
  return SOBRE[lang]?.texto ?? null;
}

/** A regra dos nomes, na língua de uma edição. */
export function regraDosNomes(lang) {
  return SOBRE[lang]?.nomes ?? null;
}
