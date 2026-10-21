/** HB1-c: prova a comparação de datas da EX3 em processos isolados. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const {loadClaims} = await import(pathToFileURL(path.resolve('src/lib/ledger.mjs')));
const {valorNaLingua} = await import(pathToFileURL(path.resolve('src/lib/valor-na-lingua.mjs')));
const codigo = fs.readFileSync('tests/explicacoes/ex3.mjs','utf8');
const inicio = codigo.indexOf("for(const [id,r] of linhas)for(const lang of ['pt','en']){");
const fim = codigo.indexOf("if(!process.argv.includes('--declaracao'))",inicio);
assert(inicio >= 0 && fim > inicio);
const trecho = codigo.slice(inicio,fim), linhas = loadClaims(), resultados = [];
const data = [...linhas.values()].find(r => r.unit === 'data' && /^\d{2}\/\d{2}\/\d{4}$/.test(String(r.value)));
const numero = linhas.get('nato-defesa-portugal-pib-2026');
assert(data && numero);
for (const lingua of ['pt','en']) {
  const certo = valorNaLingua(data,lingua);
  const casos = [['controlo',data,certo,0]];
  for (const [indice,nome] of ['dia','mes','ano'].entries()) {
    const partes = certo.split('.');
    partes[indice] = String(Number(partes[indice])+1).padStart(partes[indice].length,'0');
    casos.push([nome,data,partes.join('.'),1]);
  }
  casos.push(['separador',data,certo.replaceAll('.','/'),1]);
  casos.push(['precisao',numero,String(numero.value).slice(0,-1),1]);
  for (const [planta,linha,rendido,esperado] of casos) {
    const programa = `import assert from 'node:assert/strict';\nconst linhas=new Map([[${JSON.stringify(linha.id)},${JSON.stringify(linha)}]]);\nconst original=${valorNaLingua.toString()};\nconst valorNaLingua=(r,l)=>l===${JSON.stringify(lingua)}?${JSON.stringify(rendido)}:original(r,l);\n${trecho}`;
    const r = spawnSync(process.execPath,['--input-type=module'],{input:programa,encoding:'utf8'});
    assert.equal(r.status,esperado,`${planta} ${lingua}`);
    if (esperado) assert(r.stderr.includes('ERR_ASSERTION'));
    resultados.push({planta,lingua,linha:linha.id,valor_original:linha.value,valor_plantado:rendido,codigo:r.status,esperado});
  }
}
fs.writeFileSync(process.argv[2],JSON.stringify({codigo:0,sha256_teste:createHash('sha256').update(codigo).digest('hex'),resultados},null,2)+'\n');
console.log(JSON.stringify({codigo:0,controlos:resultados.filter(r=>r.codigo===0).length,plantas_recusadas:resultados.filter(r=>r.codigo===1).length}));
