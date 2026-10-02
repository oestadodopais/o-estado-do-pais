# P4 · os pequenos do sítio depois do UE2: relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 02.10.2026, ramo `p4-2026-10-02` sobre `afc4fb20`, numa worktree própria. O mandato é `design/observatorio/BRIEF-P4-os-pequenos-do-sitio.md`. As medidas estão em `medidas.json`, escrito por `medir-p4.mjs` a partir dos ficheiros desta pasta, cada uma com o comando e um conhecido-positivo; cada número deste relatório está num ficheiro JSON desta pasta, e `conferir-relatorio.py` confere-o. Os rótulos «verificado» e «inferido» dizem de onde vem cada afirmação que não é um número. Sem travessões.*

## O teste de aceitação, e onde se mede

| cláusula do §2 | a medida (em `medidas.json`, salvo dito) | estado |
|---|---|---|
| o sítio abre claro em qualquer aparelho, com ou sem guião | `tema_e_menu`: TM1 com 24 corridas a 0 (um aparelho em modo escuro, sem escolha, com e sem guião); `paginas_claras_num_aparelho_escuro_sem_escolha`: 30 de 30 capturas sem `data-theme` e com o papel claro; `folhas_que_seguem_a_preferencia_do_aparelho`: 0 (eram 3) | cumprido, verificado |
| o leitor escolhe o escuro num comando à vista no cabeçalho, lembrado nesse aparelho | TM2 com 30 corridas (o comando à vista nas cinco larguras, botões de 44 px); TM3 com 6 (a escolha guardada aplicada antes do corpo, e desfeita); as 3 capturas escuras com o papel escuro; `lugares_onde_o_comando_do_tema_e_rendido`: 1 (era 0), o cabeçalho de todas as páginas | cumprido, verificado |
| o menu leva a página da União como sexta porta, nas duas edições e nas cinco larguras | `entradas_do_menu`: 6 (eram 5); `paginas_com_as_seis_portas_numa_linha`: 33 de 33; TM4 com 42 corridas; o rótulo é «Europa» / «Europe», pela medida do item 0 | cumprido, verificado |
| as cinco réguas à mão correm a 0 sobre uma construção da cabeça, e o relatório diz como se correm | `reguas_a_mao`: `lista`, `mapa-distritos` e `mapa-unidades` a 0, com as plantas a morder; `correcoes-a` e `matriz` a 1, com 10 e 3 células vermelhas que são achados reais nas páginas de hoje | **não cumprido em duas réguas**: parei nesse ponto, porque fechar as células pede mudar a forma das páginas, que o §4 proíbe (a secção dos achados) |
| a regra das casas decimais lê as linhas do INE pela forma publicada, com a regra da marca de provisório, e diz quantas lê e quantas deixa (as 2535 descem) | 1367 lidas (117 pelo literal, 1250 pela forma do INE, 1 com o sinal declarado); 1285 por ler (eram 2535); 16 plantas certas | cumprido, verificado |
| os dois termos explicados em palavras comuns nas definições, pela forma única, com a auditoria em dia | `perguntas_com_os_dois_termos_fora_dos_parenteses`: 0 em 6 textos com os termos; a auditoria das duas perguntas, 2 perguntas, 14 pedaços e 18 apoios; a K16 a 0 | cumprido, verificado |
| a nota do sucessor diz que o estudo que sucedeu reconcilia o que a edição escreveu, com a planta que a tira | `notas_do_sucessor_com_a_reconciliacao`: 12 (as 6 páginas antigas nas duas edições); as plantas do `check:datas` mordem | cumprido, verificado |
| a descrição da página do concelho em `CHAVES-EN.md` é a de hoje | `cadeias_da_seccao_p4_de_chaves_en_iguais_as_de_hoje`: 8 de 8; a linha do concelho já era a de hoje, e a que estava para trás era a da página da União | cumprido, com a correção do brief dita abaixo |
| o guião das decisões salta os binários no `--intervalo` e di-lo, com o conhecido-positivo num intervalo com PNG | `codigo_do_decisoes_em_vigor_num_intervalo_com_png`: 0 (era 1), 53 binários saltados no intervalo do UE2 e 37 no do P4 | cumprido, verificado |
| os três portões a 0 | a corrida final pela tranca, na cabeça do último commit do bloco; os códigos entram no commit seguinte (a secção «Os portões») | a secção «Os portões» |
| o relatório com o `medidas.json` | este ficheiro, e `medidas.json` com 28 medidas, todas lidas e com o conhecido-positivo encontrado | cumprido |

## O mandato, ponto por ponto

| # | o que se fez | a medida | o ficheiro |
|---|---|---|---|
| 00 | O escuro só pela escolha do leitor: a paleta escura vive em `:root[data-theme='dark']` e nenhuma folha consulta a preferência do aparelho; a guarda em linha no `<head>` aplica a escolha guardada antes da primeira pintura, numa cadeia só (`src/lib/tema.mjs`), e o portão confere-a carácter a carácter; uma etiqueta `theme-color`, a do papel claro; `public/js/tema.js` mostra o comando, guarda a escolha e troca a cor da mobília. O comando «claro · escuro» na fila da marca, à direita dela, em todas as páginas e larguras, com botões de 44 px; o «·» passou para o grupo (a decisão 2). | TM1 24, TM2 30, TM3 6, com 8 plantas a morder; 30 de 30 capturas claras num aparelho escuro e 3 de 3 escuras com a escolha; o comando na linha da marca a 390 px em 4 de 4 páginas (era 3 de 4); 0 pares de contraste mudados | `conferencias-tema/check-primeira.log`, `capturas-p4.json`, `fila-da-marca.log`, `contraste-antes.json`, `contraste-depois.json` |
| 0 | A página da União no menu, entre «Estudos» e «Sobre», com o rótulo «Europa» / «Europe» (`nav.uniaoEuropeiaNoMenu`); o rodapé continua com o nome inteiro. Na regra `(width <= 430px)` a letra do menu passou a 13 px, sem espaçamento e com 6 px entre portas, e o menu dobra abaixo de 390 px. As células que contavam cinco portas contam seis. | 343,7 px de portas numa coluna de 354 (pt) e 341,2 (en); com o nome inteiro, 401,9 px a 13 px e 373,3 a 12 px (pt), em 2 linhas | `menu-a-390.log`, `capturas-p4.json` |
| 1 | As cinco réguas leem «Lugares» para o mapa, a pesquisa e as listas, e a primeira página de hoje para o resto; cada célula diz ao pé de si se mudou de porta, se mudou de forma ou se saiu, e porquê. | as cinco antes do bloco saíam com 1 (rebentavam); depois, 3 a 0 e 2 a 1 com achados | `reguas-antes/`, `reguas-depois/` |
| 2 | `formaPublicadaDoINE`: uma linha cuja fonte é uma resposta do INE (`www.ine.pt`) lê-se pelo campo `ind_string` do excerto; um sinal convencional que o excerto declara (`"sinal_conv"`) sai do fim antes de comparar; um sinal por declarar, ou mais de uma forma, fecha a construção. | 1367 lidas, 1285 por ler, 16 plantas certas | `conferencias-fim/ledger-check.log` |
| 3 | A diferença de emprego entre sexos diz a conta («contada como a diferença entre as duas percentagens (em pontos percentuais)») e a sobrecarga do custo da habitação diz os regimes («em casa própria com ou sem crédito ou arrendada a preço de mercado ou a renda reduzida ou gratuita (todos os regimes de ocupação)»), nas duas línguas, com as entradas da K16 escritas por `auditoria-das-perguntas-p4.mjs`. | 0 termos fora de parênteses; a auditoria e a K16 a 0 | `conferencias-fim/auditoria-confere.log`, `conferencias-fim/check-cartao.log` |
| 4 | «O estudo que lhe sucedeu reconcilia o que esta edição escreveu.» / «The study that succeeded it reconciles what this edition wrote.», com a forma do plural para vários sucessores; o `check:datas` exige a frase da língua da página em cada nota. | 12 notas com a frase; as 2 plantas da nota mordem | `conferencias-fim/check-datas.log`, `plantas-portoes/plantas-portoes-p4.json` |
| 5 | A secção P4 de `CHAVES-EN.md`: a chave nova do menu, as três do tema que voltam, e a descrição da página da União antes e depois. | 8 de 8 cadeias iguais às de `src/i18n/strings.mjs` | `medidas.json` |
| 6 | `decisoes-em-vigor.py` salta um ficheiro quando o Git o diz binário ou quando os bytes não se leem como texto, e a última linha diz quantos saltou. | código 0 no intervalo do UE2, com 53 saltados; o guião antigo saía com 1 no byte 0x89 | `decisoes-em-vigor-intervalo-ue2.txt`, `decisoes-em-vigor-intervalo-ue2-antes.txt` |
| 7 | Este relatório, `medidas.json`, as capturas e a resposta curta. | 28 medidas; 37 capturas | `medidas.json`, `capturas-p4.json` |

## Onde o brief não bate com o que se mediu, e o que fiz

- **«União Europeia» não cabe no menu a 390 px.** Com o nome inteiro, as 6 portas pedem 401,9 px numa coluna de 354 com a letra de hoje, e 373,3 px com a letra a 12 px (376,3 na edição inglesa): o rótulo é «Europa» / «Europe», como o brief manda nesse caso. E com «Europa» também não cabiam com a letra de antes do P4 (401,1 px em português, 398,6 em inglês): a letra do menu na regra `(width <= 430px)` desceu a 13 px, sem espaçamento, com 6 px entre portas. A captura `p4-cabecalho-pt-390-nome-inteiro.png` mostra o menu em 2 linhas com o nome inteiro, e `p4-cabecalho-pt-390-publicado.png` em 1. Verificado (`menu-a-390.log`, `capturas-p4.json`).
- **«Ao pé da troca de língua» não existe no cabeçalho.** A troca de língua vive no rodapé desde a peça 3 do B1, e o cabeçalho de hoje é o menu, a marca e o caminho. O comando ficou na fila da marca, à direita dela. Verificado (`src/components/Masthead.astro`).
- **A linha de `CHAVES-EN.md` que estava para trás não era a da página do concelho.** A linha de `municipio.metaDescricaoB` já é igual à cadeia de hoje nas duas edições; a que ficou para trás é a da página da União, que perdeu a cauda a 14.09 e ganhou os países a 02.10. A secção P4 regista a forma de hoje das duas. Verificado (8 de 8 cadeias).
- **A pasta do relatório.** O §3 do brief escreve `medicoes/p1-2026-10-02/`; a mensagem que lançou o bloco escreve `medicoes/p4-2026-10-02/`, e é essa que se usou. A worktree chama-se `p1` por um engano de nome, que não muda nada.
- **Duas das cinco réguas não chegam a 0 sem mudar a forma das páginas.** A régua das correções de UX do bloco A e a matriz medem, nas páginas de hoje, defeitos reais que o §4 não deixa corrigir neste bloco. Parei nesse ponto e fiz o resto; os achados estão abaixo, com a medida de cada um.

## As decisões do construtor, e porquê

1. **O comando do tema na fila da marca, à direita da marca, em todas as larguras.** É o único lugar do cabeçalho de hoje com espaço para os dois botões sem tirar uma porta ao menu, e onde não cabem a fila dobra e o comando desce, em vez de apertar a marca. Na primeira página a 390 px, a marca mede 248,2 px e o comando 101,6 (92 na edição inglesa), numa coluna de 354; só desce na primeira página a 320 px.
2. **O «·» entre os dois botões é do grupo, e não do segundo botão.** A primeira captura escura mostrou o sublinhado do botão carregado («escuro») a passar por baixo do ponto, porque o ponto era o `::before` do segundo botão; e a árvore de acessibilidade dizia «· escuro» desse botão. O ponto passou a ser o `::before` do grupo, posto entre os dois pela ordem da folha, com o texto alternativo vazio: a árvore diz agora «escuro» (`nome-do-botao.log`). No mesmo commit tirei o intervalo entre a marca e o comando, que o enchimento dos botões já dá: o comando da edição portuguesa descia para a linha seguinte na primeira página a 390 px.
3. **As células das réguas à mão, uma a uma.** Uma célula cujo objeto mudou de página muda de porta (o mapa, a pesquisa e o índice dos concelhos para «Lugares»; a coluna do mapa à direita para a grelha de «Lugares»); uma célula cujo objeto mudou de forma mede a forma de hoje (a página do concelho da peça 2 do B1, pela mesma página de Évora com dados diferentes; a lede da União pelo nome em frase que o K2 declarou); uma célula cujo objeto saiu mede o facto que a tirou, ou sai com a razão escrita. As que saíram: em `lista.mjs` a L2, a L6, a L7, a L9, a L11, a L12 e a L13 (a cabeça da primeira página e o par entre um nome e a sua área); em `mapa-distritos.mjs` a M1e, com as suas duas plantas (a regra «o mapa toma a janela no telemóvel» era do mapa da primeira página); em `mapa-unidades.mjs` a U5 e a U7, com a planta da U7; em `correcoes-a.mjs` a A11 (a frase de definição por baixo da marca, que a peça 3 do B1 tirou e que a L4 do `check:lugar` exige a 0). As notas dessas células citam a decisão que lhes tinha dado o objeto (a §1.84 e a §1.98).
4. **Um guião que corria duas vezes em «Lugares».** A régua do mapa das unidades achou o `mapa-unidades.js` carregado duas vezes na página «Lugares» (`MapaRespira` já o serve, e `LugaresView.astro` voltava a pô-lo); tirei a segunda etiqueta. Não muda a forma da página, e cada ponteiro deixa de ser tratado duas vezes.
5. **A forma publicada só vale para as linhas do INE.** A regra lê o `ind_string` só quando o endereço da fonte é `www.ine.pt` e o excerto tem uma forma só; o sinal tira-se do fim só quando o próprio excerto o declara. A linha da remuneração média, a que difere do valor pela marca de dado provisório, passa por essa regra escrita, e as plantas cobrem o sinal por declarar e a provisória arredondada.

## Os portões que mudaram de forma, e a planta que prova que ainda mordem

| portão | o que mudou | o que protege, e a planta |
|---|---|---|
| `check:pais`, N3 | a célula do tema inverteu-se: o claro por omissão, o escuro só pela escolha; a guarda igual à aprovada, o guião adiado, o comando no cabeçalho, nenhuma folha com a preferência escura | que nenhum leitor recebe o escuro sem o pedir; 6 plantas em `tests/pais/pais.mjs` (a página servida já escura, o comando tirado, o comando à vista sem guião, a guarda a seguir o sistema, o guião tirado, uma folha com a preferência escura), todas a morder, nas 38 provas de `conferencias-00-0/pais-plantas.json` |
| `check:pais`, N1 | seis portas, com as etiquetas e os destinos das duas edições | a planta da sétima porta e a da porta da União tirada mordem (as mesmas 38 provas) |
| `gate:html` | uma etiqueta `theme-color`, sem `media`, com o papel claro; os dois papéis de `tema.js` contra os tokens | que a mobília do navegador não pinta de escuro uma página clara; corre em cada construção |
| `check:primeira` | entra `tests/inicio/tema-e-menu.mjs` (TM1 a TM4) | 8 plantas: a paleta pela preferência do sistema, a guarda tirada, a guarda no fim do corpo, o comando tirado, um botão com 30 px, uma sétima porta, a letra de antes do P4, o menu sem dobrar a 320 px |
| `ledger:check`, as casas decimais | lê também a forma publicada do INE | 16 plantas, 16 certas: as 7 de antes e 9 novas (menos casas, mais casas, arredondada, o número de outro concelho, um sinal por declarar, a provisória arredondada, e três controlos) |
| `check:datas` e `check:cartao` | a nota exige a frase da reconciliação; as perguntas antigas dos dois termos mordem na K6 | 4 de 4 plantas `p4-` a morder, com os bytes repostos (`plantas-portoes/plantas-portoes-p4.json`) |
| `check:navegacao`, `porta.mjs`, `geometria.mjs`, `moldura.mjs`, `medir-contraste.mjs` | contam seis portas; a corrida escura de `geometria.mjs` escolhe o escuro como o leitor o escolhe (a chave «tema» no aparelho); o seletor escuro lê-se de `:root[data-theme='dark']` | o que cada um já protegia, a correr sobre a forma de hoje |

## As plantas

As do bloco, com o ficheiro de cada corrida: as 8 de `tema-e-menu.mjs` (`conferencias-tema/check-primeira.log`); as de `tests/pais/pais.mjs` (`conferencias-00-0/pais-plantas.json`); as 4 dos portões com o prefixo `p4-` (`plantas-portoes/plantas-portoes-p4.json`); as 16 da regra das casas decimais (`conferencias-fim/ledger-check.log`). As das réguas à mão, corridas com `--vermelhos` na cabeça `ccdd9fa2`: 6 de 6 em `lista.mjs`, 6 de 6 em `mapa-distritos.mjs`, 13 de 13 em `mapa-unidades.mjs` (`reguas-depois/*-vermelhos.log`). A régua das correções de UX do bloco A não tem modo de plantas: as suas 10 células vermelhas são o seu conhecido-positivo nesta corrida.

## Os commits

| commit | o que |
|---|---|
| `4b502c4b` | itens 00 e 0: o claro por omissão, o comando no cabeçalho, a sexta porta |
| `fcd42829` | item 2: a regra das casas decimais pela forma do INE |
| `da16d160` | item 6: o guião das decisões salta os binários |
| `6f25bb5f` | item 5: `CHAVES-EN.md` |
| `1a0d122c` | a primeira leitura do contador, os guiões com a tranca, as decisões em vigor antes de mexer, as réguas na construção de base |
| `ce08e7cb` | item 3: os dois termos |
| `e8a0a3a5` | item 4: a nota do sucessor |
| `c327a43f`, `42398eff`, `a4afd3d0`, `0b60be8d`, `17564ea7` | item 1: as réguas do mapa por distritos, do mapa das unidades (e o guião duplicado em «Lugares»), da lista, das correções de UX do bloco A e a matriz |
| `ccdd9fa2` | item 00: o «·» no grupo, e o comando na linha da marca a 390 px |
| `d4885371` | as cinco réguas e as capturas na construção de `ccdd9fa2` |
| `404e0f06` | as notas das células que saíram citam a decisão |
| `afc2b755` | o mapa do repositório, as conferências do fim e as decisões em vigor |
| o commit deste relatório | o relatório, `medidas.json`, a segunda leitura do contador e a resposta curta |

Todos com `Co-Authored-By: Claude Opus 5.5` e `Claude-Session`; nenhum `push`.

## As capturas

37, em `design/especime-v3/capturas/p4-2026-10-02/`, sobre a construção da cabeça `ccdd9fa2`, com o manifesto em `capturas-p4.json` (o sha256 de cada imagem e as medidas de cada página) e 0 problemas: a primeira página, «Lugares» e a página da União nas larguras 390, 768, 1024, 1280 e 1600, nas duas edições, no claro de omissão com o aparelho em modo escuro e nada guardado (30); uma escura de cada página com a escolha guardada (3); e o cabeçalho a 390 px como se publica e com o nome inteiro da União (4).

## Os achados que ficam, medidos, e que o §4 não deixa corrigir aqui

- **A primeira página a 390 px tem texto abaixo de 12 px** (a A9 da régua das correções de UX do bloco A): as pontas das escalas dos desenhos dos blocos (`.pp-escala-ponta`, em `src/styles/primeira-pagina.css`) medem 11,5 px, nas duas edições.
- **A primeira página a 390 px tem alvos abaixo de 44 px** (a A10): o resumo «Os números deste bloco» mede 40 px de altura e as ligações «Ver os números …» 24,4 px, com pares de áreas de toque sobrepostas (11 alvos abaixo de 44 na edição portuguesa, de 71).
- **Bandas vazias acima de 48 px dentro do `<main>`** (a A8): 64 px na primeira página a 390 px, 99 px a 1280 px, e 113 px na página do concelho a 1280 px, nas duas edições.
- **A primeira página transborda a 320 px**: 2 px na edição portuguesa e 15 na inglesa (a matriz, «largura 320» e a I20). O que passa a margem é a frase do salário médio com o seu selo, no corpo, e nada do cabeçalho (`transbordo-320.log`). A largura de 320 px não é uma das cinco.
- **Os endereços antigos `?ambito=regiao:` já não levam à página da região** (a matriz, a 2i·1). O código que os levava vive em `public/js/inicio.js`, e a primeira página deixou de carregar esse guião no B1 (`1b44de26`, 21.09.2026). Verificado no diff desse commit e na primeira página construída, que só carrega `/js/tema.js`.
- **A porta mais estreita do menu a 390 px** mede 39,6 px de largura na edição portuguesa e 43,7 na inglesa, por 44 de altura; a `check:alvos` passa, porque mede pelo toque com o espaço à volta. Fica dito para quem decidir o alvo do menu.

Que estes achados são de antes do P4 é inferido: as classes e as folhas que os desenham não estão no diff do bloco (`src/styles/primeira-pagina.css` não mudou, e nenhuma linha mudada das folhas toca nelas), e as duas réguas rebentavam antes de chegar a estas células na construção de base, por isso não há medida delas antes do bloco.

## As decisões em vigor nos ficheiros tocados

`decisoes-em-vigor-depois.txt`, sobre o intervalo `afc4fb20..HEAD`: 70 decisões citadas em 177 ficheiros de texto, 37 binários saltados (as capturas), 0 citações a sair no diff. As que o bloco toca: a §1.52 (a Emenda 12, de volta pelo brief), a §1.117 (o escuro pela preferência do sistema, que o brief inverteu), a §1.136 e a §1.149 com a §1.150 (a primeira página do PP1 e o mapa em «Lugares», que as réguas passaram a ler), a §1.151 (a K2-c, que a regra das casas decimais alarga), a §1.84 e a §1.98 (citadas nas notas das células que saíram). A §1.152 aparece «sem título», porque vive em `main` depois da base deste ramo (`62ed13c6`, que só muda `DECISIONS.md` e o prompt da sessão seguinte, nenhum ficheiro deste bloco).

## O custo

1 344 535 símbolos e 11 788 segundos, das duas leituras em ficheiro (`custo-inicio.json` e `custo-fim.json`: o contador «total_tokens left» que a ferramenta mostra ao agente, na mensagem que abriu o bloco e antes de escrever este relatório, e o relógio da máquina). O contador é cumulativo e inclui a parte da conversa que se resumiu a meio do bloco. O modelo foi o Claude Opus 5.5, em todo o bloco.

## Os portões

A corrida final correu pela tranca (`sh scripts/leituras/portoes.sh`) na cabeça `716af503`, a do commit deste relatório, com os ficheiros em `portoes/` (a cabeça ao lado dos códigos, `portoes/cabeca`): `build` 0, `verify` 1 e `typecheck` 0, lidos de `portoes/build.codigo`, `portoes/verify.codigo` e `portoes/typecheck.codigo`. O `verify` fechou no portão dos briefs, porque a medição `codigo_do_decisoes_em_vigor_num_intervalo_com_png` de `design/observatorio/medidas/BRIEF-P4.py` corre o `decisoes-em-vigor.py` da árvore de trabalho, que o item 6 corrigiu, e por isso dá 0 onde o §0 escreveu 1 e já não vê o «0x89» do seu conhecido-positivo (`portoes/verify.log`); o ficheiro das medições do brief é do lugar de direção, que o corrige para ler o guião na cabeça presa e volta a correr os portões, e as conferências do `verify` depois do portão dos briefs não correram nesta corrida.

## O que ficou por fazer, e porquê

- **As duas réguas a 1.** A régua das correções de UX do bloco A (10 células) e a matriz (3) ficam vermelhas pelos achados acima. Fechá-las pede mudar a forma da primeira página e da página do concelho, ou levar os endereços antigos de volta à região, e isso é um bloco que o lugar de direção decide; as células não se afrouxaram.
- **A leitura a frio do bloco**, que é de outra família.
- **O rebase sobre `main`**, que tem `62ed13c6` por cima da base deste ramo, sem ficheiros em comum.
- **A emenda à decisão do menu de cinco** (a peça 3 do B1), que o brief diz que o lugar de direção faz ao aterrar.
