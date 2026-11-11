import fs from 'node:fs';
import { WORKS } from '../src/data/studies.mjs';
import { redirecionamentosDosRetirados } from './estudos-retirados-conferir.mjs';
const partida = JSON.parse(fs.readFileSync('design/especime-v3/medicoes/rec2-2026-11-11/rotas-de-partida.json','utf8'));
const vercel = JSON.parse(fs.readFileSync('vercel.json','utf8'));
const entradas = redirecionamentosDosRetirados(WORKS, partida), origens = new Set(entradas.map(r => r.src));
vercel.routes = [...entradas, ...vercel.routes.filter(r => !origens.has(r.src))];
fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2)+'\n');
console.log(`REC2: ${entradas.length} redirecionamentos gerados de sucedidoPor.`);
