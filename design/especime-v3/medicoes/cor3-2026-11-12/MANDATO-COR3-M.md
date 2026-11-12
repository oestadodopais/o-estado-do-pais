# Mandato COR3, a passagem do motor: as correções julgadas de três estudos entram nos seus documentos e nos seus livros (12.11.2026)

Acrescenta: nada
Medidas: medidas-cor3.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `cor3-2026-11-12`; a outra pasta com escrita é a worktree do motor `cor3-2026-11-12`, e é nela que trabalhas nesta passagem. No sítio só escreves nesta pasta (o relatório, as medidas, os registos). A travessia para o sítio é a passagem seguinte, com mandato próprio, depois de o bloco RET1 aterrar. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas; não lances sessões auxiliares. Um commit no motor no fim de cada ponto numerado, com `OEDP_GATE=adiado` e o assunto a começar por `COR3`. O teu relatório vai para `RELATORIO-COR3-M.txt`, nesta pasta, com vinte linhas no máximo; as medidas e os registos para esta pasta (`medidas-do-construtor-cor3-m.json`, `cor3-m-conferencias/`), só os códigos e as últimas vinte linhas, sem caminhos da máquina.*

## Porquê

A 12.11.2026 uma auditoria por amostra, feita por outra família, leu os treze estudos publicados. Oito saem (o bloco RET1). Três ficam com correções nomeadas: o do Orçamento de 2027, o das penalizações por reforma antecipada e o da habitação. Para cada um, o Opus montou uma folha de correções com a frase de antes, a frase de depois e a prova de cada número; o lugar de direção decidiu cada uma; o Codex Astra julgou cada folha a `xhigh` contra as cópias das fontes, com cinco estragos plantados em cada, e apanhou os quinze. As três folhas decididas estão nesta pasta e são a única fonte das frases:

- `FOLHA-orcamento-decidida.md` (o estudo 27 do motor, `orcamento-2027-o-que-muda-e-para-quem` no sítio);
- `FOLHA-reforma-decidida.md` (o estudo 11, `penalizacoes-por-reforma-antecipada-2026`);
- `FOLHA-habitacao-decidida.md` (o estudo 28, com as linhas do estudo 23; `a-casa-em-portugal-e-na-europa`).

Tu não escreves frases nem escolhes números: instalas o que as folhas dizem, letra por letra, e provas que o que o motor compõe é o que foi julgado.

## §0 O que se mediu (as contagens e os resumos estão em `medidas-cor3.json`, com o comando de cada um)

1. **As correções por folha:** as contagens `correcoes_da_folha_do_orcamento`, `correcoes_da_folha_da_reforma` e `correcoes_da_folha_da_habitacao` das medidas, contadas pelos títulos de cada folha.
2. **Os documentos de partida** são os da cabeça do motor em que esta worktree nasceu; o resumo de cada um está nas medidas (`sha256_de_partida_…`). As linhas que as folhas citam são as desses ficheiros.
3. **Os corpos lidos a 12.11.2026** pela auditoria e pelas folhas estão em `indicators/out/cor3-2026-11-12/chegada/` na worktree do motor (uma pasta por estudo, com o registo dos pedidos de cada um). Essa pasta não se comita.

Outras medidas da mesma coisa: no estudo da habitação, o Eurostat publica a sobrecarga em dois conjuntos que diferem numa décima para Portugal, e a frase da C12 diz qual é o da página; o rácio preço-rendimento mudou de base na fonte, e as frases da C02, da C10 e da C20 passam a dizer a subida entre dois anos. No estudo do Orçamento, o Quadro 3.2 e o Quadro A1.1 do relatório dão montantes diferentes às mesmas medidas, e a C07 diz porquê. Estão ditas nas folhas, com a prova.

## O que fazes

1. **As fontes primeiro.** Cada corpo de que uma correção depende e que o estudo ainda não tem alojado entra na pasta `source/` do seu estudo pelo procedimento da casa, com o registo do pedido (o endereço, a hora, o resumo, o cliente; os da pasta de chegada foram pedidos com `curl` a 12.11.2026, e o registo di-lo). Onde a casa exigir o seu próprio cliente, pede outra vez com ele e confere que o valor de cada célula que a folha usa é o mesmo; se um valor diferir da folha, essa correção pára (ver «Quando paras»).

2. **O Orçamento (estudo 27).** As doze correções nos dois gabaritos, na forma «DEPOIS» de cada uma; a C10 sai da linha onde está e entra a seguir à citação do PCP, com a frase que diz o que o quadro mostra. As linhas novas do livro que a folha lista entram com o excerto conferido pelo conferidor do motor na cópia alojada; as duas âncoras do calendário selam-se outra vez contra a página nova do Parlamento; as linhas que a folha diz que saem deixam de ser usadas. Compõe as duas línguas.

3. **A reforma antecipada (estudo 11).** As nove correções no documento, pelo texto «antes» de cada uma (os números das linhas mudam depois da primeira); as linhas novas do livro que a folha lista; as notas das linhas do livro que a folha muda. O texto do cartão é do sítio e fica para a passagem seguinte.

4. **A habitação (estudo 28, com as linhas do estudo 23).** As vinte correções nos dois gabaritos, na forma «No gabarito» de cada uma. As linhas que a fonte reviu releem-se na mesma célula; as linhas novas entram com o excerto conferido; as que a fonte deixou de publicar retiram-se do texto; o título das duas linhas da notícia do Diário de Notícias passa ao que a folha diz, na linha do motor. Compõe as duas línguas.

5. **A prova de que o composto é o julgado.** Um guião nesta pasta (`conferir-composto-cor3.py`) lê as três folhas e os documentos compostos e confere, correção a correção e língua a língua, que a frase «depois» está no documento, inteira e uma só vez, e que a frase «antes» já não está; os espaços especiais dos números tratam-se como espaços. Duas plantas: uma frase «depois» com um algarismo trocado tem de falhar; uma frase «antes» reposta tem de falhar. O relatório diz as contagens.

6. **As conferências do motor** que os três estudos tocam, cada código lido de um ficheiro. O portão inteiro do motor corre-o o lugar de direção numa árvore limpa depois da tua passagem.

## O que fica como está, por decisão

Tudo o que as folhas não nomeiam, nos três estudos. O sítio inteiro, nesta passagem. Os outros estudos do motor e os ficheiros de outras corridas (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`).

## Quando paras

Numa correção cujo valor na fonte já não seja o da folha: paras essa correção, dizes o valor que leste e onde, e fazes as outras. Numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida: paras nesse ponto e dizes qual e porquê. Se uma frase da folha não couber no gabarito sem mudar uma palavra (um algarismo que o compositor recuse solto, um literal que não prenda a nenhuma linha): não a reescreves; dizes qual, o que o compositor recusa e a forma mais próxima que ele aceita, e este lugar decide. Para tudo o resto: decide, anota e continua.

## O fim

Os seis pontos, cada um no seu commit do motor (se o tempo não chegar, a ordem é a dos números), e o relatório: ponto a ponto o que ficou feito; por estudo, as correções instaladas e as que pararam; as linhas novas, as relidas e as retiradas; as contagens e as plantas do ponto 5; os códigos; o que ficou por correr fora da sandbox.
