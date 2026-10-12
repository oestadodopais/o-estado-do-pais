/* ER1-f: o relatório deriva da corrida inteira, incluindo a falha de cada cópia. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { allClaims } from '../../../../src/lib/ledger.mjs';
import { jsonDaLinha } from '../../../../src/lib/conjunto.mjs';
const pasta = 'design/especime-v3/medicoes/er1-2026-10-06';
const portoes = `${pasta}/portoes-f`;
const ler = f => fs.readFileSync(`${portoes}/${f}`,'utf8').trim();
const codigo = ler('cabeca');
assert.equal(codigo,ler('cabeca.fim'));
assert.equal(codigo,execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
assert.equal(execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim(),'');
assert.equal(JSON.parse(fs.readFileSync('dist/version.json','utf8')).commit,codigo);
const gates = ['build','verify','typecheck'].map(nome => {
  const valor = ler(`${nome}.codigo`);
  assert.equal(valor,'0');
  return {nome,codigo:Number(valor),ficheiro:`portoes-f/${nome}.codigo`};
});
const log = fs.readFileSync(`${portoes}/verify.log`,'utf8');
const objetos = [...log.matchAll(/^    \{\n[\s\S]*?^    \}$/gm)].flatMap(x => {
  try {return [JSON.parse(x[0].replace(/^    /gm,''))];} catch {return [];}
});
const navegador = objetos.find(x => x.comando === 'node tests/incorporar/navegador.mjs');
assert(navegador,'Falta a saída inteira do navegador no verify.');
const verify = JSON.parse(ler('verify.json'));
assert(verify.ok);
assert.equal(verify.cabeca,codigo);
assert.equal(verify.corridos.find(x => x.passo === 'npm run check:incorporar').codigo,0);
const plantas = navegador.plantas.filter(p => p.nome.startsWith('recusado-isolado-'));
const esperadas = ['pt','en'].flatMap(lang => ['excerpt','source_url'].map(campo => ({lang,campo,nome:`recusado-isolado-${campo}-${lang}`})));
assert.deepEqual(plantas.map(p => p.nome).sort(),esperadas.map(p => p.nome).sort());
for (const {lang,campo,nome} of esperadas) {
  const planta = plantas.find(p => p.nome === nome);
  const normal = navegador.recusas.find(r => r.lang === lang && r.campo === campo && r.modo === 'normal');
  const estragada = navegador.recusas.find(r => r.lang === lang && r.campo === campo && r.modo === 'recusado-com-campo-'+campo);
  assert(normal && estragada && planta.mordeu && planta.estrago);
  assert.equal(normal.jsonComCampo,false);
  assert.equal(normal.compositor,null);
  assert.equal(normal.antes,normal.depois);
  assert.equal(normal.falha,null);
  assert.equal(estragada.jsonComCampo,true);
  assert.equal(estragada.compositor,null);
  assert.equal(estragada.antes,normal.antes);
  assert.notEqual(estragada.antes,estragada.depois);
  assert.deepEqual(estragada.falha,{codigo:'ERR_ASSERTION',mensagem:`ER1 navegador: a recusa só por ${campo} alterou o parágrafo colado.`});
  assert.equal(planta.mensagem,estragada.falha.mensagem);
}
assert.deepEqual(navegador.capturas,[]);
// A nova entrada em memória não muda os bytes publicados para nenhum id real.
const fonteAnterior = execFileSync('git',['show','9f240c59:src/lib/conjunto.mjs'],{encoding:'utf8'})
  .replace(/from '([^']+)'/g,(_,caminho) => `from '${new URL(caminho,new URL('../../../../src/lib/conjunto.mjs',import.meta.url)).href}'`);
const anterior = await import('data:text/javascript;base64,'+Buffer.from(fonteAnterior).toString('base64'));
const linhas = allClaims();
for (const linha of linhas) {
  const atual = jsonDaLinha(linha.id);
  assert.equal(atual,anterior.jsonDaLinha(linha.id),linha.id);
  assert.equal(atual,jsonDaLinha(linha),linha.id);
  assert.equal(atual,fs.readFileSync(`dist/livro-razao/${linha.id}.json`,'utf8'),linha.id);
}
const prova = {cabecaCodigo:codigo,gates,plantas,recusas:navegador.recusas,casosNavegador:navegador.casos.length,
  jsonComparados:linhas.length,base:'9f240c59',sha256LogVerify:createHash('sha256').update(log).digest('hex')};
fs.writeFileSync(`${pasta}/provas-f.json`,JSON.stringify(prova,null,2)+'\n');
const commits = execFileSync('git',['log','--reverse','--format=%h %s','9f240c59..'+codigo],{encoding:'utf8'}).trim().split('\n');
const tabela = (titulos,linhas) => '| '+titulos.join(' | ')+' |\n| '+titulos.map(() => '---').join(' | ')+' |\n'+linhas.map(l => '| '+l.map(v => String(v).replaceAll('|','\\|')).join(' | ')+' |').join('\n');
const texto = `

## A passagem ER1-f

O achado seis da leitura ER1-e era um defeito da prova: a igualdade que passava no caso normal era contada como planta mordida. Agora cada recusa tem um JSON verdadeiro, produzido por \`jsonDaLinha\` sem retoque, e uma cópia estragada à qual o ensaio acrescenta \`incorporacao\` com apresentação completa e valor correspondente à linha. Só uma falha efetiva da comparação do parágrafo inteiro, com código de asserção e mensagem exata, regista a mordida. O caso normal exige o HTML inteiro intacto; o compositor recusa ambas as linhas nas duas edições. Esta prova substitui a alegação de mordida das recusas isoladas na secção ER1-e, que fica como registo histórico.

A recusa por excerto usa a linha real \`evora-prr-aprovado-2026\`; o JSON produzido é também comparado com o construído. Para o endereço, a pequena escolha de ensaio é copiar em memória uma linha real, dar-lhe um identificador próprio e marcar apenas \`source_url\`. A mesma cópia passa a \`jsonDaLinha\` e a \`codigoDaIncorporacao\`. O produtor aceita a linha diretamente ou o identificador usado pelas páginas. Na cópia estragada do endereço, a apresentação vem da linha real de origem. Não se altera o livro.

Os achados um a cinco eram plantas nas cópias do pacote; não originaram correções. As marcas nos recibos recusados continuam atribuídas ao bloco dos recibos. Não surgiram questões novas. Sem capturas, porque as páginas não mudam: os ${prova.jsonComparados} JSON reais são idênticos aos da base \`${prova.base}\`, tanto por identificador como por linha em memória, e coincidem com os ficheiros construídos. Compositor, cliente, componentes e estilos não foram alterados.

Relatório gerado por \`node ${pasta}/relatar-f.mjs\`. Cabeça do código: \`${codigo}\`.

A cabeça final pertence ao último commit, que só contém o relatório, o anexo de prova e os códigos com os seus registos; não cabe dentro de si própria e consta da resposta da entrega.

${tabela(['Commit'],commits.map(c => [c]))}

### As plantas do navegador

Guião: \`${navegador.comando}\`. Plantas corrigidas: ${plantas.length}. Casos do navegador na corrida: ${navegador.casos.length}. O estrago e a mensagem abaixo são extraídos da saída do navegador no \`verify.log\`; a mensagem é a da asserção capturada, não uma mensagem do cliente, que continua silencioso. \`provas-f.json\` conserva os parágrafos antes e depois, o caso normal e a cópia estragada, com o resumo SHA-256 do registo.

${tabela(['Planta','Estrago na cópia','Mensagem da falha afirmada','Mordeu'],plantas.map(p => [p.nome,p.estrago,p.mensagem,p.mordeu?'sim':'não']))}

### Os portões

Comando: \`sh scripts/leituras/portoes.sh <worktree> ${portoes}\`. Os portões correram pela tranca na cabeça do código, com a árvore seguida limpa. Cabeça inicial, final, carimbo da construção e verify coincidem. O verify exerce a união inteira conferida com o build. Códigos lidos dos ficheiros depois de terminada a corrida:

${tabela(['Portão','Código lido','Ficheiro'],gates.map(g => [g.nome,g.codigo,g.ficheiro]))}

Sem push nem publicação. A aterragem pertence ao lugar de direção.

A linha «tokens used» não foi exposta nesta sessão. Custo real e comparação com o custo-alvo: [verify]. Não se infere o custo do orçamento interno.
`;
const ficheiro = `${pasta}/LEIA-ME.md`;
fs.writeFileSync(ficheiro,fs.readFileSync(ficheiro,'utf8').split('\n\n## A passagem ER1-f')[0]+texto);
console.log(JSON.stringify({cabecaCodigo:codigo,gates,plantas,jsonComparados:prova.jsonComparados},null,2));
