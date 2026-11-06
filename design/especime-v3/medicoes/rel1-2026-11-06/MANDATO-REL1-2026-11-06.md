# Mandato REL1: o recibo diz o que a conferência do ficheiro fez, com o seu dia, e nunca uma frequência que as datas não mostram (06.11.2026)

Acrescenta: frases

Página: linha

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, no sítio, na worktree `lote6-2026-11-06`, que está em `main` aterrado (9c3ca0a7b), por cima da passagem REL1 0; o motor só lido. É uma correção de exatidão: uma frase do recibo que não é verdade em milhares de páginas no ar (a fila, 1; a leitura curta da adenda E da MET1, 8). Aterra hoje, 06.11.2026, como a terceira aterragem do dia, com a razão escrita (a §1.219 decidiu que a cadência de duas por dia cai com a AT1 medida, e a AT1 foi medida hoje no lote 5).*

## §0 Medido (06.11.2026, 16:37 a 16:42 UTC, por este lugar, por guião sobre o livro-razão e o `dist/` de 9c3ca0a7b)

- O livro-razão tem 4 144 linhas; 2 636 têm verificações. O autor `corredor-diario` tem 3 476 entradas, todas de dois dias: 01.09.2026 (2 540) e 03.09.2026 (936); nenhuma depois. 2 524 linhas só têm entradas dele.
- O `dist/` da cabeça (9 825 páginas) rende o rótulo desse autor 3 472 vezes em cada edição (cada recibo mostra as duas entradas mais recentes): pt «conferência diária do ficheiro da fonte», en «daily check of the source file». O rótulo diz uma frequência que as datas desmentem: a conferência correu duas vezes.
- A razão é do motor e não deste bloco: o fluxo `corredor` corre todos os dias às 06:10 UTC e sai em 8 a 20 segundos sem conferir nada, porque a variável `CORREDOR_ARMADO` do repositório do motor não está a «sim» (a corrida 42231348983, de 06.11.2026: «corredor desarmado: nada corre hoje»). Armá-lo pede as chaves e as definições da organização, que são do financiador; este bloco não lhe toca.
- O autor `painel-semanal` tem 652 entradas em sete segundas-feiras seguidas, de 21.09 a 02.11.2026 (81, 92, 100, 91, 91, 106 e 91 linhas): o rótulo «comparação semanal com a fonte» é verdade hoje. O autor `leitura-independente` tem 21 entradas, todas de 15.08.2026, e o rótulo não diz frequência.
- Quatro recibos em cada edição (`factor-sustentabilidade-2026`, `penalizacao-antecipacao-um-ano-com-factor-2026`, `penalizacao-antecipacao-um-ano-neutra`, `penalizacao-antecipacao-um-ano-sem-factor-2026`) dizem pt «Sem resposta desde 01.09.2026 · ao corredor», en «No answer since 01.09.2026 · to the runner», do `FONTES_SEM_RESPOSTA` de `src/data/fontes.mjs`, que a última corrida inteira do corredor escreveu (01.09.2026, 20:07:57 UTC). O endereço que citam respondeu hoje às 16:41:50 UTC com 200 e um PDF de 4 513 336 bytes: «desde» afirma uma continuidade que ninguém observou depois de 01.09.
- As outras frases do sítio com «diário», «diária», «diariamente» ou «daily» descrevem fontes (o registo do plano de recuperação que se republica todos os dias, os caudais diários da Convenção), nenhuma o processo deste projeto. O Método diz «Os números do painel são relidos na fonte, a última vez a 02.11.2026», com a data, e está exato.
- As réguas, os testes e os documentos que nomeiam o que muda (procura por guião em `src`, `scripts`, `tests` e nos ficheiros rastreados fora das medições e das leituras): `scripts/gate-html.mjs` (`ROTULO_DE_QUEM_RELEU`, a cópia do portão), `tests/linha/sem-resposta.mjs` (`ROTULOS`, a cópia da `check:fontes`), `tests/cartao/rp4ng.mjs:106` (a frase do recibo da penalização neutra), `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:235` (cita a frase), os comentários de `src/views/LinhaView.astro` (467, 1615) e de `src/styles/site.css` (2564).

## §1 As frases (palavra por palavra; a cópia de cada régua muda com a produção, no mesmo commit)

1. O rótulo do autor `corredor-diario` (a tabela `verificacaoPor` de `src/i18n/strings.mjs` e a `ROTULO_DE_QUEM_RELEU` do portão):
   - pt «conferência automática do ficheiro da fonte»
   - en «automated check of the source file»

   O identificador `corredor-diario` do livro-razão não muda: é um dado, e as 3 476 entradas ficam como estão.
2. O estado de uma fonte que não respondeu, no recibo (as chaves `semRespostaK`, `respondeuComErroK` e `aoCorredorK`, e a cópia da `check:fontes`):
   - `semRespostaK`: pt «Sem resposta a», en «No answer on»
   - `respondeuComErroK`: pt «Respondeu com erro a», en «Answered with an error on»
   - `aoCorredorK`: pt «à conferência automática», en «to the automated check»
   - `aEstaMaquinaK` não muda.

   A data continua a ser `desde`, o dia da primeira falha observada: a frase passa a dizer uma observação com o seu dia, e não um estado que dura até hoje. Rendido: pt «Sem resposta a 01.09.2026 · à conferência automática», en «No answer on 01.09.2026 · to the automated check».
3. Nenhuma outra frase muda: «Ficheiro da fonte relido a» e «Source file read again on» ficam (são exatos: o ficheiro foi relido nesse dia), e o rótulo do painel fica.

## §2 A régua nova (regra 15: a classe é um rótulo de quem releu que nomeia uma frequência que as datas do livro-razão não mostram)

Em `scripts/gate-html.mjs`, ao lado da `ROTULO_DE_QUEM_RELEU`, uma tabela própria da frequência de cada autor cujo rótulo a nomeia, hoje uma linha só: `painel-semanal`, sete dias. Para cada autor dessa tabela, sobre os dias distintos das suas entradas no livro-razão: o maior intervalo entre dois dias seguidos, e o intervalo entre o último dia e a data da construção (`construido_em` do `dist/version.json`), não passam do dobro do período (catorze dias); se passarem, vermelho, com o autor, os dois dias e o rótulo. E um rótulo de qualquer autor, nas duas edições, com uma palavra de frequência (pt «diário», «diária», «semanal», «mensal», «anual», com os plurais; en «daily», «weekly», «monthly», «yearly», «annual») para um autor fora da tabela é vermelho.

As plantas, cada uma numa cópia e nunca no livro-razão nem nas tabelas verdadeiras: (a) o rótulo do `corredor-diario` de volta a «conferência diária do ficheiro da fonte» e a «daily check of the source file» nas duas tabelas, vermelho; (b) o último dia do `painel-semanal` recuado trinta dias, vermelho; (c) a tabela das frequências sem a linha do painel, vermelho. As três com os códigos no relatório.

A consequência diz-se no relatório e fica escrita no comentário da tabela: se o painel não correr a 09.11 nem a 16.11.2026, a construção sai vermelha a partir de 17.11, porque nesse dia o rótulo «semanal» deixa de ser verdade; o remédio é o painel correr, ou o rótulo mudar por mandato, e nunca o limite subir.

## §3 O registo das correções

Não leva entrada: as naturezas do registo são o que o sítio disse do país (um valor, a proveniência de um valor, o texto de um estudo), e este rótulo diz como o projeto confere. A correção fica na §1.228 do `DECISIONS.md`, que este lugar escreve com os registos do lote.

## §4 Quando paras

Se uma régua só passar mais fraca, se uma página imprimir o rótulo do corredor ou o estado sem resposta fora do `LinhaView.astro` (diz onde), ou se a construção mudar uma contagem da prova da voz que estas frases não expliquem (diz qual).

## §5 O fim

O `build` inteiro verde; `gate:html`, `check:fontes`, `check:cartao`, `check:cruzamento` e as conferências da voz que a mudança toca, com os códigos; o `conferir-mapa.py` verde com a linha 235 do mapa a citar a frase nova; as três plantas com os códigos; e, no relatório, o rótulo do corredor e o estado sem resposta copiados do `dist/` nas duas edições, de `livro-razao/penalizacao-antecipacao-um-ano-neutra/` e de `en/ledger/penalizacao-antecipacao-um-ano-neutra/`, com a contagem das páginas de cada edição que imprimem cada frase nova e de as que ainda imprimem as antigas (zero). Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `REL1`. Quarenta e cinco minutos, sessenta chamadas.
