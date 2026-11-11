# Adenda B do EVB: a cauda das provas e a instalação do texto julgado (11.11.2026)

Acrescenta: nada
Medidas: medidas-evb-b.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do motor `evb-2026-11-11`, sobre a cabeça `63514b6`; a segunda pasta com escrita é a worktree do sítio `evb-2026-11-11`, só para esta pasta. Lê primeiro o teu `LEIA-ME-A.md`. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-B.txt`, nesta pasta, curto; as tuas medidas, para `medidas-do-construtor-evb-b.json`.*

## Porquê

A adenda A conferiu as provas e as citações e classificou os algarismos. Ficou uma cauda: datas do quadro da cronologia e das leituras, a segunda ocorrência de algumas medidas, somas e contagens feitas no texto, e números dentro de citações. Esta adenda entrega a prova de cada uma, e pede a instalação.

## §0 O que se mediu

1. **O que ficou da adenda A.** Por resolver, 109 ocorrências em português e 131 em inglês, em 56 unidades; 59 datas completas sem prova ligada; 252 citações conferidas.
2. **O que este lugar entrega.** `PROVAS-complementares-2.json` tem 299 entradas, uma por ocorrência das tuas duas listas: 139 em português e 160 em inglês; 111 das portuguesas são datas ou pedaços de datas. As provas distintas são 43, e 37 conferem no teu leitor. As outras seis são datas que a fonte escreve numa forma que a tua régua das datas não lê. `LEITURAS-NA-IMAGEM.json` tem 9 leituras.

## O que recebes de novo (nesta pasta)

- `PROVAS-complementares-2.json`: uma entrada por ocorrência das tuas duas listas (`ocorrencias-por-classificar.json` e `datas-adenda-paragens.json`), com a língua, a unidade, a posição e o valor, a classe e a prova na forma das tuas réguas. Cada excerto foi conferido com `core.documentos_alojados` nesta worktree antes de chegar aqui.

## O que fazes

1. **A cauda, pela prova de cada ocorrência.** As classes do ficheiro: a data completa, com o documento, a página e o excerto onde a fonte a escreve, ou com o registo das descargas quando é uma data de leitura; a data parcial (um dia e um mês que a frase reconta), com o excerto da fonte; o número dentro de uma citação da mesma unidade, que resolve pela citação e tem de estar no excerto dela; a mesma medida já ligada noutra ocorrência, que usa a mesma linha; o transcrito e o derivado, como antes. Confere cada prova pelas tuas réguas; o que não passar, pára nessa unidade e dizes porquê. Três notas:
   - A régua das datas passa a ler as formas em que estas fontes escrevem uma data, sem adivinhar nenhuma parte: um intervalo de dias no mesmo mês (`8-11 March 2022`, `5-7 December 2022`, `6 e 7 de fevereiro de 2026`), o dia, o mês e o ano com hífenes (`27-03-2025`), e a data no nome de um ficheiro que o endereço do pedido traz (`31MAR26`, `30_junho_2026`), esta só pelo registo do pedido. Uma planta por forma: outro dia, outro mês ou outro ano recusa.
   - A ocorrência da unidade `C007` que as tuas listas dão como a data completa de 30 de junho é um erro do detetor: os algarismos são o fim do nome do programa regional, e a frase só escreve o mês e o ano. O ficheiro di-lo; corrige o detetor, com a planta.
   - A data da abertura na unidade `C044` usa o mesmo marcador das unidades `C004` e `C050`, por decisão deste lugar, escrita no ficheiro: é o mesmo acontecimento e a mesma data, e a fonte é a que já ligaste. Plantas: um número dentro de uma citação que o excerto da citação não tenha recusa; uma data presa a um excerto com outro ano recusa; uma segunda ocorrência ligada a uma linha de outro documento recusa.

2. **As duas edições, unidade a unidade.** As duas edições imprimem os mesmos números em cada unidade. A ocorrência inglesa herda a classe e a ligação da ocorrência portuguesa do mesmo valor na mesma unidade, pela ordem; o classificador deixa de depender das palavras inglesas à volta. O que o inglês tem a mais são os números dentro da tradução entre parêntesis de uma citação portuguesa (e o português, os da tradução de uma citação inglesa): classe nova, a tradução de uma citação, que só vale logo a seguir a uma citação resolvida da mesma unidade e com os mesmos números que ela. Plantas: um número na tradução que a citação não tenha recusa; uma ocorrência inglesa sem par na portuguesa e fora de uma tradução recusa.

3. **As atribuições.** A régua passa a olhar só para as ocorrências ligadas a uma linha, pela posição: um ordinal, um ano ou uma página não são medidas de ninguém e deixam de dar aviso. A derivação da soma do que as contas declaram recebido do protocolo leva a atribuição das suas parcelas, que são todas das contas da associação. Os avisos de proximidade que ficarem declaram-se com a identidade do caso e a razão; os três da unidade `N21.2` e o do título, com as razões que escreveste no relatório da adenda A, que este lugar leu e aceita. Um aviso novo, que não estava nesse relatório, não se declara: lista-se.

4. **A instalação.** Como o ponto 7 da adenda A: com as duas edições a conferir contra o texto julgado, o contrato deixa de ser candidato, a cadeia do estudo 19 regenera-se e as contagens mudam pela medição, cada uma com a razão. Se ficarem unidades paradas, não instales uma parte.

5. **Os outros estudos não mudam,** com os resumos.

## O que fica como está, por decisão

O texto, os nomes, a forma dos números na edição inglesa. Não ajustas um excerto recebido para passar.

## A prova

As suites que tocares; o conferidor do texto julgado nas duas edições; o `core.gate` uma vez, no fim, com o registo nesta pasta (`evb-b-gate.log` e `.codigo`), sem caminhos da máquina nem a estrutura das pastas locais; os registos dirigidos em `evb-b-conferencias`.

## Quando paras

Num número, numa fonte ou numa pessoa. Para tudo o resto: decide, anota e continua.

## O fim

O relatório curto: ponto a ponto, as plantas, as unidades que pararam, os avisos novos, as contagens que mudaram, os códigos, e se o estudo ficou instalado.
