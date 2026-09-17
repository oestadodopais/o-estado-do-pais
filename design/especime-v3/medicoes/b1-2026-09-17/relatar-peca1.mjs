import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const pasta = path.dirname(fileURLToPath(import.meta.url));
const ler = nome => JSON.parse(fs.readFileSync(path.join(pasta, nome), 'utf8'));
const referencia = ler('referencia-peca1.json');
const temas = ler('temas-e-documentos-peca1.json');
const prova = ler('conflitos-retoma-peca1.json');
const capturas = ler('capturas-antes-peca1.json');
const primeira = ler('tempo-peca1-primeira-corrida.json');
const inicio = ler('inicio-retoma-peca1.json');
const git = args => execFileSync('git', args, { encoding: 'utf8' }).trim();
const resumo = bytes => createHash('sha256').update(bytes).digest('hex');
const cabeca = git(['rev-parse', 'HEAD']);
assert.equal(cabeca, referencia.cabeca, 'Este relatório é da paragem, não de uma implementação.');
assert.equal(git(['diff', 'HEAD', '--name-only', '--', 'src', 'scripts', 'public', 'registos', 'studies-src', 'ledger', 'package.json', 'package-lock.json', 'astro.config.mjs', 'site.config.mjs']), '');
assert.equal(resumo(fs.readFileSync(prova.alvo)), prova.sha256Antes);
assert.equal(resumo(fs.readFileSync(prova.portao)), prova.portaoSha256Antes);
assert.equal(prova.limpa, 0);
assert.equal(prova.casos.length, 3);
for (const c of prova.casos) {
  assert.equal(c.antes, 0);
  assert.equal(c.depois, 1);
  assert.equal(c.sha256Reposto, prova.sha256Antes);
  assert.equal(c.corpoSha256Depois, prova.corpoSha256);
}
for (const c of capturas.resultados) {
  assert.equal(resumo(fs.readFileSync(path.join('design/especime-v3/capturas/b1-2026-09-17', c.ficheiro))), c.sha256);
}
const codigos = fs.readFileSync(path.join(pasta, 'portoes-peca1.txt'), 'utf8').trim().split('\n').map(l => l.split(': '));
const fim = new Date();
const segundaSegundos = Math.round((fim.getTime() - Date.parse(inicio.inicioUTC)) / 1000);
const totalSegundos = primeira.segundos + segundaSegundos;
const duracao = s => `${Math.floor(s / 60)} min ${s % 60} s`;
const tempo = {
  corridas: [primeira, { inicioUTC: inicio.inicioUTC, fimUTC: fim.toISOString(), segundos: segundaSegundos, duracao: duracao(segundaSegundos) }],
  segundos: totalSegundos, duracao: duracao(totalSegundos),
  criterio: 'Soma dos tempos medidos nas duas corridas, sem o intervalo entre elas.',
};
const tabelaTemas = temas.tabela.map(r => `| \`${r.slug}\` | \`${r.tema}\` | sim |`).join('\n');
const tabelaCapturas = [390, 768, 1024, 1280, 1600].map(l => `| ${l} | ${[['estudo', 'pt'], ['estudo', 'en'], ['estudos', 'pt'], ['estudos', 'en']].map(([f, i]) => `[PNG](../../capturas/b1-2026-09-17/antes-${f}-${i}-${l}.png)`).join(' | ')} |`).join('\n');
const texto = `| Ponto do §1 | Medida | Resultado |
|---|---|---|
| Página do estudo, item 4 | Fusão das vistas, corpo conferido na página e redirecionamentos | Por construir. A retoma encontrou três outras células que exigem elementos ausentes da maqueta. |
| Lista dos estudos, item 5 | País por data, seguido de «Por lugar» | Por construir. Paragem antes da implementação. |
| Temas, item 7c | Treze temas válidos, portão e planta | Treze correspondências conferidas; nenhuma aplicada. |
| Frases, parte do item 8 | Lista fechada no check:voz, planta e retiradas inventariadas | Por construir. Nenhuma cadeia foi retirada das fontes. |

**A peça não está acabada.** A autorização resolveu os conflitos do primeiro relatório, mas não cobre a obrigação de renderizar a faixa de contagens, o índice e a secção técnica das linhas. São exigências das células L5, L8 e L6 de \`scripts/gate-html.mjs\`, dentro de \`verificaTexto()\`. O prompt desta retoma manda: «Nenhuma outra célula de nenhum portão muda; se outra te parecer impedir o mandato, para e escreve o caso como fizeste.» A implementação parou por essa instrução. Nenhum portão foi alterado.

O relatório anterior não tinha inventariado estas dependências internas da conferência do corpo. A prova desta retoma retira cada elemento separadamente da página de texto construída de Évora 2027, conservando o corpo transcrito. Não é uma prova da página B1 já construída. Mostra que levar \`verificaTexto()\` intacta para a nova rota conserva as três exigências de forma, incompatíveis com «o que [as maquetas] não mostram não entra».

| Célula adicional | O que protege | Retirada isolada | Antes | Depois |
|---|---|---|---|---|
| L5, \`scripts/gate-html.mjs:2384\` | Recontagem das figuras e blocos contra o registo; igualdade das contagens impressas e porta para o corpo | Só \`.texto-faixa\` | 0 | 1: «a página tem 0 marcas data-registo-conta» |
| L8, \`scripts/gate-html.mjs:2243\` | Ordem, texto e destino de cada entrada do índice; posição das secções | Só \`nav.texto-indice\` | 0 | 1: «o índice «Nesta página» tem 0 entradas e o registo tem 29 títulos de nível 2 e 3» |
| L6, \`scripts/gate-html.mjs:2132\` | Acesso à linha do motor de cada figura sem linha no livro do projeto, com valor, impresso e origem conferidos | Só \`#linhas-do-documento-dobra\` | 0 | 1: «a página não tem a secção "As linhas deste documento"» |

[Prova, contextos e SHA-256](conflitos-retoma-peca1.json). Registos completos: [referência limpa](retoma-limpa-peca1.txt), [faixa retirada](retoma-faixa-peca1.txt), [índice retirado](retoma-indice-peca1.txt), [secção das linhas retirada](retoma-linhas-peca1.txt). Reprodução: \`node design/especime-v3/medicoes/b1-2026-09-17/provar-conflitos-retoma-peca1.mjs\`, sobre a construção de referência.

O HTML voltou em cada caso a \`${prova.sha256Antes}\`. O corpo manteve \`${prova.corpoSha256}\` nas três plantas. O portão manteve \`${prova.portaoSha256Antes}\`. As fontes, os registos e os bytes das edições não mudaram.

A decisão necessária é sobre estas exigências de forma. A proposta para L5 e L8 é retirar a obrigação de mostrar a faixa e o índice, mantendo a recontagem interna e a conferência integral de qualquer contagem ou índice que se imprima. Para L6, a origem de cada figura tem de continuar acessível: a direção precisa de fixar onde vivem as linhas e como os números as abrem na forma B1. Apagar as linhas sem outra saída perde a prova; conservar a secção técnica como está acrescenta uma peça que a maqueta não mostra. Nenhuma destas propostas foi aplicada.

| Célula já autorizada | Decisão recebida | Estado nesta retoma |
|---|---|---|
| \`check-lugar.mjs:1564\` e \`:1989\` | Manter todas as páginas, a cobertura da lista e os acessos ao texto e à edição; retirar as exigências da frase, das filas e da caixa | Intacta. Planta da página em falta por fazer. |
| \`gate-html.mjs:6076\`, com a chamada a \`verificaTexto()\` | Conferir o corpo e as marcas na rota do estudo | Intacta. Planta do algarismo trocado na nova rota por fazer. |
| \`check-datas.mjs:312\` e \`:376\` | Prender cada data à edição correta sem depender das portas nem de \`.edicao\` | Intacta. Planta da data trocada por fazer. |

A linha final fica decidida como «Edição tal como foi publicada · publicado a <data>», com a versão inglesa correspondente. Há 18 edições HTML e nenhum PDF; o formato não entra no rótulo. A tabela dos temas é a de \`design/especime-v3/maquetas/b1/fazer.py\`, que fica intacta. Estas decisões deixam de ser pendências.

| Família | Cadeia cuja retirada foi autorizada | Razão | Retirada |
|---|---|---|---|
| Estudo | «O que cada porta abre…» | explica a página e é a forma anterior ao B1 | não |
| Estudo | «Edições» e portas duplicadas de leitura | segunda porta | não |
| Estudo | «Ler no sítio» | palavra fora do lugar | não |
| Lista | «Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá.» | explica a página | não |

Cadeias retiradas: **0**, nas duas línguas. \`INVENTARIO-FRASES.md\` e \`critica/REVISOES-DO-INVENTARIO.md\` permanecem intactos; inscrever uma retirada que não aconteceu seria falso. Os restantes elementos da forma antiga também permanecem, pela paragem anterior à implementação.

| Estudo | Tema da maqueta | Existe em dominios.mjs |
|---|---|---|
${tabelaTemas}

Tabela conferida, não aplicada. [Contagem original dos temas e documentos](temas-e-documentos-peca1.json).

Commits novos: **0**. Cabeça inicial e final: \`${cabeca}\`, ramo \`${referencia.ramo}\`. Não houve commit de implementação, mudança de ramo, push ou escrita fora desta worktree. O relatório, as provas e as capturas de referência ficam por confirmar em Git. O [relatório da primeira corrida](LEIA-ME-peca1-primeira-corrida.md) fica preservado, com o [conflito inicial](conflito-peca1.json).

| Comando | Código na cabeça acima | Corrida |
|---|---|---|
${codigos.map(([c, n]) => `| \`${c}\` | ${n} | primeira, antes da implementação |`).join('\n')}

Os códigos continuam em [portoes-peca1.txt](portoes-peca1.txt). [Build](build-peca1.log), [verify](verify-peca1.log), [typecheck](typecheck-peca1.log). Não foram repetidos nesta retoma: a cabeça e todas as fontes verificadas são as mesmas. Nesta retoma, o portão de HTML foi exercido sobre a referência e nas três retiradas isoladas, com os códigos 0, 1, 1 e 1 acima. Os verdes não provam uma peça B1 concluída. Não houve leitura independente de uma implementação.

Capturas «antes»: **20**, preservadas e reconferidas por SHA-256. Capturas «depois»: **0**. As medições de referência têm zero deslocamento lateral. [Rotas, larguras e resumos](capturas-antes-peca1.json). A referência usa as fontes de main em \`${referencia.main}\`; [comparação guardada](referencia-peca1.json).

| Largura | Estudo PT | Estudo EN | Lista PT | Lista EN |
|---|---|---|---|---|
${tabelaCapturas}

| Corrida | Início UTC | Fim UTC | Tempo de parede |
|---|---|---|---|
| Primeira | ${primeira.inicioUTC} | ${primeira.fimUTC} | ${primeira.duracao} |
| Retoma | ${inicio.inicioUTC} | ${fim.toISOString()} | ${duracao(segundaSegundos)} |
| Soma | | | **${duracao(totalSegundos)}** |

[Registo do tempo](tempo-peca1.json). A soma exclui o intervalo entre as corridas. A retoma conta desde a primeira leitura do relógio até à escrita deste relatório.

Ficam por fazer os quatro pontos da peça, as três mudanças autorizadas com as respetivas plantas, a planta do tema, a lista fechada da voz com a sua planta, a transcrição da abertura de «Onde está a água?», os redirecionamentos, as vinte capturas «depois», os commits e os três portões sobre a implementação concluída. A retoma depende da decisão sobre L5, L8 e L6, sem voltar a pedir as decisões já tomadas sobre as três células iniciais, o rótulo final e as retiradas.
`;
assert.ok(!/[\u2013\u2014]/.test(texto), 'Sem travessões na prosa do relatório.');
fs.writeFileSync(path.join(pasta, 'LEIA-ME-peca1.md'), texto);
fs.writeFileSync(path.join(pasta, 'tempo-peca1.json'), JSON.stringify(tempo, null, 2) + '\n');
console.log(`Relatório da paragem escrito. Soma das duas corridas: ${duracao(totalSegundos)}.`);
