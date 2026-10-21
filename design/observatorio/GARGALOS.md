# Os gargalos · o registo vivo do tempo e do custo

*Criado a 21.10.2026 pela decisão do financiador (§1.202): cada sessão lê este registo no arranque, acrescenta o que mediu e decide pelo menos um corte por semana na revisão de sexta-feira. Cada entrada tem a medida (de onde veio o número), o plano e o resultado quando houver. Sem travessões.*

## Abertos

| Gargalo | Medida | Plano | Estado |
|---|---|---|---|
| A corrida inteira dos portões dentro do ciclo do construtor | HB1-b: 588 chamadas, 69 M de símbolos de entrada, oito corridas de portões numa passagem (21.10, o registo do lançador) | O orçamento de uma passagem no prompt comum (uma corrida no máximo, só na aterragem) e o teto de 75 minutos; depois, o lançador corre as conferências fora do ciclo do modelo e devolve só os códigos | o prompt e o teto em main desde 21.10 (eeeec01d4); o lançador a mudar |
| As correções nascidas de frases do mandato não medidas | metade das passagens de correção de 20 e 21.10 (V2-e-d, V2-e-e, os três Blocking da HB1-b, o «dez linhas» da EO1-d) | o guião de medição antes do mandato (ordinais, causas, contagens, datas); uma frase devolvida nunca se imprime | regra no CLAUDE.md; o guião por fazer |
| O pre-commit do motor por commit | `core.gate` ≈ 12 minutos por commit; dois commits para uma frase (21.10, 07:5x e 08:1x) | correr uma vez por aterragem (um gancho que aceita `OEDP_GATE=aterragem`) | por fazer |
| As capturas em cada passagem | 20 capturas e 100 recortes por passagem, cinco larguras, duas edições (as passagens do V2-e, da EO1 e da HB1 de 20 e 21.10) | uma vez por bloco, na aterragem; a pasta das capturas dentro da pasta do relatório (I251) | regra no prompt comum; a pasta por fazer |
| Os pacotes de leitura com centenas de ficheiros | a leitura da HB1-b: 696 k símbolos; a leitura curta da EO1-e com orçamento: 213 k (a terça parte) | pacote magro (o diff e o que ele toca), orçamento de 60 chamadas, `xhigh` e não `max` | em uso desde 21.10 de manhã |
| A aterragem recusada por preparação da worktree | três aterragens perdidas a 21.10 (sem `node_modules`, sem `dist/`, a cabeça do motor a mudar durante a aterragem) | o pré-voo da aterragem prepara a worktree (`npm ci`, `build`) e lê a cabeça do motor uma vez; o motor aterra e a worktree limpa avança antes de lançar a aterragem do sítio (I250) | por fazer |
| O contexto do lugar de direção | uma sessão de mais de 24 horas, com todos os mandatos e leituras tirados dela | sessões curtas com o estado em ficheiros (`estado.py`, o prompt da sessão seguinte); os factos medidos por guião, não lidos para o contexto | regra no CLAUDE.md |
| Os dois lançamentos de leitura parados em pedidos de permissão | 2 h e 2 h perdidas (20.10 à noite, I247) | as regras «sem cd, caminhos absolutos, um único ficheiro» no prompt comum das leituras | em uso; o prompt comum por mudar |

| As passagens de correção largas que entregam vermelho | HB1-c: três passagens de 115, 112 e 99 chamadas (≈700 k símbolos) ainda vermelhas; EX4: a construção e duas correções (74, 69 e 40 chamadas) com causas escondidas pela cadeia do `build`, que pára na primeira vermelha (21.10) | o lugar de direção corre a lista do `verify` uma a uma sobre o `dist/` da cabeça, lê as causas nos registos e escreve uma passagem com todas (a HB1-c4 a c6: 32, 25 e 16 chamadas; a EX4-c a e: 40, 12 e 27); o guião M99 | regra em vigor à mão desde 21.10; o guião por escrever |
| As aterragens perdidas por preparação da worktree | 21.10: três de manhã (I250) e uma à noite (os `.log` por registar, I253); trinta minutos de corrida do GitHub perdidos no EX4 por uma lista de conferências errada (a do `build` em vez da do `verify`) | o pré-voo da aterragem lista e limpa os `.log` do relatório; a lista do `verify` antes de publicar (M99) | I253 aberta |

## Fechados

(nenhum ainda)
