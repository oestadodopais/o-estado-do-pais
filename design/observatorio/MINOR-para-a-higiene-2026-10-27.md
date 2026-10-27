# Os Minor das leituras a frio de 27.10.2026, para o bloco de higiene seguinte

*Nove leituras do Claude Opus 5.5 (`leitor`) a 27.10.2026: três do FP1 e seis do item do Orçamento (OG1-B0), todas com as cinco plantas apanhadas. Os Blocking e os Major corrigiram-se antes de aterrar; estes são os Minor que ficaram, pela regra 4 de «O que uma sessão faz primeiro» (§1.177). Os relatórios inteiros estão na pasta da sessão de 26 e 27.10, fora do repositório; aqui fica o que é preciso para os fechar.*

## FP1 (a primeira página e os recibos)
- `src/components/inicio/EstudoDaLista.astro` ainda tem um recurso `?? '[verify]'`, hoje inalcançável porque `EstudosView.astro` lança antes no mesmo caso; sai, e uma data em falta falha a construção com a mensagem a nomear a edição.
- A peça «atualização» da caixa nunca é renderizada nem conferida numa página: as plantas chamam as funções diretamente; falta uma planta sobre a página construída, e o texto de uma correção (razão mais valores) precisa de nome do indicador e unidade quando aparecer.
- «números do painel relidos na fonte a» nomeia «o painel» sem a primeira página o definir; uma palavra corrente ou uma porta para o Método.
- (Fechado no FP2, 27.10 à noite: cada entrada de «O que se discute» leva a data e a primeira frase da conclusão do item.) O item do Orçamento aparece na caixa e logo abaixo em «O que se discute» (dois títulos repetidos palavra por palavra): cortar a repetição ou fundir os dois blocos; a caixa só com títulos: a primeira peça merecia uma linha com o que encontrou; as revisões do Eurostat de 26.10 não chegam à caixa porque a publicação da habitação do mesmo dia ordena primeiro no registo.
- Os comentários das datas citam commits que não são aterragens (f5ce0ef40, 753e7ff0b, a68946d7d) ao lado dos §; «escrita: dia da última reescrita» não é verdade para a explicação de 2026 (reescrita e aterrada outra vez a 12.10, §1.185); o item do Orçamento não recebeu o comentário prometido.
- A régua da L1 (`medir-l1-fp1.mjs`) regista a cabeça anterior quando mede com alterações por comitar; a planta do `undefined` e a da isenção editorial devem exercitar o caminho de recusa na página construída, não só a função.
- O relatório: contagens que não se reproduzem (17 contra 15 conferências; 166 contra 164 chamadas), passagens caducas, medições sem comando (os 394 s, as 148 e 7 184 cabeças, o âmbito do `typecheck`).
- `/estudos/`: Évora acima do estudo de 26.10 sem marca de «em curso» visível; «lidos» e «relidos» no mesmo dia (já colapsados na FP1-e, a conferir no ar).

## OG1-B0 (a recomendação e a opinião do item do Orçamento)
- O fecho «o que a UTAO escreve sobre o risco dos juros e das taxas de juro entra aqui a 28.10» é verdadeiro mas não selado (§105 p. 53, §107, §111 p. 54 da UTAO; a caixa 6.1 do relatório do Orçamento, pp. 359 a 361, com o choque de 100 p.b. em +505 milhões): as linhas entram na fase B e o fecho passa a dizê-lo com recibo.
- A citação «difícil de conciliar com o abrandamento recente da imigração líquida» aparece duas vezes por edição (nos factos e na opinião); «antes da votação final» em duas frases seguidas da recomendação; «a UTAO acha» por «a UTAO considera»; o inglês «the risk from interest and interest rates» desajeitado; a glosa «employment growth in the budget year» não traduz «1,4% em 2027» (sem algarismos por regra).
- O petróleo só é mostrado contra os futuros; o §16 da UTAO também o põe próximo ou acima das previsões do Banco de Portugal e do CFP (a fase B).
- A recomendação pede ao Governo «o conteúdo e os mecanismos» de uma medida que o ministro diz aprovada no Parlamento (a página da RTP alojada); o pedido mais preciso, que o §42 também nomeia, é a base da estimativa dos 300 milhões.
- O pedido do cenário do emprego não diz que o relatório do Orçamento publica quatro choques estilizados (p. 359), nenhum deles de oferta de trabalho ou imigração.
- O recibo inglês dos juros diz «thousand million euros» onde a opinião diz «billion» (anterior ao bloco).
- O `custo.json` reescreveu as durações da passagem g sem o dizer e não soma os símbolos por passagem; a nota dos oradores nomeados pelos tokens de atribuição não estava no relatório.
- O título da secção «A opinião do lugar de direção» é jargão da casa para um leitor de primeira vez.
- `tests/cartao/rp4nh.mjs` lê a história do repositório (`git log --follow --diff-filter=A`) no `check:cartao`, só no `verify`, que corre no GitHub com `fetch-depth: 0`; se um dia entrar na cadeia do `build`, falha numa cópia rasa como a I272. Anotar no ficheiro, ou ler a data do ficheiro comitado quando as linhas do livro-razão tiverem uma (a VR1, 27.10.2026).
