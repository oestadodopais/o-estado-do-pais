# Correções pequenas, quarta passagem · o relatório do construtor

*Ramo `pequenas-4-2026-08-29`, saído de `main` `fbcab5e` e rebasado sobre `main`
`04459c7`. Construtor: Claude Opus 5, 29.08.2026. Quatro commits, cada um verde na
cadeia inteira (`npm run build`, `npm run verify`, `npm run typecheck`).*

---

## 0 · Os quatro commits

| commit | o que fecha |
| --- | --- |
| `2867241` | I91 · a referência legal do selo das áreas leva `lang="pt-PT"` nas duas edições |
| `4a9f80b` | I89 · o verbo da frase da série sai dos dois valores, e não da cadeia |
| `ccbe77d` | a régua da voz passa a ver os rótulos que vivem num `<span>`, e treze entram no inventário |
| `fc1d013` | `data-nome`, a marca irmã de `data-lugar`, com a verificação que a dos lugares não tem |

Os identificadores são os de depois do rebase. Antes dele eram `80ad5ec`,
`e839e74`, `17ad7ec` e `18de016`.

---

## 1 · O rebase, e o que ele mexeu

`main` andou a meio do trabalho: `04459c7` tira o sinal do cabeçalho, por recusa
do diretor, e mexe em `src/components/Masthead.astro`, `src/styles/site.css`,
`tests/inicio/app.mjs` e `DECISIONS.md`. `git rebase main` passou os quatro
commits **sem um único conflito**, e a razão é que os conjuntos de ficheiros não
se tocam: nenhum dos quatro ficheiros do sinal foi tocado por esta passagem, o
que `git diff --stat main..HEAD` sobre esses quatro caminhos confirma com uma
saída vazia.

**O sinal não volta por esta porta, e está medido e não suposto.** Depois do
rebase e da construção, `dist/` tem **zero** ficheiros com `wordmark-e`, e o
detector viu um positivo conhecido antes de contar esse zero: a mesma procura por
`wordmark` acha 6 591 ficheiros. A cadeia inteira ficou verde depois do rebase, e
os doze estragos plantados de `check:areas` continuam todos vermelhos.

---

## 2 · I89 · o verbo da frase da série

### O que estava errado

`municipio.tempoSerieA` trazia o verbo dentro da cadeia («desceu de », «fell
from ») e `tempoSerieB` a `tempoSerieE` eram só os pedaços entre os números. O
sítio não escolhia. Era verdadeiro na única página que rende a frase, porque em
Évora o índice desce de 242,6% em 2014 para 105,5% em 2024; um concelho cuja série
subisse publicava uma falsidade, e nenhuma régua a apanhava, porque nenhuma
comparava a palavra com os números que ela descreve.

### O que ficou

Três formas, uma por sentido, escolhidas pelos mesmos valores que a frase cita:

| sentido | pt | en |
| --- | --- | --- |
| o segundo menor | `desceu de … em … para … em ….` | `fell from … in … to … in ….` |
| o segundo maior | `subiu de … em … para … em ….` | `rose from … in … to … in ….` |
| os dois iguais | `manteve-se em … em … e em ….` | `stayed at … in … and in ….` |

A forma da igualdade **perde o «de … para …»**, e não é uma abreviatura: não há
de onde nem para onde, e escrever «de 105,5% para 105,5%» era descrever uma
mudança que não houve. O valor diz-se uma vez, com o seu selo, e os dois anos
ficam nomeados pelo pedaço novo ` e em ` / ` and in `.

### As contagens

| | antes | depois |
| --- | --- | --- |
| chaves de abertura da frase, por edição | 1 (verbo fixo) | 3 |
| chaves da frase, por edição | 5 | 8 |
| frases da série rendidas em `dist/` | 2 (pt e en, Évora) | 2 |
| frases em desacordo com os seus valores | não medido | 0 |
| réguas que mediam a concordância | 0 | 1, com 3 células |
| linhas do inventário | 0 | 0 |

### O caso plantado

A régua é `tests/municipio/serie.mjs`, e lê o que a construção rendeu, não o que
o código pretendeu: de cada frase tira o verbo e os valores que o bloco cita, e
confere que a palavra e os números dizem a mesma coisa.

**O estrago é o que o brief pediu**: numa cópia em memória da página construída, o
segundo valor da frase é trocado por um que CONTRADIZ o verbo. Na página que diz
«desceu», por um maior; na que diz «subiu», por um menor; na que diz «manteve-se
em», por um segundo valor a mais. A célula S1 falha quando não vê o estrago, e foi
assim que ela mostrou o seu próprio defeito: **a primeira forma do estrago era cega
ao sentido** (punha sempre um valor maior), e passou a «NÃO VISTO» no momento em
que a página de ensaio passou a dizer «subiu». Corrigida, e verde.

### E as três formas foram lidas construídas, não só escritas

Não chega uma régua sobre a forma que existe. Com a série de Évora **invertida à
mão** no ficheiro de dados e a construção repetida, a página escreveu «O índice de
dívida, calculado sobre os dados da Direção-Geral, subiu de 105,5% em 2014 para
242,6% em 2024» e «The debt index … rose from … to …». Com a série **achatada**,
escreveu «manteve-se em 105,5% em 2014 e em 2024» e «stayed at 105,5% in 2014 and
in 2024». Os dados foram repostos, e a construção que ficou no commit é a real.

### O que não foi feito, e porquê

**As três formas não foram classificadas no inventário, e não podiam ser.** O
brief pede-o e a régua não o permite, e a razão é a mesma que a I88 já tinha
escrito: o bloco que leva a frase contém `data-claim`, e a medida 8 deixa cair um
bloco inteiro que contenha uma origem declarada. **Nada desta frase está no
inventário hoje**, nem estava antes. Se as três entrassem como `viva`, duas delas
não se rendem em rota nenhuma e a construção fechava («linha viva que não se
rende»); se entrassem como `retirada`, a tabela dizia que a casa as tirou de
propósito e que elas não podem voltar, o que é falso: elas estão no código à
espera do concelho que as chame. A classificação de que a frase precisava é a
régua, e a régua existe.

---

## 3 · I91 · a marca de língua na referência legal

«Decreto-Lei n.º 87-A/2025 · Artigo 12.º, n.º 1» é o nome de um diploma
português, e nas nove páginas inglesas estava dentro de um documento declarado
inglês, sem dizer em que língua está. É a mesma marca, e a mesma razão, que o
rótulo de cada matéria já levava desde 28.08.

### As contagens

| | antes | depois |
| --- | --- | --- |
| referências legais em `dist/` | 18 (9 por edição) | 18 (9 por edição) |
| com `lang="pt-PT"` | 0 | 18 |
| ocorrências de `lang="pt-PT"` em `AreaView.astro` | 1 (o rótulo da matéria) | 2 |
| regras de `check:areas` que a conferem | 0 | 1 (dentro da A5) |
| estragos plantados de `check:areas` | 11 | 12 |

### O caso plantado

O décimo segundo estrago de `check:areas --vermelhos` tira a marca da referência
da página inglesa das Finanças, numa cópia em memória do mundo que as regras leem.
Visto vermelho: «/en/areas/financas: a referência legal "Decreto-Lei n.º 87-A/2025
· Artigo 12.º, n.º 1" não vai marcada lang="pt-PT"». Verde depois.

### O que fica aberto

**A outra metade da I91 não foi tocada, e é o brief que o manda**: os títulos
portugueses de documentos das fontes são um bloco do livro-razão inteiro e a
decisão é do lugar de direção. A linha da I91 diz «metade fechada».

---

## 4 · Os rótulos em `<span>` que a régua não via

### A causa, e ela é uma linha de código

A medida 8 mede blocos de texto, e um bloco é uma etiqueta de uma lista fechada
(`p`, `li`, `h1`, `h2`, `figcaption`, …). Um `<span>` não está nela, e o elemento
à volta da cabeça de uma página é um `<div>`, que também não. O rótulo da cabeça
vivia exactamente entre as duas coisas que a régua não olha.

### As duas saídas, e porque é esta

O brief deixa escolher: pôr o rótulo de cada vista num `<p>`, ou fazer a régua ver
o `<span>`. **A primeira corrige as páginas de hoje e não corrige a régua.** O
próximo rótulo que alguém escreva num `<span>` volta a passar por baixo dela, e a
regra «cada frase da casa está declarada» fica com uma exceção que ninguém
escreveu. O caso plantado que o brief pede prova-o sozinho: ele exige que **um
rótulo em `<span>` não inventariado seja visto vermelho**, e depois de converter
as quinze vistas ele continuaria a passar. Só a régua pode fazer isso, e é a
régua que mudou.

`medir-defeitos.mjs` ganha `CLASSES_DE_ROTULO`, uma lista declarada de classes de
`<span>` que são rótulos (hoje só `.eyebrow`), e as medidas 8 e 9 passam a
medi-los. A medida 3 fica como estava, porque é uma linha de base comparada entre
construções desde a etapa 0 e mudar-lhe a definição mudava um número que não é
deste assunto. É a mesma razão por que `COBERTURA_DECLARADA` ficou fora de
`ORIGEM_DECLARADA`.

### E a régua prova, em cada construção, que ainda vê

Uma lista de classes é uma dependência de uma folha de estilos, e uma folha de
estilos muda: renomear `.eyebrow` deixava a régua cega **com a contagem de «nada
por classificar» a dizer zero**, que é exactamente o defeito que ela veio fechar.
A medição conta as ocorrências de cada classe declarada em `dist/` e `check:voz`
fecha a construção quando uma delas for a zero. É a regra 14 da casa a correr a
cada construção em vez de uma vez.

### As contagens

| | antes | depois |
| --- | --- | --- |
| vistas com o rótulo em `<span class="eyebrow">` | **15** (não 16, ver adiante) | 15 |
| cadeias distintas em `<span class="eyebrow">` em `dist/` | 22 | 22 |
| ocorrências dessas cadeias em `dist/` | 6 552 | 6 552 |
| dessas, medidas pela régua | 0 | 6 548 (as 4 de fora são a obra citada, rota que a régua salta) |
| blocos por classificar que a régua acusou | 0 | 1 328, em 13 cadeias distintas |
| linhas do inventário | 580 | 593 |
| vivas | 504 | 517 |
| frases distintas varridas | 699 | 712 |
| ocorrências varridas | 28 777 | 30 117 |

As treze cadeias novas entram como `navegacao`, que é a classe do positivo
conhecido: «Relance» e «At a glance» são o mesmo rótulo, com a mesma classe,
escritos num `<h2>`, e estão declarados assim desde sempre.

**Três cadeias não trazem linha nova**, porque a tabela mapeia por texto e elas já
estavam declaradas por outra rendição: «Correções», «Corrections», «Documento
alojado» e «Document hosted».

**Duas rotas com o mesmo rótulo ficam de fora da conta, e não é esquecimento**: a
página de uma linha do livro-razão («Linha do livro-razão», «Ledger row», 2 602
rendições por edição) e a página do marcador («O marcador», «The marker») não
estão em `ROTAS_DO_INVENTARIO`. A régua vê-lhes o rótulo desde hoje; o que as
mantém fora é a lista das rotas medidas, que é outra regra e cresce no commit em
que cada página é reconstruída.

### O caso plantado, e a prova de que a causa era a etiqueta

Um `<span class="eyebrow">Rótulo plantado que não está no inventário</span>` posto
ao lado do rótulo de `/agenda`, numa página construída:

* a régua **nova** fecha a construção e nomeia-o: «bloco por classificar em
  /agenda: "Rótulo plantado que não está no inventário"»;
* a régua **antiga**, tirada de `fbcab5e` e corrida sobre o mesmo `dist/` com o
  mesmo estrago, conta **zero** blocos por classificar. Cega, e a contar zero.

E o positivo conhecido das classes: com uma classe plantada que não existe no
sítio, `check:voz` fecha com «a classe de rótulo "sobrancelha-plantada-que-nao-existe"
não se rende em página nenhuma de dist/».

### A correção a um número do relatório da terceira passagem

O relatório das áreas escreve, duas vezes, «DEZASSEIS OUTRAS VISTAS DO SÍTIO TÊM O
MESMO DEFEITO». **São quinze.** Procurado em todo o `src/` de `fbcab5e`, com um
positivo conhecido antes do zero (22 ficheiros mencionam `eyebrow`, e a procura
por `<span class="eyebrow"` acha quinze): `AgendaView`, `CorrecoesView`,
`DistritoView`, `DistritosView`, `EstudoView`, `LinhaView`, `LivroConcelhoView`,
`LivroConcelhosView`, `LivroView`, `MarcadorView`, `MunicipioView`,
`MunicipiosView`, `RegiaoView`, `RegioesView`, `TextoView`. A lista em prosa do
próprio relatório nomeia quinze objectos, e o número ao lado dela diz dezasseis.
Nenhuma ficou por tratar: a régua vê as quinze.

---

## 5 · `data-nome` · a dívida de forma do inventário

### O que custava

O nome de cada área de governo custava duas linhas do inventário, uma por edição,
e a descrição do `<head>` composta com ele custava outras duas. Com quatro áreas
eram dezasseis linhas; com nove, trinta e seis; com as dezasseis áreas do Governo
seriam sessenta e quatro. Isso não é um inventário das frases da casa: é a lista
dos ministérios escrita outra vez dentro dele.

### A marca

`data-nome` diz «este texto é o nome de uma entrada de um ficheiro de dados, e não
prosa que a casa escreveu», e **o valor do atributo nomeia o ficheiro**. Não podia
ser `data-lugar`, e a marca dos lugares tem escrito o que marca, o nome de um
concelho e a etiqueta que a Carta Administrativa lhe dá: uma área de governo não é
um lugar.

**A regra é estreita de propósito.** Só o nome de uma entrada de um ficheiro de
dados com fonte declarada a pode levar, e são dois:

* `src/data/areas.mjs` · os nomes vêm das páginas do Governo, lidas a 28.08.2026,
  com a data escrita no campo `FONTE_DOS_NOMES`;
* `src/data/regioes.mjs` · os nomes vêm da classificação NUTS 2024, com o código
  de cada região ao lado do nome.

### E a marca traz a sua própria verificação

É a diferença que mais importa, e é o que o brief pediu. `data-lugar` **exclui e
não confere**: um nome trocado sai do inventário sem que ninguém o veja.
`check:voz` fecha a construção quando um `data-nome` nomeia uma fonte que não é
uma das declaradas, e quando o texto marcado não é, carácter a carácter, um nome
daquele ficheiro.

### As contagens

| | antes | depois |
| --- | --- | --- |
| linhas do inventário com o nome de uma área | 18 | 0 |
| linhas com a descrição composta do nome | 0 (a descrição É o nome) | 1 (`<nome>`) |
| elementos com `data-nome` em `dist/` | 0 | 36 (18 `<h1>` e 18 no selo legal) |
| verificações do texto marcado contra o ficheiro | 0 | 36, uma por elemento |
| linhas do inventário | 593 | **576** |
| vivas | 517 | **500** |

**Do princípio ao fim desta passagem o inventário passa de 580 a 576 linhas**, e
as vivas de 504 a 500: treze entram com os rótulos em `<span>`, dezoito saem com
a marca, uma entra com a descrição.

**As dezoito saem do ficheiro em vez de ficarem `retirada`**, e a razão é o que o
estado significa: uma linha `retirada` diz «a casa tirou esta frase de propósito e
ela não pode voltar», e estes nomes não foram tirados de lado nenhum, continuam na
cabeça de cada página onde sempre estiveram. O que mudou foi quem os conta.

### O caso plantado

Dois estragos numa página de área construída, e os dois vistos vermelhos:

* `<h1 data-nome="areas">Saúde Pública</h1>` · «o texto marcado não é um nome de
  src/data/areas.mjs»;
* `data-nome="inventado"` sobre «Saúde» · «a fonte não é um dos ficheiros de dados
  que podem sustentar esta marca».

E o que os dois provam juntos: **com os estragos no sítio, a contagem de blocos
por classificar continuou a dizer zero.** Sem a verificação, o nome trocado saía
do inventário em silêncio, que é exactamente o buraco que uma marca de exclusão
abre quando não traz régua consigo.

### O que não foi feito, e porquê

**As regiões continuam em `data-lugar`.** Uma região NUTS II é um lugar, e as
quatro linhas da descrição das suas páginas já se contam com `<lugar>` lá dentro;
trocar a marca mudava o texto dessas linhas sem mudar o que elas dizem, e o
inventário ficava pior e não melhor. O ficheiro fica na lista das fontes porque a
regra é sobre que ficheiros podem sustentar a marca, e a medição imprime quantas
vezes cada fonte se exerce (hoje `areas 36`, `regioes 0`) para que uma fonte por
exercer não fique em silêncio, que é a mesma disciplina das exceções por exercer
de `VOZ-MARCADORES.md`.

---

## 6 · O que a construção diz agora

```
voz ✓ 65 marcadores · 7 exceções (0 de registo) · 695 frases distintas,
30117 ocorrências em 1378 rotas · autorreferência 0 · nada por classificar ·
576 linhas do inventário com bloco (500 vivas, todas rendidas; 76 retiradas,
nenhuma rendida) · lida contra a Emenda 18 (a mais alta da voz é a 18) ·
rótulos em span: .eyebrow 6548 · nomes declarados: areas 36, regioes 0
      1 bloco(s) do inventário por ler, e o registo di-lo:
      · pequenas-4 · `por ler`
```

`check:voz` passa de sete casos que fecham a construção a nove: o positivo
conhecido das classes de rótulo e a conferência de `data-nome`.

O registo das revisões leva a linha `| pequenas-4 | 14 | por ler | … |`, e o
portão imprime-a em todas as construções até a leitura cruzada existir.

---

## 7 · O que não foi feito, junto

1. **As três formas da frase da série não estão no inventário**, e não podem
   estar: o bloco leva `data-claim` e a régua deixa cair um bloco com origem
   declarada. A razão longa está no §2.
2. **A segunda metade da I91** (os títulos portugueses de documentos das fontes)
   fica aberta, e é o brief que o manda: é um bloco do livro-razão inteiro.
3. **A leitura cruzada do bloco `pequenas-4` não foi feita.** O registo diz
   `por ler`, e o portão di-lo em todas as construções.
4. **`DECISIONS.md` não foi editado**, e nem se aproximou disso.
5. **As regiões não passaram para a marca nova**, com a razão do §5.
6. **Nada foi fundido nem enviado.** O ramo fica para o lugar de direção,
   rebasado sobre `main` `04459c7`.

---

## 8 · O custo

Construtor (Claude Opus 5), esta sessão: **≈ 285 mil símbolos**, contando a
leitura de reconhecimento (os dois portões da voz, a régua das medições, as vistas
das áreas e do concelho, o inventário e o registo das revisões), as quatro
construções completas da cadeia e as três construções de ensaio das páginas com a
série de Évora mexida à mão.
