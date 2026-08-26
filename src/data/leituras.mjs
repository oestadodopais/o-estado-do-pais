/**
 * A leitura do observatório sobre um trabalho.
 *
 * Um trabalho do arquivo tem sempre página (`/estudos/<slug>`). Enquanto essa
 * página só disser o que se sabe do trabalho — título, edições, datas, o
 * documento quando existe — fica fora do índice: não há ali leitura nenhuma
 * (DECISIONS §1.8, §1.19). Quando a leitura for escrita, entra aqui, e é a
 * existência da entrada — não uma preferência num gabarito — que levanta o
 * `noindex` e põe a página no sitemap. O portão de HTML lê esta mesma lista,
 * para que as duas metades da decisão continuem impostas por máquina.
 *
 * AS TRÊS CAMADAS (IDENTIDADE §4), numa página de leitura:
 *   Relance        a medida que faz o trabalho valer a pena
 *   Leitura breve  uma frase do que o trabalho concluiu
 *   Fundo          método, ressalvas, proveniência, e o documento
 *
 * A FRASE É PROSA DA CASA E NÃO PODE ULTRAPASSAR O TRABALHO. Cada uma tem de
 * assentar numa frase impressa nesse trabalho; a frase de origem, com ficheiro
 * e linha, está registada em DECISIONS §1.35 e o campo `origem` abaixo repete-a
 * para quem ler o código. Onde a prosa ia mais longe do que a origem, foi
 * cortada — não enfeitada.
 *
 * NÚMEROS NÃO SE ESCREVEM AQUI, como em todo o lado: só ids de afirmações.
 * `nome` e `v` são pedaços de frase (ver src/components/Frase.astro): onde é
 * preciso um período a que os dados se referem, há `{ ref: … }` — que sai
 * marcado como o que é, e não como uma medição.
 */

export const LEITURAS = {
  /* ----------------------------------------------------------------- 04 */
  'evora-prometido-pago-auditado-2026': {
    medidas: [
      {
        claim: 'evora-prr-aprovado-2026',
        nome: {
          pt: ['€ aprovados e atribuídos ao concelho pelo registo do plano de recuperação'],
          en: ['€ approved and attributed to the municipality by the recovery-plan register'],
        },
      },
      {
        claim: 'evora-prr-pago-2026',
        nome: { pt: ['€ efetivamente pagos'], en: ['€ actually paid'] },
      },
    ],
    /* §6.1 do plano: estas linhas atravessaram com o excerto por confirmar, e
       a página tem de dizer porquê, por palavras, nas duas línguas. O selo ao
       lado delas está a tracejado — é o mesmo marcador, e não uma segunda
       linguagem de incerteza (IDENTIDADE §5.2, §6).

       A ÚLTIMA FRASE SAIU na subetapa 4e (a regra da direção de 21.08.2026):
       dizia «Inventar uma frase seria pior do que mostrar a falta», e isso é o
       cuidado da casa, não um limite do dado. O que fica é o limite: porque é
       que estes dois valores não têm frase para transcrever, e porque é que o
       selo aparece a tracejado. Sem isso, quem visse o selo tracejado lia mal o
       valor ao lado. */
    medidasNota: {
      pt: [
        'Estes dois valores são somas sobre o registo público inteiro do plano de recuperação, não uma linha de um documento. Não há nenhuma frase para transcrever, e por isso o excerto da linha está ',
        { marcador: 'a verificar', gloss: 'to verify' },
        ' e o selo aparece a tracejado.',
      ],
      en: [
        'These two values are sums over the whole public register of the recovery plan, not a line in a document. There is no sentence to transcribe, so the row’s excerpt reads ',
        { marcador: 'a verificar', gloss: 'to verify' },
        ' and the seal shows dashed.',
      ],
    },
    /* Reescrita a 15.08.2026, segunda revisão cruzada. Dizia «a maior parte do
       dinheiro é administrada e recebida fora da câmara» — que é a leitura
       assinada de 04, não uma coisa que os números desta página estabeleçam:
       o que a página mostra é a universidade com mais dinheiro contratado do
       que a câmara, o que prova «mais», não «a maior parte». A leitura de 04
       continua na página, no fundo, atribuída a 04. */
    frase: {
      pt: [
        'Do dinheiro do plano de recuperação contratado no concelho, a universidade tem mais do que a câmara: ',
        { claim: 'evora-prr-universidade-contratado' },
        ' € contra ',
        { claim: 'evora-prr-municipio-contratado' },
        ' €. Da soma aprovada para o concelho, ',
        { claim: 'evora-prr-vencido-quota-2026', sufixo: '%' },
        ' está vencida contra ',
        { claim: 'evora-prr-execucao-2026', sufixo: '%' },
        ' paga.',
      ],
      en: [
        'Of the recovery-plan money contracted in the municipality, the university holds more than the council: ',
        { claim: 'evora-prr-universidade-contratado' },
        ' € against ',
        { claim: 'evora-prr-municipio-contratado' },
        ' €. Of the sum approved for the municipality, ',
        { claim: 'evora-prr-vencido-quota-2026', sufixo: '%' },
        ' is overdue against ',
        { claim: 'evora-prr-execucao-2026', sufixo: '%' },
        ' paid.',
      ],
    },
    origem: {
      onde: 'content/04 Évora Public Money/Évora — Prometido, Pago, Auditado 2026 (pt-PT).md:271, :267',
      pt: 'O endereço da responsabilização, na maior parte dos casos, não são os paços do concelho. · As localizações de projeto vencidas transportam 61,64 % de tudo o que foi aprovado para o concelho.',
      en: 'The accountability address is mostly not the town hall.',
    },
    metodo: [
      {
        k: { pt: 'O que o trabalho conclui daí', en: 'What the work concludes from that' },
        v: {
          pt: ['A universidade tem mais dinheiro contratado neste concelho do que o município, e a camada que administra o dinheiro é feita de organismos nacionais. O trabalho conclui daí que «o endereço da responsabilização, na maior parte dos casos, não são os paços do concelho», é a leitura dele, assinada, e não uma contagem: um leitor que queira este total explicado deve dirigir as perguntas aos organismos nacionais e à universidade mais vezes do que à câmara.'],
          en: ['The university holds more contracted money in this municipality than the council, and the layer that administers the money is made of national bodies. The work concludes from that that «the accountability address is mostly not the town hall», its own signed reading, not a count: a reader who wants this total explained should put questions to national bodies and to the university more often than to the council.'],
        },
        valores: ['evora-prr-universidade-contratado', 'evora-prr-municipio-contratado'],
      },
      {
        k: { pt: 'A parte vencida', en: 'The overdue share' },
        v: {
          pt: ['O valor aprovado em localizações cuja data prevista de conclusão já passou sem conclusão registada.'],
          en: ['The value approved at locations whose planned completion date has passed with no completion recorded.'],
        },
        valores: ['evora-prr-vencido-aprovado-2026'],
      },
      {
        k: { pt: 'O que o trabalho não abre', en: 'What the work does not open' },
        v: {
          pt: ['A secção de auditoria lê o catálogo do tribunal de contas, não as suas auditorias. A secção de contratos é um limite superior sobre uma janela truncada. E não existe um valor da União Europeia para um município: não é que não se tenha encontrado; a granularidade não existe na fonte.'],
          en: ['The audit section reads the state auditor’s catalogue, not its audits. The contracts section is an upper bound on a truncated window. And there is no European Union figure for a municipality: it is not that none was found; the granularity does not exist in the source.'],
        },
        valores: [],
      },
    ],
  },

  /* ----------------------------------------------------------------- 06 */
  'evora-economia-investidores-portas-abertas-2026': {
    medidas: [
      {
        claim: 'evora-vab-empresarial-2024',
        nome: {
          pt: ['€ de valor acrescentado bruto das empresas sediadas no concelho'],
          en: ['€ of gross value added by enterprises headquartered in the municipality'],
        },
      },
      {
        claim: 'evora-concentracao-vab4-2024',
        nome: {
          pt: ['% desse valor está nas quatro maiores empresas'],
          en: ['% of that value sits with the four largest enterprises'],
        },
      },
    ],
    medidasNota: null,
    frase: {
      pt: [
        'Évora está acima da média nacional em poder de compra por habitante, ',
        { claim: 'evora-poder-de-compra-2023' },
        ', dentro de uma região que está abaixo, em ',
        { claim: 'alentejo-central-poder-de-compra-2023' },
        '; e a sua economia empresarial está concentrada em poucas mãos: quatro empresas detêm ',
        { claim: 'evora-concentracao-vab4-2024', sufixo: '%' },
        ' do valor acrescentado do concelho, contra ',
        { claim: 'portugal-concentracao-vab4-2024', sufixo: '%' },
        ' no país.',
      ],
      en: [
        'Évora is above the national average in purchasing power per inhabitant, ',
        { claim: 'evora-poder-de-compra-2023' },
        ', inside a region that sits below it, at ',
        { claim: 'alentejo-central-poder-de-compra-2023' },
        '; and its enterprise economy is concentrated in few hands: four enterprises hold ',
        { claim: 'evora-concentracao-vab4-2024', sufixo: '%' },
        ' of the municipality’s value added, against ',
        { claim: 'portugal-concentracao-vab4-2024', sufixo: '%' },
        ' nationally.',
      ],
    },
    origem: {
      onde: 'content/06 Évora Economy/Évora — Economia, Investidores, Portas Abertas 2026 (pt-PT).md:20, :44',
      pt: 'A própria cidade está acima da média nacional no único indicador que existe ao nível do concelho: o índice de poder de compra do INE de 2023 põe Évora em 111,5 (Portugal = 100), com a sua região em 93,9. · A concentração é o facto estrutural. As quatro maiores empresas detêm 21,5% de todo o VAB empresarial do concelho.',
      en: 'The city itself sits above the national average on the one indicator that exists at municipality level: INE’s 2023 purchasing-power index puts Évora at 111.5 (Portugal = 100), while its own region stands at 93.9.',
    },
    metodo: [
      {
        k: { pt: 'Isto não é PIB municipal', en: 'This is not municipal GDP' },
        v: {
          pt: ['Não existe PIB da cidade, e o trabalho não inventa nenhum. O que existe ao nível do concelho é o registo empresarial: as contas das empresas sediadas no concelho, que creditam toda a atividade de uma empresa ao concelho da sua sede. Não é PIB municipal, e o próprio trabalho escreve porquê nos seus limites: «não capta a administração pública, a maior parte da universidade e do hospital».'],
          en: ['There is no GDP figure for the city, and the work invents none. What exists at municipality level is the business register: the accounts of enterprises headquartered in the municipality, which credit a firm’s whole activity to its head-office municipality. It is not municipal GDP, and the study itself writes why in its own limits: «it misses public administration, most of the university and the hospital».'],
        },
        valores: [],
      },
      {
        k: { pt: 'A única medida que existe ao nível do concelho', en: 'The one measure that exists at municipality level' },
        v: {
          pt: ['O índice de poder de compra do INE é o único indicador que existe para um concelho, e é o que sustenta a primeira metade da frase acima: o concelho de um lado da média nacional, a sua região do outro. A média nacional é a base do índice.'],
          en: ['The statistics institute’s purchasing-power index is the one indicator that exists for a municipality, and it is what carries the first half of the sentence above: the municipality on one side of the national average, its region on the other. The national average is the base of the index.'],
        },
        valores: ['evora-poder-de-compra-2023', 'alentejo-central-poder-de-compra-2023'],
      },
      {
        k: { pt: 'A comparação com o país', en: 'The comparison with the country' },
        v: {
          pt: ['A mesma medida de concentração, para Portugal inteiro, é a que dá escala à do concelho.'],
          en: ['The same concentration measure, for Portugal as a whole, is what gives the municipality figure its scale.'],
        },
        valores: ['portugal-concentracao-vab4-2024'],
      },
      {
        k: { pt: 'O que é inferência, e diz que é', en: 'What is inference, and says so' },
        v: {
          pt: ['As contagens de financiamento são um limite superior: o filtro lê programas, não o corpo dos avisos. E a secção de oportunidades é inferência assinada pelo autor do trabalho, ancorada nos factos com fonte, não aconselhamento.'],
          en: ['The funding counts are an upper bound: the filter reads programmes, not the bodies of the calls. And the opportunity section is inference signed by the work’s author, grounded in sourced facts, not advice.'],
        },
        valores: [],
      },
    ],
  },

  /* ----------------------------------------------------------------- 07 */
  'evora-orcamentado-pago-devido-2025': {
    medidas: [
      {
        claim: 'evora-execucao-da-receita-2025',
        nome: {
          pt: ['% do orçamento foi de facto cobrado no último ano de contas'],
          en: ['% of the budget was actually collected in the latest year of accounts'],
        },
      },
      {
        claim: 'evora-execucao-da-receita-2021',
        nome: { pt: ['% quatro anos antes'], en: ['% four years earlier'] },
      },
    ],
    medidasNota: null,
    frase: {
      pt: [
        'O orçamento de Évora afastou-se do dinheiro que chega, e o aperto aparece nas faturas por pagar e na fila de pagamento, não na dívida legal: ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' dias para pagar a um fornecedor, e ',
        { claim: 'evora-pagamentos-em-atraso-2025' },
        ' € em atraso, com a dívida total ainda abaixo do limite.',
      ],
      en: [
        'Évora’s budget has drifted from the money that arrives, and the strain shows in unpaid invoices and the payment queue, not in the legal debt: ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' days to pay a supplier, and ',
        { claim: 'evora-pagamentos-em-atraso-2025' },
        ' € overdue, with total debt still below the limit.',
      ],
    },
    origem: {
      onde: 'content/07 Évora Municipal Accounts/Évora — Orçamentado, Pago, Devido 2025 (pt-PT).md:456, :452',
      pt: 'O orçamento é uma previsão de esperanças; a taxa de execução é o facto. · O aperto aparece noutro sítio: nas faturas de fornecedores por pagar e na fila de pagamento de 137 dias.',
      en: 'The budget is a forecast of hopes; the execution rate is the fact.',
    },
    metodo: [
      {
        k: { pt: 'De onde vêm as medidas, e as duas vozes de fora', en: 'Where the measures come from, and the two outside voices' },
        v: {
          pt: ['As medidas deste trabalho vêm da prestação de contas do próprio município: o relato da gestão sobre o seu próprio ano. As duas vozes de fora são a opinião assinada do auditor independente e a série anual da Direção-Geral das Autarquias Locais, que publica por município e por ano o mesmo conceito legal de dívida, compilada do lado de fora. As duas estão nesta página.'],
          en: ['This work’s measures come from the municipality’s own accounts: management reporting on its own year. The two outside voices are the independent auditor’s signed opinion and the local-government directorate’s annual series, which publishes per municipality and per year the same legal debt concept, compiled from outside. Both are on this page.'],
        },
        valores: [],
      },
      {
        k: { pt: 'Um ano de contas ficou sem assinatura', en: 'One year of accounts went unsigned' },
        v: {
          pt: ['As contas do penúltimo ano foram rejeitadas em votação e nunca foram certificadas.'],
          en: ['The accounts of the second-to-last year were rejected in a vote and were never certified.'],
        },
        valores: ['evora-contas-2024-votos-favor', 'evora-contas-2024-votos-contra'],
      },
      {
        k: { pt: 'A dívida legal, e o limite contra o qual se lê', en: 'The legal debt, and the limit it is read against' },
        v: {
          pt: ['A frase acima diz que a dívida total ficou abaixo do limite. São estes os dois valores: a dívida total no fim do ano, e o limite legal do mesmo ano, ambos da prestação de contas do município.'],
          en: ['The sentence above says total debt stayed below the limit. These are the two values: total debt at year end, and the legal limit for the same year, both from the municipality’s own accounts.'],
        },
        valores: ['evora-divida-total-2025', 'evora-limite-divida-2025'],
      },
      {
        k: { pt: 'O padrão nacional está atrasado', en: 'The national yardstick lags' },
        v: {
          pt: ['O padrão contra o qual estas contas se comparam está um ano atrás, e o estudo completo que o publica não é público.'],
          en: ['The yardstick these accounts are compared against is one year behind, and the full study that publishes it is not public.'],
        },
        valores: [],
      },
    ],
  },

  /* ----------------------------------------------------------------- 08 */
  'evora-quinze-anos-cinco-mandatos': {
    medidas: [
      {
        claim: 'evora-indice-de-divida-2014',
        nome: {
          pt: ['% de índice de dívida no primeiro ano da série da Direção-Geral das Autarquias Locais'],
          en: ['% debt index in the first year of the local-government directorate’s series'],
        },
      },
      {
        claim: 'evora-indice-de-divida-2024',
        nome: { pt: ['% dez anos depois'], en: ['% ten years later'] },
      },
    ],
    medidasNota: null,
    /* A frase do último mandato foi reescrita a 15.08.2026 depois da revisão
       cruzada: dizia «o desbaste parou», e a dívida que esta mesma página
       mostra continua a cair de 2021 para 2025. O que 08 estabelece com os
       seus números para esse mandato é a fila de pagamento — «a fila voltou a
       alongar-se: 22 dias em 2023 e depois 137 em 2025». É isso que a frase
       passa a dizer. Ver DECISIONS §1.35. */
    frase: {
      pt: [
        'Quinze anos de contas mostram uma dívida herdada que demorou anos a ser medida (',
        { claim: 'evora-divida-31-10-2013' },
        ' € logo a seguir à mudança de executivo, ',
        { claim: 'evora-divida-inicio-mandato-reexpressa' },
        ' € na reexpressão final), uma década a desbastá-la, e um último mandato em que a fila de pagamento se alongou, de ',
        { claim: 'evora-prazo-medio-de-pagamento-2023' },
        ' para ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' dias.',
      ],
      en: [
        'Fifteen years of accounts show an inherited debt that took years to measure (',
        { claim: 'evora-divida-31-10-2013' },
        ' € right after the executive changed, ',
        { claim: 'evora-divida-inicio-mandato-reexpressa' },
        ' € in the final restatement), a decade of grinding it down, and a last term in which the payment queue lengthened, from ',
        { claim: 'evora-prazo-medio-de-pagamento-2023' },
        ' to ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' days.',
      ],
    },
    origem: {
      onde: 'content/08 Évora Mandates/Évora — Quinze Anos, Cinco Mandatos (pt-PT).md:1078-1086',
      pt: 'Uma história, três capítulos. O registo lê-se como um arco contínuo: um município … cuja verdadeira dívida herdada ainda estava a ser descoberta anos depois — €82 871 523 medidos duas semanas após a mudança de executivo de 2013 e €95 082 510 na reexpressão final — e que depois passou uma década a desbastar a montanha … No último mandato o desbaste parou e a fila voltou a alongar-se: 22 dias em 2023 e depois 137 em 2025, com pagamentos em atraso de €4 976 172.',
      en: 'One story, three chapters. … In the last mandate the grind stalled and the queue lengthened again: 22 days in 2023 and then 137 in 2025.',
    },
    metodo: [
      {
        k: { pt: 'Um partido é dono das suas decisões, não de uma curva', en: 'A party owns its decisions, not a curve' },
        v: {
          pt: ['As decisões vão atribuídas a quem as tomou, com o rótulo da lista; os índices são mostrados contra as fronteiras dos mandatos e não são atribuídos a ninguém. Nada do que o trabalho leu fornece o contrafactual que recortaria a parte de um executivo neles.'],
          en: ['Decisions are attributed to whoever took them, with the list label; indices are displayed against the mandate boundaries and are attributed to nobody. Nothing the work read provides the counterfactual that would carve out an executive’s share of them.'],
        },
        valores: [],
      },
      {
        k: { pt: 'A palavra «dívida» muda de sentido ao longo da série', en: 'The word “debt” changes meaning across the series' },
        v: {
          pt: ['O sistema contabilístico mudou por baixo da série, um ano de contas foi publicado em digitalizações e outro não foi publicado de todo. O trabalho marca com um asterisco os valores lidos da coluna comparativa de um relatório posterior, e com uma adaga os recuperados de uma digitalização degradada; nenhum valor marcado assim atravessou para este livro-razão.'],
          en: ['The accounting system changed underneath the series, one year of accounts was published as scans and another was not published at all. The work marks with an asterisk the figures read from a later report’s comparative column, and with a dagger those recovered from a degraded scan; no figure marked either way crossed into this ledger.'],
        },
        valores: [],
      },
      {
        k: { pt: 'O mandato mais recente não é avaliável', en: 'The most recent term is not assessable' },
        v: {
          pt: [
            'O mandato instalado em ',
            { ref: '2025' },
            ' não tem ainda um ano de contas fechado. A página do município mostra-o como está: em funções.',
          ],
          en: [
            'The term installed in ',
            { ref: '2025' },
            ' does not yet have a closed year of accounts. The municipality page shows it as it is: in office.',
          ],
        },
        valores: [],
      },
    ],
  },

  /* ----------------------------------------------------------------- 09 */
  'evora-os-pelouros-quem-os-teve-o-que-fizeram': {
    medidas: [
      {
        claim: 'evora-pelouros-2021-total',
        nome: {
          pt: ['designações de pelouro carregadas por duas pessoas, no mandato de ', { ref: '2021–2025' }],
          en: ['portfolio designations carried by two people, in the ', { ref: '2021–2025' }, ' term'],
        },
      },
      {
        claim: 'evora-pelouros-2025-total',
        nome: {
          pt: ['designações, por três pessoas, no executivo seguinte'],
          en: ['designations, over three people, in the next executive'],
        },
      },
    ],
    medidasNota: null,
    frase: {
      pt: [
        'Os pelouros de Évora ficam, em todos os mandatos que o trabalho conseguiu ler, com a lista do presidente, e as contas do município não são cortadas de maneira que permita dizer quanto gastou cada vereador: no mandato de ',
        { ref: '2021–2025' },
        ', ',
        { claim: 'evora-pelouros-2021-presidente' },
        ' e ',
        { claim: 'evora-pelouros-2021-vice-presidente' },
        ' designações repartidas por duas pessoas; a câmara instalada em ',
        { ref: '2025' },
        ' tem ',
        { claim: 'evora-camara-lugares' },
        ' lugares.',
      ],
      en: [
        'Évora’s portfolios sit, in every term the study could read, with the president’s own list, and the municipality’s accounts are not cut in a way that lets anyone say what each councillor spent: in the ',
        { ref: '2021–2025' },
        ' term, ',
        { claim: 'evora-pelouros-2021-presidente' },
        ' and ',
        { claim: 'evora-pelouros-2021-vice-presidente' },
        ' designations split between two people; the council installed in ',
        { ref: '2025' },
        ' has ',
        { claim: 'evora-camara-lugares' },
        ' seats.',
      ],
    },
    origem: {
      onde: 'content/09 Évora Pelouros/Évora — Os Pelouros, Quem Os Teve, O Que Fizeram (pt-PT).md:498, :17, :11',
      pt: 'O executivo real é mais pequeno do que o eleito. · Todos os pelouros ficam com o bloco que governa. · Nenhuma fonte publica dinheiro por pelouro.',
      en: 'The real executive is smaller than the elected one. · Every pelouro sits with the governing bloc. · No source publishes money per pelouro.',
    },
    metodo: [
      {
        k: { pt: 'Nenhuma fonte publica dinheiro por pelouro', en: 'No source publishes money per portfolio' },
        v: {
          pt: ['A correspondência entre as contas e os pelouros é deste trabalho, declarada por ele como sua e não como oficial, e o próprio trabalho diz quais das suas linhas a recusam. Nenhuma dessas linhas atravessou para o livro-razão, e por isso esta página não conta quantas são. A regra que o trabalho fixa é: descrição, nunca classificações.'],
          en: ['The mapping between the accounts and the portfolios is this work’s own, declared by it as its own and not as official, and the work itself says which of its lines refuse it. None of those lines crossed into the ledger, so this page does not count them. The rule the work sets is: description, never scores.'],
        },
        valores: [],
      },
      {
        k: { pt: 'Um mandato inteiro é uma lacuna declarada', en: 'A whole term is a stated gap' },
        v: {
          pt: [
            'O mandato de ',
            { ref: '2009–2013' },
            ' é «uma linha de um mapa, não um mapa»: o presidente desse mandato, e todos os outros membros dele, não foram identificados. Nada no trabalho assenta nessa linha.',
          ],
          en: [
            'The ',
            { ref: '2009–2013' },
            ' term is “one line of a map, not a map”: the president of that mandate, and every other member of it, were not identified. Nothing in the work is built on that line.',
          ],
        },
        valores: [],
      },
      {
        k: { pt: 'O executivo seguinte, e como se conta', en: 'The next executive, and how it is counted' },
        v: {
          pt: [
            'As designações do executivo instalado em ',
            { ref: '2025' },
            ' estão repartidas por três pessoas, e cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa, conferida linha a linha contra o excerto da própria página.',
          ],
          en: [
            'The designations of the executive installed in ',
            { ref: '2025' },
            ' are split between three people, and each count is the list of portfolios the council’s page assigns to that person, checked line by line against the page’s own excerpt.',
          ],
        },
        valores: [
          'evora-pelouros-2025-presidente',
          'evora-pelouros-2025-vice-presidente',
          'evora-pelouros-2025-vereadora',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  'penalizacoes-por-reforma-antecipada-2026': {
    medidas: [
      {
        claim: 'penalizacao-antecipacao-um-ano-neutra',
        nome: {
          pt: ['de redução da pensão seria atuarialmente neutro, por um ano de antecipação'],
          en: ['pension reduction would be actuarially neutral, for one year of anticipation'],
        },
      },
      {
        claim: 'penalizacao-antecipacao-um-ano-com-factor-2026',
        nome: {
          pt: ['é o que a lei corta a quem não cabe numa das exceções'],
          en: ['is what the law cuts from those who fall outside the exceptions'],
        },
      },
    ],
    medidasNota: {
      pt: [
        'A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão.',
      ],
      en: [
        'For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision.',
      ],
    },
    frase: {
      pt: [
        'A penalização por antecipar a reforma um ano é de ',
        { claim: 'penalizacao-antecipacao-um-ano-sem-factor-2026' },
        ' ou de ',
        { claim: 'penalizacao-antecipacao-um-ano-com-factor-2026' },
        ', consoante a porta por onde o trabalhador entra, quando o valor atuarialmente neutro calculado pelo próprio relatório é de ',
        { claim: 'penalizacao-antecipacao-um-ano-neutra' },
        ': a lei falha nos dois sentidos, e é mais dura com quem se desvia menos.',
      ],
      en: [
        'The penalty for retiring one year early is ',
        { claim: 'penalizacao-antecipacao-um-ano-sem-factor-2026' },
        ' or ',
        { claim: 'penalizacao-antecipacao-um-ano-com-factor-2026' },
        ', depending on which door the worker comes through, when the actuarially neutral figure calculated by the report itself is ',
        { claim: 'penalizacao-antecipacao-um-ano-neutra' },
        ': the law misses in both directions, and is harshest on those who deviate least.',
      ],
    },
    origem: {
      onde: 'content/11 Seguranca Social/Penalizações por Reforma Antecipada em Portugal (pt-PT).html:110, :148, :183',
      pt: 'Consoante a porta por onde o trabalhador entra. · A penalização legal quase nunca coincide com o custo atuarial, e falha nos dois sentidos. · A regra é mais dura com quem se desvia menos.',
      en: 'Depending on which door the worker comes through. · The legal penalty almost never matches the actuarial cost, and misses in both directions. · The rule is harshest on those who deviate least.',
    },
    metodo: [
      {
        k: {
          pt: 'O fator não cai sobre todos',
          en: 'The factor does not fall on everyone',
        },
        v: {
          pt: [
            'O fator de sustentabilidade deixou de ser um ajustamento geral e passou a incidir apenas sobre quem se reforma antecipadamente e não se enquadra nas exceções legais: carreiras muito longas, flexibilização aos ',
            { nl: '60', motivo: 'limiar-do-quadro' },
            ' anos com ',
            { nl: '40', motivo: 'limiar-do-quadro' },
            ' de carreira, profissões de desgaste rápido, invalidez. Quem cabe numa delas escapa-lhe. Quantas pessoas ficam de fora das exceções não se sabe, e o trabalho di-lo: o próprio relatório assinala que não existe base administrativa completa sobre beneficiários e idades efetivas de acesso por regime.',
          ],
          en: [
            'The sustainability factor stopped being a general adjustment and now falls only on those who retire early and do not fall within the legal exceptions: very long careers, flexibility at ',
            { nl: '60', motivo: 'limiar-do-quadro' },
            ' with ',
            { nl: '40', motivo: 'limiar-do-quadro' },
            ' years of contributions, arduous occupations, invalidity. Anyone who fits one of them escapes it. How many people fall outside the exceptions is not known, and the study says so: the report itself records that there is no complete administrative base on beneficiaries and effective ages of access by scheme.',
          ],
        },
        valores: [
          'penalizacao-antecipacao-um-ano-sem-factor-2026',
          'penalizacao-antecipacao-um-ano-com-factor-2026',
        ],
      },
      {
        k: {
          pt: 'A comparação junta duas figuras do relatório',
          en: 'The comparison joins two figures from the report',
        },
        v: {
          pt: [
            'As penalizações legais e o valor neutro vêm de duas figuras diferentes do relatório, a figura ',
            { nl: '8.1', motivo: 'numeracao' },
            ' e a figura ',
            { nl: '8.4', motivo: 'numeracao' },
            ', lidas na mesma base e na mesma convenção cumulativa. A aritmética foi reproduzida antes de ser citada: o corte de um ano sai exatamente do fator de sustentabilidade abaixo, multiplicado pela penalização mensal. O múltiplo entre a penalização legal e a neutra é derivado por esta casa a partir dos números do relatório, e não consta dele.',
          ],
          en: [
            'The legal penalties and the neutral figure come from two different figures in the report, figure ',
            { nl: '8.1', motivo: 'numeracao' },
            ' and figure ',
            { nl: '8.4', motivo: 'numeracao' },
            ', read on the same base and the same cumulative convention. The arithmetic was reproduced before being cited: the one-year cut follows exactly from the sustainability factor below, multiplied by the monthly penalty. The ratio between the legal penalty and the neutral one is derived by this house from the report’s figures, and does not appear in it.',
          ],
        },
        valores: ['factor-sustentabilidade-2026'],
      },
    ],
  },
};

/**
 * Este trabalho já tem leitura do observatório?
 *
 * É a única resposta a essa pergunta no repositório. A página lê-a para saber
 * se se oferece ao índice; o sitemap lê-a para saber se a inclui; o portão de
 * HTML lê-a para impor as duas metades. Uma segunda lista escrita à mão
 * divergiria na primeira leitura nova.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function temLeitura(id) {
  return Object.prototype.hasOwnProperty.call(LEITURAS, id);
}

/** A leitura de um trabalho, ou null. @param {string} id */
export function leituraDe(id) {
  return temLeitura(id) ? LEITURAS[id] : null;
}
