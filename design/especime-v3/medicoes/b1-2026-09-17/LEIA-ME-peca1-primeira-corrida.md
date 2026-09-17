| Ponto | Medida | Resultado |
|---|---|---|
| Página do estudo, item 4 | Fusão das vistas e redirecionamentos | Por construir. O portão recusa retirar a frase das portas. |
| Lista dos estudos, item 5 | País por data, seguido de «Por lugar» | Por construir. A guarda atual exige todas as linhas em cada lista. |
| Temas, item 7c | Correspondências válidas e planta | 13 correspondências da maqueta conferidas contra 18 domínios; 0 aplicadas. Portão e planta do tema por construir. |
| Frases, parte do item 8 | Inventário reduzido e voz a zero | Inventários intactos. O check:voz passou na construção de referência. |

**Peça parada antes da implementação**, pela ordem expressa de parar quando um portão impedir o brief. A prova retirou apenas a frase «O que cada porta abre…» do HTML construído. O check:lugar passou de 0 para 1, com a falha «0 frase(s) das portas (esperada 1)». Os bytes foram repostos e o SHA-256 voltou ao inicial. Nenhum portão foi alterado.

| Proteção atual | Conflito com o mandato | O que protege |
|---|---|---|
| scripts/check-lugar.mjs:1564 e :1989 | Exige a frase das portas, as filas de edições e a lista completa de estudos | Forma única das edições, acesso ao texto e ausência de páginas perdidas. A forma exigida é a anterior ao B1. |
| scripts/gate-html.mjs:6076 | Só aceita data-registo e as marcas associadas na rota texto | Proveniência e igualdade do corpo transcrito com o registo fixado. Mover o corpo exige manter esta conferência na nova rota. |
| scripts/check-datas.mjs:312 e :376 | Prende as datas às portas de edição da lista e aos blocos .edicao | Impede datas atribuídas à edição errada ou impressas sem correspondência verificável. |

O primeiro conflito foi exercido. Os restantes foram identificados por leitura do código. [Prova e resumos SHA-256](conflito-peca1.json), [corrida limpa](conflito-limpa-peca1.txt) e [rejeição da retirada](conflito-planta-peca1.txt). Reprodução: `node design/especime-v3/medicoes/b1-2026-09-17/provar-conflito-peca1.mjs`, depois da construção.

A linha «Documento original (PDF)» também precisa de decisão: o manifesto declara 18 edições HTML e há 0 PDF em studies-src/. Ligar HTML com o rótulo PDF seria uma indicação falsa. [Contagem e correspondências](temas-e-documentos-peca1.json).

| Família | Cadeias retiradas | Razão |
|---|---|---|
| Estudo | Nenhuma | Paragem antes da implementação. |
| Lista dos estudos | Nenhuma | Paragem antes da implementação. |

As retiradas pedidas continuam pendentes: «O que cada porta abre…» e o subtítulo da lista, por «explica a página»; «Edições» e as portas de leitura duplicadas, por «segunda porta»; «Ler no sítio», por «palavra fora do lugar». Não foram inscritas como retiradas em REVISOES-DO-INVENTARIO.md porque continuam nas páginas.

A tabela seguinte é a de TEMA_DO_ESTUDO, em design/especime-v3/maquetas/b1/fazer.py:291. Está conferida, mas não aplicada a studies.mjs. A referência a §5.5 no pedido não coincide com a numeração do brief; a correspondência explícita está no gerador da maqueta.

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

Commits novos: 0. Cabeça inicial e final: `2bf8b238b912fcb89da74096281305c75f0a3b3c`, ramo `b1-2026-09-17`. Main de referência: `ca4a130709fcc77ee5828f98dc4d39ecf8f7f223`. Não houve commit de implementação, push ou mudança de ramo. O relatório e as medições ficam por confirmar em Git, na worktree pedida.

O «antes» foi construído nesta worktree: as fontes, os dados e a configuração de construção são iguais aos de main na referência indicada; as diferenças entre as cabeças são documentos e maquetas. O carimbo do dist identifica a cabeça da worktree. [Comparação guardada](referencia-peca1.json).

| Comando | Código |
|---|---|
| `npm run build` | 0 |
| `npm run verify` | 0 |
| `npm run typecheck` | 0 |

Comandos separados sobre a cabeça indicada, com os códigos lidos de [portoes-peca1.txt](portoes-peca1-primeira-corrida.txt). Registos: [build](build-peca1-primeira-corrida.log), [verify](verify-peca1-primeira-corrida.log), [typecheck](typecheck-peca1-primeira-corrida.log). São verificações da versão de referência, não da peça concluída. O check:documentos passou; conserva a exceção D5 já declarada para a avaliação económica regional. Não houve leitura independente de uma implementação.

Capturas «antes»: 20, em Chromium 148.0.7778.96, com Playwright de node_modules. Capturas «depois»: 0, porque a construção parou. A medição encontrou 0 capturas de referência com deslocamento lateral; a 390, documento e corpo cabem na janela nas duas páginas e línguas. [Medições, rotas e resumos das imagens](capturas-antes-peca1.json).

| Largura | Estudo PT | Estudo EN | Lista PT | Lista EN |
|---|---|---|---|---|
| 390 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-390.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-390.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-390.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-390.png) |
| 768 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-768.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-768.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-768.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-768.png) |
| 1024 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-1024.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-1024.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-1024.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-1024.png) |
| 1280 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-1280.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-1280.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-1280.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-1280.png) |
| 1600 | [PNG](../../capturas/b1-2026-09-17/antes-estudo-pt-1600.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudo-en-1600.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-pt-1600.png) | [PNG](../../capturas/b1-2026-09-17/antes-estudos-en-1600.png) |

Tempo de parede até à escrita deste relatório: **16 min 35 s**, de 2026-09-17T13:24:46Z a 2026-09-17T13:41:21.336Z, medido pelo relógio. [Registo do tempo](tempo-peca1-primeira-corrida.json).

Ficam por fazer os quatro pontos de implementação, a planta do tema, a célula da lista fechada da voz e a sua planta, a transcrição da abertura de «Onde está a água?», os redirecionamentos e as capturas «depois». A retoma depende da decisão do lugar de direção sobre as células acima e sobre o rótulo do documento original. A mudança das células deve conservar a comparação com os registos, a amarra de cada data à sua edição e a cobertura de todos os estudos.
