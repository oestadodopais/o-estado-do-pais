# HIG-6A, adenda F: procura única e FICA inteira

A presença, os pares, os índices com entrada e a cobertura usam `procurarFrase`. A ocorrência conserva a correspondência entre o texto com selos e o texto sem selos. Uma FICA só cobre a frase inteira normalizada; SAI e REESCREVE cobrem a frase que contém o trecho alterado. Na revisão, corrigi também a normalização de espaços separados por U+200B e acrescentei a prova.

`check:pre-mandato`, `check:frases-reais` e `typecheck`: código 0. A ligação passa 38 plantas e controlos, incluindo selo no meio, par em falta e presente, FICA curta e inteira, limites de onze e doze carateres e lista aplicada. A repetição real afirma agora também voz 0, números 0 e 28 quantificadores na VOZ-2B.

VOZ-2A aplicada: nenhuma recusa. VOZ-2B: voz 0, números 0, quantificadores 28, presença 0, pares 7 e frases sem entrada 15. Os pares em falta são V012, V093, V094, V100, V124, V293 e V296. As contagens não mudaram: V009 e V121 são agora encontradas no bloco 85 das respetivas páginas, que já tinha entradas gémeas. As quinze frases sem entrada são idênticas às da adenda E. O limite de uma frase gémea por mudar dentro de um bloco com par, como V122, continua reservado à HIG-6B.

Comandos finais, por `curto.sh`:

```sh
npm run check:pre-mandato
npm run check:frases-reais -- <temporario>/frases-reais.json
npm run typecheck
```

Os casos reais correram com as alterações desta passagem sobre o `dist/` da cabeça 4ec3181e42c6a33375129b9ab815e7c9b9a740c3, conferida pelo guião antes do commit. Não houve alterações a páginas nem a código lido pelo build, pelo que não se reconstruiu. O commit desta passagem muda apenas a conferência, as plantas, a documentação e estas provas.

Custo: oito corridas de conferências ou medições (duas da ligação, duas de `check:pre-mandato`, uma de casos reais, uma de typecheck e duas medições locais). Zero builds, portões completos ou capturas. Quinze chamadas até à preparação deste relatório; o total final segue na resposta. Nenhuma linha «tokens used» foi observada.
