# CI1b · a resposta curta do construtor

*Claude Opus 5.5, 28.09.2026, à noite. A secção CI1b de `design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md` tem o detalhe; cada número está em `medidas.json`, ao lado. Sem travessões.*

**A cabeça.** O código e os portões estão em `b485ae52`; a cabeça final do ramo `ci1-2026-09-28` é o commit que traz esta resposta, que só mexe em ficheiros desta pasta, que nenhum portão lê (o relatório, as provas, os portões, e as duas ferramentas acertadas depois deles: o inventário a reduzir os caminhos de fora e a planta da paridade a contar as páginas acabadas).

**Os achados da leitura a frio**, pela triagem do lugar de direção (os 1, 2, 3, 4 e 10 eram as plantas; o 5 é dele):

- **6.** O `design:feixe` corre sozinho depois do grupo; a sonda regista as leituras, e o cruzamento do que cada conferência escreve com o que as outras leem deu 0 pares (`ci1b_pares_com_contacto`) e 0 leitores de `design-system/` além do feixe (`ci1b_leitores_de_design_system`); a célula D vê também uma escrita reposta, pela hora de escrita e pelo inode, no `dist/` e nos ficheiros que o `git` segue, e diz o que não vê.
- **7.** A célula C prova o `prova.json` e o `cadeia.json` desta construção pela hora de escrita contra o carimbo, com uma planta de um `cadeia.json` de outra construção.
- **8.** Os manifestos das cinco construções comparadas estão em `evidencias/manifestos/`, e as comparações refazem-se a partir deles, com 0 diferenças fora do carimbo.
- **9.** Numa cópia da árvore da cabeça, o `astro build` com uma chave só numa língua fecha na primeira rota, sem uma página escrita.
- **11.** A frase da primeira entrega está corrigida, e a conta crua diz o que tira: 0 linhas diferentes em 659 (`ci1b_repetidas_linhas_diferentes_crua`, `ci1b_repetidas_linhas_comparadas_crua`).
- **12.** A planta na cadeia real repõe os ficheiros num `trap`, provado por uma interrupção a meio (`ci1b_planta_interrompida_reposta`).

**O mapa e o registo.** O mapa do repositório tem o §1, o §3 e o §5 postos em dia e duas armadilhas novas no §7, e o `conferir-mapa.py` acha as suas citações; a M38 está no registo das melhorias.

**Os portões**, na cabeça `b485ae52`, códigos lidos de `portoes/ci1b/*.codigo`: `npm run build` 0 (`ci1b_portao_build_codigo`), `npm run verify` 0 (`ci1b_portao_verify_codigo`), `npm run typecheck` 0 (`ci1b_portao_typecheck_codigo`). A construção do portão sai igual byte a byte à da cabeça de partida (`ci1b_diferencas_final`).

**O que ficou por fazer.** A segunda corrida no GitHub e a planta vermelha lá, do lugar de direção; o chão da corrida continua a ser o `check:alvos`, e mexer na sua espera fica para decisão; uma conferência nova que escreva numa pasta ignorada não é vista pela célula D, e é o inventário que a vê quando se corre.
