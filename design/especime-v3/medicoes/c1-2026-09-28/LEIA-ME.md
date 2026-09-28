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

No ponto 6 houve um ajuste semântico à frase proposta pelo brief: o estado `inacessivel` não prova sempre que «a fonte não respondeu». No caso do PIB, a fonte respondeu com uma dimensão ambígua, como mostram o corpo e o estado guardados. O recibo diz «não foi possível reler o número na fonte nesse dia», conservando o alcance real do registo. A frase anterior dizia que esta diferença tinha sido comunicada ao diretor durante o trabalho. Estava errada: não houve essa comunicação.

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

O antigo `pib/releitura.json` foi retirado no C1c porque não correspondia ao guião entregue; a nova corrida efetiva está documentada na secção C1c; `pib/conferencia.json` repete a prova sobre os corpos guardados. `pib/escrita.json` guarda os campos e os resumos antes e depois da escrita. Só `verifications` mudou. Os valores e os `source_url` ficaram intactos.

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

O antes foi construído a partir da base, com a worktree em `28b17e2a2f283ef1b734be7a02f4012eea10f347` quando se capturou, como regista `preparacao/capturas-antes-permitidas.cabeca`. `capturas-antes.json` distingue `dist_construido_de` de `cabeca_da_arvore`; não se confunde a cabeça da árvore com o código fotografado.

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
| `6c16c719` | C1: entregar as provas das correções de confiança. É o commit desta entrega; o pai é `3885a4e6180961ece14e54f03e46b0d3abbb2e6d`. |

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


## C1c

Esta secção regista a passagem de correção de 28.09.2026. As secções anteriores
são o registo da primeira entrega do C1, incluindo a paragem que então houve.
A cabeça preparada do código do sítio é `93f0477b`. Os portões completos e as
capturas desta passagem ainda estão por fechar; os resultados finais serão
lidos dos ficheiros em `portoes/c1c/` e `c1c/`.

A reconferência pelo gerador encontrou **49,2** para a dívida das famílias da
União em 2025. A linha passou de 49,3 para 49,2, com acesso a 28.09.2026 e a
entrada `atualizacao` nas palavras do mandato. A conferência das 3 009 linhas
contra `b7f352ce` encontrou uma alteração de valor, esta, e uma alteração de
endereço, a proveniência autorizada da DGAL. Não foi aplicada outra revisão
numérica nem uma normalização da escrita dos outros valores.

| Achado | Tratamento | Prova |
| --- | --- | --- |
| 1, 2, 3, 4, 11 | São as cinco plantas do pacote, todas achadas. Não se corrigem como defeitos do sítio. | `design/especime-v3/critica/LEITURA-c1-2026-09-28.plantas.json`, P1 a P5. |
| Ponto 3 do brief; 19 | O gerador resolve todas as dimensões seladas antes de ler a observação. O valor da União foi atualizado pelo circuito do estudo `quadro-institucional`. | `c1c/gerador-plantas.json`, `c1c/atualizacao-divida.json`, `c1c/comparacao-gerada.json`; `c1c/livro-final-do-codigo.codigo` a 0. |
| 5 | Foram acrescentadas 18 bandeiras omitidas, incluindo as do PIB real por habitante de 2024 e 2025. O gerador lê `status` na mesma coordenada de `value`. Os outros valores ficaram intactos. | `c1c/bandeiras.json`; linhas do livro; capturas dos cartões e recibos por executar. |
| 6, 7 | Saíram as três entradas escritas pelo guião manual. O painel normal escreveu três `igual` e conservou a tentativa inacessível do mesmo dia. O recibo não inventa a causa de uma tentativa que só guarda o resultado. | `c1c/pib-retiradas.json`, `c1c/painel.log` e a corrida alojada no motor. |
| 8 | O recibo europeu mostra a atualização, a última releitura e a ligação entre ambas. Os valores encontrados seguem a pontuação da edição. Quando diferem do selado, o recibo identifica o valor do título como o usado. | Linha `divida-das-familias-2025-ue`; `c1c/plantas-confianca.json`; capturas por executar. |
| 9 | A quinta redação distingue o IPC do IHPC. O objetivo de 2 % a médio prazo pertence à zona do euro, sem veredicto sobre Portugal. | `c1c/origens.json`, `c1c/leituras-seladas.json`, `c1c/acertos.json` e `c1c/k17.json`. |
| 10 | O índice municipal explica a média de receita que serve de denominador e a regra de uma vez e meia. O limite de 150 continua na unidade. A linha legal cita a DGAL, com sete campos de proveniência revistos. O câmbio explica apreciação e perda de competitividade de preços. | `c1c/dgal-proveniencia.json`; literais alojados e K17; capturas dos dois cartões pendentes. |
| 12 | A marca «sem valor publicado» deixou de levar unidade. | Planta `marca-com-unidade` e controlo da marca sem unidade; captura de Évora pendente. |
| 13 | Cada releitura do número diz «Releitura a» / «Re-read on», seguida da data, sem ordinal. | Plantas executadas; capturas dos recibos pendentes. |
| 14 | Fica aberto o problema semântico da comparação com sinais negativos. Esta passagem não o muda. | Mandato e achado 14 da leitura a frio. |
| 15 | O ficheiro dos concelhos ganhou `nota`, com a ressalva de atualidade onde existe. | C7 em `c1c/dados-concelhos.json`, incluindo a planta que apaga a nota. |
| 16 | Cada observação de dívida fica no fim do seu ano. | F18 em `c1c/calendario.json`, incluindo a planta que recua os pontos para o início. |
| 17 | A guarda conta as quantidades, exige uma em cada cartão declarado e falha se não medir nenhum cartão na construção. A contagem de câmaras mantém a proteção independente da V2. | Plantas do seletor que deixa de casar e da contagem colada à unidade. |
| 18 | Os ramos de sinal das rendas, médias de doze meses, IHPC e restantes leituras do RP1 estão presos às palavras da respetiva edição. | Trocas coerentes de ramos nas duas línguas em `c1c/plantas-confianca.json`. |
| 20 | A cabeça da árvore nas capturas do antes foi corrigida para `28b17e2a`. O registo do comando deixa de aceitar uma cabeça fornecida pelo ambiente. | `capturas-antes.json`, `paginas-antes/INDICE.json`, `preparacao/capturas-antes-permitidas.cabeca` e `registar-c1.py`. |
| 21 | Foi retirado `pib/releitura.json`: não correspondia ao guião entregue. As provas históricas restantes não são apresentadas como a execução do painel no C1c. | A remoção no Git; `c1c/painel.log` e corpos da nova corrida no motor. |
| 22 | A afirmação de que houve comunicação ao diretor estava errada. O relatório passa a dizê-lo expressamente. | Parágrafo corrigido na primeira parte deste relatório. |
| 23 | As cabeças medidas, a entrega e os commits seguintes ficam ligados abaixo. | Lista de commits e registos dos portões. |
| 24 | O comentário do motor usa um anfitrião genérico. O detetor reconhece o formato antigo, com uma amostra lida do próprio Git, sem a copiar para a entrega. | Medição `C1c.caminhos` em `medidas.json`, com conhecido-positivo do anfitrião. |

**O circuito e as diferenças.** A geração está em
`~/Instruments/ResearchHub`, pasta `indicators/out/enquadramento-2026-09-28/`.
Produziu 59 linhas. A comparação integral, campo a campo, está em
`c1c/comparacao-gerada.json`; a tabela completa das outras 58 linhas está em
`c1c/diferencas-outras-linhas.md`; a tabela seguinte mostra todas as diferenças
na escrita do valor. Nas restantes 54 linhas geradas, a escrita do valor é igual
à do sítio. Os acessos, excertos, notas e listas vazias da geração não
substituíram os do sítio em bloco. As 18 bandeiras foram tratadas separadamente.

| Linha | No sítio antes | Gerado | Decisão |
| --- | --- | --- | --- |
| `divida-das-empresas-2025-ue` | 70,0 | 70 | Não aplicada. O número é igual; muda só a escrita. |
| `divida-das-familias-2025-ue` | 49,3 | 49,2 | Aplicada a atualização tipada. |
| `jovens-nem-2025-ue` | 11,0 | 11 | Não aplicada. O número é igual; muda só a escrita. |
| `taxa-de-desemprego-2025-ue` | 6,0 | 6 | Não aplicada. O número é igual; muda só a escrita. |
| `taxa-de-desemprego-mip-2025-ue` | 6,0 | 6 | Não aplicada. O número é igual; muda só a escrita. |

O gerador registou cinco ausências europeias em 2025: `tipsbp10`, `tipsii10`,
`tipsbp60`, `tipspc30` e `tipsbd10`. Tanto `EU27_2020` como `EA20` tinham o período
sem observação. Não se criou uma linha para nenhuma ausência.

**Bandeiras e história.** O formato já aceita `source_flag`,
`source_flag_note` e `source_flag_note_en`, que o recibo lê, e o `Claim` já
apresenta `p` como «dado provisório». Acrescentou-se essa metainformação omitida;
a bandeira veio do corpo alojado, não foi inferida do valor. O excerto foi
estendido à bandeira da mesma observação. A conferência do livro passou sem
alargar os campos da entrada `proveniencia` nem inventar uma mudança numérica.
Há 17 bandeiras `p` e uma `e`; esta última é «valor estimado» na despesa em I&D
da União. A aplicação e os resumos dos corpos estão em `c1c/bandeiras.json`.

O validador exige que uma releitura não seja anterior ao acesso da linha.
Por isso, a verificação de 21.09 da dívida europeia e a verificação anterior da
linha legal foram conservadas nas provas do antes, respetivamente em
`c1c/atualizacao-divida.json` e `c1c/dgal-proveniencia.json`, e saíram das listas
atuais depois dos novos acessos. O validador não foi enfraquecido. As três
listas do PIB conservam a tentativa inacessível de 28.09, que o mandato
identifica como a das 08:30. As entradas do livro guardam o dia, não a hora;
não se acrescentou uma hora que elas não contêm.

O painel terminou com código **1**, e não se apresenta esse código como sucesso
integral do vigia: registou três alarmes de estrutura, porque a resposta ganhou
uma unidade. A resolução da coordenada permitiu três releituras `igual`, sem
alterar os valores 20 430, 20 600 e 31 890. Os corpos, a hora, os avisos e as
cópias isoladas do estado estão em
`indicators/out/releitura-c1c-2026-09-28/`. A execução não tocou nos ficheiros de
estado protegidos da raiz do motor. O livro fecha o formato de cada releitura
em `date`, `path`, `result`, `by` e, para uma divergência, `found`; não há um
campo de razão nas entradas existentes. O recibo usa a frase genérica prevista
no mandato, sem transformar `inacessivel` em «a fonte não respondeu».

**Origens e redação.** A estratégia do BCE, a declaração do âmbito da zona do
euro e a página canónica da DGAL responderam pelo cliente da casa e ficaram
alojadas. Conservam-se também as tentativas recusadas, incluindo o problema de
certificado do endereço DGAL com `www`. O câmbio junta o literal do Eurostat
«A positive value means real appreciation.» aos literais do BCE sobre preços
relativos e perda de competitividade. `c1c/medidas.json` confere os resumos dos
corpos e a presença de cada literal neles.

A régua existente converte um limiar declarado num veredicto e pinta o estado.
Usou-se, por isso, a alternativa autorizada: `nl` para o 2 do objetivo, com
literal auditado e a declaração `OBJETIVO_DO_IHPC` em
`src/data/referencias-das-medidas.mjs`, marcada sem veredicto. Não se acrescentou
um limiar português à régua. A quinta redação coincide com a da direção, salvo
esta representação autorizada e os dois acertos literais do RSI já documentados
no C1. A K17 passou com as novas origens.

O registo de mudanças não tinha um âmbito para a linha da União. A declaração
nova conserva o seu lugar como União Europeia, com porta para os temas; a
conferência deriva esse âmbito de `geo=EU27_2020`, por uma via independente.
A atualização não entra como uma mudança de um valor de Portugal na primeira
página. Não se acrescentou uma medida, uma série, um gráfico ou uma página.

**Cabeças e entrega.** A primeira cabeça medida foi `3885a4e6`; a entrega das
provas foi `6c16c719`; seguiram-se a resposta `04ef76eb`, `533fea9d` e
`b7f352ce`, que é a base desta passagem. Esta sequência substitui o antigo
«HEAD» ambíguo. A lista completa do ramo e as cabeças finais são acrescentadas
na conclusão das medições do C1c.


**Paragem medida na primeira corrida completa.** O `build` de `93f0477b`
terminou com código 1 em `check:cruzamento`: a linha
`indice-de-divida-limite-legal` passou de uma reconferência para zero e a
travessia não permite que a lista encolha. A guarda protege a história da
fonte. A retirada tinha sido feita para cumprir a outra guarda, que recusa
uma releitura anterior ao acesso atual. Não se enfraqueceu nenhuma das duas.
Os ficheiros da recusa ficam em `portoes/c1c/tentativa-93f0477b/`.

Foi pedida uma decisão ao utilizador para conservar a entrada antiga e
reconstituir o acesso a que ela pertence pela história tipada da proveniência,
com plantas contra a falta da prova, o endereço errado, a data impossível e
a cadeia contraditória. A decisão está pendente. `c1c/paragem-dgal.json`
regista o caso e a proposta. Enquanto isto não se resolver, não se afirma que
os três portões passaram, que a travessia foi fechada ou que a aceitação
integral do C1c está satisfeita.


**Estado na paragem.** O `typecheck` completo passou a 0 em `93f0477b`,
independentemente da travessia. O `verify` completo não foi corrido: encontra a
mesma guarda antes das conferências de apresentação. Não há capturas finais
C1c nem se substituíram as capturas anteriores por imagens de uma construção
recusada. O captor está preparado para 25 recibos, nas duas edições e nas cinco
larguras, mais os cartões afetados. Estas partes continuam por concluir.

A medição preparatória leu 3 009 linhas e só encontrou as duas mudanças de
campo autorizadas: o valor da dívida europeia e o endereço da linha legal.
O detetor encontrou zero caminhos nos ficheiros atuais do construtor, com
sete conhecidos-positivos, incluindo o anfitrião retirado. Esta afirmação não
inclui a leitura a frio escrita pela direção nem apaga os exemplos que ficaram
no histórico antigo. A contagem exata dos ficheiros lidos acompanha a última
corrida em `medidas.json`, secção `C1c`.

**Todos os commits do ramo do sítio, até à cabeça medida.**

| Cabeça | Assunto |
| --- | --- |
| `ada78b694e4cc11975b3172c35a31917fcebfa6b` | C1: alinhar a dívida de Évora com o calendário dos mandatos |
| `28b17e2a2f283ef1b734be7a02f4012eea10f347` | C1: oferecer as medidas dos concelhos em ficheiro e preparar os rótulos |
| `005c4a2eb0c55cce1abd762b8c5538dbec7227ca` | C1: separar valores e explicar as leituras e as conferências |
| `d9ab0805ba9510df7ded6fa2350e65b35a0e8ab3` | C1: registar as três releituras iguais do PIB real por habitante |
| `7a7d2f8d43f46e4bb599987d2f25080ace880d9b` | C1: separar também as unidades nos cartões dos concelhos |
| `8656f66f838c31ec0ad63d58204df2edb5f90e91` | C1: fixar as palavras e preparar a medição da entrega |
| `3885a4e6180961ece14e54f03e46b0d3abbb2e6d` | C1: fechar os tipos do CSV e retirar a importação sem uso |
| `6c16c719f7bbc5164182ea5c62a51b656bf4fd43` | C1: entregar as provas das correções de confiança |
| `04ef76eb4ff04ac6110012934b76f9b7d0536b34` | C1: a resposta do construtor do Codex |
| `533fea9d40720e72c009e2aeb0d0ba72ad0d1feb` | Os dois memorandos de 28.09.2026 sobre o que os dados do projeto já dizem e como o mostrar (o Claude Opus 5.5 e o Codex gpt-6-astra, cada um por si a partir do mesmo pedido), com o pedido comum; a síntese do lugar de direção está no Drive do diretor |
| `b7f352ce253effe7d21dc97bacc1d9b67665e592` | C1c: a leitura a frio do C1 pelo Claude Opus 5.5 (cinco plantas em cinco) com o registo das plantas, a quinta redação das leituras (o objetivo do BCE no cartão do IHPC, dito como objetivo da zona do euro e não como veredicto), e o guião da passagem de correção para o Codex, com a atualização da dívida das famílias da União pelo circuito do enquadramento |
| `7d12f4ab3ff0247c0d81b42ddf64d2992dbd0f18` | C1c: atualizar a dívida europeia e repor as bandeiras e a origem legal |
| `0a9213f5798acd2ceae2bcb66b8163eccd26e00c` | C1c: dizer cada releitura e distinguir o valor encontrado do publicado |
| `feeb59754996ead2a31dff609a9a0000e99d5816` | C1c: sustentar o objetivo do BCE e explicar a dívida e o câmbio |
| `93f0477b213fb58ac113291bfbaaad3de1bed2ed` | C1c: conservar a nota no ficheiro e situar a dívida no fim do ano |

O commit que contém este relatório é a entrega das provas da paragem, filho
direto de `93f0477b213fb58ac113291bfbaaad3de1bed2ed`, e só muda a pasta das
medições do C1. Não é apresentado como uma entrega aprovada pelo `build`.
O seu identificador será dado na resposta da sessão, depois de existir.

**Todos os commits do ramo do motor.**

| Cabeça | Assunto |
| --- | --- |
| `3e83a271f4c5af0b1f6809436916c1b06d6e0b1c` | C1: reler dimensões do Eurostat pela coordenada selada |
| `cf1082be38dda1bf044f1fbfb9b258357faeb98a` | C1c: ler coordenadas e bandeiras e repetir o painel sem perder a tentativa |
| `ba47a125e68c9a87cc4bb5fae4524565bb413e7d` | C1c: alojar as respostas do gerador, do painel e das origens oficiais |

O motor ficou limpo em `ba47a125e68c9a87cc4bb5fae4524565bb413e7d`.
Os dois commits C1c passaram o pre-commit completo. A prova está em
`c1c/motor-entrega.json` e nos dois registos `c1c/motor-commit-*.log`.
