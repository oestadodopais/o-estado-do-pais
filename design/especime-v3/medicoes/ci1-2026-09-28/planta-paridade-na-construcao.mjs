#!/usr/bin/env node
/**
 * A PARIDADE DAS DUAS LÍNGUAS NUMA CONSTRUÇÃO REAL (bloco CI1, passagem CI1b,
 * 28.09.2026, achado 9 da leitura a frio). As plantas do `provar:guardas`
 * chamam o `t()` diretamente; esta prova corre o `astro build` a sério.
 *
 * Numa pasta temporária, uma cópia da árvore que o `git` segue na cabeça
 * (`git archive HEAD`), com os módulos clonados do sítio, e duas construções
 * do Astro, uma a seguir à outra:
 *
 *   o controlo  a cópia intacta constrói, e escreve as páginas;
 *   a planta    a mesma cópia, com uma chave só na edição portuguesa de
 *               `src/i18n/strings.mjs`, tem de fechar com código diferente de
 *               0, com a mensagem da guarda e a chave nomeada, antes de a
 *               primeira página se escrever: nenhuma linha de página na saída
 *               do Astro e nenhum ficheiro `.html` na pasta de saída.
 *
 * Não toca na árvore do sítio: tudo acontece na cópia, que se apaga no fim.
 * Uso, da raiz do sítio: node <este ficheiro> <saida.json>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const saida = process.argv[2];
if (!saida) {
  console.error('uso: node planta-paridade-na-construcao.mjs <saida.json>');
  process.exit(2);
}
const ABERTURA_DO_PT = 'export const STRINGS = {\n  pt: {\n';
const CHAVE = 'plantaDoCi1b';
const base = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-ci1b-paridade-'));
const copia = path.join(base, 'sitio');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();

function htmlEm(pasta) {
  if (!fs.existsSync(pasta)) return 0;
  let n = 0;
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name.endsWith('.html')) n++;
    }
  };
  anda(pasta);
  return n;
}
function constroi(rotulo) {
  fs.rmSync(path.join(copia, 'dist'), { recursive: true, force: true });
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join('node_modules', 'astro', 'bin', 'astro.mjs'), 'build'], {
    cwd: copia,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
    maxBuffer: 256 * 2 ** 20,
  });
  const texto = `${r.stdout ?? ''}\n${r.stderr ?? ''}`;
  return {
    rotulo,
    codigo: r.status,
    segundos: (Date.now() - t0) / 1000,
    linhas_de_pagina: (texto.match(/[├└]─ \/\S+/g) ?? []).length,
    paginas_html_escritas: htmlEm(path.join(copia, 'dist')),
    mensagem_da_guarda: texto.includes('i18n: as duas línguas não têm as mesmas chaves'),
    chave_nomeada: texto.includes(`só em pt: ${CHAVE}`),
    gerou_rotas: /generating static routes/.test(texto),
  };
}

let resultado;
try {
  fs.mkdirSync(copia, { recursive: true });
  const arquivo = execFileSync('git', ['archive', '--format=tar', 'HEAD'], { cwd: RAIZ, maxBuffer: 2 ** 31 });
  execFileSync('tar', ['-x', '-C', copia], { input: arquivo, maxBuffer: 64 * 2 ** 20 });
  /* Os módulos, clonados onde o sistema de ficheiros o deixa (`cp -c` no APFS),
     copiados onde não. */
  const clonar = spawnSync('cp', ['-cR', path.join(RAIZ, 'node_modules'), path.join(copia, 'node_modules')]);
  if (clonar.status !== 0) execFileSync('cp', ['-R', path.join(RAIZ, 'node_modules'), path.join(copia, 'node_modules')]);

  const controlo = constroi('controlo');

  const ficheiro = path.join(copia, 'src', 'i18n', 'strings.mjs');
  const original = fs.readFileSync(ficheiro, 'utf8');
  if (original.split(ABERTURA_DO_PT).length !== 2) throw new Error('a abertura da edição portuguesa não está onde a planta a procura');
  const plantado = original.replace(ABERTURA_DO_PT, `${ABERTURA_DO_PT}    ${CHAVE}: 'só numa língua',\n`);
  fs.writeFileSync(ficheiro, plantado);
  const planta = constroi('planta');

  resultado = {
    o_que: 'o astro build numa cópia da árvore da cabeça: intacta constrói; com uma chave só na edição portuguesa de src/i18n/strings.mjs fecha com a mensagem da guarda, antes de a primeira página se escrever',
    cabeca,
    comando: 'git archive HEAD numa pasta temporária, node_modules clonado, node node_modules/astro/bin/astro.mjs build',
    sha256_de_strings_intacto: crypto.createHash('sha256').update(original).digest('hex'),
    sha256_de_strings_plantado: crypto.createHash('sha256').update(plantado).digest('hex'),
    controlo,
    planta,
  };
  resultado.mordeu =
    controlo.codigo === 0 && controlo.paginas_html_escritas > 0 &&
    planta.codigo !== 0 && planta.mensagem_da_guarda && planta.chave_nomeada &&
    planta.linhas_de_pagina === 0 && planta.paginas_html_escritas === 0;
} finally {
  fs.rmSync(base, { recursive: true, force: true });
}
fs.writeFileSync(saida, JSON.stringify(resultado, null, 1) + '\n');
console.log(JSON.stringify(resultado));
process.exit(resultado.mordeu ? 0 : 1);
