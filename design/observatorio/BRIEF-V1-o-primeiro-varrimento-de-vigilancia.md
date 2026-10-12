# Brief V1 · o primeiro varrimento de vigilância: o Parlamento e o Diário da República, por guião diário, sem modelo (07.10.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 07.10.2026, pela §1.181 de `DECISIONS.md` (a direção do diretor de 07.10.2026: o projeto vigia o país continuamente e age sobre o que encontra) e pela secção 8 da carta dos conteúdos, a partir da pesquisa do Codex `gpt-6-astra` do mesmo dia, `design/observatorio/PESQUISA-vigilancia-2026-10-07.md` (lê-a inteira primeiro; o §6 é o primeiro passo que este brief adota, com as decisões abaixo). O construtor é o Codex `gpt-6-astra` em `high`, no motor; a leitura a frio é do Claude Opus 5.5 com cinco estragos plantados. Um bloco, uma mudança: o guião diário que lê três entradas de duas fontes primárias e escreve o índice do dia e o resumo que o modelo lê. Sem travessões na prosa.*

## 0 · O que se mede antes de construir

Na worktree do motor, antes de tocar em nada: `python3 -m core.gate` a 0 na cabeça de partida (`portao_inicial_do_motor`, o código que o construtor escreve em `portoes/inicial.codigo`); as decisões em vigor nos ficheiros que o bloco vai tocar (`python3 scripts/leituras/decisoes-em-vigor.py` do sítio sobre `core/http.py`, `.github/workflows/corredor.yml`, `.github/workflows/vigia.yml`); o que o cliente da casa (`core/http.py`, `HttpClient`, o agente `OEstadoDoPais/corredor`) já faz (pedidos condicionais, a soma de controlo do corpo, o registo do pedido) e o que o arquivo do corredor guarda, para o guião reutilizar e não duplicar. Os números do §0 escrevem-se no relatório por guião.

## 1 · O que o bloco é

Um pacote novo do motor, `vigilancia/`, com o guião `python3 -m vigilancia.diario`, que uma vez por dia lê três entradas de duas fontes primárias e escreve o índice do dia e o resumo. As três entradas, pela pesquisa (§1 e §6 do memorando):

1. **O Diário da Assembleia da República, I Série** (as sessões plenárias: o que cada deputado e cada membro do Governo disse, como ficou escrito), pelo catálogo dos dados abertos de parlamento.pt e pelas páginas da I Série, com o PDF de cada número alojado.
2. **As iniciativas legislativas** (os projetos e as propostas de lei, com o autor, a data e o estado), pelos dados abertos de parlamento.pt.
3. **O Diário da República, I Série**, pelo feed RSS de dre.pt (os atos publicados: o título, o emissor, a data, a ligação), com o texto do ato alojado quando o cliente da casa o ler sem JavaScript.

O que o guião faz em cada corrida, por esta ordem, como o §2 do memorando desenha: confere a política de acesso de cada entrada (o `robots.txt`, os termos lidos na pesquisa, registados no registo de fontes); consulta os índices com pedidos condicionais; descobre o que é novo e o que foi revisto, por identificador, ligação e conteúdo, percorrendo a paginação até ao último ponto conhecido; vai buscar o que é permitido com o `HttpClient` do motor e o agente da casa, nunca com identidade de navegador; arquiva os bytes antes de extrair (o pedido, a resposta, a data, os redirecionamentos, o sha256); escreve `vigilancia/indice/AAAA-MM-DD.json` e `vigilancia/resumo/AAAA-MM-DD.md`.

Cada entrada do índice: `fonte`, `tipo` (declaração, iniciativa, ato), `titulo`, `quem` (o autor ou o emissor, com o nome tal como consta do documento), `data_publicacao`, `data_recolha`, `ligacao`, `excerto` (as palavras do documento, até trezentos caracteres, com o localizador: a página do PDF, a âncora ou o parágrafo), `sha256`, `arquivo` (o caminho da cópia alojada), `direitos` (o que os termos permitem: ler, alojar, citar), `revisao` (se a entrada substitui outra, qual), `cobertura` (completa, parcial, com a razão). O resumo do dia é texto determinístico, gerado do índice, com menos de dois mil e quinhentos símbolos pelo contador do projeto: as contagens por fonte e por tipo, as entradas novas com o título, quem, a data e a ligação, as revisões e as falhas. O modelo lê o resumo; nunca corre dentro do guião.

## 2 · As regras do bloco

- **Zero símbolos de modelo no guião.** A rotina é código (a visão, §2; a §1.181 (c)).
- **Um erro nunca se lê como «sem novidades»** (o memorando, §2): uma fonte que falhou, um índice que não se leu ou um teto atingido ficam no índice e no resumo como falha ou cobertura parcial, com a razão.
- **Os tetos de uma corrida incremental** (o §6): trinta pedidos, dez megabytes, cinco minutos; o que excede fica em fila para a corrida seguinte, com a cobertura declarada. A primeira carga histórica fica fora do bloco: a primeira corrida lê só o que a fonte publica como corrente (o número mais recente da I Série, as iniciativas da legislatura em curso a partir da data da corrida, o feed do dia).
- **Os direitos ficam escritos por entrada** e o guião só aloja e só cita o que o registo de fontes permite; os dados abertos do Parlamento e o Diário da República são reutilizáveis com atribuição (confirmado na pesquisa; o guião regista a licença lida). Nenhum feed de imprensa neste bloco.
- **Nada pessoal além do que o documento público traz**: o nome de quem exerce o cargo, no seu ato, como o documento o escreve (a regra 5 do `CLAUDE.md`); nenhum dado de contacto, nenhuma pessoa privada.
- **Os ficheiros de outras corridas não se tocam** (a regra 11); o estado do guião vive em `vigilancia/estado.json`, seu.
- **A corrida do GitHub**: um trabalho novo no fluxo diário do motor (ao lado do corredor, sem reconstruir o sítio), dormente até a variável do repositório `VIGILANCIA_ARMADA` estar a `sim` (como `CORREDOR_ARMADO`); o vigia (`vigia.yml`) passa a observar também o estado deste guião; o fluxo escreve-se e prova-se em seco, e a corrida a sério fica para o diretor armar.
- **As plantas**, cinco, como auto-testes do pacote (`vigilancia/tests/`), cada uma a afirmar a mensagem pela qual falha: um excerto alterado contra o arquivo; a autoria trocada; a data errada; um corpo truncado; uma falha apresentada como vazio. O `python3 -m core.gate` corre-as.

## 3 · A entrega e as medidas de aceitação

1. Uma corrida a sério na máquina a 07 ou 08.10.2026, com os números lidos dos ficheiros que o guião escreve: os pedidos, os bytes, os minutos, as entradas por fonte e por tipo, as falhas; e uma segunda corrida no mesmo dia que não duplica nada e diz o que ficou igual.
2. O índice e o resumo desse dia, com pelo menos uma entrada de cada uma das três fontes, cada uma com o excerto localizado no documento alojado (a página do PDF ou a âncora), e o sha256 do arquivo igual ao dos bytes.
3. As cinco plantas a morder, com a mensagem de cada uma, na cabeça do código.
4. `python3 -m core.gate` a 0 na cabeça do código; o fluxo do GitHub validado em seco (o YAML lido pelo `actionlint` ou pelo validador que o motor já use); nenhum ficheiro de outra corrida tocado (`git status` nos caminhos da regra 11 vazio).
5. O `README.md` do pacote, em português, a dizer o que o guião lê, o que escreve, os tetos, os direitos e o que não faz; e a entrada do registo das melhorias proposta pelo construtor no relatório (o lugar de direção regista).
6. O relatório `design/especime-v3/medicoes/v1-2026-10-07/LEIA-ME.md` no sítio (a worktree do sítio é a segunda pasta com escrita do lançamento; só esse caminho se escreve lá), com os números por guião, o custo pela linha «tokens used» e as questões `V1-1`, `V1-2`, e assim por diante.

O que não está no bloco: as notícias e os sítios dos partidos (os termos, a listagem dinâmica), o portal do Governo (a listagem dinâmica, o bloco seguinte), o vídeo e a transcrição, os itens do painel e qualquer página do sítio (o bloco V2, pelo lugar de direção, a partir do primeiro resumo), o arquivo público das cópias (fica o arquivo do motor, privado, como no corredor).

## 4 · O custo

O custo-alvo é de trezentos mil símbolos (§1.177), em `high`; se o passar, o relatório di-lo e diz porquê. A leitura a frio pelo Opus em `xhigh`, porque o bloco toca fontes.
