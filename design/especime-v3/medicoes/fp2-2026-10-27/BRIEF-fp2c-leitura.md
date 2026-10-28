# FP2-c · a correção dirigida depois da leitura a frio do FP2 (27.10.2026, 23:38 UTC, o lugar de direção)

*A leitura a frio do FP2 pelo Claude Opus 5.5 (`LEITURA-ANTERIOR-opus.md` neste pacote) apanhou as cinco plantas e deixou dois Major reais sobre as frases que a primeira página passou a mostrar: a primeira frase da conclusão da Saúde não dizia nada a um leitor de primeira vez («As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto»), e o achado estava na segunda frase; e, no Orçamento, «um saldo de 0,1 % do PIB» não dizia se é excedente ou défice, «a UTAO» não tinha glosa na primeira página, e «889 milhões líquidos» não tinha moeda. O lugar de direção fez esta correção dirigida nos dados dos itens (§1.202 (1)); nenhum valor, nenhuma linha e nenhuma régua mudam. Sem travessões.*

## O que muda, e só isto

1. **A conclusão da Saúde** (`src/data/discussao.mjs`, o primeiro parágrafo da secção `conclusao`, nas duas edições): a frase dos números passa a primeira («Para 2027, a despesa total da Saúde está orçamentada 267,5 milhões de euros abaixo da estimativa de 2026, e a despesa efetiva varia −259,3 milhões de euros, porque o PRR acaba: fora do PRR, a despesa efetiva sobe 511,8 milhões de euros face aos 771,1 que o PRR deixa.»; em inglês «In 2027, total Health expenditure is budgeted 267,5 million euros below the estimate for 2026, and effective expenditure changes by −259,3 million euros, because the RRP ends: outside the RRP, effective expenditure rises 511,8 million euros against the 771,1 the RRP leaves.») e a frase das três afirmações passa a segunda, palavra por palavra como estava. Os valores são os mesmos tokens das mesmas linhas; é a frase corrigida a 27.10 (§1.206), agora à cabeça.
2. **A conclusão do Orçamento** (`src/data/discussao-og1.mjs`, o primeiro parágrafo, nas duas edições): «um saldo de» passa a «um excedente de» («a balance of» a «a surplus of»), porque o valor da linha `pm-q3-3-r37-c3` é positivo e a opinião do mesmo item já diz «excedente de 0,1 %»; «a UTAO» leva a glosa que o sítio já usa, «a UTAO, a unidade técnica de apoio orçamental do Parlamento,» («the UTAO, Parliament's technical budget support unit,»).
3. **A conclusão das parcerias rodoviárias** (`src/data/discussao.mjs`, o primeiro parágrafo): o sufixo do valor passa de « milhões» a « milhões de euros» (em inglês « million euros» explícito, onde antes o sufixo vinha por omissão como « million»).

## O que não muda

Nenhum valor, nenhuma linha do livro-razão, nenhuma régua, nenhuma folha de estilos, nenhum ficheiro além dos dois ficheiros de dados e deste relatório; a ordem dos itens, as datas `publicado`, a caixa, a página dos itens fora destes três parágrafos.

## As conferências corridas depois da correção (os códigos nos ficheiros da sessão)

`npm run build` (com `check:discussao`, `check:voz`, `check:lingua`, `gate:html`, `check:datas` dentro), `check:primeira`, `check:frases-compostas`, `check:sobreposicao`, `check:discussao`. A corrida inteira do `verify` correu verde na cabeça anterior (53 passos, 0 vermelhos, 23:24 UTC); o portão do GitHub corre-a de novo na cabeça que aterra.
