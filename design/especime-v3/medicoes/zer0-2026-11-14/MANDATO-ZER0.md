# Mandato ZER0: o ponto zero, sete correções julgadas ao que está no ar (14.11.2026)

Acrescenta: frases
Medidas: medidas-zer0.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `zer0-2026-11-14`, que está em cima do `main` depois de o COR3 aterrar; a outra pasta com escrita é a worktree do motor `zer0-2026-11-14`, em cima do `master`. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas; não lances sessões auxiliares, não corras o portão inteiro do motor nem a lista inteira do `verify`. Um commit no fim de cada ponto numerado, com o assunto a começar por `ZER0` (no motor com `OEDP_GATE=adiado`). O teu relatório vai para `RELATORIO-ZER0.txt`, nesta pasta, com vinte linhas no máximo; os registos para `zer0-conferencias/`, nesta pasta, só os códigos e as últimas vinte linhas de cada um, sem caminhos da máquina. Lê primeiro `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md` e depois `FOLHA-zer0-decidida.md`, nesta pasta: cada frase nova é a da folha, letra por letra, e não se reescreve. Se uma frase da folha não couber numa régua, não a mudes: pára nesse ponto, diz qual é a régua e o que recusa, e faz os outros pontos.*

## Porquê

O critério do lançamento é um só: o que está no ar está verificado. Depois de os três estudos corrigidos aterrarem, ficaram no ar sete defeitos conhecidos em páginas de dados: uma frase que diz de um índice o que ele não mede, cinco nomes que dizem de um ficheiro o que ele não diz, um euro de diferença num empréstimo, doze excertos que não são palavras da fonte, um rótulo sem o seu âmbito, dezoito recibos de linhas que nenhuma página usa e três recibos com uma data de releitura anterior à da leitura. A folha decidida diz o que cada um passa a dizer; o Codex julgou-a contra as cópias das fontes antes deste mandato, com cinco plantas em cinco (`JUIZO-ZER0.md`, nesta pasta).

## §0 O que se mediu (em `medidas-zer0.json`, com o comando de cada medida)

1. **A frase das regiões** está uma só vez em `src/i18n/strings.mjs` em português (o campo `significadoV` de `home.instr1`) e uma em inglês; só a imprime a página `/regioes/` e a sua edição inglesa. Nenhuma régua em `tests/` a prende.
2. **Os nomes do Plano de Recuperação e Resiliência de Évora** dizem «com sede em Évora» quatro vezes em `src/data/nomes-das-medidas.mjs`, e as descrições dizem «com sede no concelho» cinco vezes em `src/data/o-que-e-das-familias.mjs`. As duas aritméticas nascem no motor, em `publisher/manifest.evora.json`, e chegam ao sítio no campo `derivation` de duas linhas; `tests/cartao/rp4n.mjs` afirma o texto antigo das duas, e a lista das leituras dos cartões, em `tests/cartao/`, prende as cinco descrições. No ficheiro alojado do plano, os registos dos papéis «Beneficiário Intermediário» e «Beneficiário Direto» com «Évora» na coluna `localizacao_sede` são 2 311, em 23 pares de entidade e papel.
3. **O empréstimo.** A página 84 do Relatório de Gestão de 2016 alojado no motor imprime 32.166.372,20 e a página 99 imprime 32.166.373,20. A linha `evora-pael-emprestimo` é cruzada do motor (o identificador `pael-total` em `content/08 Évora Mandates/Technical Source/build_ledger.py`); o valor imprime-se no recibo, na página do concelho de Évora e na página da área da economia e coesão territorial, nas duas edições, e o recorte da página está em `public/recortes/`.
4. **Os excertos.** As 10 linhas eleitorais de Évora têm hoje um excerto composto pelo motor com chaves que a fonte não tem; o mesmo `build_ledger.py` gera-os. As duas linhas do plano com nome de entidade citam uma chave que o ficheiro não tem.
5. **A água não faturada.** O rótulo vem de `src/data/nomes-das-medidas.mjs` (a entrada da linha `agua-nao-faturada-portugal-2024`) e serve o cartão da página da área, o título do recibo e a migalha.
6. **As 18 linhas a retirar** estão todas publicadas hoje. Nomeiam-nas 13 ficheiros fora das suas próprias linhas (a lista está nas medidas, na chave `lista_dos_ficheiros_que_nomeiam`), entre eles `src/data/areas.mjs` (a regra `SEM_AREA` dos dois estudos da água), `src/data/lugares-coragua.mjs`, `src/data/o-que-e-das-familias.mjs`, a lista das leituras dos cartões em `tests/cartao/`, `tests/edicoes/origens-coragua.mjs`, `ledger/publicadores.json` e as duas entradas de texto de `src/data/correcoes.mjs` dos estudos `onde-esta-a-agua` e `agua-nao-faturada`, que o registo público não imprime porque são anteriores ao lançamento. O mecanismo está no `ledger/README.md` («`publication: "withdrawn"` conserva a linha no livro em disco e na validação integral»), e o precedente é o commit `5add31a0a`.
7. **As datas dos recibos.** Das 2 636 linhas publicadas com releituras registadas, 3 têm a última releitura anterior à data de leitura (as três relidas a 12.11.2026 depois de a fonte rever o valor), e o recibo imprime «relidos pela última vez a» com uma data anterior à de «lidos por este projeto a».

Outras medidas publicadas da mesma coisa: do empréstimo, a página 84 do mesmo relatório, que imprime um euro a menos, e é por isso que a linha muda; dos outros itens não entra número novo.

As listas fechadas que este bloco faz mexer: as contagens do livro e do Método que deixam de contar as 18 linhas; as chaves fixadas das linhas retiradas em `tests/cartao/rp4n.mjs`; as leituras provadas dos cartões; o teto da L1 e as listas que só encolhem; as entradas de proveniência que as doze mudanças de excerto acrescentam às suas linhas, e a entrada de correção do empréstimo. Mede cada uma antes de a mudar e diz no relatório o antes e o depois.

## O que fazes

Os quatro primeiros pontos são só do sítio. Os três seguintes passam pelo motor e atravessam.

1. **Z1, a frase das regiões.** Apaga a segunda frase do campo, nas duas edições, como a folha diz. A primeira fica igual.

2. **Z6, o rótulo da água não faturada.** O rótulo novo da folha, nas duas edições. Confere no HTML construído o cartão da página da área, o título do recibo e a migalha.

3. **Z7, as dezoito linhas saem da publicação.** `publication: "withdrawn"` em cada uma, pelo caminho que o `ledger/README.md` prevê e que o cruzamento com o motor aceitar (se as linhas forem geradas pelo exportador, a retirada entra pelo exportador e atravessa). Nenhuma linha se apaga do disco. `evora-populacao-2021` fica publicada. Cada lista que as nomeia fica coerente com a retirada, sem perder o que protege: uma régua que conferia estas linhas passa a conferir que estão retiradas e que nenhuma página as imprime. As duas entradas de texto de `src/data/correcoes.mjs` não se reescrevem: ficam como registo do ensaio na forma que os portões aceitarem (o registo público continua a não as imprimir), e se os portões não aceitarem nenhuma forma sem reescrita, pára aqui e diz o que recusam. Prova no HTML construído: os dezoito recibos deixam de existir nas duas edições, o índice do livro e as descargas deixam de as trazer, e nenhuma página de conteúdo perde um número.

4. **As datas do recibo.** A linha «relidos pela última vez a» (e a sua forma inglesa) só se imprime quando a data da última releitura é posterior à data de «lidos por este projeto a». É uma regra da classe, no recibo, e não uma exceção para três linhas. Uma planta mostra que morde nos dois sentidos: uma linha com a releitura anterior não a imprime, uma com a releitura posterior imprime-a.

5. **Z2, os nomes, as aritméticas e as descrições do plano de Évora.** Os quatro nomes e as cinco descrições no sítio, e as duas aritméticas no motor (`publisher/manifest.evora.json`), nas duas edições, como a folha diz; depois a travessia, com a régua que afirmava o texto antigo a afirmar o novo. Nenhum valor muda: confere-o.

6. **Z3, o empréstimo.** No motor: o valor, o localizador e o excerto da folha, pela página 99 do relatório já alojado, e a entrada de correção com a razão da folha nas duas edições e a data da aterragem (escreve a data do dia em que construíres; este lugar acerta-a no fecho). O ficheiro dos anexos de 2016 está na worktree do motor, por seguir, em `content/16 Évora Contas da Câmara/source/2016_anexos_demonstracoes_financeiras.pdf` (descarregado a 14.11.2026 às 13:27:34 UTC do endereço da câmara que a folha dá, com 8 879 193 bytes e o resumo `92ac2efd4f0a109ad8b2698590b7448abaf4ef6c21ad882d9c3a471a52d6805b`): confere o resumo e regista-o como fonte do estudo, na forma que essa pasta usa. Depois a travessia: o recibo, a página do concelho e a página da área com o valor novo nas duas edições, o recorte da página 99 no lugar do da página 84, e a correção datada no recibo. Os documentos dos estudos retirados que usam o mesmo identificador não se publicam; se a mudança os fizer mexer, di-lo.

7. **Z5, os doze excertos.** No motor, o excerto de cada uma das dez linhas eleitorais passa a ser o objeto da fonte que a folha transcreve, e o localizador ganha o caminho; confere cada objeto no ficheiro alojado do motor, carácter por carácter (com as quebras do ficheiro de 2025 reduzidas a um espaço), e se o ficheiro alojado diferir do que a folha transcreve, vale o alojado e dizes a diferença. As duas linhas do plano com nome de entidade passam à forma das outras somas sobre o mesmo ficheiro, e as suas duas descrições no sítio passam às da folha. Cada mudança entra como proveniência sobre o excerto, com a razão numa frase: o excerto anterior era uma composição do motor e não as palavras da fonte; o valor não muda.

8. **A prova.** O `build` a zero. As conferências que a mudança toca, cada código lido de um ficheiro: pelo menos `ledger:check`, `check:cruzamento` com a origem, `check:series`, `check:cartao`, `check:areas`, `check:incorporar`, `check:edicoes`, `check:frases-afirmacao`, `check:frases-reais`, `check:registo`, `check:rotulos`, `check:lugar`, `check:indice`, `check:voz`, o `typecheck`, e no motor os módulos do portão que os ficheiros mudados tocam. Corre também `check:frases-afirmacao` como a corrida do GitHub o corre, sem o motor (`env -u RESEARCHHUB_DIR GITHUB_ACTIONS=true`), porque foi aí que o bloco anterior parou. E um guião nesta pasta que confere no HTML construído, nas duas edições, que cada frase nova da folha está na página que a folha diz e a antiga não está em página nenhuma.

## O que fica como está, por decisão

O rótulo «Empresas não financeiras» dos concelhos (o Z4 da folha: é o nome que o INE dá a esse total). A primeira frase da caixa das regiões. O nome da linha `evora-prr-vencido-quota-2026`. As descrições das linhas do executivo de 2025. As bases de tolerância dos portões.

## Quando paras

Só pelo que protege um número, uma fonte ou uma pessoa: se um valor mudar onde a folha diz que não muda; se um excerto novo não estiver no ficheiro alojado; se uma régua só passar tirando-lhe o que confere. Paras nesse ponto, dizes qual e porquê, e fazes os outros. As ambiguidades pequenas decides tu e anotas no relatório.

## O fim

Os oito pontos, cada um no seu commit, e o relatório: o que mudou para o leitor em cada ponto, as listas que mexeram com o antes e o depois, o que o motor mudou, os códigos, e o que ficou por fazer.
