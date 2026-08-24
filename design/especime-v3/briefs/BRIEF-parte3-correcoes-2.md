# BRIEF · Parte 3, ronda de correções 2 · depois da segunda leitura cruzada

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Sítio: ramo `parte3-2026-08-24`, depois da P4. O achado vem da segunda leitura cruzada (`design/especime-v3/critica/2026-08-24-codex-leitura-parte3-2.md`, Medium 6). Sem travessões na prosa deste ficheiro.*

## 1 · O achado: as portas da faixa levam a uma agregação, e não onde as figuras se veem

Na faixa do aparelho de cada página de leitura («102 blocos · 326 algarismos · 12 com linha do livro-razão»), as contas «algarismos» e «com linha do livro-razão» abrem `#linhas-do-documento`. Essa secção tem **uma entrada por linha do motor distinta** (246 entradas para as 411 figuras do 03 pt; 25 portas de linha do sítio para as 52 figuras com selo do 07), e por isso não mostra o que os dois números contam. A regra é a da `IDENTIDADE.md` §10: a porta de um número do sítio leva onde se vê o que ele conta. O que «algarismos» conta são as figuras marcadas, e o que «com linha do livro-razão» conta são os selos: os dois veem-se no corpo.

**A correção:** as três contas da faixa abrem `#documento` (o `<article>` do corpo). Nenhuma outra mudança na faixa.

**A conferência:** o L5 (em `verificaTexto`, `scripts/gate-html.mjs`) passa a exigir que cada `data-registo-conta` tenha por porta `#documento` (resolvida na própria página), e a mensagem diz porquê. **Planta:** uma conta da faixa a abrir `#linhas-do-documento`: o L5 fecha com exit 1 e a sua frase; reposta, exit 0.

## 2 · O registo

* `DECISIONS.md` §1.64: uma subsecção `#### A medição cega M2 e a segunda leitura cruzada` **só com a parte desta correção** (o achado, a regra, a correção, a planta); o lugar de direção acrescenta a pontuação das plantas e a M2 na mesma subsecção a seguir.
* `notas/parte3.md`: a secção «Correções 2».

## 3 · Aceitação

`npm run build`, `npm run verify`, `npm run typecheck` verdes; `node scripts/medir-defeitos.mjs` com a rota `texto` a zero de autorreferência (a faixa não muda de texto); a planta vermelha e verde; um ou dois commits no ramo com os dois trailers; o relatório com os «judgement calls for the seat» primeiro, curto.

## 4 · Regras

As mesmas das rondas anteriores: nenhum texto governado; nenhum byte de `registos/` ou `studies-src/`; prosa no Acordo, sem travessões; nunca `git add -A`; nunca stagear `design/especime-v3/medicoes/` (a M2 está a escrever lá agora); regra 14.
