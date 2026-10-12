# Brief comum · Inventário das fontes · verificação na fonte primária (01.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5) do sítio O Estado do País. Cada lote é verificado por um agente Claude Opus 5, um lote por agente, e o lugar de direção funde. Sem travessões na prosa; nas células copiadas mantém-se o texto do publicador tal como está.*

## 0 · O que é isto

O Estado do País é um observatório de Portugal em que cada número leva a sua fonte, o seu excerto, a data de acesso e um selo. A casa está a escrever a carta dos conteúdos (os domínios e as perguntas) e o inventário das fontes (uma linha por medida candidata). As linhas deste lote são medidas candidatas da primeira vaga. O teu trabalho é **verificar cada linha na fonte primária, hoje**, e preencher as colunas do inventário. Nada de memória, nada de plausível: cada célula sai de uma página ou de um ficheiro que abriste hoje, com o endereço, a data e hora de acesso e um excerto copiado carácter a carácter. O que não se confirmar leva `[verify]` e a razão (o que tentaste, que resposta veio). Uma célula com `[verify]` honesta vale mais do que uma célula plausível: a casa publica o que confirma e diz o que não confirma.

## 1 · As colunas, por linha

1. `id` (o da lista).
2. `medida`: o nome da medida tal como o publicador a imprime (copiado; se a lista o formulou mal, corrige e regista em notas).
3. `publicador_primario`: o organismo que produz o número. O Eurostat a redisseminar dados do INE, o INE a redisseminar dados da DGEEC ou do IEFP, um observatório a compilar dados de outrem: são segundos publicadores. Regista os dois em `publicador_primario` e `publicador_secundario`, e diz qual é qual. Um observatório só é fonte onde for ele o compilador primário (a única publicação do número).
4. `definicao` e `definicao_url`: a definição publicada, copiada (a frase do publicador), e onde está (a metainformação do INE, a ficha ESMS do Eurostat, a nota metodológica do publicador).
5. `serie_desde` e `periodicidade`: o primeiro período disponível na série e a periodicidade tal como o publicador a declara.
6. `ultimo_periodo` e `publicado_em`: o período de referência mais recente disponível e a data em que o publicador o publicou ou atualizou (a data que ele imprime: `DataUltimoAtualizacao` no INE, `updated` no Eurostat, a data da nota de imprensa ou do ficheiro).
7. `calendario`: a próxima data de difusão prevista, tal como o publicador a publica, com o endereço do calendário. Onde o publicador não tem calendário, escreve exatamente «sem calendário publicado» e onde procuraste.
8. `concelho`: se a medida existe ao nível do concelho e para quantos (os 308; só o continente, 278; as ilhas por outro publicador), ou a unidade mais fina que existe (NUTS III, região, ULS, entidade gestora), ou «não».
9. `licenca` e `licenca_url`: a licença ou os termos de reutilização do publicador, com a frase copiada e o endereço. Se não encontrares termos, «sem licença declarada» e onde procuraste.
10. `url_maquina` e `url_pagina`: o endereço de máquina (API, ficheiro) e o de leitura (a página).
11. `acesso` e `http`: a data e hora UTC de cada pedido e o estado HTTP que veio (200, 404, 429, 403, tempo esgotado).
12. `excerto`: a frase, a célula ou o fragmento de JSON que sustenta a linha, verbatim.
13. `valor_recente`: o valor mais recente tal como impresso, com unidade e período, só se o leste hoje; nunca calculado nem arredondado.
14. `comparacao`: a comparação que a fonte permite, sem inventar nenhuma: um limiar publicado (qual, por quem, onde), a posição entre pares (que conjunto: UE 27, OCDE, 308 concelhos), o passado do próprio país (desde quando a série é comparável, e as quebras).
15. `notas`: armadilhas (definições homónimas, quebras de série, revisões anunciadas, dois publicadores com números diferentes para a mesma coisa), candidatas melhores que tenhas encontrado, e o que **não existe** (se a pergunta pede algo que nenhum publicador oficial publica, di-lo e regista as pistas seguidas: isso é conteúdo de observatório).
16. `estado`: `verificada` (todas as colunas 2 a 12 lidas hoje na fonte), `parcial` (algumas colunas com `[verify]`, quais), `ausente` (a medida não existe como série oficial), `errada` (a linha estava mal formulada; explica).

Cada afirmação tua é de uma de três espécies e diz qual: **verificado** (leste hoje), **inferido** (deduzido de algo que leste; diz de quê), **`[verify]`** (não conseguiste).

## 2 · Como se lê cada publicador

- **INE.** Pedidos em série, com 2 segundos de intervalo entre cada; nunca em paralelo; a 429 ou recusa, espera 30 segundos e tenta uma vez só, e regista. A metainformação está em `https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=<código>&lang=PT` (designação, periodicidade, última atualização, primeiro e último período, nível geográfico, fonte); os dados em `https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=<código>&Dim1=<período>&Dim2=<geocódigo>&lang=PT` (Évora é `1870705`; `PT` o país); o catálogo em `https://www.ine.pt/ine/xml_indic.jsp?opc=2&lang=PT` (tem `geo_lastlevel` por indicador, que diz o nível mais fino; procura lá quando não souberes o código). O calendário de difusão do INE está no sítio do INE (procura «Calendário de difusão»; confirma o endereço, não o assumas). Os termos de utilização do INE estão no sítio do INE (procura «Termos de utilização», «Licença», «CC BY»); copia a frase.
- **Eurostat.** A API em `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<dataset>?format=JSON&lang=EN&geo=PT&<dimensões>`; os metadados de referência em `https://ec.europa.eu/eurostat/cache/metadata/en/<código_esms>_esms.htm`; a página do dataset em `https://ec.europa.eu/eurostat/databrowser/view/<dataset>/default/table`; o calendário em `https://ec.europa.eu/eurostat/news/release-calendar`; a política de reutilização em `https://ec.europa.eu/eurostat/about-us/policies/copyright`. Confirma cada endereço abrindo-o.
- **Outros publicadores** (DGAL, IEFP, CFP, IGFSS, IGFCSS, ISS, AIMA, ERSAR, APA e SNIRH, DGEEC, Portal da Transparência do SNS, OCDE, Diário da República): abre a página, encontra o ficheiro ou o dataset, lê a definição e os termos. O Portal da Transparência do SNS tem API documentada (`/api/explore/v2.1/catalog/datasets/<dataset>/records`). O Diário da República lê-se em `https://diariodarepublica.pt`; os ficheiros PDF em `https://files.diariodarepublica.pt`.
- **Ferramentas.** `curl` e `python3` no terminal para API e ficheiros (usa um `User-Agent` identificável, «OEstadoDoPais/inventario»); `WebFetch` para páginas HTML; `pdftotext` para PDF quando preciso. Se um sítio te bloquear (Cloudflare, 403), regista e não insistas mais do que duas vezes.
- **Tempo.** Trabalha as linhas por ordem; se uma fonte não responder, marca `[verify]` com a razão e segue. Não gastes mais do que uns dez minutos numa linha só.

## 3 · Regras que não se quebram

- **Não escreves em nenhum repositório**: nem em `~/Instruments/OEstadoDoPais` nem em `~/Instruments/ResearchHub`. Podes ler os dois (para saber o que a casa já publica: `ledger/claims/*.yml` no sítio, `indicators/coverage/` no motor). Escreves só na pasta de saída indicada no lote.
- **Nada de memória.** Um valor, uma data, uma periodicidade ou uma licença que não tenhas lido hoje não entra; `[verify]` no lugar.
- **Prosa nova em português** (Acordo Ortográfico), sem travessões («—»); os travessões que estejam dentro de texto copiado do publicador ficam, porque são dele.
- **Não acrescentas linhas** ao lote; candidatas melhores vão para `notas`.
- **Não corriges** o que a casa já publica; se encontrares uma discrepância com uma linha do livro-razão do sítio, regista-a em `notas` com os dois valores.

## 4 · Saída (dois ficheiros mais o relatório)

Na pasta de saída indicada no lote:

- `lote-N.md`: uma secção por linha (`## <id> · <medida>`), com as dezasseis colunas como lista, e no fim uma tabela-resumo com uma linha por medida: `id | publicador primário | periodicidade | último período · publicado em | calendário | concelho | licença | estado`.
- `lote-N.json`: um array de objetos com as chaves `id, medida, publicador_primario, publicador_secundario, definicao, definicao_url, serie_desde, periodicidade, ultimo_periodo, publicado_em, calendario, calendario_url, concelho, licenca, licenca_url, url_maquina, url_pagina, acesso, http, excerto, valor_recente, comparacao, notas, estado`.
- No fim do `.md`, um relatório curto: linhas verificadas, parciais, ausentes e erradas; o que não existe como série oficial; os pedidos que falharam e com que estado; quanto tempo levou; e uma linha com o modelo que fez o trabalho («Modelo: Claude Opus 5»).
