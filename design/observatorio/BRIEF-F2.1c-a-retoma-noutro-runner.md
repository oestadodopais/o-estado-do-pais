# Brief · F2.1c · a retoma noutro runner do anfitrião que não respondeu (08.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 08.09.2026, a partir da sonda de alcance ao INE (`.github/workflows/sonda-alcance.yml` do motor, corrida 34194889895, 06:29 UTC) e das noites de 05 e 06.09 do corredor. Bloco médio do motor, dentro do F2.1, depois de o F2.1b fundir. Constrói o Opus numa worktree própria; lê a frio o Codex com plantas antes da fusão; nenhum pedido à rede a partir do portátil. Sem travessões na prosa.*

## O que se mediu

A 08.09.2026 às 06:29 UTC, quatro runners do GitHub pediram ao mesmo tempo o mesmo endereço do INE com o nome da casa, três vezes cada, espaçadas de vinte segundos. Três runners (`20.29.188.148`, `172.185.55.180`, `40.116.73.182`) tiveram os três pedidos a 200 em 1,3 a 1,8 s, com a ligação TCP a abrir em 0,1 a 0,8 s nas portas 443 e 80. O quarto (`172.182.225.6`) não abriu a ligação TCP nenhuma das três vezes nem em nenhuma das duas portas (`curl` a sair com 28, `nc` com o tempo esgotado), e no mesmo minuto alcançou o anfitrião de controlo (`dados.gov.pt`, 307 em 0,23 s). O que falha é, portanto, o IP do runner e não a hora nem o caminho: o INE, ou algo à frente dele, deixa cair a ligação de alguns IPs dos runners. É o que as noites do corredor mostravam sem o dizer: a 03.09 o INE recusou o IP do runner; a 04 e a 07.09 respondeu aos onze endereços em menos de 4 s; a 05 e a 06.09 o primeiro endereço esperou 90 s pela ligação e o disjuntor poupou os outros dez. Um tempo esgotado na ligação TCP acontece antes de qualquer cabeçalho, pelo que a identidade do pedido não entra nisto.

## O que entra

1. **A retoma.** Quando a fase 1 de uma corrida do corredor acaba com anfitriões em `anfitrioes_sem_resposta`, a corrida ganha um segundo trabalho, num runner novo (um trabalho novo é um IP novo, não garantidamente diferente, mas sorteado outra vez), que corre o corredor só para esses anfitriões (`--so-anfitrioes`, o modo do F0.11), no mesmo modo da corrida. Se o segundo runner também não alcançar, um terceiro tenta uma última vez. O número de tentativas é uma constante do fluxo com a razão escrita (a sonda deu um em quatro).
2. **O que a retoma escreve.** Em `ensaio`, o seu relatório e o seu índice sobem como artefacto ao lado dos da corrida principal. Em `real`, escreve o que a corrida principal escreveria para esses anfitriões (as reconferências, o arquivo, o carimbo), e empurra, reutilizando os mesmos passos (uma ação composta ou um fluxo reutilizável, para que não haja duas cópias dos passos que divergem); a decisão do carimbo de 07.09 (`DECISIONS.md` §1.101 do sítio) continua a valer, e a retoma que alcança o anfitrião passa as suas linhas de `linhasSemResposta` para `linhas`.
3. **O que a corrida diz.** O relatório da corrida principal diz que houve retoma e o resultado dela pelo nome («parcial: o INE não respondeu ao runner 172.182.225.6; a retoma no runner X alcançou-o às HH:MM UTC», ou «a retoma também não alcançou, e o estado fica «sem resposta desde»»); a issue que o fluxo abre quando alguma coisa pára inclui a retoma.
4. **A contagem da semana (F2.1).** Uma noite em que a corrida principal ficou parcial e a retoma a completou conta como verde inteira; uma noite em que a retoma também falhou conta como verde parcial, com o estado escrito, que é o que o F2.1b já garante.
5. **Os provadores.** `indicators/provar_fluxo.py` ganha as conferências: o trabalho da retoma só existe quando a fase 1 declarou anfitriões calados (uma saída do trabalho principal lida do relatório, nunca escrita à mão); nunca corre `real` fora do `schedule`; o teto de tentativas; o artefacto da retoma com o nome da corrida. O chão sobe pelo número de conferências novas.
6. **A sonda** (`sonda-alcance.yml`) fica como está: é o instrumento de diagnóstico, à mão e com o motivo.

## As medidas de aceitação (escritas antes)

- Um `ensaio` no GitHub em que a fase 1 declara um anfitrião calado tem um segundo trabalho, e o relatório do segundo diz o IP do runner e o resultado; para o provar sem esperar por uma noite má, o fluxo aceita em `ensaio` uma caixa `simular_calado=<anfitrião>` que faz a corrida principal tratar esse anfitrião como calado sem lhe pedir (só em `ensaio`, recusada em `real`, com conferência no provador).
- Uma corrida sem anfitriões calados não tem o segundo trabalho (0 trabalhos a mais, medido numa corrida verde).
- A corrida inteira, com retoma, fica abaixo dos 20 minutos facturados.
- `python3 -m core.gate` a 0; o chão do fluxo subido; a leitura a frio do Codex com cinco plantas de três classes.
- Nenhum pedido à rede a partir do portátil; nenhum número no relatório sem o comando que o mediu.

## O que não entra

Escrever ao INE (é do diretor); um runner próprio ou um servidor com IP fixo (dinheiro, do diretor); a conferência do INE a partir do portátil (a alternativa, se a retoma não chegar, pelo modo do F0.11 que a DGAL já usa); qualquer mudança à política do §4 da frescura.
