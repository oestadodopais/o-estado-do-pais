A quarta leitura a frio do C1 (as passagens C1e e C1f), pelo Claude Opus 5.5, está em `design/especime-v3/critica/LEITURA-c1ef-2026-09-28.md`, com o registo das plantas. Retomas a mesma sessão e fazes a passagem **C1g**, a última antes da aterragem, com as regras de sempre (caminhos explícitos, nenhum `push`, uma construção de cada vez, os trailers, a resposta curta num ficheiro teu e o `-o` fora do ramo). A semana do Codex está perto do fim: faz só o que está abaixo, sem medições que o mandato não peça.

## A triagem do lugar de direção

Os achados 1, 2, 3, 4 e 10 são as cinco plantas. O 5, no que toca ao que um leitor não percebe nos recibos do PRR, entra na I170, que passa a cobrir também os cinco recibos do PRR. O resto faz-se, por esta ordem:

1. **A conferência da privacidade sai da construção de produção** (achado 7). A Vercel constrói com `npm run build` numa máquina com outra pasta pessoal e com uma cópia rasa do Git, e a conferência depende das duas coisas: sai da cadeia do `build` e fica na do `verify`, que a corrida «portão» corre com a história inteira; e, onde corra, uma pasta pessoal cujo nome é curto ou genérico (a raiz, ou um nome que é também uma palavra de código) não vira uma cadeia proibida. O relatório diz em que máquinas ela corre.
2. **As datas das razões na forma da casa** (achado 5): as razões das dez entradas reconstituídas escrevem as datas como `04.08.2026`, e a frase diz «pela história pública do repositório (o commit 8371e097)» em vez de «pela história do Git».
3. **As plantas que não podiam falhar passam a poder** (achados 8 e 9): as da forma do valor encontrado passam pela comparação da página que o `gate-html.mjs` faz; a do «recurso posterior à entrada» isola a sua condição (a data a 18.08 com um recurso de 19.08, como a leitura propõe).
4. **O que é pequeno**: o início sem data desenha-se tracejado só do lado do início (achado 11); a frase das linhas calculadas só se escreve quando a linha tem a expressão que se reavalia (achado 12); o `ledger/README.md` diz que o primeiro `old_value` de uma cadeia não se confere (achado 13); o registo do cruzamento diz a data da edição, 28.09.2026, e as contagens como o README as define (achado 14); a I170 volta para dentro da tabela (achado 15); a tabela dos commits cita os assuntos à letra (achado 16); as secções C1e e C1f dizem o custo em símbolos e em segundos (achado 17).
5. **As capturas e a aceitação** (achado 6): capturas na cabeça final de uma amostra dos recibos que a C1e mudou (as sete tentativas sem valor lido, a dívida das famílias da União, três linhas calculadas, a faixa de Évora), nas duas edições e nas cinco larguras; a aceitação integral só se declara com elas, e o relatório diz quantas das 337 se capturaram.

## Depois

Os três portões inteiros na cabeça final, cada um no seu comando com o código em `portoes/c1g/`; a secção C1g no `LEIA-ME.md`; o `medidas.json` com `conferir-relatorio.py` a zero faltas.
