# OE1: o dinheiro do Estado

O teste de aceitação integral do §2 não está cumprido. Foram construídas e exportadas **186 linhas**, das quais **150 transcrevem valores publicados** e **36 são contas declaradas**. As lacunas de fonte estão identificadas abaixo. Os resultados efetivos dos portões constam da tabela, sem converter uma tentativa em sucesso.

## Mandato e medida

| Item | Medida e resultado |
|---|---|
| 1. Fontes à mão da máquina | 11 XML recebidos por endereços publicados; 14 conjuntos do dados.gov.pt com código de licença cc-by; matrizes Eurostat de 2024 e 2025 e 30 pedidos individuais; mapas PDF; sínteses de julho e agosto e anexo XLSX de agosto. Recibos de pedido, data, estado HTTP, bytes e SHA-256 no motor. |
| 2. Leitores | Leitores separados para XML, XLS, JSON-stat e PDF; cliente comum na aquisição. Provas no módulo publisher.oe1_test, registado em core.gate. O anexo XLSX é uma segunda leitura de 26 valores da síntese. |
| 3. Linhas | Parcial: 16 rubricas orgânicas por ministério, incluindo Encargos Gerais do Estado; 20 programas no orçamento; 20 programas executados até agosto; dez funções no orçamento e dez executadas até julho; 30 células Eurostat; totais, indicadores, diferenças de consolidação e 36 derivadas. Faltam os totais consolidados de receita e saldo dos mapas e as necessidades de financiamento mensais. A tabela integral está neste relatório e em LINHAS.md. |
| 4. Portões | Códigos e cabeças lidos de ficheiro na tabela abaixo. Uma cabeça diferente não é uma prova da cabeça final. |
| 5. Relatório | Este ficheiro, LINHAS.md, medidas.json, medir.py, custo.json e a resposta curta. Cada contagem tem um conhecido positivo executado pelo guião. |

## O que a leitura corrigiu e o que ficou por selar

1. A biblioteca e a vista XML deram 401. A página pública deu 200, mas a abertura da lista falhava porque `theForm` não estava definido. O navegador usa o User-Agent da casa e associa esse nome ao formulário público existente, sem autenticação. A resposta pública da lista revela os 11 links; todos deram 200 no cliente comum. O navegador só localiza; os leitores consomem os corpos obtidos pelo motor.
2. Os XML publicados não incluem os mapas 7, 8 e 9, nem os totais ministeriais. Os 16 totais foram lidos da coluna POR MINISTÉRIOS do Mapa 4 PDF e fecham exatamente com os 20 programas do Mapa 1 XML. Encargos Gerais do Estado não é um ministério governamental. Os nomes mantêm a grafia da fonte, incluindo COESAO e HABITACÃO.
3. A despesa total consolidada AC+SS está impressa no Mapa 1. Não se encontrou uma receita total consolidada AC+SS nem um saldo correspondente impressos nos mapas lidos. Não se fabricou a consolidação somando subsetores. Receita, despesa e saldo efetivos AC+SS são linhas próprias da síntese, identificadas como tal, e não substituem esta lacuna dos mapas.
4. A despesa bruta da Segurança Social é `89 743 812 222` no Mapa 1 e `89 749 381 149,00` no Mapa 8: diferença medida de `5568927.00` euros. O total consolidado coincide. Não atravessou uma escolha entre os dois totais brutos.
5. O catálogo funcional só publica julho de 2026 à data de acesso. A síntese mais recente é agosto, publicada a 30.09.2026. Não se fez passar julho por agosto: funções até julho, programas e contas até agosto. Nenhuma execução é só a despesa do mês; é acumulada desde janeiro.
6. Saldo não é dívida emitida. Foram preservados os saldos e os fluxos líquidos de ativos e passivos que a síntese publica. Não se encontrou nos indicadores mensais uma linha que permita afirmar que uma parcela exata da despesa foi financiada por dívida. O quadro de capacidade/necessidade em contabilidade nacional refere-se ao primeiro semestre, outro período e outra ótica. Esse ponto fica por selar.
7. Os indicadores AC do orçamento não fecham entre despesa orçamental, ativos e passivos da despesa e despesa efetiva: a diferença medida é `802.9` milhões. Os valores são transcritos com aviso e não usados para calcular uma parcela financiada por dívida.
8. Os XLS funcionais não imprimem a unidade. A escala em milhões foi conferida com receita, despesa e saldo da conta AC na síntese de julho, para orçamento e execução, seis correspondências exatas. As dez funções e o código 99 fecham com a despesa efetiva: diferença de -0,1 milhões no orçamento e zero em julho. O limite de arredondamento, calculado sobre onze parcelas e um total a uma décima, é 0,60 milhões. A diferença não foi apagada nem redistribuída.
9. O Eurostat de 2024 tem as dez funções dos 27 países. Em 2025, apenas LU tem as dez. Portugal e Espanha conservam a bandeira provisória p, com explicação em português e inglês. A União é o agregado publicado, não uma média calculada.
10. O modelo de Évora citado no brief vem do Município de Évora, não da DGAL. O §0 foi reproduzido: 3009 linhas iniciais, zero EO e zero COFOG Eurostat. Não se alterou a linha de Évora.

As duas armadilhas do brief constam das notas: mapas e Eurostat têm perímetros diferentes; citam-se dados e documentos oficiais, nunca os portais oe.gov.pt ou Mais Transparência. As quotas ministeriais usam despesa **bruta da AC**, com operações financeiras e transferências internas. As quotas funcionais usam despesa **efetiva consolidada da AC**, incluindo no denominador a diferença de consolidação. Não são repartições da mesma grandeza.

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

A proposta `publisher/oe1_site_support.patch`, no motor, contém cinco adaptações identificadas no sítio: registo do conjunto, línguas, unidade, declaração de que as linhas aguardam a futura página do governo e conferência da bandeira no JSON literal. O `git apply --check` confirmou que a proposta se aplica à árvore, sem a aplicar. A proposta não foi validada pelos portões do sítio. O mandato original admite no sítio apenas linhas exportadas, relatório e medições, pelo que esta alteração de código exige uma decisão sobre o perímetro. Ficheiros da proposta efetivamente alterados nesta árvore: **0 de 5**. Não se apresenta a exportação como aceitação pelo sítio.

As decisões do §5 foram respeitadas: o bloco entrega dados e nenhuma página; todas as linhas publicadas declaram o perímetro; as fontes que atravessam têm corpos e pedidos reproduzíveis. O ponto da biblioteca foi resolvido por endereços publicados, com os 401 conservados como prova da limitação inicial.

Os registos da medição final são escritos depois do último commit, porque um ficheiro não pode conter o resumo do commit que o contém. O commit final guarda os guiões, o relatório e a resposta curta; as cabeças e os resultados posteriores são os ficheiros da última corrida na worktree. O estado final do Git é entregue sem o disfarçar.

## Portões lidos de ficheiro

As corridas do sítio usam `scripts/leituras/portoes.sh`. Um invólucro temporário do npm retira caminhos locais antes de escrever a saída e conserva cada código. Durante a chamada do build, com a mesma tranca ainda tomada, também corre `npm run ledger:check` e guarda o seu código separado. Não altera comandos do projeto nem transforma falhas em sucesso.

O registo do ledger contém 206 recusas: 186 por conjunto ainda não registado e 20 porque o verificador do sítio só reconhece o formato antigo da bandeira Eurostat. O JSON oficial guarda a bandeira no índice da célula, não como texto depois do número. O motor prova essa associação; o sítio ainda não recebeu a adaptação proposta. O build e o verify param neste primeiro portão, pelo que os passos seguintes não foram executados.

| Portão | Código | Cabeça registada | É a cabeça atual? |
|---|---|---|---|
| motor | 0 | 9bfbb777f7d2f5af8b185475c8dd8027ebd76bad | sim |
| build | 1 | e1a283838807219d41455e4d9956d07b8e6db37f | sim |
| verify | 1 | e1a283838807219d41455e4d9956d07b8e6db37f | sim |
| typecheck | 0 | e1a283838807219d41455e4d9956d07b8e6db37f | sim |
| ledger | 1 | e1a283838807219d41455e4d9956d07b8e6db37f | sim |

## Commits e cabeças

motor: `9bfbb777f7d2f5af8b185475c8dd8027ebd76bad`.

* `9bfbb777f7d2f5af8b185475c8dd8027ebd76bad OE1: selar 186 linhas e provar os leitores e a travessia literal`
* `aa537323722eea9001daccabf394fd5e3ccdb546 OE1: guardar fontes oficiais e aquisição reproduzível`

sitio: `e1a283838807219d41455e4d9956d07b8e6db37f`.

* `e1a283838807219d41455e4d9956d07b8e6db37f OE1: receber 186 linhas pelo tubo do motor`

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

## Custo medido

Modelo: Codex gpt-6-astra, confirmado pelo registo da sessão. O custo em símbolos é o acumulado dos eventos token_count até à medição, separado entre construção e revisão automática. Inclui entradas lidas da cache; não é o preço monetário. Mensagens posteriores à medição ficam fora desse corte.

```json
{
  "origem": "Eventos token_count das sessões deste bloco, filtrados pela worktree em memória.",
  "medido_em": "2026-10-04T05:21:25.627861+00:00",
  "segundos": 5472,
  "sessoes": [
    {
      "sessao": "01a10508-9b42-72e2-a474-124da3a642e1",
      "modelo": "gpt-6-astra",
      "inicio": "2026-10-04T03:50:12.668Z",
      "ultima_medicao": "2026-10-04T05:21:07.359Z",
      "tokens": {
        "input_tokens": 17766381,
        "cached_input_tokens": 16864768,
        "cache_write_input_tokens": 0,
        "output_tokens": 101916,
        "reasoning_output_tokens": 38900,
        "total_tokens": 17868297
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
      "ultima_medicao": "2026-10-04T05:11:02.685Z",
      "tokens": {
        "input_tokens": 87684,
        "cached_input_tokens": 33024,
        "cache_write_input_tokens": 0,
        "output_tokens": 500,
        "reasoning_output_tokens": 293,
        "total_tokens": 88184
      }
    }
  ],
  "tokens_totais": 19025264,
  "tokens_entrada_cache": 17703936,
  "tokens_entrada_sem_cache": 1216086,
  "tokens_saida": 105242,
  "limite": "Corte no último contador disponível; mensagens e trabalho posteriores não estão incluídos.",
  "conhecido_positivo": true
}
```

## Tabela integral das linhas

| Id | Fonte | Valor literal da fonte, ou cálculo assinalado | Unidade | Período | Localizador |
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
| execucao-2026-08-receita-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 79 618,7 | milhões de euros | 2026-08 | [p. 49 do ficheiro, página impressa 45, Receita efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-despesa-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 130 971,6 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Despesa efetiva, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social | Entidade Orçamental | 80 464,5 | milhões de euros | 2026-08 | [p. 49 do ficheiro, página impressa 45, Despesa efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-saldo-global-administracao-central-seguranca-social | Entidade Orçamental | -1 789,8 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Saldo global, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-saldo-global-administracao-central-seguranca-social | Entidade Orçamental | -845,8 | milhões de euros | 2026-08 | [p. 49 do ficheiro, página impressa 45, Saldo global, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | -10 551,7 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Ativos financeiros líquidos de reembolsos, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | 1 491,8 | milhões de euros | 2026-08 | [p. 49 do ficheiro, página impressa 45, Ativos financeiros líquidos de reembolsos, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | -1 420,4 | milhões de euros | 2026 | [p. 49 do ficheiro, página impressa 45, Passivos financeiros líquidos de amortizações, Orçamento Inicial 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-passivos-financeiros-liquidos-administracao-central-seguranca-social | Entidade Orçamental | 625,5 | milhões de euros | 2026-08 | [p. 49 do ficheiro, página impressa 45, Passivos financeiros líquidos de amortizações, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-receita-efetiva-administracao-central | Entidade Orçamental | 58 070,1 | milhões de euros | 2026-08 | [p. 50 do ficheiro, página impressa 46, Receita efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-efetiva-administracao-central | Entidade Orçamental | 64 038,6 | milhões de euros | 2026-08 | [p. 50 do ficheiro, página impressa 46, Despesa efetiva, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-saldo-global-administracao-central | Entidade Orçamental | -5 968,5 | milhões de euros | 2026-08 | [p. 50 do ficheiro, página impressa 46, Saldo global, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-001 | Entidade Orçamental | 5 044,9 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 001, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-002 | Entidade Orçamental | 347,5 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 002, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-003 | Entidade Orçamental | 265,3 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 003, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-004 | Entidade Orçamental | 5 337,6 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 004, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-005 | Entidade Orçamental | 5 212,7 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 005, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-006 | Entidade Orçamental | 1 134,6 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 006, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-007 | Entidade Orçamental | 799,9 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 007, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-008 | Entidade Orçamental | 92,2 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 008, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-009 | Entidade Orçamental | 1 633,8 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 009, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-010 | Entidade Orçamental | 3 434,9 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 010, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-011 | Entidade Orçamental | 1 233,6 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 011, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-012 | Entidade Orçamental | 1 844,5 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 012, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-013 | Entidade Orçamental | 4 902,5 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 013, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-014 | Entidade Orçamental | 2 621,1 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 014, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-015 | Entidade Orçamental | 11 822,6 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 015, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-016 | Entidade Orçamental | 17 636,8 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 016, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-017 | Entidade Orçamental | 1 004,0 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 017, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-018 | Entidade Orçamental | 288,7 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 018, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-019 | Entidade Orçamental | 92,3 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 019, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-despesa-programa-020 | Entidade Orçamental | 836,4 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, programa 020, Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-subtotal-programas | Entidade Orçamental | 65 585,6 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, Subtotal despesa efetiva consolidada dos Programas Orçamentais (1), Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-fluxos-entre-programas | Entidade Orçamental | 1 610,3 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, Fluxos para outros Programas Orçamentais (2), Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
| execucao-2026-08-diferencas-consolidacao-programas | Entidade Orçamental | 63,3 | milhões de euros | 2026-08 | [p. 72 do ficheiro, página impressa 68, Diferenças de consolidação (3), Execução Acumulada 2026](https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf) |
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
| execucao-2026-07-despesa-funcao-01 | Entidade Orçamental | 20258.7 | milhões de euros | 2026-07 | [FUNCIONAL!E2; Código=01; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-02 | Entidade Orçamental | 1245.4 | milhões de euros | 2026-07 | [FUNCIONAL!E3; Código=02; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-03 | Entidade Orçamental | 2817.7 | milhões de euros | 2026-07 | [FUNCIONAL!E4; Código=03; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-04 | Entidade Orçamental | 4964 | milhões de euros | 2026-07 | [FUNCIONAL!E5; Código=04; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-05 | Entidade Orçamental | 728.4 | milhões de euros | 2026-07 | [FUNCIONAL!E6; Código=05; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-06 | Entidade Orçamental | 645 | milhões de euros | 2026-07 | [FUNCIONAL!E7; Código=06; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-07 | Entidade Orçamental | 10879.2 | milhões de euros | 2026-07 | [FUNCIONAL!E8; Código=07; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-08 | Entidade Orçamental | 469.7 | milhões de euros | 2026-07 | [FUNCIONAL!E9; Código=08; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-09 | Entidade Orçamental | 6584.4 | milhões de euros | 2026-07 | [FUNCIONAL!E10; Código=09; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-despesa-funcao-10 | Entidade Orçamental | 7813.3 | milhões de euros | 2026-07 | [FUNCIONAL!E11; Código=10; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-diferencas-consolidacao-funcional | Entidade Orçamental | 53.1 | milhões de euros | 2026-07 | [FUNCIONAL!E12; Código=99; Execução Orçamental de julho 2026 - despesa por classificação funcional](https://dados.gov.pt/s/resources/execucao-orcamental-despesa-por-classificacao-funcional/20260902-175028-c4043772/execucao-funcional-202607.xls) |
| execucao-2026-07-receita-orcamental-administracao-central | Entidade Orçamental | 122039.9 | milhões de euros | 2026-07 | [INDICADORES_AC!D2; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-despesa-orcamental-administracao-central | Entidade Orçamental | 126422.5 | milhões de euros | 2026-07 | [INDICADORES_AC!D3; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-receita-efetiva-administracao-central | Entidade Orçamental | 51377.1 | milhões de euros | 2026-07 | [INDICADORES_AC!D4; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-despesa-efetiva-administracao-central | Entidade Orçamental | 56458.9 | milhões de euros | 2026-07 | [INDICADORES_AC!D5; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-saldo-global-administracao-central | Entidade Orçamental | -5081.8 | milhões de euros | 2026-07 | [INDICADORES_AC!D6; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-despesa-primaria-administracao-central | Entidade Orçamental | 51548 | milhões de euros | 2026-07 | [INDICADORES_AC!D7; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-saldo-primario-administracao-central | Entidade Orçamental | -170.9 | milhões de euros | 2026-07 | [INDICADORES_AC!D8; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-ativos-e-passivos-da-despesa-administracao-central | Entidade Orçamental | 69963.6 | milhões de euros | 2026-07 | [INDICADORES_AC!D9; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-ativos-e-passivos-da-receita-administracao-central | Entidade Orçamental | 70662.8 | milhões de euros | 2026-07 | [INDICADORES_AC!D10; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
| execucao-2026-07-saldo-global-administracoes-publicas-contabilidade-publica | Entidade Orçamental | 281.7 | milhões de euros | 2026-07 | [INDICADORES_AC!D11; Execução orçamental de julho 2026 – Indicadores da Administração Central (contabilidade pública)](https://dados.gov.pt/s/resources/execucao-orcamental-indicadores-da-administracao-central-em-contabilidade-publica/20260902-175028-173f9a48/execucao-indicadores-ac-202607.xls) |
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
| execucao-2026-07-cem-euros-funcao-01 | Cálculo, pelas linhas de origem | Cálculo: 35.88 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-01 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-02 | Cálculo, pelas linhas de origem | Cálculo: 2.21 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-02 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-03 | Cálculo, pelas linhas de origem | Cálculo: 4.99 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-03 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-04 | Cálculo, pelas linhas de origem | Cálculo: 8.79 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-04 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-05 | Cálculo, pelas linhas de origem | Cálculo: 1.29 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-05 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-06 | Cálculo, pelas linhas de origem | Cálculo: 1.14 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-06 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-07 | Cálculo, pelas linhas de origem | Cálculo: 19.27 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-07 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-08 | Cálculo, pelas linhas de origem | Cálculo: 0.83 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-08 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-09 | Cálculo, pelas linhas de origem | Cálculo: 11.66 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-09 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
| execucao-2026-07-cem-euros-funcao-10 | Cálculo, pelas linhas de origem | Cálculo: 13.84 | % | 2026-07 | round ( execucao-2026-07-despesa-funcao-10 / execucao-2026-07-despesa-efetiva-administracao-central * 100 , 2 ) |
