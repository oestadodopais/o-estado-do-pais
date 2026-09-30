/** Detetor do bloco, com uma planta em ficheiro e sem guardar dados pessoais. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const privados = [process.cwd(), os.homedir(), os.userInfo().username];
export function revelaDadosLocais(texto) {
  return privados.some((p) => texto.includes(p)) || /\/(?:Users|home)\/[^\s/]+\//.test(texto);
}
export function ficheirosComDadosLocais(ficheiros) {
  return ficheiros.filter((p) => fs.existsSync(p) && fs.statSync(p).isFile() && revelaDadosLocais(fs.readFileSync(p, 'utf8')));
}
export function plantaDaPrivacidade() {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'n1c-privacidade-'));
  const ficheiro = path.join(pasta, 'planta.txt');
  try {
    fs.writeFileSync(ficheiro, 'Uma frase sem dados pessoais.');
    const limpo = ficheirosComDadosLocais([ficheiro]).length === 0;
    // A conta é fictícia: a planta nunca escreve a conta real da máquina.
    fs.writeFileSync(ficheiro, ['','Users','conta-de-ensaio','documento'].join('/'));
    const mordeu = ficheirosComDadosLocais([ficheiro]).length === 1;
    return { nome: 'ficheiro com caminho plantado', limpo, mordeu, reposto: true };
  } finally { fs.rmSync(pasta, { recursive: true, force: true }); }
}
