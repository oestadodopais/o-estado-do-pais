# Auditoria completa · O Estado do País · 02.09.2026

*Escrita pelo lugar de direção (Claude Fable 5.1) a 02.09.2026, a pedido do diretor: uma auditoria completa e autónoma, para construir o plano seguinte, com atenção especial ao leitor. Cinco leituras correram em paralelo, só de leitura, sem um commit, sem um `checkout`, sem um correio, sem um número inventado: A, o código do sítio (Claude Opus 5); B, o motor e o corredor (Opus 5); C, o registo, a história e os desvios entre os documentos e a realidade (Opus 5); D, o percurso do leitor no telemóvel e no computador, com Playwright e axe sobre uma cópia da construção (Opus 5); E, as medições mecânicas dos dois repositórios (Claude Sonnet 5). O lugar de direção leu as cinco, reconferiu à mão as afirmações de que esta síntese depende (a indexação, o número inventado, as 314 linhas, o portão do motor, o arredondamento, o User-Agent, o `typecheck`, os documentos sem rótulo, a linha do brief) e escreveu-a. Os cinco relatórios, com os comandos, os dados brutos e 138 capturas, estão no Desktop do diretor, na pasta «Auditoria 02.09 · relatórios dos auditores»; não entram no repositório público porque descrevem a máquina dele e o estado das contas. Cada número aqui foi medido; [V] é verificado (corrido ou lido), [I] é inferido. Sem travessões na prosa.*

## 0 · Em cinco linhas

1. **A espinha é excelente e está provada; a porta da frente não.** O livro-razão, os catorze portões da construção, os 24 conhecidos-positivos do motor e a cadeia do número até ao recibo com os bytes da fonte funcionam: um toque separa a primeira página de uma linha com o excerto literal e um endereço do Eurostat que responde 200. A primeira página não diz quem publica os 21 números, imprime a faixa de cartões duas vezes (56,7 % da página no telemóvel) e não abre caminho ao concelho no primeiro ecrã.
2. **Três coisas que os documentos que o diretor lê dizem não são verdade.** O sítio já é indexável (7 197 de 7 233 páginas, `robots.txt` a `Allow: /`, 7 180 endereços no mapa do sítio, desde 13.08); a manchete de Évora citada nos pendentes («53 011 pessoas») é um número inventado (o livro-razão e a página dizem 58 567); e as 314 linhas do primeiro domínio não entram em nenhuma das 308 páginas de concelho, ao contrário do que a §1.90 escreve.
3. **A maquinaria de conferência depende de um portátil e de um hábito.** O portão de commit do motor está vermelho em `master`; nenhum dos dois repositórios tem integração contínua; `npm run typecheck` confere um ficheiro; o «commit verde» é uma convenção que se quebrou uma vez a 01.09 e que o GitHub não exige.
4. **O corredor diário está bem desenhado e, como está escrito, não cabe no plano gratuito.** Uma corrida medida custou 33 minutos e falhou antes de construir; a estimativa mensal passa os 2 000 minutos; os corpos do arquivo sobem como artefacto todos os dias; e o relógio das quatro semanas verdes ainda não começou.
5. **O registo pesa mais do que o código, envelhece num dia e não tem portão.** 7,0 MB de Markdown contra 4,6 MB de código; `DECISIONS.md` passou de 13 KB a 953 KB em 20 dias; um terço dos commits só toca prosa; e, passados 21 dias e 684 commits, ninguém de fora leu o sítio.

## 1 · O que a casa é hoje, medido [V]

| | valor | como se mediu |
|---|---|---|
| páginas construídas | 7 233 (3 620 pt, 3 613 en) | `find dist -name index.html \| wc -l` |
| linhas do livro-razão | 2 916; 2 850 cruzadas do motor (97,7 %); 330 derivadas | `ls ledger/claims \| wc -l`; `ledger/cruzamentos/` |
| fontes | 15 domínios: INE 1 238, DGAL 930, IEFP 280, Eurostat 46 | `source_url` das 2 577 linhas com endereço |
| datas de acesso | 2 268 em agosto, 314 em setembro, 329 nulas (as derivadas) | `access_date` |
| concelhos | 308 páginas por edição, sete medidas cada, «N.d.» onde não há valor | `tests/municipio/vazios.mjs`, verde |
| estudos | 12 trabalhos, 16 edições; 8 páginas de leitura (6 pt, 2 en); 5 dos 12 são sobre Évora | `src/data/studies.mjs`, `registos/` |
| correções publicadas | 3, todas de 13.08 e do mesmo defeito; 1 atualização; 26 revisões de proveniência | `/correcoes` |
| commits | 684 no sítio em 16 dias com atividade (12.08 a 01.09); 298 no motor | `git rev-list --count` |
| commits só de Markdown | 219 no sítio (32 %); 70 no motor (24 %) | `git log --name-only` |
| `DECISIONS.md` | 953 337 bytes, 12 187 linhas; 13 514 bytes a 12.08 | `wc`; `git cat-file -s` |
| construção local | 303 s: `astro build` 233 s (77 %), `gate:html` 39 s (13 %), os outros doze passos 32 s | `build-timing.tsv` |
| lançamento no Vercel | 10 a 19 min, mediana 12; 17 «Ready», 2 cancelados, 1 «Error» aos 15 s (a amarra, 01.09) | `vercel ls`, uma vez |
| saída | 199 MB; 169 MB de HTML, mediana 16,6 KB por página; 88 KB de CSS, 63 KB de JS, 418 KB de tipos | `dist/` |
| dependências | `npm audit` 0 vulnerabilidades; Astro 7.2.1 (última 7.2.10); Node sem versão fixada; no motor 0 de 9 versões fixadas | `npm audit`, `npm outdated`, `requirements.txt` |
| indexação | `robots.txt` `Allow: /`; 7 180 endereços no mapa do sítio; 36 páginas com `noindex` | `dist/robots.txt`, `sitemap-0.xml`, `grep` |
| a organização no GitHub | plano `free`; 1 membro; exigência de 2FA desligada; chaves de implantação desativadas; `main` sem verificação de estado obrigatória | `gh api` |
| o motor | portão de commit a 1 (vermelho) em 140 s; 23 de 24 suites verdes; `indicators/` com 4 816 linhas e 0 testes | `python3 -m core.gate` |
| a máquina do diretor | quatro agentes `launchd`; o painel semanal correu a 17, 24 e 31 de agosto sem falhar | `launchctl list`, `refresh.log` |

## 2 · Onde estamos contra a visão

A tabela da `VISAO.md` §4 (30.08) contra o que existe a 02.09.

| camada | o que existe [V] | o que falta |
|---|---|---|
| 0 · as fontes e as versões | o motor; `vintages.json` com 36 entradas em que nenhum valor mudou; o repositório do arquivo com 190 MB únicos, 173 registos e a invariante fechada (85 de 85) | o corredor a correr: zero corridas verdes; `vintages.json` nunca foi adicionado ao git |
| 1 · o livro-razão | 2 916 linhas, JSON e CSV, recibo por linha, CC BY 4.0 declarada nos dados | a frescura diária: o painel semanal confere 32 linhas (1,1 %); as outras 2 572 foram conferidas uma vez, a 01.09, por um piloto corrido no portátil |
| 2 · as medidas e as comparações | os dois painéis da União (21 cartões); as sete medidas dos 308 concelhos; as 314 linhas do primeiro domínio no livro-razão | a página do domínio: não existe (nem `/dominios`, nem cartões a apontarem-lhe); as linhas não estão nas páginas dos concelhos (0 de 308 rendem «ganho médio», contra 308 de 308 com «população residente») |
| 3 · as leituras | o carimbo semanal do painel | «O que mudou», «O que os números dizem», a vigia: nada |
| 4 · os estudos | 12 trabalhos; 7 sem registo prévio (dívida declarada pelo portão e não pagável); 5 de 13 pastas do motor inteiramente atravessadas | os patamares 2 e 3; as oito páginas de leitura por ler pelo diretor |
| 5 · a síntese | nada | tudo |
| 6 · os instrumentos e o acesso | JSON e CSV, JSON por linha (2 916 ficheiros), JSON-LD (7 866 blocos, 0 falhas), hreflang sem um par quebrado em 7 216 páginas, mapas do sítio, robots | a página da licença, «citar como», feeds, o servidor MCP |

A `VISAO.md` §4 tem três células desatualizadas (2 602 linhas; o JSON por linha «espera» e já existe; «falta religar o Vercel») e a §7 promete uma conciliação a cada fecho que não se fez a 01.09, o dia mais cheio do projeto.

## 3 · O leitor

### 3.1 O que um leitor encontra hoje [V]

Medido no telemóvel de referência (390 × 844) e na janela real de um iPhone 13 no Safari (390 × 664), e no computador (1 280 × 800), sobre uma cópia da construção de `96af81bc`, que `verify:deploy` confirma ser o que está no ar (28 de 28).

- **A identidade lê-se.** «O Estado do País · Um observatório de Portugal.» chega em menos de um segundo; é a maior melhoria desde 25.08.
- **Três linhas de telemetria antes do conteúdo.** «Painel europeu · 31.08.2026 · Fontes · 01.09.2026 21:07 WEST · Agenda: 4 em curso · 0 a seguir» ocupam 160 px do primeiro ecrã de todas as páginas e não dizem nada a um estranho.
- **O primeiro número selado está a 138 px da manchete** (a régua da §1.91 cumpre-se à letra a 844 px). Na janela real de 664 px o número vê-se e o selo «■ fonte» fica abaixo da dobra.
- **A faixa imprime-se duas vezes.** A faixa de 21 cartões funciona sem guião e ao teclado, mas não tem afordância nenhuma (nem «1 de 21», nem pontos, nem seta; só o segundo cartão cortado). Um toque num cartão não abre nada: salta para o mesmo número impresso outra vez mais abaixo. A segunda cópia é 56,7 % da primeira página no telemóvel (4 050 de 7 142 px); em Évora 69,3 %, em Mértola 68,9 %, no Alentejo 74,1 %.
- **Não há caminho para um concelho no primeiro ecrã.** Dos 31 alvos acima da dobra, 21 são as portas dos cartões para âncoras na mesma página. A gaveta «Um concelho pelo nome» está a 1,70 ecrãs, fechada, depois da faixa inteira e do mapa inteiro. Encontrada, a busca é excelente (três toques até Mértola, Viseu ou Lagoa, insensível a acentos). Mas «Lagoa» devolve duas fichas iguais, «Lagoa» e «Lagoa», sem o distrito: quem vive em Lagoa dos Açores atira uma moeda ao ar.
- **O mapa navega para distritos, sem nomes.** Mede 390 × 514 px (era 84 × 111); os 29 nomes estão em `<title>`, que o toque não mostra; 13 das 29 áreas medem menos de 44 px (o Corvo 1 × 2 px); os Açores não se alcançam pelo mapa; a lista de nomes existe, mas dentro de uma gaveta fechada («Os nomes no mapa»). A página de distrito não tem dados: é um índice com 14 formas sem nome e uma lista.
- **A cadeia selo → linha → fonte é o melhor do sítio.** Um toque, e `/livro-razao/divida-publica-2025` dá o publicador, a série, a data de leitura, o excerto literal («... Portugal — 2025: 89.7», «Transcrito da fonte, palavra por palavra») e um endereço do Eurostat que responde 200 (três endereços de fonte conferidos, os três a 200). A hesitação: o selo lê-se «FONTE» a 12 px em versaletes e é o elemento menos visível do cartão.
- **Os estudos não se encontram no telemóvel.** Doze trabalhos, a única escrita original da casa, só pelo menu fechado, por um cartão a 7,4 ecrãs ou pelo rodapé a 8,05.
- **As medidas chamam-se pelo slug da máquina** nas páginas de área e no índice do livro-razão: «6,4 ■ FONTE / crescimento-da-despesa-liquida-2025 / %»; 130 linhas assim em `/livro-razao`; onde há nome, é o título bruto da série da fonte, com a gralha da fonte.
- **Duas grafias de data na mesma página.** dd.mm.aaaa na mobília, ISO no corpo («Lido a 2026-08-12»): 5 825 de 6 845 páginas, 26 545 ocorrências. A §1.91 decidiu uma regra só; a cabeça converteu, o corpo não.
- **Vocabulário da casa à vista.** «Âmbito» e «Densidade» continuam impressos na primeira página (a 1 503 e 1 557 px; saíram da cabeça, não da página); «sem limiar» é o antetítulo de todos os cartões dos concelhos; «308 ■ fonte» sem substantivo (I50); «livro-razão», «peças», «marcador», «recibo», «Relance», «Leitura breve»: só dois destes têm página que os explique (`/a-verificar`, e o selo em `/metodo`). «Peças» aparece nove vezes em `/areas` («Saúde → 1 peça») e não se define em lado nenhum.
- **O painel não diz quem o publica.** «Comissão Europeia» aparece zero vezes na primeira página (e «European Commission» zero em `/en`). Os cartões 1 a 13 têm estado («fora do limiar»); os cartões 14 a 21, do Painel Social, não têm linha de estado nenhuma e nada assinala a mudança de painel.
- **`/livro-razao`** tem 24,8 ecrãs sem busca nem filtro; o cabeçalho diz «2916 afirmações · 330 calculadas · 2767 linhas de concelhos» sem explicar. O índice dos concelhos ao lado tem busca e 85 ecrãs.
- **Acessibilidade.** 11 de 30 páginas sem violações do axe; a porta de correções fora de qualquer marco em 19; contraste 2,13:1 em 13 nós dos documentos alojados; três caixas com deslocamento horizontal sem teclado; a manchete dos concelhos lê-se num leitor de ecrã «Mértola tem 5 976fonte · Concelhos: as medidas centrais pessoas.», com o selo dentro da frase; 34 dos 102 selos de Évora com 19 px de alvo (exceção escrita na folha); 344 alvos abaixo de 44 px em `/municipios`.
- **Sem JavaScript o sítio é o mesmo** (faixa, gavetas, menu, 308 ligações), com duas ausências: a busca não aparece e o controlo do tema não aparece; não há `<noscript>`.
- **Peso e robustez.** A primeira página 565 KB, dos quais 259 KB de tipos (46 a 61 % de cada carregamento, já em subconjunto de 160 caracteres); zero erros de consola em 30 páginas × 2 janelas; 1 629 de 1 630 ligações internas resolvem; a edição inglesa com paridade completa.
- **O teste dos cinco segundos.** Um estranho diz: «um sítio português de dados sobre indicadores económicos europeus, com um mapa». Ninguém diz «cada número tem fonte». A prova existe, está a um toque, e é a coisa mais pequena do ecrã.

### 3.2 Os seis pontos do diretor (25.08), hoje [V]

| # | o que ele disse | estado | evidência |
|---|---|---|---|
| 1 | o mapa de pontos é tão pequeno que não serve | **resolvido, com uma falha nova** | 390 × 514 px, 29 áreas da CAOP em vez de 309 pontos; mas sem nomes visíveis e com 13 das 29 áreas abaixo de 44 px |
| 2 | os dois botões ao lado do mapa | **resolvido** | já não existem; um comando «País · Região · Concelho · Áreas», quatro ligações de 44 px, igual nas duas larguras |
| 3 | a régua por baixo | **resolvido** | saiu da primeira página; vive em `/regioes` |
| 4 | os treze indicadores sem contexto | **em parte** | ganharam nome de painel, limiar ao lado do valor e uma frase por medida; falta o que a auditoria de 25.08 recomendou (3.4 A): quem os publica e porquê estes; «Comissão Europeia» zero vezes |
| 5 | tocar em Évora no mapa devia levar ao concelho | **em parte** | as 308 páginas existem; o mapa leva a distritos (0 das 29 áreas vai a um concelho); dois toques por uma página de distrito sem dados |
| 6 | a estrutura por áreas de governo | **construída, magra** | 9 áreas com o artigo da lei orgânica; 97 de 145 peças numa área; as medidas em slug; «Áreas» fora do menu principal |

### 3.3 As três tarefas da ronda de leitores, feitas por um estranho no telemóvel [V]

- **Um número sobre o teu concelho** (Mértola, Viseu, Lagoa dos Açores): 3 toques, 1,70 ecrãs de rolar às cegas, cerca de 8 s. Hesitações: nada no primeiro ecrã fala de concelhos; o mapa é a coisa óbvia e leva a distritos sem nome; duas gavetas fechadas sem nada que distinga qual é a certa; «Lagoa» em dobro; o selo a interromper a frase da manchete. Pelo menu: 2 toques e uma parede de 308 fichas (22 ecrãs).
- **De um número ao documento**: 1 toque. A cadeia aguenta.
- **Duas frases sobre o que é o sítio**: «É um sítio português que acompanha como Portugal está nos indicadores económicos europeus, com um mapa. Cada número parece ter uma fonte que se pode abrir, mas só reparei depois de rolar.» A primeira metade da frase da casa chega; a segunda (a fonte, que é o ponto) não chega em cinco segundos.

## 4 · O código do sítio

**O veredicto da arquitetura.** A invariante central é real e está imposta: cada algarismo de cada página pertence a uma origem declarada (`data-claim` em 7 128 páginas, `data-prova` e `data-nonledger` em 7 218) e o portão volta a derivá-lo; `Claim.astro` é a única porta e atira quando falta a língua; `ledger.mjs` atira quando o id não existe. É genuinamente forte e não se deve refazer: o hreflang não tem um par quebrado nem um `x-default` em falta em 7 216 páginas; 7 866 blocos JSON-LD, 0 falhas; 0 páginas `noindex` dentro do mapa do sítio; as duas Lagoas desambiguadas pelo registo; as mensagens de falha dizem o ficheiro, o esperado, o observado e a razão da regra; o subconjunto dos tipos é real (711 KB para 418 KB, 160 caracteres, conferido byte a byte).

**O que bloqueia [V]**

- **`npm run typecheck` confere um ficheiro.** `checkJs: false` nos dois `tsconfig`; só `astro.config.mjs` tem `// @ts-check`; nenhum `.astro` está no programa. Com `checkJs` ligado numa cópia: 1 630 erros, 461 em `src/`. Um portão nomeado como verde que não pode falhar compra confiança com nada.
- **Os 16 documentos alojados** (`/estudos/<slug>/documento` e a edição inglesa) não têm `noindex`, não têm `lang` no `<html>` e não têm o rótulo de IA que a §1.89 diz estar em todas as páginas (a isenção está escrita em `gate-html.mjs:927`). São textos gerados por IA, de até 1 062 254 bytes, ligados das páginas dos estudos, portanto rastreáveis. Se a isenção sobrevive à leitura do advogado é a pergunta 11, que ninguém fez.
- **A passagem a dados pessoais de 01.09 deixou uma linha.** a linha 67 de `legal/counsel-brief.md` ainda nomeia o país de residência do diretor (o commit `38d9166` tirou-o das linhas 35 e 60 e não desta); o rascunho da carta do PRR traz o correio pessoal. O nome está no sítio por decisão dele (o rótulo de IA nomeia o responsável editorial em todas as páginas), por isso o que fica por tirar é o país. Uma linha, e uma regra que a varredura não tinha.

**O que importa [V]**

- `gate-html.mjs`: 7 001 linhas, um laço único de 2 441 linhas (`:3487` a `:5926`), 52 laços aninhados, 234 sítios de erro, nenhum teste. É o programa mais importante do repositório e o menos tratável; cada família de página nova é editada dentro do laço.
- Nenhum módulo partilhado em 30 guiões: `cinza` definido 22 vezes, `verde` 21, o percorredor de `dist/` 3, `sha256` 3.
- 22 ficheiros Playwright em `tests/`, 16 118 linhas, 16 deles portões a sério, que nenhum `npm` corre: não há `npm test`.
- 38 vistas e componentes com `lang = 'pt'` por omissão; o conserto existe em `Claim.astro:108-114` (atira) e nunca se generalizou.
- `npm run verify` não constrói e nada compara `dist/version.json` com `HEAD`: fica verde sobre um `dist/` velho, o defeito que a casa já sofreu duas vezes a 13.08.
- `public/js/inicio.js`: cerca de 195 das 900 linhas são inalcançáveis (o subsistema dos 308 pontos, anterior à Emenda 20); os guiões servem-se sem minificar, 64 % de comentários.
- Sem Content-Security-Policy; o HSTS sem `includeSubDomains`; há um só guião em linha em todo o sítio, byte a byte igual, por isso uma CSP cabe num hash.
- 12 identificadores mortos (os dois conhecidos e mais dez); `published_at` declarado, validado e a 0 de 2 916; a `allowlist` com uma exceção órfã; `ledger/README.md:747` a dizer «as 70 linhas de Évora» quando são 2 850; `attributed_to` a repetir `source` em 98 % das linhas preenchidas.
- 243 MB de capturas de desenho num repositório público de 1,1 GB; 36 linhas com `/Users/nunosantos/`.
- Acrescentar uma família de páginas custou 23 ficheiros e 2 194 linhas (`/areas`), sem guia nem gerador.

**A construção.** 303 s locais, dos quais `astro build` 233 s. As páginas de linha do livro-razão são 72 % do tempo de renderização (5 834 páginas a cerca de 28 ms cada); os 2 916 JSON por linha custam 0,1 s no total. `build.concurrency` medido a zero (217,7 s contra 220,4 s). As alavancas reais: correr os oito portões pós-construção em paralelo (menos 23 s), aligeirar `LinhaView.astro` (1 179 linhas, até menos 38 s), e a decisão do diretor sobre as 3 226 páginas inglesas de linha (menos 78 s, 26 %). Não tirar os portões do Vercel: são 23 % da construção e são a garantia da casa.

## 5 · O motor e o corredor

**O que bloqueia [V]**

- **O portão de commit está vermelho em `master`.** `python3 -m core.gate` sai a 1 em 140 s: `publisher.export_site_rows_test` falha em `export_site_rows.py:1187` porque o sítio publica 2 572 reconferências de 01.09 assinadas `by: "corredor-diario"` que o exportador não sabe reproduzir e apagaria numa reexportação. O guarda está a fazer o seu trabalho; o que expõe é dois escritores para o mesmo bloco `verifications`. Enquanto estiver vermelho, todo o commit no motor é um `--no-verify`.
- **O portão do motor depende do estado do sítio, num caminho fixo em `$HOME`** (`export_site_rows.py:165`). Muda quando alguém mexe no sítio e não corre num clone limpo: não pode ir para CI sem isto.
- **Não há CI.** Os dois fluxos em `.github/workflows/` são o corredor e o vigia; nenhum corre `core.gate`. As 24 suites e as 513 conferências só correm no `pre-commit` deste portátil. O runner usa Python 3.12; o desenvolvimento é 3.14.0.
- **`indicators/vintages.json` nunca foi adicionado ao git** e as corridas do painel de 24 e 31 de agosto não estão commitadas. A história «só de acrescento, feita para durar» vive num disco, sem cópia.
- **Duas especificações escritas duas vezes dão respostas diferentes.** `round(0,5)`: o motor dá 0 (`Decimal.quantize` no contexto por omissão, meio-para-o-par), o sítio dá 1 (meio-para-longe-do-zero); `round(2,5)`: 2 contra 3. A aceitação de uma derivação: igualdade exata no motor («there is no tolerance»), `1e-9` absoluto em `float64` no sítio, cego à magnitude. Uma linha num `.5` exato é aceite por um portão e recusada pelo outro. Reproduzido pelo lugar de direção nos dois motores.
- **O caminho que corre todos os dias no corredor busca o INE e o IEFP por `curl`, com um User-Agent de Chrome forjado e sem estrangulamento** (`publisher/concelhos_fetch.py:115` e `:246-252`, importado por `releitura_concelhos.py`, corrido por `corredor.py:532`). É a forma exata da recusa do INE de 18.08 e contradiz a promessa escrita do desenho («um `User-Agent` identificável, OEstadoDoPais/corredor»). Uma casa que publica a sua diligência não se disfarça de navegador.
- **A única prova cruzada entre o motor e o sítio não é corrida por nada.** `scripts/provar-eyetext.mjs` existe, é boa, e não está no `build` nem no `verify`. Uma linha em `package.json`. Os dois `_fixture.json` que se julgavam partilhados são só do teste da agenda; a paridade das três especificações duplicadas (o texto do olho, o arredondamento, a aceitação) não é mantida por nada automático.

**O corredor.** O desenho é bom e está provado: conferir e descarregar são atos distintos (2,9 % do tráfego num dia parado, medido), o arquivo endereçado por conteúdo com índice só de acrescento e invariante fechada, as guardas `ensaio`/`real`/`CORREDOR_ARMADO`/dormente provadas 36 de 36, duas chaves separadas, ações fixadas por SHA, o arquivo empurrado antes do sítio. O que está sobre-construído para esta fase: a corrida do meio-dia pede 79 de 79 endereços (o calendário tem 5 datas e a releitura semanal dos calendários do INE e do Eurostat leu 0), portanto custa o mesmo que a manhã e não entrega nada; o sítio constrói-se dentro da ação duas vezes por dia; `sleep 120` e `verify:deploy` diários; os corpos do arquivo inteiro (190 MB) sobem como artefacto todos os dias porque o passo não tem condição de modo. O custo: uma corrida medida a 33 min facturados, falhada antes de construir; estimativa ~2 340 min por mês contra 2 000 gratuitos [I]; ~5,7 GB de artefactos contra 500 MB; o clone completo do arquivo desce o GeoPackage da CAOP de 111 647 845 bytes em LFS todos os dias [verify a quota corrente]. E o vigia corre no mesmo repositório e no mesmo saldo: quando a quota acabar a meio do mês param os dois, e o silêncio deixa de ser anunciado.

**As três causas da corrida de 01.09, com o conserto exato.** `corredor.py:517` corre `refresh.py` como guião solto: passa a `[sys.executable, "-m", "indicators.refresh"]` (o `__main__` está na linha 948). O `pdftotext` não existe no runner e nenhum ficheiro faz `shutil.which`: entra `poppler-utils` no fluxo e uma pré-conferência que falha alto. A DGAL responde `ReadTimeout` aos IPs do datacenter: 5 × 90,5 s = 452 s por corrida para cinco ausências; a resposta é um disjuntor por anfitrião (não um timeout maior) e a reconferência das 930 linhas da DGAL a partir do portátil enquanto o bloqueio durar. Sem isso, «conferido hoje contra as fontes» cobre 2 577 linhas das quais 930 nunca foram conferidas nesse dia.

**A frescura, hoje [V]**

| o quê | última leitura | cadência | estado |
|---|---|---|---|
| o painel `quadro-institucional`, 32 linhas | 31.08, pelo agente semanal | 2× por dia no Eurostat; revisões anuais | fresco |
| as 2 572 linhas com endereço | 01.09, pelo piloto local | variada | conferidas uma vez; nada as repete sozinho |
| as 930 linhas da DGAL | 01.09, do portátil; nunca do Actions | anual ou mensal | em risco |
| o desemprego registado (IEFP) | ficheiro publicado 2025-12; a fonte viva já vai em 2026-07 | mensal | **oito períodos de atraso** debaixo de «conferido hoje» |
| `availability.json` | 12.08 | | três semanas sem reconferência |
| os calendários do INE e do Eurostat | a releitura leu 0 datas | | a automação do calendário não funciona |
| 10 afirmações primárias | nunca | | 5 do estudo «prometido, pago, auditado», 2 da água (uma da ERSAR), 2 do «Which door», 1 da PORDATA |

**Os estudos.** Cinco das treze pastas do motor estão inteiramente atravessadas (04, 06, 07, 08, 09); registos prévios só em três (10, 12, 13); sete estudos com dívida de registo permanente, declarada com honestidade pelo portão e ausente do Método do sítio. `content/02` é a única cópia de um estudo inteiro e não está em lado nenhum do sítio. No estudo 11, os achados F3 e F4 não têm linhas próprias no livro-razão (a única dívida da casa nessa lista), sete `[verify]` por resolver, e a «peça do denominador» que dois documentos dizem estar escrita e guardada em rascunho não existe em nenhum dos dois repositórios. Para um segundo domínio, cerca de 80 % do oleoduto reutiliza-se; a engenharia a sério é `ine_indicator()` (`dominios_readers.py:330`) aprender dimensões, porque a população (P1) traz sexo e grupo etário.

**A qualidade.** Python 3.14 limpo (zero API obsoleta, zero `except:` nu); `core/http.py` é a melhor peça de engenharia do repositório (portão por anfitrião entre processos com `fcntl.flock`, política por anfitrião, TLS limpo), e três caminhos vivos passam ao lado dele; segredos limpos em 1 292 ficheiros de histórico; zero `TODO` a sério; nenhum `logging`, 1 238 `print` (contrato deliberado, e o portão lê contadores por expressão regular sobre prosa impressa); `learnings.md` citado como autoridade e parado desde 10.08.

## 6 · O registo e o processo

**O que os documentos dizem e já não é verdade [V].** `README.md`: «132 linhas» (2 916), «hoje só `evora`» (308), «oito passos» (14), «treze documentos» (16). `VISAO.md` §4: 2 602 linhas; o JSON por linha a «esperar»; o Vercel por religar. `PENDENTES-DO-DIRETOR.md`: o arquivo «vazio» (68 MB); «Évora tem 53 011 pessoas» (58 567). `DECISIONS.md` §1.90: as linhas «entram ... nas páginas dos concelhos» (não entram). `CARTA-DOS-CONTEUDOS.md:241`: «onze linhas» e lista quinze. `direcao.md` pára na Emenda 21; as 22, 23 e 24 só vivem em `DECISIONS.md`, e a 24 governa a primeira página. `PLANO-fases.md` está em inglês, fora da ordem de leitura, e a sua ordem de domínios contradiz a carta adotada; a lista viva do que falta está num ficheiro do Desktop para o qual nada aponta. A nota de continuidade diz o repositório privado e o arquivo por criar; o `settings.json` da conta e o cofre ainda dizem o remoto `nunpdsantos/o-estado-do-pais`.

**O caso dos 53 011.** Um número que nunca foi medido entrou no relatório do construtor da cabeça (`medicoes/cabeca-construtor.md:326`), passou a medição cega (4 de 4 plantas vistas) e a leitura a frio (3 de 3), e foi copiado pelo lugar de direção para o ficheiro que cada sessão lê primeiro e com que o diretor decide. Catorze portões guardam o sítio; nenhum lê um `.md` para saber se é verdade. É a demonstração mais clara de onde a maquinaria de verificação acaba.

**A indexação, com a premissa verdadeira.** `PENDENTES:12` e `VISAO:62` pedem ao diretor que «decida a indexação do sítio inteiro» e `DILIGENCIA-LEGAL.md` §7 diz «nada de indexação aberta antes» do advogado. O sítio está indexável desde 13.08 (`README.md:506` di-lo): 7 197 páginas oferecidas aos motores de busca, e só 36 com `noindex` (as 8 páginas de leitura, 12 páginas de estudo sem data e 16 linhas com proveniência incompleta). A decisão de 30.08 foi tomada sobre uma premissa falsa e tem de ser retomada com a verdadeira: a exposição «pelo tempo decorrido» já existe e cresce todos os dias.

**A economia do processo [V].** Cada bloco tem a mesma forma em sete movimentos (brief, construção, medição cega, leitura a frio, segunda passagem, fusão, registos). Os custos registados: o bloco dos concelhos ≈2,78 M símbolos, o mapa dos distritos ≈1,71 M, o inventário ≈1,2 M, as 314 linhas ≈1,2 M, a cabeça ≈760 k, o corredor ≈630 k, o rótulo ≈590 k; sempre «mais o lugar de direção», que nunca se mede e é a maior quantidade sem medida do projeto. Onde o processo apanha coisas reais: a leitura a frio do Codex (o portão do rótulo que comparava o ficheiro consigo próprio, o código de saída engolido por um `tee`, dezasseis achados nas linhas do domínio, 16 graves no inventário); as réguas dos próprios blocos (as três ilhas dentro da caixa da Madeira); a amarra, que fez o Vercel recusar o commit vermelho de 01.09 aos 15 s. Onde parece cerimónia: a medição cega do Sonnet confirma mais do que encontra (≈391 k a não achar nada em §1.67; ≈418 k a concordar com o construtor em §1.84; 95 de 101 células e só as plantas em §1.90); os estragos plantados são vistos cerca de dois terços das vezes; o bloco com mais exposição legal (§1.89) não teve medição cega; e nenhum portão cobre a prosa que governa.

**Os riscos do governo da casa.** Um diretor e um lugar de direção sem memória além destes ficheiros; o registo canónico com 953 KB, que custa entre 230 e 300 mil símbolos a ler inteiro [I] e que nenhuma sessão carrega (o prompt é a memória real); a amarra a acoplar a prosa ao lançamento (o desenho a funcionar, com um modo de falha que não é de dados); «commit verde» sem exigência no GitHub; 2FA por exigir; a segunda pessoa por nomear; o painel semanal e a varredura num portátil; a ronda de leitores nunca feita. A nota do diretor de 30.08 já dizia o essencial: «o apetite excede o metabolismo», «o processo come o orçamento», «constrói-se no vazio».

## 7 · Os dez riscos que mais pesam, por ordem

1. **A exposição legal com o advogado por consultar**, enquanto 7 197 páginas estão indexáveis e 16 documentos gerados por IA não levam o rótulo do artigo 50.º. É o único item cujo custo cresce todos os dias.
2. **O portão do motor vermelho**, que ensina o `--no-verify`; e o hábito mata o portão.
3. **Nenhuma CI, nenhuma verificação obrigatória em `main`, um `typecheck` vazio**: os três portões da casa são uma promessa, e a promessa quebrou-se a 01.09.
4. **O `curl` com User-Agent forjado a correr todos os dias contra o INE**: pode fazer o INE bloquear a casa outra vez (1 238 linhas), e contradiz por escrito o que a casa promete.
5. **A história de vintages num disco só**, sem git, sem cópia.
6. **O corredor a esgotar a quota a meio do mês**, e o vigia com ele.
7. **O registo a envelhecer num dia e a inventar um número**, sem portão; a lista do que falta no Desktop; três registos de emendas desalinhados.
8. **O fator autocarro**: uma pessoa, a segunda por nomear, dois agentes num portátil.
9. **Ninguém de fora leu**: toda a UX desde 25.08 foi validada por modelos a medir píxeis.
10. **Os defeitos que bloqueiam a primeira tarefa de um leitor**: sem porta para o concelho no primeiro ecrã, o mapa sem nomes, a Lagoa em dobro, a faixa em dobro, os slugs no lugar dos nomes.

## 8 · O plano

**Cinco princípios.** O leitor primeiro: até haver leitores de fora, cada bloco de sítio responde a uma pergunta de leitor e não a uma régua. Um lugar canónico por coisa: a lista do que falta, as decisões, os pendentes e a visão têm um dono e um portão que os concilia com a realidade. Os portões em CI, não por convenção. Cortar a cerimónia que não apanha nada e manter a que apanha (a leitura a frio, os estragos plantados, as réguas dos blocos). O tempo do diretor gasta-se em decisões, uma vez, não em confirmações.

### Fase 0 · esta semana · pôr a casa em ordem (blocos pequenos; Opus constrói, Codex lê)

| # | bloco | tamanho | o que destrava |
|---|---|---|---|
| 0.1 | Os factos errados nos documentos que o diretor lê (53 011, 2 602, 132, «hoje só evora», «vazio», «privado», a frase da §1.90, `direcao.md` até à Emenda 24), e uma régua nova, `check:registo`, que concilia os números da `VISAO.md` §4 e do `README.md` com os medidos e falha quando divergem | S | o diretor decide sobre factos verdadeiros; a §7 da visão passa a portão |
| 0.2 | O portão do motor verde: hoje, o exportador aprende `corredor-diario` como leitura de terceiro que se preserva; a seguir, a separação de propriedade (as reconferências do corredor num ficheiro próprio, só de acrescento, e o exportador dono único do `.yml`) | S, depois M | commits no motor sem `--no-verify` |
| 0.3 | CI nos dois repositórios: no sítio, um fluxo com `build`, `verify` e `typecheck` como verificação obrigatória em `main` (público, gratuito); no motor, `core.gate` em 3.12 e 3.14, depois de o portão receber o caminho do sítio por `OEDP_SITE` e correr contra uma cópia versionada | S + M | «commit verde» exigido pelo GitHub, não prometido |
| 0.4 | As duas especificações escritas duas vezes: `ROUND_HALF_UP` no motor (decisão editorial: o arredondamento que as fontes portuguesas usam) e a comparação exata no sítio, cada uma com um conhecido-positivo cruzado; e `node scripts/provar-eyetext.mjs` no `verify` | S + M + S | um número, uma resolução |
| 0.5 | Higiene do repositório público: a linha 67 do brief; os 16 documentos com `noindex`, `lang` e o rótulo (ou a decisão do advogado de os dispensar); `.nvmrc` e `engines` a um maior; `vintages.json` e as duas corridas do painel em git; as capturas de 243 MB para fora do repositório ou para LFS | S | menos exposição, menos surpresas |
| 0.6 | O `typecheck` a valer, por etapas: `checkJs` em `src/lib`, `src/data` e `src/i18n` primeiro (461 erros), `astro check` depois; `scripts/comum.mjs` com as 22 cópias de `cinza` e o percorredor; `npm test` com os 16 ficheiros Playwright que são portões; o `verify` a recusar um `dist/` que não é de `HEAD` | M | um portão que pode falhar |

Do diretor nesta fase: o advogado, a indexação com a premissa verdadeira, o 2FA, a segunda pessoa (§9).

### Fase 1 · duas a três semanas · a porta da frente e a primeira vaga (Opus constrói; Sonnet mede só onde há números; Codex lê)

| # | bloco | tamanho | o que destrava |
|---|---|---|---|
| 1.1 | **A porta da frente**, um bloco: a frase de contexto por painel com as palavras do diretor (quem publica os treze e os oito, e porquê estes); a faixa impressa uma vez (o cartão abre a leitura breve; o painel deixa de ser uma segunda cópia); a porta para o concelho no primeiro ecrã (o campo, ou «o teu concelho →», logo abaixo da manchete); o mapa com os nomes ao lado, abertos, 44 px, e a lista das ilhas; «1 de 21» na faixa; «Âmbito» e «Densidade» fora; o distrito na ficha da Lagoa; «sem limiar» fora dos cartões dos concelhos; o selo fora da frase da manchete; a mobília de três linhas mais baixa no telemóvel; Regiões, Distritos e Áreas no menu; a busca como formulário | M a L | a primeira tarefa de um leitor passa a caber no primeiro ecrã |
| 1.2 | **A página do primeiro domínio** (economia e finanças públicas com trabalho), na forma do brief da forma dos domínios: a cabeça, a faixa das cinco medidas, a fronteira, a leitura breve com as três datas, a regra dos vazios (T4a por concelho); os cartões da faixa a apontarem-lhe; o ganho médio nas 308 páginas de concelho | L | as 314 linhas passam a ter onde se ler; a primeira vaga fica visível |
| 1.3 | **A ronda de leitores, já e em duas metades**: dois ou três leitores sobre o sítio de hoje, antes da reorganização, porque o que se quer observar são tropeços e a reorganização aproveita-os; os restantes depois da página do domínio | grátis; do diretor | a primeira evidência de fora que o projeto alguma vez teve |
| 1.4 | Os nomes humanos das medidas em `/areas` e `/livro-razao` (o nome que os cartões já usam; o slug em metadado pequeno); uma grafia de data em todo o sítio (`datas.mjs` sobre o livro-razão, as áreas, a agenda, as correções e os estudos); a busca no índice do livro-razão; «peça» definido ou substituído | M | o sítio deixa de falar a língua da máquina |
| 1.5 | **O segundo domínio** (população e migração), com `ine_indicator()` a aprender dimensões e a I99 fechada; depois a segurança social e pensões, a água, a educação e a saúde, um por bloco | M a L cada | a primeira vaga inteira |
| 1.6 | A decisão do IEFP: publicar julho de 2026 ou render «último período publicado pela fonte: 2026-07; a casa publica 2025-12 desde ...»; e as 10 afirmações primárias nunca lidas a entrarem no corredor ou a ganharem `[verify]` | S; do diretor | «conferido hoje» deixa de ser enganador numa série mensal |

### Fase 2 · em paralelo · o corredor até ao primeiro real (Opus; o desenho não muda)

| # | bloco | tamanho |
|---|---|---|
| 2.1 | Os três consertos da corrida de 01.09 (`-m indicators.refresh`; `poppler-utils` e `shutil.which`; o disjuntor por anfitrião e a DGAL a partir do portátil) | S + S + M |
| 2.2 | `concelhos_fetch.py` a passar pelo `core.http`, com o User-Agent da casa; se um anfitrião recusar o UA da casa, isso é um achado a registar, não uma coisa a contornar | M |
| 2.3 | O custo: o cron das 12:10 desligado até o calendário cobrir mais de metade dos endereços; os corpos do arquivo como artefacto só em `ensaio`; `GIT_LFS_SKIP_SMUDGE=1` e `--depth 50` no clone, com o portão do vintage a conferir contra o índice; o `verify:deploy` diário a semanal; o vigia num repositório público ou num cartão externo que lê a data do carimbo no sítio | S + S + M + S |
| 2.4 | `indicators/provas_test.py` a invocar os quatro provadores no `TEST_MODULES`; `requirements.lock.txt` | S |
| 2.5 | O `ensaio` verde no GitHub; as chaves e o `CORREDOR_ARMADO` (do diretor); quatro semanas verdes; o primeiro `real`; a página «O que mudou», gerada da própria corrida | do diretor, depois S |

### Fase 3 · a dieta do registo (o lugar de direção; S a M)

- `DECISIONS.md` com um índice gerado (§, uma linha, intervalo de linhas) que caiba inteiro numa sessão; as secções novas por mês, o histórico intacto.
- Um só registo de emendas (a `direcao.md` alinhada ou apontada à `DECISIONS.md`); `PLANO-fases.md` arquivado; a lista do que falta dentro do repositório, com a `VISAO.md` §5 como única lista de ideias.
- O fecho de sessão em três ficheiros e não em seis: a secção do `DECISIONS.md`, os pendentes, o prompt seguinte; a nota de estado semanal e não por bloco; o cofre só quando houver decisão.
- A medição cega do Sonnet só nos blocos com números; a leitura a frio do Codex sempre; o custo do lugar de direção medido e escrito no fecho de cada bloco.
- Os sete estudos sem registo prévio ditos no Método do sítio, como a casa exige das fontes.

### Fase 4 · a fase 2 da casa (depois dos leitores e do advogado)

A página da licença e «citar como», os feeds, o servidor MCP, o depósito no Zenodo, o Arquivo.pt e o Wayback, o estatuto editorial, o plano de fim de vida publicado quando o que promete existir, a CSP.

**Custo [I], pelos rácios que a própria casa registou** (um bloco pequeno de sítio 100 a 200 mil símbolos de construtor, um médio 200 a 350 mil, um grande 0,6 a 1,2 M): a fase 0 entre 1 e 1,5 M; a fase 1 entre 3 e 4 M, sendo a página do domínio e o segundo domínio a maior parte; a fase 2 cerca de 1 M. Sem o lugar de direção, que continua por medir.

## 9 · As decisões do diretor

| # | decisão | porque é dele | o que destrava |
|---|---|---|---|
| 1 | **A hora do advogado, esta semana**, com as perguntas 1 a 5 da `DILIGENCIA-LEGAL.md` e mais uma: se os 16 documentos alojados precisam do rótulo do artigo 50.º | dinheiro e a ERC são dele | a única coisa cujo custo cresce todos os dias; a indexação, o registo, o estatuto, a licença, a ronda |
| 2 | **A indexação, dita com a premissa verdadeira**: o sítio está aberto à pesquisa desde 13.08. Ou fica assim de propósito, escrito, até ao advogado; ou fecha-se agora com um `noindex` global. A recomendação do lugar de direção: fica aberto, porque fechar não desfaz vinte dias e escondia o sítio dos leitores de que precisa; e o advogado marca-se já | é a decisão de abrir o sítio | um pendente falso sai; a exposição passa a ser escolhida e não herdada |
| 3 | **Confirmar o 2FA na conta** (Settings → Password and authentication); o lugar de direção liga a exigência na organização | a conta é dele | um minuto; a organização deixa de ter a porta aberta |
| 4 | **Nomear a segunda pessoa** e aprovar ou emendar o plano de fim de vida | a continuidade é dele | a nota de continuidade deixa de ser uma lista |
| 5 | **As chaves de implantação e `CORREDOR_ARMADO=sim`**, depois dos consertos da fase 2 | as definições da organização são dele; o primeiro real é decisão registada | as camadas 0 e 3 inteiras; o fim da dependência do portátil |
| 6 | **Ler as oito páginas de leitura**, ou libertá-las por ler | a regra dele de 24.08 | os 36 `noindex` e os estudos deixam de estar meio publicados |
| 7 | **As duas frases de contexto dos painéis, com as palavras dele** (quem publica os treze e os oito, e porquê estes) | a auditoria de 25.08 di-lo: são texto do diretor | o último ponto dele de 25.08 por construir; a primeira página deixa de ser 21 números sem autor |
| 8 | **A manchete dos 308 concelhos**: só a população, ou população mais o estado da dívida contra o teto legal, sobre o número certo (Évora tem 58 567) | é a manchete de 308 páginas | um commit pequeno, e a diferença entre uma página que diz um facto e uma que diz alguma coisa |
| 9 | **O gatilho da ronda de leitores**: dois ou três já, sobre o sítio de hoje, ou todos depois da reorganização. A recomendação: já, com dois ou três | são pessoas dele | a primeira evidência de fora |
| 10 | **Duas regras da maquinaria**: (a) a verificação obrigatória em `main` e no motor; (b) a régua que concilia a visão e o `README` com os números medidos; e a dieta do §8, fase 3 | mudam como a casa se governa | (a) fecha o modo de falha de 01.09; (b) teria apanhado 2 602, 132, «hoje só evora», «vazio» e 53 011 |

Ficam ainda para ele, por serem editoriais e não técnicas: o desfasamento do IEFP (1.6); o destino da pasta `content/02`; a I78 (a voz de fora sobre as contas na página do concelho); a I13 (a entrelinha de 44 px); a I48 (a frase do estado vazio).

## 10 · O que esta auditoria não fez, e os seus limites

- Nada foi commitado, empurrado, editado ou apagado nos três repositórios, no cofre ou no Desktop, salvo este ficheiro (por commitar) e a pasta dos relatórios no Desktop. Os agentes correram em cópias; o `dist/` foi reconstruído uma vez pela auditoria do código, a partir do mesmo commit.
- Ao sítio no ar fizeram-se 8 pedidos espaçados, um `verify:deploy` (28 de 28) e três `HEAD` a fontes oficiais; o resto foi medido na cópia.
- As afirmações jurídicas são achados (o que a página tem e o que a lei citada diz), não pareceres: vão para o advogado.
- As quotas correntes do GitHub (minutos, artefactos, LFS) não foram reverificadas hoje; a conta usa os números que o desenho de 01.09 leu na documentação, marcados `[verify]`.
- Os custos em símbolos são os que o registo escreveu; o do lugar de direção continua sem medida. As estimativas do plano são inferências pelos rácios da casa.
- Os tempos de construção e as medições de altura são de uma máquina e de uma emulação; a régua de 664 px é a janela do Safari no iPhone 13 segundo o Playwright, não um telefone na mão.
- O cofre não foi atualizado (nada aqui é decisão até o diretor decidir); as duas notas do Inbox do cofre (a varredura mecânica e o jardineiro da configuração, de 01.09) ficaram por triar e estão anotadas como pendentes de manutenção.

## Anexo · os relatórios e o que o lugar de direção reconferiu à mão

Na pasta «Auditoria 02.09 · relatórios dos auditores» do Desktop: `A-site-code.md` (código, construção, dados, front-end, operação), `B-motor.md` com `B-motor-studies.md`, `B-motor-ops.md` e `B-motor-quality.md` (motor, corredor, frescura, estudos, qualidade), `C-governance.md` (registo, história, desvios, economia do processo, riscos), `D-ux.md` com `D-ux-capturas/` (o percurso do leitor, as medições, o axe, as verificações no ar), `E-measures.md` (as medições mecânicas, com o comando de cada tabela).

Reconferido pelo lugar de direção, com o comando e o resultado: `robots.txt` a `Allow: /`, 7 180 endereços no mapa do sítio, 36 páginas com `noindex`, nenhuma marca `robots` na primeira página; «53011» presente em `PENDENTES-DO-DIRETOR.md` e ausente da página de Évora, que diz 58 567; «anho médio» ausente da página de Évora; `.github` inexistente no sítio, `main` sem `required_status_checks`, a organização em `free` com 2FA e chaves de implantação desligados; `publisher.export_site_rows_test` a falhar em `evora-populacao-2025` pela reconferência de 2026-09-01; 2 572 linhas com `by: "corredor-diario"`; `round(0,5)` a 0 no motor e a 1 no sítio, `round(2,5)` a 2 e a 3; o User-Agent de Chrome em `concelhos_fetch.py:115` e o `curl` em `:246-252`; nenhum ficheiro «denominador» em `content/11`; `@ts-check` só em `astro.config.mjs` e `checkJs: false` nos dois `tsconfig`; nenhuma marca `robots` nem `lang` nos 16 documentos alojados e «gerado por IA» a 0 neles contra 1 nas outras páginas; o país de residência ainda na linha 67 do brief; o nome do diretor no rótulo de IA das páginas.
