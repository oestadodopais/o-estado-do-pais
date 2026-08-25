# BRIEF · Correções de UX, bloco B · os estudos, o livro-razão e as páginas de leitura

*Escrito a 25.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Decisões do diretor de 25.08 sobre a `AUDITORIA-UX-2026-08-25.md`, com a regra dele: a página do leitor diz o que a coisa é, nunca porque se deve confiar nela; nada existe para mostrar diligência. Corre depois do bloco A, no mesmo ramo `correcoes-ux-2026-08-25`. Sem travessões na prosa deste ficheiro.*

## 0 · Numa frase

As páginas dos estudos, do livro-razão e de leitura deixam de mostrar ao leitor a canalização e passam a dizer só o que a coisa é: o índice dos estudos com uma linha por trabalho, a leitura no sítio como caminho por defeito, «As linhas deste documento» dobradas no fim do artigo com o aparelho técnico lá dentro, um índice nas leituras longas, o marcador a abrir a sua explicação, os números com denominador, os identificadores como identificadores, e os alvos e o texto do telemóvel do tamanho que se toca e se lê.

## 1 · Ler primeiro

1. `AUDITORIA-UX-2026-08-25.md` (a lista: C2, C4, C7, C9, C10, C12, C13, C14, D1, D3, D4, D9; a §4 decisões 8 e 9; a §5); `medicoes/auditoria-ux-2026-08-25-opus.md` §2 (as páginas de estudo, o livro-razão, as linhas, Évora); `critica/2026-08-25-codex-leitura-ux.md` (as secções dos estudos, da leitura, do documento arquivado, do livro-razão e das linhas, e os achados 5, 8, 9, 10, 11 e 13).
2. `IDENTIDADE.md` §5 (o selo), §6 (o marcador), §10, §11 («A página de linha é um recibo», «Móvel»); `direcao.md` Emendas 2, 10, 15 e a nota do teste.
3. O código: `src/views/EstudosView.astro`, `src/views/EstudoView.astro`, `src/views/TextoView.astro` e `src/lib/registo-html.mjs` (a secção «As linhas deste documento» e o aparelho), `src/styles/texto.css`, `src/views/LivroView.astro`, `src/views/LinhaView.astro` e `src/styles/linha.css`, `src/views/MunicipioView.astro` (o par «242,6 → 105,5», o rótulo do gráfico, «sem limiar»), `src/lib/documentos.mjs` (a faixa da edição arquivada), `src/components/Provenance.astro` e `src/styles/site.css` (`.src-chip`, `.marcador`), `src/i18n/strings.mjs` e `CHAVES-EN.md`; `scripts/gate-html.mjs` onde confere as páginas de leitura (`verificaTexto`, L1 a L7) e o marcador; `scripts/check-cadeia.mjs` (C6); `scripts/medir-defeitos.mjs` e `INVENTARIO-FRASES.md` (as rotas `estudos`, `estudo`, `texto`, `livro`, `linha`, `municipio`).

## 2 · O que muda, item a item (cada um com a sua prova)

**B1 · O índice dos estudos, uma linha por trabalho (C9).** `/estudos` rende um trabalho por linha, com as suas edições (PT, EN) como portas dentro da linha e não como linhas repetidas; a data de publicação e o estado dizem-se uma vez por trabalho; o rótulo «Descrição: reformulação do título» (e os irmãos «frase de abertura do documento», «tradução da casa») deixa de ser mostrado ao leitor (é o sítio a descrever a sua própria descrição): a descrição aparece, o rótulo fica só para leitores de ecrã se a `data-verbatim` o exigir, ou sai. As contagens da prova («12 trabalhos · 16 edições») ficam.

**B2 · A leitura no sítio é o caminho por defeito (Codex 10).** Na página do estudo, «Ler no sítio →» vem primeiro e é a porta principal; «Ler o documento →» (a edição arquivada) vem a seguir, com o rótulo a dizer o que é («a edição de registo, tal como foi publicada»); nas fichas das edições, a mesma ordem. Na faixa da edição arquivada entra a porta «Ler no sítio →» para a página de leitura, quando existe (a faixa é markup nosso e o portão confere-a campo a campo: acrescenta a conferência).

**B3 · «As linhas deste documento» dobra-se no fim do artigo (decisão 8).** A secção passa para dentro de uma dobra fechada por defeito (`<details>`, a forma que o Método já usa), com a porta única «As linhas deste documento →» no fim do artigo; o aparelho técnico do registo (o `origin_ref` e os resumos) vai para dentro da dobra, e sai da coluna do aparelho. As portas de cada figura (`#linha-<row>` e as portas a seguir às ligações) continuam a abrir a entrada: **prova no telemóvel real emulado de que a navegação por fragmento abre a dobra** (o algoritmo de revelação dos antepassados `details` existe nos motores atuais; se algum não abrir, um script mínimo que abre a dobra ao mudar o fragmento, sem tocar no texto). L1 a L7 e o C6 do `check:cadeia` continuam a passar: a marcação das figuras, das entradas e das contas não muda; o que muda é o contentor. A faixa das contagens fica no aparelho, com as portas para `#documento`.

**B4 · Um índice nas páginas de leitura (D1).** No topo do artigo, «Nesta página», a lista dos títulos de nível 2 do registo como âncoras (é a forma que a agenda já tem), e um comando «subir ↑» fixo no fim do ecrã no telemóvel; nada disto entra no `<article>` (o portão compara o corpo com o registo, e a mobília fica fora). Zero blocos por classificar na régua do inventário.

**B5 · O marcador abre a sua explicação (C7).** `.marcador` passa a ser uma ligação para `/a-verificar` (ou `/en/to-verify`) onde quer que renda, com o mesmo texto e a mesma classe (IDENTIDADE §6: uma linguagem, uma classe, uma página); o portão que já compara o texto oculto dos selos aceita a ligação. Nas fichas do índice dos estudos, «Publicação: [a verificar]» diz-se uma vez por trabalho (B1).

**B6 · «concelho» em inglês (C12).** Nas cadeias da interface inglesa, «municipality» onde hoje está «concelho» («Type the name of the municipality», «No municipality by that name»), mantendo `concelho` só onde é o nome de uma coisa portuguesa citada (o título de um trabalho, um excerto). `CHAVES-EN.md` regista cada mudança.

**B7 · Os números com denominador, e os identificadores como identificadores (C13).** Em `/livro-razao`, «Proveniência completa · 128» passa a «128 de 136 linhas com proveniência completa» (as duas contagens são chaves da prova; a frase é uma rótulo novo, sem algarismos escritos à mão); nas páginas de linha, o identificador da linha e o endereço da fonte ficam em campos rotulados do aparelho («identificador», «endereço»), em Bitter, e o endereço quebra por `overflow-wrap: anywhere`; o valor e a atribuição continuam à cabeça (IDENTIDADE §11, a ordem do recibo não muda).

**B8 · «sem limiar» diz-se por palavras (C14).** Na página do concelho e onde mais aparecer, um valor sem limiar publicado leva as palavras «sem limiar» e nenhum quadrado (IDENTIDADE §2: sem limiar, nenhuma cor, diz-se por palavras); o quadrado vazio confundia-se com o selo tracejado.

**B9 · O par «242,6 → 105,5» e o rótulo do gráfico (C2, D9).** O par rende numa linha quando cabe e, quando não cabe, em duas linhas sem a seta pendurada (a seta entre os dois valores, ou a forma «de 242,6 a 105,5»), com os selos ao pé de cada valor; zero sobreposição de texto a 390, 1024 e 1280. No gráfico dos mandatos, os quatro rótulos do mesmo lado da barra, ou a regra escrita de quando um vai por baixo.

**B10 · Os alvos de toque e o texto do telemóvel nas rotas deste bloco (D3, D4).** Como no bloco A: medir a área efetiva com o `::after` antes de mexer; um chão de 12 px abaixo de 640 px; zero alvos efetivos abaixo de 44 px e zero textos abaixo de 12 px visíveis nas rotas `estudos`, `estudo`, `texto`, `livro`, `linha`, `municipio`, `agenda`, `metodo`, `correcoes` a 390 (a agenda tem 88 textos miúdos e 66 alvos; o Método 44 e 74).

## 3 · O que NÃO muda

Nenhum byte de `registos/` nem de `studies-src/`; nenhum texto governado; o texto dos documentos (I69, motor); a voz da agenda (C11, fase da voz); o nome «Leitura breve» (D5, fase da voz); a pesquisa do livro-razão (D8, bloco próprio depois); a constituição (o lugar de direção escreve as emendas).

## 4 · A régua de aceitação

* `npm run build`, `npm run verify`, `npm run typecheck` verdes; `node scripts/provar-eyetext.mjs` verde (157); `node scripts/check-cadeia.mjs` verde (196 e 2 405); `node scripts/medir-defeitos.mjs` com todas as rotas inventariadas a autorreferência 0 e zero blocos por classificar; `node tests/texto/leitura.mjs` 51/51 mais as réguas novas (`tests/texto/correcoes-b.mjs`, `tests/linha/correcoes-b.mjs`), cada uma com um estrago plantado.
* Cada item de §2 com a sua prova vermelha e verde; para o B3, as três provas: a dobra fechada por defeito, a porta de uma figura a abrir a dobra e a entrada (no iPhone 13 emulado e no computador), e os portões L1 a L7 e C6 verdes.
* Capturas antes e depois a 390 e a 1280 (`/estudos`, `/estudos/evora-prometido-pago-auditado-2026`, a sua leitura, `/livro-razao`, `/livro-razao/divida-publica-2025`, `/municipios/evora`) em `design/especime-v3/capturas/ux-2026-08-25/correcoes-b/`; `notas/correcoes-ux.md` §B com as medidas antes e depois.
* `DECISIONS.md` §1.66, subsecção do bloco B (a entrada é criada pelo bloco A; se ainda não existir, cria-a com `**Afecta:** nenhum`).
* Commits no ramo, cada um verde, caminhos explícitos, os dois trailers; não fundir, não empurrar.
* O relatório: «judgement calls for the seat» primeiro; depois item a item; as capturas; os commits; o custo; o que ficou por fazer.

## 5 · Regras

As mesmas do bloco A. Onde um item tocar numa forma que a constituição fixa (o selo, o marcador, a ordem do recibo), a mudança fica dentro do que a constituição já diz, e a nota diz qual a secção; se não couber, para esse item e diz.
