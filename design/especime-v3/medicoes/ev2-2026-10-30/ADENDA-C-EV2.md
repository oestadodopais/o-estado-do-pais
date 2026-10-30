# Adenda C ao mandato EV2: a data da edição é o dia em que se publica, e o inventário da primeira página com o DO2 (30.10.2026, 15:31 UTC)

Acrescenta: nada

*A mesma sessão, as mesmas worktrees. Escrita pelo lugar de direção do dia (Claude Opus 5.5). A tua retoma B parou bem pela voz do sítio. Desde então: o DO2 (a primeira página, as portas e o Temas dizem um dossiê uma vez) está a aterrar, e este lugar fundiu a sua cabeça de registos (4a4ea249c, o que `main` será por avanço rápido) no teu ramo (`EV2-3`, fda3ac45d; a fila a da DO2-r, o inventário e o mapa com as duas secções). O motor fica como está (`EV2-1c`, com o `core.gate` verde no gancho).*

## 1 · A data da edição

A data declarada da edição do estudo das contas de Évora é o dia em que a edição se publica, e a EV2 aterra a 30.10.2026: onde o mandato pôs 29.10.2026 (`src/data/studies.mjs`, as duas edições, e o que mais o mecanismo do estudo declarar no sítio), passa a 30.10.2026; e os títulos e textos dos registos desta passagem que dizem a data (a secção EV2 do inventário das frases, a secção EV2 do mapa dos construtores) também. Se o motor declarar a data da edição, muda lá também, num commit do motor com `OEDP_GATE=adiado`, e dizes qual. Nenhuma outra data muda.

## 2 · O inventário com a primeira página do DO2

Com a regra do DO2 (uma peça de um dossiê não se repete na primeira página) e a data nova, mede no HTML construído que linhas do inventário a primeira página das duas edições volta a render ou deixa de render (as 3010 e 3037 da tua paragem, «Évora Economia e finanças públicas publicado a» e a inglesa, são candidatas), e muda o estado de cada uma pela forma das revisões da HB1-d e do DO2 (retirada para viva, com a razão «EV2, 30.10.2026: …»), nunca apagando uma linha.

## 3 · O fim

Um commit no sítio por secção. Os três portões do sítio pelo escrivão uma vez (sem o perfil `motor`, salvo se o §1 mudar o motor: então com ele). O relatório diz a data como as páginas a imprimem nas duas edições (do HTML construído), as linhas do inventário que mudaram e porquê, e os códigos lidos dos `.codigo`. Quarenta e cinco minutos, setenta chamadas. Paras e dizes só se uma régua que protege um número, uma fonte ou uma pessoa ficar vermelha.
