# EV3-p, adenda B: caixa corrigida; build bloqueado pela L1

Código comitado em e1ca65a3857d5a4671974acb7d06c91c25fcb177. O motor permanece em 983b19eee29d4653730a62e9ee1d9674345db308.

A caixa escolhe a última edição de natureza atualização posterior à primeira publicação. A correção posterior não muda a data, o tipo, a origem nem a ligação dessa novidade. A validação independente das datas usa a mesma regra editorial, com comparação à edição declarada. O rótulo regressou ao estado viva no inventário.

As plantas usam a atualização real quando existe. Na ausência de uma atualização visível, constroem uma atualização de ensaio a partir de uma cópia do manifesto, validam a caixa inteira antes da adulteração e aplicam as mesmas três plantas. O cenário sem atualização também é exercitado explicitamente nas duas línguas. Nenhuma asserção foi retirada. As 12 plantas FP3 de data, origem e tipo, nos dois cenários e nas duas línguas, morderam.

A conferência das datas revelou uma marca errada herdada da adenda A: as portas intermédias diziam data-do-repositorio. Agora dizem data-editorial, com origem edicoes.data, e só são aceites quando estudo, correção, lado da porta, ligação, edição, data e texto coincidem. Os dois controlos passaram e 14 adulterações foram recusadas.

## Códigos

- Build completo: 1 nas duas tentativas. A primeira parou na marca de data, entretanto corrigida; a segunda chegou à última prova de check:voz e parou na L1.
- check:edicoes: 0, dentro do build final.
- gate:html: 0, dentro do build final, incluindo as 14 plantas das portas.
- check:voz: 1. O inventário passou; tests/voz/agenda-voz1.mjs:125 exige check:lugar verde, que falhou no teto L1.
- check:primeira: 0, pelo escrivão.
- check:frases-compostas: 0, no mesmo perfil restrito do escrivão.
- Typecheck: 0.
- Medição das caixas no dist: 0. A contagem das correções continua em 46.

## Bloqueio e limite preservado

A L1 conta 3468 páginas, acima do teto 3466. A medição isolada com AMOSTRA=5000 confirmou que as duas páginas adicionais são as edições de 03.11.2026 preservadas por esta correção:

- `/en/studies/evora-2027-capital-europeia-da-cultura/document/2026-11-03`.
- `/estudos/evora-2027-capital-europeia-da-cultura/documento/2026-11-03`.

Não houve páginas retiradas da contagem. A comparação com a medição antiga também encontrou 14 páginas cujos campos de amostra diferem; a lista e os valores completos estão em l1.json. Não se afirmou que todos os destinos das páginas antigas ficaram iguais. O teto, a sua medição de referência e a régua L1 não foram alterados. A subida do teto não foi usada para obter verde. O build inteiro permanece por fechar; não houve publicação.

## Caixas copiadas do dist

### pt

O que há de novo03.11.2026estudo atualizadoÉvora 2027, Capital Europeia da Cultura: o que a candidatura prometeu, o que o painel europeu escreveu e o dinheiro nos atos públicos29.10.2026estudoA casa em Portugal e na Europa29.10.2026dossiêO Orçamento de 2027 · 5 peças06.10.2026explicaçãoPara onde vai o dinheiro do Estado em 202601.10.2026estudoAs contas da Câmara de Évora, 2010 a 2025: o orçamento, a cobrança, a dívida e a certificaçãoAtualizado a 06.11.2026 · números do painel relidos na fonte a 02.11.2026

| Data | Tipo | Título |
| --- | --- | --- |
| 03.11.2026 | estudo atualizado | Évora 2027, Capital Europeia da Cultura: o que a candidatura prometeu, o que o painel europeu escreveu e o dinheiro nos atos públicos |
| 29.10.2026 | estudo | A casa em Portugal e na Europa |
| 29.10.2026 | dossiê | O Orçamento de 2027 · 5 peças |
| 06.10.2026 | explicação | Para onde vai o dinheiro do Estado em 2026 |
| 01.10.2026 | estudo | As contas da Câmara de Évora, 2010 a 2025: o orçamento, a cobrança, a dívida e a certificação |

### en

What is new03.11.2026study updatedÉvora 2027, European Capital of Culture: what the bid promised, what the European panel wrote and the money in the official acts29.10.2026studyHousing in Portugal and in Europe29.10.2026dossierThe 2027 Budget · 5 pieces06.10.2026explainerWhere the State’s money goes in 202601.10.2026studyThe accounts of the Câmara de Évora, 2010 to 2025: the budget, what was collected, the debt and the certificationUpdated on 06.11.2026 · panel figures re-read at the source on 02.11.2026

| Data | Tipo | Título |
| --- | --- | --- |
| 03.11.2026 | study updated | Évora 2027, European Capital of Culture: what the bid promised, what the European panel wrote and the money in the official acts |
| 29.10.2026 | study | Housing in Portugal and in Europe |
| 29.10.2026 | dossier | The 2027 Budget · 5 pieces |
| 06.10.2026 | explainer | Where the State’s money goes in 2026 |
| 01.10.2026 | study | The accounts of the Câmara de Évora, 2010 to 2025: the budget, what was collected, the debt and the certification |

## Orçamento

30 chamadas de ferramentas de orquestração. Dez execuções de conferência ou medição: duas tentativas de build, dois typechecks, plantas FP3 isoladas, plantas das datas, medição das caixas, medição L1 e as duas conferências do perfil restrito do escrivão. Zero corridas completas dos portões e zero capturas. Não foi exposta uma linha «tokens used».
