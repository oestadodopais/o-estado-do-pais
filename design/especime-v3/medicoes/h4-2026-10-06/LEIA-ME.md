# H4 · a medição do menu e os lugares da inteligência artificial

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

## Capturas e páginas construídas

Capturas finais por recolher; as do ensaio do menu estão identificadas em `menu-a-390.json`.

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

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/h4-2026-10-06/portoes`.

| Portão | Código lido do ficheiro |
| --- | ---: |
| build | por correr |
| verify | por correr |
| typecheck | por correr |

O `check:series` corre só sobre a parte do sítio, sem motor, conforme o mandato. Os registos são limpos dos caminhos locais antes de entrar no repositório.

## Questões abertas

- **H4-1.** O §2 pede o mesmo espaço medido na largura de referência; o §3 pede o mesmo `clamp`. A tabela mostra que são resultados diferentes. O menu, a sétima porta, o nome inteiro e a TM4 ficam parados até a direção escolher qual exigência vale. Nenhuma das propostas muda a letra das larguras maiores.
- **H4-2.** `/sobre/politica-ia` não existe na tabela das rotas. A política vive em `/metodo#politica-de-ia` e `/en/method#politica-de-ia`. Não se criou uma rota nova. As capturas do Método, quando presentes, identificam o endereço efetivo e a secção.
- **H4-3.** O texto dos lugares é o provisório do brief, §3, ponto 4. Falta a confirmação da redação pela direção antes de aterrar. A mudança fica no último commit de código, isolada do menu.
- **H4-4.** Falta a leitura a frio pelo Claude Opus, com os estragos nas cópias do pacote, e a conferência da entrega pelo lugar de direção. As plantas do construtor não substituem essa leitura.

## Commits e custo

Commits lidos do Git no momento de gerar este relatório:

- `36748dcf8af970322c040317c1be775e85be8eed`: H4: mede as portas antes de mudar o menu.

A cabeça final é a do commit que guarda este relatório e os códigos. A cabeça do código está no ficheiro `portoes/cabeca`; não se atribui a corrida ao commit posterior das provas.

A ferramenta desta sessão não expôs uma linha `tokens used`; o custo em tokens fica por medir pelo lançador. Não se estima a partir das percentagens de uso.
