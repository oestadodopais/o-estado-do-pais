# Os Minor das leituras do DO2 (30.10.2026), para o bloco de higiene seguinte

*As leituras de 30.10.2026: a leitura a frio do Gemini 4 Argon (High), 12:35:52 a 12:49:28 UTC, e a leitura curta das correções pelo Claude Opus 5.5 (`leitor`), as duas com as cinco plantas apanhadas. Os Blocking e os Major corrigiram-se antes de aterrar (as adendas C, D e E do DO2); estes ficam para a higiene, pela §1.177. Sem travessões.*

## A leitura a frio (Argon)

1. O relatório final do construtor não traz as cinco entradas impressas de cada caixa nem os códigos dos `.codigo`, e `conferir-relatorio.py` sai com 1 (o Major 6 da leitura, passado a Minor pelo lugar de direção: é do registo e não do leitor); a ligação `<caminho>` do relatório saiu da limpeza dos caminhos do guião do pacote do lugar de direção, que troca o caminho em vez de o tornar relativo.
2. `scripts/dossies-html.mjs:22`, `tests/discussao/itens.mjs:289` e `tests/dossies/dossies.mjs:94` escrevem à mão só duas portas (`estado-e-economia` e `habitacao`) em vez de as ler de `ENTRADA_DA_ROTA` ou de `ENTRADAS`: um dossiê noutra porta seria recusado ou não conferido.
3. `scripts/voz-pais.mjs` conserva `s.dossies.recente`, que já não se imprime, e junta `textoEmDiscussao` e `textosEmDiscussao` à lista `permitidos` de todo o `<main>`; e `conferirNovidades` não confere o `title` do `[data-prova]` antes de a régua dispensar a entrada.
4. `agruparNovidades` põe um dossiê na caixa pela data de publicação das peças e imprime a data da escrita mais recente, sem reordenar: uma peça publicada entre as duas datas aparece acima do dossiê com uma data mais antiga.

## A leitura curta (Opus)

5. Contagens dos relatórios sem ficheiro no pacote (86/86, 788/788, «24 plantas e 8 da voz», «474 caminhos reais», «60 de 60»; `check:mortos` só como código observado); o conferidor da casa achou 0 de 3 números apoiados.
6. A régua da L1 do DO2 (`tests/dossies/do2-l1.mjs`) lê a redução esperada de um argumento da linha de comando (`2`), e não da função comum.
7. A E1 de `scripts/check-pais.mjs` fica vermelha quando o conteúdo muda sem defeito (nenhum estudo suprimido, ou menos de dois): «faltam estudos para exercer as três plantas»; as plantas passam a exercer-se sobre uma cópia dos dados.
8. Fora do modo dossiê, `BlocoDaDiscussao` ignora a propriedade `itens` (desenha `entradasDoInicio`).
9. Dois pares das plantas FP2 aceitam a mesma mensagem («data diferente» e «frase diferente»): cada planta passa a exigir a sua.
10. «Para perceber» na primeira página fica só com a linha da leitura da semana dos números relidos na fonte, que é prosa sobre o processo da casa: decidir se a secção sem explicação se imprime, ou onde vive essa linha.

## O lugar de direção

11. O guião `plantar.py` continua a escrever o caminho absoluto da cópia em `copia` (a HIG-5 §2.6 corrige-o); as cópias das plantas que entram no repositório limpam-se no guião dos registos.

## As leituras do DO3 (Opus, a frio e curta) e da EV2 (Opus, a frio)

12. O relatório do DO3 cita «dez páginas nas cinco larguras» (são dez capturas de uma página) e «gráficos: 0» sem `.codigo` (a leitura a frio, achado 8).
13. Repetições dentro da página do Orçamento que vêm do estudo: uma citação impressa duas vezes em parágrafos seguidos da secção `bloco-30`; um título de notícia em «Em resumo» e em «O que este projeto conclui» (achado 10).
14. O título inglês do item da Saúde com vírgulas decimais portuguesas («3,0 % … −1,5 %»), herdado (achado 11).
15. Os registos inteiros do `build` e da K8 comitados na pasta das medições do DO3 (18 343, 2 802 e cerca de 18 000 linhas): o guião dos registos guarda o código e as últimas linhas, não o registo inteiro.
16. A EV2: o caminho `@@derivadas` do compositor imprime o valor do livro sem a conferência do registo selado e as três linhas novas não têm `sanity_min`/`sanity_max`; o leitor por expressão de `scripts/check-registo.mjs:251` lê o manifesto dos documentos como o `provar-eyetext.mjs` lia (os achados 11 da leitura e da adenda D).

## A leitura a frio do DO4 (Opus, 30.10.2026)

17. **Primeiro da higiene:** a medida da disposição (`tests/inicio/novidades-disposicao.mjs`) lança quando a caixa não tem a entrada do dossiê, e o `check:alvos` chama-a em todas as primeiras páginas: quando cinco peças mais novas tirarem o dossiê da caixa, o `check:alvos` fica vermelho num conteúdo que nada tem com a caixa (achado 8).
18. Duas plantas da disposição mordem por outra razão que não a que dizem provar: a da letra da contagem muda a família, o peso e o fio juntos; a do alvo de toque põe `pointer-events:none` e morde a todas as larguras, sem planta própria para os 44 px entre 641 e 1 023 px (achado 6).
19. A grelha à largura de computador só compara a ordem da esquerda para a direita, e passaria uma ligação empurrada para uma segunda linha na coluna 3; não compara as colunas da linha do dossiê com as das outras linhas (achado 7).
20. A voz dispensa todos os `[data-dossie-lista] h2, h3`, em todas as rotas, quando `conferirSuperficieDossies` não devolve erros; as plantas das listas só estão no Temas, nenhuma nas portas nem no índice (achado 9).
21. A sentinela dos rótulos retirados «Dossiê»/«Dossier» compara só o nó inteiro, com maiúsculas, sem planta que mostre que ainda apanha o rótulo antigo (achado 10).
22. No bloco `do4` do inventário entraram só os dois tipos; a forma da coluna do título e o singular «peça»/«piece» ficaram em prosa por baixo da tabela (achado 11).
23. O relatório do construtor do DO4 não conferia nenhum número com ficheiro (sete), resumia os códigos em prosa e nomeava «datas» entre as réguas mudadas (achado 12).
24. O perfil `do4-alvos` do escrivão pode registar um verde numa cabeça cujo `dist/` não foi construído (achado 13).
25. A medida das capturas é opcional e sem documentação no cabeçalho de `captar.mjs`, e o `check:alvos` deita fora as medidas que devolve (achado 14).

## A leitura curta da EV2 (Opus, 30.10.2026)

26. A primeira página não diz que o estudo das contas de Évora foi atualizado: na caixa fica em quinto a 01.10.2026, e saiu dos cartões dos estudos recentes; a regra da caixa para uma edição com `updated` só está no mapa; «Edição tal como foi publicada» liga a um documento cujo texto este ramo substituiu (a leitura curta da EV2, achado 12).
27. O componente da edição passa a imprimir «atualizado a» em todas as edições que declaram `updated` (pelo menos quatro outras obras, uma com `date: null`), sem que essas páginas tenham sido vistas (achado 13).
28. A planta «com aspas» da prova do texto lido não pode falhar (o `load` de um `dump` com aspas dá os mesmos objetos); morde só a contagem dos 18; a mensagem ainda diz «14 edições» (achado 14).
29. Nenhuma planta da data de atualização cobre só o texto errado com o `datetime` certo, embora o código o confira (achado 15).
30. O relatório do construtor da EV2 não conferia nenhum número com ficheiro, e a sua corrida integral vermelha (build 1, verify 125) não se repetiu; a corrida verde é a do lugar de direção (achado 16).
31. As duas linhas da passagem 5 no inventário das frases ficam fora da tabela, depois de linhas em branco (achado 17).
32. O pacote de uma leitura que leve o corpo alojado de um documento anterior à M83 copia o recibo do pedido que existir no motor (para o relatório de contas de 2025 de Évora, `content/07 …/raw/pdf_manifest.json`); o `ev2b-pacote.sh` não o copiou (achado 6).
