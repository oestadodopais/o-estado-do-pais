/** L2a: as plantas da lista fechada da voz da primeira página e dos temas (`scripts/voz-pais.mjs`, chamada pelo
 * `check:voz`), que mudou de forma neste bloco: a menção da fonte do sinal só sai da lista quando o texto é o do
 * manifesto, e as três cadeias da pesquisa deixaram de ser permitidas nestas páginas.
 *
 * Cada planta faz uma cópia de `dist/` com ligações duras numa pasta temporária (a forma de
 * `tests/voz/palavras-proibidas.mjs`), troca UM ficheiro por um novo (a ligação dura parte-se e o original não
 * muda), corre a mesma função que o portão corre e exige a queixa daquela planta; depois apaga a cópia e confere
 * o sha256 do original. Escreve `plantas-voz-l2a.json` na pasta do bloco.
 * Uso, da raiz da worktree e depois de uma construção: node design/especime-v3/medicoes/l2a-2026-10-01/plantas-voz-l2a.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { verificaVozPais } from '../../../../scripts/voz-pais.mjs';
import { t } from '../../../../src/i18n/strings.mjs';

const raiz = process.cwd();
const sha = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const limpo = verificaVozPais(raiz).filter((e) => e.startsWith('B1 lista fechada país'));
const plantas = [
  ['a menção da fonte do sinal com outro texto', 'index.html', (h) => h.replace('Direção-Geral do Território · Carta', 'Instituto Geográfico Português · Carta'), /^B1 lista fechada país: \/: «Instituto Geográfico Português/],
  ['a cadeia da pesquisa de volta à primeira página inglesa', 'en/index.html', (h) => h.replace('</main>', `<p>${t('en').ambito.municipio}</p></main>`), new RegExp(`^B1 lista fechada país: en: «${t('en').ambito.municipio}»`)],
].map(([nome, rel, troca, mordida]) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'l2a-voz-'));
  const original = path.join(raiz, 'dist', rel);
  const antes = sha(original);
  try {
    execFileSync('cp', ['-al', path.join(raiz, 'dist'), path.join(tmp, 'dist')]);
    fs.symlinkSync(path.join(raiz, 'mapa'), path.join(tmp, 'mapa'));
    const alvo = path.join(tmp, 'dist', rel);
    const html = fs.readFileSync(alvo, 'utf8');
    const trocado = troca(html);
    if (trocado === html) throw new Error('a planta não mudou a página');
    fs.unlinkSync(alvo);
    fs.writeFileSync(alvo, trocado);
    const erros = verificaVozPais(tmp);
    const queixa = erros.find((e) => mordida.test(e)) ?? null;
    return { nome, ficheiro: rel, mordeu: Boolean(queixa), queixa, original_antes: antes, original_depois: sha(original) };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
const saida = { bloco: 'L2a', funcao: 'scripts/voz-pais.mjs · verificaVozPais()', limpo: { queixas_da_lista_fechada: limpo.length }, plantas };
fs.writeFileSync('design/especime-v3/medicoes/l2a-2026-10-01/plantas-voz-l2a.json', JSON.stringify(saida, null, 2) + '\n');
for (const p of plantas) console.log(`${p.mordeu ? 'mordeu' : 'NÃO MORDEU'} · ${p.nome} · ${p.queixa ?? ''} · original ${p.original_antes === p.original_depois ? 'intacto' : 'MUDOU'}`);
console.log(`limpo: ${limpo.length} queixa(s) da lista fechada`);
process.exitCode = limpo.length || plantas.some((p) => !p.mordeu || p.original_antes !== p.original_depois) ? 1 : 0;
