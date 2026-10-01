/** E0: escreve o relatório a partir das medidas e dos comprovativos efetivos. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const medidas = json(`${pasta}/medidas.json`);
const valor = nome => medidas.medidas.find(m => m.nome === nome).valor;
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const commits = execFileSync('git', ['log', '--reverse', '--format=%h|%s', `${medidas.base}..HEAD`], { encoding: 'utf8' }).trim().split('\n');
const tocados = execFileSync('git', ['diff', '--name-only', `${medidas.base}..HEAD`], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
/* O leitor de decisões lê texto: as capturas PNG não têm decisões citadas.
   Usam-se os caminhos explícitos dos textos, como o mandato pede. */
const textos = tocados.filter(p => !p.endsWith('.png'));
const argumentosDasDecisoes = ['scripts/leituras/decisoes-em-vigor.py', ...textos];
const decisoes = execFileSync('python3', argumentosDasDecisoes, { encoding: 'utf8' });
fs.writeFileSync(`${pasta}/decisoes-em-vigor.txt`, decisoes);
fs.writeFileSync(`${pasta}/decisoes-em-vigor.json`, JSON.stringify({ cabeca, comando: ['python3', ...argumentosDasDecisoes].join(' '),
  textos, capturas_excluidas: tocados.filter(p => p.endsWith('.png')), conhecido_positivo: decisoes.includes('§1.117') && decisoes.includes('§1.127') }, null, 2) + '\n');
const custo = valor('custo');
const anteriores = json(`${pasta}/estado-anterior.json`);
const e1 = json(`${pasta}/prova-e1.json`);
const construtor = custo.construtor;
const inteiro = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const decimal = n => String(n).replace('.', ',');
const portoes = valor('portoes');
const passagem = medidas.e0c ? 'e0c' : 'e0b';
const finais = medidas.aceitação.completa && medidas.cabeca === cabeca;
const estado = finais ? 'O teste de aceitação do §2 está cumprido, com os três portões na cabeça final.' : 'O conteúdo e as provas locais estão medidos. Os três portões da cabeça final ainda estão por correr.';
const linhas = portoes.map(p => `| \`npm run ${p.nome}\` | ${p.codigo === null ? 'Por correr' : `[${p.codigo}](portoes/${passagem}/${p.nome}.codigo)`} | ${p.cabeca ? `\`${p.cabeca}\`` : 'Por escrever'} | ${p.segundos === null ? 'Por medir' : decimal(p.segundos_relatorio)} |`).join('\n');
const relatorio = `# E0 · As linhas do projeto e a correção do desemprego

${estado}

Construção por Codex \`${construtor.modelo}\`, no ramo \`e0-2026-09-30\`. Base: \`${medidas.base}\`. Cabeça do ramo: \`${cabeca}\`. Cabeça das medidas: \`${medidas.cabeca}\`.

## Mandato e medidas

O guião [medir-e0.mjs](medir-e0.mjs) escreve [medidas.json](medidas.json), com ${medidas.medidas.length} registos de medida e as provas dos detetores. A E0b revê os positivos do decimal da fonte, do diff e dos códigos dos portões, em [detetores-e0b.json](detetores-e0b.json). A aceitação completa exige também os portões na cabeça final. O §0 do brief foi reproduzido pelo seu guião antes da mudança.

| # | Mandato | Medida e resultado |
| --- | --- | --- |
| 1 | O lugar do projeto | O resolvedor aceita a chave declarada, com o nome O Estado do País e a porta de Correções nas duas edições. A A3 recusa a falta da declaração; a A1 recusa uma declaração falsa de Portugal. |
| 2 | As correções do desemprego | As 2 linhas estão em 6,0, cada uma com uma correção de 6 para 6,0, datada de 30.09.2026 e selada pelo guião. Os excertos conservam 6.0. |
| 3 | A recontagem | O contador está em 5, com uma atualização de 3 para 5. A contagem direta do livro dá 5. O ledger:check dirigido deu 0 em [ensaios/livro.codigo](ensaios/livro.codigo). |
| 4 | O que o leitor vê | A primeira página e o cartão do desemprego mostram 6,0 % nas duas edições. O registo mostra as 3 mudanças em cada edição, com Portugal nas correções e O Estado do País na recontagem. |
| 5 | A célula e as decisões | A célula [linhas-da-casa.mjs](../../../../tests/inicio/linhas-da-casa.mjs) corre em check:pais, portanto no build e no verify. As ${valor('plantas_que_mordem').total} plantas mordem. A lista das decisões fica abaixo. |
| 6 | O relatório e as provas | Este relatório, o medidor, as plantas, o custo e as ${valor('capturas').total} capturas estão nesta entrega. Os comprovativos finais atualizam-se depois do commit de entrega. |

## O diagnóstico medido e o mecanismo

A [prova do estado anterior](estado-anterior.json), executada na cabeça \`${anteriores.executado_na_cabeca}\`, recompõe em memória as linhas da base \`${anteriores.cabeca}\` e confirma que os bytes do selador continuam iguais aos dessa base. Sela a entrada 3 para 5 numa cópia de uma linha com source_url nulo e derivação declarada, com código 0. O registo das mudanças recusa a mesma entrada sem lugar, nas duas edições. A cabeça escrita no comprovativo é a da execução, e a base recomposta é outro campo.

O selador não precisou de mudar. A localização continua a ser a derivação. O [ensaio para E1](prova-e1.json) usa o mesmo selador numa cópia: conserva as ${valor('selador_disponivel_para_e1').antes} entradas de Évora e acrescenta uma atualização. A linha real de Évora fica em 6. ${e1.cabeca ? `A prova correu na cabeça \`${e1.cabeca}\`.` : 'O comprovativo antigo não registou a cabeça; será repetido nesta passagem para a registar.'}

[atualizar-linhas.mjs](atualizar-linhas.mjs) acrescenta as entradas datadas e chama o selador para cada linha. As ${valor('historia_anterior_conservada').linhas_anteriores} listas anteriores da história selada conservam os seus prefixos. Só mudaram os valores das 3 linhas autorizadas. A E0b altera RegistoCorrecoes para imprimir também os nomes lidos de campos do livro. A anatomia do cartão reservada ao K2, as vistas e as folhas de estilo conservaram-se. Nenhum ficheiro do repositório foi apagado.

O lugar do projeto entra pela mesma resolução de chave que a União Europeia. O campo study não atribui automaticamente esse lugar. A segunda leitura da A3 verifica a declaração contra a origem interna e a expressão da contagem, mas não substitui a declaração em falta. As decisões §1.144, §1.145 e §1.146 continuam a orientar o mecanismo e o seu uso no E1.

A célula permanente conserva as entradas históricas do E0, compara o valor atual com a última entrada selada e reconta todas as correções. Permite que a história cresça numa atualização futura. O medidor deste bloco exige os valores de aceitação 6,0, 6,0 e 5.

## Plantas e conferências dirigidas

As [plantas](plantas.json) usam processos isolados e cópias em memória. A planta A exige código 1 com a queixa A3 do portão real, na mesma corrida que aceita a declaração. Esta é a lista completa lida do comprovativo:

${valor('plantas_que_mordem').plantas.map(p => `- ${p.nome}: ${p.mordeu ? 'mordeu' : 'não mordeu'}.`).join('\n')}

Foram conferidas ${valor('plantas_que_mordem').total} plantas, das quais ${valor('plantas_que_mordem').mordidas} morderam; os ficheiros reais ficam intactos.

As conferências dirigidas do livro, da travessia, dos tipos e do país passaram. Os primeiros ensaios da célula falharam por um seletor de planta que nomeava a linha irmã, ausente da primeira página, e por rótulos esperados com maiúscula onde o registo usa minúscula. Os dois erros da célula foram corrigidos; as saídas anteriores e a corrida limpa ficam em ensaios. A primeira tentativa de captura foi impedida pela restrição do servidor local; a corrida com acesso ao servidor local terminou com código 0.

Uma primeira corrida dos três portões passou a zero, mas o guião dos comprovativos marcou erradamente os artefactos como código por registar: retirava o espaço inicial do formato porcelain antes de ler as colunas. A [prova do estado da árvore](estado-da-arvore.json) reproduz esse falso positivo e confirma que alterações de código ou do livro continuam a ser recusadas. Corrigiu-se a leitura; ${finais ? 'os portões foram repetidos na cabeça final' : 'os portões serão repetidos na cabeça final'}. Os primeiros comprovativos conservam-se em ensaios.

## Capturas e inspeção

As ${valor('capturas').total} imagens PNG existem no ramo em \`design/especime-v3/capturas/e0-2026-09-30/\`: primeira página integral, cartão do desemprego em Emprego e secção integral das mudanças, a 390 e a 1 280 px, nas duas edições. Não entram no pacote da leitura a frio por serem binárias. O [manifesto](capturas-e0.json) guarda a cabeça construída \`${json(`${pasta}/capturas-e0.json`).cabeca}\`, dimensões e SHA-256. O medidor recalculou todos os resumos e encontrou ${valor('capturas').problemas.length} problemas de captura ou transbordo.

O captor segue os guiões N1: servidor efémero local, fontes carregadas, pedidos externos recusados, movimento reduzido e escala do dispositivo fixa. A inspeção visual incluiu a primeira página e a secção das mudanças em português a 390 px, e o cartão em português a 390 px e em inglês a 390 e a 1 280 px. A disposição do cartão existente mantém-se.

## Commits

${commits.map(c => { const [h, texto] = c.split('|'); return `- \`${h}\`: ${texto}.`; }).join('\n')}

O último commit de entrega inclui [RESPOSTA-construtor-e0.md](RESPOSTA-construtor-e0.md). A cabeça final lê-se dos ficheiros .cabeca e da resposta de fecho da sessão, fora do ramo.

## Portões

${finais ? `Os três comandos correram separadamente na cabeça final \`${cabeca}\`. Os códigos e cabeças foram lidos dos ficheiros acabados de escrever.` : 'Os três comandos finais correm depois do commit de entrega, cada um no seu comando. Esta tabela será regenerada a partir dos ficheiros acabados de escrever.'}

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
${linhas}

Na E0b, os portões inteiros correm pelo guião scripts/leituras/portoes.sh, que toma a tranca comum do Git (M46). Os registos passam pela limpeza dos caminhos e do nome da conta local. O medidor encontrou ${valor('ficheiros_com_dados_da_maquina').fugas.length} ficheiros com dados da máquina entre os ficheiros do bloco.

O typecheck executa tsc com tsconfig.check.json, allowJs, checkJs, strict e noEmit. Inclui src/tipos.d.ts, astro.config.mjs, site.config.mjs e os ficheiros .mjs de src/lib, src/data e src/i18n; exclui dist e src/data/sobre.mjs. Portanto confere os dados de nomes alterados nesta passagem. Componentes .astro, scripts, testes e guiões das medições ficam fora desse programa. O código zero não significa uma conferência de tipos desses ficheiros; o build e as células exercitam-nos por outras vias.

Um commit não pode conter o seu próprio identificador. Os comprovativos finais, a atualização deste relatório, a resposta, o custo e o medidas.json ficam na árvore de trabalho depois do último commit, sem fazer outro commit que invalidasse a cabeça conferida. Os guiões que os reproduzem estão no ramo. A cabeça das capturas está declarada no manifesto e pode anteceder o commit que só entrega documentação e provas.

## Decisões em vigor nos ficheiros tocados

A leitura anterior aos ficheiros existentes mostrou a §1.117 em mudancas e a §1.127 em check-pais. Ambas se conservaram. A §1.146 é citada nas novas guardas do E0. A lista final foi obtida por \`python3 scripts/leituras/decisoes-em-vigor.py\` com os caminhos explícitos dos textos tocados. O modo por intervalo falha ao tentar ler uma captura PNG; o fecho passou a dar-lhe apenas texto. O comando completo e os caminhos estão em [decisoes-em-vigor.json](decisoes-em-vigor.json), e a lista em [decisoes-em-vigor.txt](decisoes-em-vigor.txt).

\`\`\`text
${decisoes.trimEnd()}
\`\`\`

## Custo e limites

Amostra de ${custo.medido_em}, lida dos eventos token_count da sessão identificada pelo ambiente: ${inteiro(construtor.simbolos_sem_cache_mais_saida)} símbolos de entrada sem cache mais saída; ${inteiro(construtor.simbolos.total_tokens)} no total com cache; ${inteiro(construtor.simbolos.cached_input_tokens)} em cache. Tempo decorrido desde o início da sessão até à amostra: ${decimal(custo.segundos_decorridos)} segundos. Modelo efetivamente lido: \`${construtor.modelo}\`. Os revisores automáticos das aprovações têm os seus próprios contadores em [custo.json](custo.json).

É uma amostra anterior ao fecho, não um custo em euros nem o contador final do terminal. A amostra original do E0 conserva-se em [custo-e0-original.json](custo-e0-original.json). O mandato E0b regista o contador final do E0, na linha tokens used, em 412 261 símbolos; essa proveniência está em [custo-final-e0.json](custo-final-e0.json). A leitura a frio do E0 está em design/especime-v3/critica/LEITURA-e0-2026-09-30.md e originou esta passagem. O E1 continua a ser outro bloco. Não houve publicação.

## O que fica por fazer

${finais ? 'Nenhum item do teste de aceitação original E0 fica por cumprir. O estado do mandato E0b e a paragem por fonte estão na secção seguinte. Falta a aterragem.' : 'Correr os portões E0b na cabeça final, reler os códigos e regenerar as medidas. O estado do mandato E0b está na secção seguinte. Falta a aterragem.'}
`;
fs.writeFileSync(`${pasta}/LEIA-ME.md`, relatorio);
fs.writeFileSync(`${pasta}/RESPOSTA-construtor-e0.md`, `# E0 · Resposta do construtor\n\n${estado}\n\nAs 2 linhas do desemprego estão em 6,0, o contador está em 5 e as 3 mudanças têm lugar no registo. As histórias foram seladas pelo guião. A anatomia do cartão conserva-se.\n\nCabeça lida: \`${cabeca}\`. Commits: ${commits.map(c => `\`${c.split('|')[0]}\``).join(', ')}. Relatório: [LEIA-ME.md](LEIA-ME.md).\n\nCódigos lidos: ${portoes.map(p => `${p.nome}: ${p.codigo ?? 'por correr'}`).join('; ')}. Capturas e medidas nos caminhos do relatório.\n\n${finais ? 'A leitura a frio originou a E0b; o seu estado está em RESPOSTA-construtor-e0b.md. Falta a aterragem.' : 'Faltam os portões da cabeça final e a atualização dos comprovativos.'}\n`);
console.log(`E0: relatório e resposta escritos a partir da cabeça ${cabeca}; aceitação completa: ${finais}.`);
