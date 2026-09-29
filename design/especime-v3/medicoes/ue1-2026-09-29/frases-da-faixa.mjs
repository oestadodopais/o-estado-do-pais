import fs from 'node:fs';
import { parse, NodeType } from 'node-html-parser';
const DECL = '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],[data-agenda],[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta],[data-mudanca-campo],[data-publicacao-estudo],[data-ponto],[data-ponto-bandeira],[data-pais],[data-serie-campo],[data-ponto-conta],[data-ponto-lugar],[data-tabela-dos-paises],[data-medida-nome],[data-medida-unidade],[data-cobertura],[data-lugar],[data-nome]';
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const vistos = new Map();
for (const f of process.argv.slice(2)) {
  const root = parse(fs.readFileSync(f, 'utf8'));
  const marcados = new Set(root.querySelectorAll(DECL));
  for (const el of root.querySelectorAll('[data-faixa-frase]')) {
    const partes = [];
    const anda = (n) => { if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText); const tag = String(n.rawTagName ?? '').toLowerCase(); if (tag==='a'||tag==='button') return; if (marcados.has(n)) return; for (const c of n.childNodes ?? []) anda(c); };
    anda(el);
    const t = norm(partes.join(' '));
    vistos.set(t, (vistos.get(t) ?? 0) + 1);
  }
}
for (const [t, n] of vistos) console.log(n, JSON.stringify(t));
