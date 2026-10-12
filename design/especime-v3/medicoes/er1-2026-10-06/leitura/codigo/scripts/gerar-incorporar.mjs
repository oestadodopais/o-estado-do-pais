import fs from 'node:fs';
import { incorporar } from './incorporar-cliente.mjs';
import { SITE_URL } from '../site.config.mjs';
const codigo = `/* Gerado por scripts/gerar-incorporar.mjs. */\n(${incorporar.toString()})(${JSON.stringify(new URL(SITE_URL).origin)});\n`;
if (process.argv.includes('--conferir')) {
  if (fs.readFileSync('public/incorporar.js', 'utf8') !== codigo) throw Error('ER1 guião: os bytes servidos diferem do gerador.');
} else fs.writeFileSync('public/incorporar.js', codigo);
