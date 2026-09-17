import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {createRequire} from 'node:module';
const {parse}=createRequire(path.resolve('package.json'))('node-html-parser');
const {WORKS}=await import(path.resolve('src/data/studies.mjs'));
const {todosOsRegistos,registoDaEdicao,manifestoDosRegistos}=await import(path.resolve('src/lib/registos.mjs'));
const {linhasDoDocumento}=await import(path.resolve('src/lib/registo-html.mjs'));
const {linhaDoSitioDoEstudo}=await import(path.resolve('src/lib/cruzamento.mjs'));
const {getClaim,verificacoesDaLinha}=await import(path.resolve('src/lib/ledger.mjs'));
const {nomeDaMedida}=await import(path.resolve('src/lib/nomes.mjs'));
const pasta='design/especime-v3/medicoes/b1-2026-09-17';const imgs='design/especime-v3/capturas/b1-2026-09-17';
const ler=n=>JSON.parse(fs.readFileSync(`${pasta}/${n}`,'utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();const sha=b=>createHash('sha256').update(b).digest('hex');
const head=git('rev-parse','HEAD');const base='2bf8b238b912fcb89da74096281305c75f0a3b3c';
const log=git('log',"--format=%h %s%n%(trailers)",`${base}..HEAD`);
const temasMaqueta=JSON.parse(execFileSync('python3',['-c',`import ast,json\nt=ast.parse(open('design/especime-v3/maquetas/b1/fazer.py').read())\nprint(json.dumps(next(ast.literal_eval(n.value) for n in t.body if isinstance(n,ast.Assign) and any(isinstance(x,ast.Name) and x.id=='TEMA_DO_ESTUDO' for x in n.targets))))`],{encoding:'utf8'}));
const tabelaTemas=Object.entries(temasMaqueta).map(([slug,tema])=>{const aplicado=WORKS.find(w=>w.slug===slug)?.tema;assert.equal(aplicado,tema);return `| ${slug} | ${tema} | ${aplicado} | sim |`;}).join('\n');
assert.equal(Object.keys(temasMaqueta).length,WORKS.length);
const capturas=ler('capturas-depois-peca1.json');assert.equal(capturas.cabeca,head);assert.equal(capturas.resultados.length,20);
for(const r of capturas.resultados){assert.equal(sha(fs.readFileSync(`${imgs}/${r.ficheiro}`)),r.sha256);assert.equal(r.deslocamento,0);assert(r.valores>0);for(const k of ['valoresPartidos','selosPartidos','separadoresQuebraveis','selosSemNowrap'])assert.equal(r[k],0);}
for(const r of ler('capturas-antes-peca1.json').resultados)assert.equal(sha(fs.readFileSync(`${imgs}/${r.ficheiro}`)),r.sha256);
const portoes=fs.readFileSync(`${pasta}/portoes-peca1.txt`,'utf8');assert(portoes.includes(head));assert.equal((portoes.match(/Código: 0/g)??[]).length,3);
const medicao=ler('l1-correcao.json');assert.equal(medicao.cabeca,head);const teto=JSON.parse(fs.readFileSync('scripts/lugar-tetos-b1.json','utf8')).l1_paginas;assert.equal(medicao.contagens.estudos,teto);
const navegacao=ler('navegacao-correcao-peca1.json');assert.equal(navegacao.cabeca,head);assert(navegacao.resultados.every(r=>r.deslocamento===undefined||r.deslocamento===0));
const plantas=ler('correcao-plantas-todos.json');assert.equal(plantas.cabeca,head);assert(plantas.resultados.length>0&&plantas.resultados.every(r=>r.passou&&r.antes===r.reposto));
for(const r of plantas.resultados)assert.equal(sha(fs.readFileSync(r.ficheiro)),r.reposto);
const reposicao=ler('reposicao-correcao-peca1.json');assert.equal(reposicao.cabeca,head);assert.equal(reposicao.codigo,0);
const linhas=[];let topo=0;let comLeitura=0;let semLeitura=0;let fontes=0;let recibos=0;
for(const lang of ['pt','en'])for(const w of WORKS){const base=lang==='pt'?'estudos':'en/studies';const doc=parse(fs.readFileSync(`dist/${base}/${w.slug}/index.html`,'utf8'));topo+=doc.querySelectorAll('[data-rotulo-ia="topo"]').length;if(doc.querySelector('[data-registo-edicao]')){const tem=!!doc.querySelector('.estudo-leitura');if(tem)comLeitura++;else semLeitura++;const n=doc.querySelectorAll('#linhas-do-documento .texto-linha').length;if(n)fontes++;recibos+=n;linhas.push(`| ${w.slug}/${lang} | ${tem?'sim':'não'} | ${n} |`);}}
let linhasDoSitio=0,recibosIncompletos=0;
for(const r of todosOsRegistos()) { const chave=`${r.slug}/${r.lang}`;const origem=manifestoDosRegistos().registos[chave];for(const linha of linhasDoDocumento(registoDaEdicao(r.slug,r.lang),chave,linhaDoSitioDoEstudo(origem.rh_study)).filter(l=>l.siteId)){linhasDoSitio++;const c=getClaim(linha.siteId);const n=nomeDaMedida(c,r.lang);if(!n||n.campo==='document.title'||!c.source||!verificacoesDaLinha(c).length)recibosIncompletos++;} }
assert.equal(linhasDoSitio-recibosIncompletos,recibos);
const markers=['pt','en'].map(lang=>{const base=lang==='pt'?'estudos':'en/studies';const doc=parse(fs.readFileSync(`dist/${base}/index.html`,'utf8'));return `${lang.toUpperCase()}: ${doc.querySelectorAll('.estudo-lingua').length}`;}).join('; ');
const linksCapturas=[390,768,1024,1280,1600].map(l=>`| ${l} | ${[['estudo','pt'],['estudo','en'],['estudos','pt'],['estudos','en']].map(([f,i])=>`[PNG](../../capturas/b1-2026-09-17/depois-${f}-${i}-${l}.png)`).join(' | ')} |`).join('\n');
const historico=fs.readFileSync('design/especime-v3/medicoes/e1-2026-09-16/l1-composicao-2026-09-16.txt','utf8');const anterior=Number(historico.match(/páginas com dois destinos iguais: (\d+)/)[1]);
const preservados=['registos','studies-src','ledger','src/data/studies.mjs','design/especime-v3/maquetas/b1','src/views/HomeView.astro','src/views/MunicipioView.astro','src/views/AreaView.astro'];
assert.equal(git('diff','3e80034a','HEAD','--name-only','--',...preservados),'');
assert.equal(git('diff','HEAD','--name-only','--','src','scripts','tests','vercel.json'),'');
assert.equal(JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,head);
const construidos=['dist/estudos/index.html','dist/en/studies/index.html','dist/estudos/evora-2027-prometido-painel-dinheiro/index.html','dist/en/studies/evora-2027-prometido-painel-dinheiro/index.html'];
fs.writeFileSync(`${pasta}/integridade-correcao-peca1.json`,JSON.stringify({base_correcao:'3e80034a',cabeca:head,caminhos_sem_alteracao:preservados,construidos:construidos.map(f=>({ficheiro:f,sha256:sha(fs.readFileSync(f))}))},null,2)+'\n');
const texto=`# B1, primeira peça: passagem de correção

Cabeça final conferida: \`${head}\`. Ramo: \`${git('branch','--show-current')}\`. Correções feitas nesta worktree, sem push. Os ficheiros das edições, os registos, as linhas do livro-razão e os temas dos estudos não mudaram nesta passagem. [Conferência de integridade e resumos das quatro páginas](integridade-correcao-peca1.json).

Esta é a verificação do construtor depois da [leitura a frio](leitura-a-frio-peca1.md), não uma nova leitura independente. A cabeça acima contém os commits das correções; os resultados finais, as capturas e este relatório são artefactos medidos nessa cabeça e ficam na worktree para recolha.

| Achado | Resultado da triagem e da correção |
|---|---|
| 1, 2, 3, 5, 8 | Plantas limitadas às cópias do pacote, conforme a triagem recebida. Nenhuma correção nas fontes por estes achados. |
| 4 | Efeito do pacote. A passagem atual mede a cabeça final que está escrita acima. |
| 6 | A marca compara a língua da edição com a página. A lista PT diz «(em inglês)» e a EN «(in Portuguese)» quando necessário. Marcas medidas: ${markers}. |
| 7 | Só há Fontes e verificação com valor, nome da medida, fonte e data de verificação do livro-razão. ${recibos} recibos em ${fontes} páginas. Sem linha no sítio, ou sem os quatro campos, não se inventa um recibo. Identificadores e marcadores técnicos saíram. L6 confere campos, ordem, porta e ausência da secção quando está vazia. |
| 9 | A exclusão de ligações transcritas fica limitada à rota estudo. A decomposição medida da L1 está abaixo. |
| 10 | ${topo} páginas de estudo têm um rótulo de IA no topo, pelo mesmo componente e texto do rodapé. A célula espera 1 nessa rota e conserva a razão da primeira exposição. A H14 mede a linha única no navegador, o corpo mínimo de 12 px e a posição antes do título. A porta mantém o alvo de 44 px. Nas larguras das capturas fica numa linha; abaixo de 390 px conserva a quebra natural para manter o corpo mínimo. |
| 11, 15, 16 | Dez redirecionamentos 301 em vercel.json. As rotas antigas não têm ficheiros em dist/. A célula confere origem, destino exato e existente, código e canónica única sem barra final, como no restante sítio. A planta troca um destino da tabela. H3 volta a exigir um título em cada HTML, sem exceção para redirecionamentos. A amostra de texto longo da acessibilidade abre agora o corpo na rota nova. A conferência das ligações segue as entradas 301 exatas para conferir o ficheiro e a âncora, mantendo válidas as portas antigas das páginas de área. |
| 12 | As contagens leem a página do lugar na língua da lista. Página ilegível ou secção em falta produz erro explícito. Plantas exercitam a edição inglesa, a página ausente e a secção ausente. |
| 13 | check:voz conta ${new Set(WORKS.map(w=>w.tema)).size} temas distintos, não ${WORKS.length} estudos. |
| 14 | Os três títulos aprovados definem a leitura pela ordem. A célula confere a pertença de todos os blocos e o começo do texto. ${comLeitura} registos com leitura e ${semLeitura} sem leitura, ditos expressamente pelo portão. |
| 17 | Só data-registo-unidade sai da leitura das palavras proibidas. A posição da secção e Subir são conferidos, com plantas próprias. |
| 18 | O git log com os trailers e a comparação integral com a tabela de fazer.py estão copiados abaixo. |
| 19, da direção | Os espaços dos milhares são inseparáveis e os selos, incluindo o marcador interior, levam white-space: nowrap. A C5 exige U+00A0 entre os algarismos na página; a C4 continua literal no registo. Uma planta volta a pôr um espaço quebrável. As vinte capturas medem zero valores partidos, zero selos partidos e zero deslocamento lateral. |

A retirada das entradas sem recibo elimina também as portas para essas entradas. Os números permanecem transcritos, com marca e linha do motor conferidas por L4 e C5. L6 e C6 continuam a recusar um selo em figura sem linha do sítio. A edição publicada continua acessível no fim. Os nomes das fontes são citações verificadas. Quando o selo declara um campo por confirmar, a definição existente aparece junto do primeiro marcador da página. Nas ${linhasDoSitio} ocorrências de linhas do sítio, ${recibosIncompletos} não têm todos os campos pedidos e ficam fora da secção. São contagens por edição, não de linhas distintas. Os nomes aprovados das figuras, das medidas de domínio e do projeto entram pela mesma ordem que no livro-razão, antes do rótulo da fonte. A L6 refaz a escolha a partir dessas declarações. Linhas sem nome de medida ou outro campo do recibo não recebem nomes inventados nem títulos de documento apresentados como nomes de medida.

| Registo | Leitura | Recibos apresentados |
|---|---|---|
${linhas.join('\n')}

## L1: o que saiu da contagem

A referência anterior ao B1 é a [medição guardada do E1](../e1-2026-09-16/l1-composicao-2026-09-16.txt). A [medição desta passagem](l1-correcao.json) conta o mesmo HTML com e sem a exclusão. O [medidor](medir-l1-correcao.mjs) guarda as páginas e os destinos repetidos, por família e modo. A comparação reúne as antigas páginas de texto e as novas páginas de estudo para medir a retirada efetiva das portas.

| Passo medido | Páginas que saem | Contagem restante |
|---|---|---|
| Referência antes do B1 | | ${anterior} |
| Portas duplicadas retiradas da apresentação, seis páginas de estudo e as duas listas | ${anterior-medicao.contagens.integral} | ${medicao.contagens.integral} |
| Ligações deixadas de contar dentro das unidades transcritas, só nas páginas de estudo | ${medicao.contagens.integral-medicao.contagens.estudos} | ver teto abaixo |

**Teto medido: ${teto}.** É o valor único em [lugar-tetos-b1.json](../../../../scripts/lugar-tetos-b1.json), lido por check-lugar.mjs e conferido pelo gerador deste relatório contra a medição. O modo antigo, global, e o modo limitado ao estudo dão a mesma contagem nesta construção; a planta numa página de outra família prova que a exclusão deixou de se aplicar ao sítio inteiro.

## Portões na cabeça final

\`\`\`text
${portoes.trim()}
\`\`\`

Cada comando correu separadamente. Registos completos: [build](build-peca1.log), [verify](verify-peca1.log), [typecheck](typecheck-peca1.log). As [${plantas.resultados.length} plantas desta passagem](correcao-plantas-todos.json) deram código diferente de zero com a falha esperada e repuseram os bytes originais. A [conferência depois da reposição](reposicao-correcao-peca1.json) também deu 0. As plantas antigas permanecem como provas históricas da construção anterior.

## Temas: comparação com a maqueta

Tabela TEMA_DO_ESTUDO copiada de [fazer.py](../../maquetas/b1/fazer.py), comparada entrada a entrada com WORKS. O gerador lê a atribuição Python com ast.literal_eval; não executa a maqueta nem toma «coincide» como prova.

| Estudo | fazer.py | studies.mjs | Igual |
|---|---|---|---|
${tabelaTemas}

## Commits e trailers

Saída de \`git log --format='%h %s%n%(trailers)' ${base}..HEAD\`:

\`\`\`text
${log}
\`\`\`

## Vinte capturas depois

[Resumos SHA-256, larguras e medidas](capturas-depois-peca1.json). As vinte capturas antes mantêm os resumos originais, conferidos novamente. As capturas de janela a 390 e 1280 também foram refeitas.

| Largura | Estudo PT | Estudo EN | Lista PT | Lista EN |
|---|---|---|---|---|
${linksCapturas}

[Navegação medida](navegacao-correcao-peca1.json): ${navegacao.resultados.length} verificações, incluindo as dez rotas antigas com e sem barra, a abertura do índice e uma secção com oito recibos. A mesma prova mede os valores e selos dos dez corpos a 390 px, com as fontes abertas, e exige zero quebras.

A configuração dos redirecionamentos segue a [documentação oficial do Vercel](https://vercel.com/docs/project-configuration/vercel-json#routes). A prova local confere a tabela e o resultado construído; não houve lançamento nem teste de produção nesta passagem.
`;
assert(!/[\u2013\u2014]/.test(texto),'Sem travessões na prosa.');
fs.writeFileSync(`${pasta}/LEIA-ME-peca1.md`,texto);fs.writeFileSync(`${pasta}/cabeca-verificacao-final.txt`,head+'\n');
console.log(`Relatório conferido e escrito para ${head}.`);
