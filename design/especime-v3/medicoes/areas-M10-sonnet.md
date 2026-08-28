# Medição M10 · «As áreas de governo» · Claude Sonnet

*Medição cega, feita sobre a cópia `wt-medidor-3` (detached em `bcd1fe5`), lendo só `BRIEF-areas-M10.md`. Programa próprio, do zero, sem importar `scripts/` nem `src/` do sítio: `src/data/areas.mjs` foi lido como texto e avaliado como literal de dados isolado (`node:vm`), nunca importado; nenhum `scripts/check-*.mjs` nem `scripts/voz.mjs` foi lido ou executado por este programa. O programa está em `areas-M10-sonnet.mjs`, ao lado deste relatório, e escreve também `areas-M10-sonnet.resultados.json` com os números em bruto.*

## 0 · Como foi medido

`npm ci` (node_modules em falta) e `npm run build` correram antes de qualquer medição, como o lugar de direção mandou. A partir daí:

* **os dados do mapa** (`src/data/areas.mjs`): lidos como texto, avaliados num sandbox de `node:vm` (sem `import`), que devolve `FONTE_DOS_NOMES`, `LEI_ORGANICA`, `AREAS` e `SEM_AREA`;
* **a lei** (`design/especime-v3/briefs/dre-87a-2025.pdf`): extraída com `pdftotext -layout` a cada corrida, e analisada em artigos e números pelo cabeçalho «Artigo N.º» e pela numeração «N — »;
* **o livro-razão**: as 2 602 linhas de `ledger/claims/*.yml`, lidas com `js-yaml`;
* **o sítio construído**: `dist/`, lido com `node-html-parser` (nunca com o DOM do navegador, exceto na medida 7);
* **os nomes do Governo**: `design/especime-v3/briefs/ministerios-xxv-2026-08-28.md`, lido como texto.

Cada detetor tem um self-test com um caso vermelho sintético, injetado só em memória (nunca escrito no repositório), que tem de falhar a comparação antes de o detetor correr sobre os dados reais; um self-test falhado atira e para o programa inteiro. As secções abaixo citam cada self-test com o resultado que deu.

O programa correu por inteiro duas vezes. A primeira corrida (medida 7) reconstruiu só com `npx astro build`, mais rápida; isso deixou `dist/` sem `dist/cartoes/` (o passo `npm run cartoes`, que só `npm run build` corre a seguir ao astro), e a medida 8 falhou o portão de HTML por causa dos cartões de partilha em falta. Não era um defeito do bloco: era este programa a deixar `dist/` num estado que `npm run build` nunca produz sozinho. Corrigido trocando `npx astro build` por `npm run build` na medida 7; os números abaixo são da segunda corrida, completa, com `npm run verify` limpo.

## 1 · Os nomes

**Caso conhecido visto vermelho:** "Finanças" corrompido para "Fnianças" (duas letras trocadas) não casou com nenhum dos 16 nomes portugueses, como devia; o mesmo com "Finance" corrompido para "Fniance" contra os 16 nomes ingleses. Os dois confirmados pelo self-test do programa.

O português de `ministerios-xxv-2026-08-28.md` vem em títulos inteiros («Ministro de Estado e das Finanças»), não em nomes curtos separados; o programa deriva o nome curto removendo o cabeçalho honorífico e a preposição. Numa área («Economia e Coesão Territorial») essa derivação simples dá "Economia e da Coesão Territorial" (o português repete o artigo antes de cada substantivo: «da Economia e da Coesão Territorial»), que não bate com o nome do mapa. O programa tenta também uma segunda forma, que colapsa a preposição interna repetida; com essa forma bate. Isto não foi aceite às cegas: o título do Artigo 15.º da própria lei (extraído do PDF) diz, literalmente, **"Economia e Coesão Territorial"**, sem a preposição repetida, o que é a segunda fonte que o próprio `areas.mjs` diz que o nome tem (a lista da composição do Governo e o título do artigo da lei). As duas fontes independentes concordam; é por isso que a linha 2 abaixo está marcada "sim" e não entra na lista de discordâncias.

| # | slug | nome PT no mapa | bate com o Governo | via | posição na lista do Governo | nome EN no mapa | bate com o Governo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | financas | Finanças | sim | direta | 2 | Finance | sim |
| 2 | economia-e-coesao-territorial | Economia e Coesão Territorial | sim | colapsada (preposição dupla); confirmada pelo título do Artigo 15.º da lei | 4 | Economy and of Territorial Cohesion | sim |
| 3 | infraestruturas-e-habitacao | Infraestruturas e Habitação | sim | direta | 8 | Infrastructure and Housing | sim |
| 4 | justica | Justiça | sim | direta | 9 | Justice | sim |
| 5 | administracao-interna | Administração Interna | sim | direta | 10 | Home Affairs | sim |
| 6 | educacao-ciencia-e-inovacao | Educação, Ciência e Inovação | sim | direta | 11 | Education, Science and Innovation | sim |
| 7 | saude | Saúde | sim | direta | 12 | Health | sim |
| 8 | trabalho-solidariedade-e-seguranca-social | Trabalho, Solidariedade e Segurança Social | sim | direta | 13 | Labour, Solidarity and Social Security | sim |
| 9 | ambiente-e-energia | Ambiente e Energia | sim | direta | 14 | Environment and Energy | sim |

**Números:** 9/9 nomes portugueses batem carácter a carácter com um dos 16; 9/9 nomes ingleses batem carácter a carácter com um dos 16. A ordem das 9 áreas declaradas segue a ordem do Governo (posições 2, 4, 8, 9, 10, 11, 12, 13, 14, sempre crescente).

**Nota sobre a fonte inglesa:** o 16.º nome inglês em `ministerios-xxv-2026-08-28.md` («Agriculture and Sea») vem marcado incerto pelo próprio ficheiro («abaixo do que a captura apanhou; a confirmar na página»). Nenhuma das 9 áreas declaradas é Agricultura e Mar, por isso isto não afeta o resultado; fica registado porque é uma limitação da fonte, não uma verificação minha.

**Discordâncias:** nenhuma.

## 2 · As citações da lei

**Caso conhecido visto vermelho:** a matéria inventada "a política intergaláctica do turismo lunar", testada contra o Artigo 12.º, n.º 1 (Finanças), não foi encontrada no texto da lei, como devia; uma referência a "Artigo 99.º, n.º 1" (artigo que não existe no diploma) deu erro, como devia. Os dois confirmados pelo self-test do programa.

**Falso alarme, com a causa:** a primeira corrida encontrou uma citação que não batia: o Artigo 20.º, n.º 1 (Justiça). A causa era do extrator, não da lei nem do mapa: o `pdftotext` extrai literalmente o hífen mole (U+00AD) que o tipógrafo do Diário da República deixou antes de "conduzir" («formular, ­conduzir»), um carácter invisível que só marcaria uma quebra de linha opcional. Há cinco ocorrências de U+00AD no diploma inteiro (contadas por varrimento antes de escrever o programa); só esta caía dentro de uma citação declarada. Corrigido removendo U+00AD antes de comparar; a citação de Justiça passa a bater carácter a carácter, como as outras 20.

| área | artigo e número | matéria encontrada palavra por palavra | citação (número inteiro) bate carácter a carácter |
| --- | --- | --- | --- |
| financas | Artigo 12.º, n.º 1 | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 1 (administração local) | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 1 (coesão territorial) | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 1 (crescimento da economia) | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 1 (competitividade) | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 1 (investimento) | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 1 (internacionalização das empresas) | sim | sim |
| economia-e-coesao-territorial | Artigo 15.º, n.º 2 (fundos europeus e PRR) | sim | sim |
| infraestruturas-e-habitacao | Artigo 19.º, n.º 1 (habitação) | sim | sim |
| infraestruturas-e-habitacao | Artigo 19.º, n.º 1 (construção) | sim | sim |
| justica | Artigo 20.º, n.º 1 | sim | sim (depois da correção do hífen mole) |
| administracao-interna | Artigo 21.º, n.º 1 | sim | sim |
| educacao-ciencia-e-inovacao | Artigo 22.º, n.º 1 (sistema educativo) | sim | sim |
| educacao-ciencia-e-inovacao | Artigo 22.º, n.º 2 (ciência) | sim | sim |
| educacao-ciencia-e-inovacao | Artigo 22.º, n.º 2 (competências digitais) | sim | sim |
| saude | Artigo 23.º, n.º 1 | sim | sim |
| trabalho-solidariedade-e-seguranca-social | Artigo 24.º, n.º 1 (emprego) | sim | sim |
| trabalho-solidariedade-e-seguranca-social | Artigo 24.º, n.º 1 (segurança social) | sim | sim |
| trabalho-solidariedade-e-seguranca-social | Artigo 24.º, n.º 1 (combate à pobreza) | sim | sim |
| trabalho-solidariedade-e-seguranca-social | Artigo 24.º, n.º 1 (apoio à família) | sim | sim |
| ambiente-e-energia | Artigo 25.º, n.º 1 | sim | sim |

**Números:** 21 matérias verificadas no total (uma por linha da tabela). 21/21 encontradas palavra por palavra, dentro do artigo e do número que o mapa diz. 21/21 citações (a transcrição do número inteiro) exatamente iguais ao texto extraído da lei, depois da correção do hífen mole.

**Discordâncias:** nenhuma, depois da correção acima.

## 3 · As peças

Peça é o que a página da área lista: um trabalho (com porta para `/estudos/<slug>`, e porta para o texto quando existe), um conjunto (uma porta só para um estudo com centenas de linhas, como os 308 concelhos), ou uma medida (uma linha do livro-razão, com o valor, o identificador e o selo). Por cada peça, o programa confere: a rota do trabalho ou do conjunto constrói; para uma medida, `ledger/claims/<id>.yml` existe, a página de recibo (`/livro-razao/<id>` em português, `/en/ledger/<id>` em inglês) constrói, o selo aponta para essa rota exata, e o valor mostrado na área bate carácter a carácter com o valor do YAML (com a troca documentada de U+202F por U+00A0 que `Claim.astro` já faz, a mesma nos dois lados da comparação) e com o valor mostrado em **todas** as outras páginas do sítio que citam o mesmo identificador, recibo incluído.

**Casos conhecidos vistos vermelhos:** uma peça fantasma sintética (`zzz-peca-fantasma-9999`, nunca escrita no repositório) deu livro-razão inexistente e recibo inexistente, como devia. Um valor trocado numa cópia sintética de "divida-publica-2025" (89,7 trocado para 89,9 numa das 8 ocorrências reais do identificador em `dist/`) foi detetado como inconsistência (2 valores distintos onde só devia haver 1), como devia. Os dois confirmados pelo self-test do programa.

| área | trabalhos PT | conjuntos PT | medidas PT | total PT | trabalhos EN | conjuntos EN | medidas EN | total EN | peças com algum problema |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| financas | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| economia-e-coesao-territorial | 8 | 1 | 87 | 96 | 8 | 1 | 87 | 96 | 0 |
| infraestruturas-e-habitacao | 0 | 0 | 3 | 3 | 0 | 0 | 3 | 3 | 0 |
| justica | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| administracao-interna | 1 | 0 | 10 | 11 | 1 | 0 | 10 | 11 | 0 |
| educacao-ciencia-e-inovacao | 0 | 0 | 3 | 3 | 0 | 0 | 3 | 3 | 0 |
| saude | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| trabalho-solidariedade-e-seguranca-social | 2 | 1 | 16 | 19 | 2 | 1 | 16 | 19 | 0 |
| ambiente-e-energia | 1 | 0 | 2 | 3 | 1 | 0 | 2 | 3 | 0 |
| **total (9 áreas)** | **12** | **2** | **124** | **138** | **12** | **2** | **124** | **138** | **0** |

**Números:** 138 peças em português, 138 em inglês (as mesmas 9 áreas, os mesmos números por área). Todas as 138 × 2 = 276 peças passaram em todas as conferências: rota construída, linha do livro-razão presente, recibo construído, selo correto, valor igual na área, no recibo e no YAML, e igual em todas as outras páginas do sítio que citam o mesmo identificador.

**Discordâncias:** nenhuma.

## 4 · Nenhuma peça em duas áreas, nenhuma linha sem decisão

Para cada uma das 2 602 linhas do livro-razão, o programa testa o seu identificador contra **todas** as `regras` de **todas** as matérias de **todas** as áreas, e contra **todas** as entradas de `SEM_AREA`, respeitando a restrição `estudos` de cada regra (uma regra com `estudos` só bate se o campo `study` da linha estiver nessa lista). Uma linha válida bate exatamente uma vez, numa matéria ou numa exclusão, nunca nas duas, nunca em nenhuma.

**Casos conhecidos vistos vermelhos:** um identificador sintético sem estudo (`zzz-sem-decisao-9999`) deu zero coberturas, como devia (a linha «sem decisão»). Um clone em memória do mapa (nunca escrito no repositório), com a regra de Justiça injetada também em Finanças, fez um identificador real de Justiça (`independencia-da-justica-2025`) passar de 1 cobertura (no mapa real) para 2 coberturas (no clone), como devia (a «dupla cobertura»). Os dois confirmados pelo self-test do programa. (Nota de desenvolvimento, não um falso alarme sobre o sítio: a primeira versão deste self-test atirava um erro de execução, não um resultado errado, porque `instanceof RegExp` falha entre "realms" diferentes do JavaScript para os RegExp que nascem dentro do sandbox de `vm`; corrigido usando `Object.prototype.toString.call`.)

| | linhas |
| --- | --- |
| total de linhas no livro-razão | 2 602 |
| cobertas por uma matéria de uma área (dentro de área) | 1 969 |
| cobertas por uma exclusão declarada em `SEM_AREA` (fora de área) | 633 |
| soma (dentro + fora) | 2 602 |
| sem nenhuma cobertura ("sem decisão") | 0 |
| com mais de uma cobertura ("dupla cobertura") | 0 |

**Números:** 2 602 linhas no total, exatamente o número que o brief dá. 1 969 dentro de alguma área, 633 fora (com exclusão escrita), soma 2 602. 0 sem decisão, 0 em duas áreas ao mesmo tempo.

**Discordâncias:** nenhuma.

## 5 · A navegação

**Casos conhecidos vistos vermelhos:** uma ligação sintética para `/areas/nao-existe-9999` (rota que não existe) foi marcada partida, como devia. Uma contagem sintética de "5 peças" contra uma medição real de "6" foi marcada como discordância, como devia. Os dois confirmados pelo self-test do programa.

| | português | inglês |
| --- | --- | --- |
| "Áreas" no comando da primeira página (`data-porta="area"`) | presente, aponta a `/areas`, resolve | presente, aponta a `/en/areas`, resolve |
| "Áreas" no rodapé | presente, aponta a `/areas`, resolve | presente, aponta a `/en/areas`, resolve |
| áreas listadas em `/areas` (ou `/en/areas`) | 9 | 9 |
| áreas com página construída em `dist/areas/*` (ou `dist/en/areas/*`) | 9 | 9 |
| áreas declaradas em `src/data/areas.mjs` | 9 | 9 (mesmas) |
| ligações do índice que resolvem | 9/9 | 9/9 |
| contagens do índice iguais às da medida 3 | 9/9 | 9/9 |

**Números:** os 3 conjuntos de 9 slugs (índice, páginas construídas, mapa de dados) são exatamente o mesmo conjunto, nas duas edições. As 9+9 ligações do índice resolvem. As 9+9 contagens mostradas no índice batem, uma a uma, com o total por área medido na medida 3.

**Discordâncias:** nenhuma.

## 6 · A voz

`VOZ-MARCADORES.md` foi lido como texto e as suas duas tabelas foram analisadas pelo programa (não transcritas à mão): 65 marcadores e 7 exceções, os mesmos números que o `npm run check:voz` do próprio build imprime, o que dá confiança de que a leitura das duas tabelas está certa. `INVENTARIO-FRASES.md` deu 554 linhas com bloco (outro número igual ao do build). O conjunto "viva" usado para a comparação junta as 554 linhas de **todos** os blocos, não só o bloco `areas`, porque o próprio ficheiro documenta frases reutilizadas de blocos anteriores (o caso de "As medidas" / "The measures", que o ficheiro diz que já vinham declaradas pelo bloco das regiões).

**Caso conhecido visto vermelho:** a frase plantada, sintética, "Este sítio verifica cuidadosamente todos os valores desta página contra as fontes oficiais." acendeu 3 marcadores (verific, ste sítio, sta página), como devia; a mesma frase sintética não existe no conjunto "viva" do inventário, como devia (ausente das 502 frases vivas). Confirmados pelo self-test do programa. O self-test também prova os modos "prefixo" e "palavra" um a um: "aprovada" não acende "prova" mas "provado" acende (prefixo); "diagnóstico" não acende "nós" (palavra inteira).

**Falso alarme 1, com a causa:** a primeira varredura corria sobre `<body>` inteiro e acendia o marcador "método" (raiz) duas vezes em cada uma das 10 páginas em português. A causa era a ligação do rodapé "Método" (para `/metodo`), presente em todo o sítio (cerca de 1 378 rotas), não conteúdo novo deste bloco; "Método" sozinho não tem linha própria no inventário, e o `npm run check:voz` do próprio build passa limpo sobre o mesmo `dist/`. Corrigido restringindo a varredura de marcadores a `#conteudo` (a mesma fronteira que a extração de frases declaráveis já usava). A varredura ampla ao `<body>` inteiro ficou como diagnóstico à parte: acende em 10 das 20 páginas, sempre pela mesma razão (rodapé partilhado).

**Falso alarme 2, com a causa, confiança mais baixa:** o texto de `<title>` de cada uma das 20 páginas (por exemplo "Finanças · área de governo · O Estado do País") nunca bate carácter a carácter com nenhuma linha do inventário, porque a base declarada ("Finanças") vem sempre composta com o sufixo partilhado "· O Estado do País" (e, nas páginas de área, também "· área de governo"). Isto aconteceria em qualquer página do sítio inteiro, não só nas novas, e `<title>` é metainformação do separador do navegador, não prosa que o leitor vê na página; por isso ficam à parte da contagem de discordâncias do corpo, com confiança mais baixa (não confirmei o mecanismo real do sítio, escolhi não ler `scripts/voz.mjs` para preservar a medição cega).

### Marcadores

| âmbito | páginas varridas | páginas com algum marcador aceso |
| --- | --- | --- |
| `#conteudo` (o conteúdo novo do bloco) | 20 (2 índices + 9 áreas × 2 edições) | 0 |
| página inteira (diagnóstico, inclui rodapé partilhado) | 20 | 10 (todas pela ligação "Método" do rodapé) |

**Números:** 0 marcadores acesos em `#conteudo`, nas 20 páginas.

### Cruzamento com o inventário

| | fragmentos |
| --- | --- |
| fragmentos declaráveis extraídos (corpo + `<title>` + meta-descrição + `title`/`aria-label`, nas 20 páginas) | 150 |
| encontrados no inventário como "viva" | 108 |
| não encontrados, no corpo da página (fora de `<title>`) | 22 |
| não encontrados, só em `<title>` (ver falso alarme 2 acima) | 20 |
| declarados "retirada" e mesmo assim ainda renderizados | 0 |

Os 22 não encontrados no corpo, com coordenada:

| classe | texto | rotas onde aparece |
| --- | --- | --- |
| eyebrow | "Áreas de governo" | `/areas`, e as 9 páginas `/areas/<slug>` (10 rotas) |
| eyebrow | "Government areas" | `/en/areas`, e as 9 páginas `/en/areas/<slug>` (10 rotas) |
| rótulo de dados | "provisório" | `/areas/economia-e-coesao-territorial` (1 rota; a única área com uma medida marcada `source_flag: "p"` pela fonte) |
| rótulo de dados | "provisional" | `/en/areas/economia-e-coesao-territorial` (1 rota) |

Note se que o próprio `npm run check:voz` do build (medida 8) imprime, sem eu lhe pedir nada, "1 bloco(s) do inventário por ler, e o registo di-lo: · areas · `por ler`": o registo interno do sítio já assinala que o bloco `areas` não está fechado do lado da leitura, o que é consistente, de fora, com estes 22 fragmentos por classificar; não confirmei o mecanismo exato porque não li `scripts/voz.mjs`.

**Discordâncias:** 22 fragmentos de conteúdo (eyebrow × 20 rotas, "provisório"/"provisional" × 2 rotas) não encontrados como "viva" em nenhum bloco do inventário; coordenadas na tabela acima. Mais 20 casos só em `<title>`, reportados à parte com confiança mais baixa (falso alarme 2).

## 7 · A forma

Medido com o Playwright do repositório (`chromium`), navegando a um servidor estático próprio a servir `dist/`, nunca um navegador comum.

**Casos conhecidos vistos vermelhos:** uma página sintética com um `<div style="width:2000px">` a 390px de largura deu `scrollWidth` (2 008) maior que `clientWidth` (390), transbordo detetado, como devia; uma página sintética limpa não transbordou. Dez blocos sintéticos de 100px de altura, num ecrã de 844px, deram 9 visíveis sem rolar (nem 0 nem os 10), provando que a contagem "peças por ecrã" está mesmo a medir posições e não a devolver um número fixo. A expressão que lê o tempo de construção de cada página no output do astro foi testada contra uma linha de exemplo antes de correr a sério. Os quatro confirmados pelo self-test do programa.

### Transbordo horizontal

| largura | páginas testadas | transbordos |
| --- | --- | --- |
| 320px | 20 | 0 |
| 360px | 20 | 0 |
| 390px | 20 | 0 |
| 430px | 20 | 0 |
| **total** | **80 combinações** | **0** |

### A área com mais peças, a 390px

Área com mais peças (medida 3): **economia-e-coesao-territorial**, 96 peças nas duas edições. Altura de ecrã de teste: 844px (documentada aqui; não há altura pedida no brief, e esta é uma altura comum de telemóvel).

| edição | peças na página | inteiramente visíveis sem rolar | pelo menos parcialmente visíveis |
| --- | --- | --- | --- |
| português (`/areas/economia-e-coesao-territorial`) | 96 | 4 | 5 |
| inglês (`/en/areas/economia-e-coesao-territorial`) | 96 | 6 | 7 |

### Tempo de construção

Medido com uma reconstrução própria (`npm run build`, a cadeia inteira, correu de novo dentro desta medição: não é um valor de uma construção anterior desta sessão), para que este programa seja reproduzível por outra pessoa sem depender de um ficheiro meu.

| | valor |
| --- | --- |
| `npm run build` completo, código de saída | 0 |
| `npm run build` completo, duração total | 216,0 s (3,6 min) |
| páginas com tempo individual reportado pelo astro | 6 606 |
| tempo de construção de `/areas/economia-e-coesao-territorial` | 119 ms |
| tempo de construção de `/en/areas/economia-e-coesao-territorial` | 117 ms |

**Números:** 0 transbordos em 80 combinações de largura × página. A área com mais peças (96) mostra 4 peças inteiras em português e 6 em inglês num ecrã de 390×844 sem rolar. A página mais pesada do bloco constrói em 119ms (PT) e 117ms (EN), dentro de uma construção completa de 216,0s.

**Discordâncias:** nenhuma.

## 8 · A cadeia

**Caso conhecido visto vermelho:** um processo sintético `node -e "process.exit(7)"` foi capturado com código de saída 7; um processo sintético `process.exit(0)` foi capturado com código 0. Confirmado pelo self-test do programa, provando que a captura do código de saída não fica cega a uma falha.

| comando | código de saída | duração |
| --- | --- | --- |
| `npm run verify` | 0 | 42,1 s |
| `npm run typecheck` | 0 | 0,2 s |

**Números:** os dois comandos terminaram com código de saída 0 na cópia, depois da correção da medida 7 descrita na secção 0 (a primeira tentativa, com `dist/` incompleto por causa desta medição, tinha dado código 1 em `npm run verify`, por cartões de partilha em falta que este programa causou, não o bloco das áreas).

**Discordâncias:** nenhuma.

## Resumo dos falsos alarmes

| # | medida | o que o detetor acendeu | causa | correção |
| --- | --- | --- | --- | --- |
| 1 | 2 | citação de Justiça (Artigo 20.º, n.º 1) não batia carácter a carácter | hífen mole U+00AD, extraído literalmente pelo `pdftotext` de uma quebra de linha do tipógrafo original, invisível e sem significado | remover U+00AD antes de comparar |
| 2 | 6 | marcador "método" aceso 2× em cada uma de 10 páginas | ligação do rodapé "Método", partilhada por ~1 378 rotas do sítio, fora do conteúdo novo do bloco | restringir a varredura a `#conteudo` |
| 3 | 6 | 20 casos de `<title>` não declarados no inventário | `<title>` compõe a base declarada com o sufixo partilhado do sítio; é metainformação do separador, não prosa da página | reportado à parte, confiança mais baixa, não contado como discordância do corpo |

Um quarto caso, de desenvolvimento e não sobre o sítio: o self-test da medida 4 atirava um erro de execução (não um resultado errado) ao clonar regras com `instanceof RegExp`, porque os RegExp nascidos no sandbox de `vm` pertencem a outro "realm" do JavaScript; corrigido com `Object.prototype.toString.call`.

## Resumo dos casos conhecidos vistos vermelhos

| medida | caso conhecido | resultado |
| --- | --- | --- |
| 1 | nome PT/EN com letras trocadas | não casou com nenhum dos 16, como devia |
| 2 | matéria inventada; artigo inexistente | não encontrada; erro reportado |
| 3 | peça fantasma; valor trocado numa cópia | ledger/recibo inexistentes; inconsistência de valor detetada |
| 4 | linha sem cobertura; dupla cobertura injetada | 0 coberturas; 2 coberturas (contra 1 no mapa real) |
| 5 | ligação partida; contagem discordante | marcadas as duas |
| 6 | frase plantada com 3 marcadores; frase sintética não declarada | 3 marcadores acesos; ausente do conjunto "viva" |
| 7 | `<div>` de 2000px; contagem de peças sintética | transbordo detetado; 9/10 visíveis, nem 0 nem todos |
| 8 | processo com código de saída 7 | capturado como 7 |

Todos os 8 detetores viram pelo menos um caso vermelho antes de reportar um número sobre os dados reais.

## Custo em símbolos

Sessão com orçamento inicial de 15 000 000 tokens; ao escrever esta linha restavam cerca de 14 500 000, o que dá um custo aproximado de **500 000 tokens** para a medição inteira (leitura dos ficheiros, escrita e depuração do programa, três corridas completas do build e duas corridas completas do programa, e este relatório). Não é uma contagem exata de faturação, é a leitura do contador de contexto desta sessão.

## Ficheiros

* `design/especime-v3/medicoes/areas-M10-sonnet.md`, este relatório.
* `design/especime-v3/medicoes/areas-M10-sonnet.mjs`, o programa, do zero, sem imports de `scripts/` nem de `src/`.
* `design/especime-v3/medicoes/areas-M10-sonnet.resultados.json`, os números em bruto da última corrida.

Nada fora de `medicoes/` foi tocado na cópia; nenhum commit foi feito.
