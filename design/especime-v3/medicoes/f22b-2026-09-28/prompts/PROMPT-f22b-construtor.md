És o construtor do bloco F2.2b do projeto O Estado do País (um sítio Astro em `~/Instruments/OEstadoDoPais` e um motor em Python em `~/Instruments/ResearchHub`): **as corridas prontas a armar**, a peça entre a semana de ensaio verde (F2.1) e as chaves e o interruptor do diretor (F2.2) no plano da fiabilidade. Trabalhas na worktree do motor `<worktree do motor>` (o ramo `f22b-2026-09-28` sobre a cabeça do motor do C1, que aterra antes dele) e, para os documentos e o relatório, na worktree do sítio `<worktree do sítio>` (o ramo `f22b-2026-09-28` sobre a cabeça do sítio do C1, que aterra antes dele). Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Prosa nova em português (Acordo Ortográfico), sem travessões. **Nenhum ficheiro que escrevas leva um caminho da máquina nem o nome do utilizador da máquina.** Usa `git -C <worktree>` e caminhos absolutos, sem `cd` para outras árvores.

## O teste de aceitação, dito antes

O do §1 do brief `design/observatorio/BRIEF-F22b-as-corridas-prontas-a-armar.md` (no sítio), à letra.

## O que lês primeiro, por esta ordem

1. No sítio: `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`; o brief, inteiro (o §0 foi medido por `design/observatorio/medidas/BRIEF-F22b.py`, que corres para o reproduzir); `DECISIONS.md` §1.134; `design/observatorio/PLANO-fiabilidade-2026-09-02.md` §4; `design/observatorio/FRESCURA-E-AUTOMACAO.md`; `design/observatorio/BRIEF-F2.1c-a-retoma-noutro-runner.md`; `design/especime-v3/ISSUES.md` (a I115, a I116 e a I152); `.github/workflows/portao.yml`.
2. No motor: `.github/workflows/corredor.yml`, `vigia.yml`, `sonda-alcance.yml` e `portao.yml`; `.github/actions/corredor-preparar/action.yml` e `corredor-retomar/action.yml`; `indicators/refresh.py` (o cabeçalho inteiro, `set_site`, os códigos de saída, `append_verification`, `check_por_commitar`); `indicators/corredor.py` (a parte do sítio e do arquivo); `sweeps/monthly.sh` e `sweeps/decisoes.py`; `core/gate.py` e o que ele corre.

## O mandato

A tabela do §2 do brief, ponto por ponto. Três avisos: não crias, lês nem escreves segredos (referem-se só pelo nome, e o diretor põe-nos); não pões nenhum interruptor a `sim` nem despachas corridas reais; e as corridas novas têm de poder ser provadas sem as chaves (os ensaios e as plantas correm localmente, com dublês do GitHub onde a corrida pede a API), porque as chaves só existem depois.

## As regras de trabalho

- A regra de paragem: só um portão que protege um número, uma fonte ou uma pessoa te faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta que morde. Se ao medir achares que o brief está errado num ponto, medes, dizes e paras nesse ponto, e fazes os outros.
- Commits pequenos por caminhos explícitos; no motor o trailer `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>`, e o pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio); no sítio os trailers contíguos `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_01B4Zx94pG7dxxQNpoEn1bjP`.
- Uma construção de cada vez na máquina: outro construtor pode estar a correr portões noutra worktree do sítio; antes de uma corrida inteira do sítio confirma com `pgrep -fl "astro build|npm run verify"` e espera.
- Os ficheiros do motor que não se tocam continuam a não se tocar: `indicators/*.json` na raiz, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/` salvo `sweeps/decisoes.py` e `sweeps/monthly.sh` (que o mandato muda), `publisher/recortes/manifest.regioes.json`.
- Escreves o relatório também quando paras a meio. A tua última mensagem desta sessão vai para fora do ramo; a tua resposta curta vai em `design/especime-v3/medicoes/f22b-2026-09-28/RESPOSTA-construtor-f22b.md` no sítio, sem caminhos da máquina, e entra no último commit. Um relatório nunca afirma comunicações com o diretor.

## No fim

Respondes com as cabeças finais dos dois ramos, os commits, o caminho do relatório, as saídas dos portões lidas dos ficheiros e o que ficou por fazer.
