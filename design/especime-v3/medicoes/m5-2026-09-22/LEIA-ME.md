# M5 · As medições de um brief e de um relatório provam que veem, e o nome do diretor sai do código

Construtor: Claude Opus 5, 22.09.2026, na worktree `medidas-2026-09-22`, sobre `main` em `b03a6efc`.\
Brief: `design/observatorio/BRIEF-M5-as-medicoes-provam-que-veem.md`.\
Duas passagens: a construção, e a passagem de correção da tarde, depois da leitura a frio do Codex. Este ficheiro é o da segunda; o que a primeira mediu e o que mudou entre as duas está na última secção antes dos portões.\
Nenhum número deste relatório se escreve de cabeça: sai de `medir-m5.py`, que escreve `medidas.json` ao lado e sai com código diferente de 0 se alguma conferência subordinada falhar. O `conferir-relatorio.py` sobre este ficheiro e esta pasta está a zero faltas, e a saída é `conferir-relatorio-m5.txt`.

## O que ficou feito

| # | O que o brief mandou | A medida |
|---|---|---|
| `1` | O formato do bloco `medidas` e o guião deste brief, com o conhecido-positivo de cada medição | `design/observatorio/medidas/BRIEF-M5.py` escreve `BRIEF-M5.json` com 8 medições e 8 conhecidos-positivos encontrados numa corrida fresca |
| `2` | `check:briefs` na cadeia `verify`, com a isenção por data dita | 37 briefs em `design/observatorio/`, 1 conferido, 33 isentos por data, 3 isentos por nomeação, e 8 números do §0 ligados à sua medição |
| `3` | `conferir-relatorio.py` corrido sobre os quatro relatórios de 22.09 | a tabela do §3, sem emendar relatório nenhum |
| `4` | `pacote.sh` a correr o guião e a incluir a saída | o ensaio guardado em `ensaio-pacote-numeros-do-relatorio.txt`, e a prova de que um código 2 não cria o pacote |
| `5` | As quatro plantas a morder | 8 plantas corridas, 8 morderam, 8 com os bytes repostos |
| `6` | O nome fora do código, com a célula | 0 ficheiros com o nome em 276 lidos de `src/` e `public/`; 0 páginas em 7 354 construídas |
| `7` | O mapa posto em dia e os três portões a 0 na cabeça final | as linhas do mapa, e a tabela dos portões no fim |

## 1 · O bloco `medidas` de um brief

Um brief datado de 22.09.2026 ou depois declara as suas medições num guião ao lado: `design/observatorio/medidas/<chave>.py` ou `.mjs`, que corre sem argumentos a partir da raiz e escreve `design/observatorio/medidas/<chave>.json`. A chave é `BRIEF-` mais o primeiro campo do nome do ficheiro. Cada medição traz quatro campos, e os dois últimos são o que faz dela uma medição e não uma afirmação:

| Campo | O que é |
|---|---|
| `nome` | o nome por que o §0 o cita, entre crases, na frase onde escreve o número |
| `valor` | o que se mediu |
| `comando` | o comando que reproduz ESSE valor, ou que diz o que reproduz |
| `conhecido_positivo` | `{ o_que, encontrado }`: um caso que o MESMO predicado tem de dar por positivo |

O portão corre o guião com `OEDP_MEDIDAS_JSON` a apontar para um ficheiro temporário, e compara-o com o que está no repositório: a comparação é entre o que se mede hoje e o que estava escrito, e nunca entre o ficheiro e ele próprio, que é o defeito que a leitura a frio de 01.09.2026 apanhou no oráculo do rótulo. O ficheiro nomeia também o brief que foi conferido e o guião que correu, e o portão recusa se um deles não for o caminho certo.

**Um conhecido-positivo é do mesmo predicado que o valor.** A primeira passagem deste bloco tinha um que não era: para medir quantas exportações de `politica-ia.mjs` escrevem o nome de quem responde, provava que o ficheiro se lia, encontrando lá `LINGUA_DO_RESPONSAVEL`. Isso prova que se consegue ler, não que se consegue apanhar. Passou a construir no momento uma linha `export const … = '<o nome lido do oráculo>'` e a passá-la pela MESMA função que produz o valor, exigindo 1. Os outros sete seguem a mesma forma.

**Uma medição de um brief é estável de propósito, e isso é uma regra do formato.** O portão volta a correr o guião em cada `verify`. Uma medição que andasse com o trabalho de todos os dias (quantos briefs existem, quantos ficheiros tem `src/`) punha o portão vermelho no dia seguinte e obrigava a reescrever o §0 de um brief antigo, que é o que o §3 do brief proíbe. Por isso as contagens de briefs ancoram-se na data do brief («até 22.09.2026») e as outras são invariantes que um portão já protege.

## 2 · O portão, e a ligação de cada número à sua medição

**A ligação é por frase, e é a correção que mais importa desta passagem.** A primeira forma da célula só exigia que o número existisse algures no conjunto de todos os valores e formas do ficheiro: um «37» falso passava porque 37 era a contagem de outra coisa, e a célula dizia «medido» de um número que ninguém mediu. A leitura a frio apontou-o. Agora uma frase do §0 acaba em ponto final, ponto e vírgula ou mudança de linha; numa frase com números, pelo menos um pedaço entre crases tem de ser o nome de uma medição declarada, e os outros pedaços entre crases ignoram-se, porque são código; e cada número dessa frase tem de ser o valor de uma das medições nomeadas nessa frase. O portão imprime a ligação, número a número:

```
      §0 liga «37» a `briefs_ate_22_09_2026`
      §0 liga «34» a `briefs_com_seccao_de_medicoes`
      §0 liga «1» a `briefs_com_guiao_de_medicoes`
```

São 8 as ligações que o §0 deste brief faz, uma por medição.

**A regra de escrita que isto obriga:** num §0 um número escreve-se em algarismos. O leitor não lê numerais por extenso, e não deve: «uma» e «um» são artigos, e um dicionário de numerais ou apanhava artigos ou deixava passar contagens. Um número por extenso num §0 é uma afirmação que o portão não vê. Está dito no cabeçalho do `check-briefs.py` e no do `numeros.py`, com o resto do que fica de fora, e as contagens do que se apagou saem na saída de cada corrida.

**A data de um brief é a mais recente entre a do nome do ficheiro e a primeira do cabeçalho.** Ler só o nome deixava um brief escrito hoje, com um nome datado de ontem, escapar ao corte.

**A isenção está presa pelo sha256.** `design/observatorio/medidas/isentos.json` guarda o caminho e o resumo de cada brief isento. Sem isto a isenção por data era uma porta: bastava emendar um brief antigo para lhe pôr lá dentro o que se quisesse, sem nada a dizer. Um brief isento que mude fecha o portão até a lista ser posta em dia num diff que se vê, tal como a lista dos três nomeados.

**A contradição que o brief tem com os dados, medida e dita.** O brief manda conferir «cada brief com data igual ou posterior a 22.09.2026» e isentar os anteriores por data. Três briefs de 22.09.2026 caem dentro desse corte e foram escritos pelo lugar de direção nesse mesmo dia, antes de esta regra existir: o B1c, a I129 e o M3b. A razão de não se poder cumprir o corte à letra é medida: o §0 do B1c afirma que a página das correções tinha zero linhas datadas, e o construtor mediu dezasseis. Exigir que esse número ligasse a uma medição obrigava a escrever um ficheiro de medição com um número errado lá dentro, ou a reescrever o §0 de um brief antigo. A isenção por nomeação é uma lista fechada de três nomes com a razão ao lado de cada um, e o portão sai com 2 se a lista crescer sem que a linha que a conta mude com ela. **O lugar de direção decide se fica assim ou se o corte passa a ser outro.**

**Uma chave repetida, achada pelo portão e dita.** Dois briefs com a mesma chave partilhariam um ficheiro de medições, e nenhum dos dois ficava medido. O portão fecha quando pelo menos um dos colididos está sob a regra. Há uma colisão hoje, entre dois briefs anteriores ao corte, os dois com a chave `BRIEF-fatia`: não fecha, porque nenhum deles tem nem vai ter ficheiro de medições, mas sai na saída do portão em cada corrida, e passa a fechar no dia em que um deles deixar de ser isento. Não se renomeia um brief antigo por causa disto; um brief novo escolhe uma chave que ainda não exista.

As duas leituras conferem-se uma à outra, e **as três chaves que elas comparam são obrigatórias**: faltar uma é erro, e não uma comparação que se salta a si própria em silêncio. Na primeira passagem uma delas não existia, e a comparação desse número nunca corria.

O portão entra na cadeia `verify` a seguir ao `check:documentos` e antes do `gate:html`, e é o primeiro portão da casa escrito em Python. Corre em menos de um segundo e não lê `dist/`.

## 3 · Os números dos quatro relatórios de 22.09, medidos e não emendados

`python3 scripts/leituras/conferir-relatorio.py <relatório.md> <pasta>`: cada número do relatório, fora de código, endereços, secções, datas, resumos, ordinais, identificadores e anos isolados, tem de existir num JSON da pasta ao lado. O conhecido-positivo corre primeiro: o guião escolhe um número que não está em nenhum dos ficheiros lidos, passa-o pelo mesmo detetor, e sai com 2 sem dizer «zero em falta» se o detetor não o apontar. Nos quatro, o conhecido-positivo foi encontrado.

| Relatório | Ficheiros JSON na pasta | Números conferidos | Com ficheiro | **Sem ficheiro** |
|---|---:|---:|---:|---:|
| `b1-2026-09-22/LEIA-ME-peca3.md` | 26 | 170 | 150 | **20** |
| `m3b-2026-09-22/LEIA-ME.md` | 2 | 94 | 61 | **33** |
| `i129-2026-09-22/LEIA-ME.md` | 1 | 131 | 77 | **54** |
| `b1c-2026-09-22/LEIA-ME.md` | 6 | 179 | 129 | **50** |

As saídas inteiras, com a linha e o contexto de cada número sem ficheiro, ficam em `conferir-relatorio-b1-peca3.txt`, `conferir-relatorio-m3b.txt`, `conferir-relatorio-i129.txt` e `conferir-relatorio-b1c.txt`. Nenhum dos quatro relatórios foi tocado.

**O que a lista mostra, lida.** A maior parte do que falta não é um número inventado: são medidas que o construtor leu de uma saída de portão ou de um `git diff` e escreveu no relatório sem as guardar num ficheiro (contagens de plantas, de ficheiros mudados, de achados de uma leitura a frio), e alturas e larguras de capturas que ficaram na cabeça e não no JSON das capturas. A I129 é a que tem a maior proporção porque a sua pasta só traz 1 JSON, o das medições da linha, e o relatório conta também o que se passou no motor, que não tem ficheiro deste lado. A classe que interessa é a mesma em todos: um número que ninguém pode voltar a medir a partir dos ficheiros do bloco.

**Estas contagens foram corrigidas três vezes, e foi sempre uma planta a apanhá-lo, nunca uma leitura.** A planta do número inventado deixou de morder quando a pasta das medições deste bloco ganhou os resumos sha256 das plantas. Quatro buracos, e nenhum se via a ler: o lado do JSON contava os algarismos de dentro de uma cadeia sem lhe aplicar as regras que aplicava ao texto, e um número encontrava par por acaso dentro de um resumo; o índice das plantas guarda em cada entrada a `mordida`, que nesta planta é o próprio número plantado, e um índice de uma corrida anterior punha-o no monte; um bloco cercado trocado por espaços comia as mudanças de linha, e a saída apontava a linha errada; e faltavam ao leitor o número de um título de Markdown, que nomeia uma secção, e a versão de um modelo colada ao nome dele, que está no cabeçalho de todos os relatórios de construtor.

## 4 · O pacote de leitura

O `pacote.sh` corre o guião sobre o relatório do bloco **antes de copiar seja o que for**, e põe a saída em `<pacote>/numeros-do-relatorio.txt`, com o código de saída escrito lá dentro. Um código 1 («há números sem ficheiro») entra no pacote e o pacote monta-se. Um código 2 («o guião não correu, ou o conhecido-positivo falhou») **não cria o pacote**: na primeira passagem a conferência corria no fim, depois de o pacote já estar montado, e um código 2 deixava um pacote meio feito com a promessa por cumprir.

Ensaiado das duas maneiras. Sobre o relatório do B1c, o pacote montou-se e a saída ficou lá dentro, guardada aqui em `ensaio-pacote-numeros-do-relatorio.txt` com a linha de saída do `pacote.sh`. E com uma pasta de medições onde um JSON está estragado, o guião saiu com 2, o `pacote.sh` disse-o e a pasta do pacote não chegou a existir.

## 5 · As plantas

| Grupo | Planta | Ficheiro | Comando | Código | Mordeu | Bytes repostos |
|---|---|---|---|---:|---|---|
| o bloco `medidas` | `valor-trocado` | `medidas/BRIEF-M5.json` | `check:briefs` | 1 | sim | sim |
| o bloco `medidas` | `conhecido-positivo-cego` | `medidas/BRIEF-M5.py` | `check:briefs` | 1 | sim | sim |
| o bloco `medidas` | `numero-do-zero-sem-medicao` | o próprio brief | `check:briefs` | 1 | sim | sim |
| o bloco `medidas` | `numero-certo-no-nome-errado` | o próprio brief | `check:briefs` | 1 | sim | sim |
| o bloco `medidas` | `brief-isento-com-um-byte-mudado` | um brief de 03.09.2026 | `check:briefs` | 1 | sim | sim |
| os números de um relatório | `numero-do-relatorio-sem-ficheiro` | este relatório | `conferir-relatorio.py` | 1 | sim | sim |
| o nome de quem responde | `nome-numa-cadeia-de-uma-vista` | `src/views/SobreView.astro` | `gate:html` | 1 | sim | sim |
| o nome de quem responde | `nome-numa-pagina-construida` | `dist/sobre/index.html` | `gate:html` | 1 | sim | sim |

São 8 e não as 4 que o brief pede: a célula do nome tem duas metades, o código-fonte e a página construída, e a ligação por frase tem duas maneiras de falhar que não são a mesma. **A quarta é a que prova a correção desta passagem:** planta um número CERTO ao lado do nome de OUTRA medição, e o portão recusa, porque a ligação é por frase e não uma procura no monte de todos os valores. **A segunda prova o formato:** o valor da medição não muda com ela, só o detetor deixa de ver, e o portão recusa na mesma. **A quinta prova a isenção:** um byte mudado num brief isento fecha o portão.

O guião das plantas apaga o seu próprio índice antes de plantar, pela mesma razão por que os ficheiros dos códigos se apagam antes de cada corrida dos portões (M16), e pára quando um estrago não muda o ficheiro, que foi como apanhou uma planta desatualizada nesta passagem. As saídas ficam em `planta-<nome>.log` e o índice em `plantas-m5.json`, com os dois sha256 de cada ficheiro, iguais em todas.

## 6 · O nome do diretor fora do código

Medido antes: o nome estava em `src/data/politica-ia.mjs` (uma constante exportada, `RESPONSAVEL_EDITORIAL`, e três menções em comentários) e em `src/styles/site.css` (um comentário). Medido em `dist/`: nenhuma página o rendia.

**A célula do `gate:html` mudou de forma conservando o que protegia, e o brief mandou ler o oráculo antes de mexer.** O que ela protegia era que o nome de quem responde fosse uma cadeia só no dia em que uma página o rendia: comparava a constante de `src/` com o oráculo `scripts/textos-aprovados.json`, e exigia que a regra 9 do Método imprimisse o nome se o rótulo o imprimisse, e não o imprimisse se o rótulo não o imprimisse.

**Lido antes de mexer, e medido e não inferido.** O oráculo guarda o nome; o rótulo composto não o contém; a regra 9 do Método (`src/data/metodo.mjs`, `intervencao-humana`) diz «A direção é de uma pessoa, que escolhe o que se publica e responde por ele» e «It is directed by one person, who chooses what gets published and answers for it», e não nomeia ninguém; e nenhuma das páginas construídas o rende. **O oráculo não imprime o nome em página nenhuma, e por isso a célula podia mudar.**

**Um achado pelo caminho, e é do lado de lá da célula antiga.** A metade que procurava o nome nas regras do Método lê os pedaços `{ forte: … }` das 10 regras. Corrido com um leitor próprio: as regras têm hoje 0 pedaços `forte`, porque o P1 tirou o nome da regra 9 a 15.09.2026 e com ele o negrito. Essa metade estava, portanto, a comparar contra uma lista vazia: um nome que voltasse a uma regra noutra forma passava por ela sem ninguém ver. Não se mexeu nela, porque o que ela protege continua a ser o par rótulo/regra; o que fica é que **a metade nova cobre esse buraco por inteiro**, e não por acaso: `src/data/metodo.mjs` é um ficheiro de `src/`, e um nome escrito lá, em qualquer forma, fecha agora a construção. Fica dito para o lugar de direção.

A célula passou a exigir duas coisas, e as duas contam:

- o nome não existe em ficheiro nenhum de `src/` e de `public/`: 0 em 276 lidos, contado uma vez antes do varrimento;
- o nome não se rende em página nenhuma de `dist/`: 0 em 7 354, contado página a página, antes de qualquer saída antecipada, de modo que os documentos de estudo alojados também entram.

**O detetor prova primeiro que vê.** Antes de contar, o mesmo `veONome()` passa por uma linha escrita com o nome, e a construção fecha ali se não a apanhar; e uma varredura de `src/` e `public/` que não leia ficheiro nenhum é erro e não zero. As duas contagens vão à saída do portão, à vista.

**O que mudou fora da célula.** A constante saiu de `src/data/politica-ia.mjs`, e o comentário que ficou no lugar dela diz onde o nome mora agora e o que a célula protege. O comentário de `src/styles/site.css` passou a dizer «o nome do responsável editorial» onde citava o nome. A L9 do `check:lingua`, que também importava a constante para conferir um `[data-rotulo-nome]` rendido, passou a ler o nome do mesmo oráculo: mede exactamente o que media, e o oráculo é mais independente do que o ficheiro que rende. `LINGUA_DO_RESPONSAVEL` ficou onde estava, porque é uma etiqueta de língua e não um nome.

**A classe da célula é P**, proteção de uma pessoa. Se o nome tiver de voltar a uma página, volta por decisão escrita em `DECISIONS.md` e a célula muda com ela.

O nome continua a existir no repositório fora de `src/` e `public/`: no oráculo, onde é preciso, e em `DECISIONS.md`, no `INVENTARIO-FRASES.md`, nas leituras a frio e nos rascunhos da voz, que são registo e não se emendam.

## 7 · O mapa do repositório

O mapa ganhou: a cadeia do `verify` com o `check:briefs`; a contagem de portões distintos, com o `check:briefs` somado à que lá estava; a linha do `check:briefs` na tabela dos portões que não leem `dist/`, com as suas células; o formato do bloco `medidas` de um brief e o `conferir-relatorio.py` no §4, com as quatro contagens de 22.09; e a célula do nome de quem responde na secção do `gate:html`, com as suas duas metades.

São 3 as citações que este bloco acrescentou ao mapa com referência de linha, uma por guião novo. A corrida do `scripts/leituras/conferir-mapa.py` fica guardada em `conferir-mapa.txt`, com o sha256 do mapa no momento da leitura, porque o mapa é mantido pelo lugar de direção e pode mudar depois desta medição. **A deriva de linha que resta no mapa é anterior a este bloco**, e o guião localiza-a: o mapa diz na cabeça que a âncora é a citação e não a linha, e que os números andam com cada commit.

## 8 · O que ficou por fazer, e porquê

- **O corte da isenção.** A lista fechada de três nomes é a forma conservadora de cumprir o brief sem reescrever um brief antigo. Se o lugar de direção preferir um corte noutro sítio (por exemplo, «a partir do brief M5»), a mudança é de uma constante e de uma lista no cabeçalho do `check-briefs.py`.
- **A chave `BRIEF-fatia`, repetida entre dois briefs isentos.** Dita na saída do portão em cada corrida, e não fatal enquanto os dois forem isentos. Fica para o lugar de direção.
- **Os números sem ficheiro dos quatro relatórios de 22.09 não se corrigiram**, por decisão do brief: mede-se o que falha e diz-se. A tabela do §3 é essa medida.
- **Os ficheiros antigos com caminhos absolutos.** Os ficheiros de saída deste bloco escrevem caminhos relativos à raiz, e o `conferir-relatorio.py` imprime-os relativos ao diretório de trabalho. Há ficheiros de blocos anteriores em `design/especime-v3/medicoes/` com `/Users/…` lá dentro; não se tocam neste bloco, e ficam registados pelo lugar de direção.
- **O `check:briefs` não confere que a frase à volta de um número diga o que o número mede.** Confere que o número é o valor da medição nomeada na sua frase. Um número por extenso não se vê, e por isso a regra de escrita. Os dois limites estão ditos no cabeçalho do guião.
- **O `check:briefs` é o primeiro portão da casa em Python**, e a CI corre em `ubuntu-24.04`. Se o anfitrião não trouxer `python3`, o portão falha alto e não em silêncio; a primeira corrida da CI confirma-o.

## 9 · Os commits, a cabeça e os três portões

A cabeça sobre a qual os três portões correram: `d90e6d10c663ca42480e0f94b689ba6a086af00f`, no ramo `medidas-2026-09-22`, sobre `main` em `b03a6efc`. Os commits, do mais antigo para o mais recente:

- `a71dae9b` M5: o nome do diretor sai do código, e a célula do portão muda de forma
- `35cec254` M5: o bloco `medidas` de um brief, o `check:briefs` no `verify`, e este brief a cumpri-lo primeiro
- `fec84cf0` M5: o `conferir-relatorio.py`, e o `pacote.sh` a corrê-lo ao montar um pacote
- `50c03557` M5: o mapa ganha o `check:briefs`, os dois guiões e a célula do nome
- `0aa2e8c9` M5: o relatório, as suas medições, as seis plantas e as quatro leituras de 22.09
- `415b6866` M5: o leitor dos números aperta a regra dos artigos, e a prosa nova fica sem travessões
- `3571da4c` M5: uma planta apanhou quatro buracos no leitor dos números, e as contagens são outras
- `44a718b4` M5: as saídas dos três portões na cabeça final, e a tabela deles
- `38d48e04` M5 correção: cada número do §0 liga à sua medição pela frase, e a isenção fica presa pelo resumo
- `0661f669` M5 correção: o pacote confere antes de copiar, e os caminhos saem relativos
- `020e8bdb` M5 correção: o relatório, as oito plantas e os artefactos das corridas de ensaio
- `d90e6d10` M5 correção: o guião que escreve o §9 passa a viver no bloco, e as chaves cruzadas usam a sua lista

Os três portões, cada um no seu comando, com o código de saída lido de um ficheiro acabado de escrever e não de um `echo` atrás de um `|`. Os ficheiros `.codigo` foram apagados antes da corrida, e ao lado de cada um ficam o `.inicio`, o `.fim`, o `.cabeca` e o `.log` (M16: a presença de um ficheiro não prova que ele é desta corrida).

| Comando | Início | Fim | Tempo de parede | Código |
|---|---|---|---:|---:|
| `npm run build` | 2026-09-22T16:16:20Z | 2026-09-22T16:21:01Z | **4 m 41 s** | **0** |
| `npm run verify` | 2026-09-22T16:21:01Z | 2026-09-22T16:28:44Z | **7 m 43 s** | **0** |
| `npm run typecheck` | 2026-09-22T16:28:44Z | 2026-09-22T16:28:44Z | **0 s** | **0** |

As plantas e as medições foram corridas com a árvore de trabalho que se tornou esta cabeça, antes de os commits desta passagem existirem: o campo `cabeca` de `plantas-m5.json` diz `44a718b4` e o de `medidas.json` diz `d90e6d10`, que é o commit anterior a elas. O código que as plantas exercitaram é, byte a byte, o que esta cabeça contém.
