/** MET2 e HIG-6A: endereços da organização e ligações ao GitHub não saem. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

// Desfaz escapes JSON e percentagens, incluindo uma codificação dentro da outra.
export function descodificar(texto) {
  let atual = texto;
  for (let i = 0; i < 8; i++) {
    const novo = atual.replace(/\\u([\da-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\\//g, '/').replace(/%([\da-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
    if (novo === atual) return novo;
    atual = novo;
  }
  return atual;
}
export function enderecoDaOrganizacao(texto) {
  return /github\.com\/oestadodopais|oestadodopais\.github\.io|raw\.githubusercontent\.com\/oestadodopais/i.test(descodificar(texto));
}
function suspeita(valor) {
  const href = descodificar(parse('<span>' + valor.replaceAll('<', '&lt;') + '</span>').textContent).trim();
  if (/%(?![\da-f]{2})/i.test(href)) return true;
  try {
    const host = new URL(href, 'https://met2.invalid/').hostname.toLowerCase().replace(/\.$/, '');
    return host === 'github.com' || host.endsWith('.github.com') || host === 'raw.githubusercontent.com' || host.endsWith('.github.io');
  } catch { return true; }
}
export function ligacoesAoGithub(root) {
  return root.querySelectorAll('[href],[xlink\\:href],[src],[action],meta[http-equiv]').filter(n => {
    if (['href', 'xlink:href', 'src', 'action'].some(a => n.hasAttribute(a) && suspeita(n.getAttribute(a)))) return true;
    if ((n.getAttribute('http-equiv') ?? '').toLowerCase() !== 'refresh') return false;
    const content = n.getAttribute('content') ?? '';
    if (/^\s*\d+(?:\.\d+)?\s*$/.test(content)) return false;
    const m = content.match(/^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(.*?)\s*$/i);
    if (!m) return true;
    const valor = m[1].replace(/^(["'])(.*)\1$/, '$2');
    return !valor || suspeita(valor);
  });
}
export function conferirRepositorioNoDist(dist) {
  const erros = [];
  function visitar(dir) {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const ficheiro = path.join(dir, entrada.name);
      if (entrada.isDirectory()) { visitar(ficheiro); continue; }
      const rel = path.relative(dist, ficheiro), texto = fs.readFileSync(ficheiro, 'utf8');
      if (enderecoDaOrganizacao(texto)) erros.push({ rel, msg: 'MET2: endereço da organização no ficheiro publicado.' });
      if (/\.html?$/i.test(entrada.name) && ligacoesAoGithub(parse(texto)).length) erros.push({ rel, msg: 'MET2: ligação para github.com ou ligação suspeita no HTML publicado.' });
    }
  }
  visitar(dist);
  return erros;
}
