/** PAI1-B: contagens independentes, datas e plantas em cópias do livro e do HTML. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
import {leituraDaSemana,primeiraFraseDaSemana} from '../../src/lib/leitura-da-semana.mjs';
import {t} from '../../src/i18n/strings.mjs';
import {revisoesPeloLivro,conferirRevisoes} from '../../scripts/revisoes-da-semana.mjs';
import {contasDaSemanaNoPortao,conferirMarcaDaSemana} from '../../scripts/explicacoes-do-portao.mjs';
import {semanaPelaCelula,primeiraFrasePelaCelula,conferirPaginaDaSemana,marcaComparada} from './semana.mjs';
import {conferirOQueENasMudancas} from './o-que-e.mjs';
import {analisa,leMarcadores} from '../../scripts/voz.mjs';
const linhas=loadClaims(), dist=process.env.OEDP_DIST||'dist';
const data=s=>s.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$3.$2.$1');
let provas=0;
const prova=(nome,f)=>{f();provas++;console.log(`PAI1-B: ${nome}: 0`);};
const datas=process.argv.includes('--datas');
for(const lang of ['pt','en']) {
  const rota=lang==='pt'?'explicacoes/leitura-da-semana/index.html':'en/explainers/weekly-reading/index.html';
  const original=fs.readFileSync(path.join(dist,rota),'utf8'), root=parse(original);
  const [inicio,fim]=root.querySelector('[data-semana-frase]').getAttribute('data-semana-janela').split('/');
  const copia=()=>parse(original);
  const pendentes=revisoesPeloLivro(linhas,inicio,fim);
  prova(`controlo da página e das datas (${lang})`,()=>assert.deepEqual(conferirRevisoes(root,lang,linhas,inicio,fim),[]));
  if(pendentes.length) {
    prova(`data de outra releitura recusada (${lang})`,()=>{
      const r=copia();r.querySelector('[data-semana-revisao] [data-de-campo^="verifications."]').set_content('01.01.1900');
      assert.ok(conferirRevisoes(r,lang,linhas,inicio,fim).some(e=>e.includes('data da releitura errada')));
    });
  }
  if(datas) continue;
  prova(`definições dos recibos (${lang})`,()=>assert.deepEqual(conferirOQueENasMudancas(root,lang,'leituraDaSemana',dist),[]));
  if(pendentes.length) prova(`definição trocada recusada (${lang})`,()=>{
    const r=copia();r.querySelector('[data-semana-revisao] [data-o-que-e]').set_content('Definição trocada.');
    assert.ok(conferirOQueENasMudancas(r,lang,'leituraDaSemana',dist).some(e=>e.includes('a frase mostrada não é a do recibo')));
  });
  const conta=semanaPelaCelula(linhas,fim), pagina=leituraDaSemana({fim});
  prova(`contagens independentes (${lang})`,()=>assert.deepEqual(pagina.contagens,conta.contagens));
  prova(`frase e secção conferidas (${lang})`,()=>assert.deepEqual(conferirPaginaDaSemana(root,lang,[fim],linhas),[]));
  if(pendentes.length) {
    prova(`divergência omitida da frase (${lang})`,()=>{
      const r=copia();r.querySelector('[data-semana="revisoes"]').set_content(String(pendentes.length-1));
      assert.ok(conferirPaginaDaSemana(r,lang,[fim],linhas).some(e=>e.includes('frase das contagens difere')));
    });
    prova(`nenhum mudou sem declarar a revisão (${lang})`,()=>{
      const r=copia(), sem=structuredClone(conta);sem.contagens.revisoes=0;
      r.querySelector('[data-semana-frase]').set_content(primeiraFrasePelaCelula(sem,lang));
      assert.ok(conferirPaginaDaSemana(r,lang,[fim],linhas).some(e=>e.includes('frase das contagens difere')));
    });
    prova(`entrada omitida (${lang})`,()=>{
      const r=copia();r.querySelector('[data-semana-revisao]').remove();
      assert.ok(conferirRevisoes(r,lang,linhas,inicio,fim).length);
    });
    prova(`portão recusa contagem errada (${lang})`,()=>{
      const r=copia(), e=r.querySelector('[data-semana="revisoes"]');e.set_content(String(pendentes.length+1));
      assert.ok(conferirMarcaDaSemana(e,{rota:'leituraDaSemana',porta:'',claims:linhas,aceites:[fim],texto:e=>e.textContent,dataDaCasa:data,milhares:String}).length);
    });
    prova(`unidade de outra linha recusada (${lang})`,()=>{
      const r=copia();r.querySelector('[data-semana-revisao] [data-linha-campo="unit"]').setAttribute('data-linha-claim','taxa-de-desemprego-mip-2025');
      assert.ok(conferirRevisoes(r,lang,linhas,inicio,fim).some(e=>e.includes('unidade de outra linha')));
    });
    prova(`inventário só reconhece a entrada dentro da lista (${lang})`,()=>{
      const r=copia(), e=r.querySelector('[data-semana-revisao]');assert.ok(marcaComparada(e,'leituraDaSemana'));
      e.remove();r.querySelector('main').appendChild(e);assert.equal(marcaComparada(e,'leituraDaSemana'),false);
    });
  }
  prova(`voz das frases novas e planta lexical (${lang})`,()=>{
    const voz=leMarcadores(process.cwd()), c=t(lang).semana;
    for(const frase of [c.fonteReviu+c.umaRevisao,c.fonteReviu+c.variasRevisoes,c.revisoesK,c.publicado+c.fonteAgora+c.naReleitura]) assert.deepEqual(analisa(frase,rota,voz),[]);
    assert.ok(analisa(`${c.revisoesK} ${voz.marcadores[0].marcador}`,rota,voz).length);
  });
  prova(`linha reunida entra na contagem e na lista (${lang})`,()=>{
    const l=structuredClone(linhas.get('taxa-de-desemprego-2025'));
    l.corrections=[];l.verifications=[{date:fim,result:'diverge',found:'6.0'}];
    const livro=new Map([[l.id,l]]), r=leituraDaSemana({fim,linhas:livro.values()});
    assert.equal(r.contagens.relidas,1);assert.equal(r.contagens.revisoes,1);
    assert.deepEqual(r.revisoes.map(x=>x.linha),[l.id]);
    assert.equal(semanaPelaCelula(livro,fim).contagens.relidas,1);
    assert.deepEqual(revisoesPeloLivro(livro,inicio,fim).map(x=>x.linha),[l.id]);
    assert.equal(contasDaSemanaNoPortao(livro,inicio,fim).relidas,1);
  });
  // Cada cenário parte de uma cópia da mesma linha, sem história anterior.
  const base=structuredClone(linhas.get('desempenho-das-exportacoes-2024'));
  base.corrections=[];base.verifications=[{date:inicio,result:'diverge',found:'17.0'}];
  for(const [nome,mudar,n] of [
    ['pendente',()=>{},1],
    ['última igual',l=>l.verifications.push({date:fim,result:'igual'}),0],
    ['correção posterior',l=>l.corrections.push({date:fim,kind:'correcao',old_value:l.value,new_value:'17,0'}),0],
    ['atualização posterior',l=>l.corrections.push({date:fim,kind:'atualizacao',old_value:l.value,new_value:'17,0'}),0],
    ['proveniência não aplica valor',l=>l.corrections.push({date:fim,kind:'proveniencia'}),1],
  ]) prova(`${nome} no livro copiado (${lang})`,()=>{
    const l=structuredClone(base);mudar(l);const livro=new Map([[l.id,l]]), r=leituraDaSemana({fim,linhas:livro.values()});
    assert.equal(r.contagens.revisoes,n);assert.equal(revisoesPeloLivro(livro,inicio,fim).length,n);
    assert.equal(contasDaSemanaNoPortao(livro,inicio,fim).revisoes,n);
    assert.equal(primeiraFraseDaSemana(r,t(lang).semana,data,String).map(x=>typeof x==='string'?x:x.texto).join(''),primeiraFrasePelaCelula(semanaPelaCelula(livro,fim),lang));
  });
}
console.log(`PAI1-B: ${provas} provas, código 0.`);
