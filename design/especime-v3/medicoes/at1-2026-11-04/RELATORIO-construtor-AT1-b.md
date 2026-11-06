Corrigido em `375be3010`:

- Completa regiões ausentes em todas as funções; recusa divergências ou `vercel.json` sem regiões.
- Recusa alterações à árvore, identificando os ficheiros.
- No lock, mudou apenas `engines.node` da raiz para `"22.x"`.

**12 testes AT1 verdes.** Suite geral: **26/27**, com a única falha em `ferramentas.py`: `listen EPERM: operation not permitted 127.0.0.1`.

`git revert` foi recusado pela sandbox. A inversão exata ficou registada em `10c2ca78c`, sem reescrever a história. A desativação de `main` foi reaplicada em **`0d6436c8b`, último commit**. Árvore limpa.

Não houve novo build nem envio. O ensaio real exige um `dist/` conferido da nova cabeça.

**10 chamadas; 2 corridas dirigidas; 0 builds e 0 portões integrais.**