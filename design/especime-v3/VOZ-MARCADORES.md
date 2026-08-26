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
| raiz | independ | A independência reclamada pelo sítio. «auditor independente» é o nome de um papel legal e é conteúdo: está nas exceções, e é a exceção que o brief deste bloco nomeia. Serve as duas edições. |
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
| contexto | independ | auditor independente | independent auditor | O nome do papel legal de quem assina a opinião sobre as contas de um município. É conteúdo, e é a exceção que o brief deste bloco nomeia por extenso. |
| rota | ste sítio · this site | /correcoes | /en/corrections | A política de correções é o CONTEÚDO desta página, e é a Emenda 17 que o escreve: «a frase da política vive em `/correcoes`.» A cabeça do inventário já o diz por extenso: «Nenhum bloco desta página é autorreferência, e a razão não é indulgência: é o objecto da página.» Só este marcador é dispensado; todos os outros continuam a morder aqui. |
| rota | o observatório · the observatory | /estudos | /en/studies | O arquivo nomeia a publicação de que é o arquivo, como o nome da publicação no cabeçalho. A Emenda 18a fixa que nomear o que o sítio é não é autorreferência; nomear como ele trabalha é. Só este marcador é dispensado nesta rota. |
| frase | sta página · this page | Nesta página | On this page | O rótulo do sumário de uma página, já declarado navegação no inventário: leva a outro sítio da mesma página, e é isso que a lista chama navegação. |
| frase | ste sítio · this site | O que as fontes que este sítio cita publicam a seguir. | What the sources this site cites publish next. | Nomeia o âmbito do calendário: quais fontes. Sem a oração, o calendário lia-se como o das publicações estatísticas todas, e não como o das fontes citadas. É a metade da regra que fica, o limite do que a página cobre. |
| frase | método · method | Método e ressalvas | Method and caveats | O nome da secção que guarda os limites dos dados, mantido pela decisão da direção de 21.08.2026 que tirou os dois parágrafos à volta dele. A régua lê o bloco inteiro, e este bloco são duas palavras que nomeiam o que vem a seguir. |
| frase | não inventa · invents none | Não existe PIB da cidade, e o trabalho não inventa nenhum. O que existe ao nível do concelho é o registo empresarial: as contas das empresas sediadas no concelho, que creditam toda a atividade de uma empresa ao concelho da sua sede. Não é PIB municipal, e o próprio trabalho escreve porquê nos seus limites: «não capta a administração pública, a maior parte da universidade e do hospital». | There is no GDP figure for the city, and the work invents none. What exists at municipality level is the business register: the accounts of enterprises headquartered in the municipality, which credit a firm’s whole activity to its head-office municipality. It is not municipal GDP, and the study itself writes why in its own limits: «it misses public administration, most of the university and the hospital». | O sujeito da oração é **o trabalho**, e não o sítio: é a leitura do trabalho 06 sobre o que ele próprio não faz. A decisão do diretor de 26.08 mantém as citações do trabalho 06 como citações, e a §1.68 já registou que as superfícies que relatam o que o trabalho escreve ficaram por tocar. |
| frase | nós · we · us | Uma linha por número publicado. Cada linha guarda o valor tal como a fonte o publicou, quem o produziu, o documento e a edição, o endereço, a data em que o lemos e um excerto textual (e, quando o número é calculado por nós, a conta explicada e reavaliada a cada construção). | One row per published figure. Each row holds the value exactly as the source published it, who produced it, the document and edition, the address, the date we read it and a textual excerpt (and, when the figure is calculated by us, the sum spelled out and re-evaluated at every build). | **À decisão do diretor, 26.08.** É a lede do índice do livro-razão. A leitura estrita chama-lhe o método do sítio explicado; a casa chama-lhe o conteúdo do índice, pela mesma leitura com que a Emenda 17 pôs a política de correções em `/correcoes`. O `PROTOCOLO-DAS-LEITURAS.md` lista as três opções. |
| frase | ste sítio · this site | Todas as afirmações publicadas neste sítio, uma linha cada: o valor tal como foi publicado, a fonte, o documento, o endereço, a data de acesso e o excerto. | Every claim published on this site, one row each: the value exactly as published, the source, the document, the address, the access date and the excerpt. | **À decisão do diretor, 26.08.** É a descrição do `<head>` do índice do livro-razão, e é a mesma frase da lede noutra forma. Decide-se com ela. |
| frase | sta página · this page | As medidas deste trabalho vêm da prestação de contas do próprio município: o relato da gestão sobre o seu próprio ano. As duas vozes de fora são a opinião assinada do auditor independente e a série anual do regulador, que publica por município e por ano o mesmo conceito legal de dívida, compilado do lado de fora. As duas estão nesta página. | This work’s measures come from the municipality’s own accounts: management reporting on its own year. The two outside voices are the independent auditor’s signed opinion and the regulator’s annual series, which publishes per municipality and per year the same legal debt concept, compiled from outside. Both are on this page. | **Fora do âmbito deste bloco (§4 do brief).** A oração «As duas estão nesta página» é a mesma que a decisão do diretor de 26.08 tirou da página de Évora; esta vive na página do trabalho e não em Évora, e o brief manda que nenhuma frase da superfície pública mude além das de Évora. Fica listada para a mesma decisão. |
| frase | sta página · this page | A correspondência entre as contas e os pelouros é deste trabalho, declarada por ele como sua e não como oficial, e o próprio trabalho diz quais das suas linhas a recusam. Nenhuma dessas linhas atravessou para o livro-razão, e por isso esta página não conta quantas são. A regra que o trabalho fixa é: descrição, nunca classificações. | The mapping between the accounts and the portfolios is this work’s own, declared by it as its own and not as official, and the work itself says which of its lines refuse it. None of those lines crossed into the ledger, so this page does not count them. The rule the work sets is: description, never scores. | **Fora do âmbito deste bloco (§4 do brief).** Mesma razão da linha de cima: «esta página não conta quantas são» é a página a falar de si, numa página de trabalho e não em Évora. Fica listada para a mesma decisão. |
| registo | (nenhum) | 2552 afirmações · 325 calculadas · 2417 linhas de concelhos · 2544 de 2552 linhas com proveniência completa · 8 de 2552 linhas com campos por confirmar · 2417 linhas · 308 concelhos · 2417 com proveniência completa · 0 linhas · 0 concelhos · 0 com proveniência completa | 2552 claims · 325 calculated · 2417 municipality rows · 2544 of 2552 rows with complete provenance · 8 of 2552 rows with fields to confirm · 2417 rows · 308 municipalities · 2417 with complete provenance · 0 rows · 0 municipalities · 0 with complete provenance | **À decisão do diretor, 26.08 · sem marcador.** As contagens do livro-razão são chaves da prova, recontadas pelo portão nas duas vistas, e a `IDENTIDADE.md` §10 obriga-as a entrar por `data-prova` com porta. A leitura estrita do Codex de 26.08 chamou-lhes «contagens de diligência». **Nenhuma leva marcador da lista de cima**, e por isso esta linha não dispensa nada: fica escrita para que a decisão não se perca. |
