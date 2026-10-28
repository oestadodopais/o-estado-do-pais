# OG1-B: as aberturas dos três itens e o Orçamento depois do voto

A passagem ficou concluída no âmbito do mandato e das três adendas. A construção de cabeça limpa e todas as conferências finais pedidas passaram. A leitura a frio e a corrida inteira antes da publicação do ramo continuam a cargo do lugar de direção.

## O que mudou para o leitor

Cada item abre com dois parágrafos de uma frase. A primeira página mostra a primeira frase da abertura e conserva a data de publicação. Os itens ordenam-se pela data de escrita, com desempate pela publicação: o Orçamento fica primeiro. A Saúde explica a diferença entre despesa total e efetiva; as parcerias explicam os encargos líquidos e as receitas descontadas. As duas definições têm os recibos pedidos junto do primeiro parágrafo.

O item do Orçamento apresenta a aprovação na generalidade, os votos por partido, as cinco posições novas, a projeção e os riscos do Conselho das Finanças Públicas e as leituras dos juros. Conserva as seis secções, os onze parágrafos anteriores de «Como foi dito» e os seis anteriores de «O que as fontes dizem», acrescentando os cinco e os quatro autorizados. A opinião inglesa usa a redação da segunda adenda, sem exceção contextual de voz.

## Construção e confronto das frases

A cabeça construída é `aa7d0b1fe76c5d83de2653eb25287a55a02d35ab`, commit `aa7d0b1fe`. `cabeca-limpa.json` regista a árvore limpa antes e depois do `build` e a igualdade entre o carimbo do HTML e a cabeça do Git. O `build` terminou com código 0. Depois da construção, apenas os artefactos deste relatório foram escritos.

`frases-construidas.json` contém as 46 entradas extraídas do HTML nas duas edições, com rota, item, caminho e texto: títulos e parágrafos novos ou mudados, mais as seis aberturas da primeira página. Todas coincidem com a transcrição do mandato e das adendas, substituindo os tokens pelos campos das linhas. O guião `extrair-frases-construidas.mjs` faz esse confronto com `mandato-frases.json`, incluindo a frase inglesa corrigida.

## As quatro causas fechadas

- O lugar de direção declarou as 24 linhas nas áreas e no lugar Portugal, em `d330d60ac`. Estes dois ficheiros não foram alterados nesta retoma.
- O mapa independente `documentosOg1` recebeu os cinco documentos nacionais autorizados, com ficheiro e título copiados das provas. `check:pais` passou; as plantas de excerto e endereço adulterados continuam ativas.
- As duas linhas vivas do inventário foram substituídas pelos esqueletos exatos impressos pelo portão. Nenhuma palavra do sítio foi alterada nesta retoma.
- A L1 mediu 3 452 páginas, mais 48 do que a base de 3 404. `l1-og1b.json` guarda a contagem por rota, as 48 rotas novas e a cabeça do HTML medido antes da reconstrução. Todas as rotas novas são recibos OG1 nas duas edições; nenhuma rota da base desapareceu. O teto passou para esse número medido. A conferência final da cabeça limpa confirmou o mesmo teto com código 0.
- O teste dos recibos só procura uma pessoa quando a prova tem atribuição. Sem pessoa, exige a ausência de campos de atribuição; continua a conferir o editor nos lugares em que é impresso. O teste OG1 terminou com 628 conferências nas duas edições.

## Conferências e plantas

Os códigos lidos dos ficheiros estão em `conferencias-retoma-3.json`. As duas corridas de base reproduziram os defeitos conhecidos; os resultados finais são todos zero. O código 0 da planta da pessoa significa que o ensaio passou porque o portão devolveu 1 para o recibo adulterado.

| Execução | Código |
| --- | ---: |
| `build` | 0 |
| `capturas` | 0 |
| `check-cruzamento` | 0 |
| `check-discussao` | 0 |
| `check-lingua` | 0 |
| `check-lugar` | 0 |
| `check-pais` | 0 |
| `check-palavras` | 0 |
| `check-registo` | 0 |
| `check-rotulos` | 0 |
| `check-voz` | 0 |
| `frases` | 0 |
| `gate-html` | 0 |
| `l1-base` | 1 |
| `ledger-check` | 0 |
| `planta-pessoa` | 0 |
| `typecheck` | 0 |
| `voz-base` | 1 |
| `check:frases-compostas` | 0 |
| `check:primeira` | 0 |

Foram 19 execuções principais de verificação e uma execução de capturas nesta retoma. Os comandos internos da cadeia `build` não são contados de novo. Não se correu o `verify` completo nem `conferir-tudo.sh`. O único pedido de portões ao escrivão usou o perfil fechado `og1-b-navegador`, com `check:frases-compostas` e `check:primeira`.

- A discussão passou com zero erros, 766 de 766 plantas com mordida e 764 portas de integração. Inclui as plantas FP2 de data diferente, duas frases, frase de outro item, valor trocado e parágrafo em falta, nas duas edições. O destino da prova é a abertura. As plantas de citação apontam agora para «Como foi dito».
- As nove glosas conservaram os textos; 60 plantas de número, fonte, campo, duplicação, ordem e corte de número foram recusadas. As unidades ficam antes do selo, sem mudança de palavras.
- A planta de pessoa inventada acrescentou um campo `attributed_to` ao recibo português da votação. A célula existente de `gate:html` recusou-o por a linha não ter esse campo. `planta-pessoa.json` guarda o resultado. O recibo foi restaurado byte a byte antes da construção; não foi necessária uma nova dispensa nem uma nova célula.
- No navegador, a conferência de frases compostas mediu 32 passagens em 16 páginas, 4 024 pedaços marcados, nenhum em contentor flexível e nenhum documento mais largo do que a janela; as 52 plantas morderam. Foram também conferidos 472 caminhos por clique a 390 px.
- A lista de palavras passou com 23 de 23 plantas e zero achados em 9 807 páginas.

Os registos anteriores conservam a prova `--prova` do gerador da auditoria: o apoio literal falso é recusado. O gerador escreve as 751 folhas dos três itens, conserva os apoios contextuais das folhas intactas e resolve os derivados pelos excertos das linhas de origem. As 57 famílias têm nome, frase e auditoria; nenhuma linha do livro foi editada à mão.

## Inventário e capturas

O inventário tem 30 linhas novas de parágrafos e 12 linhas reescritas de títulos, secções e portas, além das duas contagens atualizadas do livro. A revisão `og1-b` está «por ler», com a razão do mandato: a leitura a frio é do Opus. A correção desta retoma limitou-se aos dois esqueletos ingleses identificados na terceira adenda.

O escrivão produziu 20 capturas de página e 40 recortes nas larguras 390, 768, 1 024, 1 280 e 1 600, nas duas edições da primeira página e da discussão. Não houve erros do navegador, pedidos externos, respostas recusadas ou transbordo horizontal. `capturas.json` prende as imagens, recortes e recursos à cabeça construída; `pedido-capturas.json` conserva os seletores e as rotas.

Os PNG ficaram fora do repositório, em `<temporario>/og1-b-r3-capturas`. Foram inspecionados oito recortes: a primeira página e a primeira abertura de cada item, em português a 390 px e em inglês a 1 280 px. As aberturas e os selos estão legíveis. `inspecao-visual.json` identifica a amostra; a inspeção não substitui a leitura a frio de todos os parágrafos.

## Decisões e questões

- **OG1-B-1:** sai a data de generalidade não usada; entra a votação final global em `apenasDatas`.
- **OG1-B-2:** conservam-se os nomes e atributos FP2, incluindo `data-discussao-conclusao`, com comentário; a prova aponta para `abertura[0]`.
- **OG1-B-3:** o ajudante `item()` recebe as aberturas e os recibos.
- **OG1-B-4:** os derivados usam os excertos das linhas de origem; folhas intactas conservam os apoios contextuais e a prova específica da contagem. Sem excertos inventados.
- **OG1-B-5:** glosas numéricas ligadas aos fragmentos, com as mesmas palavras e números completos. Plantas específicas aprovadas; unidades antes do selo.
- **OG1-B-6:** o portão OG1 reconhece o caminho exato do relatório selado e a página exata do CFP, conservando as comparações de ficheiro, hash, data, valor e fonte.
- **OG1-B-7:** o perfil fechado `og1-b-navegador` executa apenas as duas conferências autorizadas. Ambas passaram.
- **OG1-B-q1:** fechada: as famílias foram declaradas pela primeira adenda e auditadas.
- **OG1-B-q2:** fechada: cabeça limpa construída, contagens atualizadas, glosas e plantas aprovadas, conferências concluídas.
- **OG1-B-q3:** fechada: navegador e capturas concluídos.
- **OG1-B-q4:** fechada: redação inglesa da segunda adenda aplicada; voz aprovada, sem exceção contextual.
- **OG1-B-q5:** fechada: declarações de língua aplicadas e conferência aprovada.
- **OG1-B-q6:** fechada pelo lugar de direção em `d330d60ac`: matérias e lugar das 24 linhas declarados; origem nacional também conferida.
- **OG1-B-q7:** fechada: recibos sem pessoa tratados no teste, editor conferido e pessoa inventada recusada pelo portão existente.

## As quatro passagens e os commits

| Passagem | Chamadas | Execuções de verificação | Resultado |
| --- | ---: | ---: | --- |
| Inicial | 23 | 15 | Paragem nas famílias; recibo `d443ffd42`. |
| Primeira retoma | 35 | 22 | Famílias resolvidas; paragem lexical; implementação `71aced123`, recibo `44a88d568`. |
| Segunda retoma | 26 | 4 | Segunda adenda aplicada; paragem A7; implementação `18ea0891b`, recibo `70cbf201d`. |
| Terceira retoma | 34 | 19 | Quatro causas resolvidas, construção e conferências aprovadas, mais uma execução de capturas. |

A contagem desta retoma é de 30 chamadas até à inspeção visual; a escrita e a revisão deste recibo, o pedido de commit e a inspeção final acrescentam quatro chamadas. Os relatórios das duas retomas anteriores estão preservados em `LEIA-ME-retoma-1.md` e `LEIA-ME-retoma-2.md`; os seus resultados vermelhos são históricos, não o estado final.

A implementação desta retoma está em `aa7d0b1fe`. O último commit entrega apenas o relatório e os artefactos de verificação, por isso não exige uma nova construção do sítio. O custo é escrito pelo lançador; não foi exposta uma linha «tokens used».

Nenhuma alteração ao motor, ao registo público das correções, à identidade, à navegação, ao Método ou aos estudos. Nenhuma régua de número, fonte ou pessoa foi dispensada. A subida autorizada da catraca L1 está medida e explicada acima.

Sem push.
