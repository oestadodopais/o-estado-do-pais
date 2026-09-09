# Os guiões da medição do bloco F1.10

*Correm-se da raiz do repositório, sobre um `dist/` construído. Nenhum deles
escreve no sítio: só contam e imprimem.*

| guião | o que faz | como se corre |
|---|---|---|
| `palavras.mjs` | conta as palavras do vocabulário fechado **no texto da casa**, isto é fora de toda a origem declarada (`data-claim`, `data-linha-claim`, `data-verbatim`, `data-nonledger`, `data-agenda`, `data-registo*`, `data-lugar`, `data-nome`, `data-medida-*`) | `node design/especime-v3/medicoes/lugar-2026-09-04/palavras.mjs dist` |
| `contexto.mjs` | imprime, uma página por rota e por edição, os blocos de texto da casa onde uma dessas palavras morde. Salta os documentos alojados e as páginas de leitura, que o §3 do brief põe fora do bloco | `node design/especime-v3/medicoes/lugar-2026-09-04/contexto.mjs dist` |
| `visivel.mjs` | imprime as linhas de texto **visível** de uma página que casam com um termo, para separar o que o leitor lê do que só existe no HTML | `node design/especime-v3/medicoes/lugar-2026-09-04/visivel.mjs dist/municipios/evora/index.html munic` |
| `primeiro-ecra.mjs` | mede o PRIMEIRO ECRÃ a 390 × 664 nas quatro páginas do leitor que o item 8.11 nomeia, nas duas edições: os caracteres de prosa da casa, os blocos, a prosa com os cartões e o texto todo do ecrã. A definição da conta está no cabeçalho do ficheiro, para que o «antes» e o «depois» sejam a mesma conta. Abre navegador, e por isso não está no `verify` nem na CI | `node design/especime-v3/medicoes/lugar-2026-09-04/primeiro-ecra.mjs --json antes.json` |
| `l1-composicao.mjs` | a COMPOSIÇÃO da L1, por padrão: quantas páginas de cada família têm dois destinos iguais, e que par de portas os repete. Entrou a 09.09.2026 com a emenda ao §5 do brief, que manda medir a composição antes de tocar em qualquer padrão | `node design/especime-v3/medicoes/lugar-2026-09-04/l1-composicao.mjs dist` |
| `plantas.mjs` | as plantas da L9 **por forma e não por marcador** (Major 12 da leitura a frio de 09.09.2026): sete estragos que põem no `dist/` conteúdo proibido escrito de maneira diferente daquela que a régua conhecia, e conferem que ela morde e que o ficheiro volta byte a byte | `node design/especime-v3/medicoes/lugar-2026-09-04/plantas.mjs` |
| `inventario.py` | o guião de uma vez que reclassificou as linhas do `INVENTARIO-FRASES.md` deste bloco. Fica como registo do que foi aplicado, e não se torna a correr | *(já correu; não se repete)* |

**Estes guiões não são a régua do bloco.** A régua é o `check:lugar`, que corre
no `verify` desde 08.09.2026 com as L1 a L6, as medidas do §8 e as plantas da L9;
os quatro primeiros guiões desta tabela são as medições de partida sobre o
`dist/` de `306e4c68`, e servem para a comparar com o depois.

**O `primeiro-ecra.mjs` é de outra família:** não é uma medição de partida, é a
régua da medida do item 8.11, e corre-se antes e depois do item. O «antes» está
em `primeiro-ecra-antes.json`, medido a 08.09.2026 sobre o `dist/` da cabeça em
que o 8.4 entrou, e ele diz uma coisa que vale a pena ler antes de tocar no item:
a prosa da casa no primeiro ecrã das quatro páginas já está entre 0 e 33
caracteres. O que ocupa o ecrã é a mobília do cabeçalho.
