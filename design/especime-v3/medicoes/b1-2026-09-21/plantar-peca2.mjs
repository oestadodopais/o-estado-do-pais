/**
 * AS PLANTAS DA PEÇA 2 DO B1 · um estrago por célula, e os bytes repostos.
 *
 * A convenção é a da peça 1: planta-se num ficheiro, corre-se o portão sozinho,
 * exige-se código diferente de zero COM a falha esperada (e não qualquer falha),
 * repõem-se os bytes e confere-se o sha256. Uma planta que não morde é uma
 * célula a dormir.
 *
 * Uso:  node design/especime-v3/medicoes/b1-2026-09-21/plantar-peca2.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const RAIZ = process.cwd();
const sha = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const corre = (cmd, args) => {
  try {
    return { codigo: 0, saida: execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }) };
  } catch (e) {
    return { codigo: e.status ?? 1, saida: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

const PLANTAS = [
  {
    grupo: 'carta',
    nome: 'C1-um-concelho-a-menos',
    ficheiro: 'public/dados/caop-2025-municipios-madeira.csv',
    comando: ['node', ['scripts/check-lugares.mjs']],
    mordida: /C1 · os três extratos da Carta dão 307 concelhos/,
    faz: (t) => t.split('\n').filter((l, i, a) => l !== a.filter((x) => x && !x.startsWith('#')).at(-1)).join('\n'),
  },
  {
    grupo: 'carta',
    nome: 'C3-uma-regiao-sem-entrada',
    ficheiro: 'public/dados/caop-2025-municipios-continente.csv',
    comando: ['node', ['scripts/check-lugares.mjs']],
    mordida: /C3 · o concelho "Águeda" está na região "Centreo" da Carta/,
    faz: (t) => t.replace('0101,Águeda,Aveiro,Região de Aveiro,Centro,', '0101,Águeda,Aveiro,Região de Aveiro,Centreo,'),
  },
  {
    grupo: 'temas',
    nome: 'T1-uma-medida-sem-tema',
    ficheiro: 'src/data/temas-das-medidas.mjs',
    comando: ['node', ['scripts/check-lugares.mjs']],
    mordida: /T1 · a medida "pmp" não tem tema/,
    faz: (t) => t.replace("  pmp: 'economia-e-financas-publicas',\n", ''),
  },
  {
    grupo: 'temas',
    nome: 'T2-uma-medida-no-tema-errado',
    ficheiro: 'dist/municipios/evora/index.html',
    comando: ['node', ['scripts/check-lugares.mjs']],
    mordida: /T2 · \/municipios\/evora: a medida "populacao" rende-se debaixo de "trabalho"/,
    faz: (t) => {
      const i = t.indexOf('data-lugar-tema="populacao"');
      return i < 0 ? t : t.slice(0, i) + 'data-lugar-tema="trabalho"' + t.slice(i + 'data-lugar-tema="populacao"'.length);
    },
  },
  {
    grupo: 'lugar',
    nome: '8.17-a-linha-do-lugar-sem-uma-parte',
    ficheiro: 'dist/municipios/agueda/index.html',
    comando: ['node', ['scripts/check-lugar.mjs']],
    mordida: /8\.17 · páginas de concelho sem o mapa da sua unidade: 1/,
    faz: (t) => t.replace(/<span aria-hidden="true">›<\/span><a href="\/regioes\/centro"[^<]*<\/a>/, ''),
  },
  {
    grupo: 'redirecionamentos',
    nome: 'B1-lugares-um-destino-trocado',
    ficheiro: 'vercel.json',
    comando: ['node', ['scripts/gate-html.mjs']],
    mordida: /B1 lugares: \/municipios: tem de ter uma entrada 301 incondicional/,
    faz: (t) => t.replace('"src": "/municipios/?",\n      "status": 301,\n      "headers": {\n        "Location": "/lugares/"', '"src": "/municipios/?",\n      "status": 301,\n      "headers": {\n        "Location": "/estudos/"'),
  },
];

const saida = [];
for (const p of PLANTAS) {
  const f = path.join(RAIZ, p.ficheiro);
  const antes = sha(f);
  const original = fs.readFileSync(f, 'utf8');
  const estragado = p.faz(original);
  if (estragado === original) {
    saida.push({ ...p, comando: undefined, faz: undefined, passou: false, porque: 'a planta não mudou o ficheiro' });
    continue;
  }
  fs.writeFileSync(f, estragado);
  const r = corre(p.comando[0], p.comando[1]);
  fs.writeFileSync(f, original);
  const reposto = sha(f);
  const limpo = r.saida.replace(/\x1b\[[0-9;]*m/g, '');
  const passou = r.codigo !== 0 && p.mordida.test(limpo);
  fs.writeFileSync(
    path.join(RAIZ, 'design/especime-v3/medicoes/b1-2026-09-21', `planta-${p.nome}.txt`),
    `comando: ${p.comando[0]} ${p.comando[1].join(' ')}\ncodigo: ${r.codigo}\nmordida: ${p.mordida}\n\n${limpo}`,
  );
  saida.push({ grupo: p.grupo, nome: p.nome, ficheiro: p.ficheiro, comando: `${p.comando[0]} ${p.comando[1].join(' ')}`, codigo: r.codigo, mordida: String(p.mordida), passou, antes, reposto });
}
fs.writeFileSync(
  path.join(RAIZ, 'design/especime-v3/medicoes/b1-2026-09-21/plantas-peca2.json'),
  JSON.stringify({ cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), plantas: saida }, null, 2) + '\n',
);
const maus = saida.filter((p) => !p.passou || p.antes !== p.reposto);
console.log(`${saida.length} plantas; ${saida.length - maus.length} apanhadas e repostas.`);
for (const m of maus) console.log(`  ✗ ${m.nome} · codigo ${m.codigo} · ${m.porque ?? 'não mordeu ou não repôs'}`);
process.exit(maus.length ? 1 : 0);
