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

// HIG-6A: cada codificação, domínio e atributo novo tem a sua planta.
const extra = fs.mkdtempSync(path.join(os.tmpdir(), 'hig6-repositorio-'));
try {
  const casos = [
    ['JSON com barras escapadas', 'nota.json', String.raw`{"url":"https:\/\/github.com\/oestadodopais"}`],
    ['JSON com Unicode', 'nota.json', String.raw`{"url":"https://github.com/\u006festadodopais"}`],
    ['percentagem', 'nota.txt', 'https://github.com/%6festadodopais'],
    ['domínio github.io', 'nota.txt', 'https://oestadodopais.github.io'],
    ['domínio raw', 'nota.txt', 'https://raw.githubusercontent.com/oestadodopais/site/main/a'],
    ['github.io escapado', 'nota.json', String.raw`https:\/\/oestadodopais\u002egithub.io`],
    ['raw codificado', 'nota.txt', 'https%3A%2F%2Fraw.githubusercontent.com%2Foestadodopais'],
    ['github.io codificado', 'nota.txt', 'https%3A%2F%2Foestadodopais%2Egithub%2Eio'],
    ['raw escapado em JSON', 'nota.json', String.raw`https:\/\/raw.githubusercontent.com\/oestadodopais`],
    ['src', 'index.html', '<img src="https://github.com/terceiro/foto">'],
    ['action', 'index.html', '<form action="https://github.com/terceiro/envio"></form>'],
    ['refresh', 'index.html', '<meta http-equiv="refresh" content="0; URL=https://github.com/terceiro">'],
    ['href mal formado', 'index.html', '<a href="https://[invalido">Ligação</a>'],
    ['src mal formado', 'index.html', '<img src="https://[invalido">'],
    ['action mal formada', 'index.html', '<form action="https://[invalido"></form>'],
    ['refresh mal formado', 'index.html', '<meta http-equiv="refresh" content="0; URL=https://[invalido">'],
    ['percentagem mal formada', 'index.html', '<a href="https://example.org/%zz">Ligação</a>'],
    ['entidade no endereço', 'index.html', '<a href="https://github&#46;com/terceiro">Ligação</a>'],
  ];
  for (const [nome, rel, texto] of casos) {
    const f = path.join(extra, rel); fs.writeFileSync(f, texto);
    assert(conferirRepositorioNoDist(extra).length, nome);
    PLANTAS_DO_REPOSITORIO.push({nome}); fs.unlinkSync(f);
  }
  fs.writeFileSync(path.join(extra, 'index.html'), '<a href="/agenda">Agenda</a><img src="/foto.png"><form action="/pesquisa"></form><meta http-equiv="refresh" content="5; url=/agenda">');
  assert.deepEqual(conferirRepositorioNoDist(extra), []);
} finally { fs.rmSync(extra, {recursive:true, force:true}); }
console.log(`repositório: ${PLANTAS_DO_REPOSITORIO.length} plantas e controlos locais`);
