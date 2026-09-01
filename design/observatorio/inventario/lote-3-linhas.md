# Lote 3 · Segurança social e pensões (S) e Água (A) · 10 linhas

*Lê primeiro `BRIEF-comum.md` nesta pasta. Pasta de saída: esta. Ficheiros: `lote-3.md` e `lote-3.json`. Modelo: Claude Opus 5. As pistas abaixo são pistas de pesquisa, não afirmações: confirma cada uma na fonte e corrige o que estiver mal. INE sempre em série, com 2 segundos entre pedidos.*

## Contexto útil

Segurança social: o motor da casa (`~/Instruments/ResearchHub/content/11 Seguranca Social/`, só leitura) guarda um bloco de investigação sobre o relatório do Grupo de Trabalho para a Reforma da Segurança Social, com um livro-razão de 55 afirmações (`ledger.json`) que já cita o CFP (Relatório n.º 04/2026 e Publicação Ocasional n.º 02/2024 sobre o FEFSS), o Tribunal de Contas (Relatório n.º 17/2024) e a execução do IGFSS. Podes ler esses ficheiros para os endereços; a verificação desta sessão é tua, na fonte, hoje. A armadilha central do domínio é o perímetro: o saldo da Segurança Social com ou sem os fluxos do FSE e do FEAC, e com ou sem a CGA (o regime dos funcionários públicos, financiado pelo Orçamento do Estado). Cada linha diz o perímetro que o publicador usa.

Água: a casa publica três estudos sobre a água (água não faturada, «Onde está a água», o ciclo de substituição de condutas) com linhas de proveniência ainda por fechar, porque a ERSAR e os sítios da APA (SNIRH) estiveram inacessíveis em agosto. Confirma hoje se respondem, e regista o estado HTTP de cada pedido.

## As linhas

### S1 · Saldo da Segurança Social (execução orçamental do subsector)
- Pergunta: a Segurança Social tem saldo positivo?
- Pista: a Síntese de Execução Orçamental mensal da Direção-Geral do Orçamento (Entidade Orçamental, `https://www.eo.gov.pt` ou `https://www.dgo.gov.pt`), que tem o subsector da Segurança Social; a Conta da Segurança Social anual do IGFSS (`https://www.seg-social.pt`, IGFSS); o CFP como segundo publicador (Relatório n.º 04/2026). Copia a definição do saldo e o perímetro (com ou sem FSE e FEAC; consolidado ou não), a periodicidade e a data da última publicação, o calendário (a DGO publica calendário da Síntese?).
- Comparação: o passado da série (com o perímetro constante).

### S2 · O Fundo de Estabilização Financeira da Segurança Social: valor e meses de despesa com pensões que cobre
- Pergunta: quanto vale a reserva, e quanto tempo de pensões paga?
- Pista: o IGFCSS (Instituto de Gestão de Fundos de Capitalização da Segurança Social) publica relatório e contas e valores mensais ou trimestrais (procura em `seg-social.pt` «IGFCSS» e «FEFSS»); o CFP, Publicação Ocasional n.º 02/2024, analisa o fundo. O limiar legal: a Lei de Bases da Segurança Social (Lei n.º 4/2007) fixa uma reserva mínima de dois anos de despesa com pensões (confirma o artigo e o texto no Diário da República, `diariodarepublica.pt`, versão consolidada). Regista o valor, a data, os meses cobertos tal como o publicador os imprime (nunca calculados por ti), e o limiar.
- Comparação: o limiar legal; o passado.

### S3 · Pensionistas da Segurança Social (N.º) e valor médio das pensões
- Pergunta: quantos pensionistas há, e quanto recebem em média?
- Pista: as «Estatísticas da Segurança Social» do Instituto de Informação/Instituto da Segurança Social (`https://www.seg-social.pt/estatisticas`), séries mensais de pensionistas e de pensões (velhice, invalidez, sobrevivência) e valores médios; o INE redissemina pensionistas por concelho (procura no catálogo do INE «pensionistas» e «segurança social»; há um indicador por 1000 habitantes em idade ativa e talvez o número absoluto por município). Copia as definições, a periodicidade, a última publicação, o calendário (se existir), a licença, e o nível geográfico mais fino. Regista a CGA como regime à parte (a CGA publica as suas próprias estatísticas?).
- Comparação: o passado; por concelho contra o país.

### S4 · Beneficiários do rendimento social de inserção por 1000 habitantes em idade ativa (‰), por concelho
- Pergunta: quantas pessoas dependem da prestação de último recurso?
- Pista: INE `0013420`, a partir do Instituto de Informática (Segurança Social). Copia a definição; regista o desfasamento entre o período de referência e a publicação.

### S5 · Idade normal de acesso à pensão de velhice
- Pergunta: com que idade se acede à pensão?
- Pista: a portaria anual do MTSSS que fixa a idade normal de acesso para o ano seguinte, lida no Diário da República (para 2026, publicada em 2025; para 2027, se já publicada); a regra está no Decreto-Lei n.º 187/2007 (artigo 20.º, ligado à esperança média de vida aos 65 anos, que o INE publica). Copia o texto e o valor (anos e meses).
- Comparação: o passado (a série das portarias); a idade em vigor é o próprio limiar.

### A1 · Água não faturada (%), por entidade gestora e concelho
- Pergunta: quanta água se perde antes de chegar a quem paga?
- Pista: ERSAR, Relatório Anual dos Serviços de Águas e Resíduos em Portugal (RASARP), o volume dos indicadores de qualidade do serviço; o indicador de água não faturada (código provável `AA08` ou próximo; confirma o código e a definição na ficha técnica da ERSAR); dados por entidade gestora em `https://www.ersar.pt` (procura «dados dos indicadores», «RASARP», «open data»). Confirma a última edição publicada, o ano de referência, a periodicidade, a licença ou termos, e como uma entidade gestora se relaciona com um concelho (uma por concelho? multimunicipais?). Regista o estado HTTP do sítio hoje.
- Comparação: o passado; o país (o valor nacional do RASARP); a referência de qualidade que a ERSAR publica (a ERSAR define intervalos de qualidade «bom», «mediano», «insatisfatório» por indicador: copia-os se existirem).

### A2 · Água segura (%), por concelho
- Pergunta: a água da torneira é segura?
- Pista: ERSAR (indicador de água segura, por entidade gestora e por concelho; a ERSAR publica um relatório anual do controlo da qualidade da água para consumo humano) e o INE `0014041` (redisseminação). Copia a definição de «água segura» da ERSAR.
- Comparação: o país; o passado; a referência da ERSAR.

### A3 · Água consumida ou distribuída por habitante (m³/hab.ano), por concelho
- Pergunta: quanta água consumimos?
- Pista: INE, Estatísticas do Ambiente (procura no catálogo «água distribuída/consumida por habitante» ou «consumo de água por habitante», nível município; fontes declaradas INE, ERSAR, ERSARA, DREM). Copia a definição e o último período.
- Comparação: o país; o passado do concelho.

### A4 · Armazenamento das albufeiras (% da capacidade total), no país e por bacia
- Pergunta: quanta água há nas albufeiras?
- Pista: SNIRH, da APA, boletim de armazenamento mensal (`https://snirh.apambiente.pt`; procura «Boletim de Armazenamento» ou «Armazenamento nas albufeiras»); a APA também publica boletins de seca. Confirma se o sítio responde hoje (em agosto estava inacessível), a periodicidade, a data da última publicação, a definição (percentagem do volume total armazenável), a licença.
- Comparação: o passado (a média do mês em anos anteriores, se o boletim a imprimir).

### A5 · Índice de exploração da água (WEI+)
- Pergunta: usamos mais água do que temos?
- Pista: Eurostat `sdg_06_60` (produzido pela Agência Europeia do Ambiente). Copia a definição do WEI+ e o limiar que a AEA associa ao stress hídrico (20 %?), se o publicar; regista a origem do limiar.
- Comparação: os 27; o limiar publicado (se existir); o passado.
