# OG1-A5

A seleção fechada das 33 linhas foi preparada e aceite pelo exportador comum, sem escrita no sítio. A fase A continua por construir porque a releitura do §99 da UTAO confirmou uma divergência de conteúdo nas frases mandatadas sobre o petróleo. Não é uma recusa de proveniência nem um campo em falta.

## A divergência e a decisão pendente

A fonte alojada, na página física 52 (51 impressa), diz: «a média dos contratos de 2027 era de cerca de 95 USD, 11% acima dos 86,1 USD assumidos pelo MF». O mandato original escreve, na quarta frase de «O que as fontes dizem», «11 % abaixo dos contratos para esse ano» e, na conclusão, «um petróleo 11 % mais barato do que os contratos». As versões inglesas fazem a mesma inversão.

A percentagem tem bases diferentes nas duas relações: estar 11% acima não equivale a estar 11% abaixo quando se troca a base. `petroleo-a5.json` guarda a frase extraída do corpo, o recibo e o SHA-256, as três linhas numéricas e a demonstração aritmética dessa mudança de base. A fonte diz «cerca de 95»; a demonstração não pretende recalcular a medição da UTAO nem substituir os seus valores.

O §0 da OG1-A4 autoriza mudanças de forma sem mudar as palavras do lugar de direção, mas manda parar pelo conteúdo. Corrigir a relação percentual mudaria o conteúdo de duas frases nas duas línguas. Foi pedida essa decisão, sem resposta à data desta escrita. Não se alterou a redação, a fonte ou o número para fazer passar a conferência.

A proposta concreta para continuação é atribuir à UTAO que os contratos estão 11% acima do pressuposto da proposta, tanto na frase das fontes como na conclusão. Esta é uma proposta de correção, não uma transcrição do `dist/`.

## A seleção e os recibos

`publisher/og1a_export.py` passa de doze para dois parágrafos textuais da UTAO: `og1-utao-p15` e `og1-utao-p42`. Mantém as vinte linhas numéricas e as onze afirmações do mandato A5. O manifesto e as provas foram regenerados. A comparação com a cabeça inicial confirma dez linhas retiradas da seleção, nenhuma acrescentada e nenhuma alteração nos campos das 33 linhas retidas. As linhas retiradas permanecem no livro da pesquisa.

`conferir-petroleo-a5.py` verifica também a igualdade exata entre o manifesto e a lista fechada de 33 identificadores, independentemente das constantes do gerador. A lista completa está em `medidas-a5.json`, em `selecao_preparada`. Os recibos preparados permanecem em `publisher/recortes/og1a/provas.json`, no motor. O exportador aceitou as 33 linhas sem acrescentar entidades publicadoras ou outros campos. O Eurostat e as linhas auxiliares não fazem parte desta seleção.

Não houve travessia com `--write`, novas linhas ou novos recibos no sítio. Não se retirou uma travessia já escrita. A seleção está preparada, mas não se apresenta como entrega publicada.

## Códigos

| Corrida | Código | Resultado |
| --- | --- | --- |
| Preparação, `preparar-a5` | 0 | 33 linhas e provas geradas |
| Exportador comum, `travessia-a5` | 0 | 33 linhas aceites, sem escrita |
| `publisher.oe2027_generalidade_test`, `pesquisa-a5` | 0 | 85 controlos |
| Conferência da seleção e do petróleo, `petroleo-a5` | 1 | Seleção exata; divergência de conteúdo confirmada |

O último código é uma recusa de conteúdo documentada pelo construtor, com prova reproduzível da fonte e da aritmética. Não é uma recusa do exportador nem uma régua preexistente do sítio. Três corridas de conferências e uma geração. Nenhuma corrida inteira de portões, nenhum `core.gate` e nenhuma captura. `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` não correram; os seus códigos são `null`, não sucesso presumido.

## Item, correções e trabalho por fazer

Não existe terceiro item construído no `dist/`, pelo que não há seis partes desta passagem para transcrever em português ou inglês. Não se apresenta a prosa do mandato como saída construída. Não foram alterados nomes, famílias, lugares ou auditorias.

O ensaio da pesquisa voltou a conferir a frase completa do emprego público, a frase completa de Paulo Raimundo, a junção de «Inovação», as atribuições em lista e o valor 79 com o sinal positivo no excerto. A quarta correção continua sem objeto: não há `secondary_values` na pesquisa. A Saúde permanece resolvida conforme a OG1-A3: o item deve usar 17 803,1 milhões da linha do sítio; a linha da UTAO com 17 803 milhões fica na pesquisa, por não integrar a seleção fechada da OG1-A5.

Ficam por fazer a decisão sobre as duas frases do petróleo, a travessia com escrita, o item bilingue, nomes, famílias, lugares, recibos públicos, auditorias, conferências do sítio e transcrição do `dist/`. A fase B continua prevista para a noite de 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário. Esta promessa ainda não entrou num terceiro item construído.

## Cabeças, commits e custo

Cabeça inicial do sítio: `842bc8ee25dc1df3722ae4794b26ef5397ad1d47`. Cabeça do motor: `853e079cb5e4fed760e84223e88f0f39f3099209`. O motor fica com três ficheiros por comitar:

- `publisher/og1a_export.py`
- `publisher/manifest.og1a.json`
- `publisher/recortes/og1a/provas.json`

O mandato exige `OEDP_GATE=adiado`, mas o `comitar.sh` não transmite essa variável e ela não está definida no ambiente desta passagem. Não se pediu um commit sem poder garantir o adiamento. O commit do sítio guarda apenas o relatório, o ensaio da divergência, os códigos, os registos sanitizados e as medidas. A cabeça resultante será indicada na resposta final.

15 chamadas de ferramentas até à conferência do relatório; o commit e a inspeção final entram na contagem final da resposta. Três corridas de conferências, uma geração, nenhuma delegação. `tokens used`: não disponibilizado nesta passagem. `medidas.json` preserva a medição anterior em `historico_antes_og1_a5`.

---

# OG1-A4

A fase A continua por construir. A paragem desta passagem é uma recusa de proveniência na tentativa de sustentar a data da revisão do Eurostat, na primeira frase de «O que as fontes dizem». A linha `og1-eurostat-portugal-2025` existe no motor, mas não declara uma entidade publicadora que o exportador reconheça. O ensaio isolado, sem escrita e com `source: Eurostat`, devolveu:

> og1-eurostat-portugal-2025: source 'Eurostat' names no entity the engine row stands behind (none)

O §2 do mandato original inclui uma régua que protege uma fonte entre as paragens. Esta recusa não é a forma de uma atribuição já presente: falta a declaração da entidade no motor. Não se acrescentou uma atribuição à pesquisa nem se mudou a régua. Esta constatação limita-se ao caminho de exportação ensaiado; não prova que não exista outra forma de sustentar a data.

## O que correu e o erro do construtor

A separação em onze parágrafos da OG1-A4 não foi recusada nem implementada. A leitura do mecanismo mostrou ainda a necessidade de ligar datas e fragmentos aos seus campos. A seleção anterior tinha quarenta e três linhas e não incluía `og1-utao-saude-programa`, expressamente pedida na OG1-A3. Foi preparada uma seleção com essa linha e, para as datas, duas linhas auxiliares, `og1-agenda-votacoes-28` e `og1-eurostat-portugal-2025`.

A primeira tentativa tinha um erro do construtor: o valor por omissão de `source` escreveu «Assembleia da República» na linha do Eurostat. A recusa inicial não demonstra um problema com os valores da pesquisa. O ensaio isolado posterior corrigiu esse campo para «Eurostat» e confirmou que o motor não declara qualquer entidade para essa linha. Não se apresenta a primeira tentativa como prova suficiente da paragem.

Retiradas as duas linhas auxiliares, a seleção principal de quarenta e quatro linhas atravessou com código zero. A ligação das provas ao exportador também foi ensaiada. Essa escrita ocorreu antes do ensaio isolado final. Depois da recusa de proveniência, todas as quarenta e quatro linhas, os dois registos de travessia e a prova criados no sítio foram retirados. As quatro alterações do motor foram repostas byte a byte na cabeça inicial. Não fica uma exportação incompleta apresentada como entrega verificada. Os identificadores da travessia retirada estão em `medidas-a4.json`.

## Códigos

| Corrida | Código |
| --- | --- |
| Preparação da seleção ampliada, `preparar-a4` | 0 |
| Travessia ampliada, `travessia-ampliada-a4` | 1 |
| Preparação da seleção principal, `preparar-44-a4` | 0 |
| Travessia principal, `travessia-44-a4` | 0, escrita retirada |
| Ensaio isolado com publicador Eurostat, `eurostat-a4` | 1 |

Três corridas do exportador e duas gerações da seleção. Não correram o ensaio da pesquisa, `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck`, `check:cruzamento` ou `core.gate`; os códigos são `null`, não sucesso presumido. Nenhuma corrida inteira de portões e nenhuma captura. `manifest-eurostat-a4.json` conserva o pedido isolado sem caminhos locais; pode ser passado ao exportador com `--manifest`, o sítio em `--site` e sem `--write`.

## Item, correções e continuação

Não há terceiro item construído no `dist/`, pelo que não existem seis partes desta passagem para transcrever em português ou inglês. Nenhuma alteração de forma foi aplicada à prosa, frase a frase ou de outro modo. Não há novos nomes, famílias, lugares ou recibos entregues. Não se apresenta a prosa do mandato como saída construída.

As correções anteriores permanecem na cabeça inicial do motor, incluindo o valor 79, com o sinal positivo no excerto, e a frase completa de Paulo Raimundo. A quarta correção continua sem objeto, conforme a OG1-A2. A diferença da Saúde continua resolvida: o item deve usar os 17 803,1 milhões da linha existente, enquanto a linha da UTAO conserva 17 803 milhões. Não houve nova alteração destes conteúdos.

Fica por resolver a proveniência da linha auxiliar do Eurostat ou autorizar outro caminho verificado para a data. Ficam por fazer a travessia definitiva, o item com as seis partes nas duas edições, os nomes, as famílias, os lugares, os recibos, as auditorias, as conferências e a transcrição do `dist/`. A fase B continua prevista para a noite de 28.10.2026, depois do voto; essa promessa ainda não entrou num terceiro item construído.

## Cabeças, commit e custo

Cabeça inicial do sítio: `a8bbcad262a61a4244abc931cb383ccc246a01ba`. Cabeça do motor: `5965102dd460815c92c777d06e3e8f755944cd1b`. O motor não tem alterações desta passagem por comitar. O commit do sítio guarda apenas o relatório, os códigos, os registos sanitizados, o manifesto do ensaio isolado e as medidas.

34 chamadas de ferramentas até esta escrita, incluindo-a. Três corridas de conferências, duas gerações, nenhuma delegação. O commit e a inspeção final entram na contagem final da resposta. `tokens used`: 2510492 no último evento de utilização consultado antes desta escrita; não é a contagem final do lançador. `medidas.json` preserva a medição anterior em `historico_antes_og1_a4`.

---

# OG1-A3

A fase A continua por construir. A paragem desta passagem é a atribuição conjunta da sexta frase de «Como foi dito»: o mandato escreve o nome do ministro uma vez para cinco citações, mas a régua de `tests/discussao/itens.mjs`, linha 112, exige exatamente um token `attributed_to` por afirmação e por língua. O §2 manda parar quando uma régua protege uma pessoa. Não se alterou essa régua nem se repetiu o nome na prosa mandatada para a contornar.

## Prova da incompatibilidade

`conferir-atribuicao-a3.mjs` chama a função real `conferirDeclaracoes`. Primeiro confere os dois itens existentes: zero erros. Depois acrescenta, apenas em memória, um candidato que isola a sexta frase nas duas línguas, com as cinco citações e um token de atribuição, ligado à primeira. As cinco linhas vêm do livro do motor e o ensaio confirma que todas são afirmações atribuídas a «Joaquim Miranda Sarmento». Isto não simula nem certifica uma travessia.

Resultado: oito ocorrências de `V2B atribuição: falta o token da afirmação`, quatro por língua. As quatro linhas sem token próprio são `og1-governo-rtp-combustiveis`, `og1-governo-rtp-habitacao`, `og1-governo-eco-juros` e `og1-governo-observador-saldo`. O controlo acrescenta os quatro tokens em memória em cada língua e as queixas de atribuição desaparecem. Esse controlo repetiria o nome; não é a redação autorizada e não foi aplicado ao sítio.

O candidato isolado também produz duas queixas esperadas: a lista da conferência só conhece os dois itens anteriores e o candidato ainda não tem auditoria de palavras. Essas duas queixas não motivam a paragem, nem se apresenta o ensaio como uma conferência do item completo. `atribuicao-a3.json` guarda todos os erros, o candidato, o controlo e o resumo criptográfico da régua intacta.

## Saúde e correções anteriores

A diferença entre 17 803 milhões na UTAO e 17 803,1 milhões no sítio está resolvida pelo mandato OG1-A3 e não motivou esta paragem. O item deverá usar `oe-2027-saude-despesa-efetiva-consolidada-2027`; `og1-utao-saude-programa` deverá atravessar como linha da UTAO com recibo próprio. Nenhuma delas mudou nesta passagem.

A cabeça inicial do motor já contém as correções anteriores e a linha `og1-utao-novas-saldo` com valor 79. A quarta correção continua sem objeto, conforme a decisão OG1-A2. Não se repetiu a geração nem o ensaio da pesquisa, e não se declara uma nova verificação dos seus corpos nesta passagem.

## Códigos, item e trabalho por fazer

| Corrida desta passagem | Código |
| --- | --- |
| Ensaio isolado da atribuição, `atribuicao-a3.codigo` | 1, recusa confirmada |

Uma corrida de conferência, com base, candidato e controlo em memória. Nenhuma geração, corrida inteira de portões, captura ou `core.gate`. A travessia, o ensaio da pesquisa, `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` não correram; os seus códigos são `null` em `medidas-a3.json`. `medidas.json` conserva a medição OG1-A2 e o seu histórico.

Não houve travessia com escrita, linhas novas ou recibos públicos novos. Não se alteraram `src/data/discussao.mjs`, nomes, famílias, lugares ou réguas. Não existe terceiro item construído no `dist/`, pelo que não há seis partes novas para transcrever em português ou inglês. A frase do mandato não é apresentada como saída construída.

Ficam por fazer a compatibilização autorizada entre a atribuição conjunta e a exigência de um token por afirmação, a travessia, o item bilingue, nomes, famílias, lugares, recibos e as conferências do §1.3. A fase B continua prevista para a noite de 28.10.2026, depois do voto, com o registo da votação e as intervenções do Diário; essa promessa ainda não entrou numa página construída.

## Cabeças, commit e custo

Cabeça inicial do sítio: `9ebd19bc232365ac7c8d0b14c8a3b2db5fec927a`. Cabeça do motor: `5965102dd460815c92c777d06e3e8f755944cd1b`. O motor está limpo e não tem ficheiros desta passagem por comitar. O commit do sítio pelo escrivão guarda apenas o ensaio, as medidas e este relatório. A cabeça resultante consta da resposta final.

20 chamadas de ferramentas até escrever este relatório, incluindo esta escrita. Uma corrida de conferência. As inspeções e o commit posteriores entram na contagem final da resposta. Nenhuma delegação. `tokens used`: não disponibilizado nesta passagem; o lançador mede os pontos.

---

# OG1-A2

A correção de `+79` está feita e verificada no motor. A continuação para perante a gémea da Saúde, conforme o §2: `og1-utao-saude-programa` contém **17 803 milhões de euros** e `oe-2027-saude-despesa-efetiva-consolidada-2027` contém **17 803,1 milhões de euros**. A comparação foi refeita contra os ficheiros atuais; `gemeas-a2.json` guarda os valores, o localizador e o resumo criptográfico do ficheiro do sítio. As outras oito correspondências do §0.5 coincidem numericamente.

O mesmo §2 manda parar perante uma diferença e, entre parênteses, manda usar a linha do sítio com nota. Foi pedida clarificação dessa contradição. Sem resposta, não se toma a diferença como uma autorização para continuar. A continuação deverá usar a linha existente do sítio e explicitar a diferença de precisão, se o lugar de direção confirmar que esta gémea não impede a construção.

## Correção e ensaios

O seletor passa a ler `79`, em `milhões de euros`. O gerador conserva o nome português «impacto das novas medidas de política orçamental no saldo de 2027, a favor do saldo» e o inglês «impact of new fiscal policy measures on the 2027 balance, in favour of the balance». O excerto conserva `+79 M€ (+0,02% do PIB)`. A quinta correção e a razão constam de `correcoes-2026-10-26.json`. Só esta linha do livro mudou, nos campos `value`, `name`, `name_en` e `note`; nenhuma fonte ou régua do exportador mudou. O recibo da fonte foi relido e a prova da travessia foi regenerada.

O ensaio da pesquisa passou com **85 controlos**. O ensaio do exportador comum passou para as **43 linhas preparadas**, sem escrever no sítio. O `-5 411` e o `-1,4` presentes nesta seleção foram aceites. Os restantes valores negativos indicados no mandato não pertencem à seleção; não se declara que atravessaram. Não há outro valor numérico com sinal positivo nos seletores da pesquisa.

A quarta correção continua sem objeto: não existem `secondary_values` na pesquisa. As três correções anteriores e a regularização das atribuições permanecem na cabeça inicial do motor.

| Corrida desta passagem | Código |
| --- | --- |
| Gerador da pesquisa | 0 |
| `publisher.oe2027_generalidade_test --record` | 0 |
| Gerador do relatório do motor | 0 |
| Preparação das provas para a travessia | 0 |
| Exportador comum, sem `--write` | 0 |
| Comparação das nove gémeas do §0.5 | 1, Saúde diferente |

Os códigos e registos têm o sufixo `-a2`. `medidas.json` conserva a medição anterior em `historico_og1_a`; `medidas-a2.json` contém apenas esta passagem. As conferências do sítio não correram, porque o conteúdo do sítio não foi alterado: `build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` estão a `null`. Nenhuma corrida inteira de portões, nenhum `core.gate` e nenhuma captura.

## Item, linhas e recibos

Não houve travessia com escrita. Não há linhas novas, recibos públicos novos ou terceiro item em `src/data/discussao.mjs`. Por isso não há seis partes novas do `dist/` para transcrever, em nenhuma das edições. Não se apresenta a prosa do mandato como se tivesse sido construída. A promessa da fase B, na noite de 28.10.2026, continua no mandato e terá de entrar no último parágrafo da opinião quando o item for construído.

## Commits e trabalho por fazer

Cabeça inicial do sítio: `ede946972550b49186be7b3beee0487643e47219`. Cabeça do motor: `df277a39f3c295972315d754a40a269023b6a268`.

O motor fica por comitar: o `comitar.sh` não transmite `OEDP_GATE=adiado`, e o escrivão não lê essa opção do pedido. A variável também não está definida no ambiente desta passagem. Não se lançou um commit sem poder garantir o adiamento exigido pelo mandato. Ficheiros por comitar:

- `content/30 Orcamento 2027 Generalidade/LEIA-ME.md`
- `content/30 Orcamento 2027 Generalidade/correcoes-2026-10-26.json`
- `content/30 Orcamento 2027 Generalidade/extracoes.json`
- `content/30 Orcamento 2027 Generalidade/ledger.json`
- `content/30 Orcamento 2027 Generalidade/verificacao.json`
- `publisher/oe2027_generalidade.py`
- `publisher/oe2027_generalidade_test.py`
- `publisher/recortes/og1a/provas.json`

O commit do sítio guarda o relatório e as provas desta paragem. Ficam por fazer a travessia com escrita, o item bilingue, os nomes, as famílias, os lugares, os recibos públicos, as conferências do sítio e a transcrição do `dist/`.

## Custo desta passagem

17 chamadas de ferramentas até escrever este relatório, incluindo o pedido de clarificação; o commit e a inspeção final são posteriores. Três corridas de conferências (ensaio da pesquisa, ensaio do exportador e comparação das gémeas) e três gerações. Nenhuma delegação. `tokens used`: não disponibilizado nesta passagem; os pontos são medidos pelo lançador.

---

# OG1-A: paragem na travessia

A fase A não foi construída. O exportador comum recusou o valor `+79` da linha `og1-utao-novas-saldo`: `cannot read '+79' as a number`. O §2 do mandato exige parar quando uma régua protege um número. Não se retirou o sinal, não se mudou o valor nem se alterou a régua.

O excerto confirmado no §40 da UTAO diz: «O MF prevê que em 2027 as novas medidas de política orçamental tenham um impacto residual no saldo orçamental avaliado em +79 M€ (+0,02% do PIB).» A recusa está em `travessia.registo` e o código em `travessia.codigo`.

## Estado do item e das linhas

O sítio conserva os itens `saude-no-orcamento` e `parcerias-rodoviarias`. Não existe um terceiro item construído nesta passagem. Não houve exportação, novos recibos públicos nem alteração de `src/data/discussao.mjs`. Por isso não há seis partes novas para transcrever do `dist/`, em português ou em inglês.

A preparação selecionou 43 linhas com provas, em `publisher/manifest.og1a.json` e `publisher/recortes/og1a/provas.json`, no motor. `medidas.json` lista os identificadores. São preparação bloqueada, não linhas publicadas. O módulo `publisher.og1a_export` permite reproduzir a preparação; o ensaio recusado foi `python3 -m publisher.export_site_rows --manifest publisher/manifest.og1a.json --site <worktree>`, sem `--write`.

As gémeas previstas no mandato não chegaram a ser usadas pelo item: `pm-q3-3-r37-c3`, `pm-q3-6-r42-c2`, `pm-q3-6-r42-c3`, `oe-2027-cenario-pib-real-crescimento-2027`, `pm-q2-3-r21-c2`, `oe-2027-saude-despesa-efetiva-consolidada-2027` e `pm-q3-2-r8-c0`. A linha existente da Saúde contém 17 803,1 milhões de euros; a pesquisa da UTAO arredonda para 17 803. Um token ligado à linha existente deverá conservar a precisão dessa linha.

## Correções de 26.10

1. `og1-utao-p102` e `og1-utao-emprego-publico-2027`: reextraída a primeira frase completa do §102 na página física 53 do PDF, com o parêntesis e a conclusão sobre o crescimento líquido a partir de junho.
2. `og1-pcp-raimundo`: reextraída a frase inteira da página alojada, desde «Sim, está em curso, de facto,» até «País.».
3. A extração junta «Inovação» antes de conferir os seletores da Tabela 14. Os seletores e o livro foram regenerados; a planta com a palavra partida é recusada.
4. A quarta correção indicada no mandato não tem objeto nesta cabeça: não foram encontrados `og1-eurostat-divida-2025`, `eurostat-pde-2026-10-21` ou `secondary_values` na pesquisa. Existe `og1-eurostat-portugal-2025`, com a tabela nacional. Não se inventou uma correção nem se acrescentaram os valores secundários mencionados no mandato.

A preparação também corrigiu a forma de `attributed_to`: lista com o mesmo nome completo, em vez de texto que o exportador interpretava letra a letra. São 30 atribuições formatadas, seis excertos corrigidos e 34 linhas alteradas no total. Nenhum valor numérico foi alterado. Os corpos e os seus resumos criptográficos permanecem iguais; os recibos de fonte foram relidos. O inventário por linha está em `content/30 Orcamento 2027 Generalidade/correcoes-2026-10-26.json`, no motor, e copiado em `medidas.json`.

## Conferências

| Corrida | Código | Resultado |
| --- | --- | --- |
| `publisher.oe2027_generalidade_test`, inicial | 0 | 82 controlos |
| Ensaio do exportador comum | 1 | Recusa de `+79`; nada escrito no sítio |
| `publisher.oe2027_generalidade` | 0 | Livro reproduzido e manifesto das fontes conferido |
| `publisher.oe2027_generalidade_test --record`, final | 0 | 83 controlos |

`build`, `ledger:check`, `check:registo`, `check:discussao`, `check:lugares`, `typecheck` e `check:cruzamento` não correram: a travessia parou antes de alterar o conteúdo do sítio. `core.gate` não correu. Nenhuma corrida inteira de portões e nenhuma captura. Os códigos ausentes são `null` em `medidas.json`, nunca sucesso presumido.

## Commits e continuação

O motor fica por comitar. O `comitar.sh` disponível transmite apenas mensagem, ficheiros e raiz, sem transmitir `OEDP_GATE=adiado`. A variável não está definida nesta passagem. Não foi possível confirmar a variável do processo do escrivão: a sandbox devolveu `PermissionError: [Errno 1] Operation not permitted: 'ps'`. Não se pediu escalada nem se lançou um commit que pudesse correr o portão contra a condição do mandato.

Ficheiros do motor por comitar:

- `content/30 Orcamento 2027 Generalidade/LEIA-ME.md`
- `content/30 Orcamento 2027 Generalidade/correcoes-2026-10-26.json`
- `content/30 Orcamento 2027 Generalidade/extracoes.json`
- `content/30 Orcamento 2027 Generalidade/ledger.json`
- `content/30 Orcamento 2027 Generalidade/verificacao.json`
- `publisher/manifest.og1a.json`
- `publisher/oe2027_generalidade.py`
- `publisher/oe2027_generalidade_report.py`
- `publisher/oe2027_generalidade_test.py`
- `publisher/og1a_export.py`
- `publisher/recortes/og1a/provas.json`

Cabeça do motor: `82d39267518a6fe4bb156108016df3042b2b85d5`. Cabeça inicial do sítio: `8ee8b7105156e783d2dca5ea825ac5d75dc6cbd9`. O commit do sítio guarda apenas este relatório e as medidas da paragem.

A continuação depende da decisão do lugar de direção sobre a recusa do sinal positivo no exportador. Ficam por fazer a travessia, o item nas duas edições, os nomes, as famílias, os lugares, os recibos, as auditorias, as conferências do sítio e a transcrição das páginas construídas.

A fase B permanece prevista para a noite de 28.10.2026, após o voto, com o registo da votação e as intervenções do Diário. Esta passagem não a realizou nem publicou essa promessa numa página.

## Custo

24 chamadas de ferramentas até fechar este relatório; quatro corridas de conferências e quatro gerações. O commit do relatório e a verificação final são posteriores a esta medição. Nenhuma delegação. Os pontos são medidos pelo lançador.

`tokens used`: 2335135 no último evento de utilização disponível ao escrever o relatório. A medição completa está em `medidas.json`; não é a contagem final do lançador.
