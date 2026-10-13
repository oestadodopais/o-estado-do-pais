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

A retoma parte da cabeça do sítio `718ce94b463c9063faff35980888541edd1c0180` e do motor `2d69712b18404d2e45ebfe34e16f486fddd01ea6`, ambas com a árvore limpa. O estado está em `antes-retoma/estado-inicial.json`. Os mesmos invólucros correram em pastas novas temporárias; os registos e códigos ficam em `antes-retoma/sitio/` e `antes-retoma/motor/`.

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

O novo circuito foi `sh scripts/leituras/portoes-pelo-escrivao.sh design/especime-v3/medicoes/higiene-2026-10-13/antes-retoma-2 motor`. Os quatro ficheiros `build.codigo`, `verify.codigo`, `typecheck.codigo` e `motor.codigo` dessa pasta foram lidos e contêm zero. A cabeça do sítio era `b59ce222aeeecfb8d72e6d6e5db5bd91f574f27c`; a do motor era `2d69712b18404d2e45ebfe34e16f486fddd01ea6`. Só depois destes resultados começaram as correções.

## Questões

Os caminhos abreviados `medicoes/` pertencem a `design/especime-v3/`.

| Questão | Estado | Resultado e prova |
|---|---|---|
| ER1-12 | Corrigida | `medicoes/er1-2026-10-06/medir-c.mjs`: saiu a diferença vazia por construção; conferência em `er1.json`. |
| EX1-11 | Pendente pelo §4 | O excerto selado imprime o saldo homólogo de 2025, mas não existe a linha própria. Selar e exportar uma linha nova publicaria um número novo; não se inventou uma ausência na fonte. |
| EX1-12 | Corrigida | `src/data/explicacoes/dinheiro-do-estado-2026.mjs`: saiu a frase causal que juntava as transferências sem apoio suficiente. |
| EX1-13 | Corrigida | No mesmo ficheiro, saiu a indicação posicional e ficaram explícitos os perímetros das contas. |
| EX1-14 | Corrigida | No mesmo ficheiro, o ramo negativo diz défice com o saldo entre parênteses; `tests/explicacoes/explicacao.mjs` planta o duplo negativo nas duas línguas; `ex1.json`. |
| RP4N-12 | Corrigida | Briefs M4 e auditoria UX anonimizados; `medicoes/extrai_fontes.py` exige `RESEARCHHUB_DIR`. |
| RP4N-13 | Corrigida | `src/lib/livro.mjs` omite campos por confirmar na descrição; `scripts/sem-marcadores.mjs` protege os dois metadados, com plantas. A referência ao marcador no título da página que o explica mantém-se. |
| RP4N-19 | Corrigida | `medicoes/rp4n-2026-10-06/privacidade-i.py` recolhe mensagens do controlo real. `rp4n-19.json`: dois controlos históricos e quatro mutações recusadas. |
| RP4N-20 | Corrigida | `design/especime-v3/INVENTARIO-FRASES.md`, C1e: rótulo e ausência de leitura na fonte incluídos, com o âmbito das cópias alojadas. |
| RP4N-21 | Corrigida | `src/data/figuras.mjs`, `OrigemDaDefinicao.astro` e `verbatim.mjs`: legendas distintas, transcritas dos três excertos. A conferência das famílias e as plantas protegem-nas. |
| RP4N-22 | Correção feita, prova visual por concluir | `src/styles/linha.css` conserva as palavras do rótulo; `tests/explicacoes/frases-compostas.mjs` mede ambas as línguas e planta uma palavra partida. |
| RP4N-23 a RP4N-27 | Corrigidas | Acertos datados em `medicoes/rp4n-2026-10-06/LEIA-ME.md`: custos e limites da atribuição, comando, carimbo real do inventário, dezassete ocorrências de recusa com repetições conservadas. |
| JD1-11 | Corrigida | Onze referências ainda revertidas foram restauradas e localizadas pela linha e pelo contexto do código atual; `jd1-ancoras.json`. Os registos `mapa-antes.log` e `mapa-depois.log` conservam também os avisos de referências antigas fora desta restauração. |
| JD1-12 | Corrigida | `medicoes/r4-2026-10-05/registar-leitura.mjs` documenta o âmbito único por omissão e a necessidade de declarar âmbitos distintos. |
| JD1-15 | Corrigida | `src/lib/frases-jd1.mjs`: a comparação tem verbo e a parcela deixa de repetir a definição. Os valores continuam por tokens. |
| JD1-16 | Corrigida | Gerador JD1, família publicada e auditoria usam a exclusão literal do INE em `jd1-ine-contas`. |
| JD1-17 | Já resolvida na cabeça recebida | `jd1-17.json` confere trinta recibos: vinte e seis de medidas publicadas mostram o rótulo da fonte; quatro de medidas derivadas não atribuem à fonte uma medida da casa. |
| V1-39 | Corrigida | `medicoes/v1-2026-10-07/medir_v1d.py` lê os dois recibos gravados e os seus resumos criptográficos. O relatório e `d/novidade-dar.json` já não apresentam simulação como prova real. |
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

HIG-11: o primeiro hook do motor recusou `publisher.export_site_rows_test` por `KeyError: 'RESEARCHHUB_TRANSCRIPT'`. A variável passou a ser opcional na importação; sem transcrição, o extrator conserva a ausência de endereços resolvidos. A prova está em `motor-hook-tentativa-1.json`.

HIG-12: a primeira tentativa final em `depois/` terminou com construção 1, verificação 125, tipos 0 e motor 0, lidos dos ficheiros. A voz recusou `PALAVRA PROIBIDA «incluído em» em 2 página(s) da superfície.` pela expressão inglesa `included in`. A frase passou a `counted in`, sem alterar o apoio do INE nem os valores; a régua não foi alterada. As conferências isoladas dos cartões e das explicações passaram nesta construção. A repetição final usa uma pasta nova.

## Caminhos do motor

`motor-caminhos-antes.json` percorre 3 854 ficheiros seguidos e encontra 77 ficheiros. `motor-caminhos-alterados.json` lista cada ficheiro corrigido e a natureza do conteúdo anterior, sem copiar caminhos locais. `motor-execucao-caminhos.json` exercita doze destinos com a variável escolhida ou a raiz do repositório. A validação confirmou os valores numéricos dos dezanove JSON alterados e os treze ficheiros protegidos intactos.

`motor-caminhos-depois.json` conserva doze ocorrências classificadas, dez portáveis ou sintéticas e duas protegidas: o guião `sweeps/monthly.sh` e a cópia antiga de configuração do agente mensal em `sweeps/`, cujo identificador local foi anonimizado no inventário. Estas duas ficam para a direção.

## Cabeças e entrega

Os commits de código e as provas finais serão registados após a conclusão dos pedidos do escrivão e dos portões finais. A conferência de entrada não é apresentada como conferência das alterações.

## Trabalho aberto

EX1-11 depende da autorização para publicar a linha homóloga. Faltam concluir os portões finais e tentar as capturas pelo guião do projeto. As falhas do lançamento das duas primeiras tentativas ficam conservadas acima; a recusa auxiliar inicial foi `zsh:1: operation not permitted: ps` e não se repetiu esse comando.

A linha «tokens used» não foi exposta nesta sessão. Os pontos da semana são medidos pelo lançador.
