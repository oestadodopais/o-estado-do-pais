import fs from 'node:fs';
/** As rotas observadas antes de cada retirada conservam-se como prova. */
export function rotasDePartida() {
  const pastas = ['rec2-2026-11-11', 'ret1-2026-11-12'];
  return {estudos:pastas.flatMap(p => JSON.parse(fs.readFileSync(`design/especime-v3/medicoes/${p}/rotas-de-partida.json`, 'utf8')).estudos)};
}
