# RP3 · a resposta do construtor

*Claude Opus 5.5 (a definição `construtor`), 04.10.2026. O relatório inteiro está em `design/especime-v3/medicoes/rp3-2026-10-04/LEIA-ME.md`.*

**As cabeças.** O sítio: o ramo `rp3-2026-10-04` sobre `1c4dde2f`. A cabeça do código, onde os portões correram, é `39f15b8e`; a cabeça final é o commit que traz esta resposta, e só acrescenta provas nesta pasta e na das capturas. O motor: o ramo `rp3-2026-10-04` sobre `d2495a7`, cabeça `f97e66e`. Nada foi publicado.

**Os portões, lidos dos ficheiros** (`portoes/*.codigo`, todos da cabeça `39f15b8e`): `npm run build` 0 em 142 segundos, `npm run verify` 0 em 902, `npm run typecheck` 0 em 0. No motor, `python3 -m core.gate` 0 em 268 segundos na cabeça `f97e66e` (`motor/core-gate.codigo`).

**Os commits.** O sítio: `35c3be98`, `d1b21e2b`, `8f8366c8`, `4bbc22f9`, `9e865ddc`, `6e5adb1d`, `fb8dcca4`, `f487fb9d`, `39f15b8e`, e o das provas. O motor: `1889dc1`, `ee8bf17`, `f2ef453`, `f97e66e`.

**As séries.** 15 séries do INE e do Eurostat e a derivada D1, cada uma no seu ficheiro em `ledger/series/` (16 ficheiros, 4 131 pontos, 3 991 com excerto literal); cada coordenada confirmada na metainformação e na resposta, nenhuma parada; a S3 é o `0014639`, escolhido pela metainformação entre os 8 códigos do §3; a D1 tem 140 pontos refeitos ponto a ponto, com as 3 casas do índice; 32 recibos, todos os pontos em cada um, nas 2 edições. Os 13 valores que o §3 cita das S10 a S15 são os das séries, 13 em 13.

**As paragens.** A linha do índice harmonizado de Portugal fica sem o campo `serie`: o cartão diz 2026-08 e a série já tem 2026-09 (3,6 e, o conjunto atualizado a 02.10.2026), e pôr o cartão em dia é mudar a linha para lá do campo, que o §5 não deixa; o construtor confere a cada corrida que a paragem tem razão. As 2 médias de doze meses e as 3 classes do IPC do INE não têm série no §3, e ficam sem o campo. A linha do salário mínimo é coerente com a S15 nos 2 semestres do ano dela (2026-S1 e 2026-S2), conferida a cada corrida, mas não presa (a linha diz o ano, a série o semestre).

**As provas.** `medidas.json` por `medir-rp3.py`, 156 medidas, cada uma com o comando e um conhecido-positivo, e o `conferir-relatorio.py` sobre o relatório e sobre esta resposta sem números sem ficheiro. As plantas mordem todas: 24 no motor, 14 novas no `ledger:check`, 15 de 15 no `check:series` e 6 de 6 sobre o `dist/`, com o controlo da forma antiga sem mordida. 20 capturas dos 2 recibos e 20 do antes, nas 5 larguras e nas 2 edições, com 0 problemas. Nenhuma página do leitor além dos 32 recibos mudou: as 7 477 páginas comuns às construções da base e da cabeça são iguais byte a byte; os ficheiros de dados do livro-razão ganham o campo `serie` (3 010 JSON e a coluna do CSV), e o mapa do sítio os 32 endereços.

**Os símbolos.** 1 628 722 símbolos, do começo do bloco à última leitura do contador antes do commit das provas (`custo-rp3.json`, lido do registo da sessão), em 15 804 segundos, com o Claude Opus 5.5 e sem subagentes. O total que a ferramenta reporta ao lugar de direção no fim é o que conta.

**O que ficou por fazer.** A leitura a frio de outra família, do lugar de direção; a linha do índice harmonizado de Portugal em dia, para a prender; as séries das 5 linhas sem série, se o lugar de direção as quiser; a aterragem sobre o `main` de hoje, com a fusão de ensaio medida (2 conflitos contra o `main` `7af90731`: `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`, `package.json`) e os portões outra vez; uma porta para os recibos (o gráfico do RP4, ou uma linha no recibo de cada linha presa); o corredor das séries.
