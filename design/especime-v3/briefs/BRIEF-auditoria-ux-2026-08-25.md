# BRIEF · A auditoria de UI e UX, primeira leitura (o utilizador que chega pela primeira vez)

*Escrito a 25.08.2026 pelo lugar de direção (Claude Fable 5) para o leitor-utilizador (Claude Opus 5), na sequência de `PEDIDOS-DO-DIRETOR-UX-2026-08-25.md` (ler a §1 e a §2b antes de começar, e mais nada desse ficheiro). Sem travessões na prosa deste ficheiro.*

## 0 · O que é, e o que não é

És um leitor português que chega ao sítio pela primeira vez, no telemóvel e depois no computador, sem saber o que ele é. Percorres tudo, tocas em tudo, e escreves o que encontras: o que funciona, o que não funciona, o que não se percebe, o que está a mais. **Não lês o código antes de ver a página.** Podes ler o HTML construído ou o código depois, só para explicar uma coisa que já viste (para dizer «o vazio vem de X» em vez de «há um vazio»), e dizes quando o fizeste. Não corriges nada, não commitas nada, não tocas em nenhum ficheiro do repositório fora do que a §5 nomeia.

O que se procura não é o gosto: é o que impede, confunde ou cansa um leitor, e o que está ali sem acrescentar nada. A régua do diretor: uma coisa só fica se for absolutamente útil e acrescentar conteúdo e espessura; senão não há razão para estar ali.

## 1 · O sítio, e como o percorrer

O sítio é `https://xn--oestadodopas-2fb.pt` (o domínio acentuado `oestadodopaís.pt`). Percorre-o **no ar**, como um utilizador, com o Playwright que está em `node_modules` do repositório (`/Users/nunosantos/Instruments/OEstadoDoPais`; corre o Node a partir daí para o encontrar). Dois aparelhos:

* **telemóvel:** `devices["iPhone 13"]` (390 × 664, toque, `deviceScaleFactor` 3; guarda as capturas a escala 2 e em JPEG de qualidade 70, para não pesarem);
* **computador:** 1280 × 800, rato e teclado.

E, no fim, uma passagem rápida a **1024 × 768** (o portátil pequeno) só na primeira página e na de um concelho, para ver se alguma coisa parte entre os dois.

As páginas, por esta ordem, nas duas larguras (em português; no fim, a primeira página e uma página de linha em inglês):

1. `/` a primeira página, nos seus estados: o Relance e a Leitura breve (o comando de densidade), e os três âmbitos que os comandos abrem (país, região, concelho): toca em «Abrir um concelho →» e em «Ver uma região →» e diz o que acontece, o que aparece, o que desaparece, e se alguma coisa não faz nada; no computador, o mapa dos 308 pontos: o que se pode fazer com ele, o que acontece ao passar o rato e ao clicar num ponto, numa região, em Évora;
2. `/municipios` e `/municipios/evora`;
3. `/estudos`, `/estudos/evora-prometido-pago-auditado-2026`, a sua página de leitura `/estudos/evora-prometido-pago-auditado-2026/texto`, a sua edição arquivada `/estudos/evora-prometido-pago-auditado-2026/documento`, e uma segunda página de leitura maior, `/estudos/evora-quinze-anos-cinco-mandatos/texto`;
4. `/livro-razao`, e duas páginas de linha: `/livro-razao/divida-publica-2025` e `/livro-razao/evora-prr-aprovado-2026`;
5. `/agenda`, `/metodo`, `/sobre`, `/correcoes`, `/a-verificar`;
6. um endereço que não existe (a página de erro), e o comando de língua numa página qualquer (para onde leva, e se volta).

Em cada página, nas duas larguras: uma captura da parte de cima (o que se vê sem rolar) e uma captura de página inteira; e a resposta a estas perguntas, escritas como as escreverias a um amigo que fez o sítio: **o que é esta página?** (percebe-se em cinco segundos?) · **o que posso fazer aqui?** · **o que não percebi?** (uma palavra, um número, um rótulo, um glifo) · **o que não funcionou?** · **o que está a mais?** · **quanto tive de rolar até à primeira coisa que interessa?**

## 2 · O que se mede, além de se ver

Em cada página e largura, com o teu próprio código (é a única parte em que lês o DOM):

* **alvos de toque com menos de 44 × 44 px** no telemóvel, listados (texto, tamanho, onde);
* **texto com menos de 12 px** no telemóvel, listado;
* **sobreposição de rótulos e de textos** (elementos de texto cujas caixas se cruzam), listada com o texto dos dois; a régua da convergência é o caso conhecido, e há que confirmar e medir;
* **vazios verticais com mais de 200 px** entre dois blocos de conteúdo visíveis, listados com o que está acima e abaixo; o diretor viu um entre a linha «308 concelhos» e o primeiro cartão do painel, no telemóvel;
* **transbordo horizontal** (`scrollWidth > innerWidth`) e o elemento que o causa;
* **altura da página** e **a distância de rolar até ao primeiro valor** (o primeiro número com selo), em px e em ecrãs;
* **os comandos:** para cada botão e ligação de comando da primeira página e da página do concelho, o que acontece ao tocar (o endereço muda? o que muda no DOM? nada?); confirma ou desmente «um dos dois botões não faz nada» com um toque real (`page.tap`) e não com um clique de rato;
* **o mapa no telemóvel:** o tamanho rendido, se os pontos reagem ao toque, se se pode ampliar;
* **contraste** só onde te parecer fraco a olho (a casa mede os pares da folha por script; não repitas isso).

## 3 · O que não é para julgar aqui

* A escolha das letras, as cores e a paleta escura: são a constituição da casa, e a auditoria não é sobre gosto. Se uma cor ou uma letra **impede** ler, entra como impedimento, não como opinião.
* O texto dos documentos de estudo (a I69 trata disso).
* A ortografia.

## 4 · O relatório

`design/especime-v3/medicoes/auditoria-ux-2026-08-25-opus.md`, em português, sem travessões, com esta forma:

1. **A lista ordenada por gravidade**, uma linha por achado, com três classes: **bloqueia** (um leitor não consegue fazer ou perceber uma coisa essencial), **confunde** (percebe-se mal, ou só à segunda), **cansa ou está a mais** (rolar, repetição, mobília sem função). Cada achado com: onde (página e largura), o que viste, a prova (a captura, a medida, ou o toque que deu em nada), e, se leste o código depois, a causa.
2. **Página a página**, as respostas às seis perguntas da §1 e as medidas da §2, nas duas larguras.
3. **Os seis pontos do diretor** (§1 de `PEDIDOS-DO-DIRETOR-UX-2026-08-25.md`), cada um com o que confirmaste, o que mediste, e o que não confirmaste, sem propor ainda a solução (isso é a etapa seguinte, com ele).
4. **O que funciona bem**, em poucas linhas, porque uma auditoria só de defeitos deixa apagar o que não devia.
5. O custo em símbolos como o vires.

As capturas ficam em `/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/ux-auditoria/` (cria a pasta), com nomes que digam a página, a largura e o estado (`inicio-390-relance.jpg`, `inicio-390-cima.jpg`, `evora-1280-inteira.jpg`), e o relatório cita cada uma pelo nome. O lugar de direção escolhe depois as que entram no repositório. **Não escrevas capturas dentro do repositório.**

## 5 · Regras

* Só escreves em dois sítios: o relatório em `design/especime-v3/medicoes/` e as capturas na pasta do scratchpad. Nada mais muda; não commitas.
* Rotula cada afirmação: **vi** (na captura ou no toque), **medi** (com o número), **li no código** (depois de ver).
* Uma medição que dá vazio não é um achado: confirma que o teu código apanha um caso conhecido antes de dizer «zero» (por exemplo, a sobreposição de rótulos da régua no telemóvel, que o diretor fotografou).
* Não pares para perguntar; onde uma coisa for ambígua, diz as duas leituras.
