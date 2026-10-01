# Resposta do construtor da passagem L2b-b

*Claude Opus 5.5 (a definição `construtor`), 01.10.2026, ramo `l2b-2026-10-01`. A secção «L2b-b» do `LEIA-ME.md`, na mesma pasta, tem o pormenor; os números estão em `l2b-b/medidas.json`. Sem travessões.*

- **Feito, pelas duas decisões.** Só as quatro taxas e rácios têm faixa (o índice de dívida, o ganho médio mensal, o poder de compra e o prazo médio de pagamento); as quatro contagens (a população, o desemprego registado, as empresas e a dívida em euros) ficam sem ela, como antes do L2b. A tabela `src/data/faixa-do-concelho.mjs` diz, por medida, se há faixa e porquê, com a §1.143(4) citada. O poder de compra continua a comparar-se com a base do índice.
- **Os portões e a célula**, com uma planta de cada lado: a FC exige a faixa nas quatro e a ausência dela nas outras quatro (a faixa tirada do ganho e a faixa posta na população mordem); a K1 recusa a faixa no cartão de uma contagem; o portão de HTML recusa um lugar numa contagem.
- **Na construção da cabeça `1a747a32`:** 2464 faixas, 2464 cartões de contagem sem faixa nenhuma, 2444 lugares e 0 diferentes da recontagem independente. Plantas: 15 da célula, 16 da prova do cartão e 6 do portão, todas a morder.
- **O peso:** Abrantes de 58530 para 39023 bytes; a construção inteira de 184717904 para 172657105.
- **O mapa do repositório:** a citação do PP1 aponta para `tests/inicio/lugares-no-navegador.mjs`; 156 citações à linha.
- **Capturas:** Évora e Penedono, 20, nas cinco larguras e nas duas edições, sem problemas e sem faixas nas contagens.
- **Portões:** correm na cabeça deste commit; os códigos entram no commit seguinte, em `portoes/l2b-b/`.
- **Custo:** 807 segundos até ao relatório. Os símbolos ficam por medir aqui: o contador que a ferramenta mostra ao agente não andou durante a passagem.
- **Por fazer:** as cinco réguas à mão, num bloco à parte; a leitura a frio.
