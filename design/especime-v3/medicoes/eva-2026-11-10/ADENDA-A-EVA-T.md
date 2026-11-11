# Adenda A ao mandato EVA-T: quatro correções da leitura a frio e o vermelho da corrida inteira (11.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da leitura a frio do Claude Opus 5.5 sobre a tua passagem (cinco plantas em cinco). Os nove pontos ficam como estão; estas são as quatro coisas reais que a leitura deixou, e o único vermelho da corrida inteira que este lugar correu por guião na tua cabeça (72 passos, um vermelho). Só o sítio: o motor não muda. Uma construção normal no máximo, setenta e cinco minutos e cento e vinte chamadas, um commit por ponto. O teu relatório vai para `RELATORIO-EVA-T-A.txt`, nesta pasta.*

## O que mudas

1. **O título copiado para outras páginas volta a conferir-se contra a página de destino** (`scripts/titulos-copiados.mjs`). Na tua passagem, para todas as rotas de estudo, o título copiado passou a comparar-se com o `title` de `studies.mjs`, e, quando a língua não tem edição, com o de outra língua. A régua protegia isto: o que uma lista imprime como título de um estudo é o que a página desse estudo imprime. Volta a ler a página de destino construída: o título copiado tem de ser, letra por letra, o `<h1>` dessa página ou, quando ela tem a linha do nome em itálico logo abaixo do `<h1>`, essa linha. Sem `studies.mjs` e sem recurso a outra língua. Plantas: uma lista com um título que a página do estudo não imprime recusa, para um estudo que não seja o das contas de Évora; o título de outra língua recusa; a manchete do estudo das contas copiada para uma lista em vez do nome passa só se for letra por letra o `<h1>`.

2. **O teto de data na contagem do registo só toca na conta que foi retirada** (`src/lib/ledger.mjs`, `contagensDoRegisto`). A linha que salta as correções posteriores à data selada de `correcoes-publicadas` está a parar também `atualizacoes_publicadas` e `revisoes_de_proveniencia`, que alimentam expressões conferidas do livro. O teto fica só na conta das correções publicadas. A planta de `tests/edicoes/reguas.mjs` passa a cortar a lista que a conta de facto usa; uma atualização e uma revisão de proveniência com data posterior à data selada continuam a contar (planta).

3. **A prova documental do texto julgado conserva as guardas de caminho da C1** (`scripts/corpo-documental-julgado.mjs`): um caminho que não comece por `content/` ou que tenha `..` recusa, como na via antiga (plantas das duas formas).

4. **O recibo diz que ficheiro foi relido, quando a linha mudou de fonte.** No recibo de `evora-execucao-da-receita-2021`, por baixo da fonte nova, lê-se hoje que o ficheiro da fonte foi relido a 01.09.2026 e confirmou o valor anterior. O ficheiro relido nesse dia foi o da fonte anterior. A regra, para todas as linhas e por régua: quando o endereço de uma reconferência não é o endereço da fonte que a linha tem hoje, a frase passa a ser:
   - pt: «Ficheiro da fonte anterior relido a ⟦data⟧, confirmou o valor anterior: ⟦valor⟧»
   - en: «Previous source file read again on ⟦data⟧, confirmed the previous value: ⟦valor⟧»
   
   O token da data dá a data da reconferência na forma que o recibo já usa; o do valor, o valor antigo como a linha o guarda. O resto da linha do recibo fica como está. Mede antes em quantas linhas do livro uma reconferência tem um endereço diferente do da fonte de hoje, e diz o número e as linhas. Planta: uma linha com a reconferência no endereço da fonte de hoje conserva a frase de hoje; uma com outro endereço que imprima a frase de hoje recusa.

5. **O `check:indice` (a conferência I9, em `tests/livro/indice.mjs`) deu vermelho na corrida inteira.** Refaz do `git` a data de publicação de cada documento e encontra `2026-10-01` onde `src/data/datas-de-publicacao.json` declara agora `2026-11-11`, nas duas edições deste estudo. A I9 passa a aceitar, para uma entrada com a origem `edicao-unica`, a data da única versão do manifesto, pela mesma função que a régua das datas já usa; para todas as outras entradas fica como está, contra o `git`. Plantas: uma entrada `edicao-unica` com uma data diferente da da sua versão recusa; uma entrada sem essa origem com uma data diferente da do `git` recusa como hoje. Corre o `check:indice` inteiro pelo escrivão, com o navegador.

## O que fica como está

Tudo o resto da tua passagem. A data de leitura da fonte da linha de 2021 (10.08.2026) fica: o registo da recolha no motor guarda o endereço e o resumo deste PDF, com essa data.

## A prova

O `build` da cabeça; `check:indice`, `check:documentos`, `check:voz`, `check:edicoes`, `check:registo`, `ledger:check`, `check:frases-afirmacao`, `check:lingua`, `check:paridade`, `gate:html`, `typecheck`, as plantas `tests/eva/*` e o que mais a mudança tocar. A lista inteira corre-a o lugar de direção. No relatório, a frase do ponto 4 tal como o HTML construído a imprime, nas duas edições.

## Quando paras

Não há paragem prevista. Decide, anota e continua.

## O fim

Os cinco pontos, cada um no seu commit (o assunto a começar por `EVA`), e o relatório com cada planta e o que deu, a medição do ponto 4 e os códigos.
