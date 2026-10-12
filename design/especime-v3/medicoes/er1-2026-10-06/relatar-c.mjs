/* O relatório só recebe contagens e códigos lidos das provas desta passagem. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const pasta='design/especime-v3/medicoes/er1-2026-10-06';
const ler=f=>JSON.parse(fs.readFileSync(`${pasta}/${f}`,'utf8'));
const m=ler('contagens-c.json'), celula=ler('celula-c.json'), navegador=ler('navegador-c.json');
const capturas=JSON.parse(fs.readFileSync('design/especime-v3/capturas/er1-2026-10-06/er1-c/capturas.json','utf8'));
const codigo=fs.readFileSync(`${pasta}/portoes-c/cabeca`,'utf8').trim();
assert.equal(codigo,m.cabecaCodigo);assert.equal(codigo,capturas.cabecaCodigo);
assert.equal(codigo,fs.readFileSync(`${pasta}/portoes-c/cabeca.fim`,'utf8').trim());
const gates=['build','verify','typecheck'].map(nome=>({nome,codigo:Number(fs.readFileSync(`${pasta}/portoes-c/${nome}.codigo`,'utf8'))}));
for(const g of gates)assert.equal(g.codigo,0);
for(const c of capturas.capturas)assert.equal(createHash('sha256').update(fs.readFileSync(c.ficheiro)).digest('hex'),c.sha256);
const commits=execFileSync('git',['log','--reverse','--format=%h %s','87612cee..'+codigo],{encoding:'utf8'}).trim().split('\n');
const tabela=(titulos,linhas)=>'| '+titulos.join(' | ')+' |\n| '+titulos.map(()=>'---').join(' | ')+' |\n'+linhas.map(l=>'| '+l.map(v=>String(v).replaceAll('|','\\|')).join(' | ')+' |').join('\n');
const plantas=[...celula.plantas,...navegador.plantas].filter(p=>/marca-isolada|calculada-sem-data|separador-licenca-notas|separador-notas-retirado|metodo-sem-exemplo/.test(p.nome));
const texto=`

## A passagem ER1-c

A recusa foi limitada às marcas na fonte ou na data de acesso. As linhas calculadas sem data própria recebem código com «calculado por este projeto» / «calculated by this project». ER1-8 evita repetir essa indicação quando fonte e leitura são iguais. A licença e as notas ficam separadas por « · », e o exemplo do Método abre o recibo da dívida pública.

Há uma condição do mandato que não se pode declarar satisfeita: o Método conta ${m.metodo.porConfirmar} linhas com algum campo por confirmar, mas só ${m.marcasFonteData.length} têm marca na fonte ou na data de acesso. ER1-7 regista esta divergência. A recusa expressamente pedida aplica-se; não se alterou a contagem do Método nem se alargou a recusa para forçar igualdade.

Relatório gerado por \`node ${pasta}/relatar-c.mjs\`. Cabeça do código: \`${codigo}\`. A cabeça final é o commit que acrescenta este relatório, as capturas e as provas; lê-se na resposta final. O último commit não muda código e as capturas são dos mesmos bytes da aplicação que essa cabeça final contém. O carimbo da construção identifica a cabeça do código, sem fingir uma construção posterior.

### Os commits, com os registos primeiro

${tabela(['Commit'],commits.map(c=>[c]))}

O primeiro commit contém o mandato, a leitura inteira e o registo das plantas. O campo \`copia\` desse registo foi anonimizado para cumprir a proibição de caminhos locais. Os achados plantados nas cópias não foram aplicados ao código.

### Cada achado e a proteção

${tabela(['Achado','Tratamento','Planta ou prova'],[
['1, 2, 4, 5 e 6','Eram os estragos das cópias, segundo o mandato. Nenhuma correção de produto.','Registo PLANTAS-ER1-b; amarra do Método, marca-por-confirmar, inventário, comando da edição e manifesto das capturas.'],
['3','ER1-5 revogada. Sem marca na fonte/data, há código; sem data própria, entra a cadeia calculado.','marca-isolada-source, marca-isolada-access_date, calculada-sem-data-sem-codigo; atualização real da calculada no navegador.'],
['7','Separador entre licença e notas no compositor estático e no cliente.','separador-licenca-notas e separador-notas-retirado, nas duas edições.'],
['8','ER1-6: as contagens internas mantêm O Estado do País como lugar porque medem o próprio projeto.','Decisão conservada; comparação integral dos recibos com o lugar declarado. Não se acrescenta planta para uma implementação que não mudou.'],
['9','Marca na fonte e marca na data testadas isoladamente; linha derivada sem data tem código.','As plantas abaixo afirmam a mensagem exata, além do código de saída.'],
['10','A porta do Método passa a divida-publica-2025. As marcas do recibo recusado ficam para o bloco dos recibos.','metodo-sem-exemplo-pt/en; medição da pertença à primeira página, da referência, do lugar e da proveniência.'],
['11','O guião nomeia recibos com código e recusados em cada edição para o próximo pacote.','medir-c.mjs lê cada HTML, compara-o com o livro e regista as rotas abaixo. A composição do pacote pertence à direção.'],
])}

${tabela(['Planta nova ou atualizada','Mensagem afirmada','Mordeu'],plantas.map(p=>[p.nome,p.mensagem,p.mordeu?'sim':'não']))}

### Contagens e rotas, por guião

Comando: \`${m.comando}\`. Fonte: \`${m.livro}\`. O guião usa \`loadClaims()\`, a mesma leitura do livro usada pela prova do Método, e guarda os resumos dos ficheiros em \`contagens-c.json\`. Compara a contagem do módulo da prova com a que o Método rende. A contagem de código vem dos campos realmente construídos, conferidos carácter a carácter pelo portão.

${tabela(['Edição','Com código','Sem código','Calculados sem data própria com código'],Object.entries(m.edicoes).map(([lang,n])=>[lang,n.comCodigo,n.semCodigo,n.calculadosSemDataComCodigo]))}

Método: ${m.metodo.comProvenienciaCompleta} linhas com proveniência completa e ${m.metodo.porConfirmar} por confirmar. A contagem sem código coincide com as ${m.marcasFonteData.length} linhas marcadas na fonte/data do mesmo livro. Não coincide com o total do Método, cuja regra abrange outros campos.

${tabela(['Linha da diferença ER1-7','Ficheiro do livro','Campos marcados'],m.diferencaMetodo.map(c=>[c.id,c.ficheiro,c.campos.join(', ')]))}

${tabela(['Edição','Recibo com código','Recibo recusado','Recibo calculado'],Object.entries(m.edicoes).map(([lang,n])=>[lang,n.rotas.comCodigo,n.rotas.semCodigo,n.rotas.calculado]))}

Exemplo escolhido: \`${m.exemplo.id}\`. ${m.exemplo.razao} A referência declarada é \`${JSON.stringify(m.exemplo.referencia)}\`, lida por guião. O texto governado do Método tem o novo carimbo em DECISIONS.md; a amarra passou sem alteração da sua regra.

### Portões, ensaios e capturas

Comando: \`sh scripts/leituras/portoes.sh <worktree> ${pasta}/portoes-c\`. Cabeça no início e no fim: \`${codigo}\`. Códigos lidos dos ficheiros depois do fim da corrida:

${tabela(['Portão','Código','Ficheiro'],gates.map(g=>[g.nome,g.codigo,'portoes-c/'+g.nome+'.codigo']))}

O verify da tranca executa a união conferida com o build, como define portoes.sh. A corrida interrompida ficou em \`portoes-c-interrompidos/\`: foi parada para corrigir o ensaio novo, que tinha de ler derived_from e contar os parágrafos realmente inseridos. Não se apresenta essa corrida como verde. Nenhum portão que protege números, fontes ou pessoas foi enfraquecido.

Conferência específica: \`node tests/incorporar/conferir.mjs --json ${pasta}/celula-c.json\` e \`node tests/incorporar/navegador.mjs --json ${pasta}/navegador-c.json\`. Foram conferidos ${celula.recibos} recibos e ${celula.json} JSON; o navegador registou ${navegador.casos.length} casos. A calculada sem data própria foi atualizada pelo pedido real ao JSON. As plantas do separador foram executadas no código estático e no cliente.

Capturas: \`node ${pasta}/capturar-c.mjs\`. São ${capturas.capturas.length} imagens: página completa e bloco de incorporação, nas larguras ${[...new Set(capturas.capturas.map(c=>c.largura))].join(' e ')} px, nas duas edições e nos três estados. O manifesto regista os bytes, as rotas, o carimbo, a ausência de pedidos externos e a largura do documento sem transbordo horizontal.

${tabela(['Captura','sha256'],capturas.capturas.map(c=>['['+c.ficheiro.split('/').at(-1)+'](../../capturas/er1-2026-10-06/er1-c/'+c.ficheiro.split('/').at(-1)+')',c.sha256]))}

### O que fica por fazer

ER1-7: a direção tem de resolver a contradição entre a recusa limitada à fonte/data e a igualdade com o total de todos os campos do Método. Os dois conjuntos e a diferença estão medidos; não se declara essa igualdade nem o fecho incondicional do bloco.

O recibo recusado conserva as marcas anteriores ao bloco, como manda o achado 10. A falta de referência do antigo exemplo e a apresentação dessas marcas pertencem ao bloco dos recibos. A direção compõe o próximo pacote com as rotas acima e faz a leitura a frio e a aterragem. Não houve push nem publicação, e verify:deploy desta cabeça continua por executar após publicação.

A linha «tokens used» não foi exposta nesta sessão. Custo real e comparação com o custo-alvo: [verify]. Não se infere o custo do orçamento interno.
`;
const ficheiro=`${pasta}/LEIA-ME.md`;
const anterior=fs.readFileSync(ficheiro,'utf8').split('\n\n## A passagem ER1-c')[0];
fs.writeFileSync(ficheiro,anterior+texto);
console.log(JSON.stringify({cabecaCodigo:codigo,portoes:gates,capturas:capturas.capturas.length,igualdadePedida:m.igualdadePedida}));
