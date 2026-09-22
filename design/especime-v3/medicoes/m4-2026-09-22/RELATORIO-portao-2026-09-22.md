# O estudo 11 e o portão do motor

*Bloco M4, 22.09.2026, com a passagem de correção da leitura a frio do mesmo dia (Codex `gpt-5.6-sol`). Construtor: Claude Opus 5, na worktree `m4-2026-09-22`, com base em `e8518f6` (o `master` andou dois commits durante o bloco e está em `8ae6b53`, logo a cabeça precisa de rebase antes de aterrar). Brief: `design/observatorio/BRIEF-M4-o-estudo-11-entra-no-portao-do-motor.md`, no repositório do sítio. Cada número deste relatório, em algarismos ou por extenso, resolve numa entrada do `medidas.json` ao lado, e é o `medir.py` que o escreve e que confere os dois no fim. Sem travessões.*

## 1 · O teste de aceitação, respondido

**O estudo 11 não entra hoje no portão, e a razão é medida e não estimada.** O brief dá por assente que o defeito são nove linhas e que o campo `value_not_numeric` as acerta. Medido a 22.09.2026: a validação do próprio motor recusa **28 das 55 linhas** do livro-razão, em três famílias, e **sete das nove linhas nomeadas no brief não podem declarar `value_not_numeric` sem mentir**. Por isso o mandato 1 pára onde o brief manda parar quando o brief e os dados discordam, o mandato 3 não se faz, e a reparação, que mexe em valores e em classificações de fonte, é uma correção registada e é do diretor.

O que o bloco entrega: as medidas todas, as duas plantas a morder, e o portão novo que impede o caso de se repetir. **`python3 -m core.gate` passa a falhar quando existe em `content/` um livro-razão que nenhum entregável declara**, com a lista de exceções escrita e com razão, e o 11 fica lá dentro com o seu motivo à vista em vez de fora do portão em silêncio.

## 2 · O livro-razão do 11, linha a linha (mandato 1)

Não foram nove linhas. O `core.reconcile.load_ledger` levanta na primeira linha má e cala as outras, e foi isso que o bloco M2 leu a 21.09.2026: a primeira. Passadas as 55 linhas pela mesma validação, uma a uma, saem **três famílias de defeito** (`medidas.json`, `estado_do_livro`):

| família | linhas | o que o motor recusa |
|---|---|---|
| `value` é texto | 9 | `claim value '…' contains no number` |
| `source_type` fora do enumerado | 20 | `derived` 10, `independent_fiscal_institution` 5, `press` 3, `union` 1, `supreme_audit_institution` 1. O `core.provenance.SourceType` tem cinco: `government`, `intergovernmental`, `academic`, `foundation`, `other` |
| `entity_aliases` | o livro | escrito como nome para texto; o `core.attributions.Lexicon` exige nome para lista |

Vinte e oito linhas distintas, porque a `governo-posicao` está em duas famílias. O livro foi escrito a 24.08.2026 contra um esquema que o motor nunca teve, e o estudo não tem `build_ledger.py`: ao contrário do 04, do 06, do 07, do 08, do 09, do 10 e do 14, o caminho de construção do 11 é o próprio ficheiro.

### As nove linhas, e porque sete não podem declarar o campo

O `indexed_forms` do `core.reconcile` aceita `value_not_numeric` com três recusas: o valor não pode carregar um número, não pode ter `alternates`, e **tem de aparecer no `excerpt` da própria linha**. A terceira é a que decide aqui, e a razão está escrita no próprio motor: «o que um editor imprimiu lê-se na linha que a linha cita, ou não foi lido».

| linha | valor | está no seu `excerpt`? | pode declarar? |
|---|---|---|---|
| `fs-penalizacao-seletiva` | `selectiva` | sim | **sim** |
| `fs-heterogeneidade-longevidade` | `agregada` | sim | **sim** |
| `relatorio-titulo` | `Reformar as Pensoes em Portugal: …` | não | não |
| `governo-posicao` | `sem reforma estrutural nesta legislatura` | não | não |
| `defice-transicao-nao-quantificado` | `nunca estimado` | não | não |
| `ch6-taxa-contributiva-nao-fixada` | `deferida` | não | não |
| `fs-dupla-contagem` | `dupla contagem` | não | não |
| `ch12-sem-base-administrativa` | `inexistente` | não | não |
| `governo-xxiv-xxv` | `XXIV -> XXV` | não | não |

As duas primeiras são palavras que o relatório imprime, nas frases que as linhas citam, e essas frases estão no relatório de origem: «transformou um instrumento geral de adaptacao demografica numa penalizacao selectiva» e «a esperanca media de vida aos 65 anos e uma estatistica agregada» (`source/relatorio-full.txt`, sha256 `bfdcf39a…`, o mesmo do `MANIFEST.sha256`).

As outras sete carregam uma caracterização de quem escreveu o livro, e não uma coisa que alguém imprimiu. O `relatorio-titulo` compõe o título e o subtítulo da ficha técnica com dois pontos pelo meio; o `governo-posicao` resume um comunicado; o `defice-transicao-nao-quantificado` e o `ch6-taxa-contributiva-nao-fixada` dizem o que o relatório **não** fez. Declarar `value_not_numeric` nessas é afirmar que a fonte imprimiu aqueles caracteres, e não imprimiu: `dupla contagem` e `inexistente` existem no relatório de origem, com 13 e 3 ocorrências, mas nenhuma nas frases que as suas linhas citam, e as três de `inexistente` são sobre custos de colocação e deduções, nenhuma sobre a base administrativa. Provado na cópia de ensaio: postas as nove com o campo, o motor sai a 2 na mesma, agora com a terceira recusa (`ERROR: claim relatorio-titulo: declares value_not_numeric and its value … is not in its own excerpt`).

**Nada foi mexido no livro-razão.** Acertar as duas que podem baixa a contagem de 9 para 7 e não muda nada, porque o motor continua a levantar, e deixava metade do livro num esquema e metade noutro. A reparação verdadeira muda o texto de sete valores e a classificação de fonte de vinte linhas, e isso é uma correção registada.

### As fontes estão em árvore, ao contrário do que o brief supõe

O brief abre a porta a «as cópias das fontes vivem no Drive do diretor». Não é esse o caso do 11: o `Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf` e o `relatorio-full.txt` estão em `content/11 Seguranca Social/source/` na árvore principal do motor, excluídos do repositório pelas linhas 69 e 70 do `.gitignore`, e os dois resumos sha256 batem certo com o `MANIFEST.sha256`. A busca correu com conhecido-positivo (a mesma varredura vê 759 PDF em `content/`, `publisher/` e `indicators/`). O que trava o bloco não é falta de fonte: é o que está escrito no livro.

## 3 · As duas edições, medidas (mandato 2)

As duas edições do estudo: a página portuguesa (`Penalizações por Reforma Antecipada em Portugal (pt-PT).html`) e o relatório (`RELATORIO-seguranca-social.md`). Cada corrida com o seu código de saída lido (`medidas.json`, `medidas_de_hoje`).

| medida | HTML | relatório `.md` | razão da contagem |
|---|---|---|---|
| `core.reconcile` | **saída 2** | **saída 2** | falha estrutural, não é dívida: `load_ledger` levanta na `relatorio-titulo` e nada é contado |
| `core.attributions` | **saída 2** | **saída 2** | idem, e por baixo ainda estão os 20 `source_type` e o `entity_aliases` |
| `core.assertions` | saída 1, **11 não declaradas** | saída 1, **9 não declaradas** | 0 verificadas, 0 a rever, 0 falhadas: o livro tem a lista `assertions` vazia, logo todo o vocabulário quantificador que as duas edições imprimem está por declarar |
| `core.prose` | saída 1, **1 adjacência** | saída 1, **7 adjacências** | `adjacency_ignores` vazia; na HTML é «0,50% para 25 a 34, 0,65% para 35 a 39», onde a vírgula decimal colide com a vírgula da lista |
| `core.editions` (par `md` contra `html`) | **saída 2** | | mesma falha estrutural: o par lê o mesmo livro |
| `core.derivations` | saída 0 | | nenhuma das 55 linhas traz `derivation` nem `check`, logo não há aritmética para voltar a fazer |

As asserções e as adjacências seriam dívida declarável. A falha estrutural não é dívida: com ela, o `core.gate.measure` levanta `RuntimeError`, e declarar o 11 hoje punha o portão em STRUCTURAL FAIL e bloqueava todos os commits da casa.

## 4 · O que o estudo mediria com o livro reparado (medido numa cópia de ensaio)

Para o diretor saber o tamanho do que está em cima da mesa antes de decidir. **Medido numa cópia que não embarca**, num diretório temporário, com as três famílias contornadas assim e só assim: as nove com `value_not_numeric` e, nas sete, o valor acrescentado ao fim do `excerpt` para passar a terceira recusa; os vinte `source_type` postos a `other`; o `entity_aliases` convertido para listas. **As contagens abaixo não dependem do texto das nove linhas**, porque uma linha `value_not_numeric` não indexa forma nenhuma (`indexed_forms` devolve lista vazia), e é por isso que a cópia mede o que se quer saber.

| edição | números | casados | órfãos | atrib. erradas | asserções não decl. | adjacências |
|---|---|---|---|---|---|---|
| `html` | 149 | 41 | **89** | **9** | 11 | 1 |
| relatório `.md` | 654 | 154 | **328** | **95** | 9 | 7 |

E o par das duas edições: `EDITIONS: FAIL — 154 vs 41 matched tokens, 40 rows compared, 40 drift(s)`.

**Isto não é uma linha de base a registar, e o bloco não a registou.** Os órfãos das duas edições somam 417 (89 mais 328) e as atribuições erradas somam 104 (9 mais 95), e nenhum dos dois é dívida antiga de um estudo conferido: são a medida de um livro de 55 linhas contra duas edições que imprimem 149 e 654 números, 803 ao todo. O relatório e a página também não estão a dizer a mesma coisa, com 40 desvios sobre 40 linhas comparadas. Registar isto como linha de base era pôr a catraca a certificar o que ela existe para impedir.

## 5 · As plantas (mandatos 4 e 5)

**A planta no valor.** Numa cópia fora do índice, sobre a cópia de ensaio do §4, porque hoje o portão não consegue medir o 11 de todo. Trocado um algarismo numa ocorrência única: `6,00` para `6,80`, na figura da linha `fig81-penalizacao-legal`. Confirmado antes de plantar que o canónico `6.8` não é valor de nenhuma linha nem símbolo da lista `ignore`.

```
  base   : {"numbers": 149, "matched": 41, "orphans": 89, ...}
  medido : {"numbers": 149, "matched": 40, "orphans": 90, ...}
  ratchet: ['orphans: 90 > baseline 89 — new unledgered/unattributed content']
  VEREDITO DO PORTÃO: FAIL (ratchet)
```

Repostos os bytes, sha256 igual ao de antes (`96565bc0c3db3294e5ce983ff22de8ccffb2bb9ab399dd86c8d082df732463f2`), a catraca volta a `[]` e o veredito a `ok`. A máquina que vigia os números do 11 morde; o que falta é o livro que lhe dá o que vigiar.

**A planta no portão novo.** Um livro-razão por rastrear escrito em `content/15 Orcamento do Estado 2027/ledger.json`, que é onde o estudo seguinte o poria, e o portão inteiro corrido por cima. A corrida ficou em ficheiro, ao lado deste relatório (`planta-livro-nao-declarado.txt`), porque uma saída que só existe numa mensagem é uma saída que ninguém pode reler:

```
GATE  livros declarados      FAIL (14 livro(s) em 476 JSON sob content/, 2 exceção(ões) escrita(s), 0 ilegível(eis))
GATE: FAIL — 1 problem(s); commit blocked
 - livro-razão sem entregável: content/15 Orcamento do Estado 2027/ledger.json.
SAIDA DO PORTAO: 1
```

Uma só conferência vermelha em toda a corrida, e é a nova. Retirada a planta, a linha passa a `ok` com 13 livros em 475 JSON.

**A suíte.** O `core.gate_test` leva mais 11 conferências, 6 plantas e 5 controlos, e passa a contar-se em vez de se escrever: a linha `PASS` imprime o comprimento do inventário, porque o número escrito à mão já tinha dessincronizado uma vez (dizia 14 quando as conferências eram 15). As plantas, que têm de fechar o portão: um livro sem entregável, um JSON ilegível sob `content/`, uma exceção sem razão escrita, uma exceção repetida, uma exceção sobre um livro que afinal já está declarado, e uma exceção que sobreviveu ao ficheiro que protegia. Os controlos, que têm de passar: um livro de linhas mistas cuja primeira linha não traz `id`, uma carga bruta que chama «claims» às suas linhas, a varredura a contar o que leu, um livro declarado, e uma exceção bem escrita. `GATE_TEST: PASS — 18 checks`.

Cada planta nova foi provada a morder com a sua guarda desligada numa cópia: com o `e_livro` a olhar só para `claims[0]`, o livro de linhas mistas deixa de ser visto; com a varredura a saltar o ilegível em silêncio, o ficheiro partido passa; e com a recusa da exceção repetida desligada, a repetição passa. Repostas as guardas, a suíte volta a verde.

## 6 · O portão novo, e o que ele deixa passar (mandato 5)

O portão media o que estava escrito em `gate_baselines.json` e mais nada, por isso um estudo com livro-razão ficava de fora sem que nada o dissesse. O 11 esteve assim de 24.08.2026 a hoje. A conferência nova compara a lista com a árvore: **13 livros-razão sob `content/`, 11 declarados por 37 entregáveis, 2 com exceção escrita, 0 órfãos**.

Um livro é lido pelo que traz e não pelo nome, porque o nome não é o conteúdo: objeto JSON, lista `claims` não vazia, só de objetos, e com pelo menos uma linha a trazer `id` e `value`. É o que separa os 13 livros do `content/06 Évora Economy/Technical Source/raw/web_investment_claims.json`, que tem 32 linhas chamadas «claims» com `topic` e `value_exact` e nenhuma com `id`, e não é um livro.

**Pelas linhas todas, e não só pela primeira.** A primeira versão desta conferência olhava para `claims[0]` e mais nada, o que fazia desaparecer um livro cuja primeira linha fosse um cabeçalho, uma nota ou uma linha em construção sem `id`, com todas as outras a serem linhas a sério. Uma amostra de uma não é a lista, e a suíte leva agora um livro de linhas mistas como controlo.

**E um ficheiro que não se abre é defeito, não é ausência.** Um `*.json` sob `content/` que dê `OSError`, `UnicodeDecodeError` ou `JSONDecodeError` saía da varredura em silêncio, o que é dizer «não há livro aqui» sobre um ficheiro que ninguém leu. Passa a fechar o portão com o caminho e o erro escritos. Medido hoje: **475 JSON sob `content/` nesta worktree e 1 123 na árvore principal com os ficheiros excluídos do repositório, 0 ilegíveis nas duas**, logo a regra não custa nada hoje e existe para o dia em que custar.

As duas exceções, escritas em `core/gate_baselines.json` sob `ledgers_without_deliverable`, cada uma com a razão:

1. **`content/03 Regional Economy/Travessia das Regioes/ledger.json`.** Nenhuma edição o lê, logo não há documento contra o qual o reconciliar. O próprio ficheiro escreve porquê está fora do livro do 03, e a razão da exceção cita-o: o `core/receipts.py` resolve uma figura impressa contra todas as linhas com o mesmo valor, e postas lá estas oito reancoraram onze figuras já publicadas, entre elas uma quota de VAB do Centro que passou a resolver-se contra a distância dos Açores à média da UE-27.
2. **`content/11 Seguranca Social/ledger.json`.** Com as três famílias medidas e o remetente para este relatório.

A lista leva as suas próprias recusas, porque uma exceção que apodrece é um buraco que ninguém vê: sem razão escrita, repetida, a nomear um livro que afinal já está declarado, ou a nomear um caminho que deixou de ser um livro na árvore, qualquer delas fecha o portão.

## 6b · Três coisas que a leitura a frio apontou e que não são defeitos deste bloco

1. **O estudo não tem edição inglesa, logo o par PT/EN não existe.** O `studies-src/` do sítio tem uma só pasta para este estudo e um só ficheiro dentro dela, `pt.html`, e o `manifest.yml` declara uma só entrada para o `slug`, com `lang: pt`. O `sha256_raw` que o manifesto guarda (`96565bc0c3db3294e5ce983ff22de8ccffb2bb9ab399dd86c8d082df732463f2`) é, byte a byte, o da edição HTML que este bloco mediu. As duas edições medidas são as que há.
2. **Três linhas do livro trazem ressalvas de verificação e vão para o M4b:** a `taxa-substituicao-2025-2065` («fonte primaria POR CONFIRMAR»), a `cga-saldo-e-comparticipacao` (`[verify]` sobre a norma legal que fixa a comparticipação) e a `ageing-report-tabela18` («POR FECHAR»). Não são falha estrutural e não entram na contagem das 28: são dívida de conteúdo, e arrumam-se com o resto da reparação.
3. **O relatório sai do `diff.patch`** por construção do pacote de leitura a frio, não por faltar no ramo. Está commitado desde `2dbc89c`.

## 7 · Três correções ao que o brief deu por medido

1. **O 08 e o 09 não têm exemplo nenhum de `value_not_numeric`.** O brief manda abrir um exemplo num deles; abertos os treze livros da casa, o campo aparece em dois: o 12, com 12 linhas a `N.d.` da DGAL, e o 14, com 2 linhas a `-€` e `- €`. Nos dois, e em todas as 14 linhas, o valor está no `excerpt` da própria linha. Não há na casa um único precedente de `value_not_numeric` sobre um valor que a fonte não imprimiu.
2. **Não são nove linhas: são 28, em três famílias.** Ver o §2. O que o M2 mediu a 21.09.2026 estava certo no que viu e incompleto por construção, porque a validação levanta na primeira e cala as restantes.
3. **As fontes do 11 estão na árvore principal.** Ver o fim do §2. A saída que o brief deixa aberta, a de parar por falta de fontes, não é a que se aplica.

## 8 · O que fica decidido e o que fica para o diretor

Fica feito: a conferência nova e a sua lista de exceções (`core/gate.py`, `core/gate_baselines.json`), a sua suíte com quatro plantas e quatro controlos (`core/gate_test.py`), as medidas (`medidas.json` e o `medir.py` que as escreve) e este relatório. A dívida de registo prévio fica em oito estudos, porque o 11 não foi declarado, e não se escreveu registo nenhum depois da recolha.

**Decidido pelo lugar de direção na §1.121:** o 11 repara-se num bloco próprio, o M4b, e a exceção fica escrita como está até lá. O que esse bloco tem pela frente, medido aqui:

- **Os sete valores.** Cada um é hoje uma caracterização no campo onde o motor espera o que foi impresso. A saída que não mexe em provas é passar a caracterização para `note` e pôr no `value` a palavra ou a frase que a fonte imprime, com o `excerpt` a prová-la. São sete decisões de conteúdo, uma a uma.
- **As vinte classificações de fonte.** `press`, `union`, `independent_fiscal_institution` e `supreme_audit_institution` têm de cair nos cinco do `core.provenance`, e essa escolha é visível ao leitor: tudo o que não é `government` leva um qualificador na página. As dez `derived` são outra coisa, porque `derived` não é uma fonte: é uma linha calculada, e a forma que o motor tem para isso é o `derivation` com o `check`, sobre a fonte de onde vieram as parcelas.
- **As três linhas com ressalvas de verificação**, do §6b, que são dívida de conteúdo e não falha estrutural.
- **O tamanho do trabalho.** Com 89 e 328 órfãos e 40 desvios entre as duas edições, a reparação do livro é um bloco inteiro e não um remendo. Até lá o estudo fica onde está, com o motivo escrito onde o próximo bloco tropeça nele.
