# Medição cega do Sonnet ao arquivo do corredor (01.09.2026)

*Claude Sonnet 5, a cópia do arquivo contra a fonte viva (12 endereços, hoje), três estragos plantados (3 de 3 vistos; o registo no `.plantas.json` ao lado; o «achado 4» é efeito do 3). Os achados reais convergiram com a leitura do Codex e a segunda passagem aplicou-os. O relatório segue tal como veio.*

---

Modelo: Claude Sonnet 5
Início: 2026-09-01T19:28Z (célula 2 e 3, na fonte) · relatório fechado às 2026-09-01T19:35Z
Duração total do trabalho (exploração do arquivo, código, duas corridas de rede): cerca de 55 minutos, dentro do limite de uma hora.

# Medição cega do piloto do corredor de conferência de fontes

Segui o brief à letra: célula 1 sem rede, sobre a cópia em `arquivo-copia/`; células 2 e 3 na fonte viva, hoje, com `User-Agent: OEstadoDoPais/medicao`, INE em série com dois segundos entre pedidos; célula 4 sobre a aritmética do índice. Não li os repositórios da casa. Não corrigi nada na cópia. O código está em `medicao-sonnet.py`, na mesma pasta.

Nota metodológica sobre a rede: a primeira tentativa de pedir os 12 endereços falhou nos 12, todos por erro de verificação de certificado TLS. A causa não é do corredor nem das fontes: o Python desta máquina (`/Library/Frameworks/Python.framework/Versions/3.14`) tem o seu próprio ficheiro de certificados-raiz, vazio ou desatualizado, distinto do que o `curl` do sistema usa. Corrigi o meu próprio código de medição para tentar primeiro o certificado do sistema (`/etc/ssl/cert.pem`, o mesmo que o `curl` usa) e, se falhar, o pacote `certifi` (foi preciso para `ec.europa.eu`, cuja cadeia intermédia da GlobalSign não estava no primeiro). Com isto, todos os 12 pedidos da amostra tiveram resposta na segunda corrida, que é a que se reporta abaixo. Registo isto porque é uma falha do meu ambiente de medição, não um achado sobre o corredor.

## 1 · O índice contra os ficheiros (sem rede)

Contagens:

- Linhas no índice: **149**
- Linhas com `sha256` preenchido: **146**
- Linhas sem `sha256` (403 da Cloudflare em `emprego.azores.gov.pt/estatisticas/`, e as 2 linhas com `SSLError` em `www.dgcp.mtsss.gov.pt`): **3**
- Valores de `sha256` únicos referenciados pelas linhas: **97**
- Ficheiros a existir em `sha256/<aa>/<resto>`: **85**
- Bytes que as linhas com `sha256` afirmam (campo `bytes`, somado): **199 042 727**
- Bytes lidos hoje dos ficheiros que essas linhas referenciam (contando cada referência, mesmo repetida entre corridas): **196 083 475**
- Bytes de todos os 85 ficheiros do disco (cada ficheiro contado uma vez): **190 071 568**
- Linhas cujo ficheiro falta: **13**
- Ficheiros no disco que nenhuma linha nomeia (órfãos): **1**
- Linhas cujo ficheiro existe mas cujo sha256 recalculado não bate com o da linha: **2** (a mesma URL, duas linhas)
- Linhas cujo ficheiro existe mas cujo tamanho não bate com o campo `bytes` da linha: **2** (as mesmas duas linhas)
- Ids de linha duplicados: **1** (usado por 2 linhas)

A diferença entre os bytes que as linhas afirmam (199 042 727) e os bytes lidos dos ficheiros referenciados (196 083 475) é de 2 959 252. A soma dos `bytes` das 13 linhas cujo ficheiro falta é 2 959 274; subtraindo os 22 bytes a mais que o ficheiro duplicado abaixo tem a mais do que a sua própria linha afirma (11 bytes × as 2 linhas que o citam), dá exatamente 2 959 252. Ou seja: as duas classes de achado abaixo (ficheiros ausentes e o ficheiro da Eurostat maior do que a linha diz) explicam a totalidade da diferença, sem resíduo.

### O que não bate

**A. 13 linhas cujo ficheiro falta** (o caminho `sha256/<aa>/<resto>` que o `sha256` da linha implica não existe):

1. Linha 21 · `nota-i87` não, corrida `2026-09-01T18:11:31` · `https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=0014580&Dim1=S7A2023&lang=PT` · sha256 da linha `ba859d084bfe5eda1877597282245d2b3cfd8fe2d9df06dd49da87325f08b4ed` · bytes 43144
2 a 12. As 11 linhas do INE da corrida `2026-09-01T18:15:18` (a segunda leitura de cada um dos 11 endereços do INE já vistos na primeira corrida `18:11:31`): varcd 0014061, 0012656, 0014580 (Dim1=S7A2023 sem Dim2), 0012917, 0014580&Dim2=1C4, 0014047&Dim2=1C40705, 0014063&Dim2=1C40705, 0014580&Dim2=1C40705, 0012918, 0013863, 0014047&Dim2=PT. Todas as 11 têm `sha256_comparacao` preenchido e igual ao da primeira corrida; nenhuma tem ficheiro guardado no disco (o piloto parece guardar o corpo só na primeira leitura do INE, usando a segunda só para o cálculo do resumo estável, mas o brief pede para registar toda a ausência sem adivinhar a intenção, e é isso que faço aqui).
13. Linha 149 · `nota-i87·IEFP janeiro de 2026` (a segunda ocorrência deste id, ver duplicado abaixo) · `https://www.iefp.pt/documents/10181/13482332/Informação+Mensal+janeiro+2026.pdf?x=1` · sha256 da linha `abababababababababababababababababababababababababababababababab`. Este valor tem 64 carateres hexadecimais (o comprimento certo de um sha256) mas é o padrão repetido "ab": não corresponde a nenhum ficheiro possível. A mesma nota já tem, na linha anterior do índice, uma ocorrência correta para o mesmo documento (sem o `?x=1` no URL): sha256 `de2571195f2c1859f30a5d201a0bef910b504c94fe5cb20706020c3fabd689f5`, com ficheiro guardado, 639109 bytes, que bate.

**B. 1 ficheiro órfão**: `sha256/ba/859d084b9e5eda1877597282245d2b3cfd8fe2d9df06dd49da87325f08b4ed` (43144 bytes). Repare se no sha256 da linha 21 acima: `...ba859d084bfe...` contra o nome real do ficheiro `...ba859d084b9e...`. Os dois hexadecimais diferem numa só posição (`fe` contra `9e`, ao 11º/12º caráter). Tudo aponta para o mesmo facto visto de dois lados: o campo `sha256` da linha 21 está errado por um caráter; o ficheiro correto está no disco mas sob outro nome. Confirmação independente: a linha do INE da segunda corrida para o mesmo URL (`varcd=0014580&Dim1=S7A2023`, que não tem ficheiro próprio, ver A.3) declara `sha256_anterior` = `ba859d084b9e5eda...`, ou seja, o valor do ficheiro órfão, não o valor que a linha 21 afirma. E a busca na fonte viva hoje (célula 3) confirma que o resumo estável certo para este indicador é `d81a90772bf65ae9b6592c14ed99ea5284e1469d8d317946d92666d359c6b3b4`, que é exatamente o `sha256_comparacao` de ambas as linhas (a 21 e a sua par da segunda corrida) É só o campo `sha256` cru da linha 21 que está corrompido; o `sha256_comparacao` e a lógica de identidade de conteúdo estão certos.

**C. 2 linhas cujo ficheiro existe mas não bate** (mesma URL, as duas corridas de hoje): `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tepsr_sp410?format=JSON&lang=EN&geo=PT&ind_type=IND_TOTAL`. Ambas as linhas (corrida `18:11:31`, linha 26, e corrida `18:15:18`, linha 102) afirmam sha256 `28a148a41e1f6a0a26bf4e59ee259c0b057e9e54d2c60c2a468f74536ce406af` e 5448 bytes. O ficheiro guardado em `sha256/28/a148a41e1f6a0a26bf4e59ee259c0b057e9e54d2c60c2a468f74536ce406af` tem, na realidade, sha256 `e4fd74c015cd37e8ca38c1869b7a4987e6f026d77b2174ff904720db9cbe5cb9` e 5459 bytes (11 bytes a mais). As duas linhas concordam entre si (não é um erro de transcrição de uma corrida isolada); é o conteúdo gravado no disco que não corresponde ao que ambas afirmam. A célula 2, pedindo este endereço à Eurostat hoje, veio confirmar que a fonte devolve exatamente o sha256 que **as linhas** afirmam (`28a148a4...`), não o que o ficheiro guardado tem: o ficheiro em disco é que está corrompido ou trocado, não a afirmação do índice.

**D. 1 par de ids duplicados**: `nota-i87·IEFP janeiro de 2026` aparece em duas linhas (a última e a penúltima do ficheiro), uma para `.../janeiro+2026.pdf` (sha256 correto, ficheiro presente) e outra para `.../janeiro+2026.pdf?x=1` (sha256 fabricado, ver A.13). Um id repetido em duas linhas com URLs diferentes é, por si, um achado de esquema, independentemente do sha256 fabricado que uma delas carrega.

## 2 · As afirmações da corrida na fonte, por amostra (hoje, 12 endereços)

Não há, em nenhuma das 149 linhas do índice, um único registo com `"http": 304`, nem a sequência "304" aparece em lado nenhum do ficheiro. Isto é um achado em si: o brief pede para incluir "1 com 304 registado" na amostra, mas essa linha não existe nesta cópia. Também não há, entre os 30 endereços com `ETag`/`Last-Modified`, nenhum que tenha sido pedido duas vezes no mesmo piloto (as duas corridas de hoje só repetem os endereços do INE e da Eurostat, que não têm validadores HTTP). Isto é consistente com o piloto ser a primeira leitura de cada fonte: um 304 só pode acontecer numa leitura condicional depois de já existir uma leitura anterior, e as únicas leituras repetidas de hoje (INE) não usam `ETag`/`If-None-Match`, usam o mecanismo dos dois resumos.

Substituí a vaga do "304 registado" por um teste equivalente e mais informativo: peguei numa linha com `ETag` e `Last-Modified` reais de uma captura 200 (`dre.pt`) e testei se, enviando esses validadores hoje, o servidor devolve 304. É essa a pergunta que o corredor precisa de responder certo na próxima corrida, e a resposta foi sim.

Para "ausência registada" usei a única linha com bloqueio recorrente e sem sha256: o 403 da Cloudflare em `emprego.azores.gov.pt/estatisticas/`.

| # | Endereço (domínio) | http previsto | http obtido hoje | Veredito |
|---|---|---|---|---|
| 1 | www.ine.pt (varcd 0014061) | 200 | 200 | resumo estável bate (`766d941eb03a…`); sha256 cru muda, como o desenho previa |
| 2 | www.ine.pt (varcd 0012656) | 200 | 200 | resumo estável bate (`f367761d7124…`); sha256 cru muda |
| 3 | www.ine.pt (varcd 0014580, Dim1=S7A2023) | 200 | 200 | resumo estável bate (`d81a90772bf6…`), apesar de o sha256 cru da linha 21 estar corrompido (ver 1.B); sha256 cru de hoje muda, como esperado |
| 4 | ec.europa.eu (edat_lfse_14) | 200 | 200 | sha256 de hoje bate exatamente com o da linha: `f6be7ba88ac3ebff…` |
| 5 | ec.europa.eu (tepsr_sp410) | 200 | 200 | sha256 de hoje bate com o que **a linha** afirma (`28a148a41e1f6a0a…`), não com o que o ficheiro guardado tem (ver 1.C); a fonte e a linha estão de acordo, o ficheiro do arquivo é que diverge |
| 6 | dre.pt (substituto do "304 registado") | 200 (a linha é uma primeira captura) | **304** | bate: os validadores da linha, usados hoje, confirmam sem transferir corpo |
| 7 | emprego.azores.gov.pt/estatisticas/ (ausência) | 403 | 403 | bate exatamente com a ausência registada (bloqueio Cloudflare "Just a moment...") |
| 8 | www.eleicoes.mai.gov.pt | 200 | 304 | bate: confirma sem alteração |
| 9 | www.dgterritorio.gov.pt | 200 | 304 | bate: confirma sem alteração |
| 10 | www.cfp.pt | 200 | 304 | bate: confirma sem alteração |
| 11 | dados.gov.pt | 200 | 200 | **não bate**: sha256 de hoje `23cfd41c3c82dd79…` contra o da linha `5f8b7d0143c9df63…`; 190429 bytes hoje contra 190430 na linha. É a mesma diferença de 1 byte que já se via dentro do próprio piloto, entre a corrida `18:11:31` (190430 bytes) e a `18:15:18` (190429 bytes, com `sha256_anterior` a apontar para a primeira): esta página parece ter sempre 1 byte instável (o HTML devolvido não é bit a bit reprodutível), o que não é um erro do corredor, é uma propriedade da fonte que o corredor já tinha detetado a tempo |
| 12 | www.iefp.pt (SIE dezembro 2024, .ods) | 200 | 304 | bate: confirma sem alteração |

Resultado: **11 dos 12 endereços comportaram-se como o índice fazia prever** (contando, para o INE, a previsão certa como o resumo estável, não o sha256 cru, que muda sempre por desenho). O único que não bateu, `dados.gov.pt`, tem uma explicação coerente com um padrão já visível dentro do próprio arquivo antes de eu pedir nada.

## 3 · A tabela do INE (3 endereços, resumo estável e sha256 de ontem)

Para os 3 endereços do INE da amostra (que são os mesmos da célula 2, aproveitados aqui):

| Endereço | Resumo estável de hoje | `sha256_comparacao` da linha | Bate | sha256 cru de hoje | Referência anterior usada | Diferente da referência |
|---|---|---|---|---|---|---|
| varcd 0014061 | `766d941eb03afda1d09f8f9e8b4878329accebe6749ceb58133725163407c757` | igual | sim | `7e6c626f3e56…` | sha256 da 1ª corrida (`e3f273b633e5…`, via `sha256_anterior` da 2ª) | sim |
| varcd 0012656 | `f367761d712402bed61f93f4e11e45d9d5ff424411ada71b049ac1ae1cafd70e` | igual | sim | `8efa7f000954…` | sha256 da 1ª corrida (`7da1854b30dd…`) | sim |
| varcd 0014580 (S7A2023) | `d81a90772bf65ae9b6592c14ed99ea5284e1469d8d317946d92666d359c6b3b4` | igual | sim | `ec9a1a1ddd4e…` | `ba859d084b9e…` (o valor do ficheiro órfão, via `sha256_anterior` da 2ª corrida; não o `ba859d084bfe…` que a linha 21 afirma) | sim |

Veredito da célula 3: nos 3 endereços, o corpo de hoje, depois de lhe tirar o carimbo `DataExtracao` pela mesma regra que a linha declara ("1 carimbo(s) do pedido tirado(s) antes de comparar"), dá exatamente o resumo estável que a linha já tinha; e os bytes crus de hoje dão sempre um sha256 diferente do de uma leitura anterior, confirmando a razão de ser do desenho (o INE carimba a hora do pedido dentro da resposta, por isso o sha256 cru nunca serve para detetar mudança real, só o resumo estável serve).

A regra do resumo estável não está escrita em lado nenhum que eu tenha lido: derivei-a por tentativa e erro contra os ficheiros do próprio arquivo (validada nas 10 linhas do INE com ficheiro guardado e `sha256_comparacao` preenchido, todas batendo) e confirmei que produz o mesmo resultado sobre o corpo pedido hoje na fonte: decodificar o JSON, remover a chave `DataExtracao` a qualquer profundidade, reserializar com chaves ordenadas e separadores compactos (`sort_keys=True, separators=(",", ":")`, sem escapar unicode) e aplicar sha256 ao texto resultante.

## 4 · A aritmética do índice

Agregados recalculados por corrida (agrupando pelo prefixo do id antes do primeiro "·"):

| Corrida | Linhas | http 304 | Bytes somados |
|---|---|---|---|
| `nota-i87` (retroativa, 30.08.2026) | 9 | 0 | 3 801 218 |
| `2026-09-01T18:11:25Z` | 7 | 0 | 3 162 109 |
| `2026-09-01T18:11:31Z` | 78 | 0 | 186 719 019 |
| `2026-09-01T18:15:18Z` | 55 | 0 | 5 360 381 |

Veredito da célula 4: não encontrei, em nenhuma das 149 linhas, uma linha de cabeçalho ou de resumo que afirme totais por corrida (linhas, 304 ou bytes) para eu reconciliar contra o que recalculei. Todas as linhas são capturas individuais (id no formato `<quando>·<url>` ou `nota-i87·<descrição>`); não há um tipo de linha de manifesto. Não há, por isso, alvo de reconciliação nesta célula, "se existirem" do brief não se verifica aqui; reporto os agregados recalculados pelo valor que têm.

Nota à parte, ligada à célula 4 por ser aritmética interna do índice mas não caber nas contagens por corrida: a corrida `18:15:18` repete exatamente os 55 endereços já vistos na `18:11:31` (é subconjunto estrito, confirmado por comparação de URLs); 43 desses 55 têm o mesmo sha256 nas duas corridas, e 12 têm sha256 diferente (11 do INE, mais o `dados.gov.pt` já discutido em 2.11). Dos 11 do INE, 10 têm `sha256_anterior` na segunda corrida a bater exatamente com o `sha256` da primeira; 1 (varcd 0014580, S7A2023) não bate, pela razão descrita em 1.B.

## 5 · Pedidos que falharam

Na corrida final (a que se reporta acima), nenhum dos 12 pedidos falhou. Na primeira tentativa, os 12 falharam por um problema do meu próprio ambiente (certificados TLS do Python local, ver a nota metodológica no topo), corrigido antes de reportar. Não houve nenhum 429 em nenhuma das fontes.

## 6 · Tempo

Pedidos da amostra feitos entre 2026-09-01T19:32:23Z e 2026-09-01T19:33:59Z (aprox.), INE em série com pausas de 2 segundos, as restantes fontes com pausas de 1 segundo. Trabalho total (leitura do brief, análise da cópia sem rede, escrita e correção do código, duas corridas de rede, este relatório): cerca de 55 minutos.
