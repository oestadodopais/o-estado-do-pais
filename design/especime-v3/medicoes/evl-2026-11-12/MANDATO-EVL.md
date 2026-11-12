# Mandato EVL: o cartão do estudo de Évora 2027 com as duas medidas da manchete (12.11.2026)

Acrescenta: linhas e frases
Medidas: medidas-evl.json
Frases: frases-evl.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede. A worktree de arranque é a do sítio `evl-2026-11-12` (do `main` `7000c5448`); a outra pasta com escrita é a worktree do motor `evl-2026-11-12` (do `master` `71df7b3`). Uma construção normal: setenta e cinco minutos e cento e vinte chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVL`, em cada repositório. O teu relatório vai para `RELATORIO-EVL.txt`, nesta pasta (não na raiz), curto; as tuas medidas, para `medidas-do-construtor-evl.json`. Não corras o `build` inteiro nem as conferências que precisam do navegador se a sandbox as recusar: diz quais ficaram, e este lugar corre-as.*

## Porquê

O estudo de Évora 2027 aterrou a 12.11.2026 com o texto julgado. O cartão do estudo, que se lê sozinho na página de entrada, na lista dos estudos e na página do concelho, começa por `A associação escreve que reabriu` e não diz qual é a associação nem quanto dinheiro está em causa (a questão EVB-18). O cartão que um editor imprimia leva os dois números da manchete. O sítio só imprime um número que resolva numa linha do seu livro, e este estudo ainda não tem nenhuma: as suas linhas vivem no livro do motor. Este bloco traz cinco linhas do motor para o livro do sítio, pelo caminho que as linhas dos outros estudos de Évora já usam, e põe duas delas no cartão.

## §0 O que se mediu (12.11.2026, no `master` `71df7b3` do motor e no `main` `7000c5448` do sítio)

1. **As cinco linhas no livro do estudo 19 do motor.** `painel-transferido` vale 34 (milhões de euros; o segundo relatório de monitorização do painel, página 8). `evb-ln001-parcela-1` vale `2000000`, `evb-ln001-parcela-2` vale `3750000` e `evb-ln001-parcela-3` vale `3920000` (as contas de 2025 da associação, páginas 72, 57 e 57). `evb-ln001` é a derivação das três, arredondada a uma casa em milhões: `9.7`; a soma exata é `9670000`.
2. **Os excertos, conferidos por este lugar com `core.documentos_alojados` na worktree do motor,** cada um inteiro e único na sua página e com o número achado: os quatro que o ponto 1 do que fazes escreve.
3. **A linha `painel-transferido` não tem o campo `document`:** é uma linha antiga, com a página dita dentro do excerto. O documento está alojado desde ontem na pasta `source/` do estudo.
4. **A travessia de Évora** (`publisher/manifest.evora.json`) tem 70 linhas, nenhuma do estudo 19 (zero). O livro do sítio tem `4161` linhas.

Outras medidas da mesma coisa, e porque diferem. Para o dinheiro do Estado há quatro números publicados que não são o mesmo. Os 34 milhões são o que o relatório de progresso de Évora 2027 dava como já transferido em junho de 2025, pelo resumo que o painel faz dele; é também o valor que a Câmara anunciou para a parte do Estado no protocolo de 2023. Os 9,7 milhões são a soma do que as contas da associação declaram recebido desse protocolo até ao fim de 2025. Fora dessa soma, as mesmas contas declaram mais 1,5 milhões pagos em 2025 para a Linha do Vagar, um reforço que não é do protocolo. E o quadro de compromissos das contas dá 30,9 milhões como contratualizados ou aprovados, que são compromissos e não recebimentos. O cartão imprime os dois primeiros, com os nomes que os distinguem.

## O que fazes

1. **No motor: as cinco linhas atravessam.** Em `publisher/manifest.evora.json`, cinco entradas novas do estudo 19, na forma das entradas do estudo 16 (a linha irmã no sítio é `evora-prazo-medio-de-pagamento-2025`; a derivada irmã é `evora-indice-de-divida-2024`). A linha `painel-transferido` ganha no livro do estudo o campo `document` (o título que o motor já prova para esse PDF, o resumo do corpo alojado e a página), sem mudar o valor. Os identificadores no sítio, a unidade, a página e o excerto de cada uma:

   - `evora-2027-transferido-no-relato-ao-painel-2025`, de `painel-transferido`: milhões de euros; página 8; o excerto

   `do Alentejo Central. €34 million has been transferred to the Association already,`

   - `evora-2027-contribuicao-inicial-do-estado-2024`, de `evb-ln001-parcela-1`: euros; página 72; o excerto vai de `no valor de € 2.000.000 a pagar em 2024` até `procedeu-se à reclassificação do montante recebido`, contíguo, como a página o tem;

   - `evora-2027-pago-pela-cultura-2025`, de `evb-ln001-parcela-2`: euros; página 57; o excerto

   `contratualizados. Pago 3.750.000€ durante o ano de 2025`

   - `evora-2027-pago-pelo-turismo-2025`, de `evb-ln001-parcela-3`: euros; página 57; o excerto

   `contratualizados. Pago 3.920.000€ durante o ano de 2025`

   - `evora-2027-recebido-do-protocolo-ate-2025`, derivada das três anteriores: milhões de euros, com a conta do motor (a soma a dividir por um milhão, a uma casa).

   Os dois excertos da página 57 têm de ficar únicos na página: se «contratualizados.» os tornar ambíguos, alarga cada um para trás até ao nome da entidade que paga, sem saltar texto. O exportador das linhas corre com `--site` na worktree do sítio e `--write`; fica só o que é destas cinco linhas (os cinco ficheiros, os quatro recortes das páginas, as entradas do cruzamento); o que mais ele tocar volta ao que estava, e dizes o quê. As suites que tocares e o `core.gate` uma vez no fim, com o registo nesta pasta (`evl-gate.log` e `.codigo`, sem caminhos da máquina nem a estrutura das pastas locais).

2. **Os nomes das medidas e a conta, como o leitor os lê no recibo.** Vão para os campos que a linha irmã usa para o nome da medida e para a derivação, nas duas línguas. Os anos escrevem-se como a casa os escreve nesses campos.

   - o relato ao painel, pt:

   «milhões de euros dados como já transferidos para a associação, segundo o resumo que o painel europeu faz do relatório de progresso de Évora 2027, em junho de 2025»

   - o relato ao painel, en:

   «million euros given as already transferred to the association, according to the European panel's summary of Évora 2027's progress report, in June 2025»

   - a contribuição inicial, pt:

   «euros de contribuição inicial do Estado para o património da associação, a pagar em 2024, que as contas de 2025 dão como recebida»

   - a contribuição inicial, en:

   «euros of initial State contribution to the association's assets, payable in 2024, which the 2025 accounts treat as received»

   - a cultura, pt:

   «euros pagos em 2025 pelo gabinete do Ministério da Cultura, segundo as contas da associação»

   - a cultura, en:

   «euros paid in 2025 by the Ministry of Culture's office, according to the association's accounts»

   - o turismo, pt:

   «euros pagos em 2025 pelo Turismo de Portugal, segundo as contas da associação»

   - o turismo, en:

   «euros paid in 2025 by Turismo de Portugal, according to the association's accounts»

   - a soma, pt:

   «milhões de euros que as contas da associação declaram recebidos do protocolo de 2023 até ao fim de 2025»

   - a soma, en:

   «million euros that the association's accounts declare received under the 2023 protocol up to the end of 2025»

   - a conta da soma, pt:

   «2 000 000 + 3 750 000 + 3 920 000 = 9 670 000 euros, 9,7 milhões. São a contribuição inicial do Estado e os pagamentos de 2025 da cultura e do turismo, como as contas da associação os declaram. Fora da conta ficam 1 500 000 euros pagos em 2025 para a Linha do Vagar, que não são do protocolo.»

   - a conta da soma, en:

   «2 000 000 + 3 750 000 + 3 920 000 = 9 670 000 euros, 9.7 million. They are the initial State contribution and the 2025 payments from culture and tourism, as the association's accounts declare them. Outside the sum are 1 500 000 euros paid in 2025 for the Linha do Vagar, which are not part of the protocol.»

   A fonte de cada linha é quem escreve o documento: a Comissão Europeia, pelo painel de peritos, na primeira; a Associação Évora 2027 nas outras. A atribuição da primeira diz o que o motor já diz dela. O número 1 500 000 da conta tem linha no livro do motor: `evb-a-cab-26-fonte`, das contas de 2025, na página 57, com o excerto `– Linha do Vagar. Pago 1.500.000€ durante o ano de 2025`. Se a régua dos números do sítio o pedir como linha, atravessa essa também, como `evora-2027-pago-para-a-linha-do-vagar-2025`, com o nome da medida na forma das outras, e diz que o fizeste; se o aceitar na derivação como aceita as parcelas, fica.

3. **O cartão.** Em `src/data/leituras.mjs`, a entrada do estudo passa a ter duas medidas e a frase com os dois números. As medidas, pela ordem: a soma, depois o relato ao painel, com estes nomes curtos (os anos como referências de ano da casa):

   - a soma, pt:

   «milhões de euros recebidos do protocolo até ao fim de ⟦2025⟧, pelas contas da associação»

   - a soma, en:

   «million euros received under the protocol up to the end of ⟦2025⟧, by the association's accounts»

   - o relato, pt:

   «milhões de euros dados como já transferidos no relato ao painel europeu, em junho de ⟦2025⟧»

   - o relato, en:

   «million euros given as already transferred in the report to the European panel, in June ⟦2025⟧»

   A frase são as duas primeiras frases da unidade `C004` do texto julgado, letra por letra, com os dois números como linhas e os anos como referências:

   - pt:

   «No dinheiro, as contas da Associação Évora 2027 declaram ⟦soma⟧ milhões recebidos do protocolo de ⟦2023⟧ até ao fim de ⟦2025⟧. Em junho de ⟦2025⟧, o resumo que o painel de peritos europeus faz do relatório de progresso dava ⟦relato⟧ milhões como já transferidos.»

   - en:

   «On the money, the accounts of the Associação Évora 2027 declare ⟦soma⟧ million received from the 2023 protocol up to the end of ⟦2025⟧. In June ⟦2025⟧, the summary that the panel of European experts makes of the progress report gave ⟦relato⟧ million as already transferred.»

   ⟦soma⟧ e ⟦relato⟧ são as duas linhas e dão só os algarismos, sem unidade (a palavra `milhões` é da frase). Cada ⟦ano⟧ é a referência de ano; na frase inglesa, o `2023` de `the 2023 protocol` também é referência. A `origem` cita a unidade `C004` nas duas línguas, com a linha do ficheiro medida por guião e as duas frases como o documento as escreve. A via que prova a leitura pela unidade julgada passa a aceitar as primeiras frases inteiras de uma unidade, e não só a unidade inteira, com as plantas: uma palavra trocada recusa, uma frase a meio recusa, um número que não seja o da linha recusa.

4. **As listas fechadas que crescem com cinco linhas novas e uma frase nova.** As formas da I1; os blocos do livro em que as linhas de Évora aparecem (a página do concelho e a do tema da cultura, se as listarem); `src/data/nomes-das-medidas.mjs`; `src/data/concelhos.gerado.json`; a lista `SEM_AREA` de `src/data/areas.mjs`, cuja expressão apanha as linhas de Évora pelo identificador, e `tests/municipio/concelhos.mjs`; o inventário dos rótulos; o teto da L1; os conjuntos dos rótulos; o cruzamento com o motor; `tests/cartao/leituras-provadas.json`, se a frase lá tiver de estar; o registo das frases com afirmação (as frases novas do recibo e do cartão entram com a sua prova, não na lista das por registar, que só encolhe); o inventário das frases; as provas da leitura do EVB (`tests/evb/leitura.mjs`, `tests/evb/copias-julgadas.mjs`), que passam para a frase nova. Uma lista que eu não nomeei e que mexa: diz qual, o que pedia e o que fizeste.

5. **A prova.** No motor, o ponto 1. No sítio, por nome: `ledger:check`, `check:cruzamento` (com o motor), `check:series`, `check:selos`, `check:cartao`, `check:leituras`, `check:frases-afirmacao`, `check:frases-reais`, `check:lugar`, `check:paridade`, `gate:html`, `typecheck`, e o que mais a mudança tocar. Cada código lido de um ficheiro, em `evl-conferencias`. No relatório: a frase e as duas medidas do cartão como o HTML construído as imprime, nas duas línguas, e o que os cinco recibos imprimem (o valor, a unidade, o nome, a fonte, a página).

## O que fica como está, por decisão

O texto julgado do estudo e os seus documentos: não mudam. As outras linhas do livro. O estudo no motor, fora do campo `document` da linha `painel-transferido` e das entradas da travessia.

## Quando paras

Num número, numa fonte ou numa pessoa: um excerto que não esteja inteiro e único na página; um valor que o exportador não faça bater com a linha de origem; um nome de medida que só passe mudando o que diz; a frase do cartão que só passe mudando uma palavra. Paras nesse ponto, dizes o que viste, e fazes os outros. Para tudo o resto: decide, anota e continua.

## O fim

Os cinco pontos, cada um no seu commit, e o relatório curto: ponto a ponto o que ficou feito, as plantas, as listas que mexeram, o que ficou por correr fora da sandbox, os códigos.
