# Bloco F0.5 · uma só resolução por número · relatório do construtor

*Escrito pelo construtor (Claude Opus 5) a 02.09.2026, no ramo `resolucao-2026-09-02` dos dois repositórios. O bloco é o F0.5 do `design/observatorio/PLANO-fiabilidade-2026-09-02.md` §2, e fecha os dois achados da `AUDITORIA-2026-09-02.md` §5: «Duas especificações escritas duas vezes dão respostas diferentes» e «A única prova cruzada entre o motor e o sítio não é corrida por nada». Cada número deste relatório traz o comando que o produziu. Sem travessões na prosa.*

## 0 · O que estava partido, e o que fica

Três especificações estavam escritas duas vezes, uma em cada casa, e as três discordavam. Uma quarta prova cruzada existia e não era corrida por nada. Depois deste bloco:

| | antes | depois |
|---|---|---|
| o arredondamento de um meio | motor meio-para-o-par, sítio meio-para-longe-do-zero | os dois meio para longe do zero, e a decisão é editorial e está escrita |
| a aritmética das contas | motor `Decimal` de 28 algarismos, sítio `float64` | os dois com 28 algarismos e meio-para-o-par nas contas intermédias |
| a aceitação de uma derivação | motor igualdade exata, sítio tolerância de `1e-9` absoluta | os dois igualdade exata, por valor |
| a classe de espaço em branco da leitura do olho | motor `str.isspace()` (29 caracteres), sítio `\s` (25) | os dois a mesma lista escrita por extenso (24) |
| a prova cruzada da leitura do olho | existia, corrida por nada | dentro do `npm run verify` |
| a especificação partilhada | não existia | `core/derivacoes-paridade.json`, atravessada e avaliada pelos dois portões |

## 1 · O motor

### 1.1 `ROUND_HALF_UP` no avaliador

`core/derivations.py:192` fazia `val.quantize(quantum)`, e um `quantize` sem regra explícita usa a do contexto, que no `decimal` do Python é `ROUND_HALF_EVEN`. Passou a `val.quantize(quantum, rounding=ROUND_HALF_UP)` (`core/derivations.py:223`, com o `import` na linha 76). Em Python, `ROUND_HALF_UP` quer dizer «afastando do zero», que é o arredondamento que os publicadores portugueses imprimem e o que o sítio já fazia.

**Todos os outros sítios do avaliador onde se arredonda**, conferidos um a um:

| linha | operação | regra | mudou? |
|---|---|---|---|
| `core/derivations.py:223` | `round ( x , n )` | `ROUND_HALF_UP`, explícito | **sim** |
| `core/derivations.py:234` e `:237` | `*` e `/` | contexto: 28 algarismos, meio-para-o-par | não |
| `core/derivations.py:247` | `+` e `-` | contexto: 28 algarismos, meio-para-o-par | não |
| `core/derivations.py:258` | `_as_canonical` (`normalize()`) | não decide meio nenhum | não |
| `core/reconcile.py:132` | `canonical()` (`Decimal(s).normalize()`) | não decide meio nenhum | não |

Comando: `grep -n "quantize\|normalize\|round" core/derivations.py`.

Uma segunda diferença de gramática saiu ao mesmo tempo: o motor lia as casas do `round` com `int(digits_tok)`, que aceita `-1` e `+1`, e o sítio pede `^\d+$` e recusa os dois. Resolveu-se para o lado estreito (`core/derivations.py:209-217`): nenhuma linha dos dez livros pede outra coisa que não `1`.

    python3 -c "…"  →  casas pedidas ao round nos livros do motor: ['1']

### 1.2 Nenhum valor publicado se mexe

Todos os `check` dos dez livros que o portão re-deriva foram reavaliados com as duas regras, antes e depois, com o mesmo avaliador e o contexto trocado.

O comando, corrido da raiz do motor, avalia cada `check` com as duas regras e diz quantos resultados diferem:

    python3 -c '
    import json, decimal, sys
    from decimal import ROUND_HALF_EVEN, ROUND_HALF_UP
    from pathlib import Path
    sys.path.insert(0, ".")
    from core import derivations as D
    cfg = json.loads(Path("core/gate_baselines.json").read_text())
    r = {}
    for nome, regra in (("par", ROUND_HALF_EVEN), ("longe", ROUND_HALF_UP)):
        ctx = decimal.getcontext().copy(); ctx.rounding = regra
        for l in sorted({d["ledger"] for d in cfg["deliverables"]}):
            rows = json.loads(Path(l).read_text())["claims"]
            cl = {x["id"]: x for x in rows if x.get("id")}
            for row in rows:
                e = row.get("check")
                if not e or D.inherited_mark(e, cl, self_id=row.get("id")) is not None: continue
                guardado = decimal.getcontext(); decimal.setcontext(ctx)
                try: v = D._as_canonical(D.evaluate(e, cl, self_id=row.get("id")))
                finally: decimal.setcontext(guardado)
                r.setdefault((l, row["id"]), {})[nome] = v
    mexem = [k for k, v in r.items() if v.get("par") != v.get("longe")]
    print("linhas reavaliadas:", len(r), "| mexem:", len(mexem), mexem)
    print("conhecido-positivo:", D._as_canonical(D.evaluate("round ( 0.5 , 0 )", {})),
                                 D._as_canonical(D.evaluate("round ( 2.5 , 0 )", {})))
    '
    linhas reavaliadas: 308 | mexem: 0 []
    conhecido-positivo: 1 3

A segunda linha é o conhecido-positivo do próprio medidor, impressa antes de se acreditar no zero: se o `evaluate` deixasse de arredondar para longe do zero, ela dizia `0 2`, e a primeira corrida deste medidor (antes da mudança) trocava as duas regras e imprimia `HALF_EVEN 0 2` contra `HALF_UP 1 3`. Das 308, 307 usam `round()`; a 309.ª linha que o portão conta é a que herda uma marca impressa (o índice de Penedono) e não passa pelo avaliador.

    linhas re-derivadas nos dez livros: 309   (soma dos dez `python3 -m core.derivations <livro>`)

**Nenhum valor publicado se move: «nenhum».** Não há nada para o diretor decidir aqui.

### 1.3 A especificação partilhada

`core/derivacoes-paridade.json`, 19 casos e 6 recusas, só com números (um caso que citasse uma linha do livro-razão media o livro e não a aritmética). Casa escolhida: ao lado de `core/derivations.py` e de `core/derivations_test.py`, que é o módulo que ela especifica. Não foi para `publisher/fixtures/` porque essa pasta é, pelo seu próprio `ORIGEM.md`, o lugar onde aterram cópias **do sítio** para os testes do motor, e este ficheiro viaja no sentido contrário.

Atravessa com `publisher/cruzar_paridade.py` (novo), que copia os bytes tal e qual para `<sítio>/ledger/derivacoes-paridade.json` e escreve `<sítio>/ledger/cruzamentos/paridade.json` com os dois resumos. A cópia é byte a byte e por isso `origin_sha256` e `exported_sha256` são o mesmo: se forem diferentes, alguém editou uma das duas cópias.

    python3 -m publisher.cruzar_paridade --escrever --sitio <sítio>
    sha256 5cf0cd4337bd872f4369efd2666220855a9b01b8814461a090360e8f8e84d856

O mesmo resumo, medido dos dois lados:

    motor: python3 -m core.derivations_test          → core/derivacoes-paridade.json sha256 5cf0cd43…
    sítio: shasum -a 256 ledger/derivacoes-paridade.json → 5cf0cd4337bd872f4369efd2666220855a9b01b8814461a090360e8f8e84d856
    sítio: ledger/cruzamentos/paridade.json           → origin_sha256 e exported_sha256 iguais a esse

### 1.4 A classe de espaço em branco

`core/eyetext.py` dizia `str.isspace()` em cinco sítios. Passou a uma lista escrita por códigos (`core/eyetext.py:97-106`, `ESPACOS`), com `e_espaco()`, `apara()` e `apara_cabeca()` ao lado, e os cinco sítios a chamá-las (linhas 219, 315, 317, 341, 342, 369, 400). As duas expressões regulares `\s+` do módulo passaram a ser construídas da mesma lista (`core/eyetext.py:107-110`).

As três classes, medidas nos 69 632 primeiros pontos de código:

    python3 -c "…isspace…"  →  Python str.isspace(): 29 caracteres
    python3 -c "…re \\s…"   →  Python re \s:          29 caracteres (os mesmos)
    node -e "…/\\s/…"       →  JavaScript \s:         25 caracteres
    py isspace - js \s → U+001C U+001D U+001E U+001F U+0085
    js \s - py isspace → U+FEFF

A decisão: **um caractere que o olho vê como um espaço, e mais nenhum**, que é a interseção das duas, 24 caracteres. Entram os cinco espaços do HTML e o espaço, os separadores de espaço do Unicode (Zs), e os dois separadores de linha e de parágrafo. Não entra o U+FEFF, que tem largura zero e cuja compressão a um espaço punha na leitura um espaço que a página não imprime, que é o defeito que o `juntas()` deste módulo existe para medir. Não entram os U+001C a U+001F nem o U+0085, que nenhum navegador aperta.

A lista escreve-se por código e nunca por caractere, dos dois lados: uma lista de espaços em branco escrita com espaços em branco é a única lista que ninguém consegue rever.

## 2 · O sítio

### 2.1 A aritmética exata

`src/lib/decimal.mjs` (novo, 306 linhas) é o `decimal` do Python com o contexto que o motor corre, escrito em `BigInt`: um valor é `{ neg, coef, exp }`, as contas passam todas por um `ajusta()` que arredonda a 28 algarismos meio-para-o-par (o `_fix()` do Python), a divisão é o algoritmo do `_pydecimal.__truediv__` e o `arredonda()` é a `quantize(…, ROUND_HALF_UP)`. Sem uma única operação em vírgula flutuante.

**Porquê isto e não `decimal.js`.** A gramática das expressões `check` é `+ - * /`, parênteses e `round ( x , n )`, medido e não suposto:

    node -e "…"  →  total claims: 2916 | com check: 334 | com round(): 314
                    operadores usados: ( ) * + , - / round
                    casas pedidas ao round: 0 1 2

O que era preciso não era «decimais», eram **as regras do `core/derivations.py`**: a precisão de 28, o meio-para-o-par nas intermédias, o meio-para-longe-do-zero no `round`, a igualdade por valor. Uma biblioteca traz um contrato que é dela e teria de ser configurada para dizer o mesmo, com a configuração a ser a especificação escrita numa terceira forma. As regras escrevem-se no módulo, cada uma com o comentário ao lado da linha que a impõe, e provam-se contra o motor.

**A prova de que os dois motores dizem o mesmo**, por diferencial e não por argumento: 12 000 expressões geradas ao acaso (duas sementes), avaliadas pelo `core.derivations.evaluate` do motor e pelo `evaluateCheck` do sítio, e as cadeias canónicas comparadas.

    python3 gera-expr.py 20260902 6000 | (motor) | (sítio) | diff  →  6000 de 6000 iguais
    python3 gera-expr.py 777 6000      | (motor) | (sítio) | diff  →  6000 de 6000 iguais

A primeira corrida deu 10 diferenças, todas `-0` contra `0`: o `normalize()` do Python guarda o sinal do zero e o meu não guardava. Corrigido em `src/lib/decimal.mjs:113-127`, com a igualdade a tratar o zero à parte (`:129-136`), como o Python faz (`Decimal('-0') == 0` é verdade).

### 2.2 A aceitação exata

`src/lib/ledger.mjs:2176` fazia `Math.abs(calculado - publicado) > 1e-9`. Passou a `!calculado.igual(publicado)` (`src/lib/ledger.mjs:2176`), com o valor publicado lido por `parsePtDecimal()` em vez de `parsePtNumber()` (`src/lib/ledger.mjs:2144`).

A tolerância era absoluta e por isso cega à grandeza: numa linha de milhões não recusava nada, e numa linha pequena tapava o erro que o `check` existe para apanhar. O comentário do motor dizia, com razão, «there is no tolerance».

Para que as duas leituras de um valor publicado aceitem exatamente os mesmos valores, `parsePtNumber` foi partido em `normalizaPtNumero` (a normalização, que devolve a cadeia canónica) mais `parsePtNumber` (para quem desenha) e `parsePtDecimal` (para quem prova): `src/lib/ledger.mjs:706-745`. Duas normalizações escritas duas vezes foi como o `.5` divergiu.

### 2.3 Nenhum valor publicado se mexe, deste lado também

Antes da mudança, todos os 334 `check` do livro-razão foram avaliados em `float64` e comparados com o valor publicado:

    node -e "…"  →  checks com diferença exactamente 0 em float64: 333
                    checks com diferença != 0 (candidatos a mudar): 0

A tolerância de `1e-9` não estava a aceitar nada que a igualdade exata não aceitasse: todas as 333 linhas de aritmética batiam exatamente já em `float64` (a 334.ª é a marca de Penedono). Depois da mudança:

    npm run ledger:check   antes → 334 com aritmética reavaliada no build
    npm run ledger:check  depois → 334 com aritmética reavaliada no build

**Nenhum valor publicado se move, dos dois lados: «nenhum».** O comando do «antes» foi corrido com as mudanças guardadas (`git stash push -u`) e a árvore reposta e conferida ficheiro a ficheiro por sha256 (10 de 10 iguais).

### 2.4 A divisão por zero

`1 / 0` dava `Infinity` em `float64` e passava adiante sem atirar; o motor recusava. Agora recusa dos dois lados (`src/lib/decimal.mjs:224` e `:243`, `DivisaoPorZero`), e o caso está na especificação partilhada.

### 2.5 A classe de espaço em branco

`src/lib/eyetext.mjs` dizia `\s` em cinco sítios. Passou à mesma lista escrita por códigos (`src/lib/eyetext.mjs:102-148`: `ESPACOS`, `eEspaco`, `apara`, `cabecaDeEspaco`, `apertaEspacos`), com os cinco sítios a chamá-las. O `temClasse()` (linha 185) fica com `\s` de propósito, e a razão está escrita ao lado: lê um atributo `class` do HTML, que o motor não lê de todo, e a norma do HTML separa os nomes de classe pelos cinco espaços ASCII.

### 2.6 O `check:cruzamento` aprendeu um destino

O registo de travessia de um ficheiro dizia onde o ficheiro aterrava sabendo-o de cor (`src/data`). A especificação da aritmética aterra em `ledger/`, ao lado das linhas que governa, e por isso a entrada ganhou um campo `destino`, opcional, com `src/data` por omissão (`scripts/check-cruzamento.mjs:418-437`, com o campo na linha 429 e a pasta na 432). E a mensagem de um ficheiro editado à mão passou a nomear o exportador que o registo declara, em vez de nomear sempre o `export_agenda.py`.

### 2.7 A prova da leitura do olho dentro do `verify`

Uma linha no `package.json`: `"provar:eyetext": "node scripts/provar-eyetext.mjs"` e o mesmo no fim da cadeia do `verify`. Não entrou no `build`: o que ela prova é uma paridade entre duas casas e não uma propriedade das páginas construídas, e a medida de aceitação do plano diz `verify`.

## 3 · A tabela dos quatro casos, medida nos dois motores

Os comandos, os quatro. O «antes» do motor é o que o `val.quantize(quantum)` sem regra dava, medido diretamente com o `decimal` no contexto por omissão; o «antes» do sítio é o `evaluateCheck` corrido com a árvore ainda por mudar; os dois «depois» foram medidos na mesma sessão, com o código que este bloco entrega:

    motor antes:  python3 -c "from decimal import Decimal; print(Decimal('0.5').quantize(Decimal(1)))"
    sítio antes:  node -e "…evaluateCheck('round ( 0.5 , 0 )', {claims:new Map()})…"
    motor depois: python3 -c "…D.evaluate('round ( 0.5 , 0 )', {})…"
    sítio depois: node -e "…evaluateCheck('round ( 0.5 , 0 )', {claims:new Map()}).canonica()…"

Em negrito, o valor que difere do que a casa publica agora.

| expressão | motor antes | sítio antes | motor depois | sítio depois |
|---|---|---|---|---|
| `round ( 0,5 , 0 )` | **0** | 1 | 1 | 1 |
| `round ( 1,5 , 0 )` | 2 | 2 | 2 | 2 |
| `round ( 2,5 , 0 )` | **2** | 3 | 3 | 3 |
| `round ( -0,5 , 0 )` | **-0** | -1 | -1 | -1 |
| `round ( 0,125 , 2 )` | **0,12** | 0,13 | 0,13 | 0,13 |
| `round ( 1,005 , 2 )` | **1,00** | **1** | 1,01 | 1,01 |
| `1 / 3` | 0,3333333333333333333333333333 | **0,3333333333333333** | 0,3333333333333333333333333333 | 0,3333333333333333333333333333 |
| `0,1 + 0,2` | 0,3 | **0.30000000000000004** | 0,3 | 0,3 |

Os quatro primeiros são os empates do brief. O quinto mostra que o empate não é só na casa das unidades. O sexto é o único em que as duas casas concordavam **e as duas estavam erradas**: o motor por arredondar para o par e o sítio por multiplicar `1,005` por 100 em `float64` e obter `100.49999999999999`. Os dois últimos são a aritmética por baixo do arredondamento.

## 4 · Os conhecidos-positivos, vermelhos e depois verdes

Cada planta foi posta, corrida, e reposta com o sha256 do ficheiro conferido antes e depois.

| # | planta | onde | vermelho | verde |
|---|---|---|---|---|
| 1 | a regra velha do arredondamento (`quantize(quantum)` sem regra) | `core/derivations.py` (sha antes e depois `105e7d9d…`) | `python3 -m core.derivations_test` **exit 1**, 13 problemas: os 4 empates, os 3 valores do meio-para-o-par aceites, 6 casos da especificação | `exit 0`, `PASS — 49 checks` |
| 2 | um valor esperado errado na especificação (`round ( 2.5 , 0 )` a esperar 2) | `core/derivacoes-paridade.json` (sha antes `e8523d58…`, reposto e depois emendado duas vezes, para `04a824a9…` e para `5cf0cd43…`) | motor `exit 1` e sítio `exit 1`, os dois com «`round ( 2.5 , 0 )` dá 3 e a especificação diz 2» | os dois `exit 0` |
| 3 | um byte a mais na cópia cruzada do sítio | `ledger/derivacoes-paridade.json` (sha reposto `5cf0cd43…`) | `node scripts/check-cruzamento.mjs` **exit 1**: «os bytes em disco já não são os que atravessaram», com os dois resumos e o exportador certo | `exit 0` |
| 4 | a classe velha do Python (`str.isspace()`) | `core/eyetext.py` (sha antes e depois `1a60d7fa…`) | `python3 -m core.eyetext_test` **exit 1**, 6 problemas: os cinco U+001C a U+0085 e a conta da classe | `exit 0`, `PASS — 33 checks` |
| 5 | a classe velha do JavaScript (`/\s/`) | `src/lib/eyetext.mjs` (sha antes e depois `ed1e9b82…`) | `node scripts/provar-eyetext.mjs` **exit 1**, 2 problemas: o U+FEFF apertado a um espaço e aparado da ponta | `exit 0`, `PASSA — 595 conferências` |
| 6 | o arredondamento em `float64` que estava no sítio antes deste bloco | `src/lib/decimal.mjs` (sha antes e depois `e0378c12…`) | `npm run ledger:check` **exit 1**, 3 erros: o caso `round ( 1,005 , 2 )` da especificação, e as duas plantas de ponta a ponta que ele governa (uma aceite que tinha de ser recusada, uma recusada que tinha de passar) | `exit 0` |

E as plantas que ficam a correr sozinhas em cada corrida, dentro do `npm run ledger:check`: doze linhas de um livro-razão de mentira numa pasta temporária, pela porta `OEDP_LEDGER_DIR`, avaliadas noutro processo (o livro-razão resolve-se uma vez por processo e fica em cache). Seis têm de passar e seis têm de ser recusadas (contadas do ficheiro: `node -e "…bloco das plantas…"` diz `verdes: 6 | vermelhas: 6 | total: 12`, e 19 casos mais 6 recusas mais 12 plantas são as 37), e entre elas estão os quatro empates, a divisão `23 / 80 × 100` (28,75 exatos, `28.749999999999996` em `float64`) e as duas derivações que o `float64` aceitava: `1 / 3 * 3` publicado como 1, e `round ( 1,005 , 2 )` publicado como 1.

    npm run ledger:check  →  aritmética · 37 conferência(s)

O processo filho é chamado com o caminho do módulo passado como `file://` e com o erro apanhado: se o livro-razão de mentira não chegar a ser lido, isso é dito como um problema e não como um verde. Uma prova que passasse por a planta não ter corrido era pior do que não ter prova nenhuma.

## 5 · As contagens dos portões, antes e depois

| | antes | depois | comando |
|---|---|---|---|
| `core.derivations_test` | 15 checks | **49** checks | `python3 -m core.derivations_test` |
| `core.eyetext_test` | 21 checks | **33** checks | `python3 -m core.eyetext_test` |
| `scripts/provar-eyetext.mjs` | 583 conferências | **595** conferências | `node scripts/provar-eyetext.mjs` |
| `scripts/check-ledger.mjs` | (não havia) | **37** conferências de aritmética | `npm run ledger:check` |
| linhas com aritmética reavaliada (sítio) | 334 | 334 | `npm run ledger:check` |
| linhas re-derivadas (motor, dez livros) | 309 | 309 | soma dos dez `python3 -m core.derivations` |

## 6 · Os tempos

| | antes | depois | comando |
|---|---|---|---|
| `npm run verify` | 57,29 s | 56,29 s e 61,11 s (duas corridas) | `/usr/bin/time -p npm run verify` |
| `npm run provar:eyetext` sozinho | (não corria) | 0,24 s | `/usr/bin/time -p npm run provar:eyetext` |
| `npm run ledger:check` | | 0,35 s | `/usr/bin/time -p npm run ledger:check` |
| `npm run build` | | 4 min 39 s | `time npm run build` |
| `python3 -m core.gate` | | 145,73 s | `/usr/bin/time -p python3 -m core.gate` |

O `verify` não engordou de forma mensurável: as duas peças novas somam menos de 0,6 s e o tempo do `verify` é dominado pelo `gate:html` sobre 7 218 páginas, cuja variação entre corridas (56 a 61 s) é maior do que o que se acrescentou. O `provar-eyetext` é rápido (0,24 s com o arranque do `npm` e do `node` incluídos), muito abaixo dos 30 s da pergunta do brief.

## 7 · O que ficou de fora, e o buraco que resta

**O que resta por fechar, dito às claras.** O motor prova a sua cópia da especificação (`core.derivations_test`), e o sítio prova que a sua cópia é, byte a byte, a que o registo de travessia declara (`check:cruzamento`, em cada `build` e em cada `verify`). O que nenhuma corrida automática confere é a **terceira** comparação: a cópia do sítio contra o ficheiro que o motor tem hoje em disco. Isso é o modo `--with-origin`, que a casa já trata assim para as outras travessias e pela mesma razão (a construção acontece num construtor remoto onde o motor não existe):

    RESEARCHHUB_DIR=<motor> node scripts/check-cruzamento.mjs --with-origin   → exit 0
    python3 -m publisher.cruzar_paridade --conferir --sitio <sítio>            → PASSA — 2 conferencias

O caminho que fecharia isto sozinho é a especificação entrar na cópia versionada do sítio (`publisher/fixtures/site-min`), o que exige que ela exista primeiro no `main` do sítio: fica para um bloco a seguir, e não se fez agora porque o `refrescar_site_min.py` toma a cópia de um clone limpo do `main`.

**O que não entrou:** o `provar-eyetext` não foi para o `build` (a medida do plano diz `verify`); o `temClasse` do `src/lib/eyetext.mjs` fica com `\s`, com a razão escrita ao lado; e nenhum valor publicado foi tocado, porque nenhum se mexia.

## 8 · Os ficheiros

**Motor** (`~/Instruments/ResearchHub-worktrees/resolucao-2026-09-02`, ramo `resolucao-2026-09-02`):

| ficheiro | o quê |
|---|---|
| `core/derivations.py` | `ROUND_HALF_UP` no `round`, as casas sem sinal, as três regras escritas na cabeça do módulo |
| `core/derivations_test.py` | os cinco empates, os três valores do meio-para-o-par recusados, as casas negativas, e a especificação partilhada |
| `core/derivacoes-paridade.json` | **novo**, a especificação: 19 casos e 6 recusas |
| `core/eyetext.py` | a classe de espaço escrita por extenso, e as cinco chamadas |
| `core/eyetext_test.py` | os seis pontos de código cruzados, cinco espaços da classe, e a conta |
| `publisher/cruzar_paridade.py` | **novo**, a travessia da especificação e o registo dos dois resumos |

**Sítio** (`.claude/worktrees/resolucao-2026-09-02`, ramo `resolucao-2026-09-02`):

| ficheiro | o quê |
|---|---|
| `src/lib/decimal.mjs` | **novo**, a aritmética da casa em `BigInt` |
| `src/lib/ledger.mjs` | o avaliador em decimais exatos, a aceitação exata, `parsePtDecimal` |
| `src/lib/eyetext.mjs` | a classe de espaço escrita por extenso, e as cinco chamadas |
| `scripts/check-ledger.mjs` | a prova da aritmética: a especificação e os doze estragos plantados |
| `scripts/check-cruzamento.mjs` | o campo `destino` e o exportador certo na mensagem |
| `scripts/provar-eyetext.mjs` | os seis pontos de código cruzados, e a nota de que corre no `verify` |
| `package.json` | `provar:eyetext`, e a linha no `verify` |
| `tests/municipio/vazios.mjs` | a comparação A3 por valor, agora que o avaliador devolve um decimal |
| `ledger/derivacoes-paridade.json` | **novo**, a cópia cruzada |
| `ledger/cruzamentos/paridade.json` | **novo**, o registo da travessia |
