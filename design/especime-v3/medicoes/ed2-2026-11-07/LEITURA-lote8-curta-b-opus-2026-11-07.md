# A leitura curta da adenda B da ED2 (M48), 07.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 19 chamadas pelo harness (18 pela contagem do leitor), 366 s, sobre o pacote `pacote-lote8-curta-b-2026-11-07` (base 157602858, cabeça c021704c2, `dist/` de c021704c2). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| F1 | o renderizador só dá a data de atualização a um estudo de uma só edição se a edição for anterior à publicação | 3 |
| F2 | a régua da porta de uma edição única espera «Edição tal como foi publicada» num estudo atualizado | 4 |
| F3 | a voz da linha das edições aceita qualquer texto | 5 |
| F4 | o cabeçalho português do orçamentado, pago e devido perde a data de atualização | 1 |
| F5 | a porta inglesa do prometido, pago e auditado diz «Edition as published» | 2 |

Cinco em cinco. Os achados reais:

- **O 6, respondido por guião:** a comparação com `main` que o construtor afirmava mediu-a este lugar sobre os dois `dist/` (o de 2cc0806c2 e o de c021704c2): o guião `medir-cabecalhos.py` dá 0 páginas com a data perdida em 38, e os oito cabeçalhos HTML só diferem de `main` na escrita de um atributo (`data-estudo-atualizacao` passa a `data-estudo-atualizacao="true"`), que o leitor não vê; o texto, as portas e as datas são iguais.
- **O 7, Minor:** `dataAtualizacaoDaEdicao` ficou exportada com a regra antiga e sem nenhum chamador em `src`, `scripts` ou `tests` (conferido por `grep`): não muda nenhuma página; sai na higiene.
- **O 8 e o 9, Minor:** a chave da correção que não é a atual ainda não aparece em nenhuma página construída (a VOZ-2 vai imprimi-la, e a sua corrida da voz confere-a); e o relatório do construtor conta 14 invocações onde a sua lista soma 15.

Nenhum Blocking nem Major real: a ED2 aterra.

## O relatório do leitor (condensado)

**Blocking.**
1. A página portuguesa do orçamentado, pago e devido não imprime a data de atualização (planta F4).
2. A página inglesa do prometido, pago e auditado diz «Edition as published» sobre a edição atualizada (planta F5).
3. O diff acrescenta a regra do renderizador com a comparação invertida (planta F1).
4. A linha da régua no diff espera a porta falsa onde se espera uma atualização (planta F2).
5. A classificação da voz no diff devolve «conteudo» para qualquer texto (planta F3).

**Major.**
6. A comparação do relatório com `main` é uma afirmação, sem o HTML de `main` no pacote.

**Minor.**
7. `dataAtualizacaoDaEdicao` usa a regra antiga, sem a publicação.
8. As chaves de `rotulos-b1.mjs` só se conferem nas que as páginas de hoje usam; a correção que não é a atual não aparece em nenhuma; a prova das quatro edições é HTML escrito à mão.
9. A contagem das invocações do relatório (14) não bate com a sua lista (15).

**O que está bem:** os outros seis cabeçalhos batem com `main`; `onde-esta-a-agua` fica como estava nas duas línguas; os cabeçalhos de Évora 2027 dão as três edições pela ordem, com «corrigido a» na correção; o documento inglês de 01.10.2026 marca a sua edição e liga às outras; a régua lê sem o renderizador; as quatro plantas estão lá e cada uma dá vermelho sozinha; a prova das quatro edições aceita a linha e recusa outra palavra; o `package.json` acrescenta os testes e não tira nenhum passo; nenhuma frase nova do leitor.
