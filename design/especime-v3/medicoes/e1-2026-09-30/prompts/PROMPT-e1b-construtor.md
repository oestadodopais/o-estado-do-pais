# A passagem E1b · o mandato do lugar de direção (01.10.2026, de madrugada)

Continuas o bloco E1 nas duas worktrees e nos dois ramos `e1-2026-09-30` (o motor sobre `master`, o sítio sobre `main`), depois da entrega do construtor (`design/especime-v3/medicoes/e1-2026-09-30/RESPOSTA-construtor-e1.md` e o `LEIA-ME.md`, §6) e da revisão das quatro aberturas pelo lugar de direção. As regras do prompt inicial mantêm-se todas. O E0 aterrou em `main` (`dd7f6208`, 01.10.2026 01:32 UTC) com o mecanismo que faltava: o lugar `o-estado-do-pais` no registo das mudanças, para as linhas que medem o próprio projeto.

## As decisões do lugar de direção sobre os pontos de paragem

1. **Os dois contadores do arquivo** (`estudos-publicados`, de 13 para 17; `edicoes-publicadas`, de 18 para 25) mudam pelo mecanismo: o ramo do sítio rebaseia-se sobre `main` (`git rebase main`, no ramo ainda não publicado), e os dois contadores ganham o lugar `o-estado-do-pais` em `src/data/lugar-das-linhas.mjs` com a razão escrita, uma entrada `atualizacao` cada (a razão: quatro estudos e sete edições publicados a 01.10.2026; as edições antigas continuam alojadas e contam), seladas pelo `selar-historia-valores.mjs`; o `ensaio-2-contadores-do-arquivo.patch` serve de ponto de partida, adaptado ao mecanismo que aterrou, e o `ensaio-1` não aterra. As derivações dos dois contadores continuam a bater com os `check`.
2. **As células das tabelas** ficam com a linha do próprio estudo (o `ledger.json` de cada estudo no motor, com os recibos), como nos seis estudos antigos; a linha do sítio é para o que as páginas do sítio citam. Não se atravessam as 1 038 linhas. A medida que fizeste fica no relatório como está, com esta decisão ao lado.
3. **O 17 fica só em português** por agora, como o «Quinze Anos» e «Os Pelouros» estavam; a edição inglesa do «Quinze Anos» que o motor tem e o sítio nunca alojou fica registada como dívida no relatório (o lugar de direção abre a issue). A página inglesa do sítio mostra o documento português com a nota, como fazia com os dois antigos.
4. **O Évora 2027 (o 19) ganha a sua leitura** em `src/data/leituras.mjs`, como os outros três, para entrar no índice dos motores de busca e no mapa do sítio: a frase assenta numa frase impressa no estudo, com a origem registada, e nenhum número se escreve ali, só ids de afirmações.

## As emendas às aberturas (o lugar de direção leu as quatro; o resto fica como está)

- No 18, «Em resumo»: «Évora é uma cidade relativamente próspera numa região pobre» passa a «Évora é um concelho relativamente próspero numa região abaixo da média do país»; e os valores em prosa escrevem-se com o mesmo sinal nos quatro estudos (a forma «€576 491 544», como as outras frases do mesmo estudo e os outros estudos), e não «576 491 544 euros» numa frase e «€167 372 756» na seguinte.
- No 19, «Em resumo»: «A ano e meio de 2027» passa a «A um ano e meio de 2027»; e em «O que este projeto conclui» as frases de abertura de cada parágrafo deixam de ir a negrito, para os quatro estudos terem a mesma forma.
- No 16, «obras» passa a «projeto» onde a fonte escreve «projeto» (o achado do teu §6).
- As cópias das leituras no sítio (`src/data/leituras.mjs`) refazem-se depois das emendas, e a conferência que compara a cópia com o texto do motor corre e fica no relatório.

## O que fazes, por esta ordem

1. O rebase do ramo do sítio sobre `main`; depois os contadores (decisão 1).
2. As emendas às aberturas no motor (os `.md` e os `.html` pelo mesmo caminho dos seis, os registos e os `.cortes.json` refeitos), o portão do motor a 0, e a travessia para o sítio (`export_records_site.py` e o que mais o bloco usou), com o `check:documentos` a 0.
3. A leitura do 19 (decisão 4) e a nota de dívida do 17 (decisão 3).
4. Os três portões do sítio pela tranca (`sh scripts/leituras/portoes.sh <worktree> <pasta>`), com os códigos em ficheiro em `portoes/e1b/` e a cabeça ao lado, no estado real (sem remendos); o portão do motor na cabeça final do motor; as capturas das quatro cabeças, do índice e da página de Évora refeitas; a secção «E1b» no relatório (a tabela deste mandato, as decisões acima, os commits das duas árvores, os portões, o custo), e a resposta curta em `RESPOSTA-construtor-e1b.md`, no último commit do sítio; os códigos dos portões corridos depois do último commit entram no commit seguinte e não ficam fora dele.
5. Respondes com as cabeças finais dos dois ramos, os commits, os códigos lidos dos ficheiros e o que ficou por fazer.
