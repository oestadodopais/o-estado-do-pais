/**
 * OS NOMES DO PROJETO DAS LINHAS DO MAPA 2 QUE A EXPLICAÇÃO DE 2027 NOMEIA (bloco EX4, 21.10.2026).
 *
 * As linhas do manifesto pf1 do motor que uma frase da explicação «Para onde vai o dinheiro do Estado em 2027, pela
 * proposta de Orçamento» nomeia por `{ nome }`. As derivadas não têm `name` no motor (o exportador recusa um nome
 * sem localizador), e por isso os nomes são do projeto, declarados no sítio (o mandato EX4, §0 e §1.2). Não vivem em
 * `src/data/medidas-oe1.mjs` porque esse módulo é gerado pelo motor (`publisher/oe1_nomes.py`) e selado pelo sha256
 * em `ledger/cruzamentos/oe1-nomes.json`: um nome escrito à mão lá partia o `check:cruzamento`. A forma é a dos nomes
 * das linhas de 2026: o nome declarado da função é o que vem depois de « que vai para » / « going to », e é o nome da
 * função de 2026, palavra por palavra (gerado pelo guião do bloco a partir de `NOMES_OE1`); a função 01 sem a dívida
 * leva o nome que o mandato escreve.
 * @type {Record<string, {pt: string, en: string}>}
 */
export const NOMES_PF1 = {
  "oe-2027-cem-euros-funcao-01-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para serviços gerais das administrações públicas",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to general public services"
  },
  "oe-2027-cem-euros-funcao-02-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para defesa",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to defence"
  },
  "oe-2027-cem-euros-funcao-03-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para segurança e ordem pública",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to public order and safety"
  },
  "oe-2027-cem-euros-funcao-04-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para assuntos económicos",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to economic affairs"
  },
  "oe-2027-cem-euros-funcao-05-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para proteção do ambiente",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to environmental protection"
  },
  "oe-2027-cem-euros-funcao-06-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para habitação e infraestruturas coletivas",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to housing and community amenities"
  },
  "oe-2027-cem-euros-funcao-07-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para saúde",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to health"
  },
  "oe-2027-cem-euros-funcao-08-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para desporto, recreação, cultura e religião",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to recreation, culture and religion"
  },
  "oe-2027-cem-euros-funcao-09-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para educação",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to education"
  },
  "oe-2027-cem-euros-funcao-10-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada, que vai para proteção social",
    "en": "Share of central administration subsector expenditure by function, unconsolidated, going to social protection"
  },
  "oe-2027-cem-euros-funcao-01-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para serviços gerais das administrações públicas, sem as operações relacionadas com a dívida pública",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to general public services, without the operations related to public debt"
  },
  "oe-2027-cem-euros-funcao-02-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para defesa",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to defence"
  },
  "oe-2027-cem-euros-funcao-03-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para segurança e ordem pública",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to public order and safety"
  },
  "oe-2027-cem-euros-funcao-04-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para assuntos económicos",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to economic affairs"
  },
  "oe-2027-cem-euros-funcao-05-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para proteção do ambiente",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to environmental protection"
  },
  "oe-2027-cem-euros-funcao-06-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para habitação e infraestruturas coletivas",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to housing and community amenities"
  },
  "oe-2027-cem-euros-funcao-07-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para saúde",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to health"
  },
  "oe-2027-cem-euros-funcao-08-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para desporto, recreação, cultura e religião",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to recreation, culture and religion"
  },
  "oe-2027-cem-euros-funcao-09-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para educação",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to education"
  },
  "oe-2027-cem-euros-funcao-10-sem-divida-mapa": {
    "pt": "Parte da despesa por funções do subsetor da Administração Central, não consolidada e sem as operações relacionadas com a dívida pública, que vai para proteção social",
    "en": "Share of central administration subsector expenditure by function, unconsolidated and without the operations related to public debt, going to social protection"
  },
  "der-oe2027-funcao-02-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para defesa",
    "en": "Year-on-year change in central administration subsector expenditure by function going to defence"
  },
  "der-oe2027-funcao-04-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para assuntos económicos",
    "en": "Year-on-year change in central administration subsector expenditure by function going to economic affairs"
  },
  "der-oe2027-funcao-05-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para proteção do ambiente",
    "en": "Year-on-year change in central administration subsector expenditure by function going to environmental protection"
  },
  "der-oe2027-funcao-07-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para saúde",
    "en": "Year-on-year change in central administration subsector expenditure by function going to health"
  },
  "der-oe2027-funcao-08-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para desporto, recreação, cultura e religião",
    "en": "Year-on-year change in central administration subsector expenditure by function going to recreation, culture and religion"
  },
  "der-oe2027-funcao-09-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para educação",
    "en": "Year-on-year change in central administration subsector expenditure by function going to education"
  },
  "der-oe2027-funcao-10-variacao-pct": {
    "pt": "Variação, de um ano para o outro, da despesa por funções do subsetor da Administração Central que vai para proteção social",
    "en": "Year-on-year change in central administration subsector expenditure by function going to social protection"
  }
};
