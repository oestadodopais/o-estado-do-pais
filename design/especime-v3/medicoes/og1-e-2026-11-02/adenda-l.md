# OG1-E, adenda L: conclusão da retoma da K

As três declarações vivas das linhas 3902, 3947 e 5408 voltaram, carácter a carácter, ao texto de d04ec4740. A entrada inglesa da habitação conserva os espaços junto da marca de «pelo menos», já repostos na K. Nenhuma outra linha do inventário mudou nesta retoma; nenhuma retirada mudou.

A extração de voz e as duas funções de leitura em medir-defeitos.mjs foram comparadas com d04ec4740 e são iguais. A voz passou nas páginas atuais. A prova em memória conferiu 1 238 retiradas; a prova real correu duas vezes, com controlo a 0 e quatro plantas simultâneas a 1. A medição consumida pela voz confirmou a DGAL (3900), as duas entradas antigas da habitação (5437 e 5438) e a lei (916), cada planta numa página distinta. As quatro páginas originais ficaram intactas. Os códigos e tempos reais estão em adenda-k-plantas.json: controlo 132.570 s; plantas 94.171 s.

| Conferência | Código lido | Segundos |
| --- | --- | --- |
| check:voz | 0 | 120 |
| check:voz-retiradas | 0 | 239 |
| check:registo | 0 | 5 |
| check:lingua | 0 | 42 |
| typecheck | 0 | 1 |
| build inteiro pelo escrivão | 0 | 492 |

O tempo do build foi calculado pelos ficheiros build.inicio e build.fim; o código foi lido de build.codigo e copiado para adenda-l-build.codigo. As durações dirigidas são as medidas por curto.sh, arredondadas ao segundo. O build passou também as conferências da sua cadeia. Não houve verify integral, capturas ou alteração do motor.

A K tinha ficado no commit aa9e3a135, feito pelo lugar de direção. Os commits desta retoma são d21fd6aa (inventário) e 04c2eb9f (prova); este relatório fica num commit próprio. Nenhuma frase do leitor mudou e nenhuma régua foi enfraquecida.

Custo até à escrita deste relatório: 25 chamadas de ferramentas, cinco corridas dirigidas e um build inteiro. As duas execuções reais da voz estão incluídas na corrida de check:voz-retiradas.
