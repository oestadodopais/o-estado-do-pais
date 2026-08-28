# Releitura do Codex · as áreas de governo, terceira passagem (29.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre o índice e cinco páginas de área nas duas edições (a terceira passagem, `668ab8b`), o índice do livro-razão, `areas.mjs`, as listas dos ministérios, o texto da lei orgânica, o diff do inventário e as regras 14 e 15. Custo: 162 111 símbolos, 448 s. Três plantas, registadas com sha256 antes da leitura em `2026-08-29-codex-releitura-areas.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | a unidade da medida das Finanças trocada de «% do PIB» para «Percentagem do PIB» | **sim**: a discordância de caracteres contra o índice do livro-razão e a página inglesa, e um varrimento dos 108 identificadores sem outra |
| P2 | uma frase de método reposta na página da Saúde («Esta área reúne as medidas cujo assunto é matéria …, conferidas pela casa.») | **não** |
| P3 | o selo legal do Ambiente e Energia trocado de «Artigo 25.º» para «Artigo 26.º» | **sim**: bloqueante, com o artigo certo e a lei citada |

**Pontuação: 2 de 3.** A frase de método que a leitura anterior tinha apanhado nas descrições escapou-lhe desta vez numa página; a régua da voz apanha-a na construção (é a classe que passou do leitor à construção no protocolo).

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **Vinte e uma linhas calculadas sem data de referência, fonte, documento e data de leitura** (os índices de dívida, as distâncias, a execução do PRR). **Por desenho**: são linhas derivadas, sem fonte porque a sua origem é a receita, que o recibo mostra; a peça rende o que a linha tem, como nas páginas do livro-razão. **Sem ação**; se o diretor quiser «calculada» como rótulo nessas peças, é uma linha na peça partilhada.
2. **A legenda dos dois estados do selo** («proveniência completa», «um campo por confirmar») nas páginas de área, lida como explicação de método. É a exceção registada em `VOZ-MARCADORES.md` (a legenda nomeia os estados do selo, não o método), com a rota `area` declarada nesta passagem. **Sem ação.**
3. **O marcador `[a verificar]` nas páginas inglesas.** É a convenção da casa em 2 569 páginas inglesas (o marcador é um termo da casa, com `lang="pt-PT"`, a ligar a `/en/to-verify`, com a glosa «(to verify)»). **Sem ação.**
4. **As referências legais sem `lang="pt-PT"` nas páginas inglesas**, e títulos de documentos portugueses sem a marca. **Real e pequeno**: I91, para a próxima passagem de correções pequenas (a referência legal leva a marca; os títulos de documentos são um bloco do livro-razão inteiro e decidem-se lá).
5. **Quatro medidas sob «crescimento da economia» e uma sob «combate à pobreza …» que o mapa admite serem «a matéria mais próxima», sem a página o dizer.** A página não explica o método (regra 15); o mapa é o registo, e a §1.80 nomeia as cinco. **Sem ação.**
6. **A prosa do inventário dizia vinte e duas linhas retiradas e o diff tem vinte e quatro.** **Real; corrigido no fecho.**
7. **Passa**: os outros selos legais e as matérias citadas no artigo e no número certos; os nove nomes ingleses iguais aos do Governo; os agrupamentos da Economia a ajudar a leitura; as classes do inventário coerentes.

## O relatório, tal como veio

# REPORT

The workspace is read-only, so I could not create `REPORT.md`.

## Blocking

1. **Wrong legal door.** `paginas/area-ambiente-e-energia.html` prints `Decreto-Lei n.º 87-A/2025 · Artigo 26.º, n.º 1`. Article 26 is Cultura, Juventude e Desporto. The law, `areas.mjs`, and the English page correctly place Ambiente e Energia under **Article 25(1)**.

2. **Twenty-one identifiers lack required metadata in both editions**: reference date, source, document, and access date are absent. These are:

   - `evora-divergencia-municipio-dgal-2024`
   - `evora-indice-de-divida-{2014,2017,2021,2024}`
   - `evora-pelouros-{2021,2025}-total`
   - all twelve displayed `distancia-*` calculations
   - `evora-prr-execucao-2026`
   - `evora-prr-vencido-quota-2026`

   Their value, seal, identifier, and unit are present, but this still leaves 42 incomplete renderings across Portuguese and English pages.

## Should fix

3. **Character mismatch:**  
   `paginas/area-financas.html / divida-publica-2025 / «Percentagem do PIB» / «% do PIB»`  
   The second string appears in both `paginas/livro-indice.html` and `paginas/en-area-financas.html`. The ten-item sample found no other mismatch; an expanded sweep of all 108 identifiers found none beyond this one.

4. **Rule 15 still fails on every area page.** All ten Portuguese/English area pages explain the seal through “Os dois estados do selo / The two states of the seal”, “proveniência completa / provenance complete”, and “um campo por confirmar / one field unconfirmed”. This is method/diligence explanation. Both index pages are clean.

5. **English uncertainty markers remain Portuguese.** The English Ambiente and Economia pages contain 17 rendered occurrences of `[a verificar]`, sometimes linked to `/en/to-verify`. The edition’s form should be `[to verify]`; adding `lang="pt-PT"` does not fix the wrong edition form.

6. **Portuguese remains unmarked on English pages.** All five legal references are Portuguese without `lang="pt-PT"`. Other examples include the unmarked `Água Não Faturada` study/seal and Portuguese document titles such as `Certificação Legal das Contas`, `Prestação de Contas 2025`, and `Reformar as Pensões…`. The law-matter labels and units are correctly tagged.

7. **Economia grouping helps, but overstates four fits.** Seven legal headings make the 88 measures substantially easier to scan. However, under `crescimento da economia`, `pib-real-per-capita-2025` and `evora-vab-empresarial-2024` measure levels, while the two `*-concentracao-vab4-2024` measures describe concentration, not growth. `areas.mjs` admits all four are only “a matéria mais próxima”; the page does not disclose that qualification. The same unresolved stretch appears for `racio-s80-s20-2025`: the map admits the law does not name income inequality.

8. **Inventory count is internally wrong.** Added classifications are consistent: eyebrows are `navegacao`, titles and group labels are `conteudo`, and every retired description is `retirada`. But the prose says 22 lines moved to `retirada`; the diff contains **24**.

## Note

All remaining legal seals and quoted matters match their article and number. The nine English government names match the supplied Government-name file, including the awkward but sourced `Economy and of Territorial Cohesion`.

The indexes link to four area pages absent from this package: Infrastructure and Housing, Justice, Home Affairs, and Education, Science and Innovation. I could not verify those targets here.
