# BRIEF · As áreas de governo, M10 · a medição cega do bloco

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre sobre uma cópia do repositório (`git worktree add --detach`), nunca na árvore de um construtor, com a construção do ramo `areas-2026-08-28` feita nessa cópia. Não lês o brief do construtor nem o relatório dele; lês só isto. Cada detetor é provado num caso conhecido vermelho antes de dar um zero. Sem travessões na prosa.*

## 0 · O que mudou

Uma página por área de governo, só para as áreas que têm conteúdo: a área de uma peça é a do ministério cujas matérias, tal como a lei orgânica do XXV Governo as lista (Decreto-Lei n.º 87-A/2025, de 25 de julho; o texto está em `design/especime-v3/briefs/` ou no relatório do bloco, e a cópia em PDF é a que o lugar de direção te indicar), cobrem o assunto da peça. O mapa está em `src/data/areas.mjs`: por área, o nome português e o inglês com a fonte, o artigo e o número da lei, e, por peça, a matéria que a põe lá; as exclusões com a razão. As rotas: `/areas`, `/areas/<slug>`, `/en/areas/<slug>`.

## 1 · As medições

1. **Os nomes.** O nome português de cada área igual, carácter a carácter, a um dos dezasseis de `design/especime-v3/briefs/ministerios-xxv-2026-08-28.md` (a lista lida na página do Governo); o inglês igual à lista inglesa do mesmo ficheiro. Caso conhecido: um nome com uma letra trocada.
2. **As citações da lei.** Cada matéria que o mapa invoca ocorre, palavra por palavra, no texto da lei (o PDF ou o seu texto extraído com `pdftotext -layout`), dentro do artigo e do número que o mapa diz (localiza o artigo pelo cabeçalho «Artigo N.º» e o número pela numeração); lista as que não encontras. Caso conhecido: uma matéria inventada.
3. **As peças.** Cada peça de cada área existe no sítio construído: a rota do trabalho ou do estudo constrói, a linha do livro-razão existe em `ledger/claims/<id>.yml` e a sua página de recibo constrói; o valor mostrado na página da área é o mesmo da página de origem e do YAML, carácter a carácter; cada selo leva ao recibo certo. Conta por área e no total; caso conhecido: uma peça fantasma e um valor trocado numa cópia.
4. **Nenhuma peça em duas áreas** sem razão escrita, e **nenhuma linha do livro-razão sem decisão**: para as 2 602 linhas, cada uma coberta por uma matéria ou por uma exclusão declarada, nunca pelas duas nem por nenhuma (lê o mapa e o livro-razão com código teu). Diz quantas estão em áreas e quantas fora, e o total.
5. **A navegação.** «Áreas» no comando da primeira página e no rodapé, nas duas edições; cada ligação resolve; o índice `/areas` lista as mesmas áreas que existem como páginas, com a contagem de peças igual à que medes.
6. **A voz.** Nenhuma frase de cobertura, método ou diligência nas páginas novas (a lista de marcadores está em `design/especime-v3/VOZ-MARCADORES.md`; usa-a como lista de palavras e conta as ocorrências nas páginas das áreas); cada frase da casa das páginas novas presente no inventário como `viva` (bloco `areas`); caso conhecido: uma frase plantada.
7. **A forma.** Sem transbordo horizontal a 320, 360, 390, 430 nas páginas das áreas (Playwright do repositório); a página da área com mais peças legível: o número de peças por ecrã a 390 e o tempo de construção da página.
8. **A cadeia.** `npm run verify` e `npm run typecheck` na cópia, com o código de saída.

## 2 · O relatório

`design/especime-v3/medicoes/areas-M10-sonnet.md` e o programa ao lado (código teu, do zero): uma tabela por medição com os números, as discordâncias com coordenada e prova, os teus falsos alarmes com a causa, os casos conhecidos vistos vermelhos, o custo em símbolos. Nada é «ok» sem o número. Não corriges, não commitas, não tocas em nada fora de `medicoes/` na cópia.
