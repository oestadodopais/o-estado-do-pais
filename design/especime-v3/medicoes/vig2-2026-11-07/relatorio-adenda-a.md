# VIG2 A: designações com quebras de linha

A recusa vinha da apresentação: os títulos da fonte continham quebras de linha, mas o verificador lia cada designação numa linha. A recusa foi reproduzida no índice real antes da alteração.

O motor normaliza os espaços em branco da designação num único espaço e retira os espaços nas pontas, depois de remover a referência da edição do Diário da República, como já fazia. Usa essa forma nos caminhos de uma parte e de várias partes e na comparação do verificador. O índice conserva o título original. O limite continua estritamente abaixo de 2500 bytes por parte.

## Provas e códigos

| Conferência | Código | Resultado |
| --- | --- | --- |
| Duas provas novas antes da correção | 1 | Defeito reproduzido numa parte e em várias |
| `python3 -m vigilancia.tests` | 0 | 77 provas, 16 segundos |
| Acumulação com `\n`, `\n\n` e espaços nas pontas | 0 | Cada designação numa linha; índice intacto; inclui atos e iniciativas |
| Designação normalizada retirada de uma parte | 0 | Recusa esperada observada |
| Índice de 12.10 contra a referência congelada | 0 | Igual byte a byte, uma parte de 2489 bytes |
| Índice real de 07.11 e omissão plantada | 0 | Sem recusa no original; recusa da designação retirada |

O código 0 das plantas indica que a recusa esperada foi observada. A evidência selecionada está em `provas-vig2-a.log`. Não foi corrido o `core.gate`, que esta adenda não pede; não houve portões do sítio nem capturas.

## Índice real

A cópia fornecida foi lida fora dos repositórios, sem ser alterada nem copiada para eles. SHA-256: `99a9f14c0bd32512fe91c178eb183d946ea751d1b857f859cfc7580479dd7bd9`. A igualdade do objeto antes e depois da geração e dos bytes do ficheiro antes e depois da medição foi conferida.

Foram medidas 5132 entradas e 36 designações de atos e iniciativas. Três designações precisaram de normalização. Uma conferência independente do auxiliar de apresentação contou cada uma das 36 exatamente uma vez, numa só linha. Nenhuma foi omitida. A retirada de uma designação normalizada do resumo real foi recusada com a mensagem `designações das partes divergem do índice, por omissão ou repetição`.

| Parte | Bytes UTF-8 |
| --- | ---: |
| 1 | 748 |
| 2 | 2453 |
| 3 | 2409 |
| 4 | 2484 |

A referência histórica conserva o SHA-256 `ace8d3246898dd6dea6ed006261a67fd0e400607b72636a81735fd497c1b3328`. Não foi alargado qualquer limite nem alterado qualquer dado de corrida.

O guião de medição pode repetir a conferência, a partir da raiz do sítio, indicando a cópia do índice real em leitura e o destino das medidas:

```sh
python3 design/especime-v3/medicoes/vig2-2026-11-07/medir-designacoes.py <motor> <temporario>/vig2-indice-real-2026-11-07.json <temporario>/medidas-vig2-a.json
```

## Entrega e consumo

Commit do motor: `155a9f2497775b7c6b39cd9bbc6210ec0e86b29d`, pelo escrivão, com `OEDP_GATE=adiado` confirmado pelo hook. As únicas alterações do motor são `vigilancia/diario.py`, `vigilancia/verificar.py` e `vigilancia/tests/test_resumo_partes.py`. O commit do sítio é o que contém este relatório, o guião, as medidas e a evidência das provas. Não houve publicação de ramos nem recolha de fontes.

Consumo desta adenda: 8 chamadas de orquestração e 16 invocações internas, incluindo os dois commits e a inspeção final. Três corridas de testes ou medição: provas novas antes da correção, suite completa depois da correção e medição do índice real com conferência histórica. Houve ainda uma reprodução prévia da recusa no índice real. A contagem de tokens não foi exposta.
