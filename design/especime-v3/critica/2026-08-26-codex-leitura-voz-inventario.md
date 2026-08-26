# Leitura focada do Codex · as frases que este bloco acrescentou ao inventário (26.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre um pacote de quatro ficheiros: o `git diff main...HEAD` de `design/especime-v3/INVENTARIO-FRASES.md` (75 linhas acrescentadas, 9 retiradas), a cabeça do inventário com as três classes, e os excertos das Emendas 15 e 18. É a primeira leitura desta forma: a classe «o sítio a explicar-se» deixou de se procurar em pacotes de páginas (o Codex falhou a planta dessa classe duas vezes seguidas, na segunda leitura da parte 3 e na leitura dos concelhos) e passa a procurar-se no diff do inventário, onde uma frase não se esconde. Custo: 37,083 símbolos. Duas plantas no diff, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | «Todos os valores foram reconferidos pela equipa antes de serem publicados.», acrescentada ao inventário como conteúdo | **sim** (a primeira da lista, «advertises the team's checking diligence») |
| P2 | «Cada número desta página foi verificado contra a fonte oficial.», declarada como conteúdo na rota `municipio` | **sim** |

**Pontuação: 2 de 2.** A forma funciona para a classe em que a leitura de páginas falhava.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

A leitura, estrita, reclassificaria 30 frases acrescentadas. Três grupos:

1. **Autorreferência real, acrescentada neste bloco ou tornada visível por ele** (corrige-se antes da fusão, no passo E13 do construtor): as frases da camada das contas de Évora («Sobre as contas deste município… As duas estão nesta página», «A execução da receita e o prazo médio…», que explicam o que o sítio pôs onde); a frase da diferença da dívida com «mostra-se porque» (intenção editorial); o estado vazio «Ainda não há linhas deste estudo no livro-razão.» (a ausência diz-se em duas palavras).
2. **Frases anteriores a este bloco que a regra estrita apanha** (vão para o bloco da grelha da voz, com a decisão do diretor): «Nenhuma fonte publica um produto interno bruto… esta página não fabrica nenhum» (a lista «o que não se sabe» de Évora), as ledes do livro-razão («Uma linha por medida e por concelho…», «Cada linha guarda…»).
3. **As contagens do livro-razão** («2 552 afirmações · 325 calculadas · 2 417 linhas de concelhos», «2 544 de 2 552 linhas com proveniência completa», «2 417 linhas · 308 concelhos · …»): são chaves da prova, recontadas pelo portão nas duas vistas, e dizem o que o livro-razão contém; a casa classifica-as como conteúdo (IDENTIDADE §10). A leitura chama-lhes «contagens de diligência». **É uma linha que o diretor traça**; fica registada para o bloco da grelha da voz, sem ação aqui.

## O relatório, tal como veio

# Focused read

Notation: `C→A` means declared `conteudo`, should be `autorreferencia`; `∅→A` means no valid declared class, should be `autorreferencia`.

## Classification failures

- “Todos os valores foram reconferidos pela equipa antes de serem publicados.” — `∅→A`, because it advertises the team’s checking diligence.
- “Cada número desta página foi verificado contra a fonte oficial.” — `∅→A` (`conteudo` is a stray third cell), because it asserts the site’s verification.
- “136 afirmações · 19 calculadas · 0 linhas de concelhos”; “136 claims · 19 calculated · 0 municipality rows”; “2552 afirmações · 325 calculadas · 2416 linhas de concelhos”; “2552 claims · 325 calculated · 2416 municipality rows”; “2552 afirmações · 325 calculadas · 2417 linhas de concelhos”; “2552 claims · 325 calculated · 2417 municipality rows” — `C→A`, because they count the site’s coverage and processing.
- “2544 de 2552 linhas com proveniência completa”; “2544 of 2552 rows with complete provenance”; “8 de 2552 linhas com campos por confirmar”; “8 of 2552 rows with fields to confirm”; “2416 linhas · 308 concelhos · 2416 com proveniência completa”; “2416 rows · 308 municipalities · 2416 with complete provenance”; “2417 linhas · 308 concelhos · 2417 com proveniência completa”; “2417 rows · 308 municipalities · 2417 with complete provenance”; “0 linhas · 0 concelhos · 0 com proveniência completa”; “0 rows · 0 municipalities · 0 with complete provenance” — `C→A`, because they report the site’s completeness, diligence or missing coverage.
- The four phrases beginning “Uma linha por medida…” and “One row per measure…” — `C→A`, because they explain the site’s ledger-recording method.
- The Portuguese and English passages beginning “Nenhuma fonte publica um produto interno bruto…” and “No source publishes a gross domestic product…” — `C→A`, because “esta página não fabrica nenhum/this page manufactures none” and the reference to the work’s own limits are self-justification.
- “Ainda não há linhas deste estudo no livro-razão.” and “There are no rows of this study in the ledger yet.” — `C→A`, because they describe the site’s missing coverage.
- The Portuguese and English debt-difference phrases containing “mostra-se porque/is shown because” — `C→A`, because they state an editorial intention and claim unique coverage.
- The phrases beginning “A execução da receita e o prazo médio…” and “Revenue execution and the average payment time…” — `C→A`, because they explain how the site reads and documents sources and what it placed on the page.
- The phrases beginning “Sobre as contas deste município…” and “On this municipality’s accounts…” — `C→A`, because “As duas estão nesta página/Both are on this page” asserts site coverage.

## Phrases that still break the rule

All 32 classification failures above must disappear from reader pages, not merely be relabelled. The two correctly classified self-references ending “É a lei que o define, não este sítio.” and “The law defines it, not this site.” must also disappear. The two “Ainda não há linhas…/There are no rows…” phrases independently violate the required two-word absence form.

Verdict: 32 added phrases have classification failures (30 misclassified and 2 without a valid class); the worst are the two verification boasts and the provenance-completeness counters.
