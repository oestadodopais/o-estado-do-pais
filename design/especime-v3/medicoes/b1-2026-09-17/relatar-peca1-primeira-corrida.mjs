import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const pasta = path.dirname(new URL(import.meta.url).pathname);
const ler = nome => JSON.parse(fs.readFileSync(path.join(pasta, nome), 'utf8'));
const referencia = ler('referencia-peca1.json');
const temas = ler('temas-e-documentos-peca1.json');
const prova = ler('conflito-peca1.json');
const capturas = ler('capturas-antes-peca1.json');
const git = args => execFileSync('git', args, { encoding: 'utf8' }).trim();
const cabeca = git(['rev-parse', 'HEAD']);
if (cabeca !== referencia.cabeca) throw new Error('A cabeça mudou desde a medição.');
const fontes = ['src', 'scripts', 'public', 'registos', 'studies-src', 'ledger', 'package.json', 'package-lock.json', 'astro.config.mjs', 'site.config.mjs'];
const alteracoes = git(['diff', '--name-only', '--', ...fontes]);
if (alteracoes) throw new Error('As fontes mudaram desde a paragem.');
const inventarios = ['design/especime-v3/INVENTARIO-FRASES.md', 'design/especime-v3/critica/REVISOES-DO-INVENTARIO.md'];
if (git(['diff', '--name-only', '--', ...inventarios])) throw new Error('Os inventários mudaram.');
const commits = git(['rev-list', '--count', `${referencia.cabeca}..HEAD`]);
const depois = fs.readdirSync('design/especime-v3/capturas/b1-2026-09-17').filter(f => f.startsWith('depois-')).length;
const codigos = fs.readFileSync(path.join(pasta, 'portoes-peca1.txt'), 'utf8').trim().split('\n').map(l => l.split(': '));
const fim = new Date();
const segundos = Math.round((fim.getTime() - Date.parse(referencia.inicioUTC)) / 1000);
const duracao = `${Math.floor(segundos / 60)} min ${segundos % 60} s`;
const tabelaDosTemas = temas.tabela.map(r => `| \`${r.slug}\` | \`${r.tema}\` | ${r.valido ? 'sim' : 'não'} |`).join('\n');
const larguras = [...new Set(capturas.resultados.map(r => r.largura))];
const tabelaDasCapturas = larguras.map(l => `| ${l} | ${[['estudo', 'pt'], ['estudo', 'en'], ['estudos', 'pt'], ['estudos', 'en']].map(([f, i]) => `[PNG](../../capturas/b1-2026-09-17/antes-${f}-${i}-${l}.png)`).join(' | ')} |`).join('\n');
const texto = `| Ponto | Medida | Resultado |
|---|---|---|
| Página do estudo, item 4 | Fusão das vistas e redirecionamentos | Por construir. O portão recusa retirar a frase das portas. |
| Lista dos estudos, item 5 | País por data, seguido de «Por lugar» | Por construir. A guarda atual exige todas as linhas em cada lista. |
| Temas, item 7c | Correspondências válidas e planta | ${temas.tabela.filter(r => r.valido).length} correspondências da maqueta conferidas contra ${temas.dominios} domínios; ${temas.tabela.filter(r => r.declarado).length} aplicadas. Portão e planta do tema por construir. |
| Frases, parte do item 8 | Inventário reduzido e voz a zero | Inventários intactos. O check:voz passou na construção de referência. |

**Peça parada antes da implementação**, pela ordem expressa de parar quando um portão impedir o brief. A prova retirou apenas a frase «O que cada porta abre…» do HTML construído. O check:lugar passou de ${prova.limpa} para ${prova.planta}, com a falha «0 frase(s) das portas (esperada 1)». Os bytes foram repostos e o SHA-256 voltou ao inicial. Nenhum portão foi alterado.

| Proteção atual | Conflito com o mandato | O que protege |
|---|---|---|
| scripts/check-lugar.mjs:1564 e :1989 | Exige a frase das portas, as filas de edições e a lista completa de estudos | Forma única das edições, acesso ao texto e ausência de páginas perdidas. A forma exigida é a anterior ao B1. |
| scripts/gate-html.mjs:6076 | Só aceita data-registo e as marcas associadas na rota texto | Proveniência e igualdade do corpo transcrito com o registo fixado. Mover o corpo exige manter esta conferência na nova rota. |
| scripts/check-datas.mjs:312 e :376 | Prende as datas às portas de edição da lista e aos blocos .edicao | Impede datas atribuídas à edição errada ou impressas sem correspondência verificável. |

O primeiro conflito foi exercido. Os restantes foram identificados por leitura do código. [Prova e resumos SHA-256](conflito-peca1.json), [corrida limpa](conflito-limpa-peca1.txt) e [rejeição da retirada](conflito-planta-peca1.txt). Reprodução: \`node design/especime-v3/medicoes/b1-2026-09-17/provar-conflito-peca1.mjs\`, depois da construção.

A linha «Documento original (PDF)» também precisa de decisão: o manifesto declara ${temas.edicoes} edições HTML e há ${temas.pdf} PDF em studies-src/. Ligar HTML com o rótulo PDF seria uma indicação falsa. [Contagem e correspondências](temas-e-documentos-peca1.json).

| Família | Cadeias retiradas | Razão |
|---|---|---|
| Estudo | Nenhuma | Paragem antes da implementação. |
| Lista dos estudos | Nenhuma | Paragem antes da implementação. |

As retiradas pedidas continuam pendentes: «O que cada porta abre…» e o subtítulo da lista, por «explica a página»; «Edições» e as portas de leitura duplicadas, por «segunda porta»; «Ler no sítio», por «palavra fora do lugar». Não foram inscritas como retiradas em REVISOES-DO-INVENTARIO.md porque continuam nas páginas.

A tabela seguinte é a de TEMA_DO_ESTUDO, em design/especime-v3/maquetas/b1/fazer.py:291. Está conferida, mas não aplicada a studies.mjs. A referência a §5.5 no pedido não coincide com a numeração do brief; a correspondência explícita está no gerador da maqueta.

| Estudo | Tema da maqueta | Existe em dominios.mjs |
|---|---|---|
${tabelaDosTemas}

Commits novos: ${commits}. Cabeça inicial e final: \`${cabeca}\`, ramo \`${referencia.ramo}\`. Main de referência: \`${referencia.main}\`. Não houve commit de implementação, push ou mudança de ramo. O relatório e as medições ficam por confirmar em Git, na worktree pedida.

O «antes» foi construído nesta worktree: as fontes, os dados e a configuração de construção são iguais aos de main na referência indicada; as diferenças entre as cabeças são documentos e maquetas. O carimbo do dist identifica a cabeça da worktree. [Comparação guardada](referencia-peca1.json).

| Comando | Código |
|---|---|
${codigos.map(([c, n]) => `| \`${c}\` | ${n} |`).join('\n')}

Comandos separados sobre a cabeça indicada, com os códigos lidos de [portoes-peca1.txt](portoes-peca1.txt). Registos: [build](build-peca1.log), [verify](verify-peca1.log), [typecheck](typecheck-peca1.log). São verificações da versão de referência, não da peça concluída. O check:documentos passou; conserva a exceção D5 já declarada para a avaliação económica regional. Não houve leitura independente de uma implementação.

Capturas «antes»: ${capturas.resultados.length}, em Chromium ${capturas.navegador}, com Playwright de node_modules. Capturas «depois»: ${depois}, porque a construção parou. A medição encontrou ${capturas.resultados.filter(r => r.deslocamento > 0).length} capturas de referência com deslocamento lateral; a 390, documento e corpo cabem na janela nas duas páginas e línguas. [Medições, rotas e resumos das imagens](capturas-antes-peca1.json).

| Largura | Estudo PT | Estudo EN | Lista PT | Lista EN |
|---|---|---|---|---|
${tabelaDasCapturas}

Tempo de parede até à escrita deste relatório: **${duracao}**, de ${referencia.inicioUTC} a ${fim.toISOString()}, medido pelo relógio. [Registo do tempo](tempo-peca1.json).

Ficam por fazer os quatro pontos de implementação, a planta do tema, a célula da lista fechada da voz e a sua planta, a transcrição da abertura de «Onde está a água?», os redirecionamentos e as capturas «depois». A retoma depende da decisão do lugar de direção sobre as células acima e sobre o rótulo do documento original. A mudança das células deve conservar a comparação com os registos, a amarra de cada data à sua edição e a cobertura de todos os estudos.
`;
if (/[\u2013\u2014]/.test(texto)) throw new Error('O relatório contém um travessão.');
fs.writeFileSync(path.join(pasta, 'LEIA-ME-peca1.md'), texto);
fs.writeFileSync(path.join(pasta, 'tempo-peca1.json'), JSON.stringify({ inicioUTC: referencia.inicioUTC, fimUTC: fim.toISOString(), segundos, duracao }, null, 2) + '\n');
console.log(`Relatório escrito. Tempo de parede: ${duracao}.`);
