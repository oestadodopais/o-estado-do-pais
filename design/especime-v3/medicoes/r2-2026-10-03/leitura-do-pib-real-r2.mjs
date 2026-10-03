/** R2 (03.10.2026, achado 12): a leitura do PIB real dizia «a que a unidade chama volumes encadeados», e a unidade do
 * cartão passou a «euros por pessoa, a preços de 2015»; dentro do mesmo cartão a frase deixava de ser verdade. Passa a
 * dizer «a que a fonte chama volumes encadeados», com os mesmos apoios mais o excerto da linha, que é a fonte a escrever
 * o termo. Este guião troca a frase na declaração (`src/data/leituras-das-medidas.mjs`) e a folha correspondente na
 * auditoria da K17 (`tests/cartao/leituras-provadas.json`), e mais nada; depois corre a primeira metade da K17.
 *
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/r2-2026-10-03/leitura-do-pib-real-r2.mjs [--confere]
 */
import fs from 'node:fs';

const so = process.argv.includes('--confere');
const DECL = 'src/data/leituras-das-medidas.mjs';
const AUD = 'tests/cartao/leituras-provadas.json';
const ANTES = { pt: 'a que a unidade chama volumes encadeados.', en: 'which the unit calls chain linked volumes.' };
const DEPOIS = { pt: 'a que a fonte chama volumes encadeados.', en: 'which the source calls chain linked volumes.' };
const erros = [];

let decl = fs.readFileSync(DECL, 'utf8');
for (const l of ['pt', 'en']) {
  const c = decl.split(ANTES[l]).length - 1;
  const d = decl.split(DEPOIS[l]).length - 1;
  if (so) { if (c !== 0 || d !== 1) erros.push(`declaração (${l}): ${c} forma(s) antiga(s) e ${d} nova(s)`); }
  else if (c === 1) decl = decl.replace(ANTES[l], DEPOIS[l]);
  else if (d !== 1) erros.push(`declaração (${l}): esperava uma forma antiga e há ${c}`);
}
const COMENTARIO_ANTES = `    /* K2 (02.10.2026, item 4 do brief): a frase diz o que a unidade chama «volumes encadeados», que nenhuma página`;
const COMENTARIO_DEPOIS = `    /* R2 (03.10.2026, achado 12): a unidade do cartão passou a «euros por pessoa, a preços de 2015», e a frase diz que é a
       fonte, e não a unidade, que chama aos números «volumes encadeados» (o excerto da linha); o resto fica.
       K2 (02.10.2026, item 4 do brief): a frase diz o que a unidade chama «volumes encadeados», que nenhuma página`;
if (!so && decl.includes(COMENTARIO_ANTES) && !decl.includes('R2 (03.10.2026, achado 12)')) decl = decl.replace(COMENTARIO_ANTES, COMENTARIO_DEPOIS);

const aud = JSON.parse(fs.readFileSync(AUD, 'utf8'));
const m = aud.medidas.find((x) => x.id === 'pib-real-per-capita-2025');
const folha = m?.folhas?.[0];
if (!folha) erros.push('a auditoria não tem a folha da leitura do PIB real');
else {
  const parte = folha.partes.find((p) => p.pt === ', a que a unidade chama volumes encadeados' || p.pt === ', a que a fonte chama volumes encadeados');
  if (!parte) erros.push('a folha não tem a parte dos volumes encadeados');
  else if (!so) {
    folha.pt = folha.pt.replace(ANTES.pt, DEPOIS.pt);
    folha.en = folha.en.replace(ANTES.en, DEPOIS.en);
    parte.pt = ', a que a fonte chama volumes encadeados';
    parte.en = ', which the source calls chain linked volumes';
    if (!parte.apoios.some((a) => a.campo === 'excerpt')) {
      parte.apoios.unshift({ linha: 'propria', campo: 'excerpt', literal: 'Chain linked volumes (2015)' });
    }
  } else if (parte.pt !== ', a que a fonte chama volumes encadeados') erros.push('a parte ainda diz a forma antiga');
}
if (!so && !erros.length) {
  fs.writeFileSync(DECL, decl);
  fs.writeFileSync(AUD, JSON.stringify(aud, null, 2) + '\n');
}
const { conferirAuditoriaDasLeituras } = await import('../../../../tests/cartao/leituras.mjs');
const r = conferirAuditoriaDasLeituras();
for (const e of r.erros ?? []) erros.push(e);
if (erros.length) { for (const e of erros) console.error(`  ${e}`); process.exit(1); }
console.log(`R2: a leitura do PIB real ${so ? 'conferida' : 'acertada'}; a primeira metade da K17 sem erros.`);
