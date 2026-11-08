# A leitura curta das adendas C a E da HIG-6A, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 20 chamadas, 391 s, sobre o pacote `pacote-hig6a-curta-2026-11-08` (base 0b80e965b, a cabeça da leitura a frio; cabeça 4ec3181e4; `dist/` de 4ec3181e4). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| Q1 | as plantas da camada 0 saem do `verify` | 2 (Blocking) |
| Q2 | uma frase de uma letra passa o mínimo de comprimento | 4 (Major) |
| Q3 | a cobertura da asserção só pede uma citação presente | 3 (Blocking) |
| Q4 | a presença das entradas sai do resultado da camada 0 | 1 (Blocking) |
| Q5 | o resumo diz «entradas sem par» com a contagem das frases sem entrada | 5 (Major) |

Cinco plantas em cinco (as plantas com a hora de mudança igual em todos os ficheiros do pacote).

**Os achados reais e a decisão.** Dois Major, da mesma classe: a camada 0 compara o texto da lista com o da página de mais de uma maneira. Corrigidos antes de aterrar pela adenda F, a sexta retoma, com a decisão escrita:
- **6:** os pares e a nomeação comparam a `frase` com os blocos sem as etiquetas de fonte; a V009 e a V121 da VOZ-2B têm etiquetas na `frase`, e o seu par nunca se conferia.
- **7:** uma FICA de doze carateres («nesta página») nomearia frases apanhadas pela régua que a contêm.
- **Minor:** 8 (a cadeia nova não se viu correr no GitHub; falha fechada, porque uma corrida vermelha trava a aterragem), 9 (a guarda da cadeia não deteta a sua própria remoção), 10 e 11 (as plantas dos limites e as contagens da VOZ-2B; na adenda F), 12 (o GitHub confere as asserções numa revisão fixa do motor), 13 (números do relatório sem ficheiro), 14 (o Método diz 67 conferências e o `verify` tem 66 passos; o Minor da contagem, para a HIG-6B).

## O relatório do leitor (condensado)

**Blocking.** 1. No diff, `conferir()` tem `presenca:[]`. 2. No diff, o `verify` não tem `check:pre-mandato`. 3. No diff, a regra dos quantificadores aceita qualquer citação presente na `nova`.

**Major.** 4. No diff, o mínimo de comprimento é um carácter. 5. No diff, o resumo troca as contagens. 6. A frase com etiquetas de fonte salta os pares e a nomeação. 7. Uma FICA de doze carateres cobre frases que a contêm.

**Minor.** 8 a 14, como acima.

**O que está bem.** O Major 6 da leitura a frio fechado (uma planta por regra a correr o `conferir()` verdadeiro); a prova ponta a ponta do `pre-mandato.py` sem substitutos (0 numa lista limpa, 9 numa recusa); todos os caminhos de recusa acabam com código diferente de zero; a opção da lista aplicada com plantas; as asserções declaradas conferidas nos livros e nas composições, com plantas; o `Frases:` fora do cabeçalho recusado; o extrator de números com os grupos de milhares; os casos reais a bater (VOZ-2A a zero; VOZ-2B 28, 7, 15 e presença 0); o motor no GitHub fixado por um SHA inteiro, sem credenciais persistentes.
