/** EX1-e: o relatório lê as frases do manifesto extraído do HTML e os códigos terminados. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const pasta = 'design/especime-v3/medicoes/ex2-2026-10-06';
const ler = f => fs.readFileSync(`${pasta}/${f}`, 'utf8');
const cap = JSON.parse(ler('capturas-ex1e.json'));
const x = JSON.parse(ler('portoes-e/explicacao.json'));
const codigos = Object.fromEntries(['build', 'verify', 'typecheck', 'explicacao', 'acertos'].map(k => [k, Number(ler(`portoes-e/${k}.codigo`).trim())]));
if (Object.values(codigos).some(c => c !== 0) || x.erros.length || cap.erros.length) throw Error('a entrega tem erros');
const cabeca = ler('portoes-e/cabeca').trim();
if (cabeca !== ler('portoes-e/cabeca.fim').trim() || cabeca !== cap.cabeca) throw Error('as cabeças diferem');
for (const c of cap.capturas) if (createHash('sha256').update(fs.readFileSync(c.ficheiro)).digest('hex') !== c.sha256) throw Error(`a captura mudou: ${c.ficheiro}`);
const commits = execFileSync('git', ['log', '--reverse', '--format=%h %s', 'e8deccc1..HEAD'], { encoding: 'utf8' }).trim();
const esc = s => s.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
const textos = cap.paginas.map(p => `**${p.lang.toUpperCase()}**\n\n${p.frases.map(f => '> ' + f).join('\n\n')}`).join('\n\n');
const plantas = x.plantas.map(p => `| ${esc(p.nome)} | ${p.mordeu ? 'sim' : 'não'} | ${esc(p.queixa)} |`).join('\n');
const ramos = [...new Set(x.cenariosDosSaldos.ramos.map(r => `${r.token}: ${r.ramo}`))].map(r => `- ${r}`).join('\n');
const capturas = cap.capturas.map(c => `- [${c.lang.toUpperCase()}, ${c.largura} px, ${c.tipo}](../../capturas/ex2-2026-10-06/${c.ficheiro.split('/').at(-1)}).`).join('\n');
const secao = `## A passagem EX1-e

A comparação com sinal da EX1-d podia levar o leitor a entender que o défice era maior. Agora compara a dimensão dos défices ou excedentes. As afirmações sem apoio sobre a classificação dos juros e a promessa de atualização saíram. A contabilidade dos ramos voltou a abranger todo o texto de main, com uma mensagem própria e plantas que a exercem.

Base: \`e8deccc1\`, ramo \`ex1d-2026-10-11\`. Cabeça do código: \`${cabeca}\`. O commit final contém apenas este relatório, as capturas e os registos das conferências. As capturas são da construção desta cabeça do código; o commit de entrega não muda o código nem o HTML. Sem mudança de ramo, sem publicação e sem push. A identificação de autoria nos trailers é a pedida no mandato.

### Decisões por achado e questões

- **1, 2, 3, 7 e 9:** eram as cinco plantas nas cópias. A X10 da base já exigia maior, menor e igual para compara. A prova nova retira cada ramo de cada token isoladamente e exige a mensagem X10 que o nomeia.
- **4, EX1-7 fechada:** comparaSaldos lê as duas linhas do saldo e compara os seus módulos quando têm o mesmo sinal. Não afirma cumprimento de uma meta mensal. Os dez ramos estão declarados por extenso em ambas as línguas; a previsão anual e a unidade vêm da linha por token. Com sinais diferentes, diz apenas o que o Orçamento previa. Os dois zeros têm uma frase própria.
- **5 e 10, EX1-6 substituída:** o literal selado «Transfers of a general character between different levels of government» sustenta as transferências na abertura. «Public debt transactions» não sustenta a inclusão dos juros nem «que o Orçamento também prevê»: ambas saíram, com a promessa. A frase curta sobre não isolar os juros é auditada como conta, inteira, sob a condição sem_linhas; não usa aquele literal para afirmar uma localização dos juros.
- **6, EX1-8 substituída:** saiu o ciclo redundante de ausências por parágrafo e a respetiva recolha de ausências. Cada ocorrência de texto de ramo, escolhido ou não, em main tem de estar contida num parágrafo cujo token o escolheu. A procura atravessa elementos HTML e normaliza os espaços. Lê main com e sem os selos, para também apanhar texto disfarçado com a classe de um selo. As duas plantas de prosa sem token falham pela mensagem «X6 · contabilidade dos ramos». O ramo não escolhido acrescentado ao seu parágrafo falha pela igualdade X6 e também pela contabilidade; não se apresenta a igualdade como prova da regra nova. Os controlos em PT e EN preservam as duas contas corretas, com défice e excedente em parágrafos distintos.
- **8, EX1-9:** não existe uma conferência autónoma de perímetro nesta célula. A planta muda apenas o valor visível para o saldo da administração central; mantém data-claim, href e o restante selo. Falha pela igualdade da X6 com o valor da linha declarada, como o nome e a mensagem da planta dizem. Não depende da X8.
- **11, EX1-10:** «No fim de» e «apresentavam um saldo acumulado» substituem a abertura repetida e o fecho indevido. A frase distingue a conta das administrações públicas do outro ano, que entra por periodo. O exemplo do mandato dizia «parágrafo anterior», mas a ordem real coloca essa conta depois. Optou-se por não indicar posição. O apoio na nota interna é uma exceção estreita da auditoria: só a linha do saldo executado e os dois literais citados são admitidos. A nota inteira não é publicada.
- **12:** origens.mjs não precisava de correção. As duas origens foram conferidas contra os ficheiros e os registos dos pedidos no motor. A duração do typecheck continua com o lugar de direção; esta passagem não muda a maquinaria.

### Frases novas lidas do HTML

O guião de capturas extraiu estes textos do HTML construído, retirando os selos e normalizando os espaços. Os valores e os anos não foram transcritos à mão.

${textos}

### Ramos e provas

${ramos}

Os ${x.cenariosDosSaldos.cenarios.length} cenários nas duas línguas cobrem módulos menores, maiores e iguais em défices e excedentes, ambos nulos, cada lado isoladamente nulo e todos os pares de sinais diferentes. Comparam o resolvedor com a conta independente da célula e afirmam o ramo esperado. As ${x.cenariosDosSaldos.ramos.length} retiradas isoladas exigem que a X10 nomeie o ramo retirado. Os textos, caminhos e mensagens estão em [explicacao.json](portoes-e/explicacao.json), incluindo os dois controlos de coexistência.

A célula recontou ${x.paginas} páginas, ${x.auditoria.folhas} folhas e ${x.auditoria.partes} partes auditadas. As ${x.plantas.filter(p => p.mordeu).length} plantas abaixo morderam. A mensagem de cada uma é a devolvida pela célula, não uma etiqueta do construtor.

| Planta | Mordeu | Mensagem |
|---|---|---|
${plantas}

### Portões e capturas

Comando: \`sh scripts/leituras/portoes.sh <worktree absoluta> design/especime-v3/medicoes/ex2-2026-10-06/portoes-e\`, com RESEARCHHUB_DIR a apontar para o motor local apenas no ambiente da execução. Os códigos foram lidos de ficheiro depois de os processos terminarem. A tranca protegeu a corrida; as cabeças de início e fim coincidem.

| Portão | Código lido |
|---|---|
${Object.entries(codigos).map(([k,v]) => `| [${k}](portoes-e/${k}.codigo) | ${v} |`).join('\n')}

${capturas}

O [manifesto](capturas-ex1e.json) guarda a cabeça, os resumos SHA-256, os textos e as medidas de largura. Mede ${cap.erros.length} erros de transbordo e abre os recibos dos dois saldos em cada combinação de língua e largura. A inspeção visual está em [inspecao-ex1e.json](inspecao-ex1e.json).

### Commits, trabalho reservado e custo

${commits.split('\n').map(c => '- \`' + c + '\`').join('\n')}

Uma corrida inicial dos portões foi interrompida antes dos três códigos, quando uma planta adicional encontrou texto indevido disfarçado com a classe de um selo. A lacuna foi corrigida; essa tentativa não serve de prova. A corrida final de portoes-e começou de novo na cabeça corrigida.

O último commit acrescenta só os artefactos da entrega. Ficam para JD1 as linhas próprias dos juros e o arredondamento previsto em EX1-5, por decisão do mandato; esta passagem não promete esses valores na página. A leitura a frio e a decisão de integração pertencem ao lugar de direção. Nenhum portão foi dispensado.

Custo-alvo: cento e cinquenta mil símbolos. Não foi observada uma linha «tokens used» desta construção; custo efetivo e confronto com o alvo: [verify], a apurar no registo do lançador. Não se inventa uma contagem.
`;
const destino = `${pasta}/LEIA-ME.md`;
const anterior = fs.readFileSync(destino, 'utf8').split('\n## A passagem EX1-e')[0].trimEnd();
fs.writeFileSync(destino, anterior + '\n\n' + secao);
console.log('EX1-e: relatório composto dos códigos, frases, plantas e capturas verificados.');
