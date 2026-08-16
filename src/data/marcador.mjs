/**
 * O marcador de incerteza. Um só, e é este.
 *
 * `IDENTIDADE.md` §6: uma linguagem de incerteza, um marcador, uma classe
 * (`.marcador`), uma página que o explica (`/a-verificar` · `/en/to-verify`).
 * A constante estava escrita duas vezes, em `src/data/studies.mjs` e em
 * `src/lib/ledger.mjs`, com os dois valores iguais por sorte e não por
 * construção: bastava alguém mexer numa para o sítio passar a ter duas
 * linguagens de incerteza, que é exactamente o que a regra proíbe.
 *
 * Vive aqui, num módulo que não importa nada, porque os dois ficheiros que o
 * usavam já dependem um do outro (`ledger.mjs` lê `studies.mjs`) e pô-lo num
 * deles fecharia um ciclo. `ledger.mjs` reexporta-o, para que os oito sítios
 * que já o pediam continuem a pedi-lo onde o pediam: é o mesmo valor, com um
 * nome só.
 *
 * NUNCA se escreve o texto do marcador à mão num gabarito. Importa-se.
 * (16.08.2026, DECISIONS §1.40.)
 */
export const POR_VERIFICAR = '[a verificar]';
