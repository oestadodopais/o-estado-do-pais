# Adenda C ao mandato MET1: duas réguas que ainda escreviam o Método antigo (06.11.2026)

Acrescenta: nada

*A mesma sessão, agora na worktree do lote 5 (`lote5c-2026-11-06`), sobre 7c5d95c80: os commits da AT1, da MET1 e da EV3-p rebaseados sobre `main` a3fe1863e, o lote 4 aterrado. A corrida inteira deste lugar sobre a cabeça anterior (63 passos) deu três vermelhos; um já está corrigido em `main`, os outros dois são da MET1 e corrigem-se aqui.*

## §0 Medido por este lugar (na corrida inteira de 06.11.2026, 09:03 a 09:54 UTC, e no `dist/` dela)

- `check:indice-do-sitio` sai a 1, com 36 de 40 plantas: a I7 (`tests/indice/indice.mjs:219`) exige que a redireção de `/a-verificar` seja 308 para `/metodo` exatamente, e a de `/en/to-verify` para `/en/method`; a MET1 mudou as duas em `vercel.json` para `/metodo#marcas` e `/en/method#marcas`. As quatro plantas que não morderam falharam só por arrastamento da I7.
- A âncora `marcas` existe no Método construído nas duas edições: é a secção das marcas, onde se explica a marca 'por confirmar na fonte' / 'to be confirmed at the source'. A redireção nova é a certa para o leitor e fica.
- `check:incorporar` sai a 1: a planta do Método em `tests/incorporar/conferir.mjs:220` procura no `#livro-razao` a porta para `/divida-publica-2025`, que a adenda B trocou; `porta` fica indefinida e `porta.remove()` lança. A régua (`conferirExemploNoMetodo`, `scripts/incorporar-do-portao.mjs:92`) já tem a linha nova, escrita à mão no seu corpo.
- `check:explicacoes` saiu a 1 por 'version.json ausente' na construção pequena de `scripts/medir-defeitos.mjs`: é a causa que a adenda J da VOZ-1 corrigiu em `main` (f0bfd5e4e), que esta cabeça já traz. Aqui só se corre.

## §1 O que fazes

1. A I7 muda de forma, conservando o que protege: a redireção de cada endereço retirado continua permanente (308) e para o Método da sua edição; o destino pode levar uma âncora, e então essa âncora tem de ser um `id` do Método construído nessa mesma edição. Plantas: a redireção retirada (a de hoje, que continua a morder) e uma âncora que não existe no Método (nova). As 40 plantas mordem.
2. A linha do recibo de exemplo do Método escreve-se num só lugar, exportado do módulo da régua, e a planta do `check:incorporar` tira a porta dessa linha lida daí, nas duas edições, com a mesma mensagem. Nenhum teste escreve o identificador da linha de exemplo à mão.
3. Procuras por guião, em `tests/` e `scripts/`, outras réguas ou plantas que ainda escrevam `divida-publica-2025` como o exemplo do Método, ou `/metodo` e `/en/method` como destino exato de uma redireção, e dizes no relatório o que encontraste, com o comando e a contagem, e o que fizeste a cada uma.
4. Nenhuma régua que protege um número, uma fonte ou uma pessoa muda.

## §2 Quando paras

Se a I7 só puder passar enfraquecida (diz porquê).

## §3 O fim

O `build` inteiro verde; `check:indice-do-sitio` (40 de 40 plantas), `check:incorporar` e `check:explicacoes`, com os códigos; a contagem do §1.3. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `MET1 C`. Quinze minutos, vinte chamadas.
