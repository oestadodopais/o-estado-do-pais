# Brief F1.15 · Os nomes dos documentos na língua da página (15.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir do que o diretor viu a 15.09.2026 na página da área «Infraestruturas e habitação» («Residential building permits - annual data» entre linhas em português: «we should have it all in Portuguese, unless it's something that has a name in English») e do pendente de 04.09 (79 entradas do índice chamadas pelo título do documento porque o motor não lhes exporta um nome). Corre depois do F1.12. Sem travessões na prosa.*

## 0 · A causa, medida

Na página `/areas/infraestruturas-e-habitacao`, o nome visível da linha `licencas-de-construcao-2025` é o campo `document.title` da linha, rendido tal como a fonte o escreve (`lang="en"`, `data-linha-campo="document.title"`), porque a linha não tem nome próprio. A regra da casa (o que se transcreve não se edita) está certa para o recibo e errada para o nome visível: um leitor português lê o nome de uma coisa na sua língua, e o título original fica onde a proveniência vive.

## 1 · As decisões (tomadas; o construtor aplica)

1. **No motor**, cada linha do livro-razão que o sítio nomeia ganha um `name` nas duas línguas (`name.pt`, `name.en`), escrito uma vez pelo motor a partir do que a linha mede (a medida, a unidade quando faz parte do nome, o âmbito), exportado com a linha; onde a linha já tem `name`, fica. As 79 entradas do pendente de 04.09 são as primeiras; a régua do motor conta as linhas exportadas sem `name` e fecha a exportação quando alguma das que o sítio rende à vista não o tem.
2. **No sítio**, o nome visível de uma linha é `name` na língua da página, nunca `document.title`; o título transcrito fica no recibo e na página da linha, atribuído e intacto (`data-verbatim`, `lang` da fonte). Onde uma linha ainda não tiver `name` na construção, a construção fecha (a régua do sítio), e não se mostra o título no lugar do nome.
3. **Uma régua no `verify`**: nas páginas portuguesas, 0 títulos de documento à vista fora do recibo e da página da linha; nas inglesas, o mesmo com os títulos portugueses; medido sobre o `dist/` inteiro, com um positivo conhecido.
4. **O que fica em inglês:** o que tem nome em inglês (uma sigla, um programa, o nome de um quadro do Eurostat quando é o nome e não uma descrição), sempre dentro do recibo ou marcado com `lang="en"` e nunca como nome visível de uma linha portuguesa.

## 2 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| N1 | 0 linhas rendidas à vista com `document.title` como nome, nas duas edições | a régua nova sobre o `dist/` |
| N2 | as 79 entradas do pendente com `name` nas duas línguas, exportadas pelo motor; a contagem de linhas sem `name` escrita no relatório | a régua do motor e o `core.gate` a 0 |
| N3 | o título transcrito continua no recibo e na página da linha, carácter a carácter | `check:voz` e a régua das transcrições |
| N4 | os três portões a 0 no sítio; `core.gate` a 0 no motor; as capturas da área da habitação e de uma página de linha a 390 e a 1 280, antes e depois, ao diretor antes de aterrar | os comandos; as capturas |

## 3 · Onde se constrói

No motor, um ramo a partir de `master` numa worktree própria (as caches do teste de exportação copiadas da árvore principal); no sítio, um ramo a partir de `main` depois do F1.12, numa worktree própria; o motor primeiro, porque o sítio lê a exportação. Estimativa: Opus, XS no motor e S no sítio.
