# O estado de `main` depois do bloco da marca e da aplicação (28.08.2026)

*Escrito pelo lugar de direção (Claude Fable 5). O ramo `app-2026-08-28` saiu de `main` `162df96` (que já trazia a exploração da marca em `design/marca/`) e está verde: construção com as réguas todas, `verify`, `typecheck`, `tests/inicio/app.mjs` 68 de 68. Medido às cegas (Sonnet, M9) e lido de olhos frescos (Codex, três plantas, 3 de 3). A §1.79 do `DECISIONS.md` é o registo (Emenda 22).*

## O que muda no ar

* **A marca.** Um «e» minúsculo, uma grossura só, a barra unida ao anel, o corte de 28 graus, a preto e branco: papel sobre tinta no ícone do telemóvel, tinta sobre papel ao lado do nome no cabeçalho, sem filete nem lema.
* **A aplicação.** No iPhone, «Adicionar ao ecrã principal» no Safari dá o ícone da marca com «O Estado» por baixo e abre o sítio sem a moldura do navegador; no Android, o mesmo pelo menu do Chrome. Os favicons nas abas. Nada mais muda.

## O que fica

1. A prova no telemóvel é do diretor: nenhum emulador a substitui.
2. Medido no ar depois da fusão (`d6d7fce`, 28.08 às 22:54 UTC, um pedido a cada): o manifesto servido como `application/manifest+json; charset=utf-8`, o ícone de 180 como `image/png` com 4 494 bytes (o mesmo ficheiro), ambos com `cache-control: public, max-age=0, must-revalidate`, pelo que uma marca mudada chega aos telemóveis sem sufixo de versão.
3. A marca pode mudar: os ficheiros regeneram-se de um SVG (`design/marca/direcoes-e2/`) com `node design/marca/exportar.mjs app`.
4. As áreas de governo (terceira passagem em curso), a indexação quando o diretor disser.
