/** FP2: recolhe provas já produzidas; nunca altera a construção. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {plantasDoInicio, conferirInicio} from '../../../../tests/discussao/itens.mjs';
const [baseDir, depoisDir, capturasDir, custoFile] = process.argv.slice(2);
if(!baseDir||!depoisDir||!capturasDir||!custoFile)throw Error('Uso: medir-fp2.mjs <base> <conferências> <capturas> <custo.json>');
const pasta=path.dirname(new URL(import.meta.url).pathname);
const ler=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const guardar=(f,r)=>fs.writeFileSync(path.join(pasta,f),JSON.stringify(r,null,2)+'\n');
const base=ler(path.join(baseDir,'base.json')),depois=ler(path.join(depoisDir,'sobreposicao.json'));
const contadoresDir=path.join(path.dirname(depoisDir),'fp2-contadores');
const contadores=ler(path.join(contadoresDir,'sobreposicao-contadores.json')),planta=ler(path.join(depoisDir,'sobreposicao-planta.json'));
assert.equal(base.total,15);assert.equal(base.erros,0);assert.equal(depois.total,0);assert.equal(depois.erros,0);
assert.equal(contadores.total,0);assert.equal(contadores.erros,0);assert(planta.conhecidoPositivo);assert.equal(planta.erros,0);
assert.deepEqual(depois.ligacoes,base.ligacoes);
for(const [nome,r] of Object.entries({'base.json':base,'sobreposicao.json':depois,'sobreposicao-contadores.json':contadores,'sobreposicao-planta.json':planta}))guardar(nome,r);
const codigoCapturas=Number(fs.readFileSync(path.join(path.dirname(capturasDir),'fp2-capturas-pedido.codigo'),'utf8'));assert.equal(codigoCapturas,0);fs.writeFileSync(path.join(pasta,'capturas.codigo'),codigoCapturas+'\n');
const capturas=ler(path.join(capturasDir,'capturas.json'));assert(capturas.ok);assert.equal(capturas.resultados.length,40);guardar('capturas.json',capturas);
fs.writeFileSync(path.join(pasta,'sobreposicao-base.codigo'),fs.readFileSync(path.join(baseDir,'check:sobreposicao.codigo')));
const codigos={};
for(const f of fs.readdirSync(depoisDir).filter(f=>f.endsWith('.codigo'))){const valor=Number(fs.readFileSync(path.join(f==='check:sobreposicao-contadores.codigo'?contadoresDir:depoisDir,f),'utf8'));codigos[f.slice(0,-7)]=valor;fs.writeFileSync(path.join(pasta,f),valor+'\n');}
for(const [nome,codigo] of Object.entries(codigos))assert.equal(codigo,nome==='check:sobreposicao-planta'?1:0,nome);
const frases=[],plantas=[];
for(const lang of ['pt','en']) {
 const root=parse(fs.readFileSync(`dist/${lang==='pt'?'':'en/'}index.html`,'utf8'));
 assert.deepEqual(conferirInicio(root,lang),[]);
 plantas.push(...plantasDoInicio(root,lang,'dist'));
 for(const a of root.querySelectorAll('[data-discussao-inicio] [data-discussao-porta]')){
  const p=a.parentNode.querySelector('p[data-discussao-resumo]');
  frases.push({lang,item:a.getAttribute('data-discussao-porta'),data:p.querySelector('time').text,frase:p.querySelector('[data-discussao-conclusao]').text.replace(/\s+/g,' ').trim()});
 }
}
assert(plantas.every(p=>p.mordeu));guardar('plantas-inicio.json',plantas);guardar('frases-construidas.json',frases);
const historico={};
for(const nome of ['build-base','perfis','perfis-2','perfis-3','typecheck-inicial','typecheck-2','voz-retoma','voz-corrigida']) {
 const ficheiro=path.join(path.dirname(baseDir),`fp2-${nome}.codigo`);
 historico[nome]=Number(fs.readFileSync(ficheiro,'utf8'));
 fs.writeFileSync(path.join(pasta,`${nome}.codigo`),historico[nome]+'\n');
}
const primeiraTentativa=path.join(path.dirname(baseDir),'fp2-conferencias');
historico['construcao-interrompida']=Object.fromEntries(fs.readdirSync(primeiraTentativa).filter(f=>f.endsWith('.codigo')).map(f=>[f.slice(0,-7),Number(fs.readFileSync(path.join(primeiraTentativa,f),'utf8'))]));
historico['selecao-contadores-inicial']={codigo:Number(fs.readFileSync(path.join(depoisDir,'check:sobreposicao-contadores.codigo'),'utf8')),motivo:'rg: command not found',retoma:codigos['check:sobreposicao-contadores']};
guardar('historico-conferencias.json',historico);
const execucoesPrincipais=Object.keys(codigos).length+Object.keys(historico).length-1+1+Object.values(historico['construcao-interrompida']).filter(c=>c!==125).length;
const custo=ler(custoFile);custo.corridas_principais=execucoesPrincipais;
custo.descricao+=` Foram ${execucoesPrincipais} execuções principais de conferências com código em ficheiro, incluindo a base, as tentativas recusadas, as três provas dos perfis e as conferências finais; não conta cada subcomando interno do build nem os autotestes pontuais de sintaxe, corte e guardas. Os códigos 125 são passos não executados. As seleções do escrivão foram uma de base, duas de conferências afetadas, a primeira interrompida no build, e uma retoma só da seleção de contadores; corridas completas de verify: zero.`;
guardar('custo.json',custo);
const medidas=[
 {nome:'sobreposições na base',valor:base.total,comando:'npm run check:sobreposicao',conhecido_positivo:'15 cruzamentos nas três rotas de habitação e Orçamento'},
 {nome:'sobreposições depois',valor:depois.total,comando:'npm run check:sobreposicao',conhecido_positivo:'base real e planta da folha anterior'},
 {nome:'duração da régua inteira, segundos',valor:depois.duracaoSegundos,comando:'npm run check:sobreposicao',conhecido_positivo:planta.conhecidoPositivo},
 {nome:'rotas da régua inteira',valor:depois.rotas.length,comando:'npm run check:sobreposicao',conhecido_positivo:base.total},
 {nome:'combinações da régua inteira',valor:depois.paginas.length,comando:'npm run check:sobreposicao',conhecido_positivo:base.total},
 {nome:'sobreposições em todas as páginas texto-artigo',valor:contadores.total,comando:'npm run check:sobreposicao -- --rotas <rotas obtidas por find e grep>',conhecido_positivo:planta.total},
 {nome:'rotas com texto-artigo',valor:contadores.rotas.length,comando:`rg -l 'class="texto-artigo' dist/estudos dist/en/studies --glob index.html`,conhecido_positivo:planta.total},
 {nome:'planta da sobreposição',valor:planta.total,comando:'npm run check:sobreposicao -- --planta --rotas /estudos/a-casa-em-portugal-e-na-europa,/en/studies/a-casa-em-portugal-e-na-europa',conhecido_positivo:planta.conhecidoPositivo},
 {nome:'ligações nas primeiras páginas',valor:depois.ligacoes,comando:'node design/especime-v3/medicoes/fp2-2026-10-27/medir-fp2.mjs <base> <conferências> <capturas> <custo.json>',conhecido_positivo:base.ligacoes},
 {nome:'plantas da conclusão',valor:plantas,comando:'npm run check:discussao',conhecido_positivo:plantas.every(p=>p.mordeu)},
 {nome:'códigos das conferências',valor:codigos,comando:'sh scripts/leituras/portoes-pelo-escrivao.sh <saída nova> fp2',conhecido_positivo:codigos['check:sobreposicao-planta']},
 {nome:'capturas',valor:capturas.resultados.length,comando:'sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <saída nova>',conhecido_positivo:capturas.ok},
];
guardar('medidas.json',medidas);
const tabela=Object.entries(codigos).map(([k,v])=>`| ${k} | ${v} |`).join('\n');
const listaFrases=frases.map(f=>`- **${f.item}, ${f.lang}, ${f.data}:** ${f.frase}`).join('\n');
const provas=plantas.map(p=>`- ${p.lang}: ${p.nome}, ${p.mordeu?'mordeu':'não mordeu'}.`).join('\n');
const texto=`# FP2: conclusões na primeira página e espaço para o contador

Cada título de «O que se discute» passou a ter a data de publicação e a primeira frase da sua conclusão, nas duas edições.
O contador de cada secção passou a ter espaço reservado dentro do título e deixou de ocupar o texto anterior.

A data vem de publicado, a frase vem do primeiro parágrafo resolvido de conclusao e o corte conserva os objetos dos valores. A omissão de primeirasFrases continua a ser duas frases. A caixa das novidades, os estudos recentes, os títulos, a ordem e as ${depois.ligacoes['index.html']} ligações de cada primeira página mantiveram-se. Nenhuma data ou frase foi transcrita à mão para a vista.

## Frases copiadas da construção

${listaFrases}

## Prova de geometria

A construção limpa de base saiu com código 0. O detetor deu código 1: ${base.total} cruzamentos, ${base.erros} erros, nas três rotas esperadas, em ${base.duracaoSegundos.toFixed(2)} segundos. base.json inclui os achados e as contagens de ligações.

Depois: ${depois.total} cruzamentos e ${depois.erros} erros em ${depois.rotas.length} rotas e cinco larguras, ${depois.paginas.length} combinações no total. A régua inteira demorou ${depois.duracaoSegundos.toFixed(2)} segundos, abaixo do alvo de 180 segundos. A planta voltou a dar código 1 e ${planta.total} cruzamentos na habitação PT e EN. O código 2 significaria que a planta não mordeu ou que houve erro de carregamento.

A opção escolhida foi o padding-top de 16,2 px no h2 e top: 0 no contador: os 12 px da letra e o intervalo anterior de 1,35 em ficam reservados na caixa. A letra e a cor não mudaram. A regra é global a texto-artigo; a fonte das duas classes é src/views/EstudoView.astro. O inventário por rg encontrou ${contadores.rotas.length} páginas construídas e todas passaram nas cinco larguras, ${contadores.paginas.length} combinações. A primeira seleção pelo escrivão saiu com código 2 porque esse ambiente não tem rg (mensagem: rg: command not found). A seleção passou a usar find e grep e repetiu-se só essa medição, pelo perfil fp2-contadores. As rotas e os resultados estão em sobreposicao-contadores.json; o código recusado também fica no histórico.

A régua lê caixas de linha do Range e estima a caixa dos pseudo-elementos pela fonte e posição calculadas. O limiar é de 3 px em cada eixo. Não é uma prova de todas as páginas ou de todos os estados interativos. O conhecido-positivo foi medido antes da correção. Na varredura original, «90 páginas por largura» deve ler-se «90 combinações no total».

## Conferências

| Conferência | Código lido do ficheiro |
| --- | ---: |
${tabela}

As corridas usaram os perfis fechados fp2-base e fp2 acrescentados ao escrivão. O primeiro mede o dist já construído; o segundo corre apenas as conferências afetadas. Não se correu o verify completo. A régua nova entra no verify imediatamente depois de check:moldura e não entra no build.

A primeira construção corrigida parou no inventário genérico da voz, com os seis parágrafos por classificar; os portões de HTML e de dados tinham passado. conferirInicio já aceitava as frases nas duas edições. O inventário em medir-defeitos passou a consultar essa validação antes de dispensar os resumos. A conferência isolada check:voz passou antes da construção final. A primeira tentativa isolada ainda usou o código anterior porque a edição foi interrompida por uma asserção do guião; esse insucesso fica no histórico. Não se alteraram as palavras.

O primeiro typecheck detetou uma inferência demasiado estreita no uso genérico de primeirasFrases. A anotação do tipo da entrada existente foi preservada e o typecheck seguinte passou. Os testes dos perfis, corridos três vezes durante a implementação, também provaram a lista exata de comandos e a recusa de uma planta sem mordida.

Os portões de datas, valores e fragmentos passaram a admitir apenas este contexto comprovado: data declarada do item, primeira frase integral, valores com os mesmos IDs e textos, prefixo da conclusão construída e fontes no destino do título. Não há dispensa geral por marca de HTML. As plantas adicionais trocam a linha de um valor e o trecho de uma fonte; ambas são recusadas. A FC1 inclui o parágrafo e a frase novos, com plantas de flex e de largura.

## Plantas em memória

${provas}

## Capturas

${capturas.resultados.length} capturas de página e ${capturas.resultados.reduce((n,r)=>n+r.recortes.length,0)} recortes, nas cinco larguras e nas duas edições. As rotas inglesas de Évora e do Orçamento existem. O seletor da primeira página é section.pp-discussao; nos três estudos é article.texto-artigo.estudo-leitura, que contém o parágrafo de abertura e o primeiro h2 com o contador. Os PNG ficaram fora do repositório, em <temporario>/fp2-capturas. A inspeção visual amostrou os 16 recortes a 390 e 1280 px, nas duas edições: as datas e conclusões aparecem em texto corrido e os contadores da habitação e do Orçamento estão separados da abertura e da linha de fontes; Évora mantém o contador acima do título. O manifesto capturas.json prende os ficheiros, recursos e recortes à construção ${capturas.cabeca}.

## Custo e paragem

${custo.descricao}

O trabalho parou depois das conferências e capturas previstas. A corrida completa de conferir-tudo.sh e a leitura a frio ficam para o lugar de direção, como pedido. Não houve publicação nem push.
`;
fs.writeFileSync(path.join(pasta,'LEIA-ME.md'),texto);
console.log(JSON.stringify({frases:frases.length,plantas:plantas.length,ligacoes:depois.ligacoes,sobreposicoes:depois.total,capturas:capturas.resultados.length}));
