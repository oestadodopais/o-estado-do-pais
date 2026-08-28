# Leitura cruzada do Codex · a aplicação no telemóvel e a marca (28.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre os dois manifestos, os seis ficheiros de ícones, os dois SVG da marca, cinco páginas construídas nas duas edições, `tema.js`, o diff do inventário e as regras 14 e 15. Custo: 88 439 símbolos, 336 s. Três plantas, registadas com sha256 antes da leitura em `2026-08-28-codex-leitura-app.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | o `start_url` do manifesto inglês trocado de `/en/` para `/` | **sim**: bloqueante («the English app launches the Portuguese edition») |
| P2 | um quadrado de 20 px de tinta pintado no canto do ícone `maskable`, fora do círculo seguro | **sim**: bloqueante, com os raios medidos (306 a 333 px contra 204,8 do círculo) |
| P3 | a etiqueta obsoleta `apple-mobile-web-app-capable` numa página | **sim** |

**Pontuação: 3 de 3.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **«Um observatório de Portugal.» no cabeçalho da primeira página**, lido como lema e como a casa a explicar-se. É a frase de identidade que o diretor decidiu a 25.08 (decisão 7 da auditoria), anterior a este bloco e classificada na Emenda 18; o «sem lema» do brief era sobre a marca ao lado do nome, que não o tem. **Sem ação.**
2. **O nome curto «O Estado» classificado como `conteudo`** quando o nome da publicação e as cadeias de identidade são `navegacao` pela regra do próprio inventário: o construtor seguiu o brief do lugar de direção e registou a divergência. **Real; corrigido no fecho** pelo lugar de direção (a linha passa a `navegacao`).
3. **O tipo MIME do manifesto, a cache dos ícones e o mapa do sítio** não se podem ver no pacote. **Medem-se no ar depois da fusão** (o tipo MIME de `manifest.webmanifest` e os cabeçalhos de cache dos ícones, com um pedido a cada) e ficam na nota de estado do bloco.
4. **Os caminhos dos ficheiros** no pacote (`icones/`, `en-manifest.webmanifest`) são arrumação da embalagem, não o sítio. **Sem ação.**
5. **Passa**: os manifestos válidos com os campos das duas plataformas; as cores iguais aos tokens do papel claro e escuro (`tema.js` troca o `theme-color` para `#15171a`); as dimensões dos PNG lidas da cabeça; o ícone de 180 opaco; a mesma geometria do «e» nos PNG, no favicon, no cabeçalho e no SVG fonte; as ligações da cabeça e o título «O Estado» em todas as páginas amostradas; nenhum service worker nem pedido de instalação; o «e» dentro do mesmo cabeçalho e ligação que o nome, com `aria-hidden`; `lang` certo em cada edição.

## O relatório, tal como veio

# REPORT.md

The workspace is read-only, so this report was not written to disk.

## Blocking

1. **The maskable icon is corrupted.** `icon-512-maskable.png` contains the intended «e» plus an unrelated 20×20 light square at pixels x=20–39, y=20–39. The Android safe circle has radius 204.8 px. The «e» reaches radius 141.0 px and is safe; every one of the square’s 400 pixels is outside it, at radii 306.2–333.0 px. Remove the square and regenerate the icon.

2. **The English app launches the Portuguese edition.** `en-manifest.webmanifest` has `id: "/en/"` and `lang: "en"`, but `start_url: "/"`. It should launch `/en/`. Its site-wide `scope: "/"` also conflicts with the idea of a distinct language edition unless cross-edition navigation is intentional.

## Should fix

1. **A deprecated Apple declaration remains on one page.** `paginas/municipio-evora.html` alone contains `<meta name="apple-mobile-web-app-capable" content="yes">`. Its English counterpart and the other samples do not. Remove it.

2. **The home-page header violates the stated header and voice rules.** `inicio.html` adds “Um observatório de Portugal.” and `en-inicio.html` adds “An observatory of Portugal.” These are taglines, make the header more than one line, and explicitly explain what the site is, contrary to rule 15. The compact pages do not contain them.

3. **The inventory classification is internally inconsistent.** `INVENTARIO.diff` classifies the new short name “O Estado” as `conteudo`, while explicitly saying that the full publication name and neighbouring identity strings are `navegacao`. The explanatory prose acknowledges the contradiction but does not resolve it. Classify both forms consistently, most naturally as `navegacao`.

4. **I could not verify literal asset resolution.** The HTML and manifests use root paths such as `/favicon.ico`, `/apple-touch-icon.png`, `/icon-192.png` and `/en/manifest.webmanifest`, while this package stores them under `icones/` and names the English manifest `en-manifest.webmanifest`. This may be review-package rearrangement, but no mapping is supplied. If this folder mirrors deployment, those URLs are broken.

5. **I could not verify the header’s dark-mode colour or single-line layout.** The inline «e» uses `currentColor`, and `REGRAS.md` defines dark ink as `#eceeea`, but the referenced `/_astro/*.css` files are absent. There is no rule element in the header markup, but CSS-generated borders and wrapping cannot be checked.

## Notes

- Both manifests are valid JSON and contain `name`, `short_name`, icons at 192 and 512 px, a maskable icon, `display: "standalone"`, `start_url`, `id`, and language. Portuguese uses `/`, `/`, `pt-PT` consistently.
- Manifest `theme_color` and `background_color` are `#f6f7f4`, matching the light paper token. `tema.js` changes the page meta colour to `#15171a`, matching the dark paper token.
- PNG headers confirm 180×180, 192×192 and 512×512 dimensions. The 180 px Apple icon is RGB and fully opaque. The maskable RGBA file is also fully opaque.
- The intended «e» geometry matches across the standard PNGs, favicon SVG, header SVGs and source paths; the maskable glyph is the same form scaled to 78%. The rogue square is the sole shape mismatch.
- Every sampled page has the edition-appropriate manifest link, both favicon forms, Apple icon, light theme colour and Apple title “O Estado”. No service-worker registration or install prompt was found.
- Structurally, the decorative SVG and name form one wordmark rather than a pasted logo: the SVG is inside the same heading/link and correctly uses `aria-hidden`, `role="presentation"` and `focusable="false"`.
- All sampled `<html lang>` values match their edition.
- No sitemap or HTTP-header evidence is included. I could not verify sitemap coverage, manifest MIME type, or caching. Before shipping, verify `application/manifest+json`, revalidation for unversioned manifests/icons, and both language route sets in the sitemap.
