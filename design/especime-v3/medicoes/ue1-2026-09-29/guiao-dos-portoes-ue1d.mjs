/** UE1d: o guião dos portões que correu contra o que fica no ramo, em portoes/ue1d-de17f63e/guiao-dos-portoes.json.
 *
 * O comentário do `portao-ue1d.sh` corrigiu-se depois das três corridas (dizia um diagnóstico errado sobre a
 * primeira corrida). Este guião prova que só os comentários mudaram: lê a cópia guardada durante a corrida do
 * build, antes das corridas do verify e do typecheck e sem nenhuma escrita no ficheiro desde que ele foi criado
 * (numa pasta de trabalho fora do repositório, passada como argumento e não escrita), tira de cada um as
 * linhas que começam por «#», e compara o resto. O conhecido-positivo: as linhas de comentário diferem.
 *
 * Uso (da raiz do sítio): node design/especime-v3/medicoes/ue1-2026-09-29/guiao-dos-portoes-ue1d.mjs <cópia que correu>
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const PASTA = 'design/especime-v3/medicoes/ue1-2026-09-29';
const copia = process.argv[2];
if (!copia || !fs.existsSync(copia)) throw new Error('passe a cópia do guião que correu');
const agora = path.join(PASTA, 'portao-ue1d.sh');
const sha = (f) => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const linhas = (f) => fs.readFileSync(f, 'utf8').split('\n');
const codigo = (f) => linhas(f).filter((l) => !l.startsWith('#'));
const comentarios = (f) => linhas(f).filter((l) => l.startsWith('#'));
const a = codigo(copia), b = codigo(agora);
const diferentes = Math.max(a.length, b.length) - a.filter((l, i) => l === b[i]).length;
const ca = comentarios(copia), cb = comentarios(agora);
const comentariosDiferentes = Math.max(ca.length, cb.length) - ca.filter((l, i) => l === cb[i]).length;
const saida = {
  _: 'O guião dos portões da UE1d: o sha256 da cópia guardada durante a corrida do build (antes das do verify e do typecheck, e sem escrita nenhuma no ficheiro desde que foi criado), o do ficheiro do ramo, e as linhas que diferem, fora e dentro dos comentários.',
  sha256_do_que_correu: sha(copia),
  sha256_do_ramo: sha(agora),
  linhas_de_codigo_diferentes: diferentes,
  linhas_de_comentario_diferentes: comentariosDiferentes,
};
fs.writeFileSync(path.join(PASTA, 'portoes/ue1d-de17f63e/guiao-dos-portoes.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(JSON.stringify(saida, null, 2));
process.exit(diferentes === 0 && comentariosDiferentes > 0 ? 0 : 1);
