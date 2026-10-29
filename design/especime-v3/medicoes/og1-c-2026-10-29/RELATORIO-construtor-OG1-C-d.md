As adendas C e D ficaram concluídas e comitadas:

- **Motor:** `91636ca14`, OG1-C3.
- **Sítio:** `166b369f9`, OG1-C4.
- **Portões finais:** `build=0`, `verify=0`, `typecheck=0`, `motor=0`.

A regra recusa agora a atribuição errada da frase da IL ao deputado. A entrevista passa pelo seu modo próprio, mas é recusada se for tratada como `passagem`. O PS passou a `documento`, com a primeira ocorrência da citação conferida.

«Onde a fonte cita» aparece nas quatro páginas previstas, nas duas edições, e está ausente nas outras doze. O Método contém exatamente o âmbito autorizado para o item do Orçamento de 2027.

**Conferências e códigos**

Os códigos abaixo foram lidos dos ficheiros em `<temporario>/og1-c-adenda-conferencias/`.

| Conferência | Ficheiro `.codigo` | Código |
|---|---|---:|
| Motor antes, 178 checks | `motor-antes.codigo` | 0 |
| Motor depois, 201 checks | `motor-depois-d.codigo` | 0 |
| OG1 do sítio antes, 786 checks | `sitio-antes.codigo` | 0 |
| Discussão depois, OG1 com 837 checks | `discussao-d.codigo` | 0 |
| Pré-validação das 16 afirmações | `prevalidacao-16-d.codigo` | 0 |
| Livro do sítio | `ledger-d.codigo` | 0 |
| Cartões | `cartao-d.codigo` | 0 |
| Voz | `voz-d.codigo` | 0 |
| Atribuições relidas no motor | `atribuicoes-d.codigo` | 0 |
| Redação exata do Método | `metodo-d.codigo` | 0 |

A releitura conferiu 57 linhas, com 14 plantas recusadas e zero erros. As cinco mensagens exigidas pelas plantas novas são:

- `OG1 âncora: presença diferente da lista de afirmações`
- `OG1 âncora: primeiro alias diferente`
- `OG1 âncora: frase sem alias`
- `OG1 âncora: passagem sem frase ou excerto`
- `OG1 âncora: modo inválido`

As plantas do bloco de citação alterado foram recusadas nas duas edições. As nove `speaker_label` foram conservadas.

A pasta da corrida completa pelo escrivão é **`<temporario>/og1-c-adendas-cd-portoes-cabeca/`**:

| Ficheiro | Código lido |
|---|---:|
| `build.codigo` | 0 |
| `verify.codigo` | 0 |
| `typecheck.codigo` | 0 |
| `motor.codigo` | 0 |

O pre-commit do motor também executou `core.gate` e terminou com `GATE: PASS`. Os ficheiros `commit-motor-d.codigo` e `commit-sitio-d.codigo` contêm 0.

**Livro e exportação**

O livro mantém **112 linhas**. Mudaram **14**, exclusivamente dentro de `atribuicao`. Todos os restantes campos permaneceram iguais, incluindo citações, autores, valores e datas.

As 16 âncoras distribuem-se agora por **12 `passagem`, 3 `documento` e 1 `entrevista`**. O LEIA-ME apresenta essas contagens.

A exportação alterou:

- `ledger/provas/og1a/provas.json`
- `ledger/cruzamentos/og1a-provas.json`
- `ledger/cruzamentos/og1a.json`

**Nenhum ficheiro de `ledger/claims/` mudou.** O texto do item também permaneceu igual. Não foi criada nenhuma correção pública.

A geração do livro, das provas e do LEIA-ME, a exportação e a construção preparatória têm código 0 nos respetivos ficheiros `gerar-livro-d.codigo`, `gerar-provas-d.codigo`, `gerar-relatorio-d.codigo`, `exportar-d.codigo` e `astro-d.codigo`.

**Decisões registadas no relatório**

- **OG1-C-7:** resolvida pela adenda D. A regra da ordem aplica-se apenas a `passagem`; a entrevista conserva as restantes conferências e não imprime o bloco adicional.
- **OG1-C-8:** o ano do Método usa `{ ref: '2027' }`, a marca existente para anos de referência. A frase visível foi conferida integralmente. O carimbo da §1.210 passou a `78272841cbd7`.
- **OG1-C-9:** o primeiro arranque dos portões foi recusado com código 9 devido à alteração preexistente de `ARRANQUE.md`, antes de executar conferências. Guardei e conferi os bytes, verifiquei a cabeça comitada e restaurei a alteração original. O hash final é igual ao inicial.

O motor está limpo. No sítio permanece apenas a alteração preexistente de `ARRANQUE.md`, preservada e não comitada por mim. Ficam para a direção a leitura a frio e a aterragem. Não houve capturas nem `push`.

**Consumo desta retoma:** 66 chamadas de ferramentas, 8 conferências específicas, uma corrida completa dos portões, uma tentativa de arranque recusada e uma execução automática adicional de `core.gate` no commit.

tokens used: **26 982 899**, último contador acumulado observado na sessão.