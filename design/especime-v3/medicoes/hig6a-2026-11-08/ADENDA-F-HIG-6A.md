# Adenda F ao mandato HIG-6A: uma só procura das frases em todas as regras, e as FICA pela frase inteira (08.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta das adendas C a E (cinco plantas em cinco). Sexta retoma, por decisão escrita: a leitura mediu a classe, a camada 0 a comparar o texto da lista com o texto da página de mais de uma maneira. A mesma sessão e a mesma worktree.*

## §0 Medido (pela leitura curta, que leu o código)

- A presença procura a `frase` com as etiquetas de fonte; o ciclo dos pares, `indicesComEntrada` e `nomeada` comparam-na com os blocos sem as etiquetas (`conferir-frases.mjs:25`, `:62`, `:120`, `:128`, `:147`). A V009 e a V121 da VOZ-2B têm etiquetas na `frase`: o seu par nunca se confere e não nomeiam nenhuma frase do seu bloco.
- `nomeada` aceita uma entrada cuja `frase` esteja dentro da frase apanhada: uma FICA de doze carateres («nesta página») nomearia duas das quinze frases sem entrada da VOZ-2B.
- Nenhuma planta prova o limite de doze carateres (só uma `frase` de um carácter); a repetição nos casos reais não afirma os 28 quantificadores, nem a voz 0 e os números 0 da VOZ-2B.

## §1 O que fazes

1. **Uma só procura:** uma função única que diz se e onde a `frase` (ou a `nova`) de uma entrada está num bloco, com e sem as etiquetas de fonte, usada pela presença, pelos pares, por `indicesComEntrada` e por `nomeada`. Uma planta: uma REESCREVE com uma etiqueta de fonte na `frase`, num estudo bilingue, tem o seu par conferido (e recusado quando o gémeo falta).
2. **As FICA pela frase inteira:** uma FICA só nomeia uma frase apanhada pela régua quando a sua `frase` é essa frase inteira (normalizada); uma REESCREVE ou uma SAI nomeia-a quando a sua `frase` está nela (a entrada muda essa frase). Uma planta: a FICA «nesta página» não nomeia «Nada nesta página é aconselhamento.».
3. **As plantas dos limites:** uma `frase` de onze carateres recusa-se e uma de doze passa; a repetição nos casos reais afirma, para a VOZ-2B, voz 0, números 0, os 28 quantificadores, os sete pares e as quinze frases sem entrada (as contagens podem mudar com o §1.1 e o §1.2: diz quais e porquê).
4. **O fecho:** `check:pre-mandato`, `check:frases-reais`, `typecheck`; o `build` só se mudares algo que ele leia; os commits com o assunto a começar por `HIG-6A`; o relatório curto.

## §2 Quando paras

Só se a regra, bem implementada, recusar a VOZ-2A aplicada; os teus erros de implementação corriges e segues, e dizes quais.

## §3 O fim

O §1, ponto 4. Quarenta e cinco minutos, sessenta chamadas.
