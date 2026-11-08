# HIG-6A, adenda E: fecho

Cabeça de código conferida: `a6d8a810243debb114ae6782d184537ace8881b0`. O `dist/version.json` coincide com essa cabeça. O commit deste relatório acrescenta apenas provas e registo. Motor lido: `cf5bd5b28b26d814315a5440d0b7dc1038e7ca1e`, sem alterações.

A camada 0 confere a presença com os selos e depois sem eles, exige doze carateres em `frase`, recusa entradas ausentes e oferece `--aplicada` para conferir a ausência das SAI e a nova das REESCREVE. O casamento por subcadeia para cobertura exige uma frase comprovada no bloco. Um `Frases:` fora do cabeçalho recusa-se. Os grupos de milhares usam o extrator da paridade, conservando a distinção entre 1,2 e 12.

As oito declarações da VOZ-2A passam a regra do motor, incluindo V188: ID existente nos livros permitidos e citações presentes na nova que cobrem todas as ocorrências do quantificador. As plantas recusam ID alheio, citação ausente, citação sem o quantificador e segunda ocorrência descoberta; aceitam a composição que declara a importação da fonte.

`check:pre-mandato`, `check:frases-reais` e `check:repositorio` estão no `verify`. O planeador real colocou cada um uma única vez na parte 4 e conferiu a união. O workflow prepara uma cópia do motor na revisão fixada antes das conferências. A execução remota e o acesso ao motor no GitHub não foram verificados nesta sandbox; o workflow prevê `RESEARCHHUB_READ_TOKEN` para acesso de leitura. O pré-mandato não faz pedidos de rede.

| Conferência | Código |
| --- | ---: |
| build integral da cabeça corrigida | 0 |
| check:pre-mandato | 0 |
| check:paridade | 0 |
| check:voz, na cadeia do build | 0 |
| check:frases-reais e check:repositorio | 0 |
| typecheck | 0 |
| Pré-mandato VOZ-2A com --aplicada | 0 |
| Pré-mandato VOZ-2B, recusa esperada | 9 |

VOZ-2A: zero recusas. VOZ-2B: voz 0, números 0, quantificadores sem declaração 28, presença 0, pares em falta 7, frases sem entrada 15. Sem par: V012, V093, V094, V100, V124, V293 e V296. As contagens da adenda B mantêm-se; a regra nova de presença encontra todas as entradas. O limite da V122 continua declarado para a HIG-6B.

O check:pre-mandato passou 41 plantas e controlos de memória, 24 da ligação, 52 testes Python e seis desligamentos da cadeia. A ligação inclui uma recusa exclusiva por regra no conferir verdadeiro e um pré-mandato ponta a ponta, sem substituir executáveis ou funções. As seis plantas originais da paridade e as 20 do repositório continuam verdes. Os casos históricos conservam as dez frases recusadas pela voz e as três frases distintas com quantificadores antes da adenda G.

Erros corrigidos nesta passagem: a presença retirava selos incluídos nas frases; a leitura de rotas adicionais alargava indevidamente a cobertura a outro estudo, produzindo 27 recusas fora do âmbito; e a planta da terceira retoma herdava a decisão autorizadora da passagem. Os selos são conservados na primeira procura, as rotas adicionais servem apenas a presença e o teste das retomas limpa essa variável. Foram acrescentados controlos para o âmbito. A segunda construção foi necessária para conferir o dist na cabeça corrigida.

Comandos de fecho, com saídas longas guardadas por `curto.sh`:

```sh
npm run check:pre-mandato
npm run check:paridade
npm run check:repositorio
npm run typecheck
sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/build-final build
npm run check:frases-reais -- <temporario>/frases-reais.json
python3 scripts/leituras/pre-mandato.py . design/especime-v3/medicoes/hig6ab-2026-11-08/pre-voz2a.md --aplicada
python3 scripts/leituras/pre-mandato.py . design/especime-v3/medicoes/hig6ab-2026-11-08/pre-voz2b.md
```

Custo medido: 26 corridas de conferências ou medições, incluindo duas construções integrais pelo perfil build (ambas código 0). Não houve corrida conjunta dos três portões, capturas ou conferências do motor. 32 chamadas até ao início da redação deste relatório; a resposta final regista a contagem depois do commit e da conferência da árvore.
