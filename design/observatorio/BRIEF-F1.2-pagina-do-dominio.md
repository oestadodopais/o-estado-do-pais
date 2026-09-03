# Brief F1.2 · A página do primeiro domínio (03.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.2 do `PLANO-fiabilidade-2026-09-02.md` §3, do `BRIEF-forma-dos-dominios.md` §2, §3 e §4, da `CARTA-DOS-CONTEUDOS.md` (domínio 1 e domínio 2), do `INVENTARIO-DAS-FONTES.md` (E1 a E5, T1 a T5) e da §1.90 de `DECISIONS.md` (as 314 linhas). O diretor mandou a 03.09: «go ahead with F1.1 and F1.2 and keep going until all is done no need to ask me». Onde o plano pedia uma palavra dele, este brief diz a suposição e ela fica nos pendentes. Sem travessões na prosa.*

## 0 · O que este bloco é

A primeira página de domínio do sítio: «Economia e finanças públicas» com «Trabalho» dentro (a ordem estreita da primeira vaga, carta §1), construída **só com as linhas que já existem** (as 314 da §1.90 mais as que já estavam: E1, E3, E5, T1, T2) na forma que o `BRIEF-forma-dos-dominios.md` fixa: a cabeça comum, a faixa das medidas de cabeça, a frase da fronteira, a leitura breve de cada medida com as três datas, a regra dos vazios, as quatro formas gráficas admitidas e mais nenhuma. E o ganho médio mensal nas 308 páginas de concelho, que a §1.90 deixou no livro-razão sem porta.

## 1 · As decisões que eram do diretor, e a suposição que fica escrita

- **O slug.** O plano escreve `dist/dominios/economia-e-financas-publicas/index.html` «(o slug decidido pelo diretor)». Suposição: `/dominios/economia-e-financas-publicas` na edição portuguesa e `/en/domains/economy-and-public-finances` na inglesa, com o índice `/dominios` e `/en/domains`. Fica nos pendentes; mudar um slug depois é um reencaminhamento, e a tabela de rotas é uma só (`src/lib/routes.mjs`), por isso o custo de uma mudança é pequeno.
- **A medida de cabeça e as cinco da faixa.** O brief da forma diz «três a cinco medidas do domínio, escolhidas pelo diretor». Suposição: a faixa leva cinco, E3 (a dívida pública, com o limiar de 60 %), E2 (o saldo, com o limiar de 3 %), T1 (o emprego dos 20 aos 64), T2 (o desemprego, a taxa do Eurostat), T3 (o ganho médio mensal, o país); E1, E4, E5, T4b e T5 ficam na leitura breve por baixo, todas alcançáveis da página. A medida de cabeça (a da manchete do domínio) é E3. Fica nos pendentes para o diretor trocar.
- **A manchete do domínio.** É «uma afirmação com números selados, como a da primeira página hoje» (brief da forma §2), e é texto do diretor. Suposição: constrói-se pela mesma regra da manchete do país (Emenda 16): uma frase cujos algarismos são `<ValorDaProva>` recontados pelo portão, sem adjetivo, na forma «A dívida pública é 89,7 % do PIB, acima do limiar de 60 %; o saldo é 0,7 % do PIB, dentro do limiar de 3 %.» com os números a virem das linhas que já existem (uma diferença ao limiar só entra se existir como linha derivada no livro-razão; **nunca** se escreve uma subtração feita à mão: sem linha derivada, a frase diz os dois números e a palavra de estado, e não a diferença). Fica nos pendentes como frase a substituir pelas palavras dele.
- **A frase da fronteira** (o que o domínio mede e o que não mede, uma frase, impressa uma vez): escreve-se a partir da carta (o domínio 1 da `CARTA-DOS-CONTEUDOS.md`) e do inventário (o que entrou e o que saiu: T4a saiu porque o INE `0012661` é um coeficiente de variação e não a disparidade entre sexos). Sem inventar: as palavras vêm da carta.

## 2 · O que entra

1. **A rota e as páginas.** `dominios` e `dominio` em `src/lib/routes.mjs` (PT e EN, com o par de língua, o canonical e o hreflang como as outras), `src/pages/dominios/index.astro`, `src/pages/dominios/[slug].astro`, `src/pages/en/domains/index.astro`, `src/pages/en/domains/[slug].astro`, `src/views/DominioView.astro` e `src/views/DominiosView.astro`, `src/data/dominios.mjs` com a lista dos 18 domínios da carta (nome nas duas línguas, slug, vaga, estado: «no ar» só o primeiro; os outros «ainda sem medidas conferidas» e **sem ligação**, como o brief da forma §2 manda) e, para o primeiro, a lista das medidas com o id das linhas de cada uma (país, e por concelho onde exista), a medida de cabeça e as cinco da faixa. Só existe página para um domínio com medidas (o `getStaticPaths` sai dos domínios com linhas, não da lista inteira).
2. **A cabeça comum** (a mesma da primeira página e das páginas de região e concelho, §1.91: o nome, a manchete, a faixa de cartões, cada cartão um alvo inteiro com o valor selado; o mapa não entra na página do domínio a não ser como a forma gráfica 4 de uma medida por concelho).
3. **A faixa das cinco medidas**, cada cartão a abrir a leitura breve dessa medida na mesma página.
4. **A frase da fronteira**, uma vez, citável (um `<p>` com id, sem se repetir).
5. **A leitura breve de cada medida** (as dez: E1 a E5, T1 a T5 menos T4a): o valor com selo; a comparação que a fonte permite, numa das quatro formas do §3 do brief da forma (a série pequena do passado do país para as séries; a faixa «onde Portugal está entre 27» só para as medidas cuja fonte publica o conjunto inteiro, e só se as 27 linhas existirem no livro-razão, senão não se desenha; a barra do concelho contra o país para T3, com a história do concelho se existir; o mapa por concelho para T3 e E5 se as 308 linhas existirem); as três datas (o período de referência, a data de acesso, a data da última conferência), escritas dd.mm.aaaa pela regra da casa; a fonte com o nome do publicador como a linha o diz.
6. **A regra dos vazios.** T4a (a disparidade salarial por concelho) imprime a pergunta da carta e «não há número público para isto», com a fonte que se procurou e a razão do inventário (o coeficiente de variação), como um cartão com a forma de ausência que a Emenda 14 já usa. As regiões autónomas de T5 e a meta nacional de T1 ficam como o livro-razão as tem (`[verify]` visível, se assim estiverem), nunca preenchidas.
7. **As quatro formas gráficas**, SVG estático construído na construção a partir das linhas, com alternativa em texto, sem biblioteca, sem animação; **cada número desenhado resolve numa linha** e um portão (`check:dados` ou um irmão novo, `check:formas`) recusa um SVG com um número que não resolva. A escala escrita como números; as quebras de série como interrupções; «sem valor» como trama; o cobalto só para «dentro do limiar».
8. **O ganho médio mensal nas 308 páginas de concelho** (`src/views/MunicipioView.astro`): a medida T3 do concelho com o valor nacional ao lado e a barra do concelho contra o país (forma 3), a partir das linhas por concelho que a §1.90 atravessou; «Ganho médio» em 308 de 308 páginas, com o controlo positivo «População residente» a 308.
9. **Os cartões da faixa da primeira página a apontarem para a página do domínio.** O F1.1 corre em paralelo e é dono de `src/views/HomeView.astro`; ele deixa o destino dos cartões num só sítio. **Só depois de o F1.1 se fundir** (o lugar de direção diz-te o SHA) rebaseias e trocas esse destino para a página do domínio (os 13 cartões do Procedimento apontam ao domínio 1 quando a medida é dele, e à leitura breve da linha quando não é: o Procedimento tem medidas de outros domínios, e o brief da forma §2 diz que os dois quadros passam a ser fontes dentro dos domínios, ficando visível o que ainda não tem domínio). Se o F1.1 ainda não estiver fundido quando o resto do bloco estiver pronto, entregas o bloco sem este item e o relatório di-lo; o item faz-se numa passagem curta a seguir.
10. **A emenda à §1.90** com a data (a §1.90 diz «o domínio ganha a sua página no bloco da forma dos domínios»: acrescenta-se a data e o hash, sem reescrever o resto), e o `VISAO.md` §4, camada 2, «existe» e «espera» conferidos contra o que ficou.

## 3 · O que não entra

Nenhum número novo: se uma comparação precisa de um número que não está no livro-razão (uma média da União, uma diferença ao limiar, um valor de 2020), a comparação não se desenha e a leitura breve diz o que a fonte publica e mais nada. Nenhuma linha nova neste ramo (as linhas vêm do motor; se faltar uma, escreve-se no relatório para um bloco do motor). Nenhum gráfico por partidos ou mandatos, nenhum composto, nenhuma cor de «bom» e «mau». Nenhum tipo novo. `src/views/HomeView.astro` e os componentes da primeira página não se tocam antes do item 9.

## 4 · Onde se constrói, e a fronteira com o F1.1

- Ramo `dominio-2026-09-03` numa worktree própria (`git worktree add .claude/worktrees/dominio-2026-09-03 -b dominio-2026-09-03 origin/main`), a partir de `origin/main` depois da fusão do F0.9 (confirma o SHA de partida com `git log -1 --format=%h origin/main`). Nunca `git checkout` na árvore principal; nunca `git add -A` nem `git add .`.
- **Ficheiros deste bloco:** os do item 1, `src/views/MunicipioView.astro`, `src/components/formas/**` (novo), `scripts/check-formas.mjs` (novo, se `check:dados` não chegar) e a sua entrada no `verify`, `src/i18n/strings.mjs` (só chaves novas de `dominio`; acrescentar, não renomear), `src/data/figuras.mjs` (só para declarar as frases novas na forma do F0.9), `tests/dominio/*.mjs` (novo), `design/especime-v3/medicoes/dominio-construtor.md`, `design/especime-v3/CHAVES-EN.md`, `DECISIONS.md` só na emenda datada à §1.90, `VISAO.md` só no §4.
- O F1.1 é dono de `src/views/HomeView.astro`, dos componentes da primeira página, de `public/js/inicio.js` e de `tests/inicio/*`.

## 5 · As medidas de aceitação (escritas antes; o bloco só se funde com todas verdes)

| # | medida | como se mede |
|---|---|---|
| B1 | `dist/dominios/economia-e-financas-publicas/index.html` e `dist/en/domains/economy-and-public-finances/index.html` existem, com canonical e hreflang cruzados, no sitemap, sem `noindex` | HTML e `dist/sitemap-0.xml` |
| B2 | «Ganho médio» em 308 de 308 páginas de concelho nas duas edições (o rótulo inglês o equivalente), com o controlo positivo «População residente» a 308 | grep sobre `dist/municipios/*/index.html` |
| B3 | todas as 314 linhas da §1.90 alcançáveis a partir da página do domínio (as nacionais na leitura breve; as 308 do ganho médio pela forma 3 ou 4 e pela lista dos valores por concelho a uma porta de distância) | um guião que segue as ligações a partir da página e conta os ids |
| B4 | as quatro formas só, SVG estático, sem `<script>`, sem biblioteca; cada número desenhado resolve numa linha (o portão novo ou `check:dados` recusa um SVG com um número solto, provado com uma planta) | o portão |
| B5 | cada leitura breve com as três datas em dd.mm.aaaa e a fonte nomeada como a linha a diz | HTML |
| B6 | a regra dos vazios: T4a impresso como ausência com a razão; zero valores inventados | HTML e `git diff --stat -- ledger/` vazio |
| B7 | a manchete do domínio com todos os algarismos como `<ValorDaProva>` recontados pelo portão; nenhuma subtração feita à mão | `gate:html` e leitura do HTML |
| B8 | a frase da fronteira uma vez por página, com id, e as suas palavras rastreáveis à carta | HTML e o relatório |
| B9 | o índice `/dominios` com os 18 domínios, o primeiro com ligação e os outros dezassete sem ligação e com «ainda sem medidas conferidas» | HTML |
| B10 | nenhum número novo no sítio: o inventário dos valores selados depois é o de antes mais os que já existiam no livro-razão e ainda não tinham página (os 314 e os que já lá estavam), e nada mais; prova por script | script no relatório |
| B11 | a 390 × 664 o primeiro ecrã da página do domínio contém o nome, a manchete inteira, o primeiro cartão inteiro e o seu selo | geometria |
| B12 | contraste ≥ 4,5:1 e ≥ 3:1 nos dois temas nas peças novas; texto alternativo em cada SVG | medição |
| B13 | `npm run build`, `verify`, `typecheck` a 0, com os códigos de saída lidos dos registos; as réguas existentes verdes; `check:voz` com as frases novas declaradas com origem; `check:lingua` verde | os três comandos |
| B14 | uma régua nova (`tests/dominio/pagina.mjs`) com estragos plantados vistos vermelhos: um SVG com um número sem linha, uma leitura breve sem as três datas, a frase da fronteira repetida, uma linha da §1.90 inalcançável, o cartão de T4a com um valor | a régua, cada planta vermelha e depois verde |
| B15 | a §1.90 emendada com a data e o hash; o `VISAO.md` §4 conferido | diff |

## 6 · O que se entrega

`design/especime-v3/medicoes/dominio-construtor.md` com as medidas B1 a B15 (números medidos, com o comando), as capturas às larguras da casa nas duas edições em `design/especime-v3/capturas/dominio-2026-09-03/`, a lista das cadeias novas com a origem de cada facto, as plantas de B14 vermelhas e verdes, os três códigos de saída, o SHA do ramo e o número da corrida `portao` verde. Empurra o ramo e espera o `portao` verde. **Não fundes em `main`.** O que ficou por fazer diz-se com a razão.

## 7 · A disciplina

Commits pequenos, mensagens em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`. Nunca escrever um número que não foi medido; um estado de saída lê-se do registo. Nenhum pedido à rede fora do `dist/` local (as linhas já estão no repositório; as fontes não se pedem). Se algo exigir uma decisão que não é tua, faz o resto e escreve a lacuna.

## 8 · Estimativa e modelo

Construtor Claude Opus 5, duas passagens, da ordem de 1,0 a 1,4 M símbolos (o plano diz L). Leitura: Codex `gpt-5.6-sol` xhigh com cinco plantas de três classes (um número no SVG sem linha; uma data fora da regra; a frase da fronteira duplicada; um relatório a dizer 308 onde o `dist/` diz menos; um valor de T4a). Medição cega: Sonnet numa cópia (as 308 páginas, as três datas, os ids alcançáveis).
