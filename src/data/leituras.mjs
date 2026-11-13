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

import { getClaim } from '../lib/ledger.mjs';
import { unidadeDaLinha } from '../i18n/unidades.mjs';
/** @param {string} id @param {string} lang */
const unidade = (id, lang) => unidadeDaLinha(getClaim(id).unit, lang).texto;

/* OS TERMOS EXPLICADOS (bloco K2, 02.10.2026, item 7 do brief; I182). Três termos das leituras dos estudos não diziam
   a um leitor comum o que são, e as frases ganham a explicação sem mudar um número nem a origem registada de cada uma
   (o campo `origem` fica como estava). Cada explicação assenta numa frase do próprio estudo:
     · a designação de pelouro: «Um pelouro é uma atribuição política feita por despacho do presidente» (os dois
       documentos dos pelouros, `studies-src/evora-quem-governou-a-camara-2009-2025/pt.html` e
       `studies-src/evora-os-pelouros-quem-os-teve-o-que-fizeram/pt.html`), com as áreas que as listas de pelouros
       nomeiam (as finanças, a habitação, a cultura);
     · a localização de projeto vencida: «uma linha por localização de projeto» do ficheiro de distribuição geográfica,
       e «uma data prevista de conclusão já passada à data do instantâneo, sem data efetiva de conclusão registada»
       (`studies-src/evora-economia-e-dinheiro-publico-de-fora-da-camara/pt.html`, a secção «O que significa «dentro do
       prazo» nestes dados, e o que está vencido»);
     · o valor atuarialmente neutro e as duas portas: «Quem sai um ano antes é penalizado em 2,75 vezes a redução
       neutra», «Sem o fator de sustentabilidade, a penalização é sempre inferior à neutra» e «Com o fator de
       sustentabilidade, a penalização de um ano é de 22,6%»
       (`studies-src/penalizacoes-por-reforma-antecipada-2026/pt.html`). */
import { WORKS } from './studies.mjs';

export const LEITURAS = {
"orcamento-2027-o-que-muda-e-para-quem": {
  "medidas": [
    {
      "claim": "pm-q3-6-r42-c3",
      "nome": {
        "pt": [
          "de dívida pública em ", { ref: '2027' }, ", pela proposta de Orçamento"
        ],
        "en": [
          "public debt in ", { ref: '2027' }, ", by the Budget proposal"
        ]
      }
    },
    {
      "claim": "der-oe2027-medidas-novas-saldo",
      "nome": {
        "pt": [
          "é o que as três medidas novas de ", { ref: '2027' }, " valem para o saldo"
        ],
        "en": [
          "is what the three new measures of ", { ref: '2027' }, " are worth to the balance"
        ]
      }
    }
  ],
  "frase": {
    "pt": [
      "As medidas novas do Orçamento de ", { ref: '2027' }, " valem ",
      {
        "claim": "der-oe2027-medidas-novas-saldo"
      },
      " milhões de euros a favor do saldo, as dez linhas marcadas como invariantes pesam ",
      {
        "claim": "der-oe2027-medidas-anteriores-saldo", "abs": true
      },
      " milhões, e os juros sobem ",
      {
        "claim": "der-oe2027-juros-variacao-cp"
      },
      " milhões: o que mais muda nas contas de ", { ref: '2027' }, " não está no quadro das medidas."
    ],
    "en": [
      "The new measures of the ", { ref: '2027' }, " Budget are worth ",
      {
        "claim": "der-oe2027-medidas-novas-saldo"
      },
      " million euros to the balance, the ten lines the table marks as «invariante» (invariant) weigh ",
      {
        "claim": "der-oe2027-medidas-anteriores-saldo", "abs": true
      },
      " million, and interest rises ",
      {
        "claim": "der-oe2027-juros-variacao-cp"
      },
      " million: what changes most in the ", { ref: '2027' }, " accounts is not in the table of measures."
    ]
  },
  "origem": {
    "onde": "content/27 Orcamento 2027 O que muda/, abertura das duas edições",
    "pt": "O Orçamento para 2027 muda pouco por si próprio.",
    "en": "The 2027 Budget changes little by itself."
  }
},

  "a-casa-em-portugal-e-na-europa": {
    "medidas": [
      {
        "claim": "der-hab-preco-rendimento-2015-2025-pt",
        "nome": {
          "pt": [
            "é quanto subiu em Portugal, de ",
            {
              "ref": "2015"
            },
            " a ",
            {
              "ref": "2025"
            },
            ", o rácio entre os preços das casas e o rendimento, a maior subida da União"
          ],
          "en": [
            "is how much the ratio of house prices to income rose in Portugal from ",
            {
              "ref": "2015"
            },
            " to ",
            {
              "ref": "2025"
            },
            ", the largest rise in the Union"
          ]
        }
      },
      {
        "claim": "sobrecarga-do-custo-da-habitacao-2025",
        "nome": {
          "pt": [
            "da população gasta mais de quarenta por cento do rendimento na casa"
          ],
          "en": [
            "of the population spends more than forty percent of income on housing"
          ]
        }
      },
      {
        "claim": "sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025",
        "nome": {
          "pt": [
            "dos inquilinos a preços de mercado gastam mais de quarenta por cento do rendimento na casa"
          ],
          "en": [
            "of tenants at market rents spend more than forty percent of their income on housing"
          ]
        }
      }
    ],
    "frase": {
          "pt": [
                "Descontada a inflação, os preços das casas em Portugal subiram desde ",
                {
                      "ref": "2015"
                },
                " mais do que em qualquer outro país da União; ",
                {
                      "claim": "sobrecarga-do-custo-da-habitacao-2025",
                      "sufixo": " %"
                },
                " da população gasta na casa mais de quarenta por cento do rendimento, contra ",
                {
                      "claim": "sobrecarga-do-custo-da-habitacao-2025-ue",
                      "sufixo": " %"
                },
                " na União, e o peso cai sobre quem arrenda a preços de mercado, ",
                {
                      "claim": "sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025",
                      "sufixo": " %"
                },
                " dos quais estão em sobrecarga; os jovens saem de casa dos pais, em média, aos ",
                {
                      "claim": "hab-yth-demo-030-a-avg-t-pt-2025"
                },
                " anos."
          ],
          "en": [
                "Net of inflation, house prices in Portugal have risen since ",
                {
                      "ref": "2015"
                },
                " more than in any other country of the Union; overburdened by housing, more than forty percent of income, is ",
                {
                      "claim": "sobrecarga-do-custo-da-habitacao-2025",
                      "sufixo": " %"
                },
                " of the population, against ",
                {
                      "claim": "sobrecarga-do-custo-da-habitacao-2025-ue",
                      "sufixo": " %"
                },
                " in the Union, and the weight falls on those renting at market prices, ",
                {
                      "claim": "sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025",
                      "sufixo": " %"
                },
                " of whom are overburdened; the young leave their parents' home, on average, at ",
                {
                      "claim": "hab-yth-demo-030-a-avg-t-pt-2025"
                },
                " years."
          ]
    },
    "origem": {
      "onde": "content/28 Habitacao Estudo/, abertura das duas edições",
      "pt": "Descontada a inflação, os preços das casas em Portugal subiram desde 2015",
      "en": "Net of inflation, house prices in Portugal have risen since 2015"
    }
  }
,
  /* ----------------------------------------------------------------- 04 */
  'evora-prometido-pago-auditado-2026': {
    medidas: [
      {
        claim: 'evora-prr-aprovado-2026',
        nome: {
          pt: [`${unidade('evora-prr-aprovado-2026', 'pt')} aprovados e atribuídos ao concelho pelo registo do plano de recuperação`],
          en: [`${unidade('evora-prr-aprovado-2026', 'en')} approved and attributed to the municipality by the recovery-plan register`],
        },
      },
      {
        claim: 'evora-prr-pago-2026',
        nome: { pt: [`${unidade('evora-prr-pago-2026', 'pt')} efetivamente pagos`], en: [`${unidade('evora-prr-pago-2026', 'en')} actually paid`] },
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
        { claim: 'evora-prr-universidade-contratado', sufixo: '\u00A0' + unidade('evora-prr-universidade-contratado', 'pt') },
        ' contra ',
        { claim: 'evora-prr-municipio-contratado', sufixo: '\u00A0' + unidade('evora-prr-municipio-contratado', 'pt') },
        '. Da soma aprovada para o concelho, ',
        { claim: 'evora-prr-vencido-quota-2026', sufixo: ' %' },
        ' está vencida contra ',
        { claim: 'evora-prr-execucao-2026', sufixo: ' %' },
        ' paga.',
      ],
      en: [
        'Of the recovery-plan money contracted in the municipality, the university holds more than the council: ',
        { claim: 'evora-prr-universidade-contratado', sufixo: '\u00A0' + unidade('evora-prr-universidade-contratado', 'en') },
        ' against ',
        { claim: 'evora-prr-municipio-contratado', sufixo: '\u00A0' + unidade('evora-prr-municipio-contratado', 'en') },
        '. Of the sum approved for the municipality, ',
        { claim: 'evora-prr-vencido-quota-2026', sufixo: ' %' },
        ' is overdue against ',
        { claim: 'evora-prr-execucao-2026', sufixo: ' %' },
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
          pt: [`${unidade('evora-vab-empresarial-2024', 'pt')} de valor acrescentado bruto das empresas do concelho`],
          en: [`${unidade('evora-vab-empresarial-2024', 'en')} of gross value added by enterprises in the municipality`],
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
        { claim: 'evora-concentracao-vab4-2024', sufixo: ' %' },
        ' do valor acrescentado do concelho, contra ',
        { claim: 'portugal-concentracao-vab4-2024', sufixo: ' %' },
        ' no país.',
      ],
      en: [
        'Évora is above the national average in purchasing power per inhabitant, ',
        { claim: 'evora-poder-de-compra-2023' },
        ', inside a region that sits below it, at ',
        { claim: 'alentejo-central-poder-de-compra-2023' },
        '; and its enterprise economy is concentrated in few hands: four enterprises hold ',
        { claim: 'evora-concentracao-vab4-2024', sufixo: ' %' },
        ' of the municipality’s value added, against ',
        { claim: 'portugal-concentracao-vab4-2024', sufixo: ' %' },
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
        { claim: 'evora-pagamentos-em-atraso-2025', sufixo: '\u00A0' + unidade('evora-pagamentos-em-atraso-2025', 'pt') },
        ' em atraso, com a dívida total ainda abaixo do limite.',
      ],
      en: [
        'Évora’s budget has drifted from the money that arrives, and the strain shows in unpaid invoices and the payment queue, not in the legal debt: ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' days to pay a supplier, and ',
        { claim: 'evora-pagamentos-em-atraso-2025', sufixo: '\u00A0' + unidade('evora-pagamentos-em-atraso-2025', 'en') },
        ' overdue, with total debt still below the limit.',
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
        { claim: 'evora-divida-31-10-2013', sufixo: '\u00A0' + unidade('evora-divida-31-10-2013', 'pt') },
        ' logo a seguir à mudança de executivo, ',
        { claim: 'evora-divida-inicio-mandato-reexpressa', sufixo: '\u00A0' + unidade('evora-divida-inicio-mandato-reexpressa', 'pt') },
        ' na reexpressão final), uma década a desbastá-la, e um último mandato em que a fila de pagamento se alongou, de ',
        { claim: 'evora-prazo-medio-de-pagamento-2023' },
        ' para ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' dias.',
      ],
      en: [
        'Fifteen years of accounts show an inherited debt that took years to measure (',
        { claim: 'evora-divida-31-10-2013', sufixo: '\u00A0' + unidade('evora-divida-31-10-2013', 'en') },
        ' right after the executive changed, ',
        { claim: 'evora-divida-inicio-mandato-reexpressa', sufixo: '\u00A0' + unidade('evora-divida-inicio-mandato-reexpressa', 'en') },
        ' in the final restatement), a decade of grinding it down, and a last term in which the payment queue lengthened, from ',
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
          'Um pelouro é uma área do trabalho da câmara que o presidente atribui por despacho a um membro do executivo, e cada designação é um pelouro com o seu nome. Cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa.',
        ],
      ],
      en: [
        [
          'A portfolio is an area of the council’s work that the president assigns by order to a member of the executive, and each designation is one named portfolio. Each count is the list of portfolios the council’s page attributes to that person.',
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
        ' designações de pelouro repartidas por duas pessoas (um pelouro é uma área do trabalho da câmara que o presidente atribui por despacho a um membro do executivo); a câmara instalada em ',
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
        ' portfolio designations split between two people (a portfolio is an area of the council’s work that the president assigns by order to a member of the executive); the council installed in ',
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
  /* ------------------------------------------------ os estudos de Évora de 01.10.2026 */
  'evora-contas-da-camara-2010-2025': {
    /* A leitura de «evora-orcamentado-pago-devido-2025», que o estudo novo sucede (bloco E1, 01.10.2026):
       as medidas, a nota e a frase são as mesmas, e a frase assenta na leitura de
       abertura do documento novo, que a origem abaixo cita. A leitura antiga fica
       na página datada. */
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
        'A Câmara de Évora cumpre o limite legal da dívida e paga tarde a quem lhe vende: ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' dias, em média, para pagar a um fornecedor em ',
        { ref: '2025' },
        ', e ',
        { claim: 'evora-pagamentos-em-atraso-2025', sufixo: '\u00A0' + unidade('evora-pagamentos-em-atraso-2025', 'pt') },
        ' em pagamentos em atraso no fim desse ano.',
      ],
      en: [
        'The Câmara de Évora keeps within the legal debt limit and pays those who sell to it late: ',
        { claim: 'evora-prazo-medio-de-pagamento-2025' },
        ' days, on average, to pay a supplier in ',
        { ref: '2025' },
        ', and ',
        { claim: 'evora-pagamentos-em-atraso-2025', sufixo: '\u00A0' + unidade('evora-pagamentos-em-atraso-2025', 'en') },
        ' in overdue payments at the end of that year.',
      ],
    },
    origem: {
      onde: "C004, studies-src/evora-contas-da-camara-2010-2025/pt.html:48; studies-src/evora-contas-da-camara-2010-2025/en.html:48",
      pt: "Cumpre o limite legal da dívida; a quem lhe vende, paga tarde. A dívida fechou 2025 em €54 379 035, com €28 192 653 de folga sob o limite legal, mas no fim do ano havia €14,6 milhões de faturas à espera de pagamento. As amortizações dos empréstimos cumpriram os planos de pagamento e a despesa com pessoal ficou em 96,55% do orçamento.",
      en: "It keeps within the legal debt limit; it pays those who sell to it late. Debt closed 2025 at €54 379 035, with €28 192 653 of headroom under the legal limit, but at the end of the year €14.6 million of invoices were waiting to be paid. Loan repayments kept to the repayment plans, and staff spending came to 96.55% of the budget.",
    },
  },
  'evora-quem-governou-a-camara-2009-2025': {
    /* A leitura de «evora-os-pelouros-quem-os-teve-o-que-fizeram», que o estudo novo sucede (bloco E1, 01.10.2026):
       as medidas, a nota e a frase são as mesmas, e a frase assenta na leitura de
       abertura do documento novo, que a origem abaixo cita. A leitura antiga fica
       na página datada. */
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
          'Um pelouro é uma área do trabalho da câmara que o presidente atribui por despacho a um membro do executivo, e cada designação é um pelouro com o seu nome. Cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa.',
        ],
      ],
      en: [
        [
          'A portfolio is an area of the council’s work that the president assigns by order to a member of the executive, and each designation is one named portfolio. Each count is the list of portfolios the council’s page attributes to that person.',
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
        ' designações de pelouro repartidas por duas pessoas (um pelouro é uma área do trabalho da câmara que o presidente atribui por despacho a um membro do executivo); a câmara instalada em ',
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
        ' portfolio designations split between two people (a portfolio is an area of the council’s work that the president assigns by order to a member of the executive); the council installed in ',
        { ref: '2025' },
        ' has ',
        { claim: 'evora-camara-lugares' },
        ' seats.',
      ],
    },
    origem: {
      onde: 'content/17 Évora Quem Governou/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md:11, :13',
      pt: 'O executivo real é mais pequeno do que o eleito. · Os pelouros não se deixam contar em dinheiro.',
      en: 'The real executive is smaller than the elected one. · The portfolios cannot be counted in money.',
    },
  },
  'evora-economia-e-dinheiro-publico-de-fora-da-camara': {
    /* A leitura de «evora-prometido-pago-auditado-2026», que o estudo novo sucede (bloco E1, 01.10.2026):
       as medidas, a nota e a frase são as mesmas, e a frase assenta na leitura de
       abertura do documento novo, que a origem abaixo cita. A leitura antiga fica
       na página datada. */
    medidas: [
      {
        claim: 'evora-prr-aprovado-2026',
        nome: {
          pt: [`${unidade('evora-prr-aprovado-2026', 'pt')} aprovados e atribuídos ao concelho pelo registo do plano de recuperação`],
          en: [`${unidade('evora-prr-aprovado-2026', 'en')} approved and attributed to the municipality by the recovery-plan register`],
        },
      },
      {
        claim: 'evora-prr-pago-2026',
        nome: { pt: [`${unidade('evora-prr-pago-2026', 'pt')} efetivamente pagos`], en: [`${unidade('evora-prr-pago-2026', 'en')} actually paid`] },
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
        { claim: 'evora-prr-universidade-contratado', sufixo: '\u00A0' + unidade('evora-prr-universidade-contratado', 'pt') },
        ' contra ',
        { claim: 'evora-prr-municipio-contratado', sufixo: '\u00A0' + unidade('evora-prr-municipio-contratado', 'pt') },
        '. Da soma aprovada para o concelho, ',
        { claim: 'evora-prr-vencido-quota-2026', sufixo: ' %' },
        ' está em localizações de projeto vencidas, isto é, na parte de cada projeto que o registo atribui ao concelho cuja data prevista de conclusão já passou sem conclusão registada, e ',
        { claim: 'evora-prr-execucao-2026', sufixo: ' %' },
        ' já foi paga, e as duas partes sobrepõem-se: as localizações vencidas também receberam dinheiro.',
      ],
      en: [
        'Of the recovery-plan money contracted in the municipality, the university holds more than the council: ',
        { claim: 'evora-prr-universidade-contratado', sufixo: '\u00A0' + unidade('evora-prr-universidade-contratado', 'en') },
        ' against ',
        { claim: 'evora-prr-municipio-contratado', sufixo: '\u00A0' + unidade('evora-prr-municipio-contratado', 'en') },
        '. Of the sum approved for the municipality, ',
        { claim: 'evora-prr-vencido-quota-2026', sufixo: ' %' },
        ' sits in overdue project locations, that is, in the part of each project that the register attributes to the municipality whose planned completion date has passed with no completion recorded, and ',
        { claim: 'evora-prr-execucao-2026', sufixo: ' %' },
        ' has been paid, and the two parts overlap: the overdue locations have also received money.',
      ],
    },
    /* A ORIGEM REFEITA NA PASSAGEM E1B (01.10.2026), pela conferência das cópias:
       a segunda frase citada acabava num ponto onde o documento continua com uma
       vírgula, e já não era a frase impressa. Fica a frase inteira, e a do dinheiro
       pago (a linha da abertura), em que assenta o «paga» da frase acima. */
    /* E A FRASE DO ESTUDO QUE DIZ QUE AS DUAS PARTES SE SOBREPÕEM (passagem E1c, 01.10.2026,
       ponto 8 do mandato): a frase da leitura punha o vencido «contra» o pago, como se fossem
       duas metades; o estudo regista dinheiro já pago dentro das localizações vencidas, e a
       origem passa a citar essa frase, da secção do que está vencido. */
    origem: {
      onde: 'content/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md:11, :13, :7, :280',
      pt: 'O dinheiro de fora não passa pela câmara. · As localizações de projeto vencidas levam 61,32% do valor aprovado para o concelho, e as datas de conclusão que suavizariam essa leitura são o campo mais frágil do registo: 1 011 das 1 445 localizações dentro do prazo acabam exatamente na data prevista. · O plano de recuperação atribui ao concelho €167 372 756, dos quais €86 944 669 pagos no instantâneo de 2026-08-19, e a maior parte passa por organismos que não são a câmara. · Em Évora são 608 localizações de projeto que transportam €102 624 704 de dinheiro aprovado — 61,32 % de tudo o que foi aprovado para o concelho —, dos quais €41 693 864 foram pagos.',
      en: 'The outside money does not go through the council. · The overdue project locations carry 61.32% of the value approved for the municipality, and the completion dates that would soften that reading are the frailest field in the register: 1 011 of the 1 445 on-time locations end exactly on their planned date. · The recovery plan attributes €167 372 756 to the municipality, of which €86 944 669 was paid in the snapshot of 2026-08-19, and most of it goes through bodies that are not the council. · In Évora that is 608 project-locations carrying €102 624 704 of approved money — 61.32% of everything approved for the concelho — of which €41 693 864 has been paid.',
    },
  },

  "evora-2027-capital-europeia-da-cultura": {
    mostrarMedidasNoCartao: true,
    medidas: [
  {
    "claim": "evora-2027-recebido-do-protocolo-ate-2025",
    "nome": {
      "pt": [
        "milhões de euros recebidos do protocolo até ao fim de ",
        {
          "ref": "2025"
        },
        ", pelas contas da Associação Évora ", {"ref":"2027"}
      ],
      "en": [
        "million euros received under the protocol up to the end of ",
        {
          "ref": "2025"
        },
        ", by the accounts of the Associação Évora ", {"ref":"2027"}
      ]
    }
  },
  {
    "claim": "evora-2027-transferido-no-relato-ao-painel-2025",
    "nome": {
      "pt": [
        "milhões de euros que o relatório de progresso de Évora ", {"ref":"2027"}, " dava como já transferidos em junho de ",
        {
          "ref": "2025"
        },
        ", pelo resumo do painel europeu"
      ],
      "en": [
        "million euros that Évora ", {"ref":"2027"}, "'s progress report gave as already transferred in June ",
        {
          "ref": "2025"
        },
        ", by the European panel's summary"
      ]
    }
  }
],
    frase: {
      pt: ["A associação escreve que reabriu em ", { ref: '2025' }, " o diálogo com a Câmara para obter o dinheiro de que precisa para honrar os compromissos com entidades artísticas, culturais, educativas e sociais."],
      en: ["The association writes that in ", { ref: '2025' }, " it reopened dialogue with the Câmara to obtain the money it needs to honour its commitments to artistic, cultural, educational and social bodies."],
    },
    origem: {
      onde: "studies-src/evora-2027-capital-europeia-da-cultura/pt.html:49 (C005) · studies-src/evora-2027-capital-europeia-da-cultura/en.html:49 (C005)",
      pt: "A associação escreve que reabriu em 2025 o diálogo com a Câmara para obter o dinheiro de que precisa para honrar os compromissos com entidades artísticas, culturais, educativas e sociais.",
      en: "The association writes that in 2025 it reopened dialogue with the Câmara to obtain the money it needs to honour its commitments to artistic, cultural, educational and social bodies.",
    },
  },
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
          pt: ["é o que a lei corta quando a pensão é calculada pelas regras da flexibilização em vigor a ", {"data": {"id": "flexibilizacao-regras-2018", "campo": "reference_date", "valor": "2018-12-31"}}],
          en: ["is what the law cuts when the pension is calculated under the flexibilisation rules in force on ", {"data": {"id": "flexibilizacao-regras-2018", "campo": "reference_date", "valor": "2018-12-31"}}],
        },
      },
    ],
    medidasNota: {
      pt: [
        [
          "O valor atuarialmente neutro é o corte que deixaria o trabalhador financeiramente indiferente, em valor atual esperado, entre reformar-se agora ou daqui a um ano, numa estimativa que o relatório chama preliminar. A quem antecipa pelo regime de flexibilização com pelo menos ", {"claim": "flexibilizacao-idade-minima"}, " anos e ", {"claim": "flexibilizacao-carreira-minima"}, " de descontos nessa idade, a lei corta menos do que essa estimativa. As duas medidas acima são os dois extremos da mesma decisão.",
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
          "The actuarially neutral figure is the cut that would leave the worker financially indifferent, in expected present value, between retiring now or a year later, in what the report calls a preliminary estimate. For those who retire early under the flexibilisation scheme aged at least ", {"claim": "flexibilizacao-idade-minima"}, " with ", {"claim": "flexibilizacao-carreira-minima"}, " years of contributions at that age, the law cuts less than that estimate. The two measures above are the two ends of the same decision.",
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
        ", consoante a porta por onde o trabalhador entra (a flexibilização com pelo menos ", {"claim": "flexibilizacao-idade-minima"}, " anos e ", {"claim": "flexibilizacao-carreira-minima"}, " de descontos nessa idade, ou as regras da flexibilização em vigor a ", {"data": {"id": "flexibilizacao-regras-2018", "campo": "reference_date", "valor": "2018-12-31"}}, "), quando o valor atuarialmente neutro estimado pelo próprio relatório, numa estimativa que ele chama preliminar, é de ",
        { claim: 'penalizacao-antecipacao-um-ano-neutra' },
        ': a lei falha nos dois sentidos, e é mais dura com quem se desvia menos.',
      ],
      en: [
        'The penalty for retiring one year early is ',
        { claim: 'penalizacao-antecipacao-um-ano-sem-factor-2026' },
        ' or ',
        { claim: 'penalizacao-antecipacao-um-ano-com-factor-2026' },
        ", depending on which door the worker comes through (flexibilisation at ", {"claim": "flexibilizacao-idade-minima"}, " or older with ", {"claim": "flexibilizacao-carreira-minima"}, " years of contributions at that age, or the flexibilisation rules in force on ", {"data": {"id": "flexibilizacao-regras-2018", "campo": "reference_date", "valor": "2018-12-31"}}, "), when the actuarially neutral figure estimated by the report itself, in what it calls a preliminary estimate, is ",
        { claim: 'penalizacao-antecipacao-um-ano-neutra' },
        ': the law misses in both directions, and is harshest on those who deviate least.',
      ],
    },
    origem: {
      onde: 'content/11 Seguranca Social/Penalizações por Reforma Antecipada em Portugal (pt-PT).html:112, :149, :184',
      pt: 'Consoante a porta por onde o trabalhador entra. · A penalização legal quase nunca coincide com o valor atuarialmente neutro, e falha nos dois sentidos. · A regra é mais dura com quem se desvia menos.',
      en: 'Depending on which door the worker comes through. · The legal penalty almost never matches the actuarially neutral figure, and misses in both directions. · The rule is harshest on those who deviate least.',
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
  return !WORKS.some(w => w.id === id && w.estado === 'retirado') && Object.prototype.hasOwnProperty.call(LEITURAS, id);
}

/**
 * Um trabalho retirado não oferece leitura nem página ao índice.
 *
 * @param {{ id: string, estado?: string }} work
 * @returns {boolean}
 */
export function indexavel(work) {
  return temLeitura(work.id) && work.estado !== 'retirado';
}

/** A leitura de um trabalho, ou null. @param {string} id */
export function leituraDe(id) {
  return temLeitura(id) ? /** @type {TabelaAberta<typeof LEITURAS>} */ (LEITURAS)[id] ?? null : null;
}
