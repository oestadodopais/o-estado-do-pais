# EV3-I: estado antes do fecho

A alteração das edições guardadas foi comitada em `e50fadb3`. O motor e os recibos do sítio aguardam o fecho. O build não foi lançado.

## Medições

| Documento | Publicador | Ocorrências no texto alojado |
| --- | --- | --- |
| 15.pdf | Presidente da Câmara Municipal de Évora | 1 |
| 22.pdf | Assembleia Municipal de Évora | 3 |
| 29.pdf | Município de Évora | 1 |
| 23.html | Município de Évora | 15 |
| noticias.html | Associação Évora 2027 | 19 |
| concurso-rossio.html | Município de Évora | 15 |

O registo fechado cobre as 51 linhas EV3. O guião `medir-publicadores.py` confirmou os nomes em todas elas. O excerto do PRR está na nova cópia alojada, com recibo do pedido e SHA-256.

A edição guardada portuguesa tinha zero marcas EV3 e a inglesa quatro. O HTML servido pela função alterada tem zero nas duas edições e mantém exatamente o SHA-256 do texto anterior. A conferência posterior no dist aguarda o build.

## Conferências

Formas documentais: 0, com 91 controlos. Composição: 0. Regeneração HTML e registos do motor: 0. Medição das quatro variantes MD e HTML: 0, sem órfãos, atribuições erradas ou asserções falhadas. Prova dos publicadores: 0. Provas das edições antes e depois: 0. check:publicadores: 0. typecheck: 0. Testes de atualização e língua: 0.

## Impedimento de execução

O comitar.sh transmite mensagem, ficheiros e raiz ao escrivão; não transmite OEDP_GATE. O processo do escrivão lança o commit com o seu próprio ambiente. Foi pedido o seu reinício com OEDP_GATE=adiado, para cumprir a instrução desta passagem. O core.gate não foi lançado.

A travessia para o sítio recusou a árvore do motor ainda sem commit. A guarda não foi alterada. Faltam o commit do motor pelo escrivão com o adiamento confirmado, a travessia, as conferências finais, o build e a extração das duas frases do dist.
