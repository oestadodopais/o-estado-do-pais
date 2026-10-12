/** EX1-f: relatório composto a partir das provas terminadas e das frases lidas do HTML. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const pasta = 'design/especime-v3/medicoes/ex2-2026-10-06';
const ler = f => fs.readFileSync(`${pasta}/${f}`, 'utf8');
const cap = JSON.parse(ler('capturas-ex1f.json'));
const x = JSON.parse(ler('portoes-f/explicacao.json'));
const codigos = Object.fromEntries(['build', 'verify', 'typecheck', 'explicacao', 'acertos'].map(k => [k, Number(ler(`portoes-f/${k}.codigo`).trim())]));
if (Object.values(codigos).some(c => c !== 0) || x.erros.length || cap.erros.length) throw Error('a entrega tem erros');
const cabeca = ler('portoes-f/cabeca').trim();
if (cabeca !== ler('portoes-f/cabeca.fim').trim() || cabeca !== cap.cabeca) throw Error('as cabeças diferem');
for (const c of cap.capturas) if (createHash('sha256').update(fs.readFileSync(c.ficheiro)).digest('hex') !== c.sha256) throw Error(`a captura mudou: ${c.ficheiro}`);
const esc = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
const palavras = x.ramos.palavras.map(p => `| ${esc(p.caminho)} | ${p.ramo} | ${p.contem.join(', ')} | ${p.naoContem.join(', ')} |`).join('\n');
const plantas = x.plantas.map(p => `| ${esc(p.nome)} | ${p.mordeu ? 'sim' : 'não'} | ${esc(p.queixa)} |`).join('\n');
const commits = execFileSync('git', ['log', '--reverse', '--format=%h %s', '6f5264b9..HEAD'], { encoding: 'utf8' }).trim();
const secao = `## A passagem EX1-f

A X10 exigia todos os ramos mas não prendia as palavras ao caso que os escolhe. Agora cada token de valor declara, na própria edição, palavras obrigatórias e proibidas para cada ramo. A X10 confere todos, mesmo os não escolhidos, com a mensagem própria «X10 · palavras do ramo». A X6 confere também as palavras do trecho rendido de cada token que consegue isolar pelo prefixo e pelo sufixo do parágrafo. Alterações nesses limites continuam cobertas pela igualdade X6; não se apresenta esta conferência de palavras como um analisador semântico geral.

Base: \`6f5264b9\`, ramo \`ex1d-2026-10-11\`. Cabeça do código: \`${cabeca}\`. As capturas são da construção desta cabeça, a última que muda código; o commit final só acrescenta este relatório, capturas e registos das conferências. Nenhuma mudança de ramo ou publicação. Os trailers seguem o mandato.

### Decisões por achado e questões reservadas

- **1 a 5:** eram os cinco estragos das cópias da leitura. Os registos e o mandato foram comprometidos antes das correções.
- **6:** os oito tokens nas duas edições declaram o vocabulário de todos os seus ramos. A comparação usa palavras inteiras, com acentos, e aceita expressões como «the same». As plantas trocam menor por maior e retiram a palavra do sinal de diferentesPositivo, isoladamente nas duas línguas; outra retira a própria declaração das palavras. O ramo zero da outra conta passou de «zero balance» a «nil balance», para usar o vocabulário pedido; a auditoria acompanha a mudança.
- **7:** a comparação termina com os meses que ainda faltam, sem escrever números à mão. A parte tem apoio em unit da linha executada, «acumulados de janeiro a agosto», e no período anual da previsão. O excerto da linha do saldo contém a linha numérica do quadro, não a expressão «janeiro a agosto»; essa expressão está em unit e na nota. Regista-se esta precisão em relação ao mandato, sem atribuir palavras ao excerto que ele não contém.
- **EX1-9, reservada ao motor:** selar \`execucao-2025-08-saldo-global-administracao-central-seguranca-social\`, a partir do mesmo quadro. O excerto selado já traz o valor homólogo, mas o livro não tem essa linha. Só uma passagem própria poderá dizer que o saldo passou de excedente a défice nos mesmos oito meses. Não se transcreveu esse valor para a página.
- **8:** usa-se «contas públicas» e «parágrafo seguinte» nas duas edições. O HTML confirma que seccoes[3].conteudo[0].paragrafo vem imediatamente depois de seccoes[2].conteudo[1].paragrafo, embora haja um título de secção entre ambos. A auditoria apoia a distinção na nota autorizada da linha e nos campos publicados já citados; a posição é uma parte aponta, conferida contra a ordem dos parágrafos. A planta de posição contrária falha pela X2.
- **9, EX1-10, reservada ao bloco de higiene:** distinguir transferências entre administrações de transferências entre os serviços exige palavras seladas que distingam as duas. A passagem regista a questão e mantém o texto existente.
- **10:** a planta do sinal da previsão rende o ramo real diferentesPositivo que a inversão do sinal escolheria; mantém os valores e os selos originais, para isolar a escolha indevida das palavras. Tem de falhar tanto pela contabilidade dos ramos como pela conferência das palavras do ramo escolhido, em mensagens distintas. Os cenários continuam a provar a lógica dos sinais e dos módulos.
- **11:** o typecheck em zero segundos é o compilador nativo do TypeScript 7, provado pelo lugar de direção com um erro de tipo plantado em 12.10.2026 (M67); não se mudou a maquinaria.

As designações EX1-9 e EX1-10 acima são as do mandato EX1-f e substituem, nesta passagem, os usos desses números na secção histórica EX1-e. Não surgiu uma questão nova a numerar a partir de EX1-11.

### Frases novas lidas do HTML

Os anos e os valores abaixo foram extraídos da página construída pelo guião das capturas, retirando os selos e normalizando os espaços.

${cap.paginas.map(p => `**${p.lang.toUpperCase()}**\n\n${p.frases.map(f => '> ' + f).join('\n\n')}`).join('\n\n')}

### Palavras declaradas por ramo

Cada linha abaixo foi lida da própria declaração pela X10. A tabela conserva todas as ocorrências, incluindo os dois tokens sinal por língua.

| Caminho e edição | Ramo | Tem de conter | Não pode conter |
|---|---|---|---|
${palavras}

### Plantas e cenários

Os ${x.cenariosDosSaldos.cenarios.length} cenários de saldos continuam a confrontar o resolvedor com a conta independente; as ${x.cenariosDosSaldos.ramos.length} retiradas isoladas exigem a mensagem do ramo em falta. Os dois controlos de coexistência mantêm a execução em défice e as contas públicas em excedente, cada qual no seu parágrafo. A X10 verifica as palavras dos ramos independentemente destes cenários e sem consultar a auditoria das folhas.

A célula recontou ${x.paginas} páginas, ${x.auditoria.folhas} folhas e ${x.auditoria.partes} partes auditadas. Morderam ${x.plantas.filter(p => p.mordeu).length} de ${x.plantas.length} plantas. Todas as mensagens são as devolvidas pela célula, guardadas também em [explicacao.json](portoes-f/explicacao.json).

| Planta | Mordeu | Mensagem |
|---|---|---|
${plantas}

### Portões e capturas

Comando: \`sh scripts/leituras/portoes.sh <worktree absoluta> design/especime-v3/medicoes/ex2-2026-10-06/portoes-f\`. RESEARCHHUB_DIR foi definido apenas no ambiente para conferir as origens contra o motor local. Códigos lidos dos ficheiros após terminarem os processos, pela tranca comum; as cabeças inicial e final coincidem.

| Portão | Código lido |
|---|---|
${Object.entries(codigos).map(([k,v]) => `| [${k}](portoes-f/${k}.codigo) | ${v} |`).join('\n')}

${cap.capturas.map(c => `- [${c.lang.toUpperCase()}, ${c.largura} px, ${c.tipo}](../../capturas/ex2-2026-10-06/${c.ficheiro.split('/').at(-1)}).`).join('\n')}

O [manifesto](capturas-ex1f.json) guarda a cabeça, as frases, a ordem dos parágrafos, os SHA-256 e as medidas de largura. As capturas têm ${cap.erros.length} erros de transbordo medidos; os recibos dos dois saldos abriram em cada edição e largura. A [inspeção visual](inspecao-ex1f.json) regista a leitura das imagens.

### Commits e custo

${commits.split('\n').map(c => '- \`' + c + '\`').join('\n')}

O último commit acrescenta apenas os artefactos da entrega. Permanecem reservadas as questões EX1-9 e EX1-10 acima, além das linhas dos juros e do arredondamento de EX1-5 para JD1. A leitura a frio e a integração pertencem ao lugar de direção. Nenhum portão foi dispensado.

Custo-alvo: cem mil símbolos. Não foi observada uma linha «tokens used» desta construção; custo efetivo e confronto com o alvo: [verify], a apurar no registo do lançador.
`;
const destino = `${pasta}/LEIA-ME.md`;
fs.writeFileSync(destino, fs.readFileSync(destino, 'utf8').split('\n## A passagem EX1-f')[0].trimEnd() + '\n\n' + secao);
console.log('EX1-f: relatório composto das frases, palavras, plantas e códigos verificados.');
