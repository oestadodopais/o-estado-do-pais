# BRIEF · Parte 3, M1 · a medição cega das páginas de leitura (exemplar 04 pt, 04 en, 08 pt)

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre depois da P2, sobre a construção do ramo `parte3-2026-08-24`. Sem travessões na prosa deste ficheiro.*

## 0 · O que é, e o que não é

Uma medição **cega e independente**: código teu, escrito do zero, que lê as páginas de leitura construídas e os registos de conteúdo e diz, número a número, onde concordam e onde não. **Não importas nada do sítio**: nem `src/lib/eyetext.mjs`, nem `src/lib/registo-html.mjs`, nem `src/lib/registos.mjs`, nem o portão. Se o teu leitor discordar do registo, relatas a discordância com o excerto dos dois lados e a coordenada; o lugar de direção decide se é o teu leitor ou a página. Um medidor que só relata concordância não vale nada; um que relata as suas próprias falsas alarmes com a causa vale muito (a medição de 23.08 fez isso e foi útil).

Não lês nenhum brief da construção, nenhuma nota, nenhum `DECISIONS.md`: só o que está abaixo, o formato do registo e os ficheiros.

## 1 · O que lês

* O formato do registo: `/Users/nunosantos/Instruments/ResearchHub/publisher/REGISTOS.md` (as secções «A forma do registo», «A leitura do olho», «Cada algarismo como referência»). É o contrato do formato; lê-o inteiro.
* Os registos: `/Users/nunosantos/Instruments/OEstadoDoPais/registos/<slug>/<lang>.record.json` e `registos/manifest.json`, para as três edições do exemplar:
  * `evora-prometido-pago-auditado-2026/pt` e `/en`
  * `evora-quinze-anos-cinco-mandatos/pt`
* As páginas construídas: `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html`, `dist/en/studies/evora-prometido-pago-auditado-2026/text/index.html`, `dist/estudos/evora-quinze-anos-cinco-mandatos/texto/index.html`.
* O registo de travessia das linhas: `ledger/cruzamentos/evora.json` (mapa `rows[<site_id>] → { rh_study, rh_id, … }`).
* As edições arquivadas, só para a medição 9: `dist/estudos/evora-prometido-pago-auditado-2026/documento/index.html` e a inglesa em `dist/en/studies/…/document/index.html`.

## 2 · O contrato de marcação da página (o que a página promete; mede se cumpre)

* `<article data-registo-edicao="<slug>/<lang>">` contém o corpo transcrito, e só ele.
* Cada bloco do corpo tem `data-registo-bloco="<b>"` (`h1`…`h4`, `p`, `ul`/`ol`, `table`, `hr`), na ordem do registo.
* Cada unidade com texto tem `data-registo-unidade="<slug>/<lang>#<b>[.<i>|.<r>.<c>]"` (o próprio `h*`/`p`, cada `li`, cada `td`/`th`).
* Cada figura tem `data-registo="<slug>/<lang>#<b>[.<i>|.<r>.<c>].<f>"` num elemento que embrulha só os seus caracteres; o texto é o `printed` da figura.
* Uma figura com linha do sítio tem, colado a seguir, um selo `<a class="src-chip" href="/livro-razao/<site_id>">` (ou `/en/ledger/<site_id>`); uma figura sem linha do sítio é `<a href="#linha-<row>" data-registo=…>` ou, dentro de uma ligação do documento, um `<span data-registo=…>`.
* Depois do `<article>`, a secção `id="linhas-do-documento"` com uma entrada `id="linha-<row>"` por linha do motor citada, com campos `data-registo-linha="<slug>/<lang>@<row>.<valor|impresso|origem>"`.
* No aparelho, três contagens `data-registo-conta="<slug>/<lang>=<blocos|algarismos|com_linha_do_sitio>"`.
* O texto de uma unidade lê-se assim (é a regra do formato): os nós de texto dentro da unidade juntam-se sem nada pelo meio; uma corrida de espaço em branco vale um espaço; sem espaço à cabeça nem à cauda; entidades HTML descodificadas; **o texto do selo (`.src-chip`) não conta**, porque é mobília e não texto do documento.

## 3 · As medições, uma a uma, com o número e a lista das discordâncias

Escreve um só programa (Node ou Python, o que preferires; se usares um analisador de HTML, usa um da biblioteca padrão ou instala-o numa pasta tua fora do repositório; **não** uses o `node_modules` do sítio para importar módulos do sítio) e corre-o sobre as três edições. Para cada medição: a contagem esperada, a contagem lida, e cada discordância com a coordenada e os dois textos (até 120 caracteres cada).

1. **Blocos:** a sequência (`b`, género, nível, `ordered`) dos elementos `[data-registo-bloco]` da página é a do registo, sem falta nem excesso.
2. **Unidades:** o texto de cada `[data-registo-unidade]`, lido pela regra da §2, é igual carácter a carácter ao `text` da unidade do registo. Conta as iguais e lista as diferentes.
3. **Figuras:** cada `[data-registo]` resolve numa figura do registo; o seu texto é `printed`; e `text[start:end]` no registo é também `printed`. Conta as figuras da página e compara com `referencias` do manifesto e com o número de figuras do registo.
4. **Nenhuma figura em falta:** cada figura do registo tem uma marca na página (a inversa da 3).
5. **Ênfase e ligações:** para cada intervalo de `emphasis[]` e de `links[]` do registo, existe na página um elemento (`strong`/`b`, `em`/`i`, `code`, `a[href]`) dentro da unidade cujo texto (pela regra da §2) é `text[start:end]`; para as ligações, o `href` é o do registo. Conta e lista as que não encontras.
6. **Selos e portas:** para cada figura, decide pelo registo de travessia se tem linha do sítio (`rh_study` do manifesto e `row` da figura casam com `rows[*].rh_study` e `.rh_id`). Se tem: há um selo colado (`.src-chip`) cujo `href` termina em `/<site_id>`; se não tem: há uma porta `#linha-<row>` (ou a figura está dentro de uma ligação do documento e a entrada `linha-<row>` existe). Conta quatro coisas: figuras com linha e selo certo; figuras com linha e selo errado ou em falta; figuras sem linha com porta (ou entrada); figuras sem linha com selo (tem de ser zero). Cada `#linha-<row>` resolve num `id` da mesma página.
7. **Cabeçalhos de tabela:** `th` exatamente onde o registo tem `header: true`, e `td` onde não tem.
8. **«As linhas deste documento»:** uma entrada por `row` distinto do registo, sem entrada a mais; em cada entrada, `valor` é o `value` das figuras dessa linha (igual em todas), `impresso` são as formas `printed` distintas na ordem do documento juntas por ` · `, `origem` é o `source_sha256` (64 hexadecimais) ou o `source_digest_kind`. Conta as entradas certas e lista as erradas.
9. **A edição arquivada não é a página** (medição de controlo, só no 04): compara a leitura pela regra da §2 dos `<p>` e `<h2>` da página de leitura com a mesma leitura sobre a edição arquivada `/documento`, bloco a bloco, e relata **onde diferem**. Espera-se que difiram na tabela de cabeçalho (a página tem uma tabela; a edição arquivada tem gráficos) e nas frases que a passagem de voz do motor retirou; relata a lista das diferenças e não a julgues. Se as duas fossem iguais, isso seria a notícia.
10. **As contagens do aparelho:** as três `data-registo-conta` batem com as tuas contagens (blocos do registo, figuras do registo, figuras com linha do sítio).
11. **Algarismos fora de marca:** dentro do `<article>`, todo o algarismo `[0-9]` está dentro de um `[data-registo-unidade]` (não precisa de estar numa figura: um ano numa frase é texto da unidade). Conta os que estão fora (tem de ser zero).
12. **Nada nosso dentro do corpo:** dentro do `<article>`, os únicos elementos com texto que não são `h1`…`h4`, `p`, `ul`/`ol`/`li`, `table`/`tr`/`td`/`th`, `strong`/`b`, `em`/`i`, `code`, `a`, `span`, `div` sem texto próprio, e `.src-chip`, são listados (tem de ser zero).

## 4 · O relatório

Um ficheiro Markdown em `/Users/nunosantos/Instruments/OEstadoDoPais/design/especime-v3/medicoes/parte3-M1-sonnet.md` (a pasta existe) com: o caminho do teu programa (guarda-o em `design/especime-v3/medicoes/parte3-M1-sonnet.mjs` ou `.py`, ao lado, para poder ser corrido outra vez), a tabela das doze medições por edição (esperado, lido, discordâncias), a lista completa das discordâncias com coordenada e os dois textos, **as tuas próprias falsas alarmes** com a causa quando as encontrares (uma discordância que investigaste e vem do teu leitor e não da página: diz isso, não a apagues), e o custo em símbolos desta corrida como o vires. Nada é «ok» sem o número ao lado. Não corriges nada no sítio; não commitas; não tocas em nenhum ficheiro fora da pasta `medicoes/`.
