# BRIEF · Correções pequenas, quinta passagem (I91, segunda metade; I92)

*Escrito a 29.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Ramo `pequenas-5-2026-08-29` saído de `main` `98fd779`. Decisão do diretor de 29.08 («can you do that?») sobre a recomendação do lugar de direção. Sem travessões na prosa.*

## 0 · As duas, e a linha que as separa

Uma linha do livro-razão guarda o título do documento da fonte e a unidade tal como a fonte os imprime, em português. Nas páginas inglesas rendem tal como estão. A decisão trata os dois de maneira diferente, porque são coisas diferentes:

1. **I91, segunda metade · o título de um documento é um nome.** Fica em português e leva `lang="pt-PT"` em todas as páginas inglesas onde rende (as páginas de linha, os índices do livro-razão, as páginas de área, as peças dos concelhos, as leituras dos estudos onde citam documentos): a marca de língua, e mais nada. O mesmo para os títulos de leis («Lei n.º 73/2013») e de estudos portugueses que ainda não a levem. Conta antes e depois (ocorrências sem marca em `dist/en`), e o caso conhecido: uma cópia com a marca tirada, vista vermelha.
2. **I92 · a unidade é um rótulo, não uma citação.** As unidades das linhas são um conjunto fechado: lê-o do livro-razão inteiro (`ledger/claims/*.yml`, campo `unit`) e imprime a lista com as contagens. O sítio ganha um dicionário `src/i18n/unidades.mjs` (a cadeia exata do livro-razão → o inglês), aplicado por `ItemDoLivro.astro` e por onde mais a unidade de uma linha rende em inglês; as medidas dos concelhos já têm unidade traduzida na definição da medida, e ficam como estão. Toda a entrada do dicionário é um facto de dicionário (Pessoas → Persons, Euros → Euros, Dias → Days, % do PIB → % of GDP, Percentagem → Percentage, …); o que não estiver no dicionário rende em português com `lang="pt-PT"` e a régua conta-o. Uma régua nova ou uma célula em `tests/` confere que todas as unidades do livro-razão têm entrada ou marca, com um caso plantado (uma unidade inventada) visto vermelho. As entradas do dicionário são frases da casa na superfície inglesa: classificam-se no inventário (bloco `pequenas-5`, classe conteúdo).

## 1 · O que é «feito»

* Em `dist/en`: zero títulos de documentos, leis e estudos portugueses sem `lang="pt-PT"` (contados com um positivo conhecido); zero unidades sem tradução ou sem marca; a lista das unidades e a sua tradução no relatório.
* `npm run build`, `verify`, `typecheck` verdes; o inventário atualizado; uma linha `| pequenas-5 | n | por ler | … |` em `critica/REVISOES-DO-INVENTARIO.md`; ISSUES: I91 e I92 fechadas com o commit.
* Commits com caminhos explícitos e os dois trailers; `DECISIONS.md` é do lugar de direção; relatório em `design/especime-v3/medicoes/pequenas-5-construtor.md` com as contagens e o custo.
