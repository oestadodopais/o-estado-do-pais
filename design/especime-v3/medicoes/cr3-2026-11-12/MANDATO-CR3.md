# Mandato CR3: duas revisões do Eurostat aplicadas pelo guião, e o guião a fechar as suas próprias listas (12.11.2026)

Acrescenta: frases
Medidas: medidas-cr3.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede. A worktree de arranque é a do sítio `cr3-2026-11-12` (do `main` `344b4777d`); a outra pasta com escrita é a worktree do motor `cr3-2026-11-12` (do `master` `c0b49c7`, com a releitura de hoje no commit `61add01`), onde não tens nada a mudar. Uma construção normal: setenta e cinco minutos e cento e vinte chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `CR3`. O teu relatório vai para `RELATORIO-CR3.txt`, nesta pasta, com quinze linhas no máximo; as tuas medidas e os registos para esta pasta (`medidas-do-construtor-cr3.json`, `cr3-conferencias/`). O registo de uma construção ou de uma conferência não se comita inteiro: só o código e as últimas vinte linhas, sem caminhos da máquina. Lê primeiro `design/especime-v3/medicoes/cr2-2026-10-26/LEIA-ME.md`: é o mesmo trabalho que aplicou dezassete revisões a 26.10.2026, com o mesmo guião.*

## Porquê

O Eurostat reviu a 29.10.2026 três valores que o sítio publica. As reconferências semanais de 02.11 e de 09.11 viram-no, e o recibo de cada linha já diz ao leitor o valor que a releitura encontrou; o título continua com o valor antigo. Aplicar uma revisão devia ser um passo de guião, sem modelo: este bloco aplica duas das três e deixa o guião a fechar sozinho as listas em que hoje ainda pára.

## §0 O que se mediu (12.11.2026, pelo lugar de direção, por guião)

1. **A releitura de hoje no motor** (`indicators/reler_linhas.py`, com rede e outra vez sobre os corpos, as duas com código 0 e linhas iguais; a pasta é `indicators/out/releituras/2026-11-12`): o desempenho das exportações de Portugal de 2024 passou de `17,1` para `17,0`, o de 2025 de `8,2` para `8,0`, e a sobrecarga do custo da habitação da União de 2025 de `7,7` para `7,6`.
2. **O ensaio do `scripts/aplicar-releituras.py` com as três linhas** deu código 0, com todas as plantas a morder.
3. **Com as três aplicadas, a construção pára** em `HB1: recompor a série alterada sobrecarga-do-custo-da-habitacao-2025-ue`: o estudo da habitação usa essa linha e tem de ser recomposto. Essa linha fica fora deste bloco.
4. **Com as duas das exportações aplicadas, a construção pára** em `mudancas: a linha "desempenho-das-exportacoes-2024" mudou e nenhuma declaração diz de que lugar é`, em `src/data/lugar-das-linhas.mjs`. Este lugar não correu mais longe: pode haver outras listas a seguir.
5. **A razão do acesso que o guião escreve** diz que o valor novo foi lido no dia da reconferência que viu a revisão. Hoje isso é falso: a leitura é de 12.11.2026 e as reconferências que a viram são de 02.11 e de 09.11.

Outras medidas da mesma coisa: nenhum número novo chega ao leitor que o recibo não diga já; o valor que hoje aparece em «a releitura encontrou» passa a ser o do título, com a atualização datada.

## O que fazes

1. **A razão do acesso, quando o dia da leitura não é o dia da reconferência.** O molde de hoje fica para quando os dois dias coincidem. Quando não coincidem, o guião escreve:

   - pt:

   «O valor novo foi lido a ⟦dia da leitura⟧, depois de a comparação semanal com a fonte de ⟦dia da comparação⟧ ter visto a revisão; a leitura anterior, de ⟦dia da leitura anterior⟧, é a do valor ⟦valor antigo⟧.»

   - en:

   «The new value was read on ⟦dia da leitura⟧, after the weekly comparison with the source of ⟦dia da comparação⟧ had caught the revision; the earlier reading, of ⟦dia da leitura anterior⟧, is that of the value ⟦valor antigo⟧.»

   Cada ⟦…⟧ é um campo que o guião já tem, na forma em que hoje os escreve (as datas em dia, mês e ano com pontos; o valor com a vírgula decimal nas duas línguas). O dia da comparação é o da última reconferência semanal divergente da linha. Plantas: os dois dias diferentes com o molde antigo recusa; os dois dias iguais com o molde novo recusa.

2. **O lugar de cada linha aplicada, escrito pelo guião.** O `aplicar-releituras.py` passa a escrever em `src/data/lugar-das-linhas.mjs` a declaração de cada linha que aplica, na forma das que lá estão, a partir da geografia do pedido da releitura (o campo `geo` do endereço: Portugal, ou a União); uma geografia que o guião não conheça pára a aplicação com a razão. Uma linha que já lá esteja com outro lugar pára também. Plantas: uma geografia desconhecida recusa; um lugar contraditório recusa.

3. **A aplicação das duas linhas** (`--linhas desempenho-das-exportacoes-2024,desempenho-das-exportacoes-2025`): o ensaio, a aplicação e o passo `--published-at`, com as provas nesta pasta (`aplicacao.json`, `aplicacao-published-at.json`, os códigos). Os valores, os excertos e os carimbos são os da releitura do motor: nenhum se escreve à mão.

4. **As outras listas que mexem.** Corre a construção e as conferências até ao fim, sem parar na primeira recusa, e trata cada lista que a mudança toca: a página das correções e das atualizações, a secção do que mudou, os inventários, as leituras e as perguntas provadas, as declarações de língua, e a frase da leitura da semana que diz quantas revisões da fonte estão por aplicar (passa a ser a da linha da habitação, sozinha; essa contagem tem de sair dos dados, não de uma frase escrita à mão). Para cada lista: se o guião a pode fechar por regra, passa a fechá-la, com uma planta; se não pode, diz porquê. No relatório, a lista inteira das que mexeram.

5. **A prova.** Por nome, cada código lido de um ficheiro: `ledger:check`, `check:cruzamento` (com o motor), `check:series`, `check:registo`, `check:cartao`, `check:leituras`, `check:frases-afirmacao`, `check:frases-reais`, `check:voz`, `check:voz-retiradas`, `check:lingua`, `check:eo1`, `check:explicacoes`, `check:lugar`, `check:indice`, `gate:html`, `typecheck`, e o que mais a mudança tocar. O `build` inteiro e a lista inteira corre-os este lugar depois da tua passagem. No relatório: o que os dois recibos imprimem de novo nas duas línguas (o valor, as três entradas de cada linha, a data de publicação), e a frase da leitura da semana como o HTML construído a imprime.

## O que fica como está, por decisão

A linha `sobrecarga-do-custo-da-habitacao-2025-ue`, com o valor de hoje e a releitura divergente à vista no recibo: entra com a recomposição do estudo da habitação, num bloco próprio. As outras razões que o guião escreve. As linhas que não mudam. O motor.

## Quando paras

Num número ou numa fonte: um valor aplicado que não seja o da releitura do motor; um excerto que não seja o que a fonte imprime; uma frase do ponto 1 que só passe mudando o que diz. Paras nesse ponto, dizes o que viste, e fazes os outros. Para tudo o resto: decide, anota e continua. Se a camada 0 pedir a lista das frases prescritas, escreve-a como `frases-cr3.json` nesta pasta e declara-a no cabeçalho deste mandato, sem mudar mais nada nele.

## O fim

Os cinco pontos, cada um no seu commit, e o relatório curto: ponto a ponto o que ficou feito, as plantas, as listas que mexeram e quais o guião passou a fechar sozinho, os códigos, o que ficou por correr fora da sandbox.
