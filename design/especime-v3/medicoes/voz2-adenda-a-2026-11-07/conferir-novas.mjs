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
// Os números: o gerador do motor recusa um documento cujas duas línguas não tenham os mesmos números; por estudo, o que as frases tiram (SAI inteira; REESCREVE a diferença) tem de ser o mesmo nas duas línguas, nos estudos que têm as duas.
const numeros = s => (s.match(/(?<![\p{L}\d])\d+(?:[.,]\d+)*/gu) ?? []).map(n => n.replace(',', '.'));
const tirados = new Map();
for (const [b, nome] of [['voz2a-2026-11-07', 'FRASES-VOZ-2A.json'], ['voz2b-2026-11-07', 'FRASES-VOZ-2B.json']]) {
  for (const f of JSON.parse(fs.readFileSync(path.join(medicoes, b, nome), 'utf8'))) {
    if (f.classe === 'FICA') continue;
    const fica = f.classe === 'REESCREVE' ? numeros(f.nova) : [];
    const lista = numeros(f.frase);
    for (const n of fica) { const i = lista.indexOf(n); if (i >= 0) lista.splice(i, 1); else lista.push('+' + n); }
    const chave = f.estudo + '|' + f.lingua;
    tirados.set(chave, [...(tirados.get(chave) ?? []), ...lista]);
  }
}
const desequilibrios = [];
for (const chave of tirados.keys()) {
  const [estudo, lingua] = chave.split('|');
  if (lingua !== 'pt' || !fs.existsSync(path.join(medicoes, '../../../studies-src', estudo, 'en.html'))) continue;
  const pt = (tirados.get(chave) ?? []).sort().join(' '), en = (tirados.get(estudo + '|en') ?? []).sort().join(' ');
  if (pt !== en) desequilibrios.push(`${estudo}: pt [${pt}] en [${en}]`);
}
console.log(`estudos com números tirados de forma diferente nas duas línguas: ${desequilibrios.length}${desequilibrios.length ? '\n  ' + desequilibrios.join('\n  ') : ''}`);
console.log(`campos nova: ${total}; reescritos nesta adenda: ${reescritas.length}; recusados pela régua: ${vermelhas.length}${vermelhas.length ? ' (' + vermelhas.join(', ') + ')' : ''}`);
console.log(`plantas das formas antigas que mordem: ${mordem} de ${plantas.length}`);
process.exitCode = vermelhas.length || desequilibrios.length || mordem !== plantas.length ? 1 : 0;
