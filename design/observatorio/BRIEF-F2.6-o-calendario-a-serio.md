# Brief F2.6 · O calendário a sério (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5 no motor (`~/Instruments/ResearchHub`), a partir da linha F2.6 do `PLANO-fiabilidade-2026-09-02.md` §4 («a releitura dos calendários de difusão do INE e do Eurostat a ler datas reais (hoje lê 0); as 19 datas do inventário em `calendar.json`; o cron das 12:10 religado quando o calendário cobrir mais de metade dos 79 endereços») e do que o F0.8 deixou (`indicators/calendario.py`, `indicators/calendar.json` com 3 chaves e 0 eventos úteis, o cron das 12:10 comentado em `.github/workflows/corredor.yml`). Sem travessões na prosa.*

## 0 · O que este bloco é

A corrida do meio-dia do corredor pede só os endereços com difusão devida hoje mais os sem calendário; como o calendário não tem datas, pedia tudo, e ficou desligada. O bloco faz o calendário ler datas reais das duas fontes que o publicam (o INE e o Eurostat), põe as 19 datas que o inventário das fontes já registou, e deixa a corrida do meio-dia pronta a religar quando a cobertura passar de metade dos 79 endereços.

## 1 · A regra da rede, que manda no desenho

**Do portátil não se pede nada ao INE** (regra da casa desde 03.09). O Eurostat pode ser pedido do portátil **uma vez por bloco** para o calendário de difusão (a API de calendário do Eurostat, ou a página «Release calendar», lida e citada com o endereço e a data). **O INE lê-se no runner**, dentro de um `ensaio` do corredor (uma corrida despachada à mão com `motivo`), e o leitor do calendário do INE só corre lá: no portátil ele é testado com uma cópia guardada da página do calendário (uma captura de um `ensaio` anterior ou a que este bloco pedir num único `ensaio`), nunca com um pedido vivo. O leitor conta como um endereço do portão por anfitrião de `core/http.py`, com o nome da casa.

## 2 · O que entra

1. **`indicators/calendario.py` a ler datas reais**: do Eurostat, o calendário de difusão por conjunto de dados (os códigos que as linhas citam: `tipsgo10`, `tipslm10`, `tepsr_sp210`, `sdg_08_10`, `gov_10dd_edpt1`, `lfsi_emp_a`, `une_rt_a` e os outros do inventário); do INE, o calendário de difusão dos indicadores citados (os códigos `0012656`, `0012661` e os outros). Cada evento em `calendar.json` com: o endereço da linha a que se aplica, a data de difusão, a fonte do evento (o endereço do calendário lido) e a data da leitura.
2. **As 19 datas do inventário** (`design/observatorio/INVENTARIO-DAS-FONTES.md`, a coluna «próxima difusão») em `calendar.json`, com a origem «inventário de 01.09» até o leitor as substituir.
3. **A cobertura medida**: quantos dos 79 endereços com linha têm uma data no calendário; a corrida do meio-dia em `--so-devidas` num dia sem difusões a pedir 0 endereços (provado com uma data plantada no passado e uma no futuro).
4. **O cron das 12:10** fica comentado se a cobertura for menor do que 40 de 79, com a contagem escrita no comentário; se for maior ou igual, o construtor **não religa** (é o lugar de direção que decide, com o número no relatório).
5. **Um conhecido-positivo por leitor**: uma página de calendário plantada com uma data a menos e uma data trocada, vista pelo provador (`indicators/provas_test.py` ganha as células).
6. **Um `ensaio` no GitHub** para ler o INE a partir do runner (despachado pelo construtor com `gh workflow run corredor.yml -f modo=ensaio -f motivo="F2.6, o calendário do INE"`), com a lição do F0.8 respeitada: nunca mais de um ensaio por hora, e este bloco só pode despachar um.

## 3 · O que não entra

Nenhum pedido ao INE do portátil; nenhuma escrita nos ficheiros do motor que não se tocam (`indicators/*.json` das outras corridas além de `calendar.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`); nenhuma mudança ao modo `real`, a `CORREDOR_ARMADO` ou às chaves; nenhuma data escrita à mão sem origem.

## 4 · Onde se constrói

No motor: ramo `calendario-2026-09-04` numa worktree própria (`git worktree add ~/Instruments/ResearchHub-worktrees/calendario-2026-09-04 -b calendario-2026-09-04 master`). Ficheiros: `indicators/calendario.py`, `indicators/calendar.json`, `indicators/corredor.py` só onde o calendário entra, `indicators/provas_test.py`, `.github/workflows/corredor.yml` só no comentário do cron, `indicators/RELATORIO-calendario-2026-09-04.md`. Outro construtor corre em paralelo no motor (M1, o exportador): não lhe toques nos ficheiros.

## 5 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| C1 | `calendar.json` com n dos 79 endereços cobertos por uma data com origem, n dito (a meta do plano é 40) | script |
| C2 | as 19 datas do inventário presentes com a origem «inventário de 01.09» ou substituídas por uma data lida, dito qual | script |
| C3 | a corrida do meio-dia em `--so-devidas` num dia sem difusões a pedir 0 endereços; com uma data plantada para hoje, a pedir só esse | `python3 -m indicators.corredor --provar` com as células novas |
| C4 | o leitor do Eurostat provado contra a resposta viva (um pedido) e contra uma cópia guardada; o leitor do INE provado contra a cópia lida no `ensaio` | o provador |
| C5 | um `ensaio` verde no GitHub com o calendário do INE lido (a corrida citada), ou a razão de o INE ter recusado o runner | o relatório |
| C6 | `python3 -m core.gate` a 0; `indicators/provas_test.py` verde com as células novas | os portões |
| C7 | 0 datas sem origem no `calendar.json` | script |

## 6 · O que se entrega e a disciplina

O relatório com C1 a C7, o ramo empurrado com o gate verde e o `portao` do motor verde; não fundido. Commits pequenos em português sem travessões, `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; nunca `git add -A`; nunca um número que não foi medido. Estimativa: Opus, duas passagens, da ordem de 0,5 a 0,8 M símbolos (M).
