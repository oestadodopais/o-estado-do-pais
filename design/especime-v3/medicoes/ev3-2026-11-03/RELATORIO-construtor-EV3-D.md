O build final continua vermelho (`build=1`). Parei no teto de 50 chamadas; a falha restante ainda não foi isolada.

Ficaram comitados:

- `620a0c118`: validação das marcas de língua.
- `7a3642525`: inventário das frases e faixas.
- `cc508e55b`: leitura de `documentary_rows` pela C1, mantendo caminho e SHA-256 conferidos.

As conferências isoladas de edições, voz, língua, selos e tipos passaram. As duas worktrees estão limpas. As frases do leitor foram preservadas.

Nesta retoma: **50 chamadas, 17 corridas avulsas de conferências e 3 builds completos**, todos vermelhos. Os 30 registos anteriores misturam verificações e geração; não permitem recuperar a contagem total com rigor.

Falta diagnosticar a falha no [registo do último build](<temporário>) e obter o build inteiro verde.