# Relatório · as áreas de governo

*Escrito pelo construtor (Claude Opus 5) a 28.08.2026, contra
`briefs/BRIEF-areas-de-governo.md` e a lista de
`briefs/ministerios-xxv-2026-08-28.md`. Ramo `areas-2026-08-28`, saído de `main`
em `45a9708`. Cada commit com `npm run build` (a cadeia inteira das réguas),
`npm run verify` e `npm run typecheck` verdes antes de ser escrito. Sem fusão e
sem envio: o ramo fica para o lugar de direção. Sem travessões na prosa.*

| commit | o quê |
| --- | --- |
| `7202c48` | as áreas de governo: o mapa, as dez páginas, a navegação, o portão, a régua e o inventário |
| `1a0267a` | o comando da primeira página com quatro posições cabe no telemóvel |
| (este) | o relatório |

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
