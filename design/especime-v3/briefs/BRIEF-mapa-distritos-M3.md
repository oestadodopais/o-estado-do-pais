# BRIEF · O mapa por distritos, M3 · a medição cega

*Escrito a 27.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre depois do M2, **numa cópia do repositório** (um `git worktree` próprio que o lugar de direção indica), nunca na árvore do construtor; sobre a construção congelada que o lugar de direção indica. Sem travessões na prosa deste ficheiro.*

## 0 · O que é

Uma medição cega: código teu, do zero, sem ler o código do sítio (`src/`, `scripts/`), as notas dos construtores nem os briefs deles. Lês só a Emenda 20 de `design/especime-v3/direcao.md`, `mapa/manifest.json` e os JSON de `mapa/` (são dados, não código), e esta lista. Playwright do repositório (`NODE_PATH` para o `node_modules` da árvore principal), `devices["iPhone 13"]` e 1280 × 800. Cada detetor provado num caso conhecido antes de dar um zero; nada é «ok» sem o número.

## 1 · As medições

1. **A junção, com código teu:** nos JSON, os 308 concelhos aparecem uma vez cada nas 29 unidades; os slugs iguais aos 308 slugs que as páginas `/municipios/<slug>` construídas usam; o ponto representativo de cada área cai dentro do seu caminho (ray casting sobre o `d` decodificado); os nomes iguais aos das páginas de concelho. Caso conhecido: troca um slug numa cópia do JSON e vê o comparador acusá-lo.
2. **A primeira página, a 1280 e a 390:** o `svg` do mapa existe (a 390 também: a Emenda 20c); 29 áreas dentro de `<a>`, cada uma com nome acessível; para cada área a caixa em px e se chega a 44 × 44; a lista por baixo de cada moldura das ilhas, com os nomes das ilhas que não chegam a 44 px, uma por linha e cada uma ligação; nenhuma cor de estado nas áreas (todas com o mesmo `fill` e `stroke`, medidos por `getComputedStyle`); o `svg` sem `role="img"`. Caso conhecido: no ar (`main`), a primeira página tem o mapa dos pontos e nenhuma área.
3. **Dez cliques reais** em áreas ao acaso na primeira página, a 1280 e a 390: cada um abre `/distritos/<slug>` da área clicada.
4. **Duas páginas de distrito** (Lisboa e Ilha de São Miguel, as duas edições): o mapa com tantas áreas quantos concelhos da unidade, cada área `<a>` para `/municipios/<slug>`, a lista com os mesmos concelhos pela mesma ordem, as caixas dos alvos e quantos ficam abaixo de 44 px a 1280 e a 390, e a lista por baixo com os que não chegam; dez cliques reais.
5. **Os pesos:** o HTML da primeira página e de uma página de distrito em bytes, antes (o ar) e depois; o JSON do país e o maior distrito.
6. **A neutralidade ao passar o rato e ao focar:** o que muda no `getComputedStyle` de uma área com `hover` e com `focus` (só o contorno pode mudar).
7. **`/municipios`:** os cabeçalhos dos grupos por distrito são ligações para `/distritos/<slug>`; nada mais mudou (bytes iguais fora dessas ligações e da marca de versão).
8. **O cartão localizador** numa página de concelho não mudou (bytes iguais fora da marca de versão).
9. **A régua do inventário** (`node scripts/medir-defeitos.mjs`, o único script do sítio que corres, na cópia): autorreferência 0 e zero blocos por classificar nas rotas novas.

## 2 · O relatório

`design/especime-v3/medicoes/mapa-distritos-M3-sonnet.md` na tua cópia (o lugar de direção traz o ficheiro para o ramo) e o programa ao lado: as tabelas (antes, depois, diferença), as discordâncias com coordenada e prova, as falsas alarmes com a causa, os casos conhecidos vistos vermelhos, o custo em símbolos. Não corriges, não commitas, nunca corres `git checkout`, `git stash` ou qualquer comando que mude a árvore de trabalho.
