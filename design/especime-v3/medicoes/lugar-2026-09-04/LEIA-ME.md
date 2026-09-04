# Os guiões da medição do bloco F1.10

*Correm-se da raiz do repositório, sobre um `dist/` construído. Nenhum deles
escreve no sítio: só contam e imprimem.*

| guião | o que faz | como se corre |
|---|---|---|
| `palavras.mjs` | conta as palavras do vocabulário fechado **no texto da casa**, isto é fora de toda a origem declarada (`data-claim`, `data-linha-claim`, `data-verbatim`, `data-nonledger`, `data-agenda`, `data-registo*`, `data-lugar`, `data-nome`, `data-medida-*`) | `node design/especime-v3/medicoes/lugar-2026-09-04/palavras.mjs dist` |
| `contexto.mjs` | imprime, uma página por rota e por edição, os blocos de texto da casa onde uma dessas palavras morde. Salta os documentos alojados e as páginas de leitura, que o §3 do brief põe fora do bloco | `node design/especime-v3/medicoes/lugar-2026-09-04/contexto.mjs dist` |
| `visivel.mjs` | imprime as linhas de texto **visível** de uma página que casam com um termo, para separar o que o leitor lê do que só existe no HTML | `node design/especime-v3/medicoes/lugar-2026-09-04/visivel.mjs dist/municipios/evora/index.html munic` |
| `inventario.py` | o guião de uma vez que reclassificou as linhas do `INVENTARIO-FRASES.md` deste bloco. Fica como registo do que foi aplicado, e não se torna a correr | *(já correu; não se repete)* |

**Estes guiões não são a régua do bloco.** A régua (`check:lugar`, com as L1 a L6
e as plantas da L9) ficou por escrever quando o bloco parou; estes são as
medições de partida sobre o `dist/` de `306e4c68`, e servem para a comparar com o
depois.
