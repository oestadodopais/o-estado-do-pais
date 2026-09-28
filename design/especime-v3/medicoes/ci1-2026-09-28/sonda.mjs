/**
 * A SONDA DO BLOCO CI1 (28.09.2026). Carrega-se antes de cada processo Node
 * (`NODE_OPTIONS=--import=<este ficheiro>`, que os filhos herdam) e regista,
 * numa linha JSON por acontecimento, no ficheiro de `OEDP_SONDA_REGISTO`:
 *
 *   escrita   cada chamada do `fs` que cria, escreve, muda ou apaga um ficheiro
 *             ou uma pasta, com o caminho;
 *   servidor  cada `listen` de um servidor de rede, com o endereço e a porta
 *             pedidos (0 é uma porta efémera, dada pelo sistema);
 *   processo  cada processo lançado pelo `child_process`, com o comando (é
 *             assim que o Playwright abre o Chromium).
 *
 * Não muda o que a conferência faz: cada função embrulhada chama a original
 * com os mesmos argumentos e devolve o que ela devolver. Não vê o que um
 * processo que não é Node escreve (o Chromium escreve o seu perfil numa pasta
 * temporária própria); vê que ele foi lançado.
 */
import fs from 'node:fs';
import net from 'node:net';
import cp from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';

const REGISTO = process.env.OEDP_SONDA_REGISTO;
const escreveOriginal = fs.appendFileSync.bind(fs);
const quem = process.argv.slice(1, 3).join(' ');
/** @param {string} tipo @param {object} dados */
/* A GUARDA DE REENTRADA: o `appendFileSync` do Node chama por dentro o
   `writeFileSync`, que está embrulhado; sem a guarda, cada registo registava-se
   a si próprio sem fim. */
let aRegistar = false;
function regista(tipo, dados) {
  if (!REGISTO || aRegistar) return;
  aRegistar = true;
  try {
    escreveOriginal(REGISTO, JSON.stringify({ pid: process.pid, ppid: process.ppid, quem, tipo, ...dados }) + '\n');
  } catch {
    /* a sonda nunca faz cair a conferência */
  } finally {
    aRegistar = false;
  }
}
/** @param {unknown} p */
const caminho = (p) => (typeof p === 'string' ? p : p instanceof URL ? p.pathname : Buffer.isBuffer(p) ? p.toString() : typeof p === 'number' ? `fd:${p}` : String(p));
/** @param {unknown} f */
const escreveFlags = (f) => typeof f === 'string' ? /[wa+]/.test(f) : typeof f === 'number' ? (f & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_APPEND)) !== 0 : false;

const ESCRITAS = ['writeFileSync', 'appendFileSync', 'mkdirSync', 'rmSync', 'rmdirSync', 'unlinkSync', 'renameSync', 'copyFileSync', 'cpSync', 'mkdtempSync', 'symlinkSync', 'linkSync', 'truncateSync',
  'writeFile', 'appendFile', 'mkdir', 'rm', 'rmdir', 'unlink', 'rename', 'copyFile', 'cp', 'mkdtemp', 'symlink', 'link', 'truncate'];
for (const nome of ESCRITAS) {
  const original = fs[nome];
  if (typeof original !== 'function') continue;
  fs[nome] = function (...args) {
    const r = original.apply(this, args);
    regista('escrita', { fn: nome, caminho: caminho(args[0]), destino: ['renameSync', 'copyFileSync', 'cpSync', 'symlinkSync', 'linkSync', 'rename', 'copyFile', 'cp', 'symlink', 'link'].includes(nome) ? caminho(args[1]) : undefined, criado: nome.startsWith('mkdtemp') && typeof r === 'string' ? r : undefined });
    return r;
  };
}
for (const nome of ['openSync', 'open', 'createWriteStream']) {
  const original = fs[nome];
  fs[nome] = function (...args) {
    const flags = nome === 'createWriteStream' ? (args[1]?.flags ?? 'w') : args[1];
    if (escreveFlags(flags)) regista('escrita', { fn: nome, caminho: caminho(args[0]), flags: String(flags) });
    return original.apply(this, args);
  };
}
const P = fs.promises;
for (const nome of ['writeFile', 'appendFile', 'mkdir', 'rm', 'rmdir', 'unlink', 'rename', 'copyFile', 'cp', 'mkdtemp', 'symlink', 'link', 'truncate', 'open']) {
  const original = P[nome];
  if (typeof original !== 'function') continue;
  P[nome] = async function (...args) {
    if (nome === 'open' && !escreveFlags(args[1])) return original.apply(this, args);
    const r = await original.apply(this, args);
    regista('escrita', { fn: `promises.${nome}`, caminho: caminho(args[0]), destino: ['rename', 'copyFile', 'cp', 'symlink', 'link'].includes(nome) ? caminho(args[1]) : undefined, criado: nome === 'mkdtemp' && typeof r === 'string' ? r : undefined });
    return r;
  };
}
const listen = net.Server.prototype.listen;
net.Server.prototype.listen = function (...args) {
  const a = args[0];
  regista('servidor', { porta: typeof a === 'object' && a ? a.port ?? null : a ?? null, anfitriao: typeof a === 'object' && a ? a.host ?? null : typeof args[1] === 'string' ? args[1] : null });
  return listen.apply(this, args);
};
for (const nome of ['spawn', 'spawnSync', 'execFile', 'execFileSync', 'exec', 'execSync', 'fork']) {
  const original = cp[nome];
  cp[nome] = function (...args) {
    const [c, lista] = args;
    regista('processo', { fn: nome, comando: [String(c), ...(Array.isArray(lista) ? lista.map(String) : [])].join(' ').slice(0, 400) });
    return original.apply(this, args);
  };
}
syncBuiltinESMExports();
