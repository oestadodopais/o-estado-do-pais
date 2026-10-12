És um consultor de conteúdo e de forma para O Estado do País, um observatório de Portugal escrito, conferido e atualizado por sistemas de IA sob uma política publicada (`https://oestadodopaís.pt`, edições em português e em inglês). O sítio mostra os números oficiais do país, das regiões e dos 308 concelhos, cada número com a sua fonte, o seu excerto literal, a data de acesso e um recibo. Hoje é 28.09.2026.

## A decisão do diretor de hoje, e o que a provocou

Duas avaliações de fora, de 27.09.2026, estão nesta pasta (`avaliacao-de-fora-opus-2026-09-27.txt` e `avaliacao-de-fora-astra-2026-09-27.txt`): as duas dizem que o sítio é uma lista muito bem fundamentada de números soltos, sem camada onde os números se encontram, e que um leitor comum não tira nada dele. Amigos do diretor que leram o sítio acharam o mesmo: «it's just too much, too difficult to make sense out of it». O diretor decidiu hoje (a §1.133 do registo do projeto), nas palavras dele: «the web page and the website it's for a normal reader first, friendly, and then if someone with some expertise want to dig in within our data they should have layers to do so, but the first contact with the web page should be something that is actually insightful and brings real content to the readers that is absolutely based on the data and the content we have»; «find the visual ways to present them instead of just numbers, because just numbers gets really abstract and it's hard to follow»; «the idea is to have a constant update live, or as much as we can».

E acrescentou, sobre a União Europeia: «it's always nice to have a reference from the EU, the average, but in some cases would be interesting to have the best performer and the worst, even within the EU, so we can compare and assess where do we fit»; e perguntou: «which else kind of content do you think we could extract from what we have, and how could it be presented».

## O que o projeto tem

O inventário do livro-razão está em `inventario.txt` nesta pasta: 3 009 linhas seladas; as famílias nacionais e regionais (a fonte, o conjunto ou o indicador, a unidade, os períodos, se há linha da União); as oito medidas dos 308 concelhos; os estudos. Os valores exatos de cada linha estão em `~/Instruments/OEstadoDoPais/ledger/claims/<id>.yml` (campos `value`, `unit`, `reference_date`, `source_url`, `excerpt`), que podes ler e não podes mudar. O que o sítio ainda não tem: séries (cada família nacional tem hoje o ano, o anterior e, onde diz «UE sim», a média da União; o bloco das séries está em preparação), gráficos de linhas, e os valores dos 27 países (as linhas da União são só o agregado `EU27_2020`). O estudo «Evolução de Portugal desde 1981» (PORDATA, sete pontos no tempo, 81 indicadores) tem um explorador com cruzamentos que a avaliação do Opus chama o ativo escondido.

## As regras que não mudam

1. Só fontes oficiais (o INE, o Eurostat, a Segurança Social, o GEP e a DGCP do MTSSS, a CGA, o Banco de Portugal, a DGEG, a ERSE, a DGAL, o Diário da República, o Conselho das Finanças Públicas, a Comissão Europeia). Cada número leva fonte, excerto literal, data de acesso e recibo. Nada se estima; a ausência diz-se.
2. Um número derivado (um rácio, uma diferença, um índice) só existe como linha com a aritmética declarada sobre linhas seladas.
3. Só se põem lado a lado números que a fonte permite comparar: o mesmo período, a mesma definição, a mesma população, a mesma unidade; a falácia ecológica e as quebras de comparabilidade são o risco número um.
4. A cor só onde há valor de referência publicado; «melhor» e «pior» só quando uma fonte julga (os valores de referência da Comissão, por exemplo); sem isso diz-se «o valor mais alto» e «o mais baixo», e o leitor julga.
5. Cada conteúdo diz o que significa para uma pessoa sem conhecimento do assunto, em palavras correntes, ou não está acabado.
6. Prosa em português europeu, sem travessões.

## O que te peço

Um memorando em português, sem travessões, com estas seis secções e nada mais. Os números que escreveres vêm só das linhas do livro-razão (diz o identificador da linha ao lado de cada um) ou de uma página oficial que leias hoje (diz o endereço e a data). O que não conseguires confirmar leva `[verify]`.

1. **Os achados que os dados do projeto já sustentam hoje.** Pelo menos dez, por ordem de valor para um leitor comum. Para cada um: a pergunta em palavras correntes; a forma do achado numa frase, com os números das linhas; as linhas que usa (os identificadores); porque é uma comparação honesta (o mesmo período, a mesma definição) ou o que a impede; o desenho que o mostra (um esboço em texto a 390 px e a 1 280 px); e a ressalva que o leitor precisa.
2. **A União como régua.** Onde a média basta; onde o melhor e o pior dos 27 importam, e o que «melhor» quer dizer em cada caso (a regra 4); que dados isso pede (os conjuntos do Eurostat que o projeto já usa, pedidos para todos os países: faz um pedido de exemplo à API de disseminação, diz o endereço, a hora e se os 27 valores vêm na resposta); o desenho de «onde Portugal fica» entre os 27; e as armadilhas (o Luxemburgo e a Irlanda nas medidas do tipo PIB, países em falta, anos diferentes, valores provisórios).
3. **Os concelhos.** O que as oito medidas permitem (por habitante com a população, entre concelhos de tamanho parecido, o mapa com uma medida, a posição entre pares sem ranking) e o que não permitem; o desenho.
4. **A primeira página «O que se passa»**, com os dados de hoje: que três a cinco achados, por que ordem, o esboço a 390 px e a 1 280 px, o que se atualiza sozinho quando uma linha muda, e as entradas por pergunta da vida («O meu dinheiro», «A minha casa», «A minha saúde», «A minha terra», «O Estado»), com o que cada uma pode mostrar hoje e o que ainda não pode.
5. **O que espera dados novos ou um estudo.** O que pede as séries; o que pede os 27 países; o que pede documentos (o salário mínimo e quem o ganha, as faturas da energia, os combustíveis em euros, a prestação da casa); o que pede um estudo com pré-registo (uma pergunta, um método fixado antes de ver os dados, uma condição de matar).
6. **Os riscos e as recusas.** As relações que parecem boas e não são honestas com estes dados (períodos diferentes, bruto e líquido, média e mediana, o PIB lido como rendimento, a pensão média contra a linha de pobreza, os concelhos pequenos), e porquê.

Escreve o memorando inteiro num só ficheiro Markdown chamado `MEMORANDO.md` nesta pasta, e nada mais fora dela. Assina com o nome do modelo que és e a data.
