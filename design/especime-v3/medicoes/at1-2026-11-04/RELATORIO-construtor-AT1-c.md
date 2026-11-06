Corrigido em `6896e8a00`:

- Copia a ligação da árvore principal e apaga o ambiente antigo antes da rede.
- Recusa ligação ausente ou identidade diferente após o `pull`.
- Exige `--archive=tgz` na aterragem e no novo guião de ensaio.

Passaram 16 testes locais e 7 da aterragem. Suite: **26/27 verdes**; única falha: servidor local bloqueado pela sandbox (`listen EPERM`).

Inversão isolada em `3e0415366`; `"main": false` reaplicado em `37eda334e`, último commit. Árvore limpa.

Sem rede, build ou envio real. **16 chamadas; 3 corridas de conferências; 0 portões.**