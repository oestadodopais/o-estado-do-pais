# EV3-p: entrega parcial, sítio por concluir

A frase foi corrigida nas duas línguas. O motor ficou no commit `983b19eee29d4653730a62e9ee1d9674345db308`, com `OEDP_GATE=adiado` confirmado pelo hook. A travessia terminou com código 0: dois registos alterados, dezanove inalterados. Os origin_ref dos documentos correntes apontam para esse commit e os bytes foram comparados com o Git.

A edição atual está declarada como 06.11.2026. As cópias de 03.11.2026 são idênticas aos documentos anteriores no Git. A função partilhada conta 46 correções, antes contava 45. A linha publicada foi atualizada e a história selada sem alterar as nove entradas anteriores.

As contagens da voz são idênticas antes e depois: 137 blocos, 196 referências e 1022 frases por língua. A prova global da voz passou os 26 controlos. A medição dos dois corpos das fontes confirmou PRR/Fundo Ambiental: 1/0 no concurso, 0/1 na nota de outubro.

## Conferências e códigos

- `compor`: 0.
- `registos`: 0.
- `voz`: 0.
- `travessia`: 0.
- `build`: 1.
- `ledger`: 1.
- `ledger-final`: 0.
- `build-final`: 1.
- `typecheck`: 0.
- `edicoes`: 1.
- `edicoes-final`: 1.

A primeira tentativa de build encontrou a contagem publicada ainda em 45. A primeira conferência do livro encontrou a nova entrada ainda sem selo. Estes dois problemas foram corrigidos, e ledger:check terminou com código 0.

A primeira conferência ED1 passou as páginas reais, mas as plantas não preparavam versões intermédias. O ensaio foi completado com todas as versões guardadas e as portas de cada correção, sem alterar as regras. Os 67 controlos e plantas passaram na tentativa seguinte. A suite parou depois em `tests/edicoes/reguas.mjs:35`, por falta da declaração inteira das novas frases no inventário da voz.

O segundo build parou no portão HTML: as portas que agora dizem «Edição de 03.11.2026» e «Edition of 03.11.2026» imprimem a data sem a marca estrutural exigida. É necessário marcar essas datas no componente, acrescentar as frases autorizadas ao inventário e concluir as conferências. Nenhuma régua foi enfraquecida. O sítio não foi comitado nem publicado.

## Texto extraído do dist

### pt

Frase: Na nota em que anunciou a abertura do concurso da requalificação, a Câmara escreveu que a obra era «apoiada por financiamento do Plano de Recuperação e Resiliência»; a nota de outubro só fala do Fundo Ambiental, e nenhuma das duas menciona o financiamento que a outra nomeia.

Entrada (Estudo corrigido): A frase sobre o dinheiro do Rossio de São Brás contava dois financiamentos que nenhum documento conta; passou a dizer só o que cada nota da Câmara nomeia.

SHA-256 da edição guardada de 03.11: `3547e5fd2933eba9dd05c3c7ce0ca24b370181c73663a2235a65629e4a938b09`.

### en

Frase: In the notice announcing the tender for the works, the Câmara wrote that they were supported by Recovery and Resilience Plan funding («apoiada por financiamento do Plano de Recuperação e Resiliência»); the October notice names only the Fundo Ambiental, and neither mentions the funding the other names.

Entrada (Study corrected): The sentence on the Rossio de São Brás funding counted two financings that no document counts; it now says only what each of the Câmara's notes names.

SHA-256 da edição guardada de 03.11: `81e1c0d262cd4066d7d79b4350a0941394b256f096176b3da90bcee89cd243f1`.

## Orçamento e estado

40 chamadas de ferramentas de orquestração. Onze execuções por curto.sh: duas tentativas de build, seis conferências (duas do livro, duas de edições, voz do motor e typecheck), e três operações validadas de composição, geração de registos e travessia. Zero corridas completas dos portões e zero capturas. As verificações diretas dos bytes, fontes, contagens e extração do dist constam nos ficheiros de evidência.

Paragem pelo teto de chamadas do mandato. Não foi exposta uma linha «tokens used». As alterações do sítio e este relatório ficam por comitar, porque o build e check:edicoes ainda estão vermelhos.
