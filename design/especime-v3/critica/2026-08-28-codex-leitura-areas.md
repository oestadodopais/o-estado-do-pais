# Leitura cruzada do Codex · as áreas de governo (28.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre o índice e as nove páginas de área nas duas edições (a segunda passagem, `bcd1fe5`), a primeira página, `areas.mjs`, a lista dos ministérios nas duas línguas, o texto da lei orgânica, o diff do inventário e as regras 14 e 15. Custo: 147 437 símbolos, 514 s. Três plantas, registadas com sha256 antes da leitura em `2026-08-28-codex-leitura-areas.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | uma peça de desemprego plantada na página da Saúde com uma razão falsa (art. 23.º, «política nacional de saúde») | **não**: a leitura confirmou as 21 matérias do mapa na lei e não viu a peça a mais na página |
| P2 | uma frase de cobertura no índice («Nove áreas com conteúdo; as outras sete ainda sem linhas, por agora.») | **sim**: regra 15 |
| P3 | o nome inglês de uma área trocado («Home Affairs» por «Internal Administration») | **sim**: bloqueante, contra a lista do Governo |

**Pontuação: 2 de 3.** A falta é da classe «uma peça fora do sítio»: o pacote não levava a página de origem da peça plantada, pelo que a leitura só a podia apanhar pela razão que não bate com o assunto, e não a apanhou.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **Cada medida nas páginas de área mostrava o valor, a fonte e o identificador do motor, sem o nome da medida, a unidade nem o período.** **Real e grave**: um leitor não sabe o que é «1 409». Terceira passagem: a peça rende como na página de origem (nome, valor, unidade, período, selo), e a página da Economia agrupa as 87 medidas pela matéria que as põe lá.
2. **A matéria da lei não estava impressa em página nenhuma.** **Real**: a porta legal passa a selo por página (o nome do ministério tal como o Governo o publica e «Decreto-Lei n.º 87-A/2025, art. N.º, n.º N», a ligar ao Diário da República), na forma dos selos das fontes, sem frase.
3. **As descrições do índice e das páginas explicavam o método** («cujo assunto é matéria de …»). **Real (regra 15)**: saem; o índice passa a «Por área de governo» / «By area of government», que também retira a leitura de lista oficial completa sem precisar de frase de cobertura.
4. **Razões que esticam a palavra da lei** (o PIB por habitante e os níveis de VAB sob «crescimento da economia», a concentração, o rácio S80/S20 sob «combate à pobreza e promoção da inclusão social») e **duas incoerências** (as empresas fora e o VAB dentro; a taxa de câmbio efetiva real fora e o custo unitário do trabalho dentro). **Real**: a razão passa a dizer quando é proximidade e não identidade, e um princípio escrito decide as duas (as medidas do estado ou do desempenho da economia são economia; as contagens de pessoas ou empresas são estatística).
5. **Peças inteiras em várias áreas** (o estudo dos quinze anos de Évora em três; o conjunto dos concelhos em duas): admitidas só porque as suas medidas atravessam matérias; a razão por aparição nomeia-as e a régua confere.
6. **Fugas de português na edição inglesa**: o marcador `[a verificar]` e títulos portugueses sem `lang`. **Real**: o marcador na forma da edição; `lang="pt-PT"` nos títulos.
7. **O inventário** sem as linhas do índice («Finanças → 1 peça») e com as descrições de método como `conteudo`. **Real**: classificadas e retiradas na terceira passagem.
8. **Passa**: as 21 matérias do mapa encontradas palavra por palavra no artigo e no número ditos; oito dos nove nomes iguais aos do Governo (o nono era a planta); o comando da primeira página com «Áreas»; as ligações do índice a resolver; as contagens iguais ao conteúdo nas duas edições.

## O que a terceira passagem fez com isto

`de1789a` e `668ab8b`: os pontos 1 a 7 acima, ponto por ponto (a medida como medida pela peça partilhada `ItemDoLivro.astro`; a porta legal em selo; as descrições fora e o índice «Por área de governo»; as razões de proximidade ditas e o princípio escrito; a A4 a exigir as linhas de cada aparição; o marcador na forma da edição, os títulos com `lang`; o inventário com as linhas novas classificadas, as descrições retiradas). A medição M10 (Sonnet), corrida na segunda passagem, tinha achado 22 cadeias por inventariar (o rótulo da cabeça em vinte páginas, «provisório» em duas): o rótulo passou a bloco e a navegação; «provisório» é a palavra da fonte (a bandeira `p` do Eurostat) e fica com o selo, guardada por uma célula nova. A repetição da M10 na terceira passagem (o programa do medidor corrido pelo lugar de direção numa cópia nova, `668ab8b`): nomes 9 de 9 nas duas línguas, 21 citações de 21, 139 peças por edição sem discordância, as 2 602 linhas cobertas uma vez e uma só (1 970 em áreas, 632 fora), índices 9 de 9, sem transbordo, `verify` e `typecheck` a 0; as cadeias por inventariar que restam são títulos de documentos das fontes e a glosa do marcador, que não são prosa da casa. A releitura do Codex está em `2026-08-29-codex-releitura-areas.md`.


## O relatório, tal como veio

# REPORT

The workspace is read-only, so `REPORT.md` was not written. Review used only the supplied files.

## Blocking

1. **Official English name changed.** `paginas/en-areas.html` lists **“Internal Administration”**. The Government list, `areas.mjs`, the inventory and the detail page all say **“Home Affairs”**. This fails the character-for-character rule. The other eight published area names match.

2. **Every area page omits essential measure content.** Across 124 measures per language, the pages show a value, source and Portuguese technical identifier, but no measure name, unit or period. This contradicts `REGRAS.md` rule 15 and makes classification difficult to understand. The Economy page is especially unusable: 87 unnamed measures and 96 pieces overall.

3. **The legal matters are not printed on any area page.** I verified all 21 `materia` strings in `areas.mjs` verbatim inside the stated article and paragraph of the law. However, none of those strings appears as the legal matter on its corresponding page, so the requested page-to-law comparison cannot be performed.

4. **Whole pieces appear in multiple areas.**

   - Study `Évora — Quinze Anos, Cinco Mandatos`: Administração Interna, Economia e Coesão Territorial, and Trabalho, Solidariedade e Segurança Social.
   - Data set `/livro-razao/concelhos`: Economia e Coesão Territorial and Trabalho, Solidariedade e Segurança Social.

   No measure identifier appears in two areas.

5. **Several reasons name a subject different from the legal matter.**

   - `pib-real-per-capita-2025` is justified as the economy’s **size**, not its **growth**.
   - `evora-vab-empresarial-2024` is likewise a level.
   - `evora-concentracao-vab4-2024` and `portugal-concentracao-vab4-2024` measure concentration/structure, not growth.
   - `racio-s80-s20-2025` measures income inequality. The reason asserts that inequality is the object of “combate à pobreza e promoção da inclusão social”, but those are not the same subject.

## Should fix

6. **Obvious omissions are treated inconsistently.**

   - Company counts are excluded as “not a policy”, while VAB and business concentration statistics are accepted as economy/growth measures.
   - `taxa-de-cambio-efectiva-real-2025` is excluded, although it is a direct price-competitiveness measure and unit labour cost is included under `competitividade`.

7. **The public voice violates rule 15.**

   - The Portuguese index says: “Nove áreas com conteúdo; as outras sete ainda sem linhas, por agora.” This explains the site’s coverage.
   - Both index descriptions and all 18 area-page descriptions explain the assignment method using “cujo assunto é matéria de…” / “whose subject is a matter of…”.

8. **The inventory hides those voice violations.** The 20 method/coverage descriptions are classified as `conteudo`, not `autorreferencia`. The live “Nove áreas…” sentence is absent. The full linked index rows, such as “Finanças → 1 peça”, are also omitted instead of being inventoried as `navegacao`. Names and ordinary section labels are otherwise consistently classified as `conteudo`.

9. **English leakage.** `[a verificar]` remains visible on the English Economy and Environment pages. Untranslated Portuguese study/source titles occur on the English Administração Interna, Ambiente e Energia, Economia e Coesão Territorial, and Trabalho pages. “Água Não Faturada” is not even marked with `lang="pt-PT"`.

10. **The English index is misleadingly incomplete.** Unlike Portuguese, it does not state that only nine of the sixteen areas are shown. Combined with the heading “The areas of government”, it reads as a complete official list.

## Note

- `paginas/inicio.html` contains the required command in the order **País · Região · Concelho · Áreas**, with `/areas` as the target.
- All local index-to-detail area links exist, Portuguese and English piece inventories are symmetrical, and their displayed counts match their contents.
- I found no law quote assigned to the wrong article or paragraph.
