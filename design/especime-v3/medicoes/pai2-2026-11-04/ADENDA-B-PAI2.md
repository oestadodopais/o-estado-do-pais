# Adenda B ao mandato PAI2: as três conferências do navegador (03.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. O quadro, as contagens (47 medidas por edição), as duas células «sem anterior» e os 54 avisos em 30 páginas estão feitos e comitados (até `a8986c38e`). Ficaram três vermelhos no navegador e paraste no limite das chamadas. Uma passagem só para eles.*

## §1 O cartão (`K1`, `K19`)

O aviso da revisão da fonte é um bloco que o mandato pede dentro do cartão da medida. As réguas do cartão que contam os blocos encodam a mobília do cartão, e mudam de forma com ele (a regra 4):
- passam a aceitar exatamente um aviso, e só no cartão de uma medida com uma divergência por aplicar;
- continuam a recusar qualquer outro bloco a mais.

Plantas: um segundo aviso no mesmo cartão dá vermelho; um aviso num cartão sem divergência dá vermelho; outro bloco qualquer dá vermelho como hoje.

## §2 Os alvos (`H2`)

Diagnosticas a célula H2 da `check:alvos`: que alvo, em que página, com que medida. Corriges a causa na página (um alvo do aviso ou do quadro mais pequeno do que a régua pede, por exemplo), e não a régua. Se a régua encodar mobília que o quadro muda de forma legítima, paras e dizes qual, com a medida.

## §3 A sobreposição

A planta nova da sobreposição falhou na asserção `r.alvos > 0`: não encontrou alvos onde devia. Corriges a planta para que monte o caso que diz montar, e provas que morde (vermelha com a sobreposição plantada, verde sem ela). A régua da sobreposição não afrouxa.

## §4 O fim

O `build` inteiro verde; as conferências do navegador que a PAI2 toca (`cartão`, `alvos`, `sobreposição`, `toque`, `largura`) a 0, com os códigos lidos dos ficheiros; as plantas do §1 e do §3, vermelhas e verdes. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`. Quarenta minutos, sessenta chamadas.
