// medicoes/m3-zona-segura-maskable.mjs — medição 3: a zona segura do maskable.
//
// O centro do círculo seguro é o centro do quadro, (256, 256) em 512: é o que
// o próprio SVG de origem usa como `transform-origin` da redução do `maskable`
// (design/marca/direcoes-e2/e2c-unida-28-papel-tinta.svg, regra
// `svg[data-forma^="maskable"] .reducao`), e é o centro que a máscara circular
// do Android de facto aplica. A leitura de «raio 40% centrado (204,8 px em
// 512)» do BRIEF é tomada como «raio de 40%, centrado [no quadro], que em 512
// px são 204,8 px de raio» — a alternativa (centro EM 204,8) desenharia um
// círculo que toca o canto superior esquerdo e sobra 102,4 px do lado
// oposto, o que não é o que nenhum motor de máscara faz. Isto fica dito aqui
// porque é uma leitura, não um facto lido byte a byte.
import fs from 'node:fs';
import path from 'node:path';
import { decodificarPNG, codificarPNG } from './lib/png.mjs';

const LADO = 512;
const CENTRO = { x: 256, y: 256 };
const RAIO = 0.4 * LADO; // 204.8

function corDoCampo(imagem) {
  // o canto (0,0) é sempre campo: o rect de fundo cobre o quadro inteiro e o
  // sinal nunca chega lá (é isso, precisamente, que esta medição confere).
  return [imagem.rgba[0], imagem.rgba[1], imagem.rgba[2], imagem.rgba[3]];
}

/**
 * Devolve { pixeisDeTinta, margemMinima, piorPixel } — a margem é
 * `RAIO - distanciaAoCentro`; negativa quando um píxel de tinta está fora do
 * círculo. `piorPixel` é o píxel com a margem mais pequena (o mais perto do
 * bordo, ou o primeiro a sair).
 */
export function medirZonaSegura(imagem) {
  const campo = corDoCampo(imagem);
  let pixeisDeTinta = 0;
  let margemMinima = Infinity;
  let piorPixel = null;
  for (let y = 0; y < imagem.altura; y++) {
    for (let x = 0; x < imagem.largura; x++) {
      const i = (y * imagem.largura + x) * 4;
      const difere =
        imagem.rgba[i] !== campo[0] ||
        imagem.rgba[i + 1] !== campo[1] ||
        imagem.rgba[i + 2] !== campo[2] ||
        imagem.rgba[i + 3] !== campo[3];
      if (!difere) continue;
      pixeisDeTinta++;
      // distância do CENTRO DO PÍXEL (x+0.5, y+0.5) ao centro do círculo
      const dx = x + 0.5 - CENTRO.x;
      const dy = y + 0.5 - CENTRO.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const margem = RAIO - dist;
      if (margem < margemMinima) {
        margemMinima = margem;
        piorPixel = { x, y, dist, margem, rgba: [imagem.rgba[i], imagem.rgba[i + 1], imagem.rgba[i + 2], imagem.rgba[i + 3]] };
      }
    }
  }
  return { campo, pixeisDeTinta, margemMinima, piorPixel };
}

export async function medir({ distRoot }) {
  const caminho = path.join(distRoot, 'icon-512-maskable.png');
  const imagem = decodificarPNG(fs.readFileSync(caminho));
  const medida = medirZonaSegura(imagem);

  // ---- caso vermelho plantado: um píxel de tinta fora do círculo --------
  // Planta-se no canto (4,4): distância ao centro = sqrt(2)*(256-4-0.5) ≈ 356,
  // bem fora dos 204,8 do raio, e no canto o campo real não tem tinta nenhuma.
  const rgbaMutado = Uint8Array.from(imagem.rgba);
  const px = 4,
    py = 4;
  const idx = (py * imagem.largura + px) * 4;
  // cor de tinta plausível: o oposto do campo em luminância, só para garantir que difere
  rgbaMutado[idx] = 255 - medida.campo[0];
  rgbaMutado[idx + 1] = 255 - medida.campo[1];
  rgbaMutado[idx + 2] = 255 - medida.campo[2];
  rgbaMutado[idx + 3] = 255;
  const pngMutado = codificarPNG({ largura: imagem.largura, altura: imagem.altura, rgba: rgbaMutado });
  const imagemMutada = decodificarPNG(pngMutado);
  const medidaMutada = medirZonaSegura(imagemMutada);

  return {
    medicao: 3,
    ficheiro: caminho,
    centro: CENTRO,
    raio: RAIO,
    corDoCampo: medida.campo,
    pixeisDeTinta: medida.pixeisDeTinta,
    margemMinimaPx: medida.margemMinima,
    piorPixel: medida.piorPixel,
    dentroDaZonaSegura: medida.margemMinima >= 0,
    casoConhecido: {
      descricao: `cópia em memória de icon-512-maskable.png com o píxel (${px},${py}) do canto (campo real) trocado para uma cor de tinta plantada`,
      pixelPlantado: { x: px, y: py },
      margemMinimaNaCopiaMutada: medidaMutada.margemMinima,
      piorPixelNaCopiaMutada: medidaMutada.piorPixel,
      viuVermelho: medidaMutada.margemMinima < 0,
    },
  };
}
