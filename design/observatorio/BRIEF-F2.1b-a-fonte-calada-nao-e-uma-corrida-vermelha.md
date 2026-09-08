# Brief · F2.1b · a fonte calada não é uma corrida vermelha (07.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 07.09.2026, a partir das corridas 33944217675 (05.09) e 34011650247 (06.09) do corredor em `ensaio`, as duas vermelhas pela mesma causa, e da corrida 34083295445 (07.09), verde. Bloco pequeno do motor, fora da numeração do plano, dentro do F2.1 (uma semana de `ensaio` verde). Constrói o Opus numa worktree própria; lê a frio o Codex com plantas antes da fusão. Sem travessões na prosa.*

## O que aconteceu

Nas duas noites o INE não respondeu ao runner do GitHub: `ConnectTimeout` aos 90 s no primeiro endereço, o disjuntor por anfitrião abriu, e os outros dez endereços do INE ficaram escritos como ausência sem pedido (12 endereços sem resposta em 79, contando a DGCP, por `SSLError` desde 01.09). A fase 1 (perguntar e arquivar) acabou como o desenho manda: 79 de 79 pedidos, 0 com erro, 1 242 conferências compostas e adiadas. A fase 2 (os leitores) parou: o leitor `publisher.releitura_concelhos` pediu ele próprio ao INE as suas três fontes (`ine-populacao`, `ine-poder-de-compra`, `ine-empresas`), esperou 417,7 s pelos mesmos tempos esgotados, deu «inacessível» às três, contou-as como alarmes («3 alarme(s) sobre 8 fonte(s)») e saiu com 1; o corredor leu o 1 como «os leitores saíram com 1; nada se constrói e nada se empurra», a corrida ficou vermelha e o fluxo abriu as issues #3 e #4 no motor. A 07.09 o INE respondeu (200 em 0,56 s) e a mesma corrida foi verde em 3 m 37 s. Os números vêm dos artefactos `corredor-33944217675` e `corredor-34083295445` (`relatorio/corredor_report.json`, chaves `concelhos` e `anfitrioes_sem_resposta`).

## O que está errado, e o que não está

Não está errado que o corredor pare quando um leitor parte: a planta `leitor_partido.py` do provador existe para isso e fica. Está errado que **uma fonte calada seja lida como um leitor partido**. A regra da casa desde o F0.11 é que uma fonte que não responde é um estado («sem resposta desde dd.mm», com quem observou), e não uma falha; a fase 1 já o faz para os 79 endereços. O leitor dos concelhos junta no mesmo veredicto «inacessível» duas coisas diferentes: «o endereço não respondeu» (um estado da rede, que o corredor já sabe da fase 1) e «o índice do publicador já não nomeia o ficheiro» (uma mudança na fonte, que pára a releitura com razão). E paga duas vezes a espera: o disjuntor da fase 1 já tinha declarado o INE calado, e o leitor voltou a esperar 90 s por endereço.

## O que entra

1. **Dois veredictos onde havia um.** `sem resposta` (o endereço não respondeu, ou o anfitrião está calado para esta corrida) e `desapareceu` (o índice do publicador já não nomeia o ficheiro, ou o endereço respondeu com outra coisa que não o ficheiro). O primeiro é um estado: escreve-se no relatório do leitor com a hora e o anfitrião, e **não conta como alarme** para o código de saída. O segundo continua a ser alarme e a sair com 1, como `forma mudou` e `valor corrigido`. A docstring do leitor, que hoje diz «a source that disappears or changes shape STOPS the cycle», passa a dizer os dois casos.
2. **O leitor não espera pelo que o corredor já sabe.** O corredor passa ao leitor os anfitriões que a fase 1 declarou calados (uma opção nova, por exemplo `--anfitrioes-calados www.ine.pt`, lida da mesma estrutura que escreve `anfitrioes_sem_resposta` no relatório); para uma fonte cujo anfitrião está nessa lista o leitor escreve `sem resposta` sem um pedido e sem espera, e di-lo («calado desde <hora UTC>, declarado pelo corredor»). Sem a opção (o leitor corrido à mão) o comportamento é o de hoje: pede, e um tempo esgotado é `sem resposta`.
3. **O corredor diz o estado dos leitores** no relatório e no resumo da corrida: quantas fontes cada leitor viu, quantas `sem resposta`, quantas com alarme; uma corrida com os leitores a 0 e fontes caladas é verde e **parcial**, e o relatório di-lo pelo nome («parcial: o INE não respondeu ao runner»).
4. **O carimbo não ganha regra nova.** Uma corrida verde com anfitriões calados escreve as reconferências das linhas que responderam e o estado das que não (é o que a corrida de 07.09 fez com a DGCP), e o carimbo do cabeçalho segue a regra que o corredor já tem para anfitriões calados. Se essa regra for ambígua para o caso «um anfitrião de 931 linhas calado», o construtor escreve-a por extenso no relatório, com o troço do código que a decide, e deixa a decisão ao lugar de direção sem a implementar.
5. **Os provadores.** Conhecidos-positivos no `--provar` do leitor e no do corredor: uma fonte calada dá `sem resposta` e código 0; um índice que deixou de nomear o ficheiro dá `desapareceu` e código 1; a lista de anfitriões calados evita o pedido (0 pedidos ao anfitrião calado, contados); o leitor partido (código 3) continua a parar a corrida. O chão do `core.gate` sobe pelo número de conferências novas.
6. **As issues #3 e #4** do motor fecham-se com um comentário que aponta a esta correção, pelo lugar de direção e não pelo construtor.

## As medidas de aceitação (escritas antes)

- Com o INE marcado como calado (a opção nova) e sem rede para o INE, o leitor dos concelhos sai com 0, escreve `sem resposta` nas três fontes do INE e faz 0 pedidos ao INE, contados; as outras cinco fontes têm o veredicto de sempre.
- O mesmo leitor, com um índice da DGAL alterado para não nomear o ficheiro (planta do `--provar`), sai com 1 com `desapareceu`.
- `python3 -m core.gate` a 0; o provador do corredor com o leitor partido ainda a parar a corrida; o chão das conferências subido.
- Um `ensaio` no GitHub depois da fusão (despachado pelo lugar de direção, com o motivo escrito) verde, ou vermelho por outra causa dita pelo nome.
- Nenhum pedido à rede sai do portátil do construtor neste bloco: as fontes não se pedem para provar isto; as cópias, o `--offline` e as plantas chegam. Se o construtor achar que precisa de um pedido, pára e diz porquê.
- Nenhum número no relatório sem o comando que o mediu; prosa em português, sem travessões.

## O que não entra

O leitor dos concelhos a ler os corpos do arquivo da corrida em vez de pedir outra vez (é a forma certa e é um bloco M, que fica apontado para o F2.7); o vigia; qualquer mudança à política do §4 da frescura; o `corredor.yml` fora do que o ponto 2 exigir para passar a lista ao leitor.
