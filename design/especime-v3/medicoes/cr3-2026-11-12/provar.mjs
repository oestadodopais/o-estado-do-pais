/** CR3: lê o HTML e confronta cada campo novo com a aplicação conferida. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../../../src/lib/ledger.mjs';
import {todasAsMudancas,mudancasDoRegisto} from '../../../../src/lib/mudancas.mjs';
import {desdeOLancamento} from '../../../../site.config.mjs';
import {revisoesPeloLivro,conferirRevisoes} from '../../../../scripts/revisoes-da-semana.mjs';
const pasta=new URL('./',import.meta.url), ler=n=>JSON.parse(fs.readFileSync(new URL(n,pasta),'utf8'));
const aplicacao=ler('aplicacao.json'), publicados=ler('aplicacao-published-at.json');
const normal=s=>String(s).replace(/\s+/g,' ').trim(), data=s=>s.split('-').reverse().join('.');
const livro=loadClaims(), recibos=[],semanas=[],superficies=[];
for(const lang of ['pt','en']){
 for(const linha of aplicacao.linhas){
  const id=linha.id,rota=`${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`;
  const root=parse(fs.readFileSync('dist/'+rota,'utf8'));
  const valor=normal(root.querySelector(`[data-claim="${id}"].linha-valor-num`).textContent);
  assert.equal(valor,linha.valor_novo);
  const publicado=normal(root.querySelector(`[data-de-linha="${id}"][data-de-campo="published_at"]`).textContent);
  assert.equal(publicado,data(publicados.linhas.find(x=>x.id===id).published_at));
  const entradas=[];
  for(const [i,entrada] of linha.entradas_novas.entries()){
   const n=linha.correcoes_antes+i,campos={};
   for(const campo of ['date','old_value','new_value','reason']){
    const el=root.querySelector(`[data-correcao-claim="${id}"][data-correcao-n="${n}"][data-correcao-campo="${campo}"]`);
    assert(el,`${rota}: falta ${n}.${campo}`);
    campos[campo]=normal(el.textContent);
    const esperado=campo==='reason'?entrada[lang==='pt'?'reason':'reason_en']:campo==='date'||entrada.field==='access_date'?data(entrada[campo]):entrada[campo];
    assert.equal(campos[campo],normal(esperado));
   }
   entradas.push({kind:entrada.kind,field:entrada.field??null,...campos});
  }
  recibos.push({linha:id,lingua:lang,rota,valor,publicado,entradas});
  const rotaCorrecoes=lang==='pt'?'correcoes/index.html':'en/corrections/index.html';
  const correcoes=parse(fs.readFileSync('dist/'+rotaCorrecoes,'utf8'));
  const atualizacao=correcoes.querySelector(`[data-correcao-claim="${id}"][data-correcao-n="${linha.correcoes_antes}"][data-correcao-campo="new_value"]`);
  const mudanca=todasAsMudancas(lang).find(e=>e.claim===id&&e.n===linha.correcoes_antes);
  assert.equal(mudanca.depois,linha.valor_novo);assert.equal(mudanca.lugar.chave,'portugal');
  const visivel=desdeOLancamento(mudanca.data);
  assert.equal(mudancasDoRegisto(lang).some(e=>e.claim===id&&e.n===linha.correcoes_antes),visivel);
  if(visivel)assert.equal(normal(atualizacao?.textContent),linha.valor_novo);else assert.equal(atualizacao,null);
  superficies.push({rota:rotaCorrecoes,linha:id,valor:mudanca.depois,lugar:mudanca.lugar.chave,visivel,razao:visivel?'depois do lançamento':'o registo público só mostra mudanças a partir do lançamento'});
 }
 const rota=lang==='pt'?'explicacoes/leitura-da-semana/index.html':'en/explainers/weekly-reading/index.html';
 const root=parse(fs.readFileSync('dist/'+rota,'utf8')),frase=root.querySelector('[data-semana-frase]');
 const [inicio,fim]=frase.getAttribute('data-semana-janela').split('/');
 const pendentes=revisoesPeloLivro(livro,inicio,fim);
 assert.deepEqual(pendentes.map(x=>x.linha),['sobrecarga-do-custo-da-habitacao-2025-ue']);
 assert.deepEqual(conferirRevisoes(root,lang,livro,inicio,fim),[]);
 assert.equal(normal(root.querySelector('[data-semana="revisoes"]').textContent),String(pendentes.length));
 const adulterada=parse(root.outerHTML);adulterada.querySelector('[data-semana-revisao]').remove();
 assert(conferirRevisoes(adulterada,lang,livro,inicio,fim).length);
 semanas.push({lingua:lang,rota,frase:normal(frase.textContent),pendentes:pendentes.map(x=>x.linha),planta_omissao_recusada:true});
}
const habitacao='ledger/claims/sobrecarga-do-custo-da-habitacao-2025-ue.yml';
assert.equal(fs.readFileSync(habitacao,'utf8'),execFileSync('git',['show',`${aplicacao.cabeca_presa}:${habitacao}`],{encoding:'utf8'}));
fs.writeFileSync(new URL('html-conferido.json',pasta),JSON.stringify({recibos,semanas,superficies,habitacao_intacta:true},null,2)+'\n');
console.log(`CR3 HTML: ${recibos.length} recibos; ${recibos.reduce((n,r)=>n+r.entradas.length,0)} entradas; ${superficies.length} atualizações no registo; ${semanas.length} frases semanais e plantas; habitação intacta.`);
