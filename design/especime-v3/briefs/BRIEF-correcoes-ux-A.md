# BRIEF · Correções de UX, bloco A · a primeira página e a navegação

*Escrito a 25.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Decisões do diretor de 25.08 sobre a `AUDITORIA-UX-2026-08-25.md` («I agree with all of them»), com a regra que ele deu de viva voz: a página do leitor diz o que a coisa é, nunca porque se deve confiar nela; nada existe para mostrar diligência. Ramo novo `correcoes-ux-2026-08-25` a partir de `main`. Sem travessões na prosa deste ficheiro.*

## 0 · Numa frase

A primeira página passa a abrir caminho ao que o sítio tem: no telemóvel o comando do concelho põe a pesquisa à vista, o mesmo comando existe nas duas larguras, a régua sai da primeira página, o selo do mapa sai do telemóvel enquanto os concelhos não tiverem página, os pontos do mapa que têm página são ligações, e a cabeça e o vazio deixam de empurrar o conteúdo para o segundo ecrã.

## 1 · Ler primeiro

1. `AUDITORIA-UX-2026-08-25.md` inteira (a lista, os pontos 3.1 a 3.5, a §4 e a §5); `PEDIDOS-DO-DIRETOR-UX-2026-08-25.md` §1 e §2b; `medicoes/auditoria-ux-2026-08-25-opus.md` §1 (B1 a B5, C1, C3, C5, D6, D7) e §2 (a primeira página), com as capturas em `capturas/ux-2026-08-25/`.
2. `IDENTIDADE.md` §3 (a cabeça), §7, §10, §11 («Móvel»); `direcao.md` Emendas 3, 7, 9, 10, 11, 13, 15, 17.
3. O código da primeira página: `src/views/HomeView.astro`, `src/components/inicio/*.astro` (o mapa, a régua, a pesquisa, o comando), `src/lib/inicio.mjs`, `public/js/inicio.js`, `src/styles/inicio.css`, `src/components/Masthead.astro` e `src/styles/site.css` (a cabeça), `src/i18n/strings.mjs` e `design/especime-v3/CHAVES-EN.md`; `scripts/gate-html.mjs` onde confere a primeira página (as chaves da prova do painel, as portas, os `data-nonledger`), `scripts/medir-defeitos.mjs` (o inventário de frases: a rota `home` está inventariada e lê autorreferência 0; tem de continuar), `tests/inicio/*.mjs` (as réguas de forma que já existem: correr antes e depois).

## 2 · O que muda, item a item (cada um com a sua prova)

**A1 · O comando do concelho põe a pesquisa à vista (B1).** No telemóvel, escolher «Concelho» revela a pesquisa **e** a deixa dentro do ecrã (rola até ela, o foco vai para o campo, o `aria-live` anuncia). Prova: `page.tap` no iPhone 13 emulado, `#pesquisa` com `getBoundingClientRect().top >= 0` e `< innerHeight`, e o `document.activeElement` no campo. Estrago: a rolagem desligada, o teste falha.

**A2 · Um comando, nas duas larguras (3.2 A, C5).** «País · Concelho», o mesmo `<a data-modo>` com papel de botão nas duas larguras, no lugar da barra do computador e dos dois botões do telemóvel. **«Região» sai por agora** (A3): o estado `?ambito=regiao:<slug>` continua a resolver (é endereço partilhável, Emenda 7) mas rende como o país com a leitura da região que já existe onde exista, sem régua; volta ao comando quando houver a página das regiões. O mapa nunca desaparece ao mudar de estado (C1). Sem script, as duas escolhas são ligações para `/` e `/municipios`, como hoje.

**A3 · A régua da convergência sai da primeira página (3.3 A).** O Instrumento n.º 1 deixa de ser rendido em `/`; o componente, a folha, as linhas do livro-razão, as chaves da prova e o `data-nonledger="escala-de-instrumento"` ficam no repositório, para a página das regiões que se seguirá; nada se apaga. As chaves da prova que só a régua rendia continuam a existir na prova (o portão exige contá-las e não exige rendê-las: confirma). O `INVENTARIO-FRASES.md` perde as frases da régua na rota `home`.

**A4 · O selo do mapa sai do telemóvel (3.1 A, B2).** Abaixo de 640 px o mapa não se rende (nem o selo de 84 px nem os 308 pontos); no seu lugar, logo por baixo da lede, a pesquisa de concelho com a lista de proximidade, à vista, com o rótulo curto que já existe («Escreva o nome do concelho»). A linha «308 concelhos · CAOP 2025 ■ fonte» fica ao pé da pesquisa. Decisão do diretor de 25.08, que substitui a forma do telemóvel da Emenda 3 enquanto os concelhos não tiverem página; o lugar de direção escreve a emenda em `direcao.md`, não tu.

**A5 · Os pontos do mapa com página são ligações (B3, 3.5 A).** No computador, cada ponto com `data-pagina="sim"` rende dentro de um `<a href="/municipios/<slug>">` com `cursor: pointer` e um `<title>` com o nome; os outros 307 ficam pontos sem ligação, sem mudar de forma (Emenda 10: todos iguais; a ligação não muda o desenho do ponto). O leitor de teclado chega ao ponto com página pelo Tab. O portão já confere ligações internas; nenhuma nova regra.

**A6 · O nome ao passar o rato ganha o espaço (C3).** «Évora · distrito de Évora», com o separador da casa entre o nome e o resto.

**A7 · A cabeça mais baixa no telemóvel (D6).** Abaixo de 640 px: a marca numa linha, as duas leituras («Painel europeu reconferido a …» e «Agenda: …») numa só linha em corpo de mobília, o comando de tema dentro do menu. Objetivo medido: o título da página (o `h1` ou a manchete) começa antes de 40% do ecrã (hoje 0,35 ecrãs é a cabeça sozinha). A leitura do cabeçalho não sai (IDENTIDADE §3): fica mais baixa.

**A8 · O vazio (D7).** A banda vazia entre a linha «308 concelhos» e o painel, a 390 e a 1280 (96 e 125 px), e os quatro valores cortados em `/municipios/evora` a 1280: medir a causa (uma margem, uma altura mínima, uma coluna vazia) e fechá-la. Objetivo: nenhuma banda de cor uniforme acima de 48 px entre dois blocos de conteúdo, medida nos pixéis como o leitor-utilizador mediu.

**A9 · O texto abaixo de 12 px no telemóvel, na primeira página (D4, só nesta rota; o resto no bloco B).** Um chão de 12 px para todo o texto abaixo de 640 px, sem mexer no computador («a mobília não cresce» é regra do computador; no telemóvel 9,5 px não se lê). Medido: zero elementos com `font-size < 12px` visíveis na rota `home` a 390.

**A10 · Os alvos de toque da primeira página (D3).** Primeiro **medir a área efetiva** com o `::after` posicionado que `a.src-chip` já tem (o leitor-utilizador mediu a caixa do elemento, 52 × 14 px, e pode ter contado o que já é 44 px): se a área efetiva já é 44 px, escreve-se isso e não se mexe; se não é, corrige-se. Os algarismos da manchete (`a.prova-valor`, 8 × 16 px) ganham área de toque de 44 px pela mesma técnica. Zero alvos efetivos abaixo de 44 px na rota `home` a 390.

## 3 · O que NÃO muda neste bloco

A frase de identidade (o diretor ainda não escolheu as palavras), as frases de contexto do painel (idem), a dobra dos nove dentro do limiar (bloco B), a página `/municipios` (é o bloco de conteúdo dos 308), o mapa por distritos (depois), nenhum texto governado.

## 4 · A régua de aceitação

* `npm run build`, `npm run verify`, `npm run typecheck` verdes; `node scripts/medir-defeitos.mjs` com a rota `home` a autorreferência 0 e sem blocos por classificar; `node tests/inicio/*.mjs` como antes (e as réguas novas dos objetivos medidos acima, em `tests/inicio/correcoes-a.mjs`, no estilo das existentes: imprimem e saem com 0, com um estrago plantado cada).
* Cada item de §2 com a sua prova vista vermelha e verde (o estrago que a desfaz, a régua a apanhá-lo, reposto).
* Capturas antes e depois a 390 e a 1280 da primeira página (a cima e a inteira) em `design/especime-v3/capturas/ux-2026-08-25/correcoes-a/`, em JPEG a escala 2, e uma nota `notas/correcoes-ux.md` §A com o que mudou e as medidas (alturas, o primeiro valor, os alvos, o texto, o vazio) antes e depois.
* `DECISIONS.md`: uma entrada nova `### 1.66 As correções de UX depois da auditoria de 25.08, bloco A`, `**Afecta:** nenhum`, com a decisão do diretor citada, os dez itens, as provas, e o que fica.
* Commits no ramo `correcoes-ux-2026-08-25`, cada um verde, explicit paths, com os dois trailers; não fundir, não empurrar.
* O relatório: «judgement calls for the seat» primeiro; depois item a item o que se viu, o que se mediu, o que mudou; as capturas; os commits; o custo; o que ficou por fazer.

## 5 · Regras

As onze decisões da parte 3 e as nove de 25.08 não se reabrem; nenhum texto governado (`sobre.mjs`, `metodo.mjs`); a constituição só muda pela mão do diretor (o lugar de direção escreve as emendas); prosa nova em português no Acordo, sem travessões, ponto médio como separador; nunca `git add -A`; regra 14 (uma régua só conta depois de apanhar um estrago); regra 15 (abre e lê antes de relatar); onde o brief deixa uma forma em aberto, segue o padrão mais próximo da casa, constrói, e põe a escolha à cabeça do relatório. Não pares para perguntar.
