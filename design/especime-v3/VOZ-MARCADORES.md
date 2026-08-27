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
| raiz | atravessou | A palavra da travessia do motor para o livro-razão, que é maquinaria da casa e não um facto do que se mede. |
| raiz | crossed into | A mesma, na edição inglesa. |
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
  imprime quantas são para que a lista não engorde em silêncio.

| tipo | marcador | pt | en | razão |
| --- | --- | --- | --- | --- |
| contexto | verific · verif | a verificar | to verify | `[a verificar]` é o marcador de incerteza do sítio, com página própria em `/a-verificar`: diz que falta um campo de proveniência, e é a ausência declarada que a Emenda 15 manda dizer. A raiz «verific» está dentro do nome do marcador, e não numa afirmação da casa. |
| contexto | a página · the page | a página da câmara | the council’s page | É a página da CÂMARA MUNICIPAL, e não a deste sítio: nomeia a fonte de onde as designações de pelouro são lidas. A raiz apanha-a porque as duas se escrevem com as mesmas palavras. |
| contexto | o trabalho · the work | o trabalho conseguiu ler | the work could read | Nomeia o alcance do TRABALHO, que é um limite dos dados: a frase só vale para os mandatos que ele leu. Não é a casa a falar do seu próprio cuidado. |
| rota | ste sítio · this site | /correcoes | /en/corrections | A política de correções é o CONTEÚDO desta página, e é a Emenda 17 que o escreve: «a frase da política vive em `/correcoes`.» A cabeça do inventário já o diz por extenso: «Nenhum bloco desta página é autorreferência, e a razão não é indulgência: é o objecto da página.» Só este marcador é dispensado; todos os outros continuam a morder aqui. |
| frase | sta página · this page | Nesta página | On this page | O rótulo do sumário de uma página, já declarado navegação no inventário: leva a outro sítio da mesma página, e é isso que a lista chama navegação. |
| frase | nós · we · us | Uma linha por número publicado. Cada linha guarda o valor tal como a fonte o publicou, quem o produziu, o documento e a edição, o endereço, a data em que o lemos e um excerto textual (e, quando o número é calculado por nós, a conta explicada e reavaliada a cada construção). | One row per published figure. Each row holds the value exactly as the source published it, who produced it, the document and edition, the address, the date we read it and a textual excerpt (and, when the figure is calculated by us, the sum spelled out and re-evaluated at every build). | **À decisão do diretor, 26.08.** É a lede do índice do livro-razão. A leitura estrita chama-lhe o método do sítio explicado; a casa chama-lhe o conteúdo do índice, pela mesma leitura com que a Emenda 17 pôs a política de correções em `/correcoes`. O `PROTOCOLO-DAS-LEITURAS.md` lista as três opções. |
| frase | ste sítio · this site | Todas as afirmações publicadas neste sítio, uma linha cada: o valor tal como foi publicado, a fonte, o documento, o endereço, a data de acesso e o excerto. | Every claim published on this site, one row each: the value exactly as published, the source, the document, the address, the access date and the excerpt. | **À decisão do diretor, 26.08.** É a descrição do `<head>` do índice do livro-razão, e é a mesma frase da lede noutra forma. Decide-se com ela. |
| registo | (nenhum) | 2552 afirmações · 325 calculadas · 2417 linhas de concelhos · 2544 de 2552 linhas com proveniência completa · 8 de 2552 linhas com campos por confirmar · 2417 linhas · 308 concelhos · 2417 com proveniência completa · 0 linhas · 0 concelhos · 0 com proveniência completa | 2552 claims · 325 calculated · 2417 municipality rows · 2544 of 2552 rows with complete provenance · 8 of 2552 rows with fields to confirm · 2417 rows · 308 municipalities · 2417 with complete provenance · 0 rows · 0 municipalities · 0 with complete provenance | **À decisão do diretor, 26.08 · sem marcador.** As contagens do livro-razão são chaves da prova, recontadas pelo portão nas duas vistas, e a `IDENTIDADE.md` §10 obriga-as a entrar por `data-prova` com porta. A leitura estrita do Codex de 26.08 chamou-lhes «contagens de diligência». **Nenhuma leva marcador da lista de cima**, e por isso esta linha não dispensa nada: fica escrita para que a decisão não se perca. |
