# Adenda C ao mandato HIG-6A: a força da camada 0 (a cadeia, a ligação, as entradas que não estão na página, as asserções declaradas) (08.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura a frio da HIG-6A pelo Opus a `xhigh` (cinco plantas em cinco). É a terceira retoma da HIG-6A, por decisão escrita (`OEDP_RETOMA_DECISAO`): a leitura mediu a classe inteira, quatro Major na força da camada 0, e corrigi-los antes de aterrar custa menos do que um bloco novo. A mesma sessão e a mesma worktree.*

## §0 Medido (pela leitura a frio, que leu o código)

- `check:pre-mandato` (as plantas da camada 0) não está no `verify`, e `tests/leituras/frases-reais.mjs` (a repetição nos casos reais) não está em nenhum guião do `package.json`; nada da camada 0 corre na corrida do GitHub que guarda cada aterragem.
- As plantas em memória provam as funções auxiliares e não a ligação: tirar a regra da voz ou a dos números de `conferir()`, ou o código de saída da linha de comando (`conferir-frases.mjs:145`), deixa as 41 plantas verdes.
- Uma entrada cuja frase não está em nenhuma página passa sem aviso (`conferir-frases.mjs:101`); `validarLista` não confere a presença nem um comprimento mínimo; `nomeada` e `indicesComEntrada` casam por subcadeia, e uma FICA de uma letra cobre quase tudo.
- A regra dos quantificadores aceita qualquer `assercao` com forma de identificador (`quantificadores.py:21`); as oito declarações acrescentadas à lista da VOZ-2A não trazem prova de que existem nos livros do motor.
- Menores: um cabeçalho `Frases:` depois do primeiro título é ignorado em vez de recusado; o extrator de números da camada 0 parte «1 234,5» em dois.

## §1 O que fazes

1. **A cadeia:** `check:pre-mandato` e a repetição nos casos reais entram no `verify` (e assim na corrida do GitHub), e as plantas da régua do repositório ficam num guião com nome.
2. **A ligação provada:** uma planta por regra que só essa regra apanha (a voz, os números, os quantificadores, os pares, as frases sem entrada), a correr o `conferir()` verdadeiro; e uma prova ponta a ponta, sem substitutos, de que uma lista que recusa faz o `pre-mandato.py` sair com código diferente de zero.
3. **As entradas na página:** no pré-mandato (as listas ainda por aplicar), cada entrada tem a sua `frase` em pelo menos uma das páginas que lista, no `dist/` da cabeça, e uma `frase` com menos de doze carateres recusa-se; a repetição de uma lista já aplicada (a VOZ-2A de hoje) usa uma opção explícita em que as SAI se conferem pela ausência e as REESCREVE pela `nova`. O casamento por subcadeia continua só onde uma frase é comprovadamente parte de um bloco.
4. **As asserções declaradas:** cada `assercao` tem de existir nos livros do motor do estudo da entrada (ou das composições que o importam), lidos de `RESEARCHHUB_DIR`, e uma das suas citações tem de conter a oração com o quantificador da `nova`; as oito declarações da VOZ-2A passam essa prova, ou dizes quais não passam e paras.
5. **Os menores:** um `Frases:` fora do cabeçalho recusa-se; o extrator de números da camada 0 usa os grupos de milhares como o da paridade, com uma planta que o prova («1 234,5» e «1,234.5» iguais).
6. **O fecho:** `check:pre-mandato` (agora no `verify`), `check:paridade`, `check:voz`, o `build` inteiro, `typecheck`; o pré-mandato sobre a VOZ-2A (com a opção de lista aplicada) e sobre a VOZ-2B (recusa, com as contagens, que podem mudar com o §1.3 e o §1.4: diz como); os commits com o assunto a começar por `HIG-6A`; o relatório curto.

## §2 Quando paras

Se uma declaração de asserção da VOZ-2A não existir no motor; se a regra das entradas na página recusar a VOZ-2B por frases que lá estão (diz quais); como no mandato para o resto.

## §3 O fim

O §1, ponto 6. Setenta e cinco minutos, cento e vinte chamadas.
