# Brief F1.4 · Os nomes humanos, as datas, o índice do livro-razão (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.4 do `PLANO-fiabilidade-2026-09-02.md` §3 e da auditoria de 02.09 (`AUDITORIA-2026-09-02.md`, a linha 66: «as medidas chamam-se pelo slug da máquina nas páginas de área e no índice do livro-razão: "6,4 ■ FONTE / crescimento-da-despesa-liquida-2025 / %"; 130 linhas assim em `/livro-razao`; onde há nome, é o título bruto da série da fonte, com a gralha da fonte»). O plano faz este bloco depender da ronda de leitores (F1.3), que é do diretor e ainda não aconteceu; o que a ronda trouxer trata-se depois, e o resto faz-se agora. O diretor mandou a 03.09 continuar sem perguntar. Sem travessões na prosa.*

## 0 · O que este bloco é

O sítio fala ao leitor pelo nome da máquina em dois lugares (as páginas de área e o índice do livro-razão), escreve as datas de mais de uma maneira, tem um índice de 2 916 linhas sem busca, contagens no cabeçalho sem denominador, uma palavra («peça») que não define, um marcador `[a verificar]` com destinos diferentes, endereços de fonte que não quebram e títulos de documento que não são ligações. O bloco põe o nome humano onde está o slug, uma só grafia de data, uma busca no índice, e fecha as pequenas coisas da lista, **sem um número novo** e sem mudar a identidade.

## 1 · O que entra

1. **Os nomes humanos das medidas** em `/areas/*` e em `/livro-razao` (e nas edições inglesas): o nome que os cartões da primeira página e das páginas de concelho já usam (a autoridade é `src/data/figuras.mjs` e, para as linhas dos domínios, `src/data/dominios.mjs`; onde não houver nome de cartão, o `document.title` da linha limpo da gralha da fonte, dito no relatório como tal); o slug fica em metadado pequeno (`<code>` ou `<small>`, com a classe `livro-item-id`) e nunca como nome visível.
2. **Uma grafia de data em todo o sítio:** `src/lib/datas.mjs` (a regra da casa, dd.mm.aaaa) aplicada ao livro-razão, às áreas, à agenda, às correções e aos estudos; datas ISO visíveis a 0 fora de `<time datetime="…">`; o período de referência como a fonte o publica (um ano é um ano, uma regra fixada no F1.2).
3. **A busca no índice do livro-razão:** um `<input type="search">` num `<form>` que funciona sem guião (o destino é o próprio índice, filtrado por `?q=` no guião e, sem guião, a lista inteira com o campo a servir de âncora ao leitor de página; dito assim no relatório), e com guião a filtrar as 2 916 linhas por nome, id e fonte.
4. **As três contagens do cabeçalho com denominador** («Proveniência completa · 128» passa a «128 de 2 916 linhas» ou à forma que a régua de voz aceite; o mesmo para as outras duas).
5. **«Peça» definida ou substituída:** ou a palavra ganha uma definição na mesma página onde aparece, ou sai e entra a palavra que o inventário da voz já tenha; 0 ocorrências sem definição.
6. **O `[a verificar]` com um só destino:** todas as ocorrências do marcador levam à mesma página (`/a-verificar`) pela mesma forma.
7. **O endereço da fonte nas páginas de linha a quebrar por `/`** (sem transbordo a 390) **e o título do documento como ligação** para o `document.url` quando ele existe.
8. **A página de distrito:** o agregado das medidas dos seus concelhos onde as linhas o permitam sem aritmética nova (se não houver linha derivada, não se soma nada), ou uma frase que diga que a página é um índice dos concelhos daquela unidade; nunca um número calculado à mão.
9. **As datas de publicação dos estudos:** confirmadas no arquivo (`registos/`, `src/data/studies.mjs`, o motor em leitura) e escritas, ou o marcador `[a verificar]` uma só vez por estudo no índice, em vez de nove repetições.

## 2 · O que não entra

Nenhum número novo (o agregado de distrito só existe se a linha derivada existir); nenhuma linha nova; nenhuma frase sobre a casa; nada na primeira página nem nos componentes de `src/components/inicio/` (F1.2b ainda está a fundir), nada em `src/views/MunicipioView.astro` e `RegiaoView.astro` além do que o item 8 exigir na página de distrito (`DistritoView.astro` ou o que existir); nada nos documentos alojados nem nas páginas de leitura.

## 3 · Onde se constrói

Ramo `nomes-2026-09-04` numa worktree própria a partir de `origin/main` (confirma o SHA). Ficheiros: `src/views/AreaView.astro`, `src/views/AreasView.astro`, `src/views/LivroView.astro`, `src/views/LinhaView.astro`, `src/views/DistritoView.astro` (ou o nome que tiver), `src/lib/datas.mjs`, `src/i18n/strings.mjs` (chaves novas só), `src/data/figuras.mjs` (declarações), `public/js/` só para a busca, `tests/livro/*.mjs` (novo), `design/especime-v3/medicoes/nomes-construtor.md`, `design/especime-v3/CHAVES-EN.md`. O `Masthead.astro` (as contagens do cabeçalho) mexe-se por último, depois de fundir `origin/main` quando o lugar de direção disser que o F1.2b entrou, porque esse bloco também o toca.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| G1 | `livro-item-id` a 0 como nome visível em `/livro-razao` e `/areas/*` nas duas edições; 0 nomes de medida que sejam o slug | script sobre o `dist/` |
| G2 | datas ISO visíveis a 0 fora de `<time datetime>` em todo o `dist/` (as duas edições) | script |
| G3 | `<input type="search">` a 1 em `/livro-razao` e `/en/ledger`, dentro de um `<form>`, e a filtrar com guião (medido no navegador) | HTML e Playwright |
| G4 | «peça» com definição na mesma página ou 0 ocorrências | grep |
| G5 | as três contagens do cabeçalho com denominador, nas duas edições | HTML |
| G6 | `[a verificar]` com um só destino: todas as ligações do marcador iguais | script |
| G7 | 0 transbordo horizontal a 390 nas páginas de linha (uma amostra de 50 e as 10 com o endereço mais longo) | Playwright |
| G8 | a página de distrito com o agregado só se cada número resolver numa linha derivada, ou com a frase do índice; `gate:html` verde | HTML |
| G9 | o marcador dos estudos no índice a no máximo uma ocorrência por estudo | grep |
| G10 | nenhum número novo: o inventário dos valores selados e das classes `data-nonledger` antes e depois, igual fora do que o item 8 diz | script |
| G11 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; as réguas do sítio verdes; `check:voz` com as cadeias novas declaradas | os três comandos |
| G12 | uma régua nova (`tests/livro/indice.mjs`) com plantas vermelhas e depois verdes: um slug como nome visível; uma data ISO solta; a busca sem `<form>`; o marcador com dois destinos | a régua |

## 5 · O que se entrega e a disciplina

O relatório com G1 a G12 antes e depois, as capturas de `/livro-razao`, de uma área e de uma linha a 390 e 1 280 nas duas edições em `design/especime-v3/capturas/nomes-2026-09-04/`, a régua com as plantas, o SHA e a corrida `portao` verde. Empurra e espera o verde; não fundes em `main`. Commits pequenos em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido; o `typecheck` é estrito (sem `any`, sem `@ts-ignore`). Estimativa: Opus, duas passagens, da ordem de 0,6 a 0,9 M símbolos (M).
