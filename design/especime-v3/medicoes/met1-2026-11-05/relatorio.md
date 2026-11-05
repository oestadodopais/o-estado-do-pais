# MET1: o Método como página de usar

O Método tem quatro secções, sem lede, nas duas edições. O exemplo é a linha `divida-publica-2025`, do Eurostat. O valor, a unidade, a fonte, o documento, a série, o excerto e as datas vêm do livro-razão; o selo abre o recibo completo. Não é um número calculado, pelo que não há uma conta a mostrar.

As frases portuguesas do §2 ficaram como recebidas. Não foi necessária uma frase adicional sobre os limites do programa. A tradução inglesa tem os mesmos passos e tokens. O percurso usa SVG e CSS, sem depender de JavaScript, e desliga a animação com `prefers-reduced-motion: reduce`.

As frases sobre a classificação de partidos, financiamento e publicidade, dinheiro de entidades medidas, jornalismo e dados pessoais passaram para o Sobre palavra por palavra. As frases anteriores do Sobre ficaram intactas. A declaração anterior de financiamento privado foi conservada; a frase transferida repete essa condição porque inclui também a ausência de publicidade e de dinheiro de instituições e o mandato proíbe a sua reescrita.

A lista fechada do Método tem um oráculo independente da vista e 44 plantas. Abrange prosa adicional, `noscript`, títulos, atributos, contagens, campos e ligações do recibo, portas e as frases transferidas. A chave `conferencias_da_corrida` conta 62 passos. Duas implementações recontam a lista, e as plantas executam o extrator real de `conferir-tudo.sh` sem executar as conferências. O portão dos números, a transcrição literal dos campos e a auditoria dos selos continuam ativos no recibo.

As duas redireções antigas apontam para `#marcas`. Conservam-se as âncoras usadas pelos recibos e pelas correções. As duas citações antigas em `IDENTIDADE.md` foram atualizadas para as frases do mandato; a amarra continua a compará-las. O feixe de desenho passa a usar a legenda nova da cor e deixa de procurar a secção da letra retirada do Método.

## Medições

- Texto do marcador antigo: 0 ocorrências em 4914 páginas portuguesas e 0 em 4909 páginas inglesas, excluindo script e style.
- Método: 460 tokens separados por espaços em português e 448 em inglês, sobre o texto estruturado do main, incluindo o rótulo de IA e o recibo.
- Quatro secções e dez passos em cada edição.
- Cabeça registada pelo dist: `6f93372ae16e2abc103f972a7bb4fbc02818889c`. A árvore contém a implementação desta passagem.

## Verificação

O inventário conservava como vivas frases retiradas do Método. Foram marcadas como retiradas, com a razão MET1, sem mudar a régua. As frases transferidas para o Sobre conservam o seu estado. A última corrida completa do build está a terminar; os resultados finais ficam registados abaixo.

| Conferência dirigida | Código |
| --- | --- |
| `ledger:check`, depois de atualizar as citações | 0 |
| `typecheck`, depois de anotar o tipo da lista | 0 |
| `check:css` | 0 |
| `check:lugar` | 0 |
| `tests/incorporar/conferir.mjs` | 0 |
| `design:feixe` | 0 |
| `check:privacidade` | 0 |
| `check:mortos` | 0 |
| Plantas do Método | 0 |
| `tests/metodo/construido.mjs` | 0 |
| Capturas pelo escrivão | 0 |

As larguras medidas foram 390, 768, 1024, 1280 e 1600 px, nas duas edições. Em todas, a largura do documento coincidiu com a pedida. As dez capturas e os recortes estão em `capturas/`, com o manifesto. Inspeção visual: percurso português a 390 px e recibo inglês a 1280 px, legíveis e sem sobreposição. O capturador usa a preferência de movimento reduzido.

A captura foi feita sobre a construção anterior à correção do estado das frases no inventário. Essa correção não muda o HTML nem o CSS da página. As cópias HTML do relatório serão confrontadas com o main final. O texto abaixo preserva a extração do DOM; a separação visual entre a unidade e o selo é dada pelo CSS, conferida na captura e pela régua C2.

Não foi corrida a cadeia completa de `verify`, nem os três portões pelo escrivão: esta passagem não é a aterragem. Os erros foram diagnosticados nas conferências que os deram. O motor não foi alterado.

## Cópia construída em português

```text
Texto gerado por inteligência artificial, segundo o Método.

Método

Conferir um número
Toque em «fonte», ao lado de um número, para abrir o seu recibo.
Dívida pública · 2025
89,2 % do PIBfonte · Eurostat
quem o publicou
Eurostat
o documento
General government gross debt (EDP concept), consolidated - annual data
onde está no documento
tipsgo10 · 2025
o excerto, como a fonte o escreveu
General government gross debt (EDP concept), consolidated - annual data — Percentage of gross domestic product (GDP) — Portugal — 2025: 89.2
a data em que foi lido
26.10.2026
Um selo a tracejado quer dizer que falta confirmar um campo do recibo na fonte; hoje são 6.

Do documento à página
Um modelo de inteligência artificial lê as notícias, os calendários das fontes e o que os partidos publicam, e aponta o que mudou.
Um programa descarrega o documento da fonte, guarda uma cópia com o recibo do pedido e mede o número no próprio documento.
O número entra no livro-razão com a fonte, o documento, o excerto e a data.
A direção escreve o que muda e as frases que o leitor vai ler, conferidas na fonte.
Um modelo constrói a mudança.
A cada construção correm 62 conferências automáticas sobre todas as páginas: um algarismo sem linha no livro-razão, ou com outro valor, trava a publicação.
Um modelo de outra família, que não construiu a mudança, lê-a contra os documentos, com cinco erros plantados nas suas cópias para medir se os apanha.
O que a leitura encontra corrige-se, e a correção volta a ser lida.
Só se publica o que passou em todas as conferências, e a cópia publicada volta a ser conferida depois de estar no ar.
Os números do painel são relidos na fonte, a última vez a 02.11.2026; quando a fonte muda um valor, o número muda e o registo diz o que estava antes.

As marcas
fonte: abre o recibo do número.
dado provisório: a fonte diz que o valor ainda pode mudar.
calculado: o número foi calculado a partir de outros, e o recibo mostra a conta.
por confirmar na fonte: um campo do recibo ainda não foi confirmado no documento.
Âmbar: o valor está fora do valor de referência que a fonte publica. Cobalto: está dentro. Uma medida sem valor de referência não leva cor.
Estudo atualizado: o estudo ganhou documentos novos. Estudo corrigido: o texto dizia uma coisa que não devia. A edição anterior fica sempre a um toque.

Quando um número muda
Cada mudança fica no registo das correções, com a data, o que estava e o que ficou.
Estas páginas são escritas, conferidas e atualizadas por modelos de inteligência artificial; nenhuma pessoa revê cada mudança antes de se publicar.
A agenda Política de inteligência artificial
```

## Cópia construída em inglês

```text
Text generated by artificial intelligence, according to the Method.

Method

Check a number
Tap «source», next to a number, to open its receipt.
Public debt · 2025
89,2 % of GDPsource · Eurostat
who published it
Eurostat
the document
General government gross debt (EDP concept), consolidated - annual data
where it is in the document
tipsgo10 · 2025
the excerpt, as the source wrote it
General government gross debt (EDP concept), consolidated - annual data — Percentage of gross domestic product (GDP) — Portugal — 2025: 89.2
the date it was read
26.10.2026
A dashed seal means a field of the receipt is still to be confirmed at the source; today there are 6.

From document to page
An artificial intelligence model reads the news, source calendars and what parties publish, and identifies what has changed.
A program downloads the source document, saves a copy with the request receipt and measures the number in the document itself.
The number enters the ledger with its source, document, excerpt and date.
Direction writes what changes and the sentences the reader will read, checked against the source.
A model builds the change.
Each build runs 62 automated checks across all pages: a digit without a ledger row, or with a different value, stops publication.
A model from another family, which did not build the change, reads it against the documents, with five errors planted in its copies to measure whether it finds them.
What the reading finds is corrected, and the correction is read again.
Only work that has passed every check is published, and the published copy is checked again once it is live.
The panel numbers are read again at the source, most recently on 02.11.2026; when the source changes a value, the number changes and the register shows what was there before.

The marks
source: opens the number’s receipt.
provisional data: the source says the value may still change.
calculated: the number was calculated from others, and the receipt shows the arithmetic.
to be confirmed at the source: a field of the receipt has not yet been confirmed in the document.
Amber: the value is outside the reference value published by the source. Cobalt: it is within it. A measure without a reference value carries no colour.
Study updated: the study has gained new documents. Study corrected: the text said something it should not have. The previous edition is always one tap away.

When a number changes
Each change is recorded in the corrections register, with the date, what was there and what replaced it.
These pages are written, checked and updated by artificial intelligence models; no person reviews each change before publication.
The agenda Artificial intelligence policy
```
