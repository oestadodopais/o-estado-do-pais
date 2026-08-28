// medicoes/lib/png.mjs
//
// Descodificador e codificador de PNG escritos de raiz para o M9 (a aplicação
// no telemóvel), sem importar nada de scripts/ nem de src/. Só usa node:zlib
// para a inflação e deflação do fluxo comprimido; o resto (assinatura,
// segmentos, CRC32, desfiltragem por linha, o encaixe de amostras em RGBA de
// 8 bits) é código próprio, escrito para este bloco de medição.
//
// Cobre profundidade de 1, 2, 4, 8 e 16 bits e os cinco tipos de cor da
// especificação (0 cinzento, 2 RGB, 3 paleta, 4 cinzento+alfa, 6 RGBA),
// sem entrelaçamento Adam7 (nenhum dos ficheiros deste bloco o usa; se
// aparecer, o descodificador para com um erro nomeado em vez de devolver
// uma imagem errada).

import { inflateSync, deflateSync } from 'node:zlib';

const ASSINATURA = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// --------------------------------------------------------------------------
// CRC32, tabela calculada uma vez (polinómio 0xEDB88320, o do PNG e do ZIP).
// --------------------------------------------------------------------------
const TABELA_CRC32 = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = TABELA_CRC32[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// --------------------------------------------------------------------------
// Leitura rápida da cabeça: só a assinatura e o segmento IHDR, sem inflar o
// IDAT. É o que a medição 1 pede: «o tamanho real, lido da cabeça do PNG
// (bytes 16 a 24)».
// --------------------------------------------------------------------------
export function lerCabecaPNG(buf) {
  if (buf.length < 26 || !buf.subarray(0, 8).equals(ASSINATURA)) {
    throw new Error('não é um PNG (assinatura de 8 bytes não bate)');
  }
  const tamanhoIHDR = buf.readUInt32BE(8);
  const tipoIHDR = buf.toString('ascii', 12, 16);
  if (tipoIHDR !== 'IHDR' || tamanhoIHDR !== 13) {
    throw new Error(`primeiro segmento não é IHDR de 13 bytes (é "${tipoIHDR}" de ${tamanhoIHDR})`);
  }
  // bytes 0..7 assinatura, 8..11 tamanho do segmento, 12..15 "IHDR",
  // 16..19 largura (32 bits), 20..23 altura (32 bits), 24 profundidade,
  // 25 tipo de cor.
  return {
    largura: buf.readUInt32BE(16),
    altura: buf.readUInt32BE(20),
    profundidade: buf[24],
    tipoDeCor: buf[25],
    compressao: buf[26],
    filtro: buf[27],
    entrelacado: buf[28],
  };
}

function lerSegmentos(buf) {
  if (!buf.subarray(0, 8).equals(ASSINATURA)) throw new Error('não é um PNG (assinatura)');
  let pos = 8;
  const segmentos = [];
  while (pos + 8 <= buf.length) {
    const tamanho = buf.readUInt32BE(pos);
    const tipo = buf.toString('ascii', pos + 4, pos + 8);
    const dados = buf.subarray(pos + 8, pos + 8 + tamanho);
    segmentos.push({ tipo, dados });
    pos += 12 + tamanho; // tamanho + tipo(4) + dados + CRC(4)
    if (tipo === 'IEND') break;
  }
  return segmentos;
}

const PaethPredictor = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
};

/**
 * Descodifica um PNG completo para RGBA de 8 bits por canal, uma amostra por
 * píxel, sempre 4 canais à saída (mesmo quando o ficheiro não tem alfa: nesse
 * caso `temCanalAlfa` fica falso e o alfa devolvido é 255 em todo o lado, só
 * para facilitar quem consome `rgba`).
 *
 * @returns {{largura:number, altura:number, profundidade:number,
 *   tipoDeCor:number, temCanalAlfa:boolean, rgba:Uint8Array}}
 */
export function decodificarPNG(buf) {
  const segmentos = lerSegmentos(buf);
  const ihdrSeg = segmentos.find((s) => s.tipo === 'IHDR');
  if (!ihdrSeg) throw new Error('PNG sem segmento IHDR');
  const largura = ihdrSeg.dados.readUInt32BE(0);
  const altura = ihdrSeg.dados.readUInt32BE(4);
  const profundidade = ihdrSeg.dados[8];
  const tipoDeCor = ihdrSeg.dados[9];
  const compressao = ihdrSeg.dados[10];
  const metodoDeFiltro = ihdrSeg.dados[11];
  const entrelacado = ihdrSeg.dados[12];

  if (compressao !== 0) throw new Error(`método de compressão ${compressao} não suportado`);
  if (metodoDeFiltro !== 0) throw new Error(`método de filtro ${metodoDeFiltro} não suportado`);
  if (entrelacado !== 0) throw new Error('PNG entrelaçado (Adam7) não suportado por este descodificador');

  const CANAIS_POR_TIPO = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
  const canais = CANAIS_POR_TIPO[tipoDeCor];
  if (canais === undefined) throw new Error(`tipo de cor ${tipoDeCor} desconhecido`);
  if (![1, 2, 4, 8, 16].includes(profundidade)) throw new Error(`profundidade ${profundidade} inválida`);

  // PLTE / tRNS, só interessam ao tipo 3 (paleta) e tRNS também ao tipo 0/2.
  let plte = null;
  let trns = null;
  for (const s of segmentos) {
    if (s.tipo === 'PLTE') plte = s.dados;
    if (s.tipo === 'tRNS') trns = s.dados;
  }
  if (tipoDeCor === 3 && !plte) throw new Error('PNG de paleta sem segmento PLTE');

  const idat = Buffer.concat(segmentos.filter((s) => s.tipo === 'IDAT').map((s) => s.dados));
  const bruto = inflateSync(idat);

  const bitsPorPixel = profundidade * canais;
  const bytesPorLinha = Math.ceil((bitsPorPixel * largura) / 8);
  const bpp = Math.max(1, Math.ceil(bitsPorPixel / 8)); // bytes por píxel completo, para o filtro

  const linhas = new Uint8Array(bytesPorLinha * altura);
  let posBruto = 0;
  for (let y = 0; y < altura; y++) {
    const tipoFiltro = bruto[posBruto];
    posBruto += 1;
    const linhaFiltrada = bruto.subarray(posBruto, posBruto + bytesPorLinha);
    posBruto += bytesPorLinha;
    const linhaAnterior = y === 0 ? null : linhas.subarray((y - 1) * bytesPorLinha, y * bytesPorLinha);
    const linhaAtual = linhas.subarray(y * bytesPorLinha, (y + 1) * bytesPorLinha);
    for (let x = 0; x < bytesPorLinha; x++) {
      const filt = linhaFiltrada[x];
      const a = x >= bpp ? linhaAtual[x - bpp] : 0;
      const b = linhaAnterior ? linhaAnterior[x] : 0;
      const c = x >= bpp && linhaAnterior ? linhaAnterior[x - bpp] : 0;
      let recon;
      switch (tipoFiltro) {
        case 0:
          recon = filt;
          break;
        case 1:
          recon = filt + a;
          break;
        case 2:
          recon = filt + b;
          break;
        case 3:
          recon = filt + Math.floor((a + b) / 2);
          break;
        case 4:
          recon = filt + PaethPredictor(a, b, c);
          break;
        default:
          throw new Error(`tipo de filtro de linha ${tipoFiltro} desconhecido, na linha ${y}`);
      }
      linhaAtual[x] = recon & 0xff;
    }
  }

  // Agora desempacota amostras -> RGBA de 8 bits.
  const rgba = new Uint8Array(largura * altura * 4);
  const temCanalAlfa = tipoDeCor === 4 || tipoDeCor === 6;

  const lerAmostra = (bitOffsetNaLinha, linhaBuf) => {
    if (profundidade === 8) return linhaBuf[bitOffsetNaLinha / 8];
    if (profundidade === 16) return linhaBuf[bitOffsetNaLinha / 8]; // byte alto, basta para comparação
    // profundidade 1, 2 ou 4: amostra dentro de um byte, MSB primeiro
    const byteIdx = Math.floor(bitOffsetNaLinha / 8);
    const bitDentro = bitOffsetNaLinha % 8;
    const byte = linhaBuf[byteIdx];
    const desloc = 8 - profundidade - bitDentro;
    const mascara = (1 << profundidade) - 1;
    const valor = (byte >> desloc) & mascara;
    // escala para 0..255
    return Math.round((valor * 255) / mascara);
  };

  for (let y = 0; y < altura; y++) {
    const linhaBuf = linhas.subarray(y * bytesPorLinha, (y + 1) * bytesPorLinha);
    for (let x = 0; x < largura; x++) {
      const baseBits = x * bitsPorPixel;
      const destino = (y * largura + x) * 4;
      if (tipoDeCor === 2 || tipoDeCor === 6) {
        // RGB ou RGBA
        const passo = profundidade === 16 ? 16 : profundidade;
        const r = lerAmostra(baseBits + 0 * passo, linhaBuf);
        const g = lerAmostra(baseBits + 1 * passo, linhaBuf);
        const b = lerAmostra(baseBits + 2 * passo, linhaBuf);
        const al = tipoDeCor === 6 ? lerAmostra(baseBits + 3 * passo, linhaBuf) : 255;
        rgba[destino] = r;
        rgba[destino + 1] = g;
        rgba[destino + 2] = b;
        rgba[destino + 3] = al;
      } else if (tipoDeCor === 0 || tipoDeCor === 4) {
        // cinzento ou cinzento+alfa
        const passo = profundidade === 16 ? 16 : profundidade;
        const v = lerAmostra(baseBits, linhaBuf);
        const al = tipoDeCor === 4 ? lerAmostra(baseBits + passo, linhaBuf) : 255;
        rgba[destino] = v;
        rgba[destino + 1] = v;
        rgba[destino + 2] = v;
        rgba[destino + 3] = al;
      } else if (tipoDeCor === 3) {
        // paleta: a amostra é um índice, não se escala para 0..255
        const byteIdx = Math.floor(baseBits / 8);
        let indice;
        if (profundidade === 8) indice = linhaBuf[byteIdx];
        else {
          const bitDentro = baseBits % 8;
          const desloc = 8 - profundidade - bitDentro;
          const mascara = (1 << profundidade) - 1;
          indice = (linhaBuf[byteIdx] >> desloc) & mascara;
        }
        rgba[destino] = plte[indice * 3];
        rgba[destino + 1] = plte[indice * 3 + 1];
        rgba[destino + 2] = plte[indice * 3 + 2];
        rgba[destino + 3] = trns && indice < trns.length ? trns[indice] : 255;
      }
    }
  }

  return { largura, altura, profundidade, tipoDeCor, temCanalAlfa, rgba };
}

// --------------------------------------------------------------------------
// Codificador simples: sempre RGBA de 8 bits (tipo de cor 6), filtro "None"
// em cada linha. Não é o codificador mais pequeno possível; é o mais simples
// de auditar, e serve só para escrever os casos vermelhos plantados (uma
// cópia de um PNG real com um píxel mudado), nunca para os ficheiros do
// sítio, que nunca são escritos por este programa.
// --------------------------------------------------------------------------
export function codificarPNG({ largura, altura, rgba }) {
  const segmento = (tipo, dados) => {
    const tipoBuf = Buffer.from(tipo, 'ascii');
    const corpo = Buffer.concat([tipoBuf, dados]);
    const cabecalho = Buffer.alloc(4);
    cabecalho.writeUInt32BE(dados.length, 0);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(corpo), 0);
    return Buffer.concat([cabecalho, corpo, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8; // profundidade
  ihdr[9] = 6; // tipo de cor: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const bytesPorLinha = largura * 4;
  const bruto = Buffer.alloc((bytesPorLinha + 1) * altura);
  for (let y = 0; y < altura; y++) {
    bruto[y * (bytesPorLinha + 1)] = 0; // filtro None
    Buffer.from(rgba.buffer, rgba.byteOffset + y * bytesPorLinha, bytesPorLinha).copy(
      bruto,
      y * (bytesPorLinha + 1) + 1,
    );
  }
  const idat = deflateSync(bruto);

  return Buffer.concat([
    ASSINATURA,
    segmento('IHDR', ihdr),
    segmento('IDAT', idat),
    segmento('IEND', Buffer.alloc(0)),
  ]);
}

// --------------------------------------------------------------------------
// Ficheiro .ico: 6 bytes de cabeça, N entradas de 16 bytes.
// --------------------------------------------------------------------------
export function parsearICO(buf) {
  const reservado = buf.readUInt16LE(0);
  const tipo = buf.readUInt16LE(2);
  const contagem = buf.readUInt16LE(4);
  if (reservado !== 0 || tipo !== 1) throw new Error('não é um ICO de ícones (cabeça inválida)');
  const entradas = [];
  for (let i = 0; i < contagem; i++) {
    const base = 6 + i * 16;
    const larguraBruta = buf[base];
    const alturaBruta = buf[base + 1];
    entradas.push({
      largura: larguraBruta === 0 ? 256 : larguraBruta,
      altura: alturaBruta === 0 ? 256 : alturaBruta,
      contagemDeCores: buf[base + 2],
      planos: buf.readUInt16LE(base + 4),
      bitsPorPixel: buf.readUInt16LE(base + 6),
      tamanhoEmBytes: buf.readUInt32BE(base + 8) === 0 ? buf.readUInt32LE(base + 8) : buf.readUInt32LE(base + 8),
      deslocamento: buf.readUInt32LE(base + 12),
    });
  }
  return entradas;
}
