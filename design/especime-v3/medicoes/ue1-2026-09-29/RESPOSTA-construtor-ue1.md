# UE1 · a resposta do construtor

*Claude Opus 5.5 (a definição `construtor`), 29.09.2026. O relatório inteiro está em `design/especime-v3/medicoes/ue1-2026-09-29/LEIA-ME.md`.*

**As cabeças.** O sítio: o ramo `ue1-2026-09-29`. A cabeça do código, onde os portões correram, é `33ed14a0`; a cabeça final é o commit que traz esta resposta, e só acrescenta provas nesta pasta e na das capturas. O motor: o ramo `ue1-2026-09-29`, cabeça `e394307`. Nada foi publicado.

**Os portões, lidos dos ficheiros** (`portoes/*.codigo`, todos da cabeça `33ed14a0`): `npm run build` 0, `npm run verify` 0, `npm run typecheck` 0. No motor, `python3 -m core.gate` 0 na cabeça `e394307` (`motor/core-gate.txt`).

**Os commits.** O sítio, depois do brief (`09bca6c7`): `a182c200`, `42cedfd9`, `e1c20147`, `7ae82d82`, `ac965c61`, `b6991e78`, `ee95f3ca`, `33ed14a0`, e o das provas. O motor: `da6df0b`, `50f8352`, `daa5355`, `e394307`.

**As provas.** `medidas.json` por `medir-ue1.mjs`, cada medida com o comando e um conhecido-positivo; o `conferir-relatorio.py` sobre o relatório sai a 0. As 15 plantas do bloco morderam e foram repostas pelo sha256; as 40 capturas e as 200 medições das faixas nas 5 larguras deram 0 problemas; as 10 séries batem, ponto a ponto, com a testemunha do lugar de direção.

**O que o brief dizia e a medição não confirmou.** O lugar de Portugal na pobreza ou exclusão é 15.º pela regra do §3 (o brief diz 16.º), a par da Áustria e da Suécia. As palavras da frase têm os acertos F0 a F2 e a regra F3, cada um com a razão escrita. Os pedidos do motor saíram sem o intervalo por anfitrião; os corpos não mudam, e o guião foi corrigido.

**A nota sobre os tipos.** `src/lib/series.mjs` está no programa do typecheck, e o portão resolve os tipos das anotações (uma planta na linha 70 morde com TS2304). `tests/cartao/faixa.mjs` e `scripts/series-do-portao.mjs` ficam fora do programa, e `tests/` fica também fora do `check:mortos`; a importação por ler saiu.

**Os símbolos.** 951 859 ao fim dos portões e 1 219 541 no fecho, lidos à mão do contador do ambiente (`custo-ue1.json`); o total da ferramenta é o que conta.

**O que ficou por fazer.** A leitura a frio pelo Codex e o registo em `DECISIONS.md`, do lugar de direção; uma porta do recibo da linha portuguesa para a série; as linhas do inventário dos ramos que ainda não se rendem; `tests/` no typecheck e no `check:mortos`, como proposta; o brief do RP3 em dia depois da aterragem.
