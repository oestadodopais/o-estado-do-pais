import fs from 'node:fs';
import { WORKS } from '../src/data/studies.mjs';
import { conferirPaginasDosEstudos, conferirRedirecionamentos } from './estudos-retirados-conferir.mjs';
const dist = process.env.OEDP_DIST ?? 'dist';
const rotas = fs.readdirSync(dist, {recursive:true}).filter(f => f.endsWith('/index.html'))
  .map(f => '/' + f.replace(/\/index.html$/, ''));
const partida = JSON.parse(fs.readFileSync('design/especime-v3/medicoes/rec2-2026-11-11/rotas-de-partida.json', 'utf8'));
const tabela = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).routes;
const erros = [...conferirPaginasDosEstudos(WORKS, rotas), ...conferirRedirecionamentos(WORKS, partida, tabela, rotas)];
if (erros.length) { console.error(erros.join('\n')); process.exit(1); }
console.log(`REC2: ${WORKS.filter(w => w.estado === 'retirado').length} trabalhos retirados sem páginas; os restantes têm páginas nas duas línguas.`);
