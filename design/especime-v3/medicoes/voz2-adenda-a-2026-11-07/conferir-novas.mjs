// VOZ-2, adenda A (07.11.2026): cada campo nova das duas listas passa pela régua da página como ela mede (frase a frase), e as formas antigas plantadas mordem.
// Executar da raiz: node design/especime-v3/medicoes/voz2-adenda-a-2026-11-07/conferir-novas.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {frasesDoTexto, medirPagina} from '../../../../scripts/voz-autorreferencia.mjs';

const pasta = path.dirname(fileURLToPath(import.meta.url));
const medicoes = path.resolve(pasta, '..');
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const recusa = t => frasesDoTexto(t).length + medirPagina('<p>' + esc(t) + '</p>', '/voz2-prova-da-adenda').frases.length;
const reescritas = Object.keys(JSON.parse(fs.readFileSync(path.join(pasta, 'novas-adenda-a.json'), 'utf8')));
let total = 0;
const vermelhas = [];
for (const [b, nome] of [['voz2a-2026-11-07', 'FRASES-VOZ-2A.json'], ['voz2b-2026-11-07', 'FRASES-VOZ-2B.json']]) {
  for (const f of JSON.parse(fs.readFileSync(path.join(medicoes, b, nome), 'utf8')).filter(f => f.classe === 'REESCREVE')) {
    total++;
    if (recusa(f.nova)) vermelhas.push(f.id);
  }
}
// As formas antigas de três das frases reescritas: têm de dar vermelho.
const plantas = [
  'and then that money does not come in (inference).',
  'Os três moveram-se com as marés nacionais e nada do que aqui foi lido fornece o contrafactual (inferência).',
  'Iniciativa Liberal, updated on 8 June 2026 (the page does not say when it was published).'
];
const mordem = plantas.filter(recusa).length;
console.log(`campos nova: ${total}; reescritos nesta adenda: ${reescritas.length}; recusados pela régua: ${vermelhas.length}${vermelhas.length ? ' (' + vermelhas.join(', ') + ')' : ''}`);
console.log(`plantas das formas antigas que mordem: ${mordem} de ${plantas.length}`);
process.exitCode = vermelhas.length || mordem !== plantas.length ? 1 : 0;
