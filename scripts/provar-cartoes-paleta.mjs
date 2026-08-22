#!/usr/bin/env node
/**
 * A PROVA DE QUE A PALETA NÃO MEXEU UM PÍXEL.
 *
 * Fora da construção: os cinco portões não o correm, e o `npm run build` não o
 * conhece. Corre-se à mão, quando alguém quiser voltar a ver a prova:
 *
 *     node scripts/provar-cartoes-paleta.mjs
 *
 * O QUE PROVA. Que o PNG escrito em disco, descodificado do zero por este
 * ficheiro (inflar o `IDAT`, tirar o byte de filtro de cada linha, passar cada
 * índice pelo `PLTE`), é byte a byte o RGBA que o rasterizador produziu para o
 * mesmo SVG. É a igualdade dos píxeis, e não uma semelhança medida.
 *
 * O QUE NÃO PROVA, e a distinção importa porque é a de I58: isto compara os
 * píxeis do ficheiro com os píxeis do rasterizador. Não lê o que lá está
 * escrito. O portão continua a conferir o registo e não os píxeis, e nada nesta
 * prova o muda: quem desenhasse no cartão uma cadeia diferente da que regista
 * teria aqui 532 de 532 iguais na mesma, porque os dois lados da comparação
 * vinham do mesmo desenho errado. I58 fica aberta.
 *
 * COMO CORRE. A comparação tem de ser com o RGBA da MESMA passagem, e por isso
 * quem a faz é o próprio `cartoes.mjs` sob a bandeira `--provar`: guarda o RGBA
 * do cartão que acabou de desenhar, relê o PNG que acabou de escrever, e chama
 * o `compara()` deste ficheiro. Este ficheiro é as duas coisas: o
 * descodificador que essa bandeira importa, e o comando que a corre. A
 * alternativa (redesenhar o SVG aqui) obrigava a importar o `cartoes.mjs`, que
 * apaga `dist/cartoes/` mal é importado.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const AQUI = path.dirname(fileURLToPath(import.meta.url));

const ASSINATURA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Um PNG de tipo de cor 3, descodificado até ao RGBA, sem confiar em nada.
 *
 * Recusa (lança) tudo o que não seja exactamente o que o codificador da casa
 * escreve: outro tipo de cor, outra profundidade, entrelaçamento, um `tRNS`, um
 * byte de filtro diferente de zero, um CRC que não bate certo, um índice fora do
 * `PLTE`. Uma prova que aceitasse variantes não provava nada sobre esta.
 */
export function descodifica(buf) {
  if (buf.length < 8 || !buf.subarray(0, 8).equals(ASSINATURA)) {
    throw new Error('não tem a assinatura de PNG');
  }
  let pos = 8;
  let ihdr = null;
  let plte = null;
  const idat = [];
  let fim = false;
  while (pos + 8 <= buf.length) {
    const comprimento = buf.readUInt32BE(pos);
    const tipo = buf.toString('latin1', pos + 4, pos + 8);
    const dados = buf.subarray(pos + 8, pos + 8 + comprimento);
    const crcLido = buf.readUInt32BE(pos + 8 + comprimento);
    const crcFeito = zlib.crc32(buf.subarray(pos + 4, pos + 8 + comprimento)) >>> 0;
    if (crcLido !== crcFeito) throw new Error(`o CRC do pedaço ${tipo} não bate certo`);
    if (tipo === 'IHDR') ihdr = dados;
    else if (tipo === 'PLTE') plte = Buffer.from(dados);
    else if (tipo === 'IDAT') idat.push(Buffer.from(dados));
    else if (tipo === 'tRNS') throw new Error('tem um pedaço tRNS, e o cartão é opaco');
    else if (tipo === 'IEND') fim = true;
    pos += 12 + comprimento;
  }
  if (!fim) throw new Error('não tem IEND');
  if (!ihdr || ihdr.length !== 13) throw new Error('não tem um IHDR de 13 bytes');
  if (!plte) throw new Error('não tem PLTE');
  if (idat.length === 0) throw new Error('não tem IDAT');

  const largura = ihdr.readUInt32BE(0);
  const altura = ihdr.readUInt32BE(4);
  if (ihdr[8] !== 8) throw new Error(`profundidade de bits ${ihdr[8]}, esperava 8`);
  if (ihdr[9] !== 3) throw new Error(`tipo de cor ${ihdr[9]}, esperava 3`);
  if (ihdr[12] !== 0) throw new Error('está entrelaçado');
  if (plte.length % 3 !== 0) throw new Error('o PLTE não tem um múltiplo de 3 bytes');
  const cores = plte.length / 3;

  const cru = zlib.inflateSync(Buffer.concat(idat));
  const passo = largura + 1;
  if (cru.length !== altura * passo) {
    throw new Error(`o IDAT inflado tem ${cru.length} bytes e esperava ${altura * passo}`);
  }

  const rgba = Buffer.allocUnsafe(largura * altura * 4);
  for (let y = 0; y < altura; y++) {
    const filtro = cru[y * passo];
    if (filtro !== 0) throw new Error(`a linha ${y} tem o filtro ${filtro}, e esperava 0`);
    for (let x = 0; x < largura; x++) {
      const indice = cru[y * passo + 1 + x];
      if (indice >= cores) {
        throw new Error(`o píxel (${x}, ${y}) tem o índice ${indice} e o PLTE só tem ${cores} cores`);
      }
      const d = (y * largura + x) * 4;
      rgba[d] = plte[indice * 3];
      rgba[d + 1] = plte[indice * 3 + 1];
      rgba[d + 2] = plte[indice * 3 + 2];
      rgba[d + 3] = 255;
    }
  }
  return { largura, altura, cores, rgba };
}

/**
 * O PNG escrito contra o RGBA do rasterizador. O primeiro píxel diferente é
 * nomeado com as duas cores, porque «são diferentes» não se corrige e
 * «(431, 208) devia ser #1b1b1b e está #1b1b1c» corrige-se.
 */
export function compara(png, rgba, largura, altura) {
  let lido;
  try {
    lido = descodifica(png);
  } catch (e) {
    return { igual: false, motivo: `o PNG escrito não se descodifica: ${e.message}` };
  }
  if (lido.largura !== largura || lido.altura !== altura) {
    return {
      igual: false,
      motivo: `o PNG mede ${lido.largura}x${lido.altura} e o rasterizador deu ${largura}x${altura}`,
    };
  }
  if (lido.rgba.length !== rgba.length) {
    return {
      igual: false,
      motivo: `o PNG tem ${lido.rgba.length} bytes de RGBA e o rasterizador deu ${rgba.length}`,
    };
  }
  if (lido.rgba.equals(rgba)) return { igual: true, cores: lido.cores };

  const p = Math.floor(primeiraDiferenca(lido.rgba, rgba) / 4);
  const cor = (buf) =>
    '#' +
    [0, 1, 2]
      .map((k) => buf[p * 4 + k].toString(16).padStart(2, '0'))
      .join('') +
    (buf[p * 4 + 3] === 255 ? '' : ` (alfa ${buf[p * 4 + 3]})`);
  return {
    igual: false,
    motivo:
      `o primeiro píxel diferente é o ${p} (${p % largura}, ${Math.floor(p / largura)}): ` +
      `o rasterizador desenhou ${cor(rgba)} e o ficheiro tem ${cor(lido.rgba)}`,
  };
}

function primeiraDiferenca(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return i;
  return -1;
}

/* --------------------------------------------------------------- o comando */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = spawnSync(process.execPath, [path.join(AQUI, 'cartoes.mjs'), '--provar'], {
    stdio: 'inherit',
  });
  process.exit(r.status ?? 1);
}
