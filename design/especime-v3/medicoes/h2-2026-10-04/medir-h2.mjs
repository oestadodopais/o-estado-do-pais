/** Medições finais H2. Cada número leva o comando de reprodução e um controlo conhecido.
 * Não altera dist/. Lê os códigos só dos ficheiros que portoes.sh escreveu. */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {WORKS} from '../../../../src/data/studies.mjs';
import {AREAS} from '../../../../src/data/areas.mjs';
import {routePath} from '../../../../src/lib/routes.mjs';
const pasta='design/especime-v3/medicoes/h2-2026-10-04';
const le=f=>JSON.parse(fs.readFileSync(path.join(pasta,f),'utf8'));
const txt=f=>fs.readFileSync(path.join(pasta,f),'utf8').trim();
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const sha=x=>createHash('sha256').update(x).digest('hex');
const base='ce325a3cd772b4317436345cec720cd739c2279d';
const cabeca=txt('portoes/cabeca');
const historicoB=le('medidas-h2b.json');
const cabecaB=historicoB.cabeca_codigo;
if(txt('portoes-h2b/cabeca')!==cabecaB||txt('portoes-h2b/cabeca.fim')!==cabecaB)throw Error('Arquivo dos portões H2-b de outra cabeça.');
for(const g of ['build','verify','typecheck']){
 if(Number(txt(`portoes-h2b/${g}.codigo`))!==historicoB.portoes[g].codigo||sha(fs.readFileSync(`${pasta}/portoes-h2b/${g}.log`))!==historicoB.portoes[g].log_sha256)throw Error('O arquivo dos portões H2-b mudou.');
}
const baseC='4d85508f736774e1fdca1ae4093eafe5e2b591d3';
// O commit de entrega acrescenta só provas. Reproduzir a medida depois dele
// continua a ler a cabeça do código que efetivamente passou nos portões.
const delta=git('diff','--name-only',cabeca,'HEAD');
if(delta&&delta.split('\n').some(f=>!f.startsWith(pasta+'/')&&!f.startsWith('design/especime-v3/capturas/h2-2026-10-04/')))throw Error('Há código posterior à cabeça conferida.');
const versao=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
if(versao.commit!==cabeca)throw Error('Dist não é desta cabeça.');
const comando='node design/especime-v3/medicoes/h2-2026-10-04/medir-h2.mjs';
const medidas=[];
function medida(nome,valor,origem,oQue,encontrado){
 if(!encontrado)throw Error(`O conhecido-positivo falhou: ${nome}`);
 medidas.push({nome,valor,comando:`${comando} · ${origem}`,conhecido_positivo:{o_que:oQue,encontrado}});
}
const antes=le('brief-reproduzido.json');
const referencia=JSON.parse(fs.readFileSync('design/observatorio/medidas/BRIEF-H2.json','utf8'));
medida('medicoes_do_brief_reproduzidas',antes.medidas.length,'comparação integral do JSON do §0','todos os valores, comandos e controlos são iguais ao ficheiro de referência',JSON.stringify(antes)===JSON.stringify(referencia)&&antes.medidas.every(m=>m.conhecido_positivo.encontrado));
const anda=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?anda(path.join(dir,e.name)):[path.join(dir,e.name)]);
const paginas=anda('dist').filter(f=>f.endsWith('.html'));
let aninhadas=0,areas=0,antigas=0;
const regexAntiga=/\/(?:texto|text)(?:[/?#]|$)/;
for(const f of paginas){
 const r=parse(fs.readFileSync(f,'utf8'));
 aninhadas+=r.querySelectorAll('a a').length;
 if(/^dist\/(?:en\/)?areas\//.test(f)){
  areas++;
  antigas+=r.querySelectorAll('a[href]').filter(a=>regexAntiga.test(a.getAttribute('href'))).length;
 }
}
medida('paginas_html',paginas.length,'varrimento de todos os HTML em dist/','as duas primeiras páginas e o erro existem',['dist/index.html','dist/en/index.html','dist/404.html'].every(f=>paginas.includes(f)));
medida('ligacoes_dentro_de_outras',aninhadas,'querySelectorAll("a a") em cada HTML','o mesmo seletor conta a ligação plantada num excerto em memória',parse('<a href="/a">a<a href="/b">b</a></a>').querySelectorAll('a a').length===1);
const paginasDasAreas=AREAS.flatMap(a=>['pt','en'].map(lang=>path.join('dist',routePath('area',lang,{slug:a.slug}),'index.html'))).filter(f=>fs.existsSync(f));
const contagemAreas=Number(txt('areas-trabalho.log').match(/(\d+) página\(s\) de área construída\(s\)/)?.[1]);
medida('paginas_de_area',contagemAreas,'check:areas, áreas declaradas nas duas edições','a contagem da régua coincide com as rotas das áreas, excluindo os índices',contagemAreas>0&&contagemAreas===paginasDasAreas.length);
medida('ficheiros_html_sob_pastas_das_areas',areas,'varrimento de dist/areas e dist/en/areas, incluindo índices','os índices existem e não pertencem à lista das páginas de área',paginas.includes('dist/areas/index.html')&&paginas.includes('dist/en/areas/index.html')&&!paginasDasAreas.includes('dist/areas/index.html'));
medida('portas_antigas_nas_areas',antigas,'href de cada página de área','o padrão vê /estudos/ensaio/texto e /en/studies/ensaio/text',regexAntiga.test('/estudos/ensaio/texto')&&regexAntiga.test('/en/studies/ensaio/text'));
const primeiras={};
for(const lang of ['pt','en']){
 const r=parse(fs.readFileSync(`dist/${lang==='pt'?'':'en/'}index.html`,'utf8'));
 primeiras[lang]=r.querySelectorAll('#trabalhos [data-estudo]').map(e=>({slug:e.getAttribute('data-estudo'),marca:e.querySelector('[data-estudo-em-curso]')?.textContent??null}));
 medida(`estudos_recentes_${lang}`,primeiras[lang].length,'artigos de #trabalhos','o estudo declarado em curso está à cabeça',primeiras[lang][0].slug===WORKS.find(w=>w.emCurso).slug);
 const ano=WORKS.find(w=>w.slug===primeiras[lang][0].slug).emCurso.ate.slice(0,4);
 medida(`marcas_em_curso_${lang}`,primeiras[lang].filter(e=>e.marca).length,'marcas em #trabalhos','a palavra e o horizonte à cabeça são os da edição e da ficha',primeiras[lang][0].marca===`${lang==='pt'?'em curso até':'ongoing until'} ${ano}`);
}
const soFicheiros=paginas.filter(f=>!f.endsWith('/index.html')&&!fs.existsSync(f.slice(0,-5)+'/index.html')).map(f=>({ficheiro:f.slice(5),motivo:f==='dist/404.html'?'Página de erro padrão do Astro, servida pela Vercel como ficheiro de erro.':'[verify]: motivo por confirmar'}));
medida('paginas_so_com_ficheiro_html',soFicheiros.length,'ficheiros .html sem pasta gémea','a página padrão 404.html está na lista',soFicheiros.some(f=>f.ficheiro==='404.html'));
const plantas=le('plantas-portoes-h2.json');
medida('plantas_sobre_dist',plantas.length,'registos de tests/pais/portoes.mjs','todas saem a um, dão a mordida pedida e repõem cada sha256',plantas.every(p=>p.codigo===1&&p.passou&&p.ficheiros.every(f=>f.antes===f.reposto)));
const pacote=le('pacote-casos-h2c.json');
medida('controlos_do_pacote',pacote.casos.length,'tests/leituras/pacote.py, corrida H2-c','o controlo de montagem e as plantas dos dois lados passaram',pacote.ok&&pacote.casos.every(c=>c.passou));
const repeticoes=le('i194-repeticoes.json');
medida('corridas_locais_i194',repeticoes.corridas.length,'repetir-i194.mjs','a troca tem bytes e hora iguais, outro inode e a mordida da D em cada corrida',repeticoes.corridas.every(c=>c.ok&&c.troca.mordeu&&c.troca.antes.escrito===c.troca.depois.escrito&&c.troca.antes.resumo===c.troca.depois.resumo&&c.troca.antes.inode!==c.troca.depois.inode));
medida('plantas_por_corrida_i194',repeticoes.corridas[0].plantas,'repetir-i194.mjs','todas as corridas têm o mesmo conjunto de plantas',repeticoes.corridas.every(c=>c.plantas===repeticoes.corridas[0].plantas));
const funcaoD=s=>s.slice(s.indexOf('export function celulaDoDist('),s.indexOf('/** C · A CONSTRUÇÃO'));
const dAntes=funcaoD(git('show',`${base}:scripts/verify-depois-do-build.mjs`));
const dDepois=funcaoD(fs.readFileSync('scripts/verify-depois-do-build.mjs','utf8'));
medida('celula_d_alterada',Number(dAntes!==dDepois),'comparação literal de celulaDoDist com a base','a função existe nas duas versões e os seus bytes são iguais',dAntes.startsWith('export function celulaDoDist(')&&dAntes===dDepois);
const protegido=git('diff','--name-only',base,'HEAD','--','ledger','registos','studies-src');
medida('ficheiros_de_conteudo_alterados',protegido?protegido.split('\n').length:0,'git diff da base à cabeça em ledger, registos e studies-src','o Git leu uma linha de livro da base',git('show',`${base}:ledger/claims/divida-publica-2025.yml`).includes('value:'));
const issues=fs.readFileSync('design/especime-v3/ISSUES.md','utf8').split('\n').filter(l=>/^\| I19[0-4] \|/.test(l));
medida('questoes_fechadas',issues.filter(l=>l.includes('fechada a 04.10.2026')).length,'linhas I190 a I194 do ISSUES.md','as cinco questões existem e têm commit no fecho',issues.length===5&&issues.every(l=>/`[a-f0-9]{8}`/.test(l)));
const mapa=txt('mapa.log').split('\n').map(l=>Number(l.match(/: (\d+)$/)?.[1]));
medida('citacoes_mapa_conferidas',mapa[0],'mapa.log, conferir-mapa.py','o conferidor leu citações reais e saiu a zero',mapa.length===4&&mapa[0]>0&&txt('mapa.codigo')==='0');
medida('citacoes_mapa_com_desvio',mapa.slice(1).reduce((a,b)=>a+b,0),'mapa.log, conferir-mapa.py','há citações conferidas, portanto o varrimento não foi vazio',mapa[0]>0&&mapa.every(Number.isFinite));
const portoes={};
for(const g of ['build','verify','typecheck']){
 const codigo=Number(txt(`portoes/${g}.codigo`));
 const inicio=txt(`portoes/${g}.inicio`),fim=txt(`portoes/${g}.fim`);
 const segundos=(Date.parse(fim)-Date.parse(inicio))/1000;
 portoes[g]={codigo,inicio,fim,segundos,log_sha256:sha(fs.readFileSync(`${pasta}/portoes/${g}.log`))};
 medida(`codigo_${g}`,codigo,`leitura de portoes/${g}.codigo`,'o ficheiro só tem o código e as cabeças inicial e final são as do código',/^\d+$/.test(txt(`portoes/${g}.codigo`))&&txt('portoes/cabeca')===cabeca&&txt('portoes/cabeca.fim')===cabeca);
 medida(`segundos_${g}`,segundos,`datas de portoes/${g}.inicio e .fim`,'as duas datas são válidas e ordenadas',Number.isFinite(segundos)&&segundos>=0);
}
const capturas=le('capturas.json');
medida('capturas_pagina_inteira',capturas.resultados.filter(c=>!c.tipo).length,'capturas.json e ficheiros PNG','capturas H2-b: cada largura existe nas duas edições, sem problemas, com sha256 refeito',capturas.problemas.length===0&&capturas.cabeca===cabecaB&&capturas.larguras.every(w=>['pt','en'].every(l=>capturas.resultados.some(c=>c.lang===l&&c.largura===w&&!c.tipo)))&&capturas.resultados.every(c=>sha(fs.readFileSync(c.ficheiro))===c.sha256));
medida('capturas_recorte',capturas.resultados.filter(c=>c.tipo==='recorte').length,'capturas.json','os recortes existem nas mesmas edições e larguras',capturas.resultados.filter(c=>c.tipo==='recorte').length===capturas.resultados.filter(c=>!c.tipo).length);
const remoto=le('github-ensaio.json');
const i194Remota=le('github-i194.json');
medida('corrida_github',remoto.databaseId,'gh run view do ensaio H2, conservado','a corrida histórica é da cabeça da prova I194 e acabou verde',remoto.headSha===i194Remota.cabeca&&remoto.status==='completed'&&remoto.conclusion==='success');
medida('plantas_i194_medidas_no_runner',i194Remota.casos.length,'github-h2.py, registo histórico do GitHub','a premissa e a mordida foram lidas no ubuntu-24.04',i194Remota.conhecido_positivo.encontrado&&i194Remota.casos.every(c=>c.mordeu)&&sha(fs.readFileSync(`${pasta}/github-ensaio.log`))===i194Remota.log_sha256);
const limpezaRemota=le('github-ramo-apagado.json');
medida('ramos_de_ensaio_remotos_restantes',limpezaRemota.referencias.length,'git ls-remote --heads origin do ramo de ensaio','a remoção saiu a zero e a consulta ao remoto também',limpezaRemota.apagar_codigo===0&&limpezaRemota.consulta_codigo===0);
const custo=le('custo.json');
medida('segundos_ate_fecho',custo.segundos_ate_fecho,'custo-h2.py, relógios da sessão','o modelo e o contador foram lidos na mesma sessão',custo.conhecido_positivo.encontrado);
medida('simbolos_parciais',custo.total_cumulativo_parcial.total_tokens,'custo-h2.py, token_count do próprio rollout','o contador contém entradas e saídas e o total é a sua soma',custo.total_cumulativo_parcial.input_tokens+custo.total_cumulativo_parcial.output_tokens===custo.total_cumulativo_parcial.total_tokens);
// Transcrição externa: confrontar dois campos transcritos não é conhecido-positivo.
medidas.push({nome:'tokens_used_h2',valor:custo.tokens_used,natureza:'transcrição da linha do lançador pelo lugar de direção',proveniencia:custo.proveniencia_final,conhecido_positivo:null});
const custoB=le('custo-h2b.json');
medida('segundos_h2b_parciais',custoB.segundos_ate_fecho,'custo-h2b.py','o evento inicial e os contadores da passagem foram encontrados',custoB.conhecido_positivo.encontrado);
medida('simbolos_h2b_parciais',custoB.total_cumulativo_parcial.total_tokens,'custo-h2b.py','a diferença dos contadores é a soma das entradas e saídas',custoB.total_cumulativo_parcial.input_tokens+custoB.total_cumulativo_parcial.output_tokens===custoB.total_cumulativo_parcial.total_tokens);
const registosTrabalho=['pais-trabalho','html-trabalho','lugar-trabalho','mapa','areas-trabalho','voz-trabalho','em-curso-trabalho','pacote-planta'].map(f=>({ficheiro:f,...le(`${f}.json`)}));
medida('registos_de_trabalho_limpos',registosTrabalho.length,'correr.py, cabeça e git status --porcelain --untracked-files=no antes do comando','os registos históricos H2-b são da sua cabeça, sem diferenças seguidas antes ou depois',registosTrabalho.every(r=>r.cabeca===cabecaB&&r.estado===''&&r.estado_fim===''&&r.codigo===0));
medida('plantas_h2_na_cabeca_limpa',plantas.length,'tests/pais/portoes.mjs --prefixo h2-','cada planta escreve a mesma cabeça e um estado seguido vazio',plantas.length===8&&plantas.every(p=>p.cabeca===cabecaB&&p.estado===''));
const novas=le('plantas-portoes-h2b.json');
medida('plantas_h2b_sobre_dist',novas.length,'tests/pais/portoes.mjs --prefixo h2b-','o ano trocado foi recusado e os bytes repostos, na cabeça limpa',novas.length===1&&novas[0].nome==='h2b-horizonte-trocado'&&novas.every(p=>p.codigo===1&&p.passou&&p.cabeca===cabecaB&&p.estado===''&&p.ficheiros.every(f=>f.antes===f.reposto)));
const controlos=Number(txt('em-curso-trabalho.log').match(/H2-b: (\d+) controlos/)?.[1]);
medida('controlos_prazo_e_composicao',controlos,'tests/inicio/estudos-em-curso.mjs','o comando passou e contou controlos incluindo o prazo passado',controlos>0&&le('em-curso-trabalho.json').codigo===0);

const trabalhoC=['pacote-h2c','e1-trabalho-h2c','mapa-h2c'].map(f=>({ficheiro:f,...le(`${f}.json`)}));
medida('registos_h2c_limpos',trabalhoC.length,'correr.py, três registos H2-c','os comandos passaram na cabeça H2-c com estado seguido vazio antes e depois',trabalhoC.length===3&&trabalhoC.every(r=>r.cabeca===cabeca&&r.estado===''&&r.estado_fim===''&&r.codigo===0));
const pacoteC=le('pacote-casos-h2c.json');
medida('controlos_pacote_h2c',pacoteC.casos.length,'tests/leituras/pacote.py','todos passaram; as recusas das árvores e do relatório têm mensagens diferentes',pacoteC.ok&&pacoteC.casos.every(c=>c.passou)&&pacoteC.casos.filter(c=>c.queixa).length===3&&pacoteC.casos.some(c=>c.queixa?.startsWith('conferir-relatorio.py: não existe o relatório')));
const e1=le('e1-h2c.json');
medida('corridas_check_pais_h2c',e1.casos.length,'tests/inicio/prazo-pela-celula.mjs','controlo limpo e cópias sem a chamada passam; prazo e razão falham pelas mensagens E1',e1.casos.length===5&&e1.casos.map(c=>c.codigo).join(',')==='0,1,1,0,0'&&e1.casos[1].queixas_e1.some(q=>q.startsWith('E1: prazo emCurso passado'))&&e1.casos[2].queixas_e1.some(q=>q.startsWith('E1: declaração emCurso incompleta'))&&e1.conhecido_positivo.encontrado);
medida('plantas_e1_h2c',e1.casos.filter(c=>c.codigo===1).length,'e1-h2c.json','ambas as plantas têm a mensagem E1 e os controlos sem a chamada não a têm',e1.casos.filter(c=>c.codigo===1).every(c=>c.queixas_e1.length===1)&&e1.casos.filter(c=>c.codigo===0).every(c=>c.queixas_e1.length===0));
const linhas=fs.readFileSync('scripts/gate-html.mjs','utf8').split('\n');
const mapaTexto=fs.readFileSync('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md','utf8');
const citacoes=[{ancora:'a unidade da casa no mapa da dívida em «Lugares» (passagem P4-d',errada:6346},{ancora:'A CAIXA DAS SUGESTÕES, DEPOIS DO VARRIMENTO (bloco S1, 02.10.2026)',errada:7938}].map(c=>({...c,linha:linhas.findIndex(l=>l.includes(c.ancora))+1}));
for(const [i,c] of citacoes.entries()) medida(`linha_corrigida_h2c_${i+1}`,c.linha,'leitura literal das duas âncoras, sem conferir-mapa.py','a âncora está na linha medida e não na antiga; o mapa cita a linha medida',c.linha>0&&linhas[c.linha-1].includes(c.ancora)&&!linhas[c.errada-1].includes(c.ancora)&&mapaTexto.includes(`scripts/gate-html.mjs:${c.linha}`));
const mapaC=txt('mapa-h2c.log').split('\n').map(l=>Number(l.match(/: (\d+)$/)?.[1]));
medida('citacoes_mapa_h2c',mapaC[0],'mapa-h2c.log','o guião leu citações, mas não se infere exatidão dos números de linha',mapaC.length===4&&mapaC.every(Number.isFinite)&&mapaC[0]>0&&txt('mapa-h2c.codigo')==='0');
medida('desvios_reportados_mapa_h2c',mapaC.slice(1).reduce((a,b)=>a+b,0),'mapa-h2c.log','contagem do guião numa leitura não vazia, com o limite documentado na I195',mapaC[0]>0);
const custoC=le('custo-h2c.json');
medida('segundos_h2c_parciais',custoC.segundos_ate_fecho,'custo-h2c.py','o mandato H2-c e o contador da mesma sessão foram encontrados',custoC.conhecido_positivo.encontrado);
medida('simbolos_h2c_parciais',custoC.total_cumulativo_parcial.total_tokens,'custo-h2c.py','a diferença dos contadores é a soma das entradas e saídas',custoC.total_cumulativo_parcial.input_tokens+custoC.total_cumulativo_parcial.output_tokens===custoC.total_cumulativo_parcial.total_tokens);
const ui=git('diff','--name-only',baseC,cabeca,'--','src','public');
medida('ficheiros_da_pagina_alterados_h2c',ui?ui.split('\n').length:0,'git diff em src e public desde a cabeça H2-b','o ficheiro da marca existe na base; o H2-c só altera provas e registos',git('show',`${baseC}:src/components/inicio/EstudoDaLista.astro`).includes('emCurso'));

const saida={base,base_h2c:baseC,cabeca_h2b:cabecaB,portoes_h2b:historicoB.portoes,custo_h2c:custoC,trabalho_h2c:trabalhoC,e1_h2c:e1,pacote_h2c:pacoteC,citacoes_h2c:citacoes,commits_h2c:git('log','--reverse','--format=%H %s',`${baseC}..${cabeca}`).split('\n'),base_h2b:'acc928f23f5954d1cfc51a11fa86e94d4f6da56e',cabeca_codigo:cabeca,modelo:custo.modelo,medidas,primeiras,paginas_de_area:paginasDasAreas,paginas_so_ficheiro:soFicheiros,plantas,plantas_h2b:novas,registos_trabalho:registosTrabalho,portoes,capturas:{larguras:capturas.larguras,total:capturas.resultados.length},github:remoto,i194_remota:i194Remota,custo,custo_h2b:custoB,commits:git('log','--reverse','--fixed-strings','--grep=Co-Authored-By: Codex gpt-6-astra','--format=%H %s',`${base}..${cabeca}`).split('\n'),commits_h2b:git('log','--reverse','--format=%H %s',`acc928f2..${cabecaB}`).split('\n')};
fs.writeFileSync(`${pasta}/medidas.json`,JSON.stringify(saida,null,2)+'\n');
console.log(`${medidas.filter(m=>m.conhecido_positivo?.encontrado).length} medidas com conhecido-positivo; uma transcrição externa sem conhecido-positivo próprio.`);
