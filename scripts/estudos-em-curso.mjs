/** H2-b: o prazo não encerra a ficha sozinho; obriga a uma decisão na construção. */
import fs from 'node:fs';
import path from 'node:path';

const dataValida = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
  && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;

export function dataDaConstrucao(dist) {
  const carimbo = JSON.parse(fs.readFileSync(path.join(dist, 'version.json'), 'utf8')).construido_em;
  if (!carimbo || !Number.isFinite(Date.parse(carimbo))) throw Error('E1: carimbo da construção ausente ou inválido.');
  return new Date(carimbo).toISOString().slice(0, 10);
}

export function conferirPrazosEmCurso(works, hoje) {
  if (!dataValida(hoje)) throw Error('E1: data da construção inválida.');
  return works.flatMap(w => {
    if (!w.emCurso) return [];
    if (!w.emCurso.razao?.trim() || !dataValida(w.emCurso.ate))
      return [`E1: declaração emCurso incompleta em ${w.slug}: exige razão e data de fim válida.`];
    if (w.emCurso.ate < hoje)
      return [`E1: prazo emCurso passado em ${w.slug} (${w.emCurso.ate}, construção ${hoje}); a ficha tem de ser decidida: prolongar a data ou tirar o campo emCurso.`];
    return [];
  });
}
