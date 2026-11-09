/** Semente CAM2-A reproduzível. Recusa sobrescrever um registo existente. */
import fs from 'node:fs';
import path from 'node:path';
import {loadClaims} from '../src/lib/ledger.mjs';
import {lerPaginas, inventario, parDaFrase, medirPares, normal, sha256, chave} from './frases-com-afirmacao.mjs';
import {citacoes, normalExcerto} from './check-frases-afirmacao.mjs';
export function semear(paginas, livro) {
  const frases = inventario(paginas), registo = [], usadas = new Set();
  for (const f of frases.filter(f => f.lingua === 'pt')) {
    const cita = citacoes(f.frase, 'pt').filter(c => [...c].length >= 12);
    if (!cita.length || f.tipos.includes('leitura')) continue;
    for (const o of f.ocorrencias) {
      const afirmacoes = o.linhas.filter(id => livro.get(id)?.afirmacao === true);
      if (afirmacoes.length !== 1) continue;
      const l = livro.get(afirmacoes[0]), par = parDaFrase(paginas, o);
      if (!l.excerpt || !l.document?.source_sha256 || !cita.every(c => normalExcerto(l.excerpt).includes(normalExcerto(c))) || !par || !citacoes(par.frase, 'en').length) continue;
      const kp = chave(f), ke = chave({estudo:f.estudo, lingua:'en', frase:par.frase});
      if (usadas.has(kp) || usadas.has(ke)) continue;
      registo.push({id:'f-' + sha256(f.estudo + '\n' + normal(f.frase)).slice(0,24), estudo:f.estudo, tipo:f.tipos[0], pt:f.frase, en:par.frase, linhas:[l.id], origem:{pt:o.pagina,en:par.pagina,metodo:par.metodo}});
      usadas.add(kp); usadas.add(ke); break;
    }
  }
  const pendentes = frases.filter(f => !usadas.has(chave(f))).map(({estudo,lingua,sha256}) => ({estudo,lingua,sha256}));
  return {frases, registo, pendentes};
}
export function medidas(paginas, resultado) {
  const {frases, registo, pendentes} = resultado, estudos = {};
  for (const f of frases) {
    const e = estudos[f.estudo] ??= {pt:0, en:0, registo:0, por_registar:{pt:0,en:0}};
    e[f.lingua]++;
  }
  for (const f of registo) estudos[f.estudo].registo++;
  for (const f of pendentes) estudos[f.estudo].por_registar[f.lingua]++;
  return {paginas:paginas.length, frases:frases.length, pt:frases.filter(f=>f.lingua==='pt').length, en:frases.filter(f=>f.lingua==='en').length, registo:registo.length, por_registar:pendentes.length, pares:medirPares(paginas), estudos};
}
if (process.argv[1]?.endsWith('/gerar-frases-afirmacao.mjs')) {
  const dist = process.argv[2] ?? 'dist', destino = process.argv[3] ?? 'ledger/frases';
  if (fs.existsSync(destino)) throw new Error('semente: destino já existe');
  const paginas = lerPaginas(dist), r = semear(paginas, loadClaims()), m = medidas(paginas, r);
  if (r.pendentes.length > 3000) {
    console.error(JSON.stringify({estado:'PAROU: lista acima de 3000', frases:m.frases,registo:m.registo,por_registar:m.por_registar})); process.exit(2);
  }
  fs.mkdirSync(destino, {recursive:true});
  for (const estudo of new Set(r.registo.map(f=>f.estudo))) {
    const nome = estudo.startsWith('/') ? 'pagina-' + estudo.slice(1).replaceAll('/', '-') : estudo;
    fs.writeFileSync(path.join(destino, nome + '.json'), JSON.stringify(r.registo.filter(f=>f.estudo===estudo),null,2) + '\n');
  }
  fs.writeFileSync(path.join(destino,'por-registar.json'), JSON.stringify(r.pendentes,null,2) + '\n');
  fs.writeFileSync(process.argv[4] ?? '/tmp/cam2a-semente-medidas.json', JSON.stringify(m,null,2)+'\n');
  console.log(JSON.stringify({frases:m.frases,registo:m.registo,por_registar:m.por_registar,semente_sha256:sha256(JSON.stringify(r.pendentes))}));
}
