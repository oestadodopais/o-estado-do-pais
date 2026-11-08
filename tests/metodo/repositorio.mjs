import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { conferirRepositorioNoDist } from '../../scripts/repositorio-no-dist.mjs';

export const PLANTAS_DO_REPOSITORIO = [];
const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'met2-dist-'));
try {
  fs.mkdirSync(path.join(dist, 'fontes'));
  // Uma referência textual ao repositório de uma letra continua admitida.
  fs.writeFileSync(path.join(dist, 'fontes', 'OFL.txt'), 'https://github.com/google/fonts');
  fs.writeFileSync(path.join(dist, 'index.html'), '<a href="/agenda">A agenda</a>');
  assert.deepEqual(conferirRepositorioNoDist(dist), []);
  for (const [nome, ficheiro, texto, queixa] of [
    ['endereço num ficheiro de texto', 'fontes/nota.txt', 'https://github.com/oestadodopais', 'endereço da organização'],
    ['ligação num HTML', 'porta.html', '<a href="https://github.com/google/fonts">Licença</a>', 'ligação para github.com'],
  ]) {
    fs.writeFileSync(path.join(dist, ficheiro), texto);
    const erros = conferirRepositorioNoDist(dist);
    assert.equal(erros.length, 1, nome);
    assert.equal(erros[0].rel, ficheiro, nome);
    assert(erros[0].msg.includes(queixa), nome);
    PLANTAS_DO_REPOSITORIO.push({ nome });
    fs.unlinkSync(path.join(dist, ficheiro));
    assert.deepEqual(conferirRepositorioNoDist(dist), []);
  }
} finally { fs.rmSync(dist, { recursive: true, force: true }); }
