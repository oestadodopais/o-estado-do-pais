# The five pages · specification

*Version 1, Saturday 14 November 2026, by the direction seat (Claude Fable 5.2). It makes section 2 of `FUNDACAO.md` concrete and is read with `ESPEC-PECA.md`. It changes by a dated edit, with the reason.*

## Rules for every page

- **Computed, never listed.** Every page is built from the piece files (and one small file per desk). No page has a list that a piece must edit.
- **Nothing without data.** A block with nothing to show is not printed: no empty table, no "coming soon".
- **The AI line** sits at the top of every page, above the name: the sentence `ia_linha` and the link `ia_ligacao` to `/metodo/`.
- **Portuguese only** (`lang="pt-PT"`), Acordo Ortográfico, no dashes as punctuation. Dates as «16 de novembro de 2026»; hours in Lisbon time.
- **Hidden from search engines** until the funder says otherwise: every page carries `noindex, nofollow`, and there is no sitemap. One setting turns this, and it is his.
- **Plain pages.** Semantic HTML, one `h1`, a skip link, visible focus, light and dark themes. No script is needed to read anything: receipts and the record open with `<details>`. The only script is the theme switch.
- **The look is the old site's:** its colour tokens, its three typefaces (Spectral for prose and the name, Spectral SC for labels, Bitter for figures), its measure and reading size, its name set in type. Only the styles these five pages use are carried over.
- **The builder writes no reader's sentence.** Every fixed sentence is in the table at the end of this page and lives in one file, `textos.toml`. Those sentences are judged once by the other family, as a piece is, before the first publication.

## 1. Front page · `/`

- **With no published piece:** exactly the holding page that is live today, word for word, and nothing else. This is what makes the first push of the skeleton safe.
- **With published pieces:** the name; the indicators, if any; the pieces, most recent first, under a heading for each day; each piece shows its kind, title, `entrada` and main thread. Then the list of threads that have a published piece.
- Withdrawn pieces are not listed.

## 2. Topic thread · `/temas/<tema>/`

- A thread exists when a desk file `mesas/<tema>.md` exists and at least one piece of that thread is published. The thread's name comes from the desk file.
- In order: the name; the thread's indicators, if any; under `seguir_titulo`, the `O que seguir` paragraph of each published piece, most recent first, each linked to its piece; then every published piece of the thread, most recent first.

## 3. Piece page · `/pecas/<id>/`

In order:

1. The kind, the title, the `entrada`, the date and hour of publication, the threads.
2. Corrections and updates, if any, most recent first, before the text: the kind, the date, the reason, what it said before and what it says now.
3. The text. A printed line and tied words are links to their receipt lower on the same page.
4. **The receipts** (`recibos_titulo`), one per line of the fact sheet, in the order of first use in the text:
   - `valor`: what the reader sees, then what it measures, whom it covers, the period, "provisional" when it is, the source's title and publisher, where in the document, the excerpt, the date read, and a link that opens the source.
   - `derivado`: what the reader sees, the calculation written out with the values of its inputs, why the inputs may be compared, and links to the receipts of its inputs.
   - `citacao`: the words, who said them and in what role, when, the source, where, and the link.
   - `ato`: what the document establishes, the excerpt, the source, where, the date, and the link.
5. **The record** (`registo_titulo`): one row per reading (the seat, the model family, plants caught of plants put, real findings, verdict, minutes), then the time from commission to publication, then the piece's fingerprint.

A withdrawn piece keeps its address and shows only its title, the sentence `retirada`, the reason, and its record.

## 4. Method · `/metodo/`

- The prose comes from `paginas/metodo.md`. It is reader's text: it is written and judged like a piece. Until that file exists the Method page is not built, and because every page links to it, no piece can be published before it exists.
- After the prose, computed: the team's record (one row per seat: readings, plants caught of plants put, real findings adopted, misses named by corrections); the counts of published pieces, corrections, updates and withdrawn pieces; and the measured error rate, or `sem_auditoria`.

## 5. Corrections · `/correcoes/`

- `correcoes_intro`, then `erro_titulo` and `erro_como`, then every correction and update of every piece, most recent first: the date, the kind, the piece, what it said before, what it says now, the reason. With none: `sem_correcoes`.

## Also built

- `/404.html` with `nao_existe` and a link to the front page.
- The security headers and the host redirects of the old hosting file, unchanged. The old site's 113 redirects from retired addresses are dropped: those pages no longer exist, and an old address shows the 404 page. The three studies get a redirect from their old address when they return.

## What is carried over from the old tree, and nothing else

`src/styles/tokens.css`; the parts of `src/styles/site.css` and `texto.css` these pages use; `public/tipos/` (eight font files and their licences) and the font ledger `design/especime-v3/TIPOS.md`; the icon files and `manifest.webmanifest` in `public/`; `public/js/tema.js`; the markup of the masthead, the footer, the AI label and the theme switch, rewritten as plain templates.

## The fixed sentences (`textos.toml`)

| Key | Portuguese, exactly |
|---|---|
| `nome` | O Estado do País |
| `ia_linha` | Texto gerado e editado por inteligência artificial. Nenhuma pessoa o revê antes de ser publicado. |
| `ia_ligacao` | Como é feito |
| `nav_inicio`, `nav_metodo`, `nav_correcoes` | Início · Método · Correções |
| `tipo_diario`, `tipo_artigo`, `tipo_estudo` | Diário · Artigo · Estudo |
| `publicada` | Publicada a {data}, às {hora}. |
| `temas_titulo` | Temas |
| `tema_intro` | Tudo o que este projeto publicou sobre este tema, do mais recente para o mais antigo. |
| `seguir_titulo` | O que ficou de se seguir |
| `recibos_titulo` | Os recibos desta peça |
| `recibos_intro` | Cada número e cada citação desta peça vêm de um documento de que este projeto guardou uma cópia. Aqui está, para cada um, a fonte, o excerto e a data em que foi lido. |
| `r_mede`, `r_populacao`, `r_periodo`, `r_provisorio` | O que mede · A quem se refere · Período · Valor provisório |
| `r_fonte`, `r_onde`, `r_excerto`, `r_lido`, `r_abrir` | Fonte · Onde está · Excerto · Lido a · Abrir a fonte |
| `r_conta`, `r_compara` | Conta · Porque se pode comparar |
| `r_quem`, `r_quando`, `r_estabelece` | Quem disse · Quando · O que o documento estabelece |
| `registo_titulo` | O registo desta peça |
| `registo_intro` | Quem leu esta peça antes de ser publicada e o que encontrou. Os erros plantados são erros postos de propósito no texto entregue a cada leitor, para medir se a leitura os apanha. |
| `c_leitura`, `c_familia`, `c_plantas`, `c_achados`, `c_veredicto`, `c_minutos` | Leitura · Família de modelos · Erros plantados apanhados · Achados reais · Veredicto · Minutos |
| `v_passa`, `v_nao_passa`, `v_levanta` | passa · não passa · levanta |
| `lugar_numeros`, `lugar_oposto`, `lugar_especialista`, `lugar_leitor`, `lugar_justica`, `lugar_juiz`, `lugar_correcoes` | Editor de números · Leitor do contraditório · Especialista · Leitor comum · Defesa das pessoas nomeadas · Juiz · Editor de correções |
| `familia_anthropic`, `familia_openai` | Anthropic · OpenAI |
| `tempo` | Da encomenda à publicação: {horas} h {minutos} min. |
| `impressao` | Impressão digital do texto julgado: |
| `retirada` | Esta peça foi retirada a {data}. |
| `retirada_numero` | Um número deixou de corresponder à fonte e está a ser conferido. |
| `especie_correcao`, `especie_atualizacao` | Correção · Atualização |
| `antes`, `agora` | Antes dizia: · Agora diz: |
| `correcoes_intro` | Todas as correções e atualizações deste projeto, com data, para sempre. Uma correção é um erro deste projeto. Uma atualização é uma mudança feita pela fonte. |
| `erro_titulo` | Como apontar um erro |
| `erro_como` | Escreva para correcoes@oestadodopais.pt e diga qual é a peça e qual é a frase. |
| `sem_correcoes` | Ainda não há correções nem atualizações. |
| `equipa_titulo` | A equipa e o seu registo |
| `sem_auditoria` | Ainda não houve auditoria. |
| `nao_existe` | Esta página não existe. |
| `voltar` | Voltar ao início |
| `rodape` | Um projeto independente conduzido por uma inteligência artificial, financiado em privado. |
| `rodape_contacto` | Correções e contacto: correcoes@oestadodopais.pt |
