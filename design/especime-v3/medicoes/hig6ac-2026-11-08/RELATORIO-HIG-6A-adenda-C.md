# HIG-6A, adenda C: paragem na prova das declarações

A V188 não passa a prova do §1.4. O mandato diz: «as oito declarações da VOZ-2A passam essa prova, ou dizes quais não passam e paras». A paragem é pela cobertura da oração, não pela inexistência do ID.

A declaração `e2027-no-consolidated-budget` existe em `content/06 Évora Economy/ledger.json`, no motor `cf5bd5b28b26d814315a5440d0b7dc1038e7ca1e`. O `origin_ref` de `studies-src/manifest.yml` liga a edição portuguesa do estudo a essa pasta.

A oração da `nova` da V188 é:

> Não existe nenhum orçamento consolidado oficial da Évora 2027

A citação portuguesa da asserção, na linha 2426 do livro, é:

> Não existe nenhum orçamento consolidado oficial da Évora

Falta `2027`. A outra citação está em inglês e também não contém a oração portuguesa. A citação atual contém o quantificador e é uma subcadeia da frase nova, mas isso não satisfaz a exigência de conter a oração inteira. O diagnóstico conserva o ano e não alarga a declaração nem a regra para o aceitar.

As oito declarações existem nos livros dos respetivos estudos. Sete cobrem as orações: V030, V032, V040, V152, V182, V310 e V311. A V188 é a única recusa. A prova em `declaracoes.json` guarda os livros, as orações e todas as citações das declarações. O recorte das orações no guião é específico destas oito entradas, por pontuação e conjunção antes do quantificador; não é uma implementação geral para a camada 0.

Comando medido, código 9:

```sh
sh scripts/leituras/curto.sh <temporario>/declaracoes.log python3 design/especime-v3/medicoes/hig6ac-2026-11-08/conferir-declaracoes.py <temporario>/declaracoes.json
```

Não foram alterados o motor, as listas nem os guiões de produção. Ficaram pendentes a cadeia, as plantas da ligação, a presença das entradas, a validação das asserções em produção, os menores e o fecho solicitado. Não correram build, verify, check:pre-mandato, check:paridade, check:voz ou typecheck, por aplicação da condição de paragem.

Custo: uma corrida de medição; 9 chamadas de ferramentas até à redação deste relatório. A resposta final regista a contagem depois do commit e da conferência da árvore.
