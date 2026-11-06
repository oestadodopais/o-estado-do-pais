# Adenda A ao mandato VOZ-1: os cinco vermelhos da corrida inteira (03.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. A VOZ-1 ficou bem no que mediste (o marcador 34 → 0, as frases da classe 31 → 0, as ledes 30 → 28). A corrida inteira deste lugar em 52ef4b642 (`lote4-conferir-2026-11-04-b`, 63 passos) deu cinco vermelhos, fora das conferências que correste. Os cinco vêm da mesma mudança: a página `/a-verificar/` saiu, e a agenda deixou de imprimir o critério e o histórico. Uma só passagem, que os resolve todos (a M99).*

## §0 Os cinco, lidos dos registos da corrida

1. **`check:voz-retiradas`** (110 s): `AssertionError` em `assert(lei?.texto.includes('Lei n.º 73/2013 : one'))`. Uma conferência da extração histórica espera um texto que a mudança do marcador ou da agenda alterou. Diagnosticas qual página e que texto.
2. **`check:mortos`:** em `scripts/gate-html.mjs`, `MOTIVO_SEM_DATA_RENDIDO` (:3472), `camposDoCriterio` (:3416) e `camposDaEntrada` (:3431) ficaram declaradas e sem uso, porque a agenda deixou de imprimir o critério e a entrada.
3. **`check:indice`, I6** ("o marcador com um destino só"): na edição pt o marcador aponta para `/metodo` e a página dele é `/a-verificar`; na en, `/en/method` e `/en/to-verify`.
4. **`design:feixe`:** "falta `dist/a-verificar/index.html`".
5. **`check:indice-do-sitio`, I7:** um destino repetido no corpo do índice (`/metodo`, `/en/method`). As cinco plantas da régua não morderam porque o estado de partida já estava vermelho.

## §1 O que fazes

1. Corriges a causa de cada um, e nunca afrouxas uma régua que protege um número, uma fonte ou uma pessoa.
2. As réguas que encodam a mobília do marcador e da página que saiu (a I6, o `design:feixe`, a I7 se for o caso) mudam de forma com a mudança. A ausência exata "por confirmar na fonte" tem um destino só, o Método. A página que saiu deixa de ser esperada e deixa de estar no índice e no mapa do sítio, e o seu endereço redirige. Cada uma dessas réguas fica com uma planta que mostra que ainda morde.
3. O código sem uso sai, ou volta a ser usado, se ainda proteger alguma coisa (diz qual).
4. A extração histórica da voz-retiradas: se o texto que ela espera mudou por esta mudança, a conferência passa a esperar o texto novo, conferido no `dist/`. Se uma frase retirada voltou, a causa é a frase e não a conferência.

## §2 Quando paras

Se uma das cinco só passar enfraquecendo uma régua que protege um número, uma fonte ou uma pessoa (diz qual).

## §3 O fim

- O `build` inteiro verde.
- As cinco conferências a 0, com os códigos lidos dos ficheiros, e as plantas da I7 a morder.
- As outras conferências que a passagem tocar.
- Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`.
- Quarenta minutos, sessenta chamadas.
