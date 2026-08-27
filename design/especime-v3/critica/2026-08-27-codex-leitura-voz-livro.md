# Leitura cruzada do Codex · a voz do livro-razão (27.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre o `git diff main...HEAD` de `INVENTARIO-FRASES.md` deste bloco (33 linhas acrescentadas, 18 retiradas), `VOZ-MARCADORES.md`, os excertos das Emendas 15 e 18, e as duas páginas de índice do livro-razão construídas no ramo. Custo: 97 930 símbolos, 392 s. Duas plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | uma linha acrescentada ao diff, «Cada linha deste livro-razão foi conferida contra a fonte antes de ser publicada.», declarada como conteúdo | **sim**: a primeira do relatório, «change to autorreferencia» |
| P2 | uma exceção duplicada da última («Nesta página») com a razão trocada por «conteúdo: diz o que o livro-razão contém» (o lugar de direção queria plantar uma frase de diligência e a escolha da coluna sobrescreveu-a; o registo diz o que ficou plantado) | **sim**: «duplicates the same match with a conflicting rationale», rejeitada |

**Pontuação: 2 de 2.** O empacotamento das plantas tem de seguir as colunas do ficheiro (classe · texto · bloco no inventário; tipo · marcador · pt · en · razão nas exceções); a P2 saiu torta por isso, e ainda assim a leitura a rejeitou.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **As dicas (`title`) e rótulos das páginas do livro-razão descrevem a maquinaria** («itens da agenda atravessados do motor», «leitura direta da fonte», «linhas cujo valor é calculado a partir de outras linhas», «Todas as linhas, com todos os campos publicados.»). **Real; L1.**
2. **A descrição do `<head>` do livro-razão dos concelhos explica a cobertura.** **Real; L2** (a forma que nomeia a página, como no índice principal).
3. **A exceção «o trabalho conseguiu ler»** é uma afirmação de cobertura. **Real; L3** (a frase passa ao facto sobre a fonte; a exceção sai).
4. **O tripwire não tem a família da cobertura** («cobert», «complet», «todas») e a raiz «atravessou» não apanha «atravessados». **Real; L4** («atravess», «cobert», «complet»; «todas» não entra, por demasiado ruído; a leitura fica creditada).
5. **`lang="en"` nos títulos ingleses dentro das páginas portuguesas.** **Real; L5.**
6. **A dispensa de `/correcoes`** («este sítio»): fica, pela Emenda 17 do diretor, como nas leituras anteriores.
7. **«A frase de diligência inventariada não aparece nas construções»**: é a planta P1.

## O relatório, tal como veio

I could not create `REPORT.md`: the workspace is read-only and the write was rejected. Here is the finished report, under 700 words.

# Focused read

## Blocking

### Added inventory lines

- **“Cada linha deste livro-razão foi conferida contra a fonte antes de ser publicada.”** — declared `conteudo`; change to `autorreferencia`: it directly claims the site checked every row and therefore advertises method, diligence and coverage.

The other six `+` rows are correctly `conteudo`: the two page names and four current/zero counts identify the page or state facts without explaining how the site works.

### Marker exceptions

- **Keep** `[a verificar] / to verify`: it is the permitted short absence marker, not a claim of verification.
- **Keep** `a página da câmara / the council’s page`: it unambiguously names a third-party source page.
- **Reject** `o trabalho conseguiu ler / the work could read`: saying what the work managed to read is precisely a claim about its method and coverage, despite the rationale relabelling it a data limit.
- **Reject** `/correcoes` for `este sítio / this site`: the rule permits self-reference only on Método, Sobre and row receipts; Correções is not another exception.
- **Keep** the first `Nesta página / On this page`: as a bare in-page contents label it is navigation.
- **Reject** the second identical `Nesta página / On this page`: it duplicates the same match with a conflicting “conteúdo” rationale and represents no distinct case.

### Built public pages

`PAGINA-LIVRO.html` exposes these prohibited explanations:

- **“itens da agenda atravessados do motor”** (count tooltip; also on the concelhos page): internal processing and coverage.
- **“ficheiros do livro-razão, um por número publicado”** (tooltip): coverage.
- **“linhas cujo valor é calculado a partir de outras linhas”** (tooltip): calculation method.
- **“Quadro institucional de indicadores, leitura direta da fonte”** (seal label/tooltip): acquisition method.
- **“Todas as linhas, com todos os campos publicados.”**: explicit completeness/coverage.

`PAGINA-LIVRO-CONCELHOS.html` publishes, in both its description and Open Graph description, **“As linhas do livro-razão com as medidas que as fontes centrais publicam para cada concelho, uma linha cada.”**; this explains the page’s coverage instead of merely naming it.

## Should fix

- `MARCADORES.md` says five exceptions but contains six rows; the duplicated exception explains the mismatch.
- The tripwire lacks coverage/completeness families (`cobert`, `coverage`, `todas`, `every`, `complet`), while `atravessou` cannot match the live `atravessados`; current violations therefore evade it.
- The newly inventoried diligence sentence is absent from both supplied builds and lacks an English counterpart, showing inventory/render drift.
- Mark the English study titles and the footer’s second “English” link with `lang="en"` for correct screen-reader pronunciation.

## Note

No translated UI sentence leaks between languages. **“Which Door Is Yours — public funding in Portugal, August 2026”** and **“Alentejo & Algarve — Economy, Society, Strategy”** are source titles, not translation leaks.

**Verdict: blocking — the inventory, allowlist and rendered pages still permit explicit self-explanation.**