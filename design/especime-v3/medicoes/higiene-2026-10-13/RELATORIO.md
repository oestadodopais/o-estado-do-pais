# Higiene de 13.10.2026: paragem nos portões iniciais

O bloco parou no §0 do mandato, antes de qualquer correção. A condição «têm de ser zero antes de começar; se não forem, para e diz» não foi cumprida. Nenhum ficheiro de código, dado, mapa ou relatório de uma passagem anterior foi alterado.

## Portões iniciais

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

## Questões

| Questões | Resultado |
|---|---|
| ER1-12 | Não iniciada, pela paragem obrigatória do §0. |
| EX1-11, EX1-12, EX1-13, EX1-14 | Não iniciadas, pela mesma condição. |
| RP4N-12, RP4N-13, RP4N-19, RP4N-20, RP4N-21, RP4N-22, RP4N-23 | Não iniciadas, pela mesma condição. |
| RP4N-24, RP4N-25, RP4N-26, RP4N-27 | Não iniciadas, pela mesma condição. |
| JD1-11, JD1-12, JD1-15, JD1-16, JD1-17 | Não iniciadas, pela mesma condição. |
| V1-39, V1-40 | Não iniciadas, pela mesma condição. |
| V1-41 | Não tocada; o mandato declara-a fechada pela M78. |
| JD1-9, RP4N-16 e caminhos antigos do motor (§2) | Varrimento e correções não iniciados. Nenhum ficheiro do motor tocado. |
| Atualização do mapa (§3) | Não iniciada. |

## Decisões e trabalho aberto

HIG-1: cumprir a paragem do §0 após a recusa inicial; não alterar a configuração, a ligação das dependências nem a cache partilhada para repetir a corrida nesta passagem.

Fica por preparar uma cache de construção com escrita dentro das raízes permitidas, preparar as caches de recortes do motor e um ambiente autorizado para as provas com servidores locais, voltar a medir os portões iniciais e, se todos passarem, executar os §§1 a 5. Não se pediram escaladas. A inspeção auxiliar dos processos por `ps` também foi recusada pela sandbox, com a mensagem exata `zsh:1: operation not permitted: ps`; não se tentou outra via para a executar. Não houve capturas, porque nenhuma página foi alterada e a construção inicial falhou. Não há portões finais de código alterado nem correções entregues.

## Cabeças e entrega

Cabeça inicial e de código do sítio: `445451896a74222a4c489b704ea9caf19039a270`.
Cabeça inicial, final e de código do motor: `2d69712b18404d2e45ebfe34e16f486fddd01ea6`.

A entrega documental é o commit que acrescenta este relatório e a pasta `antes/`, único commit desta passagem; a sua cabeça é comunicada na resposta final após confirmação do escrivão. Não há commits de correção.

A linha «tokens used» não foi exposta nesta sessão. Os pontos da semana são medidos pelo lançador.
