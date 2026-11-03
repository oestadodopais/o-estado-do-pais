# Adenda K ao mandato OG1-E: a extração da voz volta a ser a de antes da I, e a prova pela voz verdadeira fica rápida (03.11.2026)

Acrescenta: nada

*A sessão da OG1-E, a mesma worktree (o sítio `og1e-2026-11-02`, por cima de febf4e702). Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda J. A causa é deste lugar: a adenda I §2 pediu que a extração da voz tratasse a marca de língua «como as outras marcas», e isso mudou a extração de todas as páginas. As 1 238 frases retiradas foram declaradas contra a extração de antes, e a normalização da J só repõe as que têm aspas: as que têm um espaço antes de outra pontuação junto de uma marca (252 linhas; a 916, «Lei n.º 73/2013 : one», reproduzida pela leitura) continuam a escapar. A régua volta, por construção, a morder como mordia. Uma só passagem (a M99). Nenhuma frase do leitor muda.*

## §0 Medido (03.11.2026, por este lugar, no código)

- `textoDaVoz` em d04ec4740 (`git show d04ec4740:scripts/voz-edicoes.mjs`, linhas 28 a 39): junta todos os pedaços de texto com um espaço, `partes.join(' ')`, e salta `script` e `style`. É a extração contra a qual as retiradas foram declaradas.
- A I mudou `scripts/voz-edicoes.mjs` e `scripts/medir-defeitos.mjs` (`git diff --stat d04ec4740 875c35298 -- scripts/`: 2 ficheiros, 19 inserções, 28 remoções); a J mudou `voz-edicoes.mjs`, `titulos-publicados.mjs`, `medir-defeitos.mjs`, `voz.mjs`, `check-voz.mjs`, `package.json` e os testes.
- A prova pela voz verdadeira da J (`tests/edicoes/voz-integracao.mjs`, o passo `check:voz-retiradas`) corre a voz seis vezes, cerca de 600 s, em cada `verify`.

## §1 A extração de antes

`textoDaVoz` e os seus usos em `medir-defeitos.mjs` voltam a ser os de d04ec4740, palavra por palavra: todos os pedaços juntos com um espaço, entre marcas de língua e entre blocos. A normalização de `fraseRetiradaNoTexto` e de `ondeVolta` pode ficar (só alarga), mas a comparação exata vem primeiro, como na J. A declaração inglesa da entrada nova da habitação no inventário passa à forma que a extração de antes lê (com os espaços junto da marca de «pelo menos», como a H a declarou); a lista das retiradas não muda.

## §2 A prova pela voz verdadeira, rápida

`check:voz-retiradas` corre a voz verdadeira duas vezes, não seis: uma sobre o `dist/` como está (o código lido 0) e uma sobre uma cópia com todas as plantas ao mesmo tempo, cada uma na sua página (a definição retirada da DGAL na página inglesa de Abrantes, a entrada antiga da habitação em `/correcoes/` e em `/en/corrections/`, a linha 916 com o nome da lei dentro de uma marca de língua). Lê o código (1) e confere na medição que a própria voz escreve que cada planta aparece entre as retiradas que rendem. A prova das 1 238 retiradas em memória fica, com a extração de antes. O passo continua no `verify`.

## §3 O fim

Os commits por secção; o `build` inteiro pelo escrivão, verde, e `check:voz`, `check:voz-retiradas`, `check:registo`, `check:lingua` e o `typecheck` a 0, com os tempos de cada um no relatório. Trinta minutos, cinquenta chamadas. Paras e dizes: se uma página atual for recusada pela voz com a extração de antes (diz qual e porquê); se uma retirada deixar de morder.
