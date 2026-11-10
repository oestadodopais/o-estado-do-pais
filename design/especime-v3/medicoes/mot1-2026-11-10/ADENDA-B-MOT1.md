# Adenda B ao mandato MOT1: as correções da leitura a frio (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da leitura a frio do bloco pelo Claude Opus 5.5 (`leitor`), que apanhou as cinco plantas do pacote e deixou os achados reais abaixo. Cada ponto diz o defeito, onde está e o que este lugar decidiu. Lê primeiro o mandato, a adenda A e os teus dois relatórios. Uma só passagem, sobre a cabeça `1970a41` do motor.*

## O que corriges

1. **A correção de decisão (`⟦cor:…⟧`) refere-se por uma chave estável, não pelo índice.** Hoje o marcador é a posição da entrada em `decisoes_corrigidas`: reordenar a lista troca em silêncio os números que o texto imprime, e cada um continua a passar (`core/compor.py`, a resolução do marcador e `conferir_correcao`). O marcador passa a nomear a correção pela sua identidade (a fonte, o bloco, a unidade, a forma impressa e a ocorrência, ou um identificador declarado na entrada). Plantas: reordenar a lista não muda o texto composto; uma chave que não existe recusa; duas entradas com a mesma chave recusam.

2. **Uma referência que imprime um algarismo sem linha fica presa ao sítio de onde vem.** Hoje a referência de não figura (`⟦nf:…⟧`) e a correção com `"linha": null` aceitam qualquer bloco, unidade e ocorrência de uma fonte declarada, em qualquer frase: quem editar um gabarito pode levar o número de uma lei para o lugar de uma percentagem, e o texto compõe sem linha. O compositor passa a conferir que as palavras vizinhas do marcador no gabarito são as que rodeiam essa ocorrência no registo da fonte (decide quantos carateres de cada lado e a normalização, de modo que os sete gabaritos de hoje continuem a compor sem mudar um byte). Uma correção com `"linha": null` leva ainda a razão escrita na sua entrada. Plantas: a referência movida para outra frase recusa; a mesma referência no seu lugar passa; uma correção sem linha e sem razão recusa.

3. **Uma linha própria traz o documento alojado.** Hoje a linha declara o título e a página do documento, e o excerto confere-se só contra si próprio: nada garante que o documento diz aquilo. A linha passa a exigir `document.source_sha256`, e o compositor recusa-a se a pasta `source/` do estudo (ou de uma fonte declarada) não tiver um ficheiro com esse resumo. Se o motor já tiver uma função que confira um excerto na página de um corpo alojado, usa-a aqui; se não tiver, não a inventes nesta passagem: di-lo no relatório, e a conferência do excerto na página fica como coisa aberta com este nome. Plantas: sem resumo recusa; com um resumo que nenhum ficheiro alojado tem recusa; com o ficheiro certo passa.

4. **Uma linha própria usa-se em todas as edições do estudo.** Hoje basta um marcador numa língua. Passa a recusar a linha que uma edição não usa. Planta.

5. **Um algarismo colado a um marcador recusa sempre,** anos incluídos (hoje `⟦…⟧2024` passa e compõe um número fundido). Planta com um ano.

6. **Os testes deixam de depender dos gabaritos históricos.** A prova integral de hoje repõe o histórico por cima do gabarito ativo antes de comparar: prova a ferramenta, mas nunca compõe os gabaritos que estão comitados, e ficará vermelha na primeira correção de conteúdo. Passa a haver duas coisas separadas:
   - uma conferência, no `core.gate`, de que os gabaritos ativos comitados de cada estudo com texto próprio compõem os ficheiros gerados comitados (os `.md`, o livro, a proveniência e as decisões de figura; e o `.html` e o registo pela renderização e pela exportação, como a prova integral já faz), sem ler nenhum histórico;
   - a prova da ferramenta de aplanar, sobre um estudo de teste pequeno guardado nos testes, e não sobre os quatro estudos reais.
   Planta para a primeira: uma frase mudada num gabarito ativo sem recompor recusa.

7. **O ensaio da ferramenta** (`core.aplanar` sem `--escrever`) compara com os ficheiros que estão em disco, e não com uma composição em memória, e diz no fim que ficheiros gerados não cobre.

8. **Cada planta afirma a recusa pelo seu motivo.** Onde um teste só espera uma recusa qualquer (`assertRaises` sem a mensagem), passa a esperar a mensagem da regra que diz provar. Onde um teste não distingue a regra certa de uma mais fraca, acrescenta o caso que as distingue: duas formas alternativas em que só uma muda o valor; uma só colisão de identificador; um valor positivo com o excerto negativo e um valor negativo com o excerto negativo; uma mudança num ficheiro gerado que conserva o tamanho.

9. **A nota do manifesto dos registos** dos quatro estudos ainda diz que cada bloco se copia dos registos das fontes com as emendas escritas no gabarito. Corrige-a na origem, para dizer o que é verdade agora, e regenera.

## O que fica como está, por decisão

- Os anos e as datas ISO escritos no texto continuam fora da regra dos números, como antes do bloco. Quem muda uma frase muda-a por guião, e o texto inteiro vai ao juiz.
- O guião `medir-mot1.py` é um registo da medição de antes; não se muda.

## O fecho

As suites tocadas, pelos seus comandos; o `core.gate` uma vez, no fim, por `curto.sh`; os sete gabaritos ativos continuam a compor os mesmos bytes (di-lo com os resumos, ou diz o que mudou e porquê). Os commits com o assunto a começar por `MOT1`. O relatório curto, em `RELATORIO-MOT1-B.txt`: ponto a ponto, o que mudou, a planta e o que deu; o código do portão e as suas últimas linhas, copiadas do registo; o que ficou aberto.

## Quando paras

Um ponto que só se cumpra mudando um byte dos ficheiros gerados dos quatro estudos: páras nesse ponto, dizes qual e porquê, e fazes os outros. O teto da passagem, num commit são.

## O fim

O fecho acima. Setenta e cinco minutos, cento e vinte chamadas.
