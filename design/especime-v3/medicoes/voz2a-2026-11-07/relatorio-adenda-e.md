# VOZ-2A, adenda E: relatório

Estado: passagem interrompida no teto de chamadas. O motor está comitado; as alterações do sítio estão preservadas na worktree, por comitar e sem build completo verde. Este relatório e as provas são o único commit do sítio desta passagem.

O motor contém a alteração em `aee60173990d1c645719f782c47b14f65ee0fff5`. O commit foi entregue ao escrivão com `OEDP_GATE=adiado`, código 0. A travessia de registos deu 0 e as treze edições correntes apontam para esse commit, com os resumos dos bytes conferidos.

Aplicaram-se as 39 retiradas e as 83 reescritas prescritas; as 37 frases FICA mantêm-se. Há sete entradas «Estudo atualizado» / «Study updated», com o texto prescrito, e treze edições de 07.11.2026 com natureza `atualizacao`. O estudo 06 tem apenas edição portuguesa alojada. As portas inglesas para essa edição conservam os rótulos ingleses e apontam para o documento português, com o hreflang correto. As plantas recusam uma porta inglesa inexistente, um rótulo na língua errada e um hreflang errado.

Os títulos SAI com conteúdo que fica passaram a «O que fica por saber» / «What remains unknown»: estudos 04 e 18 nas duas línguas, estudo 06 em português. No estudo 16, duas substituições explícitas da composição preservam as FICA V168 e V171 apesar da reescrita da fonte 07.

## Prosa, números e arquivo

Só nos treze documentos, as ocorrências passam de 203 para 50 e as recusas de 153 para zero. Nos treze documentos e nas treze páginas dos estudos, a classe passa de 214 para 53 ocorrências; fora das FICA passa de 161 para 0. As páginas com ocorrências passam de 19 para 15. As 53 ocorrências restantes correspondem às 37 FICA, declaradas individualmente por frase e rota, com a razão da lista. A régua geral passa de 11 para 64 ocorrências permitidas no mesmo dist, sem recusas, mantendo CLASSE inalterada. A isenção cobre apenas os onze estudos da VOZ-2B e as edições datadas. A régua do nome do motor mede o texto visível, sem script nem style, excluindo apenas os documentos das onze edições por tratar e os documentos datados. As páginas de apresentação dos onze estudos continuam cobertas pela régua do nome.

A integridade confere 19 versões anteriores dos sete estudos, byte a byte, e 13 versões correntes contra os bytes do motor. Os restantes estudos e as suas versões não mudam. Os 25 registos do motor conservam as mesmas 8382 referências a números, com as mesmas linhas, valores e formas impressas. As linhas dos livros não mudam. Não há recontagem nem nova correção: 46 antes e depois.

| Contagem | Antes | Depois | Causa |
| --- | ---: | ---: | --- |
| Versões no manifesto | 39 | 52 | Treze edições de atualização |
| Versões arquivadas | 10 | 23 | Preservação das treze edições correntes anteriores |
| Testemunhos de primeira edição | 8 | 17 | Nove histórias passam a ter arquivo |
| Entradas de texto no registo | 5 | 12 | Sete atualizações |
| Entradas de atualização | 1 | 8 | Natureza prescrita na adenda E |
| Entradas de correção de texto | 4 | 4 | Nenhuma correção factual |
| Exceções declaradas da voz | 11 | 64 | As FICA em cada rota |
| Blocos publicados de 04 pt | 95 | 94 | Retirada de prosa prescrita |
| Blocos publicados de 18 pt | 161 | 160 | Mesma retirada importada pela composição |

As contagens completas da prova do motor estão em [contagens-da-voz.md](contagens-da-voz.md). As operações passam de 916 para 874 porque a nova prosa entra nas fontes e deixa de precisar das operações antigas: dez cortes e trinta e duas substituições deixam de existir. As duas retiradas de blocos explicam os totais de blocos e de blocos com palavra. As frases e os offsets são recontados sobre a nova prosa; os números antes e depois da voz ficam iguais aos anteriores, incluindo as oito retiradas históricas já declaradas pela prova. Nenhuma dessas oito é nova nesta passagem.

O inventário ganha seis frases presentes (as duas frases do registo e quatro rótulos das novas portas históricas) e perde seis declarações sem superfície atual, porque as atualizações ocupam a caixa das novidades. Não se alargou uma expressão de isenção. As plantas dos dossiês e de uma publicação gerada usam agora cenários explícitos com controlo verde, porque as cinco novidades reais já não incluem um dossiê. As conferências continuam a medir a página real. As plantas da história das edições foram ajustadas para não duplicar a data de uma edição que passou a existir.

## Livro importado

Um comando refaz a diferença campo a campo e verifica as citações importadas nas duas línguas:

```sh
python3 design/especime-v3/medicoes/voz2a-2026-11-07/conferir-livro-adenda-e.py <motor>
```

Código 0. O resultado detalhado está em [medidas-adenda-e-voz2.json](medidas-adenda-e-voz2.json).

| Livro/campo | Diferença autorizada |
| --- | --- |
| 14, assertions | Só as duas citações de base-sem-contratos; id e review conservados |
| 16 | Nenhuma |
| 18 | Nenhuma |
| 19, ignore | Sai 256, retirado com sha256 nas duas línguas; 45 para 44 elementos |
| 19, assertions | Sai nenhum-uniformiza; base-sem-contratos conserva id e review, com as duas citações novas; 33 para 32 asserções |
| 19, composto_de | Só ledger_sha256 da fonte 14 |

O resumo antigo da fonte 14 é `f2077836a4f943578c54460830d55533b4c3ffd444ce6def0245744790683aaa`; o novo é `307297cf47c6919c43b0234c0ab02b22d5cc1eaa79353bf1e82c8f9feb87ab0b`.

A composição importa `base-sem-contratos` e confere na prosa portuguesa «nenhum dos documentos lidos lista contratos, adjudicatários ou valores» e inglesa «none of the documents read lists contracts, contractors or values». Todas as linhas e todos os valores dos quatro livros permanecem iguais.

## Reprodução e frases do dist

Cada medição usa um só comando, a partir da raiz do sítio. O primeiro lê o dist anterior preservado na worktree anterior; o segundo lê o dist desta passagem:

```sh
node design/especime-v3/medicoes/voz2a-2026-11-07/medir-classe-adenda-a.mjs <temporario>/antes.json <worktree-anterior>/dist
node design/especime-v3/medicoes/voz2a-2026-11-07/medir-classe-adenda-a.mjs <temporario>/depois.json
```

As dez frases da adenda A aplicáveis à VOZ-2A, incluindo a V194 corrigida pela adenda B, estão copiadas do dist em [frases-do-dist.md](frases-do-dist.md), com a rota de cada uma. As outras onze pertencem à VOZ-2B e não foram alteradas. A extração tem código 0 e está em `extrair-frases.mjs`.

Três reescritas por língua, extraídas do dist:

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


## Paragem e retoma

Não há frase por aplicar: os sete estudos e as dez frases desta metade da adenda A estão preparados. A retoma começa na conferência L1 e nas últimas conferências do sítio, não num estudo ou numa frase. O build completo mais recente terminou a 1 na planta de novidades, entretanto corrigida e conferida por `check:datas`, código 0. A tentativa seguinte foi interrompida ao encerrar o orçamento; não conta como build verde.

`check:voz` terminou a 1 porque a planta da agenda chama `check:lugar`, que encontrou 18 apresentações de primeiras edições para 17 documentos e 3479 páginas L1 para o teto 3468. A conta de apresentações foi corrigida para incluir a página inglesa do estudo 06 com documento português, e a medição seguinte já só acusa a L1. O teto L1 conserva 3468. A diferença medida é de treze rotas novas de arquivo e duas retiradas, discriminadas em [l1-pendente.json](l1-pendente.json); falta fechar essa prova e decidir o teto pelas páginas novas sem dispensar páginas antigas.

A planta de discussão pressupunha também um dossiê nas novidades e caiu ao procurar esse nó inexistente. Passou a adulterar a primeira peça efetivamente apresentada; o resultado da corrida final consta do fecho desta passagem. As alterações de código do sítio permanecem sem commit. Nenhuma patch privada do motor foi guardada no sítio.

Conferências concluídas a 0: `check:edicoes`, `check:registo`, `typecheck`, `check:datas`, as plantas VOZ-2A, a conferência das frases prescritas, a diferença autorizada dos livros, a integridade de arquivo e números, a extração do dist, a travessia, `publisher.voz_test` e `core.compor_test`. Também deram 0 as corridas isoladas `check:cadeia`, `check:dados`, `check:mapa`, `check:regioes`, `check:areas`, `check:formas`, `check:lugares`, `check:pais`, `check:nomes`, `check:lingua`, `check:formato`, `check:navegacao` e `sinais`. Os códigos e registos preservados acompanham este relatório.

O `core.gate` iniciado durante o diagnóstico foi interrompido; o hook do commit do motor foi adiado expressamente com `OEDP_GATE=adiado`. Não se declara um core.gate completo verde. Não correram portões integrais nem capturas. Uma inspeção facultativa de processos foi recusada pela sandbox com `operation not permitted: ps`; não houve escalada.

Fecho: `check:discussao` deu 0 depois da correção da planta. O último build foi interrompido com código 130 durante a geração dos cartões. As duas rotas que saem da L1 são `/metodo` e `/en/method`; as treze novas são exclusivamente arquivos datados. A origem da saída das duas páginas do Método ainda não foi diagnosticada; não se alterou o teto.

Orçamento: 120 chamadas de orquestração na contagem manual; 86 corridas registadas por `curto.sh`, incluindo geração, medições, conferências e tentativas interrompidas. Destas, 32 registos contêm conferências `check:*`; os builds incluem mais de uma conferência na mesma corrida. Zero corridas integrais de portões e zero capturas. A contagem de tokens não foi exposta.
