# RP4 · o gráfico das séries

Implementação construída nesta worktree, no ramo `rp4-2026-10-04`. Modelo confirmado no registo: `gpt-6-astra`. Sem push. O pacote destina-se à leitura a frio; não foi publicado.

## O ponto de partida

O §0 foi reproduzido antes das alterações, pelo guião do brief, e bate byte a byte com `BRIEF-RP4.json`. A reprodução está em `brief-reproduzido.json`; o resumo e o conhecido-positivo estão em `medidas.json`. O guião lê a cabeça histórica `905105b7`, não a cabeça inicial desta worktree.

O contador do §0 confunde pontos com lacunas: a expressão `^  - periodo:` também conta os períodos da lista de lacunas. Tanto a cabeça histórica como a cabeça recebida, `61519cea8c93badd0a049b8993790e4dfec46637`, têm 4 131 pontos e 2 lacunas. A soma dá os 4 133 que o brief chama pontos. `medidas.json` conserva a leitura do YAML nas duas cabeças e uma amostra que reproduz o erro do contador. Não se perderam pontos entre elas. O brief selado fica intacto; a correção da sua medida fica indicada para o lugar de direção.

A entrega conserva os 4 131 pontos em 16 séries no tempo. Há 0 ficheiros alterados no livro e no leitor central das séries, medidos contra a cabeça recebida.

## O mandato, ponto a ponto

| Ponto | Resultado | Medida e prova |
|---|---|---|
| 1 · módulo | A série inteira, determinística, com quebra nas lacunas; eixo único e base comum escrita no módulo. | 9 provas do módulo passam, incluindo uma escala de coordenadas conhecidas. `plantas.json`. |
| 2 · componente | SVG estático, título por extenso, nomes da casa, só marcas da escala com algarismos, estilos da casa. | 56 desenhos recompostos. HTML e F21 a 0. `geometria-e-tabelas.json`. |
| 3 · cartões | Todos os cartões presos mostram a série depois do valor e abrem o recibo na língua da página. | 7 linhas distintas em PT e 7 em EN; 8 de 8 plantas da K20 mordem. |
| 4 · recibos | Gráfico antes da tabela anual, datas completas acessíveis, bandeiras e lacunas conservadas. A tabela desloca-se dentro da página e responde ao teclado. | 32 recibos; IPC com 944 pontos, 79 anos e 12 colunas de períodos por edição. S6 a 0. |
| 5 · geometria | F21 recompõe segmentos, marcas, posições, título e forma estática; F2 lê também o SVG que é raiz. Lista fechada mantida. | 14 de 14 plantas mordem, sobre cadeias em memória. Nenhuma escreve no `dist/`. |
| 6 · primeira página | A declaração do bloco dos preços escolhe a série da inflação; barras e série partilham o contentor. Série inexistente ou de países é recusada. | 8 de 8 plantas próprias mordem; célula da primeira página a 0. |
| 7 · índice | Salário mínimo semestral e IPC mensal provados com base comum no período que contém janeiro de 2015. Base ausente ou nula é recusada. | 0 páginas usam o modo indexado. A prova compara a posição da base das séries com a marca de cem. |
| 8 · registos | Mapa, cadeias PT/EN, inventário das frases, inventário dos rótulos e as questões I195 e I196 atualizados. Guiões e testemunhas nesta pasta. | 60 capturas em 2 edições e nas larguras 390, 768, 1 024, 1 280, 1 600 px; 0 transbordos ou marcas fora do desenho. |

## A diferença entre linhas e cartões

A linha `ihpc-variacao-homologa-ue` tinha série e nome, mas aparecia apenas como comparação. Não tinha cartão nem leitura declarada. O pacote acrescenta o cartão a Preços, ao lado do IHPC de Portugal, para cumprir a presença exigida pelo brief. A leitura nova, nas cadeias da casa, reutiliza os ramos do sinal do IHPC; o âmbito europeu apoia-se no excerto da própria linha. A K17 confere as palavras e os literais. A unidade explicita a variação anual e cita o literal da própria linha. Esta escolha fica destacada para revisão editorial a frio.

A E2 conserva o catálogo nacional e acrescenta explicitamente a comparação europeia. As plantas apagam esse cartão e acrescentam outro fora do catálogo. A S5 exige o último ponto também nos cartões das páginas de assunto. Não se inscreveu uma medida europeia num domínio português para a fazer passar.

## Onde vivem os cartões e as capturas

| Linha | Páginas construídas |
|---|---|
| `beneficiarios-do-rsi-por-mil-2024` | `/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/pay-pensions-and-benefits/`, `/salarios-pensoes-e-apoios/` |
| `ihpc-variacao-homologa-ue` | `/en/prices/`, `/precos/` |
| `ipc-alimentacao-variacao-homologa` | `/en/prices/`, `/precos/` |
| `ipc-variacao-homologa` | `/en/prices/`, `/precos/` |
| `linha-de-risco-de-pobreza-2025` | `/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/pay-pensions-and-benefits/`, `/salarios-pensoes-e-apoios/` |
| `pensao-media-anual-2025` | `/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/pay-pensions-and-benefits/`, `/salarios-pensoes-e-apoios/` |
| `remuneracao-bruta-mensal-media` | `/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/areas/trabalho-solidariedade-e-seguranca-social/`, `/en/pay-pensions-and-benefits/`, `/salarios-pensoes-e-apoios/` |

As capturas de página inteira estão em `design/especime-v3/capturas/rp4-2026-10-04/`. Incluem as páginas acima, a primeira página e os recibos de `serie-ipc-indice` e `serie-pensao-media-anual`, em cada largura e língua. `capturas.json` regista a cabeça construída, dimensão da página, posições dos desenhos, tamanho efetivo das letras dos eixos, tabela, resumo dos bytes e cada ficheiro. A prova do contentor retira o posicionamento das datas acessíveis e vê a página alargar; a cópia íntegra não alarga. Os recortes de gráficos, cartões e tabelas foram lidos visualmente.

## As plantas

| Família | Estrago | O que morde |
|---|---|---|
| geometria | ponto deslocado | F21 · coordenadas ou identidade dos segmentos diferem do livro |
| geometria | marca trocada | F21 · marcas do eixo valor diferem da recomposição |
| geometria | série trocada | F21 · coordenadas ou identidade dos segmentos diferem do livro |
| geometria | guião no desenho | F21 · guião ou animação no desenho estático |
| geometria | traço transformado | F21 · elemento ou atributo que altera a forma estática |
| geometria | traço escondido por classe | F21 · classe do traço alterada |
| geometria | algarismo fora da escala | F21 · geometria ou texto acrescentado fora da escala |
| cartoes | cartão sem série a desenhar | K20 · ipc-variacao-media-12-meses: cartão sem série a desenhar |
| cartoes | gráfico retirado | K20 · ipc-variacao-homologa: falta o desenho da série da linha |
| cartoes | porta noutra edição | K20 · ipc-variacao-homologa: porta para outro recibo ou edição |
| cartoes | gráfico depois da leitura | K20 · ipc-variacao-homologa: gráfico fora do lugar depois do valor |
| primeira | série inexistente | livro-razão: a série «serie-inexistente» não existe em ledger/series/. |
| primeira | série de países | primeira página: a série do bloco não é uma série no tempo. |
| primeira | gráfico retirado do bloco | RP4 · falta a série da inflação no bloco dos preços |
| primeira | gráfico fora da coluna das barras | RP4 · barras e série fora do mesmo contentor |
| G5 | Preenchimento preto nas guias da série | A paleta recusa a cor predefinida fora das fichas da casa; a cópia íntegra declara as guias sem preenchimento. |
| S5 | um cartão com outro valor do que o ponto | não são o ponto da série |
| S5 | um cartão desfasado: a série tem um ponto mais novo | o cartão está desfasado da série |
| S5 | o novo cartão da União desfasado da sua série | o cartão está desfasado da série |
| S6 | um valor trocado na tabela | a linha 1 da tabela diz |
| S6 | um ponto tirado da tabela | ponto em falta |
| S6 | duas colunas trocadas | célula não está na coluna |
| S6 | uma lacuna apagada da tabela anual | lacuna não é a declarada |
| S6 | um algarismo solto na tabela | algarismos fora das origens admitidas |
| S6 | as duas edições com valores diferentes | a linha 1 da tabela diz |
| S6 | o período escrito fora da regra da casa | a linha 1 da tabela diz |
| capturas | série fora da coluna das barras | A série deixa de ficar alinhada por baixo das barras. |
| capturas | letras dos eixos reduzidas | A escala efetiva do texto desce abaixo do limiar das capturas. |
| capturas | datas acessíveis fora do contentor da tabela | A página transborda quando se retira o contentor posicionado. |

As plantas das séries morderam 20 de 20. Os controlos íntegros e os resultados individuais estão em `series.json`, `plantas.json`, `primeira.json` e `capturas.json`. A metade da S3 que precisa dos corpos do motor não correu, porque este bloco é do sítio; a prova sintética correu. Não houve escrita no motor.

## Os portões e os commits

Cabeça do código conferida: `7c3e6672e6cb264f38c21d0bbb1512acc9cdc802`. `portoes/cabeca` e `portoes/cabeca.fim` coincidem. Os códigos abaixo foram lidos dos ficheiros, depois de cada processo acabar, e não de uma cadeia com cano.

| Portão | Código lido | Segundos |
|---|---|---|
| `build` | 0 | 165 |
| `verify` | 0 | 992 |
| `typecheck` | 0 | 0 |

As durações usam a resolução dos carimbos de início e fim. A conferência de tipos começou e acabou dentro do mesmo segundo.

Comando: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4-2026-10-04/portoes`. As conferências intermédias limitaram-se às partes alteradas. Os registos dos portões foram limpos dos caminhos pessoais pelo guião desta pasta. As corridas anteriores interrompidas para corrigir a unidade e a apresentação ficam identificadas em `corridas-interrompidas.json`; não contam como prova verde. A corrida vermelha completa está em `corrida-vermelha.json`: a G5 encontrou o preenchimento preto predefinido das guias do SVG. A folha passou a declarar as guias sem preenchimento, sem mudar a régua da paleta. A planta que repõe o preto morde na mesma G5; o resultado está em `paleta-e-geometria.json`.

Commits de código:

- `7c3e6672e6cb264f38c21d0bbb1512acc9cdc802` · RP4: declarar as guias sem preenchimento e provar a paleta
- `6ff550de4cb33597a53cb3be8c75606abb02ae21` · RP4: conservar a legibilidade dos eixos nos cartões estreitos
- `7f02e3d9fd1d09f89980dd7685fb098caf4cc931` · RP4: declarar a unidade europeia e manter a série sob as barras
- `3565635afc26d3dfd6210e92abda7b8fd6b232bc` · RP4: desenhar as séries inteiras e dobrar os recibos por anos

O commit seguinte contém apenas esta pasta de medições e a pasta das capturas. A sua cabeça fica identificada na resposta de entrega, evitando uma referência impossível ao resumo do próprio commit dentro dele.

## Custo e trabalho por fechar

Modelo lido do registo: `gpt-6-astra`. Tempo observado até `2026-10-05T00:13:45.676484+00:00`: 7 060 segundos. `custo.json` conserva o instante e o último evento de uso da sessão.

Símbolos pela linha final `tokens used`: **[verify]**. O lançador só emite essa linha quando esta sessão termina. Não existe ainda no registo lido pelo guião; a telemetria cumulativa disponível fica em `custo.json` e não é apresentada como a linha final. Esta é a medição por fechar depois da saída do processo, por `custo-e-higiene.py <registo> <sessão>`.

Ficam a leitura a frio do pacote, incluindo a escolha editorial do cartão europeu, a correção do contador do §0 pelo lugar de direção e a medição final do custo após terminar o processo. Não houve alteração de séries, de valores de linhas, de fontes, de estudos, do menu, do rodapé ou dos cartões de partilha. O motor e o trabalho RP4-m ficam fora deste bloco.

O guião geral `estado.py`, pedido pelo contexto do projeto no fecho, não conseguiu as leituras remotas na sandbox. A sua tentativa interna de `git fetch` no motor foi recusada antes da escrita e não foi repetida com mais permissões. Esta entrega não declara o estado remoto, uma publicação ou uma corrida da CI.

Reprodução das medidas: `node design/especime-v3/medicoes/rp4-2026-10-04/medir.mjs`. Cada medida em `medidas.json` traz o comando e o conhecido-positivo. A conferência dos números do relatório usa `python3 scripts/leituras/conferir-relatorio.py <relatório> <pasta>`; o resultado fica em `conferencia-relatorio.json` e no respetivo ficheiro de código.

## RP4-b

Passagem de 05.10.2026, pelo mandato de direção depois da leitura a frio. O registo acima conserva a primeira entrega. Esta secção substitui a decisão do cartão europeu e identifica as provas refeitas nesta passagem. A I196 continua fechada: o brief corrigido mede a cabeça histórica `905105b7`.

A decisão da antiga I195 do RP4, agora I197, está implementada em `2348c727`. O cartão `ihpc-variacao-homologa` desenha a série da linha europeia que a sua régua mostra, com «União Europeia» e a porta para o recibo europeu na edição da página. A regra abrange a série própria e a série da comparação declarada. Saíram o cartão europeu autónomo, a leitura, a sua auditoria e a unidade que só ele usava. A E2 voltou ao catálogo nacional. As cadeias globais do desenho continuam em uso nos recibos; nenhuma delas era exclusiva do cartão retirado.

As conferências intermédias do cartão, das séries, das entradas, da voz e dos tipos passaram. As plantas da K20 incluem um cartão sem série própria nem comparação com série, a ausência da série própria, a ausência da comparação, a troca da série, da legenda e da porta, a ordem e um cartão com ambas as séries. A S5 continua a recusar uma comparação europeia desfasada. Os registos `rp4-b-cartao.json`, `rp4-b-series.json` e `rp4-b-entradas.json` guardam os controlos e as mordidas; estas conferências não substituem os portões finais.

A leitura e o registo das plantas chegaram durante a espera, antes do rebase. A espera e cada conferência ficam em `rp4-b-espera.json`. Os achados foram lidos por inteiro; as correções reais seguintes estão em `65067f6b`, antes do rebase. Os códigos finais e as cabeças após o rebase serão fechados antes da entrega. O custo parcial é lido da sessão por `custo-rp4-b.py`; a linha final `tokens used` só fica disponível depois de o lançador terminar.


| Achado, pela ordem da leitura | Resposta RP4-b | Prova |
|---|---|---|
| 1 · F21 filtrada | Planta P2, ausente do ramo. A chamada conserva todos os erros. | Resumo da fonte recebida contra o original, em `rp4-b-plantas-da-leitura.json`; F21 nos portões finais. |
| 2 · primeiro ponto deslocado | Planta P5, só na cópia do HTML. O desenho entregue é recomposto. | F21 sobre as duas edições construídas. |
| 3 · série dos alimentos na primeira página | Planta P3, ausente do ramo. Mantém-se a série da inflação. | Resumo do original e célula da primeira página. |
| 4 · lacunas interpoladas | Planta P1, ausente do ramo. Mantém-se a quebra. | Resumo do original e prova da lacuna no módulo. |
| 5 · contagem falsa das plantas | Planta P4, ausente do relatório recebido. | Resumo do relatório original e contagens das plantas medidas nesta passagem. |
| 6 · cartão europeu repetido | Sai o cartão autónomo. O cartão da comparação desenha a linha europeia, identificada e com o seu recibo. I197 fechada. | K20, E2 e S5, com controlos íntegros e plantas. |
| 7 · unidade ausente na primeira página | A unidade visível vem da declaração do cartão da linha presa à série. A célula dos blocos confere-a também na corrida da voz. Os recibos conservam nome e unidade visíveis no cabeçalho. | Plantas da unidade retirada e trocada; voz e primeira página. |
| 8 · gráficos e eixos demasiado grandes | A largura máxima de cada SVG é a largura do seu `viewBox`, sem múltiplo. As capturas passam a medir o mínimo e o máximo das letras e a recusar fora do intervalo decidido. | Planta da largura máxima retirada; medidas de cada captura. |
| 9 · ponto isolado invisível | Um segmento de um ponto rende um círculo. A F21 recompõe o centro, o raio e a identidade. | Série sintética com um ponto entre lacunas; a forma antiga deixa de contar como segmento visível e é recusada pela F21. |
| 10 · uma base ausente impede todas as séries | A linha sem base ou com base nula fica fora, com nome e razão na legenda. Só se recusa o desenho quando nenhuma linha tem base utilizável. | Provas de exclusão parcial, base nula e ausência de todas as bases; planta da legenda retirada. Nenhuma página usa o modo indexado. |
| 11 · títulos acessíveis | Artigos nos trimestres e semestres portugueses; conversor próprio para anos ingleses. Na primeira página o título diz período e unidade, sem repetir o nome visível. | Casos conhecidos do conversor e recomposição dos títulos pela F21. |
| 12 · provas antigas ou ausentes do pacote | O inventário dos rótulos será regenerado sobre a construção final, com o carimbo dessa cabeça. A corrida inteira após o rebase cobre o brief corrigido. O custo parcial declara a sua origem e o limite da linha final. | Inventário, `check:briefs`, portões, capturas das duas edições e `custo-rp4-b.json`. Os outros pontos são limites do pacote recebido. |
| 13 · coordenadas recompostas pelo leitor | Conservada a recomposição de toda a geometria. | F21. |
| 14 · composição dos desenhos | Recontada na corrida final, depois da mudança de lugar da série europeia. | Saída F21 dos portões. |
| 15 · pontos, colunas e bandeiras dos recibos | Conservados. | S6 e capturas dos recibos. |
| 16 · séries dos cartões | A regra passa a abranger a linha própria e a comparação declarada. | K20 nas duas edições; S5 para o último ponto. |
| 17 · só algarismos de escala | Conservado; os títulos e as legendas de exclusão continuam por extenso. | F2 e F21. |
| 18 · códigos, cabeças e higiene | Provas refeitas na cabeça posterior ao rebase. | Ficheiros dos portões e conferência de higiene. |
| 19 · números do relatório e I196 | I196 conservada fechada. As contagens desta passagem saem das novas provas. | `conferir-relatorio.py` e JSON das medições. |
| 20 · bases indexadas e SVG como raiz | Conservados, com a exclusão parcial acrescentada. | Provas do módulo, F2 e F21. |
