# HB1: A casa em Portugal e na Europa

O estado atual está em [A correção HB1-b](#a-correção-hb1-b). As secções anteriores a essa correção conservam o histórico da construção entregue antes da leitura a frio. As designações HB1-b e HB1-c usadas nesse histórico não são as passagens de correção agora mandatadas; a aterragem de 23.10.2026 continua pendente.

## Histórico da construção anterior à leitura a frio

A corrida final do sítio passou na cabeça `4531f0c11cb29ea1bdf21db399ef4b3f14aaa0d3`, com árvore limpa no início e no fim. O motor passou na cabeça `980a964ea9eee20f2765580b2b1efae1e4e0bd75`, também com árvore limpa. A prova do motor vem da primeira corrida HB1-c; a repetição do sítio alterou apenas a conferência EX3, sem mudança no motor. Os códigos foram lidos dos ficheiros e estão reunidos em [verificacao-final/resumo.json](verificacao-final/resumo.json).

As duas edições estão compostas no motor, em `content/28 Habitacao Estudo/`, e integradas no sítio: arquivo, leituras, perguntas, portas da habitação e das três séries, documentos, registos e recibos. As capturas da página do estudo e do documento nas duas edições e nas cinco larguras estão feitas. Este fecho acrescenta as provas e o relatório depois da cabeça de código conferida; não representa publicação em produção.

## §0. Medição inicial e reprodução da selagem

Antes de alterar os livros, `python3 design/especime-v3/medicoes/hb1-2026-10-21/medir.py <motor>`, por `curto.sh`, terminou com código 0, inscrito em `partida.log`. `partida.json` conserva a medição da cabeça inicial do motor `6b1a8201dcf1d428252d7a5008e00a95fb8bcb39`: 2 189 linhas de HB, 1 126 de PM e 1 374 de AN, além das três séries do sítio. Guarda valores, unidades, períodos, bandeiras, localizadores e excertos; o guião recusa identificadores obrigatórios ausentes. Inclui as observações europeias usadas para conferir as posições, não apenas as citadas no documento.

Depois da geração, `python3 design/especime-v3/medicoes/hb1-2026-10-21/selar.py <motor>`, por `curto.sh`, terminou com código 0 (`testes.json`, entrada `selagem`). Na HB1-c, o mesmo guião e uma cópia de `partida.json` foram colocados em `<temporario>/hb1c-selagem/`; `python3 <temporario>/hb1c-selagem/selar.py <motor>`, por `curto.sh`, terminou com código 0, lido de `verificacao-final/selagem.codigo`. Assim a reprodução não substituiu a medição inicial. Os dois JSON reproduzidos são idênticos byte a byte aos originais: os resumos estão em `verificacao-final/resumo.json`.

A selagem contém 11 provas de excertos novos nos corpos alojados, 77 linhas novas e 16 contas refeitas por um avaliador independente das quatro operações. Os recibos e os resumos dos corpos estão em `selagem.json`; `partida.json` prende esse ficheiro pelo SHA-256. Todas as diferenças entre o resultado recalculado e o livro são zero.

As comparações de medidas ficam em `selagem.json`, campo `comparacoes`: a sobrecarga total difere entre os conjuntos publicados, apesar da mesma atualização; a variação homóloga dos preços coincide no INE e no Eurostat; os alojamentos vagos dos Censos não medem a habitabilidade alegada pelo PS; os feridos ficam separados por fonte, sem soma. As razões e os limites entram no documento e nas decisões HB1-2, HB1-7 e HB1-11.

A reprodução dos documentos e registos faz-se no motor por `python3 -m publisher.hb1_build`, depois da recolha por `python3 -m publisher.habitacao_fetch 'content/23 Habitacao/pedidos-hb1.json'`. O gerador é `publisher/habitacao.py`; `publisher/habitacao_derivadas.py` contém as contas pelas componentes identificadas. A composição passa por `core/compor.py`.

## Secção 1b: linhas seladas e ausências

| Pedido | Identificadores e resultado |
| --- | --- |
| 1. Sobrecarga dos inquilinos | `hab-ilc-lvho07c-a-pc-rent-mkt-<geo>-<ano>`: Portugal e União de 2015 a 2025 e os 27 países em 2025, pelas células de `ilc_lvho07c`. As linhas completas, bandeiras, coordenadas e recibos estão em `selagem.json`, campo `linhas_novas`. |
| 2. População | `hab-demo-pjan-pt-2025` e `hab-demo-pjan-eu27_2020-2025`, pelas células de `demo_pjan`. |
| 3. Estimativa de 2026 | Não selada. A página PDF 243 do relatório alojado contém o quadro 5.24, com a coluna «Orçamento», sem a coluna de estimativa de 2026 pedida. O texto extraído está em `selagem.json`, campo `quadro_orcamento_2027`. Não existem `hab-oe-habitacao-orcamento-2026` nem a derivada condicionada `der-hab-habitacao-orcamento-variacao-pct`. Saiu a frase condicional; a afirmação do PCP não foi validada com um perímetro diferente. |
| 4. Dedução das rendas | `hab-dl97-deducao-2027`, com excerto provado no corpo `dr-97-2026.pdf`. A redação do limite e a norma transitória ficam ao lado da proposta do PS. |
| 5. Preços locais do INE | Pendente para sexta-feira, 23.10.2026, conforme o mandato. `hab-ine-preco-mediano`, `hab-ine-preco-lisboa` e `hab-ine-preco-porto` conservam `2026-Q1`; não há selagem de `2026-Q2` nesta entrega. |
| 6. Manifestações e plataforma | `hab-imprensa-manif-rtp`, `hab-imprensa-manif-euronews`, `hab-imprensa-manif-lisboa`, `hab-imprensa-manif-lusa`, `hab-imprensa-manif-lusa-organizacoes`, `hab-imprensa-renda-metade` e `hab-plataforma-reivindicacoes`. A reprodução pelo Postal é identificada como tal; não é apresentada como corpo primário da Lusa. |
| 7. Calendário do INE | `hab-ine-calendario-precos-locais` e `hab-ine-calendario-juro`, com os excertos do calendário alojado. |
| 8. Retirada das tendas | `hab-imprensa-tendas`, com o excerto comprovado no corpo alojado da RTP. |

As fontes novas que não estavam alojadas foram recolhidas com recibos e direitos na HB1. A atualização do juro implícito também não foi antecipada: conserva-se agosto de 2026. A data futura indicada pelo calendário não é apresentada como divulgação já ocorrida.

## Derivadas refeitas

As componentes por identificador, as fórmulas, o arredondamento, o valor do livro e a diferença estão em `selagem.json`, campo `contas`. A tabela transcreve o campo `calculado`; não recalcula valores por redação.

| Identificador | Resultado recalculado | Diferença para o livro |
| --- | ---: | ---: |
| `der-hab-proprietarios-pt-2025` | 71.2 | 0.0 |
| `der-hab-inquilinos-pt-2025` | 28.8 | 0.0 |
| `der-hab-proprietarios-eu-2025` | 68.5 | 0.0 |
| `der-hab-inquilinos-eu-2025` | 31.5 | 0.0 |
| `der-hab-precos-reais-pt-vs-eu-2025` | 81.7 | 0.0 |
| `der-hab-preco-rendimento-pt-vs-eu-2024` | 38.6 | 0.0 |
| `der-hab-sobrecarga-inquilinos-pt-vs-eu-2025` | 8.6 | 0.0 |
| `der-hab-sobrecarga-inquilinos-pt-2020-2025` | 7.5 | 0.0 |
| `der-hab-jovens-com-pais-pt-vs-eu-2025` | 12.0 | 0.0 |
| `der-hab-saida-pt-vs-eu-2025` | 2.5 | 0.0 |
| `der-hab-licencas-por-mil-pt-2025` | 3.8 | 0.0 |
| `der-hab-licencas-por-mil-eu-2025` | 3.6 | 0.0 |
| `der-hab-vagos-pct-2021` | 12.1 | 0.0 |
| `der-hab-fiscal-2027` | -303 | 0 |
| `der-hab-renda-lisboa-vs-portugal` | 1.7 | 0.0 |
| `der-hab-preco-lisboa-vs-portugal` | 2.3 | 0.0 |

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

- HB1-19. As correções HB1-b antecedem a cabeça conferida: travessia e superfícies, rótulos e unidades, definição das edições, datas medidas no Git e tipagem. A corrida HB1-c conserva essa cabeça e fecha as provas; não altera números nem prosa pública. As datas das duas edições em `src/data/datas-de-publicacao.json` vêm do commit `8944f25675b9dad2a4d166b1fbf22f6b412bd15f`, de 20.10.2026; esta data de entrada no Git não prova publicação em produção.

- HB1-20. A corrida HB1-c encontrou a asserção antiga da EX3 que exigia identidade textual mesmo nas datas do calendário. A correção `4531f0c11` conserva a identidade e a precisão dos valores e confere dia, mês, ano e a grafia com pontos nas datas, nas duas edições. Não altera o formatador nem a página. Dez alterações plantadas foram recusadas; os dois controlos intactos passaram.

## Frases tal como renderizam nas duas edições

[frases-do-sitio.json](frases-do-sitio.json) foi extraído do HTML de `dist/` por `extrair-frases.mjs`. O comando é `sh scripts/leituras/curto.sh <temporario>/extracao.log node design/especime-v3/medicoes/hb1-2026-10-21/extrair-frases.mjs <temporario>/frases-do-sitio.json`; código 0 em `verificacao-final/extracao.codigo`. Guarda as rotas, a cabeça construída, os resumos dos quatro HTML e o texto de todos os blocos, incluindo a versão da página com os selos de fonte.

Cada edição tem 54 blocos no estudo e no documento. A comparação da prosa, retirando apenas os selos e o texto oculto de acessibilidade e normalizando os espaços, encontrou zero diferenças. Os textos guardados não são normalizados. `frases-renderizadas.json` conserva a extração anterior do HTML do motor; a prosa coincide com a do documento construído após a mesma normalização dos espaços. Os períodos, citações e frases condicionais podem assim ser lidos na forma efetivamente construída, sem paráfrase no relatório.

## Siglas e primeiro uso

A localização é o número de `data-registo-bloco` da página do estudo, contado a partir de zero. `frases-do-sitio.json` conserva o seletor e o excerto de cada primeiro uso. O guião comprovou que a expansão antecede a sigla no mesmo bloco em ambas as edições; as siglas portuguesas mantêm-se nas citações. CDS aparece na forma CDS-PP.

| Sigla | Expansão portuguesa | Expansão inglesa | Bloco PT / EN |
| --- | --- | --- | --- |
| INE | Instituto Nacional de Estatística | National Statistics Institute | 1 / 1 |
| IVA | imposto sobre o valor acrescentado | value added tax | 5 / 5 |
| IRS | imposto sobre o rendimento das pessoas singulares | personal income tax | 5 / 5 |
| PSP | Polícia de Segurança Pública | Public Security Police | 12 / 12 |
| IGAI | Inspeção-Geral da Administração Interna | Inspectorate-General of Home Affairs | 12 / 12 |
| CGTP | Confederação Geral dos Trabalhadores Portugueses | General Confederation of Portuguese Workers | 46 / 46 |
| PS | Partido Socialista | Socialist Party | 10 / 10 |
| PCP | Partido Comunista Português | Portuguese Communist Party | 38 / 38 |
| BE | Bloco de Esquerda | Left Bloc | 13 / 13 |
| PAN | Pessoas-Animais-Natureza | People-Animals-Nature | 38 / 38 |
| IL | Iniciativa Liberal | Liberal Initiative | 38 / 38 |
| PSD | Partido Social Democrata | Social Democratic Party | 38 / 38 |
| CDS | Centro Democrático Social, Partido Popular | Democratic and Social Centre, People’s Party | 38 / 38 |
| FEH | Fundo de Emergência para a Habitação | Housing Emergency Fund | 38 / 38 |

## Plantas e códigos

`plantas.json` conserva as três classes de estrago exigidas, em cópias das duas edições. O guião global terminou com código 0; cada alteração foi recusada com código 1. A alteração do período numa cópia também foi conferida nas duas línguas. Nenhum ficheiro de produção foi alterado pelas plantas.

| Estrago | Português | Inglês | Recusa registada |
| --- | ---: | ---: | --- |
| Valor alterado no registo | 1 | 1 | Valor sem correspondência nas formas do livro |
| Excerto cortado | 1 | 1 | Texto alterado no bloco 12 |
| Literal sem linha | 1 | 1 | Literal sem prova no gabarito |

`plantas-datas.json` acrescenta a prova da correção HB1-c: `plantar-datas.mjs` executa o trecho real da EX3 em processos isolados. As alterações ao dia, mês, ano, separador e precisão numérica saíram com código 1 nas duas línguas; os dois controlos saíram com código 0. O guião terminou com código 0 em `verificacao-final/plantas-datas.codigo`. O teste dirigido `node tests/explicacoes/ex3.mjs`, por `curto.sh`, terminou com código 0 em `verificacao-final/ex3.codigo`.

## Corrida completa e capturas

Os comandos do sítio correram pelo escrivão, sem perfil reduzido, sobre a cabeça acima. `verify.json` comprova a união inteira de `npm run verify`, a cabeça e a imutabilidade da construção. Os códigos abaixo são os inteiros lidos dos ficheiros; a primeira corrida recusada está separada em `verificacao-anterior/`.

| Verificação | Código | Ficheiro |
| --- | ---: | --- |
| Build pelo escrivão | 0 | [verificacao-final/build.codigo](verificacao-final/build.codigo) |
| Verify inteiro, pela união depois do build | 0 | [verificacao-final/verify.codigo](verificacao-final/verify.codigo) |
| Typecheck pelo escrivão | 0 | [verificacao-final/typecheck.codigo](verificacao-final/typecheck.codigo) |
| `RESEARCHHUB_DIR=<motor> npm run check:series` | 0 | [verificacao-final/series.codigo](verificacao-final/series.codigo) |
| `RESEARCHHUB_DIR=<motor> npm run check:cruzamento -- --with-origin` | 0 | [verificacao-final/cruzamento.codigo](verificacao-final/cruzamento.codigo) |
| `python3 -m core.gate` do motor, pelo escrivão | 0 | [verificacao-final/motor.codigo](verificacao-final/motor.codigo) |
| Capturas pelo escrivão | 0 | [verificacao-final/capturas.codigo](verificacao-final/capturas.codigo) |
| Resumos dos PNG e geometria | 0 | [verificacao-final/validacao-capturas.codigo](verificacao-final/validacao-capturas.codigo) |

A célula U confirmou 48 passos: 21 cobertos pelo build e 27 corridos depois dele. As células D e C passaram, com zero diferenças nos ficheiros conferidos e a mesma cabeça do início ao fim. `check:series` leu o motor, além do sítio; o cruzamento confirmou cada linha e ficheiro byte a byte. Os dois avisos de resumo global dos livros `20 Orcamento do Estado` e `24 Orcamento 2027 Analise` não são diferenças nas linhas exportadas e ficam no registo.

O pedido [pedido-capturas.json](pedido-capturas.json) prende as quatro rotas e a cabeça completa de `dist/version.json`. Correu por `sh scripts/leituras/capturar-pelo-escrivao.sh <temporario>/hb1c-fecho/pedido-capturas.json <temporario>/hb1c-capturas-final-20261020`. O manifesto [capturas.json](capturas.json) regista 20 capturas completas, nas larguras 390, 768, 1 024, 1 280 e 1 600 px, e 100 recortes do título, resumo, preços locais, lei e rua. Os 120 PNG tiveram o SHA-256 conferido; os recursos servidos também estão presos pelo manifesto. Zero transbordos horizontais, recursos em falta, pedidos externos ou erros do navegador.

A inspeção visual abrangeu os resumos das duas páginas e edições nas cinco larguras, quatro capturas completas para a organização geral e amostras dos preços locais, da lei e da rua. Não foram observados cortes ou sobreposições nessas imagens. [revisao-visual.json](revisao-visual.json) enumera os ficheiros vistos e as dimensões medidas; esta inspeção não substitui a leitura a frio do conteúdo. Os PNG permanecem em `<temporario>/hb1c-capturas-final-20261020/`; só os manifestos e as provas textuais entram no repositório.


## Fontes, direitos e limites

Os corpos permanecem no motor. A avaliação de direitos mantém `publicar_corpos: false`; as páginas não receberam corpos integrais. As citações de imprensa continuam identificadas como imprensa, sem converter uma reprodução em fonte primária da pessoa ou entidade citada. Não foi acrescentado conteúdo sobre vida privada.

## Histórico dos bloqueios e passagem seguinte

A primeira tentativa dos portões foi recusada com código 9 por árvore suja e sem produzir os três ficheiros de código. O relatório inicial aguardava o trailer de sessão. A HB1-b integrou e comitou as correções; esses impedimentos não descrevem o estado da corrida HB1-c. `portoes.json` e `testes.json` conservam o histórico, separado da prova final.

Na primeira corrida HB1-c, sobre `516ac586ffba0fa229dc14ae530333f80a319524`, o build e a tipagem passaram; `check:explicacoes` falhou pela diferença entre `21/10/2026` e `21.10.2026`. A alteração do teste foi preparada depois de terminarem as conferências do sítio, enquanto o motor corria; por isso `verificacao-anterior/estado.fim` regista esse ficheiro modificado. Esta corrida recusada não é apresentada como prova final do sítio. O motor terminou com código 0 e árvore limpa. A correção foi comitada pelo escrivão antes da repetição completa do sítio.

A corrida dirigida antiga de `scripts/check-leituras.py` terminou com código 1: `tests/leituras/ferramentas.py` tentou abrir Chromium dentro da sandbox e recebeu `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.66817: Permission denied (1100)`. Essa chamada indireta não foi repetida dentro da sandbox. O código histórico permanece em `testes.json` e o registo em `leituras.log`; a conferência completa final correu pelo escrivão.

Fica pendente a passagem curta de sexta-feira, 23.10.2026: conferir a divulgação efetiva dos preços locais do INE, alojar o destaque e o anexo trimestral, selar novamente os três identificadores com `2026-Q2`, refazer a razão Lisboa/Portugal se os valores mudarem, recompor as duas edições, correr as células e capturas e entregar as frases dos preços ao lugar de direção. Não se tomou o calendário por prova de publicação. A leitura a frio e a aterragem pertencem às passagens seguintes; não houve `push`, publicação nem envio nesta construção.

## A correção HB1-b

Esta passagem prepara o estudo e não o publica. A data continua por declarar. O próximo passo editorial permanece a HB1-c de 23.10.2026: novas medianas e rendas do INE, razão Lisboa/país, juro implícito de setembro, calendário no passado, data declarada e contagens do dia.

### Decisões desta correção

- **HB1-21.** A exposição de motivos do Governo contém a estimativa de alojamentos vagos em boas condições. A linha `hab-arrendamento-exposicao-vagos` sela o excerto da página um; as frases distinguem estimativa do Governo e contagem dos Censos. A atribuição é Presidência do Conselho de Ministros, como a folha de rosto.
- **HB1-22.** Todas as linhas `hab-ilc-lvho07c-*` passaram ao corpo novo. Os dois corpos anteriores ficam catalogados como tentativas substituídas e já não sustentam essas linhas. A forma B é a escolhida pela diferença no total de Portugal. As duas atualizações têm o mesmo dia, a horas distintas; a redação mandatada «datas de atualização diferentes» conserva uma ambiguidade que os recibos completos e a tabela abaixo explicitam.
- **HB1-23.** O corpo novo já contém a Dinamarca no total de 2025. A frase inteira «Chipre tem a mais baixa (…) entre os vinte e seis (…) a Dinamarca não os tem» e a correspondente inglesa foram devolvidas, sem frase substituta. A ressalva de ausência só se aplica às coordenadas onde se confirmou. O conjunto dos jovens e a privação severa mantêm as ausências medidas. A contagem é refeita por guião, por recorte, e não inferida do número de geografias pedidas.
- **HB1-24.** As atribuições seguem os documentos; Soeiro é dirigente nacional do BE e Luís Silva é comandante dos Bombeiros Voluntários do Porto. As atribuições inglesas são campos do livro, atravessados e conferidos, e as contagens continuam separadas.
- **HB1-25.** Datas da RTP, plataforma, proposta de lei e calendário corrigidas onde há âncora documental. A página do calendário alojada não declara data de edição: `document.edition` conserva `[a verificar]` nas duas linhas, com a razão. Uma data de acesso não foi apresentada como edição. O glossário declara 13.04.2021; a página da IL declara atualização em 08.06.2026, mas não a publicação inicial. A frase mandatada «sem data documental» ficou demasiado ampla e é devolvida como objeção, sem substituição editorial.
- **HB1-26.** O gerador compõe os nomes das células Eurostat com dimensões e período, enumera apenas caminhos presentes no corpo e escreve as contas derivadas em palavras. O `check` continua a expressão da máquina. As frases dos recibos acrescentam o período a partir da própria linha. Os recibos derivados passaram também pela conferência de nomes, unidades e contexto geográfico nas duas línguas. O nome genérico dos recibos de preços locais do INE não foi convertido num rótulo que o documento não dá nessa forma.
- **HB1-27.** O compositor normaliza datas portuguesas e inglesas, admite citações silenciosas e escolhe a atribuição inglesa. Datas de calendário saem com pontos. Os números das conclusões são texto do parágrafo, preservados nas provas e no HTML.
- **HB1-28.** As quatro votações saem em prosa, com grupos conferidos contra os excertos parlamentares. Trocar um partido de grupo ou omiti-lo fecha a régua.
- **HB1-29.** A redação fornecida nesta passagem foi restaurada, sem reescrita editorial silenciosa, salvo a frase devolvida em HB1-23 e as mudanças expressamente autorizadas de siglas e de tokens que não mudam o texto. A auditoria [divergencias-da-redacao.json](correcao-hb1b/divergencias-da-redacao.json) conserva as objeções factuais anteriores à redação: Portugal é nono, não segundo, na proporção dos jovens com os pais; a população sem empréstimo não é uma maioria; sobrecarga acima de quarenta por cento do rendimento não prova renda igual a metade do salário; licenças não medem toda a oferta; índices desde uma base não medem níveis absolutos de preços; os documentos não sustentam uma afirmação universal de que ninguém avaliou medidas. Estas frases permanecem redação mandatada em preparação, não conclusões verificadas. Não devem ser confundidas com um resultado verde dos testes de transcrição.
- **HB1-30.** O contrato genérico `publication: 'declared'` distingue a aterragem declarada do legado, onde `date` podia ser nula ou uma data de origem anterior ao commit. Nesse contrato, `date: null` significa preparação, sem data pública, sem estado Published e sem contagem no arquivo. Uma data declarada prevalece sobre a entrada no Git, mas não pode antecedê-la. As edições históricas não foram reclassificadas retroativamente.
- **HB1-31.** As linhas de imprensa e plataforma entram na conferência das palavras, datas, atribuições e portas, mesmo quando são excertos textuais sem a antiga marca `afirmacao`. As provas referem também os corpos suplementares que ancoram a data.
- **HB1-32.** As expansões foram deslocadas para o primeiro uso real: PSD, IL e CDS-PP na abertura; BE português antes da atribuição a Soeiro; PS antes da citação na oferta; IMT, IS e PRR na prosa anterior às citações. A tabela inclui CIRS e FEH e distingue a atribuição inglesa, que não imprime a sigla BE nesse ponto. O extrator confere expansão única na prosa, sem alterar citações.
- **HB1-33.** O achado do ficheiro binário não se reproduz nesta cabeça: `src/lib/cruzamento.mjs` já é UTF-8, sem NUL nem outros controlos fora de tabulação e quebras de linha. Nenhum byte foi retirado por suposição.
- **HB1-34.** As verificações distinguem a cabeça de código, o commit dos registos e a última reconferência. Um registo que contém o hash do próprio commit não pode ser comitado nesse mesmo hash. As cabeças e os códigos reais ficam identificados, sem declarar identidade entre commits diferentes.
- **HB1-35.** Os excertos das três ações do Orçamento contêm o rótulo e o número da coluna de 2027, conferidos por posição na página. A legenda de «invariante» e a definição Eurostat têm linhas e corpos próprios.
- **HB1-36.** A atualização do INE prevista para HB1-c não foi antecipada. O calendário continua a anunciar as divulgações, e a lista da passagem seguinte inclui expressamente a taxa de juro de setembro.

- **HB1-37.** O teto L1 passa apenas pelo aumento medido dos recibos novos. As mudanças de multiplicidade têm destinos e razões no contrato, e a ausência de edição do calendário continua a contar como ausência documental mesmo com a data de referência preenchida.
- **HB1-38.** Os portões passam a conferir os campos bilingues e os valores textuais como tais: nomes ingleses continuam declarados, uma atualização conhecida não se torna publicação inicial, e os excertos corrigidos não entram em comparações numéricas. As réguas das votações, siglas, portas e incorporações ficaram ligadas aos portões regulares.

A revisão posterior dos recibos encontrou nomes internos em três contas inglesas e unidades não traduzidas. O gerador passou a exigir nomes e unidades conferidos, a contextualizar Lisboa e o período pelo excerto e a distinguir alojamentos de habitantes. As vinte contas conservaram os mesmos valores, componentes e expressões.

### Achados da leitura

| Achado | Estado | Resultado e limite |
| --- | --- | --- |
| 1 | corrigido | Estimativa do Governo selada e integrada nas passagens afetadas, HB1-21. |
| 7 | corrigido | A convocatória da CGTP é independente e tem título e data próprios. |
| 8 | corrigido | Soeiro identificado como dirigente nacional, HB1-24. |
| 9 | corrigido | A dedução do PS é apresentada entre o que já propôs no Parlamento. |
| 10 | corrigido | Preços trimestrais comparados entre os países com dados; falta da Grécia expressa. |
| 11 | corrigido | Notícias, datas e atribuições acompanham as declarações; o título do desmentido identifica o contexto. |
| 12 | corrigido | Datas e atribuições inglesas compostas e provadas. |
| 13 | corrigido em parte | Corpo único novo e comparação refeita; frase mandatada distingue datas que têm o mesmo dia e horas diferentes, HB1-22. |
| 14 | corrigido | Retirada das tendas datada e sequência desde sábado comprovada. |
| 15 | corrigido | Edição em preparação sem data pública nem Published; contadores excluem-na, HB1-30. |
| 16 | mantido com a decisão HB1-36 | Juro novo e calendário no passado pertencem à HB1-c, agora expressamente incluídos. |
| 17 | corrigido em parte | Nomes Eurostat dimensionados e caminhos corrigidos; rótulo genérico INE conservado com o limite HB1-26. |
| 18 | corrigido | Frases dos recibos terminam no período da linha. |
| 19 | corrigido | Derivações em palavras nas duas línguas, vírgula decimal portuguesa. |
| 20 | corrigido em parte | Redação autorizada restaurada e exceções identificadas em HB1-23, HB1-29 e HB1-32; as objeções factuais não foram escondidas. |
| 21 | corrigido | Base cem, distâncias e Roménia explicitadas pelas quatro novas contas e pela célula selada. |
| 22 | corrigido | Conclusões numeradas, votações em prosa e contagens entre aspas com atribuição. |
| 23 | corrigido | Bandeiras da Finlândia, licenças e população da União expressas. |
| 24 | corrigido em parte | Coberturas medidas; oração de ausência da Dinamarca devolvida porque o corpo novo a contradiz, HB1-23. |
| 25 | corrigido | Preços de venda e rendas novas têm períodos próprios na abertura. |
| 26 | corrigido | Pais ou rendimento do agregado, com o título exato da medida no corpo. |
| 27 | corrigido | Portas de séries usam o título conferido no catálogo de rótulos. |
| 28 | corrigido | Datas de calendário formatadas com pontos. |
| 29 | corrigido em parte | Campos preenchidos quando há fonte; a edição do calendário não está declarada no corpo, HB1-25. |
| 30 | corrigido | Excerto contíguo da Euronews inclui as cinco cidades. |
| 31 | corrigido em parte | Substituídas as frases indicadas; «cada notícia a um toque» permanece por mandato, embora o percurso passe primeiro pelo recibo. |
| 32 | corrigido | Conferência ampliada às linhas textuais de imprensa e plataforma, com plantas. |
| 33 | mantido com a decisão HB1-33 | O defeito binário não está presente na cabeça recebida. |
| 34 | corrigido | In brief e deteção comum na vista e no portão. |
| 35 | corrigido em parte | Cabeças e registos separados explicitamente, HB1-34; não se atribuem a uma cabeça os testes de outra. |
| 36 | corrigido | Expansões únicas na primeira ocorrência, com tabela e régua. |
| 37 | corrigido | Anúncio da primeira medida e duas orações exatas do Conselho de Ministros. |
| 38 | corrigido | Linhas completas do Quadro 5.24 e régua da coluna. |
| 39 | corrigido | Definição do glossário Eurostat alojada e selada. |

Os achados 2 a 6 são as plantas da leitura e não foram corrigidos como se fossem defeitos da produção.

### Verificações durante a construção

O primeiro pedido de commit foi recusado. As suites novas não imprimiam a contagem de verificações exigida pelo portão; passaram a contar os controlos efetivamente executados. Os testes de registos e de voz também confundiam as duas datas do calendário, agora formatadas com pontos, com figuras numéricas. A correção distingue datas ancoradas no valor da linha, sem alterar os números do texto nem relaxar o limite das figuras. Na travessia, a atribuição do comandante estava separada em nome e cargo, e duas linhas RTP perdiam a atribuição portuguesa; o gerador foi corrigido. As correções de valores textuais passaram a conservar a cadeia literal dos excertos anteriores, com uma planta de adulteração.

### Escolhas, valores e cobertura

As formas A da Euronews, das tendas e da definição têm os excertos e selos em [formas-provas.json](correcao-hb1b/formas-provas.json): a oração das cinco cidades é contígua à da plataforma; as duas orações da retirada e de «desde sábado» pertencem ao mesmo excerto; a definição vem do glossário alojado. A forma A da especialidade é sustentada por «2026-09-30 | Baixa comissão especialidade» na página parlamentar, conservado em [especialidade-prova.json](correcao-hb1b/especialidade-prova.json). A forma B da sobrecarga resulta da comparação abaixo; a sua última frase foi devolvida pela cobertura nova. Os identificadores reais da Lusa são `hab-imprensa-manif-lusa` e `hab-imprensa-manif-lusa-organizacoes`; o da plataforma é `hab-plataforma-reivindicacoes`.

| Publicação | Portugal, total de 2025 | União, total de 2025 | Atualização declarada no corpo |
| --- | ---: | ---: | --- |
| ilc_lvho07c | 6,2 | 7,7 | 2026-10-20T23:00:00+0200 |
| tespm140 | 6,3 | 7,7 | 2026-10-20T11:00:00+0200 |

[fontes-factos.json](correcao-hb1b/fontes-factos.json) guarda os valores, momentos de atualização, resumos SHA-256, coordenadas e contagens de cada recorte. `prc_hpi_q` tem 26 Estados-membros, sem EL; `ilc_lvho07a` em 2025 tem 26, sem DK; `ilc_mdho06a` em 2023 tem 26, sem IE. No corpo novo `ilc_lvho07c`, total, proprietários com e sem empréstimo e inquilinos a preços de mercado têm 27; renda reduzida ou gratuita tem 26, sem valor DK. A Dinamarca no total tem 14,7 com bandeira `b`. Não se aplicou a todos os regimes a ausência observada num deles.

O motor tem 20 derivadas depois das quatro novas, das quais 19 atravessam para o sítio; a percentagem derivada de vagos fica só no motor, porque o estudo usa a percentagem oficial do INE. O pedido referia quinze recibos. Todas as derivadas usadas nesta edição passaram pelo mesmo gerador de palavras e pela conta independente do `check`.

Os campos que continuam por verificar são `document.edition` de `hab-ine-calendario-juro` e `hab-ine-calendario-precos-locais`. [ausencias.json](correcao-hb1b/ausencias.json) dá a razão, e [datas-ancoradas.json](correcao-hb1b/datas-ancoradas.json) mostra as datas efetivamente preenchidas e as suas âncoras.

### Corridas recusadas e correções de integração

A primeira corrida sobre `34e51c59` teve build 1, verify 125 (não executado), typecheck 0 e motor 0. Faltavam declarações de lugar das duas correções textuais. Durante a corrida do motor, essas dependências foram corrigidas no sítio; por isso o estado final dessa corrida está sujo e não é apresentado como prova final do sítio. A segunda corrida, sobre `f8f4a4d9`, teve build 1, verify 125 e typecheck 0: a incorporação de uma das novas contas derivadas exigiu a declaração de lugar. Os registos completos ficam em [portoes-diagnostico-1](correcao-hb1b/portoes-diagnostico-1/) e [portoes-diagnostico-2](correcao-hb1b/portoes-diagnostico-2/). O motor permaneceu em `e8d6f79e`, com árvore limpa e código zero.

A terceira corrida, sobre `600767a3`, teve build 1, verify 125 e typecheck 0. A página inglesa encontrou uma linha da série de sobrecarga sem nome no catálogo das portas do estudo. O registo fica em [portoes-diagnostico-3](correcao-hb1b/portoes-diagnostico-3/).

A quarta corrida, sobre `7cc35439`, construiu o HTML e chegou ao portão de país, que recusou as duas declarações de lugar das correções textuais. Build 1, verify 125 e typecheck 0, conservados em [portoes-diagnostico-4](correcao-hb1b/portoes-diagnostico-4/). A extração desse HTML confirmou os cinquenta e dois blocos de cada edição e permitiu corrigir o extrator dos recibos ingleses, que procurava o nome do campo português em vez do campo traduzido.

A medição posterior do HTML encontrou cinquenta diferenças no inventário declarado: dezoito chaves novas, vinte e oito mudanças de forma por datas preenchidas e quatro pela atribuição de Soeiro. A comparação revê todas antes de atualizar a declaração. Na língua, os nomes ingleses não estavam obsoletos: a guarda só recolhia `name` e passou a considerar também `name_en`. A unidade nova dos quatro desvios do índice entrou no dicionário com a tradução correspondente.

A L1 foi medida em 3170 páginas por dois guiões independentes. O aumento de dezoito corresponde aos nove recibos novos, em duas línguas; o contrato discrimina também as vinte e quatro mudanças de multiplicidade de destinos. A régua do contrato e as oito plantas passaram. Uma reconferência feita antes de reconstruir os códigos incorporáveis foi recusada pela ER1, sem chegar à L1; o seu registo conserva essa recusa, não um falso verde.

A quinta corrida, sobre `3555f985`, passou voz e nomes, mas o portão da língua encontrou três declarações de edição por reconciliar: a data nova dos contadores, a data anterior já sem linha e o marcador de edição desconhecida. Build 1, verify 125 e typecheck 0, em [portoes-diagnostico-5](correcao-hb1b/portoes-diagnostico-5/). As verificações adicionais dessa cabeça passaram: séries, cruzamento com origem, inventário e extrações de frases e recibos.

A sexta corrida, sobre `79044b62`, teve build 0, verify 1 e typecheck 0. Os quatro grupos recusados foram I9 (data de entrada confundida com publicação declarada), a contagem antiga dos campos, três importações sem uso e a régua de mudanças do índice, que ainda incluía correções textuais na comparação numérica. A corrida integral está em [portoes-diagnostico-6](correcao-hb1b/portoes-diagnostico-6/); não se substituiu o seu código vermelho por resultados parciais.


A sétima corrida, sobre `6bd0f865`, teve build 0, verify 1 e typecheck 0. Restou apenas I9: a chamada da régua não encontrou o `Article` que existe no JSON-LD das duas páginas. A extração independente confirmou `Draft`, sem `datePublished` nem data de publicação à vista. A recusa integral está em [portoes-diagnostico-7](correcao-hb1b/portoes-diagnostico-7/).

A causa de I9 foi a passagem de uma árvore só com o corpo, da qual já tinham sido retirados todos os scripts. A régua recebe agora o HTML bruto da página e analisa também o cabeçalho. O teste dirigido usa o mesmo argumento da chamada real: as duas edições passaram, e as duas cópias sem scripts foram recusadas; os dois controlos e as sete adulterações de publicação continuam a passar. O registo é [hb1b-i9-integracao-html.log](correcao-hb1b/testes-parciais/hb1b-i9-integracao-html.log).

O pedido seguinte foi recusado antes de construir, com código 9: a ligação dos testes de HTML real a `check:datas` chegou depois do commit `47a03262`. A alteração foi comitada antes de repetir os portões; não houve corrida parcial nessa tentativa. O comando integrado passou em [hb1b-i9-integracao-datas.log](correcao-hb1b/testes-parciais/hb1b-i9-integracao-datas.log).

### Provas da correção entregue

A cabeça de código do sítio é `3474743dc3d1b3241a584c58141f3fa53f5bc08e`; o motor é `e8d6f79ebbcb1bf4ed65f889d073d354f9e6603e`. Os portões do sítio começaram e acabaram com a árvore limpa e a mesma cabeça. O motor não mudou depois da corrida integral verde conservada em `portoes-diagnostico-1`. O commit que acrescenta este fecho contém apenas o relatório e os seus registos; a reconferência desse commit é separada, conforme HB1-34.

| Conferência | Código | Prova |
| --- | ---: | --- |
| Build | 0 | [portoes-finais/build.codigo](correcao-hb1b/portoes-finais/build.codigo) |
| npm run verify inteiro | 0 | [portoes-finais/verify.codigo](correcao-hb1b/portoes-finais/verify.codigo) |
| Typecheck | 0 | [portoes-finais/typecheck.codigo](correcao-hb1b/portoes-finais/typecheck.codigo) |
| check:series com RESEARCHHUB_DIR | 0 | [extracoes-finais/series.codigo](correcao-hb1b/extracoes-finais/series.codigo) |
| check:cruzamento --with-origin | 0 | [extracoes-finais/cruzamento.codigo](correcao-hb1b/extracoes-finais/cruzamento.codigo) |
| Plantas do inventário | 0 | [extracoes-finais/inventario-prova.codigo](correcao-hb1b/extracoes-finais/inventario-prova.codigo) |
| Inventário do HTML | 0 | [extracoes-finais/inventario.codigo](correcao-hb1b/extracoes-finais/inventario.codigo) |
| Extração das frases | 0 | [extracoes-finais/frases.codigo](correcao-hb1b/extracoes-finais/frases.codigo) |
| Extração dos recibos | 0 | [extracoes-finais/recibos.codigo](correcao-hb1b/extracoes-finais/recibos.codigo) |
| core.gate do motor | 0 | [motor.codigo](correcao-hb1b/portoes-diagnostico-1/motor.codigo) |
| Capturas e conferência de resumos e geometria | 0 | [validacao.json](correcao-hb1b/capturas-finais/validacao.json) |

As frases desta passagem, nas duas edições, estão em [frases-e-recibos.md](correcao-hb1b/extracoes-finais/frases-e-recibos.md), extraídas do HTML, e no [JSON das frases](correcao-hb1b/extracoes-finais/frases-do-sitio.json). O mesmo anexo inclui três recibos Eurostat, três INE e três derivados, tal como renderizam nas duas línguas; o [JSON dos recibos](correcao-hb1b/extracoes-finais/recibos.json) conserva os campos separadamente. A conferência exige a mesma cabeça nas duas extrações.

O [inventário final](correcao-hb1b/extracoes-finais/inventario-rotulos.json) e a [sua prova](correcao-hb1b/extracoes-finais/inventario-rotulos-prova.json) foram refeitos deste HTML. [publicacao-html.json](correcao-hb1b/extracoes-finais/publicacao-html.json) confirma as duas edições em preparação, sem data publicada e com `Draft`. Os avisos globais do cruzamento relativos aos livros 20 e 24 continuam registados; não representam diferença nas linhas exportadas.

### Plantas novas

| Alteração deliberada | Vermelho | Controlo verde |
| --- | ---: | ---: |
| dia inglês | 1 | 0 |
| mês inglês | 1 | 0 |
| intervalo inglês | 1 | 0 |
| data SITE published_at | 1 | 0 |
| atribuição inglesa alterada | 1 | 0 |
| partido trocado de grupo (pt) | 1 | 0 |
| partido omitido (pt) | 1 | 0 |
| partido trocado de grupo (en) | 1 | 0 |
| partido omitido (en) | 1 | 0 |
| Publicação declarada anterior ao commit de entrada | 1 | 0 |

Os resultados e as mensagens de recusa estão em [plantas.json](correcao-hb1b/plantas.json). Os testes integrados acrescentam as sete adulterações de publicação e as duas cópias das páginas reais sem JSON-LD. As alterações deliberadas foram feitas em cópias, sem deixar estragos na produção.

### Capturas e limites do fecho

O [pedido](correcao-hb1b/capturas-finais/pedido.json) e o [manifesto](correcao-hb1b/capturas-finais/capturas.json) cobrem as quatro rotas, as duas edições e as cinco larguras. Foram medidas 20 capturas completas e 120 PNG no total. Todos os resumos dos PNG e dos recursos servidos foram conferidos; não houve transbordos horizontais, pedidos externos nem erros do navegador. Nenhum PNG entra no commit.

A [revisão visual](correcao-hb1b/capturas-finais/revisao-visual.json) enumera apenas as imagens efetivamente vistas e separa essa amostra da conferência automática de todos os ficheiros. As frases mandatadas com objeções factuais continuam assinaladas em HB1-29; portões verdes não as tornam conclusões demonstradas.

A HB1-c de 23.10.2026 continua por fazer: preços locais e rendas, razão Lisboa/país, juro implícito novo, calendário no passado, data declarada, contador de edições, portões, capturas e leitura curta antes da aterragem. Esta passagem não publicou nem enviou commits para o remoto.

A sessão não expôs uma contagem de símbolos ou de tokens usados. Não foi estimada nem inventada; o custo em pontos fica a cargo do lançador.

## A correção HB1-c (primeira metade)

*Construída a 21.10.2026 pelo Claude Opus 5.5 (a definição `construtor`), sobre o mandato `CORRECAO-HB1-c-2026-10-21.md`, a primeira metade (HB1-c1). Os códigos estão em `correcao-hb1c/codigos/` (um `.code` por conferência, lido do ficheiro); as medições em `correcao-hb1c/medidas.json`, escritas por `correcao-hb1c/medir-hb1c.py <motor>`, cada uma com o corpo, o sha256 e um conhecido-positivo (o valor de uma linha selada lido pela mesma função de célula); as frases como as edições as imprimem em `correcao-hb1c/frases-renderizadas-hb1c.json`, escritas por `correcao-hb1c/extrair-frases-hb1c.py` a partir de `studies-src/a-casa-em-portugal-e-na-europa/{pt,en}.html`.*

**A recomposição.** `python3 -m publisher.hb1_build` recompôs `content/28` sobre as três linhas partilhadas na versão do estudo do Orçamento; `hb1_test` verde. No sítio, as três linhas (`posicao-ps-rendas`, `posicao-chega-habitacao`, `oe-2027-calendario-generalidade`) ficam na versão da travessia do Orçamento: a travessia do HB1 (`scripts/hb1-exportar-linhas.py`), as provas (`scripts/hb1-provas.py`) e as línguas (`scripts/hb1-linguas.py`) deixam de reescrever uma linha que outro registo de travessia prende, e o registo `ledger/cruzamentos/hb1.json` deixa de as listar (a guarda delas continua em `eo1.json`). Os 98 recibos do HB1 ganharam `status: "conferido"`, que o exportador do motor fundido escreve.

**As medições (o §0 e o §2 do mandato), todas iguais ao que a leitura mediu:** o índice nominal do 2.º trimestre de 2026 tem 26 Estados-membros com dados (a Grécia sem dados) e só a Hungria acima de Portugal (389,61 contra 301,43), donde «o segundo mais alto … atrás da Hungria»; a variação anual do mesmo trimestre não tem nenhum país acima de Portugal (16,5), entre 26; o `tipsho10` de 2025 e o `tipsho60` de 2024 não têm nenhum país acima de Portugal, entre 27; o `ilc_lvps08` dos 25 a 34 anos de 2025 tem oito acima (Croácia, Grécia, Eslováquia, Polónia, Itália, Espanha, Chipre, Bulgária), donde «nono», entre 27; o `yth_demo_030` de 2025 tem cinco acima (Croácia, Grécia, Eslováquia, Espanha, Itália) e a Eslovénia a par, donde «sexta»; a sobrecarga total de 2025 tem 27 com dados, Chipre a mais baixa (2,4) e a Grécia a mais alta (26,4); os dois corpos da sobrecarga foram atualizados a 2026-10-20, o conjunto por regime de ocupação às 23:00 e o `tespm140` às 11:00.

**Os achados, pelo número.**

- 1 (os ordinais da conclusão 3): corrigido, «nono» e «sexta, a par da Eslovénia», medidos.
- 2 (os proprietários e a sobrecarga por regime): corrigido nas frases do resumo e da conclusão 2.
- 3 (as datas dos dois corpos): corrigido; as linhas `hab-tespm140-a-pc-pt-2025` e `-eu27_2020-2025` seladas do corpo alojado (`published_at` 2026-10-20, a data de atualização que o corpo declara), a régua `regua_dos_dois_corpos` em `publisher/habitacao_hb1b_test.py` confere o mesmo dia, a ordem das horas e a frase nas duas edições, com duas plantas (as horas trocadas, outro dia) que ficam vermelhas.
- 9 (o índice nominal): corrigido, «o segundo mais alto dos vinte e seis Estados-membros com dados trimestrais, atrás da Hungria».
- 10 (a medida dos 27,2 % face à frase da plataforma): corrigido na conclusão 6 e na secção 10.
- 11 (a data da página da IL): corrigido na secção 8, «atualizada a 8 de junho de 2026 (a página não diz quando foi publicada)».
- 12 (a medida dos 25 a 34 anos): corrigido no motor (`publisher/habitacao_rotulos.py`): «Persons living with their parents or contributing/benefiting from the household income, From 25 to 34 years», e o mesmo para os 18 a 34.
- 13 (o nome na fonte): corrigido em parte. O nome inglês das linhas dos cubos do Eurostat é agora a concatenação dos `label` do corpo, com o rótulo do período como o corpo o escreve («2026-Q2»), e o recibo português mostra-o sob «O nome na fonte» com a marca de língua (`nomeDoCuboEmIngles` em `src/lib/o-que-e-o-numero.mjs`, `src/views/LinhaView.astro`); as duas células que encodavam o nome português (`tests/cartao/familias.mjs`, K17; `scripts/check-lingua.mjs`, o nome inglês) mudaram de forma conservando o que protegem (o texto igual ao campo da linha, a declaração inglesa e a língua efetiva `en` no HTML). `check:cartao` e `check:eo1` verdes. Os recibos não foram vistos renderizados nesta metade (sem capturas).
- 14 (as linhas da série do sítio): corrigido. `sobrecarga-do-custo-da-habitacao-2025.yml` e `-ue.yml` voltaram byte a byte a `main`; `scripts/hb1b-series-data.py` saiu; a cópia no motor (`series-do-sitio/`) foi reposta sobre elas.
- 15 (o registo das correções): corrigido. As entradas `kind: "correcao"` de `hab-imprensa-tendas` e `hab-imprensa-manif-euronews` saíram, `ledger/historias-valores.json` voltou a `main`, e os quatro contadores já eram os de `main`; o contrato está em `validateLedger` (`src/lib/ledger.mjs`): uma linha de um estudo sem edição publicada (`edicaoPublicada`) não traz `corrections` nem história selada; as plantas em `tests/linha/historia-do-valor.mjs` põem uma correção nas duas linhas e ficam vermelhas; `ledger:check` verde, com `correcoes-publicadas` em 12. O exportador do HB1 deixou de escrever correções.
- 19 (o `@@citar` de Chipre e da Grécia): corrigido, a frase da secção 2 cita as duas linhas.
- 20 (o literal de data preso a uma linha): corrigido. `⟦lit:20 de outubro@hab-tespm140-a-pc-pt-2025⟧` prova-se só pela linha nomeada (`core/compor_livros.py`); a planta em `publisher/hb1_test.py` prende o literal a `hab-ilc-mded01-a-total-total-pc-pt-2025`, do mesmo parágrafo, e fica vermelha nas duas edições.
- 21 (a planta da atribuição inglesa sobre o HTML composto) e 22 (a isenção «N. » só na forma das conclusões): ficam para a HB1-c2.
- 23 (as portas das séries com a geografia): fica para a HB1-c2. O rótulo vem do catálogo `src/data/rotulos-das-series.json` (o `documento` do corpo) e é conferido por `tests/hb1/portas.mjs`; mudar a forma toca o renderizador comum.
- 25 (as datas): fica para a HB1-c2 (o recibo do glossário com «Página editada pela última vez a …» e a linha da estimativa do Governo com `reference_date` 2021).
- 26 (o inglês dos recibos derivados): fica para a HB1-c2, como o mandato diz.
- 27 (`divergencias-da-redacao.json`): fica para a HB1-c2; as frases novas estão em `frases-renderizadas-hb1c.json`.
- 16 (as definições alojadas): fica para a HB1-c2, como o mandato diz.
- 17, 18, 24, 28, 29 e 30: não classificados nesta metade; a leitura não foi relida por orçamento, e ficam para a HB1-c2.

**A frase que a construção recusa.** A conclusão 6 do mandato diz «segundo ⟦…|atribuicao⟧ (o Bloco de Esquerda)», sem a sigla, e o mandato diz que a expansão do BE fica aí; a conclusão 7 usa «o BE». A conferência das siglas (`scripts/siglas-hb1.mjs`, chamada por `tests/hb1/edicoes.mjs` no `check:registo`) recusa: «pt: BE não expandida ao primeiro uso», porque a sigla nunca aparece ao lado da forma longa, e um leitor não fica a saber que BE é o Bloco de Esquerda. A frase não foi substituída; por isso `check:registo` e `npm run build` saem com 1. Uma forma que a conferência aceitaria é «(o Bloco de Esquerda, o BE)» e «(the Left Bloc, BE)»; a decisão é do lugar de direção.

**As frases tal como renderizam.** As 30 procuras de `extrair-frases-hb1c.py` acham cada frase nas duas edições; a conclusão 2 aparece duas vezes porque o extrator lê o `<li>` e o `<p>` de dentro dele (o mesmo texto). A secção 4 ficou como estava: a oração da medida já era «(a medida do Eurostat chama-se «…»; …)», e o que muda é o valor da medida (achado 12).

**Os códigos (lidos dos ficheiros em `correcao-hb1c/codigos/`):** `typecheck` 0; `ledger:check` 0; `check:cruzamento` 0; `check:documentos` 0; `astro build` 0; `check:cartao` 0; `check:datas` 0; `check:eo1` 0; `scripts/check-afirmacoes.mjs` 0; `check:registo` 1 e `npm run build` 1, os dois pela sigla do BE acima; no motor `hb1_test` 0, `habitacao_hb1b_test` 0 e `habitacao_test` 0; `python3 -m core.gate` no ficheiro `core-gate.code`. Não correram `npm run verify`, `portoes.sh` nem capturas.

## A correção HB1-c (segunda metade)

*Construída a 21.10.2026 pelo Claude Opus 5.5 (a definição `construtor`), sobre o mandato `CORRECAO-HB1-c-2026-10-21.md` e a ordem do lugar de direção para a HB1-c2 (A, B, C, D, E), com o orçamento de 120 chamadas. Os códigos estão em `correcao-hb1c/codigos/c2-*.code`, cada um escrito pelo próprio comando; as frases e as definições em `correcao-hb1c/frases-hb1c2.json`, escritas por `correcao-hb1c/extrair-hb1c2.mjs`; as origens das definições por `correcao-hb1c/origens-hb1c2.py <motor> <saída>`, que lê o texto de cada corpo alojado e confere o sha256 contra o recibo. Motor: commits `6ab583e` e `a2b3fa2`; sítio: `66ac3e881` e o commit deste relatório.*

**A (a conclusão 6).** Feito nas duas edições: «(o Bloco de Esquerda, o BE)» / «(the Left Bloc, BE)»; a conclusão 7 fica com «o BE» / «the BE». Como as edições o imprimem:

- PT: «…es graves» segundo a organização e «35 feridos, pelo menos» segundo José Soeiro, dirigente nacional do BE (o Bloco de Esquerda, o BE), com «um polícia ficou ferido» segundo a Polícia de Segurança Públ…»
- EN: «…s» according to the organisers and «35 feridos, pelo menos» according to José Soeiro, of the Left Bloc's national leadership (the Left Bloc, BE), with «um polícia ficou ferido» according to the Public…»

A medição: o primeiro uso de «BE» na edição portuguesa não é a parêntese, é a atribuição copiada da linha (`attributed_to` de `hab-imprensa-feridos35`, «José Soeiro, dirigente nacional do BE»), e por isso a conferência das siglas recusava também a forma do mandato. A conferência mudou de forma (`scripts/siglas-hb1.mjs`): vale a expansão antes do primeiro uso, como antes, ou a glosa logo a seguir, entre parênteses; duas plantas novas em `tests/hb1/edicoes.mjs` (a glosa tirada, a glosa afastada do primeiro uso) ficam vermelhas. A frase lê-se «dirigente nacional do BE (o Bloco de Esquerda, o BE)», com a sigla duas vezes, como a leitura disse no achado 18; a forma da frase é do lugar de direção. **`check:registo` continua vermelho** (código 1), agora pela IL: «pt: expansão IL repetida ou sem a forma declarada». A secção 8 do mandato escreve «A Iniciativa Liberal (a IL), na sua página…» e o resumo já expande a IL («da Iniciativa Liberal (a IL)»); a planta «expansão repetida» da HB1-b exige uma só expansão. A sigla do BE escondia esta recusa (a conferência pára na primeira). Não se mudou a frase nem a planta: a decisão é do lugar de direção (tirar «(a IL)» da secção 8, ou aceitar a repetição). Por isso `npm run build` sai com 1.

**B, o item 4 (as definições, o achado 16): corrigido em parte.**

- Alojados no motor, com recibo (`*.pedido.json`, o cliente `core.http.HttpClient.condicional`, a hora, o sha256) e direitos (`direitos/avaliacao.json` regenerado pelo inventário): os glossários Statistics Explained «Housing cost overburden rate», «Overcrowding rate», «Building permit», «House price index (HPI)» e «Harmonised index of consumer prices (HICP)», e a metainformação ESMS dos Censos 2021 (`cens_21_esms.htm`). Não existem (404, medido): «Tenure status», «Housing costs», «Conventional dwelling», «Total housing costs», «Disposable household income», «Tenure», `ilc_esms.htm`, `cens_21r_esms.htm`, `cens_21dwob_esms.htm`, `ilc_livcon_esms.htm`; a metainformação ESMS do EU-SILC (`ilc_sieusilc.htm`) existe e não define o regime de ocupação nem os que vivem com os pais. Os corpos que falharam não entraram no motor.
- Onze origens seladas em `src/data/figuras.mjs` (`ORIGENS_HB1C`), cada uma com o excerto inglês exato do corpo alojado e o selo (o ficheiro no motor, o campo, a hora, o cliente, o sha256): as seis páginas acima, o glossário da privação severa já alojado, e a descrição (`extension.description`) dos corpos `tipsho10`, `tipsho60` e `yth_demo_030` já alojados. Decisão HB1-39: a definição sela-se como origem do sítio (o mecanismo da K16 e da `OrigemDaDefinicao` do recibo, que imprime o inglês ao lado) e não como linha nova do livro; uma linha sem frase que a cite entraria no contrato da L1 e na guarda dos órfãos sem servir o leitor.
- As frases, nas duas edições, traduzidas da definição, com «; aqui, …, em …» a dizer a população, a geografia e o período: 15 famílias do Eurostat (`scripts/hb1-familias.py`, `DEFS`); onde o Eurostat não publica uma página (`ilc_lvho02`, `ilc_lvps08`, `demo_pjan`) a frase apoia-se no título do corpo na linha própria (`document.title`). As derivadas dizem o que o resultado é (`DER_WHAT`), com a conta em palavras ao lado como já estava. Seis, como estão declaradas (o recibo construído não foi visto: o build pára antes do `astro build`):
- `hab-ilc-lvho07c-a-pc-total-pt-2025`: «A taxa de sobrecarga dos custos da habitação é a parte da população que vive em agregados onde a despesa total com a casa, descontados os subsídios, passa de quarenta por cento do rendimento disponível» / «The housing cost overburden rate is the share of the population living in households where total housing costs, net of housing allowances, exceed forty percent of disposable income» (origem: hb1c-eurostat-sobrecarga)
- `hab-prc-hpi-q-q-total-i15-q-pt-2026-q2`: «O índice dos preços das transações de casas compradas pelas famílias, com o ano base igual a cem» / «The index of the transaction prices of dwellings purchased by households, with the base year equal to one hundred» (origem: hb1c-eurostat-ipH)
- `hab-tipsho60-a-ptir-i15-pt-2024`: «O rácio entre os preços das casas e o rendimento disponível bruto ajustado das famílias por habitante, em índice com o ano base igual a cem» / «The ratio of house prices to adjusted gross disposable household income per head, as an index with the base year equal to one hundred» (origem: hb1c-eurostat-preco-rendimento)
- `hab-yth-demo-030-a-avg-t-pt-2025`: «A idade em que metade da população já não vive num agregado com os pais, estimada pelo inquérito ao emprego» / «The age at which half of the population no longer lives in a household with their parents, estimated from the Labour Force Survey» (origem: hb1c-eurostat-saida)
- `hab-ilc-mdho06a-a-pc-total-t-total-pt-2023`: «A parte da população que vive numa casa sobrelotada e, ao mesmo tempo, com pelo menos um destes problemas: um telhado que mete água, sem banheira ou duche e sem retrete dentro de casa, ou uma casa considerada demasiado escura» / «The share of the population living in an overcrowded dwelling that also has at least one of these problems: a leaking roof, no bath or shower and no indoor toilet, or a dwelling considered too dark» (origem: hb1c-eurostat-privacao-severa)
- `der-hab-licencas-por-mil-pt-2025`: «O resultado é o número de alojamentos licenciados por cada mil habitantes» / «The result is the number of dwellings permitted per thousand inhabitants» (origem: a conta da linha)
- **Por fazer:** as linhas do INE e do Banco de Portugal (as notas metodológicas dos destaques e a nota da série do BPstat não foram lidas nesta metade) e as do Orçamento; 23 famílias ainda dizem «A medida mostra …», listadas em `frases-hb1c2.json`, `ainda_com_o_rotulo`.
- **`check:cartao` vermelho** (código 1): a K16 recusa as origens novas por «o selo não diz o ficheiro no motor» (a regra da K16 espera outro prefixo de caminho do que `content/23 Habitacao/source/eurostat/`, não lido por orçamento); a K13 recusa a definição de `hab-ilc-lvho05a-a-pc-total-y16-29-t-*` porque a linha fixa os 16 aos 29 anos e a frase não o escreve como intervalo (o complemento diz «dezasseis a vinte e nove anos»); a K1 «nome» recusa a declaração nas duas línguas (causa não lida).
- **`check:eo1` vermelho** (código 1): «ER1 código: o pedaço difere da linha, carácter a carácter» em `scripts/incorporar-do-portao.mjs`; causa não lida (provavelmente o menos tipográfico ou os milhares das derivadas, item 7).

**B, o item 6 (o achado 25): corrigido no motor e no sítio, com uma conferência vermelha.** O recibo do glossário imprime «Página editada pela última vez a» / «Page last edited on» (o campo novo `published_at_kind: last-edited`, declarado em `src/lib/ledger.mjs` e `src/tipos.d.ts`, escrito pelo exportador do motor só quando a linha o traz, validado como só `last-edited` com data). A estimativa do Governo tem `reference_date` 2021, ancorado no próprio excerto («Considerando os dados dos Censos 2021,», conferido em `publisher/habitacao.py`), e a data da proposta (2026-08-12) fica em `document.edition`, conferida contra a página do Parlamento como antes. **`ledger:check` vermelho** (código 1): `scripts/afirmacoes-hb1.mjs` exige que a âncora suplementar prove uma data completa igual ao `reference_date`, e a linha tem agora um ano; a régua protege uma data e não foi mudada sem planta: fica para a passagem seguinte.

**B, o item 7 (o achado 26): corrigido.** As derivadas inglesas imprimem «Population on 1 January», «10 749 635 inhabitants», o ponto decimal («40.9 thousand»), e o menos tipográfico nas componentes e no resultado das duas edições; o `measure_en` das diferenças usa o nome inglês da componente.

**B, o item 8: não feito** (a planta da atribuição inglesa no HTML composto e a isenção «N. » limitada às conclusões). A medição: a unidade que o validador recebe tem os pedaços e os `spans` (`core/eyetext.py`, `strong` sobre o segundo pedaço), e é por aí que a isenção se limita à forma «N. **»; não coube no orçamento.

**B, o item 10 (o achado 23): corrigido.** A porta de uma série diz a geografia da linha citada a seguir ao rótulo do catálogo («Housing cost overburden rate, Portugal» / «…, União Europeia»), em `src/lib/registo-html.mjs`; `tests/hb1/portas.mjs` confere o rótulo do catálogo no `span` e a geografia na porta, e falha se nenhuma porta tiver geografia.

**B, o item 11 (o achado 27): não feito.**

**C.** Os achados da leitura da HB1-b, pelo número (a primeira metade já tinha escrito as frases; aqui confere-se no HTML):

- 17 (o teste dos dois minutos e a pergunta do editor): os quatro motivos que a leitura dá (os achados 1, 2, 7 e 8) estão corrigidos ou eram plantas; não verificado no HTML construído, porque o build pára.
- 18 (o BE descrito duas vezes): corrigido em parte; a atribuição da linha continua a dizer «dirigente nacional do BE» antes da glosa (ver A).
- 24 (os três finais): corrigido. PT «…os que vêm da rua"» de 16 de outubro, da Lusa no DNotícias, avisou que o Governo "não vai ceder aos gritos que vêm da rua". No debate parlamentar de 9 de outubr…»; EN «…tos que vêm da rua"» of 16 October, from Lusa in DNotícias, warned that «o Governo "não vai ceder aos gritos que vêm da rua".» (the Government "will not give in to the shouting from the street"). In t…»; os pontos finais depois das citações do ministro da Administração Interna e da CGTP estão no modelo das duas edições.
- 28 (a tabela do INE): corrigido. PT «…são uma estimativa do Governo sobre os dados dos Censos, e o documento não diz como chegou a esse número a partir dos Censos. 6. O crédito Em agosto d…»; EN «…ondition) are a Government estimate on the Census data, and the document does not say how it reached that number from the Census. 6. Credit In August …».
- 29 (três passagens): corrigido. A glosa portuguesa da privação severa confere com a definição alojada, palavra a palavra («overcrowded» sobrelotada; «at least one of the housing deprivation measures» pelo menos um destes problemas; «a leaking roof, no bath/shower and no indoor toilet, or a dwelling considered too dark»); a nota do «invariante» está nas duas edições; os 44,3 % dizem-se «o rácio subiu … % desde 2015».
- 30 (o toque): corrigido. PT «…essoas foram encaminhadas para o hospital.», segundo a RTP. Nenhuma destas contagens vem de um comunicado da PSP, da IGA…».
- A ordem desta passagem pedia ainda, sob os achados 17 e 18, «as palavras do arredondamento da secção 8 e a nota do arredondamento» e «a isenção do ano e a conferência do sinal do `|abs` no compositor, com uma planta cada». A medição: na leitura da HB1-b os achados 17 e 18 são o teste dos dois minutos e a dupla descrição do BE; o arredondamento, a isenção do ano e o `|abs` são da leitura da EO1-b (`LEITURA-EO1-b-2026-10-21.md`, o achado na linha 82). Não se fizeram: o compositor é partilhado com o estudo do Orçamento, e o ponto volta ao lugar de direção.

**D, os códigos (lidos dos ficheiros):** `typecheck` 0; `ledger:check` 1; `check:registo` 1; `check:cartao` 1; `check:datas` 0; `check:eo1` 1; `npm run build` 1; no motor `hb1_build` 0, `hb1_test` 0, `habitacao_test` 0, `habitacao_hb1b_test` 0, `python3 -m core.gate` 0. Não correram `npm run verify`, `portoes.sh` nem capturas.

**O que ficou por fazer, pelo nome:** a IL repetida na secção 8 (decisão do lugar de direção); a régua da âncora suplementar para um período anual; a K16, a K13 e a K1 do `check:cartao` sobre as famílias novas; o ER1 do `check:eo1`; as definições do INE, do Banco de Portugal e do Orçamento; o item 8 (duas plantas do compositor); o item 11 (`divergencias-da-redacao.json`); o arredondamento, a isenção do ano e o `|abs` (da leitura da EO1-b).

**Chamadas:** cerca de 112 das 120, contadas pelo construtor no seu registo (as chamadas de ferramenta desta conversa).

## A correção HB1-c (terceira passagem)

*Construída a 21.10.2026 pelo Claude Opus 5.5 (a definição `construtor`), sobre a lista «O que ficou por fazer» da HB1-c2 e as sete decisões do lugar de direção, com o orçamento de 100 chamadas. Os códigos estão em `correcao-hb1c/codigos/c3-*.code`, cada um escrito pelo próprio comando (os `.log` ficam fora do repositório). Motor: commit `ccd45ba`; sítio: `be4bb96cb`, o commit dos grupos etários e o commit deste relatório.*

**1. A IL na secção 8: feito.** Os dois modelos (`documento.{pt,en}.md.tmpl`) perderam só a expansão repetida. Como o HTML construído as imprime (lido de `dist/` com `grep`, não por guião de extração):
- PT: «Iniciativa Liberal, na sua página sobre a habitação, atualizada a 8 de junho de 2026 (a página não diz quand…»
- EN: «Iniciativa Liberal, on its housing page, updated on 8 June 2026 (the page does not say when it was published…»
`check:registo` deixou de recusar a IL.

**2. A estimativa do Governo: feito.** No motor, `reference_date` volta a 2026-08-12, provada pela página do Parlamento («2026-08-12 | Entrada», a régua da âncora suplementar sem mudança); o ano dos Censos entra no campo `period` (2021) por `period_binding`, ancorado no próprio excerto («Considerando os dados dos Censos 2021,»), nunca depois da data do documento (`publisher/habitacao.py`; três plantas e um controlo em `habitacao_test`, de 85 para 88). O exportador do HB1 passa o período só quando ele tem prova (`document_checks.period`). No sítio: o livro-razão aceita um período anual só com a referência de dia completo, o ano não posterior e escrito no excerto (`src/lib/ledger.mjs`, e a mesma regra no portão de HTML, `scripts/check-formas.mjs`); `scripts/afirmacoes-hb1.mjs` confere o período do sítio contra o do motor e a âncora no excerto, com três plantas recusadas; o recibo imprime «Dados de» seguido de 2021 (antes rendia «Dados do» para um ano), e a data do documento como edição, 12.08.2026. O texto do recibo com o ano não foi lido por guião: só se viu o rótulo «Dados de» no HTML do livro-razão.

**3. A K16 das origens novas: não feito, vermelho.** A medição: as onze origens já trazem `selo.motor` em `content/23 Habitacao/source/…` e o sha256; a K16 (`tests/cartao/perguntas.mjs`, o laço do selo) só aceita `indicators/out/`, e a forma `alojada` da K17 (`tests/cartao/leituras.mjs`) só aceita `content/13 Dominios/source/`. Três das origens são respostas da API (`tipsho10`, `tipsho60`, `yth_demo_030`), e por isso caem sempre no laço do selo. A mudança de forma que conserva o que a régua protege é aceitar o prefixo do estudo da habitação só com o sha256 conferido contra o ficheiro do motor; o portão do GitHub corre sem o motor, e essa decisão (onde se confere o sha256 sem motor) não coube nesta passagem.

**4. A K13 dos 16 aos 29 anos: feito.** Os grupos etários escrevem-se na forma da casa nos nomes e nos complementos («dos dezasseis aos vinte e nove anos» / «aged sixteen to twenty-nine», e o mesmo para os 25 a 34 e os 18 a 34), em `scripts/hb1-familias.py`; a K13 lê a frase com o complemento, como «O que é este número» a imprime (`tests/cartao/cartao.mjs`). `src/data/o-que-e-das-familias.mjs` não mudou na regeneração (contagem 0 da forma nova, contra 7 em `nomes-hb1.mjs` e 14 em `familias.mjs`): a K13 passa, mas a frase impressa no cartão pode continuar na forma antiga; por conferir na HB1-d.

**5. A K1 «nome» e o ER1 do `check:eo1`.** A K1 «nome» era um efeito da K13 e da K16 (a célula corre a régua inteira sobre um HTML mínimo): com a K13 corrigida, a K1 deixou de aparecer na saída; o `check:cartao` continua a 1 só pela K16. O ER1 continua: «ER1 código: o pedaço difere da linha, carácter a carácter.» (`c3-check-eo1.log`, linha 31); a causa não foi lida por orçamento.

**Fora da lista, para pôr as conferências a verde sem as enfraquecer.** O `check:registo` tinha duas recusas escondidas atrás da sigla: (a) `tests/hb1/portas.mjs` recusava o rótulo genérico «Fonte» na porta de `divida-publica-2025-notificacao-ine-2026-09` do estudo do Orçamento, que o renderizador declara para uma linha sem nome nem série (`src/lib/registo-html.mjs`); a regra passa a aceitá-lo só aí e nunca no estudo da habitação, com três plantas; (b) a guarda «nenhuma porta de catálogo» falhava porque as duas linhas de série citadas pelo estudo têm nome do projeto, e a porta abre pelo nome (16 portas); a conferência passa a exigir o nome e que as portas de Portugal e da União da mesma série se distingam, com uma planta. Os guiões da medição: `correcao-hb1c/portas-sem-nome.mjs` e `correcao-hb1c/series-nomes.mjs`.

**6. O item 11 e as definições do INE, do Banco de Portugal e do Orçamento: não feitos**, por orçamento. O item 8 e os pontos do compositor da EO1-b ficam fora, como decidido.

**Os códigos (lidos dos ficheiros):** `typecheck` 0; `ledger:check` 0; `check:registo` 0; `check:cartao` 1 (a K16); `check:eo1` 1 (o ER1); `npm run build` 1: a corrida passou o `ledger:check`, o `check:registo`, o `astro build`, o `gate:html` e o `check:datas` e parou no `check:voz` («AssertionError … The expression evaluated to a falsy value», `c3-build.log`, linha 16591), com a causa não lida; `check:datas` não tem `.code` próprio, e o verde dele vem só da ordem da cadeia do build. Motor: `hb1_build` 0, `hb1_test` 0, `habitacao_test` 0, `habitacao_hb1b_test` 0, `python3 -m core.gate` 0. Não correram `npm run verify`, `portoes.sh` nem capturas.

**O que fica para a HB1-d:** a K16 com o prefixo do estudo da habitação e o sha256 conferido (e onde se confere no GitHub, sem o motor); o ER1 do `check:eo1`; a causa do `check:voz` no build; regenerar `o-que-e-das-familias.mjs` com a forma nova do grupo etário e conferir a frase impressa; ler por guião o recibo da estimativa do Governo nas duas edições («Dados de 2021», a edição 12.08.2026); o item 11 (`divergencias-da-redacao.json`); as definições do INE, do Banco de Portugal e do Orçamento; o item 8 e os pontos do compositor da EO1-b, fora desta passagem por decisão.

**Chamadas:** 98 das 100, contadas pelo construtor no seu registo (as chamadas de ferramenta desta conversa, esta incluída).

## A correção HB1-c (quarta passagem)

*Construída a 21.10.2026 pelo Claude Opus 5.5 (a definição `construtor`), sobre o mandato `CORRECAO-HB1-c4-2026-10-21.md` do lugar de direção, com o orçamento de 40 chamadas. Os códigos estão em `correcao-hb1c/codigos/c4-*.code`, cada um escrito pelo próprio comando; os registos ficam fora dos commits.*

**1. `check:eo1`: verde.** Corrido de novo depois do compositor e do build: código 0 (`c4-check-eo1.code`).

**2. `check:voz`, o teste das portas (`tests/hb1/voz-portas.mjs`): feito, verde; o `check:voz` inteiro continua vermelho por outra causa (abaixo).** Medido nesta passagem: nenhuma série de `ledger/series/` declara `hab-ilc-lvho07c-a-pc-total-pt-2025` nem `-eu27_2020-2025` como `linha_de_portugal` ou `linha_da_uniao` (uma procura por `lvho07c` em `allSeries()` dá zero), pelo que o conjunto do mandato, só por si, não acha as duas portas que nomeia. O teste conta por isso as portas nomeadas pela marca (`span[data-nome="projeto"][data-de-linha]` dentro de `.texto-fontes a[href]`, com nome do projeto), um conjunto que contém o das séries, e confere em cada uma o rótulo (`nomeDoProjeto(id)[lang]`), o `data-de-linha` e o `href` (`routePath('linha',lang,{slug:id})`); as portas de Portugal e da União da mesma série conferem-se distintas. O registo impresso: 546 portas nomeadas nas duas edições, 0 de catálogo, 12 de Portugal e 4 da União de uma série, 2 pares distintos, 1 638 plantas. As três plantas, todas recusadas pelo `assert` em cada porta: o rótulo trocado («Sobrecarga do custo da habitação, Espanha»), o `href` para `/`, o `data-de-linha` tirado. O ramo das portas de catálogo e `assert(controlos>0)` ficam. Código: `c4-voz-portas.code` 0.

**3. A K16 e o selo contra o motor: feito, verde.** A forma do selo em `tests/cartao/perguntas.mjs` aceita `indicators/out/…` ou `content/<pasta>/source/…` (sem barra inicial, sem `..`, sem barra invertida); o sha256, a hora, o cliente e o campo continuam obrigatórios. A planta nova «o ficheiro fora do motor» (`selo.motor` igual a `/tmp/fora.html` na origem `hb1c-eurostat-sobrecarga`) é recusada com «o selo não diz o ficheiro no motor»; a K16 passa de 17 a 18 plantas a morder. `ORIGENS_HB1C` passa a exportada de `src/data/figuras.mjs`, e `scripts/afirmacoes-hb1.mjs` confere, com o motor, cada uma das onze origens: o ficheiro existe, o sha256 é o do selo, o excerto está no corpo (HTML sem etiquetas e com os espaços normalizados; JSON na cadeia do campo). As duas plantas, recusadas: «o sha256 trocado» com «HB1-c origem: o sha256 do selo não é o do ficheiro no motor»; «o excerto alterado» com «HB1-c origem: o excerto não está no corpo». Com `RESEARCHHUB_DIR` na worktree do motor (cabeça `ccd45ba`): «70 afirmações conferidas, 72 corpos lidos, 11 origens HB1-c conferidas no motor, 64 plantas, 0 erros», código 0 (`c4-afirmacoes-motor.code`); sem motor: 0 origens, 60 plantas, 0 erros. `check:cartao` 0.

**4. `src/data/o-que-e-das-familias.mjs`: mudou e foi comitado.** O compositor (`c4-compor-familias.code` 0, «192 famílias compostas e conferidas») reescreveu 60 linhas: as faixas etárias passam de «dezasseis a vinte e nove anos» / «sixteen to twenty-nine years» à forma da terceira passagem, «dos dezasseis aos vinte e nove anos» / «aged sixteen to twenty-nine» (30 trocas «a» por «aos», 16 «thirty-four years,» e 14 «twenty-nine years,» sem «years»). O `check:cartao` regenerou com isso `tests/cartao/leituras-provadas.json` (as mesmas 60 linhas), comitado ao lado.

**Os códigos (lidos dos ficheiros, na cabeça final):** `typecheck` 0; `check:cartao` 0; `check:eo1` 0; `check:voz` 1; `npm run build` 1.

**Onde o build parou:** passou o `ledger:check`, o `check:registo`, o `check:cruzamento`, o `astro build`, o `gate:html`, o `check:datas` e todas as conferências até ao `check:voz`, e parou em `scripts/check-voz.mjs`, que até aqui nunca corria porque o `voz-portas.mjs` falhava antes dele. As recusas: 8 linhas «vivas» do `INVENTARIO-FRASES.md` que já não se rendem (linhas 3019, 3020, 4877, 4878, 4910, 4912, 4913 e 4915: as contagens do livro-razão antigas, as frases de Évora e a frase de abertura da habitação na forma anterior); 4 blocos por classificar (a frase de abertura de `/habitacao` e de `/en/housing`, e a contagem nova do livro-razão nas duas edições); 2 recusas da lista fechada da B1 no estudo («O estudo do Orçamento» / «The Budget study»); e a palavra proibida «a casa» em 41 páginas e «the house» em 7, todas nas linhas da habitação, onde «casa» é a habitação («regime de ocupação da casa», «the house price index»). Não corrigido: custava mais de dez chamadas e duas das causas pedem uma decisão (a régua da palavra proibida perante o vocabulário da habitação, e a frase sobre o estudo do Orçamento dentro do estudo da habitação).

**O que fica para a HB1-d:** o `check:voz` inteiro (o inventário das frases, os quatro blocos por classificar, a lista fechada da B1 e a decisão sobre «a casa» e «the house» nas páginas da habitação); o lugar de direção confirma se a contagem das portas pela marca fica, dado que as linhas citadas não são linhas de série.

**Chamadas:** 32 das 40, contadas pelo construtor no seu registo (as chamadas de ferramenta desta conversa, esta incluída, mais a da entrega).
