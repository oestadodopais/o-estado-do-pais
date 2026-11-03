# Adenda K ao mandato EV3: a contagem dos blocos da prova da voz depois da adenda J (03.11.2026)

Acrescenta: nada

*A mesma sessão. O `core.gate` do motor correu uma vez, para a aterragem, em `c9a7a06` (17:20 a 17:32 UTC), e deu um só vermelho: `publisher.voz_test`, "as contagens da passagem mudaram", com `blocos_antes` 2922 e `blocos_depois` 2819 contra 2920 e 2817. Os outros módulos e as duas edições de Évora 2027 deram ok.*

## §0 A medida deste lugar

A adenda J partiu um parágrafo em dois em cada edição de Évora 2027. Medido por guião nos registos do motor: os blocos de cada edição passaram de 136 em `bf6b88a` a 137 em `c9a7a06`, mais um por edição; as referências não mudaram (`refs_antes` 8390 e `refs_depois` 8382, iguais ao esperado). A diferença do teste é exatamente essa: mais dois blocos antes e depois.

## §1 O que fazes

Em `publisher/voz_test.py`, a parcela da EV3 nos blocos passa de `+ 4` a `+ 6`, em `blocos_antes` e em `blocos_depois`, e o comentário da EV3 passa a: "EV3: duas edições com mais 20 referências e três blocos cada (a adenda J partiu um parágrafo em dois em cada edição), medidos no registo." Nada mais muda. Confirma por guião que os blocos das duas edições são 137 e que é essa a única diferença; corres só `python3 -m publisher.voz_test` (verde) e comitas pelo `comitar.sh` (o escrivão corre com `OEDP_GATE=adiado`; o `core.gate` inteiro corre a seguir, pelo lugar de direção).

## §2 Quando paras

Se a diferença não for só a dos dois blocos (diz qual), ou se o teste pedir outra mudança.

## §3 O fim

Um commit no motor, o código do `voz_test` e a medida dos blocos no relatório. Dez minutos, quinze chamadas.
