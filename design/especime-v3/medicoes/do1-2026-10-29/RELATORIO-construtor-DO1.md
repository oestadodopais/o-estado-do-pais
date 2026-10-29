A implementação está comitada, mas a validação integral ficou incompleta.

Commits: `cd5f5f778` e `caca34e3b`. Worktree limpa.

O leitor passa a ter os dois dossiês e o índice, nas duas línguas, com ligações nas peças, nas novidades, nas portas de assunto e em Temas. Os resumos têm selos locais iguais nas duas superfícies: [HTML lado a lado](<caminho>).

Os códigos lidos dos ficheiros `.codigo` foram:

| Comando ou conferência | Código |
|---|---:|
| Portões pelo escrivão: `build` | 1 |
| Portões pelo escrivão: `verify` | 125, não executado |
| Portões pelo escrivão: `typecheck` | 0 |
| `check:datas`, após correção, e typecheck | 0 |
| HTML, discussão, voz, língua, palavras, CSS, índice e L1 | 0 |
| Inventário, novidades, dossiês e prova dos selos | 0 |

O `build` parou porque `check:datas` não reconhecia as datas dos estudos nas novas rotas. Corrigi essa associação dentro da adenda B; a conferência dirigida passou com 16 plantas recusadas. Não repeti os três portões.

Contagens medidas:

| Medida | Antes | Depois |
|---|---:|---:|
| Ligações no corpo do índice, por edição | 441 | 444 |
| Declarações do inventário | 2 419 | 2 478 |
| Frases distintas declaradas | 1 230 | 1 289 |
| Páginas contadas pela L1 | 3 456 | 3 458 |

As ambiguidades ficaram assim resolvidas:

- **DO1-1:** a abertura usa «Os textos abaixo dizem o que a proposta muda e para quem, para onde vai o dinheiro, o que a Saúde e as parcerias rodoviárias recebem, e como cada partido votou e o que disse.» Em inglês começa por «The texts below», conforme a adenda A.
- **DO1-2:** os resumos existentes não tinham selos locais. Acrescentei-os também à primeira página, conforme a adenda B.
- **DO1-3:** «Afirmação:» e «Claim:» vêm de `CorrecaoDoDossie`, classificados como conteúdo.
- **DO1-4:** os controlos sintéticos do EO1 distinguem-se das páginas completas; a linha do dossiê continua obrigatória nas peças declaradas.
- **DO1-5:** a descrição da cabeça usa o título registado do dossiê.
- **DO1-6:** `check:datas` ganhou a associação explícita entre dossiê, estudo e edição.

Ficam abertas a validação integral, incluindo as conferências de navegador que não arrancaram, e a leitura editorial do inventário `do1`. As capturas permanecem reservadas ao lugar de direção.

Nesta adenda: **42 chamadas de ferramentas**, **26 execuções locais registadas** (três construções e 23 conferências ou medições), um autoteste adicional e **uma corrida dos três portões**. Acumulado registado: **102 chamadas**.