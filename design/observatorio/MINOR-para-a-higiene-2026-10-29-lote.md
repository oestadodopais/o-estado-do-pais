# Os Minor das leituras de 29.10.2026 à tarde (a HB1-e, o DO1 e a OG1-B4), para o bloco de higiene seguinte

*As leituras do Claude Opus 5.5 (`leitor`, xhigh) de 29.10.2026: a leitura a frio da HB1-e (13:53 a 14:03 UTC) e a leitura curta da sua correção (15:32 a 15:39 UTC), a leitura a frio do DO1 (lançada às 16:03 UTC) e a leitura curta da OG1-B4, todas com as cinco plantas apanhadas. Os Major corrigiram-se antes de aterrar (as adendas B, C e D da HB1-e; as adendas D a G do DO1; a adenda D da OG1-B4); estes Minor ficam para a higiene, na ordem das leituras. Sem travessões.*

## A HB1-e (a leitura a frio, achados 9 a 19; a leitura curta, achados 8 a 11)

1. O nome «taxa de variação» da linha homóloga na página da linha, sem o qualificativo «Em termos homólogos» da fonte: a régua da habitação exige o nome literal do excerto, e o excerto não traz o qualificativo na mesma frase; decidir se a régua admite um nome composto de duas frases do mesmo parágrafo (achado 9 da leitura a frio).
2. As contagens do relatório do construtor que não reproduzem: as linhas do sítio antes (4 141 no relatório, 4 138 no inventário), as entradas classificadas do inventário (2 417 para 2 419 no relatório, 2 415 contadas; a leitura curta contou 2 405 onde o relatório da correção diz 2 419), as 406 letras da caixa que o relatório diz cortadas (achados 10, 11, 16 e o achado 10 da leitura curta): o relatório passa a citar os números pelos ficheiros que a máquina escreve, nunca de cabeça (a regra 13).
3. O inventário dos rótulos a mudar muito mais do que quatro páginas (`paginas` 9 692 para 9 810) sem o relatório dizer porquê (achado 12); e `origem-das-linhas.json` com um sha novo das séries do sítio sem nada no diff dessas séries (achado 13): medir o que os dois geradores reescrevem a cada passagem e fixar o que não devia mudar.
4. A medição da L1 depois a nomear o commit de partida como cabeça (achado 14): o guião da L1 lê a cabeça da worktree no momento da medição.
5. A unidade da mediana impressa de duas maneiras na página da linha («euros/m2» em português, «euros per square metre» em inglês; achado 15): uma forma por edição, decidida no dicionário das unidades.
6. A edição anterior (26.10.2026) do estudo da habitação sem lugar onde se conserve: `studies.mjs` reescreve a data e os manifestos substituem a entrada (achado 17): decidir onde fica a edição anterior de um estudo datado (a I263 toca nisto).
7. A limpeza das auditorias pelo compositor das famílias não cobre uma família cuja chave mudou de nome, e a planta não testa esse caso (achado 18 da leitura a frio, corrigido em parte pela adenda B; o achado 8 da leitura curta): a planta passa a renomear uma chave.
8. A parte factual de cada definição composta (o crédito para comprar, a metade acima e abaixo, a unidade, o mesmo mês um ano antes, os três meses apurados) não tem apoio conferido por guião: o compositor só confere os literais dos `apoios` (achado 9 da leitura curta): selar a nota metodológica do INE como linha de apoio e dar às definições um apoio por parte, como as frases do estudo.
9. A frase do Orçamento na secção 11 do estudo da habitação diz só que a votação estava marcada para 27 e 28 de outubro (achado 19 da leitura a frio, reescrito pela adenda C; o achado 11 da leitura curta): o resultado entra no estudo na próxima atualização datada da habitação, pela linha oficial `og1-votacao-generalidade-oficial` (a OG1-B4 põe-no no item e o dossiê liga-o).
10. Os códigos dos portões do construtor fora do pacote da leitura (o Major 7 das duas leituras, conhecido; a I280): `pacote.sh` recebe a pasta dos `.codigo` da passagem.
11. A fusão de dois blocos conflitua sempre no fim do inventário das frases e das revisões (duas fusões a 29.10): os blocos escrevem a sua secção num ficheiro por bloco, ou o guião da fusão junta as secções.

## O DO1 (a leitura a frio, achados 13 e 16 a 18)

1. O cartão do estudo do Orçamento com «as dez linhas marcadas como invariantes pesam 1 210 milhões» chumba o teste dos dois minutos para um leitor leigo (achado 13): texto do estudo, para a sua próxima atualização datada (a OG1-B5 ou a seguinte), não deste bloco.
2. A exceção da voz para «a casa» ficou mais larga do que a adenda A permitia (também as aberturas do dossiê da casa; achado 17): sai com o dossiê da casa na DO1-8; se o dossiê voltar, a exceção volta só para o título, o âmbito e a linha «Dossiê».
3. Conferências vazias nos dados de hoje (achado 18): `prendeNoDossie('/fora-dos-dossies')` contado como planta sem poder falhar; a regra da caixa das novidades «sem ligação de dossiê numa entrada que não pertence» nunca corre porque todas as entradas pertencem; a validação dos ids do calendário entra na DO1-8, as outras duas ficam para a higiene com plantas que mordam.
4. A régua dos alvos de toque (`tests/acessibilidade/alvos.mjs`) não tem a família dos dossiês: a página do dossiê não é medida; entra nas famílias quando a higiene tocar a régua.
5. O pacote de uma leitura leva a base da fusão (`git merge-base`) e não a cabeça de um ramo (o Blocking 1 da leitura, um erro do guião `do1-pacote.sh`; a I283), e leva a pasta dos códigos da corrida inteira quando ela existe (a I280).
6. Os relatórios do construtor trazem caminhos da máquina e da pasta temporária (achado 14): o guião dos registos limpa-os antes de os copiar (feito a 29.10); o lançador devia proibi-los à nascença.

## A DO1-8 (a leitura curta, achados 5 e 7 a 12)

1. O recorte dos selos do resumo no dossiê por `overflow: clip` (achado 5): a régua dos alvos dá verde, mas o contorno do foco de um selo na primeira ou na última linha pode ficar cortado; a forma certa é de disposição (uma margem ou o alinhamento vertical dos selos), não de recorte.
2. `pecaMaisRecente` cala uma peça sem data em vez de falhar, e a data do cartão do estudo que a alimenta não está provada (achado 7): uma peça sem data é um erro; uma planta com um estudo mais recente do que os itens.
3. As plantas novas de `check:dossies` são `assert.throws` sem mensagem esperada (achado 8): cada planta nomeia a mensagem da régua que espera.
4. Duas linhas vivas do inventário apagadas em vez de retiradas (os títulos da cabeça dos dossiês; achado 9), e a linha das revisões sem a adenda G: corrige-se o inventário à mão na higiene.
5. «Um lugar por assunto vivo, com tudo o que há sobre ele» usa um termo da casa (achado 11): decidir a frase do leitor («Um lugar por assunto, com tudo o que há sobre ele» e a inglesa) na próxima passagem que toque os dossiês, com o inventário.
6. A planta «item de outro dossiê» passou a «item fora de uma página de dossiê» (achado 12): quando houver um segundo dossiê, a planta da troca volta.
7. O leitor apanhou quatro plantas em cinco (a frase do âmbito do índice português): a planta era numa cópia construída fora do diff; a lição é dar ao leitor, no prompt, a lista das páginas construídas que o diff não toca mas que a passagem reimprime.

## A OG1-B4 (a leitura curta, achados 7, 8, 11 e 12)

1. A página dos itens (`/o-que-se-discute/`) não imprime a data da escrita nem a da publicação de cada item, em nenhuma edição (achado 7; o achado 8 da leitura do OG1-B de 28.10 já o dizia): uma data por item no cabeçalho, pela forma dos dossiês, com o contexto de `check:datas` declarado.
2. As contagens de chamadas e de conferências do relatório do construtor sem ficheiro que as sustente (achado 8): o relatório cita só o `pontos.json` do lançador e os `.codigo` (a regra 13; o Minor 3 da lista de 28.10).
3. Os relatórios do construtor com caminhos da máquina (achado 11): o lançador recusa um relatório com o diretório pessoal ou a pasta temporária à nascença (o guião dos registos limpa-os entretanto).
4. Uma linha em branco a partir a tabela de uma secção do inventário (achado 12, corrigido na OG1-B4-2): o guião do inventário recusa uma tabela partida.
5. O guião `uso.py` não lê o contador semanal «Fable only» da subscrição do Claude (visto pelo financiador a 89 % às 17:13 UTC): lê-se do ecrã de uso da aplicação até haver maneira de o ler por guião.
6. A auditoria das palavras (`auditoria-das-palavras.mjs`) conserva a linha da RTP como apoio das palavras da abertura que ela não apoia, movendo-a para o fim da lista em vez de a tirar quando os recibos do parágrafo deixam de a citar (a leitura curta da OG1-B4-2, achado 7): o gerador tira os apoios que o parágrafo já não cita.
7. O ordinal inglês «sixteenth» é prosa sem régua que o prenda ao «16» da linha (achado 8): uma régua dos ordinais glosados, ou a glosa volta a ser um fragmento sem selo dentro do parêntese.
8. A frase inglesa «gives at the «Reunião Plenária n.º 16» (the sixteenth plenary sitting) the result «Aprovado» (passed)» é pouco idiomática, o parágrafo das fontes tem cento e cinquenta palavras numa frase, e a nota da IL «O voto contra consta da notícia da votação» vem depois de uma citação da RTP cuja passagem não tem o voto da IL (achado 9): a próxima atualização datada do item reescreve o parágrafo em duas ou três frases e nomeia a notícia da IL.
9. O conferidor dos números do relatório (`conferir-relatorio.py`) procura os ficheiros na pasta do lançador e não na pasta das medições comitada (achado 6): passa a procurar nas duas.
