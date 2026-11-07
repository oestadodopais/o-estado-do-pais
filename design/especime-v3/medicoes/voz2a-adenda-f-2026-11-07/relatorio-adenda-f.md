# VOZ-2A: fecho da adenda F

Estado: conferências finais em curso. O conteúdo do motor está no commit `aee60173990d1c645719f782c47b14f65ee0fff5`; o fecho dos portões do sítio e do motor será acrescentado a este relatório.

## Método e teto L1

A saída de `/metodo` e `/en/method` antecede esta passagem. O commit `330fd7500ee13e317556c8521fdd7955187fd444`, MET1 D, de 06.11.2026 às 11:38 UTC, substituiu o campo da edição, que repetia a ligação ao diploma, pelo localizador sem ligação. A medição que fixava o teto 3468 tinha sido comitada às 08:09 UTC desse dia em `0c03d83dd`, antes da MET1 D.

O destino `https://dre.pt/application/conteudo/992879809` aparece agora uma vez por página, em vez de duas. `src/views/MetodoView.astro:41` rende o localizador; `scripts/check-lugar.mjs:1234` seleciona apenas destinos com multiplicidade maior que um, e as linhas 1235 a 1237 só acrescentam a página quando essa lista não está vazia. Não há uma nova exclusão para o Método. O segmento inteiro da régua L1, a vista do Método e a linha do diploma são iguais aos da cabeça anterior à VOZ-2A.

A base efetiva é 3468 menos as duas páginas já corrigidas pela MET1 D, ou 3466. Sobre essa base entram exatamente treze rotas novas de arquivo: **3466 + 13 = 3479**. A diferença líquida relativamente ao teto desatualizado é onze, mas a subida devida às edições de 07.11 é treze. O ficheiro do teto explica as duas parcelas e aponta para [l1.json](l1.json), que lista todas as rotas, as entradas e as saídas. Nenhum teto sobe por uma página antiga piorada.

A prova reproduz-se com `node design/especime-v3/medicoes/voz2a-adenda-f-2026-11-07/conferir-l1.mjs <registo L1 com AMOSTRA=20000>`. A opção `--escrever` atualiza o teto apenas depois das asserções sobre as treze rotas e a MET1 D. A planta `tests/voz/voz2a-l1.mjs` repõe em memória as duas ligações antigas e exige que a mesma régua recuse as duas páginas adicionais, sem alterar o dist.

## Edições, frases e números

São sete estudos, treze edições de 07.11.2026, todas de natureza `atualizacao`, e sete entradas «Estudo atualizado» / «Study updated». Os textos são os prescritos na adenda E. Não há entrada de recontagem nem correção factual: a contagem das correções publicadas conserva 46.

Foram aplicadas 39 retiradas e 83 reescritas; conservam-se 37 frases FICA. Nos treze documentos e nas treze páginas de estudo, a classe passa de 214 para 53 ocorrências, e fora das FICA de 161 para zero. Só nos documentos passa de 203 para 50, e fora das FICA de 153 para zero. As 53 ocorrências restantes estão declaradas por frase e rota. A régua do nome cobre o texto visível, exceto os documentos datados e os documentos dos onze estudos da VOZ-2B. As páginas de apresentação desses onze estudos continuam cobertas pela régua do nome.

As versões anteriores são conservadas byte a byte: 19 versões históricas dos sete estudos conferidas, incluindo as treze que eram correntes. As treze novas versões correspondem aos bytes do commit do motor declarado no origin_ref. As 8382 referências dos 25 registos conservam linha, valor e forma impressa. Os estudos fora do âmbito permanecem iguais.

Os títulos retirados que encabeçavam conteúdo conservado passam a «O que fica por saber» / «What remains unknown» nos estudos 04 e 18, e «O que fica por saber» no estudo 06. O estudo 06 só tem edição portuguesa alojada; a página inglesa aponta para ela com rótulos ingleses e hreflang português.

| Contagem | Antes | Depois | Razão |
| --- | ---: | ---: | --- |
| Versões no manifesto | 39 | 52 | Treze atualizações |
| Versões arquivadas | 10 | 23 | Conservação das treze edições anteriores |
| Testemunhos de primeira edição | 8 | 17 | Nove histórias passam a ter arquivo |
| Apresentações de primeiras edições | 8 | 18 | As nove histórias e a página inglesa do estudo só em português |
| Entradas de texto no registo | 5 | 12 | Sete atualizações |
| Atualizações no registo de texto | 1 | 8 | Natureza da adenda E |
| Correções no registo de texto | 4 | 4 | Nenhum facto corrigido |
| Correções publicadas | 46 | 46 | Nenhuma correção nova |
| Exceções da voz | 11 | 64 | As 53 ocorrências FICA por rota |
| Páginas com frases da classe, nos sete estudos | 19 | 15 | Prosa retirada e reescrita |
| Blocos publicados de 04 pt | 95 | 94 | Retirada prescrita |
| Blocos publicados de 18 pt | 161 | 160 | Retirada importada pela composição |

As restantes contagens da prova da voz, medidas no motor, são:

| Campo da prova da voz | Antes | Depois |
| --- | ---: | ---: |
| blocos_antes | 2922 | 2920 |
| blocos_conferidos | 2819 | 2817 |
| blocos_depois | 2819 | 2817 |
| com_palavra | 152 | 150 |
| cortes | 473 | 463 |
| frases_depois | 17784 | 17752 |
| offsets_conferidos | 9753 | 9761 |
| operacoes | 916 | 874 |
| substituicoes | 443 | 411 |
| S1·aprovado | 73 | 65 |
| S2·inventário-cego·aprovado-24.08 | 70 | 69 |
| S3·famílias-leituras·aprovado-24.08 | 78 | 77 |
| S5·segunda-voz·proposta-27.08 | 374 | 360 |
| S6·terceira-voz·proposta-27.08 | 313 | 295 |

As 42 operações a menos já não são necessárias porque as alterações passaram para as fontes: dez cortes e trinta e duas substituições. Os dois blocos retirados explicam os totais de blocos; as frases e os offsets são recontados sobre a prosa nova. As referências numéricas não mudam. As seis frases acrescentadas ao inventário são os dois textos do registo e quatro rótulos de portas históricas; as seis declarações retiradas já não têm superfície porque as novas atualizações ocupam as novidades. Nenhuma expressão da régua foi alargada.

## Livro importado e transcrições

No livro 14 mudam apenas as duas citações de `base-sem-contratos`, conservando id e review. Os livros 16 e 18 não mudam. No livro 19, `ignore` perde 256 (45 para 44), as asserções perdem `nenhum-uniformiza` (33 para 32), e `base-sem-contratos` conserva id e review com as citações novas. Em `composto_de` muda apenas `ledger_sha256` da fonte 14, de `f2077836a4f943578c54460830d55533b4c3ffd444ce6def0245744790683aaa` para `307297cf47c6919c43b0234c0ab02b22d5cc1eaa79353bf1e82c8f9feb87ab0b`. Todas as linhas e valores ficam iguais.

A prova de importação confere na prosa portuguesa «nenhum dos documentos lidos lista contratos, adjudicatários ou valores» e inglesa «none of the documents read lists contracts, contractors or values». A diferença campo a campo reproduz-se num comando:

```sh
python3 design/especime-v3/medicoes/voz2a-2026-11-07/conferir-livro-adenda-e.py <motor>
```

As contagens antes e depois reproduzem-se, cada uma, num comando:

```sh
node design/especime-v3/medicoes/voz2a-2026-11-07/medir-classe-adenda-a.mjs <temporario>/antes.json <worktree-anterior>/dist
node design/especime-v3/medicoes/voz2a-2026-11-07/medir-classe-adenda-a.mjs <temporario>/depois.json
```

As dez frases da adenda A desta metade, com a V194 corrigida pela adenda B, estão transcritas em [frases-do-dist.md](../voz2a-2026-11-07/frases-do-dist.md). As outras onze pertencem à VOZ-2B. Três reescritas por língua, copiadas do dist:

**V164 (pt)**

A execução da receita caiu de 96% em 2021 para 61,44% em 2025, e as próprias contas mostram um padrão: o município orçamenta dinheiro de fora antes de alguém o ter comprometido, como as obras do plano de recuperação e o protocolo das acessibilidades ao novo hospital, e depois esse dinheiro não é recebido. Que este padrão explique a queda é uma inferência.

**V176 (pt)**

A execução da receita caiu de 96%fonte · Município de Évora em 2021 para 61,44%fonte · Município de Évora em 2025, e as próprias contas mostram um padrão: o município orçamenta dinheiro de fora antes de alguém o ter comprometido, como as obras do plano de recuperação e o protocolo das acessibilidades ao novo hospital, e depois esse dinheiro não é recebido. Que este padrão explique a queda é uma inferência.

**V182 (pt)**

Os dois registos usam nomes diferentes, e nenhuma das fontes afirma que são a mesma entidade. Os próprios objetos dos contratos mostram que são o mesmo organismo (inferência).

**V043 (en)**

Revenue execution fell from 96% in 2021 to 61.44% in 2025, and the accounts themselves show a pattern: the municipality budgets outside money before anyone has committed it, such as the recovery-plan works and the protocol for access roads to the new hospital, and then that money does not come in. That this pattern explains the fall is an inference.

**V053 (en)**

Revenue execution fell from 96%source · Município de Évora in 2021 to 61.44%source · Município de Évora in 2025, and the accounts themselves show a pattern: the municipality budgets outside money before anyone has committed it, such as the recovery-plan works and the protocol for access roads to the new hospital, and then that money does not come in. That this pattern explains the fall is an inference.

**V057 (en)**

The two registers use different names, and neither source states that they are the same entity. The contract objects themselves show that they are one body (inference).

