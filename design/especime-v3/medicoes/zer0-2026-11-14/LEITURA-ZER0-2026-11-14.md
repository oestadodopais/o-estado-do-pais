# As leituras do ZER0 (14.11.2026)

*Escrito pelo lugar de direção (Claude Fable 5.2). O bloco: sete correções a páginas de dados que estavam no ar, decididas numa folha e julgadas antes de se construir. Quem construiu foi o Codex `gpt-6-astra`; quem leu o que ele construiu foi o Claude Opus 5.5; o que o lugar de direção corrigiu leu-o o Codex.*

## Antes de construir: as duas verificações e a folha

Duas leituras do Opus sobre o que estava no ar: a das linhas só com recibo (`VEREDICTOS-linhas-so-com-recibo.md`, nesta pasta: dezanove linhas conferidas na fonte; dez valores certos, dois rácios com o sentido errado, um saldo natural sem fonte, seis recibos históricos com o endereço da fonte a dar ao índice dos estudos) e a montagem da folha de correções, com os lugares e as provas de cada item. Este lugar decidiu cada item (`FOLHA-zer0-decidida.md`): seis mudam e um fica («Empresas não financeiras» é o nome que o destaque do INE de 11.12.2025 dá ao total 1 576 606, que é a soma das 308 linhas do sítio).

O Codex Astra julgou a folha a `xhigh`, contra as cópias das fontes (`JUIZO-ZER0.md`): **cinco plantas em cinco**. Refez as somas do ficheiro do plano, a soma do mapa dos empréstimos e a divisão da água. Entraram quatro reparos; um não entrou e ficou aberto como ZER0-1 (a palavra «paridades» na primeira frase das regiões, que está em cinco cadeias, à espera da forma portuguesa oficial da unidade).

## A construção

Uma passagem do construtor (14:05:10 a 16:13:33 UTC, 243 turnos), os oito pontos do mandato. O ramo foi publicado no GitHub logo a seguir, e a corrida `portão` de lá ficou verde na cabeça `5e05b1c71` antes de qualquer leitura.

## O portão do motor numa árvore limpa

A primeira corrida, na cabeça `6d43fb7`, deu quatro vermelhos. Um era da invocação deste lugar (a travessia contra o sítio lê a árvore principal se `OEDP_SITE` não disser outra). Os outros três eram uma coisa só, que as conferências dirigidas do construtor não tocam: os livros dos estudos 16 e 18 guardam o resumo do livro dos mandatos, que este bloco mudou, e o do estudo 19 guarda o do livro do 16. Este lugar regenerou os três pelo compositor (uma linha em cada um de seis ficheiros, só resumos; o texto julgado igual) e passou os anexos de 2016 para as fontes do estudo dos mandatos, de onde o mandato os tinha tirado por erro (commit `d10ef58` do motor). **O Codex leu esse commit, com cinco plantas em cinco** e nenhum achado fora delas. A segunda corrida deu um vermelho: o recorte do empréstimo vinha de uma cache que o git ignora, e a árvore limpa tinha a antiga; com a cache do construtor, o módulo passa.

## A leitura a frio

Claude Opus 5.5 (`leitor`), a `xhigh`, 354 mil símbolos e 116 chamadas, sobre o pacote do bloco inteiro (o sítio e o motor, catorze corpos alojados, 63 páginas construídas). **Cinco plantas em cinco, pelo que fazem:**

- CZ-P1: o nome inglês das verbas contratadas com «intermediate and final beneficiaries»;
- CZ-P2: a razão portuguesa da correção do empréstimo com «dois euros acima»;
- CZ-P3: o excerto da lista PPD/PSD.CDS-PP.PPM com 8031 votos;
- CZ-P4: o rótulo português da água sem «continental»;
- CZ-P5: a regra da data com maior ou igual.

Confirmou: a frase das regiões fora das duas edições; os nomes, as duas aritméticas e as descrições do plano iguais à folha, sem «sede» em página nenhuma; nove dos dez excertos eleitorais como subcadeias exatas dos corpos alojados (o décimo era a planta), cada valor igual ao campo dos mandatos; a única mudança de valor do diff é o empréstimo; as dezoito linhas retiradas e só essas, sem página que as nomeie; o caminho antigo do motor igual; as contagens do relatório refeitas do pacote.

Fora das plantas, o que este lugar fez de cada achado:

- **Um Blocking do pacote, fechado.** O pacote não trazia o relatório de 2016 nem a listagem do plano, porque as linhas do sítio não declaram o resumo do documento. Com os ficheiros à frente, o leitor conferiu: a página 99 tem o excerto palavra por palavra e é a única com 32.166.373,20; a página 84 é a única com 32.166.372,20; o recorte é da página 99; as duas somas com nome de entidade e as das cinco linhas refazem-se ao cêntimo.
- **Major, corrigido na adenda A:** três descrições diziam a listagem duas vezes e uma lia-se como se o concelho tivesse sido pago; a página das regiões ficou sem dizer em palavras simples o que é um valor abaixo de cem; o guião do construtor que confere o HTML não comparava as frases do empréstimo com a folha. E um Minor que o leitor vê: no recibo do empréstimo, a ligação de repetir a leitura abria a página antiga.
- **Major, não corrigido neste bloco, por decisão:** as duas somas com nome de entidade passaram a dizer «por confirmar na fonte», quando o recibo imprime a conta sobre o ficheiro selado. É o estado em que as outras três somas sobre o mesmo ficheiro já estavam no ar; antes deste bloco as duas imprimiam como citação uma chave que o ficheiro não tem. A correção é da classe e mexe no modelo da proveniência das cinco linhas: é o primeiro ponto do bloco seguinte (ZER0-2).
- **Major, registado como questão de classe:** o excerto de `evora-populacao-2021` na forma que a casa usa para um campo de um JSON do INE (ZER0-3).
- Os Minor estão no `ISSUES.md`, de ZER0-4 em diante.

## A adenda A e a sua leitura

Para as frases que a leitura a frio mandou rever, uma folha pequena (`FOLHA-zer0-adenda-A.md`): cinco descrições das linhas do plano de Évora e a frase de definição na caixa das regiões. **O Codex julgou-a antes de se construir, com cinco plantas em cinco** (JA-P1 a JA-P5), e mandou um reparo, que entrou: a descrição da parte com o prazo passado ainda se lia de duas maneiras. O construtor fez a adenda numa passagem (17:28:19 a 18:17:57 UTC, 110 turnos): as seis frases, a ligação de repetir a leitura do recibo do empréstimo, que passa a abrir a página que a linha cita, e o guião de prova, que passou a ler as cadeias esperadas das duas folhas e não da linha.

Claude Opus 5.5 (`leitor`), a `xhigh`, 147 mil símbolos e 47 chamadas, leu o diff da adenda. **Cinco plantas em cinco, pelo que fazem:**

- SA-P1: a descrição portuguesa da parte paga com «a parte por pagar»;
- SA-P2: a frase inglesa das regiões com os sentidos trocados;
- SA-P3: a regra da ligação de repetir a leitura invertida;
- SA-P4: a descrição inglesa do prazo com «after the snapshot»;
- SA-P5: o guião de prova a esperar «um euro abaixo».

Confirmou: as doze frases nas páginas construídas iguais à folha, nas duas edições, e nenhuma antiga em página nenhuma do pacote; cada descrição diz a coluna, os dois papéis e a condição que o recibo imprime; a frase das regiões é só a definição do índice, com «menor» e «maior» do lado certo; as duas ligações do recibo do empréstimo abrem a página 99 e o histórico das verificações ficou igual; os apoios dos cartões acompanharam as descrições sem perder nenhum. Fora das plantas, nenhum Blocking e nenhum Major; os Minor estão no `ISSUES.md` (ZER0-11 a ZER0-13).

## O fecho

A lista inteira do `verify` correu por guião na cabeça `5e05b1c71`, de 16:15 a 17:27 UTC de 14.11.2026: 72 passos, todos a zero, a árvore limpa no início e a mesma cabeça no fim. Depois dela mudaram as seis frases da adenda, a regra da ligação e o guião de prova, com as conferências dirigidas a zero (as dos cartões, das leituras, das frases com afirmação com o motor e como a corrida do GitHub as corre, das frases reais, dos rótulos, da voz, do livro, da incorporação e o `typecheck`), e as três conferências que leem o motor a zero contra a sua cabeça final. A corrida `portão` do GitHub ficou verde na cabeça do construtor antes da leitura a frio e correu outra vez na cabeça final, que é a que aterra. As capturas são de onze páginas nas cinco larguras e nas duas edições.

O portão inteiro do motor passou numa árvore limpa na cabeça `d10ef58` (18:18 a 18:41 UTC, 201 módulos), com a travessia a ler a worktree do sítio do bloco e a cache dos recortes do construtor.
