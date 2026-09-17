| Ponto do §1 | Medida | Resultado |
|---|---|---|
| Página do estudo, item 4 | Fusão das vistas, corpo conferido na página e redirecionamentos | Por construir. A retoma encontrou três outras células que exigem elementos ausentes da maqueta. |
| Lista dos estudos, item 5 | País por data, seguido de «Por lugar» | Por construir. Paragem antes da implementação. |
| Temas, item 7c | Treze temas válidos, portão e planta | Treze correspondências conferidas; nenhuma aplicada. |
| Frases, parte do item 8 | Lista fechada no check:voz, planta e retiradas inventariadas | Por construir. Nenhuma cadeia foi retirada das fontes. |

**A peça não está acabada.** A autorização resolveu os conflitos do primeiro relatório, mas não cobre a obrigação de renderizar a faixa de contagens, o índice e a secção técnica das linhas. São exigências das células L5, L8 e L6 de `scripts/gate-html.mjs`, dentro de `verificaTexto()`. O prompt desta retoma manda: «Nenhuma outra célula de nenhum portão muda; se outra te parecer impedir o mandato, para e escreve o caso como fizeste.» A implementação parou por essa instrução. Nenhum portão foi alterado.

O relatório anterior não tinha inventariado estas dependências internas da conferência do corpo. A prova desta retoma retira cada elemento separadamente da página de texto construída de Évora 2027, conservando o corpo transcrito. Não é uma prova da página B1 já construída. Mostra que levar `verificaTexto()` intacta para a nova rota conserva as três exigências de forma, incompatíveis com «o que [as maquetas] não mostram não entra».

| Célula adicional | O que protege | Retirada isolada | Antes | Depois |
|---|---|---|---|---|
| L5, `scripts/gate-html.mjs:2384` | Recontagem das figuras e blocos contra o registo; igualdade das contagens impressas e porta para o corpo | Só `.texto-faixa` | 0 | 1: «a página tem 0 marcas data-registo-conta» |
| L8, `scripts/gate-html.mjs:2243` | Ordem, texto e destino de cada entrada do índice; posição das secções | Só `nav.texto-indice` | 0 | 1: «o índice «Nesta página» tem 0 entradas e o registo tem 29 títulos de nível 2 e 3» |
| L6, `scripts/gate-html.mjs:2132` | Acesso à linha do motor de cada figura sem linha no livro do projeto, com valor, impresso e origem conferidos | Só `#linhas-do-documento-dobra` | 0 | 1: «a página não tem a secção "As linhas deste documento"» |

[Prova, contextos e SHA-256](conflitos-retoma-peca1.json). Registos completos: [referência limpa](retoma-limpa-peca1.txt), [faixa retirada](retoma-faixa-peca1.txt), [índice retirado](retoma-indice-peca1.txt), [secção das linhas retirada](retoma-linhas-peca1.txt). Reprodução: `node design/especime-v3/medicoes/b1-2026-09-17/provar-conflitos-retoma-peca1.mjs`, sobre a construção de referência.

O HTML voltou em cada caso a `dcbc8c9ffd1ab38d0af957463b9b38e768d7127d85a1cd4ec495570ec5f2fdd5`. O corpo manteve `843210d455464c97a2e418389131c7c7e421b4bc44841c2f5806acb941a5ec80` nas três plantas. O portão manteve `30998fb9c1cabe6fbd8fe2a2ffa9da1a4da5aa8b7cf67cad26852960ac966679`. As fontes, os registos e os bytes das edições não mudaram.

A decisão necessária é sobre estas exigências de forma. A proposta para L5 e L8 é retirar a obrigação de mostrar a faixa e o índice, mantendo a recontagem interna e a conferência integral de qualquer contagem ou índice que se imprima. Para L6, a origem de cada figura tem de continuar acessível: a direção precisa de fixar onde vivem as linhas e como os números as abrem na forma B1. Apagar as linhas sem outra saída perde a prova; conservar a secção técnica como está acrescenta uma peça que a maqueta não mostra. Nenhuma destas propostas foi aplicada.

| Célula já autorizada | Decisão recebida | Estado nesta retoma |
|---|---|---|
| `check-lugar.mjs:1564` e `:1989` | Manter todas as páginas, a cobertura da lista e os acessos ao texto e à edição; retirar as exigências da frase, das filas e da caixa | Intacta. Planta da página em falta por fazer. |
| `gate-html.mjs:6076`, com a chamada a `verificaTexto()` | Conferir o corpo e as marcas na rota do estudo | Intacta. Planta do algarismo trocado na nova rota por fazer. |
| `check-datas.mjs:312` e `:376` | Prender cada data à edição correta sem depender das portas nem de `.edicao` | Intacta. Planta da data trocada por fazer. |

A linha final fica decidida como «Edição tal como foi publicada · publicado a <data>», com a versão inglesa correspondente. Há 18 edições HTML e nenhum PDF; o formato não entra no rótulo. A tabela dos temas é a de `design/especime-v3/maquetas/b1/fazer.py`, que fica intacta. Estas decisões deixam de ser pendências.

| Família | Cadeia cuja retirada foi autorizada | Razão | Retirada |
|---|---|---|---|
| Estudo | «O que cada porta abre…» | explica a página e é a forma anterior ao B1 | não |
| Estudo | «Edições» e portas duplicadas de leitura | segunda porta | não |
| Estudo | «Ler no sítio» | palavra fora do lugar | não |
| Lista | «Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá.» | explica a página | não |

Cadeias retiradas: **0**, nas duas línguas. `INVENTARIO-FRASES.md` e `critica/REVISOES-DO-INVENTARIO.md` permanecem intactos; inscrever uma retirada que não aconteceu seria falso. Os restantes elementos da forma antiga também permanecem, pela paragem anterior à implementação.

| Estudo | Tema da maqueta | Existe em dominios.mjs |
|---|---|---|
| `evora-quinze-anos-cinco-mandatos` | `governo-e-democracia` | sim |
| `evora-economia-investidores-portas-abertas-2026` | `economia-e-financas-publicas` | sim |
| `evora-orcamentado-pago-devido-2025` | `economia-e-financas-publicas` | sim |
| `evora-os-pelouros-quem-os-teve-o-que-fizeram` | `governo-e-democracia` | sim |
| `evora-prometido-pago-auditado-2026` | `economia-e-financas-publicas` | sim |
| `evora-2027-prometido-painel-dinheiro` | `cultura` | sim |
| `onde-esta-a-agua` | `agua` | sim |
| `agua-nao-faturada` | `agua` | sim |
| `avaliacao-economica-regional-de-portugal-2026` | `economia-e-financas-publicas` | sim |
| `which-door-is-yours` | `investimento` | sim |
| `alentejo-algarve` | `economia-e-financas-publicas` | sim |
| `evolucao-de-portugal-desde-1981` | `populacao` | sim |
| `penalizacoes-por-reforma-antecipada-2026` | `seguranca-social-e-pensoes` | sim |

Tabela conferida, não aplicada. [Contagem original dos temas e documentos](temas-e-documentos-peca1.json).

Commits novos: **0**. Cabeça inicial e final: `2bf8b238b912fcb89da74096281305c75f0a3b3c`, ramo `b1-2026-09-17`. Não houve commit de implementação, mudança de ramo, push ou escrita fora desta worktree. O relatório, as provas e as capturas de referência ficam por confirmar em Git. O [relatório da primeira corrida](LEIA-ME-peca1-primeira-corrida.md) fica preservado, com o [conflito inicial](conflito-peca1.json).

| Comando | Código na cabeça acima | Corrida |
|---|---|---|
| `npm run build` | 0 | primeira, antes da implementação |
| `npm run verify` | 0 | primeira, antes da implementação |
| `npm run typecheck` | 0 | primeira, antes da implementação |

Os códigos continuam em [portoes-peca1.txt](portoes-peca1-primeira-corrida.txt). [Build](build-peca1-primeira-corrida.log), [verify](verify-peca1-primeira-corrida.log), [typecheck](typecheck-peca1-primeira-corrida.log). Não foram repetidos nesta retoma: a cabeça e todas as fontes verificadas são as mesmas. Nesta retoma, o portão de HTML foi exercido sobre a referência e nas três retiradas isoladas, com os códigos 0, 1, 1 e 1 acima. Os verdes não provam uma peça B1 concluída. Não houve leitura independente de uma implementação.

Capturas «antes»: **20**, preservadas e reconferidas por SHA-256. Capturas «depois»: **0**. As medições de referência têm zero deslocamento lateral. [Rotas, larguras e resumos](capturas-antes-peca1.json). A referência usa as fontes de main em `ca4a130709fcc77ee5828f98dc4d39ecf8f7f223`; [comparação guardada](referencia-peca1.json).

| Largura | Estudo PT | Estudo EN | Lista PT | Lista EN |
|---|---|---|---|---|
| 390 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-390.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-390.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-390.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-390.png) |
| 768 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-768.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-768.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-768.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-768.png) |
| 1024 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-1024.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-1024.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-1024.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-1024.png) |
| 1280 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-1280.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-1280.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-1280.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-1280.png) |
| 1600 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-1600.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-1600.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-1600.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-1600.png) |

| Corrida | Início UTC | Fim UTC | Tempo de parede |
|---|---|---|---|
| Primeira | 2026-09-17T13:24:46Z | 2026-09-17T13:41:21.336Z | 16 min 35 s |
| Retoma | 2026-09-17T13:50:17Z | 2026-09-17T13:59:40.122Z | 9 min 23 s |
| Soma | | | **25 min 58 s** |

[Registo do tempo](tempo-peca1-primeira-retoma.json). A soma exclui o intervalo entre as corridas. A retoma conta desde a primeira leitura do relógio até à escrita deste relatório.

Ficam por fazer os quatro pontos da peça, as três mudanças autorizadas com as respetivas plantas, a planta do tema, a lista fechada da voz com a sua planta, a transcrição da abertura de «Onde está a água?», os redirecionamentos, as vinte capturas «depois», os commits e os três portões sobre a implementação concluída. A retoma depende da decisão sobre L5, L8 e L6, sem voltar a pedir as decisões já tomadas sobre as três células iniciais, o rótulo final e as retiradas.
