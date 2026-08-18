# Identidade · as regras

O Estudo de Identidade v2 é a **origem** deste sistema. Este ficheiro é a
**regra**. Onde os dois discordarem, ganha este ficheiro, e a divergência fica
registada em `DECISIONS.md`.

Existe porque a auditoria de 13.08.2026 encontrou **643 das 1.528 linhas de
`src/styles/site.css`, 42%, debaixo de secções sem qualquer correspondência no
estudo**. Não foi uma decisão má: foram seis tipos de página resolvidos um a um,
sem nada contra que os resolver. Este ficheiro existe para que o sétimo tipo de
página não precise de um sétimo estudo.

**Esta é a v2.** A fase 2 construiu três direções de desenho em paralelo, leu-as
contra os nove testes de aceitação do `BRIEF-confianca.md` §6.8 com um crítico de
outra família de modelos, e escolheu a **direção S**, que é a síntese das três e
não uma delas: `design/DECISAO.md`, 16.08.2026. A v1 fica onde estava, no git:
`git show e340fa6:IDENTIDADE.md`. O registo deste bloco vai para `DECISIONS.md`
§1.43.

**A grafia mudou com a versão, e não em silêncio.** §9 diz que um documento deste
repositório fica na grafia em que foi escrito e que uma entrada nova segue a do
ficheiro onde entra. Uma reescrita inteira é uma versão nova: a v2 escreve-se no
Acordo de 1990 tal como é aplicado em Portugal, que é a grafia da superfície
pública que ela governa. O que é citado fica com os caracteres que tem.

É curto de propósito. Uma constituição que não se lê não é imposta por ninguém.

---

## 1. Três tipos, três funções, sem sobreposição

| Tipo | Função | Onde aparece |
|---|---|---|
| Serifada | A marca | **Só** no `.wordmark`. Em mais lado nenhum. |
| Monoespaçada | Valores medidos, rótulos, mobília | Todo o `<Claim>`, eyebrows, metadados, eixos |
| Sem serifa | Prosa | Lede, corpo, descrições, legendas |

**Sem tipos de rede.** As três famílias são pilhas do sistema, declaradas em
`src/styles/tokens.css`. Uma família nova não entra por gosto: entra por decisão
registada, e nenhuma delas se descarrega.

**O caso que o estudo não resolveu, um número no meio de uma frase.** A regra não
é «algarismos vão a mono». É esta:

> A monoespaçada é a marca de **um valor que tem linha no livro-razão**, e não a
> marca de um algarismo. Um valor do livro-razão vai sempre a mono, através de
> `<Claim>`. Uma data de referência, um número de secção ou um nome próprio com
> algarismos fica na letra da frase que o rodeia.

Por isso «Portugal está **18** pontos abaixo da média da UE-27. O valor de 2024 é
provisório.» está **certo** com duas letras: o 18 é uma medição, o 2024 é uma
data. A letra distingue-os, e essa distinção é o produto.

**A escala da leitura, desde a v2.** A prosa das camadas de leitura passa a 17 a
18px de base, com entrelinha entre 1,55 e 1,6 (`design/DECISAO.md` escreve 1,55;
a de hoje é 1,6 sobre 16px, e a entrelinha absoluta não desce). Cresce onde se
lê a sério: leitura breve, Fundo, as dez regras do Método, a frase de atribuição de
uma linha. A mobília não cresce, porque continua a ser mobília: a diferença de
escala entre a prosa e o aparelho é o que faz a página ler-se como instrumento e
não como jornal.

---

## 2. Cor com significado

- **Amarelo `--yellow`**, marca de medição. A barra da distância, o município
  aceso, as barras de composição, a região que está a ser lida, as janelas do
  calendário das fontes. **Nunca como cor de texto. Nunca decoração.**
- **Oxblood `--oxblood`**, erro admitido. O registo de correções, e mais nada.
  Nunca ênfase, nunca alerta, nunca «só desta vez».
- **Tudo o resto**: `--paper`, `--paper-2`, `--paper-3`, `--ink`, `--muted`,
  `--rule`, `--rule-strong`.

**A regra para um caso novo: não há acento novo.** Um tipo de página novo não
ganha uma cor. Se for preciso distinguir alguma coisa, distingue-se com peso de
fio, com fundo (`--paper-2` / `--paper-3`) ou com a letra monoespaçada. Nunca com
matiz. Um segundo acento destrói o significado do primeiro.

**Os neutros podem aquecer; os dois acentos não se tocam.** A direção S admite os
neutros quentes (papel, tinta, fio) em lugar dos frios de hoje, com uma condição
que não é de gosto: **cada par usado passa AA em claro e em escuro, medido por um
script no passo de construção**, e não a olho nem por um número copiado de um
racional. O amarelo e o oxblood ficam exatamente como estão, dígito a dígito, e
exclusivos no significado: mexer-lhes na matiz obrigaria a mudar o que o sítio
escreve sobre eles. As medições ficam registadas em `DECISIONS.md` §1.43.

---

## 3. As três disposições, e nenhuma quarta

O invólucro tem 1.180px e a prosa mede de 60 a 68ch. A diferença **não é espaço
vazio**: é a coluna do aparelho. Uma página cuja segunda coluna está vazia ou a
enche, ou estreita o invólucro.

Um tipo de página novo escolhe **uma destas três**. Não inventa a quarta.

- **A · Rótulo e corpo**, coluna de rótulo de 220px, corpo a 68ch. Para texto com
  secções nomeadas. Em uso: `/metodo`, `/a-verificar`, `/sobre`, `/correcoes`
  (`DECISIONS.md` §1.39) e `/agenda` (§1.40). O Sobre é o caso mais magro desta
  disposição; a agenda é o caso mais cheio e **fica em A**: as secções por
  estado continuam com o rótulo na coluna e os itens no corpo, e ganham no topo
  o quadro de estados de §7, que é um instrumento dentro da página (abaixo) e
  não uma quarta disposição.
- **B · Corpo e aparelho**, corpo a 68ch, coluna de 300px com o aparelho:
  proveniência, ressalvas, contagens, ligações ao livro-razão, o que a página
  **não** sabe. Para páginas de leitura e páginas de linha do livro-razão. Em
  uso: `/livro-razao/<id>` e `/municipios/<slug>` (§1.34). **A página de linha
  fica em B**, e a v2 trata-a como a página mais importante do sítio: é onde a
  promessa se cumpre ou não se cumpre.
- **C · Instrumento**, largura toda, o instrumento enche-a. Só para instrumentos.

**Um instrumento dentro de uma página não é uma quarta disposição.** A primeira
página, a página do município e o Método já o fazem: a página mantém a sua
disposição, e o instrumento tem a largura que os instrumentos têm.

**O cabeçalho não é uma caixa.** A marca na sua escala, a linha de método, e um
fio: nenhuma moldura à volta do cabeçalho inteiro. Debaixo dele, **duas leituras
rotuladas e ligadas**, e não microtexto: a reconferência do painel e o estado da
agenda. São leituras de aparelho, cada uma com o seu rótulo e a sua porta.

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

**Todo o instrumento leva as três.** O instrumento n.º 2 leva hoje só duas: não
tem camada 2. Ou ganha uma leitura breve, ou declara por escrito porque não a
tem.

---

## 5. O selo de proveniência

A regra 5 do Método promete, nas duas línguas: *«Ao lado de cada medição há um
selo que abre a sua linha: cheio quando a origem está completa, a tracejado
quando falta um campo.»* Então:

1. **O selo é sempre uma ligação** para a linha do livro-razão. Um selo que não
   liga a lado nenhum não é um selo: é uma legenda, e a promessa fica falsa.
2. **Dois estados, e os dois têm de existir na página.** Quadrado cheio quando a
   proveniência está completa; a tracejado quando falta um campo. Um estado que
   nunca foi desenhado ao lado do outro ainda não é uma distinção.
3. **Onde aparece um valor, aparece o selo. Sem exceção de página.** Inclui o
   valor de cabeça na sua própria página de linha, onde o selo é uma âncora para
   a própria linha: estar já na página certa não dispensa a porta, dispensa a
   viagem (`design/DECISAO.md`, «abertura do recibo»).
4. **O selo escreve «fonte».** Quadrado, cheio ou a tracejado, mais a palavra
   «fonte» sublinhada; **a unidade compacta inteira é a ligação**, com alvo de
   toque suficiente. A palavra existia escondida para leitores de ecrã e um
   leitor com vista via só um título em cinzento: a promessa mais exposta do
   sítio era a mais fácil de não ver.
5. **A etiqueta do estudo não se repete em cada célula.** Aparece no foco e no
   `title`, e na forma longa, que é a página de linha. No cabeçalho não há hoje
   selo nenhum: as contagens saíram a 16.08.2026 (`DECISIONS.md` §1.39) e a
   mobília leva números do sítio, com porta e sem selo (§10). Se um valor do
   livro-razão voltar ao cabeçalho, o selo é o glifo e a palavra, sem a etiqueta
   e sem o marcador, que ficam para leitores de ecrã. Este ponto 5 revê o ponto 4
   da v1, que a 16.08.2026 tinha deixado o cabeçalho só com o glifo (§1.37): a
   etiqueta era o que estorvava, e não a palavra.

---

## 6. Uma só linguagem de incerteza

Um marcador: **`[a verificar]`**. Uma classe: `.marcador`. Uma página que o
explica: **`/a-verificar` · `/en/to-verify`**, construída a 15.08.2026, ligada do
bloco «O que falta nesta linha» de cada linha incompleta e do Método. Substituiu
as quatro formulações que a auditoria encontrou em uso ao mesmo tempo («fonte por
confirmar», `[a verificar]`, `[descrição em preparação]`, `[endereço a
confirmar]`); a segunda saiu a 15.08.2026, com a classe `.tbv`. Um marcador
público que não é explicado em lado nenhum é pior do que não marcar.

**Uma ausência de dados nunca se desenha.** Nem como caixa de exemplo, nem como
espécime, nem como nota de protótipo. A única língua pública para «esta prova não
está aqui» é o marcador, com o seu motivo tipado e o caminho para a correção. Uma
página construída que renda `data-exemplo`, ou qualquer estado «exemplo» ou
«protótipo», é recusada pelo portão. A razão é a de sempre: uma segunda
formulação para a mesma coisa é uma segunda língua. As três direções de desenho
mostraram-no ao renderizarem `EXEMPLO` e `PROTÓTIPO` ao lado de `[a verificar]`,
e a crítica cruzada apanhou as três (`design/CRITICA-codex.md`).

---

## 7. Estados desenhados, não deixados

Todo o componente tem de ter desenhado o estado **cheio, vazio, parcial e
velho**, e não só o feliz.

- **Uma grelha nunca mostra célula vazia.** Ou a contagem é uma constante do
  desenho, ou a última célula tem um estado próprio. Cinco peças numa grelha de
  quatro colunas não é um acaso de largura: é aritmética que não fecha.
- **Uma linha de índice sem descrição di-lo**, em vez de repetir o título.
- **Uma página por escrever declara o que lhe falta**, em vez de fingir corpo.
- **O quadro de estados da agenda é um estado desenhado.** Quatro colunas, «Em
  curso · A seguir · Concluído · Retirado», cada uma com a sua contagem. Uma
  coluna sem itens diz que está vazia e não desaparece, como «Retirado» já faz
  hoje. As contagens entram por `data-prova` (as chaves `agenda_*` da prova) e
  cada uma tem por porta a âncora da sua secção na mesma página (§10).

---

## 8. O que o portão confere, e o que não pode conferir

O livro-razão tem portão desde o primeiro dia. A identidade não tinha nenhum: as
regras acima seguravam-se por atenção. Ao longo dos blocos de 15 e 16.08.2026 uma
parte passou a ser mecânica, e vive dentro dos varrimentos que já existem, pela
moratória de 2026-08-15: **nenhum portão novo enquanto uma conferência couber num
que já existe**.

**O que o portão confere hoje** (`gate:html` e `ledger:check`). A lista completa,
conferência a conferência e com o estrago plantado de cada uma, está em
`DECISIONS.md` §1.34, §1.37, §1.39, §1.40, §1.41 e §1.42; aqui fica só o que cada
regra desta constituição ganhou em máquina:

- **O selo.** Todo o `.src-chip` é uma âncora, ao pé do valor e com o `href` da
  linha daquele valor; a etiqueta é a rendição **daquela** linha, e não uma
  rendição legítima qualquer.
- **Os números do sítio.** Todo o `data-prova` bate certo com o texto que o
  próprio portão escreve para a mesma coisa, tem porta (§10), e o
  `dist/prova.json` é relido por inteiro contra o que o varrimento calculou.
- **Os textos governados.** O Sobre é, carácter a carácter, `src/data/sobre.mjs`;
  a agenda e o calendário são, campo a campo, os registos que atravessaram do
  motor, com as contagens a bater e cada item e cada acontecimento na página;
  nenhum número da prosa da agenda é o valor de uma linha do livro-razão.
- **As portas.** Toda a página construída liga ao Sobre; uma ligação interna
  resolve-se contra a página onde está, mesmo relativa, e a sua âncora existe no
  destino.
- **A escrita.** Nenhuma forma anterior ao Acordo no texto renderizado em pt-PT,
  e nenhum travessão em nenhuma das duas edições (§9).
- **A amarra das decisões** (`ledger:check`): toda a entrada do `DECISIONS.md` a
  partir da §1.38 declara o que governa, e a última entrada que governa um texto
  traz o resumo desse texto tal como ele está. Uma mudança de rumo não sai em
  silêncio.

**As quatro conferências que a v2 acrescenta**, todas extensões de conferências
que já existem, e cada uma só conta depois de fechar sobre um estrago plantado
(`DECISIONS.md` §1.43):

- a etiqueta do selo lê-se de um atributo declarado e compara-se com a etiqueta
  daquela linha, e já não do texto visível do chip, que passa a ser «fonte»
  (extensão da conferência da `proveniencia`, §1.42);
- a porta de um selo pode ser uma âncora na própria página, e o fragmento não
  muda de que linha o selo é porta: é a amarra a resolver-se através dele (§5.3);
- a porta de um `data-prova` pode ser uma âncora na própria página, quando é ali
  que se vê o que ele conta; compara-se resolvida contra a página onde está, e a
  âncora tem de existir no destino (§10);
- `data-exemplo`, e qualquer estado «exemplo» ou «protótipo», é recusado numa
  página construída, na marca, na classe e no rótulo; a mesma palavra dentro de
  uma citação não é recusada, porque reescrever uma prova para lhe tirar uma
  palavra seria pior (§6).

**O que ainda não é conferido por máquina, e é promessa e não facto.** As regras
de folha de estilos de §1 e §2 (nenhum literal de cor fora de `tokens.css`;
`--yellow` nunca como `color`; a família serifada só em `.wordmark`) e o marcador
só na sua classe (§6) **não têm hoje nenhuma conferência**: esperam o
`gate:identidade`, que é a fase 4 e ainda não existe como script. Até lá
seguram-se por atenção; a v1 anunciava-as como conferidas no build por esse
portão, e o portão nunca chegou a existir.

**O que o portão não vê**, e continua a ser trabalho de quem revê: se a segunda
coluna está a fazer alguma coisa (§3), se um instrumento tem as três camadas
(§4), e se um estado vazio foi desenhado ou apenas não aconteceu ainda (§7).

---

## 9. Ortografia e voz

**A superfície pública segue o Acordo Ortográfico de 1990, tal como é aplicado em
Portugal.** Superfície pública é tudo o que rende em HTML, nas duas edições: as
cadeias de texto, os gabaritos, a prosa da casa dos dados e a prosa da casa das
linhas do livro-razão que é publicada (`derivation`, `source_flag_note`, `unit`,
o `reason` de uma correção). O campo `note` não é publicado (`ledger/README.md`)
e por isso não é superfície pública: a passagem converte-lhe as palavras na
mesma, porque é de máquina e não custa nada, e a ferramenta conta como aviso o
que lá ficar.

**O que é transcrito nunca se converte.** Um excerto, o título de um documento, o
nome de uma fonte, o título de um trabalho publicado, uma citação entre «…»:
cita-se pelas palavras exatas, e o travessão de «Évora — Os Pelouros, Quem Os
Teve, O Que Fizeram» é uma delas.

**Os documentos do repositório são registo.** `DECISIONS.md`, `README.md`,
`ledger/README.md`, os `PLANO-*`, os `BRIEF-*` e os `VOZ-*` ficam na grafia em
que foram escritos, e uma entrada nova segue a grafia do ficheiro onde entra.
Este ficheiro é a exceção que se explica a si própria: é a regra, e por isso
escreve-se na grafia que fixa, versão a versão.

**Sem travessões, nas duas edições.** Nem o travessão (—) nem o meio-traço (–)
entre espaços. Onde é preciso separar partes de uma mesma linha usa-se o ponto
médio «·», que já é o separador da casa; onde é preciso um aposto usam-se
vírgulas, dois pontos ou parênteses. A seta «→» não é um traço: é a marca de
ligação do sítio («Abrir a leitura →»), e fica onde já está.

**O marcador não muda.** `[a verificar]` continua a ser o único marcador de
incerteza, com a sua página e a sua classe (§6).

**O mecanismo, e é reversível de propósito.** Uma lista só,
`ortografia/formas.yml`, com as formas e a autoridade que as sustenta; uma
passagem, `scripts/ortografia.mjs`, que a aplica nos dois sentidos (`--aplicar
--sentido=acordo|anterior`); e a conferência, dentro do `gate:html`, que lê a
mesma lista. Os travessões não se convertem por máquina: cada um pede uma frase
nova, e a ferramenta assinala-os com ficheiro e linha.

**A reversão não é só uma corrida da ferramenta.** A ida é de máquina inteira; a
volta é uma corrida da ferramenta **mais uma passagem à mão sobre as formas
listadas como só de ida**. Uma forma só de ida é aquela cuja grafia do Acordo é,
por si, outra palavra corrente: «acto» passa a «ato» sem risco, e «ato» de volta
a «acto» estragaria «eu ato a corda», que sempre se escreveu assim. A lista
marca-as `so_ida: true`, a passagem inversa não lhes toca e imprime-as com
ficheiro e linha, e a lista `manuais` («para», «pelo», «pela», «polo», «pera») já
fazia o mesmo pela mesma razão. Até 16.08.2026 esta secção prometia uma reversão
de máquina inteira, e uma revisão de outra família de modelos mostrou o contrário
correndo a passagem inversa sobre «Eu ato a corda». O que fica por converter e
rende está em `ortografia/restantes.yml`, rota a rota e palavra a palavra, e está
**vazia** desde 16.08.2026 (`DECISIONS.md` §1.40). Continua a existir: é ela que
pára a construção à primeira ocorrência nova.

**Origem.** É a regra por defeito do roteiro, aplicada a 16.08.2026 na ausência
de palavra da direção, e registada como reversível: o diretor pode revogá-la na
pré-visualização, e a revogação é uma corrida da ferramenta, não uma reescrita.
`DECISIONS.md` §1.38.

---

## 10. Números do próprio sítio

Há dois tipos de número numa página, e a letra não chega para os distinguir: uma
medição de Portugal e uma contagem do próprio sítio. «120» pode ser um índice de
convergência ou o número de linhas com proveniência completa.

| | Medição de Portugal | Número do próprio sítio |
|---|---|---|
| Como entra | `<Claim id="…"/>` | `data-prova="<chave>"` |
| Origem | uma linha do livro-razão | `src/lib/prova.mjs`, calculado na construção |
| Ao lado | o selo, que abre a linha | nada |
| Porta | a linha daquele valor | onde se vê o que ele conta |
| Letra | monoespaçada | monoespaçada |

**O selo é do livro-razão e de mais nada.** Pôr um selo ao lado de uma contagem
do sítio seria prometer uma linha que não existe, e diluir o sinal que faz o selo
valer alguma coisa. O que estes números levam em vez do selo é a porta: são
**sempre** uma ligação. Onde aparece um valor, aparece a porta.

**A porta pode ser uma âncora na própria página.** Quando o que o número conta se
vê ali mesmo, o destino é a secção que o mostra. É a regra da abertura do recibo
em §5: a porta não desaparece por o leitor já estar onde ela leva (v2).

**Nunca são escritos.** Uma contagem escrita à mão fica errada na construção
seguinte e ninguém dá por isso. Um número deste tipo que não venha da prova falha
no portão como qualquer outro algarismo sem origem.

**Dentro de um desenho, a porta vai na legenda**, marcada `data-legenda-prova`,
pela mesma razão de §1.34: uma âncora dentro de um `<svg>` não se lê como porta.
É a convenção do selo, aplicada a um número que não leva selo.

*(16.08.2026, `DECISIONS.md` §1.39; a origem entra na tabela do §2.2 como a
sétima.)*

---

## 11. O que a direção S fixa nas páginas

Regras de desenho, e não de estilo: cada uma existe porque a alternativa faz o
leitor comparar ou acreditar em coisa que o sítio não pode provar.

**O painel da primeira página.** Grelha 4/2/1, com economia de texto e **sem
barras por célula**: barras normalizadas cada uma ao seu limiar convidam a uma
comparação que não é válida. Onde um quadro institucional publica um limiar, a
célula leva uma linha mono, «limiar 60% · acima» ou «abaixo», com o limiar no
motivo `limiar-do-quadro` e a palavra de comparação derivada de dois números que
já existem. A percentagem escreve-se colada ao número, como o painel já escreve
«limiar 60%»; onde o sítio a escrevia com espaço («9 %», na agenda) passa a
escrevê-la assim. **Nenhuma distância nova.** O desenho de distância vive no
instrumento, onde há uma escala partilhada, e não nas células.

**A página de linha é um recibo, e esta é a ordem.** O valor com o seu próprio
selo, a unidade e o id; uma frase de atribuição; o bloco da prova; o campo
devolvido ou o excerto; o pedido exato ou o endereço; as verificações numa tabela
de duas linhas, «Lido a» e «Reconferido a», com o marcador quando a releitura
falta; as correções. A coluna do aparelho tem 300px e leva a proveniência em
campos, o estado da proveniência, o acesso aos dados, esta linha noutro sítio e a
porta das correções. **Sem «como se lê este recibo»**: uma interface que explica
a interface antes de dar a prova está a adiar a prova.

**A agenda.** O quadro de estados de §7 no topo, itens como cartões curtos, e o
calendário das fontes desenhado **num eixo de tempo**: as janelas de publicação a
amarelo, porque são marcas de medição, os dias como marcas, e a legenda a levar
as portas. As marcas do eixo vão com `data-nonledger="escala-de-instrumento"`,
porque são escala de instrumento e não valores.

**Móvel.** Uma coisa por linha. O valor, o título e o selo ficam num só grupo
visível, para que a porta nunca se separe do número que abre. Os instrumentos
rolam dentro da sua caixa, e não empurram a página.

---

## 12. Os limites, escritos em vez de contornados

- **Os testes 1 e 3 do `BRIEF-confianca.md` §6.8 não passam com desenho.** O
  recorte da linha impressa e o campo `verifications[]` são dados que ainda não
  existem, e são o bloco T. O desenho deixa o lugar pronto e não inventa nada:
  onde o recorte não existe não há caixa, há o marcador com o seu motivo (§6).
- **O teste 8 conta-se no portão, não num protótipo.** Os três racionais contaram
  os valores da primeira página de três maneiras (28, 32, 35). A contagem que
  vale é a que o portão faz sobre a construção real.

---

*Origem: o Estudo de Identidade v2 (12.08.2026, arquivado em
`studies-src/_identidade/`); regras derivadas da auditoria de 13.08.2026; v2 da
decisão de desenho de 16.08.2026, `design/DECISAO.md`.*
