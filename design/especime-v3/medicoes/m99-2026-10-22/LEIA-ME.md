# M99 (22.10.2026): `conferir-tudo.sh`, a corrida inteira do `verify` sem parar

Construtor: Claude Opus 5.5 (`construtor`, `high`). Maquinaria: nada muda numa página.

## O que mudou

- `scripts/leituras/conferir-tudo.sh <worktree absoluta> <pasta nova> [--build|--sem-build]`: lê os passos de `scripts.verify` do `package.json` (recusa a 9 uma peça que não seja `npm run <script> [-- argumentos]`), toma a tranca da máquina como o `portoes.sh` (a mesma, `/tmp/oedp-construcao.lock`, com a caducidade dos quarenta minutos pelo `tranca.py`), recebe a lista privada do `check:privacidade` como o `portoes.sh`, com `--build` corre `npm run build` inteiro e guarda `00-build.code`, recusa a 9 um `dist/version.json` cujo `commit` não seja a cabeça (salvo `--sem-build`), e corre todos os passos sem parar: `NN-<passo>.code`, `NN-<passo>.log`, `resumo.json` (comando, código, segundos e as trinta últimas linhas de cada vermelho) e `resumo.md`. Sai 0 com todos verdes, 1 com algum vermelho, 9 numa recusa, 130 interrompido.
- `tests/leituras/ferramenta_conferir_tudo.sh`: três plantas numa worktree de brincar numa pasta temporária, com uma tranca temporária: `--build` dá 0, 1, 0 e a cauda do vermelho no resumo; um `dist/` de outra cabeça recusa a 9 sem correr passos; `--sem-build` aceita-o.
- Uma linha no mapa dos construtores (§5, os guiões comuns), a frase no `PROMPT-construtor-comum.md` e a M99 «escrita a 22.10.2026, ensaio 3/3» no registo.

## Os códigos (em `codigos/`, os valores em `medidas.json`, escrito por `medir.py`)

| Conferência | Código |
|---|---|
| ensaio de três plantas | `codigos/ensaio.code` |
| o ensaio contra uma cópia sem a recusa do `dist/` (conhecido-positivo) | `codigos/planta-sem-recusa.code` |
| o ensaio contra uma cópia que pára no primeiro vermelho (conhecido-positivo) | `codigos/planta-para-no-vermelho.code` |
| `npm run check:leituras` | `codigos/check-leituras.code` |
| `npm run typecheck` | `codigos/typecheck.code` |
| `conferir-mapa.py` | `codigos/conferir-mapa.code` |
| a corrida real com `--build` | `codigos/real.code`, e um `.code` por passo em `codigos/real/` |

A corrida real, sobre a cabeça `2635fc0e0` com o motor ao lado: o `resumo.md` está em `codigos/real/resumo.md` (51 passos, o `build` e os cinquenta do `verify`, nenhum vermelho, 1 953 s somados; o `build` 332 s, o `check:alvos` 264 s, o `check:palavras` 200 s). Os registos ficaram fora do repositório.

## O que ficou aberto

- M99-1: o `check:leituras` só descobre `tests/leituras/*.py`, por isso não corre este ensaio `.sh` nem o do `com-teto.sh`; um embrulho `.py` prendê-los-ia (fica para quando a maquinaria descongelar).
- M99-2: o Codex não corre o navegador dentro da sandbox (o prompt comum manda os portões pelo escrivão); `conferir-tudo.sh` não tem ainda um caminho pelo escrivão, e dentro da sandbox os passos com o navegador ficariam vermelhos.
