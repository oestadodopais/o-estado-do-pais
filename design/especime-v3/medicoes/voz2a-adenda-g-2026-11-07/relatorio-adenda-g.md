# VOZ-2A: adenda G

**Estado: concluída.** Build inteiro, conferências exigidas, plantas e core.gate fora da sandbox verdes sobre as cabeças finais indicadas abaixo.

A adenda G ancora duas afirmações sobre as fontes e retira o quantificador da V195 e da V308. A atualização conserva as treze edições de 07.11.2026, as sete entradas «Estudo atualizado» e a contagem de 46 correções publicadas. Nenhuma edição datada é alterada.

## Asserções e livros

A V182 ganha a asserção `hospital-registos-sem-identidade-declarada` no estudo 04. A composição importa-a, sem alterar a citação ou a revisão, no estudo 18. A citação é «nenhuma das fontes afirma que são a mesma entidade». A revisão delimita os dois registos e exige a sua releitura. As cópias locais do BASE usam as três grafias de «Unidade Local de Saúde do Alentejo Central»; o registo do plano de recuperação usa «HOSPITAL DO ESPÍRITO SANTO DE ÉVORA, E.P.E.». A identidade permanece uma inferência pelos objetos dos contratos, como a frase prescrita diz.

A V040 fica na asserção existente `so-previsionais`, com o mesmo identificador e a mesma revisão, no estudo 14 e por importação no 19. Acrescenta-se «none of them is an execution account». Conservam-se as duas citações anteriores porque continuam publicadas noutra linha da tabela. Os documentos municipais desta secção são os orçamentos de 2024, 2025 e 2026; essa natureza foi relida nas cópias locais. Não se acrescenta uma asserção duplicada.

A primeira tentativa de reancoragem substituiu a citação inglesa anterior e deixou o «only» dessa outra linha sem cobertura. A conferência local recusou a tentativa. A versão final conserva a citação anterior, sem alterar a régua, o identificador ou a revisão. As quatro plantas retiram, em cópias temporárias dos livros 04, 14, 18 e 19, a citação nova: controlo a 0, adulteração a 1 por quantificador sem declaração.

A diferença campo a campo está em `livros-adenda-g.json` e reproduz-se com `python3 design/especime-v3/medicoes/voz2a-adenda-g-2026-11-07/conferir-livros.py <motor>`. Os livros 07 e 16 não mudam. Nenhuma linha, valor, ignore ou outra asserção muda nesta adenda. As diferenças autorizadas das adendas D e E permanecem como foram documentadas no relatório F.

## Planta R3 e novidades

A R3(04) usa uma edição sintética declarada: o mesmo primeiro parágrafo é acrescentado, em memória, ao corpo sem gráficos e à edição entregue. A régua aceita esse controlo e recusa a mudança de uma palavra só na edição entregue. Conserva-se a mesma função de comparação e a mesma razão de recusa. O ensaio completo do exportador passa com 34 verificações.

As cinco novidades podem ser estudos atualizados. A conferência mede as entradas reais e mantém as três plantas do dossiê num cenário declarado no navegador, repondo depois os bytes da lista real. A prova de voz mede a forma real do dossiê e testa também a sua forma nas novidades num cenário declarado. A planta das listagens exige o dossiê na primeira secção seguinte quando já não está nas novidades e recusa a sua omissão. Nenhum limite de geometria, voz ou contraste é alargado.

A L1 conserva o teto 3479 e a explicação medida na adenda F: base efetiva 3466, após a MET1 D retirar duas duplicações no Método, mais treze rotas de arquivo. Não entram novas rotas nesta adenda.

## Diagnóstico da moldura e da H10

O perfil de diagnóstico encontrou duas falhas de contraste, ambas no estudo 06 português, em tema escuro, a 390 e a 1280: o `time[datetime="2026-08-12"]` dentro da ligação à edição anterior herdava o azul por omissão do navegador (#0000ee), sobre #211e19, com 1,76:1. A correção limita-se à ligação da faixa editorial: herda a tinta do seu texto. O limiar da conferência fica em 4,5:1.

A H10 encontrou 388 `aria-expanded`, todos nos corpos das duas cópias arquivadas do estudo 07, de 20.08.2026. A exclusão antiga dos documentos alojados reconhecia só a rota sem data e dispensava a página inteira. A classificação passa a usar a lista fechada de rotas do manifesto, atual ou guardada, e dispensa apenas o corpo da obra citada, dentro de `data-oedp-moldura`. Os comandos da faixa da casa passam a ser medidos também nos documentos atuais, que antes ficavam inteiramente de fora. Um marcador com esse nome numa rota não declarada não cria uma isenção. O Método continua medido. As plantas põem um comando inválido da casa em cada rota declarada, nas duas rotas do Método e numa rota documental inventada; todos têm de ser recusados pela mesma H10.

## Contagens e integridade

A lista da VOZ-2A tem agora 160 decisões: 39 SAI, 84 REESCREVE e 37 FICA. A adenda G acrescenta a V308, o par inglês da V195. O guião das duas listas mede 160 campos `nova`, zero recusas e zero estudos com diferenças de números retirados entre línguas; as três plantas das formas anteriores continuam a ser recusadas.

As contagens das edições e do registo permanecem as da adenda F: 52 versões, 23 arquivadas, 17 testemunhos de primeira edição apresentados em 18 páginas, 12 entradas de texto (8 atualizações e 4 correções), 46 correções publicadas e 64 exceções exatas da voz. A VOZ-2A acrescentou treze versões e sete atualizações; a adenda G não acrescenta outra versão, entrada ou exceção. A prova de integridade conserva 19 versões históricas dos sete estudos, confere os bytes correntes das treze edições contra o commit do motor e compara 8382 referências nos 25 registos. A tabela completa das contagens que mudaram desde o início da VOZ-2A está abaixo e em `integridade.json`.

O motor final é `ce0cf7506a2696c1e23f1279fe272a25778330e0`. O sítio conferido é `50669385be16d215870ebc83d67f24dfc1773bbf`. Os commits anteriores da adenda são `253b99c5` no motor e `514201255` e `425dce262` no sítio. O hook do commit do motor foi adiado com `OEDP_GATE=adiado`; a prova exigida é o portão fora da sandbox, registado abaixo.

## Falha intermédia e fecho

A corrida integral ficou com build 1, verify 125 (não correu), typecheck 0 e motor 0. O build recusou a composição portuguesa do estudo 16: a troca que conservava a FICA V171 tratava o fim da frase, mas deixou entrar o novo início da V195. A composição passou a declarar também a conservação do início original da V171. A frase FICA ficou integralmente igual à lista; a V195 ficou na forma nova no estudo 07. O livro 16 não mudou. A conferência direta de asserções do 16 e a prova dos números passaram antes de comitar a correção.

Não se repetiu a corrida integral. O perfil dirigido `voz2a-g` reconstruiu o sítio e escolheu os dez comandos exigidos ou tocados pela mudança. Reutilizou o executor existente, incluindo as plantas e as células da união, da cabeça e da ausência de escrita no dist. Cinco comandos ficaram comprovados pelo build e os outros cinco correram em paralelo, todos a 0. O motor correu fora da sandbox em paralelo com as conferências do sítio, com registo próprio, e foi esperado antes de soltar a tranca. O `verify` integral não se declara verde: ficou por executar, código 125, na corrida anterior. O fecho aqui é o conjunto dirigido exigido pelo mandato.

| Conferência final | Código | Onde |
| --- | ---: | --- |
| build inteiro | 0 | fecho/build.codigo |
| check:voz | 0 | cadeia do build |
| check:edicoes (ED2 e ED3) | 0 | cadeia do build |
| check:registo | 0 | cadeia do build |
| check:datas | 0 | cadeia do build |
| check:discussao | 0 | cadeia do build |
| check:lugar | 0 | executor dirigido |
| check:alvos | 0 | executor dirigido |
| check:moldura | 0 | executor dirigido |
| check:primeira | 0 | executor dirigido |
| check:dossies | 0 | executor dirigido |
| typecheck | 0 | fecho/typecheck.codigo |
| core.gate | 0 | fecho/motor.codigo |

As plantas VOZ-2A passaram dentro do build: SAI reposta, Research Hub, ResearchHub e FICA fora das exceções recusados. As quatro plantas das asserções têm controlo 0 e adulteração 1. A planta L1 tem código 0, exigindo a recusa a 1 de 3481 páginas contra o teto 3479. A H10 tem 55 plantas, em 52 rotas documentais declaradas, no Método das duas línguas e numa rota inventada. A régua da moldura final conserva o limiar de contraste e passa a 0. A tentativa local inicial de check:primeira encontrou `listen EPERM: operation not permitted 127.0.0.1`; a conferência foi depois feita pelo escrivão e passou.

## Contagens finais e comandos

Nos treze documentos e treze páginas dos estudos: classe 214 → 53; fora das FICA 161 → 0; páginas com ocorrências 19 → 15. Só nas edições documentais: classe 203 → 50; fora das FICA 153 → 0. As 37 FICA foram conferidas literalmente em 56 combinações de frase e página da lista.

Cada contagem reproduz-se num comando:

```sh
node design/especime-v3/medicoes/voz2a-2026-11-07/medir-classe-adenda-a.mjs <temporario>/antes.json <worktree-anterior>/dist
node design/especime-v3/medicoes/voz2a-2026-11-07/medir-classe-adenda-a.mjs <temporario>/depois.json
```

A diferença dos livros, incluindo o livro 19 desde o início da VOZ-2A, reproduz-se num comando:

```sh
python3 design/especime-v3/medicoes/voz2a-adenda-g-2026-11-07/conferir-livros.py <motor>
```

Os resumos de 04 importados no 18 passam de `427490664461bb130f9ac992ad9d12b02dcd810e134558cd30e093a726d51a64` para `689618106d38640d127531b80bc179215429eb71f773c7a023ac7bad69a19a44`. Os de 14 importados no 19 passam, nesta adenda, de `307297cf47c6919c43b0234c0ab02b22d5cc1eaa79353bf1e82c8f9feb87ab0b` para `8ca64d1794639d95f7d1ab83be97908bb7e6f3b4a070b02eee15d1ba195942ec`; antes da VOZ-2A eram `f2077836a4f943578c54460830d55533b4c3ffd444ce6def0245744790683aaa`.

A asserção `base-sem-contratos` continua importada, com id e review iguais e com as duas citações da adenda D presentes nas páginas. As 161 linhas do livro 19 continuam iguais. O relatório estruturado mostra cada campo diferente, sem omitir os campos auxiliares.

As onze transcrições do dist estão em [frases-do-dist.md](frases-do-dist.md), incluindo seis em português e cinco em inglês. Entre elas estão V164, V182 e V194 em português e V043, V057 e V064 em inglês, cumprindo as três reescritas por língua pedidas no mandato. Os títulos conservados são os já registados na adenda F: «O que fica por saber» / «What remains unknown» nos estudos 04 e 18, e «O que fica por saber» no 06.

| Contagem da prova da voz | Antes da VOZ-2A | Final |
| --- | ---: | ---: |
| blocos_antes | 2922 | 2920 |
| blocos_conferidos | 2819 | 2817 |
| blocos_depois | 2819 | 2817 |
| com_palavra | 152 | 150 |
| cortes | 473 | 463 |
| frases_depois | 17784 | 17752 |
| offsets_conferidos | 9753 | 9761 |
| operacoes | 916 | 874 |
| substituicoes | 443 | 411 |
| S1·aprovado | 73 | 65 |
| S2·inventário-cego·aprovado-24.08 | 70 | 69 |
| S3·famílias-leituras·aprovado-24.08 | 78 | 77 |
| S5·segunda-voz·proposta-27.08 | 374 | 360 |
| S6·terceira-voz·proposta-27.08 | 313 | 295 |

As diferenças resultam das frases retiradas ou aplicadas nas fontes: deixam de precisar de operações posteriores. As referências numéricas conservam 8382; nenhum valor muda. Os blocos publicados passam de 95 para 94 no 04 português e de 161 para 160 no 18 português. As restantes contagens editoriais são as da tabela e da explicação da adenda F, conservadas acima.

## Custo da passagem

96 chamadas de orquestração, incluindo a escrita, o commit deste relatório e a verificação final. 40 chamadas a `curto.sh`, incluindo uma chamada agregadora (`retomar`) e as seis corridas interiores, que têm registos próprios. Uma corrida integral, dois perfis dirigidos, dois core.gate fora da sandbox e nenhuma captura. O número de chamadas é a contagem das células de execução e das esperas; os comandos compostos têm as suas corridas discriminadas em `medidas-adenda-g-voz2.json`. `tokens used`: não exposto.
