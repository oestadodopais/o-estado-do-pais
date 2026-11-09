/** Interface única para o índice M83 do pacote e para a conferência dos excertos. */
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';
import {loadClaims} from '../src/lib/ledger.mjs';
export function conferirCorpos(linhas, excertos = false) {
  const r = spawnSync('python3', [fileURLToPath(new URL('./leituras/corpos-ledger.py', import.meta.url))], {
    input:JSON.stringify({linhas, excertos}), encoding:'utf8', maxBuffer:4 * 1024 * 1024,
  });
  if (r.error || ![0,1].includes(r.status)) throw new Error('corpos: processo de leitura indisponível');
  let resultado; try {resultado = JSON.parse(r.stdout);} catch {throw new Error('corpos: resposta ilegível');}
  if (r.status && !resultado.erros?.length) throw new Error('corpos: falha sem diagnóstico');
  return resultado;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const linhas = [...loadClaims().values()].filter(l => l.document?.source_sha256 != null);
  const r = conferirCorpos(linhas);
  console.log(`M83: ${r.estado}; ${r.lidas}/${linhas.length} linhas; limpa=${r.limpa}; recusas=${r.erros.length}`);
  for (const e of r.erros) console.error(e);
  process.exitCode = r.erros.length ? 1 : 0;
}
