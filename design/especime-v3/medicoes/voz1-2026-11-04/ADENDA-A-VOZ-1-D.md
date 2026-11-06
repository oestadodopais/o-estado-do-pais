# Adenda A à VOZ-1-D: acabar a passagem (04.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. Paraste no limite das trinta chamadas sem commit. As tuas duas mudanças (`scripts/calendario-paginas.mjs` e `tests/voz/agenda-voz1.mjs`) foram comitadas por este lugar tal como as deixaste, em 4ef63069f, porque o pré-voo recusa uma retoma sobre a árvore suja. Acabas por cima, num commit novo.*

## §0 Lido por este lugar no teu diff

- O guião está como o mandato pede: a grafia lida do `#nav-principal`, a reescrita do menu fora, as outras rotas como antes.
- Ficou por acabar:
  - a asserção da planta L1 no teste do calendário (a régua recusou, e o teste não reconheceu a mensagem);
  - o código final do `build`;
  - a `check:alvos`;
  - o commit.

## §1 O que fazes

1. Corriges a asserção do teste, lendo a mensagem que a `check:lugar` imprime de facto. A planta tem de continuar a provar que uma grafia trocada dá vermelho na L1 e que um menu mudado dá vermelho na N1.
2. Corres o `build` inteiro, a `check:lugar`, a `check:alvos` e `tests/voz/agenda-voz1.mjs`, com os códigos lidos dos ficheiros.
3. Fazes o commit que o mandato pede, por cima de 4ef63069f.

## §2 O fim

O mesmo do mandato. Vinte chamadas.
