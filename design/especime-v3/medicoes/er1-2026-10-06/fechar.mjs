/* Fecha a prova a partir dos ficheiros produzidos pelos guiões. Nenhum valor
   do exemplo, código de saída ou contagem do relatório é copiado à mão. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { allClaims } from '../../../../src/lib/ledger.mjs';
import { routePath, matchPath } from '../../../../src/lib/routes.mjs';
import { conferirCodigo, conferirCors, lerPaginaComCodigo } from '../../../../scripts/incorporar-do-portao.mjs';
import { limpar, escrever } from './medir.mjs';
const pasta = path.dirname(new URL(import.meta.url).pathname);
const relativo = p=>path.relative(process.cwd(),p);
const ler = p=>fs.readFileSync(path.join(pasta,p),'utf8');
const json = p=>JSON.parse(ler(p));
const sha = b=>createHash('sha256').update(b).digest('hex');
const logFinal=ler('portoes/verify.log');
function objetoDepois(marca,desde=0){
  // O comando agregado também termina no nome da última conferência. A última
  // ocorrência é o cabeçalho da execução dessa conferência, não a sua lista.
  const m=marca==='\n'?logFinal.indexOf(marca,desde):logFinal.lastIndexOf(marca);assert(m>=desde,`Falta ${marca} no portão inteiro.`);
  const a=logFinal.indexOf('\n{',m)+1;assert(a>m);
  const b=logFinal.indexOf('\n}',a)+2;assert(b>a);
  return {objeto:JSON.parse(logFinal.slice(a,b)),fim:b};
}
const indicePlantas=JSON.parse(logFinal.split('\n').find(l=>l.startsWith('{"plantas_incorporacao"'))).plantas_incorporacao;
escrever('indice-plantas',{comando:'node tests/livro/indice.mjs --navegador --prova',origem:'portoes/verify.log',plantas:indicePlantas});
const primeiraCorrida={comando:'sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/er1-2026-10-06/portoes',cabeca:ler('portoes-primeira/cabeca').trim(),portoes:['build','verify','typecheck'].map(nome=>({nome,codigo:Number(ler(`portoes-primeira/${nome}.codigo`))})),queixas:ler('portoes-primeira/verify.log').split('\n').filter(l=>/✗.*I[26] ·/.test(l)).map(l=>l.replace(/\u001b\[[0-9;]*m/g,'').trim())};
escrever('primeira-corrida',primeiraCorrida);
const corridaIntermedia={comando:primeiraCorrida.comando,cabeca:ler('portoes-segunda/cabeca').trim(),portoes:['build','verify','typecheck'].map(nome=>({nome,codigo:Number(ler(`portoes-segunda/${nome}.codigo`))}))};
escrever('corrida-intermedia',corridaIntermedia);
const parserAntes=json('parser-antes.json'),campoAntes=json('campo-copia-antes.json');
assert(parserAntes.aceiteIndevidamente&&campoAntes.aceiteIndevidamente);
assert.equal(campoAntes.campoConferidoEOCopiado,false);
const provaFinal=objetoDepois(' check:incorporar\n');
const navegadorFinal=objetoDepois('\n',provaFinal.fim);
escrever('celula',provaFinal.objeto);
escrever('privacidade-prova',objetoDepois(' check:privacidade\n').objeto);
escrever('navegador-final',navegadorFinal.objeto);
const antes=json('antes.json'), celula=json('celula.json'), browser=json('capturas-prova.json'), priv=json('privacidade-prova.json'), metodo=json('metodo-proposta.json');
assert.deepEqual(navegadorFinal.objeto.casos.map(c=>({lang:c.lang,modo:c.modo,valores:c.valores,textos:c.textos})),browser.casos.map(c=>({lang:c.lang,modo:c.modo,valores:c.valores,textos:c.textos})));
const linhas=allClaims();
const c=linhas.find(c=>c.id===browser.linha);
const ausencias={linhasRecusadasPelaFormaDoCliente:linhas.filter(c=>!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id)||typeof c.value!=='string').map(c=>c.id),semFonteNemDerivacao:linhas.filter(c=>!c.source&&!(c.derivation&&c.derived_from?.length)).map(c=>c.id),ressalvasSemIngles:linhas.filter(c=>c.ressalva&&!c.ressalva_en).map(c=>c.id),avisosSemIngles:linhas.filter(c=>c.source_flag_note&&!c.source_flag_note_en).map(c=>c.id)};
assert(Object.values(ausencias).every(a=>a.length===0));
escrever('campos-em-falta',{comando:`node ${relativo(new URL(import.meta.url).pathname)}`,...ausencias});
const cabeca=ler('portoes/cabeca').trim();
assert.equal(cabeca,ler('portoes/cabeca.fim').trim());
const portoes=['build','verify','typecheck'].map(nome=>({nome,codigo:Number(ler(`portoes/${nome}.codigo`).trim()),inicio:ler(`portoes/${nome}.inicio`).trim(),fim:ler(`portoes/${nome}.fim`).trim()}));
assert(portoes.every(p=>p.codigo===0),'Um portão não terminou verde.');
const versao=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
assert.equal(versao.commit??versao.sha??versao.gitCommit,cabeca,'O dist não corresponde à cabeça dos portões.');
const vercel=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const regrasAntes=JSON.parse(execFileSync('git',['show',`${antes.cabeca}:vercel.json`],{encoding:'utf8'}));
const cors=vercel.routes.filter(r=>r.headers?.['Access-Control-Allow-Origin']);
assert.deepEqual(vercel.routes.filter(r=>!r.headers?.['Access-Control-Allow-Origin']),regrasAntes.routes);
assert.deepEqual({...vercel,routes:[]},{...regrasAntes,routes:[]});
const urls=[`/livro-razao/${c.id}.json`,'/livro-razao.json','/livro-razao.csv','/incorporar.js',routePath('linha','pt',{slug:c.id}),routePath('linha','en',{slug:c.id}),'/','/js/copiar-incorporacao.js','/metodo'];
function respostas(regras){return urls.map(caminho=>{
  const h={};for(const r of regras.routes)if(r.src&&!r.has&&new RegExp('^'+r.src+'$').test(caminho))Object.assign(h,r.headers);
  return {caminho,cors:h['Access-Control-Allow-Origin']??null,frame:h['X-Frame-Options']??null};
});}
const depois=respostas(vercel);
// O estado é um controlo sintético da função, não uma observação do servidor.
const comEstadoSimulado = rs=>rs.map(r=>({...r,estado:200}));
assert.deepEqual(conferirCors(comEstadoSimulado(depois)),[]);
const codigos={},recibos={};
for(const lang of ['pt','en']){
  recibos[lang]=fs.readFileSync(`dist${routePath('linha',lang,{slug:c.id})}/index.html`,'utf8');
  codigos[lang]=lerPaginaComCodigo(recibos[lang]).querySelector('[data-incorporar-codigo]').textContent;
}
const exemplo={id:c.id,valor:c.value,antigo:browser.antigo,data:c.access_date,codigos};
escrever('exemplo',{comando:`node ${relativo(new URL(import.meta.url).pathname)}`, ...exemplo});
escrever('cabecalhos',{comando:`node ${relativo(new URL(import.meta.url).pathname)}`,natureza:'Cabeçalhos calculados pela configuração, sem pedidos de rede. A prova entre origens está no ensaio do navegador.',antes:respostas(regrasAntes),depois,regrasAntes:regrasAntes.routes.filter(r=>r.headers),regrasDepois:vercel.routes.filter(r=>r.headers),restanteConfiguracaoIdentica:true});

// Cópias de leitura. As plantas nunca tocam no código ou no dist.
const pacote=path.join(pasta,'leitura');
fs.mkdirSync(pacote,{recursive:true});
const manifesto=[];
function guardar(nome,bytes){const p=path.join(pacote,nome);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes);manifesto.push({ficheiro:relativo(p),sha256:sha(bytes)});}
for(const f of execFileSync('git',['diff','--name-only',antes.cabeca,cabeca],{encoding:'utf8'}).trim().split('\n'))guardar('codigo/'+f,execFileSync('git',['show',`${cabeca}:${f}`]));
for(const f of ['site.config.mjs','src/data/licenca.mjs','src/lib/o-que-e-o-numero.mjs','src/lib/datas.mjs','src/i18n/unidades.mjs','src/i18n/lingua-dos-titulos.mjs',`ledger/claims/${c.__file}`])guardar('codigo/'+f,execFileSync('git',['show',`${cabeca}:${f}`]));
guardar('diff.patch',execFileSync('git',['diff',antes.cabeca,cabeca]));
guardar('brief.md',fs.readFileSync('design/observatorio/BRIEF-ER1-o-recibo-incorporavel.md'));
guardar('linha.json',fs.readFileSync(`dist/livro-razao/${c.id}.json`));
for(const lang of ['pt','en'])guardar(`recibo-${lang}.html`,recibos[lang]);
const modelo=fs.readFileSync('tests/incorporar/blogue.html','utf8');
for(const lang of ['pt','en']){
  const palavras=lang==='pt'?['pt-PT','Blogue de ensaio','Conteúdo da página que acolhe os números.','Valor atual','Valor antigo','Pedido sem resposta']:['en','Test blog','Content of the page hosting the numbers.','Current value','Old value','Failed request'];
  const nomes=['lang','titulo','anfitria','rotulo_atual','rotulo_antigo','rotulo_ausente'];
  const campos=Object.fromEntries(nomes.map((n,i)=>[n,palavras[i]]));
  Object.assign(campos,{codigo_atual:codigos[lang],codigo_antigo:codigos[lang].replaceAll(c.value,browser.antigo),codigo_ausente:codigos[lang].replaceAll(c.id,c.id+'-nao-existe')});
  guardar(`blogue-${lang}.html`,modelo.replace(/\{\{([a-z_]+)\}\}/g,(_,k)=>campos[k]));
}
const incorporador=fs.readFileSync('public/incorporar.js','utf8');
const copia=incorporador+"\nfetch('https://fora.invalid/linha');\nvar leituraAlheia = document.cookie;\n";
guardar('ensaio-cego/incorporar.js',copia);
const privCopia=JSON.parse(execFileSync('python3',['-c',"import importlib.util,json,sys; s=importlib.util.spec_from_file_location('p','scripts/check-privacidade.py'); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); print(json.dumps(m.conferir_incorporador(sys.stdin.read())))"],{input:copia,encoding:'utf8'}));
const plantas=[];
for(const nome of ['pedido-de-fora','cookie']){
  const p=priv.incorporador.plantas.find(p=>p.nome===nome);assert(privCopia.includes(p.mensagem));
  plantas.push({...p,ficheiro:'ensaio-cego/incorporar.js',original:sha(incorporador),plantado:sha(copia)});
}
const copiaVercel=structuredClone(vercel);copiaVercel.routes=copiaVercel.routes.filter(r=>!r.headers?.['Access-Control-Allow-Origin']);
const vTexto=JSON.stringify(copiaVercel,null,2)+'\n';guardar('ensaio-cego/vercel.json',vTexto);
const plantaCors=celula.plantas.find(p=>p.nome==='cors-em-falta');assert(conferirCors(comEstadoSimulado(respostas(copiaVercel))).includes(plantaCors.mensagem));
plantas.push({...plantaCors,ficheiro:'ensaio-cego/vercel.json',original:sha(fs.readFileSync('vercel.json')),plantado:sha(vTexto)});
for(const lang of ['pt','en']){
  const root=lerPaginaComCodigo(recibos[lang]);const campo=root.querySelector('[data-incorporar-codigo]');
  campo.set_content(lang==='pt'?campo.innerHTML.replaceAll(c.value,browser.antigo):campo.innerHTML.replace('/en/ledger/','/livro-razao/'));
  const texto=root.toString();guardar(`ensaio-cego/recibo-${lang}.html`,texto);
  const mensagem=celula.plantas.find(p=>p.nome==='valor-trocado').mensagem;
  assert(conferirCodigo(root,matchPath(routePath('linha',lang,{slug:c.id}))).includes(mensagem));
  plantas.push({nome:lang==='pt'?'valor-trocado':'porta-na-edicao-errada',mensagem,mordeu:true,ficheiro:`ensaio-cego/recibo-${lang}.html`,original:sha(recibos[lang]),plantado:sha(texto)});
}
for(const captura of browser.capturas){
  const bytes=fs.readFileSync(captura.ficheiro);assert.equal(sha(bytes),captura.sha256);
  guardar('capturas/'+path.basename(captura.ficheiro),bytes);
}
guardar('capturas.json',JSON.stringify(browser.capturas.map(c=>({...c,ficheiro:'capturas/'+path.basename(c.ficheiro)})),null,2)+'\n');
guardar('LER.md',`# Pacote para a leitura a frio\n\nO código de entrega está em codigo/ e diff.patch; os recibos e os blogues construídos estão ao lado. As capturas indicadas em capturas.json estão em capturas/, com resumo de bytes.\n\nensaio-cego/ contém cópias com estragos deliberados. Não as publicar nem executar fora do ensaio. O controlo das plantas fica fora desta pasta, para a direção só o abrir depois da resposta do leitor.\n\nPrimeira pergunta: pode o guião, por qualquer caminho, ler ou mandar o que não deve? Segunda pergunta: diz o código do recibo exatamente o que a linha diz? Conferir também se um editor imprimia a página como está.\n\nO relatório está em relatorio-construtor.md e as medições e os portões em provas/. A leitura independente ainda não foi feita.\n`);
escrever('controlo-plantas',{comando:`node ${relativo(new URL(import.meta.url).pathname)}`,plantas});

const largura=[...new Set(browser.capturas.map(c=>c.largura))];
const medidas={comando:`node ${relativo(new URL(import.meta.url).pathname)}`,base:antes.cabeca,cabecaCodigo:cabeca,portoes,recibos:celula.recibos,json:celula.json,campos:Object.keys(JSON.parse(fs.readFileSync(`dist/livro-razao/${c.id}.json`)).incorporacao.pt).length,capturas:browser.capturas.length,larguras:largura,semConfirmacao:antes.verificacoesSemConfirmacao.length,ausencias:antes.ausencias,bytesIncorporador:Buffer.byteLength(incorporador),plantasLeitura:plantas.length,casosNavegador:browser.casos.length,cookies:Math.max(...browser.casos.filter(c=>'cookies'in c).map(c=>c.cookies)),commits:execFileSync('git',['log','--reverse','--format=%H %s',`${antes.cabeca}..${cabeca}`],{encoding:'utf8'}).trim().split('\n'),custo:'A linha tokens used não foi exposta nesta sessão.'};
escrever('resumo',medidas);
const tabela=(cab,linhas)=>[cab.map(x=>`| ${x} `).join('')+'|',cab.map(()=>'|---').join('')+'|',...linhas.map(l=>l.map(x=>`| ${String(x).replaceAll('|','&#124;')} `).join('')+'|')].join('\n');
const todasPlantas=[...celula.plantas.filter(p=>!p.nome.startsWith('data-')),...priv.incorporador.plantas,...indicePlantas.map(p=>({...p,nome:'indice-'+p.nome}))];
const robustez=[...celula.plantas.filter(p=>p.nome.startsWith('data-')),...browser.plantas];
const normal=browser.casos.filter(x=>x.modo==='normal');
const relido=browser.casos.find(x=>x.modo==='releitura'&&x.lang==='pt');
const cabecalho=tabela(['Caminho','CORS antes','CORS depois','X-Frame-Options antes e depois'],depois.map((r,i)=>[r.caminho,respostas(regrasAntes)[i].cors??'ausente',r.cors??'ausente',r.frame]));
const relatorio=`# ER1: o recibo incorporável\n\nA entrega permite copiar cada número com a sua fonte, período, data, atribuição e recibo, nas duas edições. O Método ficou por alterar: a secção sobre o conjunto de dados pressuposta no brief não existe nesta base e a amarra do texto governado recusou a sondagem de alteração; o ficheiro foi reposto byte a byte. A leitura a frio do Opus e a conferência do lugar de direção continuam por fazer.\n\nRelatório gerado por \`${medidas.comando}\`, a partir dos ficheiros desta pasta. Construtor indicado no lançamento: Codex gpt-6-astra, raciocínio xhigh.\n\nBase: \`${medidas.base}\`. Cabeça do código: \`${cabeca}\`. A cabeça final da entrega é o commit que contém este relatório e as provas; lê-se com \`git rev-parse HEAD\` e consta da resposta da sessão. Não se grava aqui um resumo autorreferente.\n\n${tabela(['Commit de código'],medidas.commits.map(x=>[x]))}\n\n## O que se mediu antes de construir\n\nO brief foi medido de novo em antes-brief.json pelo guião do brief; antes.json guarda a cabeça, os cabeçalhos e os casos relevantes do livro. Há ${medidas.semConfirmacao} linhas com tentativas que não confirmaram o número. Há ${medidas.ausencias.access_date} linhas sem access_date, ${medidas.ausencias.reference_date} sem reference_date e ${medidas.ausencias.source} sem fonte direta. São campos ausentes reais, incluindo linhas calculadas, não datas ou fontes que o incorporador possa inventar.\n\nA redação do brief que manda usar a última entrada de verifications precisa de correção: inacessivel ou diverge não são confirmação. O JSON apresentado usa a confirmação igual mais recente, posterior à última mudança para o valor de agora, ou access_date. Uma tentativa sem confirmação não avança a data. A ordem do vetor não decide qual é a última data. As plantas de datas em celula.json exercem esta diferença.\n\nO código estático usa access_date da linha. Quando faltam campos, diz Calculado, período não indicado ou data de leitura não indicada, nas traduções declaradas em strings.mjs. Conserva as ressalvas da linha. A atribuição completa vem da licença existente.\n\n## Código pronto a copiar\n\nLinha de exemplo: \`${exemplo.id}\`. Os blocos seguintes são extraídos dos recibos construídos, sem transcrição manual de números.\n\nPortuguês:\n\n\`\`\`html\n${codigos.pt}\n\`\`\`\n\nInglês:\n\n\`\`\`html\n${codigos.en}\n\`\`\`\n\nO botão usa a área de transferência; se esta não existir ou recusar, seleciona todo o campo. A célula do navegador exerceu esses caminhos nas duas edições. Sem JavaScript, o campo continua disponível e o botão fica oculto.\n\n## O guião e o blogue de ensaio\n\npublic/incorporar.js tem ${medidas.bytesIncorporador} bytes, é gerado por scripts/gerar-incorporar.mjs a partir da função ES2015 em scripts/incorporar-cliente.mjs e não tem dependências. O gerador confere os bytes publicados em modo --conferir. O guião só procura os seus parágrafos, valida o identificador, pede exclusivamente o JSON dessa linha à origem fixa e constrói o resultado com nós de texto. Não usa HTML, código ou endereços vindos do JSON. O pedido omite credenciais e referenciador e recusa redirecionamentos. O elemento script também omite o referenciador e usa crossorigin anonymous.\n\nA atualização acompanha revisões da mesma linha. Não muda automaticamente para um novo período ou outro identificador. Cada parágrafo é pedido apenas uma vez mesmo quando a página cola várias cópias do guião. Não há consulta periódica enquanto a página permanece aberta.\n\nO modelo HTML é tests/incorporar/blogue.html; tests/incorporar/navegador.mjs preenche-o com o código construído e serve-o numa origem local diferente do dist. ${browser.transporte}\n\n${tabela(['Caso','Resultado provado'],[['Valor atual',normal[0].textos[0]],['Valor antigo',normal[0].textos[1]],['Identificador inexistente','O pedido falha e o parágrafo colado fica inteiro, sem aviso inventado.'],['Releitura sem mudar o valor',`Valor ${relido.valores[0].valor}, data ${relido.valores[0].lido}, sem aviso de mudança de valor.`]])}\n\ncapturas-prova.json guarda texto, atributos e todos os pedidos em cada edição. O valor antigo do ensaio (${browser.antigo}) vem de corrections e passa ao publicado (${browser.atual}). A data fictícia do caso releitura é calculada apenas no ensaio, nunca escrita no livro ou nas páginas entregues. Os modos sem JavaScript, sem CORS, resposta indisponível, JSON malformado, identidade errada e redirecionamento preservaram o texto colado. Cookies no ensaio: ${medidas.cookies}. Não houve pedidos a outras origens, corpo nos pedidos ou referenciador, nem alteração do parágrafo da página anfitriã.\n\nEstas células exercem os caminhos do guião auditado. A busca estática não é uma prova geral sobre qualquer JavaScript que alguém possa escrever no futuro; a leitura a frio deve conferir os caminhos que os ensaios não cobrem.\n\n## Cabeçalhos\n\n${cabecalho}\n\nA única regra nova é:\n\n\`\`\`json\n${JSON.stringify(cors,null,2)}\n\`\`\`\n\nOs cabeçalhos anteriores e todas as restantes rotas foram comparados com a base e permanecem idênticos. cabecalhos.json guarda a comparação e as regras completas. O ensaio local aplica essas regras e a planta sem CORS falha entre portas reais. O verify:deploy foi alargado à mesma conferência, incluindo o guião, os dados e as páginas HTML; ainda não foi executado contra uma publicação desta cabeça porque esta sessão não publicou nem fez push.\n\n## Réguas e plantas\n\nForam conferidos ${medidas.recibos} recibos e ${medidas.json} JSON. O portão recompõe o código carácter a carácter e confere os ${medidas.campos} campos da apresentação por uma implementação que não importa o compositor. Confere a leitura literal do campo, incluindo comentários que o navegador copiaria, e exige que esse seja o campo usado pelo botão. Só depois retira o textarea da leitura da prosa nos portões de HTML, voz, língua, lugar e índice. Não há uma classe que dispense conteúdo arbitrário da conferência. A L1 conserva o teto existente: o texto dentro do campo não cria ligações na página e o botão não é uma ligação.\n\nAs frases novas foram declaradas nas duas línguas e acrescentadas ao inventário com leitura editorial por fazer. Os valores de teto dos portões não foram elevados.\n\n${tabela(['Planta','Mensagem afirmada','Mordeu'],todasPlantas.map(p=>[p.nome,p.mensagem,p.mordeu?'sim':'não']))}\n\nAs mensagens acima são afirmadas pelas células, não só pelo código de saída. celula.json, privacidade-prova.json e indice-plantas.json conservam cada resultado.\n\nOs casos abaixo exercitam a conservação do texto e da data perante dados ou pedidos sem confirmação. São condições de robustez verificadas, não mensagens de rejeição de um portão.\n\n${tabela(['Caso','Condição provada','Passou'],robustez.map(p=>[p.nome,p.mensagem,p.mordeu?'sim':'não']))}\n\n## Capturas e leitura a frio\n\nHá ${medidas.capturas} capturas, nas larguras ${largura.join(', ')} px, nas duas edições: bloco no recibo, blogue com JavaScript e blogue sem JavaScript. O navegador confirmou ausência de transbordo horizontal.\n\n${tabela(['Captura','Resumo dos bytes'],browser.capturas.map(c=>[`[${path.basename(c.ficheiro)}](${path.relative(pasta,path.resolve(c.ficheiro))})`,c.sha256]))}\n\nleitura/ contém os ficheiros de código alterados, o diff, o brief, a linha JSON, os recibos construídos e as páginas HTML de ensaio. As capturas estão também copiadas dentro do pacote, com os mesmos resumos dos originais. pacote.json guarda os resumos dos ficheiros. ensaio-cego/ contém ${medidas.plantasLeitura} estragos só em cópias. controlo-plantas.json, fora do pacote do leitor, guarda os resumos antes e depois e a mensagem de cada planta. São defeitos deliberados para avaliar a leitura, não defeitos por corrigir no código de entrega.\n\n## Portões inteiros\n\nComando: \`sh scripts/leituras/portoes.sh <worktree> ${relativo(pasta)}/portoes\`. O guião esperou pelas construções que ocupavam a tranca; tranca-observada.json regista a passagem da espera para outro bloco, com renovação recente. O ER1 não interveio na tranca alheia. Os códigos seguintes foram lidos de ficheiros depois de o guião acabar. Cabeça no início e no fim: \`${cabeca}\`; dist/version.json confirma a mesma cabeça.\n\n${tabela(['Portão','Código lido','Início UTC','Fim UTC'],portoes.map(p=>[p.nome,p.codigo,p.inicio,p.fim]))}\n\nA primeira corrida ficou guardada em portoes-primeira/. O verify terminou com código ${primeiraCorrida.portoes.find(p=>p.nome==='verify').codigo}: ${primeiraCorrida.queixas.join('; ')}. As datas de atributos e os marcadores dentro do código foram tomados por prosa. O portão do índice passou a usar a mesma comparação integral antes da retirada do campo, com plantas pela sua própria leitura. A corrida seguinte ficou guardada em portoes-segunda/, na cabeça \`${corridaIntermedia.cabeca}\`, com os códigos ${corridaIntermedia.portoes.map(p=>p.codigo).join(', ')}. Depois dessa corrida, as sondagens parser-antes.json e campo-copia-antes.json demonstraram que a comparação genérica perdia comentários literais e que o campo marcado podia estar fora do bloco de cópia. Foram fechadas ambas as falhas, com plantas que afirmam as mensagens de rejeição e uma comparação com inputValue no navegador. As sondagens guardam a cabeça e o resumo do comparador anterior; não são ensaios para repetir contra o comparador corrigido. A corrida inteira em portoes/, na cabeça corrigida, é a que vale para a entrega.\n\nOs logs em portoes/ só foram limpos de caminhos locais e nomes da conta. O motor não existe nesta worktree; check:series correu no modo sem motor admitido no lançamento.\n\n## Questões abertas\n\n- ER1-1: confirmar na leitura a frio a escolha de usar só releituras com resultado igual. A implementação protege a verdade da data; antes.json e as plantas documentam a divergência do brief.\n- ER1-2: falta a frase e a ligação de exemplo na página Método, nas duas edições. metodo-contexto.json guarda os títulos reais e confirma que os ficheiros de dados e de vista estão idênticos à base: a secção do conjunto de dados pressuposta no brief não existe. O ensaio de alteração em metodo-proposta.json terminou com código ${metodo.codigo} e a mensagem «${metodo.mensagens[0].replace(/\u001b\[[0-9;]*m/g,'').trim()}». A proposta foi só uma sondagem da amarra, não uma secção pronta do Método. O resumo original e o reposto coincidem: \`${metodo.antes}\`. A direção precisa de registar a alteração do texto governado; não se alterou nem enfraqueceu a amarra. A documentação do conjunto de dados em ledger/README.md foi atualizada.\n- ER1-3: falta a leitura a frio do Opus e a conferência do lugar de direção. O pacote está preparado, mas esta construção não se apresenta como leitura independente.\n- ER1-4: falta verify:deploy no endereço publicado depois de aterrar. A configuração e os pedidos locais foram conferidos; não equivalem a afirmar cabeçalhos já publicados.\n\n${medidas.custo}\n`;
fs.writeFileSync(path.join(pasta,'LEIA-ME.md'),limpar(relatorio));
for(const f of fs.readdirSync(path.join(pasta,'portoes')))if(/\.(log|fim)$/.test(f)){
  const p=path.join(pasta,'portoes',f);fs.writeFileSync(p,limpar(fs.readFileSync(p,'utf8')));
}
const prefixoCapturas=path.relative(pasta,path.dirname(path.resolve(browser.capturas[0].ficheiro)))+'/';
guardar('relatorio-construtor.md',limpar(relatorio).replaceAll(prefixoCapturas,'capturas/'));
for(const f of ['antes.json','antes-brief.json','resumo.json','exemplo.json','celula.json','privacidade-prova.json','navegador-final.json','capturas-prova.json','cabecalhos.json','campos-em-falta.json','metodo-contexto.json','metodo-proposta.json','primeira-corrida.json','corrida-intermedia.json','parser-antes.json','campo-copia-antes.json','indice-plantas.json','tranca-observada.json'])guardar('provas/'+f,fs.readFileSync(path.join(pasta,f)));
for(const f of fs.readdirSync(path.join(pasta,'portoes')))guardar('provas/portoes/'+f,fs.readFileSync(path.join(pasta,'portoes',f)));
escrever('pacote',{comando:`node ${relativo(new URL(import.meta.url).pathname)}`,cabeca,manifesto,plantas:plantas.length,capturas:browser.capturas.length});
console.log(JSON.stringify({cabeca,portoes:portoes.map(p=>({nome:p.nome,codigo:p.codigo})),recibos:medidas.recibos,capturas:medidas.capturas,pacote:relativo(pacote)},null,2));
