# Adenda F ao mandato EV2: as correções da leitura a frio (30.10.2026, 19:46 UTC)

Acrescenta: frases

*A mesma sessão, as mesmas worktrees (o sítio com `main` fundida, EV2-9; o motor em db5edb2). Escrita pelo lugar de direção do dia (Claude Opus 5.5) a 30.10.2026 à tarde, com a fonte aberta. A leitura a frio do Opus (16:24 a 16:37 UTC) apanhou as cinco plantas e deixou os achados 6, 7, 8, 9, 14 e 15, que esta adenda corrige; o 9 (o corpo alojado no pacote) é do lugar de direção.*

## §0 O que o lugar de direção leu na fonte (30.10.2026)

A fonte é `PRESTACAO_CONTAS_2025.pdf` do Município de Évora (a cópia do motor em `content/07 Évora Municipal Accounts/Technical Source/raw/pdfs/`, sha256 `e63102753216d573a3cd…`, o resumo que as figuras novas declaram), lida por `pdftotext -layout`:

1. **p. 110, «Quadro 5 – Resumo das Modificações ao OM/2025»**, colunas «Dot. Iniciais» e «Dot.Corrigidas»: «TOTAL 104 000 000,00 109 483 314,95»; «Outras Receitas Correntes 19 427 778,00 19 427 778,00»; «Total Receitas Correntes 86 209 991,00 86 209 991,00». A linha «Outras Receitas Correntes» não foi modificada: o seu orçamento é o mesmo inicial e corrigido.
2. **p. 113, «Quadro 8 – Execução das Receitas Correntes»**, colunas «Orçamento», «Execução», «%»: «Outras Receitas Correntes 19 427 778,00 155 572,72 0,80%»; «Total 86 209 991,00 58 217 062,73 67,53%». Com o ponto 1, o «Orçamento» deste quadro é o corrigido: os 45,6 % comparam medidas iguais (confirma a inferência da leitura, achado 9).
3. **p. 122**, a seguir ao "Quadro 17 – Execução das Despesas de Capital": "A rubrica aquisição de bens de capital, com uma execução de 21%, é influenciada negativamente pelo atraso verificado nos projetos orçamentados e que se prevêm obter financiamento no âmbito do PRR. Também a dificuldade na adjudicação de algumas obras, em resultado de procedimentos de concurso que têm ficado desertos, explicam, em parte, a baixa execução nesta rubrica". (Citação da fonte entre aspas retas, tal como a fonte a escreve.)
4. **p. 124, «Quadro 18 – Evolução das Despesas de Capital»**, colunas 2022 a 2025: «Aquisição de Bens de Capital 4 913 568,24 3 246 821,75 4 752 426,65 5 104 306,91»; e, por baixo: «A rubrica aquisição de bens de capital, que concentra os investimentos do Município, inscreve em 2025 um valor superior, em 7%, ao registado em 2024».
5. **O estudo já diz a ressalva de 2024 com as suas palavras** (o gabarito português, linha 43): «As contas de 2024 nunca foram certificadas, e os valores de 2024 são os que o relatório de 2025 imprime como comparativos.»

## §1 As frases (palavra por palavra; os tokens são os do gabarito)

1. **O resumo** (gabarito pt, linha 20; en, linha 21): o troço «e o mecanismo está nas próprias contas:» passa a «e as próprias contas mostram o padrão que, nesta leitura, explica essa queda:»; en: «and the mechanism is in the accounts themselves:» passa a «and the accounts themselves show the pattern that, in this reading, explains that fall:». O resto da frase fica.
2. **A passagem 1** (pt, linha 22; en, linha 23), inteira:
   - pt: «Nesta leitura das contas, quando a receita desilude, é a execução do investimento que cede. Em 2025 as despesas com pessoal executaram a ⟦07:pessoal-exec-pct⟧%, as amortizações de empréstimos a ⟦07:amortizacoes-exec-pct⟧% e o investimento a ⟦07:invest-exec-pct⟧%; em valor pago, o investimento subiu ⟦16:invest-var-2024-2025⟧% face ao valor de 2024 que o relatório de 2025 imprime como comparativo, porque as contas de 2024 nunca foram certificadas. As duas primeiras são contratuais; a terceira pode adiar-se.»
   - en: «In this reading of the accounts, when revenue disappoints, it is the execution of investment that gives. In 2025 staff costs executed at ⟦07:pessoal-exec-pct⟧%, loan amortisation at ⟦07:amortizacoes-exec-pct⟧% and investment at ⟦07:invest-exec-pct⟧%; in money paid, investment rose ⟦16:invest-var-2024-2025⟧% on the 2024 value that the 2025 report prints as a comparative, because the 2024 accounts were never certified. The first two are contractual; the third can be postponed.»
3. **A frase dos 45,6 %** (pt, linha 65; en, linha 66), a segunda frase da troca:
   - pt: «A diferença entre o que se orçou e o que se cobrou nessa linha é ⟦16:outras-rec-correntes-quota-falta⟧% dos ⟦16:receita-falta-2025⟧ euros que faltaram à receita de 2025 face ao orçamento corrigido, que é o orçamento municipal depois das modificações que a prestação de contas resume.»
   - en: «The difference between what was budgeted and what was collected on that line is ⟦16:outras-rec-correntes-quota-falta⟧% of the ⟦16:receita-falta-2025⟧ euros by which 2025 revenue fell short of the corrected budget, which is the municipal budget after the modifications that the accounts summarise.»
4. **A passagem do relatório sobre a execução** (pt, a troca que hoje diz «O relatório atribui a execução a atrasos em projetos que esperavam PRR e a concursos públicos que ficaram desertos; é a explicação do próprio relatório.»; en, linha 72):
   - pt: «O relatório diz que essa execução é influenciada negativamente pelo atraso dos projetos orçamentados à espera de financiamento do PRR, e que a dificuldade em adjudicar obras cujos concursos ficaram desertos a explica em parte.»
   - en: «The report says that execution is held back by the delay in projects budgeted in expectation of PRR funding, and that the difficulty of awarding works whose tenders attracted no bidders partly explains it.»

## §2 A data, a contagem e o pacote

- A data da edição volta a 01.10.2026 (a primeira publicação), nas duas edições, e a atualização entra por `updated` com a data do dia da aterragem, 30.10.2026 (se a aterragem escorregar, o lugar de direção muda esta data numa linha antes de aterrar), pela forma dos estudos de Évora que já a usam («publicado a … · atualizado a …»); o cartão da primeira página segue o que a regra das novidades fizer com `updated`, e diz-se qual.
- O comentário da R7 em `publisher/export_records_test.py`: «219 em cada edição do 16» passa a «221 em cada edição do 16», com a data.
- (Do lugar de direção, não teu.) O pacote da leitura curta leva o corpo alojado do relatório de contas de 2025 (o PDF do §0, pelo seu sha256) e as páginas 110, 113, 122 e 124 em texto; e leva o diff da prova do texto lido (`EV2-7`, `EV2-8`: o leitor de YAML e o âmbito de 14 para 18 edições), que a leitura a frio não viu.

## §3 O fim

Um só commit no motor com as frases todas e o comentário da R7 (o escrivão não passa `OEDP_GATE=adiado`, e o gancho corre o `core.gate` em cada commit do motor: um commit, uma corrida), a recomposição do estudo 16 e a travessia para o sítio num commit do sítio; depois os três portões do sítio pelo escrivão uma vez. Sessenta minutos, noventa chamadas. Paras e dizes se uma frase do §1 for apanhada por um marcador da voz (diz qual; muda a frase, não a lista) ou se a composição recusar um token.
