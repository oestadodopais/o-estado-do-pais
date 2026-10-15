# Higiene de 13.10.2026: correções e provas

A primeira tentativa parou no §0 do mandato, antes de qualquer correção. A condição «têm de ser zero antes de começar; se não forem, para e diz» não foi cumprida. Nenhum ficheiro de código, dado, mapa ou relatório de uma passagem anterior foi alterado.

## Primeira paragem, 13.10.2026

A corrida inicial do sítio começou às 18:21:39 UTC e terminou às 18:21:47 UTC, pelas datas de `antes/sitio/build.inicio` e `antes/sitio/typecheck.fim`. Esta secção conserva o estado da primeira tentativa.

### Portões iniciais

As duas árvores estavam limpas antes das corridas. As cabeças e os últimos commits estão em `antes/estado-inicial.json`. O sítio correu por `sh scripts/leituras/portoes.sh <worktree> <temporario>` com `RESEARCHHUB_DIR=<motor>`. O motor correu na sua worktree por `sh <worktree>/scripts/leituras/curto.sh <temporario>/motor.log python3 -m core.gate`; o código de saída foi guardado imediatamente pelo processo chamador.

| Portão | Código lido do ficheiro | Prova |
|---|---:|---|
| Construção do sítio | 1 | `antes/sitio/build.codigo` |
| Conferência do sítio | 125 | `antes/sitio/verify.codigo` |
| Tipos do sítio | 0 | `antes/sitio/typecheck.codigo` |
| Portão do motor | 1 | `antes/motor/motor.codigo` |

A mensagem exata da recusa, com o caminho anonimizado pelo próprio invólucro dos portões, está em `antes/sitio/build.log:534`:

```text
EPERM: operation not permitted, unlink '<worktree>/node_modules/.vite/deps/_metadata.json'
```

O `node_modules` desta worktree é uma ligação simbólica para a pasta de dependências da árvore principal, fora das raízes com escrita da sandbox. O Vite tentou reotimizar as dependências e apagar a cache nesse destino. A conferência seguinte não correu, como confirma `antes/sitio/verify.log`:

```text
verify: não correu; o build não ficou verde e não pode pagar passos da união
```

O motor terminou com seis suites recusadas, registadas em `antes/motor/motor.log:257`: `core.http_test`, `publisher.export_site_rows_test`, `publisher.dominios_series_test`, `indicators.provas_test`, `indicators.refresh_rede_real_test` e `core.http_nome_test`. As cinco que tentam abrir servidores locais terminam em `PermissionError: [Errno 1] Operation not permitted`, no `socket.bind`. A suite da travessia passa sobre a cópia versionada, mas falha contra o sítio vivo: a escrita sai a 1 por falta das caches de recortes e não deixa registo de travessia. A mensagem de reparação está nas linhas 296 a 298; a preparação dessas caches fica por fazer. A árvore do motor continuou limpa no fim.

O invólucro `curto.sh` conservou o registo inteiro e devolveu o código do processo. O `portoes.sh` escreveu os três códigos e anonimizou os seus registos, apesar da construção recusada. Os caminhos do registo do motor foram anonimizados antes de entrar no repositório; `<python>` designa a biblioteca do intérprete.

## Retoma de 13.10.2026

A retoma parte da cabeça do sítio `3c8867b087a92736d40a10f73fb184fa78a1f479` e do motor `2d69712b18404d2e45ebfe34e16f486fddd01ea6`, ambas com a árvore limpa. O estado está em `antes-retoma/estado-inicial.json`. Os mesmos invólucros correram em pastas novas temporárias; os registos e códigos ficam em `antes-retoma/sitio/` e `antes-retoma/motor/`.

Os quatro códigos foram lidos dos ficheiros escritos após a saída dos processos:

| Portão | Código | Prova |
|---|---:|---|
| Construção do sítio | 0 | `antes-retoma/sitio/build.codigo` |
| Conferência do sítio | 1 | `antes-retoma/sitio/verify.codigo` |
| Tipos do sítio | 0 | `antes-retoma/sitio/typecheck.codigo` |
| Portão do motor | 0 | `antes-retoma/motor/motor.codigo` |

O sítio correu de `2026-10-13T18:41:53Z` a `2026-10-13T18:48:22Z`; o motor, de `2026-10-13T18:41:53Z` a `2026-10-13T18:51:51Z`. Estas datas são UTC e vêm dos ficheiros `.inicio` e `.fim`. O motor passou, incluindo as seis suites recusadas na primeira tentativa; `antes-retoma/motor/motor.log` termina em `GATE: PASS`. A árvore do motor permaneceu limpa.

O sítio terminou com `build=0`, `verify=1` e `typecheck=0`, lidos dos respetivos ficheiros `.codigo`. A construção passou, mas os controlos que abrem o Chromium foram recusados: `check:moldura`, `check:alvos`, `check:indice`, `check:cabeca`, `check:primeira`, `check:leituras`, `check:frases-compostas` e `check:incorporar`. O ensaio das capturas pertence ao `check:leituras`. A primeira mensagem fatal, em `antes-retoma/sitio/verify.log:38`, é:

```text
[pid=19376][err] [1013/194539.687815:FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS. bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.19376: Permission denied (1100)
```

A chamada também regista `browserType.launch: Target page, context or browser has been closed` e `Error: kill EPERM`. As suites do motor passaram com a rede ligada, mas o arranque do Chromium continuou recusado na comunicação por portas Mach. Nos registos, `<cache-do-navegador>` substitui a raiz da cache local do Playwright. Não se alteraram os testes, não se retirou nenhuma conferência e não se pediu escalada.

## Segunda retoma, 13.10.2026

O novo circuito foi `sh scripts/leituras/portoes-pelo-escrivao.sh design/especime-v3/medicoes/higiene-2026-10-13/antes-retoma-2 motor`. Os quatro ficheiros `build.codigo`, `verify.codigo`, `typecheck.codigo` e `motor.codigo` dessa pasta foram lidos e contêm zero. A cabeça do sítio era `2c40ea10e32bab1ba9a4f7fb98cad6b7797a7211`; a do motor era `2d69712b18404d2e45ebfe34e16f486fddd01ea6`. Só depois destes resultados começaram as correções.

## Questões

Os caminhos abreviados `medicoes/` pertencem a `design/especime-v3/`.

| Questão | Estado | Resultado e prova |
|---|---|---|
| ER1-12 | Corrigida | `medicoes/er1-2026-10-06/medir-c.mjs`: saiu a diferença vazia por construção; conferência em `er1.json`. |
| EX1-11 | Pendente pelo §4 | O excerto selado imprime o saldo homólogo de 2025, mas não existe a linha própria. Selar e exportar uma linha nova publicaria um número novo; não se inventou uma ausência na fonte. |
| EX1-12 | Corrigida | `src/data/explicacoes/dinheiro-do-estado-2026.mjs`: saiu a frase causal que juntava as transferências sem apoio suficiente; a passagem b declara que os excertos citados não explicam a diferença entre os totais. |
| EX1-13 | Corrigida | No mesmo ficheiro, saiu a indicação posicional e ficaram explícitos os perímetros das contas. |
| EX1-14 | Corrigida | No mesmo ficheiro, o ramo negativo diz défice com o saldo entre parênteses; `tests/explicacoes/explicacao.mjs` planta o duplo negativo nas duas línguas; `ex1.json`. |
| RP4N-12 | Corrigida | Briefs M4 e auditoria UX anonimizados; `medicoes/extrai_fontes.py` exige `RESEARCHHUB_DIR`. |
| RP4N-13 | Corrigida | `src/lib/livro.mjs` omite as marcas e declara os campos da proveniência por confirmar na descrição; `scripts/sem-marcadores.mjs` protege os dois metadados, com plantas. A referência ao marcador no título da página que o explica mantém-se. |
| RP4N-19 | Corrigida | `medicoes/rp4n-2026-10-06/privacidade-i.py` recolhe mensagens do controlo real. `rp4n-19.json`: dois controlos históricos e quatro mutações recusadas. |
| RP4N-20 | Corrigida | `design/especime-v3/INVENTARIO-FRASES.md`, C1e: rótulo e ausência de leitura na fonte incluídos, com o âmbito das cópias alojadas. |
| RP4N-21 | Corrigida | `src/data/figuras.mjs`, `OrigemDaDefinicao.astro` e `verbatim.mjs`: legendas distintas, transcritas dos três excertos. A conferência das famílias e as plantas protegem-nas. |
| RP4N-22 | Corrigida, medida e captada | `src/styles/linha.css` conserva as palavras do rótulo; `tests/explicacoes/frases-compostas.mjs` mede ambas as línguas e planta uma palavra partida; os recortes `entrega/penalizacao-legal-um-ano-antecipacao-2026-{pt,en}-{390,1280}-abrir-prova.png` mostram as palavras inteiras. |
| RP4N-23 a RP4N-27 | Corrigidas | Acertos datados em `medicoes/rp4n-2026-10-06/LEIA-ME.md`: custos e limites da atribuição, comando, carimbo real do inventário, dezassete ocorrências de recusa com repetições conservadas. |
| JD1-11 | Corrigida | Onze referências ainda revertidas foram restauradas e localizadas pela linha e pelo contexto do código atual; `jd1-ancoras.json`. Os registos `mapa-antes.log` e `mapa-depois.log` conservam também os avisos de referências antigas fora desta restauração. |
| JD1-12 | Corrigida | `medicoes/r4-2026-10-05/registar-leitura.mjs` documenta o âmbito único por omissão e a necessidade de declarar âmbitos distintos. |
| JD1-15 | Corrigida | `src/lib/frases-jd1.mjs`: a comparação tem verbo e a parcela deixa de repetir a definição. Os valores continuam por tokens. |
| JD1-16 | Corrigida | Gerador JD1, família publicada e auditoria usam a exclusão literal do INE em `jd1-ine-contas`. |
| JD1-17 | Já resolvida na cabeça recebida | `jd1-17.json` e `jd1-17-proveniencia.json` conferem o nome e o título documental em trinta recibos: vinte e seis de medidas publicadas mostram o rótulo da fonte; quatro de medidas derivadas não atribuem à fonte uma medida da casa. |
| V1-39 | Parcial | `medicoes/v1-2026-10-07/medir_v1d.py` lê os dois recibos gravados e os seus resumos criptográficos. O relatório e `d/novidade-dar.json` já não apresentam simulação como prova real. Nas duas corridas reais o DAR não teve novidades nem revisões; a aritmética do achado 7 fica por provar com uma corrida que as tenha. |
| V1-40 | Corrigida | `vigilancia/diario.py` rotula as três linhas de arrumação. Suite de vigilância: 66 testes passaram. |
| V1-41 | Conservada | Fechada pela M78, não tocada. |
| JD1-9, RP4N-16, §2 | Correções feitas; exclusões identificadas | Inventário de todos os ficheiros seguidos, alterações e ocorrências remanescentes nos JSON `motor-caminhos-*.json`. |
| Mapa, §3 | Atualizado | Secção datada com seis frases sobre os guiões e nota no cabeçalho. |

## Decisões

HIG-1: cumprir a paragem do §0 após a recusa inicial; não alterar a configuração, a ligação das dependências nem a cache partilhada para repetir a corrida nesta passagem.

HIG-2: retomar após as três correções do lançamento comunicadas pelo lugar de direção: `node_modules` instalado como pasta real na worktree, rede da sandbox ligada por `CODEX_REDE=1` e caches de recortes copiadas para o motor. A pasta real foi confirmada antes da corrida; a construção e o portão do motor passaram. As três falhas iniciais não se repetiram. HIG-1 conserva a decisão da primeira tentativa.

HIG-3: parar de novo no §0 pelo `verify=1`; a recusa do arranque do Chromium permanece, apesar de a construção passar. Não substituir as provas do navegador por provas mais fracas nem tentar contornar a sandbox.

HIG-4: retomar pelo escrivão, fora da sandbox, conforme a correção do lançamento; os quatro portões iniciais passaram. HIG-1 a HIG-3 conservam as decisões das tentativas anteriores.

HIG-5: deixar EX1-11 aberta pelo §4. O número homólogo existe no excerto, mas uma linha nova mudaria os números publicados; a ausência é da linha própria, não da fonte.

HIG-6: retirar a ligação causal das duas transferências e usar nas legendas dos ministérios os rótulos exatos dos excertos. Não foi acrescentada uma explicação financeira que a fonte não escreve.

HIG-7: conservar a distinção entre medidas publicadas e derivadas em JD1-17. A casa não atribui um nome na fonte às suas próprias divisões.

HIG-8: V1-39 lê as corridas reais. Os recibos finais têm zero iguais do DAR; o arquivo de resumos é diário, pelo que não prova dois resumos conservados separadamente.

HIG-9: no §2, os destinos executáveis passam a variáveis explícitas ou à raiz do repositório. Intérpretes portáveis, exemplos genéricos de teste e o padrão do próprio anonimizador são classificados, sem enfraquecer o detetor. Os ficheiros protegidos não são alterados.

HIG-10: o cliente do escrivão desistiu durante o hook do motor. Não se duplicou o pedido nem se alterou o lançador; aguardou-se o resultado já solicitado. A mensagem exata, apenas com a pasta anonimizada, foi `comitar: o escrivão deixou de bater há mais de trinta segundos; o pedido <temporario>/oedp-escrivao-98b11e0677b3/pedido-20261013T193732-47272.json fica sem resultado`. O pedido seguinte do mapa recebeu a mesma mensagem para `<temporario>/oedp-escrivao-917828af1260/pedido-20261013T193733-47313.json`. O código do cliente foi 3; não é o código do hook.

HIG-11: o primeiro hook do motor recusou `publisher.export_site_rows_test` por `KeyError: 'RESEARCHHUB_TRANSCRIPT'`. A variável passou a ser opcional na importação; sem transcrição, o extrator conserva a ausência de endereços resolvidos. A prova está em `motor-hook-tentativa-1.json`. A suite afetada passou na cópia versionada e na worktree desta passagem; a repetição do hook aceitou `759c22a7`. O hook da limpeza aceitou `6bd8b70a`. Ambos terminaram em `GATE: PASS`.

HIG-12: a primeira tentativa final em `depois/` terminou com construção 1, verificação 125, tipos 0 e motor 0, lidos dos ficheiros. A voz recusou `PALAVRA PROIBIDA «incluído em» em 2 página(s) da superfície.` pela expressão inglesa `included in`. A frase passou a `counted in`, sem alterar o apoio do INE nem os valores; a régua não foi alterada. As conferências isoladas dos cartões e das explicações passaram nesta construção. A repetição final usa uma pasta nova.

## Caminhos do motor

`motor-caminhos-antes.json` percorre 3 854 ficheiros seguidos e encontra 77 ficheiros. `motor-caminhos-alterados.json` lista cada ficheiro corrigido e a natureza do conteúdo anterior, sem copiar caminhos locais. `motor-execucao-caminhos.json` exercita doze destinos com a variável escolhida ou a raiz do repositório. A validação confirmou os valores numéricos dos dezanove JSON alterados e os treze ficheiros protegidos intactos.

`motor-caminhos-depois.json` conserva doze ocorrências classificadas, dez portáveis ou sintéticas e duas protegidas: o guião `sweeps/monthly.sh` e a cópia antiga de configuração do agente mensal em `sweeps/`, cujo identificador local foi anonimizado no inventário. Estas duas ficam para a direção.

## Cabeças e entrega

| Repositório | Cabeça de código conferida | Entrega |
|---|---|---|
| Sítio | `8797c798c33c9e86c55501cbcbf1b57e54cad49f` | Capturas b: `9113490aa029ce37840392cb355ce651715916a1`. Fecho: o commit que contém esta atualização do relatório; hash confirmado na resposta. |
| Motor | `b44454997a8230c8de7e1a9f481c17371da23773` | `b44454997a8230c8de7e1a9f481c17371da23773` |

As cabeças de início e fim dos portões são iguais. Os commits posteriores do sítio alteram guiões, medições, provas e o relatório; não alteram as páginas construídas. A lista anterior ao primeiro fecho está em `commits.json`. A lista abaixo acrescenta os commits da direção e desta retoma; o último commit guarda esta atualização do relatório.

### Commits do sítio

* `f2bb289e4563fd570fb0cbcef818c8f67c9cc54d`: Higiene ER1-12: retirar a diferença tautológica da medição.
* `7b17e59746f9ec17877656585386670e68d3bf85`: Higiene EX1: esclarecer as contas e corrigir o ramo do défice.
* `7d004ee895d1fed79b65c9fc09ca9f65c4a9fd06`: Higiene RP4N-12: retirar os caminhos locais dos briefs e do extrator.
* `34fa8cb81ecd0a3a693c0c3ad0218b3f2104ca09`: Higiene RP4N-19: medir as mensagens das exceções históricas.
* `04241e476526d77410f318fe1407bf360673bf7d`: Higiene RP4N-20: inventariar a ausência de leitura na fonte.
* `46bd27d3e661fb599460ca2a9c3d1c37119c1e46`: Higiene RP4N: corrigir metadados e distinguir as legendas seladas.
* `8b27c76a2974bb0ab4d6f300cd925e1e4068879b`: Higiene RP4N-22: conservar inteiro o rótulo da ligação da prova.
* `344cedae22235378f981c4cb7cc30a91865705a9`: Higiene RP4N: esclarecer a prova e os custos das passagens i e j.
* `4ed01654fe1c45812af061e0e61eb051e4cb754c`: Higiene JD1-11: restaurar e localizar as âncoras revertidas.
* `6ea12e913650dbba2e589692053350ad57f6c7cc`: Higiene JD1-12: documentar o âmbito comum das leituras.
* `3097d8b1621e6ef859c5407ce6b45ca3b047162c`: Higiene JD1: completar a comparação e explicitar a exclusão do perímetro.
* `a0ac17ca298f98fc8069a157d45ea04b39c8c8ae`: Higiene V1-39: ler as duas corridas reais nos recibos gravados.
* `060651485999eabe5692b0f212a9a0a57d4d2708`: Higiene: documentar o circuito do escrivão no mapa.
* `70b7106ef11aed033e1dfa72a700831838259378`: Higiene RP4N-13: conservar o tipo textual da descrição.
* `1e66663d51bb60c0fe022133a4cedfdd899d456d`: Higiene RP4N-22: medir palavras partidas na ligação da prova.
* `29c78ef3c6dd9e6097e893a5dc0307c67a5590bb`: Higiene RP4N-20: registar as cadeias em entradas do inventário.
* `04728a554e603ea843a93c113e2394806e7bdcdb`: Higiene: guardar a retoma verde e as provas das correções.
* `4fa9773756f2427a06b43e0c77e5c9271f040c0b`: Higiene RP4N-13: exigir o controlo limpo antes das plantas dos metadados.
* `ae368a7b8536143b0b20691488180c314d5888e3`: Higiene JD1: apontar as referências ao literal e conferir os títulos documentais.
* `c6f5954a7810eba771cb9446f447e4b223a76643`: Higiene JD1-16: ajustar a redação inglesa à régua da voz.
* `621e8accd61221e0c706a351283b181c33770d4e`: Higiene: conservar a primeira tentativa final e a correção da voz.

* `65d8a75ebc943a28b9fdc41cb557737818dd02fa`: Higiene: fechar relatório e provas dos portões finais.
* `ca0f790e29b108de3a853ae53586b03b7394a5cf`: O escrivão captura as páginas fora da sandbox a pedido do construtor (capturar-pelo-escrivao.sh, só o captar.mjs do repositório, sobre o dist da worktree): o navegador não arranca dentro dela, como a V2-a e a higiene mostraram.
* `c37c96f52ced18a828af251925573b91034363cb`: Os guiões do §0 dos briefs V2-a e V2-b medem a cabeça presa (869d8690) e não HEAD: no GitHub o portão dos briefs reexecuta-os, e as contagens do livro mudam quando o V2-a aterra.
* `a0bf2a9f99d349645292b61e3a60d10250d7ca53`: Higiene: guardar as capturas finais pelo escrivão.

* `80af5c2a17b421dae7e40f376efcd0a587fc96c4`: Higiene: fechar a retoma das capturas no relatório.
* `1d091fcb3bc4a3c0975c3eadafa1958b7860780d`: Higiene: a leitura a frio pelo Opus (cinco plantas em cinco; dois Major reais: a frase da ausência nos metadados, e o escrivão que deixava de bater durante um commit), o registo das plantas, o mandato da passagem de correção, e o escrivão a bater enquanto os hooks de um commit correm (provado com um hook de quarenta e cinco segundos).
* `792bdc78e641c94d76fabd1821a003dbb6ea1789`: Higiene b: declarar ausências e corrigir o alcance das provas.
* `8797c798c33c9e86c55501cbcbf1b57e54cad49f`: Higiene b: registar as provas preparatórias antes dos portões.
* `9113490aa029ce37840392cb355ce651715916a1`: Higiene b: guardar os portões verdes e as capturas finais.

### Commits do motor

* `759c22a7c532f7ac4d67f74d984c2db090e5b8e0`: Higiene V1-40: rotular as linhas de arrumação do resumo diário.
* `6bd8b70a8ec40909ea5bc415d730c798b8a2ebe3`: Higiene: retirar caminhos locais dos guiões e registos antigos do motor.

* `b44454997a8230c8de7e1a9f481c17371da23773`: Higiene b: repor o intérprete nas instruções do ambiente isolado.

## Portões da primeira entrega e capturas

| Portão | Código lido | Ficheiro |
|---|---:|---|
| build | 0 | `depois-2/build.codigo` |
| verify | 0 | `depois-2/verify.codigo` |
| typecheck | 0 | `depois-2/typecheck.codigo` |
| motor | 0 | `depois-2/motor.codigo` |

Corrida pedida por `sh scripts/leituras/portoes-pelo-escrivao.sh design/especime-v3/medicoes/higiene-2026-10-13/depois-2 motor`. Na primeira tentativa final, a tranca da worktree `v2a-2026-10-13`, tomada às 19:59:21 UTC, atrasou o início; não foi removida por esta passagem. Na segunda tentativa, a mesma worktree tomou novamente a tranca às 20:30:25 UTC. O escrivão manteve os pedidos em espera.

`livro-preservado.json` confirma os mesmos bytes dos 3 208 ficheiros do livro. Os portões exercitam as novas plantas; `rp4nj-final.json` liga a conferência do inventário ao carimbo da construção final.

Na tentativa anterior, o guião `scripts/leituras/captar.mjs` foi chamado com o pedido ligado à cabeça do código conferido, mas o Chromium foi recusado pela sandbox. Essa tentativa não produziu capturas visuais; a recusa fica conservada como história. O recibo da tentativa está em `design/especime-v3/capturas/higiene-2026-10-13/capturas.json`; a mensagem exata, com os caminhos anonimizados, inclui:

```text
[pid=14786][err] [1013/215627.309014:FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS. bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.14786: Permission denied (1100)
```

HIG-13: não substituir a captura pedida por uma imagem antiga nem contornar a sandbox. A medição da palavra inteira passou no navegador dos portões externos; a captura visual continua em falta e precisa de um caminho autorizado fora da sandbox.

### Retoma das capturas, 2026-10-13T21:12:41Z

HIG-14: usar o novo serviço `capturar-pelo-escrivao.sh`, disponibilizado pela direção, sobre o `dist/` já conferido. Não repetir os portões nem alterar páginas, dados ou código. HIG-13 conserva a decisão da tentativa recusada; a falta de capturas ficou resolvida nesta retoma.

Comando executado: `sh scripts/leituras/capturar-pelo-escrivao.sh design/especime-v3/capturas/higiene-2026-10-13/pedido-entrega.json design/especime-v3/capturas/higiene-2026-10-13/entrega`. O cliente devolveu zero; `entrega/capturas.codigo` guarda esse resultado e `entrega/capturas.json` tem `ok: true`, sem falhas, com a cabeça completa `621e8accd61221e0c706a351283b181c33770d4e`, igual à de `dist/version.json`.

Foram guardadas 70 capturas de página e 80 recortes: sete páginas, nas edições portuguesa e inglesa, a 390, 768, 1 024, 1 280 e 1 600 px. O pedido enumera os recibos de amortizações, juros de 2024 e 2025, ministério da Saúde, penalização legal e saldo natural, e a explicação do dinheiro do Estado. Cada imagem foi conferida pelo seu resumo criptográfico; todas as páginas responderam sem erros, pedidos externos ou transbordo horizontal. Foram lidos visualmente os quatro recortes da ligação à prova a 390 e 1 280 px, nas duas edições, e uma amostra dos recibos e da explicação. As palavras «Abrir na página 273» e «Open at page 273» aparecem inteiras.

As capturas foram comitadas primeiro, em `a0bf2a9f99d349645292b61e3a60d10250d7ca53`. Só depois se atualizou este relatório. Os códigos da última corrida foram novamente lidos de `depois-2/build.codigo`, `depois-2/verify.codigo`, `depois-2/typecheck.codigo` e `depois-2/motor.codigo`: todos zero. São os resultados já obtidos sobre as cabeças de código indicadas acima, não uma corrida nova sobre os commits de documentação e guiões.

## Ficheiros do motor corrigidos pelo §2

| Ficheiro | Conteúdo anterior corrigido |
|---|---|
| `BRIEF.md` | caminhos e identificadores locais em comentários ou registos |
| `NEXT.md` | caminhos e identificadores locais em comentários ou registos |
| `archive/2026-07-24 Portugal Knowledge Hub INDEX.md` | caminhos e identificadores locais em comentários ou registos |
| `content/01 Energy Water and Climate/Onde Está a Água — Technical Source/build_onde_payload.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/01 Energy Water and Climate/Onde Está a Água — Technical Source/make_onde.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/01 Energy Water and Climate/Onde Está a Água — Technical Source/make_onde_pt.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/01 Energy Water and Climate/Onde Está a Água — Technical Source/recovery/gap_A_desalination.md` | caminhos e identificadores locais em comentários ou registos |
| `content/01 Energy Water and Climate/Onde Está a Água — Technical Source/recovery/gap_C_irrigation_efficiency.md` | caminhos e identificadores locais em comentários ou registos |
| `content/01 Energy Water and Climate/Water Distribution Losses — Technical Source/build_payload.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/01 Energy Water and Climate/Water Distribution Losses — Technical Source/make_pt.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/01 Energy Water and Climate/Water Distribution Losses — Technical Source/reconcile.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/08 Évora Mandates/Technical Source/raw/workforce.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2015.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2016.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2017.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2018.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2019.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2021.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2022.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2023.json` | caminhos e identificadores locais em comentários ou registos |
| `content/09 Évora Pelouros/Technical Source/raw/areas_2025.json` | caminhos e identificadores locais em comentários ou registos |
| `content/11 Seguranca Social/LEITURA-CODEX-2026-09-01.md` | caminhos e identificadores locais em comentários ou registos |
| `content/12 Concelhos/BRIEF-P1-linhas-dos-308.md` | caminhos e identificadores locais em comentários ou registos |
| `content/12 Concelhos/BRIEF-P2-ilhas-e-releitura.md` | caminhos e identificadores locais em comentários ou registos |
| `content/13 Dominios/LEITURA-CODEX-2026-09-01.plantas.json` | caminhos e identificadores locais em comentários ou registos |
| `content/13 Dominios/medicao-sonnet-2026-09-01.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/13 Dominios/plantas-sonnet-2026-09-01.json` | caminhos e identificadores locais em comentários ou registos |
| `content/14 Évora 2027/Technical Source/fetch.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `content/14 Évora 2027/Technical Source/leituras-a-frio/2026-09-16-codex-leitura-e1-segunda.plantas.json` | caminhos e identificadores locais em comentários ou registos |
| `content/14 Évora 2027/Technical Source/leituras-a-frio/2026-09-16-codex-leitura-e1.plantas.json` | caminhos e identificadores locais em comentários ou registos |
| `content/15 Orcamento do Estado 2027/Technical Source/LEVANTAMENTO-das-fontes-2026-09-21.md` | caminhos e identificadores locais em comentários ou registos |
| `content/README.md` | caminhos e identificadores locais em comentários ou registos |
| `core/sweep.py` | caminhos e identificadores locais em comentários ou registos |
| `indicators/PILOTO-CORREDOR-2026-09-01.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/RELATORIO-calendario-2026-09-04.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/RELATORIO-calendario-b-2026-09-08.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/RELATORIO-calendario-comparar-2026-09-08.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/RELATORIO-conferencias-2026-09-03.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/RELATORIO-corredor-2026-09-03.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/RELATORIO-vigia-2026-09-08.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/coverage/register-candidates.json` | caminhos e identificadores locais em comentários ou registos |
| `indicators/coverage/work/checks/g3-sistemas-fisicos.json` | caminhos e identificadores locais em comentários ou registos |
| `indicators/coverage/work/desks/g3-sistemas-fisicos.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/coverage/work/desks/g4-territorio-pessoas.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/coverage/work/desks/g5-servicos.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/coverage/work/desks/g6-instituicoes-cultura.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/out/nomes-conferidos-2026-09-21/LEITURA-codex-2026-09-22.plantas.json` | caminhos e identificadores locais em comentários ou registos |
| `indicators/out/nomes-conferidos-2026-09-21/PROMPT-passagem-2.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/out/nomes-conferidos-2026-09-21/PROMPT-passagem-3.md` | caminhos e identificadores locais em comentários ou registos |
| `indicators/out/nomes-conferidos-2026-09-21/conferencia-cega/chave.json` | caminhos e identificadores locais em comentários ou registos |
| `indicators/out/nomes-conferidos-2026-09-21/varrimento.txt` | caminhos e identificadores locais em comentários ou registos |
| `indicators/out/rp1-2026-09-26/travessia.log` | caminhos e identificadores locais em comentários ou registos |
| `publisher/RELATORIO-nomes-2026-09-04.md` | caminhos e identificadores locais em comentários ou registos |
| `publisher/RELATORIO-portao-ci-2026-09-02.md` | caminhos e identificadores locais em comentários ou registos |
| `publisher/estimativa-b2-2026-08-23/blocks.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `publisher/estimativa-b2-2026-08-23/inventario.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `publisher/estimativa-b2-2026-08-23/record.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `publisher/fixtures/ORIGEM.md` | caminhos e identificadores locais em comentários ou registos |
| `publisher/mapa-2026-08-27/BRIEF-mapa-distritos.md` | caminhos e identificadores locais em comentários ou registos |
| `publisher/releitura_concelhos.py` | caminhos e identificadores locais em comentários ou registos |
| `publisher/verificacoes/2026-08-15-releitura-cega-evora/RELATORIO.md` | caminhos e identificadores locais em comentários ou registos |
| `publisher/verificacoes/2026-08-15-releitura-cega-evora/registo.json` | caminhos e identificadores locais em comentários ou registos |
| `publisher/verificacoes/2026-08-15-releitura-cega-evora/transcrever.py` | destino de execução por variável de ambiente ou relativo ao repositório |
| `publisher/voz-2026-08-24/BRIEF-S2-ferramenta.md` | caminhos e identificadores locais em comentários ou registos |
| `publisher/voz-2026-08-24/inventario-cego-REPORT.md` | caminhos e identificadores locais em comentários ou registos |
| `requirements.lock.txt` | caminhos e identificadores locais em comentários ou registos |
| `publisher/RELATORIO-leitor-2026-09-07.md` | nome do anfitrião num registo antigo |

## Localizadores das correções

| Questão | Ficheiro e linha |
|---|---|
| ER1-12 | `design/especime-v3/medicoes/er1-2026-10-06/medir-c.mjs:36` |
| EX1-12 | `src/data/explicacoes/dinheiro-do-estado-2026.mjs:178` |
| EX1-13 | `src/data/explicacoes/dinheiro-do-estado-2026.mjs:237` |
| EX1-14 | `src/data/explicacoes/dinheiro-do-estado-2026.mjs:233` |
| RP4N-12 | `design/especime-v3/medicoes/extrai_fontes.py:32` |
| RP4N-13 | `src/lib/livro.mjs:109` |
| RP4N-19 | `design/especime-v3/medicoes/rp4n-2026-10-06/privacidade-i.py:32` |
| RP4N-20 | `design/especime-v3/INVENTARIO-FRASES.md:4320` |
| RP4N-21 | `src/data/figuras.mjs:2701` |
| RP4N-22 | `src/styles/linha.css:88` |
| RP4N-23 | `design/especime-v3/medicoes/rp4n-2026-10-06/LEIA-ME.md:2547` |
| RP4N-24 | `design/especime-v3/medicoes/rp4n-2026-10-06/LEIA-ME.md:2549` |
| RP4N-25 | `design/especime-v3/medicoes/rp4n-2026-10-06/LEIA-ME.md:2551` |
| RP4N-26 | `design/especime-v3/medicoes/rp4n-2026-10-06/LEIA-ME.md:2553` |
| RP4N-27 | `design/especime-v3/medicoes/rp4n-2026-10-06/LEIA-ME.md:2573` |
| JD1-11 | `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:442` |
| JD1-12 | `design/especime-v3/medicoes/r4-2026-10-05/registar-leitura.mjs:3` |
| JD1-15 | `src/lib/frases-jd1.mjs:17` |
| JD1-16 | `design/especime-v3/medicoes/jd1-2026-10-06/familias.mjs:30` |
| JD1-17 | `src/lib/o-que-e-o-numero.mjs:215` |
| V1-39 | `design/especime-v3/medicoes/v1-2026-10-07/medir_v1d.py:191` |
| V1-40 | `motor/vigilancia/diario.py:126` |
| Mapa, §3 | `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:760` |

## A passagem de correção

A leitura a frio e o mandato b foram recebidos em `1d091fcb`. Os achados 1, 2, 3, 4 e 7 eram plantas nas cópias do pacote e não foram tratados como defeitos do ramo. A contagem da primeira entrega continua em 70 capturas de página, conferida em `entrega/capturas.json`.

HIG-15, achado 5: os dois metadados dizem «Campos da proveniência por confirmar na fonte» ou «Provenance fields unconfirmed at the source» quando a linha tem esses campos. O comentário datado voltou. O portão de HTML usa uma régua independente do compositor; quatro plantas retiram a oração, uma por campo e língua, e são recusadas. A prova está na conferência final e em `b/metadados.json`; as capturas do saldo natural estão em `entrega-b/`.

HIG-16, achado 8: V1-39 fica parcial na tabela e na secção «A aritmética do achado 7» da V1-d. As duas corridas reais não tiveram novidades nem revisões do DAR. Não se afirma que contagens nulas provam a aritmética de uma corrida com alterações.

HIG-17, achado 9: saiu a frase circular sobre a conta por ministério. A descrição selada da conta funcional e o cabeçalho selado do MAPA 4 não reconciliam os dois totais. O glossário do relatório da execução descreve as classificações funcional e orgânica, mas não explica esta comparação dos totais. A página declara a ausência limitada aos excertos citados, nas duas línguas; a auditoria conserva os literais e identifica essa leitura. Não se inventou uma causa para a parte das Finanças, nem se alterou qualquer número.

HIG-18, achados 6 e 10: as instruções do motor usam `python3 -m venv .venv` e `.venv/bin/python -m pip`. Só os comentários mudaram, não os pinos de versões. O commit `b44454997a8230c8de7e1a9f481c17371da23773` passou pelo `comitar.sh` corrigido: código 0, 569,256 segundos medidos desde a chamada até à resposta do cliente. O cliente aguardou o hook até ao resultado, sem sair com 3; a saída e a duração estão em `b/motor-commit.json`.

HIG-19, achado 11: as capturas finais incluem também `custo-do-stock-da-divida-direta-2025` e `juros-das-administracoes-publicas-pib-2025`. O pedido `pedido-entrega-b.json` enumera nove páginas nas duas edições; o escrivão captou as cinco larguras, incluindo 390 e 1 280 px, sobre a cabeça `8797c798c33c9e86c55501cbcbf1b57e54cad49f`. O recibo em `entrega-b/capturas.json` confirma 90 capturas de página e 100 recortes, sem falhas. Foram conferidos os resumos criptográficos dos 190 PNG e a ausência de transbordo horizontal nas páginas. Foram lidos visualmente os recortes dos dois recibos acrescentados, do saldo natural e da explicação, em português a 390 px e em inglês a 1 280 px. As capturas antigas ficam como história da primeira entrega.

HIG-20: a primeira chamada dos portões da passagem b devolveu 9: `portoes: árvore suja; registe as mudanças antes de conferir a cabeça do código`. O relatório e as provas preparatórias estavam por comitar. Nenhum dos quatro portões correu e nenhum código individual foi escrito em `depois-b/`. As mudanças foram registadas e o pedido foi repetido em `depois-b-2/`; `b/portoes-tentativa-1.json` conserva a recusa. A tranca de outra corrida foi observada, mas não prova que este pedido tenha esperado por ela.

### Ficheiros e linhas dos achados

| Achado | Localizador |
|---|---|
| 5 | `src/lib/livro.mjs:97` |
| 5, régua | `tests/cartao/metadados.mjs:4` |
| 5, plantas | `tests/cartao/rp4n.mjs:321` |
| 6 | `design/especime-v3/medicoes/higiene-2026-10-13/b/motor-commit.json:2` |
| 8 | `design/especime-v3/medicoes/v1-2026-10-07/LEIA-ME.md:162` |
| 9 | `src/data/explicacoes/dinheiro-do-estado-2026.mjs:176` |
| 9, auditoria | `tests/cartao/leituras-provadas.json:16167` |
| 10 | `motor/requirements.lock.txt:16` |
| 11, `custo-do-stock-da-divida-direta-2025` | `design/especime-v3/capturas/higiene-2026-10-13/pedido-entrega-b.json:86` |
| 11, `juros-das-administracoes-publicas-pib-2025` | `design/especime-v3/capturas/higiene-2026-10-13/pedido-entrega-b.json:97` |

### Portões da passagem b

Comando: `sh scripts/leituras/portoes-pelo-escrivao.sh design/especime-v3/medicoes/higiene-2026-10-13/depois-b-2 motor`. Cabeças de início e fim iguais às de código na tabela de entrega. Os códigos foram lidos dos ficheiros:

| Portão | Código | Prova |
|---|---:|---|
| build | 0 | `depois-b-2/build.codigo` |
| verify | 0 | `depois-b-2/verify.codigo` |
| typecheck | 0 | `depois-b-2/typecheck.codigo` |
| motor | 0 | `depois-b-2/motor.codigo` |

`b/livro.json` confirma que não há ficheiros do livro alterados desde a cabeça conferida da primeira entrega. Os testes isolados de tipos e da auditoria constam de `b/`; o resultado completo é o dos portões finais. O commit das capturas precede este fecho do relatório. As cabeças e a lista acima distinguem o código conferido dos commits de provas.

## Trabalho aberto

* EX1-11: selar e publicar o saldo homólogo exige um número novo, fora do §4 desta passagem.
* Os dois ficheiros protegidos em `sweeps/`, identificados em `motor-caminhos-depois.json`, ficam para a direção.
* A aritmética do achado 7 da V1 precisa de uma corrida com novidades ou revisões do DAR. A V1-39 fica parcial.

A linha «tokens used» não foi exposta nesta sessão. Os pontos da semana são medidos pelo lançador.
