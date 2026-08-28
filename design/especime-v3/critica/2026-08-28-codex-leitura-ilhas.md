# Leitura cruzada do Codex · as ilhas (28.08.2026, madrugada)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre oito páginas de concelho (Funchal, Porto Santo, Ponta Delgada, Corvo, Calheta, Calheta de São Jorge, e as duas Lagoas, a do Algarve e a de São Miguel, para provar as colisões de nome), as oito páginas de linha, as oito linhas em YAML, o texto extraído dos dois ficheiros regionais e dos ficheiros da DGAL, o diff do inventário e as regras 14 e 15. Custo: 133 018 símbolos, 383 s. Duas plantas, registadas com sha256 antes da leitura em `2026-08-28-codex-leitura-ilhas.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | o valor do Corvo na página de concelho trocado de 5 para 6 (a linha e a fonte dizem 5) | **sim**: «Corvo is wrong on the municipality page», com a linha, o recibo e a linha 75 do texto da DRQPE («VILA DO CORVO 2 3 5») |
| P2 | uma frase de comparabilidade («Os valores dos Açores são comparáveis com os do continente.») no cabeçalho de Ponta Delgada | **sim**: «the expressly forbidden claim», e nenhuma outra página a faz |

**Pontuação: 2 de 2.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **O texto do IEFP não ia no pacote**, pelo que Lagoa (Faro), 1 270, ficou por conferir contra a fonte. **Falha de embalagem, não do sítio**: a linha é do continente, lida e medida no bloco dos 308 (M5, e a leitura do Codex de 26.08); o pacote das ilhas só levou os dois ficheiros regionais. O que a leitura provou desta linha é o que se queria: o encaminhamento das colisões de nome (`lagoa-faro` para o IEFP e a página de Faro, `lagoa-ilha-de-sao-miguel` para a DRQPE; `calheta` para o IEM com 261, `calheta-de-sao-jorge` para a DRQPE com 41). **Sem ação.**
2. **O nome da fonte leva a sigla entre parênteses** («… (DRQPE)», «… (IEM)»), que o ficheiro não imprime. **Convenção do campo, não defeito**: o campo `source` nomeia o publicador e leva a sigla em todas as 308 linhas do desemprego (278 com «(IEFP)»); o título do documento e o excerto são os campos textuais, e esses batem palavra por palavra. **Sem ação.**
3. **«A ausência diz-se em duas palavras («sem linha»)», e a página diz «sem linha ainda».** **Real, no texto governado**: a regra 15 (Emenda 18) ilustra com «sem linha», e a frase construída e aprovada no bloco dos 308 (item E4, `8b2a260`) é «sem linha ainda», que a regra 14 cita. A nota do inventário que dizia «em duas palavras, «Sem linha ainda.»» era do lugar de direção e corrige-se aqui para «três palavras». A ilustração da Emenda fica para o diretor: ou a frase encurta para «sem linha» (e «no row yet» para «no row»), ou a ilustração passa a «sem linha ainda». **Recomendação do lugar de direção:** a ilustração acompanha a frase aprovada; «ainda» diz que a linha pode vir, e é verdade.
4. **Passa**: sete das oito linhas conferidas contra o texto da fonte (Calheta de São Jorge 41, Calheta 261, Funchal 2 242, Lagoa de São Miguel 302, Ponta Delgada 1.114, Porto Santo 170, Corvo 5 fora da planta); as páginas e o YAML iguais no documento, edição, página, data de acesso e excerto; as notas de definição não rendem; as quatro linhas do inventário classificadas como conteúdo e a aritmética das contagens (2 560 + 30 = 2 590; 2 417 + 30 = 2 447; 329 e 308 sem mudar).

## O relatório, tal como veio

The sandbox is read-only, so it rejected creation of `REPORT.md`. Here is the completed 577-word report:

# Fresh-eyes report

**Verdict: Not ready: one municipality publishes the wrong value and another makes a prohibited comparability claim; the remaining sampled regional figures are correctly routed.**

## Findings

- **HIGH — Corvo is wrong on the municipality page.** `paginas/municipio-corvo.html` renders **6**, while `paginas/linha-corvo.html` and `linhas/corvo-desemprego-registado-2025-12.yml` say **5**. The DRQPE source confirms **5** at `fontes/desemprego-registado-2025-12.txt:75`: `VILA DO CORVO 2 3 5 0,12%`. The ledger receipt is right; the reader-facing municipality value is not.

- **HIGH — Ponta Delgada makes the expressly forbidden claim.** Its header says `Os valores dos Açores são comparáveis com os do continente.` This is both a comparability assertion and page-level trust/method framing, contrary to the stated rule. No other supplied page contains such a claim.

- **MEDIUM — the IEFP source extract needed to verify Lagoa (Faro) is absent from `fontes/`.** The string `5 LAGOA 596 674 1 082 188 57 1 213 1 270` occurs only in the YAML row and rendered ledger page. Thus **1 270** and the printed IEFP source name cannot be independently checked against the hosted source text in this package. The supplied official URL also failed retrieval during review.

- **MEDIUM — regional source names are not exactly as printed.** The DRQPE PDF prints `DIREÇÃO REGIONAL DE QUALIFICAÇÃO PROFISSIONAL E EMPREGO` (`fontes/desemprego-registado-2025-12.txt:2`), but all four sampled Azores rows append `(DRQPE)`. The IEM PDF prints `Instituto de Emprego da Madeira, IP-RAM` (`fontes/boletim-concelhos-2025-12.txt:894`), but all three sampled Madeira rows append `(IEM)`. Remove the unprinted parentheticals if the field must reproduce the source name.

- **MEDIUM — absence takes three words, not two.** Every sampled municipality page has one empty measure reading `sem linha ainda`; the rule requires `sem linha`. The explanatory text in `INVENTARIO.diff` also calls `Sem linha ainda` “two words”, which is internally false.

## Reconciliation

| Municipality | Municipality page | Row | Source text | Result |
|---|---:|---:|---:|---|
| Calheta de São Jorge | 41 | 41 | 41 | Pass |
| Calheta, Madeira | 261 | 261 | 261 | Pass |
| Corvo | **6** | 5 | 5 | **Fail** |
| Funchal | 2 242 | 2 242 | 2 242 | Pass |
| Lagoa, Faro | 1 270 | 1 270 | not supplied | Unverified |
| Lagoa, São Miguel | 302 | 302 | 302 | Pass |
| Ponta Delgada | 1 114 | 1 114 | 1.114 | Pass |
| Porto Santo | 170 | 170 | 170 | Pass |

The collisions are otherwise routed correctly: `lagoa-faro` points to the IEFP/continent row and the Faro page, while `lagoa-ilha-de-sao-miguel` points to DRQPE; `calheta` points to IEM/Madeira (**261**) and `calheta-de-sao-jorge` to DRQPE (**41**). Madeira's Calheta is proven correct. Algarve's Lagoa has the right identity routing, but its source value remains unverified because of the missing extract.

For the seven regional rows, pages and YAML agree on document, edition, page (DRQPE pp. 1/2; IEM p. 3), access date and verbatim excerpt; the excerpts match the normalized source lines. The internal definition notes do not render. Apart from Ponta Delgada, no page claims continental comparability.

The four added inventory lines are correctly classed as `conteudo`. Their arithmetic is consistent: 2,560 + 30 = **2,590** claims and 2,417 + 30 = **2,447** municipality rows; calculated claims stay **329**, and municipalities stay **308**. Because only eight of the thirty rows and no aggregate pages are supplied, the global totals are internally consistent but not independently recountable from this sample.
