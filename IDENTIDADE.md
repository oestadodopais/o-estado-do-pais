# Identidade — as regras

O estudo de identidade v2 é a **origem** deste sistema. Este ficheiro é a
**regra**. Onde os dois discordarem, ganha este ficheiro, e a divergência fica
registada em `DECISIONS.md`.

Existe porque a auditoria de 13.08.2026 encontrou **643 das 1.528 linhas de
`src/styles/site.css` — 42% — debaixo de secções sem qualquer correspondência no
estudo**. Não foi uma decisão má; foram seis tipos de página resolvidos um a um,
sem nada contra que os resolver. Este ficheiro existe para que o sétimo tipo de
página não precise de um sétimo estudo.

É curto de propósito. Uma constituição que não se lê não é imposta por ninguém.

---

## 1. Três tipos, três funções, sem sobreposição

| Tipo | Função | Onde aparece |
|---|---|---|
| Serifada | A marca | **Só** no `.wordmark`. Em mais lado nenhum. |
| Monoespaçada | Valores medidos, rótulos, mobília | Todo o `<Claim>`, eyebrows, metadados, eixos |
| Sem serifa | Prosa | Lede, corpo, descrições, legendas |

**O caso que o estudo não resolveu — um número no meio de uma frase.** A regra
não é «algarismos vão a mono». É esta:

> A monoespaçada é a marca de **um valor que tem linha no livro-razão** — não a
> marca de um algarismo. Um valor do livro-razão vai sempre a mono, através de
> `<Claim>`. Uma data de referência, um número de secção ou um nome próprio com
> algarismos fica na letra da frase que o rodeia.

Por isso «Portugal está **18** pontos abaixo da média da UE-27. O valor de 2024 é
provisório.» está **certo** com duas letras: o 18 é uma medição, o 2024 é uma
data. A letra distingue-os, e essa distinção é o produto.

---

## 2. Cor com significado

- **Amarelo `--yellow`** — marca de medição. A barra da distância, o município
  aceso, as barras de composição, a região que está a ser lida. **Nunca como cor
  de texto. Nunca decoração.**
- **Oxblood `--oxblood`** — erro admitido. O registo de correções, e mais nada.
  Nunca ênfase, nunca alerta, nunca «só desta vez».
- **Tudo o resto** — `--paper`, `--paper-2`, `--paper-3`, `--ink`, `--muted`,
  `--rule`, `--rule-strong`.

**A regra para um caso novo: não há acento novo.** Um tipo de página novo não
ganha uma cor. Se for preciso distinguir alguma coisa, distingue-se com peso de
fio, com fundo (`--paper-2` / `--paper-3`) ou com a letra monoespaçada. Nunca com
matiz. Um segundo acento destrói o significado do primeiro.

---

## 3. As três disposições, e nenhuma quarta

O invólucro tem 1.180px e a prosa mede 60–68ch. A diferença **não é espaço
vazio**: é a coluna do aparelho. Uma página cuja segunda coluna está vazia ou a
enche, ou estreita o invólucro.

Um tipo de página novo escolhe **uma destas três**. Não inventa a quarta.

- **A · Rótulo e corpo** — coluna de rótulo de 220px, corpo a 68ch.
  Para texto com secções nomeadas. Em uso: `/metodo`, `/a-verificar`, `/sobre`,
  `/correcoes` (16.08.2026, `DECISIONS.md` §1.39) e `/agenda` (16.08.2026,
  §1.40). O Sobre é o caso mais magro desta disposição: o rótulo é o nome da
  página e o corpo são duas frases e uma porta. A agenda é o caso mais cheio: o
  rótulo é o estado e o corpo são os itens que estão nele. A **B** foi
  considerada e posta de lado: a sua segunda coluna é o aparelho de *uma*
  leitura, e na agenda o aparelho pertence a cada item.
- **B · Corpo e aparelho** — corpo a 68ch, coluna de 300px com o aparelho:
  proveniência, ressalvas, contagens, ligações ao livro-razão, o que a página
  **não** sabe. Para páginas de leitura e páginas de linha do livro-razão.
  Em uso: `/livro-razao/<id>` e `/municipios/<slug>` — o sétimo tipo de página
  escolheu esta das três, partilha as suas regras de grelha, e não trouxe acento
  novo (15.08.2026; `DECISIONS.md` §1.34).
- **C · Instrumento** — largura toda, o instrumento enche-a.
  Só para instrumentos.

**Um instrumento dentro de uma página não é uma quarta disposição.** A primeira
página e a página do município já o faziam; o Método passou a fazê-lo a
16.08.2026, com o mecanismo desenhado a toda a largura entre a abertura e as dez
regras. A página mantém a sua disposição; o instrumento tem a largura que os
instrumentos têm.

---

## 4. As três camadas

Relance → Leitura breve → Fundo. **A profundidade abre-se no sítio, nunca noutra
página.**

Aplica-se a instrumentos **e** a páginas de leitura de estudo:

| Camada | Num instrumento | Numa página de leitura |
|---|---|---|
| Relance | O número, sozinho | A medida que faz o estudo valer a pena |
| Leitura breve | Uma frase, e a distância desenhada | Uma frase do que o estudo concluiu |
| Fundo | Método, ressalvas, proveniência | Método, ressalvas, proveniência, e o documento |

**Todo o instrumento leva as três.** O instrumento n.º 2 leva hoje só duas — não
tem camada 2. Ou ganha uma leitura breve, ou declara por escrito porque não a
tem.

---

## 5. O selo de proveniência

O Método promete, nas duas línguas: *«O selo de proveniência junto a cada número
é a porta para essa linha.»* Então:

1. **O selo é sempre uma ligação** para a linha do livro-razão. Um selo que não
   liga a lado nenhum não é um selo — é uma legenda, e a promessa fica falsa.
2. **Dois estados, e os dois têm de existir na página.** Quadrado cheio quando a
   proveniência está completa; a tracejado quando falta um campo. Um estado que
   nunca foi desenhado ao lado do outro ainda não é uma distinção.
3. **Onde aparece um valor, aparece o selo.** Sem excepção de página.
4. **No cabeçalho, o selo é só o glifo.** A única excepção ao rótulo visível:
   nas contagens da mobília do cabeçalho o quadrado (cheio ou a tracejado)
   basta, e o rótulo do estudo e o marcador ficam para leitores de ecrã. A
   ligação continua a ser a linha própria do valor. (2026-08-16, DECISIONS §1.37.)

---

## 6. Uma só linguagem de incerteza

Um marcador: **`[a verificar]`**. Uma classe: `.marcador`. Uma página que o
explica — **`/a-verificar` · `/en/to-verify`**, construída a 15.08.2026, ligada
do bloco «O que falta nesta linha» de cada linha incompleta e do Método. A
segunda formulação, `[descrição em preparação]`, esteve viva sete vezes em três
páginas até essa data e saiu: vinha de uma descrição de trabalho em
`src/data/studies.mjs`, que passou ao marcador único. `.tbv` é retirada.

Substitui as quatro formulações que a auditoria encontrou em uso ao mesmo
tempo: «fonte por confirmar», `[a verificar]`, `[descrição em preparação]`,
`[endereço a confirmar]`. Um marcador público que não é explicado em lado nenhum
é pior do que não marcar.

---

## 7. Estados desenhados, não deixados

Todo o componente tem de ter desenhado o estado **cheio, vazio, parcial e
velho** — não só o feliz.

- **Uma grelha nunca mostra célula vazia.** Ou a contagem é uma constante do
  desenho, ou a última célula tem um estado próprio. Cinco peças numa grelha de
  quatro colunas não é um acaso de largura: é aritmética que não fecha.
- **Uma linha de índice sem descrição di-lo**, em vez de repetir o título.
- **Uma página por escrever declara o que lhe falta**, em vez de fingir corpo.

---

## 8. O que o portão confere, e o que não pode conferir

O livro-razão tem portão desde o primeiro dia. A identidade não tinha nenhum:
todas as regras acima seguravam-se por atenção. As regras 1, 2, 5 e 6 são
mecânicas e passam a ser conferidas no build (`gate:identidade`):

- nenhum literal de cor fora de `tokens.css`;
- `--yellow` nunca como `color`;
- a família serifada só em `.wordmark`;
- todo o `.src-chip` é uma âncora;
- nenhum marcador de incerteza fora do formato ruled.

Três conferências entraram no `gate:html` a 16.08.2026, pelo mesmo motivo das
duas da regra 9 (a moratória: nenhum portão novo enquanto uma conferência
couber num que já existe):

- o texto do Sobre renderizado é, carácter a carácter, o que está em
  `src/data/sobre.mjs`, e a página tem de trazer a marca que o diz;
- toda a página construída tem uma ligação para o Sobre, que é onde a autoria
  vive desde que o rodapé passou a ser navegação;
- todo o número marcado `data-prova` bate certo com a conta que o próprio
  portão faz da mesma coisa, e tem porta (§10).

Mais duas entraram a 16.08.2026 com a agenda (§1.40), no mesmo varrimento e
sem portão novo:

- todo o campo marcado `data-agenda` é, carácter a carácter, o campo do registo
  que atravessou do motor, e a marca só vale na página da agenda;
- o que a página da agenda conta bate certo com as contagens do registo da
  travessia, e cada item e cada acontecimento do registo está na página, pelo
  nome.

E mais seis a 16.08.2026, depois da revisão cruzada (§1.41), todas no mesmo
varrimento e nenhuma num portão novo:

- nenhum número da prosa da agenda é, algarismo a algarismo, o valor de uma
  linha do livro-razão: uma medição chega ao leitor por `<Claim/>`, com selo,
  e não repetida em prosa;
- cada item da agenda rende **todos** os campos que o registo lhe dá, e está
  debaixo da secção do seu estado lida do DOM, não do registo;
- a etiqueta do selo (`data-nonledger="proveniencia"`) é uma das rendições que
  o registo dos trabalhos permite, e não prosa qualquer;
- um número marcado `data-prova` bate certo com o TEXTO que o portão escreve,
  não só com a sua sequência de algarismos;
- uma ligação interna resolve-se contra a página onde está, mesmo quando é
  relativa, e a sua âncora existe na página de destino;
- a faixa de um documento de estudo leva a porta para o Sobre, e o portão
  exige-a: a regra 9 diz «todas as páginas construídas» e agora é verdade.

E uma antes de qualquer página ser construída, no `ledger:check`: **a amarra das
decisões**. Toda a entrada do `DECISIONS.md` a partir da §1.38 declara o que
governa, e a última entrada que governa um texto traz o resumo desse texto tal
como ele está. Uma mudança de rumo não sai em silêncio (direção, 2026-08-15).

As duas conferências da regra 9 foram prometidas a este portão e vivem, por
agora, no `gate:html`, dentro do varrimento que já existe:

- nenhuma forma anterior ao Acordo no texto renderizado das páginas em pt-PT;
- nenhum travessão no texto renderizado, em qualquer das duas edições.

Ficam ali porque a moratória de 2026-08-15 continua de pé: nenhum portão novo
enquanto uma conferência couber num que já existe. Mudam de casa quando o
`gate:identidade` for construído.

**O que o portão não vê**, e continua a ser trabalho de quem revê: se a segunda
coluna está a fazer alguma coisa (regra 3), se um instrumento tem as três
camadas (regra 4), e se um estado vazio foi desenhado ou apenas não aconteceu
ainda (regra 7).

---

## 9. Ortografia e voz

**A superfície pública segue o Acordo Ortográfico de 1990, tal como é aplicado
em Portugal.** Superfície pública é tudo o que rende em HTML, nas duas edições:
as cadeias de texto, os gabaritos, a prosa da casa dos dados e a prosa da casa
das linhas do livro-razão que é publicada (`derivation`, `source_flag_note`,
`unit`, o `reason` de uma correção). O campo `note` não é publicado
(`ledger/README.md`) e por isso não é superfície pública: a passagem converte-lhe
as palavras na mesma, porque é de máquina e não custa nada, e a ferramenta conta
como aviso o que lá ficar.

**O que é transcrito nunca se converte.** Um excerto, o título de um documento,
o nome de uma fonte, o título de um trabalho publicado, uma citação entre
«…»: cita-se pelas palavras exatas, e o travessão de «Évora — Os Pelouros,
Quem Os Teve, O Que Fizeram» é uma delas.

**Os documentos do repositório são registo.** `DECISIONS.md`, este ficheiro,
`README.md`, `ledger/README.md`, os `PLANO-*`, os `BRIEF-*` e os `VOZ-*` ficam
na grafia em que foram escritos, e uma entrada nova segue a grafia do ficheiro
onde entra. Esta secção é a exceção que se explica a si própria: é a regra, e
por isso escreve-se na grafia que fixa.

**Sem travessões, nas duas edições.** Nem o travessão (—) nem o meio-traço (–)
entre espaços. Onde é preciso separar partes de uma mesma linha usa-se o ponto
médio «·», que já é o separador da casa; onde é preciso um aposto usam-se
vírgulas, dois pontos ou parênteses. A seta «→» não é um traço: é a marca de
ligação do sítio («Abrir a leitura →»), e fica onde já está.

**O marcador não muda.** `[a verificar]` continua a ser o único marcador de
incerteza, com a sua página e a sua classe (§6).

**O mecanismo, e é reversível de propósito.** Uma lista só,
`ortografia/formas.yml`, com as formas e a autoridade que as sustenta; uma
passagem, `scripts/ortografia.mjs`, que a aplica nos dois sentidos
(`--aplicar --sentido=acordo|anterior`); e a conferência, dentro do `gate:html`,
que lê a mesma lista. Os travessões não se convertem por máquina: cada um pede
uma frase nova, e a ferramenta assinala-os com ficheiro e linha.

**A reversão não é só uma corrida da ferramenta, e desde 16.08.2026 esta secção
di-lo.** A ida é de máquina inteira; a volta é uma corrida da ferramenta **mais
uma passagem à mão sobre as formas listadas como só de ida**. Uma forma só de
ida é aquela cuja grafia do Acordo é, por si, outra palavra corrente: «acto»
passa a «ato» sem risco, e «ato» de volta a «acto» estragaria «eu ato a corda»,
que sempre se escreveu assim. A lista marca-as `so_ida: true`, a passagem
inversa não lhes toca e imprime-as com ficheiro e linha, e a lista `manuais`
(«para», «pelo», «pela», «polo», «pera») já fazia o mesmo pela mesma razão.
Antes de 16.08.2026 esta secção prometia uma reversão de máquina inteira, e uma
revisão de outra família de modelos mostrou o contrário: correu a passagem
inversa sobre «Eu ato a corda» e sobre «O ato foi publicado», e converteu as
duas. O que fica por
converter está em `ortografia/restantes.yml`, rota a rota e palavra a palavra,
e desde 16.08.2026 essa lista está **vazia**, porque a prosa da casa das linhas
cruzadas se converteu onde foi escrita, no manifesto do motor, e voltou por
reexportação (`DECISIONS.md` §1.40). A lista continua a existir: é ela que pára
a construção à primeira ocorrência nova.

**Origem.** É a regra por defeito do roteiro, aplicada a 16.08.2026 na ausência
de palavra da direção, e registada como reversível: o diretor pode revogá-la na
pré-visualização, e a revogação é uma corrida da ferramenta, não uma reescrita.
`DECISIONS.md` §1.38.

---

## 10. Números do próprio sítio

Há dois tipos de número numa página, e a letra não chega para os distinguir:
uma medição de Portugal e uma contagem do próprio sítio. «120» pode ser um
índice de convergência ou o número de linhas com proveniência completa.

| | Medição de Portugal | Número do próprio sítio |
|---|---|---|
| Como entra | `<Claim id="…"/>` | `data-prova="<chave>"` |
| Origem | uma linha do livro-razão | `src/lib/prova.mjs`, calculado na construção |
| Ao lado | o selo, que abre a linha | nada |
| Porta | a linha daquele valor | a página onde se vê o que ele conta |
| Letra | monoespaçada | monoespaçada |

**O selo é do livro-razão e de mais nada.** Pôr um selo ao lado de uma contagem
do sítio seria prometer uma linha que não existe, e diluir o sinal que faz o
selo valer alguma coisa. O que estes números levam em vez do selo é a porta:
são **sempre** uma ligação, e a ligação é a rota onde o leitor vê o que o
número conta. Onde aparece um valor, aparece a porta.

**Nunca são escritos.** Uma contagem escrita à mão fica errada na construção
seguinte e ninguém dá por isso. Um número deste tipo que não venha da prova
falha no portão como qualquer outro algarismo sem origem.

**Dentro de um desenho, a porta vai na legenda**, marcada `data-legenda-prova`,
pela mesma razão de §1.34: uma âncora dentro de um `<svg>` não se lê como porta.
É a convenção do selo, aplicada a um número que não leva selo.

*(16.08.2026, `DECISIONS.md` §1.39; a origem entra na tabela do §2.2 como a
sétima.)*

---

*Origem: Observatório — Estudo de Identidade v2, 12.08.2026, arquivado em
`studies-src/_identidade/`. Regras derivadas da auditoria de 13.08.2026.*
