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
  apagada da frase antes de os marcadores correrem, e por isso vale em qualquer
  rota. É a forma dos `tokens` do `allowlist.yml`.
* **rota** · um marcador que, numa rota nomeada, é o objecto da página. Todos os
  outros marcadores continuam a morder nessa rota.
* **frase** · uma frase inteira, com o marcador a que a exceção responde.
* **registo** · uma frase que a direção quer ver listada e que **não leva
  marcador nenhum**: fica escrita para que a decisão não se perca, e a régua
  imprime quantas são para que a lista não engorde em silêncio. **Hoje não há
  nenhuma**, e o tipo fica escrito porque `scripts/voz.mjs` continua a lê-lo: a
  única que existiu eram as contagens do livro-razão, e saiu com a decisão do
  diretor de 27.08.2026 que as tirou das páginas.

**São sete, e eram oito de manhã.** Três saíram e uma entrou duas vezes, no mesmo
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

| tipo | marcador | pt | en | razão |
| --- | --- | --- | --- | --- |
| contexto | verific · verif | a verificar | to verify | `[a verificar]` é o marcador de incerteza do sítio, com página própria em `/a-verificar`: diz que falta um campo de proveniência, e é a ausência declarada que a Emenda 15 manda dizer. A raiz «verific» está dentro do nome do marcador, e não numa afirmação da casa. |
| contexto | a página · the page | a página da câmara | the council’s page | É a página da CÂMARA MUNICIPAL, e não a deste sítio: nomeia a fonte de onde as designações de pelouro são lidas. A raiz apanha-a porque as duas se escrevem com as mesmas palavras. |
| rota | ste sítio · this site | /correcoes | /en/corrections | A política de correções é o CONTEÚDO desta página, e é a Emenda 17 que o escreve: «a frase da política vive em `/correcoes`.» A cabeça do inventário já o diz por extenso: «Nenhum bloco desta página é autorreferência, e a razão não é indulgência: é o objecto da página.» Só este marcador é dispensado; todos os outros continuam a morder aqui. |
| contexto | complet | secundário incompleto | without completing secondary education | É a DEFINIÇÃO da medida dos jovens que saem cedo da escola: o adjetivo é do percurso escolar de uma pessoa, e o que ele qualifica é o que a fonte mede. Nada tem que ver com o que o sítio cobre. |
| contexto | complet | (nenhum) | planned completion date has passed with no completion recorded | É um CAMPO do registo público do plano de recuperação, na edição inglesa: a data prevista de conclusão de um local e o facto de não haver conclusão registada. O português da mesma frase diz «conclusão», que a raiz não morde, e por isso esta linha só nomeia a cadeia inglesa. |
| contexto | complet | proveniência completa | provenance complete | É o NOME de um dos dois estados do selo de uma linha, e o estado é do CAMPO: diz que nenhum campo de proveniência daquela linha ficou por confirmar. Não é uma afirmação sobre o que o sítio cobre. O outro estado chama-se «um campo por confirmar», e as duas palavras estão desenhadas lado a lado na legenda do aparelho. |
| frase | sta página · this page | Nesta página | On this page | O rótulo do sumário de uma página, já declarado navegação no inventário: leva a outro sítio da mesma página, e é isso que a lista chama navegação. |
