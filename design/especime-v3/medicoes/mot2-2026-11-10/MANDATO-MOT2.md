# Mandato MOT2: fechar o que a leitura curta do MOT1 deixou aberto (10.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do motor `mot1-2026-11-10`, sobre a cabeça `27c3ada`. A leitura curta da adenda B do MOT1 pelo Claude Opus 5.5 (`leitor`) apanhou as cinco plantas do pacote e deixou quatro coisas reais, que são este mandato. Lê primeiro o mandato do MOT1, as adendas A e B e o teu relatório da adenda B (na pasta `mot1-2026-11-10` das medições). Uma só passagem; o motor aterra com o MOT1 e o MOT2 juntos.*

## O que fazes

1. **Uma referência que imprime um algarismo sem linha fica presa ao seu sítio** (o ponto 2 da adenda B, que ficou aberto). A tua razão para parar foi um caso em que a palavra vizinha inteira difere entre a fonte e o texto composto. O leitor mostrou que o mesmo caso passa com um só carater de cada lado. Faz assim:
   - o compositor compara os carateres imediatamente à esquerda e à direita do marcador, na linha do gabarito, com os que rodeiam essa ocorrência no registo da fonte (sem contar espaços nem marcação);
   - começa pela largura maior que deixe os sete gabaritos ativos compor sem mudar um byte, e desce até um carater de cada lado;
   - se, mesmo a um carater, alguma referência dos gabaritos de hoje não bater de um dos lados, não mudes a prosa nem abras uma dispensa geral: essa referência entra numa lista fechada, comitada ao lado do gabarito, com o seu contexto composto escrito, e o compositor recusa qualquer referência fora da regra que não esteja nessa lista, letra por letra;
   - vale para `⟦nf:…⟧` e para a correção com `"linha": null`.
   Plantas: a referência movida para outra frase recusa; no seu lugar passa; uma entrada da lista fechada com o contexto mudado recusa.

2. **A conferência dos gabaritos ativos não se engana a si própria.** A lista dos estudos que ela cobre fica escrita (os quatro de Évora), e uma descoberta diferente dessa lista recusa. A cópia de trabalho não leva os ficheiros gerados que a recomposição, a renderização e a exportação reescrevem: compara o que se regenera com o que está comitado. O relatório diz quais ficheiros são entrada e não produto (os cortes da voz).

3. **A nota dos manifestos dos registos** dos quatro estudos (o ponto 9 da adenda B) corrige-se na origem (`NOTA_E1`, em `publisher/export_records.py`), para dizer o que é verdade desde que os estudos têm texto próprio, e os quatro `records.manifest.json` regeneram-se. Esta é a única mudança permitida nos ficheiros gerados nesta passagem: o campo da nota e os resumos que dele dependam, nesses quatro ficheiros. O texto novo da nota: cada estudo tem o seu próprio texto nos gabaritos da sua pasta; cada número resolve numa linha do livro de uma fonte declarada, de uma derivação local ou de uma linha própria; os gabaritos compostos de 30.09.2026 ficam ao lado como história.

4. **Dois testes em falta:** uma correção sem a chave da razão (hoje dá `KeyError` e não uma recusa); o resumo do documento de uma linha própria truncado, que tem de recusar na própria conferência da linha.

## O fecho

As suites tocadas; o `core.gate` uma vez, por `curto.sh`. No relatório (`RELATORIO-MOT2.txt`): ponto a ponto, o que mudou, a largura do contexto a que chegaste e quantas referências ficaram na lista fechada (com cada uma), as plantas e o que deram, os resumos dos ficheiros gerados antes e depois (iguais, salvo os quatro manifestos), e as últimas linhas do portão copiadas do registo. Os commits com o assunto a começar por `MOT2`, com `OEDP_GATE=adiado` (o escrivão arranca com a variável).

## Quando paras

Só se o ponto 1 não se conseguir fazer sem mudar a prosa de um estudo: dizes a referência e porquê, e fazes os outros pontos. O teto da passagem, num commit são.

## O fim

O fecho acima. Setenta e cinco minutos, cento e vinte chamadas.
