/* ER1-e: o relatório lê medições e saídas dos portões da mesma cabeça. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const pasta = 'design/especime-v3/medicoes/er1-2026-10-06';
const ler = f => JSON.parse(fs.readFileSync(`${pasta}/${f}`,'utf8'));
const m = ler('contagens-e.json');
const codigo = fs.readFileSync(`${pasta}/portoes-e/cabeca`,'utf8').trim();
assert.equal(codigo,m.cabecaCodigo);
assert.equal(codigo,fs.readFileSync(`${pasta}/portoes-e/cabeca.fim`,'utf8').trim());
const gates = ['build','verify','typecheck'].map(nome=>({nome,codigo:Number(fs.readFileSync(`${pasta}/portoes-e/${nome}.codigo`,'utf8'))}));
for (const g of gates) assert.equal(g.codigo,0);
const log = fs.readFileSync(`${pasta}/portoes-e/verify.log`,'utf8');
const objetos = [...log.matchAll(/^    \{\n[\s\S]*?^    \}$/gm)].flatMap(x=>{
  try {return [JSON.parse(x[0].replace(/^    /gm,''))];} catch {return [];}
});
const celula = objetos.find(x=>x.comando==='node tests/incorporar/conferir.mjs');
const navegador = objetos.find(x=>x.comando==='node tests/incorporar/navegador.mjs');
assert(celula && navegador,'Faltam as saídas completas dos ensaios no verify.');
const verify = ler('portoes-e/verify.json');
assert(verify.ok);
assert.equal(verify.cabeca,codigo);
assert.equal(verify.corridos.find(x=>x.passo==='npm run check:incorporar').codigo,0);
const plantas = [...celula.plantas,...navegador.plantas].filter(p=>/^(json-recusado-com-campo-|json-com-codigo-sem-campo-|recusado-isolado-|separador-leitura-duas-fontes-|nao-derivada-sem-data-)/.test(p.nome));
for (const lang of ['pt','en']) for (const nome of ['json-recusado-com-campo-objeto','json-recusado-com-campo-null','json-recusado-com-campo-vazio','json-com-codigo-sem-campo','recusado-isolado-excerpt','recusado-isolado-source_url','separador-leitura-duas-fontes','nao-derivada-sem-data']) assert(plantas.find(p=>p.nome===nome+'-'+lang)?.mordeu);
const prova = {cabecaCodigo:codigo,celula,navegador,verify,plantasNovas:plantas,sha256LogVerify:createHash('sha256').update(log).digest('hex')};
fs.writeFileSync(`${pasta}/provas-e.json`,JSON.stringify(prova,null,2)+'\n');
const commits = execFileSync('git',['log','--reverse','--format=%h %s','8dbe1481..'+codigo],{encoding:'utf8'}).trim().split('\n');
const tabela = (titulos,linhas)=>'| '+titulos.join(' | ')+' |\n| '+titulos.map(()=>'---').join(' | ')+' |\n'+linhas.map(l=>'| '+l.map(v=>String(v).replaceAll('|','\\|')).join(' | ')+' |').join('\n');
const texto = `

## A passagem ER1-e

O cliente repetia uma regra de recusa mais estreita e recebia apresentação mesmo para linhas recusadas. O achado seis fica fechado: \`jsonDaLinha\` só acrescenta \`incorporacao\` quando \`podeIncorporar\` permite, usando a proveniência partilhada com o Método. O campo fica ausente, nunca nulo ou vazio. O cliente deixou de procurar marcas na fonte ou na data; exige a apresentação completa da edição no JSON, conserva as validações de identidade e transporte e sai em silêncio se ela não existe. O portão confere presença, ausência e cada campo contra a linha.

O achado oito fica fechado pela comparação, no navegador, do texto completo desde a leitura ao fim da atribuição, incluindo o separador. A planta remove o separador no compositor estático e no cliente, ambos em memória, e exige a mensagem de falha nas duas edições.

O achado nove fica fechado: \`leituraDaIncorporacao\` escreve uma vez a regra usada pelos compositores estático, JSON e do portão. Com data há leitura; sem data só uma linha derivada pode dizer que foi calculada pelo projeto. A confirmação posterior continua a atualizar a leitura no JSON, como antes. O portão rejeita uma linha não derivada sem data de origem, mesmo que tenha releituras, com a mensagem afirmada pela planta.

Os achados um a cinco eram estragos nas cópias da leitura, identificados no registo de plantas da direção, e não originaram correções. O achado sete fica registado como **ER1-12**, para o bloco de higiene: o conjunto da diferença de \`medir-c.mjs\` é vazio por construção e não constitui prova independente. Esse guião histórico não foi corrigido aqui. O achado dez, marcas nos recibos recusados, permanece no bloco dos recibos conforme a decisão anterior. Não se introduzem questões novas.

Relatório gerado por \`node ${pasta}/relatar-e.mjs\`. Cabeça do código: \`${codigo}\`. A cabeça final é a do último commit, que contém apenas este relatório, os anexos medidos e os códigos com os seus registos; consta da resposta da entrega.

${tabela(['Commit'],commits.map(c=>[c]))}

### As contagens lado a lado

Guião: \`${m.comando}\`. Anexo: \`contagens-e.json\`. Cada JSON construído e cada recibo construído é lido. As contagens do Método são extraídas separadamente do HTML português e inglês, incluindo a concordância entre todas as ocorrências de cada contagem na página. O JSON é comum às edições; a apresentação de cada edição é conferida por inteiro quando o campo existe.

${tabela(['Edição','JSON com campo','Método completa','Recibos com código','JSON sem campo','Método por confirmar','Recibos sem código'],Object.entries(m.edicoes).map(([lang,n])=>[lang,n.jsonComCampo,n.metodoCompleta,n.recibosComCodigo,n.jsonSemCampo,n.metodoPorConfirmar,n.recibosSemCodigo]))}

Linhas não derivadas sem \`access_date\`, contadas pelo mesmo guião: **${m.naoDerivadasSemData.length}**. A lista de identificadores fica no anexo, mesmo quando vazia. As igualdades da tabela são exigidas pelo guião.

### As plantas novas e as mensagens

${tabela(['Planta','Mensagem afirmada','Mordeu'],plantas.map(p=>[p.nome,p.mensagem,p.mordeu?'sim':'não']))}

A recusa só pelo excerto usa a linha real \`evora-prr-aprovado-2026\`. Não há no livro uma linha recusada só pelo endereço: a célula cria essa marca isolada sobre uma linha completa, em memória, e serve um JSON sem o campo. Esta é a pequena escolha de ensaio desta passagem. Nas duas situações, compara o HTML inteiro do parágrafo colado depois de o cliente receber o JSON, incluindo o texto e os atributos de valor e leitura. As condições de conservação são afirmações de comportamento, não mensagens produzidas pelo cliente, que permanece silencioso.

A célula conferiu ${celula.recibos} recibos e ${celula.json} JSON. O navegador registou ${navegador.casos.length} casos. As saídas completas e as plantas vieram do \`verify.log\` da corrida, sem repetir ensaios para preencher o relatório, e estão em \`provas-e.json\`, com o resumo do registo.

### Portões e aparência

Comando: \`sh scripts/leituras/portoes.sh <worktree> ${pasta}/portoes-e\`. Cabeça inicial e final da corrida: \`${codigo}\`. Os códigos seguintes foram lidos dos ficheiros depois do fim. O verify executou a união conferida com o build pela tranca existente. Nenhum portão de proteção de números, fontes ou pessoas foi enfraquecido.

${tabela(['Portão','Código lido','Ficheiro'],gates.map(g=>[g.nome,g.codigo,'portoes-e/'+g.nome+'.codigo']))}

Não são necessárias capturas novas: as páginas conservam o aspeto. O guião comparou com \`${m.aparencia.base}\` os ${m.aparencia.codigosComparados} resultados do compositor estático, incluindo recusas, e as ${m.aparencia.apresentacoesComparadas} apresentações elegíveis, nas duas edições. Diferenças: ${m.aparencia.diferencas.length}. Não foram alterados componentes, vistas ou folhas de estilo. A mudança visível no comportamento é a conservação do parágrafo colado quando a proveniência é recusada; a célula do navegador guarda esse texto e os atributos.

Sem push nem publicação. A aterragem pertence ao lugar de direção.

A linha «tokens used» não foi exposta nesta sessão. Custo real e comparação com o custo-alvo: [verify]. Não se infere o custo do orçamento interno.
`;
const ficheiro = `${pasta}/LEIA-ME.md`;
fs.writeFileSync(ficheiro,fs.readFileSync(ficheiro,'utf8').split('\n\n## A passagem ER1-e')[0]+texto);
console.log(JSON.stringify({cabecaCodigo:codigo,gates,edicoes:m.edicoes,naoDerivadasSemData:m.naoDerivadasSemData.length,plantasNovas:plantas.length},null,2));
