# Os marcadores da voz · a lista fechada que apanha «o sítio a explicar-se»

*Bloco «A grelha da voz», 26.08.2026. A Emenda 15 tira da página do leitor «toda
a frase sobre o método, a verificação, a honestidade, a cobertura ou as
intenções do próprio sítio», e a Emenda 18 acrescenta que «nada existe para
mostrar diligência». Até hoje a classe de cada frase era uma declaração à mão em
`INVENTARIO-FRASES.md`, feita por quem escreveu a frase: «É a lei que o define,
não este sítio.» esteve declarada como conteúdo em 616 páginas. Este ficheiro é
a rede mecânica que faltava.*

## Como é lido

`scripts/voz.mjs` lê as duas tabelas deste ficheiro. A régua do inventário
(`scripts/medir-defeitos.mjs`, medida 9) aplica os marcadores a **todas** as
frases da casa das rotas inventariadas, declaradas ou não, e `npm run check:voz`
fecha a construção quando uma frase com marcador não está declarada como
autorreferência nem consta das exceções abaixo. **Uma exceção sem razão fecha a
construção**, e um marcador sem razão também.

Três modos de correspondência, todos sem sensibilidade a maiúsculas:

* **raiz** · a cadeia em qualquer sítio da frase. É o modo por omissão, e é o
  que apanha as famílias inteiras de uma palavra («verific» apanha «verificado»,
  «verificação», «verificar»).
* **prefixo** · a cadeia no princípio de uma palavra. Existe para as raízes
  curtas que, soltas, apanhariam outra palavra: «prova» em prefixo apanha
  «provas» e «provado» e não apanha «aprovado»; «method» apanha «methods» e não
  apanha «methodical» dentro de outra palavra composta.
* **palavra** · a cadeia como palavra inteira. Existe para «nós», que em raiz
  apanharia «diagnóstico», e para «we», «our» e «us», que em raiz apanhariam
  «between», «source» e «because».

## Os marcadores

| modo | marcador | razão |
| --- | --- | --- |
| raiz | verific | A casa a dizer que conferiu. É a frase da planta P5 da leitura dos concelhos, «Todos os valores desta página foram verificados pela equipa contra as fontes oficiais.», que passou a uma leitura de olhos frescos e à régua. |
| raiz | reconfer | A mesma afirmação com o prefixo que o sítio já usou na mobília («reconferido a»). |
| raiz | confer | A raiz curta das duas de cima: apanha «conferido contra a fonte» e «conferência», que é a mesma classe dita por outra palavra. |
| raiz | honest | A honestidade é o que o leitor conclui, não o que a página reclama (Emenda 18e). Serve as duas edições. |
| raiz | rigor | O mesmo, na palavra que a substitui quando ela é proibida. Serve as duas edições. |
| raiz | rigour | A forma britânica da mesma palavra, que a edição inglesa usaria. |
| raiz | diligên | A palavra da Emenda 18: «nada existe para mostrar diligência». |
| raiz | diligen | A mesma, na edição inglesa. |
| raiz | transparen | Serve as duas edições: a transparência é uma qualidade reclamada. |
| raiz | garant | Uma garantia é uma promessa da casa sobre o seu próprio trabalho. |
| raiz | guarantee | A mesma, na edição inglesa. |
| raiz | fiáve | A fiabilidade é a mesma classe da honestidade: é o leitor que a atribui. |
| raiz | reliab | A mesma, na edição inglesa. |
| raiz | independ | A independência reclamada pelo sítio. «auditor independente» é o nome de um papel legal e seria conteúdo; teve exceção enquanto a frase «Duas vozes de fora, não uma» se rendeu na página do concelho, e a exceção saiu com ela no G6 (ISSUES I78). Hoje a raiz não morde em lado nenhum. Serve as duas edições. |
| raiz | método | O método vive no Método, no Sobre e no recibo de cada linha (Emenda 15). Numa página do leitor a palavra é o sítio a explicar-se. As rotas do Método e do Sobre não entram nesta varredura. |
| prefixo | method | A mesma, na edição inglesa. |
| prefixo | prova | A prova é o selo, não uma frase (Emenda 15). O que está dentro de `data-prova` não chega aqui: a régua já o exclui como origem declarada. |
| prefixo | proof | A mesma, na edição inglesa. «proven» e «provenance» ficam de fora de propósito: é o prefixo de palavra que os separa de «prova». |
| raiz | ste sítio | A raiz cobre «este sítio», «deste sítio» e «neste sítio». É o marcador que apanha o caso conhecido, «É a lei que o define, não este sítio.», que se rendia em 616 páginas. |
| raiz | this site | A mesma, na edição inglesa. |
| raiz | sta página | A raiz cobre «esta página», «desta página» e «nesta página». É o marcador da página a falar de si, que a decisão do diretor de 26.08 tirou da página de Évora. |
| raiz | this page | A mesma, na edição inglesa. |
| raiz | a equipa | Quem faz o sítio não é matéria da página do leitor: isso vive no Sobre (Emenda 18a). |
| raiz | the team | A mesma, na edição inglesa. |
| palavra | nós | A casa na primeira pessoa. Palavra inteira, para não apanhar «nos» nem «diagnóstico». |
| palavra | we | A mesma, na edição inglesa. |
| palavra | our | A mesma, no possessivo. |
| palavra | us | A mesma, no complemento. |
| raiz | o observatório | O sítio nomeado a si próprio no meio de uma frase. A frase de identidade da Emenda 18a, «Um observatório de Portugal.», não leva a raiz e por isso não é apanhada: o artigo indefinido é o que a separa. |
| raiz | the observatory | A mesma, na edição inglesa, com «An observatory of Portugal.» de fora pela mesma razão. |
| raiz | não fabrica | «esta página não fabrica nenhum»: o sítio a dizer o que não faz, que é a classe que a Emenda 15 nomeia por extenso, «nunca o que não afirmamos». |
| raiz | manufactures none | A mesma, na edição inglesa. |
| raiz | não inventa | A gémea da de cima, com o verbo que o motor usa. |
| raiz | invents none | A mesma, na edição inglesa. |
| raiz | mostra-se porque | A intenção editorial dita por extenso: porque é que a casa mostrou aquilo. |
| raiz | is shown because | A mesma, na edição inglesa. |
| raiz | prosa da casa | O rótulo que diz como o texto foi feito, em vez de nomear o que ele é (decisão do diretor, 26.08). |
| raiz | house prose | A mesma, na edição inglesa. |
| raiz | assente | O rótulo que diz em que é que o texto assenta («assente numa frase do trabalho»), que é a mesma classe da de cima. |
| raiz | resting on | A mesma, na edição inglesa. |
| raiz | ainda não há | A ausência dita numa frase e não em duas palavras (Emenda 15). É o caso conhecido «Ainda não há linhas deste estudo no livro-razão.», que o item E4 do bloco dos 308 corrigiu para «Sem linhas ainda.»; o marcador existe para que a forma longa não volte. |
| raiz | there are no | A mesma, na edição inglesa. «There is no…» fica de fora de propósito: «There is no counterfactual for any index.» é o limite dos dados, e não a cobertura do sítio. |
| palavra | a página | A página como sujeito de uma frase, que é a forma que o tripwire não tinha: «A página mostra as duas», «esta página publica». Palavra inteira, para não apanhar «na página» nem «da página», que são um destino e não um sujeito. |
| palavra | the page | A mesma, na edição inglesa. |
| palavra | publicamos | A casa na primeira pessoa do plural, sem o pronome: o português deixa cair o sujeito, e «nós» sozinho não apanha isto. |
| palavra | selecionámos | A escolha da casa dita por extenso. É o exemplo que a leitura de fora deu: «Selecionámos estes quatro indicadores porque são os mais relevantes.» passava. |
| palavra | selecionamos | A mesma, no presente. |
| raiz | noss | Cobre «nosso», «nossa», «nossos» e «nossas». A casa como dona daquilo que mostra. |
| raiz | este observatório | O sítio nomeado a si próprio com o demonstrativo, que a raiz «o observatório» não apanha. |
| raiz | this observatory | A mesma, na edição inglesa. |
| raiz | do que foi lido | O alcance da leitura da casa dito por extenso: «Fora do que foi lido», «Nada do que foi lido permite». O que o leitor precisa é do facto, não de onde a casa parou. |
| raiz | what was read | A mesma, na edição inglesa. |
| palavra | o trabalho | Quem leu não é sujeito de uma ressalva: o facto é (G6, 26.08.2026). Palavra inteira, para não apanhar «os trabalhos», que é o nome da secção que dá as portas das páginas de trabalho. |
| palavra | the work | A mesma, na edição inglesa, e pela mesma razão: «the works» é o nome da secção. |
| raiz | este livro-razão | «nenhum valor marcado assim atravessou para este livro-razão»: o sítio a contar o que deixou entrar em si. |
| raiz | this ledger | A mesma, na edição inglesa. |
| raiz | atravess | A palavra da travessia do motor para o livro-razão, que é maquinaria da casa e não um facto do que se mede. Era «atravessou», e a raiz curta entrou a 27.08.2026: a forma que se rendia era «itens da agenda atravessados do motor», num `title`, e o passado do verbo não lhe tocava. |
| raiz | crossed into | A mesma, na edição inglesa. |
| raiz | cobert | A cobertura do sítio dita por extenso: quanto do assunto é que ele tem. É a palavra que a Emenda 15 nomeia ao lado do método e da verificação. |
| raiz | coverage | A mesma, na edição inglesa. |
| raiz | complet | Uma afirmação de que nada falta é uma afirmação de cobertura, e serve as duas edições («completo», «completa», «complete», «completeness»). O nome do estado de proveniência de uma linha não é isso, e tem exceção escrita. |
| raiz | mostra-o | «A página do município mostra-o como está»: a página a dizer o que mostra. |
| raiz | shows it | A mesma, na edição inglesa. |
| raiz | avaliáve | «O mandato mais recente não é avaliável» era o título de uma ressalva retirada: é um juízo sobre o que a casa consegue fazer, e não sobre o que a fonte publica. |
| raiz | assessable | A mesma, na edição inglesa. |

## As exceções

*A forma é a do `ledger/allowlist.yml`: cada exceção diz porquê, e uma exceção
sem razão fecha a construção. **Uma linha é uma decisão editorial, e leva as
duas edições da mesma frase**, porque é assim que a casa decide e é assim que o
`INVENTARIO-FRASES.md` já está escrito: uma frase entra uma vez, na língua em que
é rendida, e as duas edições partilham a tabela.*

Quatro tipos:

* **contexto** · uma cadeia que, onde aparecer, não é a casa a falar de si. É
  apagada da frase antes de os marcadores correrem. É a forma dos `tokens` do
  `allowlist.yml`. **A coluna «rotas» limita a dispensa às rotas que ela nomear**
  (X3 da leitura de fora, 27.08.2026): uma cadeia que é o nome de um campo no
  recibo de uma linha é uma afirmação de cobertura em qualquer outra página, e a
  régua tem de a apanhar lá. `(todas)` é o que a coluna diz quando a dispensa é
  global, que é o que todas eram até aqui; as rotas nomeiam-se pela CHAVE da
  rota, porque uma família de páginas tem uma chave e seiscentos caminhos, e uma
  dispensa com rotas não se aplica onde a chave não for conhecida.
* **rota** · um marcador que, numa rota nomeada, é o objecto da página. Todos os
  outros marcadores continuam a morder nessa rota.
* **frase** · uma frase inteira, com o marcador a que a exceção responde.
* **registo** · uma frase que a direção quer ver listada e que **não leva
  marcador nenhum**: fica escrita para que a decisão não se perca, e a régua
  imprime quantas são para que a lista não engorde em silêncio. **Hoje não há
  nenhuma**, e o tipo fica escrito porque `scripts/voz.mjs` continua a lê-lo: a
  única que existiu eram as contagens do livro-razão, e saiu com a decisão do
  diretor de 27.08.2026 que as tirou das páginas.

**São dez desde 08.09.2026, e a que saiu é a da ausência declarada de um domínio no índice:** o bloco F1.10 (§7.8 e §9.1) tirou as dezasseis linhas «ainda sem medidas conferidas» do índice dos domínios, que passaram ao Método, e uma exceção que já não é precisa é uma porta aberta esquecida. O portão da voz mediu-a por exercer e disse-o. **Eram onze desde 03.09.2026, e a décima primeira ganhou uma rota a 04.09.2026** (o bloco F1.1b levou o rótulo da terceira data à primeira página; nenhuma exceção nova, a mesma com mais uma rota). **Eram sete.** As quatro que entram são do bloco da página do primeiro domínio (F1.2). Duas são da raiz «complet» e nomeiam a rota dos concelhos: o âmbito da contagem do ganho médio mensal, que a nota da oitava medida transcreve do publicador («a tempo completo com remuneração completa»), e que é a mesma razão da linha do «secundário incompleto». As outras duas são da raiz «confer»: a ausência declarada de um domínio no índice, e o nome da terceira data de uma medida. As duas nomeiam rotas, e não são globais: fora das páginas dos domínios, a mesma palavra continua a morder.

**Eram sete, e eram oito de manhã no dia em que a lista nasceu.** Três saíram e uma entrou duas vezes, no mesmo
dia. As três que saíram: as duas ledes do livro-razão e o registo das suas
contagens, todas com a razão «à decisão do diretor, 26.08», e a decisão de 27.08
tirou as ledes das páginas e as contagens de proveniência dos índices, porque uma
frase que já não se rende não precisa de dispensa; e a de «o trabalho conseguiu
ler», que era uma afirmação de cobertura disfarçada de limite dos dados: a frase
foi reescrita para dizer o facto da fonte («nos mandatos em que a câmara publica
a repartição») e a dispensa saiu com ela. **Ficam quatro do dia anterior**, e
entram três que a raiz «complet» passou a morder: o nome do estado do selo e os
dois campos das fontes, o secundário incompleto de uma pessoa e a data de
conclusão de um local do plano de recuperação. Nenhuma exceção foi escrita para
uma frase que a varredura não alcança: uma dispensa que nunca se exerce é uma
lista a engordar em silêncio, e a régua imprime-a. O
`PROTOCOLO-DAS-LEITURAS.md` guarda a decisão por extenso.

| tipo | marcador | pt | en | razão | rotas |
| --- | --- | --- | --- | --- | --- |
| contexto | verific · verif | a verificar | to verify | `[a verificar]` é o marcador de incerteza do sítio, com página própria em `/a-verificar`: diz que falta um campo de proveniência, e é a ausência declarada que a Emenda 15 manda dizer. A raiz «verific» está dentro do nome do marcador, e não numa afirmação da casa. | (todas) |
| contexto | a página · the page | a página da câmara | the council’s page | É a página da CÂMARA MUNICIPAL, e não a deste sítio: nomeia a fonte de onde as designações de pelouro são lidas. A raiz apanha-a porque as duas se escrevem com as mesmas palavras. | (todas) |
| rota | ste sítio · this site | /correcoes | /en/corrections | A política de correções é o CONTEÚDO desta página, e é a Emenda 17 que o escreve: «a frase da política vive em `/correcoes`.» A cabeça do inventário já o diz por extenso: «Nenhum bloco desta página é autorreferência, e a razão não é indulgência: é o objecto da página.» Só este marcador é dispensado; todos os outros continuam a morder aqui. | (todas) |
| contexto | complet | completaram no máximo o ensino básico | completed at most lower secondary education | É a DEFINIÇÃO da medida dos jovens que saem cedo da escola: o adjetivo é do percurso escolar de uma pessoa, e o que ele qualifica é o que a fonte mede. Nada tem que ver com o que o sítio cobre. **A cadeia mudou a 08.09.2026, com o item 8.4 do F1.10:** a definição da casa («secundário incompleto») passou a ser a do glossário do Eurostat, palavra por palavra («a person aged 18 to 24 who has completed at most lower secondary education»), e a exceção acompanhou-a. | (todas) |
| contexto | complet | (nenhum) | planned completion date has passed with no completion recorded | É um CAMPO do registo público do plano de recuperação, na edição inglesa: a data prevista de conclusão de um local e o facto de não haver conclusão registada. O português da mesma frase diz «conclusão», que a raiz não morde, e por isso esta linha só nomeia a cadeia inglesa. | (todas) |
| contexto | confer | excerto e data conferidos | (nenhum) | É o NOME de um dos dois estados da MARCA DA FONTE de uma linha, e o estado é dos CAMPOS: diz que a fonte, o excerto e a data de acesso daquela linha foram conferidos, e nenhum ficou por confirmar. Não é uma afirmação sobre o que o sítio cobre nem sobre o trabalho da casa, é o nome de um estado de três campos de uma linha. O outro estado chama-se «um campo por confirmar», e as duas marcas estão desenhadas na frase, cada uma ao pé do que significa. **A cadeia e o marcador mudaram a 15.09.2026, com o item 5 do F1.13:** a legenda dizia «Os dois estados do selo · proveniência completa · um campo por confirmar», que o diretor leu e devolveu («estados» chama o nome do sítio, e «selo» é um selo de correio), e passou a «Ao pé de cada número, a marca da fonte: ■ fonte, excerto e data conferidos · ▢ um campo por confirmar.» A razão da dispensa não mudou uma vírgula; o que mudou foi a palavra que a diz, e com ela a raiz que a morde, de «complet» para «confer». A exceção antiga não fica ao lado desta: uma exceção que já não é precisa é uma porta aberta esquecida, e o portão da voz mede-a por exercer. **A edição inglesa não precisa de dispensa:** «source, excerpt and date checked» não leva nenhuma das raízes desta lista, e uma exceção escrita para uma frase que a varredura não alcança é a lista a engordar em silêncio. | livro · livroConcelhos · livroConcelho · area |
| contexto | verific | verificado a | verified on | É o RÓTULO DA TERCEIRA DATA de uma medida, e a terceira data é obrigatória: a carta §1, regra 3, exige «três datas por medida, sempre: o período de referência, a data em que a fonte o publicou, e a data em que a casa conferiu a fonte». A palavra nomeia um CAMPO da linha (a data da última entrada de `verifications`), que `npm run check:formas` recompõe do livro-razão e compara carácter a carácter. Não é a casa a dizer que confere: é o nome da data que ela publica, ao lado do número, como «lido» é o nome da data de acesso. **A rota `home` entra a 04.09.2026 com o bloco F1.1b**: os dois painéis da primeira página saíram e no lugar deles ficou a área de leitura, e cada leitura breve leva as três datas da carta, como as da página do domínio. A palavra é a mesma, o campo é o mesmo e a razão é a mesma; o que mudou foi o número de rotas que a rendem. **A rota `uniaoEuropeia` entra a 08.09.2026 com o bloco F1.10, item 8.16**: as vinte e uma leituras breves mudaram-se da primeira página para «Portugal na União Europeia», e cada uma leva as três datas da carta. A rota `home` fica na lista porque as leituras das medidas de cabeça dos domínios continuam a render-se onde vivem, na página do domínio. **A rota `municipio` entra a 08.09.2026 com o §7.1 do mesmo bloco**: a grelha das oito peças grandes saiu da página de um concelho e no lugar dela ficou a área de leitura, com a leitura de cada medida a abrir do seu cartão, e cada uma leva as três datas da carta — as mesmas três, do mesmo campo, pela mesma regra. **A CADEIA E A RAIZ MUDARAM A 08.09.2026, com o §7.3 do mesmo bloco**: o rótulo dizia «conferido» e passa a dizer «verificado a», que é o que o brief escreve à letra («as datas de frescura passam a rótulos por palavras»). A palavra mudou de família e a exceção mudou com ela, de «confer» para «verific»: a razão não mudou uma vírgula, porque continua a ser o NOME de um campo da linha e não a casa a dizer que confere. A exceção antiga não fica ao lado desta: uma exceção que já não é precisa é uma porta aberta esquecida, e o portão da voz mede-a por exercer. | dominio · home · uniaoEuropeia · municipio · estudo |
| contexto | complet | tempo completo | (nenhum) | É o ÂMBITO DA CONTAGEM do ganho médio mensal, tal como o publicador o define: os Quadros de Pessoal do GEP contam trabalhadores por conta de outrem **a tempo completo**, e é isso que muda a leitura do número. A raiz «complet» apanha-a porque a palavra é a mesma; nada tem que ver com o que o sítio cobre. O inglês da mesma nota diz «full-time», que a raiz não morde. É a razão da linha do «secundário incompleto», na mesma coluna. **As rotas `home` e `temas` entram a 24.09.2026 com o bloco L1**: a leitura do cartão nacional do ganho médio mensal diz o mesmo âmbito («um trabalhador por conta de outrem a tempo completo»), lido na nota do indicador do INE («Os dados referem-se a trabalhadores por conta de outrem a tempo completo com remuneração completa.»), que a auditoria das leituras cita. **A rota `home` sai e a `entradaDinheiro` entra a 28.09.2026 com o bloco PP1**: os cartões saíram da primeira página, e a leitura do cartão nacional do ganho médio mensal vive agora em «Salários, pensões e apoios», que o K17 do `check:cartao` confere. | municipio · entradaSalarios · lugares · area |
| contexto | garant | que a lei garante | the law guarantees | É a DEFINIÇÃO da retribuição mínima mensal GARANTIDA, dita por palavras correntes na leitura do seu cartão (bloco L1, 24.09.2026): quem garante é a lei, e o que ela garante é o valor mínimo que o diploma fixa. A raiz apanha-a porque a palavra é a mesma; não é uma promessa da casa sobre o seu trabalho. **A rota `home` sai e a `entradaDinheiro` entra a 28.09.2026 com o bloco PP1**: os cartões saíram da primeira página, e a leitura do cartão do salário mínimo vive agora em «Salários, pensões e apoios», que o K17 do `check:cartao` confere. | entradaSalarios · area |
| contexto | garant | retribuição mínima mensal garantida | guaranteed minimum monthly wage | É o NOME DA MEDIDA, o termo da lei, entre parênteses no fim da pergunta do cartão do salário mínimo (bloco R2, 03.10.2026, achado 6): a retribuição mínima mensal garantida é o nome que o Decreto-Lei n.º 139/2025 dá ao valor, e quem o garante é a lei. Não é uma promessa da casa sobre o seu trabalho. A pergunta rende-se no cartão da página de assunto e no da página da área do trabalho. | entradaSalarios · area |
| contexto | o trabalho | O trabalho: mais emprego | (nenhum) | É o NOME DO ASSUNTO de um bloco de «O que se passa» (bloco PP1, 28.09.2026): o trabalho das pessoas, o emprego e o desemprego, que o bloco compara com a União. O marcador existe para a frase da casa sobre o seu próprio trabalho («o trabalho conseguiu ler»), e aqui não é o sítio a falar de si: é a primeira palavra do título do bloco, e o bloco vive apenas na primeira página. A edição inglesa diz «Work:», que o marcador não morde. As palavras do bloco estão declaradas em `src/data/primeira-pagina.mjs`, e a célula da primeira página (`tests/inicio/blocos.mjs`) corre este detetor sobre todas elas, em todos os ramos. | home |
| contexto | o trabalho | o Trabalho, Solidariedade e Segurança Social | (nenhum) | É o NOME DE UM MINISTÉRIO, na frase dos ministérios da explicação «Para onde vai o dinheiro do Estado em 2026» (bloco EX1, 05.10.2026, o texto do brief EX1, §5, ponto 4, à letra): «o Trabalho, Solidariedade e Segurança Social» é o Ministério do Trabalho, Solidariedade e Segurança Social, com o artigo da frase, e o nome é o que o mapa do Orçamento lhe dá («TRABALHO, SOLIDARIEDADE E SEGURANÇA SOCIAL»). O marcador existe para a frase da casa sobre o seu próprio trabalho, e aqui não é o sítio a falar de si. A edição inglesa diz «Labour, Solidarity and Social Security», que o marcador não morde. As palavras da explicação estão declaradas em `src/data/explicacoes/` e auditadas parte a parte, e a célula da explicação (`tests/explicacoes/explicacao.mjs`) confere o parágrafo rendido na mesma corrida. | explicacao |
| contexto | independ | a independência dos tribunais e dos juízes | the independence of their country’s courts and judges | É O QUE O INQUÉRITO MEDE, na leitura do cartão da independência da justiça (bloco L1, 24.09.2026): a percepção da independência dos tribunais e dos juízes de um país, pelas palavras da descrição do indicador do Eurostat («the perceived independence of the courts and judges in a country»). Não é a independência reclamada pelo sítio. **A rota `home` sai e a `entradaEstado` entra a 28.09.2026 com o bloco PP1**: os cartões saíram da primeira página, e a leitura do cartão da independência da justiça vive agora em «Estado e economia», que o K17 do `check:cartao` confere. | entradaEstado · area |
| contexto | independ | (nenhum) | the independence of the courts and judges | É O QUE O INQUÉRITO MEDE, na pergunta do cartão da independência da justiça na edição inglesa (bloco R2, 03.10.2026, achado 18), pelas palavras da descrição do indicador do Eurostat («the perceived independence of the courts and judges in a country»). Não é a independência reclamada pelo sítio. O português da mesma pergunta está na linha de cima. | entradaEstado · area |
| contexto | independ | independência da justiça | independence of the justice system | É O NOME DA MEDIDA, o termo da fonte, entre parênteses no fim da mesma pergunta (bloco R2, 03.10.2026, achado 18): o Eurostat chama ao conjunto «Perceived independence of the justice system». Não é a independência reclamada pelo sítio. | entradaEstado · area |
| contexto | complet | remuneração completa | (nenhum) | O segundo pedaço da mesma definição: contam-se os que receberam **remuneração completa** no mês de referência, e não quem esteve de baixa ou entrou a meio. O inglês diz «on full pay». Ver a linha de cima. | municipio · entradaSalarios · area |
| frase | sta página · this page | Nesta página | On this page | O rótulo do sumário de uma página, já declarado navegação no inventário: leva a outro sítio da mesma página, e é isso que a lista chama navegação. | (todas) |
| contexto | reliab | (nenhum) | low reliability | É a PALAVRA DA FONTE para a marca «u» de um ponto de série: a resposta do Eurostat chama-lhe «low reliability», e a página da União di-la entre parênteses ao lado do valor do ponto, na lista dobrada «Os 27 por ordem» e na etiqueta do toque da secção dos países (bloco UE2, 02.10.2026), pelas palavras declaradas em `src/data/faixa-da-uniao.mjs`. Não é a casa a dizer que é fiável: é a fonte a dizer que aquele valor o é pouco. O português diz «fiabilidade reduzida», que a raiz «fiáve» não morde, e por isso esta linha só nomeia a cadeia inglesa. | uniaoEuropeia |
| contexto | a página · the page | a página de onde veio | the page you came from | É a PÁGINA DE ONDE O LEITOR VEIO, na nota do que fica guardado da caixa das sugestões (bloco S1, 02.10.2026, o texto do §5.4 do brief à letra; desde a passagem S1-c, 03.10.2026, o texto aprovado pelo diretor, §1.154, que diz a mesma cadeia): a página do sítio em que ele estava quando abriu o formulário, que a caixa guarda com a sugestão. Não é este sítio a falar de si: é um dos dados que a nota diz que ficam guardados, e a nota existe para o leitor saber o que deixa. Desde a passagem de higiene H3 (05.10.2026) a mesma cadeia está na linha da nota da caixa, que o diretor aprovou nesse dia («Só guardamos o que escrever e a página de onde veio, para decidir a sugestão.»), e no texto da página «Privacidade», que diz o que fica guardado, e a exceção vale nas duas rotas e só nelas. | sugestoes · privacidade |
| contexto | garant · guarantee | não tem resposta garantida | a reply is not guaranteed | É o que a caixa das sugestões NÃO promete, na frase da página do obrigado (bloco S1, 02.10.2026, o texto do §5.5 do brief à letra): o leitor fica a saber que a sugestão chegou e que ninguém lhe promete resposta. O marcador existe para a casa a garantir o seu próprio trabalho, e esta frase diz o contrário de uma garantia. | sugestoesObrigado |
| contexto | ste sítio · this site | Este sítio não usa cookies | This site does not use cookies | É O QUE A PÁGINA «PRIVACIDADE» DIZ SOBRE OS COOKIES E O SEGUIMENTO (a passagem de higiene H3, 05.10.2026, o texto do §5, decisão 2, do brief H3, aprovado pelo diretor, à letra): a informação que se dá a quem lê sobre o que o sítio guarda no aparelho dele, e que o portão de HTML confere em cada construção contra as páginas, os guiões, a configuração da Vercel e as funções. Não é o sítio a explicar o seu método nem a sua cobertura: é a resposta à pergunta «o que fica de mim quando leio isto». Só esta cadeia, e só nesta rota: «este sítio» noutra frase da mesma página continua a morder, e a planta `h3-voz-este-sitio-noutra-frase-da-privacidade` (`tests/pais/portoes.mjs`) prova-o. | privacidade |
| contexto | we | (nenhum) | We only keep what you write | É QUEM GUARDA OS DADOS, na linha da nota da caixa das sugestões na edição inglesa (a passagem de higiene H3, 05.10.2026, o texto do §5, decisão 1, do brief H3, aprovado pelo diretor, à letra): a frase diz a quem escreve o que fica guardado e para quê. Não é a casa na primeira pessoa a falar do seu trabalho: é a informação que a lei manda dar no momento em que se recolhem os dados. A edição portuguesa diz «Só guardamos», que nenhum marcador morde. | sugestoes |

| frase | verific | Fontes e verificação | Sources and verification | B1, decisão de 17.09.2026: rótulo fechado da secção que reúne as origens de cada figura, conferidas por L6. Nomeia o destino e não afirma diligência. | estudo |
| frase | verific | Fontes e verificação → | Sources and verification → | A mesma secção, na porta da dobra fechada. | estudo |

Na correção B1 do achado 7, a dispensa de «verificado a» inclui a rota `estudo`: a data é lida da última verificação do livro-razão e conferida por L6, como os restantes campos do recibo.

N1, 30.09.2026: as exceções de «tempo completo» e «que a lei garante» acompanham os mesmos cartões para `entradaSalarios`. As rotas do índice e dos preços deixam de as aceitar. O texto autorizado e a comparação pelo K17 conservam-se.

N1d, 30.09.2026: «tempo completo» passa também a `lugares`, porque a definição declarada do ganho médio acompanha o mapa municipal. A célula dos concelhos compara a frase com a declaração, o período com as linhas e a referência nacional com o seu selo.

S1, 02.10.2026: duas exceções de contexto para a caixa das sugestões, cada uma na sua rota e só nela: «a página de onde veio» na nota do que fica guardado, e «não tem resposta garantida» na página do obrigado. Os dois textos são os do brief, à letra, e as duas cadeias dizem o contrário do que os marcadores procuram: a página do leitor e uma promessa que não se faz.

S1-c, 03.10.2026: uma exceção de contexto, na rota da caixa e só nela: «alojam este sítio» / «host this site», na nota do que fica guardado que o diretor aprovou (§1.154), que nomeia quem aloja os dados do leitor.

H3, 05.10.2026: a nota longa da caixa saiu e com ela a cadeia «alojam este sítio» / «host this site», e a sua exceção saiu também (uma exceção que já não se exerce é uma porta aberta esquecida). Entram duas exceções de contexto, cada uma na sua rota e só nela: «Este sítio não usa cookies» / «This site does not use cookies», na página «Privacidade», e «We only keep what you write», na linha inglesa da nota da caixa; e a de «a página de onde veio» passa a valer também na página «Privacidade», que diz a mesma cadeia. Os três textos são do diretor, à letra.
R2, 03.10.2026: as perguntas novas dos cartões do ganho médio mensal do país, do salário mínimo e da independência da justiça rendem-se também nas páginas das áreas (a rota `area`), onde o cartão não tem leitura e a pergunta é a dobra; as exceções de «tempo completo», «remuneração completa», «que a lei garante» e «a independência dos tribunais e dos juízes» passam a valer lá, e entram três cadeias novas (o nome da retribuição mínima mensal garantida, a edição inglesa da independência dos tribunais e dos juízes, e o nome da medida da justiça), cada uma com a razão. A K16 audita cada pedaço das perguntas.

EX1, 05.10.2026: uma exceção de contexto, na rota de uma explicação e só nela: «o Trabalho, Solidariedade e Segurança Social», o nome do ministério na frase dos ministérios da primeira explicação, que o marcador «o trabalho» mordia.
