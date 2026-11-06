# A leitura a frio do lote 7 (a HIG-5 A e B), 06.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 36 chamadas pelo harness (30 pela contagem do leitor), 604 s, sobre o pacote `pacote-lote7-2026-11-06` (base b50d32c02, cabeça 777d906a1). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado do leitor |
|---|---|---|
| H1 | a aterragem só reconstrói o `dist/` sem commit, e envia o de outra cabeça | 1 |
| H2 | a janela da régua das frequências a oito períodos | 5 |
| H3 | «semanalmente» fora da lista | 4 |
| H4 | o pré-mandato a deixar passar contagens de três algarismos | 3 |
| H5 | «à conferência automática» de volta no bloco do selo de um recibo | 2 |

Cinco em cinco. Um achado real Major, o 6: a conferência das contagens do §0 deixa passar uma contagem no fim de uma frase («4321.»), os grupos com ponto («1.234») e os decimais com ponto; corrige-se antes de aterrar, na adenda C, com o 7 (o espaço inquebrável) e o 8 (as formas de frequência que faltam e as três ligadas ao período errado), que são da mesma família. O 10 conferiu-se: o SHA fixado do `upload-artifact` é o da etiqueta `v7.0.1` (a API do GitHub, 06.11.2026). Os outros vão para a lista da higiene: o 9 (o nome `aterragens_do_dia` conta as anteriores), o 11 (números dos relatórios sem comando), o 12 (a `check:fontes` confere três pedaços e não a frase inteira), o 13 (no recibo, «Sem resposta a …» e «Releitura tentada a …» contam a mesma tentativa duas vezes) e o 14 (as vírgulas decimais portuguesas nas páginas inglesas, a mesma classe do Minor 60).

## O relatório do leitor (condensado)

**Blocking:** nenhum; o pacote está completo para o bloco.

**Major.**
1. A correção do `dist/` na aterragem difere entre o diff e o ficheiro copiado: o diff tem `if commit is None:`, o ficheiro tem `if commit != self.cabeca:`; com o diff, um `dist/` de outra cabeça nunca se reconstrói, e o teste da própria passagem falharia. (planta H1)
2. Um recibo construído ainda imprime a frase antiga no bloco do selo («Sem resposta a 01.09.2026 · à conferência automática»), contra o mandato B, a contagem do construtor e a `check:fontes` verde. (planta H5)
3. O limiar do §0 no diff deixa passar as contagens de três algarismos (`< 4` no diff, `< 3` no ficheiro). (planta H4)
4. A lista das palavras de frequência no diff não tem «semanalmente». (planta H3)
5. A janela da régua das frequências no diff é de oito períodos, não quatro. (planta H2)
6. No ficheiro copiado, uma contagem no fim de uma frase escapa à conferência do §0, como escapam os números com ponto: «prova o limite em 4321.» passa sem `Medidas:`; «São 1 234.», «1.234 linhas», «12.5 por cento» e «1.234,5» também não devolvem número nenhum. O fim de uma alínea é onde uma contagem do §0 costuma estar, e nenhum teste o prova.

**Minor.**
7. Um espaço inquebrável dentro de uma contagem dá um fragmento («1 234» lido como «234»).
8. A lista de frequências apanha as formas do mandato mas não as vizinhas («mensalmente», «anualmente», «trimestralmente», «quinzenalmente», «semestralmente», «cada semana», «todos os meses», «each week», «every month», «todos os dias» com espaços inquebráveis); «semi-annual» e «half-yearly» ligam a 365 em vez de 182, e «bi‑weekly» com U+2011 a 7 (as ligações erradas falham a vermelho).
9. `aterragens_do_dia` conta as aterragens anteriores, e não esta; o nome não o diz.
10. A etiqueta `# v7.0.1` ao lado do SHA do `upload-artifact` não se prova no pacote.
11. Os números dos relatórios do construtor sem comando; «8 por edição» não se reproduz no pacote, que traz dois dos quatro recibos.
12. A `check:fontes` confere o rótulo, a data e o qualificador em separado, sem a ordem nem o separador nem a ausência da forma antiga no mesmo bloco.
13. Como editor: em «O que foi conferido», «Sem resposta a 01.09.2026 · na conferência automática» e logo a seguir «Releitura tentada a 01.09.2026, sem valor lido · conferência automática do ficheiro da fonte» contam a mesma tentativa duas vezes; e a data com «a» diz um dia de há dois meses, não se a fonte responde hoje (inferido).
14. A edição inglesa imprime vírgulas decimais portuguesas na prosa inglesa («0,8237 factor», «8,2 %»), fora do diff.

**O que está bem:** fora das quatro linhas plantadas, cada linha mudada do diff é igual à do ficheiro copiado; a aterragem lê a fila da cabeça com `fila.ler_fila` antes de publicar o ramo e na retoma, com as duas provas; o `preparar` corre antes do envio pré-construído; o limite diário já não recusa; a conferência do §0 corre antes da saída de `Acrescenta: nada` e recusa o que o mandato diz; a régua das frequências empurra sempre o intervalo até à construção e liga a palavra ao período; a planta no ponto de chamada corre a fatia verdadeira do portão; as frases do mandato B estão palavra por palavra e a cópia da régua continua independente; o `check:metodo-construido` está no `verify`; nenhuma régua que proteja um número, uma fonte ou uma pessoa ficou mais fraca.
