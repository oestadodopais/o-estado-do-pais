# As leituras do RET1 (13.11.2026)

*Registo do lugar de direção (Claude Fable 5.2). O construtor foi o Codex `gpt-6-astra`; quem leu foi sempre outra família. As plantas de cada pacote estão ao lado, com o sha256 de cada cópia antes e depois (`leitura-ret1-fria.plantas.json`, `leitura-ret1-curta.plantas.json`); cada estrago foi conferido falso contra o mandato e os dados antes de entrar.*

## Antes do bloco: as auditorias por amostra

Nove leituras do Claude Opus 5.5 a `xhigh`, uma por estudo, a 12.11.2026: trinta números contra a fonte, as conclusões frase a frase, as pessoas nomeadas. Seis estudos com o veredicto de sair e três com o de ficar com correções nomeadas. As saídas ficaram fora do repositório, com os corpos das fontes que cada leitura foi buscar.

## A leitura a frio

Claude Opus 5.5 (`leitor`), a `high`, 244 mil símbolos e 54 chamadas. **Cinco plantas em cinco.** O índice de cada ficheiro tinha sido tirado do diff, e mesmo assim o leitor achou os ficheiros mexidos por um caminho mecânico: refez o lado novo de cada pedaço do diff e comparou-o com a cópia. Depois julgou cada estrago pelo que faz, e disse de quatro que os testes do bloco os apanhavam e de um que nenhum o apanhava.

- RT-P1: um retirado cujo objeto é uma região ia para o índice dos estudos;
- RT-P2: a razão em inglês da contagem de Évora dizia três estudos, e saíram dois;
- RT-P3: um retirado com vários sucessores publicados ia para o primeiro (nenhum teste do bloco o apanhava);
- RT-P4: a função que reconhece o endereço de um estudo retirado ficava invertida;
- RT-P5: a razão em português da contagem dos estudos dizia 12.11.2026.

Fora das plantas, um Blocking, cinco Major e onze Minor. O que este lugar fez de cada um:

- **Blocking: a página de Évora dizia, duas vezes em cada língua, que a repartição dos pelouros «está no estudo de quem governou a câmara», que sai com este bloco.** Confirmado em `src/data/municipios.mjs`. Este lugar mediu a classe no texto visível das 9 788 páginas construídas: só essa frase, nas duas línguas. A adenda A troca-a pela ausência exata e fecha a classe por régua.
- **Major: a frase da história dizia «uma auditoria» e foram duas.** A frase era deste lugar; passou ao plural. O leitor duvidou também de que as duas auditorias tivessem achado erros em todos os oito: acharam, e o mandato é que o dizia de menos em dois deles.
- **Major: quatro réguas ou amostras mais fracas** (a planta da moldura trocada de motivo; a paridade dos gráficos a passar com zero estudos; três amostras do detetor sem a sua classe; uma amostra do texto duplicada). Repostas na adenda A.
- **Minor: a regra do destino sem o caso de dois sucessores publicados.** Entrou na adenda A, com a planta.
- **Minor: a contagem das linhas dos oito no mandato estava curta** (64, e são 81): o guião de medição deste lugar só lia `study:` entre aspas. O construtor mediu por si; fica uma linha na `GARGALOS.md`.
- **Minor: quem chega por um endereço antigo não percebe porquê.** Pedido na adenda A, se o tempo chegasse.
- Os outros Minor estão no `ISSUES.md`, de RET1-1 em diante.

## As três adendas

A adenda A fez o que a leitura a frio pediu, e acrescentou a razão datada ao pé das contagens no índice dos estudos e na página de Évora. Ao rever a passagem, este lugar mediu o que a sua primeira medição tinha saltado, as páginas dos cinco estudos que ficam: dois deles remetiam, no texto julgado, para estudos que saem. A adenda B tirou as duas unidades no motor, atravessou os dois estudos e pôs a régua das remissões a ler todas as páginas. A régua deu então vinte recusas, que este lugar leu uma a uma: mais uma frase «Ver também» no estudo de Évora 2027, que ninguém tinha visto; o nome de uma medida tomado pelo título de um estudo; e o endereço de uma edição arquivada de um estudo retirado, impresso em seis recibos. A adenda C fechou os três géneros, e a régua, corrida por este lugar sobre a construção inteira, dá zero.

## A leitura curta das três adendas

Claude Opus 5.5 (`leitor`), a `high`, 205 mil símbolos e 56 chamadas, sobre o diff das três adendas no sítio e no motor. **Cinco plantas em cinco, desta vez pelo que fazem:** cada estrago foi posto no ficheiro e na linha correspondente do diff (`plantar_com_diff.py`, fora do repositório, que chama o `plantar.py` da casa), e o leitor disse de cada um que teste do bloco o apanhava.

- SC-P1: a entrada do registo das correções do estudo das contas com a data do dia anterior;
- SC-P2: a razão em inglês da contagem outra vez com «an audit»;
- SC-P3: a régua das remissões a isentar as páginas dos concelhos;
- SC-P4: o bloco do endereço do recibo invertido;
- SC-P5: a alcunha portuguesa do estudo de quem governou por declarar.

Fora das plantas, nenhum Blocking e nenhum Major; sete Minor, no `ISSUES.md` de RET1-7 em diante. O leitor confirmou: as frases dos mandatos letra por letra nas páginas construídas; nos dois estudos só saiu o que os mandatos dizem, com os livros iguais; as duas páginas leem-se bem depois do corte; a razão datada lê-se da linha. A leitura cruzada das duas frases novas do inventário da voz (a linha `ret1-a`) fica feita por esta leitura.

## O fecho

A lista inteira do `verify` correu por guião sobre a cabeça `9ff97339d`, com o `build`: 72 passos, nenhum vermelho. Depois das adendas A, B e C correu outra vez inteira na cabeça final `b421daa1c`: 72 passos, nenhum vermelho; a régua das remissões, corrida por este lugar sobre essa construção, dá zero recusas. No motor, que só mudou nas adendas B e C (três cortes no texto julgado de dois estudos), o portão inteiro passou numa árvore limpa na cabeça `e31cc9b`.
