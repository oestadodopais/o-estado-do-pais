# Adenda H ao mandato VOZ-1: as réguas da marca «novo» num dia sem estudo novo (06.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree, sobre 0fb3ff664. A tua passagem G ficou certa; o `build` saiu a 1 por uma causa que não é dela e que pára qualquer construção a partir de hoje, a do GitHub incluída.*

## §0 Medido por este lugar

- `estudoNovo` (`src/lib/construcao.mjs:17`) dá a marca «novo» / «new» a um estudo publicado há 0 a 7 dias da construção. O único estudo com a marca no `dist/` de 05.11.2026 às 23:31 UTC era «A casa em Portugal e na Europa», publicado a 29.10.2026; no `dist/` de 06.11.2026 às 05:11 UTC nenhum a tem (0 em `index.html`).
- Duas réguas supõem que há sempre um estudo novo: a planta «marca novo retirada» (`tests/inicio/novidades.mjs:144`) remove um `[data-estudo-novo]` que não existe, e a `check:voz` dá «novo» e «new» como frases que se rendem. Por isso o `build` de 0fb3ff664 sai a 1, e sairia em qualquer cabeça construída a partir de hoje até sair um estudo novo.

## §1 O que fazes

1. A regra da FP1 fica: a marca aparece exatamente nos estudos com 0 a 7 dias. A planta passa a ter as duas formas, cada uma com a mensagem da régua: num dia com estudo novo, a marca retirada é recusada, como hoje; num dia sem estudo novo, uma marca posta num estudo que não é novo é recusada.
2. A entrada «novo» / «new» da régua da voz rende-se só quando há um estudo novo na data da construção; sem nenhum, a régua não a exige e diz porquê no seu registo.
3. Um teste com duas datas de construção simuladas (uma com um estudo novo, outra sem) prova as duas formas. Nenhuma régua que protege uma data enfraquece.

## §2 Quando paras

Se a régua da data da marca só puder passar enfraquecida (diz porquê).

## §3 O fim

O `build` inteiro verde nesta data; `check:datas`, `check:voz` e o teste das duas datas, com os códigos e as plantas. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1 H`. Vinte minutos, vinte e cinco chamadas.
