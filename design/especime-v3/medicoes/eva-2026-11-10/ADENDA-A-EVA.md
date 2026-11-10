# Adenda A ao mandato EVA: as paragens decididas, a instalação e o portão (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois de ler o que a primeira passagem deixou (os dois commits do motor, as medidas, `gabaritos-paragens.json` e `divergencias.json`). A primeira passagem preparou bem e parou onde devia. Esta instala. O orçamento é o de uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, com um commit no fim de cada ponto numerado, para um corte não perder nada. O teu relatório vai para `RELATORIO-EVA-A.txt`; o lançador escreve o seu resumo noutro ficheiro, e não lhe toques.*

## O texto mudou em três sítios, por decisão deste lugar

Os dois ficheiros `TEXTO-FINAL-16.*` desta pasta já trazem as três mudanças; copia-os outra vez para o motor.

1. **As listas da cabeça deixam de ter numeração.** As oito unidades C007 a C011 e C045 a C047 passam a itens de lista (`- [C007] **…**`), nas duas línguas. O numeral era andaime, e não um número do estudo.
2. **A C027 perde a ilustração de calendário.** A frase passa a: «Um prazo médio de 137 dias é quatro meses e meio de espera.» Em inglês: «An average of 137 days is four and a half months of waiting.» Os dias 1 e 18 saem; «quatro meses e meio» é uma derivação dos 137 dias (a declarar como asserção com a conta).
3. **Na C037 inglesa,** a tradução entre parêntesis deixa de repetir o valor: «(the euros allocated to the investments)».

## O que decides tu, com a regra dita

4. **A C011 e os €575 080.** A fonte imprime −575 079,95 na coluna das diferenças negativas, e o texto diz «€770 120 de diferenças num sentido e €575 080 no outro». A linha primária leva o valor da fonte, com o sinal; o que se imprime é a sua magnitude, como derivação declarada com essa linha por componente. A prova corrige-se para o valor com sinal. Nada no texto muda.

5. **As datas escritas por extenso.** «10 de agosto de 2026» aparece em onze unidades e vem de registos guardados (`generated` e `fetched_at` dos JSON de extração do 07 e do 08), e não de uma página de PDF. O motor passa a ter datas declaradas: cada uma com o valor ISO, a fonte (um documento alojado com a página, ou um registo JSON seguido pelo git, com o resumo sha256 do ficheiro, o caminho da chave e o valor lido) e a forma impressa por língua gerada da data, nunca escrita à mão («10 de agosto de 2026», «10 August 2026»). Um marcador próprio resolve nelas. Plantas, cada uma a recusar pelo seu motivo: a data impressa diferente da declarada; a data declarada que o registo não tem na chave dita; o resumo do registo que não bate; um dia escrito à mão ao lado de um mês. As outras datas por extenso do texto (por exemplo «31 de outubro», «31 de dezembro de 2026», «1 de janeiro de 2014») resolvem pela mesma forma se hoje não tiverem ligação, cada uma com a sua fonte; as que já compõem ficam como estão. As quatro datas ISO do corpo ficam como o texto as tem.

6. **A B105.2 inglesa** (dois valores com cêntimos): as duas linhas levam a forma impressa por língua. Se a forma não existir para essas linhas, diz porquê e pára só nessa unidade.

## A instalação

7. **Os ajustes e os dois gabaritos candidatos passam a ativos** quando as 502 unidades de cada língua compõem e conferem letra por letra com o texto desta pasta (`core.texto_julgado`), e só então. Um contrato que diga `candidato_incompleto` nunca se instala.

8. **As asserções** refazem-se sobre o texto instalado, nas duas edições: nenhuma por declarar, nenhuma falhada, nenhuma frase tirada do alcance do detetor.

9. **A cadeia do estudo:** o HTML, o registo, o manifesto, os cortes, as contagens de `core/gate_baselines.json` e dos testes que as fixam, com a razão de cada número que muda.

10. **Os outros estudos byte a byte,** com os resumos.

## As mudanças que fizeste ao núcleo

A primeira passagem mexeu em `core/compor.py`, `core/linhas_proprias.py` e `core/reconcile.py`, que protegem números. No relatório, para cada mudança ao núcleo (as da primeira passagem e as desta): o que a regra recusava antes, o que aceita agora, porquê o conteúdo o pede, e a planta que prova que continua a recusar o que deve. Uma mudança que alargue o que o compositor aceita sem uma planta do outro lado desfaz-se.

## A prova

As suites que tocas, pelos seus comandos. O `core.gate` corre uma vez, no fim, pelo `curto.sh`, lançado quando faltarem pelo menos trinta minutos ao teto (leva cerca de dezasseis); se não houver esse tempo, não o lances: diz que ficou por correr, e este lugar corre-o. O relatório cita o código e as últimas linhas do portão, copiadas do registo.

## O relatório

Em `RELATORIO-EVA-A.txt` nesta pasta, sem caminhos da máquina: ponto a ponto, o que ficou feito, a planta e o que deu; as mudanças ao núcleo como a secção acima pede; as unidades que ainda pararem e porquê; as contagens que mudaram. As tuas medidas vão para `medidas-do-construtor-eva-a.json`, e não para `medidas-eva.json`. Os commits com o assunto a começar por `EVA`.

## Quando paras

Num número, numa fonte ou numa pessoa: uma data ou um valor que a fonte não tem onde a prova diz; uma frase que só componha mudando o que diz. Páras nessa unidade, dizes qual, e fazes as outras. Para tudo o resto: deixa, diz e continua.

## O fim

A prova acima e o relatório. Cento e cinquenta minutos, duzentas e quarenta chamadas. A ordem, se o tempo não chegar: os pontos 4 a 6, depois o 7 para a edição portuguesa e para a inglesa, depois o 8, o 9 e o 10, e por fim o portão.
