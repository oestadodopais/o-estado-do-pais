# CAM2-A, adenda A: implementação ensaiada, fecho interrompido

A passagem parou pelo §2. A integração de `check:frases-afirmacao` como novo
passo do `verify` altera o número publicado na página Método de 67 para 68.
Essa é a única diferença encontrada no HTML português dessa página. O
mandato exige simultaneamente a integração e nenhuma mudança nas páginas.
Não se alterou a definição desse número nem a sua régua para conservar 67.

Há ainda uma diferença nas condições de construção: o `dist/` fornecido por
`OEDP_DIST_BASE`, de f362f5ccd60dd7e81d12f4ff194b16bc72714b30, foi construído
em `2026-11-08T23:35:53.059Z`; a construção desta passagem foi preparada em
`2026-11-09T10:24:39.476Z`. O calendário, a próxima leitura dos recibos e a
janela da leitura semanal mudam com o dia. `prova.json` também contém o commit,
o instante e a contagem dos passos. Excluir apenas `version.json` não elimina
essas diferenças.

O ensaio não satisfaz o ponto 7. A implementação, o registo gerado e a dívida
inicial foram guardados em `CAM2-A-adenda-a-interrompida.patch`. A situação dos
ficheiros ativos e o resultado do build em curso ficam registados no fecho.
Nada foi publicado nem enviado para um ramo remoto.

## Comparação estrita

Comando executado, pelo `curto.sh`:

`python3 scripts/comparar-dist-frases.py dist <temporario>/cam2a-a-comparacao.json`

O guião lê a base de `OEDP_DIST_BASE`, compara o conjunto de caminhos e os bytes
de todos os ficheiros, excetuando apenas `version.json`. Não normaliza datas,
contagens ou texto. Resultado: código 1.

| Medida | Resultado |
| --- | ---: |
| Ficheiros em cada árvore, fora `version.json` | 25 305 |
| Ficheiros iguais byte a byte | 25 112 |
| Ficheiros diferentes | 193 |
| Páginas HTML em cada árvore | 9 878 |
| Páginas HTML diferentes | 192 |
| Outros ficheiros diferentes | 1, `prova.json` |
| Ficheiros novos ou apagados | 0 |

Exemplos inspecionados diretamente:

- `metodo/index.html`: 67 passa a 68 conferências da corrida inteira.
- `agenda/index.html`: `data-calendario-dia` passa de 2026-11-08 a 2026-11-09.
- `en/ledger/abandono-escolar-precoce-2024/index.html`: a próxima leitura passa de 09.11.2026 a 16.11.2026.
- `en/explainers/weekly-reading/index.html`: a janela de 02.11 a 08.11 passa a 03.11 a 09.11, e o conteúdo semanal muda.
- `prova.json`: mudam o commit, o instante e a contagem das conferências.

A lista completa está em `comparacao-adenda-a-cam2a.json`. A saída comparada
foi construída sobre a árvore de trabalho, ainda com HEAD ddf8b8edf; não se
apresenta como uma construção de um commit posterior.

## Medidas do detetor e do registo

| Medida | Resultado |
| --- | ---: |
| Páginas enumeradas pelas coleções | 115 |
| Frases portuguesas, sem repetir no mesmo estudo ou página | 767 |
| Frases inglesas, depois de afinar as marcas | 900 |
| Frases inglesas com as marcas anteriores | 647 |
| Frases detetadas nas duas línguas | 1 667 |
| Entradas bilingues geradas no registo | 22 |
| Frases por registar | 1 623 |
| Frases portuguesas com par estrutural encontrado | 600 |
| Frases portuguesas sem par encontrado | 167 |
| Falhas inglesas nos pares, antes da afinação | 80 |
| Falhas inglesas nos pares, depois da afinação | 22 |
| Linhas de suporte das entradas semeadas | 21 |
| Linhas do livro com corpo encontrado | 795 de 795 |

Todas as 22 entradas vieram de `/o-que-se-discute`, com os pares em
`/en/under-discussion`. Nenhuma foi escrita à mão. A semente não admitiu
entradas das outras rotas. Os excertos das 21 linhas de suporte foram
localizados nos corpos selados. O motor lido foi
`9cdd2328e19d0d9854a8ded6da526084d9364ca9`, pelos objetos Git.

As contagens por estudo ou página e por língua, os pendentes por língua, as
rotas lidas, as 22 falhas residuais e a amostra estão em
`medidas-adenda-a-cam2a.json`. O guião reproduzível da medição é
`scripts/medir-frases-afirmacao.mjs`, guardado no patch.

A amostra de trinta frases por língua usa a semente fixa `CAM2-A-2026-11-09`,
ordenando pelo sha256 de semente, estudo e frase. Estimei que 24/30 frases
portuguesas e 22/30 inglesas contêm uma afirmação substantiva sobre fonte,
pessoa ou causa. Isto classifica o texto, não confirma a sua verdade. Regras
genéricas de apresentação, perguntas sem resposta, rótulos e recomendações
imperativas não foram contadas. Há frases repetidas entre páginas diferentes;
a amostra não é uma estimativa de precisão independente por fonte.

## O que foi implementado e ensaiado

- Deteção sem modelo, usando o corte da camada 0 com filtro opcional e o seu texto sem selos. O filtro de voz original conserva o comportamento por omissão.
- Vinte plantas com frases reais, cinco positivas e cinco negativas por língua. Incluem `segundo` e `second` como ordinais, `segundo o relatório` como atribuição, `State and economy` e `per person` como negativos.
- Enumeração pelas coleções de estudos, edições publicadas, dossiês, explicações e entradas temáticas. Entram itens e correções, além das páginas literais documentadas no README do patch.
- Pares pelos blocos da paridade e, quando os totais divergem, pela vizinhança de três blocos da camada 0. Não é uma avaliação semântica da tradução. A cobertura é independente por língua.
- Registo bilingue, presença de cada frase, referências às linhas, citações nos excertos, paridade da presença de aspas e marca e razão das leituras. Vinte e um estragos de registo, cobertura e histórico foram recusados na versão final das plantas.
- Corpos e excertos por sha256, chamando o índice de `pacote.py`, sem copiar o índice nem alterar o pacote. O `ledger:check` ensaiado inclui a M83 inteira. Sem motor, escreve explicitamente `não leu os corpos` e `limpa=false`.
- Integração ensaiada no `verify` e no planeamento automático das partes do GitHub. Não houve corrida real do GitHub.
- Comandos próprios na aterragem para `ledger:check` e `check:frases-afirmacao`, com leitura dos ficheiros de código. As 24 plantas da ferramenta de aterragem passaram, incluindo as recusas novas antes da fusão e da publicação.

A lista inicial ficou presa pelo resumo
`376011bfe1729cde3f3ca97848c814f1fa39a4c4e72bee8d864d94c2193e0aff`.
A conferência percorre todos os commits que tocaram a lista desde a base,
compara cada lista com os pais que já conhecem a dívida e confere a árvore de
trabalho. Apanha aumentos entretanto desfeitos, reposição depois de apagar a
lista e aumentos num merge. O GitHub já fornece `fetch-depth: 0`. O caminho
local `comitar.sh` faz a conferência da lista antes de entregar o pedido ao
escrivão, mesmo com `OEDP_GATE=adiado`. A cobertura contra o `dist/` fica no
portão. Esta integração está arquivada no patch, não instalada no ramo final.

O âmbito ensaiado deixa fora os recibos, as páginas geográficas de indicadores,
o formulário e respostas de sugestões, a rota antiga `texto`, o alias de
Método e documentos arquivados datados. As exclusões e razões estão descritas
no README do patch. As páginas geográficas ficaram fora por não pertencerem
às coleções editoriais enumeradas na adenda; esta delimitação é explícita,
não uma afirmação de que essas páginas sejam incapazes de conter prosa.

## Conferências

As saídas resumidas e os códigos ficam em `conferencias-adenda-a-cam2a.json`.
As corridas extensas foram guardadas fora do repositório pelo `curto.sh`.

| Comando | Código observado |
| --- | ---: |
| `npm run check:frases-afirmacao`, com motor | 0 |
| `env -u RESEARCHHUB_DIR npm run check:frases-afirmacao` | 0, corpos não lidos |
| `npm run ledger:check`, com motor | 0 |
| `env -u RESEARCHHUB_DIR npm run ledger:check` | 0, corpos não lidos |
| `npm run check:pre-mandato` | 0 |
| `npm run typecheck` | 0 |
| `node tests/leituras/frases-afirmacao.mjs`, versão final das plantas | 0 |
| `python3 tests/leituras/corpos-ledger.py` | 0 |
| `python3 tests/leituras/ferramenta_aterrar.py` | 0 |
| `npm run check:leituras` | 1 |
| Comparação byte a byte | 1 |

O `check:leituras` recusou apenas `tests/leituras/ferramentas.py`, por restrição
da sandbox: `Error: listen EPERM: operation not permitted 127.0.0.1`. Não houve
escalada nem enfraquecimento desse teste. As restantes conferências desse
comando continuaram e terminaram; os códigos individuais ficaram no registo.

Não se iniciaram corridas autónomas de `check:paridade` e `check:voz` depois da
paragem. Ambas fazem parte do build que já estava em curso. Não se correu a
corrida inteira dos portões, nem `npm run verify`, nem capturas, nem a suite do
motor. Não se usaram ajudantes, rede ou modelos no detetor.

## Decisão que falta ao mandato

Para retomar, é necessário resolver a incompatibilidade entre acrescentar uma
conferência contada em Método e exigir essa página idêntica, e definir uma
base temporal comparável para o calendário e a leitura semanal. Também é
necessário decidir o tratamento dos metadados de `prova.json` na igualdade
estrita. Esta passagem não tomou essas decisões em nome do lugar de direção.

## Fecho da interrupção

O build terminou com código 0. A sua cadeia incluiu `check:voz` e
`check:paridade`, ambos concluídos, mas a igualdade byte a byte continuou a
falhar. O resultado do build não elimina a condição de paragem.

Depois de recolher o resultado, os ficheiros ativos alterados foram repostos
byte a byte a partir de ddf8b8edf; os guiões, plantas e ficheiros de
`ledger/frases/` novos foram retirados dos caminhos ativos. O patch conserva a
implementação exata ensaiada, incluindo o registo e a lista inicial gerados.
A aplicação inversa do patch foi conferida antes da reposição; a aplicação
normal é conferida depois. Só os cinco artefactos documentais desta adenda
seguem para commit. O `dist/` local conserva a saída do ensaio e não deve ser
tratado como uma construção da árvore após esta reposição.

Custo de execução: 14 corridas de conferências funcionais, incluindo o build,
a comparação e duas corridas preliminares; uma verificação sintática com
`node --check`; três gerações da semente. Nenhuma corrida inteira dos portões,
nenhuma captura e nenhum ajudante. As validações finais dos artefactos incluem
as somas por estudo, a classificação da amostra, a ausência de caminhos locais,
a reversibilidade do patch e a reposição dos ficheiros ativos.

Chamadas desta retoma, incluindo o pedido de commit, a recolha do resultado e
a inspeção final: 38 chamadas à ferramenta de orquestração, com 59 operações
internas de execução ou recolha. O build durou 947 segundos. O commit é
exclusivamente documental, pelo escrivão, com `OEDP_GATE=adiado`.
