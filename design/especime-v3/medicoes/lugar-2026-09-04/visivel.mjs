import fs from 'node:fs';
import { parse, NodeType } from 'node-html-parser';
const [,, ficheiro, ...termos] = process.argv;
const root = parse(fs.readFileSync(ficheiro, 'utf8'));
const corpo = root.querySelector('body');
const partes = [];
const anda = (n) => {
  if (!n) return;
  if (n.nodeType === NodeType.TEXT_NODE) { const t = n.rawText.replace(/\s+/g,' ').trim(); if (t) partes.push(t); return; }
  const tag = String(n.rawTagName ?? '').toLowerCase();
  if (tag === 'script' || tag === 'style') return;
  for (const f of n.childNodes ?? []) anda(f);
};
anda(corpo);
const re = new RegExp(termos.join('|'), 'i');
for (const t of [...new Set(partes)]) if (re.test(t)) console.log(' · ' + t.slice(0,180));
