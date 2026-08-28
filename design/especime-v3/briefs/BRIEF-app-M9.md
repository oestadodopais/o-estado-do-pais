# BRIEF · A aplicação no telemóvel, M9 · a medição cega do bloco

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre sobre uma cópia do repositório (`git worktree add --detach`), nunca na árvore do construtor, com a construção do ramo `app-2026-08-28` feita nessa cópia. Não lês o brief do construtor nem o relatório dele; lês só isto. Cada detetor é provado num caso conhecido vermelho antes de dar um zero. Sem travessões na prosa.*

## 0 · O que mudou

O sítio passou a poder ser posto no ecrã principal do telemóvel: um manifesto por edição, os ícones da marca em `public/`, as ligações na cabeça de todas as páginas, e a marca (um «e» minúsculo) ao lado do nome no cabeçalho.

## 1 · As medições

1. **Os manifestos** (`dist/manifest.webmanifest` e `dist/en/manifest.webmanifest`): analisam como JSON; `name` «O Estado do País», `short_name` «O Estado», `display` `standalone`, `start_url` e `id` (`/` e `/en/`), `lang` (`pt-PT` e `en`), `background_color` e `theme_color` iguais aos tokens do papel (`src/styles/tokens.css`), `icons` com 192, 512 e um `maskable` de 512; cada ficheiro de ícone existe e o seu tamanho real, lido da cabeça do PNG (bytes 16 a 24), é o declarado.
2. **O ícone do iPhone** (`dist/apple-touch-icon.png`): 180 × 180, sem canal alfa ou com alfa todo opaco (lê os píxeis); o `<link rel="apple-touch-icon">` na cabeça de todas as rotas construídas das duas edições.
3. **A zona segura do `maskable`**: toda a tinta do «e» (os píxeis cuja cor difere do campo) dentro do círculo de raio 40 % centrado (204,8 px em 512), com a distância mínima da tinta ao bordo do círculo em píxeis; caso conhecido: uma cópia com um píxel de tinta plantado fora do círculo.
4. **Os favicons**: `favicon.ico` com os dois tamanhos (32 e 16) dentro (lê o diretório do ICO); `favicon.svg` válido, com a regra `prefers-color-scheme: dark`; as ligações `rel="icon"` na cabeça de todas as rotas.
5. **A cabeça em todas as rotas**: `rel="manifest"` (o da edição certa), `theme-color` numa etiqueta só, com o papel claro (a preferência do sistema não decide o tema deste sítio desde a Emenda 12), e o script do tema (`tema.js`) a trocá-la para o papel escuro quando o leitor escolhe o escuro: mede a troca com o Playwright, escolhendo o tema escuro na página, `apple-mobile-web-app-title` igual ao `short_name`; nenhuma `apple-mobile-web-app-capable`; contagem por rota das duas edições, caso conhecido: uma página com a ligação removida.
6. **O cabeçalho com a marca**: em `/`, `/municipios/evora`, `/estudos`, `/en`, a altura do cabeçalho (o `header` ou o bloco do `.wordmark`) nas sete larguras (320, 360, 390, 430, 768, 1024, 1280), com o Playwright do repositório, contra a construção de `main` `162df96` (constrói-a também na cópia, ou mede-a no ar uma vez por rota, nunca mais do que um pedido por minuto): a diferença em px por largura; a marca visível ao lado do nome, na mesma linha (as caixas do «e» e do nome com o mesmo topo ± 2 px); em escuro (o tema escolhido na página, não a preferência do sistema) o «e» claro.
7. **A marca é a mesma forma**: o `favicon.svg` e o «e» do cabeçalho contêm o mesmo caminho (compara os `d` normalizados) que `design/marca/direcoes-e2/e2-unida-28.svg`; o `apple-touch-icon.png` renderizado do SVG da variante papel-sobre-tinta bate com o ficheiro em `public/` (diferença de píxeis abaixo de 0,5 %).
8. **Nada de mais**: nenhum service worker registado (`navigator.serviceWorker` nunca chamado em `dist/js/*` nem em nenhuma página), nenhum `beforeinstallprompt`.
9. **A cadeia**: `npm run verify`, `npm run typecheck` na cópia, com o código de saída.

## 2 · O relatório

`design/especime-v3/medicoes/app-M9-sonnet.md` e o programa ao lado (código teu, do zero): uma tabela por medição com os números, as discordâncias com coordenada e prova, os teus falsos alarmes com a causa, os casos conhecidos vistos vermelhos, o custo em símbolos. Nada é «ok» sem o número. Não corriges, não commitas, não tocas em nada fora de `medicoes/` na cópia.
