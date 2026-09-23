# As medições do brief do B2 (23.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 23.09.2026. Sem travessões na prosa.*

Esta pasta guarda o que o §0 do `design/observatorio/BRIEF-B2-o-veredicto-e-as-paginas-dos-temas.md` mede, para que o guião `design/observatorio/medidas/BRIEF-B2.py` corra amanhã como hoje e o `check:briefs` volte a ligar cada número à sua medição.

- `paginas/`: dez páginas construídas da cabeça `4b99dea3` (o R1 aterrado, o que estava no ar a 23.09.2026 à tarde), copiadas do `dist/` de uma construção dessa cabeça com o `nomes.json` do motor de 23.09 por cima (que só muda recibos, e nenhuma destas cópias é um recibo): a primeira página e a dos temas nas duas edições, a página europeia nas duas edições, Mourão, o índice dos domínios, o índice das áreas de governo e o Sobre; e as duas respostas do Eurostat ao quadro `tessi164` (a sobrecarga do custo da habitação por regime de ocupação, Portugal e a UE27), pedidas a 23.09.2026 pelo cliente da casa e guardadas também no motor em `indicators/out/b2-2026-09-23/` com o `pedidos.jsonl` (endereço, hora UTC, cliente, sha256). O `paginas.sha256` prende cada ficheiro, e o guião escreve o sha256 que leu em cada corrida.
- `prompts/`: os guiões dos construtores de cada peça, quando existirem.
- `capturas/`, `LEIA-ME-peca1.md` e o `medidas.json`: do construtor da peça 1, quando construir.
