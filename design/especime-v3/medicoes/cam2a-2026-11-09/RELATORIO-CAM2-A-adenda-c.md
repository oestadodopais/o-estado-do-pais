# CAM2-A, fecho da adenda C

Implementação: `ad3505c52669aaa677902cc12219dfd5bf40f4d2`. Construção e base de f362f5ccd no mesmo dia UTC,
2026-11-09. A documentação de fecho entra num commit posterior,
sem alterar a implementação construída. Não houve publicação nem aterragem.

## Resultado

- 872 páginas de prosa, todas as páginas HTML construídas salvo os
  recibos do livro-razão. A enumeração parte das coleções e a conferência
  recusa qualquer HTML adicional fora delas.
- 2162 frases únicas: 1055 PT e 1107 EN.
- 22 entradas bilingues da semente, nas rotas `/o-que-se-discute`
  e `/en/under-discussion`, com 21 linhas de suporte.
- 2118 pendentes: 1033 PT e
  1085 EN, abaixo do teto de 4 000.
- 795 de 795 corpos do livro alojados; os excertos das 21 linhas do registo
  foram encontrados nos corpos. Sem motor, ambos os comandos dizem que não
  leram os corpos e `limpa=false`, mesmo terminando a zero.

## Marcas e corte

As contrações de `por causa de/do/da/dos/das`, `resulta de/do/da/dos/das` e
`resultado de/do/da/dos/das` passam no detetor e na AUD1. Os doze verbos novos
passam; nomes como `Mecanismo de Alerta` e `Sistema de Alerta` não passam por
esse verbo. As exclusões ordinais de `segundo` têm plantas nas duas línguas.

Há 178 plantas isoladas, uma por marca: 31 reais e 25 sintéticas
em PT, 42 reais e 80 sintéticas em EN. Mantêm-se as 20 plantas reais anteriores.
As listas estão presas pelo sha256 `ba0cf40df815392b771f04669b566e37df50b6410e7678dac31514a336fbd897`, com data e
razão. Cada commit que muda as marcas tem de mudar também o pino e a razão.
Uma reparação num commit posterior não apaga a recusa histórica.

O corte adicional pertence ao detetor, não à régua da voz. Um fragmento sem
marca própria conserva a obrigação de auditoria da unidade marcada de onde
foi separado, sem herdar a prova. No registo efetivo de f1b98c701 há três pares
com o corte pedido (três frases PT e três EN), não cinco entradas. Os doze
fragmentos resultantes estão cobertos: seis registados e seis pendentes.
Quatro desses fragmentos não tinham marca própria e não foram deixados de fora.
A semente foi regenerada por guião e guarda todos os tipos das duas frases.

## Pares e estimativa editorial

No mesmo âmbito e corte atuais, comparando as marcas de f1b98c701 com as finais:

| Sentido | Pares | Sem par | Falhas antes da C | Falhas depois |
| --- | ---: | ---: | ---: | ---: |
| PT para EN | 846 | 209 | 103 | 60 |
| EN para PT | 1046 | 61 | 381 | 260 |

A comparação com as marcas inglesas iniciais do mandato também fica nas
medidas: 153 falhas antes e
60 depois. O par é estrutural, não um
juízo sobre a tradução. Uma ausência de par não dispensa a cobertura de cada
língua e não faz parar a passagem.

A amostra fixa `CAM2-A-2026-11-09` tem 30 frases por língua. A classificação
editorial do construtor encontrou 23 afirmações sobre fonte, pessoa ou causa
em PT e 23 em EN. As frases, decisões e critério estão nas medidas. Isto não
é uma régua nem uma verificação da verdade das frases.

## Origem, juízo e commits

Uma entrada nova ou reescrita exige `origem: "mandato <nome>"`, com o caminho
relativo à pasta das medidas. A conferência lê a lista `Frases:` do cabeçalho
e compara o identificador, estudo, tipos, par, linhas e razão. Os campos da
camada 0 mantêm-se nessa lista para continuar a conferir números, voz e
quantificadores. Uma entrada sem mandato recusa. A semente inicial também
está presa; não se pode invocar `origem: "semente"` para uma frase nova.

Sem citação portuguesa de pelo menos doze carateres presa a um excerto,
exige-se `juizo: "por julgar"`. Qualquer outro valor recusa nesta camada.
A CAM2-B fica responsável pelo juiz e pela transição do estado.

A lista inicial foi regenerada pela autorização expressa da adenda C. A base
da validação histórica passa a f1b98c701 e o pino da lista é
`d8a2a98728ddba84e2479f2a57e7b29cb37afec76123eec4ffd2bde90b41ca4b`. Depois deste primeiro commit, só pode encolher.
O GitHub usa o histórico completo e não precisa do motor para a cobertura.

O escrivão prepara o índice e chama `comitar.sh --conferir-indice`, que lê
`git show :ledger/frases/por-registar.json` e os pinos desse índice. A planta
prova que uma recusa impede o commit. O escrivão já iniciado antes desta
alteração só incorpora essa chamada quando voltar a arrancar; nesta passagem,
o índice efetivamente comitado foi conferido explicitamente, com código zero.
A aterragem exige também as linhas `corpos lidos` e `limpa=true` dos dois
comandos. A planta do código zero com corpos não lidos impede a fusão.

## Âmbito e contagens por coleção

As coleções geográficas usam coleção, língua e frase normalizada, sem contar
uma repetição em várias páginas como dívida nova. Arquivos datados, páginas
institucionais, sugestões, respostas e erros 404 também entram. Os aliases e
redirecionamentos sem HTML próprio não são páginas omitidas. Só os recibos
do livro-razão são excluídos entre as páginas construídas.

Uma mesma frase de estudo pode aparecer em estudo, documento e arquivo. Por
isso a tabela por coleção não se soma para obter o total único. As colunas de
ocorrências contam a repetição no HTML; as primeiras contam frases únicas
nessa coleção. A tabela seguinte por chave é a partição do total único.

| Coleção | PT únicas | EN únicas | Ocorrências PT | Ocorrências EN |
| --- | ---: | ---: | ---: | ---: |
| `404` | 1 | 1 | 1 | 1 |
| `home` | 6 | 6 | 6 | 6 |
| `agenda` | 2 | 6 | 2 | 8 |
| `areas` | 1 | 1 | 1 | 1 |
| `correcoes` | 23 | 47 | 24 | 48 |
| `dossie` | 67 | 72 | 69 | 73 |
| `dossies` | 1 | 1 | 1 | 1 |
| `entradaEscolaESaude` | 3 | 5 | 3 | 5 |
| `entradaTrabalho` | 1 | 1 | 1 | 1 |
| `entradaEstado` | 3 | 2 | 3 | 2 |
| `estudos` | 4 | 5 | 4 | 5 |
| `explicacao` | 11 | 9 | 11 | 9 |
| `leituraDaSemana` | 1 | 1 | 1 | 1 |
| `explicacoes` | 1 | 1 | 1 | 1 |
| `entradaCasa` | 2 | 2 | 2 | 2 |
| `indice` | 2 | 2 | 2 | 2 |
| `lugares` | 1 | 1 | 1 | 1 |
| `metodo` | 7 | 8 | 7 | 8 |
| `discussao` | 74 | 85 | 76 | 89 |
| `entradaPobreza` | 1 | 2 | 1 | 2 |
| `entradaDinheiro` | 1 | 1 | 1 | 1 |
| `privacidade` | 2 | 2 | 2 | 2 |
| `regioes` | 1 | 1 | 1 | 1 |
| `entradaSalarios` | 1 | 3 | 1 | 3 |
| `sobre` | 3 | 2 | 3 | 2 |
| `sugestoesLimite` | 1 | 1 | 1 | 1 |
| `sugestoesNaoChegou` | 1 | 1 | 1 | 1 |
| `sugestoesObrigado` | 1 | 2 | 1 | 2 |
| `sugestoesVazia` | 1 | 1 | 1 | 1 |
| `sugestoes` | 1 | 1 | 1 | 1 |
| `temas` | 1 | 1 | 1 | 1 |
| `estudo` | 628 | 562 | 686 | 634 |
| `documento` | 706 | 660 | 742 | 717 |
| `arquivo` | 583 | 677 | 879 | 1053 |
| `area` | 5 | 9 | 13 | 17 |
| `distrito` | 1 | 1 | 29 | 29 |
| `municipio` | 6 | 10 | 927 | 931 |
| `regiao` | 1 | 1 | 9 | 9 |
| `uniaoEuropeia` | 2 | 22 | 2 | 27 |

## Contagens por estudo, página ou coleção geográfica

| Chave | PT | EN | Registo bilingue | Pendentes PT | Pendentes EN |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 6 | 6 | 0 | 6 | 6 |
| `/404` | 1 | 1 | 0 | 1 | 1 |
| `/agenda` | 2 | 6 | 0 | 2 | 6 |
| `/areas` | 1 | 1 | 0 | 1 | 1 |
| `/correcoes` | 23 | 47 | 0 | 23 | 47 |
| `/dossies/orcamento-2027` | 67 | 72 | 0 | 67 | 72 |
| `/dossies` | 1 | 1 | 0 | 1 | 1 |
| `/educacao-e-saude` | 3 | 5 | 0 | 3 | 5 |
| `/emprego` | 1 | 1 | 0 | 1 | 1 |
| `/estado-e-economia` | 3 | 2 | 0 | 3 | 2 |
| `/estudos` | 4 | 5 | 0 | 4 | 5 |
| `/explicacoes/dinheiro-do-estado-2026` | 6 | 4 | 0 | 6 | 4 |
| `/explicacoes/dinheiro-do-estado-2027` | 5 | 5 | 0 | 5 | 5 |
| `/explicacoes/leitura-da-semana` | 1 | 1 | 0 | 1 | 1 |
| `/explicacoes` | 1 | 1 | 0 | 1 | 1 |
| `/habitacao` | 2 | 2 | 0 | 2 | 2 |
| `/indice` | 2 | 2 | 0 | 2 | 2 |
| `/lugares` | 1 | 1 | 0 | 1 | 1 |
| `/metodo` | 7 | 8 | 0 | 7 | 8 |
| `/o-que-se-discute` | 74 | 85 | 22 | 52 | 63 |
| `/pobreza-e-desigualdade` | 1 | 2 | 0 | 1 | 2 |
| `/precos` | 1 | 1 | 0 | 1 | 1 |
| `/privacidade` | 2 | 2 | 0 | 2 | 2 |
| `/regioes` | 1 | 1 | 0 | 1 | 1 |
| `/salarios-pensoes-e-apoios` | 1 | 3 | 0 | 1 | 3 |
| `/sobre` | 3 | 2 | 0 | 3 | 2 |
| `/sugestoes/limite` | 1 | 1 | 0 | 1 | 1 |
| `/sugestoes/nao-chegou` | 1 | 1 | 0 | 1 | 1 |
| `/sugestoes/obrigado` | 1 | 2 | 0 | 1 | 2 |
| `/sugestoes/vazia` | 1 | 1 | 0 | 1 | 1 |
| `/sugestoes` | 1 | 1 | 0 | 1 | 1 |
| `/temas` | 1 | 1 | 0 | 1 | 1 |
| `a-casa-em-portugal-e-na-europa` | 67 | 91 | 0 | 67 | 91 |
| `agua-nao-faturada` | 24 | 36 | 0 | 24 | 36 |
| `alentejo-algarve` | 1 | 39 | 0 | 1 | 39 |
| `avaliacao-economica-regional-de-portugal-2026` | 13 | 1 | 0 | 13 | 1 |
| `colecao-area` | 5 | 9 | 0 | 5 | 9 |
| `colecao-distrito` | 1 | 1 | 0 | 1 | 1 |
| `colecao-municipio` | 6 | 10 | 0 | 6 | 10 |
| `colecao-regiao` | 1 | 1 | 0 | 1 | 1 |
| `colecao-uniaoEuropeia` | 2 | 22 | 0 | 2 | 22 |
| `evolucao-de-portugal-desde-1981` | 4 | 1 | 0 | 4 | 1 |
| `evora-2027-capital-europeia-da-cultura` | 96 | 112 | 0 | 96 | 112 |
| `evora-2027-prometido-painel-dinheiro` | 92 | 107 | 0 | 92 | 107 |
| `evora-contas-da-camara-2010-2025` | 56 | 65 | 0 | 56 | 65 |
| `evora-economia-e-dinheiro-publico-de-fora-da-camara` | 36 | 39 | 0 | 36 | 39 |
| `evora-economia-investidores-portas-abertas-2026` | 5 | 2 | 0 | 5 | 2 |
| `evora-orcamentado-pago-devido-2025` | 28 | 35 | 0 | 28 | 35 |
| `evora-os-pelouros-quem-os-teve-o-que-fizeram` | 67 | 3 | 0 | 67 | 3 |
| `evora-prometido-pago-auditado-2026` | 61 | 68 | 0 | 61 | 68 |
| `evora-quem-governou-a-camara-2009-2025` | 53 | 1 | 0 | 53 | 1 |
| `evora-quinze-anos-cinco-mandatos` | 62 | 2 | 0 | 62 | 2 |
| `onde-esta-a-agua` | 39 | 72 | 0 | 39 | 72 |
| `orcamento-2027-o-que-muda-e-para-quem` | 99 | 105 | 0 | 99 | 105 |
| `penalizacoes-por-reforma-antecipada-2026` | 10 | 1 | 0 | 10 | 1 |
| `which-door-is-yours` | 1 | 10 | 0 | 1 | 10 |

## Conferências e comparação

Todos os códigos executados do fecho são zero:

- `npm run build`, incluindo `check:voz` e `check:paridade` na cadeia com `&&`.
- `npm run check:frases-afirmacao`, com e sem `RESEARCHHUB_DIR`, incluindo plantas.
- `npm run ledger:check`, com e sem `RESEARCHHUB_DIR`.
- `npm run check:pre-mandato` e `npm run typecheck`.
- As plantas afetadas de aterragem, escrivão, corpos e comparação, e os restantes
  guiões de `tests/leituras` executáveis nesta sandbox.
- `sh scripts/leituras/comitar.sh --conferir-indice`.

`tests/leituras/ferramentas.py` continua delegado à direção fora da sandbox,
como determina a adenda B. Não se atribui um código verde à suite integral
`check:leituras`, nem a `verify`, que não correram integralmente aqui.

Os comandos de geração e medição foram:

```sh
node scripts/gerar-plantas-marcas.mjs dist
node scripts/gerar-frases-afirmacao.mjs dist <destino-novo> <medidas.json>
node scripts/medir-frases-afirmacao.mjs dist <medidas.json>
python3 scripts/comparar-dist-frases.py dist <comparacao.json>
```

Todos os comandos longos passaram por `sh scripts/leituras/curto.sh`.
A regeneração final do registo e da lista é idêntica byte a byte aos ficheiros
comitados. O comparador usa `OEDP_DIST_BASE`, verifica a cabeça f362f5ccd e o
mesmo dia UTC, exclui apenas `version.json` e `prova.json`, e permite apenas
67 para 68 no campo de conferências de Método, nas duas edições.

Resultado: 25304 ficheiros comparados,
25302 idênticos byte a byte, duas diferenças
permitidas de Método, zero diferenças restantes, zero ficheiros novos ou
apagados. São 9878 páginas HTML. Não restou diferença
apenas de relógio para justificar.

Os códigos, comandos, tempos e últimas linhas estão em
`conferencias-adenda-c-cam2a.json`; a prova dos bytes está em
`comparacao-adenda-c-cam2a.json`.

## Custo desta passagem

Até à gravação deste relatório: 60 chamadas de ferramentas,
85 operações internas e
46 corridas de conferências, contando os ensaios
recusados e as repetições dirigidas. As invocações internas das cadeias npm
não são contadas de novo. As conferências automáticas dos pedidos de commit
também não são somadas. Gerações e medições: 12.
Zero corridas integrais de portões, capturas ou ajudantes. O commit documental
e a inspeção final são contados na resposta final. Nas duas primeiras medições,
o resumo incluiu indevidamente as listas de falhas; a saída foi corrigida para
mostrar apenas as contagens.
