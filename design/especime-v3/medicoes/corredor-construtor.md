# O piloto do corredor diário · o lado do sítio (01.09.2026)

*Escrito pelo construtor (Claude Opus 5), primeira passagem a 01.09.2026 e
**segunda passagem na mesma noite**, sobre a leitura a frio do Codex, a medição
cega do Sonnet e a triagem do lugar de direção. O relatório inteiro do bloco, com
as medidas do motor, do arquivo e dos fluxos, está em
`ResearchHub/indicators/PILOTO-CORREDOR-2026-09-01.md`; este diz o que o sítio
ganhou, o que isso custou, e o que ficou por decidir. Todos os números vêm de
corridas desta sessão. Sem travessões na prosa. Modelo: Claude Opus 5.*

---

## 1 · Os três portões

| portão | estado de saída |
|---|---|
| `npm run build` | **0** |
| `npm run verify` | **0** |
| `npm run typecheck` | **0** |

Cada um corrido à parte, com o estado de saída lido à letra e nunca atrás de um
`tail` nem de um pipe.

---

## 2 · O que o sítio ganhou

### 2.1 Um ficheiro gerado novo: `src/data/fontes.mjs`

Escrito pelo corredor a cada corrida, como `src/data/verificacao.mjs` é escrito
pelo painel semanal. Traz duas coisas:

* `CONFERENCIA`: a hora UTC em que a corrida perguntou às fontes, quantos
  endereços perguntou, quantas linhas do livro-razão esses endereços sustentam, e
  o que cada resposta foi (`semDescarga`, `iguais`, `ficheirosNovos`,
  `primeirasCapturas`, `semResposta`, `valoresNovos`).
* `FONTES_SEM_RESPOSTA`: uma entrada por endereço que deixou de responder, com a
  data da **primeira ausência depois da última resposta boa**. Um endereço que
  responde não tem entrada.

**É um ficheiro próprio e não um bloco dentro de `verificacao.mjs`**, e a razão é
mecânica: o carimbo semanal é do painel (32 linhas, uma vez por semana, com as
canárias a reler o VALOR) e este é do corredor (2 577 linhas, todos os dias, a
perguntar se o FICHEIRO mudou). Escrevê-los no mesmo ficheiro gerado garantia que
a corrida que corre primeiro apagava os números da outra, e a página passava a
dizer que o painel europeu tem 2 577 linhas.

### 2.2 A terceira leitura do cabeçalho

`src/components/SinalDasFontes.astro`, montado em
`src/components/Masthead.astro` dentro de `<div class="masthead-furniture">`,
entre a leitura do painel europeu e a linha da agenda. Usa as classes que já lá
estão e não traz folha de estilo própria.

Diz **«Fontes · 01.09.2026 21:07 WEST»**: o nome da coisa, a data, a hora de
Lisboa convertida do instante UTC que o motor escreve, **e o fuso à vista**. Não
diz nem quantas linhas se conferiram nem quantos valores novos entraram, e isso
está decidido: **§1.92(1)**, «a frase do cabeçalho fica sem contagens, como o
construtor propôs; se as contagens tiverem um dia uma página, é no Método com
chave de prova».

**O fuso estava no código e não na página.** `timeZone: 'Europe/Lisbon'` diz ao
programa que hora calcular e não diz nada a quem lê: «19:15» sem mais é uma hora
sem sítio. A abreviatura passa a sair do próprio formatador
(`timeZoneName: 'short'`), pelo que acompanha a passagem de verão a inverno sem
ninguém se lembrar. E a composição passa a ser por partes (`formatToParts`) em
vez de um `replace` sobre o texto do `pt-PT`, que escrevia «01/09/2026, 21:07» com
barras e vírgula e era uma regra que se partia à primeira mudança de locale.

**Uma observação para o lugar de direção, e não uma mudança:** a leitura vizinha,
a do painel europeu, mostra a data em ISO (`2026-08-31`), e esta mostra-a em
`dd.mm.aaaa`. São duas formas de data lado a lado no mesmo cabeçalho. A forma
desta está na decisão §1.92; a do painel é anterior. Fica dito.

**O cabeçalho cresce 23,19 px, e está medido.** Corri
`node tests/inicio/app.mjs` (a régua da worktree `cabeca-2026-09-01`) sobre duas
construções, uma com a leitura montada e outra sem:

| largura e edição | sem a leitura | com a leitura | diferença |
|---|---|---|---|
| cabeçalho grande (6 células) | 200,73 px | 223,92 px | +23,19 |
| cabeçalho compacto (6 células) | 168,33 px | 191,52 px | +23,19 |
| cabeçalho grande (2 células) | 177,55 px | 200,73 px | +23,19 |
| cabeçalho compacto (2 células) | 145,14 px | 168,33 px | +23,19 |
| as páginas sem mobília (12 células) | iguais | iguais | 0 |

**A régua passa 39 de 39 nas duas construções**, porque o que ela afirma é que o
cabeçalho é o nome numa linha e sem sinal, e não uma altura fixa. Fica dito na
mesma: a altura mudou, a régua é de outra família, e ela tem de voltar a correr
depois da fusão, que, pela §1.91, é depois de a cabeça nova entrar, com este ramo
a rebasear por cima dela.

### 2.3 As três datas no recibo da linha

`src/views/LinhaView.astro`. O bloco «Verificações» passa a ter, por esta ordem:

1. **Publicado pela fonte a** *published_at*, quando a linha o tem;
2. **Lido a** *access_date*;
3. **Sem resposta desde** *data*, quando o corredor mediu que o endereço deixou
   de responder;
4. **Reconferido a** … , as duas entradas mais recentes, como já era.

O período de referência é a quarta data e continua onde estava, no bloco de cima
ao pé do valor, que é onde ele pertence: é uma propriedade do número.

**Nenhum dos três lugares se desenha quando não há o que dizer.** Uma linha sem
`published_at` não mostra o lugar vazio nem `[a verificar]`: `[a verificar]`
diria «existe e falta-nos», e o que se sabe é que a maior parte dos publicadores
não serve uma data que se possa ler.

### 2.4 O campo `published_at` no livro-razão

Novo campo opcional, `AAAA-MM-DD`. A terceira das três datas de uma medida, e a
que faltava. Duas origens declaradas em `ledger/README.md`: o `Last-Modified` que
o servidor manda, e o carimbo do próprio conjunto de dados (`updated` no
Eurostat, `DataUltimaAtualizacao` no INE). As duas ficam registadas, verbatim, na
linha do índice do arquivo de versões que a captura escreveu, que é a prova desta
data como o excerto é a prova do valor.

O validador impõe: `AAAA-MM-DD` e mais nada (um ano não é um dia); nunca
posterior ao dia da construção; nunca anterior ao período de referência quando
esse período é um mês ou um dia. O portão de HTML confere a transcrição carácter
a carácter, como faz a qualquer outro campo.

**Nenhuma linha o traz ainda**, e diz-se: o campo, a regra e a rendição estão
feitos e provados, e o corredor não o escreveu nesta passagem porque escrever em
2 577 linhas na mesma corrida em que se mede tudo o resto tornava impossível ler
o que mudou. É a primeira coisa da segunda passagem.

### 2.5 Um autor de reconferência novo: `corredor-diario`

**Vale o que vale, e o que vale está escrito no rótulo e no README: ele não relê
o valor.** O que ele prova é que o ficheiro da fonte é byte a byte o mesmo que
está guardado, ou que o publicador respondeu `304 Not Modified` ao validador da
captura anterior; nos dois casos o número não pode ter mudado, porque o ficheiro
de onde ele foi lido não mudou.

Por isso escreve `igual` e `inacessivel` e **nunca `diverge`**: onde o ficheiro
mudou, não escreve nada na linha e deixa-a no relatório da corrida para uma
sessão a rever. O rótulo da página diz «conferência diária do ficheiro da fonte»
(EN: «daily check of the source file»), para que não se leia como uma releitura
do número.

---

## 3 · A régua do cruzamento, e porque é que ela apertou em vez de ceder

`scripts/check-cruzamento.mjs` compara os bytes de cada linha cruzada com os que
atravessaram. **2 525 das 2 577 linhas com endereço são linhas cruzadas**, e o
corredor escreve `verificado_em` em todas as que conferiu: a primeira construção
deste bloco fechou com **2 525 vermelhos**, todos «os bytes em disco já não são
os que atravessaram».

O que a régua diz, na sua própria mensagem, é «uma linha cruzada não se edita à
mão», e o bloco `verifications[]` é o único que, por regra do formato, nunca se
escreve à mão. Não se lhe abriu uma excepção. O que se fez:

1. se os bytes batem, acabou, como sempre;
2. se não batem, **reconstrói-se o ficheiro tal como estava na travessia**,
   tirando as entradas que vieram depois dela (o registo já dizia quantas havia,
   em `verifications_at_export`), e os bytes reconstruídos têm de dar
   **exactamente** o resumo registado;
3. e cada entrada acrescentada tem de declarar um autor da lista fechada.

Tudo o que não seja isso continua a fechar a construção, byte a byte. A contagem
das reconferências passa de «tem de ser igual» a «só pode crescer»; encolher passou
a ter mensagem própria.

**E o ponto 3 diz agora o que prova (decisão §1.92 / M18).** Ele confere que o
`by` é um **rótulo permitido**. NÃO prova que um programa escreveu a entrada:
`by` é uma cadeia que a própria entrada declara, e quem editar o YAML à mão
escrevendo `by: "corredor-diario"` passa por aqui. A primeira redacção dizia «só
um programa pode acrescentar», e isso era uma afirmação que nada nesta régua
sustenta. O que sustenta a promessa está noutro sítio: o formato proíbe escrever
o bloco à mão, e a prova de que a conferência aconteceu é a linha do índice do
arquivo, com o endereço, a hora UTC, o estado HTTP e o resumo do ficheiro lido,
que uma edição à mão do YAML não fabrica.

**Medido nesta corrida: 2 850 registos de travessia, 2 850 reconstroem, 0
falham.** E **cinco** plantas dentro da própria régua, que correm a cada
construção: uma reconferência de programa acrescentada (verde); uma com autor
escrito à mão (vermelho); o valor mexido com a reconferência por cima (vermelho);
o ficheiro sem bloco nenhum e com o valor mexido (vermelho); e **quatro
conferências numa linha que atravessou sem bloco** (verde), que é a planta da
poda das quatro.

**A poda das quatro e esta régua.** A §1.92(2) manda a linha guardar as últimas
quatro conferências, o que quer dizer que um dia as mais velhas saem. Para uma
linha que atravessou SEM bloco (**2 829 das 2 850**) isto não muda nada: a
reconstrução tira o bloco inteiro e os bytes voltam a ser os que atravessaram,
hoje e daqui a um ano. Para as **21** que atravessaram com uma entrada, o dia em
que a poda lhes comer a primeira, a reconstrução deixa de bater e a régua fecha
com a mensagem de sempre, que é o correcto: a partir daí a linha volta a
atravessar pelo exportador, que é como uma linha cruzada muda. Está escrito no
código, ao lado da função.

---

## 4 · As medidas de aceitação do brief §3, célula a célula

| a medida | estado | o que se mediu |
|---|---|---|
| uma corrida completa verde no GitHub | **por fazer** | precisa do ramo empurrado; ver §5, dúvida 6 |
| o relatório diz quantas linhas conferiu | **feito** | 2 577 de 2 916; 79 endereços de pedido |
| quantas fontes não responderam | **feito** | 1 endereço (4 linhas): a DGCP, cadeia de certificados incompleta |
| quanto tempo levou | **feito** | 227,2 s no vintage zero; 75,7 s na corrida seguinte |
| um ficheiro alterado num byte | **vermelho** | planta refeita ao caminho verdadeiro: captura nova, as duas versões no arquivo, 2 linhas por rever e 0 escritas, **e o leitor lê do arquivo exactamente os bytes que a corrida guardou** |
| um leitor partido | **vermelho** | planta construída na segunda passagem: um leitor que sai com 3 faz a corrida sair com 1. Faltava, e a leitura a frio disse-o |
| um endereço a 404 | **vermelho** | planta: linha de ausência no índice, «sem resposta desde» no sítio |
| um portão do sítio vermelho | **vermelho** | os portões correm antes do `push`, com `set -euo pipefail`, provado em `provar_fluxo.py` |
| escrever no arquivo uma versão já guardada | **vermelho** | planta em `arquivo.py --provar` |
| uma linha do índice reescrita | **vermelho** | planta em `arquivo.py --provar` e em `corredor.py --provar` |
| o homem morto provado | **vermelho** | sem carimbo, com carimbo malformado e com carimbo velho; e a escolha da corrida agendada da manhã com 12 conferências em `indicators/vigia.py`, incluindo «o meio-dia verde a tapar a manhã vermelha» |
| corpos descarregados = fontes sem validadores | **feito, exacto** | 24 com validador responderam 24 `304`; os outros 55 mandaram corpo. Zero excepções |
| `--so-devidas` sem nada devido acaba sem um pedido | **vermelho** | planta de ponta a ponta na segunda passagem: 0 pedidos, 0 leitores lançados e o sinal do sítio intacto, com os argumentos da produção |
| uma entrada plantada como devida hoje pede só essa | **vermelho** | planta em `calendario.py --provar` |
| a releitura semanal escreve as datas que encontrou | **feito** | INE 200 / 0 datas; Eurostat 200 / 0 datas, e por isso a marca semanal NÃO se escreveu. A reescrita de `calendar.json` é atómica e validada, com caminho explícito |
| `verify:deploy` verde depois da corrida | **por fazer** | não houve `push`, logo não houve lançamento |
| o cabeçalho com a data e a hora da conferência real | **feito** | «Fontes · 01.09.2026 19:22» |
| o inventário do livro-razão igual antes e depois | **feito** | nenhum `value` mudou; a construção reconta e passa |
| `check:voz` com as cadeias novas no inventário | **verde com um buraco conhecido, e o buraco tem issue** | a rota `linha` não é inventariada: I108 |
| o agente `launchd` continua às segundas | **por fazer** | a primeira segunda-feira ainda não chegou |
| medição cega do Sonnet e leitura do Codex | **do lugar de direção** | |

---

## 5 · O que a segunda passagem mudou, ponto a ponto

As dúvidas da primeira passagem foram decididas pelo lugar de direção na triagem
de 01.09 à noite e na §1.92; este relatório cita as decisões em vez de as
rediscutir.

| ponto | o que mudou |
|---|---|
| **§1.92(1)** · a frase do cabeçalho | fica sem contagens, como estava. A frase «deliberado contra a letra do brief» saiu do componente: o que governa é a decisão registada |
| **§1.92(2)** · as últimas quatro | a linha guarda as últimas 4 conferências; a corrida de reconferência em massa saiu do ramo e refez-se com a regra nova. Medido: no tecto, +4 −4 por linha e por dia, crescimento líquido zero |
| **M15** · o fuso | escrito na página («WEST»), tirado do próprio formatador; a data compõe-se por partes e não por `replace` |
| **M16 / decisão 9** · `published_at` | o `Last-Modified` DEIXA de ser apresentado como data de publicação, no README e no comentário do formato: ele descreve a modificação da representação e muda quando um ficheiro é copiado ou passa por uma cache. A origem fica só o carimbo do próprio conjunto de dados; a extração vem com os blocos dos domínios |
| **M17 / decisão 10** · a rota `linha` | é a **I108**, aberta em `ISSUES.md`, bloco próprio. As duas cadeias do recibo são a ocasião; a causa é a rota estar fora do inventário desde que ele existe |
| **M18 / decisão 11** · o cruzamento | diz o que prova: um rótulo permitido, não a autoria. A mensagem de erro e o bloco de cabeça foram reescritos |
| **Minor 3** · o prazo das fontes | `>=` e não `>`: com dois dias de prazo, ao segundo dia está vencido. E diz-se o que a página não pode fazer: é construída, e se não houver lançamento a data não muda |
| **Minor 4** · `published_at` | valida uma data que EXISTE: `2026-02-31` passava a expressão regular e passa a fechar a construção |
| **Minor 6** · o comentário | o bloco criado numa linha nova nomeia os dois programas que lá escrevem, e não só o `refresh.py` |

E do lado do motor, com o detalhe no relatório de lá: a invariante do arquivo
(B5+M9), os `304` sempre no índice (B7), o `real` armado por `schedule` mais
`CORREDOR_ARMADO` (B2), o estado de saída propagado (B3), os leitores como
portões e a ler o corpo arquivado (B4), o meio-dia sem carimbo (B8), o vigia a
escolher a corrida agendada da manhã (B9), o portão do vintage no fluxo (M5), o
calendário a reescrever (M6), o arquivo a empurrar antes do sítio (M11), o
artefacto com os corpos (M12) e a *issue* por linhas por rever (M10).

## 6 · As dúvidas que ficam

**1 · Duas formas de data no mesmo cabeçalho.** A leitura do painel mostra
`2026-08-31`; a das fontes mostra `01.09.2026 21:07 WEST`. A forma desta está na
§1.92; a do painel é anterior a tudo isto. Não mexi na do painel: é de outra
família e de outro bloco. Fica dito.

**2 · A poda das quatro e as 21 linhas cruzadas com uma entrada.** Ver §3: ao
quinto dia dessas 21, a régua do cruzamento fecha e elas têm de voltar a
atravessar. É o comportamento correcto e é uma coisa que vai acontecer; quem
funde deve sabê-lo.

**3 · A corrida `ensaio` no GitHub** corre depois da fusão em `master`, porque o
`workflow_dispatch` só resolve fluxos do ramo por omissão (§1.92(6)), e o
primeiro `real` é do diretor, que agora precisa também de pôr
`CORREDOR_ARMADO=sim` nas variáveis do repositório do motor.

## 7 · O que ficou por fazer, e diz-se

* **A página «O que mudou»**: não coube. O brief diz «se a folga chegar»; não
  chegou. A matéria-prima dela é o `corredor_report.md` que cada corrida escreve.
* **O portão do §5 ponto 5** (uma linha cuja verificação aponte a um vintage
  ausente fecha a construção): a função existe e está provada no motor
  (`arquivo.vintages_em_falta()`) e **não está ligada à construção do sítio**,
  porque nenhuma linha nomeia hoje um vintage. Liga-se quando as linhas passarem
  a guardar o sha256 da captura que leram.
* **`published_at` escrito nas linhas**: ver §2.4.

---

## 8 · Os ficheiros deste bloco no sítio

```
src/data/fontes.mjs                       gerado pelo corredor
src/components/SinalDasFontes.astro       a leitura do cabeçalho
src/components/Masthead.astro             monta-a na mobília
src/views/LinhaView.astro                 as três datas e o estado da fonte
src/lib/prova.mjs                         estadoDasFontes() e estadoDaFonte()
src/lib/ledger.mjs                        published_at e corredor-diario
src/i18n/strings.mjs                      as cadeias novas, nas duas edições
scripts/gate-html.mjs                     published_at e o rótulo do corredor
scripts/check-cruzamento.mjs              a reconferência acrescentada, provada
ledger/README.md                          as regras dos dois campos
ledger/allowlist.yml                      o motivo data-da-conferencia
ledger/claims/*.yml                       2 572 linhas com a conferência do dia
design/especime-v3/critica/REVISOES-DO-INVENTARIO.md   o rasto do bloco
```

Não se tocou em `src/views/HomeView.astro`, `src/components/inicio/*`,
`src/styles/inicio.css` nem em `tests/inicio/*`, que são da worktree
`cabeca-2026-09-01`. `tests/inicio/app.mjs` foi **corrido** para medir a altura do
cabeçalho, e não editado.

Modelo: Claude Opus 5.
