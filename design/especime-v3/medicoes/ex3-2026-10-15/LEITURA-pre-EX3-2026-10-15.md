# A pré-leitura do mandato EX3 pelo Codex `gpt-6-astra` (`xhigh`, só texto), 15.10.2026, 07:44 a 07:57 UTC

*Lançada por `scripts/leituras/ler.sh` sobre uma pasta com o mandato, cinco linhas do livro-razão, o ficheiro da explicação, as frases «o que é» das famílias, a página da definição da NATO (edição de 2025, texto) e as linhas de Portugal das tabelas 1 e 3 do Excel da NATO de 2026. Três Blocking, sete Major e quatro Minor; as emendas aceites pelo lugar de direção estão no mandato (15.10.2026), com as exceções ditas no §7 do mandato. O texto abaixo é a última mensagem do leitor, sem edição.*

## 1. Blocking

O mandato contém instruções incompatíveis com a gramática da página e uma garantia de correção que as fontes não sustentam.

**B1. §3, P1 e P2: os anos estão escritos à mão.**

Citações: «% do PIB em 2025», «% em 2026» e «o Eurostat publica para 2024».

O ficheiro `dinheiro-do-estado-2026.mjs` exige palavras fixas sem algarismos e períodos obtidos por `{ periodo }`. A instrução «o construtor põe-nas como estão» não pode ser cumprida juntamente com essa regra.

Emendas exatas, nas duas línguas:

- «em 2025» → «em {periodo: nato-defesa-portugal-pib-2025}».
- «em 2026» → «em {periodo: nato-defesa-portugal-pib-2026}».
- «para 2024» → «para {periodo: despesa-por-funcao-2024-gf02-pt}».
- «in 2025» → «in {periodo: nato-defesa-portugal-pib-2025}».
- «in 2026» → «in {periodo: nato-defesa-portugal-pib-2026}».
- «for 2024» → «for {periodo: despesa-por-funcao-2024-gf02-pt}».

**B2. §3, final de P1: transcrição e aritmética não demonstram que ambas as contas estão certas.**

Citação: «As duas contas estão certas nos seus termos e não se comparam uma com a outra.»

Os ficheiros permitem conferir a divisão do Orçamento e os valores publicados pela NATO. Não demonstram a exatidão das estimativas nem autorizam uma garantia geral sobre ambas as contas. «Não se comparam» também é excessivo: o problema é a comparação direta destas percentagens.

Substituir por:

> «Estas percentagens têm denominadores diferentes: a despesa efetiva consolidada da administração central e o PIB. Não são diretamente comparáveis.»

Em inglês, substituir «The two figures are right in their own terms and are not comparable with each other.» por:

> «These percentages have different denominators: central administration’s consolidated effective expenditure and GDP. They are not directly comparable.»

**B3. §3 e §4: a definição exigida como literal não é a definição transcrita.**

Citações: «payments made by a government to meet the needs of its armed forces, those of Allies or of the Alliance» e «a definição é a da NATO, palavra por palavra».

O excerto da NATO contém **«national government»** e **«specifically to meet»**. P1 elimina ambos os qualificativos. O construtor não consegue preservar essa frase e cumprir simultaneamente a reprodução literal exigida.

Emenda inglesa:

> «payments made by a national government specifically to meet the needs of its armed forces, those of Allies or of the Alliance»

Emenda portuguesa para a passagem correspondente:

> «os pagamentos feitos por um governo nacional especificamente para satisfazer as necessidades das suas forças armadas, das dos aliados ou da Aliança»

No §4, substituir «a definição é a da NATO, palavra por palavra» por:

> «o excerto inglês da definição reproduz a NATO palavra por palavra; a versão portuguesa é uma tradução fiel desse excerto»

**Quanto ao pedido de encontrar uma afirmação do §0 desmentida pelos ficheiros: não encontrei uma contradição demonstrável nos valores, localizadores, nomes das tabelas ou na citação inicial da definição.** Não proponho uma emenda factual sem a poder justificar.

A conta dá `3 384,9 ÷ 104 249 × 100 = 3,2469376205…`, portanto 3,25. Os localizadores `FUNCIONAL!D3` e `INDICADORES_AC!C5` coincidem com as linhas. O excerto da NATO confirma os valores 6169, 6748, 2.01 e 2.1 nas tabelas indicadas. A soma das dez fatias, os hashes dos documentos originais, as propriedades dos PDFs e a impressão de 2.1 como 2.10 ficam **[verify]** nesta pasta. Isso é falta de verificação, não desmentido.

## 2. Major

**M1. §3, final de P2: compara pesos com denominadores e anos diferentes e descreve falsamente o alcance da página.**

Citação:

> «A proteção social pesa aí mais do que nesta página: esta página conta só a administração central, e a Segurança Social fica fora dela.»

Os 17,1 do Eurostat são percentagem do PIB de 2024. As fatias do Orçamento são percentagem da despesa efetiva consolidada da administração central de 2026. Não se pode concluir «pesa mais» comparando esses números.

Além disso, o ficheiro da explicação contém uma secção de execução que diz expressamente «a administração central e a segurança social tinham gasto». A afirmação sobre «esta página» é falsa. A existência de uma conta separada também não demonstra a causa da diferença entre os valores.

Substituir toda a frase por:

> «Estas percentagens do Eurostat referem-se a {periodo: despesa-por-funcao-2024-gf02-pt} e usam o PIB como denominador. As fatias por função do Orçamento referem-se a {periodo: oe-2026-cem-euros-funcao-02} e usam a despesa efetiva consolidada da administração central. Também diferem o perímetro e a contabilidade.»

Em inglês:

> «These Eurostat percentages refer to {periodo: despesa-por-funcao-2024-gf02-pt} and use GDP as their denominator. The Budget shares by function refer to {periodo: oe-2026-cem-euros-funcao-02} and use central administration’s consolidated effective expenditure. Their coverage and accounting basis also differ.»

Suprimir também o período seguinte do mandato que começa por «A última frase de P2» e termina em «a frase sai e o relatório di-lo». A aceitação por uma auditoria não resolve esta comparação.

**M2. §1.1: o perímetro da NATO e a aplicação da definição de 2025 à série de 2026 ficam sem apoio suficiente.**

Citações: «todas as administrações públicas» e «A definição entra como apoio selado da edição de 2025».

O excerto de 2025 fala em pagamentos de um governo nacional e enumera critérios próprios de inclusão. Não estabelece equivalência com o setor S13 do Eurostat. O Excel de 2026 chama à medida «Core defence expenditure»; o material fornecido não demonstra que a definição de 2025 se aplica integralmente a essa medida.

Substituir, na ressalva das linhas NATO, «todas as administrações públicas» por:

> «o perímetro da definição da NATO, sem o equiparar ao setor S13 do Eurostat»

Acrescentar à instrução sobre a definição:

> «Antes de ligar a definição de 2025 às três linhas de 2026, confirmar na documentação de 2026 a sua aplicação a “core defence expenditure” e selar o apoio dessa ligação. Se essa aplicação não puder ser confirmada, interromper a construção das linhas e identificar a falta no relatório.»

No §0.3, retirar também «a parte de 3,5 % da meta de Haia». A nota fornecida menciona compromissos e uma trajetória da Eslovénia; não basta para documentar essa descrição geral da meta.

**M3. §1.1: a instrução sobre os documentos deixa por decidir como se representa o apoio.**

Citação:

> «se o mecanismo exigir um documento por linha, a edição de 2025 é um segundo documento das três linhas, e o relatório diz como ficou»

«Um documento por linha» pode significar um requisito mínimo ou um limite. Na segunda interpretação, acrescentar outro documento viola o requisito. A pasta não contém o esquema nem um exemplo de ligação entre uma célula de Excel e um excerto de outro documento.

Substituir por:

> «O Excel de 2026 é o documento de origem dos valores. O PDF da definição é um apoio documental distinto. Antes da construção, anexar a este mandato uma declaração válida no esquema existente que mostre como ambos ficam ligados à mesma linha e à parte de frase correspondente. Não criar campos nem alterar o esquema para resolver esta ligação.»

Falta fornecer essa declaração. Não é uma escolha meramente editorial que o relatório possa justificar depois.

**M4. §1.2-b e §3: os rótulos podem mudar por decisão do construtor e há uma divergência entre línguas.**

Citações:

> «se não se renderem em página nenhuma, usa os rótulos portugueses da família tal como o motor os exporta»

> «se diferirem dos escritos aqui, valem os das páginas»

As duas linhas Eurostat fornecidas exportam `name: "Defence"` e `name: "Social protection"`, em inglês. Não contêm os rótulos portugueses anunciados como alternativa. Também não há uma regra para o caso de duas páginas usarem nomes diferentes.

Em P2, o português diz «desporto, recreação, cultura e religião» e o inglês diz «recreation, culture and religion». O inglês não explicita o desporto.

Substituir as instruções de escolha dos rótulos por:

> «Os rótulos de P2 ficam fixados neste mandato, nas duas línguas, e entram por tokens `{ nome }`. Qualquer divergência com os nomes já declarados no projeto é resolvida no mandato antes da construção.»

Para manter o rótulo português prescrito, substituir em P2 EN:

> «recreation, culture and religion»

por:

> «sports, recreation, culture and religion»

Esta emenda alinha a tradução. A confirmação dos dez pares de nomes continua por fazer com o material correspondente.

**M5. §3, P1: a vírgula entre a percentagem e os milhões esconde a diferença entre as tabelas.**

Citação:

> «a NATO estima {claim: nato-defesa-portugal-pib-2025} % do PIB em 2025 e {claim: nato-defesa-portugal-pib-2026} % em 2026, {claim: nato-defesa-portugal-eur-2026} milhões de euros»

A Table 3 diz «Based on 2021 prices» e «Share of real GDP (%)». A Table 1 diz «Current prices». A justaposição sugere uma conversão imediata entre percentagem e montante que os excertos não demonstram. A nota sustenta que os valores são estimativas; «a NATO publica estimativas» também é mais rigoroso do que atribuir à NATO a elaboração da estimativa.

Substituir a frase numérica completa por:

> «Para Portugal, a NATO publica, na tabela a preços constantes, estimativas de {claim: nato-defesa-portugal-pib-2025} % do PIB em {periodo: nato-defesa-portugal-pib-2025} e {claim: nato-defesa-portugal-pib-2026} % em {periodo: nato-defesa-portugal-pib-2026}. Na tabela a preços correntes, publica {claim: nato-defesa-portugal-eur-2026} milhões de euros em {periodo: nato-defesa-portugal-eur-2026}, também como estimativa.»

Em inglês:

> «For Portugal, NATO publishes, in the table at constant prices, estimates of {claim: nato-defesa-portugal-pib-2025} % of GDP in {periodo: nato-defesa-portugal-pib-2025} and {claim: nato-defesa-portugal-pib-2026} % in {periodo: nato-defesa-portugal-pib-2026}. In the table at current prices, it publishes {claim: nato-defesa-portugal-eur-2026} million euros in {periodo: nato-defesa-portugal-eur-2026}, also as an estimate.»

**M6. §2 e §3: o denominador novo ainda omite a consolidação; o título omite também a administração central.**

Citações: «De cada cem euros da despesa efetiva da administração central» e «As dez funções, de cada cem euros da despesa efetiva».

A derivação da linha e a frase «o que é» dizem **despesa efetiva consolidada**. Essa precisão importa especialmente porque o denominador dos ministérios é o total **antes da consolidação**.

Na abertura e em P1, substituir:

> «despesa efetiva da administração central»

por:

> «despesa efetiva consolidada da administração central»

Em inglês, substituir:

> «central administration's effective expenditure»

por:

> «central administration's consolidated effective expenditure»

Substituir os títulos novos por:

> «As dez funções, de cada cem euros da despesa efetiva consolidada da administração central»

> «The ten functions, of every hundred euros of central administration’s consolidated effective expenditure»

**M7. §3, P2: falta uma instrução para conservar a provisoriedade dos valores do Eurostat.**

Citação: «o Eurostat publica para 2024».

As duas linhas fornecidas têm `source_flag: "p"` e «Valor provisório». O mandato exige expressamente a marca de estimativa da NATO, mas não exige que a provisoriedade do Eurostat fique visível nesta apresentação.

Acrescentar:

> «Em P2, os valores de defesa e proteção social conservam a marca de valor provisório declarada nas respetivas linhas, nas duas línguas. A verificação da página confirma que essa marca fica acessível junto dos valores. Não atribuir a mesma marca às restantes funções sem conferir as respetivas linhas.»

## 3. Minor

**m1. §2: manda inserir um parágrafo, mas fornece dois.**

Citação: «Um parágrafo novo na secção “Por função”, logo a seguir à frase que começa “A defesa leva”, com o §3.»

Substituir por:

> «Dois parágrafos novos na secção “Por função”, P1 seguido de P2, imediatamente depois do parágrafo que começa “A defesa leva”.»

**m2. §3, título: “algarismos” não descreve os valores formatados nem os tokens de período.**

Citação: «os tokens rendem só os algarismos, sem unidade».

Substituir por:

> «os tokens `{ claim }` rendem os valores, sem unidade, e os tokens `{ periodo }` rendem os períodos de referência»

**m3. §3, final: a instrução sobre casas decimais só explicita a apresentação portuguesa.**

Citação: «Se a NATO imprimir o valor de 2026 como “2.10”, o token rende “2,10”».

Substituir por:

> «Se a NATO imprimir o valor de 2026 como “2.10”, apresentar “2,10” na edição portuguesa e “2.10” na inglesa, conservando as duas casas decimais.»

**m4. §5: tokens não são símbolos.**

Citação: «a contagem de símbolos pela linha “tokens used”».

Substituir por:

> «o número de tokens indicado na linha “tokens used”»

Quanto a **«casa»**, a palavra não ocorre no mandato. Ocorre em comentários do ficheiro da explicação e das linhas fornecidas. Não é um achado contra a redação deste mandato.

## 4. O veredicto

**Não está pronto para um construtor que não possa perguntar nada.** O construtor teria de resolver conflitos entre reprodução literal e gramática, completar o modelo dos apoios documentais e decidir questões que alteram o significado publicado.

Retiraria a garantia de que ambas as contas estão certas, a comparação «a proteção social pesa aí mais», a afirmação de que a página exclui a segurança social e a referência à meta de Haia sem apoio suficiente.

Faltam as versões definitivas de P1 e P2 compatíveis com a gramática, os dez pares de rótulos confirmados, um exemplo válido da ligação entre documentos e o apoio que permita aplicar a definição de 2025 à medida de 2026. A precisão impressa da NATO fica por conferir nos documentos originais.

O 3,25 está sustentado pela conta fornecida. O mandato precisa de corrigir o que faz esse número, e os restantes, dizerem ao leitor.