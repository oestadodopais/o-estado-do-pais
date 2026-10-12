/* ER1-d: o relatório lê as contagens, as plantas da corrida e os códigos. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const pasta = 'design/especime-v3/medicoes/er1-2026-10-06';
const ler = f => JSON.parse(fs.readFileSync(`${pasta}/${f}`, 'utf8'));
const m = ler('contagens-d.json');
const codigo = fs.readFileSync(`${pasta}/portoes-d/cabeca`, 'utf8').trim();
const capturas = JSON.parse(fs.readFileSync('design/especime-v3/capturas/er1-2026-10-06/er1-d/capturas.json', 'utf8'));
assert.equal(codigo, m.cabecaCodigo);
assert.equal(codigo, capturas.cabecaCodigo);
assert.equal(codigo, fs.readFileSync(`${pasta}/portoes-d/cabeca.fim`, 'utf8').trim());
assert(m.igualdadePedida);
const gates = ['build', 'verify', 'typecheck'].map(nome => ({nome, codigo: Number(fs.readFileSync(`${pasta}/portoes-d/${nome}.codigo`, 'utf8'))}));
for (const g of gates) assert.equal(g.codigo, 0);
for (const c of capturas.capturas) assert.equal(createHash('sha256').update(fs.readFileSync(c.ficheiro)).digest('hex'), c.sha256);
// O verify guarda cada saída completa indentada. Extraem-se os objetos emitidos
// pelos ensaios, sem os repetir só para obter outro ficheiro de resultados.
const log = fs.readFileSync(`${pasta}/portoes-d/verify.log`, 'utf8');
const objetos = [...log.matchAll(/^    \{\n[\s\S]*?^    \}$/gm)].flatMap(x => {
  try { return [JSON.parse(x[0].replace(/^    /gm, ''))]; } catch { return []; }
});
const celula = objetos.find(x => x.comando === 'node tests/incorporar/conferir.mjs');
const navegador = objetos.find(x => x.comando === 'node tests/incorporar/navegador.mjs');
assert(celula && navegador, 'Faltam as saídas completas dos ensaios no verify.');
const verify = ler('portoes-d/verify.json');
assert(verify.ok);
assert.equal(verify.cabeca, codigo);
assert.equal(verify.corridos.find(x => x.passo === 'npm run check:incorporar').codigo, 0);
const plantas = [...celula.plantas, ...navegador.plantas].filter(p => /marca-isolada|calculada-sem-data|separador-licenca-notas|separador-notas-retirado|metodo-sem-exemplo/.test(p.nome));
for (const campo of ['excerpt', 'source_url']) for (const lang of ['pt', 'en']) {
  const p = plantas.find(p => p.nome === `marca-isolada-${campo}-${lang}`);
  assert(p?.mordeu);
  assert.equal(p.mensagem, 'ER1 código: proveniência por confirmar oferece código.');
}
assert(plantas.every(p => p.mordeu));
const prova = {cabecaCodigo: codigo, celula, navegador, verify, sha256LogVerify: createHash('sha256').update(log).digest('hex')};
fs.writeFileSync(`${pasta}/provas-d.json`, JSON.stringify(prova, null, 2) + '\n');
const commits = execFileSync('git', ['log', '--reverse', '--format=%h %s', '514224f1..' + codigo], {encoding: 'utf8'}).trim().split('\n');
const tabela = (titulos, linhas) => '| ' + titulos.join(' | ') + ' |\n| ' + titulos.map(() => '---').join(' | ') + ' |\n' + linhas.map(l => '| ' + l.map(v => String(v).replaceAll('|', '\\|')).join(' | ') + ' |').join('\n');
const texto = `

## A passagem ER1-d

ER1-7 fechada pela decisão do lugar de direção no mandato desta passagem. A recusa usa agora \`provenienciaIncompleta()\`, a mesma definição de \`src/lib/ledger.mjs\` que a prova do Método usa. O compositor e o portão importam-na; a regra não foi copiada nem se alteraram as linhas do livro. O guião exige a igualdade entre os recibos realmente construídos sem código e a contagem do Método em cada edição.

A definição partilhada lê os campos de proveniência, incluindo o excerto, o endereço da fonte e o documento. Conserva também o período de referência que já fazia parte do predicado do Método. As linhas calculadas sem marca continuam a receber código. A recusa mantém as cadeias aprovadas nas duas línguas, que descrevem um campo da proveniência por confirmar na fonte.

Relatório gerado por \`node ${pasta}/relatar-d.mjs\`. Cabeça do código: \`${codigo}\`. O último commit acrescenta apenas o relatório com os seus anexos medidos, as capturas e os códigos dos portões. A cabeça final lê-se na resposta da entrega. As capturas mostram os mesmos bytes da aplicação dessa cabeça final; o carimbo identifica honestamente a cabeça do código.

${tabela(['Commit'], commits.map(c => [c]))}

### As contagens lado a lado

Comando: \`${m.comando}\`. Fonte: \`${m.livro}\`. Os resumos dos ficheiros do livro e as rotas estão em \`contagens-d.json\`. A contagem sem código vem de cada HTML construído; a do Método vem de \`prova()\` e é conferida contra a contagem rendida na página do Método.

${tabela(['Edição', 'Recibos sem código', 'Método por confirmar', 'Com código', 'Calculados sem data com código'], Object.entries(m.edicoes).map(([lang, n]) => [lang, n.semCodigo, m.metodo.porConfirmar, n.comCodigo, n.calculadosSemDataComCodigo]))}

Igualdade exigida em todas as edições: ${m.igualdadePedida ? 'satisfeita' : 'não satisfeita'}. O conjunto da diferença tem ${m.diferencaMetodo.length} linhas. A divergência descrita na secção histórica ER1-c e em \`decisoes-c.md\` fica resolvida por esta passagem.

### As plantas e a mensagem

A planta nova marca só o excerto e, separadamente, só o endereço da fonte. Confere que o compositor devolve ausência de código e que um recibo adulterado para oferecer código falha pela mensagem afirmada. Os campos do documento também são isolados. As plantas da ER1-c continuam a correr na mesma célula e no navegador.

${tabela(['Planta nova ou conservada', 'Mensagem afirmada', 'Mordeu'], plantas.map(p => [p.nome, p.mensagem, p.mordeu ? 'sim' : 'não']))}

As saídas integrais dos ensaios foram extraídas do \`verify.log\` da tranca para o anexo \`provas-d.json\`, sem repetir a corrida. Foram conferidos ${celula.recibos} recibos e ${celula.json} JSON; o navegador registou ${navegador.casos.length} casos. Nenhum portão de proteção de números, fontes ou pessoas foi enfraquecido.

### Os portões e as capturas

Comando: \`sh scripts/leituras/portoes.sh <worktree> ${pasta}/portoes-d\`. Cabeça no início e no fim: \`${codigo}\`. Os códigos foram lidos dos ficheiros depois de terminada a corrida. O verify executou a união conferida com o build pela tranca existente.

${tabela(['Portão', 'Código', 'Ficheiro'], gates.map(g => [g.nome, g.codigo, 'portoes-d/' + g.nome + '.codigo']))}

Capturas por \`${capturas.comando}\`: ${capturas.capturas.length} imagens, com página completa e bloco de incorporação, nas larguras ${[...new Set(capturas.capturas.map(c => c.largura))].join(' e ')} px. A linha \`${m.recusadoExcerto.id}\`, de \`${m.recusadoExcerto.ficheiro}\`, tem marca apenas em \`${m.recusadoExcerto.campos.join(', ')}\`. O guião confirma a ausência de campo e botão de código, a frase da recusa da edição, a ausência de pedidos externos e a largura sem transbordo horizontal.

${tabela(['Edição', 'Recibo recusado pelo excerto'], Object.entries(m.edicoes).map(([lang, n]) => [lang, n.rotas.recusadoExcerto]))}

${tabela(['Captura', 'sha256'], capturas.capturas.map(c => ['[' + c.ficheiro.split('/').at(-1) + '](../../capturas/er1-2026-10-06/er1-d/' + c.ficheiro.split('/').at(-1) + ')', c.sha256]))}

Não ficam questões novas desta passagem. A apresentação das marcas anteriores ao bloco continua reservada ao bloco dos recibos, como já decidiu a direção. A leitura a frio e a aterragem pertencem ao lugar de direção. Não houve push nem publicação.

A linha «tokens used» não foi exposta nesta sessão. Custo real e comparação com o custo-alvo: [verify]. Não se infere o custo do orçamento interno.
`;
const ficheiro = `${pasta}/LEIA-ME.md`;
fs.writeFileSync(ficheiro, fs.readFileSync(ficheiro, 'utf8').split('\n\n## A passagem ER1-d')[0] + texto);
console.log(JSON.stringify({cabecaCodigo: codigo, gates, edicoes: m.edicoes, metodo: m.metodo, capturas: capturas.capturas.length}, null, 2));
