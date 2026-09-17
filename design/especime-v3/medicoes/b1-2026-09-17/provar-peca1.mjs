/** Plantas B1, na construção local; cada alteração é reposta em finally e por SHA-256. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { cabecaValida } from '../../../../tests/acessibilidade/cabeca-b1.mjs';
const raiz = process.cwd();
const pasta = path.join(raiz, 'design/especime-v3/medicoes/b1-2026-09-17');
const sha = b => createHash('sha256').update(b).digest('hex');
const estudo = 'dist/estudos/evora-2027-prometido-painel-dinheiro/index.html';
const lista = 'dist/estudos/index.html';
const resultados = [];
function correr(nome, portao) {
  const r = spawnSync('npm', ['run', portao], { cwd: raiz, encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 });
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(pasta, `planta-${nome}.txt`), `$ npm run ${portao}\nCódigo: ${r.status}\n${saida}`);
  return { codigo: r.status, saida: saida.replace(/\x1b\[[0-9;]*m/g, '') };
}
function trocaElemento(html, selector, altera) {
  const no = parse(html).querySelector(selector);
  if (!no) throw new Error(`Não existe ${selector}`);
  const anterior = no.outerHTML;
  altera(no);
  if (!html.includes(anterior)) throw new Error(`Elemento não é substring: ${selector}`);
  return html.replace(anterior, no.outerHTML);
}
function planta(nome, ficheiro, alterar, portao, mordida) {
  const alvo = path.join(raiz, ficheiro);
  const bytes = fs.readFileSync(alvo);
  const antes = sha(bytes);
  let r;
  try {
    const mudado = alterar(bytes.toString());
    if (mudado === null) fs.unlinkSync(alvo);
    else {
      if (mudado === bytes.toString()) throw new Error(`Planta ${nome} não mudou nada`);
      fs.writeFileSync(alvo, mudado);
    }
    r = correr(nome, portao);
  } finally {
    fs.writeFileSync(alvo, bytes);
    if (sha(fs.readFileSync(alvo)) !== antes) throw new Error(`Reposição falhou: ${nome}`);
  }
  const bateu = r.codigo !== 0 && mordida.test(r.saida);
  resultados.push({ nome, ficheiro, portao, codigo: r.codigo, mordida: String(mordida), bateu, antes, reposto: sha(fs.readFileSync(alvo)) });
  fs.writeFileSync(path.join(pasta, 'plantas-peca1.json'), JSON.stringify(resultados, null, 2) + '\n');
  console.log(`${nome}: ${r.codigo}, mordida ${bateu}, bytes repostos`);
  if (!bateu) throw new Error(`A planta não mordeu como devia: ${nome}`);
}
for (const portao of ['gate:html', 'check:lugar', 'check:datas', 'check:voz', 'check:cadeia']) {
  const r = correr(`limpa-${portao.replace(':', '-')}`, portao);
  if (r.codigo !== 0) throw new Error(`Referência não está limpa: ${portao}`);
  console.log(`Referência ${portao}: 0`);
}
planta('pagina-em-falta', estudo, () => null, 'check:lugar', /régua viu 25 «estudo»/);
planta('algarismo-na-rota-nova', estudo, h => trocaElemento(h, '[data-registo]', n => n.innerHTML = n.innerHTML.replace(/\d/, d => String((Number(d) + 1) % 10))), 'gate:html', /L[234].*(?:texto rendido|impresso|figura)/);
planta('cadeia-na-rota-nova', estudo, h => trocaElemento(h, '[data-registo]', n => n.innerHTML = n.innerHTML.replace(/\d/, d => String((Number(d) + 1) % 10))), 'check:cadeia', /C[45]/);
planta('data-da-edicao', estudo, h => trocaElemento(h, '.estudo-publicado time', n => n.innerHTML = '12.08.2026'), 'check:datas', /16\.09\.2026/);
planta('data-da-lista', lista, h => trocaElemento(h, '[data-estudo-edicao] time', n => n.innerHTML = '16.09.2026'), 'check:datas', /24\.08\.2026/);
planta('tema-em-falta', 'src/data/studies.mjs', h => h.replace("    tema: 'cultura',\n", ''), 'check:voz', /B1 tema.*evora-2027/);
planta('frase-fora-da-lista', lista, h => h.replace('</main>', '<p>Esta página explica como funciona o projeto.</p></main>'), 'check:voz', /B1 lista fechada/);
planta('l6-origem-trocada', estudo, h => trocaElemento(h, '[data-registo-linha$=".origem"]', n => n.innerHTML = 'origem trocada'), 'gate:html', /L6 .*campo rendido/);
planta('l8-indice-trocado', estudo, h => trocaElemento(h, '[data-registo-indice]', n => n.innerHTML = 'Título trocado'), 'gate:html', /L8/);
planta('rotulo-ia-retirado', estudo, h => trocaElemento(h, '[data-rotulo-ia="rodape"]', n => n.removeAttribute('data-rotulo-ia')), 'gate:html', /0 rótulo\(s\) de IA no rodapé/);
planta('redirecionamento-trocado', 'dist/estudos/evora-2027-prometido-painel-dinheiro/texto/index.html', h => h.replace('0;url=/estudos/evora-2027-prometido-painel-dinheiro/', '0;url=/estudos/onde-esta-a-agua/'), 'gate:html', /B1 redirecionamento/);
planta('estudo-sem-acesso', 'dist/regioes/alentejo/index.html', h => trocaElemento(h, '.mun-estudos a', n => n.setAttribute('href', '/estudos/onde-esta-a-agua')), 'check:lugar', /B1 cobertura: alentejo-algarve/);
planta('contagem-do-lugar', lista, h => trocaElemento(h, '[data-prova="estudos_lugar_evora"]', n => n.innerHTML = '7'), 'gate:html', /estudos_lugar_evora/);
planta('documento-porta-trocada', 'dist/estudos/evora-2027-prometido-painel-dinheiro/documento/index.html', h => trocaElemento(h, '[data-oedp-texto]', n => n.setAttribute('href', '/estudos/onde-esta-a-agua')), 'gate:html', /a porta da leitura no sítio abre/);
planta('segunda-porta', 'dist/estudos/onde-esta-a-agua/index.html', h => h.replace('</main>', '<p><a href="/estudos/onde-esta-a-agua/documento">Edição tal como foi publicada</a></p></main>'), 'check:lugar', /L1 .*acima do teto/s);
planta('faixa-regressa', estudo, h => h.replace('</main>', '<a href="#documento" data-registo-conta="evora-2027-prometido-painel-dinheiro/pt=blocos">1</a></main>'), 'gate:html', /B1 faixa/);
const html = fs.readFileSync(path.join(raiz, estudo), 'utf8');
const semTitulo = html.replace(parse(html).querySelector('h1').outerHTML, '');
const relativo = estudo.slice('dist/'.length);
const h3 = { nome: 'h3-titulo-retirado', antes: cabecaValida(html, relativo), planta: cabecaValida(semTitulo, relativo), reposto: sha(fs.readFileSync(path.join(raiz, estudo))) === sha(html) };
fs.writeFileSync(path.join(pasta, 'planta-h3-titulo-retirado.json'), JSON.stringify(h3, null, 2) + '\n');
if (!h3.antes || h3.planta || !h3.reposto) throw new Error('H3 não mordeu ou não foi reposta.');
for (const portao of ['gate:html', 'check:lugar', 'check:datas', 'check:voz', 'check:cadeia']) {
  const r = correr(`reposta-${portao.replace(':', '-')}`, portao);
  if (r.codigo !== 0) throw new Error(`Reposição não está limpa: ${portao}`);
}
console.log(`${resultados.length} plantas: todas morderam e todas foram repostas.`);
