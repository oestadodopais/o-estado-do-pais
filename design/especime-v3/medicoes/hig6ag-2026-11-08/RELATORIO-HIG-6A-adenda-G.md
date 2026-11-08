# HIG-6A, adenda G: motor na aterragem

`verify:com-motor` contém exatamente `check:pre-mandato` e `check:frases-reais`. Ambos permanecem no `verify` inteiro. O GitHub deixou de descarregar o motor e de referir a chave privada. A escolha, a conferência das partes e a união validam separadamente a reserva, recusando passos fora do verify, repetidos ou vazios.

Sem `RESEARCHHUB_DIR`, a prova da divisão contou 66 passos: 24 cobertos pelo build, 40 nas partes e os dois declarados reservados à aterragem. Nenhum terceiro passo foi retirado. A guarda da cadeia passa o controlo e recusa 12 alterações, incluindo retirar a chamada da aterragem, movê-la para depois da fusão e omitir um terceiro passo.

`aterrar.py` chama a camada 0 depois do cruzamento com a origem e antes de fundir main, herdando `RESEARCHHUB_DIR`. `preparar()` já verifica ou constrói o dist da cabeça antes de series, cruzamento e camada 0. A planta confirma esse dist e o motor no processo chamado; o código 8 da camada 0 impede a fusão, a publicação de main e o passo da Vercel. As 24 provas da ferramenta passaram.

Cabeça conferida: `ea1cf1b3f9809bafe63706cfcf132cfbd2a6393b`. Build, typecheck, partes, ferramenta de aterragem, as 12 plantas originais da união e `verify:com-motor`: código 0. A última chamada executou `check:pre-mandato` e `check:frases-reais` em sequência, ambos verdes. VOZ-2A aplicada sem recusas; VOZ-2B mantém voz 0, números 0, quantificadores 28, presença 0, pares 7 e frases sem entrada 15.

A primeira repetição dos casos reais recusou o dist da cabeça anterior, com código 1. Mantive a guarda, comitei o código e reconstruí pelo escrivão. O package.json mudou e a repetição final usou o dist da cabeça comitada. Não houve correção por enfraquecimento de uma conferência.

`check:leituras`, corrido sem motor, devolveu 1: 28 dos 29 guiões passaram. O único vermelho foi `tests/leituras/ferramentas.py`, com `Error: listen EPERM: operation not permitted 127.0.0.1`, ao abrir um servidor local na sandbox. A conferência não foi alterada. Esta recusa não é uma dependência do motor verdadeiro. A corrida remota do GitHub não foi executada nesta passagem.

Comandos, por `curto.sh`, salvo o build pedido ao escrivão:

```sh
node tests/leituras/at1-partes.mjs
python3 tests/leituras/ferramenta_aterrar.py
npm run check:pre-mandato
npm run check:frases-reais -- <temporario>/frases-reais.json
node scripts/verify-depois-do-build.mjs --prova
npm run typecheck
env -u RESEARCHHUB_DIR npm run check:leituras -- --json <temporario>/leituras.json
sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/build build
npm run verify:com-motor
```

Nove corridas, incluindo um build; zero corridas dos três portões e zero capturas. 28 chamadas até à preparação deste relatório; o total final segue na resposta. Nenhuma linha «tokens used» foi observada. O commit do fecho acrescenta apenas estas provas.
