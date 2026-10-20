# HB1: A casa em Portugal e na Europa

## Estado da entrega

As edições portuguesa e inglesa estão compostas e commitadas no motor, em `content/28 Habitacao Estudo/`. O escrivão aceitou o commit `980a964ea9eee20f2765580b2b1efae1e4e0bd75` com `GATE: PASS`. O resumo completo é conferido em `commit-motor.json`; a identificação abreviada é `980a964e`.

No sítio estão integrados o arquivo, as leituras, as perguntas, as portas da habitação e das três séries, os documentos, os registos e os recibos. A travessia dos documentos e registos passou, incluindo a comparação dos bytes com o commit de origem. A conferência do renderizador encontrou, em cada edição, cinquenta e quatro blocos, trinta e sete portas por parágrafo e cento e setenta e seis selos.

A entrega do sítio não está concluída. O escrivão recusou os portões com código 9: «portoes: árvore suja; registe as mudanças antes de conferir a cabeça do código». Não foram produzidos `build.codigo`, `verify.codigo` ou `typecheck.codigo`. O commit do sítio exige a linha `Claude-Session` que o mandato diz vir no prompt e não veio; foi pedida, sem inventar ou reutilizar um identificador. Não há capturas HB1, validação visual, publicação nem envio. As verificações dirigidas não substituem os três portões.

## Medição inicial e selagem

Antes de alterar os livros, correu-se `python3 design/especime-v3/medicoes/hb1-2026-10-21/medir.py <motor>`, por `curto.sh`, com código 0. `partida.json` conserva a cabeça inicial, os livros HB, PM e AN, os valores, as unidades, os períodos, as bandeiras, os localizadores e os excertos. O guião recusa identificadores obrigatórios ausentes. Mede um conjunto mais amplo do que os identificadores usados no documento, incluindo todas as observações europeias disponíveis para conferir as posições.

Depois da geração, `python3 design/especime-v3/medicoes/hb1-2026-10-21/selar.py <motor>`, também por `curto.sh`, terminou com código 0. `selagem.json` guarda as provas dos novos excertos no texto extraído dos corpos, os resumos dos corpos e recibos, as contas refeitas das componentes por um avaliador das quatro operações e as comparações de medidas. `partida.json` referencia o ficheiro de selagem pelo seu resumo, sem substituir a medição inicial.

A reprodução dos documentos e registos faz-se no motor por `python3 -m publisher.hb1_build`, depois da recolha por `python3 -m publisher.habitacao_fetch 'content/23 Habitacao/pedidos-hb1.json'`. O gerador continua a ser `publisher/habitacao.py`; `publisher/habitacao_derivadas.py` contém apenas as contas pelas componentes identificadas. A composição passa por `core/compor.py`.

## Decisões e diferenças face ao mandato

- HB1-1. O mandato diz que só a Croácia tem uma percentagem superior à portuguesa de jovens dos vinte e cinco aos trinta e quatro anos a viver com os pais. A ordenação de todas as observações mostra também Grécia, Eslováquia, Polónia, Itália, Espanha, Chipre e Bulgária acima de Portugal. Saiu a frase e o título que a generalizava; conservaram-se os valores e períodos.
- HB1-2. A sobrecarga superior a quarenta por cento do rendimento não demonstra uma renda igual a metade do salário. São limiares, denominadores e despesas diferentes. Saíram as declarações de que os dados provam a frase da plataforma. A citação e os indicadores permanecem separados, sem validação inferida.
- HB1-3. Licenças não são casas concluídas ou oferta disponível. Saiu a conclusão «A oferta não é menor do que na Europa». Ficaram os licenciamentos por habitante, calculados com a população selada.
- HB1-4. Uma maioria vive em casa própria, mas a percentagem sem empréstimo não é uma maioria. As linhas não dizem quando a casa foi comprada ou herdada, nem identificam a causa da evolução da sobrecarga. Saíram a maioria sem empréstimo, a compra anterior à subida e a atribuição causal. A mudança das proporções de ocupação não prova fluxos de compra e arrendamento; saiu também «o país comprou menos a crédito».
- HB1-5. Os índices com base em 2015 medem evolução relativa à base, não o nível absoluto dos preços ou da acessibilidade entre países. O mandato tem a Hungria acima de Portugal no índice nominal. Saiu a frase inicial sem qualificação e o título «é o pior da União». Ficaram a comparação dos índices explicitamente identificados e os valores medidos.
- HB1-6. «O que o Estado faz é pequeno» não tem uma referência de dimensão medida, e a ausência de avaliação no conjunto de documentos não prova que ninguém tenha avaliado as medidas. Saiu o título; ficou a ausência delimitada aos documentos do estudo. Os impactos fiscais negativos são apresentados como impactos na receita, evitando «menos» seguido de um valor já negativo.
- HB1-7. O quadro do programa Habitação do relatório tem uma coluna Orçamento e não uma coluna de estimativa de 2026. `selagem.json` conserva o texto integral dessa página. Não se selou `hab-oe-habitacao-orcamento-2026` nem se calculou a variação condicionada a essa linha. Não se valida nem refuta a afirmação do PCP com outro perímetro.
- HB1-8. A redação do artigo do IRS fixa o limite a partir de 2027, em conjunto com a norma transitória. Selou-se o número novo, mantendo a norma transitória e a proposta do PS ao lado. A proposta não é apresentada como uma novidade já demonstrada.
- HB1-9. As divulgações do INE são posteriores à data desta execução. Mantiveram-se os preços locais do primeiro trimestre e o juro de agosto. Os períodos rendem pela linha de origem. A passagem de sexta-feira continua por fazer e exige o destaque e o anexo trimestral novos.
- HB1-10. A série total do sítio pertence ao `study` «quadro-institucional», que não tem livro correspondente em `content/`. A série dos inquilinos resolve em `content/13 Dominios`. A cópia de trabalho em `Technical Source/series-do-sitio/` conserva as quatro linhas do sítio e os resumos dos YAML, identificando expressamente a origem real. Não se inventou um livro de investigação. A travessia confere o resumo de cada YAML original antes de resolver o identificador; uma cópia divergente fecha a construção.
- HB1-11. As duas medidas de sobrecarga total diferem uma décima apesar de terem a mesma atualização nos corpos alojados. Não há explicação adicional comprovada na fonte: a diferença é entre conjuntos publicados. O INE e o Eurostat coincidem na variação homóloga dos preços. Os alojamentos vagos dos Censos e a habitabilidade alegada pelo PS não são a mesma medida. Os feridos ficam por fonte e nunca são somados.
- HB1-12. Os corpos da RTP para a retirada das tendas e da Euronews para a plataforma não estavam no inventário com os excertos pedidos; foram alojados nesta passagem com recibos e direitos. A página de eventos já alojada contém as reivindicações. A contagem de Lisboa disponível na nova página da RTP diz «Alguns milhares», não «vários milhares» atribuídos à Lusa. Essa linha foi selada com o título atual da página, mas não se substituiu silenciosamente a atribuição à Lusa no documento. Posteriormente alojou-se a notícia do Postal que cita a Lusa: selaram-se «Vários milhares de pessoas» e «mais de 30 organizações». As edições identificam a reprodução pelo Postal, sem a apresentar como um corpo primário da Lusa.
- HB1-13. O anúncio do fundo é descrito como anúncio, sem afirmar uma criação legal cuja publicação não foi demonstrada. Saíram afirmações universais de inexistência de uma série oficial de despejos e a proposta sobre décimos de rendimento sem fonte selada para a sua disponibilidade. As ausências ficam delimitadas aos documentos.
- HB1-14. O compositor aceita períodos por linha, o nome português da medida quando falta uma tradução e datas literais apoiadas no dia documental. A data de publicação só fornece o dia de referência a linhas textuais sem período próprio. O valor estatístico nunca herda uma data de publicação como período.
- HB1-15. A integração usa apenas os elementos comuns necessários de EO1: citações textuais, portas por parágrafo e provas dos corpos. O estudo do Orçamento não pertence ao arquivo desta cabeça; a ligação é condicional à presença real desse estudo. O exportador mantém as guardas de integridade e filtra as edições pelo arquivo efetivo, sem trazer estudos fora do mandato.
- HB1-16. A travessia representa os trimestres `Q` como `T`, conforme o contrato existente do sítio; intervalos conservam a data final e o intervalo completo na nota, como EO1. Ausência de data ou edição rende o marcador da casa, sem inventar uma data documental.
- HB1-17. A conferência etária lia um filtro de pedido que pode conter várias idades. Passou a ler a coordenada da célula e a verificar que pertence ao pedido. A família da linha fornece a definição quando não existe cartão nacional. As plantas recusam uma coordenada fora do pedido e distinguem o total dos jovens.
- HB1-18. As contas arredondadas escrevem `round` na expressão verificada. A primeira tentativa de commit foi recusada por omitir esse arredondamento explícito; corrigiu-se a expressão, sem alterar as componentes ou os resultados.

## Fontes, direitos e limites

Os corpos permanecem no motor. A avaliação de direitos mantém `publicar_corpos: false`; as páginas do sítio não receberam corpos integrais. As citações de imprensa continuam identificadas como imprensa, sem converter a reprodução numa fonte primária da pessoa ou entidade citada. Não há conteúdo sobre vida privada acrescentado ao documento.

## Verificação

`testes.json` e os registos ao lado guardam os códigos das verificações dirigidas. `plantas.json` contém as três classes de estrago nas duas edições: valor, excerto e literal sem apoio. Cada uma foi recusada com a falha esperada; os ficheiros de produção não foram alterados pelas plantas. O teste também muda o período de uma linha numa cópia e confere as duas línguas.

A corrida completa do motor passou no hook do commit. `commit-motor.json` conserva o resultado do escrivão. Os testes dirigidos do sítio conferiram o livro, as afirmações, as famílias, os documentos, a travessia e as portas do renderizador. Os portões completos e as capturas não correram, pela recusa descrita acima.

## Siglas

As expansões introduzidas são INE, IVA, IRS, PSP, IGAI, CGTP, PS, PCP, BE, PAN, IL, PSD, CDS e FEH, com equivalentes na edição inglesa e as siglas portuguesas conservadas nas citações. O primeiro uso no documento composto foi relido nas duas edições; as expansões antecedem as citações posteriores. A revisão visual das portas continua pendente.

## Frases compostas

`frases-renderizadas.json` conserva os parágrafos das duas edições lidos do HTML do motor, sem os reescrever no relatório. São os documentos compostos; a conferência do renderizador correu separadamente, sem os apresentar como páginas já construídas ou fotografadas.


## Continuação necessária

Recebida a linha `Claude-Session`, pedir o commit do sítio ao escrivão com os ficheiros explícitos. Correr `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/hb1-portoes-novos`, ler os três códigos e corrigir as falhas antes de repetir. Depois preparar o pedido de capturas com a cabeça completa de `dist/version.json`, as rotas de estudo e documento nas duas edições e as cinco larguras do mandato, e correr `capturar-pelo-escrivao.sh`. As capturas ainda não foram pedidas, porque não há `dist/` construído.

A passagem do INE continua reservada às divulgações efetivas. A leitura a frio e a aterragem pertencem às passagens seguintes, sem `push` nesta construção.


## Falha adicional de ambiente

A corrida dirigida de `scripts/check-leituras.py` terminou com código 1. O guião `tests/leituras/ferramentas.py` tentou abrir Chromium dentro da sandbox, numa prova sintética, e recebeu `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.66817: Permission denied (1100)`. Essa chamada indireta não devia ter sido feita dentro da sandbox e não foi repetida. Os restantes guiões dessa corrida terminaram com código 0. O registo está em `leituras.log`; esta falha não foi ocultada nem contada como passe. A conferência completa pertence aos portões pelo escrivão.
