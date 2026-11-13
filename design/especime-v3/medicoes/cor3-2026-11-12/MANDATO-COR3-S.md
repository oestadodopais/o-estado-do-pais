# Mandato COR3, a passagem do sítio: os três estudos corrigidos atravessam, com os cartões, as duas linhas revistas e as entradas datadas (13.11.2026)

Acrescenta: linhas e frases
Medidas: medidas-cor3-s.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do sítio `cor3-2026-11-12`, que está em cima do `main` depois de o RET1 aterrar; a outra pasta com escrita é a worktree do motor `cor3-2026-11-12`, na cabeça que passou o portão inteiro numa árvore limpa (o resumo está nas medidas). No motor só mudas o que a travessia exigir, e dizes o quê. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `COR3`. O teu relatório vai para `RELATORIO-COR3-S.txt`, nesta pasta, com vinte linhas no máximo; as medidas e os registos para esta pasta (`medidas-do-construtor-cor3-s.json`, `cor3-s-conferencias/`), só os códigos e as últimas vinte linhas, sem caminhos da máquina. Lê primeiro `MANDATO-COR3-M.md`, `RELATORIO-COR3-M.txt` e as três folhas decididas, nesta pasta.*

## Porquê

A passagem do motor instalou as correções julgadas dos três estudos que ficam (o Orçamento de 2027, a reforma antecipada, a habitação), e a prova de igualdade deu todos os trechos conformes. Falta o que o leitor vê: os três documentos no sítio, os dois cartões que repetem frases corrigidas, duas linhas do sítio que a fonte reviu e o registo público das correções a dizer, com data, o que estava errado.

## §0 O que se mediu (em `medidas-cor3-s.json`, com o comando de cada medida)

1. **As linhas que o motor mudou** nos três estudos (as novas, as relidas e as que deixaram de ser usadas) estão listadas por estudo em `medidas-do-construtor-cor3-m.json`, campo `balanco_linhas`; as contagens estão nas medidas.
2. **As duas linhas do sítio que a fonte reviu:** `sobrecarga-do-custo-da-habitacao-2025-ue` e `sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue`; o valor impresso e o valor relido de cada uma estão nas medidas, com o corpo em que se leu.
3. **O registo das correções** tem hoje as entradas que as medidas contam para cada um dos três estudos.

Outras medidas da mesma coisa: o Eurostat publica a sobrecarga total em dois conjuntos, que para a União dão hoje o mesmo valor e para Portugal diferem numa décima; a linha do sítio vem do `tespm140` e o estudo usa o conjunto por regime de ocupação, e a frase da C12 di-lo. A sobrecarga dos inquilinos a preços de mercado está nos conjuntos `tessi164` e `ilc_lvho07c` com o mesmo valor.

## O que fazes

1. **A travessia.** Os três estudos passam do motor para o sítio pelos exportadores da casa: os documentos das duas línguas (uma só no estudo da reforma), os registos, as linhas geradas (as novas, as relidas, os dois títulos da notícia) e o registo das edições de cada estudo, com a edição anterior servida na sua data como a casa já faz. Nenhum ficheiro gerado se edita à mão.

2. **As duas linhas do sítio.** A primeira aplica-se por `scripts/aplicar-releituras.py`, da pasta `indicators/out/releituras/2026-11-12` do motor, com a data de publicação pela fonte. A segunda foi recusada pelo guião das releituras do motor, por o cabeçalho da linha não nomear o gerador; os corpos que o cliente da casa leu a 12.11.2026 estão em `indicators/out/cor3-2026-11-12/chegada/habitacao/releitura-da-linha-do-sitio/` no motor. Aplica-a pela via que o género da linha pede, com o excerto novo lido no corpo e uma entrada datada de natureza atualização; se essa via não existir sem escrever uma linha à mão, pára neste ponto e diz o que falta. As frases e as contas que leem estas duas linhas (o cartão da habitação, a entrada do sítio, o estudo `quadro-institucional`) mudam com elas, e a régua mede-o.

3. **Os dois cartões** (`src/data/leituras.mjs`).
   - O da reforma antecipada: os nomes das medidas, a nota das medidas, a frase e a origem, nas duas línguas, como estão nas entradas «Arrasta» da C04 e da C09 de `FOLHA-reforma-decidida.md`, letra por letra; o comentário de código que cita o estudo acompanha. As notas das duas linhas do livro que a folha muda (C03 e C05) entram pela via das linhas.
   - O da habitação: a frase, como está na entrada «Arrasta» da C06 de `FOLHA-habitacao-decidida.md`; a medida do rácio, como está na C20, a ler a linha derivada nova. O cartão do Orçamento não muda.

4. **O registo das correções** (`src/data/correcoes.mjs`). Seis entradas novas, com a data `2026-11-13`, cada frase letra por letra como está abaixo; onde o registo pedir mais campos, segue as entradas vizinhas do mesmo género.

   `orcamento-2027-o-que-muda-e-para-quem`, género `texto`:

   «O resumo e uma conclusão davam a dez linhas do quadro das medidas o peso de todas as medidas já em vigor, que o relatório soma noutro quadro e num valor maior; o texto dizia que nem o relatório nem a Unidade Técnica de Apoio Orçamental (UTAO) punham essas dez linhas dentro desse conjunto, e o relatório põe, e dava como cálculo da UTAO um total que é do Ministério das Finanças; duas frases davam toda a receita de IRS dos aumentos aos salários do Estado, quando as fontes a dão para salários e pensões, e a percentagem calculada sobre ela saiu; duas frases apresentavam a UTAO a dizer mais do que o seu documento escreve; duas chamavam «todas as medidas» às principais medidas do quadro; os saldos da União Europeia traziam a data de atualização do ficheiro da dívida; e a frase do Partido Comunista Português (PCP) sobre a receita do IRC estava posta ao lado do impacto das medidas, e passou a estar ao lado da receita fiscal que o relatório prevê.»

   «The summary and one conclusion gave ten rows of the table of measures the weight of all the measures already in force, which the report adds up in another table and at a larger figure; the text said that neither the report nor the Unidade Técnica de Apoio Orçamental (UTAO) placed those ten rows inside that set, and the report does, and it presented as UTAO's calculation a total that is the Ministry of Finance's; two sentences gave all the income-tax revenue from the increases to State wages, when the documents give it for wages and pensions, and the percentage calculated on it was removed; two sentences presented UTAO as saying more than its document writes; two called «all the measures» what are the table's main measures; the European Union balances carried the update date of the debt file; and the sentence of the Portuguese Communist Party (PCP) on corporate income tax revenue was set beside the impact of the measures, and is now set beside the tax revenue the report forecasts.»

   `orcamento-2027-o-que-muda-e-para-quem`, género `texto_atualizado`:

   «O Parlamento mudou o calendário da discussão do Orçamento na especialidade, e o estudo passou a dizer as datas novas.»

   «Parliament changed the calendar for the detailed discussion of the Budget, and the study now gives the new dates.»

   `penalizacoes-por-reforma-antecipada-2026`, género `texto`:

   «O texto chamava «justa» e «correta» à redução que o relatório calcula como atuarialmente neutra, numa estimativa que ele próprio diz preliminar, e apresentava-a como o custo da antecipação para as contas públicas, que o relatório não mede; dizia que o resultado não tinha sido noticiado, o que era falso; dizia que o relatório recomenda três coisas, quando ele enumera sete; dizia, sem fonte, que o princípio do relatório não estava em vigor e que a diferença era «apenas cobrada»; a lista de quem escapa ao fator de sustentabilidade não tinha o regime de antecipação por deficiência; e a comparação vale só para a reforma antecipada pelo regime de flexibilização, o que o estudo e o cartão passaram a dizer.»

   «The text called «fair» and «correct» the reduction the report calculates as actuarially neutral, in an estimate the report itself calls preliminary, and presented it as the cost of early retirement to the public accounts, which the report does not measure; it said the result had not been reported in the press, which was false; it said the report recommends three things, when it lists seven; it said, with no document behind it, that the report's principle was not in force and that the difference was only charged; the list of those who escape the sustainability factor lacked the early-retirement scheme for disability; and the comparison holds only for early retirement under the flexibilisation scheme, which the study and the card now say.»

   `penalizacoes-por-reforma-antecipada-2026`, género `texto_atualizado`:

   «O ficheiro do relatório que está em linha deixou de ser igual, byte a byte, à cópia que foi lida: mudou a linha do DOI. O estudo passou a dizê-lo.»

   «The report file now online is no longer byte-for-byte the copy that was read: the DOI line changed. The study now says so.»

   `a-casa-em-portugal-e-na-europa`, género `texto_atualizado`:

   «O Eurostat e o Banco de Portugal reviram números que este estudo usa: o índice real dos preços das casas, a sobrecarga do custo da habitação na União Europeia, por regime de ocupação e nos jovens, e as novas operações de crédito à habitação de agosto. O Eurostat mudou também a base do rácio entre os preços e o rendimento e publicou mais um ano; o estudo passou a dizer a subida desse rácio entre dois anos, e a comparação com a média de longo prazo no ano mais recente.»

   «Eurostat and the Bank of Portugal revised figures this study uses: the real house price index, the housing cost overburden rate in the European Union, by tenure and among the young, and August's new housing loan operations. Eurostat also changed the base of the price-to-income ratio and published one more year; the study now gives the rise of that ratio between two years, and the comparison with the long-term average in the latest year.»

   `a-casa-em-portugal-e-na-europa`, género `texto`:

   «Uma conclusão dizia que o problema da habitação é o de quem entra agora no mercado, os jovens e quem chega, o que nenhum número do estudo mede, e entre os jovens a sobrecarga é menor em Portugal do que na União; o título de outra dizia que o que o Estado faz é pequeno e que nenhum documento seu o mede, quando o relatório do Orçamento conta casas e beneficiários, e o que nem ele nem o comunicado do Conselho de Ministros fazem é avaliar o efeito nos preços ou nas rendas; a frase do primeiro-ministro sobre os custos nas cidades estava posta ao lado do índice nacional dos preços como se medissem o mesmo, e o texto dizia que nenhuma fonte dava a subida por cidade, quando o Instituto Nacional de Estatística (INE) publica a variação dos preços por município; o texto dizia que o relatório do Orçamento não define «invariante», e ele descreve-o; o preço e a renda por metro quadrado apareciam sem dizer que são medianas, e o crédito novo sem dizer que inclui renegociações; e o nome de um autarca aparecia só dentro do título de uma notícia, sem nenhum ato seu, e o estudo passou a citar o outro título que o jornal dá à mesma notícia.»

   «One conclusion said that the housing problem is that of those entering the market now, the young and those who arrive, which no number in the study measures, and among the young overburden is lower in Portugal than in the Union; the heading of another said that what the State does is small and that none of its documents measures it, when the Budget report counts homes and beneficiaries, and what neither it nor the Council of Ministers communiqué does is assess the effect on prices or rents; the Prime Minister's sentence on costs in the cities was set beside the national price index as if they measured the same thing, and the text said that no document gave the rise by city, when Statistics Portugal (INE) publishes the change in prices by municipality; the text said that the Budget report does not define «invariante», and it describes it; the price and the rent per square metre appeared without saying they are medians, and the new lending without saying it includes renegotiations; and the name of a mayor appeared only inside the headline of a news report, with no act of his own, and the study now cites the other title the newspaper gives the same report.»

5. **As listas que crescem com linhas e frases novas:** as formas da I1, os blocos do livro, o teto da L1, os conjuntos dos rótulos, os nomes, as unidades e as famílias das linhas novas da habitação (`src/data/nomes-hb1.mjs`, `src/data/unidades-hb1.mjs`, `src/data/o-que-e-das-familias.mjs`), o inventário dos rótulos (`design/especime-v3/rotulos/INVENTARIO.json`), as leituras provadas do cartão (`tests/cartao/leituras-provadas.json`), `ledger/frases/por-registar.json` e `src/data/datas-de-publicacao.json`. A linha irmã com que este lugar mediu as listas foi `hab-tipsho60-a-ptir-lt-avg-pt-2024`. Cada uma cresce pelo que este bloco acrescenta e por mais nada; o relatório diz quanto.

6. **A razão datada ao pé das contagens** (o índice dos estudos e a página de Évora, do RET1) imprime a data duas vezes, porque o componente antepõe a data da entrada a uma razão que já a traz. O componente deixa de antepor a data quando a razão a contém; a frase da linha não muda. Planta: uma razão sem data continua a levar a data à frente.

7. **A prova.** O `build` da cabeça e as conferências que cada ponto toca, cada código lido de um ficheiro. `conferir-composto-cor3.py` passa a ler também os documentos do sítio (`studies-src/` dos três estudos) e dá todos os trechos conformes, com as duas plantas a morder. No relatório: as seis frases do registo e as frases dos dois cartões como o HTML construído as imprime, nas duas edições; o que os recibos das duas linhas do sítio mostram; a lista inteira do `verify` corre-a este lugar por guião depois da tua passagem.

## O que fica como está, por decisão

Tudo o que as folhas não nomeiam. O cartão do Orçamento. As linhas dos estudos retirados. As outras páginas.

## Quando paras

Numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida: paras nesse ponto e dizes qual e porquê, e fazes os outros. Numa frase deste mandato que uma régua recuse: não a reescreves; dizes qual, o que a régua recusa e a forma mais próxima que ela aceita. Para tudo o resto: decide, anota e continua.

## O fim

Os sete pontos, cada um no seu commit, e o relatório: ponto a ponto o que ficou feito, as listas que cresceram e quanto, as frases como se imprimem, os códigos, o que ficou por correr fora da sandbox.
