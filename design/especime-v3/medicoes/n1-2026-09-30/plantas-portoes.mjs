/** N1: plantas dos guardas que mudaram de lugar. Não correr com outra leitura de dist/. */
import fs from 'node:fs';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { verificaVeredictoDoPais } from '../../../../scripts/pais-veredicto.mjs';
import { documentoDosAssuntos } from '../../../../tests/inicio/paginas-dos-assuntos.mjs';
const pasta = 'design/especime-v3/medicoes/n1-2026-09-30';
const sha = (s) => createHash('sha256').update(s).digest('hex');
const limpar = (s) => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]').replaceAll(os.userInfo().username, '[utilizador]').replace(/\x1b\[[0-9;]*m/g, '');
const resultados = [];
function planta(nome, ficheiro, estraga, comando, mordida) {
  const destino = `dist/${ficheiro}`;
  const antes = fs.readFileSync(destino, 'utf8');
  let execucao;
  try {
    const root = parse(antes);
    estraga(root);
    if (root.toString() === antes) throw new Error(`${nome}: a planta não alterou o HTML.`);
    fs.writeFileSync(destino, root.toString());
    execucao = spawnSync('node', [comando], { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
  } finally { fs.writeFileSync(destino, antes); }
  const texto = limpar(execucao.stdout + execucao.stderr);
  const log = `${pasta}/ensaios/planta-${nome}.log`;
  fs.writeFileSync(log, texto);
  const reposto = sha(fs.readFileSync(destino));
  const r = { nome, ficheiro, comando, codigo: execucao.status, mordida: mordida.source, antes: sha(antes), reposto, log, passou: execucao.status === 1 && mordida.test(texto) && reposto === sha(antes) };
  resultados.push(r);
  console.log(`${nome}: ${r.passou ? 'mordeu e repôs' : 'falhou'}`);
}
const regioes = parse(fs.readFileSync('dist/regioes/index.html', 'utf8'));
let regua = regioes.querySelector('[data-instrumento="convergencia"]');
while (regua && regua.querySelectorAll('a[href^="/regioes/"]').length < 9) regua = regua.parentNode;
if (!regua || regua.tagName === 'HTML') throw new Error('O conhecido-positivo da régua não foi encontrado.');
const copia = parse(regua.outerHTML);
copia.querySelectorAll('[data-instrumento]').forEach((n) => n.removeAttribute('data-instrumento'));
planta('convergencia-sem-marca', 'lugares/index.html', (r) => r.querySelector('main').insertAdjacentHTML('beforeend', copia.toString()), 'scripts/check-lugar.mjs', /réguas da convergência fora de \/regioes: 1, acima do teto 0/);
planta('trabalho-como-estudo', 'index.html', (r) => r.querySelector('main').insertAdjacentHTML('beforeend', '<p>Um trabalho publicado.</p>'), 'scripts/check-lugar.mjs', /L3 · palavras fora do vocabulário fechado: 1, acima do teto 0/);
planta('data-do-recibo', 'livro-razao/pib-real-per-capita-2025/index.html', (r) => r.querySelectorAll('[data-de-campo^="verifications."]').forEach((n) => n.remove()), 'scripts/check-formas.mjs', /recibo da linha "pib-real-per-capita-2025".*falta\(m\) verificacao/);
planta('selo-nos-lugares', 'lugares/index.html', (r) => r.querySelector('[data-cartao-camaras] .src-chip').remove(), 'scripts/gate-html.mjs', /falta.*(marca|selo)|sem selo|não tem.*selo/i);
for (const lang of ['pt', 'en']) {
  const home = parse(fs.readFileSync(`dist/${lang === 'pt' ? '' : 'en/'}index.html`, 'utf8'));
  const assuntos = documentoDosAssuntos('dist', lang);
  const limpo = verificaVeredictoDoPais(home, assuntos, lang);
  const a = home.querySelector('[data-veredicto-medida]');
  if (!a || limpo.length) throw new Error('A V1 não tem conhecido-positivo limpo.');
  a.setAttribute('href', lang === 'pt' ? '/temas/' : '/en/themes/');
  const falhas = verificaVeredictoDoPais(home, assuntos, lang);
  resultados.push({ nome: `veredicto-destino-${lang}`, conhecido_positivo: limpo.length === 0, passou: falhas.some((e) => e.includes('o nome ou a porta difere')), queixas: falhas });
}
fs.writeFileSync(`${pasta}/plantas-portoes.json`, JSON.stringify({ resultados }, null, 2) + '\n');
process.exitCode = resultados.some((r) => !r.passou) ? 1 : 0;
