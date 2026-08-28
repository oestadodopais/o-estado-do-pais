# Relatório · as áreas de governo

*Escrito pelo construtor (Claude Opus 5) a 28.08.2026, contra
`briefs/BRIEF-areas-de-governo.md` e a lista de
`briefs/ministerios-xxv-2026-08-28.md`. Ramo `areas-2026-08-28`, saído de `main`
em `45a9708`. Cada commit com `npm run build` (a cadeia inteira das réguas),
`npm run verify` e `npm run typecheck` verdes antes de ser escrito. Sem fusão e
sem envio: o ramo fica para o lugar de direção. Sem travessões na prosa.*

*O FICHEIRO TEM DUAS PARTES, E A SEGUNDA REVOGA A REGRA DA PRIMEIRA. A primeira
parte (§1 a §9) é a construção da manhã de 28.08, com a regra de quem publica o
número. À tarde o diretor mudou a regra para o ASSUNTO, e a segunda parte (§10 e
seguintes) é essa. A primeira fica escrita e não se apaga: é ela que diz o que
foi verificado na lei orgânica e porque é que a regra antiga era rigorosa e
ilegível, e a regra nova só se entende contra ela.*

| commit | o quê |
| --- | --- |
| `7202c48` | as áreas de governo: o mapa, as dez páginas, a navegação, o portão, a régua e o inventário |
| `1a0267a` | o comando da primeira página com quatro posições cabe no telemóvel |
| `dbeaf7a` | o relatório da primeira parte |
| `3398144` | a regra do assunto: as nove áreas, as 21 matérias, as 31 regras, a A7 e o inventário |
| `ed6fb4a` | a segunda parte do relatório |
| `bcd1fe5` | os nomes ingleses verificados na fonte do Governo, e a ressalva que sai |
| `de1789a` | a leitura cruzada: a medida lê-se como uma medida, os grupos por matéria, a porta legal, as descrições que saem, o rótulo da cabeça declarado |
| (este) | a terceira parte do relatório |

---

## 1 · A tutela da DGAL, que era a pergunta aberta do brief

O brief mandava verificá-la na lei orgânica do XXV Governo antes de pôr Évora e
os concelhos numa área, e dava como alternativa uma área própria «Autarquias
locais», dita como divisão do sítio. **A alternativa não foi precisa: a lei
nomeia a Direção-Geral das Autarquias Locais e diz de quem ela é.**

**A fonte.** Decreto-Lei n.º 87-A/2025, de 25 de julho, que aprova o regime de
organização e funcionamento do XXV Governo Constitucional, publicado no *Diário
da República*, 1.ª série, n.º 142, Suplemento, de 25 de julho de 2025, páginas 2
a 27. Lido a 28.08.2026 no ficheiro que o próprio Diário serve,
`https://files.diariodarepublica.pt/1s/2025/07/14201/0000200027.pdf` (836 420
bytes). Uma segunda cópia, alojada pela CCDR do Centro, foi descarregada primeiro
e tem exactamente os mesmos bytes; o que se cita é o do Diário.

**O artigo, transcrito.** Artigo 15.º, «Economia e Coesão Territorial», n.º 3:

> 3 — O Ministro da Economia e da Coesão Territorial exerce o poder de direção
> sobre:
>
> a) A Direção-Geral da Economia;
>
> b) A Direção-Geral do Consumidor;
>
> **c) A Direção-Geral das Autarquias Locais;**
>
> d) O Fundo para a Inovação Social;
>
> e) A Unidade Nacional de Gestão do Mecanismo Financeiro do Espaço Económico
> Europeu.

O n.º 1 do mesmo artigo diz que aquele ministério tem por missão «formular,
conduzir, executar e avaliar as políticas de coesão territorial, **de
administração local**, do ordenamento do território, de cooperação territorial
europeia, de desenvolvimento regional, de cidades e de valorização do interior».

**A segunda ocorrência, e porque não é a mesma coisa.** A DGAL aparece uma
segunda vez no diploma, no artigo 16.º, «Ministro Adjunto e da Reforma do
Estado», n.º 4, alínea d). Ali o poder é outro e está escrito no n.º 3: «pode
intervir junto dos serviços da Administração direta do Estado, determinando a
adoção de atos, procedimentos ou operações materiais», em matéria de modernização
da Administração Pública, e a lista do n.º 4 tem catorze organismos de sete áreas
diferentes (a Direção-Geral da Economia, o IMT, o IHRU, o IRN, a FCT, o ISS…).
**O poder de direção é o do artigo 15.º**, e é ele que decide a área.

**E a retificação não lhe toca.** A Declaração de Retificação n.º 38/2025/1, de
22 de setembro (*DR*, 1.ª série, n.º 182), corrige uma única inexatidão do
decreto-lei: na alínea b) do n.º 11 do artigo 26.º, «Conselho Nacional da
Juventude» passa a «Conselho Consultivo da Juventude». Nenhum dos artigos citados
neste relatório muda.

**Consequência para o desenho.** Não há área «Autarquias locais», e a linha do
brief que a previa não foi usada. As linhas da DGAL (a dívida, o limite e o prazo
médio de pagamento dos concelhos, e as oito de Évora) ficam na área **Economia e
Coesão Territorial**, que é também a área da Direção-Geral do Território. A área
das autarquias e a área da economia são a mesma área, e isso é do Governo e não
uma arrumação nossa.

---

## 2 · A regra, e porque é só uma

O brief escreve o critério no seu §0: «os trabalhos, as leituras, as linhas do
livro-razão e as medidas dos concelhos **cujas fontes pertencem a essa área**», e
no §2 diz que cada peça leva «a razão (a fonte da peça e o organismo que a
publica)». É essa a regra que ficou construída, e é a única:

> **A área de uma peça é a do organismo que publica o seu número.**
>
> A fonte de uma linha é o campo `source` do livro-razão; a área desse organismo
> é a que a lei orgânica lhe dá, e o artigo está escrito ao lado de cada entrada
> em `src/data/areas.mjs`.

**Não há uma segunda regra, e a ausência é deliberada.** Arrumar um trabalho pela
matéria de que ele trata («um trabalho regional é da coesão territorial») seria um
juízo editorial sem porta: ninguém o poderia conferir contra nada, e a área
passava a ser uma gaveta, que é o que o §2 do brief proíbe. A regra que está
construída confere-se contra um artigo de um decreto-lei e contra um campo de uma
linha, e é por isso que `scripts/check-areas.mjs` a pode medir.

Um trabalho entra numa área quando **uma das suas linhas** lá entra, e traz
consigo quais foram. É por isso que «Évora, Quinze Anos, Cinco Mandatos» está em
duas áreas: dez das suas linhas são da Secretaria-Geral do Ministério da
Administração Interna e duas são do serviço de emprego. As duas razões são
diferentes, e o portão exige que sejam.

---

## 3 · O mapa, com as razões

Quatro áreas, 39 peças. Os organismos, os artigos e as contagens:

### Presidência · `/areas/presidencia` · 10 peças

| organismo | artigo | poder |
| --- | --- | --- |
| INE | Artigo 14.º, n.º 5, alínea a) | superintendência e tutela |

> O Ministro da Presidência exerce os poderes de superintendência e tutela sobre:
> a) O Instituto Nacional de Estatística, I. P.;

* **1 trabalho** · «Évora — Economia, Investidores, Portas Abertas 2026», por
  oito linhas do INE;
* **1 estudo de dados** · «Concelhos: as medidas centrais», por 921 linhas do INE
  (a população, o poder de compra e as empresas dos 308);
* **8 medidas** · `alentejo-central-poder-de-compra-2023`,
  `evora-concentracao-vab4-2024`, `evora-empresas-2024`,
  `evora-poder-de-compra-2023`, `evora-populacao-2021`, `evora-populacao-2025`,
  `evora-vab-empresarial-2024`, `portugal-concentracao-vab4-2024`.

### Economia e Coesão Territorial · `/areas/economia-e-coesao-territorial` · 14 peças

| organismo | artigo | poder |
| --- | --- | --- |
| Direção-Geral das Autarquias Locais (DGAL) | Artigo 15.º, n.º 3, alínea c) | direção |
| Direção-Geral do Território (DGT) | Artigo 15.º, n.º 4 | direção, em coordenação com o Ambiente e Energia e com a Agricultura e Mar |

* **1 trabalho** · «Évora — Orçamentado, Pago, Devido 2025», por oito linhas da
  DGAL;
* **1 estudo de dados** · «Concelhos: as medidas centrais», por 922 linhas da
  DGAL (a dívida, o limite legal e o prazo médio de pagamento dos 308);
* **12 medidas** · as oito de Évora (`evora-divida-dgal-2014`, `-2017`, `-2021`,
  `-2024` e os quatro limites) e as quatro contagens da Carta Administrativa
  (`municipios-continente-caop-2025`, `-madeira-`, `-acores-`, `-portugal-`).

### Administração Interna · `/areas/administracao-interna` · 11 peças

| organismo | artigo | poder |
| --- | --- | --- |
| Secretaria-Geral do Ministério da Administração Interna (SGMAI) | Artigo 21.º, n.º 2, alínea d) | direção |

* **1 trabalho** · «Évora — Quinze Anos, Cinco Mandatos», por dez linhas da
  Secretaria-Geral;
* **10 medidas** · os lugares da câmara, os mandatos de cada lista em 2009, 2013,
  2017, 2021 e 2025, e a composição do executivo de 2025.

Esta área não tem estudo de dados: nenhuma das 2 459 linhas dos concelhos é
publicada pela Secretaria-Geral.

### Trabalho, Solidariedade e Segurança Social · `/areas/trabalho-solidariedade-e-seguranca-social` · 4 peças

| organismo | artigo | poder |
| --- | --- | --- |
| Instituto do Emprego e Formação Profissional (IEFP) | Artigo 24.º, n.º 7 | superintendência e tutela, em coordenação com a Economia e Coesão Territorial |

* **1 trabalho** · «Évora — Quinze Anos, Cinco Mandatos», por duas linhas do
  serviço de emprego;
* **1 estudo de dados** · «Concelhos: as medidas centrais», por 278 linhas do
  serviço de emprego (o desemprego registado dos concelhos do continente);
* **2 medidas** · `evora-desemprego-registado-2013` e
  `evora-desemprego-registado-2024`.

**Os 30 concelhos das ilhas não estão aqui, e é por a regra ser a regra:** o
desemprego registado dos Açores é publicado pela Direção Regional de Qualificação
Profissional e Emprego e o da Madeira pelo Instituto de Emprego da Madeira, que
são dos governos regionais e não do Governo da República. O brief já o previa
(«as duas direções regionais são dos governos regionais, e a linha da área
di-lo»), e a forma que isso tomou foi a exclusão escrita, na lista das fontes sem
área.

---

## 4 · O que ficou de fora, e porquê

**Onze organismos publicam linhas neste livro-razão e não dão área a nada.** A
lista está em `SEM_AREA`, em `src/data/areas.mjs`, cada um com a razão, e o
portão fecha a construção se uma fonte nova não estiver nem numa área nem nesta
lista. Não é uma lista de coisas por fazer: é a lista das decisões que a regra
tomou.

| fonte | razão |
| --- | --- |
| Eurostat | É o serviço de estatística da União Europeia, e não um organismo do Governo português. |
| ERSAR | A lei orgânica do XXV Governo **não a nomeia em artigo nenhum**. |
| Município de Évora | É uma autarquia local. |
| Direção Regional de Qualificação Profissional e Emprego (DRQPE) | É do Governo Regional dos Açores. |
| Instituto de Emprego da Madeira, IP-RAM (IEM) | É do Governo Regional da Madeira. |
| Estrutura de Missão Recuperar Portugal | A lei orgânica não a nomeia. |
| Grupo de Trabalho para a Reforma da Segurança Social | A lei orgânica não o nomeia; o diploma que o criou não foi lido. |
| PORDATA | É uma base de dados de uma fundação privada. |
| Marques, Cruz & Associados | É uma sociedade de revisores oficiais de contas. |
| CICF/IPCA | É um centro de investigação de um instituto politécnico. |
| O Estado do País | É este sítio a contar-se a si próprio. |

### Quatro linhas da tabela do brief que não se confirmaram

O §2 do brief dá o ponto de partida do lugar de direção «a confirmar por ti
contra as fontes de cada linha». Quatro dessas propostas não passaram, e as
razões são estas.

**«`quadro-institucional` onde a fonte é o Ministério das Finanças ou a UTAO»
tem zero linhas.** As 32 linhas do quadro institucional, que são as do painel da
primeira página, têm todas `source: "Eurostat"`. Nem o Ministério das Finanças
nem a UTAO aparecem no campo `source` de nenhuma linha deste livro-razão. Os
indicadores de dívida pública e de contas do painel são do Eurostat, e por isso
não estão na área das Finanças nem em área nenhuma.

**A ERSAR não está debaixo do Ambiente e Energia, e a lei não o diz de nenhuma
maneira.** O brief pedia para verificar; a verificação é negativa. A palavra
«ERSAR» não ocorre no Decreto-Lei n.º 87-A/2025, e o artigo 25.º, que é o do
Ambiente e Energia, lista os organismos daquela área sem a incluir: a Direção-Geral
de Energia e Geologia (n.º 2), a Agência Portuguesa do Ambiente e o LNEG (n.º 3),
a Agência para o Clima (n.º 4), o ICNF (n.º 5), a Inspeção-Geral da Agricultura,
do Mar, do Ambiente e do Ordenamento do Território (n.º 6) e a ADENE (n.º 8). Sem
um artigo que a ponha debaixo de uma área, `agua-nao-faturada` fica sem área.
**O que faltaria para a pôr numa:** ler o diploma próprio da ERSAR e ver que
relação ele estabelece com o Governo. Não foi lido, e por isso não se afirma nada
sobre ele.

**As linhas do PRR de Évora ficam de fora pela mesma razão.** A Estrutura de
Missão Recuperar Portugal não é nomeada na lei orgânica. O plano de recuperação
ESTÁ nas matérias do artigo 15.º, n.º 2, que dá ao Ministério da Economia e da
Coesão Territorial «a gestão global dos programas financiados por fundos
europeus, nomeadamente no âmbito da política de coesão da União Europeia e do
Plano de Recuperação e Resiliência (PRR)». Pôr as cinco linhas naquela área por
esse caminho seria arrumá-las pela MATÉRIA e não pelo organismo, que é a segunda
regra que este desenho não tem. Ficam de fora, e o que as poria dentro está
nomeado: a resolução do Conselho de Ministros que criou a Estrutura de Missão, se
ela disser de quem a Estrutura é.

**«As páginas das regiões e a régua de convergência» não são peças de nenhuma
área.** As 21 linhas de `avaliacao-economica-regional-de-portugal-2026` são do
Eurostat ou derivadas dele. A proposta de as pôr na Economia e Coesão Territorial
é de matéria, e não de fonte.

### E os que o brief já dizia que ficavam fora

`evolucao-de-portugal-desde-1981` (PORDATA) e as linhas do INE em geral: as
segundas estão, afinal, dentro, porque o INE tem artigo e as linhas dos concelhos
são dele. `which-door-is-yours` fica fora por outra razão que o brief não previa:
as suas duas linhas têm a fonte `[a verificar]`, que é o marcador de incerteza
deste sítio e não um organismo. O portão trata o marcador como o que ele é e não
lhe pede área nenhuma; no dia em que a fonte for confirmada, ele obriga a decidir.

### As linhas da habitação, que o brief punha nas Infraestruturas

«as linhas do painel da habitação, se existirem no livro-razão; senão, a área não
tem página ainda». Existem três (`precos-da-habitacao-2025`,
`sobrecarga-do-custo-da-habitacao-2025`, `licencas-de-construcao-2025`) e são do
Eurostat. A área das Infraestruturas e Habitação não tem página.

---

## 5 · O que se construiu

**Dez páginas novas**, nas duas edições: o índice `/areas` e `/en/areas`, e as
quatro páginas de área em cada edição. Tamanhos construídos: o índice com 7 684 B
(pt) e 7 714 B (en); a maior página de área é a de Economia e Coesão Territorial,
com 19 394 B (pt) e 19 187 B (en); a menor é a de Trabalho, com 12 727 B e
12 663 B.

**A disposição é a B · Corpo e aparelho** (`IDENTIDADE.md` §3) na página de uma
área, e a **A · Rótulo e corpo** no índice. Não é a C, que a página das regiões
usa: a C é «largura toda, o instrumento enche-a. Só para instrumentos», e uma
lista de peças não é um instrumento. Nenhuma quarta disposição.

**As três espécies de peça, e porque não são as três do brief.** O brief escreve
«trabalhos, leituras, medidas». As que ficaram construídas são **trabalhos**,
**estudos de dados** e **medidas**, e a diferença é de vocabulário e não de
conteúdo: a rota do texto de um trabalho chama-se `texto` e não `leitura` por
decisão do diretor de 24.08.2026 (`DECISIONS.md` §1.64), porque «Leitura» colide
com «Leitura breve», que é uma das duas densidades da Emenda 2. Um grupo chamado
«As leituras» repunha a colisão que aquela decisão resolveu. A leitura de um
trabalho é uma camada da página dele, e está na página da área como o que é: a
porta «O texto», ao lado do trabalho, quando o registo de conteúdo existe naquela
edição.

**O que uma medida rende, e o que não rende.** O brief pede «o valor e o selo tal
como aparece na sua página de origem», e é isso: o valor citado por `<Claim>`, o
selo que abre a linha, e o identificador dela. Os outros campos da linha-espécime
do livro-razão (unidade, fonte, lido a) NÃO entram, e a razão é uma guarda do
portão que não se contorna: `data-linha-*` é a marca de um campo do livro-razão
**na página do livro-razão**, e esta não é uma. Levantar a guarda abria uma
segunda porta para pôr texto do livro-razão em prosa corrente e, de caminho,
tirava a esta página a auditoria do selo, que o portão só faz FORA das páginas do
livro-razão. Os cinco campos estão a um clique, que é o que o selo promete.

**A contagem de cada área rende-se no índice, e a linha inteira é uma ligação.**
Duas razões, e as duas contam. A do leitor: o alvo é a linha toda, medida a 44 px
nas duas edições. A da voz: a régua do inventário deixa cair um bloco cujo texto
está todo dentro de um `<a>`, e por isso «Presidência · 10 peças» não entra no
inventário como uma frase com um número por dentro. É o defeito que a I74 nomeia
(«uma frase com um número que se move volta com outro número, e a linha nunca
voltaria a morder»), evitado na forma em vez de aceite na tabela.

**Não há contagem total no índice**, e a ausência é deliberada: «quatro áreas»
seria um número sobre a cobertura deste arquivo com a forma de um número sobre o
Governo, e um leitor lia-o como o segundo.

**A navegação.** «Áreas» entra no comando da primeira página, ao lado de «Região»
e de «Concelho», e no rodapé, que é o índice do sítio. No comando é uma PORTA e
não um estado: leva `data-porta="area"` e não `data-modo`, porque `data-modo` é a
marca do estado do endereço, que o script lê e que três células de matriz medem
como «pais, regiao, municipio». Não existe `?ambito=area:<slug>` e não vai
existir: uma área vive na sua página, como a região desde a Emenda 21b.

---

## 6 · As réguas, e os estragos plantados

**`npm run check:areas`** entra na cadeia do `build` e do `verify`, depois do
`check:regioes`. Seis regras, e o leitor é próprio: não importa
`src/lib/areas.mjs`, porque uma conferência que usasse o código das páginas
confirmava-se a si própria.

| regra | o que mede | estrago plantado | viu |
| --- | --- | --- | --- |
| A1 | cada área com peças tem página nas duas edições, e nenhuma outra tem | a página `pt:presidencia` apagada | ✓ |
| A2 | a porta de cada peça abre no `dist/`, e cada medida tem selo para a sua linha | o selo de `alentejo-central-poder-de-compra-2023` retirado | ✓ |
| A3 | nenhuma área vazia, no mapa nem na página construída | uma área «atlantida» declarada, sem peça nenhuma | ✓ |
| A4 | uma peça em duas áreas traz o organismo por que lá entrou, e os organismos diferem | a mesma medida posta em duas áreas com o mesmo organismo | ✓ |
| A5 | os nomes, os artigos, e nenhuma fonte do livro-razão sem decisão escrita | uma linha do «Instituto Hidrográfico», sem área e sem exclusão | ✓ |
| A6 | a contagem de cada área, de três pontos de observação | o mapa com uma peça a mais do que a página rende | ✓ |

**Seis de seis vistos vermelhos.** A A5 apanhou uma coisa a sério antes de ser
plantada: o marcador `[a verificar]` está no campo `source` de três linhas, e a
primeira corrida fechou a construção a pedir-lhe uma área. O marcador não é um
organismo, e a regra passou a dizê-lo, com o texto lido do módulo do marcador e
nunca escrito à mão.

**`node tests/inicio/areas.mjs`** mede o que o navegador desenha, e não é um
portão: 20 células, 20 verdes.

| célula | o que mede |
| --- | --- |
| M1 (×2) | o índice a 1280: uma linha por área, a contagem marcada, a porta a 44 px, transbordo 0 |
| M2 (×2) | 39 peças em 4 áreas, 0 sem porta, 0 medidas sem selo, 0 áreas vazias, 0 portas que não abrem |
| M3 (×2) | o nome de cada área é o mesmo no índice e na sua página, carácter a carácter |
| M4 (×2) | 48 blocos medidos, 0 por classificar, 0 de autorreferência |
| M5 (×8) | 320, 360, 390 e 430: transbordo 0 no índice e numa página de área |
| M6 (×2) | «Áreas» no comando e no rodapé, com dois cliques reais a chegar ao índice |
| M7 (×2) | sem JavaScript, o índice e a página de uma área estão completos |

**Os quatro casos plantados que o brief nomeia, todos vistos vermelhos:** uma
área sem peças (M2 conta uma área vazia), uma peça fantasma com porta para uma
página que não existe (M2 conta uma porta que não abre), um nome trocado (M3 vê
as duas pontas divergir) e uma frase de cobertura no índice (M4 vê um bloco por
classificar).

A M4 é a segunda implementação da definição da medida 8 de
`scripts/medir-defeitos.mjs`, feita no DOM que o navegador construiu em vez de no
`dist/` lido por um analisador. A primeira corrida delas divergiu, e a divergência
era da régua nova: ela declarava o texto SEM as ligações, e a régua da casa
declara o texto inteiro e usa o texto sem ligações só como crivo. Corrigido, as
duas dizem a mesma coisa.

---

## 6-A · Um defeito deste bloco, apanhado pela matriz, e o que foi recusado

Está escrito aqui porque a régua que o apanhou é a prova de que ela conta.

**A quarta posição do comando não cabia no telemóvel.** Abaixo de 640 as posições
do âmbito repartem a fila entre si, mas nenhuma pode encolher abaixo do seu
conteúdo: com três pediam 235 px e cabiam nos 284 px que os 320 dão; com
«Áreas» passaram a pedir 304, e a primeira página transbordou **66 px a 320 e
26 px a 360**. A célula «largura 320 · sem transbordo horizontal» de
`tests/inicio/matriz.mjs` ficou vermelha no primeiro build com o comando novo, e
a I20 com ela: 16 de 20 pares estado×largura a zero em vez de 20.

**A primeira correcção estava errada, e foi outra régua que o disse.** A fila
passou a partir-se em duas linhas abaixo de 480, e a junção das posições, que é
feita tirando o traço da esquerda a cada uma menos à primeira, foi devolvida com
uma margem negativa de um pixel para que a primeira posição de cada linha não
ficasse sem traço. A matriz passou a 87 de 87 e a célula **A10 de
`tests/inicio/correcoes-a.mjs` ficou vermelha**: três pares de alvos
sobrepostos, exactamente o pixel da margem negativa. A razão dela está escrita no
próprio ficheiro e é a certa: «uma área sobreposta não é um alvo maior, é uma
porta que abre a linha do vizinho».

**O que ficou.** Duas regras, cada uma a pagar o que falta onde falta: até 480 o
enchimento de cada posição encolhe de 12 para 8 px de cada lado, que são 32 px de
fila e não custam o alvo (a altura continua nos 44 px, e a mais estreita das
quatro mede 61 px de largura a 320); até 380 o rótulo do grupo passa para cima
das posições, porque os 63 px que ele ocupa são exactamente o que falta a 320 e a
360. A decisão A2 de 25.08, que pôs o rótulo em linha com as posições para
devolver 24 px de altura por fila, fica de pé em todas as larguras em que ela
cabe: a 390 e acima o rótulo continua onde estava.

Medido às sete larguras (320, 360, 390, 430, 480, 640, 768 e 1280): transbordo 0
em todas, zero pares de alvos sobrepostos, quatro posições numa linha só em
todas, cada uma com 44 px de altura.

**As outras réguas do sítio, depois disto:** `matriz` 87 de 87, `correcoes-a` 32
de 32, `mapa-navegacao` 9 de 9, `mapa-distritos` 43 verdes, `regioes` 30 de 30.

---

## 7 · A voz

**O inventário passa de 504 para 534 linhas**, todas do bloco `areas`: 30 novas,
todas `conteudo`, nenhuma `retirada`. As vivas passam de 452 a 482 e as retiradas
ficam nas 52. `npm run check:voz` diz **autorreferência 0** em todas as rotas
medidas, nada por classificar, e nomeia o bloco `areas` como `por ler`, que é o
que o registo das revisões declara.

As duas rotas novas, `areas` e `area`, entraram em `ROTAS_DO_INVENTARIO` no
commit em que as páginas são construídas, que é a regra daquela lista.

**Uma linha de `VOZ-MARCADORES.md` mudou de coluna, e nada mais.** A exceção do
marcador «complet» para «proveniência completa» valia nas rotas `livro`,
`livroConcelhos` e `livroConcelho`; passa a valer também em `area`, porque a
página de uma área rende a mesma legenda dos dois estados do selo. A razão já
estava escrita e não mudou: é o nome do estado de um CAMPO de uma linha, e não
uma afirmação sobre o que este sítio cobre.

**O que ficou dito no inventário, e é uma dívida de forma.** O nome de cada área
está declarado, uma linha por edição, e a descrição do `<head>` composta com ele
também: são dezasseis das trinta linhas. Não são `data-lugar`, porque uma área de
governo não é um lugar e a marca dos lugares tem escrito o que marca. **Com as
dezasseis áreas do Governo isto seriam 64 linhas**, que é a lista dos ministérios
escrita outra vez dentro do inventário. A saída está descrita na nota do bloco e
não foi tomada aqui, porque é uma alteração à régua da voz e não a estas páginas:
uma marca irmã de `data-lugar` para o nome declarado de uma coisa que não é um
lugar, com a mesma substituição na descrição.

---

## 8 · O que não foi feito, e diz-se

* **A leitura cruzada não foi feita.** O registo das revisões diz `por ler` para o
  bloco `areas`, e o portão imprime-o em todas as construções.
* **Nenhuma linha do livro-razão foi escrita**, e nenhuma foi tocada. As áreas só
  referenciam linhas e páginas que já existiam.
* **`DECISIONS.md` não foi editado.** A Emenda 22 é do lugar de direção.
* **Doze das dezasseis áreas do Governo não estão declaradas.** Declarar as
  dezasseis obrigava a transcrever a lei orgânica inteira para dizer, em doze
  delas, que não há nada; e uma área declarada sem peças fecha a construção pela
  A3, que é a regra do brief («nada de páginas vazias»). Uma área entra quando
  alguém escrever a sua entrada, com os organismos e o artigo.
* **A resolução que criou a Estrutura de Missão Recuperar Portugal não foi
  lida**, nem o diploma da ERSAR, nem o despacho do Grupo de Trabalho para a
  Reforma da Segurança Social. Sem eles não se afirma nada sobre a tutela dos
  três, e as três linhas de `SEM_AREA` dizem exactamente isso.

---

## 9 · O custo

Construtor (Claude Opus 5), esta sessão: **≈ 510 mil símbolos**, contando a
leitura de reconhecimento (os ficheiros das regiões, do livro-razão, dos portões e
do inventário), a verificação da lei orgânica na fonte, as quatro construções
completas com a cadeia das réguas (seis, contando as duas que fecharam a
vermelho e ensinaram alguma coisa), as corridas dos estragos plantados, as
medições do comando às sete larguras e este relatório. Nenhum submodelo foi
lançado.

---

# Segunda parte · a regra do assunto

*Escrita pelo construtor (Claude Opus 5) a 28.08.2026, à tarde, contra a decisão
do diretor do mesmo dia. Mesmo ramo, `areas-2026-08-28`, agora saído de `dbeaf7a`.
O trabalho da manhã fica de pé em tudo menos na regra: a lei orgânica é a mesma,
foi lida outra vez no mesmo ficheiro, e as páginas, o portão e a régua do
navegador são os mesmos que a manhã construiu, com as regras adaptadas.*

## 10 · O que o diretor mandou, e o que isso muda

A regra da manhã era esta: **a área de uma peça é a do organismo que publica o
seu número**. É rigorosa, confere-se contra um artigo e contra um campo, e o
diretor manteve o juízo sobre ela: rigorosa e **ilegível**. A população de um
concelho estava na Presidência, porque o INE é tutelado pelo Ministro da
Presidência; um leitor que procura a população não pensa «Presidência», e uma
arrumação que ele não consegue adivinhar não é navegação.

A regra passa a ser:

> **A área de uma peça é a do ministério cujas matérias, tal como a lei orgânica
> as lista, cobrem o assunto da peça.**

As matérias de um ministério estão no artigo dele, no número que diz «tem por
missão formular, conduzir, executar e avaliar as políticas de …». Esse número
está transcrito, inteiro, ao lado de cada matéria em `src/data/areas.mjs`, e
cada regra diz que linhas cobre e porquê.

**O que a mudança faz ao sítio, em três linhas:** a Presidência desaparece; seis
áreas novas entram (Finanças, Infraestruturas e Habitação, Justiça, Educação,
Ciência e Inovação, Saúde, Ambiente e Energia); as peças passam de 39 em quatro
áreas para **138 em nove**.

**E faz outra coisa, que é a mais importante e não estava no pedido:** três
exclusões da manhã deixaram de existir sem que nada fosse investigado. A ERSAR
não é nomeada em artigo nenhum da lei orgânica, a Estrutura de Missão Recuperar
Portugal também não, e o Grupo de Trabalho para a Reforma da Segurança Social
também não. Pela regra antiga, as suas linhas ficavam sem área e o relatório da
manhã nomeava o que faltaria ler para as pôr numa (o diploma da ERSAR, a
resolução da Estrutura de Missão, o despacho do grupo de trabalho). **Nenhum
desses três documentos foi lido, e nenhum é preciso**: pela regra do assunto, a
água não faturada é matéria de «água», o PRR de Évora é matéria do artigo 15.º,
n.º 2, que nomeia o PRR pelo nome, e as penalizações por reforma antecipada são
matéria de «segurança social». Quem publica deixou de decidir.

O mesmo vale para o marcador `[a verificar]`. A régua da manhã teve de o excluir
da conta da cobertura, porque uma linha sem fonte confirmada não podia ter área
nem exclusão escrita. As duas linhas de `which-door-is-yours` e a de
`agua-nao-faturada` que o levam entram agora na cobertura como todas as outras: o
assunto de uma linha não depende de quem a publica.

---

## 11 · A lei, lida outra vez, e os números que se citam

**O ficheiro é o mesmo da manhã**, e está em disco:
`dre-87a-2025.pdf`, 836 420 bytes, SHA-256
`1528497b468e39392b7e57d7bf83741a343e380e8a1680946a09b6763152d37a`, descarregado
de `https://files.diariodarepublica.pt/1s/2025/07/14201/0000200027.pdf`. Decreto-Lei
n.º 87-A/2025, de 25 de julho, *Diário da República*, 1.ª série, n.º 142,
Suplemento. O texto foi extraído com `pdftotext -layout` e lidos, um a um, os
números de missão de todos os dezasseis artigos de ministério, e não só os nove
que dão área a alguma coisa.

Os números citados, e as matérias que cada um lista (as reticências marcam o que
não foi preciso para nenhuma peça):

**Artigo 12.º, n.º 1 · Finanças**

> O Ministério das Finanças é o departamento governamental que tem por missão
> formular, conduzir, executar e avaliar **a política financeira do Estado**,
> promovendo a gestão racional dos recursos públicos, o aumento da eficiência e
> a equidade na sua obtenção e gestão, bem como políticas para a Administração
> Pública e o emprego público.

**Artigo 15.º, n.º 1 · Economia e Coesão Territorial**

> O Ministério da Economia e da Coesão Territorial é o departamento governamental
> que tem por missão formular, conduzir, executar e avaliar as políticas de
> desenvolvimento dirigidas ao **crescimento da economia**, da
> **competitividade**, do **investimento** e da inovação, à
> **internacionalização das empresas**, à promoção da indústria, do comércio,
> dos serviços e do turismo, à defesa dos consumidores, bem como, participar na
> coordenação interministerial das políticas de desenvolvimento económico e
> social e formular, conduzir, executar e avaliar as políticas de **coesão
> territorial**, de **administração local**, do ordenamento do território, de
> cooperação territorial europeia, de desenvolvimento regional, de cidades e de
> valorização do interior, tendo em vista a redução das desigualdades
> territoriais e o desenvolvimento equilibrado do território, atendendo às
> especificidades das áreas do País com baixa densidade populacional e aos
> territórios transfronteiriços.

**Artigo 15.º, n.º 2 · Economia e Coesão Territorial**

> O Ministério da Economia e da Coesão Territorial tem ainda por missão formular,
> conduzir e avaliar as estratégias de desenvolvimento económico e social
> relacionadas com os objetivos da convergência e da coesão, assim como definir e
> executar a estratégia, as prioridades, as orientações, a monitorização, a
> avaliação e a gestão global **dos programas financiados por fundos europeus,
> nomeadamente no âmbito da política de coesão da União Europeia e do Plano de
> Recuperação e Resiliência (PRR)**.

**Artigo 19.º, n.º 1 · Infraestruturas e Habitação**

> O Ministro das Infraestruturas e Habitação formula, conduz, executa e avalia as
> políticas de infraestruturas nas áreas da mobilidade, transportes terrestres e
> aéreos e respetivas infraestruturas, incluindo a segurança dos mesmos, e das
> comunicações, bem como as políticas dos transportes fluviais, marítimos e dos
> portos, incluindo a segurança dos mesmos, e as políticas de **habitação**, de
> reabilitação urbana, da **construção** e de imobiliário, incluindo a regulação
> dos contratos públicos.

**Artigo 20.º, n.º 1 · Justiça**

> O Ministério da Justiça é o departamento governamental que tem por missão
> formular, conduzir, executar e avaliar **a política de justiça** definida pela
> Assembleia da República e pelo Governo.

**Artigo 21.º, n.º 1 · Administração Interna**

> O Ministério da Administração Interna é o departamento governamental que tem
> por missão formular, conduzir, executar e avaliar as políticas de segurança
> interna, do controlo de fronteiras, de proteção e socorro, de planeamento civil
> de emergência, de segurança rodoviária e de **administração eleitoral**.

**Artigo 22.º, n.º 1 e n.º 2 · Educação, Ciência e Inovação**

> 1 — O Ministério da Educação, Ciência e Inovação é o departamento governamental
> que tem por missão formular, conduzir, executar e avaliar a política nacional
> relativa ao **sistema educativo**, e articular as políticas nacionais de
> qualificação e de formação profissional.
>
> 2 — O Ministério da Educação, Ciência e Inovação tem, ainda, por missão
> formular, conduzir, executar e avaliar a política nacional para **a ciência** e
> o ensino superior, compreendendo a inovação de base científica e tecnológica, o
> espaço, **as orientações em matéria de competências digitais**, a computação
> científica, a difusão da cultura científica e tecnológica e a cooperação
> científica e tecnológica internacional, nomeadamente com os países de língua
> oficial portuguesa.

**Artigo 23.º, n.º 1 · Saúde**

> O Ministério da Saúde é o departamento governamental que tem por missão
> formular, conduzir, executar e avaliar **a política nacional de saúde** e, em
> especial, do Serviço Nacional de Saúde, garantindo uma aplicação e utilização
> sustentáveis de recursos e a avaliação dos seus resultados.

**Artigo 24.º, n.º 1 · Trabalho, Solidariedade e Segurança Social**

> O Ministério do Trabalho, Solidariedade e Segurança Social é o departamento
> governamental que tem por missão formular, conduzir, executar e avaliar as
> políticas de **emprego**, de formação profissional, de relações laborais e
> condições de trabalho, solidariedade e **segurança social**, bem como a
> coordenação das políticas sociais de **apoio à família, crianças** e jovens em
> risco, idosos e natalidade, de inclusão das pessoas com deficiência, de
> **combate à pobreza e de promoção da inclusão social**, de fortalecimento do
> setor cooperativo, da economia social e do voluntariado.

**Artigo 25.º, n.º 1 · Ambiente e Energia**

> O Ministério do Ambiente e Energia é o departamento governamental que tem por
> missão formular, conduzir, executar e avaliar as políticas de ambiente,
> **água**, resíduos, clima, proteção do litoral, conservação da natureza,
> biodiversidade, energia e geologia, numa perspetiva de desenvolvimento
> sustentável e de coesão social e territorial, bem como do ordenamento em
> matérias da sua competência, incluindo da orla costeira e do espaço rústico.

**O nome português de cada área tem duas fontes que dizem o mesmo:** a lista
publicada da composição do Governo (`briefs/ministerios-xxv-2026-08-28.md`, lida
no navegador a 28.08) e o título do artigo da lei que lhe fixa as matérias. Os
títulos dos artigos 12.º, 15.º, 20.º, 21.º, 22.º, 23.º, 24.º e 25.º são,
literalmente, «Finanças», «Economia e Coesão Territorial», «Justiça»,
«Administração Interna», «Educação, Ciência e Inovação», «Saúde», «Trabalho,
Solidariedade e Segurança Social» e «Ambiente e Energia». O do artigo 19.º é
«Ministro das Infraestruturas e Habitação», e o nome da área é o que a lista do
Governo dá, sem o «Ministro das».

---

## 12 · As nove áreas, as peças e a matéria de cada uma

138 peças. A contagem de peças não é a contagem de linhas: um trabalho do
arquivo entra como UMA peça (e traz consigo as linhas por que lá entrou), um
estudo de dados também, e cada linha solta é uma medida.

| área · endereço | peças | as matérias, e o número da lei |
| --- | --- | --- |
| Finanças · `/areas/financas` | 1 | «a política financeira do Estado» (art. 12.º, n.º 1) |
| Economia e Coesão Territorial · `/areas/economia-e-coesao-territorial` | 96 | «administração local», «coesão territorial», «crescimento da economia», «competitividade», «investimento», «internacionalização das empresas» (art. 15.º, n.º 1) e «os programas financiados por fundos europeus … e do Plano de Recuperação e Resiliência (PRR)» (art. 15.º, n.º 2) |
| Infraestruturas e Habitação · `/areas/infraestruturas-e-habitacao` | 3 | «habitação» e «construção» (art. 19.º, n.º 1) |
| Justiça · `/areas/justica` | 1 | «a política de justiça» (art. 20.º, n.º 1) |
| Administração Interna · `/areas/administracao-interna` | 11 | «administração eleitoral» (art. 21.º, n.º 1) |
| Educação, Ciência e Inovação · `/areas/educacao-ciencia-e-inovacao` | 3 | «o sistema educativo» (art. 22.º, n.º 1), «a ciência» e «as orientações em matéria de competências digitais» (art. 22.º, n.º 2) |
| Saúde · `/areas/saude` | 1 | «a política nacional de saúde» (art. 23.º, n.º 1) |
| Trabalho, Solidariedade e Segurança Social · `/areas/trabalho-solidariedade-e-seguranca-social` | 19 | «emprego», «segurança social», «combate à pobreza e de promoção da inclusão social», «apoio à família, crianças» (art. 24.º, n.º 1) |
| Ambiente e Energia · `/areas/ambiente-e-energia` | 3 | «água» (art. 25.º, n.º 1) |

**E as linhas do livro-razão por matéria**, que é a conta que o portão fecha. São
2 602 linhas, 1 969 com matéria e 633 fora:

| matéria | linhas | o que são |
| --- | --- | --- |
| administração local | 1 276 | a dívida, o limite legal, o índice e o prazo de pagamento dos 308; as contas e os pelouros de Évora; as quatro contagens de municípios da Carta Administrativa |
| coesão territorial | 332 | o poder de compra dos 307 concelhos e de Évora e do Alentejo Central; o índice de PIB per capita das regiões e as distâncias à UE-27 |
| emprego | 317 | o desemprego registado dos 308 concelhos, o de Évora em 2013 e 2024, e sete indicadores do painel europeu |
| administração eleitoral | 10 | os lugares da câmara, os mandatos de 2009 a 2025 e o executivo de 2025 |
| os programas financiados por fundos europeus … (PRR) | 9 | as sete linhas do PRR de Évora e os dois avisos do PT2030 |
| crescimento da economia | 4 | o PIB real per capita, o VAB empresarial de Évora e as duas concentrações do VAB |
| segurança social | 4 | o fator de sustentabilidade e as três penalizações por reforma antecipada |
| combate à pobreza e de promoção da inclusão social | 2 | o risco de pobreza ou exclusão e o rácio S80/S20 |
| habitação | 2 | os preços da habitação e a sobrecarga do custo |
| água | 2 | a água não faturada e o ciclo de substituição das condutas |
| competitividade | 1 | o custo unitário do trabalho |
| investimento | 1 | a formação bruta de capital fixo |
| internacionalização das empresas | 1 | o desempenho das exportações |
| construção | 1 | as licenças de construção |
| o sistema educativo | 1 | o abandono escolar precoce |
| a ciência | 1 | a despesa em I&D |
| as orientações em matéria de competências digitais | 1 | as competências digitais |
| apoio à família, crianças | 1 | as crianças em creche |
| a política financeira do Estado | 1 | a dívida pública |
| a política de justiça | 1 | a independência da justiça |
| a política nacional de saúde | 1 | as necessidades médicas não satisfeitas |

---

## 13 · O que ficou de fora, e o que a lei diz sobre cada um

633 linhas. Sete assuntos, cada um com a razão em `SEM_AREA`, e a razão é sempre
a mesma espécie de razão: **a lei não lista a matéria**, e isso foi verificado
com uma busca no texto do diploma e não de memória.

| assunto | linhas | o que a busca no diploma diz |
| --- | --- | --- |
| A população residente de um concelho | 309 | «população» **não ocorre uma única vez**. «Estatístic-» ocorre duas vezes, e as duas no nome de um organismo: o Instituto Nacional de Estatística (art. 14.º, n.º 5) e a Direção-Geral de Estatísticas da Educação e Ciência (art. 22.º). Não é matéria de ministério nenhum. |
| O número de empresas de um concelho | 308 | as matérias vizinhas são «a internacionalização das empresas» e «a promoção da indústria, do comércio, dos serviços e do turismo» (art. 15.º, n.º 1); nenhuma tem por objeto quantas empresas existem num sítio. |
| As contagens deste arquivo sobre si próprio | 6 | não é matéria de governo nenhum: é este sítio a contar-se. |
| A dívida e o crédito de quem não é o Estado | 5 | «sistema financeiro», «banca» e «crédito» **não ocorrem no diploma**. O que o art. 12.º, n.º 1, dá às Finanças é a política financeira DO ESTADO. |
| As contas externas e a taxa de câmbio | 3 | «balança», «cambial» e «moeda» como matéria **não ocorrem**. |
| A perceção da corrupção | 1 | «corrup-» **não ocorre uma única vez**. |
| O saldo natural do País | 1 | a mesma espécie de número que a população. «Natalidade» é matéria do art. 24.º, n.º 1, e é o apoio a quem tem filhos, não a contagem do que a demografia fez. |

**O mais perto que a lei chega da demografia**, e fica escrito porque foi
procurado: o artigo 24.º, n.º 10, e o artigo 26.º, n.º 7, dão à Ministra do
Trabalho e à Ministra da Cultura, Juventude e Desporto, em conjunto, a
superintendência do Conselho Nacional para as Políticas de Solidariedade,
Voluntariado, Família, Reabilitação e Segurança Social «no que diz respeito às
**matérias de demografia e desigualdade**». É o alcance de um poder sobre um
conselho consultivo, e não uma matéria do ministério: não está no número da
missão, que é onde o diretor manda ler as matérias. Não foi usado, e por isso a
população fica fora.

---

## 14 · As sete decisões que a regra não decide sozinha

A regra do assunto tem uma zona onde o assunto é claro e a matéria é discutível,
e a honestidade deste bloco está em nomeá-la. Sete casos, cada um com o que foi
escolhido e o que foi recusado. Nenhum deles precisou do desempate que a decisão
prevê (a área do organismo que publica), e a razão é que o desempate não funciona
para nada disto: as linhas em causa são do Eurostat ou são derivadas, e o
Eurostat não tem ministério.

**1 · A população e as empresas ficam fora; o poder de compra e o VAB ficam
dentro.** O diretor decidiu as duas primeiras («são estatísticas, não uma matéria
de política»), e as outras três são leitura minha da mesma regra. A linha que
tracei é esta: **uma medida de como um território está em relação aos outros é o
objeto da política de coesão; uma contagem das pessoas ou das empresas que lá
estão não é.** O índice de poder de compra concelhio, com Portugal em 100, é a
medida canónica da desigualdade territorial em Portugal, e o artigo 15.º, n.º 1,
tem por objeto «a redução das desigualdades territoriais». O VAB empresarial de
um concelho é o tamanho da economia dele, e «crescimento da economia» é matéria.
**É a aresta mais macia da regra, e o diretor pode movê-la num sítio só:** as
três regras estão em `src/data/areas.mjs`, na área da Economia, e movê-las é
mudá-las de matéria ou passá-las para `SEM_AREA`.

**2 · `which-door-is-yours` foi para a Economia, e a decisão dizia Finanças.**
A decisão lista, entre os exemplos, «public debt, budget execution and public
funding → Finanças». As duas linhas daquele trabalho contam os avisos abertos do
Portugal 2030 e quantos deles aceitam pessoas singulares. **O assunto é fundos
europeus**, e o artigo 15.º, n.º 2, nomeia-os: «os programas financiados por
fundos europeus, nomeadamente no âmbito da política de coesão da União Europeia».
O artigo 12.º, n.º 1, não lista «financiamento público» como matéria. Segui o
texto da lei e não o exemplo, porque a regra 3 da decisão diz «do not invent a
matter the law does not list» e o exemplo pedia uma matéria que a lei não lista.
**Se o diretor quiser Finanças, o que falta é dizer qual das matérias do artigo
12.º cobre um aviso de um programa de fundos europeus.**

**3 · Os trinta concelhos das ilhas entraram no emprego.** Pela regra antiga
ficavam de fora, porque quem publica o desemprego dos Açores e da Madeira são
duas direções regionais dos governos regionais. Pela regra do assunto não há como
os separar: o desemprego registado de um concelho é o mesmo assunto onde quer que
ele seja medido, e o artigo 24.º, n.º 1, lista «emprego» sem recorte geográfico.
**A tensão fica escrita e é real:** o Ministério da República não conduz a
política de emprego nas regiões autónomas, e a página da área não o diz. O que a
página é, é uma porta por assunto; o que a linha diz, na sua página, continua a
ser quem a publicou.

**4 · Os jovens que não estudam nem trabalham foram para «emprego» e não para «o
sistema educativo».** O indicador conta jovens que não estão nem numa coisa nem
noutra, e as duas matérias tocam-no. Escolhi a que o número mede primeiro (a
situação perante o emprego) e não pus a linha nas duas áreas, porque uma medida
em duas áreas é uma arrumação e não uma razão.

**5 · O custo unitário do trabalho foi para «competitividade» e não para
«relações laborais e condições de trabalho».** O que ele mede é o preço a que a
economia produz, e é por isso que o painel europeu dos desequilíbrios o publica.
«Condições de trabalho» é segurança, horários e contrato.

**6 · As competências digitais foram para o artigo 22.º, n.º 2, e não para o
artigo 16.º, n.º 2.** O Ministro Adjunto e da Reforma do Estado tem «as políticas
de digitalização, inovação e transição digital da economia, sociedade e
Administração Pública»; o artigo 22.º, n.º 2, tem «as orientações em matéria de
competências digitais», que nomeia o assunto da linha por esse nome. Escolhi a
que nomeia.

**7 · O rácio S80/S20 foi para «combate à pobreza e de promoção da inclusão
social».** É desigualdade de rendimento e não pobreza, e a matéria que a lei tem
mais perto é essa. É uma leitura, e está dita como tal.

**Duas coisas que a regra decide sozinha e vale a pena ver:** a certificação
legal das contas de Évora, publicada por uma sociedade de revisores, e o limite
de 150 % do índice de dívida, publicado por um centro de investigação de um
politécnico. Pela regra antiga eram exclusões (nem uma nem outro são organismos
do Governo); pela regra do assunto são administração local, como as linhas que
elas certificam e limitam.

---

## 15 · O portão, com uma regra a mais

`npm run check:areas` continua na cadeia do `build` e do `verify`, agora com
**sete regras**. As seis da manhã ficaram, com o que mudou nelas escrito ao lado.

| regra | o que mede | o que mudou | estrago plantado | viu |
| --- | --- | --- | --- | --- |
| A1 | cada área com peças tem página nas duas edições, e nenhuma outra tem | nada | a página `pt:financas` apagada | ✓ |
| A2 | a porta de cada peça abre, e cada medida vai com selo | nada | o selo de `divida-publica-2025` retirado | ✓ |
| A3 | nenhuma área vazia, no mapa nem na página | a mensagem, que falava de organismos | uma área «atlantida» com uma matéria que não cobre linha nenhuma | ✓ |
| A4 | uma peça em duas áreas traz a razão de cada uma, e as razões diferem | a razão é a MATÉRIA e não o organismo | a mesma medida em duas áreas com a mesma matéria | ✓ |
| A5 | os nomes; e cada matéria com artigo, transcrição do número e regras com razão | reescrita; e uma regra nova por dentro | a razão da primeira regra apagada | ✓ |
| A6 | a contagem de cada área, de três pontos de observação | nada | o mapa com uma peça a mais do que a página rende | ✓ |
| A7 | **cada linha do livro-razão coberta uma vez, e só uma** | regra nova | uma linha nova sem assunto declarado | ✓ |
| A7 | (a mesma) | | uma exclusão a sobrepor-se a uma matéria | ✓ |

**Oito estragos plantados, oito vistos vermelhos.** A A7 leva dois porque falha
de duas maneiras e as duas contam, e o corredor de `--vermelhos` passou a aceitar
uma lista de estragos por regra.

**Dentro da A5 há uma regra que não estava no pedido e que vale a pena:** a
matéria tem de ocorrer, palavra por palavra, dentro da transcrição do número que
a declara. Sem ela, o nome de uma matéria podia ser uma paráfrase nossa ao lado
de uma citação que diz outra coisa, e a citação deixava de a provar. É o que
impede a regra de derivar para «a matéria é o que nós dissermos que é».

**A A7 é a regra que substitui a antiga «nenhuma fonte por decidir», e mede
mais:** não são as fontes que precisam de decisão, são as LINHAS. Uma fonte já
conhecida pode trazer uma linha de um assunto novo, e a régua antiga não a via.

**`node tests/inicio/areas.mjs`**: 20 células, **20 verdes**, e os quatro
estragos plantados do brief vistos vermelhos. A régua não precisou de mudar: ela
lê as áreas construídas do `dist/` e não de uma lista escrita, e por isso passou
de quatro para nove sem uma linha de alteração. As contagens que ela imprime
são 9 linhas no índice, 138 peças, 0 sem porta, 0 medidas sem selo, 0 áreas
vazias, 0 portas que não abrem, 82 blocos de voz medidos e 0 por classificar.

**As réguas vizinhas, depois da mudança:** `matriz`, `correcoes-a`,
`mapa-navegacao` e `regioes` correram e estão no §17.

---

## 16 · A voz, e a dívida de forma que ficou maior

**O inventário passa de 534 para 554 linhas**, e o bloco `areas` de 30 para 50.
As vivas passam de 482 a 502 e as retiradas ficam nas 52. `npm run check:voz` diz
autorreferência 0, nada por classificar, e nomeia o bloco `areas` como `por ler`.

**Duas frases saíram porque a regra mudou.** As descrições do `<head>` diziam «os
trabalhos e as medidas **publicados pelos organismos** de …», que era a regra
antiga a falar na superfície pública. Dizem agora «cujo **assunto é matéria** de
…». Saíram também as quatro linhas da Presidência (o nome nas duas edições e a
descrição nas duas), porque a área deixou de existir, e entraram doze linhas de
nome e doze de descrição das seis áreas novas.

**A dívida de forma que a manhã nomeou ficou maior, e não foi paga.** Com quatro
áreas eram dezasseis linhas de inventário que são a lista dos ministérios escrita
outra vez; com nove são trinta e seis. A saída continua a ser a mesma que a manhã
descreveu (uma marca irmã de `data-lugar` para o nome declarado de uma coisa que
não é um lugar, com a mesma substituição na descrição do `<head>`), e continua a
ser uma alteração à **régua da voz**, que é partilhada por todos os blocos do
sítio. Não a tomei aqui de propósito: a decisão desta passagem era a regra das
áreas, e mexer na régua que mede a voz de 1 378 rotas para poupar trinta e seis
linhas de tabela era arriscar o que não estava em causa.

**A razão de cada peça NÃO se rende na página, e é uma escolha da regra nova.**
Com a regra antiga uma nota de razão fazia falta, porque a arrumação não se
adivinhava. Com a regra do assunto a arrumação lê-se sozinha: quem abre
`/areas/saude` percebe porque é que as necessidades médicas não satisfeitas estão
lá. Uma linha a explicá-lo seria a página a explicar-se, que é o que a Emenda 15
tira de uma página do leitor. A razão está escrita, matéria a matéria e regra a
regra, em `src/data/areas.mjs`, e o portão confere que lá está.

---

## 17 · As medidas da construção

**As páginas:** 18 páginas de área (nove por edição) mais os dois índices. O
índice tem 9 203 B (pt) e 9 268 B (en). A maior página de área é a de Economia e
Coesão Territorial, com 75 270 B (pt) e 74 291 B (en), que são as 96 peças; a
menor é a de Finanças, com 10 711 B, que é uma medida.

**A página de 96 peças é a única coisa desta passagem que pode não estar certa**,
e fica dita: 87 medidas numa lista é uma lista comprida. Não é um transbordo (a
régua mediu 0 às quatro larguras do telemóvel) nem uma página lenta, mas é a
Economia e Coesão Territorial a acumular a administração local dos 308 concelhos,
a coesão territorial das regiões e a economia de Évora na mesma página. Se o
diretor quiser agrupar as medidas por matéria dentro da página, é uma passagem
pequena; e traz consigo uma pergunta de voz que esta não teve de responder, que é
em que língua se rende, na edição inglesa, uma matéria transcrita de uma lei
portuguesa.

**As réguas do navegador, depois da mudança:**

| régua | resultado |
| --- | --- |
| `tests/inicio/matriz.mjs` | 87 de 87 |
| `tests/inicio/correcoes-a.mjs` | 32 de 32 |
| `tests/inicio/mapa-navegacao.mjs` | 9 de 9 |
| `tests/inicio/regioes.mjs` | 30 de 30 |
| `tests/inicio/areas.mjs` | 20 de 20, e 4 estragos plantados em 4 |

---

## 18 · O que não foi feito, e diz-se

* **A leitura cruzada não foi feita.** O registo das revisões diz `por ler` para
  o bloco `areas`, com a nota de que a leitura tem de apanhar a mudança de regra.
* **Os nomes ingleses ficaram verificados, e o §20 diz como.** A minha primeira
  volta deixou seis deles como tradução da casa, porque o leitor simples de
  páginas devolveu a navegação e não a lista; o lugar de direção leu a lista no
  navegador e os seis coincidiam palavra por palavra. Nenhum nome deste bloco é
  tradução da casa.
* **Nenhuma linha do livro-razão foi escrita**, e nenhuma foi tocada.
* **`DECISIONS.md` não foi editado.**
* **Sete das dezasseis áreas do Governo não estão declaradas** (Negócios
  Estrangeiros, Presidência, Adjunto e Reforma do Estado, Assuntos Parlamentares,
  Defesa Nacional, Cultura, Juventude e Desporto, e Agricultura e Mar). Nenhuma
  linha do livro-razão tem por assunto uma matéria delas: os números de missão das
  sete foram lidos, e a busca foi feita nos dois sentidos.
* **A Presidência saiu, e é a prova de que a regra mudou mesmo.** Tinha dez peças
  de manhã e tem zero à tarde. Nenhuma das matérias do artigo 14.º (migrações,
  comunicação social, Objetivos de Desenvolvimento Sustentável, Administração
  Pública) toca uma linha deste livro-razão.

---

## 19 · O custo

Construtor (Claude Opus 5), esta segunda passagem: **≈ 300 mil símbolos**,
contando a leitura do que a manhã construiu, a extração e a leitura dos dezasseis
artigos de ministério da lei, a escrita das nove áreas com as vinte e uma
matérias e as trinta e uma regras, a reescrita do portão e a corrida dos oito estragos
plantados, as construções completas com a cadeia das réguas, as réguas do
navegador e esta parte do relatório. Nenhum submodelo foi lançado.

---

## 20 · A correção dos nomes ingleses

*Escrita depois de o lugar de direção ler, no navegador e a 28.08.2026, a página
`https://www.portugal.gov.pt/en/gc25/ministries`, que lista os dezasseis nomes
ingleses por ordem: Foreign Affairs; Finance; Presidency; Economy and of
Territorial Cohesion; State Reform; Parliamentary Affairs; National Defence;
Infrastructure and Housing; Justice; Home Affairs; Education, Science and
Innovation; Health; Labour, Solidarity and Social Security; Environment and
Energy; Culture, Youth and Sport; e Agriculture and Sea.*

**O que eu tinha escrito estava certo como precaução e errado como facto.** As
duas tentativas de ler a página com um leitor simples devolveram o cabeçalho e a
navegação, e eu concluí o que podia concluir: que os seis nomes ingleses das
áreas novas eram tradução da casa e que não se podia afirmar que fossem os
oficiais. A conclusão certa a tirar de um leitor que falha é «não consegui ler»,
e foi essa que ficou escrita; mas a forma como ficou («é tradução da casa») diz
mais do que o que eu sabia, porque uma tradução da casa é uma coisa e um nome que
não pude verificar é outra. **A precaução não custou nada e a leitura fechou-a:**
os seis coincidem palavra por palavra com os que o Governo publica.

**Um erro de contagem, que sai com o resto.** A minha prosa dizia «cinco» e
listava seis: `Finance`, `Infrastructure and Housing`, `Justice`, `Education,
Science and Innovation`, `Health` e `Environment and Energy`. São seis, e é o
número que fecha com a conta das áreas: três nomes ingleses vieram da página da
composição, na primeira volta, e seis da página das áreas de governo.

**O que mudou.** `nomeEnFonte` vale `governo` nas nove áreas e `casa` em
nenhuma; `FONTE_DOS_NOMES.en` passa a apontar para a página das áreas de governo,
que é a que lista os nomes, e guarda a da composição ao lado, porque foi de lá
que vieram três deles; a prosa do bloco `areas` do inventário e o §18 deste
relatório deixam de trazer a ressalva. **Nenhuma cadeia rendida mudou**: os
dezoito nomes das páginas construídas são os mesmos, e por isso o inventário
continua com 554 linhas e nenhuma linha mudou de estado.

**O campo `nomeEnFonte` fica, com um valor só.** Não é uma nota histórica: é a
pergunta que uma área nova tem de responder antes de entrar, e a resposta `casa`
obriga a dizê-lo na linha do inventário.

**O custo desta correção:** ≈ 20 mil símbolos, contando a leitura dos ficheiros a
corrigir, as três alterações, a cadeia inteira das réguas e esta secção.

---

# Terceira parte · a leitura cruzada, e o que ela mudou

*Escrita a 28.08.2026, depois de o Codex ler `bcd1fe5` (2 plantas em 3) e de o
lugar de direção verificar as conclusões contra o pacote. Sete pedidos, e este é
o que aconteceu a cada um.*

## 21 · Uma medida passa a ler-se como uma medida

**O achado, e tem razão.** A página de uma área rendia de cada medida o valor, o
selo e o identificador, e mais nada. «Um leitor não consegue dizer o que é
1 409.» A razão que a primeira volta escreveu era uma guarda do portão:
`data-linha-*` é a marca de um campo do livro-razão **na página do livro-razão**,
e uma página de área não é uma. A guarda era boa; a conclusão que se tirou dela
era errada, e a prova é que a decisão D6 já a tinha aberto uma vez, para o índice
dos 308, exatamente com o argumento que aqui se aplica: uma página que LISTA
linhas com a linha-espécime inteira e o selo de cada uma não está a pôr texto do
livro-razão em prosa corrente.

**O que se fez, e é reutilização e não cópia.** A linha-espécime vivia escrita
duas vezes, em `LivroConcelhosView` e em `LivroConcelhoView`, palavra por
palavra. Saiu das duas para `src/components/ItemDoLivro.astro`, e as três
páginas usam a mesma peça. **O HTML das páginas do livro-razão não mudou**: o
corpo construído de `/livro-razao/concelhos`, de `/en/ledger/municipalities` e de
`/livro-razao/concelhos/evora` é idêntico, byte a byte, antes e depois da
extração, e foi medido assim. A única diferença em qualquer ficheiro do `dist/` é
a ordem de dois `<link rel="stylesheet">` na página de Évora, que é o empacotador
a reagir a um import novo.

**O que uma medida rende agora:** o valor com o selo, o identificador, a unidade,
a data de referência, a fonte, o documento e a data de leitura. Sete campos, cada
um marcado `data-linha-*` e **conferido pelo portão, carácter a carácter, contra
o campo da linha de que ele saiu**. A página passou a ter mais conferência do que
tinha, e não menos.

**A data de referência e o documento ficam atrás de uma opção do componente**,
desligada por omissão: as duas vistas do livro-razão não os rendiam, e
acrescentá-los ali mudava páginas de outro bloco sem que ninguém o tivesse
pedido. A página de uma área liga-os, porque é ali que uma medida aparece longe
do seu contexto.

**NÃO HÁ NOME DE MEDIDA, e não é um esquecimento.** O pedido diz «o nome da
medida, o valor, a unidade e o período». O livro-razão **não tem campo de nome**:
uma linha tem valor, unidade, fonte, documento, datas e um identificador. O sítio
declara nomes para 15 das 125 medidas destas páginas (as do painel europeu, em
`src/data/figuras.mjs`) e para as sete medidas de um concelho, e para as outras
110 não há nome em lado nenhum. Escrever 110 nomes à mão era inventar conteúdo
que a fonte não publicou, e a regra da casa proíbe-o; escrever quinze e deixar
110 sem nada era uma página com duas formas. O que nomeia uma linha é o seu
identificador, que é o nome do assunto dela (`evora-pagamentos-em-atraso-2025`),
mais o documento, que para as fontes estatísticas É o nome do indicador
(«População residente (N.º) × sexo × grupo etário», «General government gross
debt (EDP concept), consolidated - annual data»). **Fica dito como o que é: um
por fazer que precisa de um campo novo no livro-razão, e não de prosa nossa.**

## 22 · As medidas agrupam-se pela matéria

Cada página agrupa as suas medidas pela matéria que as pôs ali, e o rótulo do
grupo são **as palavras da lei**, sem uma palavra à volta. São 21 grupos nas nove
páginas, sete deles na Economia e Coesão Territorial, que era onde o problema
doía.

O rótulo vai em **português nas duas edições, com `lang="pt-PT"`**, e é uma
decisão e não um esquecimento: é uma citação de uma lei portuguesa, e traduzir
uma matéria de um decreto-lei era escrever uma lei que não existe. O que a edição
inglesa traduz é o nome da área, porque esse o Governo publica nas duas línguas.
O portão confere as duas coisas: que o rótulo rendido é a matéria declarada,
palavra por palavra, e que leva a marca da língua.

## 23 · A porta legal, uma vez por página

No fim do corpo de cada página de área, na forma do `.prov` que o índice dos 308
usa para a legenda do selo: o nome da área como o Governo o publica, e a ligação
com o diploma e os números do artigo em que **aquela** página assenta
(«Decreto-Lei n.º 87-A/2025 · Artigo 15.º, n.º 1 · Artigo 15.º, n.º 2»). Nada
mais sobre a regra.

**A ligação abre o ficheiro que o Diário da República serve**, que é o que foi
verificado byte a byte e citado neste relatório, e não a página de detalhe do
portal do Diário: não sei o endereço dessa página e não o invento. Se o lugar de
direção o quiser, é uma linha em `LEI_ORGANICA`.

Os algarismos da citação legal («87-A/2025», «15.º», «1») precisaram de um motivo
novo em `ledger/allowlist.yml`, `referencia-legal`, com a razão escrita: é a
morada de um texto legal, como a página de um documento na proveniência de uma
linha, e não uma medição do País.

## 24 · As descrições saíram, e o título passou a ser um eixo

As vinte descrições do `<head>` diziam «os trabalhos e as medidas cujo assunto é
matéria de X, área de governo» e «whose subject is a matter of …»: é o sítio a
explicar o seu próprio método na superfície pública, e a Emenda 15 tira isso de
uma página do leitor. **A descrição de uma página de área passou a ser o nome da
área**, e a do índice o seu título. Não leva a contagem das peças, e a razão é a
regra da casa: um número do sítio sobre si próprio entra por `data-prova`, com
quem o reconte, e no `<head>` não há markup onde pendurar a marca.

**O título do índice passou a «Por área de governo» / «By area of government».**
Dizia «As áreas de governo» sobre uma lista de nove das dezasseis, e um título
assim promete a lista oficial inteira; a única maneira de o corrigir era uma
frase sobre a cobertura, que é precisamente o que não pode estar ali. O eixo é o
que a página é, ao lado de «por região» e «por concelho». **A lede saiu com ele**:
definia o que uma área de governo é, e uma definição do vocabulário do sítio é o
sítio a explicar-se.

## 25 · As razões dizem o que são, e um princípio decide a fronteira

**Quatro regras passaram a dizer que a matéria é a mais próxima e não a que
nomeia o assunto**, pela fórmula «A MATÉRIA MAIS PRÓXIMA; a lei não nomeia …»:

| regra | matéria | o que a lei não nomeia |
| --- | --- | --- |
| o PIB real per capita | crescimento da economia | o produto interno bruto, nem o nível da economia: nomeia as políticas dirigidas ao seu crescimento |
| o VAB empresarial de um concelho | crescimento da economia | o valor acrescentado, nem o nível da economia de um território |
| a concentração do VAB nas quatro maiores | crescimento da economia | a concentração nem a estrutura de mercado; «concorrência» não ocorre no diploma |
| o rácio S80/S20 | combate à pobreza e de promoção da inclusão social | a desigualdade de rendimento; nomeia o combate à pobreza e a promoção da inclusão social |

**E um princípio, escrito uma vez no cabeçalho de `src/data/areas.mjs`:**

> uma medida do ESTADO ou do DESEMPENHO da economia é matéria da economia; uma
> CONTAGEM de pessoas ou de empresas é uma estatística e fica de fora.

**O que ele mudou:** a taxa de câmbio efetiva real saiu da lista das que ficam
fora e entrou em «competitividade», ao lado do custo unitário do trabalho. As
duas são indicadores de competitividade e o painel europeu dos desequilíbrios
publica-as no mesmo grupo; tê-las de lados diferentes da fronteira era a
incoerência que a leitura apanhou.

**O que ele não mudou, e fica dito porque é a fronteira mais estreita deste
bloco:** o saldo da balança corrente e a posição de investimento internacional
continuam fora. Medem a posição do País perante o resto do mundo, e nenhuma
matéria do artigo 15.º, n.º 1, a nomeia: as matérias são o crescimento da
economia, a competitividade, o investimento, a inovação e a internacionalização
das empresas. O que faz a taxa de câmbio entrar é ser uma medida de
competitividade, e «competitividade» é matéria; o que deixa as outras duas fora é
não haver matéria que as nomeie nem que lhes fique perto. **Se o lugar de direção
ler o princípio mais largo do que eu o li, as duas entram em «competitividade»
com a marca da matéria mais próxima, e é uma linha em cada regra.**

## 26 · A peça inteira em várias áreas, e a razão de cada aparição

«Évora, Quinze Anos, Cinco Mandatos» está em três áreas e o conjunto dos 308 está
em duas, e é legítimo porque as linhas de cada uma são de matérias diferentes. A
A4 do portão passou a exigir que **cada aparição diga que linhas do livro-razão a
puseram ali**, e não só a matéria: uma peça inteira numa área sem as linhas que a
justificam está lá por uma razão que ninguém consegue conferir. O estrago
plantado é exatamente esse, e a régua vê-o.

## 27 · O que ficou por fazer, e diz-se

* **A marca de língua nos nomes das fontes não foi posta.** O pedido dizia que os
  títulos portugueses de estudos e de fontes levassem `lang="pt-PT"` nas páginas
  inglesas. Os títulos de estudo já levam, e sempre levaram: passam por
  `TituloDeTrabalho`, que decide a língua do título e a marca. **Os nomes de
  fonte não levam, em página nenhuma do sítio**, e verifiquei-o no `dist/`: as
  páginas inglesas do livro-razão rendem «CICF/IPCA — Anuário Financeiro dos
  Municípios Portugueses» sem marca. Pô-la só na página de uma área fazia a
  página divergir da sua origem, que é o contrário do que o pedido 1 manda; e
  pô-la em todas exige decidir, valor a valor, quais são portugueses, porque
  «Eurostat», «PORDATA» e «INE» não são. **É um bloco do livro-razão e não deste,
  e fica nomeado.**
* **O marcador de incerteza já rende na forma da edição**, e veio de graça com a
  reutilização: `CampoDaLinha` rende `[a verificar]` em português nas duas
  edições, com glosa inglesa e com a porta para a página do marcador. É a razão
  mais forte para ter reutilizado a peça em vez de copiar a forma.
* **A linha do índice não entrou no inventário**, e o bloco do inventário explica
  porquê: a régua deixa cair um bloco cujo texto está todo dentro de um `<a>`, e
  a linha inteira de cada área é uma ligação. Declará-la punha lá uma linha
  `viva` que não se rende, e a construção fecha nesse caso. Para a declarar era
  preciso partir a linha em duas, e isso traz de volta os dois defeitos que a
  forma evita: o alvo de 44 px passava a ser só o nome, e a tabela ganhava uma
  frase com um número por dentro (I74).
* **A leitura cruzada desta terceira passagem não está feita**, e o registo das
  revisões continua a dizer `por ler`.

## 28 · As contas, depois de tudo

**9 áreas, 139 peças, 125 medidas, 21 matérias, 34 regras, 7 assuntos fora.** A
Economia e Coesão Territorial passou de 96 para 97 peças (a taxa de câmbio), e as
2 602 linhas do livro-razão continuam cobertas uma vez e uma só.

**As páginas:** o índice com 9 154 B; a maior página de área é a da Economia, com
156 510 B (pt) e 155 880 B (en), que são 88 medidas com a proveniência inteira; a
menor é a das Finanças, com 12 312 B.

**O portão** tem sete regras e **onze estragos plantados, onze vistos vermelhos**
(a A2, a A4, a A5 e a A7 levam dois cada). **As réguas do navegador:** as áreas
22 de 22 e 5 plantas em 5; matriz, correções, mapa de navegação e regiões no §29.

**O inventário passa de 554 para 579 linhas**, o bloco `areas` de 50 para 75:
saíram 22 para `retirada` (as vinte descrições do `<head>`, o título antigo do
índice e a lede) e entraram 25 (o título novo nas duas edições, os 21 rótulos de
matéria e o rótulo da cabeça, que o §31 explica). As vivas passam de 502 a 503 e
as retiradas de 52 a 76.

## 29 · As réguas vizinhas

| régua | resultado |
| --- | --- |
| `tests/inicio/matriz.mjs` | 87 de 87 |
| `tests/inicio/correcoes-a.mjs` | 32 de 32 |
| `tests/inicio/mapa-navegacao.mjs` | 9 de 9 |
| `tests/inicio/regioes.mjs` | 30 de 30 |
| `tests/inicio/areas.mjs` | 22 de 22, e 5 estragos plantados em 5 |
| `scripts/check-areas.mjs --vermelhos` | 11 estragos em 11 |

## 30 · O custo desta passagem

≈ 150 mil símbolos, contando a leitura das formas de origem no `dist/` e nas
vistas, a extração do componente e a prova de que as páginas do livro-razão não
mudaram, as sete alterações, a resposta à medição cega, as seis construções
completas com a cadeia das réguas, os estragos plantados e esta parte do
relatório. É menos de metade do que a segunda passagem custou, e a razão é que a
regra já estava desenhada: esta passagem corrigiu formas.

---

## 31 · A medição cega, e as vinte e duas cadeias sem régua

*O lugar de direção correu uma medição cega (Sonnet, programa M10) sobre
`bcd1fe5` e mandou o resultado a meio desta terceira passagem. Tudo o que ela
mediu bateu certo (os nove nomes nas duas línguas, as 21 citações da lei
verbatim no artigo e número declarados, 138 peças por edição sem discrepância
entre página, recibo e YAML, as 2 602 linhas cobertas uma vez, transbordo zero,
`verify` e `typecheck` a zero) menos uma coisa: vinte e duas cadeias rendidas nas
páginas novas sem linha `viva` no inventário.*

**As vinte e duas são quatro cadeias distintas:** «Áreas de governo» no índice e
nas nove páginas de área, «Government areas» nas dez gémeas inglesas, e
«provisório» / «provisional» na página da Economia e na sua gémea. As duas
famílias escaparam por razões diferentes, e as duas foram medidas e não supostas.

### O rótulo da cabeça: a régua não vê um `<span>`

**A causa.** A régua da voz mede **elementos de bloco que não contêm outro
bloco**. O rótulo era `<span class="eyebrow">` dentro de `<div class="area-cabeca">`,
que também tem o `<h1>`: o `<div>` é saltado porque contém um bloco, e o `<span>`
não é um bloco. A cadeia passava por baixo da régua, e o `check:voz` não tinha
como parar nela.

**A prova de que é isto**, e é um positivo conhecido e não um raciocínio: o mesmo
rótulo, com a mesma classe, escrito num `<h2>` na página de um concelho
(«Relance» / «At a glance») **está declarado no inventário desde sempre**, como
`navegacao`. A única diferença entre o que a régua vê e o que ela não vê é a
etiqueta do elemento.

**A correção.** Nestas duas vistas o `<span>` passou a `<p>`. `.eyebrow` já era
`display: block` com `margin: 0`, e por isso não muda um pixel. As duas cadeias
entraram no inventário como `navegacao`, que é a classe que o lugar de direção
indicou e a mesma do positivo conhecido.

**E o tripwire vê-as nos dois sentidos**, o que também foi medido nesta passagem:
uma cadeia rendida e não declarada dá «bloco por classificar» (foi o que a
construção disse dos 21 rótulos de matéria antes de eu os declarar), e uma linha
`viva` que deixe de se render fecha a construção com «linha viva que não se rende
em rota nenhuma» (foi o que ela disse das vinte descrições quando saíram).

**DEZASSEIS OUTRAS VISTAS DO SÍTIO TÊM O MESMO DEFEITO**, e fica nomeado porque é
maior do que este bloco: o livro-razão e a sua página de linha, o índice dos
concelhos e o de um concelho, os distritos, as regiões, a agenda, as correções, o
marcador, o texto de um estudo, o estudo. Todas rendem o rótulo da cabeça em
`<span>` e nenhuma o tem declarado. **Não foram tocadas aqui**: são páginas de
outros blocos, e mexer-lhes acrescenta linhas ao inventário de blocos cuja
leitura cruzada já foi feita contra outra lista.

### «provisório»: é a palavra da fonte, e fica

**O que é.** `Claim.astro` rende-a quando a linha do livro-razão traz
`source_flag: "p"`. Nas doze linhas do índice de PIB per capita das regiões a
bandeira vem do Eurostat, e a própria linha explica-a: «O Eurostat marca este
valor como provisório. Os dados regionais de 2024 são a primeira publicação do
ano de referência…».

**Logo, fica.** Pelo critério que o lugar de direção deu: não é o sítio a falar do
estado dos seus próprios dados, que é o que a regra 15 manda sair; é a palavra da
FONTE sobre o número dela, e vive ao lado do selo, que é onde ela pertence.

**Porque é que a régua não parou nela.** O bloco que a contém contém também uma
origem declarada (`[data-claim]`), e a régua deixa cair um bloco inteiro nesse
caso. É a mesma razão por que o valor «73» também não está no inventário, e é a
razão certa: nenhum dos dois é uma frase da casa.

**Não entra no inventário**, e declará-la seria um erro de classificação: uma
linha `viva` que a régua nunca mede fecha a construção, e classificá-la como
prosa da casa dizia que a casa a escreveu, quando quem a escreveu foi o Eurostat.

**O que a guarda passou a ser uma célula, a M8 de `tests/inicio/areas.mjs`**, com
a definição da célula 2i·2 da matriz mais uma conta que aquela não faz: a palavra
segue a EDIÇÃO («provisório» em pt, «provisional» em en) e o conjunto das medidas
que a levam é **exactamente** o conjunto das linhas citadas na página cuja
bandeira é `p`. Nem uma a mais nem uma a menos. O estrago plantado apaga a
palavra de uma medida que a devia ter, e a célula vê-o.

**As réguas do navegador deste bloco passam a 22 células e 5 estragos plantados**,
todos vistos vermelhos.
