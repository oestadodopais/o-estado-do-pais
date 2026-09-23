/** Plantas dos dois leitores: singular/plural, PT/EN, palavra e ordem.
 * Os casos usam cópias dos dados medidos pelo navegador e HTML em memória.
 * Não alteram dist nem as capturas. Cada leitor corre num subprocesso.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { falhasDaCaptura } from './conferir-captura-b2.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const sha = s => createHash('sha256').update(s).digest('hex');
if (process.argv.includes('--filho')) {
  const erros = falhasDaCaptura(JSON.parse(fs.readFileSync(0, 'utf8')));
  console.log(JSON.stringify(erros));
  process.exit(erros.length ? 1 : 0);
}
const medido = JSON.parse(fs.readFileSync(path.join(AQUI, 'capturas-diagnostico-regex/capturas-depois-peca1.json'), 'utf8'));
const formas = {
  pt: { fora: ['fora do valor de referência', 'fora dos valores de referência'], dentro: ['dentro do valor de referência', 'dentro dos valores de referência'] },
  en: { fora: ['outside the reference value', 'outside the reference values'], dentro: ['within the reference value', 'within the reference values'] },
};
function entrada(lang, estado, frase) {
  const r = structuredClone(medido.resultados.find(r => r.familia === 'temas' && r.lingua === lang && r.largura === 390));
  const c = structuredClone(r.cartoes.find(c => c.referencias.length && c.pergunta && c.regua));
  const ref = { ...c.referencias[0], estado, texto: frase };
  c.referencias = [ref]; r.cartoes = [c];
  r.faixa = [{ id: c.id, estado, texto: frase, cor: ref.cor }];
  const html = `<article class="cartao-medida" data-cartao-medida="${c.id}"><span data-regua="referencia" data-estado="${estado}">${frase}</span></article><li class="cartao" data-cartao="${c.id}" data-estado="${estado}"><span class="cartao-palavra">${frase}</span></li>`;
  return { r, html };
}
function correr(leitor, dado) {
  const args = leitor === 'captor' ? [process.argv[1], '--filho'] : [path.join(AQUI, 'medir.py'), '--prova-palavra'];
  const r = spawnSync(leitor === 'captor' ? process.execPath : 'python3', args, { input: JSON.stringify(leitor === 'captor' ? dado.r : { html: dado.html }), encoding: 'utf8' });
  return { codigo: r.status, saida: (r.stdout ?? '') + (r.stderr ?? '') };
}
const resultados = [];
function plantar(nome, bom, mudar, leitores = ['captor', 'medir']) {
  for (const leitor of leitores) {
    const antes = JSON.stringify(bom), estrago = structuredClone(bom);
    const saudavel = correr(leitor, bom);
    mudar(estrago);
    const mau = correr(leitor, estrago);
    const repo = JSON.parse(antes), reposto = correr(leitor, repo);
    const passou = saudavel.codigo === 0 && mau.codigo === 1 && reposto.codigo === 0 && sha(antes) === sha(JSON.stringify(repo));
    const ficheiro = `planta-captor-${nome}-${leitor}.log`;
    fs.writeFileSync(path.join(AQUI, ficheiro), `SAUDÁVEL ${saudavel.codigo}\n${saudavel.saida}ESTRAGO ${mau.codigo}\n${mau.saida}REPOSTO ${reposto.codigo}\n${reposto.saida}`);
    resultados.push({ nome: `${nome}-${leitor}`, leitor, codigo: mau.codigo, saudavel: saudavel.codigo, reposicao: reposto.codigo, passou, antes: sha(antes), reposto: sha(JSON.stringify(repo)), ficheiro, nota: 'Cópias em memória; funções efetivamente usadas pelo captor e pelo medidor, sem tocar no HTML construído.' });
  }
}
for (const [lang, estados] of Object.entries(formas)) for (const [estado, frases] of Object.entries(estados)) for (const [i, frase] of frases.entries()) {
  const bom = entrada(lang, estado, frase);
  plantar(`${lang}-${estado}-${i ? 'plural' : 'singular'}-cor-sem-palavra`, bom, d => {
    d.r.cartoes[0].referencias[0].texto = '';
    d.r.faixa[0].texto = '';
    d.html = d.html.replaceAll(frase, '');
  });
}
for (const lang of ['pt', 'en']) {
  const bom = entrada(lang, 'fora', formas[lang].fora[0]);
  plantar(`${lang}-ordem-da-palavra`, bom, d => {
    const frase = formas[lang].fora[0], trocada = lang === 'pt' ? 'do valor de referência fora' : 'the reference value outside';
    d.r.cartoes[0].referencias[0].texto = trocada; d.r.faixa[0].texto = trocada;
    d.html = d.html.replaceAll(frase, trocada);
  });
  plantar(`${lang}-selo-antes-da-unidade`, bom, d => {
    d.r.cartoes[0].unidadeAntesDoSelo = false;
    d.html = '<article class="cartao-medida" data-cartao-medida="amostra"><span class="cartao-medida-num">1</span><a class="src-chip">fonte</a></span><span class="campo-valor cartao-medida-unidade">%</span></article>';
  });
  plantar(`${lang}-pergunta-antes-da-regua`, bom, d => { d.r.cartoes[0].reguaAntesDaPergunta = false; }, ['captor']);
}
fs.writeFileSync(path.join(AQUI, 'plantas-captor-b2.json'), JSON.stringify(resultados, null, 2) + '\n');
console.log(`${resultados.length} plantas; ${resultados.filter(r => r.passou).length} morderam com saudável e reposição a zero.`);
if (resultados.some(r => !r.passou)) process.exitCode = 1;
