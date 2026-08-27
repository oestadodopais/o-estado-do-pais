# Leitura cruzada do Codex · a grelha, segunda passagem (27.08.2026, noite)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre o diff do inventário deste bloco (577 linhas acrescentadas, 494 retiradas: a coluna do estado tocou todas), a cabeça do inventário, `VOZ-MARCADORES.md`, as duas primeiras páginas construídas e a página de Évora, com os excertos das Emendas 15 e 20. Custo: 207 264 símbolos, 604 s. Três plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | uma linha acrescentada ao diff com uma dica de maquinaria («Contagem reconferida pelo motor a cada construção») declarada como conteúdo | **não**: a linha foi montada pelo lugar de direção sobre a coluna mais comprida de uma linha existente, sem a certeza da coluna do texto; a leitura listou as dicas reais e não esta |
| P2 | a linha de uma frase retirada trocada de `retirada` para `viva` (uma sentinela desarmada) | **sim**: «Critical: «A régua da convergência» declared both viva and retirada» |
| P3 | Viana do Castelo retirada da lista das unidades por baixo do mapa, na edição portuguesa | **sim**: «High, map list: 17/2/9 against 18/2/9 in English» |

**Pontuação: 2 de 3.** A P1 repete o defeito de empacotamento das leituras anteriores (a coluna adivinhada); as plantas no inventário passam a ser escritas a partir da cabeça do ficheiro, coluna a coluna, ou não se plantam.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **As dicas «concelhos com página» / «concelhos with a page» revivem a frase retirada «Com página» dentro de uma cadeia maior.** **Real; X1** (a contagem nomeia-se sem a palavra da cobertura; a sentinela apanha a frase retirada também dentro de uma cadeia maior).
2. **«Évora» é a última da lista das unidades por baixo do mapa, nas duas edições**, em vez de estar entre Coimbra e Faro: a única preferência visível na marcação. **Real; X2** (ordem alfabética por grupo, com a colação da casa).
3. **A exceção «proveniência completa» é global** e devia cobrir só as rotas em que é o estado de um campo do recibo da linha. **Real; X3.**
4. **As outras dicas** («itens da agenda», «linhas calculadas», «trabalhos no arquivo», «edições no arquivo») e as portas com contagens («12 trabalhos · 16 edições», «4 em curso · 0 a seguir…»): a leitura chama-lhes cobertura ou intenção; são contagens do que o sítio contém, a linha que o diretor traçou a 27.08 para o livro-razão. **Sem ação.**
5. **O texto oculto e a dica do selo («calculado · <estudo>»)**: a forma do selo fixada na Emenda 15 («fonte · <estudo>» e a sua variante para as linhas calculadas). **Sem ação.**
6. **«Um observatório de Portugal.»**: a frase de identidade da Emenda 18a. **Sem ação.**
7. **A largura do mapa no telemóvel não se prova pelo pacote** (a folha não ia no pacote): medida pelo construtor a 320, 360, 390 e 430 e pela régua `mapa-distritos` (M2·320e vermelha com o mapa à largura da coluna). **Sem ação.**

## O relatório, tal como veio

I could not create `REPORT.md`: the workspace is mounted read-only and rejected the write. Here is the completed report text:

# Focused audit

**Verdict: FAIL. The inventory contradicts itself, reader-facing method and coverage text remains, and the Portuguese map list contains only 28 of 29 units.**

## Findings

- **Critical, inventory state:** `INVENTARIO.diff:91-92` declares **“A régua da convergência”** both `viva` and `retirada`. It occurs nowhere in `paginas/*`, while line 91’s reason says it left the front page. Keep one `conteudo | retirada` row with the correct removal reason. The duplicate also produces 435 pre-attribute rows, 396 `viva` and 39 `retirada`, contradicting the claimed 434 and 395/39 at lines 13-21.

- **High, retired text revived:** lines 848-849 retire **“Com página” / “With a page”**, but lines 1239 and 1242 declare live tooltips **“concelhos com página” / “concelhos with a page”**. The retired coverage claim has returned verbatim inside a longer string. Reclassify both as `autorreferencia` and retire them.

- **High, other wrong `conteudo` tooltips:** these describe house machinery, coverage, or intentions and should become `autorreferencia`, then `retirada`: **“agenda items” / “itens da agenda”** (1236,1247); **“calculated rows” / “linhas calculadas”** (1237,1250); municipalities with a study row (1238,1255); archive editions (1243-1244); provenance-revision entries (1245-1246); ledger rows (1248-1251); municipality-study ledger rows (1249,1252); and archive works (1258,1261).

- **High, method text omitted from the inventory:** in `paginas/inicio.html:1` and `paginas/en.html:1`, `.src-chip[title^="calculado ·"]` and `.src-chip[title^="calculated ·"]` expose **“calculado · Avaliação Económica Regional de Portugal 2026”**, **“calculado · Alentejo & Algarve — Economy, Society, Strategy”**, **“calculado · O Estado do País, apuramento próprio”**, **“calculated · Avaliação Económica Regional de Portugal 2026”**, **“calculated · Alentejo & Algarve — Economy, Society, Strategy”**, and **“calculated · O Estado do País, own count”**. Each also occurs in `.vh` screen-reader text. The normalization exemption at `INVENTARIO.diff:1195-1201` is therefore a blind spot.

- **High, front-page self-reference:** `.masthead-identidade` says **“Um observatório de Portugal.” / “An observatory of Portugal.”**, yet `INVENTARIO.diff:93,178` calls these navigation. The study door says **“12 trabalhos · 16 edições” / “12 works · 16 editions”**, and the agenda door says **“4 em curso · 0 a seguir · 1 concluído · 0 retirado” / “4 under way · 0 next · 1 concluded · 0 withdrawn”**. Their titles include **“trabalhos no arquivo”**, **“edições no arquivo”**, **“itens da agenda”**, and the English equivalents. These state house coverage or intentions. No `aria-label` is procedural; the map and navigation labels merely name their instruments.

- **High, map list:** `paginas/inicio.html:1` contains `.mapa-areas [data-uni-porta="viana-do-castelo"]` but lacks `.mapa-ilhas [data-lista-porta="viana-do-castelo"]`; its groups contain 17/2/9 links. `paginas/en.html:1` is correct at 18/2/9 with `/en/districts/<slug>` links. Every present name occupies its own `li`. Both editions put **“Évora”** last rather than between Coimbra and Faro; this special ordering is the only preference visible in markup. No selected/current class exists.

- **Medium, phone width unverified:** `[data-mapa-ilhas]` follows the SVG, but width is defined in absent `/_astro/inicio.j4iZCdBB.css`; these files cannot prove window-width rendering.

## Marker exceptions

- **Keep** `MARCADORES.md:143`: **“[a verificar]”** names missing provenance.
- **Keep** line 144: **“a página da câmara”** names an external source.
- **Keep** line 145: `/correcoes` narrowly makes policy the page’s subject.
- **Keep** line 146: **“secundário incompleto”** defines a measured outcome.
- **Keep** line 147: **“planned completion date…”** is a source-record fact.
- **Reject** line 148: global **“proveniência completa / provenance complete”** claims completeness; limit it to permitted line receipts.
- **Keep** line 149: **“Nesta página / On this page”** is navigation.