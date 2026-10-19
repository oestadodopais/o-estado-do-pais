# V2-c: a discussão no topo e no menu

## Partida

A medição de `partida.json` pertence à cabeça `25ca0a4bc` construída. O bloco começa no carácter 194400 de 219878 em PT e 193147 de 218741 em EN (índices a partir de zero, abertura de `section`). A ordem anterior era painel, discussão, entradas. A 390 px, as páginas medem 8458 px em PT e 8361 px em EN. O menu tem sete portas: três linhas a 360 px e duas a 390 px, nas duas edições. A L1 mede 2782 páginas, teto 2782; as multiplicidades estão em `l1-antes.json`.

## Mudança para o leitor

A discussão é a primeira secção da página inicial nas duas edições, com os mesmos títulos e destinos.
A página da discussão passa também a ter uma porta no menu, entre as explicações e a União Europeia.

## Decisões

- V2C-1: a oitava porta entra. A medição final dá quatro linhas em PT e três em EN a 360 px; três nas duas edições a 390 px. Nenhuma porta sai da coluna. A prova da cabeça do código está no manifesto final, com as caixas e os SHA-256 dos recursos.
- V2C-2: o prompt não fornece `Claude-Session`. O trailer usa `[verify]`, ausência explícita, sem atribuir uma sessão inventada. Foi pedido o identificador exato.
- V2C-3: conserva-se o rótulo de IA que o layout já coloca antes das secções. A discussão é a primeira secção, antes de «O que se passa»; a identidade não muda.
- V2C-4: o escrivão só oferecia a corrida completa. Acrescenta-se o perfil fechado `v2c` ao pedido dos portões, com os dez comandos do mandato e sem motor. A corrida completa continua a ser a omissão. Os ensaios exercem a seleção verde, o build vermelho, a recusa de um perfil desconhecido e a tranca existente. O captor aceita larguras explícitas e a medição do menu pelo método da H4, para incluir 360 px fora da sandbox.
- V2C-5: `check:cabeca` só mede a hierarquia do H1 e da marca, e as outras células da primeira página encontram os seus blocos pelas marcas. Não codificam a primeira secção. A ordem nova e as marcas ausentes são protegidas na célula dos itens, com plantas próprias; a navegação ganha uma lista independente e plantas do menu.
- V2C-6: a primeira corrida fechou em H2. A 641 px, pontos a meio píxel da aresta inferior de «Estudos» e «Explainers» respondiam às portas da fila seguinte. Uma prova no navegador, com espera de dois quadros depois da mudança da folha, confirmou que 1 px entre filas devolve todos os pontos às suas portas. Acrescenta-se esse intervalo vertical, conservando altura, letra, espaço das letras e intervalo horizontal. A TM4 passa a sondar os oito pontos do alvo, inclui 641 px e planta o intervalo removido. A regra H2 não muda. A prova está em `diagnostico-alvos.json`.

## Ordem das secções na partida

PT: «O que se passa»; «O que se discute →»; «Por onde começar»; «Estudos recentes»; «Os valores de referência da Comissão Europeia».

EN: «What is happening»; «Under discussion →»; «Where to start»; «Recent studies»; «The European Commission’s reference values».

## Cabeça e portões

Cabeça final do código: `31e760a13e785d636afdd1f5b303fe64fac52895`. Os registos são comitados depois, sem alterar o código conferido. Nenhum PNG é comitado. Não houve publicação nem push.

| Portão | Código |
| --- | ---: |
| `build` | 0 |
| `check:discussao` | 0 |
| `check:navegacao` | 0 |
| `check:primeira` | 0 |
| `check:cabeca` | 0 |
| `gate:html` | 0 |
| `check:alvos` | 0 |
| `check:css` | 0 |
| `check:frases-compostas` | 0 |
| `check:lugar` | 0 |

Os códigos foram lidos dos ficheiros `.codigo` do escrivão. A corrida completa de `verify` e o typecheck ficam para o portão da aterragem, como manda o bloco. Não correram conferências do motor; a sua worktree está limpa e não foi alterada. A construção inclui também as conferências de voz e do país.

## Menu antes e depois

Método da H4: soma das larguras das portas e dos intervalos para a largura natural; linhas pelos topos das caixas. A contenção é conferida contra os limites da coluna, incluindo cada porta. Valores em px.

| Edição | Largura | Portas antes/depois | Linhas antes/depois | Natural antes/depois | Coluna |
| --- | ---: | ---: | ---: | ---: | ---: |
| PT | 360 | 7/8 | 3/4 | 666.312/826.234 | 324 |
| PT | 390 | 7/8 | 2/3 | 666.312/826.234 | 354 |
| PT | 768 | 7/8 | 1/2 | 699.337/864.762 | 707 |
| PT | 1024 | 7/8 | 1/1 | 742.345/914.938 | 942 |
| PT | 1280 | 7/8 | 1/1 | 774.312/952.234 | 1092 |
| PT | 1600 | 7/8 | 1/1 | 774.312/952.234 | 1092 |
| EN | 360 | 7/8 | 3/3 | 659.750/828.938 | 324 |
| EN | 390 | 7/8 | 2/3 | 659.750/828.938 | 354 |
| EN | 768 | 7/8 | 1/2 | 692.774/867.466 | 707 |
| EN | 1024 | 7/8 | 1/1 | 735.782/917.641 | 942 |
| EN | 1280 | 7/8 | 1/1 | 767.750/954.938 | 1092 |
| EN | 1600 | 7/8 | 1/1 | 767.750/954.938 | 1092 |

Todas as portas medem 44 px de altura; nenhuma sai da coluna. V2C-1: em PT a 360 px entra uma linha; em EN a 360 px não entra. A 390 px entra uma linha nas duas edições. A 768 px a fila passa de uma para duas linhas.

## Bloco, capturas e aceitação

PT: o bloco começa em **y=288 px**, tem 171.8125 px de altura e acaba em 459.8125 px, dentro da primeira janela de 900 px. A página mede 8457 px de altura.

EN: o bloco começa em **y=288 px**, tem 171.8125 px de altura e acaba em 459.8125 px, dentro da primeira janela de 900 px. A página mede 8360 px de altura.

PT: no HTML construído, o bloco começa no carácter 12312 de 220314; as primeiras secções são «O que se discute →», «O que se passa», «Por onde começar». Os títulos abrem os itens em um toque; o título do bloco e o menu abrem a página em um toque. Os fragmentos de destino existem.

EN: no HTML construído, o bloco começa no carácter 12326 de 219180; as primeiras secções são «Under discussion →», «What is happening», «Where to start». Os títulos abrem os itens em um toque; o título do bloco e o menu abrem a página em um toque. Os fragmentos de destino existem.

Manifesto: `../../capturas/v2c-2026-10-19/capturas.json`. Capturas inteiras e recortes do bloco e do menu, nas duas edições; o manifesto sela os PNG e os recursos servidos. Inspeção visual dos recortes PT/390 e EN/1280 e da página PT/390: o bloco é legível e está acima do painel.

| Captura inteira | Altura | Recortes |
| --- | ---: | --- |
| `primeira-pt-360.png` | 8819 px | `primeira-pt-360-bloco.png`, `primeira-pt-360-menu.png` |
| `primeira-pt-390.png` | 8457 px | `primeira-pt-390-bloco.png`, `primeira-pt-390-menu.png` |
| `primeira-pt-768.png` | 6654 px | `primeira-pt-768-bloco.png`, `primeira-pt-768-menu.png` |
| `primeira-pt-1024.png` | 5979 px | `primeira-pt-1024-bloco.png`, `primeira-pt-1024-menu.png` |
| `primeira-pt-1280.png` | 5879 px | `primeira-pt-1280-bloco.png`, `primeira-pt-1280-menu.png` |
| `primeira-pt-1600.png` | 5896 px | `primeira-pt-1600-bloco.png`, `primeira-pt-1600-menu.png` |
| `primeira-en-360.png` | 8758 px | `primeira-en-360-bloco.png`, `primeira-en-360-menu.png` |
| `primeira-en-390.png` | 8360 px | `primeira-en-390-bloco.png`, `primeira-en-390-menu.png` |
| `primeira-en-768.png` | 6718 px | `primeira-en-768-bloco.png`, `primeira-en-768-menu.png` |
| `primeira-en-1024.png` | 6082 px | `primeira-en-1024-bloco.png`, `primeira-en-1024-menu.png` |
| `primeira-en-1280.png` | 5879 px | `primeira-en-1280-bloco.png`, `primeira-en-1280-menu.png` |
| `primeira-en-1600.png` | 5967 px | `primeira-en-1600-bloco.png`, `primeira-en-1600-menu.png` |

## L1 e plantas

L1 antes/depois: **2782/2782**. Teto conservado em 2782. A decomposição integral por página, destino e multiplicidade é idêntica (`l1-comparacao.json`, `l1-antes.json`, `l1-depois.json`); não foi necessário alterar a regra nem o teto pelo procedimento V2B-15.

A célula dos itens recusa o bloco depois do painel, cada marca ausente, o bloco duplicado e um destino errado no título. A navegação recusa a discussão ausente, a ordem, o destino e o nome trocados. As plantas H4 continuam a proteger contagem, ordem, rótulos, dobra, letra, espaçamento, contenção e alvos. As quatro plantas adicionais do menu passaram: sem explicações, sem discussão, rótulo antigo da União, destino e ordem trocados. O recibo `plantas-menu.json` confirma a mordida e a reposição dos ficheiros por SHA-256. A célula da discussão passou com 40 de 40 plantas e 38 portas de integração.

## Limites e ocorrências

O identificador `Claude-Session` continua por confirmar, como assinalado em V2C-2. A construção intermédia recusou a expectativa de rota sem barra final da célula nova; foi corrigida pela rota efetivamente construída. Uma conferência de trabalho do país coincidiu com a reconstrução e terminou com `ENOENT` ao abrir `dist/correcoes/index.html`; foi descartada. A corrida final do escrivão reconstrói e confere sequencialmente, com os códigos acima.
