/** EVL-D: adulterações num recibo real passam pela régua usada pelo portão. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';

const linha = 'evora-2027-contribuicao-inicial-do-estado-2024';
const temporario = fs.mkdtempSync(path.join(os.tmpdir(), 'evl-d-nomes-'));
const resultados = [];
try {
  fs.copyFileSync('dist/version.json', path.join(temporario, 'version.json'));
  for (const [lingua, livro] of [['pt', 'livro-razao'], ['en', 'en/ledger']]) {
    const rota = `${livro}/${linha}/index.html`;
    const original = fs.readFileSync(`dist/${rota}`, 'utf8');
    const destino = path.join(temporario, rota);
    fs.mkdirSync(path.dirname(destino), {recursive:true});
    for (const caso of ['controlo', 'palavra trocada', 'ano trocado', 'vírgula tirada']) {
      const pagina = parse(original);
      const nome = pagina.querySelector(`.linha-titulo-nome[data-de-linha="${linha}"]`);
      assert(nome, 'o título do recibo tem de declarar a linha');
      if (caso === 'palavra trocada') nome.set_content(nome.innerHTML.replace('euros', 'intruso'));
      if (caso === 'ano trocado') nome.querySelector('[data-nonledger]').set_content('2023');
      if (caso === 'vírgula tirada') {
        assert(nome.innerHTML.includes('2024</span>,'));
        nome.set_content(nome.innerHTML.replace('2024</span>,', '2024</span>'));
      }
      fs.writeFileSync(destino, pagina.toString());
      const r = spawnSync(process.execPath, ['scripts/medir-defeitos.mjs', '--json'], {
        env:{...process.env, OEDP_DIST:temporario}, encoding:'utf8', maxBuffer:128*1024*1024,
      });
      assert.equal(r.status, 0, 'a medição da planta tem de terminar');
      const nomes = JSON.parse(r.stdout).voz.nomes_declarados;
      const erros = nomes.fora_da_fonte;
      assert.equal(erros.length, caso === 'controlo' ? 0 : 1, `${lingua}: ${caso}`);
      if (caso !== 'controlo') {
        assert.equal(erros[0].caminho, `/${livro}/${linha}`);
        assert.equal(erros[0].fonte, 'projeto');
        assert(erros[0].porque.includes(`não é o nome da linha "${linha}"`));
      }
      resultados.push({lingua, caso, codigo_medicao:r.status, recusas:erros.length});
    }
    assert.equal(fs.readFileSync(`dist/${rota}`, 'utf8'), original, 'o recibo original não pode mudar');
    fs.unlinkSync(destino);
  }
} finally {
  fs.rmSync(temporario, {recursive:true, force:true});
}
if (process.env.OEDP_MEDICOES) fs.writeFileSync(path.join(process.env.OEDP_MEDICOES, 'evl-d-plantas.json'), JSON.stringify(resultados,null,2)+'\n');
console.log(`EVL-D: ${resultados.filter(r=>r.caso==='controlo').length} controlos verdes; ${resultados.filter(r=>r.caso!=='controlo').length} plantas recusadas; recibos originais intactos.`);
