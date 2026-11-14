# Adenda F do COR3: a conferência do título no corpo alojado, na corrida do GitHub (14.11.2026)

Acrescenta: nada

*Escrita e feita pelo lugar de direção (Claude Fable 5.2), como correção dirigida; lida depois pelo Codex `gpt-6-astra`, que é outra família. Não muda página nenhuma, linha nenhuma nem frase nenhuma: muda uma conferência.*

## Porquê

A aterragem do COR3 parou a 14.11.2026 porque a corrida `portão` do GitHub ficou vermelha na cabeça `b44d7f4a2`, numa só conferência: `npm run check:frases-afirmacao`, em `tests/cor3/titulos-frases.mjs`, com a mensagem «o controlo exige o corpo alojado». A conferência nasceu neste bloco (a adenda B) e prova que o título de uma notícia citado numa frase está no corpo alojado do documento. Os corpos alojados vivem no motor, que é privado, e a corrida do GitHub não o tem: aí a leitura dos corpos devolve «não leu os corpos: RESEARCHHUB_DIR ausente», e a conferência irmã (`scripts/check-frases-afirmacao.mjs`) já aceita esse estado e di-lo. Esta exigia o corpo em todo o lado, e por isso só podia passar na máquina. Na máquina passou sempre (na lista inteira e no passo `frases-afirmacao` da aterragem).

## O que muda

Em `tests/cor3/titulos-frases.mjs`, o controlo do corpo (o título lido no corpo, e a planta das palavras inventadas) fica por correr só quando as três coisas são verdade ao mesmo tempo: a corrida é a do GitHub (`GITHUB_ACTIONS` com o valor `true`), `RESEARCHHUB_DIR` não está definida, e a leitura dos corpos devolveu o estado «não leu os corpos: RESEARCHHUB_DIR ausente». Nesse caso a conferência imprime que a prova do corpo não correu ali e que corre na máquina da aterragem. Em qualquer outro caso fica como estava: sem o corpo, recusa. As recusas do contexto, do título inventado e do resumo em falta correm em todo o lado.

## O que fica como está, por decisão

A aterragem continua a correr `check:frases-afirmacao` na máquina, com o motor, antes de fundir; a lista inteira também. A conferência não aprende a saltar em mais lado nenhum.

## A prova

Quatro corridas da conferência, cada código lido de um ficheiro em `cor3-f-conferencias/`: na máquina com o motor (0, com o controlo do corpo); na máquina sem o motor (1, pela mensagem do corpo); como o GitHub, sem o motor (0, a dizer que a prova do corpo não correu); como o GitHub, com o motor (0, com o controlo do corpo). E a cadeia inteira de `check:frases-afirmacao` corrida como o GitHub a corre, sem o motor: 0.
