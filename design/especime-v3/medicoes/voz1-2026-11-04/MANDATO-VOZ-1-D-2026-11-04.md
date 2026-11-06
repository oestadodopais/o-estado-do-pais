# VOZ-1-D: as ligações do calendário com a grafia do menu, sem mudar o menu (04.11.2026)

Acrescenta: nada

*Uma passagem curta numa sessão nova, na worktree `lote4-2026-11-04` (ramo `lote4b-2026-11-04`). O bloco VOZ-1 tirou das páginas de leitor as frases em que o sítio fala de si; a adenda C ligou cada acontecimento do calendário (`/agenda`, `/en/agenda`) às páginas de leitor que ele atualiza, num passo depois do `astro build` (`scripts/calendario-paginas.mjs`). Lê o `MAPA-DO-REPOSITORIO-para-construtores.md` só no que toca a este guião e à `check:pais`.*

## §0 Medido por este lugar na cabeça cb634678c

- A corrida inteira deste lugar parou no `build`: `check:pais`, N1, "menu de oito errado em agenda/index.html" e em `en/agenda/index.html`.
- A causa é o commit cb634678c. Escreve a barra final em todas as ligações do calendário (`rota+'/'`) e reescreve as ligações do menu `#nav-principal` dessa página para a mesma grafia. O menu de `/agenda` ficou com `/uniao-europeia/`, e a N1 espera `/uniao-europeia`.
- O mandato desse commit dizia "com a barra final", e estava errado. O menu do sítio escreve umas portas com barra e outras sem barra:
  - pt: `/`, `/lugares/`, `/temas/`, `/estudos`, `/explicacoes`, `/o-que-se-discute/`, `/uniao-europeia`, `/sobre`;
  - en: `/en`, `/en/places/`, `/en/themes/`, `/en/studies`, `/en/explainers`, `/en/under-discussion/`, `/en/european-union`, `/en/about`.
- O que a L1 da `check:lugar` protege: a mesma página não pode aparecer com duas grafias entre o menu e o corpo.

## §1 O que fazes

1. O guião nunca muda o menu: o bloco que reescreve `#nav-principal` sai.
2. Uma ligação do calendário para uma página que está no menu escreve o endereço exatamente como o menu dessa página o escreve, lido do próprio `#nav-principal`, e não de uma lista escrita à mão.
3. As outras ligações escrevem o endereço como o guião o escrevia antes de cb634678c, sem acrescentar nem tirar a barra.
4. O resto de cb634678c fica: as páginas de entrada fora da lista e o estilo dos 44 px na folha de estilos.
5. Uma planta prova que uma ligação do calendário com a grafia trocada de uma porta do menu dá vermelho na L1. Outra prova que um menu mudado nessa página dá vermelho na N1.

## §2 Quando paras

Se a N1 ou a L1 só passarem mudando-as.

## §3 O fim

O `build` inteiro verde (a `check:pais` corre dentro dele), mais a `check:lugar`, a `check:alvos` e `tests/voz/agenda-voz1.mjs`, a 0, com os códigos lidos dos ficheiros. As ligações de `/agenda` e `/en/agenda` (menu e calendário), copiadas do `dist/`, vão no relatório. Um commit só com caminhos explícitos, com os trailers da casa (`Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`) e o assunto a começar por `VOZ-1`. Vinte e cinco minutos, trinta chamadas.
