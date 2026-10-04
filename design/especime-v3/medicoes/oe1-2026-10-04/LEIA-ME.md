# OE1: o dinheiro do Estado

O teste de aceitação integral do §2 não está cumprido. Foram construídas e exportadas **186 linhas**, das quais **150 transcrevem valores publicados** e **36 são contas declaradas**. As lacunas de fonte estão identificadas abaixo. Os resultados efetivos dos portões constam da tabela, sem converter uma tentativa em sucesso.

## Mandato e medida

| Item | Medida e resultado |
|---|---|
| 1. Fontes à mão da máquina | 11 XML recebidos por endereços publicados; 14 conjuntos do dados.gov.pt com código de licença cc-by; matrizes Eurostat de 2024 e 2025 e 30 pedidos individuais; mapas PDF; sínteses de julho e agosto e anexo XLSX de agosto. Recibos de pedido, data, estado HTTP, bytes e SHA-256 no motor. |
| 2. Leitores | Leitores separados para XML, XLS, JSON-stat e PDF; cliente comum na aquisição. Provas no módulo publisher.oe1_test, registado em core.gate. O anexo XLSX é uma segunda leitura de 26 valores da síntese. |
| 3. Linhas | Parcial: 16 rubricas orgânicas do Mapa 4, incluindo os Encargos Gerais do Estado e a Presidência do Conselho de Ministros; 20 programas no orçamento; 20 programas executados até agosto; dez funções no orçamento e dez executadas até julho; 30 células Eurostat; totais, indicadores, diferenças de consolidação e 36 derivadas. Faltam os totais consolidados de receita e saldo dos mapas e as necessidades de financiamento mensais. A tabela integral está neste relatório e em LINHAS.md. |
| 4. Portões | Códigos e cabeças lidos de ficheiro na tabela abaixo. Uma cabeça diferente não é uma prova da cabeça final. |
| 5. Relatório | Este ficheiro, LINHAS.md, medidas.json e as provas atuais medidas-oe1e.json, medir-oe1e.py, custo-oe1e.json e a resposta curta. Cada contagem tem um conhecido positivo executado pelo guião. |

## O que a leitura corrigiu e o que ficou por selar

1. A biblioteca e a vista XML deram 401. A página pública deu 200, mas a abertura da lista falhava porque `theForm` não estava definido. O navegador usa o User-Agent da casa e associa esse nome ao formulário público existente, sem autenticação. A resposta pública da lista revela os 11 links; todos deram 200 no cliente comum. O navegador só localiza; os leitores consomem os corpos obtidos pelo motor.
2. Os XML publicados não incluem os mapas 7, 8 e 9, nem os totais ministeriais. Os 16 totais foram lidos da coluna POR MINISTÉRIOS do Mapa 4 PDF e fecham exatamente com os 20 programas do Mapa 1 XML. Encargos Gerais do Estado não é um ministério governamental. Os rótulos da fonte mantêm a grafia publicada, incluindo COESAO e HABITACÃO; os nomes do projeto usam a grafia corrente.
3. A despesa total consolidada AC+SS está impressa no Mapa 1. Não se encontrou uma receita total consolidada AC+SS nem um saldo correspondente impressos nos mapas lidos. Não se fabricou a consolidação somando subsetores. Receita, despesa e saldo efetivos AC+SS são linhas próprias da síntese, identificadas como tal, e não substituem esta lacuna dos mapas.
4. A despesa bruta da Segurança Social é `89 743 812 222` no Mapa 1 e `89 749 381 149,00` no Mapa 8: diferença medida de `5568927.00` euros. O total consolidado coincide. Não atravessou uma escolha entre os dois totais brutos.
5. O catálogo funcional só publica julho de 2026 à data de acesso. A síntese mais recente é agosto, publicada a 30.09.2026. Não se fez passar julho por agosto: funções até julho, programas e contas até agosto. Nenhuma execução é só a despesa do mês; é acumulada desde janeiro.
6. Saldo não é dívida emitida. Foram preservados os saldos e os fluxos líquidos de ativos e passivos que a síntese publica. Não se encontrou nos indicadores mensais uma linha que permita afirmar que uma parcela exata da despesa foi financiada por dívida. O quadro de capacidade/necessidade em contabilidade nacional refere-se ao primeiro semestre, outro período e outra ótica. Esse ponto fica por selar.
7. Os indicadores AC do orçamento não fecham entre despesa orçamental, ativos e passivos da despesa e despesa efetiva: a diferença medida é `802.9` milhões. Os valores são transcritos com aviso e não usados para calcular uma parcela financiada por dívida.
8. Os XLS funcionais não imprimem a unidade. A escala em milhões foi conferida com receita, despesa e saldo da conta AC na síntese de julho, para orçamento e execução, seis correspondências exatas. As dez funções e o código 99 fecham com a despesa efetiva: diferença de -0,1 milhões no orçamento e zero em julho. O limite de arredondamento, calculado sobre onze parcelas e um total a uma décima, é 0,60 milhões. A diferença não foi apagada nem redistribuída.
9. O Eurostat de 2024 tem as dez funções dos 27 países. Em 2025, apenas LU tem as dez. Portugal e Espanha conservam a bandeira provisória p, com explicação em português e inglês. A União é o agregado publicado, não uma média calculada.
10. O modelo de Évora citado no brief vem do Município de Évora, não da DGAL. O §0 foi reproduzido: 3009 linhas iniciais, zero EO e zero COFOG Eurostat. Não se alterou a linha de Évora.

As diferenças de perímetro constam agora das ressalvas publicadas nas famílias a que se aplicam; a regra de citar os ficheiros oficiais mantém-se no registo: mapas e Eurostat têm perímetros diferentes; citam-se dados e documentos oficiais, nunca os portais oe.gov.pt ou Mais Transparência. As quotas ministeriais usam despesa **bruta da AC**, com operações financeiras e transferências internas. As quotas funcionais usam despesa **efetiva consolidada da AC**, incluindo no denominador a diferença de consolidação. Não são repartições da mesma grandeza.

## Fontes e licenças

| Fonte | Endereço de descoberta e licença lida |
|---|---|
| Mapas da lei | [Ficheiros de dados da EO](https://www.eo.gov.pt/politicaorcamental/Paginas/OEpagina_ficheirosdeDados.aspx). O XML não declara licença aberta; a página indica todos os direitos reservados. O sítio recebe transcrições e referências, não cópias dos ficheiros. |
| Mapas PDF | [Orçamento aprovado](https://www.eo.gov.pt/politicaorcamental/Paginas/OrcamentosEstado.aspx?Ano=2026&TipoOE=Or%C3%A7amento+Estado+Aprovado). Sem licença aberta indicada; aviso de direitos da EO. Nos mapas 8 e 9 a fonte originária impressa é IGFSS, IP. |
| dados.gov.pt | [API do catálogo da EO](https://dados.gov.pt/api/1/datasets/?organization=5ae97f98c8d8c915d5faa3b5&page_size=100). Os 14 conjuntos declaram cc-by; não se inventou uma versão da licença. Cada linha aponta ao recurso efetivamente obtido. |
| Eurostat | [gov_10a_exp](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024). A [política de reutilização](https://ec.europa.eu/eurostat/help/copyright-notice) autoriza reutilizar os dados com indicação da fonte; a referência a CC BY 4.0 nessa página diz respeito ao conteúdo editorial. |
| Síntese e anexo | [Página oficial mensal](https://www.eo.gov.pt/execucaoorcamental/Paginas/Sintese-da-Execucao-Orcamental-Mensal.aspx). Sem licença aberta indicada no documento; aviso de direitos da EO. As linhas apontam ao PDF e à página exata; o XLSX é conferência independente no motor. |

## Provas e integração

O ensaio e a escrita passam pelo exportador comum. Cada YAML é confrontado com o resumo da travessia; cada excerto publicado é confrontado com a transcrição do leitor. As derivadas têm a conta em palavras nas duas línguas, origens e check. Foram inspecionadas visualmente as seis páginas do Mapa 4, a segunda página dos mapas 1, 8 e 9 e as páginas 49, 50 e 72 da síntese de agosto.

O módulo de testes planta alterações em valores, ano XML e XLS, unidade, programa, coordenada geográfica, presença da célula, bandeira, licença, arredondamento, denominador, período e livro gerado. O relatório dos testes está nos registos do motor. As regressões do exportador e dos leitores existentes são corridas pelo portão comum.

A primeira corrida do motor falhou por impedimento de localhost na caixa de areia, caches ausentes e uma regressão na aceitação das bandeiras antigas. A regressão foi corrigida, mantendo o formato antigo e acrescentando o caso JSON-stat de uma célula. As três caches de recortes foram copiadas das fixtures versionadas desta mesma worktree, conservando o cabeçalho que declara a origem; não foram regeneradas a partir de PDFs nem apresentadas como uma nova leitura das fontes.

A proposta `publisher/oe1_site_support.patch`, no motor, identificou cinco adaptações no sítio. O mandato OE1-b autorizou essa integração, o nome do conjunto e as plantas das bandeiras. Ficheiros da proposta efetivamente alterados nesta árvore: **5 de 5**. A aplicação inclui o nome pedido no OE1-b e reforça a comparação do valor em decimal e a ligação da bandeira ao país e ao período. A secção OE1-b descreve as alterações. Os portões abaixo dizem o resultado real, independentemente da existência da proposta.

As decisões do §5 foram respeitadas: o bloco entrega dados para a futura página do governo; as linhas usam os recibos da família de páginas já existente no livro-razão, sem novos componentes ou declarações de rota; todas as linhas publicadas declaram o perímetro; as fontes que atravessam têm corpos e pedidos reproduzíveis. O ponto da biblioteca foi resolvido por endereços publicados, com os 401 conservados como prova da limitação inicial.

O protocolo final, conservado no OE1-e, é este: o código é comitado antes da corrida completa; --conferir-final exige cinco zeros, tempos completos e a cabeça corrente. Um último commit, reservado às provas e ao relatório, conserva esses resultados e não muda o código construído ou as linhas. A secção OE1-e distingue a cabeça de código do commit que a entrega com as provas.

## Portões lidos de ficheiro

Corrida completa pela tranca, ledger incluído. O último commit só guarda as provas da cabeça de código.

| Portão | Código lido | Cabeça da corrida |
|---|---|---|
| motor | [0](portoes/motor.codigo) | `38457b2723c47ea126984be6c5c1f778967e6847` |
| ledger | [0](portoes/ledger.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |
| build | [0](portoes/build.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |
| verify | [0](portoes/verify.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |
| typecheck | [0](portoes/typecheck.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |

## Commits e cabeças

Motor `38457b2723c47ea126984be6c5c1f778967e6847`, sobre master `47f12e15c927bf238522ac680b1f54c9de29f55d`. Sítio, cabeça de código `f5549dc8be22f4e936d62fbdfe4eac94b538db97`, sobre main `f27aa38a0939d11908863afe6ee117da03404f5f`; o commit seguinte entrega apenas as provas.

Motor:

- `42dfed9 OE1: guardar fontes oficiais e aquisição reproduzível`
- `a1ef2b7 OE1: selar 186 linhas e provar os leitores e a travessia literal`
- `cf218da OE1-d: conferir cabeçalhos e publicar nomes, acumulados e ressalvas`
- `1f7520e Publica os limites das contas e das funções na ressalva`
- `38457b2 OE1-e: provar o alcance das ressalvas e a queixa de cada cabeçalho`

Sítio, depois do rebase:

- `fe296a51 OE1: o brief «o dinheiro do Estado por ministério e por função, selado no motor» com o §0 medido, pela ideia do diretor de 04.10.2026 e pela leitura de fora de 03.10`
- `f881fbf6 OE1: receber 186 linhas pelo tubo do motor`
- `3af4d137 OE1: relatar a selagem parcial, as lacunas de fonte e os portões`
- `66b1317d OE1-b: integrar o conjunto e conferir as bandeiras Eurostat nos dois formatos`
- `f6274a36 OE1-b: reconferir as duas contagens do livro no inventário`
- `e5fa5473 OE1-b: comitar o relatório, as plantas e as medições da integração`
- `35f0fc39 OE1-b: reconferir a L1 com a construção de partida`
- `09c12e98 OE1-b: guardar as provas e as propostas adicionais`
- `899f3c3e OE1-b: fechar o relatório com duas extensões pendentes`
- `a6f1ca07 OE1-c: reconhecer os sete localizadores e plantar as recusas em I1 e I3`
- `c72b69c4 OE1-c: recortar o espécime do livro e provar o teto com o recorte retirado`
- `00298a0b OE1-c: registar as plantas, as medições e o protocolo da corrida final`
- `6c224cf0 OE1-c: guardar a corrida final verde e os seus contadores`
- `4dc99ef6 OE1-d: dizer a medida, o acumulado e a ressalva nas duas edições`
- `9be5a921 OE1-d: conferir unidades e ressalvas depois de integrar R2 e RP3`
- `01714689 OE1-d: fechar avisos, registo da voz e medição reproduzível`
- `8916f9c8 OE1-d: retirar a edição órfã e provar o formato da medição L1`
- `74e7126b OE1-d: guardar portões verdes, medições e relato final`
- `ca1de3de OE1-d: provar as bases integradas e conservar as referências do R3`
- `a0902a08 OE1-d: guardar as provas verdes da cabeça integrada com o R3`
- `5888f607 OE1-e: publicar apenas as ressalvas aplicáveis e provar os recibos`
- `f5549dc8 OE1-e: mostrar o período de cada linha e medir as correções com plantas`

## Decisões em vigor

A leitura antes das alterações identificou, nos ficheiros do motor, §1.6, §1.24, §1.31, §1.47, §1.108, §1.115, §1.126 e §1.145. Nos ficheiros de referência do sítio: §1.17, §1.24, §1.31, §1.32, §1.36, §1.40, §1.44 e §1.47. A proposta de integração adicional cita ficheiros abrangidos por §1.3, §1.17, §1.24, §1.28, §1.40, §1.47, §1.49, §1.68, §1.99, §1.124, §1.127 e §1.145. Os ficheiros novos foram explicitamente recusados pelo guião antes de existirem em HEAD; essa ausência não foi contada como leitura bem-sucedida. A lista final por ficheiro é guardada em decisoes-motor.log e decisoes-sitio.log após os commits.

## Conferências e plantas executadas

| Conferência | Resultado | Estrago plantado pela função de recusa |
|---|---|---|
| Livro regenerado byte a byte | passou | não |
| Manifesto regenerado sem valores ou excertos | passou | não |
| Todas as fontes consumidas têm recibo e resumo | passou | não |
| Excerto PDF é uma linha literal da página | passou | não |
| Bandeiras provisórias preservadas | passou | não |
| Livro manualmente adulterado | passou | sim |
| Programa não fecha com ministério | passou | sim |
| Funções excedem o limite de arredondamento | passou | sim |
| Unidade de milhões confundida com euros | passou | sim |
| Bandeira removida da linha | passou | sim |
| Denominador zero | passou | sim |
| Derivação mistura unidades | passou | sim |
| Derivação mistura períodos | passou | sim |
| Bytes alterados sem reparar o recibo | passou | sim |
| Ano XML alterado com resumo reparado | passou | sim |
| Unidade XML alterada | passou | sim |
| Programa duplicado | passou | sim |
| Ano XLS alterado com resumo reparado | passou | sim |
| Célula ausente não vira zero | passou | sim |
| Bandeira não suportada | passou | sim |
| País trocado no corpo | passou | sim |
| Licença aberta retirada | passou | sim |
| YAML relido conserva quebras literais | passou | não |
| Travessia prova todas as linhas e contas | passou | não |
| Travessia conserva cada espaço e quebra do excerto | passou | não |
| Excerto literal fabricado recusado | passou | sim |
| JSON literal com bandeira e valor no mesmo índice | passou | não |
| Bandeira junto de outro valor é recusada | passou | não |
| Bandeira de outro país é recusada | passou | não |
| Determinismo do YAML | passou | não |

As recusas de bandeira junto de outro valor e de outro país também alteram entradas, mas verificam diretamente o resultado falso do detetor, em vez de esperar uma exceção.

## OE1-b, registo histórico

Esta passagem integra as mesmas 186 linhas. O livro do motor, os YAML e o registo da travessia conservam os seus bytes; as lacunas de fonte descritas acima mantêm-se.

| Ficheiro | Alteração e razão |
|---|---|
| src/data/studies.mjs | Regista oe-2026 em INTERNAL_SOURCES com o nome «O dinheiro do Estado por ministério e por função (OE1)» e a nota de que aguarda a página do governo. Não acrescenta WORKS, conjunto ou rota. |
| src/data/areas.mjs | Declara que estas linhas aguardam a página do governo; o agregado da União conserva a regra europeia existente. Não atribui funções a ministérios. |
| src/i18n/lingua-dos-titulos.mjs | Declara a língua dos títulos, rótulos, fonte e edições lidos nas fontes, conservando os nomes. |
| src/i18n/unidades.mjs | Acrescenta apenas «milhões de euros» para «million euros», facto de dicionário. Não altera a unidade de nenhuma linha. O recurso a português com lang mantém-se para unidades sem tradução declarada. |
| src/lib/ledger.mjs | Confere as sete coordenadas, o único índice de valor, o índice da bandeira e o seu significado no JSON-stat. Compara o literal numérico em decimal. No formato anterior confere valor, período e localização indicada no pedido; conserva o formato regional com várias coordenadas. |
| tests/linha/cadeias-proveniencia.mjs | Executa as plantas dos dois formatos no mesmo validateLedger chamado pelo ledger:check. Altera cópias em memória e repõe as linhas originais. |
| design/especime-v3/INVENTARIO-FRASES.md | Reconfere duas contagens geradas pelo livro: 3195 linhas e 366 derivadas, nas duas línguas. Copia o texto do HTML e conserva a classificação e o formato do K2. Não altera palavras das páginas nem a emenda de voz do inventário. |
| medir.py; medidas.json | Reconstroem as contagens, os conhecidos positivos e o relatório; distinguem provas preparatórias dos ficheiros da corrida final. |
| custo.py; custo-oe1b.json | Medem o incremento dos contadores desde a ordem OE1-b e o tempo decorrido. |
| npm-sem-caminhos.py | Conserva os códigos, retira identificadores locais da saída e admite uma pasta separada para a comparação da base. |
| base-l1.py; base-l1.json | Constroem a versão de partida nesta worktree e conferem a reposição dos ficheiros. |
| medir-l1.mjs; l1-oe1b.json; scripts/lugar-tetos-b1.json | Comparam as listas completas, os padrões e as plantas; registam a contagem medida da L1. |
| cauda-verify.py; oe1b-cauda/ | Correm os comandos que a falha L1 tinha impedido de executar e conservam cada resultado, incluindo as falhas. |
| provar-tempos.py; plantas-tempos.json | Conferem a diferença de precisão dos relógios e a recusa de resultados antigos ou incompletos. |
| provar-localizadores.py; indice-localizadores.patch | Ensaiam a proposta dos sete formatos sem alterar a guarda aplicada. |
| provar-feixe.py; feixe-recorte.patch | Ensaiam o recorte do espécime numa pasta temporária, com a página e o teto intactos. |
| LEIA-ME.md; LINHAS.md; RESPOSTA-construtor-oe1.md; registos desta pasta | Reúnem as linhas, os resultados e as limitações; incluem os registos anteriores que estavam por commitar. |

O primeiro ledger:check desta passagem encontrou uma dependência ausente nas cópias temporárias de um teste: a worktree usava os módulos do diretório ascendente, mas a cópia isolada não os encontrava. Foi criada uma ligação relativa, ignorada pelo Git, para as dependências já instaladas. Nenhum pacote foi instalado ou alterado. A segunda corrida tem o código em oe1b-ledger-dependencias.codigo.

A primeira corrida completa encontrou quatro erros no inventário: as duas contagens antigas já não se rendiam e as duas novas ainda não estavam medidas. Esses códigos e mensagens estão em oe1b-portoes-inventario-antigo/. A recontagem atualiza apenas essas duas linhas de medição, dentro do perímetro de relatórios e medições; não acrescenta prosa às páginas. O campo k2 conserva quem fixou a classificação e o formato, e a razão identifica a recontagem OE1-b. Não se declara uma nova leitura editorial ou uma comunicação com a direção.

As plantas obrigam a recusar outro valor, outro país, outra célula, outro período, valor ausente, duas células, bandeira ausente ou deslocada, significado alterado, dimensão repetida e diferença numérica além da precisão float64. Os dois formatos reais passam antes e depois das plantas. No formato regional anterior, o pedido contém várias regiões e o excerto tem de nomear uma delas; não se afirma que o pedido identifique uma única região.

A guarda do fecho também foi vista a morder: --conferir-final saiu com código 1 enquanto a nova corrida estava por terminar, apesar de ainda existirem códigos antigos nos ficheiros. O registo é oe1b-planta-corrida-incompleta.log. A cabeça testada é portoes/cabeca, lida depois da obtenção da tranca; corrida-sitio.cabeca regista apenas a cabeça no momento de entrar na fila.

| Planta | Mordeu |
|---|---|
| JSON-stat: bandeira junto de outro valor | sim |
| JSON-stat: bandeira no índice de outra célula | sim |
| JSON-stat: outro país no corpo | sim |
| JSON-stat: outro país no pedido | sim |
| JSON-stat: outro período | sim |
| JSON-stat: valor ausente | sim |
| JSON-stat: duas células | sim |
| JSON-stat: bandeira retirada | sim |
| JSON-stat: significado da bandeira alterado | sim |
| JSON-stat: diferença além da precisão float64 | sim |
| JSON-stat: dimensão repetida | sim |
| Antigo: bandeira retirada | sim |
| Antigo: bandeira junto de outro valor | sim |
| Antigo: outro país no excerto | sim |
| Antigo: outro país no pedido | sim |
| Antigo: bandeira fora do fim | sim |

### OE1-b: a medição da L1

Depois da recontagem do inventário, o build, o ledger e o typecheck passaram, mas o verify recusou a L1: 2714 páginas com destinos repetidos, acima do teto de 2342. Os registos dessa corrida estão em oe1b-portoes-l1-anterior/.

A primeira comparação recusou a medição antiga do E1: já havia diferenças anteriores ao OE1 em páginas como /correcoes. A base foi por isso construída de novo nesta mesma worktree, com os ficheiros afetados repostos temporariamente a partir de eee1677fff963ce0758a23067b9fdf32185f3147, pela tranca, e todos os bytes atuais e o dist repostos no fim. base-l1.json identifica os ficheiros e prova a reposição. Os cabeçalhos Git dessa comparação conservam a cabeça da worktree; o commit dos ficheiros temporários está declarado separadamente. Não são os portões da cabeça final.

medir-l1.mjs corre a régua sem limite de amostra. Encontrou exatamente 372 entradas, as 186 linhas OE1 nas duas línguas, zero saídas e zero alterações nas 2342 entradas anteriores. Comparou ainda os padrões de links com 1610 recibos antigos: nenhum padrão novo. Quatro plantas recusam recibo em falta, agravamento antigo, página extra e padrão desconhecido.

A atualização de scripts/lugar-tetos-b1.json é uma medição de apoio ao ponto 5 do OE1-b. Aponta a l1-oe1b.json e usa a contagem medida de 2714; scripts/check-lugar.mjs permanece igual. A razão segue a regra escrita no início dessa régua: o teto pode acompanhar recibos novos com os mesmos padrões, mas não o agravamento de uma página antiga. Não se alteraram componentes, palavras das páginas, WORKS ou a declaração das rotas.

Os 13 comandos posteriores à L1 foram também corridos separadamente: 11 a 0 e 2 com falha, para conferir os passos que a falha anterior impediu de executar. Os códigos e tempos estão em oe1b-cauda/resultados.json. Esta prova preparatória não substitui a corrida inteira na cabeça final, pela tranca.

A precisão dos tempos também foi conferida: cinco casos isolados em plantas-tempos.json. Um início no mesmo segundo do corredor é aceite quando o fim é posterior; um fim antigo, um fim ausente e uma corrida anterior aos microssegundos do novo início são recusados. Um código de falha conserva-se como falha.

### OE1-b: localizadores dos nomes no índice

O check:indice recusou 150 rótulos publicados porque a sua lista fechada ainda só conhece quatro formatos de name_source. O motor escreve mais sete formatos: caminho da dimensão COFOG, célula XLS, campo XML, código ministerial e três formas de localizar linhas nos PDF. Não se mudou um rótulo nem se fabricou um localizador para caber na lista antiga.

A proposta em indice-localizadores.patch acrescenta apenas essas sete formas a tests/livro/indice.mjs, cada uma com o leitor que a escreve nomeado. O ensaio corre a proposta em memória: índice a 0, 150 rótulos reconhecidos, quatro formatos anteriores conservados e doze plantas recusadas. A guarda aplicada foi conservada durante esse ensaio. As provas estão em proposta-localizadores.json e proposta-indice.log.

A proposta está aplicada; os códigos finais abaixo conferem a cabeça entregue.

### OE1-b: o recorte do espécime de desenho

O design:feixe recusou o cartão 13, que copia o índice inteiro: 908545 bytes, acima do teto de 656,48046875 KiB. A regra escrita em scripts/design-bundle.mjs manda que, na próxima ultrapassagem, o retrato passe a recorte. A proposta feixe-recorte.patch conserva as primeiras oito entradas na ordem da página e declara o recorte no próprio espécime. No ensaio, o cartão mediu 235855 bytes; a página conservou as 428 entradas e o mesmo SHA-256. O teto e a margem não mudam.

O ensaio gerou os cartões numa pasta temporária, sem alterar o gerador aplicado. As três plantas existentes do feixe morderam. Uma quarta retirou o recorte e voltou a exceder o teto do cartão 13. As provas estão em proposta-feixe.json e nos registos ao lado.

O recorte está aplicado apenas ao exportador dos espécimes.


Códigos finais: [motor](portoes/motor.codigo), [build](portoes/build.codigo), [verify](portoes/verify.codigo), [typecheck](portoes/typecheck.codigo), [ledger](portoes/ledger.codigo). As cabeças estão ao lado, na mesma pasta.

Custo desta passagem: [custo-oe1b.json](custo-oe1b.json), medido pelo incremento dos contadores desde a ordem OE1-b, com construção e revisões automáticas discriminadas. O ficheiro conserva o corte temporal e é atualizado após a corrida final.

## OE1-c, registo histórico

As duas extensões autorizadas estão aplicadas. Esta passagem conserva os bytes das 186 linhas e de todo o livro do sítio. O motor mantém a cabeça 9bfbb777f7d2f5af8b185475c8dd8027ebd76bad e não recebeu alterações.

| Ficheiro | Mudança e prova |
|---|---|
| tests/livro/indice.mjs | Recebe exatamente as sete expressões da proposta, com o leitor nomeado; as quatro anteriores permanecem iguais. As doze plantas substituem uma linha por uma cópia em memória, chamam as mesmas células I1 e I3 e exigem a queixa do localizador daquela linha e as duas queixas da busca. A reposição volta a conferir I1 e I3 limpas. |
| package.json | Acrescenta --prova ao comando check:indice para as doze plantas correrem dentro do verify. |
| scripts/design-bundle.mjs | Recorta só o espécime 13 para as primeiras oito entradas, na ordem original, com a nota e a porta para a página completa. A quarta planta retira o limite em memória e exige que o cartão 13 falhe apenas pelo teto. |
| medir-oe1c.py; oe1c-provas.json | Conferem a lista contra o patch autorizado, os valores do teto e da margem contra a cabeça anterior, os registos das plantas e os bytes das 186 linhas. No modo --final leem os códigos e as cabeças e escrevem o resultado da corrida e a resposta pedida. |
| medir.py; medidas.json | Incorporam as cinco medidas OE1-c, cada uma com conhecido positivo, e os resumos dos ficheiros efetivamente ensaiados. --conferir-final conserva a exigência de cinco zeros, tempos atuais e cabeças finais. |
| custo.py; custo-oe1c.json | Medem o incremento dos contadores desde a ordem OE1-c, separado da passagem anterior. |
| LEIA-ME.md; RESPOSTA-construtor-oe1.md; registos desta pasta | Guardam o estado, as provas e as limitações; o primeiro commit incluiu os cinco corrida-sitio.* e custo-oe1b.json que estavam por comitar. |

Os ensaios preparatórios estão a 0 em [oe1c-indice.codigo](oe1c-indice.codigo) e [oe1c-feixe.codigo](oe1c-feixe.codigo). I1, I3, as doze plantas dos localizadores, os quatro formatos anteriores e as quatro plantas do feixe passaram. A lista das queixas efetivas está em [oe1c-provas.json](oe1c-provas.json), com os resumos dos ficheiros de código ensaiados.

O primeiro ensaio da nova planta do feixe saiu a 1: a comparação do teste convertia o domínio legível com acento para punycode, mas o exportador escreve o domínio legível. O teste passou a comparar o endereço literal que o exportador já escreve. A página, as oito entradas e a ordem estavam corretas. O registo da falha conserva-se em oe1c-feixe-primeira.log; nenhuma regra do teto foi mudada.

| Medida do recorte | Resultado do ensaio |
|---|---:|
| Entradas na página integral | 428 |
| Entradas no espécime | 8 |
| Bytes do espécime | 235855 |
| Bytes sem o recorte, na planta | 908678 |
| Teto em bytes, inalterado | 672236 |
| Margem, inalterada | 0.1 |

O SHA-256 da página integral manteve-se 8a3b6f08b71795b3865cd2c3c09e549c0a8f00ac0c2b65256fa437fd23bdad4e. A planta sem recorte retém o título e a nota da configuração atual, por isso os seus bytes diferem do espécime integral anterior ao OE1-c.

A corrida inteira seguinte é feita na cabeça que inclui este relatório, pela tranca. Os códigos efetivos são lidos de [motor.codigo](portoes/motor.codigo), [ledger.codigo](portoes/ledger.codigo), [build.codigo](portoes/build.codigo), [verify.codigo](portoes/verify.codigo) e [typecheck.codigo](portoes/typecheck.codigo), com as cabeças ao lado. O [resultado final OE1-c](OE1-c-resultado.md) e [oe1c-final.json](oe1c-final.json) são escritos depois dessa corrida, sem atribuir à cabeça final os resultados preparatórios. --conferir-final exige os cinco zeros. Outro vermelho faz parar para relato.

As queixas «história do valor» e data-linha-claim fora do livro, dentro do JSON das plantas anteriores, são resultados esperados dessas plantas, não defeitos da cabeça. Não foram alteradas.

As decisões em vigor estão registadas em decisoes-oe1c.log. Os commits desta passagem, anteriores ao commit do relatório, constam da lista de commits acima; a cabeça final está em portoes/cabeca.

O custo desta passagem é o corte de [custo-oe1c.json](custo-oe1c.json), pelos contadores, com cache e revisões automáticas separados. O modo --oe1c de custo.py usa o momento da ordem OE1-c. Modelo: Codex gpt-6-astra. Os registos da execução final são escritos depois do commit, para poderem nomear a cabeça que foi realmente testada.

As lacunas de receita consolidada AC+SS, saldo dos mapas, despesa bruta da Segurança Social e necessidades de financiamento mensais mantêm as razões descritas no início deste relatório. Não se acrescentou um valor para as preencher.






<!-- INICIO OE1-D -->
## OE1-d, registo histórico

A secção OE1-e corrige abaixo as afirmações de conteúdo, alcance e medição desta passagem. Os instrumentos históricos são reproduzíveis pela cabeça que o registo nomeia.

As dez correções autorizadas estão implementadas. As 186 linhas conservam os valores, excertos, rótulos de fonte e coordenadas anteriores. O livro e o manifesto do motor conservam os bytes de `9bfbb777`. O que atravessou de novo foi a apresentação: 186 nomes nas duas línguas, 62 unidades com o período acumulado, 186 pares de ressalvas e a declaração geográfica das 30 edições Eurostat. As três contas que demonstram o não fecho explicam a ressalva; não convertem valores publicados em valores derivados.

A leitura a frio do Opus foi lida integralmente. Pela triagem do mandato, os achados um, dois, nove, onze e doze eram as cinco adulterações plantadas nas cópias do pacote; não foram tratados como defeitos desta árvore. Os achados dezasseis e dezassete descreviam limites do pacote. A medição da L1 foi repetida na cabeça integrada e os restantes achados reais foram tratados nos ficheiros abaixo.

### Mandato desta passagem e medida

| Item | Resultado medido |
|---|---|
| Nomes do projeto | 186 pares, 372 nomes sem algarismos, iguais ao módulo regenerado pelo motor. Visíveis nos 372 recibos e nas 372 entradas dos dois índices. |
| Acumulado na unidade | 62 linhas de execução. O mês final mantém-se em reference_date; a unidade declara janeiro a julho ou janeiro a agosto. A régua R2 confere a unidade da própria linha e a língua, sem uma segunda declaração concorrente. |
| Ressalva publicada | 186 pares junto ao valor nos recibos e assinalados no índice. Os 41 XLS publicam a inferência da escala; as três linhas AC publicam a diferença decimal de 802,9 milhões e a conta. A ressalva foi publicada, mas faltava o aviso financeiro nas rubricas e totais lidos de PDF; havia avisos fora do alcance e o exemplo dos Encargos era falso. A secção OE1-e regista a correção. |
| Localizadores fechados | Os rótulos PDF são uma lista fechada, ligada à página. As células XLS aceitam apenas a coluna do rótulo e a folha/período correspondentes. Nenhum localizador da linha mudou. |
| Geografia JSON-stat | Pedido, edição, coordenada e etiqueta do corpo têm de concordar com a geografia declarada pela linha, mesmo sem bandeira provisória. |
| Nome do estudo | O código OE1 saiu do título interno nas duas línguas. Os 372 recibos mostram o nome da edição, sem ligação a uma página inexistente. |
| Resposta curta | Movida por git mv para esta pasta de medições. Não existe resposta na raiz. O guião antigo foi ajustado para não a recriar. |
| Cabeçalhos PDF | Unidades e títulos de colunas impressos são lidos e conferidos, incluindo ano, perímetro e alinhamento. As ausências de unidade no XLS continuam explícitas e apoiadas nas seis correspondências de escala. |
| L1 | 2714 páginas, teto 2714, 372 recibos OE1. Construção e medição na cabeça `914c53e1a76f541c513b576d0a603b4b7de29261`. Nenhum aumento do teto. |
| Fecho | Cinco códigos zero, --conferir-final a zero e 27 medidas com conhecido positivo. O último commit é reservado às provas desta cabeça de código. |

### Ficheiros e razão de cada mudança

| Ficheiro ou conjunto | Mudança e razão |
|---|---|
| motor: publisher/oe1_nomes.py; publisher/oe1_nomes_test.py; publisher/oe1_nomes.mjs | Modelos por família, vocabulário das rubricas e módulo determinista. O nome diz grandeza, perímetro e geografia, e distingue orçamento de execução. |
| motor: publisher/oe1_apresentacao.py | Acrescenta unidades acumuladas e ressalvas depois da prova das observações. Recalcula a diferença AC em decimal e relê as seis igualdades que sustentam a escala. Corrige só a prosa das contas dos Encargos Gerais do Estado e da Presidência que as chamava ministérios. |
| motor: publisher/oe1_pdf.py; publisher/oe1_pdf_test.py; publisher/oe1_build.py | Confere as unidades e os cabeçalhos impressos antes de escolher as colunas; a reconciliação de julho usa o mesmo leitor. |
| motor: publisher/export_site_rows.py; publisher/oe1_test.py; publisher/README.md | O exportador transporta os campos e o módulo de nomes com os seus resumos. Provas de imutabilidade, cabeçalhos, ressalvas e geografia. Documentação da fronteira. |
| ledger/claims, as 186 linhas OE1; ledger/cruzamentos/oe1.json; ledger/cruzamentos/oe1-nomes.json | Apenas saídas do exportador. Valores, excertos e coordenadas intactos; apresentação e resumos reconferidos. |
| src/data/medidas-oe1.mjs; src/data/nomes-das-medidas.mjs | O módulo gerado entra pela escada já usada pelos nomes RP1. |
| src/data/studies.mjs | Título interno legível, nas duas línguas, sem código de bloco. Nenhuma entrada WORKS ou rota. |
| src/i18n/unidades.mjs; src/i18n/lingua-dos-titulos.mjs | Três unidades acumuladas traduzidas; as três edições geográficas são códigos, não prosa numa língua. Sai a declaração antiga gov_10a_exp, que deixou de ser usada. |
| src/i18n/strings.mjs; design/especime-v3/INVENTARIO-FRASES.md; design/especime-v3/critica/REVISOES-DO-INVENTARIO.md | Os dois rótulos Ressalva e Caveat são navegação declarada. A leitura cruzada do diff está honestamente por ler antes da fusão. A medição OE1-e conferiu as trinta e três retiradas declaradas do R2 e as seis do R2-b; a contagem anterior de quatro estava errada. |
| src/lib/ledger.mjs; src/tipos.d.ts; ledger/README.md | CAMPOS e Linha incluem o par opcional; note continua interna. Recusa língua ausente e número completo sem apoio no excerto ou derivação. Confere as quatro declarações geográficas. Conserva o campo serie vindo do RP3. |
| src/views/LinhaView.astro | Nome do projeto e ressalva junto ao valor, nas duas edições, com as marcas de origem da própria linha. |
| src/views/LivroView.astro; src/components/ItemDoLivro.astro | A entrada do índice mostra o nome e assinala a ressalva num details com summary. |
| scripts/gate-html.mjs; scripts/provar-guardas.mjs; tests/linha/cadeias-proveniencia.mjs | O HTML admite a ressalva da linha e exige o texto da edição no lugar certo. As plantas cobrem ausência, troca, idioma, número, geografia e paridade do esquema. |
| tests/livro/indice.mjs | Fecha os dois formatos restantes e conserva os quatro formatos originais; as plantas comprovam a recusa de localizadores inventados e a escada do nome da casa. |
| scripts/inventario-rotulos.mjs | Confere unidades OE1 nos dois recibos e nos dois índices, aplicando a regra de fonte única do R2. Duas plantas retiram ou trocam o acumulado. |
| scripts/lugar-tetos-b1.json; medir-l1.mjs; l1-oe1d.json | A medição atual sustenta o mesmo teto. A lista integral reconcilia com a contagem; retirar uma entrada é recusado. O campo histórico estudos alimenta a régua, e trocar a sua contagem em memória é recusado. |
| design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md | Localiza os nomes, os campos publicados e as provas novas. |
| medir-oe1d.py; medidas-oe1d.json; custo.py; medir.py | Medições reproduzíveis, contadores desta passagem e correção do destino da resposta. A conferência final antiga conserva a exigência dos cinco zeros e das cabeças. |
| LEIA-ME.md; LINHAS.md; RESPOSTA-construtor-oe1.md; portoes e restantes provas desta pasta | Relatório, tabela com as unidades publicadas, resposta e saídas reais, sem caminhos da máquina. |

### Plantas e medição

O registo histórico das 59 conferências OE1 identifica a cabeça `cf218da`; não constitui por si uma corrida na cabeça final do OE1-d. A passagem OE1-e mede novamente o módulo e nomeia a cabeça real. O leitor PDF contém 18 controlos, dois íntegros e dezasseis estragos, incluindo cabeçalho, unidade, ano, perímetro e alinhamento. Os nomes têm 17 conferências, oito delas plantas. As ressalvas recusam a diferença AC adulterada e a escala sem correspondência; a geografia recusa Portugal com corpo e pedido de Espanha. Duas plantas retiram os avisos financeiros acrescentados na última revisão das notas.

No sítio, as plantas do ledger retiram cada língua da ressalva, introduzem número sem apoio e trocam pedido, edição, etiqueta e geografia. As provas HTML desta passagem eram fragmentos construídos para a guarda. A passagem OE1-e acrescenta as três plantas sobre recibos realmente construídos em dist. O índice planta rótulo PDF e coluna XLS inventados, conservando as plantas anteriores e a recusa de um nome de casa adulterado. A régua dos rótulos retira o acumulado de julho e troca agosto por julho em inglês. Os formatos antigo e novo da bandeira continuam ensaiados.

A prova das edições corre a mesma régua da língua sobre o módulo íntegro e, num processo separado, repõe em memória a declaração órfã gov_10a_exp. Exige código um e a queixa específica da edição sem linha, sem alterar o ficheiro em disco.

Na recolha final, o guião procurou inicialmente a queixa apenas em stdout, mas o portão escreve as recusas em stderr. O registo oe1d-medicao-recolha-incompleta conserva essa falha do guião. A correção lê ambos os fluxos, mantendo código um e a mesma queixa obrigatórios; não muda a régua. O guião corrigido executou novamente as medidas a zero. A correção do instrumento e o registo do seu próprio SHA-256 ficaram comitados antes da corrida final após o R3; o último commit só acrescenta provas. Duas plantas adicionais recusam uma base de main ou master que não esteja integrada. O resumo do guião executado é `be6c14d68ea0ffe3182969777c6ff523e6b0825807537a1a2943dad3c6daad6f`.

O guião [medir-oe1d.py](medir-oe1d.py) conferiu 27 medidas, cada uma com o seu conhecido positivo. [medidas-oe1d.json](medidas-oe1d.json) contém os resultados, queixas das plantas e resumos das 186 linhas. A leitura HTML verifica o nome, a ressalva, a unidade e o estudo nos 372 recibos, mais o nome, a ressalva e a unidade nas 372 entradas dos dois índices. As plantas trabalham em cópias e não adulteram ficheiros de produção.

A guarda --conferir-final foi vista novamente a morder enquanto esta corrida ainda estava na fila: saiu com código um apesar dos códigos verdes antigos, pela queixa de corrida por terminar. A prova está em oe1d-planta-corrida-incompleta.log; não foi contada como falha da cabeça nem como portão final verde.

### Integração e prova da cabeça

O sítio foi rebaseado na própria worktree, no ramo oe1-2026-10-04-b, sobre main `b748a6b4b5f6b3949b4fb9805720dcf2016b3a53`. O motor foi rebaseado sobre master `47f12e15c927bf238522ac680b1f54c9de29f55d`. Na primeira integração, os conflitos do inventário e das guardas foram resolvidos conservando as retiradas do R2, o campo serie e as provas do RP3, além das duas ressalvas. Depois de uma corrida verde, main avançou com o R3 entre a leitura da referência e o commit de provas. Esse resultado anterior está preservado em portoes-oe1d-antes-r3 e não prova a cabeça atual. O ramo foi novamente rebaseado; os conflitos do mapa e do inventário foram resolvidos à mão, conservando as secções dos dois blocos. As referências novas do R3 afetadas pela integração e a contagem dos campos foram atualizadas. O conferidor do mapa encontra todas as citações no ficheiro citado e nenhuma referência para lá do fim; regista ainda cinquenta e duas citações longe do número de linha indicado, listadas em oe1d-mapa-integrado.log. Não é uma prova de que todas as linhas do mapa estejam atualizadas. A nova medição lê a base efetivamente integrada e planta uma base falsa, recusada para cada árvore. As referências principais foram relidas antes da nova corrida integral.

A corrida preparatória em cc4711df deu build=1, verify=1, ledger=0 e typecheck=0: os dois vermelhos eram a entrada em falta do bloco OE1-d no registo do inventário. A entrada por ler, prevista pela regra, resolveu a falta sem mudar o portão. As saídas preparatórias permanecem em portoes-oe1d-preparatorios. As queixas de estragos dentro dos JSON das plantas são resultados esperados, não erros da cabeça.

O segundo ensaio, em e99b0473, deu build=1 pela declaração antiga da edição Eurostat e verify=1 pelo campo em falta no registo da L1; ledger e typecheck deram zero. A declaração foi retirada durante esse ensaio, que por isso nunca foi apresentado como prova da cabeça. O registo da L1 foi recomposto pela lista de páginas já medida e o guião passou a escrever o campo que a régua exige. Ambos ganharam plantas específicas e foram comitados antes da corrida final. As saídas estão em portoes-oe1d-lingua-l1. O teto e os portões não foram alterados para aceitar esses erros.

| Portão | Código lido | Cabeça da corrida |
|---|---|---|
| motor | [0](portoes-oe1d-final/motor.codigo) | `1f7520e4dcafb394bcb2ee2b61c7579759d2d3a3` |
| ledger | [0](portoes-oe1d-final/ledger.codigo) | `914c53e1a76f541c513b576d0a603b4b7de29261` |
| build | [0](portoes-oe1d-final/build.codigo) | `914c53e1a76f541c513b576d0a603b4b7de29261` |
| verify | [0](portoes-oe1d-final/verify.codigo) | `914c53e1a76f541c513b576d0a603b4b7de29261` |
| typecheck | [0](portoes-oe1d-final/typecheck.codigo) | `914c53e1a76f541c513b576d0a603b4b7de29261` |

O registo [oe1d-conferir-final.log](oe1d-conferir-final.log) contém o --conferir-final a zero na cabeça de código `914c53e1a76f541c513b576d0a603b4b7de29261`. Depois da corrida, o último commit do sítio acrescenta apenas provas, relatório e resposta; nenhum ficheiro de código ou guião de medição muda nesse commit. A sua diferença para esta cabeça é conferida por caminhos; não altera o código construído, linhas ou dados publicados. A cabeça entregue identifica-se pelo commit que contém esta secção; os ficheiros portoes/cabeca e portoes/cabeca.fim identificam explicitamente o seu pai de código ensaiado. O motor termina em `1f7520e4dcafb394bcb2ee2b61c7579759d2d3a3`.

### Decisões em vigor nos ficheiros tocados

Motor: §1.6, §1.24, §1.31, §1.32, §1.47, §1.154. Sítio: §1.1, §1.3, §1.4, §1.5, §1.6, §1.17, §1.19, §1.24, §1.28, §1.31, §1.32, §1.34, §1.35, §1.36, §1.39, §1.40, §1.41, §1.42, §1.44, §1.47, §1.48, §1.49, §1.52, §1.64, §1.66, §1.68, §1.82, §1.85, §1.90, §1.91, §1.98, §1.99, §1.101, §1.102, §1.108, §1.109, §1.110, §1.115, §1.117, §1.120, §1.124, §1.126, §1.127, §1.129, §1.130, §1.133, §1.135, §1.138, §1.140, §1.143, §1.145, §1.149, §1.150, §1.152, §1.154. Os localizadores por ficheiro e o conhecido positivo da leitura estão em [decisoes-oe1d-motor.log](decisoes-oe1d-motor.log) e [decisoes-oe1d-sitio.log](decisoes-oe1d-sitio.log), respetivamente 10 e 217 ficheiros. Nenhum ficheiro protegido do motor foi alterado pelos commits do bloco.

### Três exemplos de nome por família

Os textos seguintes são lidos do módulo gerado, sem reescrita no relatório.

| Família | Id | Português | Inglês |
|---|---|---|---|
| Ministérios e encargos | oe-2026-despesa-ministerio-saude | Despesa orçamentada do Ministério da Saúde (administração central, despesa bruta) | Budgeted expenditure of the Ministry of Health (central administration, gross) |
| Ministérios e encargos | oe-2026-despesa-ministerio-encargos-gerais-do-estado | Despesa orçamentada dos Encargos Gerais do Estado (administração central, despesa bruta) | Budgeted expenditure of General State Charges (central administration, gross) |
| Ministérios e encargos | oe-2026-despesa-ministerio-economia-e-coesao-territorial | Despesa orçamentada do Ministério da Economia e Coesão Territorial (administração central, despesa bruta) | Budgeted expenditure of the Ministry of Economy and Territorial Cohesion (central administration, gross) |
| Programas | oe-2026-despesa-programa-012 | Despesa orçamentada do programa Segurança Interna (administração central, despesa bruta) | Budgeted expenditure of the Internal Security programme (central administration, gross) |
| Programas | execucao-2026-08-despesa-programa-012 | Despesa executada do programa Segurança Interna (administração central, despesa efetiva consolidada dentro do programa) | Executed expenditure of the Internal Security programme (central administration, effective expenditure consolidated within the programme) |
| Programas | oe-2026-despesa-programa-015 | Despesa orçamentada do programa Saúde (administração central, despesa bruta) | Budgeted expenditure of the Health programme (central administration, gross) |
| Funções orçamentais | oe-2026-despesa-funcao-01 | Despesa orçamentada em serviços gerais das administrações públicas (administração central, despesa efetiva consolidada) | Budgeted expenditure on general public services (central administration, consolidated effective expenditure) |
| Funções orçamentais | execucao-2026-07-despesa-funcao-01 | Despesa executada em serviços gerais das administrações públicas (administração central, despesa efetiva consolidada) | Executed expenditure on general public services (central administration, consolidated effective expenditure) |
| Funções orçamentais | oe-2026-despesa-funcao-07 | Despesa orçamentada em saúde (administração central, despesa efetiva consolidada) | Budgeted expenditure on health (central administration, consolidated effective expenditure) |
| Funções Eurostat | despesa-por-funcao-2024-gf01-pt | Despesa pública em serviços gerais das administrações públicas, em percentagem do PIB, Portugal | Public expenditure on general public services, as a percentage of GDP, Portugal |
| Funções Eurostat | despesa-por-funcao-2024-gf01-es | Despesa pública em serviços gerais das administrações públicas, em percentagem do PIB, Espanha | Public expenditure on general public services, as a percentage of GDP, Spain |
| Funções Eurostat | despesa-por-funcao-2024-gf01-ue | Despesa pública em serviços gerais das administrações públicas, em percentagem do PIB, União Europeia | Public expenditure on general public services, as a percentage of GDP, European Union |
| Totais, indicadores e diferenças | oe-2026-despesa-total | Despesa total consolidada da administração central e da segurança social, orçamentada | Budgeted consolidated total expenditure of central administration and social security |
| Totais, indicadores e diferenças | execucao-2026-08-receita-efetiva-administracao-central-seguranca-social | Receita efetiva da administração central e da segurança social, executada | Executed effective revenue of central administration and social security |
| Totais, indicadores e diferenças | oe-2026-saldo-global-administracao-central | Saldo global da administração central, orçamentado | Budgeted overall balance of central administration |
| Derivadas | oe-2026-cem-euros-ministerio-saude | Parte da despesa bruta orçamentada da administração central que vai para o Ministério da Saúde | Share of budgeted gross expenditure of central administration going to the Ministry of Health |
| Derivadas | oe-2026-cem-euros-funcao-01 | Parte da despesa efetiva consolidada orçamentada da administração central que vai para serviços gerais das administrações públicas | Share of budgeted consolidated effective expenditure of central administration going to general public services |
| Derivadas | execucao-2026-07-cem-euros-funcao-01 | Parte da despesa efetiva consolidada executada da administração central que vai para serviços gerais das administrações públicas | Share of executed consolidated effective expenditure of central administration going to general public services |

### Custo e o que fica por fazer

43 685 333 símbolos contabilizados, dos quais 41 813 504 de entrada em cache, 1 648 621 de entrada sem cache e 223 208 de saída; 8 089 segundos desde a ordem OE1-d até ao corte de 2026-10-04T12:13:41.916243+00:00. Modelo de construção: Codex gpt-6-astra. O [contador](custo-oe1d.json) inclui cache e revisões automáticas; não é um preço monetário. O corte é explícito e não inclui utilização posterior ao último evento disponível.

O teste de aceitação integral do OE1 continua parcial pelas lacunas de fonte: receita consolidada AC+SS e saldo correspondente não impressos nos mapas lidos; dois totais brutos divergentes da Segurança Social; necessidades de financiamento mensais sem linha publicável na fonte lida. Não se escolheu um total nem se transformou saldo em dívida. A diferença AC e a escala inferida são agora avisos publicados, não lacunas escondidas numa nota. A leitura cruzada das duas linhas novas do inventário fica por fazer antes da fusão. A página do governo pertence a outro bloco. Nenhum push.
<!-- FIM OE1-D -->

<!-- INICIO OE1-E -->
## OE1-e

As ressalvas do OE1-d tinham um erro de conteúdo e erros de alcance. A segunda leitura foi lida inteira antes da alteração; os achados três a sete eram estragos das cópias do pacote, conforme a triagem recebida. Esta passagem corrige os restantes achados sem mudar nenhum valor, excerto, coordenada, nome do projeto ou unidade acumulada. O livro e o manifesto do motor continuam byte a byte iguais aos de `9bfbb777`.

### Mandato desta passagem e medida

| Item | Resultado e prova |
|---|---|
| Um. Encargos Gerais do Estado | A ressalva deixa de afirmar o conteúdo da rubrica. Compara o valor com o programa de Órgãos de Soberania; o motor refaz a igualdade e recusa a troca do valor ou do nome do programa. |
| Dois. Operações financeiras | Aviso em cinquenta e nove linhas: dezasseis rubricas, sete totais dos mapas, vinte programas e dezasseis quotas orgânicas. A seleção usa a família; retirar o aviso da Saúde lida do PDF é recusado. |
| Três. Perímetro em palavras | Despesa bruta, despesa efetiva consolidada e classificação Eurostat explicadas nas famílias respetivas, nas duas línguas. |
| Quatro. Avisos aplicáveis | Cento e oitenta e dois pares e quatro ausências completas; quarenta e uma inferências de unidade só nas transcrições XLS; dez avisos do agregado só na União; setenta comparações só nas funções. Plantas põem cada aviso fora do seu alcance e são recusadas. |
| Cinco. Período no índice | As entradas mostram reference_date na forma da casa, com a marca da própria linha. A I2p confere todos os índices do livro; quatro plantas retiram ou trocam o ano em português e inglês. |
| Seis. PDF | Dezasseis plantas exigem a queixa completa que nomeia a unidade, coluna, ano, perímetro ou alinhamento esperado. Dois controlos íntegros e as cinquenta e nove linhas PDF preservadas. |
| Sete. HTML real | Três plantas do verify alteram recibos construídos: ressalva retirada, de outra linha e noutra língua. Exigem código um, queixa específica e reposição dos bytes. |
| Oito. Contagens independentes | Sessenta e duas execuções e cento e oitenta e seis entradas por edição são números fechados. Duas plantas retiram uma entrada do índice e exigem a queixa de cento e oitenta e cinco em vez de cento e oitenta e seis. |
| Nove. Conta de uma ressalva | As três contas do não fecho e a igualdade dos Encargos têm rótulo próprio nas duas edições. Uma transcrição com derivation sem ressalva é recusada. As trinta e seis contas de valores mantêm o rótulo Aritmética. |
| Dez. Relatório e inventário | Secção C1f inteira igual à anterior ao OE1-d. Trinta e três retiradas R2 e seis R2-b conferidas por declaração. Setenta e uma conferências OE1 registadas na cabeça final do motor. |

### Ficheiros e razão

| Ficheiro ou conjunto | Mudança |
|---|---|
| motor: publisher/oe1_apresentacao.py; publisher/oe1_test.py | Ressalvas por família, igualdade EGE refeita, saldos conferidos e plantas de presença, alcance e falsidade. |
| motor: publisher/oe1_pdf.py; publisher/oe1_pdf_test.py | O diagnóstico nomeia o cabeçalho esperado e cada planta exige a frase completa. |
| ledger/claims, as cento e oitenta e seis linhas; ledger/cruzamentos/oe1.json | Recebidos pelo exportador comum na cabeça `38457b2723c47ea126984be6c5c1f778967e6847`; só ressalva, ressalva_en e as contas de apoio podem diferir da travessia OE1-d. |
| src/lib/ledger.mjs; ledger/README.md; tests/linha/cadeias-proveniencia.mjs | Distinção e guarda da conta da ressalva. Mantêm as regras já existentes para contagens da casa e sobre ficheiros alojados. |
| src/views/LinhaView.astro; src/i18n/strings.mjs; INVENTARIO-FRASES.md; REVISOES-DO-INVENTARIO.md | Dois rótulos novos para a conta da ressalva, declarados no inventário; leitura cruzada por ler. Cabeçalho C1f reposto. |
| src/components/ItemDoLivro.astro; src/views/LivroView.astro; tests/livro/indice.mjs | Período visível nas listas e plantas de retirada e troca. |
| scripts/inventario-rotulos.mjs | Exige a contagem fechada das entradas e dos recibos, com as duas línguas. |
| tests/pais/portoes.mjs; package.json | Três estragos em recibos reais, repostos, no comando check:ressalvas. *Nota do lugar de direção (04.10.2026, 14:05 UTC): o comando saiu da cadeia do `verify` depois de a corrida «portão» do ramo (37206416072) fechar na célula D do `verify:depois-do-build`, que recusa qualquer escrita no `dist/` ou em ficheiros seguidos durante as conferências; as plantas sobre o `dist/` da casa correm fora do `verify`, como prova do bloco (`npm run check:ressalvas`), e assim ficam estas; a cadeia do `verify` não perde nenhuma conferência que corra sem escrever.* |
| medir-oe1d.py; medir-oe1e.py; medir-l1.mjs; custo.py | Corrigem a contagem autorreferente, medem esta passagem com plantas e registam L1 e contadores próprios. |
| MAPA-DO-REPOSITORIO-para-construtores.md | Localiza as novas conferências; conflito do rebase resolvido conservando as dezassete plantas do R3 e as referências atualizadas. |

### Ressalvas por família

| Família | Linhas | Com ressalva | Sem ressalva | Razão |
|---|---:|---:|---:|---|
| Rubricas do Mapa quatro | 16 | 16 | 0 | Despesa bruta e operações financeiras; igualdade dos Encargos Gerais do Estado na sua linha. |
| Programas orçamentados e executados | 40 | 40 | 0 | Despesa bruta no orçamento; despesa efetiva consolidada dentro de cada programa na execução. |
| Funções orçamentadas e executadas | 20 | 20 | 0 | Escala inferida só nas transcrições, perímetro efetivo consolidado, consolidação, arredondamento e limite de comparação. |
| Funções Eurostat | 30 | 30 | 0 | Classificação e perímetro em contabilidade nacional; agregado apenas nas linhas da União. |
| Totais, indicadores e diferenças | 44 | 40 | 4 | Avisos próprios dos totais dos mapas, da escala dos indicadores, do não fecho, dos saldos e dos passivos. Quatro linhas sem aviso aplicável. |
| Quotas calculadas | 36 | 36 | 0 | Arredondamento e denominador bruto ou efetivo consolidado. Sem aviso de unidade inferida; comparação só nas funções. |
| Total | 186 | 182 | 4 | Par presente nas duas línguas ou inteiramente ausente. |

Linhas sem ressalva: `execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social`, `execucao-2026-08-diferencas-consolidacao-programas`, `execucao-2026-08-fluxos-entre-programas`, `oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social`. Os campos não são escritos nessas linhas. A proveniência continua disponível pelo recibo.

Ressalva integral dos Encargos Gerais do Estado, copiada da travessia:

Português: Não é um ministério. Nesta edição do orçamento, a rubrica dos Encargos Gerais do Estado tem o mesmo valor do programa 001, Órgãos de Soberania. A despesa bruta inclui operações financeiras e transferências entre serviços do Estado, tal como o mapa as soma.

Inglês: This is not a ministry. In this budget edition, General State Charges has the same value as programme 001, Sovereign Bodies. Gross expenditure includes financial transactions and transfers between State services, as added up in the budget map.

O identificador do programa é apoiado pela conta declarada `7733610763 - 7733610763 = 0 euros`, refeita antes da exportação. Esta quarta conta numa transcrição serve a ressalva, como as três contas da diferença de 802,9 milhões; não transforma o valor publicado em cálculo da casa. Na quota derivada, a mesma igualdade é acrescentada à conta já existente. Não se alargou a guarda que recusa algarismos sem apoio.

### Plantas e prova da cabeça

O módulo OE1 executou **setenta e uma conferências**, código zero em [oe1e-test.codigo](oe1e-test.codigo), na cabeça `38457b2723c47ea126984be6c5c1f778967e6847`, registada em [oe1e-test.cabeca](oe1e-test.cabeca). O core.gate voltou a zero nessa cabeça. As dezoito conferências PDF estão incluídas, duas íntegras e dezasseis plantas com igualdade da queixa inteira. Os nomes continuam a passar as suas dezassete conferências, sem mudar o módulo gerado.

[medidas-oe1e.json](medidas-oe1e.json) regista **32 medidas, cada uma com conhecido positivo**. O instrumento foi comitado antes da construção; SHA-256 `934406bb21192e358753ad28f32e75708e85dfe0b76eefb5bf937d1ca844c45f`. Confere as cento e oitenta e seis linhas, os trezentos e setenta e dois recibos e as trezentas e setenta e duas entradas dos índices. As oitenta contas impressas são oito contas de ressalva e setenta e duas contas de valores, somando as duas línguas. As três plantas de HTML real ficam em plantas-portoes-oe1e.json, com códigos, queixas e resumos antes e depois da reposição.

A correção do relato R2 mede as declarações efetivas: trinta e três frases retiradas no R2 e seis no R2-b. O antigo --confere do R2 exige também uma secção que o R2-b alterou legitimamente. O instrumento lê apenas as declarações de retirada, confere cada frase no inventário atual e planta uma frase voltada a viva. A secção C1f é comparada inteira com `b37cb066`; a planta troca só o cabeçalho.

A L1 foi medida na construção de `f5549dc8be22f4e936d62fbdfe4eac94b538db97`: **2714 páginas**, teto **2714**, trezentos e setenta e dois recibos OE1. O teto e a margem não mudaram. A prova está em l1-oe1e.json; o instrumento conserva as plantas de lista incompleta e de contagem adulterada do registo que a régua lê.

O sítio foi rebaseado, na sua worktree, sobre main `f27aa38a0939d11908863afe6ee117da03404f5f`. O master do motor mantém-se em `47f12e15c927bf238522ac680b1f54c9de29f55d`, já integrado. A corrida final usa o código do sítio `f5549dc8be22f4e936d62fbdfe4eac94b538db97`. O último commit seguinte contém apenas provas, relatório e resposta; identifica-se pelo commit que contém esta secção. O pai é a cabeça de código escrita em portoes/cabeca e portoes/cabeca.fim. Nenhum ficheiro de código ou linha muda nesse último commit. Os portões do OE1-d foram preservados em portoes-oe1d-final.

| Portão | Código lido | Cabeça da corrida |
|---|---|---|
| motor | [0](portoes/motor.codigo) | `38457b2723c47ea126984be6c5c1f778967e6847` |
| ledger | [0](portoes/ledger.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |
| build | [0](portoes/build.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |
| verify | [0](portoes/verify.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |
| typecheck | [0](portoes/typecheck.codigo) | `f5549dc8be22f4e936d62fbdfe4eac94b538db97` |

Os códigos foram lidos dos ficheiros depois da corrida completa pela tranca. [oe1e-conferir-final.codigo](oe1e-conferir-final.codigo) contém zero para a mesma cabeça de código. O commit final do motor é a cabeça testada. Nenhum push.

### Decisões em vigor

Motor, quatro ficheiros: nenhuma decisão citada nesses quatro ficheiros, segundo o guião. Sítio, duzentos e cinco ficheiros: §1.1, §1.3, §1.4, §1.5, §1.17, §1.24, §1.28, §1.31, §1.32, §1.35, §1.36, §1.39, §1.40, §1.44, §1.47, §1.48, §1.49, §1.52, §1.66, §1.85, §1.90, §1.98, §1.101, §1.102, §1.108, §1.110, §1.115, §1.117, §1.120, §1.124, §1.127, §1.129, §1.130, §1.133, §1.135, §1.140, §1.143, §1.145, §1.149, §1.150, §1.152, §1.154. As listas por ficheiro e o conhecido positivo da leitura estão em decisoes-oe1e-motor.log e decisoes-oe1e-sitio.log, ambos com código zero. Os caminhos protegidos do motor conservam-se intactos.

### Custo e trabalho pendente

18 090 442 símbolos contabilizados, dos quais 17 216 512 de entrada em cache, 782 071 de entrada sem cache e 91 859 de saída; 3 048 segundos até 2026-10-04T13:37:08.012492+00:00. Modelo: Codex gpt-6-astra. O contador inclui cache e revisões automáticas; não é preço monetário. O corte não inclui utilização posterior ao último evento disponível. O detalhe está em custo-oe1e.json.

Continuam por selar a receita consolidada AC+SS e o saldo dos mapas, por não estarem impressos nos mapas lidos; a despesa bruta da Segurança Social, pelos dois totais divergentes; e as necessidades de financiamento mensais, por faltar uma linha publicável na fonte lida. Não se inventou nenhuma delas. A página do governo é outro bloco. A leitura cruzada dos quatro rótulos de navegação introduzidos no OE1-d e no OE1-e continua por ler antes da fusão. As referências históricas do mapa longe da linha indicada permanecem documentadas no OE1-d; esta passagem não afirma tê-las corrigido todas.
<!-- FIM OE1-E -->





## Custo da passagem inicial, registo histórico

Modelo: Codex gpt-6-astra, confirmado pelo registo da sessão. O custo em símbolos é o acumulado dos eventos token_count até à medição, separado entre construção e revisão automática. Inclui entradas lidas da cache; não é o preço monetário. Mensagens posteriores à medição ficam fora desse corte.

```json
{
  "origem": "Eventos token_count das sessões deste bloco, filtrados pela worktree em memória.",
  "medido_em": "2026-10-04T05:26:03.809683+00:00",
  "segundos": 5751,
  "sessoes": [
    {
      "sessao": "01a10508-9b42-72e2-a474-124da3a642e1",
      "modelo": "gpt-6-astra",
      "inicio": "2026-10-04T03:50:12.668Z",
      "ultima_medicao": "2026-10-04T05:25:05.205Z",
      "tokens": {
        "input_tokens": 18344701,
        "cached_input_tokens": 17428736,
        "cache_write_input_tokens": 0,
        "output_tokens": 106989,
        "reasoning_output_tokens": 40568,
        "total_tokens": 18451690
      }
    },
    {
      "sessao": "01a10508-9ba7-7fd3-a0c0-98b5b23cb7e6",
      "modelo": "codex-auto-review",
      "inicio": "2026-10-04T03:54:27.768Z",
      "ultima_medicao": "2026-10-04T04:02:37.534Z",
      "tokens": {
        "input_tokens": 631399,
        "cached_input_tokens": 512768,
        "cache_write_input_tokens": 0,
        "output_tokens": 1735,
        "reasoning_output_tokens": 568,
        "total_tokens": 633134
      }
    },
    {
      "sessao": "01a10519-b978-74e3-95b1-33b78f209ff4",
      "modelo": "codex-auto-review",
      "inicio": "2026-10-04T04:08:54.411Z",
      "ultima_medicao": "2026-10-04T04:57:16.268Z",
      "tokens": {
        "input_tokens": 434558,
        "cached_input_tokens": 293376,
        "cache_write_input_tokens": 0,
        "output_tokens": 1091,
        "reasoning_output_tokens": 392,
        "total_tokens": 435649
      }
    },
    {
      "sessao": "01a1054d-e993-7053-9e91-8018659acb14",
      "modelo": "codex-auto-review",
      "inicio": "2026-10-04T05:05:54.618Z",
      "ultima_medicao": "2026-10-04T05:24:14.039Z",
      "tokens": {
        "input_tokens": 137480,
        "cached_input_tokens": 68608,
        "cache_write_input_tokens": 0,
        "output_tokens": 633,
        "reasoning_output_tokens": 359,
        "total_tokens": 138113
      }
    }
  ],
  "tokens_totais": 19658586,
  "tokens_entrada_cache": 18303488,
  "tokens_entrada_sem_cache": 1244650,
  "tokens_saida": 110448,
  "limite": "Corte no último contador disponível; mensagens e trabalho posteriores não estão incluídos.",
  "conhecido_positivo": true
}
```

## Tabela integral das linhas

| Id | Fonte | Valor literal da fonte, ou cálculo assinalado | Unidade publicada na linha | Período | Localizador |
|---|---|---|---|---|---|
| oe-2026-despesa-programa-001 | Entidade Orçamental | 7733610763 | euros | 2026 | [Mapa1/Registos/Registo[1]/TotalEmEuros; Programa=P-001](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-002 | Entidade Orçamental | 1017609023 | euros | 2026 | [Mapa1/Registos/Registo[2]/TotalEmEuros; Programa=P-002](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-003 | Entidade Orçamental | 600621919 | euros | 2026 | [Mapa1/Registos/Registo[3]/TotalEmEuros; Programa=P-003](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-004 | Entidade Orçamental | 36874099579 | euros | 2026 | [Mapa1/Registos/Registo[4]/TotalEmEuros; Programa=P-004](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-005 | Entidade Orçamental | 175017466000 | euros | 2026 | [Mapa1/Registos/Registo[5]/TotalEmEuros; Programa=P-005](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-006 | Entidade Orçamental | 4788735429 | euros | 2026 | [Mapa1/Registos/Registo[6]/TotalEmEuros; Programa=P-006](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-007 | Entidade Orçamental | 1127993543 | euros | 2026 | [Mapa1/Registos/Registo[7]/TotalEmEuros; Programa=P-007](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-008 | Entidade Orçamental | 164357497 | euros | 2026 | [Mapa1/Registos/Registo[8]/TotalEmEuros; Programa=P-008](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-009 | Entidade Orçamental | 3836890866 | euros | 2026 | [Mapa1/Registos/Registo[9]/TotalEmEuros; Programa=P-009](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-010 | Entidade Orçamental | 10119512834 | euros | 2026 | [Mapa1/Registos/Registo[10]/TotalEmEuros; Programa=P-010](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-011 | Entidade Orçamental | 2460413497 | euros | 2026 | [Mapa1/Registos/Registo[11]/TotalEmEuros; Programa=P-011](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-012 | Entidade Orçamental | 3310310353 | euros | 2026 | [Mapa1/Registos/Registo[12]/TotalEmEuros; Programa=P-012](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-013 | Entidade Orçamental | 8170453174 | euros | 2026 | [Mapa1/Registos/Registo[13]/TotalEmEuros; Programa=P-013](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-014 | Entidade Orçamental | 6478853190 | euros | 2026 | [Mapa1/Registos/Registo[14]/TotalEmEuros; Programa=P-014](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-015 | Entidade Orçamental | 46823532502 | euros | 2026 | [Mapa1/Registos/Registo[15]/TotalEmEuros; Programa=P-015](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-016 | Entidade Orçamental | 37673710106 | euros | 2026 | [Mapa1/Registos/Registo[16]/TotalEmEuros; Programa=P-016](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-017 | Entidade Orçamental | 3117623807 | euros | 2026 | [Mapa1/Registos/Registo[17]/TotalEmEuros; Programa=P-017](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-018 | Entidade Orçamental | 876923548 | euros | 2026 | [Mapa1/Registos/Registo[18]/TotalEmEuros; Programa=P-018](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-019 | Entidade Orçamental | 186328537 | euros | 2026 | [Mapa1/Registos/Registo[19]/TotalEmEuros; Programa=P-019](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-programa-020 | Entidade Orçamental | 2093343793 | euros | 2026 | [Mapa1/Registos/Registo[20]/TotalEmEuros; Programa=P-020](https://www.eo.gov.pt/politicaorcamental/OrcamentodoEstado_ficheirosdeDados/Mapa1-2026.xml) |
| oe-2026-despesa-ministerio-encargos-gerais-do-estado | Entidade Orçamental | 7 733 610 763 | euros | 2026 | [p. 1, POR MINISTÉRIOS, código 01](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros | Entidade Orçamental | 1 017 609 023 | euros | 2026 | [p. 1, POR MINISTÉRIOS, código 02](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-negocios-estrangeiros | Entidade Orçamental | 600 621 919 | euros | 2026 | [p. 2, POR MINISTÉRIOS, código 03](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-financas | Entidade Orçamental | 211 891 565 579 | euros | 2026 | [p. 2, POR MINISTÉRIOS, código 04](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-economia-e-coesao-territorial | Entidade Orçamental | 5 916 728 972 | euros | 2026 | [p. 3, POR MINISTÉRIOS, código 05](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-reforma-do-estado | Entidade Orçamental | 164 357 497 | euros | 2026 | [p. 3, POR MINISTÉRIOS, código 06](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-defesa-nacional | Entidade Orçamental | 3 836 890 866 | euros | 2026 | [p. 3, POR MINISTÉRIOS, código 07](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-infraestruturas-e-habitacao | Entidade Orçamental | 10 119 512 834 | euros | 2026 | [p. 4, POR MINISTÉRIOS, código 08](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-justica | Entidade Orçamental | 2 460 413 497 | euros | 2026 | [p. 4, POR MINISTÉRIOS, código 09](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-administracao-interna | Entidade Orçamental | 3 310 310 353 | euros | 2026 | [p. 4, POR MINISTÉRIOS, código 10](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao | Entidade Orçamental | 14 649 306 364 | euros | 2026 | [p. 5, POR MINISTÉRIOS, código 11](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-saude | Entidade Orçamental | 46 823 532 502 | euros | 2026 | [p. 5, POR MINISTÉRIOS, código 12](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social | Entidade Orçamental | 37 673 710 106 | euros | 2026 | [p. 5, POR MINISTÉRIOS, código 13](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-ambiente-e-energia | Entidade Orçamental | 3 117 623 807 | euros | 2026 | [p. 6, POR MINISTÉRIOS, código 14](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-cultura-juventude-e-desporto | Entidade Orçamental | 1 063 252 085 | euros | 2026 | [p. 6, POR MINISTÉRIOS, código 15](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-ministerio-agricultura-e-mar | Entidade Orçamental | 2 093 343 793 | euros | 2026 | [p. 6, POR MINISTÉRIOS, código 16](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-bruta-administracao-central | Entidade Orçamental | 352 472 389 960 | euros | 2026 | [p. 6, DESPESA TOTAL, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-despesa-consolidada-administracao-central | Entidade Orçamental | 245 121 564 003 | euros | 2026 | [p. 6, DESPESA TOTAL CONSOLIDADA, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc05_Mapa04.pdf) |
| oe-2026-receita-bruta-administracao-central | Entidade Orçamental | 354 784 746 550 | euros | 2026 | [p. 6, RECEITA TOTAL, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc06_Mapa05.pdf) |
| oe-2026-receita-consolidada-administracao-central | Entidade Orçamental | 298 378 541 802 | euros | 2026 | [p. 6, RECEITA TOTAL CONSOLIDADA, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc06_Mapa05.pdf) |
| oe-2026-despesa-total | Entidade Orçamental | 237 671 399 053 | euros | 2026 | [p. 2, Total da Administração Central e Segurança Social consolidado, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc02_Mapa01.pdf) |
| oe-2026-despesa-consolidada-seguranca-social | Entidade Orçamental | 89 625 306 487,00 | euros | 2026 | [p. 2, Despesa total consolidada no âmbito do setor da Segurança Social, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc09_Mapa08.pdf) |
| oe-2026-receita-consolidada-seguranca-social | Entidade Orçamental | 96 083 302 726,00 | euros | 2026 | [p. 2, Receita total consolidada no âmbito do setor da Segurança Social, última coluna](https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc10_Mapa09.pdf) |
| oe-2026-receita-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 129 181,8 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Receita efetiva, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-receita-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 79 618,7 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 49 do ficheiro, página impressa 45, Receita efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-despesa-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 130 971,6 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Despesa efetiva, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 80 464,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 49 do ficheiro, página impressa 45, Despesa efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-saldo-global-administracao-central-seguranca-social | Entidade Orçamental | -1 789,8 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Saldo global, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-saldo-global-administracao-central-seguranca-social | Entidade Orçamental | -845,8 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 49 do ficheiro, página impressa 45, Saldo global, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | -10 551,7 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Ativos financeiros líquidos de reembolsos, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | 1 491,8 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 49 do ficheiro, página impressa 45, Ativos financeiros líquidos de reembolsos, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | -1 420,4 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Passivos financeiros líquidos de amortizações, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-passivos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | 625,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 49 do ficheiro, página impressa 45, Passivos financeiros líquidos de amortizações, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-receita-efetiva-administracao-central | Entidade Orçamental | 58 070,1 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 50 do ficheiro, página impressa 46, Receita efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-efetiva-administracao-central | Entidade Orçamental | 64 038,6 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 50 do ficheiro, página impressa 46, Despesa efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-saldo-global-administracao-central | Entidade Orçamental | -5 968,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 50 do ficheiro, página impressa 46, Saldo global, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-001 | Entidade Orçamental | 5 044,9 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 001, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-002 | Entidade Orçamental | 347,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 002, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-003 | Entidade Orçamental | 265,3 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 003, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-004 | Entidade Orçamental | 5 337,6 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 004, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-005 | Entidade Orçamental | 5 212,7 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 005, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-006 | Entidade Orçamental | 1 134,6 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 006, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-007 | Entidade Orçamental | 799,9 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 007, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-008 | Entidade Orçamental | 92,2 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 008, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-009 | Entidade Orçamental | 1 633,8 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 009, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-010 | Entidade Orçamental | 3 434,9 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 010, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-011 | Entidade Orçamental | 1 233,6 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 011, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-012 | Entidade Orçamental | 1 844,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 012, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-013 | Entidade Orçamental | 4 902,5 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 013, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-014 | Entidade Orçamental | 2 621,1 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 014, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-015 | Entidade Orçamental | 11 822,6 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 015, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-016 | Entidade Orçamental | 17 636,8 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 016, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-017 | Entidade Orçamental | 1 004,0 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 017, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-018 | Entidade Orçamental | 288,7 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 018, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-019 | Entidade Orçamental | 92,3 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 019, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-020 | Entidade Orçamental | 836,4 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 020, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-subtotal-programas | Entidade Orçamental | 65 585,6 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, Subtotal despesa efetiva consolidada dos Programas Orçamentais (1), Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-fluxos-entre-programas | Entidade Orçamental | 1 610,3 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, Fluxos para outros Programas Orçamentais (2), Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-diferencas-consolidacao-programas | Entidade Orçamental | 63,3 | milhões de euros, acumulados de janeiro a agosto | 2026-08 | [p. 72 do ficheiro, página impressa 68, Diferenças de consolidação (3), Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-despesa-funcao-01 | Entidade Orçamental | 34593.1 | milhões de euros | 2026 | [FUNCIONAL!D2; Código=01; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-02 | Entidade Orçamental | 3384.9 | milhões de euros | 2026 | [FUNCIONAL!D3; Código=02; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-03 | Entidade Orçamental | 5495.1 | milhões de euros | 2026 | [FUNCIONAL!D4; Código=03; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-04 | Entidade Orçamental | 12267.1 | milhões de euros | 2026 | [FUNCIONAL!D5; Código=04; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-05 | Entidade Orçamental | 2392 | milhões de euros | 2026 | [FUNCIONAL!D6; Código=05; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-06 | Entidade Orçamental | 1534.1 | milhões de euros | 2026 | [FUNCIONAL!D7; Código=06; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-07 | Entidade Orçamental | 17799.3 | milhões de euros | 2026 | [FUNCIONAL!D8; Código=07; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-08 | Entidade Orçamental | 1092.1 | milhões de euros | 2026 | [FUNCIONAL!D9; Código=08; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-09 | Entidade Orçamental | 11372.8 | milhões de euros | 2026 | [FUNCIONAL!D10; Código=09; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-despesa-funcao-10 | Entidade Orçamental | 14317.9 | milhões de euros | 2026 | [FUNCIONAL!D11; Código=10; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-diferencas-consolidacao-funcional | Entidade Orçamental | 0.5 | milhões de euros | 2026 | [FUNCIONAL!D12; Código=99; OE2026 - Despesa por classificação funcional (contabilidade pública)](https://dados.gov.pt/s/resources/orcamento-do-estado-despesa-por-classificacao-funcional/20260312-190751/dados-conhecer-orcamento-2026-funcional.xls) |
| oe-2026-receita-orcamental-administracao-central | Entidade Orçamental | 297892.4 | milhões de euros | 2026 | [INDICADORES_AC!C2; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-despesa-orcamental-administracao-central | Entidade Orçamental | 296420.8 | milhões de euros | 2026 | [INDICADORES_AC!C3; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-receita-efetiva-administracao-central | Entidade Orçamental | 96020.6 | milhões de euros | 2026 | [INDICADORES_AC!C4; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-despesa-efetiva-administracao-central | Entidade Orçamental | 104249 | milhões de euros | 2026 | [INDICADORES_AC!C5; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-saldo-global-administracao-central | Entidade Orçamental | -8228.4 | milhões de euros | 2026 | [INDICADORES_AC!C6; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-despesa-primaria-administracao-central | Entidade Orçamental | 97232.4 | milhões de euros | 2026 | [INDICADORES_AC!C7; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-saldo-primario-administracao-central | Entidade Orçamental | -1211.8 | milhões de euros | 2026 | [INDICADORES_AC!C8; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-ativos-e-passivos-da-despesa-administracao-central | Entidade Orçamental | 191368.9 | milhões de euros | 2026 | [INDICADORES_AC!C9; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| oe-2026-ativos-e-passivos-da-receita-administracao-central | Entidade Orçamental | 201871.7 | milhões de euros | 2026 | [INDICADORES_AC!C10; OE2026 - Indicadores da Administração Central em contabilidade pública](https://dados.gov.pt/s/resources/orcamento-do-estado-indicadores-da-administracao-central-em-contabilidade-publica/20260312-181856/dados-conhecer-orcamento-2026-indicadores-ac.xls) |
| execucao-2026-07-despesa-funcao-01 | Entidade Orçamental | 20258.7 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E2; Código=01; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-02 | Entidade Orçamental | 1245.4 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E3; Código=02; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-03 | Entidade Orçamental | 2817.7 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E4; Código=03; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-04 | Entidade Orçamental | 4964 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E5; Código=04; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-05 | Entidade Orçamental | 728.4 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E6; Código=05; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-06 | Entidade Orçamental | 645 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E7; Código=06; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-07 | Entidade Orçamental | 10879.2 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E8; Código=07; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-08 | Entidade Orçamental | 469.7 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E9; Código=08; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-09 | Entidade Orçamental | 6584.4 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E10; Código=09; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-10 | Entidade Orçamental | 7813.3 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E11; Código=10; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-diferencas-consolidacao-funcional | Entidade Orçamental | 53.1 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [FUNCIONAL!E12; Código=99; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-receita-orcamental-administracao-central | Entidade Orçamental | 122039.9 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D2; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-despesa-orcamental-administracao-central | Entidade Orçamental | 126422.5 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D3; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-receita-efetiva-administracao-central | Entidade Orçamental | 51377.1 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D4; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-despesa-efetiva-administracao-central | Entidade Orçamental | 56458.9 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D5; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-saldo-global-administracao-central | Entidade Orçamental | -5081.8 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D6; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-despesa-primaria-administracao-central | Entidade Orçamental | 51548 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D7; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-saldo-primario-administracao-central | Entidade Orçamental | -170.9 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D8; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-ativos-e-passivos-da-despesa-administracao-central | Entidade Orçamental | 69963.6 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D9; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-ativos-e-passivos-da-receita-administracao-central | Entidade Orçamental | 70662.8 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D10; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-saldo-global-administracoes-publicas-contabilidade-publica | Entidade Orçamental | 281.7 | milhões de euros, acumulados de janeiro a julho | 2026-07 | [INDICADORES_AC!D11; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| despesa-por-funcao-2024-gf01-pt | Eurostat | 5.8 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF01; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF01) |
| despesa-por-funcao-2024-gf02-pt | Eurostat | 0.9 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF02; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF02) |
| despesa-por-funcao-2024-gf03-pt | Eurostat | 1.6 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF03; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF03) |
| despesa-por-funcao-2024-gf04-pt | Eurostat | 3.6 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF04; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF04) |
| despesa-por-funcao-2024-gf05-pt | Eurostat | 0.7 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF05; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF05) |
| despesa-por-funcao-2024-gf06-pt | Eurostat | 0.6 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF06; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF06) |
| despesa-por-funcao-2024-gf07-pt | Eurostat | 6.8 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF07; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF07) |
| despesa-por-funcao-2024-gf08-pt | Eurostat | 0.8 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF08; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF08) |
| despesa-por-funcao-2024-gf09-pt | Eurostat | 4.3 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF09; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF09) |
| despesa-por-funcao-2024-gf10-pt | Eurostat | 17.1 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF10; na_item=TE; geo=PT; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=PT&cofog99=GF10) |
| despesa-por-funcao-2024-gf01-es | Eurostat | 5.8 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF01; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF01) |
| despesa-por-funcao-2024-gf02-es | Eurostat | 0.9 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF02; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF02) |
| despesa-por-funcao-2024-gf03-es | Eurostat | 1.8 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF03; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF03) |
| despesa-por-funcao-2024-gf04-es | Eurostat | 5.1 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF04; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF04) |
| despesa-por-funcao-2024-gf05-es | Eurostat | 1.0 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF05; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF05) |
| despesa-por-funcao-2024-gf06-es | Eurostat | 0.5 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF06; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF06) |
| despesa-por-funcao-2024-gf07-es | Eurostat | 6.5 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF07; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF07) |
| despesa-por-funcao-2024-gf08-es | Eurostat | 1.2 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF08; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF08) |
| despesa-por-funcao-2024-gf09-es | Eurostat | 4.1 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF09; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF09) |
| despesa-por-funcao-2024-gf10-es | Eurostat | 18.7 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF10; na_item=TE; geo=ES; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=ES&cofog99=GF10) |
| despesa-por-funcao-2024-gf01-ue | Eurostat | 6.1 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF01; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF01) |
| despesa-por-funcao-2024-gf02-ue | Eurostat | 1.5 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF02; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF02) |
| despesa-por-funcao-2024-gf03-ue | Eurostat | 1.7 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF03; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF03) |
| despesa-por-funcao-2024-gf04-ue | Eurostat | 5.3 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF04; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF04) |
| despesa-por-funcao-2024-gf05-ue | Eurostat | 0.8 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF05; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF05) |
| despesa-por-funcao-2024-gf06-ue | Eurostat | 0.7 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF06; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF06) |
| despesa-por-funcao-2024-gf07-ue | Eurostat | 7.3 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF07; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF07) |
| despesa-por-funcao-2024-gf08-ue | Eurostat | 1.2 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF08; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF08) |
| despesa-por-funcao-2024-gf09-ue | Eurostat | 4.7 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF09; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF09) |
| despesa-por-funcao-2024-gf10-ue | Eurostat | 19.6 | % do PIB | 2024 | [freq=A; unit=PC_GDP; sector=S13; cofog99=GF10; na_item=TE; geo=EU27_2020; time=2024; value[0]](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_exp?format=JSON&lang=EN&freq=A&unit=PC_GDP&sector=S13&na_item=TE&time=2024&geo=EU27_2020&cofog99=GF10) |
| oe-2026-cem-euros-ministerio-encargos-gerais-do-estado | Cálculo, pelas linhas de origem | Cálculo: 2.19 | % | 2026 | round ( oe-2026-despesa-ministerio-encargos-gerais-do-estado / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros | Cálculo, pelas linhas de origem | Cálculo: 0.29 | % | 2026 | round ( oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-negocios-estrangeiros | Cálculo, pelas linhas de origem | Cálculo: 0.17 | % | 2026 | round ( oe-2026-despesa-ministerio-negocios-estrangeiros / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-financas | Cálculo, pelas linhas de origem | Cálculo: 60.12 | % | 2026 | round ( oe-2026-despesa-ministerio-financas / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-economia-e-coesao-territorial | Cálculo, pelas linhas de origem | Cálculo: 1.68 | % | 2026 | round ( oe-2026-despesa-ministerio-economia-e-coesao-territorial / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-reforma-do-estado | Cálculo, pelas linhas de origem | Cálculo: 0.05 | % | 2026 | round ( oe-2026-despesa-ministerio-reforma-do-estado / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-defesa-nacional | Cálculo, pelas linhas de origem | Cálculo: 1.09 | % | 2026 | round ( oe-2026-despesa-ministerio-defesa-nacional / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao | Cálculo, pelas linhas de origem | Cálculo: 2.87 | % | 2026 | round ( oe-2026-despesa-ministerio-infraestruturas-e-habitacao / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-justica | Cálculo, pelas linhas de origem | Cálculo: 0.70 | % | 2026 | round ( oe-2026-despesa-ministerio-justica / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-administracao-interna | Cálculo, pelas linhas de origem | Cálculo: 0.94 | % | 2026 | round ( oe-2026-despesa-ministerio-administracao-interna / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao | Cálculo, pelas linhas de origem | Cálculo: 4.16 | % | 2026 | round ( oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-saude | Cálculo, pelas linhas de origem | Cálculo: 13.28 | % | 2026 | round ( oe-2026-despesa-ministerio-saude / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social | Cálculo, pelas linhas de origem | Cálculo: 10.69 | % | 2026 | round ( oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-ambiente-e-energia | Cálculo, pelas linhas de origem | Cálculo: 0.88 | % | 2026 | round ( oe-2026-despesa-ministerio-ambiente-e-energia / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto | Cálculo, pelas linhas de origem | Cálculo: 0.30 | % | 2026 | round ( oe-2026-despesa-ministerio-cultura-juventude-e-desporto / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-ministerio-agricultura-e-mar | Cálculo, pelas linhas de origem | Cálculo: 0.59 | % | 2026 | round ( oe-2026-despesa-ministerio-agricultura-e-mar / oe-2026-despesa-bruta-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-01 | Cálculo, pelas linhas de origem | Cálculo: 33.18 | % | 2026 | round ( oe-2026-despesa-funcao-01 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-02 | Cálculo, pelas linhas de origem | Cálculo: 3.25 | % | 2026 | round ( oe-2026-despesa-funcao-02 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-03 | Cálculo, pelas linhas de origem | Cálculo: 5.27 | % | 2026 | round ( oe-2026-despesa-funcao-03 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-04 | Cálculo, pelas linhas de origem | Cálculo: 11.77 | % | 2026 | round ( oe-2026-despesa-funcao-04 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-05 | Cálculo, pelas linhas de origem | Cálculo: 2.29 | % | 2026 | round ( oe-2026-despesa-funcao-05 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-06 | Cálculo, pelas linhas de origem | Cálculo: 1.47 | % | 2026 | round ( oe-2026-despesa-funcao-06 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-07 | Cálculo, pelas linhas de origem | Cálculo: 17.07 | % | 2026 | round ( oe-2026-despesa-funcao-07 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-08 | Cálculo, pelas linhas de origem | Cálculo: 1.05 | % | 2026 | round ( oe-2026-despesa-funcao-08 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-09 | Cálculo, pelas linhas de origem | Cálculo: 10.91 | % | 2026 | round ( oe-2026-despesa-funcao-09 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| oe-2026-cem-euros-funcao-10 | Cálculo, pelas linhas de origem | Cálculo: 13.73 | % | 2026 | round ( oe-2026-despesa-funcao-10 / oe-2026-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-01 | Cálculo, pelas linhas de origem | Cálculo: 35.88 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-01 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-02 | Cálculo, pelas linhas de origem | Cálculo: 2.21 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-02 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-03 | Cálculo, pelas linhas de origem | Cálculo: 4.99 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-03 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-04 | Cálculo, pelas linhas de origem | Cálculo: 8.79 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-04 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-05 | Cálculo, pelas linhas de origem | Cálculo: 1.29 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-05 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-06 | Cálculo, pelas linhas de origem | Cálculo: 1.14 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-06 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-07 | Cálculo, pelas linhas de origem | Cálculo: 19.27 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-07 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-08 | Cálculo, pelas linhas de origem | Cálculo: 0.83 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-08 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-09 | Cálculo, pelas linhas de origem | Cálculo: 11.66 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-09 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-10 | Cálculo, pelas linhas de origem | Cálculo: 13.84 | %, sobre valores acumulados de janeiro a julho | 2026-07 | round ( execucao-2026-07-despesa-funcao-10 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
