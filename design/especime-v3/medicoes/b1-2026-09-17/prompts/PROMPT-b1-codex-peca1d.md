És o construtor da primeira peça do bloco B1 do sítio O Estado do País, na passagem de correção depois da leitura a frio, nesta worktree e só nela. A leitura (Claude Opus, outra família, com cinco estragos plantados só nas cópias do pacote, todos apanhados) está em `design/especime-v3/medicoes/b1-2026-09-17/leitura-a-frio-peca1.md`: lê-a inteira. Os achados 1, 2, 3, 5 e 8 são as plantas e o 4 é um efeito do pacote; nada a corrigir neles. O lugar de direção triou o resto e decide assim; corrige cada ponto no seu commit, com os dois trailers de sempre (`Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub`), por caminhos explícitos, sem `push`:

(6) A marca da língua é simétrica: a página portuguesa marca «(em inglês)» os estudos sem edição portuguesa e a inglesa marca «(in Portuguese)» os que não têm edição inglesa; a condição compara a língua da edição com a da página.

(7) A secção «Fontes e verificação» só existe quando tem o que o rótulo promete: por linha, o valor impresso, o nome da medida, a fonte e a data da verificação, lidos do livro-razão do sítio quando a linha lá está; linhas sem recibo no sítio não se listam (nem identificadores do motor, nem valores repetidos, nem os marcadores «pdf-sem-resumo» e «raw-sem-manifesto»); um estudo sem nenhuma linha com recibo não tem a secção. A célula L6 confere a secção assim.

(9) A exclusão dos links dentro de `[data-registo-unidade]` na L1 fica só nas páginas de estudo (a rota nova), não no sítio inteiro; o relatório diz, medido, quantas páginas saíram da contagem por cada razão (porta duplicada retirada; links deixados de contar), e o teto é o número medido depois, escrito uma vez só e igual no código, no registo e no relatório.

(10) O rótulo de IA volta ao topo das páginas de estudo, uma linha só, o mesmo texto do rodapé, porque a razão escrita na célula é legal (o momento da primeira exposição) e não se retira uma proteção legal por decisão de forma; a célula volta a esperar 1 no topo das páginas de estudo e o comentário fica verdadeiro.

(11, 15, 16) Os redirecionamentos das rotas antigas deixam de ser páginas HTML: passam a redirecionamentos do servidor em `vercel.json` (código 301, as dez rotas, `/estudos/<slug>/texto/` para `/estudos/<slug>/` e o equivalente em `/en/studies/`), sem ficheiros em `dist/` para as rotas antigas; a célula do redirecionamento passa a conferir a tabela do `vercel.json` (destino existente e exato, dez entradas) e a ausência das rotas antigas em `dist/`, com uma planta que troca um destino; a canónica da página do estudo é uma só, com a convenção que o sítio já usa nas outras páginas.

(12) A recontagem dos estudos por lugar lê a página do lugar na língua da lista que confere (as duas), e falha em voz alta se não conseguir ler a página, nunca devolve zero em silêncio.

(13) A mensagem do `check:voz` conta os temas distintos conferidos, não os estudos.

(14) A fronteira entre a leitura e o texto deixa de ser o quarto título: a leitura são os títulos da lista fechada («Em resumo», «O que este projeto conclui», «O que podia funcionar melhor», e os ingleses), e uma célula confere que, quando o registo começa por «Em resumo», os três existem por esta ordem e o texto começa a seguir ao terceiro; um registo sem eles não tem leitura e a célula di-lo.

(17) A exceção das palavras proibidas na rota do estudo cobre só `[data-registo-unidade]` (o transcrito), e as cadeias do sítio dentro do artigo («Secção n de N», «Subir») voltam a ser conferidas.

(18) O relatório mostra o que afirma: a saída de `git log --format='%h %s%n%(trailers)' <base>..HEAD` para os commits e os trailers, e a tabela dos temas comparada com a de `design/especime-v3/maquetas/b1/fazer.py` copiada para o relatório.

(19, do lugar de direção, visto nas capturas) Um valor selado nunca se parte em duas linhas: os espaços dos milhares dentro do selo são inseparáveis e o selo leva `white-space: nowrap`, na leitura, no texto e nas listas.

No fim: os três portões a 0 na cabeça final, cada um no seu comando com o código em `portoes-peca1.txt`, as vinte capturas «depois» refeitas, o `LEIA-ME-peca1.md` reescrito com a passagem de correção (o que cada achado ficou, a cabeça final, o `git log` pedido), e responde com ele. Sem travessões na prosa.
