# CAM2-A: fecho da adenda G

O catálogo anterior admitia nomes de afirmações e podia retirar atribuições da cobertura. Agora só usa linhas no âmbito de `linhaDoAmbito`, com pelo menos uma releitura, sem `afirmacao: true` nem unidade `afirmação`. Cada alternativa de indicador, unidade e período passa pelas mesmas marcas do detetor; uma alternativa tipada recusa a conferência dos modelos e identifica a linha, a língua e o campo. As marcas passaram para um módulo partilhado, sem alterar a lista nem o seu pino.

Implementação: `cfddc98b90b8852691c7380550edd5f8c2480263`. O catálogo medido tem 2632 linhas e 0 alternativas tipadas.

| Língua | Indicadores | Unidades | Períodos |
| --- | ---: | ---: | ---: |
| PT | 128 | 28 | 21 |
| EN | 128 | 28 | 21 |

As plantas exigem registo para as duas frases da leitura curta, em português e inglês. Uma linha relida com alternativa tipada é recusada, incluindo as variantes nos três campos e nas duas línguas. As plantas anteriores das citações impressas, das palavras após os números, do pino e do histórico continuam a passar.

A simulação confirmou que as 6 revisões impressas continuam a casar. Usou `abandono-escolar-precoce-2024`, com 8 releituras e ausente das revisões atuais, alterou 8 ocorrências e terminou com 0 recusas. Os modelos continuam a reconhecer 4 ocorrências PT e 4 EN, antes e depois. Comando: `node scripts/simular-painel-frases.mjs dist <medidas.json>`. A simulação altera a projeção textual em memória, sem escrever no `dist/`.

A base do histórico voltou a `d21c48f0b`, e a semente a `a00ced4b9eac3c54c57567cdb8824249fcec22dff7c9cc08ed918cd267cef1fd`. A conferência percorreu as listas abaixo. O README exige uma mudança que não seja apenas um encolhimento e uma razão escrita no commit para mover a base; um encolhimento nunca o justifica.

| Commit da lista | Entradas | Novas | Retiradas |
| --- | ---: | ---: | ---: |
| `5314456eb` | 2433 | semente | semente |
| `c745e7345` | 2427 | 0 | 6 |

A lista e o registo não mudaram nesta passagem: 2427 pendentes e 22 entradas. Não se regeneraram pinos nem se abriu uma base nova.

| Conferência final | Motor | Código |
| --- | --- | ---: |
| `npm run build` | com | 0 |
| `npm run ledger:check` | com | 0 |
| `npm run ledger:check` | sem | 0 |
| `npm run check:pre-mandato` | com | 0 |
| `npm run typecheck` | com | 0 |
| `npm run check:mortos` | com | 0 |
| `npm run check:frases-afirmacao` | com | 0 |
| `npm run check:frases-afirmacao` | sem | 0 |

As quatro corridas anteriores ao fecho também tiveram código zero: plantas, mortos, frases com motor e simulação. São doze corridas de conferências no total, contando cada comando principal uma vez; os subcomandos do build e as conferências automáticas do commit não são contados novamente.

Com o motor, o livro-razão leu os corpos das 795/795 linhas e o registo leu 21 linhas de suporte. Sem o motor, ambos declaram que não leram os corpos e `limpa=false`. Código zero sem o motor não declara prova local limpa.

A medida do catálogo usa `dadosDoCatalogo()`, as dimensões dos conjuntos por língua, `tiposDaFrase()` sobre cada alternativa e `conferirModelos()`. Todas as saídas longas correram por `sh scripts/leituras/curto.sh <registo> <comando...>`. Não houve corrida inteira dos portões, capturas, rede, instalação ou ajudantes. O custo até à escrita do relatório está nas medidas; a resposta final inclui o fecho. A linha tokens used não foi exposta.
