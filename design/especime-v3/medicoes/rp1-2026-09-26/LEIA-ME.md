# RP1 · cartões dos rendimentos e dos preços

Entrega parcial por confirmação das fontes: 8 medidas seladas (`seladas`) e 5 paradas (`paradas`), das 13 previstas (`previstas`). As paragens estão identificadas abaixo. Não se substituiu nenhuma delas por um valor de comunicado nem por uma conta do projeto.

A construção acrescentou 16 linhas (`linhas_novas`). Foram comparados os bytes das 2 984 linhas anteriores (`linhas_antigas`): 0 alteradas (`linhas_antigas_alteradas`). A travessia atualizou o resumo do livro de origem no manifesto, porque esse livro ganhou linhas; os valores e os resumos de cada linha anterior ficaram intactos.

## Mandato e resultado

| Item do mandato | Resultado e medição |
|---|---|
| Pedidos e linhas | 26 pedidos registados (`pedidos`), 25 lidos (`pedidos_lidos`), 1 recusado (`pedidos_recusados`). Os 26 corpos coincidem com o registo e o alojamento (`corpos_com_sha256_conferido`). |
| Identificadores e régua | 5 réguas declaradas (`plantas.reguas`); as anuais mantêm a regra do ano. A planta troca a régua da inflação pela dos alimentos e é recusada. O teste do cartão e os controlos das áreas passam na cadeia `verify`; `enquadramento-b2.json` guarda também os casos de `tests/pais/enquadramento-b2.mjs`. |
| Declarações | 8 cartões novos nos temas (`seladas`), com nomes, perguntas e leituras nas duas edições. A primeira página continua a aplicar a seleção existente. A K16 tem 0 erros (`k16.erros`) e a K17 tem 0 erros (`k17.erros`). |
| Leituras | 16 frases novas resolvidas a partir das linhas seladas (`frases_novas_resolvidas`), guardadas em `leituras-seladas.json`. Os acertos estão abaixo e em `acertos-rp1.json`; a prova de igualdade está em `acertos-rp1.py`. |
| Unidades e períodos | A unidade conserva o significado publicado, incluindo o denominador das pensões. Meses e trimestres passam por `DataDaLinha`; as línguas dos novos títulos e rótulos estão declaradas. `check:formas`, `check:lingua` e `check:voz` passaram dentro de `build` e `verify`. |
| Mapa do repositório | Acrescentado o circuito do bloco e corrigida a referência de linha que estava deslocada. O conferidor não encontrou citações deslocadas, ausentes ou para lá do ficheiro; saída em `mapa.log`. |
| Capturas, relatório e pacote | Capturas e cópias congeladas verificadas por sha256; contagens abaixo. `medir-rp1.mjs` escreve `medidas.json`; `conferir-relatorio.py` confere os números deste relatório. |

## Cada medida prevista

| Medida | Estado | Número, unidade e período, ou razão da paragem |
|---|---|---|
| `ipc-variacao-homologa` | selada | 3,30 %, período `2026-08` (`medidas[0].valor`, `medidas[0].unidade`, `medidas[0].periodo`). |
| `ipc-variacao-media-12-meses` | selada | 2,67 %, período `2026-08` (`medidas[1].valor`, `medidas[1].unidade`, `medidas[1].periodo`). |
| `ipc-alimentacao-variacao-homologa` | selada | 2,14 %, período `2026-08` (`medidas[2].valor`, `medidas[2].unidade`, `medidas[2].periodo`). |
| `ipc-energia-em-casa-variacao-homologa` | parada | A metainformação não publica a classe 04.5. (`medidas[3].motivo`). Pedido `001-ine-0014663-meta.json`, às `2026-09-26T13:53:09Z`; endereço, cliente, resposta e sha256 em `pedidos.jsonl` do motor (`medidas[3].pedido`). |
| `ipc-combustiveis-variacao-homologa` | parada | A metainformação não publica a classe 07.2.2. (`medidas[4].motivo`). Pedido `001-ine-0014663-meta.json`, às `2026-09-26T13:53:09Z`; endereço, cliente, resposta e sha256 em `pedidos.jsonl` do motor (`medidas[4].pedido`). |
| `ihpc-variacao-homologa` | parada | INVALID_QUERY_DIMENSION: Query is invalid as per its structure's definition. Dimension "COICOP" is not defined (`medidas[5].motivo`). Pedido `005-eurostat-prc_hicp_minr.json`, às `2026-09-26T13:53:35Z`; endereço, cliente, resposta e sha256 em `pedidos.jsonl` do motor (`medidas[5].pedido`). |
| `ipc-rendas-variacao-homologa` | parada | A metainformação não publica a classe 04.1. (`medidas[6].motivo`). Pedido `001-ine-0014663-meta.json`, às `2026-09-26T13:53:09Z`; endereço, cliente, resposta e sha256 em `pedidos.jsonl` do motor (`medidas[6].pedido`). |
| `ipc-sem-habitacao-variacao-media-12-meses` | selada | 2,56 %, período `2026-08` (`medidas[7].valor`, `medidas[7].unidade`, `medidas[7].periodo`). |
| `remuneracao-bruta-mensal-media` | selada | 1 835 € por mês, período `2026-T2` (`medidas[8].valor`, `medidas[8].unidade`, `medidas[8].periodo`). Dado provisório (`medidas[8].ressalva`). |
| `remuneracao-bruta-mensal-media-variacao-real` | parada | Indicador da variação real não localizado nas pesquisas do catálogo; não calculado a partir do IPC. (`medidas[9].motivo`). Pedido `023-catalogo-pesquisa-variacao-real.json`, às `2026-09-26T13:57:51Z`; endereço, cliente, resposta e sha256 em `pedidos.jsonl` do motor (`medidas[9].pedido`). |
| `pensao-media-anual-2025` | selada | 8 066 € por pensionista por ano, período `2025` (`medidas[10].valor`, `medidas[10].unidade`, `medidas[10].periodo`). |
| `beneficiarios-do-rsi-por-mil-2024` | selada | 24,22 por mil pessoas em idade ativa, período `2024` (`medidas[11].valor`, `medidas[11].unidade`, `medidas[11].periodo`). |
| `linha-de-risco-de-pobreza-2025` | selada | 8 679 € por ano, período `2025` (`medidas[12].valor`, `medidas[12].unidade`, `medidas[12].periodo`). |

A pesquisa da variação real não prova que nenhum indicador possa existir noutro catálogo. Prova que não foi localizado nas pesquisas guardadas. A medida ficou sem cartão e não foi calculada pelo projeto. No IHPC, a paragem é do pedido prescrito: a resposta recusa a dimensão `COICOP`; o relatório não conclui que o Eurostat deixou de publicar o IHPC.

A comparação com a União estava prevista para o IHPC e ficou parada com esse pedido. Os cartões selados usam os períodos anteriores prescritos. Os documentos metodológicos foram usados apenas para confirmar conceitos e palavras; os valores novos vieram das respostas das APIs.

O brief dizia que o sítio já apresentava meses e trimestres. A leitura do código e o primeiro `ledger:check` mostraram que só os dias completos tinham transformação e que o trimestre era recusado. A extensão foi feita sem acrescentar um dia aos períodos e sem admitir trimestres em datas de leitura ou de publicação.

## Acertos às leituras

O guião prova 22 trocas nas duas edições (`acertos.acertos`) e 0 diferenças fora delas (`acertos.diferencas_fora_dos_acertos`). As 37 leituras anteriores continuam iguais (`acertos.leituras_antigas_intactas`). A contagem é de trocas, não de decisões editoriais: a mudança portuguesa e a inglesa ficam separadas.

Os acertos retiram pressupostos de subida nas médias dos preços, limitam a referência das rendas ao valor de agosto, colocam a unidade antes do provisório, corrigem o denominador das pensões, aproximam a explicação do RSI do conceito publicado e distinguem o ano do inquérito do ano dos rendimentos na linha de pobreza. O portão da voz pediu ainda a retirada de «to live on» da frase inglesa, porque fazia reaparecer «live», uma cadeia retirada; o sentido continua sustentado pelo mesmo literal e a célula não muda.

| Medida e edição | Antes | Depois | Literal que sustenta o acerto |
|---|---|---|---|
| `ipc-variacao-media-12-meses` · pt | , os preços no consumidor subiram  | , os preços no consumidor variaram  | «A variação média dos últimos doze meses compara» (`rp1-ipc-media.excerto`). Registo: `acertos-rp1.json`, entrada `0`. |
| `ipc-variacao-media-12-meses` · en | , consumer prices rose  | , consumer prices changed by  | «A variação média dos últimos doze meses compara» (`rp1-ipc-media.excerto`). Registo: `acertos-rp1.json`, entrada `1`. |
| `ipc-sem-habitacao-variacao-media-12-meses` · pt | , os preços no consumidor sem a habitação subiram  | , os preços no consumidor sem a habitação variaram  | «A variação média dos últimos doze meses compara» (`rp1-ipc-media.excerto`). Registo: `acertos-rp1.json`, entrada `2`. |
| `ipc-sem-habitacao-variacao-media-12-meses` · en | , consumer prices excluding housing rose  | , consumer prices excluding housing changed by  | «A variação média dos últimos doze meses compara» (`rp1-ipc-media.excerto`). Registo: `acertos-rp1.json`, entrada `3`. |
| `ipc-sem-habitacao-variacao-media-12-meses` · pt |  face aos doze meses anteriores: é o número que serve de referência para a atualização das rendas no ano seguinte. |  face aos doze meses anteriores. O valor de agosto serve de referência para a atualização das rendas no ano seguinte. | «variação média dos últimos doze meses do IPC sem habitação, referência para a atualização de rendas no próximo ano, fixou-se em 2,6% (2,56%) em agosto.» (`rp1-rendas-referencia.excerto`). Registo: `acertos-rp1.json`, entrada `4`. |
| `ipc-sem-habitacao-variacao-media-12-meses` · en |  compared with the previous twelve months: that is the reference figure for updating rents in the following year. |  compared with the previous twelve months. The August value is the reference figure for updating rents in the following year. | «variação média dos últimos doze meses do IPC sem habitação, referência para a atualização de rendas no próximo ano, fixou-se em 2,6% (2,56%) em agosto.» (`rp1-rendas-referencia.excerto`). Registo: `acertos-rp1.json`, entrada `5`. |
| `remuneracao-bruta-mensal-media` · pt | {"claim": "proprio"} | {"claim": "proprio", "sufixo": " euros por mês"} | «€ por mês» (`propria.unit`). Registo: `acertos-rp1.json`, entrada `6`. |
| `remuneracao-bruta-mensal-media` · pt |  euros por mês, antes de descontos e contando os subsídios, nos postos de trabalho declarados à Segurança Social e à Caixa Geral de Aposentações; cada pessoa conta tantas vezes quantos os empregos que tem. | , antes de descontos e contando os subsídios, nos postos de trabalho declarados à Segurança Social e à Caixa Geral de Aposentações; cada pessoa conta tantas vezes quantos os empregos que tem. | «€ por mês» (`propria.unit`). Registo: `acertos-rp1.json`, entrada `7`. |
| `remuneracao-bruta-mensal-media` · en | {"claim": "proprio"} | {"claim": "proprio", "sufixo": " euros a month"} | «€ por mês» (`propria.unit`). Registo: `acertos-rp1.json`, entrada `8`. |
| `remuneracao-bruta-mensal-media` · en |  euros a month, before deductions and including holiday and Christmas pay, in the jobs declared to Social Security and to the civil-service pension fund; each person counts as many times as the jobs they hold. | , before deductions and including holiday and Christmas pay, in the jobs declared to Social Security and to the civil-service pension fund; each person counts as many times as the jobs they hold. | «€ por mês» (`propria.unit`). Registo: `acertos-rp1.json`, entrada `9`. |
| `pensao-media-anual-2025` · pt |  uma pensão da Segurança Social valeu em média  |  o valor das pensões pagas pela Segurança Social foi, em média, de  | «Valor das pensões da segurança social/ Pensionistas da segurança social» (`rp1-pensoes-formula.excerto`). Registo: `acertos-rp1.json`, entrada `10`. |
| `pensao-media-anual-2025` · pt |  euros no ano inteiro, contando todas as pensões pagas, de velhice, de invalidez e de sobrevivência; é uma média entre pensões muito diferentes, e não a pensão de ninguém. |  euros por pensionista no ano inteiro, contando as pensões pagas de velhice, de invalidez e de sobrevivência. | «Valor das pensões da segurança social/ Pensionistas da segurança social» (`rp1-pensoes-formula.excerto`); «A partir de janeiro de 2017, de acordo com a nova metodologia estabelecida pelo Instituto de Informática I.P., o valor médio anual das pensões tem em conta as pensões pagas pela Segurança Social ao longo do ano.» (`rp1-pensoes-periodo.excerto`). Registo: `acertos-rp1.json`, entrada `11`. |
| `beneficiarios-do-rsi-por-mil-2024` · pt |  recebiam o rendimento social de inserção, o apoio do Estado a quem não tem rendimentos que cheguem para as necessidades mínimas. |  recebiam o rendimento social de inserção, um apoio da Segurança Social para satisfazer necessidades essenciais e favorecer a inserção laboral, social e comunitária. | «que contribuam para a satisfação das suas necessidades essenciais e que favoreçam a progressiva inserção laboral, social e comunitária» (`rp1-rsi.excerto`). Registo: `acertos-rp1.json`, entrada `12`. |
| `linha-de-risco-de-pobreza-2025` · pt | Em  | No inquérito de  | «For all countries, the reference period for income variables in EU-SILC is the previous calendar year.» (`rp1-pobreza-periodo.excerto`). Registo: `acertos-rp1.json`, entrada `13`. |
| `linha-de-risco-de-pobreza-2025` · pt |  euros por ano para viver, depois dos impostos e contando as prestações sociais: é a linha que o Eurostat traça a  |  euros por ano para viver no ano anterior, depois dos impostos e das contribuições sociais e contando as prestações sociais: é a linha que o Eurostat traça a  | «For all countries, the reference period for income variables in EU-SILC is the previous calendar year.» (`rp1-pobreza-periodo.excerto`); «taxes and social contributions that have been paid, are deducted from this sum» (`eurostat-glossario-rendimento-disponivel.excerto`). Registo: `acertos-rp1.json`, entrada `14`. |
| `linha-de-risco-de-pobreza-2025` · pt |  % do rendimento mediano do país, o do meio, em que metade da população tem mais e metade tem menos. |  % do rendimento mediano do país, ajustado ao tamanho e à composição de cada família: é o do meio, em que metade da população tem mais e metade tem menos. | «in order to reflect differences in a household's size and composition» (`rp1-rendimento-equivalente.excerto`). Registo: `acertos-rp1.json`, entrada `15`. |
| `pensao-media-anual-2025` · en |  a Social Security pension was worth on average  |  the amount of pensions paid by Social Security was, on average,  | «Valor das pensões da segurança social/ Pensionistas da segurança social» (`rp1-pensoes-formula.excerto`). Registo: `acertos-rp1.json`, entrada `16`. |
| `pensao-media-anual-2025` · en |  euros over the whole year, counting all pensions paid, for old age, invalidity and survivors; it is an average of very different pensions, and nobody’s pension. |  euros per pensioner over the whole year, counting old-age, invalidity and survivors’ pensions paid. | «Valor das pensões da segurança social/ Pensionistas da segurança social» (`rp1-pensoes-formula.excerto`); «A partir de janeiro de 2017, de acordo com a nova metodologia estabelecida pelo Instituto de Informática I.P., o valor médio anual das pensões tem em conta as pensões pagas pela Segurança Social ao longo do ano.» (`rp1-pensoes-periodo.excerto`). Registo: `acertos-rp1.json`, entrada `17`. |
| `beneficiarios-do-rsi-por-mil-2024` · en |  received the social insertion income, the State’s support for those whose income does not cover minimum needs. |  received social insertion income, a Social Security benefit to meet essential needs and support integration into employment, society and the community. | «que contribuam para a satisfação das suas necessidades essenciais e que favoreçam a progressiva inserção laboral, social e comunitária» (`rp1-rsi.excerto`). Registo: `acertos-rp1.json`, entrada `18`. |
| `linha-de-risco-de-pobreza-2025` · en | In  | In the survey for  | «For all countries, the reference period for income variables in EU-SILC is the previous calendar year.» (`rp1-pobreza-periodo.excerto`). Registo: `acertos-rp1.json`, entrada `19`. |
| `linha-de-risco-de-pobreza-2025` · en |  euros a year to live on, after taxes and including social benefits: that is the line Eurostat draws at  |  euros a year in the previous year, after taxes and social contributions and including social benefits: that is the line Eurostat draws at  | «For all countries, the reference period for income variables in EU-SILC is the previous calendar year.» (`rp1-pobreza-periodo.excerto`); «taxes and social contributions that have been paid, are deducted from this sum» (`eurostat-glossario-rendimento-disponivel.excerto`). Registo: `acertos-rp1.json`, entrada `20`. |
| `linha-de-risco-de-pobreza-2025` · en |  % of the country’s median income, the one in the middle, where half the population has more and half has less. |  % of the country’s median income, adjusted for each household’s size and composition: the one in the middle, where half the population has more and half has less. | «in order to reflect differences in a household's size and composition» (`rp1-rendimento-equivalente.excerto`). Registo: `acertos-rp1.json`, entrada `21`. |

## Células e plantas

A K7 também recusou o nome inglês que eu tinha acrescentado, «At-risk-of-poverty threshold». Corrigi-o para «At-risk-of-poverty line», de acordo com o vocabulário. A célula ficou intacta; o nome oficial da fonte continua no recibo.

| Célula | O que mudou de forma | O que continua a proteger |
|---|---|---|
| Datas do livro | Admite trimestre apenas em `reference_date`, e confere que a publicação não antecede o trimestre. | Um trimestre inválido, uma data de leitura trimestral e uma publicação anterior ao período são recusados. |
| Réguas | Tabela explícita para o mês anterior e o trimestre homólogo. | Mesma série e unidade, período presente e cadência certa; outra medida nunca serve de comparação. |
| Portão de HTML | Lê a tabela declarada e recompõe a cadência sem chamar o resolvedor dos cartões. | Recusa uma observação de outra medida, mesmo com transcrição correta; `plantas-portoes-rp1.json` guarda a mordida e os resumos da reposição do HTML. |
| A6 das áreas | Recompõe os períodos declarados e exclui o trimestre homólogo como cartão próprio. | A contagem continua a vir da declaração, das linhas e do HTML; a planta acrescenta indevidamente esse cartão e a A6 recusa-o. O assunto das linhas novas fica declarado no catálogo interno; as séries do IPC ficam explicitamente fora das áreas ministeriais, mantendo os temas nacionais. |
| F1 do `check:formas` | A transformação do período recebe a língua da rota. | O texto rendido continua a ser recomposto a partir do campo da linha. |
| K17 | A recomposição independente conhece meses, trimestres e a bandeira do INE. O sufixo traduzido passa a folha auditada; a ligação «No» é admitida. | A identidade da linha permanece igual nas duas edições; o sufixo precisa de literal, não admite algarismos fixos e não permite trocar a linha. As palavras de conteúdo continuam a precisar de apoio. |
| M8 | Reconhece `&` acompanhado da nota `Dado provisório` e encontra o valor no invólucro existente da quantidade. | O conjunto das linhas com ressalva continua a coincidir com o das bandeiras reconhecidas, na língua certa. |
| Origens no recibo | A pergunta das medidas fora dos painéis europeus passa a mostrar as origens no recibo, como já acontecia com os inquilinos. | A conferência da definição e dos campos das origens fica intacta; a planta retira a origem da pergunta da inflação e exige a recusa. |
| Cartão | A unidade marcada como campo passa pelo encaixe do sufixo de `Claim`, antes da ressalva. | O valor fica sozinho em `data-claim`; a unidade mantém a marca da própria linha e o selo conserva a ordem e a proximidade. A planta inverte unidade e ressalva. |

As 13 plantas do bloco morderam (`plantas_total`); os 8 casos de data passaram (`plantas.datas`). O registo integral está em `plantas-rp1.json`. As plantas existentes da K16 e K17 também correram na cadeia `verify`.

A catraca de portas repetidas passou de 2291 páginas (`catraca_l1.contagens.antes`) para 2323 (`catraca_l1.contagens.estudos`): entraram 32 recibos de linhas novas (`catraca_l1.contagens.entraram`), com 0 entradas fora deles (`catraca_l1.contagens.outras_entradas`) e 0 páginas antigas agravadas (`catraca_l1.contagens.paginas_antigas_agravadas`). A composição compara com a prova congelada do B2 indicada no seu campo `referencia`, cuja cabeça fica explícita; não se apresenta essa prova histórica como a captura do antes do RP1. O teto aponta para esta medição, e a planta de portas extras continua a fechar o portão.

## Capturas e cópias congeladas

O antes é da cabeça `38d3627894416097de26c52346c595c45a7b2884` (`capturas.antes.cabeca`), já com o commit do brief acima da base indicada no mandato. O depois é de `cb9571eaf7d043f8c91d9486aad34f97dee00e5d` (`capturas.depois.cabeca`).

Foram guardadas 20 capturas de página antes (`capturas.antes.paginas`) e 20 depois (`capturas.depois.paginas`), nas larguras 390, 768, 1 024, 1 280, 1 600 px (`capturas.depois.larguras`), nas duas edições e nas páginas do país e dos temas. O depois tem ainda 32 recortes de cartões (`capturas.depois.recortes`).

O captor encontrou 0 falhas de aceitação (`capturas.depois.falhas`): conferiu transbordo, posição e forma da leitura, uma marca da fonte por cartão e erros do navegador. A página dos temas passou de 36 cartões (`paginas.antes.temas_cartoes`) para 44 (`paginas.depois.temas_cartoes`); a do país passou de 20 (`paginas.antes.pais_cartoes`) para 23 (`paginas.depois.pais_cartoes`), pela regra existente da cabeça de cada tema.

As 4 páginas HTML congeladas (`paginas.depois.html`) e as 2 folhas de estilo (`paginas.depois.css`) estão em `paginas-depois/`, com sha256 no `INDICE.json`. Os resumos são relidos pelo guião das medições. As amostras inspecionadas visualmente estão identificadas por ficheiro e resumo em `inspecao-visual.json`.

Para o pacote de leitura a frio, incluir as cópias congeladas do bloco:

```sh
PACOTE_EXTRA="design/especime-v3/medicoes/rp1-2026-09-26/capturas design/especime-v3/medicoes/rp1-2026-09-26/paginas-antes design/especime-v3/medicoes/rp1-2026-09-26/paginas-depois design/especime-v3/medicoes/l1-2026-09-24/paginas-depois design/especime-v3/medicoes/l1-2026-09-24/portoes/build.cabeca" bash scripts/leituras/pacote.sh . 334cc740 HEAD /tmp/oedp-rp1-2026-09-26 design/observatorio/BRIEF-RP1-rendimentos-e-precos-os-cartoes.md design/especime-v3/medicoes/rp1-2026-09-26/LEIA-ME.md index.html temas/index.html en/index.html en/themes/index.html
```

A subpasta `motor/` do pacote conserva também o diff e os ficheiros mudados do motor, copiados da cabeça indicada no seu `INDICE.json`, com resumos dos corpos. O pacote é local e não é uma publicação.

## Commits, cabeça e portões

Cabeça do código do sítio: `cb9571eaf7d043f8c91d9486aad34f97dee00e5d` (`cabeca_do_codigo`). Cabeça do motor: `6508b05849b1ea041d91e67339370a860a57f65b` (`cabeca_motor`). O commit final de entrega acrescenta as provas desta cabeça; não altera o código que os portões mediram.

A primeira corrida completa de `build`, na cabeça anterior, parou porque o portão de HTML ainda exigia réguas anuais. O portão foi estendido com recomposição independente e uma planta que conserva a proteção. Essa tentativa e o `typecheck` dessa cabeça estão em `portoes/preparacao-3b3dac48/`; os códigos abaixo pertencem à cabeça corrigida.

- Sítio: `3b3dac4853565782996bc3e99f519404e3b17ea6 RP1: acrescentar os cartões confirmados pelas APIs`.
- Sítio: `83fb702cff2ff297ea2c9024f8a854d2b56f287e RP1: completar as declarações e conservar as proteções dos portões`.
- Sítio: `cb9571eaf7d043f8c91d9486aad34f97dee00e5d RP1: mostrar as origens das perguntas nos recibos`.

- Motor: `c42dab902afa3f7f693980745e3cecd7f8cb8a2e RP1: selar observações nacionais de rendimentos e preços`.
- Motor: `372cbe1d9b57a9cde19fdb4f1843deeadd41704e RP1: conservar literal o excerto com bandeira do INE`.
- Motor: `6508b05849b1ea041d91e67339370a860a57f65b RP1: conservar as etiquetas no excerto provisório`.

A corrida de `verify` da cabeça seguinte parou em `check:lugar`: faltavam as origens das perguntas nos novos recibos, e o teto das portas repetidas ainda não tinha a composição dos recibos acrescentados. As origens passaram a render-se; a conferência delas não foi afrouxada. O teto só mudou depois da medição página a página e da planta. Os registos dessa preparação estão em `portoes/preparacao-83fb702c/`.

Os commits do motor passaram pelo pre-commit instalado, que executa `python3 -m core.gate`. A primeira tentativa foi recusada porque o novo teste não imprimia a contagem no formato `PASS`; a saída foi corrigida e o commit só entrou com o portão verde. As saídas completas estão nos ficheiros `motor-*.log` desta pasta.

| Portão | Código lido do ficheiro | Cabeça medida |
|---|---|---|
| `build` | 0 (`portoes.build.codigo`, lido de `portoes/build.codigo`) | `cb9571eaf7d043f8c91d9486aad34f97dee00e5d` |
| `verify` | 0 (`portoes.verify.codigo`, lido de `portoes/verify.codigo`) | `cb9571eaf7d043f8c91d9486aad34f97dee00e5d` |
| `typecheck` | 0 (`portoes.typecheck.codigo`, lido de `portoes/typecheck.codigo`) | `cb9571eaf7d043f8c91d9486aad34f97dee00e5d` |

Cada comando correu separadamente; os ficheiros de código anteriores foram apagados antes da corrida final. As construções de preparação, destinadas às conferências tocadas pela mudança e às capturas iniciais, estão identificadas nos seus próprios registos.

## Custo e trabalho pendente

A janela entre o primeiro pedido registado e o fim do último portão durou 5 781 segundos (`custo.segundos_da_janela`). Esta janela não inclui a leitura inicial do repositório.

No registo da sessão `rollout-2026-09-26T14-50-19-01a0ddfb-28f2-7522-ad5d-af8f210018d8.jsonl`, lido às `2026-09-26T15:30:51.194Z`, o modelo é `gpt-6-astra`: 34 602 194 tokens de entrada (`custo.sessao.input_tokens`), dos quais 33 881 600 em cache (`custo.sessao.cached_input_tokens`), e 134 073 de saída (`custo.sessao.output_tokens`). É a contagem cumulativa do registo, não um preço. O custo monetário não está exposto e não foi estimado.

Ficam por construir apenas as medidas paradas nas fontes e descritas na tabela. O próximo passo dessas medidas é corrigir ou identificar o pedido no lugar de direção e voltar a confirmar a metainformação. Não se acrescentaram medidas municipais, gráficos, referências de cor ou valores de outras publicações. A leitura do país e o rótulo de IA ficaram intactos. Não houve publicação remota.

## RP1b

Entrega concluída: 4 medidas novas seladas, 12 cartões do bloco nos temas e 9 linhas novas (`rp1b.seladas`, `rp1b.total_do_bloco`, `rp1b.linhas_novas`). As 3 000 linhas que já existiam foram comparadas byte a byte: 0 alteradas (`rp1b.linhas_anteriores`, `rp1b.linhas_anteriores_alteradas`).

A secção anterior é o relato histórico da primeira entrega. Os seus dados e portões mantêm-se; as cópias em `paginas-depois/` são agora as desta peça. As cópias anteriores continuam no histórico da cabeça indicada naquela secção. O antes e as capturas da primeira entrega não foram repetidos.

| Item do mandato | Resultado e medida |
|---|---|
| Pedidos e linhas | 5 pedidos novos pelo cliente do projeto; 31 corpos do conjunto conferidos contra o registo e o alojamento (`rp1b.pedidos_novos`, `rp1b.corpos_conferidos`). O `core.gate` terminou a 0, lido de `motor-rp1b.codigo`. |
| Réguas declaradas | 9 réguas no bloco (`rp1b.plantas.reguas`). O IHPC tem Portugal no mês anterior e a União no mesmo mês, sem cartão autónomo para a linha europeia. |
| Medidas e perguntas | As medidas novas estão nos temas pedidos. K16: 0 erros (`rp1b.k16.erros`). A regra de `temasDoPais()` permanece igual. |
| Leituras | 24 frases resolvidas (`rp1b.frases_resolvidas`), iguais à segunda redação fora de 6 trocas auditadas (`rp1b.acertos.acertos`). K17: 0 erros nas palavras e 0 no HTML (`rp1b.k17.erros`, `rp1b.leituras_rendidas.erros`). |
| I153 | O espaço faz parte do texto da bandeira no valor e na leitura. As plantas colam a bandeira à unidade e são recusadas. A caixa em linha conserva a margem visual existente. |
| Mapa | Circuito reposto e conferido por `conferir-mapa.py`; saída em `mapa-rp1b.log`. |
| Capturas, relatório e provas | 20 capturas de página e 50 recortes, com 0 falhas (`rp1b.capturas`). Cópias congeladas e resumos conferidos por `medir-rp1.mjs`. |

### As medidas e as fontes

| Medida | Valor | Unidade | Período | Mês anterior | União no mesmo mês |
|---|---|---|---|---|---|
| `ipc-energia-em-casa-variacao-homologa` | 1,36 | % | `2026-08` | 1,12 (2026-07) | Não declarada |
| `ipc-combustiveis-variacao-homologa` | 23,78 | % | `2026-08` | 16,58 (2026-07) | Não declarada |
| `ipc-rendas-variacao-homologa` | 5,22 | % | `2026-08` | 5,26 (2026-07) | Não declarada |
| `ihpc-variacao-homologa` | 3,6 | % | `2026-08` | 3,1 (2026-07) | 3,2 (2026-08) |

Os valores, períodos, unidades e comparadores desta tabela são `rp1b.medidas`. O INE confirmou as categorias, a frequência mensal, «Percentagem (%)» e a escala zero. No IHPC, a resposta confirma `RCH_A`, `coicop18=TOTAL`, as geografias e o último mês publicado. A unidade percentual está descrita em `extension.description`; o excerto mantém «Annual rate of change», como a resposta o escreve. A publicação vem de `updated`.

| Pedido | Hora UTC | Cliente | Sha256 |
|---|---|---|---|
| [`027-ine-0014647-meta.json`](https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=0014647&lang=PT) | `2026-09-26T16:03:37Z` | `core.http.HttpClient.condicional` | `e5d99cf6a277344f25d8feb43e2eb96cb628507e4247ce4822715b52e012345c` |
| [`028-ine-0014647-dados.json`](https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=0014647&Dim1=S3A202608,S3A202607&Dim2=PT&lang=PT) | `2026-09-26T16:04:13Z` | `core.http.HttpClient.condicional` | `598399b53970e3e270ab50969f4fbdf95f8d3347491f1ffda406ab5bb9949eac` |
| [`029-eurostat-prc_hicp_minr-rp1b.json`](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_minr?format=JSON&lang=EN&unit=RCH_A&coicop18=TOTAL&geo=PT&geo=EU27_2020&lastTimePeriod=2) | `2026-09-26T16:04:14Z` | `core.http.HttpClient.condicional` | `f2a3035b7ff23e772a3f1347a11bf01189723f074b84018b041e39e2a171dbd4` |
| [`030-ine-0014647-minfo.html`](https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0014647&lingua=PT) | `2026-09-26T16:04:14Z` | `core.http.HttpClient.condicional` | `184a4e7fccebe7360411f9dcd1f32b3fa95f706c72962ccb21e2746c68a00824` |
| [`031-eurostat-prc_hicp_esms.html`](https://ec.europa.eu/eurostat/cache/metadata/en/prc_hicp_esms.htm) | `2026-09-26T16:04:20Z` | `core.http.HttpClient.condicional` | `cc5f8cfea4d303f866fc4314f3eba82f017bba7975cc228e8bab04a15cef5dd2` |

Os corpos estão em `content/13 Dominios/source/rp1/` no motor, registados em `FETCH.json` e `MANIFEST.sha256`. As perguntas e as leituras citam a página `minfo.jsp` do INE, a ficha `prc_hicp_esms` e os campos publicados nas respostas. `origens-rp1.py` confere o excerto literal e o selo de cada origem, sem apresentar uma cópia de teste como resposta autêntica.

### Os acertos que restaram

A única decisão de acerto foi explicitar os lubrificantes, que pertencem à categoria publicada. A troca repete-se nos ramos do sinal e nas duas edições. As médias dos últimos doze meses e as frases curtas da linha de pobreza são as da segunda redação, com as folhas da auditoria atualizadas.

| Medida e edição | Antes | Depois | Literal |
|---|---|---|---|
| `ipc-combustiveis-variacao-homologa` · pt · `positivo` | os preços dos combustíveis para os veículos estavam | os preços dos combustíveis e dos lubrificantes para os veículos estavam | «Combustível e lubrificantes para equipamento para transporte pessoal» (`propria.excerpt`) |
| `ipc-combustiveis-variacao-homologa` · pt · `negativo` | os preços dos combustíveis para os veículos estavam | os preços dos combustíveis e dos lubrificantes para os veículos estavam | «Combustível e lubrificantes para equipamento para transporte pessoal» (`propria.excerpt`) |
| `ipc-combustiveis-variacao-homologa` · pt · `zero` | os preços dos combustíveis para os veículos estavam | os preços dos combustíveis e dos lubrificantes para os veículos estavam | «Combustível e lubrificantes para equipamento para transporte pessoal» (`propria.excerpt`) |
| `ipc-combustiveis-variacao-homologa` · en · `positivo` | the prices of fuels for vehicles were | the prices of fuels and lubricants for vehicles were | «Combustível e lubrificantes para equipamento para transporte pessoal» (`propria.excerpt`) |
| `ipc-combustiveis-variacao-homologa` · en · `negativo` | the prices of fuels for vehicles were | the prices of fuels and lubricants for vehicles were | «Combustível e lubrificantes para equipamento para transporte pessoal» (`propria.excerpt`) |
| `ipc-combustiveis-variacao-homologa` · en · `zero` | the prices of fuels for vehicles were | the prices of fuels and lubricants for vehicles were | «Combustível e lubrificantes para equipamento para transporte pessoal» (`propria.excerpt`) |

### Células, plantas e limites da conferência

| Célula | Forma nova e proteção conservada |
|---|---|
| Réguas e portão de HTML | A declaração da União exige a mesma série, unidade e mês; o portão recompõe a associação sem chamar o resolvedor. As plantas recusam outro mês, série, unidade e a troca pela linha portuguesa anterior. |
| K17 e voz | O resolvedor e a recomposição independente incluem o espaço. A K17 confere a bandeira no valor e na leitura, a palavra da edição e a igualdade dos conjuntos de linhas. A planta mostrou que o `check:voz` só a chamava na primeira página; passou a chamá-la também nos temas e a recusar ali a bandeira colada. |
| M8 | Esta célula vive em `tests/inicio/areas.mjs`, não em `check:voz`. Exige agora o texto com espaço inicial e mantém a igualdade entre as linhas com ressalva e as bandeiras reconhecidas. A associação passa a reconhecer também o valor imediatamente anterior à bandeira na régua, que já era rendida mas não era contada. A medição está em `m8-rp1b.json`, e as plantas que colam ou retiram a bandeira estão em `plantas-m8-rp1b.json`. |
| Áreas | A A6 continua a excluir as observações anteriores; as classes do IPC e o IHPC entram na exclusão declarada dos preços, e a União na exclusão dos agregados. Nenhuma matéria ministerial foi inventada. |
| Motor, associações europeias | O teste antigo admitia uma só nota europeia. Exige agora exatamente os agregados declarados e recusa a nota numa linha de Portugal. A tentativa recusada está em `motor-rp1b-tentativa-1.log`; o commit entrou apenas depois do portão verde. |
| Portas repetidas | A catraca continua a ser uma contagem de páginas. A composição admite apenas os recibos novos e recusa qualquer página anterior agravada. |

As 20 plantas de `plantas-rp1.json` e as 2 plantas integrais de `plantas-portoes-rp1b.json` foram recusadas com a mordida esperada (`rp1b.plantas`, `rp1b.plantas_portoes`). As plantas integrais repõem os bytes e conferem o sha256.

A catraca mede 2341 páginas (`rp1b.catraca_l1.contagens.estudos`), contra 2291 na prova congelada de referência, com 0 páginas anteriores agravadas. Esta comparação conserva a base histórica do B2; não chama a essa base o antes desta peça.

A primeira chamada ao exportador foi feita sem o manifesto do estudo e selecionou o estudo de Évora. As diferenças de comentários e do seu registo foram repostas byte a byte antes da travessia correta, com `--manifest publisher/manifest.dominios.json`. A comparação de todas as linhas anteriores no medidor confirma a reposição. Nenhum desses ficheiros entrou num commit desta peça.

### Capturas e cabeças

Na I153, o navegador mediu 20 ressalvas nos recortes da remuneração. O espaço inicial ocupa no máximo 0 px (`rp1b.i153`): separa o texto acessível sem alargar a margem visual.

As capturas têm prefixo `rp1b-` e cobrem as larguras 390, 768, 1 024, 1 280, 1 600 px, nas duas edições, no país e nos temas. Os recortes cobrem cada medida nova e a remuneração em todas essas larguras. `capturas-rp1b-depois.json` contém as dimensões, o texto e os resumos; `inspecao-visual-rp1b.json` identifica as imagens abertas para inspeção.

As cópias congeladas incluem 4 páginas HTML e 2 folhas de estilo (`rp1b.congeladas`), presas por sha256 em `paginas-depois/INDICE.json`. Cabeça do código e das capturas: `1819395a994791fdc77bed14a17ab3df844f4d6b`. Cabeça do motor: `d3f7a619bc46184847775b93c1b1a953e2777d3f`. O último commit entrega as provas sem mudar o código medido.

- Projeto: `dfe368c27fbb869ab4cdfb4d9534055f8fad1414 RP1b: acrescentar quatro cartões e separar a bandeira provisória`.
- Projeto: `0a6f3d19422f6d52c10a7c4f397fc7e2c08b1527 RP1b: conferir ressalvas nos temas e nas áreas`.
- Projeto: `7d580742f511234ef6b80675c446966b3cfe36ab RP1b: preparar a medição e a entrega das provas`.
- Projeto: `1819395a994791fdc77bed14a17ab3df844f4d6b RP1b: declarar a língua dos rótulos das fontes`.
- Motor: `d3f7a619bc46184847775b93c1b1a953e2777d3f RP1b: selar as classes do IPC e a comparação europeia do IHPC`.

| Portão | Código lido do ficheiro | Cabeça medida |
|---|---|---|
| `build` | 0, de `portoes/rp1b/build.codigo` | `1819395a994791fdc77bed14a17ab3df844f4d6b` |
| `verify` | 0, de `portoes/rp1b/verify.codigo` | `1819395a994791fdc77bed14a17ab3df844f4d6b` |
| `typecheck` | 0, de `portoes/rp1b/typecheck.codigo` | `1819395a994791fdc77bed14a17ab3df844f4d6b` |

Os comandos completos correram separadamente, uma vez nesta cabeça. As conferências de preparação estão em `portoes/rp1b/preparacao/`. Os portões da primeira entrega ficaram intactos.

A construção anterior terminou a 1 na cabeça `7d580742f511234ef6b80675c446966b3cfe36ab` (`rp1b.tentativa_build`), porque faltava declarar a língua dos dois rótulos publicados pelas fontes, embora a dos títulos já estivesse declarada. As línguas foram declaradas em `LINGUA_DOS_ROTULOS`, sem mudar os rótulos nem os valores. A saída recusada ficou em `portoes/rp1b/tentativa-1/`.

### Custo e trabalho pendente

A janela entre o primeiro pedido desta peça e o último portão durou 3 256 segundos (`rp1b.custo.segundos_da_janela`); não inclui a leitura inicial.

No registo `rollout-2026-09-26T17-01-49-01a0de73-8c86-7ae2-9d60-664b8752f295.jsonl`, lido às `2026-09-26T17:00:34.867Z`, o modelo exposto é `gpt-6-astra`: 18 292 339 tokens de entrada, 17 908 864 em cache e 69 786 de saída (`rp1b.custo.sessao`). São contagens cumulativas, não um preço. O custo monetário não está exposto.

Não ficaram medidas desta peça por construir. A variação real da remuneração foi retirada pelo §8 e continua fora. A leitura do país, a regra da primeira página e o rótulo de IA não foram alterados. Não houve `push` nem publicação. A leitura a frio e a aterragem pertencem ao lugar de direção.
