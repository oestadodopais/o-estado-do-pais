# Adenda A ao mandato REC2: os quatro vermelhos da corrida inteira e dois achados da leitura a frio (11.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da corrida inteira por guião na tua cabeça `6521a7da0` (72 passos, quatro vermelhos) e da leitura a frio do Claude Opus 5.5 (cinco plantas em cinco). Os oito pontos ficam como estão. Uma construção normal no máximo: setenta e cinco minutos e cento e vinte chamadas, contadas com as de qualquer sessão auxiliar; não lances sessões auxiliares nesta passagem. Um commit por ponto. O teu relatório vai para `RELATORIO-REC2-A.txt`, nesta pasta, e lista o código final de cada conferência que correres, incluindo as que derem vermelho.*

## O que mudas

1. **`check:publicadores` vermelho.** `tests/og1e/publicadores.mjs` (linha 43) pede a primeira edição servida de um estudo retirado e rebenta com a recusa da data de publicação em falta. A amostra passa para um estudo publicado que tenha a forma que o teste mede, e a planta prova que ainda morde.

2. **`check:eo1` vermelho.** `tests/eo1/maquinaria.mjs` (linha 94) abre a página construída de `evora-2027-prometido-painel-dinheiro`, que já não existe. A amostra passa para o estudo que lhe sucedeu, se a forma medida lá existir, ou para outro estudo publicado que a tenha; dizes qual e porquê.

3. **`check:alvos` vermelho nas fatias 0 e 2.** A conferência H1 acha dois nós com a ordem dos títulos quebrada (`heading-order`, moderado) nas rotas medidas. Antes deste bloco a corrida inteira estava verde: procura a página em que a saída das notas de sucessão, ou de outra coisa que este bloco tirou, deixou um título a saltar um nível, e corrige a página. A régua não muda. Corre as três fatias pelo escrivão e diz a rota e o elemento.

4. **A definição da contagem de Évora** (`src/data/o-que-e-das-familias.mjs`, as duas frases da família desta linha). A derivação já conta os trabalhos publicados cujo objeto é Évora; a definição ainda fala do critério antigo. Passa a ser, letra por letra:
   - pt: «É o número de estudos publicados cujo objeto é o concelho de Évora.»
   - en: «It is the number of studies published whose subject is the municipality of Évora.»
   
   Confere-as no HTML construído do recibo da linha `estudos-evora-publicados`, nas duas edições.

5. **O salto na contagem dos registos só vale para os retirados** (`scripts/gate-html.mjs`, a contagem que percorre a travessia dos registos). Hoje salta qualquer registo que não tenha uma edição publicada. Passa a saltar só os registos de trabalhos com o estado retirado; outro registo sem edição publicada recusa como antes deste bloco. Planta dos dois lados.

## O que fica como está

Tudo o resto. A linha `edicoes-publicadas`, que mudaste sem o mandato pedir, fica: a conta bate (nove edições dos seis).

## A prova

O `build` da cabeça; `check:publicadores`, `check:eo1`, `check:alvos` (as três fatias), `check:rec2`, `gate:html`, `check:voz`, `check:registo`, `ledger:check`, `typecheck` e o que mais a mudança tocar. A lista inteira corre-a o lugar de direção.

## Quando paras

Não há paragem prevista. Decide, anota e continua.

## O fim

Os cinco pontos, cada um no seu commit (o assunto a começar por `REC2`), e o relatório com cada planta e o que deu, a rota e o elemento do ponto 3, as duas frases do ponto 4 como o HTML as imprime, e todos os códigos finais.
