# F1.6 · o atraso do IEFP e as duas frases · relatório do construtor

*Ramo `frescura-2026-09-04`, tirado de `origin/main` em `6d63adfd`. Construtor
Claude Opus 5, 04.09.2026. O bloco é o F1.6 do
`design/observatorio/PLANO-fiabilidade-2026-09-02.md` §3 e cumpre as decisões
(2), (3) e (5) da `DECISIONS.md` §1.98. Sem travessões na prosa.*

## 1 · O resultado, em cinco linhas

**O atraso do IEFP diz-se**, nas 278 páginas de linha do continente e nos 278
cartões de concelho, nas duas edições: «Último período publicado pela fonte:
2026-07; a casa publica 2025-12 desde 26.08.2026». Os três valores são lidos, e
nenhum é literal no gabarito.

**O contador está no cabeçalho**: «Séries atrasadas: 1 · 278 linhas do
livro-razão», com as duas contagens marcadas `data-prova` e recontadas pelo
portão a partir do livro-razão.

**O Portal BASE está no Método**, no limite da regra 1, nas duas edições, com a
§1.99 a carimbar `metodo 8c9aa6a9b7b9`.

**A frase do Painel Social mudou**, e mudou com a fonte citada: o Anexo 2 do
Relatório Conjunto sobre o Emprego de 2026 da Comissão, COM(2025) 958, imprime a
lista das medidas principais e ela tem dezassete. **Nenhum pedido saiu deste
portátil**: o ficheiro estava no motor, com o seu recibo.

**Um defeito encontrado e não corrigido** está na §7: `.linha-selo-estado`, que é
do bloco F0.11, rende cada rótulo numa linha própria pela mesma causa que este
bloco corrigiu na sua.

## 2 · O atraso: onde vive cada um dos três valores

A regra do brief é que nenhum dos três seja escrito à mão. Cada um tem um
caminho diferente, e os três são conferidos por um portão que os recalcula de um
segundo ponto de observação.

| valor | de onde vem | quem o reconfere |
| --- | --- | --- |
| `2026-07`, o período da fonte | `src/data/frescura.mjs`, com a origem declarada | `check:formas` F13 (contra a declaração) e F14 (a declaração contra a origem que ela nomeia) |
| `2025-12`, o período da casa | `reference_date` da própria linha, pelo `DataDaLinha` | `check:formas` F1, que vai buscar o campo à linha e aplica `dataDaCasa()` por conta própria |
| `26.08.2026`, o «desde» | `access_date` da própria linha, pelo `DataDaLinha` | `check:formas` F1, o mesmo caminho |

**A origem do `2026-07`, escrita por extenso.** `src/data/frescura.mjs` declara
o ficheiro, o registo, o campo e a data em que foram lidos:
`design/observatorio/inventario/INVENTARIO-DAS-FONTES.json`, registo `T2`, campo
`ultimo_periodo`, lido a 2026-09-01. O que esse campo diz, palavra por palavra:

> «(a) 2025. (b) julho de 2026 (a folha imprime «Ano Mês: 202607»); não há
> ficheiro de agosto de 2026 à data de hoje»

e o campo `acesso` do mesmo registo diz quando: «(b) 2026-09-01T08:17:26Z
(página); 08:18:20Z (ficheiro)». O ficheiro da fonte é
`https://www.iefp.pt/documents/10181/13482465/SIE+-+Desemprego+registado+por+concelhos+julho+2026.ods/e806f32b-342d-46cd-a23e-38e482f01d59`.

**A conferência F14 não lê a prosa: lê o que a folha da fonte imprime.** Vai
buscar `Ano Mês: 202607` ao campo por expressão regular e compõe `2026-07`. Se o
inventário passar a dizer outro mês, ou deixar de trazer o carimbo da folha, a
construção fecha. É a mesma disciplina do `data-prova` e do `data-da-linha`: duas
contas do mesmo facto, feitas de sítios diferentes.

**Que linhas a série apanha, e porquê essas.** Por regra e não por lista: a linha
pertence à série quando `source`, `document.title` e `reference_date` batem certo
com o que a série declara. Medido no livro-razão:

```
310 ficheiros ledger/claims/*desemprego-registado*
278  IEFP · 2025-12   ← a série atrasada
 19  DRQPE (Açores) · 2025-12
 11  IEM (Madeira) · 2025-12
  1  IEFP · 2024-12   (evora-desemprego-registado-2024)
  1  IEFP · 2013-12   (evora-desemprego-registado-2013)
```

As trinta das ilhas ficam de fora porque a fonte é outra: a DRQPE e o IEM
publicam os seus próprios ficheiros, e o atraso deste é do IEFP. As duas de Évora
ficam de fora porque o período é outro: são pontos históricos de uma série dentro
de um estudo, e um valor de dezembro de 2013 não está atrasado por 2026 existir.
As 278 do continente são exactamente o que a fonte cobre, e o inventário das
fontes di-lo com a contagem feita: «sim, 278, só o Continente: contei 278 linhas
de concelho no Quadro_I e o total é "Continente"».

**Onde a frase aparece.** Na página da linha vai na cabeça, ao pé do selo, pela
razão que o F0.11 escreveu para o estado da fonte: o leitor tem de ver o atraso
antes de acreditar no número, e não no bloco das verificações a meia página de
distância. Na página do concelho vai na `frase` da peça daquela medida, que é o
lugar que a peça já tem para uma ressalva; `src/components/inicio/Peca.astro` não
muda um carácter, porque outro construtor trabalha nesse directório hoje. Onde a
medida já tem nota, o atraso vai a seguir dela e não no lugar dela (é o caso do
desemprego registado, cuja nota é «Inscritos no fim do mês nos serviços de
emprego, ficheiro mensal por concelho.»).

## 3 · O contador, e a leitura do brief que eu tomei

O brief pede «um contador público "séries atrasadas: n" no cabeçalho do painel de
frescura (o `n` contado das linhas com esse estado)», e a medida K2 pede «o `n`
igual à contagem das linhas nesse estado». **As duas frases não pedem o mesmo
número:** as séries atrasadas são uma e as linhas que ela apanha são 278.
Escrever «séries atrasadas: 278» era o rótulo a contar uma coisa e o número
outra, que é a classe de defeito que a regra da casa sobre o nome e o conteúdo
existe para apanhar; escrever só «séries atrasadas: 1» escondia o tamanho do que
está atrasado.

**Rendem-se as duas**, na gramática que a leitura da agenda já usa no mesmo
cabeçalho desde 16.08.2026:

```
Séries atrasadas: 1 · 278 linhas do livro-razão
```

`series_atrasadas` e `linhas_atrasadas` são duas chaves de `src/lib/prova.mjs`, e
`scripts/gate-html.mjs` reconta as duas a partir do livro-razão com a regra dos
três campos escrita outra vez, do seu lado. A porta das duas é a regra 6 do
Método (`#releitura`), que é a mesma para onde a leitura das fontes ao lado já
abre: o que estas contagens dizem não é quantas linhas existem, é que a fonte já
publicou um período mais recente do que aquele que elas medem.

**Com zero rende-se o zero**, e o sufixo das linhas sai: zero séries não têm
linhas. A condição está no componente e não numa folha de estilo.

**O contador não se vê no telemóvel, e isso é uma decisão de outro bloco.** A
folha esconde toda a mobília a partir da segunda leitura abaixo de 640px
(`src/styles/site.css`, `@media (max-width: 640px)`, «A primeira leitura fica; as
outras saem do telemóvel»). O contador é a terceira leitura, e por isso a 390 não
aparece, como já não aparecem a leitura das fontes nem a linha da agenda.
Medido nas capturas `linha-iefp-390-*.png` e `metodo-390-*.png`. **Não mudei
essa regra**: mudá-la mexe na altura do cabeçalho de todas as páginas, que é
exactamente o que o bloco F1.1b está a medir em paralelo hoje. Fica escrito para
a direção decidir se a leitura da frescura merece o lugar no primeiro ecrã.

## 4 · O Portal BASE no Método

**A frase**, nas duas edições, no limite da regra 1 («As fontes»):

> «Uma fonte, o Portal BASE, recusa os pedidos que se identificam com o nome da
> casa: a casa lê-a com a identidade de um navegador comum, e é a única fonte
> lida assim.»
>
> «One source, Portal BASE, refuses requests that identify themselves with the
> house's name: the house reads it with the identity of an ordinary browser, and
> it is the only source read that way.»

**As duas metades são medidas.** A recusa: `core/sources.py` no motor, na entrada
`portal_base`, com a razão escrita e datada, «medido a 26.07.2026 (learnings.md):
o Portal BASE responde 404 a TODOS os caminhos quando o User-Agent não é de
navegador». A exclusividade: contei as bandeiras naquele ficheiro,
`grep -n "browser_ua" core/sources.py` devolve treze linhas de `browser_ua`, uma
a `True` e doze a `False`. Desde 03.09.2026 (bloco F0.8) o `core/http.py` recusa
qualquer `User-Agent` que não seja o desta casa e a única excepção é uma fonte que
declare as duas coisas, a bandeira e a razão por escrito.

**O que a frase não diz.** Não traz o estado HTTP nem o nome do cabeçalho: o
texto governado do Método não leva algarismos, por construção. Não fala de
confiança nem da diligência da casa (Emenda 15 e Emenda 18). O comentário do
motor chama à excepção «uma dívida e não uma solução», e isso está na §1.99 e não
na página do leitor: declarar não paga a dívida, torna-a visível.

**O carimbo.** A §1.99 traz `**Afecta:** metodo` e `**Texto:** metodo
8c9aa6a9b7b9`, que é o resumo de `src/data/metodo.mjs` depois da mudança; a
entrada anterior que governava o texto era a §1.89, com `e327c482c6db`.

## 5 · O Painel Social: a fonte, o excerto e a contagem

**A condição do brief era o número estar conferido na fonte. Está**, e num
documento operativo da Comissão em vez de numa página de navegação.

**A fonte.** *Joint Employment Report 2026*, COM(2025) 958, **Anexo 2, «Social
scoreboard headline indicators»**. O parágrafo de abertura, palavra por palavra:

> «The analysis in the 2026 Joint Employment Report relies on the Social
> Scoreboard headline indicators endorsed by the Council. Headline indicators
> respond to principles of parsimony, availability, comparability, and
> statistical robustness. The indicators, linked to each of the three Pillar
> chapters, are as follows:»

e a nota de rodapé 1, que diz quem os aprovou:

> «The opinion by EMCO and SPC reporting on the agreement reached on the headline
> indicators of the revised Social Scoreboard was endorsed by the Employment,
> Social Policy, Health and Consumer Affairs Council on 14 June 2021.»

**O número é a contagem da lista dele, e o documento não o imprime.** Diz-se
assim em vez de se dizer «a fonte publica dezassete», porque não é a mesma coisa.
Contadas por capítulo, mecanicamente, sobre o texto extraído do PDF:

```
  6  Equal opportunities
  4  Fair working conditions
  7  Social protection and inclusion
 17  total
```

Os seis do primeiro capítulo: adult participation in learning; early leavers from
education and training; basic or above basic overall digital skills; NEET rate;
gender employment gap; income quintile ratio (S80/S20). Os quatro do segundo:
employment rate; unemployment rate; long-term unemployment rate; GDHI per capita
growth. Os sete do terceiro: AROPE rate; AROPE rate for children; impact of
social transfers; disability employment gap; housing cost overburden; children
under 3 in formal childcare; self-reported unmet need for medical care.

**Nenhum pedido saiu deste portátil, e o brief autorizava um.** O ficheiro já
estava no motor, descarregado pelo caminho normal dele e com recibo em
`content/10 Housing/Technical Source/raw/MANIFEST.json`:

```
file      pdfs/ec_jer_2026_annexes_com_2025_958.pdf
url       https://employment-social-affairs.ec.europa.eu/document/download/
          82702c6c-135c-4042-ae74-4afd6432e83f_en?filename=COM_2025_958_1_EN_annexe.pdf
fetched   2026-08-18T15:07:56+00:00
status    200
bytes     1702896
sha256    0d49c0bc0283ff99cbf7232fe09932c2a42ac3091954e496d8a2368cd2e71f16
```

Confirmei o resumo do ficheiro em disco antes de o ler (`shasum -a 256`, o mesmo
sha256). Uma cópia com recibo é uma citação mais forte do que uma página de
navegação lida hoje, e por isso o pedido que o brief autorizava não foi gasto.

**A frase que passou a estar no ar**, nas duas edições:

> «Oito das dezassete medidas principais do Painel Social Europeu: as que o
> livro-razão guarda e cujo registo nomeia esse painel, sem cor porque não tem
> limiares. Os valores são do Eurostat, confirmados contra o Relatório por País
> 2026 da Comissão Europeia, SWD(2026) 222.»
>
> «Eight of the seventeen headline indicators of the European Social Scoreboard:
> the ones the ledger holds whose record names that scoreboard, with no colour
> because it has no thresholds. The values are from Eurostat, confirmed against
> the European Commission's country report, SWD(2026) 222.»

**O numerador não está escrito.** Compõe-se de `FIGURAS_SOCIAL.length` no próprio
ficheiro de dados, com uma lista fechada de numerais por extenso. Se uma medida
entrar ou sair do painel, a frase muda sozinha, a linha do inventário da voz
deixa de se render e a construção fecha com o nome dela. Isto é o que responde à
objecção que o inventário escreveu contra as contagens por extenso («uma frase
com um número que se move volta com outro número, e a linha nunca voltaria a
morder»): esta volta com outro número **e** com outra linha.

**O denominador está declarado com a origem**, em
`MEDIDAS_PRINCIPAIS_DO_PAINEL_SOCIAL` (`src/data/figuras.mjs`), com o documento,
o endereço e a data em que foi lido, e a conferência F16 do `check:formas` exige
que a frase continue a dizê-lo. Não pode ser recontado por nenhum portão deste
repositório, e isso está escrito no cabeçalho da declaração em vez de ficar
implícito.

**O que ficou de fora.** A frase do painel do Procedimento não mudou: o brief só
pede esta. E a régua A4 do F1.1 continua verde (o `check:voz` fecha a construção
com autorreferência acima de zero, e está a zero).

## 6 · As sete medidas de aceitação

| # | medida | resultado |
| --- | --- | --- |
| **K1** | a frase do atraso nas 278 páginas de linha e nos 278 cartões de concelho, nas duas edições, com os três valores a resolverem em ficheiros com origem | **verde** |
| **K2** | «séries atrasadas: n» no painel de frescura, com o `n` contado | **verde**, com a leitura do brief dita na §3 |
| **K3** | o parágrafo do Portal BASE nas duas edições, a §1.99 a carimbar `metodo`, `ledger:check` verde | **verde** |
| **K4** | a frase do Painel Social mudada só com a fonte citada | **verde**, mudada; a fonte, o excerto e a contagem na §5 |
| **K5** | nenhum número novo fora dos que os ficheiros com origem trazem; `check:voz` com as cadeias novas declaradas | **verde** |
| **K6** | `build`, `verify`, `typecheck` a 0 | **verde** |
| **K7** | três plantas vermelhas e depois verdes | **verde**, 3 de 3 |

**K1, medido no `dist/`:**

```
$ grep -rl 'data-nonledger="periodo-da-fonte"' dist/livro-razao/ | wc -l      → 278
$ grep -rl 'data-nonledger="periodo-da-fonte"' dist/en/ledger/ | wc -l        → 278
$ grep -rl 'data-nonledger="periodo-da-fonte"' dist/municipios/ | wc -l       → 278
$ grep -rl 'data-nonledger="periodo-da-fonte"' dist/en/municipalities/ | wc -l → 278
```

e o `check:formas` diz o mesmo do seu lado, com a conta feita do livro-razão e
não da varredura: «atraso: 1 série(s), 278 linha(s), 1112 período(s) da fonte
conferido(s)». A leitura do código: o gabarito não tem nenhum dos três valores
escrito; tem `{atraso.periodoDaFonte}`, `<DataDaLinha campo="reference_date">` e
`<DataDaLinha campo="access_date">`.

**K2, medido no `dist/`:**

```
$ grep -rl 'data-prova="series_atrasadas"' dist --include="*.html" | wc -l  → 7222
$ find dist -name "*.html" | wc -l                                          → 7238
```

As dezasseis páginas sem o contador são os documentos alojados dos estudos, que
não têm cabeçalho nenhum (a mesma dezena e meia que aparece na conta do
`check:alvos`, «16 sem porta (os documentos alojados)»). O portão reconta 1 e
278, e a página rende 1 e 278.

**K5.** O `numeros-novos.mjs` é a régua da primeira página e o bloco não lhe toca
(nenhuma cadeia nova entra em `/` nem em `/en/`; a frase do Painel Social muda de
redacção e é declarada). O que mede o resto é o `gate:html`, que recusa qualquer
algarismo sem origem declarada em qualquer página construída, e ele está verde
com o motivo novo `periodo-da-fonte` a ser usado 1112 vezes. `check:voz`: «830
frases distintas … autorreferência 0 · nada por classificar · 784 linhas do
inventário com bloco (696 vivas, todas rendidas; 88 retiradas, nenhuma rendida)».

**K7, as três plantas.** Cada uma foi plantada, corrida, lida, e revertida; o
verde a seguir é o da árvore reposta.

| planta | o que se plantou | vermelho | verde |
| --- | --- | --- | --- |
| 1 | um período escrito à mão no gabarito (`2026-08` no lugar de `{atraso.periodoDaFonte}`) | `check:formas` sai 1 com **556 problemas**: «o período da fonte da série "iefp-desemprego-registado-concelhos" não é o que a declaração traz. em src/data/frescura.mjs: 2026-07 / renderizado: 2026-08» | sai 0 |
| 2 | o contador a 0 com linhas atrasadas (`series_atrasadas` forçada a `0` em `prova.mjs`) | `gate:html` sai 1: «o número da prova "series_atrasadas" foi renderizado como "0" e o portão escreve-o "1"» | sai 0 |
| 3 | a §1.99 sem o carimbo (linha `**Texto:** metodo …` retirada) | `ledger:check` sai 1: «§1.99 nomeia metodo e não traz **Texto:** com o resumo … §1.99 carimba (nada) … src/data/metodo.mjs está hoje em 8c9aa6a9b7b9» | sai 0 |

## 7 · O que encontrei e não consertei

**`.linha-selo-estado` rende cada rótulo numa linha própria.** `.linha-campo-k` é
`display: block`, porque no aparelho cada rótulo vive por cima do seu campo; na
cabeça da página de uma linha, uma frase com rótulos por dentro sai partida.
Apanhei-o na primeira captura da minha própria frase, que saía em seis linhas, e
corrigi a minha com `.linha-selo-atraso .linha-campo-k { display: inline }`. **A
do estado da fonte tem o mesmo problema pela mesma causa e fica como está**: é
desenho do bloco F0.11, hoje visível em quatro linhas do livro-razão, e mudá-la
sem brief era mexer no que outro bloco mediu. É uma linha de folha de estilo no
dia em que a direção a quiser.

**O contador não chega ao telemóvel**, e a razão está na §3: a regra dos 640px é
de outro bloco e mexe na altura do cabeçalho que o F1.1b está a medir hoje.

**A rota `linha` continua fora de `ROTAS_DO_INVENTARIO`**, e por isso os três
rótulos novos da página da linha não são lidos pela régua da voz naquela rota;
são-no na rota `municipio`, onde as mesmas cadeias se rendem no cartão, e é por
isso que estão declarados. A proposta de inventariar a rota `linha` já está na §5
do relatório do corredor e este bloco não a executa.

**As cadeias que só a marca `data-voz` deixou declarar.** Seis das catorze linhas
novas do inventário só puderam ser declaradas por levarem `data-voz`: a régua
salta um bloco com marca de origem lá dentro em qualquer rota fora de
`ROTAS_COM_ORIGEM_LIDA` (e `municipio` não está nessa lista), e o rótulo do
contador vive dentro de uma âncora, que a régua lê como destino e não como frase.
A marca só alarga a peneira. **Pôr `municipio` em `ROTAS_COM_ORIGEM_LIDA`** é a
correcção de fundo e não se faz aqui: traria à régua todas as frases das peças de
308 páginas de uma vez, que é uma migração do inventário e não uma correcção.

## 8 · Os ficheiros

| ficheiro | o que mudou |
| --- | --- |
| `src/data/frescura.mjs` | **novo.** A declaração das séries atrasadas, com a origem de cada período e o guarda da forma |
| `src/lib/frescura.mjs` | **novo.** A regra de pertença e as duas contagens, numa conta só |
| `src/views/LinhaView.astro` | só o bloco do atraso, na cabeça (o F1.4 tocou as datas e o endereço, o F1.7 as unidades e as leis: linhas diferentes) |
| `src/views/MunicipioView.astro` | só a frase do cartão do desemprego registado (`fraseDaPeca`) |
| `src/components/SinalDasFontes.astro` | o contador, e o cabeçalho do ficheiro a dizer porque é que ele cabe aqui sem contradizer o parágrafo que recusa contagens |
| `src/components/Masthead.astro` | uma linha: passar `lang` ao componente |
| `src/components/Frase.astro` | três pedaços novos, `data`, `serie` e `voz` |
| `src/data/metodo.mjs` | a segunda frase do limite da regra 1 |
| `src/data/figuras.mjs` | a declaração do número das medidas principais, os numerais por extenso, e a frase do Painel Social |
| `src/i18n/strings.mjs` | cinco chaves novas por edição |
| `src/lib/prova.mjs` | duas chaves novas |
| `src/tipos.d.ts` | `SerieAtrasada` e `OrigemDaSerieAtrasada` |
| `src/styles/site.css` | a classe do atraso, com o mesmo desenho do estado da fonte |
| `scripts/check-formas.mjs` | F13 a F16 |
| `scripts/gate-html.mjs` | a recontagem das duas chaves novas |
| `scripts/provar-guardas.mjs` | cinco casos do guarda novo |
| `ledger/allowlist.yml` | o motivo `periodo-da-fonte`, com a conferência que o impede de ser dispensa |
| `DECISIONS.md` | só a §1.99 |
| `design/especime-v3/INVENTARIO-FRASES.md` | catorze linhas novas, duas retiradas |
| `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md` | a entrada do bloco `frescura` |
| `design/especime-v3/capturas/frescura-2026-09-04/` | doze capturas |

**Não toquei** em `HomeView.astro`, `src/components/inicio/*`, `public/js/inicio.js`,
`src/styles/inicio.css` nem `tests/inicio/*`, que são do bloco que corre em
paralelo.

## 9 · As capturas

Doze, em `design/especime-v3/capturas/frescura-2026-09-04/`, todas PNG, tema
claro, página inteira: `linha-iefp`, `metodo` e `concelho`, a 390 e a 1280, nas
duas edições. A linha é `evora-desemprego-registado-2025-12`, que é uma das 278.
