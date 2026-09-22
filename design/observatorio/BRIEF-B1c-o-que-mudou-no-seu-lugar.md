# Brief · B1c · «O que mudou» no seu lugar: a primeira página curta, o registo inteiro numa página, cada lugar com o seu

*Escrito pelo lugar de direção (Claude Fable 5.1) a 22.09.2026, a partir da leitura do diretor como leitor da primeira página nesse dia («we have a list of things that were corrected in the front page, and that doesn't seem the right place»). Um bloco pequeno do sítio, na sequência da peça 3 do B1 (§1.117). O construtor é o Claude Opus; a leitura a frio é do Codex. Sem travessões na prosa.*

## 0 · O que se mediu na primeira página no ar (22.09.2026, `main` `83e9df2d`)

«O que mudou» tem 30 linhas datadas, de 12.08.2026 a 21.09.2026: 16 correções de linha, nenhuma de uma medida do país (as verbas do PRR de Évora, a contagem dos estudos sobre Évora, o PIB por habitante do Alentejo); 13 publicações, que são todos os estudos alguma vez publicados, e que a página dos estudos já lista; e 1 mudança declarada do projeto. A página das correções (`/correcoes/`) tem zero linhas datadas: é o canal e a norma, não um registo. Cada linha de correção com marcador repete a definição do marcador por baixo.

## 1 · O teste de aceitação, dito antes

Feito quer dizer: (1) na página do país, «O que mudou» mostra só as mudanças mais recentes, no máximo oito, das três classes que lhe pertencem (as correções das linhas do país, isto é, das medidas de `DOMINIO_DAS_MEDIDAS` e das linhas que a leitura do país usa; os estudos publicados, de qualquer lugar; as mudanças declaradas do projeto), da mais recente para a mais antiga, e uma porta só, «Todas as mudanças», para o registo; (2) a página das correções passa a ser esse registo: todas as mudanças de todas as classes e de todos os lugares, por data, cada linha a dizer o lugar a que pertence (Portugal, Évora, Alentejo, …) com a porta para a página desse lugar, e a norma das correções e o canal a seguir, como estão; (3) cada página de lugar continua com as mudanças das suas próprias linhas e os estudos sobre ele, e ganha o mesmo teto e a mesma porta para o registo; (4) a definição do marcador `[a verificar]` escreve-se uma vez por página, por baixo da lista, e não por baixo de cada linha; (5) o `check:pais` ganha três células: uma linha fora do âmbito da sua página fecha a construção; mais linhas do que o teto fecham; o registo contém todas as linhas do livro-razão inteiro (as correções de kind `correcao` e `atualizacao`, as publicações do registo dos estudos, as mudanças declaradas), nem uma a mais nem uma a menos; cada célula com a sua planta; (6) os três portões a 0 na cabeça final e as capturas da primeira página (390 e 1 280) e do registo (390 e 1 280) nas duas edições.

## 2 · O mandato

| # | o que | a medida |
|---|---|---|
| 1 | O âmbito de cada página escrito numa função só (`src/lib/pais.mjs` ou ao lado): o país, um lugar, o registo | as três listas contadas no `dist` e no relatório |
| 2 | O teto de oito na página do país e nas páginas de lugar, com a porta «Todas as mudanças» | a contagem nas páginas construídas |
| 3 | O registo em `/correcoes/` (e `/en/corrections/`), por data, com o lugar de cada linha e a sua porta; a norma e o canal ficam | a página construída; a contagem igual à do livro-razão inteiro |
| 4 | A definição do marcador uma vez por página | a contagem de definições por página no `dist` |
| 5 | As três células do `check:pais` com plantas | a saída do `--prova` |
| 6 | O inventário das frases, a lista fechada do `check:voz` e o mapa do repositório postos em dia com o rótulo novo («Todas as mudanças») e a página do registo | lido no diff |
| 7 | Relatório curto em `design/especime-v3/medicoes/b1c-<data>/LEIA-ME.md`; as capturas; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de um ficheiro acabado de escrever | os ficheiros `.codigo` ao lado do relatório |

## 3 · O que não se faz

Nenhuma linha de mudança se inventa nem se apaga: o que sai da primeira página fica no registo e nos recibos. Nenhum valor muda. A norma das correções e o canal (o endereço de correio) ficam como estão. Nenhum `push`.

## 4 · As regras de sempre

Worktree própria, `npm ci` uma vez, commits pequenos por caminhos explícitos com os dois trailers contíguos, prosa nova em português sem travessões, o vocabulário do §6 da estrutura (o rótulo da porta é «Todas as mudanças»; o da secção continua «O que mudou»). A regra de paragem: só um portão que proteja um número, uma fonte ou uma pessoa faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta.
