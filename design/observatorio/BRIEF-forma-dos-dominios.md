# Brief · a forma dos domínios no sítio (01.09.2026)

*Escrito a 01.09.2026 pelo lugar de direção (Claude Fable 5) para o Opus construir quando houver folga; entrega C do prompt de 30.08. Não se constrói nesta sessão. Desenha só a forma dos domínios e a cabeça nova do telemóvel, contra o conceito do diretor de 31.08; nada da organização do sítio se mexe antes da avaliação única que o diretor fará com o conteúdo da primeira vaga no ar (decisão de 31.08). As medidas de aceitação estão escritas antes da construção, como manda a casa. Sem travessões na prosa.*

## 0 · O que se constrói, por esta ordem, e o que não

**A ordem, decidida a 31.08:** a cabeça nova constrói-se primeiro, como contentor, com o conteúdo de hoje (os dois quadros da União viram os primeiros cartões da faixa); os domínios da primeira vaga enchem-na à medida que entram, um por um, cada um com a disciplina inteira. Um bloco só: nem agora contra o conteúdo velho, nem depois da primeira vaga contra o novo.

**O que não se faz:** a identidade (nome, marca, tipos; fechada, §1.86); a reorganização do sítio (espera pela avaliação do diretor); medidas novas antes de o diretor escolher da tabela do inventário; qualquer biblioteca de gráficos, qualquer JavaScript para a faixa ou para trocar cartões no lugar; qualquer gráfico decorativo.

## 1 · O conceito do diretor para o telemóvel (31.08), tal como ficou

O primeiro ecrã é o instrumento inteiro: o nome, a manchete, uma faixa de cartões com os números que se percorre de lado, e o mapa. O mapa é a navegação entre três camadas (país, região, concelho) e os cartões mostram sempre a unidade escolhida. A caixa de busca, os oito nomes e a lista dos quarenta deixam de ser coisas separadas e recolhem-se no mapa. Os números mais pequenos no telemóvel do que no ecrã largo. A faixa é o «Relance»; tocar num cartão é a «Leitura breve».

**Três afinações do lugar de direção, a confirmar pelo diretor antes de construir:**

1. **O mapa escolhe regiões; o concelho escolhe-se pela busca ou depois de o mapa ampliar a região.** À largura do telemóvel a maioria dos 308 concelhos não cumpre o alvo de 44 px (pelo quadrado inscrito, I82 e I101: 15 a 18 dos 18 distritos ficam abaixo de 44 px em qualquer telemóvel; um concelho é menor do que um distrito). A lista dos nomes sobrevive fechada (um `<details>` ou equivalente sem guião), para teclado e leitores de ecrã, porque um mapa sem lista não é navegável por quem não vê.
2. **A faixa fica entre a manchete e o mapa, não por cima dele**, com `scroll-snap` em CSS, sem biblioteca nem JavaScript; os cartões são uma lista no documento (`<ol>` ou `<ul>`), percorrível por teclado, e o primeiro cartão é visível sem gesto.
3. **Cada camada é um endereço** (a página do país, a página da região, a página do concelho) com a mesma composição de cabeça, e não uma troca de cartões no lugar por JavaScript: cada vista fica partilhável, citável e indexável, e o mapa é só a navegação entre páginas que parecem um instrumento só. As páginas de região (`/regioes/<slug>`) e de concelho (`/municipios/<slug>`) já existem; a cabeça nova estende-se a elas.

A leitura do lugar de direção da captura do diretor (o que não funciona hoje no telemóvel: a afirmação e a sua evidência a quatro ecrãs de distância; o mapa a custar um ecrã inteiro sem dados; os oito nomes sugeridos arbitrários; a parede dos quarenta nomes; «Âmbito» e «Densidade» como vocabulário da casa; os cartões a um terço do ecrã; a data em ISO) está na nota «a casa como entidade», §13, no Desktop do diretor, e é o que este brief resolve na cabeça. Não se pede ao diretor a lista do que não funciona agora: ele avalia uma vez só, com a primeira vaga no ar.

## 2 · Os domínios como estrutura

**A regra.** Os domínios da carta (`CARTA-DOS-CONTEUDOS.md`) são a estrutura de todo o conteúdo de medidas; os dois quadros da União passam a ser fontes dentro dos domínios, não quadros à parte: o limiar da dívida pública fica em «Economia e finanças públicas», a posição do abandono escolar em «Educação», a sobrecarga do custo da habitação em «Habitação» (quando a segunda vaga chegar; até lá a linha continua onde está, visível, e o domínio ausente diz-se ausente). Nada do que está no ar deixa de estar: uma medida não muda de endereço; ganha um domínio.

**A página do domínio** (`/<slug do domínio>`, na edição inglesa `/en/<slug>`, os slugs decididos pelo diretor com a tabela do inventário; até ele decidir, os nomes da carta): a cabeça comum (nome, a manchete do domínio, que é a frase que o diretor pede em vez de um título: uma afirmação com números selados, como a da primeira página hoje), a faixa de cartões com as três a cinco medidas do domínio (o «Relance»), a frase da fronteira (o que este domínio mede e o que não mede, uma frase, impressa uma vez, citável, como o mapa de 18.08 recomendou), e por baixo a «Leitura breve» de cada medida: o valor com selo, a comparação que a fonte permite (a forma gráfica admitida, §3), as três datas (o período, a publicação, a conferência), a fonte e o recibo. A porta para o registo inteiro (todas as linhas do livro-razão do domínio) fica no fim, uma só.

**A regra dos vazios na página.** Uma pergunta da carta cuja medida não existe imprime a pergunta e a resposta «não há número público para isto», com a fonte que se procurou, como um cartão da faixa com a forma de ausência (a mesma que a Emenda 14 já usa para o «N.d.» de uma fonte: o valor é a ausência, selado). Um domínio que ainda não entrou não tem página: o índice dos domínios lista-o com «ainda sem medidas conferidas» e sem ligação, para o leitor saber que a casa sabe.

**A primeira página** é o domínio «país»: a cabeça comum, a faixa com um cartão por domínio no ar (cada cartão com a manchete do domínio e a sua medida de cabeça, escolhida pelo diretor), o mapa como navegação, e por baixo os domínios por ordem, cada um com a sua faixa. Até haver domínios da primeira vaga no ar, os dois quadros da União são os cartões.

**A página do concelho** espelha os domínios: a mesma cabeça (o nome do concelho, a manchete do concelho, a faixa com as suas medidas, o mapa da região com o concelho marcado), e por baixo os domínios por ordem, cada um só com as medidas que existem ao nível do concelho (hoje sete; a carta acrescenta as que o inventário confirmar), cada uma com o valor nacional ao lado e a história do concelho. Um domínio sem medida ao nível do concelho imprime a frase da unidade («a saúde mede-se por Unidade Local de Saúde; este concelho pertence à ULS X»), nunca uma aproximação. **A página da região** faz o mesmo com as medidas por NUTS II (a régua da convergência de hoje) e lista os seus concelhos.

## 3 · As formas gráficas admitidas (quatro, e mais nenhuma)

Todas SVG estático construído na construção a partir das linhas do livro-razão, com alternativa em texto (a mesma informação numa frase ou numa tabela para leitores de ecrã e para quem não vê imagens), sem biblioteca, sem animação, sem gráfico decorativo. Cada número desenhado é uma linha do livro-razão e o portão `check:dados` (ou um irmão) recusa um SVG com um número que não resolva.

1. **A série pequena do passado do país.** Uma linha com os valores da série na parte comparável (a régua do tempo com o primeiro e o último ano escritos; o último valor selado ao lado; as quebras de série marcadas como interrupções, nunca ligadas). Sem eixo decorado: a base e o topo escritos como números.
2. **A faixa «onde Portugal está entre 27».** Uma linha horizontal com os 27 como marcas, Portugal marcado e nomeado, o limiar (se existir) como uma marca diferente, e a posição escrita em texto («13.º de 27»). Só para medidas cuja fonte publica o conjunto inteiro.
3. **A barra do concelho contra o país, com a história do concelho.** Duas barras (o concelho, o país) com os valores escritos, e por baixo a série pequena do concelho quando exista. Só para medidas que existem para os 308 (ou para os 278 com as ilhas ditas).
4. **O mapa por concelho.** O mapa da Carta (CAOP 2025, DGT, CC BY 4.0, atribuído como hoje) com os 308 concelhos pintados por classes da medida, a escala com os cortes escritos, os concelhos sem valor publicado em «sem valor» (uma trama, não uma cor da escala), e a lista dos valores por concelho a uma porta de distância. Só para medidas ao nível do concelho.

O que não entra: gráficos de barras por partidos ou por mandatos (a regra de atribuição da casa é por série e por fronteira de mandato, e vive nos estudos); compostos e pontuações; qualquer forma que ponha duas medidas com bases diferentes na mesma escala; cores que digam «bom» e «mau» onde a fonte não publica limiar (o cobalto quer dizer «dentro do limiar» e só isso, §1.79).

## 4 · As medidas de aceitação, escritas antes (a régua do bloco)

A construção só se funde quando todas ficam verdes, medidas pelo construtor e depois às cegas pelo Sonnet numa cópia, e lidas a frio pelo Codex com plantas, como sempre.

**Alturas e o primeiro ecrã.**
- A 390 × 844 (o telemóvel de referência da casa) o primeiro ecrã da página do país contém o nome, a manchete inteira, a faixa com o primeiro cartão inteiro e o topo do mapa; medido por captura.
- O primeiro número selado fica a menos de um ecrã da manchete a 390 (hoje está a cerca de quatro, pela leitura do lugar de direção de 31.08; a construção mede o «hoje» antes de mudar e imprime os dois valores).
- A página do país a 390 não fica mais alta do que hoje (7 383 px medidos a 29.08, `medicoes/inicio-lista-construtor.md`); a 1280 não fica mais alta do que hoje (4 003 px). Os dois valores de partida medem-se de novo na construção antes de qualquer mudança.
- A cabeça a 1280 mantém o alinhamento da §1.84 (o mapa do topo da manchete ao fundo da legenda) ou o diretor decide a forma nova; a régua `tests/inicio/lista.mjs` (L11 a L13) continua verde ou é reescrita com a forma decidida, nunca desligada.

**Alvos e navegação.**
- Todo o alvo tocável mede pelo menos 44 × 44 px abaixo de 1024 e as linhas de nome 32 px a partir de 1024 (Emenda 20c e §1.84); os cartões da faixa são alvos inteiros.
- A faixa funciona sem JavaScript (a página com o guião desligado mostra todos os cartões, percorríveis), com `scroll-snap`, e é uma lista no documento; navegável por teclado (cada cartão foca e abre com Enter), e o leitor de ecrã lê «lista de N cartões».
- O mapa escolhe regiões a todas as larguras; abaixo de 1024 os concelhos escolhem-se pela busca ou dentro da região ampliada; a lista dos nomes existe fechada e abre sem guião; a régua do mapa (`tests/inicio/mapa-distritos.mjs`, `mapa-navegacao.mjs`) continua verde.
- Cada camada é um endereço com a mesma cabeça: a página do país, as 9 regiões, os 308 concelhos, nas duas edições; `verify:deploy` confere uma de cada.

**Contraste e tipografia.**
- Texto a 4,5:1 no mínimo, objetos de interface a 3:1 no mínimo, nos dois temas (a casa mede hoje 16,39:1 claro e 15,38:1 escuro nos nomes; os cartões medem-se por `medir-contraste.mjs`).
- Os números da faixa mais pequenos no telemóvel do que no ecrã largo, por regra escrita na folha (dois corpos, medidos), sem descer abaixo do corpo mínimo da casa para números com selo.
- Os tipos ficam (Spectral na prosa, Bitter no instrumento, §1.85); nenhum tipo novo.

**Voz e língua.**
- Cada cadeia nova entra no inventário da voz com o seu bloco (`check:voz`), na forma da Emenda 18: a página diz o que a coisa é, nunca porque confiar; «Âmbito» e «Densidade» saem da cabeça do telemóvel (o âmbito vive no menu, a densidade no cabeçalho do painel), e a frase que os substitui é aprovada pelo diretor antes de se construir; as datas escrevem-se dd.mm.aaaa em todo o lado (uma regra só; a data ISO do cabeçalho sai).
- As duas edições saem da mesma construção; os nomes de domínios, de regiões e de concelhos com a língua marcada como hoje (`check:lingua` verde).

**Portões.**
- `npm run build`, `verify` e `typecheck` a 0; as réguas existentes verdes; uma régua nova para a faixa (`tests/inicio/faixa.mjs`) com estragos plantados vistos vermelhos (um cartão sem selo, um cartão sem alvo, a faixa a depender de guião, um número no SVG sem linha).
- Nenhum número novo no sítio: a cabeça nova constrói-se com as linhas que existem; a prova é o inventário do livro-razão antes e depois, igual.

## 5 · O que se entrega com a construção

O relatório do construtor com as medidas de partida e de chegada (alturas, alvos, contraste, o número de cadeias novas), as capturas às sete larguras da casa e nas duas edições, a régua nova com as plantas, a medição cega do Sonnet numa cópia, a leitura do Codex com o ficheiro das plantas, e a emenda a `DECISIONS.md` (a §1.84 emenda-se ou uma secção nova abre) com a decisão do diretor sobre as três afinações e sobre a frase que substitui «Âmbito» e «Densidade».

## 6 · Estimativa e modelo

Construtor: Claude Opus 5, um bloco em duas passagens (a cabeça e a faixa; depois as páginas de região e de concelho a herdá-la), da ordem de 0,6 a 0,9 M símbolos pela experiência dos blocos da cabeça (§1.84: 455k em duas passagens só para a lista dos nomes); medição cega: Claude Sonnet 5, da ordem de 0,4 M; leitura: Codex `gpt-5.6-sol` xhigh, da ordem de 0,2 M. As estimativas são do lugar de direção e ficam escritas para se compararem com o custo real no fecho do bloco.
