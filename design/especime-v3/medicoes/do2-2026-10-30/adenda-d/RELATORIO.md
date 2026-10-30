A construção final passou na cabeça `b0533f7fb497b6dc31910e21fbde1a3c7ce853d2`. As duas réguas alteradas e as capturas estão conferidas.

A E1 (`scripts/check-pais.mjs`) usa a seleção comum, conserva a ordem e a marca em curso, e não preenche lugares retirados por pertença a dossiês. As três plantas nas duas edições recusam o estudo do dossiê repetido, a retirada de um estudo avulso e a troca de ordem.

A prova de toque (`tests/discussao/toques.mjs`) deixou de pressupor um bloco da discussão na primeira página. Confere a presença esperada pela seleção e segue a entrada do dossiê até ao item. Quatro plantas no navegador recusam a presença indevida do bloco e a retirada da porta. A repetição conferiu 474 caminhos reais e 60 de 60 plantas das frases compostas.

A primeira tentativa dirigida deu 1 porque a seleção interrompia a A3 antes da queixa esperada pela planta. A correção mantém o erro e a recusa da declaração inválida. O primeiro perfil completo de conferências dirigidas deu 1 apenas em check:frases-compostas, pelo clique no título ausente. Ambos os resultados ficam preservados.

O perfil fechado `build` foi acrescentado ao escrivão para correr apenas o mesmo `npm run build` completo depois do commit da prova de toque. O perfil por omissão continua a executar build, verify e typecheck, com as guardas existentes.

Códigos lidos dos ficheiros `.codigo`, copiados em `codigos/`:

| Passo | Código |
| --- | --- |
| `pais-inicial` | 1 |
| `pais-corrigido` | 0 |
| `capturas` | 0 |
| `perfil-v2c__build` | 0 |
| `perfil-v2c__check-alvos` | 0 |
| `perfil-v2c__check-cabeca` | 0 |
| `perfil-v2c__check-css` | 0 |
| `perfil-v2c__check-discussao` | 0 |
| `perfil-v2c__check-frases-compostas` | 1 |
| `perfil-v2c__check-lugar` | 0 |
| `perfil-v2c__check-navegacao` | 0 |
| `perfil-v2c__check-primeira` | 0 |
| `perfil-v2c__gate-html` | 0 |
| `toques__check-frases-compostas` | 0 |
| `toques__check-primeira` | 0 |
| `build-final__build` | 0 |

Os comandos e as pastas estão em `relatorio.json`. O build final correu por `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/do2-d-build-final build`. O observador regista 26 passos internos, todos com código 0, em `passos-build.json`; a origem é `<temporario>/do2-d-build-final/tempos.json`.

As capturas correram pelo escrivão, sobre a mesma cabeça: dez páginas nas larguras 390, 768, 1024, 1280 e 1600, em português e inglês, com três recortes por página. Sem falhas, pedidos externos ou extravasamento horizontal. Inspecionados seis recortes de telefone e de 1280 px. Os quarenta PNG ficam locais pela regra de exclusão do repositório; o recibo é comitado.

O HTML construído confirma o dossiê uma vez, nas novidades, nas duas edições. A discussão e a integração final dos itens não se imprimem. Para perceber conserva a leitura da semana; Estudos recentes lista Évora 2027 e a habitação. As listas completas estão em `relatorio.json`.

Commits: `e41177e30` (E1), `2c584fea` (toques), `b0533f7f` (perfil build). Nenhuma frase nova do leitor.

Custo: 51 chamadas a functions.exec; 15 execuções principais de conferências e construção, incluindo as repetições; três conferências de sintaxe; uma corrida de capturas.
