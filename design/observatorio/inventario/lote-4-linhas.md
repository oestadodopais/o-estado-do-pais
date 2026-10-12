# Lote 4 · Educação (D) e Saúde (H) · 10 linhas

*Lê primeiro `BRIEF-comum.md` nesta pasta. Pasta de saída: esta. Ficheiros: `lote-4.md` e `lote-4.json`. Modelo: Claude Opus 5. As pistas abaixo são pistas de pesquisa, não afirmações: confirma cada uma na fonte e corrige o que estiver mal. INE sempre em série, com 2 segundos entre pedidos.*

## Contexto útil

O sítio publica já, do Painel Social Europeu, o abandono precoce de educação e formação (`~/Instruments/OEstadoDoPais/ledger/claims/abandono-escolar-precoce-2025.yml`) e as necessidades de cuidados médicos não satisfeitas (`necessidades-medicas-nao-satisfeitas-2025.yml`); lê-as para o endereço exato. Educação: a armadilha é a chave do ano letivo (2023/24 não é 2024), a diferença entre Portugal e Continente nos dados da DGEEC, e a taxa bruta contra a taxa real de pré-escolarização. Saúde: o SNS mede por Unidade Local de Saúde (ULS), o INE por município, e as duas unidades não encaixam; uma medida do SNS nunca se diz «por concelho».

## As linhas

### D1 · Abandono precoce de educação e formação (18 a 24 anos, %)
- Pergunta: quantos jovens deixam a escola cedo?
- Pista: Eurostat `edat_lfse_14` (primário INE, Inquérito ao Emprego); a linha existente. Comparação: a meta europeia de menos de 9 % em 2030 (Resolução do Conselho sobre o Espaço Europeu da Educação; confirma o texto e o endereço); os 27; o passado.

### D2 · Taxa de retenção e desistência no ensino básico (%), por concelho
- Pergunta: quantos alunos ficam retidos?
- Pista: DGEEC (Educação em Números; `https://www.dgeec.medu.pt`) como primário, redisseminada pelo INE (procura no catálogo do INE «retenção e desistência», nível município; confirma o código). Copia a definição da DGEEC, o último ano letivo, a data de publicação, o calendário da DGEEC (a DGEEC publica um calendário de divulgação?), a licença.
- Comparação: o país (Portugal e Continente, os dois valores); o passado do concelho.

### D3 · Taxa bruta de pré-escolarização (%), por concelho; e a participação no pré-escolar a partir dos 3 anos no país
- Pergunta: quantas crianças estão no pré-escolar?
- Pista: DGEEC via INE `0012616` (concelho; o mapa de cobertura de 18.08 registou uma discordância na verificação cega desta linha: lê a metainformação e diz o que a taxa bruta é, e porque pode passar de 100 %); Eurostat `educ_uoe_enra21` (participação dos 3 anos ao início do ensino obrigatório), com a meta de 96 % em 2030 do Espaço Europeu da Educação (confirma).
- Comparação: a meta; os 27; o país e o passado do concelho.

### D4 · População dos 25 aos 34 anos com ensino superior (%)
- Pergunta: quantos adultos jovens têm ensino superior?
- Pista: Eurostat `edat_lfse_03` (idade 25 a 34, ISCED 5 a 8; primário INE). Meta europeia de 45 % em 2030 (confirma).
- Comparação: a meta; os 27; o passado.

### D5 · Alunos de 15 anos com baixo desempenho a matemática (PISA, %)
- Pergunta: como se saem os alunos a matemática?
- Pista: OCDE, PISA 2022 (a nota de país de Portugal e a base de dados; `https://www.oecd.org/en/publications/pisa-2022-results-volume-i_53f23881-en.html` ou a página do país); a meta europeia de menos de 15 % em 2030 (Espaço Europeu da Educação); a Comissão cita-o no Education and Training Monitor. Confirma quando a OCDE publica os resultados do PISA 2025 (o calendário da OCDE) e regista a data.
- Comparação: a meta; a OCDE e os 27; o passado (PISA 2015, 2018, 2022).

### H1 · Esperança de vida à nascença (anos)
- Pergunta: quanto vivemos?
- Pista: Eurostat `demo_mlexpec` (idade `Y_LT1`, sexo `T`; primário INE); o INE publica por NUTS III (procura no catálogo «esperança de vida à nascença» e o nível mais fino). Regista as datas de publicação dos dois.
- Comparação: os 27; o passado; a região contra o país.

### H2 · Utentes inscritos em cuidados de saúde primários sem médico de família atribuído
- Pergunta: quantas pessoas não têm médico de família?
- Pista: Portal da Transparência do SNS, dataset `utentes-inscritos-em-cuidados-de-saude-primarios` (API `https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets/utentes-inscritos-em-cuidados-de-saude-primarios/records`); copia a definição do campo, a periodicidade, a regra de provisoriedade que o portal escreve, a unidade territorial (ULS, ACES), a licença do portal (procura «licença», «termos», «CC»), e a data da última atualização. Diz claramente o nível mais fino e que não há concelho.
- Comparação: o passado da série; a ULS contra o país.

### H3 · Necessidades de cuidados médicos não satisfeitas (autoavaliadas, %)
- Pergunta: quem precisou de cuidados e não os teve?
- Pista: Eurostat `hlth_silc_08` ou `tespm110` (a linha existente; primário INE, ICOR). Regista que há duas bases no Eurostat (as razões incluídas diferem), como o perfil de saúde da Comissão e da OCDE usa outra.
- Comparação: os 27; o passado.

### H4 · Médicas e médicos por 1000 habitantes (N.º), por concelho
- Pergunta: quantos médicos há por mil habitantes?
- Pista: INE `0012837`, Estatísticas do pessoal de saúde (a partir da Ordem dos Médicos). Copia a definição e regista o que o INE diz sobre a residência ou o local de trabalho do médico (a armadilha do concelho).
- Comparação: o país; o passado do concelho.

### H5 · Mortalidade evitável (prevenível e tratável), por 100 000 habitantes
- Pergunta: quantas mortes se teriam evitado?
- Pista: Eurostat `hlth_cd_apr` (mortalit `PRVT` e `TRBL`, unit `RT`, icd10 `TOTAL`). Copia a definição das duas (lista OCDE/Eurostat) e o último ano.
- Comparação: os 27; o passado.
