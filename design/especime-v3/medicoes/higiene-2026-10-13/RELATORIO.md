# Higiene de 13.10.2026: paragens nos portões iniciais

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

## Questões

| Questões | Resultado |
|---|---|
| ER1-12 | Não iniciada; ambas as tentativas pararam no §0. |
| EX1-11, EX1-12, EX1-13, EX1-14 | Não iniciadas; a retoma também não cumpriu o §0. |
| RP4N-12, RP4N-13, RP4N-19, RP4N-20, RP4N-21, RP4N-22, RP4N-23 | Não iniciadas; a retoma também não cumpriu o §0. |
| RP4N-24, RP4N-25, RP4N-26, RP4N-27 | Não iniciadas; a retoma também não cumpriu o §0. |
| JD1-11, JD1-12, JD1-15, JD1-16, JD1-17 | Não iniciadas; a retoma também não cumpriu o §0. |
| V1-39, V1-40 | Não iniciadas; a retoma também não cumpriu o §0. |
| V1-41 | Não tocada; o mandato declara-a fechada pela M78. |
| JD1-9, RP4N-16 e caminhos antigos do motor (§2) | Varrimento e correções não iniciados. Nenhum ficheiro do motor tocado. |
| Atualização do mapa (§3) | Não iniciada; a retoma também não cumpriu o §0. |

## Decisões e trabalho aberto

HIG-1: cumprir a paragem do §0 após a recusa inicial; não alterar a configuração, a ligação das dependências nem a cache partilhada para repetir a corrida nesta passagem.

HIG-2: retomar após as três correções do lançamento comunicadas pelo lugar de direção: `node_modules` instalado como pasta real na worktree, rede da sandbox ligada por `CODEX_REDE=1` e caches de recortes copiadas para o motor. A pasta real foi confirmada antes da corrida; a construção e o portão do motor passaram. As três falhas iniciais não se repetiram. HIG-1 conserva a decisão da primeira tentativa.

HIG-3: parar de novo no §0 pelo `verify=1`; a recusa do arranque do Chromium permanece, apesar de a construção passar. Não substituir as provas do navegador por provas mais fracas nem tentar contornar a sandbox.

Fica por disponibilizar um lançamento em que o Chromium possa arrancar, repetir o §0 e executar os §§1 a 5 se os quatro portões passarem. Nenhuma página foi alterada e não houve capturas de entrega. Nenhum ficheiro do motor foi tocado pelo §2. A recusa auxiliar da primeira tentativa foi `zsh:1: operation not permitted: ps`; esse comando não foi repetido na retoma.

## Cabeças e entrega

| Repositório | Cabeça de código conferida na retoma | Mudanças desta passagem |
|---|---|---|
| Sítio | `718ce94b463c9063faff35980888541edd1c0180` | Apenas este relatório e os registos em `antes-retoma/`. |
| Motor | `2d69712b18404d2e45ebfe34e16f486fddd01ea6` | Nenhuma. |

Commits: `5e3776c2` regista a primeira paragem; `718ce94b`, do lugar de direção, altera os lançadores antes da retoma. O commit desta entrega acrescenta os registos da segunda tentativa e atualiza este relatório; a sua cabeça final é comunicada na resposta após confirmação do escrivão. Não há commits de correção das questões.

A linha «tokens used» não foi exposta nesta sessão. Os pontos da semana são medidos pelo lançador.
