# Visão · O Estado do País · o que é, as camadas e o horizonte (rascunho de 30.08.2026)

*Rascunho escrito pelo lugar de direção (Claude Fable 5) a partir da conversa com o diretor a 30.08.2026. É o documento que cada sessão lê primeiro; muda só por decisão do diretor, com data. Uma ideia que não esteja aqui não existe para a sessão seguinte; uma sessão que toque na visão edita este ficheiro. Entrou no repositório como `VISAO.md` a 01.09.2026, no primeiro commit verde da sessão que se seguiu; o rascunho de 30.08 ficou no Desktop do diretor. Sem travessões na prosa.*

## 1 · O que é

O Estado do País é um observatório de Portugal escrito, conferido e atualizado por sistemas de IA sob uma política publicada, com uma pessoa com nome a responder pela publicação. Não é uma montra de dados. Os números com a sua fonte são a primeira camada de uma pilha; a razão de ser é o que se constrói por cima, até ao limite de uma leitura do país que informe quem decide e quem quer perceber. O valor que se procura é para a sociedade, o conhecimento, a investigação e a formação de políticas; não é monetário. O projeto evolui, porque as leis, os dados e o mundo mudam; as regras da confiança não.

## 2 · As regras que não mudam, em todas as camadas

- Cada número leva fonte, excerto, data de acesso e selo; nada se escreve que não tenha sido medido; o que muda no tempo confere-se na fonte primária antes de se afirmar.
- A verificação nunca é o autor, e é sempre de outra família de modelos.
- O livro-razão é um portão da construção, não um documento nem um hábito.
- As correções registam-se e ficam à vista; as ausências dizem-se («não há número público para isto» é conteúdo).
- A divulgação é total: o que a IA fez, o que o humano decidiu, onde a maquinaria pode falhar.
- A cadência é limitada pela capacidade de manter, não pela de produzir.
- A página do leitor não se explica; a análise vai para estudos com livro-razão de afirmações e leitura cruzada.
- A identidade (nome, marca, tipos) está fechada (§1.86 de `DECISIONS.md`).

## 3 · A pilha: cada camada feita só da anterior

0. **As fontes e as versões.** O motor (ResearchHub) lê os publicadores oficiais e guarda cada versão de cada ficheiro, com sha256 e data, porque os publicadores substituem ficheiros e o passado não se volta a descarregar. Existe o motor e `indicators/vintages.json`; o arquivo dos ficheiros entra com o corredor diário.
1. **O livro-razão.** Os números com proveniência, frescura e comparabilidade, nas duas edições. Existe: 2 916 linhas a 02.09.2026, publicadas em JSON e CSV; dizia «2 602 linhas a 30.08.2026».
2. **As medidas e as comparações.** Os domínios da carta dos conteúdos, cada pergunta com uma medida e a comparação que a fonte permite (contra um limiar publicado, contra os pares, contra o próprio passado; o concelho contra o país e contra o seu passado). A carta e o inventário são a entrega da sessão seguinte; os domínios entram por vagas.
3. **As leituras.** «O que mudou» (o diário do que os números públicos fizeram, gerado da própria corrida), «O que os números dizem» (uma pergunta da atualidade respondida só com linhas) e «O que se discute» (a vigia da Assembleia, do Diário da República e dos calendários de difusão). Depois da primeira vaga.
4. **Os estudos.** Uma pergunta (não um tema), um método fixado antes de ver os dados, o livro-razão de afirmações, a leitura cruzada, a condição de matar, o resultado nulo publicado. O arquivo do conhecimento sobre um assunto ou um período. Doze existem. Três patamares, abertos por fases: os factos; o que as fontes projetam, com os pressupostos e os falhanços passados de cada projeção; as opções com evidência, com conclusões só sobre evidência e nunca sobre valores.
5. **A síntese.** O cruzamento entre domínios e no tempo. A exploração por IA que procura ligações entre áreas produz **perguntas, nunca achados**: cada pergunta passa pela disciplina dos estudos, porque a caça a correlações é a forma mais rápida de fabricar falsos achados (quebras de comparabilidade, denominadores pequenos, falácia ecológica). No topo, a peça que dá nome à casa: «O Estado do País», uma síntese periódica (um ponto de situação por trimestre, um relatório por ano) construída das camadas de baixo, que é o que um decisor lê. Horizonte.
6. **Os instrumentos e o acesso.** Para pessoas: explorar, comparar, descarregar gráficos com atribuição, e um dia vídeos curtos e infografias feitos de linhas. Para agentes de IA de outras pessoas: o livro-razão em JSON (existe), um servidor MCP da casa, feeds, dados estruturados por linha, uma licença explícita. O motor deixa de ser só a ferramenta da casa e passa a ser, aos poucos, a ferramenta de quem investiga. O pacote de citabilidade na fase 2; os instrumentos na fase 3.

## 4 · O que já existe e o que cada camada espera (02.09.2026; a leitura anterior era de 30.08.2026)

| camada | existe | espera |
|---|---|---|
| 0 | o motor; os *vintages* em JSON | o arquivo de cada versão de cada ficheiro (corredor diário, B) |
| 1 | 2 916 linhas a 02.09.2026, dizia «2 602»; JSON e CSV; selos; correções em `/metodo` | a frescura diária, «conferido em» (B) |
| 2 | os dois painéis da União na primeira página | a carta, o inventário, a primeira vaga (A, depois a construção) |
| 3 | a régua semanal do painel europeu | «O que mudou», «O que os números dizem», a vigia |
| 4 | doze estudos com livro-razão e leitura cruzada | os patamares 2 e 3, por fases |
| 5 | nada | a exploração como geradora de perguntas; a síntese periódica |
| 6 | o livro-razão em JSON e CSV, e um JSON por linha a 02.09.2026; JSON-LD; sitemaps; robots; a coluna do lado dizia «licença, «citar como», feeds, dados por linha, MCP; instrumentos para leitores; vídeo», e os dados por linha saíram dela porque já existem | licença, «citar como», feeds, MCP; instrumentos para leitores; vídeo |

## 5 · O horizonte: as ideias postas por escrito para não se perderem

| ideia | de quem, quando | estado |
|---|---|---|
| a carta dos conteúdos com 17 domínios, por vagas | diretor, 29.08 | decidida a 30.08 (ordem confirmada); a 31.08 o diretor acrescentou «segurança social e pensões» à primeira vaga, e os domínios passam a 18 |
| a frescura diária e «O que mudou» | diretor, 29.08 | decidida a 30.08 (corredor no motor; rotina publica com portões verdes) |
| o arquivo de versões dos ficheiros de fonte | diretor, 30.08 | decidido (entra em B) |
| a casa como entidade (caixa de correio, organização no GitHub, cofre, nota de continuidade, depósito externo, plano de fim de vida) | diretor, 30.08 | decidida a 30.08; a organização `oestadodopais` criada a 31.08, com o sítio transferido e o motor publicado lá; a 02.09.2026 o Vercel está religado, o repositório do sítio é público desde 01.09 e o do motor continua privado; a caixa quando a casa precisar de escrever. A frase dizia «(privados); falta religar o Vercel» e dizia «o repositório do sítio público no lançamento, com a regra dos dados pessoais»: a passagem a público foi a 01.09, e não no lançamento, com a regra dos dados pessoais aplicada nesse dia |
| a tabela da autonomia e a via B da divulgação (rotular tudo; o diretor responde) | diretor, 30.08 | decidida a 30.08: a tabela escreve-se em `POLITICA-DA-AUTONOMIA.md` como autorização durável; o texto da divulgação muda em «Sobre» e `/metodo` |
| o registo de modelos, com testes de promoção por estragos plantados | diretor, 30.08 | decidido a 30.08 (o Fable no lugar de direção; a rotina é código; as passagens mecânicas em Opus e Sonnet; o Codex lê a frio) |
| a diligência legal: a leitura na fonte agora, a hora do advogado quando a leitura o pedir e sempre antes do lançamento | diretor, 30.08 | decidida a 30.08 («para não nos metermos em sarilhos»): a memória `DILIGENCIA-LEGAL.md` é a entrega D da sessão seguinte; a hora do advogado paga-se quando a memória o pedir e, em qualquer caso, antes da indexação e das redes; hipótese do diretor, a testar e não a assumir: um sítio independente, sem fins lucrativos, que não se diz jornalístico, não precisa de registo, como um blogue; o que se leu até agora (resumos, não a lei) diz que o critério da ERC é formal (periodicidade, estrutura editorial), não o nome que o sítio dá a si próprio |
| o estatuto editorial que vincule sucessores | lugar de direção, 30.08 | proposta |
| a vigia da atualidade (Assembleia, DRE, calendários, RSS só para assuntos; e os observatórios, as universidades e as instituições como referências e gatilhos: uma publicação deles dispara a diligência até à fonte primária e, valendo a pena, um estudo próprio; nunca são fontes) | diretor, 30.08 e 31.08 | horizonte, depois da primeira vaga |
| os estudos do patamar 3 (opções com evidência) | diretor, 30.08 | decidido a 30.08: os patamares 1 e 2 na fase 1; o 3 só depois de a primeira vaga provar |
| a exploração por IA como geradora de perguntas | diretor, 30.08 | horizonte |
| a síntese periódica «O Estado do País» (trimestre, ano) | lugar de direção, 30.08 | horizonte, por decidir |
| o pacote de citabilidade e o servidor MCP para agentes | diretor, 30.08 | ordem decidida a 30.08: primeiro a citabilidade, depois o resumo semanal, por fim o vídeo; fase 2 |
| instrumentos para leitores (explorar, comparar, descarregar) | diretor, 30.08 | horizonte, fase 3 |
| vídeos curtos e infografias feitos de linhas, com recibo | diretor, 30.08 | longe, se alguma vez (diretor, 31.08): nenhum piloto planeado; a ideia fica registada para não se perder e só volta à mesa quando houver conclusões que valham uma explicação mais eficiente e envolvente; se voltar, por último na ordem do alcance, medido em citações |
| a associação (pessoa coletiva) | diretor, 30.08 | horizonte, fase 3, se a fase 2 o merecer |
| a ronda de leitores e a indexação do sítio inteiro | diretor, 24.08 e 25.08 | pendentes do diretor |
| a primeira página no telemóvel como instrumento inteiro: manchete, faixa de cartões de lado, mapa como navegação entre país, região e concelho, cada camada um endereço | diretor, 31.08 | conceito registado; C desenha contra ele; constrói-se na reorganização, depois da primeira vaga |

## 6 · O que não é

- Não é jornalismo no sentido legal: o título é regulado em Portugal (`[verify]` o alcance exato; a ERC remeteu o caso Conta Lá à CCPJ pela apresentação de conteúdos), e a casa não chama jornalista à IA; é um observatório com estudos, que faz o que o jornalismo faz de melhor sem usar a palavra.
- Não é um portal de estatísticas: a PORDATA existe; a casa é a camada de proveniência, leitura e análise por cima dos dados públicos.
- Não é opinião: as conclusões vêm da evidência, com a regra que as produziu; a evidência equilibrada diz-se como tal.
- Não escreve para o alcance: mede-se por citações, não por visitas.

## 7 · Como esta visão se mantém

Lida no início de cada sessão, apontada pelo ficheiro que cada sessão lê primeiro. Muda só por decisão do diretor, com data. O §5 é o lugar das ideias novas, com quem as disse e quando; uma ideia fora daqui não existe para a sessão seguinte. A cada fecho de sessão, o lugar de direção confere o §4 e o §5 contra o que se fez, e o prompt da sessão seguinte aponta a esta visão antes de apontar às entregas.
