# Os Minor das leituras do DO2 (30.10.2026), para o bloco de higiene seguinte

*As leituras de 30.10.2026: a leitura a frio do Gemini 4 Argon (High), 12:35:52 a 12:49:28 UTC, e a leitura curta das correções pelo Claude Opus 5.5 (`leitor`), as duas com as cinco plantas apanhadas. Os Blocking e os Major corrigiram-se antes de aterrar (as adendas C, D e E do DO2); estes ficam para a higiene, pela §1.177. Sem travessões.*

## A leitura a frio (Argon)

1. O relatório final do construtor não traz as cinco entradas impressas de cada caixa nem os códigos dos `.codigo`, e `conferir-relatorio.py` sai com 1 (o Major 6 da leitura, passado a Minor pelo lugar de direção: é do registo e não do leitor); a ligação `<caminho>` do relatório saiu da limpeza dos caminhos do guião do pacote do lugar de direção, que troca o caminho em vez de o tornar relativo.
2. `scripts/dossies-html.mjs:22`, `tests/discussao/itens.mjs:289` e `tests/dossies/dossies.mjs:94` escrevem à mão só duas portas (`estado-e-economia` e `habitacao`) em vez de as ler de `ENTRADA_DA_ROTA` ou de `ENTRADAS`: um dossiê noutra porta seria recusado ou não conferido.
3. `scripts/voz-pais.mjs` conserva `s.dossies.recente`, que já não se imprime, e junta `textoEmDiscussao` e `textosEmDiscussao` à lista `permitidos` de todo o `<main>`; e `conferirNovidades` não confere o `title` do `[data-prova]` antes de a régua dispensar a entrada.
4. `agruparNovidades` põe um dossiê na caixa pela data de publicação das peças e imprime a data da escrita mais recente, sem reordenar: uma peça publicada entre as duas datas aparece acima do dossiê com uma data mais antiga.

## A leitura curta (Opus)

5. Contagens dos relatórios sem ficheiro no pacote (86/86, 788/788, «24 plantas e 8 da voz», «474 caminhos reais», «60 de 60»; `check:mortos` só como código observado); o conferidor da casa achou 0 de 3 números apoiados.
6. A régua da L1 do DO2 (`tests/dossies/do2-l1.mjs`) lê a redução esperada de um argumento da linha de comando (`2`), e não da função comum.
7. A E1 de `scripts/check-pais.mjs` fica vermelha quando o conteúdo muda sem defeito (nenhum estudo suprimido, ou menos de dois): «faltam estudos para exercer as três plantas»; as plantas passam a exercer-se sobre uma cópia dos dados.
8. Fora do modo dossiê, `BlocoDaDiscussao` ignora a propriedade `itens` (desenha `entradasDoInicio`).
9. Dois pares das plantas FP2 aceitam a mesma mensagem («data diferente» e «frase diferente»): cada planta passa a exigir a sua.
10. «Para perceber» na primeira página fica só com a linha da leitura da semana dos números relidos na fonte, que é prosa sobre o processo da casa: decidir se a secção sem explicação se imprime, ou onde vive essa linha.

## O lugar de direção

11. O guião `plantar.py` continua a escrever o caminho absoluto da cópia em `copia` (a HIG-5 §2.6 corrige-o); as cópias das plantas que entram no repositório limpam-se no guião dos registos.
