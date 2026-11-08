/** MET2: o endereço da organização não sai em nenhum ficheiro; o HTML não liga ao GitHub. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ORGANIZACAO = 'github.com/oestadodopais';

export function ligacoesAoGithub(root) {
  return root.querySelectorAll('[href],[xlink\\:href]').filter(n =>
    ['href', 'xlink:href'].some(atributo => {
      const href = n.getAttribute(atributo);
      if (!href) return false;
      try {
        const host = new URL(href, 'https://met2.invalid/').hostname.toLowerCase().replace(/\.$/, '');
        return host === 'github.com' || host.endsWith('.github.com');
      } catch { return false; }
    }),
  );
}

export function conferirRepositorioNoDist(dist) {
  const erros = [];
  function visitar(dir) {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const ficheiro = path.join(dir, entrada.name);
      if (entrada.isDirectory()) { visitar(ficheiro); continue; }
      const rel = path.relative(dist, ficheiro);
      // Sem filtro de extensão: inclui texto, metadados e ficheiros sem extensão.
      const texto = fs.readFileSync(ficheiro, 'utf8');
      if (texto.toLowerCase().includes(ORGANIZACAO)) erros.push({ rel, msg: 'MET2: endereço da organização no ficheiro publicado.' });
      if (/\.html?$/i.test(entrada.name) && ligacoesAoGithub(parse(texto)).length) erros.push({ rel, msg: 'MET2: ligação para github.com no HTML publicado.' });
    }
  }
  visitar(dist);
  return erros;
}
