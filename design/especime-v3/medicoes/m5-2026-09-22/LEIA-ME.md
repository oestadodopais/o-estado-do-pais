# M5 · As medições de um brief e de um relatório provam que veem, e o nome do diretor sai do código

Construtor: Claude Opus 5, 22.09.2026, na worktree `medidas-2026-09-22`, sobre `main` em `b03a6efc`.\
Brief: `design/observatorio/BRIEF-M5-as-medicoes-provam-que-veem.md`.\
Nenhum número deste relatório se escreve de cabeça: sai de `medir-m5.py`, que escreve `medidas.json` ao lado. O `conferir-relatorio.py` sobre este ficheiro e esta pasta está a zero faltas, e a saída é `conferir-relatorio-m5.txt`.

## O que ficou feito

| # | O que o brief mandou | A medida |
|---|---|---|
| `1` | O formato do bloco `medidas` e o guião deste brief, com o conhecido-positivo de cada medição | `design/observatorio/medidas/BRIEF-M5.py` escreve `BRIEF-M5.json` com 7 medições, 7 conhecidos-positivos encontrados; `check:briefs` a 0 sobre este brief |
| `2` | `check:briefs` na cadeia `verify`, com a isenção por data dita | 37 briefs em `design/observatorio/`, 1 conferido, 33 isentos por data, 3 isentos por nomeação |
| `3` | `conferir-relatorio.py` corrido sobre os quatro relatórios de 22.09 | a lista abaixo, sem emendar relatório nenhum |
| `4` | `pacote.sh` a correr o guião e a incluir a saída | um pacote de ensaio montado com `numeros-do-relatorio.txt` lá dentro |
| `5` | As quatro plantas a morder | 6 plantas corridas, 6 morderam, 6 com os bytes repostos |
| `6` | O nome fora do código, com a célula | 0 ficheiros com o nome em 276 lidos de `src/` e `public/`; 0 páginas em 7 354 construídas |
| `7` | O mapa posto em dia e os três portões a 0 na cabeça final | a tabela dos portões, no fim |

## 1 · O bloco `medidas` de um brief

Um brief datado de 22.09.2026 ou depois declara as suas medições num guião ao lado: `design/observatorio/medidas/<chave>.py` ou `.mjs`, que corre sem argumentos a partir da raiz e escreve `design/observatorio/medidas/<chave>.json`. A chave é `BRIEF-` mais o primeiro campo do nome do ficheiro. Cada medição traz quatro campos, e o quarto é o que faz dela uma medição e não uma afirmação:

| Campo | O que é |
|---|---|
| `nome` | o nome por que o §0 do brief a cita |
| `valor` | o que se mediu |
| `comando` | o comando que um leitor corre para a repetir |
| `conhecido_positivo` | `{ o_que, encontrado }`: uma coisa que o MESMO detetor tem de encontrar |

O portão corre o guião com `OEDP_MEDIDAS_JSON` a apontar para um ficheiro temporário, e compara-o com o que está no repositório: a comparação é entre o que se mede hoje e o que estava escrito, e nunca entre o ficheiro e ele próprio, que é o defeito que a leitura a frio de 01.09.2026 apanhou no oráculo do rótulo.

**Uma medição de um brief é estável de propósito, e isso é uma regra do formato.** O portão volta a correr o guião em cada `verify`. Uma medição que andasse com o trabalho de todos os dias (quantos briefs existem, quantos ficheiros tem `src/`) punha o portão vermelho no dia seguinte e obrigava a reescrever o §0 de um brief antigo, que é o que o §3 do brief proíbe. Por isso as contagens de briefs ancoram-se na data do brief («até 22.09.2026») e as outras são invariantes que um portão já protege.

As sete medições deste brief: `briefs_ate_22_09_2026` (37), `briefs_com_seccao_de_medicoes` (34), `briefs_com_guiao_de_medicoes` (1), `briefs_isentos_por_data` (33), `briefs_isentos_por_nomeacao` (3), `ocorrencias_do_nome_de_quem_responde_em_src_e_public` (0) e `exportacoes_de_politica_ia_com_o_nome_de_quem_responde` (0). O §0 do brief passou a citá-las pelo nome.

## 2 · O portão, e a contradição que o brief tem com os dados

O brief manda conferir «cada brief com data igual ou posterior a 22.09.2026» e isentar os anteriores por data. Medido: três briefs de 22.09.2026 caem dentro desse corte e foram escritos pelo lugar de direção nesse mesmo dia, **antes de esta regra existir**: o B1c, a I129 e o M3b. Não têm guião de medições, e o brief diz também, no seu ponto 5, que este brief é «o primeiro a cumprir a regra».

**A razão de não se poder cumprir o corte à letra é medida, e não uma preferência.** O §0 do B1c afirma que a página das correções «tem zero linhas datadas»; o construtor mediu dezasseis (é a §1.120 e a M18). Exigir que o número do §0 do B1c existisse num ficheiro de medição obrigava a uma de duas coisas: escrever um ficheiro de medição com um número errado lá dentro, ou reescrever o §0 de um brief antigo. O §3 do brief proíbe a segunda, e a primeira seria a régua a ser desligada.

**O que se fez, e fica visível:** a isenção tem duas metades, e as duas se dizem no cabeçalho do guião e na saída do portão. Por data, os briefs anteriores a 22.09.2026, que são 33. Por nomeação, os três acima, numa **lista fechada de três nomes com a razão escrita ao lado de cada um**; o portão sai com 2 se a lista crescer sem que a linha que conta os três mude com ela, de modo que uma quarta isenção tem de aparecer num diff e não se pode escrever em silêncio. O lugar de direção decide se fica assim ou se o corte passa a ser outro.

A saída do portão:

```
  portão dos briefs · 37 brief(s) em design/observatorio/ · 1 conferido(s) · 33 isento(s) por data
  (anteriores a 22.09.2026) · 3 isento(s) por nomeação
```

As duas leituras conferem-se uma à outra: as contagens do portão são comparadas com as que o guião do M5 mede por conta própria, com o seu leitor. Duas leituras que discordem fecham a construção.

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

**Estas contagens são as terceiras, e as duas primeiras estavam frouxas. Foi uma planta a apanhá-lo, e não uma leitura.** A planta do número inventado deixou de morder quando a pasta das medições deste bloco ganhou os resumos sha256 das plantas, e a razão eram dois buracos, cada um do seu lado da conferência.

O primeiro: o lado do JSON contava os algarismos de dentro de uma cadeia sem lhe aplicar as regras que aplicava ao texto, e um número de seis algarismos encontrava par por acaso dentro de um resumo. Passou a passar cada cadeia pela **mesma** limpeza do texto, que é a regra que o guião já dizia ter e não tinha dos dois lados.

O segundo: o índice das plantas guarda em cada entrada a `mordida`, e a `mordida` desta planta **é** o número plantado; um índice de uma corrida anterior na mesma pasta punha o número no monte contra o qual se confere. O guião das plantas passou a apagar o índice antes de plantar, pela mesma razão por que os ficheiros dos códigos se apagam antes de cada corrida dos portões (M16).

Pelo caminho apareceram duas classes que o leitor não via e passou a ver, as duas do lado do texto: o número de um título de Markdown («## 3 · …»), que nomeia uma secção e não conta nada, e a versão de um modelo colada ao nome dele («Claude Opus 5»), que está no cabeçalho de todos os relatórios de construtor. As quatro contagens acima são as de depois destas quatro correções.

**O que a lista mostra, lida.** A maior parte do que falta não é um número inventado: são medidas que o construtor leu de uma saída de portão ou de um `git diff` e escreveu no relatório sem as guardar num ficheiro (contagens de plantas, de ficheiros mudados, de achados de uma leitura a frio), e alturas e larguras de capturas que ficaram na cabeça e não no JSON das capturas. A I129 é a que mais tem porque a sua pasta só traz um JSON, o das medições da linha, e o relatório conta também o que se passou no motor, que não tem ficheiro deste lado. A classe que interessa é a mesma em todos: um número que ninguém pode voltar a medir a partir dos ficheiros do bloco.

## 4 · O pacote de leitura

O `pacote.sh` passa a correr o guião sobre o relatório do bloco e a pôr a saída em `<pacote>/numeros-do-relatorio.txt`, com o código de saída escrito lá dentro. Um código 1 («há números sem ficheiro») entra no pacote e o pacote monta-se; um código 2 («o guião não correu, ou o conhecido-positivo falhou») não monta o pacote, porque um zero de um detetor calado enganaria o leitor a frio. Ensaiado sobre o relatório do B1c: o pacote montou-se e a saída ficou lá dentro.

## 5 · As plantas

| Grupo | Planta | Ficheiro | Comando | Código | Mordeu | Bytes repostos |
|---|---|---|---|---:|---|---|
| o bloco `medidas` | `valor-trocado` | `design/observatorio/medidas/BRIEF-M5.json` | `check:briefs` | 1 | sim | sim |
| o bloco `medidas` | `conhecido-positivo-cego` | `design/observatorio/medidas/BRIEF-M5.py` | `check:briefs` | 1 | sim | sim |
| o bloco `medidas` | `numero-do-zero-sem-medicao` | o próprio brief | `check:briefs` | 1 | sim | sim |
| os números de um relatório | `numero-do-relatorio-sem-ficheiro` | este relatório | `conferir-relatorio.py` | 1 | sim | sim |
| o nome de quem responde | `nome-numa-cadeia-de-uma-vista` | `src/views/SobreView.astro` | `gate:html` | 1 | sim | sim |
| o nome de quem responde | `nome-numa-pagina-construida` | `dist/sobre/index.html` | `gate:html` | 1 | sim | sim |

São seis e não quatro: o brief pede quatro, e a célula do nome tem duas metades (o código-fonte e a página construída), cada uma com a sua. A segunda planta é a que importa mais do formato: o valor da medição **não muda** com ela, só o conhecido-positivo deixa de se encontrar, e o portão recusa na mesma. É a M18 posta a morder.

As saídas ficam em `planta-<nome>.log` e o índice em `plantas-m5.json`, com os dois sha256 de cada ficheiro, que são iguais.

## 6 · O nome do diretor fora do código

Medido antes: o nome estava em `src/data/politica-ia.mjs` (uma constante exportada, `RESPONSAVEL_EDITORIAL`, e três menções em comentários) e em `src/styles/site.css` (um comentário). Medido em `dist/`: nenhuma página o rendia.

**A célula do `gate:html` mudou de forma conservando o que protegia, e o brief mandou ler o oráculo antes de mexer.** O que ela protegia era que o nome de quem responde fosse uma cadeia só no dia em que uma página o rendia: comparava a constante de `src/` com o oráculo `scripts/textos-aprovados.json`, e exigia que a regra 9 do Método imprimisse o nome se o rótulo o imprimisse, e não o imprimisse se o rótulo não o imprimisse.

**Lido antes de mexer, e medido e não inferido.** O oráculo guarda o nome; o rótulo composto não o contém; a regra 9 do Método (`src/data/metodo.mjs`, `intervencao-humana`) diz «A direção é de uma pessoa, que escolhe o que se publica e responde por ele» e «It is directed by one person, who chooses what gets published and answers for it», e não nomeia ninguém; e nenhuma das páginas construídas o rende. **O oráculo não imprime o nome em página nenhuma, e por isso a célula podia mudar.**

**Um achado pelo caminho, e é do lado de lá da célula antiga.** A metade que procurava o nome nas regras do Método lê os pedaços `{ forte: … }` das dez regras. Corrido com um leitor próprio: as regras têm hoje **zero** pedaços `forte`, porque o P1 tirou o nome da regra 9 a 15.09.2026 e com ele o negrito. Essa metade estava, portanto, a comparar contra uma lista vazia: um nome que voltasse a uma regra noutra forma passava por ela sem ninguém ver. Não se mexeu nela, porque o que ela protege continua a ser o par rótulo/regra; o que fica é que **a metade nova cobre esse buraco por inteiro**, e não por acaso: `src/data/metodo.mjs` é um ficheiro de `src/`, e um nome escrito lá, em qualquer forma, fecha agora a construção. Fica dito para o lugar de direção.

A célula passou a exigir duas coisas, e as duas contam:

- o nome não existe em ficheiro nenhum de `src/` e de `public/`: 0 em 276 lidos, contado uma vez antes do varrimento;
- o nome não se rende em página nenhuma de `dist/`: 0 em 7 354, contado página a página, antes de qualquer saída antecipada, de modo que os dezoito documentos de estudo alojados também entram.

**O detetor prova primeiro que vê.** Antes de contar, o mesmo `veONome()` passa por uma linha escrita com o nome, e a construção fecha ali se não a apanhar; e uma varredura de `src/` e `public/` que não leia ficheiro nenhum é erro e não zero. As duas contagens vão à saída do portão, à vista.

**O que mudou fora da célula.** A constante saiu de `src/data/politica-ia.mjs`, e o comentário que estava no lugar dela diz onde o nome mora agora e o que a célula protege. O comentário de `src/styles/site.css` passou a dizer «o nome do responsável editorial» onde citava o nome. A L9 do `check:lingua`, que também importava a constante para conferir um `[data-rotulo-nome]` rendido, passou a ler o nome do mesmo oráculo: mede exactamente o que media, e o oráculo é mais independente do que o ficheiro que rende. `LINGUA_DO_RESPONSAVEL` ficou onde estava, porque é uma etiqueta de língua e não um nome.

**A classe da célula é P**, proteção de uma pessoa. Se o nome tiver de voltar a uma página, volta por decisão escrita em `DECISIONS.md` e a célula muda com ela.

O nome continua a existir no repositório fora de `src/` e `public/`: no oráculo, onde é preciso, e em `DECISIONS.md`, no `INVENTARIO-FRASES.md`, nas leituras a frio e nos rascunhos da voz, que são registo e não se emendam.

## 7 · O mapa do repositório

O mapa ganhou: a cadeia do `verify` com o `check:briefs` e o número de linha novo (`package.json:43`); a contagem de portões distintos, com o `check:briefs` somado à que lá estava; a linha do `check:briefs` na tabela dos portões que não leem `dist/`, com as suas cinco células; o formato do bloco `medidas` de um brief e o `conferir-relatorio.py` no §4, com as quatro contagens de 22.09; e a célula do nome de quem responde na secção do `gate:html`, com as suas duas metades.

As três citações novas foram conferidas com `scripts/leituras/conferir-mapa.py` e estão à volta da linha citada. **A deriva de linha que resta no mapa é anterior a este bloco**, e o guião localiza-a: o mapa diz na cabeça que a âncora é a citação e não a linha, e que os números andam com cada commit. Fica dito para o lugar de direção decidir se a quer posta em dia: o guião imprime cada citação com a linha onde ela está hoje.

## 8 · O que ficou por fazer, e porquê

- **O corte da isenção.** A lista fechada de três nomes é a forma conservadora de cumprir o brief sem reescrever um brief antigo. Se o lugar de direção preferir um corte noutro sítio (por exemplo, «a partir do brief M5»), a mudança é de uma constante e de uma lista no cabeçalho do `check-briefs.py`.
- **Os números sem ficheiro dos quatro relatórios de 22.09 não se corrigiram**, por decisão do brief: mede-se o que falha e diz-se. A tabela do §3 é essa medida.
- **O `check:briefs` não confere que a frase à volta de um número diga o que o número mede.** Confere que o número foi medido e escrito. O limite está dito no cabeçalho do guião.
- **A deriva de linha do mapa**, acima.

## 9 · Os commits, a cabeça e os três portões
