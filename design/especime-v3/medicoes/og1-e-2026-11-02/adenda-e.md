# OG1-E, adenda E: três conferências do lote 2

## Identificadores sem uso

Os seis foram retirados. Nenhuma cláusula precisou de ser reposta ou enfraquecida:

| Identificador | Conferência que conserva a função |
| --- | --- |
| sha256 em check-edicoes | conferirEdicoes e conferirHistoria leem os ficheiros e comparam os hashes; conferirTestemunhas compara também os bytes da primeira publicação no Git. |
| excecao em edicoes-conferir | A história declarada em edicoes substituiu a seleção pela data updated e por uma exceção. A lista, a ordem, os hashes e a correção de cada nova versão continuam obrigatórios. |
| primeiraEdicao em gate-html | primeiraEdicaoServida recebe a data pedida; edicoesGuardadas resolve a origem de cada versão. |
| documentoServido em gate-html | documentoDaHistoriaServido reconstrói a edição atual; a comparação integral e a prova independente dos bytes continuam a correr. Os dois comentários foram atualizados. |
| escapaParaRe em medir-defeitos | retiradaForaDaFrase chama fraseRetiradaNoTexto, que escapa a expressão e exige os mesmos limites de palavra Unicode. |
| publicacaoEd1 em publicacao-declarada | A régua compara diretamente a publicação com edition.date e a atualização com a história; conserva a faixa, a data visível e as condições do JSON-LD. |

check:mortos passou a 0: dez formas mortas detetadas, duas vivas preservadas e a planta da pasta api recusada.

## Inventário dos rótulos

A comparação pela própria régua diferencasDoDeclarado confirmou exatamente 58 chaves: as 29 linhas da habitação com unidade afirmação, nas duas línguas. Nenhuma outra diferença de ocorrência. A lista fica em adenda-e-rotulos.json. O inventário foi gerado por --escrever; check:rotulos passou a 0, com 69 plantas.

Uma primeira comparação bruta dos objetos contou também quatro formas declaradas com zero ocorrências. Pela régua existente, zero e ausência são equivalentes. O comando de escrita avançou indevidamente depois da recusa dessa comparação; repus o inventário de HEAD e só voltei a gerá-lo depois da prova das 58 diferenças pela régua. Não alterei essa régua.

## Índice

A causa era o filtro m.field em mudancasDoIndice, introduzido na adenda D. A lista já lia o registo, mas descartava as correções dos campos. O filtro saiu. As entradas de campos têm apresentação própria: nome, data, campo, valor antigo riscado, novo valor, identificação da linha e porta do recibo. As explicações e as comparações numéricas continuam reservadas às mudanças de valores, pela entrada do livro e não por uma dispensa atribuída pelo HTML.

check:indice-do-sitio passou a 0 nas duas línguas, com 26 plantas. As duas plantas indicadas no mandato voltaram a recusar apenas a alteração plantada, sem a queixa real da I6. A leitura semanal passou as 23 plantas no livro e as 71 na página. A conferência do HTML passou com os valores e as fontes conferidos.

Commits por causa: 0906ecdb (identificadores), 9baae1ba (rótulos), c2e4a92f (índice). O motor ficou intacto.

A pré-compilação do HTML terminou, mas o carimbo final recusou a mudança de cabeça causada pelos commits que correram entretanto. A construção integral posterior parte de uma cabeça limpa e estável. As falhas intermédias da voz e da semana vieram da mesma distinção entre campos e mudanças numéricas e foram corrigidas nas respetivas conferências, conservando as comparações dos campos no portão do HTML.

As primeiras corridas dirigidas do país e da voz sobre a correção final foram interrompidas pela limpeza de dist no início do build, com ENOENT. Esses códigos 1 ficam registados; o resultado relevante para o fecho é o das mesmas conferências sobre a construção integral terminada.

## Fecho e limite

O único build inteiro saiu a 1, lido de build.codigo. Parou na voz: a apresentação de campos introduzida nesta passagem deixava apenas os separadores «· : →» depois de retirar os dados conferidos. Retirei essa pontuação dispensável, mantendo os campos, o valor antigo riscado, o valor novo e a porta do recibo. A recomposição parcial terminou a 0. A voz passou depois a 0, assim como nomes, língua, formato, navegação, sinais e discussão. As três conferências pedidas foram repetidas sobre a saída final: mortos 0, rótulos 0, índice 0, com as suas plantas. Os dez códigos foram lidos de ficheiros .codigo; constam de adenda-e-conferencias.json.

Não se obteve um build integral com código 0. A corrida inteira não foi repetida, pelo limite da passagem; o código 1 original conserva-se. Nenhuma régua de números, fontes ou pessoas foi enfraquecida. A correção final da apresentação e este relatório seguem num commit adicional de fecho, depois dos três commits por causa. Não houve capturas, verify integral, publicação ou mudanças no motor.

Custo até à redação: 40 chamadas de ferramentas, 22 comandos de conferência dirigidos, um build integral, 2 pré-compilações e 3 operações do inventário. Incluem-se as falhas intermédias, enumeradas no JSON.
