# OG1-B: passagem interrompida na identificação das linhas novas

A integração das linhas novas está incompleta antes desta passagem: existem 57 linhas exportadas e apenas 33 famílias declaradas em `src/data/nomes-og1.mjs`. Faltam as famílias das 24 linhas acrescentadas. A importação de `src/lib/o-que-e-o-numero.mjs` fecha com 48 defeitos, um por linha e edição. A lista exata está em `linhas-sem-familia.json`; a mensagem e o código estão em `familias.log` e `familias.codigo`.

O mandato fornece as frases dos itens, mas não os nomes e as frases de identificação exigidos para esses recibos. O §6 diz «nenhuma frase que não esteja nos §3 e §4». Acrescentar essa prosa excederia o mandato; dispensar a identificação enfraqueceria a régua. A paragem segue o §7. Não foi alterada essa régua, nem qualquer linha do livro ou cruzamento.

## O que ficou preparado, sem entrega ao leitor

As alterações de implementação permanecem na árvore de trabalho, sem commit. Só este recibo e os seus diagnósticos são entregues ao escrivão. Não se declara o bloco concluído, construído ou verde.

- Os dados dos três itens têm duas frases de abertura por item, nas duas edições, e data de reescrita de 28.10.2026. A data de publicação foi conservada.
- O item do Orçamento contém a redação depois do voto, as cinco posições novas e os quatro parágrafos novos das fontes; conserva as seis secções.
- A vista foi preparada para mostrar as aberturas com os recibos; a primeira página foi preparada para usar a primeira frase da abertura. A ordem usa reescrita e, em empate, publicação.
- O guião `scripts/auditoria-das-palavras.mjs` gera 751 folhas dos três itens. A auditoria passa e a prova recusa um apoio falso. As palavras do mandato foram transcritas, mas não houve confronto final com HTML construído.
- A contagem esperada da travessia foi ajustada para 57. Os testes do item foram adaptados para as dezasseis afirmações. As plantas da primeira página estão preparadas, mas ainda não foram executadas contra a construção.

`frases-resolvidas.json` contém 150 títulos e parágrafos, com item, edição, caminho e texto produzido pelo resolvedor. A reprodução está em `extrair-frases-resolvidas.mjs`. Este ficheiro não é `frases-construidas.json`: não houve construção do HTML e não se apresenta texto resolvido como prova de renderização.

## Conferências realizadas

| Conferência com código em ficheiro | Código | Resultado |
| --- | ---: | --- |
| `typecheck` | 1 | Inferência demasiado estreita nas aberturas e nos recibos dos itens. |
| `typecheck-2` | 0 | Passou depois de fornecer a abertura e os recibos no ajudante `item()`. |
| `resolver` | 0 | Títulos e parágrafos resolvidos nas duas edições; nenhum fragmento ausente da fonte. |
| `auditoria-prova` | 0 | Auditoria aceite; apoio falso recusado. |
| `familias` | 1 | As 24 famílias novas não estão declaradas. Bloqueio do mandato. |

Antes destes diagnósticos houve ensaios pontuais de forma. No total: quinze execuções de verificação, das quais cinco com código guardado nesta pasta. Foram duas de tipos, quatro dos dados e do resolvedor, sete do gerador da auditoria (quatro recusadas e três aceites), uma tentativa de `conferirDeclaracoes` interrompida pela identificação das famílias e uma reprodução isolada desse bloqueio. Não se correu `npm run build`, nenhuma corrida inteira dos portões, `verify` ou `conferir-tudo.sh`.

Os ensaios recusados identificaram ainda duas limitações de forma: a guarda de fragmentos tratava o ponto final depois de um número como se fosse parte dele e procurava apenas a primeira ocorrência do trecho; as glosas inglesas repetiam números em texto fixo. As alterações preparadas tratam números completos e todas as ocorrências, e representam a glosa inglesa com fragmentos numéricos da mesma fonte, na mesma ordem. O resolvedor aceita os dados atuais; faltam as plantas específicas e a conferência completa destas alterações. A falha inicial da auditoria vinha de derivados sem excerto e de dois contextos sem tokens; o guião segue as linhas de origem dos derivados e conserva os apoios anteriores nos contextos sem tokens.

## Decisões pequenas

- **OG1-B-1:** retirar `oe-2027-calendario-generalidade` de `apenasDatas`, por deixar de ser usado, e acrescentar `oe-2027-calendario-final-global`. A exclusão continua limitada a datas de contexto; nenhuma medida é escondida.
- **OG1-B-2:** conservar os nomes e atributos da API FP2, incluindo `data-discussao-conclusao`, com comentário explícito de que passam a representar a abertura. Evita alterar os consumidores; o destino da prova passa a `abertura[0]`.
- **OG1-B-3:** fornecer aberturas e recibos no ajudante `item()`, em vez de os atribuir depois da construção dos itens. O segundo `typecheck` passou.
- **OG1-B-4:** apoiar os derivados nos excertos das linhas de origem. Nos contextos antigos sem tokens, conservar as linhas já auditadas. Não inventar excertos para os derivados.
- **OG1-B-5:** preparar glosas inglesas com números provenientes do fragmento citado, sem algarismos em texto fixo. A representação conserva a redação; a proteção adicional ainda precisa das plantas específicas antes de ser aceite.

## Questões abertas e retoma

- **OG1-B-q1:** falta um mandato para os nomes e frases bilingues de identificação das 24 linhas listadas. É necessário fornecê-los ou autorizar a sua redação fundamentada, com as auditorias correspondentes. Não é um pedido de dispensa da régua.
- **OG1-B-q2:** depois de resolver q1, concluir a adaptação das plantas, incluindo números e fontes das glosas; atualizar o inventário das frases e o rasto da revisão `og1-b`; confrontar toda a redação com os §§3 e 4 e com o HTML.
- **OG1-B-q3:** correr as conferências mandatadas e as capturas pelo escrivão. Nenhuma captura foi feita e não há manifesto. O caminho para as conferências que usam navegador ainda não foi preparado nesta passagem.

Não houve alteração ao registo público das correções, à identidade, à navegação, ao Método, aos estudos ou ao motor. A leitura a frio continua por fazer.

## Contagem e entrega

Vinte chamadas de ferramenta até à escrita deste relatório. O pedido de commit do recibo e a inspeção desse resultado são posteriores a esta contagem. O lançador escreve o custo. Não foi exposta uma linha «tokens used».

Sem push.
