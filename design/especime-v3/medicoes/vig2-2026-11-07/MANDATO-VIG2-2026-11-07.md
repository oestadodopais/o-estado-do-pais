# Mandato VIG2: o resumo da vigilância em partes depois de uma paragem (escrito a 07.11.2026)

Acrescenta: nada
Medidas: medidas-vig2.json

*Escrito pelo lugar de direção (Claude Opus 5.5, pela palavra do financiador de 02.11.2026). O construtor é o Codex `gpt-6-astra` (`high`), sem rede: o motor na worktree `vig2-2026-11-07`, a partir do `master` aterrado; o sítio na worktree `vig2-2026-11-07`, a partir de `main` aterrado, só para o relatório e as medições. A vigilância diária é a fonte dos itens diários, que começam a 09.11.2026 (§1.229, 9 e 10); não corre desde 12.10.2026.*

## §0 Medido (07.11.2026, por este lugar, por guião, com os guiões de `design/especime-v3/medicoes/vig2-2026-11-07/` no sítio)

- A última corrida no `master` do motor é a de 12.10.2026 (`vigilancia/indice/2026-10-12.json`). O trabalho `vigilancia` do fluxo diário salta sem `VIGILANCIA_ARMADA`, que é do financiador; até lá, o lugar de direção corre a vigilância à mão no arranque de cada sessão.
- A corrida à mão de 06.11.2026 recusou: «designações, razões e cabeçalhos DAR excedem o limite do resumo; nenhum omitido em silêncio». A recusa vem de `detalhes_resumo` (`vigilancia/diario.py`), que `executar` chama antes de escrever o índice, o resumo, o recibo e o estado: uma corrida recusada perde também o que leu.
- Uma corrida de medida a 07.11.2026, numa cópia dos dados e com o limite levantado (`medir-resumo.py`): 5 101 entradas novas (5 096 declarações em 8 números do DAR, de 01.10 a 22.10.2026, e 5 atos do Diário da República de 06.11.2026), 26 pedidos, 108 segundos, uma falha (as iniciativas, `ReadTimeout`); o resumo inteiro teria 17 639 bytes. O resumo mínimo (as designações, as razões e os cabeçalhos do DAR), medido pela própria função cortada no ponto da recusa (`minimo-do-resumo.py`), tem 2 135 bytes sobre o índice de 07.11 e 1 475 sobre o de 12.10. O limite é de 2 500 bytes (`len(texto.encode())`). Depois de uma paragem, o mínimo fica perto do limite, e um número do DAR a mais ou uma razão de falha mais longa passam-no: foi o que aconteceu a 06.11.

## §1 O que fazes, no motor

1. **As partes.** Quando o resumo mínimo passa do limite, `detalhes_resumo` deixa de recusar e devolve o resumo em partes numeradas, cada uma abaixo do limite: a primeira com as linhas comuns (o dia, a corrida, as contagens, o estado e a razão de cada fonte) e a frase «Parte 1 de N; as outras em resumo/<dia>-2.md e seguintes.»; as outras com «Parte k de N.» e as designações e os cabeçalhos do DAR que lá cabem, pela ordem de prioridade que o resumo já tem (os atos, as iniciativas, os números do DAR), cada designação numa parte só, nenhuma omitida; as linhas de arrumação na última. Depois das designações, as descrições e os nomes dos oradores entram como hoje, até ao limite de cada parte, com a contagem do que ficou no índice.
2. **A escrita.** A primeira parte escreve-se em `resumo/<dia>.md`, como hoje; as seguintes em `resumo/<dia>-2.md`, `resumo/<dia>-3.md`, …; o recibo da corrida diz o número de partes e os bytes de cada uma (`r["resumo"]["partes"]`). Uma linha sozinha acima do limite continua a ser recusa.
3. **Quando o mínimo cabe**, o resumo é um só e sai byte a byte igual ao de hoje.
4. **A verificação.** `verificar.py` confere, quando há partes, que cada uma está abaixo do limite, que a união das designações é a das entradas da corrida, sem repetição, e que a primeira diz o número certo de partes.
5. **As provas** em `vigilancia/tests`, no `core.gate`: uma acumulação sintética cujo mínimo passa do limite dá partes, cada uma abaixo dele, com todas as designações; uma designação tirada de uma parte, vermelho; uma parte acima do limite, vermelho; a primeira parte com o número errado de partes, vermelho; e, sobre o índice de 12.10.2026 do repositório, o resumo de uma parte igual byte a byte ao de antes. As cinco plantas que já existem continuam a morder.

## §2 O que não muda

As fontes, o registo das permissões, os tetos de pedidos, de bytes e de tempo, o índice, o estado, os recibos fora do campo das partes, a regra «uma fonte ilegível nunca significa sem novidades», e o limite de 2 500 bytes por parte.

## §3 Quando paras

Se uma das provas só passar com um limite mais largo ou com uma designação omitida; se a mudança tocar um ficheiro de outra corrida (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`).

## §4 O fim

`python3 -m vigilancia.tests` e `python3 -m core.gate` com os códigos (o gate uma vez, no fim); as cinco provas novas com os códigos; e, no relatório, por um comando só, o resumo em partes sobre o índice de 07.11 da medida (a cópia dos dados é do lugar de direção; reconstróis o índice sintético que a prova usa e dizes as partes e os bytes). Os commits do motor pelo `comitar.sh` (com `OEDP_GATE=adiado`), com o `Co-Authored-By` e o assunto a começar por `VIG2`; o relatório e as medições no sítio, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`. Quarenta e cinco minutos, oitenta chamadas.
