# Adenda C ao mandato EVA: as correções da leitura a frio (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da leitura a frio do bloco pelo Claude Opus 5.5 (`leitor`), que apanhou as cinco plantas do pacote e deixou os achados reais abaixo. Cada ponto diz o defeito, onde está e o que este lugar decidiu. O texto julgado não muda. Orçamento de uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, um commit no fim de cada ponto. O teu relatório vai para `RELATORIO-EVA-C.txt`.*

## O que corriges

1. **Duas citações não têm um excerto guardado que contenha as suas palavras.** A C037 imprime «os 7.470.000,00 euros alocados aos investimentos», e o excerto da linha acaba em «…euros alocados aos». A C038 imprime «as receitas arrecadadas permitem cobrir as despesas realizadas» e não tem prova nenhuma. Este lugar conferiu as duas nas cópias das fontes: a primeira está na página 38 do plano de 2026 («…destacam-se os 7.470.000,00 euros alocados aos investimentos integrados na realização da iniciativa…»), a segunda na página 130 da Prestação de Contas 2025 («Em 2025, à semelhança dos anos anteriores, as receitas arrecadadas permitem cobrir as despesas realizadas»). O excerto da primeira estende-se até incluir «investimentos»; a segunda ganha a sua prova, conferida no PDF alojado. E a regra passa a existir para todas: cada citação entre «» do texto instalado resolve num excerto guardado, com o documento e a página, que contém as suas palavras letra por letra (com a normalização de espaços que o motor já usa para excertos). Uma régua confere-o nas duas edições, com plantas: uma palavra trocada dentro de uma citação recusa; uma citação sem excerto recusa. As citações que hoje não tiverem excerto dizem-se no relatório, uma a uma, e ganham-no nesta passagem se a página estiver nos PDF alojados.

2. **A isenção dos dias das datas é por valor e fica escrita no livro.** Depois de um marcador de data ser usado, o compositor ignora qualquer ocorrência com o valor do dia ou do ano gerados, venha de onde vier, e acrescenta esse valor à lista `ignore` do livro, que outros estudos herdam. Passa a isentar só os algarismos que o próprio marcador gerou, pela posição, e nada entra em `ignore` por causa de uma data. Plantas: com um marcador de data usado, um «10» solto noutra unidade continua a recusar; a lista `ignore` do livro não ganha o dia nem o ano. E o dia de uma data não fica com o selo de uma quantidade: hoje o «10» de «10 de agosto de 2026» bate com a linha `wf-2023-info` e é atribuído à DGAL.

3. **As outras datas por extenso passam à mesma forma.** «31 de dezembro de 2026», «31 de outubro», «31 de dezembro de 2025» e «1 de janeiro de 2014» resolvem hoje em linhas próprias cujo valor é o dia. Passam a datas declaradas, cada uma com a sua fonte, como a adenda A dizia.

4. **As contagens de atribuição do estudo 16 subiram de zero e só a contagem fica presa.** Em `core/gate_baselines.json` os quatro documentos do 16 passaram a admitir sete ou oito atribuições erradas e três ou quatro valores sem atribuição, e `atribuicoes-declaradas.json` tem as razões vazias e ninguém o lê. Cada caso resolve-se: ou deixa de existir (o ponto 2 tira os das datas), ou fica declarado um a um, com a unidade, o valor, a linha e a razão, e o portão confere a identidade de cada um, e não a contagem. Planta: outra atribuição errada com a mesma contagem recusa. O que não tiver razão que se possa escrever não se declara: diz-se no relatório.

5. **O quadro «As afirmações e as fontes» tem a linha separadora duplicada nas duas edições,** e a normalização do conferidor esconde-o. O gerador deixa de acrescentar a segunda. O conferidor passa a comparar também a estrutura dos quadros: o número de linhas separadoras de cada quadro e a sua posição. Planta: uma separadora a mais recusa.

6. **O conferidor do texto julgado fecha onde hoje abre.** Um manifesto com uma só língua recusa. A conferência corre para todo o estudo que tenha gabaritos gerados de um texto julgado, e a falta do contrato recusa, em vez de saltar. Plantas das duas.

7. **Os títulos dos documentos.** Trinta e uma linhas próprias levam no título da fonte «(título por confirmar no documento)». O título confere-se na capa ou na primeira página com texto de cada PDF alojado, por guião, com a página e o excerto, e a linha leva-o como o documento o escreve. Onde a capa não tiver texto legível, pára nesse documento e diz qual: este lugar lê a imagem. Nenhuma linha fica com a marca.

8. **Os campos de texto das linhas dizem a medida, e não o andaime.** As derivações e quinze campos `medida` leem «Cabeça C011, …» ou «Cabeça C0xx, <excerto>». Passam a dizer o que o número mede, com as palavras das provas (`PROVAS-da-cabeca-v4.json` e `PROVAS-do-corpo.json` têm a medida de cada um). Nenhum identificador de unidade (`C0…`, `B…`, `N…`) fica num campo que um recibo possa imprimir; uma régua confere-o, com planta.

9. **A prova da adaga** compara o documento de cada linha com adaga com o plano de 2026 pela identidade do documento (o resumo ou o nome do ficheiro), e não por «2026» no endereço, que a Prestação de Contas de 2025 também tem. Planta: uma adaga num valor da Prestação de Contas recusa.

10. **O título do HTML** volta a ser a manchete do estudo. O 137 que ela leva conta-se uma vez pela regra que o contador já tem para o título e a manchete, ou por uma declaração explícita dessa multiplicidade, e não mudando o que o leitor vê no separador.

11. **Menores, no mesmo passo:** a asserção de «quase metade» fica limitada dos dois lados; as quatro declarações antigas `e1-*` cujas citações já não estão em nenhuma edição saem; a forma decimal com ponto depois de milhares com espaço só se aceita na edição inglesa (com planta numa edição portuguesa).

## O que fica como está, por decisão

- Os PDF fora do pacote da leitura: o motor confere cada excerto na página do PDF alojado, e os corpos entram no pacote da travessia para o sítio, onde a regra os exige.
- A regra de que uma forma impressa de uma derivação representa o mesmo valor, a unicidade do excerto curto, o resumo obrigatório das datas, a identidade dos marcadores e a ordem das unidades: eram as cinco plantas da leitura, e o código da cabeça tem-nas certas. Confirma-o no relatório com as plantas que já existem, citando o teste de cada uma.

## A prova

As suites que tocas, pelos seus comandos; `core.texto_julgado` nas duas edições (as 502 unidades continuam a conferir); os outros cinco estudos byte a byte; o `core.gate` uma vez, no fim, pelo `curto.sh`. O relatório cita o código e as últimas linhas do portão, copiadas do registo.

## Quando paras

Num número, numa fonte ou numa pessoa: uma citação cujas palavras não estejam na página; um título que o PDF não mostre; uma atribuição sem razão que se possa escrever. Páras nesse caso, dizes qual, e fazes os outros. Para tudo o resto: deixa, diz e continua.

## O fim

Os onze pontos, a prova e o relatório. Cento e cinquenta minutos, duzentas e quarenta chamadas.
