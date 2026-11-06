# Mandato MET1: o Método como página de usar (escrito a 03.11.2026; o §0 medido de novo e lançado a 05.11.2026)

Acrescenta: frases

Página: metodo

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, numa worktree própria (`lote5b-2026-11-05`) que parte da cabeça do lote 4 (PAI2 e VOZ-1, 25821b087) com a AT1 por cima. Só o sítio. O financiador, como leitor, a 03.11.2026: o Método deve ser "more appropriate, and actually usable without all that kind of self explanation type of text", e mostrar ao leitor "what goes to make sure we are as reliable as possible", "by seeing how is done the checking and nothing goes into the webpage if is not to that standard". A referência visual é a apresentação "How It Works" (versão 2, nomes genéricos), em `design/observatorio/referencias/MET1-percurso-v2.html`.*

## §0 Medido (05.11.2026, por este lugar, no `dist/` da cabeça do lote 4, 25821b087, por guião: as palavras do `<main>` sem `script` nem `style`)

- O Método tem 1 754 palavras (o inglês 1 764) em nove secções e o índice «Nesta página»: "Quem escreve estas páginas", "De onde vêm os números", "O recibo de cada número", "Como se confere", "O que está por confirmar", "As correções", "O que se mede, e quem decide", "O que este projeto não faz", "A forma". Abre com uma frase sobre a própria página ("Como estas páginas são feitas, conferidas e corrigidas, para quem quer saber…"). Os números da prosa são tokens de `src/lib/prova.mjs` (`{ prova: '<chave>' }` em `src/data/metodo.mjs`), recontados pelo portão.
- O marcador "[a verificar]" já não se imprime em página nenhuma (0 em português e 0 em inglês; a mesma procura encontra «a verificar» em prosa de 10 páginas, que não é o marcador). A VOZ-1 tirou-o; `/a-verificar/` redirige no `vercel.json`.
- A régua da voz, depois da VOZ-1 (`scripts/voz-autorreferencia.mjs`), é uma expressão larga (a negação e uma marca do próprio sítio na mesma frase) com a lista fechada `scripts/voz-excecoes.json`; o Método, o Sobre e a Privacidade estão isentos dela por inteiro. A tua régua do Método (§4) é uma régua nova, só para esta página.
- A referência visual está no ramo, em `design/observatorio/referencias/MET1-percurso-v2.html`: só leitura, para o desenho e o movimento do percurso; as frases são as do §2, não as da referência.

## §1 A forma da página

Quatro secções, por esta ordem, cada uma com o que o leitor faz com ela; sem lede; sem frases sobre as intenções ou as virtudes do projeto; os papéis pelo nome genérico (um modelo de inteligência artificial, um programa, um modelo de outra família), nunca pelo nome do produto; as contagens por tokens de prova. O percurso da secção 2 desenha-se como na referência, em SVG e CSS, legível sem JavaScript, com o movimento desligado quando o leitor pede menos movimento; cada passo com a sua conferência. As cinco larguras e as duas edições.

## §2 As frases (pt e en; os tokens `{prova}` são chaves de `src/lib/prova.mjs`; uma chave nova soma-se lá com a sua reconta no portão e a sua planta)

**Sem lede.** Os títulos das quatro secções dizem o que a página tem; uma lede que os repita é um subtítulo de subtítulos (o financiador, 03.11.2026).

**1. Conferir um número**
- pt «Toque em «fonte», ao lado de um número, para abrir o seu recibo.»
- en «Tap «source», next to a number, to open its receipt.»
- Por baixo, um recibo verdadeiro de uma linha com o recibo completo (escolhes uma linha do painel do país, e dizes qual), com cada campo legendado em poucas palavras: pt "quem o publicou", "o documento", "onde está no documento", "o excerto, como a fonte o escreveu", "a data em que foi lido", e, num número calculado, "a conta"; en "who published it", "the document", "where it is in the document", "the excerpt, as the source wrote it", "the date it was read", "the arithmetic".
- pt «Um selo a tracejado quer dizer que falta confirmar um campo do recibo na fonte; hoje são {prova: divida}.»
- en «A dashed seal means a field of the receipt is still to be confirmed at the source; today there are {prova: divida}.»

**2. Do documento à página** (o percurso desenhado, um passo por linha curta, como as legendas de um esquema e não como parágrafos; cada passo com a sua conferência)
1. pt «Um modelo de inteligência artificial lê as notícias, os calendários das fontes e o que os partidos publicam, e aponta o que mudou.» (Sem «todos os dias»: a vigilância corre em cada sessão e ainda não tem agendamento diário, que está na higiene da HIG-5; quando tiver, a frase pode dizê-lo.)
2. pt «Um programa descarrega o documento da fonte, guarda uma cópia com o recibo do pedido e mede o número no próprio documento.»
3. pt «O número entra no livro-razão com a fonte, o documento, o excerto e a data.»
4. pt «A direção escreve o que muda e as frases que o leitor vai ler, conferidas na fonte.»
5. pt «Um modelo constrói a mudança.»
6. pt «A cada construção correm {prova: conferencias_da_corrida} conferências automáticas sobre todas as páginas: um algarismo sem linha no livro-razão, ou com outro valor, trava a publicação.»
7. pt «Um modelo de outra família, que não construiu a mudança, lê-a contra os documentos, com cinco erros plantados nas suas cópias para medir se os apanha.»
8. pt «O que a leitura encontra corrige-se, e a correção volta a ser lida.»
9. pt «Só se publica o que passou em todas as conferências, e a cópia publicada volta a ser conferida depois de estar no ar.»
10. pt «Os números do painel são relidos na fonte, a última vez a {prova: painel_reconferido_em}; quando a fonte muda um valor, o número muda e o registo diz o que estava antes.» (Sem «todas as semanas»: a frase diz a última releitura pelo token que já existe, e não promete o calendário.)
- en de cada passo, com o mesmo sentido e os mesmos tokens (escreves-las tu a partir destas; o lugar de direção lê-as no `dist/` antes da leitura a frio).
- `conferencias_da_corrida` é chave nova: o número de passos da lista inteira que o `scripts/leituras/conferir-tudo.sh` corre, contado por guião a partir da lista, nunca escrito à mão.

**3. As marcas**
- pt «fonte: abre o recibo do número.»
- pt «dado provisório: a fonte diz que o valor ainda pode mudar.»
- pt «calculado: o número foi calculado a partir de outros, e o recibo mostra a conta.»
- pt «por confirmar na fonte: um campo do recibo ainda não foi confirmado no documento.»
- pt «Âmbar: o valor está fora do valor de referência que a fonte publica. Cobalto: está dentro. Uma medida sem valor de referência não leva cor.»
- pt «Estudo atualizado: o estudo ganhou documentos novos. Estudo corrigido: o texto dizia uma coisa que não devia. A edição anterior fica sempre a um toque.»
- en de cada marca, com o mesmo sentido.
- O marcador "[a verificar]" já sai do sítio inteiro na VOZ-1 (a ausência exata "por confirmar na fonte", e `/a-verificar/` redirigida para o Método); a MET1 só descreve a marca, e a redireção passa a apontar para esta secção.

**4. Quando um número muda**
- pt «Cada mudança fica no registo das correções, com a data, o que estava e o que ficou.» (com a ligação ao registo; as contagens, o endereço, o crédito e o direito de resposta ficam só na página das correções, sem se repetirem aqui)
- pt «Estas páginas são escritas, conferidas e atualizadas por modelos de inteligência artificial; nenhuma pessoa revê cada mudança antes de se publicar.»
- en das duas, com o mesmo sentido.
- A ligação à agenda (o que se estuda a seguir) e à política de inteligência artificial, como ligações, sem prosa à volta.

## §3 O que sai, e o que muda de sítio

- Saem: a lede de hoje; a contagem das entradas do livro-razão (o projeto a contar-se a si próprio); a descrição dos papéis por dentro da direção (o que fica é o percurso da secção 2); "A forma" (a letra; a cor passa às marcas, acima); as frases sobre o que o programa não vê, reescritas numa só linha factual dentro do passo 6 se o portão o pedir (diz como ficou).
- **Mudam de sítio, palavra por palavra, para o Sobre**: as frases de "O que este projeto não faz" sobre o financiamento, a publicidade, o dinheiro de entidades que se medem, a classificação de partidos, o jornalismo e os dados pessoais. São do financiador (o dinheiro, a exposição legal) e não se reescrevem nem se cortam neste bloco; se o Sobre já disser alguma, não se repete.
- Mantém-se: o rótulo de inteligência artificial em todas as páginas.

## §4 As réguas

A régua da voz conta a autorreferência fora do Método e do Sobre como hoje; no Método, a lista fechada das frases desta página (as do §2) é a única prosa permitida, e uma frase a mais faz o `build` falhar, com planta. As réguas das contagens (`prova.mjs`) recontam cada token, com a planta da chave nova. Nenhuma régua que protege um número, uma fonte ou uma pessoa enfraquece.

## §5 Quando paras

Se uma frase do §2 não puder ficar como está escrita (diz qual e porquê); se o portão do marcador tiver de enfraquecer; se uma frase do Sobre tiver de mudar para caber.

## §6 O fim

O `build` inteiro verde; as conferências que a mudança toca, com os códigos; o Método construído copiado do `dist/` nas duas edições, no relatório; nenhuma página com o marcador "[a verificar]" depois, medido. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`. Sessenta minutos, oitenta chamadas.
