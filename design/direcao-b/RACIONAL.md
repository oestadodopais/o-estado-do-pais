# Direção B · Instrumento à frente

*Protótipos em `design/direcao-b/`, construídos sobre o `dist/` de `main` a `e897e06`. Todos os algarismos são cópia do que essa construção imprime; a conferência está em `CHECK.txt`.*

## A ideia

O sítio diz que é um instrumento e parece um jornal sóbrio. B pergunta o que acontece se parecer o que é.

A medição vem à frente. Em cada célula o valor é o herói e traz consigo, desenhada, a distância que o torna legível: a distância ao limiar no painel europeu, a distância entre duas leituras no município, a série contra o teto legal, o calendário das fontes num eixo do tempo. A prosa não desaparece: recua para legenda e para o Fundo, que é onde a identidade já a punha e a página ainda não cumpria. A página é feita a fio e a monoespaçada, sem uma sombra, sem um canto redondo e sem um segundo matiz.

A consequência que interessa é esta: quando a distância está desenhada, o leitor confirma com os olhos antes de confirmar com um clique, e o clique passa a ser o que o Método promete que é, a porta para a linha.

## Tipo

As três famílias e a regra que as separa ficam intactas: serifada só na marca, monoespaçada nos valores, sem serifa na prosa. O que muda é o peso relativo. A monoespaçada deixa de ser a letra dos valores e passa a ser **a letra da casa**: rótulos, eixos, chaves, cabeçalho, títulos de secção, legendas de instrumento. A sem serifa fica reservada à prosa que se lê a sério: a leitura breve, o Fundo, as dez regras.

É esta troca que faz a página parecer o que é, e é de graça: `--f-mono`, `--f-sans` e `--f-serif` continuam a ser pilhas de sistema. **B não propõe nenhuma letra da rede, e o custo em bytes de letra é zero.** Um instrumento que espera por um ficheiro para desenhar a sua escala não é um instrumento; e a primeira página promete, na sua própria prosa, que não faz pedidos de rede.

Os valores passam a ter escala declarada em vez de um `clamp` por sítio onde aparecem: `--v-xl` para a linha do livro-razão, `--v-l` para a célula do painel, `--v-m` para a célula densa, `--v-s` para o valor dentro de uma frase. A medida da prosa aperta de 66ch para 60ch, porque em B lê-se um parágrafo de cada vez.

## Paleta

O amarelo **não muda de valor**. É o único matiz do sistema e é por isso que quer dizer medição; em B aparece em quase todas as células, e mudar-lhe o tom só custaria reconhecimento. A pista da barra é `--paper-3`, e não um amarelo claro: um matiz da mesma família continuaria a ser um segundo acento. O oxblood do erro admitido também fica como está.

O que muda são os neutros. Os três papéis arrefecem e afastam-se mais uns dos outros, a tinta escurece, e os fios ganham um terceiro peso: `--grid` para a graticula, `--rule` para a separação corrente, `--rule-strong` para a moldura. `--axis` sobe para 4,51:1 sobre papel porque também desenha o quadrado a tracejado do selo incompleto, e uma distinção que o leitor tem de ver não pode ficar abaixo de 3:1. A sombra desaparece: onde havia elevação há moldura.

Contrastes conferidos, nos dois temas: tinta sobre papel 17,17:1 (claro) e 16,20:1 (escuro); o cinzento de apoio no seu pior caso, sobre `--paper-3`, 5,44:1 e 6,19:1; oxblood 9,13:1 e 7,32:1; tinta sobre amarelo 8,80:1. Todo o texto passa AA com folga.

## Como o selo se lê

O selo é a promessa mais exposta do sítio e a mais fácil de não ver. Hoje é um quadrado de 6px e um título de estudo em cinzento a 10,5px, sem a palavra que diz o que ele é. B faz três coisas e não lhe muda a natureza:

1. **A palavra «fonte» fica à vista.** Era texto para leitores de ecrã; passa a ser a primeira coisa que se lê no selo. É o que o BRIEF §6.1 pede, e custa uma palavra.
2. **Dois pesos, o mesmo glifo.** Debaixo de um valor, o selo é uma caixa com moldura de fio: quadrado, «fonte», o estudo. Dentro de um parágrafo, perde a caixa e mantém o quadrado, porque sessenta molduras numa página do município seriam ruído e sessenta quadrados são uma língua. Os dois estados, cheio e a tracejado, existem nos dois pesos.
3. **Um mini-recibo antes do clique.** Ao passar o cursor ou ao receber o foco, o selo abre uma caixa com o valor, o estudo e a data que a página já publica, e a frase «ver a prova». É só CSS. Não substitui a porta: diz ao leitor o que vai encontrar do outro lado, que é a diferença entre um selo e um enfeite.

O marcador `[a verificar]` fica com o mesmo tracejado do selo incompleto, de propósito: são a mesma língua. Quando aparece sozinho, é porta para a página que o explica; quando aparece dentro de um selo, a porta já é a do selo.

**O que fica em dívida:** o mini-recibo aparece ao passar e ao focar, e sem JavaScript não se fecha com a tecla de escape, o que a norma pede (WCAG 1.4.13). Na construção a sério isso é um melhoramento progressivo de dez linhas; no protótipo fica dito em vez de escondido.

## A página da linha como recibo

A ordem é a do BRIEF §6.1 e não muda com a classe da fonte:

1. **O valor**, à escala `--v-xl`, com a unidade ao lado, e por baixo uma frase em palavras: publicado por quem, em que documento ou série, em que página, lido a que data. Não é uma lista de rótulos; é uma frase.
2. **A prova.** É aqui que as duas classes se distinguem, e o protótipo mostra as duas na mesma folha. Numa leitura de interface de dados: o lugar da página humana da série (caixa marcada «exemplo», porque a linha ainda não guarda esse endereço), o campo devolvido como excerto, e o pedido exato que o devolve. Num documento impresso: **o recorte da linha impressa**, desenhado como caixa marcada e sem um algarismo lá dentro porque o campo ainda não existe; o botão que abre o documento na página certa, com a âncora que a linha já tem; e a linha transcrita por baixo, pequena.
3. **Verificações.** Uma tabela com «Lido a», que é real, e o lugar da releitura independente, que é caixa marcada. O sítio diz no Método que essa conta é zero e porquê; a página da linha passa a mostrar o mesmo buraco no sítio onde ele importa.
4. **Correções e atualizações**, com o seu estado vazio dito.
5. **O aparelho**, numa coluna à direita: a ficha da proveniência campo a campo, o estado da proveniência com o mesmo quadrado do selo, **a porta das correções** e o lugar dos dados desta linha.

O aparelho fica ao lado e não por baixo porque a leitura de cima para baixo é a da prova; o que o leitor procura primeiro nunca é a ficha.

## Os quatro leitores do BRIEF, parte 4

- **Cidadão de um concelho.** As oito células de Évora deixam de ser números soltos: cada uma desenha a segunda leitura que a página já publicava em prosa (2021 contra 2025, 2013 contra 2024, o concelho contra a sua região, a dívida contra o limite legal). Quem não lê tabelas vê a direção do movimento antes de ler um algarismo. O que B não resolve: a página continua a existir para um concelho em trezentos e oito.
- **Jornalista.** O selo a tracejado passa a ser impossível de não ver, porque tem caixa, palavra e marcador; o mini-recibo diz a fonte sem sair da página; e a página da linha põe o botão da página exata do documento acima da transcrição. O que falta para a citação de fecho continua a ser o recorte, que é dado e não desenho.
- **Investigador.** A ficha da proveniência é uma tabela de campos, não prosa; o pedido exato está impresso e copiável; o bloco «Os dados» tem o lugar do JSON da linha e do conjunto de dados com licença. Todos os desenhos declaram, numa legenda de portas, que valores desenham e onde vive cada um.
- **Técnico municipal.** A porta das correções está em todas as páginas do protótipo, incluindo as duas linhas do livro-razão, que é a aterragem mais provável de uma pesquisa. Está na coluna do aparelho, sempre no mesmo sítio.

## As nove provas de aceitação (§6.8)

| | Prova | Resultado | Onde se vê |
|---|---|---|---|
| 1 | Qualquer número à linha impressa em 1 clique, sem descarga acima de 1 MB | **parcial** | O selo é um clique e o mini-recibo antecipa o que ele abre; o recibo tem o lugar do recorte desenhado. Mas o recorte é dado que não existe, e o botão da linha do documento de Évora abre um ficheiro muito acima de 1 MB. O desenho está pronto; o bloco T é que fecha a prova. `02-linha.html` |
| 2 | Porta das correções em 0 cliques | **passa** | Está nas cinco páginas, sem clique. Ressalva honesta: em páginas longas fica abaixo da dobra. `01` a `05` |
| 3 | Data da última leitura e da última releitura independente, visíveis | **parcial** | «Lido a» é real e está em duas casas (a frase do topo e a ficha). A releitura é caixa marcada «exemplo»: o campo não existe no formato. `02-linha.html` |
| 4 | Frases de moldura ≤ 12 distintas, meta-comentário 0 | **parcial** | Não é uma prova que um protótipo possa decidir, e B não pode reclamá-la. O que B faz: move quatro das seis frases da leitura breve de Évora para o Fundo, corta a frase do «não sabe» que repetia o método, e substitui prosa por desenho em oito células. O que B acrescenta é declarado no fim desta página, item a item. |
| 5 | `/municipios` com os 308 concelhos em estado honesto | **falha** | Não está entre as cinco páginas do encargo. O que B entrega para lá é a peça: a célula com estado vazio desenhado, que na primeira página já aparece quatro vezes com a frase «sem limiar publicado». |
| 6 | `/agenda` viva com pelo menos três itens, cada um com o seu critério | **passa** | Cinco itens em quatro estados, cada um com o critério, as datas e o registo do que mudou; o estado vazio do «Retirado» desenhado; o calendário das fontes num eixo do tempo, com as duas razões distintas para não haver data. `05-agenda.html` |
| 7 | Teste dos dois minutos 4/4 | **parcial** | (a) o que o sítio é fica na marca, na linha de método e no painel, mas as duas frases do Sobre continuam a um clique: **parcial**, e é o ponto em que B pede decisão. (b) continua a falhar para 307 em 308. (c) inalterado. (d) melhora e não fecha, pela mesma razão da prova 3. |
| 8 | `[descrição em preparação]` = 0 e a primeira página com todos os valores selados na sua própria linha | **passa** | O marcador retirado não aparece. Na primeira página todo o valor impresso tem selo próprio, e todo o valor desenhado dentro de um SVG tem a sua porta na legenda: a régua leva sete portas, o mapa leva as suas. A contagem exata de 32 não é coisa que um protótipo possa afirmar. `01-primeira.html` |
| 9 | Nenhum endereço de fonte a falhar, ou cada falha com a sua atualização e cópia fixada | **falha** | Fora do alcance do desenho. B entrega o lugar: o endereço impresso por inteiro na ficha, e a caixa dos dados onde a cópia fixada entraria. |

## O que custa

- **Letra:** zero bytes. Nenhuma letra da rede, nenhum pedido para fora.
- **Folha de estilo:** o sistema de B, comprimido, são 18 759 bytes mais 1 395 de tokens, e cobre os cinco tipos de página aqui prototipados. A folha construída hoje são 41 316 bytes e cobre o sítio inteiro, que tem mais tipos de página do que estes cinco: os dois números não são comparáveis, e quem os comparar engana-se. O que se pode dizer é que B não é uma folha maior: é a mesma gramática com componentes mais pequenos.
- **Componentes novos, e são seis:** a escala (medida contra limiar), o par (duas leituras na mesma linha), a célula do painel, o recibo (a página da linha), o quadro de estados (a agenda) e a faixa dos mandatos. Cada um é um punhado de regras.
- **Componentes alterados:** o selo (`Provenance.astro`) ganha a palavra visível, a caixa, os dois pesos e o mini-recibo; o cabeçalho passa a tira de células; o rodapé fica igual.
- **O que o portão tem de aprender:**
  1. **um desenho de distância declara os valores que desenha.** A regra do §10 da identidade já existe para números dentro de SVG (legenda de portas); B estende-a às barras e aos pares feitos em CSS, que não são SVG e mesmo assim desenham medição. Sem isto, uma barra pode mentir sobre um valor que tem linha.
  2. **os algarismos do desenho declaram-se.** A largura de um ecrã ou o número de um protótipo não são medições de Portugal nem contagens do sítio; ficam marcados `data-desenho` e o portão lista-os um a um, como o `check.mjs` desta pasta já faz.
  3. **o lugar de um dado que não existe não pode ter algarismos.** As caixas `data-exemplo` são conferidas a zero algarismos, e a construção deve falhar no dia em que uma delas ganhar um número em vez de ganhar o campo.
  4. **o selo tem de trazer a palavra à vista.** É uma conferência de cadeia sobre o `.src-chip`, e cabe no varrimento que já existe.
- **Custo de leitura para a direção:** as células desenhadas obrigam a decidir, uma vez, que a normalização de cada escala é ao seu próprio limiar. É uma decisão de significado, não de estilo, e é a única que B não pode tomar sozinha.

## O que se corta se só metade puder ser construída

Fica o caminho da confiança:

1. **o selo** (caixa, palavra «fonte», dois pesos, dois estados, mini-recibo);
2. **a página da linha como recibo**, com o lugar do recorte e o lugar da releitura desenhados mesmo antes de existirem;
3. **a porta das correções** em todas as páginas, no mesmo sítio da coluna.

Corta-se o carácter: as escalas por célula, o par de leituras, a faixa dos mandatos, o eixo do tempo do calendário e o mecanismo redesenhado. São eles que fazem B parecer B, e nenhum deles é o que faz um leitor confirmar um número. Se se cortar pelo lado contrário, sobra um sítio bonito com a mesma promessa por cumprir.

## O que B escreve de novo, palavra a palavra

Toda a prosa dos protótipos é cópia da construção de hoje, com cortes e nunca com acrescentos. As exceções são estas, e são rótulos ou legendas que o desenho precisou:

- **«fonte»**, no selo, pedida pelo BRIEF §6.1.
- **«sem limiar publicado»** e **«sem segunda leitura nesta página»**, os dois estados vazios das células.
- **«medida», «limiar», «dívida», «limite legal», «índice», «teto legal»**, as pontas das escalas.
- **«exemplo»** e **«recorte da linha impressa»**, as caixas do que ainda não existe, prescritas pelo encargo.
- **«A prova», «Verificações», «Os dados», «O pedido exato», «A linha transcrita», «Portas dos valores desenhados», «Portas dos acontecimentos desenhados», «Reconferência», «Com data de publicação», «Dez regras», «Arquivo»**, títulos de bloco.
- Seis títulos de secção que não existem hoje: **«Oito medidas»**, **«O que as células não desenham»**, **«O índice de dívida contra o teto legal»**, **«O que esta página pode e não pode dizer»**, **«Os trabalhos publicados»**, **«Cada uma com o seu mecanismo e a sua prova»**.
- Uma legenda que explica o instrumento novo, na primeira página: **«A barra de cada célula é a medida contra o limiar da sua própria linha: o traço marca o limiar, e a barra mede-se nele. Quatro destas medidas não têm limiar publicado, e a célula di-lo em vez de desenhar uma barra sem escala.»** e, na página do município, a frase que diz que a célula desenha a distância entre as duas leituras que a página publica.
- **«Nota de protótipo»**, que é mobília desta exploração e não iria para o sítio.

Nenhuma destas frases é uma medição, e nenhuma descreve a máquina do sítio a si própria. Se alguma delas não sobreviver à revisão, o desenho sobrevive sem ela.

## O que ficou por fazer

- A distância entre os selos completos e o selo a tracejado só aparece lado a lado na primeira página, no Método e no quadro da direção. Nas páginas onde todas as linhas estão completas, o estado a tracejado não tem onde aparecer sem ser fabricado, e não foi fabricado.
- Os 308 pontos do mapa perderam, no protótipo, o nome do município que cada um carrega, porque esse nome só se lê pelo mostrador que precisa de JavaScript e o protótipo não tem nenhum. Numa construção a sério o nome volta.
- As células de uma linha do painel alinham entre si, mas as partes de duas linhas diferentes não alinham umas com as outras. Resolve-se com subgrelha e não foi feito.
- Na régua da convergência, o Algarve e a Madeira ficam a um ponto um do outro e partilham um rótulo. É uma escolha de legibilidade, e as duas portas continuam separadas na legenda.
- A edição inglesa não foi prototipada. Nada no desenho depende do comprimento das palavras portuguesas: os rótulos são curtos, as caixas quebram e as escalas não levam texto dentro.
