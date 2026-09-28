# C1 · as correções de confiança

Entrega parcial: o ponto 3 está parado porque a linha da dívida das famílias da União não pertence ao circuito que o brief manda atualizar. A prova está em `circuito-divida.json`. O valor selado permanece 49,3 e a divergência para 49,2 permanece visível no recibo. Não se inventou uma travessia nem uma `atualizacao` para uma linha que não está no livro de origem indicado.

A cabeça medida do código do sítio é `3885a4e6180961ece14e54f03e46b0d3abbb2e6d`; a do motor é `3e83a271f4c5af0b1f6809436916c1b06d6e0b1c`. Os três portões finais passaram nesta cabeça do sítio. O último commit entrega as provas. O teste de aceitação integral do brief não está satisfeito enquanto o ponto 3 permanecer parado.

## Mandato e resultado

| Ponto | Resultado | Medição e prova |
|---|---|---|
| 1. Separar o número da unidade | O espaço passa a existir no texto dos cartões, incluindo os dos concelhos. A I143/I158 confere títulos de recibos e cartões; a K17 e a M8 acompanham a forma. O espaço visual é conservado pelo desenho existente. | `plantas-confianca.json` prova títulos e cartões com espaço normal ou fixo e recusa a sua remoção. `m8.json` e `m8-plantas.json` conferem as ressalvas e recusam a colagem. Nas capturas finais: 0 valores colados e 0 px de diferença na distância visual, em 60 comparações (`medidas.json`). |
| 2. Aplicar a quarta redação | As leituras seguem a quarta redação do lugar de direção, com os acertos do RSI descritos abaixo. A definição de inflação varia com o sinal; a comparação do IHPC fala de variação; a concordância das rendas, a frase inglesa da pensão e o título inglês dos alimentos foram corrigidos. | `acertos-provados.json`: 2 acertos, 0 diferenças fora deles, 37 leituras anteriores intactas e K17 sem erros. `leituras-seladas.json` guarda as frases resolvidas; `preparacao/ensaio.log` guarda o ensaio a seco. Ramos e plantas em `plantas-confianca.json`. |
| 3. Atualizar a dívida das famílias da União | **Parado antes de qualquer pedido ou escrita.** A proveniência real é `indicators/enquadramento.py`, no estudo `quadro-institucional`, e não o livro do estudo 13. O ramo da leitura não mudou, porque o valor não mudou. | `circuito-divida.json`: a linha não aparece nos 6 ficheiros de cruzamento nem no manifesto ou livro de domínios. O conhecido-positivo `ipc-variacao-homologa` aparece nos 3 pontos do circuito. Valor e `source_url` conservados. A V16 não foi exercitada como atualização desta linha. |
| 4. Reler o PIB real por habitante | O motor resolve a dimensão pela coordenada selada `CLV15_EUR_HAB`. As releituras com unidade fixa deram `igual`, pelo que não houve atualização de valores. Os endereços históricos ficam iguais. | `pib/releitura.json`, `pib/conferencia.json` e `pib/escrita.json`: 3 releituras iguais, 0 divergências e 0 ambiguidades. `pib/provas-isoladas.json` regista os testes das dimensões e da vigia. A retenção do histórico é descrita abaixo. |
| 5. Oferecer as medidas dos concelhos | A ligação antiga identifica as posições usadas no mapa. A ligação ao novo `indicadores-dos-concelhos.csv` oferece as medidas dos cartões, geradas do livro-razão com valor, unidade, período, fonte e identificador. | `dados-concelhos.json`: 2 464 linhas, 308 concelhos, 8 medidas e 308 linhas calculadas. A C7 confere o ficheiro contra as linhas e recusa as 4 plantas. Cada reposição recupera o resumo anterior e volta a passar. |
| 6. Explicar a conferência do número | O recibo distingue a leitura inicial, a segunda leitura do número, a releitura do ficheiro da fonte e a ausência de segunda leitura. Diz o resultado em palavras correntes. A ligação à atualização só existe quando há uma atualização tipada correspondente. | `plantas-confianca.json` confere as duas edições, a correspondência com o registo, os destinos e a distinção entre número e ficheiro. Capturas dos recibos da inflação, da dívida das famílias da União e do PIB real por habitante: antes em `capturas-antes.json` e depois em `capturas-depois.json`. A atualização real da dívida continua dependente do ponto 3; a porta foi exercida com casos sintéticos explícitos. |
| 7. Alinhar o calendário de Évora | As observações da dívida usam `xDoAno`, a escala da faixa dos mandatos. Anos sem valor ficam sem ponto e sem ligação. O mandato em curso tem o rótulo existente da sua edição. | `calendario.json`: a F18 confere as posições nas páginas construídas das duas edições e recusa ponto deslocado, ponto sem valor, ligação sobre uma lacuna e ausência do rótulo em curso. Mantêm-se os nomes e a incerteza protegidos pela I77. |
| 8. Entregar mapa, capturas e provas | O mapa e o inventário foram atualizados; os guiões do bloco produzem as medições, as cópias congeladas e o pacote de leitura a frio. | Mapa com 77 citações conferidas e nenhuma desfasada (`mapa.json`); capturas e cópias seladas; `medidas.json` com validação sem erros; custo registado e montagem do pacote descrita abaixo. A paragem não foi escondida no relatório. |

## Acertos à quarta redação

A referência é `design/observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs`, incluindo o seu cabeçalho. `acertos-c1.json` declara as trocas e `acertos-provados.json` prova que não há outras diferenças. A contagem separa a redação portuguesa e a inglesa.

| Medida e edição | Redação recebida | Redação aplicada | Literal de apoio |
|---|---|---|---|
| `beneficiarios-do-rsi-por-mil-2024`, pt | «a quem vive em carência económica grave» | «a quem vive em pobreza extrema» | `rp1-rsi-seguranca-social`: «É um apoio para pessoas em situação de pobreza extrema». |
| `beneficiarios-do-rsi-por-mil-2024`, en | «for people living in severe economic hardship» | «for people living in extreme poverty» | O mesmo literal de `rp1-rsi-seguranca-social`, traduzido na edição inglesa. |

A parte sobre a inserção conserva o apoio de `rp1-rsi`: «que favoreçam a progressiva inserção laboral, social e comunitária». Os acertos aproximam a frase do conceito que a fonte publica, sem mudar o número, o denominador ou a população contada.

As frases portuguesas das rendas passaram a dizer «acima das de há um ano»; a pensão inglesa usa «across old-age, invalidity and survivors’ pensions». No inventário, as frases longas antes publicadas ficaram retiradas com a razão da mudança. As cadeias curtas que continuam a aparecer ficaram vivas. Os rótulos dos recibos estão descritos como rótulos fora das rotas medidas pelo inventário, sem lhes atribuir ocorrências que a régua não conta. A conferência da voz está em `preparacao/voz.log` e voltou a correr em `portoes/build.log`. `inventario-c1.json` é o inventário de valores usado pelo ensaio das leituras.

No ponto 6 houve um ajuste semântico à frase proposta pelo brief: o estado `inacessivel` não prova sempre que «a fonte não respondeu». No caso do PIB, a fonte respondeu com uma dimensão ambígua, como mostram o corpo e o estado guardados. O recibo diz «não foi possível reler o número na fonte nesse dia», conservando o alcance real do registo. Esta diferença foi comunicada ao diretor durante o trabalho.

## A paragem da dívida das famílias

`provar-circuito-divida.py` lê os cruzamentos do sítio e o circuito de domínios do motor sem fazer pedidos à rede. A prova percorre o mesmo circuito com `ipc-variacao-homologa`, que encontra, para excluir uma ausência causada por um leitor que não procura corretamente.

A linha `divida-das-familias-2025-ue` foi gerada por `indicators/enquadramento.py`, com o estudo `quadro-institucional`. A linha original e o resumo da geração guardados no motor concordam com a linha do sítio nos campos conferidos. O valor e o endereço da fonte continuam iguais aos selados.

O estudo 13 tem um corpo `tipspd22` usado na leitura de Portugal, como metainformação sem linhas. Isso não faz da linha da União uma linha do livro desse estudo. O corpo guardado é de Portugal e a linha da União não consta do livro nem do manifesto da travessia. Atualizá-la pelo caminho prescrito exigiria criar uma proveniência que a prova não mostra.

A paragem protege o número, a fonte e a história da linha. O recibo mostra que a fonte publica agora outro valor, 49,2, mas não oferece uma ligação para uma atualização inexistente. Não houve corpo novo neste ponto, nem alteração das outras linhas da família. O próximo passo exige corrigir o circuito autorizado para esta linha antes de a reler e atualizar.

## O PIB e a preparação do motor

A resposta histórica pode conter mais de uma categoria da dimensão `unit`. A releitura usa a coordenada identificada no excerto da linha ou explicitada no endereço histórico; não escolhe a primeira categoria nem transforma a ambiguidade em ausência. A canária da existência passa a resolver os casos com coordenada conhecida. A vigia da estrutura continua a assinalar a mudança de forma da resposta, e a vigia da metainformação continua a assinalar alterações do carimbo do conjunto.

| Linha | Valor relido | Resultado |
|---|---|---|
| `pib-real-per-capita-2024` | 20 430 | `igual` |
| `pib-real-per-capita-2025` | 20 600 | `igual` |
| `pib-real-per-capita-2025-ue` | 31 890 | `igual` |

As releituras efetivas estão em `pib/releitura.json`; `pib/conferencia.json` repete a prova sobre os corpos guardados. `pib/escrita.json` guarda os campos e os resumos antes e depois da escrita. Só `verifications` mudou. Os valores e os `source_url` ficaram intactos.

O escritor existente conserva as últimas 4 verificações. Na linha portuguesa de 2025, a entrada de 7 de setembro saiu da lista atual quando entrou a releitura igual de 28 de setembro. A entrada inacessível de 28 de setembro ficou na lista, seguida da releitura igual. A entrada antiga continua documentada no Git e em `pib/escrita.json`; não se afirma que a lista atual conserva o histórico integral.

O primeiro pre-commit do motor foi recusado porque a worktree nova não tinha as caches derivadas de recortes de Évora. Seguiu-se a instrução existente no `.gitignore`: copiar as caches da árvore principal. `motor/preparacao-recortes.json` prova 3 cópias idênticas, 170 recortes, livros idênticos, imagens íntegras, ficheiros ignorados e estado do Git conservado. Esta preparação não é apresentada como uma passagem do portão.

Foi também retirado de um comentário preexistente de `indicators/refresh.py` um exemplo de caminho temporário absoluto, porque o ficheiro foi escrito neste bloco. `motor/comentario-portavel.json` mede a ocorrência antes e a ausência depois, com árvore sintática igual e sem mudar o detetor. O literal não é reproduzido neste relatório.

O pre-commit final correu `python3 -m core.gate` e passou. `motor/commit-final.codigo` contém 0, `motor/commit-final.log` contém a passagem e `motor/entrega.json` identifica a cabeça `3e83a271f4c5af0b1f6809436916c1b06d6e0b1c` e a árvore limpa.

## Células, proteções e plantas

| Célula ou conferência | Forma aplicada | Proteção e planta |
|---|---|---|
| I143/I158 no portão de HTML | A célula comum lê títulos de recibos e quantidades dos cartões. | O texto copiado ou ouvido tem espaço entre o valor e a unidade. Retirar o espaço do título ou do cartão é recusado. |
| K17 | A recomposição acompanha o espaço da unidade e as folhas da quarta redação; subida e descida pertencem ao ramo do sinal. | O texto rendido continua a coincidir carácter a carácter com a leitura recomposta. A frase positiva fixa plantada num valor negativo é recusada. Os literais das palavras continuam exigidos. |
| M8 e conferência do RP1 | A forma com espaço conserva a leitura da ressalva e a associação à própria linha. | A nota de dado provisório continua a corresponder às bandeiras reconhecidas na edição certa. As plantas de colagem são recusadas. |
| Dimensões e vigia do motor | A coordenada selada resolve uma dimensão com várias categorias. | O caso sem coordenada suficiente continua ambíguo; a categoria não é adivinhada. A planta com dimensão ambígua e coordenada conhecida resolve o valor esperado. Testes isolados em `pib/provas-isoladas.json`. |
| C7 dos dados dos concelhos | Um leitor independente recompõe as linhas esperadas a partir do livro-razão. | Recusa valor trocado, unidade trocada, medida omitida e duplicação; exige reposição idêntica do ficheiro depois de cada planta. |
| Conferência do recibo | Lê a ausência de segunda leitura e a porta da atualização a partir do registo. | Recusa ausência falsa, atualização falsa, porta em falta ou errada e destino inexistente. Distingue a releitura do ficheiro da releitura do número. |
| F18 dos mandatos | Recompõe a posição pelo ano e pelos extremos do calendário rendido. | Recusa ponto deslocado, ponto sem valor, ligação sobre anos sem valor e perda do rótulo do mandato em curso. Confere as páginas das duas edições. |
| Inventário e voz | Regista a substituição das frases publicadas e descreve os rótulos fora da sua amostra. | As cadeias curtas ainda publicadas permanecem vivas; não se alargou a lista de tolerâncias. |

`plantas-confianca.json` contém 32 controlos íntegros e 38 plantas recusadas. São casos sintéticos em memória, identificados como tal; os valores de ensaio não foram escritos nas linhas nem publicados. O teste importa as células reais e a K17, repõe os objetos originais e não constrói páginas.

`dados-concelhos.json` e `calendario.json` guardam as plantas sobre a construção preparatória. A C7 e a F18 voltaram a correr no `build` final, sem erros; os mesmos conferidores e plantas permanecem no código medido. Os ficheiros das provas ficam incorporados em `medidas.json`. As provas do motor estão ligadas à sua cabeça por `motor/entrega.json`.

## Capturas e cópias congeladas

As larguras prescritas são 390, 768, 1 024, 1 280 e 1 600 px, nas edições portuguesa e inglesa. A matriz inclui os cartões da inflação, do IHPC, das rendas, da pensão, dos alimentos e da dívida das famílias; as páginas do país, dos temas, dos lugares e de Évora; e os recibos da inflação, da dívida das famílias da União e do PIB real por habitante.

| Momento | Construção fotografada | Intervalo UTC e resultado |
|---|---|---|
| Antes | `48a5a1c181c1753036d301204884c57119bba8a5` | De `2026-09-28T11:46:46.762Z` a `2026-09-28T11:47:36.673Z`, em `capturas-antes.json`. |
| Depois | `3885a4e6180961ece14e54f03e46b0d3abbb2e6d` | De `2026-09-28T12:34:23.756Z` a `2026-09-28T12:35:14.616Z`, com 0 falhas, em `capturas-depois.json`. |

O antes foi construído a partir da base, embora a worktree já estivesse em `d9ab0805ba9510df7ded6fa2350e65b35a0e8ab3` quando se capturou. `capturas-antes.json` distingue `dist_construido_de` de `cabeca_da_arvore`; não se confunde a cabeça da árvore com o código fotografado.

O antes tem 70 capturas de página e 60 recortes de cartão. `pormenores-antes.json` acrescenta 12 imagens dos recibos e do calendário, nas larguras estreita e larga. As imagens estão em `capturas/`; as cópias estão em `paginas-antes/`. Os índices guardam os resumos para conferir os bytes. O depois tem 70 capturas de página e 60 recortes de cartão, com 0 páginas a transbordar. Os 18 ficheiros congelados estão em `paginas-depois/`. `pormenores-depois.json` guarda os recortes suplementares. `inspecao-visual.json` identifica as imagens abertas e as observações. A distância visual entre valor e unidade manteve-se; o separador textual passou a existir.

## Cabeças, commits e portões

A base do sítio é `48a5a1c181c1753036d301204884c57119bba8a5`. Os commits do ramo, pela ordem, são:

| Commit | Assunto |
|---|---|
| `ada78b694e4cc11975b3172c35a31917fcebfa6b` | C1: alinhar a dívida de Évora com o calendário dos mandatos |
| `28b17e2a2f283ef1b734be7a02f4012eea10f347` | C1: oferecer as medidas dos concelhos em ficheiro e preparar os rótulos |
| `005c4a2eb0c55cce1abd762b8c5538dbec7227ca` | C1: separar valores e explicar as leituras e as conferências |
| `d9ab0805ba9510df7ded6fa2350e65b35a0e8ab3` | C1: registar as três releituras iguais do PIB real por habitante |
| `7a7d2f8d43f46e4bb599987d2f25080ace880d9b` | C1: separar também as unidades nos cartões dos concelhos |
| `8656f66f838c31ec0ad63d58204df2edb5f90e91` | C1: fixar as palavras e preparar a medição da entrega |
| `3885a4e6180961ece14e54f03e46b0d3abbb2e6d` | C1: fechar os tipos do CSV e retirar a importação sem uso |
| `HEAD` | C1: entregar as provas das correções de confiança. É o commit desta entrega; o pai é `3885a4e6180961ece14e54f03e46b0d3abbb2e6d`. |

A base do motor é `4eb2867936dd14ad2654751722e390804e68dda3`. O ramo contém o commit `3e83a271f4c5af0b1f6809436916c1b06d6e0b1c`, «C1: reler dimensões do Eurostat pela coordenada selada». Os registos das tentativas anteriores ficam nas provas, mas não são commits adicionais do ramo final.

Os portões finais do sítio são corridos uma vez, separadamente, na cabeça do código `3885a4e6180961ece14e54f03e46b0d3abbb2e6d`. O commit posterior de entrega reúne as provas dessa cabeça. Os códigos têm de ser lidos dos ficheiros escritos por cada comando; uma conferência preparatória não substitui nenhum deles.

| Comando | Código final | Ficheiro |
|---|---|---|
| `npm run build` | 0 | `portoes/build.codigo` |
| `npm run verify` | 0 | `portoes/verify.codigo` |
| `npm run typecheck` | 0 | `portoes/typecheck.codigo` |

A tentativa na cabeça `8656f66f` teve `build` a 0 e `verify` a 1: a substituição do marcador no recibo deixou uma importação sem uso. O `typecheck` da tentativa seguinte recusou duas declarações no gerador do CSV. Foram corrigidas a importação e as validações de tipos; `tipos-csv.json` prova que o CSV gerado conservou exatamente os mesmos bytes. As saídas recusadas ficam em `portoes/tentativa-8656f66f/` e `portoes/tentativa-f0df158c/`. Não se contam como portões finais.

Os ficheiros irmãos `.cabeca`, `.inicio`, `.fim` e `.log` identificam a cabeça, o intervalo e a saída de cada corrida. `medidas.json` reúne esses valores. Conferência dos números deste relatório por `conferir-relatorio.py`: 0 faltas e conhecido-positivo encontrado, em `relatorio-conferido.json`.

## Custo, caminhos e pacote

O registo `custo-c1.json`, lido a `2026-09-28T12:38:56.213176+00:00`, reúne 51 466 005 símbolos de entrada, dos quais 50 367 232 em cache, e 175 436 de saída. O total exposto é 51 641 441 símbolos. A janela entre o início da sessão e o fim do último portão mede 3 839,973029 segundos; as capturas e o fecho do pacote posteriores não entram nesse intervalo. As contagens são cumulativas até à leitura do registo. Incluem a sessão principal e os agentes construtores; excluem as revisões automáticas. Entrada em cache e raciocínio não são somados duas vezes. O preço não está exposto.

`medir-c1.py` confere os valores e endereços de todas as linhas anteriores contra a base, os resumos das capturas e cópias, os códigos dos portões e os caminhos locais nos ficheiros escritos e nas suas versões do ramo. O detetor de caminhos é exercitado com um conhecido-positivo temporário; a amostra positiva não entra na entrega. Resultado: 577 ficheiros e 49 versões históricas lidos antes do commit das provas, 0 ocorrências, conhecido-positivo encontrado em todas as classes procuradas. O modo `--verifica` volta a conferir a entrega sem reescrever as medições e exige que o commit das provas seja filho da cabeça dos portões e só mude a pasta deste bloco.

Os ficheiros protegidos do motor não foram usados como destino de escrita. A conferência específica da releitura está em `pib/conferencia.json`; a conferência final do conjunto está em `medidas.json`, com 0 ficheiros protegidos alterados. As 3009 linhas anteriores foram comparadas: 0 valores ou endereços selados alterados e 0 linhas novas. Não houve publicação nem `push`.

O pacote de leitura é montado por `pacote-c1.py` após este commit de entrega, numa pasta temporária com o prefixo `oedp-c1-pacote-`. A montagem exige o pai correto, a versão construída da cabeça medida e os mesmos resumos das páginas e folhas congeladas. Inclui o diff, as páginas e recibos, as capturas e os ficheiros finais do motor. O diff do motor destinado à leitura omite o exemplo de caminho absoluto num comentário removido; o seu resumo integral fica declarado e os ficheiros finais ficam byte a byte iguais ao Git. `PACOTE.json`, dentro do pacote, guarda os resumos e o resultado da procura de caminhos. A resposta curta é `RESPOSTA-codex-c1.md`.
