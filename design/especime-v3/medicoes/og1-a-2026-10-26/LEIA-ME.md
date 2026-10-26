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
