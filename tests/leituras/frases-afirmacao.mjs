import './frases-adenda-e.mjs';
import './frases-adenda-d.mjs';
import './frases-adenda-c.mjs';
import {execFileSync} from 'node:child_process';
execFileSync('python3',['tests/leituras/frases-indice.py'],{stdio:'inherit'});
/** CAM2-A: controlos e estragos independentes da lista de dívida. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from 'js-yaml';
import {MARCAS, marcasDaFrase, cortar, tiposDaFrase, normal, sha256, chave, blocosDaPagina, parDaFrase, rotasDaProsa} from '../../scripts/frases-com-afirmacao.mjs';
import {conferirRegisto, conferirCobertura, conferirHistorico, compararListas, validarPendentes} from '../../scripts/check-frases-afirmacao.mjs';
import {semear} from '../../scripts/gerar-frases-afirmacao.mjs';
import {dividir, conferirPartes} from '../../scripts/verify-partes.mjs';
const casos = JSON.parse(fs.readFileSync('tests/leituras/frases-afirmacao-reais.json', 'utf8'));
for (const l of ['pt','en']) for (const positivo of [true,false]) assert(casos.filter(c=>c.lingua===l && c.apanha===positivo).length>=5);
for (const c of casos) assert.equal(Boolean(tiposDaFrase(c.frase,c.lingua).length),c.apanha,c.frase);
const isoladas=JSON.parse(fs.readFileSync('tests/leituras/frases-marcas-plantas.json','utf8'));
assert.equal(isoladas.length,MARCAS.length);
for(const m of MARCAS) {const c=isoladas.find(c=>c.marca===m.id);assert(c,m.id);assert.deepEqual(marcasDaFrase(c.frase,c.lingua),[m.id],m.id);}
for(const lingua of ['pt','en']) for(const ordinal of 'trimestre semestre ano mandato relatório protocolo lugar desencontro turno ciclo período painel'.split(' ')) assert.deepEqual(tiposDaFrase(`O segundo ${ordinal} terminou.`,lingua),[],ordinal);
for(const frase of ['Mecanismo de Alerta','Sistema de Alerta','A indicação fica aqui.','A estimativa é esta.','A conclusão fica aqui.']) assert.deepEqual(tiposDaFrase(frase,'pt'),[],frase);
for(const pontuacao of ['.','!','?']) assert.deepEqual(cortar(`Disse «Uma declaração${pontuacao}» Outra frase.`),[`Disse «Uma declaração${pontuacao}»`,'Outra frase.']);
assert.equal(cortar('Disse «Uma declaração.» outra parte.').length,1);
const f = {id:'planta', estudo:'planta', tipos:['atribuicao'], origem:'semente', juizo:'por julgar', pt:'Segundo a fonte, «Uma citação de ensaio».', en:'According to the source, “A quotation for a test”.', linhas:['linha']};
const linha = {id:'linha', afirmacao:true, excerpt:'Uma citação de ensaio', document:{source_sha256:'a'.repeat(64)}};
const paginas = [
 {rota:'/pt',par:'/en',estudo:'planta',lingua:'pt',blocos:blocosDaPagina(`<main><p>${f.pt}<a class="src-chip" data-claim="linha">selo</a></p></main>`)},
 {rota:'/en',par:'/pt',estudo:'planta',lingua:'en',blocos:blocosDaPagina(`<main><p>${f.en}<a class="src-chip" data-claim="linha">seal</a></p></main>`)},
];
const livro = new Map([['linha',linha]]), clone = x => structuredClone(x);
const validar = (r=[f],p=paginas,l=livro) => conferirRegisto(r,p,l,{sementes:r});
assert.deepEqual(validar().erros,[]);
assert.equal(paginas[0].blocos[0].texto,f.pt);
assert.equal(semear(paginas,livro).registo.length,1);
const semPar=clone(paginas);semPar[1].blocos[0].frases.push('Outra frase.');assert.equal(semear(semPar,livro).registo.length,0);
let plantas=0;
function recusa(nome,r,p=paginas,l=livro){assert(validar(r,p,l).erros.length,nome);plantas++;}
for(const juizo of [undefined,'aprovado','limpo']) recusa('semente também por julgar',[{...f,juizo}]);
recusa('linha inexistente',[{...f,linhas:['ausente']}]);
for(const campo of ['excerpt','document']){const l=clone(linha);delete l[campo];recusa('falta '+campo,[f],paginas,new Map([['linha',l]]));}
for(const lingua of ['pt','en'])recusa('frase ausente '+lingua,[{...f,[lingua]:f[lingua]+' Alterada.'}]);
recusa('citação inventada no excerto',[f],paginas,new Map([['linha',{...linha,excerpt:'Outro excerto de ensaio'}]]));
const semAspas={...f,en:'According to the source, A quotation for a test.'};const ps=clone(paginas);ps[1].blocos[0].frases=[semAspas.en];recusa('citação só em pt',[semAspas],ps);
recusa('leitura sem marca',[{...f,tipos:['atribuicao','leitura'],razao:'Razão da planta'}]);
const leitura={...f,tipos:['atribuicao','leitura'],pt:f.pt+' (inferência)',en:f.en+' (inference)'};const pl=clone(paginas);pl.forEach(p=>p.blocos[0].frases=[leitura[p.lingua]]);recusa('leitura sem razão',[leitura],pl);assert.deepEqual(validar([{...leitura,razao:'Razão explícita da planta'}],pl).erros,[]);
const p2=clone(paginas);p2[1].blocos.push({tag:'P',texto:'Outra frase.',frases:['Outra frase.'],linhas:[]});assert(parDaFrase(p2,{pagina:'/pt',bloco:0,indice:0}));
const trocado=clone(paginas);trocado[1].blocos[0].frases=[f.en,'Another quotation.'];recusa('en presente sem par',[f],trocado);
const pendente={estudo:'planta',lingua:'pt',sha256:sha256(normal(f.pt))};const detetadas=[{estudo:'planta',lingua:'pt',frase:f.pt}];
assert.deepEqual(conferirCobertura(detetadas,new Set(),[pendente]),[]);
assert(conferirCobertura(detetadas,new Set(),[]).length);plantas++;
assert(conferirCobertura([],new Set(),[pendente]).length);plantas++;
assert(conferirCobertura([{...detetadas[0],frase:f.pt+' Reescrita.'}],new Set(),[pendente]).length);plantas++;
assert(conferirCobertura(detetadas,new Set([chave(pendente)]),[pendente]).length);plantas++;
assert(compararListas([],[pendente]).length);plantas++;
assert.throws(()=>validarPendentes([pendente,pendente]));plantas++;
const outro={...pendente,sha256:'b'.repeat(64)}, seed=[pendente,outro];
function historia(trees,pais,head,raso=false){
 const antepassados = rev => rev === 'base' ? [] : [...new Set([rev,...[pais[rev]].flat().flatMap(antepassados)])];
 return (...args)=>{
  if(args[0]==='rev-parse')return args[1]==='HEAD'?head:raso?'true':'false';
  if(args[0]==='merge-base')return '';
  if(args[0]==='ls-tree'){const rev=args[2]==='HEAD'?head:args[2];return trees[rev]===undefined?'':'ledger/frases/por-registar.json';}
  if(args[0]==='show'){const rev=args[1].split(':')[0];return JSON.stringify(trees[rev==='HEAD'?head:rev]);}
  if(args[0]==='rev-list'&&args[1]==='--full-history')return antepassados(head).join('\n');
  if(args[0]==='rev-list'&&args[1]==='--parents')return args[4]+' '+[pais[args[4]]].flat().join(' ');
  if(args[0]==='rev-list'&&args[1]==='-n')return antepassados(args[3].split('..').at(-1)==='HEAD'?head:args[3].split('..').at(-1))[0]??'';
  throw new Error('comando inesperado '+args.join(' '));
 };
}
const opts=(trees,pais,head,raso=false)=>({base:'base',semente:sha256(JSON.stringify(seed)),gitRun:historia(trees,pais,head,raso)});
assert.deepEqual(conferirHistorico([pendente],'.',opts({a:seed,b:[pendente]},{a:'base',b:'a'},'b')),[]);
assert(conferirHistorico([pendente],'.',opts({a:seed,b:[pendente],c:seed,d:[pendente]},{a:'base',b:'a',c:'b',d:'c'},'d')).length);plantas++;
assert(conferirHistorico(seed,'.',opts({a:seed,b:undefined,c:seed},{a:'base',b:'a',c:'b'},'c')).length);plantas++;
assert(conferirHistorico(seed,'.',opts({a:[pendente]},{a:'base'},'a')).length);plantas++;
assert.throws(()=>conferirHistorico(seed,'.',opts({a:seed},{a:'base'},'a',true)));plantas++;
assert.deepEqual(conferirHistorico([pendente],'.',opts({a:seed,b:[pendente],m:[pendente]},{a:'base',b:'a',m:['base','b']},'m')),[]);
assert(conferirHistorico(seed,'.',opts({a:seed,b:[pendente],m:seed},{a:'base',b:'a',m:['base','b']},'m')).length);plantas++;
const scripts=JSON.parse(fs.readFileSync('package.json')).scripts,w=load(fs.readFileSync('.github/workflows/portao.yml','utf8'));
assert(scripts.verify.split(' && ').includes('npm run check:frases-afirmacao'));
conferirPartes(scripts,dividir(scripts,{}).partes);
assert(w.jobs.conferir.steps.some(s=>s.with?.['fetch-depth']===0));
assert(scripts['ledger:check'].includes('node scripts/corpos-ledger.mjs'));
const aterrar=fs.readFileSync('scripts/leituras/aterrar.py','utf8');
assert(aterrar.includes("self.correr('ledger-corpos', ['npm', 'run', 'ledger:check'])"));
assert(aterrar.includes("self.correr('frases-afirmacao', ['npm', 'run', 'check:frases-afirmacao'])"));
assert(fs.readFileSync('scripts/leituras/comitar.sh','utf8').includes('node scripts/check-frases-afirmacao.mjs --so-lista || exit 1'));
const rotas=rotasDaProsa();for(const r of ['/o-que-se-discute','/en/under-discussion','/correcoes','/habitacao','/dossies/orcamento-2027'])assert(rotas.some(p=>p.rota===r),r);
assert(!rotas.some(p=>p.tipo==='linha'));
console.log(`frases-afirmacao: ${casos.length} plantas reais; ${plantas} estragos recusados; semente, vizinhança, histórico e cadeia conferidos`);
