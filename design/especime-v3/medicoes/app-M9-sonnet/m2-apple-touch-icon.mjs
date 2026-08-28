// medicoes/m2-apple-touch-icon.mjs — medição 2: o ícone do iPhone.
import fs from 'node:fs';
import path from 'node:path';
import { decodificarPNG, codificarPNG } from './lib/png.mjs';
import { analisarRotas } from './lib/analiseRotas.mjs';

/** Conta píxeis com alfa < 255 num RGBA já descodificado. */
function contarPixeisTransparentes(imagem) {
  let n = 0;
  for (let i = 3; i < imagem.rgba.length; i += 4) if (imagem.rgba[i] !== 255) n++;
  return n;
}

export async function medir({ distRoot }) {
  const caminho = path.join(distRoot, 'apple-touch-icon.png');
  const buf = fs.readFileSync(caminho);
  const imagem = decodificarPNG(buf);
  const transparentes = contarPixeisTransparentes(imagem);

  const dimensoesConformes = imagem.largura === 180 && imagem.altura === 180;
  const opacidadeConforme = !imagem.temCanalAlfa || transparentes === 0;

  // -------------------------------------------------------------- rotas ---
  const rotas = analisarRotas(distRoot);
  const rotasRegulares = rotas.filter((r) => r.contagemLinksIcon > 0 || r.contagemLinksManifest > 0 || r.contagemLinksAppleTouch > 0 || r.contagemMetaThemeColor > 0);
  const rotasSemCabecaPWA = rotas.filter((r) => r.contagemLinksIcon === 0 && r.contagemLinksManifest === 0 && r.contagemLinksAppleTouch === 0 && r.contagemMetaThemeColor === 0);
  const semLigacao = rotasRegulares.filter((r) => r.contagemLinksAppleTouch !== 1);

  // ---- caso vermelho plantado: alfa ---------------------------------
  const rgbaMutado = Uint8Array.from(imagem.rgba);
  // planta um píxel transparente no canto (0,0), que na imagem real é opaco
  rgbaMutado[3] = 0;
  const pngMutado = codificarPNG({ largura: imagem.largura, altura: imagem.altura, rgba: rgbaMutado });
  const imagemMutada = decodificarPNG(pngMutado);
  const transparentesMutado = contarPixeisTransparentes(imagemMutada);
  const opacidadeConformeMutado = !imagemMutada.temCanalAlfa || transparentesMutado === 0;

  // ---- caso vermelho plantado: dimensão errada -----------------------
  const rgbaMenor = new Uint8Array(179 * 180 * 4).fill(255);
  const pngDimensaoErrada = codificarPNG({ largura: 179, altura: 180, rgba: rgbaMenor });
  const imagemDimensaoErrada = decodificarPNG(pngDimensaoErrada);
  const dimensaoErradaDetetada = !(imagemDimensaoErrada.largura === 180 && imagemDimensaoErrada.altura === 180);

  // ---- caso vermelho plantado: ligação removida de uma página --------
  const paginaReal = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');
  const paginaSemLigacao = paginaReal.replace(/<link\s+rel="apple-touch-icon"[^>]*>/, '');
  const cabecaSemLigacao = /<head[^>]*>([\s\S]*?)<\/head>/.exec(paginaSemLigacao)[1];
  const contagemNaPaginaMutada = [...cabecaSemLigacao.matchAll(/<link\b[^>]*\brel="apple-touch-icon"[^>]*>/g)].length;

  return {
    medicao: 2,
    ficheiro: caminho,
    largura: imagem.largura,
    altura: imagem.altura,
    dimensoesConformes,
    tipoDeCorPNG: imagem.tipoDeCor,
    temCanalAlfaDeclarado: imagem.temCanalAlfa,
    pixeisTotais: imagem.largura * imagem.altura,
    pixeisTransparentes: transparentes,
    opacidadeConforme,
    rotas: {
      totalRotas: rotas.length,
      rotasComCabecaPWA: rotasRegulares.length,
      rotasSemCabecaPWA: rotasSemCabecaPWA.map((r) => `${r.edicao}:${r.rota}`),
      rotasComCabecaPWASemLigacaoAppleTouch: semLigacao.map((r) => `${r.edicao}:${r.rota}`),
    },
    casoConhecido: {
      descricao:
        'cópia em memória de apple-touch-icon.png com o alfa do píxel (0,0) posto a 0; um PNG 179×180 sintético; e uma cópia de dist/index.html com a ligação apple-touch-icon removida por regex.',
      pixeisTransparentesNaCopiaMutada: transparentesMutado,
      viuVermelhoNaOpacidade: !opacidadeConformeMutado,
      viuVermelhoNaDimensao: dimensaoErradaDetetada,
      contagemDeLigacoesNaPaginaMutada: contagemNaPaginaMutada,
      viuVermelhoNaLigacaoRemovida: contagemNaPaginaMutada === 0,
    },
  };
}
