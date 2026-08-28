// medicoes/m7-a-marca-e-a-mesma-forma.mjs — medição 7.
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { normalizarCaminho, extrairCaminhosDeTinta, extrairTodosOsCaminhos } from './lib/svg.mjs';
import { decodificarPNG, codificarPNG } from './lib/png.mjs';

function extrairBlocoWordmarkE(html) {
  const m = /<svg class="wordmark-e"[^>]*>[\s\S]*?<\/svg>/.exec(html);
  return m ? m[0] : null;
}

/** Compara duas listas de caminhos normalizados, por posição. */
function compararListasDeCaminhos(a, b) {
  if (a.length !== b.length) return { iguais: false, motivo: `contagens diferentes: ${a.length} contra ${b.length}` };
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return { iguais: false, motivo: `caminho ${i} difere`, a: a[i], b: b[i] };
  }
  return { iguais: true, motivo: null };
}

function diferencaDePixeis(imgA, imgB) {
  if (imgA.largura !== imgB.largura || imgA.altura !== imgB.altura) {
    throw new Error(`dimensões diferentes: ${imgA.largura}x${imgA.altura} contra ${imgB.largura}x${imgB.altura}`);
  }
  const LIMIAR = 20; // por canal, em 0..255
  let diferentes = 0;
  const total = imgA.largura * imgA.altura;
  for (let i = 0; i < imgA.rgba.length; i += 4) {
    const dr = Math.abs(imgA.rgba[i] - imgB.rgba[i]);
    const dg = Math.abs(imgA.rgba[i + 1] - imgB.rgba[i + 1]);
    const db = Math.abs(imgA.rgba[i + 2] - imgB.rgba[i + 2]);
    const da = Math.abs(imgA.rgba[i + 3] - imgB.rgba[i + 3]);
    if (dr > LIMIAR || dg > LIMIAR || db > LIMIAR || da > LIMIAR) diferentes++;
  }
  return { diferentes, total, percentagem: (100 * diferentes) / total };
}

function renderizarPara180(svgTexto, corCampoOverride = null) {
  let svg = svgTexto.replace(/width="512" height="512"/, 'width="180" height="180"');
  if (corCampoOverride) svg = svg.replace('.campo { fill: #17191b; }', `.campo { fill: ${corCampoOverride}; }`);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 180 } });
  const render = resvg.render();
  return { largura: render.width, altura: render.height, rgba: render.pixels, temCanalAlfa: true };
}

export async function medir({ distRoot, repoRoot }) {
  const caminhoFavicon = path.join(distRoot, 'favicon.svg');
  const caminhoHeaderHtml = path.join(distRoot, 'index.html');
  const caminhoDirecao = path.join(repoRoot, 'design/marca/direcoes-e2/e2-unida-28.svg');
  const caminhoCela = path.join(repoRoot, 'design/marca/direcoes-e2/e2c-unida-28-papel-tinta.svg');
  const caminhoAppleTouchIcon = path.join(distRoot, 'apple-touch-icon.png');

  const textoFavicon = fs.readFileSync(caminhoFavicon, 'utf8');
  const textoHtml = fs.readFileSync(caminhoHeaderHtml, 'utf8');
  const textoDirecao = fs.readFileSync(caminhoDirecao, 'utf8');
  const textoCela = fs.readFileSync(caminhoCela, 'utf8');

  const caminhosFavicon = extrairCaminhosDeTinta(textoFavicon);
  const blocoHeader = extrairBlocoWordmarkE(textoHtml);
  const caminhosHeader = blocoHeader ? extrairTodosOsCaminhos(blocoHeader) : [];
  // e2-unida-28.svg tem os 2 caminhos do grupo .sinal e depois os mesmos 2,
  // repetidos, no grupo .sinal-favicon (ver o ficheiro): os 2 primeiros são o
  // grupo .sinal, que é o que o favicon e o cabeçalho usam.
  const caminhosDirecaoTodos = extrairCaminhosDeTinta(textoDirecao);
  const caminhosDirecao = caminhosDirecaoTodos.slice(0, 2);

  const normFavicon = caminhosFavicon.map((d) => normalizarCaminho(d));
  const normHeader = caminhosHeader.map((d) => normalizarCaminho(d));
  const normDirecao = caminhosDirecao.map((d) => normalizarCaminho(d));

  const faviconVsDirecao = compararListasDeCaminhos(normFavicon, normDirecao);
  const headerVsDirecao = compararListasDeCaminhos(normHeader, normDirecao);
  const faviconVsHeader = compararListasDeCaminhos(normFavicon, normHeader);

  // ---- o render do apple-touch-icon a partir do SVG de origem -----------
  const renderCela = renderizarPara180(textoCela);
  const realApple = decodificarPNG(fs.readFileSync(caminhoAppleTouchIcon));
  const diffRender = diferencaDePixeis(renderCela, realApple);

  // ---- casos vermelhos plantados -----------------------------------------
  // (a) muda uma coordenada de um caminho do favicon e confere que a comparação acende
  const caminhoFaviconMutado = caminhosFavicon[0].replace('404.52', '404.99');
  const compFaviconMutado = compararListasDeCaminhos([normalizarCaminho(caminhoFaviconMutado)], [normDirecao[0]]);

  // (b) renderiza a cela com o par de cores errado (ambar-tinta em vez de papel-tinta)
  const renderErrado = renderizarPara180(textoCela, '#e0a21a');
  const diffRenderErrado = diferencaDePixeis(renderErrado, realApple);

  return {
    medicao: 7,
    caminhos: {
      favicon: normFavicon,
      header: normHeader,
      direcaoE2Unida28: normDirecao,
      faviconVsDirecao,
      headerVsDirecao,
      faviconVsHeader,
      todosIguais: faviconVsDirecao.iguais && headerVsDirecao.iguais && faviconVsHeader.iguais,
    },
    renderApple: {
      ficheiroOrigemSvg: caminhoCela,
      ficheiroReal: caminhoAppleTouchIcon,
      dimensoesRender: `${renderCela.largura}x${renderCela.altura}`,
      dimensoesReal: `${realApple.largura}x${realApple.altura}`,
      pixeisDiferentes: diffRender.diferentes,
      pixeisTotais: diffRender.total,
      percentagemDiferente: diffRender.percentagem,
      dentroDoLimiar: diffRender.percentagem < 0.5,
    },
    casoConhecido: {
      descricao:
        'um caminho do favicon com uma coordenada mudada (404.52 → 404.99), comparado contra o caminho real da direção; e a mesma cela renderizada com o par de cores errado (âmbar sobre tinta em vez de papel sobre tinta), comparada pixel a pixel contra o apple-touch-icon.png real.',
      caminhoMutadoIgualAoReal: compFaviconMutado.iguais,
      viuVermelhoNoCaminho: !compFaviconMutado.iguais,
      percentagemDiferenteComCorErrada: diffRenderErrado.percentagem,
      viuVermelhoNaCorErrada: diffRenderErrado.percentagem >= 0.5,
    },
  };
}
