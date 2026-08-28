// medicoes/m4-favicons.mjs — medição 4: os favicons.
import fs from 'node:fs';
import path from 'node:path';
import { parsearICO } from './lib/png.mjs';
import { verificarXMLBemFormado } from './lib/xml.mjs';
import { analisarRotas } from './lib/analiseRotas.mjs';

const REGRA_ESCURO = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/i;

/** Um ICO sintético mínimo com só as entradas de tamanho pedidas, para o caso vermelho. */
function construirICOSintetico(tamanhos) {
  const cabecalho = Buffer.alloc(6 + 16 * tamanhos.length);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(tamanhos.length, 4);
  let deslocamento = cabecalho.length;
  const corpos = [];
  tamanhos.forEach((t, idx) => {
    const base = 6 + idx * 16;
    cabecalho[base] = t === 256 ? 0 : t;
    cabecalho[base + 1] = t === 256 ? 0 : t;
    cabecalho[base + 2] = 0;
    cabecalho[base + 3] = 0;
    cabecalho.writeUInt16LE(1, base + 4);
    cabecalho.writeUInt16LE(32, base + 6);
    const corpo = Buffer.alloc(4); // conteúdo irrelevante para este teste, só o diretório interessa
    cabecalho.writeUInt32LE(corpo.length, base + 8);
    cabecalho.writeUInt32LE(deslocamento, base + 12);
    deslocamento += corpo.length;
    corpos.push(corpo);
  });
  return Buffer.concat([cabecalho, ...corpos]);
}

function conferirICO(entradas) {
  const tem32 = entradas.some((e) => e.largura === 32 && e.altura === 32);
  const tem16 = entradas.some((e) => e.largura === 16 && e.altura === 16);
  return { tem32, tem16, conforme: tem32 && tem16 };
}

export async function medir({ distRoot }) {
  // ---- favicon.ico --------------------------------------------------
  const caminhoIco = path.join(distRoot, 'favicon.ico');
  const entradasIco = parsearICO(fs.readFileSync(caminhoIco));
  const conferenciaIco = conferirICO(entradasIco);

  // ---- favicon.svg ----------------------------------------------------
  const caminhoSvg = path.join(distRoot, 'favicon.svg');
  const textoSvg = fs.readFileSync(caminhoSvg, 'utf8');
  const formaSvg = verificarXMLBemFormado(textoSvg);
  const temRegraEscuro = REGRA_ESCURO.test(textoSvg);

  // ---- rel="icon" nas rotas -------------------------------------------
  const rotas = analisarRotas(distRoot);
  const rotasComCabecaPWA = rotas.filter(
    (r) => r.contagemLinksIcon > 0 || r.contagemLinksManifest > 0 || r.contagemLinksAppleTouch > 0,
  );
  const semDoisIcons = rotasComCabecaPWA.filter((r) => r.contagemLinksIcon !== 2);
  const semIco = rotasComCabecaPWA.filter((r) => !r.linksIcon.some((l) => l.includes('favicon.ico')));
  const semSvg = rotasComCabecaPWA.filter((r) => !r.linksIcon.some((l) => l.includes('favicon.svg')));

  // ---- casos vermelhos plantados ---------------------------------------
  const icoSoUm = construirICOSintetico([32]);
  const conferenciaIcoMutado = conferirICO(parsearICO(icoSoUm));

  const svgPartido = textoSvg.replace('</svg>', ''); // tira o fecho
  const formaSvgMutado = verificarXMLBemFormado(svgPartido);

  const svgSemEscuro = textoSvg.replace(/@media\s*\([^)]*prefers-color-scheme[^)]*\)\s*\{[^}]*\}/, '');
  const temRegraEscuroMutado = REGRA_ESCURO.test(svgSemEscuro);

  const paginaReal = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8');
  const paginaSemIcons = paginaReal.replace(/<link\s+rel="icon"[^>]*>/g, '');
  const cabecaSemIcons = /<head[^>]*>([\s\S]*?)<\/head>/.exec(paginaSemIcons)[1];
  const contagemIconsNaPaginaMutada = [...cabecaSemIcons.matchAll(/<link\b[^>]*\brel="icon"[^>]*>/g)].length;

  return {
    medicao: 4,
    ico: {
      caminho: caminhoIco,
      entradas: entradasIco,
      ...conferenciaIco,
    },
    svg: {
      caminho: caminhoSvg,
      bemFormado: formaSvg.bemFormado,
      erroDeForma: formaSvg.erro,
      temRegraPrefersColorSchemeDark: temRegraEscuro,
    },
    rotas: {
      totalComCabecaPWA: rotasComCabecaPWA.length,
      semExactamenteDoisRelIcon: semDoisIcons.map((r) => `${r.edicao}:${r.rota} (${r.contagemLinksIcon})`),
      semLigacaoAoIco: semIco.map((r) => `${r.edicao}:${r.rota}`),
      semLigacaoAoSvg: semSvg.map((r) => `${r.edicao}:${r.rota}`),
    },
    casoConhecido: {
      descricao:
        'um ICO sintético só com a entrada de 32×32 (falta 16×16); uma cópia de favicon.svg sem a etiqueta de fecho </svg>; uma cópia de favicon.svg sem a regra prefers-color-scheme:dark; uma cópia de dist/index.html sem as duas ligações rel="icon".',
      icoSoUm: conferenciaIcoMutado,
      viuVermelhoNoIco: !conferenciaIcoMutado.conforme,
      svgPartidoBemFormado: formaSvgMutado.bemFormado,
      viuVermelhoNoSvgPartido: !formaSvgMutado.bemFormado,
      temRegraEscuroNaCopiaSemRegra: temRegraEscuroMutado,
      viuVermelhoNaRegraEscuro: !temRegraEscuroMutado,
      contagemIconsNaPaginaMutada,
      viuVermelhoNaLigacaoRemovida: contagemIconsNaPaginaMutada === 0,
    },
  };
}
