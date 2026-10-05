/** RP4: mede o livro, o HTML e as plantas e escreve as testemunhas do relatório.
 * Uso: node design/especime-v3/medicoes/rp4-2026-10-04/medir.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';
import { parse } from 'node-html-parser';
import { allSeries } from '../../../../src/lib/series.mjs';
import { BASE_DO_INDICE } from '../../../../src/lib/formas/serie-do-pais.mjs';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { conferirSerie, plantasDaSerie, provasDoModulo } from '../../../../tests/formas/serie-do-pais.mjs';
import { conferirSeriesDosCartoes, plantasDosCartoesComSerie } from '../../../../tests/cartao/series.mjs';
import { plantasDaSerieDoBloco } from '../../../../tests/inicio/serie-do-bloco.mjs';
import { documentoDosAssuntos } from '../../../../tests/inicio/paginas-dos-assuntos.mjs';
import { conferirAuditoriaDasLeituras } from '../../../../tests/cartao/leituras.mjs';
const O = 'design/especime-v3/medicoes/rp4-2026-10-04';
const cmd = 'node ' + O + '/medir.mjs';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const sha = s => createHash('sha256').update(s).digest('hex');
const escreve = (nome, dados) => fs.writeFileSync(`${O}/${nome}`, JSON.stringify(dados, null, 2) + '\n');
const ler = nome => fs.readFileSync(`${O}/${nome}`, 'utf8').trim();
const cabeca=ler('portoes/cabeca');
const eProva = f => f.startsWith(O+'/') || f.startsWith('design/especime-v3/capturas/rp4-2026-10-04/');
assert(eProva(O+'/medidas.json'));assert(!eProva('src/lib/formas/serie-do-pais.mjs'));
const diferencas=git('diff','--name-only',cabeca,'--').split('\n').filter(Boolean);
assert(diferencas.every(eProva),'a árvore diverge da cabeça conferida fora das provas');
const serieNoTempo = s => s.eixo === 'periodo';
const livro = series => ({ series: series.length, pontos: series.reduce((n,s) => n+s.pontos.length,0), maior: Math.max(...series.map(s=>s.pontos.length)) });
assert.deepEqual(livro([{pontos:[{},{}]},{pontos:[{}]}]),{series:2,pontos:3,maior:2});
const atual = allSeries().filter(serieNoTempo);
const base = '61519cea8c93badd0a049b8993790e4dfec46637';
const antigos = git('ls-tree','-r','--name-only',base,'ledger/series').split('\n').filter(f=>f.endsWith('.yml')).map(f=>load(git('show',base+':'+f))).filter(serieNoTempo);
const contarPeriodos = texto => [...texto.matchAll(/^  - periodo:/gm)].length;
const amostra = 'pontos:\n  - periodo: "2015"\n    valor: 1\nlacunas:\n  - periodo: "2016"\n    razao: sem publicação\n';
assert.equal(contarPeriodos(amostra),2);assert.equal(load(amostra).pontos.length,1);assert.equal(load(amostra).lacunas.length,1);
const historica = '905105b7';
const textosHistoricos = git('ls-tree','-r','--name-only',historica,'ledger/series').split('\n').filter(f=>f.endsWith('.yml')).map(f=>git('show',historica+':'+f)).filter(t=>serieNoTempo(load(t)));
const historicos = textosHistoricos.map(t=>load(t));
const lacunas = series => series.reduce((n,s)=>n+(s.lacunas??[]).length,0);
const contadorDoBrief = {cabeca:historica, ...livro(historicos), lacunas:lacunas(historicos), linhas_periodo:textosHistoricos.reduce((n,t)=>n+contarPeriodos(t),0)};
assert.equal(contadorDoBrief.linhas_periodo,contadorDoBrief.pontos+contadorDoBrief.lacunas);
const brief = fs.readFileSync('design/observatorio/medidas/BRIEF-RP4.json');
const reproduzido = fs.readFileSync(`${O}/brief-reproduzido.json`);
assert.equal(Buffer.compare(brief,reproduzido),0);
assert.notEqual(sha(Buffer.concat([brief,Buffer.from('x')])),sha(brief));
const contas = { desenhos:0, recibos:0, indices:0, erros:[], tabelas:[], paginas:[] };
const plantas = { geometria:[], modulo:provasDoModulo(), cartoes:[], primeira:[] };
for (const f of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'))) {
  const html=fs.readFileSync(path.join('dist',f),'utf8');
  if(!html.includes('data-forma="serie-do-pais"'))continue;
  const r=parse(html);const lang=r.querySelector('html').getAttribute('lang')==='en'?'en':'pt';
  const svgs=r.querySelectorAll('svg[data-forma="serie-do-pais"]');
  contas.paginas.push({ficheiro:f,lang,desenhos:svgs.length});
  contas.desenhos+=svgs.length;
  for(const svg of svgs){contas.erros.push(...conferirSerie(svg,lang).map(e=>`${f}: ${e}`));if(svg.getAttribute('data-modo')==='indice')contas.indices++;}
  for(const t of r.querySelectorAll('[data-serie-tabela]')) {
    contas.recibos++;
    const id=t.getAttribute('data-serie-tabela');const s=atual.find(s=>s.id===id);
    const pontos=t.querySelectorAll('[data-ponto]').map(p=>p.getAttribute('data-ponto'));
    assert.deepEqual(pontos,s.pontos.map(p=>`${s.id}#${p.periodo}`));
    contas.tabelas.push({id,lang,anos:t.querySelectorAll('tbody tr').length,pontos:pontos.length,colunas:t.querySelectorAll('thead th').length-1,lacunas:t.querySelectorAll('[data-serie-lacuna-tabela]').length});
  }
}
const cartoes={};
for(const lang of ['pt','en']) {
 const doc=documentoDosAssuntos('dist',lang);const r=conferirSeriesDosCartoes(doc,lang);
 const esperados=[...loadClaims().values()].filter(c=>c.serie).map(c=>c.id).sort();
 assert.deepEqual([...new Set(r.vistos)].sort(),esperados);assert.deepEqual(r.erros,[]);
 cartoes[lang]=[...new Set(r.vistos)].sort();
 plantas.geometria.push(...plantasDaSerie(doc.outerHTML,lang).map(p=>({lang,...p})));
 plantas.cartoes.push(...plantasDosCartoesComSerie(doc.outerHTML,lang).map(p=>({lang,...p})));
 plantas.primeira.push(...plantasDaSerieDoBloco(fs.readFileSync(`dist/${lang==='en'?'en/':''}index.html`,'utf8'),lang).map(p=>({lang,...p})));
}
assert.deepEqual(contas.erros,[]);
for(const familia of ['geometria','cartoes','primeira'])assert(plantas[familia].every(p=>p.mordeu));
escreve('plantas.json',plantas);
const auditoria=conferirAuditoriaDasLeituras();assert.deepEqual(auditoria.erros,[]);
escreve('geometria-e-tabelas.json',{comando:cmd,contas,cartoes,auditoria});
const paleta=JSON.parse(ler('paleta-e-geometria.json'));
assert.deepEqual(paleta.falhas,[]);assert(paleta.plantas.every(p=>p.mordeu));
const plantaDaPaleta=paleta.plantas.find(p=>p.nome==='preenchimento preto nas guias da série');assert(plantaDaPaleta?.mordeu);
const provaDasSeries=JSON.parse(ler('series.json'));
assert(Object.values(provaDasSeries.erros).every(e=>e.length===0));assert(provaDasSeries.plantas.every(p=>p.mordeu));
const capturas=JSON.parse(ler('capturas.json'));
assert.equal(capturas.cabeca,cabeca);
const cabecaConstruida=JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit;
execFileSync('git',['merge-base','--is-ancestor',cabeca,cabecaConstruida]);
assert(git('diff','--name-only',cabeca,cabecaConstruida,'--').split('\n').filter(Boolean).every(eProva),'a construção difere do código conferido');
const ficheirosDasCapturas=capturas.capturas.map(c=>c.ficheiro);
assert.equal(new Set(ficheirosDasCapturas).size,ficheirosDasCapturas.length);
assert.equal(fs.readdirSync('design/especime-v3/capturas/rp4-2026-10-04').length,ficheirosDasCapturas.length);
for(const c of capturas.capturas){const b=fs.readFileSync(c.ficheiro);assert.equal(b.length,c.bytes);assert.equal(sha(b),c.sha256);}
assert.equal(capturas.erros.length,0);
assert(capturas.plantas.every(p=>p.mordeu));
const gates={};
const codigo = texto => {assert(/^\d+$/.test(texto));return Number(texto);};
assert.equal(codigo('1'),1);assert.throws(()=>codigo(''));
for(const g of ['build','verify','typecheck']) {
 const inicio=ler(`portoes/${g}.inicio`);const fim=ler(`portoes/${g}.fim`);
 gates[g]={codigo:codigo(ler(`portoes/${g}.codigo`)),inicio,fim,segundos:(Date.parse(fim)-Date.parse(inicio))/1000};
 assert.equal(gates[g].codigo,0,`o portão ${g} não está verde`);
}
assert.equal(cabeca,ler('portoes/cabeca.fim'));
const alterados=git('diff','--name-only',base,'--','ledger','src/lib/series.mjs');assert.equal(alterados,'');
const medidas={
 cabeca_do_codigo:cabeca,base_do_bloco:base,modelo:'gpt-6-astra',
 brief:{comando:'OEDP_MEDIDAS_JSON=<pasta>/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-RP4.py; cmp <brief> <reprodução>',bate:sha(brief)===sha(reproduzido),sha256:sha(brief),conhecido_positivo:'um byte acrescentado muda o resumo, conferido pelo guião'},
 contador_do_brief:{comando:cmd,...contadorDoBrief,erro:'o contador de linhas periodo inclui as lacunas nos pontos',conhecido_positivo:{linhas_periodo:2,pontos:1,lacunas:1}},
 livro:{comando:cmd,antes:{...livro(antigos),lacunas:lacunas(antigos)},depois:{...livro(atual),lacunas:lacunas(atual)},linhas_presas:cartoes.pt.length,ficheiros_do_livro_alterados:alterados?alterados.split('\n').length:0,conhecido_positivo:{series:2,pontos:3,maior:2}},
 forma:{comando:cmd,desenhos:contas.desenhos,recibos:contas.recibos,paginas:contas.paginas.length,modos_indexados_rendidos:contas.indices,provas_do_modulo:plantas.modulo.length,plantas_geometria:plantas.geometria.length,plantas_geometria_mordidas:plantas.geometria.filter(p=>p.mordeu).length,conhecido_positivo:'plantas.json: ponto deslocado, marca trocada, série trocada e guião'},
 indice:{comando:cmd,ano_da_base:Number(BASE_DO_INDICE.mensal.slice(0,4)),periodos:BASE_DO_INDICE,conhecido_positivo:'plantas.json: duas cadências com a base na marca de cem; base ausente e nula recusadas'},
 series:{comando:cmd,plantas:provaDasSeries.plantas.length,plantas_mordidas:provaDasSeries.plantas.filter(p=>p.mordeu).length,conhecido_positivo:'series.json: cada planta regista a queixa esperada e a mordida do detetor'},
 cartoes:{comando:cmd,pt:cartoes.pt.length,en:cartoes.en.length,plantas:plantas.cartoes.length,plantas_mordidas:plantas.cartoes.filter(p=>p.mordeu).length,conhecido_positivo:'plantas.json: cartão sem série a desenhar; gráfico retirado; porta noutra edição; gráfico fora do lugar'},
 primeira:{comando:cmd,plantas:plantas.primeira.length,plantas_mordidas:plantas.primeira.filter(p=>p.mordeu).length,conhecido_positivo:'plantas.json: série inexistente, série de países e gráfico retirado'},
 paleta:{comando:'node tests/inicio/geometria.mjs --prova --json '+O+'/paleta-e-geometria.json',corridas:paleta.corridas.length,falhas:paleta.falhas.length,plantas:paleta.plantas.length,plantas_mordidas:paleta.plantas.filter(p=>p.mordeu).length,conhecido_positivo:plantaDaPaleta},
 ipc: {comando:cmd,...contas.tabelas.find(t=>t.id==='serie-ipc-indice'&&t.lang==='pt'),conhecido_positivo:'series.json: um ponto tirado da tabela e duas colunas trocadas'},
 capturas:{comando:capturas.comando,cabeca:capturas.cabeca,ficheiros:capturas.capturas.length,larguras:capturas.larguras,edicoes:[...new Set(capturas.capturas.map(c=>c.lang))].length,transbordos:capturas.erros.length,letra_minima:Math.min(...capturas.capturas.map(c=>c.letraMinima)),conhecido_positivo:capturas.conhecido_positivo,plantas:capturas.plantas},
 portoes:{comando:'sh scripts/leituras/portoes.sh <worktree> '+O+'/portoes',cabeca,cabeca_fim:ler('portoes/cabeca.fim'),...gates,conhecido_positivo:'o leitor devolve um para o código um e recusa um ficheiro vazio'},
 commits:{comando:'git log --format=%H %s '+base+'..'+cabeca,lista:git('log','--format=%H %s',base+'..'+cabeca).split('\n'),conhecido_positivo:'a cabeça inicial é antepassada da cabeça dos portões; qualquer diferença posterior fica nas pastas de provas'},
};
execFileSync('git',['merge-base','--is-ancestor',base,cabeca]);
escreve('medidas.json',medidas);
console.log(JSON.stringify({desenhos:contas.desenhos,recibos:contas.recibos,cartoes,portoes:gates,capturas:capturas.capturas.length},null,2));
