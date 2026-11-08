# Adenda A ao mandato HIG-6A: o par de cada entrada sem depender da régua, e o lançador que não lê o ficheiro que a passagem muda (08.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois do relatório da passagem (32a7e42bb), que está certo face ao mandato: o erro é do §1.1 (d) deste lugar. A mesma sessão e a mesma worktree `hig6a-2026-11-08`.*

## §0 Medido (pelo teu relatório e pelo registo do lançador)

- O §1.1 (d) do mandato dizia que o bloco gémeo «tem de ter uma entrada, ou nenhuma frase que a régua apanhe». Foi assim que a VOZ-2A falhou: as frases gémeas inglesas que a régua não apanha («They are here rather than in a footnote …», o par da V228; «One error this page caught in itself …», o par da V296) ficaram por mudar. Por isso a VOZ-2B dá 4 entradas sem par na tua medida e 8 na deste lugar.
- O lançador partiu no fim da passagem (código 2, «unexpected EOF») porque a passagem acrescentou seis linhas a `construir-codex.sh` enquanto o `sh` ainda o lia; o ficheiro no disco está bem. Os pontos da passagem foram medidos à mão por `pontos.py` (2 pontos, 06:03:18 a 06:59:43).

## §1 O que fazes

1. **O par de cada entrada:** numa lista, cada entrada SAI ou REESCREVE de um estudo publicado nas duas línguas tem de ter, no bloco gémeo da outra língua, uma entrada da lista (SAI, REESCREVE ou FICA), ou um campo `par` com o valor `nenhum` e uma `razao_par` de vinte carateres ou mais (por exemplo, quando a outra língua já não tem a frase). A régua deixa de decidir o par. A frase que a régua apanha e a lista não nomeia continua a recusar-se, como já faz.
2. **As plantas:** a VOZ-2B de hoje passa a dar as entradas sem par pela regra nova (diz quantas e quais; este lugar mediu 8: V122, V012, V124, V093, V100, V293, V296 e o par da V094); uma planta em memória com o caso da V228 (o português sai, o inglês fica sem entrada e sem frase que a régua apanhe) tem de morder; e uma com `par: nenhum` sem razão também.
3. **O lançador que não lê o que a passagem muda:** `construir-codex.sh` e `retomar-codex.sh` correm a partir de uma cópia de si próprios, feita no arranque fora da worktree (ou com o corpo inteiro numa função chamada na última linha), para que uma passagem que os mude não parta a passagem que os corre. Uma planta: um lançador que muda o seu próprio ficheiro a meio acaba com o código certo e escreve a linha dos pontos.
4. **O fecho:** `check:pre-mandato` com as plantas novas, o pré-mandato sobre a VOZ-2A de hoje (passa) e sobre a VOZ-2B (recusa, com as contagens), `typecheck`; o `build` só se mudares algo que ele leia; os commits com o assunto a começar por `HIG-6A`; o relatório curto.

## §2 Quando paras

Se a regra nova recusar a VOZ-2A de hoje (diz que entradas); como no mandato para o resto.

## §3 O fim

O §1, ponto 4. Quarenta e cinco minutos, sessenta chamadas.
