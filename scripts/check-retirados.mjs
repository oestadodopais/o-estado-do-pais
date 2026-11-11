import fs from 'node:fs';
import { WORKS } from '../src/data/studies.mjs';
import { conferirPaginasDosEstudos } from './estudos-retirados-conferir.mjs';
const dist = process.env.OEDP_DIST ?? 'dist';
const rotas = fs.readdirSync(dist, {recursive:true}).filter(f => f.endsWith('/index.html'))
  .map(f => '/' + f.replace(/\/index.html$/, ''));
const erros = conferirPaginasDosEstudos(WORKS, rotas);
if (erros.length) { console.error(erros.join('\n')); process.exit(1); }
console.log(`REC2: ${WORKS.filter(w => w.estado === 'retirado').length} trabalhos retirados sem páginas; os restantes têm páginas nas duas línguas.`);
