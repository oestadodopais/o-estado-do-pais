/** Plantas da correção de 22.09. Cada página é reposta em finally e por sha256.
 * Os comandos são os portões reais; nenhuma frase da leitura é alterada. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
const pasta = path.dirname(new URL(import.meta.url).pathname);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const resultados = [];
function corre(nome, comando, args) {
  const r = spawnSync(comando, args, { encoding:'utf8', maxBuffer:128*1024*1024 });
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(pasta, `${nome}.log`), saida);
  return { comando:[comando,...args].join(' '), codigo:r.status, saida:saida.replace(/\x1b\[[0-9;]*m/g,'') };
}
function planta(nome, ficheiro, seletor, novo, comando, args, mordida) {
  const antes = fs.readFileSync(ficheiro);
  const root = parse(antes.toString());
  const alvo = root.querySelector(seletor);
  if (!alvo) throw Error(`${nome}: alvo ausente`);
  const antigo = alvo.textContent;
  alvo.set_content(novo);
  const alterado = root.toString();
  if (alterado === antes.toString()) throw Error(`${nome}: não mudou`);
  let r;
  try {
    fs.writeFileSync(ficheiro, alterado);
    r = corre(nome,comando,args);
  } finally { fs.writeFileSync(ficheiro,antes); }
  const depois = sha(fs.readFileSync(ficheiro));
  const linhas = r.saida.split('\n').filter(l => l.includes(mordida));
  const passou = r.codigo === 1 && linhas.length > 0 && depois === sha(antes);
  resultados.push({ nome, ficheiro, antigo, novo, comando:r.comando, codigo:r.codigo, mordidas:linhas, antes:sha(antes), plantado:sha(alterado), depois, passou });
  console.log(`${passou?'OK':'FALHA'} ${nome}: código ${r.codigo}; ${linhas.join(' | ')}; bytes repostos ${depois===sha(antes)}`);
  if (!passou) throw Error(`${nome}: a planta não foi recusada pela célula esperada`);
}
try {
  for (const [nome, comando, args] of [
    ['cartao-correcao-sao','npm',['run','check:cartao']],
    ['voz-correcao-sao','npm',['run','check:voz']],
  ]) {
    const r=corre(nome,comando,args);
    resultados.push({nome,comando:r.comando,codigo:r.codigo,passou:r.codigo===0});
    console.log(`${r.codigo===0?'OK':'FALHA'} ${nome}: código ${r.codigo}`);
    if(r.codigo!==0)throw Error(`${nome}: a página sã falhou`);
  }
  for (const [lang,ficheiro,antigo,olho] of [
    ['pt','dist/index.html','Dívida da câmara contra o limite legal','Estudos sobre este lugar'],
    ['en','dist/en/index.html','Municipal debt against the legal cap','Studies about this place'],
  ]) {
    planta(`planta-correcao-nome-${lang}`,ficheiro,'[data-cartao-medida="indice-de-divida-limite-legal"] .cartao-medida-nome',antigo,
      'node',['tests/cartao/cartao.mjs'],'nome do cartão difere da declaração');
    planta(`planta-correcao-olho-${lang}`,ficheiro,'#estudos-k',olho,
      'npm',['run','check:voz'],'B1 lista fechada país');
    planta(`planta-correcao-publicacao-${lang}`,ficheiro,'[data-mudanca="publicacao"] p span','Prosa solta da planta',
      'npm',['run','check:voz'],'B1 lista fechada país');
  }
} finally {
  fs.writeFileSync(path.join(pasta,'plantas-correcao-peca3.json'),JSON.stringify(resultados,null,2)+'\n');
}
