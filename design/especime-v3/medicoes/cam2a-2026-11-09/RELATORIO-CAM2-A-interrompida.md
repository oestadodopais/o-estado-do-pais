# CAM2-A: passagem interrompida pelo teto das por registar

A CAM2-A não está concluída. O primeiro ensaio da semente encontrou 1 522 frases por registar, acima das 1 500 que o §2 do mandato fixa como condição de paragem. O gerador saiu com código 2 antes de criar o destino. Não foi criada a pasta `ledger/frases/` nem ligada qualquer conferência nova ao `package.json`, ao portão ou à aterragem.

O protótipo ficou em `CAM2-A-interrompida.patch`, para inspeção e eventual continuação autorizada. Os três guiões existentes que tinham sido alterados foram repostos byte a byte a partir de `HEAD`; os cinco guiões novos foram retirados dos caminhos ativos. O patch não é uma implementação validada e não deve ser integrado como trabalho concluído.

## Medidas do ensaio

As contagens por estudo ou página e por língua estão na chave `ensaio-construtor-interrompido` de `medidas-cam2a.json`. As medidas anteriores do lugar de direção foram conservadas.

| Medida | Resultado |
| --- | ---: |
| Páginas lidas pelo protótipo | 77 |
| Frases portuguesas, uma vez por estudo ou página | 641 |
| Frases inglesas antes de afinar as marcas | 471 |
| Frases inglesas depois de afinar as marcas | 881 |
| Frases candidatas depois da afinação | 1 522 |
| Entradas admitidas pela semente | 0 |
| Por registar no ensaio | 1 522 |
| Frases portuguesas com par identificado | 383 |
| Frases portuguesas sem par identificado | 258 |
| Falhas inglesas nos pares, antes | 63 |
| Falhas inglesas nos pares, depois | 6 |
| Linhas com corpo encontrado pelo sha256 | 795 de 795 |

Os tipos sobrepõem-se: em português, 465 atribuições, 134 causas e 63 leituras; em inglês, 774 atribuições, 111 causas e 33 leituras. Não se somam como frases distintas.

### Porque ultrapassou o teto

A afinação inglesa acrescentou aspas direitas, variantes de verbos, as formas `per`, `reported`, `told` e `second`, e as marcas portuguesas para excertos conservados em português na edição inglesa. O detetor português da AUD1 inclui `segundo`, também quando é ordinal. O ensaio passou de 471 para 881 frases inglesas. Estas marcas ainda não têm plantas e a sua precisão não foi validada; a contagem não prova que sejam todas afirmações substantivas.

A semente não compensou esse aumento. Das 252 frases portuguesas com uma citação angular de pelo menos doze carateres, nenhuma foi reconhecida pelo protótipo num parágrafo que citasse uma única linha `afirmacao: true`. O livro carregado contém 92 dessas linhas; 270 frases, entre as duas línguas, têm alguma linha ligada ao bloco. Não se estabeleceu que a ausência de semente seja uma propriedade do conteúdo, em vez de uma limitação da extração. A paragem impede usar este resultado como prova de que não há frases semeáveis.

Não se retiraram marcas para caber no teto. As contagens diferem do §0 porque o protótipo usa o corte da camada 0, retira selos, inclui títulos e outros blocos da paridade e acrescenta o tipo `leitura`. Não constituem uma repetição da medição original.

## O que ficou incompleto

- Deteção: sem plantas; o âmbito dos temas precisa de revisão, pois as entradas temáticas atuais têm rotas próprias, fora de `/temas/`.
- Pares: o protótipo só alinha quando coincidem os totais de blocos e de frases. As 258 frases sem par não contam como sucesso do detetor. As seis falhas restantes estão nas medidas.
- Registo e cobertura: nenhum registo nem lista inicial escritos. O verificador não é executável como conferência final, pois o resumo da semente ainda está por preencher.
- Redução da lista: apenas desenhada no protótipo. Percorreria os commits que tocaram a lista desde a base e compararia cada lista com a de cada pai, incluindo aumentos entretanto desfeitos; recusaria histórico superficial e conferiria também a árvore de trabalho. A lista inicial ficaria presa por sha256. O GitHub já usa `fetch-depth: 0`, mas a integração e as plantas não foram feitas. Não há garantia nova instalada.
- Corpos: o protótipo chama `indice_dos_corpos` de `pacote.py`, sem copiar o índice, e completa-o com as edições arquivadas do Git do sítio. A conferência real encontrou 795 de 795. Faltam a planta, a corrida sem motor e a integração no `ledger:check` e na aterragem. O pacote ativo não mudou.
- Excertos, citações e leituras: verificadores esboçados, sem plantas nem validação de ponta a ponta.
- Fecho: não foram executados `check:frases-afirmacao`, `ledger:check` sem motor, `check:pre-mandato` nem `typecheck` como conferências finais. Não houve corrida inteira dos portões nem capturas.
- A comparação byte a byte das páginas contra um `dist/` de f362f5ccd não foi feita. Nenhum ficheiro de conteúdo do leitor foi alterado, mas isso não substitui a comparação pedida.

## Comandos e resultados

- `sh scripts/leituras/curto.sh <temporario>/cam2a-build-base.log npm run build`: construção inicial de 0ef18d8f3, iniciada antes do protótipo; resultado registado no fecho abaixo.
- `sh scripts/leituras/curto.sh <temporario>/cam2a-corpos-inicial.log node scripts/corpos-ledger.mjs`: código 0, com `RESEARCHHUB_DIR`; `M83: corpos lidos; 795/795 linhas; limpa=true; recusas=0`. Esta é uma conferência do protótipo, não o `ledger:check` ampliado.
- `node scripts/gerar-frases-afirmacao.mjs dist <temporario>/cam2a-semente-ensaio <temporario>/cam2a-semente-ensaio-medidas.json`: código 2; `PAROU: lista acima de 1500`; 1 522 frases, zero entradas admitidas, 1 522 por registar.
- As medições auxiliares importaram `lerPaginas`, `inventario`, `medirPares`, `semear` e `medidas` do protótipo. Os resultados por estudo estão no JSON, sem caminhos locais.
- `git diff --stat f362f5ccd HEAD`: antes desta passagem, apenas sete ficheiros de mandato, medidas, fila e plano diferiam da base. Não foi tomado como prova de igualdade do HTML.

O patch guarda o código exato que produziu estes ensaios. A medição da semente pode ser repetida depois de aplicar o patch numa árvore de ensaio com um `dist/` construído; não se deve aplicar o patch por cima de alterações posteriores sem revisão.

## Fecho da interrupção

- Construção inicial: código 0, 737 segundos. A cadeia do build inclui `ledger:check` com o motor, `check:paridade` e `check:voz`, que terminaram com sucesso nessa corrida. Não foram repetidas como conferências finais de uma implementação concluída.
- Reposição dos guiões ativos, conservação das medidas anteriores, somas por estudo, ausência de caminhos locais nos três artefactos e `git diff --check`: código 0.
- Uma tentativa de inspecionar processos foi recusada pela sandbox: `zsh:1: operation not permitted: ps`. Não houve escalada. O código do build foi recolhido pela sessão original da ferramenta.
- Corridas: um build inteiro, uma conferência M83 do protótipo, um ensaio da semente recusado pelo teto e cinco leituras auxiliares do inventário. Zero corridas de `portoes-pelo-escrivao.sh`, zero capturas. A validação documental dos artefactos foi feita antes do pedido de commit.
- Chamadas da passagem, incluindo o pedido de commit e a inspeção final: 25 chamadas à ferramenta de orquestração, com 37 operações internas de execução ou recolha. Nenhum ajudante.
- Commit documental pedido pelo escrivão com assunto `CAM2-A` e `OEDP_GATE=adiado`. O resultado do commit é inspecionado depois do pedido e comunicado na resposta final.
