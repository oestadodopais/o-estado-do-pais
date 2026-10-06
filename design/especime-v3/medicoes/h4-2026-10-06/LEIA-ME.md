# H4 · a medição do menu e os lugares da inteligência artificial

O registo abaixo conserva as passagens anteriores. A entrega atual está na secção «A passagem H4-d», no fim; os estados anteriores abaixo são históricos.

Construção por Codex gpt-6-astra nas passagens H4 a H4-d; a redação final dos papéis é a da passagem H4-e, pelo lugar de direção, depois da leitura curta do diff da H4-d (`design/especime-v3/critica/LEITURA-H4-d-2026-10-06.md`). As frases abaixo que chamam provisória ou final a uma redação anterior são históricas.

## O que mudou e onde parou

A política no Método passa a dizer a direção e a leitura pelos modelos Claude, e a construção pelo Codex, incluindo o motor. Sai o lugar da medição, que não foi exercido. O inventário conserva as frases antigas como retiradas e declara as novas; o portão de HTML confere a lista, a introdução e o fecho nas duas edições.

O menu, as suas etiquetas e a TM4 ficaram por alterar. A medição confirmou a viabilidade das portas e do nome inteiro, mas encontrou uma contradição entre o espaço igual ao medido na outra largura e o mesmo `clamp`. O mandato manda parar no ponto em que o brief diverge da medição. As propostas abaixo são ensaios no navegador, não uma alteração entregue.

## O menu medido antes de construir

Construção de partida: `207d71346ea034943058fffcbbb926ddafa79e90`. Comando: `node design/especime-v3/medicoes/h4-2026-10-06/medir-menu.mjs antes`. Medidas completas, caixas de cada porta, última porta e resumos das capturas em [menu-a-390.json](menu-a-390.json).

| Edição | Janela, px | Forma | Portas | Coluna, px | Largura natural, px | Linhas | Espaço, px | Letra | Sem transbordo |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| pt | 360 | servida | 6 | 324 | 343,65625 | 2 | 6 | 13px | sim |
| pt | 360 | proposta | 7 | 324 | 666,3125 | 3 | 16 | 15px | sim |
| pt | 360 | proposta-espaco-768 | 7 | 324 | 699,3365 | 3 | 21,504 | 15px | sim |
| pt | 390 | servida | 6 | 354 | 343,65625 | 1 | 6 | 13px | sim |
| pt | 390 | proposta | 7 | 354 | 666,3125 | 2 | 16 | 15px | sim |
| pt | 390 | proposta-espaco-768 | 7 | 354 | 699,3365 | 2 | 21,504 | 15px | sim |
| pt | 768 | servida | 6 | 707 | 497,910625 | 1 | 21,504 | 15px | sim |
| pt | 768 | proposta | 7 | 707 | 699,3365 | 1 | 21,504 | 15px | sim |
| pt | 768 | proposta-espaco-768 | 7 | 707 | 699,3365 | 1 | 21,504 | 15px | sim |
| en | 360 | servida | 6 | 324 | 341,21875 | 2 | 6 | 13px | sim |
| en | 360 | proposta | 7 | 324 | 659,75 | 3 | 16 | 15px | sim |
| en | 360 | proposta-espaco-768 | 7 | 324 | 692,774 | 3 | 21,504 | 15px | sim |
| en | 390 | servida | 6 | 354 | 341,21875 | 1 | 6 | 13px | sim |
| en | 390 | proposta | 7 | 354 | 659,75 | 2 | 16 | 15px | sim |
| en | 390 | proposta-espaco-768 | 7 | 354 | 692,774 | 2 | 21,504 | 15px | sim |
| en | 768 | servida | 6 | 707 | 495,145 | 1 | 21,504 | 15px | sim |
| en | 768 | proposta | 7 | 707 | 692,774 | 1 | 21,504 | 15px | sim |
| en | 768 | proposta-espaco-768 | 7 | 707 | 692,774 | 1 | 21,504 | 15px | sim |

A proposta usa o `clamp` do brief. A forma `proposta-espaco-768` ensaia o mesmo espaço numérico da largura de referência. O nome inteiro cabe nas duas interpretações na largura de aceitação, nas duas edições. Na janela mais estreita a fila dobra mais uma vez, sem cortar nenhuma porta.

## O menu que ficou servido

Cabeça da construção: `cb9a22296d17bed881a0f091b8f5864dcd72a571`. Comando: `node design/especime-v3/medicoes/h4-2026-10-06/medir-menu.mjs depois`. [Medidas e resumos das capturas finais](menu-depois-antes.json). O rótulo curto continua no código, porque a questão do espaço ainda está aberta.

| Edição | Janela, px | Portas | Coluna, px | Largura natural, px | Linhas | Espaço, px | Sem transbordo |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| pt | 360 | 6 | 324 | 343,65625 | 2 | 6 | sim |
| pt | 390 | 6 | 354 | 343,65625 | 1 | 6 | sim |
| pt | 768 | 6 | 707 | 497,910625 | 1 | 21,504 | sim |
| en | 360 | 6 | 324 | 341,21875 | 2 | 6 | sim |
| en | 390 | 6 | 354 | 341,21875 | 1 | 6 | sim |
| en | 768 | 6 | 707 | 495,145 | 1 | 21,504 | sim |

## Capturas e páginas construídas

Comando: `node design/especime-v3/medicoes/h4-2026-10-06/captar-h4.mjs --politica`. Cabeça da construção: `cb9a22296d17bed881a0f091b8f5864dcd72a571`. [Manifesto com os resumos SHA-256](capturas.json).

| Página | Edição | Janela, px | Captura | Recorte |
| --- | --- | ---: | --- | --- |
| primeira | pt | 390 | [página](../../capturas/h4-2026-10-06/primeira-pt-390-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-390-antes.png) |
| primeira | pt | 768 | [página](../../capturas/h4-2026-10-06/primeira-pt-768-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-768-antes.png) |
| primeira | pt | 1024 | [página](../../capturas/h4-2026-10-06/primeira-pt-1024-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-1024-antes.png) |
| primeira | pt | 1280 | [página](../../capturas/h4-2026-10-06/primeira-pt-1280-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-1280-antes.png) |
| primeira | pt | 1600 | [página](../../capturas/h4-2026-10-06/primeira-pt-1600-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-1600-antes.png) |
| primeira | en | 390 | [página](../../capturas/h4-2026-10-06/primeira-en-390-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-en-390-antes.png) |
| primeira | en | 768 | [página](../../capturas/h4-2026-10-06/primeira-en-768-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-en-768-antes.png) |
| primeira | en | 1024 | [página](../../capturas/h4-2026-10-06/primeira-en-1024-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-en-1024-antes.png) |
| primeira | en | 1280 | [página](../../capturas/h4-2026-10-06/primeira-en-1280-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-en-1280-antes.png) |
| primeira | en | 1600 | [página](../../capturas/h4-2026-10-06/primeira-en-1600-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-primeira-en-1600-antes.png) |
| explicacao | pt | 390 | [página](../../capturas/h4-2026-10-06/explicacao-pt-390-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-390-antes.png) |
| explicacao | pt | 768 | [página](../../capturas/h4-2026-10-06/explicacao-pt-768-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-768-antes.png) |
| explicacao | pt | 1024 | [página](../../capturas/h4-2026-10-06/explicacao-pt-1024-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-1024-antes.png) |
| explicacao | pt | 1280 | [página](../../capturas/h4-2026-10-06/explicacao-pt-1280-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-1280-antes.png) |
| explicacao | pt | 1600 | [página](../../capturas/h4-2026-10-06/explicacao-pt-1600-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-1600-antes.png) |
| explicacao | en | 390 | [página](../../capturas/h4-2026-10-06/explicacao-en-390-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-390-antes.png) |
| explicacao | en | 768 | [página](../../capturas/h4-2026-10-06/explicacao-en-768-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-768-antes.png) |
| explicacao | en | 1024 | [página](../../capturas/h4-2026-10-06/explicacao-en-1024-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-1024-antes.png) |
| explicacao | en | 1280 | [página](../../capturas/h4-2026-10-06/explicacao-en-1280-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-1280-antes.png) |
| explicacao | en | 1600 | [página](../../capturas/h4-2026-10-06/explicacao-en-1600-antes.png) | [pormenor](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-1600-antes.png) |
| politica | pt | 390 | [página](../../capturas/h4-2026-10-06/politica-pt-390.png) | [pormenor](../../capturas/h4-2026-10-06/lugares-ia-pt-390.png) |
| politica | pt | 1280 | [página](../../capturas/h4-2026-10-06/politica-pt-1280.png) | [pormenor](../../capturas/h4-2026-10-06/lugares-ia-pt-1280.png) |
| politica | en | 390 | [página](../../capturas/h4-2026-10-06/politica-en-390.png) | [pormenor](../../capturas/h4-2026-10-06/lugares-ia-en-390.png) |
| politica | en | 1280 | [página](../../capturas/h4-2026-10-06/politica-en-1280.png) | [pormenor](../../capturas/h4-2026-10-06/lugares-ia-en-1280.png) |

As cópias do HTML para a leitura estão em `paginas/`; o manifesto identifica as páginas e as folhas da mesma construção. Os ficheiros `menu-antes-proposta-*` são ensaios no navegador. Os ficheiros das páginas e `menu-depois-servida-*` mostram o código entregue.

A conferência final do pacote corre por `python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py`: compara os resumos das capturas, das páginas copiadas e das folhas, resolve as ligações deste relatório e procura caminhos locais depois de limpar os registos. O resultado fica em `conferencia-pacote.json`.

## As plantas e a mensagem que cada uma exige

A célula dos lugares é a mesma que o `gate:html` chama. Cada planta parte de uma cópia em memória de uma página construída que passou intacta. Os resumos provam que o HTML em disco não mudou. A TM4 não foi alterada nem se declara provada uma forma nova do menu.

| Edição | Planta | Mensagem exigida | Resultado |
| --- | --- | --- | --- |
| pt | um lugar a mais | H4 IA: a política tem de dizer três lugares. | mordeu |
| pt | a construção em falta | H4 IA: a política tem de dizer três lugares. | mordeu |
| pt | a medição no lugar da leitura | H4 IA: os lugares não são os da redação do brief. | mordeu |
| pt | a introdução antiga | H4 IA: a introdução dos lugares difere da redação do brief. | mordeu |
| pt | a família da construção trocada | H4 IA: as famílias e os lugares do fecho diferem da redação do brief. | mordeu |
| en | um lugar a mais | H4 IA: a política tem de dizer três lugares. | mordeu |
| en | a construção em falta | H4 IA: a política tem de dizer três lugares. | mordeu |
| en | a medição no lugar da leitura | H4 IA: os lugares não são os da redação do brief. | mordeu |
| en | a introdução antiga | H4 IA: a introdução dos lugares difere da redação do brief. | mordeu |
| en | a família da construção trocada | H4 IA: as famílias e os lugares do fecho diferem da redação do brief. | mordeu |

Comando e resultados em [plantas-politica.json](plantas-politica.json).

## Os portões

Cabeça do código medida: `cb9a22296d17bed881a0f091b8f5864dcd72a571`.

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes`.

| Portão | Código lido do ficheiro |
| --- | ---: |
| build | 0 |
| verify | 0 |
| typecheck | 0 |

O `check:series` corre só sobre a parte do sítio, sem motor, conforme o mandato. Os registos são limpos dos caminhos locais antes de entrar no repositório.

## Questões abertas

- **H4-1.** O §2 pede o mesmo espaço medido na largura de referência; o §3 pede o mesmo `clamp`. A tabela mostra que são resultados diferentes. O menu, a sétima porta, o nome inteiro e a TM4 ficam parados até a direção escolher qual exigência vale. Nenhuma das propostas muda a letra das larguras maiores.
- **H4-2.** `/sobre/politica-ia` não existe na tabela das rotas. A política vive em `/metodo#politica-de-ia` e `/en/method#politica-de-ia`. Seguiu-se a tabela, como o brief também manda: não se criou uma rota nova. As capturas do Método identificam o endereço efetivo e a secção. Fica a correção do endereço no brief para o lugar de direção.
- **H4-3.** O texto dos lugares é o provisório do brief, §3, ponto 4. Falta a confirmação da redação pela direção antes de aterrar. A mudança fica no último commit de código, isolada do menu.
- **H4-4.** Falta a leitura a frio pelo Claude Opus, com os estragos nas cópias do pacote, e a conferência da entrega pelo lugar de direção. As plantas do construtor não substituem essa leitura.

## Commits e custo

Commits lidos do Git no momento de gerar este relatório:

- `36748dcf8af970322c040317c1be775e85be8eed`: H4: mede as portas antes de mudar o menu.
- `e49f0ccc75832d4f2e6a51d24ec2c660716909a0`: H4: prepara as capturas e regista os pontos parados.
- `cb9a22296d17bed881a0f091b8f5864dcd72a571`: H4: diz os três lugares da IA pela redação provisória.

A cabeça final é a do commit que guarda este relatório e os códigos. A cabeça do código está no ficheiro `portoes/cabeca`; não se atribui a corrida ao commit posterior das provas.

A ferramenta desta sessão não expôs uma linha `tokens used`; o custo em tokens fica por medir pelo lançador. Não se estima a partir das percentagens de uso.

## A passagem H4-b

O bloco continua por fechar: há uma célula ou um portão vermelho. As mensagens e os códigos abaixo são os resultados efetivos; não se declara aceitação cumprida.

O cabeçalho ganha a porta das explicações e o nome inteiro da União. A regra que apertava o menu no telefone saiu: todas as larguras usam o espaço e a letra da regra base. A fila dobra onde precisa. O texto da política de IA da primeira passagem ficou intacto e está confirmado como final pela direção. (Histórico: a redação mudou na H4-d e na H4-e.)

Cabeça do código: `9c44ad9e31972cfbfd9d7138e29b52b9027bb63d`. Esta secção é gerada por `python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4b.py`, a partir dos ficheiros abaixo; o resumo legível por máquina está em [resumo-h4b.json](resumo-h4b.json).

### O menu antes e depois

Antes: `node design/especime-v3/medicoes/h4-2026-10-06/medir-menu.mjs depois`, na construção `cb9a22296d17bed881a0f091b8f5864dcd72a571`. Depois: `node design/especime-v3/medicoes/h4-2026-10-06/medir-menu.mjs depois`, na cabeça do código. As caixas de cada porta, a posição da última, as capturas e os SHA-256 estão em [menu-a-390.json](menu-a-390.json), incluindo a fase `depois`; a medida servida da primeira passagem está em [menu-depois-antes.json](menu-depois-antes.json).

| Edição | Janela, px | Fase | Portas | Coluna, px | Largura natural, px | Linhas | Espaço, px | Letra | Menor alvo, px | Sem transbordo |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| pt | 360 | antes | 6 | 324 | 343,65625 | 2 | 6 | 13px | 44 | sim |
| pt | 360 | depois | 7 | 324 | 666,3125 | 3 | 16 | 15px | 44 | sim |
| pt | 390 | antes | 6 | 354 | 343,65625 | 1 | 6 | 13px | 44 | sim |
| pt | 390 | depois | 7 | 354 | 666,3125 | 2 | 16 | 15px | 44 | sim |
| pt | 768 | antes | 6 | 707 | 497,910625 | 1 | 21,504 | 15px | 44 | sim |
| pt | 768 | depois | 7 | 707 | 699,3365 | 1 | 21,504 | 15px | 44 | sim |
| en | 360 | antes | 6 | 324 | 341,21875 | 2 | 6 | 13px | 44 | sim |
| en | 360 | depois | 7 | 324 | 659,75 | 3 | 16 | 15px | 44 | sim |
| en | 390 | antes | 6 | 354 | 341,21875 | 1 | 6 | 13px | 44 | sim |
| en | 390 | depois | 7 | 354 | 659,75 | 2 | 16 | 15px | 44 | sim |
| en | 768 | antes | 6 | 707 | 495,145 | 1 | 21,504 | 15px | 44 | sim |
| en | 768 | depois | 7 | 707 | 692,774 | 1 | 21,504 | 15px | 44 | sim |

A medida decide pelo nome inteiro: «União Europeia» e «European Union». Na largura de aceitação, as portas cabem em duas linhas nas duas edições. A janela mais estreita da tabela precisa de mais uma linha, com o mesmo espaço e a mesma letra, sem cortar nem esconder portas.

### As células e as plantas

Comando: `OEDP_TEMA_MENU_JSON=design/especime-v3/medicoes/h4-2026-10-06/tema-menu-b.json node tests/inicio/tema-e-menu.mjs --prova`. Resultado completo, incluindo a medida da regra base computada em cada largura: [tema-menu-b.json](tema-menu-b.json). A TM4 conserva a contagem exata, a linha única quando cabe, a dobra quando não cabe e a recusa do transbordo; confere também cada alvo de toque, a letra, o espaço das letras e as folgas de cada fila contra a regra base.

| Planta | Mensagem observada pela qual falhou | Resultado |
| --- | --- | --- |
| uma oitava porta no menu | TM4 · / a 1280 px: o menu tem 8 portas, e são sete. | mordeu |
| o menu apertado a 6 px | TM4 · / a 390 px: o espaço entre portas na mesma linha não é o da regra base (16 px; lido 6 px; folgas 6, 6, 6, 6, 6). | mordeu |
| o menu sem dobrar a 320 px | TM4 · / a 320 px: as sete portas não cabem numa linha e o menu não dobrou. | mordeu |
| uma porta sem 44 px de toque | TM4 · / a 390 px: a porta «Portugal» mede 30 px de altura, e o alvo de toque é de 44 px. | mordeu |
| uma oitava porta no menu | TM4 · /en/ a 1280 px: o menu tem 8 portas, e são sete. | mordeu |
| o menu apertado a 6 px | TM4 · /en/ a 390 px: o espaço entre portas na mesma linha não é o da regra base (16 px; lido 6 px; folgas 6, 6, 6, 6, 6). | mordeu |
| o menu sem dobrar a 320 px | TM4 · /en/ a 320 px: as sete portas não cabem numa linha e o menu não dobrou. | mordeu |
| uma porta sem 44 px de toque | TM4 · /en/ a 390 px: a porta «Portugal» mede 30 px de altura, e o alvo de toque é de 44 px. | mordeu |

A regra antiga do telefone só se serve ao navegador da planta; não é reposta na folha do projeto. Cada planta exige a mensagem da sua proteção, não apenas uma falha qualquer.

A N1 conserva uma lista esperada independente da lista que rende o cabeçalho, nas duas edições. As plantas adicionais correm por `OEDP_MEDICOES=design/especime-v3/medicoes/h4-2026-10-06 node tests/pais/portoes.mjs --prefixo h4b-`, com reposição byte a byte e SHA-256: [plantas-portoes-h4b.json](plantas-portoes-h4b.json).

| Planta da N1 | Mensagens exigidas | Resultado |
| --- | --- | --- |
| h4b-menu-sem-explicacoes | N1: menu de sete errado em index.html.; N1: menu de sete errado em en/index.html. | mordeu |
| h4b-menu-rotulo-antigo | N1: menu de sete errado em index.html.; N1: menu de sete errado em en/index.html. | mordeu |
| h4b-menu-destino-e-ordem | N1: menu de sete errado em index.html.; N1: menu de sete errado em en/index.html. | mordeu |

O inventário regista os rótulos nas novas portas e a confirmação do texto da política. As réguas da voz, da língua e do HTML mantêm as suas proteções. O rodapé já confere a lista certa e não foi alterado.

A L1 contou 2716 páginas antes e 2716 depois. O teto passou de 2716 para 2716: acréscimo de 0. Não se abriu nenhuma exceção. O menu fica na exclusão de cabeçalho que a régua já tinha, e a conferência das duas grafias do mesmo destino entre menu e corpo continua a correr. Medida e comandos em [resumo-h4b.json](resumo-h4b.json), com os registos de partida e do verify.

### As capturas e o pacote

Comando: `node design/especime-v3/medicoes/h4-2026-10-06/captar-h4.mjs --passagem-b`. As 20 capturas novas e os seus recortes mostram a primeira página e a explicação nas larguras pedidas, nas duas edições. [Manifesto com medidas e SHA-256](capturas-b.json). As imagens anteriores ficaram com o sufixo `-antes`, mantendo os resumos: [registo da preservação](preservadas-h4b.json). As capturas anteriores do Método continuam válidas para o texto da política; o HTML atual do Método e das páginas capturadas está em `paginas-b/`.

| Página | Edição | Janela, px | Captura | Menu |
| --- | --- | ---: | --- | --- |
| primeira | pt | 390 | [página](../../capturas/h4-2026-10-06/primeira-pt-390.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-390.png) |
| primeira | pt | 768 | [página](../../capturas/h4-2026-10-06/primeira-pt-768.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-768.png) |
| primeira | pt | 1024 | [página](../../capturas/h4-2026-10-06/primeira-pt-1024.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-1024.png) |
| primeira | pt | 1280 | [página](../../capturas/h4-2026-10-06/primeira-pt-1280.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-1280.png) |
| primeira | pt | 1600 | [página](../../capturas/h4-2026-10-06/primeira-pt-1600.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-1600.png) |
| primeira | en | 390 | [página](../../capturas/h4-2026-10-06/primeira-en-390.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-390.png) |
| primeira | en | 768 | [página](../../capturas/h4-2026-10-06/primeira-en-768.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-768.png) |
| primeira | en | 1024 | [página](../../capturas/h4-2026-10-06/primeira-en-1024.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-1024.png) |
| primeira | en | 1280 | [página](../../capturas/h4-2026-10-06/primeira-en-1280.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-1280.png) |
| primeira | en | 1600 | [página](../../capturas/h4-2026-10-06/primeira-en-1600.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-1600.png) |
| explicacao | pt | 390 | [página](../../capturas/h4-2026-10-06/explicacao-pt-390.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-390.png) |
| explicacao | pt | 768 | [página](../../capturas/h4-2026-10-06/explicacao-pt-768.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-768.png) |
| explicacao | pt | 1024 | [página](../../capturas/h4-2026-10-06/explicacao-pt-1024.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-1024.png) |
| explicacao | pt | 1280 | [página](../../capturas/h4-2026-10-06/explicacao-pt-1280.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-1280.png) |
| explicacao | pt | 1600 | [página](../../capturas/h4-2026-10-06/explicacao-pt-1600.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-pt-1600.png) |
| explicacao | en | 390 | [página](../../capturas/h4-2026-10-06/explicacao-en-390.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-390.png) |
| explicacao | en | 768 | [página](../../capturas/h4-2026-10-06/explicacao-en-768.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-768.png) |
| explicacao | en | 1024 | [página](../../capturas/h4-2026-10-06/explicacao-en-1024.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-1024.png) |
| explicacao | en | 1280 | [página](../../capturas/h4-2026-10-06/explicacao-en-1280.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-1280.png) |
| explicacao | en | 1600 | [página](../../capturas/h4-2026-10-06/explicacao-en-1600.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-explicacao-en-1600.png) |

A conferência do pacote corre por `python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py --passagem-b`: verifica resumos, ligações, cabeça, plantas, códigos e ausência de caminhos locais. O resultado está em [conferencia-pacote-b.json](conferencia-pacote-b.json).

### As decisões e o que fica por fazer

Registo: [decisoes-h4b.json](decisoes-h4b.json).

- **H4-1**, resolvida. Vale a regra base do espaço em cada largura e a mesma letra. A frase do teste de aceitação foi corrigida no brief, com a nota pedida.

- **H4-2**, resolvida. Os endereços são /metodo#politica-de-ia e /en/method#politica-de-ia. O ponto das capturas do brief foi corrigido, com a nota pedida. As capturas anteriores do Método servem.

- **H4-3**, resolvida. O texto dos lugares da primeira passagem é final, pela decisão do lugar de direção referida no mandato como DECISIONS.md §1.173, ponto 2. O texto da política não foi alterado nesta passagem. (Histórico: a redação mudou na H4-d e na H4-e.)

- **H4-4**, do lugar de direção. A leitura a frio pelo Claude Opus e a conferência da entrega cabem ao lugar de direção depois desta passagem.

- **H4-5**, por decidir. A medição servida confirma três linhas a 360 px nas duas edições. A TM4, com o limite literal de duas linhas até 430 px, também recusa as páginas a 320 px. Falha apenas por esse limite. A proposta enviada nesta sessão exige até duas linhas a 390 e 430 px e preserva a dobra natural abaixo dessas larguras, com o espaço, a letra, o alvo de toque e a ausência de transbordo protegidos. Não houve resposta; o limite pedido continua na célula e a H4-5 fica por decidir.

A leitura a frio e a aterragem ficam com o lugar de direção, como o mandato determina. Não se fez push. O custo em tokens não foi exposto pela ferramenta durante esta passagem e fica por ler pelo lançador; não é estimado.

A sequência do `verify` que ficou depois da TM4 foi executada separadamente, na mesma cabeça, com código 0 lido de `verificacoes-apos-tm4-b.codigo`. O comando exato e o resultado estão em [verificacoes-apos-tm4-b.json](verificacoes-apos-tm4-b.json), e o registo em `verificacoes-apos-tm4-b.log`. O código do `verify` continua a ser o que a corrida inteira escreveu.

### Os commits e os portões inteiros

Commits lidos do Git e guardados no resumo:

- `e55b1f50cc0f7309fdb234e4954411d60c558188`: H4-b: corrige o espaço e o endereço no brief.

- `cebf1a97dd1027208e4afb8f410cbb177662f77a`: H4-b: dá espaço às sete portas e repõe o nome da União.

- `a1160dab5e763edde0fe6679fcd351ef3158db28`: H4-b: protege as sete portas, o espaço e os alvos de toque.

- `00d92fed9f70fec22f30d72a1018776629f37d10`: H4-b: prepara a medição e a conferência das provas.

- `9c44ad9e31972cfbfd9d7138e29b52b9027bb63d`: H4-b: guarda a prova da corrida inteira e distingue integridade de aceitação.

Cabeça do código nos ficheiros `portoes-b/cabeca` e `portoes-b/cabeca.fim`: `9c44ad9e31972cfbfd9d7138e29b52b9027bb63d`. O commit seguinte guarda só o relatório e as provas.

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes-b`.

| Portão | Código lido do ficheiro |
| --- | ---: |
| build | 0 |
| verify | 1 |
| typecheck | 0 |

Os registos da corrida ficam em `portoes-b/`, limpos de caminhos locais antes de entrar no Git. A cabeça final é a do commit das provas; os portões pertencem à cabeça do código acima.

## A passagem H4-c

A H4-5 está fechada. A construção cumpre a decisão e os portões inteiros terminaram sem falhas. A alteração é da regra de aceitação e da sua prova; o menu servido conserva a dobra natural, as portas e o nome inteiro da União da passagem anterior.

Cabeça do código: `45c5a6cd000b9dbdaebe3aee310b6122c25aa512`. Secção gerada por `python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4c.py`, a partir dos ficheiros de medição e dos códigos. [Resumo e comandos](resumo-h4c.json).

### A decisão

O menu do telefone segue a dobra natural pela regra base: até aos 430 px, a TM4 exige no máximo 2 linhas a 390 e a 430 px e no máximo 3 linhas a 360 e a 320 px; em todas as larguras, nenhuma porta sai da janela, cada porta tem 44 px de altura de toque, o espaço entre portas vizinhas na mesma linha é o da regra base nessa largura e a letra é a da regra base (decidido a 06.10.2026 pela H4-5).

A frase foi acrescentada ao ponto da TM4 no brief, num commit próprio. [Decisão lida do brief](decisoes-h4c.json).

### As medidas do menu por largura

Comando: `node design/especime-v3/medicoes/h4-2026-10-06/medir-menu.mjs depois --passagem-c`. A fase `depois` de [menu-a-390.json](menu-a-390.json) contém as caixas de todas as portas, a posição da última, as capturas e os SHA-256. A fase anterior está conservada em `depois_h4b`; as imagens anteriores mantêm os seus ficheiros.

| Edição | Janela, px | Portas | Coluna, px | Largura natural, px | Linhas | Máximo | Espaço, px | Letra | Menor alvo, px | Sem transbordo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pt | 320 | 7 | 284 | 666,3125 | 3 | 3 | 16 | 15px | 44 | sim |
| pt | 360 | 7 | 324 | 666,3125 | 3 | 3 | 16 | 15px | 44 | sim |
| pt | 390 | 7 | 354 | 666,3125 | 2 | 2 | 16 | 15px | 44 | sim |
| pt | 430 | 7 | 394 | 666,3125 | 2 | 2 | 16 | 15px | 44 | sim |
| en | 320 | 7 | 284 | 659,75 | 3 | 3 | 16 | 15px | 44 | sim |
| en | 360 | 7 | 324 | 659,75 | 3 | 3 | 16 | 15px | 44 | sim |
| en | 390 | 7 | 354 | 659,75 | 2 | 2 | 16 | 15px | 44 | sim |
| en | 430 | 7 | 394 | 659,75 | 2 | 2 | 16 | 15px | 44 | sim |

O espaço entre vizinhas e a letra são comparados com a regra base resolvida pelo navegador nessa largura, incluindo o espaço das letras. O guião do pacote cruza as medidas da coluna, a contagem das portas e das linhas, as folgas, a letra e os alvos de toque com os resultados da TM4.

### As plantas e as mensagens

Comando da célula e das plantas, executado dentro do `verify`: `OEDP_TEMA_MENU_JSON=design/especime-v3/medicoes/h4-2026-10-06/tema-menu-c.json node tests/inicio/tema-e-menu.mjs --prova`. [Resultados completos](tema-menu-c.json).

| Planta | Mensagem observada e exigida | Resultado |
| --- | --- | --- |
| uma oitava porta no menu | TM4 · / a 1280 px: o menu tem 8 portas, e são sete. | mordeu |
| o menu apertado a 6 px | TM4 · / a 390 px: o espaço entre portas na mesma linha não é o da regra base (16 px; lido 6 px; folgas 6, 6, 6, 6, 6). | mordeu |
| o menu sem dobrar a 320 px | TM4 · / a 320 px: as sete portas não cabem numa linha e o menu não dobrou. | mordeu |
| quatro linhas a 320 px | TM4 · / a 320 px: o menu tem 4 linhas, e o máximo é três. | mordeu |
| uma porta sem 44 px de toque | TM4 · / a 390 px: a porta «Portugal» mede 30 px de altura, e o alvo de toque é de 44 px. | mordeu |
| uma oitava porta no menu | TM4 · /en/ a 1280 px: o menu tem 8 portas, e são sete. | mordeu |
| o menu apertado a 6 px | TM4 · /en/ a 390 px: o espaço entre portas na mesma linha não é o da regra base (16 px; lido 6 px; folgas 6, 6, 6, 6, 6). | mordeu |
| o menu sem dobrar a 320 px | TM4 · /en/ a 320 px: as sete portas não cabem numa linha e o menu não dobrou. | mordeu |
| quatro linhas a 320 px | TM4 · /en/ a 320 px: o menu tem 4 linhas, e o máximo é três. | mordeu |
| uma porta sem 44 px de toque | TM4 · /en/ a 390 px: a porta «Portugal» mede 30 px de altura, e o alvo de toque é de 44 px. | mordeu |

A planta nova serve ao navegador a regra base com um espaço maior e exige a mensagem da quarta linha. As outras plantas ficam. Nenhuma delas altera a folha fonte nem os ficheiros construídos.

### As capturas acrescentadas

Comando: `node design/especime-v3/medicoes/h4-2026-10-06/captar-h4.mjs --passagem-c`. [Manifesto com medidas e SHA-256](capturas-c.json). As páginas construídas estão em `paginas-c/`.

| Edição | Janela, px | Página | Menu |
| --- | --- | --- | --- |
| pt | 320 | [captura](../../capturas/h4-2026-10-06/primeira-pt-320.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-320.png) |
| pt | 360 | [captura](../../capturas/h4-2026-10-06/primeira-pt-360.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-pt-360.png) |
| en | 320 | [captura](../../capturas/h4-2026-10-06/primeira-en-320.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-320.png) |
| en | 360 | [captura](../../capturas/h4-2026-10-06/primeira-en-360.png) | [recorte](../../capturas/h4-2026-10-06/cabecalho-primeira-en-360.png) |

O transbordo do documento que a passagem anterior já separava do menu continua medido. Nenhuma porta sai da janela. As fontes do sítio não mudaram nesta passagem; o ajuste desse transbordo do corpo fica fora deste mandato.

| Edição | Janela, px | Documento, px |
| --- | --- | --- |
| pt | 320 | 322 |
| en | 320 | 335 |

Conferência: `python3 design/especime-v3/medicoes/h4-2026-10-06/conferir-pacote.py --passagem-c`. O guião confere a cabeça, os códigos, as medidas, as plantas, os resumos das capturas novas e anteriores, as páginas, as folhas e as ligações, e procura caminhos locais. [Resultado](conferencia-pacote-c.json).

### O que fica por fazer

A construção pedida nesta passagem está concluída e a H4-5 fechada. A leitura a frio por outra família e a conferência antes da aterragem continuam com o lugar de direção, como já estava registado na H4-4. Não se fez push. Não surgiu uma questão nova. O custo em tokens não foi exposto pela ferramenta e fica por ler pelo lançador.

### Os commits e os portões inteiros

Commits lidos do Git, guardados no resumo:

- `79f66ed4ce43a4d8fb35f32e636c88359edc01e9`: H4-c: regista no brief os limites decididos pela H4-5.

- `b0eea25d6309e1b74668e3cf1ba9585eeb59b241`: H4-c: protege os limites por largura e prova a quarta linha.

- `54a71206d35e2d3f84df76a4a030d2acd05e797e`: H4-c: prepara as medidas por largura e o fecho das provas.

- `45c5a6cd000b9dbdaebe3aee310b6122c25aa512`: H4-c: distingue a janela da coluna nos registos da TM4.

Cabeça do código, lida de `portoes-c/cabeca` e `portoes-c/cabeca.fim`: `45c5a6cd000b9dbdaebe3aee310b6122c25aa512`. O commit seguinte contém só o relatório e as provas.

Comando pela tranca: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes-c`. A variável `OEDP_TEMA_MENU_JSON` guarda a prova da TM4 durante o próprio `verify`.

| Portão | Código lido do ficheiro |
| --- | --- |
| build | 0 |
| verify | 0 |
| typecheck | 0 |

Os registos completos, os códigos e as datas estão em `portoes-c/`. Os caminhos locais dos registos foram substituídos antes de guardar o pacote. A cabeça final é a do commit das provas; a corrida pertence à cabeça do código acima.

## A passagem H4-d

A política do Método diz os lugares como são e explica o trabalho em palavras correntes, nas duas edições. A TM4 deixa de usar a folha fiscalizada como referência e passa a provar cada proteção em falta. As decisões do lugar de direção foram cumpridas; esta passagem fecha a construção do bloco.

Cabeça do código: `f958bf80eb9ffe366b5e40629b2c395ef71adcb9`. Secção gerada por `python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4d.py` a partir dos resultados guardados. [Resumo e conferências](resumo-h4d.json).

### O tratamento de cada achado

| Achado | O que mudou ou ficou reservado | Proteção e prova |
| --- | --- | --- |
| 1 | Estrago plantado na cópia do pacote; nenhum defeito a corrigir por este achado. | Conservado o resultado da leitura a frio. |
| 2 | Estrago plantado na cópia do pacote; nenhum defeito a corrigir por este achado. | Conservado o resultado da leitura a frio. |
| 3 | Estrago plantado na cópia do pacote; nenhum defeito a corrigir por este achado. | Conservado o resultado da leitura a frio. |
| 4 | Estrago plantado na cópia do pacote; nenhum defeito a corrigir por este achado. | Conservado o resultado da leitura a frio. |
| 5 | Estrago plantado na cópia do pacote; nenhum defeito a corrigir por este achado. | Conservado o resultado da leitura a frio. |
| 6 | Referência independente do espaço e da letra na TM4; plantas específicas para cada proteção em falta. | Plantas novas e mensagens na tabela abaixo; o aperto da regra base exige as mensagens do espaço e da letra. |
| 7 | Explicação EX1, reservada ao lugar de direção; texto intacto nesta passagem. | Fora do mandato H4-d, por decisão expressa. |
| 8 | Explicação EX1, reservada ao lugar de direção; texto intacto nesta passagem. | Fora do mandato H4-d, por decisão expressa. |
| 9 | Decisões H4-1 e H4-5 reservadas à aterragem pelo lugar de direção; sem alteração. | A TM4 conserva os limites decididos. |
| 10 | Decisões H4-1 e H4-5 reservadas à aterragem pelo lugar de direção; sem alteração. | A TM4 conserva os limites decididos. |
| 11 | Portões, plantas da política e da N1 e capturas do Método repetidos na cabeça do código. As plantas e capturas correm com git status --porcelain vazio. | Cabeça, estados inicial e final, códigos, mensagens e SHA-256 nos registos desta passagem. |
| 12 | Comentários e mensagens dizem redação decidida (§1.173); o mapa descreve as portas, linhas e plantas atuais. | Conferência literal dos ficheiros; plantas da política verificam as mensagens atualizadas. |
| 13 | O comentário regista a exceção do menu: o assunto União Europeia cabe; o nome inteiro da página permanece no título e rodapé. | Conferência do comentário; a N1 continua a recusar rótulo, ordem ou destino errados. |
| 14 | A secção H4 do inventário tem cabeçalho e separador de tabela. | Conferência da estrutura da tabela e das frases vivas. |
| 15 | A política permite Claude e Codex na construção e na leitura, sempre de famílias diferentes na mesma peça; Claude mantém a direção. | Plantas da divisão fixa antiga e da mesma família na construção e leitura, nas duas edições. |
| 16 | Aplicada sem paráfrases a redação final em português e inglês, no texto público e na cópia independente do portão; inventário atualizado. | Plantas das palavras de oficina na direção e na construção, nas duas edições. |

### A TM4 e as plantas novas

A corrida dentro do `verify` fez 28 plantas do tema e do menu, todas com a mensagem exigida; 22 são da TM4 e 12 são novas nesta passagem. Comando: `OEDP_TEMA_MENU_JSON=design/especime-v3/medicoes/h4-2026-10-06/tema-menu-d.json node tests/inicio/tema-e-menu.mjs --prova`. [Medições e plantas completas](tema-menu-d.json).

A célula calcula o espaço pela largura da janela com os valores aprovados guardados nela própria. A referência já não se lê da folha servida nem da folha fonte. A planta da regra base altera apenas a resposta CSS ao navegador e exige ambas as mensagens, a do espaço e a da letra.

| Planta nova | Mensagem exigida | Mensagem observada |
| --- | --- | --- |
| uma porta a menos no menu | TM4 · .*o menu tem 6 portas, e são sete\. | TM4 · / a 1280 px: o menu tem 6 portas, e são sete. |
| a última porta fora da janela | TM4 · .*o menu empurra a página | TM4 · / a 390 px: o menu empurra a página para o lado ou tem uma porta fora da sua caixa (a última porta acaba a 732 px numa janela de 390). |
| a letra do menu a 13 px | TM4 · .*a letra ou o espaço das letras difere da regra base | TM4 · / a 390 px: a letra ou o espaço das letras difere da regra base (15px, 0.75px). |
| a regra base apertada | TM4 · .*o espaço entre portas na mesma linha não é o da regra base | TM4 · / a 1280 px: o espaço entre portas na mesma linha não é o da regra base (34 px; lido 6 px; folgas 6, 6, 6, 6, 6, 6). |
| a regra base apertada | TM4 · .*a letra ou o espaço das letras difere da regra base | TM4 · / a 1280 px: a letra ou o espaço das letras difere da regra base (15px, 0.75px). |
| três linhas a 390 px | TM4 · .* a 390 px: o menu tem 3 linhas, e o máximo é duas\. | TM4 · / a 390 px: o menu tem 3 linhas, e o máximo é duas. |
| três linhas a 430 px | TM4 · .* a 430 px: o menu tem 3 linhas, e o máximo é duas\. | TM4 · / a 430 px: o menu tem 3 linhas, e o máximo é duas. |
| uma porta a menos no menu | TM4 · .*o menu tem 6 portas, e são sete\. | TM4 · /en/ a 1280 px: o menu tem 6 portas, e são sete. |
| a última porta fora da janela | TM4 · .*o menu empurra a página | TM4 · /en/ a 390 px: o menu empurra a página para o lado ou tem uma porta fora da sua caixa (a última porta acaba a 733 px numa janela de 390). |
| a letra do menu a 13 px | TM4 · .*a letra ou o espaço das letras difere da regra base | TM4 · /en/ a 390 px: a letra ou o espaço das letras difere da regra base (15px, 0.75px). |
| a regra base apertada | TM4 · .*o espaço entre portas na mesma linha não é o da regra base | TM4 · /en/ a 1280 px: o espaço entre portas na mesma linha não é o da regra base (34 px; lido 6 px; folgas 6, 6, 6, 6, 6, 6). |
| a regra base apertada | TM4 · .*a letra ou o espaço das letras difere da regra base | TM4 · /en/ a 1280 px: a letra ou o espaço das letras difere da regra base (15px, 0.75px). |
| três linhas a 390 px | TM4 · .* a 390 px: o menu tem 3 linhas, e o máximo é duas\. | TM4 · /en/ a 390 px: o menu tem 3 linhas, e o máximo é duas. |
| três linhas a 430 px | TM4 · .* a 430 px: o menu tem 3 linhas, e o máximo é duas\. | TM4 · /en/ a 430 px: o menu tem 3 linhas, e o máximo é duas. |

As restantes plantas continuam no resultado completo, incluindo a porta a mais, o menu sem dobrar e o alvo de toque. Nenhuma planta da TM4 muda ficheiros da construção.

### A política e a N1 na cabeça do código

A política fez 18 plantas; a N1 fez 3. Todas falharam pela mensagem esperada. A política trabalha em cópias na memória; a N1 repõe os ficheiros construídos byte a byte, com o mesmo resumo antes e depois. Os registos [das corridas](corridas-d.json), [da política](plantas-politica-d.json) e [da N1](n1-d/plantas-portoes-h4b.json) identificam a cabeça acima. O estado completo do Git estava vazio no início e no fim destas corridas.

| Edição | Planta da política | Mensagem observada e exigida |
| --- | --- | --- |
| pt | um lugar a mais | H4 IA: a política tem de dizer três lugares. |
| pt | a construção em falta | H4 IA: a política tem de dizer três lugares. |
| pt | a medição no lugar da leitura | H4 IA: os lugares não são os da redação decidida. |
| pt | a introdução antiga | H4 IA: a introdução dos lugares difere da redação decidida. |
| pt | a família da construção trocada | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| pt | a divisão fixa antiga | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| pt | a construção e a leitura da mesma família | H4 IA: os lugares não são os da redação decidida. |
| pt | a direção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |
| pt | a construção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |
| en | um lugar a mais | H4 IA: a política tem de dizer três lugares. |
| en | a construção em falta | H4 IA: a política tem de dizer três lugares. |
| en | a medição no lugar da leitura | H4 IA: os lugares não são os da redação decidida. |
| en | a introdução antiga | H4 IA: a introdução dos lugares difere da redação decidida. |
| en | a família da construção trocada | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| en | a divisão fixa antiga | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| en | a construção e a leitura da mesma família | H4 IA: os lugares não são os da redação decidida. |
| en | a direção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |
| en | a construção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |

| Planta da N1 | Código lido | Mensagens exigidas e encontradas no registo |
| --- | --- | --- |
| h4b-menu-sem-explicacoes | 1 | N1: menu de sete errado em index\.html\.; N1: menu de sete errado em en\/index\.html\. |
| h4b-menu-rotulo-antigo | 1 | N1: menu de sete errado em index\.html\.; N1: menu de sete errado em en\/index\.html\. |
| h4b-menu-destino-e-ordem | 1 | N1: menu de sete errado em index\.html\.; N1: menu de sete errado em en\/index\.html\. |

### H4-6: a palavra peça na política

A [primeira corrida completa](primeira-corrida-d.json) recusou a redação decidida na L3: a palavra «peça» nos lugares descreve o que se encomenda, constrói e lê. A régua passa a aceitar essa palavra apenas nos blocos inteiros aprovados, dentro da política no Método. O teto fica intacto. A redação pública mantém-se exatamente como recebida. A H4-6 fica fechada por esta distinção de contexto.

As 4 plantas [da L3](l3-d/plantas-portoes-h4d-l3.json) correram na cabeça do código com a árvore limpa e repuseram cada ficheiro byte a byte. Cada uma exigiu a mensagem da L3 acima do teto.

| Planta da L3 | Código lido | Mensagem exigida e encontrada |
| --- | --- | --- |
| h4d-l3-frase-aprovada-fora-do-metodo | 1 | L3 · palavras fora do vocabulário fechado\s+1\s+\(teto 0\) ACIMA DO TETO |
| h4d-l3-frase-aprovada-fora-da-politica | 1 | L3 · palavras fora do vocabulário fechado\s+1\s+\(teto 0\) ACIMA DO TETO |
| h4d-l3-frase-parecida-na-politica | 1 | L3 · palavras fora do vocabulário fechado\s+1\s+\(teto 0\) ACIMA DO TETO |
| h4d-l3-outra-palavra-na-politica | 1 | L3 · palavras fora do vocabulário fechado\s+1\s+\(teto 0\) ACIMA DO TETO |

### As capturas do Método

Foram refeitas 10 capturas de página inteira, cada uma com o recorte dos lugares e do cabeçalho, nas duas edições. O menu novo está à vista. [Manifesto, medidas e SHA-256](capturas-d.json). As cópias do HTML em `paginas-d/` têm os mesmos resumos das páginas lidas pelas plantas da política. Comando: `node design/especime-v3/medicoes/h4-2026-10-06/captar-h4.mjs --passagem-d`.

| Edição | Janela, px | Linhas do menu | Espaço, px | Letra | Página | Lugares | Cabeçalho |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pt | 390 | 2 | 16 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-pt-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-pt-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-pt-390.png) |
| pt | 768 | 1 | 21,504 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-pt-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-pt-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-pt-768.png) |
| pt | 1024 | 1 | 28,672 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-pt-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-pt-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-pt-1024.png) |
| pt | 1280 | 1 | 34 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-pt-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-pt-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-pt-1280.png) |
| pt | 1600 | 1 | 34 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-pt-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-pt-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-pt-1600.png) |
| en | 390 | 2 | 16 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-en-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-en-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-en-390.png) |
| en | 768 | 1 | 21,504 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-en-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-en-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-en-768.png) |
| en | 1024 | 1 | 28,672 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-en-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-en-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-en-1024.png) |
| en | 1280 | 1 | 34 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-en-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-en-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-en-1280.png) |
| en | 1600 | 1 | 34 | 15px | [captura](../../capturas/h4-2026-10-06/passagem-d/politica-en-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/lugares-ia-en-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-d/cabecalho-politica-en-1600.png) |

### Os commits e os portões inteiros

Comando pela tranca: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes-d`. A cabeça inicial e final dos portões é `f958bf80eb9ffe366b5e40629b2c395ef71adcb9`. Os códigos abaixo foram lidos dos ficheiros; os registos completos estão em `portoes-d/`.

| Portão | Código lido |
| --- | --- |
| build | 0 |
| verify | 0 |
| typecheck | 0 |

| Commit do código | Mudança |
| --- | --- |
| `f00766e3008a88c0176e7b640550716602c96747` | H4-d: provar as proteções em falta da TM4 (achado 6) |
| `efe38f9919de985a59b9a3d90c85080f463dd860` | H4-d: retirar o provisório e atualizar a TM4 no mapa (achado 12) |
| `aeec3c17ec62ec03bb31a40b2e8a54dfe32df52c` | H4-d: explicar a exceção do nome da União no menu (achado 13) |
| `35efa677c73bac12e91e5ea99618d1e975ddb1c6` | H4-d: dar cabeçalho à tabela do inventário (achado 14) |
| `fcadc7f797e1212e34ff2cf7938728e95ed65d62` | H4-d: dizer os lugares como são e em palavras correntes (achados 15 e 16) |
| `fd9659a08301e0c940a2c156a84d9e7ff10a7f0e` | H4-d: prender as provas e capturas à cabeça limpa (achado 11) |
| `f958bf80eb9ffe366b5e40629b2c395ef71adcb9` | H4-d: distinguir peça na política do nome de um estudo (H4-6) |

O commit seguinte guarda apenas o relatório, as capturas e os registos das provas. A cabeça final é a desse commit; a cabeça do código é a conferida acima. Os caminhos locais foram substituídos antes de guardar os registos.

### O que ficou por fazer e porquê

Os achados do EX1 ficam com o lugar de direção, por decisão expressa. A leitura curta do diff por outra família e a aterragem continuam com o lugar de direção. Não se fez push. A questão nova H4-6 ficou fechada nesta passagem, com as plantas da L3. O custo total de tokens não é exposto nesta sessão; fica por ler no registo do lançador.

## A passagem H4-e

A redação dos três papéis é do lugar de direção, reescrita depois da leitura curta do diff da H4-d (`design/especime-v3/critica/LEITURA-H4-d-2026-10-06.md`, o achado 3 e o 7): sem «peça» nem «lugares», a regra das famílias dita uma vez só, e o que a construção faz com cada número (a fonte e a data) distinguido do que a leitura faz com o que foi construído. A exceção H4-6 da L3 e as suas quatro plantas saíram com a palavra. Como a redação é de um modelo Claude, a leitura dela é do Codex, a outra família.

Cabeça do código: `25499b79fc803f1723e6ed92e9927e1a36dbb8b1`. Secção gerada por `python3 design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py` a partir dos resultados guardados. Os portões inteiros desta cabeça correm na corrida portão do GitHub, e não na máquina; aqui correram as conferências que a mudança toca, cada uma no seu comando com o código lido de um ficheiro.

### As conferências que a mudança toca

| Conferência | Código lido |
| --- | --- |
| check-lingua | 0 |
| check-lugar | 0 |
| gate-html | 0 |

### As plantas da política e da N1 na cabeça do código

A política fez 18 plantas; a N1 fez 3. Todas falharam pela mensagem esperada; a política trabalha em cópias na memória, e a N1 repõe os ficheiros construídos byte a byte. Comandos: `node design/especime-v3/medicoes/h4-2026-10-06/provar-politica.mjs --passagem-e` e `node tests/pais/portoes.mjs --prefixo h4b-`.

| Edição | Planta da política | Mensagem observada e exigida |
| --- | --- | --- |
| pt | um lugar a mais | H4 IA: a política tem de dizer três lugares. |
| pt | a construção em falta | H4 IA: a política tem de dizer três lugares. |
| pt | a medição no lugar da leitura | H4 IA: os lugares não são os da redação decidida. |
| pt | a introdução antiga | H4 IA: a introdução dos lugares difere da redação decidida. |
| pt | a família da construção trocada | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| pt | a divisão fixa antiga | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| pt | a construção e a leitura da mesma família | H4 IA: os lugares não são os da redação decidida. |
| pt | a direção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |
| pt | a construção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |
| en | um lugar a mais | H4 IA: a política tem de dizer três lugares. |
| en | a construção em falta | H4 IA: a política tem de dizer três lugares. |
| en | a medição no lugar da leitura | H4 IA: os lugares não são os da redação decidida. |
| en | a introdução antiga | H4 IA: a introdução dos lugares difere da redação decidida. |
| en | a família da construção trocada | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| en | a divisão fixa antiga | H4 IA: as famílias e os lugares do fecho diferem da redação decidida. |
| en | a construção e a leitura da mesma família | H4 IA: os lugares não são os da redação decidida. |
| en | a direção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |
| en | a construção com palavras de oficina | H4 IA: os lugares não são os da redação decidida. |

| Planta da N1 | Código lido | Mensagens exigidas e encontradas no registo |
| --- | --- | --- |
| h4b-menu-sem-explicacoes | 1 | N1: menu de sete errado em index\.html\.; N1: menu de sete errado em en\/index\.html\. |
| h4b-menu-rotulo-antigo | 1 | N1: menu de sete errado em index\.html\.; N1: menu de sete errado em en\/index\.html\. |
| h4b-menu-destino-e-ordem | 1 | N1: menu de sete errado em index\.html\.; N1: menu de sete errado em en\/index\.html\. |

### As capturas do Método

Foram refeitas 10 capturas de página inteira, cada uma com o recorte dos papéis e do cabeçalho, nas duas edições. [Manifesto, medidas e SHA-256](capturas-e.json). Comando: `node design/especime-v3/medicoes/h4-2026-10-06/captar-h4.mjs --passagem-e`.

| Edição | Janela, px | Página | Papéis | Cabeçalho |
| --- | --- | --- | --- | --- |
| pt | 390 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-pt-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-pt-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-pt-390.png) |
| pt | 768 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-pt-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-pt-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-pt-768.png) |
| pt | 1024 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-pt-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-pt-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-pt-1024.png) |
| pt | 1280 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-pt-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-pt-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-pt-1280.png) |
| pt | 1600 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-pt-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-pt-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-pt-1600.png) |
| en | 390 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-en-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-en-390.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-en-390.png) |
| en | 768 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-en-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-en-768.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-en-768.png) |
| en | 1024 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-en-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-en-1024.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-en-1024.png) |
| en | 1280 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-en-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-en-1280.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-en-1280.png) |
| en | 1600 | [captura](../../capturas/h4-2026-10-06/passagem-e/politica-en-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/lugares-ia-en-1600.png) | [captura](../../capturas/h4-2026-10-06/passagem-e/cabecalho-politica-en-1600.png) |

### Os commits da passagem

| Commit | Mudança |
| --- | --- |
| `25499b79fc803f1723e6ed92e9927e1a36dbb8b1` | H4-e: a redação dos três papéis reescrita pelo lugar de direção depois da leitura curta do diff da H4-d (o achado 3: dizia que quem constrói nunca verifica e a seguir que a construção confere o que publica, e usava «peça» em dois sentidos; o 7: a regra das famílias dita três vezes, o decalque, «em série» contra «in batches», «Os lugares» numa página cujo menu leva aos concelhos): sem «peça» nem «lugares», a regra das famílias uma vez só, a fonte e a data de cada número distinguidas da leitura; a exceção H4-6 da L3 e as suas quatro plantas saem com a palavra; o comentário do nome da União no menu diz o que foi medido (achado 9); o inventário com as dez frases novas vivas e as da H4-d retiradas; o mapa e as notas históricas do relatório (achado 11); os guiões das provas da passagem |

O commit seguinte guarda apenas esta secção, as capturas e os registos das provas; a cabeça do código é a conferida acima.
