# V2-c: a discussão no topo e no menu

## Partida

A medição de `partida.json` pertence à cabeça `25ca0a4bc` construída. O bloco começa no carácter 194400 de 219878 em PT e 193147 de 218741 em EN (índices a partir de zero, abertura de `section`). A ordem anterior era painel, discussão, entradas. A 390 px, as páginas medem 8458 px em PT e 8361 px em EN. O menu tem sete portas: três linhas a 360 px e duas a 390 px, nas duas edições. A L1 mede 2782 páginas, teto 2782; as multiplicidades estão em `l1-antes.json`.

## Mudança para o leitor

A discussão é a primeira secção da página inicial nas duas edições, com os mesmos títulos e destinos.
A página da discussão passa também a ter uma porta no menu, entre as explicações e a União Europeia.

## Decisões

- V2C-1: a oitava porta entra. A medição de trabalho dá quatro linhas em PT e três em EN a 360 px; três nas duas edições a 390 px. Nenhuma porta sai da coluna. A prova da cabeça do código será acrescentada depois dos portões.
- V2C-2: o prompt não fornece `Claude-Session`. O trailer usa `[verify]`, ausência explícita, sem atribuir uma sessão inventada. Foi pedido o identificador exato.
- V2C-3: conserva-se o rótulo de IA que o layout já coloca antes das secções. A discussão é a primeira secção, antes de «O que se passa»; a identidade não muda.
- V2C-4: o escrivão só oferecia a corrida completa. Acrescenta-se o perfil fechado `v2c` ao pedido dos portões, com os dez comandos do mandato e sem motor. A corrida completa continua a ser a omissão. Os ensaios exercem a seleção verde, o build vermelho, a recusa de um perfil desconhecido e a tranca existente. O captor aceita larguras explícitas e a medição do menu pelo método da H4, para incluir 360 px fora da sandbox.
- V2C-5: `check:cabeca` só mede a hierarquia do H1 e da marca, e as outras células da primeira página encontram os seus blocos pelas marcas. Não codificam a primeira secção. A ordem nova e as marcas ausentes são protegidas na célula dos itens, com plantas próprias; a navegação ganha uma lista independente e plantas do menu.

- V2C-6: a primeira corrida fechou em H2. A 641 px, pontos a meio píxel da aresta inferior de «Estudos» e «Explainers» respondiam às portas da fila seguinte. Uma prova no navegador, com espera de dois quadros depois da mudança da folha, confirmou que 1 px entre filas devolve todos os pontos às suas portas. Acrescenta-se esse intervalo vertical, conservando altura, letra, espaço das letras e intervalo horizontal. A TM4 passa a sondar os oito pontos do alvo, inclui 641 px e planta o intervalo removido. A regra H2 não muda. A prova está em `diagnostico-alvos.json`.

## Estado das provas

A construção de partida passou. A construção intermédia detetou uma diferença entre a barra final da rota real da discussão e a rota escrita na célula nova do menu; a expectativa foi corrigida a partir do HTML construído. Medidas, códigos e manifesto finais ainda por acrescentar.
