/** RP4: leitura do cartão da União, auditada em tests/cartao/leituras-provadas.json.
 * O sinal e o período vêm da linha; as palavras seguem a leitura do IHPC da casa. */
export const LEITURA_IHPC_UNIAO = {
  "pt": [
    {
      "sinal": {
        "positivo": [
          "Em ",
          {
            "periodo": "proprio"
          },
          " ",
          "os preços na União Europeia estavam, na medida harmonizada,",
          " ",
          {
            "claim": "proprio",
            "sufixo": " %"
          },
          " acima dos de há um ano."
        ],
        "negativo": [
          "Em ",
          {
            "periodo": "proprio"
          },
          " ",
          "os preços na União Europeia estavam, na medida harmonizada,",
          " ",
          {
            "claim": "proprio",
            "sufixo": " %"
          },
          " face aos de há um ano, ou seja, abaixo deles."
        ],
        "zero": [
          "Em ",
          {
            "periodo": "proprio"
          },
          " ",
          "os preços na União Europeia estavam, na medida harmonizada,",
          " ao mesmo nível de há um ano."
        ]
      }
    }
  ],
  "en": [
    {
      "sinal": {
        "positivo": [
          "In ",
          {
            "periodo": "proprio"
          },
          " ",
          "prices in the European Union were, on the harmonised measure,",
          " ",
          {
            "claim": "proprio",
            "sufixo": " %"
          },
          " above a year earlier."
        ],
        "negativo": [
          "In ",
          {
            "periodo": "proprio"
          },
          " ",
          "prices in the European Union were, on the harmonised measure,",
          " ",
          {
            "claim": "proprio",
            "sufixo": " %"
          },
          " compared with a year earlier, that is, below."
        ],
        "zero": [
          "In ",
          {
            "periodo": "proprio"
          },
          " ",
          "prices in the European Union were, on the harmonised measure,",
          " at the same level as a year earlier."
        ]
      }
    }
  ]
};
