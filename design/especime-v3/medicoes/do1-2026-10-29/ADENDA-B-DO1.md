# Adenda B ao mandato DO1: o portão de HTML e a página nova (29.10.2026, 14:28 UTC)

*A mesma sessão, a mesma worktree, com os 47 ficheiros por comitar. Paraste bem outra vez. O registo do `gate:html` tem duas coisas misturadas: milhares de linhas sobre cartões de partilha que a tua construção local não gerou (não é defeito do bloco: a construção inteira da casa gera `dist/cartoes/`, e os três portões pelo escrivão constroem-nos), e as falhas próprias das páginas dos dossiês, que são contratos do portão que a página nova tem de cumprir ou declarar. Esta adenda decide cada uma; o resto do mandato e da adenda A faz-se até ao fim.*

## 1 · Os cartões de partilha

Não se muda nada no portão. A construção que conta é a dos três portões pelo escrivão (`portoes-pelo-escrivao.sh`), que gera os cartões; a tua construção local serviu para as conferências dirigidas e não os gerou. Se precisares de uma construção local completa, corre a mesma sequência que o `build` da casa corre (o relatório diz qual).

## 2 · As datas editoriais nas páginas dos dossiês (FP1-e, 28 falhas)

O portão tem a lista fechada dos contextos e das origens em que uma data editorial pode aparecer. As páginas dos dossiês imprimem as datas das peças pelas mesmas origens que a primeira página e a página dos itens já declaram (`publicacao.declarada`, `escrita.declarada`, a data de um estudo pela sua origem) e a data de escrita do próprio dossiê (`escrita.declarada`). A lista ganha o contexto «dossiê» para as duas edições, só com essas origens; nenhuma outra origem entra. Uma planta: uma data com origem não declarada numa página de dossiê é recusada.

## 3 · Os valores dos resumos dos itens sem selo (12 falhas)

O portão exige que o valor de uma afirmação impresso numa página leve o selo da sua própria linha. Na primeira página o `BlocoDaDiscussao` imprime a primeira frase de cada item com os selos; na página do dossiê a mesma frase saiu sem eles. Não se afrouxa o portão: a página do dossiê imprime a frase pelo mesmo componente e com a mesma marcação da primeira página (os selos de cada valor), e o relatório mostra, para uma das frases, o HTML da primeira página e o do dossiê lado a lado, iguais no que ao selo diz respeito.

## 4 · O algarismo no cabeçalho («2027», 3 falhas)

O portão aceita algarismos no `<head>` só em títulos de estudo registados ou em exceções declaradas. Os títulos dos dois dossiês entram na lista dos títulos registados que o portão lê (a mesma onde estão os títulos dos estudos), nas duas edições, tal como o §3 do mandato os escreve. Nenhuma exceção solta.

## 5 · Os campos do calendário e das correções em rotas não autorizadas

O portão tem a lista das rotas em que os campos do calendário (`data-de-campo` das linhas de calendário) e o bloco das correções podem aparecer. A lista ganha as rotas `/dossies/<slug>/` e `/en/dossiers/<slug>/`, com uma planta (os mesmos campos numa rota fora da lista continuam recusados).

## 6 · Os dois controlos sintéticos do EO1 (`tests/discussao/itens.mjs`)

A linha «Dossiê: … →» só existe nas peças que pertencem a um dossiê. Os controlos íntegros do EO1 não pertencem a nenhum e têm de passar sem a linha: a conferência espera a linha só para os slugs que `DOSSIES` nomeia, e a sua ausência nos outros. A planta da adenda A (a linha sem o atributo) fica.

## 7 · O resto

Os commits «DO1», os três portões pelo escrivão (que geram os cartões), o relatório com os códigos lidos dos ficheiros `.codigo` e, para o §3 desta adenda, o HTML lado a lado. As mesmas condições de paragem do §5 do mandato.
