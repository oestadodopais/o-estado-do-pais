# Mandato COR-AGUA, primeira passagem: a camada 0 compara os números depois de aplicar a lista, e uma SAI ou uma REESCREVE nomeia as frases que contém (08.11.2026)

Acrescenta: nada
Medidas: medidas-coragua-1.json

*Escrito pelo lugar de direção (Claude Opus 5.5). A COR-AGUA corrige os dois estudos da água nas duas edições. A segunda passagem (uma adenda, com o cabeçalho `Frases:`) aplica a lista; esta prepara a camada 0 para uma correção que conserta uma assimetria, o primeiro uso real que a HIG-6A não previa. A lista da COR-AGUA está em `design/especime-v3/medicoes/coragua-2026-11-08/FRASES-COR-AGUA.json`, escrita por este lugar, com cada `frase` cortada por guião do bloco construído.*

## §0 Medido

- A lista tem 91 entradas: 54 escritas por este lugar (43 para os factos, nas fontes guardadas e lidas a 08.11.2026; 7 gémeos que faltavam às entradas da VOZ-2B; 4 para as duas edições dizerem os mesmos números) e 37 da VOZ-2B para os mesmos dois estudos (as cinco que a COR-AGUA já muda ficaram de fora).
- A camada 0 da HIG-6A, corrida a seco sobre o `dist/` da cabeça da HIG-6A com o motor: voz 0, quantificadores 0, presença 0, pares 0; números recusados nos dois estudos; cinco frases apanhadas pela régua sem entrada.
- **Os números:** `conferirNumeros` compara, por estudo, os números que cada edição perde e ganha. Quando as duas edições já diferem (o defeito que a COR-AGUA corrige), o português perde números que o inglês nunca teve e o contrário, e a regra recusa uma lista certa. Aplicada a lista aos blocos de `blocosDe` (a REESCREVE troca a `frase` pela `nova`, a SAI tira-a) e comparadas as duas edições com `compara` (`scripts/paridade-numeros.mjs`), as diferenças são zero nos dois estudos.
- **A nomeação:** as cinco frases sem entrada estão dentro da `frase` de uma SAI ou de uma REESCREVE (os blocos do boletim de 27 de julho, do conflito do fim do ano hidrológico e da tarifa de 2026). `nomeada` só aceita a frase apanhada quando ela contém a `frase` da entrada, e não quando a `frase` da entrada a contém.

## §1 O que fazes

1. **Os números depois de aplicada a lista:** a regra dos números da camada 0 passa a aplicar a lista aos blocos das duas edições de cada estudo bilingue da lista (o documento e a página, como o `check:paridade` os lê) e a comparar o resultado com `compara`; recusa uma diferença que não seja exatamente uma exceção em vigor de `scripts/paridade-excecoes.json` para esse estudo e esse tipo. Uma entrada cuja `frase` não se aplica num bloco recusa-se (já é a presença; diz como as duas regras se ligam). A regra antiga sai.
   Plantas: uma lista que conserta uma assimetria (o português perde um número que o inglês nunca teve) passa; uma REESCREVE portuguesa que muda um número sem o gémeo inglês recusa-se; uma lista que deixa uma diferença nova num estudo sem exceção recusa-se; uma diferença igual a uma exceção em vigor passa.
2. **A nomeação por inclusão:** uma SAI ou uma REESCREVE nomeia uma frase apanhada pela régua quando a sua `frase` está nela ou quando ela está na sua `frase`; uma FICA continua a nomear só a frase inteira. Plantas: uma SAI de um bloco inteiro nomeia as frases apanhadas dentro dele; a FICA «nesta página» continua a não nomear «Nada nesta página é aconselhamento.».
3. **Os casos reais:** a VOZ-2A aplicada continua a zero; a COR-AGUA, sobre o `dist/` desta cabeça, dá zero em todas as regras; a repetição em `tests/leituras/frases-reais.mjs` afirma-o. As contagens da VOZ-2B podem mudar com o §1.1 e o §1.2: diz quais e porquê, e fixa as novas.
4. **O fecho:** `check:pre-mandato`, `check:frases-reais`, `typecheck`; o `build` só se mudares algo que ele leia; os commits com o assunto a começar por `COR-AGUA`; o relatório curto.

## §2 Quando paras

Se a regra nova, bem implementada, recusar a VOZ-2A aplicada ou a lista da COR-AGUA, paras e dizes a entrada e a diferença; os teus erros de implementação corriges e segues, e dizes quais.

## §3 O fim

O §1, ponto 4. Quarenta e cinco minutos, sessenta chamadas.
