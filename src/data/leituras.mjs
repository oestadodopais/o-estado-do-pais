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
    /* A NOTA DAS MEDIDAS FICA COM O QUE MUDA A LEITURA DE UM NÚMERO (G6, decisão
       do diretor de 26.08.2026). Ficam duas coisas: que estes dois valores são
       somas sobre um registo inteiro e não linhas de um documento, e o que
       «vencido» quer dizer, que é uma palavra do dia a dia com outro sentido
       aqui. Saiu a oração sobre o excerto por confirmar e o selo tracejado: é o
       sítio a explicar a sua própria marca de incerteza, e ela tem página
       própria, `/a-verificar`, à distância do selo.

       A camada «Método e ressalvas» saiu inteira desta página, com as outras
       cinco: ver a tabela de `design/especime-v3/notas/grelha-da-voz.md`. */
    medidasNota: {
      pt: [
        [
          'Estes dois valores são somas sobre o registo público inteiro do plano de recuperação, e não uma linha de um documento. Vencido é o valor aprovado em localizações cuja data prevista de conclusão já passou sem conclusão registada.',
        ],
      ],
      en: [
        [
          'These two values are sums over the whole public register of the recovery plan, and not a line in a document. Overdue is the value approved at locations whose planned completion date has passed with no completion recorded.',
        ],
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
  },

  /* ----------------------------------------------------------------- 06 */
  'evora-economia-investidores-portas-abertas-2026': {
    medidas: [
      {
        claim: 'evora-vab-empresarial-2024',
        nome: {
          pt: ['€ de valor acrescentado bruto das empresas do concelho'],
          en: ['€ of gross value added by enterprises in the municipality'],
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
    /* AS RESSALVAS QUE SOBREVIVEM VIVEM NA NOTA DAS MEDIDAS (G6, decisão do
       diretor de 26.08.2026). A camada «Método e ressalvas» saiu das páginas de
       trabalho: o método vive no Método e no recibo de cada linha. Uma ressalva
       só fica quando muda a leitura de um número desta página, e então fica como
       UMA frase, com o facto por sujeito. As que saíram estão na tabela de
       `design/especime-v3/notas/grelha-da-voz.md`, uma a uma, com a razão. */
    medidasNota: {
      pt: [
        [
          'As contas das empresas do concelho creditam toda a atividade de uma empresa a um único concelho, e não são um produto interno bruto municipal. A média nacional é a base do índice de poder de compra.',
        ],
      ],
      en: [
        [
          'The accounts of the municipality’s enterprises credit a firm’s whole activity to a single municipality, and are not a municipal gross domestic product. The national average is the base of the purchasing-power index.',
        ],
      ],
    },
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
    /* AS RESSALVAS QUE SOBREVIVEM VIVEM NA NOTA DAS MEDIDAS (G6, decisão do
       diretor de 26.08.2026). A camada «Método e ressalvas» saiu das páginas de
       trabalho: o método vive no Método e no recibo de cada linha. Uma ressalva
       só fica quando muda a leitura de um número desta página, e então fica como
       UMA frase, com o facto por sujeito. As que saíram estão na tabela de
       `design/especime-v3/notas/grelha-da-voz.md`, uma a uma, com a razão. */
    medidasNota: {
      pt: [
        [
          'As contas do penúltimo ano foram rejeitadas em votação e nunca foram certificadas.',
        ],
      ],
      en: [
        [
          'The accounts of the second-to-last year were rejected in a vote and were never certified.',
        ],
      ],
    },
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
    /* AS RESSALVAS QUE SOBREVIVEM VIVEM NA NOTA DAS MEDIDAS (G6, decisão do
       diretor de 26.08.2026). A camada «Método e ressalvas» saiu das páginas de
       trabalho: o método vive no Método e no recibo de cada linha. Uma ressalva
       só fica quando muda a leitura de um número desta página, e então fica como
       UMA frase, com o facto por sujeito. As que saíram estão na tabela de
       `design/especime-v3/notas/grelha-da-voz.md`, uma a uma, com a razão. */
    medidasNota: {
      pt: [
        [
          'O sistema contabilístico mudou por baixo da série, um ano de contas foi publicado em digitalizações e outro não foi publicado de todo.',
        ],
      ],
      en: [
        [
          'The accounting system changed underneath the series, one year of accounts was published as scans and another was not published at all.',
        ],
      ],
    },
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
    /* AS RESSALVAS QUE SOBREVIVEM VIVEM NA NOTA DAS MEDIDAS (G6, decisão do
       diretor de 26.08.2026). A camada «Método e ressalvas» saiu das páginas de
       trabalho: o método vive no Método e no recibo de cada linha. Uma ressalva
       só fica quando muda a leitura de um número desta página, e então fica como
       UMA frase, com o facto por sujeito. As que saíram estão na tabela de
       `design/especime-v3/notas/grelha-da-voz.md`, uma a uma, com a razão. */
    medidasNota: {
      pt: [
        [
          'Cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa.',
        ],
      ],
      en: [
        [
          'Each count is the list of portfolios the council’s page attributes to that person.',
        ],
      ],
    },
    frase: {
      pt: [
        'Os pelouros de Évora ficam com a lista do presidente nos mandatos em que a câmara publica a repartição, e as contas do município não são cortadas de maneira que permita dizer quanto gastou cada vereador: no mandato de ',
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
        'Évora’s portfolios sit with the president’s own list in the terms for which the council publishes the split, and the municipality’s accounts are not cut in a way that lets anyone say what each councillor spent: in the ',
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
        [
          'A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão.',
        ],
        /* O FATOR VOLTA À PÁGINA, COM O SEU SELO (I75, 27.08.2026). O valor só
           se rendia na ressalva «A comparação junta duas figuras do relatório»,
           que o G6 retirou por ser proveniência e derivação; com ela saiu da
           superfície pública uma linha do livro-razão, e uma linha com um número
           é conteúdo. Volta como UMA frase, com o facto por sujeito, e leva as
           palavras da ressalva que saiu e mais nenhumas: o que saiu foi a metade
           da diligência («A aritmética foi reproduzida antes de ser citada») e o
           nome das duas figuras do relatório, que é proveniência e vive na linha.
           A conta foi conferida antes de a frase ficar: a regra do relatório,
           escrita na p. 234 e citada na nota da linha da penalização com fator, é
           F = FS (1 − 0,005 M); com FS = 0,8237 e M = 12, dá 0,774278, isto é uma
           redução de 22,57 %, e a linha publica 22,6 %. */
        [
          'O corte de um ano sai do fator de sustentabilidade, ',
          { claim: 'factor-sustentabilidade-2026' },
          ', multiplicado pela penalização mensal.',
        ],
      ],
      en: [
        [
          'For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision.',
        ],
        [
          'The one-year cut follows from the sustainability factor, ',
          { claim: 'factor-sustentabilidade-2026' },
          ', multiplied by the monthly penalty.',
        ],
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
