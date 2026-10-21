# HB1: A casa em Portugal e na Europa

## Estado da entrega HB1-c

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
