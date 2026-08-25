# A direção do diretor para a fase de UX e conteúdo (25.08.2026, de manhã)

*Escrito pelo lugar de direção (Claude Fable 5) a partir do que o diretor disse de viva voz depois de ler a página de leitura do 04 pt no ar e de percorrer o sítio no telemóvel. A primeira secção é o que ele disse, na sua ordem e sem palavras acrescentadas; a segunda é o que o lugar de direção mediu de seguida; a terceira é o método proposto, que espera a palavra dele. Sem travessões na prosa deste ficheiro.*

## 1 · O que o diretor disse

**Sobre o texto dos documentos (a par da I69).** Não é uma palavra em concreto que o incomoda, é a consciência da qualidade do texto. Um estudo diz o que é: se é sobre Évora, Viseu ou Lisboa, diz de que concelho é e de que género é (um estudo económico, cultural, «transversal» se for o caso), e não em termos genéricos («um município português»). E as frases em que o documento se explica a si próprio («este estudo é feito por isto e aquilo, e garantimos que está feito corretamente») não servem para nada. É a mesma regra da Emenda 15, aplicada agora ao texto dos documentos e não só à mobília do sítio.

**Uma auditoria de UI e de UX, como especialista.** Percorrer o sítio como um utilizador, no navegador, e ver o que funciona e o que não funciona. Ele vai mandar capturas do telemóvel.

**O que ele viu no telemóvel, e o que propõe:**

1. **O mapa de pontos é tão pequeno que não serve.** Seria bom ter o mapa, mas de uma forma utilizável no telemóvel. Duas ideias dele: (a) o mapa desenhado com as regiões em linha e, ao tocar numa região, essa região cresce (uma animação) com os pontos dos seus concelhos lá dentro; (b) tocar no mapa e ele crescer, para depois se poder andar por ele. Só no telemóvel: no desktop e nos ecrãs grandes não é preciso.
2. **Os dois botões ao lado do mapa:** um não faz nada, e o outro abre uma coisa que não é muito útil.
3. **A escala (a régua) por baixo:** foi posta lá quando se começou e ficou. É preciso avaliar se vale a pena; se vale, o que deve mostrar e porque é que está ali.
4. **Os treze indicadores, depois o painel social europeu, depois mais indicadores:** ele não percebe o que significam, porque não se percebe o contexto em que são feitos, porque estão ali, com o que se comparam. Da primeira página não se percebe.
5. **A navegação para um concelho:** ao tocar em Évora ou em Lisboa no mapa, a página devia passar ao conteúdo desse concelho (os estudos, os indicadores desse concelho) em vez de manter os nacionais. Tocar no título «O Estado do País» leva de volta à primeira página, de onde se vai a outro concelho ou a outro estudo.
6. **A estrutura que ele imagina:** a primeira página com a informação nacional; a partir dela, seguimentos por «ministérios» (áreas de governo), onde se junta conteúdo dessa área e até notícias. Hoje as coisas não estão aproveitadas para o conteúdo que já existe.

**O pedido:** agora que a canalização está feita, passar em revista o que o sítio mostra, e pôr em causa também o que já foi feito. Uma coisa só fica se for absolutamente útil e acrescentar conteúdo e espessura ao que se quer mostrar; senão não há razão para estar ali.

## 2 · O que o lugar de direção mediu a seguir (telemóvel, iPhone 13 emulado, 390 px, 25.08 de manhã)

* A primeira página tem 6 132 px de altura. O mapa rende como um selo de **84 × 111 px** com os 309 pontos dentro; ao lado, dois botões, «Abrir um concelho →» e «Ver uma região →» (são estes os dois de que o diretor fala; o que cada um faz fica para a auditoria, sem adivinhar).
* Os treze indicadores do painel europeu vêm empilhados, um cartão por indicador, cada um com o valor grande, a palavra de estado, o limiar, a descrição, o nome, um «Abrir» e um «Fonte»: é a maior parte do rolar. A régua da convergência é uma faixa de 354 × 30 px por cartão.
* A página de Évora tem 11 365 px de altura no telemóvel.

## 2b · As duas capturas do telemóvel do diretor (25.08, 10:31), e o que mostram

Guardadas em `design/especime-v3/capturas/ux-2026-08-25/` (`diretor-telemovel-inicio.jpg`, `diretor-telemovel-regua.jpg`).

* **A primeira página, no Relance:** o comando de densidade, a manchete «Portugal ultrapassa 4 limiares … e cumpre 9.», a lede, e depois o mapa como um selo minúsculo à esquerda dos dois botões «Abrir um concelho →» e «Ver uma região →», a linha «308 concelhos · CAOP 2025 ■ fonte», e a seguir **um vazio de quase um ecrã** antes do primeiro cartão do painel («89,7 · fora do limiar»). O vazio não está no desenho de nenhuma prancha; é a auditoria que diz de onde vem.
* **Depois de tocar num dos botões** (o endereço passa a `?ambito=municipio…`): o selo do mapa desaparece, ficam os dois botões, e por baixo abre «A régua da convergência · UE-27 = 100» com as seis leituras (Portugal 82, Grande Lisboa 129, Península de Setúbal 55, Algarve 89, Madeira 88, Alentejo 77, todas «provisório ■ fonte»). **Na régua, os rótulos sobrepõem-se** («Portugal 82», «Madeira 88» e «Algarve 89» uns por cima dos outros, a 390 px): a régua é ilegível exatamente onde devia ser lida.
* **O que os dois botões são, lido no código e não adivinhado** (`src/views/HomeView.astro`, `public/js/inicio.js`): os dois são ligações com `data-modo`; com script, «Abrir um concelho →» põe a primeira página no modo de escolha de concelho (a pesquisa e a lista de proximidade) e «Ver uma região →» salta para a régua (`#convergencia`); sem script, levam a `/municipios` e à régua. O diretor viu um que não faz nada e outro que abre uma coisa pouco útil; reproduzir isso num telemóvel real, e não em emulação, é o primeiro item da auditoria.

## 3 · O método proposto (à espera da palavra do diretor)

1. **A auditoria de UI e UX**, em duas leituras que não se conhecem: o lugar de direção a percorrer o sítio inteiro no telemóvel e no desktop, página a página, com capturas, e a escrever o que um utilizador encontra (o que funciona, o que não funciona, o que não se percebe), sem ler o código primeiro; e uma leitura de outra família (Codex), a partir das mesmas capturas e das páginas, com a pergunta «o que percebe um leitor que chega aqui pela primeira vez, e o que não percebe». As duas juntam-se numa lista ordenada por gravidade, com o que é bloqueante, o que é confuso e o que é apenas feio.
2. **As decisões**, com o diretor, sobre os seis pontos da §1 e o que a auditoria trouxer, com opções desenhadas e medidas (o mapa no telemóvel em duas ou três formas; a régua fica, muda ou sai; o contexto dos indicadores; a navegação para o concelho; a estrutura por áreas de governo) e o custo de cada uma. Nenhuma se constrói antes da palavra dele.
3. **A construção em blocos**, com a disciplina da casa (briefs, estragos plantados, medições cegas, leituras cruzadas, fusão só com a palavra do diretor), começando pelo que a auditoria disser que bloqueia um leitor.

**Custo estimado da auditoria (por confirmar):** entre 150k e 250k símbolos do lugar de direção e da leitura de outra família, mais o tempo de olhar. As decisões são baratas. A construção depende do que se decidir.

## 4 · O que falta para começar

* As capturas do telemóvel que o diretor vai mandar (para confirmar quais são «os dois botões» e o que ele vê na régua).
* A palavra dele sobre o método da §3.
