# Adenda A ao mandato VIG2: as designações com quebras de linha (07.11.2026)

Acrescenta: nada
Medidas: medidas-vig2-a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da primeira corrida real da vigilância com a VIG2 no `master` do motor (1c38c4a). A mesma sessão e as mesmas worktrees; o ramo do motor `vig2-2026-11-07` está no `master` aterrado.*

## §0 Medido (07.11.2026, por este lugar)

- A corrida real de 04:42 UTC, numa cópia dos dados da vigilância, recusou: «designações das partes divergem do índice, por omissão ou repetição». Repetida às 04:44 com o índice e as partes guardados no ponto da recusa: 5 132 entradas novas (5 096 declarações em 8 números do DAR, 31 iniciativas, 5 atos), quatro partes de 748, 2 456, 2 410 e 2 484 bytes.
- A causa: 3 das 36 designações (atos e iniciativas) têm quebras de linha ou espaços no fim do título, tal como a fonte as escreve (as iniciativas «Regulação e qualificação da atividade de angariação imobiliária e criação de Registo Nacional de Consultores Imobiliários», «Alargamento da rede pública de Educação Pré-Escolar» e «Recomenda ao Governo a concretização da ampliação do Hospital de Santo André, em Leiria»). A linha da designação parte-se em duas, e `resumo_partes`, que lê as partes linha a linha, não a reconhece. O índice de 12.10.2026 não tem nenhuma designação assim.
- A cópia do índice real no ponto da recusa está fora dos repositórios, só para ler: `_aterragens/vig2-indice-real-2026-11-07.json`, na pasta das aterragens ao lado das worktrees (sha256 a começar por 99a9f14c0bd32512).

## §1 O que fazes, no motor

1. No resumo, cada designação (o título de um ato ou de uma iniciativa) escreve-se com os espaços em branco juntos num só e sem espaços nas pontas, nos dois caminhos (uma parte e várias); o índice fica como a fonte o escreveu. A verificação das partes compara com a mesma forma.
2. As provas: uma acumulação com designações que têm `\n`, `\n\n` e espaços no fim passa a verificação e cada designação aparece numa linha só; uma dessas designações tirada de uma parte, vermelho; o índice de 12.10.2026, uma parte igual byte a byte à referência congelada (sem designações dessas, não muda); e o índice real do §0: `detalhes_resumo` sem recusa, com as partes e os bytes de cada uma no relatório, e cada uma das 36 designações exatamente uma vez.
3. `python3 -m vigilancia.tests` com o código.

## §2 Quando paras

Se a prova de 12.10 deixar de ser igual byte a byte; se o índice real só passar com uma designação omitida ou com um limite mais largo.

## §3 O fim

Os commits do motor pelo `comitar.sh` (com `OEDP_GATE=adiado`), com o assunto a começar por `VIG2 A`; o relatório no sítio, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`. Vinte e cinco minutos, quarenta chamadas.
