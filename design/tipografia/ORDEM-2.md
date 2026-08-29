# A ORDEM DA SEGUNDA RONDA, pela ponderação da adenda

*Gerado por `programa/ordem.mjs` a partir de `MEDIDAS-2.json`. Os pesos são os da `ADENDA-2-segunda-ronda.md` §1.2, fixados antes de medir: 5·(a) + 3·(b) + 3·(c) + 2·(d) + 1·(e). A soma mais baixa é o primeiro lugar. Uma medida que dá o mesmo valor a todas as famílias pesa zero, como a adenda manda, e diz-se qual e porquê.*

## O lugar da prosa

| família | (a) medida 2, peso 5 | (b) medida 3, peso 0 | (c) medida 6, peso 3 | (d) medida 1, peso 2 | (e) medida 7, peso 1 | soma ponderada |
|---|---|---|---|---|---|---|
| Ledger | 1.º · 0.540 | — · — | 4.º · 907 | 2.º · 8.245 | 1.º · 179852 | **22** (5·1 + 3·4 + 2·2 + 1·1) |
| Source Serif 4 | 2.º · 0.421 | — · — | 3.º · 940 | 3.º · 8.215 | 3.º · 516872 | **28** (5·2 + 3·3 + 2·3 + 1·3) |
| Literata | 3.º · 0.358 | — · — | 4.º · 907 | 1.º · 8.626 | 4.º · 549200 | **33** (5·3 + 3·4 + 2·1 + 1·4) |
| Newsreader | 4.º · 0.323 | — · — | 1.º · 977 | 5.º · 7.364 | 5.º · 581340 | **38** (5·4 + 3·1 + 2·5 + 1·5) |
| Spectral | 5.º · 0.317 | — · — | 2.º · 942 | 4.º · 7.650 | 2.º · 415008 | **41** (5·5 + 3·2 + 2·4 + 1·2) |
| Parnaso Standard | — | — | — | — | — | — |
| Parnaso Small | — | — | — | — | — | — |

**As medidas que pesaram zero.**

* **(b) medida 3**, as aberturas de «e», «a» e «s» a 17 px e 1×: peso 3 na adenda, **peso 0** aqui. nenhuma família deu valor a esta medida.

O peso total que de facto ordenou foi 11 dos 14 da adenda.

**Empates dentro de uma medida:** (c) medida 6: Literata e Ledger no 4.º lugar. Um empate é um empate.

**Sem empates na soma final.**

**Com os sentidos de (c) e (d) invertidos** a ordem seria Ledger > Source Serif 4 > Literata > Newsreader > Spectral, que é a mesma: a escolha do sentido não decidiu nada.

**Os números a bater**, para o Parnaso e a Sebenta quando o pacote de teste existir:

| medida | o que é | o número a bater | de quem | sentido | peso |
|---|---|---|---|---|---|
| (a) medida 2 | a solidez do traço mais fino a 1× (tinta mediana numa corrida de 1 px) · cobertura de 0 a 1, mediana das células de 1× (cinco páginas × sete larguras) | **0.5399** | Ledger | maior é melhor | 5 |
| (b) | — | — | — | — | — |
| (c) medida 6 | a densidade de leitura a 390 × 844 (caracteres no ecrã) · caracteres estimados num ecrã de 390 × 844, na página de leitura | **977** | Newsreader | maior é melhor | 3 |
| (d) medida 1 | a altura de x a 17 px, medida no navegador · píxeis de altura de x | **8.6262** | Literata | maior é melhor | 2 |
| (e) medida 7 | os bytes do sítio, normalizados · bytes do sítio inteiro, com a Bitter | **179852** | Ledger | menor é melhor | 1 |

## O lugar do instrumento

| família | (a) medida 2, peso 5 | (b) medida 3, peso 0 | (c) medida 6, peso 0 | (d) medida 1, peso 2 | (e) medida 7, peso 1 | soma ponderada |
|---|---|---|---|---|---|---|
| Bitter | 1.º · 0.183 | — · — | — · 416.800 | 1.º · 9.038 | 2.º · 66164 | **9** (5·1 + 2·1 + 1·2) |
| Public Sans | 2.º · 0.123 | — · — | — · 416.800 | 2.º · 8.789 | 1.º · 34244 | **15** (5·2 + 2·2 + 1·1) |
| Sebenta | — | — | — | — | — | — |
| IBM Plex Sans | — | — | — | — | — | fora |

**As medidas que pesaram zero.**

* **(b) medida 3**, as aberturas de «e», «a» e «s» a 17 px e 1×: peso 3 na adenda, **peso 0** aqui. nenhuma família deu valor a esta medida.
* **(c) medida 6**, a densidade do aparelho a 390 × 844 (a altura da ficha da linha do livro-razão): peso 3 na adenda, **peso 0** aqui. todas as famílias leem o mesmo valor (416.8).

O peso total que de facto ordenou foi 8 dos 14 da adenda.

**Sem empates na soma final.**

**Com os sentidos de (c) e (d) invertidos** a ordem seria Bitter > Public Sans, que é a mesma: a escolha do sentido não decidiu nada.

**Os números a bater**, para o Parnaso e a Sebenta quando o pacote de teste existir:

| medida | o que é | o número a bater | de quem | sentido | peso |
|---|---|---|---|---|---|
| (a) medida 2 | a solidez do traço mais fino a 1× (tinta mediana numa corrida de 1 px) · cobertura de 0 a 1, mediana das células de 1× (cinco páginas × sete larguras) | **0.1835** | Bitter | maior é melhor | 5 |
| (b) | — | — | — | — | — |
| (c) medida 6 | a densidade do aparelho a 390 × 844 (a altura da ficha da linha do livro-razão) · píxeis de altura da ficha do aparelho | **416.8** | Bitter | menor é melhor | 0 · não ordenou nesta ronda |
| (d) medida 1 | a altura de x a 17 px, medida no navegador · píxeis de altura de x | **9.0384** | Bitter | maior é melhor | 2 |
| (e) medida 7 | os bytes do sítio, normalizados · bytes da família | **34244** | Public Sans | menor é melhor | 1 |

