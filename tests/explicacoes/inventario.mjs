/** EX2-b: o inventário real tem de recolher um resumo declarado fora da lista conferida. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
export function plantasDoInventarioDaSemana(dist) {
  const cache=path.resolve('node_modules/.cache');fs.mkdirSync(cache,{recursive:true});
  const tmp=fs.mkdtempSync(path.join(cache,'ex2-inventario-'));
  const rotas=['explicacoes/leitura-da-semana','en/explainers/weekly-reading','indice','en/index'];
  const texto='Uma revisão declarada fora da lista que a célula confere.';
  const mede=()=>{
    const saida=execFileSync(process.execPath,['scripts/medir-defeitos.mjs','--json'],{env:{...process.env,OEDP_DIST:tmp},encoding:'utf8',maxBuffer:64*1024*1024});
    return JSON.parse(saida.slice(saida.indexOf('{'))).frases_da_casa.por_rota;
  };
  try {
    for(const rota of rotas) {fs.mkdirSync(path.join(tmp,rota),{recursive:true});fs.copyFileSync(path.join(dist,rota,'index.html'),path.join(tmp,rota,'index.html'));}
    const controlo=mede();
    for(const rota of rotas) {
      const f=path.join(tmp,rota,'index.html'),r=parse(fs.readFileSync(f,'utf8'));
      r.querySelector('main').insertAdjacentHTML('beforeend',`<li data-semana-mudanca="custo-unitario-do-trabalho-2024"><p data-semana-resumo data-semana-declarado>${texto}</p></li>`);
      fs.writeFileSync(f,r.toString());
    }
    const estragado=mede();
    return rotas.map(rota=>{
      const antes=controlo['/'+rota],depois=estragado['/'+rota];
      const mordeu=Boolean(antes&&depois&&!antes.nao_classificados.includes(texto)&&depois.nao_classificados.includes(texto));
      return {nome:`inventário: um resumo declarado fora da lista, /${rota}`,mordeu,mensagem:'bloco por classificar',queixa:mordeu?`bloco por classificar em /${rota}: «${texto}»`:'o inventário não recolheu o resumo fora da lista, ou falhou o controlo'};
    });
  } finally {fs.rmSync(tmp,{recursive:true,force:true});}
}
