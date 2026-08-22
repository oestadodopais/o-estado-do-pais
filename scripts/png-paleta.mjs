/**
 * O CODIFICADOR DE PNG EM PALETA EXACTA.
 *
 * Escreve um PNG de tipo de cor 3 (paleta indexada), profundidade 8, com a
 * paleta do próprio cartão e sem `tRNS`. Não é uma quantização: é o mesmo
 * desenho noutra arrumação dos bytes. Se o cartão couber em 256 cores e não
 * tiver um único píxel translúcido, cada píxel do ficheiro escrito é, cor por
 * cor, o píxel que o rasterizador desenhou. Nada de dithering, nada de perda,
 * nada de aproximação: os algarismos do cartão continuam a ser os algarismos
 * que o rasterizador pôs lá.
 *
 * PORQUE É QUE ISTO É DA CASA E NÃO DE UMA BIBLIOTECA. Um PNG indexado é a
 * assinatura, o `IHDR`, um `PLTE`, um `IDAT` e o `IEND`, com um CRC-32 por
 * pedaço. O `node:zlib` faz o deflate e faz o CRC-32 (`zlib.crc32`, do próprio
 * Node desde a versão 22.2). Não há aqui um algoritmo a inventar, e por isso
 * também não há aqui uma dependência a trazer: nem `sharp`, que só está em
 * `node_modules` como pacote transitivo do Astro e não é dependência desta
 * casa, nem `pngquant`, nem nada de nativo.
 *
 * A RECUSA É PARTE DO DESENHO. O codificador não decide por si aproximar coisa
 * nenhuma. Ao primeiro píxel com alfa abaixo de 255, ou à cor 257, devolve a
 * razão da recusa e nenhum byte, e quem o chamou volta ao `asPng()` do
 * rasterizador e regista `"codificacao": "rgba"`. Um cartão nunca é degradado
 * em silêncio.
 *
 * A prova de que os píxeis são os mesmos está em `provar-cartoes-paleta.mjs`,
 * e a nota que a corre é `design/especime-v3/notas/pos-fusao.md` §A3.
 */

import zlib from 'node:zlib';

const ASSINATURA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** O tecto do tipo de cor 3 com profundidade 8: 256 entradas no `PLTE`. */
export const LIMITE_DE_CORES = 256;

/**
 * A tabela cor (24 bits) para índice, com 2^24 entradas.
 *
 * São 33,5 MB alocados uma vez e reaproveitados pelos 532 cartões: a alternativa
 * é um `Map` por píxel, e são 756 000 píxeis por cartão. Entre cartões limpam-se
 * só as entradas que este cartão usou (no máximo 256), e não os 16,7 milhões.
 */
let TABELA = null;

/** Um pedaço de PNG: comprimento, tipo, dados, CRC-32 sobre o tipo e os dados. */
function pedaco(tipo, dados) {
  const fora = Buffer.allocUnsafe(dados.length + 12);
  fora.writeUInt32BE(dados.length, 0);
  fora.write(tipo, 4, 'latin1');
  dados.copy(fora, 8);
  fora.writeUInt32BE(zlib.crc32(fora.subarray(4, 8 + dados.length)) >>> 0, 8 + dados.length);
  return fora;
}

/**
 * O NÍVEL DO DEFLATE É 7, E É UMA MEDIÇÃO E NÃO UM DEFEITO DA BIBLIOTECA.
 *
 * Os 532 cartões desta construção, nesta máquina, com o mesmo desenho e a mesma
 * paleta, só a mudar o que se passa ao `deflateSync`:
 *
 *     RGBA, como era antes           5,9 s      20 064 037 bytes
 *     nível 9, estratégia Z_RLE      4,4 s       9 953 494
 *     nível 6                        5,2 s       8 987 164
 *     nível 7                        5,3 s       8 874 864   <- o escolhido
 *     nível 8                        7,6 s       8 471 596
 *     nível 9                       13,4 s       8 021 832
 *
 * O 7 é o ponto onde o passo fica mais pequeno E mais rápido do que era em RGBA.
 * Do 7 para o 9 poupam-se mais 853 KB e paga-se o dobro do tempo do passo, em
 * todas as construções, por ficheiros que só se descarregam quando um sítio de
 * partilha os vai buscar. Mudar de ideias é mudar este número.
 *
 * @param {Buffer} rgba   4 bytes por píxel, em ordem de leitura.
 * @param {number} largura
 * @param {number} altura
 * @param {number} nivel  nível do deflate (0 a 9).
 * @returns {{bytes: Buffer, cores: number, recusa: null}
 *          |{bytes: null, cores: null, recusa: string}}
 */
export function codificaPaleta(rgba, largura, altura, nivel = 7) {
  const pixeis = largura * altura;
  if (!Buffer.isBuffer(rgba) || rgba.length !== pixeis * 4) {
    return {
      bytes: null,
      cores: null,
      recusa: `esperava ${pixeis * 4} bytes de RGBA para ${largura}x${altura} e vieram ${rgba?.length}`,
    };
  }

  if (TABELA === null) TABELA = new Int16Array(1 << 24).fill(-1);
  const usadas = [];
  const paleta = Buffer.allocUnsafe(LIMITE_DE_CORES * 3);
  const indices = Buffer.allocUnsafe(pixeis);
  let cores = 0;
  let recusa = null;

  for (let p = 0, i = 0; p < pixeis; p++, i += 4) {
    if (rgba[i + 3] !== 255) {
      recusa = `o píxel ${p} (${p % largura}, ${Math.floor(p / largura)}) tem alfa ${rgba[i + 3]}`;
      break;
    }
    const chave = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2];
    let indice = TABELA[chave];
    if (indice < 0) {
      if (cores === LIMITE_DE_CORES) {
        recusa =
          `o cartão passa das ${LIMITE_DE_CORES} cores no píxel ${p} ` +
          `(${p % largura}, ${Math.floor(p / largura)})`;
        break;
      }
      indice = cores++;
      TABELA[chave] = indice;
      usadas.push(chave);
      paleta[indice * 3] = rgba[i];
      paleta[indice * 3 + 1] = rgba[i + 1];
      paleta[indice * 3 + 2] = rgba[i + 2];
    }
    indices[p] = indice;
  }

  for (const chave of usadas) TABELA[chave] = -1;
  if (recusa !== null) return { bytes: null, cores: null, recusa };

  /* Filtro 0 (None) em todas as linhas: é o que a especificação recomenda para
     imagens indexadas, porque a diferença entre índices vizinhos não quer dizer
     nada, e é o que torna a descodificação da prova uma leitura e não um
     desfazer de filtros. O descodificador recusa qualquer outro byte de filtro. */
  const passo = largura + 1;
  const cru = Buffer.allocUnsafe(altura * passo);
  for (let y = 0; y < altura; y++) {
    cru[y * passo] = 0;
    indices.copy(cru, y * passo + 1, y * largura, (y + 1) * largura);
  }

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8; // profundidade de bits
  ihdr[9] = 3; // tipo de cor: paleta indexada
  ihdr[10] = 0; // compressão: deflate, a única do formato
  ihdr[11] = 0; // método de filtro: o único do formato
  ihdr[12] = 0; // sem entrelaçamento

  return {
    bytes: Buffer.concat([
      ASSINATURA,
      pedaco('IHDR', ihdr),
      pedaco('PLTE', paleta.subarray(0, cores * 3)),
      pedaco('IDAT', zlib.deflateSync(cru, { level: nivel })),
      pedaco('IEND', Buffer.alloc(0)),
    ]),
    cores,
    recusa: null,
  };
}
