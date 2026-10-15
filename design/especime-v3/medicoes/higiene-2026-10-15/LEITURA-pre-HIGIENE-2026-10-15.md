## 1. Blocking

**B1. §1.1: exige-se um resultado histórico que a I225 não confirma.**

**Citação:** «a prova de que a versão da RH1-d [...] falha o corpus onde a RH1-e passa».

A I225 ainda identifica os seis caracteres como escapando ao índice inverso do detetor. O mandato pressupõe que a RH1-e já passa esses casos. Uma correção nova não pode mudar o comportamento de uma versão histórica.

**Emenda proposta:**

> «O corpus inclui os seis caracteres identificados na I225, e este bloco corrige o detetor para os reconhecer. Reconstruem-se as versões RH1-d e RH1-e e registam-se os resultados efetivamente obtidos por caso, sem pressupor que a RH1-e passa. A versão corrigida tem de reconhecer todos os casos positivos do corpus e conservar os resultados dos testes existentes.»

**B2. §1.2: “deslocar” uma tabela não define um erro de extração.**

**Citação:** «uma fixture do texto de `pdftotext` deslocada de uma coluna e de uma linha como estragos; o teste exige que cada estrago seja apanhado».

Deslocar espaços ou inserir uma linha vazia pode conservar integralmente o significado. Deslocar um valor relativamente ao ano ou à rubrica pode alterá-lo. Não está definido qual destes casos deve passar, nem o que significa «apanhado».

**Emenda proposta:**

> «Cada caso de data declara o texto de entrada e a data esperada. Cada caso de quadro declara o quadro, a rubrica, o ano, a coluna, a unidade e o valor esperado, distinguindo as colunas com e sem PRR. As variantes de disposição que conservem essas associações têm de produzir os mesmos resultados. As plantas que troquem a associação de um valor à rubrica, ao ano ou à coluna têm de fazer falhar o teste. Cada planta identifica a alteração introduzida e o resultado esperado.»

**B3. §1.4: a tolerância e a ligação entre a frase e a conta não estão definidas.**

**Citação:** «recusa a diferença acima do arredondamento declarado da fonte (uma décima nos quadros em milhões com uma casa)».

As páginas fornecidas mostram a precisão dos valores, mas não declaram essa regra de tolerância. No quadro 5.37, `17 803,1 + 3,5 + 51,7 = 17 858,3`, enquanto o total publicado é `17 858,4`. No quadro 4.25, os setores de 2027 somam `1 439`, enquanto o total publicado é `1 438`. Uma tolerância genérica pode aceitar uma igualdade falsa ou apagar uma diferença que deve continuar explicada.

Além disso, conferir uma expressão separada não prova que os seus operandos são os valores efetivamente mostrados na frase.

**Emenda proposta:**

> «Cada conta identifica os tokens efetivamente apresentados ao leitor, as respetivas origens seladas, as unidades, a operação e o resultado calculado. A régua falha se faltar a declaração, se algum token não corresponder à origem declarada ou se a frase apresentar uma igualdade aritmética falsa. Os totais publicados conservam-se mesmo quando diferem da soma das parcelas: nesses casos, a declaração distingue o resultado calculado do total publicado e exige uma ressalva visível da diferença. Não se atribui a diferença a arredondamentos sem apoio da fonte. As quatro contas das parcerias e as contas da Saúde ficam enumeradas, nas duas línguas; a planta troca um token apresentado ao leitor, mantendo a declaração intacta, e tem de falhar.»

**B4. §1.5: a régua não consegue demonstrar o seu próprio conhecido-positivo.**

**Citação:** «dois valores distintos no mesmo relatório» e «o relatório da V2-a-k, que diz “193 plantas” onde o registo diz 192».

O erro descrito está entre o relatório e o registo. Não é necessário que o relatório contenha dois valores. Inversamente, «dez ficheiros do motor» e «vinte ficheiros do observatório» podem ser ambos verdadeiros. A palavra depois do número não identifica uma quantidade.

A exceção por proximidade de uma data também permitiria aceitar uma contradição apenas por esta aparecer num parágrafo datado.

**Emenda proposta:**

> «Cada quantidade conferida é identificada pelo nome, âmbito e período, e ligada ao ficheiro de medição que a sustenta. A régua compara cada ocorrência no relatório com essa medição e compara entre si as ocorrências da mesma quantidade. Quantidades com âmbitos ou períodos diferentes podem ter valores diferentes. Uma data ou as palavras “antes” e “depois” não dispensam a correspondência com as medições. A planta da V2-a-k compara a contagem do relatório com a contagem do registo: falha com 193 quando o registo contém 192 e passa depois da correção.»

**B5. §4: a prova por `meta` não valida a política exigida.**

**Citação:** «uma cópia de `dist/` com a política como `<meta http-equiv>` servida localmente [...] com zero violações na consola».

`frame-ancestors` não é aplicado por uma política entregue em `meta`. A ausência de mensagens também não prova que a política foi aplicada nem que as funcionalidades continuam operacionais.

**Emenda proposta:**

> «Serve-se `dist/` localmente com o cabeçalho HTTP `Content-Security-Policy` que será configurado em `vercel.json`. A prova confirma o cabeçalho recebido e exercita, nas duas edições, a primeira página, um recibo, uma série, um estudo, o Método e as sugestões, num total de doze páginas identificadas no relatório. Confirma-se o funcionamento dos recursos e das interações, a ausência de violações inesperadas e o bloqueio de uma tentativa controlada de enquadramento por outra origem. Testa-se separadamente a incorporação por `incorporar.js` a partir de outra origem. A conferência depois da aterragem mantém-se obrigatória.»

**B6. §5: a primeira corrida não tem o recibo que se manda medir.**

**Citação:** «a V1-39 fecha com a prova real: as duas corridas de 15.10 (as medidas dos recibos [...])».

O próprio mandato e a nota da vigilância dizem que a primeira corrida não escreveu recibo. Também não está nesta pasta o achado 7 da V1, cuja aritmética se pretende provar. As contagens fornecidas são coerentes, `901 + 511 = 1 412` e `1 412 + 12 = 1 424`, mas isso não identifica, por si só, o critério de fecho da V1-39.

**Emenda proposta:**

> «A primeira corrida é documentada pelo seu registo, com a indicação de que não produziu índice nem recibo. A segunda é documentada pelo registo, índice, resumo, recibo e arquivo efetivamente produzidos. Não se reconstituem recibos históricos inexistentes. Antes do lançamento, o pacote identifica os ficheiros concretos das duas corridas e reproduz o critério aritmético do achado 7 da V1. A V1-39 só fecha quando os operandos, a conta e o resultado desse critério forem conferidos nos artefactos reais; sem essa prova, permanece aberta.»

## 2. Major

**M1. §2.1: a substituição integral da ressalva apaga informação verdadeira.**

**Citação:** «A ressalva passa a: PT “Previsão, não execução. Os valores estão [...]”».

A linha `oe-2027-ppp-total-encargos-liquidos-2027.yml` já contém:

> «As linhas setoriais do quadro não somam exatamente o total impresso; o quadro não explica a diferença.»

A substituição prescrita elimina esse aviso nas duas línguas. O quadro 4.25 confirma que ele é necessário.

**Emenda proposta:**

> «Nas quatro linhas das parcerias, conserva-se integralmente o conteúdo atual de `ressalva` e `ressalva_en`. Acrescenta-se em português: “Quando aplicável, os valores incluem IVA à taxa legal em vigor.” Acrescenta-se em inglês: “Where applicable, values include VAT at the legal rate in force.” A alteração faz-se no motor e chega ao livro-razão pelo exportador. Conservam-se os excertos que sustentam os valores; a nota 1 serve de apoio adicional e não substitui as linhas do quadro.»

Isto também evita dois destinos errados: `note` é explicitamente interno, e os ficheiros fornecidos proíbem a edição manual do resultado exportado.

**M2. §2.2: a lista da página 124 é rodoviária, não uma explicação do total de todos os setores.**

**Citação:** «a frase do total [...] “entre as principais componentes que o relatório lista na p. 124 do PDF”».

A página começa por «No setor rodoviário». Acrescentar «entre» resolve a lista fechada, mas não resolve a extensão indevida ao total das parcerias.

**Emenda proposta:**

> «Na página do total, identifica-se expressamente que a enumeração se refere ao setor rodoviário. O segmento português passa a “entre as principais componentes dos encargos e das receitas do setor rodoviário que o relatório enumera na página 124 do PDF”. O segmento inglês passa a “among the main components of road-sector charges and revenue listed in the report on PDF page 124”. Essa enumeração não é apresentada como definição das componentes dos restantes setores.»

Faltam também as substituições inglesas das duas glosas. Acrescentaria:

> «Na edição inglesa, os segmentos finais são “the public partner” e “the subconcessionaires”, sem as glosas explicativas.»

**M3. §2.3: a redação pública fica entregue ao construtor e a falta de definição transforma-se em fecho.**

**Citação:** «se uma passagem definir as duas linhas, sela-a como apoio e a frase diz, nas duas edições, o que ela diz»; «a questão fecha com a razão escrita: a definição é do classificador económico».

A primeira frase manda o construtor escrever conteúdo novo sem texto aprovado. A segunda dá como estabelecida a localização de uma definição que não está demonstrada nesta pasta.

A página 303 apresenta as rubricas e uma nota sobre exclusões entre entidades. Não define, em palavras simples, ativos e passivos financeiros. As páginas 60 e 142 não foram fornecidas.

**Emenda proposta:**

> «Neste bloco, o construtor recolhe eventuais passagens definidoras e apresenta uma proposta literal em português e inglês, acompanhada do excerto e do localizador. As páginas publicadas mantêm-se como estão. A questão permanece aberta até existir uma definição sustentada e uma redação aprovada nas duas línguas. A consulta do classificador económico fica como trabalho pendente, sem afirmar antecipadamente que contém a definição necessária.»

**M4. §1.3: linhas apagadas do código não equivalem a frases retiradas de uma página.**

**Citação:** «as linhas `-` do diff [...] nos campos `name`, `name_en`, `note`, `caveat`, as ressalvas»; «cadeias entre aspas com quarenta caracteres ou mais».

A régua inclui `note`, que os ficheiros dizem não ser publicado. Pode falhar texto curto, texto direto em Astro, texto composto por fragmentos e variantes inglesas não enumeradas. Pode ainda acusar uma frase apenas deslocada ou reformatada.

**Emenda proposta:**

> «A comparação incide sobre o texto visível ao leitor antes e depois da passagem, nas duas edições, independentemente do comprimento e da forma como está escrito no código. Inclui as ressalvas, os excertos e os restantes campos efetivamente apresentados; exclui `note` quando este seja apenas interno. Uma deslocação de código que conserve o mesmo texto visível não conta como retirada. Cada texto retirado é associado no relatório à página, à língua e à decisão correspondente. As plantas incluem uma ressalva portuguesa, uma ressalva inglesa, uma frase com menos de quarenta caracteres e uma deslocação sem alteração do texto.»

**M5. §2.11: o âmbito da proteção da história fica ambíguo e a regra deixa saídas abertas.**

**Citação:** «ficheiros debaixo de `content/*/source/` ou de `motor/` e os `.pdf`, `.html` e `.txt` com mais de duzentos kilobytes que não estejam na cabeça».

Não se diz expressamente em qual dos repositórios se aplica a proibição. O motor tem precisamente a função de alojar fontes. Também não se justifica excluir um corpo de terceiro por ser pequeno ou por continuar na cabeça.

**Emenda proposta:**

> «Esta regra aplica-se à história do repositório do observatório, desde a base da passagem até à cabeça, incluindo a cabeça. Recusa a introdução de `content/*/source/` e de `motor/`. Nos restantes caminhos, a deteção de corpos de terceiros não considera o tamanho nem a permanência na cabeça como autorização. O limiar de tamanho pode servir de triagem, mas não prova a ausência de corpos de terceiros. A nova conferência acrescenta-se à proteção de dados pessoais existente e não a substitui. As plantas cobrem um corpo retirado antes da cabeça, um corpo ainda presente e um corpo inferior ao limiar.»

**M6. §§3 e 8: a medição proposta pode omitir precisamente as dependências que se atualizam.**

**Citação:** «Todos [...] como dependências de construção»; «`npm audit --omit=dev` e `gh api …/dependabot/alerts` [...] antes e depois».

O mandato identifica pelo menos uma dependência direta em `devDependencies`. A auditoria com `--omit=dev` não basta para demonstrar a correção desse conjunto. Além disso, uma consulta ao GitHub depois de uma alteração local, ainda não publicada, não mede o novo ficheiro de dependências.

**Emenda proposta:**

> «Antes e depois da atualização, guarda-se a auditoria completa das dependências, incluindo as de desenvolvimento, e guarda-se separadamente `npm audit --omit=dev`. Para cada alerta inicial, o relatório identifica o manifesto, a dependência afetada, a versão anterior, a versão final e o estado: corrigido, mantido por decisão ou sem correção disponível. A consulta ao GitHub documenta o estado remoto e não serve de prova da correção local antes da publicação. O fecho remoto dos alertas é conferido depois da aterragem. A ausência dos pacotes no código publicado e na função da API é medida, não presumida.»

As versões e os intervalos vulneráveis indicados no mandato ficam **[verify]** nesta pré-leitura: não há nesta pasta os resultados das consultas que os sustentam.

**M7. §5: falta separar o processamento concluído do controlo das transferências.**

**Citação:** «não toca em `estado.json` antes de ter o índice escrito».

Escrever o índice ainda não garante que o resumo, o recibo e o arquivo ficaram completos. Por outro lado, uma transferência efetivamente realizada tem de continuar a contar para o limite diário, mesmo que a escrita dos resultados falhe. O mandato não separa estas duas responsabilidades.

**Emenda proposta:**

> «O estado que marca entradas como processadas só avança depois de o índice, o resumo, o recibo e os ficheiros necessários do arquivo estarem escritos e validados. O registo das transferências efetivamente realizadas mantém-se persistente mesmo quando essa conclusão falha, preservando o limite diário. Uma retoma reutiliza os dados já obtidos quando estes estejam disponíveis. A prova inclui falhas na escrita do índice, do resumo e do recibo, seguidas de retoma, sem perda de entradas nem repetição indevida da transferência.»

Também mudaria a mensagem prescrita.

**Citação:** «a fonte já foi lida hoje».

Uma transferência anterior não prova que os dados foram interpretados e usados com sucesso.

**Emenda proposta:**

> «O limite diário de transferência desta fonte já foi atingido. Nesta corrida não houve nova transferência.»

Se houver reutilização comprovada, acrescentar:

> «Foram reutilizados os dados da transferência anterior.»

**M8. §2: uma razão para adiar não fecha a questão, e falta a alavanca 3.**

**Citação:** «Cada questão fecha-se com a correção [...] ou com a razão escrita de ficar».

A I225 inclui a comparação entre retoma e arranque a frio, atribuída à V2-b. O mandato não a executa nem a inclui nos adiamentos. EX1-11, DAR, caminhos protegidos e eventual definição financeira também não ficam resolvidos por terem uma justificação de adiamento.

**Emenda proposta:**

> «Cada item fica classificado como corrigido, adiado ou não reproduzido, com a prova correspondente. A razão para adiar não fecha o item. Acrescenta-se aos trabalhos adiados a comparação entre retoma e arranque a frio para a mesma correção, atribuída à V2-b. A I225 conserva uma lista explícita dos itens pendentes e não é dada como integralmente fechada enquanto esses itens não estiverem resolvidos ou formalmente encaminhados para questões próprias.»

**M9. §2.7 e §2.8: acrescentar um comando plausível não reconstitui uma medição histórica.**

**Citação:** «As medições [...] ganham o comando no `medidas.json`»; «o comando escreve-se no `medidas-e.json`».

O texto permite preencher retroativamente o comando sem provar que foi esse comando que produziu o ficheiro. Isso não resolve a falta de proveniência identificada pela I225.

**Emenda proposta:**

> «Um comando histórico só é acrescentado quando um registo da execução o ligar ao ficheiro medido. Quando essa ligação não puder ser demonstrada, a medição é marcada como não reconstituída. Uma nova execução produz uma medição nova, com data e comando próprios, e não é apresentada como prova da execução antiga. Se a medição antiga sair do relatório, a retirada fica citada e justificada.»

**M10. §1.6 e §8: falta definir quem fecha a entrega depois de o lançador escrever os custos.**

**Citação:** «no fim de cada passagem, acrescentam ao relatório do bloco»; «os [...] portões [...] na cabeça final».

Se o relatório for alterado depois do último commit e dos portões, a entrega deixa de corresponder ao estado verificado. O teste que apenas verifica a presença da secção também não prova que os números vieram da execução correta.

**Emenda proposta:**

> «Depois de o processo do construtor terminar, o lançador usa a rotina atualizada para guardar a saída de `pontos.py`, com os parâmetros efetivos, o código de saída e a identificação da passagem. A escrita é idempotente: uma retoma não duplica a mesma medição. O relatório e a prova são incluídos num commit por `comitar.sh`, e os portões finais correm sobre esse estado. A cabeça do código fica no relatório; a cabeça final da entrega fica num recibo externo ao commit que identifica. A planta confere a correspondência entre a secção e a saída guardada, incluindo uma segunda execução sem duplicação.»

## 3. Minor

**m1. Abertura e §§0, 3, 4, 6, 7 e 8: o projeto nomeia-se repetidamente com vocabulário excluído.**

**Citações:** «o sítio e o motor»; «pelo cliente da casa»; «A casa continua a publicar 2025-12».

**Emendas propostas:**

> «o observatório e o motor»

> «pelo cliente HTTP do motor»

> «O observatório continua a publicar 2025-12»

Nas restantes ocorrências da prosa do mandato, substituir «sítio» por «observatório». Esta correção não autoriza alterações a citações literais das fontes nem a identificadores técnicos.

**m2. §0, §2.4 e §4: três correções de redação.**

**Citação:** «Os números do relatório lêem-se dos ficheiros».

**Emenda proposta:**

> «Os números do relatório leem-se dos ficheiros».

**Citação:** «onde a V2-a o rende».

**Emenda proposta:**

> «onde a V2-a o apresenta».

**Citação:** «as imagens, os tipos».

**Emenda proposta:**

> «as imagens, os tipos de letra».

**m3. Abertura: a descrição do âmbito contradiz o próprio mandato.**

**Citação:** «o bloco é mecânico e só muda o que as páginas dizem onde o §2 escreve as frases».

O §6 altera o aviso de atraso apresentado nas páginas, e o §5 altera o conteúdo dos resumos. O §2.3 também não contém as frases que eventualmente seriam publicadas.

**Emenda proposta:**

> «O bloco inclui correções de texto, novas verificações automáticas, atualização de dependências e alterações à vigilância. As alterações de conteúdo público abrangem as frases aprovadas do §2, os resumos da vigilância do §5 e o aviso de atraso do §6.»

## 4. O veredicto

**Não está pronto para um construtor que não pode perguntar nada.** Há critérios de aceitação incompletos, uma prova tecnicamente insuficiente, um recibo histórico inexistente e decisões de conteúdo ainda entregues ao construtor.

Não encontrei adulteração na citação da nota 1 do quadro 4.25: coincide com o texto fornecido, normalizando apenas espaços e quebras de linha. Também não encontrei divergência de sentido nos pares português/inglês efetivamente escritos no §2. O problema é a informação que a substituição apagaria, o âmbito rodoviário que fica implícito e as frases que ainda não estão escritas.

**Tiraria:**

- A obrigação de fazer a versão histórica RH1-e passar um corpus que inclui problemas ainda listados como abertos.
- A tolerância aritmética apresentada como se tivesse sido declarada pela fonte.
- A prova da política de segurança por `meta`.
- A redação autónoma das definições financeiras neste bloco.
- O fecho de questões apenas por terem uma razão de adiamento.

**Falta:**

- Fixar as emendas públicas em ambas as línguas, preservando a ressalva do total e os excertos dos valores.
- Definir entradas, resultados esperados e condições de falha das réguas.
- Fornecer os artefactos reais da vigilância e o critério exato da V1-39.
- Medir as dependências de desenvolvimento e distinguir correção local de fecho remoto.
- Explicitar os itens que continuam abertos e a sequência de fecho da entrega.

A I223 continua fora deste bloco. A I224 é uma condição anterior de arranque. Nenhuma deve aparecer como resolvida pela higiene.