# H4 · a medição do menu e os lugares da inteligência artificial

O registo abaixo conserva a primeira passagem. A entrega atual e as decisões da direção estão na secção «A passagem H4-b», no fim.

Construção por Codex gpt-6-astra. Texto provisório do brief; a redação final e a leitura a frio continuam por confirmar antes de aterrar.

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

O cabeçalho ganha a porta das explicações e o nome inteiro da União. A regra que apertava o menu no telefone saiu: todas as larguras usam o espaço e a letra da regra base. A fila dobra onde precisa. O texto da política de IA da primeira passagem ficou intacto e está confirmado como final pela direção.

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

- **H4-3**, resolvida. O texto dos lugares da primeira passagem é final, pela decisão do lugar de direção referida no mandato como DECISIONS.md §1.173, ponto 2. O texto da política não foi alterado nesta passagem.

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
