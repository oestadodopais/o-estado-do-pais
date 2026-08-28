// medicoes/m8-nada-de-mais.mjs — medição 8: nenhum service worker, nenhum beforeinstallprompt.
import fs from 'node:fs';
import path from 'node:path';
import { analisarRotas } from './lib/analiseRotas.mjs';

function listarFicheiros(dir, saida) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entrada.name);
    if (entrada.isDirectory()) listarFicheiros(abs, saida);
    else saida.push(abs);
  }
}

function conferirTexto(texto) {
  return {
    temServiceWorker: /serviceWorker/.test(texto),
    temBeforeInstallPrompt: /beforeinstallprompt/i.test(texto),
  };
}

export async function medir({ distRoot }) {
  // ---- dist/js/*.js -----------------------------------------------------
  const dirJs = path.join(distRoot, 'js');
  const ficheirosJs = [];
  listarFicheiros(dirJs, ficheirosJs);
  const jsComProblema = [];
  for (const f of ficheirosJs) {
    const texto = fs.readFileSync(f, 'utf8');
    const r = conferirTexto(texto);
    if (r.temServiceWorker || r.temBeforeInstallPrompt) jsComProblema.push({ ficheiro: f, ...r });
  }

  // ---- todas as páginas construídas (cabeça e corpo, via a mesma passagem da M2/M4/M5) --
  const rotas = analisarRotas(distRoot);
  const paginasComServiceWorker = rotas.filter((r) => r.temServiceWorkerNoTexto).map((r) => `${r.edicao}:${r.rota}`);
  const paginasComBeforeInstallPrompt = rotas
    .filter((r) => r.temBeforeInstallPromptNoTexto)
    .map((r) => `${r.edicao}:${r.rota}`);

  // ---- caso vermelho plantado: um JS sintético com as duas cadeias ------
  const jsPlantado = `
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); });
  `;
  const conferenciaPlantada = conferirTexto(jsPlantado);

  const htmlPlantado = `<!doctype html><html><head></head><body><script>navigator.serviceWorker.register('/sw.js');</script></body></html>`;
  const conferenciaHtmlPlantada = conferirTexto(htmlPlantado);

  return {
    medicao: 8,
    js: {
      totalFicheiros: ficheirosJs.length,
      ficheiros: ficheirosJs,
      comProblema: jsComProblema,
      conforme: jsComProblema.length === 0,
    },
    paginas: {
      totalRotas: rotas.length,
      comServiceWorker: paginasComServiceWorker,
      comBeforeInstallPrompt: paginasComBeforeInstallPrompt,
      conforme: paginasComServiceWorker.length === 0 && paginasComBeforeInstallPrompt.length === 0,
    },
    casoConhecido: {
      descricao:
        'um ficheiro JS sintético com navigator.serviceWorker.register(...) e um listener de beforeinstallprompt, passado ao mesmo detetor de texto; e uma página HTML sintética com o mesmo registo de service worker num <script> inline.',
      conferenciaDoJsPlantado: conferenciaPlantada,
      viuVermelhoNoJs: conferenciaPlantada.temServiceWorker && conferenciaPlantada.temBeforeInstallPrompt,
      conferenciaDoHtmlPlantado: conferenciaHtmlPlantada,
      viuVermelhoNoHtml: conferenciaHtmlPlantada.temServiceWorker,
    },
  };
}
