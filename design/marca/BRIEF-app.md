# BRIEF · A aplicação no telemóvel: o manifesto, os ícones e a cabeça das páginas

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Corre depois de o diretor escolher a direção da marca (`BRIEF-marca.md`, `PRANCHA.html`) e depois do bloco dos vazios estar fundido. Sem travessões na prosa.*

## 0 · O que é

O sítio passa a poder ser posto no ecrã principal do telemóvel como uma aplicação: um ícone próprio, o nome, a abertura sem a moldura do navegador. Nada mais muda: sem service worker, sem cache própria, sem pedido de instalação (o Chrome só o mostra com um `fetch` handler, e não o queremos: quem quiser, usa «adicionar ao ecrã principal»).

## 1 · O que está verificado (28.08.2026)

* iPhone (WebKit, iOS 15.4 e seguintes): um manifesto com `display: standalone` faz do sítio uma aplicação de ecrã principal; um `apple-touch-icon` no `<head>` tem precedência sobre os ícones do manifesto; o ícone é um PNG quadrado de 180 px, opaco (o sistema arredonda os cantos).
* Android (Chrome desde a 108): instala sem service worker; quer `name` ou `short_name`, `icons` (192 e 512, e um `maskable` de 512 com a forma dentro do círculo seguro de raio 40 % centrado), `start_url`, `display`.
* Hoje o sítio não tem ícone nenhum nem manifesto (`public/` só tem `dados`, `js`, `recortes`, `tipos`; `src/layouts/Base.astro` não liga nenhum).

## 2 · O que constróis

1. **Os ficheiros em `public/`**, gerados por `design/marca/exportar.mjs` a partir do SVG da direção escolhida (nunca desenhados à mão nem retocados): `apple-touch-icon.png` (180, opaco, na raiz), `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `favicon.ico` (32 e 16 dentro), `favicon.svg` (a forma, com `prefers-color-scheme` se a direção tiver versão escura).
2. **Os manifestos**: `public/manifest.webmanifest` (`name` «O Estado do País», `short_name` a decidir pelo diretor entre «Estado do País» e «O Estado», `lang` `pt-PT`, `start_url` `/`, `id` `/`, `display` `standalone`, `background_color` o papel, `theme_color` o papel, `icons` os três) e `public/en/manifest.webmanifest` para a edição inglesa (`lang` `en`, `start_url` `/en/`, `id` `/en/`, o mesmo nome, porque é um nome próprio). Cada edição liga o seu.
3. **A cabeça das páginas** (`src/layouts/Base.astro`): `<link rel="manifest">`, `<link rel="icon" href="/favicon.ico" sizes="32x32">`, `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`, `<meta name="theme-color">` com `media` para claro e escuro (os dois papéis dos tokens), `<meta name="apple-mobile-web-app-title">` com o `short_name`. Nada de `apple-mobile-web-app-capable` (o manifesto chega, e essa etiqueta está obsoleta). O portão de HTML e o `check:cadeia` aceitam as ligações novas porque as reconhecem, não porque se lhes abre uma exceção.
4. **Os testes** (`tests/inicio/app.mjs`): o manifesto de cada edição analisa e tem os campos; cada ícone declarado existe com o tamanho declarado (lê a cabeça do PNG, não o nome); o `maskable` tem toda a tinta dentro do círculo seguro (medido nos pixéis); o `apple-touch-icon` é opaco e de 180; as ligações da cabeça estão em todas as rotas construídas das duas edições; o `favicon.ico` tem os dois tamanhos. Cada detetor visto vermelho num caso plantado antes de dizer zero.
5. **O inventário** (`INVENTARIO-FRASES.md`): o `short_name` e o `name` são frases da casa na superfície pública (classe conteúdo, bloco `app`), classificadas; uma linha `| app | n | por ler | … |` em `critica/REVISOES-DO-INVENTARIO.md`.

## 3 · O que é «feito»

* No iPhone do diretor, «adicionar ao ecrã principal» mostra o ícone da marca e o nome curto, e a aplicação abre sem a moldura do navegador; no Android, o mesmo (o lugar de direção pede ao diretor esta prova; nenhum emulador a substitui, e o relatório di-lo).
* `npm run build`, `npm run verify`, `npm run typecheck` verdes; os testes novos verdes com os casos plantados registados; cada commit com caminhos explícitos e os dois trailers (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`, `Claude-Session: https://claude.ai/code/session_01BbaH3XteKcsmmN9VD6SGwU`).
* O relatório em `design/especime-v3/medicoes/app-construtor.md`: o que cada ficheiro é e de onde foi gerado, as medidas do círculo seguro, os testes e os seus casos vermelhos, o custo em símbolos.
