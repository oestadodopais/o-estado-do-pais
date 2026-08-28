#!/usr/bin/env node
// medicoes/app-M9-sonnet.mjs
//
// O programa da medição cega do bloco «a aplicação no telemóvel» (M9),
// escrito por Claude Sonnet a partir de `design/especime-v3/briefs/BRIEF-app-M9.md`.
// Corre as nove medições do brief com código próprio (ficheiros `lib/` deste
// mesmo diretório): nenhum módulo de `scripts/` nem de `src/` do sítio é
// importado. Duas exceções, as que o brief autoriza: `npm run verify` e
// `npm run typecheck` correm como comandos externos (medição 9), e o
// Playwright do repositório mede o que só um navegador a sério pode medir
// (medições 5 e 6).
//
// USO:
//   node app-M9-sonnet.mjs [--sem-antes]
//
// Por omissão, espera as duas construções lado a lado:
//   ../../../../dist                         (a cópia medida, app-2026-08-28)
//   ../../../wt-before-162df96/dist          (o "antes", main @ 162df96)
// Os caminhos dão-se por variáveis de ambiente, para não presumir onde este
// ficheiro vive quando outra pessoa o correr: MEDICOES_DIST_DEPOIS,
// MEDICOES_DIST_ANTES, MEDICOES_REPO_ROOT, MEDICOES_TOKENS_CSS.
//
// Imprime um relatório de texto no stdout: um bloco por medição, com os
// números, e ao fundo de cada bloco o caso vermelho plantado e se ele
// acendeu. Não escreve nada em disco.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { medir as m1 } from './m1-manifestos.mjs';
import { medir as m2 } from './m2-apple-touch-icon.mjs';
import { medir as m3 } from './m3-zona-segura-maskable.mjs';
import { medir as m4 } from './m4-favicons.mjs';
import { medir as m5 } from './m5-cabeca-em-todas-as-rotas.mjs';
import { medir as m6 } from './m6-cabecalho-com-a-marca.mjs';
import { medir as m7 } from './m7-a-marca-e-a-mesma-forma.mjs';
import { medir as m8 } from './m8-nada-de-mais.mjs';
import { medir as m9 } from './m9-a-cadeia.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = process.env.MEDICOES_REPO_ROOT ?? path.resolve(AQUI, '../../../');
const DIST_DEPOIS = process.env.MEDICOES_DIST_DEPOIS ?? path.join(REPO_ROOT, 'dist');
const DIST_ANTES = process.env.MEDICOES_DIST_ANTES ?? null; // sem omissão: quem correr sem o "antes" ao lado tem de o dizer
const TOKENS_CSS = process.env.MEDICOES_TOKENS_CSS ?? path.join(REPO_ROOT, 'src/styles/tokens.css');

const semAntes = process.argv.includes('--sem-antes');

function titulo(t) {
  console.log('\n' + '='.repeat(78));
  console.log(t);
  console.log('='.repeat(78));
}

function linha(rotulo, valor) {
  console.log(`  ${rotulo}: ${JSON.stringify(valor)}`);
}

async function principal() {
  const inicioGeral = Date.now();
  const resultados = {};

  titulo('MEDIÇÃO 1 · OS MANIFESTOS');
  resultados.m1 = await m1({ distRoot: DIST_DEPOIS, tokensCssPath: TOKENS_CSS });
  for (const [ed, r] of Object.entries(resultados.m1.edicoes)) {
    linha(`edição ${ed}, conforme`, r.conforme);
    if (!r.conforme) linha(`edição ${ed}, problemas`, r.problemas);
  }
  linha('caso conhecido, viu vermelho (mutação)', resultados.m1.casoConhecido.viuVermelhoNaCopiaMutada);
  linha('caso conhecido, viu vermelho (JSON partido)', resultados.m1.casoConhecido.viuVermelhoNoJsonPartido);

  titulo('MEDIÇÃO 2 · O ÍCONE DO IPHONE');
  resultados.m2 = await m2({ distRoot: DIST_DEPOIS });
  linha('dimensões', `${resultados.m2.largura}x${resultados.m2.altura}`);
  linha('píxeis transparentes', resultados.m2.pixeisTransparentes);
  linha('opacidade conforme', resultados.m2.opacidadeConforme);
  linha('rotas com cabeça PWA', resultados.m2.rotas.rotasComCabecaPWA);
  linha('rotas sem cabeça PWA', resultados.m2.rotas.rotasSemCabecaPWA.length);
  linha('rotas com cabeça PWA sem ligação apple-touch-icon', resultados.m2.rotas.rotasComCabecaPWASemLigacaoAppleTouch.length);
  linha('caso conhecido, viu vermelho (opacidade)', resultados.m2.casoConhecido.viuVermelhoNaOpacidade);
  linha('caso conhecido, viu vermelho (dimensão)', resultados.m2.casoConhecido.viuVermelhoNaDimensao);
  linha('caso conhecido, viu vermelho (ligação removida)', resultados.m2.casoConhecido.viuVermelhoNaLigacaoRemovida);

  titulo('MEDIÇÃO 3 · A ZONA SEGURA DO MASKABLE');
  resultados.m3 = await m3({ distRoot: DIST_DEPOIS });
  linha('centro', resultados.m3.centro);
  linha('raio', resultados.m3.raio);
  linha('píxeis de tinta', resultados.m3.pixeisDeTinta);
  linha('margem mínima (px)', resultados.m3.margemMinimaPx);
  linha('pior píxel', resultados.m3.piorPixel);
  linha('dentro da zona segura', resultados.m3.dentroDaZonaSegura);
  linha('caso conhecido, viu vermelho', resultados.m3.casoConhecido.viuVermelho);

  titulo('MEDIÇÃO 4 · OS FAVICONS');
  resultados.m4 = await m4({ distRoot: DIST_DEPOIS });
  linha('ICO conforme (32 e 16 presentes)', resultados.m4.ico.conforme);
  linha('SVG bem formado', resultados.m4.svg.bemFormado);
  linha('SVG tem regra prefers-color-scheme:dark', resultados.m4.svg.temRegraPrefersColorSchemeDark);
  linha('rotas sem exactamente 2 rel=icon', resultados.m4.rotas.semExactamenteDoisRelIcon.length);
  linha('caso conhecido, viu vermelho (ICO)', resultados.m4.casoConhecido.viuVermelhoNoIco);
  linha('caso conhecido, viu vermelho (SVG partido)', resultados.m4.casoConhecido.viuVermelhoNoSvgPartido);
  linha('caso conhecido, viu vermelho (regra escuro)', resultados.m4.casoConhecido.viuVermelhoNaRegraEscuro);
  linha('caso conhecido, viu vermelho (ligação removida)', resultados.m4.casoConhecido.viuVermelhoNaLigacaoRemovida);

  titulo('MEDIÇÃO 5 · A CABEÇA EM TODAS AS ROTAS');
  resultados.m5 = await m5({ distRoot: DIST_DEPOIS, tokensCssPath: TOKENS_CSS });
  linha('rotas com cabeça PWA', resultados.m5.estatico.totalComCabecaPWA);
  linha('rotas com problemas', resultados.m5.estatico.rotasComProblemas.length);
  linha('parte estática conforme', resultados.m5.estatico.conforme);
  linha('trocas de tema conformes', resultados.m5.dinamico.trocasConformes);
  for (const t of resultados.m5.dinamico.trocas) linha(`troca em ${t.rota}`, `${t.antes} -> ${t.depois} (data-theme=${t.dataTheme})`);
  linha('caso conhecido, viu vermelho (tema.js bloqueado)', resultados.m5.casoConhecido.viuVermelho);
  linha('caso conhecido, viu vermelho (ligação manifest removida)', resultados.m5.casoConhecidoLigacaoRemovida.viuVermelho);

  titulo('MEDIÇÃO 6 · O CABEÇALHO COM A MARCA');
  resultados.m6 = await m6({
    distRootDepois: DIST_DEPOIS,
    distRootAntes: semAntes ? null : DIST_ANTES,
    tokensCssPath: TOKENS_CSS,
  });
  for (const linhaMatriz of resultados.m6.matriz) {
    linha(
      `${linhaMatriz.rota} @ ${linhaMatriz.largura}px`,
      `header ${linhaMatriz.alturaHeaderAntes}->${linhaMatriz.alturaHeaderDepois} (diff ${linhaMatriz.diffAlturaHeaderPx}), alinhamento por tinta ${linhaMatriz.alinhamentoPorTintaPx}px (conforme=${linhaMatriz.alinhamentoConforme})`,
    );
  }
  for (const t of resultados.m6.temaEscuro) linha(`tema escuro, cor do "e" em ${t.rota}`, `${t.corResolvida} (esperado ${t.corEsperada}, conforme=${t.conforme})`);
  linha('caso conhecido, viu vermelho (alinhamento)', resultados.m6.casoConhecido.viuVermelhoNoAlinhamento);
  linha('caso conhecido, viu vermelho (diferença de altura)', resultados.m6.casoConhecido.viuVermelhoNaDiferencaDeAltura);
  linha('caso conhecido, viu vermelho (cor escura presa)', resultados.m6.casoConhecido.viuVermelhoNaCorEscura);

  titulo('MEDIÇÃO 7 · A MARCA É A MESMA FORMA');
  resultados.m7 = await m7({ distRoot: DIST_DEPOIS, repoRoot: REPO_ROOT });
  linha('favicon === direção e2-unida-28 (.sinal)', resultados.m7.caminhos.faviconVsDirecao.iguais);
  linha('cabeçalho === direção e2-unida-28 (.sinal)', resultados.m7.caminhos.headerVsDirecao.iguais);
  linha('favicon === cabeçalho', resultados.m7.caminhos.faviconVsHeader.iguais);
  linha('apple-touch-icon, píxeis diferentes', `${resultados.m7.renderApple.pixeisDiferentes} de ${resultados.m7.renderApple.pixeisTotais} (${resultados.m7.renderApple.percentagemDiferente.toFixed(3)}%)`);
  linha('apple-touch-icon, dentro do limiar de 0,5%', resultados.m7.renderApple.dentroDoLimiar);
  linha('caso conhecido, viu vermelho (caminho mutado)', resultados.m7.casoConhecido.viuVermelhoNoCaminho);
  linha('caso conhecido, viu vermelho (cor errada no render)', resultados.m7.casoConhecido.viuVermelhoNaCorErrada);

  titulo('MEDIÇÃO 8 · NADA DE MAIS');
  resultados.m8 = await m8({ distRoot: DIST_DEPOIS });
  linha('ficheiros JS conferidos', resultados.m8.js.totalFicheiros);
  linha('JS conforme (sem serviceWorker nem beforeinstallprompt)', resultados.m8.js.conforme);
  linha('rotas conferidas', resultados.m8.paginas.totalRotas);
  linha('páginas conforme', resultados.m8.paginas.conforme);
  linha('caso conhecido, viu vermelho (JS)', resultados.m8.casoConhecido.viuVermelhoNoJs);
  linha('caso conhecido, viu vermelho (HTML)', resultados.m8.casoConhecido.viuVermelhoNoHtml);

  titulo('MEDIÇÃO 9 · A CADEIA');
  resultados.m9 = await m9({ repoRoot: REPO_ROOT });
  linha('npm run verify, código de saída', resultados.m9.verify.codigoDeSaida);
  linha('npm run verify, duração (ms)', resultados.m9.verify.duracaoMs);
  linha('npm run typecheck, código de saída', resultados.m9.typecheck.codigoDeSaida);
  linha('npm run typecheck, duração (ms)', resultados.m9.typecheck.duracaoMs);
  linha('caso conhecido, viu vermelho', resultados.m9.casoConhecido.viuVermelho);

  titulo('FIM');
  linha('duração total (ms)', Date.now() - inicioGeral);

  // Um só bloco JSON completo ao fundo, para quem quiser processar a saída
  // sem reanalisar o texto acima.
  console.log('\n--- JSON COMPLETO ---');
  console.log(JSON.stringify(resultados, null, 2));
}

principal().catch((erro) => {
  console.error('ERRO NA MEDIÇÃO:', erro);
  process.exit(1);
});
