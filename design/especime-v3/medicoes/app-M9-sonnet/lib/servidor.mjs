// medicoes/lib/servidor.mjs
//
// Um servidor estático mínimo, escrito de raiz com node:http, só para dar ao
// Playwright um endereço http:// a partir de um `dist/` construído (o motor
// gera ligações absolutas do sítio, tipo `/js/tema.js`, que não resolvem por
// `file://`). Sem dependências, sem cache, sem nada que o sítio não peça.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TIPOS_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
};

export function servirEstatico(raiz) {
  const servidor = http.createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.includes('..')) {
        res.writeHead(400);
        res.end();
        return;
      }
      let ficheiro = path.join(raiz, urlPath);
      const tentativas = urlPath.endsWith('/')
        ? [path.join(ficheiro, 'index.html')]
        : [ficheiro, path.join(ficheiro, 'index.html'), ficheiro + '.html'];
      let achado = null;
      for (const t of tentativas) {
        if (fs.existsSync(t) && fs.statSync(t).isFile()) {
          achado = t;
          break;
        }
      }
      if (!achado) {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('não encontrado: ' + urlPath);
        return;
      }
      const ext = path.extname(achado).toLowerCase();
      res.writeHead(200, { 'content-type': TIPOS_MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(achado).pipe(res);
    } catch (erro) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end(String(erro));
    }
  });

  return new Promise((resolve) => {
    servidor.listen(0, '127.0.0.1', () => {
      const { port } = servidor.address();
      resolve({
        base: `http://127.0.0.1:${port}`,
        fechar: () => new Promise((r) => servidor.close(() => r())),
      });
    });
  });
}
