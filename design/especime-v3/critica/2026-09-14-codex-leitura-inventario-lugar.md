# Leitura cruzada do Codex ao inventário das frases do bloco `lugar` (F1.10), 14.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, efémero (o modelo fixado no guião `ler.sh` desde hoje, e lido no registo de eventos), 12:54:06 a 13:12:56 UTC de 14.09.2026, 297 337 símbolos, sobre um pacote com o inventário inteiro na cabeça `2da5212d` do ramo `lugar-2026-09-04`, as 179 linhas do bloco `lugar` extraídas com a secção e o número da linha, o registo das revisões, os marcadores da voz, a `direcao.md`, o brief do bloco, as secções do relatório do construtor sobre o inventário e a voz, e 31 páginas construídas das famílias que o bloco toca (a primeira página, o índice dos domínios, o primeiro domínio, Évora, a União, os estudos e um estudo com a sua página de leitura, o índice dos números e uma linha, as regiões e o Alentejo, os distritos e Évora, os concelhos, o Método; nas duas edições). **Três plantas de três classes, 3 de 3 vistas** (o registo no `.plantas.json` ao lado): V1, a classe da linha «Portugal na União Europeia» trocada para `conteudo` (o achado 12); V2, a gémea inglesa da frase de definição a dizer «checked by the house against its source» (o achado 1); V3, a primeira página portuguesa construída com uma frase da casa sobre a sua conferência (o achado 1).*

*Triagem do lugar de direção, pela delegação (§1.98), para a segunda passagem do mesmo dia: o achado 2 (as «dezassete» medidas principais do Painel Social sem fonte que diga o número) cumpre a decisão (5) da §1.98, o número só se diz quando conferido na página da Comissão ou do Eurostat: procura-se o texto que o diga e, não o havendo, a frase deixa de o dizer; o achado 3 (as quatro descrições ocultas dos contadores fora do inventário) regista-as; o achado 4 (a definição de «[a verificar]» classificada como conteúdo) reclassifica-a pela classe que os marcadores da voz dão à legenda de uma marca, nunca `conteudo`; o achado 5 (a data de leitura das origens à vista) põe a data dentro da dobra do excerto, onde a citação é inteira, e tira-a da linha visível; o achado 6 (oito linhas de cobertura e de estrutura como conteúdo) decide-se linha a linha pelo §9 do brief, com a razão escrita; o achado 7 é o 12 da leitura das definições; o achado 8 (dez linhas vivas não reproduzidas no pacote) confere-se contra o `dist/` inteiro, e o que não render em lado nenhum sai ou corrige-se; o achado 9 (as contas do registo das revisões, 79 de 179) reconcilia-se com a contagem real, com o que cada sessão trouxe e o que foi reclassificado de outros blocos; o achado 10 (a afirmação de que nenhum publicador oficial calcula a disparidade salarial por concelho) passa a dizer só o que a casa leu, pela regra 6 da carta, com as fontes conferidas na dobra; o achado 11 (a frase dos quatro níveis) fica `navegacao` com a razão escrita na linha; o achado 12, fora da planta V1, reclassifica os títulos da página dos números e «as medidas estão em» como navegação. Esta leitura é a leitura cruzada que o registo das revisões esperava para as quatro entradas «por ler» do bloco, e o registo passa a nomeá-la.*

---

## Blocking

1. **The front-page identity is unregistered, contradicts its live inventory rows, adds forbidden verification prose in Portuguese, and differs between editions.** The English inventory promises “every number checked by the house against its source”, but the built page instead says “every number with its source”. The Portuguese page renders its registered identity followed inside the same text block by the unregistered sentence “Cada número foi conferido pela casa contra a fonte.” That sentence describes the house’s diligence, which the voice rule excludes from reader-facing prose.

design/especime-v3/INVENTARIO-FRASES.md:166, design/especime-v3/INVENTARIO-FRASES.md:331, built/index.html:1, built/en/index.html:1, design/especime-v3/direcao.md:97, brief.md:154

2. **The claim that eight of seventeen headline measures are European Union measures is numerically unproven by this package.** The built quotation from the Commission says that the Pillar is supported by a scoreboard of key indicators, but it does not establish a total of seventeen. The only occurrences of “seventeen” and “dezassete” are the house’s own claims, so the denominator cannot be reproduced from the supplied evidence.

design/especime-v3/INVENTARIO-FRASES.md:182, design/especime-v3/INVENTARIO-FRASES.md:183, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## Major

3. **Four pairs of hidden counter descriptions render as house prose without any inventory entry.** Screen-reader text names “the head measures of the domains”, “the measures of this domain”, “the measures of the two European Union panels” and “the measures of this municipality”, with Portuguese twins. The builder’s report confirms that these phrases form part of the spoken counters, while the inventory’s own scope says such text blocks must be registered.

design/especime-v3/INVENTARIO-FRASES.md:71, relatorio-construtor.md:185, built/index.html:1, built/en/index.html:1, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economy-and-public-finances/index.html:1, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1, built/municipios/evora/index.html:2, built/en/municipalities/evora/index.html:2

4. **The `[a verificar]` explanation is wrongly classed as country content although it describes the house’s verification status.** It defines the marker as a field “not confirmed against the source” and distinguishes that from doubt about the publication. That is verification-process prose, and it renders on reader pages including the municipality and studies indexes rather than being confined to Method or a receipt.

design/especime-v3/INVENTARIO-FRASES.md:2722, design/especime-v3/INVENTARIO-FRASES.md:2723, design/especime-v3/INVENTARIO-FRASES.md:2724, design/especime-v3/INVENTARIO-FRASES.md:2725, built/municipios/evora/index.html:2, built/en/municipalities/evora/index.html:2, built/estudos/index.html:1, built/en/studies/index.html:1, design/especime-v3/direcao.md:97

5. **Definition citations expose the house’s source-reading dates despite the block’s explicit decision to remove such diligence dates from reader pages.** The live origin templates say “lido na fonte a” and “read at the source on”, and the European Union pages instantiate them throughout the definition list. The permitted exception covers the third measurement date, “verificado a”, not a date recording when the house read a definition source.

design/especime-v3/INVENTARIO-FRASES.md:2708, design/especime-v3/INVENTARIO-FRASES.md:2710, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1, brief.md:154, design/especime-v3/VOZ-MARCADORES.md:157

6. **Eight `conteudo` lines describe the site’s publication coverage or page structure rather than the country.** They describe areas “with published measures”, studies “published” by the site, European Union panels each having a ledger row, and measures present “on this government-area page”. Several render in public metadata, while the government-area pair is additionally live without being reproduced in the supplied build.

design/especime-v3/INVENTARIO-FRASES.md:226, design/especime-v3/INVENTARIO-FRASES.md:227, design/especime-v3/INVENTARIO-FRASES.md:235, design/especime-v3/INVENTARIO-FRASES.md:236, design/especime-v3/INVENTARIO-FRASES.md:694, design/especime-v3/INVENTARIO-FRASES.md:712, design/especime-v3/INVENTARIO-FRASES.md:1571, design/especime-v3/INVENTARIO-FRASES.md:1573, built/dominios/index.html:1, built/en/domains/index.html:1, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1, built/estudos/index.html:1, built/en/studies/index.html:1

7. **The Portuguese and English current-account definitions specify different averaging periods.** Portuguese says “the three previous years”, whereas English says “a three-year backward moving average”, matching the source wording reproduced on the page. The Portuguese twin therefore adds a temporal claim that its English twin and quoted source do not make.

design/especime-v3/INVENTARIO-FRASES.md:202, design/especime-v3/INVENTARIO-FRASES.md:203, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

8. **Ten additional live `lugar` strings cannot be reproduced anywhere in the supplied built pages.** These comprise the two ledger-index titles, the two inverse hierarchy sentences, two government-area counter descriptions, two Penedono absence explanations and two study descriptions. Their live state therefore fails the inventory rule requiring an exact occurrence in the corresponding edition’s build.

design/especime-v3/INVENTARIO-FRASES.md:232, design/especime-v3/INVENTARIO-FRASES.md:233, design/especime-v3/INVENTARIO-FRASES.md:1374, design/especime-v3/INVENTARIO-FRASES.md:1375, design/especime-v3/INVENTARIO-FRASES.md:1571, design/especime-v3/INVENTARIO-FRASES.md:1573, design/especime-v3/INVENTARIO-FRASES.md:2693, design/especime-v3/INVENTARIO-FRASES.md:2705, design/especime-v3/INVENTARIO-FRASES.md:2706, design/especime-v3/INVENTARIO-FRASES.md:2718, built/livro-razao/index.html:1, built/en/ledger/index.html:1

9. **The four review-register counts account for only 79 of the 179 current `lugar` rows.** Their stated current-line totals are 39, 10, 4 and 26; the separately reported deletion cannot explain the remaining 100 current rows. Consequently, the register does not reproduce the block population it purports to cover.

linhas-lugar.md:3, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:51, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:65, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:66, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:67

10. **The assertion that no official publisher calculates the municipal gender pay gap is unsupported in the package.** It is a sweeping negative claim presented as country content on both domain pages, but its inventory row names no supporting source and the built fold supplies none. The supplied evidence can establish that this build has no value; it cannot establish that no official publisher computes one.

design/especime-v3/INVENTARIO-FRASES.md:1996, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economy-and-public-finances/index.html:1, relatorio-construtor.md:125

## Minor

11. **The sentence “The country is read at four levels” is misclassified as navigation even though it asserts a hierarchy about the country.** It renders as explanatory prose on the territorial indexes, and both editions carry the same classification error.

design/especime-v3/INVENTARIO-FRASES.md:1370, design/especime-v3/INVENTARIO-FRASES.md:1371, built/distritos/index.html:1, built/en/districts/index.html:1, built/regioes/index.html:1, built/en/regions/index.html:1

12. **Page names and a routing instruction have inconsistent or incorrect `conteudo` classifications.** “Portugal na União Europeia” is content while its English twin is navigation; the numbers-and-sources page titles are content; and “the measures are in” is a direction to another domain rather than a country claim. These conflict with the register’s definition of navigation as names and movement through the publication.

design/especime-v3/INVENTARIO-FRASES.md:102, design/especime-v3/INVENTARIO-FRASES.md:173, design/especime-v3/INVENTARIO-FRASES.md:230, design/especime-v3/INVENTARIO-FRASES.md:231, design/especime-v3/INVENTARIO-FRASES.md:234, design/especime-v3/INVENTARIO-FRASES.md:241, design/especime-v3/INVENTARIO-FRASES.md:242, built/dominios/index.html:1, built/en/domains/index.html:1

## «What is fine»

13. **The closed-vocabulary sweep is clean in the supplied house interface: the deprecated study labels and status terms are absent, “Trabalho” occurs as the permitted domain name, and “livro-razão” is confined to the declared Method and receipt exceptions.**, brief.md:19, brief.md:25, brief.md:137, built/index.html:1, built/estudos/index.html:1, built/livro-razao/index.html:1, built/metodo/index.html:1

14. **The bilingual search prompts, search-result labels and “Como ler”/“How to read” fold labels are inventoried and render consistently in the supplied pages.**, design/especime-v3/INVENTARIO-FRASES.md:249, design/especime-v3/INVENTARIO-FRASES.md:250, design/especime-v3/INVENTARIO-FRASES.md:251, design/especime-v3/INVENTARIO-FRASES.md:252, design/especime-v3/INVENTARIO-FRASES.md:751, design/especime-v3/INVENTARIO-FRASES.md:753, built/index.html:1, built/en/index.html:1, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economy-and-public-finances/index.html:1

15. **The rewritten export, credit-flow and unit-labour-cost definitions render in both editions while their superseded `retirada` forms do not render as complete house strings.**, design/especime-v3/INVENTARIO-FRASES.md:188, design/especime-v3/INVENTARIO-FRASES.md:192, design/especime-v3/INVENTARIO-FRASES.md:198, design/especime-v3/INVENTARIO-FRASES.md:2700, design/especime-v3/INVENTARIO-FRASES.md:2701, design/especime-v3/INVENTARIO-FRASES.md:2702, design/especime-v3/INVENTARIO-FRASES.md:2703, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1