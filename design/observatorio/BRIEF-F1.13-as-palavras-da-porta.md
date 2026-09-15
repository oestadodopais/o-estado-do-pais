# Brief F1.13 · As palavras da porta e o índice dos domínios (15.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir do que o diretor viu na primeira página no ar a 15.09.2026 de manhã (as capturas e as palavras dele na conversa, em inglês) e das recomendações do lugar de direção, que ele mandou seguir («follow your recommendations»). Corre depois da fatia `dominios-css-2026-09-15` (a folha da lista dos domínios, o espaço, «incluído em», o campo da busca) estar em `main`. Sem travessões na prosa.*

## 0 · A regra nova, dita pelo diretor

«When I hear a description, it sounds correct, but then when we experience it on the page, it doesn't work.» A partir de 15.09.2026, **uma mudança de forma decide-se em capturas nas larguras reais, enviadas ao diretor antes de aterrar**, e não numa descrição. Este bloco entrega as capturas de cada página que toca a 390, 768, 1 024, 1 280 e 1 600 px, antes e depois, e o lugar de direção mostra-as ao diretor antes da aterragem.

## 1 · As decisões (tomadas; o construtor aplica)

| # | o que o diretor viu | a decisão |
|---|---|---|
| 1 | a frase de definição («cada número com a sua fonte, lido por território, por domínio e em estudos») descreve o método e não diz o que o sítio é | a frase passa a **«Os números oficiais de Portugal, do país ao seu concelho, cada um com a fonte.»** / **«Portugal's official numbers, from the country to your municipality, each with its source.»**; a L4 continua a exigi-la uma vez em `/` e `/en/`; a linha antiga do inventário passa a `retirada` com a razão (o diretor, 15.09) e as duas novas entram como `navegacao` (a frase da identidade do sítio) |
| 2 | «a página inteira →» nas três portas (Concelhos, Estudos, Agenda) diz o mecanismo e não o destino | as etiquetas passam a **«Todos os concelhos →»**, **«Todos os estudos →»**, **«Toda a agenda →»** / **«All municipalities →»**, **«All studies →»**, **«The whole agenda →»**; a linha da contagem por baixo do nome fica; inventário como no item 1 |
| 3 | três caminhos para o mesmo lugar no primeiro ecrã: a busca, «Os nomes no mapa» e o mapa | a gaveta «Os nomes no mapa» deixa de estar à vista quando o mapa funciona: fica na página para a tecnologia de apoio e para quem não tem guião (visualmente escondida com guião; sem guião, aberta como hoje); as células do F1.1d e do F1.1e que medem a lista fechada passam a medir isto (a lista existe, tem os 29 nomes com porta, não se vê com guião, vê-se sem guião), com a decisão citada; a etiqueta da busca passa a **«Escreva o nome do concelho, ou toque no mapa.»** / **«Type the name of a municipality, or tap the map.»** |
| 5 | a legenda «Os dois estados do selo» nas páginas das áreas (o `<aside class="aparelho">`, a cadeia `seloK`): «estados» chama o nome do sítio, e «selo» é um selo de correio para quem lê | a marca passa a chamar-se **«a marca da fonte»** / **«the source mark»** em toda a prosa que o leitor vê (o Método pode dizer uma vez «a marca da fonte, o selo no vocabulário da casa»); a legenda deixa de ter título de aparelho e passa a uma linha em palavras, nas duas edições: **«Ao pé de cada número, a marca da fonte: ■ fonte, excerto e data conferidos · ▢ um campo por confirmar.»** / **«Beside every number, the source mark: ■ source, excerpt and date checked · ▢ one field still to confirm.»**, com as duas amostras da marca no lugar dos quadrados; as linhas do inventário como no item 1; a régua L3 conta «selo» a 0 nas páginas do leitor fora do Método, com as transcrições e o texto citado fora da conta |
| 4 | o índice dos domínios diz «10 medidas» e não diz o que são; o leitor não sabe se vale a pena entrar | cada linha de um domínio vivo passa a levar, a seguir à contagem, **os nomes das suas medidas de cabeça** (as da faixa), tirados das declarações das medidas em `src/data/figuras.mjs` e nunca escritos à mão, sem valores (a A3 e o 8.13 continuam a proibir um valor selado nesta secção): «10 medidas: dívida pública, saldo das administrações públicas, taxa de emprego, taxa de desemprego, ganho médio mensal, e mais cinco», nas duas edições, com «e mais N» contado; os domínios sem página ficam como estão; «Trabalho · incluído em Economia e finanças públicas» fica como a fatia o deixou |

## 2 · O que não entra

Nenhum número novo; nenhuma mudança à identidade (tipos, marca); nenhuma mudança à geometria dos cartões nem do mapa (é o F1.12); nada nos documentos alojados.

## 3 · Onde se constrói

Ramo `porta-2026-09-15` numa worktree própria a partir de `main` depois da fatia `dominios-css-2026-09-15` fundida (o lugar de direção diz o SHA). Ficheiros: `src/i18n/strings.mjs`, `src/views/HomeView.astro` e os componentes da primeira página (o masthead, as portas, a busca, a gaveta dos nomes), o componente da lista dos domínios que a fatia criou, `src/data/figuras.mjs` só para ler os nomes, as réguas (`tests/inicio/*.mjs`, `scripts/check-lugar.mjs`), o inventário e o registo das revisões, `CHAVES-EN.md`, o relatório `design/especime-v3/medicoes/porta-construtor.md`.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| P1 | a frase nova a 1 em `/` e `/en/`, a antiga a 0 | a L4 e `check:voz` |
| P2 | as três etiquetas novas nas portas, as antigas a 0, nas duas edições | grep sobre o `dist/`, `check:voz` |
| P3 | com guião, «Os nomes no mapa» não ocupa píxel nenhum à vista a 390 e a 1 280 (medido no navegador); sem guião, a lista com os 29 nomes e as portas certas | as células do mapa reescritas, com a decisão citada; o axe a 0 |
| P9 | «selo» e «estados do selo» a 0 nas páginas do leitor fora do Método, nas duas edições; a linha da legenda a 1 em cada página que rende a marca | a L3 e uma célula nova |
| P4 | cada domínio vivo com os nomes das medidas de cabeça na sua linha, iguais aos da faixa, e «e mais N» com N igual à contagem menos os nomes; 0 valores selados na secção | uma célula nova em `check:lugar` ou `leitura.mjs` |
| P5 | o primeiro ecrã a 390 × 664 não muda (a altura da cabeça e a manchete medidas antes e depois) | as células A1 e A11 |
| P6 | **as capturas** de `/` e `/en/` a 390, 768, 1 024, 1 280 e 1 600 px, antes e depois, em `design/especime-v3/capturas/porta-2026-09-15/`, com a rota de cada nome declarada | o guião das capturas do bloco |
| P7 | `build`, `verify` e `typecheck` a 0 com os códigos lidos dos ficheiros; `check:voz` com as cadeias novas e mudadas declaradas | os três comandos |
| P8 | plantas: a frase antiga de volta; uma etiqueta «a página inteira →» de volta; a gaveta visível com guião; um valor selado na linha de um domínio | a régua |

## 5 · O que se entrega

O relatório a começar pela tabela das medidas; as capturas; o SHA e a corrida `portão` verde; não fundes em `main`. Commits pequenos em português sem travessões, com os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido. Estimativa: Opus, uma passagem, da ordem de 300 a 500 mil símbolos (S).
